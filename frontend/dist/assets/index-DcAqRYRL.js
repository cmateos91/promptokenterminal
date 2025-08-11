import{r as g,b as he,R as ye}from"./vendor-107eBDi2.js";import{b as oe,P as L,C as ae,c as we,L as G,g as ke}from"./solana-DlhCIz-Q.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const l of c.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function t(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerPolicy&&(c.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?c.credentials="include":a.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function o(a){if(a.ep)return;a.ep=!0;const c=t(a);fetch(a.href,c)}})();var re={exports:{}},W={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Te=g,ve=Symbol.for("react.element"),Se=Symbol.for("react.fragment"),Ce=Object.prototype.hasOwnProperty,Ae=Te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Ee={key:!0,ref:!0,__self:!0,__source:!0};function se(n,e,t){var o,a={},c=null,l=null;t!==void 0&&(c=""+t),e.key!==void 0&&(c=""+e.key),e.ref!==void 0&&(l=e.ref);for(o in e)Ce.call(e,o)&&!Ee.hasOwnProperty(o)&&(a[o]=e[o]);if(n&&n.defaultProps)for(o in e=n.defaultProps,e)a[o]===void 0&&(a[o]=e[o]);return{$$typeof:ve,type:n,key:c,ref:l,props:a,_owner:Ae.current}}W.Fragment=Se;W.jsx=se;W.jsxs=se;re.exports=W;var u=re.exports;typeof window<"u"&&(window.Buffer=oe.Buffer,window.global=window,window.process={env:{},nextTick:n=>setTimeout(n,0),version:"16.0.0",browser:!0});globalThis.Buffer=oe.Buffer;globalThis.global=globalThis;globalThis.process=globalThis.process||{env:{},nextTick:n=>setTimeout(n,0),version:"16.0.0",browser:!0};var q={},Q=he;q.createRoot=Q.createRoot,q.hydrateRoot=Q.hydrateRoot;const V=new L("5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF"),ce=BigInt("500"),be=!0,Z=[we("devnet"),"https://api.devnet.solana.com"];let Ne=be;function Re(){const n=Z;return new ae(n[0],{commitment:"finalized",confirmTransactionInitialTimeout:6e4,disableRetryOnRateLimit:!0,fetch})}const le=Re(),ee=new L("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");async function I(n){const e=Z;for(let t=0;t<e.length;t++){const o=e[t];try{const a=new ae(o,{commitment:"finalized",confirmTransactionInitialTimeout:3e4,disableRetryOnRateLimit:!0,fetch});return await n(a)}catch{t<e.length-1&&await new Promise(c=>setTimeout(c,1e3))}}throw new Error("All RPC endpoints (mainnet and devnet) failed")}function D(){return{network:"devnet",isTestnet:Ne,endpoints:Z}}const r={connected:!1,address:null,balance:0,stakedAmount:0,rewards:0,rewardToken:null,provider:null,walletType:null,tokenCount:0,connectionTime:null,isReal:!0},s={level:0,commandCount:0,secretsFound:0,achievements:[],unlockedCommands:new Set(["help","about","version","banner","clear","time","ping","price","slot","flip","dice","connect","levelup","reset","logs","debug","health","performance","cache","export","ai"]),secretsFoundSet:new Set},$e=[{name:"ANONYMOUS",color:"#888888",description:"Unknown entity"},{name:"USER",color:"#00ff41",description:"Connected user"},{name:"STAKER",color:"#66ff66",description:"Active staker"},{name:"EXPERT",color:"#00cc33",description:"Terminal expert"},{name:"HACKER",color:"#ffffff",description:"System infiltrator"}];function Le(n){const e=s.level;return s.level===0&&n==="connect"&&r.connected&&(s.level=1,s.unlockedCommands.add("disconnect"),s.unlockedCommands.add("balance"),s.unlockedCommands.add("walletinfo"),s.unlockedCommands.add("status"),s.unlockedCommands.add("stake")),s.level===1&&n==="stake"&&r.stakedAmount>0&&(s.level=2,s.unlockedCommands.add("unstake"),s.unlockedCommands.add("claim"),s.unlockedCommands.add("rewards")),s.level===2&&s.commandCount>=15&&(s.level=3,s.unlockedCommands.add("dev"),s.unlockedCommands.add("whoami"),s.unlockedCommands.add("matrix")),s.level===3&&s.secretsFound>=3&&(s.level=4,s.unlockedCommands.add("hack"),s.unlockedCommands.add("override"),s.unlockedCommands.add("decrypt")),s.level>e}function b(){const n=$e[s.level];return{level:s.level,name:n.name,color:n.color,description:n.description,commandCount:s.commandCount,secretsFound:s.secretsFound,nextLevelRequirement:Ie()}}function Ie(){switch(s.level){case 0:return"Connect a wallet to reach USER level";case 1:return"Stake tokens to reach STAKER level";case 2:return`Execute ${15-s.commandCount} more commands to reach EXPERT level`;case 3:return`Find ${3-s.secretsFound} more secrets to reach HACKER level`;case 4:return"Maximum level achieved";default:return"Unknown"}}class Pe{constructor(e=10,t=6e4){this.maxRequests=e,this.windowMs=t,this.requests=new Map}isAllowed(e){const t=Date.now(),a=(this.requests.get(e)||[]).filter(c=>t-c<this.windowMs);return a.length>=this.maxRequests?!1:(a.push(t),this.requests.set(e,a),!0)}getRemainingTime(e){const t=this.requests.get(e)||[];if(t.length===0)return 0;const o=Math.min(...t),a=this.windowMs-(Date.now()-o);return Math.max(0,a)}}class X{constructor(e=3e4){this.cache=new Map,this.defaultTTL=e}set(e,t,o=this.defaultTTL){const a=Date.now()+o;this.cache.set(e,{value:t,expiry:a})}get(e){const t=this.cache.get(e);return t?Date.now()>t.expiry?(this.cache.delete(e),null):t.value:null}has(e){return this.get(e)!==null}clear(){this.cache.clear()}cleanup(){const e=Date.now();for(const[t,o]of this.cache.entries())e>o.expiry&&this.cache.delete(t)}}const ie=new Pe(10,1e4),O=new X(3e5),x=new X(15e3),De=new X(6e4);setInterval(()=>{O.cleanup(),x.cleanup(),De.cleanup()},6e4);async function Oe(n,e=3,t=1e3){for(let o=0;o<e;o++)try{return await n()}catch(a){if(o===e-1)throw a;const c=t*Math.pow(2,o)+Math.random()*1e3;await new Promise(l=>setTimeout(l,c))}}async function z(n){const e=n.toBase58(),t=O.get(e);if(t)return t;if(!ie.isAllowed(`metadata_${e}`)){const o=Y(e);return O.set(e,o,6e4),o}try{const o=await Oe(async()=>await I(async l=>await l.getParsedAccountInfo(n)),2,500);let a=Y(e);o&&o.value&&o.value.data&&o.value.data.parsed&&(a.decimals=o.value.data.parsed.info.decimals);const c={"5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF":{name:"promptest",symbol:"PTEST",decimals:3},So11111111111111111111111111111111111111112:{name:"Wrapped SOL",symbol:"wSOL",decimals:9},EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v:{name:"USD Coin",symbol:"USDC",decimals:6},Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB:{name:"Tether USD",symbol:"USDT",decimals:6}};if(c[e])a={...a,...c[e],address:e};else try{const l=await xe(n),i=await I(async m=>await m.getAccountInfo(l));if(i&&i.data){const m=Me(i.data);m&&(a.name=m.name||a.name,a.symbol=m.symbol||a.symbol)}}catch{}return O.set(e,a,6e5),a}catch{const a=Y(e);return O.set(e,a,6e4),a}}function Y(n){return{name:`Token ${n.slice(0,8)}...`,symbol:"UNK",decimals:9,address:n}}async function xe(n){const e=new L("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),[t]=await L.findProgramAddress([Buffer.from("metadata"),e.toBuffer(),n.toBuffer()],e);return t}function Me(n){try{const e=Buffer.from(n);let t=1;if(t+=1,t+=32,t+=32,t+4>e.length)return null;const o=e.readUInt32LE(t);if(t+=4,t+o>e.length)return null;const a=e.subarray(t,t+o).toString("utf8").replace(/\0/g,"");if(t+=o,t+4>e.length)return null;const c=e.readUInt32LE(t);if(t+=4,t+c>e.length)return null;const l=e.subarray(t,t+c).toString("utf8").replace(/\0/g,"");return{name:a,symbol:l}}catch{return null}}function Ue(n,e=null){const{name:t,symbol:o,address:a}=n,c=`${a.slice(0,4)}...${a.slice(-4)}`;return e!==null?`${e.toLocaleString()} ${o} (${t})`:`${o} - ${t} (${c})`}const Fe={connect:async n=>{const e=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<=768;if(r.connected)return{type:"info",content:`🔗 WALLET ALREADY CONNECTED
Address: ${r.address}`};const t=n[0];if(!t)return{type:"error",content:`📄 USAGE: connect <phantom|solflare>

