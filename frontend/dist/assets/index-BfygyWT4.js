import{r as f,b as ge,R as he}from"./vendor-107eBDi2.js";import{b as ne,P as R,C as oe,c as ye,L as G,g as we}from"./solana-DlhCIz-Q.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const c of l.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function t(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(a){if(a.ep)return;a.ep=!0;const l=t(a);fetch(a.href,l)}})();var ae={exports:{}},K={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ve=f,Te=Symbol.for("react.element"),ke=Symbol.for("react.fragment"),Se=Object.prototype.hasOwnProperty,Ee=ve.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Ce={key:!0,ref:!0,__self:!0,__source:!0};function re(n,e,t){var o,a={},l=null,c=null;t!==void 0&&(l=""+t),e.key!==void 0&&(l=""+e.key),e.ref!==void 0&&(c=e.ref);for(o in e)Se.call(e,o)&&!Ce.hasOwnProperty(o)&&(a[o]=e[o]);if(n&&n.defaultProps)for(o in e=n.defaultProps,e)a[o]===void 0&&(a[o]=e[o]);return{$$typeof:Te,type:n,key:l,ref:c,props:a,_owner:Ee.current}}K.Fragment=ke;K.jsx=re;K.jsxs=re;ae.exports=K;var i=ae.exports;typeof window<"u"&&(window.Buffer=ne.Buffer,window.global=window,window.process={env:{},nextTick:n=>setTimeout(n,0),version:"16.0.0",browser:!0});globalThis.Buffer=ne.Buffer;globalThis.global=globalThis;globalThis.process=globalThis.process||{env:{},nextTick:n=>setTimeout(n,0),version:"16.0.0",browser:!0};var Y={},X=ge;Y.createRoot=X.createRoot,Y.hydrateRoot=X.hydrateRoot;const q=new R("5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF"),se=BigInt("500"),Ae=!0,J=[ye("devnet"),"https://api.devnet.solana.com"];let be=Ae;function Ne(){const n=J;return new oe(n[0],{commitment:"finalized",confirmTransactionInitialTimeout:6e4,disableRetryOnRateLimit:!0,fetch})}const le=Ne(),Q=new R("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");async function $(n){const e=J;for(let t=0;t<e.length;t++){const o=e[t];try{const a=new oe(o,{commitment:"finalized",confirmTransactionInitialTimeout:3e4,disableRetryOnRateLimit:!0,fetch});return await n(a)}catch{t<e.length-1&&await new Promise(l=>setTimeout(l,1e3))}}throw new Error("All RPC endpoints (mainnet and devnet) failed")}function O(){return{network:"devnet",isTestnet:be,endpoints:J}}const r={connected:!1,address:null,balance:0,stakedAmount:0,rewards:0,rewardToken:null,provider:null,walletType:null,tokenCount:0,connectionTime:null,isReal:!0},s={level:0,commandCount:0,secretsFound:0,achievements:[],unlockedCommands:new Set(["help","about","version","banner","clear","time","ping","price","slot","flip","dice","connect","levelup","reset"]),secretsFoundSet:new Set},Le=[{name:"ANONYMOUS",color:"#888888",description:"Unknown entity"},{name:"USER",color:"#00ff41",description:"Connected user"},{name:"STAKER",color:"#66ff66",description:"Active staker"},{name:"EXPERT",color:"#00cc33",description:"Terminal expert"},{name:"HACKER",color:"#ffffff",description:"System infiltrator"}];function Re(n){const e=s.level;return s.level===0&&n==="connect"&&r.connected&&(s.level=1,s.unlockedCommands.add("disconnect"),s.unlockedCommands.add("balance"),s.unlockedCommands.add("walletinfo"),s.unlockedCommands.add("status"),s.unlockedCommands.add("stake")),s.level===1&&n==="stake"&&r.stakedAmount>0&&(s.level=2,s.unlockedCommands.add("unstake"),s.unlockedCommands.add("claim"),s.unlockedCommands.add("rewards")),s.level===2&&s.commandCount>=15&&(s.level=3,s.unlockedCommands.add("dev"),s.unlockedCommands.add("whoami"),s.unlockedCommands.add("matrix")),s.level===3&&s.secretsFound>=3&&(s.level=4,s.unlockedCommands.add("hack"),s.unlockedCommands.add("override"),s.unlockedCommands.add("decrypt")),s.level>e}function C(){const n=Le[s.level];return{level:s.level,name:n.name,color:n.color,description:n.description,commandCount:s.commandCount,secretsFound:s.secretsFound,nextLevelRequirement:$e()}}function $e(){switch(s.level){case 0:return"Connect a wallet to reach USER level";case 1:return"Stake tokens to reach STAKER level";case 2:return`Execute ${15-s.commandCount} more commands to reach EXPERT level`;case 3:return`Find ${3-s.secretsFound} more secrets to reach HACKER level`;case 4:return"Maximum level achieved";default:return"Unknown"}}class Ie{constructor(e=10,t=6e4){this.maxRequests=e,this.windowMs=t,this.requests=new Map}isAllowed(e){const t=Date.now(),a=(this.requests.get(e)||[]).filter(l=>t-l<this.windowMs);return a.length>=this.maxRequests?!1:(a.push(t),this.requests.set(e,a),!0)}getRemainingTime(e){const t=this.requests.get(e)||[];if(t.length===0)return 0;const o=Math.min(...t),a=this.windowMs-(Date.now()-o);return Math.max(0,a)}}class Z{constructor(e=3e4){this.cache=new Map,this.defaultTTL=e}set(e,t,o=this.defaultTTL){const a=Date.now()+o;this.cache.set(e,{value:t,expiry:a})}get(e){const t=this.cache.get(e);return t?Date.now()>t.expiry?(this.cache.delete(e),null):t.value:null}has(e){return this.get(e)!==null}clear(){this.cache.clear()}cleanup(){const e=Date.now();for(const[t,o]of this.cache.entries())e>o.expiry&&this.cache.delete(t)}}const ce=new Ie(10,1e4),P=new Z(3e5),D=new Z(15e3),Oe=new Z(6e4);setInterval(()=>{P.cleanup(),D.cleanup(),Oe.cleanup()},6e4);async function Pe(n,e=3,t=1e3){for(let o=0;o<e;o++)try{return await n()}catch(a){if(o===e-1)throw a;const l=t*Math.pow(2,o)+Math.random()*1e3;await new Promise(c=>setTimeout(c,l))}}async function V(n){const e=n.toBase58(),t=P.get(e);if(t)return t;if(!ce.isAllowed(`metadata_${e}`)){const o=_(e);return P.set(e,o,6e4),o}try{const o=await Pe(async()=>await $(async c=>await c.getParsedAccountInfo(n)),2,500);let a=_(e);o&&o.value&&o.value.data&&o.value.data.parsed&&(a.decimals=o.value.data.parsed.info.decimals);const l={"5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF":{name:"promptest",symbol:"PTEST",decimals:3},So11111111111111111111111111111111111111112:{name:"Wrapped SOL",symbol:"wSOL",decimals:9},EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v:{name:"USD Coin",symbol:"USDC",decimals:6},Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB:{name:"Tether USD",symbol:"USDT",decimals:6}};if(l[e])a={...a,...l[e],address:e};else try{const c=await De(n),d=await $(async m=>await m.getAccountInfo(c));if(d&&d.data){const m=Me(d.data);m&&(a.name=m.name||a.name,a.symbol=m.symbol||a.symbol)}}catch{}return P.set(e,a,6e5),a}catch{const a=_(e);return P.set(e,a,6e4),a}}function _(n){return{name:`Token ${n.slice(0,8)}...`,symbol:"UNK",decimals:9,address:n}}async function De(n){const e=new R("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),[t]=await R.findProgramAddress([Buffer.from("metadata"),e.toBuffer(),n.toBuffer()],e);return t}function Me(n){try{const e=Buffer.from(n);let t=1;if(t+=1,t+=32,t+=32,t+4>e.length)return null;const o=e.readUInt32LE(t);if(t+=4,t+o>e.length)return null;const a=e.subarray(t,t+o).toString("utf8").replace(/\0/g,"");if(t+=o,t+4>e.length)return null;const l=e.readUInt32LE(t);if(t+=4,t+l>e.length)return null;const c=e.subarray(t,t+l).toString("utf8").replace(/\0/g,"");return{name:a,symbol:c}}catch{return null}}function xe(n,e=null){const{name:t,symbol:o,address:a}=n,l=`${a.slice(0,4)}...${a.slice(-4)}`;return e!==null?`${e.toLocaleString()} ${o} (${t})`:`${o} - ${t} (${l})`}const Ue={connect:async n=>{const e=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<=768;if(r.connected)return{type:"info",content:`🔗 WALLET ALREADY CONNECTED
Address: ${r.address}`};const t=n[0];if(!t)return{type:"error",content:`📄 USAGE: connect <phantom|solflare>

