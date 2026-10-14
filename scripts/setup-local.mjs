import {existsSync,readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {randomBytes} from 'node:crypto';
const run=(args,quiet=false)=>{const result=spawnSync(process.execPath,args,{encoding:'utf8',stdio:quiet?'pipe':'inherit'});if(result.error)throw result.error;if(result.status!==0){if(quiet)console.error(result.stderr||result.stdout);throw new Error('Setup command failed; stop and share the error')}return result.stdout||''};
if(!existsSync('node_modules/wrangler/bin/wrangler.js'))throw new Error('Run pnpm install --frozen-lockfile first');
if(!existsSync('dist/server/wrangler.json'))run(['scripts/run-framework.mjs','build']);
const base=['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','dist/server/wrangler.json','--persist-to','.wrangler/state'];
const raw=run([...base,'--json','--command',"SELECT name FROM sqlite_master WHERE type='table'"],true);
let payload;try{payload=JSON.parse(raw)}catch{throw new Error('Could not read local schema safely. Run the documented migration commands manually.');}
const tables=new Set(payload.flatMap(x=>x.results||[]).map(x=>x.name));
const expected=[['0000_', 'members'],['0001_','kb_records'],['0002_','kb_accounts']];
for(const [prefix,table] of expected){if(tables.has(table)){console.log('Already configured:',table);continue}const file=readdirSync('drizzle').find(x=>x.startsWith(prefix)&&x.endsWith('.sql'));if(!file)throw new Error('Migration missing: '+prefix);run([...base,'--file','drizzle/'+file]);}
const path='.dev.vars';let vars=existsSync(path)?readFileSync(path,'utf8'):'';let key=vars.match(/^KITCHENBOX_BOOTSTRAP_TOKEN\s*=\s*(.+)$/m)?.[1]?.trim();
if(!key){key=randomBytes(32).toString('hex');vars=vars.replace(/^KITCHENBOX_BOOTSTRAP_TOKEN\s*=.*\r?\n?/gm,'');vars+='\nKITCHENBOX_BOOTSTRAP_TOKEN='+key+'\n';writeFileSync(path,vars,{mode:0o600})}
console.log('\nLocal database ready. No demo meals, orders or default password created.');
console.log('Start with: pnpm run dev');
console.log('Open Team workspace -> create your first admin with your own email/password.');
console.log('Private first-owner setup key (do not share or commit):\n'+key+'\n');
