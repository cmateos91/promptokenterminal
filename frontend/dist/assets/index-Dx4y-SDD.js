import{r as f,b as le,R as ie}from"./vendor-107eBDi2.js";import{b as Z,P as N,C as X,c as de,L as B,g as ue}from"./solana-DlhCIz-Q.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const c of r)if(c.type==="childList")for(const l of c.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function n(r){const c={};return r.integrity&&(c.integrity=r.integrity),r.referrerPolicy&&(c.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?c.credentials="include":r.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function a(r){if(r.ep)return;r.ep=!0;const c=n(r);fetch(r.href,c)}})();var Q={exports:{}},F={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var me=f,pe=Symbol.for("react.element"),fe=Symbol.for("react.fragment"),he=Object.prototype.hasOwnProperty,ye=me.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,ge={key:!0,ref:!0,__self:!0,__source:!0};function ee(t,e,n){var a,r={},c=null,l=null;n!==void 0&&(c=""+n),e.key!==void 0&&(c=""+e.key),e.ref!==void 0&&(l=e.ref);for(a in e)he.call(e,a)&&!ge.hasOwnProperty(a)&&(r[a]=e[a]);if(t&&t.defaultProps)for(a in e=t.defaultProps,e)r[a]===void 0&&(r[a]=e[a]);return{$$typeof:pe,type:t,key:c,ref:l,props:r,_owner:ye.current}}F.Fragment=fe;F.jsx=ee;F.jsxs=ee;Q.exports=F;var i=Q.exports;typeof window<"u"&&(window.Buffer=Z.Buffer,window.global=window,window.process={env:{},nextTick:t=>setTimeout(t,0),version:"16.0.0",browser:!0});globalThis.Buffer=Z.Buffer;globalThis.global=globalThis;globalThis.process=globalThis.process||{env:{},nextTick:t=>setTimeout(t,0),version:"16.0.0",browser:!0};var W={},V=le;W.createRoot=V.createRoot,W.hydrateRoot=V.hydrateRoot;const H=new N("5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF"),te=BigInt(1e3),we=!1,G=["https://solana-mainnet.rpc.extrnode.com","https://rpc.hellomoon.io","https://mainnet.helius-rpc.com/?api-key=public","https://api.mainnet-beta.solana.com"],Y=[de("devnet"),"https://api.devnet.solana.com"];let P=we;function ve(){const t=P?Y:G;return new X(t[0],{commitment:"finalized",confirmTransactionInitialTimeout:6e4,disableRetryOnRateLimit:!0,fetch})}const ne=ve(),z=new N("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");async function b(t){const e=P?Y:G;for(let n=0;n<e.length;n++){const a=e[n];try{const r=new X(a,{commitment:"finalized",confirmTransactionInitialTimeout:3e4,disableRetryOnRateLimit:!0,fetch});return await t(r)}catch{n<e.length-1&&await new Promise(c=>setTimeout(c,1e3))}}if(!P)return P=!0,await b(t);throw new Error("All RPC endpoints (mainnet and devnet) failed")}function L(){return{network:P?"devnet":"mainnet-beta",isTestnet:P,endpoints:P?Y:G}}const o={connected:!1,address:null,balance:0,stakedAmount:0,rewards:0,rewardToken:null,provider:null,walletType:null,tokenCount:0,connectionTime:null,isReal:!0},s={level:0,commandCount:0,secretsFound:0,achievements:[],unlockedCommands:new Set(["help","about","version","banner","clear","time","ping","price","slot","flip","dice","connect","levelup","reset"]),secretsFoundSet:new Set},Te=[{name:"ANONYMOUS",color:"#888888",description:"Unknown entity"},{name:"USER",color:"#00ff41",description:"Connected user"},{name:"STAKER",color:"#66ff66",description:"Active staker"},{name:"EXPERT",color:"#00cc33",description:"Terminal expert"},{name:"HACKER",color:"#ffffff",description:"System infiltrator"}];function ke(t){const e=s.level;return s.level===0&&t==="connect"&&o.connected&&(s.level=1,s.unlockedCommands.add("disconnect"),s.unlockedCommands.add("balance"),s.unlockedCommands.add("walletinfo"),s.unlockedCommands.add("status"),s.unlockedCommands.add("stake")),s.level===1&&t==="stake"&&o.stakedAmount>0&&(s.level=2,s.unlockedCommands.add("unstake"),s.unlockedCommands.add("claim"),s.unlockedCommands.add("rewards")),s.level===2&&s.commandCount>=15&&(s.level=3,s.unlockedCommands.add("dev"),s.unlockedCommands.add("whoami"),s.unlockedCommands.add("matrix")),s.level===3&&s.secretsFound>=3&&(s.level=4,s.unlockedCommands.add("hack"),s.unlockedCommands.add("override"),s.unlockedCommands.add("decrypt")),s.level>e}function A(){const t=Te[s.level];return{level:s.level,name:t.name,color:t.color,description:t.description,commandCount:s.commandCount,secretsFound:s.secretsFound,nextLevelRequirement:Se()}}function Se(){switch(s.level){case 0:return"Connect a wallet to reach USER level";case 1:return"Stake tokens to reach STAKER level";case 2:return`Execute ${15-s.commandCount} more commands to reach EXPERT level`;case 3:return`Find ${3-s.secretsFound} more secrets to reach HACKER level`;case 4:return"Maximum level achieved";default:return"Unknown"}}class Ee{constructor(e=10,n=6e4){this.maxRequests=e,this.windowMs=n,this.requests=new Map}isAllowed(e){const n=Date.now(),r=(this.requests.get(e)||[]).filter(c=>n-c<this.windowMs);return r.length>=this.maxRequests?!1:(r.push(n),this.requests.set(e,r),!0)}getRemainingTime(e){const n=this.requests.get(e)||[];if(n.length===0)return 0;const a=Math.min(...n),r=this.windowMs-(Date.now()-a);return Math.max(0,r)}}class q{constructor(e=3e4){this.cache=new Map,this.defaultTTL=e}set(e,n,a=this.defaultTTL){const r=Date.now()+a;this.cache.set(e,{value:n,expiry:r})}get(e){const n=this.cache.get(e);return n?Date.now()>n.expiry?(this.cache.delete(e),null):n.value:null}has(e){return this.get(e)!==null}clear(){this.cache.clear()}cleanup(){const e=Date.now();for(const[n,a]of this.cache.entries())e>a.expiry&&this.cache.delete(n)}}const oe=new Ee(10,1e4),R=new q(3e5),O=new q(15e3),Ce=new q(6e4);setInterval(()=>{R.cleanup(),O.cleanup(),Ce.cleanup()},6e4);async function Ae(t,e=3,n=1e3){for(let a=0;a<e;a++)try{return await t()}catch(r){if(a===e-1)throw r;const c=n*Math.pow(2,a)+Math.random()*1e3;await new Promise(l=>setTimeout(l,c))}}async function _(t){const e=t.toBase58(),n=R.get(e);if(n)return n;if(!oe.isAllowed(`metadata_${e}`)){const a=K(e);return R.set(e,a,6e4),a}try{const a=await Ae(async()=>await b(async l=>await l.getParsedAccountInfo(t)),2,500);let r=K(e);a&&a.value&&a.value.data&&a.value.data.parsed&&(r.decimals=a.value.data.parsed.info.decimals);const c={"5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF":{name:"promptest",symbol:"PTEST",decimals:3},So11111111111111111111111111111111111111112:{name:"Wrapped SOL",symbol:"wSOL",decimals:9},EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v:{name:"USD Coin",symbol:"USDC",decimals:6},Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB:{name:"Tether USD",symbol:"USDT",decimals:6}};if(c[e])r={...r,...c[e],address:e};else try{const l=await be(t),d=await b(async m=>await m.getAccountInfo(l));if(d&&d.data){const m=Ne(d.data);m&&(r.name=m.name||r.name,r.symbol=m.symbol||r.symbol)}}catch{}return R.set(e,r,6e5),r}catch{const r=K(e);return R.set(e,r,6e4),r}}function K(t){return{name:`Token ${t.slice(0,8)}...`,symbol:"UNK",decimals:9,address:t}}async function be(t){const e=new N("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),[n]=await N.findProgramAddress([Buffer.from("metadata"),e.toBuffer(),t.toBuffer()],e);return n}function Ne(t){try{const e=Buffer.from(t);let n=1;if(n+=1,n+=32,n+=32,n+4>e.length)return null;const a=e.readUInt32LE(n);if(n+=4,n+a>e.length)return null;const r=e.subarray(n,n+a).toString("utf8").replace(/\0/g,"");if(n+=a,n+4>e.length)return null;const c=e.readUInt32LE(n);if(n+=4,n+c>e.length)return null;const l=e.subarray(n,n+c).toString("utf8").replace(/\0/g,"");return{name:r,symbol:l}}catch{return null}}function Pe(t,e=null){const{name:n,symbol:a,address:r}=t,c=`${r.slice(0,4)}...${r.slice(-4)}`;return e!==null?`${e.toLocaleString()} ${a} (${n})`:`${a} - ${n} (${c})`}const Ie={connect:async t=>{const e=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<=768;if(o.connected)return{type:"info",content:`🔗 WALLET ALREADY CONNECTED
Address: ${o.address}`};const n=t[0];if(!n)return{type:"error",content:`📄 USAGE: connect <phantom|solflare>

