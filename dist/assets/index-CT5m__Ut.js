import{r as m,b as X,R as ee}from"./vendor-107eBDi2.js";import{b as Y,P as A,C as H,c as ne,L as D,g as te}from"./solana-DlhCIz-Q.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const i of c.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function o(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerPolicy&&(c.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?c.credentials="include":a.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(a){if(a.ep)return;a.ep=!0;const c=o(a);fetch(a.href,c)}})();var q={exports:{}},$={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var oe=m,se=Symbol.for("react.element"),ae=Symbol.for("react.fragment"),re=Object.prototype.hasOwnProperty,ce=oe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,le={key:!0,ref:!0,__self:!0,__source:!0};function V(n,e,o){var s,a={},c=null,i=null;o!==void 0&&(c=""+o),e.key!==void 0&&(c=""+e.key),e.ref!==void 0&&(i=e.ref);for(s in e)re.call(e,s)&&!le.hasOwnProperty(s)&&(a[s]=e[s]);if(n&&n.defaultProps)for(s in e=n.defaultProps,e)a[s]===void 0&&(a[s]=e[s]);return{$$typeof:se,type:n,key:c,ref:i,props:a,_owner:ce.current}}$.Fragment=ae;$.jsx=V;$.jsxs=V;q.exports=$;var l=q.exports;typeof window<"u"&&(window.Buffer=Y.Buffer,window.global=window,window.process={env:{},nextTick:n=>setTimeout(n,0),version:"16.0.0",browser:!0});globalThis.Buffer=Y.Buffer;globalThis.global=globalThis;globalThis.process=globalThis.process||{env:{},nextTick:n=>setTimeout(n,0),version:"16.0.0",browser:!0};var M={},_=X;M.createRoot=_.createRoot,M.hydrateRoot=_.hydrateRoot;const U=new A("5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF"),j=5000n,ie=!0,B=[ne("devnet"),"https://api.devnet.solana.com"];let de=ie;function ue(){const n=B;return new H(n[0],{commitment:"finalized",confirmTransactionInitialTimeout:6e4,disableRetryOnRateLimit:!0,fetch})}const F=ue(),x=new A("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");async function v(n){const e=B,o="DEVNET";for(let s=0;s<e.length;s++){const a=e[s];try{console.log(`🔄 Trying ${o} RPC ${s+1}/${e.length}: ${a}`);const c=new H(a,{commitment:"finalized",confirmTransactionInitialTimeout:3e4,disableRetryOnRateLimit:!0,fetch}),i=await n(c);return console.log(`✅ ${o} RPC ${a} succeeded`),i}catch(c){console.warn(`❌ ${o} RPC ${a} failed:`,c.message),s<e.length-1&&await new Promise(i=>setTimeout(i,1e3))}}throw new Error("All RPC endpoints (mainnet and devnet) failed")}function G(){return{network:"devnet",isTestnet:de,endpoints:B}}let t={connected:!1,address:null,balance:0,stakedAmount:0,rewards:0,rewardToken:null,provider:null,walletType:null,tokenCount:0,connectionTime:null,isReal:!0},r={level:0,commandCount:0,secretsFound:0,achievements:[],unlockedCommands:new Set(["help","about","version","banner","clear","time","ping","price","slot","flip","dice","connect"]),secretsFoundSet:new Set};const me=[{name:"ANONYMOUS",color:"#888888",description:"Unknown entity"},{name:"USER",color:"#00ff41",description:"Connected user"},{name:"STAKER",color:"#66ff66",description:"Active staker"},{name:"EXPERT",color:"#00cc33",description:"Terminal expert"},{name:"HACKER",color:"#ffffff",description:"System infiltrator"}];function pe(n){const e=r.level;return r.level===0&&n==="connect"&&t.connected&&(r.level=1,r.unlockedCommands.add("disconnect"),r.unlockedCommands.add("balance"),r.unlockedCommands.add("walletinfo"),r.unlockedCommands.add("status"),r.unlockedCommands.add("stake")),r.level===1&&n==="stake"&&t.stakedAmount>0&&(r.level=2,r.unlockedCommands.add("unstake"),r.unlockedCommands.add("claim"),r.unlockedCommands.add("rewards")),r.level===2&&r.commandCount>=15&&(r.level=3,r.unlockedCommands.add("dev"),r.unlockedCommands.add("whoami"),r.unlockedCommands.add("matrix")),r.level===3&&r.secretsFound>=3&&(r.level=4,r.unlockedCommands.add("hack"),r.unlockedCommands.add("override"),r.unlockedCommands.add("decrypt")),r.level>e}function P(){const n=me[r.level];return{level:r.level,name:n.name,color:n.color,description:n.description,commandCount:r.commandCount,secretsFound:r.secretsFound,nextLevelRequirement:fe()}}function fe(){switch(r.level){case 0:return"Connect a wallet to reach USER level";case 1:return"Stake tokens to reach STAKER level";case 2:return`Execute ${15-r.commandCount} more commands to reach EXPERT level`;case 3:return`Find ${3-r.secretsFound} more secrets to reach HACKER level`;case 4:return"Maximum level achieved";default:return"Unknown"}}const I=new Map;async function K(n){const e=n.toBase58();if(I.has(e))return I.get(e);try{const o=await v(async c=>await c.getParsedAccountInfo(n));let s={name:"Unknown Token",symbol:"UNK",decimals:9,address:e};o&&o.value&&o.value.data&&o.value.data.parsed&&(s.decimals=o.value.data.parsed.info.decimals);try{const c=await ye(n),i=await v(async d=>await d.getAccountInfo(c));if(i&&i.data){const d=Te(i.data);d&&(s.name=d.name||s.name,s.symbol=d.symbol||s.symbol)}}catch(c){console.warn("Could not fetch token metadata:",c.message)}const a={"5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF":{name:"PROMPT Test Token",symbol:"PROMPT",decimals:9},So11111111111111111111111111111111111111112:{name:"Wrapped SOL",symbol:"wSOL",decimals:9},EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v:{name:"USD Coin",symbol:"USDC",decimals:6},Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB:{name:"Tether USD",symbol:"USDT",decimals:6}};return a[e]&&(s={...s,...a[e],address:e}),I.set(e,s),s}catch(o){console.error("Error fetching token metadata:",o);const s={name:`Token ${e.slice(0,8)}...`,symbol:"UNK",decimals:9,address:e};return I.set(e,s),s}}async function ye(n){const e=new A("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),[o]=await A.findProgramAddress([Buffer.from("metadata"),e.toBuffer(),n.toBuffer()],e);return o}function Te(n){try{const e=Buffer.from(n);let o=1;o+=1,o+=32,o+=32;const s=e.readUInt32LE(o);o+=4;const a=e.subarray(o,o+s).toString("utf8").replace(/\0/g,"");o+=s;const c=e.readUInt32LE(o);o+=4;const i=e.subarray(o,o+c).toString("utf8").replace(/\0/g,"");return{name:a,symbol:i}}catch(e){return console.warn("Error parsing token metadata:",e),null}}function he(n,e=null){const{name:o,symbol:s,address:a}=n,c=`${a.slice(0,4)}...${a.slice(-4)}`;return e!==null?`${e.toLocaleString()} ${s} (${o})`:`${s} - ${o} (${c})`}const we={connect:async n=>{if(t.connected)return{type:"info",content:`WALLET ALREADY CONNECTED
Address: ${t.address}`};const e=n[0];if(!e)return{type:"error",content:"Usage: connect <phantom|solflare>"};const s=(()=>{if(typeof window>"u")return null;switch(e){case"phantom":return window?.phantom?.solana||(window?.solana?.isPhantom?window.solana:null);case"solflare":return window?.solflare;default:return null}})();if(!s)return{type:"error",content:`Wallet not found: ${e}`};try{const c=(await s.connect()).publicKey||s.publicKey,i=c.toString();let d=0;try{d=await v(async T=>await T.getBalance(c)/D)}catch(T){console.warn("Error fetching SOL balance with all endpoints:",T.message);try{d=await F.getBalance(c)/D}catch(h){console.error("Direct connection also failed:",h.message)}}let p=0;try{p=await v(async T=>(await T.getParsedTokenAccountsByOwner(c,{programId:x})).value.filter(({account:y})=>y.data.parsed.info.tokenAmount.uiAmount>0).length)}catch(T){console.warn("Error fetching token accounts with all endpoints:",T.message);try{p=(await F.getParsedTokenAccountsByOwner(c,{programId:x})).value.filter(({account:y})=>y.data.parsed.info.tokenAmount.uiAmount>0).length}catch(h){console.warn("Direct token query also failed:",h.message)}}t.connected=!0,t.address=i,t.balance=d,t.provider=s,t.walletType=e,t.tokenCount=p,t.connectionTime=new Date().toISOString(),t.isReal=!0;const k=G(),w={type:e.toUpperCase(),address:i,shortAddress:`${i.slice(0,4)}...${i.slice(-4)}`,balance:d.toFixed(4),tokenAccounts:p};return{type:"result",content:`${w.type} WALLET CONNECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Address: ${w.shortAddress}
Full:    ${w.address}
Balance: ${w.balance} SOL
Tokens:  ${w.tokenAccounts} SPL accounts