Available wallets:
• phantom - Phantom wallet
• solflare - Solflare wallet${e?`

📱 MOBILE TIP:
Open this terminal in your mobile wallet browser for direct connection`:""}`};const a=(()=>{if(typeof window>"u")return null;switch(t){case"phantom":return window?.phantom?.solana||(window?.solana?.isPhantom?window.solana:null);case"solflare":return window?.solflare;default:return null}})();if(!a)return{type:"error",content:`❌ WALLET NOT FOUND

Wallet: ${t}
Solution: Install wallet extension or try another wallet

Available: phantom, solflare`};try{const c=(await a.connect()).publicKey||a.publicKey,d=c.toString();let m=0;try{m=await $(async v=>await v.getBalance(c)/G)}catch(v){console.warn("Error fetching SOL balance with all endpoints:",v.message);try{m=await le.getBalance(c)/G}catch(b){console.error("Direct connection also failed:",b.message)}}let y=0;try{y=await $(async v=>(await v.getParsedTokenAccountsByOwner(c,{programId:Q})).value.filter(({account:E})=>E.data.parsed.info.tokenAmount.uiAmount>0).length)}catch(v){console.warn("Error fetching token accounts with all endpoints:",v.message)}r.connected=!0,r.address=d,r.balance=m,r.provider=a,r.walletType=t,r.tokenCount=y,r.connectionTime=new Date().toISOString(),r.isReal=!0;const S=O(),T={type:t.toUpperCase(),address:d,shortAddress:`${d.slice(0,4)}...${d.slice(-4)}`,balance:m.toFixed(4),tokenAccounts:y};return{type:"result",content:`✅ ${T.type} WALLET CONNECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Address: ${T.shortAddress}
Full:    ${T.address}
Balance: ${T.balance} SOL
Tokens:  ${T.tokenAccounts} SPL accounts

⚡ Real wallet connected!
Network: ${S.network.toUpperCase()}

Next: 'balance' for updated data | 'walletinfo' for details`}}catch(l){return console.error("Wallet connection error:",l),{type:"error",content:`❌ CONNECTION FAILED

Wallet: ${t}
Error: ${l.message}

Try: Check wallet extension is unlocked`}}},disconnect:async()=>{if(!r.connected)return{type:"error",content:"🔌 No wallet connected"};try{r.provider?.disconnect&&await r.provider.disconnect()}catch(n){console.warn("Error during wallet disconnection:",n.message)}return r.connected=!1,r.address=null,r.balance=0,r.stakedAmount=0,r.rewards=0,r.rewardToken=null,r.provider=null,r.walletType=null,r.tokenCount=0,r.connectionTime=null,r.isReal=!1,s.level=0,{type:"result",content:`✅ WALLET DISCONNECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Connection terminated successfully.
All wallet data cleared.`}},balance:async()=>{if(!r.connected)return{type:"error",content:"🔒 Connect wallet first using: connect"};if(!r.provider||!r.provider.publicKey)return{type:"error",content:"Wallet provider not available. Try reconnecting."};try{const n=await $(async c=>await c.getBalance(r.provider.publicKey)/G);r.balance=n;const e=await $(async c=>(await c.getParsedTokenAccountsByOwner(r.provider.publicKey,{programId:Q})).value.map(({account:m})=>{const y=m.data.parsed.info,S=y.tokenAmount.uiAmount;return{mint:y.mint,amount:S}}).filter(m=>m.amount>0));let t="No SPL tokens";if(e.length>0)try{const d=e.slice(0,5).map(async y=>{try{const S=await V(new R(y.mint));return`${y.amount.toLocaleString()} ${S.symbol} (${S.name})`}catch{return`${y.mint.slice(0,8)}...: ${y.amount.toLocaleString()}`}});t=(await Promise.all(d)).join(`
`),e.length>5&&(t+=`
... and ${e.length-5} more tokens`)}catch(c){console.warn("Error fetching token metadata for balance:",c),t=e.slice(0,5).map(d=>`${d.mint.slice(0,8)}...: ${d.amount.toLocaleString()}`).join(`
`)}const a=O().isTestnet?"📱 DEVNET (testing)":"⚡ MAINNET",l=r.isReal?`${a} - Real data`:"📱 Simulated data";return{type:"result",content:`WALLET BALANCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOL:     ${r.balance.toFixed(4)}
${t}

