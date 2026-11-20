/* eslint-disable */
// @ts-nocheck
// Copied from herondlabs/defrasoft-landing-page web/src/defrag.ts; only tuneDefrag (end of file) is added, for the showcase rig.
// The Defrasoft defrag engine, ported verbatim from brand/defrag-lab.html (frame/build/pieceAt/morph) for the
// floral plate as its image input. Keep in step with that file: it is the source of truth for the technique.
const PAPER=[250,249,245],INK=[18,19,22];
// Paper & Ink at the brand ratio: body pieces in fog, mist and paper (slots 0,1,3); cobalt only in the engine's
// rare-accent slot (2), which it gives to 2–4 outer pieces. Same colours as the lab's Paper & Ink, re-slotted.
const PAL=[["Paper & Ink",["#9FB3C8","#CFD8DC","#2355F6","#FAF9F5"]]];
// Lab defaults, with the site's composition: Paper & Ink on ink ground, paper mark, point focus above centre.
const P={D:.5,msize:.16,cell:74,fill:.8,iscale:.8,tone:.9,fx:.5,fy:.4,fall:1.6,empty:.3,spray:.08,grain:10,seed:9,k:1,m:1};
const S={src:"field",inv:"0",pal:0,cmode:"pal",ground:"none",mode:"p",mark:"none",dir:"in",entry:"fly",img:null};
const v=id=>P[id];
const $=()=>({value:""});
const hex=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const css=c=>`rgb(${c[0]|0},${c[1]|0},${c[2]|0})`;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lum=c=>c[0]*.299+c[1]*.587+c[2]*.114;
const outC=t=>1-Math.pow(1-t,3), outQ=t=>1-Math.pow(1-t,4), inOut=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function rng(seed){let a=seed>>>0||1;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

// ---- mark geometry, measured from the master file (unit square, y down) ----
function markPath(c,x,y,s){
 c.beginPath();c.moveTo(x,y);c.lineTo(x,y+.458*s);c.lineTo(x+.208*s,y+.458*s);c.lineTo(x,y+s);c.lineTo(x+.943*s,y+s);
 c.quadraticCurveTo(x+s,y+s,x+s,y+.943*s);c.lineTo(x+s,y+.057*s);c.quadraticCurveTo(x+s,y,x+.943*s,y);c.closePath();
 c.moveTo(x+.375*s,y+.167*s);c.lineTo(x+.5*s,y+.167*s);c.arc(x+.5*s,y+.5*s,s/3,-Math.PI/2,Math.PI/2);
 c.lineTo(x+.372*s,y+.833*s);c.lineTo(x+.5*s,y+.5*s);c.lineTo(x+.375*s,y+.5*s);c.closePath();
}
// ---- fragments as N-point outlines so each one reshapes into its circle without turning ----
const N=72;
function resample(pts){
 let a=0;for(let i=0;i<pts.length;i++){const p=pts[i],q=pts[(i+1)%pts.length];a+=p[0]*q[1]-q[0]*p[1]}if(a<0)pts.reverse();
 let si=0,best=1e9;pts.forEach((p,i)=>{const d=Math.abs(Math.atan2(p[1],p[0])+Math.PI/2)+(p[1]>0?9:0);if(d<best){best=d;si=i}});
 pts=pts.slice(si).concat(pts.slice(0,si));
 const L=[0];for(let i=1;i<=pts.length;i++){const p=pts[i-1],q=pts[i%pts.length];L.push(L[i-1]+Math.hypot(q[0]-p[0],q[1]-p[1]))}
 const tot=L[L.length-1],out=[];let j=0;
 for(let k=0;k<N;k++){const t=k/N*tot;while(L[j+1]<t)j++;const p=pts[j],q=pts[(j+1)%pts.length],u=(t-L[j])/((L[j+1]-L[j])||1);out.push([p[0]+(q[0]-p[0])*u,p[1]+(q[1]-p[1])*u])}
 return out;
}
const arcPts=(cx,cy,r,a0,a1,n)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return[cx+r*Math.cos(a),cy+r*Math.sin(a)]});
const SHAPES=[
 resample([[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5],[-.5+.208,-.5+.458],[-.5,-.5+.458]]),   // body with the 21° notch
 resample(arcPts(-.25,0,.5,-Math.PI/2,Math.PI/2,40)),                                    // bowl
 resample([[-.5+.36,-.5],[-.5+.64,-.5],[-.5+.44,.5],[-.5+.16,.5]])];                     // 21° stem