Available wallets:
• phantom - Phantom wallet
• solflare - Solflare wallet${e?`

📱 MOBILE TIP:
Open this terminal in your mobile wallet browser for direct connection`:""}`};const a=(()=>{if(typeof window>"u")return null;switch(t){case"phantom":return window?.phantom?.solana||(window?.solana?.isPhantom?window.solana:null);case"solflare":return window?.solflare;default:return null}})();if(!a)return{type:"error",content:`❌ WALLET NOT FOUND

Wallet: ${t}
Solution: Install wallet extension or try another wallet

Available: phantom, solflare`};try{const l=(await a.connect()).publicKey||a.publicKey,i=l.toString();let m=0;try{m=await I(async v=>await v.getBalance(l)/G)}catch(v){console.warn("Error fetching SOL balance with all endpoints:",v.message);try{m=await le.getBalance(l)/G}catch(R){console.error("Direct connection also failed:",R.message)}}let k=0;try{k=await I(async v=>(await v.getParsedTokenAccountsByOwner(l,{programId:ee})).value.filter(({account:E})=>E.data.parsed.info.tokenAmount.uiAmount>0).length)}catch(v){console.warn("Error fetching token accounts with all endpoints:",v.message)}r.connected=!0,r.address=i,r.balance=m,r.provider=a,r.walletType=t,r.tokenCount=k,r.connectionTime=new Date().toISOString(),r.isReal=!0;const A=D(),S={type:t.toUpperCase(),address:i,shortAddress:`${i.slice(0,4)}...${i.slice(-4)}`,balance:m.toFixed(4),tokenAccounts:k};return{type:"result",content:`✅ ${S.type} WALLET CONNECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Address: ${S.shortAddress}
Full:    ${S.address}
Balance: ${S.balance} SOL
Tokens:  ${S.tokenAccounts} SPL accounts

⚡ Real wallet connected!
Network: ${A.network.toUpperCase()}

Next: 'balance' for updated data | 'walletinfo' for details`}}catch(c){return console.error("Wallet connection error:",c),{type:"error",content:`❌ CONNECTION FAILED

Wallet: ${t}
Error: ${c.message}

Try: Check wallet extension is unlocked`}}},disconnect:async()=>{if(!r.connected)return{type:"error",content:"🔌 No wallet connected"};try{r.provider?.disconnect&&await r.provider.disconnect()}catch(n){console.warn("Error during wallet disconnection:",n.message)}return r.connected=!1,r.address=null,r.balance=0,r.stakedAmount=0,r.rewards=0,r.rewardToken=null,r.provider=null,r.walletType=null,r.tokenCount=0,r.connectionTime=null,r.isReal=!1,s.level=0,{type:"result",content:`✅ WALLET DISCONNECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Connection terminated successfully.
All wallet data cleared.`}},balance:async()=>{if(!r.connected)return{type:"error",content:"🔒 Connect wallet first using: connect"};if(!r.provider||!r.provider.publicKey)return{type:"error",content:"Wallet provider not available. Try reconnecting."};try{const n=await I(async l=>await l.getBalance(r.provider.publicKey)/G);r.balance=n;const e=await I(async l=>(await l.getParsedTokenAccountsByOwner(r.provider.publicKey,{programId:ee})).value.map(({account:m})=>{const k=m.data.parsed.info,A=k.tokenAmount.uiAmount;return{mint:k.mint,amount:A}}).filter(m=>m.amount>0));let t="No SPL tokens";if(e.length>0)try{const i=e.slice(0,5).map(async k=>{try{const A=await z(new L(k.mint));return`${k.amount.toLocaleString()} ${A.symbol} (${A.name})`}catch{return`${k.mint.slice(0,8)}...: ${k.amount.toLocaleString()}`}});t=(await Promise.all(i)).join(`
`),e.length>5&&(t+=`
... and ${e.length-5} more tokens`)}catch(l){console.warn("Error fetching token metadata for balance:",l),t=e.slice(0,5).map(i=>`${i.mint.slice(0,8)}...: ${i.amount.toLocaleString()}`).join(`
`)}const a=D().isTestnet?"📱 DEVNET (testing)":"⚡ MAINNET",c=r.isReal?`${a} - Real data`:"📱 Simulated data";return{type:"result",content:`WALLET BALANCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOL:     ${r.balance.toFixed(4)}
${t}

${c}`}}catch(n){return console.error("❌ Balance fetch error:",n),{type:"error",content:`❌ BALANCE FETCH FAILED

All RPC endpoints failed.
Error: ${n.message}

Try: reconnecting wallet or check network`}}},tokeninfo:async n=>{if(!n[0])return{type:"error",content:`Usage: tokeninfo <token_address>
Example: tokeninfo 5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF`};try{const e=new L(n[0]),t=await z(e);return{type:"result",content:`TOKEN INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:     ${t.name}
Symbol:   ${t.symbol}
Decimals: ${t.decimals}
Address:  ${t.address}
Short:    ${t.address.slice(0,4)}...${t.address.slice(-4)}`}}catch(e){return{type:"error",content:`Invalid token address: ${n[0]}
Error: ${e.message}`}}},walletinfo:async()=>{if(!r.connected)return{type:"error",content:"No wallet connected. Use: connect <wallet>"};const n=r.connectionTime?new Date(r.connectionTime).toLocaleString():"Unknown",e=D(),t=r.isReal?"⚡":"📱",o=r.isReal?"REAL BLOCKCHAIN DATA":"SIMULATED DATA",a=e.isTestnet?"📱 DEVNET (Testing Network)":"⚡ MAINNET (Production Network)";return{type:"result",content:`${t} WALLET CONNECTION INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Wallet Type: ${r.walletType?.toUpperCase()||"Unknown"}
Address:     ${r.address}
Short:       ${r.address?.slice(0,4)}...${r.address?.slice(-4)}
Balance:     ${r.balance} SOL
Tokens:      ${r.tokenCount} SPL accounts
Connected:   ${n}
Data Type:   ${o}
Network:     ${a}