${l}`}}catch(n){return console.error("❌ Balance fetch error:",n),{type:"error",content:`❌ BALANCE FETCH FAILED

All RPC endpoints failed.
Error: ${n.message}

Try: reconnecting wallet or check network`}}},tokeninfo:async n=>{if(!n[0])return{type:"error",content:`Usage: tokeninfo <token_address>
Example: tokeninfo 5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF`};try{const e=new R(n[0]),t=await V(e);return{type:"result",content:`TOKEN INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:     ${t.name}
Symbol:   ${t.symbol}
Decimals: ${t.decimals}
Address:  ${t.address}
Short:    ${t.address.slice(0,4)}...${t.address.slice(-4)}`}}catch(e){return{type:"error",content:`Invalid token address: ${n[0]}
Error: ${e.message}`}}},walletinfo:async()=>{if(!r.connected)return{type:"error",content:"No wallet connected. Use: connect <wallet>"};const n=r.connectionTime?new Date(r.connectionTime).toLocaleString():"Unknown",e=O(),t=r.isReal?"⚡":"📱",o=r.isReal?"REAL BLOCKCHAIN DATA":"SIMULATED DATA",a=e.isTestnet?"📱 DEVNET (Testing Network)":"⚡ MAINNET (Production Network)";return{type:"result",content:`${t} WALLET CONNECTION INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Wallet Type: ${r.walletType?.toUpperCase()||"Unknown"}
Address:     ${r.address}
Short:       ${r.address?.slice(0,4)}...${r.address?.slice(-4)}
Balance:     ${r.balance} SOL
Tokens:      ${r.tokenCount} SPL accounts
Connected:   ${n}
Data Type:   ${o}
Network:     ${a}

Provider:    ${r.provider?"Active":"None"}`}}};class Fe{static isValidNumber(e,t={}){const{min:o=0,max:a=1/0,allowDecimals:l=!0,maxDecimals:c=18}=t;typeof e=="string"&&(e=e.trim());const d=parseFloat(e);if(isNaN(d)||!isFinite(d))return{valid:!1,error:"Número inválido"};if(d<o)return{valid:!1,error:`Mínimo permitido: ${o}`};if(d>a)return{valid:!1,error:`Máximo permitido: ${a}`};if(!l&&d!==Math.floor(d))return{valid:!1,error:"No se permiten decimales"};if(l&&c>0){const m=e.toString().split(".")[1];if(m&&m.length>c)return{valid:!1,error:`Máximo ${c} decimales`}}return{valid:!0,value:d}}static isValidSolanaAddress(e){try{return new R(e),{valid:!0,address:e}}catch{return{valid:!1,error:"Dirección de Solana inválida"}}}static isValidCommand(e){return/^[a-zA-Z0-9\s\-_]+$/.test(e)?e.length>100?{valid:!1,error:"Comando demasiado largo"}:{valid:!0,command:e.trim()}:{valid:!1,error:"Comando contiene caracteres inválidos"}}static sanitizeString(e,t=1e3){return typeof e!="string"?"":e.replace(/[<>"']/g,"").replace(/javascript:/gi,"").replace(/data:/gi,"").substring(0,t).trim()}}function ee(n,e,t=9){const o=Fe.isValidNumber(n,{min:1e-9,max:e,allowDecimals:!0,maxDecimals:t});return o.valid&&o.value<.001?{valid:!1,error:"Cantidad muy pequeña para cubrir fees de red"}:o}const je={status:()=>r.connected?{type:"result",content:`STAKING STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Wallet:       ${r.address}
Staked:       ${r.stakedAmount} PROMPT
Rewards:      ${r.rewards} tokens
Pool APY:     15.2%
Reward Token: ${r.rewardToken||"Not configured"}`}:{type:"info",content:`STAKING STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Wallet:     Not connected
Staked:     0 PROMPT
Rewards:    0 tokens
Pool APY:   15.2%

Connect wallet to initialize staking protocol.`},stake:n=>{if(!r.connected)return{type:"error",content:"🔒 Connect wallet first using: connect"};if(!n.length)return{type:"error",content:`📄 USAGE: stake <amount>

Example: stake 100
Min amount: 0.001 PROMPT
Max amount: Your available balance`};const e=ee(n[0],r.balance||1e3,9);if(!e.valid)return{type:"error",content:`❌ Invalid amount: ${e.error}

Enter a valid number between 0.001 and ${r.balance||1e3}`};const t=e.value,o=(r.balance||1e3)-r.stakedAmount;if(t>o)return{type:"error",content:`🚫 Insufficient balance
Requested: ${t} PROMPT
Available: ${o.toFixed(4)} PROMPT`};r.stakedAmount+=t;const a=(t*.15/365).toFixed(6),l=r.stakedAmount.toFixed(4);return{type:"result",content:`✅ STAKING TRANSACTION COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Amount staked:     ${t} PROMPT
Total staked:      ${l} PROMPT
Daily rewards:     ${a} tokens
APY:               15.2%

Transaction processed successfully.`}},unstake:n=>{if(!r.connected)return{type:"error",content:"🔒 Connect wallet first using: connect"};if(!n.length)return{type:"error",content:`📄 USAGE: unstake <amount>

Example: unstake 50
Current staked: `+r.stakedAmount+" PROMPT"};const e=ee(n[0],r.stakedAmount,9);if(!e.valid)return{type:"error",content:`❌ Invalid amount: ${e.error}

Staked amount: ${r.stakedAmount} PROMPT`};const t=e.value;if(t>r.stakedAmount)return{type:"error",content:`🚫 Insufficient staked amount
Requested: ${t} PROMPT
Staked: ${r.stakedAmount} PROMPT`};r.stakedAmount-=t;const o=r.stakedAmount.toFixed(4);return{type:"result",content:`✅ UNSTAKING TRANSACTION COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Amount unstaked:   ${t} PROMPT
Remaining staked:  ${o} PROMPT

Tokens will be available in your wallet shortly.`}},claim:()=>{if(!r.connected)return{type:"error",content:"Connect wallet first using: connect"};if(r.rewards===0)return{type:"info",content:"No rewards available to claim."};const n=r.rewards;return r.rewards=0,{type:"result",content:`REWARDS CLAIMED

