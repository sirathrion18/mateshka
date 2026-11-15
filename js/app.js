/* Матешка · núcleo: datos derivados, estado, navegación, barra, inicio, escribir, fichas y biblioteca. */
"use strict";

/* ---------- libros y lecciones ---------- */
const BK=deep(BOOKS);
const LES={a1:LESSONS.map(l=>Object.assign({},l,{p:String(l.p)})),pp:deep(PP_LESSONS),a2:deep(A2_LESSONS)};
const getL=(b,n)=>LES[b].find(l=>l.n===n);
const bookName=b=>BK.find(x=>x.id===b).name;
const lbl=(b,n)=>LESSON_LABEL(b,n);
const RESUMEN={};for(const n in RES)RESUMEN["a1"+n]=deep(RES[n]).map(g=>[g[0],g[1],[g[2]]]);
const R2=deep(RES2);for(const k in R2)RESUMEN[k]=R2[k];
const RX=deep(RES_EXTRA);for(const n in RX)RESUMEN["a1"+n]=(RESUMEN["a1"+n]||[]).concat(RX[n]);

/* palabras */
const WORDS=[];const seenW=new Set();
function addWord(ru,es,b,n){const id="w:"+bare(ru);if(seenW.has(id))return;seenW.add(id);WORDS.push({id,ru,es,book:b,lesson:n})}
for(const n in VOC_RAW)VOC_RAW[n].split(";").forEach(p=>{const [ru,es]=p.split("|");addWord(A(ru),es,"a1",+n)});
for(const k in VOC2){if(!VOC2[k])continue;const b=k.slice(0,2),n=+k.slice(2);VOC2[k].split(";").forEach(p=>{const [ru,es]=p.split("|");if(ru&&es)addWord(A(ru.trim()),es.trim(),b,n)})}
/* verbos */
const PRON=["я","ты","он / она'","мы","вы","они'"].map(A);
function conjI(inf){const s=inf.slice(0,-2);return ["ю","ешь","ет","ем","ете","ют"].map(e=>s+e)}
function conjVA(inf){const s=inf.slice(0,-("ва"+ST+"ть").length);return ["ю"+ST,"ёшь","ёт","ём","ёте","ю"+ST+"т"].map(e=>s+e)}
function conjOVA(inf){const s=inf.slice(0,-("ова"+ST+"ть").length);return ["у"+ST+"ю","у"+ST+"ешь","у"+ST+"ет","у"+ST+"ем","у"+ST+"ете","у"+ST+"ют"].map(e=>s+e)}
const PASTS=Object.assign({},PAST_OVR,PAST2);
function pastOf(inf){const o=PASTS[bare(inf)];if(o)return A(o).split(",");const head=inf.split(" ")[0];
 if(/ться$/.test(head)){const s=head.slice(0,-4);return [s+"лся",s+"лась",s+"лись"]}
 if(/ть$/.test(head)){const s=head.slice(0,-2);return [s+"л",s+"ла",s+"ли"]}return ["","",""]}
function mkVerb(inf,es,b,n,group,forms,src){inf=A(inf);const v={id:"v:"+bare(inf),inf,es,book:b,lesson:n,group,src:src||"libro"};
 v.forms=forms?(Array.isArray(forms)?forms.map(A):A(forms).split(",")):group==="VA"?conjVA(inf):group==="OVA"?conjOVA(inf):conjI(inf);v.past=pastOf(inf);return v}
const VERBS=[];const seenV=new Set();
VERBS_RAW.forEach(r=>{const v=mkVerb(r[0],r[1],"a1",r[2],r[3],r[4]);if(!seenV.has(v.id)){seenV.add(v.id);VERBS.push(v)}});
VERBS2.forEach(r=>{const v=mkVerb(r[0],r[1],r[2],r[3],r[4],r[5]);if(!seenV.has(v.id)){seenV.add(v.id);VERBS.push(v)}});
/* adjetivos */
function adjGroup(m){const b=bare(m);if(/ой$/.test(b))return "oj";if(/ний$/.test(b))return "soft";if(/[кгх]ий$/.test(b))return "kgh";if(/[жшчщ]ий$/.test(b))return "zhsh";return "yj"}
function adjForms(m){const g=adjGroup(m);let st=m.slice(0,-2);
 if(g==="oj"){st=m.replace(/о́?й$/,"");const soft=/[кгхжшчщ]$/.test(st);return [m,st+"а"+ST+"я",st+"о"+ST+"е",st+(soft?"и":"ы")+ST+"е"]}
 if(g==="kgh")return [m,st+"ая",st+"ое",st+"ие"];
 if(g==="zhsh")return [m,st+"ая",st+"ее",st+"ие"];
 if(g==="soft")return [m,st+"яя",st+"ее",st+"ие"];
 return [m,st+"ая",st+"ое",st+"ые"]}
