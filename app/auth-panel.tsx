'use client';
import {useState} from 'react';
import {ArrowRight,Eye,EyeOff,ShieldCheck,Loader2,X} from 'lucide-react';
type Any=any;
export default function AuthPanel({mode,info,token,onDone,onClose}:Any){
 const [form,setForm]=useState({name:'',email:'',password:'',repeat:'',current:'',key:''}),[show,setShow]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');const signup=['bootstrap','activate','password'].includes(mode);
 async function submit(e:Any){e.preventDefault();if(signup&&form.password!==form.repeat){setError('Passwords do not match');return}setBusy(true);setError('');try{const response=await fetch('/api/auth/'+mode,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,token})});const data:Any=await response.json();if(!response.ok)throw Error(data.error);onDone()}catch(e:Any){setError(e.message)}finally{setBusy(false)}}
 const input=(key:keyof typeof form,label:string,type='text')=><label>{label}<input required type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} autoComplete={key==='email'?'username':key==='current'?'current-password':key==='password'?signup?'new-password':'current-password':'off'} minLength={key==='password'&&signup?12:undefined}/></label>;
 return <div className="auth-surface"><div className="auth-illustration"><img src="/images/kitchen.webp" alt="Home-style lunch cooking"/><div><span>HOME FOOD, HAPPY YOU</span><h2>Good lunch.<br/>A great team.</h2><p>Your KitchenBox workday starts here.</p></div></div><form className="auth-form" onSubmit={submit}><div className="auth-top"><ShieldCheck size={25}/>{onClose&&<button type="button" onClick={onClose} aria-label="Close"><X size={20}/></button>}</div><span className="eyebrow">KITCHENBOX TEAM</span><h2>{mode==='bootstrap'?'Make it yours.':mode==='activate'?'Welcome to the team.':mode==='password'?'A fresh password.':'Welcome back.'}</h2><p>{mode==='bootstrap'?'Create the first administrator account. No default password.':mode==='activate'?'Set your own password using your administrator’s private invitation.':mode==='password'?'Confirm your current password. Other sessions will be signed out.':'Sign in to your role’s workspace.'}</p>
 {mode==='bootstrap'&&input('name','Your name')}
 {mode==='bootstrap'&&!info?.ownerSetup&&input('key','First-owner setup key','password')}
 {mode!=='password'&&input('email','Account email','email')}
 {mode==='password'&&input('current','Current password','password')}
 <label>{signup?'New password':'Password'}<div className="password-input"><input required type={show?'text':'password'} autoComplete={signup?'new-password':'current-password'} value={form.password} minLength={signup?12:undefined} onChange={e=>setForm({...form,password:e.target.value})}/><button type="button" aria-label={show?'Hide password':'Show password'} onClick={()=>setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
 {signup&&input('repeat','Repeat new password','password')}
 {signup&&<small>At least 12 characters. Passwords are stored as hashes.</small>}
 {info?.error&&<div className="auth-error" role="alert">{info.error}</div>}{error&&<div className="auth-error" role="alert">{error}</div>}
 <button className="primary wide" disabled={busy}>{busy?<><Loader2 className="spin" size={17}/> Please wait</>:<>{mode==='login'?'Sign in':mode==='password'?'Update password':'Create account'}<ArrowRight size={17}/></>}</button>
 {!signup&&<small>Forgot your password? Ask your administrator for a new activation link.</small>}
 {mode==='bootstrap'&&!info?.ownerSetup&&<small>Run setup-local.bat to create local tables and your setup key. For hosting, configure the key as a server secret.</small>}
 </form></div>
}