Tokens claimed:    ${n}
Transaction completed successfully.`}},rewards:()=>r.connected?{type:"result",content:`REWARDS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available:      ${r.rewards} tokens
Reward Token:   ${r.rewardToken||"Not configured"}
Daily Rate:     ${(r.stakedAmount*.15/365).toFixed(4)} tokens/day
Total Earned:   ${r.rewards} tokens`}:{type:"info",content:`REWARDS INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available:      0 tokens
Reward Token:   Any SPL token
Daily Rate:     15.2% APY

Wallet connection required for rewards access.`},apy:()=>({type:"result",content:`POOL STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Base APY:         15.2%
Bonus APY: +2.3% (PROMPT holders)
Total APY:        17.5%

Pool TVL:         $2,450,000
Active Stakers:   1,247
Average Stake:    1,965 PROMPT`}),pools:()=>({type:"result",content:`STAKING POOLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1] MAIN POOL - ACTIVE
    APY: 15.2% | TVL: $2.45M | Stakers: 1,247

[2] VIP POOL - DEVELOPMENT
    APY: 25.0% | Min: 10,000 PROMPT | Status: Soon

[3] LIGHTNING POOL - PLANNED
    APY: 8.5% | Instant unstake | Status: Development`})},Be={prompt:`
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
  `},Ke={profile:()=>{const n=C();return{type:"result",content:`USER PROFILE
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
Uptime:        ${Math.floor(Math.random()*24)}h ${Math.floor(Math.random()*60)}m`}),banner:()=>({type:"result",content:Be.prompt}),ping:()=>({type:"result",content:`NETWORK DIAGNOSTIC

Latency: 42ms
Status: Connected`}),time:()=>({type:"result",content:`SYSTEM TIME

Current: ${new Date().toLocaleString()}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`}),whoami:()=>{const n=C();return{type:"result",content:`USER IDENTIFICATION

User: Anonymous Staker #1337
Access Level: [${n.level}] ${n.name}
Clearance: ${n.description}`}}},We={flip:()=>({type:"result",content:`COIN FLIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${Math.random()<.5?"Heads":"Tails"}`}),dice:()=>({type:"result",content:`DICE ROLL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You rolled a ${Math.floor(Math.random()*6)+1}`})},He={clear:()=>({type:"clear",content:""}),reset:()=>(r.connected=!1,r.address=null,r.balance=0,r.stakedAmount=0,r.rewards=0,r.rewardToken=null,r.provider=null,s.level=0,s.commandCount=0,s.secretsFound=0,s.achievements=[],s.unlockedCommands=new Set(["help","about","version","banner","clear","time","ping","price","slot","flip","dice","connect"]),s.secretsFoundSet=new Set,{type:"clear",content:"SYSTEM RESET COMPLETE"}),levelup:n=>{const e=n[0]?parseInt(n[0]):4;if(isNaN(e)||e<0||e>4)return{type:"error",content:`📄 USAGE: levelup <0-4>

Levels:
0 = ANONYMOUS
1 = USER
2 = STAKER
3 = EXPERT
4 = HACKER`};const t=s.level,o=C();s.level=e,s.commandCount=e>=3?15:e*5,s.secretsFound=e>=4?3:0,e>0&&!r.connected&&(r.connected=!0,r.address="DEV1111111111111111111111111111111111111111",r.walletType="dev-wallet",r.balance=100,r.isReal=!1),e>1&&(r.stakedAmount=100,r.rewards=10.5),s.unlockedCommands=new Set(["help","about","version","banner","clear","time","ping","price","slot","flip","dice","connect"]),e>=1&&(s.unlockedCommands.add("disconnect"),s.unlockedCommands.add("balance"),s.unlockedCommands.add("walletinfo"),s.unlockedCommands.add("status"),s.unlockedCommands.add("stake"),s.unlockedCommands.add("tokeninfo")),e>=2&&(s.unlockedCommands.add("unstake"),s.unlockedCommands.add("claim"),s.unlockedCommands.add("rewards"),s.unlockedCommands.add("apy"),s.unlockedCommands.add("pools")),e>=3&&(s.unlockedCommands.add("debug"),s.unlockedCommands.add("health"),s.unlockedCommands.add("performance"),s.unlockedCommands.add("cache"),s.unlockedCommands.add("logs"),s.unlockedCommands.add("export"),s.unlockedCommands.add("dev"),s.unlockedCommands.add("whoami"),s.unlockedCommands.add("matrix")),e>=4&&(s.unlockedCommands.add("hack"),s.unlockedCommands.add("override"),s.unlockedCommands.add("decrypt"),s.unlockedCommands.add("easter"),s.unlockedCommands.add("ghost"),s.unlockedCommands.add("prompt"),s.secretsFoundSet.add("easter"),s.secretsFoundSet.add("matrix"),s.secretsFoundSet.add("ghost")),s.unlockedCommands.add("levelup"),s.unlockedCommands.add("reset");const a=C();return{type:"result",content:`🚀 DEVELOPMENT LEVEL UP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Level Changed: [${t}] ${o.name} → [${e}] ${a.name}
Commands: ${s.commandCount}
Secrets: ${s.secretsFound}
Unlocked Commands: ${Array.from(s.unlockedCommands).length}

🎮 All commands for level ${e} now available!
Use 'help' to see available commands.`}}},Ge={easter:()=>(s.secretsFoundSet.has("easter")||(s.secretsFoundSet.add("easter"),s.secretsFound++),{type:"result",content:`EASTER EGG FOUND!
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