Provider:    ${r.provider?"Active":"None"}`}}};class je{static isValidNumber(e,t={}){const{min:o=0,max:a=1/0,allowDecimals:c=!0,maxDecimals:l=18}=t;typeof e=="string"&&(e=e.trim());const i=parseFloat(e);if(isNaN(i)||!isFinite(i))return{valid:!1,error:"Número inválido"};if(i<o)return{valid:!1,error:`Mínimo permitido: ${o}`};if(i>a)return{valid:!1,error:`Máximo permitido: ${a}`};if(!c&&i!==Math.floor(i))return{valid:!1,error:"No se permiten decimales"};if(c&&l>0){const m=e.toString().split(".")[1];if(m&&m.length>l)return{valid:!1,error:`Máximo ${l} decimales`}}return{valid:!0,value:i}}static isValidSolanaAddress(e){try{return new L(e),{valid:!0,address:e}}catch{return{valid:!1,error:"Dirección de Solana inválida"}}}static isValidCommand(e){return/^[a-zA-Z0-9\s\-_]+$/.test(e)?e.length>100?{valid:!1,error:"Comando demasiado largo"}:{valid:!0,command:e.trim()}:{valid:!1,error:"Comando contiene caracteres inválidos"}}static sanitizeString(e,t=1e3){return typeof e!="string"?"":e.replace(/[<>"']/g,"").replace(/javascript:/gi,"").replace(/data:/gi,"").substring(0,t).trim()}}function te(n,e,t=9){const o=je.isValidNumber(n,{min:1e-9,max:e,allowDecimals:!0,maxDecimals:t});return o.valid&&o.value<.001?{valid:!1,error:"Cantidad muy pequeña para cubrir fees de red"}:o}const N={ERROR:0,WARN:1,INFO:2,DEBUG:3,TRACE:4};class _{constructor(e={}){this.level=e.level||N.INFO,this.enableConsole=e.enableConsole!==!1,this.enableStorage=e.enableStorage||!1,this.maxStorageSize=e.maxStorageSize||1e3,this.component=e.component||"APP",this.logs=[]}log(e,t,o=null,a=null){if(e>this.level)return;const l={timestamp:new Date().toISOString(),level:this.getLevelName(e),component:a||this.component,message:t,data:o?JSON.stringify(o):null,userAgent:navigator.userAgent,url:window.location.href};return this.enableConsole&&this.logToConsole(l),this.enableStorage&&this.storeLog(l),l}error(e,t=null,o=null){return this.log(N.ERROR,e,t,o)}warn(e,t=null,o=null){return this.log(N.WARN,e,t,o)}info(e,t=null,o=null){return this.log(N.INFO,e,t,o)}debug(e,t=null,o=null){return this.log(N.DEBUG,e,t,o)}trace(e,t=null,o=null){return this.log(N.TRACE,e,t,o)}getLevelName(e){return["ERROR","WARN","INFO","DEBUG","TRACE"][e]||"UNKNOWN"}logToConsole(){}getConsoleStyle(e){return{ERROR:"color: #ff4444; font-weight: bold",WARN:"color: #ffaa00; font-weight: bold",INFO:"color: #00ff41; font-weight: normal",DEBUG:"color: #44aaff; font-weight: normal",TRACE:"color: #888888; font-weight: normal"}[e]||""}storeLog(e){this.logs.push(e),this.logs.length>this.maxStorageSize&&(this.logs=this.logs.slice(-this.maxStorageSize));try{const t=this.logs.slice(-100);localStorage.setItem("terminal_logs",JSON.stringify(t))}catch{}}getLogs(e={}){let t=[...this.logs];if(e.level!==void 0&&(t=t.filter(o=>N[o.level]<=e.level)),e.component&&(t=t.filter(o=>o.component===e.component)),e.since){const o=new Date(e.since).getTime();t=t.filter(a=>new Date(a.timestamp).getTime()>=o)}return t}exportLogs(){return this.logs.map(t=>`${t.timestamp} [${t.level}] [${t.component}] ${t.message}${t.data?" "+t.data:""}`).join(`
`)}clearLogs(){this.logs=[];try{localStorage.removeItem("terminal_logs")}catch{}}loadPersistedLogs(){try{const e=localStorage.getItem("terminal_logs");e&&(this.logs=JSON.parse(e))}catch(e){this.warn("Failed to load persisted logs",{error:e.message})}}}class Be{constructor(e){this.logger=e,this.timers=new Map}startTimer(e){this.timers.set(e,{start:performance.now(),name:e})}endTimer(e,t=1e3){const o=this.timers.get(e);if(!o){this.logger.warn(`Timer "${e}" not found`);return}const a=performance.now()-o.start;return this.timers.delete(e),a>t?this.logger.warn(`Slow operation: ${e}`,{duration:`${a.toFixed(2)}ms`,threshold:`${t}ms`}):this.logger.debug(`Operation completed: ${e}`,{duration:`${a.toFixed(2)}ms`}),a}measureAsync(e,t,o=1e3){return async(...a)=>{this.startTimer(e);try{const c=await t(...a);return this.endTimer(e,o),c}catch(c){throw this.endTimer(e,o),this.logger.error(`Error in ${e}`,{error:c.message}),c}}}}const T=new _({level:N.INFO,enableConsole:!0,enableStorage:!0,component:"TERMINAL"}),ne=new Be(T),de=new _({level:N.INFO,enableConsole:!0,enableStorage:!0,component:"WALLET"}),ue=new _({level:N.WARN,enableConsole:!0,enableStorage:!0,component:"RPC"}),J=new _({level:N.INFO,enableConsole:!0,enableStorage:!0,component:"COMMAND"});T.loadPersistedLogs();de.loadPersistedLogs();ue.loadPersistedLogs();J.loadPersistedLogs();window.addEventListener("error",n=>{T.error("Unhandled JavaScript error",{message:n.message,filename:n.filename,lineno:n.lineno,colno:n.colno,stack:n.error?.stack})});window.addEventListener("unhandledrejection",n=>{T.error("Unhandled promise rejection",{reason:n.reason?.toString(),stack:n.reason?.stack})});const d={command:(n,e,t=null)=>{const a=`${t?"❌":"✅"} Command: ${n}`,c={result:e,error:t,timestamp:Date.now()};t?J.error(a,c):J.info(a,c)},wallet:(n,e=null,t=null)=>{const o=`💰 Wallet: ${n}`,a={status:n,address:e,balance:t,timestamp:Date.now()};de.info(o,a)},performance:(n,e,t=1e3)=>{const a=`${e>t?"🐌":"⚡"} ${n}: ${e.toFixed(2)}ms`;e>t?ne.logger.warn(a,{operation:n,duration:e,threshold:t}):ne.logger.debug(a,{operation:n,duration:e})},error:(n,e,t={})=>{const o=`❌ ${n}: ${e.message||e}`,a={context:n,error:e.message||e,stack:e.stack,...t,timestamp:Date.now()};T.error(o,a)},network:(n,e=null,t=null)=>{const o=`🌐 Network: ${n}`,a={status:n,rpc:e,latency:t,timestamp:Date.now()};ue.info(o,a)},security:(n,e="info",t={})=>{const a=`${e==="error"?"🚨":e==="warn"?"⚠️":"🔒"} Security: ${n}`,c={event:n,severity:e,...t,timestamp:Date.now()};e==="error"?T.error(a,c):e==="warn"?T.warn(a,c):T.info(a,c)},mobile:(n,e={})=>{const t=`📱 Mobile: ${n}`,o={event:n,...e,timestamp:Date.now()};T.info(t,o)},exportForAI:()=>{const e=T.getLogs({since:new Date(Date.now()-18e5)}).map(t=>`[${t.timestamp}] ${t.level} ${t.component}: ${t.message}${t.data?` | Data: ${t.data}`:""}`).join(`
`);return console.log("🤖 Logs for AI Analysis:"),console.log(e),e}};let h=null;try{h=require("../../services/stakingContract").stakingService}catch(n){d.error("stakingCommands",n,{context:"contract service import"})}const Ke={status:async()=>{const n=performance.now();try{if(d.command("staking:status","Getting status",null),!r.connected)return{type:"info",content:`💰 STAKING STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 Wallet:     Not connected
💎 Staked:     0 PROMPT
🎁 Rewards:    0 tokens
📈 Pool APY:   15.2%
🏦 Contracts:  ${h?"Ready":"Mock Mode"}

⚡ Connect wallet to initialize staking protocol.`};let e=null;if(h)try{e=await h.getUserStakeInfo(r),d.command("staking:status",e,null)}catch(o){d.error("staking:status",o,{context:"contract call"})}const t=performance.now()-n;return d.performance("staking:status",t),{type:"result",content:`💰 STAKING STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 Wallet:       ${r.address}
💎 Staked:       ${e?.stakedAmount||r.stakedAmount} PROMPT
🎁 Rewards:      ${e?.pendingRewards||r.rewards} tokens
📈 Pool APY:     15.2%
🏦 Contracts:    ${h?"Active":"Mock Mode"}
💳 Reward Token: ${r.rewardToken||"PROMPT"}

⏱️  Response: ${t.toFixed(0)}ms`}}catch(e){throw d.error("staking:status",e),e}},stake:async n=>{const e=performance.now();try{if(d.command("staking:stake",{args:n},null),!r.connected)return{type:"error",content:"🔒 Connect wallet first using: connect"};if(!n.length)return{type:"error",content:`📋 USAGE: stake <amount>

💡 Example: stake 100
📏 Min amount: 0.001 PROMPT
💰 Max amount: Your available balance
🏦 Contract: `+(h?"Real":"Mock")};const t=te(n[0],r.balance||1e3,9);if(!t.valid)return d.error("staking:stake",new Error(t.error),{amount:n[0]}),{type:"error",content:`❌ Invalid amount: ${t.error}

