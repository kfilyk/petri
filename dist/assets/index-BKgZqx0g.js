(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Ii=1,qs=20,Jh=50,Qh=25,Rn=33,oe=42,Jm=Rn+oe,nh=.01,Qm=nh**2*Jm/6,tg=.1,tf=1e3,ps=1200,ms=1200,Gn=25,dr=ps/Gn*(ms/Gn),Qa=1e3,ap=3,yo=Math.PI*2,Ps=.0174533,Ra="ABCDEFGHIJKLMNOPQRSTUVWXYZ";class eg{tiles=new Array(dr);amoebs=new Array(Qa);graveyard=[];HIGHESTINDEX=-1;TILE_REGEN_RATE=.05;gold=null;silver=null;bronze=null;highlighted=null;following=null;newest=null;tracking=null;display="default";scoreType=0;pause=!1;accelerate=0;ctx={map:null,stats:null};mouse={x:0,y:0,originalX:0,originalY:0,prevX:0,prevY:0,overMap:!1,overConsole:!1,leftPressed:!1,rightPressed:!1};canvas={scale:1,dragOffsetX:0,dragOffsetY:0,dragging:!1};stats={time:0,livePop:0,netParents:0,aveChildren:0,avePosNRG:0,maxAveChildren:1,maxAvePosNRG:1,redAgarOnMap:0,greenAgarOnMap:0,blueAgarOnMap:0,advWeight:0,disWeight:0,mitoses:0,netEatenRatio:0};history={aveChildren:[],avePosNRG:[]};keysPressed={};leftAccel=0;rightAccel=0;upAccel=0;downAccel=0;requestId=0;scores=new Array(ap);neuronWeights={amoebIndex:null,neuronType:null,neuronIndex:null,lastParentDescendants:-1};resetStats(){this.stats.time=0,this.stats.aveChildren=0,this.stats.avePosNRG=0,this.stats.maxAveChildren=1,this.stats.maxAvePosNRG=1,this.stats.livePop=0,this.HIGHESTINDEX=0;for(let t=0;t<this.amoebs.length;t++){const e=this.amoebs[t];e!=null&&e.status==="alive"&&(this.stats.livePop++,this.HIGHESTINDEX=t)}this.history.aveChildren=[],this.history.avePosNRG=[]}}const _=new eg;function fe(i){return i+(i<0?-.5:.5)|0}function ng(i){let t="";for(let e=0;e<4;e++)t+=i.charAt(fe(Math.random()*25));return t}function Fc(i){return i>=0?_.amoebs[i]:_.graveyard[-(i+1)]}function op(i,t){const e=[],n=Fc(i);if(!n)return e;for(const s of n.children)e.push(...op(s,t));return i!==t&&e.push(i),e}function ig(i,t){const e=[],n=[],s=[],r=[];for(let a=0;a<Rn;a++){const o=[],l=[];for(let c=0;c<oe;c++)o[c]=i.inputs[a].weights1[c]-t.inputs[a].weights1[c],l[c]=i.inputs[a].weights2[c]-t.inputs[a].weights2[c];e.push(o),n.push(l)}for(let a=0;a<oe;a++){const o=[],l=[];for(let c=0;c<oe;c++)o[c]=i.outputs[a].weights1[c]-t.outputs[a].weights1[c],l[c]=i.outputs[a].weights2[c]-t.outputs[a].weights2[c];s.push(o),r.push(l)}return{in_weights1_deltas:e,in_weights2_deltas:n,out_weights1_deltas:s,out_weights2_deltas:r}}function lp(i){const t=[],e=[],n=op(i,i);for(let s=0;s<n.length;s++){const r=n[s],a=Fc(r);if(!a||a.parent===null)continue;const o=a.children.length>0,l=!o&&r<0;if(!o&&!l)continue;const c=Fc(a.parent);if(!c)continue;const h=ig(a,c);if(o)for(let u=0;u<a.children.length;u++)t.push(h);else e.push(h)}return{advantageous:t,disadvantageous:e}}function sg(i){let t=0;for(let e=0;e<Rn;e++)for(let n=0;n<oe;n++)t+=Math.abs(i.inputs[e].weights1[n])+Math.abs(i.inputs[e].weights2[n]);for(let e=0;e<oe;e++)for(let n=0;n<oe;n++)t+=Math.abs(i.outputs[e].weights1[n])+Math.abs(i.outputs[e].weights2[n]);return t}function rg(i,t){let e=0,n=0,s=0;for(let a=0;a<Rn;a++)for(let o=0;o<oe;o++){const l=i.inputs[a].weights1[o],c=t.inputs[a].weights1[o],h=i.inputs[a].weights2[o],u=t.inputs[a].weights2[o];e+=l*c+h*u,n+=l*l+h*h,s+=c*c+u*u}for(let a=0;a<oe;a++)for(let o=0;o<oe;o++){const l=i.outputs[a].weights1[o],c=t.outputs[a].weights1[o],h=i.outputs[a].weights2[o],u=t.outputs[a].weights2[o];e+=l*c+h*u,n+=l*l+h*h,s+=c*c+u*u}return(e/(Math.sqrt(n)*Math.sqrt(s)+1e-4)+1)/2*100}class Zo{weights1=new Float32Array(0);weights2=new Float32Array(0);in=0;out=0;sustain=0;init(t,e){this.weights1=new Float32Array(t).fill(0),this.weights2=new Float32Array(t).fill(0);for(let n=0;n<e;n++)this.weights1[n]=Math.random()+Math.random()-1,this.weights2[n]=Math.random()+Math.random()-1}tanh(){this.out=(Math.exp(2*this.in)-1)/(Math.exp(2*this.in)+1)}}class cp{x;y;num;neighbors;regenRate;RCap;GCap;BCap;rDelta;gDelta;bDelta;R;G;B;constructor(t,e,n,s){this.x=t,this.y=e,this.num=n,this.neighbors=s,this.regenRate=Math.random()*.05+.05,this.RCap=fe(Math.random()*100)+50,this.GCap=fe(Math.random()*100)+100,this.BCap=fe(Math.random()*75)+25,this.R=this.RCap,this.G=this.GCap,this.B=this.BCap,this.rDelta=0,this.gDelta=0,this.bDelta=0}regenerate(){this.R<this.RCap&&(this.R+=this.regenRate),this.G<this.GCap&&(this.G+=this.regenRate),this.B<this.BCap&&(this.B+=this.regenRate)}}const zn=ps/Gn,Ml=ms/Gn,ag=zn*Ml,Sl=document.createElement("canvas");Sl.width=zn;Sl.height=Ml;const up=Sl.getContext("2d",{alpha:!1}),hp=up.createImageData(zn,Ml),Eo=hp.data,ih={generate(){const i=[];let t=0;for(let l=0;l<ms;l+=Gn)for(let c=0;c<ps;c+=Gn)t>=zn&&i.push(t-zn),t<dr-zn&&i.push(t+zn),t%zn!==0&&i.push(t-1),(t+1)%zn!==0&&i.push(t+1),_.tiles[t]=new cp(c,l,t,[...i]),t++,i.length=0;const e=100,n=100,s=75,r=50,a=100,o=25;for(let l=0;l<8;l++){let c=255,h=255,u=255,f=0,m=0,v=0;for(let D=0;D<t;D++){const w=_.tiles[D];let N=w.RCap,k=w.GCap,E=w.BCap;for(let T=0;T<w.neighbors.length;T++)N+=_.tiles[w.neighbors[T]].RCap,k+=_.tiles[w.neighbors[T]].GCap,E+=_.tiles[w.neighbors[T]].BCap;w.RCap=N/(w.neighbors.length+1),w.GCap=k/(w.neighbors.length+1),w.BCap=E/(w.neighbors.length+1),w.R=w.RCap,w.G=w.GCap,w.B=w.BCap,w.RCap<c&&(c=w.RCap),w.GCap<h&&(h=w.GCap),w.BCap<u&&(u=w.BCap),w.RCap>f&&(f=w.RCap),w.GCap>m&&(m=w.GCap),w.BCap>v&&(v=w.BCap)}const M=f-c,p=m-h,d=v-u,y=e/M,R=n/p,A=s/d;for(let D=0;D<t;D++){const w=_.tiles[D];w.RCap=(w.RCap-c)*y+r,w.GCap=(w.GCap-h)*R+a,w.BCap=(w.BCap-u)*A+o,w.R=w.RCap,w.G=w.GCap,w.B=w.BCap}}},update(){const i=_.ctx.map;if(i){i.save(),i.setTransform(1,0,0,1,0,0),i.fillStyle="#303030",i.fillRect(0,0,i.canvas.width,i.canvas.height),i.restore(),i.font="8px monospace";for(let t=0;t<dr;t++){const e=_.tiles[t],n=t*4;Eo[n]=e.R<255?e.R>48?e.R:48:255,Eo[n+1]=e.G<255?e.G>48?e.G:48:255,Eo[n+2]=e.B<255?e.B>48?e.B:48:255,Eo[n+3]=255,_.pause||e.regenerate()}if(up.putImageData(hp,0,0),i.imageSmoothingEnabled=!1,i.drawImage(Sl,0,0,ps,ms),_.mouse.overMap){const t=Math.floor(_.mouse.x/Gn),n=Math.floor(_.mouse.y/Gn)*zn+t;if(n>=0&&n<dr){const s=_.tiles[n],r=[n,...s.neighbors];for(const a of r){const o=_.tiles[a],l=o.R-32,c=o.G-32,h=o.B-32;i.fillStyle=`rgb(${l},${c},${h})`,_.mouse.leftPressed?i.fillText(o.num.toString(),o.x+2,o.y+25):(i.fillText(fe(o.R).toString(),o.x+2,o.y+9),i.fillText(fe(o.G).toString(),o.x+2,o.y+16),i.fillText(fe(o.B).toString(),o.x+2,o.y+23))}}}}}};class Oc{x;y;tile=null;r=0;g=0;b=0;s=0;detected=-1;constructor(t,e){this.x=t,this.y=e}move(t,e,n,s,r){const a=t*Ps,o=Math.cos(a),l=Math.sin(a);this.x=e+r*o-s*l,this.y=n+r*l+s*o}sense(){if(this.detected=-1,this.s=0,this.x>=0&&this.y>=0&&this.x<ps&&this.y<ms){this.tile=~~(this.y/Gn)*zn+~~(this.x/Gn);const t=_.tiles[this.tile];this.r=t.R/150,this.g=t.G/200,this.b=t.B/100}else this.tile=null,this.r=-1,this.g=-1,this.b=-1,this.s=0}}class Bc{x;y;tile=null;r=0;g=0;b=0;s=0;detected=-1;constructor(t,e){this.x=t,this.y=e}move(t,e,n,s,r){const a=t*Ps,o=Math.cos(a),l=Math.sin(a);this.x=e+r*o-s*l,this.y=n+r*l+s*o}sense(){if(this.detected=-1,this.s=0,this.x>=0&&this.y>=0&&this.x<ps&&this.y<ms){this.tile=~~(this.y/Gn)*zn+~~(this.x/Gn);const t=_.tiles[this.tile];this.r=t.R/150,this.g=t.G/200,this.b=t.B/100}else this.tile=null,this.r=-1,this.g=-1,this.b=-1,this.s=0}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const sh="182",ea={ROTATE:0,DOLLY:1,PAN:2},ta={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},og=0,ef=1,lg=2,Jo=1,cg=2,Va=3,Fs=0,kn=1,Bi=2,us=0,na=1,nf=2,sf=3,rf=4,ug=5,sr=100,hg=101,fg=102,dg=103,pg=104,mg=200,gg=201,_g=202,xg=203,zc=204,Gc=205,vg=206,Mg=207,Sg=208,yg=209,Eg=210,bg=211,Tg=212,Ag=213,wg=214,kc=0,Hc=1,Vc=2,aa=3,Wc=4,Xc=5,Yc=6,qc=7,fp=0,Rg=1,Cg=2,Hi=0,dp=1,pp=2,mp=3,gp=4,_p=5,xp=6,vp=7,Mp=300,_r=301,oa=302,jc=303,Kc=304,yl=306,$c=1e3,cs=1001,Zc=1002,yn=1003,Pg=1004,bo=1005,sn=1006,jl=1007,cr=1008,hi=1009,Sp=1010,yp=1011,to=1012,rh=1013,Xi=1014,Gi=1015,gs=1016,ah=1017,oh=1018,eo=1020,Ep=35902,bp=35899,Tp=1021,Ap=1022,Ti=1023,_s=1026,ur=1027,wp=1028,lh=1029,la=1030,ch=1031,uh=1033,Qo=33776,tl=33777,el=33778,nl=33779,Jc=35840,Qc=35841,tu=35842,eu=35843,nu=36196,iu=37492,su=37496,ru=37488,au=37489,ou=37490,lu=37491,cu=37808,uu=37809,hu=37810,fu=37811,du=37812,pu=37813,mu=37814,gu=37815,_u=37816,xu=37817,vu=37818,Mu=37819,Su=37820,yu=37821,Eu=36492,bu=36494,Tu=36495,Au=36283,wu=36284,Ru=36285,Cu=36286,Dg=3200,Lg=0,Ig=1,Is="",oi="srgb",ca="srgb-linear",ol="linear",we="srgb",Ir=7680,af=519,Ug=512,Ng=513,Fg=514,hh=515,Og=516,Bg=517,fh=518,zg=519,Pu=35044,of="300 es",ki=2e3,ll=2001;function Rp(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function cl(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Gg(){const i=cl("canvas");return i.style.display="block",i}const lf={};function ul(...i){const t="THREE."+i.shift();console.log(t,...i)}function Jt(...i){const t="THREE."+i.shift();console.warn(t,...i)}function de(...i){const t="THREE."+i.shift();console.error(t,...i)}function no(...i){const t=i.join(" ");t in lf||(lf[t]=!0,Jt(...i))}function kg(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}class Mr{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const An=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],il=Math.PI/180,Du=180/Math.PI;function Ns(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(An[i&255]+An[i>>8&255]+An[i>>16&255]+An[i>>24&255]+"-"+An[t&255]+An[t>>8&255]+"-"+An[t>>16&15|64]+An[t>>24&255]+"-"+An[e&63|128]+An[e>>8&255]+"-"+An[e>>16&255]+An[e>>24&255]+An[n&255]+An[n>>8&255]+An[n>>16&255]+An[n>>24&255]).toLowerCase()}function le(i,t,e){return Math.max(t,Math.min(e,i))}function Hg(i,t){return(i%t+t)%t}function Kl(i,t,e){return(1-e)*i+e*t}function zi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ie(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Vg={DEG2RAD:il};class Xt{constructor(t=0,e=0){Xt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class xr{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],f=r[a+0],m=r[a+1],v=r[a+2],M=r[a+3];if(o<=0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o>=1){t[e+0]=f,t[e+1]=m,t[e+2]=v,t[e+3]=M;return}if(u!==M||l!==f||c!==m||h!==v){let p=l*f+c*m+h*v+u*M;p<0&&(f=-f,m=-m,v=-v,M=-M,p=-p);let d=1-o;if(p<.9995){const y=Math.acos(p),R=Math.sin(y);d=Math.sin(d*y)/R,o=Math.sin(o*y)/R,l=l*d+f*o,c=c*d+m*o,h=h*d+v*o,u=u*d+M*o}else{l=l*d+f*o,c=c*d+m*o,h=h*d+v*o,u=u*d+M*o;const y=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=y,c*=y,h*=y,u*=y}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],f=r[a+1],m=r[a+2],v=r[a+3];return t[e]=o*v+h*u+l*m-c*f,t[e+1]=l*v+h*f+c*u-o*m,t[e+2]=c*v+h*m+o*f-l*u,t[e+3]=h*v-o*u-l*f-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),f=l(n/2),m=l(s/2),v=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*m*v,this._y=c*m*u-f*h*v,this._z=c*h*v+f*m*u,this._w=c*h*u-f*m*v;break;case"YXZ":this._x=f*h*u+c*m*v,this._y=c*m*u-f*h*v,this._z=c*h*v-f*m*u,this._w=c*h*u+f*m*v;break;case"ZXY":this._x=f*h*u-c*m*v,this._y=c*m*u+f*h*v,this._z=c*h*v+f*m*u,this._w=c*h*u-f*m*v;break;case"ZYX":this._x=f*h*u-c*m*v,this._y=c*m*u+f*h*v,this._z=c*h*v-f*m*u,this._w=c*h*u+f*m*v;break;case"YZX":this._x=f*h*u+c*m*v,this._y=c*m*u+f*h*v,this._z=c*h*v-f*m*u,this._w=c*h*u-f*m*v;break;case"XZY":this._x=f*h*u-c*m*v,this._y=c*m*u-f*h*v,this._z=c*h*v+f*m*u,this._w=c*h*u+f*m*v;break;default:Jt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=n+o+u;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>u){const m=2*Math.sqrt(1+n-o-u);this._w=(h-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>u){const m=2*Math.sqrt(1+o-n-u);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+u-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(le(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e<=0)return this;if(e>=1)return this.copy(t);let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class X{constructor(t=0,e=0,n=0){X.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(cf.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(cf.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this.z=le(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this.z=le(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return $l.copy(this).projectOnVector(t),this.sub($l)}reflect(t){return this.sub($l.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const $l=new X,cf=new xr;class ie{constructor(t,e,n,s,r,a,o,l,c){ie.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],m=n[5],v=n[8],M=s[0],p=s[3],d=s[6],y=s[1],R=s[4],A=s[7],D=s[2],w=s[5],N=s[8];return r[0]=a*M+o*y+l*D,r[3]=a*p+o*R+l*w,r[6]=a*d+o*A+l*N,r[1]=c*M+h*y+u*D,r[4]=c*p+h*R+u*w,r[7]=c*d+h*A+u*N,r[2]=f*M+m*y+v*D,r[5]=f*p+m*R+v*w,r[8]=f*d+m*A+v*N,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,f=o*l-h*r,m=c*r-a*l,v=e*u+n*f+s*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/v;return t[0]=u*M,t[1]=(s*c-h*n)*M,t[2]=(o*n-s*a)*M,t[3]=f*M,t[4]=(h*e-s*l)*M,t[5]=(s*r-o*e)*M,t[6]=m*M,t[7]=(n*l-c*e)*M,t[8]=(a*e-n*r)*M,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Zl.makeScale(t,e)),this}rotate(t){return this.premultiply(Zl.makeRotation(-t)),this}translate(t,e){return this.premultiply(Zl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Zl=new ie,uf=new ie().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),hf=new ie().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Wg(){const i={enabled:!0,workingColorSpace:ca,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===we&&(s.r=hs(s.r),s.g=hs(s.g),s.b=hs(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===we&&(s.r=ia(s.r),s.g=ia(s.g),s.b=ia(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Is?ol:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return no("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return no("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ca]:{primaries:t,whitePoint:n,transfer:ol,toXYZ:uf,fromXYZ:hf,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:oi},outputColorSpaceConfig:{drawingBufferColorSpace:oi}},[oi]:{primaries:t,whitePoint:n,transfer:we,toXYZ:uf,fromXYZ:hf,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:oi}}}),i}const me=Wg();function hs(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ia(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ur;class Xg{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ur===void 0&&(Ur=cl("canvas")),Ur.width=t.width,Ur.height=t.height;const s=Ur.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ur}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=cl("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=hs(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(hs(e[n]/255)*255):e[n]=hs(e[n]);return{data:e,width:t.width,height:t.height}}else return Jt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Yg=0;class dh{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Yg++}),this.uuid=Ns(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Jl(s[a].image)):r.push(Jl(s[a]))}else r=Jl(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Jl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Xg.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Jt("Texture: Unable to serialize Texture."),{})}let qg=0;const Ql=new X;class Cn extends Mr{constructor(t=Cn.DEFAULT_IMAGE,e=Cn.DEFAULT_MAPPING,n=cs,s=cs,r=sn,a=cr,o=Ti,l=hi,c=Cn.DEFAULT_ANISOTROPY,h=Is){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:qg++}),this.uuid=Ns(),this.name="",this.source=new dh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Xt(0,0),this.repeat=new Xt(1,1),this.center=new Xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ie,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ql).x}get height(){return this.source.getSize(Ql).y}get depth(){return this.source.getSize(Ql).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){Jt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Jt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Mp)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case $c:t.x=t.x-Math.floor(t.x);break;case cs:t.x=t.x<0?0:1;break;case Zc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case $c:t.y=t.y-Math.floor(t.y);break;case cs:t.y=t.y<0?0:1;break;case Zc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Cn.DEFAULT_IMAGE=null;Cn.DEFAULT_MAPPING=Mp;Cn.DEFAULT_ANISOTROPY=1;class $e{constructor(t=0,e=0,n=0,s=1){$e.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],m=l[5],v=l[9],M=l[2],p=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-M)<.01&&Math.abs(v-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+M)<.1&&Math.abs(v+p)<.1&&Math.abs(c+m+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const R=(c+1)/2,A=(m+1)/2,D=(d+1)/2,w=(h+f)/4,N=(u+M)/4,k=(v+p)/4;return R>A&&R>D?R<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(R),s=w/n,r=N/n):A>D?A<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(A),n=w/s,r=k/s):D<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),n=N/r,s=k/r),this.set(n,s,r,e),this}let y=Math.sqrt((p-v)*(p-v)+(u-M)*(u-M)+(f-h)*(f-h));return Math.abs(y)<.001&&(y=1),this.x=(p-v)/y,this.y=(u-M)/y,this.z=(f-h)/y,this.w=Math.acos((c+m+d-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this.z=le(this.z,t.z,e.z),this.w=le(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this.z=le(this.z,t,e),this.w=le(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class jg extends Mr{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:sn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new $e(0,0,t,e),this.scissorTest=!1,this.viewport=new $e(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new Cn(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:sn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new dh(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Vi extends jg{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Cp extends Cn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=yn,this.minFilter=yn,this.wrapR=cs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Kg extends Cn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=yn,this.minFilter=yn,this.wrapR=cs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class co{constructor(t=new X(1/0,1/0,1/0),e=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(xi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(xi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=xi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,xi):xi.fromBufferAttribute(r,a),xi.applyMatrix4(t.matrixWorld),this.expandByPoint(xi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),To.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),To.copy(n.boundingBox)),To.applyMatrix4(t.matrixWorld),this.union(To)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,xi),xi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ca),Ao.subVectors(this.max,Ca),Nr.subVectors(t.a,Ca),Fr.subVectors(t.b,Ca),Or.subVectors(t.c,Ca),bs.subVectors(Fr,Nr),Ts.subVectors(Or,Fr),js.subVectors(Nr,Or);let e=[0,-bs.z,bs.y,0,-Ts.z,Ts.y,0,-js.z,js.y,bs.z,0,-bs.x,Ts.z,0,-Ts.x,js.z,0,-js.x,-bs.y,bs.x,0,-Ts.y,Ts.x,0,-js.y,js.x,0];return!tc(e,Nr,Fr,Or,Ao)||(e=[1,0,0,0,1,0,0,0,1],!tc(e,Nr,Fr,Or,Ao))?!1:(wo.crossVectors(bs,Ts),e=[wo.x,wo.y,wo.z],tc(e,Nr,Fr,Or,Ao))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,xi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(xi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Qi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Qi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Qi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Qi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Qi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Qi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Qi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Qi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Qi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Qi=[new X,new X,new X,new X,new X,new X,new X,new X],xi=new X,To=new co,Nr=new X,Fr=new X,Or=new X,bs=new X,Ts=new X,js=new X,Ca=new X,Ao=new X,wo=new X,Ks=new X;function tc(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ks.fromArray(i,r);const o=s.x*Math.abs(Ks.x)+s.y*Math.abs(Ks.y)+s.z*Math.abs(Ks.z),l=t.dot(Ks),c=e.dot(Ks),h=n.dot(Ks);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const $g=new co,Pa=new X,ec=new X;class ph{constructor(t=new X,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):$g.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Pa.subVectors(t,this.center);const e=Pa.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Pa,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ec.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Pa.copy(t.center).add(ec)),this.expandByPoint(Pa.copy(t.center).sub(ec))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const ts=new X,nc=new X,Ro=new X,As=new X,ic=new X,Co=new X,sc=new X;class mh{constructor(t=new X,e=new X(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ts)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ts.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ts.copy(this.origin).addScaledVector(this.direction,e),ts.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){nc.copy(t).add(e).multiplyScalar(.5),Ro.copy(e).sub(t).normalize(),As.copy(this.origin).sub(nc);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Ro),o=As.dot(this.direction),l=-As.dot(Ro),c=As.lengthSq(),h=Math.abs(1-a*a);let u,f,m,v;if(h>0)if(u=a*l-o,f=a*o-l,v=r*h,u>=0)if(f>=-v)if(f<=v){const M=1/h;u*=M,f*=M,m=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*l)+c;else f<=-v?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),m=-u*u+f*(f+2*l)+c):f<=v?(u=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),m=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(nc).addScaledVector(Ro,f),m}intersectSphere(t,e){ts.subVectors(t.center,this.origin);const n=ts.dot(this.direction),s=ts.dot(ts)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,ts)!==null}intersectTriangle(t,e,n,s,r){ic.subVectors(e,t),Co.subVectors(n,t),sc.crossVectors(ic,Co);let a=this.direction.dot(sc),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;As.subVectors(this.origin,t);const l=o*this.direction.dot(Co.crossVectors(As,Co));if(l<0)return null;const c=o*this.direction.dot(ic.cross(As));if(c<0||l+c>a)return null;const h=-o*As.dot(sc);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ke{constructor(t,e,n,s,r,a,o,l,c,h,u,f,m,v,M,p){Ke.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,u,f,m,v,M,p)}set(t,e,n,s,r,a,o,l,c,h,u,f,m,v,M,p){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=m,d[7]=v,d[11]=M,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ke().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinant()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();const e=this.elements,n=t.elements,s=1/Br.setFromMatrixColumn(t,0).length(),r=1/Br.setFromMatrixColumn(t,1).length(),a=1/Br.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=a*h,m=a*u,v=o*h,M=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=m+v*c,e[5]=f-M*c,e[9]=-o*l,e[2]=M-f*c,e[6]=v+m*c,e[10]=a*l}else if(t.order==="YXZ"){const f=l*h,m=l*u,v=c*h,M=c*u;e[0]=f+M*o,e[4]=v*o-m,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=m*o-v,e[6]=M+f*o,e[10]=a*l}else if(t.order==="ZXY"){const f=l*h,m=l*u,v=c*h,M=c*u;e[0]=f-M*o,e[4]=-a*u,e[8]=v+m*o,e[1]=m+v*o,e[5]=a*h,e[9]=M-f*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const f=a*h,m=a*u,v=o*h,M=o*u;e[0]=l*h,e[4]=v*c-m,e[8]=f*c+M,e[1]=l*u,e[5]=M*c+f,e[9]=m*c-v,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const f=a*l,m=a*c,v=o*l,M=o*c;e[0]=l*h,e[4]=M-f*u,e[8]=v*u+m,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=m*u+v,e[10]=f-M*u}else if(t.order==="XZY"){const f=a*l,m=a*c,v=o*l,M=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+M,e[5]=a*h,e[9]=m*u-v,e[2]=v*u-m,e[6]=o*h,e[10]=M*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Zg,t,Jg)}lookAt(t,e,n){const s=this.elements;return jn.subVectors(t,e),jn.lengthSq()===0&&(jn.z=1),jn.normalize(),ws.crossVectors(n,jn),ws.lengthSq()===0&&(Math.abs(n.z)===1?jn.x+=1e-4:jn.z+=1e-4,jn.normalize(),ws.crossVectors(n,jn)),ws.normalize(),Po.crossVectors(jn,ws),s[0]=ws.x,s[4]=Po.x,s[8]=jn.x,s[1]=ws.y,s[5]=Po.y,s[9]=jn.y,s[2]=ws.z,s[6]=Po.z,s[10]=jn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],m=n[13],v=n[2],M=n[6],p=n[10],d=n[14],y=n[3],R=n[7],A=n[11],D=n[15],w=s[0],N=s[4],k=s[8],E=s[12],T=s[1],L=s[5],W=s[9],z=s[13],K=s[2],V=s[6],j=s[10],G=s[14],st=s[3],dt=s[7],at=s[11],ut=s[15];return r[0]=a*w+o*T+l*K+c*st,r[4]=a*N+o*L+l*V+c*dt,r[8]=a*k+o*W+l*j+c*at,r[12]=a*E+o*z+l*G+c*ut,r[1]=h*w+u*T+f*K+m*st,r[5]=h*N+u*L+f*V+m*dt,r[9]=h*k+u*W+f*j+m*at,r[13]=h*E+u*z+f*G+m*ut,r[2]=v*w+M*T+p*K+d*st,r[6]=v*N+M*L+p*V+d*dt,r[10]=v*k+M*W+p*j+d*at,r[14]=v*E+M*z+p*G+d*ut,r[3]=y*w+R*T+A*K+D*st,r[7]=y*N+R*L+A*V+D*dt,r[11]=y*k+R*W+A*j+D*at,r[15]=y*E+R*z+A*G+D*ut,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],m=t[14],v=t[3],M=t[7],p=t[11],d=t[15],y=l*m-c*f,R=o*m-c*u,A=o*f-l*u,D=a*m-c*h,w=a*f-l*h,N=a*u-o*h;return e*(M*y-p*R+d*A)-n*(v*y-p*D+d*w)+s*(v*R-M*D+d*N)-r*(v*A-M*w+p*N)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],m=t[11],v=t[12],M=t[13],p=t[14],d=t[15],y=u*p*c-M*f*c+M*l*m-o*p*m-u*l*d+o*f*d,R=v*f*c-h*p*c-v*l*m+a*p*m+h*l*d-a*f*d,A=h*M*c-v*u*c+v*o*m-a*M*m-h*o*d+a*u*d,D=v*u*l-h*M*l-v*o*f+a*M*f+h*o*p-a*u*p,w=e*y+n*R+s*A+r*D;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const N=1/w;return t[0]=y*N,t[1]=(M*f*r-u*p*r-M*s*m+n*p*m+u*s*d-n*f*d)*N,t[2]=(o*p*r-M*l*r+M*s*c-n*p*c-o*s*d+n*l*d)*N,t[3]=(u*l*r-o*f*r-u*s*c+n*f*c+o*s*m-n*l*m)*N,t[4]=R*N,t[5]=(h*p*r-v*f*r+v*s*m-e*p*m-h*s*d+e*f*d)*N,t[6]=(v*l*r-a*p*r-v*s*c+e*p*c+a*s*d-e*l*d)*N,t[7]=(a*f*r-h*l*r+h*s*c-e*f*c-a*s*m+e*l*m)*N,t[8]=A*N,t[9]=(v*u*r-h*M*r-v*n*m+e*M*m+h*n*d-e*u*d)*N,t[10]=(a*M*r-v*o*r+v*n*c-e*M*c-a*n*d+e*o*d)*N,t[11]=(h*o*r-a*u*r-h*n*c+e*u*c+a*n*m-e*o*m)*N,t[12]=D*N,t[13]=(h*M*s-v*u*s+v*n*f-e*M*f-h*n*p+e*u*p)*N,t[14]=(v*o*s-a*M*s-v*n*l+e*M*l+a*n*p-e*o*p)*N,t[15]=(a*u*s-h*o*s+h*n*l-e*u*l-a*n*f+e*o*f)*N,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,u=o+o,f=r*c,m=r*h,v=r*u,M=a*h,p=a*u,d=o*u,y=l*c,R=l*h,A=l*u,D=n.x,w=n.y,N=n.z;return s[0]=(1-(M+d))*D,s[1]=(m+A)*D,s[2]=(v-R)*D,s[3]=0,s[4]=(m-A)*w,s[5]=(1-(f+d))*w,s[6]=(p+y)*w,s[7]=0,s[8]=(v+R)*N,s[9]=(p-y)*N,s[10]=(1-(f+M))*N,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;if(t.x=s[12],t.y=s[13],t.z=s[14],this.determinant()===0)return n.set(1,1,1),e.identity(),this;let r=Br.set(s[0],s[1],s[2]).length();const a=Br.set(s[4],s[5],s[6]).length(),o=Br.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),vi.copy(this);const c=1/r,h=1/a,u=1/o;return vi.elements[0]*=c,vi.elements[1]*=c,vi.elements[2]*=c,vi.elements[4]*=h,vi.elements[5]*=h,vi.elements[6]*=h,vi.elements[8]*=u,vi.elements[9]*=u,vi.elements[10]*=u,e.setFromRotationMatrix(vi),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=ki,l=!1){const c=this.elements,h=2*r/(e-t),u=2*r/(n-s),f=(e+t)/(e-t),m=(n+s)/(n-s);let v,M;if(l)v=r/(a-r),M=a*r/(a-r);else if(o===ki)v=-(a+r)/(a-r),M=-2*a*r/(a-r);else if(o===ll)v=-a/(a-r),M=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=v,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=ki,l=!1){const c=this.elements,h=2/(e-t),u=2/(n-s),f=-(e+t)/(e-t),m=-(n+s)/(n-s);let v,M;if(l)v=1/(a-r),M=a/(a-r);else if(o===ki)v=-2/(a-r),M=-(a+r)/(a-r);else if(o===ll)v=-1/(a-r),M=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=v,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Br=new X,vi=new Ke,Zg=new X(0,0,0),Jg=new X(1,1,1),ws=new X,Po=new X,jn=new X,ff=new Ke,df=new xr;class xs{constructor(t=0,e=0,n=0,s=xs.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],m=s[10];switch(e){case"XYZ":this._y=Math.asin(le(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-le(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(le(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-le(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(le(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-le(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:Jt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ff.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ff,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return df.setFromEuler(this),this.setFromQuaternion(df,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xs.DEFAULT_ORDER="XYZ";class gh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Qg=0;const pf=new X,zr=new xr,es=new Ke,Do=new X,Da=new X,t0=new X,e0=new xr,mf=new X(1,0,0),gf=new X(0,1,0),_f=new X(0,0,1),xf={type:"added"},n0={type:"removed"},Gr={type:"childadded",child:null},rc={type:"childremoved",child:null};class Hn extends Mr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Qg++}),this.uuid=Ns(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Hn.DEFAULT_UP.clone();const t=new X,e=new xs,n=new xr,s=new X(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ke},normalMatrix:{value:new ie}}),this.matrix=new Ke,this.matrixWorld=new Ke,this.matrixAutoUpdate=Hn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Hn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return zr.setFromAxisAngle(t,e),this.quaternion.multiply(zr),this}rotateOnWorldAxis(t,e){return zr.setFromAxisAngle(t,e),this.quaternion.premultiply(zr),this}rotateX(t){return this.rotateOnAxis(mf,t)}rotateY(t){return this.rotateOnAxis(gf,t)}rotateZ(t){return this.rotateOnAxis(_f,t)}translateOnAxis(t,e){return pf.copy(t).applyQuaternion(this.quaternion),this.position.add(pf.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(mf,t)}translateY(t){return this.translateOnAxis(gf,t)}translateZ(t){return this.translateOnAxis(_f,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(es.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Do.copy(t):Do.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Da.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?es.lookAt(Da,Do,this.up):es.lookAt(Do,Da,this.up),this.quaternion.setFromRotationMatrix(es),s&&(es.extractRotation(s.matrixWorld),zr.setFromRotationMatrix(es),this.quaternion.premultiply(zr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(de("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(xf),Gr.child=t,this.dispatchEvent(Gr),Gr.child=null):de("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(n0),rc.child=t,this.dispatchEvent(rc),rc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),es.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),es.multiply(t.parent.matrixWorld)),t.applyMatrix4(es),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(xf),Gr.child=t,this.dispatchEvent(Gr),Gr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Da,t,t0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Da,e0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),m=a(t.animations),v=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),v.length>0&&(n.nodes=v)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Hn.DEFAULT_UP=new X(0,1,0);Hn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Hn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Mi=new X,ns=new X,ac=new X,is=new X,kr=new X,Hr=new X,vf=new X,oc=new X,lc=new X,cc=new X,uc=new $e,hc=new $e,fc=new $e;class fi{constructor(t=new X,e=new X,n=new X){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Mi.subVectors(t,e),s.cross(Mi);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Mi.subVectors(s,e),ns.subVectors(n,e),ac.subVectors(t,e);const a=Mi.dot(Mi),o=Mi.dot(ns),l=Mi.dot(ac),c=ns.dot(ns),h=ns.dot(ac),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,m=(c*l-o*h)*f,v=(a*h-o*l)*f;return r.set(1-m-v,v,m)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,is)===null?!1:is.x>=0&&is.y>=0&&is.x+is.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,is)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,is.x),l.addScaledVector(a,is.y),l.addScaledVector(o,is.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return uc.setScalar(0),hc.setScalar(0),fc.setScalar(0),uc.fromBufferAttribute(t,e),hc.fromBufferAttribute(t,n),fc.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(uc,r.x),a.addScaledVector(hc,r.y),a.addScaledVector(fc,r.z),a}static isFrontFacing(t,e,n,s){return Mi.subVectors(n,e),ns.subVectors(t,e),Mi.cross(ns).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Mi.subVectors(this.c,this.b),ns.subVectors(this.a,this.b),Mi.cross(ns).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return fi.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return fi.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return fi.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return fi.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return fi.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;kr.subVectors(s,n),Hr.subVectors(r,n),oc.subVectors(t,n);const l=kr.dot(oc),c=Hr.dot(oc);if(l<=0&&c<=0)return e.copy(n);lc.subVectors(t,s);const h=kr.dot(lc),u=Hr.dot(lc);if(h>=0&&u<=h)return e.copy(s);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(kr,a);cc.subVectors(t,r);const m=kr.dot(cc),v=Hr.dot(cc);if(v>=0&&m<=v)return e.copy(r);const M=m*c-l*v;if(M<=0&&c>=0&&v<=0)return o=c/(c-v),e.copy(n).addScaledVector(Hr,o);const p=h*v-m*u;if(p<=0&&u-h>=0&&m-v>=0)return vf.subVectors(r,s),o=(u-h)/(u-h+(m-v)),e.copy(s).addScaledVector(vf,o);const d=1/(p+M+f);return a=M*d,o=f*d,e.copy(n).addScaledVector(kr,a).addScaledVector(Hr,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Pp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Rs={h:0,s:0,l:0},Lo={h:0,s:0,l:0};function dc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Re{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=oi){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,me.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=me.workingColorSpace){return this.r=t,this.g=e,this.b=n,me.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=me.workingColorSpace){if(t=Hg(t,1),e=le(e,0,1),n=le(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=dc(a,r,t+1/3),this.g=dc(a,r,t),this.b=dc(a,r,t-1/3)}return me.colorSpaceToWorking(this,s),this}setStyle(t,e=oi){function n(r){r!==void 0&&parseFloat(r)<1&&Jt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Jt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Jt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=oi){const n=Pp[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Jt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=hs(t.r),this.g=hs(t.g),this.b=hs(t.b),this}copyLinearToSRGB(t){return this.r=ia(t.r),this.g=ia(t.g),this.b=ia(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=oi){return me.workingToColorSpace(wn.copy(this),t),Math.round(le(wn.r*255,0,255))*65536+Math.round(le(wn.g*255,0,255))*256+Math.round(le(wn.b*255,0,255))}getHexString(t=oi){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=me.workingColorSpace){me.workingToColorSpace(wn.copy(this),e);const n=wn.r,s=wn.g,r=wn.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=me.workingColorSpace){return me.workingToColorSpace(wn.copy(this),e),t.r=wn.r,t.g=wn.g,t.b=wn.b,t}getStyle(t=oi){me.workingToColorSpace(wn.copy(this),t);const e=wn.r,n=wn.g,s=wn.b;return t!==oi?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Rs),this.setHSL(Rs.h+t,Rs.s+e,Rs.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Rs),t.getHSL(Lo);const n=Kl(Rs.h,Lo.h,e),s=Kl(Rs.s,Lo.s,e),r=Kl(Rs.l,Lo.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const wn=new Re;Re.NAMES=Pp;let i0=0;class uo extends Mr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:i0++}),this.uuid=Ns(),this.name="",this.type="Material",this.blending=na,this.side=Fs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=zc,this.blendDst=Gc,this.blendEquation=sr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Re(0,0,0),this.blendAlpha=0,this.depthFunc=aa,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=af,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ir,this.stencilZFail=Ir,this.stencilZPass=Ir,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){Jt(`Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Jt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==na&&(n.blending=this.blending),this.side!==Fs&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==zc&&(n.blendSrc=this.blendSrc),this.blendDst!==Gc&&(n.blendDst=this.blendDst),this.blendEquation!==sr&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==aa&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==af&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ir&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ir&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ir&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class ua extends uo{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Re(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xs,this.combine=fp,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const en=new X,Io=new Xt;let s0=0;class Vn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:s0++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Pu,this.updateRanges=[],this.gpuType=Gi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Io.fromBufferAttribute(this,e),Io.applyMatrix3(t),this.setXY(e,Io.x,Io.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)en.fromBufferAttribute(this,e),en.applyMatrix3(t),this.setXYZ(e,en.x,en.y,en.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)en.fromBufferAttribute(this,e),en.applyMatrix4(t),this.setXYZ(e,en.x,en.y,en.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)en.fromBufferAttribute(this,e),en.applyNormalMatrix(t),this.setXYZ(e,en.x,en.y,en.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)en.fromBufferAttribute(this,e),en.transformDirection(t),this.setXYZ(e,en.x,en.y,en.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=zi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ie(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=zi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=zi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=zi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=zi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ie(e,this.array),n=Ie(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ie(e,this.array),n=Ie(n,this.array),s=Ie(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ie(e,this.array),n=Ie(n,this.array),s=Ie(s,this.array),r=Ie(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Pu&&(t.usage=this.usage),t}}class Dp extends Vn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Lp extends Vn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class di extends Vn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let r0=0;const ri=new Ke,pc=new Hn,Vr=new X,Kn=new co,La=new co,vn=new X;class pi extends Mr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:r0++}),this.uuid=Ns(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Rp(t)?Lp:Dp)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ie().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ri.makeRotationFromQuaternion(t),this.applyMatrix4(ri),this}rotateX(t){return ri.makeRotationX(t),this.applyMatrix4(ri),this}rotateY(t){return ri.makeRotationY(t),this.applyMatrix4(ri),this}rotateZ(t){return ri.makeRotationZ(t),this.applyMatrix4(ri),this}translate(t,e,n){return ri.makeTranslation(t,e,n),this.applyMatrix4(ri),this}scale(t,e,n){return ri.makeScale(t,e,n),this.applyMatrix4(ri),this}lookAt(t){return pc.lookAt(t),pc.updateMatrix(),this.applyMatrix4(pc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Vr).negate(),this.translate(Vr.x,Vr.y,Vr.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new di(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Jt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new co);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){de("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Kn.setFromBufferAttribute(r),this.morphTargetsRelative?(vn.addVectors(this.boundingBox.min,Kn.min),this.boundingBox.expandByPoint(vn),vn.addVectors(this.boundingBox.max,Kn.max),this.boundingBox.expandByPoint(vn)):(this.boundingBox.expandByPoint(Kn.min),this.boundingBox.expandByPoint(Kn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&de('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ph);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){de("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new X,1/0);return}if(t){const n=this.boundingSphere.center;if(Kn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];La.setFromBufferAttribute(o),this.morphTargetsRelative?(vn.addVectors(Kn.min,La.min),Kn.expandByPoint(vn),vn.addVectors(Kn.max,La.max),Kn.expandByPoint(vn)):(Kn.expandByPoint(La.min),Kn.expandByPoint(La.max))}Kn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)vn.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(vn));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)vn.fromBufferAttribute(o,c),l&&(Vr.fromBufferAttribute(t,c),vn.add(Vr)),s=Math.max(s,n.distanceToSquared(vn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&de('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){de("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Vn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let k=0;k<n.count;k++)o[k]=new X,l[k]=new X;const c=new X,h=new X,u=new X,f=new Xt,m=new Xt,v=new Xt,M=new X,p=new X;function d(k,E,T){c.fromBufferAttribute(n,k),h.fromBufferAttribute(n,E),u.fromBufferAttribute(n,T),f.fromBufferAttribute(r,k),m.fromBufferAttribute(r,E),v.fromBufferAttribute(r,T),h.sub(c),u.sub(c),m.sub(f),v.sub(f);const L=1/(m.x*v.y-v.x*m.y);isFinite(L)&&(M.copy(h).multiplyScalar(v.y).addScaledVector(u,-m.y).multiplyScalar(L),p.copy(u).multiplyScalar(m.x).addScaledVector(h,-v.x).multiplyScalar(L),o[k].add(M),o[E].add(M),o[T].add(M),l[k].add(p),l[E].add(p),l[T].add(p))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let k=0,E=y.length;k<E;++k){const T=y[k],L=T.start,W=T.count;for(let z=L,K=L+W;z<K;z+=3)d(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const R=new X,A=new X,D=new X,w=new X;function N(k){D.fromBufferAttribute(s,k),w.copy(D);const E=o[k];R.copy(E),R.sub(D.multiplyScalar(D.dot(E))).normalize(),A.crossVectors(w,E);const L=A.dot(l[k])<0?-1:1;a.setXYZW(k,R.x,R.y,R.z,L)}for(let k=0,E=y.length;k<E;++k){const T=y[k],L=T.start,W=T.count;for(let z=L,K=L+W;z<K;z+=3)N(t.getX(z+0)),N(t.getX(z+1)),N(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Vn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const s=new X,r=new X,a=new X,o=new X,l=new X,c=new X,h=new X,u=new X;if(t)for(let f=0,m=t.count;f<m;f+=3){const v=t.getX(f+0),M=t.getX(f+1),p=t.getX(f+2);s.fromBufferAttribute(e,v),r.fromBufferAttribute(e,M),a.fromBufferAttribute(e,p),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,v),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(v,o.x,o.y,o.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=e.count;f<m;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)vn.fromBufferAttribute(t,e),vn.normalize(),t.setXYZ(e,vn.x,vn.y,vn.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let m=0,v=0;for(let M=0,p=l.length;M<p;M++){o.isInterleavedBufferAttribute?m=l[M]*o.data.stride+o.offset:m=l[M]*h;for(let d=0;d<h;d++)f[v++]=c[m++]}return new Vn(f,h,u)}if(this.index===null)return Jt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new pi,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],m=t(f,n);l.push(m)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const m=c[u];h.push(m.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,m=u.length;f<m;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Mf=new Ke,$s=new mh,Uo=new ph,Sf=new X,No=new X,Fo=new X,Oo=new X,mc=new X,Bo=new X,yf=new X,zo=new X;class Qn extends Hn{constructor(t=new pi,e=new ua){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){Bo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(mc.fromBufferAttribute(u,t),a?Bo.addScaledVector(mc,h):Bo.addScaledVector(mc.sub(e),h))}e.add(Bo)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Uo.copy(n.boundingSphere),Uo.applyMatrix4(r),$s.copy(t.ray).recast(t.near),!(Uo.containsPoint($s.origin)===!1&&($s.intersectSphere(Uo,Sf)===null||$s.origin.distanceToSquared(Sf)>(t.far-t.near)**2))&&(Mf.copy(r).invert(),$s.copy(t.ray).applyMatrix4(Mf),!(n.boundingBox!==null&&$s.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,$s)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let v=0,M=f.length;v<M;v++){const p=f[v],d=a[p.materialIndex],y=Math.max(p.start,m.start),R=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let A=y,D=R;A<D;A+=3){const w=o.getX(A),N=o.getX(A+1),k=o.getX(A+2);s=Go(this,d,t,n,c,h,u,w,N,k),s&&(s.faceIndex=Math.floor(A/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const v=Math.max(0,m.start),M=Math.min(o.count,m.start+m.count);for(let p=v,d=M;p<d;p+=3){const y=o.getX(p),R=o.getX(p+1),A=o.getX(p+2);s=Go(this,a,t,n,c,h,u,y,R,A),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let v=0,M=f.length;v<M;v++){const p=f[v],d=a[p.materialIndex],y=Math.max(p.start,m.start),R=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let A=y,D=R;A<D;A+=3){const w=A,N=A+1,k=A+2;s=Go(this,d,t,n,c,h,u,w,N,k),s&&(s.faceIndex=Math.floor(A/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const v=Math.max(0,m.start),M=Math.min(l.count,m.start+m.count);for(let p=v,d=M;p<d;p+=3){const y=p,R=p+1,A=p+2;s=Go(this,a,t,n,c,h,u,y,R,A),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}}function a0(i,t,e,n,s,r,a,o){let l;if(t.side===kn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===Fs,o),l===null)return null;zo.copy(o),zo.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(zo);return c<e.near||c>e.far?null:{distance:c,point:zo.clone(),object:i}}function Go(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,No),i.getVertexPosition(l,Fo),i.getVertexPosition(c,Oo);const h=a0(i,t,e,n,No,Fo,Oo,yf);if(h){const u=new X;fi.getBarycoord(yf,No,Fo,Oo,u),s&&(h.uv=fi.getInterpolatedAttribute(s,o,l,c,u,new Xt)),r&&(h.uv1=fi.getInterpolatedAttribute(r,o,l,c,u,new Xt)),a&&(h.normal=fi.getInterpolatedAttribute(a,o,l,c,u,new X),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new X,materialIndex:0};fi.getNormal(No,Fo,Oo,f.normal),h.face=f,h.barycoord=u}return h}class ho extends pi{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,m=0;v("z","y","x",-1,-1,n,e,t,a,r,0),v("z","y","x",1,-1,n,e,-t,a,r,1),v("x","z","y",1,1,t,n,e,s,a,2),v("x","z","y",1,-1,t,n,-e,s,a,3),v("x","y","z",1,-1,t,e,n,s,r,4),v("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new di(c,3)),this.setAttribute("normal",new di(h,3)),this.setAttribute("uv",new di(u,2));function v(M,p,d,y,R,A,D,w,N,k,E){const T=A/N,L=D/k,W=A/2,z=D/2,K=w/2,V=N+1,j=k+1;let G=0,st=0;const dt=new X;for(let at=0;at<j;at++){const ut=at*L-z;for(let St=0;St<V;St++){const ht=St*T-W;dt[M]=ht*y,dt[p]=ut*R,dt[d]=K,c.push(dt.x,dt.y,dt.z),dt[M]=0,dt[p]=0,dt[d]=w>0?1:-1,h.push(dt.x,dt.y,dt.z),u.push(St/N),u.push(1-at/k),G+=1}}for(let at=0;at<k;at++)for(let ut=0;ut<N;ut++){const St=f+ut+V*at,ht=f+ut+V*(at+1),Qt=f+(ut+1)+V*(at+1),ee=f+(ut+1)+V*at;l.push(St,ht,ee),l.push(ht,Qt,ee),st+=6}o.addGroup(m,st,E),m+=st,f+=G}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ho(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ha(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Jt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Un(i){const t={};for(let e=0;e<i.length;e++){const n=ha(i[e]);for(const s in n)t[s]=n[s]}return t}function o0(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Ip(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:me.workingColorSpace}const l0={clone:ha,merge:Un};var c0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,u0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Yi extends uo{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=c0,this.fragmentShader=u0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ha(t.uniforms),this.uniformsGroups=o0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Up extends Hn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ke,this.projectionMatrix=new Ke,this.projectionMatrixInverse=new Ke,this.coordinateSystem=ki,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Cs=new X,Ef=new Xt,bf=new Xt;class ci extends Up{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Du*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(il*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Du*2*Math.atan(Math.tan(il*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Cs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Cs.x,Cs.y).multiplyScalar(-t/Cs.z),Cs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Cs.x,Cs.y).multiplyScalar(-t/Cs.z)}getViewSize(t,e){return this.getViewBounds(t,Ef,bf),e.subVectors(bf,Ef)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(il*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Wr=-90,Xr=1;class h0 extends Hn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ci(Wr,Xr,t,e);s.layers=this.layers,this.add(s);const r=new ci(Wr,Xr,t,e);r.layers=this.layers,this.add(r);const a=new ci(Wr,Xr,t,e);a.layers=this.layers,this.add(a);const o=new ci(Wr,Xr,t,e);o.layers=this.layers,this.add(o);const l=new ci(Wr,Xr,t,e);l.layers=this.layers,this.add(l);const c=new ci(Wr,Xr,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===ki)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ll)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),v=t.xr.enabled;t.xr.enabled=!1;const M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=M,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,f,m),t.xr.enabled=v,n.texture.needsPMREMUpdate=!0}}class Np extends Cn{constructor(t=[],e=_r,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Fp extends Vi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Np(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ho(5,5,5),r=new Yi({name:"CubemapFromEquirect",uniforms:ha(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:kn,blending:us});r.uniforms.tEquirect.value=e;const a=new Qn(s,r),o=e.minFilter;return e.minFilter===cr&&(e.minFilter=sn),new h0(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class Wa extends Hn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const f0={type:"move"};class gc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Wa,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Wa,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Wa,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const M of t.hand.values()){const p=e.getJointPose(M,n),d=this._getHandJoint(c,M);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),m=.02,v=.005;c.inputState.pinching&&f>m+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=m-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(f0)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Wa;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class d0 extends Hn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xs,this.environmentIntensity=1,this.environmentRotation=new xs,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class p0{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Pu,this.updateRanges=[],this.version=0,this.uuid=Ns()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ns()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ns()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const In=new X;class hl{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)In.fromBufferAttribute(this,e),In.applyMatrix4(t),this.setXYZ(e,In.x,In.y,In.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)In.fromBufferAttribute(this,e),In.applyNormalMatrix(t),this.setXYZ(e,In.x,In.y,In.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)In.fromBufferAttribute(this,e),In.transformDirection(t),this.setXYZ(e,In.x,In.y,In.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=zi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ie(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=zi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=zi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=zi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=zi(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ie(e,this.array),n=Ie(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ie(e,this.array),n=Ie(n,this.array),s=Ie(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ie(e,this.array),n=Ie(n,this.array),s=Ie(s,this.array),r=Ie(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){ul("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Vn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new hl(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){ul("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class io extends uo{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Re(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Yr;const Ia=new X,qr=new X,jr=new X,Kr=new Xt,Ua=new Xt,Op=new Ke,ko=new X,Na=new X,Ho=new X,Tf=new Xt,_c=new Xt,Af=new Xt;class fl extends Hn{constructor(t=new io){if(super(),this.isSprite=!0,this.type="Sprite",Yr===void 0){Yr=new pi;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new p0(e,5);Yr.setIndex([0,1,2,0,2,3]),Yr.setAttribute("position",new hl(n,3,0,!1)),Yr.setAttribute("uv",new hl(n,2,3,!1))}this.geometry=Yr,this.material=t,this.center=new Xt(.5,.5),this.count=1}raycast(t,e){t.camera===null&&de('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),qr.setFromMatrixScale(this.matrixWorld),Op.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),jr.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&qr.multiplyScalar(-jr.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Vo(ko.set(-.5,-.5,0),jr,a,qr,s,r),Vo(Na.set(.5,-.5,0),jr,a,qr,s,r),Vo(Ho.set(.5,.5,0),jr,a,qr,s,r),Tf.set(0,0),_c.set(1,0),Af.set(1,1);let o=t.ray.intersectTriangle(ko,Na,Ho,!1,Ia);if(o===null&&(Vo(Na.set(-.5,.5,0),jr,a,qr,s,r),_c.set(0,1),o=t.ray.intersectTriangle(ko,Ho,Na,!1,Ia),o===null))return;const l=t.ray.origin.distanceTo(Ia);l<t.near||l>t.far||e.push({distance:l,point:Ia.clone(),uv:fi.getInterpolation(Ia,ko,Na,Ho,Tf,_c,Af,new Xt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Vo(i,t,e,n,s,r){Kr.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(Ua.x=r*Kr.x-s*Kr.y,Ua.y=s*Kr.x+r*Kr.y):Ua.copy(Kr),i.copy(t),i.x+=Ua.x,i.y+=Ua.y,i.applyMatrix4(Op)}class m0 extends Cn{constructor(t=null,e=1,n=1,s,r,a,o,l,c=yn,h=yn,u,f){super(null,a,o,l,c,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const xc=new X,g0=new X,_0=new ie;class Ds{constructor(t=new X(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=xc.subVectors(n,e).cross(g0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(xc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||_0.getNormalMatrix(t),s=this.coplanarPoint(xc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Zs=new ph,x0=new Xt(.5,.5),Wo=new X;class Bp{constructor(t=new Ds,e=new Ds,n=new Ds,s=new Ds,r=new Ds,a=new Ds){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ki,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],m=r[7],v=r[8],M=r[9],p=r[10],d=r[11],y=r[12],R=r[13],A=r[14],D=r[15];if(s[0].setComponents(c-a,m-h,d-v,D-y).normalize(),s[1].setComponents(c+a,m+h,d+v,D+y).normalize(),s[2].setComponents(c+o,m+u,d+M,D+R).normalize(),s[3].setComponents(c-o,m-u,d-M,D-R).normalize(),n)s[4].setComponents(l,f,p,A).normalize(),s[5].setComponents(c-l,m-f,d-p,D-A).normalize();else if(s[4].setComponents(c-l,m-f,d-p,D-A).normalize(),e===ki)s[5].setComponents(c+l,m+f,d+p,D+A).normalize();else if(e===ll)s[5].setComponents(l,f,p,A).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Zs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Zs.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Zs)}intersectsSprite(t){Zs.center.set(0,0,0);const e=x0.distanceTo(t.center);return Zs.radius=.7071067811865476+e,Zs.applyMatrix4(t.matrixWorld),this.intersectsSphere(Zs)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Wo.x=s.normal.x>0?t.max.x:t.min.x,Wo.y=s.normal.y>0?t.max.y:t.min.y,Wo.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Wo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class zp extends Cn{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class so extends Cn{constructor(t,e,n=Xi,s,r,a,o=yn,l=yn,c,h=_s,u=1){if(h!==_s&&h!==ur)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:u};super(f,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new dh(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class v0 extends so{constructor(t,e=Xi,n=_r,s,r,a=yn,o=yn,l,c=_s){const h={width:t,height:t,depth:1},u=[h,h,h,h,h,h];super(t,t,e,n,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Gp extends Cn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class El extends pi{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=t/o,f=e/l,m=[],v=[],M=[],p=[];for(let d=0;d<h;d++){const y=d*f-a;for(let R=0;R<c;R++){const A=R*u-r;v.push(A,-y,0),M.push(0,0,1),p.push(R/o),p.push(1-d/l)}}for(let d=0;d<l;d++)for(let y=0;y<o;y++){const R=y+c*d,A=y+c*(d+1),D=y+1+c*(d+1),w=y+1+c*d;m.push(R,A,w),m.push(A,D,w)}this.setIndex(m),this.setAttribute("position",new di(v,3)),this.setAttribute("normal",new di(M,3)),this.setAttribute("uv",new di(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new El(t.width,t.height,t.widthSegments,t.heightSegments)}}class bl extends pi{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new X,f=new X,m=[],v=[],M=[],p=[];for(let d=0;d<=n;d++){const y=[],R=d/n;let A=0;d===0&&a===0?A=.5/e:d===n&&l===Math.PI&&(A=-.5/e);for(let D=0;D<=e;D++){const w=D/e;u.x=-t*Math.cos(s+w*r)*Math.sin(a+R*o),u.y=t*Math.cos(a+R*o),u.z=t*Math.sin(s+w*r)*Math.sin(a+R*o),v.push(u.x,u.y,u.z),f.copy(u).normalize(),M.push(f.x,f.y,f.z),p.push(w+A,1-R),y.push(c++)}h.push(y)}for(let d=0;d<n;d++)for(let y=0;y<e;y++){const R=h[d][y+1],A=h[d][y],D=h[d+1][y],w=h[d+1][y+1];(d!==0||a>0)&&m.push(R,A,w),(d!==n-1||l<Math.PI)&&m.push(A,D,w)}this.setIndex(m),this.setAttribute("position",new di(v,3)),this.setAttribute("normal",new di(M,3)),this.setAttribute("uv",new di(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bl(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class M0 extends Yi{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class S0 extends uo{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Dg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class y0 extends uo{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class kp extends Up{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class E0 extends ci{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const wf=new Ke;class b0{constructor(t,e,n=0,s=1/0){this.ray=new mh(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new gh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):de("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return wf.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(wf),this}intersectObject(t,e=!0,n=[]){return Lu(t,this,n,e),n.sort(Rf),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Lu(t[s],this,n,e);return n.sort(Rf),n}}function Rf(i,t){return i.distance-t.distance}function Lu(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)Lu(r[a],t,e,!0)}}class Cf{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=le(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(le(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class T0 extends Mr{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){Jt("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function Pf(i,t,e,n){const s=A0(n);switch(e){case Tp:return i*t;case wp:return i*t/s.components*s.byteLength;case lh:return i*t/s.components*s.byteLength;case la:return i*t*2/s.components*s.byteLength;case ch:return i*t*2/s.components*s.byteLength;case Ap:return i*t*3/s.components*s.byteLength;case Ti:return i*t*4/s.components*s.byteLength;case uh:return i*t*4/s.components*s.byteLength;case Qo:case tl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case el:case nl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Qc:case eu:return Math.max(i,16)*Math.max(t,8)/4;case Jc:case tu:return Math.max(i,8)*Math.max(t,8)/2;case nu:case iu:case ru:case au:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case su:case ou:case lu:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case cu:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case uu:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case hu:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case fu:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case du:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case pu:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case mu:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case gu:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case _u:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case xu:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case vu:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Mu:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Su:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case yu:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Eu:case bu:case Tu:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Au:case wu:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Ru:case Cu:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function A0(i){switch(i){case hi:case Sp:return{byteLength:1,components:1};case to:case yp:case gs:return{byteLength:2,components:1};case ah:case oh:return{byteLength:2,components:4};case Xi:case rh:case Gi:return{byteLength:4,components:1};case Ep:case bp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:sh}}));typeof window<"u"&&(window.__THREE__?Jt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=sh);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Hp(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function w0(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,h),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((m,v)=>m.start-v.start);let f=0;for(let m=1;m<u.length;m++){const v=u[f],M=u[m];M.start<=v.start+v.count+1?v.count=Math.max(v.count,M.start+M.count-v.start):(++f,u[f]=M)}u.length=f+1;for(let m=0,v=u.length;m<v;m++){const M=u[m];i.bufferSubData(c,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var R0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,C0=`#ifdef USE_ALPHAHASH
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
#endif`,P0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,D0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,L0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,I0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,U0=`#ifdef USE_AOMAP
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
#endif`,N0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,F0=`#ifdef USE_BATCHING
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
#endif`,O0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,B0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,z0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,G0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,k0=`#ifdef USE_IRIDESCENCE
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
#endif`,H0=`#ifdef USE_BUMPMAP
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
#endif`,V0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,W0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,X0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Y0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,q0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,j0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,K0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,$0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Z0=`#define PI 3.141592653589793
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
} // validated`,J0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Q0=`vec3 transformedNormal = objectNormal;
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
#endif`,t_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,e_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,n_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,i_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,s_="gl_FragColor = linearToOutputTexel( gl_FragColor );",r_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,a_=`#ifdef USE_ENVMAP
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
#endif`,o_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,l_=`#ifdef USE_ENVMAP
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
#endif`,c_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,u_=`#ifdef USE_ENVMAP
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
#endif`,h_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,f_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,d_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,p_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,m_=`#ifdef USE_GRADIENTMAP
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
}`,g_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,__=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,x_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,v_=`uniform bool receiveShadow;
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
#endif`,M_=`#ifdef USE_ENVMAP
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
#endif`,S_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,y_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,E_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,b_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,T_=`PhysicalMaterial material;
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
#endif`,A_=`uniform sampler2D dfgLUT;
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
}`,w_=`
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
#endif`,R_=`#if defined( RE_IndirectDiffuse )
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
#endif`,C_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,P_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,D_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,L_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,I_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,U_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,N_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,F_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,O_=`#if defined( USE_POINTS_UV )
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
#endif`,B_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,z_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,G_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,k_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,H_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,V_=`#ifdef USE_MORPHTARGETS
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
#endif`,W_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,X_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Y_=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,q_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,j_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,K_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,$_=`#ifdef USE_NORMALMAP
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
#endif`,Z_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,J_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Q_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,tx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ex=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,nx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,ix=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,sx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ax=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ox=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,lx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,cx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ux=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,fx=`float getShadowMask() {
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
}`,dx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,px=`#ifdef USE_SKINNING
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
#endif`,mx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,gx=`#ifdef USE_SKINNING
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
#endif`,_x=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,xx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,vx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Mx=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Sx=`#ifdef USE_TRANSMISSION
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
#endif`,yx=`#ifdef USE_TRANSMISSION
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
#endif`,Ex=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Tx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ax=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const wx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Rx=`uniform sampler2D t2D;
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
}`,Cx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Px=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Dx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ix=`#include <common>
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
}`,Ux=`#if DEPTH_PACKING == 3200
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
}`,Nx=`#define DISTANCE
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
}`,Fx=`#define DISTANCE
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
}`,Ox=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Bx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zx=`uniform float scale;
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
}`,Gx=`uniform vec3 diffuse;
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
}`,kx=`#include <common>
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
}`,Hx=`uniform vec3 diffuse;
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
}`,Vx=`#define LAMBERT
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
}`,Wx=`#define LAMBERT
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
}`,Xx=`#define MATCAP
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
}`,Yx=`#define MATCAP
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
}`,qx=`#define NORMAL
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
}`,jx=`#define NORMAL
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
}`,Kx=`#define PHONG
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
}`,$x=`#define PHONG
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
}`,Zx=`#define STANDARD
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
}`,Jx=`#define STANDARD
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
}`,Qx=`#define TOON
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
}`,tv=`#define TOON
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
}`,ev=`uniform float size;
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
}`,nv=`uniform vec3 diffuse;
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
}`,iv=`#include <common>
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
}`,sv=`uniform vec3 color;
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
}`,rv=`uniform float rotation;
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
}`,av=`uniform vec3 diffuse;
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
}`,se={alphahash_fragment:R0,alphahash_pars_fragment:C0,alphamap_fragment:P0,alphamap_pars_fragment:D0,alphatest_fragment:L0,alphatest_pars_fragment:I0,aomap_fragment:U0,aomap_pars_fragment:N0,batching_pars_vertex:F0,batching_vertex:O0,begin_vertex:B0,beginnormal_vertex:z0,bsdfs:G0,iridescence_fragment:k0,bumpmap_pars_fragment:H0,clipping_planes_fragment:V0,clipping_planes_pars_fragment:W0,clipping_planes_pars_vertex:X0,clipping_planes_vertex:Y0,color_fragment:q0,color_pars_fragment:j0,color_pars_vertex:K0,color_vertex:$0,common:Z0,cube_uv_reflection_fragment:J0,defaultnormal_vertex:Q0,displacementmap_pars_vertex:t_,displacementmap_vertex:e_,emissivemap_fragment:n_,emissivemap_pars_fragment:i_,colorspace_fragment:s_,colorspace_pars_fragment:r_,envmap_fragment:a_,envmap_common_pars_fragment:o_,envmap_pars_fragment:l_,envmap_pars_vertex:c_,envmap_physical_pars_fragment:M_,envmap_vertex:u_,fog_vertex:h_,fog_pars_vertex:f_,fog_fragment:d_,fog_pars_fragment:p_,gradientmap_pars_fragment:m_,lightmap_pars_fragment:g_,lights_lambert_fragment:__,lights_lambert_pars_fragment:x_,lights_pars_begin:v_,lights_toon_fragment:S_,lights_toon_pars_fragment:y_,lights_phong_fragment:E_,lights_phong_pars_fragment:b_,lights_physical_fragment:T_,lights_physical_pars_fragment:A_,lights_fragment_begin:w_,lights_fragment_maps:R_,lights_fragment_end:C_,logdepthbuf_fragment:P_,logdepthbuf_pars_fragment:D_,logdepthbuf_pars_vertex:L_,logdepthbuf_vertex:I_,map_fragment:U_,map_pars_fragment:N_,map_particle_fragment:F_,map_particle_pars_fragment:O_,metalnessmap_fragment:B_,metalnessmap_pars_fragment:z_,morphinstance_vertex:G_,morphcolor_vertex:k_,morphnormal_vertex:H_,morphtarget_pars_vertex:V_,morphtarget_vertex:W_,normal_fragment_begin:X_,normal_fragment_maps:Y_,normal_pars_fragment:q_,normal_pars_vertex:j_,normal_vertex:K_,normalmap_pars_fragment:$_,clearcoat_normal_fragment_begin:Z_,clearcoat_normal_fragment_maps:J_,clearcoat_pars_fragment:Q_,iridescence_pars_fragment:tx,opaque_fragment:ex,packing:nx,premultiplied_alpha_fragment:ix,project_vertex:sx,dithering_fragment:rx,dithering_pars_fragment:ax,roughnessmap_fragment:ox,roughnessmap_pars_fragment:lx,shadowmap_pars_fragment:cx,shadowmap_pars_vertex:ux,shadowmap_vertex:hx,shadowmask_pars_fragment:fx,skinbase_vertex:dx,skinning_pars_vertex:px,skinning_vertex:mx,skinnormal_vertex:gx,specularmap_fragment:_x,specularmap_pars_fragment:xx,tonemapping_fragment:vx,tonemapping_pars_fragment:Mx,transmission_fragment:Sx,transmission_pars_fragment:yx,uv_pars_fragment:Ex,uv_pars_vertex:bx,uv_vertex:Tx,worldpos_vertex:Ax,background_vert:wx,background_frag:Rx,backgroundCube_vert:Cx,backgroundCube_frag:Px,cube_vert:Dx,cube_frag:Lx,depth_vert:Ix,depth_frag:Ux,distance_vert:Nx,distance_frag:Fx,equirect_vert:Ox,equirect_frag:Bx,linedashed_vert:zx,linedashed_frag:Gx,meshbasic_vert:kx,meshbasic_frag:Hx,meshlambert_vert:Vx,meshlambert_frag:Wx,meshmatcap_vert:Xx,meshmatcap_frag:Yx,meshnormal_vert:qx,meshnormal_frag:jx,meshphong_vert:Kx,meshphong_frag:$x,meshphysical_vert:Zx,meshphysical_frag:Jx,meshtoon_vert:Qx,meshtoon_frag:tv,points_vert:ev,points_frag:nv,shadow_vert:iv,shadow_frag:sv,sprite_vert:rv,sprite_frag:av},Tt={common:{diffuse:{value:new Re(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ie},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ie}},envmap:{envMap:{value:null},envMapRotation:{value:new ie},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ie}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ie}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ie},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ie},normalScale:{value:new Xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ie},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ie}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ie}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ie}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Re(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Re(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0},uvTransform:{value:new ie}},sprite:{diffuse:{value:new Re(16777215)},opacity:{value:1},center:{value:new Xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ie},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0}}},Fi={basic:{uniforms:Un([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.fog]),vertexShader:se.meshbasic_vert,fragmentShader:se.meshbasic_frag},lambert:{uniforms:Un([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Re(0)}}]),vertexShader:se.meshlambert_vert,fragmentShader:se.meshlambert_frag},phong:{uniforms:Un([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Re(0)},specular:{value:new Re(1118481)},shininess:{value:30}}]),vertexShader:se.meshphong_vert,fragmentShader:se.meshphong_frag},standard:{uniforms:Un([Tt.common,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.roughnessmap,Tt.metalnessmap,Tt.fog,Tt.lights,{emissive:{value:new Re(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:se.meshphysical_vert,fragmentShader:se.meshphysical_frag},toon:{uniforms:Un([Tt.common,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.gradientmap,Tt.fog,Tt.lights,{emissive:{value:new Re(0)}}]),vertexShader:se.meshtoon_vert,fragmentShader:se.meshtoon_frag},matcap:{uniforms:Un([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,{matcap:{value:null}}]),vertexShader:se.meshmatcap_vert,fragmentShader:se.meshmatcap_frag},points:{uniforms:Un([Tt.points,Tt.fog]),vertexShader:se.points_vert,fragmentShader:se.points_frag},dashed:{uniforms:Un([Tt.common,Tt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:se.linedashed_vert,fragmentShader:se.linedashed_frag},depth:{uniforms:Un([Tt.common,Tt.displacementmap]),vertexShader:se.depth_vert,fragmentShader:se.depth_frag},normal:{uniforms:Un([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,{opacity:{value:1}}]),vertexShader:se.meshnormal_vert,fragmentShader:se.meshnormal_frag},sprite:{uniforms:Un([Tt.sprite,Tt.fog]),vertexShader:se.sprite_vert,fragmentShader:se.sprite_frag},background:{uniforms:{uvTransform:{value:new ie},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:se.background_vert,fragmentShader:se.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ie}},vertexShader:se.backgroundCube_vert,fragmentShader:se.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:se.cube_vert,fragmentShader:se.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:se.equirect_vert,fragmentShader:se.equirect_frag},distance:{uniforms:Un([Tt.common,Tt.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:se.distance_vert,fragmentShader:se.distance_frag},shadow:{uniforms:Un([Tt.lights,Tt.fog,{color:{value:new Re(0)},opacity:{value:1}}]),vertexShader:se.shadow_vert,fragmentShader:se.shadow_frag}};Fi.physical={uniforms:Un([Fi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ie},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ie},clearcoatNormalScale:{value:new Xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ie},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ie},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ie},sheen:{value:0},sheenColor:{value:new Re(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ie},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ie},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ie},transmissionSamplerSize:{value:new Xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ie},attenuationDistance:{value:0},attenuationColor:{value:new Re(0)},specularColor:{value:new Re(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ie},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ie},anisotropyVector:{value:new Xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ie}}]),vertexShader:se.meshphysical_vert,fragmentShader:se.meshphysical_frag};const Xo={r:0,b:0,g:0},Js=new xs,ov=new Ke;function lv(i,t,e,n,s,r,a){const o=new Re(0);let l=r===!0?0:1,c,h,u=null,f=0,m=null;function v(R){let A=R.isScene===!0?R.background:null;return A&&A.isTexture&&(A=(R.backgroundBlurriness>0?e:t).get(A)),A}function M(R){let A=!1;const D=v(R);D===null?d(o,l):D&&D.isColor&&(d(D,1),A=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,a):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||A)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(R,A){const D=v(A);D&&(D.isCubeTexture||D.mapping===yl)?(h===void 0&&(h=new Qn(new ho(1,1,1),new Yi({name:"BackgroundCubeMaterial",uniforms:ha(Fi.backgroundCube.uniforms),vertexShader:Fi.backgroundCube.vertexShader,fragmentShader:Fi.backgroundCube.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,N,k){this.matrixWorld.copyPosition(k.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Js.copy(A.backgroundRotation),Js.x*=-1,Js.y*=-1,Js.z*=-1,D.isCubeTexture&&D.isRenderTargetTexture===!1&&(Js.y*=-1,Js.z*=-1),h.material.uniforms.envMap.value=D,h.material.uniforms.flipEnvMap.value=D.isCubeTexture&&D.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(ov.makeRotationFromEuler(Js)),h.material.toneMapped=me.getTransfer(D.colorSpace)!==we,(u!==D||f!==D.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,u=D,f=D.version,m=i.toneMapping),h.layers.enableAll(),R.unshift(h,h.geometry,h.material,0,0,null)):D&&D.isTexture&&(c===void 0&&(c=new Qn(new El(2,2),new Yi({name:"BackgroundMaterial",uniforms:ha(Fi.background.uniforms),vertexShader:Fi.background.vertexShader,fragmentShader:Fi.background.fragmentShader,side:Fs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=D,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.toneMapped=me.getTransfer(D.colorSpace)!==we,D.matrixAutoUpdate===!0&&D.updateMatrix(),c.material.uniforms.uvTransform.value.copy(D.matrix),(u!==D||f!==D.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,u=D,f=D.version,m=i.toneMapping),c.layers.enableAll(),R.unshift(c,c.geometry,c.material,0,0,null))}function d(R,A){R.getRGB(Xo,Ip(i)),n.buffers.color.setClear(Xo.r,Xo.g,Xo.b,A,a)}function y(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(R,A=1){o.set(R),l=A,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(R){l=R,d(o,l)},render:M,addToRenderList:p,dispose:y}}function cv(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(T,L,W,z,K){let V=!1;const j=u(z,W,L);r!==j&&(r=j,c(r.object)),V=m(T,z,W,K),V&&v(T,z,W,K),K!==null&&t.update(K,i.ELEMENT_ARRAY_BUFFER),(V||a)&&(a=!1,A(T,L,W,z),K!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(K).buffer))}function l(){return i.createVertexArray()}function c(T){return i.bindVertexArray(T)}function h(T){return i.deleteVertexArray(T)}function u(T,L,W){const z=W.wireframe===!0;let K=n[T.id];K===void 0&&(K={},n[T.id]=K);let V=K[L.id];V===void 0&&(V={},K[L.id]=V);let j=V[z];return j===void 0&&(j=f(l()),V[z]=j),j}function f(T){const L=[],W=[],z=[];for(let K=0;K<e;K++)L[K]=0,W[K]=0,z[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:W,attributeDivisors:z,object:T,attributes:{},index:null}}function m(T,L,W,z){const K=r.attributes,V=L.attributes;let j=0;const G=W.getAttributes();for(const st in G)if(G[st].location>=0){const at=K[st];let ut=V[st];if(ut===void 0&&(st==="instanceMatrix"&&T.instanceMatrix&&(ut=T.instanceMatrix),st==="instanceColor"&&T.instanceColor&&(ut=T.instanceColor)),at===void 0||at.attribute!==ut||ut&&at.data!==ut.data)return!0;j++}return r.attributesNum!==j||r.index!==z}function v(T,L,W,z){const K={},V=L.attributes;let j=0;const G=W.getAttributes();for(const st in G)if(G[st].location>=0){let at=V[st];at===void 0&&(st==="instanceMatrix"&&T.instanceMatrix&&(at=T.instanceMatrix),st==="instanceColor"&&T.instanceColor&&(at=T.instanceColor));const ut={};ut.attribute=at,at&&at.data&&(ut.data=at.data),K[st]=ut,j++}r.attributes=K,r.attributesNum=j,r.index=z}function M(){const T=r.newAttributes;for(let L=0,W=T.length;L<W;L++)T[L]=0}function p(T){d(T,0)}function d(T,L){const W=r.newAttributes,z=r.enabledAttributes,K=r.attributeDivisors;W[T]=1,z[T]===0&&(i.enableVertexAttribArray(T),z[T]=1),K[T]!==L&&(i.vertexAttribDivisor(T,L),K[T]=L)}function y(){const T=r.newAttributes,L=r.enabledAttributes;for(let W=0,z=L.length;W<z;W++)L[W]!==T[W]&&(i.disableVertexAttribArray(W),L[W]=0)}function R(T,L,W,z,K,V,j){j===!0?i.vertexAttribIPointer(T,L,W,K,V):i.vertexAttribPointer(T,L,W,z,K,V)}function A(T,L,W,z){M();const K=z.attributes,V=W.getAttributes(),j=L.defaultAttributeValues;for(const G in V){const st=V[G];if(st.location>=0){let dt=K[G];if(dt===void 0&&(G==="instanceMatrix"&&T.instanceMatrix&&(dt=T.instanceMatrix),G==="instanceColor"&&T.instanceColor&&(dt=T.instanceColor)),dt!==void 0){const at=dt.normalized,ut=dt.itemSize,St=t.get(dt);if(St===void 0)continue;const ht=St.buffer,Qt=St.type,ee=St.bytesPerElement,Q=Qt===i.INT||Qt===i.UNSIGNED_INT||dt.gpuType===rh;if(dt.isInterleavedBufferAttribute){const et=dt.data,bt=et.stride,kt=dt.offset;if(et.isInstancedInterleavedBuffer){for(let _t=0;_t<st.locationSize;_t++)d(st.location+_t,et.meshPerAttribute);T.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let _t=0;_t<st.locationSize;_t++)p(st.location+_t);i.bindBuffer(i.ARRAY_BUFFER,ht);for(let _t=0;_t<st.locationSize;_t++)R(st.location+_t,ut/st.locationSize,Qt,at,bt*ee,(kt+ut/st.locationSize*_t)*ee,Q)}else{if(dt.isInstancedBufferAttribute){for(let et=0;et<st.locationSize;et++)d(st.location+et,dt.meshPerAttribute);T.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let et=0;et<st.locationSize;et++)p(st.location+et);i.bindBuffer(i.ARRAY_BUFFER,ht);for(let et=0;et<st.locationSize;et++)R(st.location+et,ut/st.locationSize,Qt,at,ut*ee,ut/st.locationSize*et*ee,Q)}}else if(j!==void 0){const at=j[G];if(at!==void 0)switch(at.length){case 2:i.vertexAttrib2fv(st.location,at);break;case 3:i.vertexAttrib3fv(st.location,at);break;case 4:i.vertexAttrib4fv(st.location,at);break;default:i.vertexAttrib1fv(st.location,at)}}}}y()}function D(){k();for(const T in n){const L=n[T];for(const W in L){const z=L[W];for(const K in z)h(z[K].object),delete z[K];delete L[W]}delete n[T]}}function w(T){if(n[T.id]===void 0)return;const L=n[T.id];for(const W in L){const z=L[W];for(const K in z)h(z[K].object),delete z[K];delete L[W]}delete n[T.id]}function N(T){for(const L in n){const W=n[L];if(W[T.id]===void 0)continue;const z=W[T.id];for(const K in z)h(z[K].object),delete z[K];delete W[T.id]}}function k(){E(),a=!0,r!==s&&(r=s,c(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:k,resetDefaultState:E,dispose:D,releaseStatesOfGeometry:w,releaseStatesOfProgram:N,initAttributes:M,enableAttribute:p,disableUnusedAttributes:y}}function uv(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function o(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let m=0;for(let v=0;v<u;v++)m+=h[v];e.update(m,n,1)}function l(c,h,u,f){if(u===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let v=0;v<c.length;v++)a(c[v],h[v],f[v]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let v=0;for(let M=0;M<u;M++)v+=h[M]*f[M];e.update(v,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function hv(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const N=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(N.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(N){return!(N!==Ti&&n.convert(N)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(N){const k=N===gs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(N!==hi&&n.convert(N)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&N!==Gi&&!k)}function l(N){if(N==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";N="mediump"}return N==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(Jt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),R=i.getParameter(i.MAX_VARYING_VECTORS),A=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),D=i.getParameter(i.MAX_SAMPLES),w=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:m,maxVertexTextures:v,maxTextureSize:M,maxCubemapSize:p,maxAttributes:d,maxVertexUniforms:y,maxVaryings:R,maxFragmentUniforms:A,maxSamples:D,samples:w}}function fv(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new Ds,o=new ie,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const m=u.length!==0||f||n!==0||s;return s=f,n=u.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,m){const v=u.clippingPlanes,M=u.clipIntersection,p=u.clipShadows,d=i.get(u);if(!s||v===null||v.length===0||r&&!p)r?h(null):c();else{const y=r?0:n,R=y*4;let A=d.clippingState||null;l.value=A,A=h(v,f,R,m);for(let D=0;D!==R;++D)A[D]=e[D];d.clippingState=A,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,m,v){const M=u!==null?u.length:0;let p=null;if(M!==0){if(p=l.value,v!==!0||p===null){const d=m+M*4,y=f.matrixWorldInverse;o.getNormalMatrix(y),(p===null||p.length<d)&&(p=new Float32Array(d));for(let R=0,A=m;R!==M;++R,A+=4)a.copy(u[R]).applyMatrix4(y,o),a.normal.toArray(p,A),p[A+3]=a.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=M,t.numIntersection=0,p}}function dv(i){let t=new WeakMap;function e(a,o){return o===jc?a.mapping=_r:o===Kc&&(a.mapping=oa),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===jc||o===Kc)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Fp(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const Us=4,Df=[.125,.215,.35,.446,.526,.582],rr=20,pv=256,Fa=new kp,Lf=new Re;let vc=null,Mc=0,Sc=0,yc=!1;const mv=new X;class If{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=mv}=r;vc=this._renderer.getRenderTarget(),Mc=this._renderer.getActiveCubeFace(),Sc=this._renderer.getActiveMipmapLevel(),yc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ff(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Nf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(vc,Mc,Sc),this._renderer.xr.enabled=yc,t.scissorTest=!1,$r(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===_r||t.mapping===oa?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),vc=this._renderer.getRenderTarget(),Mc=this._renderer.getActiveCubeFace(),Sc=this._renderer.getActiveMipmapLevel(),yc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:sn,minFilter:sn,generateMipmaps:!1,type:gs,format:Ti,colorSpace:ca,depthBuffer:!1},s=Uf(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Uf(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=gv(r)),this._blurMaterial=xv(r,t,e),this._ggxMaterial=_v(r,t,e)}return s}_compileMaterial(t){const e=new Qn(new pi,t);this._renderer.compile(e,Fa)}_sceneToCubeUV(t,e,n,s,r){const l=new ci(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,m=u.toneMapping;u.getClearColor(Lf),u.toneMapping=Hi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Qn(new ho,new ua({name:"PMREM.Background",side:kn,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,p=M.material;let d=!1;const y=t.background;y?y.isColor&&(p.color.copy(y),t.background=null,d=!0):(p.color.copy(Lf),d=!0);for(let R=0;R<6;R++){const A=R%3;A===0?(l.up.set(0,c[R],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[R],r.y,r.z)):A===1?(l.up.set(0,0,c[R]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[R],r.z)):(l.up.set(0,c[R],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[R]));const D=this._cubeSize;$r(s,A*D,R>2?D:0,D,D),u.setRenderTarget(s),d&&u.render(M,l),u.render(t,l)}u.toneMapping=m,u.autoClear=f,t.background=y}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===_r||t.mapping===oa;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ff()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Nf());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;$r(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Fa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),f=0+c*1.25,m=u*f,{_lodMax:v}=this,M=this._sizeLods[n],p=3*M*(n>v-Us?n-v+Us:0),d=4*(this._cubeSize-M);l.envMap.value=t.texture,l.roughness.value=m,l.mipInt.value=v-e,$r(r,p,d,3*M,2*M),s.setRenderTarget(r),s.render(o,Fa),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=v-n,$r(t,p,d,3*M,2*M),s.setRenderTarget(t),s.render(o,Fa)}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&de("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[s];u.material=c;const f=c.uniforms,m=this._sizeLods[n]-1,v=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*rr-1),M=r/v,p=isFinite(r)?1+Math.floor(h*M):rr;p>rr&&Jt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${rr}`);const d=[];let y=0;for(let N=0;N<rr;++N){const k=N/M,E=Math.exp(-k*k/2);d.push(E),N===0?y+=E:N<p&&(y+=2*E)}for(let N=0;N<d.length;N++)d[N]=d[N]/y;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:R}=this;f.dTheta.value=v,f.mipInt.value=R-n;const A=this._sizeLods[s],D=3*A*(s>R-Us?s-R+Us:0),w=4*(this._cubeSize-A);$r(e,D,w,3*A,2*A),l.setRenderTarget(e),l.render(u,Fa)}}function gv(i){const t=[],e=[],n=[];let s=i;const r=i-Us+1+Df.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>i-Us?l=Df[a-i+Us-1]:a===0&&(l=0),e.push(l);const c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],m=6,v=6,M=3,p=2,d=1,y=new Float32Array(M*v*m),R=new Float32Array(p*v*m),A=new Float32Array(d*v*m);for(let w=0;w<m;w++){const N=w%3*2/3-1,k=w>2?0:-1,E=[N,k,0,N+2/3,k,0,N+2/3,k+1,0,N,k,0,N+2/3,k+1,0,N,k+1,0];y.set(E,M*v*w),R.set(f,p*v*w);const T=[w,w,w,w,w,w];A.set(T,d*v*w)}const D=new pi;D.setAttribute("position",new Vn(y,M)),D.setAttribute("uv",new Vn(R,p)),D.setAttribute("faceIndex",new Vn(A,d)),n.push(new Qn(D,null)),s>Us&&s--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function Uf(i,t,e){const n=new Vi(i,t,e);return n.texture.mapping=yl,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function $r(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function _v(i,t,e){return new Yi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:pv,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Tl(),fragmentShader:`

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
		`,blending:us,depthTest:!1,depthWrite:!1})}function xv(i,t,e){const n=new Float32Array(rr),s=new X(0,1,0);return new Yi({name:"SphericalGaussianBlur",defines:{n:rr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Tl(),fragmentShader:`

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
		`,blending:us,depthTest:!1,depthWrite:!1})}function Nf(){return new Yi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Tl(),fragmentShader:`

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
		`,blending:us,depthTest:!1,depthWrite:!1})}function Ff(){return new Yi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:us,depthTest:!1,depthWrite:!1})}function Tl(){return`

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
	`}function vv(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===jc||l===Kc,h=l===_r||l===oa;if(c||h){let u=t.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new If(i)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const m=o.image;return c&&m&&m.height>0||h&&m&&s(m)?(e===null&&(e=new If(i)),u=c?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Mv(i){const t={};function e(n){if(t[n]!==void 0)return t[n];const s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&no("WebGLRenderer: "+n+" extension not supported."),s}}}function Sv(i,t,e,n){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const v in f.attributes)t.remove(f.attributes[v]);f.removeEventListener("dispose",a),delete s[f.id];const m=r.get(f);m&&(t.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function l(u){const f=u.attributes;for(const m in f)t.update(f[m],i.ARRAY_BUFFER)}function c(u){const f=[],m=u.index,v=u.attributes.position;let M=0;if(m!==null){const y=m.array;M=m.version;for(let R=0,A=y.length;R<A;R+=3){const D=y[R+0],w=y[R+1],N=y[R+2];f.push(D,w,w,N,N,D)}}else if(v!==void 0){const y=v.array;M=v.version;for(let R=0,A=y.length/3-1;R<A;R+=3){const D=R+0,w=R+1,N=R+2;f.push(D,w,w,N,N,D)}}else return;const p=new(Rp(f)?Lp:Dp)(f,1);p.version=M;const d=r.get(u);d&&t.remove(d),r.set(u,p)}function h(u){const f=r.get(u);if(f){const m=u.index;m!==null&&f.version<m.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function yv(i,t,e){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,m){i.drawElements(n,m,r,f*a),e.update(m,n,1)}function c(f,m,v){v!==0&&(i.drawElementsInstanced(n,m,r,f*a,v),e.update(m,n,v))}function h(f,m,v){if(v===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,f,0,v);let p=0;for(let d=0;d<v;d++)p+=m[d];e.update(p,n,1)}function u(f,m,v,M){if(v===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let d=0;d<f.length;d++)c(f[d]/a,m[d],M[d]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,r,f,0,M,0,v);let d=0;for(let y=0;y<v;y++)d+=m[y]*M[y];e.update(d,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Ev(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:de("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function bv(i,t,e){const n=new WeakMap,s=new $e;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let T=function(){k.dispose(),n.delete(o),o.removeEventListener("dispose",T)};var m=T;f!==void 0&&f.texture.dispose();const v=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],R=o.morphAttributes.color||[];let A=0;v===!0&&(A=1),M===!0&&(A=2),p===!0&&(A=3);let D=o.attributes.position.count*A,w=1;D>t.maxTextureSize&&(w=Math.ceil(D/t.maxTextureSize),D=t.maxTextureSize);const N=new Float32Array(D*w*4*u),k=new Cp(N,D,w,u);k.type=Gi,k.needsUpdate=!0;const E=A*4;for(let L=0;L<u;L++){const W=d[L],z=y[L],K=R[L],V=D*w*4*L;for(let j=0;j<W.count;j++){const G=j*E;v===!0&&(s.fromBufferAttribute(W,j),N[V+G+0]=s.x,N[V+G+1]=s.y,N[V+G+2]=s.z,N[V+G+3]=0),M===!0&&(s.fromBufferAttribute(z,j),N[V+G+4]=s.x,N[V+G+5]=s.y,N[V+G+6]=s.z,N[V+G+7]=0),p===!0&&(s.fromBufferAttribute(K,j),N[V+G+8]=s.x,N[V+G+9]=s.y,N[V+G+10]=s.z,N[V+G+11]=K.itemSize===4?s.w:1)}}f={count:u,texture:k,size:new Xt(D,w)},n.set(o,f),o.addEventListener("dispose",T)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let v=0;for(let p=0;p<c.length;p++)v+=c[p];const M=o.morphTargetsRelative?1:1-v;l.getUniforms().setValue(i,"morphTargetBaseInfluence",M),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function Tv(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}const Av={[dp]:"LINEAR_TONE_MAPPING",[pp]:"REINHARD_TONE_MAPPING",[mp]:"CINEON_TONE_MAPPING",[gp]:"ACES_FILMIC_TONE_MAPPING",[xp]:"AGX_TONE_MAPPING",[vp]:"NEUTRAL_TONE_MAPPING",[_p]:"CUSTOM_TONE_MAPPING"};function wv(i,t,e,n,s){const r=new Vi(t,e,{type:i,depthBuffer:n,stencilBuffer:s}),a=new Vi(t,e,{type:gs,depthBuffer:!1,stencilBuffer:!1}),o=new pi;o.setAttribute("position",new di([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new di([0,2,0,0,2,0],2));const l=new M0({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),c=new Qn(o,l),h=new kp(-1,1,1,-1,0,1);let u=null,f=null,m=!1,v,M=null,p=[],d=!1;this.setSize=function(y,R){r.setSize(y,R),a.setSize(y,R);for(let A=0;A<p.length;A++){const D=p[A];D.setSize&&D.setSize(y,R)}},this.setEffects=function(y){p=y,d=p.length>0&&p[0].isRenderPass===!0;const R=r.width,A=r.height;for(let D=0;D<p.length;D++){const w=p[D];w.setSize&&w.setSize(R,A)}},this.begin=function(y,R){if(m||y.toneMapping===Hi&&p.length===0)return!1;if(M=R,R!==null){const A=R.width,D=R.height;(r.width!==A||r.height!==D)&&this.setSize(A,D)}return d===!1&&y.setRenderTarget(r),v=y.toneMapping,y.toneMapping=Hi,!0},this.hasRenderPass=function(){return d},this.end=function(y,R){y.toneMapping=v,m=!0;let A=r,D=a;for(let w=0;w<p.length;w++){const N=p[w];if(N.enabled!==!1&&(N.render(y,D,A,R),N.needsSwap!==!1)){const k=A;A=D,D=k}}if(u!==y.outputColorSpace||f!==y.toneMapping){u=y.outputColorSpace,f=y.toneMapping,l.defines={},me.getTransfer(u)===we&&(l.defines.SRGB_TRANSFER="");const w=Av[f];w&&(l.defines[w]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=A.texture,y.setRenderTarget(M),y.render(c,h),M=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){r.dispose(),a.dispose(),o.dispose(),l.dispose()}}const Vp=new Cn,Iu=new so(1,1),Wp=new Cp,Xp=new Kg,Yp=new Np,Of=[],Bf=[],zf=new Float32Array(16),Gf=new Float32Array(9),kf=new Float32Array(4);function _a(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Of[s];if(r===void 0&&(r=new Float32Array(s),Of[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function hn(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function fn(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Al(i,t){let e=Bf[t];e===void 0&&(e=new Int32Array(t),Bf[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Rv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Cv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(hn(e,t))return;i.uniform2fv(this.addr,t),fn(e,t)}}function Pv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(hn(e,t))return;i.uniform3fv(this.addr,t),fn(e,t)}}function Dv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(hn(e,t))return;i.uniform4fv(this.addr,t),fn(e,t)}}function Lv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(hn(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),fn(e,t)}else{if(hn(e,n))return;kf.set(n),i.uniformMatrix2fv(this.addr,!1,kf),fn(e,n)}}function Iv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(hn(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),fn(e,t)}else{if(hn(e,n))return;Gf.set(n),i.uniformMatrix3fv(this.addr,!1,Gf),fn(e,n)}}function Uv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(hn(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),fn(e,t)}else{if(hn(e,n))return;zf.set(n),i.uniformMatrix4fv(this.addr,!1,zf),fn(e,n)}}function Nv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Fv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(hn(e,t))return;i.uniform2iv(this.addr,t),fn(e,t)}}function Ov(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(hn(e,t))return;i.uniform3iv(this.addr,t),fn(e,t)}}function Bv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(hn(e,t))return;i.uniform4iv(this.addr,t),fn(e,t)}}function zv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Gv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(hn(e,t))return;i.uniform2uiv(this.addr,t),fn(e,t)}}function kv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(hn(e,t))return;i.uniform3uiv(this.addr,t),fn(e,t)}}function Hv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(hn(e,t))return;i.uniform4uiv(this.addr,t),fn(e,t)}}function Vv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Iu.compareFunction=e.isReversedDepthBuffer()?fh:hh,r=Iu):r=Vp,e.setTexture2D(t||r,s)}function Wv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Xp,s)}function Xv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Yp,s)}function Yv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Wp,s)}function qv(i){switch(i){case 5126:return Rv;case 35664:return Cv;case 35665:return Pv;case 35666:return Dv;case 35674:return Lv;case 35675:return Iv;case 35676:return Uv;case 5124:case 35670:return Nv;case 35667:case 35671:return Fv;case 35668:case 35672:return Ov;case 35669:case 35673:return Bv;case 5125:return zv;case 36294:return Gv;case 36295:return kv;case 36296:return Hv;case 35678:case 36198:case 36298:case 36306:case 35682:return Vv;case 35679:case 36299:case 36307:return Wv;case 35680:case 36300:case 36308:case 36293:return Xv;case 36289:case 36303:case 36311:case 36292:return Yv}}function jv(i,t){i.uniform1fv(this.addr,t)}function Kv(i,t){const e=_a(t,this.size,2);i.uniform2fv(this.addr,e)}function $v(i,t){const e=_a(t,this.size,3);i.uniform3fv(this.addr,e)}function Zv(i,t){const e=_a(t,this.size,4);i.uniform4fv(this.addr,e)}function Jv(i,t){const e=_a(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Qv(i,t){const e=_a(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function tM(i,t){const e=_a(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function eM(i,t){i.uniform1iv(this.addr,t)}function nM(i,t){i.uniform2iv(this.addr,t)}function iM(i,t){i.uniform3iv(this.addr,t)}function sM(i,t){i.uniform4iv(this.addr,t)}function rM(i,t){i.uniform1uiv(this.addr,t)}function aM(i,t){i.uniform2uiv(this.addr,t)}function oM(i,t){i.uniform3uiv(this.addr,t)}function lM(i,t){i.uniform4uiv(this.addr,t)}function cM(i,t,e){const n=this.cache,s=t.length,r=Al(e,s);hn(n,r)||(i.uniform1iv(this.addr,r),fn(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Iu:a=Vp;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function uM(i,t,e){const n=this.cache,s=t.length,r=Al(e,s);hn(n,r)||(i.uniform1iv(this.addr,r),fn(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Xp,r[a])}function hM(i,t,e){const n=this.cache,s=t.length,r=Al(e,s);hn(n,r)||(i.uniform1iv(this.addr,r),fn(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Yp,r[a])}function fM(i,t,e){const n=this.cache,s=t.length,r=Al(e,s);hn(n,r)||(i.uniform1iv(this.addr,r),fn(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Wp,r[a])}function dM(i){switch(i){case 5126:return jv;case 35664:return Kv;case 35665:return $v;case 35666:return Zv;case 35674:return Jv;case 35675:return Qv;case 35676:return tM;case 5124:case 35670:return eM;case 35667:case 35671:return nM;case 35668:case 35672:return iM;case 35669:case 35673:return sM;case 5125:return rM;case 36294:return aM;case 36295:return oM;case 36296:return lM;case 35678:case 36198:case 36298:case 36306:case 35682:return cM;case 35679:case 36299:case 36307:return uM;case 35680:case 36300:case 36308:case 36293:return hM;case 36289:case 36303:case 36311:case 36292:return fM}}class pM{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=qv(e.type)}}class mM{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=dM(e.type)}}class gM{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Ec=/(\w+)(\])?(\[|\.)?/g;function Hf(i,t){i.seq.push(t),i.map[t.id]=t}function _M(i,t,e){const n=i.name,s=n.length;for(Ec.lastIndex=0;;){const r=Ec.exec(n),a=Ec.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Hf(e,c===void 0?new pM(o,i,t):new mM(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new gM(o),Hf(e,u)),e=u}}}class sl{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);_M(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Vf(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const xM=37297;let vM=0;function MM(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Wf=new ie;function SM(i){me._getMatrix(Wf,me.workingColorSpace,i);const t=`mat3( ${Wf.elements.map(e=>e.toFixed(4))} )`;switch(me.getTransfer(i)){case ol:return[t,"LinearTransferOETF"];case we:return[t,"sRGBTransferOETF"];default:return Jt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Xf(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+MM(i.getShaderSource(t),o)}else return r}function yM(i,t){const e=SM(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const EM={[dp]:"Linear",[pp]:"Reinhard",[mp]:"Cineon",[gp]:"ACESFilmic",[xp]:"AgX",[vp]:"Neutral",[_p]:"Custom"};function bM(i,t){const e=EM[t];return e===void 0?(Jt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Yo=new X;function TM(){me.getLuminanceCoefficients(Yo);const i=Yo.x.toFixed(4),t=Yo.y.toFixed(4),e=Yo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function AM(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Xa).join(`
`)}function wM(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function RM(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Xa(i){return i!==""}function Yf(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function qf(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const CM=/^[ \t]*#include +<([\w\d./]+)>/gm;function Uu(i){return i.replace(CM,DM)}const PM=new Map;function DM(i,t){let e=se[t];if(e===void 0){const n=PM.get(t);if(n!==void 0)e=se[n],Jt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Uu(e)}const LM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function jf(i){return i.replace(LM,IM)}function IM(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Kf(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const UM={[Jo]:"SHADOWMAP_TYPE_PCF",[Va]:"SHADOWMAP_TYPE_VSM"};function NM(i){return UM[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const FM={[_r]:"ENVMAP_TYPE_CUBE",[oa]:"ENVMAP_TYPE_CUBE",[yl]:"ENVMAP_TYPE_CUBE_UV"};function OM(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":FM[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const BM={[oa]:"ENVMAP_MODE_REFRACTION"};function zM(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":BM[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const GM={[fp]:"ENVMAP_BLENDING_MULTIPLY",[Rg]:"ENVMAP_BLENDING_MIX",[Cg]:"ENVMAP_BLENDING_ADD"};function kM(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":GM[i.combine]||"ENVMAP_BLENDING_NONE"}function HM(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function VM(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=NM(e),c=OM(e),h=zM(e),u=kM(e),f=HM(e),m=AM(e),v=wM(r),M=s.createProgram();let p,d,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Xa).join(`
`),p.length>0&&(p+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Xa).join(`
`),d.length>0&&(d+=`
`)):(p=[Kf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xa).join(`
`),d=[Kf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Hi?"#define TONE_MAPPING":"",e.toneMapping!==Hi?se.tonemapping_pars_fragment:"",e.toneMapping!==Hi?bM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",se.colorspace_pars_fragment,yM("linearToOutputTexel",e.outputColorSpace),TM(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Xa).join(`
`)),a=Uu(a),a=Yf(a,e),a=qf(a,e),o=Uu(o),o=Yf(o,e),o=qf(o,e),a=jf(a),o=jf(o),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,d=["#define varying in",e.glslVersion===of?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===of?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const R=y+p+a,A=y+d+o,D=Vf(s,s.VERTEX_SHADER,R),w=Vf(s,s.FRAGMENT_SHADER,A);s.attachShader(M,D),s.attachShader(M,w),e.index0AttributeName!==void 0?s.bindAttribLocation(M,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function N(L){if(i.debug.checkShaderErrors){const W=s.getProgramInfoLog(M)||"",z=s.getShaderInfoLog(D)||"",K=s.getShaderInfoLog(w)||"",V=W.trim(),j=z.trim(),G=K.trim();let st=!0,dt=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(st=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,M,D,w);else{const at=Xf(s,D,"vertex"),ut=Xf(s,w,"fragment");de("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+V+`
`+at+`
`+ut)}else V!==""?Jt("WebGLProgram: Program Info Log:",V):(j===""||G==="")&&(dt=!1);dt&&(L.diagnostics={runnable:st,programLog:V,vertexShader:{log:j,prefix:p},fragmentShader:{log:G,prefix:d}})}s.deleteShader(D),s.deleteShader(w),k=new sl(s,M),E=RM(s,M)}let k;this.getUniforms=function(){return k===void 0&&N(this),k};let E;this.getAttributes=function(){return E===void 0&&N(this),E};let T=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=s.getProgramParameter(M,xM)),T},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=vM++,this.cacheKey=t,this.usedTimes=1,this.program=M,this.vertexShader=D,this.fragmentShader=w,this}let WM=0;class XM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new YM(t),e.set(t,n)),n}}class YM{constructor(t){this.id=WM++,this.code=t,this.usedTimes=0}}function qM(i,t,e,n,s,r,a){const o=new gh,l=new XM,c=new Set,h=[],u=new Map,f=s.logarithmicDepthBuffer;let m=s.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(E){return c.add(E),E===0?"uv":`uv${E}`}function p(E,T,L,W,z){const K=W.fog,V=z.geometry,j=E.isMeshStandardMaterial?W.environment:null,G=(E.isMeshStandardMaterial?e:t).get(E.envMap||j),st=G&&G.mapping===yl?G.image.height:null,dt=v[E.type];E.precision!==null&&(m=s.getMaxPrecision(E.precision),m!==E.precision&&Jt("WebGLProgram.getParameters:",E.precision,"not supported, using",m,"instead."));const at=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ut=at!==void 0?at.length:0;let St=0;V.morphAttributes.position!==void 0&&(St=1),V.morphAttributes.normal!==void 0&&(St=2),V.morphAttributes.color!==void 0&&(St=3);let ht,Qt,ee,Q;if(dt){const ve=Fi[dt];ht=ve.vertexShader,Qt=ve.fragmentShader}else ht=E.vertexShader,Qt=E.fragmentShader,l.update(E),ee=l.getVertexShaderID(E),Q=l.getFragmentShaderID(E);const et=i.getRenderTarget(),bt=i.state.buffers.depth.getReversed(),kt=z.isInstancedMesh===!0,_t=z.isBatchedMesh===!0,te=!!E.map,Ce=!!E.matcap,Yt=!!G,re=!!E.aoMap,he=!!E.lightMap,qt=!!E.bumpMap,Oe=!!E.normalMap,F=!!E.displacementMap,Pe=!!E.emissiveMap,jt=!!E.metalnessMap,pe=!!E.roughnessMap,Dt=E.anisotropy>0,P=E.clearcoat>0,x=E.dispersion>0,U=E.iridescence>0,Z=E.sheen>0,nt=E.transmission>0,tt=Dt&&!!E.anisotropyMap,Nt=P&&!!E.clearcoatMap,mt=P&&!!E.clearcoatNormalMap,Lt=P&&!!E.clearcoatRoughnessMap,Bt=U&&!!E.iridescenceMap,ot=U&&!!E.iridescenceThicknessMap,pt=Z&&!!E.sheenColorMap,At=Z&&!!E.sheenRoughnessMap,Ot=!!E.specularMap,xt=!!E.specularColorMap,Kt=!!E.specularIntensityMap,O=nt&&!!E.transmissionMap,yt=nt&&!!E.thicknessMap,lt=!!E.gradientMap,wt=!!E.alphaMap,ft=E.alphaTest>0,rt=!!E.alphaHash,vt=!!E.extensions;let $t=Hi;E.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&($t=i.toneMapping);const De={shaderID:dt,shaderType:E.type,shaderName:E.name,vertexShader:ht,fragmentShader:Qt,defines:E.defines,customVertexShaderID:ee,customFragmentShaderID:Q,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:m,batching:_t,batchingColor:_t&&z._colorsTexture!==null,instancing:kt,instancingColor:kt&&z.instanceColor!==null,instancingMorph:kt&&z.morphTexture!==null,outputColorSpace:et===null?i.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:ca,alphaToCoverage:!!E.alphaToCoverage,map:te,matcap:Ce,envMap:Yt,envMapMode:Yt&&G.mapping,envMapCubeUVHeight:st,aoMap:re,lightMap:he,bumpMap:qt,normalMap:Oe,displacementMap:F,emissiveMap:Pe,normalMapObjectSpace:Oe&&E.normalMapType===Ig,normalMapTangentSpace:Oe&&E.normalMapType===Lg,metalnessMap:jt,roughnessMap:pe,anisotropy:Dt,anisotropyMap:tt,clearcoat:P,clearcoatMap:Nt,clearcoatNormalMap:mt,clearcoatRoughnessMap:Lt,dispersion:x,iridescence:U,iridescenceMap:Bt,iridescenceThicknessMap:ot,sheen:Z,sheenColorMap:pt,sheenRoughnessMap:At,specularMap:Ot,specularColorMap:xt,specularIntensityMap:Kt,transmission:nt,transmissionMap:O,thicknessMap:yt,gradientMap:lt,opaque:E.transparent===!1&&E.blending===na&&E.alphaToCoverage===!1,alphaMap:wt,alphaTest:ft,alphaHash:rt,combine:E.combine,mapUv:te&&M(E.map.channel),aoMapUv:re&&M(E.aoMap.channel),lightMapUv:he&&M(E.lightMap.channel),bumpMapUv:qt&&M(E.bumpMap.channel),normalMapUv:Oe&&M(E.normalMap.channel),displacementMapUv:F&&M(E.displacementMap.channel),emissiveMapUv:Pe&&M(E.emissiveMap.channel),metalnessMapUv:jt&&M(E.metalnessMap.channel),roughnessMapUv:pe&&M(E.roughnessMap.channel),anisotropyMapUv:tt&&M(E.anisotropyMap.channel),clearcoatMapUv:Nt&&M(E.clearcoatMap.channel),clearcoatNormalMapUv:mt&&M(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Lt&&M(E.clearcoatRoughnessMap.channel),iridescenceMapUv:Bt&&M(E.iridescenceMap.channel),iridescenceThicknessMapUv:ot&&M(E.iridescenceThicknessMap.channel),sheenColorMapUv:pt&&M(E.sheenColorMap.channel),sheenRoughnessMapUv:At&&M(E.sheenRoughnessMap.channel),specularMapUv:Ot&&M(E.specularMap.channel),specularColorMapUv:xt&&M(E.specularColorMap.channel),specularIntensityMapUv:Kt&&M(E.specularIntensityMap.channel),transmissionMapUv:O&&M(E.transmissionMap.channel),thicknessMapUv:yt&&M(E.thicknessMap.channel),alphaMapUv:wt&&M(E.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(Oe||Dt),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!V.attributes.uv&&(te||wt),fog:!!K,useFog:E.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:E.flatShading===!0&&E.wireframe===!1,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:bt,skinning:z.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:ut,morphTextureStride:St,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:$t,decodeVideoTexture:te&&E.map.isVideoTexture===!0&&me.getTransfer(E.map.colorSpace)===we,decodeVideoTextureEmissive:Pe&&E.emissiveMap.isVideoTexture===!0&&me.getTransfer(E.emissiveMap.colorSpace)===we,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===Bi,flipSided:E.side===kn,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:vt&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(vt&&E.extensions.multiDraw===!0||_t)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return De.vertexUv1s=c.has(1),De.vertexUv2s=c.has(2),De.vertexUv3s=c.has(3),c.clear(),De}function d(E){const T=[];if(E.shaderID?T.push(E.shaderID):(T.push(E.customVertexShaderID),T.push(E.customFragmentShaderID)),E.defines!==void 0)for(const L in E.defines)T.push(L),T.push(E.defines[L]);return E.isRawShaderMaterial===!1&&(y(T,E),R(T,E),T.push(i.outputColorSpace)),T.push(E.customProgramCacheKey),T.join()}function y(E,T){E.push(T.precision),E.push(T.outputColorSpace),E.push(T.envMapMode),E.push(T.envMapCubeUVHeight),E.push(T.mapUv),E.push(T.alphaMapUv),E.push(T.lightMapUv),E.push(T.aoMapUv),E.push(T.bumpMapUv),E.push(T.normalMapUv),E.push(T.displacementMapUv),E.push(T.emissiveMapUv),E.push(T.metalnessMapUv),E.push(T.roughnessMapUv),E.push(T.anisotropyMapUv),E.push(T.clearcoatMapUv),E.push(T.clearcoatNormalMapUv),E.push(T.clearcoatRoughnessMapUv),E.push(T.iridescenceMapUv),E.push(T.iridescenceThicknessMapUv),E.push(T.sheenColorMapUv),E.push(T.sheenRoughnessMapUv),E.push(T.specularMapUv),E.push(T.specularColorMapUv),E.push(T.specularIntensityMapUv),E.push(T.transmissionMapUv),E.push(T.thicknessMapUv),E.push(T.combine),E.push(T.fogExp2),E.push(T.sizeAttenuation),E.push(T.morphTargetsCount),E.push(T.morphAttributeCount),E.push(T.numDirLights),E.push(T.numPointLights),E.push(T.numSpotLights),E.push(T.numSpotLightMaps),E.push(T.numHemiLights),E.push(T.numRectAreaLights),E.push(T.numDirLightShadows),E.push(T.numPointLightShadows),E.push(T.numSpotLightShadows),E.push(T.numSpotLightShadowsWithMaps),E.push(T.numLightProbes),E.push(T.shadowMapType),E.push(T.toneMapping),E.push(T.numClippingPlanes),E.push(T.numClipIntersection),E.push(T.depthPacking)}function R(E,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),E.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),E.push(o.mask)}function A(E){const T=v[E.type];let L;if(T){const W=Fi[T];L=l0.clone(W.uniforms)}else L=E.uniforms;return L}function D(E,T){let L=u.get(T);return L!==void 0?++L.usedTimes:(L=new VM(i,T,E,r),h.push(L),u.set(T,L)),L}function w(E){if(--E.usedTimes===0){const T=h.indexOf(E);h[T]=h[h.length-1],h.pop(),u.delete(E.cacheKey),E.destroy()}}function N(E){l.remove(E)}function k(){l.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:A,acquireProgram:D,releaseProgram:w,releaseShaderCache:N,programs:h,dispose:k}}function jM(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function KM(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function $f(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Zf(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,f,m,v,M,p){let d=i[t];return d===void 0?(d={id:u.id,object:u,geometry:f,material:m,groupOrder:v,renderOrder:u.renderOrder,z:M,group:p},i[t]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=m,d.groupOrder=v,d.renderOrder=u.renderOrder,d.z=M,d.group=p),t++,d}function o(u,f,m,v,M,p){const d=a(u,f,m,v,M,p);m.transmission>0?n.push(d):m.transparent===!0?s.push(d):e.push(d)}function l(u,f,m,v,M,p){const d=a(u,f,m,v,M,p);m.transmission>0?n.unshift(d):m.transparent===!0?s.unshift(d):e.unshift(d)}function c(u,f){e.length>1&&e.sort(u||KM),n.length>1&&n.sort(f||$f),s.length>1&&s.sort(f||$f)}function h(){for(let u=t,f=i.length;u<f;u++){const m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function $M(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Zf,i.set(n,[a])):s>=r.length?(a=new Zf,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function ZM(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new X,color:new Re};break;case"SpotLight":e={position:new X,direction:new X,color:new Re,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new X,color:new Re,distance:0,decay:0};break;case"HemisphereLight":e={direction:new X,skyColor:new Re,groundColor:new Re};break;case"RectAreaLight":e={color:new Re,position:new X,halfWidth:new X,halfHeight:new X};break}return i[t.id]=e,e}}}function JM(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let QM=0;function tS(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function eS(i){const t=new ZM,e=JM(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new X);const s=new X,r=new Ke,a=new Ke;function o(c){let h=0,u=0,f=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let m=0,v=0,M=0,p=0,d=0,y=0,R=0,A=0,D=0,w=0,N=0;c.sort(tS);for(let E=0,T=c.length;E<T;E++){const L=c[E],W=L.color,z=L.intensity,K=L.distance;let V=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===la?V=L.shadow.map.texture:V=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=W.r*z,u+=W.g*z,f+=W.b*z;else if(L.isLightProbe){for(let j=0;j<9;j++)n.probe[j].addScaledVector(L.sh.coefficients[j],z);N++}else if(L.isDirectionalLight){const j=t.get(L);if(j.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const G=L.shadow,st=e.get(L);st.shadowIntensity=G.intensity,st.shadowBias=G.bias,st.shadowNormalBias=G.normalBias,st.shadowRadius=G.radius,st.shadowMapSize=G.mapSize,n.directionalShadow[m]=st,n.directionalShadowMap[m]=V,n.directionalShadowMatrix[m]=L.shadow.matrix,y++}n.directional[m]=j,m++}else if(L.isSpotLight){const j=t.get(L);j.position.setFromMatrixPosition(L.matrixWorld),j.color.copy(W).multiplyScalar(z),j.distance=K,j.coneCos=Math.cos(L.angle),j.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),j.decay=L.decay,n.spot[M]=j;const G=L.shadow;if(L.map&&(n.spotLightMap[D]=L.map,D++,G.updateMatrices(L),L.castShadow&&w++),n.spotLightMatrix[M]=G.matrix,L.castShadow){const st=e.get(L);st.shadowIntensity=G.intensity,st.shadowBias=G.bias,st.shadowNormalBias=G.normalBias,st.shadowRadius=G.radius,st.shadowMapSize=G.mapSize,n.spotShadow[M]=st,n.spotShadowMap[M]=V,A++}M++}else if(L.isRectAreaLight){const j=t.get(L);j.color.copy(W).multiplyScalar(z),j.halfWidth.set(L.width*.5,0,0),j.halfHeight.set(0,L.height*.5,0),n.rectArea[p]=j,p++}else if(L.isPointLight){const j=t.get(L);if(j.color.copy(L.color).multiplyScalar(L.intensity),j.distance=L.distance,j.decay=L.decay,L.castShadow){const G=L.shadow,st=e.get(L);st.shadowIntensity=G.intensity,st.shadowBias=G.bias,st.shadowNormalBias=G.normalBias,st.shadowRadius=G.radius,st.shadowMapSize=G.mapSize,st.shadowCameraNear=G.camera.near,st.shadowCameraFar=G.camera.far,n.pointShadow[v]=st,n.pointShadowMap[v]=V,n.pointShadowMatrix[v]=L.shadow.matrix,R++}n.point[v]=j,v++}else if(L.isHemisphereLight){const j=t.get(L);j.skyColor.copy(L.color).multiplyScalar(z),j.groundColor.copy(L.groundColor).multiplyScalar(z),n.hemi[d]=j,d++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Tt.LTC_FLOAT_1,n.rectAreaLTC2=Tt.LTC_FLOAT_2):(n.rectAreaLTC1=Tt.LTC_HALF_1,n.rectAreaLTC2=Tt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const k=n.hash;(k.directionalLength!==m||k.pointLength!==v||k.spotLength!==M||k.rectAreaLength!==p||k.hemiLength!==d||k.numDirectionalShadows!==y||k.numPointShadows!==R||k.numSpotShadows!==A||k.numSpotMaps!==D||k.numLightProbes!==N)&&(n.directional.length=m,n.spot.length=M,n.rectArea.length=p,n.point.length=v,n.hemi.length=d,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=R,n.pointShadowMap.length=R,n.spotShadow.length=A,n.spotShadowMap.length=A,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=R,n.spotLightMatrix.length=A+D-w,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=N,k.directionalLength=m,k.pointLength=v,k.spotLength=M,k.rectAreaLength=p,k.hemiLength=d,k.numDirectionalShadows=y,k.numPointShadows=R,k.numSpotShadows=A,k.numSpotMaps=D,k.numLightProbes=N,n.version=QM++)}function l(c,h){let u=0,f=0,m=0,v=0,M=0;const p=h.matrixWorldInverse;for(let d=0,y=c.length;d<y;d++){const R=c[d];if(R.isDirectionalLight){const A=n.directional[u];A.direction.setFromMatrixPosition(R.matrixWorld),s.setFromMatrixPosition(R.target.matrixWorld),A.direction.sub(s),A.direction.transformDirection(p),u++}else if(R.isSpotLight){const A=n.spot[m];A.position.setFromMatrixPosition(R.matrixWorld),A.position.applyMatrix4(p),A.direction.setFromMatrixPosition(R.matrixWorld),s.setFromMatrixPosition(R.target.matrixWorld),A.direction.sub(s),A.direction.transformDirection(p),m++}else if(R.isRectAreaLight){const A=n.rectArea[v];A.position.setFromMatrixPosition(R.matrixWorld),A.position.applyMatrix4(p),a.identity(),r.copy(R.matrixWorld),r.premultiply(p),a.extractRotation(r),A.halfWidth.set(R.width*.5,0,0),A.halfHeight.set(0,R.height*.5,0),A.halfWidth.applyMatrix4(a),A.halfHeight.applyMatrix4(a),v++}else if(R.isPointLight){const A=n.point[f];A.position.setFromMatrixPosition(R.matrixWorld),A.position.applyMatrix4(p),f++}else if(R.isHemisphereLight){const A=n.hemi[M];A.direction.setFromMatrixPosition(R.matrixWorld),A.direction.transformDirection(p),M++}}}return{setup:o,setupView:l,state:n}}function Jf(i){const t=new eS(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function nS(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Jf(i),t.set(s,[o])):r>=a.length?(o=new Jf(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const iS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,sS=`uniform sampler2D shadow_pass;
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
}`,rS=[new X(1,0,0),new X(-1,0,0),new X(0,1,0),new X(0,-1,0),new X(0,0,1),new X(0,0,-1)],aS=[new X(0,-1,0),new X(0,-1,0),new X(0,0,1),new X(0,0,-1),new X(0,-1,0),new X(0,-1,0)],Qf=new Ke,Oa=new X,bc=new X;function oS(i,t,e){let n=new Bp;const s=new Xt,r=new Xt,a=new $e,o=new S0,l=new y0,c={},h=e.maxTextureSize,u={[Fs]:kn,[kn]:Fs,[Bi]:Bi},f=new Yi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Xt},radius:{value:4}},vertexShader:iS,fragmentShader:sS}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const v=new pi;v.setAttribute("position",new Vn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new Qn(v,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Jo;let d=this.type;this.render=function(w,N,k){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;w.type===cg&&(Jt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),w.type=Jo);const E=i.getRenderTarget(),T=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),W=i.state;W.setBlending(us),W.buffers.depth.getReversed()===!0?W.buffers.color.setClear(0,0,0,0):W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const z=d!==this.type;z&&N.traverse(function(K){K.material&&(Array.isArray(K.material)?K.material.forEach(V=>V.needsUpdate=!0):K.material.needsUpdate=!0)});for(let K=0,V=w.length;K<V;K++){const j=w[K],G=j.shadow;if(G===void 0){Jt("WebGLShadowMap:",j,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const st=G.getFrameExtents();if(s.multiply(st),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/st.x),s.x=r.x*st.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/st.y),s.y=r.y*st.y,G.mapSize.y=r.y)),G.map===null||z===!0){if(G.map!==null&&(G.map.depthTexture!==null&&(G.map.depthTexture.dispose(),G.map.depthTexture=null),G.map.dispose()),this.type===Va){if(j.isPointLight){Jt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}G.map=new Vi(s.x,s.y,{format:la,type:gs,minFilter:sn,magFilter:sn,generateMipmaps:!1}),G.map.texture.name=j.name+".shadowMap",G.map.depthTexture=new so(s.x,s.y,Gi),G.map.depthTexture.name=j.name+".shadowMapDepth",G.map.depthTexture.format=_s,G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=yn,G.map.depthTexture.magFilter=yn}else{j.isPointLight?(G.map=new Fp(s.x),G.map.depthTexture=new v0(s.x,Xi)):(G.map=new Vi(s.x,s.y),G.map.depthTexture=new so(s.x,s.y,Xi)),G.map.depthTexture.name=j.name+".shadowMap",G.map.depthTexture.format=_s;const at=i.state.buffers.depth.getReversed();this.type===Jo?(G.map.depthTexture.compareFunction=at?fh:hh,G.map.depthTexture.minFilter=sn,G.map.depthTexture.magFilter=sn):(G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=yn,G.map.depthTexture.magFilter=yn)}G.camera.updateProjectionMatrix()}const dt=G.map.isWebGLCubeRenderTarget?6:1;for(let at=0;at<dt;at++){if(G.map.isWebGLCubeRenderTarget)i.setRenderTarget(G.map,at),i.clear();else{at===0&&(i.setRenderTarget(G.map),i.clear());const ut=G.getViewport(at);a.set(r.x*ut.x,r.y*ut.y,r.x*ut.z,r.y*ut.w),W.viewport(a)}if(j.isPointLight){const ut=G.camera,St=G.matrix,ht=j.distance||ut.far;ht!==ut.far&&(ut.far=ht,ut.updateProjectionMatrix()),Oa.setFromMatrixPosition(j.matrixWorld),ut.position.copy(Oa),bc.copy(ut.position),bc.add(rS[at]),ut.up.copy(aS[at]),ut.lookAt(bc),ut.updateMatrixWorld(),St.makeTranslation(-Oa.x,-Oa.y,-Oa.z),Qf.multiplyMatrices(ut.projectionMatrix,ut.matrixWorldInverse),G._frustum.setFromProjectionMatrix(Qf,ut.coordinateSystem,ut.reversedDepth)}else G.updateMatrices(j);n=G.getFrustum(),A(N,k,G.camera,j,this.type)}G.isPointLightShadow!==!0&&this.type===Va&&y(G,k),G.needsUpdate=!1}d=this.type,p.needsUpdate=!1,i.setRenderTarget(E,T,L)};function y(w,N){const k=t.update(M);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Vi(s.x,s.y,{format:la,type:gs})),f.uniforms.shadow_pass.value=w.map.depthTexture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(N,null,k,f,M,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(N,null,k,m,M,null)}function R(w,N,k,E){let T=null;const L=k.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(L!==void 0)T=L;else if(T=k.isPointLight===!0?l:o,i.localClippingEnabled&&N.clipShadows===!0&&Array.isArray(N.clippingPlanes)&&N.clippingPlanes.length!==0||N.displacementMap&&N.displacementScale!==0||N.alphaMap&&N.alphaTest>0||N.map&&N.alphaTest>0||N.alphaToCoverage===!0){const W=T.uuid,z=N.uuid;let K=c[W];K===void 0&&(K={},c[W]=K);let V=K[z];V===void 0&&(V=T.clone(),K[z]=V,N.addEventListener("dispose",D)),T=V}if(T.visible=N.visible,T.wireframe=N.wireframe,E===Va?T.side=N.shadowSide!==null?N.shadowSide:N.side:T.side=N.shadowSide!==null?N.shadowSide:u[N.side],T.alphaMap=N.alphaMap,T.alphaTest=N.alphaToCoverage===!0?.5:N.alphaTest,T.map=N.map,T.clipShadows=N.clipShadows,T.clippingPlanes=N.clippingPlanes,T.clipIntersection=N.clipIntersection,T.displacementMap=N.displacementMap,T.displacementScale=N.displacementScale,T.displacementBias=N.displacementBias,T.wireframeLinewidth=N.wireframeLinewidth,T.linewidth=N.linewidth,k.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const W=i.properties.get(T);W.light=k}return T}function A(w,N,k,E,T){if(w.visible===!1)return;if(w.layers.test(N.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&T===Va)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,w.matrixWorld);const z=t.update(w),K=w.material;if(Array.isArray(K)){const V=z.groups;for(let j=0,G=V.length;j<G;j++){const st=V[j],dt=K[st.materialIndex];if(dt&&dt.visible){const at=R(w,dt,E,T);w.onBeforeShadow(i,w,N,k,z,at,st),i.renderBufferDirect(k,null,z,at,w,st),w.onAfterShadow(i,w,N,k,z,at,st)}}}else if(K.visible){const V=R(w,K,E,T);w.onBeforeShadow(i,w,N,k,z,V,null),i.renderBufferDirect(k,null,z,V,w,null),w.onAfterShadow(i,w,N,k,z,V,null)}}const W=w.children;for(let z=0,K=W.length;z<K;z++)A(W[z],N,k,E,T)}function D(w){w.target.removeEventListener("dispose",D);for(const k in c){const E=c[k],T=w.target.uuid;T in E&&(E[T].dispose(),delete E[T])}}}const lS={[kc]:Hc,[Vc]:Yc,[Wc]:qc,[aa]:Xc,[Hc]:kc,[Yc]:Vc,[qc]:Wc,[Xc]:aa};function cS(i,t){function e(){let O=!1;const yt=new $e;let lt=null;const wt=new $e(0,0,0,0);return{setMask:function(ft){lt!==ft&&!O&&(i.colorMask(ft,ft,ft,ft),lt=ft)},setLocked:function(ft){O=ft},setClear:function(ft,rt,vt,$t,De){De===!0&&(ft*=$t,rt*=$t,vt*=$t),yt.set(ft,rt,vt,$t),wt.equals(yt)===!1&&(i.clearColor(ft,rt,vt,$t),wt.copy(yt))},reset:function(){O=!1,lt=null,wt.set(-1,0,0,0)}}}function n(){let O=!1,yt=!1,lt=null,wt=null,ft=null;return{setReversed:function(rt){if(yt!==rt){const vt=t.get("EXT_clip_control");rt?vt.clipControlEXT(vt.LOWER_LEFT_EXT,vt.ZERO_TO_ONE_EXT):vt.clipControlEXT(vt.LOWER_LEFT_EXT,vt.NEGATIVE_ONE_TO_ONE_EXT),yt=rt;const $t=ft;ft=null,this.setClear($t)}},getReversed:function(){return yt},setTest:function(rt){rt?et(i.DEPTH_TEST):bt(i.DEPTH_TEST)},setMask:function(rt){lt!==rt&&!O&&(i.depthMask(rt),lt=rt)},setFunc:function(rt){if(yt&&(rt=lS[rt]),wt!==rt){switch(rt){case kc:i.depthFunc(i.NEVER);break;case Hc:i.depthFunc(i.ALWAYS);break;case Vc:i.depthFunc(i.LESS);break;case aa:i.depthFunc(i.LEQUAL);break;case Wc:i.depthFunc(i.EQUAL);break;case Xc:i.depthFunc(i.GEQUAL);break;case Yc:i.depthFunc(i.GREATER);break;case qc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}wt=rt}},setLocked:function(rt){O=rt},setClear:function(rt){ft!==rt&&(yt&&(rt=1-rt),i.clearDepth(rt),ft=rt)},reset:function(){O=!1,lt=null,wt=null,ft=null,yt=!1}}}function s(){let O=!1,yt=null,lt=null,wt=null,ft=null,rt=null,vt=null,$t=null,De=null;return{setTest:function(ve){O||(ve?et(i.STENCIL_TEST):bt(i.STENCIL_TEST))},setMask:function(ve){yt!==ve&&!O&&(i.stencilMask(ve),yt=ve)},setFunc:function(ve,pn,Be){(lt!==ve||wt!==pn||ft!==Be)&&(i.stencilFunc(ve,pn,Be),lt=ve,wt=pn,ft=Be)},setOp:function(ve,pn,Be){(rt!==ve||vt!==pn||$t!==Be)&&(i.stencilOp(ve,pn,Be),rt=ve,vt=pn,$t=Be)},setLocked:function(ve){O=ve},setClear:function(ve){De!==ve&&(i.clearStencil(ve),De=ve)},reset:function(){O=!1,yt=null,lt=null,wt=null,ft=null,rt=null,vt=null,$t=null,De=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,m=[],v=null,M=!1,p=null,d=null,y=null,R=null,A=null,D=null,w=null,N=new Re(0,0,0),k=0,E=!1,T=null,L=null,W=null,z=null,K=null;const V=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,G=0;const st=i.getParameter(i.VERSION);st.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(st)[1]),j=G>=1):st.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(st)[1]),j=G>=2);let dt=null,at={};const ut=i.getParameter(i.SCISSOR_BOX),St=i.getParameter(i.VIEWPORT),ht=new $e().fromArray(ut),Qt=new $e().fromArray(St);function ee(O,yt,lt,wt){const ft=new Uint8Array(4),rt=i.createTexture();i.bindTexture(O,rt),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let vt=0;vt<lt;vt++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(yt,0,i.RGBA,1,1,wt,0,i.RGBA,i.UNSIGNED_BYTE,ft):i.texImage2D(yt+vt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ft);return rt}const Q={};Q[i.TEXTURE_2D]=ee(i.TEXTURE_2D,i.TEXTURE_2D,1),Q[i.TEXTURE_CUBE_MAP]=ee(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[i.TEXTURE_2D_ARRAY]=ee(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Q[i.TEXTURE_3D]=ee(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),et(i.DEPTH_TEST),a.setFunc(aa),qt(!1),Oe(ef),et(i.CULL_FACE),re(us);function et(O){h[O]!==!0&&(i.enable(O),h[O]=!0)}function bt(O){h[O]!==!1&&(i.disable(O),h[O]=!1)}function kt(O,yt){return u[O]!==yt?(i.bindFramebuffer(O,yt),u[O]=yt,O===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=yt),O===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=yt),!0):!1}function _t(O,yt){let lt=m,wt=!1;if(O){lt=f.get(yt),lt===void 0&&(lt=[],f.set(yt,lt));const ft=O.textures;if(lt.length!==ft.length||lt[0]!==i.COLOR_ATTACHMENT0){for(let rt=0,vt=ft.length;rt<vt;rt++)lt[rt]=i.COLOR_ATTACHMENT0+rt;lt.length=ft.length,wt=!0}}else lt[0]!==i.BACK&&(lt[0]=i.BACK,wt=!0);wt&&i.drawBuffers(lt)}function te(O){return v!==O?(i.useProgram(O),v=O,!0):!1}const Ce={[sr]:i.FUNC_ADD,[hg]:i.FUNC_SUBTRACT,[fg]:i.FUNC_REVERSE_SUBTRACT};Ce[dg]=i.MIN,Ce[pg]=i.MAX;const Yt={[mg]:i.ZERO,[gg]:i.ONE,[_g]:i.SRC_COLOR,[zc]:i.SRC_ALPHA,[Eg]:i.SRC_ALPHA_SATURATE,[Sg]:i.DST_COLOR,[vg]:i.DST_ALPHA,[xg]:i.ONE_MINUS_SRC_COLOR,[Gc]:i.ONE_MINUS_SRC_ALPHA,[yg]:i.ONE_MINUS_DST_COLOR,[Mg]:i.ONE_MINUS_DST_ALPHA,[bg]:i.CONSTANT_COLOR,[Tg]:i.ONE_MINUS_CONSTANT_COLOR,[Ag]:i.CONSTANT_ALPHA,[wg]:i.ONE_MINUS_CONSTANT_ALPHA};function re(O,yt,lt,wt,ft,rt,vt,$t,De,ve){if(O===us){M===!0&&(bt(i.BLEND),M=!1);return}if(M===!1&&(et(i.BLEND),M=!0),O!==ug){if(O!==p||ve!==E){if((d!==sr||A!==sr)&&(i.blendEquation(i.FUNC_ADD),d=sr,A=sr),ve)switch(O){case na:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case nf:i.blendFunc(i.ONE,i.ONE);break;case sf:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case rf:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:de("WebGLState: Invalid blending: ",O);break}else switch(O){case na:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case nf:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case sf:de("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case rf:de("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:de("WebGLState: Invalid blending: ",O);break}y=null,R=null,D=null,w=null,N.set(0,0,0),k=0,p=O,E=ve}return}ft=ft||yt,rt=rt||lt,vt=vt||wt,(yt!==d||ft!==A)&&(i.blendEquationSeparate(Ce[yt],Ce[ft]),d=yt,A=ft),(lt!==y||wt!==R||rt!==D||vt!==w)&&(i.blendFuncSeparate(Yt[lt],Yt[wt],Yt[rt],Yt[vt]),y=lt,R=wt,D=rt,w=vt),($t.equals(N)===!1||De!==k)&&(i.blendColor($t.r,$t.g,$t.b,De),N.copy($t),k=De),p=O,E=!1}function he(O,yt){O.side===Bi?bt(i.CULL_FACE):et(i.CULL_FACE);let lt=O.side===kn;yt&&(lt=!lt),qt(lt),O.blending===na&&O.transparent===!1?re(us):re(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);const wt=O.stencilWrite;o.setTest(wt),wt&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Pe(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?et(i.SAMPLE_ALPHA_TO_COVERAGE):bt(i.SAMPLE_ALPHA_TO_COVERAGE)}function qt(O){T!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),T=O)}function Oe(O){O!==og?(et(i.CULL_FACE),O!==L&&(O===ef?i.cullFace(i.BACK):O===lg?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):bt(i.CULL_FACE),L=O}function F(O){O!==W&&(j&&i.lineWidth(O),W=O)}function Pe(O,yt,lt){O?(et(i.POLYGON_OFFSET_FILL),(z!==yt||K!==lt)&&(i.polygonOffset(yt,lt),z=yt,K=lt)):bt(i.POLYGON_OFFSET_FILL)}function jt(O){O?et(i.SCISSOR_TEST):bt(i.SCISSOR_TEST)}function pe(O){O===void 0&&(O=i.TEXTURE0+V-1),dt!==O&&(i.activeTexture(O),dt=O)}function Dt(O,yt,lt){lt===void 0&&(dt===null?lt=i.TEXTURE0+V-1:lt=dt);let wt=at[lt];wt===void 0&&(wt={type:void 0,texture:void 0},at[lt]=wt),(wt.type!==O||wt.texture!==yt)&&(dt!==lt&&(i.activeTexture(lt),dt=lt),i.bindTexture(O,yt||Q[O]),wt.type=O,wt.texture=yt)}function P(){const O=at[dt];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function x(){try{i.compressedTexImage2D(...arguments)}catch(O){de("WebGLState:",O)}}function U(){try{i.compressedTexImage3D(...arguments)}catch(O){de("WebGLState:",O)}}function Z(){try{i.texSubImage2D(...arguments)}catch(O){de("WebGLState:",O)}}function nt(){try{i.texSubImage3D(...arguments)}catch(O){de("WebGLState:",O)}}function tt(){try{i.compressedTexSubImage2D(...arguments)}catch(O){de("WebGLState:",O)}}function Nt(){try{i.compressedTexSubImage3D(...arguments)}catch(O){de("WebGLState:",O)}}function mt(){try{i.texStorage2D(...arguments)}catch(O){de("WebGLState:",O)}}function Lt(){try{i.texStorage3D(...arguments)}catch(O){de("WebGLState:",O)}}function Bt(){try{i.texImage2D(...arguments)}catch(O){de("WebGLState:",O)}}function ot(){try{i.texImage3D(...arguments)}catch(O){de("WebGLState:",O)}}function pt(O){ht.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),ht.copy(O))}function At(O){Qt.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),Qt.copy(O))}function Ot(O,yt){let lt=c.get(yt);lt===void 0&&(lt=new WeakMap,c.set(yt,lt));let wt=lt.get(O);wt===void 0&&(wt=i.getUniformBlockIndex(yt,O.name),lt.set(O,wt))}function xt(O,yt){const wt=c.get(yt).get(O);l.get(yt)!==wt&&(i.uniformBlockBinding(yt,wt,O.__bindingPointIndex),l.set(yt,wt))}function Kt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},dt=null,at={},u={},f=new WeakMap,m=[],v=null,M=!1,p=null,d=null,y=null,R=null,A=null,D=null,w=null,N=new Re(0,0,0),k=0,E=!1,T=null,L=null,W=null,z=null,K=null,ht.set(0,0,i.canvas.width,i.canvas.height),Qt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:et,disable:bt,bindFramebuffer:kt,drawBuffers:_t,useProgram:te,setBlending:re,setMaterial:he,setFlipSided:qt,setCullFace:Oe,setLineWidth:F,setPolygonOffset:Pe,setScissorTest:jt,activeTexture:pe,bindTexture:Dt,unbindTexture:P,compressedTexImage2D:x,compressedTexImage3D:U,texImage2D:Bt,texImage3D:ot,updateUBOMapping:Ot,uniformBlockBinding:xt,texStorage2D:mt,texStorage3D:Lt,texSubImage2D:Z,texSubImage3D:nt,compressedTexSubImage2D:tt,compressedTexSubImage3D:Nt,scissor:pt,viewport:At,reset:Kt}}function uS(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Xt,h=new WeakMap;let u;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(P,x){return m?new OffscreenCanvas(P,x):cl("canvas")}function M(P,x,U){let Z=1;const nt=Dt(P);if((nt.width>U||nt.height>U)&&(Z=U/Math.max(nt.width,nt.height)),Z<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const tt=Math.floor(Z*nt.width),Nt=Math.floor(Z*nt.height);u===void 0&&(u=v(tt,Nt));const mt=x?v(tt,Nt):u;return mt.width=tt,mt.height=Nt,mt.getContext("2d").drawImage(P,0,0,tt,Nt),Jt("WebGLRenderer: Texture has been resized from ("+nt.width+"x"+nt.height+") to ("+tt+"x"+Nt+")."),mt}else return"data"in P&&Jt("WebGLRenderer: Image in DataTexture is too big ("+nt.width+"x"+nt.height+")."),P;return P}function p(P){return P.generateMipmaps}function d(P){i.generateMipmap(P)}function y(P){return P.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?i.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function R(P,x,U,Z,nt=!1){if(P!==null){if(i[P]!==void 0)return i[P];Jt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let tt=x;if(x===i.RED&&(U===i.FLOAT&&(tt=i.R32F),U===i.HALF_FLOAT&&(tt=i.R16F),U===i.UNSIGNED_BYTE&&(tt=i.R8)),x===i.RED_INTEGER&&(U===i.UNSIGNED_BYTE&&(tt=i.R8UI),U===i.UNSIGNED_SHORT&&(tt=i.R16UI),U===i.UNSIGNED_INT&&(tt=i.R32UI),U===i.BYTE&&(tt=i.R8I),U===i.SHORT&&(tt=i.R16I),U===i.INT&&(tt=i.R32I)),x===i.RG&&(U===i.FLOAT&&(tt=i.RG32F),U===i.HALF_FLOAT&&(tt=i.RG16F),U===i.UNSIGNED_BYTE&&(tt=i.RG8)),x===i.RG_INTEGER&&(U===i.UNSIGNED_BYTE&&(tt=i.RG8UI),U===i.UNSIGNED_SHORT&&(tt=i.RG16UI),U===i.UNSIGNED_INT&&(tt=i.RG32UI),U===i.BYTE&&(tt=i.RG8I),U===i.SHORT&&(tt=i.RG16I),U===i.INT&&(tt=i.RG32I)),x===i.RGB_INTEGER&&(U===i.UNSIGNED_BYTE&&(tt=i.RGB8UI),U===i.UNSIGNED_SHORT&&(tt=i.RGB16UI),U===i.UNSIGNED_INT&&(tt=i.RGB32UI),U===i.BYTE&&(tt=i.RGB8I),U===i.SHORT&&(tt=i.RGB16I),U===i.INT&&(tt=i.RGB32I)),x===i.RGBA_INTEGER&&(U===i.UNSIGNED_BYTE&&(tt=i.RGBA8UI),U===i.UNSIGNED_SHORT&&(tt=i.RGBA16UI),U===i.UNSIGNED_INT&&(tt=i.RGBA32UI),U===i.BYTE&&(tt=i.RGBA8I),U===i.SHORT&&(tt=i.RGBA16I),U===i.INT&&(tt=i.RGBA32I)),x===i.RGB&&(U===i.UNSIGNED_INT_5_9_9_9_REV&&(tt=i.RGB9_E5),U===i.UNSIGNED_INT_10F_11F_11F_REV&&(tt=i.R11F_G11F_B10F)),x===i.RGBA){const Nt=nt?ol:me.getTransfer(Z);U===i.FLOAT&&(tt=i.RGBA32F),U===i.HALF_FLOAT&&(tt=i.RGBA16F),U===i.UNSIGNED_BYTE&&(tt=Nt===we?i.SRGB8_ALPHA8:i.RGBA8),U===i.UNSIGNED_SHORT_4_4_4_4&&(tt=i.RGBA4),U===i.UNSIGNED_SHORT_5_5_5_1&&(tt=i.RGB5_A1)}return(tt===i.R16F||tt===i.R32F||tt===i.RG16F||tt===i.RG32F||tt===i.RGBA16F||tt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),tt}function A(P,x){let U;return P?x===null||x===Xi||x===eo?U=i.DEPTH24_STENCIL8:x===Gi?U=i.DEPTH32F_STENCIL8:x===to&&(U=i.DEPTH24_STENCIL8,Jt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Xi||x===eo?U=i.DEPTH_COMPONENT24:x===Gi?U=i.DEPTH_COMPONENT32F:x===to&&(U=i.DEPTH_COMPONENT16),U}function D(P,x){return p(P)===!0||P.isFramebufferTexture&&P.minFilter!==yn&&P.minFilter!==sn?Math.log2(Math.max(x.width,x.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?x.mipmaps.length:1}function w(P){const x=P.target;x.removeEventListener("dispose",w),k(x),x.isVideoTexture&&h.delete(x)}function N(P){const x=P.target;x.removeEventListener("dispose",N),T(x)}function k(P){const x=n.get(P);if(x.__webglInit===void 0)return;const U=P.source,Z=f.get(U);if(Z){const nt=Z[x.__cacheKey];nt.usedTimes--,nt.usedTimes===0&&E(P),Object.keys(Z).length===0&&f.delete(U)}n.remove(P)}function E(P){const x=n.get(P);i.deleteTexture(x.__webglTexture);const U=P.source,Z=f.get(U);delete Z[x.__cacheKey],a.memory.textures--}function T(P){const x=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(x.__webglFramebuffer[Z]))for(let nt=0;nt<x.__webglFramebuffer[Z].length;nt++)i.deleteFramebuffer(x.__webglFramebuffer[Z][nt]);else i.deleteFramebuffer(x.__webglFramebuffer[Z]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[Z])}else{if(Array.isArray(x.__webglFramebuffer))for(let Z=0;Z<x.__webglFramebuffer.length;Z++)i.deleteFramebuffer(x.__webglFramebuffer[Z]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let Z=0;Z<x.__webglColorRenderbuffer.length;Z++)x.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[Z]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const U=P.textures;for(let Z=0,nt=U.length;Z<nt;Z++){const tt=n.get(U[Z]);tt.__webglTexture&&(i.deleteTexture(tt.__webglTexture),a.memory.textures--),n.remove(U[Z])}n.remove(P)}let L=0;function W(){L=0}function z(){const P=L;return P>=s.maxTextures&&Jt("WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),L+=1,P}function K(P){const x=[];return x.push(P.wrapS),x.push(P.wrapT),x.push(P.wrapR||0),x.push(P.magFilter),x.push(P.minFilter),x.push(P.anisotropy),x.push(P.internalFormat),x.push(P.format),x.push(P.type),x.push(P.generateMipmaps),x.push(P.premultiplyAlpha),x.push(P.flipY),x.push(P.unpackAlignment),x.push(P.colorSpace),x.join()}function V(P,x){const U=n.get(P);if(P.isVideoTexture&&jt(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&U.__version!==P.version){const Z=P.image;if(Z===null)Jt("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)Jt("WebGLRenderer: Texture marked for update but image is incomplete");else{Q(U,P,x);return}}else P.isExternalTexture&&(U.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,U.__webglTexture,i.TEXTURE0+x)}function j(P,x){const U=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&U.__version!==P.version){Q(U,P,x);return}else P.isExternalTexture&&(U.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,U.__webglTexture,i.TEXTURE0+x)}function G(P,x){const U=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&U.__version!==P.version){Q(U,P,x);return}e.bindTexture(i.TEXTURE_3D,U.__webglTexture,i.TEXTURE0+x)}function st(P,x){const U=n.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&U.__version!==P.version){et(U,P,x);return}e.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture,i.TEXTURE0+x)}const dt={[$c]:i.REPEAT,[cs]:i.CLAMP_TO_EDGE,[Zc]:i.MIRRORED_REPEAT},at={[yn]:i.NEAREST,[Pg]:i.NEAREST_MIPMAP_NEAREST,[bo]:i.NEAREST_MIPMAP_LINEAR,[sn]:i.LINEAR,[jl]:i.LINEAR_MIPMAP_NEAREST,[cr]:i.LINEAR_MIPMAP_LINEAR},ut={[Ug]:i.NEVER,[zg]:i.ALWAYS,[Ng]:i.LESS,[hh]:i.LEQUAL,[Fg]:i.EQUAL,[fh]:i.GEQUAL,[Og]:i.GREATER,[Bg]:i.NOTEQUAL};function St(P,x){if(x.type===Gi&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===sn||x.magFilter===jl||x.magFilter===bo||x.magFilter===cr||x.minFilter===sn||x.minFilter===jl||x.minFilter===bo||x.minFilter===cr)&&Jt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(P,i.TEXTURE_WRAP_S,dt[x.wrapS]),i.texParameteri(P,i.TEXTURE_WRAP_T,dt[x.wrapT]),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,dt[x.wrapR]),i.texParameteri(P,i.TEXTURE_MAG_FILTER,at[x.magFilter]),i.texParameteri(P,i.TEXTURE_MIN_FILTER,at[x.minFilter]),x.compareFunction&&(i.texParameteri(P,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(P,i.TEXTURE_COMPARE_FUNC,ut[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===yn||x.minFilter!==bo&&x.minFilter!==cr||x.type===Gi&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const U=t.get("EXT_texture_filter_anisotropic");i.texParameterf(P,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function ht(P,x){let U=!1;P.__webglInit===void 0&&(P.__webglInit=!0,x.addEventListener("dispose",w));const Z=x.source;let nt=f.get(Z);nt===void 0&&(nt={},f.set(Z,nt));const tt=K(x);if(tt!==P.__cacheKey){nt[tt]===void 0&&(nt[tt]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,U=!0),nt[tt].usedTimes++;const Nt=nt[P.__cacheKey];Nt!==void 0&&(nt[P.__cacheKey].usedTimes--,Nt.usedTimes===0&&E(x)),P.__cacheKey=tt,P.__webglTexture=nt[tt].texture}return U}function Qt(P,x,U){return Math.floor(Math.floor(P/U)/x)}function ee(P,x,U,Z){const tt=P.updateRanges;if(tt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,U,Z,x.data);else{tt.sort((ot,pt)=>ot.start-pt.start);let Nt=0;for(let ot=1;ot<tt.length;ot++){const pt=tt[Nt],At=tt[ot],Ot=pt.start+pt.count,xt=Qt(At.start,x.width,4),Kt=Qt(pt.start,x.width,4);At.start<=Ot+1&&xt===Kt&&Qt(At.start+At.count-1,x.width,4)===xt?pt.count=Math.max(pt.count,At.start+At.count-pt.start):(++Nt,tt[Nt]=At)}tt.length=Nt+1;const mt=i.getParameter(i.UNPACK_ROW_LENGTH),Lt=i.getParameter(i.UNPACK_SKIP_PIXELS),Bt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let ot=0,pt=tt.length;ot<pt;ot++){const At=tt[ot],Ot=Math.floor(At.start/4),xt=Math.ceil(At.count/4),Kt=Ot%x.width,O=Math.floor(Ot/x.width),yt=xt,lt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Kt),i.pixelStorei(i.UNPACK_SKIP_ROWS,O),e.texSubImage2D(i.TEXTURE_2D,0,Kt,O,yt,lt,U,Z,x.data)}P.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,mt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Lt),i.pixelStorei(i.UNPACK_SKIP_ROWS,Bt)}}function Q(P,x,U){let Z=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(Z=i.TEXTURE_3D);const nt=ht(P,x),tt=x.source;e.bindTexture(Z,P.__webglTexture,i.TEXTURE0+U);const Nt=n.get(tt);if(tt.version!==Nt.__version||nt===!0){e.activeTexture(i.TEXTURE0+U);const mt=me.getPrimaries(me.workingColorSpace),Lt=x.colorSpace===Is?null:me.getPrimaries(x.colorSpace),Bt=x.colorSpace===Is||mt===Lt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);let ot=M(x.image,!1,s.maxTextureSize);ot=pe(x,ot);const pt=r.convert(x.format,x.colorSpace),At=r.convert(x.type);let Ot=R(x.internalFormat,pt,At,x.colorSpace,x.isVideoTexture);St(Z,x);let xt;const Kt=x.mipmaps,O=x.isVideoTexture!==!0,yt=Nt.__version===void 0||nt===!0,lt=tt.dataReady,wt=D(x,ot);if(x.isDepthTexture)Ot=A(x.format===ur,x.type),yt&&(O?e.texStorage2D(i.TEXTURE_2D,1,Ot,ot.width,ot.height):e.texImage2D(i.TEXTURE_2D,0,Ot,ot.width,ot.height,0,pt,At,null));else if(x.isDataTexture)if(Kt.length>0){O&&yt&&e.texStorage2D(i.TEXTURE_2D,wt,Ot,Kt[0].width,Kt[0].height);for(let ft=0,rt=Kt.length;ft<rt;ft++)xt=Kt[ft],O?lt&&e.texSubImage2D(i.TEXTURE_2D,ft,0,0,xt.width,xt.height,pt,At,xt.data):e.texImage2D(i.TEXTURE_2D,ft,Ot,xt.width,xt.height,0,pt,At,xt.data);x.generateMipmaps=!1}else O?(yt&&e.texStorage2D(i.TEXTURE_2D,wt,Ot,ot.width,ot.height),lt&&ee(x,ot,pt,At)):e.texImage2D(i.TEXTURE_2D,0,Ot,ot.width,ot.height,0,pt,At,ot.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){O&&yt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Ot,Kt[0].width,Kt[0].height,ot.depth);for(let ft=0,rt=Kt.length;ft<rt;ft++)if(xt=Kt[ft],x.format!==Ti)if(pt!==null)if(O){if(lt)if(x.layerUpdates.size>0){const vt=Pf(xt.width,xt.height,x.format,x.type);for(const $t of x.layerUpdates){const De=xt.data.subarray($t*vt/xt.data.BYTES_PER_ELEMENT,($t+1)*vt/xt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ft,0,0,$t,xt.width,xt.height,1,pt,De)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ft,0,0,0,xt.width,xt.height,ot.depth,pt,xt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ft,Ot,xt.width,xt.height,ot.depth,0,xt.data,0,0);else Jt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else O?lt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,ft,0,0,0,xt.width,xt.height,ot.depth,pt,At,xt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ft,Ot,xt.width,xt.height,ot.depth,0,pt,At,xt.data)}else{O&&yt&&e.texStorage2D(i.TEXTURE_2D,wt,Ot,Kt[0].width,Kt[0].height);for(let ft=0,rt=Kt.length;ft<rt;ft++)xt=Kt[ft],x.format!==Ti?pt!==null?O?lt&&e.compressedTexSubImage2D(i.TEXTURE_2D,ft,0,0,xt.width,xt.height,pt,xt.data):e.compressedTexImage2D(i.TEXTURE_2D,ft,Ot,xt.width,xt.height,0,xt.data):Jt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):O?lt&&e.texSubImage2D(i.TEXTURE_2D,ft,0,0,xt.width,xt.height,pt,At,xt.data):e.texImage2D(i.TEXTURE_2D,ft,Ot,xt.width,xt.height,0,pt,At,xt.data)}else if(x.isDataArrayTexture)if(O){if(yt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Ot,ot.width,ot.height,ot.depth),lt)if(x.layerUpdates.size>0){const ft=Pf(ot.width,ot.height,x.format,x.type);for(const rt of x.layerUpdates){const vt=ot.data.subarray(rt*ft/ot.data.BYTES_PER_ELEMENT,(rt+1)*ft/ot.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,rt,ot.width,ot.height,1,pt,At,vt)}x.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,pt,At,ot.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ot,ot.width,ot.height,ot.depth,0,pt,At,ot.data);else if(x.isData3DTexture)O?(yt&&e.texStorage3D(i.TEXTURE_3D,wt,Ot,ot.width,ot.height,ot.depth),lt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,pt,At,ot.data)):e.texImage3D(i.TEXTURE_3D,0,Ot,ot.width,ot.height,ot.depth,0,pt,At,ot.data);else if(x.isFramebufferTexture){if(yt)if(O)e.texStorage2D(i.TEXTURE_2D,wt,Ot,ot.width,ot.height);else{let ft=ot.width,rt=ot.height;for(let vt=0;vt<wt;vt++)e.texImage2D(i.TEXTURE_2D,vt,Ot,ft,rt,0,pt,At,null),ft>>=1,rt>>=1}}else if(Kt.length>0){if(O&&yt){const ft=Dt(Kt[0]);e.texStorage2D(i.TEXTURE_2D,wt,Ot,ft.width,ft.height)}for(let ft=0,rt=Kt.length;ft<rt;ft++)xt=Kt[ft],O?lt&&e.texSubImage2D(i.TEXTURE_2D,ft,0,0,pt,At,xt):e.texImage2D(i.TEXTURE_2D,ft,Ot,pt,At,xt);x.generateMipmaps=!1}else if(O){if(yt){const ft=Dt(ot);e.texStorage2D(i.TEXTURE_2D,wt,Ot,ft.width,ft.height)}lt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,pt,At,ot)}else e.texImage2D(i.TEXTURE_2D,0,Ot,pt,At,ot);p(x)&&d(Z),Nt.__version=tt.version,x.onUpdate&&x.onUpdate(x)}P.__version=x.version}function et(P,x,U){if(x.image.length!==6)return;const Z=ht(P,x),nt=x.source;e.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+U);const tt=n.get(nt);if(nt.version!==tt.__version||Z===!0){e.activeTexture(i.TEXTURE0+U);const Nt=me.getPrimaries(me.workingColorSpace),mt=x.colorSpace===Is?null:me.getPrimaries(x.colorSpace),Lt=x.colorSpace===Is||Nt===mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Lt);const Bt=x.isCompressedTexture||x.image[0].isCompressedTexture,ot=x.image[0]&&x.image[0].isDataTexture,pt=[];for(let rt=0;rt<6;rt++)!Bt&&!ot?pt[rt]=M(x.image[rt],!0,s.maxCubemapSize):pt[rt]=ot?x.image[rt].image:x.image[rt],pt[rt]=pe(x,pt[rt]);const At=pt[0],Ot=r.convert(x.format,x.colorSpace),xt=r.convert(x.type),Kt=R(x.internalFormat,Ot,xt,x.colorSpace),O=x.isVideoTexture!==!0,yt=tt.__version===void 0||Z===!0,lt=nt.dataReady;let wt=D(x,At);St(i.TEXTURE_CUBE_MAP,x);let ft;if(Bt){O&&yt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,wt,Kt,At.width,At.height);for(let rt=0;rt<6;rt++){ft=pt[rt].mipmaps;for(let vt=0;vt<ft.length;vt++){const $t=ft[vt];x.format!==Ti?Ot!==null?O?lt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt,0,0,$t.width,$t.height,Ot,$t.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt,Kt,$t.width,$t.height,0,$t.data):Jt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?lt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt,0,0,$t.width,$t.height,Ot,xt,$t.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt,Kt,$t.width,$t.height,0,Ot,xt,$t.data)}}}else{if(ft=x.mipmaps,O&&yt){ft.length>0&&wt++;const rt=Dt(pt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,wt,Kt,rt.width,rt.height)}for(let rt=0;rt<6;rt++)if(ot){O?lt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,pt[rt].width,pt[rt].height,Ot,xt,pt[rt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Kt,pt[rt].width,pt[rt].height,0,Ot,xt,pt[rt].data);for(let vt=0;vt<ft.length;vt++){const De=ft[vt].image[rt].image;O?lt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt+1,0,0,De.width,De.height,Ot,xt,De.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt+1,Kt,De.width,De.height,0,Ot,xt,De.data)}}else{O?lt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,Ot,xt,pt[rt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Kt,Ot,xt,pt[rt]);for(let vt=0;vt<ft.length;vt++){const $t=ft[vt];O?lt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt+1,0,0,Ot,xt,$t.image[rt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,vt+1,Kt,Ot,xt,$t.image[rt])}}}p(x)&&d(i.TEXTURE_CUBE_MAP),tt.__version=nt.version,x.onUpdate&&x.onUpdate(x)}P.__version=x.version}function bt(P,x,U,Z,nt,tt){const Nt=r.convert(U.format,U.colorSpace),mt=r.convert(U.type),Lt=R(U.internalFormat,Nt,mt,U.colorSpace),Bt=n.get(x),ot=n.get(U);if(ot.__renderTarget=x,!Bt.__hasExternalTextures){const pt=Math.max(1,x.width>>tt),At=Math.max(1,x.height>>tt);nt===i.TEXTURE_3D||nt===i.TEXTURE_2D_ARRAY?e.texImage3D(nt,tt,Lt,pt,At,x.depth,0,Nt,mt,null):e.texImage2D(nt,tt,Lt,pt,At,0,Nt,mt,null)}e.bindFramebuffer(i.FRAMEBUFFER,P),Pe(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,nt,ot.__webglTexture,0,F(x)):(nt===i.TEXTURE_2D||nt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&nt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,nt,ot.__webglTexture,tt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function kt(P,x,U){if(i.bindRenderbuffer(i.RENDERBUFFER,P),x.depthBuffer){const Z=x.depthTexture,nt=Z&&Z.isDepthTexture?Z.type:null,tt=A(x.stencilBuffer,nt),Nt=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Pe(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,F(x),tt,x.width,x.height):U?i.renderbufferStorageMultisample(i.RENDERBUFFER,F(x),tt,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,tt,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Nt,i.RENDERBUFFER,P)}else{const Z=x.textures;for(let nt=0;nt<Z.length;nt++){const tt=Z[nt],Nt=r.convert(tt.format,tt.colorSpace),mt=r.convert(tt.type),Lt=R(tt.internalFormat,Nt,mt,tt.colorSpace);Pe(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,F(x),Lt,x.width,x.height):U?i.renderbufferStorageMultisample(i.RENDERBUFFER,F(x),Lt,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,Lt,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function _t(P,x,U){const Z=x.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,P),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const nt=n.get(x.depthTexture);if(nt.__renderTarget=x,(!nt.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),Z){if(nt.__webglInit===void 0&&(nt.__webglInit=!0,x.depthTexture.addEventListener("dispose",w)),nt.__webglTexture===void 0){nt.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,nt.__webglTexture),St(i.TEXTURE_CUBE_MAP,x.depthTexture);const Bt=r.convert(x.depthTexture.format),ot=r.convert(x.depthTexture.type);let pt;x.depthTexture.format===_s?pt=i.DEPTH_COMPONENT24:x.depthTexture.format===ur&&(pt=i.DEPTH24_STENCIL8);for(let At=0;At<6;At++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+At,0,pt,x.width,x.height,0,Bt,ot,null)}}else V(x.depthTexture,0);const tt=nt.__webglTexture,Nt=F(x),mt=Z?i.TEXTURE_CUBE_MAP_POSITIVE_X+U:i.TEXTURE_2D,Lt=x.depthTexture.format===ur?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(x.depthTexture.format===_s)Pe(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Lt,mt,tt,0,Nt):i.framebufferTexture2D(i.FRAMEBUFFER,Lt,mt,tt,0);else if(x.depthTexture.format===ur)Pe(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Lt,mt,tt,0,Nt):i.framebufferTexture2D(i.FRAMEBUFFER,Lt,mt,tt,0);else throw new Error("Unknown depthTexture format")}function te(P){const x=n.get(P),U=P.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==P.depthTexture){const Z=P.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),Z){const nt=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,Z.removeEventListener("dispose",nt)};Z.addEventListener("dispose",nt),x.__depthDisposeCallback=nt}x.__boundDepthTexture=Z}if(P.depthTexture&&!x.__autoAllocateDepthBuffer)if(U)for(let Z=0;Z<6;Z++)_t(x.__webglFramebuffer[Z],P,Z);else{const Z=P.texture.mipmaps;Z&&Z.length>0?_t(x.__webglFramebuffer[0],P,0):_t(x.__webglFramebuffer,P,0)}else if(U){x.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[Z]),x.__webglDepthbuffer[Z]===void 0)x.__webglDepthbuffer[Z]=i.createRenderbuffer(),kt(x.__webglDepthbuffer[Z],P,!1);else{const nt=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,tt=x.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,tt),i.framebufferRenderbuffer(i.FRAMEBUFFER,nt,i.RENDERBUFFER,tt)}}else{const Z=P.texture.mipmaps;if(Z&&Z.length>0?e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),kt(x.__webglDepthbuffer,P,!1);else{const nt=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,tt=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,tt),i.framebufferRenderbuffer(i.FRAMEBUFFER,nt,i.RENDERBUFFER,tt)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ce(P,x,U){const Z=n.get(P);x!==void 0&&bt(Z.__webglFramebuffer,P,P.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),U!==void 0&&te(P)}function Yt(P){const x=P.texture,U=n.get(P),Z=n.get(x);P.addEventListener("dispose",N);const nt=P.textures,tt=P.isWebGLCubeRenderTarget===!0,Nt=nt.length>1;if(Nt||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=x.version,a.memory.textures++),tt){U.__webglFramebuffer=[];for(let mt=0;mt<6;mt++)if(x.mipmaps&&x.mipmaps.length>0){U.__webglFramebuffer[mt]=[];for(let Lt=0;Lt<x.mipmaps.length;Lt++)U.__webglFramebuffer[mt][Lt]=i.createFramebuffer()}else U.__webglFramebuffer[mt]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){U.__webglFramebuffer=[];for(let mt=0;mt<x.mipmaps.length;mt++)U.__webglFramebuffer[mt]=i.createFramebuffer()}else U.__webglFramebuffer=i.createFramebuffer();if(Nt)for(let mt=0,Lt=nt.length;mt<Lt;mt++){const Bt=n.get(nt[mt]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=i.createTexture(),a.memory.textures++)}if(P.samples>0&&Pe(P)===!1){U.__webglMultisampledFramebuffer=i.createFramebuffer(),U.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let mt=0;mt<nt.length;mt++){const Lt=nt[mt];U.__webglColorRenderbuffer[mt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,U.__webglColorRenderbuffer[mt]);const Bt=r.convert(Lt.format,Lt.colorSpace),ot=r.convert(Lt.type),pt=R(Lt.internalFormat,Bt,ot,Lt.colorSpace,P.isXRRenderTarget===!0),At=F(P);i.renderbufferStorageMultisample(i.RENDERBUFFER,At,pt,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.RENDERBUFFER,U.__webglColorRenderbuffer[mt])}i.bindRenderbuffer(i.RENDERBUFFER,null),P.depthBuffer&&(U.__webglDepthRenderbuffer=i.createRenderbuffer(),kt(U.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(tt){e.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),St(i.TEXTURE_CUBE_MAP,x);for(let mt=0;mt<6;mt++)if(x.mipmaps&&x.mipmaps.length>0)for(let Lt=0;Lt<x.mipmaps.length;Lt++)bt(U.__webglFramebuffer[mt][Lt],P,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Lt);else bt(U.__webglFramebuffer[mt],P,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0);p(x)&&d(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Nt){for(let mt=0,Lt=nt.length;mt<Lt;mt++){const Bt=nt[mt],ot=n.get(Bt);let pt=i.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(pt=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(pt,ot.__webglTexture),St(pt,Bt),bt(U.__webglFramebuffer,P,Bt,i.COLOR_ATTACHMENT0+mt,pt,0),p(Bt)&&d(pt)}e.unbindTexture()}else{let mt=i.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(mt=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(mt,Z.__webglTexture),St(mt,x),x.mipmaps&&x.mipmaps.length>0)for(let Lt=0;Lt<x.mipmaps.length;Lt++)bt(U.__webglFramebuffer[Lt],P,x,i.COLOR_ATTACHMENT0,mt,Lt);else bt(U.__webglFramebuffer,P,x,i.COLOR_ATTACHMENT0,mt,0);p(x)&&d(mt),e.unbindTexture()}P.depthBuffer&&te(P)}function re(P){const x=P.textures;for(let U=0,Z=x.length;U<Z;U++){const nt=x[U];if(p(nt)){const tt=y(P),Nt=n.get(nt).__webglTexture;e.bindTexture(tt,Nt),d(tt),e.unbindTexture()}}}const he=[],qt=[];function Oe(P){if(P.samples>0){if(Pe(P)===!1){const x=P.textures,U=P.width,Z=P.height;let nt=i.COLOR_BUFFER_BIT;const tt=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Nt=n.get(P),mt=x.length>1;if(mt)for(let Bt=0;Bt<x.length;Bt++)e.bindFramebuffer(i.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Nt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer);const Lt=P.texture.mipmaps;Lt&&Lt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer);for(let Bt=0;Bt<x.length;Bt++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(nt|=i.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(nt|=i.STENCIL_BUFFER_BIT)),mt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Nt.__webglColorRenderbuffer[Bt]);const ot=n.get(x[Bt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ot,0)}i.blitFramebuffer(0,0,U,Z,0,0,U,Z,nt,i.NEAREST),l===!0&&(he.length=0,qt.length=0,he.push(i.COLOR_ATTACHMENT0+Bt),P.depthBuffer&&P.resolveDepthBuffer===!1&&(he.push(tt),qt.push(tt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,qt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,he))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),mt)for(let Bt=0;Bt<x.length;Bt++){e.bindFramebuffer(i.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.RENDERBUFFER,Nt.__webglColorRenderbuffer[Bt]);const ot=n.get(x[Bt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Nt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.TEXTURE_2D,ot,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const x=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function F(P){return Math.min(s.maxSamples,P.samples)}function Pe(P){const x=n.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function jt(P){const x=a.render.frame;h.get(P)!==x&&(h.set(P,x),P.update())}function pe(P,x){const U=P.colorSpace,Z=P.format,nt=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||U!==ca&&U!==Is&&(me.getTransfer(U)===we?(Z!==Ti||nt!==hi)&&Jt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):de("WebGLTextures: Unsupported texture color space:",U)),x}function Dt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=W,this.setTexture2D=V,this.setTexture2DArray=j,this.setTexture3D=G,this.setTextureCube=st,this.rebindTextures=Ce,this.setupRenderTarget=Yt,this.updateRenderTargetMipmap=re,this.updateMultisampleRenderTarget=Oe,this.setupDepthRenderbuffer=te,this.setupFrameBufferTexture=bt,this.useMultisampledRTT=Pe,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function hS(i,t){function e(n,s=Is){let r;const a=me.getTransfer(s);if(n===hi)return i.UNSIGNED_BYTE;if(n===ah)return i.UNSIGNED_SHORT_4_4_4_4;if(n===oh)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ep)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===bp)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Sp)return i.BYTE;if(n===yp)return i.SHORT;if(n===to)return i.UNSIGNED_SHORT;if(n===rh)return i.INT;if(n===Xi)return i.UNSIGNED_INT;if(n===Gi)return i.FLOAT;if(n===gs)return i.HALF_FLOAT;if(n===Tp)return i.ALPHA;if(n===Ap)return i.RGB;if(n===Ti)return i.RGBA;if(n===_s)return i.DEPTH_COMPONENT;if(n===ur)return i.DEPTH_STENCIL;if(n===wp)return i.RED;if(n===lh)return i.RED_INTEGER;if(n===la)return i.RG;if(n===ch)return i.RG_INTEGER;if(n===uh)return i.RGBA_INTEGER;if(n===Qo||n===tl||n===el||n===nl)if(a===we)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Qo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===tl)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===el)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===nl)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Qo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===tl)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===el)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===nl)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Jc||n===Qc||n===tu||n===eu)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Jc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Qc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===tu)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===eu)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===nu||n===iu||n===su||n===ru||n===au||n===ou||n===lu)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===nu||n===iu)return a===we?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===su)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===ru)return r.COMPRESSED_R11_EAC;if(n===au)return r.COMPRESSED_SIGNED_R11_EAC;if(n===ou)return r.COMPRESSED_RG11_EAC;if(n===lu)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===cu||n===uu||n===hu||n===fu||n===du||n===pu||n===mu||n===gu||n===_u||n===xu||n===vu||n===Mu||n===Su||n===yu)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===cu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===uu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===hu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===fu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===du)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===pu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===mu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===gu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===_u)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===xu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===vu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Mu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Su)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===yu)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Eu||n===bu||n===Tu)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Eu)return a===we?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===bu)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Tu)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Au||n===wu||n===Ru||n===Cu)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Au)return r.COMPRESSED_RED_RGTC1_EXT;if(n===wu)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ru)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Cu)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===eo?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const fS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,dS=`
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

}`;class pS{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Gp(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Yi({vertexShader:fS,fragmentShader:dS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Qn(new El(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class mS extends Mr{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,m=null,v=null;const M=typeof XRWebGLBinding<"u",p=new pS,d={},y=e.getContextAttributes();let R=null,A=null;const D=[],w=[],N=new Xt;let k=null;const E=new ci;E.viewport=new $e;const T=new ci;T.viewport=new $e;const L=[E,T],W=new E0;let z=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let et=D[Q];return et===void 0&&(et=new gc,D[Q]=et),et.getTargetRaySpace()},this.getControllerGrip=function(Q){let et=D[Q];return et===void 0&&(et=new gc,D[Q]=et),et.getGripSpace()},this.getHand=function(Q){let et=D[Q];return et===void 0&&(et=new gc,D[Q]=et),et.getHandSpace()};function V(Q){const et=w.indexOf(Q.inputSource);if(et===-1)return;const bt=D[et];bt!==void 0&&(bt.update(Q.inputSource,Q.frame,c||a),bt.dispatchEvent({type:Q.type,data:Q.inputSource}))}function j(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",j),s.removeEventListener("inputsourceschange",G);for(let Q=0;Q<D.length;Q++){const et=w[Q];et!==null&&(w[Q]=null,D[Q].disconnect(et))}z=null,K=null,p.reset();for(const Q in d)delete d[Q];t.setRenderTarget(R),m=null,f=null,u=null,s=null,A=null,ee.stop(),n.isPresenting=!1,t.setPixelRatio(k),t.setSize(N.width,N.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){r=Q,n.isPresenting===!0&&Jt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){o=Q,n.isPresenting===!0&&Jt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return u===null&&M&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return v},this.getSession=function(){return s},this.setSession=async function(Q){if(s=Q,s!==null){if(R=t.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",j),s.addEventListener("inputsourceschange",G),y.xrCompatible!==!0&&await e.makeXRCompatible(),k=t.getPixelRatio(),t.getSize(N),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let bt=null,kt=null,_t=null;y.depth&&(_t=y.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,bt=y.stencil?ur:_s,kt=y.stencil?eo:Xi);const te={colorFormat:e.RGBA8,depthFormat:_t,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(te),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),A=new Vi(f.textureWidth,f.textureHeight,{format:Ti,type:hi,depthTexture:new so(f.textureWidth,f.textureHeight,kt,void 0,void 0,void 0,void 0,void 0,void 0,bt),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const bt={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,e,bt),s.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),A=new Vi(m.framebufferWidth,m.framebufferHeight,{format:Ti,type:hi,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),ee.setContext(s),ee.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function G(Q){for(let et=0;et<Q.removed.length;et++){const bt=Q.removed[et],kt=w.indexOf(bt);kt>=0&&(w[kt]=null,D[kt].disconnect(bt))}for(let et=0;et<Q.added.length;et++){const bt=Q.added[et];let kt=w.indexOf(bt);if(kt===-1){for(let te=0;te<D.length;te++)if(te>=w.length){w.push(bt),kt=te;break}else if(w[te]===null){w[te]=bt,kt=te;break}if(kt===-1)break}const _t=D[kt];_t&&_t.connect(bt)}}const st=new X,dt=new X;function at(Q,et,bt){st.setFromMatrixPosition(et.matrixWorld),dt.setFromMatrixPosition(bt.matrixWorld);const kt=st.distanceTo(dt),_t=et.projectionMatrix.elements,te=bt.projectionMatrix.elements,Ce=_t[14]/(_t[10]-1),Yt=_t[14]/(_t[10]+1),re=(_t[9]+1)/_t[5],he=(_t[9]-1)/_t[5],qt=(_t[8]-1)/_t[0],Oe=(te[8]+1)/te[0],F=Ce*qt,Pe=Ce*Oe,jt=kt/(-qt+Oe),pe=jt*-qt;if(et.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(pe),Q.translateZ(jt),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),_t[10]===-1)Q.projectionMatrix.copy(et.projectionMatrix),Q.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{const Dt=Ce+jt,P=Yt+jt,x=F-pe,U=Pe+(kt-pe),Z=re*Yt/P*Dt,nt=he*Yt/P*Dt;Q.projectionMatrix.makePerspective(x,U,Z,nt,Dt,P),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function ut(Q,et){et===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(et.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(s===null)return;let et=Q.near,bt=Q.far;p.texture!==null&&(p.depthNear>0&&(et=p.depthNear),p.depthFar>0&&(bt=p.depthFar)),W.near=T.near=E.near=et,W.far=T.far=E.far=bt,(z!==W.near||K!==W.far)&&(s.updateRenderState({depthNear:W.near,depthFar:W.far}),z=W.near,K=W.far),W.layers.mask=Q.layers.mask|6,E.layers.mask=W.layers.mask&3,T.layers.mask=W.layers.mask&5;const kt=Q.parent,_t=W.cameras;ut(W,kt);for(let te=0;te<_t.length;te++)ut(_t[te],kt);_t.length===2?at(W,E,T):W.projectionMatrix.copy(E.projectionMatrix),St(Q,W,kt)};function St(Q,et,bt){bt===null?Q.matrix.copy(et.matrixWorld):(Q.matrix.copy(bt.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(et.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(et.projectionMatrix),Q.projectionMatrixInverse.copy(et.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Du*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return W},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(Q){l=Q,f!==null&&(f.fixedFoveation=Q),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Q)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(W)},this.getCameraTexture=function(Q){return d[Q]};let ht=null;function Qt(Q,et){if(h=et.getViewerPose(c||a),v=et,h!==null){const bt=h.views;m!==null&&(t.setRenderTargetFramebuffer(A,m.framebuffer),t.setRenderTarget(A));let kt=!1;bt.length!==W.cameras.length&&(W.cameras.length=0,kt=!0);for(let Yt=0;Yt<bt.length;Yt++){const re=bt[Yt];let he=null;if(m!==null)he=m.getViewport(re);else{const Oe=u.getViewSubImage(f,re);he=Oe.viewport,Yt===0&&(t.setRenderTargetTextures(A,Oe.colorTexture,Oe.depthStencilTexture),t.setRenderTarget(A))}let qt=L[Yt];qt===void 0&&(qt=new ci,qt.layers.enable(Yt),qt.viewport=new $e,L[Yt]=qt),qt.matrix.fromArray(re.transform.matrix),qt.matrix.decompose(qt.position,qt.quaternion,qt.scale),qt.projectionMatrix.fromArray(re.projectionMatrix),qt.projectionMatrixInverse.copy(qt.projectionMatrix).invert(),qt.viewport.set(he.x,he.y,he.width,he.height),Yt===0&&(W.matrix.copy(qt.matrix),W.matrix.decompose(W.position,W.quaternion,W.scale)),kt===!0&&W.cameras.push(qt)}const _t=s.enabledFeatures;if(_t&&_t.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){u=n.getBinding();const Yt=u.getDepthInformation(bt[0]);Yt&&Yt.isValid&&Yt.texture&&p.init(Yt,s.renderState)}if(_t&&_t.includes("camera-access")&&M){t.state.unbindTexture(),u=n.getBinding();for(let Yt=0;Yt<bt.length;Yt++){const re=bt[Yt].camera;if(re){let he=d[re];he||(he=new Gp,d[re]=he);const qt=u.getCameraImage(re);he.sourceTexture=qt}}}}for(let bt=0;bt<D.length;bt++){const kt=w[bt],_t=D[bt];kt!==null&&_t!==void 0&&_t.update(kt,et,c||a)}ht&&ht(Q,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),v=null}const ee=new Hp;ee.setAnimationLoop(Qt),this.setAnimationLoop=function(Q){ht=Q},this.dispose=function(){}}}const Qs=new xs,gS=new Ke;function _S(i,t){function e(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function n(p,d){d.color.getRGB(p.fogColor.value,Ip(i)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function s(p,d,y,R,A){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(p,d):d.isMeshToonMaterial?(r(p,d),u(p,d)):d.isMeshPhongMaterial?(r(p,d),h(p,d)):d.isMeshStandardMaterial?(r(p,d),f(p,d),d.isMeshPhysicalMaterial&&m(p,d,A)):d.isMeshMatcapMaterial?(r(p,d),v(p,d)):d.isMeshDepthMaterial?r(p,d):d.isMeshDistanceMaterial?(r(p,d),M(p,d)):d.isMeshNormalMaterial?r(p,d):d.isLineBasicMaterial?(a(p,d),d.isLineDashedMaterial&&o(p,d)):d.isPointsMaterial?l(p,d,y,R):d.isSpriteMaterial?c(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,e(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,e(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===kn&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,e(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===kn&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,e(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,e(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const y=t.get(d),R=y.envMap,A=y.envMapRotation;R&&(p.envMap.value=R,Qs.copy(A),Qs.x*=-1,Qs.y*=-1,Qs.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(Qs.y*=-1,Qs.z*=-1),p.envMapRotation.value.setFromMatrix4(gS.makeRotationFromEuler(Qs)),p.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap&&(p.lightMap.value=d.lightMap,p.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,p.lightMapTransform)),d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,p.aoMapTransform))}function a(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,e(d.map,p.mapTransform))}function o(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function l(p,d,y,R){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*y,p.scale.value=R*.5,d.map&&(p.map.value=d.map,e(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function c(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,e(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function h(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function u(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function f(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,p.roughnessMapTransform)),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,y){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===kn&&p.clearcoatNormalScale.value.negate())),d.dispersion>0&&(p.dispersion.value=d.dispersion),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,p.specularIntensityMapTransform))}function v(p,d){d.matcap&&(p.matcap.value=d.matcap)}function M(p,d){const y=t.get(d).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function xS(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,R){const A=R.program;n.uniformBlockBinding(y,A)}function c(y,R){let A=s[y.id];A===void 0&&(v(y),A=h(y),s[y.id]=A,y.addEventListener("dispose",p));const D=R.program;n.updateUBOMapping(y,D);const w=t.render.frame;r[y.id]!==w&&(f(y),r[y.id]=w)}function h(y){const R=u();y.__bindingPointIndex=R;const A=i.createBuffer(),D=y.__size,w=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,A),i.bufferData(i.UNIFORM_BUFFER,D,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,R,A),A}function u(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return de("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){const R=s[y.id],A=y.uniforms,D=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,R);for(let w=0,N=A.length;w<N;w++){const k=Array.isArray(A[w])?A[w]:[A[w]];for(let E=0,T=k.length;E<T;E++){const L=k[E];if(m(L,w,E,D)===!0){const W=L.__offset,z=Array.isArray(L.value)?L.value:[L.value];let K=0;for(let V=0;V<z.length;V++){const j=z[V],G=M(j);typeof j=="number"||typeof j=="boolean"?(L.__data[0]=j,i.bufferSubData(i.UNIFORM_BUFFER,W+K,L.__data)):j.isMatrix3?(L.__data[0]=j.elements[0],L.__data[1]=j.elements[1],L.__data[2]=j.elements[2],L.__data[3]=0,L.__data[4]=j.elements[3],L.__data[5]=j.elements[4],L.__data[6]=j.elements[5],L.__data[7]=0,L.__data[8]=j.elements[6],L.__data[9]=j.elements[7],L.__data[10]=j.elements[8],L.__data[11]=0):(j.toArray(L.__data,K),K+=G.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,W,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(y,R,A,D){const w=y.value,N=R+"_"+A;if(D[N]===void 0)return typeof w=="number"||typeof w=="boolean"?D[N]=w:D[N]=w.clone(),!0;{const k=D[N];if(typeof w=="number"||typeof w=="boolean"){if(k!==w)return D[N]=w,!0}else if(k.equals(w)===!1)return k.copy(w),!0}return!1}function v(y){const R=y.uniforms;let A=0;const D=16;for(let N=0,k=R.length;N<k;N++){const E=Array.isArray(R[N])?R[N]:[R[N]];for(let T=0,L=E.length;T<L;T++){const W=E[T],z=Array.isArray(W.value)?W.value:[W.value];for(let K=0,V=z.length;K<V;K++){const j=z[K],G=M(j),st=A%D,dt=st%G.boundary,at=st+dt;A+=dt,at!==0&&D-at<G.storage&&(A+=D-at),W.__data=new Float32Array(G.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=A,A+=G.storage}}}const w=A%D;return w>0&&(A+=D-w),y.__size=A,y.__cache={},this}function M(y){const R={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(R.boundary=4,R.storage=4):y.isVector2?(R.boundary=8,R.storage=8):y.isVector3||y.isColor?(R.boundary=16,R.storage=12):y.isVector4?(R.boundary=16,R.storage=16):y.isMatrix3?(R.boundary=48,R.storage=48):y.isMatrix4?(R.boundary=64,R.storage=64):y.isTexture?Jt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Jt("WebGLRenderer: Unsupported uniform value type.",y),R}function p(y){const R=y.target;R.removeEventListener("dispose",p);const A=a.indexOf(R.__bindingPointIndex);a.splice(A,1),i.deleteBuffer(s[R.id]),delete s[R.id],delete r[R.id]}function d(){for(const y in s)i.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}const vS=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ui=null;function MS(){return Ui===null&&(Ui=new m0(vS,16,16,la,gs),Ui.name="DFG_LUT",Ui.minFilter=sn,Ui.magFilter=sn,Ui.wrapS=cs,Ui.wrapT=cs,Ui.generateMipmaps=!1,Ui.needsUpdate=!0),Ui}class SS{constructor(t={}){const{canvas:e=Gg(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1,outputBufferType:m=hi}=t;this.isWebGLRenderer=!0;let v;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");v=n.getContextAttributes().alpha}else v=a;const M=m,p=new Set([uh,ch,lh]),d=new Set([hi,Xi,to,eo,ah,oh]),y=new Uint32Array(4),R=new Int32Array(4);let A=null,D=null;const w=[],N=[];let k=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Hi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const E=this;let T=!1;this._outputColorSpace=oi;let L=0,W=0,z=null,K=-1,V=null;const j=new $e,G=new $e;let st=null;const dt=new Re(0);let at=0,ut=e.width,St=e.height,ht=1,Qt=null,ee=null;const Q=new $e(0,0,ut,St),et=new $e(0,0,ut,St);let bt=!1;const kt=new Bp;let _t=!1,te=!1;const Ce=new Ke,Yt=new X,re=new $e,he={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let qt=!1;function Oe(){return z===null?ht:1}let F=n;function Pe(b,H){return e.getContext(b,H)}try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${sh}`),e.addEventListener("webglcontextlost",$t,!1),e.addEventListener("webglcontextrestored",De,!1),e.addEventListener("webglcontextcreationerror",ve,!1),F===null){const H="webgl2";if(F=Pe(H,b),F===null)throw Pe(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw de("WebGLRenderer: "+b.message),b}let jt,pe,Dt,P,x,U,Z,nt,tt,Nt,mt,Lt,Bt,ot,pt,At,Ot,xt,Kt,O,yt,lt,wt,ft;function rt(){jt=new Mv(F),jt.init(),lt=new hS(F,jt),pe=new hv(F,jt,t,lt),Dt=new cS(F,jt),pe.reversedDepthBuffer&&f&&Dt.buffers.depth.setReversed(!0),P=new Ev(F),x=new jM,U=new uS(F,jt,Dt,x,pe,lt,P),Z=new dv(E),nt=new vv(E),tt=new w0(F),wt=new cv(F,tt),Nt=new Sv(F,tt,P,wt),mt=new Tv(F,Nt,tt,P),Kt=new bv(F,pe,U),At=new fv(x),Lt=new qM(E,Z,nt,jt,pe,wt,At),Bt=new _S(E,x),ot=new $M,pt=new nS(jt),xt=new lv(E,Z,nt,Dt,mt,v,l),Ot=new oS(E,mt,pe),ft=new xS(F,P,pe,Dt),O=new uv(F,jt,P),yt=new yv(F,jt,P),P.programs=Lt.programs,E.capabilities=pe,E.extensions=jt,E.properties=x,E.renderLists=ot,E.shadowMap=Ot,E.state=Dt,E.info=P}rt(),M!==hi&&(k=new wv(M,e.width,e.height,s,r));const vt=new mS(E,F);this.xr=vt,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const b=jt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=jt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return ht},this.setPixelRatio=function(b){b!==void 0&&(ht=b,this.setSize(ut,St,!1))},this.getSize=function(b){return b.set(ut,St)},this.setSize=function(b,H,J=!0){if(vt.isPresenting){Jt("WebGLRenderer: Can't change size while VR device is presenting.");return}ut=b,St=H,e.width=Math.floor(b*ht),e.height=Math.floor(H*ht),J===!0&&(e.style.width=b+"px",e.style.height=H+"px"),k!==null&&k.setSize(e.width,e.height),this.setViewport(0,0,b,H)},this.getDrawingBufferSize=function(b){return b.set(ut*ht,St*ht).floor()},this.setDrawingBufferSize=function(b,H,J){ut=b,St=H,ht=J,e.width=Math.floor(b*J),e.height=Math.floor(H*J),this.setViewport(0,0,b,H)},this.setEffects=function(b){if(M===hi){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let H=0;H<b.length;H++)if(b[H].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}k.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(j)},this.getViewport=function(b){return b.copy(Q)},this.setViewport=function(b,H,J,$){b.isVector4?Q.set(b.x,b.y,b.z,b.w):Q.set(b,H,J,$),Dt.viewport(j.copy(Q).multiplyScalar(ht).round())},this.getScissor=function(b){return b.copy(et)},this.setScissor=function(b,H,J,$){b.isVector4?et.set(b.x,b.y,b.z,b.w):et.set(b,H,J,$),Dt.scissor(G.copy(et).multiplyScalar(ht).round())},this.getScissorTest=function(){return bt},this.setScissorTest=function(b){Dt.setScissorTest(bt=b)},this.setOpaqueSort=function(b){Qt=b},this.setTransparentSort=function(b){ee=b},this.getClearColor=function(b){return b.copy(xt.getClearColor())},this.setClearColor=function(){xt.setClearColor(...arguments)},this.getClearAlpha=function(){return xt.getClearAlpha()},this.setClearAlpha=function(){xt.setClearAlpha(...arguments)},this.clear=function(b=!0,H=!0,J=!0){let $=0;if(b){let Y=!1;if(z!==null){const Mt=z.texture.format;Y=p.has(Mt)}if(Y){const Mt=z.texture.type,Ct=d.has(Mt),Et=xt.getClearColor(),It=xt.getClearAlpha(),zt=Et.r,Vt=Et.g,Ut=Et.b;Ct?(y[0]=zt,y[1]=Vt,y[2]=Ut,y[3]=It,F.clearBufferuiv(F.COLOR,0,y)):(R[0]=zt,R[1]=Vt,R[2]=Ut,R[3]=It,F.clearBufferiv(F.COLOR,0,R))}else $|=F.COLOR_BUFFER_BIT}H&&($|=F.DEPTH_BUFFER_BIT),J&&($|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",$t,!1),e.removeEventListener("webglcontextrestored",De,!1),e.removeEventListener("webglcontextcreationerror",ve,!1),xt.dispose(),ot.dispose(),pt.dispose(),x.dispose(),Z.dispose(),nt.dispose(),mt.dispose(),wt.dispose(),ft.dispose(),Lt.dispose(),vt.dispose(),vt.removeEventListener("sessionstart",ji),vt.removeEventListener("sessionend",Ki),wi.stop()};function $t(b){b.preventDefault(),ul("WebGLRenderer: Context Lost."),T=!0}function De(){ul("WebGLRenderer: Context Restored."),T=!1;const b=P.autoReset,H=Ot.enabled,J=Ot.autoUpdate,$=Ot.needsUpdate,Y=Ot.type;rt(),P.autoReset=b,Ot.enabled=H,Ot.autoUpdate=J,Ot.needsUpdate=$,Ot.type=Y}function ve(b){de("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function pn(b){const H=b.target;H.removeEventListener("dispose",pn),Be(H)}function Be(b){ei(b),x.remove(b)}function ei(b){const H=x.get(b).programs;H!==void 0&&(H.forEach(function(J){Lt.releaseProgram(J)}),b.isShaderMaterial&&Lt.releaseShaderCache(b))}this.renderBufferDirect=function(b,H,J,$,Y,Mt){H===null&&(H=he);const Ct=Y.isMesh&&Y.matrixWorld.determinant()<0,Et=rn(b,H,J,$,Y);Dt.setMaterial($,Ct);let It=J.index,zt=1;if($.wireframe===!0){if(It=Nt.getWireframeAttribute(J),It===void 0)return;zt=2}const Vt=J.drawRange,Ut=J.attributes.position;let ne=Vt.start*zt,Me=(Vt.start+Vt.count)*zt;Mt!==null&&(ne=Math.max(ne,Mt.start*zt),Me=Math.min(Me,(Mt.start+Mt.count)*zt)),It!==null?(ne=Math.max(ne,0),Me=Math.min(Me,It.count)):Ut!=null&&(ne=Math.max(ne,0),Me=Math.min(Me,Ut.count));const ze=Me-ne;if(ze<0||ze===1/0)return;wt.setup(Y,$,Et,J,It);let Ge,Ae=O;if(It!==null&&(Ge=tt.get(It),Ae=yt,Ae.setIndex(Ge)),Y.isMesh)$.wireframe===!0?(Dt.setLineWidth($.wireframeLinewidth*Oe()),Ae.setMode(F.LINES)):Ae.setMode(F.TRIANGLES);else if(Y.isLine){let Ht=$.linewidth;Ht===void 0&&(Ht=1),Dt.setLineWidth(Ht*Oe()),Y.isLineSegments?Ae.setMode(F.LINES):Y.isLineLoop?Ae.setMode(F.LINE_LOOP):Ae.setMode(F.LINE_STRIP)}else Y.isPoints?Ae.setMode(F.POINTS):Y.isSprite&&Ae.setMode(F.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)no("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ae.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(jt.get("WEBGL_multi_draw"))Ae.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Ht=Y._multiDrawStarts,Se=Y._multiDrawCounts,ue=Y._multiDrawCount,En=It?tt.get(It).bytesPerElement:1,vs=x.get($).currentProgram.getUniforms();for(let bn=0;bn<ue;bn++)vs.setValue(F,"_gl_DrawID",bn),Ae.render(Ht[bn]/En,Se[bn])}else if(Y.isInstancedMesh)Ae.renderInstances(ne,ze,Y.count);else if(J.isInstancedBufferGeometry){const Ht=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Se=Math.min(J.instanceCount,Ht);Ae.renderInstances(ne,ze,Se)}else Ae.render(ne,ze)};function qi(b,H,J){b.transparent===!0&&b.side===Bi&&b.forceSinglePass===!1?(b.side=kn,b.needsUpdate=!0,Ri(b,H,J),b.side=Fs,b.needsUpdate=!0,Ri(b,H,J),b.side=Bi):Ri(b,H,J)}this.compile=function(b,H,J=null){J===null&&(J=b),D=pt.get(J),D.init(H),N.push(D),J.traverseVisible(function(Y){Y.isLight&&Y.layers.test(H.layers)&&(D.pushLight(Y),Y.castShadow&&D.pushShadow(Y))}),b!==J&&b.traverseVisible(function(Y){Y.isLight&&Y.layers.test(H.layers)&&(D.pushLight(Y),Y.castShadow&&D.pushShadow(Y))}),D.setupLights();const $=new Set;return b.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const Mt=Y.material;if(Mt)if(Array.isArray(Mt))for(let Ct=0;Ct<Mt.length;Ct++){const Et=Mt[Ct];qi(Et,J,Y),$.add(Et)}else qi(Mt,J,Y),$.add(Mt)}),D=N.pop(),$},this.compileAsync=function(b,H,J=null){const $=this.compile(b,H,J);return new Promise(Y=>{function Mt(){if($.forEach(function(Ct){x.get(Ct).currentProgram.isReady()&&$.delete(Ct)}),$.size===0){Y(b);return}setTimeout(Mt,10)}jt.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let Ai=null;function Fn(b){Ai&&Ai(b)}function ji(){wi.stop()}function Ki(){wi.start()}const wi=new Hp;wi.setAnimationLoop(Fn),typeof self<"u"&&wi.setContext(self),this.setAnimationLoop=function(b){Ai=b,vt.setAnimationLoop(b),b===null?wi.stop():wi.start()},vt.addEventListener("sessionstart",ji),vt.addEventListener("sessionend",Ki),this.render=function(b,H){if(H!==void 0&&H.isCamera!==!0){de("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;const J=vt.enabled===!0&&vt.isPresenting===!0,$=k!==null&&(z===null||J)&&k.begin(E,z);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),vt.enabled===!0&&vt.isPresenting===!0&&(k===null||k.isCompositing()===!1)&&(vt.cameraAutoUpdate===!0&&vt.updateCamera(H),H=vt.getCamera()),b.isScene===!0&&b.onBeforeRender(E,b,H,z),D=pt.get(b,N.length),D.init(H),N.push(D),Ce.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),kt.setFromProjectionMatrix(Ce,ki,H.reversedDepth),te=this.localClippingEnabled,_t=At.init(this.clippingPlanes,te),A=ot.get(b,w.length),A.init(),w.push(A),vt.enabled===!0&&vt.isPresenting===!0){const Ct=E.xr.getDepthSensingMesh();Ct!==null&&yr(Ct,H,-1/0,E.sortObjects)}yr(b,H,0,E.sortObjects),A.finish(),E.sortObjects===!0&&A.sort(Qt,ee),qt=vt.enabled===!1||vt.isPresenting===!1||vt.hasDepthSensing()===!1,qt&&xt.addToRenderList(A,b),this.info.render.frame++,_t===!0&&At.beginShadows();const Y=D.state.shadowsArray;if(Ot.render(Y,b,H),_t===!0&&At.endShadows(),this.info.autoReset===!0&&this.info.reset(),($&&k.hasRenderPass())===!1){const Ct=A.opaque,Et=A.transmissive;if(D.setupLights(),H.isArrayCamera){const It=H.cameras;if(Et.length>0)for(let zt=0,Vt=It.length;zt<Vt;zt++){const Ut=It[zt];_o(Ct,Et,b,Ut)}qt&&xt.render(b);for(let zt=0,Vt=It.length;zt<Vt;zt++){const Ut=It[zt];go(A,b,Ut,Ut.viewport)}}else Et.length>0&&_o(Ct,Et,b,H),qt&&xt.render(b),go(A,b,H)}z!==null&&W===0&&(U.updateMultisampleRenderTarget(z),U.updateRenderTargetMipmap(z)),$&&k.end(E),b.isScene===!0&&b.onAfterRender(E,b,H),wt.resetDefaultState(),K=-1,V=null,N.pop(),N.length>0?(D=N[N.length-1],_t===!0&&At.setGlobalState(E.clippingPlanes,D.state.camera)):D=null,w.pop(),w.length>0?A=w[w.length-1]:A=null};function yr(b,H,J,$){if(b.visible===!1)return;if(b.layers.test(H.layers)){if(b.isGroup)J=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(H);else if(b.isLight)D.pushLight(b),b.castShadow&&D.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||kt.intersectsSprite(b)){$&&re.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Ce);const Ct=mt.update(b),Et=b.material;Et.visible&&A.push(b,Ct,Et,J,re.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||kt.intersectsObject(b))){const Ct=mt.update(b),Et=b.material;if($&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),re.copy(b.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),re.copy(Ct.boundingSphere.center)),re.applyMatrix4(b.matrixWorld).applyMatrix4(Ce)),Array.isArray(Et)){const It=Ct.groups;for(let zt=0,Vt=It.length;zt<Vt;zt++){const Ut=It[zt],ne=Et[Ut.materialIndex];ne&&ne.visible&&A.push(b,Ct,ne,J,re.z,Ut)}}else Et.visible&&A.push(b,Ct,Et,J,re.z,null)}}const Mt=b.children;for(let Ct=0,Et=Mt.length;Ct<Et;Ct++)yr(Mt[Ct],H,J,$)}function go(b,H,J,$){const{opaque:Y,transmissive:Mt,transparent:Ct}=b;D.setupLightsView(J),_t===!0&&At.setGlobalState(E.clippingPlanes,J),$&&Dt.viewport(j.copy($)),Y.length>0&&ni(Y,H,J),Mt.length>0&&ni(Mt,H,J),Ct.length>0&&ni(Ct,H,J),Dt.buffers.depth.setTest(!0),Dt.buffers.depth.setMask(!0),Dt.buffers.color.setMask(!0),Dt.setPolygonOffset(!1)}function _o(b,H,J,$){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;if(D.state.transmissionRenderTarget[$.id]===void 0){const ne=jt.has("EXT_color_buffer_half_float")||jt.has("EXT_color_buffer_float");D.state.transmissionRenderTarget[$.id]=new Vi(1,1,{generateMipmaps:!0,type:ne?gs:hi,minFilter:cr,samples:pe.samples,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:me.workingColorSpace})}const Mt=D.state.transmissionRenderTarget[$.id],Ct=$.viewport||j;Mt.setSize(Ct.z*E.transmissionResolutionScale,Ct.w*E.transmissionResolutionScale);const Et=E.getRenderTarget(),It=E.getActiveCubeFace(),zt=E.getActiveMipmapLevel();E.setRenderTarget(Mt),E.getClearColor(dt),at=E.getClearAlpha(),at<1&&E.setClearColor(16777215,.5),E.clear(),qt&&xt.render(J);const Vt=E.toneMapping;E.toneMapping=Hi;const Ut=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),D.setupLightsView($),_t===!0&&At.setGlobalState(E.clippingPlanes,$),ni(b,J,$),U.updateMultisampleRenderTarget(Mt),U.updateRenderTargetMipmap(Mt),jt.has("WEBGL_multisampled_render_to_texture")===!1){let ne=!1;for(let Me=0,ze=H.length;Me<ze;Me++){const Ge=H[Me],{object:Ae,geometry:Ht,material:Se,group:ue}=Ge;if(Se.side===Bi&&Ae.layers.test($.layers)){const En=Se.side;Se.side=kn,Se.needsUpdate=!0,xo(Ae,J,$,Ht,Se,ue),Se.side=En,Se.needsUpdate=!0,ne=!0}}ne===!0&&(U.updateMultisampleRenderTarget(Mt),U.updateRenderTargetMipmap(Mt))}E.setRenderTarget(Et,It,zt),E.setClearColor(dt,at),Ut!==void 0&&($.viewport=Ut),E.toneMapping=Vt}function ni(b,H,J){const $=H.isScene===!0?H.overrideMaterial:null;for(let Y=0,Mt=b.length;Y<Mt;Y++){const Ct=b[Y],{object:Et,geometry:It,group:zt}=Ct;let Vt=Ct.material;Vt.allowOverride===!0&&$!==null&&(Vt=$),Et.layers.test(J.layers)&&xo(Et,H,J,It,Vt,zt)}}function xo(b,H,J,$,Y,Mt){b.onBeforeRender(E,H,J,$,Y,Mt),b.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),Y.onBeforeRender(E,H,J,$,b,Mt),Y.transparent===!0&&Y.side===Bi&&Y.forceSinglePass===!1?(Y.side=kn,Y.needsUpdate=!0,E.renderBufferDirect(J,H,$,Y,b,Mt),Y.side=Fs,Y.needsUpdate=!0,E.renderBufferDirect(J,H,$,Y,b,Mt),Y.side=Bi):E.renderBufferDirect(J,H,$,Y,b,Mt),b.onAfterRender(E,H,J,$,Y,Mt)}function Ri(b,H,J){H.isScene!==!0&&(H=he);const $=x.get(b),Y=D.state.lights,Mt=D.state.shadowsArray,Ct=Y.state.version,Et=Lt.getParameters(b,Y.state,Mt,H,J),It=Lt.getProgramCacheKey(Et);let zt=$.programs;$.environment=b.isMeshStandardMaterial?H.environment:null,$.fog=H.fog,$.envMap=(b.isMeshStandardMaterial?nt:Z).get(b.envMap||$.environment),$.envMapRotation=$.environment!==null&&b.envMap===null?H.environmentRotation:b.envMapRotation,zt===void 0&&(b.addEventListener("dispose",pn),zt=new Map,$.programs=zt);let Vt=zt.get(It);if(Vt!==void 0){if($.currentProgram===Vt&&$.lightsStateVersion===Ct)return mi(b,Et),Vt}else Et.uniforms=Lt.getUniforms(b),b.onBeforeCompile(Et,E),Vt=Lt.acquireProgram(Et,It),zt.set(It,Vt),$.uniforms=Et.uniforms;const Ut=$.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ut.clippingPlanes=At.uniform),mi(b,Et),$.needsLights=Qe(b),$.lightsStateVersion=Ct,$.needsLights&&(Ut.ambientLightColor.value=Y.state.ambient,Ut.lightProbe.value=Y.state.probe,Ut.directionalLights.value=Y.state.directional,Ut.directionalLightShadows.value=Y.state.directionalShadow,Ut.spotLights.value=Y.state.spot,Ut.spotLightShadows.value=Y.state.spotShadow,Ut.rectAreaLights.value=Y.state.rectArea,Ut.ltc_1.value=Y.state.rectAreaLTC1,Ut.ltc_2.value=Y.state.rectAreaLTC2,Ut.pointLights.value=Y.state.point,Ut.pointLightShadows.value=Y.state.pointShadow,Ut.hemisphereLights.value=Y.state.hemi,Ut.directionalShadowMap.value=Y.state.directionalShadowMap,Ut.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Ut.spotShadowMap.value=Y.state.spotShadowMap,Ut.spotLightMatrix.value=Y.state.spotLightMatrix,Ut.spotLightMap.value=Y.state.spotLightMap,Ut.pointShadowMap.value=Y.state.pointShadowMap,Ut.pointShadowMatrix.value=Y.state.pointShadowMatrix),$.currentProgram=Vt,$.uniformsList=null,Vt}function Sa(b){if(b.uniformsList===null){const H=b.currentProgram.getUniforms();b.uniformsList=sl.seqWithValue(H.seq,b.uniforms)}return b.uniformsList}function mi(b,H){const J=x.get(b);J.outputColorSpace=H.outputColorSpace,J.batching=H.batching,J.batchingColor=H.batchingColor,J.instancing=H.instancing,J.instancingColor=H.instancingColor,J.instancingMorph=H.instancingMorph,J.skinning=H.skinning,J.morphTargets=H.morphTargets,J.morphNormals=H.morphNormals,J.morphColors=H.morphColors,J.morphTargetsCount=H.morphTargetsCount,J.numClippingPlanes=H.numClippingPlanes,J.numIntersection=H.numClipIntersection,J.vertexAlphas=H.vertexAlphas,J.vertexTangents=H.vertexTangents,J.toneMapping=H.toneMapping}function rn(b,H,J,$,Y){H.isScene!==!0&&(H=he),U.resetTextureUnits();const Mt=H.fog,Ct=$.isMeshStandardMaterial?H.environment:null,Et=z===null?E.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:ca,It=($.isMeshStandardMaterial?nt:Z).get($.envMap||Ct),zt=$.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Vt=!!J.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Ut=!!J.morphAttributes.position,ne=!!J.morphAttributes.normal,Me=!!J.morphAttributes.color;let ze=Hi;$.toneMapped&&(z===null||z.isXRRenderTarget===!0)&&(ze=E.toneMapping);const Ge=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Ae=Ge!==void 0?Ge.length:0,Ht=x.get($),Se=D.state.lights;if(_t===!0&&(te===!0||b!==V)){const on=b===V&&$.id===K;At.setState($,b,on)}let ue=!1;$.version===Ht.__version?(Ht.needsLights&&Ht.lightsStateVersion!==Se.state.version||Ht.outputColorSpace!==Et||Y.isBatchedMesh&&Ht.batching===!1||!Y.isBatchedMesh&&Ht.batching===!0||Y.isBatchedMesh&&Ht.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Ht.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Ht.instancing===!1||!Y.isInstancedMesh&&Ht.instancing===!0||Y.isSkinnedMesh&&Ht.skinning===!1||!Y.isSkinnedMesh&&Ht.skinning===!0||Y.isInstancedMesh&&Ht.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Ht.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Ht.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Ht.instancingMorph===!1&&Y.morphTexture!==null||Ht.envMap!==It||$.fog===!0&&Ht.fog!==Mt||Ht.numClippingPlanes!==void 0&&(Ht.numClippingPlanes!==At.numPlanes||Ht.numIntersection!==At.numIntersection)||Ht.vertexAlphas!==zt||Ht.vertexTangents!==Vt||Ht.morphTargets!==Ut||Ht.morphNormals!==ne||Ht.morphColors!==Me||Ht.toneMapping!==ze||Ht.morphTargetsCount!==Ae)&&(ue=!0):(ue=!0,Ht.__version=$.version);let En=Ht.currentProgram;ue===!0&&(En=Ri($,H,Y));let vs=!1,bn=!1,$i=!1;const ye=En.getUniforms(),an=Ht.uniforms;if(Dt.useProgram(En.program)&&(vs=!0,bn=!0,$i=!0),$.id!==K&&(K=$.id,bn=!0),vs||V!==b){Dt.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),ye.setValue(F,"projectionMatrix",b.projectionMatrix),ye.setValue(F,"viewMatrix",b.matrixWorldInverse);const Tn=ye.map.cameraPosition;Tn!==void 0&&Tn.setValue(F,Yt.setFromMatrixPosition(b.matrixWorld)),pe.logarithmicDepthBuffer&&ye.setValue(F,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&ye.setValue(F,"isOrthographic",b.isOrthographicCamera===!0),V!==b&&(V=b,bn=!0,$i=!0)}if(Ht.needsLights&&(Se.state.directionalShadowMap.length>0&&ye.setValue(F,"directionalShadowMap",Se.state.directionalShadowMap,U),Se.state.spotShadowMap.length>0&&ye.setValue(F,"spotShadowMap",Se.state.spotShadowMap,U),Se.state.pointShadowMap.length>0&&ye.setValue(F,"pointShadowMap",Se.state.pointShadowMap,U)),Y.isSkinnedMesh){ye.setOptional(F,Y,"bindMatrix"),ye.setOptional(F,Y,"bindMatrixInverse");const on=Y.skeleton;on&&(on.boneTexture===null&&on.computeBoneTexture(),ye.setValue(F,"boneTexture",on.boneTexture,U))}Y.isBatchedMesh&&(ye.setOptional(F,Y,"batchingTexture"),ye.setValue(F,"batchingTexture",Y._matricesTexture,U),ye.setOptional(F,Y,"batchingIdTexture"),ye.setValue(F,"batchingIdTexture",Y._indirectTexture,U),ye.setOptional(F,Y,"batchingColorTexture"),Y._colorsTexture!==null&&ye.setValue(F,"batchingColorTexture",Y._colorsTexture,U));const On=J.morphAttributes;if((On.position!==void 0||On.normal!==void 0||On.color!==void 0)&&Kt.update(Y,J,En),(bn||Ht.receiveShadow!==Y.receiveShadow)&&(Ht.receiveShadow=Y.receiveShadow,ye.setValue(F,"receiveShadow",Y.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(an.envMap.value=It,an.flipEnvMap.value=It.isCubeTexture&&It.isRenderTargetTexture===!1?-1:1),$.isMeshStandardMaterial&&$.envMap===null&&H.environment!==null&&(an.envMapIntensity.value=H.environmentIntensity),an.dfgLUT!==void 0&&(an.dfgLUT.value=MS()),bn&&(ye.setValue(F,"toneMappingExposure",E.toneMappingExposure),Ht.needsLights&&Je(an,$i),Mt&&$.fog===!0&&Bt.refreshFogUniforms(an,Mt),Bt.refreshMaterialUniforms(an,$,ht,St,D.state.transmissionRenderTarget[b.id]),sl.upload(F,Sa(Ht),an,U)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(sl.upload(F,Sa(Ht),an,U),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&ye.setValue(F,"center",Y.center),ye.setValue(F,"modelViewMatrix",Y.modelViewMatrix),ye.setValue(F,"normalMatrix",Y.normalMatrix),ye.setValue(F,"modelMatrix",Y.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){const on=$.uniformsGroups;for(let Tn=0,ya=on.length;Tn<ya;Tn++){const Zi=on[Tn];ft.update(Zi,En),ft.bind(Zi,En)}}return En}function Je(b,H){b.ambientLightColor.needsUpdate=H,b.lightProbe.needsUpdate=H,b.directionalLights.needsUpdate=H,b.directionalLightShadows.needsUpdate=H,b.pointLights.needsUpdate=H,b.pointLightShadows.needsUpdate=H,b.spotLights.needsUpdate=H,b.spotLightShadows.needsUpdate=H,b.rectAreaLights.needsUpdate=H,b.hemisphereLights.needsUpdate=H}function Qe(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return W},this.getRenderTarget=function(){return z},this.setRenderTargetTextures=function(b,H,J){const $=x.get(b);$.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,$.__autoAllocateDepthBuffer===!1&&($.__useRenderToTexture=!1),x.get(b.texture).__webglTexture=H,x.get(b.depthTexture).__webglTexture=$.__autoAllocateDepthBuffer?void 0:J,$.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,H){const J=x.get(b);J.__webglFramebuffer=H,J.__useDefaultFramebuffer=H===void 0};const Er=F.createFramebuffer();this.setRenderTarget=function(b,H=0,J=0){z=b,L=H,W=J;let $=null,Y=!1,Mt=!1;if(b){const Et=x.get(b);if(Et.__useDefaultFramebuffer!==void 0){Dt.bindFramebuffer(F.FRAMEBUFFER,Et.__webglFramebuffer),j.copy(b.viewport),G.copy(b.scissor),st=b.scissorTest,Dt.viewport(j),Dt.scissor(G),Dt.setScissorTest(st),K=-1;return}else if(Et.__webglFramebuffer===void 0)U.setupRenderTarget(b);else if(Et.__hasExternalTextures)U.rebindTextures(b,x.get(b.texture).__webglTexture,x.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Vt=b.depthTexture;if(Et.__boundDepthTexture!==Vt){if(Vt!==null&&x.has(Vt)&&(b.width!==Vt.image.width||b.height!==Vt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");U.setupDepthRenderbuffer(b)}}const It=b.texture;(It.isData3DTexture||It.isDataArrayTexture||It.isCompressedArrayTexture)&&(Mt=!0);const zt=x.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(zt[H])?$=zt[H][J]:$=zt[H],Y=!0):b.samples>0&&U.useMultisampledRTT(b)===!1?$=x.get(b).__webglMultisampledFramebuffer:Array.isArray(zt)?$=zt[J]:$=zt,j.copy(b.viewport),G.copy(b.scissor),st=b.scissorTest}else j.copy(Q).multiplyScalar(ht).floor(),G.copy(et).multiplyScalar(ht).floor(),st=bt;if(J!==0&&($=Er),Dt.bindFramebuffer(F.FRAMEBUFFER,$)&&Dt.drawBuffers(b,$),Dt.viewport(j),Dt.scissor(G),Dt.setScissorTest(st),Y){const Et=x.get(b.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+H,Et.__webglTexture,J)}else if(Mt){const Et=H;for(let It=0;It<b.textures.length;It++){const zt=x.get(b.textures[It]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+It,zt.__webglTexture,J,Et)}}else if(b!==null&&J!==0){const Et=x.get(b.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Et.__webglTexture,J)}K=-1},this.readRenderTargetPixels=function(b,H,J,$,Y,Mt,Ct,Et=0){if(!(b&&b.isWebGLRenderTarget)){de("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=x.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ct!==void 0&&(It=It[Ct]),It){Dt.bindFramebuffer(F.FRAMEBUFFER,It);try{const zt=b.textures[Et],Vt=zt.format,Ut=zt.type;if(!pe.textureFormatReadable(Vt)){de("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!pe.textureTypeReadable(Ut)){de("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=b.width-$&&J>=0&&J<=b.height-Y&&(b.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Et),F.readPixels(H,J,$,Y,lt.convert(Vt),lt.convert(Ut),Mt))}finally{const zt=z!==null?x.get(z).__webglFramebuffer:null;Dt.bindFramebuffer(F.FRAMEBUFFER,zt)}}},this.readRenderTargetPixelsAsync=async function(b,H,J,$,Y,Mt,Ct,Et=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let It=x.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ct!==void 0&&(It=It[Ct]),It)if(H>=0&&H<=b.width-$&&J>=0&&J<=b.height-Y){Dt.bindFramebuffer(F.FRAMEBUFFER,It);const zt=b.textures[Et],Vt=zt.format,Ut=zt.type;if(!pe.textureFormatReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!pe.textureTypeReadable(Ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ne=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,ne),F.bufferData(F.PIXEL_PACK_BUFFER,Mt.byteLength,F.STREAM_READ),b.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Et),F.readPixels(H,J,$,Y,lt.convert(Vt),lt.convert(Ut),0);const Me=z!==null?x.get(z).__webglFramebuffer:null;Dt.bindFramebuffer(F.FRAMEBUFFER,Me);const ze=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await kg(F,ze,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,ne),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,Mt),F.deleteBuffer(ne),F.deleteSync(ze),Mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,H=null,J=0){const $=Math.pow(2,-J),Y=Math.floor(b.image.width*$),Mt=Math.floor(b.image.height*$),Ct=H!==null?H.x:0,Et=H!==null?H.y:0;U.setTexture2D(b,0),F.copyTexSubImage2D(F.TEXTURE_2D,J,0,0,Ct,Et,Y,Mt),Dt.unbindTexture()};const Wn=F.createFramebuffer(),Vs=F.createFramebuffer();this.copyTextureToTexture=function(b,H,J=null,$=null,Y=0,Mt=null){Mt===null&&(Y!==0?(no("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Mt=Y,Y=0):Mt=0);let Ct,Et,It,zt,Vt,Ut,ne,Me,ze;const Ge=b.isCompressedTexture?b.mipmaps[Mt]:b.image;if(J!==null)Ct=J.max.x-J.min.x,Et=J.max.y-J.min.y,It=J.isBox3?J.max.z-J.min.z:1,zt=J.min.x,Vt=J.min.y,Ut=J.isBox3?J.min.z:0;else{const On=Math.pow(2,-Y);Ct=Math.floor(Ge.width*On),Et=Math.floor(Ge.height*On),b.isDataArrayTexture?It=Ge.depth:b.isData3DTexture?It=Math.floor(Ge.depth*On):It=1,zt=0,Vt=0,Ut=0}$!==null?(ne=$.x,Me=$.y,ze=$.z):(ne=0,Me=0,ze=0);const Ae=lt.convert(H.format),Ht=lt.convert(H.type);let Se;H.isData3DTexture?(U.setTexture3D(H,0),Se=F.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(U.setTexture2DArray(H,0),Se=F.TEXTURE_2D_ARRAY):(U.setTexture2D(H,0),Se=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,H.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,H.unpackAlignment);const ue=F.getParameter(F.UNPACK_ROW_LENGTH),En=F.getParameter(F.UNPACK_IMAGE_HEIGHT),vs=F.getParameter(F.UNPACK_SKIP_PIXELS),bn=F.getParameter(F.UNPACK_SKIP_ROWS),$i=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,Ge.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Ge.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,zt),F.pixelStorei(F.UNPACK_SKIP_ROWS,Vt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Ut);const ye=b.isDataArrayTexture||b.isData3DTexture,an=H.isDataArrayTexture||H.isData3DTexture;if(b.isDepthTexture){const On=x.get(b),on=x.get(H),Tn=x.get(On.__renderTarget),ya=x.get(on.__renderTarget);Dt.bindFramebuffer(F.READ_FRAMEBUFFER,Tn.__webglFramebuffer),Dt.bindFramebuffer(F.DRAW_FRAMEBUFFER,ya.__webglFramebuffer);for(let Zi=0;Zi<It;Zi++)ye&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,x.get(b).__webglTexture,Y,Ut+Zi),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,x.get(H).__webglTexture,Mt,ze+Zi)),F.blitFramebuffer(zt,Vt,Ct,Et,ne,Me,Ct,Et,F.DEPTH_BUFFER_BIT,F.NEAREST);Dt.bindFramebuffer(F.READ_FRAMEBUFFER,null),Dt.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(Y!==0||b.isRenderTargetTexture||x.has(b)){const On=x.get(b),on=x.get(H);Dt.bindFramebuffer(F.READ_FRAMEBUFFER,Wn),Dt.bindFramebuffer(F.DRAW_FRAMEBUFFER,Vs);for(let Tn=0;Tn<It;Tn++)ye?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,On.__webglTexture,Y,Ut+Tn):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,On.__webglTexture,Y),an?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,on.__webglTexture,Mt,ze+Tn):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,on.__webglTexture,Mt),Y!==0?F.blitFramebuffer(zt,Vt,Ct,Et,ne,Me,Ct,Et,F.COLOR_BUFFER_BIT,F.NEAREST):an?F.copyTexSubImage3D(Se,Mt,ne,Me,ze+Tn,zt,Vt,Ct,Et):F.copyTexSubImage2D(Se,Mt,ne,Me,zt,Vt,Ct,Et);Dt.bindFramebuffer(F.READ_FRAMEBUFFER,null),Dt.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else an?b.isDataTexture||b.isData3DTexture?F.texSubImage3D(Se,Mt,ne,Me,ze,Ct,Et,It,Ae,Ht,Ge.data):H.isCompressedArrayTexture?F.compressedTexSubImage3D(Se,Mt,ne,Me,ze,Ct,Et,It,Ae,Ge.data):F.texSubImage3D(Se,Mt,ne,Me,ze,Ct,Et,It,Ae,Ht,Ge):b.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,Mt,ne,Me,Ct,Et,Ae,Ht,Ge.data):b.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,Mt,ne,Me,Ge.width,Ge.height,Ae,Ge.data):F.texSubImage2D(F.TEXTURE_2D,Mt,ne,Me,Ct,Et,Ae,Ht,Ge);F.pixelStorei(F.UNPACK_ROW_LENGTH,ue),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,En),F.pixelStorei(F.UNPACK_SKIP_PIXELS,vs),F.pixelStorei(F.UNPACK_SKIP_ROWS,bn),F.pixelStorei(F.UNPACK_SKIP_IMAGES,$i),Mt===0&&H.generateMipmaps&&F.generateMipmap(Se),Dt.unbindTexture()},this.initRenderTarget=function(b){x.get(b).__webglFramebuffer===void 0&&U.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?U.setTextureCube(b,0):b.isData3DTexture?U.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?U.setTexture2DArray(b,0):U.setTexture2D(b,0),Dt.unbindTexture()},this.resetState=function(){L=0,W=0,z=null,Dt.reset(),wt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ki}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=me._getDrawingBufferColorSpace(t),e.unpackColorSpace=me._getUnpackColorSpace()}}const td={type:"change"},_h={type:"start"},qp={type:"end"},qo=new mh,ed=new Ds,yS=Math.cos(70*Vg.DEG2RAD),ln=new X,Bn=2*Math.PI,Ue={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Tc=1e-6;class ES extends T0{constructor(t,e=null){super(t,e),this.state=Ue.NONE,this.target=new X,this.cursor=new X,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ea.ROTATE,MIDDLE:ea.DOLLY,RIGHT:ea.PAN},this.touches={ONE:ta.ROTATE,TWO:ta.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new X,this._lastQuaternion=new xr,this._lastTargetPosition=new X,this._quat=new xr().setFromUnitVectors(t.up,new X(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Cf,this._sphericalDelta=new Cf,this._scale=1,this._panOffset=new X,this._rotateStart=new Xt,this._rotateEnd=new Xt,this._rotateDelta=new Xt,this._panStart=new Xt,this._panEnd=new Xt,this._panDelta=new Xt,this._dollyStart=new Xt,this._dollyEnd=new Xt,this._dollyDelta=new Xt,this._dollyDirection=new X,this._mouse=new Xt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=TS.bind(this),this._onPointerDown=bS.bind(this),this._onPointerUp=AS.bind(this),this._onContextMenu=IS.bind(this),this._onMouseWheel=CS.bind(this),this._onKeyDown=PS.bind(this),this._onTouchStart=DS.bind(this),this._onTouchMove=LS.bind(this),this._onMouseDown=wS.bind(this),this._onMouseMove=RS.bind(this),this._interceptControlDown=US.bind(this),this._interceptControlUp=NS.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(td),this.update(),this.state=Ue.NONE}update(t=null){const e=this.object.position;ln.copy(e).sub(this.target),ln.applyQuaternion(this._quat),this._spherical.setFromVector3(ln),this.autoRotate&&this.state===Ue.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Bn:n>Math.PI&&(n-=Bn),s<-Math.PI?s+=Bn:s>Math.PI&&(s-=Bn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(ln.setFromSpherical(this._spherical),ln.applyQuaternion(this._quatInverse),e.copy(this.target).add(ln),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=ln.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new X(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new X(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=ln.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(qo.origin.copy(this.object.position),qo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(qo.direction))<yS?this.object.lookAt(this.target):(ed.setFromNormalAndCoplanarPoint(this.object.up,this.target),qo.intersectPlane(ed,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Tc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Tc||this._lastTargetPosition.distanceToSquared(this.target)>Tc?(this.dispatchEvent(td),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Bn/60*this.autoRotateSpeed*t:Bn/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){ln.setFromMatrixColumn(e,0),ln.multiplyScalar(-t),this._panOffset.add(ln)}_panUp(t,e){this.screenSpacePanning===!0?ln.setFromMatrixColumn(e,1):(ln.setFromMatrixColumn(e,0),ln.crossVectors(this.object.up,ln)),ln.multiplyScalar(t),this._panOffset.add(ln)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;ln.copy(s).sub(this.target);let r=ln.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Bn*this._rotateDelta.x/e.clientHeight),this._rotateUp(Bn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Bn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Bn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Bn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Bn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Bn*this._rotateDelta.x/e.clientHeight),this._rotateUp(Bn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Xt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function bS(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function TS(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function AS(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(qp),this.state=Ue.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function wS(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case ea.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Ue.DOLLY;break;case ea.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Ue.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Ue.ROTATE}break;case ea.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Ue.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Ue.PAN}break;default:this.state=Ue.NONE}this.state!==Ue.NONE&&this.dispatchEvent(_h)}function RS(i){switch(this.state){case Ue.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Ue.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Ue.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function CS(i){this.enabled===!1||this.enableZoom===!1||this.state!==Ue.NONE||(i.preventDefault(),this.dispatchEvent(_h),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(qp))}function PS(i){this.enabled!==!1&&this._handleKeyDown(i)}function DS(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case ta.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Ue.TOUCH_ROTATE;break;case ta.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Ue.TOUCH_PAN;break;default:this.state=Ue.NONE}break;case 2:switch(this.touches.TWO){case ta.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Ue.TOUCH_DOLLY_PAN;break;case ta.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Ue.TOUCH_DOLLY_ROTATE;break;default:this.state=Ue.NONE}break;default:this.state=Ue.NONE}this.state!==Ue.NONE&&this.dispatchEvent(_h)}function LS(i){switch(this._trackPointer(i),this.state){case Ue.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Ue.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Ue.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Ue.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Ue.NONE}}function IS(i){this.enabled!==!1&&i.preventDefault()}function US(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function NS(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const xh=["VELX","VELY","ROT","EATN","SIZE","ECHG","MR","MG","MB","MS","E1R","E1G","E1B","E1S","E2R","E2G","E2B","E2S","E3R","E3G","E3B","E3S","E4R","E4G","E4B","E4S","E5R","E5G","E5B","E5S","B+","B-","NRG%"],dl=["VELX","VELY","ROT","EATR","EATG","EATB","REPR","MUT","MX","MY","E1X","E1Y","E2X","E2Y","E3X","E3Y","E4X","E4Y","E5X","E5Y"];let fa=null,Wi=null,ui=null,ar=null,Zn=null,nd=null;const pl=[],ml=[],Nu=[],Fu=[],ro=[],pr=[],ls=[],id=new b0,Ac=new Xt;let Ei=null;const Oi=2,FS=.08,sd=.1;let as=null;function rd(i){const t=document.createElement("canvas"),e=t.getContext("2d");if(!e){const l=new io({color:16777215});return new fl(l)}t.width=128,t.height=64,e.clearRect(0,0,t.width,t.height),e.fillStyle="rgba(0, 0, 0, 0.6)";const n=4;OS(e,n,n,t.width-n*2,t.height-n*2,8),e.fill(),e.font="bold 20px monospace",e.textAlign="center",e.textBaseline="middle",e.fillStyle="#ffffff",e.fillText(i,t.width/2,t.height/2);const r=new zp(t);r.minFilter=sn,r.magFilter=sn;const a=new io({map:r,transparent:!0,depthTest:!1}),o=new fl(a);return o.scale.set(.5,.25,1),o.userData.canvas=t,o.userData.ctx=e,o}function ad(i,t,e){if(!i||!i.userData)return;const n=i.userData.canvas,s=i.userData.ctx;if(!n||!s)return;s.clearRect(0,0,n.width,n.height),s.font="bold 16px monospace",s.textAlign="center",s.textBaseline="middle",s.fillStyle="#000000",s.fillText(t,n.width/2,n.height/2-12),s.font="14px monospace",s.fillText(e.toFixed(2),n.width/2,n.height/2+12);const r=i.material;r.map&&(r.map.needsUpdate=!0)}function od(i){const t=document.createElement("canvas"),e=t.getContext("2d");if(!e){const a=new io({color:16777215});return new fl(a)}t.width=256,t.height=64,e.clearRect(0,0,t.width,t.height),e.font="bold 32px monospace",e.textAlign="center",e.textBaseline="middle",e.fillStyle="#00000020",e.fillText(i,t.width/2,t.height/2);const n=new zp(t);n.minFilter=sn,n.magFilter=sn;const s=new io({map:n,transparent:!0,depthTest:!1}),r=new fl(s);return r.scale.set(1.2,.3,1),r}function OS(i,t,e,n,s,r){i.beginPath(),i.moveTo(t+r,e),i.lineTo(t+n-r,e),i.quadraticCurveTo(t+n,e,t+n,e+r),i.lineTo(t+n,e+s-r),i.quadraticCurveTo(t+n,e+s,t+n-r,e+s),i.lineTo(t+r,e+s),i.quadraticCurveTo(t,e+s,t,e+s-r),i.lineTo(t,e+r),i.quadraticCurveTo(t,e,t+r,e),i.closePath()}function BS(i){Ei=i,fa=new d0;const t=Ei.clientWidth/Ei.clientHeight;Wi=new ci(50,t,.1,100),Wi.position.set(0,0,6),ui=new SS({antialias:!1,alpha:!0,precision:"lowp"}),ui.setSize(Ei.clientWidth,Ei.clientHeight),ui.setPixelRatio(Math.min(window.devicePixelRatio,2)),Ei.appendChild(ui.domElement),ar=new ES(Wi,ui.domElement),ar.enableDamping=!0,ar.dampingFactor=.05,ar.minDistance=3,ar.maxDistance=15,Zn=new Wa,fa.add(Zn);const e=new bl(Oi,16,12),n=new ua({color:13421772,transparent:!0,opacity:.1,wireframe:!0}),s=new Qn(e,n);Zn.add(s),zS(),GS(),ui.domElement.addEventListener("click",VS),jp()}function zS(){ro.length=0,pr.length=0;const i=Math.ceil(Math.sqrt(Rn)),t=Math.ceil(Rn/i);for(let s=0;s<Rn;s++){const r=Math.floor(s/t),a=s%t,o=Math.PI/4+r/i*(Math.PI/2),l=Math.PI+a/t*(Math.PI/2)-Math.PI/4,c=Oi*Math.sin(o)*Math.cos(l),h=Oi*Math.cos(o),u=Oi*Math.sin(o)*Math.sin(l);ro.push(new X(c,h,u))}const e=Math.ceil(Math.sqrt(oe)),n=Math.ceil(oe/e);for(let s=0;s<oe;s++){const r=Math.floor(s/n),a=s%n,o=Math.PI/4+r/e*(Math.PI*2/3),l=a/n*Math.PI-Math.PI/2,c=Oi*Math.sin(o)*Math.cos(l),h=Oi*Math.cos(o),u=Oi*Math.sin(o)*Math.sin(l);pr.push(new X(c,h,u))}}function GS(){if(!Zn)return;const i=new bl(FS,6,4);for(let s=0;s<Rn;s++){const r=new ua({color:65280,transparent:!0}),a=new Qn(i,r);a.position.copy(ro[s]),a.userData={type:"input",index:s},Zn.add(a),pl.push(a);const o=xh[s]||`I${s}`,l=rd(o),c=ro[s].clone(),h=c.clone().normalize().multiplyScalar(sd);l.position.copy(c).add(h),Zn.add(l),Nu.push(l)}for(let s=0;s<oe;s++){const r=new ua({color:255,transparent:!0}),a=new Qn(i,r);a.position.copy(pr[s]),a.userData={type:"output",index:s},Zn.add(a),ml.push(a);const o=dl[s]||`O${s}`,l=rd(o),c=pr[s].clone(),h=c.clone().normalize().multiplyScalar(sd);l.position.copy(c).add(h),Zn.add(l),Fu.push(l)}const t=Oi+.25,e=od("INPUTS");e.position.set(-t,Oi,0),Zn.add(e);const n=od("OUTPUTS");n.position.set(t,Oi,0),Zn.add(n)}const wl=Rn*oe+oe*(oe-1),ld=.02,We=new Float32Array(wl*4*3),ss=new Float32Array(wl*4*4),tr=new Uint16Array(wl*6);for(let i=0;i<wl;i++){const t=i*4,e=i*6;tr[e]=t,tr[e+1]=t+1,tr[e+2]=t+2,tr[e+3]=t+2,tr[e+4]=t+1,tr[e+5]=t+3}const Zr=new X,_e=new X,cd=new X(0,1,0),ud=new X(1,0,0);let rs=null,hd=null;function kS(i){if(!Zn)return;rs||(rs=new pi,rs.setAttribute("position",new Vn(We,3)),rs.setAttribute("color",new Vn(ss,4)),rs.setIndex(new Vn(tr,1)),hd=new ua({vertexColors:!0,transparent:!0,side:Bi,depthWrite:!1}),nd=new Qn(rs,hd),Zn.add(nd));let t=0;for(let e=0;e<Rn;e++){const n=i.inputs[e];for(let s=0;s<oe;s++){const r=n.in>0?n.weights1[s]:n.weights2[s];if(Math.abs(r)<.05)continue;const a=ro[e],o=pr[s];Zr.subVectors(o,a).normalize(),_e.crossVectors(Zr,cd),_e.lengthSq()<.001&&_e.crossVectors(Zr,ud),_e.normalize();const l=Math.abs(r)*ld/2,c=t*12;We[c]=a.x+_e.x*l,We[c+1]=a.y+_e.y*l,We[c+2]=a.z+_e.z*l,We[c+3]=a.x-_e.x*l,We[c+4]=a.y-_e.y*l,We[c+5]=a.z-_e.z*l,We[c+6]=o.x+_e.x*l,We[c+7]=o.y+_e.y*l,We[c+8]=o.z+_e.z*l,We[c+9]=o.x-_e.x*l,We[c+10]=o.y-_e.y*l,We[c+11]=o.z-_e.z*l;const h=Math.min(Math.abs(r),1),u=r<0?1:0,f=r>0?h:0,m=0,v=h,M=t*16;for(let p=0;p<4;p++)ss[M+p*4]=u,ss[M+p*4+1]=f,ss[M+p*4+2]=m,ss[M+p*4+3]=v;t++}}for(let e=0;e<oe;e++){const n=i.outputs[e];for(let s=0;s<oe;s++){if(e===s)continue;const r=n.in>0?n.weights1[s]:n.weights2[s];if(Math.abs(r)<.05)continue;const a=pr[e],o=pr[s];Zr.subVectors(o,a).normalize(),_e.crossVectors(Zr,cd),_e.lengthSq()<.001&&_e.crossVectors(Zr,ud),_e.normalize();const l=Math.abs(r)*ld/2,c=t*12;We[c]=a.x+_e.x*l,We[c+1]=a.y+_e.y*l,We[c+2]=a.z+_e.z*l,We[c+3]=a.x-_e.x*l,We[c+4]=a.y-_e.y*l,We[c+5]=a.z-_e.z*l,We[c+6]=o.x+_e.x*l,We[c+7]=o.y+_e.y*l,We[c+8]=o.z+_e.z*l,We[c+9]=o.x-_e.x*l,We[c+10]=o.y-_e.y*l,We[c+11]=o.z-_e.z*l;const h=Math.min(Math.abs(r),1),u=r<0?1:0,f=0,m=r>0?h:0,v=h,M=t*16;for(let p=0;p<4;p++)ss[M+p*4]=u,ss[M+p*4+1]=f,ss[M+p*4+2]=m,ss[M+p*4+3]=v;t++}}rs.setDrawRange(0,t*6),rs.attributes.position.needsUpdate=!0,rs.attributes.color.needsUpdate=!0}function HS(i){for(let t=0;t<Rn;t++){const e=i.inputs[t].in,s=pl[t].material,r=Math.min(Math.abs(e),1),a=e>=0?.3333:0;s.color.setHSL(a,1,.5),s.transparent=!0,s.opacity=r;const o=xh[t]||`I${t}`;Nu[t]&&ad(Nu[t],o,e)}for(let t=0;t<oe;t++){const e=i.outputs[t].out,s=ml[t].material,r=Math.min(Math.abs(e),1),a=e>=0?.6666:0;s.color.setHSL(a,1,.5),s.transparent=!0,s.opacity=r;const o=dl[t]||`O${t}`;Fu[t]&&ad(Fu[t],o,e)}}function VS(i){if(!Wi||!ui||!fa)return;const t=ui.domElement.getBoundingClientRect();Ac.x=(i.clientX-t.left)/t.width*2-1,Ac.y=-((i.clientY-t.top)/t.height)*2+1,id.setFromCamera(Ac,Wi);const e=[...pl,...ml],n=id.intersectObjects(e);if(n.length>0){const s=n[0].object,{type:r,index:a}=s.userData,o=ls.findIndex(l=>l.type===r&&l.index===a);o>=0?(ls.splice(o,1),s.material.color.setHex(r==="input"?4500036:4474026)):(ls.push({type:r,index:a}),s.material.color.setHex(16776960)),Ou()}else{for(const s of ls){const r=s.type==="input"?pl[s.index]:ml[s.index];r&&r.material.color.setHex(s.type==="input"?4500036:4474026)}ls.length=0,Ou()}}function Ou(){if(!as)return;const i=document.getElementById("brain3d-weights");if(!i)return;if(ls.length===0){i.style.display="none";return}if(i.style.display="block",as.parent===null){i.innerHTML="No parent — no delta data";return}if(!(as.parent>=0?_.amoebs[as.parent]:_.graveyard[-(as.parent+1)])){i.innerHTML="Parent not found";return}const{advantageous:e,disadvantageous:n}=lp(as.parent),s=e.length,r=n.length;let a="";for(const o of ls){const l=o.type==="input"?as.inputs[o.index]:as.outputs[o.index],c=o.type==="input"?xh[o.index]||`I${o.index}`:dl[o.index]||`O${o.index}`,h=oe,u=new Array(h).fill(0),f=new Array(h).fill(0),m=new Array(h).fill(0),v=new Array(h).fill(0);for(const M of e){const p=o.type==="input"?M.in_weights1_deltas[o.index]:M.out_weights1_deltas[o.index],d=o.type==="input"?M.in_weights2_deltas[o.index]:M.out_weights2_deltas[o.index];for(let y=0;y<h;y++)u[y]+=p[y],f[y]+=d[y]}if(s>0)for(let M=0;M<h;M++)u[M]/=s,f[M]/=s;for(const M of n){const p=o.type==="input"?M.in_weights1_deltas[o.index]:M.out_weights1_deltas[o.index],d=o.type==="input"?M.in_weights2_deltas[o.index]:M.out_weights2_deltas[o.index];for(let y=0;y<h;y++)m[y]+=p[y],v[y]+=d[y]}if(r>0)for(let M=0;M<h;M++)m[M]/=r,v[M]/=r;a+=`<b>${o.type.toUpperCase()} ${c}</b><br>`,a+='<table class="neuron-weights-table" style="width:100%; border-collapse:collapse; font-size:8px;">',a+=`<tr>
      <th>Target</th>
      <th>W1</th>
      <th style="color:green">Adv(${s})</th>
      <th style="color:red">Dis(${r})</th>
      <th>W1'</th>
      <th style="border-left:1px solid #ccc"></th>
      <th>W2</th>
      <th style="color:green">Adv(${s})</th>
      <th style="color:red">Dis(${r})</th>
      <th>W2'</th>
    </tr>`;for(let M=0;M<oe;M++){const p=dl[M]||`O${M}`,d=l.weights1[M],y=l.weights2[M],R=d+u[M]-m[M],A=y+f[M]-v[M];a+=`<tr>
        <td>${p}</td>
        <td>${d.toFixed(3)}</td>
        <td style="color:green">${u[M].toFixed(3)}</td>
        <td style="color:red">${m[M].toFixed(3)}</td>
        <td><b>${R.toFixed(3)}</b></td>
        <td style="border-left:1px solid #ccc"></td>
        <td>${y.toFixed(3)}</td>
        <td style="color:green">${f[M].toFixed(3)}</td>
        <td style="color:red">${v[M].toFixed(3)}</td>
        <td><b>${A.toFixed(3)}</b></td>
      </tr>`}a+="</table><br>"}i.innerHTML=a}function jp(){if(requestAnimationFrame(jp),!(Ei&&Ei.style.display==="none")&&(ar&&ar.update(),ui&&fa&&Wi))try{ui.render(fa,Wi)}catch{}}function WS(i){!fa||!Zn||(as=i,kS(i),HS(i),ls.length>0&&Ou())}function ao(){if(!Ei||!Wi||!ui)return;const i=Ei.clientWidth,e=Math.max(250,Math.min(i*1,600));Ei.style.height=e+"px";const n=e;Wi.aspect=i/n,Wi.updateProjectionMatrix(),ui.setSize(i,n)}function XS(){ls.length=0;const i=document.getElementById("brain3d-weights");i&&(i.style.display="none")}let Sn=null;const or=[];let fd=null,dd;function YS(){Sn=document.getElementById("family-tree")}function er(i){return i>=0?_.amoebs[i]||null:_.graveyard[-(i+1)]||null}function qS(i){return`${i.name}-${i.gen}${i.status==="alive"?"A":"D"}${i.descendants}`}let Ba=null;function pd(){return Ba||(Ba=document.createElement("div"),Ba.className="family-tooltip",document.body.appendChild(Ba)),Ba}function za(i,t){const e=document.createElement("div");return e.className="family-member",i.status!=="alive"&&(e.className+=" family-member-dead"),i.index===_.highlighted&&(e.className+=" family-member-self"),e.innerHTML=`<span class="family-label">${t}</span><span class="family-name">${qS(i)}</span>`,e.addEventListener("mouseenter",n=>{const s=er(_.highlighted);if(s&&i.index!==_.highlighted){const r=rg(s,i),a=pd();a.textContent=`${r.toFixed(1)}% alike`,a.style.display="block";const o=e.getBoundingClientRect();a.style.left=`${o.right+8}px`,a.style.top=`${o.top}px`}}),e.addEventListener("mouseleave",()=>{const n=pd();n.style.display="none"}),e.addEventListener("click",()=>{_.highlighted!==null&&_.highlighted!==i.index&&or.push(_.highlighted),_.highlighted=i.index,fo(!0)}),e}function wc(i){const t=document.createElement("div");t.className="family-section";const e=document.createElement("div");return e.className="family-section-header",e.textContent=i,t.appendChild(e),t}function fo(i=!1,t=void 0){if(Sn||(Sn=document.getElementById("family-tree")),!Sn)return;const e=_.highlighted!==fd;if(!i&&!e&&!(t!==dd))return;if(console.log("RERENDERING FAM TREE"),fd=_.highlighted,dd=t,_.highlighted===null){Sn.innerHTML='<div class="family-empty">No amoeba selected</div>';return}const s=er(_.highlighted);if(!s){Sn.innerHTML='<div class="family-empty">Amoeba not found</div>';return}Sn.innerHTML="";const r=document.createElement("div");r.className="family-nav";const a=document.createElement("button");a.className="family-back-btn",a.innerHTML="&larr; Back",a.disabled=or.length===0,a.addEventListener("click",()=>{or.length>0&&(_.highlighted=or.pop(),fo(!0))}),r.appendChild(a);const o=document.createElement("span");if(o.className="family-history-count",o.textContent=or.length>0?`(${or.length})`:"",r.appendChild(o),Sn.appendChild(r),s.parent!==null){const l=er(s.parent);if(l){const c=wc("Parent");c.appendChild(za(l,"")),Sn.appendChild(c);const h=[];for(const u of l.children)if(u!==s.index){const f=er(u);f&&h.push(f)}if(h.length>0){const u=wc(`Siblings (${h.length})`);for(const f of h){const m=document.createElement("div");if(m.className="family-sibling-row",m.appendChild(za(f,"")),f.children.length>0){const v=document.createElement("div");v.className="family-niblings";for(const M of f.children){const p=er(M);p&&v.appendChild(za(p,""))}m.appendChild(v)}u.appendChild(m)}Sn.appendChild(u)}}}if(s.children.length>0){const l=wc(`Children (${s.children.length})`);for(const c of s.children){const h=er(c);if(h){const u=document.createElement("div");if(u.className="family-child-row",u.appendChild(za(h,"")),h.children.length>0){const f=document.createElement("div");f.className="family-grandchildren";for(const m of h.children){const v=er(m);v&&f.appendChild(za(v,""))}u.appendChild(f)}l.appendChild(u)}}Sn.appendChild(l)}}function jS(){if(_.highlighted===null)return;const i=document.getElementById("brain"),t=document.getElementById("neuron-weights");Sn||(Sn=document.getElementById("family-tree")),_.display==="family"?(_.display="default",Sn&&(Sn.style.display="none"),or.length=0):(_.display="family",i&&(i.style.display="none"),t&&(t.style.display="none"),Sn&&(Sn.style.display="block"),fo(!0))}class po{index;grave;x;y;status="alive";tile=null;size=Ii;gen=0;born=0;age=0;parent=null;sibling_idx=null;children=[];descendants=0;proGenes=0;conGenes=0;name;velocityX=0;velocityY=0;rotation=0;direction;eyes;mouth;redEaten=.003;greenEaten=.003;blueEaten=.003;currEaten=0;netEaten=.01;inputs;outputs;energy;maxEnergy;energyChange=0;totalEnergyGain=0;totalEnergyCost=0;currDamage=0;damageReceived=0;damageCaused=0;cols=new Uint8ClampedArray(9);lr=0;brain=[];constructor(t,e,n){this.index=n,this.x=t,this.y=e,this.name=ng(Ra),this.direction=fe(Math.random()*360),this.born=_.stats.time,this.eyes=new Array(5);for(let s=0;s<5;s++)this.eyes[s]=new Oc(this.x,this.y);this.mouth=new Bc(this.x,this.y),this.inputs=new Array(Rn),this.outputs=new Array(oe);for(let s=0;s<Rn;s++)this.inputs[s]=new Zo,s===30||s===31?this.inputs[s].init(oe,0):this.inputs[s].init(oe,8);for(let s=0;s<oe;s++)this.outputs[s]=new Zo,this.outputs[s].init(oe,0);this.energy=Ii*1e3,this.maxEnergy=this.energy}move(){this.velocityX=this.velocityX/2+this.outputs[0].out/(1+this.currDamage),this.velocityY=this.velocityY/2+this.outputs[1].out/(1+this.currDamage),this.rotation=this.rotation/2+this.outputs[2].out*8/(1+this.currDamage),this.direction+=this.rotation,this.direction<0?this.direction+=360:this.direction>359&&(this.direction-=360);const t=this.direction*Ps;this.x+=this.velocityX*Math.cos(t)+this.velocityY*Math.sin(t),this.y+=this.velocityX*Math.sin(t)-this.velocityY*Math.cos(t),(this.x<0||this.x>=ps)&&(this.x=this.x<0?0:ps-1,this.velocityX=0,this.velocityY=0),(this.y<0||this.y>=ms)&&(this.y=this.y<0?0:ms-1,this.velocityX=0,this.velocityY=0);let e=~~(this.y/Gn)*zn+~~(this.x/Gn);e>=zn*Ml?this.tile=ag-1:e<0&&(this.tile=0),this.tile=e,this.mouth.move(this.direction,this.x,this.y,this.outputs[8].out*Qh,this.outputs[9].out*Qh);for(let n=0;n<5;n++)this.eyes[n].move(this.direction,this.x,this.y,this.outputs[n*2+10].out*Jh,this.outputs[n*2+11].out*Jh)}sense(){const t=this.size,e=this.mouth,n=this.eyes;e.sense();for(let s=0;s<5;s++)n[s].sense();for(let s=0;s<=_.HIGHESTINDEX;s++){const r=_.amoebs[s];if(r.status!=="dead"&&s!==this.index){const a=r.size/2+t/4,o=r.status==="decaying"?-1:1;e.detected===-1&&Math.abs(e.x-r.x)<=a&&Math.abs(e.y-r.y)<=a&&(e.s=o*(r.size-Ii)/(qs-Ii),e.r=r.outputs[3].out,e.g=r.outputs[4].out,e.b=r.outputs[5].out,e.detected=s);for(let l=0;l<5;l++)n[l].detected===-1&&Math.abs(n[l].x-r.x)<=a&&Math.abs(n[l].y-r.y)<=a&&(n[l].s=o*(r.size-Ii)/(qs-Ii),n[l].r=r.outputs[3].out,n[l].g=r.outputs[4].out,n[l].b=r.outputs[5].out,n[l].detected=s)}}}eat(){const t=this.size;this.currEaten=0;let e=0,n=0,s=0;if(this.mouth.detected!==-1){const r=_.amoebs[this.mouth.detected];if(r.status==="alive"){const a=t/r.size;e=this.outputs[3].out>0?0:(1-Math.abs(-this.outputs[3].out-Math.abs(r.outputs[3].out)))*a,n=this.outputs[4].out>0?0:(1-Math.abs(-this.outputs[4].out-Math.abs(r.outputs[4].out)))*a,s=this.outputs[5].out>0?0:(1-Math.abs(-this.outputs[5].out-Math.abs(r.outputs[5].out)))*a,this.redEaten+=e,this.greenEaten+=n,this.blueEaten+=s,this.currEaten=e+n+s,this.netEaten+=this.currEaten,r.currDamage+=this.currEaten,r.damageReceived+=this.currEaten,this.damageCaused+=this.currEaten}else if(r.status==="decaying"){e=this.outputs[3].out>0?0:(1-Math.abs(-this.outputs[3].out-Math.abs(r.outputs[3].out)))*t,n=this.outputs[4].out>0?0:(1-Math.abs(-this.outputs[4].out-Math.abs(r.outputs[4].out)))*t,s=this.outputs[5].out>0?0:(1-Math.abs(-this.outputs[5].out-Math.abs(r.outputs[5].out)))*t;const a=e+n+s,o=Math.min(a,r.size*tf),l=a>0?o/a:0;e*=l,n*=l,s*=l,r.size-=o/tf,r.size=Math.max(r.size,0),this.redEaten+=e,this.greenEaten+=n,this.blueEaten+=s,this.currEaten=e+n+s,this.netEaten+=this.currEaten}}else if(this.mouth.tile!==null){const r=this.mouth.tile,a=_.tiles[r];e=this.outputs[3].out<0?0:this.outputs[3].out*t,n=this.outputs[4].out<0?0:this.outputs[4].out*t,s=this.outputs[5].out<0?0:this.outputs[5].out*t,a.rDelta-=e/1.5,a.gDelta-=n,a.bDelta-=s/2,e=e*Math.sign(a.R),n=n*Math.sign(a.G),s=s*Math.sign(a.B),e>0&&(this.redEaten+=e),n>0&&(this.greenEaten+=n),s>0&&(this.blueEaten+=s),this.netEaten+=Math.abs(e)+Math.abs(n)+Math.abs(s),this.currEaten=e+n+s}else this.currEaten=-1}draw(t){const e=_.ctx.map;if(!e)return;t[0]=50+fe(Math.abs(this.outputs[3].out)*205),t[1]=50+fe(Math.abs(this.outputs[4].out)*205),t[2]=50+fe(Math.abs(this.outputs[5].out)*205),t[3]=t[0]+40,t[4]=t[1]+40,t[5]=t[2]+40,t[6]=t[0]+80,t[7]=t[1]+80,t[8]=t[2]+80;const n=this.size/4;e.fillStyle=`rgb(${t[6]},${t[7]},${t[8]})`;for(let s=0;s<5;s++)e.beginPath(),e.arc(this.eyes[s].x,this.eyes[s].y,n,0,yo),e.fill();e.fillStyle=`rgb(${t[0]},${t[1]},${t[2]})`,e.beginPath(),e.arc(this.x,this.y,this.size,0,yo),e.fill(),e.fillStyle=`rgb(${t[3]},${t[4]},${t[5]})`,e.beginPath(),e.arc(this.mouth.x,this.mouth.y,this.size/2,0,yo),e.fill(),_.mouse.overMap&&_.mouse.x>=this.x-50&&_.mouse.x<this.x+50&&_.mouse.y>=this.y-50&&_.mouse.y<this.y+50&&_.highlighted!==this.index&&(e.fillStyle="#FFFFFF",e.fillText(this.name+"-"+this.gen+(this.status==="alive"?"A":"D")+this.descendants,this.x+2*this.size,this.y-2*this.size+2))}metabolize(){const t=(1+this.size/10)*(Math.abs(this.outputs[0].out)+Math.abs(this.outputs[1].out)+Math.abs(this.outputs[2].out));if(this.energyChange=this.currEaten-this.currDamage-t,this.energy+=this.energyChange,this.totalEnergyCost+=t+this.currDamage,this.energyChange>0&&(this.totalEnergyGain+=this.energyChange),this.energy>this.maxEnergy&&(this.maxEnergy=this.energy),this.energy<=0){this.status="decaying",_.stats.livePop--;const e=this.clone();if(e.index=-(_.graveyard.length+1),this.grave=e.index,this.parent!==null){this.parent<0?_.graveyard[-(this.parent+1)].children[this.sibling_idx]=e.index:_.amoebs[this.parent].children[this.sibling_idx]=e.index;let n=this.parent;for(;n!==null;)n>=0?(_.amoebs[n].descendants--,n=_.amoebs[n].parent):(_.graveyard[-(n+1)].descendants--,n=_.graveyard[-(n+1)].parent)}for(let n=0;n<this.children.length;n++)this.children[n]<0?_.graveyard[-(this.children[n]+1)].parent=e.index:_.amoebs[this.children[n]].parent=e.index;_.highlighted===this.index&&(_.highlighted=e.index),_.newest===this.index&&(_.newest=e.index),_.graveyard.push(e),this.updateLiveInfoDisplay()}else this.age++}decay(){if(Math.random()*100<1){this.size=fe((this.size-tg)*10)/10;const t=_.tiles[this.tile];if(t){const e=t.neighbors,s=10/(e.length+1);t.R=Math.min(t.R+s,t.RCap),t.G=Math.min(t.G+s,t.GCap),t.B=Math.min(t.B+s,t.BCap);for(const r of e){const a=_.tiles[r];a.R=Math.min(a.R+s,a.RCap),a.G=Math.min(a.G+s,a.GCap),a.B=Math.min(a.B+s,a.BCap)}}this.updateLiveInfoDisplay(),this.size<=0&&this.cleanup()}}cleanup(){if(this.status="dead",this.index===_.HIGHESTINDEX){let t=this.index;for(;t>-1&&(_.amoebs[t]==null||_.amoebs[t].status==="dead");)t--;_.HIGHESTINDEX=t}}grow(){const t=fe(this.energy/100)/10;t>this.size&&(this.size=t),this.size>qs?this.size=qs:this.size<1&&(this.size=1);const e=(this.outputs[6].out+1)/2*9e3+1e3;if(this.energy>=e*2&&_.stats.livePop<Qa){let n=0;for(;_.amoebs[n]!=null&&_.amoebs[n].status!=="dead";)n++;n>_.HIGHESTINDEX&&(_.HIGHESTINDEX=n);const s=this.clone();s.mitosis(this),s.energy=e,this.energy-=e,s.size=Math.max(Ii,Math.min(qs,fe(s.energy/100)/10)),this.size=Math.max(Ii,Math.min(qs,fe(this.energy/100)/10)),this.descendants++,this.children.push(n),s.index=n,_.amoebs[n]=s,_.newest=n,_.stats.livePop++;let r=this.parent;for(;r!==null;)r>=0?(_.amoebs[r].descendants++,r=_.amoebs[r].parent):(_.graveyard[-(r+1)].descendants++,r=_.graveyard[-(r+1)].parent)}}think(){let t=0;this.inputs[t++].in=this.velocityX/2,this.inputs[t++].in=this.velocityY/2,this.inputs[t++].in=this.rotation/16,this.inputs[t++].in=this.currEaten/(this.size*3),this.inputs[t++].in=2*(this.size-Ii)/(qs-Ii)-1,this.inputs[t++].in=0,this.inputs[t++].in=this.mouth.r,this.inputs[t++].in=this.mouth.g,this.inputs[t++].in=this.mouth.b,this.inputs[t++].in=this.mouth.s;for(let n=0;n<5;n++)this.inputs[t++].in=this.eyes[n].r,this.inputs[t++].in=this.eyes[n].g,this.inputs[t++].in=this.eyes[n].b,this.inputs[t++].in=this.eyes[n].s;this.inputs[t++].in=1,this.inputs[t++].in=-1,this.inputs[t++].in=2*this.energy/this.maxEnergy-1;let e=0;for(let n=0;n<oe;n++){for(let s=0;s<Rn;s++){const r=this.inputs[s],a=r.in>0?r.weights1:r.weights2;e+=r.in*a[n]}for(let s=0;s<oe;s++){const r=this.outputs[s],a=r.out>0?r.weights1:r.weights2;e+=r.out*a[n]}this.outputs[n].in=Math.min(Math.max(e,-1),1),e=0}for(let n=0;n<oe;n++)this.outputs[n].out=this.outputs[n].in}mitosis(t){this.descendants=0,this.children=[],this.gen=t.gen+1,this.parent=t.index,this.sibling_idx=t.children.length,this.name=t.name,this.maxEnergy=t.energy,this.born=_.stats.time,this.age=0,this.redEaten=.003,this.greenEaten=.003,this.blueEaten=.003,this.netEaten=.01,this.currDamage=0,this.damageCaused=0,this.damageReceived=0,fe(Math.random()*2)===2&&(fe(Math.random()*2)===2?fe(Math.random()*2)===2?fe(Math.random()*2)===2?this.name=Ra.charAt(fe(Math.random()*25))+this.name.charAt(1)+this.name.charAt(2)+this.name.charAt(3):this.name=this.name.charAt(0)+Ra.charAt(fe(Math.random()*25))+this.name.charAt(2)+this.name.charAt(3):this.name=this.name.charAt(0)+this.name.charAt(1)+Ra.charAt(fe(Math.random()*25))+this.name.charAt(3):this.name=this.name.charAt(0)+this.name.charAt(1)+this.name.charAt(2)+Ra.charAt(fe(Math.random()*25))),_.stats.mitoses+=1;const e=1,n=1;_.stats.advWeight+=e,_.stats.disWeight+=n;const{advantageous:s,disadvantageous:r}=lp(this.parent),a=s.length;r.length;const o=nh/(a+1),l=Qm/(a+1);for(let c=0;c<Rn;c++)for(let h=0;h<oe;h++)this.inputs[c].weights1[h]+=o*(2*Math.random()-1)-l*this.inputs[c].weights1[h],this.inputs[c].weights2[h]+=o*(2*Math.random()-1)-l*this.inputs[c].weights2[h];for(let c=0;c<oe;c++)for(let h=0;h<oe;h++)this.outputs[c].weights1[h]+=o*(2*Math.random()-1)-l*this.outputs[c].weights1[h],this.outputs[c].weights2[h]+=o*(2*Math.random()-1)-l*this.outputs[c].weights2[h];for(let c=0;c<a;c++){const h=s[c];for(let u=0;u<Rn;u++)for(let f=0;f<oe;f++)this.inputs[u].weights1[f]+=h.in_weights1_deltas[u][f]/a,this.inputs[u].weights2[f]+=h.in_weights2_deltas[u][f]/a;for(let u=0;u<oe;u++)for(let f=0;f<oe;f++)this.outputs[u].weights1[f]+=h.out_weights1_deltas[u][f]/a,this.outputs[u].weights2[f]+=h.out_weights2_deltas[u][f]/a}this.updateLiveInfoDisplay()}kill(){this.status==="alive"&&(this.energy=-1)}reincarnate(){if(this.status!=="alive"&&_.stats.livePop<Qa){let t=0;for(;_.amoebs[t]!=null&&_.amoebs[t].status!=="dead";)t++;t>_.HIGHESTINDEX&&(_.HIGHESTINDEX=t);const e=this.clone();this.descendants++,this.children.push(t),_.amoebs[t]=e,_.newest=t,_.stats.livePop++;let n=this.parent;for(;n!==null;)n>=0?(_.amoebs[n].descendants++,n=_.amoebs[n].parent):(_.graveyard[-(n+1)].descendants++,n=_.graveyard[-(n+1)].parent);_.highlighted=e.index}}highlight(){const t=_.ctx.map;if(!t)return;this.status!=="alive"&&this.draw(this.cols);const e=this.size;t.beginPath(),t.fillStyle="#FFFFFF",t.strokeStyle="#FFFFFF",t.strokeRect(this.x-2*e,this.y-2*e,e*4,e*4);const n=this.direction*Ps;t.beginPath(),t.strokeStyle="#FF0000";const s=this.x+this.outputs[0].out*10*Math.cos(n),r=this.y+this.outputs[0].out*10*Math.sin(n);t.moveTo(this.x,this.y),t.lineTo(s,r),t.stroke(),t.beginPath(),t.strokeStyle="#0088FF";const a=this.x+this.outputs[1].out*10*Math.sin(n),o=this.y-this.outputs[1].out*10*Math.cos(n);t.moveTo(this.x,this.y),t.lineTo(a,o),t.stroke(),t.beginPath(),t.strokeStyle="#FFFFFF";let l,c;if(this.velocityX>0?(l=s-this.outputs[2].out*10*Math.cos((this.direction-90)*Ps),c=r-this.outputs[2].out*10*Math.sin((this.direction-90)*Ps)):(l=s+this.outputs[2].out*10*Math.cos((this.direction-90)*Ps),c=r+this.outputs[2].out*10*Math.sin((this.direction-90)*Ps)),t.moveTo(s,r),t.lineTo(l,c),t.stroke(),t.lineWidth=.25,t.strokeStyle="#FFFFFF",_.mouse.overMap&&_.mouse.x>=this.x-50&&_.mouse.x<this.x+50&&_.mouse.y>=this.y-50&&_.mouse.y<this.y+50)for(let f=0;f<5;f++)t.beginPath(),t.arc(this.eyes[f].x,this.eyes[f].y,this.size/4,0,yo),t.stroke();t.lineWidth=1;const h=this.x+2*e;let u=this.y-2*e;this.status==="alive"&&t.fillText(this.name+"-"+this.gen+"A"+this.descendants,h,u+2),u+=10,this.updateMainStatsDisplay(),_.display==="default"||(_.display==="brain"?this.drawBrainDisplay():_.display==="family"&&fo(!1,this.descendants))}updateMainStatsDisplay(){const t=document.getElementById("stats-name");t&&(t.innerHTML=this.name+"-"+this.gen+(this.status==="alive"?"A":"D")+this.descendants);const e=document.getElementById("stats-idx");e&&(e.innerHTML="IDX "+this.index);const n=document.getElementById("stats-sibling-idx");n&&this.sibling_idx!==null&&(n.innerHTML="SIBLING: "+this.sibling_idx);const s=document.getElementById("stats-age");s&&(s.innerHTML="BORN/AGE: <b>"+this.born+"/"+this.age+"</b>");const r=fe(5*this.energyChange/(this.size*10+5));let a="";if(r>0)for(let f=0;f<r;f++)a+="+";else for(let f=0;f<-r;f++)a+="-";const o=document.getElementById("stats-energy");o&&(o.innerHTML="NRG: "+fe(this.energy)+"/"+fe(this.maxEnergy)+"   "+a);const l=document.getElementById("stats-size");l&&(l.innerHTML="SIZE: "+this.size);const c=document.getElementById("stats-brain-weight");c&&(c.innerHTML="BRAIN: "+sg(this).toFixed(1));const h=document.getElementById("stats-damage");h&&(h.innerHTML=fe(this.damageReceived)+" >> DMG >> "+fe(this.damageCaused));const u=document.getElementById("stats-sensors");u&&(u.innerHTML=(this.mouth.detected===1?"M ":"")+(this.eyes[0].detected===1?"E1 ":"")+(this.eyes[1].detected===1?"E2 ":"")+(this.eyes[2].detected===1?"E3 ":"")+(this.eyes[3].detected===1?"E4 ":"")+(this.eyes[4].detected===1?"E5 ":"")),this.positiveGauge("stats-energy","ϟ&nbsp;",this.energy,this.maxEnergy),this.signedGauge("stats-red","R&nbsp;",this.outputs[3].out),this.signedGauge("stats-green","G&nbsp;",this.outputs[4].out),this.signedGauge("stats-blue","B&nbsp;",this.outputs[5].out),this.signedGauge("stats-velocity","∆X",this.outputs[0].out),this.signedGauge("stats-rotation","∆Y",this.outputs[1].out),this.signedGauge("stats-mutation","∆°",this.outputs[2].out)}signedGauge(t,e,n){const s="█",r="&nbsp;",a=n>0?"&nbsp;":"",o=Math.max(-1,Math.min(1,n)),l=Math.round(Math.abs(o)*10);let c=r.repeat(10),h=r.repeat(10);o<0?c=r.repeat(10-l)+s.repeat(l):h=s.repeat(l)+r.repeat(10-l);const u=c+" "+a+n.toFixed(2)+" "+h,f=document.getElementById(t);f&&(f.innerHTML=`${e} ${u}`)}positiveGauge(t,e,n,s){const r="█",a="&nbsp;",o=Math.max(0,Math.min(1,n/s)),l=Math.round(o*20),c=r.repeat(l)+a.repeat(20-l),h=`${fe(n)}/${fe(s)}`,u=document.getElementById(t);u&&(u.innerHTML=`${e} ${c} ${h}`)}drawBrainDisplay(){WS(this)}clone(){const t=new po(this.x,this.y,this.index);for(const s of Object.keys(this)){const r=this[s];r instanceof Float32Array?t[s]=new Float32Array(r):r instanceof Uint8ClampedArray?t[s]=new Uint8ClampedArray(r):Array.isArray(r)?t[s]=[...r]:(typeof r!="object"||r===null)&&(t[s]=r)}t.eyes=this.eyes.map(s=>{const r=new Oc(s.x,s.y);return r.tile=s.tile,r.r=s.r,r.g=s.g,r.b=s.b,r.s=s.s,r.detected=s.detected,r});const e=new Bc(this.mouth.x,this.mouth.y);e.tile=this.mouth.tile,e.r=this.mouth.r,e.g=this.mouth.g,e.b=this.mouth.b,e.s=this.mouth.s,e.detected=this.mouth.detected,t.mouth=e;const n=s=>{const r=new Zo;return r.weights1=new Float32Array(s.weights1),r.weights2=new Float32Array(s.weights2),r.in=s.in,r.out=s.out,r};return t.inputs=this.inputs.map(n),t.outputs=this.outputs.map(n),t.brain=[...t.inputs,...t.outputs],t}updateLiveInfoDisplay(){const t=document.getElementById("dash-live-info");t&&(t.innerHTML="LIVE: "+_.stats.livePop+"     DEAD: "+_.graveyard.length)}}let Bu=null,zu=null,Gu=null,Ya=null,qa=null;function KS(){Bu=document.getElementById("dash-gold"),zu=document.getElementById("dash-silver"),Gu=document.getElementById("dash-bronze"),Ya=document.getElementById("amoeba-stats"),qa=document.getElementById("dash-highlighted")}const $S={update(){const i=_.amoebs,t=_.HIGHESTINDEX;if(!_.pause){_.gold=null,_.silver=null,_.bronze=null;for(let e=0;e<=t;e++){const n=i[e];n.status==="alive"?(n.metabolize(),n.status==="alive"&&(n.move(),n.currDamage=0,n.sense(),_.gold===null||n.descendants>i[_.gold].descendants?_.gold=e:_.silver===null||n.descendants>i[_.silver].descendants?_.silver=e:(_.bronze===null||n.descendants>i[_.bronze].descendants)&&(_.bronze=e))):n.status==="decaying"&&n.decay()}if(_.gold!==null&&Bu){const e=i[_.gold];Bu.innerHTML=e.name+"-"+e.gen+"A"+e.descendants}if(_.silver!==null&&zu){const e=i[_.silver];zu.innerHTML=e.name+"-"+e.gen+"A"+e.descendants}if(_.bronze!==null&&Gu){const e=i[_.bronze];Gu.innerHTML=e.name+"-"+e.gen+"A"+e.descendants}}for(let e=0;e<=t;e++){const n=i[e];if(n.status!=="dead"&&(n.draw(n.cols),n.status==="alive"&&!_.pause&&(n.think(),n.eat(),n.grow()),_.mouse.leftPressed&&_.mouse.overMap)){const s=_.mouse.x,r=_.mouse.y;if(Math.abs(n.x-s)<=n.size+1&&Math.abs(n.y-r)<=n.size+1&&_.highlighted!==e){if(n.status==="decaying"&&n.grave){console.log("A GRAVE: ",n.grave),_.highlighted=n.grave,_.tracking=null,Ya&&(Ya.style.display="block"),qa&&(qa.innerHTML="HIGHLIGHTED: "+_.graveyard[-(_.highlighted+1)].name+"-"+_.graveyard[-(_.highlighted+1)].gen+"D"+_.graveyard[-(_.highlighted+1)].descendants),_.mouse.leftPressed=!1;return}else _.highlighted=e;_.tracking!==null&&(_.tracking=e),Ya&&(Ya.style.display="block"),qa&&(qa.innerHTML="HIGHLIGHTED: "+i[_.highlighted].name+"-"+i[_.highlighted].gen+"A"+i[_.highlighted].descendants),_.mouse.leftPressed=!1}}}if(_.mouse.leftPressed&&_.mouse.overMap&&_.tracking!==null&&(_.tracking=null,_.mouse.leftPressed=!1),!_.pause)for(let e=0;e<dr;e++){const n=_.tiles[e];n.R=Math.max(n.R+n.rDelta,-n.RCap),n.G=Math.max(n.G+n.gDelta,-n.GCap),n.B=Math.max(n.B+n.bDelta,-n.BCap),n.rDelta=0,n.gDelta=0,n.bDelta=0}}},ZS=!0,dn="u-",JS="uplot",QS=dn+"hz",ty=dn+"vt",ey=dn+"title",ny=dn+"wrap",iy=dn+"under",sy=dn+"over",ry=dn+"axis",lr=dn+"off",ay=dn+"select",oy=dn+"cursor-x",ly=dn+"cursor-y",cy=dn+"cursor-pt",uy=dn+"legend",hy=dn+"live",fy=dn+"inline",dy=dn+"series",py=dn+"marker",md=dn+"label",my=dn+"value",ja="width",Ka="height",Ga="top",gd="bottom",Jr="left",Rc="right",vh="#000",_d=vh+"0",Cc="mousemove",xd="mousedown",Pc="mouseup",vd="mouseenter",Md="mouseleave",Sd="dblclick",gy="resize",_y="scroll",yd="change",gl="dppxchange",Mh="--",xa=typeof window<"u",ku=xa?document:null,sa=xa?window:null,xy=xa?navigator:null;let be,jo;function Hu(){let i=devicePixelRatio;be!=i&&(be=i,jo&&Wu(yd,jo,Hu),jo=matchMedia(`(min-resolution: ${be-.001}dppx) and (max-resolution: ${be+.001}dppx)`),mr(yd,jo,Hu),sa.dispatchEvent(new CustomEvent(gl)))}function $n(i,t){if(t!=null){let e=i.classList;!e.contains(t)&&e.add(t)}}function Vu(i,t){let e=i.classList;e.contains(t)&&e.remove(t)}function Xe(i,t,e){i.style[t]=e+"px"}function Si(i,t,e,n){let s=ku.createElement(i);return t!=null&&$n(s,t),e?.insertBefore(s,n),s}function ai(i,t){return Si("div",i,t)}const Ed=new WeakMap;function Ni(i,t,e,n,s){let r="translate("+t+"px,"+e+"px)",a=Ed.get(i);r!=a&&(i.style.transform=r,Ed.set(i,r),t<0||e<0||t>n||e>s?$n(i,lr):Vu(i,lr))}const bd=new WeakMap;function Td(i,t,e){let n=t+e,s=bd.get(i);n!=s&&(bd.set(i,n),i.style.background=t,i.style.borderColor=e)}const Ad=new WeakMap;function wd(i,t,e,n){let s=t+""+e,r=Ad.get(i);s!=r&&(Ad.set(i,s),i.style.height=e+"px",i.style.width=t+"px",i.style.marginLeft=n?-t/2+"px":0,i.style.marginTop=n?-e/2+"px":0)}const Sh={passive:!0},vy={...Sh,capture:!0};function mr(i,t,e,n){t.addEventListener(i,e,n?vy:Sh)}function Wu(i,t,e,n){t.removeEventListener(i,e,Sh)}xa&&Hu();function yi(i,t,e,n){let s;e=e||0,n=n||t.length-1;let r=n<=2147483647;for(;n-e>1;)s=r?e+n>>1:Jn((e+n)/2),t[s]<i?e=s:n=s;return i-t[e]<=t[n]-i?e:n}function Kp(i){return(e,n,s)=>{let r=-1,a=-1;for(let o=n;o<=s;o++)if(i(e[o])){r=o;break}for(let o=s;o>=n;o--)if(i(e[o])){a=o;break}return[r,a]}}const $p=i=>i!=null,Zp=i=>i!=null&&i>0,Rl=Kp($p),My=Kp(Zp);function Sy(i,t,e,n=0,s=!1){let r=s?My:Rl,a=s?Zp:$p;[t,e]=r(i,t,e);let o=i[t],l=i[t];if(t>-1)if(n==1)o=i[t],l=i[e];else if(n==-1)o=i[e],l=i[t];else for(let c=t;c<=e;c++){let h=i[c];a(h)&&(h<o?o=h:h>l&&(l=h))}return[o??Ne,l??-Ne]}function Cl(i,t,e,n){let s=Pd(i),r=Pd(t);i==t&&(s==-1?(i*=e,t/=e):(i/=e,t*=e));let a=e==10?fs:Jp,o=s==1?Jn:li,l=r==1?li:Jn,c=o(a(un(i))),h=l(a(un(t))),u=da(e,c),f=da(e,h);return e==10&&(c<0&&(u=Fe(u,-c)),h<0&&(f=Fe(f,-h))),n||e==2?(i=u*s,t=f*r):(i=nm(i,u),t=Pl(t,f)),[i,t]}function yh(i,t,e,n){let s=Cl(i,t,e,n);return i==0&&(s[0]=0),t==0&&(s[1]=0),s}const Eh=.1,Rd={mode:3,pad:Eh},Za={pad:0,soft:null,mode:0},yy={min:Za,max:Za};function _l(i,t,e,n){return Dl(e)?Cd(i,t,e):(Za.pad=e,Za.soft=n?0:null,Za.mode=n?3:0,Cd(i,t,yy))}function xe(i,t){return i??t}function Ey(i,t,e){for(t=xe(t,0),e=xe(e,i.length-1);t<=e;){if(i[t]!=null)return!0;t++}return!1}function Cd(i,t,e){let n=e.min,s=e.max,r=xe(n.pad,0),a=xe(s.pad,0),o=xe(n.hard,-Ne),l=xe(s.hard,Ne),c=xe(n.soft,Ne),h=xe(s.soft,-Ne),u=xe(n.mode,0),f=xe(s.mode,0),m=t-i,v=fs(m),M=Nn(un(i),un(t)),p=fs(M),d=un(p-v);(m<1e-24||d>10)&&(m=0,(i==0||t==0)&&(m=1e-24,u==2&&c!=Ne&&(r=0),f==2&&h!=-Ne&&(a=0)));let y=m||M||1e3,R=fs(y),A=da(10,Jn(R)),D=y*(m==0?i==0?.1:1:r),w=Fe(nm(i-D,A/10),24),N=i>=c&&(u==1||u==3&&w<=c||u==2&&w>=c)?c:Ne,k=Nn(o,w<N&&i>=N?N:bi(N,w)),E=y*(m==0?t==0?.1:1:a),T=Fe(Pl(t+E,A/10),24),L=t<=h&&(f==1||f==3&&T>=h||f==2&&T<=h)?h:-Ne,W=bi(l,T>L&&t<=L?L:Nn(L,T));return k==W&&k==0&&(W=100),[k,W]}const by=new Intl.NumberFormat(xa?xy.language:"en-US"),bh=i=>by.format(i),ti=Math,rl=ti.PI,un=ti.abs,Jn=ti.floor,cn=ti.round,li=ti.ceil,bi=ti.min,Nn=ti.max,da=ti.pow,Pd=ti.sign,fs=ti.log10,Jp=ti.log2,Ty=(i,t=1)=>ti.sinh(i)*t,Dc=(i,t=1)=>ti.asinh(i/t),Ne=1/0;function Dd(i){return(fs((i^i>>31)-(i>>31))|0)+1}function Xu(i,t,e){return bi(Nn(i,t),e)}function Qp(i){return typeof i=="function"}function ce(i){return Qp(i)?i:()=>i}const Ay=()=>{},tm=i=>i,em=(i,t)=>t,wy=i=>null,Ld=i=>!0,Id=(i,t)=>i==t,Ry=/\.\d*?(?=9{6,}|0{6,})/gm,vr=i=>{if(sm(i)||Os.has(i))return i;const t=`${i}`,e=t.match(Ry);if(e==null)return i;let n=e[0].length-1;if(t.indexOf("e-")!=-1){let[s,r]=t.split("e");return+`${vr(s)}e${r}`}return Fe(i,n)};function nr(i,t){return vr(Fe(vr(i/t))*t)}function Pl(i,t){return vr(li(vr(i/t))*t)}function nm(i,t){return vr(Jn(vr(i/t))*t)}function Fe(i,t=0){if(sm(i))return i;let e=10**t,n=i*e*(1+Number.EPSILON);return cn(n)/e}const Os=new Map;function im(i){return((""+i).split(".")[1]||"").length}function oo(i,t,e,n){let s=[],r=n.map(im);for(let a=t;a<e;a++){let o=un(a),l=Fe(da(i,a),o);for(let c=0;c<n.length;c++){let h=i==10?+`${n[c]}e${a}`:n[c]*l,u=(a>=0?0:o)+(a>=r[c]?0:r[c]),f=i==10?h:Fe(h,u);s.push(f),Os.set(f,u)}}return s}const Ja={},Th=[],pa=[null,null],Ls=Array.isArray,sm=Number.isInteger,Cy=i=>i===void 0;function Ud(i){return typeof i=="string"}function Dl(i){let t=!1;if(i!=null){let e=i.constructor;t=e==null||e==Object}return t}function Py(i){return i!=null&&typeof i=="object"}const Dy=Object.getPrototypeOf(Uint8Array),rm="__proto__";function ma(i,t=Dl){let e;if(Ls(i)){let n=i.find(s=>s!=null);if(Ls(n)||t(n)){e=Array(i.length);for(let s=0;s<i.length;s++)e[s]=ma(i[s],t)}else e=i.slice()}else if(i instanceof Dy)e=i.slice();else if(t(i)){e={};for(let n in i)n!=rm&&(e[n]=ma(i[n],t))}else e=i;return e}function nn(i){let t=arguments;for(let e=1;e<t.length;e++){let n=t[e];for(let s in n)s!=rm&&(Dl(i[s])?nn(i[s],ma(n[s])):i[s]=ma(n[s]))}return i}const Ly=0,Iy=1,Uy=2;function Ny(i,t,e){for(let n=0,s,r=-1;n<t.length;n++){let a=t[n];if(a>r){for(s=a-1;s>=0&&i[s]==null;)i[s--]=null;for(s=a+1;s<e&&i[s]==null;)i[r=s++]=null}}}function Fy(i,t){if(zy(i)){let a=i[0].slice();for(let o=1;o<i.length;o++)a.push(...i[o].slice(1));return Gy(a[0])||(a=By(a)),a}let e=new Set;for(let a=0;a<i.length;a++){let l=i[a][0],c=l.length;for(let h=0;h<c;h++)e.add(l[h])}let n=[Array.from(e).sort((a,o)=>a-o)],s=n[0].length,r=new Map;for(let a=0;a<s;a++)r.set(n[0][a],a);for(let a=0;a<i.length;a++){let o=i[a],l=o[0];for(let c=1;c<o.length;c++){let h=o[c],u=Array(s).fill(void 0),f=t?t[a][c]:Iy,m=[];for(let v=0;v<h.length;v++){let M=h[v],p=r.get(l[v]);M===null?f!=Ly&&(u[p]=M,f==Uy&&m.push(p)):u[p]=M}Ny(u,m,s),n.push(u)}}return n}const Oy=typeof queueMicrotask>"u"?i=>Promise.resolve().then(i):queueMicrotask;function By(i){let t=i[0],e=t.length,n=Array(e);for(let r=0;r<n.length;r++)n[r]=r;n.sort((r,a)=>t[r]-t[a]);let s=[];for(let r=0;r<i.length;r++){let a=i[r],o=Array(e);for(let l=0;l<e;l++)o[l]=a[n[l]];s.push(o)}return s}function zy(i){let t=i[0][0],e=t.length;for(let n=1;n<i.length;n++){let s=i[n][0];if(s.length!=e)return!1;if(s!=t){for(let r=0;r<e;r++)if(s[r]!=t[r])return!1}}return!0}function Gy(i,t=100){const e=i.length;if(e<=1)return!0;let n=0,s=e-1;for(;n<=s&&i[n]==null;)n++;for(;s>=n&&i[s]==null;)s--;if(s<=n)return!0;const r=Nn(1,Jn((s-n+1)/t));for(let a=i[n],o=n+r;o<=s;o+=r){const l=i[o];if(l!=null){if(l<=a)return!1;a=l}}return!0}const am=["January","February","March","April","May","June","July","August","September","October","November","December"],om=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];function lm(i){return i.slice(0,3)}const ky=om.map(lm),Hy=am.map(lm),Vy={MMMM:am,MMM:Hy,WWWW:om,WWW:ky};function ka(i){return(i<10?"0":"")+i}function Wy(i){return(i<10?"00":i<100?"0":"")+i}const Xy={YYYY:i=>i.getFullYear(),YY:i=>(i.getFullYear()+"").slice(2),MMMM:(i,t)=>t.MMMM[i.getMonth()],MMM:(i,t)=>t.MMM[i.getMonth()],MM:i=>ka(i.getMonth()+1),M:i=>i.getMonth()+1,DD:i=>ka(i.getDate()),D:i=>i.getDate(),WWWW:(i,t)=>t.WWWW[i.getDay()],WWW:(i,t)=>t.WWW[i.getDay()],HH:i=>ka(i.getHours()),H:i=>i.getHours(),h:i=>{let t=i.getHours();return t==0?12:t>12?t-12:t},AA:i=>i.getHours()>=12?"PM":"AM",aa:i=>i.getHours()>=12?"pm":"am",a:i=>i.getHours()>=12?"p":"a",mm:i=>ka(i.getMinutes()),m:i=>i.getMinutes(),ss:i=>ka(i.getSeconds()),s:i=>i.getSeconds(),fff:i=>Wy(i.getMilliseconds())};function Ah(i,t){t=t||Vy;let e=[],n=/\{([a-z]+)\}|[^{]+/gi,s;for(;s=n.exec(i);)e.push(s[0][0]=="{"?Xy[s[1]]:s[0]);return r=>{let a="";for(let o=0;o<e.length;o++)a+=typeof e[o]=="string"?e[o]:e[o](r,t);return a}}const Yy=new Intl.DateTimeFormat().resolvedOptions().timeZone;function qy(i,t){let e;return t=="UTC"||t=="Etc/UTC"?e=new Date(+i+i.getTimezoneOffset()*6e4):t==Yy?e=i:(e=new Date(i.toLocaleString("en-US",{timeZone:t})),e.setMilliseconds(i.getMilliseconds())),e}const cm=i=>i%1==0,xl=[1,2,2.5,5],jy=oo(10,-32,0,xl),um=oo(10,0,32,xl),Ky=um.filter(cm),ir=jy.concat(um),wh=`
`,hm="{YYYY}",Nd=wh+hm,fm="{M}/{D}",$a=wh+fm,Ko=$a+"/{YY}",dm="{aa}",$y="{h}:{mm}",Qr=$y+dm,Fd=wh+Qr,Od=":{ss}",Te=null;function pm(i){let t=i*1e3,e=t*60,n=e*60,s=n*24,r=s*30,a=s*365,l=(i==1?oo(10,0,3,xl).filter(cm):oo(10,-3,0,xl)).concat([t,t*5,t*10,t*15,t*30,e,e*5,e*10,e*15,e*30,n,n*2,n*3,n*4,n*6,n*8,n*12,s,s*2,s*3,s*4,s*5,s*6,s*7,s*8,s*9,s*10,s*15,r,r*2,r*3,r*4,r*6,a,a*2,a*5,a*10,a*25,a*50,a*100]);const c=[[a,hm,Te,Te,Te,Te,Te,Te,1],[s*28,"{MMM}",Nd,Te,Te,Te,Te,Te,1],[s,fm,Nd,Te,Te,Te,Te,Te,1],[n,"{h}"+dm,Ko,Te,$a,Te,Te,Te,1],[e,Qr,Ko,Te,$a,Te,Te,Te,1],[t,Od,Ko+" "+Qr,Te,$a+" "+Qr,Te,Fd,Te,1],[i,Od+".{fff}",Ko+" "+Qr,Te,$a+" "+Qr,Te,Fd,Te,1]];function h(u){return(f,m,v,M,p,d)=>{let y=[],R=p>=a,A=p>=r&&p<a,D=u(v),w=Fe(D*i,3),N=Lc(D.getFullYear(),R?0:D.getMonth(),A||R?1:D.getDate()),k=Fe(N*i,3);if(A||R){let E=A?p/r:0,T=R?p/a:0,L=w==k?w:Fe(Lc(N.getFullYear()+T,N.getMonth()+E,1)*i,3),W=new Date(cn(L/i)),z=W.getFullYear(),K=W.getMonth();for(let V=0;L<=M;V++){let j=Lc(z+T*V,K+E*V,1),G=j-u(Fe(j*i,3));L=Fe((+j+G)*i,3),L<=M&&y.push(L)}}else{let E=p>=s?s:p,T=Jn(v)-Jn(w),L=k+T+Pl(w-k,E);y.push(L);let W=u(L),z=W.getHours()+W.getMinutes()/e+W.getSeconds()/n,K=p/n,V=f.axes[m]._space,j=d/V;for(;L=Fe(L+p,i==1?0:3),!(L>M);)if(K>1){let G=Jn(Fe(z+K,6))%24,at=u(L).getHours()-G;at>1&&(at=-1),L-=at*n,z=(z+K)%24;let ut=y[y.length-1];Fe((L-ut)/p,3)*j>=.7&&y.push(L)}else y.push(L)}return y}}return[l,c,h]}const[Zy,Jy,Qy]=pm(1),[tE,eE,nE]=pm(.001);oo(2,-53,53,[1]);function Bd(i,t){return i.map(e=>e.map((n,s)=>s==0||s==8||n==null?n:t(s==1||e[8]==0?n:e[1]+n)))}function zd(i,t){return(e,n,s,r,a)=>{let o=t.find(v=>a>=v[0])||t[t.length-1],l,c,h,u,f,m;return n.map(v=>{let M=i(v),p=M.getFullYear(),d=M.getMonth(),y=M.getDate(),R=M.getHours(),A=M.getMinutes(),D=M.getSeconds(),w=p!=l&&o[2]||d!=c&&o[3]||y!=h&&o[4]||R!=u&&o[5]||A!=f&&o[6]||D!=m&&o[7]||o[1];return l=p,c=d,h=y,u=R,f=A,m=D,w(M)})}}function iE(i,t){let e=Ah(t);return(n,s,r,a,o)=>s.map(l=>e(i(l)))}function Lc(i,t,e){return new Date(i,t,e)}function Gd(i,t){return t(i)}const sE="{YYYY}-{MM}-{DD} {h}:{mm}{aa}";function kd(i,t){return(e,n,s,r)=>r==null?Mh:t(i(n))}function rE(i,t){let e=i.series[t];return e.width?e.stroke(i,t):e.points.width?e.points.stroke(i,t):null}function aE(i,t){return i.series[t].fill(i,t)}const oE={show:!0,live:!0,isolate:!1,mount:Ay,markers:{show:!0,width:2,stroke:rE,fill:aE,dash:"solid"},idx:null,idxs:null,values:[]};function lE(i,t){let e=i.cursor.points,n=ai(),s=e.size(i,t);Xe(n,ja,s),Xe(n,Ka,s);let r=s/-2;Xe(n,"marginLeft",r),Xe(n,"marginTop",r);let a=e.width(i,t,s);return a&&Xe(n,"borderWidth",a),n}function cE(i,t){let e=i.series[t].points;return e._fill||e._stroke}function uE(i,t){let e=i.series[t].points;return e._stroke||e._fill}function hE(i,t){return i.series[t].points.size}const Ic=[0,0];function fE(i,t,e){return Ic[0]=t,Ic[1]=e,Ic}function $o(i,t,e,n=!0){return s=>{s.button==0&&(!n||s.target==t)&&e(s)}}function Uc(i,t,e,n=!0){return s=>{(!n||s.target==t)&&e(s)}}const dE={show:!0,x:!0,y:!0,lock:!1,move:fE,points:{one:!1,show:lE,size:hE,width:0,stroke:uE,fill:cE},bind:{mousedown:$o,mouseup:$o,click:$o,dblclick:$o,mousemove:Uc,mouseleave:Uc,mouseenter:Uc},drag:{setScale:!0,x:!0,y:!1,dist:0,uni:null,click:(i,t)=>{t.stopPropagation(),t.stopImmediatePropagation()},_x:!1,_y:!1},focus:{dist:(i,t,e,n,s)=>n-s,prox:-1,bias:0},hover:{skip:[void 0],prox:null,bias:0},left:-10,top:-10,idx:null,dataIdx:null,idxs:null,event:null},mm={show:!0,stroke:"rgba(0,0,0,0.07)",width:2},Rh=nn({},mm,{filter:em}),gm=nn({},Rh,{size:10}),_m=nn({},mm,{show:!1}),Ch='12px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',xm="bold "+Ch,vm=1.5,Hd={show:!0,scale:"x",stroke:vh,space:50,gap:5,alignTo:1,size:50,labelGap:0,labelSize:30,labelFont:xm,side:2,grid:Rh,ticks:gm,border:_m,font:Ch,lineGap:vm,rotate:0},pE="Value",mE="Time",Vd={show:!0,scale:"x",auto:!1,sorted:1,min:Ne,max:-Ne,idxs:[]};function gE(i,t,e,n,s){return t.map(r=>r==null?"":bh(r))}function _E(i,t,e,n,s,r,a){let o=[],l=Os.get(s)||0;e=a?e:Fe(Pl(e,s),l);for(let c=e;c<=n;c=Fe(c+s,l))o.push(Object.is(c,-0)?0:c);return o}function Yu(i,t,e,n,s,r,a){const o=[],l=i.scales[i.axes[t].scale].log,c=l==10?fs:Jp,h=Jn(c(e));s=da(l,h),l==10&&(s=ir[yi(s,ir)]);let u=e,f=s*l;l==10&&(f=ir[yi(f,ir)]);do o.push(u),u=u+s,l==10&&!Os.has(u)&&(u=Fe(u,Os.get(s))),u>=f&&(s=u,f=s*l,l==10&&(f=ir[yi(f,ir)]));while(u<=n);return o}function xE(i,t,e,n,s,r,a){let l=i.scales[i.axes[t].scale].asinh,c=n>l?Yu(i,t,Nn(l,e),n,s):[l],h=n>=0&&e<=0?[0]:[];return(e<-l?Yu(i,t,Nn(l,-n),-e,s):[l]).reverse().map(f=>-f).concat(h,c)}const Mm=/./,vE=/[12357]/,ME=/[125]/,Wd=/1/,qu=(i,t,e,n)=>i.map((s,r)=>t==4&&s==0||r%n==0&&e.test(s.toExponential()[s<0?1:0])?s:null);function SE(i,t,e,n,s){let r=i.axes[e],a=r.scale,o=i.scales[a],l=i.valToPos,c=r._space,h=l(10,a),u=l(9,a)-h>=c?Mm:l(7,a)-h>=c?vE:l(5,a)-h>=c?ME:Wd;if(u==Wd){let f=un(l(1,a)-h);if(f<c)return qu(t.slice().reverse(),o.distr,u,li(c/f)).reverse()}return qu(t,o.distr,u,1)}function yE(i,t,e,n,s){let r=i.axes[e],a=r.scale,o=r._space,l=i.valToPos,c=un(l(1,a)-l(2,a));return c<o?qu(t.slice().reverse(),3,Mm,li(o/c)).reverse():t}function EE(i,t,e,n){return n==null?Mh:t==null?"":bh(t)}const Xd={show:!0,scale:"y",stroke:vh,space:30,gap:5,alignTo:1,size:50,labelGap:0,labelSize:30,labelFont:xm,side:3,grid:Rh,ticks:gm,border:_m,font:Ch,lineGap:vm,rotate:0};function bE(i,t){let e=3+(i||1)*2;return Fe(e*t,3)}function TE(i,t){let{scale:e,idxs:n}=i.series[0],s=i._data[0],r=i.valToPos(s[n[0]],e,!0),a=i.valToPos(s[n[1]],e,!0),o=un(a-r),l=i.series[t],c=o/(l.points.space*be);return n[1]-n[0]<=c}const Yd={scale:null,auto:!0,sorted:0,min:Ne,max:-Ne},Sm=(i,t,e,n,s)=>s,qd={show:!0,auto:!0,sorted:0,gaps:Sm,alpha:1,facets:[nn({},Yd,{scale:"x"}),nn({},Yd,{scale:"y"})]},jd={scale:"y",auto:!0,sorted:0,show:!0,spanGaps:!1,gaps:Sm,alpha:1,points:{show:TE,filter:null},values:null,min:Ne,max:-Ne,idxs:[],path:null,clip:null};function AE(i,t,e,n,s){return e/10}const ym={time:ZS,auto:!0,distr:1,log:10,asinh:1,min:null,max:null,dir:1,ori:0},wE=nn({},ym,{time:!1,ori:1}),Kd={};function Em(i,t){let e=Kd[i];return e||(e={key:i,plots:[],sub(n){e.plots.push(n)},unsub(n){e.plots=e.plots.filter(s=>s!=n)},pub(n,s,r,a,o,l,c){for(let h=0;h<e.plots.length;h++)e.plots[h]!=s&&e.plots[h].pub(n,s,r,a,o,l,c)}},i!=null&&(Kd[i]=e)),e}const ga=1,ju=2;function Sr(i,t,e){const n=i.mode,s=i.series[t],r=n==2?i._data[t]:i._data,a=i.scales,o=i.bbox;let l=r[0],c=n==2?r[1]:r[t],h=n==2?a[s.facets[0].scale]:a[i.series[0].scale],u=n==2?a[s.facets[1].scale]:a[s.scale],f=o.left,m=o.top,v=o.width,M=o.height,p=i.valToPosH,d=i.valToPosV;return h.ori==0?e(s,l,c,h,u,p,d,f,m,v,M,Il,va,Nl,Tm,wm):e(s,l,c,h,u,d,p,m,f,M,v,Ul,Ma,Lh,Am,Rm)}function Ph(i,t){let e=0,n=0,s=xe(i.bands,Th);for(let r=0;r<s.length;r++){let a=s[r];a.series[0]==t?e=a.dir:a.series[1]==t&&(a.dir==1?n|=1:n|=2)}return[e,n==1?-1:n==2?1:n==3?2:0]}function RE(i,t,e,n,s){let r=i.mode,a=i.series[t],o=r==2?a.facets[1].scale:a.scale,l=i.scales[o];return s==-1?l.min:s==1?l.max:l.distr==3?l.dir==1?l.min:l.max:0}function ds(i,t,e,n,s,r){return Sr(i,t,(a,o,l,c,h,u,f,m,v,M,p)=>{let d=a.pxRound;const y=c.dir*(c.ori==0?1:-1),R=c.ori==0?va:Ma;let A,D;y==1?(A=e,D=n):(A=n,D=e);let w=d(u(o[A],c,M,m)),N=d(f(l[A],h,p,v)),k=d(u(o[D],c,M,m)),E=d(f(r==1?h.max:h.min,h,p,v)),T=new Path2D(s);return R(T,k,E),R(T,w,E),R(T,w,N),T})}function Ll(i,t,e,n,s,r){let a=null;if(i.length>0){a=new Path2D;const o=t==0?Nl:Lh;let l=e;for(let u=0;u<i.length;u++){let f=i[u];if(f[1]>f[0]){let m=f[0]-l;m>0&&o(a,l,n,m,n+r),l=f[1]}}let c=e+s-l,h=10;c>0&&o(a,l,n-h/2,c,n+r+h)}return a}function CE(i,t,e){let n=i[i.length-1];n&&n[0]==t?n[1]=e:i.push([t,e])}function Dh(i,t,e,n,s,r,a){let o=[],l=i.length;for(let c=s==1?e:n;c>=e&&c<=n;c+=s)if(t[c]===null){let u=c,f=c;if(s==1)for(;++c<=n&&t[c]===null;)f=c;else for(;--c>=e&&t[c]===null;)f=c;let m=r(i[u]),v=f==u?m:r(i[f]),M=u-s;m=a<=0&&M>=0&&M<l?r(i[M]):m;let d=f+s;v=a>=0&&d>=0&&d<l?r(i[d]):v,v>=m&&o.push([m,v])}return o}function $d(i){return i==0?tm:i==1?cn:t=>nr(t,i)}function bm(i){let t=i==0?Il:Ul,e=i==0?(s,r,a,o,l,c)=>{s.arcTo(r,a,o,l,c)}:(s,r,a,o,l,c)=>{s.arcTo(a,r,l,o,c)},n=i==0?(s,r,a,o,l)=>{s.rect(r,a,o,l)}:(s,r,a,o,l)=>{s.rect(a,r,l,o)};return(s,r,a,o,l,c=0,h=0)=>{c==0&&h==0?n(s,r,a,o,l):(c=bi(c,o/2,l/2),h=bi(h,o/2,l/2),t(s,r+c,a),e(s,r+o,a,r+o,a+l,c),e(s,r+o,a+l,r,a+l,h),e(s,r,a+l,r,a,h),e(s,r,a,r+o,a,c),s.closePath())}}const Il=(i,t,e)=>{i.moveTo(t,e)},Ul=(i,t,e)=>{i.moveTo(e,t)},va=(i,t,e)=>{i.lineTo(t,e)},Ma=(i,t,e)=>{i.lineTo(e,t)},Nl=bm(0),Lh=bm(1),Tm=(i,t,e,n,s,r)=>{i.arc(t,e,n,s,r)},Am=(i,t,e,n,s,r)=>{i.arc(e,t,n,s,r)},wm=(i,t,e,n,s,r,a)=>{i.bezierCurveTo(t,e,n,s,r,a)},Rm=(i,t,e,n,s,r,a)=>{i.bezierCurveTo(e,t,s,n,a,r)};function Cm(i){return(t,e,n,s,r)=>Sr(t,e,(a,o,l,c,h,u,f,m,v,M,p)=>{let{pxRound:d,points:y}=a,R,A;c.ori==0?(R=Il,A=Tm):(R=Ul,A=Am);const D=Fe(y.width*be,3);let w=(y.size-y.width)/2*be,N=Fe(w*2,3),k=new Path2D,E=new Path2D,{left:T,top:L,width:W,height:z}=t.bbox;Nl(E,T-N,L-N,W+N*2,z+N*2);const K=V=>{if(l[V]!=null){let j=d(u(o[V],c,M,m)),G=d(f(l[V],h,p,v));R(k,j+w,G),A(k,j,G,w,0,rl*2)}};if(r)r.forEach(K);else for(let V=n;V<=s;V++)K(V);return{stroke:D>0?k:null,fill:k,clip:E,flags:ga|ju}})}function Pm(i){return(t,e,n,s,r,a)=>{n!=s&&(r!=n&&a!=n&&i(t,e,n),r!=s&&a!=s&&i(t,e,s),i(t,e,a))}}const PE=Pm(va),DE=Pm(Ma);function Dm(i){const t=xe(i?.alignGaps,0);return(e,n,s,r)=>Sr(e,n,(a,o,l,c,h,u,f,m,v,M,p)=>{[s,r]=Rl(l,s,r);let d=a.pxRound,y=z=>d(u(z,c,M,m)),R=z=>d(f(z,h,p,v)),A,D;c.ori==0?(A=va,D=PE):(A=Ma,D=DE);const w=c.dir*(c.ori==0?1:-1),N={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:ga},k=N.stroke;let E=!1;if(r-s>=M*4){let z=ht=>e.posToVal(ht,c.key,!0),K=null,V=null,j,G,st,dt=y(o[w==1?s:r]),at=y(o[s]),ut=y(o[r]),St=z(w==1?at+1:ut-1);for(let ht=w==1?s:r;ht>=s&&ht<=r;ht+=w){let Qt=o[ht],Q=(w==1?Qt<St:Qt>St)?dt:y(Qt),et=l[ht];Q==dt?et!=null?(G=et,K==null?(A(k,Q,R(G)),j=K=V=G):G<K?K=G:G>V&&(V=G)):et===null&&(E=!0):(K!=null&&D(k,dt,R(K),R(V),R(j),R(G)),et!=null?(G=et,A(k,Q,R(G)),K=V=j=G):(K=V=null,et===null&&(E=!0)),dt=Q,St=z(dt+w))}K!=null&&K!=V&&st!=dt&&D(k,dt,R(K),R(V),R(j),R(G))}else for(let z=w==1?s:r;z>=s&&z<=r;z+=w){let K=l[z];K===null?E=!0:K!=null&&A(k,y(o[z]),R(K))}let[L,W]=Ph(e,n);if(a.fill!=null||L!=0){let z=N.fill=new Path2D(k),K=a.fillTo(e,n,a.min,a.max,L),V=R(K),j=y(o[s]),G=y(o[r]);w==-1&&([G,j]=[j,G]),A(z,G,V),A(z,j,V)}if(!a.spanGaps){let z=[];E&&z.push(...Dh(o,l,s,r,w,y,t)),N.gaps=z=a.gaps(e,n,s,r,z),N.clip=Ll(z,c.ori,m,v,M,p)}return W!=0&&(N.band=W==2?[ds(e,n,s,r,k,-1),ds(e,n,s,r,k,1)]:ds(e,n,s,r,k,W)),N})}function LE(i){const t=xe(i.align,1),e=xe(i.ascDesc,!1),n=xe(i.alignGaps,0),s=xe(i.extend,!1);return(r,a,o,l)=>Sr(r,a,(c,h,u,f,m,v,M,p,d,y,R)=>{[o,l]=Rl(u,o,l);let A=c.pxRound,{left:D,width:w}=r.bbox,N=at=>A(v(at,f,y,p)),k=at=>A(M(at,m,R,d)),E=f.ori==0?va:Ma;const T={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:ga},L=T.stroke,W=f.dir*(f.ori==0?1:-1);let z=k(u[W==1?o:l]),K=N(h[W==1?o:l]),V=K,j=K;s&&t==-1&&(j=D,E(L,j,z)),E(L,K,z);for(let at=W==1?o:l;at>=o&&at<=l;at+=W){let ut=u[at];if(ut==null)continue;let St=N(h[at]),ht=k(ut);t==1?E(L,St,z):E(L,V,ht),E(L,St,ht),z=ht,V=St}let G=V;s&&t==1&&(G=D+w,E(L,G,z));let[st,dt]=Ph(r,a);if(c.fill!=null||st!=0){let at=T.fill=new Path2D(L),ut=c.fillTo(r,a,c.min,c.max,st),St=k(ut);E(at,G,St),E(at,j,St)}if(!c.spanGaps){let at=[];at.push(...Dh(h,u,o,l,W,N,n));let ut=c.width*be/2,St=e||t==1?ut:-ut,ht=e||t==-1?-ut:ut;at.forEach(Qt=>{Qt[0]+=St,Qt[1]+=ht}),T.gaps=at=c.gaps(r,a,o,l,at),T.clip=Ll(at,f.ori,p,d,y,R)}return dt!=0&&(T.band=dt==2?[ds(r,a,o,l,L,-1),ds(r,a,o,l,L,1)]:ds(r,a,o,l,L,dt)),T})}function Zd(i,t,e,n,s,r,a=Ne){if(i.length>1){let o=null;for(let l=0,c=1/0;l<i.length;l++)if(t[l]!==void 0){if(o!=null){let h=un(i[l]-i[o]);h<c&&(c=h,a=un(e(i[l],n,s,r)-e(i[o],n,s,r)))}o=l}}return a}function IE(i){i=i||Ja;const t=xe(i.size,[.6,Ne,1]),e=i.align||0,n=i.gap||0;let s=i.radius;s=s==null?[0,0]:typeof s=="number"?[s,0]:s;const r=ce(s),a=1-t[0],o=xe(t[1],Ne),l=xe(t[2],1),c=xe(i.disp,Ja),h=xe(i.each,m=>{}),{fill:u,stroke:f}=c;return(m,v,M,p)=>Sr(m,v,(d,y,R,A,D,w,N,k,E,T,L)=>{let W=d.pxRound,z=e,K=n*be,V=o*be,j=l*be,G,st;A.ori==0?[G,st]=r(m,v):[st,G]=r(m,v);const dt=A.dir*(A.ori==0?1:-1);let at=A.ori==0?Nl:Lh,ut=A.ori==0?h:(U,Z,nt,tt,Nt,mt,Lt)=>{h(U,Z,nt,Nt,tt,Lt,mt)},St=xe(m.bands,Th).find(U=>U.series[0]==v),ht=St!=null?St.dir:0,Qt=d.fillTo(m,v,d.min,d.max,ht),ee=W(N(Qt,D,L,E)),Q,et,bt,kt=T,_t=W(d.width*be),te=!1,Ce=null,Yt=null,re=null,he=null;u!=null&&(_t==0||f!=null)&&(te=!0,Ce=u.values(m,v,M,p),Yt=new Map,new Set(Ce).forEach(U=>{U!=null&&Yt.set(U,new Path2D)}),_t>0&&(re=f.values(m,v,M,p),he=new Map,new Set(re).forEach(U=>{U!=null&&he.set(U,new Path2D)})));let{x0:qt,size:Oe}=c;if(qt!=null&&Oe!=null){z=1,y=qt.values(m,v,M,p),qt.unit==2&&(y=y.map(nt=>m.posToVal(k+nt*T,A.key,!0)));let U=Oe.values(m,v,M,p);Oe.unit==2?et=U[0]*T:et=w(U[0],A,T,k)-w(0,A,T,k),kt=Zd(y,R,w,A,T,k,kt),bt=kt-et+K}else kt=Zd(y,R,w,A,T,k,kt),bt=kt*a+K,et=kt-bt;bt<1&&(bt=0),_t>=et/2&&(_t=0),bt<5&&(W=tm);let F=bt>0,Pe=kt-bt-(F?_t:0);et=W(Xu(Pe,j,V)),Q=(z==0?et/2:z==dt?0:et)-z*dt*((z==0?K/2:0)+(F?_t/2:0));const jt={stroke:null,fill:null,clip:null,band:null,gaps:null,flags:0},pe=te?null:new Path2D;let Dt=null;if(St!=null)Dt=m.data[St.series[1]];else{let{y0:U,y1:Z}=c;U!=null&&Z!=null&&(R=Z.values(m,v,M,p),Dt=U.values(m,v,M,p))}let P=G*et,x=st*et;for(let U=dt==1?M:p;U>=M&&U<=p;U+=dt){let Z=R[U];if(Z==null)continue;if(Dt!=null){let pt=Dt[U]??0;if(Z-pt==0)continue;ee=N(pt,D,L,E)}let nt=A.distr!=2||c!=null?y[U]:U,tt=w(nt,A,T,k),Nt=N(xe(Z,Qt),D,L,E),mt=W(tt-Q),Lt=W(Nn(Nt,ee)),Bt=W(bi(Nt,ee)),ot=Lt-Bt;if(Z!=null){let pt=Z<0?x:P,At=Z<0?P:x;te?(_t>0&&re[U]!=null&&at(he.get(re[U]),mt,Bt+Jn(_t/2),et,Nn(0,ot-_t),pt,At),Ce[U]!=null&&at(Yt.get(Ce[U]),mt,Bt+Jn(_t/2),et,Nn(0,ot-_t),pt,At)):at(pe,mt,Bt+Jn(_t/2),et,Nn(0,ot-_t),pt,At),ut(m,v,U,mt-_t/2,Bt,et+_t,ot)}}return _t>0?jt.stroke=te?he:pe:te||(jt._fill=d.width==0?d._fill:d._stroke??d._fill,jt.width=0),jt.fill=te?Yt:pe,jt})}function UE(i,t){const e=xe(t?.alignGaps,0);return(n,s,r,a)=>Sr(n,s,(o,l,c,h,u,f,m,v,M,p,d)=>{[r,a]=Rl(c,r,a);let y=o.pxRound,R=G=>y(f(G,h,p,v)),A=G=>y(m(G,u,d,M)),D,w,N;h.ori==0?(D=Il,N=va,w=wm):(D=Ul,N=Ma,w=Rm);const k=h.dir*(h.ori==0?1:-1);let E=R(l[k==1?r:a]),T=E,L=[],W=[];for(let G=k==1?r:a;G>=r&&G<=a;G+=k)if(c[G]!=null){let dt=l[G],at=R(dt);L.push(T=at),W.push(A(c[G]))}const z={stroke:i(L,W,D,N,w,y),fill:null,clip:null,band:null,gaps:null,flags:ga},K=z.stroke;let[V,j]=Ph(n,s);if(o.fill!=null||V!=0){let G=z.fill=new Path2D(K),st=o.fillTo(n,s,o.min,o.max,V),dt=A(st);N(G,T,dt),N(G,E,dt)}if(!o.spanGaps){let G=[];G.push(...Dh(l,c,r,a,k,R,e)),z.gaps=G=o.gaps(n,s,r,a,G),z.clip=Ll(G,h.ori,v,M,p,d)}return j!=0&&(z.band=j==2?[ds(n,s,r,a,K,-1),ds(n,s,r,a,K,1)]:ds(n,s,r,a,K,j)),z})}function NE(i){return UE(FE,i)}function FE(i,t,e,n,s,r){const a=i.length;if(a<2)return null;const o=new Path2D;if(e(o,i[0],t[0]),a==2)n(o,i[1],t[1]);else{let l=Array(a),c=Array(a-1),h=Array(a-1),u=Array(a-1);for(let f=0;f<a-1;f++)h[f]=t[f+1]-t[f],u[f]=i[f+1]-i[f],c[f]=h[f]/u[f];l[0]=c[0];for(let f=1;f<a-1;f++)c[f]===0||c[f-1]===0||c[f-1]>0!=c[f]>0?l[f]=0:(l[f]=3*(u[f-1]+u[f])/((2*u[f]+u[f-1])/c[f-1]+(u[f]+2*u[f-1])/c[f]),isFinite(l[f])||(l[f]=0));l[a-1]=c[a-2];for(let f=0;f<a-1;f++)s(o,i[f]+u[f]/3,t[f]+l[f]*u[f]/3,i[f+1]-u[f]/3,t[f+1]-l[f+1]*u[f]/3,i[f+1],t[f+1])}return o}const Ku=new Set;function Jd(){for(let i of Ku)i.syncRect(!0)}xa&&(mr(gy,sa,Jd),mr(_y,sa,Jd,!0),mr(gl,sa,()=>{Ze.pxRatio=be}));const OE=Dm(),BE=Cm();function Qd(i,t,e,n){return(n?[i[0],i[1]].concat(i.slice(2)):[i[0]].concat(i.slice(1))).map((r,a)=>$u(r,a,t,e))}function zE(i,t){return i.map((e,n)=>n==0?{}:nn({},t,e))}function $u(i,t,e,n){return nn({},t==0?e:n,i)}function Lm(i,t,e){return t==null?pa:[t,e]}const GE=Lm;function kE(i,t,e){return t==null?pa:_l(t,e,Eh,!0)}function Im(i,t,e,n){return t==null?pa:Cl(t,e,i.scales[n].log,!1)}const HE=Im;function Um(i,t,e,n){return t==null?pa:yh(t,e,i.scales[n].log,!1)}const VE=Um;function WE(i,t,e,n,s){let r=Nn(Dd(i),Dd(t)),a=t-i,o=yi(s/n*a,e);do{let l=e[o],c=n*l/a;if(c>=s&&r+(l<5?Os.get(l):0)<=17)return[l,c]}while(++o<e.length);return[0,0]}function tp(i){let t,e;return i=i.replace(/(\d+)px/,(n,s)=>(t=cn((e=+s)*be))+"px"),[i,t,e]}function XE(i){i.show&&[i.font,i.labelFont].forEach(t=>{let e=Fe(t[2]*be,1);t[0]=t[0].replace(/[0-9.]+px/,e+"px"),t[1]=e})}function Ze(i,t,e){const n={mode:xe(i.mode,1)},s=n.mode;function r(g,S,C,I){let B=S.valToPct(g);return I+C*(S.dir==-1?1-B:B)}function a(g,S,C,I){let B=S.valToPct(g);return I+C*(S.dir==-1?B:1-B)}function o(g,S,C,I){return S.ori==0?r(g,S,C,I):a(g,S,C,I)}n.valToPosH=r,n.valToPosV=a;let l=!1;n.status=0;const c=n.root=ai(JS);if(i.id!=null&&(c.id=i.id),$n(c,i.class),i.title){let g=ai(ey,c);g.textContent=i.title}const h=Si("canvas"),u=n.ctx=h.getContext("2d"),f=ai(ny,c);mr("click",f,g=>{g.target===v&&(ke!=Rr||Ye!=Cr)&&Mn.click(n,g)},!0);const m=n.under=ai(iy,f);f.appendChild(h);const v=n.over=ai(sy,f);i=ma(i);const M=+xe(i.pxAlign,1),p=$d(M);(i.plugins||[]).forEach(g=>{g.opts&&(i=g.opts(n,i)||i)});const d=i.ms||.001,y=n.series=s==1?Qd(i.series||[],Vd,jd,!1):zE(i.series||[null],qd),R=n.axes=Qd(i.axes||[],Hd,Xd,!0),A=n.scales={},D=n.bands=i.bands||[];D.forEach(g=>{g.fill=ce(g.fill||null),g.dir=xe(g.dir,-1)});const w=s==2?y[1].facets[0].scale:y[0].scale,N={axes:Zi,series:Se},k=(i.drawOrder||["axes","series"]).map(g=>N[g]);function E(g){const S=g.distr==3?C=>fs(C>0?C:g.clamp(n,C,g.min,g.max,g.key)):g.distr==4?C=>Dc(C,g.asinh):g.distr==100?C=>g.fwd(C):C=>C;return C=>{let I=S(C),{_min:B,_max:q}=g,it=q-B;return(I-B)/it}}function T(g){let S=A[g];if(S==null){let C=(i.scales||Ja)[g]||Ja;if(C.from!=null){T(C.from);let I=nn({},A[C.from],C,{key:g});I.valToPct=E(I),A[g]=I}else{S=A[g]=nn({},g==w?ym:wE,C),S.key=g;let I=S.time,B=S.range,q=Ls(B);if((g!=w||s==2&&!I)&&(q&&(B[0]==null||B[1]==null)&&(B={min:B[0]==null?Rd:{mode:1,hard:B[0],soft:B[0]},max:B[1]==null?Rd:{mode:1,hard:B[1],soft:B[1]}},q=!1),!q&&Dl(B))){let it=B;B=(ct,gt,Rt)=>gt==null?pa:_l(gt,Rt,it)}S.range=ce(B||(I?GE:g==w?S.distr==3?HE:S.distr==4?VE:Lm:S.distr==3?Im:S.distr==4?Um:kE)),S.auto=ce(q?!1:S.auto),S.clamp=ce(S.clamp||AE),S._min=S._max=null,S.valToPct=E(S)}}}T("x"),T("y"),s==1&&y.forEach(g=>{T(g.scale)}),R.forEach(g=>{T(g.scale)});for(let g in i.scales)T(g);const L=A[w],W=L.distr;let z,K;L.ori==0?($n(c,QS),z=r,K=a):($n(c,ty),z=a,K=r);const V={};for(let g in A){let S=A[g];(S.min!=null||S.max!=null)&&(V[g]={min:S.min,max:S.max},S.min=S.max=null)}const j=i.tzDate||(g=>new Date(cn(g/d))),G=i.fmtDate||Ah,st=d==1?Qy(j):nE(j),dt=zd(j,Bd(d==1?Jy:eE,G)),at=kd(j,Gd(sE,G)),ut=[],St=n.legend=nn({},oE,i.legend),ht=n.cursor=nn({},dE,{drag:{y:s==2}},i.cursor),Qt=St.show,ee=ht.show,Q=St.markers;St.idxs=ut,Q.width=ce(Q.width),Q.dash=ce(Q.dash),Q.stroke=ce(Q.stroke),Q.fill=ce(Q.fill);let et,bt,kt,_t=[],te=[],Ce,Yt=!1,re={};if(St.live){const g=y[1]?y[1].values:null;Yt=g!=null,Ce=Yt?g(n,1,0):{_:0};for(let S in Ce)re[S]=Mh}if(Qt)if(et=Si("table",uy,c),kt=Si("tbody",null,et),St.mount(n,et),Yt){bt=Si("thead",null,et,kt);let g=Si("tr",null,bt);Si("th",null,g);for(var he in Ce)Si("th",md,g).textContent=he}else $n(et,fy),St.live&&$n(et,hy);const qt={show:!0},Oe={show:!1};function F(g,S){if(S==0&&(Yt||!St.live||s==2))return pa;let C=[],I=Si("tr",dy,kt,kt.childNodes[S]);$n(I,g.class),g.show||$n(I,lr);let B=Si("th",null,I);if(Q.show){let ct=ai(py,B);if(S>0){let gt=Q.width(n,S);gt&&(ct.style.border=gt+"px "+Q.dash(n,S)+" "+Q.stroke(n,S)),ct.style.background=Q.fill(n,S)}}let q=ai(md,B);g.label instanceof HTMLElement?q.appendChild(g.label):q.textContent=g.label,S>0&&(Q.show||(q.style.color=g.width>0?Q.stroke(n,S):Q.fill(n,S)),jt("click",B,ct=>{if(ht._lock)return;pn(ct);let gt=y.indexOf(g);if((ct.ctrlKey||ct.metaKey)!=St.isolate){let Rt=y.some((Pt,Ft)=>Ft>0&&Ft!=gt&&Pt.show);y.forEach((Pt,Ft)=>{Ft>0&&Ci(Ft,Rt?Ft==gt?qt:Oe:qt,!0,tn.setSeries)})}else Ci(gt,{show:!g.show},!0,tn.setSeries)},!1),qi&&jt(vd,B,ct=>{ht._lock||(pn(ct),Ci(y.indexOf(g),Dr,!0,tn.setSeries))},!1));for(var it in Ce){let ct=Si("td",my,I);ct.textContent="--",C.push(ct)}return[I,C]}const Pe=new Map;function jt(g,S,C,I=!0){const B=Pe.get(S)||{},q=ht.bind[g](n,S,C,I);q&&(mr(g,S,B[g]=q),Pe.set(S,B))}function pe(g,S,C){const I=Pe.get(S)||{};for(let B in I)(g==null||B==g)&&(Wu(B,S,I[B]),delete I[B]);g==null&&Pe.delete(S)}let Dt=0,P=0,x=0,U=0,Z=0,nt=0,tt=Z,Nt=nt,mt=x,Lt=U,Bt=0,ot=0,pt=0,At=0;n.bbox={};let Ot=!1,xt=!1,Kt=!1,O=!1,yt=!1,lt=!1;function wt(g,S,C){(C||g!=n.width||S!=n.height)&&ft(g,S),br(!1),Kt=!0,xt=!0,Tr()}function ft(g,S){n.width=Dt=x=g,n.height=P=U=S,Z=nt=0,De(),ve();let C=n.bbox;Bt=C.left=nr(Z*be,.5),ot=C.top=nr(nt*be,.5),pt=C.width=nr(x*be,.5),At=C.height=nr(U*be,.5)}const rt=3;function vt(){let g=!1,S=0;for(;!g;){S++;let C=Tn(S),I=ya(S);g=S==rt||C&&I,g||(ft(n.width,n.height),xt=!0)}}function $t({width:g,height:S}){wt(g,S)}n.setSize=$t;function De(){let g=!1,S=!1,C=!1,I=!1;R.forEach((B,q)=>{if(B.show&&B._show){let{side:it,_size:ct}=B,gt=it%2,Rt=B.label!=null?B.labelSize:0,Pt=ct+Rt;Pt>0&&(gt?(x-=Pt,it==3?(Z+=Pt,I=!0):C=!0):(U-=Pt,it==0?(nt+=Pt,g=!0):S=!0))}}),ni[0]=g,ni[1]=C,ni[2]=S,ni[3]=I,x-=mi[1]+mi[3],Z+=mi[3],U-=mi[2]+mi[0],nt+=mi[0]}function ve(){let g=Z+x,S=nt+U,C=Z,I=nt;function B(q,it){switch(q){case 1:return g+=it,g-it;case 2:return S+=it,S-it;case 3:return C-=it,C+it;case 0:return I-=it,I+it}}R.forEach((q,it)=>{if(q.show&&q._show){let ct=q.side;q._pos=B(ct,q._size),q.label!=null&&(q._lpos=B(ct,q.labelSize))}})}if(ht.dataIdx==null){let g=ht.hover,S=g.skip=new Set(g.skip??[]);S.add(void 0);let C=g.prox=ce(g.prox),I=g.bias??=0;ht.dataIdx=(B,q,it,ct)=>{if(q==0)return it;let gt=it,Rt=C(B,q,it,ct)??Ne,Pt=Rt>=0&&Rt<Ne,Ft=L.ori==0?x:U,Zt=ht.left,Ee=t[0],ge=t[q];if(S.has(ge[it])){gt=null;let ae=null,Wt=null,Gt;if(I==0||I==-1)for(Gt=it;ae==null&&Gt-- >0;)S.has(ge[Gt])||(ae=Gt);if(I==0||I==1)for(Gt=it;Wt==null&&Gt++<ge.length;)S.has(ge[Gt])||(Wt=Gt);if(ae!=null||Wt!=null)if(Pt){let Ve=ae==null?-1/0:z(Ee[ae],L,Ft,0),qe=Wt==null?1/0:z(Ee[Wt],L,Ft,0),xn=Zt-Ve,Le=qe-Zt;xn<=Le?xn<=Rt&&(gt=ae):Le<=Rt&&(gt=Wt)}else gt=Wt==null?ae:ae==null?Wt:it-ae<=Wt-it?ae:Wt}else Pt&&un(Zt-z(Ee[it],L,Ft,0))>Rt&&(gt=null);return gt}}const pn=g=>{ht.event=g};ht.idxs=ut,ht._lock=!1;let Be=ht.points;Be.show=ce(Be.show),Be.size=ce(Be.size),Be.stroke=ce(Be.stroke),Be.width=ce(Be.width),Be.fill=ce(Be.fill);const ei=n.focus=nn({},i.focus||{alpha:.3},ht.focus),qi=ei.prox>=0,Ai=qi&&Be.one;let Fn=[],ji=[],Ki=[];function wi(g,S){let C=Be.show(n,S);if(C instanceof HTMLElement)return $n(C,cy),$n(C,g.class),Ni(C,-10,-10,x,U),v.insertBefore(C,Fn[S]),C}function yr(g,S){if(s==1||S>0){let C=s==1&&A[g.scale].time,I=g.value;g.value=C?Ud(I)?kd(j,Gd(I,G)):I||at:I||EE,g.label=g.label||(C?mE:pE)}if(Ai||S>0){g.width=g.width==null?1:g.width,g.paths=g.paths||OE||wy,g.fillTo=ce(g.fillTo||RE),g.pxAlign=+xe(g.pxAlign,M),g.pxRound=$d(g.pxAlign),g.stroke=ce(g.stroke||null),g.fill=ce(g.fill||null),g._stroke=g._fill=g._paths=g._focus=null;let C=bE(Nn(1,g.width),1),I=g.points=nn({},{size:C,width:Nn(1,C*.2),stroke:g.stroke,space:C*2,paths:BE,_stroke:null,_fill:null},g.points);I.show=ce(I.show),I.filter=ce(I.filter),I.fill=ce(I.fill),I.stroke=ce(I.stroke),I.paths=ce(I.paths),I.pxAlign=g.pxAlign}if(Qt){let C=F(g,S);_t.splice(S,0,C[0]),te.splice(S,0,C[1]),St.values.push(null)}if(ee){ut.splice(S,0,null);let C=null;Ai?S==0&&(C=wi(g,S)):S>0&&(C=wi(g,S)),Fn.splice(S,0,C),ji.splice(S,0,0),Ki.splice(S,0,0)}_n("addSeries",S)}function go(g,S){S=S??y.length,g=s==1?$u(g,S,Vd,jd):$u(g,S,{},qd),y.splice(S,0,g),yr(y[S],S)}n.addSeries=go;function _o(g){if(y.splice(g,1),Qt){St.values.splice(g,1),te.splice(g,1);let S=_t.splice(g,1)[0];pe(null,S.firstChild),S.remove()}ee&&(ut.splice(g,1),Fn.splice(g,1)[0].remove(),ji.splice(g,1),Ki.splice(g,1)),_n("delSeries",g)}n.delSeries=_o;const ni=[!1,!1,!1,!1];function xo(g,S){if(g._show=g.show,g.show){let C=g.side%2,I=A[g.scale];I==null&&(g.scale=C?y[1].scale:w,I=A[g.scale]);let B=I.time;g.size=ce(g.size),g.space=ce(g.space),g.rotate=ce(g.rotate),Ls(g.incrs)&&g.incrs.forEach(it=>{!Os.has(it)&&Os.set(it,im(it))}),g.incrs=ce(g.incrs||(I.distr==2?Ky:B?d==1?Zy:tE:ir)),g.splits=ce(g.splits||(B&&I.distr==1?st:I.distr==3?Yu:I.distr==4?xE:_E)),g.stroke=ce(g.stroke),g.grid.stroke=ce(g.grid.stroke),g.ticks.stroke=ce(g.ticks.stroke),g.border.stroke=ce(g.border.stroke);let q=g.values;g.values=Ls(q)&&!Ls(q[0])?ce(q):B?Ls(q)?zd(j,Bd(q,G)):Ud(q)?iE(j,q):q||dt:q||gE,g.filter=ce(g.filter||(I.distr>=3&&I.log==10?SE:I.distr==3&&I.log==2?yE:em)),g.font=tp(g.font),g.labelFont=tp(g.labelFont),g._size=g.size(n,null,S,0),g._space=g._rotate=g._incrs=g._found=g._splits=g._values=null,g._size>0&&(ni[S]=!0,g._el=ai(ry,f))}}function Ri(g,S,C,I){let[B,q,it,ct]=C,gt=S%2,Rt=0;return gt==0&&(ct||q)&&(Rt=S==0&&!B||S==2&&!it?cn(Hd.size/3):0),gt==1&&(B||it)&&(Rt=S==1&&!q||S==3&&!ct?cn(Xd.size/2):0),Rt}const Sa=n.padding=(i.padding||[Ri,Ri,Ri,Ri]).map(g=>ce(xe(g,Ri))),mi=n._padding=Sa.map((g,S)=>g(n,S,ni,0));let rn,Je=null,Qe=null;const Er=s==1?y[0].idxs:null;let Wn=null,Vs=!1;function b(g,S){if(t=g??[],n.data=n._data=t,s==2){rn=0;for(let C=1;C<y.length;C++)rn+=t[C][0].length}else{t.length==0&&(n.data=n._data=t=[[]]),Wn=t[0],rn=Wn.length;let C=t;if(W==2){C=t.slice();let I=C[0]=Array(rn);for(let B=0;B<rn;B++)I[B]=B}n._data=t=C}if(br(!0),_n("setData"),W==2&&(Kt=!0),S!==!1){let C=L;C.auto(n,Vs)?H():Ss(w,C.min,C.max),O=O||ht.left>=0,lt=!0,Tr()}}n.setData=b;function H(){Vs=!0;let g,S;s==1&&(rn>0?(Je=Er[0]=0,Qe=Er[1]=rn-1,g=t[0][Je],S=t[0][Qe],W==2?(g=Je,S=Qe):g==S&&(W==3?[g,S]=Cl(g,g,L.log,!1):W==4?[g,S]=yh(g,g,L.log,!1):L.time?S=g+cn(86400/d):[g,S]=_l(g,S,Eh,!0))):(Je=Er[0]=g=null,Qe=Er[1]=S=null)),Ss(w,g,S)}let J,$,Y,Mt,Ct,Et,It,zt,Vt,Ut;function ne(g,S,C,I,B,q){g??=_d,C??=Th,I??="butt",B??=_d,q??="round",g!=J&&(u.strokeStyle=J=g),B!=$&&(u.fillStyle=$=B),S!=Y&&(u.lineWidth=Y=S),q!=Ct&&(u.lineJoin=Ct=q),I!=Et&&(u.lineCap=Et=I),C!=Mt&&u.setLineDash(Mt=C)}function Me(g,S,C,I){S!=$&&(u.fillStyle=$=S),g!=It&&(u.font=It=g),C!=zt&&(u.textAlign=zt=C),I!=Vt&&(u.textBaseline=Vt=I)}function ze(g,S,C,I,B=0){if(I.length>0&&g.auto(n,Vs)&&(S==null||S.min==null)){let q=xe(Je,0),it=xe(Qe,I.length-1),ct=C.min==null?Sy(I,q,it,B,g.distr==3):[C.min,C.max];g.min=bi(g.min,C.min=ct[0]),g.max=Nn(g.max,C.max=ct[1])}}const Ge={min:null,max:null};function Ae(){for(let I in A){let B=A[I];V[I]==null&&(B.min==null||V[w]!=null&&B.auto(n,Vs))&&(V[I]=Ge)}for(let I in A){let B=A[I];V[I]==null&&B.from!=null&&V[B.from]!=null&&(V[I]=Ge)}V[w]!=null&&br(!0);let g={};for(let I in V){let B=V[I];if(B!=null){let q=g[I]=ma(A[I],Py);if(B.min!=null)nn(q,B);else if(I!=w||s==2)if(rn==0&&q.from==null){let it=q.range(n,null,null,I);q.min=it[0],q.max=it[1]}else q.min=Ne,q.max=-Ne}}if(rn>0){y.forEach((I,B)=>{if(s==1){let q=I.scale,it=V[q];if(it==null)return;let ct=g[q];if(B==0){let gt=ct.range(n,ct.min,ct.max,q);ct.min=gt[0],ct.max=gt[1],Je=yi(ct.min,t[0]),Qe=yi(ct.max,t[0]),Qe-Je>1&&(t[0][Je]<ct.min&&Je++,t[0][Qe]>ct.max&&Qe--),I.min=Wn[Je],I.max=Wn[Qe]}else I.show&&I.auto&&ze(ct,it,I,t[B],I.sorted);I.idxs[0]=Je,I.idxs[1]=Qe}else if(B>0&&I.show&&I.auto){let[q,it]=I.facets,ct=q.scale,gt=it.scale,[Rt,Pt]=t[B],Ft=g[ct],Zt=g[gt];Ft!=null&&ze(Ft,V[ct],q,Rt,q.sorted),Zt!=null&&ze(Zt,V[gt],it,Pt,it.sorted),I.min=it.min,I.max=it.max}});for(let I in g){let B=g[I],q=V[I];if(B.from==null&&(q==null||q.min==null)){let it=B.range(n,B.min==Ne?null:B.min,B.max==-Ne?null:B.max,I);B.min=it[0],B.max=it[1]}}}for(let I in g){let B=g[I];if(B.from!=null){let q=g[B.from];if(q.min==null)B.min=B.max=null;else{let it=B.range(n,q.min,q.max,I);B.min=it[0],B.max=it[1]}}}let S={},C=!1;for(let I in g){let B=g[I],q=A[I];if(q.min!=B.min||q.max!=B.max){q.min=B.min,q.max=B.max;let it=q.distr;q._min=it==3?fs(q.min):it==4?Dc(q.min,q.asinh):it==100?q.fwd(q.min):q.min,q._max=it==3?fs(q.max):it==4?Dc(q.max,q.asinh):it==100?q.fwd(q.max):q.max,S[I]=C=!0}}if(C){y.forEach((I,B)=>{s==2?B>0&&S.y&&(I._paths=null):S[I.scale]&&(I._paths=null)});for(let I in S)Kt=!0,_n("setScale",I);ee&&ht.left>=0&&(O=lt=!0)}for(let I in V)V[I]=null}function Ht(g){let S=Xu(Je-1,0,rn-1),C=Xu(Qe+1,0,rn-1);for(;g[S]==null&&S>0;)S--;for(;g[C]==null&&C<rn-1;)C++;return[S,C]}function Se(){if(rn>0){let g=y.some(S=>S._focus)&&Ut!=ei.alpha;g&&(u.globalAlpha=Ut=ei.alpha),y.forEach((S,C)=>{if(C>0&&S.show&&(ue(C,!1),ue(C,!0),S._paths==null)){let I=Ut;Ut!=S.alpha&&(u.globalAlpha=Ut=S.alpha);let B=s==2?[0,t[C][0].length-1]:Ht(t[C]);S._paths=S.paths(n,C,B[0],B[1]),Ut!=I&&(u.globalAlpha=Ut=I)}}),y.forEach((S,C)=>{if(C>0&&S.show){let I=Ut;Ut!=S.alpha&&(u.globalAlpha=Ut=S.alpha),S._paths!=null&&En(C,!1);{let B=S._paths!=null?S._paths.gaps:null,q=S.points.show(n,C,Je,Qe,B),it=S.points.filter(n,C,q,B);(q||it)&&(S.points._paths=S.points.paths(n,C,Je,Qe,it),En(C,!0))}Ut!=I&&(u.globalAlpha=Ut=I),_n("drawSeries",C)}}),g&&(u.globalAlpha=Ut=1)}}function ue(g,S){let C=S?y[g].points:y[g];C._stroke=C.stroke(n,g),C._fill=C.fill(n,g)}function En(g,S){let C=S?y[g].points:y[g],{stroke:I,fill:B,clip:q,flags:it,_stroke:ct=C._stroke,_fill:gt=C._fill,_width:Rt=C.width}=C._paths;Rt=Fe(Rt*be,3);let Pt=null,Ft=Rt%2/2;S&&gt==null&&(gt=Rt>0?"#fff":ct);let Zt=C.pxAlign==1&&Ft>0;if(Zt&&u.translate(Ft,Ft),!S){let Ee=Bt-Rt/2,ge=ot-Rt/2,ae=pt+Rt,Wt=At+Rt;Pt=new Path2D,Pt.rect(Ee,ge,ae,Wt)}S?$i(ct,Rt,C.dash,C.cap,gt,I,B,it,q):vs(g,ct,Rt,C.dash,C.cap,gt,I,B,it,Pt,q),Zt&&u.translate(-Ft,-Ft)}function vs(g,S,C,I,B,q,it,ct,gt,Rt,Pt){let Ft=!1;gt!=0&&D.forEach((Zt,Ee)=>{if(Zt.series[0]==g){let ge=y[Zt.series[1]],ae=t[Zt.series[1]],Wt=(ge._paths||Ja).band;Ls(Wt)&&(Wt=Zt.dir==1?Wt[0]:Wt[1]);let Gt,Ve=null;ge.show&&Wt&&Ey(ae,Je,Qe)?(Ve=Zt.fill(n,Ee)||q,Gt=ge._paths.clip):Wt=null,$i(S,C,I,B,Ve,it,ct,gt,Rt,Pt,Gt,Wt),Ft=!0}}),Ft||$i(S,C,I,B,q,it,ct,gt,Rt,Pt)}const bn=ga|ju;function $i(g,S,C,I,B,q,it,ct,gt,Rt,Pt,Ft){ne(g,S,C,I,B),(gt||Rt||Ft)&&(u.save(),gt&&u.clip(gt),Rt&&u.clip(Rt)),Ft?(ct&bn)==bn?(u.clip(Ft),Pt&&u.clip(Pt),an(B,it),ye(g,q,S)):ct&ju?(an(B,it),u.clip(Ft),ye(g,q,S)):ct&ga&&(u.save(),u.clip(Ft),Pt&&u.clip(Pt),an(B,it),u.restore(),ye(g,q,S)):(an(B,it),ye(g,q,S)),(gt||Rt||Ft)&&u.restore()}function ye(g,S,C){C>0&&(S instanceof Map?S.forEach((I,B)=>{u.strokeStyle=J=B,u.stroke(I)}):S!=null&&g&&u.stroke(S))}function an(g,S){S instanceof Map?S.forEach((C,I)=>{u.fillStyle=$=I,u.fill(C)}):S!=null&&g&&u.fill(S)}function On(g,S,C,I){let B=R[g],q;if(I<=0)q=[0,0];else{let it=B._space=B.space(n,g,S,C,I),ct=B._incrs=B.incrs(n,g,S,C,I,it);q=WE(S,C,ct,I,it)}return B._found=q}function on(g,S,C,I,B,q,it,ct,gt,Rt){let Pt=it%2/2;M==1&&u.translate(Pt,Pt),ne(ct,it,gt,Rt,ct),u.beginPath();let Ft,Zt,Ee,ge,ae=B+(I==0||I==3?-q:q);C==0?(Zt=B,ge=ae):(Ft=B,Ee=ae);for(let Wt=0;Wt<g.length;Wt++)S[Wt]!=null&&(C==0?Ft=Ee=g[Wt]:Zt=ge=g[Wt],u.moveTo(Ft,Zt),u.lineTo(Ee,ge));u.stroke(),M==1&&u.translate(-Pt,-Pt)}function Tn(g){let S=!0;return R.forEach((C,I)=>{if(!C.show)return;let B=A[C.scale];if(B.min==null){C._show&&(S=!1,C._show=!1,br(!1));return}else C._show||(S=!1,C._show=!0,br(!1));let q=C.side,it=q%2,{min:ct,max:gt}=B,[Rt,Pt]=On(I,ct,gt,it==0?x:U);if(Pt==0)return;let Ft=B.distr==2,Zt=C._splits=C.splits(n,I,ct,gt,Rt,Pt,Ft),Ee=B.distr==2?Zt.map(Gt=>Wn[Gt]):Zt,ge=B.distr==2?Wn[Zt[1]]-Wn[Zt[0]]:Rt,ae=C._values=C.values(n,C.filter(n,Ee,I,Pt,ge),I,Pt,ge);C._rotate=q==2?C.rotate(n,ae,I,Pt):0;let Wt=C._size;C._size=li(C.size(n,ae,I,g)),Wt!=null&&C._size!=Wt&&(S=!1)}),S}function ya(g){let S=!0;return Sa.forEach((C,I)=>{let B=C(n,I,ni,g);B!=mi[I]&&(S=!1),mi[I]=B}),S}function Zi(){for(let g=0;g<R.length;g++){let S=R[g];if(!S.show||!S._show)continue;let C=S.side,I=C%2,B,q,it=S.stroke(n,g),ct=C==0||C==3?-1:1,[gt,Rt]=S._found;if(S.label!=null){let Dn=S.labelGap*ct,qn=cn((S._lpos+Dn)*be);Me(S.labelFont[0],it,"center",C==2?Ga:gd),u.save(),I==1?(B=q=0,u.translate(qn,cn(ot+At/2)),u.rotate((C==3?-rl:rl)/2)):(B=cn(Bt+pt/2),q=qn);let Ys=Qp(S.label)?S.label(n,g,gt,Rt):S.label;u.fillText(Ys,B,q),u.restore()}if(Rt==0)continue;let Pt=A[S.scale],Ft=I==0?pt:At,Zt=I==0?Bt:ot,Ee=S._splits,ge=Pt.distr==2?Ee.map(Dn=>Wn[Dn]):Ee,ae=Pt.distr==2?Wn[Ee[1]]-Wn[Ee[0]]:gt,Wt=S.ticks,Gt=S.border,Ve=Wt.show?Wt.size:0,qe=cn(Ve*be),xn=cn((S.alignTo==2?S._size-Ve-S.gap:S.gap)*be),Le=S._rotate*-rl/180,je=p(S._pos*be),Xn=(qe+xn)*ct,Pn=je+Xn;q=I==0?Pn:0,B=I==1?Pn:0;let ii=S.font[0],gi=S.align==1?Jr:S.align==2?Rc:Le>0?Jr:Le<0?Rc:I==0?"center":C==3?Rc:Jr,Di=Le||I==1?"middle":C==2?Ga:gd;Me(ii,it,gi,Di);let Yn=S.font[1]*S.lineGap,si=Ee.map(Dn=>p(o(Dn,Pt,Ft,Zt))),_i=S._values;for(let Dn=0;Dn<_i.length;Dn++){let qn=_i[Dn];if(qn!=null){I==0?B=si[Dn]:q=si[Dn],qn=""+qn;let Ys=qn.indexOf(`
`)==-1?[qn]:qn.split(/\n/gm);for(let Ln=0;Ln<Ys.length;Ln++){let Zh=Ys[Ln];Le?(u.save(),u.translate(B,q+Ln*Yn),u.rotate(Le),u.fillText(Zh,0,0),u.restore()):u.fillText(Zh,B,q+Ln*Yn)}}}Wt.show&&on(si,Wt.filter(n,ge,g,Rt,ae),I,C,je,qe,Fe(Wt.width*be,3),Wt.stroke(n,g),Wt.dash,Wt.cap);let Li=S.grid;Li.show&&on(si,Li.filter(n,ge,g,Rt,ae),I,I==0?2:1,I==0?ot:Bt,I==0?At:pt,Fe(Li.width*be,3),Li.stroke(n,g),Li.dash,Li.cap),Gt.show&&on([je],[1],I==0?1:0,I==0?1:2,I==1?ot:Bt,I==1?At:pt,Fe(Gt.width*be,3),Gt.stroke(n,g),Gt.dash,Gt.cap)}_n("drawAxes")}function br(g){y.forEach((S,C)=>{C>0&&(S._paths=null,g&&(s==1?(S.min=null,S.max=null):S.facets.forEach(I=>{I.min=null,I.max=null})))})}let vo=!1,Bl=!1,Ea=[];function Bm(){Bl=!1;for(let g=0;g<Ea.length;g++)_n(...Ea[g]);Ea.length=0}function Tr(){vo||(Oy(Ih),vo=!0)}function zm(g,S=!1){vo=!0,Bl=S,g(n),Ih(),S&&Ea.length>0&&queueMicrotask(Bm)}n.batch=zm;function Ih(){if(Ot&&(Ae(),Ot=!1),Kt&&(vt(),Kt=!1),xt){if(Xe(m,Jr,Z),Xe(m,Ga,nt),Xe(m,ja,x),Xe(m,Ka,U),Xe(v,Jr,Z),Xe(v,Ga,nt),Xe(v,ja,x),Xe(v,Ka,U),Xe(f,ja,Dt),Xe(f,Ka,P),h.width=cn(Dt*be),h.height=cn(P*be),R.forEach(({_el:g,_show:S,_size:C,_pos:I,side:B})=>{if(g!=null)if(S){let q=B===3||B===0?C:0,it=B%2==1;Xe(g,it?"left":"top",I-q),Xe(g,it?"width":"height",C),Xe(g,it?"top":"left",it?nt:Z),Xe(g,it?"height":"width",it?U:x),Vu(g,lr)}else $n(g,lr)}),J=$=Y=Ct=Et=It=zt=Vt=Mt=null,Ut=1,Aa(!0),Z!=tt||nt!=Nt||x!=mt||U!=Lt){br(!1);let g=x/mt,S=U/Lt;if(ee&&!O&&ht.left>=0){ht.left*=g,ht.top*=S,Ar&&Ni(Ar,cn(ht.left),0,x,U),wr&&Ni(wr,0,cn(ht.top),x,U);for(let C=0;C<Fn.length;C++){let I=Fn[C];I!=null&&(ji[C]*=g,Ki[C]*=S,Ni(I,li(ji[C]),li(Ki[C]),x,U))}}if(He.show&&!yt&&He.left>=0&&He.width>0){He.left*=g,He.width*=g,He.top*=S,He.height*=S;for(let C in Wl)Xe(Pr,C,He[C])}tt=Z,Nt=nt,mt=x,Lt=U}_n("setSize"),xt=!1}Dt>0&&P>0&&(u.clearRect(0,0,h.width,h.height),_n("drawClear"),k.forEach(g=>g()),_n("draw")),He.show&&yt&&(Mo(He),yt=!1),ee&&O&&(Xs(null,!0,!1),O=!1),St.show&&St.live&&lt&&(Hl(),lt=!1),l||(l=!0,n.status=1,_n("ready")),Vs=!1,vo=!1}n.redraw=(g,S)=>{Kt=S||!1,g!==!1?Ss(w,L.min,L.max):Tr()};function zl(g,S){let C=A[g];if(C.from==null){if(rn==0){let I=C.range(n,S.min,S.max,g);S.min=I[0],S.max=I[1]}if(S.min>S.max){let I=S.min;S.min=S.max,S.max=I}if(rn>1&&S.min!=null&&S.max!=null&&S.max-S.min<1e-16)return;g==w&&C.distr==2&&rn>0&&(S.min=yi(S.min,t[0]),S.max=yi(S.max,t[0]),S.min==S.max&&S.max++),V[g]=S,Ot=!0,Tr()}}n.setScale=zl;let Gl,kl,Ar,wr,Uh,Nh,Rr,Cr,Fh,Oh,ke,Ye,Ms=!1;const Mn=ht.drag;let mn=Mn.x,gn=Mn.y;ee&&(ht.x&&(Gl=ai(oy,v)),ht.y&&(kl=ai(ly,v)),L.ori==0?(Ar=Gl,wr=kl):(Ar=kl,wr=Gl),ke=ht.left,Ye=ht.top);const He=n.select=nn({show:!0,over:!0,left:0,width:0,top:0,height:0},i.select),Pr=He.show?ai(ay,He.over?v:m):null;function Mo(g,S){if(He.show){for(let C in g)He[C]=g[C],C in Wl&&Xe(Pr,C,g[C]);S!==!1&&_n("setSelect")}}n.setSelect=Mo;function Gm(g){if(y[g].show)Qt&&Vu(_t[g],lr);else if(Qt&&$n(_t[g],lr),ee){let C=Ai?Fn[0]:Fn[g];C!=null&&Ni(C,-10,-10,x,U)}}function Ss(g,S,C){zl(g,{min:S,max:C})}function Ci(g,S,C,I){S.focus!=null&&Xm(g),S.show!=null&&y.forEach((B,q)=>{q>0&&(g==q||g==null)&&(B.show=S.show,Gm(q),s==2?(Ss(B.facets[0].scale,null,null),Ss(B.facets[1].scale,null,null)):Ss(B.scale,null,null),Tr())}),C!==!1&&_n("setSeries",g,S),I&&wa("setSeries",n,g,S)}n.setSeries=Ci;function km(g,S){nn(D[g],S)}function Hm(g,S){g.fill=ce(g.fill||null),g.dir=xe(g.dir,-1),S=S??D.length,D.splice(S,0,g)}function Vm(g){g==null?D.length=0:D.splice(g,1)}n.addBand=Hm,n.setBand=km,n.delBand=Vm;function Wm(g,S){y[g].alpha=S,ee&&Fn[g]!=null&&(Fn[g].style.opacity=S),Qt&&_t[g]&&(_t[g].style.opacity=S)}let Ji,ys,Ws;const Dr={focus:!0};function Xm(g){if(g!=Ws){let S=g==null,C=ei.alpha!=1;y.forEach((I,B)=>{if(s==1||B>0){let q=S||B==0||B==g;I._focus=S?null:q,C&&Wm(B,q?1:ei.alpha)}}),Ws=g,C&&Tr()}}Qt&&qi&&jt(Md,et,g=>{ht._lock||(pn(g),Ws!=null&&Ci(null,Dr,!0,tn.setSeries))});function Pi(g,S,C){let I=A[S];C&&(g=g/be-(I.ori==1?nt:Z));let B=x;I.ori==1&&(B=U,g=B-g),I.dir==-1&&(g=B-g);let q=I._min,it=I._max,ct=g/B,gt=q+(it-q)*ct,Rt=I.distr;return Rt==3?da(10,gt):Rt==4?Ty(gt,I.asinh):Rt==100?I.bwd(gt):gt}function Ym(g,S){let C=Pi(g,w,S);return yi(C,t[0],Je,Qe)}n.valToIdx=g=>yi(g,t[0]),n.posToIdx=Ym,n.posToVal=Pi,n.valToPos=(g,S,C)=>A[S].ori==0?r(g,A[S],C?pt:x,C?Bt:0):a(g,A[S],C?At:U,C?ot:0),n.setCursor=(g,S,C)=>{ke=g.left,Ye=g.top,Xs(null,S,C)};function Bh(g,S){Xe(Pr,Jr,He.left=g),Xe(Pr,ja,He.width=S)}function zh(g,S){Xe(Pr,Ga,He.top=g),Xe(Pr,Ka,He.height=S)}let ba=L.ori==0?Bh:zh,Ta=L.ori==1?Bh:zh;function qm(){if(Qt&&St.live)for(let g=s==2?1:0;g<y.length;g++){if(g==0&&Yt)continue;let S=St.values[g],C=0;for(let I in S)te[g][C++].firstChild.nodeValue=S[I]}}function Hl(g,S){if(g!=null&&(g.idxs?g.idxs.forEach((C,I)=>{ut[I]=C}):Cy(g.idx)||ut.fill(g.idx),St.idx=ut[0]),Qt&&St.live){for(let C=0;C<y.length;C++)(C>0||s==1&&!Yt)&&jm(C,ut[C]);qm()}lt=!1,S!==!1&&_n("setLegend")}n.setLegend=Hl;function jm(g,S){let C=y[g],I=g==0&&W==2?Wn:t[g],B;Yt?B=C.values(n,g,S)??re:(B=C.value(n,S==null?null:I[S],g,S),B=B==null?re:{_:B}),St.values[g]=B}function Xs(g,S,C){Fh=ke,Oh=Ye,[ke,Ye]=ht.move(n,ke,Ye),ht.left=ke,ht.top=Ye,ee&&(Ar&&Ni(Ar,cn(ke),0,x,U),wr&&Ni(wr,0,cn(Ye),x,U));let I,B=Je>Qe;Ji=Ne,ys=null;let q=L.ori==0?x:U,it=L.ori==1?x:U;if(ke<0||rn==0||B){I=ht.idx=null;for(let ct=0;ct<y.length;ct++){let gt=Fn[ct];gt!=null&&Ni(gt,-10,-10,x,U)}qi&&Ci(null,Dr,!0,g==null&&tn.setSeries),St.live&&(ut.fill(I),lt=!0)}else{let ct,gt,Rt;s==1&&(ct=L.ori==0?ke:Ye,gt=Pi(ct,w),I=ht.idx=yi(gt,t[0],Je,Qe),Rt=z(t[0][I],L,q,0));let Pt=-10,Ft=-10,Zt=0,Ee=0,ge=!0,ae="",Wt="";for(let Gt=s==2?1:0;Gt<y.length;Gt++){let Ve=y[Gt],qe=ut[Gt],xn=qe==null?null:s==1?t[Gt][qe]:t[Gt][1][qe],Le=ht.dataIdx(n,Gt,I,gt),je=Le==null?null:s==1?t[Gt][Le]:t[Gt][1][Le];if(lt=lt||je!=xn||Le!=qe,ut[Gt]=Le,Gt>0&&Ve.show){let Xn=Le==null?-10:Le==I?Rt:z(s==1?t[0][Le]:t[Gt][0][Le],L,q,0),Pn=je==null?-10:K(je,s==1?A[Ve.scale]:A[Ve.facets[1].scale],it,0);if(qi&&je!=null){let ii=L.ori==1?ke:Ye,gi=un(ei.dist(n,Gt,Le,Pn,ii));if(gi<Ji){let Di=ei.bias;if(Di!=0){let Yn=Pi(ii,Ve.scale),si=je>=0?1:-1,_i=Yn>=0?1:-1;_i==si&&(_i==1?Di==1?je>=Yn:je<=Yn:Di==1?je<=Yn:je>=Yn)&&(Ji=gi,ys=Gt)}else Ji=gi,ys=Gt}}if(lt||Ai){let ii,gi;L.ori==0?(ii=Xn,gi=Pn):(ii=Pn,gi=Xn);let Di,Yn,si,_i,Li,Dn,qn=!0,Ys=Be.bbox;if(Ys!=null){qn=!1;let Ln=Ys(n,Gt);si=Ln.left,_i=Ln.top,Di=Ln.width,Yn=Ln.height}else si=ii,_i=gi,Di=Yn=Be.size(n,Gt);if(Dn=Be.fill(n,Gt),Li=Be.stroke(n,Gt),Ai)Gt==ys&&Ji<=ei.prox&&(Pt=si,Ft=_i,Zt=Di,Ee=Yn,ge=qn,ae=Dn,Wt=Li);else{let Ln=Fn[Gt];Ln!=null&&(ji[Gt]=si,Ki[Gt]=_i,wd(Ln,Di,Yn,qn),Td(Ln,Dn,Li),Ni(Ln,li(si),li(_i),x,U))}}}}if(Ai){let Gt=ei.prox,Ve=Ws==null?Ji<=Gt:Ji>Gt||ys!=Ws;if(lt||Ve){let qe=Fn[0];qe!=null&&(ji[0]=Pt,Ki[0]=Ft,wd(qe,Zt,Ee,ge),Td(qe,ae,Wt),Ni(qe,li(Pt),li(Ft),x,U))}}}if(He.show&&Ms)if(g!=null){let[ct,gt]=tn.scales,[Rt,Pt]=tn.match,[Ft,Zt]=g.cursor.sync.scales,Ee=g.cursor.drag;if(mn=Ee._x,gn=Ee._y,mn||gn){let{left:ge,top:ae,width:Wt,height:Gt}=g.select,Ve=g.scales[Ft].ori,qe=g.posToVal,xn,Le,je,Xn,Pn,ii=ct!=null&&Rt(ct,Ft),gi=gt!=null&&Pt(gt,Zt);ii&&mn?(Ve==0?(xn=ge,Le=Wt):(xn=ae,Le=Gt),je=A[ct],Xn=z(qe(xn,Ft),je,q,0),Pn=z(qe(xn+Le,Ft),je,q,0),ba(bi(Xn,Pn),un(Pn-Xn))):ba(0,q),gi&&gn?(Ve==1?(xn=ge,Le=Wt):(xn=ae,Le=Gt),je=A[gt],Xn=K(qe(xn,Zt),je,it,0),Pn=K(qe(xn+Le,Zt),je,it,0),Ta(bi(Xn,Pn),un(Pn-Xn))):Ta(0,it)}else Xl()}else{let ct=un(Fh-Uh),gt=un(Oh-Nh);if(L.ori==1){let Zt=ct;ct=gt,gt=Zt}mn=Mn.x&&ct>=Mn.dist,gn=Mn.y&&gt>=Mn.dist;let Rt=Mn.uni;Rt!=null?mn&&gn&&(mn=ct>=Rt,gn=gt>=Rt,!mn&&!gn&&(gt>ct?gn=!0:mn=!0)):Mn.x&&Mn.y&&(mn||gn)&&(mn=gn=!0);let Pt,Ft;mn&&(L.ori==0?(Pt=Rr,Ft=ke):(Pt=Cr,Ft=Ye),ba(bi(Pt,Ft),un(Ft-Pt)),gn||Ta(0,it)),gn&&(L.ori==1?(Pt=Rr,Ft=ke):(Pt=Cr,Ft=Ye),Ta(bi(Pt,Ft),un(Ft-Pt)),mn||ba(0,q)),!mn&&!gn&&(ba(0,0),Ta(0,0))}if(Mn._x=mn,Mn._y=gn,g==null){if(C){if($h!=null){let[ct,gt]=tn.scales;tn.values[0]=ct!=null?Pi(L.ori==0?ke:Ye,ct):null,tn.values[1]=gt!=null?Pi(L.ori==1?ke:Ye,gt):null}wa(Cc,n,ke,Ye,x,U,I)}if(qi){let ct=C&&tn.setSeries,gt=ei.prox;Ws==null?Ji<=gt&&Ci(ys,Dr,!0,ct):Ji>gt?Ci(null,Dr,!0,ct):ys!=Ws&&Ci(ys,Dr,!0,ct)}}lt&&(St.idx=I,Hl()),S!==!1&&_n("setCursor")}let Es=null;Object.defineProperty(n,"rect",{get(){return Es==null&&Aa(!1),Es}});function Aa(g=!1){g?Es=null:(Es=v.getBoundingClientRect(),_n("syncRect",Es))}function Gh(g,S,C,I,B,q,it){ht._lock||Ms&&g!=null&&g.movementX==0&&g.movementY==0||(Vl(g,S,C,I,B,q,it,!1,g!=null),g!=null?Xs(null,!0,!0):Xs(S,!0,!1))}function Vl(g,S,C,I,B,q,it,ct,gt){if(Es==null&&Aa(!1),pn(g),g!=null)C=g.clientX-Es.left,I=g.clientY-Es.top;else{if(C<0||I<0){ke=-10,Ye=-10;return}let[Rt,Pt]=tn.scales,Ft=S.cursor.sync,[Zt,Ee]=Ft.values,[ge,ae]=Ft.scales,[Wt,Gt]=tn.match,Ve=S.axes[0].side%2==1,qe=L.ori==0?x:U,xn=L.ori==1?x:U,Le=Ve?q:B,je=Ve?B:q,Xn=Ve?I:C,Pn=Ve?C:I;if(ge!=null?C=Wt(Rt,ge)?o(Zt,A[Rt],qe,0):-10:C=qe*(Xn/Le),ae!=null?I=Gt(Pt,ae)?o(Ee,A[Pt],xn,0):-10:I=xn*(Pn/je),L.ori==1){let ii=C;C=I,I=ii}}gt&&(S==null||S.cursor.event.type==Cc)&&((C<=1||C>=x-1)&&(C=nr(C,x)),(I<=1||I>=U-1)&&(I=nr(I,U))),ct?(Uh=C,Nh=I,[Rr,Cr]=ht.move(n,C,I)):(ke=C,Ye=I)}const Wl={width:0,height:0,left:0,top:0};function Xl(){Mo(Wl,!1)}let kh,Hh,Vh,Wh;function Xh(g,S,C,I,B,q,it){Ms=!0,mn=gn=Mn._x=Mn._y=!1,Vl(g,S,C,I,B,q,it,!0,!1),g!=null&&(jt(Pc,ku,Yh,!1),wa(xd,n,Rr,Cr,x,U,null));let{left:ct,top:gt,width:Rt,height:Pt}=He;kh=ct,Hh=gt,Vh=Rt,Wh=Pt}function Yh(g,S,C,I,B,q,it){Ms=Mn._x=Mn._y=!1,Vl(g,S,C,I,B,q,it,!1,!0);let{left:ct,top:gt,width:Rt,height:Pt}=He,Ft=Rt>0||Pt>0,Zt=kh!=ct||Hh!=gt||Vh!=Rt||Wh!=Pt;if(Ft&&Zt&&Mo(He),Mn.setScale&&Ft&&Zt){let Ee=ct,ge=Rt,ae=gt,Wt=Pt;if(L.ori==1&&(Ee=gt,ge=Pt,ae=ct,Wt=Rt),mn&&Ss(w,Pi(Ee,w),Pi(Ee+ge,w)),gn)for(let Gt in A){let Ve=A[Gt];Gt!=w&&Ve.from==null&&Ve.min!=Ne&&Ss(Gt,Pi(ae+Wt,Gt),Pi(ae,Gt))}Xl()}else ht.lock&&(ht._lock=!ht._lock,Xs(S,!0,g!=null));g!=null&&(pe(Pc,ku),wa(Pc,n,ke,Ye,x,U,null))}function Km(g,S,C,I,B,q,it){if(ht._lock)return;pn(g);let ct=Ms;if(Ms){let gt=!0,Rt=!0,Pt=10,Ft,Zt;L.ori==0?(Ft=mn,Zt=gn):(Ft=gn,Zt=mn),Ft&&Zt&&(gt=ke<=Pt||ke>=x-Pt,Rt=Ye<=Pt||Ye>=U-Pt),Ft&&gt&&(ke=ke<Rr?0:x),Zt&&Rt&&(Ye=Ye<Cr?0:U),Xs(null,!0,!0),Ms=!1}ke=-10,Ye=-10,ut.fill(null),Xs(null,!0,!0),ct&&(Ms=ct)}function qh(g,S,C,I,B,q,it){ht._lock||(pn(g),H(),Xl(),g!=null&&wa(Sd,n,ke,Ye,x,U,null))}function jh(){R.forEach(XE),wt(n.width,n.height,!0)}mr(gl,sa,jh);const Lr={};Lr.mousedown=Xh,Lr.mousemove=Gh,Lr.mouseup=Yh,Lr.dblclick=qh,Lr.setSeries=(g,S,C,I)=>{let B=tn.match[2];C=B(n,S,C),C!=-1&&Ci(C,I,!0,!1)},ee&&(jt(xd,v,Xh),jt(Cc,v,Gh),jt(vd,v,g=>{pn(g),Aa(!1)}),jt(Md,v,Km),jt(Sd,v,qh),Ku.add(n),n.syncRect=Aa);const So=n.hooks=i.hooks||{};function _n(g,S,C){Bl?Ea.push([g,S,C]):g in So&&So[g].forEach(I=>{I.call(null,n,S,C)})}(i.plugins||[]).forEach(g=>{for(let S in g.hooks)So[S]=(So[S]||[]).concat(g.hooks[S])});const Kh=(g,S,C)=>C,tn=nn({key:null,setSeries:!1,filters:{pub:Ld,sub:Ld},scales:[w,y[1]?y[1].scale:null],match:[Id,Id,Kh],values:[null,null]},ht.sync);tn.match.length==2&&tn.match.push(Kh),ht.sync=tn;const $h=tn.key,Yl=Em($h);function wa(g,S,C,I,B,q,it){tn.filters.pub(g,S,C,I,B,q,it)&&Yl.pub(g,S,C,I,B,q,it)}Yl.sub(n);function $m(g,S,C,I,B,q,it){tn.filters.sub(g,S,C,I,B,q,it)&&Lr[g](null,S,C,I,B,q,it)}n.pub=$m;function Zm(){Yl.unsub(n),Ku.delete(n),Pe.clear(),Wu(gl,sa,jh),c.remove(),et?.remove(),_n("destroy")}n.destroy=Zm;function ql(){_n("init",i,t),b(t||i.data,!1),V[w]?zl(w,V[w]):H(),yt=He.show&&(He.width>0||He.height>0),O=lt=!0,wt(i.width,i.height)}return y.forEach(yr),R.forEach(xo),e?e instanceof HTMLElement?(e.appendChild(c),ql()):e(n,ql):ql(),n}Ze.assign=nn;Ze.fmtNum=bh;Ze.rangeNum=_l;Ze.rangeLog=Cl;Ze.rangeAsinh=yh;Ze.orient=Sr;Ze.pxRatio=be;Ze.join=Fy;Ze.fmtDate=Ah,Ze.tzDate=qy;Ze.sync=Em;{Ze.addGap=CE,Ze.clipGaps=Ll;let i=Ze.paths={points:Cm};i.linear=Dm,i.stepped=LE,i.bars=IE,i.spline=NE}function lo(i){const t=Math.abs(i);return t>=1e9?(i/1e9).toFixed(1).replace(/\.0$/,"")+"B":t>=1e6?(i/1e6).toFixed(1).replace(/\.0$/,"")+"M":t>=1e3?(i/1e3).toFixed(1).replace(/\.0$/,"")+"K":t<1&&t>0?i.toFixed(4):i.toFixed(0)}function mo(){return{hooks:{setLegend:i=>{if(i.cursor.idx!=null)return;const t=i.data[0].length-1;t<0||i.setLegend({idx:t},!1)}}}}let Bs=null,zs=null,Gs=null,ks=null,Hs=null,os=[[],[],[],[],[]],hr=[[],[],[]],fr=[[],[],[],[]],ra=[[],[],[],[]],gr=[[],[],[]];function Nm(i){const t=[i[0],[],[],[],i[4]];for(let e=0;e<i[0].length;e++){const n=i[1][e]||0,s=i[2][e]||0,r=i[3][e]||0;t[1][e]=n,t[2][e]=n+s,t[3][e]=n+s+r}return t}function YE(i){const t={width:i.clientWidth||300,height:150,scales:{x:{time:!1},y:{auto:!0},pop:{auto:!0}},legend:{show:!0,live:!0},axes:[{show:!0,size:16,font:"10px sans-serif",gap:4,ticks:{show:!1}},{scale:"y",size:32,font:"10px sans-serif",side:3,gap:2,ticks:{show:!1},values:(e,n)=>n.map(lo)},{scale:"pop",size:32,font:"10px sans-serif",side:1,gap:2,ticks:{show:!1},values:(e,n)=>n.map(lo)}],series:[{},{label:"Red",stroke:"rgb(200, 0, 0)",fill:"rgba(255, 80, 80, 0.8)",scale:"y",width:1,points:{show:!1}},{label:"Green",stroke:"rgb(0, 180, 0)",scale:"y",width:1,points:{show:!1}},{label:"Blue",stroke:"rgb(0, 0, 200)",scale:"y",width:1,points:{show:!1}},{label:"Pop",stroke:"rgb(50, 50, 50)",scale:"pop",width:2,points:{show:!1}}],bands:[{series:[2,1],fill:"rgba(80, 220, 80, 0.8)"},{series:[3,2],fill:"rgba(80, 80, 255, 0.8)"}]};return Bs=new Ze({...t,plugins:[mo()]},os,i),Bs}function qE(i){const t={width:i.clientWidth||300,height:150,scales:{x:{time:!1},desc:{auto:!0},eat:{auto:!0}},legend:{show:!0,live:!0},axes:[{show:!0,size:16,font:"10px sans-serif",gap:4,ticks:{show:!1}},{scale:"desc",size:32,font:"10px sans-serif",gap:2,ticks:{show:!1},side:3,values:(e,n)=>n.map(lo)},{scale:"eat",size:32,font:"10px sans-serif",gap:2,ticks:{show:!1},side:1,values:(e,n)=>n}],series:[{},{label:"Avg Children",stroke:"rgb(50, 50, 50)",scale:"desc",width:1,points:{show:!1}},{label:"R Eat Efficiency",stroke:"rgb(0, 196, 0)",scale:"eat",width:1,points:{show:!1}}]};return zs=new Ze({...t,plugins:[mo()]},hr,i),zs}function jE(i){const t={width:i.clientWidth||300,height:150,scales:{x:{time:!1},life:{auto:!0},eff:{auto:!0}},legend:{show:!0,live:!0},axes:[{show:!0,size:16,font:"10px sans-serif",gap:4,ticks:{show:!1}},{scale:"life",size:32,font:"10px sans-serif",gap:2,ticks:{show:!1},side:3,values:(e,n)=>n.map(lo)},{scale:"eff",size:32,font:"10px sans-serif",gap:2,ticks:{show:!1},side:1,values:(e,n)=>n.map(s=>s.toFixed(2))}],series:[{},{label:"Avg Living",stroke:"rgb(220, 60, 60)",scale:"life",width:1,points:{show:!1}},{label:"Energy Efficiency",stroke:"rgb(255, 180, 0)",scale:"eff",width:1,points:{show:!1}}]};return Gs=new Ze({...t,plugins:[mo()]},fr,i),Gs}function KE(i){const t={width:i.clientWidth||300,height:150,scales:{x:{time:!1},y:{auto:!0}},legend:{show:!0,live:!0},axes:[{show:!0,size:16,font:"10px sans-serif",gap:4,ticks:{show:!1}},{scale:"y",size:32,font:"10px sans-serif",gap:2,ticks:{show:!1},side:1,values:(e,n)=>n.map(s=>s.toFixed(4))}],series:[{},{label:"Mut Rate",stroke:"rgb(255, 140, 0)",scale:"y",width:1,points:{show:!1}}]};return ks=new Ze({...t,plugins:[mo()]},ra,i),ks}function $E(i){const t=Ze.paths.bars({size:[.6,64],align:0,gap:2}),e={width:i.clientWidth||300,height:150,scales:{x:{time:!1},y:{auto:!0}},legend:{show:!0,live:!0},axes:[{show:!0,size:16,font:"10px sans-serif",gap:4,ticks:{show:!1},values:(n,s)=>s.map(r=>String(Math.round(r)))},{scale:"y",size:32,font:"10px sans-serif",side:3,gap:2,ticks:{show:!1},values:(n,s)=>s.map(lo)}],series:[{},{label:"Living",stroke:"rgb(0, 180, 0)",fill:"rgba(60, 200, 60, 0.8)",scale:"y",width:0,paths:t,points:{show:!1},value:(n,s,r,a)=>{if(a==null)return"--";const o=gr[1][a]||0,l=gr[2][a]||0;return String(o-l)}},{label:"Deceased",stroke:"rgb(200, 0, 0)",fill:"rgba(220, 60, 60, 0.8)",scale:"y",width:0,paths:t,points:{show:!1}}]};return Hs=new Ze({...e,plugins:[mo()]},gr,i),Hs}function ZE(){os=[[],[],[],[],[]],hr=[[],[],[]],fr=[[],[],[],[]],ra=[[],[],[],[]],Bs&&Bs.setData(Nm(os)),zs&&zs.setData(hr),Gs&&Gs.setData(fr),ks&&ks.setData(ra),gr=[[],[],[]],Hs&&Hs.setData(gr)}function Zu(){const i=document.getElementById("foodPopChart"),t=document.getElementById("optimizationChart"),e=document.getElementById("lifespanChart"),n=document.getElementById("mutationStratChart");Bs&&i&&Bs.setSize({width:i.clientWidth,height:150}),zs&&t&&zs.setSize({width:t.clientWidth,height:150}),Gs&&e&&Gs.setSize({width:e.clientWidth,height:150}),ks&&n&&ks.setSize({width:n.clientWidth,height:150});const s=document.getElementById("genDemoChart");Hs&&s&&Hs.setSize({width:s.clientWidth,height:150})}const JE={update(){_.history.avePosNRG.push(_.stats.avePosNRG);let i=0,t=0,e=0,n=0;if(_.stats.livePop!==0){for(let d=0;d<=_.HIGHESTINDEX;d++){const y=_.amoebs[d];y.status==="alive"&&(_.stats.netEatenRatio+=(y.redEaten+y.greenEaten+y.blueEaten)/y.netEaten,i+=y.descendants,t+=y.children.length,e+=_.stats.time-y.born,y.totalEnergyCost>0&&(n+=y.totalEnergyGain/y.totalEnergyCost))}_.stats.netEatenRatio/=_.stats.livePop}else _.stats.netEatenRatio=0;_.stats.aveChildren=_.stats.livePop>0?t/_.stats.livePop:0,_.history.aveChildren.push(_.stats.aveChildren),_.stats.aveChildren>_.stats.maxAveChildren&&(_.stats.maxAveChildren=_.stats.aveChildren);let s=0;for(let d=0;d<dr;d++)_.pause||(_.stats.redAgarOnMap+=_.tiles[d].R,_.stats.greenAgarOnMap+=_.tiles[d].G,_.stats.blueAgarOnMap+=_.tiles[d].B,s+=_.tiles[d].RCap+_.tiles[d].GCap+_.tiles[d].BCap);const r=_.stats.time/100;os[0].push(r),os[1].push(_.stats.redAgarOnMap),os[2].push(_.stats.greenAgarOnMap),os[3].push(_.stats.blueAgarOnMap),os[4].push(_.stats.livePop),Bs&&Bs.setData(Nm(os));const a=_.stats.redAgarOnMap+_.stats.greenAgarOnMap+_.stats.blueAgarOnMap,o=s>0?a/s:1,l=o>0?_.stats.netEatenRatio/o:0;hr[0].push(r),hr[1].push(_.stats.aveChildren),hr[2].push(l),zs&&zs.setData(hr);const c=_.stats.livePop>0?e/_.stats.livePop:0,h=_.stats.livePop>0?n/_.stats.livePop:0;fr[0].push(r),fr[1].push(c),fr[2].push(h),Gs&&Gs.setData(fr),_.stats.livePop,ra[0].push(r),ra[1].push(nh),ks&&ks.setData(ra);const u=new Map,f=new Map;for(let d=0;d<=_.HIGHESTINDEX;d++){const y=_.amoebs[d];y!=null&&y.status==="alive"&&u.set(y.gen,(u.get(y.gen)||0)+1)}for(let d=0;d<_.graveyard.length;d++){const y=_.graveyard[d];f.set(y.gen,(f.get(y.gen)||0)+1)}let m=0;for(const d of u.keys())d>m&&(m=d);for(const d of f.keys())d>m&&(m=d);const v=[],M=[],p=[];for(let d=0;d<=m;d++){const y=f.get(d)||0,R=u.get(d)||0;v.push(d),M.push(y),p.push(y+R)}gr=[v,p,M],Hs&&Hs.setData(gr),_.stats.netEatenRatio=0,_.stats.redAgarOnMap=0,_.stats.greenAgarOnMap=0,_.stats.blueAgarOnMap=0,_.stats.mitoses=0,_.stats.advWeight=0,_.stats.disWeight=0,_.stats.avePosNRG>_.stats.maxAvePosNRG&&(_.stats.maxAvePosNRG=_.stats.avePosNRG)}};let Ju=null;function QE(){Ju=document.getElementById("dash-live-info")}const tb={update(){const i=_.ctx.map;if(i){if(_.mouse.overMap)if(_.mouse.rightPressed){if(_.stats.livePop<Qa){let t=0;for(;_.amoebs[t]!=null&&_.amoebs[t].status!=="dead";)t++;_.amoebs[t]=new po(fe(_.mouse.x),fe(_.mouse.y),t),_.newest=t,_.stats.livePop++,t>_.HIGHESTINDEX&&(_.HIGHESTINDEX=t),Ju&&(Ju.innerHTML="LIVE: "+_.stats.livePop+"     DEAD: "+_.graveyard.length)}_.mouse.rightPressed=!1}else if(_.mouse.leftPressed){if(!_.canvas.dragging)_.canvas.dragging=!0;else{const t=_.mouse.x-_.mouse.prevX,e=_.mouse.y-_.mouse.prevY;i.translate(t,e),_.canvas.dragOffsetX+=t*_.canvas.scale,_.canvas.dragOffsetY+=e*_.canvas.scale}_.mouse.prevX=_.mouse.x,_.mouse.prevY=_.mouse.y}else _.canvas.dragging&&(_.canvas.dragging=!1,_.mouse.originalX+=_.canvas.dragOffsetX,_.mouse.originalY+=_.canvas.dragOffsetY,_.mouse.x+=_.canvas.dragOffsetX,_.mouse.y+=_.canvas.dragOffsetY,_.canvas.dragOffsetX=0,_.canvas.dragOffsetY=0);for(const t in _.keysPressed)(t==="a"||t==="ArrowLeft")&&_.keysPressed[t]&&(_.leftAccel+=2,_.mouse.x-=_.leftAccel,_.mouse.originalX+=_.leftAccel*_.canvas.scale,i.translate(_.leftAccel,0)),(t==="w"||t==="ArrowUp")&&_.keysPressed[t]&&(_.upAccel+=2,_.mouse.y-=_.upAccel,_.mouse.originalY+=_.upAccel*_.canvas.scale,i.translate(0,_.upAccel)),(t==="s"||t==="ArrowDown")&&_.keysPressed[t]&&(_.downAccel+=2,_.mouse.y+=_.downAccel,_.mouse.originalY-=_.downAccel*_.canvas.scale,i.translate(0,-_.downAccel)),(t==="d"||t==="ArrowRight")&&_.keysPressed[t]&&(_.rightAccel+=2,_.mouse.x+=_.rightAccel,_.mouse.originalX-=_.rightAccel*_.canvas.scale,i.translate(-_.rightAccel,0))}}};function eb(i,t){const e=t.getBoundingClientRect();let n=i.clientX/e.right*t.width,s=i.clientY/e.bottom*t.height;return n-=_.mouse.originalX,s-=_.mouse.originalY,n/=_.canvas.scale,s/=_.canvas.scale,{x:n,y:s}}function Ha(i,t,e){const n=eb(t,e);_.mouse.x=n.x,_.mouse.y=n.y,i==="down"&&(t.button===0?_.mouse.leftPressed=!0:t.button===2&&(_.mouse.rightPressed=!0)),(i==="up"||i==="out")&&(t.button===0?_.mouse.leftPressed=!1:t.button===2&&(_.mouse.rightPressed=!1))}function nb(i,t){i.preventDefault();const e=_.ctx.map;if(!e)return;let n=i.wheelDelta||-i.deltaY;n>20?n=20:n<-20&&(n=-20);const s=1+n/400;_.mouse.originalX+=(_.mouse.x-_.mouse.x*s)*_.canvas.scale,_.mouse.originalY+=(_.mouse.y-_.mouse.y*s)*_.canvas.scale,e.translate(_.mouse.x,_.mouse.y),e.scale(s,s),e.translate(-_.mouse.x,-_.mouse.y);const r=t.getBoundingClientRect();let a=(i.clientX-r.left)/(r.right-r.left)*t.width,o=(i.clientY-r.top)/(r.bottom-r.top)*t.height;a-=_.mouse.originalX,o-=_.mouse.originalY,_.canvas.scale*=s,_.mouse.x=a/_.canvas.scale,_.mouse.y=o/_.canvas.scale}function ib(i,t){["w","a","s","d","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","Escape"].includes(i.key)&&(i.preventDefault(),_.keysPressed[i.key]=!0,i.key===" "&&t(),i.key==="Escape"&&(_.tracking=null))}function sb(i){["w","a","s","d","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","Escape"].includes(i.key)&&(i.preventDefault(),_.keysPressed[i.key]=!1,i.key==="a"||i.key==="ArrowLeft"?_.leftAccel=0:i.key==="w"||i.key==="ArrowUp"?_.upAccel=0:i.key==="s"||i.key==="ArrowDown"?_.downAccel=0:(i.key==="d"||i.key==="ArrowRight")&&(_.rightAccel=0))}let al=null,Qu=null;function rb(){al=document.getElementById("dash-newest"),Qu=document.getElementById("dash-time")}const ab={setup(){},update(){if(_.newest!==null&&al)if(_.newest<0){const i=_.graveyard[-(_.newest+1)];al.innerHTML="NEW: "+i.name+"-"+i.gen+"D"+i.descendants}else{const i=_.amoebs[_.newest];al.innerHTML="NEW: "+i.name+"-"+i.gen+"A"+i.descendants}Qu&&(Qu.innerHTML="TIME: "+_.stats.time),_.highlighted!==null&&(_.highlighted<0?_.graveyard[-(_.highlighted+1)].highlight():_.amoebs[_.highlighted].highlight())}};let ep=performance.now(),Nc=0,np=0,th=null;function ob(i){th=i}function lb(){Nc++;const i=performance.now(),t=i-ep;t>=500&&(np=Nc/t*1e3,Nc=0,ep=i,th&&(th.textContent=`${np|0} FPS`))}function vl(i){const t={};for(const e of Object.keys(i)){const n=i[e];n instanceof Float32Array||n instanceof Uint8ClampedArray?t[e]=Array.from(n):Array.isArray(n)?t[e]=n.map(s=>s!==null&&typeof s=="object"&&!(s instanceof Float32Array)?vl(s):s):n!==null&&typeof n=="object"?t[e]=vl(n):t[e]=n}return t}function Fl(i,t){for(const e of Object.keys(t)){if(!(e in i))continue;const n=t[e],s=i[e];s instanceof Float32Array?i[e]=new Float32Array(n):s instanceof Uint8ClampedArray?i[e]=new Uint8ClampedArray(n):Array.isArray(n)&&Array.isArray(s)?i[e]=[...n]:i[e]=n}}function ip(i){const t=new Zo;return t.weights1=new Float32Array(i.weights1||[]),t.weights2=new Float32Array(i.weights2||[]),t.in=i.in??0,t.out=i.out??0,t}function cb(i){const t=new Oc(i.x,i.y);return Fl(t,i),t}function ub(i){const t=new Bc(i.x,i.y);return Fl(t,i),t}function hb(i){return vl(i)}function fb(i){const t=new cp(i.x,i.y,i.num,i.neighbors||[]);return Fl(t,i),t}function sp(i){return vl(i)}function rp(i){const t=new po(i.x,i.y,i.index);return Fl(t,i),t.eyes=(i.eyes||[]).map(cb),t.mouth=ub(i.mouth),t.inputs=(i.inputs||[]).map(ip),t.outputs=(i.outputs||[]).map(ip),t}function db(){const i={version:1,timestamp:Date.now(),stats:{..._.stats},history:{aveChildren:[..._.history.aveChildren],avePosNRG:[..._.history.avePosNRG]},HIGHESTINDEX:_.HIGHESTINDEX,highlighted:_.highlighted,newest:_.newest,tiles:_.tiles.map(hb),amoebs:_.amoebs.map(t=>t?sp(t):null),graveyard:_.graveyard.map(sp)};return JSON.stringify(i)}function pb(i){const t=JSON.parse(i);t.version!==1&&console.warn(`Save version ${t.version} may not be compatible`),Object.assign(_.stats,t.stats),_.history.aveChildren=[...t.history.aveChildren],_.history.avePosNRG=[...t.history.avePosNRG],_.HIGHESTINDEX=t.HIGHESTINDEX,_.highlighted=t.highlighted,_.newest=t.newest;for(let e=0;e<t.tiles.length&&e<dr;e++)_.tiles[e]=fb(t.tiles[e]);for(let e=0;e<t.amoebs.length;e++){const n=t.amoebs[e];_.amoebs[e]=n?rp(n):null}_.graveyard=t.graveyard.map(rp),console.log(`Loaded save from ${new Date(t.timestamp).toLocaleString()}`)}function mb(i){const t=db(),e=new Blob([t],{type:"application/json"}),n=URL.createObjectURL(e),s=document.createElement("a");s.href=n,s.download=i||`petri-save-${Date.now()}.json`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(n)}function gb(i){return new Promise((t,e)=>{const n=new FileReader;n.onload=s=>{try{const r=s.target?.result;pb(r),t()}catch(r){e(r)}},n.onerror=()=>e(n.error),n.readAsText(i)})}function eh(){const i=document.getElementById("map");if(!i){console.error("Map canvas not found");return}if(i.width=window.innerWidth,i.height=1e3,_.ctx.map=i.getContext("2d",{alpha:!1}),!_.ctx.map){console.error("Could not get map canvas context");return}const t=document.getElementById("brain3d-container");t&&BS(t),_.ctx.map.font="10px Arial",_b();const e=document.getElementById("fps-counter");e&&ob(e),YS(),KS(),QE(),rb(),xb(i),ih.generate(),Fm(),_.canvas.scale=3,_.ctx.map.scale(3,3)}function _b(){const i=document.getElementById("foodPopChart"),t=document.getElementById("optimizationChart"),e=document.getElementById("lifespanChart");i&&YE(i),t&&qE(t),e&&jE(e);const n=document.getElementById("mutationStratChart");n&&KE(n);const s=document.getElementById("genDemoChart");s&&$E(s)}function xb(i){i.addEventListener("mouseover",t=>{Ha("over",t,i),_.mouse.overMap=!0}),i.addEventListener("mousemove",t=>Ha("move",t,i)),i.addEventListener("mousedown",t=>Ha("down",t,i)),i.addEventListener("mouseup",t=>Ha("up",t,i)),i.addEventListener("mouseout",t=>{Ha("out",t,i),_.mouse.overMap=!1}),i.addEventListener("wheel",t=>nb(t,i),{passive:!1}),document.addEventListener("keydown",t=>ib(t,Om)),document.addEventListener("keyup",t=>sb(t)),window.addEventListener("resize",()=>{const t=_.ctx.map;t&&(i.width=window.innerWidth,i.height=1e3,t.font="10px Arial",t.setTransform(_.canvas.scale,0,0,_.canvas.scale,_.mouse.originalX,_.mouse.originalY),Zu(),ao())}),vb()}function vb(){const i=document.getElementById("dashboard"),t=document.getElementById("dashboard-resize-handle");if(!i||!t)return;let e=!1;t.addEventListener("mousedown",n=>{e=!0,t.classList.add("dragging"),n.preventDefault()}),document.addEventListener("mousemove",n=>{if(!e)return;const s=window.innerWidth-n.clientX,r=200,a=window.innerWidth*.8;s>=r&&s<=a&&(i.style.width=s+"px",Zu(),ao())}),document.addEventListener("mouseup",()=>{e&&(e=!1,t.classList.remove("dragging"),Zu(),ao())})}function Fm(){lb(),ih.update(),$S.update(),tb.update(),Mb(),!_.pause&&_.stats.time%1e3===0&&JE.update(),ab.update(),_.pause||_.stats.time++,requestAnimationFrame(Fm)}function Mb(){if(_.tracking===null)return;const i=_.ctx.map;if(!i)return;_.highlighted&&_.highlighted>0&&_.tracking!==null&&(_.tracking=_.highlighted);const t=_.tracking>=0?_.amoebs[_.tracking]:_.graveyard[-(_.tracking+1)];if(!t||t.status!=="alive"){_.tracking=null;return}const e=i.canvas,n=e.width/2/_.canvas.scale,s=e.height/2/_.canvas.scale,r=n-t.x-_.mouse.originalX/_.canvas.scale,a=s-t.y-_.mouse.originalY/_.canvas.scale;i.translate(r,a),_.mouse.originalX+=r*_.canvas.scale,_.mouse.originalY+=a*_.canvas.scale}function Om(){if(_.pause){_.pause=!1;const i=document.getElementById("play-button");i&&(i.src="icons/play.png")}else{_.pause=!0;const i=document.getElementById("play-button");i&&(i.src="icons/pause.png")}}function Sb(){_.highlighted=null,_.newest=null,_.scores=new Array(ap),_.amoebs=new Array(Qa),_.graveyard=[];for(let t=0;t<100;t++)_.amoebs[t]=new po(fe(Math.random()*ps),fe(Math.random()*ms),t);_.resetStats(),ZE(),ih.generate();const i=document.getElementById("dash-live-info");i&&(i.innerHTML="LIVE: "+_.stats.livePop+"     DEAD: "+_.graveyard.length)}function Ol(){const i=document.getElementById("amoeba-stats"),t=document.getElementById("brain3d-container"),e=document.getElementById("family-tree");i&&(i.style.display="block"),_.display==="brain"&&t?(t.style.display="block",ao(),e&&(e.style.display="none")):_.display==="family"&&e&&(e.style.display="block",t&&(t.style.display="none"),fo(!0))}function yb(){_.highlighted=_.newest,Ol()}function Eb(){_.highlighted=_.gold,Ol()}function bb(){_.highlighted=_.silver,Ol()}function Tb(){_.highlighted=_.bronze,Ol()}function Ab(){console.log("SAVING..."),mb(`petri-save-${Date.now()}.json`)}function wb(){const i=document.createElement("input");i.type="file",i.accept=".json",i.onchange=async t=>{const e=t.target.files?.[0];if(e){console.log("LOADING...");try{await gb(e),console.log("Load complete!")}catch(n){console.error("Failed to load:",n)}}},i.click()}function Rb(){if(_.highlighted===null)return;const i=document.getElementById("brain3d-container"),t=document.getElementById("family-tree");_.display==="brain"?(_.display="default",i&&(i.style.display="none"),XS()):(_.display="brain",i&&(i.style.display="block",ao()),t&&(t.style.display="none"))}function Cb(){_.tracking!==null?_.tracking=null:_.highlighted!==null&&(_.tracking=_.highlighted)}function Pb(){_.tracking=null}window.init=eh;window.newSimulation=Sb;window.pauseSimulation=Om;window.save=Ab;window.load=wb;window.highlight_newest=yb;window.highlight_gold=Eb;window.highlight_silver=bb;window.highlight_bronze=Tb;window.toggleBrainDisplay=Rb;window.toggleFamilyDisplay=jS;window.toggleTracking=Cb;window.stopTracking=Pb;Object.defineProperty(window,"highlighted",{get:()=>_.highlighted,set:i=>{_.highlighted=i}});Object.defineProperty(window,"leftPressed",{get:()=>_.mouse.leftPressed,set:i=>{_.mouse.leftPressed=i}});Object.defineProperty(window,"graveyard",{get:()=>_.graveyard});Object.defineProperty(window,"amoebs",{get:()=>_.amoebs});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",eh):eh();