function mkAdj(m,es,b,n,src){m=A(m);return {id:"a:"+bare(m),m,es,book:b,lesson:n,group:adjGroup(m),forms:adjForms(m),src:src||"libro"}}
const ADJS=[];const seenA=new Set();
ADJ_RAW.forEach(r=>{const a=mkAdj(r[0],r[1],"a1",r[2]);if(!seenA.has(a.id)){seenA.add(a.id);ADJS.push(a)}});
ADJ2.forEach(r=>{const a=mkAdj(r[0].replace("серебряный","сере'бряный"),r[1],r[2],r[3]);if(!seenA.has(a.id)){seenA.add(a.id);ADJS.push(a)}});
const VGR=deep(VGROUPS).map(g=>g.id==="I"?Object.assign(g,{t:A("I спряже'ние · -ать / -ять / -еть (y reflexivos en -ся)")}):g);
VGR.splice(VGR.length-1,0,{id:"PF",t:A("Perfectivos · futuro"),es:"Estos verbos son perfectivos: la forma conjugada es futuro (дам = «daré»). En pasado: дал, дала', да'ли.".replace(/'/g,ST),e:null});
const AGR=deep(AGROUPS);
const CS=deep(CASES),DC=deep(DECL),ADC=deep(ADJ_DECL),PR=deep(PRONS),PROMPTS_=deep(PROMPTS);
/* pares imperfectivo / perfectivo */
const PAIRS=PAIRS_RAW.map((r,i)=>({id:"p"+i,ip:A(r[0]),pf:A(r[1]),es:r[2],book:"a2",lesson:r[3],type:r[4],pres:A(r[5]||"").split(","),fut:A(r[6]||"").split(",")}));

/* ---------- estado ---------- */
const KEY="dnevnik-v3";
function seed(){return {v:3,prog:{a1:20,pp:11,a2:24},entries:deep([
   {id:"e3",date:"2026-10-14",book:"pp",lesson:10,title:"Твори'тельный паде'ж",notes:"Con quién, con qué. стать + кем, занима'ться + чем.",material:[],topics:[]},
   {id:"e2",date:"2026-10-09",book:"a2",lesson:22,title:"Ви'деть и'ли смотре'ть?",notes:"Texto «Сосе'дка». Verbos con cambio en «я».",material:[],topics:[]}]),
  fichas:deep([{id:"f1",title:"Ви'деть, плати'ть, проси'ть, чи'стить",front:"¿Cómo cambia la forma de «я»?",back:"ви'жу · плачу' · прошу' · чи'щу\nты ви'дишь · пла'тишь · про'сишь · чи'стишь",pinned:true,photo:false,book:"a2",lesson:22},
   {id:"f2",title:"Твори'тельный",front:"Terminaciones del instrumental",back:"м. / ср.: -ом / -ем\nж.: -ой / -ей (-ью)\nмн.: -ами / -ями",pinned:true,photo:false,book:"pp",lesson:10}]),
  extra:{v:[],a:[]},weak:{},errors:{},xp:0,days:{},writings:[],updatedAt:0,m4:true}}
function migrate(){try{const raw=localStorage.getItem("dnevnik-proto-v2");if(!raw)return null;const o=JSON.parse(raw);const s=seed();
  if(Array.isArray(o.fichas)&&o.fichas.length){s.fichas=o.fichas.map(f=>{const id=f.id||uid();if(f.photo&&typeof f.photo==="string"){try{localStorage.setItem(KEY+"-ph-"+id,f.photo)}catch(e){}}return {id,title:f.title||"",front:f.front||"",back:f.back||"",pinned:!!f.pinned,photo:!!f.photo,book:"a1",lesson:f.lesson||0}}).concat(s.fichas)}
  if(Array.isArray(o.entries))s.entries=s.entries.concat(o.entries.filter(e=>!/^e[123]$/.test(e.id)).map(e=>({id:e.id,date:e.date,book:"a1",lesson:e.lesson,title:e.title,notes:e.notes,material:e.material||[],topics:e.topics||[]})));
  if(o.weak)s.weak=o.weak;return s}catch(e){return null}}
let S;
try{const raw=localStorage.getItem(KEY);S=raw?JSON.parse(raw):(migrate()||seed())}catch(e){S=seed()}
function normalize(){["entries","fichas","writings"].forEach(k=>{if(!Array.isArray(S[k]))S[k]=[]});["weak","errors","days"].forEach(k=>{if(!S[k]||typeof S[k]!=="object")S[k]={}});
 if(!S.extra)S.extra={v:[],a:[]};if(!S.prog)S.prog={a1:20,pp:11,a2:24};
 if(!S.g||typeof S.g!=="object")S.g={};if(!S.g.cerr)S.g.cerr={1:0,2:0,3:0,4:0,5:0};if(!S.g.clast)S.g.clast={};if(!S.g.vseen)S.g.vseen={};if(typeof S.fest!=="number")S.fest=0;
 /* Agus ya está en la lección 25 del A2: lo anterior cuenta como visto (una sola vez). */
 if(!S.m4){S.prog.a2=Math.max(S.prog.a2||0,24);S.m4=true}
 {const ids=new Set();S.fichas.forEach(f=>{if(!f.id||ids.has(f.id))f.id=uid();ids.add(f.id)})}}
normalize();
const PH={};S.fichas.forEach(f=>{if(f.photo){try{const d=localStorage.getItem(KEY+"-ph-"+f.id);if(d)PH[f.id]=d}catch(e){}}});
function saveLocal(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast("No se pudo guardar: el celu está sin espacio")}}
function save(){S.updatedAt=Date.now();saveLocal()}
function savePhoto(id,data){PH[id]=data;try{localStorage.setItem(KEY+"-ph-"+id,data)}catch(e){}}

/* progreso */
const prog=b=>S.prog[b];
const seen=(b,n)=>n<=prog(b);
const nowL=b=>{const ls=BK.find(x=>x.id===b).lessons;return ls.find(n=>n>prog(b))};
/* Para practicar (juegos, pares): lo visto y la lección que está viendo ahora. */
const reach=(b,n)=>seen(b,n)||n===nowL(b);
const a2Reach=()=>{const nw=nowL("a2");return nw!=null?nw:prog("a2")};
function allVerbs(){const out=VERBS.slice();S.extra.v.forEach(x=>{const o=out.find(v=>v.id===x.id);if(o){if(o.src.indexOf(x.src)<0)o.src+=" + "+x.src}else out.push(mkVerb(x.inf,x.es,x.book,x.lesson,x.group,x.forms,x.src))});return out}
function allAdjs(){const out=ADJS.slice();S.extra.a.forEach(x=>{const o=out.find(a=>a.id===x.id);if(o){if(o.src.indexOf(x.src)<0)o.src+=" + "+x.src}else out.push(mkAdj(x.m,x.es,x.book,x.lesson,x.src))});return out}
function allWords(){const out=WORDS.slice();(S.extra.w||[]).forEach(x=>{if(!out.some(w=>w.id===x.id))out.push(x)});return out}
const seenVerbs=()=>allVerbs().filter(v=>seen(v.book,v.lesson));
const seenAdjs=()=>allAdjs().filter(a=>seen(a.book,a.lesson));
const seenWords=()=>allWords().filter(w=>seen(w.book,w.lesson));
const reachPairs=()=>PAIRS.filter(p=>reach(p.book,p.lesson));
function seenSummary(){const lines=[];
 lines.push(prog("a1")>=20?"- «Русский язык: 5 элементов» A1 (Эсмантова): completo, lecciones 1 a 20.":"- «Русский язык: 5 элементов» A1 (Эсмантова): lecciones 1 a "+prog("a1")+".");
 const pp=[9,10,11].filter(n=>seen("pp",n)).map(n=>"lección "+n+" ("+bare(getL("pp",n).text)+")");if(pp.length)lines.push("- Manual «Primeros pasos»: "+pp.join(", ")+".");
 const a2=LES.a2.map(l=>l.n).filter(n=>seen("a2",n));
 if(a2.length){const t=a2.map(n=>n===0?"repaso inicial «Что вы помните?»":"lección "+n+(getL("a2",n).text?" ("+bare(getL("a2",n).text)+")":""));lines.push("- «Русский язык: 5 элементов» A2: "+t.join(", ")+".")}
 const nw=nowL("a2");if(nw!=null){const l=getL("a2",nw);lines.push("  Ahora estoy viendo la lección "+nw+(l.text?" ("+bare(l.text)+")":"")+(l.g.length?": "+bare(l.g.join("; ")):"")+". No uses nada posterior.")}
 return lines.join("\n")}

/* puntos, nivel, juegos del día y racha */
const LV=150;
const level=()=>Math.floor((S.xp||0)/LV)+1;
const lvPct=()=>Math.round(((S.xp||0)%LV)/LV*100);
function day(d){d=d||today();if(!S.days[d])S.days[d]={done:{},xp:0,pick:null,bonus:false};const x=S.days[d];if(!x.done)x.done={};return x}
function addXP(n){S.xp=(S.xp||0)+n;day().xp=(day().xp||0)+n}
const wroteOn=x=>x?Object.keys(x.done||{}).length:0;
function gamesDone(d){const x=S.days[d||today()];if(!x)return 0;return (wroteOn(x)>=1?1:0)+(x.c?1:0)+(x.v?1:0)}
/* Un día suma a la racha con 2 de los 3 juegos (o, como antes, con dos redacciones). */
const dayCounts=d=>gamesDone(d)>=2||wroteOn(S.days[d])>=2;
function streak(){let n=0;const d=new Date();if(!dayCounts(dstr(d)))d.setDate(d.getDate()-1);while(dayCounts(dstr(d))){n++;d.setDate(d.getDate()-1)}return n}
function todayPicks(){const t=day();const avail=PROMPTS_.filter(p=>seen(p.b,p.l)||p.l===nowL(p.b));if(t.pick&&t.pick.every(id=>avail.some(p=>p.id===id)))return t.pick.map(id=>avail.find(p=>p.id===id));
 const used=new Set(S.writings.map(w=>w.pid));const key=today();const sorted=avail.slice().sort((a,b)=>(used.has(a.id)-used.has(b.id))||(hash(key+a.id)-hash(key+b.id)));
 t.pick=sorted.slice(0,3).map(p=>p.id);saveLocal();return t.pick.map(id=>avail.find(p=>p.id===id))}
function writingFor(pid,d){return S.writings.find(w=>w.pid===pid&&w.date===(d||today()))}
/* Se llama cada vez que termina un juego: festeja el día cuando llega a 2 de 3. */
function afterGame(){const d=day();const n=gamesDone();
 if(n>=2&&!d.bonus){d.bonus=true;addXP(20);save();setTimeout(()=>festejar("dia"),350)}
 else if(n>=3&&!d.all){d.all=true;addXP(10);save();setTimeout(()=>festejar("todo"),350)}
 updateDavai()}

/* ---------- interfaz ---------- */
const main=document.getElementById("main"),ov=document.getElementById("ov"),dock=document.getElementById("dock");
let tab="home";
const HEAD={home:["МАТЕШКА",()=>{const nw=nowL("a2");return nw!=null?"Ahora: Урок "+nw+" · A2":"Tu ruso de todos los días"}],lib:["БИБЛИОТЕКА",()=>"Tus libros y lo que viste"],review:["КАРТОЧКИ",()=>"Repaso con tarjetas"],ref:["СПРАВОЧНИК",()=>"Casos, pares, verbos y adjetivos"]};
const TABS=["home","lib","review","ref"];
function go(t){const prev=tab;tab=t;document.querySelectorAll(".tab[data-tab]").forEach(b=>b.setAttribute("aria-current",b.dataset.tab===t?"page":"false"));
 document.getElementById("hTitle").textContent=HEAD[t][0];document.getElementById("hSub").textContent=HEAD[t][1]();render();window.scrollTo(0,0);dockTo(TABS.indexOf(t),prev===t)}
function render(){({home:rHome,lib:rLib,review:rReview,ref:rRef})[tab]();updateDavai()}
function toast(t){document.querySelectorAll(".toast").forEach(x=>x.remove());const d=document.createElement("div");d.className="toast";d.setAttribute("role","status");d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2500)}
const fmtDate=s=>{const d=pd(s);return {d:d.getDate(),m:DIAS[d.getDay()]+" "+MESES[d.getMonth()]}};
const ICON={lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/></svg>',
 back:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
 x:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 cam:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M3 8.5h4l2-3h6l2 3h4V20H3z"/><circle cx="12" cy="13.5" r="3.5"/></svg>',
 prev:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
 next:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
 flame:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c1 3.2 4.8 5 4.8 10a4.8 4.8 0 0 1-9.6 0c0-2.4 1.2-3.7 2.2-4.8.3 1.6 1.1 2.4 1.9 2.8-.6-3 .1-5.6.7-8z" fill="var(--acc)" stroke="var(--bc)" stroke-width="1.8" stroke-linejoin="round"/></svg>',
 pen:'<svg viewBox="0 0 32 32" fill="none" stroke="#2A1A1F" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M6 26l1.5-5.5L21 7l4 4L11.5 24.5z" fill="#fff"/><path d="M18.5 9.5l4 4"/><path d="M6 26l5.5-1.5"/></svg>',
 cases:'<svg viewBox="0 0 32 32" fill="none" stroke="#2A1A1F" stroke-width="2.4" stroke-linejoin="round"><rect x="5" y="5" width="9" height="9" rx="2.5" fill="#fff"/><rect x="18" y="5" width="9" height="9" rx="2.5"/><rect x="5" y="18" width="9" height="9" rx="2.5"/><rect x="18" y="18" width="9" height="9" rx="2.5" fill="#fff"/></svg>',
 verbs:'<svg viewBox="0 0 32 32" fill="none" stroke="#2A1A1F" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M5 11h16l-4-4M27 21H11l4 4"/><circle cx="25" cy="11" r="2.5" fill="#fff"/><circle cx="7" cy="21" r="2.5" fill="#fff"/></svg>'};
function overlay(title,body,opts){opts=opts||{};const first=!ov.firstChild;
 ov.innerHTML=`<div class="ov ${first?"fade-in":""}" role="dialog" aria-modal="true" aria-label="${esc(bare(title))}"><div class="ov-in"><div class="ov-bar gut"><button class="back" data-act="${opts.backAct||"close"}" aria-label="Volver">${ICON.back}</button><h2>${title}</h2>${opts.right||""}</div>
 <div class="ov-body gut" id="ovBody">${body}</div>${opts.foot||""}</div></div>`;
 if(first){const b=ov.querySelector(".back");if(b)try{b.focus({preventScroll:true})}catch(e){}}}
let backStack=[],curOv=null;
function closeOv(){const prev=backStack.pop();if(prev){prev();return}curOv=null;ov.innerHTML="";render()}
function push(fn){backStack.push(fn)}
new MutationObserver(()=>document.body.classList.toggle("lock",!!ov.firstChild)).observe(ov,{childList:true});
window.addEventListener("scroll",()=>document.getElementById("hdr").classList.toggle("scrolled",window.scrollY>6),{passive:true});

/* ---------- tema claro / oscuro ---------- */
const MOON='<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>';
const SUN='<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>';
function paintTheme(){const t=document.documentElement.getAttribute("data-theme");const b=document.getElementById("themeBtn");
 document.getElementById("themeIc").innerHTML=t==="dark"?SUN:MOON;b.setAttribute("aria-label",t==="dark"?"Cambiar a modo claro":"Cambiar a modo oscuro");
 const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==="dark"?"#1A1317":"#FFF4EC"}
function toggleTheme(){const t=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",t);
 try{localStorage.setItem("mateshka-theme",t)}catch(e){}const b=document.getElementById("themeBtn");b.classList.add("theme-flip");setTimeout(()=>b.classList.remove("theme-flip"),520);paintTheme();tick()}
paintTheme();

/* ---------- vibración ---------- */
/* Android: vibrate. iPhone (iOS 18+): tocar un interruptor nativo escondido da un toque háptico. */
const IOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
function tick(strong){try{if(!IOS&&navigator.vibrate){navigator.vibrate(strong?[14,40,20]:9);return}}catch(e){}
 if(IOS){const l=document.getElementById("hapt");try{l.click()}catch(e){}}}

/* ---------- barra flotante: tocar o deslizar el dedo entre secciones ---------- */
const dockItems=[...dock.querySelectorAll(".tab")];
const pil=document.createElement("span");pil.className="dock-pil";pil.setAttribute("aria-hidden","true");dock.prepend(pil);
let dockIdx=0;
function poner(i,sin){const el=dockItems[i];if(!el){pil.style.opacity="0";return}
 if(sin)pil.style.transition="none";
 pil.style.width=el.offsetWidth+"px";pil.style.height=el.offsetHeight+"px";pil.style.transform=`translate(${el.offsetLeft}px,${el.offsetTop}px)`;
 pil.style.setProperty("--c",el.style.getPropertyValue("--c"));pil.style.opacity="1";dockItems.forEach((x,k)=>x.classList.toggle("marcado",k===i));
 if(sin){void pil.offsetWidth;pil.style.transition=""}}
function dockTo(i,same){if(same){poner(i,true);return}poner(i,false);dockIdx=i}
function onda(el){if(!el)return;const o=document.createElement("span");o.className="dock-onda";o.style.setProperty("--c",el.style.getPropertyValue("--c"));el.appendChild(o);setTimeout(()=>o.remove(),600)}
(function(){const cerca=x=>{let k=0,m=1e9;dockItems.forEach((el,i)=>{const r=el.getBoundingClientRect(),d=Math.abs(x-(r.left+r.width/2));if(d<m){m=d;k=i}});return k};
 let x0=null,desliza=false,cand=-1,anular=false;
 dock.addEventListener("pointerdown",e=>{const el=e.target.closest(".tab");if(!el)return;x0=e.clientX;desliza=false;cand=dockItems.indexOf(el);el.classList.add("apretado");onda(el)});
 dock.addEventListener("pointermove",e=>{if(x0==null)return;
  if(!desliza&&Math.abs(e.clientX-x0)>12){desliza=true;try{dock.setPointerCapture(e.pointerId)}catch(_){}dockItems.forEach(x=>x.classList.remove("apretado"))}
  if(!desliza)return;const i=cerca(e.clientX);if(i!==cand){cand=i;poner(i);onda(dockItems[i]);tick()}});
 const soltar=()=>{dockItems.forEach(x=>x.classList.remove("apretado"));
  if(desliza&&dockItems[cand]){anular=true;const t=dockItems[cand].dataset.tab;backStack=[];if(ov.firstChild)ov.innerHTML="";if(t!==tab)go(t);else poner(cand)}x0=null;desliza=false};
 dock.addEventListener("pointerup",soltar);
 dock.addEventListener("pointercancel",()=>{dockItems.forEach(x=>x.classList.remove("apretado"));if(desliza)poner(TABS.indexOf(tab));x0=null;desliza=false});
 dock.addEventListener("click",e=>{if(anular){e.preventDefault();e.stopPropagation();anular=false}},true);
 window.addEventListener("resize",()=>poner(TABS.indexOf(tab),true));
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>poner(TABS.indexOf(tab),true));
 /* ¡Davaicito!: se hunde al apretar y rebota al soltar, con vibración y chispitas. */
 const dv=document.getElementById("davai");
 dv.addEventListener("pointerdown",()=>{dv.classList.remove("boing");dv.classList.add("apretado");tick()});
 const up=()=>{if(!dv.classList.contains("apretado"))return;dv.classList.remove("apretado");void dv.offsetWidth;dv.classList.add("boing");setTimeout(()=>dv.classList.remove("boing"),650);chispas(dv.querySelector(".disc"))};
 dv.addEventListener("pointerup",up);dv.addEventListener("pointerleave",()=>dv.classList.remove("apretado"));dv.addEventListener("pointercancel",()=>dv.classList.remove("apretado"))})();
