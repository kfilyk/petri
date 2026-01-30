(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const bs=1,Ta=20,Sn=32,ee=35,Hm=.1,Wh=100,ps=1200,ms=1200,kn=25,Zr=ps/kn*(ms/kn),Ja=1e3,Zd=3,xo=Math.PI*2,ui=.0174533,Aa="ABCDEFGHIJKLMNOPQRSTUVWXYZ";function ue(n){return n+(n<0?-.5:.5)|0}function Ie(n){return n>0?n:-n}function Vm(n,t,e){return n<t?t:n>e?e:n}function Wm(n){let t="";for(let e=0;e<4;e++)t+=n.charAt(ue(Math.random()*25));return t}class Xm{tiles=new Array(Zr);amoebs=new Array(Ja);graveyard=[];HIGHESTINDEX=-1;gold=null;silver=null;bronze=null;highlighted=null;following=null;newest=null;tracking=null;display="default";scoreType=0;pause=!1;accelerate=0;ctx={map:null,stats:null};mouse={x:0,y:0,originalX:0,originalY:0,prevX:0,prevY:0,overMap:!1,overConsole:!1,leftPressed:!1,rightPressed:!1};canvas={scale:1,dragOffsetX:0,dragOffsetY:0,dragging:!1};stats={time:0,livePop:0,netParents:0,netLifespan:0,deathCount:0,aveChildren:0,aveLifespan:0,avePosNRG:0,maxAveChildren:1,maxAveLifespan:1,maxAvePosNRG:1,redAgarOnMap:0,greenAgarOnMap:0,blueAgarOnMap:0,advWeight:0,disWeight:0,mitoses:0,netEatenRatio:0};history={aveChildren:[],aveLifespan:[],avePosNRG:[]};keysPressed={};leftAccel=0;rightAccel=0;upAccel=0;downAccel=0;requestId=0;scores=new Array(Zd);neuronWeights={amoebIndex:null,neuronType:null,neuronIndex:null,lastParentDescendants:-1};resetStats(){this.stats.time=0,this.stats.netLifespan=0,this.stats.deathCount=0,this.stats.aveChildren=0,this.stats.aveLifespan=0,this.stats.avePosNRG=0,this.stats.maxAveChildren=1,this.stats.maxAveLifespan=1,this.stats.maxAvePosNRG=1,this.stats.livePop=0,this.HIGHESTINDEX=0;for(let t=0;t<this.amoebs.length;t++){const e=this.amoebs[t];e!=null&&e.status==="alive"&&(this.stats.livePop++,this.HIGHESTINDEX=t)}this.history.aveChildren=[],this.history.aveLifespan=[],this.history.avePosNRG=[]}}const _=new Xm;class Ga{weights1=new Float32Array(0);weights2=new Float32Array(0);sigmas1=new Float32Array(0);sigmas2=new Float32Array(0);in=0;out=0;init(t,e){this.weights1=new Float32Array(t).fill(0),this.weights2=new Float32Array(t).fill(0),this.sigmas1=new Float32Array(t).fill(0),this.sigmas2=new Float32Array(t).fill(0);for(let i=0;i<e;i++)this.weights1[i]=Math.random()+Math.random()-1,this.weights2[i]=Math.random()+Math.random()-1}clamp(){this.out=this.in>1?1:this.in<-1?-1:this.in}synapse(t){return this.in>0?this.in*this.weights1[t]:this.in*this.weights2[t]}tanh(){this.out=(Math.exp(2*this.in)-1)/(Math.exp(2*this.in)+1)}}class Jd{x;y;num;neighbors;regenRate;RCap;GCap;BCap;R;G;B;constructor(t,e,i,s){this.x=t,this.y=e,this.num=i,this.neighbors=s,this.regenRate=Math.random()*.05+.05,this.RCap=ue(Math.random()*100)+50,this.GCap=ue(Math.random()*100)+100,this.BCap=ue(Math.random()*75)+25,this.R=this.RCap,this.G=this.GCap,this.B=this.BCap}regenerate(){this.R<this.RCap&&(this.R+=this.regenRate),this.G<this.GCap&&(this.G+=this.regenRate),this.B<this.BCap&&(this.B+=this.regenRate)}}const Gn=ps/kn,gl=ms/kn,Ym=Gn*gl,_l=document.createElement("canvas");_l.width=Gn;_l.height=gl;const Qd=_l.getContext("2d"),tp=Qd.createImageData(Gn,gl),vo=tp.data,Ku={generate(){const n=[];let t=0;for(let l=0;l<ms;l+=kn)for(let c=0;c<ps;c+=kn)t>=Gn&&n.push(t-Gn),t<Zr-Gn&&n.push(t+Gn),t%Gn!==0&&n.push(t-1),(t+1)%Gn!==0&&n.push(t+1),_.tiles[t]=new Jd(c,l,t,[...n]),t++,n.length=0;const e=100,i=100,s=75,r=50,a=100,o=25;for(let l=0;l<8;l++){let c=255,h=255,u=255,f=0,p=0,v=0;for(let D=0;D<t;D++){const A=_.tiles[D];let N=A.RCap,k=A.GCap,y=A.BCap;for(let T=0;T<A.neighbors.length;T++)N+=_.tiles[A.neighbors[T]].RCap,k+=_.tiles[A.neighbors[T]].GCap,y+=_.tiles[A.neighbors[T]].BCap;A.RCap=N/(A.neighbors.length+1),A.GCap=k/(A.neighbors.length+1),A.BCap=y/(A.neighbors.length+1),A.R=A.RCap,A.G=A.GCap,A.B=A.BCap,A.RCap<c&&(c=A.RCap),A.GCap<h&&(h=A.GCap),A.BCap<u&&(u=A.BCap),A.RCap>f&&(f=A.RCap),A.GCap>p&&(p=A.GCap),A.BCap>v&&(v=A.BCap)}const S=f-c,m=p-h,d=v-u,b=e/S,R=i/m,w=s/d;for(let D=0;D<t;D++){const A=_.tiles[D];A.RCap=(A.RCap-c)*b+r,A.GCap=(A.GCap-h)*R+a,A.BCap=(A.BCap-u)*w+o,A.R=A.RCap,A.G=A.GCap,A.B=A.BCap}}},update(){const n=_.ctx.map;if(n){n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,n.canvas.width,n.canvas.height),n.restore(),n.font="8px monospace";for(let t=0;t<Zr;t++){const e=_.tiles[t],i=t*4;vo[i]=e.R<255?e.R>48?e.R:48:255,vo[i+1]=e.G<255?e.G>48?e.G:48:255,vo[i+2]=e.B<255?e.B>48?e.B:48:255,vo[i+3]=255,_.pause||e.regenerate()}if(Qd.putImageData(tp,0,0),n.imageSmoothingEnabled=!1,n.drawImage(_l,0,0,ps,ms),_.mouse.overMap){const t=Math.floor(_.mouse.x/kn),i=Math.floor(_.mouse.y/kn)*Gn+t;if(i>=0&&i<Zr){const s=_.tiles[i],r=[i,...s.neighbors];for(const a of r){const o=_.tiles[a],l=o.R-32,c=o.G-32,h=o.B-32;n.fillStyle=`rgb(${l},${c},${h})`,_.mouse.leftPressed?n.fillText(o.num.toString(),o.x+2,o.y+25):(n.fillText(ue(o.R).toString(),o.x+2,o.y+9),n.fillText(ue(o.G).toString(),o.x+2,o.y+16),n.fillText(ue(o.B).toString(),o.x+2,o.y+23))}}}}}};class Dc{x;y;tile=null;r=0;g=0;b=0;s=0;detected=-1;constructor(t,e){this.x=t,this.y=e}move(t,e,i,s,r){const a=Math.atan(s/(r+.001))/ui,o=Math.sqrt(s**2+r**2),l=s<0?a+180:a;this.x=e+o*Math.cos(ui*(l+t)),this.y=i+o*Math.sin(ui*(l+t))}sense(){if(this.detected=-1,this.s=0,this.x>=0&&this.y>=0&&this.x<ps&&this.y<ms){this.tile=~~(this.y/kn)*Gn+~~(this.x/kn);const t=_.tiles[this.tile];this.r=t.R/150,this.g=t.G/200,this.b=t.B/100}else this.tile=null,this.r=-1,this.g=-1,this.b=-1,this.s=-1}}class Lc{x;y;tile=null;r=0;g=0;b=0;s=0;detected=-1;constructor(t,e){this.x=t,this.y=e}move(t,e,i,s,r){const a=Math.atan(s/(r+.001))/ui,o=Math.sqrt(s**2+r**2),l=s<0?a+180:a;this.x=e+o*Math.cos(ui*(l+t)),this.y=i+o*Math.sin(ui*(l+t))}sense(){if(this.detected=-1,this.s=0,this.x>=0&&this.y>=0&&this.x<ps&&this.y<ms){this.tile=~~(this.y/kn)*Gn+~~(this.x/kn);const t=_.tiles[this.tile];this.r=t.R/150,this.g=t.G/200,this.b=t.B/100}else this.tile=null,this.r=-1,this.g=-1,this.b=-1,this.s=-1}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const $u="182",Jr={ROTATE:0,DOLLY:1,PAN:2},$r={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},qm=0,Xh=1,jm=2,qo=1,Km=2,ka=3,Fs=0,Hn=1,zi=2,us=0,Qr=1,Yh=2,qh=3,jh=4,$m=5,er=100,Zm=101,Jm=102,Qm=103,tg=104,eg=200,ng=201,ig=202,sg=203,Ic=204,Uc=205,rg=206,ag=207,og=208,lg=209,cg=210,ug=211,hg=212,fg=213,dg=214,Nc=0,Fc=1,Oc=2,ia=3,Bc=4,zc=5,Gc=6,kc=7,ep=0,pg=1,mg=2,Vi=0,np=1,ip=2,sp=3,rp=4,ap=5,op=6,lp=7,cp=300,fr=301,sa=302,Hc=303,Vc=304,xl=306,Wc=1e3,cs=1001,Xc=1002,bn=1003,gg=1004,Mo=1005,sn=1006,Vl=1007,ar=1008,di=1009,up=1010,hp=1011,Qa=1012,Zu=1013,Yi=1014,ki=1015,gs=1016,Ju=1017,Qu=1018,to=1020,fp=35902,dp=35899,pp=1021,mp=1022,wi=1023,_s=1026,or=1027,gp=1028,th=1029,ra=1030,eh=1031,nh=1033,jo=33776,Ko=33777,$o=33778,Zo=33779,Yc=35840,qc=35841,jc=35842,Kc=35843,$c=36196,Zc=37492,Jc=37496,Qc=37488,tu=37489,eu=37490,nu=37491,iu=37808,su=37809,ru=37810,au=37811,ou=37812,lu=37813,cu=37814,uu=37815,hu=37816,fu=37817,du=37818,pu=37819,mu=37820,gu=37821,_u=36492,xu=36494,vu=36495,Mu=36283,Su=36284,yu=36285,Eu=36286,_g=3200,xg=0,vg=1,Is="",li="srgb",aa="srgb-linear",nl="linear",we="srgb",Rr=7680,Kh=519,Mg=512,Sg=513,yg=514,ih=515,Eg=516,bg=517,sh=518,Tg=519,bu=35044,$h="300 es",Hi=2e3,il=2001;function _p(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function sl(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Ag(){const n=sl("canvas");return n.style.display="block",n}const Zh={};function rl(...n){const t="THREE."+n.shift();console.log(t,...n)}function Jt(...n){const t="THREE."+n.shift();console.warn(t,...n)}function de(...n){const t="THREE."+n.shift();console.error(t,...n)}function eo(...n){const t=n.join(" ");t in Zh||(Zh[t]=!0,Jt(...n))}function wg(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}class mr{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const s=i[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Rn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Jo=Math.PI/180,Tu=180/Math.PI;function Ns(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Rn[n&255]+Rn[n>>8&255]+Rn[n>>16&255]+Rn[n>>24&255]+"-"+Rn[t&255]+Rn[t>>8&255]+"-"+Rn[t>>16&15|64]+Rn[t>>24&255]+"-"+Rn[e&63|128]+Rn[e>>8&255]+"-"+Rn[e>>16&255]+Rn[e>>24&255]+Rn[i&255]+Rn[i>>8&255]+Rn[i>>16&255]+Rn[i>>24&255]).toLowerCase()}function le(n,t,e){return Math.max(t,Math.min(e,n))}function Rg(n,t){return(n%t+t)%t}function Wl(n,t,e){return(1-e)*n+e*t}function Gi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ue(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Cg={DEG2RAD:Jo};class Xt{constructor(t=0,e=0){Xt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(le(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(le(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class dr{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],f=r[a+0],p=r[a+1],v=r[a+2],S=r[a+3];if(o<=0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o>=1){t[e+0]=f,t[e+1]=p,t[e+2]=v,t[e+3]=S;return}if(u!==S||l!==f||c!==p||h!==v){let m=l*f+c*p+h*v+u*S;m<0&&(f=-f,p=-p,v=-v,S=-S,m=-m);let d=1-o;if(m<.9995){const b=Math.acos(m),R=Math.sin(b);d=Math.sin(d*b)/R,o=Math.sin(o*b)/R,l=l*d+f*o,c=c*d+p*o,h=h*d+v*o,u=u*d+S*o}else{l=l*d+f*o,c=c*d+p*o,h=h*d+v*o,u=u*d+S*o;const b=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=b,c*=b,h*=b,u*=b}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[a],f=r[a+1],p=r[a+2],v=r[a+3];return t[e]=o*v+h*u+l*p-c*f,t[e+1]=l*v+h*f+c*u-o*p,t[e+2]=c*v+h*p+o*f-l*u,t[e+3]=h*v-o*u-l*f-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),u=o(r/2),f=l(i/2),p=l(s/2),v=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*p*v,this._y=c*p*u-f*h*v,this._z=c*h*v+f*p*u,this._w=c*h*u-f*p*v;break;case"YXZ":this._x=f*h*u+c*p*v,this._y=c*p*u-f*h*v,this._z=c*h*v-f*p*u,this._w=c*h*u+f*p*v;break;case"ZXY":this._x=f*h*u-c*p*v,this._y=c*p*u+f*h*v,this._z=c*h*v+f*p*u,this._w=c*h*u-f*p*v;break;case"ZYX":this._x=f*h*u-c*p*v,this._y=c*p*u+f*h*v,this._z=c*h*v-f*p*u,this._w=c*h*u+f*p*v;break;case"YZX":this._x=f*h*u+c*p*v,this._y=c*p*u+f*h*v,this._z=c*h*v-f*p*u,this._w=c*h*u-f*p*v;break;case"XZY":this._x=f*h*u-c*p*v,this._y=c*p*u-f*h*v,this._z=c*h*v+f*p*u,this._w=c*h*u+f*p*v;break;default:Jt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=i+o+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(i>o&&i>u){const p=2*Math.sqrt(1+i-o-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>u){const p=2*Math.sqrt(1+o-i-u);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+u-i-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(le(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e<=0)return this;if(e>=1)return this.copy(t);let i=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class X{constructor(t=0,e=0,i=0){X.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Jh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Jh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*i),h=2*(o*e-r*s),u=2*(r*i-a*e);return this.x=e+l*c+a*u-o*h,this.y=i+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this.z=le(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this.z=le(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(le(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Xl.copy(this).projectOnVector(t),this.sub(Xl)}reflect(t){return this.sub(Xl.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(le(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Xl=new X,Jh=new dr;class se{constructor(t,e,i,s,r,a,o,l,c){se.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,l,c)}set(t,e,i,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],f=i[2],p=i[5],v=i[8],S=s[0],m=s[3],d=s[6],b=s[1],R=s[4],w=s[7],D=s[2],A=s[5],N=s[8];return r[0]=a*S+o*b+l*D,r[3]=a*m+o*R+l*A,r[6]=a*d+o*w+l*N,r[1]=c*S+h*b+u*D,r[4]=c*m+h*R+u*A,r[7]=c*d+h*w+u*N,r[2]=f*S+p*b+v*D,r[5]=f*m+p*R+v*A,r[8]=f*d+p*w+v*N,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-i*r*h+i*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,f=o*l-h*r,p=c*r-a*l,v=e*u+i*f+s*p;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/v;return t[0]=u*S,t[1]=(s*c-h*i)*S,t[2]=(o*i-s*a)*S,t[3]=f*S,t[4]=(h*e-s*l)*S,t[5]=(s*r-o*e)*S,t[6]=p*S,t[7]=(i*l-c*e)*S,t[8]=(a*e-i*r)*S,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Yl.makeScale(t,e)),this}rotate(t){return this.premultiply(Yl.makeRotation(-t)),this}translate(t,e){return this.premultiply(Yl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Yl=new se,Qh=new se().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),tf=new se().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Pg(){const n={enabled:!0,workingColorSpace:aa,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===we&&(s.r=hs(s.r),s.g=hs(s.g),s.b=hs(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===we&&(s.r=ta(s.r),s.g=ta(s.g),s.b=ta(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Is?nl:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return eo("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return eo("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[aa]:{primaries:t,whitePoint:i,transfer:nl,toXYZ:Qh,fromXYZ:tf,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:li},outputColorSpaceConfig:{drawingBufferColorSpace:li}},[li]:{primaries:t,whitePoint:i,transfer:we,toXYZ:Qh,fromXYZ:tf,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:li}}}),n}const me=Pg();function hs(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ta(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Cr;class Dg{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Cr===void 0&&(Cr=sl("canvas")),Cr.width=t.width,Cr.height=t.height;const s=Cr.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Cr}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=sl("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=hs(r[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(hs(e[i]/255)*255):e[i]=hs(e[i]);return{data:e,width:t.width,height:t.height}}else return Jt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Lg=0;class rh{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Lg++}),this.uuid=Ns(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ql(s[a].image)):r.push(ql(s[a]))}else r=ql(s);i.url=r}return e||(t.images[this.uuid]=i),i}}function ql(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Dg.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Jt("Texture: Unable to serialize Texture."),{})}let Ig=0;const jl=new X;class Pn extends mr{constructor(t=Pn.DEFAULT_IMAGE,e=Pn.DEFAULT_MAPPING,i=cs,s=cs,r=sn,a=ar,o=wi,l=di,c=Pn.DEFAULT_ANISOTROPY,h=Is){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ig++}),this.uuid=Ns(),this.name="",this.source=new rh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Xt(0,0),this.repeat=new Xt(1,1),this.center=new Xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new se,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(jl).x}get height(){return this.source.getSize(jl).y}get depth(){return this.source.getSize(jl).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){Jt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Jt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==cp)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Wc:t.x=t.x-Math.floor(t.x);break;case cs:t.x=t.x<0?0:1;break;case Xc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Wc:t.y=t.y-Math.floor(t.y);break;case cs:t.y=t.y<0?0:1;break;case Xc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Pn.DEFAULT_IMAGE=null;Pn.DEFAULT_MAPPING=cp;Pn.DEFAULT_ANISOTROPY=1;class Ze{constructor(t=0,e=0,i=0,s=1){Ze.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],p=l[5],v=l[9],S=l[2],m=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-S)<.01&&Math.abs(v-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+S)<.1&&Math.abs(v+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const R=(c+1)/2,w=(p+1)/2,D=(d+1)/2,A=(h+f)/4,N=(u+S)/4,k=(v+m)/4;return R>w&&R>D?R<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(R),s=A/i,r=N/i):w>D?w<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(w),i=A/s,r=k/s):D<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),i=N/r,s=k/r),this.set(i,s,r,e),this}let b=Math.sqrt((m-v)*(m-v)+(u-S)*(u-S)+(f-h)*(f-h));return Math.abs(b)<.001&&(b=1),this.x=(m-v)/b,this.y=(u-S)/b,this.z=(f-h)/b,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this.z=le(this.z,t.z,e.z),this.w=le(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this.z=le(this.z,t,e),this.w=le(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(le(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ug extends mr{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:sn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Ze(0,0,t,e),this.scissorTest=!1,this.viewport=new Ze(0,0,t,e);const s={width:t,height:e,depth:i.depth},r=new Pn(s);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){const e={minFilter:sn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new rh(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Wi extends Ug{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class xp extends Pn{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=bn,this.minFilter=bn,this.wrapR=cs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Ng extends Pn{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=bn,this.minFilter=bn,this.wrapR=cs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ao{constructor(t=new X(1/0,1/0,1/0),e=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Mi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Mi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Mi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Mi):Mi.fromBufferAttribute(r,a),Mi.applyMatrix4(t.matrixWorld),this.expandByPoint(Mi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),So.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),So.copy(i.boundingBox)),So.applyMatrix4(t.matrixWorld),this.union(So)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Mi),Mi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(wa),yo.subVectors(this.max,wa),Pr.subVectors(t.a,wa),Dr.subVectors(t.b,wa),Lr.subVectors(t.c,wa),Ts.subVectors(Dr,Pr),As.subVectors(Lr,Dr),Ys.subVectors(Pr,Lr);let e=[0,-Ts.z,Ts.y,0,-As.z,As.y,0,-Ys.z,Ys.y,Ts.z,0,-Ts.x,As.z,0,-As.x,Ys.z,0,-Ys.x,-Ts.y,Ts.x,0,-As.y,As.x,0,-Ys.y,Ys.x,0];return!Kl(e,Pr,Dr,Lr,yo)||(e=[1,0,0,0,1,0,0,0,1],!Kl(e,Pr,Dr,Lr,yo))?!1:(Eo.crossVectors(Ts,As),e=[Eo.x,Eo.y,Eo.z],Kl(e,Pr,Dr,Lr,yo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Mi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Mi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ts[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ts[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ts[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ts[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ts[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ts[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ts[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ts[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ts),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const ts=[new X,new X,new X,new X,new X,new X,new X,new X],Mi=new X,So=new ao,Pr=new X,Dr=new X,Lr=new X,Ts=new X,As=new X,Ys=new X,wa=new X,yo=new X,Eo=new X,qs=new X;function Kl(n,t,e,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){qs.fromArray(n,r);const o=s.x*Math.abs(qs.x)+s.y*Math.abs(qs.y)+s.z*Math.abs(qs.z),l=t.dot(qs),c=e.dot(qs),h=i.dot(qs);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Fg=new ao,Ra=new X,$l=new X;class ah{constructor(t=new X,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Fg.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ra.subVectors(t,this.center);const e=Ra.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Ra,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):($l.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ra.copy(t.center).add($l)),this.expandByPoint(Ra.copy(t.center).sub($l))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const es=new X,Zl=new X,bo=new X,ws=new X,Jl=new X,To=new X,Ql=new X;class oh{constructor(t=new X,e=new X(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,es)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=es.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(es.copy(this.origin).addScaledVector(this.direction,e),es.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Zl.copy(t).add(e).multiplyScalar(.5),bo.copy(e).sub(t).normalize(),ws.copy(this.origin).sub(Zl);const r=t.distanceTo(e)*.5,a=-this.direction.dot(bo),o=ws.dot(this.direction),l=-ws.dot(bo),c=ws.lengthSq(),h=Math.abs(1-a*a);let u,f,p,v;if(h>0)if(u=a*l-o,f=a*o-l,v=r*h,u>=0)if(f>=-v)if(f<=v){const S=1/h;u*=S,f*=S,p=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*l)+c;else f<=-v?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+f*(f+2*l)+c):f<=v?(u=0,f=Math.min(Math.max(-r,-l),r),p=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Zl).addScaledVector(bo,f),p}intersectSphere(t,e){es.subVectors(t.center,this.origin);const i=es.dot(this.direction),s=es.dot(es)-i*i,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(i=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(i=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,es)!==null}intersectTriangle(t,e,i,s,r){Jl.subVectors(e,t),To.subVectors(i,t),Ql.crossVectors(Jl,To);let a=this.direction.dot(Ql),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ws.subVectors(this.origin,t);const l=o*this.direction.dot(To.crossVectors(ws,To));if(l<0)return null;const c=o*this.direction.dot(Jl.cross(ws));if(c<0||l+c>a)return null;const h=-o*ws.dot(Ql);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class $e{constructor(t,e,i,s,r,a,o,l,c,h,u,f,p,v,S,m){$e.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,l,c,h,u,f,p,v,S,m)}set(t,e,i,s,r,a,o,l,c,h,u,f,p,v,S,m){const d=this.elements;return d[0]=t,d[4]=e,d[8]=i,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=p,d[7]=v,d[11]=S,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new $e().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinant()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();const e=this.elements,i=t.elements,s=1/Ir.setFromMatrixColumn(t,0).length(),r=1/Ir.setFromMatrixColumn(t,1).length(),a=1/Ir.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=a*h,p=a*u,v=o*h,S=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=p+v*c,e[5]=f-S*c,e[9]=-o*l,e[2]=S-f*c,e[6]=v+p*c,e[10]=a*l}else if(t.order==="YXZ"){const f=l*h,p=l*u,v=c*h,S=c*u;e[0]=f+S*o,e[4]=v*o-p,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=p*o-v,e[6]=S+f*o,e[10]=a*l}else if(t.order==="ZXY"){const f=l*h,p=l*u,v=c*h,S=c*u;e[0]=f-S*o,e[4]=-a*u,e[8]=v+p*o,e[1]=p+v*o,e[5]=a*h,e[9]=S-f*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const f=a*h,p=a*u,v=o*h,S=o*u;e[0]=l*h,e[4]=v*c-p,e[8]=f*c+S,e[1]=l*u,e[5]=S*c+f,e[9]=p*c-v,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const f=a*l,p=a*c,v=o*l,S=o*c;e[0]=l*h,e[4]=S-f*u,e[8]=v*u+p,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=p*u+v,e[10]=f-S*u}else if(t.order==="XZY"){const f=a*l,p=a*c,v=o*l,S=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+S,e[5]=a*h,e[9]=p*u-v,e[2]=v*u-p,e[6]=o*h,e[10]=S*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Og,t,Bg)}lookAt(t,e,i){const s=this.elements;return Kn.subVectors(t,e),Kn.lengthSq()===0&&(Kn.z=1),Kn.normalize(),Rs.crossVectors(i,Kn),Rs.lengthSq()===0&&(Math.abs(i.z)===1?Kn.x+=1e-4:Kn.z+=1e-4,Kn.normalize(),Rs.crossVectors(i,Kn)),Rs.normalize(),Ao.crossVectors(Kn,Rs),s[0]=Rs.x,s[4]=Ao.x,s[8]=Kn.x,s[1]=Rs.y,s[5]=Ao.y,s[9]=Kn.y,s[2]=Rs.z,s[6]=Ao.z,s[10]=Kn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],f=i[9],p=i[13],v=i[2],S=i[6],m=i[10],d=i[14],b=i[3],R=i[7],w=i[11],D=i[15],A=s[0],N=s[4],k=s[8],y=s[12],T=s[1],L=s[5],W=s[9],z=s[13],K=s[2],V=s[6],j=s[10],G=s[14],st=s[3],dt=s[7],at=s[11],ut=s[15];return r[0]=a*A+o*T+l*K+c*st,r[4]=a*N+o*L+l*V+c*dt,r[8]=a*k+o*W+l*j+c*at,r[12]=a*y+o*z+l*G+c*ut,r[1]=h*A+u*T+f*K+p*st,r[5]=h*N+u*L+f*V+p*dt,r[9]=h*k+u*W+f*j+p*at,r[13]=h*y+u*z+f*G+p*ut,r[2]=v*A+S*T+m*K+d*st,r[6]=v*N+S*L+m*V+d*dt,r[10]=v*k+S*W+m*j+d*at,r[14]=v*y+S*z+m*G+d*ut,r[3]=b*A+R*T+w*K+D*st,r[7]=b*N+R*L+w*V+D*dt,r[11]=b*k+R*W+w*j+D*at,r[15]=b*y+R*z+w*G+D*ut,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],p=t[14],v=t[3],S=t[7],m=t[11],d=t[15],b=l*p-c*f,R=o*p-c*u,w=o*f-l*u,D=a*p-c*h,A=a*f-l*h,N=a*u-o*h;return e*(S*b-m*R+d*w)-i*(v*b-m*D+d*A)+s*(v*R-S*D+d*N)-r*(v*w-S*A+m*N)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],p=t[11],v=t[12],S=t[13],m=t[14],d=t[15],b=u*m*c-S*f*c+S*l*p-o*m*p-u*l*d+o*f*d,R=v*f*c-h*m*c-v*l*p+a*m*p+h*l*d-a*f*d,w=h*S*c-v*u*c+v*o*p-a*S*p-h*o*d+a*u*d,D=v*u*l-h*S*l-v*o*f+a*S*f+h*o*m-a*u*m,A=e*b+i*R+s*w+r*D;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const N=1/A;return t[0]=b*N,t[1]=(S*f*r-u*m*r-S*s*p+i*m*p+u*s*d-i*f*d)*N,t[2]=(o*m*r-S*l*r+S*s*c-i*m*c-o*s*d+i*l*d)*N,t[3]=(u*l*r-o*f*r-u*s*c+i*f*c+o*s*p-i*l*p)*N,t[4]=R*N,t[5]=(h*m*r-v*f*r+v*s*p-e*m*p-h*s*d+e*f*d)*N,t[6]=(v*l*r-a*m*r-v*s*c+e*m*c+a*s*d-e*l*d)*N,t[7]=(a*f*r-h*l*r+h*s*c-e*f*c-a*s*p+e*l*p)*N,t[8]=w*N,t[9]=(v*u*r-h*S*r-v*i*p+e*S*p+h*i*d-e*u*d)*N,t[10]=(a*S*r-v*o*r+v*i*c-e*S*c-a*i*d+e*o*d)*N,t[11]=(h*o*r-a*u*r-h*i*c+e*u*c+a*i*p-e*o*p)*N,t[12]=D*N,t[13]=(h*S*s-v*u*s+v*i*f-e*S*f-h*i*m+e*u*m)*N,t[14]=(v*o*s-a*S*s-v*i*l+e*S*l+a*i*m-e*o*m)*N,t[15]=(a*u*s-h*o*s+h*i*l-e*u*l-a*i*f+e*o*f)*N,this}scale(t){const e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),r=1-i,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,u=o+o,f=r*c,p=r*h,v=r*u,S=a*h,m=a*u,d=o*u,b=l*c,R=l*h,w=l*u,D=i.x,A=i.y,N=i.z;return s[0]=(1-(S+d))*D,s[1]=(p+w)*D,s[2]=(v-R)*D,s[3]=0,s[4]=(p-w)*A,s[5]=(1-(f+d))*A,s[6]=(m+b)*A,s[7]=0,s[8]=(v+R)*N,s[9]=(m-b)*N,s[10]=(1-(f+S))*N,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;if(t.x=s[12],t.y=s[13],t.z=s[14],this.determinant()===0)return i.set(1,1,1),e.identity(),this;let r=Ir.set(s[0],s[1],s[2]).length();const a=Ir.set(s[4],s[5],s[6]).length(),o=Ir.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),Si.copy(this);const c=1/r,h=1/a,u=1/o;return Si.elements[0]*=c,Si.elements[1]*=c,Si.elements[2]*=c,Si.elements[4]*=h,Si.elements[5]*=h,Si.elements[6]*=h,Si.elements[8]*=u,Si.elements[9]*=u,Si.elements[10]*=u,e.setFromRotationMatrix(Si),i.x=r,i.y=a,i.z=o,this}makePerspective(t,e,i,s,r,a,o=Hi,l=!1){const c=this.elements,h=2*r/(e-t),u=2*r/(i-s),f=(e+t)/(e-t),p=(i+s)/(i-s);let v,S;if(l)v=r/(a-r),S=a*r/(a-r);else if(o===Hi)v=-(a+r)/(a-r),S=-2*a*r/(a-r);else if(o===il)v=-a/(a-r),S=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=v,c[14]=S,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,a,o=Hi,l=!1){const c=this.elements,h=2/(e-t),u=2/(i-s),f=-(e+t)/(e-t),p=-(i+s)/(i-s);let v,S;if(l)v=1/(a-r),S=a/(a-r);else if(o===Hi)v=-2/(a-r),S=-(a+r)/(a-r);else if(o===il)v=-1/(a-r),S=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=v,c[14]=S,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Ir=new X,Si=new $e,Og=new X(0,0,0),Bg=new X(1,1,1),Rs=new X,Ao=new X,Kn=new X,ef=new $e,nf=new dr;class xs{constructor(t=0,e=0,i=0,s=xs.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(le(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-le(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(le(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-le(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(le(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-le(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:Jt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return ef.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ef,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return nf.setFromEuler(this),this.setFromQuaternion(nf,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xs.DEFAULT_ORDER="XYZ";class lh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let zg=0;const sf=new X,Ur=new dr,ns=new $e,wo=new X,Ca=new X,Gg=new X,kg=new dr,rf=new X(1,0,0),af=new X(0,1,0),of=new X(0,0,1),lf={type:"added"},Hg={type:"removed"},Nr={type:"childadded",child:null},tc={type:"childremoved",child:null};class Vn extends mr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:zg++}),this.uuid=Ns(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Vn.DEFAULT_UP.clone();const t=new X,e=new xs,i=new dr,s=new X(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new $e},normalMatrix:{value:new se}}),this.matrix=new $e,this.matrixWorld=new $e,this.matrixAutoUpdate=Vn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Vn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new lh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ur.setFromAxisAngle(t,e),this.quaternion.multiply(Ur),this}rotateOnWorldAxis(t,e){return Ur.setFromAxisAngle(t,e),this.quaternion.premultiply(Ur),this}rotateX(t){return this.rotateOnAxis(rf,t)}rotateY(t){return this.rotateOnAxis(af,t)}rotateZ(t){return this.rotateOnAxis(of,t)}translateOnAxis(t,e){return sf.copy(t).applyQuaternion(this.quaternion),this.position.add(sf.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(rf,t)}translateY(t){return this.translateOnAxis(af,t)}translateZ(t){return this.translateOnAxis(of,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ns.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?wo.copy(t):wo.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Ca.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ns.lookAt(Ca,wo,this.up):ns.lookAt(wo,Ca,this.up),this.quaternion.setFromRotationMatrix(ns),s&&(ns.extractRotation(s.matrixWorld),Ur.setFromRotationMatrix(ns),this.quaternion.premultiply(Ur.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(de("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(lf),Nr.child=t,this.dispatchEvent(Nr),Nr.child=null):de("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Hg),tc.child=t,this.dispatchEvent(tc),tc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ns.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ns.multiply(t.parent.matrixWorld)),t.applyMatrix4(ns),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(lf),Nr.child=t,this.dispatchEvent(Nr),Nr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ca,t,Gg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ca,kg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),p=a(t.animations),v=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),v.length>0&&(i.nodes=v)}return i.object=s,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Vn.DEFAULT_UP=new X(0,1,0);Vn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Vn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const yi=new X,is=new X,ec=new X,ss=new X,Fr=new X,Or=new X,cf=new X,nc=new X,ic=new X,sc=new X,rc=new Ze,ac=new Ze,oc=new Ze;class pi{constructor(t=new X,e=new X,i=new X){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),yi.subVectors(t,e),s.cross(yi);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){yi.subVectors(s,e),is.subVectors(i,e),ec.subVectors(t,e);const a=yi.dot(yi),o=yi.dot(is),l=yi.dot(ec),c=is.dot(is),h=is.dot(ec),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(c*l-o*h)*f,v=(a*h-o*l)*f;return r.set(1-p-v,v,p)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,ss)===null?!1:ss.x>=0&&ss.y>=0&&ss.x+ss.y<=1}static getInterpolation(t,e,i,s,r,a,o,l){return this.getBarycoord(t,e,i,s,ss)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ss.x),l.addScaledVector(a,ss.y),l.addScaledVector(o,ss.z),l)}static getInterpolatedAttribute(t,e,i,s,r,a){return rc.setScalar(0),ac.setScalar(0),oc.setScalar(0),rc.fromBufferAttribute(t,e),ac.fromBufferAttribute(t,i),oc.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(rc,r.x),a.addScaledVector(ac,r.y),a.addScaledVector(oc,r.z),a}static isFrontFacing(t,e,i,s){return yi.subVectors(i,e),is.subVectors(t,e),yi.cross(is).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return yi.subVectors(this.c,this.b),is.subVectors(this.a,this.b),yi.cross(is).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return pi.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return pi.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return pi.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return pi.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return pi.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,r=this.c;let a,o;Fr.subVectors(s,i),Or.subVectors(r,i),nc.subVectors(t,i);const l=Fr.dot(nc),c=Or.dot(nc);if(l<=0&&c<=0)return e.copy(i);ic.subVectors(t,s);const h=Fr.dot(ic),u=Or.dot(ic);if(h>=0&&u<=h)return e.copy(s);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(i).addScaledVector(Fr,a);sc.subVectors(t,r);const p=Fr.dot(sc),v=Or.dot(sc);if(v>=0&&p<=v)return e.copy(r);const S=p*c-l*v;if(S<=0&&c>=0&&v<=0)return o=c/(c-v),e.copy(i).addScaledVector(Or,o);const m=h*v-p*u;if(m<=0&&u-h>=0&&p-v>=0)return cf.subVectors(r,s),o=(u-h)/(u-h+(p-v)),e.copy(s).addScaledVector(cf,o);const d=1/(m+S+f);return a=S*d,o=f*d,e.copy(i).addScaledVector(Fr,a).addScaledVector(Or,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const vp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Cs={h:0,s:0,l:0},Ro={h:0,s:0,l:0};function lc(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Re{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=li){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,me.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=me.workingColorSpace){return this.r=t,this.g=e,this.b=i,me.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=me.workingColorSpace){if(t=Rg(t,1),e=le(e,0,1),i=le(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=lc(a,r,t+1/3),this.g=lc(a,r,t),this.b=lc(a,r,t-1/3)}return me.colorSpaceToWorking(this,s),this}setStyle(t,e=li){function i(r){r!==void 0&&parseFloat(r)<1&&Jt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Jt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Jt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=li){const i=vp[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Jt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=hs(t.r),this.g=hs(t.g),this.b=hs(t.b),this}copyLinearToSRGB(t){return this.r=ta(t.r),this.g=ta(t.g),this.b=ta(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=li){return me.workingToColorSpace(Cn.copy(this),t),Math.round(le(Cn.r*255,0,255))*65536+Math.round(le(Cn.g*255,0,255))*256+Math.round(le(Cn.b*255,0,255))}getHexString(t=li){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=me.workingColorSpace){me.workingToColorSpace(Cn.copy(this),e);const i=Cn.r,s=Cn.g,r=Cn.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=me.workingColorSpace){return me.workingToColorSpace(Cn.copy(this),e),t.r=Cn.r,t.g=Cn.g,t.b=Cn.b,t}getStyle(t=li){me.workingToColorSpace(Cn.copy(this),t);const e=Cn.r,i=Cn.g,s=Cn.b;return t!==li?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Cs),this.setHSL(Cs.h+t,Cs.s+e,Cs.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Cs),t.getHSL(Ro);const i=Wl(Cs.h,Ro.h,e),s=Wl(Cs.s,Ro.s,e),r=Wl(Cs.l,Ro.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Cn=new Re;Re.NAMES=vp;let Vg=0;class oo extends mr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Vg++}),this.uuid=Ns(),this.name="",this.type="Material",this.blending=Qr,this.side=Fs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ic,this.blendDst=Uc,this.blendEquation=er,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Re(0,0,0),this.blendAlpha=0,this.depthFunc=ia,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Kh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Rr,this.stencilZFail=Rr,this.stencilZPass=Rr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){Jt(`Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Jt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Qr&&(i.blending=this.blending),this.side!==Fs&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ic&&(i.blendSrc=this.blendSrc),this.blendDst!==Uc&&(i.blendDst=this.blendDst),this.blendEquation!==er&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ia&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Kh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Rr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Rr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Rr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class oa extends oo{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Re(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xs,this.combine=ep,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const en=new X,Co=new Xt;let Wg=0;class Wn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Wg++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=bu,this.updateRanges=[],this.gpuType=ki,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Co.fromBufferAttribute(this,e),Co.applyMatrix3(t),this.setXY(e,Co.x,Co.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)en.fromBufferAttribute(this,e),en.applyMatrix3(t),this.setXYZ(e,en.x,en.y,en.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)en.fromBufferAttribute(this,e),en.applyMatrix4(t),this.setXYZ(e,en.x,en.y,en.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)en.fromBufferAttribute(this,e),en.applyNormalMatrix(t),this.setXYZ(e,en.x,en.y,en.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)en.fromBufferAttribute(this,e),en.transformDirection(t),this.setXYZ(e,en.x,en.y,en.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Gi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ue(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Gi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Gi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Gi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Gi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array),s=Ue(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array),s=Ue(s,this.array),r=Ue(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==bu&&(t.usage=this.usage),t}}class Mp extends Wn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Sp extends Wn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class mi extends Wn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Xg=0;const ai=new $e,cc=new Vn,Br=new X,$n=new ao,Pa=new ao,Mn=new X;class gi extends mr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Xg++}),this.uuid=Ns(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(_p(t)?Sp:Mp)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new se().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ai.makeRotationFromQuaternion(t),this.applyMatrix4(ai),this}rotateX(t){return ai.makeRotationX(t),this.applyMatrix4(ai),this}rotateY(t){return ai.makeRotationY(t),this.applyMatrix4(ai),this}rotateZ(t){return ai.makeRotationZ(t),this.applyMatrix4(ai),this}translate(t,e,i){return ai.makeTranslation(t,e,i),this.applyMatrix4(ai),this}scale(t,e,i){return ai.makeScale(t,e,i),this.applyMatrix4(ai),this}lookAt(t){return cc.lookAt(t),cc.updateMatrix(),this.applyMatrix4(cc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Br).negate(),this.translate(Br.x,Br.y,Br.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new mi(i,3))}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Jt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ao);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){de("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const r=e[i];$n.setFromBufferAttribute(r),this.morphTargetsRelative?(Mn.addVectors(this.boundingBox.min,$n.min),this.boundingBox.expandByPoint(Mn),Mn.addVectors(this.boundingBox.max,$n.max),this.boundingBox.expandByPoint(Mn)):(this.boundingBox.expandByPoint($n.min),this.boundingBox.expandByPoint($n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&de('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ah);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){de("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new X,1/0);return}if(t){const i=this.boundingSphere.center;if($n.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Pa.setFromBufferAttribute(o),this.morphTargetsRelative?(Mn.addVectors($n.min,Pa.min),$n.expandByPoint(Mn),Mn.addVectors($n.max,Pa.max),$n.expandByPoint(Mn)):($n.expandByPoint(Pa.min),$n.expandByPoint(Pa.max))}$n.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)Mn.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Mn));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Mn.fromBufferAttribute(o,c),l&&(Br.fromBufferAttribute(t,c),Mn.add(Br)),s=Math.max(s,i.distanceToSquared(Mn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&de('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){de("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Wn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let k=0;k<i.count;k++)o[k]=new X,l[k]=new X;const c=new X,h=new X,u=new X,f=new Xt,p=new Xt,v=new Xt,S=new X,m=new X;function d(k,y,T){c.fromBufferAttribute(i,k),h.fromBufferAttribute(i,y),u.fromBufferAttribute(i,T),f.fromBufferAttribute(r,k),p.fromBufferAttribute(r,y),v.fromBufferAttribute(r,T),h.sub(c),u.sub(c),p.sub(f),v.sub(f);const L=1/(p.x*v.y-v.x*p.y);isFinite(L)&&(S.copy(h).multiplyScalar(v.y).addScaledVector(u,-p.y).multiplyScalar(L),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-v.x).multiplyScalar(L),o[k].add(S),o[y].add(S),o[T].add(S),l[k].add(m),l[y].add(m),l[T].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let k=0,y=b.length;k<y;++k){const T=b[k],L=T.start,W=T.count;for(let z=L,K=L+W;z<K;z+=3)d(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const R=new X,w=new X,D=new X,A=new X;function N(k){D.fromBufferAttribute(s,k),A.copy(D);const y=o[k];R.copy(y),R.sub(D.multiplyScalar(D.dot(y))).normalize(),w.crossVectors(A,y);const L=w.dot(l[k])<0?-1:1;a.setXYZW(k,R.x,R.y,R.z,L)}for(let k=0,y=b.length;k<y;++k){const T=b[k],L=T.start,W=T.count;for(let z=L,K=L+W;z<K;z+=3)N(t.getX(z+0)),N(t.getX(z+1)),N(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Wn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const s=new X,r=new X,a=new X,o=new X,l=new X,c=new X,h=new X,u=new X;if(t)for(let f=0,p=t.count;f<p;f+=3){const v=t.getX(f+0),S=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,v),r.fromBufferAttribute(e,S),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,v),l.fromBufferAttribute(i,S),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(v,o.x,o.y,o.z),i.setXYZ(S,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=e.count;f<p;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Mn.fromBufferAttribute(t,e),Mn.normalize(),t.setXYZ(e,Mn.x,Mn.y,Mn.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let p=0,v=0;for(let S=0,m=l.length;S<m;S++){o.isInterleavedBufferAttribute?p=l[S]*o.data.stride+o.offset:p=l[S]*h;for(let d=0;d<h;d++)f[v++]=c[p++]}return new Wn(f,h,u)}if(this.index===null)return Jt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new gi,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,i);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],p=t(f,i);l.push(p)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const p=c[u];h.push(p.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const uf=new $e,js=new oh,Po=new ah,hf=new X,Do=new X,Lo=new X,Io=new X,uc=new X,Uo=new X,ff=new X,No=new X;class ti extends Vn{constructor(t=new gi,e=new oa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){Uo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(uc.fromBufferAttribute(u,t),a?Uo.addScaledVector(uc,h):Uo.addScaledVector(uc.sub(e),h))}e.add(Uo)}return e}raycast(t,e){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Po.copy(i.boundingSphere),Po.applyMatrix4(r),js.copy(t.ray).recast(t.near),!(Po.containsPoint(js.origin)===!1&&(js.intersectSphere(Po,hf)===null||js.origin.distanceToSquared(hf)>(t.far-t.near)**2))&&(uf.copy(r).invert(),js.copy(t.ray).applyMatrix4(uf),!(i.boundingBox!==null&&js.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,js)))}_computeIntersections(t,e,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let v=0,S=f.length;v<S;v++){const m=f[v],d=a[m.materialIndex],b=Math.max(m.start,p.start),R=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let w=b,D=R;w<D;w+=3){const A=o.getX(w),N=o.getX(w+1),k=o.getX(w+2);s=Fo(this,d,t,i,c,h,u,A,N,k),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const v=Math.max(0,p.start),S=Math.min(o.count,p.start+p.count);for(let m=v,d=S;m<d;m+=3){const b=o.getX(m),R=o.getX(m+1),w=o.getX(m+2);s=Fo(this,a,t,i,c,h,u,b,R,w),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let v=0,S=f.length;v<S;v++){const m=f[v],d=a[m.materialIndex],b=Math.max(m.start,p.start),R=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let w=b,D=R;w<D;w+=3){const A=w,N=w+1,k=w+2;s=Fo(this,d,t,i,c,h,u,A,N,k),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const v=Math.max(0,p.start),S=Math.min(l.count,p.start+p.count);for(let m=v,d=S;m<d;m+=3){const b=m,R=m+1,w=m+2;s=Fo(this,a,t,i,c,h,u,b,R,w),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Yg(n,t,e,i,s,r,a,o){let l;if(t.side===Hn?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,t.side===Fs,o),l===null)return null;No.copy(o),No.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(No);return c<e.near||c>e.far?null:{distance:c,point:No.clone(),object:n}}function Fo(n,t,e,i,s,r,a,o,l,c){n.getVertexPosition(o,Do),n.getVertexPosition(l,Lo),n.getVertexPosition(c,Io);const h=Yg(n,t,e,i,Do,Lo,Io,ff);if(h){const u=new X;pi.getBarycoord(ff,Do,Lo,Io,u),s&&(h.uv=pi.getInterpolatedAttribute(s,o,l,c,u,new Xt)),r&&(h.uv1=pi.getInterpolatedAttribute(r,o,l,c,u,new Xt)),a&&(h.normal=pi.getInterpolatedAttribute(a,o,l,c,u,new X),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new X,materialIndex:0};pi.getNormal(Do,Lo,Io,f.normal),h.face=f,h.barycoord=u}return h}class lo extends gi{constructor(t=1,e=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,p=0;v("z","y","x",-1,-1,i,e,t,a,r,0),v("z","y","x",1,-1,i,e,-t,a,r,1),v("x","z","y",1,1,t,i,e,s,a,2),v("x","z","y",1,-1,t,i,-e,s,a,3),v("x","y","z",1,-1,t,e,i,s,r,4),v("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new mi(c,3)),this.setAttribute("normal",new mi(h,3)),this.setAttribute("uv",new mi(u,2));function v(S,m,d,b,R,w,D,A,N,k,y){const T=w/N,L=D/k,W=w/2,z=D/2,K=A/2,V=N+1,j=k+1;let G=0,st=0;const dt=new X;for(let at=0;at<j;at++){const ut=at*L-z;for(let St=0;St<V;St++){const ht=St*T-W;dt[S]=ht*b,dt[m]=ut*R,dt[d]=K,c.push(dt.x,dt.y,dt.z),dt[S]=0,dt[m]=0,dt[d]=A>0?1:-1,h.push(dt.x,dt.y,dt.z),u.push(St/N),u.push(1-at/k),G+=1}}for(let at=0;at<k;at++)for(let ut=0;ut<N;ut++){const St=f+ut+V*at,ht=f+ut+V*(at+1),Qt=f+(ut+1)+V*(at+1),ne=f+(ut+1)+V*at;l.push(St,ht,ne),l.push(ht,Qt,ne),st+=6}o.addGroup(p,st,y),p+=st,f+=G}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new lo(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function la(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Jt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Nn(n){const t={};for(let e=0;e<n.length;e++){const i=la(n[e]);for(const s in i)t[s]=i[s]}return t}function qg(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function yp(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:me.workingColorSpace}const jg={clone:la,merge:Nn};var Kg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$g=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class qi extends oo{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Kg,this.fragmentShader=$g,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=la(t.uniforms),this.uniformsGroups=qg(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Ep extends Vn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $e,this.projectionMatrix=new $e,this.projectionMatrixInverse=new $e,this.coordinateSystem=Hi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ps=new X,df=new Xt,pf=new Xt;class hi extends Ep{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Tu*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Jo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Tu*2*Math.atan(Math.tan(Jo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Ps.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ps.x,Ps.y).multiplyScalar(-t/Ps.z),Ps.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ps.x,Ps.y).multiplyScalar(-t/Ps.z)}getViewSize(t,e){return this.getViewBounds(t,df,pf),e.subVectors(pf,df)}setViewOffset(t,e,i,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Jo*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const zr=-90,Gr=1;class Zg extends Vn{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new hi(zr,Gr,t,e);s.layers=this.layers,this.add(s);const r=new hi(zr,Gr,t,e);r.layers=this.layers,this.add(r);const a=new hi(zr,Gr,t,e);a.layers=this.layers,this.add(a);const o=new hi(zr,Gr,t,e);o.layers=this.layers,this.add(o);const l=new hi(zr,Gr,t,e);l.layers=this.layers,this.add(l);const c=new hi(zr,Gr,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===Hi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===il)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),v=t.xr.enabled;t.xr.enabled=!1;const S=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,l),t.setRenderTarget(i,4,s),t.render(e,c),i.texture.generateMipmaps=S,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,f,p),t.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class bp extends Pn{constructor(t=[],e=fr,i,s,r,a,o,l,c,h){super(t,e,i,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Tp extends Wi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new bp(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new lo(5,5,5),r=new qi({name:"CubemapFromEquirect",uniforms:la(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Hn,blending:us});r.uniforms.tEquirect.value=e;const a=new ti(s,r),o=e.minFilter;return e.minFilter===ar&&(e.minFilter=sn),new Zg(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(r)}}class Ha extends Vn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Jg={type:"move"};class hc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ha,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ha,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ha,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const S of t.hand.values()){const m=e.getJointPose(S,i),d=this._getHandJoint(c,S);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,v=.005;c.inputState.pinching&&f>p+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=p-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Jg)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Ha;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class Qg extends Vn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xs,this.environmentIntensity=1,this.environmentRotation=new xs,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class t0{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=bu,this.updateRanges=[],this.version=0,this.uuid=Ns()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ns()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ns()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Un=new X;class al{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Un.fromBufferAttribute(this,e),Un.applyMatrix4(t),this.setXYZ(e,Un.x,Un.y,Un.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Un.fromBufferAttribute(this,e),Un.applyNormalMatrix(t),this.setXYZ(e,Un.x,Un.y,Un.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Un.fromBufferAttribute(this,e),Un.transformDirection(t),this.setXYZ(e,Un.x,Un.y,Un.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=Gi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ue(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Ue(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Gi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Gi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Gi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Gi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array),s=Ue(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array),s=Ue(s,this.array),r=Ue(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){rl("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Wn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new al(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){rl("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class no extends oo{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Re(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let kr;const Da=new X,Hr=new X,Vr=new X,Wr=new Xt,La=new Xt,Ap=new $e,Oo=new X,Ia=new X,Bo=new X,mf=new Xt,fc=new Xt,gf=new Xt;class ol extends Vn{constructor(t=new no){if(super(),this.isSprite=!0,this.type="Sprite",kr===void 0){kr=new gi;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new t0(e,5);kr.setIndex([0,1,2,0,2,3]),kr.setAttribute("position",new al(i,3,0,!1)),kr.setAttribute("uv",new al(i,2,3,!1))}this.geometry=kr,this.material=t,this.center=new Xt(.5,.5),this.count=1}raycast(t,e){t.camera===null&&de('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Hr.setFromMatrixScale(this.matrixWorld),Ap.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Vr.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Hr.multiplyScalar(-Vr.z);const i=this.material.rotation;let s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));const a=this.center;zo(Oo.set(-.5,-.5,0),Vr,a,Hr,s,r),zo(Ia.set(.5,-.5,0),Vr,a,Hr,s,r),zo(Bo.set(.5,.5,0),Vr,a,Hr,s,r),mf.set(0,0),fc.set(1,0),gf.set(1,1);let o=t.ray.intersectTriangle(Oo,Ia,Bo,!1,Da);if(o===null&&(zo(Ia.set(-.5,.5,0),Vr,a,Hr,s,r),fc.set(0,1),o=t.ray.intersectTriangle(Oo,Bo,Ia,!1,Da),o===null))return;const l=t.ray.origin.distanceTo(Da);l<t.near||l>t.far||e.push({distance:l,point:Da.clone(),uv:pi.getInterpolation(Da,Oo,Ia,Bo,mf,fc,gf,new Xt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function zo(n,t,e,i,s,r){Wr.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(La.x=r*Wr.x-s*Wr.y,La.y=s*Wr.x+r*Wr.y):La.copy(Wr),n.copy(t),n.x+=La.x,n.y+=La.y,n.applyMatrix4(Ap)}class e0 extends Pn{constructor(t=null,e=1,i=1,s,r,a,o,l,c=bn,h=bn,u,f){super(null,a,o,l,c,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const dc=new X,n0=new X,i0=new se;class Ds{constructor(t=new X(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=dc.subVectors(i,e).cross(n0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(dc),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||i0.getNormalMatrix(t),s=this.coplanarPoint(dc).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ks=new ah,s0=new Xt(.5,.5),Go=new X;class wp{constructor(t=new Ds,e=new Ds,i=new Ds,s=new Ds,r=new Ds,a=new Ds){this.planes=[t,e,i,s,r,a]}set(t,e,i,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Hi,i=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],p=r[7],v=r[8],S=r[9],m=r[10],d=r[11],b=r[12],R=r[13],w=r[14],D=r[15];if(s[0].setComponents(c-a,p-h,d-v,D-b).normalize(),s[1].setComponents(c+a,p+h,d+v,D+b).normalize(),s[2].setComponents(c+o,p+u,d+S,D+R).normalize(),s[3].setComponents(c-o,p-u,d-S,D-R).normalize(),i)s[4].setComponents(l,f,m,w).normalize(),s[5].setComponents(c-l,p-f,d-m,D-w).normalize();else if(s[4].setComponents(c-l,p-f,d-m,D-w).normalize(),e===Hi)s[5].setComponents(c+l,p+f,d+m,D+w).normalize();else if(e===il)s[5].setComponents(l,f,m,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ks.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ks.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ks)}intersectsSprite(t){Ks.center.set(0,0,0);const e=s0.distanceTo(t.center);return Ks.radius=.7071067811865476+e,Ks.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ks)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(Go.x=s.normal.x>0?t.max.x:t.min.x,Go.y=s.normal.y>0?t.max.y:t.min.y,Go.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Go)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Rp extends Pn{constructor(t,e,i,s,r,a,o,l,c){super(t,e,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class io extends Pn{constructor(t,e,i=Yi,s,r,a,o=bn,l=bn,c,h=_s,u=1){if(h!==_s&&h!==or)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:u};super(f,s,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new rh(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class r0 extends io{constructor(t,e=Yi,i=fr,s,r,a=bn,o=bn,l,c=_s){const h={width:t,height:t,depth:1},u=[h,h,h,h,h,h];super(t,t,e,i,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Cp extends Pn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class vl extends gi{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,u=t/o,f=e/l,p=[],v=[],S=[],m=[];for(let d=0;d<h;d++){const b=d*f-a;for(let R=0;R<c;R++){const w=R*u-r;v.push(w,-b,0),S.push(0,0,1),m.push(R/o),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let b=0;b<o;b++){const R=b+c*d,w=b+c*(d+1),D=b+1+c*(d+1),A=b+1+c*d;p.push(R,w,A),p.push(w,D,A)}this.setIndex(p),this.setAttribute("position",new mi(v,3)),this.setAttribute("normal",new mi(S,3)),this.setAttribute("uv",new mi(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vl(t.width,t.height,t.widthSegments,t.heightSegments)}}class Ml extends gi{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new X,f=new X,p=[],v=[],S=[],m=[];for(let d=0;d<=i;d++){const b=[],R=d/i;let w=0;d===0&&a===0?w=.5/e:d===i&&l===Math.PI&&(w=-.5/e);for(let D=0;D<=e;D++){const A=D/e;u.x=-t*Math.cos(s+A*r)*Math.sin(a+R*o),u.y=t*Math.cos(a+R*o),u.z=t*Math.sin(s+A*r)*Math.sin(a+R*o),v.push(u.x,u.y,u.z),f.copy(u).normalize(),S.push(f.x,f.y,f.z),m.push(A+w,1-R),b.push(c++)}h.push(b)}for(let d=0;d<i;d++)for(let b=0;b<e;b++){const R=h[d][b+1],w=h[d][b],D=h[d+1][b],A=h[d+1][b+1];(d!==0||a>0)&&p.push(R,w,A),(d!==i-1||l<Math.PI)&&p.push(w,D,A)}this.setIndex(p),this.setAttribute("position",new mi(v,3)),this.setAttribute("normal",new mi(S,3)),this.setAttribute("uv",new mi(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ml(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class a0 extends qi{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class o0 extends oo{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_g,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class l0 extends oo{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Pp extends Ep{constructor(t=-1,e=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-t,a=i+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class c0 extends hi{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const _f=new $e;class u0{constructor(t,e,i=0,s=1/0){this.ray=new oh(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new lh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):de("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return _f.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(_f),this}intersectObject(t,e=!0,i=[]){return Au(t,this,i,e),i.sort(xf),i}intersectObjects(t,e=!0,i=[]){for(let s=0,r=t.length;s<r;s++)Au(t[s],this,i,e);return i.sort(xf),i}}function xf(n,t){return n.distance-t.distance}function Au(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let a=0,o=r.length;a<o;a++)Au(r[a],t,e,!0)}}class vf{constructor(t=1,e=0,i=0){this.radius=t,this.phi=e,this.theta=i}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=le(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(le(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class h0 extends mr{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){Jt("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function Mf(n,t,e,i){const s=f0(i);switch(e){case pp:return n*t;case gp:return n*t/s.components*s.byteLength;case th:return n*t/s.components*s.byteLength;case ra:return n*t*2/s.components*s.byteLength;case eh:return n*t*2/s.components*s.byteLength;case mp:return n*t*3/s.components*s.byteLength;case wi:return n*t*4/s.components*s.byteLength;case nh:return n*t*4/s.components*s.byteLength;case jo:case Ko:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case $o:case Zo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case qc:case Kc:return Math.max(n,16)*Math.max(t,8)/4;case Yc:case jc:return Math.max(n,8)*Math.max(t,8)/2;case $c:case Zc:case Qc:case tu:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Jc:case eu:case nu:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case iu:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case su:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case ru:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case au:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case ou:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case lu:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case cu:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case uu:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case hu:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case fu:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case du:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case pu:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case mu:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case gu:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case _u:case xu:case vu:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Mu:case Su:return Math.ceil(n/4)*Math.ceil(t/4)*8;case yu:case Eu:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function f0(n){switch(n){case di:case up:return{byteLength:1,components:1};case Qa:case hp:case gs:return{byteLength:2,components:1};case Ju:case Qu:return{byteLength:2,components:4};case Yi:case Zu:case ki:return{byteLength:4,components:1};case fp:case dp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$u}}));typeof window<"u"&&(window.__THREE__?Jt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$u);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Dp(){let n=null,t=!1,e=null,i=null;function s(r,a){e(r,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function d0(n){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const h=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,h);else{u.sort((p,v)=>p.start-v.start);let f=0;for(let p=1;p<u.length;p++){const v=u[f],S=u[p];S.start<=v.start+v.count+1?v.count=Math.max(v.count,S.start+S.count-v.start):(++f,u[f]=S)}u.length=f+1;for(let p=0,v=u.length;p<v;p++){const S=u[p];n.bufferSubData(c,S.start*h.BYTES_PER_ELEMENT,h,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(n.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var p0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,m0=`#ifdef USE_ALPHAHASH
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
#endif`,g0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,_0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,x0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,v0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,M0=`#ifdef USE_AOMAP
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
#endif`,S0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,y0=`#ifdef USE_BATCHING
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
#endif`,E0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,b0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,T0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,A0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,w0=`#ifdef USE_IRIDESCENCE
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
#endif`,R0=`#ifdef USE_BUMPMAP
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
#endif`,C0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,P0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,D0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,L0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,I0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,U0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,N0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,F0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,O0=`#define PI 3.141592653589793
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
} // validated`,B0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,z0=`vec3 transformedNormal = objectNormal;
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
#endif`,G0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,k0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,H0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,V0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,W0="gl_FragColor = linearToOutputTexel( gl_FragColor );",X0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Y0=`#ifdef USE_ENVMAP
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
#endif`,q0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,j0=`#ifdef USE_ENVMAP
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
#endif`,K0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$0=`#ifdef USE_ENVMAP
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
#endif`,Z0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,J0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Q0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,t_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,e_=`#ifdef USE_GRADIENTMAP
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
}`,n_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,i_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,s_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,r_=`uniform bool receiveShadow;
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
#endif`,a_=`#ifdef USE_ENVMAP
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
#endif`,o_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,l_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,c_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,u_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,h_=`PhysicalMaterial material;
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
#endif`,f_=`uniform sampler2D dfgLUT;
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
}`,d_=`
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
#endif`,p_=`#if defined( RE_IndirectDiffuse )
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
#endif`,m_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,g_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,__=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,x_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,v_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,M_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,S_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,y_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,E_=`#if defined( USE_POINTS_UV )
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
#endif`,b_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,T_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,A_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,w_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,R_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,C_=`#ifdef USE_MORPHTARGETS
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
#endif`,P_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,D_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,L_=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,I_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,U_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,N_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,F_=`#ifdef USE_NORMALMAP
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
#endif`,O_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,B_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,z_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,G_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,k_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,H_=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,V_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,W_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,X_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Y_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,q_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,j_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,K_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Z_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,J_=`float getShadowMask() {
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
}`,Q_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,tx=`#ifdef USE_SKINNING
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
#endif`,ex=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,nx=`#ifdef USE_SKINNING
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
#endif`,ix=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,sx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,rx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ax=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ox=`#ifdef USE_TRANSMISSION
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
#endif`,lx=`#ifdef USE_TRANSMISSION
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
#endif`,cx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ux=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const dx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,px=`uniform sampler2D t2D;
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
}`,mx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gx=`#ifdef ENVMAP_TYPE_CUBE
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
}`,_x=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vx=`#include <common>
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
}`,Mx=`#if DEPTH_PACKING == 3200
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
}`,Sx=`#define DISTANCE
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
}`,yx=`#define DISTANCE
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
}`,Ex=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,bx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tx=`uniform float scale;
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
}`,Ax=`uniform vec3 diffuse;
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
}`,wx=`#include <common>
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
}`,Rx=`uniform vec3 diffuse;
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
}`,Cx=`#define LAMBERT
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
}`,Px=`#define LAMBERT
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
}`,Dx=`#define MATCAP
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
}`,Lx=`#define MATCAP
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
}`,Ix=`#define NORMAL
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
}`,Ux=`#define NORMAL
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
}`,Nx=`#define PHONG
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
}`,Fx=`#define PHONG
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
}`,Ox=`#define STANDARD
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
}`,Bx=`#define STANDARD
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
}`,zx=`#define TOON
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
}`,Gx=`#define TOON
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
}`,kx=`uniform float size;
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
}`,Hx=`uniform vec3 diffuse;
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
}`,Vx=`#include <common>
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
}`,Wx=`uniform vec3 color;
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
}`,Xx=`uniform float rotation;
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
}`,Yx=`uniform vec3 diffuse;
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
}`,re={alphahash_fragment:p0,alphahash_pars_fragment:m0,alphamap_fragment:g0,alphamap_pars_fragment:_0,alphatest_fragment:x0,alphatest_pars_fragment:v0,aomap_fragment:M0,aomap_pars_fragment:S0,batching_pars_vertex:y0,batching_vertex:E0,begin_vertex:b0,beginnormal_vertex:T0,bsdfs:A0,iridescence_fragment:w0,bumpmap_pars_fragment:R0,clipping_planes_fragment:C0,clipping_planes_pars_fragment:P0,clipping_planes_pars_vertex:D0,clipping_planes_vertex:L0,color_fragment:I0,color_pars_fragment:U0,color_pars_vertex:N0,color_vertex:F0,common:O0,cube_uv_reflection_fragment:B0,defaultnormal_vertex:z0,displacementmap_pars_vertex:G0,displacementmap_vertex:k0,emissivemap_fragment:H0,emissivemap_pars_fragment:V0,colorspace_fragment:W0,colorspace_pars_fragment:X0,envmap_fragment:Y0,envmap_common_pars_fragment:q0,envmap_pars_fragment:j0,envmap_pars_vertex:K0,envmap_physical_pars_fragment:a_,envmap_vertex:$0,fog_vertex:Z0,fog_pars_vertex:J0,fog_fragment:Q0,fog_pars_fragment:t_,gradientmap_pars_fragment:e_,lightmap_pars_fragment:n_,lights_lambert_fragment:i_,lights_lambert_pars_fragment:s_,lights_pars_begin:r_,lights_toon_fragment:o_,lights_toon_pars_fragment:l_,lights_phong_fragment:c_,lights_phong_pars_fragment:u_,lights_physical_fragment:h_,lights_physical_pars_fragment:f_,lights_fragment_begin:d_,lights_fragment_maps:p_,lights_fragment_end:m_,logdepthbuf_fragment:g_,logdepthbuf_pars_fragment:__,logdepthbuf_pars_vertex:x_,logdepthbuf_vertex:v_,map_fragment:M_,map_pars_fragment:S_,map_particle_fragment:y_,map_particle_pars_fragment:E_,metalnessmap_fragment:b_,metalnessmap_pars_fragment:T_,morphinstance_vertex:A_,morphcolor_vertex:w_,morphnormal_vertex:R_,morphtarget_pars_vertex:C_,morphtarget_vertex:P_,normal_fragment_begin:D_,normal_fragment_maps:L_,normal_pars_fragment:I_,normal_pars_vertex:U_,normal_vertex:N_,normalmap_pars_fragment:F_,clearcoat_normal_fragment_begin:O_,clearcoat_normal_fragment_maps:B_,clearcoat_pars_fragment:z_,iridescence_pars_fragment:G_,opaque_fragment:k_,packing:H_,premultiplied_alpha_fragment:V_,project_vertex:W_,dithering_fragment:X_,dithering_pars_fragment:Y_,roughnessmap_fragment:q_,roughnessmap_pars_fragment:j_,shadowmap_pars_fragment:K_,shadowmap_pars_vertex:$_,shadowmap_vertex:Z_,shadowmask_pars_fragment:J_,skinbase_vertex:Q_,skinning_pars_vertex:tx,skinning_vertex:ex,skinnormal_vertex:nx,specularmap_fragment:ix,specularmap_pars_fragment:sx,tonemapping_fragment:rx,tonemapping_pars_fragment:ax,transmission_fragment:ox,transmission_pars_fragment:lx,uv_pars_fragment:cx,uv_pars_vertex:ux,uv_vertex:hx,worldpos_vertex:fx,background_vert:dx,background_frag:px,backgroundCube_vert:mx,backgroundCube_frag:gx,cube_vert:_x,cube_frag:xx,depth_vert:vx,depth_frag:Mx,distance_vert:Sx,distance_frag:yx,equirect_vert:Ex,equirect_frag:bx,linedashed_vert:Tx,linedashed_frag:Ax,meshbasic_vert:wx,meshbasic_frag:Rx,meshlambert_vert:Cx,meshlambert_frag:Px,meshmatcap_vert:Dx,meshmatcap_frag:Lx,meshnormal_vert:Ix,meshnormal_frag:Ux,meshphong_vert:Nx,meshphong_frag:Fx,meshphysical_vert:Ox,meshphysical_frag:Bx,meshtoon_vert:zx,meshtoon_frag:Gx,points_vert:kx,points_frag:Hx,shadow_vert:Vx,shadow_frag:Wx,sprite_vert:Xx,sprite_frag:Yx},Tt={common:{diffuse:{value:new Re(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new se},alphaMap:{value:null},alphaMapTransform:{value:new se},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new se}},envmap:{envMap:{value:null},envMapRotation:{value:new se},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new se}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new se}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new se},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new se},normalScale:{value:new Xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new se},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new se}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new se}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new se}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Re(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Re(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new se},alphaTest:{value:0},uvTransform:{value:new se}},sprite:{diffuse:{value:new Re(16777215)},opacity:{value:1},center:{value:new Xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new se},alphaMap:{value:null},alphaMapTransform:{value:new se},alphaTest:{value:0}}},Oi={basic:{uniforms:Nn([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.fog]),vertexShader:re.meshbasic_vert,fragmentShader:re.meshbasic_frag},lambert:{uniforms:Nn([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Re(0)}}]),vertexShader:re.meshlambert_vert,fragmentShader:re.meshlambert_frag},phong:{uniforms:Nn([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Re(0)},specular:{value:new Re(1118481)},shininess:{value:30}}]),vertexShader:re.meshphong_vert,fragmentShader:re.meshphong_frag},standard:{uniforms:Nn([Tt.common,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.roughnessmap,Tt.metalnessmap,Tt.fog,Tt.lights,{emissive:{value:new Re(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:re.meshphysical_vert,fragmentShader:re.meshphysical_frag},toon:{uniforms:Nn([Tt.common,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.gradientmap,Tt.fog,Tt.lights,{emissive:{value:new Re(0)}}]),vertexShader:re.meshtoon_vert,fragmentShader:re.meshtoon_frag},matcap:{uniforms:Nn([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,{matcap:{value:null}}]),vertexShader:re.meshmatcap_vert,fragmentShader:re.meshmatcap_frag},points:{uniforms:Nn([Tt.points,Tt.fog]),vertexShader:re.points_vert,fragmentShader:re.points_frag},dashed:{uniforms:Nn([Tt.common,Tt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:re.linedashed_vert,fragmentShader:re.linedashed_frag},depth:{uniforms:Nn([Tt.common,Tt.displacementmap]),vertexShader:re.depth_vert,fragmentShader:re.depth_frag},normal:{uniforms:Nn([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,{opacity:{value:1}}]),vertexShader:re.meshnormal_vert,fragmentShader:re.meshnormal_frag},sprite:{uniforms:Nn([Tt.sprite,Tt.fog]),vertexShader:re.sprite_vert,fragmentShader:re.sprite_frag},background:{uniforms:{uvTransform:{value:new se},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:re.background_vert,fragmentShader:re.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new se}},vertexShader:re.backgroundCube_vert,fragmentShader:re.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:re.cube_vert,fragmentShader:re.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:re.equirect_vert,fragmentShader:re.equirect_frag},distance:{uniforms:Nn([Tt.common,Tt.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:re.distance_vert,fragmentShader:re.distance_frag},shadow:{uniforms:Nn([Tt.lights,Tt.fog,{color:{value:new Re(0)},opacity:{value:1}}]),vertexShader:re.shadow_vert,fragmentShader:re.shadow_frag}};Oi.physical={uniforms:Nn([Oi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new se},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new se},clearcoatNormalScale:{value:new Xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new se},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new se},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new se},sheen:{value:0},sheenColor:{value:new Re(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new se},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new se},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new se},transmissionSamplerSize:{value:new Xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new se},attenuationDistance:{value:0},attenuationColor:{value:new Re(0)},specularColor:{value:new Re(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new se},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new se},anisotropyVector:{value:new Xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new se}}]),vertexShader:re.meshphysical_vert,fragmentShader:re.meshphysical_frag};const ko={r:0,b:0,g:0},$s=new xs,qx=new $e;function jx(n,t,e,i,s,r,a){const o=new Re(0);let l=r===!0?0:1,c,h,u=null,f=0,p=null;function v(R){let w=R.isScene===!0?R.background:null;return w&&w.isTexture&&(w=(R.backgroundBlurriness>0?e:t).get(w)),w}function S(R){let w=!1;const D=v(R);D===null?d(o,l):D&&D.isColor&&(d(D,1),w=!0);const A=n.xr.getEnvironmentBlendMode();A==="additive"?i.buffers.color.setClear(0,0,0,1,a):A==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||w)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(R,w){const D=v(w);D&&(D.isCubeTexture||D.mapping===xl)?(h===void 0&&(h=new ti(new lo(1,1,1),new qi({name:"BackgroundCubeMaterial",uniforms:la(Oi.backgroundCube.uniforms),vertexShader:Oi.backgroundCube.vertexShader,fragmentShader:Oi.backgroundCube.fragmentShader,side:Hn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,N,k){this.matrixWorld.copyPosition(k.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),$s.copy(w.backgroundRotation),$s.x*=-1,$s.y*=-1,$s.z*=-1,D.isCubeTexture&&D.isRenderTargetTexture===!1&&($s.y*=-1,$s.z*=-1),h.material.uniforms.envMap.value=D,h.material.uniforms.flipEnvMap.value=D.isCubeTexture&&D.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(qx.makeRotationFromEuler($s)),h.material.toneMapped=me.getTransfer(D.colorSpace)!==we,(u!==D||f!==D.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=D,f=D.version,p=n.toneMapping),h.layers.enableAll(),R.unshift(h,h.geometry,h.material,0,0,null)):D&&D.isTexture&&(c===void 0&&(c=new ti(new vl(2,2),new qi({name:"BackgroundMaterial",uniforms:la(Oi.background.uniforms),vertexShader:Oi.background.vertexShader,fragmentShader:Oi.background.fragmentShader,side:Fs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=D,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=me.getTransfer(D.colorSpace)!==we,D.matrixAutoUpdate===!0&&D.updateMatrix(),c.material.uniforms.uvTransform.value.copy(D.matrix),(u!==D||f!==D.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,u=D,f=D.version,p=n.toneMapping),c.layers.enableAll(),R.unshift(c,c.geometry,c.material,0,0,null))}function d(R,w){R.getRGB(ko,yp(n)),i.buffers.color.setClear(ko.r,ko.g,ko.b,w,a)}function b(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(R,w=1){o.set(R),l=w,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(R){l=R,d(o,l)},render:S,addToRenderList:m,dispose:b}}function Kx(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null);let r=s,a=!1;function o(T,L,W,z,K){let V=!1;const j=u(z,W,L);r!==j&&(r=j,c(r.object)),V=p(T,z,W,K),V&&v(T,z,W,K),K!==null&&t.update(K,n.ELEMENT_ARRAY_BUFFER),(V||a)&&(a=!1,w(T,L,W,z),K!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(K).buffer))}function l(){return n.createVertexArray()}function c(T){return n.bindVertexArray(T)}function h(T){return n.deleteVertexArray(T)}function u(T,L,W){const z=W.wireframe===!0;let K=i[T.id];K===void 0&&(K={},i[T.id]=K);let V=K[L.id];V===void 0&&(V={},K[L.id]=V);let j=V[z];return j===void 0&&(j=f(l()),V[z]=j),j}function f(T){const L=[],W=[],z=[];for(let K=0;K<e;K++)L[K]=0,W[K]=0,z[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:W,attributeDivisors:z,object:T,attributes:{},index:null}}function p(T,L,W,z){const K=r.attributes,V=L.attributes;let j=0;const G=W.getAttributes();for(const st in G)if(G[st].location>=0){const at=K[st];let ut=V[st];if(ut===void 0&&(st==="instanceMatrix"&&T.instanceMatrix&&(ut=T.instanceMatrix),st==="instanceColor"&&T.instanceColor&&(ut=T.instanceColor)),at===void 0||at.attribute!==ut||ut&&at.data!==ut.data)return!0;j++}return r.attributesNum!==j||r.index!==z}function v(T,L,W,z){const K={},V=L.attributes;let j=0;const G=W.getAttributes();for(const st in G)if(G[st].location>=0){let at=V[st];at===void 0&&(st==="instanceMatrix"&&T.instanceMatrix&&(at=T.instanceMatrix),st==="instanceColor"&&T.instanceColor&&(at=T.instanceColor));const ut={};ut.attribute=at,at&&at.data&&(ut.data=at.data),K[st]=ut,j++}r.attributes=K,r.attributesNum=j,r.index=z}function S(){const T=r.newAttributes;for(let L=0,W=T.length;L<W;L++)T[L]=0}function m(T){d(T,0)}function d(T,L){const W=r.newAttributes,z=r.enabledAttributes,K=r.attributeDivisors;W[T]=1,z[T]===0&&(n.enableVertexAttribArray(T),z[T]=1),K[T]!==L&&(n.vertexAttribDivisor(T,L),K[T]=L)}function b(){const T=r.newAttributes,L=r.enabledAttributes;for(let W=0,z=L.length;W<z;W++)L[W]!==T[W]&&(n.disableVertexAttribArray(W),L[W]=0)}function R(T,L,W,z,K,V,j){j===!0?n.vertexAttribIPointer(T,L,W,K,V):n.vertexAttribPointer(T,L,W,z,K,V)}function w(T,L,W,z){S();const K=z.attributes,V=W.getAttributes(),j=L.defaultAttributeValues;for(const G in V){const st=V[G];if(st.location>=0){let dt=K[G];if(dt===void 0&&(G==="instanceMatrix"&&T.instanceMatrix&&(dt=T.instanceMatrix),G==="instanceColor"&&T.instanceColor&&(dt=T.instanceColor)),dt!==void 0){const at=dt.normalized,ut=dt.itemSize,St=t.get(dt);if(St===void 0)continue;const ht=St.buffer,Qt=St.type,ne=St.bytesPerElement,Q=Qt===n.INT||Qt===n.UNSIGNED_INT||dt.gpuType===Zu;if(dt.isInterleavedBufferAttribute){const et=dt.data,bt=et.stride,kt=dt.offset;if(et.isInstancedInterleavedBuffer){for(let _t=0;_t<st.locationSize;_t++)d(st.location+_t,et.meshPerAttribute);T.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let _t=0;_t<st.locationSize;_t++)m(st.location+_t);n.bindBuffer(n.ARRAY_BUFFER,ht);for(let _t=0;_t<st.locationSize;_t++)R(st.location+_t,ut/st.locationSize,Qt,at,bt*ne,(kt+ut/st.locationSize*_t)*ne,Q)}else{if(dt.isInstancedBufferAttribute){for(let et=0;et<st.locationSize;et++)d(st.location+et,dt.meshPerAttribute);T.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let et=0;et<st.locationSize;et++)m(st.location+et);n.bindBuffer(n.ARRAY_BUFFER,ht);for(let et=0;et<st.locationSize;et++)R(st.location+et,ut/st.locationSize,Qt,at,ut*ne,ut/st.locationSize*et*ne,Q)}}else if(j!==void 0){const at=j[G];if(at!==void 0)switch(at.length){case 2:n.vertexAttrib2fv(st.location,at);break;case 3:n.vertexAttrib3fv(st.location,at);break;case 4:n.vertexAttrib4fv(st.location,at);break;default:n.vertexAttrib1fv(st.location,at)}}}}b()}function D(){k();for(const T in i){const L=i[T];for(const W in L){const z=L[W];for(const K in z)h(z[K].object),delete z[K];delete L[W]}delete i[T]}}function A(T){if(i[T.id]===void 0)return;const L=i[T.id];for(const W in L){const z=L[W];for(const K in z)h(z[K].object),delete z[K];delete L[W]}delete i[T.id]}function N(T){for(const L in i){const W=i[L];if(W[T.id]===void 0)continue;const z=W[T.id];for(const K in z)h(z[K].object),delete z[K];delete W[T.id]}}function k(){y(),a=!0,r!==s&&(r=s,c(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:k,resetDefaultState:y,dispose:D,releaseStatesOfGeometry:A,releaseStatesOfProgram:N,initAttributes:S,enableAttribute:m,disableUnusedAttributes:b}}function $x(n,t,e){let i;function s(c){i=c}function r(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function a(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),e.update(h,i,u))}function o(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let p=0;for(let v=0;v<u;v++)p+=h[v];e.update(p,i,1)}function l(c,h,u,f){if(u===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let v=0;v<c.length;v++)a(c[v],h[v],f[v]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,h,0,f,0,u);let v=0;for(let S=0;S<u;S++)v+=h[S]*f[S];e.update(v,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Zx(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const N=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(N.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(N){return!(N!==wi&&i.convert(N)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(N){const k=N===gs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(N!==di&&i.convert(N)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&N!==ki&&!k)}function l(N){if(N==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";N="mediump"}return N==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(Jt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),b=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),R=n.getParameter(n.MAX_VARYING_VECTORS),w=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),D=n.getParameter(n.MAX_SAMPLES),A=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:v,maxTextureSize:S,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:b,maxVaryings:R,maxFragmentUniforms:w,maxSamples:D,samples:A}}function Jx(n){const t=this;let e=null,i=0,s=!1,r=!1;const a=new Ds,o=new se,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||i!==0||s;return s=f,i=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,p){const v=u.clippingPlanes,S=u.clipIntersection,m=u.clipShadows,d=n.get(u);if(!s||v===null||v.length===0||r&&!m)r?h(null):c();else{const b=r?0:i,R=b*4;let w=d.clippingState||null;l.value=w,w=h(v,f,R,p);for(let D=0;D!==R;++D)w[D]=e[D];d.clippingState=w,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,f,p,v){const S=u!==null?u.length:0;let m=null;if(S!==0){if(m=l.value,v!==!0||m===null){const d=p+S*4,b=f.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<d)&&(m=new Float32Array(d));for(let R=0,w=p;R!==S;++R,w+=4)a.copy(u[R]).applyMatrix4(b,o),a.normal.toArray(m,w),m[w+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=S,t.numIntersection=0,m}}function Qx(n){let t=new WeakMap;function e(a,o){return o===Hc?a.mapping=fr:o===Vc&&(a.mapping=sa),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Hc||o===Vc)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Tp(l.height);return c.fromEquirectangularTexture(n,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}const Us=4,Sf=[.125,.215,.35,.446,.526,.582],nr=20,tv=256,Ua=new Pp,yf=new Re;let pc=null,mc=0,gc=0,_c=!1;const ev=new X;class Ef{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,s=100,r={}){const{size:a=256,position:o=ev}=r;pc=this._renderer.getRenderTarget(),mc=this._renderer.getActiveCubeFace(),gc=this._renderer.getActiveMipmapLevel(),_c=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Af(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Tf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(pc,mc,gc),this._renderer.xr.enabled=_c,t.scissorTest=!1,Xr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===fr||t.mapping===sa?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),pc=this._renderer.getRenderTarget(),mc=this._renderer.getActiveCubeFace(),gc=this._renderer.getActiveMipmapLevel(),_c=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:sn,minFilter:sn,generateMipmaps:!1,type:gs,format:wi,colorSpace:aa,depthBuffer:!1},s=bf(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bf(t,e,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=nv(r)),this._blurMaterial=sv(r,t,e),this._ggxMaterial=iv(r,t,e)}return s}_compileMaterial(t){const e=new ti(new gi,t);this._renderer.compile(e,Ua)}_sceneToCubeUV(t,e,i,s,r){const l=new hi(90,1,e,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(yf),u.toneMapping=Vi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ti(new lo,new oa({name:"PMREM.Background",side:Hn,depthWrite:!1,depthTest:!1})));const S=this._backgroundBox,m=S.material;let d=!1;const b=t.background;b?b.isColor&&(m.color.copy(b),t.background=null,d=!0):(m.color.copy(yf),d=!0);for(let R=0;R<6;R++){const w=R%3;w===0?(l.up.set(0,c[R],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[R],r.y,r.z)):w===1?(l.up.set(0,0,c[R]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[R],r.z)):(l.up.set(0,c[R],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[R]));const D=this._cubeSize;Xr(s,w*D,R>2?D:0,D,D),u.setRenderTarget(s),d&&u.render(S,l),u.render(t,l)}u.toneMapping=p,u.autoClear=f,t.background=b}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===fr||t.mapping===sa;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Af()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Tf());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;Xr(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(a,Ua)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=i}_applyGGXFilter(t,e,i){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),f=0+c*1.25,p=u*f,{_lodMax:v}=this,S=this._sizeLods[i],m=3*S*(i>v-Us?i-v+Us:0),d=4*(this._cubeSize-S);l.envMap.value=t.texture,l.roughness.value=p,l.mipInt.value=v-e,Xr(r,m,d,3*S,2*S),s.setRenderTarget(r),s.render(o,Ua),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=v-i,Xr(t,m,d,3*S,2*S),s.setRenderTarget(t),s.render(o,Ua)}_blur(t,e,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",r),this._halfBlur(a,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&de("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[s];u.material=c;const f=c.uniforms,p=this._sizeLods[i]-1,v=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*nr-1),S=r/v,m=isFinite(r)?1+Math.floor(h*S):nr;m>nr&&Jt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${nr}`);const d=[];let b=0;for(let N=0;N<nr;++N){const k=N/S,y=Math.exp(-k*k/2);d.push(y),N===0?b+=y:N<m&&(b+=2*y)}for(let N=0;N<d.length;N++)d[N]=d[N]/b;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:R}=this;f.dTheta.value=v,f.mipInt.value=R-i;const w=this._sizeLods[s],D=3*w*(s>R-Us?s-R+Us:0),A=4*(this._cubeSize-w);Xr(e,D,A,3*w,2*w),l.setRenderTarget(e),l.render(u,Ua)}}function nv(n){const t=[],e=[],i=[];let s=n;const r=n-Us+1+Sf.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>n-Us?l=Sf[a-n+Us-1]:a===0&&(l=0),e.push(l);const c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,v=6,S=3,m=2,d=1,b=new Float32Array(S*v*p),R=new Float32Array(m*v*p),w=new Float32Array(d*v*p);for(let A=0;A<p;A++){const N=A%3*2/3-1,k=A>2?0:-1,y=[N,k,0,N+2/3,k,0,N+2/3,k+1,0,N,k,0,N+2/3,k+1,0,N,k+1,0];b.set(y,S*v*A),R.set(f,m*v*A);const T=[A,A,A,A,A,A];w.set(T,d*v*A)}const D=new gi;D.setAttribute("position",new Wn(b,S)),D.setAttribute("uv",new Wn(R,m)),D.setAttribute("faceIndex",new Wn(w,d)),i.push(new ti(D,null)),s>Us&&s--}return{lodMeshes:i,sizeLods:t,sigmas:e}}function bf(n,t,e){const i=new Wi(n,t,e);return i.texture.mapping=xl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Xr(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function iv(n,t,e){return new qi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:tv,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Sl(),fragmentShader:`

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
		`,blending:us,depthTest:!1,depthWrite:!1})}function sv(n,t,e){const i=new Float32Array(nr),s=new X(0,1,0);return new qi({name:"SphericalGaussianBlur",defines:{n:nr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Sl(),fragmentShader:`

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
		`,blending:us,depthTest:!1,depthWrite:!1})}function Tf(){return new qi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Sl(),fragmentShader:`

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
		`,blending:us,depthTest:!1,depthWrite:!1})}function Af(){return new qi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Sl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:us,depthTest:!1,depthWrite:!1})}function Sl(){return`

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
	`}function rv(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Hc||l===Vc,h=l===fr||l===sa;if(c||h){let u=t.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new Ef(n)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return c&&p&&p.height>0||h&&p&&s(p)?(e===null&&(e=new Ef(n)),u=c?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function av(n){const t={};function e(i){if(t[i]!==void 0)return t[i];const s=n.getExtension(i);return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&eo("WebGLRenderer: "+i+" extension not supported."),s}}}function ov(n,t,e,i){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const v in f.attributes)t.remove(f.attributes[v]);f.removeEventListener("dispose",a),delete s[f.id];const p=r.get(f);p&&(t.remove(p),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function l(u){const f=u.attributes;for(const p in f)t.update(f[p],n.ARRAY_BUFFER)}function c(u){const f=[],p=u.index,v=u.attributes.position;let S=0;if(p!==null){const b=p.array;S=p.version;for(let R=0,w=b.length;R<w;R+=3){const D=b[R+0],A=b[R+1],N=b[R+2];f.push(D,A,A,N,N,D)}}else if(v!==void 0){const b=v.array;S=v.version;for(let R=0,w=b.length/3-1;R<w;R+=3){const D=R+0,A=R+1,N=R+2;f.push(D,A,A,N,N,D)}}else return;const m=new(_p(f)?Sp:Mp)(f,1);m.version=S;const d=r.get(u);d&&t.remove(d),r.set(u,m)}function h(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function lv(n,t,e){let i;function s(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,p){n.drawElements(i,p,r,f*a),e.update(p,i,1)}function c(f,p,v){v!==0&&(n.drawElementsInstanced(i,p,r,f*a,v),e.update(p,i,v))}function h(f,p,v){if(v===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,f,0,v);let m=0;for(let d=0;d<v;d++)m+=p[d];e.update(m,i,1)}function u(f,p,v,S){if(v===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)c(f[d]/a,p[d],S[d]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,r,f,0,S,0,v);let d=0;for(let b=0;b<v;b++)d+=p[b]*S[b];e.update(d,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function cv(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(r/3);break;case n.LINES:e.lines+=o*(r/2);break;case n.LINE_STRIP:e.lines+=o*(r-1);break;case n.LINE_LOOP:e.lines+=o*r;break;case n.POINTS:e.points+=o*r;break;default:de("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function uv(n,t,e){const i=new WeakMap,s=new Ze;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=i.get(o);if(f===void 0||f.count!==u){let T=function(){k.dispose(),i.delete(o),o.removeEventListener("dispose",T)};var p=T;f!==void 0&&f.texture.dispose();const v=o.morphAttributes.position!==void 0,S=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],b=o.morphAttributes.normal||[],R=o.morphAttributes.color||[];let w=0;v===!0&&(w=1),S===!0&&(w=2),m===!0&&(w=3);let D=o.attributes.position.count*w,A=1;D>t.maxTextureSize&&(A=Math.ceil(D/t.maxTextureSize),D=t.maxTextureSize);const N=new Float32Array(D*A*4*u),k=new xp(N,D,A,u);k.type=ki,k.needsUpdate=!0;const y=w*4;for(let L=0;L<u;L++){const W=d[L],z=b[L],K=R[L],V=D*A*4*L;for(let j=0;j<W.count;j++){const G=j*y;v===!0&&(s.fromBufferAttribute(W,j),N[V+G+0]=s.x,N[V+G+1]=s.y,N[V+G+2]=s.z,N[V+G+3]=0),S===!0&&(s.fromBufferAttribute(z,j),N[V+G+4]=s.x,N[V+G+5]=s.y,N[V+G+6]=s.z,N[V+G+7]=0),m===!0&&(s.fromBufferAttribute(K,j),N[V+G+8]=s.x,N[V+G+9]=s.y,N[V+G+10]=s.z,N[V+G+11]=K.itemSize===4?s.w:1)}}f={count:u,texture:k,size:new Xt(D,A)},i.set(o,f),o.addEventListener("dispose",T)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let v=0;for(let m=0;m<c.length;m++)v+=c[m];const S=o.morphTargetsRelative?1:1-v;l.getUniforms().setValue(n,"morphTargetBaseInfluence",S),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function hv(n,t,e,i){let s=new WeakMap;function r(l){const c=i.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}const fv={[np]:"LINEAR_TONE_MAPPING",[ip]:"REINHARD_TONE_MAPPING",[sp]:"CINEON_TONE_MAPPING",[rp]:"ACES_FILMIC_TONE_MAPPING",[op]:"AGX_TONE_MAPPING",[lp]:"NEUTRAL_TONE_MAPPING",[ap]:"CUSTOM_TONE_MAPPING"};function dv(n,t,e,i,s){const r=new Wi(t,e,{type:n,depthBuffer:i,stencilBuffer:s}),a=new Wi(t,e,{type:gs,depthBuffer:!1,stencilBuffer:!1}),o=new gi;o.setAttribute("position",new mi([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new mi([0,2,0,0,2,0],2));const l=new a0({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),c=new ti(o,l),h=new Pp(-1,1,1,-1,0,1);let u=null,f=null,p=!1,v,S=null,m=[],d=!1;this.setSize=function(b,R){r.setSize(b,R),a.setSize(b,R);for(let w=0;w<m.length;w++){const D=m[w];D.setSize&&D.setSize(b,R)}},this.setEffects=function(b){m=b,d=m.length>0&&m[0].isRenderPass===!0;const R=r.width,w=r.height;for(let D=0;D<m.length;D++){const A=m[D];A.setSize&&A.setSize(R,w)}},this.begin=function(b,R){if(p||b.toneMapping===Vi&&m.length===0)return!1;if(S=R,R!==null){const w=R.width,D=R.height;(r.width!==w||r.height!==D)&&this.setSize(w,D)}return d===!1&&b.setRenderTarget(r),v=b.toneMapping,b.toneMapping=Vi,!0},this.hasRenderPass=function(){return d},this.end=function(b,R){b.toneMapping=v,p=!0;let w=r,D=a;for(let A=0;A<m.length;A++){const N=m[A];if(N.enabled!==!1&&(N.render(b,D,w,R),N.needsSwap!==!1)){const k=w;w=D,D=k}}if(u!==b.outputColorSpace||f!==b.toneMapping){u=b.outputColorSpace,f=b.toneMapping,l.defines={},me.getTransfer(u)===we&&(l.defines.SRGB_TRANSFER="");const A=fv[f];A&&(l.defines[A]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=w.texture,b.setRenderTarget(S),b.render(c,h),S=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){r.dispose(),a.dispose(),o.dispose(),l.dispose()}}const Lp=new Pn,wu=new io(1,1),Ip=new xp,Up=new Ng,Np=new bp,wf=[],Rf=[],Cf=new Float32Array(16),Pf=new Float32Array(9),Df=new Float32Array(4);function pa(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let r=wf[s];if(r===void 0&&(r=new Float32Array(s),wf[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(r,o)}return r}function fn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function dn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function yl(n,t){let e=Rf[t];e===void 0&&(e=new Int32Array(t),Rf[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function pv(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function mv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(fn(e,t))return;n.uniform2fv(this.addr,t),dn(e,t)}}function gv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(fn(e,t))return;n.uniform3fv(this.addr,t),dn(e,t)}}function _v(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(fn(e,t))return;n.uniform4fv(this.addr,t),dn(e,t)}}function xv(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(fn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),dn(e,t)}else{if(fn(e,i))return;Df.set(i),n.uniformMatrix2fv(this.addr,!1,Df),dn(e,i)}}function vv(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(fn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),dn(e,t)}else{if(fn(e,i))return;Pf.set(i),n.uniformMatrix3fv(this.addr,!1,Pf),dn(e,i)}}function Mv(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(fn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),dn(e,t)}else{if(fn(e,i))return;Cf.set(i),n.uniformMatrix4fv(this.addr,!1,Cf),dn(e,i)}}function Sv(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function yv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(fn(e,t))return;n.uniform2iv(this.addr,t),dn(e,t)}}function Ev(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(fn(e,t))return;n.uniform3iv(this.addr,t),dn(e,t)}}function bv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(fn(e,t))return;n.uniform4iv(this.addr,t),dn(e,t)}}function Tv(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Av(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(fn(e,t))return;n.uniform2uiv(this.addr,t),dn(e,t)}}function wv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(fn(e,t))return;n.uniform3uiv(this.addr,t),dn(e,t)}}function Rv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(fn(e,t))return;n.uniform4uiv(this.addr,t),dn(e,t)}}function Cv(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(wu.compareFunction=e.isReversedDepthBuffer()?sh:ih,r=wu):r=Lp,e.setTexture2D(t||r,s)}function Pv(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Up,s)}function Dv(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Np,s)}function Lv(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Ip,s)}function Iv(n){switch(n){case 5126:return pv;case 35664:return mv;case 35665:return gv;case 35666:return _v;case 35674:return xv;case 35675:return vv;case 35676:return Mv;case 5124:case 35670:return Sv;case 35667:case 35671:return yv;case 35668:case 35672:return Ev;case 35669:case 35673:return bv;case 5125:return Tv;case 36294:return Av;case 36295:return wv;case 36296:return Rv;case 35678:case 36198:case 36298:case 36306:case 35682:return Cv;case 35679:case 36299:case 36307:return Pv;case 35680:case 36300:case 36308:case 36293:return Dv;case 36289:case 36303:case 36311:case 36292:return Lv}}function Uv(n,t){n.uniform1fv(this.addr,t)}function Nv(n,t){const e=pa(t,this.size,2);n.uniform2fv(this.addr,e)}function Fv(n,t){const e=pa(t,this.size,3);n.uniform3fv(this.addr,e)}function Ov(n,t){const e=pa(t,this.size,4);n.uniform4fv(this.addr,e)}function Bv(n,t){const e=pa(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function zv(n,t){const e=pa(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Gv(n,t){const e=pa(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function kv(n,t){n.uniform1iv(this.addr,t)}function Hv(n,t){n.uniform2iv(this.addr,t)}function Vv(n,t){n.uniform3iv(this.addr,t)}function Wv(n,t){n.uniform4iv(this.addr,t)}function Xv(n,t){n.uniform1uiv(this.addr,t)}function Yv(n,t){n.uniform2uiv(this.addr,t)}function qv(n,t){n.uniform3uiv(this.addr,t)}function jv(n,t){n.uniform4uiv(this.addr,t)}function Kv(n,t,e){const i=this.cache,s=t.length,r=yl(e,s);fn(i,r)||(n.uniform1iv(this.addr,r),dn(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=wu:a=Lp;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function $v(n,t,e){const i=this.cache,s=t.length,r=yl(e,s);fn(i,r)||(n.uniform1iv(this.addr,r),dn(i,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Up,r[a])}function Zv(n,t,e){const i=this.cache,s=t.length,r=yl(e,s);fn(i,r)||(n.uniform1iv(this.addr,r),dn(i,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Np,r[a])}function Jv(n,t,e){const i=this.cache,s=t.length,r=yl(e,s);fn(i,r)||(n.uniform1iv(this.addr,r),dn(i,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Ip,r[a])}function Qv(n){switch(n){case 5126:return Uv;case 35664:return Nv;case 35665:return Fv;case 35666:return Ov;case 35674:return Bv;case 35675:return zv;case 35676:return Gv;case 5124:case 35670:return kv;case 35667:case 35671:return Hv;case 35668:case 35672:return Vv;case 35669:case 35673:return Wv;case 5125:return Xv;case 36294:return Yv;case 36295:return qv;case 36296:return jv;case 35678:case 36198:case 36298:case 36306:case 35682:return Kv;case 35679:case 36299:case 36307:return $v;case 35680:case 36300:case 36308:case 36293:return Zv;case 36289:case 36303:case 36311:case 36292:return Jv}}class tM{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Iv(e.type)}}class eM{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Qv(e.type)}}class nM{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],i)}}}const xc=/(\w+)(\])?(\[|\.)?/g;function Lf(n,t){n.seq.push(t),n.map[t.id]=t}function iM(n,t,e){const i=n.name,s=i.length;for(xc.lastIndex=0;;){const r=xc.exec(i),a=xc.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Lf(e,c===void 0?new tM(o,n,t):new eM(o,n,t));break}else{let u=e.map[o];u===void 0&&(u=new nM(o),Lf(e,u)),e=u}}}class Qo{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);iM(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,i,s){const r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&i.push(a)}return i}}function If(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const sM=37297;let rM=0;function aM(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const Uf=new se;function oM(n){me._getMatrix(Uf,me.workingColorSpace,n);const t=`mat3( ${Uf.elements.map(e=>e.toFixed(4))} )`;switch(me.getTransfer(n)){case nl:return[t,"LinearTransferOETF"];case we:return[t,"sRGBTransferOETF"];default:return Jt("WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Nf(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+aM(n.getShaderSource(t),o)}else return r}function lM(n,t){const e=oM(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const cM={[np]:"Linear",[ip]:"Reinhard",[sp]:"Cineon",[rp]:"ACESFilmic",[op]:"AgX",[lp]:"Neutral",[ap]:"Custom"};function uM(n,t){const e=cM[t];return e===void 0?(Jt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ho=new X;function hM(){me.getLuminanceCoefficients(Ho);const n=Ho.x.toFixed(4),t=Ho.y.toFixed(4),e=Ho.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function fM(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Va).join(`
`)}function dM(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function pM(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(t,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function Va(n){return n!==""}function Ff(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Of(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const mM=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ru(n){return n.replace(mM,_M)}const gM=new Map;function _M(n,t){let e=re[t];if(e===void 0){const i=gM.get(t);if(i!==void 0)e=re[i],Jt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Ru(e)}const xM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Bf(n){return n.replace(xM,vM)}function vM(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function zf(n){let t=`precision ${n.precision} float;
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
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const MM={[qo]:"SHADOWMAP_TYPE_PCF",[ka]:"SHADOWMAP_TYPE_VSM"};function SM(n){return MM[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const yM={[fr]:"ENVMAP_TYPE_CUBE",[sa]:"ENVMAP_TYPE_CUBE",[xl]:"ENVMAP_TYPE_CUBE_UV"};function EM(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":yM[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const bM={[sa]:"ENVMAP_MODE_REFRACTION"};function TM(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":bM[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const AM={[ep]:"ENVMAP_BLENDING_MULTIPLY",[pg]:"ENVMAP_BLENDING_MIX",[mg]:"ENVMAP_BLENDING_ADD"};function wM(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":AM[n.combine]||"ENVMAP_BLENDING_NONE"}function RM(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function CM(n,t,e,i){const s=n.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=SM(e),c=EM(e),h=TM(e),u=wM(e),f=RM(e),p=fM(e),v=dM(r),S=s.createProgram();let m,d,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Va).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Va).join(`
`),d.length>0&&(d+=`
`)):(m=[zf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Va).join(`
`),d=[zf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Vi?"#define TONE_MAPPING":"",e.toneMapping!==Vi?re.tonemapping_pars_fragment:"",e.toneMapping!==Vi?uM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",re.colorspace_pars_fragment,lM("linearToOutputTexel",e.outputColorSpace),hM(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Va).join(`
`)),a=Ru(a),a=Ff(a,e),a=Of(a,e),o=Ru(o),o=Ff(o,e),o=Of(o,e),a=Bf(a),o=Bf(o),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",e.glslVersion===$h?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===$h?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const R=b+m+a,w=b+d+o,D=If(s,s.VERTEX_SHADER,R),A=If(s,s.FRAGMENT_SHADER,w);s.attachShader(S,D),s.attachShader(S,A),e.index0AttributeName!==void 0?s.bindAttribLocation(S,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S);function N(L){if(n.debug.checkShaderErrors){const W=s.getProgramInfoLog(S)||"",z=s.getShaderInfoLog(D)||"",K=s.getShaderInfoLog(A)||"",V=W.trim(),j=z.trim(),G=K.trim();let st=!0,dt=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(st=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,S,D,A);else{const at=Nf(s,D,"vertex"),ut=Nf(s,A,"fragment");de("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+V+`
`+at+`
`+ut)}else V!==""?Jt("WebGLProgram: Program Info Log:",V):(j===""||G==="")&&(dt=!1);dt&&(L.diagnostics={runnable:st,programLog:V,vertexShader:{log:j,prefix:m},fragmentShader:{log:G,prefix:d}})}s.deleteShader(D),s.deleteShader(A),k=new Qo(s,S),y=pM(s,S)}let k;this.getUniforms=function(){return k===void 0&&N(this),k};let y;this.getAttributes=function(){return y===void 0&&N(this),y};let T=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=s.getProgramParameter(S,sM)),T},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=rM++,this.cacheKey=t,this.usedTimes=1,this.program=S,this.vertexShader=D,this.fragmentShader=A,this}let PM=0;class DM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new LM(t),e.set(t,i)),i}}class LM{constructor(t){this.id=PM++,this.code=t,this.usedTimes=0}}function IM(n,t,e,i,s,r,a){const o=new lh,l=new DM,c=new Set,h=[],u=new Map,f=s.logarithmicDepthBuffer;let p=s.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function S(y){return c.add(y),y===0?"uv":`uv${y}`}function m(y,T,L,W,z){const K=W.fog,V=z.geometry,j=y.isMeshStandardMaterial?W.environment:null,G=(y.isMeshStandardMaterial?e:t).get(y.envMap||j),st=G&&G.mapping===xl?G.image.height:null,dt=v[y.type];y.precision!==null&&(p=s.getMaxPrecision(y.precision),p!==y.precision&&Jt("WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));const at=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ut=at!==void 0?at.length:0;let St=0;V.morphAttributes.position!==void 0&&(St=1),V.morphAttributes.normal!==void 0&&(St=2),V.morphAttributes.color!==void 0&&(St=3);let ht,Qt,ne,Q;if(dt){const ve=Oi[dt];ht=ve.vertexShader,Qt=ve.fragmentShader}else ht=y.vertexShader,Qt=y.fragmentShader,l.update(y),ne=l.getVertexShaderID(y),Q=l.getFragmentShaderID(y);const et=n.getRenderTarget(),bt=n.state.buffers.depth.getReversed(),kt=z.isInstancedMesh===!0,_t=z.isBatchedMesh===!0,te=!!y.map,Ce=!!y.matcap,Yt=!!G,ae=!!y.aoMap,fe=!!y.lightMap,qt=!!y.bumpMap,Be=!!y.normalMap,F=!!y.displacementMap,Pe=!!y.emissiveMap,jt=!!y.metalnessMap,pe=!!y.roughnessMap,Dt=y.anisotropy>0,P=y.clearcoat>0,x=y.dispersion>0,U=y.iridescence>0,Z=y.sheen>0,nt=y.transmission>0,tt=Dt&&!!y.anisotropyMap,Nt=P&&!!y.clearcoatMap,mt=P&&!!y.clearcoatNormalMap,Lt=P&&!!y.clearcoatRoughnessMap,Bt=U&&!!y.iridescenceMap,ot=U&&!!y.iridescenceThicknessMap,pt=Z&&!!y.sheenColorMap,At=Z&&!!y.sheenRoughnessMap,Ot=!!y.specularMap,xt=!!y.specularColorMap,Kt=!!y.specularIntensityMap,O=nt&&!!y.transmissionMap,yt=nt&&!!y.thicknessMap,lt=!!y.gradientMap,wt=!!y.alphaMap,ft=y.alphaTest>0,rt=!!y.alphaHash,vt=!!y.extensions;let $t=Vi;y.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&($t=n.toneMapping);const De={shaderID:dt,shaderType:y.type,shaderName:y.name,vertexShader:ht,fragmentShader:Qt,defines:y.defines,customVertexShaderID:ne,customFragmentShaderID:Q,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:_t,batchingColor:_t&&z._colorsTexture!==null,instancing:kt,instancingColor:kt&&z.instanceColor!==null,instancingMorph:kt&&z.morphTexture!==null,outputColorSpace:et===null?n.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:aa,alphaToCoverage:!!y.alphaToCoverage,map:te,matcap:Ce,envMap:Yt,envMapMode:Yt&&G.mapping,envMapCubeUVHeight:st,aoMap:ae,lightMap:fe,bumpMap:qt,normalMap:Be,displacementMap:F,emissiveMap:Pe,normalMapObjectSpace:Be&&y.normalMapType===vg,normalMapTangentSpace:Be&&y.normalMapType===xg,metalnessMap:jt,roughnessMap:pe,anisotropy:Dt,anisotropyMap:tt,clearcoat:P,clearcoatMap:Nt,clearcoatNormalMap:mt,clearcoatRoughnessMap:Lt,dispersion:x,iridescence:U,iridescenceMap:Bt,iridescenceThicknessMap:ot,sheen:Z,sheenColorMap:pt,sheenRoughnessMap:At,specularMap:Ot,specularColorMap:xt,specularIntensityMap:Kt,transmission:nt,transmissionMap:O,thicknessMap:yt,gradientMap:lt,opaque:y.transparent===!1&&y.blending===Qr&&y.alphaToCoverage===!1,alphaMap:wt,alphaTest:ft,alphaHash:rt,combine:y.combine,mapUv:te&&S(y.map.channel),aoMapUv:ae&&S(y.aoMap.channel),lightMapUv:fe&&S(y.lightMap.channel),bumpMapUv:qt&&S(y.bumpMap.channel),normalMapUv:Be&&S(y.normalMap.channel),displacementMapUv:F&&S(y.displacementMap.channel),emissiveMapUv:Pe&&S(y.emissiveMap.channel),metalnessMapUv:jt&&S(y.metalnessMap.channel),roughnessMapUv:pe&&S(y.roughnessMap.channel),anisotropyMapUv:tt&&S(y.anisotropyMap.channel),clearcoatMapUv:Nt&&S(y.clearcoatMap.channel),clearcoatNormalMapUv:mt&&S(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Lt&&S(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Bt&&S(y.iridescenceMap.channel),iridescenceThicknessMapUv:ot&&S(y.iridescenceThicknessMap.channel),sheenColorMapUv:pt&&S(y.sheenColorMap.channel),sheenRoughnessMapUv:At&&S(y.sheenRoughnessMap.channel),specularMapUv:Ot&&S(y.specularMap.channel),specularColorMapUv:xt&&S(y.specularColorMap.channel),specularIntensityMapUv:Kt&&S(y.specularIntensityMap.channel),transmissionMapUv:O&&S(y.transmissionMap.channel),thicknessMapUv:yt&&S(y.thicknessMap.channel),alphaMapUv:wt&&S(y.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(Be||Dt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!V.attributes.uv&&(te||wt),fog:!!K,useFog:y.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:bt,skinning:z.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:ut,morphTextureStride:St,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:$t,decodeVideoTexture:te&&y.map.isVideoTexture===!0&&me.getTransfer(y.map.colorSpace)===we,decodeVideoTextureEmissive:Pe&&y.emissiveMap.isVideoTexture===!0&&me.getTransfer(y.emissiveMap.colorSpace)===we,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===zi,flipSided:y.side===Hn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:vt&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(vt&&y.extensions.multiDraw===!0||_t)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return De.vertexUv1s=c.has(1),De.vertexUv2s=c.has(2),De.vertexUv3s=c.has(3),c.clear(),De}function d(y){const T=[];if(y.shaderID?T.push(y.shaderID):(T.push(y.customVertexShaderID),T.push(y.customFragmentShaderID)),y.defines!==void 0)for(const L in y.defines)T.push(L),T.push(y.defines[L]);return y.isRawShaderMaterial===!1&&(b(T,y),R(T,y),T.push(n.outputColorSpace)),T.push(y.customProgramCacheKey),T.join()}function b(y,T){y.push(T.precision),y.push(T.outputColorSpace),y.push(T.envMapMode),y.push(T.envMapCubeUVHeight),y.push(T.mapUv),y.push(T.alphaMapUv),y.push(T.lightMapUv),y.push(T.aoMapUv),y.push(T.bumpMapUv),y.push(T.normalMapUv),y.push(T.displacementMapUv),y.push(T.emissiveMapUv),y.push(T.metalnessMapUv),y.push(T.roughnessMapUv),y.push(T.anisotropyMapUv),y.push(T.clearcoatMapUv),y.push(T.clearcoatNormalMapUv),y.push(T.clearcoatRoughnessMapUv),y.push(T.iridescenceMapUv),y.push(T.iridescenceThicknessMapUv),y.push(T.sheenColorMapUv),y.push(T.sheenRoughnessMapUv),y.push(T.specularMapUv),y.push(T.specularColorMapUv),y.push(T.specularIntensityMapUv),y.push(T.transmissionMapUv),y.push(T.thicknessMapUv),y.push(T.combine),y.push(T.fogExp2),y.push(T.sizeAttenuation),y.push(T.morphTargetsCount),y.push(T.morphAttributeCount),y.push(T.numDirLights),y.push(T.numPointLights),y.push(T.numSpotLights),y.push(T.numSpotLightMaps),y.push(T.numHemiLights),y.push(T.numRectAreaLights),y.push(T.numDirLightShadows),y.push(T.numPointLightShadows),y.push(T.numSpotLightShadows),y.push(T.numSpotLightShadowsWithMaps),y.push(T.numLightProbes),y.push(T.shadowMapType),y.push(T.toneMapping),y.push(T.numClippingPlanes),y.push(T.numClipIntersection),y.push(T.depthPacking)}function R(y,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),y.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),y.push(o.mask)}function w(y){const T=v[y.type];let L;if(T){const W=Oi[T];L=jg.clone(W.uniforms)}else L=y.uniforms;return L}function D(y,T){let L=u.get(T);return L!==void 0?++L.usedTimes:(L=new CM(n,T,y,r),h.push(L),u.set(T,L)),L}function A(y){if(--y.usedTimes===0){const T=h.indexOf(y);h[T]=h[h.length-1],h.pop(),u.delete(y.cacheKey),y.destroy()}}function N(y){l.remove(y)}function k(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:w,acquireProgram:D,releaseProgram:A,releaseShaderCache:N,programs:h,dispose:k}}function UM(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function NM(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Gf(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function kf(){const n=[];let t=0;const e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function a(u,f,p,v,S,m){let d=n[t];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:v,renderOrder:u.renderOrder,z:S,group:m},n[t]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=v,d.renderOrder=u.renderOrder,d.z=S,d.group=m),t++,d}function o(u,f,p,v,S,m){const d=a(u,f,p,v,S,m);p.transmission>0?i.push(d):p.transparent===!0?s.push(d):e.push(d)}function l(u,f,p,v,S,m){const d=a(u,f,p,v,S,m);p.transmission>0?i.unshift(d):p.transparent===!0?s.unshift(d):e.unshift(d)}function c(u,f){e.length>1&&e.sort(u||NM),i.length>1&&i.sort(f||Gf),s.length>1&&s.sort(f||Gf)}function h(){for(let u=t,f=n.length;u<f;u++){const p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function FM(){let n=new WeakMap;function t(i,s){const r=n.get(i);let a;return r===void 0?(a=new kf,n.set(i,[a])):s>=r.length?(a=new kf,r.push(a)):a=r[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function OM(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new X,color:new Re};break;case"SpotLight":e={position:new X,direction:new X,color:new Re,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new X,color:new Re,distance:0,decay:0};break;case"HemisphereLight":e={direction:new X,skyColor:new Re,groundColor:new Re};break;case"RectAreaLight":e={color:new Re,position:new X,halfWidth:new X,halfHeight:new X};break}return n[t.id]=e,e}}}function BM(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let zM=0;function GM(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function kM(n){const t=new OM,e=BM(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new X);const s=new X,r=new $e,a=new $e;function o(c){let h=0,u=0,f=0;for(let y=0;y<9;y++)i.probe[y].set(0,0,0);let p=0,v=0,S=0,m=0,d=0,b=0,R=0,w=0,D=0,A=0,N=0;c.sort(GM);for(let y=0,T=c.length;y<T;y++){const L=c[y],W=L.color,z=L.intensity,K=L.distance;let V=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===ra?V=L.shadow.map.texture:V=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=W.r*z,u+=W.g*z,f+=W.b*z;else if(L.isLightProbe){for(let j=0;j<9;j++)i.probe[j].addScaledVector(L.sh.coefficients[j],z);N++}else if(L.isDirectionalLight){const j=t.get(L);if(j.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const G=L.shadow,st=e.get(L);st.shadowIntensity=G.intensity,st.shadowBias=G.bias,st.shadowNormalBias=G.normalBias,st.shadowRadius=G.radius,st.shadowMapSize=G.mapSize,i.directionalShadow[p]=st,i.directionalShadowMap[p]=V,i.directionalShadowMatrix[p]=L.shadow.matrix,b++}i.directional[p]=j,p++}else if(L.isSpotLight){const j=t.get(L);j.position.setFromMatrixPosition(L.matrixWorld),j.color.copy(W).multiplyScalar(z),j.distance=K,j.coneCos=Math.cos(L.angle),j.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),j.decay=L.decay,i.spot[S]=j;const G=L.shadow;if(L.map&&(i.spotLightMap[D]=L.map,D++,G.updateMatrices(L),L.castShadow&&A++),i.spotLightMatrix[S]=G.matrix,L.castShadow){const st=e.get(L);st.shadowIntensity=G.intensity,st.shadowBias=G.bias,st.shadowNormalBias=G.normalBias,st.shadowRadius=G.radius,st.shadowMapSize=G.mapSize,i.spotShadow[S]=st,i.spotShadowMap[S]=V,w++}S++}else if(L.isRectAreaLight){const j=t.get(L);j.color.copy(W).multiplyScalar(z),j.halfWidth.set(L.width*.5,0,0),j.halfHeight.set(0,L.height*.5,0),i.rectArea[m]=j,m++}else if(L.isPointLight){const j=t.get(L);if(j.color.copy(L.color).multiplyScalar(L.intensity),j.distance=L.distance,j.decay=L.decay,L.castShadow){const G=L.shadow,st=e.get(L);st.shadowIntensity=G.intensity,st.shadowBias=G.bias,st.shadowNormalBias=G.normalBias,st.shadowRadius=G.radius,st.shadowMapSize=G.mapSize,st.shadowCameraNear=G.camera.near,st.shadowCameraFar=G.camera.far,i.pointShadow[v]=st,i.pointShadowMap[v]=V,i.pointShadowMatrix[v]=L.shadow.matrix,R++}i.point[v]=j,v++}else if(L.isHemisphereLight){const j=t.get(L);j.skyColor.copy(L.color).multiplyScalar(z),j.groundColor.copy(L.groundColor).multiplyScalar(z),i.hemi[d]=j,d++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Tt.LTC_FLOAT_1,i.rectAreaLTC2=Tt.LTC_FLOAT_2):(i.rectAreaLTC1=Tt.LTC_HALF_1,i.rectAreaLTC2=Tt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=f;const k=i.hash;(k.directionalLength!==p||k.pointLength!==v||k.spotLength!==S||k.rectAreaLength!==m||k.hemiLength!==d||k.numDirectionalShadows!==b||k.numPointShadows!==R||k.numSpotShadows!==w||k.numSpotMaps!==D||k.numLightProbes!==N)&&(i.directional.length=p,i.spot.length=S,i.rectArea.length=m,i.point.length=v,i.hemi.length=d,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=R,i.pointShadowMap.length=R,i.spotShadow.length=w,i.spotShadowMap.length=w,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=R,i.spotLightMatrix.length=w+D-A,i.spotLightMap.length=D,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=N,k.directionalLength=p,k.pointLength=v,k.spotLength=S,k.rectAreaLength=m,k.hemiLength=d,k.numDirectionalShadows=b,k.numPointShadows=R,k.numSpotShadows=w,k.numSpotMaps=D,k.numLightProbes=N,i.version=zM++)}function l(c,h){let u=0,f=0,p=0,v=0,S=0;const m=h.matrixWorldInverse;for(let d=0,b=c.length;d<b;d++){const R=c[d];if(R.isDirectionalLight){const w=i.directional[u];w.direction.setFromMatrixPosition(R.matrixWorld),s.setFromMatrixPosition(R.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),u++}else if(R.isSpotLight){const w=i.spot[p];w.position.setFromMatrixPosition(R.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(R.matrixWorld),s.setFromMatrixPosition(R.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),p++}else if(R.isRectAreaLight){const w=i.rectArea[v];w.position.setFromMatrixPosition(R.matrixWorld),w.position.applyMatrix4(m),a.identity(),r.copy(R.matrixWorld),r.premultiply(m),a.extractRotation(r),w.halfWidth.set(R.width*.5,0,0),w.halfHeight.set(0,R.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),v++}else if(R.isPointLight){const w=i.point[f];w.position.setFromMatrixPosition(R.matrixWorld),w.position.applyMatrix4(m),f++}else if(R.isHemisphereLight){const w=i.hemi[S];w.direction.setFromMatrixPosition(R.matrixWorld),w.direction.transformDirection(m),S++}}}return{setup:o,setupView:l,state:i}}function Hf(n){const t=new kM(n),e=[],i=[];function s(h){c.camera=h,e.length=0,i.length=0}function r(h){e.push(h)}function a(h){i.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function HM(n){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Hf(n),t.set(s,[o])):r>=a.length?(o=new Hf(n),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:e,dispose:i}}const VM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,WM=`uniform sampler2D shadow_pass;
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
}`,XM=[new X(1,0,0),new X(-1,0,0),new X(0,1,0),new X(0,-1,0),new X(0,0,1),new X(0,0,-1)],YM=[new X(0,-1,0),new X(0,-1,0),new X(0,0,1),new X(0,0,-1),new X(0,-1,0),new X(0,-1,0)],Vf=new $e,Na=new X,vc=new X;function qM(n,t,e){let i=new wp;const s=new Xt,r=new Xt,a=new Ze,o=new o0,l=new l0,c={},h=e.maxTextureSize,u={[Fs]:Hn,[Hn]:Fs,[zi]:zi},f=new qi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Xt},radius:{value:4}},vertexShader:VM,fragmentShader:WM}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const v=new gi;v.setAttribute("position",new Wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new ti(v,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=qo;let d=this.type;this.render=function(A,N,k){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;A.type===Km&&(Jt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),A.type=qo);const y=n.getRenderTarget(),T=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),W=n.state;W.setBlending(us),W.buffers.depth.getReversed()===!0?W.buffers.color.setClear(0,0,0,0):W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const z=d!==this.type;z&&N.traverse(function(K){K.material&&(Array.isArray(K.material)?K.material.forEach(V=>V.needsUpdate=!0):K.material.needsUpdate=!0)});for(let K=0,V=A.length;K<V;K++){const j=A[K],G=j.shadow;if(G===void 0){Jt("WebGLShadowMap:",j,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const st=G.getFrameExtents();if(s.multiply(st),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/st.x),s.x=r.x*st.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/st.y),s.y=r.y*st.y,G.mapSize.y=r.y)),G.map===null||z===!0){if(G.map!==null&&(G.map.depthTexture!==null&&(G.map.depthTexture.dispose(),G.map.depthTexture=null),G.map.dispose()),this.type===ka){if(j.isPointLight){Jt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}G.map=new Wi(s.x,s.y,{format:ra,type:gs,minFilter:sn,magFilter:sn,generateMipmaps:!1}),G.map.texture.name=j.name+".shadowMap",G.map.depthTexture=new io(s.x,s.y,ki),G.map.depthTexture.name=j.name+".shadowMapDepth",G.map.depthTexture.format=_s,G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=bn,G.map.depthTexture.magFilter=bn}else{j.isPointLight?(G.map=new Tp(s.x),G.map.depthTexture=new r0(s.x,Yi)):(G.map=new Wi(s.x,s.y),G.map.depthTexture=new io(s.x,s.y,Yi)),G.map.depthTexture.name=j.name+".shadowMap",G.map.depthTexture.format=_s;const at=n.state.buffers.depth.getReversed();this.type===qo?(G.map.depthTexture.compareFunction=at?sh:ih,G.map.depthTexture.minFilter=sn,G.map.depthTexture.magFilter=sn):(G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=bn,G.map.depthTexture.magFilter=bn)}G.camera.updateProjectionMatrix()}const dt=G.map.isWebGLCubeRenderTarget?6:1;for(let at=0;at<dt;at++){if(G.map.isWebGLCubeRenderTarget)n.setRenderTarget(G.map,at),n.clear();else{at===0&&(n.setRenderTarget(G.map),n.clear());const ut=G.getViewport(at);a.set(r.x*ut.x,r.y*ut.y,r.x*ut.z,r.y*ut.w),W.viewport(a)}if(j.isPointLight){const ut=G.camera,St=G.matrix,ht=j.distance||ut.far;ht!==ut.far&&(ut.far=ht,ut.updateProjectionMatrix()),Na.setFromMatrixPosition(j.matrixWorld),ut.position.copy(Na),vc.copy(ut.position),vc.add(XM[at]),ut.up.copy(YM[at]),ut.lookAt(vc),ut.updateMatrixWorld(),St.makeTranslation(-Na.x,-Na.y,-Na.z),Vf.multiplyMatrices(ut.projectionMatrix,ut.matrixWorldInverse),G._frustum.setFromProjectionMatrix(Vf,ut.coordinateSystem,ut.reversedDepth)}else G.updateMatrices(j);i=G.getFrustum(),w(N,k,G.camera,j,this.type)}G.isPointLightShadow!==!0&&this.type===ka&&b(G,k),G.needsUpdate=!1}d=this.type,m.needsUpdate=!1,n.setRenderTarget(y,T,L)};function b(A,N){const k=t.update(S);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Wi(s.x,s.y,{format:ra,type:gs})),f.uniforms.shadow_pass.value=A.map.depthTexture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,n.setRenderTarget(A.mapPass),n.clear(),n.renderBufferDirect(N,null,k,f,S,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,n.setRenderTarget(A.map),n.clear(),n.renderBufferDirect(N,null,k,p,S,null)}function R(A,N,k,y){let T=null;const L=k.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(L!==void 0)T=L;else if(T=k.isPointLight===!0?l:o,n.localClippingEnabled&&N.clipShadows===!0&&Array.isArray(N.clippingPlanes)&&N.clippingPlanes.length!==0||N.displacementMap&&N.displacementScale!==0||N.alphaMap&&N.alphaTest>0||N.map&&N.alphaTest>0||N.alphaToCoverage===!0){const W=T.uuid,z=N.uuid;let K=c[W];K===void 0&&(K={},c[W]=K);let V=K[z];V===void 0&&(V=T.clone(),K[z]=V,N.addEventListener("dispose",D)),T=V}if(T.visible=N.visible,T.wireframe=N.wireframe,y===ka?T.side=N.shadowSide!==null?N.shadowSide:N.side:T.side=N.shadowSide!==null?N.shadowSide:u[N.side],T.alphaMap=N.alphaMap,T.alphaTest=N.alphaToCoverage===!0?.5:N.alphaTest,T.map=N.map,T.clipShadows=N.clipShadows,T.clippingPlanes=N.clippingPlanes,T.clipIntersection=N.clipIntersection,T.displacementMap=N.displacementMap,T.displacementScale=N.displacementScale,T.displacementBias=N.displacementBias,T.wireframeLinewidth=N.wireframeLinewidth,T.linewidth=N.linewidth,k.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const W=n.properties.get(T);W.light=k}return T}function w(A,N,k,y,T){if(A.visible===!1)return;if(A.layers.test(N.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&T===ka)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,A.matrixWorld);const z=t.update(A),K=A.material;if(Array.isArray(K)){const V=z.groups;for(let j=0,G=V.length;j<G;j++){const st=V[j],dt=K[st.materialIndex];if(dt&&dt.visible){const at=R(A,dt,y,T);A.onBeforeShadow(n,A,N,k,z,at,st),n.renderBufferDirect(k,null,z,at,A,st),A.onAfterShadow(n,A,N,k,z,at,st)}}}else if(K.visible){const V=R(A,K,y,T);A.onBeforeShadow(n,A,N,k,z,V,null),n.renderBufferDirect(k,null,z,V,A,null),A.onAfterShadow(n,A,N,k,z,V,null)}}const W=A.children;for(let z=0,K=W.length;z<K;z++)w(W[z],N,k,y,T)}function D(A){A.target.removeEventListener("dispose",D);for(const k in c){const y=c[k],T=A.target.uuid;T in y&&(y[T].dispose(),delete y[T])}}}const jM={[Nc]:Fc,[Oc]:Gc,[Bc]:kc,[ia]:zc,[Fc]:Nc,[Gc]:Oc,[kc]:Bc,[zc]:ia};function KM(n,t){function e(){let O=!1;const yt=new Ze;let lt=null;const wt=new Ze(0,0,0,0);return{setMask:function(ft){lt!==ft&&!O&&(n.colorMask(ft,ft,ft,ft),lt=ft)},setLocked:function(ft){O=ft},setClear:function(ft,rt,vt,$t,De){De===!0&&(ft*=$t,rt*=$t,vt*=$t),yt.set(ft,rt,vt,$t),wt.equals(yt)===!1&&(n.clearColor(ft,rt,vt,$t),wt.copy(yt))},reset:function(){O=!1,lt=null,wt.set(-1,0,0,0)}}}function i(){let O=!1,yt=!1,lt=null,wt=null,ft=null;return{setReversed:function(rt){if(yt!==rt){const vt=t.get("EXT_clip_control");rt?vt.clipControlEXT(vt.LOWER_LEFT_EXT,vt.ZERO_TO_ONE_EXT):vt.clipControlEXT(vt.LOWER_LEFT_EXT,vt.NEGATIVE_ONE_TO_ONE_EXT),yt=rt;const $t=ft;ft=null,this.setClear($t)}},getReversed:function(){return yt},setTest:function(rt){rt?et(n.DEPTH_TEST):bt(n.DEPTH_TEST)},setMask:function(rt){lt!==rt&&!O&&(n.depthMask(rt),lt=rt)},setFunc:function(rt){if(yt&&(rt=jM[rt]),wt!==rt){switch(rt){case Nc:n.depthFunc(n.NEVER);break;case Fc:n.depthFunc(n.ALWAYS);break;case Oc:n.depthFunc(n.LESS);break;case ia:n.depthFunc(n.LEQUAL);break;case Bc:n.depthFunc(n.EQUAL);break;case zc:n.depthFunc(n.GEQUAL);break;case Gc:n.depthFunc(n.GREATER);break;case kc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}wt=rt}},setLocked:function(rt){O=rt},setClear:function(rt){ft!==rt&&(yt&&(rt=1-rt),n.clearDepth(rt),ft=rt)},reset:function(){O=!1,lt=null,wt=null,ft=null,yt=!1}}}function s(){let O=!1,yt=null,lt=null,wt=null,ft=null,rt=null,vt=null,$t=null,De=null;return{setTest:function(ve){O||(ve?et(n.STENCIL_TEST):bt(n.STENCIL_TEST))},setMask:function(ve){yt!==ve&&!O&&(n.stencilMask(ve),yt=ve)},setFunc:function(ve,mn,ze){(lt!==ve||wt!==mn||ft!==ze)&&(n.stencilFunc(ve,mn,ze),lt=ve,wt=mn,ft=ze)},setOp:function(ve,mn,ze){(rt!==ve||vt!==mn||$t!==ze)&&(n.stencilOp(ve,mn,ze),rt=ve,vt=mn,$t=ze)},setLocked:function(ve){O=ve},setClear:function(ve){De!==ve&&(n.clearStencil(ve),De=ve)},reset:function(){O=!1,yt=null,lt=null,wt=null,ft=null,rt=null,vt=null,$t=null,De=null}}}const r=new e,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,p=[],v=null,S=!1,m=null,d=null,b=null,R=null,w=null,D=null,A=null,N=new Re(0,0,0),k=0,y=!1,T=null,L=null,W=null,z=null,K=null;const V=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,G=0;const st=n.getParameter(n.VERSION);st.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(st)[1]),j=G>=1):st.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(st)[1]),j=G>=2);let dt=null,at={};const ut=n.getParameter(n.SCISSOR_BOX),St=n.getParameter(n.VIEWPORT),ht=new Ze().fromArray(ut),Qt=new Ze().fromArray(St);function ne(O,yt,lt,wt){const ft=new Uint8Array(4),rt=n.createTexture();n.bindTexture(O,rt),n.texParameteri(O,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(O,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let vt=0;vt<lt;vt++)O===n.TEXTURE_3D||O===n.TEXTURE_2D_ARRAY?n.texImage3D(yt,0,n.RGBA,1,1,wt,0,n.RGBA,n.UNSIGNED_BYTE,ft):n.texImage2D(yt+vt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ft);return rt}const Q={};Q[n.TEXTURE_2D]=ne(n.TEXTURE_2D,n.TEXTURE_2D,1),Q[n.TEXTURE_CUBE_MAP]=ne(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[n.TEXTURE_2D_ARRAY]=ne(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Q[n.TEXTURE_3D]=ne(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),et(n.DEPTH_TEST),a.setFunc(ia),qt(!1),Be(Xh),et(n.CULL_FACE),ae(us);function et(O){h[O]!==!0&&(n.enable(O),h[O]=!0)}function bt(O){h[O]!==!1&&(n.disable(O),h[O]=!1)}function kt(O,yt){return u[O]!==yt?(n.bindFramebuffer(O,yt),u[O]=yt,O===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=yt),O===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=yt),!0):!1}function _t(O,yt){let lt=p,wt=!1;if(O){lt=f.get(yt),lt===void 0&&(lt=[],f.set(yt,lt));const ft=O.textures;if(lt.length!==ft.length||lt[0]!==n.COLOR_ATTACHMENT0){for(let rt=0,vt=ft.length;rt<vt;rt++)lt[rt]=n.COLOR_ATTACHMENT0+rt;lt.length=ft.length,wt=!0}}else lt[0]!==n.BACK&&(lt[0]=n.BACK,wt=!0);wt&&n.drawBuffers(lt)}function te(O){return v!==O?(n.useProgram(O),v=O,!0):!1}const Ce={[er]:n.FUNC_ADD,[Zm]:n.FUNC_SUBTRACT,[Jm]:n.FUNC_REVERSE_SUBTRACT};Ce[Qm]=n.MIN,Ce[tg]=n.MAX;const Yt={[eg]:n.ZERO,[ng]:n.ONE,[ig]:n.SRC_COLOR,[Ic]:n.SRC_ALPHA,[cg]:n.SRC_ALPHA_SATURATE,[og]:n.DST_COLOR,[rg]:n.DST_ALPHA,[sg]:n.ONE_MINUS_SRC_COLOR,[Uc]:n.ONE_MINUS_SRC_ALPHA,[lg]:n.ONE_MINUS_DST_COLOR,[ag]:n.ONE_MINUS_DST_ALPHA,[ug]:n.CONSTANT_COLOR,[hg]:n.ONE_MINUS_CONSTANT_COLOR,[fg]:n.CONSTANT_ALPHA,[dg]:n.ONE_MINUS_CONSTANT_ALPHA};function ae(O,yt,lt,wt,ft,rt,vt,$t,De,ve){if(O===us){S===!0&&(bt(n.BLEND),S=!1);return}if(S===!1&&(et(n.BLEND),S=!0),O!==$m){if(O!==m||ve!==y){if((d!==er||w!==er)&&(n.blendEquation(n.FUNC_ADD),d=er,w=er),ve)switch(O){case Qr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Yh:n.blendFunc(n.ONE,n.ONE);break;case qh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case jh:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:de("WebGLState: Invalid blending: ",O);break}else switch(O){case Qr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Yh:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case qh:de("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case jh:de("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:de("WebGLState: Invalid blending: ",O);break}b=null,R=null,D=null,A=null,N.set(0,0,0),k=0,m=O,y=ve}return}ft=ft||yt,rt=rt||lt,vt=vt||wt,(yt!==d||ft!==w)&&(n.blendEquationSeparate(Ce[yt],Ce[ft]),d=yt,w=ft),(lt!==b||wt!==R||rt!==D||vt!==A)&&(n.blendFuncSeparate(Yt[lt],Yt[wt],Yt[rt],Yt[vt]),b=lt,R=wt,D=rt,A=vt),($t.equals(N)===!1||De!==k)&&(n.blendColor($t.r,$t.g,$t.b,De),N.copy($t),k=De),m=O,y=!1}function fe(O,yt){O.side===zi?bt(n.CULL_FACE):et(n.CULL_FACE);let lt=O.side===Hn;yt&&(lt=!lt),qt(lt),O.blending===Qr&&O.transparent===!1?ae(us):ae(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);const wt=O.stencilWrite;o.setTest(wt),wt&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Pe(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?et(n.SAMPLE_ALPHA_TO_COVERAGE):bt(n.SAMPLE_ALPHA_TO_COVERAGE)}function qt(O){T!==O&&(O?n.frontFace(n.CW):n.frontFace(n.CCW),T=O)}function Be(O){O!==qm?(et(n.CULL_FACE),O!==L&&(O===Xh?n.cullFace(n.BACK):O===jm?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):bt(n.CULL_FACE),L=O}function F(O){O!==W&&(j&&n.lineWidth(O),W=O)}function Pe(O,yt,lt){O?(et(n.POLYGON_OFFSET_FILL),(z!==yt||K!==lt)&&(n.polygonOffset(yt,lt),z=yt,K=lt)):bt(n.POLYGON_OFFSET_FILL)}function jt(O){O?et(n.SCISSOR_TEST):bt(n.SCISSOR_TEST)}function pe(O){O===void 0&&(O=n.TEXTURE0+V-1),dt!==O&&(n.activeTexture(O),dt=O)}function Dt(O,yt,lt){lt===void 0&&(dt===null?lt=n.TEXTURE0+V-1:lt=dt);let wt=at[lt];wt===void 0&&(wt={type:void 0,texture:void 0},at[lt]=wt),(wt.type!==O||wt.texture!==yt)&&(dt!==lt&&(n.activeTexture(lt),dt=lt),n.bindTexture(O,yt||Q[O]),wt.type=O,wt.texture=yt)}function P(){const O=at[dt];O!==void 0&&O.type!==void 0&&(n.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function x(){try{n.compressedTexImage2D(...arguments)}catch(O){de("WebGLState:",O)}}function U(){try{n.compressedTexImage3D(...arguments)}catch(O){de("WebGLState:",O)}}function Z(){try{n.texSubImage2D(...arguments)}catch(O){de("WebGLState:",O)}}function nt(){try{n.texSubImage3D(...arguments)}catch(O){de("WebGLState:",O)}}function tt(){try{n.compressedTexSubImage2D(...arguments)}catch(O){de("WebGLState:",O)}}function Nt(){try{n.compressedTexSubImage3D(...arguments)}catch(O){de("WebGLState:",O)}}function mt(){try{n.texStorage2D(...arguments)}catch(O){de("WebGLState:",O)}}function Lt(){try{n.texStorage3D(...arguments)}catch(O){de("WebGLState:",O)}}function Bt(){try{n.texImage2D(...arguments)}catch(O){de("WebGLState:",O)}}function ot(){try{n.texImage3D(...arguments)}catch(O){de("WebGLState:",O)}}function pt(O){ht.equals(O)===!1&&(n.scissor(O.x,O.y,O.z,O.w),ht.copy(O))}function At(O){Qt.equals(O)===!1&&(n.viewport(O.x,O.y,O.z,O.w),Qt.copy(O))}function Ot(O,yt){let lt=c.get(yt);lt===void 0&&(lt=new WeakMap,c.set(yt,lt));let wt=lt.get(O);wt===void 0&&(wt=n.getUniformBlockIndex(yt,O.name),lt.set(O,wt))}function xt(O,yt){const wt=c.get(yt).get(O);l.get(yt)!==wt&&(n.uniformBlockBinding(yt,wt,O.__bindingPointIndex),l.set(yt,wt))}function Kt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},dt=null,at={},u={},f=new WeakMap,p=[],v=null,S=!1,m=null,d=null,b=null,R=null,w=null,D=null,A=null,N=new Re(0,0,0),k=0,y=!1,T=null,L=null,W=null,z=null,K=null,ht.set(0,0,n.canvas.width,n.canvas.height),Qt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:et,disable:bt,bindFramebuffer:kt,drawBuffers:_t,useProgram:te,setBlending:ae,setMaterial:fe,setFlipSided:qt,setCullFace:Be,setLineWidth:F,setPolygonOffset:Pe,setScissorTest:jt,activeTexture:pe,bindTexture:Dt,unbindTexture:P,compressedTexImage2D:x,compressedTexImage3D:U,texImage2D:Bt,texImage3D:ot,updateUBOMapping:Ot,uniformBlockBinding:xt,texStorage2D:mt,texStorage3D:Lt,texSubImage2D:Z,texSubImage3D:nt,compressedTexSubImage2D:tt,compressedTexSubImage3D:Nt,scissor:pt,viewport:At,reset:Kt}}function $M(n,t,e,i,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Xt,h=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(P,x){return p?new OffscreenCanvas(P,x):sl("canvas")}function S(P,x,U){let Z=1;const nt=Dt(P);if((nt.width>U||nt.height>U)&&(Z=U/Math.max(nt.width,nt.height)),Z<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const tt=Math.floor(Z*nt.width),Nt=Math.floor(Z*nt.height);u===void 0&&(u=v(tt,Nt));const mt=x?v(tt,Nt):u;return mt.width=tt,mt.height=Nt,mt.getContext("2d").drawImage(P,0,0,tt,Nt),Jt("WebGLRenderer: Texture has been resized from ("+nt.width+"x"+nt.height+") to ("+tt+"x"+Nt+")."),mt}else return"data"in P&&Jt("WebGLRenderer: Image in DataTexture is too big ("+nt.width+"x"+nt.height+")."),P;return P}function m(P){return P.generateMipmaps}function d(P){n.generateMipmap(P)}function b(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function R(P,x,U,Z,nt=!1){if(P!==null){if(n[P]!==void 0)return n[P];Jt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let tt=x;if(x===n.RED&&(U===n.FLOAT&&(tt=n.R32F),U===n.HALF_FLOAT&&(tt=n.R16F),U===n.UNSIGNED_BYTE&&(tt=n.R8)),x===n.RED_INTEGER&&(U===n.UNSIGNED_BYTE&&(tt=n.R8UI),U===n.UNSIGNED_SHORT&&(tt=n.R16UI),U===n.UNSIGNED_INT&&(tt=n.R32UI),U===n.BYTE&&(tt=n.R8I),U===n.SHORT&&(tt=n.R16I),U===n.INT&&(tt=n.R32I)),x===n.RG&&(U===n.FLOAT&&(tt=n.RG32F),U===n.HALF_FLOAT&&(tt=n.RG16F),U===n.UNSIGNED_BYTE&&(tt=n.RG8)),x===n.RG_INTEGER&&(U===n.UNSIGNED_BYTE&&(tt=n.RG8UI),U===n.UNSIGNED_SHORT&&(tt=n.RG16UI),U===n.UNSIGNED_INT&&(tt=n.RG32UI),U===n.BYTE&&(tt=n.RG8I),U===n.SHORT&&(tt=n.RG16I),U===n.INT&&(tt=n.RG32I)),x===n.RGB_INTEGER&&(U===n.UNSIGNED_BYTE&&(tt=n.RGB8UI),U===n.UNSIGNED_SHORT&&(tt=n.RGB16UI),U===n.UNSIGNED_INT&&(tt=n.RGB32UI),U===n.BYTE&&(tt=n.RGB8I),U===n.SHORT&&(tt=n.RGB16I),U===n.INT&&(tt=n.RGB32I)),x===n.RGBA_INTEGER&&(U===n.UNSIGNED_BYTE&&(tt=n.RGBA8UI),U===n.UNSIGNED_SHORT&&(tt=n.RGBA16UI),U===n.UNSIGNED_INT&&(tt=n.RGBA32UI),U===n.BYTE&&(tt=n.RGBA8I),U===n.SHORT&&(tt=n.RGBA16I),U===n.INT&&(tt=n.RGBA32I)),x===n.RGB&&(U===n.UNSIGNED_INT_5_9_9_9_REV&&(tt=n.RGB9_E5),U===n.UNSIGNED_INT_10F_11F_11F_REV&&(tt=n.R11F_G11F_B10F)),x===n.RGBA){const Nt=nt?nl:me.getTransfer(Z);U===n.FLOAT&&(tt=n.RGBA32F),U===n.HALF_FLOAT&&(tt=n.RGBA16F),U===n.UNSIGNED_BYTE&&(tt=Nt===we?n.SRGB8_ALPHA8:n.RGBA8),U===n.UNSIGNED_SHORT_4_4_4_4&&(tt=n.RGBA4),U===n.UNSIGNED_SHORT_5_5_5_1&&(tt=n.RGB5_A1)}return(tt===n.R16F||tt===n.R32F||tt===n.RG16F||tt===n.RG32F||tt===n.RGBA16F||tt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),tt}function w(P,x){let U;return P?x===null||x===Yi||x===to?U=n.DEPTH24_STENCIL8:x===ki?U=n.DEPTH32F_STENCIL8:x===Qa&&(U=n.DEPTH24_STENCIL8,Jt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Yi||x===to?U=n.DEPTH_COMPONENT24:x===ki?U=n.DEPTH_COMPONENT32F:x===Qa&&(U=n.DEPTH_COMPONENT16),U}function D(P,x){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==bn&&P.minFilter!==sn?Math.log2(Math.max(x.width,x.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?x.mipmaps.length:1}function A(P){const x=P.target;x.removeEventListener("dispose",A),k(x),x.isVideoTexture&&h.delete(x)}function N(P){const x=P.target;x.removeEventListener("dispose",N),T(x)}function k(P){const x=i.get(P);if(x.__webglInit===void 0)return;const U=P.source,Z=f.get(U);if(Z){const nt=Z[x.__cacheKey];nt.usedTimes--,nt.usedTimes===0&&y(P),Object.keys(Z).length===0&&f.delete(U)}i.remove(P)}function y(P){const x=i.get(P);n.deleteTexture(x.__webglTexture);const U=P.source,Z=f.get(U);delete Z[x.__cacheKey],a.memory.textures--}function T(P){const x=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(x.__webglFramebuffer[Z]))for(let nt=0;nt<x.__webglFramebuffer[Z].length;nt++)n.deleteFramebuffer(x.__webglFramebuffer[Z][nt]);else n.deleteFramebuffer(x.__webglFramebuffer[Z]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[Z])}else{if(Array.isArray(x.__webglFramebuffer))for(let Z=0;Z<x.__webglFramebuffer.length;Z++)n.deleteFramebuffer(x.__webglFramebuffer[Z]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let Z=0;Z<x.__webglColorRenderbuffer.length;Z++)x.__webglColorRenderbuffer[Z]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[Z]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const U=P.textures;for(let Z=0,nt=U.length;Z<nt;Z++){const tt=i.get(U[Z]);tt.__webglTexture&&(n.deleteTexture(tt.__webglTexture),a.memory.textures--),i.remove(U[Z])}i.remove(P)}let L=0;function W(){L=0}function z(){const P=L;return P>=s.maxTextures&&Jt("WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),L+=1,P}function K(P){const x=[];return x.push(P.wrapS),x.push(P.wrapT),x.push(P.wrapR||0),x.push(P.magFilter),x.push(P.minFilter),x.push(P.anisotropy),x.push(P.internalFormat),x.push(P.format),x.push(P.type),x.push(P.generateMipmaps),x.push(P.premultiplyAlpha),x.push(P.flipY),x.push(P.unpackAlignment),x.push(P.colorSpace),x.join()}function V(P,x){const U=i.get(P);if(P.isVideoTexture&&jt(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&U.__version!==P.version){const Z=P.image;if(Z===null)Jt("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)Jt("WebGLRenderer: Texture marked for update but image is incomplete");else{Q(U,P,x);return}}else P.isExternalTexture&&(U.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,U.__webglTexture,n.TEXTURE0+x)}function j(P,x){const U=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&U.__version!==P.version){Q(U,P,x);return}else P.isExternalTexture&&(U.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(n.TEXTURE_2D_ARRAY,U.__webglTexture,n.TEXTURE0+x)}function G(P,x){const U=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&U.__version!==P.version){Q(U,P,x);return}e.bindTexture(n.TEXTURE_3D,U.__webglTexture,n.TEXTURE0+x)}function st(P,x){const U=i.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&U.__version!==P.version){et(U,P,x);return}e.bindTexture(n.TEXTURE_CUBE_MAP,U.__webglTexture,n.TEXTURE0+x)}const dt={[Wc]:n.REPEAT,[cs]:n.CLAMP_TO_EDGE,[Xc]:n.MIRRORED_REPEAT},at={[bn]:n.NEAREST,[gg]:n.NEAREST_MIPMAP_NEAREST,[Mo]:n.NEAREST_MIPMAP_LINEAR,[sn]:n.LINEAR,[Vl]:n.LINEAR_MIPMAP_NEAREST,[ar]:n.LINEAR_MIPMAP_LINEAR},ut={[Mg]:n.NEVER,[Tg]:n.ALWAYS,[Sg]:n.LESS,[ih]:n.LEQUAL,[yg]:n.EQUAL,[sh]:n.GEQUAL,[Eg]:n.GREATER,[bg]:n.NOTEQUAL};function St(P,x){if(x.type===ki&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===sn||x.magFilter===Vl||x.magFilter===Mo||x.magFilter===ar||x.minFilter===sn||x.minFilter===Vl||x.minFilter===Mo||x.minFilter===ar)&&Jt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,dt[x.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,dt[x.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,dt[x.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,at[x.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,at[x.minFilter]),x.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,ut[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===bn||x.minFilter!==Mo&&x.minFilter!==ar||x.type===ki&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const U=t.get("EXT_texture_filter_anisotropic");n.texParameterf(P,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function ht(P,x){let U=!1;P.__webglInit===void 0&&(P.__webglInit=!0,x.addEventListener("dispose",A));const Z=x.source;let nt=f.get(Z);nt===void 0&&(nt={},f.set(Z,nt));const tt=K(x);if(tt!==P.__cacheKey){nt[tt]===void 0&&(nt[tt]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,U=!0),nt[tt].usedTimes++;const Nt=nt[P.__cacheKey];Nt!==void 0&&(nt[P.__cacheKey].usedTimes--,Nt.usedTimes===0&&y(x)),P.__cacheKey=tt,P.__webglTexture=nt[tt].texture}return U}function Qt(P,x,U){return Math.floor(Math.floor(P/U)/x)}function ne(P,x,U,Z){const tt=P.updateRanges;if(tt.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,U,Z,x.data);else{tt.sort((ot,pt)=>ot.start-pt.start);let Nt=0;for(let ot=1;ot<tt.length;ot++){const pt=tt[Nt],At=tt[ot],Ot=pt.start+pt.count,xt=Qt(At.start,x.width,4),Kt=Qt(pt.start,x.width,4);At.start<=Ot+1&&xt===Kt&&Qt(At.start+At.count-1,x.width,4)===xt?pt.count=Math.max(pt.count,At.start+At.count-pt.start):(++Nt,tt[Nt]=At)}tt.length=Nt+1;const mt=n.getParameter(n.UNPACK_ROW_LENGTH),Lt=n.getParameter(n.UNPACK_SKIP_PIXELS),Bt=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let ot=0,pt=tt.length;ot<pt;ot++){const At=tt[ot],Ot=Math.floor(At.start/4),xt=Math.ceil(At.count/4),Kt=Ot%x.width,O=Math.floor(Ot/x.width),yt=xt,lt=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Kt),n.pixelStorei(n.UNPACK_SKIP_ROWS,O),e.texSubImage2D(n.TEXTURE_2D,0,Kt,O,yt,lt,U,Z,x.data)}P.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,mt),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Lt),n.pixelStorei(n.UNPACK_SKIP_ROWS,Bt)}}function Q(P,x,U){let Z=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(Z=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(Z=n.TEXTURE_3D);const nt=ht(P,x),tt=x.source;e.bindTexture(Z,P.__webglTexture,n.TEXTURE0+U);const Nt=i.get(tt);if(tt.version!==Nt.__version||nt===!0){e.activeTexture(n.TEXTURE0+U);const mt=me.getPrimaries(me.workingColorSpace),Lt=x.colorSpace===Is?null:me.getPrimaries(x.colorSpace),Bt=x.colorSpace===Is||mt===Lt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);let ot=S(x.image,!1,s.maxTextureSize);ot=pe(x,ot);const pt=r.convert(x.format,x.colorSpace),At=r.convert(x.type);let Ot=R(x.internalFormat,pt,At,x.colorSpace,x.isVideoTexture);St(Z,x);let xt;const Kt=x.mipmaps,O=x.isVideoTexture!==!0,yt=Nt.__version===void 0||nt===!0,lt=tt.dataReady,wt=D(x,ot);if(x.isDepthTexture)Ot=w(x.format===or,x.type),yt&&(O?e.texStorage2D(n.TEXTURE_2D,1,Ot,ot.width,ot.height):e.texImage2D(n.TEXTURE_2D,0,Ot,ot.width,ot.height,0,pt,At,null));else if(x.isDataTexture)if(Kt.length>0){O&&yt&&e.texStorage2D(n.TEXTURE_2D,wt,Ot,Kt[0].width,Kt[0].height);for(let ft=0,rt=Kt.length;ft<rt;ft++)xt=Kt[ft],O?lt&&e.texSubImage2D(n.TEXTURE_2D,ft,0,0,xt.width,xt.height,pt,At,xt.data):e.texImage2D(n.TEXTURE_2D,ft,Ot,xt.width,xt.height,0,pt,At,xt.data);x.generateMipmaps=!1}else O?(yt&&e.texStorage2D(n.TEXTURE_2D,wt,Ot,ot.width,ot.height),lt&&ne(x,ot,pt,At)):e.texImage2D(n.TEXTURE_2D,0,Ot,ot.width,ot.height,0,pt,At,ot.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){O&&yt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,wt,Ot,Kt[0].width,Kt[0].height,ot.depth);for(let ft=0,rt=Kt.length;ft<rt;ft++)if(xt=Kt[ft],x.format!==wi)if(pt!==null)if(O){if(lt)if(x.layerUpdates.size>0){const vt=Mf(xt.width,xt.height,x.format,x.type);for(const $t of x.layerUpdates){const De=xt.data.subarray($t*vt/xt.data.BYTES_PER_ELEMENT,($t+1)*vt/xt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ft,0,0,$t,xt.width,xt.height,1,pt,De)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ft,0,0,0,xt.width,xt.height,ot.depth,pt,xt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ft,Ot,xt.width,xt.height,ot.depth,0,xt.data,0,0);else Jt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else O?lt&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,ft,0,0,0,xt.width,xt.height,ot.depth,pt,At,xt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,ft,Ot,xt.width,xt.height,ot.depth,0,pt,At,xt.data)}else{O&&yt&&e.texStorage2D(n.TEXTURE_2D,wt,Ot,Kt[0].width,Kt[0].height);for(let ft=0,rt=Kt.length;ft<rt;ft++)xt=Kt[ft],x.format!==wi?pt!==null?O?lt&&e.compressedTexSubImage2D(n.TEXTURE_2D,ft,0,0,xt.width,xt.height,pt,xt.data):e.compressedTexImage2D(n.TEXTURE_2D,ft,Ot,xt.width,xt.height,0,xt.data):Jt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):O?lt&&e.texSubImage2D(n.TEXTURE_2D,ft,0,0,xt.width,xt.height,pt,At,xt.data):e.texImage2D(n.TEXTURE_2D,ft,Ot,xt.width,xt.height,0,pt,At,xt.data)}else if(x.isDataArrayTexture)if(O){if(yt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,wt,Ot,ot.width,ot.height,ot.depth),lt)if(x.layerUpdates.size>0){const ft=Mf(ot.width,ot.height,x.format,x.type);for(const rt of x.layerUpdates){const vt=ot.data.subarray(rt*ft/ot.data.BYTES_PER_ELEMENT,(rt+1)*ft/ot.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,rt,ot.width,ot.height,1,pt,At,vt)}x.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,pt,At,ot.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,Ot,ot.width,ot.height,ot.depth,0,pt,At,ot.data);else if(x.isData3DTexture)O?(yt&&e.texStorage3D(n.TEXTURE_3D,wt,Ot,ot.width,ot.height,ot.depth),lt&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,pt,At,ot.data)):e.texImage3D(n.TEXTURE_3D,0,Ot,ot.width,ot.height,ot.depth,0,pt,At,ot.data);else if(x.isFramebufferTexture){if(yt)if(O)e.texStorage2D(n.TEXTURE_2D,wt,Ot,ot.width,ot.height);else{let ft=ot.width,rt=ot.height;for(let vt=0;vt<wt;vt++)e.texImage2D(n.TEXTURE_2D,vt,Ot,ft,rt,0,pt,At,null),ft>>=1,rt>>=1}}else if(Kt.length>0){if(O&&yt){const ft=Dt(Kt[0]);e.texStorage2D(n.TEXTURE_2D,wt,Ot,ft.width,ft.height)}for(let ft=0,rt=Kt.length;ft<rt;ft++)xt=Kt[ft],O?lt&&e.texSubImage2D(n.TEXTURE_2D,ft,0,0,pt,At,xt):e.texImage2D(n.TEXTURE_2D,ft,Ot,pt,At,xt);x.generateMipmaps=!1}else if(O){if(yt){const ft=Dt(ot);e.texStorage2D(n.TEXTURE_2D,wt,Ot,ft.width,ft.height)}lt&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,pt,At,ot)}else e.texImage2D(n.TEXTURE_2D,0,Ot,pt,At,ot);m(x)&&d(Z),Nt.__version=tt.version,x.onUpdate&&x.onUpdate(x)}P.__version=x.version}function et(P,x,U){if(x.image.length!==6)return;const Z=ht(P,x),nt=x.source;e.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+U);const tt=i.get(nt);if(nt.version!==tt.__version||Z===!0){e.activeTexture(n.TEXTURE0+U);const Nt=me.getPrimaries(me.workingColorSpace),mt=x.colorSpace===Is?null:me.getPrimaries(x.colorSpace),Lt=x.colorSpace===Is||Nt===mt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Lt);const Bt=x.isCompressedTexture||x.image[0].isCompressedTexture,ot=x.image[0]&&x.image[0].isDataTexture,pt=[];for(let rt=0;rt<6;rt++)!Bt&&!ot?pt[rt]=S(x.image[rt],!0,s.maxCubemapSize):pt[rt]=ot?x.image[rt].image:x.image[rt],pt[rt]=pe(x,pt[rt]);const At=pt[0],Ot=r.convert(x.format,x.colorSpace),xt=r.convert(x.type),Kt=R(x.internalFormat,Ot,xt,x.colorSpace),O=x.isVideoTexture!==!0,yt=tt.__version===void 0||Z===!0,lt=nt.dataReady;let wt=D(x,At);St(n.TEXTURE_CUBE_MAP,x);let ft;if(Bt){O&&yt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,wt,Kt,At.width,At.height);for(let rt=0;rt<6;rt++){ft=pt[rt].mipmaps;for(let vt=0;vt<ft.length;vt++){const $t=ft[vt];x.format!==wi?Ot!==null?O?lt&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt,0,0,$t.width,$t.height,Ot,$t.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt,Kt,$t.width,$t.height,0,$t.data):Jt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?lt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt,0,0,$t.width,$t.height,Ot,xt,$t.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt,Kt,$t.width,$t.height,0,Ot,xt,$t.data)}}}else{if(ft=x.mipmaps,O&&yt){ft.length>0&&wt++;const rt=Dt(pt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,wt,Kt,rt.width,rt.height)}for(let rt=0;rt<6;rt++)if(ot){O?lt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,pt[rt].width,pt[rt].height,Ot,xt,pt[rt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Kt,pt[rt].width,pt[rt].height,0,Ot,xt,pt[rt].data);for(let vt=0;vt<ft.length;vt++){const De=ft[vt].image[rt].image;O?lt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt+1,0,0,De.width,De.height,Ot,xt,De.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt+1,Kt,De.width,De.height,0,Ot,xt,De.data)}}else{O?lt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,Ot,xt,pt[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Kt,Ot,xt,pt[rt]);for(let vt=0;vt<ft.length;vt++){const $t=ft[vt];O?lt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt+1,0,0,Ot,xt,$t.image[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt+1,Kt,Ot,xt,$t.image[rt])}}}m(x)&&d(n.TEXTURE_CUBE_MAP),tt.__version=nt.version,x.onUpdate&&x.onUpdate(x)}P.__version=x.version}function bt(P,x,U,Z,nt,tt){const Nt=r.convert(U.format,U.colorSpace),mt=r.convert(U.type),Lt=R(U.internalFormat,Nt,mt,U.colorSpace),Bt=i.get(x),ot=i.get(U);if(ot.__renderTarget=x,!Bt.__hasExternalTextures){const pt=Math.max(1,x.width>>tt),At=Math.max(1,x.height>>tt);nt===n.TEXTURE_3D||nt===n.TEXTURE_2D_ARRAY?e.texImage3D(nt,tt,Lt,pt,At,x.depth,0,Nt,mt,null):e.texImage2D(nt,tt,Lt,pt,At,0,Nt,mt,null)}e.bindFramebuffer(n.FRAMEBUFFER,P),Pe(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,nt,ot.__webglTexture,0,F(x)):(nt===n.TEXTURE_2D||nt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&nt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Z,nt,ot.__webglTexture,tt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function kt(P,x,U){if(n.bindRenderbuffer(n.RENDERBUFFER,P),x.depthBuffer){const Z=x.depthTexture,nt=Z&&Z.isDepthTexture?Z.type:null,tt=w(x.stencilBuffer,nt),Nt=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Pe(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,F(x),tt,x.width,x.height):U?n.renderbufferStorageMultisample(n.RENDERBUFFER,F(x),tt,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,tt,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Nt,n.RENDERBUFFER,P)}else{const Z=x.textures;for(let nt=0;nt<Z.length;nt++){const tt=Z[nt],Nt=r.convert(tt.format,tt.colorSpace),mt=r.convert(tt.type),Lt=R(tt.internalFormat,Nt,mt,tt.colorSpace);Pe(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,F(x),Lt,x.width,x.height):U?n.renderbufferStorageMultisample(n.RENDERBUFFER,F(x),Lt,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,Lt,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function _t(P,x,U){const Z=x.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(n.FRAMEBUFFER,P),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const nt=i.get(x.depthTexture);if(nt.__renderTarget=x,(!nt.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),Z){if(nt.__webglInit===void 0&&(nt.__webglInit=!0,x.depthTexture.addEventListener("dispose",A)),nt.__webglTexture===void 0){nt.__webglTexture=n.createTexture(),e.bindTexture(n.TEXTURE_CUBE_MAP,nt.__webglTexture),St(n.TEXTURE_CUBE_MAP,x.depthTexture);const Bt=r.convert(x.depthTexture.format),ot=r.convert(x.depthTexture.type);let pt;x.depthTexture.format===_s?pt=n.DEPTH_COMPONENT24:x.depthTexture.format===or&&(pt=n.DEPTH24_STENCIL8);for(let At=0;At<6;At++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+At,0,pt,x.width,x.height,0,Bt,ot,null)}}else V(x.depthTexture,0);const tt=nt.__webglTexture,Nt=F(x),mt=Z?n.TEXTURE_CUBE_MAP_POSITIVE_X+U:n.TEXTURE_2D,Lt=x.depthTexture.format===or?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(x.depthTexture.format===_s)Pe(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Lt,mt,tt,0,Nt):n.framebufferTexture2D(n.FRAMEBUFFER,Lt,mt,tt,0);else if(x.depthTexture.format===or)Pe(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Lt,mt,tt,0,Nt):n.framebufferTexture2D(n.FRAMEBUFFER,Lt,mt,tt,0);else throw new Error("Unknown depthTexture format")}function te(P){const x=i.get(P),U=P.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==P.depthTexture){const Z=P.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),Z){const nt=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,Z.removeEventListener("dispose",nt)};Z.addEventListener("dispose",nt),x.__depthDisposeCallback=nt}x.__boundDepthTexture=Z}if(P.depthTexture&&!x.__autoAllocateDepthBuffer)if(U)for(let Z=0;Z<6;Z++)_t(x.__webglFramebuffer[Z],P,Z);else{const Z=P.texture.mipmaps;Z&&Z.length>0?_t(x.__webglFramebuffer[0],P,0):_t(x.__webglFramebuffer,P,0)}else if(U){x.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[Z]),x.__webglDepthbuffer[Z]===void 0)x.__webglDepthbuffer[Z]=n.createRenderbuffer(),kt(x.__webglDepthbuffer[Z],P,!1);else{const nt=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,tt=x.__webglDepthbuffer[Z];n.bindRenderbuffer(n.RENDERBUFFER,tt),n.framebufferRenderbuffer(n.FRAMEBUFFER,nt,n.RENDERBUFFER,tt)}}else{const Z=P.texture.mipmaps;if(Z&&Z.length>0?e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),kt(x.__webglDepthbuffer,P,!1);else{const nt=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,tt=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,tt),n.framebufferRenderbuffer(n.FRAMEBUFFER,nt,n.RENDERBUFFER,tt)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ce(P,x,U){const Z=i.get(P);x!==void 0&&bt(Z.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),U!==void 0&&te(P)}function Yt(P){const x=P.texture,U=i.get(P),Z=i.get(x);P.addEventListener("dispose",N);const nt=P.textures,tt=P.isWebGLCubeRenderTarget===!0,Nt=nt.length>1;if(Nt||(Z.__webglTexture===void 0&&(Z.__webglTexture=n.createTexture()),Z.__version=x.version,a.memory.textures++),tt){U.__webglFramebuffer=[];for(let mt=0;mt<6;mt++)if(x.mipmaps&&x.mipmaps.length>0){U.__webglFramebuffer[mt]=[];for(let Lt=0;Lt<x.mipmaps.length;Lt++)U.__webglFramebuffer[mt][Lt]=n.createFramebuffer()}else U.__webglFramebuffer[mt]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){U.__webglFramebuffer=[];for(let mt=0;mt<x.mipmaps.length;mt++)U.__webglFramebuffer[mt]=n.createFramebuffer()}else U.__webglFramebuffer=n.createFramebuffer();if(Nt)for(let mt=0,Lt=nt.length;mt<Lt;mt++){const Bt=i.get(nt[mt]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=n.createTexture(),a.memory.textures++)}if(P.samples>0&&Pe(P)===!1){U.__webglMultisampledFramebuffer=n.createFramebuffer(),U.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let mt=0;mt<nt.length;mt++){const Lt=nt[mt];U.__webglColorRenderbuffer[mt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,U.__webglColorRenderbuffer[mt]);const Bt=r.convert(Lt.format,Lt.colorSpace),ot=r.convert(Lt.type),pt=R(Lt.internalFormat,Bt,ot,Lt.colorSpace,P.isXRRenderTarget===!0),At=F(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,At,pt,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+mt,n.RENDERBUFFER,U.__webglColorRenderbuffer[mt])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(U.__webglDepthRenderbuffer=n.createRenderbuffer(),kt(U.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(tt){e.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),St(n.TEXTURE_CUBE_MAP,x);for(let mt=0;mt<6;mt++)if(x.mipmaps&&x.mipmaps.length>0)for(let Lt=0;Lt<x.mipmaps.length;Lt++)bt(U.__webglFramebuffer[mt][Lt],P,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Lt);else bt(U.__webglFramebuffer[mt],P,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0);m(x)&&d(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Nt){for(let mt=0,Lt=nt.length;mt<Lt;mt++){const Bt=nt[mt],ot=i.get(Bt);let pt=n.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(pt=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(pt,ot.__webglTexture),St(pt,Bt),bt(U.__webglFramebuffer,P,Bt,n.COLOR_ATTACHMENT0+mt,pt,0),m(Bt)&&d(pt)}e.unbindTexture()}else{let mt=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(mt=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(mt,Z.__webglTexture),St(mt,x),x.mipmaps&&x.mipmaps.length>0)for(let Lt=0;Lt<x.mipmaps.length;Lt++)bt(U.__webglFramebuffer[Lt],P,x,n.COLOR_ATTACHMENT0,mt,Lt);else bt(U.__webglFramebuffer,P,x,n.COLOR_ATTACHMENT0,mt,0);m(x)&&d(mt),e.unbindTexture()}P.depthBuffer&&te(P)}function ae(P){const x=P.textures;for(let U=0,Z=x.length;U<Z;U++){const nt=x[U];if(m(nt)){const tt=b(P),Nt=i.get(nt).__webglTexture;e.bindTexture(tt,Nt),d(tt),e.unbindTexture()}}}const fe=[],qt=[];function Be(P){if(P.samples>0){if(Pe(P)===!1){const x=P.textures,U=P.width,Z=P.height;let nt=n.COLOR_BUFFER_BIT;const tt=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Nt=i.get(P),mt=x.length>1;if(mt)for(let Bt=0;Bt<x.length;Bt++)e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer);const Lt=P.texture.mipmaps;Lt&&Lt.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer);for(let Bt=0;Bt<x.length;Bt++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(nt|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(nt|=n.STENCIL_BUFFER_BIT)),mt){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Nt.__webglColorRenderbuffer[Bt]);const ot=i.get(x[Bt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ot,0)}n.blitFramebuffer(0,0,U,Z,0,0,U,Z,nt,n.NEAREST),l===!0&&(fe.length=0,qt.length=0,fe.push(n.COLOR_ATTACHMENT0+Bt),P.depthBuffer&&P.resolveDepthBuffer===!1&&(fe.push(tt),qt.push(tt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,qt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,fe))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),mt)for(let Bt=0;Bt<x.length;Bt++){e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.RENDERBUFFER,Nt.__webglColorRenderbuffer[Bt]);const ot=i.get(x[Bt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.TEXTURE_2D,ot,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const x=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function F(P){return Math.min(s.maxSamples,P.samples)}function Pe(P){const x=i.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function jt(P){const x=a.render.frame;h.get(P)!==x&&(h.set(P,x),P.update())}function pe(P,x){const U=P.colorSpace,Z=P.format,nt=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||U!==aa&&U!==Is&&(me.getTransfer(U)===we?(Z!==wi||nt!==di)&&Jt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):de("WebGLTextures: Unsupported texture color space:",U)),x}function Dt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=W,this.setTexture2D=V,this.setTexture2DArray=j,this.setTexture3D=G,this.setTextureCube=st,this.rebindTextures=Ce,this.setupRenderTarget=Yt,this.updateRenderTargetMipmap=ae,this.updateMultisampleRenderTarget=Be,this.setupDepthRenderbuffer=te,this.setupFrameBufferTexture=bt,this.useMultisampledRTT=Pe,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function ZM(n,t){function e(i,s=Is){let r;const a=me.getTransfer(s);if(i===di)return n.UNSIGNED_BYTE;if(i===Ju)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Qu)return n.UNSIGNED_SHORT_5_5_5_1;if(i===fp)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===dp)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===up)return n.BYTE;if(i===hp)return n.SHORT;if(i===Qa)return n.UNSIGNED_SHORT;if(i===Zu)return n.INT;if(i===Yi)return n.UNSIGNED_INT;if(i===ki)return n.FLOAT;if(i===gs)return n.HALF_FLOAT;if(i===pp)return n.ALPHA;if(i===mp)return n.RGB;if(i===wi)return n.RGBA;if(i===_s)return n.DEPTH_COMPONENT;if(i===or)return n.DEPTH_STENCIL;if(i===gp)return n.RED;if(i===th)return n.RED_INTEGER;if(i===ra)return n.RG;if(i===eh)return n.RG_INTEGER;if(i===nh)return n.RGBA_INTEGER;if(i===jo||i===Ko||i===$o||i===Zo)if(a===we)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===jo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ko)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===$o)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Zo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===jo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ko)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===$o)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Zo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Yc||i===qc||i===jc||i===Kc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Yc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===qc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===jc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Kc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===$c||i===Zc||i===Jc||i===Qc||i===tu||i===eu||i===nu)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===$c||i===Zc)return a===we?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Jc)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Qc)return r.COMPRESSED_R11_EAC;if(i===tu)return r.COMPRESSED_SIGNED_R11_EAC;if(i===eu)return r.COMPRESSED_RG11_EAC;if(i===nu)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===iu||i===su||i===ru||i===au||i===ou||i===lu||i===cu||i===uu||i===hu||i===fu||i===du||i===pu||i===mu||i===gu)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===iu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===su)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ru)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===au)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ou)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===lu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===cu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===uu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===hu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===fu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===du)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===pu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===mu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===gu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===_u||i===xu||i===vu)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===_u)return a===we?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===xu)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===vu)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Mu||i===Su||i===yu||i===Eu)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Mu)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Su)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===yu)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Eu)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===to?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}const JM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,QM=`
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

}`;class tS{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new Cp(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new qi({vertexShader:JM,fragmentShader:QM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ti(new vl(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class eS extends mr{constructor(t,e){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,p=null,v=null;const S=typeof XRWebGLBinding<"u",m=new tS,d={},b=e.getContextAttributes();let R=null,w=null;const D=[],A=[],N=new Xt;let k=null;const y=new hi;y.viewport=new Ze;const T=new hi;T.viewport=new Ze;const L=[y,T],W=new c0;let z=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let et=D[Q];return et===void 0&&(et=new hc,D[Q]=et),et.getTargetRaySpace()},this.getControllerGrip=function(Q){let et=D[Q];return et===void 0&&(et=new hc,D[Q]=et),et.getGripSpace()},this.getHand=function(Q){let et=D[Q];return et===void 0&&(et=new hc,D[Q]=et),et.getHandSpace()};function V(Q){const et=A.indexOf(Q.inputSource);if(et===-1)return;const bt=D[et];bt!==void 0&&(bt.update(Q.inputSource,Q.frame,c||a),bt.dispatchEvent({type:Q.type,data:Q.inputSource}))}function j(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",j),s.removeEventListener("inputsourceschange",G);for(let Q=0;Q<D.length;Q++){const et=A[Q];et!==null&&(A[Q]=null,D[Q].disconnect(et))}z=null,K=null,m.reset();for(const Q in d)delete d[Q];t.setRenderTarget(R),p=null,f=null,u=null,s=null,w=null,ne.stop(),i.isPresenting=!1,t.setPixelRatio(k),t.setSize(N.width,N.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){r=Q,i.isPresenting===!0&&Jt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){o=Q,i.isPresenting===!0&&Jt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u===null&&S&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return v},this.getSession=function(){return s},this.setSession=async function(Q){if(s=Q,s!==null){if(R=t.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",j),s.addEventListener("inputsourceschange",G),b.xrCompatible!==!0&&await e.makeXRCompatible(),k=t.getPixelRatio(),t.getSize(N),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let bt=null,kt=null,_t=null;b.depth&&(_t=b.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,bt=b.stencil?or:_s,kt=b.stencil?to:Yi);const te={colorFormat:e.RGBA8,depthFormat:_t,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(te),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),w=new Wi(f.textureWidth,f.textureHeight,{format:wi,type:di,depthTexture:new io(f.textureWidth,f.textureHeight,kt,void 0,void 0,void 0,void 0,void 0,void 0,bt),stencilBuffer:b.stencil,colorSpace:t.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const bt={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,bt),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),w=new Wi(p.framebufferWidth,p.framebufferHeight,{format:wi,type:di,colorSpace:t.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),ne.setContext(s),ne.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function G(Q){for(let et=0;et<Q.removed.length;et++){const bt=Q.removed[et],kt=A.indexOf(bt);kt>=0&&(A[kt]=null,D[kt].disconnect(bt))}for(let et=0;et<Q.added.length;et++){const bt=Q.added[et];let kt=A.indexOf(bt);if(kt===-1){for(let te=0;te<D.length;te++)if(te>=A.length){A.push(bt),kt=te;break}else if(A[te]===null){A[te]=bt,kt=te;break}if(kt===-1)break}const _t=D[kt];_t&&_t.connect(bt)}}const st=new X,dt=new X;function at(Q,et,bt){st.setFromMatrixPosition(et.matrixWorld),dt.setFromMatrixPosition(bt.matrixWorld);const kt=st.distanceTo(dt),_t=et.projectionMatrix.elements,te=bt.projectionMatrix.elements,Ce=_t[14]/(_t[10]-1),Yt=_t[14]/(_t[10]+1),ae=(_t[9]+1)/_t[5],fe=(_t[9]-1)/_t[5],qt=(_t[8]-1)/_t[0],Be=(te[8]+1)/te[0],F=Ce*qt,Pe=Ce*Be,jt=kt/(-qt+Be),pe=jt*-qt;if(et.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(pe),Q.translateZ(jt),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),_t[10]===-1)Q.projectionMatrix.copy(et.projectionMatrix),Q.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{const Dt=Ce+jt,P=Yt+jt,x=F-pe,U=Pe+(kt-pe),Z=ae*Yt/P*Dt,nt=fe*Yt/P*Dt;Q.projectionMatrix.makePerspective(x,U,Z,nt,Dt,P),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function ut(Q,et){et===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(et.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(s===null)return;let et=Q.near,bt=Q.far;m.texture!==null&&(m.depthNear>0&&(et=m.depthNear),m.depthFar>0&&(bt=m.depthFar)),W.near=T.near=y.near=et,W.far=T.far=y.far=bt,(z!==W.near||K!==W.far)&&(s.updateRenderState({depthNear:W.near,depthFar:W.far}),z=W.near,K=W.far),W.layers.mask=Q.layers.mask|6,y.layers.mask=W.layers.mask&3,T.layers.mask=W.layers.mask&5;const kt=Q.parent,_t=W.cameras;ut(W,kt);for(let te=0;te<_t.length;te++)ut(_t[te],kt);_t.length===2?at(W,y,T):W.projectionMatrix.copy(y.projectionMatrix),St(Q,W,kt)};function St(Q,et,bt){bt===null?Q.matrix.copy(et.matrixWorld):(Q.matrix.copy(bt.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(et.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(et.projectionMatrix),Q.projectionMatrixInverse.copy(et.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Tu*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return W},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(Q){l=Q,f!==null&&(f.fixedFoveation=Q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(W)},this.getCameraTexture=function(Q){return d[Q]};let ht=null;function Qt(Q,et){if(h=et.getViewerPose(c||a),v=et,h!==null){const bt=h.views;p!==null&&(t.setRenderTargetFramebuffer(w,p.framebuffer),t.setRenderTarget(w));let kt=!1;bt.length!==W.cameras.length&&(W.cameras.length=0,kt=!0);for(let Yt=0;Yt<bt.length;Yt++){const ae=bt[Yt];let fe=null;if(p!==null)fe=p.getViewport(ae);else{const Be=u.getViewSubImage(f,ae);fe=Be.viewport,Yt===0&&(t.setRenderTargetTextures(w,Be.colorTexture,Be.depthStencilTexture),t.setRenderTarget(w))}let qt=L[Yt];qt===void 0&&(qt=new hi,qt.layers.enable(Yt),qt.viewport=new Ze,L[Yt]=qt),qt.matrix.fromArray(ae.transform.matrix),qt.matrix.decompose(qt.position,qt.quaternion,qt.scale),qt.projectionMatrix.fromArray(ae.projectionMatrix),qt.projectionMatrixInverse.copy(qt.projectionMatrix).invert(),qt.viewport.set(fe.x,fe.y,fe.width,fe.height),Yt===0&&(W.matrix.copy(qt.matrix),W.matrix.decompose(W.position,W.quaternion,W.scale)),kt===!0&&W.cameras.push(qt)}const _t=s.enabledFeatures;if(_t&&_t.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&S){u=i.getBinding();const Yt=u.getDepthInformation(bt[0]);Yt&&Yt.isValid&&Yt.texture&&m.init(Yt,s.renderState)}if(_t&&_t.includes("camera-access")&&S){t.state.unbindTexture(),u=i.getBinding();for(let Yt=0;Yt<bt.length;Yt++){const ae=bt[Yt].camera;if(ae){let fe=d[ae];fe||(fe=new Cp,d[ae]=fe);const qt=u.getCameraImage(ae);fe.sourceTexture=qt}}}}for(let bt=0;bt<D.length;bt++){const kt=A[bt],_t=D[bt];kt!==null&&_t!==void 0&&_t.update(kt,et,c||a)}ht&&ht(Q,et),et.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:et}),v=null}const ne=new Dp;ne.setAnimationLoop(Qt),this.setAnimationLoop=function(Q){ht=Q},this.dispose=function(){}}}const Zs=new xs,nS=new $e;function iS(n,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,yp(n)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,b,R,w){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),h(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,w)):d.isMeshMatcapMaterial?(r(m,d),v(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),S(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?l(m,d,b,R):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Hn&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Hn&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const b=t.get(d),R=b.envMap,w=b.envMapRotation;R&&(m.envMap.value=R,Zs.copy(w),Zs.x*=-1,Zs.y*=-1,Zs.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(Zs.y*=-1,Zs.z*=-1),m.envMapRotation.value.setFromMatrix4(nS.makeRotationFromEuler(Zs)),m.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,b,R){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*b,m.scale.value=R*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,b){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Hn&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,d){d.matcap&&(m.matcap.value=d.matcap)}function S(m,d){const b=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function sS(n,t,e,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,R){const w=R.program;i.uniformBlockBinding(b,w)}function c(b,R){let w=s[b.id];w===void 0&&(v(b),w=h(b),s[b.id]=w,b.addEventListener("dispose",m));const D=R.program;i.updateUBOMapping(b,D);const A=t.render.frame;r[b.id]!==A&&(f(b),r[b.id]=A)}function h(b){const R=u();b.__bindingPointIndex=R;const w=n.createBuffer(),D=b.__size,A=b.usage;return n.bindBuffer(n.UNIFORM_BUFFER,w),n.bufferData(n.UNIFORM_BUFFER,D,A),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,R,w),w}function u(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return de("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(b){const R=s[b.id],w=b.uniforms,D=b.__cache;n.bindBuffer(n.UNIFORM_BUFFER,R);for(let A=0,N=w.length;A<N;A++){const k=Array.isArray(w[A])?w[A]:[w[A]];for(let y=0,T=k.length;y<T;y++){const L=k[y];if(p(L,A,y,D)===!0){const W=L.__offset,z=Array.isArray(L.value)?L.value:[L.value];let K=0;for(let V=0;V<z.length;V++){const j=z[V],G=S(j);typeof j=="number"||typeof j=="boolean"?(L.__data[0]=j,n.bufferSubData(n.UNIFORM_BUFFER,W+K,L.__data)):j.isMatrix3?(L.__data[0]=j.elements[0],L.__data[1]=j.elements[1],L.__data[2]=j.elements[2],L.__data[3]=0,L.__data[4]=j.elements[3],L.__data[5]=j.elements[4],L.__data[6]=j.elements[5],L.__data[7]=0,L.__data[8]=j.elements[6],L.__data[9]=j.elements[7],L.__data[10]=j.elements[8],L.__data[11]=0):(j.toArray(L.__data,K),K+=G.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,W,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(b,R,w,D){const A=b.value,N=R+"_"+w;if(D[N]===void 0)return typeof A=="number"||typeof A=="boolean"?D[N]=A:D[N]=A.clone(),!0;{const k=D[N];if(typeof A=="number"||typeof A=="boolean"){if(k!==A)return D[N]=A,!0}else if(k.equals(A)===!1)return k.copy(A),!0}return!1}function v(b){const R=b.uniforms;let w=0;const D=16;for(let N=0,k=R.length;N<k;N++){const y=Array.isArray(R[N])?R[N]:[R[N]];for(let T=0,L=y.length;T<L;T++){const W=y[T],z=Array.isArray(W.value)?W.value:[W.value];for(let K=0,V=z.length;K<V;K++){const j=z[K],G=S(j),st=w%D,dt=st%G.boundary,at=st+dt;w+=dt,at!==0&&D-at<G.storage&&(w+=D-at),W.__data=new Float32Array(G.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=w,w+=G.storage}}}const A=w%D;return A>0&&(w+=D-A),b.__size=w,b.__cache={},this}function S(b){const R={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(R.boundary=4,R.storage=4):b.isVector2?(R.boundary=8,R.storage=8):b.isVector3||b.isColor?(R.boundary=16,R.storage=12):b.isVector4?(R.boundary=16,R.storage=16):b.isMatrix3?(R.boundary=48,R.storage=48):b.isMatrix4?(R.boundary=64,R.storage=64):b.isTexture?Jt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Jt("WebGLRenderer: Unsupported uniform value type.",b),R}function m(b){const R=b.target;R.removeEventListener("dispose",m);const w=a.indexOf(R.__bindingPointIndex);a.splice(w,1),n.deleteBuffer(s[R.id]),delete s[R.id],delete r[R.id]}function d(){for(const b in s)n.deleteBuffer(s[b]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}const rS=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ni=null;function aS(){return Ni===null&&(Ni=new e0(rS,16,16,ra,gs),Ni.name="DFG_LUT",Ni.minFilter=sn,Ni.magFilter=sn,Ni.wrapS=cs,Ni.wrapT=cs,Ni.generateMipmaps=!1,Ni.needsUpdate=!0),Ni}class oS{constructor(t={}){const{canvas:e=Ag(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1,outputBufferType:p=di}=t;this.isWebGLRenderer=!0;let v;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");v=i.getContextAttributes().alpha}else v=a;const S=p,m=new Set([nh,eh,th]),d=new Set([di,Yi,Qa,to,Ju,Qu]),b=new Uint32Array(4),R=new Int32Array(4);let w=null,D=null;const A=[],N=[];let k=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let T=!1;this._outputColorSpace=li;let L=0,W=0,z=null,K=-1,V=null;const j=new Ze,G=new Ze;let st=null;const dt=new Re(0);let at=0,ut=e.width,St=e.height,ht=1,Qt=null,ne=null;const Q=new Ze(0,0,ut,St),et=new Ze(0,0,ut,St);let bt=!1;const kt=new wp;let _t=!1,te=!1;const Ce=new $e,Yt=new X,ae=new Ze,fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let qt=!1;function Be(){return z===null?ht:1}let F=i;function Pe(E,H){return e.getContext(E,H)}try{const E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${$u}`),e.addEventListener("webglcontextlost",$t,!1),e.addEventListener("webglcontextrestored",De,!1),e.addEventListener("webglcontextcreationerror",ve,!1),F===null){const H="webgl2";if(F=Pe(H,E),F===null)throw Pe(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw de("WebGLRenderer: "+E.message),E}let jt,pe,Dt,P,x,U,Z,nt,tt,Nt,mt,Lt,Bt,ot,pt,At,Ot,xt,Kt,O,yt,lt,wt,ft;function rt(){jt=new av(F),jt.init(),lt=new ZM(F,jt),pe=new Zx(F,jt,t,lt),Dt=new KM(F,jt),pe.reversedDepthBuffer&&f&&Dt.buffers.depth.setReversed(!0),P=new cv(F),x=new UM,U=new $M(F,jt,Dt,x,pe,lt,P),Z=new Qx(y),nt=new rv(y),tt=new d0(F),wt=new Kx(F,tt),Nt=new ov(F,tt,P,wt),mt=new hv(F,Nt,tt,P),Kt=new uv(F,pe,U),At=new Jx(x),Lt=new IM(y,Z,nt,jt,pe,wt,At),Bt=new iS(y,x),ot=new FM,pt=new HM(jt),xt=new jx(y,Z,nt,Dt,mt,v,l),Ot=new qM(y,mt,pe),ft=new sS(F,P,pe,Dt),O=new $x(F,jt,P),yt=new lv(F,jt,P),P.programs=Lt.programs,y.capabilities=pe,y.extensions=jt,y.properties=x,y.renderLists=ot,y.shadowMap=Ot,y.state=Dt,y.info=P}rt(),S!==di&&(k=new dv(S,e.width,e.height,s,r));const vt=new eS(y,F);this.xr=vt,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const E=jt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=jt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return ht},this.setPixelRatio=function(E){E!==void 0&&(ht=E,this.setSize(ut,St,!1))},this.getSize=function(E){return E.set(ut,St)},this.setSize=function(E,H,J=!0){if(vt.isPresenting){Jt("WebGLRenderer: Can't change size while VR device is presenting.");return}ut=E,St=H,e.width=Math.floor(E*ht),e.height=Math.floor(H*ht),J===!0&&(e.style.width=E+"px",e.style.height=H+"px"),k!==null&&k.setSize(e.width,e.height),this.setViewport(0,0,E,H)},this.getDrawingBufferSize=function(E){return E.set(ut*ht,St*ht).floor()},this.setDrawingBufferSize=function(E,H,J){ut=E,St=H,ht=J,e.width=Math.floor(E*J),e.height=Math.floor(H*J),this.setViewport(0,0,E,H)},this.setEffects=function(E){if(S===di){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let H=0;H<E.length;H++)if(E[H].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}k.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(j)},this.getViewport=function(E){return E.copy(Q)},this.setViewport=function(E,H,J,$){E.isVector4?Q.set(E.x,E.y,E.z,E.w):Q.set(E,H,J,$),Dt.viewport(j.copy(Q).multiplyScalar(ht).round())},this.getScissor=function(E){return E.copy(et)},this.setScissor=function(E,H,J,$){E.isVector4?et.set(E.x,E.y,E.z,E.w):et.set(E,H,J,$),Dt.scissor(G.copy(et).multiplyScalar(ht).round())},this.getScissorTest=function(){return bt},this.setScissorTest=function(E){Dt.setScissorTest(bt=E)},this.setOpaqueSort=function(E){Qt=E},this.setTransparentSort=function(E){ne=E},this.getClearColor=function(E){return E.copy(xt.getClearColor())},this.setClearColor=function(){xt.setClearColor(...arguments)},this.getClearAlpha=function(){return xt.getClearAlpha()},this.setClearAlpha=function(){xt.setClearAlpha(...arguments)},this.clear=function(E=!0,H=!0,J=!0){let $=0;if(E){let Y=!1;if(z!==null){const Mt=z.texture.format;Y=m.has(Mt)}if(Y){const Mt=z.texture.type,Ct=d.has(Mt),Et=xt.getClearColor(),It=xt.getClearAlpha(),zt=Et.r,Vt=Et.g,Ut=Et.b;Ct?(b[0]=zt,b[1]=Vt,b[2]=Ut,b[3]=It,F.clearBufferuiv(F.COLOR,0,b)):(R[0]=zt,R[1]=Vt,R[2]=Ut,R[3]=It,F.clearBufferiv(F.COLOR,0,R))}else $|=F.COLOR_BUFFER_BIT}H&&($|=F.DEPTH_BUFFER_BIT),J&&($|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",$t,!1),e.removeEventListener("webglcontextrestored",De,!1),e.removeEventListener("webglcontextcreationerror",ve,!1),xt.dispose(),ot.dispose(),pt.dispose(),x.dispose(),Z.dispose(),nt.dispose(),mt.dispose(),wt.dispose(),ft.dispose(),Lt.dispose(),vt.dispose(),vt.removeEventListener("sessionstart",Ki),vt.removeEventListener("sessionend",$i),Ci.stop()};function $t(E){E.preventDefault(),rl("WebGLRenderer: Context Lost."),T=!0}function De(){rl("WebGLRenderer: Context Restored."),T=!1;const E=P.autoReset,H=Ot.enabled,J=Ot.autoUpdate,$=Ot.needsUpdate,Y=Ot.type;rt(),P.autoReset=E,Ot.enabled=H,Ot.autoUpdate=J,Ot.needsUpdate=$,Ot.type=Y}function ve(E){de("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function mn(E){const H=E.target;H.removeEventListener("dispose",mn),ze(H)}function ze(E){ni(E),x.remove(E)}function ni(E){const H=x.get(E).programs;H!==void 0&&(H.forEach(function(J){Lt.releaseProgram(J)}),E.isShaderMaterial&&Lt.releaseShaderCache(E))}this.renderBufferDirect=function(E,H,J,$,Y,Mt){H===null&&(H=fe);const Ct=Y.isMesh&&Y.matrixWorld.determinant()<0,Et=rn(E,H,J,$,Y);Dt.setMaterial($,Ct);let It=J.index,zt=1;if($.wireframe===!0){if(It=Nt.getWireframeAttribute(J),It===void 0)return;zt=2}const Vt=J.drawRange,Ut=J.attributes.position;let ie=Vt.start*zt,Me=(Vt.start+Vt.count)*zt;Mt!==null&&(ie=Math.max(ie,Mt.start*zt),Me=Math.min(Me,(Mt.start+Mt.count)*zt)),It!==null?(ie=Math.max(ie,0),Me=Math.min(Me,It.count)):Ut!=null&&(ie=Math.max(ie,0),Me=Math.min(Me,Ut.count));const Ge=Me-ie;if(Ge<0||Ge===1/0)return;wt.setup(Y,$,Et,J,It);let ke,Ae=O;if(It!==null&&(ke=tt.get(It),Ae=yt,Ae.setIndex(ke)),Y.isMesh)$.wireframe===!0?(Dt.setLineWidth($.wireframeLinewidth*Be()),Ae.setMode(F.LINES)):Ae.setMode(F.TRIANGLES);else if(Y.isLine){let Ht=$.linewidth;Ht===void 0&&(Ht=1),Dt.setLineWidth(Ht*Be()),Y.isLineSegments?Ae.setMode(F.LINES):Y.isLineLoop?Ae.setMode(F.LINE_LOOP):Ae.setMode(F.LINE_STRIP)}else Y.isPoints?Ae.setMode(F.POINTS):Y.isSprite&&Ae.setMode(F.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)eo("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ae.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(jt.get("WEBGL_multi_draw"))Ae.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Ht=Y._multiDrawStarts,Se=Y._multiDrawCounts,he=Y._multiDrawCount,Tn=It?tt.get(It).bytesPerElement:1,vs=x.get($).currentProgram.getUniforms();for(let An=0;An<he;An++)vs.setValue(F,"_gl_DrawID",An),Ae.render(Ht[An]/Tn,Se[An])}else if(Y.isInstancedMesh)Ae.renderInstances(ie,Ge,Y.count);else if(J.isInstancedBufferGeometry){const Ht=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Se=Math.min(J.instanceCount,Ht);Ae.renderInstances(ie,Ge,Se)}else Ae.render(ie,Ge)};function ji(E,H,J){E.transparent===!0&&E.side===zi&&E.forceSinglePass===!1?(E.side=Hn,E.needsUpdate=!0,Pi(E,H,J),E.side=Fs,E.needsUpdate=!0,Pi(E,H,J),E.side=zi):Pi(E,H,J)}this.compile=function(E,H,J=null){J===null&&(J=E),D=pt.get(J),D.init(H),N.push(D),J.traverseVisible(function(Y){Y.isLight&&Y.layers.test(H.layers)&&(D.pushLight(Y),Y.castShadow&&D.pushShadow(Y))}),E!==J&&E.traverseVisible(function(Y){Y.isLight&&Y.layers.test(H.layers)&&(D.pushLight(Y),Y.castShadow&&D.pushShadow(Y))}),D.setupLights();const $=new Set;return E.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const Mt=Y.material;if(Mt)if(Array.isArray(Mt))for(let Ct=0;Ct<Mt.length;Ct++){const Et=Mt[Ct];ji(Et,J,Y),$.add(Et)}else ji(Mt,J,Y),$.add(Mt)}),D=N.pop(),$},this.compileAsync=function(E,H,J=null){const $=this.compile(E,H,J);return new Promise(Y=>{function Mt(){if($.forEach(function(Ct){x.get(Ct).currentProgram.isReady()&&$.delete(Ct)}),$.size===0){Y(E);return}setTimeout(Mt,10)}jt.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let Ri=null;function On(E){Ri&&Ri(E)}function Ki(){Ci.stop()}function $i(){Ci.start()}const Ci=new Dp;Ci.setAnimationLoop(On),typeof self<"u"&&Ci.setContext(self),this.setAnimationLoop=function(E){Ri=E,vt.setAnimationLoop(E),E===null?Ci.stop():Ci.start()},vt.addEventListener("sessionstart",Ki),vt.addEventListener("sessionend",$i),this.render=function(E,H){if(H!==void 0&&H.isCamera!==!0){de("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;const J=vt.enabled===!0&&vt.isPresenting===!0,$=k!==null&&(z===null||J)&&k.begin(y,z);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),vt.enabled===!0&&vt.isPresenting===!0&&(k===null||k.isCompositing()===!1)&&(vt.cameraAutoUpdate===!0&&vt.updateCamera(H),H=vt.getCamera()),E.isScene===!0&&E.onBeforeRender(y,E,H,z),D=pt.get(E,N.length),D.init(H),N.push(D),Ce.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),kt.setFromProjectionMatrix(Ce,Hi,H.reversedDepth),te=this.localClippingEnabled,_t=At.init(this.clippingPlanes,te),w=ot.get(E,A.length),w.init(),A.push(w),vt.enabled===!0&&vt.isPresenting===!0){const Ct=y.xr.getDepthSensingMesh();Ct!==null&&_r(Ct,H,-1/0,y.sortObjects)}_r(E,H,0,y.sortObjects),w.finish(),y.sortObjects===!0&&w.sort(Qt,ne),qt=vt.enabled===!1||vt.isPresenting===!1||vt.hasDepthSensing()===!1,qt&&xt.addToRenderList(w,E),this.info.render.frame++,_t===!0&&At.beginShadows();const Y=D.state.shadowsArray;if(Ot.render(Y,E,H),_t===!0&&At.endShadows(),this.info.autoReset===!0&&this.info.reset(),($&&k.hasRenderPass())===!1){const Ct=w.opaque,Et=w.transmissive;if(D.setupLights(),H.isArrayCamera){const It=H.cameras;if(Et.length>0)for(let zt=0,Vt=It.length;zt<Vt;zt++){const Ut=It[zt];fo(Ct,Et,E,Ut)}qt&&xt.render(E);for(let zt=0,Vt=It.length;zt<Vt;zt++){const Ut=It[zt];ho(w,E,Ut,Ut.viewport)}}else Et.length>0&&fo(Ct,Et,E,H),qt&&xt.render(E),ho(w,E,H)}z!==null&&W===0&&(U.updateMultisampleRenderTarget(z),U.updateRenderTargetMipmap(z)),$&&k.end(y),E.isScene===!0&&E.onAfterRender(y,E,H),wt.resetDefaultState(),K=-1,V=null,N.pop(),N.length>0?(D=N[N.length-1],_t===!0&&At.setGlobalState(y.clippingPlanes,D.state.camera)):D=null,A.pop(),A.length>0?w=A[A.length-1]:w=null};function _r(E,H,J,$){if(E.visible===!1)return;if(E.layers.test(H.layers)){if(E.isGroup)J=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(H);else if(E.isLight)D.pushLight(E),E.castShadow&&D.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||kt.intersectsSprite(E)){$&&ae.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Ce);const Ct=mt.update(E),Et=E.material;Et.visible&&w.push(E,Ct,Et,J,ae.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||kt.intersectsObject(E))){const Ct=mt.update(E),Et=E.material;if($&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),ae.copy(E.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),ae.copy(Ct.boundingSphere.center)),ae.applyMatrix4(E.matrixWorld).applyMatrix4(Ce)),Array.isArray(Et)){const It=Ct.groups;for(let zt=0,Vt=It.length;zt<Vt;zt++){const Ut=It[zt],ie=Et[Ut.materialIndex];ie&&ie.visible&&w.push(E,Ct,ie,J,ae.z,Ut)}}else Et.visible&&w.push(E,Ct,Et,J,ae.z,null)}}const Mt=E.children;for(let Ct=0,Et=Mt.length;Ct<Et;Ct++)_r(Mt[Ct],H,J,$)}function ho(E,H,J,$){const{opaque:Y,transmissive:Mt,transparent:Ct}=E;D.setupLightsView(J),_t===!0&&At.setGlobalState(y.clippingPlanes,J),$&&Dt.viewport(j.copy($)),Y.length>0&&ii(Y,H,J),Mt.length>0&&ii(Mt,H,J),Ct.length>0&&ii(Ct,H,J),Dt.buffers.depth.setTest(!0),Dt.buffers.depth.setMask(!0),Dt.buffers.color.setMask(!0),Dt.setPolygonOffset(!1)}function fo(E,H,J,$){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;if(D.state.transmissionRenderTarget[$.id]===void 0){const ie=jt.has("EXT_color_buffer_half_float")||jt.has("EXT_color_buffer_float");D.state.transmissionRenderTarget[$.id]=new Wi(1,1,{generateMipmaps:!0,type:ie?gs:di,minFilter:ar,samples:pe.samples,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:me.workingColorSpace})}const Mt=D.state.transmissionRenderTarget[$.id],Ct=$.viewport||j;Mt.setSize(Ct.z*y.transmissionResolutionScale,Ct.w*y.transmissionResolutionScale);const Et=y.getRenderTarget(),It=y.getActiveCubeFace(),zt=y.getActiveMipmapLevel();y.setRenderTarget(Mt),y.getClearColor(dt),at=y.getClearAlpha(),at<1&&y.setClearColor(16777215,.5),y.clear(),qt&&xt.render(J);const Vt=y.toneMapping;y.toneMapping=Vi;const Ut=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),D.setupLightsView($),_t===!0&&At.setGlobalState(y.clippingPlanes,$),ii(E,J,$),U.updateMultisampleRenderTarget(Mt),U.updateRenderTargetMipmap(Mt),jt.has("WEBGL_multisampled_render_to_texture")===!1){let ie=!1;for(let Me=0,Ge=H.length;Me<Ge;Me++){const ke=H[Me],{object:Ae,geometry:Ht,material:Se,group:he}=ke;if(Se.side===zi&&Ae.layers.test($.layers)){const Tn=Se.side;Se.side=Hn,Se.needsUpdate=!0,po(Ae,J,$,Ht,Se,he),Se.side=Tn,Se.needsUpdate=!0,ie=!0}}ie===!0&&(U.updateMultisampleRenderTarget(Mt),U.updateRenderTargetMipmap(Mt))}y.setRenderTarget(Et,It,zt),y.setClearColor(dt,at),Ut!==void 0&&($.viewport=Ut),y.toneMapping=Vt}function ii(E,H,J){const $=H.isScene===!0?H.overrideMaterial:null;for(let Y=0,Mt=E.length;Y<Mt;Y++){const Ct=E[Y],{object:Et,geometry:It,group:zt}=Ct;let Vt=Ct.material;Vt.allowOverride===!0&&$!==null&&(Vt=$),Et.layers.test(J.layers)&&po(Et,H,J,It,Vt,zt)}}function po(E,H,J,$,Y,Mt){E.onBeforeRender(y,H,J,$,Y,Mt),E.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),Y.onBeforeRender(y,H,J,$,E,Mt),Y.transparent===!0&&Y.side===zi&&Y.forceSinglePass===!1?(Y.side=Hn,Y.needsUpdate=!0,y.renderBufferDirect(J,H,$,Y,E,Mt),Y.side=Fs,Y.needsUpdate=!0,y.renderBufferDirect(J,H,$,Y,E,Mt),Y.side=zi):y.renderBufferDirect(J,H,$,Y,E,Mt),E.onAfterRender(y,H,J,$,Y,Mt)}function Pi(E,H,J){H.isScene!==!0&&(H=fe);const $=x.get(E),Y=D.state.lights,Mt=D.state.shadowsArray,Ct=Y.state.version,Et=Lt.getParameters(E,Y.state,Mt,H,J),It=Lt.getProgramCacheKey(Et);let zt=$.programs;$.environment=E.isMeshStandardMaterial?H.environment:null,$.fog=H.fog,$.envMap=(E.isMeshStandardMaterial?nt:Z).get(E.envMap||$.environment),$.envMapRotation=$.environment!==null&&E.envMap===null?H.environmentRotation:E.envMapRotation,zt===void 0&&(E.addEventListener("dispose",mn),zt=new Map,$.programs=zt);let Vt=zt.get(It);if(Vt!==void 0){if($.currentProgram===Vt&&$.lightsStateVersion===Ct)return _i(E,Et),Vt}else Et.uniforms=Lt.getUniforms(E),E.onBeforeCompile(Et,y),Vt=Lt.acquireProgram(Et,It),zt.set(It,Vt),$.uniforms=Et.uniforms;const Ut=$.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ut.clippingPlanes=At.uniform),_i(E,Et),$.needsLights=Qe(E),$.lightsStateVersion=Ct,$.needsLights&&(Ut.ambientLightColor.value=Y.state.ambient,Ut.lightProbe.value=Y.state.probe,Ut.directionalLights.value=Y.state.directional,Ut.directionalLightShadows.value=Y.state.directionalShadow,Ut.spotLights.value=Y.state.spot,Ut.spotLightShadows.value=Y.state.spotShadow,Ut.rectAreaLights.value=Y.state.rectArea,Ut.ltc_1.value=Y.state.rectAreaLTC1,Ut.ltc_2.value=Y.state.rectAreaLTC2,Ut.pointLights.value=Y.state.point,Ut.pointLightShadows.value=Y.state.pointShadow,Ut.hemisphereLights.value=Y.state.hemi,Ut.directionalShadowMap.value=Y.state.directionalShadowMap,Ut.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Ut.spotShadowMap.value=Y.state.spotShadowMap,Ut.spotLightMatrix.value=Y.state.spotLightMatrix,Ut.spotLightMap.value=Y.state.spotLightMap,Ut.pointShadowMap.value=Y.state.pointShadowMap,Ut.pointShadowMatrix.value=Y.state.pointShadowMatrix),$.currentProgram=Vt,$.uniformsList=null,Vt}function xa(E){if(E.uniformsList===null){const H=E.currentProgram.getUniforms();E.uniformsList=Qo.seqWithValue(H.seq,E.uniforms)}return E.uniformsList}function _i(E,H){const J=x.get(E);J.outputColorSpace=H.outputColorSpace,J.batching=H.batching,J.batchingColor=H.batchingColor,J.instancing=H.instancing,J.instancingColor=H.instancingColor,J.instancingMorph=H.instancingMorph,J.skinning=H.skinning,J.morphTargets=H.morphTargets,J.morphNormals=H.morphNormals,J.morphColors=H.morphColors,J.morphTargetsCount=H.morphTargetsCount,J.numClippingPlanes=H.numClippingPlanes,J.numIntersection=H.numClipIntersection,J.vertexAlphas=H.vertexAlphas,J.vertexTangents=H.vertexTangents,J.toneMapping=H.toneMapping}function rn(E,H,J,$,Y){H.isScene!==!0&&(H=fe),U.resetTextureUnits();const Mt=H.fog,Ct=$.isMeshStandardMaterial?H.environment:null,Et=z===null?y.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:aa,It=($.isMeshStandardMaterial?nt:Z).get($.envMap||Ct),zt=$.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Vt=!!J.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Ut=!!J.morphAttributes.position,ie=!!J.morphAttributes.normal,Me=!!J.morphAttributes.color;let Ge=Vi;$.toneMapped&&(z===null||z.isXRRenderTarget===!0)&&(Ge=y.toneMapping);const ke=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Ae=ke!==void 0?ke.length:0,Ht=x.get($),Se=D.state.lights;if(_t===!0&&(te===!0||E!==V)){const on=E===V&&$.id===K;At.setState($,E,on)}let he=!1;$.version===Ht.__version?(Ht.needsLights&&Ht.lightsStateVersion!==Se.state.version||Ht.outputColorSpace!==Et||Y.isBatchedMesh&&Ht.batching===!1||!Y.isBatchedMesh&&Ht.batching===!0||Y.isBatchedMesh&&Ht.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Ht.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Ht.instancing===!1||!Y.isInstancedMesh&&Ht.instancing===!0||Y.isSkinnedMesh&&Ht.skinning===!1||!Y.isSkinnedMesh&&Ht.skinning===!0||Y.isInstancedMesh&&Ht.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Ht.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Ht.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Ht.instancingMorph===!1&&Y.morphTexture!==null||Ht.envMap!==It||$.fog===!0&&Ht.fog!==Mt||Ht.numClippingPlanes!==void 0&&(Ht.numClippingPlanes!==At.numPlanes||Ht.numIntersection!==At.numIntersection)||Ht.vertexAlphas!==zt||Ht.vertexTangents!==Vt||Ht.morphTargets!==Ut||Ht.morphNormals!==ie||Ht.morphColors!==Me||Ht.toneMapping!==Ge||Ht.morphTargetsCount!==Ae)&&(he=!0):(he=!0,Ht.__version=$.version);let Tn=Ht.currentProgram;he===!0&&(Tn=Pi($,H,Y));let vs=!1,An=!1,Zi=!1;const ye=Tn.getUniforms(),an=Ht.uniforms;if(Dt.useProgram(Tn.program)&&(vs=!0,An=!0,Zi=!0),$.id!==K&&(K=$.id,An=!0),vs||V!==E){Dt.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),ye.setValue(F,"projectionMatrix",E.projectionMatrix),ye.setValue(F,"viewMatrix",E.matrixWorldInverse);const wn=ye.map.cameraPosition;wn!==void 0&&wn.setValue(F,Yt.setFromMatrixPosition(E.matrixWorld)),pe.logarithmicDepthBuffer&&ye.setValue(F,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&ye.setValue(F,"isOrthographic",E.isOrthographicCamera===!0),V!==E&&(V=E,An=!0,Zi=!0)}if(Ht.needsLights&&(Se.state.directionalShadowMap.length>0&&ye.setValue(F,"directionalShadowMap",Se.state.directionalShadowMap,U),Se.state.spotShadowMap.length>0&&ye.setValue(F,"spotShadowMap",Se.state.spotShadowMap,U),Se.state.pointShadowMap.length>0&&ye.setValue(F,"pointShadowMap",Se.state.pointShadowMap,U)),Y.isSkinnedMesh){ye.setOptional(F,Y,"bindMatrix"),ye.setOptional(F,Y,"bindMatrixInverse");const on=Y.skeleton;on&&(on.boneTexture===null&&on.computeBoneTexture(),ye.setValue(F,"boneTexture",on.boneTexture,U))}Y.isBatchedMesh&&(ye.setOptional(F,Y,"batchingTexture"),ye.setValue(F,"batchingTexture",Y._matricesTexture,U),ye.setOptional(F,Y,"batchingIdTexture"),ye.setValue(F,"batchingIdTexture",Y._indirectTexture,U),ye.setOptional(F,Y,"batchingColorTexture"),Y._colorsTexture!==null&&ye.setValue(F,"batchingColorTexture",Y._colorsTexture,U));const Bn=J.morphAttributes;if((Bn.position!==void 0||Bn.normal!==void 0||Bn.color!==void 0)&&Kt.update(Y,J,Tn),(An||Ht.receiveShadow!==Y.receiveShadow)&&(Ht.receiveShadow=Y.receiveShadow,ye.setValue(F,"receiveShadow",Y.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(an.envMap.value=It,an.flipEnvMap.value=It.isCubeTexture&&It.isRenderTargetTexture===!1?-1:1),$.isMeshStandardMaterial&&$.envMap===null&&H.environment!==null&&(an.envMapIntensity.value=H.environmentIntensity),an.dfgLUT!==void 0&&(an.dfgLUT.value=aS()),An&&(ye.setValue(F,"toneMappingExposure",y.toneMappingExposure),Ht.needsLights&&Je(an,Zi),Mt&&$.fog===!0&&Bt.refreshFogUniforms(an,Mt),Bt.refreshMaterialUniforms(an,$,ht,St,D.state.transmissionRenderTarget[E.id]),Qo.upload(F,xa(Ht),an,U)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(Qo.upload(F,xa(Ht),an,U),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&ye.setValue(F,"center",Y.center),ye.setValue(F,"modelViewMatrix",Y.modelViewMatrix),ye.setValue(F,"normalMatrix",Y.normalMatrix),ye.setValue(F,"modelMatrix",Y.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){const on=$.uniformsGroups;for(let wn=0,va=on.length;wn<va;wn++){const Ji=on[wn];ft.update(Ji,Tn),ft.bind(Ji,Tn)}}return Tn}function Je(E,H){E.ambientLightColor.needsUpdate=H,E.lightProbe.needsUpdate=H,E.directionalLights.needsUpdate=H,E.directionalLightShadows.needsUpdate=H,E.pointLights.needsUpdate=H,E.pointLightShadows.needsUpdate=H,E.spotLights.needsUpdate=H,E.spotLightShadows.needsUpdate=H,E.rectAreaLights.needsUpdate=H,E.hemisphereLights.needsUpdate=H}function Qe(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return W},this.getRenderTarget=function(){return z},this.setRenderTargetTextures=function(E,H,J){const $=x.get(E);$.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,$.__autoAllocateDepthBuffer===!1&&($.__useRenderToTexture=!1),x.get(E.texture).__webglTexture=H,x.get(E.depthTexture).__webglTexture=$.__autoAllocateDepthBuffer?void 0:J,$.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,H){const J=x.get(E);J.__webglFramebuffer=H,J.__useDefaultFramebuffer=H===void 0};const xr=F.createFramebuffer();this.setRenderTarget=function(E,H=0,J=0){z=E,L=H,W=J;let $=null,Y=!1,Mt=!1;if(E){const Et=x.get(E);if(Et.__useDefaultFramebuffer!==void 0){Dt.bindFramebuffer(F.FRAMEBUFFER,Et.__webglFramebuffer),j.copy(E.viewport),G.copy(E.scissor),st=E.scissorTest,Dt.viewport(j),Dt.scissor(G),Dt.setScissorTest(st),K=-1;return}else if(Et.__webglFramebuffer===void 0)U.setupRenderTarget(E);else if(Et.__hasExternalTextures)U.rebindTextures(E,x.get(E.texture).__webglTexture,x.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Vt=E.depthTexture;if(Et.__boundDepthTexture!==Vt){if(Vt!==null&&x.has(Vt)&&(E.width!==Vt.image.width||E.height!==Vt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");U.setupDepthRenderbuffer(E)}}const It=E.texture;(It.isData3DTexture||It.isDataArrayTexture||It.isCompressedArrayTexture)&&(Mt=!0);const zt=x.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(zt[H])?$=zt[H][J]:$=zt[H],Y=!0):E.samples>0&&U.useMultisampledRTT(E)===!1?$=x.get(E).__webglMultisampledFramebuffer:Array.isArray(zt)?$=zt[J]:$=zt,j.copy(E.viewport),G.copy(E.scissor),st=E.scissorTest}else j.copy(Q).multiplyScalar(ht).floor(),G.copy(et).multiplyScalar(ht).floor(),st=bt;if(J!==0&&($=xr),Dt.bindFramebuffer(F.FRAMEBUFFER,$)&&Dt.drawBuffers(E,$),Dt.viewport(j),Dt.scissor(G),Dt.setScissorTest(st),Y){const Et=x.get(E.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+H,Et.__webglTexture,J)}else if(Mt){const Et=H;for(let It=0;It<E.textures.length;It++){const zt=x.get(E.textures[It]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+It,zt.__webglTexture,J,Et)}}else if(E!==null&&J!==0){const Et=x.get(E.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Et.__webglTexture,J)}K=-1},this.readRenderTargetPixels=function(E,H,J,$,Y,Mt,Ct,Et=0){if(!(E&&E.isWebGLRenderTarget)){de("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=x.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ct!==void 0&&(It=It[Ct]),It){Dt.bindFramebuffer(F.FRAMEBUFFER,It);try{const zt=E.textures[Et],Vt=zt.format,Ut=zt.type;if(!pe.textureFormatReadable(Vt)){de("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!pe.textureTypeReadable(Ut)){de("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=E.width-$&&J>=0&&J<=E.height-Y&&(E.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Et),F.readPixels(H,J,$,Y,lt.convert(Vt),lt.convert(Ut),Mt))}finally{const zt=z!==null?x.get(z).__webglFramebuffer:null;Dt.bindFramebuffer(F.FRAMEBUFFER,zt)}}},this.readRenderTargetPixelsAsync=async function(E,H,J,$,Y,Mt,Ct,Et=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let It=x.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ct!==void 0&&(It=It[Ct]),It)if(H>=0&&H<=E.width-$&&J>=0&&J<=E.height-Y){Dt.bindFramebuffer(F.FRAMEBUFFER,It);const zt=E.textures[Et],Vt=zt.format,Ut=zt.type;if(!pe.textureFormatReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!pe.textureTypeReadable(Ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ie=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,ie),F.bufferData(F.PIXEL_PACK_BUFFER,Mt.byteLength,F.STREAM_READ),E.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Et),F.readPixels(H,J,$,Y,lt.convert(Vt),lt.convert(Ut),0);const Me=z!==null?x.get(z).__webglFramebuffer:null;Dt.bindFramebuffer(F.FRAMEBUFFER,Me);const Ge=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await wg(F,Ge,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,ie),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,Mt),F.deleteBuffer(ie),F.deleteSync(Ge),Mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,H=null,J=0){const $=Math.pow(2,-J),Y=Math.floor(E.image.width*$),Mt=Math.floor(E.image.height*$),Ct=H!==null?H.x:0,Et=H!==null?H.y:0;U.setTexture2D(E,0),F.copyTexSubImage2D(F.TEXTURE_2D,J,0,0,Ct,Et,Y,Mt),Dt.unbindTexture()};const Xn=F.createFramebuffer(),Hs=F.createFramebuffer();this.copyTextureToTexture=function(E,H,J=null,$=null,Y=0,Mt=null){Mt===null&&(Y!==0?(eo("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Mt=Y,Y=0):Mt=0);let Ct,Et,It,zt,Vt,Ut,ie,Me,Ge;const ke=E.isCompressedTexture?E.mipmaps[Mt]:E.image;if(J!==null)Ct=J.max.x-J.min.x,Et=J.max.y-J.min.y,It=J.isBox3?J.max.z-J.min.z:1,zt=J.min.x,Vt=J.min.y,Ut=J.isBox3?J.min.z:0;else{const Bn=Math.pow(2,-Y);Ct=Math.floor(ke.width*Bn),Et=Math.floor(ke.height*Bn),E.isDataArrayTexture?It=ke.depth:E.isData3DTexture?It=Math.floor(ke.depth*Bn):It=1,zt=0,Vt=0,Ut=0}$!==null?(ie=$.x,Me=$.y,Ge=$.z):(ie=0,Me=0,Ge=0);const Ae=lt.convert(H.format),Ht=lt.convert(H.type);let Se;H.isData3DTexture?(U.setTexture3D(H,0),Se=F.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(U.setTexture2DArray(H,0),Se=F.TEXTURE_2D_ARRAY):(U.setTexture2D(H,0),Se=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,H.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,H.unpackAlignment);const he=F.getParameter(F.UNPACK_ROW_LENGTH),Tn=F.getParameter(F.UNPACK_IMAGE_HEIGHT),vs=F.getParameter(F.UNPACK_SKIP_PIXELS),An=F.getParameter(F.UNPACK_SKIP_ROWS),Zi=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,ke.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,ke.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,zt),F.pixelStorei(F.UNPACK_SKIP_ROWS,Vt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Ut);const ye=E.isDataArrayTexture||E.isData3DTexture,an=H.isDataArrayTexture||H.isData3DTexture;if(E.isDepthTexture){const Bn=x.get(E),on=x.get(H),wn=x.get(Bn.__renderTarget),va=x.get(on.__renderTarget);Dt.bindFramebuffer(F.READ_FRAMEBUFFER,wn.__webglFramebuffer),Dt.bindFramebuffer(F.DRAW_FRAMEBUFFER,va.__webglFramebuffer);for(let Ji=0;Ji<It;Ji++)ye&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,x.get(E).__webglTexture,Y,Ut+Ji),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,x.get(H).__webglTexture,Mt,Ge+Ji)),F.blitFramebuffer(zt,Vt,Ct,Et,ie,Me,Ct,Et,F.DEPTH_BUFFER_BIT,F.NEAREST);Dt.bindFramebuffer(F.READ_FRAMEBUFFER,null),Dt.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(Y!==0||E.isRenderTargetTexture||x.has(E)){const Bn=x.get(E),on=x.get(H);Dt.bindFramebuffer(F.READ_FRAMEBUFFER,Xn),Dt.bindFramebuffer(F.DRAW_FRAMEBUFFER,Hs);for(let wn=0;wn<It;wn++)ye?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Bn.__webglTexture,Y,Ut+wn):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Bn.__webglTexture,Y),an?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,on.__webglTexture,Mt,Ge+wn):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,on.__webglTexture,Mt),Y!==0?F.blitFramebuffer(zt,Vt,Ct,Et,ie,Me,Ct,Et,F.COLOR_BUFFER_BIT,F.NEAREST):an?F.copyTexSubImage3D(Se,Mt,ie,Me,Ge+wn,zt,Vt,Ct,Et):F.copyTexSubImage2D(Se,Mt,ie,Me,zt,Vt,Ct,Et);Dt.bindFramebuffer(F.READ_FRAMEBUFFER,null),Dt.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else an?E.isDataTexture||E.isData3DTexture?F.texSubImage3D(Se,Mt,ie,Me,Ge,Ct,Et,It,Ae,Ht,ke.data):H.isCompressedArrayTexture?F.compressedTexSubImage3D(Se,Mt,ie,Me,Ge,Ct,Et,It,Ae,ke.data):F.texSubImage3D(Se,Mt,ie,Me,Ge,Ct,Et,It,Ae,Ht,ke):E.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,Mt,ie,Me,Ct,Et,Ae,Ht,ke.data):E.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,Mt,ie,Me,ke.width,ke.height,Ae,ke.data):F.texSubImage2D(F.TEXTURE_2D,Mt,ie,Me,Ct,Et,Ae,Ht,ke);F.pixelStorei(F.UNPACK_ROW_LENGTH,he),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Tn),F.pixelStorei(F.UNPACK_SKIP_PIXELS,vs),F.pixelStorei(F.UNPACK_SKIP_ROWS,An),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Zi),Mt===0&&H.generateMipmaps&&F.generateMipmap(Se),Dt.unbindTexture()},this.initRenderTarget=function(E){x.get(E).__webglFramebuffer===void 0&&U.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?U.setTextureCube(E,0):E.isData3DTexture?U.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?U.setTexture2DArray(E,0):U.setTexture2D(E,0),Dt.unbindTexture()},this.resetState=function(){L=0,W=0,z=null,Dt.reset(),wt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Hi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=me._getDrawingBufferColorSpace(t),e.unpackColorSpace=me._getUnpackColorSpace()}}const Wf={type:"change"},ch={type:"start"},Fp={type:"end"},Vo=new oh,Xf=new Ds,lS=Math.cos(70*Cg.DEG2RAD),ln=new X,zn=2*Math.PI,Ne={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Mc=1e-6;class cS extends h0{constructor(t,e=null){super(t,e),this.state=Ne.NONE,this.target=new X,this.cursor=new X,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Jr.ROTATE,MIDDLE:Jr.DOLLY,RIGHT:Jr.PAN},this.touches={ONE:$r.ROTATE,TWO:$r.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new X,this._lastQuaternion=new dr,this._lastTargetPosition=new X,this._quat=new dr().setFromUnitVectors(t.up,new X(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new vf,this._sphericalDelta=new vf,this._scale=1,this._panOffset=new X,this._rotateStart=new Xt,this._rotateEnd=new Xt,this._rotateDelta=new Xt,this._panStart=new Xt,this._panEnd=new Xt,this._panDelta=new Xt,this._dollyStart=new Xt,this._dollyEnd=new Xt,this._dollyDelta=new Xt,this._dollyDirection=new X,this._mouse=new Xt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=hS.bind(this),this._onPointerDown=uS.bind(this),this._onPointerUp=fS.bind(this),this._onContextMenu=vS.bind(this),this._onMouseWheel=mS.bind(this),this._onKeyDown=gS.bind(this),this._onTouchStart=_S.bind(this),this._onTouchMove=xS.bind(this),this._onMouseDown=dS.bind(this),this._onMouseMove=pS.bind(this),this._interceptControlDown=MS.bind(this),this._interceptControlUp=SS.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Wf),this.update(),this.state=Ne.NONE}update(t=null){const e=this.object.position;ln.copy(e).sub(this.target),ln.applyQuaternion(this._quat),this._spherical.setFromVector3(ln),this.autoRotate&&this.state===Ne.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=zn:i>Math.PI&&(i-=zn),s<-Math.PI?s+=zn:s>Math.PI&&(s-=zn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(ln.setFromSpherical(this._spherical),ln.applyQuaternion(this._quatInverse),e.copy(this.target).add(ln),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=ln.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new X(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new X(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=ln.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Vo.origin.copy(this.object.position),Vo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Vo.direction))<lS?this.object.lookAt(this.target):(Xf.setFromNormalAndCoplanarPoint(this.object.up,this.target),Vo.intersectPlane(Xf,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Mc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Mc||this._lastTargetPosition.distanceToSquared(this.target)>Mc?(this.dispatchEvent(Wf),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?zn/60*this.autoRotateSpeed*t:zn/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){ln.setFromMatrixColumn(e,0),ln.multiplyScalar(-t),this._panOffset.add(ln)}_panUp(t,e){this.screenSpacePanning===!0?ln.setFromMatrixColumn(e,1):(ln.setFromMatrixColumn(e,0),ln.crossVectors(this.object.up,ln)),ln.multiplyScalar(t),this._panOffset.add(ln)}_pan(t,e){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;ln.copy(s).sub(this.target);let r=ln.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/i.clientHeight,this.object.matrix),this._panUp(2*e*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=t-i.left,r=e-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(zn*this._rotateDelta.x/e.clientHeight),this._rotateUp(zn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(zn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-zn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(zn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-zn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(i,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),r=.5*(t.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(zn*this._rotateDelta.x/e.clientHeight),this._rotateUp(zn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Xt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function uS(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function hS(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function fS(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Fp),this.state=Ne.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function dS(n){let t;switch(n.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Jr.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=Ne.DOLLY;break;case Jr.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Ne.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Ne.ROTATE}break;case Jr.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Ne.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Ne.PAN}break;default:this.state=Ne.NONE}this.state!==Ne.NONE&&this.dispatchEvent(ch)}function pS(n){switch(this.state){case Ne.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case Ne.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case Ne.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function mS(n){this.enabled===!1||this.enableZoom===!1||this.state!==Ne.NONE||(n.preventDefault(),this.dispatchEvent(ch),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Fp))}function gS(n){this.enabled!==!1&&this._handleKeyDown(n)}function _S(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case $r.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=Ne.TOUCH_ROTATE;break;case $r.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=Ne.TOUCH_PAN;break;default:this.state=Ne.NONE}break;case 2:switch(this.touches.TWO){case $r.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=Ne.TOUCH_DOLLY_PAN;break;case $r.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=Ne.TOUCH_DOLLY_ROTATE;break;default:this.state=Ne.NONE}break;default:this.state=Ne.NONE}this.state!==Ne.NONE&&this.dispatchEvent(ch)}function xS(n){switch(this._trackPointer(n),this.state){case Ne.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case Ne.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case Ne.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case Ne.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=Ne.NONE}}function vS(n){this.enabled!==!1&&n.preventDefault()}function MS(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function SS(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const uh=["VELX","VELY","ROT","EATN","SIZE","ECHG","MR","MG","MB","MS","E1R","E1G","E1B","E1S","E2R","E2G","E2B","E2S","E3R","E3G","E3B","E3S","E4R","E4G","E4B","E4S","E5R","E5G","E5B","E5S","B+","B-"],ll=["VELX","VELY","ROT","EATR","EATG","EATB","REPR","MUT","MX","MY","E1X","E1Y","E2X","E2Y","E3X","E3Y","E4X","E4Y","E5X","E5Y"];let ca=null,Xi=null,fi=null,ir=null,Jn=null,Yf=null;const cl=[],ul=[],Cu=[],Pu=[],so=[],ur=[],ls=[],qf=new u0,Sc=new Xt;let Ti=null;const Bi=2,yS=.08,jf=.1;let Wa=null;function ES(n,t,e){const i=ee,s=new Array(i).fill(0),r=new Array(i).fill(0),a=new Array(i).fill(0),o=new Array(i).fill(0);if(n.parent===null)return{advW1:s,advW2:r,disW1:a,disW2:o,advCount:0,disCount:0};const l=Op(n.parent,n.parent);let c=0,h=0;for(const u of l){const f=u>=0?_.amoebs[u]:_.graveyard[-(u+1)];if(!f||f.parent===null)continue;const p=f.parent>=0?_.amoebs[f.parent]:_.graveyard[-(f.parent+1)];if(!p)continue;const v=t==="input"?f.inputs[e]:f.outputs[e],S=t==="input"?p.inputs[e]:p.outputs[e];if(f.children.length>0)for(let m=0;m<f.children.length;m++){for(let d=0;d<i;d++)s[d]+=v.weights1[d]-S.weights1[d],r[d]+=v.weights2[d]-S.weights2[d];c++}else if(u<0){for(let m=0;m<i;m++)a[m]+=v.weights1[m]-S.weights1[m],o[m]+=v.weights2[m]-S.weights2[m];h++}}if(c>0)for(let u=0;u<i;u++)s[u]/=c,r[u]/=c;if(h>0)for(let u=0;u<i;u++)a[u]/=h,o[u]/=h;return{advW1:s,advW2:r,disW1:a,disW2:o,advCount:c,disCount:h}}function Op(n,t){const e=[],i=n>=0?_.amoebs[n]:_.graveyard[-(n+1)];if(!i)return e;for(const s of i.children)e.push(...Op(s,t));return n!==t&&e.push(n),e}function Kf(n){const t=document.createElement("canvas"),e=t.getContext("2d");if(!e){const l=new no({color:16777215});return new ol(l)}t.width=128,t.height=64,e.clearRect(0,0,t.width,t.height),e.fillStyle="rgba(0, 0, 0, 0.6)";const i=4;bS(e,i,i,t.width-i*2,t.height-i*2,8),e.fill(),e.font="bold 20px monospace",e.textAlign="center",e.textBaseline="middle",e.fillStyle="#ffffff",e.fillText(n,t.width/2,t.height/2);const r=new Rp(t);r.minFilter=sn,r.magFilter=sn;const a=new no({map:r,transparent:!0,depthTest:!1}),o=new ol(a);return o.scale.set(.5,.25,1),o.userData.canvas=t,o.userData.ctx=e,o}function $f(n,t,e){if(!n||!n.userData)return;const i=n.userData.canvas,s=n.userData.ctx;if(!i||!s)return;s.clearRect(0,0,i.width,i.height),s.font="bold 16px monospace",s.textAlign="center",s.textBaseline="middle",s.fillStyle="#000000",s.fillText(t,i.width/2,i.height/2-12),s.font="14px monospace",s.fillText(e.toFixed(2),i.width/2,i.height/2+12);const r=n.material;r.map&&(r.map.needsUpdate=!0)}function Zf(n){const t=document.createElement("canvas"),e=t.getContext("2d");if(!e){const a=new no({color:16777215});return new ol(a)}t.width=256,t.height=64,e.clearRect(0,0,t.width,t.height),e.font="bold 32px monospace",e.textAlign="center",e.textBaseline="middle",e.fillStyle="#00000020",e.fillText(n,t.width/2,t.height/2);const i=new Rp(t);i.minFilter=sn,i.magFilter=sn;const s=new no({map:i,transparent:!0,depthTest:!1}),r=new ol(s);return r.scale.set(1.2,.3,1),r}function bS(n,t,e,i,s,r){n.beginPath(),n.moveTo(t+r,e),n.lineTo(t+i-r,e),n.quadraticCurveTo(t+i,e,t+i,e+r),n.lineTo(t+i,e+s-r),n.quadraticCurveTo(t+i,e+s,t+i-r,e+s),n.lineTo(t+r,e+s),n.quadraticCurveTo(t,e+s,t,e+s-r),n.lineTo(t,e+r),n.quadraticCurveTo(t,e,t+r,e),n.closePath()}function TS(n){Ti=n,ca=new Qg;const t=Ti.clientWidth/Ti.clientHeight;Xi=new hi(50,t,.1,100),Xi.position.set(0,0,6),fi=new oS({antialias:!1,alpha:!0,precision:"lowp"}),fi.setSize(Ti.clientWidth,Ti.clientHeight),fi.setPixelRatio(Math.min(window.devicePixelRatio,2)),Ti.appendChild(fi.domElement),ir=new cS(Xi,fi.domElement),ir.enableDamping=!0,ir.dampingFactor=.05,ir.minDistance=3,ir.maxDistance=15,Jn=new Ha,ca.add(Jn);const e=new Ml(Bi,16,12),i=new oa({color:13421772,transparent:!0,opacity:.1,wireframe:!0}),s=new ti(e,i);Jn.add(s),AS(),wS(),fi.domElement.addEventListener("click",PS),Bp()}function AS(){so.length=0,ur.length=0;const n=Math.ceil(Math.sqrt(Sn)),t=Math.ceil(Sn/n);for(let s=0;s<Sn;s++){const r=Math.floor(s/t),a=s%t,o=Math.PI/4+r/n*(Math.PI/2),l=Math.PI+a/t*(Math.PI/2)-Math.PI/4,c=Bi*Math.sin(o)*Math.cos(l),h=Bi*Math.cos(o),u=Bi*Math.sin(o)*Math.sin(l);so.push(new X(c,h,u))}const e=Math.ceil(Math.sqrt(ee)),i=Math.ceil(ee/e);for(let s=0;s<ee;s++){const r=Math.floor(s/i),a=s%i,o=Math.PI/4+r/e*(Math.PI*2/3),l=a/i*Math.PI-Math.PI/2,c=Bi*Math.sin(o)*Math.cos(l),h=Bi*Math.cos(o),u=Bi*Math.sin(o)*Math.sin(l);ur.push(new X(c,h,u))}}function wS(){if(!Jn)return;const n=new Ml(yS,6,4);for(let s=0;s<Sn;s++){const r=new oa({color:65280,transparent:!0}),a=new ti(n,r);a.position.copy(so[s]),a.userData={type:"input",index:s},Jn.add(a),cl.push(a);const o=uh[s]||`I${s}`,l=Kf(o),c=so[s].clone(),h=c.clone().normalize().multiplyScalar(jf);l.position.copy(c).add(h),Jn.add(l),Cu.push(l)}for(let s=0;s<ee;s++){const r=new oa({color:255,transparent:!0}),a=new ti(n,r);a.position.copy(ur[s]),a.userData={type:"output",index:s},Jn.add(a),ul.push(a);const o=ll[s]||`O${s}`,l=Kf(o),c=ur[s].clone(),h=c.clone().normalize().multiplyScalar(jf);l.position.copy(c).add(h),Jn.add(l),Pu.push(l)}const t=Bi+.25,e=Zf("INPUTS");e.position.set(-t,Bi,0),Jn.add(e);const i=Zf("OUTPUTS");i.position.set(t,Bi,0),Jn.add(i)}const El=Sn*ee+ee*(ee-1),Jf=.02,Xe=new Float32Array(El*4*3),rs=new Float32Array(El*4*4),Js=new Uint16Array(El*6);for(let n=0;n<El;n++){const t=n*4,e=n*6;Js[e]=t,Js[e+1]=t+1,Js[e+2]=t+2,Js[e+3]=t+2,Js[e+4]=t+1,Js[e+5]=t+3}const Yr=new X,_e=new X,Qf=new X(0,1,0),td=new X(1,0,0);let as=null,ed=null;function RS(n){if(!Jn)return;as||(as=new gi,as.setAttribute("position",new Wn(Xe,3)),as.setAttribute("color",new Wn(rs,4)),as.setIndex(new Wn(Js,1)),ed=new oa({vertexColors:!0,transparent:!0,side:zi,depthWrite:!1}),Yf=new ti(as,ed),Jn.add(Yf));let t=0;for(let e=0;e<Sn;e++){const i=n.inputs[e];for(let s=0;s<ee;s++){const r=i.in>0?i.weights1[s]:i.weights2[s];if(Math.abs(r)<.05)continue;const a=so[e],o=ur[s];Yr.subVectors(o,a).normalize(),_e.crossVectors(Yr,Qf),_e.lengthSq()<.001&&_e.crossVectors(Yr,td),_e.normalize();const l=Math.abs(r)*Jf/2,c=t*12;Xe[c]=a.x+_e.x*l,Xe[c+1]=a.y+_e.y*l,Xe[c+2]=a.z+_e.z*l,Xe[c+3]=a.x-_e.x*l,Xe[c+4]=a.y-_e.y*l,Xe[c+5]=a.z-_e.z*l,Xe[c+6]=o.x+_e.x*l,Xe[c+7]=o.y+_e.y*l,Xe[c+8]=o.z+_e.z*l,Xe[c+9]=o.x-_e.x*l,Xe[c+10]=o.y-_e.y*l,Xe[c+11]=o.z-_e.z*l;const h=Math.min(Math.abs(r),1),u=r<0?1:0,f=r>0?h:0,p=0,v=h,S=t*16;for(let m=0;m<4;m++)rs[S+m*4]=u,rs[S+m*4+1]=f,rs[S+m*4+2]=p,rs[S+m*4+3]=v;t++}}for(let e=0;e<ee;e++){const i=n.outputs[e];for(let s=0;s<ee;s++){if(e===s)continue;const r=i.in>0?i.weights1[s]:i.weights2[s];if(Math.abs(r)<.05)continue;const a=ur[e],o=ur[s];Yr.subVectors(o,a).normalize(),_e.crossVectors(Yr,Qf),_e.lengthSq()<.001&&_e.crossVectors(Yr,td),_e.normalize();const l=Math.abs(r)*Jf/2,c=t*12;Xe[c]=a.x+_e.x*l,Xe[c+1]=a.y+_e.y*l,Xe[c+2]=a.z+_e.z*l,Xe[c+3]=a.x-_e.x*l,Xe[c+4]=a.y-_e.y*l,Xe[c+5]=a.z-_e.z*l,Xe[c+6]=o.x+_e.x*l,Xe[c+7]=o.y+_e.y*l,Xe[c+8]=o.z+_e.z*l,Xe[c+9]=o.x-_e.x*l,Xe[c+10]=o.y-_e.y*l,Xe[c+11]=o.z-_e.z*l;const h=Math.min(Math.abs(r),1),u=r<0?1:0,f=0,p=r>0?h:0,v=h,S=t*16;for(let m=0;m<4;m++)rs[S+m*4]=u,rs[S+m*4+1]=f,rs[S+m*4+2]=p,rs[S+m*4+3]=v;t++}}as.setDrawRange(0,t*6),as.attributes.position.needsUpdate=!0,as.attributes.color.needsUpdate=!0}function CS(n){for(let t=0;t<Sn;t++){const e=n.inputs[t].in,s=cl[t].material,r=Math.min(Math.abs(e),1),a=e>=0?.3333:0;s.color.setHSL(a,1,.5),s.transparent=!0,s.opacity=r;const o=uh[t]||`I${t}`;Cu[t]&&$f(Cu[t],o,e)}for(let t=0;t<ee;t++){const e=t<30?n.outputs[t].out:n.outputs[t].in,s=ul[t].material,r=Math.min(Math.abs(e),1),a=e>=0?.6666:0;s.color.setHSL(a,1,.5),s.transparent=!0,s.opacity=r;const o=ll[t]||`O${t}`;Pu[t]&&$f(Pu[t],o,e)}}function PS(n){if(!Xi||!fi||!ca)return;const t=fi.domElement.getBoundingClientRect();Sc.x=(n.clientX-t.left)/t.width*2-1,Sc.y=-((n.clientY-t.top)/t.height)*2+1,qf.setFromCamera(Sc,Xi);const e=[...cl,...ul],i=qf.intersectObjects(e);if(i.length>0){const s=i[0].object,{type:r,index:a}=s.userData,o=ls.findIndex(l=>l.type===r&&l.index===a);o>=0?(ls.splice(o,1),s.material.color.setHex(r==="input"?4500036:4474026)):(ls.push({type:r,index:a}),s.material.color.setHex(16776960)),Du()}else{for(const s of ls){const r=s.type==="input"?cl[s.index]:ul[s.index];r&&r.material.color.setHex(s.type==="input"?4500036:4474026)}ls.length=0,Du()}}function Du(){if(!Wa)return;const n=document.getElementById("brain3d-weights");if(!n)return;if(ls.length===0){n.style.display="none";return}n.style.display="block";let t="";for(const e of ls){const i=e.type==="input"?Wa.inputs[e.index]:Wa.outputs[e.index],s=e.type==="input"?uh[e.index]||`I${e.index}`:ll[e.index]||`O${e.index}`,{advW1:r,advW2:a,disW1:o,disW2:l,advCount:c,disCount:h}=ES(Wa,e.type,e.index);t+=`<b>${e.type.toUpperCase()} ${s}</b><br>`,t+='<table class="neuron-weights-table" style="width:100%; border-collapse:collapse; font-size:8px;">',t+=`<tr>
      <th>Target</th>
      <th>W1</th>
      <th>σ1</th>
      <th style="color:green">Adv(${c})</th>
      <th style="color:red">Dis(${h})</th>
      <th>W1'</th>
      <th style="border-left:1px solid #ccc"></th>
      <th>W2</th>
      <th>σ2</th>
      <th style="color:green">Adv(${c})</th>
      <th style="color:red">Dis(${h})</th>
      <th>W2'</th>
    </tr>`;for(let u=0;u<ee;u++){const f=ll[u]||`O${u}`,p=i.weights1[u],v=i.weights2[u],S=i.sigmas1[u],m=i.sigmas2[u],d=p+r[u]-o[u],b=v+a[u]-l[u];t+=`<tr>
        <td>${f}</td>
        <td>${p.toFixed(3)}</td>
        <td style="color:#888">${S.toFixed(3)}</td>
        <td style="color:green">${r[u].toFixed(3)}</td>
        <td style="color:red">${o[u].toFixed(3)}</td>
        <td><b>${d.toFixed(3)}</b></td>
        <td style="border-left:1px solid #ccc"></td>
        <td>${v.toFixed(3)}</td>
        <td style="color:#888">${m.toFixed(3)}</td>
        <td style="color:green">${a[u].toFixed(3)}</td>
        <td style="color:red">${l[u].toFixed(3)}</td>
        <td><b>${b.toFixed(3)}</b></td>
      </tr>`}t+="</table><br>"}n.innerHTML=t}function Bp(){if(requestAnimationFrame(Bp),!(Ti&&Ti.style.display==="none")&&(ir&&ir.update(),fi&&ca&&Xi))try{fi.render(ca,Xi)}catch{}}function DS(n){!ca||!Jn||(Wa=n,RS(n),CS(n),ls.length>0&&Du())}function hl(){if(!Ti||!Xi||!fi)return;const n=Ti.clientWidth,e=Math.max(250,Math.min(n*1,600));Ti.style.height=e+"px";const i=e;Xi.aspect=n/i,Xi.updateProjectionMatrix(),fi.setSize(n,i)}function LS(){ls.length=0;const n=document.getElementById("brain3d-weights");n&&(n.style.display="none")}let En=null;const sr=[];let nd=null,id;function IS(){En=document.getElementById("family-tree")}function qr(n){return n>=0?_.amoebs[n]||null:_.graveyard[-(n+1)]||null}function US(n){return`${n.name}-${n.gen}${n.status==="alive"?"A":"D"}${n.descendants}`}function Fa(n,t){const e=document.createElement("div");return e.className="family-member",n.status!=="alive"&&(e.className+=" family-member-dead"),n.index===_.highlighted&&(e.className+=" family-member-self"),e.innerHTML=`<span class="family-label">${t}</span><span class="family-name">${US(n)}</span>`,e.addEventListener("click",()=>{_.highlighted!==null&&_.highlighted!==n.index&&sr.push(_.highlighted),_.highlighted=n.index,co(!0)}),e}function yc(n){const t=document.createElement("div");t.className="family-section";const e=document.createElement("div");return e.className="family-section-header",e.textContent=n,t.appendChild(e),t}function co(n=!1,t=void 0){if(En||(En=document.getElementById("family-tree")),!En)return;const e=_.highlighted!==nd;if(!n&&!e&&!(t!==id))return;if(console.log("RERENDERING FAM TREE"),nd=_.highlighted,id=t,_.highlighted===null){En.innerHTML='<div class="family-empty">No amoeb selected</div>';return}const s=qr(_.highlighted);if(!s){En.innerHTML='<div class="family-empty">Amoeb not found</div>';return}En.innerHTML="";const r=document.createElement("div");r.className="family-nav";const a=document.createElement("button");a.className="family-back-btn",a.innerHTML="&larr; Back",a.disabled=sr.length===0,a.addEventListener("click",()=>{sr.length>0&&(_.highlighted=sr.pop(),co(!0))}),r.appendChild(a);const o=document.createElement("span");if(o.className="family-history-count",o.textContent=sr.length>0?`(${sr.length})`:"",r.appendChild(o),En.appendChild(r),s.parent!==null){const l=qr(s.parent);if(l){const c=yc("Parent");c.appendChild(Fa(l,"")),En.appendChild(c);const h=[];for(const u of l.children)if(u!==s.index){const f=qr(u);f&&h.push(f)}if(h.length>0){const u=yc(`Siblings (${h.length})`);for(const f of h){const p=document.createElement("div");if(p.className="family-sibling-row",p.appendChild(Fa(f,"")),f.children.length>0){const v=document.createElement("div");v.className="family-niblings";for(const S of f.children){const m=qr(S);m&&v.appendChild(Fa(m,""))}p.appendChild(v)}u.appendChild(p)}En.appendChild(u)}}}if(s.children.length>0){const l=yc(`Children (${s.children.length})`);for(const c of s.children){const h=qr(c);if(h){const u=document.createElement("div");if(u.className="family-child-row",u.appendChild(Fa(h,"")),h.children.length>0){const f=document.createElement("div");f.className="family-grandchildren";for(const p of h.children){const v=qr(p);v&&f.appendChild(Fa(v,""))}u.appendChild(f)}l.appendChild(u)}}En.appendChild(l)}}function NS(){if(_.highlighted===null)return;const n=document.getElementById("brain"),t=document.getElementById("neuron-weights");En||(En=document.getElementById("family-tree")),_.display==="family"?(_.display="default",En&&(En.style.display="none"),sr.length=0):(_.display="family",n&&(n.style.display="none"),t&&(t.style.display="none"),En&&(En.style.display="block"),co(!0))}class uo{index;grave;x;y;status="alive";tile=null;size=bs;health=0;gen=0;born=0;parent=null;sibling_idx=null;children=[];descendants=0;proGenes=0;conGenes=0;name;velocityX=0;velocityY=0;rotation=0;direction;eyes;mouth;redEaten=.003;greenEaten=.003;blueEaten=.003;currEaten=0;netEaten=.01;inputs;outputs;energy;maxEnergy;energyChange=0;totalEnergyGain=0;currDamage=0;damageReceived=0;damageCaused=0;cols=new Uint8ClampedArray(9);lr=0;brain=[];constructor(t,e,i){this.index=i,this.x=t,this.y=e,this.name=Wm(Aa),this.direction=ue(Math.random()*360),this.born=_.stats.time,this.eyes=new Array(5);for(let s=0;s<5;s++)this.eyes[s]=new Dc(this.x,this.y);this.mouth=new Lc(this.x,this.y),this.inputs=new Array(Sn),this.outputs=new Array(ee);for(let s=0;s<Sn;s++)this.inputs[s]=new Ga,s<30?this.inputs[s].init(ee,8):this.inputs[s].init(ee,0);for(let s=0;s<ee;s++)this.outputs[s]=new Ga,this.outputs[s].init(ee,0);this.energy=bs*1e3,this.maxEnergy=this.energy}move(){this.velocityX=this.outputs[0].out*2/(1+this.currDamage+this.size/4),this.velocityY=this.outputs[1].out*2/(1+this.currDamage+this.size/4),this.rotation=this.outputs[2].out*10/(1+this.currDamage+this.size/4),this.direction+=this.rotation,this.direction<0?this.direction+=360:this.direction>359&&(this.direction-=360);const t=this.direction*ui;this.x+=this.velocityX*Math.cos(t)+this.velocityY*Math.sin(t),this.y+=this.velocityX*Math.sin(t)-this.velocityY*Math.cos(t),(this.x<0||this.x>=ps)&&(this.x=this.x<0?0:ps-1,this.velocityX=0,this.velocityY=0),(this.y<0||this.y>=ms)&&(this.y=this.y<0?0:ms-1,this.velocityX=0,this.velocityY=0);let e=~~(this.y/kn)*Gn+~~(this.x/kn);e>=Gn*gl?this.tile=Ym-1:e<0&&(this.tile=0),this.tile=e,this.mouth.move(this.direction,this.x,this.y,this.outputs[8].out*2*this.size,this.outputs[9].out*2*this.size);for(let i=0;i<5;i++)this.eyes[i].move(this.direction,this.x,this.y,this.outputs[i*2+10].out*5*this.size,this.outputs[i*2+11].out*5*this.size)}sense(){const t=this.size;this.mouth.sense();for(let e=0;e<5;e++)this.eyes[e].sense();for(let e=0;e<=_.HIGHESTINDEX;e++)if(_.amoebs[e].status!=="dead"&&e!==this.index){const i=_.amoebs[e],s=_.amoebs[e].status==="decaying";this.mouth.detected===-1&&Ie(this.mouth.x-i.x)<=i.size/2+t/4&&Ie(this.mouth.y-i.y)<=i.size/2+t/4&&(this.mouth.s=(s?-1:1)*(i.size-bs)/(Ta-bs),this.mouth.r=i.outputs[3].out,this.mouth.g=i.outputs[4].out,this.mouth.b=i.outputs[5].out,this.mouth.detected=e);for(let r=0;r<5;r++)this.eyes[r].detected===-1&&Ie(this.eyes[r].x-i.x)<=t/4+i.size/2&&Ie(this.eyes[r].y-i.y)<=t/4+i.size/2&&(this.eyes[r].s=(s?-1:1)*(i.size-bs)/(Ta-bs),this.eyes[r].r=i.outputs[3].out,this.eyes[r].g=i.outputs[4].out,this.eyes[r].b=i.outputs[5].out,this.eyes[r].detected=e)}}eat(){const t=this.size;this.currEaten=0;let e=0,i=0,s=0;if(this.mouth.detected!==-1){const r=_.amoebs[this.mouth.detected];if(r.status==="alive")e=this.outputs[3].out>0?0:(1-Ie(-this.outputs[3].out-Ie(r.outputs[3].out)))*t,i=this.outputs[4].out>0?0:(1-Ie(-this.outputs[4].out-Ie(r.outputs[4].out)))*t,s=this.outputs[5].out>0?0:(1-Ie(-this.outputs[5].out-Ie(r.outputs[5].out)))*t,this.redEaten+=e,this.greenEaten+=i,this.blueEaten+=s,this.currEaten=e+i+s,this.netEaten+=this.currEaten,r.currDamage+=this.currEaten*t,r.damageReceived+=this.currEaten,this.damageCaused+=this.currEaten;else if(r.status==="decaying"){e=this.outputs[3].out>0?0:(1-Ie(-this.outputs[3].out-Ie(r.outputs[3].out)))*t,i=this.outputs[4].out>0?0:(1-Ie(-this.outputs[4].out-Ie(r.outputs[4].out)))*t,s=this.outputs[5].out>0?0:(1-Ie(-this.outputs[5].out-Ie(r.outputs[5].out)))*t;const a=e+i+s,o=Math.min(a,r.size*Wh),l=a>0?o/a:0;e*=l,i*=l,s*=l,r.size-=o/Wh,r.size=Vm(r.size,0,r.size),this.redEaten+=e,this.greenEaten+=i,this.blueEaten+=s,this.currEaten=e+i+s,this.netEaten+=this.currEaten}}else if(this.mouth.tile!==null){const r=this.mouth.tile,a=_.tiles[r];e=this.outputs[3].out<0?0:this.outputs[3].out*t,i=this.outputs[4].out<0?0:this.outputs[4].out*t,s=this.outputs[5].out<0?0:this.outputs[5].out*t,a.R>-a.RCap&&(a.R-=e/1.5),a.G>-a.GCap&&(a.G-=i),a.B>-a.BCap&&(a.B-=s/2),e*=a.R/a.RCap,i*=a.G/a.GCap,s*=a.B/a.BCap,e>0&&(this.redEaten+=e),i>0&&(this.greenEaten+=i),s>0&&(this.blueEaten+=s),this.netEaten+=Ie(e)+Ie(i)+Ie(s),this.currEaten=e+i+s}else this.currEaten=-1}draw(t){const e=_.ctx.map;if(!e)return;t[0]=50+ue(Ie(this.outputs[3].out)*205),t[1]=50+ue(Ie(this.outputs[4].out)*205),t[2]=50+ue(Ie(this.outputs[5].out)*205),t[3]=t[0]+40,t[4]=t[1]+40,t[5]=t[2]+40,t[6]=t[0]+80,t[7]=t[1]+80,t[8]=t[2]+80;const i=this.size/8;e.fillStyle=`rgb(${t[6]},${t[7]},${t[8]})`;for(let s=0;s<5;s++)e.beginPath(),e.arc(this.eyes[s].x,this.eyes[s].y,i,0,xo),e.fill();e.fillStyle=`rgb(${t[0]},${t[1]},${t[2]})`,e.beginPath(),e.arc(this.x,this.y,this.size/2,0,xo),e.fill(),e.fillStyle=`rgb(${t[3]},${t[4]},${t[5]})`,e.beginPath(),e.arc(this.mouth.x,this.mouth.y,this.size/4,0,xo),e.fill(),_.mouse.overMap&&_.mouse.x>=this.x-50&&_.mouse.x<this.x+50&&_.mouse.y>=this.y-50&&_.mouse.y<this.y+50&&_.highlighted!==this.index&&(e.fillStyle="#FFFFFF",e.fillText(this.name+"-"+this.gen+(this.status==="alive"?"A":"D")+this.descendants,this.x+2*this.size,this.y-2*this.size+2))}age(){const t=Ie(this.outputs[0].out)+Ie(this.outputs[1].out)+Ie(this.outputs[2].out)+Ie(this.outputs[3].out)+Ie(this.outputs[4].out)+Ie(this.outputs[5].out);if(this.energyChange=this.currEaten-this.currDamage-t,_.stats.livePop>100?this.energyChange=this.currEaten-this.currDamage-t:_.stats.livePop>50?this.energyChange=this.currEaten-this.currDamage-t/2:this.energyChange=this.currEaten-this.currDamage-t/4,this.energy+=this.energyChange,this.energyChange>0&&(this.totalEnergyGain+=this.energyChange),this.energy>this.maxEnergy&&(this.maxEnergy=this.energy),this.health=(this.energy-this.maxEnergy/2)/(this.maxEnergy/2),this.energy<=0){this.status="decaying",_.stats.livePop--;const e=_.stats.time-this.born;_.stats.netLifespan+=e,_.stats.deathCount++;const i=this.clone();if(i.index=-(_.graveyard.length+1),this.grave=i.index,this.parent!==null){this.parent<0?_.graveyard[-(this.parent+1)].children[this.sibling_idx]=i.index:_.amoebs[this.parent].children[this.sibling_idx]=i.index;let s=this.parent;for(;s!==null;)s>=0?(_.amoebs[s].descendants--,s=_.amoebs[s].parent):(_.graveyard[-(s+1)].descendants--,s=_.graveyard[-(s+1)].parent)}for(let s=0;s<this.children.length;s++)this.children[s]<0?_.graveyard[-(this.children[s]+1)].parent=i.index:_.amoebs[this.children[s]].parent=i.index;_.highlighted===this.index&&(_.highlighted=i.index),_.newest===this.index&&(_.newest=i.index),_.graveyard.push(i),this.updateLiveInfoDisplay()}}decay(){if(Math.random()*100<1){this.size=ue((this.size-Hm)*10)/10;const t=_.tiles[this.tile];if(t){const e=t.neighbors,s=10/(e.length+1);t.R=Math.min(t.R+s,t.RCap),t.G=Math.min(t.G+s,t.GCap),t.B=Math.min(t.B+s,t.BCap);for(const r of e){const a=_.tiles[r];a.R=Math.min(a.R+s,a.RCap),a.G=Math.min(a.G+s,a.GCap),a.B=Math.min(a.B+s,a.BCap)}}this.updateLiveInfoDisplay(),this.size<=0&&this.cleanup()}}cleanup(){if(this.status="dead",this.index===_.HIGHESTINDEX){let t=this.index;for(;t>-1&&(_.amoebs[t]==null||_.amoebs[t].status==="dead");)t--;_.HIGHESTINDEX=t}}grow(){const t=ue(this.energy/100)/10;if(t>this.size&&(this.size=t),this.size>Ta?this.size=Ta:this.size<1&&(this.size=1),this.size>(this.outputs[6].out+1)/2*18+2&&_.stats.livePop<Ja){let e=0;for(;_.amoebs[e]!=null&&_.amoebs[e].status!=="dead";)e++;e>_.HIGHESTINDEX&&(_.HIGHESTINDEX=e),this.size=ue(this.size*10/2)/10,this.energy/=2;const i=this.clone();i.mitosis(this),this.descendants++,this.children.push(e),i.index=e,_.amoebs[e]=i,_.newest=e,_.stats.livePop++;let s=this.parent;for(;s!==null;)s>=0?(_.amoebs[s].descendants++,s=_.amoebs[s].parent):(_.graveyard[-(s+1)].descendants++,s=_.graveyard[-(s+1)].parent)}}think(){let t=0;this.inputs[t++].in=this.velocityX/2,this.inputs[t++].in=this.velocityY/2,this.inputs[t++].in=this.rotation/10,this.inputs[t++].in=this.currEaten/(this.size*3),this.inputs[t++].in=2*(this.size-bs)/(Ta-bs)-1,this.inputs[t++].in=this.energyChange/(this.size*10),this.inputs[t++].in=this.mouth.r,this.inputs[t++].in=this.mouth.g,this.inputs[t++].in=this.mouth.b,this.inputs[t++].in=this.mouth.s;for(let i=0;i<5;i++)this.inputs[t++].in=this.eyes[i].r,this.inputs[t++].in=this.eyes[i].g,this.inputs[t++].in=this.eyes[i].b,this.inputs[t++].in=this.eyes[i].s;this.inputs[t++].in=1,this.inputs[t++].in=-1;let e=0;for(let i=0;i<ee;i++){for(let s=0;s<Sn;s++)e+=this.inputs[s].synapse(i);for(let s=0;s<ee;s++)s!==i&&(e+=this.outputs[s].synapse(i));this.outputs[i].in=e,e=0}t=0,this.outputs[t++].clamp(),this.outputs[t++].clamp(),this.outputs[t++].clamp(),this.outputs[t++].clamp(),this.outputs[t++].clamp(),this.outputs[t++].clamp(),this.outputs[t++].clamp(),this.outputs[t++].clamp(),this.outputs[t++].clamp(),this.outputs[t++].clamp();for(let i=0;i<5;i++)this.outputs[t++].clamp(),this.outputs[t++].clamp();this.outputs[t++].clamp(),this.outputs[t++].clamp()}mitosis(t){this.descendants=0,this.children=[],this.gen=t.gen+1,this.parent=t.index,this.sibling_idx=t.children.length,this.name=t.name,this.maxEnergy=t.energy,this.born=_.stats.time,this.redEaten=.003,this.greenEaten=.003,this.blueEaten=.003,this.netEaten=.01,this.currDamage=0,this.damageCaused=0,this.damageReceived=0,ue(Math.random()*2)===2&&(ue(Math.random()*2)===2?ue(Math.random()*2)===2?ue(Math.random()*2)===2?this.name=Aa.charAt(ue(Math.random()*25))+this.name.charAt(1)+this.name.charAt(2)+this.name.charAt(3):this.name=this.name.charAt(0)+Aa.charAt(ue(Math.random()*25))+this.name.charAt(2)+this.name.charAt(3):this.name=this.name.charAt(0)+this.name.charAt(1)+Aa.charAt(ue(Math.random()*25))+this.name.charAt(3):this.name=this.name.charAt(0)+this.name.charAt(1)+this.name.charAt(2)+Aa.charAt(ue(Math.random()*25))),_.stats.mitoses+=1;const e=1,i=1;_.stats.advWeight+=e,_.stats.disWeight+=i;const s=this.getDescendantIndices(this.parent,this.parent),r=[],a=[];for(let h=0;h<s.length;h++){const u=s[h],f=u>=0?_.amoebs[u]:_.graveyard[-(u+1)];if(f.children.length>0){const p=this.getWeightDeltas(f,t);for(let v=0;v<f.children.length;v++)r.push(p)}else u<0&&a.push(this.getWeightDeltas(f,t))}const o=r.length,l=a.length,c=.02;for(let h=0;h<Sn;h++)for(let u=0;u<ee;u++)this.inputs[h].sigmas1[u]+=(2*Math.random()-1-this.inputs[h].sigmas1[u])*c/(o+1),this.inputs[h].sigmas2[u]+=(2*Math.random()-1-this.inputs[h].sigmas2[u])*c/(o+1);for(let h=0;h<ee;h++)for(let u=0;u<ee;u++)this.outputs[h].sigmas1[u]+=(2*Math.random()-1-this.outputs[h].sigmas1[u])*c/(o+1),this.outputs[h].sigmas2[u]+=(2*Math.random()-1-this.outputs[h].sigmas2[u])*c/(o+1);for(let h=0;h<o;h++){const u=r[h];for(let f=0;f<Sn;f++)for(let p=0;p<ee;p++)this.inputs[f].sigmas1[p]+=u.in_sigmas1_deltas[f][p]/(o+1),this.inputs[f].sigmas2[p]+=u.in_sigmas2_deltas[f][p]/(o+1);for(let f=0;f<ee;f++)for(let p=0;p<ee;p++)this.outputs[f].sigmas1[p]+=u.out_sigmas1_deltas[f][p]/(o+1),this.outputs[f].sigmas2[p]+=u.out_sigmas2_deltas[f][p]/(o+1)}for(let h=0;h<l;h++){const u=a[h];for(let f=0;f<Sn;f++)for(let p=0;p<ee;p++)this.inputs[f].sigmas1[p]-=u.in_sigmas1_deltas[f][p]/l,this.inputs[f].sigmas2[p]-=u.in_sigmas2_deltas[f][p]/l;for(let f=0;f<ee;f++)for(let p=0;p<ee;p++)this.outputs[f].sigmas1[p]-=u.out_sigmas1_deltas[f][p]/l,this.outputs[f].sigmas2[p]-=u.out_sigmas2_deltas[f][p]/l}for(let h=0;h<Sn;h++)for(let u=0;u<ee;u++)this.inputs[h].sigmas1[u]<0&&(this.inputs[h].sigmas1[u]=0),this.inputs[h].sigmas2[u]<0&&(this.inputs[h].sigmas2[u]=0);for(let h=0;h<ee;h++)for(let u=0;u<ee;u++)this.outputs[h].sigmas1[u]<0&&(this.outputs[h].sigmas1[u]=0),this.outputs[h].sigmas2[u]<0&&(this.outputs[h].sigmas2[u]=0);for(let h=0;h<Sn;h++)for(let u=0;u<ee;u++){const f=this.inputs[h].sigmas1[u],p=this.inputs[h].sigmas2[u];this.inputs[h].weights1[u]+=Math.abs(f)*(2*Math.random()-1-this.inputs[h].weights1[u])/(o+1),this.inputs[h].weights2[u]+=Math.abs(p)*(2*Math.random()-1-this.inputs[h].weights2[u])/(o+1)}for(let h=0;h<ee;h++)for(let u=0;u<ee;u++){const f=this.outputs[h].sigmas1[u],p=this.outputs[h].sigmas2[u];this.outputs[h].weights1[u]+=Math.abs(f)*(2*Math.random()-1-this.outputs[h].weights1[u])/(o+1),this.outputs[h].weights2[u]+=Math.abs(p)*(2*Math.random()-1-this.outputs[h].weights2[u])/(o+1)}for(let h=0;h<o;h++){const u=r[h];for(let f=0;f<Sn;f++)for(let p=0;p<ee;p++)this.inputs[f].weights1[p]+=e*u.in_weights1_deltas[f][p]/(o+1),this.inputs[f].weights2[p]+=e*u.in_weights2_deltas[f][p]/(o+1);for(let f=0;f<ee;f++)for(let p=0;p<ee;p++)this.outputs[f].weights1[p]+=e*u.out_weights1_deltas[f][p]/(o+1),this.outputs[f].weights2[p]+=e*u.out_weights2_deltas[f][p]/(o+1)}this.updateLiveInfoDisplay()}getDescendantIndices(t,e){const i=[],s=t>=0?_.amoebs[t]:_.graveyard[-(t+1)];if(!s)return i;for(const r of s.children)i.push(...this.getDescendantIndices(r,e));return t!==e&&i.push(t),i}getWeightDeltas(t,e){const i=[],s=[],r=[],a=[],o=[],l=[],c=[],h=[];for(let u=0;u<Sn;u++){const f=[],p=[],v=[],S=[];for(let m=0;m<ee;m++)f[m]=t.inputs[u].weights1[m]-e.inputs[u].weights1[m],p[m]=t.inputs[u].weights2[m]-e.inputs[u].weights2[m],v[m]=(t.inputs[u].sigmas1?.[m]??1)-(e.inputs[u].sigmas1?.[m]??1),S[m]=(t.inputs[u].sigmas2?.[m]??1)-(e.inputs[u].sigmas2?.[m]??1);i.push(f),s.push(p),o.push(v),l.push(S)}for(let u=0;u<ee;u++){const f=[],p=[],v=[],S=[];for(let m=0;m<ee;m++)f[m]=t.outputs[u].weights1[m]-e.outputs[u].weights1[m],p[m]=t.outputs[u].weights2[m]-e.outputs[u].weights2[m],v[m]=(t.outputs[u].sigmas1?.[m]??1)-(e.outputs[u].sigmas1?.[m]??1),S[m]=(t.outputs[u].sigmas2?.[m]??1)-(e.outputs[u].sigmas2?.[m]??1);r.push(f),a.push(p),c.push(v),h.push(S)}return{in_weights1_deltas:i,in_weights2_deltas:s,out_weights1_deltas:r,out_weights2_deltas:a,in_sigmas1_deltas:o,in_sigmas2_deltas:l,out_sigmas1_deltas:c,out_sigmas2_deltas:h}}kill(){this.status==="alive"&&(this.energy=-1)}reincarnate(){if(this.status!=="alive"&&_.stats.livePop<Ja){let t=0;for(;_.amoebs[t]!=null&&_.amoebs[t].status!=="dead";)t++;t>_.HIGHESTINDEX&&(_.HIGHESTINDEX=t);const e=this.clone();this.descendants++,this.children.push(t),_.amoebs[t]=e,_.newest=t,_.stats.livePop++;let i=this.parent;for(;i!==null;)i>=0?(_.amoebs[i].descendants++,i=_.amoebs[i].parent):(_.graveyard[-(i+1)].descendants++,i=_.graveyard[-(i+1)].parent);_.highlighted=e.index}}highlight(){const t=_.ctx.map;if(!t)return;this.status!=="alive"&&this.draw(this.cols);const e=this.size;t.beginPath(),t.fillStyle="#FFFFFF",t.strokeStyle="#FFFFFF",t.strokeRect(this.x-2*e,this.y-2*e,e*4,e*4);const i=this.direction*ui;t.beginPath(),t.strokeStyle="#FF0000";const s=this.x+this.outputs[0].out*10*Math.cos(i),r=this.y+this.outputs[0].out*10*Math.sin(i);t.moveTo(this.x,this.y),t.lineTo(s,r),t.stroke(),t.beginPath(),t.strokeStyle="#0088FF";const a=this.x+this.outputs[1].out*10*Math.sin(i),o=this.y-this.outputs[1].out*10*Math.cos(i);t.moveTo(this.x,this.y),t.lineTo(a,o),t.stroke(),t.beginPath(),t.strokeStyle="#FFFFFF";let l,c;if(this.velocityX>0?(l=s-this.outputs[2].out*10*Math.cos((this.direction-90)*ui),c=r-this.outputs[2].out*10*Math.sin((this.direction-90)*ui)):(l=s+this.outputs[2].out*10*Math.cos((this.direction-90)*ui),c=r+this.outputs[2].out*10*Math.sin((this.direction-90)*ui)),t.moveTo(s,r),t.lineTo(l,c),t.stroke(),t.strokeStyle="#FFFFFF",_.mouse.overMap&&_.mouse.x>=this.x-50&&_.mouse.x<this.x+50&&_.mouse.y>=this.y-50&&_.mouse.y<this.y+50)for(let f=0;f<5;f++)t.beginPath(),t.arc(ue(this.eyes[f].x),ue(this.eyes[f].y),ue(this.size/5),0,xo),t.stroke();const h=this.x+2*e;let u=this.y-2*e;this.status==="alive"&&t.fillText(this.name+"-"+this.gen+"A"+this.descendants,h,u+2),u+=10,this.updateMainStatsDisplay(),_.display==="default"||(_.display==="brain"?this.drawBrainDisplay():_.display==="family"&&co(!1,this.descendants))}updateMainStatsDisplay(){const t=document.getElementById("stats-name");t&&(t.innerHTML=this.name+"-"+this.gen+(this.status==="alive"?"A":"D")+this.descendants);const e=document.getElementById("stats-idx");e&&(e.innerHTML="IDX "+this.index);const i=document.getElementById("stats-sibling-idx");i&&this.sibling_idx!==null&&(i.innerHTML="SIBLING: "+this.sibling_idx);const s=document.getElementById("stats-born");s&&(s.innerHTML="<b>"+this.born+"</b>");const r=ue(5*this.energyChange/(this.size*10+5));let a="";if(r>0)for(let u=0;u<r;u++)a+="+";else for(let u=0;u<-r;u++)a+="-";const o=document.getElementById("stats-energy");o&&(o.innerHTML="NRG: "+ue(this.energy)+"/"+ue(this.maxEnergy)+"   "+a);const l=document.getElementById("stats-size");l&&(l.innerHTML="SIZE: "+this.size);const c=document.getElementById("stats-damage");c&&(c.innerHTML=ue(this.damageReceived)+" >> DMG >> "+ue(this.damageCaused));const h=document.getElementById("stats-sensors");h&&(h.innerHTML=(this.mouth.detected===1?"M ":"")+(this.eyes[0].detected===1?"E1 ":"")+(this.eyes[1].detected===1?"E2 ":"")+(this.eyes[2].detected===1?"E3 ":"")+(this.eyes[3].detected===1?"E4 ":"")+(this.eyes[4].detected===1?"E5 ":"")),this.positiveGauge("stats-energy","ϟ&nbsp;",this.energy,this.maxEnergy),this.signedGauge("stats-red","R&nbsp;",this.outputs[3].out),this.signedGauge("stats-green","G&nbsp;",this.outputs[4].out),this.signedGauge("stats-blue","B&nbsp;",this.outputs[5].out),this.signedGauge("stats-velocity","∆X",this.outputs[0].out),this.signedGauge("stats-rotation","∆Y",this.outputs[1].out),this.signedGauge("stats-mutation","∆°",this.outputs[2].out)}signedGauge(t,e,i){const s="█",r="&nbsp;",a=i>0?"&nbsp;":"",o=Math.max(-1,Math.min(1,i)),l=Math.round(Math.abs(o)*10);let c=r.repeat(10),h=r.repeat(10);o<0?c=r.repeat(10-l)+s.repeat(l):h=s.repeat(l)+r.repeat(10-l);const u=c+" "+a+i.toFixed(2)+" "+h,f=document.getElementById(t);f&&(f.innerHTML=`${e} ${u}`)}positiveGauge(t,e,i,s){const r="█",a="&nbsp;",o=Math.max(0,Math.min(1,i/s)),l=Math.round(o*20),c=r.repeat(l)+a.repeat(20-l),h=`${ue(i)}/${ue(s)}`,u=document.getElementById(t);u&&(u.innerHTML=`${e} ${c} ${h}`)}drawBrainDisplay(){DS(this)}clone(){const t=new uo(this.x,this.y,this.index);t.status=this.status,t.tile=this.tile,t.size=this.size,t.health=this.health,t.gen=this.gen,t.parent=this.parent,t.sibling_idx=this.sibling_idx,t.children=[...this.children],t.descendants=this.descendants,t.proGenes=this.proGenes,t.conGenes=this.conGenes,t.name=this.name,t.velocityX=this.velocityX,t.velocityY=this.velocityY,t.rotation=this.rotation,t.direction=this.direction,t.currEaten=this.currEaten,t.redEaten=this.redEaten,t.greenEaten=this.greenEaten,t.blueEaten=this.blueEaten,t.netEaten=this.netEaten,t.energy=this.energy,t.maxEnergy=this.maxEnergy,t.energyChange=this.energyChange,t.totalEnergyGain=this.totalEnergyGain,t.currDamage=this.currDamage,t.damageReceived=this.damageReceived,t.damageCaused=this.damageCaused,t.lr=this.lr;for(let e=0;e<5;e++)t.eyes[e]=new Dc(this.eyes[e].x,this.eyes[e].y),t.eyes[e].tile=this.eyes[e].tile,t.eyes[e].r=this.eyes[e].r,t.eyes[e].g=this.eyes[e].g,t.eyes[e].b=this.eyes[e].b,t.eyes[e].s=this.eyes[e].s,t.eyes[e].detected=this.eyes[e].detected;t.mouth=new Lc(this.mouth.x,this.mouth.y),t.mouth.tile=this.mouth.tile,t.mouth.r=this.mouth.r,t.mouth.g=this.mouth.g,t.mouth.b=this.mouth.b,t.mouth.s=this.mouth.s,t.mouth.detected=this.mouth.detected;for(let e=0;e<Sn;e++)t.inputs[e]=new Ga,t.inputs[e].weights1=new Float32Array(this.inputs[e].weights1),t.inputs[e].weights2=new Float32Array(this.inputs[e].weights2),t.inputs[e].sigmas1=new Float32Array(this.inputs[e].sigmas1),t.inputs[e].sigmas2=new Float32Array(this.inputs[e].sigmas2),t.inputs[e].in=this.inputs[e].in,t.inputs[e].out=this.inputs[e].out;for(let e=0;e<ee;e++)t.outputs[e]=new Ga,t.outputs[e].weights1=new Float32Array(this.outputs[e].weights1),t.outputs[e].weights2=new Float32Array(this.outputs[e].weights2),t.outputs[e].sigmas1=new Float32Array(this.outputs[e].sigmas1),t.outputs[e].sigmas2=new Float32Array(this.outputs[e].sigmas2),t.outputs[e].in=this.outputs[e].in,t.outputs[e].out=this.outputs[e].out;return t.cols=new Uint8ClampedArray(this.cols),t}updateLiveInfoDisplay(){const t=document.getElementById("dash-live-info");t&&(t.innerHTML="LIVE: "+_.stats.livePop+"     DEAD: "+_.graveyard.length)}}let Lu=null,Iu=null,Uu=null,Xa=null,Ya=null;function FS(){Lu=document.getElementById("dash-gold"),Iu=document.getElementById("dash-silver"),Uu=document.getElementById("dash-bronze"),Xa=document.getElementById("amoeb-stats"),Ya=document.getElementById("dash-highlighted")}const OS={update(){const n=_.amoebs,t=_.HIGHESTINDEX;if(!_.pause){_.gold=null,_.silver=null,_.bronze=null;for(let e=0;e<=t;e++){const i=n[e];i.status==="alive"?(i.age(),i.status==="alive"&&(i.move(),i.currDamage=0,i.sense(),_.gold===null||i.descendants>n[_.gold].descendants?_.gold=e:_.silver===null||i.descendants>n[_.silver].descendants?_.silver=e:(_.bronze===null||i.descendants>n[_.bronze].descendants)&&(_.bronze=e))):i.status==="decaying"&&i.decay()}if(_.gold!==null&&Lu){const e=n[_.gold];Lu.innerHTML=e.name+"-"+e.gen+"A"+e.descendants}if(_.silver!==null&&Iu){const e=n[_.silver];Iu.innerHTML=e.name+"-"+e.gen+"A"+e.descendants}if(_.bronze!==null&&Uu){const e=n[_.bronze];Uu.innerHTML=e.name+"-"+e.gen+"A"+e.descendants}}for(let e=0;e<=t;e++){const i=n[e];if(i.status!=="dead"&&(i.draw(i.cols),i.status==="alive"&&!_.pause&&(i.think(),i.eat(),i.grow()),_.mouse.leftPressed&&_.mouse.overMap)){const s=_.mouse.x,r=_.mouse.y;if(Math.abs(i.x-s)<=i.size+1&&Math.abs(i.y-r)<=i.size+1&&_.highlighted!==e){if(i.status==="decaying"&&i.grave){console.log("A GRAVE: ",i.grave),_.highlighted=i.grave,_.tracking=null,Xa&&(Xa.style.display="block"),Ya&&(Ya.innerHTML="HIGHLIGHTED: "+_.graveyard[-(_.highlighted+1)].name+"-"+_.graveyard[-(_.highlighted+1)].gen+"D"+_.graveyard[-(_.highlighted+1)].descendants),_.mouse.leftPressed=!1;return}else _.highlighted=e;_.tracking!==null&&(_.tracking=e),Xa&&(Xa.style.display="block"),Ya&&(Ya.innerHTML="HIGHLIGHTED: "+n[_.highlighted].name+"-"+n[_.highlighted].gen+"A"+n[_.highlighted].descendants),_.mouse.leftPressed=!1}}}_.mouse.leftPressed&&_.mouse.overMap&&_.tracking!==null&&(_.tracking=null,_.mouse.leftPressed=!1)}},BS=!0,pn="u-",zS="uplot",GS=pn+"hz",kS=pn+"vt",HS=pn+"title",VS=pn+"wrap",WS=pn+"under",XS=pn+"over",YS=pn+"axis",rr=pn+"off",qS=pn+"select",jS=pn+"cursor-x",KS=pn+"cursor-y",$S=pn+"cursor-pt",ZS=pn+"legend",JS=pn+"live",QS=pn+"inline",ty=pn+"series",ey=pn+"marker",sd=pn+"label",ny=pn+"value",qa="width",ja="height",Oa="top",rd="bottom",jr="left",Ec="right",hh="#000",ad=hh+"0",bc="mousemove",od="mousedown",Tc="mouseup",ld="mouseenter",cd="mouseleave",ud="dblclick",iy="resize",sy="scroll",hd="change",fl="dppxchange",fh="--",ma=typeof window<"u",Nu=ma?document:null,ea=ma?window:null,ry=ma?navigator:null;let be,Wo;function Fu(){let n=devicePixelRatio;be!=n&&(be=n,Wo&&Bu(hd,Wo,Fu),Wo=matchMedia(`(min-resolution: ${be-.001}dppx) and (max-resolution: ${be+.001}dppx)`),hr(hd,Wo,Fu),ea.dispatchEvent(new CustomEvent(fl)))}function Zn(n,t){if(t!=null){let e=n.classList;!e.contains(t)&&e.add(t)}}function Ou(n,t){let e=n.classList;e.contains(t)&&e.remove(t)}function Ye(n,t,e){n.style[t]=e+"px"}function Ei(n,t,e,i){let s=Nu.createElement(n);return t!=null&&Zn(s,t),e?.insertBefore(s,i),s}function oi(n,t){return Ei("div",n,t)}const fd=new WeakMap;function Fi(n,t,e,i,s){let r="translate("+t+"px,"+e+"px)",a=fd.get(n);r!=a&&(n.style.transform=r,fd.set(n,r),t<0||e<0||t>i||e>s?Zn(n,rr):Ou(n,rr))}const dd=new WeakMap;function pd(n,t,e){let i=t+e,s=dd.get(n);i!=s&&(dd.set(n,i),n.style.background=t,n.style.borderColor=e)}const md=new WeakMap;function gd(n,t,e,i){let s=t+""+e,r=md.get(n);s!=r&&(md.set(n,s),n.style.height=e+"px",n.style.width=t+"px",n.style.marginLeft=i?-t/2+"px":0,n.style.marginTop=i?-e/2+"px":0)}const dh={passive:!0},ay={...dh,capture:!0};function hr(n,t,e,i){t.addEventListener(n,e,i?ay:dh)}function Bu(n,t,e,i){t.removeEventListener(n,e,dh)}ma&&Fu();function bi(n,t,e,i){let s;e=e||0,i=i||t.length-1;let r=i<=2147483647;for(;i-e>1;)s=r?e+i>>1:Qn((e+i)/2),t[s]<n?e=s:i=s;return n-t[e]<=t[i]-n?e:i}function zp(n){return(e,i,s)=>{let r=-1,a=-1;for(let o=i;o<=s;o++)if(n(e[o])){r=o;break}for(let o=s;o>=i;o--)if(n(e[o])){a=o;break}return[r,a]}}const Gp=n=>n!=null,kp=n=>n!=null&&n>0,bl=zp(Gp),oy=zp(kp);function ly(n,t,e,i=0,s=!1){let r=s?oy:bl,a=s?kp:Gp;[t,e]=r(n,t,e);let o=n[t],l=n[t];if(t>-1)if(i==1)o=n[t],l=n[e];else if(i==-1)o=n[e],l=n[t];else for(let c=t;c<=e;c++){let h=n[c];a(h)&&(h<o?o=h:h>l&&(l=h))}return[o??Fe,l??-Fe]}function Tl(n,t,e,i){let s=vd(n),r=vd(t);n==t&&(s==-1?(n*=e,t/=e):(n/=e,t*=e));let a=e==10?fs:Hp,o=s==1?Qn:ci,l=r==1?ci:Qn,c=o(a(un(n))),h=l(a(un(t))),u=ua(e,c),f=ua(e,h);return e==10&&(c<0&&(u=Oe(u,-c)),h<0&&(f=Oe(f,-h))),i||e==2?(n=u*s,t=f*r):(n=Yp(n,u),t=Al(t,f)),[n,t]}function ph(n,t,e,i){let s=Tl(n,t,e,i);return n==0&&(s[0]=0),t==0&&(s[1]=0),s}const mh=.1,_d={mode:3,pad:mh},$a={pad:0,soft:null,mode:0},cy={min:$a,max:$a};function dl(n,t,e,i){return wl(e)?xd(n,t,e):($a.pad=e,$a.soft=i?0:null,$a.mode=i?3:0,xd(n,t,cy))}function xe(n,t){return n??t}function uy(n,t,e){for(t=xe(t,0),e=xe(e,n.length-1);t<=e;){if(n[t]!=null)return!0;t++}return!1}function xd(n,t,e){let i=e.min,s=e.max,r=xe(i.pad,0),a=xe(s.pad,0),o=xe(i.hard,-Fe),l=xe(s.hard,Fe),c=xe(i.soft,Fe),h=xe(s.soft,-Fe),u=xe(i.mode,0),f=xe(s.mode,0),p=t-n,v=fs(p),S=Fn(un(n),un(t)),m=fs(S),d=un(m-v);(p<1e-24||d>10)&&(p=0,(n==0||t==0)&&(p=1e-24,u==2&&c!=Fe&&(r=0),f==2&&h!=-Fe&&(a=0)));let b=p||S||1e3,R=fs(b),w=ua(10,Qn(R)),D=b*(p==0?n==0?.1:1:r),A=Oe(Yp(n-D,w/10),24),N=n>=c&&(u==1||u==3&&A<=c||u==2&&A>=c)?c:Fe,k=Fn(o,A<N&&n>=N?N:Ai(N,A)),y=b*(p==0?t==0?.1:1:a),T=Oe(Al(t+y,w/10),24),L=t<=h&&(f==1||f==3&&T>=h||f==2&&T<=h)?h:-Fe,W=Ai(l,T>L&&t<=L?L:Fn(L,T));return k==W&&k==0&&(W=100),[k,W]}const hy=new Intl.NumberFormat(ma?ry.language:"en-US"),gh=n=>hy.format(n),ei=Math,tl=ei.PI,un=ei.abs,Qn=ei.floor,cn=ei.round,ci=ei.ceil,Ai=ei.min,Fn=ei.max,ua=ei.pow,vd=ei.sign,fs=ei.log10,Hp=ei.log2,fy=(n,t=1)=>ei.sinh(n)*t,Ac=(n,t=1)=>ei.asinh(n/t),Fe=1/0;function Md(n){return(fs((n^n>>31)-(n>>31))|0)+1}function zu(n,t,e){return Ai(Fn(n,t),e)}function Vp(n){return typeof n=="function"}function ce(n){return Vp(n)?n:()=>n}const dy=()=>{},Wp=n=>n,Xp=(n,t)=>t,py=n=>null,Sd=n=>!0,yd=(n,t)=>n==t,my=/\.\d*?(?=9{6,}|0{6,})/gm,pr=n=>{if(jp(n)||Os.has(n))return n;const t=`${n}`,e=t.match(my);if(e==null)return n;let i=e[0].length-1;if(t.indexOf("e-")!=-1){let[s,r]=t.split("e");return+`${pr(s)}e${r}`}return Oe(n,i)};function Qs(n,t){return pr(Oe(pr(n/t))*t)}function Al(n,t){return pr(ci(pr(n/t))*t)}function Yp(n,t){return pr(Qn(pr(n/t))*t)}function Oe(n,t=0){if(jp(n))return n;let e=10**t,i=n*e*(1+Number.EPSILON);return cn(i)/e}const Os=new Map;function qp(n){return((""+n).split(".")[1]||"").length}function ro(n,t,e,i){let s=[],r=i.map(qp);for(let a=t;a<e;a++){let o=un(a),l=Oe(ua(n,a),o);for(let c=0;c<i.length;c++){let h=n==10?+`${i[c]}e${a}`:i[c]*l,u=(a>=0?0:o)+(a>=r[c]?0:r[c]),f=n==10?h:Oe(h,u);s.push(f),Os.set(f,u)}}return s}const Za={},_h=[],ha=[null,null],Ls=Array.isArray,jp=Number.isInteger,gy=n=>n===void 0;function Ed(n){return typeof n=="string"}function wl(n){let t=!1;if(n!=null){let e=n.constructor;t=e==null||e==Object}return t}function _y(n){return n!=null&&typeof n=="object"}const xy=Object.getPrototypeOf(Uint8Array),Kp="__proto__";function fa(n,t=wl){let e;if(Ls(n)){let i=n.find(s=>s!=null);if(Ls(i)||t(i)){e=Array(n.length);for(let s=0;s<n.length;s++)e[s]=fa(n[s],t)}else e=n.slice()}else if(n instanceof xy)e=n.slice();else if(t(n)){e={};for(let i in n)i!=Kp&&(e[i]=fa(n[i],t))}else e=n;return e}function nn(n){let t=arguments;for(let e=1;e<t.length;e++){let i=t[e];for(let s in i)s!=Kp&&(wl(n[s])?nn(n[s],fa(i[s])):n[s]=fa(i[s]))}return n}const vy=0,My=1,Sy=2;function yy(n,t,e){for(let i=0,s,r=-1;i<t.length;i++){let a=t[i];if(a>r){for(s=a-1;s>=0&&n[s]==null;)n[s--]=null;for(s=a+1;s<e&&n[s]==null;)n[r=s++]=null}}}function Ey(n,t){if(Ay(n)){let a=n[0].slice();for(let o=1;o<n.length;o++)a.push(...n[o].slice(1));return wy(a[0])||(a=Ty(a)),a}let e=new Set;for(let a=0;a<n.length;a++){let l=n[a][0],c=l.length;for(let h=0;h<c;h++)e.add(l[h])}let i=[Array.from(e).sort((a,o)=>a-o)],s=i[0].length,r=new Map;for(let a=0;a<s;a++)r.set(i[0][a],a);for(let a=0;a<n.length;a++){let o=n[a],l=o[0];for(let c=1;c<o.length;c++){let h=o[c],u=Array(s).fill(void 0),f=t?t[a][c]:My,p=[];for(let v=0;v<h.length;v++){let S=h[v],m=r.get(l[v]);S===null?f!=vy&&(u[m]=S,f==Sy&&p.push(m)):u[m]=S}yy(u,p,s),i.push(u)}}return i}const by=typeof queueMicrotask>"u"?n=>Promise.resolve().then(n):queueMicrotask;function Ty(n){let t=n[0],e=t.length,i=Array(e);for(let r=0;r<i.length;r++)i[r]=r;i.sort((r,a)=>t[r]-t[a]);let s=[];for(let r=0;r<n.length;r++){let a=n[r],o=Array(e);for(let l=0;l<e;l++)o[l]=a[i[l]];s.push(o)}return s}function Ay(n){let t=n[0][0],e=t.length;for(let i=1;i<n.length;i++){let s=n[i][0];if(s.length!=e)return!1;if(s!=t){for(let r=0;r<e;r++)if(s[r]!=t[r])return!1}}return!0}function wy(n,t=100){const e=n.length;if(e<=1)return!0;let i=0,s=e-1;for(;i<=s&&n[i]==null;)i++;for(;s>=i&&n[s]==null;)s--;if(s<=i)return!0;const r=Fn(1,Qn((s-i+1)/t));for(let a=n[i],o=i+r;o<=s;o+=r){const l=n[o];if(l!=null){if(l<=a)return!1;a=l}}return!0}const $p=["January","February","March","April","May","June","July","August","September","October","November","December"],Zp=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];function Jp(n){return n.slice(0,3)}const Ry=Zp.map(Jp),Cy=$p.map(Jp),Py={MMMM:$p,MMM:Cy,WWWW:Zp,WWW:Ry};function Ba(n){return(n<10?"0":"")+n}function Dy(n){return(n<10?"00":n<100?"0":"")+n}const Ly={YYYY:n=>n.getFullYear(),YY:n=>(n.getFullYear()+"").slice(2),MMMM:(n,t)=>t.MMMM[n.getMonth()],MMM:(n,t)=>t.MMM[n.getMonth()],MM:n=>Ba(n.getMonth()+1),M:n=>n.getMonth()+1,DD:n=>Ba(n.getDate()),D:n=>n.getDate(),WWWW:(n,t)=>t.WWWW[n.getDay()],WWW:(n,t)=>t.WWW[n.getDay()],HH:n=>Ba(n.getHours()),H:n=>n.getHours(),h:n=>{let t=n.getHours();return t==0?12:t>12?t-12:t},AA:n=>n.getHours()>=12?"PM":"AM",aa:n=>n.getHours()>=12?"pm":"am",a:n=>n.getHours()>=12?"p":"a",mm:n=>Ba(n.getMinutes()),m:n=>n.getMinutes(),ss:n=>Ba(n.getSeconds()),s:n=>n.getSeconds(),fff:n=>Dy(n.getMilliseconds())};function xh(n,t){t=t||Py;let e=[],i=/\{([a-z]+)\}|[^{]+/gi,s;for(;s=i.exec(n);)e.push(s[0][0]=="{"?Ly[s[1]]:s[0]);return r=>{let a="";for(let o=0;o<e.length;o++)a+=typeof e[o]=="string"?e[o]:e[o](r,t);return a}}const Iy=new Intl.DateTimeFormat().resolvedOptions().timeZone;function Uy(n,t){let e;return t=="UTC"||t=="Etc/UTC"?e=new Date(+n+n.getTimezoneOffset()*6e4):t==Iy?e=n:(e=new Date(n.toLocaleString("en-US",{timeZone:t})),e.setMilliseconds(n.getMilliseconds())),e}const Qp=n=>n%1==0,pl=[1,2,2.5,5],Ny=ro(10,-32,0,pl),tm=ro(10,0,32,pl),Fy=tm.filter(Qp),tr=Ny.concat(tm),vh=`
`,em="{YYYY}",bd=vh+em,nm="{M}/{D}",Ka=vh+nm,Xo=Ka+"/{YY}",im="{aa}",Oy="{h}:{mm}",Kr=Oy+im,Td=vh+Kr,Ad=":{ss}",Te=null;function sm(n){let t=n*1e3,e=t*60,i=e*60,s=i*24,r=s*30,a=s*365,l=(n==1?ro(10,0,3,pl).filter(Qp):ro(10,-3,0,pl)).concat([t,t*5,t*10,t*15,t*30,e,e*5,e*10,e*15,e*30,i,i*2,i*3,i*4,i*6,i*8,i*12,s,s*2,s*3,s*4,s*5,s*6,s*7,s*8,s*9,s*10,s*15,r,r*2,r*3,r*4,r*6,a,a*2,a*5,a*10,a*25,a*50,a*100]);const c=[[a,em,Te,Te,Te,Te,Te,Te,1],[s*28,"{MMM}",bd,Te,Te,Te,Te,Te,1],[s,nm,bd,Te,Te,Te,Te,Te,1],[i,"{h}"+im,Xo,Te,Ka,Te,Te,Te,1],[e,Kr,Xo,Te,Ka,Te,Te,Te,1],[t,Ad,Xo+" "+Kr,Te,Ka+" "+Kr,Te,Td,Te,1],[n,Ad+".{fff}",Xo+" "+Kr,Te,Ka+" "+Kr,Te,Td,Te,1]];function h(u){return(f,p,v,S,m,d)=>{let b=[],R=m>=a,w=m>=r&&m<a,D=u(v),A=Oe(D*n,3),N=wc(D.getFullYear(),R?0:D.getMonth(),w||R?1:D.getDate()),k=Oe(N*n,3);if(w||R){let y=w?m/r:0,T=R?m/a:0,L=A==k?A:Oe(wc(N.getFullYear()+T,N.getMonth()+y,1)*n,3),W=new Date(cn(L/n)),z=W.getFullYear(),K=W.getMonth();for(let V=0;L<=S;V++){let j=wc(z+T*V,K+y*V,1),G=j-u(Oe(j*n,3));L=Oe((+j+G)*n,3),L<=S&&b.push(L)}}else{let y=m>=s?s:m,T=Qn(v)-Qn(A),L=k+T+Al(A-k,y);b.push(L);let W=u(L),z=W.getHours()+W.getMinutes()/e+W.getSeconds()/i,K=m/i,V=f.axes[p]._space,j=d/V;for(;L=Oe(L+m,n==1?0:3),!(L>S);)if(K>1){let G=Qn(Oe(z+K,6))%24,at=u(L).getHours()-G;at>1&&(at=-1),L-=at*i,z=(z+K)%24;let ut=b[b.length-1];Oe((L-ut)/m,3)*j>=.7&&b.push(L)}else b.push(L)}return b}}return[l,c,h]}const[By,zy,Gy]=sm(1),[ky,Hy,Vy]=sm(.001);ro(2,-53,53,[1]);function wd(n,t){return n.map(e=>e.map((i,s)=>s==0||s==8||i==null?i:t(s==1||e[8]==0?i:e[1]+i)))}function Rd(n,t){return(e,i,s,r,a)=>{let o=t.find(v=>a>=v[0])||t[t.length-1],l,c,h,u,f,p;return i.map(v=>{let S=n(v),m=S.getFullYear(),d=S.getMonth(),b=S.getDate(),R=S.getHours(),w=S.getMinutes(),D=S.getSeconds(),A=m!=l&&o[2]||d!=c&&o[3]||b!=h&&o[4]||R!=u&&o[5]||w!=f&&o[6]||D!=p&&o[7]||o[1];return l=m,c=d,h=b,u=R,f=w,p=D,A(S)})}}function Wy(n,t){let e=xh(t);return(i,s,r,a,o)=>s.map(l=>e(n(l)))}function wc(n,t,e){return new Date(n,t,e)}function Cd(n,t){return t(n)}const Xy="{YYYY}-{MM}-{DD} {h}:{mm}{aa}";function Pd(n,t){return(e,i,s,r)=>r==null?fh:t(n(i))}function Yy(n,t){let e=n.series[t];return e.width?e.stroke(n,t):e.points.width?e.points.stroke(n,t):null}function qy(n,t){return n.series[t].fill(n,t)}const jy={show:!0,live:!0,isolate:!1,mount:dy,markers:{show:!0,width:2,stroke:Yy,fill:qy,dash:"solid"},idx:null,idxs:null,values:[]};function Ky(n,t){let e=n.cursor.points,i=oi(),s=e.size(n,t);Ye(i,qa,s),Ye(i,ja,s);let r=s/-2;Ye(i,"marginLeft",r),Ye(i,"marginTop",r);let a=e.width(n,t,s);return a&&Ye(i,"borderWidth",a),i}function $y(n,t){let e=n.series[t].points;return e._fill||e._stroke}function Zy(n,t){let e=n.series[t].points;return e._stroke||e._fill}function Jy(n,t){return n.series[t].points.size}const Rc=[0,0];function Qy(n,t,e){return Rc[0]=t,Rc[1]=e,Rc}function Yo(n,t,e,i=!0){return s=>{s.button==0&&(!i||s.target==t)&&e(s)}}function Cc(n,t,e,i=!0){return s=>{(!i||s.target==t)&&e(s)}}const tE={show:!0,x:!0,y:!0,lock:!1,move:Qy,points:{one:!1,show:Ky,size:Jy,width:0,stroke:Zy,fill:$y},bind:{mousedown:Yo,mouseup:Yo,click:Yo,dblclick:Yo,mousemove:Cc,mouseleave:Cc,mouseenter:Cc},drag:{setScale:!0,x:!0,y:!1,dist:0,uni:null,click:(n,t)=>{t.stopPropagation(),t.stopImmediatePropagation()},_x:!1,_y:!1},focus:{dist:(n,t,e,i,s)=>i-s,prox:-1,bias:0},hover:{skip:[void 0],prox:null,bias:0},left:-10,top:-10,idx:null,dataIdx:null,idxs:null,event:null},rm={show:!0,stroke:"rgba(0,0,0,0.07)",width:2},Mh=nn({},rm,{filter:Xp}),am=nn({},Mh,{size:10}),om=nn({},rm,{show:!1}),Sh='12px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',lm="bold "+Sh,cm=1.5,Dd={show:!0,scale:"x",stroke:hh,space:50,gap:5,alignTo:1,size:50,labelGap:0,labelSize:30,labelFont:lm,side:2,grid:Mh,ticks:am,border:om,font:Sh,lineGap:cm,rotate:0},eE="Value",nE="Time",Ld={show:!0,scale:"x",auto:!1,sorted:1,min:Fe,max:-Fe,idxs:[]};function iE(n,t,e,i,s){return t.map(r=>r==null?"":gh(r))}function sE(n,t,e,i,s,r,a){let o=[],l=Os.get(s)||0;e=a?e:Oe(Al(e,s),l);for(let c=e;c<=i;c=Oe(c+s,l))o.push(Object.is(c,-0)?0:c);return o}function Gu(n,t,e,i,s,r,a){const o=[],l=n.scales[n.axes[t].scale].log,c=l==10?fs:Hp,h=Qn(c(e));s=ua(l,h),l==10&&(s=tr[bi(s,tr)]);let u=e,f=s*l;l==10&&(f=tr[bi(f,tr)]);do o.push(u),u=u+s,l==10&&!Os.has(u)&&(u=Oe(u,Os.get(s))),u>=f&&(s=u,f=s*l,l==10&&(f=tr[bi(f,tr)]));while(u<=i);return o}function rE(n,t,e,i,s,r,a){let l=n.scales[n.axes[t].scale].asinh,c=i>l?Gu(n,t,Fn(l,e),i,s):[l],h=i>=0&&e<=0?[0]:[];return(e<-l?Gu(n,t,Fn(l,-i),-e,s):[l]).reverse().map(f=>-f).concat(h,c)}const um=/./,aE=/[12357]/,oE=/[125]/,Id=/1/,ku=(n,t,e,i)=>n.map((s,r)=>t==4&&s==0||r%i==0&&e.test(s.toExponential()[s<0?1:0])?s:null);function lE(n,t,e,i,s){let r=n.axes[e],a=r.scale,o=n.scales[a],l=n.valToPos,c=r._space,h=l(10,a),u=l(9,a)-h>=c?um:l(7,a)-h>=c?aE:l(5,a)-h>=c?oE:Id;if(u==Id){let f=un(l(1,a)-h);if(f<c)return ku(t.slice().reverse(),o.distr,u,ci(c/f)).reverse()}return ku(t,o.distr,u,1)}function cE(n,t,e,i,s){let r=n.axes[e],a=r.scale,o=r._space,l=n.valToPos,c=un(l(1,a)-l(2,a));return c<o?ku(t.slice().reverse(),3,um,ci(o/c)).reverse():t}function uE(n,t,e,i){return i==null?fh:t==null?"":gh(t)}const Ud={show:!0,scale:"y",stroke:hh,space:30,gap:5,alignTo:1,size:50,labelGap:0,labelSize:30,labelFont:lm,side:3,grid:Mh,ticks:am,border:om,font:Sh,lineGap:cm,rotate:0};function hE(n,t){let e=3+(n||1)*2;return Oe(e*t,3)}function fE(n,t){let{scale:e,idxs:i}=n.series[0],s=n._data[0],r=n.valToPos(s[i[0]],e,!0),a=n.valToPos(s[i[1]],e,!0),o=un(a-r),l=n.series[t],c=o/(l.points.space*be);return i[1]-i[0]<=c}const Nd={scale:null,auto:!0,sorted:0,min:Fe,max:-Fe},hm=(n,t,e,i,s)=>s,Fd={show:!0,auto:!0,sorted:0,gaps:hm,alpha:1,facets:[nn({},Nd,{scale:"x"}),nn({},Nd,{scale:"y"})]},Od={scale:"y",auto:!0,sorted:0,show:!0,spanGaps:!1,gaps:hm,alpha:1,points:{show:fE,filter:null},values:null,min:Fe,max:-Fe,idxs:[],path:null,clip:null};function dE(n,t,e,i,s){return e/10}const fm={time:BS,auto:!0,distr:1,log:10,asinh:1,min:null,max:null,dir:1,ori:0},pE=nn({},fm,{time:!1,ori:1}),Bd={};function dm(n,t){let e=Bd[n];return e||(e={key:n,plots:[],sub(i){e.plots.push(i)},unsub(i){e.plots=e.plots.filter(s=>s!=i)},pub(i,s,r,a,o,l,c){for(let h=0;h<e.plots.length;h++)e.plots[h]!=s&&e.plots[h].pub(i,s,r,a,o,l,c)}},n!=null&&(Bd[n]=e)),e}const da=1,Hu=2;function gr(n,t,e){const i=n.mode,s=n.series[t],r=i==2?n._data[t]:n._data,a=n.scales,o=n.bbox;let l=r[0],c=i==2?r[1]:r[t],h=i==2?a[s.facets[0].scale]:a[n.series[0].scale],u=i==2?a[s.facets[1].scale]:a[s.scale],f=o.left,p=o.top,v=o.width,S=o.height,m=n.valToPosH,d=n.valToPosV;return h.ori==0?e(s,l,c,h,u,m,d,f,p,v,S,Cl,ga,Dl,mm,_m):e(s,l,c,h,u,d,m,p,f,S,v,Pl,_a,bh,gm,xm)}function yh(n,t){let e=0,i=0,s=xe(n.bands,_h);for(let r=0;r<s.length;r++){let a=s[r];a.series[0]==t?e=a.dir:a.series[1]==t&&(a.dir==1?i|=1:i|=2)}return[e,i==1?-1:i==2?1:i==3?2:0]}function mE(n,t,e,i,s){let r=n.mode,a=n.series[t],o=r==2?a.facets[1].scale:a.scale,l=n.scales[o];return s==-1?l.min:s==1?l.max:l.distr==3?l.dir==1?l.min:l.max:0}function ds(n,t,e,i,s,r){return gr(n,t,(a,o,l,c,h,u,f,p,v,S,m)=>{let d=a.pxRound;const b=c.dir*(c.ori==0?1:-1),R=c.ori==0?ga:_a;let w,D;b==1?(w=e,D=i):(w=i,D=e);let A=d(u(o[w],c,S,p)),N=d(f(l[w],h,m,v)),k=d(u(o[D],c,S,p)),y=d(f(r==1?h.max:h.min,h,m,v)),T=new Path2D(s);return R(T,k,y),R(T,A,y),R(T,A,N),T})}function Rl(n,t,e,i,s,r){let a=null;if(n.length>0){a=new Path2D;const o=t==0?Dl:bh;let l=e;for(let u=0;u<n.length;u++){let f=n[u];if(f[1]>f[0]){let p=f[0]-l;p>0&&o(a,l,i,p,i+r),l=f[1]}}let c=e+s-l,h=10;c>0&&o(a,l,i-h/2,c,i+r+h)}return a}function gE(n,t,e){let i=n[n.length-1];i&&i[0]==t?i[1]=e:n.push([t,e])}function Eh(n,t,e,i,s,r,a){let o=[],l=n.length;for(let c=s==1?e:i;c>=e&&c<=i;c+=s)if(t[c]===null){let u=c,f=c;if(s==1)for(;++c<=i&&t[c]===null;)f=c;else for(;--c>=e&&t[c]===null;)f=c;let p=r(n[u]),v=f==u?p:r(n[f]),S=u-s;p=a<=0&&S>=0&&S<l?r(n[S]):p;let d=f+s;v=a>=0&&d>=0&&d<l?r(n[d]):v,v>=p&&o.push([p,v])}return o}function zd(n){return n==0?Wp:n==1?cn:t=>Qs(t,n)}function pm(n){let t=n==0?Cl:Pl,e=n==0?(s,r,a,o,l,c)=>{s.arcTo(r,a,o,l,c)}:(s,r,a,o,l,c)=>{s.arcTo(a,r,l,o,c)},i=n==0?(s,r,a,o,l)=>{s.rect(r,a,o,l)}:(s,r,a,o,l)=>{s.rect(a,r,l,o)};return(s,r,a,o,l,c=0,h=0)=>{c==0&&h==0?i(s,r,a,o,l):(c=Ai(c,o/2,l/2),h=Ai(h,o/2,l/2),t(s,r+c,a),e(s,r+o,a,r+o,a+l,c),e(s,r+o,a+l,r,a+l,h),e(s,r,a+l,r,a,h),e(s,r,a,r+o,a,c),s.closePath())}}const Cl=(n,t,e)=>{n.moveTo(t,e)},Pl=(n,t,e)=>{n.moveTo(e,t)},ga=(n,t,e)=>{n.lineTo(t,e)},_a=(n,t,e)=>{n.lineTo(e,t)},Dl=pm(0),bh=pm(1),mm=(n,t,e,i,s,r)=>{n.arc(t,e,i,s,r)},gm=(n,t,e,i,s,r)=>{n.arc(e,t,i,s,r)},_m=(n,t,e,i,s,r,a)=>{n.bezierCurveTo(t,e,i,s,r,a)},xm=(n,t,e,i,s,r,a)=>{n.bezierCurveTo(e,t,s,i,a,r)};function vm(n){return(t,e,i,s,r)=>gr(t,e,(a,o,l,c,h,u,f,p,v,S,m)=>{let{pxRound:d,points:b}=a,R,w;c.ori==0?(R=Cl,w=mm):(R=Pl,w=gm);const D=Oe(b.width*be,3);let A=(b.size-b.width)/2*be,N=Oe(A*2,3),k=new Path2D,y=new Path2D,{left:T,top:L,width:W,height:z}=t.bbox;Dl(y,T-N,L-N,W+N*2,z+N*2);const K=V=>{if(l[V]!=null){let j=d(u(o[V],c,S,p)),G=d(f(l[V],h,m,v));R(k,j+A,G),w(k,j,G,A,0,tl*2)}};if(r)r.forEach(K);else for(let V=i;V<=s;V++)K(V);return{stroke:D>0?k:null,fill:k,clip:y,flags:da|Hu}})}function Mm(n){return(t,e,i,s,r,a)=>{i!=s&&(r!=i&&a!=i&&n(t,e,i),r!=s&&a!=s&&n(t,e,s),n(t,e,a))}}const _E=Mm(ga),xE=Mm(_a);function Sm(n){const t=xe(n?.alignGaps,0);return(e,i,s,r)=>gr(e,i,(a,o,l,c,h,u,f,p,v,S,m)=>{[s,r]=bl(l,s,r);let d=a.pxRound,b=z=>d(u(z,c,S,p)),R=z=>d(f(z,h,m,v)),w,D;c.ori==0?(w=ga,D=_E):(w=_a,D=xE);const A=c.dir*(c.ori==0?1:-1),N={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:da},k=N.stroke;let y=!1;if(r-s>=S*4){let z=ht=>e.posToVal(ht,c.key,!0),K=null,V=null,j,G,st,dt=b(o[A==1?s:r]),at=b(o[s]),ut=b(o[r]),St=z(A==1?at+1:ut-1);for(let ht=A==1?s:r;ht>=s&&ht<=r;ht+=A){let Qt=o[ht],Q=(A==1?Qt<St:Qt>St)?dt:b(Qt),et=l[ht];Q==dt?et!=null?(G=et,K==null?(w(k,Q,R(G)),j=K=V=G):G<K?K=G:G>V&&(V=G)):et===null&&(y=!0):(K!=null&&D(k,dt,R(K),R(V),R(j),R(G)),et!=null?(G=et,w(k,Q,R(G)),K=V=j=G):(K=V=null,et===null&&(y=!0)),dt=Q,St=z(dt+A))}K!=null&&K!=V&&st!=dt&&D(k,dt,R(K),R(V),R(j),R(G))}else for(let z=A==1?s:r;z>=s&&z<=r;z+=A){let K=l[z];K===null?y=!0:K!=null&&w(k,b(o[z]),R(K))}let[L,W]=yh(e,i);if(a.fill!=null||L!=0){let z=N.fill=new Path2D(k),K=a.fillTo(e,i,a.min,a.max,L),V=R(K),j=b(o[s]),G=b(o[r]);A==-1&&([G,j]=[j,G]),w(z,G,V),w(z,j,V)}if(!a.spanGaps){let z=[];y&&z.push(...Eh(o,l,s,r,A,b,t)),N.gaps=z=a.gaps(e,i,s,r,z),N.clip=Rl(z,c.ori,p,v,S,m)}return W!=0&&(N.band=W==2?[ds(e,i,s,r,k,-1),ds(e,i,s,r,k,1)]:ds(e,i,s,r,k,W)),N})}function vE(n){const t=xe(n.align,1),e=xe(n.ascDesc,!1),i=xe(n.alignGaps,0),s=xe(n.extend,!1);return(r,a,o,l)=>gr(r,a,(c,h,u,f,p,v,S,m,d,b,R)=>{[o,l]=bl(u,o,l);let w=c.pxRound,{left:D,width:A}=r.bbox,N=at=>w(v(at,f,b,m)),k=at=>w(S(at,p,R,d)),y=f.ori==0?ga:_a;const T={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:da},L=T.stroke,W=f.dir*(f.ori==0?1:-1);let z=k(u[W==1?o:l]),K=N(h[W==1?o:l]),V=K,j=K;s&&t==-1&&(j=D,y(L,j,z)),y(L,K,z);for(let at=W==1?o:l;at>=o&&at<=l;at+=W){let ut=u[at];if(ut==null)continue;let St=N(h[at]),ht=k(ut);t==1?y(L,St,z):y(L,V,ht),y(L,St,ht),z=ht,V=St}let G=V;s&&t==1&&(G=D+A,y(L,G,z));let[st,dt]=yh(r,a);if(c.fill!=null||st!=0){let at=T.fill=new Path2D(L),ut=c.fillTo(r,a,c.min,c.max,st),St=k(ut);y(at,G,St),y(at,j,St)}if(!c.spanGaps){let at=[];at.push(...Eh(h,u,o,l,W,N,i));let ut=c.width*be/2,St=e||t==1?ut:-ut,ht=e||t==-1?-ut:ut;at.forEach(Qt=>{Qt[0]+=St,Qt[1]+=ht}),T.gaps=at=c.gaps(r,a,o,l,at),T.clip=Rl(at,f.ori,m,d,b,R)}return dt!=0&&(T.band=dt==2?[ds(r,a,o,l,L,-1),ds(r,a,o,l,L,1)]:ds(r,a,o,l,L,dt)),T})}function Gd(n,t,e,i,s,r,a=Fe){if(n.length>1){let o=null;for(let l=0,c=1/0;l<n.length;l++)if(t[l]!==void 0){if(o!=null){let h=un(n[l]-n[o]);h<c&&(c=h,a=un(e(n[l],i,s,r)-e(n[o],i,s,r)))}o=l}}return a}function ME(n){n=n||Za;const t=xe(n.size,[.6,Fe,1]),e=n.align||0,i=n.gap||0;let s=n.radius;s=s==null?[0,0]:typeof s=="number"?[s,0]:s;const r=ce(s),a=1-t[0],o=xe(t[1],Fe),l=xe(t[2],1),c=xe(n.disp,Za),h=xe(n.each,p=>{}),{fill:u,stroke:f}=c;return(p,v,S,m)=>gr(p,v,(d,b,R,w,D,A,N,k,y,T,L)=>{let W=d.pxRound,z=e,K=i*be,V=o*be,j=l*be,G,st;w.ori==0?[G,st]=r(p,v):[st,G]=r(p,v);const dt=w.dir*(w.ori==0?1:-1);let at=w.ori==0?Dl:bh,ut=w.ori==0?h:(U,Z,nt,tt,Nt,mt,Lt)=>{h(U,Z,nt,Nt,tt,Lt,mt)},St=xe(p.bands,_h).find(U=>U.series[0]==v),ht=St!=null?St.dir:0,Qt=d.fillTo(p,v,d.min,d.max,ht),ne=W(N(Qt,D,L,y)),Q,et,bt,kt=T,_t=W(d.width*be),te=!1,Ce=null,Yt=null,ae=null,fe=null;u!=null&&(_t==0||f!=null)&&(te=!0,Ce=u.values(p,v,S,m),Yt=new Map,new Set(Ce).forEach(U=>{U!=null&&Yt.set(U,new Path2D)}),_t>0&&(ae=f.values(p,v,S,m),fe=new Map,new Set(ae).forEach(U=>{U!=null&&fe.set(U,new Path2D)})));let{x0:qt,size:Be}=c;if(qt!=null&&Be!=null){z=1,b=qt.values(p,v,S,m),qt.unit==2&&(b=b.map(nt=>p.posToVal(k+nt*T,w.key,!0)));let U=Be.values(p,v,S,m);Be.unit==2?et=U[0]*T:et=A(U[0],w,T,k)-A(0,w,T,k),kt=Gd(b,R,A,w,T,k,kt),bt=kt-et+K}else kt=Gd(b,R,A,w,T,k,kt),bt=kt*a+K,et=kt-bt;bt<1&&(bt=0),_t>=et/2&&(_t=0),bt<5&&(W=Wp);let F=bt>0,Pe=kt-bt-(F?_t:0);et=W(zu(Pe,j,V)),Q=(z==0?et/2:z==dt?0:et)-z*dt*((z==0?K/2:0)+(F?_t/2:0));const jt={stroke:null,fill:null,clip:null,band:null,gaps:null,flags:0},pe=te?null:new Path2D;let Dt=null;if(St!=null)Dt=p.data[St.series[1]];else{let{y0:U,y1:Z}=c;U!=null&&Z!=null&&(R=Z.values(p,v,S,m),Dt=U.values(p,v,S,m))}let P=G*et,x=st*et;for(let U=dt==1?S:m;U>=S&&U<=m;U+=dt){let Z=R[U];if(Z==null)continue;if(Dt!=null){let pt=Dt[U]??0;if(Z-pt==0)continue;ne=N(pt,D,L,y)}let nt=w.distr!=2||c!=null?b[U]:U,tt=A(nt,w,T,k),Nt=N(xe(Z,Qt),D,L,y),mt=W(tt-Q),Lt=W(Fn(Nt,ne)),Bt=W(Ai(Nt,ne)),ot=Lt-Bt;if(Z!=null){let pt=Z<0?x:P,At=Z<0?P:x;te?(_t>0&&ae[U]!=null&&at(fe.get(ae[U]),mt,Bt+Qn(_t/2),et,Fn(0,ot-_t),pt,At),Ce[U]!=null&&at(Yt.get(Ce[U]),mt,Bt+Qn(_t/2),et,Fn(0,ot-_t),pt,At)):at(pe,mt,Bt+Qn(_t/2),et,Fn(0,ot-_t),pt,At),ut(p,v,U,mt-_t/2,Bt,et+_t,ot)}}return _t>0?jt.stroke=te?fe:pe:te||(jt._fill=d.width==0?d._fill:d._stroke??d._fill,jt.width=0),jt.fill=te?Yt:pe,jt})}function SE(n,t){const e=xe(t?.alignGaps,0);return(i,s,r,a)=>gr(i,s,(o,l,c,h,u,f,p,v,S,m,d)=>{[r,a]=bl(c,r,a);let b=o.pxRound,R=G=>b(f(G,h,m,v)),w=G=>b(p(G,u,d,S)),D,A,N;h.ori==0?(D=Cl,N=ga,A=_m):(D=Pl,N=_a,A=xm);const k=h.dir*(h.ori==0?1:-1);let y=R(l[k==1?r:a]),T=y,L=[],W=[];for(let G=k==1?r:a;G>=r&&G<=a;G+=k)if(c[G]!=null){let dt=l[G],at=R(dt);L.push(T=at),W.push(w(c[G]))}const z={stroke:n(L,W,D,N,A,b),fill:null,clip:null,band:null,gaps:null,flags:da},K=z.stroke;let[V,j]=yh(i,s);if(o.fill!=null||V!=0){let G=z.fill=new Path2D(K),st=o.fillTo(i,s,o.min,o.max,V),dt=w(st);N(G,T,dt),N(G,y,dt)}if(!o.spanGaps){let G=[];G.push(...Eh(l,c,r,a,k,R,e)),z.gaps=G=o.gaps(i,s,r,a,G),z.clip=Rl(G,h.ori,v,S,m,d)}return j!=0&&(z.band=j==2?[ds(i,s,r,a,K,-1),ds(i,s,r,a,K,1)]:ds(i,s,r,a,K,j)),z})}function yE(n){return SE(EE,n)}function EE(n,t,e,i,s,r){const a=n.length;if(a<2)return null;const o=new Path2D;if(e(o,n[0],t[0]),a==2)i(o,n[1],t[1]);else{let l=Array(a),c=Array(a-1),h=Array(a-1),u=Array(a-1);for(let f=0;f<a-1;f++)h[f]=t[f+1]-t[f],u[f]=n[f+1]-n[f],c[f]=h[f]/u[f];l[0]=c[0];for(let f=1;f<a-1;f++)c[f]===0||c[f-1]===0||c[f-1]>0!=c[f]>0?l[f]=0:(l[f]=3*(u[f-1]+u[f])/((2*u[f]+u[f-1])/c[f-1]+(u[f]+2*u[f-1])/c[f]),isFinite(l[f])||(l[f]=0));l[a-1]=c[a-2];for(let f=0;f<a-1;f++)s(o,n[f]+u[f]/3,t[f]+l[f]*u[f]/3,n[f+1]-u[f]/3,t[f+1]-l[f+1]*u[f]/3,n[f+1],t[f+1])}return o}const Vu=new Set;function kd(){for(let n of Vu)n.syncRect(!0)}ma&&(hr(iy,ea,kd),hr(sy,ea,kd,!0),hr(fl,ea,()=>{hn.pxRatio=be}));const bE=Sm(),TE=vm();function Hd(n,t,e,i){return(i?[n[0],n[1]].concat(n.slice(2)):[n[0]].concat(n.slice(1))).map((r,a)=>Wu(r,a,t,e))}function AE(n,t){return n.map((e,i)=>i==0?{}:nn({},t,e))}function Wu(n,t,e,i){return nn({},t==0?e:i,n)}function ym(n,t,e){return t==null?ha:[t,e]}const wE=ym;function RE(n,t,e){return t==null?ha:dl(t,e,mh,!0)}function Em(n,t,e,i){return t==null?ha:Tl(t,e,n.scales[i].log,!1)}const CE=Em;function bm(n,t,e,i){return t==null?ha:ph(t,e,n.scales[i].log,!1)}const PE=bm;function DE(n,t,e,i,s){let r=Fn(Md(n),Md(t)),a=t-n,o=bi(s/i*a,e);do{let l=e[o],c=i*l/a;if(c>=s&&r+(l<5?Os.get(l):0)<=17)return[l,c]}while(++o<e.length);return[0,0]}function Vd(n){let t,e;return n=n.replace(/(\d+)px/,(i,s)=>(t=cn((e=+s)*be))+"px"),[n,t,e]}function LE(n){n.show&&[n.font,n.labelFont].forEach(t=>{let e=Oe(t[2]*be,1);t[0]=t[0].replace(/[0-9.]+px/,e+"px"),t[1]=e})}function hn(n,t,e){const i={mode:xe(n.mode,1)},s=i.mode;function r(g,M,C,I){let B=M.valToPct(g);return I+C*(M.dir==-1?1-B:B)}function a(g,M,C,I){let B=M.valToPct(g);return I+C*(M.dir==-1?B:1-B)}function o(g,M,C,I){return M.ori==0?r(g,M,C,I):a(g,M,C,I)}i.valToPosH=r,i.valToPosV=a;let l=!1;i.status=0;const c=i.root=oi(zS);if(n.id!=null&&(c.id=n.id),Zn(c,n.class),n.title){let g=oi(HS,c);g.textContent=n.title}const h=Ei("canvas"),u=i.ctx=h.getContext("2d"),f=oi(VS,c);hr("click",f,g=>{g.target===v&&(He!=Er||qe!=br)&&yn.click(i,g)},!0);const p=i.under=oi(WS,f);f.appendChild(h);const v=i.over=oi(XS,f);n=fa(n);const S=+xe(n.pxAlign,1),m=zd(S);(n.plugins||[]).forEach(g=>{g.opts&&(n=g.opts(i,n)||n)});const d=n.ms||.001,b=i.series=s==1?Hd(n.series||[],Ld,Od,!1):AE(n.series||[null],Fd),R=i.axes=Hd(n.axes||[],Dd,Ud,!0),w=i.scales={},D=i.bands=n.bands||[];D.forEach(g=>{g.fill=ce(g.fill||null),g.dir=xe(g.dir,-1)});const A=s==2?b[1].facets[0].scale:b[0].scale,N={axes:Ji,series:Se},k=(n.drawOrder||["axes","series"]).map(g=>N[g]);function y(g){const M=g.distr==3?C=>fs(C>0?C:g.clamp(i,C,g.min,g.max,g.key)):g.distr==4?C=>Ac(C,g.asinh):g.distr==100?C=>g.fwd(C):C=>C;return C=>{let I=M(C),{_min:B,_max:q}=g,it=q-B;return(I-B)/it}}function T(g){let M=w[g];if(M==null){let C=(n.scales||Za)[g]||Za;if(C.from!=null){T(C.from);let I=nn({},w[C.from],C,{key:g});I.valToPct=y(I),w[g]=I}else{M=w[g]=nn({},g==A?fm:pE,C),M.key=g;let I=M.time,B=M.range,q=Ls(B);if((g!=A||s==2&&!I)&&(q&&(B[0]==null||B[1]==null)&&(B={min:B[0]==null?_d:{mode:1,hard:B[0],soft:B[0]},max:B[1]==null?_d:{mode:1,hard:B[1],soft:B[1]}},q=!1),!q&&wl(B))){let it=B;B=(ct,gt,Rt)=>gt==null?ha:dl(gt,Rt,it)}M.range=ce(B||(I?wE:g==A?M.distr==3?CE:M.distr==4?PE:ym:M.distr==3?Em:M.distr==4?bm:RE)),M.auto=ce(q?!1:M.auto),M.clamp=ce(M.clamp||dE),M._min=M._max=null,M.valToPct=y(M)}}}T("x"),T("y"),s==1&&b.forEach(g=>{T(g.scale)}),R.forEach(g=>{T(g.scale)});for(let g in n.scales)T(g);const L=w[A],W=L.distr;let z,K;L.ori==0?(Zn(c,GS),z=r,K=a):(Zn(c,kS),z=a,K=r);const V={};for(let g in w){let M=w[g];(M.min!=null||M.max!=null)&&(V[g]={min:M.min,max:M.max},M.min=M.max=null)}const j=n.tzDate||(g=>new Date(cn(g/d))),G=n.fmtDate||xh,st=d==1?Gy(j):Vy(j),dt=Rd(j,wd(d==1?zy:Hy,G)),at=Pd(j,Cd(Xy,G)),ut=[],St=i.legend=nn({},jy,n.legend),ht=i.cursor=nn({},tE,{drag:{y:s==2}},n.cursor),Qt=St.show,ne=ht.show,Q=St.markers;St.idxs=ut,Q.width=ce(Q.width),Q.dash=ce(Q.dash),Q.stroke=ce(Q.stroke),Q.fill=ce(Q.fill);let et,bt,kt,_t=[],te=[],Ce,Yt=!1,ae={};if(St.live){const g=b[1]?b[1].values:null;Yt=g!=null,Ce=Yt?g(i,1,0):{_:0};for(let M in Ce)ae[M]=fh}if(Qt)if(et=Ei("table",ZS,c),kt=Ei("tbody",null,et),St.mount(i,et),Yt){bt=Ei("thead",null,et,kt);let g=Ei("tr",null,bt);Ei("th",null,g);for(var fe in Ce)Ei("th",sd,g).textContent=fe}else Zn(et,QS),St.live&&Zn(et,JS);const qt={show:!0},Be={show:!1};function F(g,M){if(M==0&&(Yt||!St.live||s==2))return ha;let C=[],I=Ei("tr",ty,kt,kt.childNodes[M]);Zn(I,g.class),g.show||Zn(I,rr);let B=Ei("th",null,I);if(Q.show){let ct=oi(ey,B);if(M>0){let gt=Q.width(i,M);gt&&(ct.style.border=gt+"px "+Q.dash(i,M)+" "+Q.stroke(i,M)),ct.style.background=Q.fill(i,M)}}let q=oi(sd,B);g.label instanceof HTMLElement?q.appendChild(g.label):q.textContent=g.label,M>0&&(Q.show||(q.style.color=g.width>0?Q.stroke(i,M):Q.fill(i,M)),jt("click",B,ct=>{if(ht._lock)return;mn(ct);let gt=b.indexOf(g);if((ct.ctrlKey||ct.metaKey)!=St.isolate){let Rt=b.some((Pt,Ft)=>Ft>0&&Ft!=gt&&Pt.show);b.forEach((Pt,Ft)=>{Ft>0&&Di(Ft,Rt?Ft==gt?qt:Be:qt,!0,tn.setSeries)})}else Di(gt,{show:!g.show},!0,tn.setSeries)},!1),ji&&jt(ld,B,ct=>{ht._lock||(mn(ct),Di(b.indexOf(g),Ar,!0,tn.setSeries))},!1));for(var it in Ce){let ct=Ei("td",ny,I);ct.textContent="--",C.push(ct)}return[I,C]}const Pe=new Map;function jt(g,M,C,I=!0){const B=Pe.get(M)||{},q=ht.bind[g](i,M,C,I);q&&(hr(g,M,B[g]=q),Pe.set(M,B))}function pe(g,M,C){const I=Pe.get(M)||{};for(let B in I)(g==null||B==g)&&(Bu(B,M,I[B]),delete I[B]);g==null&&Pe.delete(M)}let Dt=0,P=0,x=0,U=0,Z=0,nt=0,tt=Z,Nt=nt,mt=x,Lt=U,Bt=0,ot=0,pt=0,At=0;i.bbox={};let Ot=!1,xt=!1,Kt=!1,O=!1,yt=!1,lt=!1;function wt(g,M,C){(C||g!=i.width||M!=i.height)&&ft(g,M),vr(!1),Kt=!0,xt=!0,Mr()}function ft(g,M){i.width=Dt=x=g,i.height=P=U=M,Z=nt=0,De(),ve();let C=i.bbox;Bt=C.left=Qs(Z*be,.5),ot=C.top=Qs(nt*be,.5),pt=C.width=Qs(x*be,.5),At=C.height=Qs(U*be,.5)}const rt=3;function vt(){let g=!1,M=0;for(;!g;){M++;let C=wn(M),I=va(M);g=M==rt||C&&I,g||(ft(i.width,i.height),xt=!0)}}function $t({width:g,height:M}){wt(g,M)}i.setSize=$t;function De(){let g=!1,M=!1,C=!1,I=!1;R.forEach((B,q)=>{if(B.show&&B._show){let{side:it,_size:ct}=B,gt=it%2,Rt=B.label!=null?B.labelSize:0,Pt=ct+Rt;Pt>0&&(gt?(x-=Pt,it==3?(Z+=Pt,I=!0):C=!0):(U-=Pt,it==0?(nt+=Pt,g=!0):M=!0))}}),ii[0]=g,ii[1]=C,ii[2]=M,ii[3]=I,x-=_i[1]+_i[3],Z+=_i[3],U-=_i[2]+_i[0],nt+=_i[0]}function ve(){let g=Z+x,M=nt+U,C=Z,I=nt;function B(q,it){switch(q){case 1:return g+=it,g-it;case 2:return M+=it,M-it;case 3:return C-=it,C+it;case 0:return I-=it,I+it}}R.forEach((q,it)=>{if(q.show&&q._show){let ct=q.side;q._pos=B(ct,q._size),q.label!=null&&(q._lpos=B(ct,q.labelSize))}})}if(ht.dataIdx==null){let g=ht.hover,M=g.skip=new Set(g.skip??[]);M.add(void 0);let C=g.prox=ce(g.prox),I=g.bias??=0;ht.dataIdx=(B,q,it,ct)=>{if(q==0)return it;let gt=it,Rt=C(B,q,it,ct)??Fe,Pt=Rt>=0&&Rt<Fe,Ft=L.ori==0?x:U,Zt=ht.left,Ee=t[0],ge=t[q];if(M.has(ge[it])){gt=null;let oe=null,Wt=null,Gt;if(I==0||I==-1)for(Gt=it;oe==null&&Gt-- >0;)M.has(ge[Gt])||(oe=Gt);if(I==0||I==1)for(Gt=it;Wt==null&&Gt++<ge.length;)M.has(ge[Gt])||(Wt=Gt);if(oe!=null||Wt!=null)if(Pt){let We=oe==null?-1/0:z(Ee[oe],L,Ft,0),je=Wt==null?1/0:z(Ee[Wt],L,Ft,0),vn=Zt-We,Le=je-Zt;vn<=Le?vn<=Rt&&(gt=oe):Le<=Rt&&(gt=Wt)}else gt=Wt==null?oe:oe==null?Wt:it-oe<=Wt-it?oe:Wt}else Pt&&un(Zt-z(Ee[it],L,Ft,0))>Rt&&(gt=null);return gt}}const mn=g=>{ht.event=g};ht.idxs=ut,ht._lock=!1;let ze=ht.points;ze.show=ce(ze.show),ze.size=ce(ze.size),ze.stroke=ce(ze.stroke),ze.width=ce(ze.width),ze.fill=ce(ze.fill);const ni=i.focus=nn({},n.focus||{alpha:.3},ht.focus),ji=ni.prox>=0,Ri=ji&&ze.one;let On=[],Ki=[],$i=[];function Ci(g,M){let C=ze.show(i,M);if(C instanceof HTMLElement)return Zn(C,$S),Zn(C,g.class),Fi(C,-10,-10,x,U),v.insertBefore(C,On[M]),C}function _r(g,M){if(s==1||M>0){let C=s==1&&w[g.scale].time,I=g.value;g.value=C?Ed(I)?Pd(j,Cd(I,G)):I||at:I||uE,g.label=g.label||(C?nE:eE)}if(Ri||M>0){g.width=g.width==null?1:g.width,g.paths=g.paths||bE||py,g.fillTo=ce(g.fillTo||mE),g.pxAlign=+xe(g.pxAlign,S),g.pxRound=zd(g.pxAlign),g.stroke=ce(g.stroke||null),g.fill=ce(g.fill||null),g._stroke=g._fill=g._paths=g._focus=null;let C=hE(Fn(1,g.width),1),I=g.points=nn({},{size:C,width:Fn(1,C*.2),stroke:g.stroke,space:C*2,paths:TE,_stroke:null,_fill:null},g.points);I.show=ce(I.show),I.filter=ce(I.filter),I.fill=ce(I.fill),I.stroke=ce(I.stroke),I.paths=ce(I.paths),I.pxAlign=g.pxAlign}if(Qt){let C=F(g,M);_t.splice(M,0,C[0]),te.splice(M,0,C[1]),St.values.push(null)}if(ne){ut.splice(M,0,null);let C=null;Ri?M==0&&(C=Ci(g,M)):M>0&&(C=Ci(g,M)),On.splice(M,0,C),Ki.splice(M,0,0),$i.splice(M,0,0)}xn("addSeries",M)}function ho(g,M){M=M??b.length,g=s==1?Wu(g,M,Ld,Od):Wu(g,M,{},Fd),b.splice(M,0,g),_r(b[M],M)}i.addSeries=ho;function fo(g){if(b.splice(g,1),Qt){St.values.splice(g,1),te.splice(g,1);let M=_t.splice(g,1)[0];pe(null,M.firstChild),M.remove()}ne&&(ut.splice(g,1),On.splice(g,1)[0].remove(),Ki.splice(g,1),$i.splice(g,1)),xn("delSeries",g)}i.delSeries=fo;const ii=[!1,!1,!1,!1];function po(g,M){if(g._show=g.show,g.show){let C=g.side%2,I=w[g.scale];I==null&&(g.scale=C?b[1].scale:A,I=w[g.scale]);let B=I.time;g.size=ce(g.size),g.space=ce(g.space),g.rotate=ce(g.rotate),Ls(g.incrs)&&g.incrs.forEach(it=>{!Os.has(it)&&Os.set(it,qp(it))}),g.incrs=ce(g.incrs||(I.distr==2?Fy:B?d==1?By:ky:tr)),g.splits=ce(g.splits||(B&&I.distr==1?st:I.distr==3?Gu:I.distr==4?rE:sE)),g.stroke=ce(g.stroke),g.grid.stroke=ce(g.grid.stroke),g.ticks.stroke=ce(g.ticks.stroke),g.border.stroke=ce(g.border.stroke);let q=g.values;g.values=Ls(q)&&!Ls(q[0])?ce(q):B?Ls(q)?Rd(j,wd(q,G)):Ed(q)?Wy(j,q):q||dt:q||iE,g.filter=ce(g.filter||(I.distr>=3&&I.log==10?lE:I.distr==3&&I.log==2?cE:Xp)),g.font=Vd(g.font),g.labelFont=Vd(g.labelFont),g._size=g.size(i,null,M,0),g._space=g._rotate=g._incrs=g._found=g._splits=g._values=null,g._size>0&&(ii[M]=!0,g._el=oi(YS,f))}}function Pi(g,M,C,I){let[B,q,it,ct]=C,gt=M%2,Rt=0;return gt==0&&(ct||q)&&(Rt=M==0&&!B||M==2&&!it?cn(Dd.size/3):0),gt==1&&(B||it)&&(Rt=M==1&&!q||M==3&&!ct?cn(Ud.size/2):0),Rt}const xa=i.padding=(n.padding||[Pi,Pi,Pi,Pi]).map(g=>ce(xe(g,Pi))),_i=i._padding=xa.map((g,M)=>g(i,M,ii,0));let rn,Je=null,Qe=null;const xr=s==1?b[0].idxs:null;let Xn=null,Hs=!1;function E(g,M){if(t=g??[],i.data=i._data=t,s==2){rn=0;for(let C=1;C<b.length;C++)rn+=t[C][0].length}else{t.length==0&&(i.data=i._data=t=[[]]),Xn=t[0],rn=Xn.length;let C=t;if(W==2){C=t.slice();let I=C[0]=Array(rn);for(let B=0;B<rn;B++)I[B]=B}i._data=t=C}if(vr(!0),xn("setData"),W==2&&(Kt=!0),M!==!1){let C=L;C.auto(i,Hs)?H():Ss(A,C.min,C.max),O=O||ht.left>=0,lt=!0,Mr()}}i.setData=E;function H(){Hs=!0;let g,M;s==1&&(rn>0?(Je=xr[0]=0,Qe=xr[1]=rn-1,g=t[0][Je],M=t[0][Qe],W==2?(g=Je,M=Qe):g==M&&(W==3?[g,M]=Tl(g,g,L.log,!1):W==4?[g,M]=ph(g,g,L.log,!1):L.time?M=g+cn(86400/d):[g,M]=dl(g,M,mh,!0))):(Je=xr[0]=g=null,Qe=xr[1]=M=null)),Ss(A,g,M)}let J,$,Y,Mt,Ct,Et,It,zt,Vt,Ut;function ie(g,M,C,I,B,q){g??=ad,C??=_h,I??="butt",B??=ad,q??="round",g!=J&&(u.strokeStyle=J=g),B!=$&&(u.fillStyle=$=B),M!=Y&&(u.lineWidth=Y=M),q!=Ct&&(u.lineJoin=Ct=q),I!=Et&&(u.lineCap=Et=I),C!=Mt&&u.setLineDash(Mt=C)}function Me(g,M,C,I){M!=$&&(u.fillStyle=$=M),g!=It&&(u.font=It=g),C!=zt&&(u.textAlign=zt=C),I!=Vt&&(u.textBaseline=Vt=I)}function Ge(g,M,C,I,B=0){if(I.length>0&&g.auto(i,Hs)&&(M==null||M.min==null)){let q=xe(Je,0),it=xe(Qe,I.length-1),ct=C.min==null?ly(I,q,it,B,g.distr==3):[C.min,C.max];g.min=Ai(g.min,C.min=ct[0]),g.max=Fn(g.max,C.max=ct[1])}}const ke={min:null,max:null};function Ae(){for(let I in w){let B=w[I];V[I]==null&&(B.min==null||V[A]!=null&&B.auto(i,Hs))&&(V[I]=ke)}for(let I in w){let B=w[I];V[I]==null&&B.from!=null&&V[B.from]!=null&&(V[I]=ke)}V[A]!=null&&vr(!0);let g={};for(let I in V){let B=V[I];if(B!=null){let q=g[I]=fa(w[I],_y);if(B.min!=null)nn(q,B);else if(I!=A||s==2)if(rn==0&&q.from==null){let it=q.range(i,null,null,I);q.min=it[0],q.max=it[1]}else q.min=Fe,q.max=-Fe}}if(rn>0){b.forEach((I,B)=>{if(s==1){let q=I.scale,it=V[q];if(it==null)return;let ct=g[q];if(B==0){let gt=ct.range(i,ct.min,ct.max,q);ct.min=gt[0],ct.max=gt[1],Je=bi(ct.min,t[0]),Qe=bi(ct.max,t[0]),Qe-Je>1&&(t[0][Je]<ct.min&&Je++,t[0][Qe]>ct.max&&Qe--),I.min=Xn[Je],I.max=Xn[Qe]}else I.show&&I.auto&&Ge(ct,it,I,t[B],I.sorted);I.idxs[0]=Je,I.idxs[1]=Qe}else if(B>0&&I.show&&I.auto){let[q,it]=I.facets,ct=q.scale,gt=it.scale,[Rt,Pt]=t[B],Ft=g[ct],Zt=g[gt];Ft!=null&&Ge(Ft,V[ct],q,Rt,q.sorted),Zt!=null&&Ge(Zt,V[gt],it,Pt,it.sorted),I.min=it.min,I.max=it.max}});for(let I in g){let B=g[I],q=V[I];if(B.from==null&&(q==null||q.min==null)){let it=B.range(i,B.min==Fe?null:B.min,B.max==-Fe?null:B.max,I);B.min=it[0],B.max=it[1]}}}for(let I in g){let B=g[I];if(B.from!=null){let q=g[B.from];if(q.min==null)B.min=B.max=null;else{let it=B.range(i,q.min,q.max,I);B.min=it[0],B.max=it[1]}}}let M={},C=!1;for(let I in g){let B=g[I],q=w[I];if(q.min!=B.min||q.max!=B.max){q.min=B.min,q.max=B.max;let it=q.distr;q._min=it==3?fs(q.min):it==4?Ac(q.min,q.asinh):it==100?q.fwd(q.min):q.min,q._max=it==3?fs(q.max):it==4?Ac(q.max,q.asinh):it==100?q.fwd(q.max):q.max,M[I]=C=!0}}if(C){b.forEach((I,B)=>{s==2?B>0&&M.y&&(I._paths=null):M[I.scale]&&(I._paths=null)});for(let I in M)Kt=!0,xn("setScale",I);ne&&ht.left>=0&&(O=lt=!0)}for(let I in V)V[I]=null}function Ht(g){let M=zu(Je-1,0,rn-1),C=zu(Qe+1,0,rn-1);for(;g[M]==null&&M>0;)M--;for(;g[C]==null&&C<rn-1;)C++;return[M,C]}function Se(){if(rn>0){let g=b.some(M=>M._focus)&&Ut!=ni.alpha;g&&(u.globalAlpha=Ut=ni.alpha),b.forEach((M,C)=>{if(C>0&&M.show&&(he(C,!1),he(C,!0),M._paths==null)){let I=Ut;Ut!=M.alpha&&(u.globalAlpha=Ut=M.alpha);let B=s==2?[0,t[C][0].length-1]:Ht(t[C]);M._paths=M.paths(i,C,B[0],B[1]),Ut!=I&&(u.globalAlpha=Ut=I)}}),b.forEach((M,C)=>{if(C>0&&M.show){let I=Ut;Ut!=M.alpha&&(u.globalAlpha=Ut=M.alpha),M._paths!=null&&Tn(C,!1);{let B=M._paths!=null?M._paths.gaps:null,q=M.points.show(i,C,Je,Qe,B),it=M.points.filter(i,C,q,B);(q||it)&&(M.points._paths=M.points.paths(i,C,Je,Qe,it),Tn(C,!0))}Ut!=I&&(u.globalAlpha=Ut=I),xn("drawSeries",C)}}),g&&(u.globalAlpha=Ut=1)}}function he(g,M){let C=M?b[g].points:b[g];C._stroke=C.stroke(i,g),C._fill=C.fill(i,g)}function Tn(g,M){let C=M?b[g].points:b[g],{stroke:I,fill:B,clip:q,flags:it,_stroke:ct=C._stroke,_fill:gt=C._fill,_width:Rt=C.width}=C._paths;Rt=Oe(Rt*be,3);let Pt=null,Ft=Rt%2/2;M&&gt==null&&(gt=Rt>0?"#fff":ct);let Zt=C.pxAlign==1&&Ft>0;if(Zt&&u.translate(Ft,Ft),!M){let Ee=Bt-Rt/2,ge=ot-Rt/2,oe=pt+Rt,Wt=At+Rt;Pt=new Path2D,Pt.rect(Ee,ge,oe,Wt)}M?Zi(ct,Rt,C.dash,C.cap,gt,I,B,it,q):vs(g,ct,Rt,C.dash,C.cap,gt,I,B,it,Pt,q),Zt&&u.translate(-Ft,-Ft)}function vs(g,M,C,I,B,q,it,ct,gt,Rt,Pt){let Ft=!1;gt!=0&&D.forEach((Zt,Ee)=>{if(Zt.series[0]==g){let ge=b[Zt.series[1]],oe=t[Zt.series[1]],Wt=(ge._paths||Za).band;Ls(Wt)&&(Wt=Zt.dir==1?Wt[0]:Wt[1]);let Gt,We=null;ge.show&&Wt&&uy(oe,Je,Qe)?(We=Zt.fill(i,Ee)||q,Gt=ge._paths.clip):Wt=null,Zi(M,C,I,B,We,it,ct,gt,Rt,Pt,Gt,Wt),Ft=!0}}),Ft||Zi(M,C,I,B,q,it,ct,gt,Rt,Pt)}const An=da|Hu;function Zi(g,M,C,I,B,q,it,ct,gt,Rt,Pt,Ft){ie(g,M,C,I,B),(gt||Rt||Ft)&&(u.save(),gt&&u.clip(gt),Rt&&u.clip(Rt)),Ft?(ct&An)==An?(u.clip(Ft),Pt&&u.clip(Pt),an(B,it),ye(g,q,M)):ct&Hu?(an(B,it),u.clip(Ft),ye(g,q,M)):ct&da&&(u.save(),u.clip(Ft),Pt&&u.clip(Pt),an(B,it),u.restore(),ye(g,q,M)):(an(B,it),ye(g,q,M)),(gt||Rt||Ft)&&u.restore()}function ye(g,M,C){C>0&&(M instanceof Map?M.forEach((I,B)=>{u.strokeStyle=J=B,u.stroke(I)}):M!=null&&g&&u.stroke(M))}function an(g,M){M instanceof Map?M.forEach((C,I)=>{u.fillStyle=$=I,u.fill(C)}):M!=null&&g&&u.fill(M)}function Bn(g,M,C,I){let B=R[g],q;if(I<=0)q=[0,0];else{let it=B._space=B.space(i,g,M,C,I),ct=B._incrs=B.incrs(i,g,M,C,I,it);q=DE(M,C,ct,I,it)}return B._found=q}function on(g,M,C,I,B,q,it,ct,gt,Rt){let Pt=it%2/2;S==1&&u.translate(Pt,Pt),ie(ct,it,gt,Rt,ct),u.beginPath();let Ft,Zt,Ee,ge,oe=B+(I==0||I==3?-q:q);C==0?(Zt=B,ge=oe):(Ft=B,Ee=oe);for(let Wt=0;Wt<g.length;Wt++)M[Wt]!=null&&(C==0?Ft=Ee=g[Wt]:Zt=ge=g[Wt],u.moveTo(Ft,Zt),u.lineTo(Ee,ge));u.stroke(),S==1&&u.translate(-Pt,-Pt)}function wn(g){let M=!0;return R.forEach((C,I)=>{if(!C.show)return;let B=w[C.scale];if(B.min==null){C._show&&(M=!1,C._show=!1,vr(!1));return}else C._show||(M=!1,C._show=!0,vr(!1));let q=C.side,it=q%2,{min:ct,max:gt}=B,[Rt,Pt]=Bn(I,ct,gt,it==0?x:U);if(Pt==0)return;let Ft=B.distr==2,Zt=C._splits=C.splits(i,I,ct,gt,Rt,Pt,Ft),Ee=B.distr==2?Zt.map(Gt=>Xn[Gt]):Zt,ge=B.distr==2?Xn[Zt[1]]-Xn[Zt[0]]:Rt,oe=C._values=C.values(i,C.filter(i,Ee,I,Pt,ge),I,Pt,ge);C._rotate=q==2?C.rotate(i,oe,I,Pt):0;let Wt=C._size;C._size=ci(C.size(i,oe,I,g)),Wt!=null&&C._size!=Wt&&(M=!1)}),M}function va(g){let M=!0;return xa.forEach((C,I)=>{let B=C(i,I,ii,g);B!=_i[I]&&(M=!1),_i[I]=B}),M}function Ji(){for(let g=0;g<R.length;g++){let M=R[g];if(!M.show||!M._show)continue;let C=M.side,I=C%2,B,q,it=M.stroke(i,g),ct=C==0||C==3?-1:1,[gt,Rt]=M._found;if(M.label!=null){let Ln=M.labelGap*ct,jn=cn((M._lpos+Ln)*be);Me(M.labelFont[0],it,"center",C==2?Oa:rd),u.save(),I==1?(B=q=0,u.translate(jn,cn(ot+At/2)),u.rotate((C==3?-tl:tl)/2)):(B=cn(Bt+pt/2),q=jn);let Xs=Vp(M.label)?M.label(i,g,gt,Rt):M.label;u.fillText(Xs,B,q),u.restore()}if(Rt==0)continue;let Pt=w[M.scale],Ft=I==0?pt:At,Zt=I==0?Bt:ot,Ee=M._splits,ge=Pt.distr==2?Ee.map(Ln=>Xn[Ln]):Ee,oe=Pt.distr==2?Xn[Ee[1]]-Xn[Ee[0]]:gt,Wt=M.ticks,Gt=M.border,We=Wt.show?Wt.size:0,je=cn(We*be),vn=cn((M.alignTo==2?M._size-We-M.gap:M.gap)*be),Le=M._rotate*-tl/180,Ke=m(M._pos*be),Yn=(je+vn)*ct,Dn=Ke+Yn;q=I==0?Dn:0,B=I==1?Dn:0;let si=M.font[0],xi=M.align==1?jr:M.align==2?Ec:Le>0?jr:Le<0?Ec:I==0?"center":C==3?Ec:jr,Ii=Le||I==1?"middle":C==2?Oa:rd;Me(si,it,xi,Ii);let qn=M.font[1]*M.lineGap,ri=Ee.map(Ln=>m(o(Ln,Pt,Ft,Zt))),vi=M._values;for(let Ln=0;Ln<vi.length;Ln++){let jn=vi[Ln];if(jn!=null){I==0?B=ri[Ln]:q=ri[Ln],jn=""+jn;let Xs=jn.indexOf(`
`)==-1?[jn]:jn.split(/\n/gm);for(let In=0;In<Xs.length;In++){let Vh=Xs[In];Le?(u.save(),u.translate(B,q+In*qn),u.rotate(Le),u.fillText(Vh,0,0),u.restore()):u.fillText(Vh,B,q+In*qn)}}}Wt.show&&on(ri,Wt.filter(i,ge,g,Rt,oe),I,C,Ke,je,Oe(Wt.width*be,3),Wt.stroke(i,g),Wt.dash,Wt.cap);let Ui=M.grid;Ui.show&&on(ri,Ui.filter(i,ge,g,Rt,oe),I,I==0?2:1,I==0?ot:Bt,I==0?At:pt,Oe(Ui.width*be,3),Ui.stroke(i,g),Ui.dash,Ui.cap),Gt.show&&on([Ke],[1],I==0?1:0,I==0?1:2,I==1?ot:Bt,I==1?At:pt,Oe(Gt.width*be,3),Gt.stroke(i,g),Gt.dash,Gt.cap)}xn("drawAxes")}function vr(g){b.forEach((M,C)=>{C>0&&(M._paths=null,g&&(s==1?(M.min=null,M.max=null):M.facets.forEach(I=>{I.min=null,I.max=null})))})}let mo=!1,Il=!1,Ma=[];function Rm(){Il=!1;for(let g=0;g<Ma.length;g++)xn(...Ma[g]);Ma.length=0}function Mr(){mo||(by(Th),mo=!0)}function Cm(g,M=!1){mo=!0,Il=M,g(i),Th(),M&&Ma.length>0&&queueMicrotask(Rm)}i.batch=Cm;function Th(){if(Ot&&(Ae(),Ot=!1),Kt&&(vt(),Kt=!1),xt){if(Ye(p,jr,Z),Ye(p,Oa,nt),Ye(p,qa,x),Ye(p,ja,U),Ye(v,jr,Z),Ye(v,Oa,nt),Ye(v,qa,x),Ye(v,ja,U),Ye(f,qa,Dt),Ye(f,ja,P),h.width=cn(Dt*be),h.height=cn(P*be),R.forEach(({_el:g,_show:M,_size:C,_pos:I,side:B})=>{if(g!=null)if(M){let q=B===3||B===0?C:0,it=B%2==1;Ye(g,it?"left":"top",I-q),Ye(g,it?"width":"height",C),Ye(g,it?"top":"left",it?nt:Z),Ye(g,it?"height":"width",it?U:x),Ou(g,rr)}else Zn(g,rr)}),J=$=Y=Ct=Et=It=zt=Vt=Mt=null,Ut=1,Ea(!0),Z!=tt||nt!=Nt||x!=mt||U!=Lt){vr(!1);let g=x/mt,M=U/Lt;if(ne&&!O&&ht.left>=0){ht.left*=g,ht.top*=M,Sr&&Fi(Sr,cn(ht.left),0,x,U),yr&&Fi(yr,0,cn(ht.top),x,U);for(let C=0;C<On.length;C++){let I=On[C];I!=null&&(Ki[C]*=g,$i[C]*=M,Fi(I,ci(Ki[C]),ci($i[C]),x,U))}}if(Ve.show&&!yt&&Ve.left>=0&&Ve.width>0){Ve.left*=g,Ve.width*=g,Ve.top*=M,Ve.height*=M;for(let C in zl)Ye(Tr,C,Ve[C])}tt=Z,Nt=nt,mt=x,Lt=U}xn("setSize"),xt=!1}Dt>0&&P>0&&(u.clearRect(0,0,h.width,h.height),xn("drawClear"),k.forEach(g=>g()),xn("draw")),Ve.show&&yt&&(go(Ve),yt=!1),ne&&O&&(Ws(null,!0,!1),O=!1),St.show&&St.live&&lt&&(Ol(),lt=!1),l||(l=!0,i.status=1,xn("ready")),Hs=!1,mo=!1}i.redraw=(g,M)=>{Kt=M||!1,g!==!1?Ss(A,L.min,L.max):Mr()};function Ul(g,M){let C=w[g];if(C.from==null){if(rn==0){let I=C.range(i,M.min,M.max,g);M.min=I[0],M.max=I[1]}if(M.min>M.max){let I=M.min;M.min=M.max,M.max=I}if(rn>1&&M.min!=null&&M.max!=null&&M.max-M.min<1e-16)return;g==A&&C.distr==2&&rn>0&&(M.min=bi(M.min,t[0]),M.max=bi(M.max,t[0]),M.min==M.max&&M.max++),V[g]=M,Ot=!0,Mr()}}i.setScale=Ul;let Nl,Fl,Sr,yr,Ah,wh,Er,br,Rh,Ch,He,qe,Ms=!1;const yn=ht.drag;let gn=yn.x,_n=yn.y;ne&&(ht.x&&(Nl=oi(jS,v)),ht.y&&(Fl=oi(KS,v)),L.ori==0?(Sr=Nl,yr=Fl):(Sr=Fl,yr=Nl),He=ht.left,qe=ht.top);const Ve=i.select=nn({show:!0,over:!0,left:0,width:0,top:0,height:0},n.select),Tr=Ve.show?oi(qS,Ve.over?v:p):null;function go(g,M){if(Ve.show){for(let C in g)Ve[C]=g[C],C in zl&&Ye(Tr,C,g[C]);M!==!1&&xn("setSelect")}}i.setSelect=go;function Pm(g){if(b[g].show)Qt&&Ou(_t[g],rr);else if(Qt&&Zn(_t[g],rr),ne){let C=Ri?On[0]:On[g];C!=null&&Fi(C,-10,-10,x,U)}}function Ss(g,M,C){Ul(g,{min:M,max:C})}function Di(g,M,C,I){M.focus!=null&&Nm(g),M.show!=null&&b.forEach((B,q)=>{q>0&&(g==q||g==null)&&(B.show=M.show,Pm(q),s==2?(Ss(B.facets[0].scale,null,null),Ss(B.facets[1].scale,null,null)):Ss(B.scale,null,null),Mr())}),C!==!1&&xn("setSeries",g,M),I&&ba("setSeries",i,g,M)}i.setSeries=Di;function Dm(g,M){nn(D[g],M)}function Lm(g,M){g.fill=ce(g.fill||null),g.dir=xe(g.dir,-1),M=M??D.length,D.splice(M,0,g)}function Im(g){g==null?D.length=0:D.splice(g,1)}i.addBand=Lm,i.setBand=Dm,i.delBand=Im;function Um(g,M){b[g].alpha=M,ne&&On[g]!=null&&(On[g].style.opacity=M),Qt&&_t[g]&&(_t[g].style.opacity=M)}let Qi,ys,Vs;const Ar={focus:!0};function Nm(g){if(g!=Vs){let M=g==null,C=ni.alpha!=1;b.forEach((I,B)=>{if(s==1||B>0){let q=M||B==0||B==g;I._focus=M?null:q,C&&Um(B,q?1:ni.alpha)}}),Vs=g,C&&Mr()}}Qt&&ji&&jt(cd,et,g=>{ht._lock||(mn(g),Vs!=null&&Di(null,Ar,!0,tn.setSeries))});function Li(g,M,C){let I=w[M];C&&(g=g/be-(I.ori==1?nt:Z));let B=x;I.ori==1&&(B=U,g=B-g),I.dir==-1&&(g=B-g);let q=I._min,it=I._max,ct=g/B,gt=q+(it-q)*ct,Rt=I.distr;return Rt==3?ua(10,gt):Rt==4?fy(gt,I.asinh):Rt==100?I.bwd(gt):gt}function Fm(g,M){let C=Li(g,A,M);return bi(C,t[0],Je,Qe)}i.valToIdx=g=>bi(g,t[0]),i.posToIdx=Fm,i.posToVal=Li,i.valToPos=(g,M,C)=>w[M].ori==0?r(g,w[M],C?pt:x,C?Bt:0):a(g,w[M],C?At:U,C?ot:0),i.setCursor=(g,M,C)=>{He=g.left,qe=g.top,Ws(null,M,C)};function Ph(g,M){Ye(Tr,jr,Ve.left=g),Ye(Tr,qa,Ve.width=M)}function Dh(g,M){Ye(Tr,Oa,Ve.top=g),Ye(Tr,ja,Ve.height=M)}let Sa=L.ori==0?Ph:Dh,ya=L.ori==1?Ph:Dh;function Om(){if(Qt&&St.live)for(let g=s==2?1:0;g<b.length;g++){if(g==0&&Yt)continue;let M=St.values[g],C=0;for(let I in M)te[g][C++].firstChild.nodeValue=M[I]}}function Ol(g,M){if(g!=null&&(g.idxs?g.idxs.forEach((C,I)=>{ut[I]=C}):gy(g.idx)||ut.fill(g.idx),St.idx=ut[0]),Qt&&St.live){for(let C=0;C<b.length;C++)(C>0||s==1&&!Yt)&&Bm(C,ut[C]);Om()}lt=!1,M!==!1&&xn("setLegend")}i.setLegend=Ol;function Bm(g,M){let C=b[g],I=g==0&&W==2?Xn:t[g],B;Yt?B=C.values(i,g,M)??ae:(B=C.value(i,M==null?null:I[M],g,M),B=B==null?ae:{_:B}),St.values[g]=B}function Ws(g,M,C){Rh=He,Ch=qe,[He,qe]=ht.move(i,He,qe),ht.left=He,ht.top=qe,ne&&(Sr&&Fi(Sr,cn(He),0,x,U),yr&&Fi(yr,0,cn(qe),x,U));let I,B=Je>Qe;Qi=Fe,ys=null;let q=L.ori==0?x:U,it=L.ori==1?x:U;if(He<0||rn==0||B){I=ht.idx=null;for(let ct=0;ct<b.length;ct++){let gt=On[ct];gt!=null&&Fi(gt,-10,-10,x,U)}ji&&Di(null,Ar,!0,g==null&&tn.setSeries),St.live&&(ut.fill(I),lt=!0)}else{let ct,gt,Rt;s==1&&(ct=L.ori==0?He:qe,gt=Li(ct,A),I=ht.idx=bi(gt,t[0],Je,Qe),Rt=z(t[0][I],L,q,0));let Pt=-10,Ft=-10,Zt=0,Ee=0,ge=!0,oe="",Wt="";for(let Gt=s==2?1:0;Gt<b.length;Gt++){let We=b[Gt],je=ut[Gt],vn=je==null?null:s==1?t[Gt][je]:t[Gt][1][je],Le=ht.dataIdx(i,Gt,I,gt),Ke=Le==null?null:s==1?t[Gt][Le]:t[Gt][1][Le];if(lt=lt||Ke!=vn||Le!=je,ut[Gt]=Le,Gt>0&&We.show){let Yn=Le==null?-10:Le==I?Rt:z(s==1?t[0][Le]:t[Gt][0][Le],L,q,0),Dn=Ke==null?-10:K(Ke,s==1?w[We.scale]:w[We.facets[1].scale],it,0);if(ji&&Ke!=null){let si=L.ori==1?He:qe,xi=un(ni.dist(i,Gt,Le,Dn,si));if(xi<Qi){let Ii=ni.bias;if(Ii!=0){let qn=Li(si,We.scale),ri=Ke>=0?1:-1,vi=qn>=0?1:-1;vi==ri&&(vi==1?Ii==1?Ke>=qn:Ke<=qn:Ii==1?Ke<=qn:Ke>=qn)&&(Qi=xi,ys=Gt)}else Qi=xi,ys=Gt}}if(lt||Ri){let si,xi;L.ori==0?(si=Yn,xi=Dn):(si=Dn,xi=Yn);let Ii,qn,ri,vi,Ui,Ln,jn=!0,Xs=ze.bbox;if(Xs!=null){jn=!1;let In=Xs(i,Gt);ri=In.left,vi=In.top,Ii=In.width,qn=In.height}else ri=si,vi=xi,Ii=qn=ze.size(i,Gt);if(Ln=ze.fill(i,Gt),Ui=ze.stroke(i,Gt),Ri)Gt==ys&&Qi<=ni.prox&&(Pt=ri,Ft=vi,Zt=Ii,Ee=qn,ge=jn,oe=Ln,Wt=Ui);else{let In=On[Gt];In!=null&&(Ki[Gt]=ri,$i[Gt]=vi,gd(In,Ii,qn,jn),pd(In,Ln,Ui),Fi(In,ci(ri),ci(vi),x,U))}}}}if(Ri){let Gt=ni.prox,We=Vs==null?Qi<=Gt:Qi>Gt||ys!=Vs;if(lt||We){let je=On[0];je!=null&&(Ki[0]=Pt,$i[0]=Ft,gd(je,Zt,Ee,ge),pd(je,oe,Wt),Fi(je,ci(Pt),ci(Ft),x,U))}}}if(Ve.show&&Ms)if(g!=null){let[ct,gt]=tn.scales,[Rt,Pt]=tn.match,[Ft,Zt]=g.cursor.sync.scales,Ee=g.cursor.drag;if(gn=Ee._x,_n=Ee._y,gn||_n){let{left:ge,top:oe,width:Wt,height:Gt}=g.select,We=g.scales[Ft].ori,je=g.posToVal,vn,Le,Ke,Yn,Dn,si=ct!=null&&Rt(ct,Ft),xi=gt!=null&&Pt(gt,Zt);si&&gn?(We==0?(vn=ge,Le=Wt):(vn=oe,Le=Gt),Ke=w[ct],Yn=z(je(vn,Ft),Ke,q,0),Dn=z(je(vn+Le,Ft),Ke,q,0),Sa(Ai(Yn,Dn),un(Dn-Yn))):Sa(0,q),xi&&_n?(We==1?(vn=ge,Le=Wt):(vn=oe,Le=Gt),Ke=w[gt],Yn=K(je(vn,Zt),Ke,it,0),Dn=K(je(vn+Le,Zt),Ke,it,0),ya(Ai(Yn,Dn),un(Dn-Yn))):ya(0,it)}else Gl()}else{let ct=un(Rh-Ah),gt=un(Ch-wh);if(L.ori==1){let Zt=ct;ct=gt,gt=Zt}gn=yn.x&&ct>=yn.dist,_n=yn.y&&gt>=yn.dist;let Rt=yn.uni;Rt!=null?gn&&_n&&(gn=ct>=Rt,_n=gt>=Rt,!gn&&!_n&&(gt>ct?_n=!0:gn=!0)):yn.x&&yn.y&&(gn||_n)&&(gn=_n=!0);let Pt,Ft;gn&&(L.ori==0?(Pt=Er,Ft=He):(Pt=br,Ft=qe),Sa(Ai(Pt,Ft),un(Ft-Pt)),_n||ya(0,it)),_n&&(L.ori==1?(Pt=Er,Ft=He):(Pt=br,Ft=qe),ya(Ai(Pt,Ft),un(Ft-Pt)),gn||Sa(0,q)),!gn&&!_n&&(Sa(0,0),ya(0,0))}if(yn._x=gn,yn._y=_n,g==null){if(C){if(Hh!=null){let[ct,gt]=tn.scales;tn.values[0]=ct!=null?Li(L.ori==0?He:qe,ct):null,tn.values[1]=gt!=null?Li(L.ori==1?He:qe,gt):null}ba(bc,i,He,qe,x,U,I)}if(ji){let ct=C&&tn.setSeries,gt=ni.prox;Vs==null?Qi<=gt&&Di(ys,Ar,!0,ct):Qi>gt?Di(null,Ar,!0,ct):ys!=Vs&&Di(ys,Ar,!0,ct)}}lt&&(St.idx=I,Ol()),M!==!1&&xn("setCursor")}let Es=null;Object.defineProperty(i,"rect",{get(){return Es==null&&Ea(!1),Es}});function Ea(g=!1){g?Es=null:(Es=v.getBoundingClientRect(),xn("syncRect",Es))}function Lh(g,M,C,I,B,q,it){ht._lock||Ms&&g!=null&&g.movementX==0&&g.movementY==0||(Bl(g,M,C,I,B,q,it,!1,g!=null),g!=null?Ws(null,!0,!0):Ws(M,!0,!1))}function Bl(g,M,C,I,B,q,it,ct,gt){if(Es==null&&Ea(!1),mn(g),g!=null)C=g.clientX-Es.left,I=g.clientY-Es.top;else{if(C<0||I<0){He=-10,qe=-10;return}let[Rt,Pt]=tn.scales,Ft=M.cursor.sync,[Zt,Ee]=Ft.values,[ge,oe]=Ft.scales,[Wt,Gt]=tn.match,We=M.axes[0].side%2==1,je=L.ori==0?x:U,vn=L.ori==1?x:U,Le=We?q:B,Ke=We?B:q,Yn=We?I:C,Dn=We?C:I;if(ge!=null?C=Wt(Rt,ge)?o(Zt,w[Rt],je,0):-10:C=je*(Yn/Le),oe!=null?I=Gt(Pt,oe)?o(Ee,w[Pt],vn,0):-10:I=vn*(Dn/Ke),L.ori==1){let si=C;C=I,I=si}}gt&&(M==null||M.cursor.event.type==bc)&&((C<=1||C>=x-1)&&(C=Qs(C,x)),(I<=1||I>=U-1)&&(I=Qs(I,U))),ct?(Ah=C,wh=I,[Er,br]=ht.move(i,C,I)):(He=C,qe=I)}const zl={width:0,height:0,left:0,top:0};function Gl(){go(zl,!1)}let Ih,Uh,Nh,Fh;function Oh(g,M,C,I,B,q,it){Ms=!0,gn=_n=yn._x=yn._y=!1,Bl(g,M,C,I,B,q,it,!0,!1),g!=null&&(jt(Tc,Nu,Bh,!1),ba(od,i,Er,br,x,U,null));let{left:ct,top:gt,width:Rt,height:Pt}=Ve;Ih=ct,Uh=gt,Nh=Rt,Fh=Pt}function Bh(g,M,C,I,B,q,it){Ms=yn._x=yn._y=!1,Bl(g,M,C,I,B,q,it,!1,!0);let{left:ct,top:gt,width:Rt,height:Pt}=Ve,Ft=Rt>0||Pt>0,Zt=Ih!=ct||Uh!=gt||Nh!=Rt||Fh!=Pt;if(Ft&&Zt&&go(Ve),yn.setScale&&Ft&&Zt){let Ee=ct,ge=Rt,oe=gt,Wt=Pt;if(L.ori==1&&(Ee=gt,ge=Pt,oe=ct,Wt=Rt),gn&&Ss(A,Li(Ee,A),Li(Ee+ge,A)),_n)for(let Gt in w){let We=w[Gt];Gt!=A&&We.from==null&&We.min!=Fe&&Ss(Gt,Li(oe+Wt,Gt),Li(oe,Gt))}Gl()}else ht.lock&&(ht._lock=!ht._lock,Ws(M,!0,g!=null));g!=null&&(pe(Tc,Nu),ba(Tc,i,He,qe,x,U,null))}function zm(g,M,C,I,B,q,it){if(ht._lock)return;mn(g);let ct=Ms;if(Ms){let gt=!0,Rt=!0,Pt=10,Ft,Zt;L.ori==0?(Ft=gn,Zt=_n):(Ft=_n,Zt=gn),Ft&&Zt&&(gt=He<=Pt||He>=x-Pt,Rt=qe<=Pt||qe>=U-Pt),Ft&&gt&&(He=He<Er?0:x),Zt&&Rt&&(qe=qe<br?0:U),Ws(null,!0,!0),Ms=!1}He=-10,qe=-10,ut.fill(null),Ws(null,!0,!0),ct&&(Ms=ct)}function zh(g,M,C,I,B,q,it){ht._lock||(mn(g),H(),Gl(),g!=null&&ba(ud,i,He,qe,x,U,null))}function Gh(){R.forEach(LE),wt(i.width,i.height,!0)}hr(fl,ea,Gh);const wr={};wr.mousedown=Oh,wr.mousemove=Lh,wr.mouseup=Bh,wr.dblclick=zh,wr.setSeries=(g,M,C,I)=>{let B=tn.match[2];C=B(i,M,C),C!=-1&&Di(C,I,!0,!1)},ne&&(jt(od,v,Oh),jt(bc,v,Lh),jt(ld,v,g=>{mn(g),Ea(!1)}),jt(cd,v,zm),jt(ud,v,zh),Vu.add(i),i.syncRect=Ea);const _o=i.hooks=n.hooks||{};function xn(g,M,C){Il?Ma.push([g,M,C]):g in _o&&_o[g].forEach(I=>{I.call(null,i,M,C)})}(n.plugins||[]).forEach(g=>{for(let M in g.hooks)_o[M]=(_o[M]||[]).concat(g.hooks[M])});const kh=(g,M,C)=>C,tn=nn({key:null,setSeries:!1,filters:{pub:Sd,sub:Sd},scales:[A,b[1]?b[1].scale:null],match:[yd,yd,kh],values:[null,null]},ht.sync);tn.match.length==2&&tn.match.push(kh),ht.sync=tn;const Hh=tn.key,kl=dm(Hh);function ba(g,M,C,I,B,q,it){tn.filters.pub(g,M,C,I,B,q,it)&&kl.pub(g,M,C,I,B,q,it)}kl.sub(i);function Gm(g,M,C,I,B,q,it){tn.filters.sub(g,M,C,I,B,q,it)&&wr[g](null,M,C,I,B,q,it)}i.pub=Gm;function km(){kl.unsub(i),Vu.delete(i),Pe.clear(),Bu(fl,ea,Gh),c.remove(),et?.remove(),xn("destroy")}i.destroy=km;function Hl(){xn("init",n,t),E(t||n.data,!1),V[A]?Ul(A,V[A]):H(),yt=Ve.show&&(Ve.width>0||Ve.height>0),O=lt=!0,wt(n.width,n.height)}return b.forEach(_r),R.forEach(po),e?e instanceof HTMLElement?(e.appendChild(c),Hl()):e(i,Hl):Hl(),i}hn.assign=nn;hn.fmtNum=gh;hn.rangeNum=dl;hn.rangeLog=Tl;hn.rangeAsinh=ph;hn.orient=gr;hn.pxRatio=be;hn.join=Ey;hn.fmtDate=xh,hn.tzDate=Uy;hn.sync=dm;{hn.addGap=gE,hn.clipGaps=Rl;let n=hn.paths={points:vm};n.linear=Sm,n.stepped=vE,n.bars=ME,n.spline=yE}function ml(n){const t=Math.abs(n);return t>=1e9?(n/1e9).toFixed(1).replace(/\.0$/,"")+"B":t>=1e6?(n/1e6).toFixed(1).replace(/\.0$/,"")+"M":t>=1e3?(n/1e3).toFixed(1).replace(/\.0$/,"")+"K":t<1&&t>0?n.toFixed(4):n.toFixed(0)}let Bs=null,zs=null,Gs=null,ks=null,os=[[],[],[],[],[]],lr=[[],[],[]],na=[[],[]],cr=[[],[],[],[]];function Tm(n){const t=[n[0],[],[],[],n[4]];for(let e=0;e<n[0].length;e++){const i=n[1][e]||0,s=n[2][e]||0,r=n[3][e]||0;t[1][e]=i,t[2][e]=i+s,t[3][e]=i+s+r}return t}function IE(n){const t={width:n.clientWidth||300,height:150,scales:{x:{time:!1},y:{auto:!0},pop:{auto:!0}},legend:{show:!0,live:!0},axes:[{show:!0,size:16,font:"10px sans-serif",gap:4,ticks:{show:!1}},{scale:"y",size:32,font:"10px sans-serif",side:3,gap:2,ticks:{show:!1},values:(e,i)=>i.map(ml)},{scale:"pop",size:32,font:"10px sans-serif",side:1,gap:2,ticks:{show:!1},values:(e,i)=>i.map(ml)}],series:[{},{label:"Red",stroke:"rgb(200, 0, 0)",fill:"rgba(255, 80, 80, 0.8)",scale:"y",width:1,points:{show:!1}},{label:"Green",stroke:"rgb(0, 180, 0)",scale:"y",width:1,points:{show:!1}},{label:"Blue",stroke:"rgb(0, 0, 200)",scale:"y",width:1,points:{show:!1}},{label:"Pop",stroke:"rgb(50, 50, 50)",scale:"pop",width:2,points:{show:!1}}],bands:[{series:[2,1],fill:"rgba(80, 220, 80, 0.8)"},{series:[3,2],fill:"rgba(80, 80, 255, 0.8)"}]};return Bs=new hn(t,os,n),Bs}function UE(n){const t={width:n.clientWidth||300,height:150,scales:{x:{time:!1},desc:{auto:!0},eat:{auto:!0}},legend:{show:!0,live:!0},axes:[{show:!0,size:16,font:"10px sans-serif",gap:4,ticks:{show:!1}},{scale:"desc",size:32,font:"10px sans-serif",gap:2,ticks:{show:!1},side:3,values:(e,i)=>i.map(ml)},{scale:"eat",size:32,font:"10px sans-serif",gap:2,ticks:{show:!1},side:1,values:(e,i)=>i}],series:[{},{label:"Avg Children",stroke:"rgb(50, 50, 50)",scale:"desc",width:1,points:{show:!1}},{label:"R Eat Efficiency",stroke:"rgb(0, 196, 0)",scale:"eat",width:1,points:{show:!1}}]};return zs=new hn(t,lr,n),zs}function NE(n){const t={width:n.clientWidth||300,height:150,scales:{x:{time:!1},life:{auto:!0}},legend:{show:!0,live:!0},axes:[{show:!0,size:16,font:"10px sans-serif",gap:4,ticks:{show:!1}},{scale:"life",size:32,font:"10px sans-serif",gap:2,ticks:{show:!1},side:3,values:(e,i)=>i.map(ml)}],series:[{},{label:"Avg Lifespan",stroke:"rgb(196, 0, 196)",scale:"life",width:1,points:{show:!1}}]};return Gs=new hn(t,na,n),Gs}function FE(n){const t={width:n.clientWidth||300,height:150,scales:{x:{time:!1},y:{auto:!0}},legend:{show:!0,live:!0},axes:[{show:!0,size:16,font:"10px sans-serif",gap:4,ticks:{show:!1}},{scale:"y",size:32,font:"10px sans-serif",gap:2,ticks:{show:!1},side:3,values:(e,i)=>i.map(s=>s.toFixed(2))}],series:[{},{label:"Adv Weight",stroke:"rgb(60, 180, 60)",scale:"y",width:1,points:{show:!1}},{label:"Dis Weight",stroke:"rgb(220, 60, 60)",scale:"y",width:1,points:{show:!1}}]};return ks=new hn(t,cr,n),ks}function OE(){os=[[],[],[],[],[]],lr=[[],[],[]],na=[[],[]],cr=[[],[],[],[]],Bs&&Bs.setData(Tm(os)),zs&&zs.setData(lr),Gs&&Gs.setData(na),ks&&ks.setData(cr)}function Wd(){const n=document.getElementById("foodPopChart"),t=document.getElementById("optimizationChart"),e=document.getElementById("lifespanChart"),i=document.getElementById("mutationStratChart");Bs&&n&&Bs.setSize({width:n.clientWidth,height:150}),zs&&t&&zs.setSize({width:t.clientWidth,height:150}),Gs&&e&&Gs.setSize({width:e.clientWidth,height:150}),ks&&i&&ks.setSize({width:i.clientWidth,height:150})}const BE={update(){_.history.aveLifespan.push(_.stats.aveLifespan),_.history.avePosNRG.push(_.stats.avePosNRG);let n=0,t=0;if(_.stats.livePop!==0){for(let o=0;o<=_.HIGHESTINDEX;o++){const l=_.amoebs[o];l.status==="alive"&&(_.stats.netEatenRatio+=(l.redEaten+l.greenEaten+l.blueEaten)/l.netEaten,n+=l.descendants,t+=l.children.length)}_.stats.netEatenRatio/=_.stats.livePop}else _.stats.netEatenRatio=0;_.stats.aveChildren=_.stats.livePop>0?t/_.stats.livePop:0,_.history.aveChildren.push(_.stats.aveChildren),_.stats.aveChildren>_.stats.maxAveChildren&&(_.stats.maxAveChildren=_.stats.aveChildren);let e=0;for(let o=0;o<Zr;o++)_.pause||(_.stats.redAgarOnMap+=_.tiles[o].R,_.stats.greenAgarOnMap+=_.tiles[o].G,_.stats.blueAgarOnMap+=_.tiles[o].B,e+=_.tiles[o].RCap+_.tiles[o].GCap+_.tiles[o].BCap);const i=_.stats.time/100;os[0].push(i),os[1].push(_.stats.redAgarOnMap),os[2].push(_.stats.greenAgarOnMap),os[3].push(_.stats.blueAgarOnMap),os[4].push(_.stats.livePop),Bs&&Bs.setData(Tm(os)),_.stats.deathCount>0&&(_.stats.aveLifespan=_.stats.netLifespan/_.stats.deathCount);const s=_.stats.redAgarOnMap+_.stats.greenAgarOnMap+_.stats.blueAgarOnMap,r=e>0?s/e:1,a=r>0?_.stats.netEatenRatio/r:0;lr[0].push(i),lr[1].push(_.stats.aveChildren),lr[2].push(a),zs&&zs.setData(lr),na[0].push(i),na[1].push(_.stats.aveLifespan),Gs&&Gs.setData(na),_.stats.livePop,cr[0].push(i),cr[1].push(_.stats.mitoses>0?_.stats.advWeight/_.stats.mitoses:0),cr[2].push(_.stats.mitoses>0?_.stats.disWeight/_.stats.mitoses:0),ks&&ks.setData(cr),_.stats.netEatenRatio=0,_.stats.redAgarOnMap=0,_.stats.greenAgarOnMap=0,_.stats.blueAgarOnMap=0,_.stats.mitoses=0,_.stats.advWeight=0,_.stats.disWeight=0,_.stats.aveLifespan>_.stats.maxAveLifespan&&(_.stats.maxAveLifespan=_.stats.aveLifespan),_.stats.avePosNRG>_.stats.maxAvePosNRG&&(_.stats.maxAvePosNRG=_.stats.avePosNRG)}};let Xu=null;function zE(){Xu=document.getElementById("dash-live-info")}const GE={update(){const n=_.ctx.map;if(n){if(_.mouse.overMap)if(_.mouse.rightPressed){if(_.stats.livePop<Ja){let t=0;for(;_.amoebs[t]!=null&&_.amoebs[t].status!=="dead";)t++;_.amoebs[t]=new uo(ue(_.mouse.x),ue(_.mouse.y),t),_.newest=t,_.stats.livePop++,t>_.HIGHESTINDEX&&(_.HIGHESTINDEX=t),Xu&&(Xu.innerHTML="LIVE: "+_.stats.livePop+"     DEAD: "+_.graveyard.length)}_.mouse.rightPressed=!1}else if(_.mouse.leftPressed){if(!_.canvas.dragging)_.canvas.dragging=!0;else{const t=_.mouse.x-_.mouse.prevX,e=_.mouse.y-_.mouse.prevY;n.translate(t,e),_.canvas.dragOffsetX+=t*_.canvas.scale,_.canvas.dragOffsetY+=e*_.canvas.scale}_.mouse.prevX=_.mouse.x,_.mouse.prevY=_.mouse.y}else _.canvas.dragging&&(_.canvas.dragging=!1,_.mouse.originalX+=_.canvas.dragOffsetX,_.mouse.originalY+=_.canvas.dragOffsetY,_.mouse.x+=_.canvas.dragOffsetX,_.mouse.y+=_.canvas.dragOffsetY,_.canvas.dragOffsetX=0,_.canvas.dragOffsetY=0);for(const t in _.keysPressed)(t==="a"||t==="ArrowLeft")&&_.keysPressed[t]&&(_.leftAccel+=2,_.mouse.x-=_.leftAccel,_.mouse.originalX+=_.leftAccel*_.canvas.scale,n.translate(_.leftAccel,0)),(t==="w"||t==="ArrowUp")&&_.keysPressed[t]&&(_.upAccel+=2,_.mouse.y-=_.upAccel,_.mouse.originalY+=_.upAccel*_.canvas.scale,n.translate(0,_.upAccel)),(t==="s"||t==="ArrowDown")&&_.keysPressed[t]&&(_.downAccel+=2,_.mouse.y+=_.downAccel,_.mouse.originalY-=_.downAccel*_.canvas.scale,n.translate(0,-_.downAccel)),(t==="d"||t==="ArrowRight")&&_.keysPressed[t]&&(_.rightAccel+=2,_.mouse.x+=_.rightAccel,_.mouse.originalX-=_.rightAccel*_.canvas.scale,n.translate(-_.rightAccel,0))}}};function kE(n,t){const e=t.getBoundingClientRect();let i=n.clientX/e.right*t.width,s=n.clientY/e.bottom*t.height;return i-=_.mouse.originalX,s-=_.mouse.originalY,i/=_.canvas.scale,s/=_.canvas.scale,{x:i,y:s}}function za(n,t,e){const i=kE(t,e);_.mouse.x=i.x,_.mouse.y=i.y,n==="down"&&(t.button===0?_.mouse.leftPressed=!0:t.button===2&&(_.mouse.rightPressed=!0)),(n==="up"||n==="out")&&(t.button===0?_.mouse.leftPressed=!1:t.button===2&&(_.mouse.rightPressed=!1))}function HE(n,t){n.preventDefault();const e=_.ctx.map;if(!e)return;let i=n.wheelDelta||-n.deltaY;i>20?i=20:i<-20&&(i=-20);const s=1+i/400;_.mouse.originalX+=(_.mouse.x-_.mouse.x*s)*_.canvas.scale,_.mouse.originalY+=(_.mouse.y-_.mouse.y*s)*_.canvas.scale,e.translate(_.mouse.x,_.mouse.y),e.scale(s,s),e.translate(-_.mouse.x,-_.mouse.y);const r=t.getBoundingClientRect();let a=(n.clientX-r.left)/(r.right-r.left)*t.width,o=(n.clientY-r.top)/(r.bottom-r.top)*t.height;a-=_.mouse.originalX,o-=_.mouse.originalY,_.canvas.scale*=s,_.mouse.x=a/_.canvas.scale,_.mouse.y=o/_.canvas.scale}function VE(n,t){["w","a","s","d","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","Escape"].includes(n.key)&&(n.preventDefault(),_.keysPressed[n.key]=!0,n.key===" "&&t(),n.key==="Escape"&&(_.tracking=null))}function WE(n){["w","a","s","d","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","Escape"].includes(n.key)&&(n.preventDefault(),_.keysPressed[n.key]=!1,n.key==="a"||n.key==="ArrowLeft"?_.leftAccel=0:n.key==="w"||n.key==="ArrowUp"?_.upAccel=0:n.key==="s"||n.key==="ArrowDown"?_.downAccel=0:(n.key==="d"||n.key==="ArrowRight")&&(_.rightAccel=0))}let el=null,Yu=null;function XE(){el=document.getElementById("dash-newest"),Yu=document.getElementById("dash-time")}const YE={setup(){},update(){if(_.newest!==null&&el)if(_.newest<0){const n=_.graveyard[-(_.newest+1)];el.innerHTML="NEW: "+n.name+"-"+n.gen+"D"+n.descendants}else{const n=_.amoebs[_.newest];el.innerHTML="NEW: "+n.name+"-"+n.gen+"A"+n.descendants}Yu&&(Yu.innerHTML="TIME: "+_.stats.time),_.highlighted!==null&&(_.highlighted<0?_.graveyard[-(_.highlighted+1)].highlight():_.amoebs[_.highlighted].highlight())}};function qE(){_.accelerate=(_.accelerate+1)%13}let Xd=performance.now(),Pc=0,Yd=0,qu=null;function jE(n){qu=n}function KE(){Pc++;const n=performance.now(),t=n-Xd;t>=500&&(Yd=Pc/t*1e3,Pc=0,Xd=n,qu&&(qu.textContent=`${Yd|0} FPS`))}function qd(n){return{weights1:Array.from(n.weights1),weights2:Array.from(n.weights2),sigmas1:Array.from(n.sigmas1),sigmas2:Array.from(n.sigmas2),in:n.in,out:n.out}}function jd(n){const t=new Ga;return t.weights1=new Float32Array(n.weights1),t.weights2=new Float32Array(n.weights2),t.sigmas1=n.sigmas1?new Float32Array(n.sigmas1):new Float32Array(n.weights1.length).fill(0),t.sigmas2=n.sigmas2?new Float32Array(n.sigmas2):new Float32Array(n.weights2.length).fill(0),t.in=n.in,t.out=n.out,t}function $E(n){return{x:n.x,y:n.y,tile:n.tile,r:n.r,g:n.g,b:n.b,s:n.s,detected:n.detected}}function ZE(n){const t=new Dc(n.x,n.y);return t.tile=n.tile,t.r=n.r,t.g=n.g,t.b=n.b,t.s=n.s,t.detected=n.detected,t}function JE(n){return{x:n.x,y:n.y,tile:n.tile,r:n.r,g:n.g,b:n.b,s:n.s,detected:n.detected}}function QE(n){const t=new Lc(n.x,n.y);return t.tile=n.tile,t.r=n.r,t.g=n.g,t.b=n.b,t.s=n.s,t.detected=n.detected,t}function tb(n){return{x:n.x,y:n.y,num:n.num,neighbors:[...n.neighbors],regenRate:n.regenRate,RCap:n.RCap,GCap:n.GCap,BCap:n.BCap,R:n.R,G:n.G,B:n.B}}function eb(n){const t=new Jd(n.x,n.y,n.num,n.neighbors);return t.regenRate=n.regenRate,t.RCap=n.RCap,t.GCap=n.GCap,t.BCap=n.BCap,t.R=n.R,t.G=n.G,t.B=n.B,t}function Kd(n){return{index:n.index,x:n.x,y:n.y,status:n.status,tile:n.tile,size:n.size,health:n.health,gen:n.gen,birthTime:n.born,parent:n.parent,sibling_idx:n.sibling_idx,children:[...n.children],descendants:n.descendants,proGenes:n.proGenes,conGenes:n.conGenes,name:n.name,velocityX:n.velocityX,velocityY:n.velocityY,rotation:n.rotation,direction:n.direction,redEaten:n.redEaten,greenEaten:n.greenEaten,blueEaten:n.blueEaten,currEaten:n.currEaten,netEaten:n.netEaten,energy:n.energy,maxEnergy:n.maxEnergy,energyChange:n.energyChange,totalEnergyGain:n.totalEnergyGain,currDamage:n.currDamage,damageReceived:n.damageReceived,damageCaused:n.damageCaused,eyes:n.eyes.map($E),mouth:JE(n.mouth),inputs:n.inputs.map(qd),outputs:n.outputs.map(qd)}}function $d(n){const t=new uo(n.x,n.y,n.index);return t.status=n.status,t.tile=n.tile,t.size=n.size,t.health=n.health,t.gen=n.gen,t.born=n.birthTime,t.parent=n.parent,t.sibling_idx=n.sibling_idx,t.children=[...n.children],t.descendants=n.descendants,t.proGenes=n.proGenes,t.conGenes=n.conGenes,t.name=n.name,t.velocityX=n.velocityX,t.velocityY=n.velocityY,t.rotation=n.rotation,t.direction=n.direction,t.redEaten=n.redEaten,t.greenEaten=n.greenEaten,t.blueEaten=n.blueEaten,t.currEaten=n.currEaten,t.netEaten=n.netEaten,t.energy=n.energy,t.maxEnergy=n.maxEnergy,t.energyChange=n.energyChange,t.totalEnergyGain=n.totalEnergyGain,t.currDamage=n.currDamage,t.damageReceived=n.damageReceived,t.damageCaused=n.damageCaused,t.eyes=n.eyes.map(ZE),t.mouth=QE(n.mouth),t.inputs=n.inputs.map(jd),t.outputs=n.outputs.map(jd),t}function nb(){const n={version:1,timestamp:Date.now(),stats:{..._.stats},history:{aveChildren:[..._.history.aveChildren],aveLifespan:[..._.history.aveLifespan],avePosNRG:[..._.history.avePosNRG]},HIGHESTINDEX:_.HIGHESTINDEX,highlighted:_.highlighted,newest:_.newest,tiles:_.tiles.map(tb),amoebs:_.amoebs.map(t=>t?Kd(t):null),graveyard:_.graveyard.map(Kd)};return JSON.stringify(n)}function ib(n){const t=JSON.parse(n);t.version!==1&&console.warn(`Save version ${t.version} may not be compatible`),Object.assign(_.stats,t.stats),_.history.aveChildren=[...t.history.aveChildren],_.history.aveLifespan=[...t.history.aveLifespan],_.history.avePosNRG=[...t.history.avePosNRG],_.HIGHESTINDEX=t.HIGHESTINDEX,_.highlighted=t.highlighted,_.newest=t.newest;for(let e=0;e<t.tiles.length&&e<Zr;e++)_.tiles[e]=eb(t.tiles[e]);for(let e=0;e<t.amoebs.length;e++){const i=t.amoebs[e];_.amoebs[e]=i?$d(i):null}_.graveyard=t.graveyard.map($d),console.log(`Loaded save from ${new Date(t.timestamp).toLocaleString()}`)}function sb(n){const t=nb(),e=new Blob([t],{type:"application/json"}),i=URL.createObjectURL(e),s=document.createElement("a");s.href=i,s.download=n||`petri-save-${Date.now()}.json`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(i)}function rb(n){return new Promise((t,e)=>{const i=new FileReader;i.onload=s=>{try{const r=s.target?.result;ib(r),t()}catch(r){e(r)}},i.onerror=()=>e(i.error),i.readAsText(n)})}function ju(){const n=document.getElementById("map");if(!n){console.error("Map canvas not found");return}if(n.width=window.innerWidth,n.height=1e3,_.ctx.map=n.getContext("2d"),!_.ctx.map){console.error("Could not get map canvas context");return}const t=document.getElementById("brain3d-container");t&&TS(t),_.ctx.map.font="10px Arial",ab();const e=document.getElementById("fps-counter");e&&jE(e),IS(),FS(),zE(),XE(),ob(n),Ku.generate(),Am(),_.canvas.scale=3,_.ctx.map.scale(3,3)}function ab(){const n=document.getElementById("foodPopChart"),t=document.getElementById("optimizationChart"),e=document.getElementById("lifespanChart");n&&IE(n),t&&UE(t),e&&NE(e);const i=document.getElementById("mutationStratChart");i&&FE(i)}function ob(n){n.addEventListener("mouseover",t=>{za("over",t,n),_.mouse.overMap=!0}),n.addEventListener("mousemove",t=>za("move",t,n)),n.addEventListener("mousedown",t=>za("down",t,n)),n.addEventListener("mouseup",t=>za("up",t,n)),n.addEventListener("mouseout",t=>{za("out",t,n),_.mouse.overMap=!1}),n.addEventListener("wheel",t=>HE(t,n),{passive:!1}),document.addEventListener("keydown",t=>VE(t,wm)),document.addEventListener("keyup",t=>WE(t)),lb()}function lb(){const n=document.getElementById("dashboard"),t=document.getElementById("dashboard-resize-handle");if(!n||!t)return;let e=!1;t.addEventListener("mousedown",i=>{e=!0,t.classList.add("dragging"),i.preventDefault()}),document.addEventListener("mousemove",i=>{if(!e)return;const s=window.innerWidth-i.clientX,r=200,a=window.innerWidth*.8;s>=r&&s<=a&&(n.style.width=s+"px",Wd(),hl())}),document.addEventListener("mouseup",()=>{e&&(e=!1,t.classList.remove("dragging"),Wd(),hl())})}function Am(){KE(),Ku.update(),OS.update(),GE.update(),cb(),!_.pause&&_.stats.time%1e3===0&&BE.update(),YE.update(),_.pause||_.stats.time++,requestAnimationFrame(Am)}function cb(){if(_.tracking===null)return;const n=_.ctx.map;if(!n)return;_.highlighted&&_.highlighted>0&&_.tracking!==null&&(_.tracking=_.highlighted);const t=_.tracking>=0?_.amoebs[_.tracking]:_.graveyard[-(_.tracking+1)];if(!t||t.status!=="alive"){_.tracking=null;return}const e=n.canvas,i=e.width/2/_.canvas.scale,s=e.height/2/_.canvas.scale,r=i-t.x-_.mouse.originalX/_.canvas.scale,a=s-t.y-_.mouse.originalY/_.canvas.scale;n.translate(r,a),_.mouse.originalX+=r*_.canvas.scale,_.mouse.originalY+=a*_.canvas.scale}function wm(){if(_.pause){_.pause=!1;const n=document.getElementById("play-button");n&&(n.src="icons/play.png")}else{_.pause=!0;const n=document.getElementById("play-button");n&&(n.src="icons/pause.png")}}function ub(){_.highlighted=null,_.newest=null,_.scores=new Array(Zd),_.amoebs=new Array(Ja),_.graveyard=[];for(let t=0;t<100;t++)_.amoebs[t]=new uo(ue(Math.random()*ps),ue(Math.random()*ms),t);_.resetStats(),OE(),Ku.generate();const n=document.getElementById("dash-live-info");n&&(n.innerHTML="LIVE: "+_.stats.livePop+"     DEAD: "+_.graveyard.length)}function Ll(){const n=document.getElementById("amoeb-stats"),t=document.getElementById("brain3d-container"),e=document.getElementById("family-tree");n&&(n.style.display="block"),_.display==="brain"&&t?(t.style.display="block",hl(),e&&(e.style.display="none")):_.display==="family"&&e&&(e.style.display="block",t&&(t.style.display="none"),co(!0))}function hb(){_.highlighted=_.newest,Ll()}function fb(){_.highlighted=_.gold,Ll()}function db(){_.highlighted=_.silver,Ll()}function pb(){_.highlighted=_.bronze,Ll()}function mb(){console.log("SAVING..."),sb(`petri-save-${Date.now()}.json`)}function gb(){const n=document.createElement("input");n.type="file",n.accept=".json",n.onchange=async t=>{const e=t.target.files?.[0];if(e){console.log("LOADING...");try{await rb(e),console.log("Load complete!")}catch(i){console.error("Failed to load:",i)}}},n.click()}function _b(){if(_.highlighted===null)return;const n=document.getElementById("brain3d-container"),t=document.getElementById("family-tree");_.display==="brain"?(_.display="default",n&&(n.style.display="none"),LS()):(_.display="brain",n&&(n.style.display="block",hl()),t&&(t.style.display="none"))}function xb(){_.tracking!==null?_.tracking=null:_.highlighted!==null&&(_.tracking=_.highlighted)}function vb(){_.tracking=null}window.init=ju;window.newSimulation=ub;window.pauseSimulation=wm;window.accelerateMutations=qE;window.save=mb;window.load=gb;window.highlight_newest=hb;window.highlight_gold=fb;window.highlight_silver=db;window.highlight_bronze=pb;window.toggleBrainDisplay=_b;window.toggleFamilyDisplay=NS;window.toggleTracking=xb;window.stopTracking=vb;Object.defineProperty(window,"highlighted",{get:()=>_.highlighted,set:n=>{_.highlighted=n}});Object.defineProperty(window,"leftPressed",{get:()=>_.mouse.leftPressed,set:n=>{_.mouse.leftPressed=n}});Object.defineProperty(window,"graveyard",{get:()=>_.graveyard});Object.defineProperty(window,"amoebs",{get:()=>_.amoebs});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ju):ju();
