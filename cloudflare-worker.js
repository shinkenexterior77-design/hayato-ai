// Cloudflare Worker / JavaScript (module syntax)
// Secrets: OPENAI_API_KEY, HAYATO_ACCESS_PIN
// Variable: ALLOWED_ORIGIN = https://YOUR-GITHUB-USERNAME.github.io
const persona = `あなたは「ハヤト」。親しみやすく優秀な、頼れる相棒AI。日本語でフランクに、落ち着いて話す。一人称は「俺」。過剰に芝居がかった軍事口調や不必要な長文は避ける。相手の意図を確認し、必要なら分析手順や具体案を提案する。事実・推測・未確認事項を区別し、調べていない最新情報を調べたふりをしない。検索ツールは未接続なのでリアルタイム検索を行ったとは言わない。危険な行為は助長しない。`; 
export default {async fetch(request,env){
 const origin=request.headers.get('Origin')||'';
 const allowed=(env.ALLOWED_ORIGIN||'').replace(/\/$/,'');
 const cors={'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, X-Hayato-Pin','Vary':'Origin'};
 const respond=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8',...(origin===allowed?cors:{})}});
 if(!allowed||origin!==allowed)return respond({error:'許可されていない接続元です'},403);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(request.method!=='POST')return respond({error:'POSTのみ対応'},405);
 if(!env.OPENAI_API_KEY||!env.HAYATO_ACCESS_PIN)return respond({error:'Workerのシークレットが未設定です'},503);
 if(request.headers.get('X-Hayato-Pin')!==env.HAYATO_ACCESS_PIN)return respond({error:'接続PINが違います'},401);
 let data;try{data=await request.json()}catch{return respond({error:'JSON形式が不正です'},400)}
 const message=typeof data.message==='string'?data.message.trim():'';
 if(!message||message.length>2000)return respond({error:'メッセージは1〜2000文字にしてください'},400);
 const history=Array.isArray(data.history)?data.history.slice(-8).filter(x=>x&&['user','assistant'].includes(x.role)&&typeof x.content==='string').map(x=>({role:x.role,content:x.content.slice(0,2000)})):[];
 try{const res=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Authorization':'Bearer '+env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'system',content:persona},...history,{role:'user',content:message}],temperature:0.7,max_tokens:650})});
 const payload=await res.json().catch(()=>({}));if(!res.ok)return respond({error:'AIサービス側でエラーが発生しました（'+res.status+'）。請求設定・利用上限・モデル名を確認してください'},502);
 const reply=payload?.choices?.[0]?.message?.content;if(typeof reply!=='string'||!reply.trim())return respond({error:'AIの応答が空でした'},502);return respond({reply});
 }catch{return respond({error:'AIサービスへの通信に失敗しました'},502)}
 }};