const CIRC=SHAPES.map(sh=>{const a0=Math.atan2(sh[0][1],sh[0][0]);return sh.map((_,i)=>{const a=a0+i/N*Math.PI*2;return[Math.cos(a)*.5,Math.sin(a)*.5]})});   // matched by arc length: thin pieces round out without a kink
function morph(c,kind,x,y,fs,cr,p){
 const A=SHAPES[kind],B=CIRC[kind];c.beginPath();
 for(let i=0;i<N;i++){const px=A[i][0]*fs*(1-p)+B[i][0]*2*cr*p,py=A[i][1]*fs*(1-p)+B[i][1]*2*cr*p;i?c.lineTo(x+px,y+py):c.moveTo(x+px,y+py)}
 c.closePath();c.fill();
}

// ---- input → per-cell samples ----
function inputCanvas(W,H){
 const c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
 x.fillStyle="#fff";x.fillRect(0,0,W,H);const sc=v("iscale"),m=Math.min(W,H)*sc;x.fillStyle="#000";
 if(S.src==="mark"){markPath(x,(W-m)/2,(H-m)/2,m);x.fill("evenodd")}
 else if(S.src==="word"||S.src==="text"){
  const t=S.src==="word"?"Defrasoft":$("txt").value||" ";x.font=`600 100px "Funnel Display"`;const tw=x.measureText(t).width;
  const fs=Math.min(W*sc/tw*100,H*sc*.9);x.font=`600 ${fs}px "Funnel Display"`;x.textAlign="center";x.textBaseline="middle";x.fillText(t,W/2,H/2+fs*.04)}
 else if(S.src==="image"&&S.img){const i=S.img,k=Math.max(W/i.width,H/i.height)*sc/.8;x.drawImage(i,(W-i.width*k)/2,(H-i.height*k)/2,i.width*k,i.height*k)}
 return c;
}
// site: soft value noise, two octaves, so the halftone reads as haze printed in dots rather than a vignette
const hsh=(i,j)=>{const a=Math.sin(i*127.1+j*311.7)*43758.5453;return a-Math.floor(a)};
const vn=(x,y)=>{const i=Math.floor(x),j=Math.floor(y),u=x-i,w=y-j,su=u*u*(3-2*u),sw=w*w*(3-2*w);
 return (hsh(i,j)*(1-su)+hsh(i+1,j)*su)*(1-sw)+(hsh(i,j+1)*(1-su)+hsh(i+1,j+1)*su)*sw};