⚡ Real wallet connected!
Network: ${k.network.toUpperCase()}

Next: 'balance' for updated data | 'walletinfo' for details`}}catch(a){return console.error("Wallet connection error:",a),{type:"error",content:`❌ CONNECTION FAILED

Wallet: ${e}
Error: ${a.message}

Try: Check wallet extension is unlocked`}}},disconnect:async()=>{if(!t.connected)return{type:"error",content:"No wallet connected"};try{await t.provider?.disconnect()}catch{}return t.connected=!1,t.address=null,t.balance=0,t.stakedAmount=0,t.rewards=0,t.rewardToken=null,t.provider=null,t.walletType=null,t.tokenCount=0,t.connectionTime=null,t.isReal=!1,r.level=0,{type:"result",content:`WALLET DISCONNECTED

Connection terminated successfully.`}},balance:async()=>{if(console.log("🔍 Balance command called"),console.log("🔍 Wallet state:",{connected:t.connected,address:t.address,provider:!!t.provider}),!t.connected)return console.log("❌ Wallet not connected"),{type:"error",content:"Connect wallet first using: connect"};if(!t.provider||!t.provider.publicKey)return console.log("❌ Provider or publicKey missing"),{type:"error",content:"Wallet provider not available. Try reconnecting."};try{console.log("🔄 Starting balance fetch...");const n=await v(async d=>await d.getBalance(t.provider.publicKey)/D);t.balance=n,console.log("✅ SOL balance fetched:",n),console.log("🔄 Fetching SPL tokens...");const e=await v(async d=>(await d.getParsedTokenAccountsByOwner(t.provider.publicKey,{programId:x})).value.map(({account:k})=>{const w=k.data.parsed.info,T=w.tokenAmount.uiAmount;return{mint:w.mint,amount:T}}).filter(k=>k.amount>0));console.log("✅ SPL tokens fetched:",e.length,"tokens");let o="No SPL tokens";if(e.length>0)try{const p=e.slice(0,5).map(async w=>{try{const T=await K(new A(w.mint));return`${w.amount.toLocaleString()} ${T.symbol} (${T.name})`}catch{return`${w.mint.slice(0,8)}...: ${w.amount.toLocaleString()}`}});o=(await Promise.all(p)).join(`
`),e.length>5&&(o+=`
... and ${e.length-5} more tokens`)}catch(d){console.warn("Error fetching token metadata for balance:",d),o=e.slice(0,5).map(p=>`${p.mint.slice(0,8)}...: ${p.amount.toLocaleString()}`).join(`
`)}const a=G().isTestnet?"📱 DEVNET (testing)":"⚡ MAINNET",c=t.isReal?`${a} - Real data`:"📱 Simulated data",i={type:"result",content:`WALLET BALANCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOL:     ${t.balance.toFixed(4)}
${o}