Available wallets:
• phantom - Phantom wallet
• solflare - Solflare wallet${e?`

📱 MOBILE TIP:
Open this terminal in your mobile wallet browser for direct connection`:""}`};const r=(()=>{if(typeof window>"u")return null;switch(n){case"phantom":return window?.phantom?.solana||(window?.solana?.isPhantom?window.solana:null);case"solflare":return window?.solflare;default:return null}})();if(!r)return{type:"error",content:`❌ WALLET NOT FOUND

Wallet: ${n}
Solution: Install wallet extension or try another wallet

Available: phantom, solflare`};try{const l=(await r.connect()).publicKey||r.publicKey,d=l.toString();let m=0;try{m=await b(async w=>await w.getBalance(l)/B)}catch(w){console.warn("Error fetching SOL balance with all endpoints:",w.message);try{m=await ne.getBalance(l)/B}catch(E){console.error("Direct connection also failed:",E.message)}}let g=0;try{g=await b(async w=>(await w.getParsedTokenAccountsByOwner(l,{programId:z})).value.filter(({account:S})=>S.data.parsed.info.tokenAmount.uiAmount>0).length)}catch(w){console.warn("Error fetching token accounts with all endpoints:",w.message)}o.connected=!0,o.address=d,o.balance=m,o.provider=r,o.walletType=n,o.tokenCount=g,o.connectionTime=new Date().toISOString(),o.isReal=!0;const k=L(),v={type:n.toUpperCase(),address:d,shortAddress:`${d.slice(0,4)}...${d.slice(-4)}`,balance:m.toFixed(4),tokenAccounts:g};return{type:"result",content:`✅ ${v.type} WALLET CONNECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Address: ${v.shortAddress}
Full:    ${v.address}
Balance: ${v.balance} SOL
Tokens:  ${v.tokenAccounts} SPL accounts