const haze=(x,y)=>.65*vn(x,y)+.35*vn(x*2.1+5.2,y*2.1+1.3);
let G=null,KEY="";
function build(W,H){
 const cs=v("cell")*P.k*P.m,cols=Math.ceil(W/cs),rows=Math.ceil(H/cs),ox=(W-cols*cs)/2,oy=(H-rows*cs)/2;
 const key=[W,H,cs,S.src,S.inv,v("iscale"),$("txt").value,S.img&&S.img.src.length,v("seed"),S.mode,v("fx"),v("fy"),1,v("fall"),.05,v("msize"),S.mark].join("|");
 if(key===KEY)return G;KEY=key;
 const field=S.src==="field",R=rng(v("seed")*7919+3),fx=v("fx")*W,fy=(S.mode==="h"?.5:v("fy"))*H,reach=1,fall=v("fall"),acc=.05;
 const ms=Math.min(W,H)*v("msize"),clear=S.mark==="none"?0:ms/2+Math.max(cs,.12*ms),hole=S.mark==="none"?0:ms/2+cs*.15;   // air round the mark
 const K=S.src==="image"?8:4;let d=null;if(!field){const ic=inputCanvas(cols*K,rows*K);d=ic.getContext("2d").getImageData(0,0,cols*K,rows*K).data}
 const cells=[];
 for(let r=0;r<rows;r++)for(let q=0;q<cols;q++){
  const x=ox+(q+.5)*cs,y=oy+(r+.5)*cs;
  // across: order runs along the long axis from the focus line; point: elliptical, normalised per axis
  let dist=S.mode==="h"?(W>=H*.75?Math.abs(x-fx)/(W/2):Math.abs(y-fy)/(H/2)):Math.hypot((x-fx)/(W/2),(y-fy)/(H/2))/Math.SQRT2;dist=clamp(dist/reach,0,1);
  if(Math.abs(x-fx)<hole&&Math.abs(y-fy)<hole)continue;
  // site: an oval of air round the mark and copy, cleared cell by cell
  let sz=1;{const port=H>W,ed=Math.hypot((x-W/2)/(port?W*.62:Math.max(W*.3,Math.min(W*.42,cs*3.5))),(y-H*(port?.4:.5))/(port?Math.min(H*.4,W*.62):H*.4)),t=clamp((ed-.8)/.85,0,1);
   if(t<.02)continue}   // site: every dot full size; the oval of air is feathered by a CSS mask on the field, not by shrinking dots                // the mark sits on clean ground
  let cov=0,rgb=[255,255,255];
  if(!field){let sr=0,sg=0,sb=0;for(let yy=0;yy<K;yy++)for(let xx=0;xx<K;xx++){const i=((r*K+yy)*cols*K+q*K+xx)*4;sr+=d[i];sg+=d[i+1];sb+=d[i+2]}
   rgb=[sr/(K*K),sg/(K*K),sb/(K*K)];const L=lum(rgb)/255;cov=S.inv==="1"?L:1-L}
  else cov=0;
  const r1=R(),kc=R(),r2=R(),r3=R(),r4=R(),kr=R();
  // Illustrator rule at defrag .5: a cell stays a fragment iff r1 < dist^curve
  const k=r1/Math.max(Math.pow(dist,fall),1e-4);let Dc=1/(1+Math.pow(k,1/1.5));
  if(Math.max(Math.abs(x-fx),Math.abs(y-fy))<clear)Dc=0;
  // exit point: straight out from the focus to just past the frame edge
  let ux=x-fx,uy=y-fy,l=Math.hypot(ux,uy);if(l<1){ux=0;uy=-1;l=1}ux/=l;uy/=l;
  // exit: straight out from the focus until the whole piece and its spray are past the frame edge
  const tx=ux>0?(W-x)/ux:ux<0?-x/ux:1e9,ty=uy>0?(H-y)/uy:uy<0?-y/uy:1e9,edgeK=tx<ty?Math.abs(ux):Math.abs(uy);
  const exitD=Math.min(tx,ty)+(cs*.62+cs*.25*3+2)/Math.max(.2,edgeK);
  cells.push({x,y,dist,cov,rgb,Dc,r2,r3,kr,ux,uy,exitD,col:[0,1,3][Math.floor(r4*3)],jx:R()-.5,jy:R()-.5,
   sz,empty:r2<v("empty")*Math.pow(dist,.5),kind:Math.min(2,Math.floor(kr*3))});
 }
 {const outer=cells.filter(e=>e.dist>.65&&e.Dc>.45).sort((a,b)=>a.kr-b.kr),n=clamp(Math.round(cells.length*.008),2,4);outer.slice(0,n).forEach(e=>e.col=2)}
 if(S.src==="image"){const cv=cells.map(e=>e.cov).sort((a,b)=>a-b),lo=cv[Math.floor(cv.length*.05)],hi=cv[Math.floor(cv.length*.95)]||1;
  const sm=(a,b,t)=>{t=clamp((t-a)/(b-a),0,1);return t*t*(3-2*t)};
  cells.forEach(e=>{let c=clamp((e.cov-lo)/Math.max(.05,hi-lo),0,1);c=Math.pow(sm(.08,.92,c),.85);e.cov=clamp(c+.12*c*(1-c),0,1);e.photo=true})}   // tone curve + dot gain
 G={cells,cs,cols,rows,ox,oy};return G;
}

// ---- per-piece state: still (D) or animated (u along the timeline) ----
const SOFT=.004;   // stills: each piece is either a clean fragment or a clean circle
function pStill(e,D){return inOut(clamp((D-e.Dc)/SOFT+.5,0,1))}
let W0=1920;
function pieceAt(e,D,u){
 if(u==null)return{p:pStill(e,D),ep:1};
 // assemble: pieces enter edges-first, then each morphs once on its own ease-out; last frame = the still
 // centre pieces set off first (they travel farthest), so nothing flies over a piece that has landed
 const fl=.3+.1*Math.min(1,e.exitD/Math.max(W0,1)),pf=pStill(e,D),s0=e.dist*.5+e.r3*.02,ep=Math.sin(clamp((u-s0)/fl,0,1)*Math.PI/2); // gentle decelerating entry, staggered outward
 // each piece morphs once, after landing; the last morph ends at u=1, so the final frame is the still
 const land=s0+fl,tc=Math.min(.97,Math.max(land+.02,.45+.45*clamp(e.Dc/Math.max(D,.05),0,1))),md=Math.max(.03,Math.min(.12,1-tc)),p=pf*outQ(clamp((u-tc)/md,0,1));
 return{p,ep};
}
// blur layers: a geometric ladder of radii; each layer is blurred once per frame
const BL0=.6,BLK=1.6,LV=[0,...Array.from({length:7},(_,i)=>BL0*Math.pow(BLK,i))],LAY=[];
function lay(i,W,H){let L=LAY[i];if(!L||L.cv.width!==W||L.cv.height!==H){const cv=document.createElement("canvas");cv.width=W;cv.height=H;L=LAY[i]={cv,cx:cv.getContext("2d")}}
 if(!L.used){L.cx.clearRect(0,0,W,H);L.used=true}return L.cx}