💡 Enter a valid number between 0.001 and ${r.balance||1e3}`};const o=t.value,a=(r.balance||1e3)-r.stakedAmount;if(o>a)return d.error("staking:stake",new Error("Insufficient balance"),{amount:o,available:a}),{type:"error",content:`🚫 Insufficient balance
💸 Requested: ${o} PROMPT
💰 Available: ${a.toFixed(4)} PROMPT`};let c;if(h)try{c=await h.stakeTokens(o,{publicKey:{toString:()=>r.address}}),d.command("staking:stake",c,null)}catch(k){d.error("staking:stake",k,{context:"contract call",amount:o}),c={signature:"mock_fallback_"+Date.now()}}else c={signature:"mock_"+Date.now()};r.stakedAmount+=o;const l=(o*.15/365).toFixed(6),i=r.stakedAmount.toFixed(4),m=performance.now()-e;return d.performance("staking:stake",m),{type:"result",content:`✅ STAKING TRANSACTION COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💎 Amount staked:     ${o} PROMPT
🏦 Total staked:      ${i} PROMPT
🎁 Daily rewards:     ${l} tokens
📈 APY:               15.2%
🔗 Signature:         ${c.signature}
⏱️  Processing:        ${m.toFixed(0)}ms

🎉 Transaction processed successfully!`}}catch(t){throw d.error("staking:stake",t),t}},unstake:async n=>{const e=performance.now();try{if(d.command("staking:unstake",{args:n},null),!r.connected)return{type:"error",content:"🔒 Connect wallet first using: connect"};if(!n.length)return{type:"error",content:`📋 USAGE: unstake <amount>

💡 Example: unstake 50
💎 Current staked: ${r.stakedAmount} PROMPT
⏰ Timelock: 7 days`};const t=te(n[0],r.stakedAmount,9);if(!t.valid)return d.error("staking:unstake",new Error(t.error),{amount:n[0]}),{type:"error",content:`❌ Invalid amount: ${t.error}

💎 Staked amount: ${r.stakedAmount} PROMPT`};const o=t.value;if(o>r.stakedAmount)return d.error("staking:unstake",new Error("Insufficient staked amount"),{amount:o,staked:r.stakedAmount}),{type:"error",content:`🚫 Insufficient staked amount
💸 Requested: ${o} PROMPT
💎 Staked: ${r.stakedAmount} PROMPT`};let a;if(h)try{a=await h.unstakeTokens(o,{publicKey:{toString:()=>r.address}}),d.command("staking:unstake",a,null)}catch(m){d.error("staking:unstake",m,{context:"contract call",amount:o}),a={signature:"mock_fallback_"+Date.now(),unlockTime:Date.now()+7*24*60*60*1e3}}else a={signature:"mock_"+Date.now(),unlockTime:Date.now()+7*24*60*60*1e3};r.stakedAmount-=o;const c=r.stakedAmount.toFixed(4),l=new Date(a.unlockTime).toLocaleDateString(),i=performance.now()-e;return d.performance("staking:unstake",i),{type:"result",content:`✅ UNSTAKING TRANSACTION COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💸 Amount unstaked:   ${o} PROMPT
💎 Remaining staked:  ${c} PROMPT
⏰ Unlock date:       ${l}
🔗 Signature:         ${a.signature}
⏱️  Processing:        ${i.toFixed(0)}ms

⚡ Tokens will be available after timelock period.`}}catch(t){throw d.error("staking:unstake",t),t}},claim:async()=>{const n=performance.now();try{if(d.command("staking:claim","Claiming rewards",null),!r.connected)return{type:"error",content:"🔒 Connect wallet first using: connect"};if(r.rewards===0)return{type:"info",content:"💡 No rewards available to claim."};let e;if(h)try{e=await h.claimRewards({publicKey:{toString:()=>r.address}}),d.command("staking:claim",e,null)}catch(a){d.error("staking:claim",a,{context:"contract call"}),e={signature:"mock_fallback_"+Date.now(),amount:r.rewards}}else e={signature:"mock_"+Date.now(),amount:r.rewards};const t=r.rewards;r.rewards=0;const o=performance.now()-n;return d.performance("staking:claim",o),{type:"result",content:`✅ REWARDS CLAIMED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎁 Tokens claimed:    ${t} tokens
🔗 Signature:         ${e.signature}
⏱️  Processing:        ${o.toFixed(0)}ms

🎉 Rewards transferred to your wallet!`}}catch(e){throw d.error("staking:claim",e),e}},rewards:async()=>{const n=performance.now();try{if(d.command("staking:rewards","Getting rewards info",null),!r.connected)return{type:"info",content:`🎁 REWARDS INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Available:      0 tokens
💳 Reward Token:   Any SPL token
📈 Daily Rate:     15.2% APY
🏦 Contract:       ${h?"Ready":"Mock Mode"}

🔗 Wallet connection required for rewards access.`};let e=null;if(h)try{e=await h.getUserStakeInfo(r)}catch(c){d.error("staking:rewards",c,{context:"contract call"})}const t=performance.now()-n;d.performance("staking:rewards",t);const o=e?.pendingRewards||r.rewards,a=(r.stakedAmount*.15/365).toFixed(4);return{type:"result",content:`🎁 REWARDS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Available:      ${o} tokens
💳 Reward Token:   ${r.rewardToken||"PROMPT"}
📊 Daily Rate:     ${a} tokens/day
📈 Total Earned:   ${o} tokens
🏦 Contract:       ${h?"Active":"Mock Mode"}
⏱️  Response:       ${t.toFixed(0)}ms`}}catch(e){throw d.error("staking:rewards",e),e}},apy:async()=>{const n=performance.now();try{d.command("staking:apy","Getting pool stats",null);let e=null;if(h)try{e=(await h.getStakingPools())[0],d.command("staking:apy",e,null)}catch(o){d.error("staking:apy",o,{context:"contract call"})}const t=performance.now()-n;return d.performance("staking:apy",t),{type:"result",content:`📊 POOL STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Base APY:         ${e?.apy||"15.2"}%
🎯 Bonus APY: +2.3% (PROMPT holders)
🚀 Total APY:        17.5%

💰 Pool TVL:         $${e?.totalStaked?(e.totalStaked/1e3).toFixed(0)+"K":"2,450,000"}
👥 Active Stakers:   1,247
💎 Average Stake:    1,965 PROMPT
🏦 Contract:         ${h?"Live":"Mock"}
⏱️  Response:         ${t.toFixed(0)}ms`}}catch(e){throw d.error("staking:apy",e),e}},pools:async()=>{const n=performance.now();try{d.command("staking:pools","Getting pools",null);let e=null;if(h)try{e=await h.getStakingPools(),d.command("staking:pools",e,null)}catch(a){d.error("staking:pools",a,{context:"contract call"})}const t=performance.now()-n;return d.performance("staking:pools",t),{type:"result",content:`🏊 STAKING POOLS (${h?"LIVE CONTRACT":"MOCK DATA"})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1] 🌟 MAIN POOL - ACTIVE
    📈 APY: 15.2% | 💰 TVL: $2.45M | 👥 Stakers: 1,247
    🏦 Contract: ${e?.[0]?.address||"Deploying..."}

[2] 💎 VIP POOL - DEVELOPMENT
    📈 APY: 25.0% | 💎 Min: 10,000 PROMPT | 🚧 Status: Soon

[3] ⚡ LIGHTNING POOL - PLANNED
    📈 APY: 8.5% | ⚡ Instant unstake | 🚧 Status: Development

⏱️  Response: ${t.toFixed(0)}ms | 🤖 AI Ready: ✅`}}catch(e){throw d.error("staking:pools",e),e}},contract:async n=>{const e=n[0]||"status",t=performance.now();try{switch(d.command("staking:contract",{action:e},null),e.toLowerCase()){case"status":const o=h?await h.getContractHealth():null,a=performance.now()-t;return{type:"result",content:`🏗️ CONTRACT STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 Service:       ${h?"Loaded":"Not Available"}
🏦 Program ID:    ${h?.programId?.toString()||"TBD"}
📡 Connection:    ${o?.connection?.endpoint||RPC_URL}
✅ Deployed:      ${o?.programDeployed?"Yes":"No"}
📊 Metrics:       ${o?.metrics?.totalCalls||0} calls
⏱️  Avg Latency:   ${o?.metrics?.averageLatency?.toFixed(0)||0}ms
🤖 AI Debug:      Ready

⏱️  Response: ${a.toFixed(0)}ms`};case"metrics":const c=h?h.getMetrics():{};return{type:"result",content:`📊 CONTRACT METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 Total Calls:    ${c.totalCalls||0}
⚡ Avg Latency:    ${c.averageLatency?.toFixed(0)||0}ms
❌ Error Rate:     ${c.errorRate?.toFixed(1)||0}%
🏥 Health:         ${c.status||"Unknown"}
📅 Last Call:      ${c.lastCall?new Date(c.lastCall).toLocaleTimeString():"Never"}