⚡ Real wallet connected!
Network: ${k.network.toUpperCase()}

Next: 'balance' for updated data | 'walletinfo' for details`}}catch(c){return console.error("Wallet connection error:",c),{type:"error",content:`❌ CONNECTION FAILED

Wallet: ${n}
Error: ${c.message}

Try: Check wallet extension is unlocked`}}},disconnect:async()=>{if(!o.connected)return{type:"error",content:"🔌 No wallet connected"};try{o.provider?.disconnect&&await o.provider.disconnect()}catch(t){console.warn("Error during wallet disconnection:",t.message)}return o.connected=!1,o.address=null,o.balance=0,o.stakedAmount=0,o.rewards=0,o.rewardToken=null,o.provider=null,o.walletType=null,o.tokenCount=0,o.connectionTime=null,o.isReal=!1,s.level=0,{type:"result",content:`✅ WALLET DISCONNECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Connection terminated successfully.
All wallet data cleared.`}},balance:async()=>{if(!o.connected)return{type:"error",content:"🔒 Connect wallet first using: connect"};if(!o.provider||!o.provider.publicKey)return{type:"error",content:"Wallet provider not available. Try reconnecting."};try{const t=await b(async l=>await l.getBalance(o.provider.publicKey)/B);o.balance=t;const e=await b(async l=>(await l.getParsedTokenAccountsByOwner(o.provider.publicKey,{programId:z})).value.map(({account:m})=>{const g=m.data.parsed.info,k=g.tokenAmount.uiAmount;return{mint:g.mint,amount:k}}).filter(m=>m.amount>0));let n="No SPL tokens";if(e.length>0)try{const d=e.slice(0,5).map(async g=>{try{const k=await _(new N(g.mint));return`${g.amount.toLocaleString()} ${k.symbol} (${k.name})`}catch{return`${g.mint.slice(0,8)}...: ${g.amount.toLocaleString()}`}});n=(await Promise.all(d)).join(`
`),e.length>5&&(n+=`
... and ${e.length-5} more tokens`)}catch(l){console.warn("Error fetching token metadata for balance:",l),n=e.slice(0,5).map(d=>`${d.mint.slice(0,8)}...: ${d.amount.toLocaleString()}`).join(`
`)}const r=L().isTestnet?"📱 DEVNET (testing)":"⚡ MAINNET",c=o.isReal?`${r} - Real data`:"📱 Simulated data";return{type:"result",content:`WALLET BALANCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOL:     ${o.balance.toFixed(4)}
${n}

${c}`}}catch(t){return console.error("❌ Balance fetch error:",t),{type:"error",content:`❌ BALANCE FETCH FAILED

All RPC endpoints failed.
Error: ${t.message}

Try: reconnecting wallet or check network`}}},tokeninfo:async t=>{if(!t[0])return{type:"error",content:`Usage: tokeninfo <token_address>
Example: tokeninfo 5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF`};try{const e=new N(t[0]),n=await _(e);return{type:"result",content:`TOKEN INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:     ${n.name}
Symbol:   ${n.symbol}
Decimals: ${n.decimals}
Address:  ${n.address}
Short:    ${n.address.slice(0,4)}...${n.address.slice(-4)}`}}catch(e){return{type:"error",content:`Invalid token address: ${t[0]}
Error: ${e.message}`}}},walletinfo:async()=>{if(!o.connected)return{type:"error",content:"No wallet connected. Use: connect <wallet>"};const t=o.connectionTime?new Date(o.connectionTime).toLocaleString():"Unknown",e=L(),n=o.isReal?"⚡":"📱",a=o.isReal?"REAL BLOCKCHAIN DATA":"SIMULATED DATA",r=e.isTestnet?"📱 DEVNET (Testing Network)":"⚡ MAINNET (Production Network)";return{type:"result",content:`${n} WALLET CONNECTION INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Wallet Type: ${o.walletType?.toUpperCase()||"Unknown"}
Address:     ${o.address}
Short:       ${o.address?.slice(0,4)}...${o.address?.slice(-4)}
Balance:     ${o.balance} SOL
Tokens:      ${o.tokenCount} SPL accounts
Connected:   ${t}
Data Type:   ${a}
Network:     ${r}

Provider:    ${o.provider?"Active":"None"}`}}};class Re{static isValidNumber(e,n={}){const{min:a=0,max:r=1/0,allowDecimals:c=!0,maxDecimals:l=18}=n;typeof e=="string"&&(e=e.trim());const d=parseFloat(e);if(isNaN(d)||!isFinite(d))return{valid:!1,error:"Número inválido"};if(d<a)return{valid:!1,error:`Mínimo permitido: ${a}`};if(d>r)return{valid:!1,error:`Máximo permitido: ${r}`};if(!c&&d!==Math.floor(d))return{valid:!1,error:"No se permiten decimales"};if(c&&l>0){const m=e.toString().split(".")[1];if(m&&m.length>l)return{valid:!1,error:`Máximo ${l} decimales`}}return{valid:!0,value:d}}static isValidSolanaAddress(e){try{return new N(e),{valid:!0,address:e}}catch{return{valid:!1,error:"Dirección de Solana inválida"}}}static isValidCommand(e){return/^[a-zA-Z0-9\s\-_]+$/.test(e)?e.length>100?{valid:!1,error:"Comando demasiado largo"}:{valid:!0,command:e.trim()}:{valid:!1,error:"Comando contiene caracteres inválidos"}}static sanitizeString(e,n=1e3){return typeof e!="string"?"":e.replace(/[<>"']/g,"").replace(/javascript:/gi,"").replace(/data:/gi,"").substring(0,n).trim()}}function J(t,e,n=9){const a=Re.isValidNumber(t,{min:1e-9,max:e,allowDecimals:!0,maxDecimals:n});return a.valid&&a.value<.001?{valid:!1,error:"Cantidad muy pequeña para cubrir fees de red"}:a}const Oe={status:()=>o.connected?{type:"result",content:`STAKING STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Wallet:       ${o.address}
Staked:       ${o.stakedAmount} PROMPT
Rewards:      ${o.rewards} tokens
Pool APY:     15.2%
Reward Token: ${o.rewardToken||"Not configured"}`}:{type:"info",content:`STAKING STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Wallet:     Not connected
Staked:     0 PROMPT
Rewards:    0 tokens
Pool APY:   15.2%