let GT=null;function grainTable(n,gr){if(GT&&GT.n===n&&GT.gr===gr)return GT.a;const a=new Int8Array(n),R=rng(5);for(let i=0;i<n;i++)a[i]=Math.round((R()+R()-1)*gr);GT={n,gr,a};return a}
function frame(W,H,D,target,u=null,fi=0){LAY.forEach(L=>L&&(L.used=false));
 W0=W;const g=build(W,H),{cells,cs}=g,F=PAL[S.pal][1].map(hex),dark=S.ground==="dark",bg=dark?INK:PAPER,field=S.src==="field";
 const lightFirst=[0,1,3].sort((a,b)=>lum(F[b])-lum(F[a]));
 const fill=v("fill"),tone=v("tone"),tint=.25;
 const c=target.getContext("2d"),plate=S.ground==="none";if(plate)c.clearRect(0,0,W,H);else{c.fillStyle=css(bg);c.fillRect(0,0,W,H)}   // site: the plate shows through
 const spr=v("spray")*cs;
 for(let i=0;i<cells.length;i++){
  const e=cells[i],{p,ep}=pieceAt(e,D,u);
  if(!field&&S.src!=="image"&&e.cov<.1)continue;                     // no underlay grid behind shapes and type
  const tnt=dark?.12:tint*(1-e.dist);
  let circ,frag;
  if(field){circ=mix(F[lightFirst[Math.min(2,Math.floor(e.dist*3))]],bg,tnt);frag=mix(F[e.col],bg,tnt*.4)}
  else{const ti=e.cov>.66?2:e.cov>.33?1:0,t2=clamp(e.cov,0,1)*2,ramp=t2<1?mix(F[lightFirst[0]],F[lightFirst[1]],t2):mix(F[lightFirst[1]],F[lightFirst[2]],t2-1);
   circ=S.cmode==="img"?e.rgb:e.photo?F[lightFirst[ti]]:mix(ramp,bg,tnt*.4+(1-e.cov)*.35);   // photos: hard ink levels
   frag=S.cmode==="img"?e.rgb:mix(e.col===2?F[2]:F[lightFirst[clamp(ti+Math.round(e.kr*2-1),0,2)]],bg,tnt*.4)}
  // halftone: circle radius follows the input's tone; fragments shrink where the input is empty so the silhouette survives
  if(e.photo&&!plate&&e.cov<.04)continue;                                     // highlights print as clean paper
  const cr=e.sz*(field||plate?cs*fill/2:e.photo?cs*.55*Math.sqrt(e.cov):cs*fill/2*((1-tone)+tone*(.3+.7*clamp(e.cov*1.15,0,1))));   // photos: dot area follows tone
  const fs=(field||plate?cs*fill:cs*fill*((1-tone*.6)+tone*.6*clamp(e.cov*1.3,0,1)))*e.sz;
  let x=e.x+e.jx*cs*.3*(1-p),y=e.y+e.jy*cs*.3*(1-p),sc=1;
  // gaps wait off-frame (or at zero size) and arrive as they resolve; other pieces enter on the timeline
  let away=ep<1?1-ep:0;if(e.empty&&pStill(e,D)<.5)away=1;   // gaps stay out; gaps that fill enter with their neighbours
  if(away>0){if(S.entry==="fly"){x+=e.ux*e.exitD*away;y+=e.uy*e.exitD*away}else sc=1-away}
  if(sc<=0)continue;
  const col=css(mix(frag,circ,p)),r=spr*(.15+.85*(1-p)*(.35+.65*e.dist));
  // soft focus by fragmentation: pieces go into a few blur layers, each blurred once per frame
  const bl=r*.55,li=bl<.3?0:Math.min(LV.length-1,1+Math.round(Math.log(bl/BL0)/Math.log(BLK)));
  const lc=lay(li,W,H);lc.fillStyle=col;morph(lc,e.kind,x,y,fs*sc,cr*sc,p);
 }
 // composite blur layers under the crisp pieces, softest first
 for(let li=LV.length-1;li>=0;li--)if(LAY[li]&&LAY[li].used){if(li)c.filter=`blur(${LV[li].toFixed(2)}px)`;c.drawImage(LAY[li].cv,0,0);c.filter="none"}
 const gr=v("grain");
 if(gr>0&&!plate){const im=c.getImageData(0,0,W,H),p=im.data,N=grainTable(W*H,gr);for(let i=0,j=0;i<p.length;i+=4,j++){const n=N[j];p[i]+=n;p[i+1]+=n;p[i+2]+=n}c.putImageData(im,0,0)}
 if(S.mark!=="none"){const ms=Math.min(W,H)*v("msize"),mx=v("fx")*W,my=(S.mode==="h"?.5:v("fy"))*H;c.fillStyle=S.mark==="ink"?"#121316":"#FAF9F5";markPath(c,mx-ms/2,my-ms/2,ms);c.fill("evenodd")}
}


