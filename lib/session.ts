import {cookies} from 'next/headers';
import {database,query} from './server';
import {tokenHash,randomToken} from './passwords';
export const SESSION_COOKIE='kb_session';
export async function sessionAccount(){const jar=await cookies();const value=jar.get(SESSION_COOKIE)?.value;if(!value)return null;const account=(await query('SELECT a.id,a.email,a.staff_id,s.expires FROM kb_sessions s JOIN kb_accounts a ON a.id=s.account_id WHERE s.token_hash=? AND s.expires>?',tokenHash(value),Date.now()))[0];return account||null;}
export async function makeSession(accountId:string){const token=randomToken();const expires=Date.now()+7*86400000;await database().prepare('INSERT INTO kb_sessions(token_hash,account_id,expires,created) VALUES(?,?,?,?)').bind(tokenHash(token),accountId,expires,new Date().toISOString()).run();return token;}
export function sessionCookie(token:string,url:string,remove=false){return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${remove?0:604800}${new URL(url).protocol==='https:'?'; Secure':''}`;}
