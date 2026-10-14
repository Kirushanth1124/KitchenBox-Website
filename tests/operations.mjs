import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=ts.transpileModule(readFileSync('lib/operations.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {apply,localTime}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const admin={id:'owner',role:'admin'},vendor={id:'vuser',role:'supplier',scope:'V1'},rider={id:'R1',role:'driver'};
const early=new Date('2026-10-13T03:00:00Z'),cutoff=new Date('2026-10-13T03:50:00Z'),cancelCutoff=new Date('2026-10-13T04:00:00Z');
let records=[{id:'settings',kind:'settings',deliveryFee:100,bulkQty:10,advancePercent:30,serviceAreas:[]},{id:'V1',kind:'vendor',name:'Kitchen A',active:true},{id:'V2',kind:'vendor',name:'Kitchen B',active:true},{id:'M1',kind:'meal',name:'Rice',price:650,active:true},{id:'M2',kind:'meal',name:'Veg',price:480,active:true},{id:'O1',kind:'offer',meal:'M1',vendor:'V1',day:'2026-10-13',approved:true,active:true,qty:10,cost:400,readyTime:'10:30',receivedQty:0},{id:'O2',kind:'offer',meal:'M2',vendor:'V2',day:'2026-10-13',approved:true,active:true,qty:10,cost:300,readyTime:'11:00',receivedQty:0},{id:'C1',kind:'customer',name:'Customer',phone:'94771234567',address:'Nallur',trustedBulk:false,codLimit:0},{id:'R1',kind:'staff',role:'driver',active:true,name:'Rider',phone:'94770000000',vehicle:'Bike',capacity:3}];
let passed=0;
function run(cmd,b={},actor=admin,clock=early){const out=apply(records,actor,cmd,b,clock);for(const r of out.changes){const i=records.findIndex(x=>x.id===r.id);if(i>=0)records[i]=r;else records.push(r)}passed++;return out.result}
function rejected(cmd,b={},actor=admin,clock=early){assert.throws(()=>apply(records,actor,cmd,b,clock));passed++}
const request={customer:'C1',customerPhone:'94771234567',day:'2026-10-13',items:[{meal:'M1',qty:1},{meal:'M2',qty:1}],address:'Nallur',optin:true,key:'first'};
const {id}=run('order-create',request);assert.equal(records.find(x=>x.id===id).total,1230);assert.equal(records.find(x=>x.id===id).items.length,2);
assert.equal(run('order-create',request,admin,cutoff).id,id); // timely order survives late retry
rejected('order-create',{...request,key:'late'},admin,cutoff);
rejected('order-edit',{...request,id},admin,cutoff);
rejected('order-cancel',{id,reason:'plans changed'},admin,cancelCutoff);
rejected('confirm',{id},vendor);
run('confirm',{id});rejected('pack',{id});
run('receive',{id:'O1',receivedQty:1,note:'Counted'});rejected('pack',{id});
run('receive',{id:'O2',receivedQty:1,note:'Counted'});run('pack',{id});
rejected('route',{driver:'R1',orders:[id],eta:'12:00',name:'Nallur'},rider);
const before=records.length;run('route',{driver:'R1',orders:[id],eta:'12:00',name:'Nallur'});const route=records.slice(before).find(x=>x.kind==='route');
rejected('pickup',{id:route.id},{id:'OTHER',role:'driver'});run('pickup',{id:route.id},rider);
run('delivery',{id,status:'arrived',note:'At entrance',cash:0},rider);
rejected('delivery',{id,status:'delivered',note:'Received',cash:1300},rider);
run('delivery',{id,status:'delivered',note:'Customer received',cash:1230},rider);run('reconcile',{id,reference:'Cash receipt'});
rejected('order-cancel',{id,reason:'cancel'},admin,early);
run('feedback',{order:id,body:'Nice lunch',type:'feedback',rating:0});assert.equal(records.find(x=>x.kind==='feedback').rating,0);
const second=run('order-create',{...request,key:'second',items:[{meal:'M1',qty:1}]});run('order-cancel',{id:second.id,reason:'Plans changed'});
rejected('order-create',{...request,key:'oversold',items:[{meal:'M1',qty:11}]});
const bulk=run('order-create',{...request,key:'bulk',items:[{meal:'M1',qty:9},{meal:'M2',qty:1}]});assert.equal(records.find(x=>x.id===bulk.id).status,'pending_advance');rejected('confirm',{id:bulk.id});
run('order-cancel',{id:bulk.id,reason:'Customer changed plans'});
run('customer',{id:'C1',name:'Customer',phone:'94771234567',address:'Saved NEW address',trustedBulk:true,codLimit:0});assert.equal(records.find(x=>x.id===id).address,'Nallur');
const trusted=run('order-create',{...request,key:'trusted',items:[{meal:'M1',qty:9},{meal:'M2',qty:1}]});assert.equal(records.find(x=>x.id===trusted.id).advanceRequired,0);
const registration=run('customer-register',{name:'Customer',phone:'94771234567',address:'Suggested address',trustedBulk:false},{id:'wa',role:'integration'});assert.equal(registration.customerId,'C1');assert.equal(records.find(x=>x.id==='C1').trustedBulk,true);
rejected('offer',{vendor:'V2',meal:'M1',day:'2026-10-14',readyTime:'11:00',qty:2,cost:100},vendor);
assert.equal(localTime(cutoff).time,'09:20:00');assert.equal(localTime(cancelCutoff).time,'09:30:00');
console.log(`${passed} business scenarios passed: cutoff, idempotency, allocation, packing, permissions, COD, saved details and bulk exemption.`);