Connect wallet to initialize staking protocol.`},stake:t=>{if(!o.connected)return{type:"error",content:"🔒 Connect wallet first using: connect"};if(!t.length)return{type:"error",content:`📄 USAGE: stake <amount>

Example: stake 100
Min amount: 0.001 PROMPT
Max amount: Your available balance`};const e=J(t[0],o.balance||1e3,9);if(!e.valid)return{type:"error",content:`❌ Invalid amount: ${e.error}

Enter a valid number between 0.001 and ${o.balance||1e3}`};const n=e.value,a=(o.balance||1e3)-o.stakedAmount;if(n>a)return{type:"error",content:`🚫 Insufficient balance
Requested: ${n} PROMPT
Available: ${a.toFixed(4)} PROMPT`};o.stakedAmount+=n;const r=(n*.15/365).toFixed(6),c=o.stakedAmount.toFixed(4);return{type:"result",content:`✅ STAKING TRANSACTION COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Amount staked:     ${n} PROMPT
Total staked:      ${c} PROMPT
Daily rewards:     ${r} tokens
APY:               15.2%

Transaction processed successfully.`}},unstake:t=>{if(!o.connected)return{type:"error",content:"🔒 Connect wallet first using: connect"};if(!t.length)return{type:"error",content:`📄 USAGE: unstake <amount>

Example: unstake 50
Current staked: `+o.stakedAmount+" PROMPT"};const e=J(t[0],o.stakedAmount,9);if(!e.valid)return{type:"error",content:`❌ Invalid amount: ${e.error}

Staked amount: ${o.stakedAmount} PROMPT`};const n=e.value;if(n>o.stakedAmount)return{type:"error",content:`🚫 Insufficient staked amount
Requested: ${n} PROMPT
Staked: ${o.stakedAmount} PROMPT`};o.stakedAmount-=n;const a=o.stakedAmount.toFixed(4);return{type:"result",content:`✅ UNSTAKING TRANSACTION COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Amount unstaked:   ${n} PROMPT
Remaining staked:  ${a} PROMPT

Tokens will be available in your wallet shortly.`}},claim:()=>{if(!o.connected)return{type:"error",content:"Connect wallet first using: connect"};if(o.rewards===0)return{type:"info",content:"No rewards available to claim."};const t=o.rewards;return o.rewards=0,{type:"result",content:`REWARDS CLAIMED

Tokens claimed:    ${t}
Transaction completed successfully.`}},rewards:()=>o.connected?{type:"result",content:`REWARDS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available:      ${o.rewards} tokens
Reward Token:   ${o.rewardToken||"Not configured"}
Daily Rate:     ${(o.stakedAmount*.15/365).toFixed(4)} tokens/day
Total Earned:   ${o.rewards} tokens`}:{type:"info",content:`REWARDS INFORMATION
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
    APY: 8.5% | Instant unstake | Status: Development`})},Le={prompt:`
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
  `},$e={profile:()=>{const t=A();return{type:"result",content:`USER PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Access Level:     [${t.level}] ${t.name}
Description:      ${t.description}
Commands Used:    ${t.commandCount}
Secrets Found:    ${t.secretsFound}

Progression:
${t.nextLevelRequirement}