"Building the future, one prompt at a time."`})},A={ERROR:0,WARN:1,INFO:2,DEBUG:3,TRACE:4};class W{constructor(e={}){this.level=e.level||A.INFO,this.enableConsole=e.enableConsole!==!1,this.enableStorage=e.enableStorage||!1,this.maxStorageSize=e.maxStorageSize||1e3,this.component=e.component||"APP",this.logs=[]}log(e,t,o=null,a=null){if(e>this.level)return;const c={timestamp:new Date().toISOString(),level:this.getLevelName(e),component:a||this.component,message:t,data:o?JSON.stringify(o):null,userAgent:navigator.userAgent,url:window.location.href};return this.enableConsole&&this.logToConsole(c),this.enableStorage&&this.storeLog(c),c}error(e,t=null,o=null){return this.log(A.ERROR,e,t,o)}warn(e,t=null,o=null){return this.log(A.WARN,e,t,o)}info(e,t=null,o=null){return this.log(A.INFO,e,t,o)}debug(e,t=null,o=null){return this.log(A.DEBUG,e,t,o)}trace(e,t=null,o=null){return this.log(A.TRACE,e,t,o)}getLevelName(e){return["ERROR","WARN","INFO","DEBUG","TRACE"][e]||"UNKNOWN"}logToConsole(){}getConsoleStyle(e){return{ERROR:"color: #ff4444; font-weight: bold",WARN:"color: #ffaa00; font-weight: bold",INFO:"color: #00ff41; font-weight: normal",DEBUG:"color: #44aaff; font-weight: normal",TRACE:"color: #888888; font-weight: normal"}[e]||""}storeLog(e){this.logs.push(e),this.logs.length>this.maxStorageSize&&(this.logs=this.logs.slice(-this.maxStorageSize));try{const t=this.logs.slice(-100);localStorage.setItem("terminal_logs",JSON.stringify(t))}catch{}}getLogs(e={}){let t=[...this.logs];if(e.level!==void 0&&(t=t.filter(o=>A[o.level]<=e.level)),e.component&&(t=t.filter(o=>o.component===e.component)),e.since){const o=new Date(e.since).getTime();t=t.filter(a=>new Date(a.timestamp).getTime()>=o)}return t}exportLogs(){return this.logs.map(t=>`${t.timestamp} [${t.level}] [${t.component}] ${t.message}${t.data?" "+t.data:""}`).join(`
`)}clearLogs(){this.logs=[];try{localStorage.removeItem("terminal_logs")}catch{}}loadPersistedLogs(){try{const e=localStorage.getItem("terminal_logs");e&&(this.logs=JSON.parse(e))}catch(e){this.warn("Failed to load persisted logs",{error:e.message})}}}class _e{constructor(e){this.logger=e,this.timers=new Map}startTimer(e){this.timers.set(e,{start:performance.now(),name:e})}endTimer(e,t=1e3){const o=this.timers.get(e);if(!o){this.logger.warn(`Timer "${e}" not found`);return}const a=performance.now()-o.start;return this.timers.delete(e),a>t?this.logger.warn(`Slow operation: ${e}`,{duration:`${a.toFixed(2)}ms`,threshold:`${t}ms`}):this.logger.debug(`Operation completed: ${e}`,{duration:`${a.toFixed(2)}ms`}),a}measureAsync(e,t,o=1e3){return async(...a)=>{this.startTimer(e);try{const l=await t(...a);return this.endTimer(e,o),l}catch(l){throw this.endTimer(e,o),this.logger.error(`Error in ${e}`,{error:l.message}),l}}}}const w=new W({level:A.INFO,enableConsole:!0,enableStorage:!0,component:"TERMINAL"}),te=new _e(w),ie=new W({level:A.INFO,enableConsole:!0,enableStorage:!0,component:"WALLET"}),de=new W({level:A.WARN,enableConsole:!0,enableStorage:!0,component:"RPC"}),z=new W({level:A.INFO,enableConsole:!0,enableStorage:!0,component:"COMMAND"});w.loadPersistedLogs();ie.loadPersistedLogs();de.loadPersistedLogs();z.loadPersistedLogs();window.addEventListener("error",n=>{w.error("Unhandled JavaScript error",{message:n.message,filename:n.filename,lineno:n.lineno,colno:n.colno,stack:n.error?.stack})});window.addEventListener("unhandledrejection",n=>{w.error("Unhandled promise rejection",{reason:n.reason?.toString(),stack:n.reason?.stack})});const L={command:(n,e,t=null)=>{const a=`${t?"❌":"✅"} Command: ${n}`,l={result:e,error:t,timestamp:Date.now()};t?z.error(a,l):z.info(a,l)},wallet:(n,e=null,t=null)=>{const o=`💰 Wallet: ${n}`,a={status:n,address:e,balance:t,timestamp:Date.now()};ie.info(o,a)},performance:(n,e,t=1e3)=>{const a=`${e>t?"🐌":"⚡"} ${n}: ${e.toFixed(2)}ms`;e>t?te.logger.warn(a,{operation:n,duration:e,threshold:t}):te.logger.debug(a,{operation:n,duration:e})},error:(n,e,t={})=>{const o=`❌ ${n}: ${e.message||e}`,a={context:n,error:e.message||e,stack:e.stack,...t,timestamp:Date.now()};w.error(o,a)},network:(n,e=null,t=null)=>{const o=`🌐 Network: ${n}`,a={status:n,rpc:e,latency:t,timestamp:Date.now()};de.info(o,a)},security:(n,e="info",t={})=>{const a=`${e==="error"?"🚨":e==="warn"?"⚠️":"🔒"} Security: ${n}`,l={event:n,severity:e,...t,timestamp:Date.now()};e==="error"?w.error(a,l):e==="warn"?w.warn(a,l):w.info(a,l)},mobile:(n,e={})=>{const t=`📱 Mobile: ${n}`,o={event:n,...e,timestamp:Date.now()};w.info(t,o)},exportForAI:()=>{const e=w.getLogs({since:new Date(Date.now()-18e5)}).map(t=>`[${t.timestamp}] ${t.level} ${t.component}: ${t.message}${t.data?` | Data: ${t.data}`:""}`).join(`
`);return console.log("🤖 Logs for AI Analysis:"),console.log(e),e}},F={debug:n=>{const e=n[0]||"system",t=C(),o=O(),a={system:{timestamp:new Date().toISOString(),userAgent:navigator.userAgent,url:window.location.href,performance:{memory:performance.memory?{used:Math.round(performance.memory.usedJSHeapSize/1024/1024)+"MB",total:Math.round(performance.memory.totalJSHeapSize/1024/1024)+"MB",limit:Math.round(performance.memory.jsHeapSizeLimit/1024/1024)+"MB"}:"Not available"}},wallet:{connected:r.connected,type:r.walletType,address:r.address,balance:r.balance,isReal:r.isReal,connectionTime:r.connectionTime},user:{level:t.level,name:t.name,commandCount:t.commandCount,secretsFound:t.secretsFound,unlockedCommands:Array.from(s.unlockedCommands).length},network:{...o,rpcHealth:"Unknown"}};let l;switch(e.toLowerCase()){case"wallet":l=JSON.stringify(a.wallet,null,2);break;case"user":l=JSON.stringify(a.user,null,2);break;case"network":l=JSON.stringify(a.network,null,2);break;default:l=JSON.stringify(a,null,2)}return{type:"result",content:`🔍 DEBUG INFO (${e.toUpperCase()})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${l}

