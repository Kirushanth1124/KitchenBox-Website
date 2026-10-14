import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
export type Member={id:string,email:string,name:string,role:string,scope:string,phone:string,optin:number};
export const database=()=>{if(!env.DB)throw new Error('Database unavailable');return env.DB;};
export const uid=()=>crypto.randomUUID();
export const now=()=>new Date().toISOString();
export const query=async(sql:string,...args:any[])=>{const r=await database().prepare(sql).bind(...args).all();return r.results as any[];};
export async function identity(){const u=await getChatGPTUser();if(!u)throw new Error('Sign in required');return u;}
export async function member(){const u=await identity();const m=(await query('SELECT * FROM members WHERE id=?',u.userId))[0];if(!m)throw new Error('Workspace setup required');return m as Member;}
export function allow(m:Member,roles:string[]){if(m.role!=='admin'&&!roles.includes(m.role))throw new Error('Permission denied');}
export async function owns(m:Member,id:string){const o=(await query('SELECT * FROM orders WHERE id=?',id))[0];if(!o)throw new Error('Order not found');if(m.role==='admin'||o.customer===m.id||(m.role==='driver'&&o.driver===m.id)||(m.role==='supplier'&&(await query('SELECT id FROM items WHERE order_id=? AND supplier=?',id,m.scope)).length))return o;throw new Error('Permission denied');}
export const audit=(id:string,m:Member,action:string)=>database().prepare('INSERT INTO activity(id,order_id,actor,action,created) VALUES(?,?,?,?,?)').bind(uid(),id,m.name,action,now());
export async function notify(id:string,body:string){
 const o=(await query('SELECT * FROM orders WHERE id=?',id))[0];if(!o)return;
 const team=await query("SELECT * FROM members WHERE optin=1 AND phone<>'' AND (role='admin' OR (role='driver' AND id=?) OR (role='supplier' AND scope IN (SELECT supplier FROM items WHERE order_id=?)))",o.driver,id);
 const recipients=new Set(team.map(x=>x.phone));if(o.optin)recipients.add(o.phone);
 if(recipients.size)await database().batch([...recipients].map(phone=>database().prepare('INSERT INTO outbox(id,order_id,recipient,body,status,created) VALUES(?,?,?,?,?,?)').bind(uid(),id,phone,body,'preview',now())));
}