${c}`};return console.log("✅ Balance command result:",i),i}catch(n){return console.error("❌ Balance fetch error:",n),{type:"error",content:`❌ BALANCE FETCH FAILED

All RPC endpoints failed.
Error: ${n.message}

Try: reconnecting wallet or check network`}}},tokeninfo:async n=>{if(!n[0])return{type:"error",content:`Usage: tokeninfo <token_address>
Example: tokeninfo 5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF`};try{const e=new A(n[0]),o=await K(e);return{type:"result",content:`TOKEN INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:     ${o.name}
Symbol:   ${o.symbol}
Decimals: ${o.decimals}
Address:  ${o.address}
Short:    ${o.address.slice(0,4)}...${o.address.slice(-4)}`}}catch(e){return{type:"error",content:`Invalid token address: ${n[0]}
Error: ${e.message}`}}},walletinfo:async()=>{if(!t.connected)return{type:"error",content:"No wallet connected. Use: connect <wallet>"};const n=t.connectionTime?new Date(t.connectionTime).toLocaleString():"Unknown",e=t.isReal?"⚡":"📱",o=t.isReal?"REAL BLOCKCHAIN DATA":"SIMULATED DATA";return{type:"result",content:`${e} WALLET CONNECTION INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Wallet Type: ${t.walletType?.toUpperCase()||"Unknown"}
Address:     ${t.address}
Short:       ${t.address?.slice(0,4)}...${t.address?.slice(-4)}
Balance:     ${t.balance} SOL
Tokens:      ${t.tokenCount} SPL accounts
Connected:   ${n}
Data Type:   ${o}
Network:     📱 DEVNET (Testing Network)