// Draw one frame of the assemble timeline: u 0 = scattered, 1 = the still.
export function drawDefrag(cv,u){frame(cv.width,cv.height,v("D"),cv,Math.max(0,Math.min(1,u)))}
// Draw the still at a given defrag amount: D 0 = every piece a fragment, 1 = every piece a circle.
// The photo the field is sampled from; the scene's floral plate.
export function setDefragImage(img){S.img=img;KEY=""}
// Site: a fixed 74 CSS px cell (the lab's brand-field size) instead of scaling the cell with frame area.
export function drawDefragAt(cv,D){P.k=cv.width/cv.clientWidth;P.m=Math.max(.55,Math.min(1,cv.clientWidth/1280));   // phones: smaller cells
 frame(cv.width,cv.height,Math.max(0,Math.min(1,D)),cv,null)}

// ---- SVG output: the same build() layout and colour rules as frame(), emitted once as paths ----
// Each cell carries its fragment outline, its circle (centre, radius) and both colours.
// Scroll then only flips a class per cell when D crosses its Dc; the browser does the morph. No per-frame raster.
const pathOf=(pts,x,y,s)=>"M"+pts.map(p=>(x+p[0]*s).toFixed(1)+" "+(y+p[1]*s).toFixed(1)).join("L")+"Z";
export function buildDefragSvg(W,H,m=1){
 P.k=1;P.m=m;const g=build(W,H),{cells,cs}=g,F=PAL[S.pal][1].map(hex),bg=PAPER;
 const lightFirst=[0,1,3].sort((a,b)=>lum(F[b])-lum(F[a])),fill=v("fill");
 return cells.map(e=>{
  // the haze sets each dot's colour only; every dot is one size (no halftone ramp)
  const near=Math.pow(1-e.dist,.8),hz=clamp((haze(e.x/(cs*5),e.y/(cs*5))-.25)/.5,0,1),lv=clamp(.55*hz+.45*near,0,1);
  const tnt=.25*(1-e.dist),circ=mix(mix(F[1],F[0],lv),F[2],.16*lv*lv),frag=mix(F[e.col],bg,tnt*.4);
  const fs=cs*fill*e.sz,cr=cs*.32,j=cs*(1-fill)*.9,fx=e.x+e.jx*j,fy=e.y+e.jy*j;   // jitter stays inside the cell's air: neighbours never touch
  return{Dc:e.Dc,empty:e.empty,frag:pathOf(SHAPES[e.kind],fx,fy,fs),x:+e.x.toFixed(1),y:+e.y.toFixed(1),r:+cr.toFixed(1),cf:css(frag),cc:css(circ)};
 });
}

// The engine's three pieces (body, bowl, 21° stem) as unit outlines centred on 0, for small glyphs drawn in the same hand.
export const PIECES: string[] = SHAPES.map((sh) => "M" + sh.map((p) => p[0].toFixed(3) + " " + p[1].toFixed(3)).join("L") + "Z");

// Showcase: set lab parameters (P) and scene switches (S) between frames; the next build() re-lays the field.
export function tuneDefrag(p: Partial<typeof P>, s: Partial<typeof S> = {}) { Object.assign(P, p); Object.assign(S, s); KEY = ""; }