function chispas(el){if(QUIET())return;const r=el.getBoundingClientRect();const cs=["var(--pink)","var(--butter)","var(--mint)","var(--lilac)","var(--sky)"];
 for(let i=0;i<9;i++){const s=document.createElement("i");s.className="spark";const a=(-Math.PI*.95)+(Math.PI*.9)*(i/8)+(Math.random()-.5)*.25,d=38+Math.random()*26;
  s.style.left=(r.left+r.width/2-5)+"px";s.style.top=(r.top+r.height/2-5)+"px";s.style.background=cs[i%cs.length];s.style.setProperty("--dx",Math.cos(a)*d+"px");s.style.setProperty("--dy",Math.sin(a)*d+"px");
  document.body.appendChild(s);setTimeout(()=>s.remove(),650)}}
const QUIET=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
function updateDavai(){const dv=document.getElementById("davai");const n=3-gamesDone();let p=dv.querySelector(".pend");
 if(n>0){if(!p){p=document.createElement("span");p.className="pend";dv.querySelector(".disc").appendChild(p)}p.textContent=n;dv.setAttribute("aria-label","¡Davaicito! Te "+(n===1?"queda 1 juego":"quedan "+n+" juegos")+" hoy")}
 else{if(p)p.remove();dv.setAttribute("aria-label","¡Davaicito! Hoy ya jugaste los tres")}}