Use: debug <system|wallet|user|network>`}},health:async()=>{const n=[];r.connected?n.push({component:"Wallet",status:"healthy",details:`${r.walletType} connected`}):n.push({component:"Wallet",status:"disconnected",details:"No wallet connected"});try{const o=O();n.push({component:"Network",status:"healthy",details:`Connected to ${o.network}`})}catch(o){n.push({component:"Network",status:"unhealthy",details:o.message})}const e=n.map(o=>`${o.status==="healthy"?"✅":o.status==="warning"?"⚠️":"❌"} ${o.component}: ${o.status}
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

Use: cache <status|stats|clear>`}),logs:n=>{const e=n[0]||"all";try{let t;switch(e.toLowerCase()){case"wallet":t=w.getLogs({component:"WALLET"}).slice(-10);break;case"command":t=w.getLogs({component:"COMMAND"}).slice(-10);break;case"error":t=w.getLogs().filter(a=>a.level==="ERROR").slice(-10);break;case"recent":t=w.getLogs({since:new Date(Date.now()-5*60*1e3)}).slice(-15);break;default:t=w.getLogs().slice(-10)}if(t.length===0)return{type:"result",content:`📋 No logs found for filter: ${e}`};const o=t.map(a=>`[${new Date(a.timestamp).toLocaleTimeString()}] ${a.level} ${a.component}: ${a.message}`).join(`
`);return{type:"result",content:`📋 SYSTEM LOGS (${e.toUpperCase()})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${o}

