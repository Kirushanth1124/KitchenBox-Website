import {existsSync,readFileSync,cpSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const source=path.resolve(fileURLToPath(new URL('../',import.meta.url))),target=path.resolve(process.argv[2]||'');
if(!process.argv[2]||source===target)throw new Error('Provide a DIFFERENT existing KitchenBox project folder');
if(!existsSync(path.join(target,'lib/operations.ts'))||!readFileSync(path.join(target,'lib/operations.ts'),'utf8').includes('09:20'))throw new Error('Target is not the expected existing KitchenBox project');
if(!existsSync(path.join(source,'SOURCE_MANIFEST.json')))throw new Error('Use this helper from the downloaded source ZIP');
const backup=target+'_backup_'+new Date().toISOString().replace(/[:.]/g,'-');
cpSync(target,backup,{recursive:true,filter:(p)=>!['node_modules','.git','.sites-runtime','.vinext','dist','.next'].includes(path.basename(p))});
const manifest=JSON.parse(readFileSync(path.join(source,'SOURCE_MANIFEST.json'),'utf8'));
for(const name of manifest.included_files){if(name.startsWith('.')&&!['.gitignore','.dev.vars.example','.openai/hosting.json'].includes(name))continue;if(/(^|\/)(node_modules|\.wrangler|\.git|\.sites-runtime)(\/|$)/.test(name)||name==='.dev.vars'||name.startsWith('.env'))continue;const from=path.join(source,name),to=path.join(target,name);if(!existsSync(from))continue;mkdirSync(path.dirname(to),{recursive:true});cpSync(from,to,{recursive:true});}
console.log('Backup saved:',backup);console.log('Source updated:',target);console.log('Existing .wrangler database, .dev.vars secrets and node_modules were retained.');console.log('Next: pnpm install --frozen-lockfile -> pnpm run build -> setup-local.bat -> start.bat');