/* El botón lleva al próximo juego que falta. */
function davai(){backStack=[];curOv=null;if(ov.firstChild)ov.innerHTML="";const d=day();
 if(wroteOn(d)<1){const p=todayPicks();const nx=p.find(x=>!writingFor(x.id))||p[0];if(nx){openWrite(nx.id);return}}
 if(!d.c){openCases();return}
 if(!d.v){openVerbs();return}
 toast("¡Hoy ya jugaste los tres! Si querés más, hay repaso.");if(tab!=="review")go("review")}

/* ===== Inicio ===== */
function caseLabel(cs){return cs.map(c=>CASE_NAME[c]).reduce((a,x,i)=>i?a+(/^[IiHh]/.test(x)?" e ":" y ")+x:x,"")}
function rHome(){
 const picks=todayPicks();const st=streak();const gd=gamesDone();const d=day();
 const pinned=S.fichas.filter(f=>f.pinned);
 const errs=Object.entries(S.errors).sort((a,b)=>b[1]-a[1]).slice(0,4);const emax=Math.max(1,...errs.map(e=>e[1]));
 const entries=S.entries.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6);
 const wn=picks.filter(p=>writingFor(p.id)).length;const cp=casesPick();const vm=verbMode();
 const gm=[
  {k:"write",c:"var(--pink)",i:ICON.pen,t:"Escribir",s:wn?`${wn} ${wn===1?"redacción":"redacciones"} hoy · podés sumar más`:(picks[0]?`«${bare(picks[0].ru)}»`:"Consignas de lo que viste"),done:wn>0,st:wn?"Hecho":"1 redacción"},
  {k:"cases",c:"var(--butter)",i:ICON.cases,t:"Casos",s:d.c?`${d.c.ok} de ${d.c.n} bien · ${caseLabel(cp)}`:`Hoy: ${caseLabel(cp)}`,done:!!d.c,st:d.c?"Hecho":"6 preguntas"},
  {k:"verbs",c:"var(--mint)",i:ICON.verbs,t:"Verbos",s:d.v?`${d.v.ok} de ${d.v.n} bien · ${VMODE_NAME[vm]}`:`Hoy: ${VMODE_NAME[vm]}`,done:!!d.v,st:d.v?"Hecho":"5 preguntas"}];
 main.innerHTML=`<div class="view fade-in">
 <section class="card hero" aria-label="Tu progreso"><div class="lvb" aria-label="Nivel ${level()}"><small>УРОВЕНЬ</small><b>${level()}</b></div>
  <div class="hx"><div class="xpbar" role="progressbar" aria-label="Progreso al siguiente nivel" aria-valuenow="${lvPct()}" aria-valuemin="0" aria-valuemax="100"><i style="width:${lvPct()}%"></i></div>
  <div class="meta"><span class="flame">${ICON.flame}${st} <span style="font-family:var(--fb);font-weight:600">${st===1?"día":"días"} de racha</span></span><span>${S.xp||0} puntos</span></div></div>
  <div class="today"><div class="dots" aria-hidden="true">${[0,1,2].map(i=>`<i class="${i<gd?"on":""}"></i>`).join("")}</div><span class="tx">${gd>=3?"¡Los tres juegos de hoy! Сегодня ты молодец.":gd>=2?"Día sumado a la racha. Falta uno, si querés.":gd===1?"Hoy: 1 de 3. Con uno más sumás el día.":"Hoy: 0 de 3. Con 2 juegos sumás el día."}</span></div></section>
 <section class="sec"><h2 class="sec-t">Juegos de hoy</h2>
  <div class="games">${gm.map(g=>`<button class="game ${g.done?"done":""}" data-act="game" data-k="${g.k}" style="--c:${g.c}"><span class="gi">${g.i}</span><span class="gb"><b>${g.t}</b><span class="${g.k==="write"&&!wn?"ru":""}">${esc(g.s)}</span></span><span class="gs">${g.st}</span></button>`).join("")}</div></section>
 <section class="sec"><h2 class="sec-t">Para memorizar esta semana</h2>
  ${pinned.length?`<div class="fbig">${pinned.map(f=>`<button class="fcard" data-act="focus" data-id="${f.id}"><span class="fc-t ru">${esc(f.title)}</span>${f.photo&&PH[f.id]?`<img src="${PH[f.id]}" alt="">`:""}<span class="fc-b ru">${esc(f.back)}</span><span class="fc-open">Abrir para estudiar →</span></button>`).join("")}</div>`:`<p class="note">No hay fichas fijadas. Creá una en Repaso.</p>`}
 </section>
 <section class="sec"><h2 class="sec-t">Con tu IA</h2>
  <div class="tools"><button class="tool" data-act="tool" data-k="ex"><b>Corregir un ejercicio</b><span>Arma el pedido con lo que viste y el método de tu profe.</span></button>
  <button class="tool" data-act="tool" data-k="q"><b>Preguntar una duda</b><span>Le pasa a tu IA lo que viste para que no se adelante.</span></button></div>
  ${S.writings.length?`<button class="linkbtn" data-act="history" style="align-self:flex-start">Mis redacciones y consultas (${S.writings.length})</button>`:""}</section>
 ${errs.length?`<section class="sec"><h2 class="sec-t">Lo que más se te escapa</h2><div class="bars">${errs.map(([t,c])=>`<div class="bar-row"><div class="bar-top"><b>${esc(t)}</b><span class="c">${c}</span></div><div class="bar"><i style="width:${c/emax*100}%"></i></div></div>`).join("")}</div><p class="note">Sale de lo que marcás al guardar cada corrección.</p></section>`:""}
 <section class="sec"><div class="sec-head"><h2 class="sec-t">Clases</h2><button class="btn sm" data-act="newEntry">+ Nueva clase</button></div>
  <div class="entries">${entries.map(entryHTML).join("")||`<p class="note">Todavía no cargaste clases.</p>`}</div></section>
 </div>`}