Provider:    ${t.provider?"Active":"None"}`}}},ge={status:()=>t.connected?{type:"result",content:`STAKING STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Wallet:       ${t.address}
Staked:       ${t.stakedAmount} PROMPT
Rewards:      ${t.rewards} tokens
Pool APY:     15.2%
Reward Token: ${t.rewardToken||"Not configured"}`}:{type:"info",content:`STAKING STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Wallet:     Not connected
Staked:     0 PROMPT
Rewards:    0 tokens
Pool APY:   15.2%

Connect wallet to initialize staking protocol.`},stake:n=>{if(!t.connected)return{type:"error",content:"Connect wallet first using: connect"};if(!n.length)return{type:"error",content:`Usage: stake <amount>
Example: stake 100`};const e=parseFloat(n[0]);return isNaN(e)||e<=0?{type:"error",content:"Invalid amount. Please enter a positive number."}:(t.stakedAmount+=e,{type:"result",content:`STAKING TRANSACTION COMPLETED

Amount staked:     ${e} PROMPT
Total staked:      ${t.stakedAmount} PROMPT
Daily rewards:     ${(e*.15/365).toFixed(4)} tokens`})},unstake:n=>{if(!t.connected)return{type:"error",content:"Connect wallet first using: connect"};if(!n.length)return{type:"error",content:`Usage: unstake <amount>
Example: unstake 50`};const e=parseFloat(n[0]);return isNaN(e)||e<=0?{type:"error",content:"Invalid amount. Please enter a positive number."}:e>t.stakedAmount?{type:"error",content:`Insufficient staked amount. You have ${t.stakedAmount} $PROMPT staked.`}:(t.stakedAmount-=e,{type:"result",content:`UNSTAKING TRANSACTION COMPLETED

Amount unstaked:   ${e} PROMPT
Remaining staked:  ${t.stakedAmount} PROMPT`})},claim:()=>{if(!t.connected)return{type:"error",content:"Connect wallet first using: connect"};if(t.rewards===0)return{type:"info",content:"No rewards available to claim."};const n=t.rewards;return t.rewards=0,{type:"result",content:`REWARDS CLAIMED

Tokens claimed:    ${n}
Transaction completed successfully.`}},rewards:()=>t.connected?{type:"result",content:`REWARDS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available:      ${t.rewards} tokens
Reward Token:   ${t.rewardToken||"Not configured"}
Daily Rate:     ${(t.stakedAmount*.15/365).toFixed(4)} tokens/day
Total Earned:   ${t.rewards} tokens`}:{type:"info",content:`REWARDS INFORMATION
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
    APY: 8.5% | Instant unstake | Status: Development`})},ke={prompt:`
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
  `},Se={profile:()=>{const n=P();return{type:"result",content:`USER PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Access Level:     [${n.level}] ${n.name}
Description:      ${n.description}
Commands Used:    ${n.commandCount}
Secrets Found:    ${n.secretsFound}

Progression:
${n.nextLevelRequirement}

