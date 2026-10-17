(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Li=33,jt=42,ap=1600,op=1600,ea=25,ei=ap/ea,vl=op/ea,mg=ei*vl,Ju=mg,Qu=0,gg=1e3,jo=Math.PI*2,tf=.0174533,lp=0,_g=32,Gn={TIME:0,LIVE_POP:1,DEAD_COUNT:2,AMOEBA_COUNT:3,HAS_HIGHLIGHTED:4,HIGHLIGHTED:5,HAS_NEWEST:6,NEWEST:7,TPS_MEASURED:10,HAS_BRAIN:11,HAS_FOCUS:12,GOLD:13,SILVER:14,BRONZE:15},cp=lp+_g,up=10,xg=5,Ca={HIGHLIGHTED:0,NEWEST:1,GOLD:2,SILVER:3,BRONZE:4},Pa={VALID:0,NAME0:2,GEN:6,ALIVE:7,DESCENDANTS:8},Sl=cp+up*xg,vg=64,tt={IDX:0,STATUS:1,X:2,Y:3,SIZE:4,DIRECTION:5,BORN:6,AGE:7,SIBLING_IDX:8,ENERGY:9,MAX_ENERGY:10,DAMAGE_RECEIVED:12,DAMAGE_CAUSED:13,BRAIN_WEIGHT:14,MOUTH_DETECTED:15,EYE_DETECTED:16,OUT:21,DESCENDANTS:27,GEN:28,NAME0:31,VELOCITY_X:35,MOUTH_X:36,MOUTH_Y:37,EYE_XY:38},Ya=Sl+vg,qa=3,Sg=Ju*qa,hp=Ya+Sg,fp=32,Mg=gg*fp,rn={IDX:0,STATUS:1,X:2,Y:3,SIZE:4,OUT:6,MOUTH_X:12,MOUTH_Y:13,EYE_XY:14,GEN:24,DESCENDANTS:25,NAME0:26,GRAVE:31},dp=hp+Mg,eh=dp,th=eh+Li,pp=th+jt,Eg=pp+Li*2*jt,yg=Li+jt+(Li+jt)*2*jt,mp=dp+yg,nf=mp*4;function nh(n,e){return String.fromCharCode(n[e],n[e+1],n[e+2],n[e+3])}function Ml(n,e,t,i){return`${n}-${e}${t?"A":"D"}${i}`}class Tg{worker;handlers={};current=null;incoming=null;frame=null;constructor(){this.worker=new Worker(new URL("/petri/assets/worker-DiMhujsw.js",import.meta.url),{type:"module"}),this.worker.onmessage=e=>this.dispatch(e.data),this.worker.onerror=e=>console.error("Simulation worker error:",e.message,e)}on(e,t){this.handlers[e]=t}dispatch(e){if(e.type==="frame"){this.incoming&&this.returnBuffer(this.incoming),this.incoming=e.buffer;return}const t=this.handlers[e.type];t&&t(e)}post(e,t){t?this.worker.postMessage(e,t):this.worker.postMessage(e)}returnBuffer(e){this.post({type:"frameDone",buffer:e},[e])}swapFrame(){return this.incoming?(this.current&&this.returnBuffer(this.current),this.current=this.incoming,this.incoming=null,this.frame=new Float32Array(this.current,0,mp),!0):!1}start(e=Qu){const t=[new ArrayBuffer(nf),new ArrayBuffer(nf)];this.post({type:"start",buffers:t,tps:e},t)}setPaused(e){this.post({type:"pause",paused:e})}setTps(e){this.post({type:"setTps",tps:e})}newSimulation(){this.post({type:"new"})}spawn(e,t){this.post({type:"spawn",x:e,y:t})}highlight(e){this.post({type:"highlight",idx:e})}setDisplay(e){this.post({type:"display",mode:e})}requestKinTable(e,t){this.post({type:"kinTable",idx:e,neurons:t})}requestFamily(e){this.post({type:"family",idx:e})}requestAlikeness(e,t){this.post({type:"alikeness",a:e,b:t})}save(){this.post({type:"save"})}load(e){this.post({type:"load",json:e})}}const z={ctx:null,canvas:{scale:1,dragOffsetX:0,dragOffsetY:0,dragging:!1},mouse:{x:0,y:0,originalX:0,originalY:0,prevX:0,prevY:0,overMap:!1,leftPressed:!1,rightPressed:!1},keysPressed:{},leftAccel:0,rightAccel:0,upAccel:0,downAccel:0,display:"default",tracking:!1,paused:!1,fastForward:!1,highlighted:null};function Ki(n){return n+(n<0?-.5:.5)|0}function gi(n,e){return n[lp+e]}function ih(n){return gi(n,Gn.HAS_HIGHLIGHTED)?gi(n,Gn.HIGHLIGHTED):null}function bg(n){return gi(n,Gn.HAS_NEWEST)?gi(n,Gn.NEWEST):null}function Ag(n,e){const t=gi(n,e);return t<0?null:t}function Da(n,e){const t=cp+e*up;return n[t+Pa.VALID]?Ml(nh(n,t+Pa.NAME0),n[t+Pa.GEN],n[t+Pa.ALIVE]===1,n[t+Pa.DESCENDANTS]):null}function El(n){return gi(n,Gn.HAS_FOCUS)===1}function Xt(n,e){return n[Sl+e]}function wg(n){return nh(n,Sl+tt.NAME0)}function gp(n){return Ml(wg(n),Xt(n,tt.GEN),Xt(n,tt.STATUS)===0,Xt(n,tt.DESCENDANTS))}function _p(n){return gi(n,Gn.AMOEBA_COUNT)}function xp(n){return hp+n*fp}function Rg(n,e){return Ml(nh(n,e+rn.NAME0),n[e+rn.GEN],n[e+rn.STATUS]===0,n[e+rn.DESCENDANTS])}function Cg(n){return gi(n,Gn.HAS_BRAIN)===1}const yl=document.createElement("canvas");yl.width=ei;yl.height=vl;const vp=yl.getContext("2d",{alpha:!1}),Sp=vp.createImageData(ei,vl),yo=Sp.data,Pg="#303030";function Kl(n){return n<255?n>48?n:48:255}function Dg(n){const e=[];return n>=ei&&e.push(n-ei),n<Ju-ei&&e.push(n+ei),n%ei!==0&&e.push(n-1),(n+1)%ei!==0&&e.push(n+1),e}function Lg(n,e){let t=Ya;for(let i=0;i<Ju;i++){const s=i*4;yo[s]=Kl(e[t]),yo[s+1]=Kl(e[t+1]),yo[s+2]=Kl(e[t+2]),yo[s+3]=255,t+=qa}if(vp.putImageData(Sp,0,0),n.imageSmoothingEnabled=!1,n.drawImage(yl,0,0,ap,op),z.mouse.overMap){const i=Math.floor(z.mouse.x/ea),s=Math.floor(z.mouse.y/ea);if(i>=0&&i<ei&&s>=0&&s<vl){const r=s*ei+i;n.font="8px monospace";const a=[r,...Dg(r)];for(const o of a){const l=e[Ya+o*qa],c=e[Ya+o*qa+1],h=e[Ya+o*qa+2],u=o%ei*ea,f=Math.floor(o/ei)*ea;n.fillStyle=`rgb(${l-32},${c-32},${h-32})`,z.mouse.leftPressed?n.fillText(String(o),u+2,f+25):(n.fillText(String(Ki(l)),u+2,f+9),n.fillText(String(Ki(c)),u+2,f+16),n.fillText(String(Ki(h)),u+2,f+23))}}}}function Mp(n,e,t,i,s,r,a,o,l,c){const h=50+Ki(Math.abs(s)*205),u=50+Ki(Math.abs(r)*205),f=50+Ki(Math.abs(a)*205),g=i/4;n.fillStyle=`rgb(${h+80},${u+80},${f+80})`;for(let x=0;x<5;x++)n.beginPath(),n.arc(c(x*2),c(x*2+1),g,0,jo),n.fill();n.fillStyle=`rgb(${h},${u},${f})`,n.beginPath(),n.arc(e,t,i,0,jo),n.fill(),n.fillStyle=`rgb(${h+40},${u+40},${f+40})`,n.beginPath(),n.arc(o,l,i/2,0,jo),n.fill()}function Ep(n,e){return z.mouse.overMap&&z.mouse.x>=n-50&&z.mouse.x<n+50&&z.mouse.y>=e-50&&z.mouse.y<e+50}function Ig(n,e){const t=_p(e),i=ih(e);n.font="10px Arial";for(let s=0;s<t;s++){const r=xp(s),a=e[r+rn.X],o=e[r+rn.Y],l=e[r+rn.SIZE];Mp(n,a,o,l,e[r+rn.OUT+3],e[r+rn.OUT+4],e[r+rn.OUT+5],e[r+rn.MOUTH_X],e[r+rn.MOUTH_Y],c=>e[r+rn.EYE_XY+c]),Ep(a,o)&&i!==e[r+rn.IDX]&&(n.fillStyle="#FFFFFF",n.fillText(Rg(e,r),a+2*l,o-2*l+2))}}function Ug(n,e){if(!El(e))return;const t=Sl,i=e[t+tt.X],s=e[t+tt.Y],r=e[t+tt.SIZE],a=e[t+tt.STATUS]===0;a||Mp(n,i,s,r,e[t+tt.OUT+3],e[t+tt.OUT+4],e[t+tt.OUT+5],e[t+tt.MOUTH_X],e[t+tt.MOUTH_Y],p=>e[t+tt.EYE_XY+p]),n.beginPath(),n.fillStyle="#FFFFFF",n.strokeStyle="#FFFFFF",n.strokeRect(i-2*r,s-2*r,r*4,r*4);const o=e[t+tt.DIRECTION],l=o*tf,c=e[t+tt.OUT],h=e[t+tt.OUT+1],u=e[t+tt.OUT+2];n.beginPath(),n.strokeStyle="#FF0000";const f=i+c*10*Math.cos(l),g=s+c*10*Math.sin(l);n.moveTo(i,s),n.lineTo(f,g),n.stroke(),n.beginPath(),n.strokeStyle="#0088FF",n.moveTo(i,s),n.lineTo(i+h*10*Math.sin(l),s-h*10*Math.cos(l)),n.stroke(),n.beginPath(),n.strokeStyle="#FFFFFF";const x=(o-90)*tf,M=e[t+tt.VELOCITY_X]>0?-1:1;if(n.moveTo(f,g),n.lineTo(f+M*u*10*Math.cos(x),g+M*u*10*Math.sin(x)),n.stroke(),n.lineWidth=.25,n.strokeStyle="#FFFFFF",Ep(i,s))for(let p=0;p<5;p++)n.beginPath(),n.arc(e[t+tt.EYE_XY+p*2],e[t+tt.EYE_XY+p*2+1],r/4,0,jo),n.stroke();n.lineWidth=1,a&&(n.fillStyle="#FFFFFF",n.fillText(gp(e),i+2*r,s-2*r+2))}function Ng(n){const e=z.ctx;e&&(e.save(),e.setTransform(1,0,0,1,0,0),e.fillStyle=Pg,e.fillRect(0,0,e.canvas.width,e.canvas.height),e.restore(),n&&(Lg(e,n),Ig(e,n),Ug(e,n)))}function Fg(n,e){const t=new Blob([n],{type:"application/json"}),i=URL.createObjectURL(t),s=document.createElement("a");s.href=i,s.download=e,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(i)}function Og(n){return new Promise((e,t)=>{const i=document.createElement("input");i.type="file",i.accept=n,i.onchange=()=>{const s=i.files?.[0];if(!s)return e(null);const r=new FileReader;r.onload=a=>e(a.target?.result??null),r.onerror=()=>t(r.error),r.readAsText(s)},i.click()})}const Bg=!0,gn="u-",zg="uplot",kg=gn+"hz",Vg=gn+"vt",Gg=gn+"title",Hg=gn+"wrap",Wg=gn+"under",Xg=gn+"over",Yg=gn+"axis",sr=gn+"off",qg=gn+"select",Kg=gn+"cursor-x",$g=gn+"cursor-y",Zg=gn+"cursor-pt",jg=gn+"legend",Jg=gn+"live",Qg=gn+"inline",e_=gn+"series",t_=gn+"marker",sf=gn+"label",n_=gn+"value",Ka="width",$a="height",La="top",rf="bottom",Lr="left",$l="right",sh="#000",af=sh+"0",Zl="mousemove",of="mousedown",jl="mouseup",lf="mouseenter",cf="mouseleave",uf="dblclick",i_="resize",s_="scroll",hf="change",al="dppxchange",rh="--",xa=typeof window<"u",zc=xa?document:null,na=xa?window:null,r_=xa?navigator:null;let yt,To;function kc(){let n=devicePixelRatio;yt!=n&&(yt=n,To&&Gc(hf,To,kc),To=matchMedia(`(min-resolution: ${yt-.001}dppx) and (max-resolution: ${yt+.001}dppx)`),dr(hf,To,kc),na.dispatchEvent(new CustomEvent(al)))}function Jn(n,e){if(e!=null){let t=n.classList;!t.contains(e)&&t.add(e)}}function Vc(n,e){let t=n.classList;t.contains(e)&&t.remove(e)}function Wt(n,e,t){n.style[e]=t+"px"}function bi(n,e,t,i){let s=zc.createElement(n);return e!=null&&Jn(s,e),t?.insertBefore(s,i),s}function ci(n,e){return bi("div",n,e)}const ff=new WeakMap;function ki(n,e,t,i,s){let r="translate("+e+"px,"+t+"px)",a=ff.get(n);r!=a&&(n.style.transform=r,ff.set(n,r),e<0||t<0||e>i||t>s?Jn(n,sr):Vc(n,sr))}const df=new WeakMap;function pf(n,e,t){let i=e+t,s=df.get(n);i!=s&&(df.set(n,i),n.style.background=e,n.style.borderColor=t)}const mf=new WeakMap;function gf(n,e,t,i){let s=e+""+t,r=mf.get(n);s!=r&&(mf.set(n,s),n.style.height=t+"px",n.style.width=e+"px",n.style.marginLeft=i?-e/2+"px":0,n.style.marginTop=i?-t/2+"px":0)}const ah={passive:!0},a_={...ah,capture:!0};function dr(n,e,t,i){e.addEventListener(n,t,i?a_:ah)}function Gc(n,e,t,i){e.removeEventListener(n,t,ah)}xa&&kc();function Ai(n,e,t,i){let s;t=t||0,i=i||e.length-1;let r=i<=2147483647;for(;i-t>1;)s=r?t+i>>1:ti((t+i)/2),e[s]<n?t=s:i=s;return n-e[t]<=e[i]-n?t:i}function yp(n){return(t,i,s)=>{let r=-1,a=-1;for(let o=i;o<=s;o++)if(n(t[o])){r=o;break}for(let o=s;o>=i;o--)if(n(t[o])){a=o;break}return[r,a]}}const Tp=n=>n!=null,bp=n=>n!=null&&n>0,Tl=yp(Tp),o_=yp(bp);function l_(n,e,t,i=0,s=!1){let r=s?o_:Tl,a=s?bp:Tp;[e,t]=r(n,e,t);let o=n[e],l=n[e];if(e>-1)if(i==1)o=n[e],l=n[t];else if(i==-1)o=n[t],l=n[e];else for(let c=e;c<=t;c++){let h=n[c];a(h)&&(h<o?o=h:h>l&&(l=h))}return[o??Ut,l??-Ut]}function bl(n,e,t,i){let s=vf(n),r=vf(e);n==e&&(s==-1?(n*=t,e/=t):(n/=t,e*=t));let a=t==10?ms:Ap,o=s==1?ti:ui,l=r==1?ui:ti,c=o(a(dn(n))),h=l(a(dn(e))),u=oa(t,c),f=oa(t,h);return t==10&&(c<0&&(u=Nt(u,-c)),h<0&&(f=Nt(f,-h))),i||t==2?(n=u*s,e=f*r):(n=Pp(n,u),e=Al(e,f)),[n,e]}function oh(n,e,t,i){let s=bl(n,e,t,i);return n==0&&(s[0]=0),e==0&&(s[1]=0),s}const lh=.1,_f={mode:3,pad:lh},to={pad:0,soft:null,mode:0},c_={min:to,max:to};function ol(n,e,t,i){return wl(t)?xf(n,e,t):(to.pad=t,to.soft=i?0:null,to.mode=i?3:0,xf(n,e,c_))}function _t(n,e){return n??e}function u_(n,e,t){for(e=_t(e,0),t=_t(t,n.length-1);e<=t;){if(n[e]!=null)return!0;e++}return!1}function xf(n,e,t){let i=t.min,s=t.max,r=_t(i.pad,0),a=_t(s.pad,0),o=_t(i.hard,-Ut),l=_t(s.hard,Ut),c=_t(i.soft,Ut),h=_t(s.soft,-Ut),u=_t(i.mode,0),f=_t(s.mode,0),g=e-n,x=ms(g),M=Bn(dn(n),dn(e)),p=ms(M),d=dn(p-x);(g<1e-24||d>10)&&(g=0,(n==0||e==0)&&(g=1e-24,u==2&&c!=Ut&&(r=0),f==2&&h!=-Ut&&(a=0)));let y=g||M||1e3,A=ms(y),b=oa(10,ti(A)),D=y*(g==0?n==0?.1:1:r),R=Nt(Pp(n-D,b/10),24),U=n>=c&&(u==1||u==3&&R<=c||u==2&&R>=c)?c:Ut,k=Bn(o,R<U&&n>=U?U:Ri(U,R)),S=y*(g==0?e==0?.1:1:a),T=Nt(Al(e+S,b/10),24),L=e<=h&&(f==1||f==3&&T>=h||f==2&&T<=h)?h:-Ut,H=Ri(l,T>L&&e<=L?L:Bn(L,T));return k==H&&k==0&&(H=100),[k,H]}const h_=new Intl.NumberFormat(xa?r_.language:"en-US"),ch=n=>h_.format(n),ii=Math,Jo=ii.PI,dn=ii.abs,ti=ii.floor,fn=ii.round,ui=ii.ceil,Ri=ii.min,Bn=ii.max,oa=ii.pow,vf=ii.sign,ms=ii.log10,Ap=ii.log2,f_=(n,e=1)=>ii.sinh(n)*e,Jl=(n,e=1)=>ii.asinh(n/e),Ut=1/0;function Sf(n){return(ms((n^n>>31)-(n>>31))|0)+1}function Hc(n,e,t){return Ri(Bn(n,e),t)}function wp(n){return typeof n=="function"}function ct(n){return wp(n)?n:()=>n}const d_=()=>{},Rp=n=>n,Cp=(n,e)=>e,p_=n=>null,Mf=n=>!0,Ef=(n,e)=>n==e,m_=/\.\d*?(?=9{6,}|0{6,})/gm,gr=n=>{if(Lp(n)||Bs.has(n))return n;const e=`${n}`,t=e.match(m_);if(t==null)return n;let i=t[0].length-1;if(e.indexOf("e-")!=-1){let[s,r]=e.split("e");return+`${gr(s)}e${r}`}return Nt(n,i)};function tr(n,e){return gr(Nt(gr(n/e))*e)}function Al(n,e){return gr(ui(gr(n/e))*e)}function Pp(n,e){return gr(ti(gr(n/e))*e)}function Nt(n,e=0){if(Lp(n))return n;let t=10**e,i=n*t*(1+Number.EPSILON);return fn(i)/t}const Bs=new Map;function Dp(n){return((""+n).split(".")[1]||"").length}function io(n,e,t,i){let s=[],r=i.map(Dp);for(let a=e;a<t;a++){let o=dn(a),l=Nt(oa(n,a),o);for(let c=0;c<i.length;c++){let h=n==10?+`${i[c]}e${a}`:i[c]*l,u=(a>=0?0:o)+(a>=r[c]?0:r[c]),f=n==10?h:Nt(h,u);s.push(f),Bs.set(f,u)}}return s}const no={},uh=[],la=[null,null],Is=Array.isArray,Lp=Number.isInteger,g_=n=>n===void 0;function yf(n){return typeof n=="string"}function wl(n){let e=!1;if(n!=null){let t=n.constructor;e=t==null||t==Object}return e}function __(n){return n!=null&&typeof n=="object"}const x_=Object.getPrototypeOf(Uint8Array),Ip="__proto__";function ca(n,e=wl){let t;if(Is(n)){let i=n.find(s=>s!=null);if(Is(i)||e(i)){t=Array(n.length);for(let s=0;s<n.length;s++)t[s]=ca(n[s],e)}else t=n.slice()}else if(n instanceof x_)t=n.slice();else if(e(n)){t={};for(let i in n)i!=Ip&&(t[i]=ca(n[i],e))}else t=n;return t}function an(n){let e=arguments;for(let t=1;t<e.length;t++){let i=e[t];for(let s in i)s!=Ip&&(wl(n[s])?an(n[s],ca(i[s])):n[s]=ca(i[s]))}return n}const v_=0,S_=1,M_=2;function E_(n,e,t){for(let i=0,s,r=-1;i<e.length;i++){let a=e[i];if(a>r){for(s=a-1;s>=0&&n[s]==null;)n[s--]=null;for(s=a+1;s<t&&n[s]==null;)n[r=s++]=null}}}function y_(n,e){if(A_(n)){let a=n[0].slice();for(let o=1;o<n.length;o++)a.push(...n[o].slice(1));return w_(a[0])||(a=b_(a)),a}let t=new Set;for(let a=0;a<n.length;a++){let l=n[a][0],c=l.length;for(let h=0;h<c;h++)t.add(l[h])}let i=[Array.from(t).sort((a,o)=>a-o)],s=i[0].length,r=new Map;for(let a=0;a<s;a++)r.set(i[0][a],a);for(let a=0;a<n.length;a++){let o=n[a],l=o[0];for(let c=1;c<o.length;c++){let h=o[c],u=Array(s).fill(void 0),f=e?e[a][c]:S_,g=[];for(let x=0;x<h.length;x++){let M=h[x],p=r.get(l[x]);M===null?f!=v_&&(u[p]=M,f==M_&&g.push(p)):u[p]=M}E_(u,g,s),i.push(u)}}return i}const T_=typeof queueMicrotask>"u"?n=>Promise.resolve().then(n):queueMicrotask;function b_(n){let e=n[0],t=e.length,i=Array(t);for(let r=0;r<i.length;r++)i[r]=r;i.sort((r,a)=>e[r]-e[a]);let s=[];for(let r=0;r<n.length;r++){let a=n[r],o=Array(t);for(let l=0;l<t;l++)o[l]=a[i[l]];s.push(o)}return s}function A_(n){let e=n[0][0],t=e.length;for(let i=1;i<n.length;i++){let s=n[i][0];if(s.length!=t)return!1;if(s!=e){for(let r=0;r<t;r++)if(s[r]!=e[r])return!1}}return!0}function w_(n,e=100){const t=n.length;if(t<=1)return!0;let i=0,s=t-1;for(;i<=s&&n[i]==null;)i++;for(;s>=i&&n[s]==null;)s--;if(s<=i)return!0;const r=Bn(1,ti((s-i+1)/e));for(let a=n[i],o=i+r;o<=s;o+=r){const l=n[o];if(l!=null){if(l<=a)return!1;a=l}}return!0}const Up=["January","February","March","April","May","June","July","August","September","October","November","December"],Np=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];function Fp(n){return n.slice(0,3)}const R_=Np.map(Fp),C_=Up.map(Fp),P_={MMMM:Up,MMM:C_,WWWW:Np,WWW:R_};function Ia(n){return(n<10?"0":"")+n}function D_(n){return(n<10?"00":n<100?"0":"")+n}const L_={YYYY:n=>n.getFullYear(),YY:n=>(n.getFullYear()+"").slice(2),MMMM:(n,e)=>e.MMMM[n.getMonth()],MMM:(n,e)=>e.MMM[n.getMonth()],MM:n=>Ia(n.getMonth()+1),M:n=>n.getMonth()+1,DD:n=>Ia(n.getDate()),D:n=>n.getDate(),WWWW:(n,e)=>e.WWWW[n.getDay()],WWW:(n,e)=>e.WWW[n.getDay()],HH:n=>Ia(n.getHours()),H:n=>n.getHours(),h:n=>{let e=n.getHours();return e==0?12:e>12?e-12:e},AA:n=>n.getHours()>=12?"PM":"AM",aa:n=>n.getHours()>=12?"pm":"am",a:n=>n.getHours()>=12?"p":"a",mm:n=>Ia(n.getMinutes()),m:n=>n.getMinutes(),ss:n=>Ia(n.getSeconds()),s:n=>n.getSeconds(),fff:n=>D_(n.getMilliseconds())};function hh(n,e){e=e||P_;let t=[],i=/\{([a-z]+)\}|[^{]+/gi,s;for(;s=i.exec(n);)t.push(s[0][0]=="{"?L_[s[1]]:s[0]);return r=>{let a="";for(let o=0;o<t.length;o++)a+=typeof t[o]=="string"?t[o]:t[o](r,e);return a}}const I_=new Intl.DateTimeFormat().resolvedOptions().timeZone;function U_(n,e){let t;return e=="UTC"||e=="Etc/UTC"?t=new Date(+n+n.getTimezoneOffset()*6e4):e==I_?t=n:(t=new Date(n.toLocaleString("en-US",{timeZone:e})),t.setMilliseconds(n.getMilliseconds())),t}const Op=n=>n%1==0,ll=[1,2,2.5,5],N_=io(10,-32,0,ll),Bp=io(10,0,32,ll),F_=Bp.filter(Op),nr=N_.concat(Bp),fh=`
`,zp="{YYYY}",Tf=fh+zp,kp="{M}/{D}",Za=fh+kp,bo=Za+"/{YY}",Vp="{aa}",O_="{h}:{mm}",Qr=O_+Vp,bf=fh+Qr,Af=":{ss}",Tt=null;function Gp(n){let e=n*1e3,t=e*60,i=t*60,s=i*24,r=s*30,a=s*365,l=(n==1?io(10,0,3,ll).filter(Op):io(10,-3,0,ll)).concat([e,e*5,e*10,e*15,e*30,t,t*5,t*10,t*15,t*30,i,i*2,i*3,i*4,i*6,i*8,i*12,s,s*2,s*3,s*4,s*5,s*6,s*7,s*8,s*9,s*10,s*15,r,r*2,r*3,r*4,r*6,a,a*2,a*5,a*10,a*25,a*50,a*100]);const c=[[a,zp,Tt,Tt,Tt,Tt,Tt,Tt,1],[s*28,"{MMM}",Tf,Tt,Tt,Tt,Tt,Tt,1],[s,kp,Tf,Tt,Tt,Tt,Tt,Tt,1],[i,"{h}"+Vp,bo,Tt,Za,Tt,Tt,Tt,1],[t,Qr,bo,Tt,Za,Tt,Tt,Tt,1],[e,Af,bo+" "+Qr,Tt,Za+" "+Qr,Tt,bf,Tt,1],[n,Af+".{fff}",bo+" "+Qr,Tt,Za+" "+Qr,Tt,bf,Tt,1]];function h(u){return(f,g,x,M,p,d)=>{let y=[],A=p>=a,b=p>=r&&p<a,D=u(x),R=Nt(D*n,3),U=Ql(D.getFullYear(),A?0:D.getMonth(),b||A?1:D.getDate()),k=Nt(U*n,3);if(b||A){let S=b?p/r:0,T=A?p/a:0,L=R==k?R:Nt(Ql(U.getFullYear()+T,U.getMonth()+S,1)*n,3),H=new Date(fn(L/n)),B=H.getFullYear(),X=H.getMonth();for(let Y=0;L<=M;Y++){let K=Ql(B+T*Y,X+S*Y,1),V=K-u(Nt(K*n,3));L=Nt((+K+V)*n,3),L<=M&&y.push(L)}}else{let S=p>=s?s:p,T=ti(x)-ti(R),L=k+T+Al(R-k,S);y.push(L);let H=u(L),B=H.getHours()+H.getMinutes()/t+H.getSeconds()/i,X=p/i,Y=f.axes[g]._space,K=d/Y;for(;L=Nt(L+p,n==1?0:3),!(L>M);)if(X>1){let V=ti(Nt(B+X,6))%24,ae=u(L).getHours()-V;ae>1&&(ae=-1),L-=ae*i,B=(B+X)%24;let ue=y[y.length-1];Nt((L-ue)/p,3)*K>=.7&&y.push(L)}else y.push(L)}return y}}return[l,c,h]}const[B_,z_,k_]=Gp(1),[V_,G_,H_]=Gp(.001);io(2,-53,53,[1]);function wf(n,e){return n.map(t=>t.map((i,s)=>s==0||s==8||i==null?i:e(s==1||t[8]==0?i:t[1]+i)))}function Rf(n,e){return(t,i,s,r,a)=>{let o=e.find(x=>a>=x[0])||e[e.length-1],l,c,h,u,f,g;return i.map(x=>{let M=n(x),p=M.getFullYear(),d=M.getMonth(),y=M.getDate(),A=M.getHours(),b=M.getMinutes(),D=M.getSeconds(),R=p!=l&&o[2]||d!=c&&o[3]||y!=h&&o[4]||A!=u&&o[5]||b!=f&&o[6]||D!=g&&o[7]||o[1];return l=p,c=d,h=y,u=A,f=b,g=D,R(M)})}}function W_(n,e){let t=hh(e);return(i,s,r,a,o)=>s.map(l=>t(n(l)))}function Ql(n,e,t){return new Date(n,e,t)}function Cf(n,e){return e(n)}const X_="{YYYY}-{MM}-{DD} {h}:{mm}{aa}";function Pf(n,e){return(t,i,s,r)=>r==null?rh:e(n(i))}function Y_(n,e){let t=n.series[e];return t.width?t.stroke(n,e):t.points.width?t.points.stroke(n,e):null}function q_(n,e){return n.series[e].fill(n,e)}const K_={show:!0,live:!0,isolate:!1,mount:d_,markers:{show:!0,width:2,stroke:Y_,fill:q_,dash:"solid"},idx:null,idxs:null,values:[]};function $_(n,e){let t=n.cursor.points,i=ci(),s=t.size(n,e);Wt(i,Ka,s),Wt(i,$a,s);let r=s/-2;Wt(i,"marginLeft",r),Wt(i,"marginTop",r);let a=t.width(n,e,s);return a&&Wt(i,"borderWidth",a),i}function Z_(n,e){let t=n.series[e].points;return t._fill||t._stroke}function j_(n,e){let t=n.series[e].points;return t._stroke||t._fill}function J_(n,e){return n.series[e].points.size}const ec=[0,0];function Q_(n,e,t){return ec[0]=e,ec[1]=t,ec}function Ao(n,e,t,i=!0){return s=>{s.button==0&&(!i||s.target==e)&&t(s)}}function tc(n,e,t,i=!0){return s=>{(!i||s.target==e)&&t(s)}}const e0={show:!0,x:!0,y:!0,lock:!1,move:Q_,points:{one:!1,show:$_,size:J_,width:0,stroke:j_,fill:Z_},bind:{mousedown:Ao,mouseup:Ao,click:Ao,dblclick:Ao,mousemove:tc,mouseleave:tc,mouseenter:tc},drag:{setScale:!0,x:!0,y:!1,dist:0,uni:null,click:(n,e)=>{e.stopPropagation(),e.stopImmediatePropagation()},_x:!1,_y:!1},focus:{dist:(n,e,t,i,s)=>i-s,prox:-1,bias:0},hover:{skip:[void 0],prox:null,bias:0},left:-10,top:-10,idx:null,dataIdx:null,idxs:null,event:null},Hp={show:!0,stroke:"rgba(0,0,0,0.07)",width:2},dh=an({},Hp,{filter:Cp}),Wp=an({},dh,{size:10}),Xp=an({},Hp,{show:!1}),ph='12px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',Yp="bold "+ph,qp=1.5,Df={show:!0,scale:"x",stroke:sh,space:50,gap:5,alignTo:1,size:50,labelGap:0,labelSize:30,labelFont:Yp,side:2,grid:dh,ticks:Wp,border:Xp,font:ph,lineGap:qp,rotate:0},t0="Value",n0="Time",Lf={show:!0,scale:"x",auto:!1,sorted:1,min:Ut,max:-Ut,idxs:[]};function i0(n,e,t,i,s){return e.map(r=>r==null?"":ch(r))}function s0(n,e,t,i,s,r,a){let o=[],l=Bs.get(s)||0;t=a?t:Nt(Al(t,s),l);for(let c=t;c<=i;c=Nt(c+s,l))o.push(Object.is(c,-0)?0:c);return o}function Wc(n,e,t,i,s,r,a){const o=[],l=n.scales[n.axes[e].scale].log,c=l==10?ms:Ap,h=ti(c(t));s=oa(l,h),l==10&&(s=nr[Ai(s,nr)]);let u=t,f=s*l;l==10&&(f=nr[Ai(f,nr)]);do o.push(u),u=u+s,l==10&&!Bs.has(u)&&(u=Nt(u,Bs.get(s))),u>=f&&(s=u,f=s*l,l==10&&(f=nr[Ai(f,nr)]));while(u<=i);return o}function r0(n,e,t,i,s,r,a){let l=n.scales[n.axes[e].scale].asinh,c=i>l?Wc(n,e,Bn(l,t),i,s):[l],h=i>=0&&t<=0?[0]:[];return(t<-l?Wc(n,e,Bn(l,-i),-t,s):[l]).reverse().map(f=>-f).concat(h,c)}const Kp=/./,a0=/[12357]/,o0=/[125]/,If=/1/,Xc=(n,e,t,i)=>n.map((s,r)=>e==4&&s==0||r%i==0&&t.test(s.toExponential()[s<0?1:0])?s:null);function l0(n,e,t,i,s){let r=n.axes[t],a=r.scale,o=n.scales[a],l=n.valToPos,c=r._space,h=l(10,a),u=l(9,a)-h>=c?Kp:l(7,a)-h>=c?a0:l(5,a)-h>=c?o0:If;if(u==If){let f=dn(l(1,a)-h);if(f<c)return Xc(e.slice().reverse(),o.distr,u,ui(c/f)).reverse()}return Xc(e,o.distr,u,1)}function c0(n,e,t,i,s){let r=n.axes[t],a=r.scale,o=r._space,l=n.valToPos,c=dn(l(1,a)-l(2,a));return c<o?Xc(e.slice().reverse(),3,Kp,ui(o/c)).reverse():e}function u0(n,e,t,i){return i==null?rh:e==null?"":ch(e)}const Uf={show:!0,scale:"y",stroke:sh,space:30,gap:5,alignTo:1,size:50,labelGap:0,labelSize:30,labelFont:Yp,side:3,grid:dh,ticks:Wp,border:Xp,font:ph,lineGap:qp,rotate:0};function h0(n,e){let t=3+(n||1)*2;return Nt(t*e,3)}function f0(n,e){let{scale:t,idxs:i}=n.series[0],s=n._data[0],r=n.valToPos(s[i[0]],t,!0),a=n.valToPos(s[i[1]],t,!0),o=dn(a-r),l=n.series[e],c=o/(l.points.space*yt);return i[1]-i[0]<=c}const Nf={scale:null,auto:!0,sorted:0,min:Ut,max:-Ut},$p=(n,e,t,i,s)=>s,Ff={show:!0,auto:!0,sorted:0,gaps:$p,alpha:1,facets:[an({},Nf,{scale:"x"}),an({},Nf,{scale:"y"})]},Of={scale:"y",auto:!0,sorted:0,show:!0,spanGaps:!1,gaps:$p,alpha:1,points:{show:f0,filter:null},values:null,min:Ut,max:-Ut,idxs:[],path:null,clip:null};function d0(n,e,t,i,s){return t/10}const Zp={time:Bg,auto:!0,distr:1,log:10,asinh:1,min:null,max:null,dir:1,ori:0},p0=an({},Zp,{time:!1,ori:1}),Bf={};function jp(n,e){let t=Bf[n];return t||(t={key:n,plots:[],sub(i){t.plots.push(i)},unsub(i){t.plots=t.plots.filter(s=>s!=i)},pub(i,s,r,a,o,l,c){for(let h=0;h<t.plots.length;h++)t.plots[h]!=s&&t.plots[h].pub(i,s,r,a,o,l,c)}},n!=null&&(Bf[n]=t)),t}const ua=1,Yc=2;function vr(n,e,t){const i=n.mode,s=n.series[e],r=i==2?n._data[e]:n._data,a=n.scales,o=n.bbox;let l=r[0],c=i==2?r[1]:r[e],h=i==2?a[s.facets[0].scale]:a[n.series[0].scale],u=i==2?a[s.facets[1].scale]:a[s.scale],f=o.left,g=o.top,x=o.width,M=o.height,p=n.valToPosH,d=n.valToPosV;return h.ori==0?t(s,l,c,h,u,p,d,f,g,x,M,Cl,va,Dl,Qp,tm):t(s,l,c,h,u,d,p,g,f,M,x,Pl,Sa,_h,em,nm)}function mh(n,e){let t=0,i=0,s=_t(n.bands,uh);for(let r=0;r<s.length;r++){let a=s[r];a.series[0]==e?t=a.dir:a.series[1]==e&&(a.dir==1?i|=1:i|=2)}return[t,i==1?-1:i==2?1:i==3?2:0]}function m0(n,e,t,i,s){let r=n.mode,a=n.series[e],o=r==2?a.facets[1].scale:a.scale,l=n.scales[o];return s==-1?l.min:s==1?l.max:l.distr==3?l.dir==1?l.min:l.max:0}function gs(n,e,t,i,s,r){return vr(n,e,(a,o,l,c,h,u,f,g,x,M,p)=>{let d=a.pxRound;const y=c.dir*(c.ori==0?1:-1),A=c.ori==0?va:Sa;let b,D;y==1?(b=t,D=i):(b=i,D=t);let R=d(u(o[b],c,M,g)),U=d(f(l[b],h,p,x)),k=d(u(o[D],c,M,g)),S=d(f(r==1?h.max:h.min,h,p,x)),T=new Path2D(s);return A(T,k,S),A(T,R,S),A(T,R,U),T})}function Rl(n,e,t,i,s,r){let a=null;if(n.length>0){a=new Path2D;const o=e==0?Dl:_h;let l=t;for(let u=0;u<n.length;u++){let f=n[u];if(f[1]>f[0]){let g=f[0]-l;g>0&&o(a,l,i,g,i+r),l=f[1]}}let c=t+s-l,h=10;c>0&&o(a,l,i-h/2,c,i+r+h)}return a}function g0(n,e,t){let i=n[n.length-1];i&&i[0]==e?i[1]=t:n.push([e,t])}function gh(n,e,t,i,s,r,a){let o=[],l=n.length;for(let c=s==1?t:i;c>=t&&c<=i;c+=s)if(e[c]===null){let u=c,f=c;if(s==1)for(;++c<=i&&e[c]===null;)f=c;else for(;--c>=t&&e[c]===null;)f=c;let g=r(n[u]),x=f==u?g:r(n[f]),M=u-s;g=a<=0&&M>=0&&M<l?r(n[M]):g;let d=f+s;x=a>=0&&d>=0&&d<l?r(n[d]):x,x>=g&&o.push([g,x])}return o}function zf(n){return n==0?Rp:n==1?fn:e=>tr(e,n)}function Jp(n){let e=n==0?Cl:Pl,t=n==0?(s,r,a,o,l,c)=>{s.arcTo(r,a,o,l,c)}:(s,r,a,o,l,c)=>{s.arcTo(a,r,l,o,c)},i=n==0?(s,r,a,o,l)=>{s.rect(r,a,o,l)}:(s,r,a,o,l)=>{s.rect(a,r,l,o)};return(s,r,a,o,l,c=0,h=0)=>{c==0&&h==0?i(s,r,a,o,l):(c=Ri(c,o/2,l/2),h=Ri(h,o/2,l/2),e(s,r+c,a),t(s,r+o,a,r+o,a+l,c),t(s,r+o,a+l,r,a+l,h),t(s,r,a+l,r,a,h),t(s,r,a,r+o,a,c),s.closePath())}}const Cl=(n,e,t)=>{n.moveTo(e,t)},Pl=(n,e,t)=>{n.moveTo(t,e)},va=(n,e,t)=>{n.lineTo(e,t)},Sa=(n,e,t)=>{n.lineTo(t,e)},Dl=Jp(0),_h=Jp(1),Qp=(n,e,t,i,s,r)=>{n.arc(e,t,i,s,r)},em=(n,e,t,i,s,r)=>{n.arc(t,e,i,s,r)},tm=(n,e,t,i,s,r,a)=>{n.bezierCurveTo(e,t,i,s,r,a)},nm=(n,e,t,i,s,r,a)=>{n.bezierCurveTo(t,e,s,i,a,r)};function im(n){return(e,t,i,s,r)=>vr(e,t,(a,o,l,c,h,u,f,g,x,M,p)=>{let{pxRound:d,points:y}=a,A,b;c.ori==0?(A=Cl,b=Qp):(A=Pl,b=em);const D=Nt(y.width*yt,3);let R=(y.size-y.width)/2*yt,U=Nt(R*2,3),k=new Path2D,S=new Path2D,{left:T,top:L,width:H,height:B}=e.bbox;Dl(S,T-U,L-U,H+U*2,B+U*2);const X=Y=>{if(l[Y]!=null){let K=d(u(o[Y],c,M,g)),V=d(f(l[Y],h,p,x));A(k,K+R,V),b(k,K,V,R,0,Jo*2)}};if(r)r.forEach(X);else for(let Y=i;Y<=s;Y++)X(Y);return{stroke:D>0?k:null,fill:k,clip:S,flags:ua|Yc}})}function sm(n){return(e,t,i,s,r,a)=>{i!=s&&(r!=i&&a!=i&&n(e,t,i),r!=s&&a!=s&&n(e,t,s),n(e,t,a))}}const _0=sm(va),x0=sm(Sa);function rm(n){const e=_t(n?.alignGaps,0);return(t,i,s,r)=>vr(t,i,(a,o,l,c,h,u,f,g,x,M,p)=>{[s,r]=Tl(l,s,r);let d=a.pxRound,y=B=>d(u(B,c,M,g)),A=B=>d(f(B,h,p,x)),b,D;c.ori==0?(b=va,D=_0):(b=Sa,D=x0);const R=c.dir*(c.ori==0?1:-1),U={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:ua},k=U.stroke;let S=!1;if(r-s>=M*4){let B=he=>t.posToVal(he,c.key,!0),X=null,Y=null,K,V,se,de=y(o[R==1?s:r]),ae=y(o[s]),ue=y(o[r]),Me=B(R==1?ae+1:ue-1);for(let he=R==1?s:r;he>=s&&he<=r;he+=R){let Qe=o[he],Q=(R==1?Qe<Me:Qe>Me)?de:y(Qe),te=l[he];Q==de?te!=null?(V=te,X==null?(b(k,Q,A(V)),K=X=Y=V):V<X?X=V:V>Y&&(Y=V)):te===null&&(S=!0):(X!=null&&D(k,de,A(X),A(Y),A(K),A(V)),te!=null?(V=te,b(k,Q,A(V)),X=Y=K=V):(X=Y=null,te===null&&(S=!0)),de=Q,Me=B(de+R))}X!=null&&X!=Y&&se!=de&&D(k,de,A(X),A(Y),A(K),A(V))}else for(let B=R==1?s:r;B>=s&&B<=r;B+=R){let X=l[B];X===null?S=!0:X!=null&&b(k,y(o[B]),A(X))}let[L,H]=mh(t,i);if(a.fill!=null||L!=0){let B=U.fill=new Path2D(k),X=a.fillTo(t,i,a.min,a.max,L),Y=A(X),K=y(o[s]),V=y(o[r]);R==-1&&([V,K]=[K,V]),b(B,V,Y),b(B,K,Y)}if(!a.spanGaps){let B=[];S&&B.push(...gh(o,l,s,r,R,y,e)),U.gaps=B=a.gaps(t,i,s,r,B),U.clip=Rl(B,c.ori,g,x,M,p)}return H!=0&&(U.band=H==2?[gs(t,i,s,r,k,-1),gs(t,i,s,r,k,1)]:gs(t,i,s,r,k,H)),U})}function v0(n){const e=_t(n.align,1),t=_t(n.ascDesc,!1),i=_t(n.alignGaps,0),s=_t(n.extend,!1);return(r,a,o,l)=>vr(r,a,(c,h,u,f,g,x,M,p,d,y,A)=>{[o,l]=Tl(u,o,l);let b=c.pxRound,{left:D,width:R}=r.bbox,U=ae=>b(x(ae,f,y,p)),k=ae=>b(M(ae,g,A,d)),S=f.ori==0?va:Sa;const T={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:ua},L=T.stroke,H=f.dir*(f.ori==0?1:-1);let B=k(u[H==1?o:l]),X=U(h[H==1?o:l]),Y=X,K=X;s&&e==-1&&(K=D,S(L,K,B)),S(L,X,B);for(let ae=H==1?o:l;ae>=o&&ae<=l;ae+=H){let ue=u[ae];if(ue==null)continue;let Me=U(h[ae]),he=k(ue);e==1?S(L,Me,B):S(L,Y,he),S(L,Me,he),B=he,Y=Me}let V=Y;s&&e==1&&(V=D+R,S(L,V,B));let[se,de]=mh(r,a);if(c.fill!=null||se!=0){let ae=T.fill=new Path2D(L),ue=c.fillTo(r,a,c.min,c.max,se),Me=k(ue);S(ae,V,Me),S(ae,K,Me)}if(!c.spanGaps){let ae=[];ae.push(...gh(h,u,o,l,H,U,i));let ue=c.width*yt/2,Me=t||e==1?ue:-ue,he=t||e==-1?-ue:ue;ae.forEach(Qe=>{Qe[0]+=Me,Qe[1]+=he}),T.gaps=ae=c.gaps(r,a,o,l,ae),T.clip=Rl(ae,f.ori,p,d,y,A)}return de!=0&&(T.band=de==2?[gs(r,a,o,l,L,-1),gs(r,a,o,l,L,1)]:gs(r,a,o,l,L,de)),T})}function kf(n,e,t,i,s,r,a=Ut){if(n.length>1){let o=null;for(let l=0,c=1/0;l<n.length;l++)if(e[l]!==void 0){if(o!=null){let h=dn(n[l]-n[o]);h<c&&(c=h,a=dn(t(n[l],i,s,r)-t(n[o],i,s,r)))}o=l}}return a}function S0(n){n=n||no;const e=_t(n.size,[.6,Ut,1]),t=n.align||0,i=n.gap||0;let s=n.radius;s=s==null?[0,0]:typeof s=="number"?[s,0]:s;const r=ct(s),a=1-e[0],o=_t(e[1],Ut),l=_t(e[2],1),c=_t(n.disp,no),h=_t(n.each,g=>{}),{fill:u,stroke:f}=c;return(g,x,M,p)=>vr(g,x,(d,y,A,b,D,R,U,k,S,T,L)=>{let H=d.pxRound,B=t,X=i*yt,Y=o*yt,K=l*yt,V,se;b.ori==0?[V,se]=r(g,x):[se,V]=r(g,x);const de=b.dir*(b.ori==0?1:-1);let ae=b.ori==0?Dl:_h,ue=b.ori==0?h:(I,j,ne,ee,Ne,me,Le)=>{h(I,j,ne,Ne,ee,Le,me)},Me=_t(g.bands,uh).find(I=>I.series[0]==x),he=Me!=null?Me.dir:0,Qe=d.fillTo(g,x,d.min,d.max,he),nt=H(U(Qe,D,L,S)),Q,te,Te,Ve=T,_e=H(d.width*yt),et=!1,Rt=null,Ye=null,at=null,ht=null;u!=null&&(_e==0||f!=null)&&(et=!0,Rt=u.values(g,x,M,p),Ye=new Map,new Set(Rt).forEach(I=>{I!=null&&Ye.set(I,new Path2D)}),_e>0&&(at=f.values(g,x,M,p),ht=new Map,new Set(at).forEach(I=>{I!=null&&ht.set(I,new Path2D)})));let{x0:qe,size:Ft}=c;if(qe!=null&&Ft!=null){B=1,y=qe.values(g,x,M,p),qe.unit==2&&(y=y.map(ne=>g.posToVal(k+ne*T,b.key,!0)));let I=Ft.values(g,x,M,p);Ft.unit==2?te=I[0]*T:te=R(I[0],b,T,k)-R(0,b,T,k),Ve=kf(y,A,R,b,T,k,Ve),Te=Ve-te+X}else Ve=kf(y,A,R,b,T,k,Ve),Te=Ve*a+X,te=Ve-Te;Te<1&&(Te=0),_e>=te/2&&(_e=0),Te<5&&(H=Rp);let N=Te>0,Ct=Ve-Te-(N?_e:0);te=H(Hc(Ct,K,Y)),Q=(B==0?te/2:B==de?0:te)-B*de*((B==0?X/2:0)+(N?_e/2:0));const Ke={stroke:null,fill:null,clip:null,band:null,gaps:null,flags:0},dt=et?null:new Path2D;let De=null;if(Me!=null)De=g.data[Me.series[1]];else{let{y0:I,y1:j}=c;I!=null&&j!=null&&(A=j.values(g,x,M,p),De=I.values(g,x,M,p))}let C=V*te,_=se*te;for(let I=de==1?M:p;I>=M&&I<=p;I+=de){let j=A[I];if(j==null)continue;if(De!=null){let pe=De[I]??0;if(j-pe==0)continue;nt=U(pe,D,L,S)}let ne=b.distr!=2||c!=null?y[I]:I,ee=R(ne,b,T,k),Ne=U(_t(j,Qe),D,L,S),me=H(ee-Q),Le=H(Bn(Ne,nt)),Be=H(Ri(Ne,nt)),oe=Le-Be;if(j!=null){let pe=j<0?_:C,Ae=j<0?C:_;et?(_e>0&&at[I]!=null&&ae(ht.get(at[I]),me,Be+ti(_e/2),te,Bn(0,oe-_e),pe,Ae),Rt[I]!=null&&ae(Ye.get(Rt[I]),me,Be+ti(_e/2),te,Bn(0,oe-_e),pe,Ae)):ae(dt,me,Be+ti(_e/2),te,Bn(0,oe-_e),pe,Ae),ue(g,x,I,me-_e/2,Be,te+_e,oe)}}return _e>0?Ke.stroke=et?ht:dt:et||(Ke._fill=d.width==0?d._fill:d._stroke??d._fill,Ke.width=0),Ke.fill=et?Ye:dt,Ke})}function M0(n,e){const t=_t(e?.alignGaps,0);return(i,s,r,a)=>vr(i,s,(o,l,c,h,u,f,g,x,M,p,d)=>{[r,a]=Tl(c,r,a);let y=o.pxRound,A=V=>y(f(V,h,p,x)),b=V=>y(g(V,u,d,M)),D,R,U;h.ori==0?(D=Cl,U=va,R=tm):(D=Pl,U=Sa,R=nm);const k=h.dir*(h.ori==0?1:-1);let S=A(l[k==1?r:a]),T=S,L=[],H=[];for(let V=k==1?r:a;V>=r&&V<=a;V+=k)if(c[V]!=null){let de=l[V],ae=A(de);L.push(T=ae),H.push(b(c[V]))}const B={stroke:n(L,H,D,U,R,y),fill:null,clip:null,band:null,gaps:null,flags:ua},X=B.stroke;let[Y,K]=mh(i,s);if(o.fill!=null||Y!=0){let V=B.fill=new Path2D(X),se=o.fillTo(i,s,o.min,o.max,Y),de=b(se);U(V,T,de),U(V,S,de)}if(!o.spanGaps){let V=[];V.push(...gh(l,c,r,a,k,A,t)),B.gaps=V=o.gaps(i,s,r,a,V),B.clip=Rl(V,h.ori,x,M,p,d)}return K!=0&&(B.band=K==2?[gs(i,s,r,a,X,-1),gs(i,s,r,a,X,1)]:gs(i,s,r,a,X,K)),B})}function E0(n){return M0(y0,n)}function y0(n,e,t,i,s,r){const a=n.length;if(a<2)return null;const o=new Path2D;if(t(o,n[0],e[0]),a==2)i(o,n[1],e[1]);else{let l=Array(a),c=Array(a-1),h=Array(a-1),u=Array(a-1);for(let f=0;f<a-1;f++)h[f]=e[f+1]-e[f],u[f]=n[f+1]-n[f],c[f]=h[f]/u[f];l[0]=c[0];for(let f=1;f<a-1;f++)c[f]===0||c[f-1]===0||c[f-1]>0!=c[f]>0?l[f]=0:(l[f]=3*(u[f-1]+u[f])/((2*u[f]+u[f-1])/c[f-1]+(u[f]+2*u[f-1])/c[f]),isFinite(l[f])||(l[f]=0));l[a-1]=c[a-2];for(let f=0;f<a-1;f++)s(o,n[f]+u[f]/3,e[f]+l[f]*u[f]/3,n[f+1]-u[f]/3,e[f+1]-l[f+1]*u[f]/3,n[f+1],e[f+1])}return o}const qc=new Set;function Vf(){for(let n of qc)n.syncRect(!0)}xa&&(dr(i_,na,Vf),dr(s_,na,Vf,!0),dr(al,na,()=>{Qt.pxRatio=yt}));const T0=rm(),b0=im();function Gf(n,e,t,i){return(i?[n[0],n[1]].concat(n.slice(2)):[n[0]].concat(n.slice(1))).map((r,a)=>Kc(r,a,e,t))}function A0(n,e){return n.map((t,i)=>i==0?{}:an({},e,t))}function Kc(n,e,t,i){return an({},e==0?t:i,n)}function am(n,e,t){return e==null?la:[e,t]}const w0=am;function R0(n,e,t){return e==null?la:ol(e,t,lh,!0)}function om(n,e,t,i){return e==null?la:bl(e,t,n.scales[i].log,!1)}const C0=om;function lm(n,e,t,i){return e==null?la:oh(e,t,n.scales[i].log,!1)}const P0=lm;function D0(n,e,t,i,s){let r=Bn(Sf(n),Sf(e)),a=e-n,o=Ai(s/i*a,t);do{let l=t[o],c=i*l/a;if(c>=s&&r+(l<5?Bs.get(l):0)<=17)return[l,c]}while(++o<t.length);return[0,0]}function Hf(n){let e,t;return n=n.replace(/(\d+)px/,(i,s)=>(e=fn((t=+s)*yt))+"px"),[n,e,t]}function L0(n){n.show&&[n.font,n.labelFont].forEach(e=>{let t=Nt(e[2]*yt,1);e[0]=e[0].replace(/[0-9.]+px/,t+"px"),e[1]=t})}function Qt(n,e,t){const i={mode:_t(n.mode,1)},s=i.mode;function r(m,v,w,P){let O=v.valToPct(m);return P+w*(v.dir==-1?1-O:O)}function a(m,v,w,P){let O=v.valToPct(m);return P+w*(v.dir==-1?O:1-O)}function o(m,v,w,P){return v.ori==0?r(m,v,w,P):a(m,v,w,P)}i.valToPosH=r,i.valToPosV=a;let l=!1;i.status=0;const c=i.root=ci(zg);if(n.id!=null&&(c.id=n.id),Jn(c,n.class),n.title){let m=ci(Gg,c);m.textContent=n.title}const h=bi("canvas"),u=i.ctx=h.getContext("2d"),f=ci(Hg,c);dr("click",f,m=>{m.target===x&&(kt!=wr||qt!=Rr)&&Tn.click(i,m)},!0);const g=i.under=ci(Wg,f);f.appendChild(h);const x=i.over=ci(Xg,f);n=ca(n);const M=+_t(n.pxAlign,1),p=zf(M);(n.plugins||[]).forEach(m=>{m.opts&&(n=m.opts(i,n)||n)});const d=n.ms||.001,y=i.series=s==1?Gf(n.series||[],Lf,Of,!1):A0(n.series||[null],Ff),A=i.axes=Gf(n.axes||[],Df,Uf,!0),b=i.scales={},D=i.bands=n.bands||[];D.forEach(m=>{m.fill=ct(m.fill||null),m.dir=_t(m.dir,-1)});const R=s==2?y[1].facets[0].scale:y[0].scale,U={axes:ss,series:St},k=(n.drawOrder||["axes","series"]).map(m=>U[m]);function S(m){const v=m.distr==3?w=>ms(w>0?w:m.clamp(i,w,m.min,m.max,m.key)):m.distr==4?w=>Jl(w,m.asinh):m.distr==100?w=>m.fwd(w):w=>w;return w=>{let P=v(w),{_min:O,_max:$}=m,ie=$-O;return(P-O)/ie}}function T(m){let v=b[m];if(v==null){let w=(n.scales||no)[m]||no;if(w.from!=null){T(w.from);let P=an({},b[w.from],w,{key:m});P.valToPct=S(P),b[m]=P}else{v=b[m]=an({},m==R?Zp:p0,w),v.key=m;let P=v.time,O=v.range,$=Is(O);if((m!=R||s==2&&!P)&&($&&(O[0]==null||O[1]==null)&&(O={min:O[0]==null?_f:{mode:1,hard:O[0],soft:O[0]},max:O[1]==null?_f:{mode:1,hard:O[1],soft:O[1]}},$=!1),!$&&wl(O))){let ie=O;O=(ce,ge,Re)=>ge==null?la:ol(ge,Re,ie)}v.range=ct(O||(P?w0:m==R?v.distr==3?C0:v.distr==4?P0:am:v.distr==3?om:v.distr==4?lm:R0)),v.auto=ct($?!1:v.auto),v.clamp=ct(v.clamp||d0),v._min=v._max=null,v.valToPct=S(v)}}}T("x"),T("y"),s==1&&y.forEach(m=>{T(m.scale)}),A.forEach(m=>{T(m.scale)});for(let m in n.scales)T(m);const L=b[R],H=L.distr;let B,X;L.ori==0?(Jn(c,kg),B=r,X=a):(Jn(c,Vg),B=a,X=r);const Y={};for(let m in b){let v=b[m];(v.min!=null||v.max!=null)&&(Y[m]={min:v.min,max:v.max},v.min=v.max=null)}const K=n.tzDate||(m=>new Date(fn(m/d))),V=n.fmtDate||hh,se=d==1?k_(K):H_(K),de=Rf(K,wf(d==1?z_:G_,V)),ae=Pf(K,Cf(X_,V)),ue=[],Me=i.legend=an({},K_,n.legend),he=i.cursor=an({},e0,{drag:{y:s==2}},n.cursor),Qe=Me.show,nt=he.show,Q=Me.markers;Me.idxs=ue,Q.width=ct(Q.width),Q.dash=ct(Q.dash),Q.stroke=ct(Q.stroke),Q.fill=ct(Q.fill);let te,Te,Ve,_e=[],et=[],Rt,Ye=!1,at={};if(Me.live){const m=y[1]?y[1].values:null;Ye=m!=null,Rt=Ye?m(i,1,0):{_:0};for(let v in Rt)at[v]=rh}if(Qe)if(te=bi("table",jg,c),Ve=bi("tbody",null,te),Me.mount(i,te),Ye){Te=bi("thead",null,te,Ve);let m=bi("tr",null,Te);bi("th",null,m);for(var ht in Rt)bi("th",sf,m).textContent=ht}else Jn(te,Qg),Me.live&&Jn(te,Jg);const qe={show:!0},Ft={show:!1};function N(m,v){if(v==0&&(Ye||!Me.live||s==2))return la;let w=[],P=bi("tr",e_,Ve,Ve.childNodes[v]);Jn(P,m.class),m.show||Jn(P,sr);let O=bi("th",null,P);if(Q.show){let ce=ci(t_,O);if(v>0){let ge=Q.width(i,v);ge&&(ce.style.border=ge+"px "+Q.dash(i,v)+" "+Q.stroke(i,v)),ce.style.background=Q.fill(i,v)}}let $=ci(sf,O);m.label instanceof HTMLElement?$.appendChild(m.label):$.textContent=m.label,v>0&&(Q.show||($.style.color=m.width>0?Q.stroke(i,v):Q.fill(i,v)),Ke("click",O,ce=>{if(he._lock)return;_n(ce);let ge=y.indexOf(m);if((ce.ctrlKey||ce.metaKey)!=Me.isolate){let Re=y.some((Pe,Fe)=>Fe>0&&Fe!=ge&&Pe.show);y.forEach((Pe,Fe)=>{Fe>0&&Fi(Fe,Re?Fe==ge?qe:Ft:qe,!0,nn.setSeries)})}else Fi(ge,{show:!m.show},!0,nn.setSeries)},!1),es&&Ke(lf,O,ce=>{he._lock||(_n(ce),Fi(y.indexOf(m),Pr,!0,nn.setSeries))},!1));for(var ie in Rt){let ce=bi("td",n_,P);ce.textContent="--",w.push(ce)}return[P,w]}const Ct=new Map;function Ke(m,v,w,P=!0){const O=Ct.get(v)||{},$=he.bind[m](i,v,w,P);$&&(dr(m,v,O[m]=$),Ct.set(v,O))}function dt(m,v,w){const P=Ct.get(v)||{};for(let O in P)(m==null||O==m)&&(Gc(O,v,P[O]),delete P[O]);m==null&&Ct.delete(v)}let De=0,C=0,_=0,I=0,j=0,ne=0,ee=j,Ne=ne,me=_,Le=I,Be=0,oe=0,pe=0,Ae=0;i.bbox={};let Oe=!1,xe=!1,$e=!1,F=!1,Ee=!1,le=!1;function we(m,v,w){(w||m!=i.width||v!=i.height)&&fe(m,v),yr(!1),$e=!0,xe=!0,Tr()}function fe(m,v){i.width=De=_=m,i.height=C=I=v,j=ne=0,Pt(),xt();let w=i.bbox;Be=w.left=tr(j*yt,.5),oe=w.top=tr(ne*yt,.5),pe=w.width=tr(_*yt,.5),Ae=w.height=tr(I*yt,.5)}const re=3;function ve(){let m=!1,v=0;for(;!m;){v++;let w=Cn(v),P=ya(v);m=v==re||w&&P,m||(fe(i.width,i.height),xe=!0)}}function Ze({width:m,height:v}){we(m,v)}i.setSize=Ze;function Pt(){let m=!1,v=!1,w=!1,P=!1;A.forEach((O,$)=>{if(O.show&&O._show){let{side:ie,_size:ce}=O,ge=ie%2,Re=O.label!=null?O.labelSize:0,Pe=ce+Re;Pe>0&&(ge?(_-=Pe,ie==3?(j+=Pe,P=!0):w=!0):(I-=Pe,ie==0?(ne+=Pe,m=!0):v=!0))}}),ri[0]=m,ri[1]=w,ri[2]=v,ri[3]=P,_-=vi[1]+vi[3],j+=vi[3],I-=vi[2]+vi[0],ne+=vi[0]}function xt(){let m=j+_,v=ne+I,w=j,P=ne;function O($,ie){switch($){case 1:return m+=ie,m-ie;case 2:return v+=ie,v-ie;case 3:return w-=ie,w+ie;case 0:return P-=ie,P+ie}}A.forEach(($,ie)=>{if($.show&&$._show){let ce=$.side;$._pos=O(ce,$._size),$.label!=null&&($._lpos=O(ce,$.labelSize))}})}if(he.dataIdx==null){let m=he.hover,v=m.skip=new Set(m.skip??[]);v.add(void 0);let w=m.prox=ct(m.prox),P=m.bias??=0;he.dataIdx=(O,$,ie,ce)=>{if($==0)return ie;let ge=ie,Re=w(O,$,ie,ce)??Ut,Pe=Re>=0&&Re<Ut,Fe=L.ori==0?_:I,je=he.left,Et=e[0],mt=e[$];if(v.has(mt[ie])){ge=null;let ot=null,We=null,ke;if(P==0||P==-1)for(ke=ie;ot==null&&ke-- >0;)v.has(mt[ke])||(ot=ke);if(P==0||P==1)for(ke=ie;We==null&&ke++<mt.length;)v.has(mt[ke])||(We=ke);if(ot!=null||We!=null)if(Pe){let Gt=ot==null?-1/0:B(Et[ot],L,Fe,0),Kt=We==null?1/0:B(Et[We],L,Fe,0),Mn=je-Gt,Dt=Kt-je;Mn<=Dt?Mn<=Re&&(ge=ot):Dt<=Re&&(ge=We)}else ge=We==null?ot:ot==null?We:ie-ot<=We-ie?ot:We}else Pe&&dn(je-B(Et[ie],L,Fe,0))>Re&&(ge=null);return ge}}const _n=m=>{he.event=m};he.idxs=ue,he._lock=!1;let Ot=he.points;Ot.show=ct(Ot.show),Ot.size=ct(Ot.size),Ot.stroke=ct(Ot.stroke),Ot.width=ct(Ot.width),Ot.fill=ct(Ot.fill);const si=i.focus=an({},n.focus||{alpha:.3},he.focus),es=si.prox>=0,Ii=es&&Ot.one;let zn=[],ts=[],ns=[];function Ui(m,v){let w=Ot.show(i,v);if(w instanceof HTMLElement)return Jn(w,Zg),Jn(w,m.class),ki(w,-10,-10,_,I),x.insertBefore(w,zn[v]),w}function Mr(m,v){if(s==1||v>0){let w=s==1&&b[m.scale].time,P=m.value;m.value=w?yf(P)?Pf(K,Cf(P,V)):P||ae:P||u0,m.label=m.label||(w?n0:t0)}if(Ii||v>0){m.width=m.width==null?1:m.width,m.paths=m.paths||T0||p_,m.fillTo=ct(m.fillTo||m0),m.pxAlign=+_t(m.pxAlign,M),m.pxRound=zf(m.pxAlign),m.stroke=ct(m.stroke||null),m.fill=ct(m.fill||null),m._stroke=m._fill=m._paths=m._focus=null;let w=h0(Bn(1,m.width),1),P=m.points=an({},{size:w,width:Bn(1,w*.2),stroke:m.stroke,space:w*2,paths:b0,_stroke:null,_fill:null},m.points);P.show=ct(P.show),P.filter=ct(P.filter),P.fill=ct(P.fill),P.stroke=ct(P.stroke),P.paths=ct(P.paths),P.pxAlign=m.pxAlign}if(Qe){let w=N(m,v);_e.splice(v,0,w[0]),et.splice(v,0,w[1]),Me.values.push(null)}if(nt){ue.splice(v,0,null);let w=null;Ii?v==0&&(w=Ui(m,v)):v>0&&(w=Ui(m,v)),zn.splice(v,0,w),ts.splice(v,0,0),ns.splice(v,0,0)}Sn("addSeries",v)}function _o(m,v){v=v??y.length,m=s==1?Kc(m,v,Lf,Of):Kc(m,v,{},Ff),y.splice(v,0,m),Mr(y[v],v)}i.addSeries=_o;function xo(m){if(y.splice(m,1),Qe){Me.values.splice(m,1),et.splice(m,1);let v=_e.splice(m,1)[0];dt(null,v.firstChild),v.remove()}nt&&(ue.splice(m,1),zn.splice(m,1)[0].remove(),ts.splice(m,1),ns.splice(m,1)),Sn("delSeries",m)}i.delSeries=xo;const ri=[!1,!1,!1,!1];function vo(m,v){if(m._show=m.show,m.show){let w=m.side%2,P=b[m.scale];P==null&&(m.scale=w?y[1].scale:R,P=b[m.scale]);let O=P.time;m.size=ct(m.size),m.space=ct(m.space),m.rotate=ct(m.rotate),Is(m.incrs)&&m.incrs.forEach(ie=>{!Bs.has(ie)&&Bs.set(ie,Dp(ie))}),m.incrs=ct(m.incrs||(P.distr==2?F_:O?d==1?B_:V_:nr)),m.splits=ct(m.splits||(O&&P.distr==1?se:P.distr==3?Wc:P.distr==4?r0:s0)),m.stroke=ct(m.stroke),m.grid.stroke=ct(m.grid.stroke),m.ticks.stroke=ct(m.ticks.stroke),m.border.stroke=ct(m.border.stroke);let $=m.values;m.values=Is($)&&!Is($[0])?ct($):O?Is($)?Rf(K,wf($,V)):yf($)?W_(K,$):$||de:$||i0,m.filter=ct(m.filter||(P.distr>=3&&P.log==10?l0:P.distr==3&&P.log==2?c0:Cp)),m.font=Hf(m.font),m.labelFont=Hf(m.labelFont),m._size=m.size(i,null,v,0),m._space=m._rotate=m._incrs=m._found=m._splits=m._values=null,m._size>0&&(ri[v]=!0,m._el=ci(Yg,f))}}function Ni(m,v,w,P){let[O,$,ie,ce]=w,ge=v%2,Re=0;return ge==0&&(ce||$)&&(Re=v==0&&!O||v==2&&!ie?fn(Df.size/3):0),ge==1&&(O||ie)&&(Re=v==1&&!$||v==3&&!ce?fn(Uf.size/2):0),Re}const Ea=i.padding=(n.padding||[Ni,Ni,Ni,Ni]).map(m=>ct(_t(m,Ni))),vi=i._padding=Ea.map((m,v)=>m(i,v,ri,0));let ln,en=null,tn=null;const Er=s==1?y[0].idxs:null;let Yn=null,Xs=!1;function E(m,v){if(e=m??[],i.data=i._data=e,s==2){ln=0;for(let w=1;w<y.length;w++)ln+=e[w][0].length}else{e.length==0&&(i.data=i._data=e=[[]]),Yn=e[0],ln=Yn.length;let w=e;if(H==2){w=e.slice();let P=w[0]=Array(ln);for(let O=0;O<ln;O++)P[O]=O}i._data=e=w}if(yr(!0),Sn("setData"),H==2&&($e=!0),v!==!1){let w=L;w.auto(i,Xs)?G():Ts(R,w.min,w.max),F=F||he.left>=0,le=!0,Tr()}}i.setData=E;function G(){Xs=!0;let m,v;s==1&&(ln>0?(en=Er[0]=0,tn=Er[1]=ln-1,m=e[0][en],v=e[0][tn],H==2?(m=en,v=tn):m==v&&(H==3?[m,v]=bl(m,m,L.log,!1):H==4?[m,v]=oh(m,m,L.log,!1):L.time?v=m+fn(86400/d):[m,v]=ol(m,v,lh,!0))):(en=Er[0]=m=null,tn=Er[1]=v=null)),Ts(R,m,v)}let J,Z,q,Se,Ce,ye,Ie,ze,He,Ue;function it(m,v,w,P,O,$){m??=af,w??=uh,P??="butt",O??=af,$??="round",m!=J&&(u.strokeStyle=J=m),O!=Z&&(u.fillStyle=Z=O),v!=q&&(u.lineWidth=q=v),$!=Ce&&(u.lineJoin=Ce=$),P!=ye&&(u.lineCap=ye=P),w!=Se&&u.setLineDash(Se=w)}function vt(m,v,w,P){v!=Z&&(u.fillStyle=Z=v),m!=Ie&&(u.font=Ie=m),w!=ze&&(u.textAlign=ze=w),P!=He&&(u.textBaseline=He=P)}function Bt(m,v,w,P,O=0){if(P.length>0&&m.auto(i,Xs)&&(v==null||v.min==null)){let $=_t(en,0),ie=_t(tn,P.length-1),ce=w.min==null?l_(P,$,ie,O,m.distr==3):[w.min,w.max];m.min=Ri(m.min,w.min=ce[0]),m.max=Bn(m.max,w.max=ce[1])}}const zt={min:null,max:null};function bt(){for(let P in b){let O=b[P];Y[P]==null&&(O.min==null||Y[R]!=null&&O.auto(i,Xs))&&(Y[P]=zt)}for(let P in b){let O=b[P];Y[P]==null&&O.from!=null&&Y[O.from]!=null&&(Y[P]=zt)}Y[R]!=null&&yr(!0);let m={};for(let P in Y){let O=Y[P];if(O!=null){let $=m[P]=ca(b[P],__);if(O.min!=null)an($,O);else if(P!=R||s==2)if(ln==0&&$.from==null){let ie=$.range(i,null,null,P);$.min=ie[0],$.max=ie[1]}else $.min=Ut,$.max=-Ut}}if(ln>0){y.forEach((P,O)=>{if(s==1){let $=P.scale,ie=Y[$];if(ie==null)return;let ce=m[$];if(O==0){let ge=ce.range(i,ce.min,ce.max,$);ce.min=ge[0],ce.max=ge[1],en=Ai(ce.min,e[0]),tn=Ai(ce.max,e[0]),tn-en>1&&(e[0][en]<ce.min&&en++,e[0][tn]>ce.max&&tn--),P.min=Yn[en],P.max=Yn[tn]}else P.show&&P.auto&&Bt(ce,ie,P,e[O],P.sorted);P.idxs[0]=en,P.idxs[1]=tn}else if(O>0&&P.show&&P.auto){let[$,ie]=P.facets,ce=$.scale,ge=ie.scale,[Re,Pe]=e[O],Fe=m[ce],je=m[ge];Fe!=null&&Bt(Fe,Y[ce],$,Re,$.sorted),je!=null&&Bt(je,Y[ge],ie,Pe,ie.sorted),P.min=ie.min,P.max=ie.max}});for(let P in m){let O=m[P],$=Y[P];if(O.from==null&&($==null||$.min==null)){let ie=O.range(i,O.min==Ut?null:O.min,O.max==-Ut?null:O.max,P);O.min=ie[0],O.max=ie[1]}}}for(let P in m){let O=m[P];if(O.from!=null){let $=m[O.from];if($.min==null)O.min=O.max=null;else{let ie=O.range(i,$.min,$.max,P);O.min=ie[0],O.max=ie[1]}}}let v={},w=!1;for(let P in m){let O=m[P],$=b[P];if($.min!=O.min||$.max!=O.max){$.min=O.min,$.max=O.max;let ie=$.distr;$._min=ie==3?ms($.min):ie==4?Jl($.min,$.asinh):ie==100?$.fwd($.min):$.min,$._max=ie==3?ms($.max):ie==4?Jl($.max,$.asinh):ie==100?$.fwd($.max):$.max,v[P]=w=!0}}if(w){y.forEach((P,O)=>{s==2?O>0&&v.y&&(P._paths=null):v[P.scale]&&(P._paths=null)});for(let P in v)$e=!0,Sn("setScale",P);nt&&he.left>=0&&(F=le=!0)}for(let P in Y)Y[P]=null}function Ge(m){let v=Hc(en-1,0,ln-1),w=Hc(tn+1,0,ln-1);for(;m[v]==null&&v>0;)v--;for(;m[w]==null&&w<ln-1;)w++;return[v,w]}function St(){if(ln>0){let m=y.some(v=>v._focus)&&Ue!=si.alpha;m&&(u.globalAlpha=Ue=si.alpha),y.forEach((v,w)=>{if(w>0&&v.show&&(ut(w,!1),ut(w,!0),v._paths==null)){let P=Ue;Ue!=v.alpha&&(u.globalAlpha=Ue=v.alpha);let O=s==2?[0,e[w][0].length-1]:Ge(e[w]);v._paths=v.paths(i,w,O[0],O[1]),Ue!=P&&(u.globalAlpha=Ue=P)}}),y.forEach((v,w)=>{if(w>0&&v.show){let P=Ue;Ue!=v.alpha&&(u.globalAlpha=Ue=v.alpha),v._paths!=null&&wn(w,!1);{let O=v._paths!=null?v._paths.gaps:null,$=v.points.show(i,w,en,tn,O),ie=v.points.filter(i,w,$,O);($||ie)&&(v.points._paths=v.points.paths(i,w,en,tn,ie),wn(w,!0))}Ue!=P&&(u.globalAlpha=Ue=P),Sn("drawSeries",w)}}),m&&(u.globalAlpha=Ue=1)}}function ut(m,v){let w=v?y[m].points:y[m];w._stroke=w.stroke(i,m),w._fill=w.fill(i,m)}function wn(m,v){let w=v?y[m].points:y[m],{stroke:P,fill:O,clip:$,flags:ie,_stroke:ce=w._stroke,_fill:ge=w._fill,_width:Re=w.width}=w._paths;Re=Nt(Re*yt,3);let Pe=null,Fe=Re%2/2;v&&ge==null&&(ge=Re>0?"#fff":ce);let je=w.pxAlign==1&&Fe>0;if(je&&u.translate(Fe,Fe),!v){let Et=Be-Re/2,mt=oe-Re/2,ot=pe+Re,We=Ae+Re;Pe=new Path2D,Pe.rect(Et,mt,ot,We)}v?is(ce,Re,w.dash,w.cap,ge,P,O,ie,$):Es(m,ce,Re,w.dash,w.cap,ge,P,O,ie,Pe,$),je&&u.translate(-Fe,-Fe)}function Es(m,v,w,P,O,$,ie,ce,ge,Re,Pe){let Fe=!1;ge!=0&&D.forEach((je,Et)=>{if(je.series[0]==m){let mt=y[je.series[1]],ot=e[je.series[1]],We=(mt._paths||no).band;Is(We)&&(We=je.dir==1?We[0]:We[1]);let ke,Gt=null;mt.show&&We&&u_(ot,en,tn)?(Gt=je.fill(i,Et)||$,ke=mt._paths.clip):We=null,is(v,w,P,O,Gt,ie,ce,ge,Re,Pe,ke,We),Fe=!0}}),Fe||is(v,w,P,O,$,ie,ce,ge,Re,Pe)}const Rn=ua|Yc;function is(m,v,w,P,O,$,ie,ce,ge,Re,Pe,Fe){it(m,v,w,P,O),(ge||Re||Fe)&&(u.save(),ge&&u.clip(ge),Re&&u.clip(Re)),Fe?(ce&Rn)==Rn?(u.clip(Fe),Pe&&u.clip(Pe),cn(O,ie),Mt(m,$,v)):ce&Yc?(cn(O,ie),u.clip(Fe),Mt(m,$,v)):ce&ua&&(u.save(),u.clip(Fe),Pe&&u.clip(Pe),cn(O,ie),u.restore(),Mt(m,$,v)):(cn(O,ie),Mt(m,$,v)),(ge||Re||Fe)&&u.restore()}function Mt(m,v,w){w>0&&(v instanceof Map?v.forEach((P,O)=>{u.strokeStyle=J=O,u.stroke(P)}):v!=null&&m&&u.stroke(v))}function cn(m,v){v instanceof Map?v.forEach((w,P)=>{u.fillStyle=Z=P,u.fill(w)}):v!=null&&m&&u.fill(v)}function kn(m,v,w,P){let O=A[m],$;if(P<=0)$=[0,0];else{let ie=O._space=O.space(i,m,v,w,P),ce=O._incrs=O.incrs(i,m,v,w,P,ie);$=D0(v,w,ce,P,ie)}return O._found=$}function un(m,v,w,P,O,$,ie,ce,ge,Re){let Pe=ie%2/2;M==1&&u.translate(Pe,Pe),it(ce,ie,ge,Re,ce),u.beginPath();let Fe,je,Et,mt,ot=O+(P==0||P==3?-$:$);w==0?(je=O,mt=ot):(Fe=O,Et=ot);for(let We=0;We<m.length;We++)v[We]!=null&&(w==0?Fe=Et=m[We]:je=mt=m[We],u.moveTo(Fe,je),u.lineTo(Et,mt));u.stroke(),M==1&&u.translate(-Pe,-Pe)}function Cn(m){let v=!0;return A.forEach((w,P)=>{if(!w.show)return;let O=b[w.scale];if(O.min==null){w._show&&(v=!1,w._show=!1,yr(!1));return}else w._show||(v=!1,w._show=!0,yr(!1));let $=w.side,ie=$%2,{min:ce,max:ge}=O,[Re,Pe]=kn(P,ce,ge,ie==0?_:I);if(Pe==0)return;let Fe=O.distr==2,je=w._splits=w.splits(i,P,ce,ge,Re,Pe,Fe),Et=O.distr==2?je.map(ke=>Yn[ke]):je,mt=O.distr==2?Yn[je[1]]-Yn[je[0]]:Re,ot=w._values=w.values(i,w.filter(i,Et,P,Pe,mt),P,Pe,mt);w._rotate=$==2?w.rotate(i,ot,P,Pe):0;let We=w._size;w._size=ui(w.size(i,ot,P,m)),We!=null&&w._size!=We&&(v=!1)}),v}function ya(m){let v=!0;return Ea.forEach((w,P)=>{let O=w(i,P,ri,m);O!=vi[P]&&(v=!1),vi[P]=O}),v}function ss(){for(let m=0;m<A.length;m++){let v=A[m];if(!v.show||!v._show)continue;let w=v.side,P=w%2,O,$,ie=v.stroke(i,m),ce=w==0||w==3?-1:1,[ge,Re]=v._found;if(v.label!=null){let Un=v.labelGap*ce,$n=fn((v._lpos+Un)*yt);vt(v.labelFont[0],ie,"center",w==2?La:rf),u.save(),P==1?(O=$=0,u.translate($n,fn(oe+Ae/2)),u.rotate((w==3?-Jo:Jo)/2)):(O=fn(Be+pe/2),$=$n);let Ks=wp(v.label)?v.label(i,m,ge,Re):v.label;u.fillText(Ks,O,$),u.restore()}if(Re==0)continue;let Pe=b[v.scale],Fe=P==0?pe:Ae,je=P==0?Be:oe,Et=v._splits,mt=Pe.distr==2?Et.map(Un=>Yn[Un]):Et,ot=Pe.distr==2?Yn[Et[1]]-Yn[Et[0]]:ge,We=v.ticks,ke=v.border,Gt=We.show?We.size:0,Kt=fn(Gt*yt),Mn=fn((v.alignTo==2?v._size-Gt-v.gap:v.gap)*yt),Dt=v._rotate*-Jo/180,$t=p(v._pos*yt),qn=(Kt+Mn)*ce,In=$t+qn;$=P==0?In:0,O=P==1?In:0;let ai=v.font[0],Si=v.align==1?Lr:v.align==2?$l:Dt>0?Lr:Dt<0?$l:P==0?"center":w==3?$l:Lr,Bi=Dt||P==1?"middle":w==2?La:rf;vt(ai,ie,Si,Bi);let Kn=v.font[1]*v.lineGap,oi=Et.map(Un=>p(o(Un,Pe,Fe,je))),Mi=v._values;for(let Un=0;Un<Mi.length;Un++){let $n=Mi[Un];if($n!=null){P==0?O=oi[Un]:$=oi[Un],$n=""+$n;let Ks=$n.indexOf(`
`)==-1?[$n]:$n.split(/\n/gm);for(let Nn=0;Nn<Ks.length;Nn++){let ef=Ks[Nn];Dt?(u.save(),u.translate(O,$+Nn*Kn),u.rotate(Dt),u.fillText(ef,0,0),u.restore()):u.fillText(ef,O,$+Nn*Kn)}}}We.show&&un(oi,We.filter(i,mt,m,Re,ot),P,w,$t,Kt,Nt(We.width*yt,3),We.stroke(i,m),We.dash,We.cap);let zi=v.grid;zi.show&&un(oi,zi.filter(i,mt,m,Re,ot),P,P==0?2:1,P==0?oe:Be,P==0?Ae:pe,Nt(zi.width*yt,3),zi.stroke(i,m),zi.dash,zi.cap),ke.show&&un([$t],[1],P==0?1:0,P==0?1:2,P==1?oe:Be,P==1?Ae:pe,Nt(ke.width*yt,3),ke.stroke(i,m),ke.dash,ke.cap)}Sn("drawAxes")}function yr(m){y.forEach((v,w)=>{w>0&&(v._paths=null,m&&(s==1?(v.min=null,v.max=null):v.facets.forEach(P=>{P.min=null,P.max=null})))})}let So=!1,Bl=!1,Ta=[];function tg(){Bl=!1;for(let m=0;m<Ta.length;m++)Sn(...Ta[m]);Ta.length=0}function Tr(){So||(T_(Fh),So=!0)}function ng(m,v=!1){So=!0,Bl=v,m(i),Fh(),v&&Ta.length>0&&queueMicrotask(tg)}i.batch=ng;function Fh(){if(Oe&&(bt(),Oe=!1),$e&&(ve(),$e=!1),xe){if(Wt(g,Lr,j),Wt(g,La,ne),Wt(g,Ka,_),Wt(g,$a,I),Wt(x,Lr,j),Wt(x,La,ne),Wt(x,Ka,_),Wt(x,$a,I),Wt(f,Ka,De),Wt(f,$a,C),h.width=fn(De*yt),h.height=fn(C*yt),A.forEach(({_el:m,_show:v,_size:w,_pos:P,side:O})=>{if(m!=null)if(v){let $=O===3||O===0?w:0,ie=O%2==1;Wt(m,ie?"left":"top",P-$),Wt(m,ie?"width":"height",w),Wt(m,ie?"top":"left",ie?ne:j),Wt(m,ie?"height":"width",ie?I:_),Vc(m,sr)}else Jn(m,sr)}),J=Z=q=Ce=ye=Ie=ze=He=Se=null,Ue=1,wa(!0),j!=ee||ne!=Ne||_!=me||I!=Le){yr(!1);let m=_/me,v=I/Le;if(nt&&!F&&he.left>=0){he.left*=m,he.top*=v,br&&ki(br,fn(he.left),0,_,I),Ar&&ki(Ar,0,fn(he.top),_,I);for(let w=0;w<zn.length;w++){let P=zn[w];P!=null&&(ts[w]*=m,ns[w]*=v,ki(P,ui(ts[w]),ui(ns[w]),_,I))}}if(Vt.show&&!Ee&&Vt.left>=0&&Vt.width>0){Vt.left*=m,Vt.width*=m,Vt.top*=v,Vt.height*=v;for(let w in Wl)Wt(Cr,w,Vt[w])}ee=j,Ne=ne,me=_,Le=I}Sn("setSize"),xe=!1}De>0&&C>0&&(u.clearRect(0,0,h.width,h.height),Sn("drawClear"),k.forEach(m=>m()),Sn("draw")),Vt.show&&Ee&&(Mo(Vt),Ee=!1),nt&&F&&(qs(null,!0,!1),F=!1),Me.show&&Me.live&&le&&(Gl(),le=!1),l||(l=!0,i.status=1,Sn("ready")),Xs=!1,So=!1}i.redraw=(m,v)=>{$e=v||!1,m!==!1?Ts(R,L.min,L.max):Tr()};function zl(m,v){let w=b[m];if(w.from==null){if(ln==0){let P=w.range(i,v.min,v.max,m);v.min=P[0],v.max=P[1]}if(v.min>v.max){let P=v.min;v.min=v.max,v.max=P}if(ln>1&&v.min!=null&&v.max!=null&&v.max-v.min<1e-16)return;m==R&&w.distr==2&&ln>0&&(v.min=Ai(v.min,e[0]),v.max=Ai(v.max,e[0]),v.min==v.max&&v.max++),Y[m]=v,Oe=!0,Tr()}}i.setScale=zl;let kl,Vl,br,Ar,Oh,Bh,wr,Rr,zh,kh,kt,qt,ys=!1;const Tn=he.drag;let xn=Tn.x,vn=Tn.y;nt&&(he.x&&(kl=ci(Kg,x)),he.y&&(Vl=ci($g,x)),L.ori==0?(br=kl,Ar=Vl):(br=Vl,Ar=kl),kt=he.left,qt=he.top);const Vt=i.select=an({show:!0,over:!0,left:0,width:0,top:0,height:0},n.select),Cr=Vt.show?ci(qg,Vt.over?x:g):null;function Mo(m,v){if(Vt.show){for(let w in m)Vt[w]=m[w],w in Wl&&Wt(Cr,w,m[w]);v!==!1&&Sn("setSelect")}}i.setSelect=Mo;function ig(m){if(y[m].show)Qe&&Vc(_e[m],sr);else if(Qe&&Jn(_e[m],sr),nt){let w=Ii?zn[0]:zn[m];w!=null&&ki(w,-10,-10,_,I)}}function Ts(m,v,w){zl(m,{min:v,max:w})}function Fi(m,v,w,P){v.focus!=null&&lg(m),v.show!=null&&y.forEach((O,$)=>{$>0&&(m==$||m==null)&&(O.show=v.show,ig($),s==2?(Ts(O.facets[0].scale,null,null),Ts(O.facets[1].scale,null,null)):Ts(O.scale,null,null),Tr())}),w!==!1&&Sn("setSeries",m,v),P&&Ra("setSeries",i,m,v)}i.setSeries=Fi;function sg(m,v){an(D[m],v)}function rg(m,v){m.fill=ct(m.fill||null),m.dir=_t(m.dir,-1),v=v??D.length,D.splice(v,0,m)}function ag(m){m==null?D.length=0:D.splice(m,1)}i.addBand=rg,i.setBand=sg,i.delBand=ag;function og(m,v){y[m].alpha=v,nt&&zn[m]!=null&&(zn[m].style.opacity=v),Qe&&_e[m]&&(_e[m].style.opacity=v)}let rs,bs,Ys;const Pr={focus:!0};function lg(m){if(m!=Ys){let v=m==null,w=si.alpha!=1;y.forEach((P,O)=>{if(s==1||O>0){let $=v||O==0||O==m;P._focus=v?null:$,w&&og(O,$?1:si.alpha)}}),Ys=m,w&&Tr()}}Qe&&es&&Ke(cf,te,m=>{he._lock||(_n(m),Ys!=null&&Fi(null,Pr,!0,nn.setSeries))});function Oi(m,v,w){let P=b[v];w&&(m=m/yt-(P.ori==1?ne:j));let O=_;P.ori==1&&(O=I,m=O-m),P.dir==-1&&(m=O-m);let $=P._min,ie=P._max,ce=m/O,ge=$+(ie-$)*ce,Re=P.distr;return Re==3?oa(10,ge):Re==4?f_(ge,P.asinh):Re==100?P.bwd(ge):ge}function cg(m,v){let w=Oi(m,R,v);return Ai(w,e[0],en,tn)}i.valToIdx=m=>Ai(m,e[0]),i.posToIdx=cg,i.posToVal=Oi,i.valToPos=(m,v,w)=>b[v].ori==0?r(m,b[v],w?pe:_,w?Be:0):a(m,b[v],w?Ae:I,w?oe:0),i.setCursor=(m,v,w)=>{kt=m.left,qt=m.top,qs(null,v,w)};function Vh(m,v){Wt(Cr,Lr,Vt.left=m),Wt(Cr,Ka,Vt.width=v)}function Gh(m,v){Wt(Cr,La,Vt.top=m),Wt(Cr,$a,Vt.height=v)}let ba=L.ori==0?Vh:Gh,Aa=L.ori==1?Vh:Gh;function ug(){if(Qe&&Me.live)for(let m=s==2?1:0;m<y.length;m++){if(m==0&&Ye)continue;let v=Me.values[m],w=0;for(let P in v)et[m][w++].firstChild.nodeValue=v[P]}}function Gl(m,v){if(m!=null&&(m.idxs?m.idxs.forEach((w,P)=>{ue[P]=w}):g_(m.idx)||ue.fill(m.idx),Me.idx=ue[0]),Qe&&Me.live){for(let w=0;w<y.length;w++)(w>0||s==1&&!Ye)&&hg(w,ue[w]);ug()}le=!1,v!==!1&&Sn("setLegend")}i.setLegend=Gl;function hg(m,v){let w=y[m],P=m==0&&H==2?Yn:e[m],O;Ye?O=w.values(i,m,v)??at:(O=w.value(i,v==null?null:P[v],m,v),O=O==null?at:{_:O}),Me.values[m]=O}function qs(m,v,w){zh=kt,kh=qt,[kt,qt]=he.move(i,kt,qt),he.left=kt,he.top=qt,nt&&(br&&ki(br,fn(kt),0,_,I),Ar&&ki(Ar,0,fn(qt),_,I));let P,O=en>tn;rs=Ut,bs=null;let $=L.ori==0?_:I,ie=L.ori==1?_:I;if(kt<0||ln==0||O){P=he.idx=null;for(let ce=0;ce<y.length;ce++){let ge=zn[ce];ge!=null&&ki(ge,-10,-10,_,I)}es&&Fi(null,Pr,!0,m==null&&nn.setSeries),Me.live&&(ue.fill(P),le=!0)}else{let ce,ge,Re;s==1&&(ce=L.ori==0?kt:qt,ge=Oi(ce,R),P=he.idx=Ai(ge,e[0],en,tn),Re=B(e[0][P],L,$,0));let Pe=-10,Fe=-10,je=0,Et=0,mt=!0,ot="",We="";for(let ke=s==2?1:0;ke<y.length;ke++){let Gt=y[ke],Kt=ue[ke],Mn=Kt==null?null:s==1?e[ke][Kt]:e[ke][1][Kt],Dt=he.dataIdx(i,ke,P,ge),$t=Dt==null?null:s==1?e[ke][Dt]:e[ke][1][Dt];if(le=le||$t!=Mn||Dt!=Kt,ue[ke]=Dt,ke>0&&Gt.show){let qn=Dt==null?-10:Dt==P?Re:B(s==1?e[0][Dt]:e[ke][0][Dt],L,$,0),In=$t==null?-10:X($t,s==1?b[Gt.scale]:b[Gt.facets[1].scale],ie,0);if(es&&$t!=null){let ai=L.ori==1?kt:qt,Si=dn(si.dist(i,ke,Dt,In,ai));if(Si<rs){let Bi=si.bias;if(Bi!=0){let Kn=Oi(ai,Gt.scale),oi=$t>=0?1:-1,Mi=Kn>=0?1:-1;Mi==oi&&(Mi==1?Bi==1?$t>=Kn:$t<=Kn:Bi==1?$t<=Kn:$t>=Kn)&&(rs=Si,bs=ke)}else rs=Si,bs=ke}}if(le||Ii){let ai,Si;L.ori==0?(ai=qn,Si=In):(ai=In,Si=qn);let Bi,Kn,oi,Mi,zi,Un,$n=!0,Ks=Ot.bbox;if(Ks!=null){$n=!1;let Nn=Ks(i,ke);oi=Nn.left,Mi=Nn.top,Bi=Nn.width,Kn=Nn.height}else oi=ai,Mi=Si,Bi=Kn=Ot.size(i,ke);if(Un=Ot.fill(i,ke),zi=Ot.stroke(i,ke),Ii)ke==bs&&rs<=si.prox&&(Pe=oi,Fe=Mi,je=Bi,Et=Kn,mt=$n,ot=Un,We=zi);else{let Nn=zn[ke];Nn!=null&&(ts[ke]=oi,ns[ke]=Mi,gf(Nn,Bi,Kn,$n),pf(Nn,Un,zi),ki(Nn,ui(oi),ui(Mi),_,I))}}}}if(Ii){let ke=si.prox,Gt=Ys==null?rs<=ke:rs>ke||bs!=Ys;if(le||Gt){let Kt=zn[0];Kt!=null&&(ts[0]=Pe,ns[0]=Fe,gf(Kt,je,Et,mt),pf(Kt,ot,We),ki(Kt,ui(Pe),ui(Fe),_,I))}}}if(Vt.show&&ys)if(m!=null){let[ce,ge]=nn.scales,[Re,Pe]=nn.match,[Fe,je]=m.cursor.sync.scales,Et=m.cursor.drag;if(xn=Et._x,vn=Et._y,xn||vn){let{left:mt,top:ot,width:We,height:ke}=m.select,Gt=m.scales[Fe].ori,Kt=m.posToVal,Mn,Dt,$t,qn,In,ai=ce!=null&&Re(ce,Fe),Si=ge!=null&&Pe(ge,je);ai&&xn?(Gt==0?(Mn=mt,Dt=We):(Mn=ot,Dt=ke),$t=b[ce],qn=B(Kt(Mn,Fe),$t,$,0),In=B(Kt(Mn+Dt,Fe),$t,$,0),ba(Ri(qn,In),dn(In-qn))):ba(0,$),Si&&vn?(Gt==1?(Mn=mt,Dt=We):(Mn=ot,Dt=ke),$t=b[ge],qn=X(Kt(Mn,je),$t,ie,0),In=X(Kt(Mn+Dt,je),$t,ie,0),Aa(Ri(qn,In),dn(In-qn))):Aa(0,ie)}else Xl()}else{let ce=dn(zh-Oh),ge=dn(kh-Bh);if(L.ori==1){let je=ce;ce=ge,ge=je}xn=Tn.x&&ce>=Tn.dist,vn=Tn.y&&ge>=Tn.dist;let Re=Tn.uni;Re!=null?xn&&vn&&(xn=ce>=Re,vn=ge>=Re,!xn&&!vn&&(ge>ce?vn=!0:xn=!0)):Tn.x&&Tn.y&&(xn||vn)&&(xn=vn=!0);let Pe,Fe;xn&&(L.ori==0?(Pe=wr,Fe=kt):(Pe=Rr,Fe=qt),ba(Ri(Pe,Fe),dn(Fe-Pe)),vn||Aa(0,ie)),vn&&(L.ori==1?(Pe=wr,Fe=kt):(Pe=Rr,Fe=qt),Aa(Ri(Pe,Fe),dn(Fe-Pe)),xn||ba(0,$)),!xn&&!vn&&(ba(0,0),Aa(0,0))}if(Tn._x=xn,Tn._y=vn,m==null){if(w){if(Qh!=null){let[ce,ge]=nn.scales;nn.values[0]=ce!=null?Oi(L.ori==0?kt:qt,ce):null,nn.values[1]=ge!=null?Oi(L.ori==1?kt:qt,ge):null}Ra(Zl,i,kt,qt,_,I,P)}if(es){let ce=w&&nn.setSeries,ge=si.prox;Ys==null?rs<=ge&&Fi(bs,Pr,!0,ce):rs>ge?Fi(null,Pr,!0,ce):bs!=Ys&&Fi(bs,Pr,!0,ce)}}le&&(Me.idx=P,Gl()),v!==!1&&Sn("setCursor")}let As=null;Object.defineProperty(i,"rect",{get(){return As==null&&wa(!1),As}});function wa(m=!1){m?As=null:(As=x.getBoundingClientRect(),Sn("syncRect",As))}function Hh(m,v,w,P,O,$,ie){he._lock||ys&&m!=null&&m.movementX==0&&m.movementY==0||(Hl(m,v,w,P,O,$,ie,!1,m!=null),m!=null?qs(null,!0,!0):qs(v,!0,!1))}function Hl(m,v,w,P,O,$,ie,ce,ge){if(As==null&&wa(!1),_n(m),m!=null)w=m.clientX-As.left,P=m.clientY-As.top;else{if(w<0||P<0){kt=-10,qt=-10;return}let[Re,Pe]=nn.scales,Fe=v.cursor.sync,[je,Et]=Fe.values,[mt,ot]=Fe.scales,[We,ke]=nn.match,Gt=v.axes[0].side%2==1,Kt=L.ori==0?_:I,Mn=L.ori==1?_:I,Dt=Gt?$:O,$t=Gt?O:$,qn=Gt?P:w,In=Gt?w:P;if(mt!=null?w=We(Re,mt)?o(je,b[Re],Kt,0):-10:w=Kt*(qn/Dt),ot!=null?P=ke(Pe,ot)?o(Et,b[Pe],Mn,0):-10:P=Mn*(In/$t),L.ori==1){let ai=w;w=P,P=ai}}ge&&(v==null||v.cursor.event.type==Zl)&&((w<=1||w>=_-1)&&(w=tr(w,_)),(P<=1||P>=I-1)&&(P=tr(P,I))),ce?(Oh=w,Bh=P,[wr,Rr]=he.move(i,w,P)):(kt=w,qt=P)}const Wl={width:0,height:0,left:0,top:0};function Xl(){Mo(Wl,!1)}let Wh,Xh,Yh,qh;function Kh(m,v,w,P,O,$,ie){ys=!0,xn=vn=Tn._x=Tn._y=!1,Hl(m,v,w,P,O,$,ie,!0,!1),m!=null&&(Ke(jl,zc,$h,!1),Ra(of,i,wr,Rr,_,I,null));let{left:ce,top:ge,width:Re,height:Pe}=Vt;Wh=ce,Xh=ge,Yh=Re,qh=Pe}function $h(m,v,w,P,O,$,ie){ys=Tn._x=Tn._y=!1,Hl(m,v,w,P,O,$,ie,!1,!0);let{left:ce,top:ge,width:Re,height:Pe}=Vt,Fe=Re>0||Pe>0,je=Wh!=ce||Xh!=ge||Yh!=Re||qh!=Pe;if(Fe&&je&&Mo(Vt),Tn.setScale&&Fe&&je){let Et=ce,mt=Re,ot=ge,We=Pe;if(L.ori==1&&(Et=ge,mt=Pe,ot=ce,We=Re),xn&&Ts(R,Oi(Et,R),Oi(Et+mt,R)),vn)for(let ke in b){let Gt=b[ke];ke!=R&&Gt.from==null&&Gt.min!=Ut&&Ts(ke,Oi(ot+We,ke),Oi(ot,ke))}Xl()}else he.lock&&(he._lock=!he._lock,qs(v,!0,m!=null));m!=null&&(dt(jl,zc),Ra(jl,i,kt,qt,_,I,null))}function fg(m,v,w,P,O,$,ie){if(he._lock)return;_n(m);let ce=ys;if(ys){let ge=!0,Re=!0,Pe=10,Fe,je;L.ori==0?(Fe=xn,je=vn):(Fe=vn,je=xn),Fe&&je&&(ge=kt<=Pe||kt>=_-Pe,Re=qt<=Pe||qt>=I-Pe),Fe&&ge&&(kt=kt<wr?0:_),je&&Re&&(qt=qt<Rr?0:I),qs(null,!0,!0),ys=!1}kt=-10,qt=-10,ue.fill(null),qs(null,!0,!0),ce&&(ys=ce)}function Zh(m,v,w,P,O,$,ie){he._lock||(_n(m),G(),Xl(),m!=null&&Ra(uf,i,kt,qt,_,I,null))}function jh(){A.forEach(L0),we(i.width,i.height,!0)}dr(al,na,jh);const Dr={};Dr.mousedown=Kh,Dr.mousemove=Hh,Dr.mouseup=$h,Dr.dblclick=Zh,Dr.setSeries=(m,v,w,P)=>{let O=nn.match[2];w=O(i,v,w),w!=-1&&Fi(w,P,!0,!1)},nt&&(Ke(of,x,Kh),Ke(Zl,x,Hh),Ke(lf,x,m=>{_n(m),wa(!1)}),Ke(cf,x,fg),Ke(uf,x,Zh),qc.add(i),i.syncRect=wa);const Eo=i.hooks=n.hooks||{};function Sn(m,v,w){Bl?Ta.push([m,v,w]):m in Eo&&Eo[m].forEach(P=>{P.call(null,i,v,w)})}(n.plugins||[]).forEach(m=>{for(let v in m.hooks)Eo[v]=(Eo[v]||[]).concat(m.hooks[v])});const Jh=(m,v,w)=>w,nn=an({key:null,setSeries:!1,filters:{pub:Mf,sub:Mf},scales:[R,y[1]?y[1].scale:null],match:[Ef,Ef,Jh],values:[null,null]},he.sync);nn.match.length==2&&nn.match.push(Jh),he.sync=nn;const Qh=nn.key,Yl=jp(Qh);function Ra(m,v,w,P,O,$,ie){nn.filters.pub(m,v,w,P,O,$,ie)&&Yl.pub(m,v,w,P,O,$,ie)}Yl.sub(i);function dg(m,v,w,P,O,$,ie){nn.filters.sub(m,v,w,P,O,$,ie)&&Dr[m](null,v,w,P,O,$,ie)}i.pub=dg;function pg(){Yl.unsub(i),qc.delete(i),Ct.clear(),Gc(al,na,jh),c.remove(),te?.remove(),Sn("destroy")}i.destroy=pg;function ql(){Sn("init",n,e),E(e||n.data,!1),Y[R]?zl(R,Y[R]):G(),Ee=Vt.show&&(Vt.width>0||Vt.height>0),F=le=!0,we(n.width,n.height)}return y.forEach(Mr),A.forEach(vo),t?t instanceof HTMLElement?(t.appendChild(c),ql()):t(i,ql):ql(),i}Qt.assign=an;Qt.fmtNum=ch;Qt.rangeNum=ol;Qt.rangeLog=bl;Qt.rangeAsinh=oh;Qt.orient=vr;Qt.pxRatio=yt;Qt.join=y_;Qt.fmtDate=hh,Qt.tzDate=U_;Qt.sync=jp;{Qt.addGap=g0,Qt.clipGaps=Rl;let n=Qt.paths={points:im};n.linear=rm,n.stepped=v0,n.bars=S0,n.spline=E0}function so(n){const e=Math.abs(n);return e>=1e9?(n/1e9).toFixed(1).replace(/\.0$/,"")+"B":e>=1e6?(n/1e6).toFixed(1).replace(/\.0$/,"")+"M":e>=1e3?(n/1e3).toFixed(1).replace(/\.0$/,"")+"K":e<1&&e>0?n.toFixed(4):n.toFixed(0)}function fo(){return{hooks:{setLegend:n=>{if(n.cursor.idx!=null)return;const e=n.data[0].length-1;e<0||n.setLegend({idx:e},!1)}}}}let zs=null,ks=null,Vs=null,Gs=null,Hs=null,ds=[[],[],[],[],[]],cr=[[],[],[]],ur=[[],[],[],[]],ia=[[],[],[],[]],pr=[[],[],[]];function cm(n){const e=[n[0],[],[],[],n[4]];for(let t=0;t<n[0].length;t++){const i=n[1][t]||0,s=n[2][t]||0,r=n[3][t]||0;e[1][t]=i,e[2][t]=i+s,e[3][t]=i+s+r}return e}function I0(n){const e={width:n.clientWidth||300,height:150,scales:{x:{time:!1},y:{auto:!0},pop:{auto:!0}},legend:{show:!0,live:!0},axes:[{show:!0,size:16,font:"10px sans-serif",gap:4,ticks:{show:!1}},{scale:"y",size:32,font:"10px sans-serif",side:3,gap:2,ticks:{show:!1},values:(t,i)=>i.map(so)},{scale:"pop",size:32,font:"10px sans-serif",side:1,gap:2,ticks:{show:!1},values:(t,i)=>i.map(so)}],series:[{},{label:"Red",stroke:"rgb(200, 0, 0)",fill:"rgba(255, 80, 80, 0.8)",scale:"y",width:1,points:{show:!1}},{label:"Green",stroke:"rgb(0, 180, 0)",scale:"y",width:1,points:{show:!1}},{label:"Blue",stroke:"rgb(0, 0, 200)",scale:"y",width:1,points:{show:!1}},{label:"Pop",stroke:"rgb(50, 50, 50)",scale:"pop",width:2,points:{show:!1}}],bands:[{series:[2,1],fill:"rgba(80, 220, 80, 0.8)"},{series:[3,2],fill:"rgba(80, 80, 255, 0.8)"}]};return zs=new Qt({...e,plugins:[fo()]},ds,n),zs}function U0(n){const e={width:n.clientWidth||300,height:150,scales:{x:{time:!1},desc:{auto:!0},eat:{auto:!0}},legend:{show:!0,live:!0},axes:[{show:!0,size:16,font:"10px sans-serif",gap:4,ticks:{show:!1}},{scale:"desc",size:32,font:"10px sans-serif",gap:2,ticks:{show:!1},side:3,values:(t,i)=>i.map(so)},{scale:"eat",size:32,font:"10px sans-serif",gap:2,ticks:{show:!1},side:1,values:(t,i)=>i}],series:[{},{label:"Avg Children",stroke:"rgb(50, 50, 50)",scale:"desc",width:1,points:{show:!1}},{label:"R Eat Efficiency",stroke:"rgb(0, 196, 0)",scale:"eat",width:1,points:{show:!1}}]};return ks=new Qt({...e,plugins:[fo()]},cr,n),ks}function N0(n){const e={width:n.clientWidth||300,height:150,scales:{x:{time:!1},life:{auto:!0},eff:{auto:!0}},legend:{show:!0,live:!0},axes:[{show:!0,size:16,font:"10px sans-serif",gap:4,ticks:{show:!1}},{scale:"life",size:32,font:"10px sans-serif",gap:2,ticks:{show:!1},side:3,values:(t,i)=>i.map(so)},{scale:"eff",size:32,font:"10px sans-serif",gap:2,ticks:{show:!1},side:1,values:(t,i)=>i.map(s=>s.toFixed(2))}],series:[{},{label:"Avg Living",stroke:"rgb(220, 60, 60)",scale:"life",width:1,points:{show:!1}},{label:"Energy Efficiency",stroke:"rgb(255, 180, 0)",scale:"eff",width:1,points:{show:!1}}]};return Vs=new Qt({...e,plugins:[fo()]},ur,n),Vs}function F0(n){const e={width:n.clientWidth||300,height:150,scales:{x:{time:!1},y:{auto:!0}},legend:{show:!0,live:!0},axes:[{show:!0,size:16,font:"10px sans-serif",gap:4,ticks:{show:!1}},{scale:"y",size:32,font:"10px sans-serif",gap:2,ticks:{show:!1},side:1,values:(t,i)=>i.map(s=>s.toFixed(4))}],series:[{},{label:"Mut Rate",stroke:"rgb(255, 140, 0)",scale:"y",width:1,points:{show:!1}}]};return Gs=new Qt({...e,plugins:[fo()]},ia,n),Gs}function O0(n){const e=Qt.paths.bars({size:[.6,64],align:0,gap:2}),t={width:n.clientWidth||300,height:150,scales:{x:{time:!1},y:{auto:!0}},legend:{show:!0,live:!0},axes:[{show:!0,size:16,font:"10px sans-serif",gap:4,ticks:{show:!1},values:(i,s)=>s.map(r=>String(Math.round(r)))},{scale:"y",size:32,font:"10px sans-serif",side:3,gap:2,ticks:{show:!1},values:(i,s)=>s.map(so)}],series:[{},{label:"Living",stroke:"rgb(0, 180, 0)",fill:"rgba(60, 200, 60, 0.8)",scale:"y",width:0,paths:e,points:{show:!1},value:(i,s,r,a)=>{if(a==null)return"--";const o=pr[1][a]||0,l=pr[2][a]||0;return String(o-l)}},{label:"Deceased",stroke:"rgb(200, 0, 0)",fill:"rgba(220, 60, 60, 0.8)",scale:"y",width:0,paths:e,points:{show:!1}}]};return Hs=new Qt({...t,plugins:[fo()]},pr,n),Hs}function um(){ds=[[],[],[],[],[]],cr=[[],[],[]],ur=[[],[],[],[]],ia=[[],[],[],[]],zs&&zs.setData(cm(ds)),ks&&ks.setData(cr),Vs&&Vs.setData(ur),Gs&&Gs.setData(ia),pr=[[],[],[]],Hs&&Hs.setData(pr)}function $c(){const n=document.getElementById("foodPopChart"),e=document.getElementById("optimizationChart"),t=document.getElementById("lifespanChart"),i=document.getElementById("mutationStratChart");zs&&n&&zs.setSize({width:n.clientWidth,height:150}),ks&&e&&ks.setSize({width:e.clientWidth,height:150}),Vs&&t&&Vs.setSize({width:t.clientWidth,height:150}),Gs&&i&&Gs.setSize({width:i.clientWidth,height:150});const s=document.getElementById("genDemoChart");Hs&&s&&Hs.setSize({width:s.clientWidth,height:150})}function B0(n){ds[0].push(n.timeLabel),ds[1].push(n.redAgar),ds[2].push(n.greenAgar),ds[3].push(n.blueAgar),ds[4].push(n.livePop),zs&&zs.setData(cm(ds)),cr[0].push(n.timeLabel),cr[1].push(n.aveChildren),cr[2].push(n.eatEfficiency),ks&&ks.setData(cr),ur[0].push(n.timeLabel),ur[1].push(n.aveLivingLifespan),ur[2].push(n.avgEnergyEff),Vs&&Vs.setData(ur),ia[0].push(n.timeLabel),ia[1].push(n.mutationRate),Gs&&Gs.setData(ia),pr=[n.gens,n.stackedCounts,n.deadCounts],Hs&&Hs.setData(pr)}function z0(n,e){if(!z.mouse.leftPressed||!z.mouse.overMap||!n)return;const t=_p(n),i=z.mouse.x,s=z.mouse.y,r=ih(n);for(let a=0;a<t;a++){const o=xp(a),l=n[o+rn.SIZE];if(Math.abs(n[o+rn.X]-i)<=l+1&&Math.abs(n[o+rn.Y]-s)<=l+1){const c=n[o+rn.STATUS]===1,h=c?n[o+rn.GRAVE]:n[o+rn.IDX];h!==r&&(e.highlight(h),c&&(z.tracking=!1)),z.mouse.leftPressed=!1;return}}z.tracking&&(z.tracking=!1,z.mouse.leftPressed=!1)}const k0={update(n){const e=z.ctx;if(e){if(z.mouse.overMap)if(z.mouse.rightPressed)n.spawn(z.mouse.x,z.mouse.y),z.mouse.rightPressed=!1;else if(z.mouse.leftPressed){if(!z.canvas.dragging)z.canvas.dragging=!0;else{const t=z.mouse.x-z.mouse.prevX,i=z.mouse.y-z.mouse.prevY;e.translate(t,i),z.canvas.dragOffsetX+=t*z.canvas.scale,z.canvas.dragOffsetY+=i*z.canvas.scale}z.mouse.prevX=z.mouse.x,z.mouse.prevY=z.mouse.y}else z.canvas.dragging&&(z.canvas.dragging=!1,z.mouse.originalX+=z.canvas.dragOffsetX,z.mouse.originalY+=z.canvas.dragOffsetY,z.mouse.x+=z.canvas.dragOffsetX,z.mouse.y+=z.canvas.dragOffsetY,z.canvas.dragOffsetX=0,z.canvas.dragOffsetY=0);for(const t in z.keysPressed)z.keysPressed[t]&&((t==="a"||t==="ArrowLeft")&&(z.leftAccel+=2,z.mouse.x-=z.leftAccel,z.mouse.originalX+=z.leftAccel*z.canvas.scale,e.translate(z.leftAccel,0)),(t==="w"||t==="ArrowUp")&&(z.upAccel+=2,z.mouse.y-=z.upAccel,z.mouse.originalY+=z.upAccel*z.canvas.scale,e.translate(0,z.upAccel)),(t==="s"||t==="ArrowDown")&&(z.downAccel+=2,z.mouse.y+=z.downAccel,z.mouse.originalY-=z.downAccel*z.canvas.scale,e.translate(0,-z.downAccel)),(t==="d"||t==="ArrowRight")&&(z.rightAccel+=2,z.mouse.x+=z.rightAccel,z.mouse.originalX-=z.rightAccel*z.canvas.scale,e.translate(-z.rightAccel,0)))}}};function V0(n,e){const t=e.getBoundingClientRect();let i=n.clientX/t.right*e.width,s=n.clientY/t.bottom*e.height;return i-=z.mouse.originalX,s-=z.mouse.originalY,i/=z.canvas.scale,s/=z.canvas.scale,{x:i,y:s}}function Ua(n,e,t){const i=V0(e,t);z.mouse.x=i.x,z.mouse.y=i.y,n==="down"&&(e.button===0?z.mouse.leftPressed=!0:e.button===2&&(z.mouse.rightPressed=!0)),(n==="up"||n==="out")&&(e.button===0?z.mouse.leftPressed=!1:e.button===2&&(z.mouse.rightPressed=!1))}function G0(n,e){n.preventDefault();const t=z.ctx;if(!t)return;let i=n.wheelDelta||-n.deltaY;i>20?i=20:i<-20&&(i=-20);const s=1+i/400;z.mouse.originalX+=(z.mouse.x-z.mouse.x*s)*z.canvas.scale,z.mouse.originalY+=(z.mouse.y-z.mouse.y*s)*z.canvas.scale,t.translate(z.mouse.x,z.mouse.y),t.scale(s,s),t.translate(-z.mouse.x,-z.mouse.y);const r=e.getBoundingClientRect();let a=(n.clientX-r.left)/(r.right-r.left)*e.width,o=(n.clientY-r.top)/(r.bottom-r.top)*e.height;a-=z.mouse.originalX,o-=z.mouse.originalY,z.canvas.scale*=s,z.mouse.x=a/z.canvas.scale,z.mouse.y=o/z.canvas.scale}const hm=["w","a","s","d","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","Escape"];function H0(n,e){hm.includes(n.key)&&(n.preventDefault(),z.keysPressed[n.key]=!0,n.key===" "&&e(),n.key==="Escape"&&(z.tracking=!1))}function W0(n){hm.includes(n.key)&&(n.preventDefault(),z.keysPressed[n.key]=!1,n.key==="a"||n.key==="ArrowLeft"?z.leftAccel=0:n.key==="w"||n.key==="ArrowUp"?z.upAccel=0:n.key==="s"||n.key==="ArrowDown"?z.downAccel=0:(n.key==="d"||n.key==="ArrowRight")&&(z.rightAccel=0))}const xh={},Wf={},X0=["dash-live-info","dash-newest","dash-time","dash-highlighted","dash-gold","dash-silver","dash-bronze","amoeba-stats","stats-name","stats-idx","stats-sibling-idx","stats-age","stats-energy","stats-size","stats-brain-weight","stats-damage","stats-sensors","stats-red","stats-green","stats-blue","stats-velocity","stats-rotation","stats-mutation"];function Y0(){for(const n of X0)xh[n]=document.getElementById(n)}function bn(n,e){if(Wf[n]===e)return;Wf[n]=e;const t=xh[n];t&&(t.innerHTML=e)}const Zc="█",ja="&nbsp;";function Ir(n,e,t){const i=t>0?"&nbsp;":"",s=Math.max(-1,Math.min(1,t)),r=Math.round(Math.abs(s)*10);let a=ja.repeat(10),o=ja.repeat(10);s<0?a=ja.repeat(10-r)+Zc.repeat(r):o=Zc.repeat(r)+ja.repeat(10-r),bn(n,`${e} ${a} ${i}${t.toFixed(2)} ${o}`)}function q0(n,e,t,i){const s=Math.max(0,Math.min(1,t/i)),r=Math.round(s*20),a=Zc.repeat(r)+ja.repeat(20-r);bn(n,`${e} ${a} ${Ki(t)}/${Ki(i)}`)}const K0={update(n){bn("dash-live-info","LIVE: "+gi(n,Gn.LIVE_POP)+"     DEAD: "+gi(n,Gn.DEAD_COUNT)),bn("dash-time","TIME: "+gi(n,Gn.TIME));const e=Da(n,Ca.NEWEST);e&&bn("dash-newest","NEW: "+e);const t=Da(n,Ca.GOLD),i=Da(n,Ca.SILVER),s=Da(n,Ca.BRONZE);t&&bn("dash-gold",t),i&&bn("dash-silver",i),s&&bn("dash-bronze",s);const r=Da(n,Ca.HIGHLIGHTED);bn("dash-highlighted",r?"HIGHLIGHTED: "+r:"");const a=xh["amoeba-stats"];if(!El(n)){a&&a.style.display!=="none"&&(a.style.display="none");return}a&&a.style.display!=="block"&&(a.style.display="block"),this.updateStatsPanel(n)},updateStatsPanel(n){bn("stats-name",gp(n)),bn("stats-idx","IDX "+Xt(n,tt.IDX));const e=Xt(n,tt.SIBLING_IDX);e>=0&&bn("stats-sibling-idx","SIBLING: "+e),bn("stats-age","BORN/AGE: <b>"+Xt(n,tt.BORN)+"/"+Xt(n,tt.AGE)+"</b>"),bn("stats-size","SIZE: "+Xt(n,tt.SIZE).toFixed(1)),bn("stats-brain-weight","BRAIN: "+Xt(n,tt.BRAIN_WEIGHT).toFixed(1)),bn("stats-damage",Ki(Xt(n,tt.DAMAGE_RECEIVED))+" >> DMG >> "+Ki(Xt(n,tt.DAMAGE_CAUSED)));let t=Xt(n,tt.MOUTH_DETECTED)>=0?"M ":"";for(let i=0;i<5;i++)Xt(n,tt.EYE_DETECTED+i)>=0&&(t+=`E${i+1} `);bn("stats-sensors",t),q0("stats-energy","ϟ&nbsp;",Xt(n,tt.ENERGY),Xt(n,tt.MAX_ENERGY)),Ir("stats-red","R&nbsp;",Xt(n,tt.OUT+3)),Ir("stats-green","G&nbsp;",Xt(n,tt.OUT+4)),Ir("stats-blue","B&nbsp;",Xt(n,tt.OUT+5)),Ir("stats-velocity","∆X",Xt(n,tt.OUT)),Ir("stats-rotation","∆Y",Xt(n,tt.OUT+1)),Ir("stats-mutation","∆°",Xt(n,tt.OUT+2))}};let Xf=performance.now(),nc=0,Yf=0,jc=null;function $0(n){jc=n}function Z0(n=0){nc++;const e=performance.now(),t=e-Xf;t>=500&&(Yf=nc/t*1e3,nc=0,Xf=e,jc&&(jc.textContent=`${Yf|0} FPS | ${n|0} TPS`))}let yn=null,Pi=null;const rr=[];let qf=null,Kf,Na=null,Jc=null,cl=null;function j0(n){Pi=n,yn=document.getElementById("family-tree")}function J0(n){return Ml(n.name,n.gen,n.alive,n.descendants)}function fm(){return Na||(Na=document.createElement("div"),Na.className="family-tooltip",document.body.appendChild(Na)),Na}function Fa(n,e){const t=document.createElement("div");return t.className="family-member",n.alive||(t.className+=" family-member-dead"),n.idx===z.highlighted&&(t.className+=" family-member-self"),t.innerHTML=`<span class="family-label">${e}</span><span class="family-name">${J0(n)}</span>`,t.addEventListener("mouseenter",()=>{z.highlighted!==null&&n.idx!==z.highlighted&&Pi&&(Jc=n.idx,cl=t,Pi.requestAlikeness(z.highlighted,n.idx))}),t.addEventListener("mouseleave",()=>{Jc=null,cl=null,fm().style.display="none"}),t.addEventListener("click",()=>{Pi&&(z.highlighted!==null&&z.highlighted!==n.idx&&rr.push(z.highlighted),Pi.highlight(n.idx))}),t}function Q0(n,e,t){if(Jc!==e||z.highlighted!==n||!cl)return;const i=fm();i.textContent=`${t.toFixed(1)}% alike`,i.style.display="block";const s=cl.getBoundingClientRect();i.style.left=`${s.right+8}px`,i.style.top=`${s.top}px`}function ic(n){const e=document.createElement("div");e.className="family-section";const t=document.createElement("div");return t.className="family-section-header",t.textContent=n,e.appendChild(t),e}function dm(n,e,t=void 0){if(yn||(yn=document.getElementById("family-tree")),!(!yn||!Pi||!n&&!(e!==qf)&&!(t!==Kf))){if(qf=e,Kf=t,e===null){yn.innerHTML='<div class="family-empty">No amoeba selected</div>';return}Pi.requestFamily(e)}}function ex(n,e){n===z.highlighted&&tx(e)}function tx(n){if(!yn)return;if(!n){yn.innerHTML='<div class="family-empty">Amoeba not found</div>';return}yn.innerHTML="";const e=document.createElement("div");e.className="family-nav";const t=document.createElement("button");t.className="family-back-btn",t.innerHTML="&larr; Back",t.disabled=rr.length===0,t.addEventListener("click",()=>{rr.length>0&&Pi&&Pi.highlight(rr.pop())}),e.appendChild(t);const i=document.createElement("span");if(i.className="family-history-count",i.textContent=rr.length>0?`(${rr.length})`:"",e.appendChild(i),yn.appendChild(e),n.parent){const s=ic("Parent");if(s.appendChild(Fa(n.parent,"")),yn.appendChild(s),n.siblings.length>0){const r=ic(`Siblings (${n.siblings.length})`);for(const a of n.siblings){const o=document.createElement("div");if(o.className="family-sibling-row",o.appendChild(Fa(a,"")),a.children&&a.children.length>0){const l=document.createElement("div");l.className="family-niblings";for(const c of a.children)l.appendChild(Fa(c,""));o.appendChild(l)}r.appendChild(o)}yn.appendChild(r)}}if(n.children.length>0){const s=ic(`Children (${n.children.length})`);for(const r of n.children){const a=document.createElement("div");if(a.className="family-child-row",a.appendChild(Fa(r,"")),r.children&&r.children.length>0){const o=document.createElement("div");o.className="family-grandchildren";for(const l of r.children)o.appendChild(Fa(l,""));a.appendChild(o)}s.appendChild(a)}yn.appendChild(s)}}function nx(){if(z.highlighted===null||!Pi)return;const n=document.getElementById("brain3d-container"),e=document.getElementById("brain3d-weights");yn||(yn=document.getElementById("family-tree")),z.display==="family"?(z.display="default",yn&&(yn.style.display="none"),rr.length=0):(z.display="family",n&&(n.style.display="none"),e&&(e.style.display="none"),yn&&(yn.style.display="block"),dm(!0,z.highlighted)),Pi.setDisplay(z.display)}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const vh="182",sa={ROTATE:0,DOLLY:1,PAN:2},ta={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},ix=0,$f=1,sx=2,Qo=1,rx=2,Ja=3,Ws=0,Hn=1,Wi=2,_s=0,ra=1,Zf=2,jf=3,Jf=4,ax=5,ar=100,ox=101,lx=102,cx=103,ux=104,hx=200,fx=201,dx=202,px=203,Qc=204,eu=205,mx=206,gx=207,_x=208,xx=209,vx=210,Sx=211,Mx=212,Ex=213,yx=214,tu=0,nu=1,iu=2,ha=3,su=4,ru=5,au=6,ou=7,pm=0,Tx=1,bx=2,$i=0,mm=1,gm=2,_m=3,xm=4,vm=5,Sm=6,Mm=7,Em=300,_r=301,fa=302,lu=303,cu=304,Ll=306,uu=1e3,ps=1001,hu=1002,An=1003,Ax=1004,wo=1005,on=1006,sc=1007,hr=1008,pi=1009,ym=1010,Tm=1011,ro=1012,Sh=1013,Ji=1014,Yi=1015,vs=1016,Mh=1017,Eh=1018,ao=1020,bm=35902,Am=35899,wm=1021,Rm=1022,Di=1023,Ss=1026,fr=1027,Cm=1028,yh=1029,da=1030,Th=1031,bh=1033,el=33776,tl=33777,nl=33778,il=33779,fu=35840,du=35841,pu=35842,mu=35843,gu=36196,_u=37492,xu=37496,vu=37488,Su=37489,Mu=37490,Eu=37491,yu=37808,Tu=37809,bu=37810,Au=37811,wu=37812,Ru=37813,Cu=37814,Pu=37815,Du=37816,Lu=37817,Iu=37818,Uu=37819,Nu=37820,Fu=37821,Ou=36492,Bu=36494,zu=36495,ku=36283,Vu=36284,Gu=36285,Hu=36286,wx=3200,Rx=0,Cx=1,Ns="",hi="srgb",pa="srgb-linear",ul="linear",At="srgb",Ur=7680,Qf=519,Px=512,Dx=513,Lx=514,Ah=515,Ix=516,Ux=517,wh=518,Nx=519,Wu=35044,ed="300 es",qi=2e3,hl=2001;function Pm(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function fl(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Fx(){const n=fl("canvas");return n.style.display="block",n}const td={};function dl(...n){const e="THREE."+n.shift();console.log(e,...n)}function Je(...n){const e="THREE."+n.shift();console.warn(e,...n)}function ft(...n){const e="THREE."+n.shift();console.error(e,...n)}function oo(...n){const e=n.join(" ");e in td||(td[e]=!0,Je(...n))}function Ox(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}class Sr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Pn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],sl=Math.PI/180,Xu=180/Math.PI;function Os(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Pn[n&255]+Pn[n>>8&255]+Pn[n>>16&255]+Pn[n>>24&255]+"-"+Pn[e&255]+Pn[e>>8&255]+"-"+Pn[e>>16&15|64]+Pn[e>>24&255]+"-"+Pn[t&63|128]+Pn[t>>8&255]+"-"+Pn[t>>16&255]+Pn[t>>24&255]+Pn[i&255]+Pn[i>>8&255]+Pn[i>>16&255]+Pn[i>>24&255]).toLowerCase()}function lt(n,e,t){return Math.max(e,Math.min(t,n))}function Bx(n,e){return(n%e+e)%e}function rc(n,e,t){return(1-t)*n+t*e}function Xi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Lt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const zx={DEG2RAD:sl};class Xe{constructor(e=0,t=0){Xe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=lt(this.x,e.x,t.x),this.y=lt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=lt(this.x,e,t),this.y=lt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(lt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(lt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class xr{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],f=r[a+0],g=r[a+1],x=r[a+2],M=r[a+3];if(o<=0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o>=1){e[t+0]=f,e[t+1]=g,e[t+2]=x,e[t+3]=M;return}if(u!==M||l!==f||c!==g||h!==x){let p=l*f+c*g+h*x+u*M;p<0&&(f=-f,g=-g,x=-x,M=-M,p=-p);let d=1-o;if(p<.9995){const y=Math.acos(p),A=Math.sin(y);d=Math.sin(d*y)/A,o=Math.sin(o*y)/A,l=l*d+f*o,c=c*d+g*o,h=h*d+x*o,u=u*d+M*o}else{l=l*d+f*o,c=c*d+g*o,h=h*d+x*o,u=u*d+M*o;const y=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=y,c*=y,h*=y,u*=y}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[a],f=r[a+1],g=r[a+2],x=r[a+3];return e[t]=o*x+h*u+l*g-c*f,e[t+1]=l*x+h*f+c*u-o*g,e[t+2]=c*x+h*g+o*f-l*u,e[t+3]=h*x-o*u-l*f-c*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),u=o(r/2),f=l(i/2),g=l(s/2),x=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*g*x,this._y=c*g*u-f*h*x,this._z=c*h*x+f*g*u,this._w=c*h*u-f*g*x;break;case"YXZ":this._x=f*h*u+c*g*x,this._y=c*g*u-f*h*x,this._z=c*h*x-f*g*u,this._w=c*h*u+f*g*x;break;case"ZXY":this._x=f*h*u-c*g*x,this._y=c*g*u+f*h*x,this._z=c*h*x+f*g*u,this._w=c*h*u-f*g*x;break;case"ZYX":this._x=f*h*u-c*g*x,this._y=c*g*u+f*h*x,this._z=c*h*x-f*g*u,this._w=c*h*u+f*g*x;break;case"YZX":this._x=f*h*u+c*g*x,this._y=c*g*u+f*h*x,this._z=c*h*x-f*g*u,this._w=c*h*u-f*g*x;break;case"XZY":this._x=f*h*u-c*g*x,this._y=c*g*u-f*h*x,this._z=c*h*x+f*g*u,this._w=c*h*u+f*g*x;break;default:Je("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=i+o+u;if(f>0){const g=.5/Math.sqrt(f+1);this._w=.25/g,this._x=(h-l)*g,this._y=(r-c)*g,this._z=(a-s)*g}else if(i>o&&i>u){const g=2*Math.sqrt(1+i-o-u);this._w=(h-l)/g,this._x=.25*g,this._y=(s+a)/g,this._z=(r+c)/g}else if(o>u){const g=2*Math.sqrt(1+o-i-u);this._w=(r-c)/g,this._x=(s+a)/g,this._y=.25*g,this._z=(l+h)/g}else{const g=2*Math.sqrt(1+u-i-o);this._w=(a-s)/g,this._x=(r+c)/g,this._y=(l+h)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(lt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class W{constructor(e=0,t=0,i=0){W.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(nd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(nd.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),h=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+l*c+a*u-o*h,this.y=i+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=lt(this.x,e.x,t.x),this.y=lt(this.y,e.y,t.y),this.z=lt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=lt(this.x,e,t),this.y=lt(this.y,e,t),this.z=lt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(lt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ac.copy(this).projectOnVector(e),this.sub(ac)}reflect(e){return this.sub(ac.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(lt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ac=new W,nd=new xr;class st{constructor(e,t,i,s,r,a,o,l,c){st.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],f=i[2],g=i[5],x=i[8],M=s[0],p=s[3],d=s[6],y=s[1],A=s[4],b=s[7],D=s[2],R=s[5],U=s[8];return r[0]=a*M+o*y+l*D,r[3]=a*p+o*A+l*R,r[6]=a*d+o*b+l*U,r[1]=c*M+h*y+u*D,r[4]=c*p+h*A+u*R,r[7]=c*d+h*b+u*U,r[2]=f*M+g*y+x*D,r[5]=f*p+g*A+x*R,r[8]=f*d+g*b+x*U,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*r*h+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,f=o*l-h*r,g=c*r-a*l,x=t*u+i*f+s*g;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/x;return e[0]=u*M,e[1]=(s*c-h*i)*M,e[2]=(o*i-s*a)*M,e[3]=f*M,e[4]=(h*t-s*l)*M,e[5]=(s*r-o*t)*M,e[6]=g*M,e[7]=(i*l-c*t)*M,e[8]=(a*t-i*r)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(oc.makeScale(e,t)),this}rotate(e){return this.premultiply(oc.makeRotation(-e)),this}translate(e,t){return this.premultiply(oc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const oc=new st,id=new st().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),sd=new st().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function kx(){const n={enabled:!0,workingColorSpace:pa,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===At&&(s.r=xs(s.r),s.g=xs(s.g),s.b=xs(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===At&&(s.r=aa(s.r),s.g=aa(s.g),s.b=aa(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ns?ul:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return oo("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return oo("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[pa]:{primaries:e,whitePoint:i,transfer:ul,toXYZ:id,fromXYZ:sd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:hi},outputColorSpaceConfig:{drawingBufferColorSpace:hi}},[hi]:{primaries:e,whitePoint:i,transfer:At,toXYZ:id,fromXYZ:sd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:hi}}}),n}const pt=kx();function xs(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function aa(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Nr;class Vx{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Nr===void 0&&(Nr=fl("canvas")),Nr.width=e.width,Nr.height=e.height;const s=Nr.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Nr}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=fl("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=xs(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(xs(t[i]/255)*255):t[i]=xs(t[i]);return{data:t,width:e.width,height:e.height}}else return Je("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Gx=0;class Rh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Gx++}),this.uuid=Os(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(lc(s[a].image)):r.push(lc(s[a]))}else r=lc(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function lc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Vx.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Je("Texture: Unable to serialize Texture."),{})}let Hx=0;const cc=new W;class Ln extends Sr{constructor(e=Ln.DEFAULT_IMAGE,t=Ln.DEFAULT_MAPPING,i=ps,s=ps,r=on,a=hr,o=Di,l=pi,c=Ln.DEFAULT_ANISOTROPY,h=Ns){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Hx++}),this.uuid=Os(),this.name="",this.source=new Rh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Xe(0,0),this.repeat=new Xe(1,1),this.center=new Xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new st,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(cc).x}get height(){return this.source.getSize(cc).y}get depth(){return this.source.getSize(cc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Je(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Je(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Em)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case uu:e.x=e.x-Math.floor(e.x);break;case ps:e.x=e.x<0?0:1;break;case hu:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case uu:e.y=e.y-Math.floor(e.y);break;case ps:e.y=e.y<0?0:1;break;case hu:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ln.DEFAULT_IMAGE=null;Ln.DEFAULT_MAPPING=Em;Ln.DEFAULT_ANISOTROPY=1;class Jt{constructor(e=0,t=0,i=0,s=1){Jt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],g=l[5],x=l[9],M=l[2],p=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-M)<.01&&Math.abs(x-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+M)<.1&&Math.abs(x+p)<.1&&Math.abs(c+g+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const A=(c+1)/2,b=(g+1)/2,D=(d+1)/2,R=(h+f)/4,U=(u+M)/4,k=(x+p)/4;return A>b&&A>D?A<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(A),s=R/i,r=U/i):b>D?b<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),i=R/s,r=k/s):D<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),i=U/r,s=k/r),this.set(i,s,r,t),this}let y=Math.sqrt((p-x)*(p-x)+(u-M)*(u-M)+(f-h)*(f-h));return Math.abs(y)<.001&&(y=1),this.x=(p-x)/y,this.y=(u-M)/y,this.z=(f-h)/y,this.w=Math.acos((c+g+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=lt(this.x,e.x,t.x),this.y=lt(this.y,e.y,t.y),this.z=lt(this.z,e.z,t.z),this.w=lt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=lt(this.x,e,t),this.y=lt(this.y,e,t),this.z=lt(this.z,e,t),this.w=lt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(lt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Wx extends Sr{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:on,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Jt(0,0,e,t),this.scissorTest=!1,this.viewport=new Jt(0,0,e,t);const s={width:e,height:t,depth:i.depth},r=new Ln(s);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:on,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Rh(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Zi extends Wx{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Dm extends Ln{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=An,this.minFilter=An,this.wrapR=ps,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Xx extends Ln{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=An,this.minFilter=An,this.wrapR=ps,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class po{constructor(e=new W(1/0,1/0,1/0),t=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Ei.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Ei.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Ei.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Ei):Ei.fromBufferAttribute(r,a),Ei.applyMatrix4(e.matrixWorld),this.expandByPoint(Ei);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ro.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ro.copy(i.boundingBox)),Ro.applyMatrix4(e.matrixWorld),this.union(Ro)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ei),Ei.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Oa),Co.subVectors(this.max,Oa),Fr.subVectors(e.a,Oa),Or.subVectors(e.b,Oa),Br.subVectors(e.c,Oa),ws.subVectors(Or,Fr),Rs.subVectors(Br,Or),$s.subVectors(Fr,Br);let t=[0,-ws.z,ws.y,0,-Rs.z,Rs.y,0,-$s.z,$s.y,ws.z,0,-ws.x,Rs.z,0,-Rs.x,$s.z,0,-$s.x,-ws.y,ws.x,0,-Rs.y,Rs.x,0,-$s.y,$s.x,0];return!uc(t,Fr,Or,Br,Co)||(t=[1,0,0,0,1,0,0,0,1],!uc(t,Fr,Or,Br,Co))?!1:(Po.crossVectors(ws,Rs),t=[Po.x,Po.y,Po.z],uc(t,Fr,Or,Br,Co))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ei).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ei).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(as[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),as[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),as[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),as[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),as[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),as[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),as[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),as[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(as),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const as=[new W,new W,new W,new W,new W,new W,new W,new W],Ei=new W,Ro=new po,Fr=new W,Or=new W,Br=new W,ws=new W,Rs=new W,$s=new W,Oa=new W,Co=new W,Po=new W,Zs=new W;function uc(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Zs.fromArray(n,r);const o=s.x*Math.abs(Zs.x)+s.y*Math.abs(Zs.y)+s.z*Math.abs(Zs.z),l=e.dot(Zs),c=t.dot(Zs),h=i.dot(Zs);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Yx=new po,Ba=new W,hc=new W;class Ch{constructor(e=new W,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Yx.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ba.subVectors(e,this.center);const t=Ba.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Ba,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(hc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ba.copy(e.center).add(hc)),this.expandByPoint(Ba.copy(e.center).sub(hc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const os=new W,fc=new W,Do=new W,Cs=new W,dc=new W,Lo=new W,pc=new W;class Ph{constructor(e=new W,t=new W(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,os)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=os.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(os.copy(this.origin).addScaledVector(this.direction,t),os.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){fc.copy(e).add(t).multiplyScalar(.5),Do.copy(t).sub(e).normalize(),Cs.copy(this.origin).sub(fc);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Do),o=Cs.dot(this.direction),l=-Cs.dot(Do),c=Cs.lengthSq(),h=Math.abs(1-a*a);let u,f,g,x;if(h>0)if(u=a*l-o,f=a*o-l,x=r*h,u>=0)if(f>=-x)if(f<=x){const M=1/h;u*=M,f*=M,g=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),g=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),g=-u*u+f*(f+2*l)+c;else f<=-x?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),g=-u*u+f*(f+2*l)+c):f<=x?(u=0,f=Math.min(Math.max(-r,-l),r),g=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),g=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),g=-u*u+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(fc).addScaledVector(Do,f),g}intersectSphere(e,t){os.subVectors(e.center,this.origin);const i=os.dot(this.direction),s=os.dot(os)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,os)!==null}intersectTriangle(e,t,i,s,r){dc.subVectors(t,e),Lo.subVectors(i,e),pc.crossVectors(dc,Lo);let a=this.direction.dot(pc),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Cs.subVectors(this.origin,e);const l=o*this.direction.dot(Lo.crossVectors(Cs,Lo));if(l<0)return null;const c=o*this.direction.dot(dc.cross(Cs));if(c<0||l+c>a)return null;const h=-o*Cs.dot(pc);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Zt{constructor(e,t,i,s,r,a,o,l,c,h,u,f,g,x,M,p){Zt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,h,u,f,g,x,M,p)}set(e,t,i,s,r,a,o,l,c,h,u,f,g,x,M,p){const d=this.elements;return d[0]=e,d[4]=t,d[8]=i,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=g,d[7]=x,d[11]=M,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Zt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,s=1/zr.setFromMatrixColumn(e,0).length(),r=1/zr.setFromMatrixColumn(e,1).length(),a=1/zr.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=a*h,g=a*u,x=o*h,M=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=g+x*c,t[5]=f-M*c,t[9]=-o*l,t[2]=M-f*c,t[6]=x+g*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*h,g=l*u,x=c*h,M=c*u;t[0]=f+M*o,t[4]=x*o-g,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=g*o-x,t[6]=M+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*h,g=l*u,x=c*h,M=c*u;t[0]=f-M*o,t[4]=-a*u,t[8]=x+g*o,t[1]=g+x*o,t[5]=a*h,t[9]=M-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*h,g=a*u,x=o*h,M=o*u;t[0]=l*h,t[4]=x*c-g,t[8]=f*c+M,t[1]=l*u,t[5]=M*c+f,t[9]=g*c-x,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,g=a*c,x=o*l,M=o*c;t[0]=l*h,t[4]=M-f*u,t[8]=x*u+g,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=g*u+x,t[10]=f-M*u}else if(e.order==="XZY"){const f=a*l,g=a*c,x=o*l,M=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+M,t[5]=a*h,t[9]=g*u-x,t[2]=x*u-g,t[6]=o*h,t[10]=M*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(qx,e,Kx)}lookAt(e,t,i){const s=this.elements;return Zn.subVectors(e,t),Zn.lengthSq()===0&&(Zn.z=1),Zn.normalize(),Ps.crossVectors(i,Zn),Ps.lengthSq()===0&&(Math.abs(i.z)===1?Zn.x+=1e-4:Zn.z+=1e-4,Zn.normalize(),Ps.crossVectors(i,Zn)),Ps.normalize(),Io.crossVectors(Zn,Ps),s[0]=Ps.x,s[4]=Io.x,s[8]=Zn.x,s[1]=Ps.y,s[5]=Io.y,s[9]=Zn.y,s[2]=Ps.z,s[6]=Io.z,s[10]=Zn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],f=i[9],g=i[13],x=i[2],M=i[6],p=i[10],d=i[14],y=i[3],A=i[7],b=i[11],D=i[15],R=s[0],U=s[4],k=s[8],S=s[12],T=s[1],L=s[5],H=s[9],B=s[13],X=s[2],Y=s[6],K=s[10],V=s[14],se=s[3],de=s[7],ae=s[11],ue=s[15];return r[0]=a*R+o*T+l*X+c*se,r[4]=a*U+o*L+l*Y+c*de,r[8]=a*k+o*H+l*K+c*ae,r[12]=a*S+o*B+l*V+c*ue,r[1]=h*R+u*T+f*X+g*se,r[5]=h*U+u*L+f*Y+g*de,r[9]=h*k+u*H+f*K+g*ae,r[13]=h*S+u*B+f*V+g*ue,r[2]=x*R+M*T+p*X+d*se,r[6]=x*U+M*L+p*Y+d*de,r[10]=x*k+M*H+p*K+d*ae,r[14]=x*S+M*B+p*V+d*ue,r[3]=y*R+A*T+b*X+D*se,r[7]=y*U+A*L+b*Y+D*de,r[11]=y*k+A*H+b*K+D*ae,r[15]=y*S+A*B+b*V+D*ue,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],g=e[14],x=e[3],M=e[7],p=e[11],d=e[15],y=l*g-c*f,A=o*g-c*u,b=o*f-l*u,D=a*g-c*h,R=a*f-l*h,U=a*u-o*h;return t*(M*y-p*A+d*b)-i*(x*y-p*D+d*R)+s*(x*A-M*D+d*U)-r*(x*b-M*R+p*U)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],g=e[11],x=e[12],M=e[13],p=e[14],d=e[15],y=u*p*c-M*f*c+M*l*g-o*p*g-u*l*d+o*f*d,A=x*f*c-h*p*c-x*l*g+a*p*g+h*l*d-a*f*d,b=h*M*c-x*u*c+x*o*g-a*M*g-h*o*d+a*u*d,D=x*u*l-h*M*l-x*o*f+a*M*f+h*o*p-a*u*p,R=t*y+i*A+s*b+r*D;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const U=1/R;return e[0]=y*U,e[1]=(M*f*r-u*p*r-M*s*g+i*p*g+u*s*d-i*f*d)*U,e[2]=(o*p*r-M*l*r+M*s*c-i*p*c-o*s*d+i*l*d)*U,e[3]=(u*l*r-o*f*r-u*s*c+i*f*c+o*s*g-i*l*g)*U,e[4]=A*U,e[5]=(h*p*r-x*f*r+x*s*g-t*p*g-h*s*d+t*f*d)*U,e[6]=(x*l*r-a*p*r-x*s*c+t*p*c+a*s*d-t*l*d)*U,e[7]=(a*f*r-h*l*r+h*s*c-t*f*c-a*s*g+t*l*g)*U,e[8]=b*U,e[9]=(x*u*r-h*M*r-x*i*g+t*M*g+h*i*d-t*u*d)*U,e[10]=(a*M*r-x*o*r+x*i*c-t*M*c-a*i*d+t*o*d)*U,e[11]=(h*o*r-a*u*r-h*i*c+t*u*c+a*i*g-t*o*g)*U,e[12]=D*U,e[13]=(h*M*s-x*u*s+x*i*f-t*M*f-h*i*p+t*u*p)*U,e[14]=(x*o*s-a*M*s-x*i*l+t*M*l+a*i*p-t*o*p)*U,e[15]=(a*u*s-h*o*s+h*i*l-t*u*l-a*i*f+t*o*f)*U,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,f=r*c,g=r*h,x=r*u,M=a*h,p=a*u,d=o*u,y=l*c,A=l*h,b=l*u,D=i.x,R=i.y,U=i.z;return s[0]=(1-(M+d))*D,s[1]=(g+b)*D,s[2]=(x-A)*D,s[3]=0,s[4]=(g-b)*R,s[5]=(1-(f+d))*R,s[6]=(p+y)*R,s[7]=0,s[8]=(x+A)*U,s[9]=(p-y)*U,s[10]=(1-(f+M))*U,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;if(e.x=s[12],e.y=s[13],e.z=s[14],this.determinant()===0)return i.set(1,1,1),t.identity(),this;let r=zr.set(s[0],s[1],s[2]).length();const a=zr.set(s[4],s[5],s[6]).length(),o=zr.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),yi.copy(this);const c=1/r,h=1/a,u=1/o;return yi.elements[0]*=c,yi.elements[1]*=c,yi.elements[2]*=c,yi.elements[4]*=h,yi.elements[5]*=h,yi.elements[6]*=h,yi.elements[8]*=u,yi.elements[9]*=u,yi.elements[10]*=u,t.setFromRotationMatrix(yi),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=qi,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(i-s),f=(t+e)/(t-e),g=(i+s)/(i-s);let x,M;if(l)x=r/(a-r),M=a*r/(a-r);else if(o===qi)x=-(a+r)/(a-r),M=-2*a*r/(a-r);else if(o===hl)x=-a/(a-r),M=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=g,c[13]=0,c[2]=0,c[6]=0,c[10]=x,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=qi,l=!1){const c=this.elements,h=2/(t-e),u=2/(i-s),f=-(t+e)/(t-e),g=-(i+s)/(i-s);let x,M;if(l)x=1/(a-r),M=a/(a-r);else if(o===qi)x=-2/(a-r),M=-(a+r)/(a-r);else if(o===hl)x=-1/(a-r),M=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=g,c[2]=0,c[6]=0,c[10]=x,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const zr=new W,yi=new Zt,qx=new W(0,0,0),Kx=new W(1,1,1),Ps=new W,Io=new W,Zn=new W,rd=new Zt,ad=new xr;class Ms{constructor(e=0,t=0,i=0,s=Ms.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],g=s[10];switch(t){case"XYZ":this._y=Math.asin(lt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,g),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-lt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,g),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(lt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,g),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-lt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,g),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(lt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,g));break;case"XZY":this._z=Math.asin(-lt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,g),this._y=0);break;default:Je("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return rd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(rd,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ad.setFromEuler(this),this.setFromQuaternion(ad,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ms.DEFAULT_ORDER="XYZ";class Dh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let $x=0;const od=new W,kr=new xr,ls=new Zt,Uo=new W,za=new W,Zx=new W,jx=new xr,ld=new W(1,0,0),cd=new W(0,1,0),ud=new W(0,0,1),hd={type:"added"},Jx={type:"removed"},Vr={type:"childadded",child:null},mc={type:"childremoved",child:null};class Wn extends Sr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$x++}),this.uuid=Os(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Wn.DEFAULT_UP.clone();const e=new W,t=new Ms,i=new xr,s=new W(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Zt},normalMatrix:{value:new st}}),this.matrix=new Zt,this.matrixWorld=new Zt,this.matrixAutoUpdate=Wn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Wn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Dh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return kr.setFromAxisAngle(e,t),this.quaternion.multiply(kr),this}rotateOnWorldAxis(e,t){return kr.setFromAxisAngle(e,t),this.quaternion.premultiply(kr),this}rotateX(e){return this.rotateOnAxis(ld,e)}rotateY(e){return this.rotateOnAxis(cd,e)}rotateZ(e){return this.rotateOnAxis(ud,e)}translateOnAxis(e,t){return od.copy(e).applyQuaternion(this.quaternion),this.position.add(od.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ld,e)}translateY(e){return this.translateOnAxis(cd,e)}translateZ(e){return this.translateOnAxis(ud,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ls.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Uo.copy(e):Uo.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),za.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ls.lookAt(za,Uo,this.up):ls.lookAt(Uo,za,this.up),this.quaternion.setFromRotationMatrix(ls),s&&(ls.extractRotation(s.matrixWorld),kr.setFromRotationMatrix(ls),this.quaternion.premultiply(kr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ft("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(hd),Vr.child=e,this.dispatchEvent(Vr),Vr.child=null):ft("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Jx),mc.child=e,this.dispatchEvent(mc),mc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ls.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ls.multiply(e.parent.matrixWorld)),e.applyMatrix4(ls),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(hd),Vr.child=e,this.dispatchEvent(Vr),Vr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(za,e,Zx),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(za,jx,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),f=a(e.skeletons),g=a(e.animations),x=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),g.length>0&&(i.animations=g),x.length>0&&(i.nodes=x)}return i.object=s,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Wn.DEFAULT_UP=new W(0,1,0);Wn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Wn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ti=new W,cs=new W,gc=new W,us=new W,Gr=new W,Hr=new W,fd=new W,_c=new W,xc=new W,vc=new W,Sc=new Jt,Mc=new Jt,Ec=new Jt;class mi{constructor(e=new W,t=new W,i=new W){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Ti.subVectors(e,t),s.cross(Ti);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Ti.subVectors(s,t),cs.subVectors(i,t),gc.subVectors(e,t);const a=Ti.dot(Ti),o=Ti.dot(cs),l=Ti.dot(gc),c=cs.dot(cs),h=cs.dot(gc),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,g=(c*l-o*h)*f,x=(a*h-o*l)*f;return r.set(1-g-x,x,g)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,us)===null?!1:us.x>=0&&us.y>=0&&us.x+us.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,us)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,us.x),l.addScaledVector(a,us.y),l.addScaledVector(o,us.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return Sc.setScalar(0),Mc.setScalar(0),Ec.setScalar(0),Sc.fromBufferAttribute(e,t),Mc.fromBufferAttribute(e,i),Ec.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Sc,r.x),a.addScaledVector(Mc,r.y),a.addScaledVector(Ec,r.z),a}static isFrontFacing(e,t,i,s){return Ti.subVectors(i,t),cs.subVectors(e,t),Ti.cross(cs).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ti.subVectors(this.c,this.b),cs.subVectors(this.a,this.b),Ti.cross(cs).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return mi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return mi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return mi.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return mi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return mi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;Gr.subVectors(s,i),Hr.subVectors(r,i),_c.subVectors(e,i);const l=Gr.dot(_c),c=Hr.dot(_c);if(l<=0&&c<=0)return t.copy(i);xc.subVectors(e,s);const h=Gr.dot(xc),u=Hr.dot(xc);if(h>=0&&u<=h)return t.copy(s);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(Gr,a);vc.subVectors(e,r);const g=Gr.dot(vc),x=Hr.dot(vc);if(x>=0&&g<=x)return t.copy(r);const M=g*c-l*x;if(M<=0&&c>=0&&x<=0)return o=c/(c-x),t.copy(i).addScaledVector(Hr,o);const p=h*x-g*u;if(p<=0&&u-h>=0&&g-x>=0)return fd.subVectors(r,s),o=(u-h)/(u-h+(g-x)),t.copy(s).addScaledVector(fd,o);const d=1/(p+M+f);return a=M*d,o=f*d,t.copy(i).addScaledVector(Gr,a).addScaledVector(Hr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Lm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ds={h:0,s:0,l:0},No={h:0,s:0,l:0};function yc(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class wt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=hi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,pt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=pt.workingColorSpace){return this.r=e,this.g=t,this.b=i,pt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=pt.workingColorSpace){if(e=Bx(e,1),t=lt(t,0,1),i=lt(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=yc(a,r,e+1/3),this.g=yc(a,r,e),this.b=yc(a,r,e-1/3)}return pt.colorSpaceToWorking(this,s),this}setStyle(e,t=hi){function i(r){r!==void 0&&parseFloat(r)<1&&Je("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Je("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Je("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=hi){const i=Lm[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Je("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=xs(e.r),this.g=xs(e.g),this.b=xs(e.b),this}copyLinearToSRGB(e){return this.r=aa(e.r),this.g=aa(e.g),this.b=aa(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=hi){return pt.workingToColorSpace(Dn.copy(this),e),Math.round(lt(Dn.r*255,0,255))*65536+Math.round(lt(Dn.g*255,0,255))*256+Math.round(lt(Dn.b*255,0,255))}getHexString(e=hi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=pt.workingColorSpace){pt.workingToColorSpace(Dn.copy(this),t);const i=Dn.r,s=Dn.g,r=Dn.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=pt.workingColorSpace){return pt.workingToColorSpace(Dn.copy(this),t),e.r=Dn.r,e.g=Dn.g,e.b=Dn.b,e}getStyle(e=hi){pt.workingToColorSpace(Dn.copy(this),e);const t=Dn.r,i=Dn.g,s=Dn.b;return e!==hi?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Ds),this.setHSL(Ds.h+e,Ds.s+t,Ds.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Ds),e.getHSL(No);const i=rc(Ds.h,No.h,t),s=rc(Ds.s,No.s,t),r=rc(Ds.l,No.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Dn=new wt;wt.NAMES=Lm;let Qx=0;class mo extends Sr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qx++}),this.uuid=Os(),this.name="",this.type="Material",this.blending=ra,this.side=Ws,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Qc,this.blendDst=eu,this.blendEquation=ar,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new wt(0,0,0),this.blendAlpha=0,this.depthFunc=ha,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Qf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ur,this.stencilZFail=Ur,this.stencilZPass=Ur,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Je(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Je(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ra&&(i.blending=this.blending),this.side!==Ws&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Qc&&(i.blendSrc=this.blendSrc),this.blendDst!==eu&&(i.blendDst=this.blendDst),this.blendEquation!==ar&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ha&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Qf&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ur&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ur&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ur&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class ma extends mo{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ms,this.combine=pm,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const sn=new W,Fo=new Xe;let ev=0;class Xn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ev++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Wu,this.updateRanges=[],this.gpuType=Yi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Fo.fromBufferAttribute(this,t),Fo.applyMatrix3(e),this.setXY(t,Fo.x,Fo.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix3(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix4(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.applyNormalMatrix(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.transformDirection(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Xi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Lt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Xi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Xi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Xi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Xi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),i=Lt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),i=Lt(i,this.array),s=Lt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),i=Lt(i,this.array),s=Lt(s,this.array),r=Lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Wu&&(e.usage=this.usage),e}}class Im extends Xn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Um extends Xn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class _i extends Xn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let tv=0;const li=new Zt,Tc=new Wn,Wr=new W,jn=new po,ka=new po,En=new W;class xi extends Sr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tv++}),this.uuid=Os(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Pm(e)?Um:Im)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new st().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return li.makeRotationFromQuaternion(e),this.applyMatrix4(li),this}rotateX(e){return li.makeRotationX(e),this.applyMatrix4(li),this}rotateY(e){return li.makeRotationY(e),this.applyMatrix4(li),this}rotateZ(e){return li.makeRotationZ(e),this.applyMatrix4(li),this}translate(e,t,i){return li.makeTranslation(e,t,i),this.applyMatrix4(li),this}scale(e,t,i){return li.makeScale(e,t,i),this.applyMatrix4(li),this}lookAt(e){return Tc.lookAt(e),Tc.updateMatrix(),this.applyMatrix4(Tc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Wr).negate(),this.translate(Wr.x,Wr.y,Wr.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new _i(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Je("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new po);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ft("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];jn.setFromBufferAttribute(r),this.morphTargetsRelative?(En.addVectors(this.boundingBox.min,jn.min),this.boundingBox.expandByPoint(En),En.addVectors(this.boundingBox.max,jn.max),this.boundingBox.expandByPoint(En)):(this.boundingBox.expandByPoint(jn.min),this.boundingBox.expandByPoint(jn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ft('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ch);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ft("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new W,1/0);return}if(e){const i=this.boundingSphere.center;if(jn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ka.setFromBufferAttribute(o),this.morphTargetsRelative?(En.addVectors(jn.min,ka.min),jn.expandByPoint(En),En.addVectors(jn.max,ka.max),jn.expandByPoint(En)):(jn.expandByPoint(ka.min),jn.expandByPoint(ka.max))}jn.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)En.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(En));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)En.fromBufferAttribute(o,c),l&&(Wr.fromBufferAttribute(e,c),En.add(Wr)),s=Math.max(s,i.distanceToSquared(En))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&ft('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ft("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Xn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let k=0;k<i.count;k++)o[k]=new W,l[k]=new W;const c=new W,h=new W,u=new W,f=new Xe,g=new Xe,x=new Xe,M=new W,p=new W;function d(k,S,T){c.fromBufferAttribute(i,k),h.fromBufferAttribute(i,S),u.fromBufferAttribute(i,T),f.fromBufferAttribute(r,k),g.fromBufferAttribute(r,S),x.fromBufferAttribute(r,T),h.sub(c),u.sub(c),g.sub(f),x.sub(f);const L=1/(g.x*x.y-x.x*g.y);isFinite(L)&&(M.copy(h).multiplyScalar(x.y).addScaledVector(u,-g.y).multiplyScalar(L),p.copy(u).multiplyScalar(g.x).addScaledVector(h,-x.x).multiplyScalar(L),o[k].add(M),o[S].add(M),o[T].add(M),l[k].add(p),l[S].add(p),l[T].add(p))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let k=0,S=y.length;k<S;++k){const T=y[k],L=T.start,H=T.count;for(let B=L,X=L+H;B<X;B+=3)d(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const A=new W,b=new W,D=new W,R=new W;function U(k){D.fromBufferAttribute(s,k),R.copy(D);const S=o[k];A.copy(S),A.sub(D.multiplyScalar(D.dot(S))).normalize(),b.crossVectors(R,S);const L=b.dot(l[k])<0?-1:1;a.setXYZW(k,A.x,A.y,A.z,L)}for(let k=0,S=y.length;k<S;++k){const T=y[k],L=T.start,H=T.count;for(let B=L,X=L+H;B<X;B+=3)U(e.getX(B+0)),U(e.getX(B+1)),U(e.getX(B+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Xn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,g=i.count;f<g;f++)i.setXYZ(f,0,0,0);const s=new W,r=new W,a=new W,o=new W,l=new W,c=new W,h=new W,u=new W;if(e)for(let f=0,g=e.count;f<g;f+=3){const x=e.getX(f+0),M=e.getX(f+1),p=e.getX(f+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,M),a.fromBufferAttribute(t,p),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,x),l.fromBufferAttribute(i,M),c.fromBufferAttribute(i,p),o.add(h),l.add(h),c.add(h),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(M,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,g=t.count;f<g;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)En.fromBufferAttribute(e,t),En.normalize(),e.setXYZ(t,En.x,En.y,En.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let g=0,x=0;for(let M=0,p=l.length;M<p;M++){o.isInterleavedBufferAttribute?g=l[M]*o.data.stride+o.offset:g=l[M]*h;for(let d=0;d<h;d++)f[x++]=c[g++]}return new Xn(f,h,u)}if(this.index===null)return Je("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new xi,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],g=e(f,i);l.push(g)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const g=c[u];h.push(g.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,g=u.length;f<g;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const dd=new Zt,js=new Ph,Oo=new Ch,pd=new W,Bo=new W,zo=new W,ko=new W,bc=new W,Vo=new W,md=new W,Go=new W;class ni extends Wn{constructor(e=new xi,t=new ma){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Vo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(bc.fromBufferAttribute(u,e),a?Vo.addScaledVector(bc,h):Vo.addScaledVector(bc.sub(t),h))}t.add(Vo)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Oo.copy(i.boundingSphere),Oo.applyMatrix4(r),js.copy(e.ray).recast(e.near),!(Oo.containsPoint(js.origin)===!1&&(js.intersectSphere(Oo,pd)===null||js.origin.distanceToSquared(pd)>(e.far-e.near)**2))&&(dd.copy(r).invert(),js.copy(e.ray).applyMatrix4(dd),!(i.boundingBox!==null&&js.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,js)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,g=r.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,M=f.length;x<M;x++){const p=f[x],d=a[p.materialIndex],y=Math.max(p.start,g.start),A=Math.min(o.count,Math.min(p.start+p.count,g.start+g.count));for(let b=y,D=A;b<D;b+=3){const R=o.getX(b),U=o.getX(b+1),k=o.getX(b+2);s=Ho(this,d,e,i,c,h,u,R,U,k),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const x=Math.max(0,g.start),M=Math.min(o.count,g.start+g.count);for(let p=x,d=M;p<d;p+=3){const y=o.getX(p),A=o.getX(p+1),b=o.getX(p+2);s=Ho(this,a,e,i,c,h,u,y,A,b),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let x=0,M=f.length;x<M;x++){const p=f[x],d=a[p.materialIndex],y=Math.max(p.start,g.start),A=Math.min(l.count,Math.min(p.start+p.count,g.start+g.count));for(let b=y,D=A;b<D;b+=3){const R=b,U=b+1,k=b+2;s=Ho(this,d,e,i,c,h,u,R,U,k),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const x=Math.max(0,g.start),M=Math.min(l.count,g.start+g.count);for(let p=x,d=M;p<d;p+=3){const y=p,A=p+1,b=p+2;s=Ho(this,a,e,i,c,h,u,y,A,b),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function nv(n,e,t,i,s,r,a,o){let l;if(e.side===Hn?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===Ws,o),l===null)return null;Go.copy(o),Go.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Go);return c<t.near||c>t.far?null:{distance:c,point:Go.clone(),object:n}}function Ho(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,Bo),n.getVertexPosition(l,zo),n.getVertexPosition(c,ko);const h=nv(n,e,t,i,Bo,zo,ko,md);if(h){const u=new W;mi.getBarycoord(md,Bo,zo,ko,u),s&&(h.uv=mi.getInterpolatedAttribute(s,o,l,c,u,new Xe)),r&&(h.uv1=mi.getInterpolatedAttribute(r,o,l,c,u,new Xe)),a&&(h.normal=mi.getInterpolatedAttribute(a,o,l,c,u,new W),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new W,materialIndex:0};mi.getNormal(Bo,zo,ko,f.normal),h.face=f,h.barycoord=u}return h}class go extends xi{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,g=0;x("z","y","x",-1,-1,i,t,e,a,r,0),x("z","y","x",1,-1,i,t,-e,a,r,1),x("x","z","y",1,1,e,i,t,s,a,2),x("x","z","y",1,-1,e,i,-t,s,a,3),x("x","y","z",1,-1,e,t,i,s,r,4),x("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new _i(c,3)),this.setAttribute("normal",new _i(h,3)),this.setAttribute("uv",new _i(u,2));function x(M,p,d,y,A,b,D,R,U,k,S){const T=b/U,L=D/k,H=b/2,B=D/2,X=R/2,Y=U+1,K=k+1;let V=0,se=0;const de=new W;for(let ae=0;ae<K;ae++){const ue=ae*L-B;for(let Me=0;Me<Y;Me++){const he=Me*T-H;de[M]=he*y,de[p]=ue*A,de[d]=X,c.push(de.x,de.y,de.z),de[M]=0,de[p]=0,de[d]=R>0?1:-1,h.push(de.x,de.y,de.z),u.push(Me/U),u.push(1-ae/k),V+=1}}for(let ae=0;ae<k;ae++)for(let ue=0;ue<U;ue++){const Me=f+ue+Y*ae,he=f+ue+Y*(ae+1),Qe=f+(ue+1)+Y*(ae+1),nt=f+(ue+1)+Y*ae;l.push(Me,he,nt),l.push(he,Qe,nt),se+=6}o.addGroup(g,se,S),g+=se,f+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new go(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ga(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Je("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function On(n){const e={};for(let t=0;t<n.length;t++){const i=ga(n[t]);for(const s in i)e[s]=i[s]}return e}function iv(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Nm(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:pt.workingColorSpace}const sv={clone:ga,merge:On};var rv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,av=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Qi extends mo{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=rv,this.fragmentShader=av,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ga(e.uniforms),this.uniformsGroups=iv(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Fm extends Wn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Zt,this.projectionMatrix=new Zt,this.projectionMatrixInverse=new Zt,this.coordinateSystem=qi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ls=new W,gd=new Xe,_d=new Xe;class fi extends Fm{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Xu*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(sl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Xu*2*Math.atan(Math.tan(sl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Ls.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ls.x,Ls.y).multiplyScalar(-e/Ls.z),Ls.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ls.x,Ls.y).multiplyScalar(-e/Ls.z)}getViewSize(e,t){return this.getViewBounds(e,gd,_d),t.subVectors(_d,gd)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(sl*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Xr=-90,Yr=1;class ov extends Wn{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new fi(Xr,Yr,e,t);s.layers=this.layers,this.add(s);const r=new fi(Xr,Yr,e,t);r.layers=this.layers,this.add(r);const a=new fi(Xr,Yr,e,t);a.layers=this.layers,this.add(a);const o=new fi(Xr,Yr,e,t);o.layers=this.layers,this.add(o);const l=new fi(Xr,Yr,e,t);l.layers=this.layers,this.add(l);const c=new fi(Xr,Yr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===qi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===hl)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const M=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=M,e.setRenderTarget(i,5,s),e.render(t,h),e.setRenderTarget(u,f,g),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class Om extends Ln{constructor(e=[],t=_r,i,s,r,a,o,l,c,h){super(e,t,i,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Bm extends Zi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Om(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new go(5,5,5),r=new Qi({name:"CubemapFromEquirect",uniforms:ga(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Hn,blending:_s});r.uniforms.tEquirect.value=t;const a=new ni(s,r),o=t.minFilter;return t.minFilter===hr&&(t.minFilter=on),new ov(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}class Qa extends Wn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const lv={type:"move"};class Ac{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Qa,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Qa,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Qa,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const M of e.hand.values()){const p=t.getJointPose(M,i),d=this._getHandJoint(c,M);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),g=.02,x=.005;c.inputState.pinching&&f>g+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=g-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(lv)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Qa;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class cv extends Wn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ms,this.environmentIntensity=1,this.environmentRotation=new Ms,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class uv{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Wu,this.updateRanges=[],this.version=0,this.uuid=Os()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Os()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Os()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Fn=new W;class pl{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Fn.fromBufferAttribute(this,t),Fn.applyMatrix4(e),this.setXYZ(t,Fn.x,Fn.y,Fn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Fn.fromBufferAttribute(this,t),Fn.applyNormalMatrix(e),this.setXYZ(t,Fn.x,Fn.y,Fn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Fn.fromBufferAttribute(this,t),Fn.transformDirection(e),this.setXYZ(t,Fn.x,Fn.y,Fn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Xi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Lt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Lt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Xi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Xi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Xi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Xi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Lt(t,this.array),i=Lt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Lt(t,this.array),i=Lt(i,this.array),s=Lt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Lt(t,this.array),i=Lt(i,this.array),s=Lt(s,this.array),r=Lt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){dl("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Xn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new pl(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){dl("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class lo extends mo{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new wt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let qr;const Va=new W,Kr=new W,$r=new W,Zr=new Xe,Ga=new Xe,zm=new Zt,Wo=new W,Ha=new W,Xo=new W,xd=new Xe,wc=new Xe,vd=new Xe;class ml extends Wn{constructor(e=new lo){if(super(),this.isSprite=!0,this.type="Sprite",qr===void 0){qr=new xi;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new uv(t,5);qr.setIndex([0,1,2,0,2,3]),qr.setAttribute("position",new pl(i,3,0,!1)),qr.setAttribute("uv",new pl(i,2,3,!1))}this.geometry=qr,this.material=e,this.center=new Xe(.5,.5),this.count=1}raycast(e,t){e.camera===null&&ft('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Kr.setFromMatrixScale(this.matrixWorld),zm.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),$r.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Kr.multiplyScalar(-$r.z);const i=this.material.rotation;let s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));const a=this.center;Yo(Wo.set(-.5,-.5,0),$r,a,Kr,s,r),Yo(Ha.set(.5,-.5,0),$r,a,Kr,s,r),Yo(Xo.set(.5,.5,0),$r,a,Kr,s,r),xd.set(0,0),wc.set(1,0),vd.set(1,1);let o=e.ray.intersectTriangle(Wo,Ha,Xo,!1,Va);if(o===null&&(Yo(Ha.set(-.5,.5,0),$r,a,Kr,s,r),wc.set(0,1),o=e.ray.intersectTriangle(Wo,Xo,Ha,!1,Va),o===null))return;const l=e.ray.origin.distanceTo(Va);l<e.near||l>e.far||t.push({distance:l,point:Va.clone(),uv:mi.getInterpolation(Va,Wo,Ha,Xo,xd,wc,vd,new Xe),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Yo(n,e,t,i,s,r){Zr.subVectors(n,t).addScalar(.5).multiply(i),s!==void 0?(Ga.x=r*Zr.x-s*Zr.y,Ga.y=s*Zr.x+r*Zr.y):Ga.copy(Zr),n.copy(e),n.x+=Ga.x,n.y+=Ga.y,n.applyMatrix4(zm)}class hv extends Ln{constructor(e=null,t=1,i=1,s,r,a,o,l,c=An,h=An,u,f){super(null,a,o,l,c,h,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Rc=new W,fv=new W,dv=new st;class Us{constructor(e=new W(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Rc.subVectors(i,t).cross(fv.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Rc),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||dv.getNormalMatrix(e),s=this.coplanarPoint(Rc).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Js=new Ch,pv=new Xe(.5,.5),qo=new W;class km{constructor(e=new Us,t=new Us,i=new Us,s=new Us,r=new Us,a=new Us){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=qi,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],g=r[7],x=r[8],M=r[9],p=r[10],d=r[11],y=r[12],A=r[13],b=r[14],D=r[15];if(s[0].setComponents(c-a,g-h,d-x,D-y).normalize(),s[1].setComponents(c+a,g+h,d+x,D+y).normalize(),s[2].setComponents(c+o,g+u,d+M,D+A).normalize(),s[3].setComponents(c-o,g-u,d-M,D-A).normalize(),i)s[4].setComponents(l,f,p,b).normalize(),s[5].setComponents(c-l,g-f,d-p,D-b).normalize();else if(s[4].setComponents(c-l,g-f,d-p,D-b).normalize(),t===qi)s[5].setComponents(c+l,g+f,d+p,D+b).normalize();else if(t===hl)s[5].setComponents(l,f,p,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Js.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Js.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Js)}intersectsSprite(e){Js.center.set(0,0,0);const t=pv.distanceTo(e.center);return Js.radius=.7071067811865476+t,Js.applyMatrix4(e.matrixWorld),this.intersectsSphere(Js)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(qo.x=s.normal.x>0?e.max.x:e.min.x,qo.y=s.normal.y>0?e.max.y:e.min.y,qo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(qo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Vm extends Ln{constructor(e,t,i,s,r,a,o,l,c){super(e,t,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class co extends Ln{constructor(e,t,i=Ji,s,r,a,o=An,l=An,c,h=Ss,u=1){if(h!==Ss&&h!==fr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:u};super(f,s,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Rh(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class mv extends co{constructor(e,t=Ji,i=_r,s,r,a=An,o=An,l,c=Ss){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,i,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Gm extends Ln{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Il extends xi{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,u=e/o,f=t/l,g=[],x=[],M=[],p=[];for(let d=0;d<h;d++){const y=d*f-a;for(let A=0;A<c;A++){const b=A*u-r;x.push(b,-y,0),M.push(0,0,1),p.push(A/o),p.push(1-d/l)}}for(let d=0;d<l;d++)for(let y=0;y<o;y++){const A=y+c*d,b=y+c*(d+1),D=y+1+c*(d+1),R=y+1+c*d;g.push(A,b,R),g.push(b,D,R)}this.setIndex(g),this.setAttribute("position",new _i(x,3)),this.setAttribute("normal",new _i(M,3)),this.setAttribute("uv",new _i(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Il(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ul extends xi{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new W,f=new W,g=[],x=[],M=[],p=[];for(let d=0;d<=i;d++){const y=[],A=d/i;let b=0;d===0&&a===0?b=.5/t:d===i&&l===Math.PI&&(b=-.5/t);for(let D=0;D<=t;D++){const R=D/t;u.x=-e*Math.cos(s+R*r)*Math.sin(a+A*o),u.y=e*Math.cos(a+A*o),u.z=e*Math.sin(s+R*r)*Math.sin(a+A*o),x.push(u.x,u.y,u.z),f.copy(u).normalize(),M.push(f.x,f.y,f.z),p.push(R+b,1-A),y.push(c++)}h.push(y)}for(let d=0;d<i;d++)for(let y=0;y<t;y++){const A=h[d][y+1],b=h[d][y],D=h[d+1][y],R=h[d+1][y+1];(d!==0||a>0)&&g.push(A,b,R),(d!==i-1||l<Math.PI)&&g.push(b,D,R)}this.setIndex(g),this.setAttribute("position",new _i(x,3)),this.setAttribute("normal",new _i(M,3)),this.setAttribute("uv",new _i(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ul(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class gv extends Qi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class _v extends mo{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=wx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class xv extends mo{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Hm extends Fm{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class vv extends fi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Sd=new Zt;class Sv{constructor(e,t,i=0,s=1/0){this.ray=new Ph(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Dh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):ft("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Sd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Sd),this}intersectObject(e,t=!0,i=[]){return Yu(e,this,i,t),i.sort(Md),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)Yu(e[s],this,i,t);return i.sort(Md),i}}function Md(n,e){return n.distance-e.distance}function Yu(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let a=0,o=r.length;a<o;a++)Yu(r[a],e,t,!0)}}class Ed{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=lt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(lt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Mv extends Sr{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Je("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function yd(n,e,t,i){const s=Ev(i);switch(t){case wm:return n*e;case Cm:return n*e/s.components*s.byteLength;case yh:return n*e/s.components*s.byteLength;case da:return n*e*2/s.components*s.byteLength;case Th:return n*e*2/s.components*s.byteLength;case Rm:return n*e*3/s.components*s.byteLength;case Di:return n*e*4/s.components*s.byteLength;case bh:return n*e*4/s.components*s.byteLength;case el:case tl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case nl:case il:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case du:case mu:return Math.max(n,16)*Math.max(e,8)/4;case fu:case pu:return Math.max(n,8)*Math.max(e,8)/2;case gu:case _u:case vu:case Su:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case xu:case Mu:case Eu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case yu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Tu:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case bu:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Au:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case wu:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Ru:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Cu:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Pu:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Du:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Lu:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Iu:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Uu:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Nu:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Fu:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Ou:case Bu:case zu:return Math.ceil(n/4)*Math.ceil(e/4)*16;case ku:case Vu:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Gu:case Hu:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Ev(n){switch(n){case pi:case ym:return{byteLength:1,components:1};case ro:case Tm:case vs:return{byteLength:2,components:1};case Mh:case Eh:return{byteLength:2,components:4};case Ji:case Sh:case Yi:return{byteLength:4,components:1};case bm:case Am:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:vh}}));typeof window<"u"&&(window.__THREE__?Je("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=vh);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Wm(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function yv(n){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,h),o.onUploadCallback();let g;if(c instanceof Float32Array)g=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)g=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?g=n.HALF_FLOAT:g=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)g=n.SHORT;else if(c instanceof Uint32Array)g=n.UNSIGNED_INT;else if(c instanceof Int32Array)g=n.INT;else if(c instanceof Int8Array)g=n.BYTE;else if(c instanceof Uint8Array)g=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)g=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:g,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const h=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,h);else{u.sort((g,x)=>g.start-x.start);let f=0;for(let g=1;g<u.length;g++){const x=u[f],M=u[g];M.start<=x.start+x.count+1?x.count=Math.max(x.count,M.start+M.count-x.start):(++f,u[f]=M)}u.length=f+1;for(let g=0,x=u.length;g<x;g++){const M=u[g];n.bufferSubData(c,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Tv=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,bv=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Av=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,wv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Rv=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Cv=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Pv=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Dv=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Lv=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Iv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Uv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Nv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Fv=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ov=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Bv=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,zv=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,kv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Vv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Gv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Hv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Wv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Xv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Yv=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,qv=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Kv=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,$v=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Zv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,jv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Qv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,eS="gl_FragColor = linearToOutputTexel( gl_FragColor );",tS=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,nS=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,iS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,sS=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,rS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,aS=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,oS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,lS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,cS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,uS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,hS=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,fS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,dS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,pS=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,mS=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,gS=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,_S=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,xS=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,vS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,SS=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,MS=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ES=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( vec3( 1.0 ) - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,yS=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,TS=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,bS=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,AS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,wS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,RS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,CS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,PS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,DS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,LS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,IS=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,US=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,NS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,FS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,OS=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,BS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zS=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,kS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,VS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,GS=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,HS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,WS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,XS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,YS=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,qS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,KS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,$S=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ZS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,jS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,JS=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,QS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,eM=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,tM=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,nM=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,iM=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,sM=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,rM=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 0, 5, phi ).x + bitangent * vogelDiskSample( 0, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 1, 5, phi ).x + bitangent * vogelDiskSample( 1, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 2, 5, phi ).x + bitangent * vogelDiskSample( 2, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 3, 5, phi ).x + bitangent * vogelDiskSample( 3, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 4, 5, phi ).x + bitangent * vogelDiskSample( 4, 5, phi ).y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadow = step( depth, dp );
			#else
				shadow = step( dp, depth );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,aM=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,oM=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,lM=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,cM=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,uM=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,hM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,fM=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,dM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,pM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,mM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,gM=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,_M=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,xM=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,vM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,SM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,MM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,EM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const yM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,TM=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,AM=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,RM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,CM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,PM=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,DM=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,LM=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,IM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,UM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,NM=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,FM=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,OM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,BM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zM=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,VM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,GM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,HM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,WM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,XM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,YM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,KM=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$M=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ZM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jM=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,JM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,QM=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,eE=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,tE=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,nE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,rt={alphahash_fragment:Tv,alphahash_pars_fragment:bv,alphamap_fragment:Av,alphamap_pars_fragment:wv,alphatest_fragment:Rv,alphatest_pars_fragment:Cv,aomap_fragment:Pv,aomap_pars_fragment:Dv,batching_pars_vertex:Lv,batching_vertex:Iv,begin_vertex:Uv,beginnormal_vertex:Nv,bsdfs:Fv,iridescence_fragment:Ov,bumpmap_pars_fragment:Bv,clipping_planes_fragment:zv,clipping_planes_pars_fragment:kv,clipping_planes_pars_vertex:Vv,clipping_planes_vertex:Gv,color_fragment:Hv,color_pars_fragment:Wv,color_pars_vertex:Xv,color_vertex:Yv,common:qv,cube_uv_reflection_fragment:Kv,defaultnormal_vertex:$v,displacementmap_pars_vertex:Zv,displacementmap_vertex:jv,emissivemap_fragment:Jv,emissivemap_pars_fragment:Qv,colorspace_fragment:eS,colorspace_pars_fragment:tS,envmap_fragment:nS,envmap_common_pars_fragment:iS,envmap_pars_fragment:sS,envmap_pars_vertex:rS,envmap_physical_pars_fragment:gS,envmap_vertex:aS,fog_vertex:oS,fog_pars_vertex:lS,fog_fragment:cS,fog_pars_fragment:uS,gradientmap_pars_fragment:hS,lightmap_pars_fragment:fS,lights_lambert_fragment:dS,lights_lambert_pars_fragment:pS,lights_pars_begin:mS,lights_toon_fragment:_S,lights_toon_pars_fragment:xS,lights_phong_fragment:vS,lights_phong_pars_fragment:SS,lights_physical_fragment:MS,lights_physical_pars_fragment:ES,lights_fragment_begin:yS,lights_fragment_maps:TS,lights_fragment_end:bS,logdepthbuf_fragment:AS,logdepthbuf_pars_fragment:wS,logdepthbuf_pars_vertex:RS,logdepthbuf_vertex:CS,map_fragment:PS,map_pars_fragment:DS,map_particle_fragment:LS,map_particle_pars_fragment:IS,metalnessmap_fragment:US,metalnessmap_pars_fragment:NS,morphinstance_vertex:FS,morphcolor_vertex:OS,morphnormal_vertex:BS,morphtarget_pars_vertex:zS,morphtarget_vertex:kS,normal_fragment_begin:VS,normal_fragment_maps:GS,normal_pars_fragment:HS,normal_pars_vertex:WS,normal_vertex:XS,normalmap_pars_fragment:YS,clearcoat_normal_fragment_begin:qS,clearcoat_normal_fragment_maps:KS,clearcoat_pars_fragment:$S,iridescence_pars_fragment:ZS,opaque_fragment:jS,packing:JS,premultiplied_alpha_fragment:QS,project_vertex:eM,dithering_fragment:tM,dithering_pars_fragment:nM,roughnessmap_fragment:iM,roughnessmap_pars_fragment:sM,shadowmap_pars_fragment:rM,shadowmap_pars_vertex:aM,shadowmap_vertex:oM,shadowmask_pars_fragment:lM,skinbase_vertex:cM,skinning_pars_vertex:uM,skinning_vertex:hM,skinnormal_vertex:fM,specularmap_fragment:dM,specularmap_pars_fragment:pM,tonemapping_fragment:mM,tonemapping_pars_fragment:gM,transmission_fragment:_M,transmission_pars_fragment:xM,uv_pars_fragment:vM,uv_pars_vertex:SM,uv_vertex:MM,worldpos_vertex:EM,background_vert:yM,background_frag:TM,backgroundCube_vert:bM,backgroundCube_frag:AM,cube_vert:wM,cube_frag:RM,depth_vert:CM,depth_frag:PM,distance_vert:DM,distance_frag:LM,equirect_vert:IM,equirect_frag:UM,linedashed_vert:NM,linedashed_frag:FM,meshbasic_vert:OM,meshbasic_frag:BM,meshlambert_vert:zM,meshlambert_frag:kM,meshmatcap_vert:VM,meshmatcap_frag:GM,meshnormal_vert:HM,meshnormal_frag:WM,meshphong_vert:XM,meshphong_frag:YM,meshphysical_vert:qM,meshphysical_frag:KM,meshtoon_vert:$M,meshtoon_frag:ZM,points_vert:jM,points_frag:JM,shadow_vert:QM,shadow_frag:eE,sprite_vert:tE,sprite_frag:nE},be={common:{diffuse:{value:new wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new st},alphaMap:{value:null},alphaMapTransform:{value:new st},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new st}},envmap:{envMap:{value:null},envMapRotation:{value:new st},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new st}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new st}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new st},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new st},normalScale:{value:new Xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new st},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new st}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new st}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new st}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new st},alphaTest:{value:0},uvTransform:{value:new st}},sprite:{diffuse:{value:new wt(16777215)},opacity:{value:1},center:{value:new Xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new st},alphaMap:{value:null},alphaMapTransform:{value:new st},alphaTest:{value:0}}},Gi={basic:{uniforms:On([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.fog]),vertexShader:rt.meshbasic_vert,fragmentShader:rt.meshbasic_frag},lambert:{uniforms:On([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new wt(0)}}]),vertexShader:rt.meshlambert_vert,fragmentShader:rt.meshlambert_frag},phong:{uniforms:On([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new wt(0)},specular:{value:new wt(1118481)},shininess:{value:30}}]),vertexShader:rt.meshphong_vert,fragmentShader:rt.meshphong_frag},standard:{uniforms:On([be.common,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.roughnessmap,be.metalnessmap,be.fog,be.lights,{emissive:{value:new wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag},toon:{uniforms:On([be.common,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.gradientmap,be.fog,be.lights,{emissive:{value:new wt(0)}}]),vertexShader:rt.meshtoon_vert,fragmentShader:rt.meshtoon_frag},matcap:{uniforms:On([be.common,be.bumpmap,be.normalmap,be.displacementmap,be.fog,{matcap:{value:null}}]),vertexShader:rt.meshmatcap_vert,fragmentShader:rt.meshmatcap_frag},points:{uniforms:On([be.points,be.fog]),vertexShader:rt.points_vert,fragmentShader:rt.points_frag},dashed:{uniforms:On([be.common,be.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:rt.linedashed_vert,fragmentShader:rt.linedashed_frag},depth:{uniforms:On([be.common,be.displacementmap]),vertexShader:rt.depth_vert,fragmentShader:rt.depth_frag},normal:{uniforms:On([be.common,be.bumpmap,be.normalmap,be.displacementmap,{opacity:{value:1}}]),vertexShader:rt.meshnormal_vert,fragmentShader:rt.meshnormal_frag},sprite:{uniforms:On([be.sprite,be.fog]),vertexShader:rt.sprite_vert,fragmentShader:rt.sprite_frag},background:{uniforms:{uvTransform:{value:new st},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:rt.background_vert,fragmentShader:rt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new st}},vertexShader:rt.backgroundCube_vert,fragmentShader:rt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:rt.cube_vert,fragmentShader:rt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:rt.equirect_vert,fragmentShader:rt.equirect_frag},distance:{uniforms:On([be.common,be.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:rt.distance_vert,fragmentShader:rt.distance_frag},shadow:{uniforms:On([be.lights,be.fog,{color:{value:new wt(0)},opacity:{value:1}}]),vertexShader:rt.shadow_vert,fragmentShader:rt.shadow_frag}};Gi.physical={uniforms:On([Gi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new st},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new st},clearcoatNormalScale:{value:new Xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new st},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new st},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new st},sheen:{value:0},sheenColor:{value:new wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new st},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new st},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new st},transmissionSamplerSize:{value:new Xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new st},attenuationDistance:{value:0},attenuationColor:{value:new wt(0)},specularColor:{value:new wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new st},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new st},anisotropyVector:{value:new Xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new st}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag};const Ko={r:0,b:0,g:0},Qs=new Ms,iE=new Zt;function sE(n,e,t,i,s,r,a){const o=new wt(0);let l=r===!0?0:1,c,h,u=null,f=0,g=null;function x(A){let b=A.isScene===!0?A.background:null;return b&&b.isTexture&&(b=(A.backgroundBlurriness>0?t:e).get(b)),b}function M(A){let b=!1;const D=x(A);D===null?d(o,l):D&&D.isColor&&(d(D,1),b=!0);const R=n.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||b)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function p(A,b){const D=x(b);D&&(D.isCubeTexture||D.mapping===Ll)?(h===void 0&&(h=new ni(new go(1,1,1),new Qi({name:"BackgroundCubeMaterial",uniforms:ga(Gi.backgroundCube.uniforms),vertexShader:Gi.backgroundCube.vertexShader,fragmentShader:Gi.backgroundCube.fragmentShader,side:Hn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,U,k){this.matrixWorld.copyPosition(k.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Qs.copy(b.backgroundRotation),Qs.x*=-1,Qs.y*=-1,Qs.z*=-1,D.isCubeTexture&&D.isRenderTargetTexture===!1&&(Qs.y*=-1,Qs.z*=-1),h.material.uniforms.envMap.value=D,h.material.uniforms.flipEnvMap.value=D.isCubeTexture&&D.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(iE.makeRotationFromEuler(Qs)),h.material.toneMapped=pt.getTransfer(D.colorSpace)!==At,(u!==D||f!==D.version||g!==n.toneMapping)&&(h.material.needsUpdate=!0,u=D,f=D.version,g=n.toneMapping),h.layers.enableAll(),A.unshift(h,h.geometry,h.material,0,0,null)):D&&D.isTexture&&(c===void 0&&(c=new ni(new Il(2,2),new Qi({name:"BackgroundMaterial",uniforms:ga(Gi.background.uniforms),vertexShader:Gi.background.vertexShader,fragmentShader:Gi.background.fragmentShader,side:Ws,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=D,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=pt.getTransfer(D.colorSpace)!==At,D.matrixAutoUpdate===!0&&D.updateMatrix(),c.material.uniforms.uvTransform.value.copy(D.matrix),(u!==D||f!==D.version||g!==n.toneMapping)&&(c.material.needsUpdate=!0,u=D,f=D.version,g=n.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null))}function d(A,b){A.getRGB(Ko,Nm(n)),i.buffers.color.setClear(Ko.r,Ko.g,Ko.b,b,a)}function y(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(A,b=1){o.set(A),l=b,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(A){l=A,d(o,l)},render:M,addToRenderList:p,dispose:y}}function rE(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null);let r=s,a=!1;function o(T,L,H,B,X){let Y=!1;const K=u(B,H,L);r!==K&&(r=K,c(r.object)),Y=g(T,B,H,X),Y&&x(T,B,H,X),X!==null&&e.update(X,n.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,b(T,L,H,B),X!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function l(){return n.createVertexArray()}function c(T){return n.bindVertexArray(T)}function h(T){return n.deleteVertexArray(T)}function u(T,L,H){const B=H.wireframe===!0;let X=i[T.id];X===void 0&&(X={},i[T.id]=X);let Y=X[L.id];Y===void 0&&(Y={},X[L.id]=Y);let K=Y[B];return K===void 0&&(K=f(l()),Y[B]=K),K}function f(T){const L=[],H=[],B=[];for(let X=0;X<t;X++)L[X]=0,H[X]=0,B[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:H,attributeDivisors:B,object:T,attributes:{},index:null}}function g(T,L,H,B){const X=r.attributes,Y=L.attributes;let K=0;const V=H.getAttributes();for(const se in V)if(V[se].location>=0){const ae=X[se];let ue=Y[se];if(ue===void 0&&(se==="instanceMatrix"&&T.instanceMatrix&&(ue=T.instanceMatrix),se==="instanceColor"&&T.instanceColor&&(ue=T.instanceColor)),ae===void 0||ae.attribute!==ue||ue&&ae.data!==ue.data)return!0;K++}return r.attributesNum!==K||r.index!==B}function x(T,L,H,B){const X={},Y=L.attributes;let K=0;const V=H.getAttributes();for(const se in V)if(V[se].location>=0){let ae=Y[se];ae===void 0&&(se==="instanceMatrix"&&T.instanceMatrix&&(ae=T.instanceMatrix),se==="instanceColor"&&T.instanceColor&&(ae=T.instanceColor));const ue={};ue.attribute=ae,ae&&ae.data&&(ue.data=ae.data),X[se]=ue,K++}r.attributes=X,r.attributesNum=K,r.index=B}function M(){const T=r.newAttributes;for(let L=0,H=T.length;L<H;L++)T[L]=0}function p(T){d(T,0)}function d(T,L){const H=r.newAttributes,B=r.enabledAttributes,X=r.attributeDivisors;H[T]=1,B[T]===0&&(n.enableVertexAttribArray(T),B[T]=1),X[T]!==L&&(n.vertexAttribDivisor(T,L),X[T]=L)}function y(){const T=r.newAttributes,L=r.enabledAttributes;for(let H=0,B=L.length;H<B;H++)L[H]!==T[H]&&(n.disableVertexAttribArray(H),L[H]=0)}function A(T,L,H,B,X,Y,K){K===!0?n.vertexAttribIPointer(T,L,H,X,Y):n.vertexAttribPointer(T,L,H,B,X,Y)}function b(T,L,H,B){M();const X=B.attributes,Y=H.getAttributes(),K=L.defaultAttributeValues;for(const V in Y){const se=Y[V];if(se.location>=0){let de=X[V];if(de===void 0&&(V==="instanceMatrix"&&T.instanceMatrix&&(de=T.instanceMatrix),V==="instanceColor"&&T.instanceColor&&(de=T.instanceColor)),de!==void 0){const ae=de.normalized,ue=de.itemSize,Me=e.get(de);if(Me===void 0)continue;const he=Me.buffer,Qe=Me.type,nt=Me.bytesPerElement,Q=Qe===n.INT||Qe===n.UNSIGNED_INT||de.gpuType===Sh;if(de.isInterleavedBufferAttribute){const te=de.data,Te=te.stride,Ve=de.offset;if(te.isInstancedInterleavedBuffer){for(let _e=0;_e<se.locationSize;_e++)d(se.location+_e,te.meshPerAttribute);T.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let _e=0;_e<se.locationSize;_e++)p(se.location+_e);n.bindBuffer(n.ARRAY_BUFFER,he);for(let _e=0;_e<se.locationSize;_e++)A(se.location+_e,ue/se.locationSize,Qe,ae,Te*nt,(Ve+ue/se.locationSize*_e)*nt,Q)}else{if(de.isInstancedBufferAttribute){for(let te=0;te<se.locationSize;te++)d(se.location+te,de.meshPerAttribute);T.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let te=0;te<se.locationSize;te++)p(se.location+te);n.bindBuffer(n.ARRAY_BUFFER,he);for(let te=0;te<se.locationSize;te++)A(se.location+te,ue/se.locationSize,Qe,ae,ue*nt,ue/se.locationSize*te*nt,Q)}}else if(K!==void 0){const ae=K[V];if(ae!==void 0)switch(ae.length){case 2:n.vertexAttrib2fv(se.location,ae);break;case 3:n.vertexAttrib3fv(se.location,ae);break;case 4:n.vertexAttrib4fv(se.location,ae);break;default:n.vertexAttrib1fv(se.location,ae)}}}}y()}function D(){k();for(const T in i){const L=i[T];for(const H in L){const B=L[H];for(const X in B)h(B[X].object),delete B[X];delete L[H]}delete i[T]}}function R(T){if(i[T.id]===void 0)return;const L=i[T.id];for(const H in L){const B=L[H];for(const X in B)h(B[X].object),delete B[X];delete L[H]}delete i[T.id]}function U(T){for(const L in i){const H=i[L];if(H[T.id]===void 0)continue;const B=H[T.id];for(const X in B)h(B[X].object),delete B[X];delete H[T.id]}}function k(){S(),a=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:k,resetDefaultState:S,dispose:D,releaseStatesOfGeometry:R,releaseStatesOfProgram:U,initAttributes:M,enableAttribute:p,disableUnusedAttributes:y}}function aE(n,e,t){let i;function s(c){i=c}function r(c,h){n.drawArrays(i,c,h),t.update(h,i,1)}function a(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),t.update(h,i,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let g=0;for(let x=0;x<u;x++)g+=h[x];t.update(g,i,1)}function l(c,h,u,f){if(u===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let x=0;x<c.length;x++)a(c[x],h[x],f[x]);else{g.multiDrawArraysInstancedWEBGL(i,c,0,h,0,f,0,u);let x=0;for(let M=0;M<u;M++)x+=h[M]*f[M];t.update(x,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function oE(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const U=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(U.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(U){return!(U!==Di&&i.convert(U)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(U){const k=U===vs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(U!==pi&&i.convert(U)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&U!==Yi&&!k)}function l(U){if(U==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";U="mediump"}return U==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Je("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),g=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),A=n.getParameter(n.MAX_VARYING_VECTORS),b=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),D=n.getParameter(n.MAX_SAMPLES),R=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:g,maxVertexTextures:x,maxTextureSize:M,maxCubemapSize:p,maxAttributes:d,maxVertexUniforms:y,maxVaryings:A,maxFragmentUniforms:b,maxSamples:D,samples:R}}function lE(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new Us,o=new st,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const g=u.length!==0||f||i!==0||s;return s=f,i=u.length,g},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,g){const x=u.clippingPlanes,M=u.clipIntersection,p=u.clipShadows,d=n.get(u);if(!s||x===null||x.length===0||r&&!p)r?h(null):c();else{const y=r?0:i,A=y*4;let b=d.clippingState||null;l.value=b,b=h(x,f,A,g);for(let D=0;D!==A;++D)b[D]=t[D];d.clippingState=b,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,f,g,x){const M=u!==null?u.length:0;let p=null;if(M!==0){if(p=l.value,x!==!0||p===null){const d=g+M*4,y=f.matrixWorldInverse;o.getNormalMatrix(y),(p===null||p.length<d)&&(p=new Float32Array(d));for(let A=0,b=g;A!==M;++A,b+=4)a.copy(u[A]).applyMatrix4(y,o),a.normal.toArray(p,b),p[b+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,p}}function cE(n){let e=new WeakMap;function t(a,o){return o===lu?a.mapping=_r:o===cu&&(a.mapping=fa),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===lu||o===cu)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Bm(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}const Fs=4,Td=[.125,.215,.35,.446,.526,.582],or=20,uE=256,Wa=new Hm,bd=new wt;let Cc=null,Pc=0,Dc=0,Lc=!1;const hE=new W;class Ad{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=hE}=r;Cc=this._renderer.getRenderTarget(),Pc=this._renderer.getActiveCubeFace(),Dc=this._renderer.getActiveMipmapLevel(),Lc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Cd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Rd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Cc,Pc,Dc),this._renderer.xr.enabled=Lc,e.scissorTest=!1,jr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===_r||e.mapping===fa?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Cc=this._renderer.getRenderTarget(),Pc=this._renderer.getActiveCubeFace(),Dc=this._renderer.getActiveMipmapLevel(),Lc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:on,minFilter:on,generateMipmaps:!1,type:vs,format:Di,colorSpace:pa,depthBuffer:!1},s=wd(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=wd(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=fE(r)),this._blurMaterial=pE(r,e,t),this._ggxMaterial=dE(r,e,t)}return s}_compileMaterial(e){const t=new ni(new xi,e);this._renderer.compile(t,Wa)}_sceneToCubeUV(e,t,i,s,r){const l=new fi(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,g=u.toneMapping;u.getClearColor(bd),u.toneMapping=$i,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ni(new go,new ma({name:"PMREM.Background",side:Hn,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,p=M.material;let d=!1;const y=e.background;y?y.isColor&&(p.color.copy(y),e.background=null,d=!0):(p.color.copy(bd),d=!0);for(let A=0;A<6;A++){const b=A%3;b===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[A],r.y,r.z)):b===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[A]));const D=this._cubeSize;jr(s,b*D,A>2?D:0,D,D),u.setRenderTarget(s),d&&u.render(M,l),u.render(e,l)}u.toneMapping=g,u.autoClear=f,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===_r||e.mapping===fa;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Cd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Rd());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;jr(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Wa)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),f=0+c*1.25,g=u*f,{_lodMax:x}=this,M=this._sizeLods[i],p=3*M*(i>x-Fs?i-x+Fs:0),d=4*(this._cubeSize-M);l.envMap.value=e.texture,l.roughness.value=g,l.mipInt.value=x-t,jr(r,p,d,3*M,2*M),s.setRenderTarget(r),s.render(o,Wa),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=x-i,jr(e,p,d,3*M,2*M),s.setRenderTarget(e),s.render(o,Wa)}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&ft("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[s];u.material=c;const f=c.uniforms,g=this._sizeLods[i]-1,x=isFinite(r)?Math.PI/(2*g):2*Math.PI/(2*or-1),M=r/x,p=isFinite(r)?1+Math.floor(h*M):or;p>or&&Je(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${or}`);const d=[];let y=0;for(let U=0;U<or;++U){const k=U/M,S=Math.exp(-k*k/2);d.push(S),U===0?y+=S:U<p&&(y+=2*S)}for(let U=0;U<d.length;U++)d[U]=d[U]/y;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:A}=this;f.dTheta.value=x,f.mipInt.value=A-i;const b=this._sizeLods[s],D=3*b*(s>A-Fs?s-A+Fs:0),R=4*(this._cubeSize-b);jr(t,D,R,3*b,2*b),l.setRenderTarget(t),l.render(u,Wa)}}function fE(n){const e=[],t=[],i=[];let s=n;const r=n-Fs+1+Td.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>n-Fs?l=Td[a-n+Fs-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],g=6,x=6,M=3,p=2,d=1,y=new Float32Array(M*x*g),A=new Float32Array(p*x*g),b=new Float32Array(d*x*g);for(let R=0;R<g;R++){const U=R%3*2/3-1,k=R>2?0:-1,S=[U,k,0,U+2/3,k,0,U+2/3,k+1,0,U,k,0,U+2/3,k+1,0,U,k+1,0];y.set(S,M*x*R),A.set(f,p*x*R);const T=[R,R,R,R,R,R];b.set(T,d*x*R)}const D=new xi;D.setAttribute("position",new Xn(y,M)),D.setAttribute("uv",new Xn(A,p)),D.setAttribute("faceIndex",new Xn(b,d)),i.push(new ni(D,null)),s>Fs&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function wd(n,e,t){const i=new Zi(n,e,t);return i.texture.mapping=Ll,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function jr(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function dE(n,e,t){return new Qi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:uE,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Nl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:_s,depthTest:!1,depthWrite:!1})}function pE(n,e,t){const i=new Float32Array(or),s=new W(0,1,0);return new Qi({name:"SphericalGaussianBlur",defines:{n:or,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Nl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:_s,depthTest:!1,depthWrite:!1})}function Rd(){return new Qi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Nl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:_s,depthTest:!1,depthWrite:!1})}function Cd(){return new Qi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Nl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:_s,depthTest:!1,depthWrite:!1})}function Nl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function mE(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===lu||l===cu,h=l===_r||l===fa;if(c||h){let u=e.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Ad(n)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const g=o.image;return c&&g&&g.height>0||h&&g&&s(g)?(t===null&&(t=new Ad(n)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function gE(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&oo("WebGLRenderer: "+i+" extension not supported."),s}}}function _E(n,e,t,i){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const x in f.attributes)e.remove(f.attributes[x]);f.removeEventListener("dispose",a),delete s[f.id];const g=r.get(f);g&&(e.remove(g),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function l(u){const f=u.attributes;for(const g in f)e.update(f[g],n.ARRAY_BUFFER)}function c(u){const f=[],g=u.index,x=u.attributes.position;let M=0;if(g!==null){const y=g.array;M=g.version;for(let A=0,b=y.length;A<b;A+=3){const D=y[A+0],R=y[A+1],U=y[A+2];f.push(D,R,R,U,U,D)}}else if(x!==void 0){const y=x.array;M=x.version;for(let A=0,b=y.length/3-1;A<b;A+=3){const D=A+0,R=A+1,U=A+2;f.push(D,R,R,U,U,D)}}else return;const p=new(Pm(f)?Um:Im)(f,1);p.version=M;const d=r.get(u);d&&e.remove(d),r.set(u,p)}function h(u){const f=r.get(u);if(f){const g=u.index;g!==null&&f.version<g.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function xE(n,e,t){let i;function s(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,g){n.drawElements(i,g,r,f*a),t.update(g,i,1)}function c(f,g,x){x!==0&&(n.drawElementsInstanced(i,g,r,f*a,x),t.update(g,i,x))}function h(f,g,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,g,0,r,f,0,x);let p=0;for(let d=0;d<x;d++)p+=g[d];t.update(p,i,1)}function u(f,g,x,M){if(x===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let d=0;d<f.length;d++)c(f[d]/a,g[d],M[d]);else{p.multiDrawElementsInstancedWEBGL(i,g,0,r,f,0,M,0,x);let d=0;for(let y=0;y<x;y++)d+=g[y]*M[y];t.update(d,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function vE(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:ft("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function SE(n,e,t){const i=new WeakMap,s=new Jt;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=i.get(o);if(f===void 0||f.count!==u){let S=function(){U.dispose(),i.delete(o),o.removeEventListener("dispose",S)};f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,M=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],d=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let A=0;g===!0&&(A=1),x===!0&&(A=2),M===!0&&(A=3);let b=o.attributes.position.count*A,D=1;b>e.maxTextureSize&&(D=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const R=new Float32Array(b*D*4*u),U=new Dm(R,b,D,u);U.type=Yi,U.needsUpdate=!0;const k=A*4;for(let T=0;T<u;T++){const L=p[T],H=d[T],B=y[T],X=b*D*4*T;for(let Y=0;Y<L.count;Y++){const K=Y*k;g===!0&&(s.fromBufferAttribute(L,Y),R[X+K+0]=s.x,R[X+K+1]=s.y,R[X+K+2]=s.z,R[X+K+3]=0),x===!0&&(s.fromBufferAttribute(H,Y),R[X+K+4]=s.x,R[X+K+5]=s.y,R[X+K+6]=s.z,R[X+K+7]=0),M===!0&&(s.fromBufferAttribute(B,Y),R[X+K+8]=s.x,R[X+K+9]=s.y,R[X+K+10]=s.z,R[X+K+11]=B.itemSize===4?s.w:1)}}f={count:u,texture:U,size:new Xe(b,D)},i.set(o,f),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let g=0;for(let M=0;M<c.length;M++)g+=c[M];const x=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",x),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function ME(n,e,t,i){let s=new WeakMap;function r(l){const c=i.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const EE={[mm]:"LINEAR_TONE_MAPPING",[gm]:"REINHARD_TONE_MAPPING",[_m]:"CINEON_TONE_MAPPING",[xm]:"ACES_FILMIC_TONE_MAPPING",[Sm]:"AGX_TONE_MAPPING",[Mm]:"NEUTRAL_TONE_MAPPING",[vm]:"CUSTOM_TONE_MAPPING"};function yE(n,e,t,i,s){const r=new Zi(e,t,{type:n,depthBuffer:i,stencilBuffer:s}),a=new Zi(e,t,{type:vs,depthBuffer:!1,stencilBuffer:!1}),o=new xi;o.setAttribute("position",new _i([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new _i([0,2,0,0,2,0],2));const l=new gv({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new ni(o,l),h=new Hm(-1,1,1,-1,0,1);let u=null,f=null,g=!1,x,M=null,p=[],d=!1;this.setSize=function(y,A){r.setSize(y,A),a.setSize(y,A);for(let b=0;b<p.length;b++){const D=p[b];D.setSize&&D.setSize(y,A)}},this.setEffects=function(y){p=y,d=p.length>0&&p[0].isRenderPass===!0;const A=r.width,b=r.height;for(let D=0;D<p.length;D++){const R=p[D];R.setSize&&R.setSize(A,b)}},this.begin=function(y,A){if(g||y.toneMapping===$i&&p.length===0)return!1;if(M=A,A!==null){const b=A.width,D=A.height;(r.width!==b||r.height!==D)&&this.setSize(b,D)}return d===!1&&y.setRenderTarget(r),x=y.toneMapping,y.toneMapping=$i,!0},this.hasRenderPass=function(){return d},this.end=function(y,A){y.toneMapping=x,g=!0;let b=r,D=a;for(let R=0;R<p.length;R++){const U=p[R];if(U.enabled!==!1&&(U.render(y,D,b,A),U.needsSwap!==!1)){const k=b;b=D,D=k}}if(u!==y.outputColorSpace||f!==y.toneMapping){u=y.outputColorSpace,f=y.toneMapping,l.defines={},pt.getTransfer(u)===At&&(l.defines.SRGB_TRANSFER="");const R=EE[f];R&&(l.defines[R]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=b.texture,y.setRenderTarget(M),y.render(c,h),M=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){r.dispose(),a.dispose(),o.dispose(),l.dispose()}}const Xm=new Ln,qu=new co(1,1),Ym=new Dm,qm=new Xx,Km=new Om,Pd=[],Dd=[],Ld=new Float32Array(16),Id=new Float32Array(9),Ud=new Float32Array(4);function Ma(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=Pd[s];if(r===void 0&&(r=new Float32Array(s),Pd[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function pn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function mn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Fl(n,e){let t=Dd[e];t===void 0&&(t=new Int32Array(e),Dd[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function TE(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function bE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pn(t,e))return;n.uniform2fv(this.addr,e),mn(t,e)}}function AE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(pn(t,e))return;n.uniform3fv(this.addr,e),mn(t,e)}}function wE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pn(t,e))return;n.uniform4fv(this.addr,e),mn(t,e)}}function RE(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(pn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),mn(t,e)}else{if(pn(t,i))return;Ud.set(i),n.uniformMatrix2fv(this.addr,!1,Ud),mn(t,i)}}function CE(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(pn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),mn(t,e)}else{if(pn(t,i))return;Id.set(i),n.uniformMatrix3fv(this.addr,!1,Id),mn(t,i)}}function PE(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(pn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),mn(t,e)}else{if(pn(t,i))return;Ld.set(i),n.uniformMatrix4fv(this.addr,!1,Ld),mn(t,i)}}function DE(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function LE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pn(t,e))return;n.uniform2iv(this.addr,e),mn(t,e)}}function IE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(pn(t,e))return;n.uniform3iv(this.addr,e),mn(t,e)}}function UE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pn(t,e))return;n.uniform4iv(this.addr,e),mn(t,e)}}function NE(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function FE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pn(t,e))return;n.uniform2uiv(this.addr,e),mn(t,e)}}function OE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(pn(t,e))return;n.uniform3uiv(this.addr,e),mn(t,e)}}function BE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pn(t,e))return;n.uniform4uiv(this.addr,e),mn(t,e)}}function zE(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(qu.compareFunction=t.isReversedDepthBuffer()?wh:Ah,r=qu):r=Xm,t.setTexture2D(e||r,s)}function kE(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||qm,s)}function VE(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Km,s)}function GE(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Ym,s)}function HE(n){switch(n){case 5126:return TE;case 35664:return bE;case 35665:return AE;case 35666:return wE;case 35674:return RE;case 35675:return CE;case 35676:return PE;case 5124:case 35670:return DE;case 35667:case 35671:return LE;case 35668:case 35672:return IE;case 35669:case 35673:return UE;case 5125:return NE;case 36294:return FE;case 36295:return OE;case 36296:return BE;case 35678:case 36198:case 36298:case 36306:case 35682:return zE;case 35679:case 36299:case 36307:return kE;case 35680:case 36300:case 36308:case 36293:return VE;case 36289:case 36303:case 36311:case 36292:return GE}}function WE(n,e){n.uniform1fv(this.addr,e)}function XE(n,e){const t=Ma(e,this.size,2);n.uniform2fv(this.addr,t)}function YE(n,e){const t=Ma(e,this.size,3);n.uniform3fv(this.addr,t)}function qE(n,e){const t=Ma(e,this.size,4);n.uniform4fv(this.addr,t)}function KE(n,e){const t=Ma(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function $E(n,e){const t=Ma(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function ZE(n,e){const t=Ma(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function jE(n,e){n.uniform1iv(this.addr,e)}function JE(n,e){n.uniform2iv(this.addr,e)}function QE(n,e){n.uniform3iv(this.addr,e)}function ey(n,e){n.uniform4iv(this.addr,e)}function ty(n,e){n.uniform1uiv(this.addr,e)}function ny(n,e){n.uniform2uiv(this.addr,e)}function iy(n,e){n.uniform3uiv(this.addr,e)}function sy(n,e){n.uniform4uiv(this.addr,e)}function ry(n,e,t){const i=this.cache,s=e.length,r=Fl(t,s);pn(i,r)||(n.uniform1iv(this.addr,r),mn(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=qu:a=Xm;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function ay(n,e,t){const i=this.cache,s=e.length,r=Fl(t,s);pn(i,r)||(n.uniform1iv(this.addr,r),mn(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||qm,r[a])}function oy(n,e,t){const i=this.cache,s=e.length,r=Fl(t,s);pn(i,r)||(n.uniform1iv(this.addr,r),mn(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Km,r[a])}function ly(n,e,t){const i=this.cache,s=e.length,r=Fl(t,s);pn(i,r)||(n.uniform1iv(this.addr,r),mn(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Ym,r[a])}function cy(n){switch(n){case 5126:return WE;case 35664:return XE;case 35665:return YE;case 35666:return qE;case 35674:return KE;case 35675:return $E;case 35676:return ZE;case 5124:case 35670:return jE;case 35667:case 35671:return JE;case 35668:case 35672:return QE;case 35669:case 35673:return ey;case 5125:return ty;case 36294:return ny;case 36295:return iy;case 36296:return sy;case 35678:case 36198:case 36298:case 36306:case 35682:return ry;case 35679:case 36299:case 36307:return ay;case 35680:case 36300:case 36308:case 36293:return oy;case 36289:case 36303:case 36311:case 36292:return ly}}class uy{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=HE(t.type)}}class hy{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=cy(t.type)}}class fy{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const Ic=/(\w+)(\])?(\[|\.)?/g;function Nd(n,e){n.seq.push(e),n.map[e.id]=e}function dy(n,e,t){const i=n.name,s=i.length;for(Ic.lastIndex=0;;){const r=Ic.exec(i),a=Ic.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Nd(t,c===void 0?new uy(o,n,e):new hy(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new fy(o),Nd(t,u)),t=u}}}class rl{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);dy(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function Fd(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const py=37297;let my=0;function gy(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Od=new st;function _y(n){pt._getMatrix(Od,pt.workingColorSpace,n);const e=`mat3( ${Od.elements.map(t=>t.toFixed(4))} )`;switch(pt.getTransfer(n)){case ul:return[e,"LinearTransferOETF"];case At:return[e,"sRGBTransferOETF"];default:return Je("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Bd(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+gy(n.getShaderSource(e),o)}else return r}function xy(n,e){const t=_y(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const vy={[mm]:"Linear",[gm]:"Reinhard",[_m]:"Cineon",[xm]:"ACESFilmic",[Sm]:"AgX",[Mm]:"Neutral",[vm]:"Custom"};function Sy(n,e){const t=vy[e];return t===void 0?(Je("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const $o=new W;function My(){pt.getLuminanceCoefficients($o);const n=$o.x.toFixed(4),e=$o.y.toFixed(4),t=$o.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ey(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(eo).join(`
`)}function yy(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Ty(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function eo(n){return n!==""}function zd(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function kd(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const by=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ku(n){return n.replace(by,wy)}const Ay=new Map;function wy(n,e){let t=rt[e];if(t===void 0){const i=Ay.get(e);if(i!==void 0)t=rt[i],Je('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Ku(t)}const Ry=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vd(n){return n.replace(Ry,Cy)}function Cy(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Gd(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Py={[Qo]:"SHADOWMAP_TYPE_PCF",[Ja]:"SHADOWMAP_TYPE_VSM"};function Dy(n){return Py[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Ly={[_r]:"ENVMAP_TYPE_CUBE",[fa]:"ENVMAP_TYPE_CUBE",[Ll]:"ENVMAP_TYPE_CUBE_UV"};function Iy(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":Ly[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const Uy={[fa]:"ENVMAP_MODE_REFRACTION"};function Ny(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Uy[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Fy={[pm]:"ENVMAP_BLENDING_MULTIPLY",[Tx]:"ENVMAP_BLENDING_MIX",[bx]:"ENVMAP_BLENDING_ADD"};function Oy(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Fy[n.combine]||"ENVMAP_BLENDING_NONE"}function By(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function zy(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Dy(t),c=Iy(t),h=Ny(t),u=Oy(t),f=By(t),g=Ey(t),x=yy(r),M=s.createProgram();let p,d,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(eo).join(`
`),p.length>0&&(p+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(eo).join(`
`),d.length>0&&(d+=`
`)):(p=[Gd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(eo).join(`
`),d=[Gd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==$i?"#define TONE_MAPPING":"",t.toneMapping!==$i?rt.tonemapping_pars_fragment:"",t.toneMapping!==$i?Sy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",rt.colorspace_pars_fragment,xy("linearToOutputTexel",t.outputColorSpace),My(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(eo).join(`
`)),a=Ku(a),a=zd(a,t),a=kd(a,t),o=Ku(o),o=zd(o,t),o=kd(o,t),a=Vd(a),o=Vd(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[g,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,d=["#define varying in",t.glslVersion===ed?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ed?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const A=y+p+a,b=y+d+o,D=Fd(s,s.VERTEX_SHADER,A),R=Fd(s,s.FRAGMENT_SHADER,b);s.attachShader(M,D),s.attachShader(M,R),t.index0AttributeName!==void 0?s.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function U(L){if(n.debug.checkShaderErrors){const H=s.getProgramInfoLog(M)||"",B=s.getShaderInfoLog(D)||"",X=s.getShaderInfoLog(R)||"",Y=H.trim(),K=B.trim(),V=X.trim();let se=!0,de=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(se=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,M,D,R);else{const ae=Bd(s,D,"vertex"),ue=Bd(s,R,"fragment");ft("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+Y+`
`+ae+`
`+ue)}else Y!==""?Je("WebGLProgram: Program Info Log:",Y):(K===""||V==="")&&(de=!1);de&&(L.diagnostics={runnable:se,programLog:Y,vertexShader:{log:K,prefix:p},fragmentShader:{log:V,prefix:d}})}s.deleteShader(D),s.deleteShader(R),k=new rl(s,M),S=Ty(s,M)}let k;this.getUniforms=function(){return k===void 0&&U(this),k};let S;this.getAttributes=function(){return S===void 0&&U(this),S};let T=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=s.getProgramParameter(M,py)),T},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=my++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=D,this.fragmentShader=R,this}let ky=0;class Vy{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Gy(e),t.set(e,i)),i}}class Gy{constructor(e){this.id=ky++,this.code=e,this.usedTimes=0}}function Hy(n,e,t,i,s,r,a){const o=new Dh,l=new Vy,c=new Set,h=[],u=new Map,f=s.logarithmicDepthBuffer;let g=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(S){return c.add(S),S===0?"uv":`uv${S}`}function p(S,T,L,H,B){const X=H.fog,Y=B.geometry,K=S.isMeshStandardMaterial?H.environment:null,V=(S.isMeshStandardMaterial?t:e).get(S.envMap||K),se=V&&V.mapping===Ll?V.image.height:null,de=x[S.type];S.precision!==null&&(g=s.getMaxPrecision(S.precision),g!==S.precision&&Je("WebGLProgram.getParameters:",S.precision,"not supported, using",g,"instead."));const ae=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,ue=ae!==void 0?ae.length:0;let Me=0;Y.morphAttributes.position!==void 0&&(Me=1),Y.morphAttributes.normal!==void 0&&(Me=2),Y.morphAttributes.color!==void 0&&(Me=3);let he,Qe,nt,Q;if(de){const xt=Gi[de];he=xt.vertexShader,Qe=xt.fragmentShader}else he=S.vertexShader,Qe=S.fragmentShader,l.update(S),nt=l.getVertexShaderID(S),Q=l.getFragmentShaderID(S);const te=n.getRenderTarget(),Te=n.state.buffers.depth.getReversed(),Ve=B.isInstancedMesh===!0,_e=B.isBatchedMesh===!0,et=!!S.map,Rt=!!S.matcap,Ye=!!V,at=!!S.aoMap,ht=!!S.lightMap,qe=!!S.bumpMap,Ft=!!S.normalMap,N=!!S.displacementMap,Ct=!!S.emissiveMap,Ke=!!S.metalnessMap,dt=!!S.roughnessMap,De=S.anisotropy>0,C=S.clearcoat>0,_=S.dispersion>0,I=S.iridescence>0,j=S.sheen>0,ne=S.transmission>0,ee=De&&!!S.anisotropyMap,Ne=C&&!!S.clearcoatMap,me=C&&!!S.clearcoatNormalMap,Le=C&&!!S.clearcoatRoughnessMap,Be=I&&!!S.iridescenceMap,oe=I&&!!S.iridescenceThicknessMap,pe=j&&!!S.sheenColorMap,Ae=j&&!!S.sheenRoughnessMap,Oe=!!S.specularMap,xe=!!S.specularColorMap,$e=!!S.specularIntensityMap,F=ne&&!!S.transmissionMap,Ee=ne&&!!S.thicknessMap,le=!!S.gradientMap,we=!!S.alphaMap,fe=S.alphaTest>0,re=!!S.alphaHash,ve=!!S.extensions;let Ze=$i;S.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Ze=n.toneMapping);const Pt={shaderID:de,shaderType:S.type,shaderName:S.name,vertexShader:he,fragmentShader:Qe,defines:S.defines,customVertexShaderID:nt,customFragmentShaderID:Q,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:g,batching:_e,batchingColor:_e&&B._colorsTexture!==null,instancing:Ve,instancingColor:Ve&&B.instanceColor!==null,instancingMorph:Ve&&B.morphTexture!==null,outputColorSpace:te===null?n.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:pa,alphaToCoverage:!!S.alphaToCoverage,map:et,matcap:Rt,envMap:Ye,envMapMode:Ye&&V.mapping,envMapCubeUVHeight:se,aoMap:at,lightMap:ht,bumpMap:qe,normalMap:Ft,displacementMap:N,emissiveMap:Ct,normalMapObjectSpace:Ft&&S.normalMapType===Cx,normalMapTangentSpace:Ft&&S.normalMapType===Rx,metalnessMap:Ke,roughnessMap:dt,anisotropy:De,anisotropyMap:ee,clearcoat:C,clearcoatMap:Ne,clearcoatNormalMap:me,clearcoatRoughnessMap:Le,dispersion:_,iridescence:I,iridescenceMap:Be,iridescenceThicknessMap:oe,sheen:j,sheenColorMap:pe,sheenRoughnessMap:Ae,specularMap:Oe,specularColorMap:xe,specularIntensityMap:$e,transmission:ne,transmissionMap:F,thicknessMap:Ee,gradientMap:le,opaque:S.transparent===!1&&S.blending===ra&&S.alphaToCoverage===!1,alphaMap:we,alphaTest:fe,alphaHash:re,combine:S.combine,mapUv:et&&M(S.map.channel),aoMapUv:at&&M(S.aoMap.channel),lightMapUv:ht&&M(S.lightMap.channel),bumpMapUv:qe&&M(S.bumpMap.channel),normalMapUv:Ft&&M(S.normalMap.channel),displacementMapUv:N&&M(S.displacementMap.channel),emissiveMapUv:Ct&&M(S.emissiveMap.channel),metalnessMapUv:Ke&&M(S.metalnessMap.channel),roughnessMapUv:dt&&M(S.roughnessMap.channel),anisotropyMapUv:ee&&M(S.anisotropyMap.channel),clearcoatMapUv:Ne&&M(S.clearcoatMap.channel),clearcoatNormalMapUv:me&&M(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Le&&M(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Be&&M(S.iridescenceMap.channel),iridescenceThicknessMapUv:oe&&M(S.iridescenceThicknessMap.channel),sheenColorMapUv:pe&&M(S.sheenColorMap.channel),sheenRoughnessMapUv:Ae&&M(S.sheenRoughnessMap.channel),specularMapUv:Oe&&M(S.specularMap.channel),specularColorMapUv:xe&&M(S.specularColorMap.channel),specularIntensityMapUv:$e&&M(S.specularIntensityMap.channel),transmissionMapUv:F&&M(S.transmissionMap.channel),thicknessMapUv:Ee&&M(S.thicknessMap.channel),alphaMapUv:we&&M(S.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(Ft||De),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!Y.attributes.uv&&(et||we),fog:!!X,useFog:S.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Te,skinning:B.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:ue,morphTextureStride:Me,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ze,decodeVideoTexture:et&&S.map.isVideoTexture===!0&&pt.getTransfer(S.map.colorSpace)===At,decodeVideoTextureEmissive:Ct&&S.emissiveMap.isVideoTexture===!0&&pt.getTransfer(S.emissiveMap.colorSpace)===At,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Wi,flipSided:S.side===Hn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:ve&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ve&&S.extensions.multiDraw===!0||_e)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Pt.vertexUv1s=c.has(1),Pt.vertexUv2s=c.has(2),Pt.vertexUv3s=c.has(3),c.clear(),Pt}function d(S){const T=[];if(S.shaderID?T.push(S.shaderID):(T.push(S.customVertexShaderID),T.push(S.customFragmentShaderID)),S.defines!==void 0)for(const L in S.defines)T.push(L),T.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(y(T,S),A(T,S),T.push(n.outputColorSpace)),T.push(S.customProgramCacheKey),T.join()}function y(S,T){S.push(T.precision),S.push(T.outputColorSpace),S.push(T.envMapMode),S.push(T.envMapCubeUVHeight),S.push(T.mapUv),S.push(T.alphaMapUv),S.push(T.lightMapUv),S.push(T.aoMapUv),S.push(T.bumpMapUv),S.push(T.normalMapUv),S.push(T.displacementMapUv),S.push(T.emissiveMapUv),S.push(T.metalnessMapUv),S.push(T.roughnessMapUv),S.push(T.anisotropyMapUv),S.push(T.clearcoatMapUv),S.push(T.clearcoatNormalMapUv),S.push(T.clearcoatRoughnessMapUv),S.push(T.iridescenceMapUv),S.push(T.iridescenceThicknessMapUv),S.push(T.sheenColorMapUv),S.push(T.sheenRoughnessMapUv),S.push(T.specularMapUv),S.push(T.specularColorMapUv),S.push(T.specularIntensityMapUv),S.push(T.transmissionMapUv),S.push(T.thicknessMapUv),S.push(T.combine),S.push(T.fogExp2),S.push(T.sizeAttenuation),S.push(T.morphTargetsCount),S.push(T.morphAttributeCount),S.push(T.numDirLights),S.push(T.numPointLights),S.push(T.numSpotLights),S.push(T.numSpotLightMaps),S.push(T.numHemiLights),S.push(T.numRectAreaLights),S.push(T.numDirLightShadows),S.push(T.numPointLightShadows),S.push(T.numSpotLightShadows),S.push(T.numSpotLightShadowsWithMaps),S.push(T.numLightProbes),S.push(T.shadowMapType),S.push(T.toneMapping),S.push(T.numClippingPlanes),S.push(T.numClipIntersection),S.push(T.depthPacking)}function A(S,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),S.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),S.push(o.mask)}function b(S){const T=x[S.type];let L;if(T){const H=Gi[T];L=sv.clone(H.uniforms)}else L=S.uniforms;return L}function D(S,T){let L=u.get(T);return L!==void 0?++L.usedTimes:(L=new zy(n,T,S,r),h.push(L),u.set(T,L)),L}function R(S){if(--S.usedTimes===0){const T=h.indexOf(S);h[T]=h[h.length-1],h.pop(),u.delete(S.cacheKey),S.destroy()}}function U(S){l.remove(S)}function k(){l.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:b,acquireProgram:D,releaseProgram:R,releaseShaderCache:U,programs:h,dispose:k}}function Wy(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Xy(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Hd(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Wd(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(u,f,g,x,M,p){let d=n[e];return d===void 0?(d={id:u.id,object:u,geometry:f,material:g,groupOrder:x,renderOrder:u.renderOrder,z:M,group:p},n[e]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=g,d.groupOrder=x,d.renderOrder=u.renderOrder,d.z=M,d.group=p),e++,d}function o(u,f,g,x,M,p){const d=a(u,f,g,x,M,p);g.transmission>0?i.push(d):g.transparent===!0?s.push(d):t.push(d)}function l(u,f,g,x,M,p){const d=a(u,f,g,x,M,p);g.transmission>0?i.unshift(d):g.transparent===!0?s.unshift(d):t.unshift(d)}function c(u,f){t.length>1&&t.sort(u||Xy),i.length>1&&i.sort(f||Hd),s.length>1&&s.sort(f||Hd)}function h(){for(let u=e,f=n.length;u<f;u++){const g=n[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function Yy(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new Wd,n.set(i,[a])):s>=r.length?(a=new Wd,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function qy(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new W,color:new wt};break;case"SpotLight":t={position:new W,direction:new W,color:new wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new W,color:new wt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new W,skyColor:new wt,groundColor:new wt};break;case"RectAreaLight":t={color:new wt,position:new W,halfWidth:new W,halfHeight:new W};break}return n[e.id]=t,t}}}function Ky(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let $y=0;function Zy(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function jy(n){const e=new qy,t=Ky(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new W);const s=new W,r=new Zt,a=new Zt;function o(c){let h=0,u=0,f=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let g=0,x=0,M=0,p=0,d=0,y=0,A=0,b=0,D=0,R=0,U=0;c.sort(Zy);for(let S=0,T=c.length;S<T;S++){const L=c[S],H=L.color,B=L.intensity,X=L.distance;let Y=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===da?Y=L.shadow.map.texture:Y=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=H.r*B,u+=H.g*B,f+=H.b*B;else if(L.isLightProbe){for(let K=0;K<9;K++)i.probe[K].addScaledVector(L.sh.coefficients[K],B);U++}else if(L.isDirectionalLight){const K=e.get(L);if(K.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const V=L.shadow,se=t.get(L);se.shadowIntensity=V.intensity,se.shadowBias=V.bias,se.shadowNormalBias=V.normalBias,se.shadowRadius=V.radius,se.shadowMapSize=V.mapSize,i.directionalShadow[g]=se,i.directionalShadowMap[g]=Y,i.directionalShadowMatrix[g]=L.shadow.matrix,y++}i.directional[g]=K,g++}else if(L.isSpotLight){const K=e.get(L);K.position.setFromMatrixPosition(L.matrixWorld),K.color.copy(H).multiplyScalar(B),K.distance=X,K.coneCos=Math.cos(L.angle),K.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),K.decay=L.decay,i.spot[M]=K;const V=L.shadow;if(L.map&&(i.spotLightMap[D]=L.map,D++,V.updateMatrices(L),L.castShadow&&R++),i.spotLightMatrix[M]=V.matrix,L.castShadow){const se=t.get(L);se.shadowIntensity=V.intensity,se.shadowBias=V.bias,se.shadowNormalBias=V.normalBias,se.shadowRadius=V.radius,se.shadowMapSize=V.mapSize,i.spotShadow[M]=se,i.spotShadowMap[M]=Y,b++}M++}else if(L.isRectAreaLight){const K=e.get(L);K.color.copy(H).multiplyScalar(B),K.halfWidth.set(L.width*.5,0,0),K.halfHeight.set(0,L.height*.5,0),i.rectArea[p]=K,p++}else if(L.isPointLight){const K=e.get(L);if(K.color.copy(L.color).multiplyScalar(L.intensity),K.distance=L.distance,K.decay=L.decay,L.castShadow){const V=L.shadow,se=t.get(L);se.shadowIntensity=V.intensity,se.shadowBias=V.bias,se.shadowNormalBias=V.normalBias,se.shadowRadius=V.radius,se.shadowMapSize=V.mapSize,se.shadowCameraNear=V.camera.near,se.shadowCameraFar=V.camera.far,i.pointShadow[x]=se,i.pointShadowMap[x]=Y,i.pointShadowMatrix[x]=L.shadow.matrix,A++}i.point[x]=K,x++}else if(L.isHemisphereLight){const K=e.get(L);K.skyColor.copy(L.color).multiplyScalar(B),K.groundColor.copy(L.groundColor).multiplyScalar(B),i.hemi[d]=K,d++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=be.LTC_FLOAT_1,i.rectAreaLTC2=be.LTC_FLOAT_2):(i.rectAreaLTC1=be.LTC_HALF_1,i.rectAreaLTC2=be.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=f;const k=i.hash;(k.directionalLength!==g||k.pointLength!==x||k.spotLength!==M||k.rectAreaLength!==p||k.hemiLength!==d||k.numDirectionalShadows!==y||k.numPointShadows!==A||k.numSpotShadows!==b||k.numSpotMaps!==D||k.numLightProbes!==U)&&(i.directional.length=g,i.spot.length=M,i.rectArea.length=p,i.point.length=x,i.hemi.length=d,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=A,i.pointShadowMap.length=A,i.spotShadow.length=b,i.spotShadowMap.length=b,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=A,i.spotLightMatrix.length=b+D-R,i.spotLightMap.length=D,i.numSpotLightShadowsWithMaps=R,i.numLightProbes=U,k.directionalLength=g,k.pointLength=x,k.spotLength=M,k.rectAreaLength=p,k.hemiLength=d,k.numDirectionalShadows=y,k.numPointShadows=A,k.numSpotShadows=b,k.numSpotMaps=D,k.numLightProbes=U,i.version=$y++)}function l(c,h){let u=0,f=0,g=0,x=0,M=0;const p=h.matrixWorldInverse;for(let d=0,y=c.length;d<y;d++){const A=c[d];if(A.isDirectionalLight){const b=i.directional[u];b.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(p),u++}else if(A.isSpotLight){const b=i.spot[g];b.position.setFromMatrixPosition(A.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(p),g++}else if(A.isRectAreaLight){const b=i.rectArea[x];b.position.setFromMatrixPosition(A.matrixWorld),b.position.applyMatrix4(p),a.identity(),r.copy(A.matrixWorld),r.premultiply(p),a.extractRotation(r),b.halfWidth.set(A.width*.5,0,0),b.halfHeight.set(0,A.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),x++}else if(A.isPointLight){const b=i.point[f];b.position.setFromMatrixPosition(A.matrixWorld),b.position.applyMatrix4(p),f++}else if(A.isHemisphereLight){const b=i.hemi[M];b.direction.setFromMatrixPosition(A.matrixWorld),b.direction.transformDirection(p),M++}}}return{setup:o,setupView:l,state:i}}function Xd(n){const e=new jy(n),t=[],i=[];function s(h){c.camera=h,t.length=0,i.length=0}function r(h){t.push(h)}function a(h){i.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Jy(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Xd(n),e.set(s,[o])):r>=a.length?(o=new Xd(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const Qy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,eT=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,tT=[new W(1,0,0),new W(-1,0,0),new W(0,1,0),new W(0,-1,0),new W(0,0,1),new W(0,0,-1)],nT=[new W(0,-1,0),new W(0,-1,0),new W(0,0,1),new W(0,0,-1),new W(0,-1,0),new W(0,-1,0)],Yd=new Zt,Xa=new W,Uc=new W;function iT(n,e,t){let i=new km;const s=new Xe,r=new Xe,a=new Jt,o=new _v,l=new xv,c={},h=t.maxTextureSize,u={[Ws]:Hn,[Hn]:Ws,[Wi]:Wi},f=new Qi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Xe},radius:{value:4}},vertexShader:Qy,fragmentShader:eT}),g=f.clone();g.defines.HORIZONTAL_PASS=1;const x=new xi;x.setAttribute("position",new Xn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new ni(x,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Qo;let d=this.type;this.render=function(R,U,k){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||R.length===0)return;R.type===rx&&(Je("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),R.type=Qo);const S=n.getRenderTarget(),T=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),H=n.state;H.setBlending(_s),H.buffers.depth.getReversed()===!0?H.buffers.color.setClear(0,0,0,0):H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);const B=d!==this.type;B&&U.traverse(function(X){X.material&&(Array.isArray(X.material)?X.material.forEach(Y=>Y.needsUpdate=!0):X.material.needsUpdate=!0)});for(let X=0,Y=R.length;X<Y;X++){const K=R[X],V=K.shadow;if(V===void 0){Je("WebGLShadowMap:",K,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const se=V.getFrameExtents();if(s.multiply(se),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/se.x),s.x=r.x*se.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/se.y),s.y=r.y*se.y,V.mapSize.y=r.y)),V.map===null||B===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===Ja){if(K.isPointLight){Je("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new Zi(s.x,s.y,{format:da,type:vs,minFilter:on,magFilter:on,generateMipmaps:!1}),V.map.texture.name=K.name+".shadowMap",V.map.depthTexture=new co(s.x,s.y,Yi),V.map.depthTexture.name=K.name+".shadowMapDepth",V.map.depthTexture.format=Ss,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=An,V.map.depthTexture.magFilter=An}else{K.isPointLight?(V.map=new Bm(s.x),V.map.depthTexture=new mv(s.x,Ji)):(V.map=new Zi(s.x,s.y),V.map.depthTexture=new co(s.x,s.y,Ji)),V.map.depthTexture.name=K.name+".shadowMap",V.map.depthTexture.format=Ss;const ae=n.state.buffers.depth.getReversed();this.type===Qo?(V.map.depthTexture.compareFunction=ae?wh:Ah,V.map.depthTexture.minFilter=on,V.map.depthTexture.magFilter=on):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=An,V.map.depthTexture.magFilter=An)}V.camera.updateProjectionMatrix()}const de=V.map.isWebGLCubeRenderTarget?6:1;for(let ae=0;ae<de;ae++){if(V.map.isWebGLCubeRenderTarget)n.setRenderTarget(V.map,ae),n.clear();else{ae===0&&(n.setRenderTarget(V.map),n.clear());const ue=V.getViewport(ae);a.set(r.x*ue.x,r.y*ue.y,r.x*ue.z,r.y*ue.w),H.viewport(a)}if(K.isPointLight){const ue=V.camera,Me=V.matrix,he=K.distance||ue.far;he!==ue.far&&(ue.far=he,ue.updateProjectionMatrix()),Xa.setFromMatrixPosition(K.matrixWorld),ue.position.copy(Xa),Uc.copy(ue.position),Uc.add(tT[ae]),ue.up.copy(nT[ae]),ue.lookAt(Uc),ue.updateMatrixWorld(),Me.makeTranslation(-Xa.x,-Xa.y,-Xa.z),Yd.multiplyMatrices(ue.projectionMatrix,ue.matrixWorldInverse),V._frustum.setFromProjectionMatrix(Yd,ue.coordinateSystem,ue.reversedDepth)}else V.updateMatrices(K);i=V.getFrustum(),b(U,k,V.camera,K,this.type)}V.isPointLightShadow!==!0&&this.type===Ja&&y(V,k),V.needsUpdate=!1}d=this.type,p.needsUpdate=!1,n.setRenderTarget(S,T,L)};function y(R,U){const k=e.update(M);f.defines.VSM_SAMPLES!==R.blurSamples&&(f.defines.VSM_SAMPLES=R.blurSamples,g.defines.VSM_SAMPLES=R.blurSamples,f.needsUpdate=!0,g.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new Zi(s.x,s.y,{format:da,type:vs})),f.uniforms.shadow_pass.value=R.map.depthTexture,f.uniforms.resolution.value=R.mapSize,f.uniforms.radius.value=R.radius,n.setRenderTarget(R.mapPass),n.clear(),n.renderBufferDirect(U,null,k,f,M,null),g.uniforms.shadow_pass.value=R.mapPass.texture,g.uniforms.resolution.value=R.mapSize,g.uniforms.radius.value=R.radius,n.setRenderTarget(R.map),n.clear(),n.renderBufferDirect(U,null,k,g,M,null)}function A(R,U,k,S){let T=null;const L=k.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(L!==void 0)T=L;else if(T=k.isPointLight===!0?l:o,n.localClippingEnabled&&U.clipShadows===!0&&Array.isArray(U.clippingPlanes)&&U.clippingPlanes.length!==0||U.displacementMap&&U.displacementScale!==0||U.alphaMap&&U.alphaTest>0||U.map&&U.alphaTest>0||U.alphaToCoverage===!0){const H=T.uuid,B=U.uuid;let X=c[H];X===void 0&&(X={},c[H]=X);let Y=X[B];Y===void 0&&(Y=T.clone(),X[B]=Y,U.addEventListener("dispose",D)),T=Y}if(T.visible=U.visible,T.wireframe=U.wireframe,S===Ja?T.side=U.shadowSide!==null?U.shadowSide:U.side:T.side=U.shadowSide!==null?U.shadowSide:u[U.side],T.alphaMap=U.alphaMap,T.alphaTest=U.alphaToCoverage===!0?.5:U.alphaTest,T.map=U.map,T.clipShadows=U.clipShadows,T.clippingPlanes=U.clippingPlanes,T.clipIntersection=U.clipIntersection,T.displacementMap=U.displacementMap,T.displacementScale=U.displacementScale,T.displacementBias=U.displacementBias,T.wireframeLinewidth=U.wireframeLinewidth,T.linewidth=U.linewidth,k.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const H=n.properties.get(T);H.light=k}return T}function b(R,U,k,S,T){if(R.visible===!1)return;if(R.layers.test(U.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&T===Ja)&&(!R.frustumCulled||i.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,R.matrixWorld);const B=e.update(R),X=R.material;if(Array.isArray(X)){const Y=B.groups;for(let K=0,V=Y.length;K<V;K++){const se=Y[K],de=X[se.materialIndex];if(de&&de.visible){const ae=A(R,de,S,T);R.onBeforeShadow(n,R,U,k,B,ae,se),n.renderBufferDirect(k,null,B,ae,R,se),R.onAfterShadow(n,R,U,k,B,ae,se)}}}else if(X.visible){const Y=A(R,X,S,T);R.onBeforeShadow(n,R,U,k,B,Y,null),n.renderBufferDirect(k,null,B,Y,R,null),R.onAfterShadow(n,R,U,k,B,Y,null)}}const H=R.children;for(let B=0,X=H.length;B<X;B++)b(H[B],U,k,S,T)}function D(R){R.target.removeEventListener("dispose",D);for(const k in c){const S=c[k],T=R.target.uuid;T in S&&(S[T].dispose(),delete S[T])}}}const sT={[tu]:nu,[iu]:au,[su]:ou,[ha]:ru,[nu]:tu,[au]:iu,[ou]:su,[ru]:ha};function rT(n,e){function t(){let F=!1;const Ee=new Jt;let le=null;const we=new Jt(0,0,0,0);return{setMask:function(fe){le!==fe&&!F&&(n.colorMask(fe,fe,fe,fe),le=fe)},setLocked:function(fe){F=fe},setClear:function(fe,re,ve,Ze,Pt){Pt===!0&&(fe*=Ze,re*=Ze,ve*=Ze),Ee.set(fe,re,ve,Ze),we.equals(Ee)===!1&&(n.clearColor(fe,re,ve,Ze),we.copy(Ee))},reset:function(){F=!1,le=null,we.set(-1,0,0,0)}}}function i(){let F=!1,Ee=!1,le=null,we=null,fe=null;return{setReversed:function(re){if(Ee!==re){const ve=e.get("EXT_clip_control");re?ve.clipControlEXT(ve.LOWER_LEFT_EXT,ve.ZERO_TO_ONE_EXT):ve.clipControlEXT(ve.LOWER_LEFT_EXT,ve.NEGATIVE_ONE_TO_ONE_EXT),Ee=re;const Ze=fe;fe=null,this.setClear(Ze)}},getReversed:function(){return Ee},setTest:function(re){re?te(n.DEPTH_TEST):Te(n.DEPTH_TEST)},setMask:function(re){le!==re&&!F&&(n.depthMask(re),le=re)},setFunc:function(re){if(Ee&&(re=sT[re]),we!==re){switch(re){case tu:n.depthFunc(n.NEVER);break;case nu:n.depthFunc(n.ALWAYS);break;case iu:n.depthFunc(n.LESS);break;case ha:n.depthFunc(n.LEQUAL);break;case su:n.depthFunc(n.EQUAL);break;case ru:n.depthFunc(n.GEQUAL);break;case au:n.depthFunc(n.GREATER);break;case ou:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}we=re}},setLocked:function(re){F=re},setClear:function(re){fe!==re&&(Ee&&(re=1-re),n.clearDepth(re),fe=re)},reset:function(){F=!1,le=null,we=null,fe=null,Ee=!1}}}function s(){let F=!1,Ee=null,le=null,we=null,fe=null,re=null,ve=null,Ze=null,Pt=null;return{setTest:function(xt){F||(xt?te(n.STENCIL_TEST):Te(n.STENCIL_TEST))},setMask:function(xt){Ee!==xt&&!F&&(n.stencilMask(xt),Ee=xt)},setFunc:function(xt,_n,Ot){(le!==xt||we!==_n||fe!==Ot)&&(n.stencilFunc(xt,_n,Ot),le=xt,we=_n,fe=Ot)},setOp:function(xt,_n,Ot){(re!==xt||ve!==_n||Ze!==Ot)&&(n.stencilOp(xt,_n,Ot),re=xt,ve=_n,Ze=Ot)},setLocked:function(xt){F=xt},setClear:function(xt){Pt!==xt&&(n.clearStencil(xt),Pt=xt)},reset:function(){F=!1,Ee=null,le=null,we=null,fe=null,re=null,ve=null,Ze=null,Pt=null}}}const r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,g=[],x=null,M=!1,p=null,d=null,y=null,A=null,b=null,D=null,R=null,U=new wt(0,0,0),k=0,S=!1,T=null,L=null,H=null,B=null,X=null;const Y=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let K=!1,V=0;const se=n.getParameter(n.VERSION);se.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(se)[1]),K=V>=1):se.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(se)[1]),K=V>=2);let de=null,ae={};const ue=n.getParameter(n.SCISSOR_BOX),Me=n.getParameter(n.VIEWPORT),he=new Jt().fromArray(ue),Qe=new Jt().fromArray(Me);function nt(F,Ee,le,we){const fe=new Uint8Array(4),re=n.createTexture();n.bindTexture(F,re),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let ve=0;ve<le;ve++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(Ee,0,n.RGBA,1,1,we,0,n.RGBA,n.UNSIGNED_BYTE,fe):n.texImage2D(Ee+ve,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,fe);return re}const Q={};Q[n.TEXTURE_2D]=nt(n.TEXTURE_2D,n.TEXTURE_2D,1),Q[n.TEXTURE_CUBE_MAP]=nt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[n.TEXTURE_2D_ARRAY]=nt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Q[n.TEXTURE_3D]=nt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),te(n.DEPTH_TEST),a.setFunc(ha),qe(!1),Ft($f),te(n.CULL_FACE),at(_s);function te(F){h[F]!==!0&&(n.enable(F),h[F]=!0)}function Te(F){h[F]!==!1&&(n.disable(F),h[F]=!1)}function Ve(F,Ee){return u[F]!==Ee?(n.bindFramebuffer(F,Ee),u[F]=Ee,F===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Ee),F===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Ee),!0):!1}function _e(F,Ee){let le=g,we=!1;if(F){le=f.get(Ee),le===void 0&&(le=[],f.set(Ee,le));const fe=F.textures;if(le.length!==fe.length||le[0]!==n.COLOR_ATTACHMENT0){for(let re=0,ve=fe.length;re<ve;re++)le[re]=n.COLOR_ATTACHMENT0+re;le.length=fe.length,we=!0}}else le[0]!==n.BACK&&(le[0]=n.BACK,we=!0);we&&n.drawBuffers(le)}function et(F){return x!==F?(n.useProgram(F),x=F,!0):!1}const Rt={[ar]:n.FUNC_ADD,[ox]:n.FUNC_SUBTRACT,[lx]:n.FUNC_REVERSE_SUBTRACT};Rt[cx]=n.MIN,Rt[ux]=n.MAX;const Ye={[hx]:n.ZERO,[fx]:n.ONE,[dx]:n.SRC_COLOR,[Qc]:n.SRC_ALPHA,[vx]:n.SRC_ALPHA_SATURATE,[_x]:n.DST_COLOR,[mx]:n.DST_ALPHA,[px]:n.ONE_MINUS_SRC_COLOR,[eu]:n.ONE_MINUS_SRC_ALPHA,[xx]:n.ONE_MINUS_DST_COLOR,[gx]:n.ONE_MINUS_DST_ALPHA,[Sx]:n.CONSTANT_COLOR,[Mx]:n.ONE_MINUS_CONSTANT_COLOR,[Ex]:n.CONSTANT_ALPHA,[yx]:n.ONE_MINUS_CONSTANT_ALPHA};function at(F,Ee,le,we,fe,re,ve,Ze,Pt,xt){if(F===_s){M===!0&&(Te(n.BLEND),M=!1);return}if(M===!1&&(te(n.BLEND),M=!0),F!==ax){if(F!==p||xt!==S){if((d!==ar||b!==ar)&&(n.blendEquation(n.FUNC_ADD),d=ar,b=ar),xt)switch(F){case ra:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Zf:n.blendFunc(n.ONE,n.ONE);break;case jf:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Jf:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:ft("WebGLState: Invalid blending: ",F);break}else switch(F){case ra:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Zf:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case jf:ft("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Jf:ft("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ft("WebGLState: Invalid blending: ",F);break}y=null,A=null,D=null,R=null,U.set(0,0,0),k=0,p=F,S=xt}return}fe=fe||Ee,re=re||le,ve=ve||we,(Ee!==d||fe!==b)&&(n.blendEquationSeparate(Rt[Ee],Rt[fe]),d=Ee,b=fe),(le!==y||we!==A||re!==D||ve!==R)&&(n.blendFuncSeparate(Ye[le],Ye[we],Ye[re],Ye[ve]),y=le,A=we,D=re,R=ve),(Ze.equals(U)===!1||Pt!==k)&&(n.blendColor(Ze.r,Ze.g,Ze.b,Pt),U.copy(Ze),k=Pt),p=F,S=!1}function ht(F,Ee){F.side===Wi?Te(n.CULL_FACE):te(n.CULL_FACE);let le=F.side===Hn;Ee&&(le=!le),qe(le),F.blending===ra&&F.transparent===!1?at(_s):at(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);const we=F.stencilWrite;o.setTest(we),we&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Ct(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?te(n.SAMPLE_ALPHA_TO_COVERAGE):Te(n.SAMPLE_ALPHA_TO_COVERAGE)}function qe(F){T!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),T=F)}function Ft(F){F!==ix?(te(n.CULL_FACE),F!==L&&(F===$f?n.cullFace(n.BACK):F===sx?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Te(n.CULL_FACE),L=F}function N(F){F!==H&&(K&&n.lineWidth(F),H=F)}function Ct(F,Ee,le){F?(te(n.POLYGON_OFFSET_FILL),(B!==Ee||X!==le)&&(n.polygonOffset(Ee,le),B=Ee,X=le)):Te(n.POLYGON_OFFSET_FILL)}function Ke(F){F?te(n.SCISSOR_TEST):Te(n.SCISSOR_TEST)}function dt(F){F===void 0&&(F=n.TEXTURE0+Y-1),de!==F&&(n.activeTexture(F),de=F)}function De(F,Ee,le){le===void 0&&(de===null?le=n.TEXTURE0+Y-1:le=de);let we=ae[le];we===void 0&&(we={type:void 0,texture:void 0},ae[le]=we),(we.type!==F||we.texture!==Ee)&&(de!==le&&(n.activeTexture(le),de=le),n.bindTexture(F,Ee||Q[F]),we.type=F,we.texture=Ee)}function C(){const F=ae[de];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function _(){try{n.compressedTexImage2D(...arguments)}catch(F){ft("WebGLState:",F)}}function I(){try{n.compressedTexImage3D(...arguments)}catch(F){ft("WebGLState:",F)}}function j(){try{n.texSubImage2D(...arguments)}catch(F){ft("WebGLState:",F)}}function ne(){try{n.texSubImage3D(...arguments)}catch(F){ft("WebGLState:",F)}}function ee(){try{n.compressedTexSubImage2D(...arguments)}catch(F){ft("WebGLState:",F)}}function Ne(){try{n.compressedTexSubImage3D(...arguments)}catch(F){ft("WebGLState:",F)}}function me(){try{n.texStorage2D(...arguments)}catch(F){ft("WebGLState:",F)}}function Le(){try{n.texStorage3D(...arguments)}catch(F){ft("WebGLState:",F)}}function Be(){try{n.texImage2D(...arguments)}catch(F){ft("WebGLState:",F)}}function oe(){try{n.texImage3D(...arguments)}catch(F){ft("WebGLState:",F)}}function pe(F){he.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),he.copy(F))}function Ae(F){Qe.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),Qe.copy(F))}function Oe(F,Ee){let le=c.get(Ee);le===void 0&&(le=new WeakMap,c.set(Ee,le));let we=le.get(F);we===void 0&&(we=n.getUniformBlockIndex(Ee,F.name),le.set(F,we))}function xe(F,Ee){const we=c.get(Ee).get(F);l.get(Ee)!==we&&(n.uniformBlockBinding(Ee,we,F.__bindingPointIndex),l.set(Ee,we))}function $e(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},de=null,ae={},u={},f=new WeakMap,g=[],x=null,M=!1,p=null,d=null,y=null,A=null,b=null,D=null,R=null,U=new wt(0,0,0),k=0,S=!1,T=null,L=null,H=null,B=null,X=null,he.set(0,0,n.canvas.width,n.canvas.height),Qe.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:te,disable:Te,bindFramebuffer:Ve,drawBuffers:_e,useProgram:et,setBlending:at,setMaterial:ht,setFlipSided:qe,setCullFace:Ft,setLineWidth:N,setPolygonOffset:Ct,setScissorTest:Ke,activeTexture:dt,bindTexture:De,unbindTexture:C,compressedTexImage2D:_,compressedTexImage3D:I,texImage2D:Be,texImage3D:oe,updateUBOMapping:Oe,uniformBlockBinding:xe,texStorage2D:me,texStorage3D:Le,texSubImage2D:j,texSubImage3D:ne,compressedTexSubImage2D:ee,compressedTexSubImage3D:Ne,scissor:pe,viewport:Ae,reset:$e}}function aT(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Xe,h=new WeakMap;let u;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(C,_){return g?new OffscreenCanvas(C,_):fl("canvas")}function M(C,_,I){let j=1;const ne=De(C);if((ne.width>I||ne.height>I)&&(j=I/Math.max(ne.width,ne.height)),j<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const ee=Math.floor(j*ne.width),Ne=Math.floor(j*ne.height);u===void 0&&(u=x(ee,Ne));const me=_?x(ee,Ne):u;return me.width=ee,me.height=Ne,me.getContext("2d").drawImage(C,0,0,ee,Ne),Je("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+ee+"x"+Ne+")."),me}else return"data"in C&&Je("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),C;return C}function p(C){return C.generateMipmaps}function d(C){n.generateMipmap(C)}function y(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function A(C,_,I,j,ne=!1){if(C!==null){if(n[C]!==void 0)return n[C];Je("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ee=_;if(_===n.RED&&(I===n.FLOAT&&(ee=n.R32F),I===n.HALF_FLOAT&&(ee=n.R16F),I===n.UNSIGNED_BYTE&&(ee=n.R8)),_===n.RED_INTEGER&&(I===n.UNSIGNED_BYTE&&(ee=n.R8UI),I===n.UNSIGNED_SHORT&&(ee=n.R16UI),I===n.UNSIGNED_INT&&(ee=n.R32UI),I===n.BYTE&&(ee=n.R8I),I===n.SHORT&&(ee=n.R16I),I===n.INT&&(ee=n.R32I)),_===n.RG&&(I===n.FLOAT&&(ee=n.RG32F),I===n.HALF_FLOAT&&(ee=n.RG16F),I===n.UNSIGNED_BYTE&&(ee=n.RG8)),_===n.RG_INTEGER&&(I===n.UNSIGNED_BYTE&&(ee=n.RG8UI),I===n.UNSIGNED_SHORT&&(ee=n.RG16UI),I===n.UNSIGNED_INT&&(ee=n.RG32UI),I===n.BYTE&&(ee=n.RG8I),I===n.SHORT&&(ee=n.RG16I),I===n.INT&&(ee=n.RG32I)),_===n.RGB_INTEGER&&(I===n.UNSIGNED_BYTE&&(ee=n.RGB8UI),I===n.UNSIGNED_SHORT&&(ee=n.RGB16UI),I===n.UNSIGNED_INT&&(ee=n.RGB32UI),I===n.BYTE&&(ee=n.RGB8I),I===n.SHORT&&(ee=n.RGB16I),I===n.INT&&(ee=n.RGB32I)),_===n.RGBA_INTEGER&&(I===n.UNSIGNED_BYTE&&(ee=n.RGBA8UI),I===n.UNSIGNED_SHORT&&(ee=n.RGBA16UI),I===n.UNSIGNED_INT&&(ee=n.RGBA32UI),I===n.BYTE&&(ee=n.RGBA8I),I===n.SHORT&&(ee=n.RGBA16I),I===n.INT&&(ee=n.RGBA32I)),_===n.RGB&&(I===n.UNSIGNED_INT_5_9_9_9_REV&&(ee=n.RGB9_E5),I===n.UNSIGNED_INT_10F_11F_11F_REV&&(ee=n.R11F_G11F_B10F)),_===n.RGBA){const Ne=ne?ul:pt.getTransfer(j);I===n.FLOAT&&(ee=n.RGBA32F),I===n.HALF_FLOAT&&(ee=n.RGBA16F),I===n.UNSIGNED_BYTE&&(ee=Ne===At?n.SRGB8_ALPHA8:n.RGBA8),I===n.UNSIGNED_SHORT_4_4_4_4&&(ee=n.RGBA4),I===n.UNSIGNED_SHORT_5_5_5_1&&(ee=n.RGB5_A1)}return(ee===n.R16F||ee===n.R32F||ee===n.RG16F||ee===n.RG32F||ee===n.RGBA16F||ee===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function b(C,_){let I;return C?_===null||_===Ji||_===ao?I=n.DEPTH24_STENCIL8:_===Yi?I=n.DEPTH32F_STENCIL8:_===ro&&(I=n.DEPTH24_STENCIL8,Je("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Ji||_===ao?I=n.DEPTH_COMPONENT24:_===Yi?I=n.DEPTH_COMPONENT32F:_===ro&&(I=n.DEPTH_COMPONENT16),I}function D(C,_){return p(C)===!0||C.isFramebufferTexture&&C.minFilter!==An&&C.minFilter!==on?Math.log2(Math.max(_.width,_.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?_.mipmaps.length:1}function R(C){const _=C.target;_.removeEventListener("dispose",R),k(_),_.isVideoTexture&&h.delete(_)}function U(C){const _=C.target;_.removeEventListener("dispose",U),T(_)}function k(C){const _=i.get(C);if(_.__webglInit===void 0)return;const I=C.source,j=f.get(I);if(j){const ne=j[_.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&S(C),Object.keys(j).length===0&&f.delete(I)}i.remove(C)}function S(C){const _=i.get(C);n.deleteTexture(_.__webglTexture);const I=C.source,j=f.get(I);delete j[_.__cacheKey],a.memory.textures--}function T(C){const _=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(_.__webglFramebuffer[j]))for(let ne=0;ne<_.__webglFramebuffer[j].length;ne++)n.deleteFramebuffer(_.__webglFramebuffer[j][ne]);else n.deleteFramebuffer(_.__webglFramebuffer[j]);_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer[j])}else{if(Array.isArray(_.__webglFramebuffer))for(let j=0;j<_.__webglFramebuffer.length;j++)n.deleteFramebuffer(_.__webglFramebuffer[j]);else n.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&n.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let j=0;j<_.__webglColorRenderbuffer.length;j++)_.__webglColorRenderbuffer[j]&&n.deleteRenderbuffer(_.__webglColorRenderbuffer[j]);_.__webglDepthRenderbuffer&&n.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const I=C.textures;for(let j=0,ne=I.length;j<ne;j++){const ee=i.get(I[j]);ee.__webglTexture&&(n.deleteTexture(ee.__webglTexture),a.memory.textures--),i.remove(I[j])}i.remove(C)}let L=0;function H(){L=0}function B(){const C=L;return C>=s.maxTextures&&Je("WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),L+=1,C}function X(C){const _=[];return _.push(C.wrapS),_.push(C.wrapT),_.push(C.wrapR||0),_.push(C.magFilter),_.push(C.minFilter),_.push(C.anisotropy),_.push(C.internalFormat),_.push(C.format),_.push(C.type),_.push(C.generateMipmaps),_.push(C.premultiplyAlpha),_.push(C.flipY),_.push(C.unpackAlignment),_.push(C.colorSpace),_.join()}function Y(C,_){const I=i.get(C);if(C.isVideoTexture&&Ke(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&I.__version!==C.version){const j=C.image;if(j===null)Je("WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)Je("WebGLRenderer: Texture marked for update but image is incomplete");else{Q(I,C,_);return}}else C.isExternalTexture&&(I.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,I.__webglTexture,n.TEXTURE0+_)}function K(C,_){const I=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&I.__version!==C.version){Q(I,C,_);return}else C.isExternalTexture&&(I.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,I.__webglTexture,n.TEXTURE0+_)}function V(C,_){const I=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&I.__version!==C.version){Q(I,C,_);return}t.bindTexture(n.TEXTURE_3D,I.__webglTexture,n.TEXTURE0+_)}function se(C,_){const I=i.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&I.__version!==C.version){te(I,C,_);return}t.bindTexture(n.TEXTURE_CUBE_MAP,I.__webglTexture,n.TEXTURE0+_)}const de={[uu]:n.REPEAT,[ps]:n.CLAMP_TO_EDGE,[hu]:n.MIRRORED_REPEAT},ae={[An]:n.NEAREST,[Ax]:n.NEAREST_MIPMAP_NEAREST,[wo]:n.NEAREST_MIPMAP_LINEAR,[on]:n.LINEAR,[sc]:n.LINEAR_MIPMAP_NEAREST,[hr]:n.LINEAR_MIPMAP_LINEAR},ue={[Px]:n.NEVER,[Nx]:n.ALWAYS,[Dx]:n.LESS,[Ah]:n.LEQUAL,[Lx]:n.EQUAL,[wh]:n.GEQUAL,[Ix]:n.GREATER,[Ux]:n.NOTEQUAL};function Me(C,_){if(_.type===Yi&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===on||_.magFilter===sc||_.magFilter===wo||_.magFilter===hr||_.minFilter===on||_.minFilter===sc||_.minFilter===wo||_.minFilter===hr)&&Je("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,de[_.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,de[_.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,de[_.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,ae[_.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,ae[_.minFilter]),_.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,ue[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===An||_.minFilter!==wo&&_.minFilter!==hr||_.type===Yi&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){const I=e.get("EXT_texture_filter_anisotropic");n.texParameterf(C,I.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function he(C,_){let I=!1;C.__webglInit===void 0&&(C.__webglInit=!0,_.addEventListener("dispose",R));const j=_.source;let ne=f.get(j);ne===void 0&&(ne={},f.set(j,ne));const ee=X(_);if(ee!==C.__cacheKey){ne[ee]===void 0&&(ne[ee]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,I=!0),ne[ee].usedTimes++;const Ne=ne[C.__cacheKey];Ne!==void 0&&(ne[C.__cacheKey].usedTimes--,Ne.usedTimes===0&&S(_)),C.__cacheKey=ee,C.__webglTexture=ne[ee].texture}return I}function Qe(C,_,I){return Math.floor(Math.floor(C/I)/_)}function nt(C,_,I,j){const ee=C.updateRanges;if(ee.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,_.width,_.height,I,j,_.data);else{ee.sort((oe,pe)=>oe.start-pe.start);let Ne=0;for(let oe=1;oe<ee.length;oe++){const pe=ee[Ne],Ae=ee[oe],Oe=pe.start+pe.count,xe=Qe(Ae.start,_.width,4),$e=Qe(pe.start,_.width,4);Ae.start<=Oe+1&&xe===$e&&Qe(Ae.start+Ae.count-1,_.width,4)===xe?pe.count=Math.max(pe.count,Ae.start+Ae.count-pe.start):(++Ne,ee[Ne]=Ae)}ee.length=Ne+1;const me=n.getParameter(n.UNPACK_ROW_LENGTH),Le=n.getParameter(n.UNPACK_SKIP_PIXELS),Be=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,_.width);for(let oe=0,pe=ee.length;oe<pe;oe++){const Ae=ee[oe],Oe=Math.floor(Ae.start/4),xe=Math.ceil(Ae.count/4),$e=Oe%_.width,F=Math.floor(Oe/_.width),Ee=xe,le=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,$e),n.pixelStorei(n.UNPACK_SKIP_ROWS,F),t.texSubImage2D(n.TEXTURE_2D,0,$e,F,Ee,le,I,j,_.data)}C.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,me),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Le),n.pixelStorei(n.UNPACK_SKIP_ROWS,Be)}}function Q(C,_,I){let j=n.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(j=n.TEXTURE_2D_ARRAY),_.isData3DTexture&&(j=n.TEXTURE_3D);const ne=he(C,_),ee=_.source;t.bindTexture(j,C.__webglTexture,n.TEXTURE0+I);const Ne=i.get(ee);if(ee.version!==Ne.__version||ne===!0){t.activeTexture(n.TEXTURE0+I);const me=pt.getPrimaries(pt.workingColorSpace),Le=_.colorSpace===Ns?null:pt.getPrimaries(_.colorSpace),Be=_.colorSpace===Ns||me===Le?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Be);let oe=M(_.image,!1,s.maxTextureSize);oe=dt(_,oe);const pe=r.convert(_.format,_.colorSpace),Ae=r.convert(_.type);let Oe=A(_.internalFormat,pe,Ae,_.colorSpace,_.isVideoTexture);Me(j,_);let xe;const $e=_.mipmaps,F=_.isVideoTexture!==!0,Ee=Ne.__version===void 0||ne===!0,le=ee.dataReady,we=D(_,oe);if(_.isDepthTexture)Oe=b(_.format===fr,_.type),Ee&&(F?t.texStorage2D(n.TEXTURE_2D,1,Oe,oe.width,oe.height):t.texImage2D(n.TEXTURE_2D,0,Oe,oe.width,oe.height,0,pe,Ae,null));else if(_.isDataTexture)if($e.length>0){F&&Ee&&t.texStorage2D(n.TEXTURE_2D,we,Oe,$e[0].width,$e[0].height);for(let fe=0,re=$e.length;fe<re;fe++)xe=$e[fe],F?le&&t.texSubImage2D(n.TEXTURE_2D,fe,0,0,xe.width,xe.height,pe,Ae,xe.data):t.texImage2D(n.TEXTURE_2D,fe,Oe,xe.width,xe.height,0,pe,Ae,xe.data);_.generateMipmaps=!1}else F?(Ee&&t.texStorage2D(n.TEXTURE_2D,we,Oe,oe.width,oe.height),le&&nt(_,oe,pe,Ae)):t.texImage2D(n.TEXTURE_2D,0,Oe,oe.width,oe.height,0,pe,Ae,oe.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){F&&Ee&&t.texStorage3D(n.TEXTURE_2D_ARRAY,we,Oe,$e[0].width,$e[0].height,oe.depth);for(let fe=0,re=$e.length;fe<re;fe++)if(xe=$e[fe],_.format!==Di)if(pe!==null)if(F){if(le)if(_.layerUpdates.size>0){const ve=yd(xe.width,xe.height,_.format,_.type);for(const Ze of _.layerUpdates){const Pt=xe.data.subarray(Ze*ve/xe.data.BYTES_PER_ELEMENT,(Ze+1)*ve/xe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,fe,0,0,Ze,xe.width,xe.height,1,pe,Pt)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,fe,0,0,0,xe.width,xe.height,oe.depth,pe,xe.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,fe,Oe,xe.width,xe.height,oe.depth,0,xe.data,0,0);else Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else F?le&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,fe,0,0,0,xe.width,xe.height,oe.depth,pe,Ae,xe.data):t.texImage3D(n.TEXTURE_2D_ARRAY,fe,Oe,xe.width,xe.height,oe.depth,0,pe,Ae,xe.data)}else{F&&Ee&&t.texStorage2D(n.TEXTURE_2D,we,Oe,$e[0].width,$e[0].height);for(let fe=0,re=$e.length;fe<re;fe++)xe=$e[fe],_.format!==Di?pe!==null?F?le&&t.compressedTexSubImage2D(n.TEXTURE_2D,fe,0,0,xe.width,xe.height,pe,xe.data):t.compressedTexImage2D(n.TEXTURE_2D,fe,Oe,xe.width,xe.height,0,xe.data):Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):F?le&&t.texSubImage2D(n.TEXTURE_2D,fe,0,0,xe.width,xe.height,pe,Ae,xe.data):t.texImage2D(n.TEXTURE_2D,fe,Oe,xe.width,xe.height,0,pe,Ae,xe.data)}else if(_.isDataArrayTexture)if(F){if(Ee&&t.texStorage3D(n.TEXTURE_2D_ARRAY,we,Oe,oe.width,oe.height,oe.depth),le)if(_.layerUpdates.size>0){const fe=yd(oe.width,oe.height,_.format,_.type);for(const re of _.layerUpdates){const ve=oe.data.subarray(re*fe/oe.data.BYTES_PER_ELEMENT,(re+1)*fe/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,re,oe.width,oe.height,1,pe,Ae,ve)}_.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,pe,Ae,oe.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Oe,oe.width,oe.height,oe.depth,0,pe,Ae,oe.data);else if(_.isData3DTexture)F?(Ee&&t.texStorage3D(n.TEXTURE_3D,we,Oe,oe.width,oe.height,oe.depth),le&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,pe,Ae,oe.data)):t.texImage3D(n.TEXTURE_3D,0,Oe,oe.width,oe.height,oe.depth,0,pe,Ae,oe.data);else if(_.isFramebufferTexture){if(Ee)if(F)t.texStorage2D(n.TEXTURE_2D,we,Oe,oe.width,oe.height);else{let fe=oe.width,re=oe.height;for(let ve=0;ve<we;ve++)t.texImage2D(n.TEXTURE_2D,ve,Oe,fe,re,0,pe,Ae,null),fe>>=1,re>>=1}}else if($e.length>0){if(F&&Ee){const fe=De($e[0]);t.texStorage2D(n.TEXTURE_2D,we,Oe,fe.width,fe.height)}for(let fe=0,re=$e.length;fe<re;fe++)xe=$e[fe],F?le&&t.texSubImage2D(n.TEXTURE_2D,fe,0,0,pe,Ae,xe):t.texImage2D(n.TEXTURE_2D,fe,Oe,pe,Ae,xe);_.generateMipmaps=!1}else if(F){if(Ee){const fe=De(oe);t.texStorage2D(n.TEXTURE_2D,we,Oe,fe.width,fe.height)}le&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,pe,Ae,oe)}else t.texImage2D(n.TEXTURE_2D,0,Oe,pe,Ae,oe);p(_)&&d(j),Ne.__version=ee.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function te(C,_,I){if(_.image.length!==6)return;const j=he(C,_),ne=_.source;t.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+I);const ee=i.get(ne);if(ne.version!==ee.__version||j===!0){t.activeTexture(n.TEXTURE0+I);const Ne=pt.getPrimaries(pt.workingColorSpace),me=_.colorSpace===Ns?null:pt.getPrimaries(_.colorSpace),Le=_.colorSpace===Ns||Ne===me?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Le);const Be=_.isCompressedTexture||_.image[0].isCompressedTexture,oe=_.image[0]&&_.image[0].isDataTexture,pe=[];for(let re=0;re<6;re++)!Be&&!oe?pe[re]=M(_.image[re],!0,s.maxCubemapSize):pe[re]=oe?_.image[re].image:_.image[re],pe[re]=dt(_,pe[re]);const Ae=pe[0],Oe=r.convert(_.format,_.colorSpace),xe=r.convert(_.type),$e=A(_.internalFormat,Oe,xe,_.colorSpace),F=_.isVideoTexture!==!0,Ee=ee.__version===void 0||j===!0,le=ne.dataReady;let we=D(_,Ae);Me(n.TEXTURE_CUBE_MAP,_);let fe;if(Be){F&&Ee&&t.texStorage2D(n.TEXTURE_CUBE_MAP,we,$e,Ae.width,Ae.height);for(let re=0;re<6;re++){fe=pe[re].mipmaps;for(let ve=0;ve<fe.length;ve++){const Ze=fe[ve];_.format!==Di?Oe!==null?F?le&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,ve,0,0,Ze.width,Ze.height,Oe,Ze.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,ve,$e,Ze.width,Ze.height,0,Ze.data):Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,ve,0,0,Ze.width,Ze.height,Oe,xe,Ze.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,ve,$e,Ze.width,Ze.height,0,Oe,xe,Ze.data)}}}else{if(fe=_.mipmaps,F&&Ee){fe.length>0&&we++;const re=De(pe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,we,$e,re.width,re.height)}for(let re=0;re<6;re++)if(oe){F?le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,pe[re].width,pe[re].height,Oe,xe,pe[re].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,$e,pe[re].width,pe[re].height,0,Oe,xe,pe[re].data);for(let ve=0;ve<fe.length;ve++){const Pt=fe[ve].image[re].image;F?le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,ve+1,0,0,Pt.width,Pt.height,Oe,xe,Pt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,ve+1,$e,Pt.width,Pt.height,0,Oe,xe,Pt.data)}}else{F?le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Oe,xe,pe[re]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,$e,Oe,xe,pe[re]);for(let ve=0;ve<fe.length;ve++){const Ze=fe[ve];F?le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,ve+1,0,0,Oe,xe,Ze.image[re]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,ve+1,$e,Oe,xe,Ze.image[re])}}}p(_)&&d(n.TEXTURE_CUBE_MAP),ee.__version=ne.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function Te(C,_,I,j,ne,ee){const Ne=r.convert(I.format,I.colorSpace),me=r.convert(I.type),Le=A(I.internalFormat,Ne,me,I.colorSpace),Be=i.get(_),oe=i.get(I);if(oe.__renderTarget=_,!Be.__hasExternalTextures){const pe=Math.max(1,_.width>>ee),Ae=Math.max(1,_.height>>ee);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,ee,Le,pe,Ae,_.depth,0,Ne,me,null):t.texImage2D(ne,ee,Le,pe,Ae,0,Ne,me,null)}t.bindFramebuffer(n.FRAMEBUFFER,C),Ct(_)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,ne,oe.__webglTexture,0,N(_)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,j,ne,oe.__webglTexture,ee),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ve(C,_,I){if(n.bindRenderbuffer(n.RENDERBUFFER,C),_.depthBuffer){const j=_.depthTexture,ne=j&&j.isDepthTexture?j.type:null,ee=b(_.stencilBuffer,ne),Ne=_.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Ct(_)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,N(_),ee,_.width,_.height):I?n.renderbufferStorageMultisample(n.RENDERBUFFER,N(_),ee,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,ee,_.width,_.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ne,n.RENDERBUFFER,C)}else{const j=_.textures;for(let ne=0;ne<j.length;ne++){const ee=j[ne],Ne=r.convert(ee.format,ee.colorSpace),me=r.convert(ee.type),Le=A(ee.internalFormat,Ne,me,ee.colorSpace);Ct(_)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,N(_),Le,_.width,_.height):I?n.renderbufferStorageMultisample(n.RENDERBUFFER,N(_),Le,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,Le,_.width,_.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function _e(C,_,I){const j=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,C),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ne=i.get(_.depthTexture);if(ne.__renderTarget=_,(!ne.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),j){if(ne.__webglInit===void 0&&(ne.__webglInit=!0,_.depthTexture.addEventListener("dispose",R)),ne.__webglTexture===void 0){ne.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,ne.__webglTexture),Me(n.TEXTURE_CUBE_MAP,_.depthTexture);const Be=r.convert(_.depthTexture.format),oe=r.convert(_.depthTexture.type);let pe;_.depthTexture.format===Ss?pe=n.DEPTH_COMPONENT24:_.depthTexture.format===fr&&(pe=n.DEPTH24_STENCIL8);for(let Ae=0;Ae<6;Ae++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,0,pe,_.width,_.height,0,Be,oe,null)}}else Y(_.depthTexture,0);const ee=ne.__webglTexture,Ne=N(_),me=j?n.TEXTURE_CUBE_MAP_POSITIVE_X+I:n.TEXTURE_2D,Le=_.depthTexture.format===fr?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(_.depthTexture.format===Ss)Ct(_)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Le,me,ee,0,Ne):n.framebufferTexture2D(n.FRAMEBUFFER,Le,me,ee,0);else if(_.depthTexture.format===fr)Ct(_)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Le,me,ee,0,Ne):n.framebufferTexture2D(n.FRAMEBUFFER,Le,me,ee,0);else throw new Error("Unknown depthTexture format")}function et(C){const _=i.get(C),I=C.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==C.depthTexture){const j=C.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),j){const ne=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,j.removeEventListener("dispose",ne)};j.addEventListener("dispose",ne),_.__depthDisposeCallback=ne}_.__boundDepthTexture=j}if(C.depthTexture&&!_.__autoAllocateDepthBuffer)if(I)for(let j=0;j<6;j++)_e(_.__webglFramebuffer[j],C,j);else{const j=C.texture.mipmaps;j&&j.length>0?_e(_.__webglFramebuffer[0],C,0):_e(_.__webglFramebuffer,C,0)}else if(I){_.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[j]),_.__webglDepthbuffer[j]===void 0)_.__webglDepthbuffer[j]=n.createRenderbuffer(),Ve(_.__webglDepthbuffer[j],C,!1);else{const ne=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ee=_.__webglDepthbuffer[j];n.bindRenderbuffer(n.RENDERBUFFER,ee),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,ee)}}else{const j=C.texture.mipmaps;if(j&&j.length>0?t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=n.createRenderbuffer(),Ve(_.__webglDepthbuffer,C,!1);else{const ne=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ee=_.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ee),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,ee)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Rt(C,_,I){const j=i.get(C);_!==void 0&&Te(j.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),I!==void 0&&et(C)}function Ye(C){const _=C.texture,I=i.get(C),j=i.get(_);C.addEventListener("dispose",U);const ne=C.textures,ee=C.isWebGLCubeRenderTarget===!0,Ne=ne.length>1;if(Ne||(j.__webglTexture===void 0&&(j.__webglTexture=n.createTexture()),j.__version=_.version,a.memory.textures++),ee){I.__webglFramebuffer=[];for(let me=0;me<6;me++)if(_.mipmaps&&_.mipmaps.length>0){I.__webglFramebuffer[me]=[];for(let Le=0;Le<_.mipmaps.length;Le++)I.__webglFramebuffer[me][Le]=n.createFramebuffer()}else I.__webglFramebuffer[me]=n.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){I.__webglFramebuffer=[];for(let me=0;me<_.mipmaps.length;me++)I.__webglFramebuffer[me]=n.createFramebuffer()}else I.__webglFramebuffer=n.createFramebuffer();if(Ne)for(let me=0,Le=ne.length;me<Le;me++){const Be=i.get(ne[me]);Be.__webglTexture===void 0&&(Be.__webglTexture=n.createTexture(),a.memory.textures++)}if(C.samples>0&&Ct(C)===!1){I.__webglMultisampledFramebuffer=n.createFramebuffer(),I.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,I.__webglMultisampledFramebuffer);for(let me=0;me<ne.length;me++){const Le=ne[me];I.__webglColorRenderbuffer[me]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,I.__webglColorRenderbuffer[me]);const Be=r.convert(Le.format,Le.colorSpace),oe=r.convert(Le.type),pe=A(Le.internalFormat,Be,oe,Le.colorSpace,C.isXRRenderTarget===!0),Ae=N(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ae,pe,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,I.__webglColorRenderbuffer[me])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(I.__webglDepthRenderbuffer=n.createRenderbuffer(),Ve(I.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ee){t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture),Me(n.TEXTURE_CUBE_MAP,_);for(let me=0;me<6;me++)if(_.mipmaps&&_.mipmaps.length>0)for(let Le=0;Le<_.mipmaps.length;Le++)Te(I.__webglFramebuffer[me][Le],C,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+me,Le);else Te(I.__webglFramebuffer[me],C,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0);p(_)&&d(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ne){for(let me=0,Le=ne.length;me<Le;me++){const Be=ne[me],oe=i.get(Be);let pe=n.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(pe=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(pe,oe.__webglTexture),Me(pe,Be),Te(I.__webglFramebuffer,C,Be,n.COLOR_ATTACHMENT0+me,pe,0),p(Be)&&d(pe)}t.unbindTexture()}else{let me=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(me=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(me,j.__webglTexture),Me(me,_),_.mipmaps&&_.mipmaps.length>0)for(let Le=0;Le<_.mipmaps.length;Le++)Te(I.__webglFramebuffer[Le],C,_,n.COLOR_ATTACHMENT0,me,Le);else Te(I.__webglFramebuffer,C,_,n.COLOR_ATTACHMENT0,me,0);p(_)&&d(me),t.unbindTexture()}C.depthBuffer&&et(C)}function at(C){const _=C.textures;for(let I=0,j=_.length;I<j;I++){const ne=_[I];if(p(ne)){const ee=y(C),Ne=i.get(ne).__webglTexture;t.bindTexture(ee,Ne),d(ee),t.unbindTexture()}}}const ht=[],qe=[];function Ft(C){if(C.samples>0){if(Ct(C)===!1){const _=C.textures,I=C.width,j=C.height;let ne=n.COLOR_BUFFER_BIT;const ee=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ne=i.get(C),me=_.length>1;if(me)for(let Be=0;Be<_.length;Be++)t.bindFramebuffer(n.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Be,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ne.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Be,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer);const Le=C.texture.mipmaps;Le&&Le.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer);for(let Be=0;Be<_.length;Be++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),me){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ne.__webglColorRenderbuffer[Be]);const oe=i.get(_[Be]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,oe,0)}n.blitFramebuffer(0,0,I,j,0,0,I,j,ne,n.NEAREST),l===!0&&(ht.length=0,qe.length=0,ht.push(n.COLOR_ATTACHMENT0+Be),C.depthBuffer&&C.resolveDepthBuffer===!1&&(ht.push(ee),qe.push(ee),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,qe)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ht))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),me)for(let Be=0;Be<_.length;Be++){t.bindFramebuffer(n.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Be,n.RENDERBUFFER,Ne.__webglColorRenderbuffer[Be]);const oe=i.get(_[Be]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ne.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Be,n.TEXTURE_2D,oe,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const _=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[_])}}}function N(C){return Math.min(s.maxSamples,C.samples)}function Ct(C){const _=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Ke(C){const _=a.render.frame;h.get(C)!==_&&(h.set(C,_),C.update())}function dt(C,_){const I=C.colorSpace,j=C.format,ne=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||I!==pa&&I!==Ns&&(pt.getTransfer(I)===At?(j!==Di||ne!==pi)&&Je("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ft("WebGLTextures: Unsupported texture color space:",I)),_}function De(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=H,this.setTexture2D=Y,this.setTexture2DArray=K,this.setTexture3D=V,this.setTextureCube=se,this.rebindTextures=Rt,this.setupRenderTarget=Ye,this.updateRenderTargetMipmap=at,this.updateMultisampleRenderTarget=Ft,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=Ct,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function oT(n,e){function t(i,s=Ns){let r;const a=pt.getTransfer(s);if(i===pi)return n.UNSIGNED_BYTE;if(i===Mh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Eh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===bm)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Am)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===ym)return n.BYTE;if(i===Tm)return n.SHORT;if(i===ro)return n.UNSIGNED_SHORT;if(i===Sh)return n.INT;if(i===Ji)return n.UNSIGNED_INT;if(i===Yi)return n.FLOAT;if(i===vs)return n.HALF_FLOAT;if(i===wm)return n.ALPHA;if(i===Rm)return n.RGB;if(i===Di)return n.RGBA;if(i===Ss)return n.DEPTH_COMPONENT;if(i===fr)return n.DEPTH_STENCIL;if(i===Cm)return n.RED;if(i===yh)return n.RED_INTEGER;if(i===da)return n.RG;if(i===Th)return n.RG_INTEGER;if(i===bh)return n.RGBA_INTEGER;if(i===el||i===tl||i===nl||i===il)if(a===At)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===el)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===tl)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===nl)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===il)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===el)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===tl)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===nl)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===il)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===fu||i===du||i===pu||i===mu)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===fu)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===du)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===pu)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===mu)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===gu||i===_u||i===xu||i===vu||i===Su||i===Mu||i===Eu)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===gu||i===_u)return a===At?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===xu)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===vu)return r.COMPRESSED_R11_EAC;if(i===Su)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Mu)return r.COMPRESSED_RG11_EAC;if(i===Eu)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===yu||i===Tu||i===bu||i===Au||i===wu||i===Ru||i===Cu||i===Pu||i===Du||i===Lu||i===Iu||i===Uu||i===Nu||i===Fu)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===yu)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Tu)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===bu)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Au)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===wu)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ru)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Cu)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Pu)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Du)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Lu)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Iu)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Uu)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Nu)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Fu)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ou||i===Bu||i===zu)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Ou)return a===At?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Bu)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===zu)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ku||i===Vu||i===Gu||i===Hu)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===ku)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Vu)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Gu)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Hu)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ao?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const lT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,cT=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class uT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Gm(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Qi({vertexShader:lT,fragmentShader:cT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ni(new Il(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class hT extends Sr{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,g=null,x=null;const M=typeof XRWebGLBinding<"u",p=new uT,d={},y=t.getContextAttributes();let A=null,b=null;const D=[],R=[],U=new Xe;let k=null;const S=new fi;S.viewport=new Jt;const T=new fi;T.viewport=new Jt;const L=[S,T],H=new vv;let B=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let te=D[Q];return te===void 0&&(te=new Ac,D[Q]=te),te.getTargetRaySpace()},this.getControllerGrip=function(Q){let te=D[Q];return te===void 0&&(te=new Ac,D[Q]=te),te.getGripSpace()},this.getHand=function(Q){let te=D[Q];return te===void 0&&(te=new Ac,D[Q]=te),te.getHandSpace()};function Y(Q){const te=R.indexOf(Q.inputSource);if(te===-1)return;const Te=D[te];Te!==void 0&&(Te.update(Q.inputSource,Q.frame,c||a),Te.dispatchEvent({type:Q.type,data:Q.inputSource}))}function K(){s.removeEventListener("select",Y),s.removeEventListener("selectstart",Y),s.removeEventListener("selectend",Y),s.removeEventListener("squeeze",Y),s.removeEventListener("squeezestart",Y),s.removeEventListener("squeezeend",Y),s.removeEventListener("end",K),s.removeEventListener("inputsourceschange",V);for(let Q=0;Q<D.length;Q++){const te=R[Q];te!==null&&(R[Q]=null,D[Q].disconnect(te))}B=null,X=null,p.reset();for(const Q in d)delete d[Q];e.setRenderTarget(A),g=null,f=null,u=null,s=null,b=null,nt.stop(),i.isPresenting=!1,e.setPixelRatio(k),e.setSize(U.width,U.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){r=Q,i.isPresenting===!0&&Je("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){o=Q,i.isPresenting===!0&&Je("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return f!==null?f:g},this.getBinding=function(){return u===null&&M&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(Q){if(s=Q,s!==null){if(A=e.getRenderTarget(),s.addEventListener("select",Y),s.addEventListener("selectstart",Y),s.addEventListener("selectend",Y),s.addEventListener("squeeze",Y),s.addEventListener("squeezestart",Y),s.addEventListener("squeezeend",Y),s.addEventListener("end",K),s.addEventListener("inputsourceschange",V),y.xrCompatible!==!0&&await t.makeXRCompatible(),k=e.getPixelRatio(),e.getSize(U),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let Te=null,Ve=null,_e=null;y.depth&&(_e=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Te=y.stencil?fr:Ss,Ve=y.stencil?ao:Ji);const et={colorFormat:t.RGBA8,depthFormat:_e,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(et),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),b=new Zi(f.textureWidth,f.textureHeight,{format:Di,type:pi,depthTexture:new co(f.textureWidth,f.textureHeight,Ve,void 0,void 0,void 0,void 0,void 0,void 0,Te),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const Te={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};g=new XRWebGLLayer(s,t,Te),s.updateRenderState({baseLayer:g}),e.setPixelRatio(1),e.setSize(g.framebufferWidth,g.framebufferHeight,!1),b=new Zi(g.framebufferWidth,g.framebufferHeight,{format:Di,type:pi,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),nt.setContext(s),nt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function V(Q){for(let te=0;te<Q.removed.length;te++){const Te=Q.removed[te],Ve=R.indexOf(Te);Ve>=0&&(R[Ve]=null,D[Ve].disconnect(Te))}for(let te=0;te<Q.added.length;te++){const Te=Q.added[te];let Ve=R.indexOf(Te);if(Ve===-1){for(let et=0;et<D.length;et++)if(et>=R.length){R.push(Te),Ve=et;break}else if(R[et]===null){R[et]=Te,Ve=et;break}if(Ve===-1)break}const _e=D[Ve];_e&&_e.connect(Te)}}const se=new W,de=new W;function ae(Q,te,Te){se.setFromMatrixPosition(te.matrixWorld),de.setFromMatrixPosition(Te.matrixWorld);const Ve=se.distanceTo(de),_e=te.projectionMatrix.elements,et=Te.projectionMatrix.elements,Rt=_e[14]/(_e[10]-1),Ye=_e[14]/(_e[10]+1),at=(_e[9]+1)/_e[5],ht=(_e[9]-1)/_e[5],qe=(_e[8]-1)/_e[0],Ft=(et[8]+1)/et[0],N=Rt*qe,Ct=Rt*Ft,Ke=Ve/(-qe+Ft),dt=Ke*-qe;if(te.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(dt),Q.translateZ(Ke),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),_e[10]===-1)Q.projectionMatrix.copy(te.projectionMatrix),Q.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{const De=Rt+Ke,C=Ye+Ke,_=N-dt,I=Ct+(Ve-dt),j=at*Ye/C*De,ne=ht*Ye/C*De;Q.projectionMatrix.makePerspective(_,I,j,ne,De,C),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function ue(Q,te){te===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(te.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(s===null)return;let te=Q.near,Te=Q.far;p.texture!==null&&(p.depthNear>0&&(te=p.depthNear),p.depthFar>0&&(Te=p.depthFar)),H.near=T.near=S.near=te,H.far=T.far=S.far=Te,(B!==H.near||X!==H.far)&&(s.updateRenderState({depthNear:H.near,depthFar:H.far}),B=H.near,X=H.far),H.layers.mask=Q.layers.mask|6,S.layers.mask=H.layers.mask&3,T.layers.mask=H.layers.mask&5;const Ve=Q.parent,_e=H.cameras;ue(H,Ve);for(let et=0;et<_e.length;et++)ue(_e[et],Ve);_e.length===2?ae(H,S,T):H.projectionMatrix.copy(S.projectionMatrix),Me(Q,H,Ve)};function Me(Q,te,Te){Te===null?Q.matrix.copy(te.matrixWorld):(Q.matrix.copy(Te.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(te.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(te.projectionMatrix),Q.projectionMatrixInverse.copy(te.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Xu*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return H},this.getFoveation=function(){if(!(f===null&&g===null))return l},this.setFoveation=function(Q){l=Q,f!==null&&(f.fixedFoveation=Q),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=Q)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(H)},this.getCameraTexture=function(Q){return d[Q]};let he=null;function Qe(Q,te){if(h=te.getViewerPose(c||a),x=te,h!==null){const Te=h.views;g!==null&&(e.setRenderTargetFramebuffer(b,g.framebuffer),e.setRenderTarget(b));let Ve=!1;Te.length!==H.cameras.length&&(H.cameras.length=0,Ve=!0);for(let Ye=0;Ye<Te.length;Ye++){const at=Te[Ye];let ht=null;if(g!==null)ht=g.getViewport(at);else{const Ft=u.getViewSubImage(f,at);ht=Ft.viewport,Ye===0&&(e.setRenderTargetTextures(b,Ft.colorTexture,Ft.depthStencilTexture),e.setRenderTarget(b))}let qe=L[Ye];qe===void 0&&(qe=new fi,qe.layers.enable(Ye),qe.viewport=new Jt,L[Ye]=qe),qe.matrix.fromArray(at.transform.matrix),qe.matrix.decompose(qe.position,qe.quaternion,qe.scale),qe.projectionMatrix.fromArray(at.projectionMatrix),qe.projectionMatrixInverse.copy(qe.projectionMatrix).invert(),qe.viewport.set(ht.x,ht.y,ht.width,ht.height),Ye===0&&(H.matrix.copy(qe.matrix),H.matrix.decompose(H.position,H.quaternion,H.scale)),Ve===!0&&H.cameras.push(qe)}const _e=s.enabledFeatures;if(_e&&_e.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){u=i.getBinding();const Ye=u.getDepthInformation(Te[0]);Ye&&Ye.isValid&&Ye.texture&&p.init(Ye,s.renderState)}if(_e&&_e.includes("camera-access")&&M){e.state.unbindTexture(),u=i.getBinding();for(let Ye=0;Ye<Te.length;Ye++){const at=Te[Ye].camera;if(at){let ht=d[at];ht||(ht=new Gm,d[at]=ht);const qe=u.getCameraImage(at);ht.sourceTexture=qe}}}}for(let Te=0;Te<D.length;Te++){const Ve=R[Te],_e=D[Te];Ve!==null&&_e!==void 0&&_e.update(Ve,te,c||a)}he&&he(Q,te),te.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:te}),x=null}const nt=new Wm;nt.setAnimationLoop(Qe),this.setAnimationLoop=function(Q){he=Q},this.dispose=function(){}}}const er=new Ms,fT=new Zt;function dT(n,e){function t(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function i(p,d){d.color.getRGB(p.fogColor.value,Nm(n)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function s(p,d,y,A,b){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(p,d):d.isMeshToonMaterial?(r(p,d),u(p,d)):d.isMeshPhongMaterial?(r(p,d),h(p,d)):d.isMeshStandardMaterial?(r(p,d),f(p,d),d.isMeshPhysicalMaterial&&g(p,d,b)):d.isMeshMatcapMaterial?(r(p,d),x(p,d)):d.isMeshDepthMaterial?r(p,d):d.isMeshDistanceMaterial?(r(p,d),M(p,d)):d.isMeshNormalMaterial?r(p,d):d.isLineBasicMaterial?(a(p,d),d.isLineDashedMaterial&&o(p,d)):d.isPointsMaterial?l(p,d,y,A):d.isSpriteMaterial?c(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,t(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===Hn&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,t(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===Hn&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,t(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,t(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const y=e.get(d),A=y.envMap,b=y.envMapRotation;A&&(p.envMap.value=A,er.copy(b),er.x*=-1,er.y*=-1,er.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(er.y*=-1,er.z*=-1),p.envMapRotation.value.setFromMatrix4(fT.makeRotationFromEuler(er)),p.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap&&(p.lightMap.value=d.lightMap,p.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,p.lightMapTransform)),d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,p.aoMapTransform))}function a(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform))}function o(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function l(p,d,y,A){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*y,p.scale.value=A*.5,d.map&&(p.map.value=d.map,t(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function c(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function h(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function u(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function f(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,p.roughnessMapTransform)),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function g(p,d,y){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Hn&&p.clearcoatNormalScale.value.negate())),d.dispersion>0&&(p.dispersion.value=d.dispersion),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,p.specularIntensityMapTransform))}function x(p,d){d.matcap&&(p.matcap.value=d.matcap)}function M(p,d){const y=e.get(d).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function pT(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,A){const b=A.program;i.uniformBlockBinding(y,b)}function c(y,A){let b=s[y.id];b===void 0&&(x(y),b=h(y),s[y.id]=b,y.addEventListener("dispose",p));const D=A.program;i.updateUBOMapping(y,D);const R=e.render.frame;r[y.id]!==R&&(f(y),r[y.id]=R)}function h(y){const A=u();y.__bindingPointIndex=A;const b=n.createBuffer(),D=y.__size,R=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,D,R),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,A,b),b}function u(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return ft("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){const A=s[y.id],b=y.uniforms,D=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,A);for(let R=0,U=b.length;R<U;R++){const k=Array.isArray(b[R])?b[R]:[b[R]];for(let S=0,T=k.length;S<T;S++){const L=k[S];if(g(L,R,S,D)===!0){const H=L.__offset,B=Array.isArray(L.value)?L.value:[L.value];let X=0;for(let Y=0;Y<B.length;Y++){const K=B[Y],V=M(K);typeof K=="number"||typeof K=="boolean"?(L.__data[0]=K,n.bufferSubData(n.UNIFORM_BUFFER,H+X,L.__data)):K.isMatrix3?(L.__data[0]=K.elements[0],L.__data[1]=K.elements[1],L.__data[2]=K.elements[2],L.__data[3]=0,L.__data[4]=K.elements[3],L.__data[5]=K.elements[4],L.__data[6]=K.elements[5],L.__data[7]=0,L.__data[8]=K.elements[6],L.__data[9]=K.elements[7],L.__data[10]=K.elements[8],L.__data[11]=0):(K.toArray(L.__data,X),X+=V.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,H,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function g(y,A,b,D){const R=y.value,U=A+"_"+b;if(D[U]===void 0)return typeof R=="number"||typeof R=="boolean"?D[U]=R:D[U]=R.clone(),!0;{const k=D[U];if(typeof R=="number"||typeof R=="boolean"){if(k!==R)return D[U]=R,!0}else if(k.equals(R)===!1)return k.copy(R),!0}return!1}function x(y){const A=y.uniforms;let b=0;const D=16;for(let U=0,k=A.length;U<k;U++){const S=Array.isArray(A[U])?A[U]:[A[U]];for(let T=0,L=S.length;T<L;T++){const H=S[T],B=Array.isArray(H.value)?H.value:[H.value];for(let X=0,Y=B.length;X<Y;X++){const K=B[X],V=M(K),se=b%D,de=se%V.boundary,ae=se+de;b+=de,ae!==0&&D-ae<V.storage&&(b+=D-ae),H.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=b,b+=V.storage}}}const R=b%D;return R>0&&(b+=D-R),y.__size=b,y.__cache={},this}function M(y){const A={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(A.boundary=4,A.storage=4):y.isVector2?(A.boundary=8,A.storage=8):y.isVector3||y.isColor?(A.boundary=16,A.storage=12):y.isVector4?(A.boundary=16,A.storage=16):y.isMatrix3?(A.boundary=48,A.storage=48):y.isMatrix4?(A.boundary=64,A.storage=64):y.isTexture?Je("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Je("WebGLRenderer: Unsupported uniform value type.",y),A}function p(y){const A=y.target;A.removeEventListener("dispose",p);const b=a.indexOf(A.__bindingPointIndex);a.splice(b,1),n.deleteBuffer(s[A.id]),delete s[A.id],delete r[A.id]}function d(){for(const y in s)n.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}const mT=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Vi=null;function gT(){return Vi===null&&(Vi=new hv(mT,16,16,da,vs),Vi.name="DFG_LUT",Vi.minFilter=on,Vi.magFilter=on,Vi.wrapS=ps,Vi.wrapT=ps,Vi.generateMipmaps=!1,Vi.needsUpdate=!0),Vi}class _T{constructor(e={}){const{canvas:t=Fx(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1,outputBufferType:g=pi}=e;this.isWebGLRenderer=!0;let x;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");x=i.getContextAttributes().alpha}else x=a;const M=g,p=new Set([bh,Th,yh]),d=new Set([pi,Ji,ro,ao,Mh,Eh]),y=new Uint32Array(4),A=new Int32Array(4);let b=null,D=null;const R=[],U=[];let k=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=$i,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const S=this;let T=!1;this._outputColorSpace=hi;let L=0,H=0,B=null,X=-1,Y=null;const K=new Jt,V=new Jt;let se=null;const de=new wt(0);let ae=0,ue=t.width,Me=t.height,he=1,Qe=null,nt=null;const Q=new Jt(0,0,ue,Me),te=new Jt(0,0,ue,Me);let Te=!1;const Ve=new km;let _e=!1,et=!1;const Rt=new Zt,Ye=new W,at=new Jt,ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let qe=!1;function Ft(){return B===null?he:1}let N=i;function Ct(E,G){return t.getContext(E,G)}try{const E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${vh}`),t.addEventListener("webglcontextlost",Ze,!1),t.addEventListener("webglcontextrestored",Pt,!1),t.addEventListener("webglcontextcreationerror",xt,!1),N===null){const G="webgl2";if(N=Ct(G,E),N===null)throw Ct(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw ft("WebGLRenderer: "+E.message),E}let Ke,dt,De,C,_,I,j,ne,ee,Ne,me,Le,Be,oe,pe,Ae,Oe,xe,$e,F,Ee,le,we,fe;function re(){Ke=new gE(N),Ke.init(),le=new oT(N,Ke),dt=new oE(N,Ke,e,le),De=new rT(N,Ke),dt.reversedDepthBuffer&&f&&De.buffers.depth.setReversed(!0),C=new vE(N),_=new Wy,I=new aT(N,Ke,De,_,dt,le,C),j=new cE(S),ne=new mE(S),ee=new yv(N),we=new rE(N,ee),Ne=new _E(N,ee,C,we),me=new ME(N,Ne,ee,C),$e=new SE(N,dt,I),Ae=new lE(_),Le=new Hy(S,j,ne,Ke,dt,we,Ae),Be=new dT(S,_),oe=new Yy,pe=new Jy(Ke),xe=new sE(S,j,ne,De,me,x,l),Oe=new iT(S,me,dt),fe=new pT(N,C,dt,De),F=new aE(N,Ke,C),Ee=new xE(N,Ke,C),C.programs=Le.programs,S.capabilities=dt,S.extensions=Ke,S.properties=_,S.renderLists=oe,S.shadowMap=Oe,S.state=De,S.info=C}re(),M!==pi&&(k=new yE(M,t.width,t.height,s,r));const ve=new hT(S,N);this.xr=ve,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const E=Ke.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Ke.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return he},this.setPixelRatio=function(E){E!==void 0&&(he=E,this.setSize(ue,Me,!1))},this.getSize=function(E){return E.set(ue,Me)},this.setSize=function(E,G,J=!0){if(ve.isPresenting){Je("WebGLRenderer: Can't change size while VR device is presenting.");return}ue=E,Me=G,t.width=Math.floor(E*he),t.height=Math.floor(G*he),J===!0&&(t.style.width=E+"px",t.style.height=G+"px"),k!==null&&k.setSize(t.width,t.height),this.setViewport(0,0,E,G)},this.getDrawingBufferSize=function(E){return E.set(ue*he,Me*he).floor()},this.setDrawingBufferSize=function(E,G,J){ue=E,Me=G,he=J,t.width=Math.floor(E*J),t.height=Math.floor(G*J),this.setViewport(0,0,E,G)},this.setEffects=function(E){if(M===pi){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let G=0;G<E.length;G++)if(E[G].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}k.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(K)},this.getViewport=function(E){return E.copy(Q)},this.setViewport=function(E,G,J,Z){E.isVector4?Q.set(E.x,E.y,E.z,E.w):Q.set(E,G,J,Z),De.viewport(K.copy(Q).multiplyScalar(he).round())},this.getScissor=function(E){return E.copy(te)},this.setScissor=function(E,G,J,Z){E.isVector4?te.set(E.x,E.y,E.z,E.w):te.set(E,G,J,Z),De.scissor(V.copy(te).multiplyScalar(he).round())},this.getScissorTest=function(){return Te},this.setScissorTest=function(E){De.setScissorTest(Te=E)},this.setOpaqueSort=function(E){Qe=E},this.setTransparentSort=function(E){nt=E},this.getClearColor=function(E){return E.copy(xe.getClearColor())},this.setClearColor=function(){xe.setClearColor(...arguments)},this.getClearAlpha=function(){return xe.getClearAlpha()},this.setClearAlpha=function(){xe.setClearAlpha(...arguments)},this.clear=function(E=!0,G=!0,J=!0){let Z=0;if(E){let q=!1;if(B!==null){const Se=B.texture.format;q=p.has(Se)}if(q){const Se=B.texture.type,Ce=d.has(Se),ye=xe.getClearColor(),Ie=xe.getClearAlpha(),ze=ye.r,He=ye.g,Ue=ye.b;Ce?(y[0]=ze,y[1]=He,y[2]=Ue,y[3]=Ie,N.clearBufferuiv(N.COLOR,0,y)):(A[0]=ze,A[1]=He,A[2]=Ue,A[3]=Ie,N.clearBufferiv(N.COLOR,0,A))}else Z|=N.COLOR_BUFFER_BIT}G&&(Z|=N.DEPTH_BUFFER_BIT),J&&(Z|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Ze,!1),t.removeEventListener("webglcontextrestored",Pt,!1),t.removeEventListener("webglcontextcreationerror",xt,!1),xe.dispose(),oe.dispose(),pe.dispose(),_.dispose(),j.dispose(),ne.dispose(),me.dispose(),we.dispose(),fe.dispose(),Le.dispose(),ve.dispose(),ve.removeEventListener("sessionstart",ts),ve.removeEventListener("sessionend",ns),Ui.stop()};function Ze(E){E.preventDefault(),dl("WebGLRenderer: Context Lost."),T=!0}function Pt(){dl("WebGLRenderer: Context Restored."),T=!1;const E=C.autoReset,G=Oe.enabled,J=Oe.autoUpdate,Z=Oe.needsUpdate,q=Oe.type;re(),C.autoReset=E,Oe.enabled=G,Oe.autoUpdate=J,Oe.needsUpdate=Z,Oe.type=q}function xt(E){ft("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function _n(E){const G=E.target;G.removeEventListener("dispose",_n),Ot(G)}function Ot(E){si(E),_.remove(E)}function si(E){const G=_.get(E).programs;G!==void 0&&(G.forEach(function(J){Le.releaseProgram(J)}),E.isShaderMaterial&&Le.releaseShaderCache(E))}this.renderBufferDirect=function(E,G,J,Z,q,Se){G===null&&(G=ht);const Ce=q.isMesh&&q.matrixWorld.determinant()<0,ye=ln(E,G,J,Z,q);De.setMaterial(Z,Ce);let Ie=J.index,ze=1;if(Z.wireframe===!0){if(Ie=Ne.getWireframeAttribute(J),Ie===void 0)return;ze=2}const He=J.drawRange,Ue=J.attributes.position;let it=He.start*ze,vt=(He.start+He.count)*ze;Se!==null&&(it=Math.max(it,Se.start*ze),vt=Math.min(vt,(Se.start+Se.count)*ze)),Ie!==null?(it=Math.max(it,0),vt=Math.min(vt,Ie.count)):Ue!=null&&(it=Math.max(it,0),vt=Math.min(vt,Ue.count));const Bt=vt-it;if(Bt<0||Bt===1/0)return;we.setup(q,Z,ye,J,Ie);let zt,bt=F;if(Ie!==null&&(zt=ee.get(Ie),bt=Ee,bt.setIndex(zt)),q.isMesh)Z.wireframe===!0?(De.setLineWidth(Z.wireframeLinewidth*Ft()),bt.setMode(N.LINES)):bt.setMode(N.TRIANGLES);else if(q.isLine){let Ge=Z.linewidth;Ge===void 0&&(Ge=1),De.setLineWidth(Ge*Ft()),q.isLineSegments?bt.setMode(N.LINES):q.isLineLoop?bt.setMode(N.LINE_LOOP):bt.setMode(N.LINE_STRIP)}else q.isPoints?bt.setMode(N.POINTS):q.isSprite&&bt.setMode(N.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)oo("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),bt.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(Ke.get("WEBGL_multi_draw"))bt.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const Ge=q._multiDrawStarts,St=q._multiDrawCounts,ut=q._multiDrawCount,wn=Ie?ee.get(Ie).bytesPerElement:1,Es=_.get(Z).currentProgram.getUniforms();for(let Rn=0;Rn<ut;Rn++)Es.setValue(N,"_gl_DrawID",Rn),bt.render(Ge[Rn]/wn,St[Rn])}else if(q.isInstancedMesh)bt.renderInstances(it,Bt,q.count);else if(J.isInstancedBufferGeometry){const Ge=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,St=Math.min(J.instanceCount,Ge);bt.renderInstances(it,Bt,St)}else bt.render(it,Bt)};function es(E,G,J){E.transparent===!0&&E.side===Wi&&E.forceSinglePass===!1?(E.side=Hn,E.needsUpdate=!0,Ni(E,G,J),E.side=Ws,E.needsUpdate=!0,Ni(E,G,J),E.side=Wi):Ni(E,G,J)}this.compile=function(E,G,J=null){J===null&&(J=E),D=pe.get(J),D.init(G),U.push(D),J.traverseVisible(function(q){q.isLight&&q.layers.test(G.layers)&&(D.pushLight(q),q.castShadow&&D.pushShadow(q))}),E!==J&&E.traverseVisible(function(q){q.isLight&&q.layers.test(G.layers)&&(D.pushLight(q),q.castShadow&&D.pushShadow(q))}),D.setupLights();const Z=new Set;return E.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const Se=q.material;if(Se)if(Array.isArray(Se))for(let Ce=0;Ce<Se.length;Ce++){const ye=Se[Ce];es(ye,J,q),Z.add(ye)}else es(Se,J,q),Z.add(Se)}),D=U.pop(),Z},this.compileAsync=function(E,G,J=null){const Z=this.compile(E,G,J);return new Promise(q=>{function Se(){if(Z.forEach(function(Ce){_.get(Ce).currentProgram.isReady()&&Z.delete(Ce)}),Z.size===0){q(E);return}setTimeout(Se,10)}Ke.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let Ii=null;function zn(E){Ii&&Ii(E)}function ts(){Ui.stop()}function ns(){Ui.start()}const Ui=new Wm;Ui.setAnimationLoop(zn),typeof self<"u"&&Ui.setContext(self),this.setAnimationLoop=function(E){Ii=E,ve.setAnimationLoop(E),E===null?Ui.stop():Ui.start()},ve.addEventListener("sessionstart",ts),ve.addEventListener("sessionend",ns),this.render=function(E,G){if(G!==void 0&&G.isCamera!==!0){ft("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;const J=ve.enabled===!0&&ve.isPresenting===!0,Z=k!==null&&(B===null||J)&&k.begin(S,B);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),ve.enabled===!0&&ve.isPresenting===!0&&(k===null||k.isCompositing()===!1)&&(ve.cameraAutoUpdate===!0&&ve.updateCamera(G),G=ve.getCamera()),E.isScene===!0&&E.onBeforeRender(S,E,G,B),D=pe.get(E,U.length),D.init(G),U.push(D),Rt.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),Ve.setFromProjectionMatrix(Rt,qi,G.reversedDepth),et=this.localClippingEnabled,_e=Ae.init(this.clippingPlanes,et),b=oe.get(E,R.length),b.init(),R.push(b),ve.enabled===!0&&ve.isPresenting===!0){const Ce=S.xr.getDepthSensingMesh();Ce!==null&&Mr(Ce,G,-1/0,S.sortObjects)}Mr(E,G,0,S.sortObjects),b.finish(),S.sortObjects===!0&&b.sort(Qe,nt),qe=ve.enabled===!1||ve.isPresenting===!1||ve.hasDepthSensing()===!1,qe&&xe.addToRenderList(b,E),this.info.render.frame++,_e===!0&&Ae.beginShadows();const q=D.state.shadowsArray;if(Oe.render(q,E,G),_e===!0&&Ae.endShadows(),this.info.autoReset===!0&&this.info.reset(),(Z&&k.hasRenderPass())===!1){const Ce=b.opaque,ye=b.transmissive;if(D.setupLights(),G.isArrayCamera){const Ie=G.cameras;if(ye.length>0)for(let ze=0,He=Ie.length;ze<He;ze++){const Ue=Ie[ze];xo(Ce,ye,E,Ue)}qe&&xe.render(E);for(let ze=0,He=Ie.length;ze<He;ze++){const Ue=Ie[ze];_o(b,E,Ue,Ue.viewport)}}else ye.length>0&&xo(Ce,ye,E,G),qe&&xe.render(E),_o(b,E,G)}B!==null&&H===0&&(I.updateMultisampleRenderTarget(B),I.updateRenderTargetMipmap(B)),Z&&k.end(S),E.isScene===!0&&E.onAfterRender(S,E,G),we.resetDefaultState(),X=-1,Y=null,U.pop(),U.length>0?(D=U[U.length-1],_e===!0&&Ae.setGlobalState(S.clippingPlanes,D.state.camera)):D=null,R.pop(),R.length>0?b=R[R.length-1]:b=null};function Mr(E,G,J,Z){if(E.visible===!1)return;if(E.layers.test(G.layers)){if(E.isGroup)J=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(G);else if(E.isLight)D.pushLight(E),E.castShadow&&D.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Ve.intersectsSprite(E)){Z&&at.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Rt);const Ce=me.update(E),ye=E.material;ye.visible&&b.push(E,Ce,ye,J,at.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Ve.intersectsObject(E))){const Ce=me.update(E),ye=E.material;if(Z&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),at.copy(E.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),at.copy(Ce.boundingSphere.center)),at.applyMatrix4(E.matrixWorld).applyMatrix4(Rt)),Array.isArray(ye)){const Ie=Ce.groups;for(let ze=0,He=Ie.length;ze<He;ze++){const Ue=Ie[ze],it=ye[Ue.materialIndex];it&&it.visible&&b.push(E,Ce,it,J,at.z,Ue)}}else ye.visible&&b.push(E,Ce,ye,J,at.z,null)}}const Se=E.children;for(let Ce=0,ye=Se.length;Ce<ye;Ce++)Mr(Se[Ce],G,J,Z)}function _o(E,G,J,Z){const{opaque:q,transmissive:Se,transparent:Ce}=E;D.setupLightsView(J),_e===!0&&Ae.setGlobalState(S.clippingPlanes,J),Z&&De.viewport(K.copy(Z)),q.length>0&&ri(q,G,J),Se.length>0&&ri(Se,G,J),Ce.length>0&&ri(Ce,G,J),De.buffers.depth.setTest(!0),De.buffers.depth.setMask(!0),De.buffers.color.setMask(!0),De.setPolygonOffset(!1)}function xo(E,G,J,Z){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;if(D.state.transmissionRenderTarget[Z.id]===void 0){const it=Ke.has("EXT_color_buffer_half_float")||Ke.has("EXT_color_buffer_float");D.state.transmissionRenderTarget[Z.id]=new Zi(1,1,{generateMipmaps:!0,type:it?vs:pi,minFilter:hr,samples:dt.samples,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:pt.workingColorSpace})}const Se=D.state.transmissionRenderTarget[Z.id],Ce=Z.viewport||K;Se.setSize(Ce.z*S.transmissionResolutionScale,Ce.w*S.transmissionResolutionScale);const ye=S.getRenderTarget(),Ie=S.getActiveCubeFace(),ze=S.getActiveMipmapLevel();S.setRenderTarget(Se),S.getClearColor(de),ae=S.getClearAlpha(),ae<1&&S.setClearColor(16777215,.5),S.clear(),qe&&xe.render(J);const He=S.toneMapping;S.toneMapping=$i;const Ue=Z.viewport;if(Z.viewport!==void 0&&(Z.viewport=void 0),D.setupLightsView(Z),_e===!0&&Ae.setGlobalState(S.clippingPlanes,Z),ri(E,J,Z),I.updateMultisampleRenderTarget(Se),I.updateRenderTargetMipmap(Se),Ke.has("WEBGL_multisampled_render_to_texture")===!1){let it=!1;for(let vt=0,Bt=G.length;vt<Bt;vt++){const zt=G[vt],{object:bt,geometry:Ge,material:St,group:ut}=zt;if(St.side===Wi&&bt.layers.test(Z.layers)){const wn=St.side;St.side=Hn,St.needsUpdate=!0,vo(bt,J,Z,Ge,St,ut),St.side=wn,St.needsUpdate=!0,it=!0}}it===!0&&(I.updateMultisampleRenderTarget(Se),I.updateRenderTargetMipmap(Se))}S.setRenderTarget(ye,Ie,ze),S.setClearColor(de,ae),Ue!==void 0&&(Z.viewport=Ue),S.toneMapping=He}function ri(E,G,J){const Z=G.isScene===!0?G.overrideMaterial:null;for(let q=0,Se=E.length;q<Se;q++){const Ce=E[q],{object:ye,geometry:Ie,group:ze}=Ce;let He=Ce.material;He.allowOverride===!0&&Z!==null&&(He=Z),ye.layers.test(J.layers)&&vo(ye,G,J,Ie,He,ze)}}function vo(E,G,J,Z,q,Se){E.onBeforeRender(S,G,J,Z,q,Se),E.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),q.onBeforeRender(S,G,J,Z,E,Se),q.transparent===!0&&q.side===Wi&&q.forceSinglePass===!1?(q.side=Hn,q.needsUpdate=!0,S.renderBufferDirect(J,G,Z,q,E,Se),q.side=Ws,q.needsUpdate=!0,S.renderBufferDirect(J,G,Z,q,E,Se),q.side=Wi):S.renderBufferDirect(J,G,Z,q,E,Se),E.onAfterRender(S,G,J,Z,q,Se)}function Ni(E,G,J){G.isScene!==!0&&(G=ht);const Z=_.get(E),q=D.state.lights,Se=D.state.shadowsArray,Ce=q.state.version,ye=Le.getParameters(E,q.state,Se,G,J),Ie=Le.getProgramCacheKey(ye);let ze=Z.programs;Z.environment=E.isMeshStandardMaterial?G.environment:null,Z.fog=G.fog,Z.envMap=(E.isMeshStandardMaterial?ne:j).get(E.envMap||Z.environment),Z.envMapRotation=Z.environment!==null&&E.envMap===null?G.environmentRotation:E.envMapRotation,ze===void 0&&(E.addEventListener("dispose",_n),ze=new Map,Z.programs=ze);let He=ze.get(Ie);if(He!==void 0){if(Z.currentProgram===He&&Z.lightsStateVersion===Ce)return vi(E,ye),He}else ye.uniforms=Le.getUniforms(E),E.onBeforeCompile(ye,S),He=Le.acquireProgram(ye,Ie),ze.set(Ie,He),Z.uniforms=ye.uniforms;const Ue=Z.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ue.clippingPlanes=Ae.uniform),vi(E,ye),Z.needsLights=tn(E),Z.lightsStateVersion=Ce,Z.needsLights&&(Ue.ambientLightColor.value=q.state.ambient,Ue.lightProbe.value=q.state.probe,Ue.directionalLights.value=q.state.directional,Ue.directionalLightShadows.value=q.state.directionalShadow,Ue.spotLights.value=q.state.spot,Ue.spotLightShadows.value=q.state.spotShadow,Ue.rectAreaLights.value=q.state.rectArea,Ue.ltc_1.value=q.state.rectAreaLTC1,Ue.ltc_2.value=q.state.rectAreaLTC2,Ue.pointLights.value=q.state.point,Ue.pointLightShadows.value=q.state.pointShadow,Ue.hemisphereLights.value=q.state.hemi,Ue.directionalShadowMap.value=q.state.directionalShadowMap,Ue.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Ue.spotShadowMap.value=q.state.spotShadowMap,Ue.spotLightMatrix.value=q.state.spotLightMatrix,Ue.spotLightMap.value=q.state.spotLightMap,Ue.pointShadowMap.value=q.state.pointShadowMap,Ue.pointShadowMatrix.value=q.state.pointShadowMatrix),Z.currentProgram=He,Z.uniformsList=null,He}function Ea(E){if(E.uniformsList===null){const G=E.currentProgram.getUniforms();E.uniformsList=rl.seqWithValue(G.seq,E.uniforms)}return E.uniformsList}function vi(E,G){const J=_.get(E);J.outputColorSpace=G.outputColorSpace,J.batching=G.batching,J.batchingColor=G.batchingColor,J.instancing=G.instancing,J.instancingColor=G.instancingColor,J.instancingMorph=G.instancingMorph,J.skinning=G.skinning,J.morphTargets=G.morphTargets,J.morphNormals=G.morphNormals,J.morphColors=G.morphColors,J.morphTargetsCount=G.morphTargetsCount,J.numClippingPlanes=G.numClippingPlanes,J.numIntersection=G.numClipIntersection,J.vertexAlphas=G.vertexAlphas,J.vertexTangents=G.vertexTangents,J.toneMapping=G.toneMapping}function ln(E,G,J,Z,q){G.isScene!==!0&&(G=ht),I.resetTextureUnits();const Se=G.fog,Ce=Z.isMeshStandardMaterial?G.environment:null,ye=B===null?S.outputColorSpace:B.isXRRenderTarget===!0?B.texture.colorSpace:pa,Ie=(Z.isMeshStandardMaterial?ne:j).get(Z.envMap||Ce),ze=Z.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,He=!!J.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),Ue=!!J.morphAttributes.position,it=!!J.morphAttributes.normal,vt=!!J.morphAttributes.color;let Bt=$i;Z.toneMapped&&(B===null||B.isXRRenderTarget===!0)&&(Bt=S.toneMapping);const zt=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,bt=zt!==void 0?zt.length:0,Ge=_.get(Z),St=D.state.lights;if(_e===!0&&(et===!0||E!==Y)){const un=E===Y&&Z.id===X;Ae.setState(Z,E,un)}let ut=!1;Z.version===Ge.__version?(Ge.needsLights&&Ge.lightsStateVersion!==St.state.version||Ge.outputColorSpace!==ye||q.isBatchedMesh&&Ge.batching===!1||!q.isBatchedMesh&&Ge.batching===!0||q.isBatchedMesh&&Ge.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&Ge.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&Ge.instancing===!1||!q.isInstancedMesh&&Ge.instancing===!0||q.isSkinnedMesh&&Ge.skinning===!1||!q.isSkinnedMesh&&Ge.skinning===!0||q.isInstancedMesh&&Ge.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Ge.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Ge.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Ge.instancingMorph===!1&&q.morphTexture!==null||Ge.envMap!==Ie||Z.fog===!0&&Ge.fog!==Se||Ge.numClippingPlanes!==void 0&&(Ge.numClippingPlanes!==Ae.numPlanes||Ge.numIntersection!==Ae.numIntersection)||Ge.vertexAlphas!==ze||Ge.vertexTangents!==He||Ge.morphTargets!==Ue||Ge.morphNormals!==it||Ge.morphColors!==vt||Ge.toneMapping!==Bt||Ge.morphTargetsCount!==bt)&&(ut=!0):(ut=!0,Ge.__version=Z.version);let wn=Ge.currentProgram;ut===!0&&(wn=Ni(Z,G,q));let Es=!1,Rn=!1,is=!1;const Mt=wn.getUniforms(),cn=Ge.uniforms;if(De.useProgram(wn.program)&&(Es=!0,Rn=!0,is=!0),Z.id!==X&&(X=Z.id,Rn=!0),Es||Y!==E){De.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),Mt.setValue(N,"projectionMatrix",E.projectionMatrix),Mt.setValue(N,"viewMatrix",E.matrixWorldInverse);const Cn=Mt.map.cameraPosition;Cn!==void 0&&Cn.setValue(N,Ye.setFromMatrixPosition(E.matrixWorld)),dt.logarithmicDepthBuffer&&Mt.setValue(N,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&Mt.setValue(N,"isOrthographic",E.isOrthographicCamera===!0),Y!==E&&(Y=E,Rn=!0,is=!0)}if(Ge.needsLights&&(St.state.directionalShadowMap.length>0&&Mt.setValue(N,"directionalShadowMap",St.state.directionalShadowMap,I),St.state.spotShadowMap.length>0&&Mt.setValue(N,"spotShadowMap",St.state.spotShadowMap,I),St.state.pointShadowMap.length>0&&Mt.setValue(N,"pointShadowMap",St.state.pointShadowMap,I)),q.isSkinnedMesh){Mt.setOptional(N,q,"bindMatrix"),Mt.setOptional(N,q,"bindMatrixInverse");const un=q.skeleton;un&&(un.boneTexture===null&&un.computeBoneTexture(),Mt.setValue(N,"boneTexture",un.boneTexture,I))}q.isBatchedMesh&&(Mt.setOptional(N,q,"batchingTexture"),Mt.setValue(N,"batchingTexture",q._matricesTexture,I),Mt.setOptional(N,q,"batchingIdTexture"),Mt.setValue(N,"batchingIdTexture",q._indirectTexture,I),Mt.setOptional(N,q,"batchingColorTexture"),q._colorsTexture!==null&&Mt.setValue(N,"batchingColorTexture",q._colorsTexture,I));const kn=J.morphAttributes;if((kn.position!==void 0||kn.normal!==void 0||kn.color!==void 0)&&$e.update(q,J,wn),(Rn||Ge.receiveShadow!==q.receiveShadow)&&(Ge.receiveShadow=q.receiveShadow,Mt.setValue(N,"receiveShadow",q.receiveShadow)),Z.isMeshGouraudMaterial&&Z.envMap!==null&&(cn.envMap.value=Ie,cn.flipEnvMap.value=Ie.isCubeTexture&&Ie.isRenderTargetTexture===!1?-1:1),Z.isMeshStandardMaterial&&Z.envMap===null&&G.environment!==null&&(cn.envMapIntensity.value=G.environmentIntensity),cn.dfgLUT!==void 0&&(cn.dfgLUT.value=gT()),Rn&&(Mt.setValue(N,"toneMappingExposure",S.toneMappingExposure),Ge.needsLights&&en(cn,is),Se&&Z.fog===!0&&Be.refreshFogUniforms(cn,Se),Be.refreshMaterialUniforms(cn,Z,he,Me,D.state.transmissionRenderTarget[E.id]),rl.upload(N,Ea(Ge),cn,I)),Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(rl.upload(N,Ea(Ge),cn,I),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&Mt.setValue(N,"center",q.center),Mt.setValue(N,"modelViewMatrix",q.modelViewMatrix),Mt.setValue(N,"normalMatrix",q.normalMatrix),Mt.setValue(N,"modelMatrix",q.matrixWorld),Z.isShaderMaterial||Z.isRawShaderMaterial){const un=Z.uniformsGroups;for(let Cn=0,ya=un.length;Cn<ya;Cn++){const ss=un[Cn];fe.update(ss,wn),fe.bind(ss,wn)}}return wn}function en(E,G){E.ambientLightColor.needsUpdate=G,E.lightProbe.needsUpdate=G,E.directionalLights.needsUpdate=G,E.directionalLightShadows.needsUpdate=G,E.pointLights.needsUpdate=G,E.pointLightShadows.needsUpdate=G,E.spotLights.needsUpdate=G,E.spotLightShadows.needsUpdate=G,E.rectAreaLights.needsUpdate=G,E.hemisphereLights.needsUpdate=G}function tn(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return B},this.setRenderTargetTextures=function(E,G,J){const Z=_.get(E);Z.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,Z.__autoAllocateDepthBuffer===!1&&(Z.__useRenderToTexture=!1),_.get(E.texture).__webglTexture=G,_.get(E.depthTexture).__webglTexture=Z.__autoAllocateDepthBuffer?void 0:J,Z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,G){const J=_.get(E);J.__webglFramebuffer=G,J.__useDefaultFramebuffer=G===void 0};const Er=N.createFramebuffer();this.setRenderTarget=function(E,G=0,J=0){B=E,L=G,H=J;let Z=null,q=!1,Se=!1;if(E){const ye=_.get(E);if(ye.__useDefaultFramebuffer!==void 0){De.bindFramebuffer(N.FRAMEBUFFER,ye.__webglFramebuffer),K.copy(E.viewport),V.copy(E.scissor),se=E.scissorTest,De.viewport(K),De.scissor(V),De.setScissorTest(se),X=-1;return}else if(ye.__webglFramebuffer===void 0)I.setupRenderTarget(E);else if(ye.__hasExternalTextures)I.rebindTextures(E,_.get(E.texture).__webglTexture,_.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const He=E.depthTexture;if(ye.__boundDepthTexture!==He){if(He!==null&&_.has(He)&&(E.width!==He.image.width||E.height!==He.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");I.setupDepthRenderbuffer(E)}}const Ie=E.texture;(Ie.isData3DTexture||Ie.isDataArrayTexture||Ie.isCompressedArrayTexture)&&(Se=!0);const ze=_.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(ze[G])?Z=ze[G][J]:Z=ze[G],q=!0):E.samples>0&&I.useMultisampledRTT(E)===!1?Z=_.get(E).__webglMultisampledFramebuffer:Array.isArray(ze)?Z=ze[J]:Z=ze,K.copy(E.viewport),V.copy(E.scissor),se=E.scissorTest}else K.copy(Q).multiplyScalar(he).floor(),V.copy(te).multiplyScalar(he).floor(),se=Te;if(J!==0&&(Z=Er),De.bindFramebuffer(N.FRAMEBUFFER,Z)&&De.drawBuffers(E,Z),De.viewport(K),De.scissor(V),De.setScissorTest(se),q){const ye=_.get(E.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+G,ye.__webglTexture,J)}else if(Se){const ye=G;for(let Ie=0;Ie<E.textures.length;Ie++){const ze=_.get(E.textures[Ie]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Ie,ze.__webglTexture,J,ye)}}else if(E!==null&&J!==0){const ye=_.get(E.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,ye.__webglTexture,J)}X=-1},this.readRenderTargetPixels=function(E,G,J,Z,q,Se,Ce,ye=0){if(!(E&&E.isWebGLRenderTarget)){ft("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ie=_.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ie=Ie[Ce]),Ie){De.bindFramebuffer(N.FRAMEBUFFER,Ie);try{const ze=E.textures[ye],He=ze.format,Ue=ze.type;if(!dt.textureFormatReadable(He)){ft("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!dt.textureTypeReadable(Ue)){ft("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=E.width-Z&&J>=0&&J<=E.height-q&&(E.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+ye),N.readPixels(G,J,Z,q,le.convert(He),le.convert(Ue),Se))}finally{const ze=B!==null?_.get(B).__webglFramebuffer:null;De.bindFramebuffer(N.FRAMEBUFFER,ze)}}},this.readRenderTargetPixelsAsync=async function(E,G,J,Z,q,Se,Ce,ye=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ie=_.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ie=Ie[Ce]),Ie)if(G>=0&&G<=E.width-Z&&J>=0&&J<=E.height-q){De.bindFramebuffer(N.FRAMEBUFFER,Ie);const ze=E.textures[ye],He=ze.format,Ue=ze.type;if(!dt.textureFormatReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!dt.textureTypeReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const it=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,it),N.bufferData(N.PIXEL_PACK_BUFFER,Se.byteLength,N.STREAM_READ),E.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+ye),N.readPixels(G,J,Z,q,le.convert(He),le.convert(Ue),0);const vt=B!==null?_.get(B).__webglFramebuffer:null;De.bindFramebuffer(N.FRAMEBUFFER,vt);const Bt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Ox(N,Bt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,it),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Se),N.deleteBuffer(it),N.deleteSync(Bt),Se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,G=null,J=0){const Z=Math.pow(2,-J),q=Math.floor(E.image.width*Z),Se=Math.floor(E.image.height*Z),Ce=G!==null?G.x:0,ye=G!==null?G.y:0;I.setTexture2D(E,0),N.copyTexSubImage2D(N.TEXTURE_2D,J,0,0,Ce,ye,q,Se),De.unbindTexture()};const Yn=N.createFramebuffer(),Xs=N.createFramebuffer();this.copyTextureToTexture=function(E,G,J=null,Z=null,q=0,Se=null){Se===null&&(q!==0?(oo("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Se=q,q=0):Se=0);let Ce,ye,Ie,ze,He,Ue,it,vt,Bt;const zt=E.isCompressedTexture?E.mipmaps[Se]:E.image;if(J!==null)Ce=J.max.x-J.min.x,ye=J.max.y-J.min.y,Ie=J.isBox3?J.max.z-J.min.z:1,ze=J.min.x,He=J.min.y,Ue=J.isBox3?J.min.z:0;else{const kn=Math.pow(2,-q);Ce=Math.floor(zt.width*kn),ye=Math.floor(zt.height*kn),E.isDataArrayTexture?Ie=zt.depth:E.isData3DTexture?Ie=Math.floor(zt.depth*kn):Ie=1,ze=0,He=0,Ue=0}Z!==null?(it=Z.x,vt=Z.y,Bt=Z.z):(it=0,vt=0,Bt=0);const bt=le.convert(G.format),Ge=le.convert(G.type);let St;G.isData3DTexture?(I.setTexture3D(G,0),St=N.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(I.setTexture2DArray(G,0),St=N.TEXTURE_2D_ARRAY):(I.setTexture2D(G,0),St=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,G.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,G.unpackAlignment);const ut=N.getParameter(N.UNPACK_ROW_LENGTH),wn=N.getParameter(N.UNPACK_IMAGE_HEIGHT),Es=N.getParameter(N.UNPACK_SKIP_PIXELS),Rn=N.getParameter(N.UNPACK_SKIP_ROWS),is=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,zt.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,zt.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,ze),N.pixelStorei(N.UNPACK_SKIP_ROWS,He),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ue);const Mt=E.isDataArrayTexture||E.isData3DTexture,cn=G.isDataArrayTexture||G.isData3DTexture;if(E.isDepthTexture){const kn=_.get(E),un=_.get(G),Cn=_.get(kn.__renderTarget),ya=_.get(un.__renderTarget);De.bindFramebuffer(N.READ_FRAMEBUFFER,Cn.__webglFramebuffer),De.bindFramebuffer(N.DRAW_FRAMEBUFFER,ya.__webglFramebuffer);for(let ss=0;ss<Ie;ss++)Mt&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,_.get(E).__webglTexture,q,Ue+ss),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,_.get(G).__webglTexture,Se,Bt+ss)),N.blitFramebuffer(ze,He,Ce,ye,it,vt,Ce,ye,N.DEPTH_BUFFER_BIT,N.NEAREST);De.bindFramebuffer(N.READ_FRAMEBUFFER,null),De.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(q!==0||E.isRenderTargetTexture||_.has(E)){const kn=_.get(E),un=_.get(G);De.bindFramebuffer(N.READ_FRAMEBUFFER,Yn),De.bindFramebuffer(N.DRAW_FRAMEBUFFER,Xs);for(let Cn=0;Cn<Ie;Cn++)Mt?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,kn.__webglTexture,q,Ue+Cn):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,kn.__webglTexture,q),cn?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,un.__webglTexture,Se,Bt+Cn):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,un.__webglTexture,Se),q!==0?N.blitFramebuffer(ze,He,Ce,ye,it,vt,Ce,ye,N.COLOR_BUFFER_BIT,N.NEAREST):cn?N.copyTexSubImage3D(St,Se,it,vt,Bt+Cn,ze,He,Ce,ye):N.copyTexSubImage2D(St,Se,it,vt,ze,He,Ce,ye);De.bindFramebuffer(N.READ_FRAMEBUFFER,null),De.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else cn?E.isDataTexture||E.isData3DTexture?N.texSubImage3D(St,Se,it,vt,Bt,Ce,ye,Ie,bt,Ge,zt.data):G.isCompressedArrayTexture?N.compressedTexSubImage3D(St,Se,it,vt,Bt,Ce,ye,Ie,bt,zt.data):N.texSubImage3D(St,Se,it,vt,Bt,Ce,ye,Ie,bt,Ge,zt):E.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,Se,it,vt,Ce,ye,bt,Ge,zt.data):E.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,Se,it,vt,zt.width,zt.height,bt,zt.data):N.texSubImage2D(N.TEXTURE_2D,Se,it,vt,Ce,ye,bt,Ge,zt);N.pixelStorei(N.UNPACK_ROW_LENGTH,ut),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,wn),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Es),N.pixelStorei(N.UNPACK_SKIP_ROWS,Rn),N.pixelStorei(N.UNPACK_SKIP_IMAGES,is),Se===0&&G.generateMipmaps&&N.generateMipmap(St),De.unbindTexture()},this.initRenderTarget=function(E){_.get(E).__webglFramebuffer===void 0&&I.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?I.setTextureCube(E,0):E.isData3DTexture?I.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?I.setTexture2DArray(E,0):I.setTexture2D(E,0),De.unbindTexture()},this.resetState=function(){L=0,H=0,B=null,De.reset(),we.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return qi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=pt._getDrawingBufferColorSpace(e),t.unpackColorSpace=pt._getUnpackColorSpace()}}const qd={type:"change"},Lh={type:"start"},$m={type:"end"},Zo=new Ph,Kd=new Us,xT=Math.cos(70*zx.DEG2RAD),hn=new W,Vn=2*Math.PI,It={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Nc=1e-6;class vT extends Mv{constructor(e,t=null){super(e,t),this.state=It.NONE,this.target=new W,this.cursor=new W,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:sa.ROTATE,MIDDLE:sa.DOLLY,RIGHT:sa.PAN},this.touches={ONE:ta.ROTATE,TWO:ta.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new W,this._lastQuaternion=new xr,this._lastTargetPosition=new W,this._quat=new xr().setFromUnitVectors(e.up,new W(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ed,this._sphericalDelta=new Ed,this._scale=1,this._panOffset=new W,this._rotateStart=new Xe,this._rotateEnd=new Xe,this._rotateDelta=new Xe,this._panStart=new Xe,this._panEnd=new Xe,this._panDelta=new Xe,this._dollyStart=new Xe,this._dollyEnd=new Xe,this._dollyDelta=new Xe,this._dollyDirection=new W,this._mouse=new Xe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=MT.bind(this),this._onPointerDown=ST.bind(this),this._onPointerUp=ET.bind(this),this._onContextMenu=CT.bind(this),this._onMouseWheel=bT.bind(this),this._onKeyDown=AT.bind(this),this._onTouchStart=wT.bind(this),this._onTouchMove=RT.bind(this),this._onMouseDown=yT.bind(this),this._onMouseMove=TT.bind(this),this._interceptControlDown=PT.bind(this),this._interceptControlUp=DT.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(qd),this.update(),this.state=It.NONE}update(e=null){const t=this.object.position;hn.copy(t).sub(this.target),hn.applyQuaternion(this._quat),this._spherical.setFromVector3(hn),this.autoRotate&&this.state===It.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Vn:i>Math.PI&&(i-=Vn),s<-Math.PI?s+=Vn:s>Math.PI&&(s-=Vn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(hn.setFromSpherical(this._spherical),hn.applyQuaternion(this._quatInverse),t.copy(this.target).add(hn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=hn.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new W(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new W(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=hn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Zo.origin.copy(this.object.position),Zo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Zo.direction))<xT?this.object.lookAt(this.target):(Kd.setFromNormalAndCoplanarPoint(this.object.up,this.target),Zo.intersectPlane(Kd,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Nc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Nc||this._lastTargetPosition.distanceToSquared(this.target)>Nc?(this.dispatchEvent(qd),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Vn/60*this.autoRotateSpeed*e:Vn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){hn.setFromMatrixColumn(t,0),hn.multiplyScalar(-e),this._panOffset.add(hn)}_panUp(e,t){this.screenSpacePanning===!0?hn.setFromMatrixColumn(t,1):(hn.setFromMatrixColumn(t,0),hn.crossVectors(this.object.up,hn)),hn.multiplyScalar(e),this._panOffset.add(hn)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;hn.copy(s).sub(this.target);let r=hn.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Vn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Vn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Vn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Vn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Vn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Vn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Vn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Vn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Xe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function ST(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function MT(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function ET(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent($m),this.state=It.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function yT(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case sa.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=It.DOLLY;break;case sa.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=It.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=It.ROTATE}break;case sa.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=It.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=It.PAN}break;default:this.state=It.NONE}this.state!==It.NONE&&this.dispatchEvent(Lh)}function TT(n){switch(this.state){case It.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case It.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case It.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function bT(n){this.enabled===!1||this.enableZoom===!1||this.state!==It.NONE||(n.preventDefault(),this.dispatchEvent(Lh),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent($m))}function AT(n){this.enabled!==!1&&this._handleKeyDown(n)}function wT(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case ta.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=It.TOUCH_ROTATE;break;case ta.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=It.TOUCH_PAN;break;default:this.state=It.NONE}break;case 2:switch(this.touches.TWO){case ta.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=It.TOUCH_DOLLY_PAN;break;case ta.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=It.TOUCH_DOLLY_ROTATE;break;default:this.state=It.NONE}break;default:this.state=It.NONE}this.state!==It.NONE&&this.dispatchEvent(Lh)}function RT(n){switch(this._trackPointer(n),this.state){case It.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case It.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case It.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case It.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=It.NONE}}function CT(n){this.enabled!==!1&&n.preventDefault()}function PT(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function DT(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Ih=["VELX","VELY","ROT","EATN","SIZE","ECHG","MR","MG","MB","MS","E1R","E1G","E1B","E1S","E2R","E2G","E2B","E2S","E3R","E3G","E3B","E3S","E4R","E4G","E4B","E4S","E5R","E5G","E5B","E5S","B+","B-","NRG%"],gl=["VELX","VELY","ROT","EATR","EATG","EATB","REPR","MUT","MX","MY","E1X","E1Y","E2X","E2Y","E3X","E3Y","E4X","E4Y","E5X","E5Y"];let _a=null,ji=null,di=null,lr=null,Qn=null,$d=null;const _l=[],xl=[],$u=[],Zu=[],uo=[],mr=[],Ci=[],Zd=new Sv,Fc=new Xe;let wi=null;const Hi=2,LT=.08,jd=.1;let Uh=null;function Jd(n){const e=document.createElement("canvas"),t=e.getContext("2d");if(!t){const l=new lo({color:16777215});return new ml(l)}e.width=128,e.height=64,t.clearRect(0,0,e.width,e.height),t.fillStyle="rgba(0, 0, 0, 0.6)";const i=4;IT(t,i,i,e.width-i*2,e.height-i*2,8),t.fill(),t.font="bold 20px monospace",t.textAlign="center",t.textBaseline="middle",t.fillStyle="#ffffff",t.fillText(n,e.width/2,e.height/2);const r=new Vm(e);r.minFilter=on,r.magFilter=on;const a=new lo({map:r,transparent:!0,depthTest:!1}),o=new ml(a);return o.scale.set(.5,.25,1),o.userData.canvas=e,o.userData.ctx=t,o}function Qd(n,e,t){if(!n||!n.userData)return;const i=n.userData.canvas,s=n.userData.ctx;if(!i||!s)return;s.clearRect(0,0,i.width,i.height),s.font="bold 16px monospace",s.textAlign="center",s.textBaseline="middle",s.fillStyle="#000000",s.fillText(e,i.width/2,i.height/2-12),s.font="14px monospace",s.fillText(t.toFixed(2),i.width/2,i.height/2+12);const r=n.material;r.map&&(r.map.needsUpdate=!0)}function ep(n){const e=document.createElement("canvas"),t=e.getContext("2d");if(!t){const a=new lo({color:16777215});return new ml(a)}e.width=256,e.height=64,t.clearRect(0,0,e.width,e.height),t.font="bold 32px monospace",t.textAlign="center",t.textBaseline="middle",t.fillStyle="#00000020",t.fillText(n,e.width/2,e.height/2);const i=new Vm(e);i.minFilter=on,i.magFilter=on;const s=new lo({map:i,transparent:!0,depthTest:!1}),r=new ml(s);return r.scale.set(1.2,.3,1),r}function IT(n,e,t,i,s,r){n.beginPath(),n.moveTo(e+r,t),n.lineTo(e+i-r,t),n.quadraticCurveTo(e+i,t,e+i,t+r),n.lineTo(e+i,t+s-r),n.quadraticCurveTo(e+i,t+s,e+i-r,t+s),n.lineTo(e+r,t+s),n.quadraticCurveTo(e,t+s,e,t+s-r),n.lineTo(e,t+r),n.quadraticCurveTo(e,t,e+r,t),n.closePath()}function UT(n,e){wi=n,Uh=e,_a=new cv;const t=wi.clientWidth/wi.clientHeight;ji=new fi(50,t,.1,100),ji.position.set(0,0,6),di=new _T({antialias:!1,alpha:!0,precision:"lowp"}),di.setSize(wi.clientWidth,wi.clientHeight),di.setPixelRatio(Math.min(window.devicePixelRatio,2)),wi.appendChild(di.domElement),lr=new vT(ji,di.domElement),lr.enableDamping=!0,lr.dampingFactor=.05,lr.minDistance=3,lr.maxDistance=15,Qn=new Qa,_a.add(Qn);const i=new Ul(Hi,16,12),s=new ma({color:13421772,transparent:!0,opacity:.1,wireframe:!0}),r=new ni(i,s);Qn.add(r),NT(),FT(),di.domElement.addEventListener("click",zT),Zm()}function NT(){uo.length=0,mr.length=0;const n=Math.ceil(Math.sqrt(Li)),e=Math.ceil(Li/n);for(let s=0;s<Li;s++){const r=Math.floor(s/e),a=s%e,o=Math.PI/4+r/n*(Math.PI/2),l=Math.PI+a/e*(Math.PI/2)-Math.PI/4,c=Hi*Math.sin(o)*Math.cos(l),h=Hi*Math.cos(o),u=Hi*Math.sin(o)*Math.sin(l);uo.push(new W(c,h,u))}const t=Math.ceil(Math.sqrt(jt)),i=Math.ceil(jt/t);for(let s=0;s<jt;s++){const r=Math.floor(s/i),a=s%i,o=Math.PI/4+r/t*(Math.PI*2/3),l=a/i*Math.PI-Math.PI/2,c=Hi*Math.sin(o)*Math.cos(l),h=Hi*Math.cos(o),u=Hi*Math.sin(o)*Math.sin(l);mr.push(new W(c,h,u))}}function FT(){if(!Qn)return;const n=new Ul(LT,6,4);for(let s=0;s<Li;s++){const r=new ma({color:65280,transparent:!0}),a=new ni(n,r);a.position.copy(uo[s]),a.userData={type:"input",index:s},Qn.add(a),_l.push(a);const o=Ih[s]||`I${s}`,l=Jd(o),c=uo[s].clone(),h=c.clone().normalize().multiplyScalar(jd);l.position.copy(c).add(h),Qn.add(l),$u.push(l)}for(let s=0;s<jt;s++){const r=new ma({color:255,transparent:!0}),a=new ni(n,r);a.position.copy(mr[s]),a.userData={type:"output",index:s},Qn.add(a),xl.push(a);const o=gl[s]||`O${s}`,l=Jd(o),c=mr[s].clone(),h=c.clone().normalize().multiplyScalar(jd);l.position.copy(c).add(h),Qn.add(l),Zu.push(l)}const e=Hi+.25,t=ep("INPUTS");t.position.set(-e,Hi,0),Qn.add(t);const i=ep("OUTPUTS");i.position.set(e,Hi,0),Qn.add(i)}const Ol=Li*jt+jt*(jt-1),tp=.02,Ht=new Float32Array(Ol*4*3),hs=new Float32Array(Ol*4*4),ir=new Uint16Array(Ol*6);for(let n=0;n<Ol;n++){const e=n*4,t=n*6;ir[t]=e,ir[t+1]=e+1,ir[t+2]=e+2,ir[t+3]=e+2,ir[t+4]=e+1,ir[t+5]=e+3}const Jr=new W,gt=new W,np=new W(0,1,0),ip=new W(1,0,0);let fs=null,sp=null;function OT(n){if(!Qn)return;fs||(fs=new xi,fs.setAttribute("position",new Xn(Ht,3)),fs.setAttribute("color",new Xn(hs,4)),fs.setIndex(new Xn(ir,1)),sp=new ma({vertexColors:!0,transparent:!0,side:Wi,depthWrite:!1}),$d=new ni(fs,sp),Qn.add($d));let e=0;for(let t=0;t<Li;t++){const i=n[eh+t],s=pp+t*2*jt;for(let r=0;r<jt;r++){const a=i>0?n[s+r]:n[s+jt+r];if(Math.abs(a)<.05)continue;const o=uo[t],l=mr[r];Jr.subVectors(l,o).normalize(),gt.crossVectors(Jr,np),gt.lengthSq()<.001&&gt.crossVectors(Jr,ip),gt.normalize();const c=Math.abs(a)*tp/2,h=e*12;Ht[h]=o.x+gt.x*c,Ht[h+1]=o.y+gt.y*c,Ht[h+2]=o.z+gt.z*c,Ht[h+3]=o.x-gt.x*c,Ht[h+4]=o.y-gt.y*c,Ht[h+5]=o.z-gt.z*c,Ht[h+6]=l.x+gt.x*c,Ht[h+7]=l.y+gt.y*c,Ht[h+8]=l.z+gt.z*c,Ht[h+9]=l.x-gt.x*c,Ht[h+10]=l.y-gt.y*c,Ht[h+11]=l.z-gt.z*c;const u=Math.min(Math.abs(a),1),f=a<0?1:0,g=a>0?u:0,x=0,M=u,p=e*16;for(let d=0;d<4;d++)hs[p+d*4]=f,hs[p+d*4+1]=g,hs[p+d*4+2]=x,hs[p+d*4+3]=M;e++}}for(let t=0;t<jt;t++){const i=n[th+t],s=Eg+t*2*jt;for(let r=0;r<jt;r++){if(t===r)continue;const a=i>0?n[s+r]:n[s+jt+r];if(Math.abs(a)<.05)continue;const o=mr[t],l=mr[r];Jr.subVectors(l,o).normalize(),gt.crossVectors(Jr,np),gt.lengthSq()<.001&&gt.crossVectors(Jr,ip),gt.normalize();const c=Math.abs(a)*tp/2,h=e*12;Ht[h]=o.x+gt.x*c,Ht[h+1]=o.y+gt.y*c,Ht[h+2]=o.z+gt.z*c,Ht[h+3]=o.x-gt.x*c,Ht[h+4]=o.y-gt.y*c,Ht[h+5]=o.z-gt.z*c,Ht[h+6]=l.x+gt.x*c,Ht[h+7]=l.y+gt.y*c,Ht[h+8]=l.z+gt.z*c,Ht[h+9]=l.x-gt.x*c,Ht[h+10]=l.y-gt.y*c,Ht[h+11]=l.z-gt.z*c;const u=Math.min(Math.abs(a),1),f=a<0?1:0,g=0,x=a>0?u:0,M=u,p=e*16;for(let d=0;d<4;d++)hs[p+d*4]=f,hs[p+d*4+1]=g,hs[p+d*4+2]=x,hs[p+d*4+3]=M;e++}}fs.setDrawRange(0,e*6),fs.attributes.position.needsUpdate=!0,fs.attributes.color.needsUpdate=!0}function BT(n){for(let e=0;e<Li;e++){const t=n[eh+e],s=_l[e].material,r=Math.min(Math.abs(t),1),a=t>=0?.3333:0;s.color.setHSL(a,1,.5),s.transparent=!0,s.opacity=r;const o=Ih[e]||`I${e}`;$u[e]&&Qd($u[e],o,t)}for(let e=0;e<jt;e++){const t=n[th+e],s=xl[e].material,r=Math.min(Math.abs(t),1),a=t>=0?.6666:0;s.color.setHSL(a,1,.5),s.transparent=!0,s.opacity=r;const o=gl[e]||`O${e}`;Zu[e]&&Qd(Zu[e],o,t)}}function zT(n){if(!ji||!di||!_a)return;const e=di.domElement.getBoundingClientRect();Fc.x=(n.clientX-e.left)/e.width*2-1,Fc.y=-((n.clientY-e.top)/e.height)*2+1,Zd.setFromCamera(Fc,ji);const t=[..._l,...xl],i=Zd.intersectObjects(t);if(i.length>0){const s=i[0].object,{type:r,index:a}=s.userData,o=Ci.findIndex(l=>l.type===r&&l.index===a);o>=0?(Ci.splice(o,1),s.material.color.setHex(r==="input"?4500036:4474026)):(Ci.push({type:r,index:a}),s.material.color.setHex(16776960)),rp()}else{for(const s of Ci){const r=s.type==="input"?_l[s.index]:xl[s.index];r&&r.material.color.setHex(s.type==="input"?4500036:4474026)}Ci.length=0,rp()}}function rp(){const n=document.getElementById("brain3d-weights");if(Ci.length===0){n&&(n.style.display="none");return}n&&(n.style.display="block",n.innerHTML||(n.innerHTML="Loading…")),Uh?.(Ci.slice())}function kT(){Ci.length>0&&Uh?.(Ci.slice())}function VT(n){const e=document.getElementById("brain3d-weights");if(!e)return;if(Ci.length===0){e.style.display="none";return}if(e.style.display="block",n.error){e.innerHTML=n.error;return}const{advCount:t,disCount:i}=n;let s="";for(const r of n.rows){const a=r.type==="input"?Ih[r.index]||`I${r.index}`:gl[r.index]||`O${r.index}`;s+=`<b>${r.type.toUpperCase()} ${a}</b><br>`,s+='<table class="neuron-weights-table" style="width:100%; border-collapse:collapse; font-size:8px;">',s+=`<tr>
      <th>Target</th>
      <th>W1</th>
      <th style="color:green">Adv(${t})</th>
      <th style="color:red">Dis(${i})</th>
      <th>W1'</th>
      <th style="border-left:1px solid #ccc"></th>
      <th>W2</th>
      <th style="color:green">Adv(${t})</th>
      <th style="color:red">Dis(${i})</th>
      <th>W2'</th>
    </tr>`;for(let o=0;o<jt;o++){const l=gl[o]||`O${o}`,c=r.w1[o],h=r.w2[o],u=c+r.advW1[o]-r.disW1[o],f=h+r.advW2[o]-r.disW2[o];s+=`<tr>
        <td>${l}</td>
        <td>${c.toFixed(3)}</td>
        <td style="color:green">${r.advW1[o].toFixed(3)}</td>
        <td style="color:red">${r.disW1[o].toFixed(3)}</td>
        <td><b>${u.toFixed(3)}</b></td>
        <td style="border-left:1px solid #ccc"></td>
        <td>${h.toFixed(3)}</td>
        <td style="color:green">${r.advW2[o].toFixed(3)}</td>
        <td style="color:red">${r.disW2[o].toFixed(3)}</td>
        <td><b>${f.toFixed(3)}</b></td>
      </tr>`}s+="</table><br>"}e.innerHTML=s}function Zm(){if(requestAnimationFrame(Zm),!(wi&&wi.style.display==="none")&&(lr&&lr.update(),di&&_a&&ji))try{di.render(_a,ji)}catch{}}function GT(n){!_a||!Qn||(OT(n),BT(n))}function ho(){if(!wi||!ji||!di)return;const n=wi.clientWidth,t=Math.max(250,Math.min(n*1,600));wi.style.height=t+"px";const i=t;ji.aspect=n/i,ji.updateProjectionMatrix(),di.setSize(n,i)}function jm(){Ci.length=0;const n=document.getElementById("brain3d-weights");n&&(n.style.display="none")}const Yt=new Tg;let Oc=null,Bc=-1;function ju(){const n=document.getElementById("map");if(!n){console.error("Map canvas not found");return}if(n.width=window.innerWidth,n.height=1e3,z.ctx=n.getContext("2d",{alpha:!1}),!z.ctx){console.error("Could not get map canvas context");return}z.ctx.font="10px Arial";const e=document.getElementById("brain3d-container");e&&UT(e,i=>{z.highlighted!==null&&Yt.requestKinTable(z.highlighted,i)}),HT();const t=document.getElementById("fps-counter");t&&$0(t),j0(Yt),Y0(),WT(n),Yt.on("stats",i=>B0(i.sample)),Yt.on("kinTable",i=>VT(i.table)),Yt.on("family",i=>ex(i.idx,i.tree)),Yt.on("alikeness",i=>Q0(i.a,i.b,i.value)),Yt.on("save",i=>Fg(i.json,`petri-save-${Date.now()}.json`)),Yt.on("loaded",i=>{i.ok?(console.log("Load complete!"),um()):console.error("Failed to load:",i.error)}),Yt.start(Qu),Jm(),z.canvas.scale=3,z.ctx.scale(3,3)}function HT(){const n=a=>document.getElementById(a),e=n("foodPopChart"),t=n("optimizationChart"),i=n("lifespanChart"),s=n("mutationStratChart"),r=n("genDemoChart");e&&I0(e),t&&U0(t),i&&N0(i),s&&F0(s),r&&O0(r)}function WT(n){n.addEventListener("mouseover",e=>{Ua("over",e,n),z.mouse.overMap=!0}),n.addEventListener("mousemove",e=>Ua("move",e,n)),n.addEventListener("mousedown",e=>Ua("down",e,n)),n.addEventListener("mouseup",e=>Ua("up",e,n)),n.addEventListener("mouseout",e=>{Ua("out",e,n),z.mouse.overMap=!1}),n.addEventListener("wheel",e=>G0(e,n),{passive:!1}),document.addEventListener("keydown",e=>H0(e,Qm)),document.addEventListener("keyup",e=>W0(e)),window.addEventListener("resize",()=>{const e=z.ctx;e&&(n.width=window.innerWidth,n.height=1e3,e.font="10px Arial",e.setTransform(z.canvas.scale,0,0,z.canvas.scale,z.mouse.originalX,z.mouse.originalY),$c(),ho())}),XT()}function XT(){const n=document.getElementById("dashboard"),e=document.getElementById("dashboard-resize-handle");if(!n||!e)return;let t=!1;e.addEventListener("mousedown",i=>{t=!0,e.classList.add("dragging"),i.preventDefault()}),document.addEventListener("mousemove",i=>{if(!t)return;const s=window.innerWidth-i.clientX,r=200,a=window.innerWidth*.8;s>=r&&s<=a&&(n.style.width=s+"px",$c(),ho())}),document.addEventListener("mouseup",()=>{t&&(t=!1,e.classList.remove("dragging"),$c(),ho())})}function Jm(){Yt.swapFrame();const n=Yt.frame;Z0(n?gi(n,Gn.TPS_MEASURED):0),n&&(z.highlighted=ih(n),z0(n,Yt)),k0.update(Yt),qT(n),Ng(n),n&&(K0.update(n),YT(n)),requestAnimationFrame(Jm)}function YT(n){if(!El(n)){Oc=null,Bc=-1;return}const e=Xt(n,tt.DESCENDANTS),t=z.highlighted!==Oc||e!==Bc;z.display==="brain"?(Cg(n)&&GT(n),t&&kT()):z.display==="family"&&dm(!1,z.highlighted,e),Oc=z.highlighted,Bc=e}function qT(n){if(!z.tracking)return;const e=z.ctx;if(!e||!n||!El(n))return;if(Xt(n,tt.STATUS)!==0){z.tracking=!1;return}const t=e.canvas,i=t.width/2/z.canvas.scale,s=t.height/2/z.canvas.scale,r=i-Xt(n,tt.X)-z.mouse.originalX/z.canvas.scale,a=s-Xt(n,tt.Y)-z.mouse.originalY/z.canvas.scale;e.translate(r,a),z.mouse.originalX+=r*z.canvas.scale,z.mouse.originalY+=a*z.canvas.scale}function Qm(){z.paused=!z.paused,Yt.setPaused(z.paused);const n=document.getElementById("play-button");n&&(n.src=z.paused?"icons/pause.png":"icons/play.png")}function KT(){z.fastForward=!z.fastForward,Yt.setTps(z.fastForward?0:Qu)}function $T(){z.tracking=!1,Yt.newSimulation(),um()}function eg(){const n=document.getElementById("brain3d-container"),e=document.getElementById("family-tree");z.display==="brain"&&n?(n.style.display="block",ho(),e&&(e.style.display="none")):z.display==="family"&&e&&(e.style.display="block",n&&(n.style.display="none"))}function ZT(){const n=Yt.frame;n&&(Yt.highlight(bg(n)),eg())}function Nh(n){const e=Yt.frame;if(!e)return;const t=Ag(e,n);t!==null&&(Yt.highlight(t),eg())}function jT(){console.log("SAVING..."),Yt.save()}function JT(){Og(".json").then(n=>{n&&(console.log("LOADING..."),Yt.load(n))}).catch(n=>console.error("Failed to read file:",n))}function QT(){if(z.highlighted===null)return;const n=document.getElementById("brain3d-container"),e=document.getElementById("family-tree");z.display==="brain"?(z.display="default",n&&(n.style.display="none"),jm()):(z.display="brain",n&&(n.style.display="block",ho()),e&&(e.style.display="none")),Yt.setDisplay(z.display)}function eb(){z.tracking?z.tracking=!1:z.highlighted!==null&&(z.tracking=!0)}function tb(){z.tracking=!1}function nb(){z.tracking=!1,z.mouse.leftPressed=!1,Yt.highlight(null);const n=document.getElementById("brain3d-container"),e=document.getElementById("family-tree");n&&(n.style.display="none"),e&&(e.style.display="none"),z.display==="brain"&&jm(),z.display="default",Yt.setDisplay("default")}window.init=ju;window.newSimulation=$T;window.pauseSimulation=Qm;window.accelerateMutations=KT;window.save=jT;window.load=JT;window.highlight_newest=ZT;window.highlight_gold=()=>Nh(Gn.GOLD);window.highlight_silver=()=>Nh(Gn.SILVER);window.highlight_bronze=()=>Nh(Gn.BRONZE);window.toggleBrainDisplay=QT;window.toggleFamilyDisplay=nx;window.toggleTracking=eb;window.stopTracking=tb;window.closeHighlight=nb;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ju):ju();