function rCard(p,i){const w=writingFor(p.id);const st=w?(w.corr?"Corregida":"Escrita"):"Pendiente";
 return `<button class="rcard ${w?(w.corr?"done":"half"):""}" data-act="write" data-id="${p.id}"><span class="rnum">${i+1}</span><span class="rbody"><span class="ru rq">${esc(p.ru)}</span><span class="rmeta">${esc(p.focus)} · ${esc(bookName(p.b).split(" · ")[0])} ${lbl(p.b,p.l)}, p. ${p.p}</span></span><span class="rst">${st}</span></button>`}
function entryHTML(e){const d=fmtDate(e.date);const b=e.book||"a1";
 return `<article class="entry"><div class="date"><span class="d">${d.d}</span><span class="m">${d.m}</span></div>
 <div class="body"><div class="row" style="gap:6px"><button class="chip lesson" data-act="lesson" data-b="${b}" data-n="${e.lesson}">${esc(bookName(b).split(" · ")[0])} · ${lbl(b,e.lesson)}</button></div>
 <h3 class="ru">${esc(e.title)}</h3>${e.notes?`<p>${esc(e.notes)}</p>`:""}
 ${(e.material||[]).length?`<div class="row" style="gap:6px">${e.material.map(m=>`<span class="chip">Material: ${esc(m)}</span>`).join("")}</div>`:""}
 ${(e.topics||[]).length?`<ul class="plain ru small">${e.topics.map(t=>`<li>${esc(t)}</li>`).join("")}</ul>`:""}
 </div></article>`}

/* ===== Escribir ===== */
function openWriteMenu(){curOv=()=>openWriteMenu();const picks=todayPicks();
 overlay("Escribir",`<div class="consigna" style="background:var(--pink)"><p class="big" style="font-size:18px">Elegí una consigna y escribí 2 a 4 renglones.</p><p class="note" style="color:var(--ink)">Con una redacción ya cumplís el juego de hoy. Después la corregís con tu IA.</p></div>
 <div class="rlist">${picks.map((p,i)=>rCard(p,i)).join("")}</div><button class="linkbtn" data-act="moreWrite" style="align-self:flex-start">Ver todas las consignas</button>`)}