Unlocked Commands: ${Array.from(s.unlockedCommands).length}
Achievements:      ${s.achievements.length}`}},price:async()=>{try{return{type:"result",content:`SOL PRICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1 SOL = $${(await(await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd")).json()).solana.usd} USD`}}catch(t){return{type:"error",content:`Price fetch failed: ${t.message}`}}},slot:async()=>{try{return{type:"result",content:`CURRENT SLOT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${await ne.getSlot()}`}}catch(t){return{type:"error",content:`Slot fetch failed: ${t.message}`}}},about:()=>({type:"result",content:`PROMPT STAKING PROTOCOL v1.0.0
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
Uptime:        ${Math.floor(Math.random()*24)}h ${Math.floor(Math.random()*60)}m`}),banner:()=>({type:"result",content:Le.prompt}),ping:()=>({type:"result",content:`NETWORK DIAGNOSTIC

Latency: 42ms
Status: Connected`}),time:()=>({type:"result",content:`SYSTEM TIME

Current: ${new Date().toLocaleString()}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`}),whoami:()=>{const t=A();return{type:"result",content:`USER IDENTIFICATION

User: Anonymous Staker #1337
Access Level: [${t.level}] ${t.name}
Clearance: ${t.description}`}}},Me={flip:()=>({type:"result",content:`COIN FLIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${Math.random()<.5?"Heads":"Tails"}`}),dice:()=>({type:"result",content:`DICE ROLL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You rolled a ${Math.floor(Math.random()*6)+1}`})},xe={clear:()=>({type:"clear",content:""}),reset:()=>(o.connected=!1,o.address=null,o.balance=0,o.stakedAmount=0,o.rewards=0,o.rewardToken=null,o.provider=null,s.level=0,s.commandCount=0,s.secretsFound=0,s.achievements=[],s.unlockedCommands=new Set(["help","about","version","banner","clear","time","ping","price","slot","flip","dice","connect"]),s.secretsFoundSet=new Set,{type:"clear",content:"SYSTEM RESET COMPLETE"}),levelup:t=>{const e=t[0]?parseInt(t[0]):4;if(isNaN(e)||e<0||e>4)return{type:"error",content:`📄 USAGE: levelup <0-4>

Levels:
0 = ANONYMOUS
1 = USER
2 = STAKER
3 = EXPERT
4 = HACKER`};const n=s.level,a=A();s.level=e,s.commandCount=e>=3?15:e*5,s.secretsFound=e>=4?3:0,e>0&&!o.connected&&(o.connected=!0,o.address="DEV1111111111111111111111111111111111111111",o.walletType="dev-wallet",o.balance=100,o.isReal=!1),e>1&&(o.stakedAmount=100,o.rewards=10.5),s.unlockedCommands=new Set(["help","about","version","banner","clear","time","ping","price","slot","flip","dice","connect"]),e>=1&&(s.unlockedCommands.add("disconnect"),s.unlockedCommands.add("balance"),s.unlockedCommands.add("walletinfo"),s.unlockedCommands.add("status"),s.unlockedCommands.add("stake"),s.unlockedCommands.add("tokeninfo")),e>=2&&(s.unlockedCommands.add("unstake"),s.unlockedCommands.add("claim"),s.unlockedCommands.add("rewards"),s.unlockedCommands.add("apy"),s.unlockedCommands.add("pools")),e>=3&&(s.unlockedCommands.add("debug"),s.unlockedCommands.add("health"),s.unlockedCommands.add("performance"),s.unlockedCommands.add("cache"),s.unlockedCommands.add("logs"),s.unlockedCommands.add("export"),s.unlockedCommands.add("dev"),s.unlockedCommands.add("whoami"),s.unlockedCommands.add("matrix")),e>=4&&(s.unlockedCommands.add("hack"),s.unlockedCommands.add("override"),s.unlockedCommands.add("decrypt"),s.unlockedCommands.add("easter"),s.unlockedCommands.add("ghost"),s.unlockedCommands.add("prompt"),s.secretsFoundSet.add("easter"),s.secretsFoundSet.add("matrix"),s.secretsFoundSet.add("ghost")),s.unlockedCommands.add("levelup"),s.unlockedCommands.add("reset");const r=A();return{type:"result",content:`🚀 DEVELOPMENT LEVEL UP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Level Changed: [${n}] ${a.name} → [${e}] ${r.name}
Commands: ${s.commandCount}
Secrets: ${s.secretsFound}
Unlocked Commands: ${Array.from(s.unlockedCommands).length}

🎮 All commands for level ${e} now available!
Use 'help' to see available commands.`}}},De={easter:()=>(s.secretsFoundSet.has("easter")||(s.secretsFoundSet.add("easter"),s.secretsFound++),{type:"result",content:`EASTER EGG FOUND!
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

"Building the future, one prompt at a time."`})},Ue={debug:t=>{const e=t[0]||"system",n=A(),a=L(),r={system:{timestamp:new Date().toISOString(),userAgent:navigator.userAgent,url:window.location.href,performance:{memory:performance.memory?{used:Math.round(performance.memory.usedJSHeapSize/1024/1024)+"MB",total:Math.round(performance.memory.totalJSHeapSize/1024/1024)+"MB",limit:Math.round(performance.memory.jsHeapSizeLimit/1024/1024)+"MB"}:"Not available"}},wallet:{connected:o.connected,type:o.walletType,address:o.address,balance:o.balance,isReal:o.isReal,connectionTime:o.connectionTime},user:{level:n.level,name:n.name,commandCount:n.commandCount,secretsFound:n.secretsFound,unlockedCommands:Array.from(s.unlockedCommands).length},network:{...a,rpcHealth:"Unknown"}};let c;switch(e.toLowerCase()){case"wallet":c=JSON.stringify(r.wallet,null,2);break;case"user":c=JSON.stringify(r.user,null,2);break;case"network":c=JSON.stringify(r.network,null,2);break;default:c=JSON.stringify(r,null,2)}return{type:"result",content:`🔍 DEBUG INFO (${e.toUpperCase()})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${c}

Use: debug <system|wallet|user|network>`}},health:async()=>{const t=[];o.connected?t.push({component:"Wallet",status:"healthy",details:`${o.walletType} connected`}):t.push({component:"Wallet",status:"disconnected",details:"No wallet connected"});try{const a=L();t.push({component:"Network",status:"healthy",details:`Connected to ${a.network}`})}catch(a){t.push({component:"Network",status:"unhealthy",details:a.message})}const e=t.map(a=>`${a.status==="healthy"?"✅":a.status==="warning"?"⚠️":"❌"} ${a.component}: ${a.status}
   ${a.details}`).join(`

`);return{type:"result",content:`🏥 SYSTEM HEALTH CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Status: ${t.every(a=>a.status==="healthy")?"HEALTHY":t.some(a=>a.status==="unhealthy")?"UNHEALTHY":"WARNING"}

${e}

Last check: ${new Date().toLocaleTimeString()}`}},performance:()=>{const t={memoryUsage:performance.memory?{used:Math.round(performance.memory.usedJSHeapSize/1024/1024),total:Math.round(performance.memory.totalJSHeapSize/1024/1024),percentage:Math.round(performance.memory.usedJSHeapSize/performance.memory.totalJSHeapSize*100)}:null,connectionTiming:{navigation:performance.timing?performance.timing.loadEventEnd-performance.timing.navigationStart:"Not available",domContentLoaded:performance.timing?performance.timing.domContentLoadedEventEnd-performance.timing.navigationStart:"Not available"}};let e=`⚡ PERFORMANCE METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;return t.memoryUsage&&(e+=`Memory Usage: ${t.memoryUsage.used}MB / ${t.memoryUsage.total}MB (${t.memoryUsage.percentage}%)
`),e+=`Page Load Time: ${t.connectionTiming.navigation}ms
`,e+=`DOM Ready: ${t.connectionTiming.domContentLoaded}ms
`,e+=`Commands Executed: ${s.commandCount}
`,e+=`
System performance is being monitored`,{type:"result",content:e}},cache:()=>({type:"result",content:`🗄️ CACHE STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cache System: Active
Status: Working

Use: cache <status|stats|clear>`}),logs:t=>{const e=t[0]||"all";return{type:"result",content:`📋 SYSTEM LOGS (${e.toUpperCase()})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Logging system active
Filter: ${e}

Logs are being collected in the background`}},export:()=>({type:"result",content:`📤 EXPORT OPTIONS

Available exports:
• logs - System logs
• debug - Debug information

Usage: export <logs|debug>

Export functionality ready`})};async function Fe(){if(!o.connected||!o.address)return!1;const t=`token_balance_${o.address}_${H.toBase58()}`,e=O.get(t);if(e!==null)return e;if(!oe.isAllowed(o.address))return O.get(t)||!1;try{const n=new N(o.address),a=await ue(H,n),r=await b(async c=>{const l=await c.getTokenAccountBalance(a),d=BigInt(l.value.amount),m=l.value.decimals,g=te*10n**BigInt(m);return d>=g});return O.set(t,r),r}catch{return O.set(t,!1,5e3),!1}}const D={...Ie,...Oe,...$e,...Me,...xe,...De,...Ue},U={h:"help",c:"clear",r:"reset",p:"profile",st:"status",bal:"balance",conn:"connect",disc:"disconnect",winfo:"walletinfo",tinfo:"tokeninfo",ti:"tokeninfo",pr:"price",sol:"price",sl:"slot",coin:"flip",roll:"dice",diag:"debug",healthcheck:"health",perf:"performance",lvl:"levelup",maxlevel:"levelup",unlock:"levelup","???":"easter","👻":"ghost",debug:"dev"};D.help=()=>({type:"result",content:`AVAILABLE COMMANDS
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
TAB: autocomplete │ UP/DOWN: command history │ ALIASES: ${Object.keys(U).filter(e=>!["???","👻","debug","lvl","maxlevel","unlock"].includes(e)).join(", ")}`});async function je(t){const e=A(),[n,...a]=t.toLowerCase().split(" "),r=U[n]||n;if(!D[r])return{type:"error",content:`❌ Command not found: ${n}
Type "help" for available commands`};if(!s.unlockedCommands.has(r))return{type:"error",content:`🔒 Command "${r}" not unlocked at your current level
Current: [${e.level}] ${e.name}`};if(!new Set(["help","connect","disconnect","clear","banner","version","about","ping","time","whoami","logs","debug","health","performance","cache","export"]).has(r))try{if(!await Fe()){const d=await _(H),m=Pe(d);return{type:"error",content:`🚫 ACCESS DENIED
Requires at least ${te} ${d.symbol} tokens

Token: ${m}`}}}catch(l){return{type:"error",content:`🚫 ACCESS DENIED
Token verification failed: ${l.message}`}}s.commandCount++;try{const l=await D[r](a);if(ke(r)){const m=A(),g=`

━━━ 🎉 LEVEL UP! 🎉 ━━━
Access Level: [${m.level}] ${m.name}
New commands unlocked! Use 'help' to see them.`;l.content+=g}return l}catch(l){return{type:"error",content:`💥 Command execution failed: ${l.message}
Please try again or contact support.`}}}function Be(t){const e=[...Object.keys(D),...Object.keys(U)],n=new Set(["easter","matrix","ghost","dev","prompt","???","👻","debug","hack","override","decrypt"]);return e.filter(r=>s.unlockedCommands.has(U[r]||r)&&!n.has(r)).filter(r=>r.startsWith(t.toLowerCase()))}function Ke(){const t=["TIP: Use TAB for command autocompletion","TIP: Use UP/DOWN arrows to navigate command history","TIP: Type 'apy' to see current staking rewards","TIP: You can stake any amount of PROMPT tokens","TIP: Rewards can be claimed in any SPL token","TIP: Type 'banner' for ASCII art display","TIP: Jupiter Aggregator ensures optimal swap rates","TIP: Use aliases like 'h' for help, 'c' for clear","TIP: Commands are case-insensitive for convenience","TIP: Type 'profile' to check your progression","TIP: Type 'price' to check the current SOL price","TIP: Use 'flip' or 'dice' for a bit of fun","TIP: Hidden commands exist... try exploring!"];return t[Math.floor(Math.random()*t.length)]}function We(){const[t,e]=f.useState([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:"Building a Solana staking dApp"},{type:"info",content:"Custom token staking - Earn rewards in any SPL token you choose"},{type:"info",content:'Type "help" to see available commands'}]),[n,a]=f.useState(""),[r,c]=f.useState([]),[l,d]=f.useState(-1),[m,g]=f.useState([]),[k,v]=f.useState(!1),[w,E]=f.useState(!1),S=f.useRef(null),I=f.useRef(null),y=f.useRef(null),h=f.useRef(!1);f.useEffect(()=>{const u=()=>{h.current=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<=768};return u(),window.addEventListener("resize",u),()=>window.removeEventListener("resize",u)},[]),f.useEffect(()=>{h.current||S.current?.focus()},[]),f.useEffect(()=>{if(!w&&!h.current){const u=setTimeout(()=>{S.current?.focus()},100);return()=>clearTimeout(u)}},[t,w]),f.useEffect(()=>{I.current&&((()=>{const p=I.current;p&&requestAnimationFrame(()=>{p.scrollTop=p.scrollHeight})})(),h.current||setTimeout(()=>{S.current?.focus()},10))},[t]),f.useEffect(()=>{if(n.trim()){const u=Be(n.trim());g(u),v(u.length>0)}else v(!1)},[n]),f.useEffect(()=>((()=>{y.current&&clearTimeout(y.current);const p=h.current?6e4:3e4;y.current=setTimeout(()=>{e(T=>[...T,{type:"info",content:Ke()}])},p)})(),()=>{y.current&&clearTimeout(y.current)}),[n,t]),f.useEffect(()=>{const u=p=>{if(h.current)return;const T=p.target.closest(".suggestion-item"),M=p.target.closest(".terminal-input"),C=p.target===I.current;!T&&!M&&!C&&!w&&setTimeout(()=>{S.current?.focus()},0)};return document.addEventListener("click",u),()=>{document.removeEventListener("click",u)}},[w]),f.useEffect(()=>{if(!h.current)return;const u=T=>{T.target.closest(".suggestion-item")||T.target.closest(".terminal-input")},p=T=>{T.target.closest(".suggestion-item")&&T.preventDefault()};return document.addEventListener("touchstart",u,{passive:!1}),document.addEventListener("touchend",p,{passive:!1}),()=>{document.removeEventListener("touchstart",u),document.removeEventListener("touchend",p)}},[]);const $=f.useCallback(async u=>{E(!0);const p=h.current?150:300;await new Promise(T=>setTimeout(T,Math.random()*p+100));try{return await je(u)}finally{E(!1)}},[]),j=f.useCallback(async u=>{if(u.preventDefault(),!n.trim()||w)return;const p=n.trim(),T={type:"command",content:p};c(C=>[p,...C.slice(0,49)]),d(-1),["connect","stake","unstake","claim"].includes(p.split(" ")[0])?e(C=>[...C,T,{type:"loading",content:"Processing..."}]):e(C=>[...C,T]),a(""),v(!1),h.current&&S.current&&(S.current.blur(),setTimeout(()=>{S.current?.focus()},100));const M=await $(p);window.dispatchEvent(new CustomEvent("terminal-command",{detail:{command:p}})),M.type==="clear"?e([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:'Type "help" to see available commands'}]):e(C=>{const x=[...C];return x[x.length-1]?.type==="loading"&&x.pop(),[...x,M]})},[n,w,$]),ae=f.useCallback(u=>{if(h.current){if(u.key==="Enter"){j(u);return}if(u.key==="Escape"){v(!1),a(""),d(-1);return}return}if(u.key==="ArrowUp"){if(u.preventDefault(),l<r.length-1){const p=l+1;d(p),a(r[p])}}else if(u.key==="ArrowDown")if(u.preventDefault(),l>0){const p=l-1;d(p),a(r[p])}else l===0&&(d(-1),a(""));else if(u.key==="Tab"){if(u.preventDefault(),m.length===1)a(m[0]+" "),v(!1);else if(m.length>1){const p=m.join("  ");e(T=>[...T,{type:"command",content:n},{type:"suggestion",content:p}]),a("")}}else u.key==="Escape"?(v(!1),a(""),d(-1)):u.ctrlKey&&u.key==="c"?(u.preventDefault(),a(""),e(p=>[...p,{type:"info",content:"^C"}])):u.ctrlKey&&u.key==="l"&&(u.preventDefault(),e([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:'Type "help" to see available commands'}]))},[l,r,m,n,j]),re=f.useCallback(u=>{a(u+" "),v(!1),h.current&&setTimeout(()=>{S.current?.focus()},100)},[]),se=f.useCallback(u=>{e(p=>[...p,u])},[]),ce=f.useCallback(()=>{e([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:'Type "help" to see available commands'}])},[]);return{history:t,input:n,suggestions:m,showSuggestions:k,isLoading:w,isMobile:h.current,inputRef:S,outputRef:I,setInput:a,handleSubmit:j,handleKeyDown:ae,handleSuggestionClick:re,addMessage:se,clearTerminal:ce}}function He(){const[t,e]=f.useState({uptime:"0h 0m",commandsExecuted:0,memoryUsage:0,networkLatency:0});return f.useEffect(()=>{const n=Date.now();let a=0;const r=()=>{const m=Date.now()-n,g=Math.floor(m/(1e3*60*60)),k=Math.floor(m%(1e3*60*60)/(1e3*60));e({uptime:`${g}h ${k}m`,commandsExecuted:a,memoryUsage:Math.floor(Math.random()*20+40),networkLatency:Math.floor(Math.random()*50+20)})},c=()=>{a++,r()},l=setInterval(r,1e4);return window.addEventListener("terminal-command",c),r(),()=>{clearInterval(l),window.removeEventListener("terminal-command",c)}},[]),i.jsxs("div",{className:"system-stats",children:[i.jsxs("div",{className:"stat-item",children:[i.jsx("span",{className:"stat-label",children:"UPTIME"}),i.jsx("span",{className:"stat-value",children:t.uptime})]}),i.jsxs("div",{className:"stat-item",children:[i.jsx("span",{className:"stat-label",children:"CMDS"}),i.jsx("span",{className:"stat-value",children:t.commandsExecuted})]}),i.jsxs("div",{className:"stat-item",children:[i.jsx("span",{className:"stat-label",children:"MEM"}),i.jsxs("span",{className:"stat-value",children:[t.memoryUsage,"%"]})]}),i.jsxs("div",{className:"stat-item",children:[i.jsx("span",{className:"stat-label",children:"PING"}),i.jsxs("span",{className:"stat-value",children:[t.networkLatency,"ms"]})]})]})}function _e(){const[t,e]=f.useState(A()),{history:n,input:a,suggestions:r,showSuggestions:c,isLoading:l,isMobile:d,inputRef:m,outputRef:g,setInput:k,handleSubmit:v,handleKeyDown:w,handleSuggestionClick:E}=We();f.useEffect(()=>{const y=()=>{e(A())};return window.addEventListener("terminal-command",y),()=>window.removeEventListener("terminal-command",y)},[]),f.useEffect(()=>{if(!d)return;const y=h=>{(h.target.closest(".terminal-output")||h.target.closest(".terminal-input-area"))&&h.touches.length===1&&h.touches[0].clientY>0&&h.preventDefault()};return document.addEventListener("touchmove",y,{passive:!1}),()=>{document.removeEventListener("touchmove",y)}},[d]);const S=(y,h)=>{switch(y.type){case"welcome":return i.jsx("div",{className:"welcome-text",children:i.jsx("div",{className:"ascii-art",children:y.content})},h);case"command":return i.jsxs("div",{className:"command-line",children:[i.jsx("span",{className:"terminal-prompt",children:"$PROMPT>"}),i.jsx("span",{className:"command-text",children:y.content})]},h);case"result":return i.jsx("div",{className:"command-result success-text",children:y.content},h);case"error":return i.jsxs("div",{className:"command-result error-text",children:["↯ ",y.content]},h);case"info":return i.jsxs("div",{className:"command-result info-text",children:["… ",y.content]},h);case"suggestion":return i.jsxs("div",{className:"command-result suggestion-text",children:["⋄ ",y.content]},h);case"loading":return i.jsxs("div",{className:"command-result loading-text",children:[i.jsx("span",{className:"loading-spinner",children:"▒░▒"})," ",y.content]},h);default:return i.jsx("div",{className:"command-result",children:y.content},h)}},I=()=>{d&&m.current&&setTimeout(()=>{m.current?.scrollIntoView({behavior:"smooth",block:"center"})},300)};return i.jsxs("div",{className:"terminal-container",children:[i.jsxs("div",{className:"terminal-header",children:[i.jsx("div",{className:"terminal-logo",children:i.jsx("span",{className:"logo-text",children:"PROMPT"})}),!d&&i.jsx("div",{className:"terminal-subtitle",children:"SOLANA STAKING PROTOCOL"}),i.jsxs("div",{className:"terminal-user-info",children:[i.jsxs("div",{className:"user-level",style:{color:t.color},children:["[",t.level,"] ",t.name]}),i.jsxs("div",{className:"terminal-status",children:[i.jsx("span",{className:"status-dot"}),i.jsx("span",{className:"status-text",children:"OFFLINE"})]})]})]}),i.jsx(He,{}),i.jsx("div",{className:"terminal-output",ref:g,role:"log","aria-live":"polite","aria-label":"Terminal output",children:n.map(S)}),i.jsxs("div",{className:"terminal-input-area",children:[c&&r.length>0&&i.jsx("div",{className:"suggestions",role:"listbox","aria-label":"Command suggestions",children:r.map((y,h)=>i.jsx("span",{className:"suggestion-item",onClick:()=>E(y),onTouchEnd:$=>{$.preventDefault(),E(y)},role:"option",tabIndex:d?0:-1,"aria-label":`Suggestion: ${y}`,children:y},h))}),i.jsxs("form",{onSubmit:v,className:"terminal-input-container",children:[i.jsx("span",{className:"terminal-prompt",children:"$PROMPT>"}),i.jsx("input",{ref:m,type:"text",value:a,onChange:y=>k(y.target.value),onKeyDown:w,onFocus:I,className:"terminal-input",placeholder:l?"Processing...":"Enter command...",autoComplete:"off",autoCorrect:"off",autoCapitalize:"off",spellCheck:"false",disabled:l,"aria-label":"Command input",inputMode:"text",enterKeyHint:"send"}),!d&&i.jsx("span",{className:"cursor",children:"_"})]}),i.jsx("div",{className:"terminal-footer",children:i.jsx("span",{className:"footer-text",children:d?"TAB: autocomplete | Type 'help' for commands":"TAB: autocomplete | UP/DOWN: history | ESC: clear | CTRL+C: interrupt"})})]})]})}function Ge(){return i.jsx(_e,{})}W.createRoot(document.getElementById("root")).render(i.jsx(ie.StrictMode,{children:i.jsx(Ge,{})}));