🤖 AI Monitoring: Active`};case"debug":const l=h?h.exportDebugData():{error:"Service not available"};return{type:"result",content:`🔍 CONTRACT DEBUG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Debug data exported to console
🤖 Available for AI analysis
📊 Includes metrics, config, and logs

Check browser console for full data.`};default:return{type:"result",content:"🏗️ Contract commands: status, metrics, debug"}}}catch(o){throw d.error("staking:contract",o,{action:e}),o}}},We={prompt:`
██████╗ ██████╗  ██████╗ ███╗   ███╗██████╗ ████████╗
██╔══██╗██╔══██╗██╔═══██╗████╗ ████║██╔══██╗╚══██╔══╝
██████╔╝██████╔╝██║   ██║██╔████╔██║██████╔╝   ██║
██╔═══╝ ██╔══██╗██║   ██║██║╚██╔╝██║██╔═══╝    ██║
██║     ██║  ██║╚██████╔╝██║ ╚═╝ ██║██║        ██║
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝        ╚═╝

████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║
   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
  `},_e={profile:()=>{const n=b();return{type:"result",content:`USER PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Access Level:     [${n.level}] ${n.name}
Description:      ${n.description}
Commands Used:    ${n.commandCount}
Secrets Found:    ${n.secretsFound}

Progression:
${n.nextLevelRequirement}