let wtags=new Set();
function openWrite(pid){curOv=null;const p=PROMPTS_.find(x=>x.id===pid);let w=writingFor(pid);wtags=new Set(w&&w.tags||[]);
 overlay("Escribir",`
 <div class="consigna"><span class="src">${esc(bookName(p.b))} · ${lbl(p.b,p.l)} · p. ${p.p}</span><p class="ru big">${esc(p.ru)}</p><p class="note" style="color:var(--ink)">${esc(p.es)}</p><span class="chip" style="align-self:flex-start">Practicás: ${esc(p.focus)}</span></div>
 <section class="sec"><h2 class="sec-t">1. Escribí tu respuesta</h2>
  <textarea id="wText" class="wtext ru" rows="5" placeholder="2 a 4 renglones en ruso" autocapitalize="sentences" spellcheck="false">${esc(w?w.text:"")}</textarea>
  <div class="row" style="justify-content:space-between;align-items:center"><span class="note" id="wCount"></span><button class="btn red" data-act="wSave" data-id="${pid}">${w?"Guardar cambios":"Guardar · +15"}</button></div></section>
 <section class="sec ${w?"":"dim"}" id="wStep2"><h2 class="sec-t">2. Corregila con tu IA</h2>
  <div class="steps3"><button class="btn" data-act="copyFix" data-id="${pid}" ${w?"":"disabled"}>Copiar el pedido</button><a class="btn" href="https://gemini.google.com/app" target="_blank" rel="noopener">Abrir Gemini</a></div>
  <p class="note">El pedido lleva tu texto, la consigna, lo que ya viste y el método: primero pistas, después la explicación en castellano. Pegalo en el chat de tu IA.</p>
  <label class="flabel" for="wCorr">Pegá acá lo que te respondió</label>
  <textarea id="wCorr" class="wtext" rows="6" placeholder="Pegá la corrección" ${w?"":"disabled"}>${esc(w&&w.corr||"")}</textarea>
  <p class="flabel">¿En qué te marcó errores?</p>
  <div class="tagset">${ERR_TAGS.map(t=>`<button class="tagb" data-act="wtag" data-t="${esc(t)}" aria-pressed="${wtags.has(t)}">${esc(t)}</button>`).join("")}</div>
  <button class="btn red block" data-act="wCorrSave" data-id="${pid}" ${w?"":"disabled"}>${w&&w.corr?"Guardar corrección":"Guardar corrección · +10"}</button></section>`);
 const ta=document.getElementById("wText");const upd=()=>{const n=ta.value.split(/\n/).filter(x=>x.trim()).length;const words=ta.value.trim()?ta.value.trim().split(/\s+/).length:0;document.getElementById("wCount").textContent=words+" palabras · "+n+" renglones"};ta.addEventListener("input",upd);upd()}
function fixPrompt(consigna,src,text){return `Sos mi corrector de ruso. Estudio con mi profesora. Hablo castellano (Argentina) y estoy en nivel A2.

LO QUE YA VI
${seenSummary()}

CÓMO CORREGIRME
1. Usá solo gramática y vocabulario de lo que ya vi. Si para arreglar algo hace falta un tema que no vi, marcalo como «ADELANTO» y no lo expliques salvo que te lo pida.
2. Corrección mínima: respetá mis oraciones. Arreglá solo lo que está mal; no reescribas el texto para que suene más nativo.
3. Primero, oración por oración: ✓ si está bien; ✗ si tiene un error, con una pista corta, sin darme la solución.
4. Después, en una sección «EXPLICACIÓN», cada error paso a paso en castellano: qué escribí, qué regla aplica, cómo se aplica, la forma correcta y otro ejemplo con palabras que ya conozco.
5. Decime qué casos usé bien y cuáles mal (nominativo, genitivo, dativo, acusativo, instrumental, preposicional).
6. Marcá el acento (´) en las palabras que corrijas.
7. Al final, mi texto corregido completo.

${consigna?`CONSIGNA${src?" ("+src+")":""}\n${bare(consigna)}\n\n`:""}MI TEXTO
${text}`}
function askPrompt(q){return `Sos mi ayudante de ruso. Estudio con mi profesora. Hablo castellano (Argentina) y estoy en nivel A2.

LO QUE YA VI
${seenSummary()}

CÓMO RESPONDERME
1. Explicá en castellano, paso a paso y con ejemplos en ruso (con acentos ´).
2. Usá solo gramática y vocabulario de lo que ya vi. Si la respuesta necesita algo que no vi, avisame que es un «ADELANTO» antes de explicarlo.
3. Cerrá con 2 o 3 oraciones de práctica para que yo complete, sin las respuestas.

MI DUDA
${q}`}
async function copyText(t,msg){try{await navigator.clipboard.writeText(t);toast(msg||"Pedido copiado: pegalo en tu IA");tick();return true}catch(e){
 const m=document.createElement("div");m.className="cpm";m.innerHTML=`<div class="cpm-in" role="dialog" aria-label="Copiar"><p><b>Copiá el pedido</b></p><p class="note">Tu navegador no dejó copiar solo. Mantené apretado el texto, elegí «Seleccionar todo» y copiá.</p><textarea class="wtext" rows="12" readonly>${esc(t)}</textarea><button class="btn red block" type="button">Listo</button></div>`;document.body.appendChild(m);m.querySelector("button").addEventListener("click",()=>m.remove());const c=m.querySelector("textarea");c.focus();c.select();return false}}

/* herramientas con la IA */
function openTool(k,prefill){curOv=null;
 if(k==="ex")overlay("Corregir un ejercicio",`<p class="note">Para cualquier ejercicio del libro o de la profe. Si es de completar, escribí la consigna y tus respuestas.</p>
  <div class="field"><label for="tCons">Consigna (opcional)</label><input id="tCons" placeholder="Ej.: Задание 27, p. 40"></div>
  <div class="field"><label for="tText">Tu respuesta</label><textarea id="tText" class="wtext ru" rows="6" placeholder="Escribí o pegá tu ejercicio"></textarea></div>
  <div class="steps3"><button class="btn red" data-act="tCopy" data-k="ex">Copiar el pedido</button><a class="btn" href="https://gemini.google.com/app" target="_blank" rel="noopener">Abrir Gemini</a></div>
  <div class="field"><label for="tAns">Pegá la corrección</label><textarea id="tAns" class="wtext" rows="6"></textarea></div>
  <p class="flabel">¿En qué te marcó errores?</p><div class="tagset">${ERR_TAGS.map(t=>`<button class="tagb" data-act="wtag" data-t="${esc(t)}" aria-pressed="false">${esc(t)}</button>`).join("")}</div>
  <button class="btn block" data-act="tSave" data-k="ex">Guardar en mis redacciones · +10</button>`);
 if(k==="q")overlay("Preguntar una duda",`<p class="note">La app le pasa a tu IA lo que ya viste, para que te conteste sin adelantarse.</p>
  <div class="field"><label for="tText">Tu duda</label><textarea id="tText" class="wtext" rows="5" placeholder="Ej.: ¿Cuándo uso el genitivo después de нет?">${esc(prefill||"")}</textarea></div>
  <div class="steps3"><button class="btn red" data-act="tCopy" data-k="q">Copiar el pedido</button><a class="btn" href="https://gemini.google.com/app" target="_blank" rel="noopener">Abrir Gemini</a></div>
  <div class="field"><label for="tAns">Pegá la respuesta (para guardarla)</label><textarea id="tAns" class="wtext" rows="6"></textarea></div>
  <div class="row"><button class="btn" style="flex:1 1 150px" data-act="tSave" data-k="q">Guardar</button><button class="btn" style="flex:1 1 150px" data-act="tFicha">Guardar como ficha</button></div>`);
 wtags=new Set()}