Unlocked Commands: ${Array.from(r.unlockedCommands).length}
Achievements:      ${r.achievements.length}`}},price:async()=>{try{return{type:"result",content:`SOL PRICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1 SOL = $${(await(await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd")).json()).solana.usd} USD`}}catch(n){return{type:"error",content:`Price fetch failed: ${n.message}`}}},slot:async()=>{try{return{type:"result",content:`CURRENT SLOT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${await F.getSlot()}`}}catch(n){return{type:"error",content:`Slot fetch failed: ${n.message}`}}},about:()=>({type:"result",content:`PROMPT STAKING PROTOCOL v1.0.0
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
Uptime:        ${Math.floor(Math.random()*24)}h ${Math.floor(Math.random()*60)}m`}),banner:()=>({type:"result",content:ke.prompt}),ping:()=>({type:"result",content:`NETWORK DIAGNOSTIC

Latency: 42ms
Status: Connected`}),time:()=>({type:"result",content:`SYSTEM TIME

Current: ${new Date().toLocaleString()}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`}),whoami:()=>{const n=P();return{type:"result",content:`USER IDENTIFICATION

User: Anonymous Staker #1337
Access Level: [${n.level}] ${n.name}
Clearance: ${n.description}`}}},ve={flip:()=>({type:"result",content:`COIN FLIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${Math.random()<.5?"Heads":"Tails"}`}),dice:()=>({type:"result",content:`DICE ROLL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You rolled a ${Math.floor(Math.random()*6)+1}`})},Ae={clear:()=>({type:"clear",content:""}),reset:()=>(t.connected=!1,t.address=null,t.balance=0,t.stakedAmount=0,t.rewards=0,t.rewardToken=null,t.provider=null,r.level=0,r.commandCount=0,r.secretsFound=0,r.achievements=[],r.unlockedCommands=new Set(["help","about","version","banner","clear","time","ping","price","slot","flip","dice","connect"]),r.secretsFoundSet=new Set,{type:"clear",content:"SYSTEM RESET COMPLETE"})},Ee={easter:()=>(r.secretsFoundSet.has("easter")||(r.secretsFoundSet.add("easter"),r.secretsFound++),{type:"result",content:`EASTER EGG FOUND!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🥚 Congratulations, you found the hidden command!

Secret message: "The future of staking is prompt."

Secrets found: ${r.secretsFound}/3

Try: matrix, ghost, or dev for more secrets...`}),matrix:()=>(r.secretsFoundSet.has("matrix")||(r.secretsFoundSet.add("matrix"),r.secretsFound++),{type:"result",content:`THE MATRIX HAS YOU...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

01100110 01110101 01110100 01110101
01110010 01100101 00100000 01101111
01100110 00100000 01110011 01110100
01100001 01101011 01101001 01101110
01100111 00100000 01101001 01110011
00100000 01110000 01110010 01101111
01101101 01110000 01110100

Translated: "future of staking is prompt"
Secrets found: ${r.secretsFound}/3`}),ghost:()=>(r.secretsFoundSet.has("ghost")||(r.secretsFoundSet.add("ghost"),r.secretsFound++),{type:"result",content:`👻 GHOST MODE ACTIVATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are now invisible in the mempool...
Staking operations will have 0% slippage
Rewards multiplied by 2x temporarily

Secrets found: ${r.secretsFound}/3

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

Want to contribute? Check the GitHub!`}),hack:()=>r.level<4?{type:"error",content:"ACCESS DENIED: HACKER level required"}:{type:"result",content:`INITIATING HACK SEQUENCE...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> Scanning network vulnerabilities...
> Bypassing firewall protocols...
> Accessing mainframe...

[SUCCESS] System infiltration complete.
[CAUTION] Use powers responsibly.`},override:()=>r.level<4?{type:"error",content:"ACCESS DENIED: HACKER level required"}:{type:"result",content:`SYSTEM OVERRIDE ACTIVATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> Emergency protocols disabled
> Admin privileges escalated
> Security constraints bypassed

[WARNING] Override mode active.
All restrictions temporarily lifted.`},decrypt:()=>r.level<4?{type:"error",content:"ACCESS DENIED: HACKER level required"}:{type:"result",content:`DECRYPTION MODULE ACTIVE
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

"Building the future, one prompt at a time."`})};async function Ne(){if(!t.connected||!t.address)return!1;try{const n=new A(t.address),e=await te(U,n);return await v(async o=>{const s=await o.getTokenAccountBalance(e),a=BigInt(s.value.amount),c=s.value.decimals,i=j*10n**BigInt(c);return a>=i})}catch(n){return console.error("Token balance verification failed:",n),!1}}const O={...we,...ge,...Se,...ve,...Ae,...Ee},L={h:"help",c:"clear",r:"reset",p:"profile",st:"status",bal:"balance",conn:"connect",disc:"disconnect",winfo:"walletinfo",tinfo:"tokeninfo",ti:"tokeninfo",pr:"price",sol:"price",sl:"slot",coin:"flip",roll:"dice","???":"easter","👻":"ghost",debug:"dev"};O.help=()=>({type:"result",content:`AVAILABLE COMMANDS
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

FUN
  flip             │ Flip a coin
  dice             │ Roll a six-sided die

SYSTEM
  about            │ Protocol information
  version          │ System version details
  banner           │ Display PROMPT logo
  clear            │ Clear terminal output
  reset            │ Full system reset

HIDDEN
  ??????           │ ??????

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TAB: autocomplete │ UP/DOWN: command history │ ALIASES: ${Object.keys(L).filter(e=>!["???","👻","debug"].includes(e)).join(", ")}`});async function Ce(n){const[e,...o]=n.toLowerCase().split(" "),s=L[e]||e;if(O[s]){if(!new Set(["help","connect","disconnect","clear","banner","version","about"]).has(s)&&!await Ne())try{const i=await K(U),d=he(i);return{type:"error",content:`ACCESS DENIED
Requires at least ${j} ${i.symbol} tokens

Token: ${d}`}}catch{return{type:"error",content:`ACCESS DENIED
Requires at least ${j} tokens of ${U.toBase58()}`}}r.commandCount++;try{const c=await O[s](o);if(pe(s)){const d=P(),p=`

━━━ LEVEL UP! ━━━
Access Level: [${d.level}] ${d.name}
New commands unlocked! Use 'help' to see them.`;c.content+=p}return c}catch(c){return{type:"error",content:`Command execution failed: ${c.message}`}}}return{type:"error",content:`Command not found: ${e}
Type "help" for available commands`}}function Pe(n){const e=[...Object.keys(O),...Object.keys(L)],o=new Set(["easter","matrix","ghost","dev","prompt","???","👻","debug","hack","override","decrypt"]);return e.filter(a=>r.unlockedCommands.has(L[a]||a)&&!o.has(a)).filter(a=>a.startsWith(n.toLowerCase()))}function be(){const n=["TIP: Use TAB for command autocompletion","TIP: Use UP/DOWN arrows to navigate command history","TIP: Type 'apy' to see current staking rewards","TIP: You can stake any amount of PROMPT tokens","TIP: Rewards can be claimed in any SPL token","TIP: Type 'banner' for ASCII art display","TIP: Jupiter Aggregator ensures optimal swap rates","TIP: Use aliases like 'h' for help, 'c' for clear","TIP: Commands are case-insensitive for convenience","TIP: Type 'profile' to check your progression","TIP: Type 'price' to check the current SOL price","TIP: Use 'flip' or 'dice' for a bit of fun","TIP: Hidden commands exist... try exploring!"];return n[Math.floor(Math.random()*n.length)]}function Re(){const[n,e]=m.useState([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:"Building a Solana staking dApp"},{type:"info",content:"Custom token staking - Earn rewards in any SPL token you choose"},{type:"info",content:'Type "help" to see available commands'}]),[o,s]=m.useState(""),[a,c]=m.useState([]),[i,d]=m.useState(-1),[p,k]=m.useState([]),[w,T]=m.useState(!1),[h,y]=m.useState(!1),g=m.useRef(null),N=m.useRef(null),C=m.useRef(null);m.useEffect(()=>{g.current?.focus()},[]),m.useEffect(()=>{if(!h){const u=setTimeout(()=>{g.current?.focus()},100);return()=>clearTimeout(u)}},[n,h]),m.useEffect(()=>{h||setTimeout(()=>{g.current?.focus()},50)},[h]),m.useEffect(()=>{N.current&&(N.current.scrollTop=N.current.scrollHeight,setTimeout(()=>{g.current?.focus()},10))},[n]),m.useEffect(()=>{if(o.trim()){const u=Pe(o.trim());k(u),T(u.length>0)}else T(!1)},[o]),m.useEffect(()=>((()=>{C.current&&clearTimeout(C.current),C.current=setTimeout(()=>{e(f=>[...f,{type:"info",content:be()}])},3e4)})(),()=>{C.current&&clearTimeout(C.current)}),[o,n]),m.useEffect(()=>{const u=f=>{const E=f.target.closest(".suggestion-item"),b=f.target.closest(".terminal-input"),S=f.target===N.current;!E&&!b&&!S&&!h&&setTimeout(()=>{g.current?.focus()},0)};return document.addEventListener("click",u),()=>{document.removeEventListener("click",u)}},[h]);const W=m.useCallback(async u=>{y(!0),await new Promise(f=>setTimeout(f,Math.random()*500+200));try{return Ce(u)}finally{y(!1)}},[]),Z=m.useCallback(async u=>{if(u.preventDefault(),!o.trim()||h)return;const f=o.trim(),E={type:"command",content:f};c(S=>[f,...S.slice(0,49)]),d(-1),["connect","stake","unstake","claim"].includes(f.split(" ")[0])?e(S=>[...S,E,{type:"loading",content:"Processing..."}]):e(S=>[...S,E]),s(""),T(!1),setTimeout(()=>{g.current?.focus()},0);const b=await W(f);window.dispatchEvent(new CustomEvent("terminal-command",{detail:{command:f}})),b.type==="clear"?e([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:'Type "help" to see available commands'}]):e(S=>{const R=[...S];return R[R.length-1]?.type==="loading"&&R.pop(),[...R,b]}),setTimeout(()=>{g.current?.focus()},50)},[o,h,W]),z=m.useCallback(u=>{if(u.key==="ArrowUp"){if(u.preventDefault(),i<a.length-1){const f=i+1;d(f),s(a[f])}}else if(u.key==="ArrowDown")if(u.preventDefault(),i>0){const f=i-1;d(f),s(a[f])}else i===0&&(d(-1),s(""));else if(u.key==="Tab"){if(u.preventDefault(),p.length===1)s(p[0]+" "),T(!1);else if(p.length>1){const f=p.join("  ");e(E=>[...E,{type:"command",content:o},{type:"suggestion",content:f}]),s("")}}else u.key==="Escape"?(T(!1),s(""),d(-1)):u.ctrlKey&&u.key==="c"?(u.preventDefault(),s(""),e(f=>[...f,{type:"info",content:"^C"}])):u.ctrlKey&&u.key==="l"&&(u.preventDefault(),e([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:'Type "help" to see available commands'}]))},[i,a,p,o]),J=m.useCallback(u=>{e(f=>[...f,u])},[]),Q=m.useCallback(()=>{e([{type:"welcome",content:"PROMPT STAKING TERMINAL v1.0.0"},{type:"info",content:'Type "help" to see available commands'}])},[]);return{history:n,input:o,suggestions:p,showSuggestions:w,isLoading:h,inputRef:g,outputRef:N,setInput:s,handleSubmit:Z,handleKeyDown:z,addMessage:J,clearTerminal:Q}}function Ie(){const[n,e]=m.useState({uptime:"0h 0m",commandsExecuted:0,memoryUsage:0,networkLatency:0});return m.useEffect(()=>{const o=Date.now();let s=0;const a=()=>{const p=Date.now()-o,k=Math.floor(p/(1e3*60*60)),w=Math.floor(p%(1e3*60*60)/(1e3*60));e({uptime:`${k}h ${w}m`,commandsExecuted:s,memoryUsage:Math.floor(Math.random()*20+40),networkLatency:Math.floor(Math.random()*50+20)})},c=()=>{s++,a()},i=setInterval(a,1e4);return window.addEventListener("terminal-command",c),a(),()=>{clearInterval(i),window.removeEventListener("terminal-command",c)}},[]),l.jsxs("div",{className:"system-stats",children:[l.jsxs("div",{className:"stat-item",children:[l.jsx("span",{className:"stat-label",children:"UPTIME"}),l.jsx("span",{className:"stat-value",children:n.uptime})]}),l.jsxs("div",{className:"stat-item",children:[l.jsx("span",{className:"stat-label",children:"CMDS"}),l.jsx("span",{className:"stat-value",children:n.commandsExecuted})]}),l.jsxs("div",{className:"stat-item",children:[l.jsx("span",{className:"stat-label",children:"MEM"}),l.jsxs("span",{className:"stat-value",children:[n.memoryUsage,"%"]})]}),l.jsxs("div",{className:"stat-item",children:[l.jsx("span",{className:"stat-label",children:"PING"}),l.jsxs("span",{className:"stat-value",children:[n.networkLatency,"ms"]})]})]})}function Oe(){const[n,e]=m.useState(P()),{history:o,input:s,suggestions:a,showSuggestions:c,isLoading:i,inputRef:d,outputRef:p,setInput:k,handleSubmit:w,handleKeyDown:T}=Re();m.useEffect(()=>{const y=()=>{e(P())};return window.addEventListener("terminal-command",y),()=>window.removeEventListener("terminal-command",y)},[]);const h=(y,g)=>{switch(y.type){case"welcome":return l.jsx("div",{className:"welcome-text",children:l.jsx("div",{className:"ascii-art",children:y.content})},g);case"command":return l.jsxs("div",{className:"command-line",children:[l.jsx("span",{className:"terminal-prompt",children:"$PROMPT>"}),l.jsx("span",{className:"command-text",children:y.content})]},g);case"result":return l.jsx("div",{className:"command-result success-text",children:y.content},g);case"error":return l.jsxs("div",{className:"command-result error-text",children:["↯ ",y.content]},g);case"info":return l.jsxs("div",{className:"command-result info-text",children:["… ",y.content]},g);case"suggestion":return l.jsxs("div",{className:"command-result suggestion-text",children:["⋄ ",y.content]},g);case"loading":return l.jsxs("div",{className:"command-result loading-text",children:[l.jsx("span",{className:"loading-spinner",children:"▒░▒"})," ",y.content]},g);default:return l.jsx("div",{className:"command-result",children:y.content},g)}};return l.jsxs("div",{className:"terminal-container",children:[l.jsxs("div",{className:"terminal-header",children:[l.jsx("div",{className:"terminal-logo",children:l.jsx("span",{className:"logo-text",children:"PROMPT"})}),l.jsx("div",{className:"terminal-subtitle",children:"SOLANA STAKING PROTOCOL"}),l.jsxs("div",{className:"terminal-user-info",children:[l.jsxs("div",{className:"user-level",style:{color:n.color},children:["[",n.level,"] ",n.name]}),l.jsxs("div",{className:"terminal-status",children:[l.jsx("span",{className:"status-dot"}),l.jsx("span",{className:"status-text",children:"OFFLINE"})]})]})]}),l.jsx(Ie,{}),l.jsx("div",{className:"terminal-output",ref:p,children:o.map(h)}),l.jsxs("div",{className:"terminal-input-area",children:[c&&a.length>0&&l.jsx("div",{className:"suggestions",children:a.map((y,g)=>l.jsx("span",{className:"suggestion-item",onClick:()=>{k(y+" ")},children:y},g))}),l.jsxs("form",{onSubmit:w,className:"terminal-input-container",children:[l.jsx("span",{className:"terminal-prompt",children:"$PROMPT>"}),l.jsx("input",{ref:d,type:"text",value:s,onChange:y=>k(y.target.value),onKeyDown:T,className:"terminal-input",placeholder:i?"Processing...":"Enter command...",autoComplete:"off",spellCheck:"false",disabled:i}),l.jsx("span",{className:"cursor",children:"_"})]}),l.jsx("div",{className:"terminal-footer",children:l.jsx("span",{className:"footer-text",children:"TAB: autocomplete | UP/DOWN: history | ESC: clear | CTRL+C: interrupt"})})]})]})}function Le(){return l.jsx(Oe,{})}M.createRoot(document.getElementById("root")).render(l.jsx(ee.StrictMode,{children:l.jsx(Le,{})}));