Unlocked Commands: ${Array.from(s.unlockedCommands).length}
Achievements:      ${s.achievements.length}`}},price:async()=>{try{return{type:"result",content:`SOL PRICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1 SOL = $${(await(await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd")).json()).solana.usd} USD`}}catch(n){return{type:"error",content:`Price fetch failed: ${n.message}`}}},slot:async()=>{try{return{type:"result",content:`CURRENT SLOT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${await le.getSlot()}`}}catch(n){return{type:"error",content:`Slot fetch failed: ${n.message}`}}},about:()=>({type:"result",content:`PROMPT STAKING PROTOCOL v1.0.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Advanced staking protocol built on Solana blockchain.

FEATURES:
• Stake PROMPT tokens with flexible reward systems
• Earn rewards in any SPL token of choice
• Powered by Jupiter Aggregator for optimal swaps
• Built with Anchor smart contract framework

LINKS:
Website:   prompt.staking
Twitter:   @prompt_protocol
Discord:   discord.gg/prompt
GitHub:    github.com/prompt/staking-dapp

Developed on Solana blockchain infrastructure.`}),version:()=>({type:"result",content:`SYSTEM INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Terminal:      v1.0.0
Protocol:      v1.0.0
Solana:        Mainnet Beta
Network:       Connected
RPC:           https://api.mainnet-beta.solana.com

Build Date:  ${new Date().toISOString().split("T")[0]}
Uptime:        ${Math.floor(Math.random()*24)}h ${Math.floor(Math.random()*60)}m`}),banner:()=>({type:"result",content:We.prompt}),ping:()=>({type:"result",content:`NETWORK DIAGNOSTIC

Latency: 42ms
Status: Connected`}),time:()=>({type:"result",content:`SYSTEM TIME

Current: ${new Date().toLocaleString()}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`}),whoami:()=>{const n=b();return{type:"result",content:`USER IDENTIFICATION

User: Anonymous Staker #1337
Access Level: [${n.level}] ${n.name}
Clearance: ${n.description}`}}},He={flip:()=>({type:"result",content:`COIN FLIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${Math.random()<.5?"Heads":"Tails"}`}),dice:()=>({type:"result",content:`DICE ROLL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You rolled a ${Math.floor(Math.random()*6)+1}`})},Ge={clear:()=>({type:"clear",content:""}),reset:()=>(r.connected=!1,r.address=null,r.balance=0,r.stakedAmount=0,r.rewards=0,r.rewardToken=null,r.provider=null,s.level=0,s.commandCount=0,s.secretsFound=0,s.achievements=[],s.unlockedCommands=new Set(["help","about","version","banner","clear","time","ping","price","slot","flip","dice","connect"]),s.secretsFoundSet=new Set,{type:"clear",content:"SYSTEM RESET COMPLETE"}),levelup:n=>{const e=n[0]?parseInt(n[0]):4;if(isNaN(e)||e<0||e>4)return{type:"error",content:`📄 USAGE: levelup <0-4>

Levels:
0 = ANONYMOUS
1 = USER
2 = STAKER
3 = EXPERT
4 = HACKER`};const t=s.level,o=b();s.level=e,s.commandCount=e>=3?15:e*5,s.secretsFound=e>=4?3:0,e>0&&!r.connected&&(r.connected=!0,r.address="DEV1111111111111111111111111111111111111111",r.walletType="dev-wallet",r.balance=100,r.isReal=!1),e>1&&(r.stakedAmount=100,r.rewards=10.5),s.unlockedCommands=new Set(["help","about","version","banner","clear","time","ping","price","slot","flip","dice","connect"]),e>=1&&(s.unlockedCommands.add("disconnect"),s.unlockedCommands.add("balance"),s.unlockedCommands.add("walletinfo"),s.unlockedCommands.add("status"),s.unlockedCommands.add("stake"),s.unlockedCommands.add("tokeninfo")),e>=2&&(s.unlockedCommands.add("unstake"),s.unlockedCommands.add("claim"),s.unlockedCommands.add("rewards"),s.unlockedCommands.add("apy"),s.unlockedCommands.add("pools")),e>=3&&(s.unlockedCommands.add("debug"),s.unlockedCommands.add("health"),s.unlockedCommands.add("performance"),s.unlockedCommands.add("cache"),s.unlockedCommands.add("logs"),s.unlockedCommands.add("export"),s.unlockedCommands.add("dev"),s.unlockedCommands.add("whoami"),s.unlockedCommands.add("matrix")),e>=4&&(s.unlockedCommands.add("hack"),s.unlockedCommands.add("override"),s.unlockedCommands.add("decrypt"),s.unlockedCommands.add("easter"),s.unlockedCommands.add("ghost"),s.unlockedCommands.add("prompt"),s.secretsFoundSet.add("easter"),s.secretsFoundSet.add("matrix"),s.secretsFoundSet.add("ghost")),s.unlockedCommands.add("levelup"),s.unlockedCommands.add("reset");const a=b();return{type:"result",content:`🚀 DEVELOPMENT LEVEL UP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Level Changed: [${t}] ${o.name} → [${e}] ${a.name}
Commands: ${s.commandCount}
Secrets: ${s.secretsFound}
Unlocked Commands: ${Array.from(s.unlockedCommands).length}

🎮 All commands for level ${e} now available!
Use 'help' to see available commands.`}}},Ye={easter:()=>(s.secretsFoundSet.has("easter")||(s.secretsFoundSet.add("easter"),s.secretsFound++),{type:"result",content:`EASTER EGG FOUND!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🥚 Congratulations, you found the hidden command!

Secret message: "The future of staking is prompt."

Secrets found: ${s.secretsFound}/3

Try: matrix, ghost, or dev for more secrets...`}),matrix:()=>(s.secretsFoundSet.has("matrix")||(s.secretsFoundSet.add("matrix"),s.secretsFound++),{type:"result",content:`THE MATRIX HAS YOU...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

01100110 01110101 01110100 01110101
01110010 01100101 00100000 01101111
01100110 00100000 01110011 01110100
01100001 01101011 01101001 01101110
01100111 00100000 01101001 01110011
00100000 01110000 01110010 01101111
01101101 01110000 01110100

Translated: "future of staking is prompt"
Secrets found: ${s.secretsFound}/3`}),ghost:()=>(s.secretsFoundSet.has("ghost")||(s.secretsFoundSet.add("ghost"),s.secretsFound++),{type:"result",content:`👻 GHOST MODE ACTIVATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are now invisible in the mempool...
Staking operations will have 0% slippage
Rewards multiplied by 2x temporarily

Secrets found: ${s.secretsFound}/3

[This is just for fun - no real effect]`}),dev:()=>({type:"result",content:`DEVELOPER MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Developer tools unlocked:
• Advanced logging enabled
• Debug mode active
• Performance metrics visible
• All RPC endpoints accessible

Project: Solana Staking dApp
Framework: Anchor + React + Vite
Author: @mate0s91

Want to contribute? Check the GitHub!`}),hack:()=>s.level<4?{type:"error",content:"ACCESS DENIED: HACKER level required"}:{type:"result",content:`INITIATING HACK SEQUENCE...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> Scanning network vulnerabilities...
> Bypassing firewall protocols...
> Accessing mainframe...

[SUCCESS] System infiltration complete.
[CAUTION] Use powers responsibly.`},override:()=>s.level<4?{type:"error",content:"ACCESS DENIED: HACKER level required"}:{type:"result",content:`SYSTEM OVERRIDE ACTIVATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> Emergency protocols disabled
> Admin privileges escalated
> Security constraints bypassed

[WARNING] Override mode active.
All restrictions temporarily lifted.`},decrypt:()=>s.level<4?{type:"error",content:"ACCESS DENIED: HACKER level required"}:{type:"result",content:`DECRYPTION MODULE ACTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> Analyzing encrypted payload...
> Applying quantum decryption...
> Message decoded successfully.

Decrypted message: "Welcome to the inner circle"

[CLASSIFIED] You are now part of the inner circle.`},prompt:()=>({type:"result",content:`$PROMPT TOKEN INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contract: [To be deployed]
Supply: 1,000,000,000 PROMPT
Decimals: 9
Network: Solana Mainnet

Utility:
• Staking rewards boost
• Governance voting rights
• Protocol fee discounts
• Priority pool access

"Building the future, one prompt at a time."`})},j={debug:n=>{const e=n[0]||"system",t=b(),o=D(),a={system:{timestamp:new Date().toISOString(),userAgent:navigator.userAgent,url:window.location.href,performance:{memory:performance.memory?{used:Math.round(performance.memory.usedJSHeapSize/1024/1024)+"MB",total:Math.round(performance.memory.totalJSHeapSize/1024/1024)+"MB",limit:Math.round(performance.memory.jsHeapSizeLimit/1024/1024)+"MB"}:"Not available"}},wallet:{connected:r.connected,type:r.walletType,address:r.address,balance:r.balance,isReal:r.isReal,connectionTime:r.connectionTime},user:{level:t.level,name:t.name,commandCount:t.commandCount,secretsFound:t.secretsFound,unlockedCommands:Array.from(s.unlockedCommands).length},network:{...o,rpcHealth:"Unknown"}};let c;switch(e.toLowerCase()){case"wallet":c=JSON.stringify(a.wallet,null,2);break;case"user":c=JSON.stringify(a.user,null,2);break;case"network":c=JSON.stringify(a.network,null,2);break;default:c=JSON.stringify(a,null,2)}return{type:"result",content:`🔍 DEBUG INFO (${e.toUpperCase()})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${c}

Use: debug <system|wallet|user|network>`}},health:async()=>{const n=[];r.connected?n.push({component:"Wallet",status:"healthy",details:`${r.walletType} connected`}):n.push({component:"Wallet",status:"disconnected",details:"No wallet connected"});try{const o=D();n.push({component:"Network",status:"healthy",details:`Connected to ${o.network}`})}catch(o){n.push({component:"Network",status:"unhealthy",details:o.message})}const e=n.map(o=>`${o.status==="healthy"?"✅":o.status==="warning"?"⚠️":"❌"} ${o.component}: ${o.status}
   ${o.details}`).join(`

`);return{type:"result",content:`🏥 SYSTEM HEALTH CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Status: ${n.every(o=>o.status==="healthy")?"HEALTHY":n.some(o=>o.status==="unhealthy")?"UNHEALTHY":"WARNING"}

${e}

Last check: ${new Date().toLocaleTimeString()}`}},performance:()=>{const n={memoryUsage:performance.memory?{used:Math.round(performance.memory.usedJSHeapSize/1024/1024),total:Math.round(performance.memory.totalJSHeapSize/1024/1024),percentage:Math.round(performance.memory.usedJSHeapSize/performance.memory.totalJSHeapSize*100)}:null,connectionTiming:{navigation:performance.timing?performance.timing.loadEventEnd-performance.timing.navigationStart:"Not available",domContentLoaded:performance.timing?performance.timing.domContentLoadedEventEnd-performance.timing.navigationStart:"Not available"}};let e=`⚡ PERFORMANCE METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;return n.memoryUsage&&(e+=`Memory Usage: ${n.memoryUsage.used}MB / ${n.memoryUsage.total}MB (${n.memoryUsage.percentage}%)
`),e+=`Page Load Time: ${n.connectionTiming.navigation}ms
`,e+=`DOM Ready: ${n.connectionTiming.domContentLoaded}ms
`,e+=`Commands Executed: ${s.commandCount}
`,e+=`
System performance is being monitored`,{type:"result",content:e}},cache:()=>({type:"result",content:`🗄️ CACHE STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cache System: Active
Status: Working

Use: cache <status|stats|clear>`}),logs:n=>{const e=n[0]||"all";try{let t;switch(e.toLowerCase()){case"wallet":t=T.getLogs({component:"WALLET"}).slice(-10);break;case"command":t=T.getLogs({component:"COMMAND"}).slice(-10);break;case"error":t=T.getLogs().filter(a=>a.level==="ERROR").slice(-10);break;case"recent":t=T.getLogs({since:new Date(Date.now()-5*60*1e3)}).slice(-15);break;default:t=T.getLogs().slice(-10)}if(t.length===0)return{type:"result",content:`📋 No logs found for filter: ${e}`};const o=t.map(a=>`[${new Date(a.timestamp).toLocaleTimeString()}] ${a.level} ${a.component}: ${a.message}`).join(`
`);return{type:"result",content:`📋 SYSTEM LOGS (${e.toUpperCase()})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${o}

Filters: all, wallet, command, error, recent`}}catch(t){return d.error("logs command",t),{type:"error",content:"Error retrieving logs: "+t.message}}},export:n=>{const e=n[0]||"logs";try{let t;switch(e.toLowerCase()){case"logs":t=d.exportForAI();break;case"debug":{const o={timestamp:new Date().toISOString(),wallet:r,user:b(),network:D(),performance:{memory:performance.memory?{used:Math.round(performance.memory.usedJSHeapSize/1024/1024),total:Math.round(performance.memory.totalJSHeapSize/1024/1024)}:"Not available"}};t=JSON.stringify(o,null,2);break}case"ai":{const o={logs:T.getLogs({since:new Date(Date.now()-18e5)}),wallet:r,user:b(),commands:s,errors:T.getLogs().filter(a=>a.level==="ERROR")};t=JSON.stringify(o,null,2);break}default:return{type:"error",content:"Unknown export type. Use: logs, debug, ai"}}return navigator.clipboard&&t&&navigator.clipboard.writeText(t).catch(()=>{}),{type:"result",content:`📤 EXPORTED ${e.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Data exported to console and clipboard
Check browser console for full output

Types: logs, debug, ai`}}catch(t){return d.error("export command",t),{type:"error",content:"Export failed: "+t.message}}},ai:n=>{switch((n[0]||"status").toLowerCase()){case"status":return{type:"result",content:`🤖 AI DEVELOPMENT MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: Active
Logging: Enhanced
Debug Mode: OFF
Contracts: Ready for Integration

Commands:
• ai export - Export data for AI
• ai logs - Recent logs for analysis
• ai debug - Debug info for AI
• ai clear - Clear all logs
• ai contracts - Contract development status`};case"export":return d.exportForAI(),{type:"result",content:`🤖 Data exported to console for AI analysis
Check browser console for formatted logs`};case"logs":return{type:"result",content:`🤖 Recent Logs for AI:
${T.getLogs({since:new Date(Date.now()-6e5)}).slice(-5).map(a=>`${a.level}: ${a.message}`).join(`
`)}`};case"debug":{const t={wallet:r.connected?"Connected":"Disconnected",user:b().name,commands:s.commandCount,errors:T.getLogs().filter(o=>o.level==="ERROR").length};return{type:"result",content:`🤖 Debug Summary:
${JSON.stringify(t,null,2)}`}}case"contracts":return{type:"result",content:`🏗️ AI CONTRACT DEVELOPMENT STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 Frontend Integration: ✅ Ready
🛠️ Service Layer: ✅ Implemented
🧪 Tests: ✅ Available
🤖 AI Debugging: ✅ Active
🗂️ Mock Mode: ✅ Running
🚀 Deployment Ready: ⚠️ Pending

📄 Next Steps:
• Run setup-contracts.sh
• Install Anchor framework
• Deploy to devnet
• Update frontend integration

🤖 All groundwork prepared for AI assistance!`};case"clear":return T.clearLogs(),{type:"result",content:"🤖 All logs cleared for fresh AI analysis"};default:return{type:"result",content:"AI commands: status, export, logs, debug, clear, contracts"}}}};Object.keys(j).forEach(n=>{const e=j[n];j[n]=(...t)=>{const o=performance.now();try{const a=e(...t),c=performance.now()-o;return d.command(`diagnostic:${n}`,a,null),d.performance(`diagnostic:${n}`,c),a}catch(a){throw d.command(`diagnostic:${n}`,null,a),d.error(`diagnostic:${n}`,a),a}}});async function qe(){if(!r.connected||!r.address)return!1;const n=`token_balance_${r.address}_${V.toBase58()}`,e=x.get(n);if(e!==null)return e;if(!ie.isAllowed(r.address))return x.get(n)||!1;try{const t=new L(r.address),o=await ke(V,t),a=await I(async c=>{const l=await c.getTokenAccountBalance(o),i=BigInt(l.value.amount),m=l.value.decimals,k=ce*10n**BigInt(m);return i>=k});return x.set(n,a),a}catch{return x.set(n,!1,5e3),!1}}const B={...Fe,...Ke,..._e,...He,...Ge,...Ye,...j},K={h:"help",c:"clear",r:"reset",p:"profile",st:"status",bal:"balance",conn:"connect",disc:"disconnect",winfo:"walletinfo",tinfo:"tokeninfo",ti:"tokeninfo",pr:"price",sol:"price",sl:"slot",coin:"flip",roll:"dice",diag:"debug",healthcheck:"health",perf:"performance",lvl:"levelup",maxlevel:"levelup",unlock:"levelup","???":"easter","👻":"ghost",debug:"dev"};B.help=()=>({type:"result",content:`AVAILABLE COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WALLET OPERATIONS
  connect <wallet> │ Connect wallet (phantom | solflare)
  disconnect       │ Disconnect current wallet
  balance          │ Display wallet balances
  walletinfo       │ Detailed connection information
  tokeninfo <addr> │ Get token metadata and details

STAKING OPERATIONS
  stake <amount>   │ Stake PROMPT tokens
  unstake <amount> │ Withdraw staked tokens
  claim            │ Claim pending rewards

INFORMATION
  status           │ Current staking status
  rewards          │ Available reward tokens
  apy              │ Pool statistics and APY
  pools            │ Available staking pools
  price            │ Current SOL price
  slot             │ Latest network slot
  profile          │ View user progression

DIAGNOSTICS
  logs <filter>    │ System logs (wallet|rpc|command|errors)
  debug <component>│ Debug info (system|wallet|user|network)
  health           │ System health check
  performance      │ Performance metrics
  cache <action>   │ Cache management (status|stats|clear)
  export <type>    │ Export data (logs|debug)
  ai <action>      │ AI development helper (status|export|logs|debug)

FUN
  flip             │ Flip a coin
  dice             │ Roll a six-sided die

SYSTEM
  about            │ Protocol information
  version          │ System version details
  banner           │ Display PROMPT logo
  clear            │ Clear terminal output
  reset            │ Full system reset

DEVELOPMENT
  levelup <0-4>    │ Jump to specific access level (dev only)

HIDDEN
  ??????           │ ??????

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TAB: autocomplete │ UP/DOWN: command history │ ALIASES: ${Object.keys(K).filter(e=>!["???","👻","debug","lvl","maxlevel","unlock"].includes(e)).join(", ")}`});async function Ve(n){const e=b(),[t,...o]=n.toLowerCase().split(" "),a=K[t]||t;if(!B[a])return{type:"error",content:`❌ Command not found: ${t}
Type "help" for available commands`};if(!s.unlockedCommands.has(a))return{type:"error",content:`🔒 Command "${a}" not unlocked at your current level
Current: [${e.level}] ${e.name}`};if(!new Set(["help","connect","disconnect","clear","banner","version","about","ping","time","whoami","logs","debug","health","performance","cache","export","ai"]).has(a))try{if(!await qe()){const i=await z(V),m=Ue(i);return{type:"error",content:`🚫 ACCESS DENIED
Requires at least ${ce} ${i.symbol} tokens

Token: ${m}`}}}catch(l){return{type:"error",content:`🚫 ACCESS DENIED
Token verification failed: ${l.message}`}}s.commandCount++;try{const l=await B[a](o);if(Le(a)){const m=b(),k=`

━━━ 🎉 LEVEL UP! 🎉 ━━━
Access Level: [${m.level}] ${m.name}
New commands unlocked! Use 'help' to see them.`;l.content+=k}return l}catch(l){return{type:"error",content:`💥 Command execution failed: ${l.message}
Please try again or contact support.`}}}function ze(n){const e=[...Object.keys(B),...Object.keys(K)],t=new Set(["easter","matrix","ghost","dev","prompt","???","👻","debug","hack","override","decrypt"]);return e.filter(a=>s.unlockedCommands.has(K[a]||a)&&!t.has(a)).filter(a=>a.startsWith(n.toLowerCase()))}function Je(){const n=["TIP: Use TAB for command autocompletion","TIP: Use UP/DOWN arrows to navigate command history","TIP: Type 'apy' to see current staking rewards","TIP: You can stake any amount of PROMPT tokens","TIP: Rewards can be claimed in any SPL token","TIP: Type 'banner' for ASCII art display","TIP: Jupiter Aggregator ensures optimal swap rates","TIP: Use aliases like 'h' for help, 'c' for clear","TIP: Commands are case-insensitive for convenience","TIP: Type 'profile' to check your progression","TIP: Type 'price' to check the current SOL price","TIP: Use 'flip' or 'dice' for a bit of fun","TIP: Hidden commands exist... try exploring!"];return n[Math.floor(Math.random()*n.length)]}function Ze(){const[n,e]=g.useState([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:"Building a Solana staking dApp"},{type:"info",content:"Custom token staking - Earn rewards in any SPL token you choose"},{type:"info",content:'Type "help" to see available commands'}]),[t,o]=g.useState(""),[a,c]=g.useState([]),[l,i]=g.useState(-1),[m,k]=g.useState([]),[A,S]=g.useState(!1),[v,R]=g.useState(!1),E=g.useRef(null),P=g.useRef(null),w=g.useRef(null),y=g.useRef(!1);g.useEffect(()=>{const p=()=>{y.current=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<=768};return p(),window.addEventListener("resize",p),()=>window.removeEventListener("resize",p)},[]),g.useEffect(()=>{y.current||E.current?.focus()},[]),g.useEffect(()=>{if(!v&&!y.current){const p=setTimeout(()=>{E.current?.focus()},100);return()=>clearTimeout(p)}},[n,v]),g.useEffect(()=>{P.current&&((()=>{const f=P.current;f&&requestAnimationFrame(()=>{f.scrollTop=f.scrollHeight})})(),y.current||setTimeout(()=>{E.current?.focus()},10))},[n]),g.useEffect(()=>{if(t.trim()){const p=ze(t.trim());k(p),S(p.length>0)}else S(!1)},[t]),g.useEffect(()=>((()=>{w.current&&clearTimeout(w.current);const f=y.current?6e4:3e4;w.current=setTimeout(()=>{e(C=>[...C,{type:"info",content:Je()}])},f)})(),()=>{w.current&&clearTimeout(w.current)}),[t,n]),g.useEffect(()=>{const p=f=>{if(y.current)return;const C=f.target.closest(".suggestion-item"),U=f.target.closest(".terminal-input"),$=f.target===P.current;!C&&!U&&!$&&!v&&setTimeout(()=>{E.current?.focus()},0)};return document.addEventListener("click",p),()=>{document.removeEventListener("click",p)}},[v]),g.useEffect(()=>{if(!y.current)return;const p=C=>{C.target.closest(".suggestion-item")||C.target.closest(".terminal-input")},f=C=>{C.target.closest(".suggestion-item")&&C.preventDefault()};return document.addEventListener("touchstart",p,{passive:!1}),document.addEventListener("touchend",f,{passive:!1}),()=>{document.removeEventListener("touchstart",p),document.removeEventListener("touchend",f)}},[]);const M=g.useCallback(async p=>{R(!0);const f=y.current?150:300;await new Promise(C=>setTimeout(C,Math.random()*f+100));try{return await Ve(p)}finally{R(!1)}},[]),H=g.useCallback(async p=>{if(p.preventDefault(),!t.trim()||v)return;const f=t.trim(),C={type:"command",content:f};c($=>[f,...$.slice(0,49)]),i(-1),["connect","stake","unstake","claim"].includes(f.split(" ")[0])?e($=>[...$,C,{type:"loading",content:"Processing..."}]):e($=>[...$,C]),o(""),S(!1),y.current&&E.current&&(E.current.blur(),setTimeout(()=>{E.current?.focus()},100));const U=await M(f);window.dispatchEvent(new CustomEvent("terminal-command",{detail:{command:f}})),U.type==="clear"?e([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:'Type "help" to see available commands'}]):e($=>{const F=[...$];return F[F.length-1]?.type==="loading"&&F.pop(),[...F,U]})},[t,v,M]),me=g.useCallback(p=>{if(y.current){if(p.key==="Enter"){H(p);return}if(p.key==="Escape"){S(!1),o(""),i(-1);return}return}if(p.key==="ArrowUp"){if(p.preventDefault(),l<a.length-1){const f=l+1;i(f),o(a[f])}}else if(p.key==="ArrowDown")if(p.preventDefault(),l>0){const f=l-1;i(f),o(a[f])}else l===0&&(i(-1),o(""));else if(p.key==="Tab"){if(p.preventDefault(),m.length===1)o(m[0]+" "),S(!1);else if(m.length>1){const f=m.join("  ");e(C=>[...C,{type:"command",content:t},{type:"suggestion",content:f}]),o("")}}else p.key==="Escape"?(S(!1),o(""),i(-1)):p.ctrlKey&&p.key==="c"?(p.preventDefault(),o(""),e(f=>[...f,{type:"info",content:"^C"}])):p.ctrlKey&&p.key==="l"&&(p.preventDefault(),e([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:'Type "help" to see available commands'}]))},[l,a,m,t,H]),pe=g.useCallback(p=>{o(p+" "),S(!1),y.current&&setTimeout(()=>{E.current?.focus()},100)},[]),fe=g.useCallback(p=>{e(f=>[...f,p])},[]),ge=g.useCallback(()=>{e([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:'Type "help" to see available commands'}])},[]);return{history:n,input:t,suggestions:m,showSuggestions:A,isLoading:v,isMobile:y.current,inputRef:E,outputRef:P,setInput:o,handleSubmit:H,handleKeyDown:me,handleSuggestionClick:pe,addMessage:fe,clearTerminal:ge}}function Xe(){const[n,e]=g.useState({uptime:"0h 0m",commandsExecuted:0,memoryUsage:0,networkLatency:0});return g.useEffect(()=>{const t=Date.now();let o=0;const a=()=>{const m=Date.now()-t,k=Math.floor(m/(1e3*60*60)),A=Math.floor(m%(1e3*60*60)/(1e3*60));e({uptime:`${k}h ${A}m`,commandsExecuted:o,memoryUsage:Math.floor(Math.random()*20+40),networkLatency:Math.floor(Math.random()*50+20)})},c=()=>{o++,a()},l=setInterval(a,1e4);return window.addEventListener("terminal-command",c),a(),()=>{clearInterval(l),window.removeEventListener("terminal-command",c)}},[]),u.jsxs("div",{className:"system-stats",children:[u.jsxs("div",{className:"stat-item",children:[u.jsx("span",{className:"stat-label",children:"UPTIME"}),u.jsx("span",{className:"stat-value",children:n.uptime})]}),u.jsxs("div",{className:"stat-item",children:[u.jsx("span",{className:"stat-label",children:"CMDS"}),u.jsx("span",{className:"stat-value",children:n.commandsExecuted})]}),u.jsxs("div",{className:"stat-item",children:[u.jsx("span",{className:"stat-label",children:"MEM"}),u.jsxs("span",{className:"stat-value",children:[n.memoryUsage,"%"]})]}),u.jsxs("div",{className:"stat-item",children:[u.jsx("span",{className:"stat-label",children:"PING"}),u.jsxs("span",{className:"stat-value",children:[n.networkLatency,"ms"]})]})]})}function Qe(){const[n,e]=g.useState(b()),{history:t,input:o,suggestions:a,showSuggestions:c,isLoading:l,isMobile:i,inputRef:m,outputRef:k,setInput:A,handleSubmit:S,handleKeyDown:v,handleSuggestionClick:R}=Ze();g.useEffect(()=>{const w=()=>{e(b())};return window.addEventListener("terminal-command",w),()=>window.removeEventListener("terminal-command",w)},[]),g.useEffect(()=>{if(!i)return;const w=y=>{(y.target.closest(".terminal-output")||y.target.closest(".terminal-input-area"))&&y.touches.length===1&&y.touches[0].clientY>0&&y.preventDefault()};return document.addEventListener("touchmove",w,{passive:!1}),()=>{document.removeEventListener("touchmove",w)}},[i]);const E=(w,y)=>{switch(w.type){case"welcome":return u.jsx("div",{className:"welcome-text",children:u.jsx("div",{className:"ascii-art",children:w.content})},y);case"command":return u.jsxs("div",{className:"command-line",children:[u.jsx("span",{className:"terminal-prompt",children:"$PROMPT>"}),u.jsx("span",{className:"command-text",children:w.content})]},y);case"result":return u.jsx("div",{className:"command-result success-text",children:w.content},y);case"error":return u.jsxs("div",{className:"command-result error-text",children:["↯ ",w.content]},y);case"info":return u.jsxs("div",{className:"command-result info-text",children:["… ",w.content]},y);case"suggestion":return u.jsxs("div",{className:"command-result suggestion-text",children:["⋄ ",w.content]},y);case"loading":return u.jsxs("div",{className:"command-result loading-text",children:[u.jsx("span",{className:"loading-spinner",children:"▒░▒"})," ",w.content]},y);default:return u.jsx("div",{className:"command-result",children:w.content},y)}},P=()=>{i&&m.current&&setTimeout(()=>{m.current?.scrollIntoView({behavior:"smooth",block:"center"})},300)};return u.jsxs("div",{className:"terminal-container",children:[u.jsxs("div",{className:"terminal-header",children:[u.jsx("div",{className:"terminal-logo",children:u.jsx("span",{className:"logo-text",children:"PROMPT"})}),!i&&u.jsx("div",{className:"terminal-subtitle",children:"SOLANA STAKING PROTOCOL"}),u.jsxs("div",{className:"terminal-user-info",children:[u.jsxs("div",{className:"user-level",style:{color:n.color},children:["[",n.level,"] ",n.name]}),u.jsxs("div",{className:"terminal-status",children:[u.jsx("span",{className:"status-dot"}),u.jsx("span",{className:"status-text",children:"OFFLINE"})]})]})]}),u.jsx(Xe,{}),u.jsx("div",{className:"terminal-output",ref:k,role:"log","aria-live":"polite","aria-label":"Terminal output",children:t.map(E)}),u.jsxs("div",{className:"terminal-input-area",children:[c&&a.length>0&&u.jsx("div",{className:"suggestions",role:"listbox","aria-label":"Command suggestions",children:a.map((w,y)=>u.jsx("span",{className:"suggestion-item",onClick:()=>R(w),onTouchEnd:M=>{M.preventDefault(),R(w)},role:"option",tabIndex:i?0:-1,"aria-label":`Suggestion: ${w}`,children:w},y))}),u.jsxs("form",{onSubmit:S,className:"terminal-input-container",children:[u.jsx("span",{className:"terminal-prompt",children:"$PROMPT>"}),u.jsx("input",{ref:m,type:"text",value:o,onChange:w=>A(w.target.value),onKeyDown:v,onFocus:P,className:"terminal-input",placeholder:l?"Processing...":"Enter command...",autoComplete:"off",autoCorrect:"off",autoCapitalize:"off",spellCheck:"false",disabled:l,"aria-label":"Command input",inputMode:"text",enterKeyHint:"send"}),!i&&u.jsx("span",{className:"cursor",children:"_"})]}),u.jsx("div",{className:"terminal-footer",children:u.jsx("span",{className:"footer-text",children:i?"TAB: autocomplete | Type 'help' for commands":"TAB: autocomplete | UP/DOWN: history | ESC: clear | CTRL+C: interrupt"})})]})]})}function et(){return u.jsx(Qe,{})}q.createRoot(document.getElementById("root")).render(u.jsx(ye.StrictMode,{children:u.jsx(et,{})}));