function openHistory(){const ws=S.writings.slice().reverse();
 overlay("Mis redacciones",ws.length?ws.map(w=>{const p=w.pid&&PROMPTS_.find(x=>x.id===w.pid);const d=fmtDate(w.date);
  return `<details class="hist"><summary><span class="date-s">${d.d} ${d.m}</span> <b>${w.kind==="q"?"Duda":w.kind==="ex"?"Ejercicio":w.kind==="caso"?"Casos":"Reto"}</b> · <span class="ru">${esc(p?p.ru:(w.title||w.text).slice(0,60))}</span></summary>
  <div class="hist-b"><p class="flabel">${w.kind==="q"?"Pregunta":"Mi texto"}</p><p class="ru pre">${esc(w.text)}</p>${w.corr?`<p class="flabel">${w.kind==="q"?"Respuesta":"Corrección"}</p><p class="pre">${esc(w.corr)}</p>`:`<p class="note">Sin corrección guardada.</p>`}
  ${w.tags&&w.tags.length?`<div class="row" style="gap:6px">${w.tags.map(t=>`<span class="chip">${esc(t)}</span>`).join("")}</div>`:""}
</div></details>`}).join(""):`<p class="note">Todavía no hay nada guardado.</p>`)}
function openMore(){curOv=()=>openMore();const avail=PROMPTS_.filter(p=>seen(p.b,p.l)||p.l===nowL(p.b));
 overlay("Consignas para escribir",`<p class="note">Todas salen de lo que ya viste (y de la lección que estás viendo). Cualquiera cuenta para el juego de hoy.</p><div class="rlist">${avail.map((p,i)=>rCard(p,i)).join("")}</div>`)}

/* ===== Fichas: modo foco ===== */
let fz={id:null,hide:false};
function openFocus(id){fz.id=id;const list=S.fichas.slice().sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));const i=list.findIndex(f=>f.id===id);const f=list[i];if(!f){closeOv();return}
 ov.innerHTML=`<div class="focus" role="dialog" aria-modal="true" aria-label="Ficha"><div class="fz-top gut"><span class="counter">${i+1} de ${list.length}</span><button class="back" data-act="fzClose" aria-label="Cerrar">${ICON.x}</button></div>
 <div class="fz-body gut"><p class="fz-t ru">${esc(f.title)}</p>${f.front?`<p class="fz-q">${esc(f.front)}</p>`:""}
 ${f.photo&&PH[f.id]?`<img class="fz-img" src="${PH[f.id]}" alt="">`:""}
 ${fz.hide?`<button class="fz-cover" data-act="fzHide">Tocá para ver la respuesta</button>`:`<p class="fz-a ru">${esc(f.back)}</p>`}</div>
 <div class="fz-bar gut"><button class="btn" data-act="fzGo" data-d="-1" aria-label="Anterior" ${i===0?"disabled":""}>${ICON.prev}</button><button class="btn" data-act="fzHide">${fz.hide?"Mostrar":"Tapar"}</button><button class="btn" data-act="fzEdit">Editar</button><button class="btn" data-act="fzGo" data-d="1" aria-label="Siguiente" ${i===list.length-1?"disabled":""}>${ICON.next}</button></div></div>`}
let ficDraft={photo:null};
function openFicha(id){const f=id?S.fichas.find(x=>x.id===id):null;ficDraft={photo:f&&PH[f.id]||null};
 overlay(f?"Editar ficha":"Nueva ficha",`<form id="fForm" class="sec" style="gap:16px">
 <div class="field"><label for="fTitle">Título</label><input id="fTitle" class="ru" required value="${esc(f?f.title:"")}" placeholder="Ej.: Дни недели"></div>
 <div class="field"><label for="fFront">Pregunta o tema (opcional)</label><input id="fFront" value="${esc(f?f.front:"")}" placeholder="Ej.: Terminaciones del dativo"></div>
 <div class="field"><label for="fBack">Lo que tenés que memorizar</label><textarea id="fBack" class="ru" rows="7" required placeholder="Podés usar varias líneas, como en el cuadro de la fotocopia.">${esc(f?f.back:"")}</textarea></div>
 <button type="button" class="upload" data-act="pickFicha">${ICON.cam}<span><b>${ficDraft.photo?"Cambiar la foto":"Agregar foto"}</b><br><span class="note">Por ejemplo, el cuadrito de la fotocopia.</span></span></button>
 <div id="fPrev">${ficDraft.photo?`<img src="${ficDraft.photo}" alt="" style="max-height:160px;border:2px solid var(--bc);border-radius:12px">`:""}</div>
 <label class="checkline"><input type="checkbox" id="fPin" ${!f||f.pinned?"checked":""}> Fijar para esta semana</label>
 <button class="btn red block" type="submit">Guardar ficha</button>
 ${f?`<button type="button" class="btn block" data-act="delFicha" data-id="${f.id}">Borrar ficha</button>`:""}</form>`);
 document.getElementById("fForm").addEventListener("submit",ev=>{ev.preventDefault();const rec=f||{id:uid(),book:null,lesson:0};
  Object.assign(rec,{title:val("fTitle"),front:val("fFront"),back:document.getElementById("fBack").value.trim(),pinned:document.getElementById("fPin").checked,photo:!!ficDraft.photo});
  if(ficDraft.photo&&ficDraft.photo!==PH[rec.id])savePhoto(rec.id,ficDraft.photo);
  if(!f)S.fichas.unshift(rec);save();toast("Ficha guardada");if(fz.id===rec.id){backStack.pop();openFocus(rec.id)}else closeOv()})}

/* ===== Biblioteca ===== */
function rLib(){
 main.innerHTML=`<div class="view fade-in"><p class="note">Marcá hasta dónde llegaste en cada libro. Lo que no está marcado como visto no entra en el repaso ni en los pedidos a tu IA. La lección que estás viendo ahora sí entra en los juegos.</p>
 ${BK.map((b,k)=>{const ls=b.lessons;const seenN=ls.filter(n=>seen(b.id,n)).length;const nw=nowL(b.id);
  return `<section class="card book" style="background:${["var(--card)","var(--card)","var(--card)"][k]}"><button class="book-h" data-act="book" data-b="${b.id}"><span class="book-n ru">${esc(b.name)}</span><span class="note">${esc(b.es)}</span></button>
  <div class="bk-prog"><i style="width:${seenN/ls.length*100}%"></i></div>
  <div class="row" style="align-items:center;justify-content:space-between;gap:10px"><span class="note" style="color:var(--ink);font-weight:600">${seenN} de ${ls.length} vistas${nw!=null?` · ahora: ${lbl(b.id,nw)}`:" · completo"}</span>
  <div class="stepper" role="group" aria-label="Hasta dónde llegaste en ${esc(bare(b.name))}"><button data-act="prog" data-b="${b.id}" data-d="-1" aria-label="Uno menos">−</button><span>${lbl(b.id,prog(b.id)).replace("Урок ","")}</span><button data-act="prog" data-b="${b.id}" data-d="1" aria-label="Uno más">+</button></div></div>
  <button class="btn block" data-act="book" data-b="${b.id}">Ver lecciones</button></section>`}).join("")}
 <section class="card sec" style="background:var(--sky)"><h2 class="sec-t">Copia de seguridad</h2><p class="note" style="color:var(--ink)">Tus fichas, redacciones, racha y progreso viven en este celu. Copiá una copia y guardala en Notas o mandatela por WhatsApp; con «Restaurar» la cargás en otro celu o en otra versión de la app.</p>
 <div class="row"><button class="btn" style="flex:1 1 150px" data-act="bkCopy">Copiar copia</button><button class="btn" style="flex:1 1 150px" data-act="bkOpen">Restaurar</button></div></section>
 </div>`}
