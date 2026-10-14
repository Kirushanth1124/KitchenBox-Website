import {hash,compare} from 'bcryptjs';
import {createHash,randomBytes,timingSafeEqual} from 'node:crypto';
export function emailValue(value:unknown){const email=String(value||'').trim().toLowerCase();if(email.length>254||! /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))throw new Error('Enter a valid email');return email;}
export function passwordValue(value:unknown){const password=String(value||'');if(password.length<12||Buffer.byteLength(password,'utf8')>72||password.includes('\0'))throw new Error('Use a password of at least 12 characters, maximum 72 UTF-8 bytes');return password;}
export const passwordHash=(value:unknown)=>hash(passwordValue(value),12);
export const passwordMatches=(value:unknown,stored:string)=>compare(String(value||''),stored);
export const randomToken=()=>randomBytes(32).toString('hex');
export const tokenHash=(value:string)=>createHash('sha256').update(value).digest('hex');
export const secureEqual=(a:string,b:string)=>timingSafeEqual(Buffer.from(tokenHash(a)),Buffer.from(tokenHash(b)));