Filters: all, wallet, command, error, recent`}}catch(t){return L.error("logs command",t),{type:"error",content:"Error retrieving logs: "+t.message}}},export:n=>{const e=n[0]||"logs";try{let t;switch(e.toLowerCase()){case"logs":t=L.exportForAI();break;case"debug":{const o={timestamp:new Date().toISOString(),wallet:r,user:C(),network:O(),performance:{memory:performance.memory?{used:Math.round(performance.memory.usedJSHeapSize/1024/1024),total:Math.round(performance.memory.totalJSHeapSize/1024/1024)}:"Not available"}};t=JSON.stringify(o,null,2);break}case"ai":{const o={logs:w.getLogs({since:new Date(Date.now()-18e5)}),wallet:r,user:C(),commands:s,errors:w.getLogs().filter(a=>a.level==="ERROR")};t=JSON.stringify(o,null,2);break}default:return{type:"error",content:"Unknown export type. Use: logs, debug, ai"}}return navigator.clipboard&&t&&navigator.clipboard.writeText(t).catch(()=>{}),{type:"result",content:`📤 EXPORTED ${e.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Data exported to console and clipboard
Check browser console for full output

Types: logs, debug, ai`}}catch(t){return L.error("export command",t),{type:"error",content:"Export failed: "+t.message}}},ai:n=>{switch((n[0]||"status").toLowerCase()){case"status":return{type:"result",content:`🤖 AI DEVELOPMENT MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: Active
Logging: Enhanced
Debug Mode: OFF

Commands:
• ai export - Export data for AI
• ai logs - Recent logs for analysis
• ai debug - Debug info for AI
• ai clear - Clear all logs`};case"export":return L.exportForAI(),{type:"result",content:`🤖 Data exported to console for AI analysis
Check browser console for formatted logs`};case"logs":return{type:"result",content:`🤖 Recent Logs for AI:
${w.getLogs({since:new Date(Date.now()-6e5)}).slice(-5).map(a=>`${a.level}: ${a.message}`).join(`
`)}`};case"debug":{const t={wallet:r.connected?"Connected":"Disconnected",user:C().name,commands:s.commandCount,errors:w.getLogs().filter(o=>o.level==="ERROR").length};return{type:"result",content:`🤖 Debug Summary:
${JSON.stringify(t,null,2)}`}}case"clear":return w.clearLogs(),{type:"result",content:"🤖 All logs cleared for fresh AI analysis"};default:return{type:"result",content:"AI commands: status, export, logs, debug, clear"}}}};Object.keys(F).forEach(n=>{const e=F[n];F[n]=(...t)=>{const o=performance.now();try{const a=e(...t),l=performance.now()-o;return L.command(`diagnostic:${n}`,a,null),L.performance(`diagnostic:${n}`,l),a}catch(a){throw L.command(`diagnostic:${n}`,null,a),L.error(`diagnostic:${n}`,a),a}}});async function Ye(){if(!r.connected||!r.address)return!1;const n=`token_balance_${r.address}_${q.toBase58()}`,e=D.get(n);if(e!==null)return e;if(!ce.isAllowed(r.address))return D.get(n)||!1;try{const t=new R(r.address),o=await we(q,t),a=await $(async l=>{const c=await l.getTokenAccountBalance(o),d=BigInt(c.value.amount),m=c.value.decimals,y=se*10n**BigInt(m);return d>=y});return D.set(n,a),a}catch{return D.set(n,!1,5e3),!1}}const j={...Ue,...je,...Ke,...We,...He,...Ge,...F},B={h:"help",c:"clear",r:"reset",p:"profile",st:"status",bal:"balance",conn:"connect",disc:"disconnect",winfo:"walletinfo",tinfo:"tokeninfo",ti:"tokeninfo",pr:"price",sol:"price",sl:"slot",coin:"flip",roll:"dice",diag:"debug",healthcheck:"health",perf:"performance",lvl:"levelup",maxlevel:"levelup",unlock:"levelup","???":"easter","👻":"ghost",debug:"dev"};j.help=()=>({type:"result",content:`AVAILABLE COMMANDS
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
TAB: autocomplete │ UP/DOWN: command history │ ALIASES: ${Object.keys(B).filter(e=>!["???","👻","debug","lvl","maxlevel","unlock"].includes(e)).join(", ")}`});async function qe(n){const e=C(),[t,...o]=n.toLowerCase().split(" "),a=B[t]||t;if(!j[a])return{type:"error",content:`❌ Command not found: ${t}
Type "help" for available commands`};if(!s.unlockedCommands.has(a))return{type:"error",content:`🔒 Command "${a}" not unlocked at your current level
Current: [${e.level}] ${e.name}`};if(!new Set(["help","connect","disconnect","clear","banner","version","about","ping","time","whoami","logs","debug","health","performance","cache","export"]).has(a))try{if(!await Ye()){const d=await V(q),m=xe(d);return{type:"error",content:`🚫 ACCESS DENIED
Requires at least ${se} ${d.symbol} tokens

Token: ${m}`}}}catch(c){return{type:"error",content:`🚫 ACCESS DENIED
Token verification failed: ${c.message}`}}s.commandCount++;try{const c=await j[a](o);if(Re(a)){const m=C(),y=`

━━━ 🎉 LEVEL UP! 🎉 ━━━
Access Level: [${m.level}] ${m.name}
New commands unlocked! Use 'help' to see them.`;c.content+=y}return c}catch(c){return{type:"error",content:`💥 Command execution failed: ${c.message}
Please try again or contact support.`}}}function Ve(n){const e=[...Object.keys(j),...Object.keys(B)],t=new Set(["easter","matrix","ghost","dev","prompt","???","👻","debug","hack","override","decrypt"]);return e.filter(a=>s.unlockedCommands.has(B[a]||a)&&!t.has(a)).filter(a=>a.startsWith(n.toLowerCase()))}function ze(){const n=["TIP: Use TAB for command autocompletion","TIP: Use UP/DOWN arrows to navigate command history","TIP: Type 'apy' to see current staking rewards","TIP: You can stake any amount of PROMPT tokens","TIP: Rewards can be claimed in any SPL token","TIP: Type 'banner' for ASCII art display","TIP: Jupiter Aggregator ensures optimal swap rates","TIP: Use aliases like 'h' for help, 'c' for clear","TIP: Commands are case-insensitive for convenience","TIP: Type 'profile' to check your progression","TIP: Type 'price' to check the current SOL price","TIP: Use 'flip' or 'dice' for a bit of fun","TIP: Hidden commands exist... try exploring!"];return n[Math.floor(Math.random()*n.length)]}function Je(){const[n,e]=f.useState([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:"Building a Solana staking dApp"},{type:"info",content:"Custom token staking - Earn rewards in any SPL token you choose"},{type:"info",content:'Type "help" to see available commands'}]),[t,o]=f.useState(""),[a,l]=f.useState([]),[c,d]=f.useState(-1),[m,y]=f.useState([]),[S,T]=f.useState(!1),[v,b]=f.useState(!1),E=f.useRef(null),I=f.useRef(null),h=f.useRef(null),g=f.useRef(!1);f.useEffect(()=>{const u=()=>{g.current=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<=768};return u(),window.addEventListener("resize",u),()=>window.removeEventListener("resize",u)},[]),f.useEffect(()=>{g.current||E.current?.focus()},[]),f.useEffect(()=>{if(!v&&!g.current){const u=setTimeout(()=>{E.current?.focus()},100);return()=>clearTimeout(u)}},[n,v]),f.useEffect(()=>{I.current&&((()=>{const p=I.current;p&&requestAnimationFrame(()=>{p.scrollTop=p.scrollHeight})})(),g.current||setTimeout(()=>{E.current?.focus()},10))},[n]),f.useEffect(()=>{if(t.trim()){const u=Ve(t.trim());y(u),T(u.length>0)}else T(!1)},[t]),f.useEffect(()=>((()=>{h.current&&clearTimeout(h.current);const p=g.current?6e4:3e4;h.current=setTimeout(()=>{e(k=>[...k,{type:"info",content:ze()}])},p)})(),()=>{h.current&&clearTimeout(h.current)}),[t,n]),f.useEffect(()=>{const u=p=>{if(g.current)return;const k=p.target.closest(".suggestion-item"),x=p.target.closest(".terminal-input"),N=p.target===I.current;!k&&!x&&!N&&!v&&setTimeout(()=>{E.current?.focus()},0)};return document.addEventListener("click",u),()=>{document.removeEventListener("click",u)}},[v]),f.useEffect(()=>{if(!g.current)return;const u=k=>{k.target.closest(".suggestion-item")||k.target.closest(".terminal-input")},p=k=>{k.target.closest(".suggestion-item")&&k.preventDefault()};return document.addEventListener("touchstart",u,{passive:!1}),document.addEventListener("touchend",p,{passive:!1}),()=>{document.removeEventListener("touchstart",u),document.removeEventListener("touchend",p)}},[]);const M=f.useCallback(async u=>{b(!0);const p=g.current?150:300;await new Promise(k=>setTimeout(k,Math.random()*p+100));try{return await qe(u)}finally{b(!1)}},[]),H=f.useCallback(async u=>{if(u.preventDefault(),!t.trim()||v)return;const p=t.trim(),k={type:"command",content:p};l(N=>[p,...N.slice(0,49)]),d(-1),["connect","stake","unstake","claim"].includes(p.split(" ")[0])?e(N=>[...N,k,{type:"loading",content:"Processing..."}]):e(N=>[...N,k]),o(""),T(!1),g.current&&E.current&&(E.current.blur(),setTimeout(()=>{E.current?.focus()},100));const x=await M(p);window.dispatchEvent(new CustomEvent("terminal-command",{detail:{command:p}})),x.type==="clear"?e([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:'Type "help" to see available commands'}]):e(N=>{const U=[...N];return U[U.length-1]?.type==="loading"&&U.pop(),[...U,x]})},[t,v,M]),ue=f.useCallback(u=>{if(g.current){if(u.key==="Enter"){H(u);return}if(u.key==="Escape"){T(!1),o(""),d(-1);return}return}if(u.key==="ArrowUp"){if(u.preventDefault(),c<a.length-1){const p=c+1;d(p),o(a[p])}}else if(u.key==="ArrowDown")if(u.preventDefault(),c>0){const p=c-1;d(p),o(a[p])}else c===0&&(d(-1),o(""));else if(u.key==="Tab"){if(u.preventDefault(),m.length===1)o(m[0]+" "),T(!1);else if(m.length>1){const p=m.join("  ");e(k=>[...k,{type:"command",content:t},{type:"suggestion",content:p}]),o("")}}else u.key==="Escape"?(T(!1),o(""),d(-1)):u.ctrlKey&&u.key==="c"?(u.preventDefault(),o(""),e(p=>[...p,{type:"info",content:"^C"}])):u.ctrlKey&&u.key==="l"&&(u.preventDefault(),e([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:'Type "help" to see available commands'}]))},[c,a,m,t,H]),me=f.useCallback(u=>{o(u+" "),T(!1),g.current&&setTimeout(()=>{E.current?.focus()},100)},[]),pe=f.useCallback(u=>{e(p=>[...p,u])},[]),fe=f.useCallback(()=>{e([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:'Type "help" to see available commands'}])},[]);return{history:n,input:t,suggestions:m,showSuggestions:S,isLoading:v,isMobile:g.current,inputRef:E,outputRef:I,setInput:o,handleSubmit:H,handleKeyDown:ue,handleSuggestionClick:me,addMessage:pe,clearTerminal:fe}}function Ze(){const[n,e]=f.useState({uptime:"0h 0m",commandsExecuted:0,memoryUsage:0,networkLatency:0});return f.useEffect(()=>{const t=Date.now();let o=0;const a=()=>{const m=Date.now()-t,y=Math.floor(m/(1e3*60*60)),S=Math.floor(m%(1e3*60*60)/(1e3*60));e({uptime:`${y}h ${S}m`,commandsExecuted:o,memoryUsage:Math.floor(Math.random()*20+40),networkLatency:Math.floor(Math.random()*50+20)})},l=()=>{o++,a()},c=setInterval(a,1e4);return window.addEventListener("terminal-command",l),a(),()=>{clearInterval(c),window.removeEventListener("terminal-command",l)}},[]),i.jsxs("div",{className:"system-stats",children:[i.jsxs("div",{className:"stat-item",children:[i.jsx("span",{className:"stat-label",children:"UPTIME"}),i.jsx("span",{className:"stat-value",children:n.uptime})]}),i.jsxs("div",{className:"stat-item",children:[i.jsx("span",{className:"stat-label",children:"CMDS"}),i.jsx("span",{className:"stat-value",children:n.commandsExecuted})]}),i.jsxs("div",{className:"stat-item",children:[i.jsx("span",{className:"stat-label",children:"MEM"}),i.jsxs("span",{className:"stat-value",children:[n.memoryUsage,"%"]})]}),i.jsxs("div",{className:"stat-item",children:[i.jsx("span",{className:"stat-label",children:"PING"}),i.jsxs("span",{className:"stat-value",children:[n.networkLatency,"ms"]})]})]})}function Xe(){const[n,e]=f.useState(C()),{history:t,input:o,suggestions:a,showSuggestions:l,isLoading:c,isMobile:d,inputRef:m,outputRef:y,setInput:S,handleSubmit:T,handleKeyDown:v,handleSuggestionClick:b}=Je();f.useEffect(()=>{const h=()=>{e(C())};return window.addEventListener("terminal-command",h),()=>window.removeEventListener("terminal-command",h)},[]),f.useEffect(()=>{if(!d)return;const h=g=>{(g.target.closest(".terminal-output")||g.target.closest(".terminal-input-area"))&&g.touches.length===1&&g.touches[0].clientY>0&&g.preventDefault()};return document.addEventListener("touchmove",h,{passive:!1}),()=>{document.removeEventListener("touchmove",h)}},[d]);const E=(h,g)=>{switch(h.type){case"welcome":return i.jsx("div",{className:"welcome-text",children:i.jsx("div",{className:"ascii-art",children:h.content})},g);case"command":return i.jsxs("div",{className:"command-line",children:[i.jsx("span",{className:"terminal-prompt",children:"$PROMPT>"}),i.jsx("span",{className:"command-text",children:h.content})]},g);case"result":return i.jsx("div",{className:"command-result success-text",children:h.content},g);case"error":return i.jsxs("div",{className:"command-result error-text",children:["↯ ",h.content]},g);case"info":return i.jsxs("div",{className:"command-result info-text",children:["… ",h.content]},g);case"suggestion":return i.jsxs("div",{className:"command-result suggestion-text",children:["⋄ ",h.content]},g);case"loading":return i.jsxs("div",{className:"command-result loading-text",children:[i.jsx("span",{className:"loading-spinner",children:"▒░▒"})," ",h.content]},g);default:return i.jsx("div",{className:"command-result",children:h.content},g)}},I=()=>{d&&m.current&&setTimeout(()=>{m.current?.scrollIntoView({behavior:"smooth",block:"center"})},300)};return i.jsxs("div",{className:"terminal-container",children:[i.jsxs("div",{className:"terminal-header",children:[i.jsx("div",{className:"terminal-logo",children:i.jsx("span",{className:"logo-text",children:"PROMPT"})}),!d&&i.jsx("div",{className:"terminal-subtitle",children:"SOLANA STAKING PROTOCOL"}),i.jsxs("div",{className:"terminal-user-info",children:[i.jsxs("div",{className:"user-level",style:{color:n.color},children:["[",n.level,"] ",n.name]}),i.jsxs("div",{className:"terminal-status",children:[i.jsx("span",{className:"status-dot"}),i.jsx("span",{className:"status-text",children:"OFFLINE"})]})]})]}),i.jsx(Ze,{}),i.jsx("div",{className:"terminal-output",ref:y,role:"log","aria-live":"polite","aria-label":"Terminal output",children:t.map(E)}),i.jsxs("div",{className:"terminal-input-area",children:[l&&a.length>0&&i.jsx("div",{className:"suggestions",role:"listbox","aria-label":"Command suggestions",children:a.map((h,g)=>i.jsx("span",{className:"suggestion-item",onClick:()=>b(h),onTouchEnd:M=>{M.preventDefault(),b(h)},role:"option",tabIndex:d?0:-1,"aria-label":`Suggestion: ${h}`,children:h},g))}),i.jsxs("form",{onSubmit:T,className:"terminal-input-container",children:[i.jsx("span",{className:"terminal-prompt",children:"$PROMPT>"}),i.jsx("input",{ref:m,type:"text",value:o,onChange:h=>S(h.target.value),onKeyDown:v,onFocus:I,className:"terminal-input",placeholder:c?"Processing...":"Enter command...",autoComplete:"off",autoCorrect:"off",autoCapitalize:"off",spellCheck:"false",disabled:c,"aria-label":"Command input",inputMode:"text",enterKeyHint:"send"}),!d&&i.jsx("span",{className:"cursor",children:"_"})]}),i.jsx("div",{className:"terminal-footer",children:i.jsx("span",{className:"footer-text",children:d?"TAB: autocomplete | Type 'help' for commands":"TAB: autocomplete | UP/DOWN: history | ESC: clear | CTRL+C: interrupt"})})]})]})}function Qe(){return i.jsx(Xe,{})}Y.createRoot(document.getElementById("root")).render(i.jsx(he.StrictMode,{children:i.jsx(Qe,{})}));