function openBook(b){curOv=()=>openBook(b);const B=BK.find(x=>x.id===b);
 overlay(esc(B.name),`<p class="note">${esc(B.es)}</p><div>${B.lessons.map(n=>{const l=getL(b,n);const st=seen(b,n)?"done":n===nowL(b)?"now":"lock";
  return `<button class="les ${st}" data-act="lesson" data-b="${b}" data-n="${n}"><span class="num">${n===0?"R":n}</span><span class="t"><b class="ru">${st==="lock"?lbl(b,n):esc(l.text||lbl(b,n))}</b><span>${l.p?"p. "+esc(l.p):""}${st!=="lock"&&l.es?" · "+esc(l.es):""}</span></span><span class="tag ${st}">${st==="done"?"Visto":st==="now"?"Ahora":"Todavía no"}</span></button>`}).join("")}</div>`);
 const nw=ov.querySelector(".les.now");if(nw)setTimeout(()=>nw.scrollIntoView({block:"center"}),40)}
let lessonTab="res";
function openLesson(b,n,t){if(t)lessonTab=t;curOv=()=>openLesson(b,n);const l=getL(b,n);if(!l)return;const st=seen(b,n)?"done":n===nowL(b)?"now":"lock";
 const head=`<div class="les-hero"><span class="n">${n===0?"R":n}</span><div><div class="w">${esc(bookName(b))}${l.p?" · p. "+esc(l.p):""}</div>${l.text?`<div class="ru" style="font-size:18px;font-weight:700">${b==="a1"?"«"+esc(l.text)+"»":esc(l.text)}</div>`:""}</div></div>`;
 if(st==="lock"){overlay(lbl(b,n),head+`<div class="lockbox">${ICON.lock}<div><b>Todavía no lo marcaste como visto.</b><br>Mientras tanto no entra en el repaso, la consulta ni los pedidos a tu IA.</div></div><button class="btn red block" data-act="setProg" data-b="${b}" data-n="${n}">Ya lo vi: marcar hasta acá</button>`);return}
 const words=allWords().filter(w=>w.book===b&&w.lesson===n),verbs=allVerbs().filter(v=>v.book===b&&v.lesson===n),adjs=allAdjs().filter(a=>a.book===b&&a.lesson===n);
 const pairs=PAIRS.filter(p=>p.book===b&&p.lesson===n);
 const prs=PROMPTS_.filter(p=>p.b===b&&p.l===n);const cls=S.entries.filter(e=>(e.book||"a1")===b&&e.lesson===n);
 const tabs=[["res","Resumen"],["voc","Palabras"]].concat(pairs.length?[["par","Pares"]]:[],verbs.length||!pairs.length?[["ver","Verbos"]]:[],[["esc","Escribir"]]);
 if(!tabs.some(x=>x[0]===lessonTab))lessonTab="res";
 const res=RESUMEN[b+n]||[];let body="";
 if(lessonTab==="res")body=`<section class="sec">${l.es?`<p class="lead">${esc(l.es)}</p>`:""}${res.map(g=>`<div class="gpoint"><h3 class="ru">${esc(g[0])}</h3><p>${esc(g[1])}</p>${g[2].map(x=>`<p class="exm ru">${esc(x)}</p>`).join("")}</div>`).join("")}</section>
  ${l.talk&&l.talk.length?`<section class="sec"><h2 class="sec-t">Para conversar</h2><ul class="plain ru">${l.talk.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>`:""}
  ${l.g&&l.g.length?`<section class="sec"><h2 class="sec-t">Temas del índice del libro</h2><ul class="plain ru">${l.g.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>`:""}
  <button class="btn block" data-act="askAbout" data-b="${b}" data-n="${n}">Preguntarle a tu IA sobre este tema</button>
  ${cls.length?`<section class="sec"><h2 class="sec-t">Tus clases</h2><div class="entries">${cls.map(entryHTML).join("")}</div></section>`:""}`;
 if(lessonTab==="voc")body=`<section class="sec"><div class="ugrid">${words.concat(adjs.map(a=>({ru:a.m,es:a.es}))).map(w=>`<div class="word"><span class="r ru">${esc(w.ru)}</span><span class="e">${esc(w.es)}</span></div>`).join("")||`<p class="note">El glosario del libro agrupa varias lecciones: las palabras de esta están en la última lección del grupo.</p>`}</div>
  <p class="note">${b==="a1"?"Glosario del libro, pp. 287–292"+(JOINED[n]?`; ahí las lecciones ${JOINED[n]} vienen juntas, así que la división es aproximada`:""):b==="a2"?"Glosario del libro, pp. 301–303 (viene por grupos de lecciones) y páginas de la lección":"Словарь урока "+n+" del manual"}. Las traducciones las sugiere la app.</p></section>`;
 if(lessonTab==="par")body=`<section class="sec"><p class="note">Imperfectivo (proceso, costumbre) y perfectivo (resultado, una vez). En color, lo que cambia.</p>${pairsTable(pairs)}</section>`;
 if(lessonTab==="ver")body=`<section class="sec">${verbs.length?`<div class="vgroup">${verbs.map(verbRow).join("")}</div>`:`<p class="note">No hay verbos nuevos en esta lección.</p>`}</section>`;
 if(lessonTab==="esc")body=`<section class="sec">${prs.length?`<div class="rlist">${prs.map((p,i)=>rCard(p,i)).join("")}</div>`:`<p class="note">No hay consignas de redacción cargadas para esta lección.</p>`}</section>`;
 overlay(lbl(b,n),head+`${st==="now"?`<p class="banner"><b>Ahora</b>Es lo que estás viendo. Ya entra en los juegos; en el repaso, cuando la marques como vista.</p>`:""}
 <div class="ustats"><div><b>${words.length+adjs.length}</b><span>Palabras</span></div><div><b>${pairs.length?pairs.length:verbs.length}</b><span>${pairs.length?"Pares":"Verbos"}</span></div><div><b>${prs.length}</b><span>Consignas</span></div></div>
 ${st==="done"?`<button class="btn red block" data-act="reviewLesson" data-b="${b}" data-n="${n}">Repasar esta lección</button>`:`<button class="btn red block" data-act="setProg" data-b="${b}" data-n="${n}">Ya la vi: marcar como vista</button>`}
 <div class="seg" role="group" aria-label="Secciones">${tabs.map(t=>`<button data-act="ltab" data-t="${t[0]}" data-b="${b}" data-n="${n}" aria-pressed="${lessonTab===t[0]}">${t[1]}</button>`).join("")}</div>${body}`)}
