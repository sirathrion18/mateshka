/* Матешка · Repaso con tarjetas (vocabulario, conjugación, pares, casos, fichas, difíciles). */
"use strict";
let rv={mode:"setup",kind:"vocab",sel:null,dir:"ru",nOpt:4,count:15,queue:[],i:0,ans:null,flip:false,ok:0,miss:[],fromWeak:false};
const lkey=(b,n)=>b+":"+n;
function allSeenKeys(){const s=new Set();BK.forEach(b=>b.lessons.forEach(n=>{if(seen(b.id,n))s.add(lkey(b.id,n))}));return s}
function selL(){if(!rv.sel||[...rv.sel].some(k=>{const [b,n]=k.split(":");return !seen(b,+n)}))rv.sel=allSeenKeys();return rv.sel}
function poolFor(kind){const s=selL();const inS=x=>s.has(lkey(x.book,x.lesson));
 if(kind==="vocab")return seenWords().filter(inS).map(w=>({id:w.id,ru:w.ru,es:w.es,book:w.book,lesson:w.lesson,type:"vocab"})).concat(seenAdjs().filter(inS).map(a=>({id:a.id,ru:a.m,es:a.es,book:a.book,lesson:a.lesson,type:"vocab"})),seenVerbs().filter(inS).map(v=>({id:v.id,ru:v.inf,es:v.es,book:v.book,lesson:v.lesson,type:"vocab"})));
 if(kind==="verbs")return seenVerbs().filter(inS).map(v=>{const p=Math.floor(Math.random()*6);return {id:v.id+":"+p,vid:v.id,p,ru:v.inf,es:v.forms[p],book:v.book,lesson:v.lesson,type:"verb",pf:v.group==="PF"}});
 if(kind==="pairs")return reachPairs().filter(p=>s.has(lkey(p.book,p.lesson))||!seen(p.book,p.lesson)).map(p=>{const toPf=Math.random()<.6;return {id:"pr:"+p.id+(toPf?">":"<"),pid:p.id,toPf,ru:toPf?p.ip:p.pf,es:toPf?p.pf:p.ip,mean:p.es,book:p.book,lesson:p.lesson,type:"pair"}});
 if(kind==="cases"){const out=[];DC.forEach((d,di)=>{for(let c=1;c<6;c++)["s","p"].forEach(nm=>out.push({id:"c:"+di+":"+c+nm,di,c,nm,ru:d.s[0],es:d[nm][c],type:"case"}))});return out}
 if(kind==="fichas")return S.fichas.map(f=>({id:"f:"+f.id,ru:f.front||f.title,es:f.back,title:f.title,fid:f.id,type:"ficha"}));
 if(kind==="weak")return Object.values(S.weak);return []}
function makeOpts(it){const n=rv.nOpt;if(!n||it.type==="ficha")return null;let cands=[];
 if(it.type==="verb"){const v=allVerbs().find(x=>x.id===it.vid);if(!v)return null;cands=shuffle(v.forms.filter((_,i)=>i!==it.p)).concat(shuffle(seenVerbs().filter(x=>x.id!==it.vid).map(x=>x.forms[it.p])))}
 else if(it.type==="pair"){const side=it.toPf?"pf":"ip";const p=PAIRS.find(x=>x.id===it.pid);const near=shuffle(reachPairs().filter(x=>x.id!==it.pid).map(x=>x[side]));
  /* el distractor más útil: la otra mitad del mismo par */
  cands=(p?[side==="pf"?p.ip:p.pf].filter(x=>norm(x)!==norm(it.ru)):[]).concat(near)}
 else if(it.type==="case"){const d=DC[it.di];cands=shuffle(d.s.concat(d.p).filter(f=>norm(f)!==norm(it.es)))}
 else{const pool=seenWords().map(w=>({id:w.id,ru:w.ru,es:w.es,l:w.lesson,b:w.book})).concat(seenAdjs().map(a=>({id:a.id,ru:a.m,es:a.es,l:a.lesson,b:a.book})),seenVerbs().map(v=>({id:v.id,ru:v.inf,es:v.es,l:v.lesson,b:v.book})));
  const f=w=>rv.dir==="ru"?w.es:w.ru;const near=pool.filter(w=>w.id!==it.id&&w.b===it.book&&Math.abs(w.l-it.lesson)<=1).map(f);cands=shuffle(near).concat(shuffle(pool.filter(w=>w.id!==it.id).map(f)))}
 const ans=answerOf(it);const out=[ans];for(const c of cands){if(out.length>=n)break;if(c&&norm(c)!==norm(ans)&&!out.some(o=>norm(o)===norm(c)))out.push(c)}return shuffle(out)}
const CASE_ES=["Nominativo","Genitivo","Dativo","Acusativo","Instrumental","Preposicional"];
const qOf=it=>it.type==="verb"||it.type==="ficha"||it.type==="case"||it.type==="pair"?it.ru:(rv.dir==="ru"?it.ru:it.es);
const answerOf=it=>it.type==="verb"||it.type==="ficha"||it.type==="case"||it.type==="pair"?it.es:(rv.dir==="ru"?it.es:it.ru);
function startReview(){let pool=poolFor(rv.kind);if(!pool.length){toast("No hay tarjetas con esa selección");return}
 pool=shuffle(pool);if(rv.count&&rv.kind!=="fichas")pool=pool.slice(0,rv.count);
 rv.queue=pool.map(it=>Object.assign({},it,{tries:0}));rv.i=0;rv.ans=null;rv.flip=false;rv.ok=0;rv.miss=[];rv.mode="run";rv.fromWeak=rv.kind==="weak";rReview()}
function rReview(){
 if(rv.mode==="setup"){const sel=selL();const pool=poolFor(rv.kind);const weakN=Object.keys(S.weak).length;
  const kinds=[["vocab","Vocabulario"],["verbs","Conjugación"],["pairs","Pares"],["cases","Casos"],["fichas","Fichas"],["weak",`Difíciles · ${weakN}`]];
  const usesL=rv.kind==="vocab"||rv.kind==="verbs";
  main.innerHTML=`<div class="view fade-in">
  <button class="game" data-act="pgPick" style="--c:var(--mint)"><span class="gi"><svg viewBox="0 0 32 32" fill="none" stroke="#2A1A1F" stroke-width="2.4" stroke-linejoin="round"><path d="M4 7h10v20H4zM18 7h10v20H18z" fill="#fff"/><path d="M7 12h4M7 16h4M21 12h4M21 16h4"/></svg></span><span class="gb"><b>Repasar páginas</b><span>Elegí desde qué página hasta cuál, y repasá solo eso.</span></span><span class="gs">${(S.pend||[]).length?(S.pend.length===1?"1 pendiente":S.pend.length+" pendientes"):"Nuevo"}</span></button>
  <section class="sec"><h2 class="sec-t">¿Qué repasar?</h2><div class="seg g2" role="group">${kinds.map(k=>`<button data-act="rvKind" data-k="${k[0]}" aria-pressed="${rv.kind===k[0]}">${k[1]}</button>`).join("")}</div></section>
  ${usesL?`<section class="sec"><h2 class="sec-t">¿De qué lecciones?</h2><div class="row" style="gap:8px"><button class="btn sm" data-act="rvAll">Todo lo visto</button><button class="btn sm" data-act="rvNone">Ninguna</button></div>
   ${BK.map(b=>{const ls=b.lessons.filter(n=>seen(b.id,n));if(!ls.length)return "";return `<div class="lgroup"><div class="lg-h"><span class="ru">${esc(b.name)}</span><button class="linkbtn" data-act="rvBook" data-b="${b.id}">Solo este libro</button></div><div class="lchips">${ls.map(n=>`<button data-act="rvL" data-k="${lkey(b.id,n)}" aria-pressed="${sel.has(lkey(b.id,n))}">${n===0?"R":n}</button>`).join("")}</div></div>`}).join("")}
   <p class="note">Elegí una sola lección o mezclá varias, de cualquier libro.</p></section>`:""}
  ${rv.kind==="pairs"?`<section class="sec"><p class="note">Te muestra un verbo y elegís su pareja: si es imperfectivo, el perfectivo; si es perfectivo, el imperfectivo. Entran los pares hasta la lección que estás viendo.</p></section>`:""}
  ${rv.kind==="cases"?`<section class="sec"><p class="note">Te muestra una palabra y un caso; elegís la forma correcta. Usa las palabras de ejemplo de las tablas de casos.</p></section>`:""}
  ${rv.kind==="vocab"?`<section class="sec"><h2 class="sec-t">Dirección</h2><div class="seg" role="group"><button data-act="rvDir" data-d="ru" aria-pressed="${rv.dir==="ru"}">Ruso → castellano</button><button data-act="rvDir" data-d="es" aria-pressed="${rv.dir==="es"}">Castellano → ruso</button></div></section>`:""}
  ${rv.kind!=="fichas"?`<section class="sec"><h2 class="sec-t">Opciones para elegir</h2><div class="seg" role="group">${[[2,"2"],[4,"4"],[5,"5"],[0,"Sin opciones"]].map(o=>`<button data-act="rvOpt" data-o="${o[0]}" aria-pressed="${rv.nOpt===o[0]}">${o[1]}</button>`).join("")}</div>
   <h2 class="sec-t">Cantidad</h2><div class="seg" role="group">${[[10,"10"],[15,"15"],[25,"25"],[0,"Todas"]].map(o=>`<button data-act="rvCount" data-c="${o[0]}" aria-pressed="${rv.count===o[0]}">${o[1]}</button>`).join("")}</div></section>`:""}
  <section class="sec"><button class="btn red block" data-act="rvStart" ${pool.length?"":"disabled"}>Empezar · ${rv.count&&rv.kind!=="fichas"?Math.min(rv.count,pool.length):pool.length} tarjetas</button>
  <p class="note">${rv.kind==="weak"?"Son las que marcaste «no me acuerdo» o respondiste mal. Cuando las aciertes, salen de la lista.":"Si no te acordás o te equivocás, la tarjeta vuelve más adelante en la misma ronda y queda en Difíciles. Cada acierto suma 1 punto."}</p></section>
  <section class="sec"><div class="sec-head"><h2 class="sec-t">Mis fichas</h2><button class="btn sm red" data-act="newFicha">+ Nueva</button></div>
  <div class="flist">${S.fichas.map(f=>`<div class="fl"><button class="fl-open" data-act="focus" data-id="${f.id}"><b class="ru">${esc(f.title)}</b><span>${f.pinned?"Fijada esta semana":"Archivada"} · Abrir</span></button><div class="row" style="gap:6px"><button class="btn sm" data-act="pin" data-id="${f.id}">${f.pinned?"Archivar":"Fijar"}</button><button class="btn sm" data-act="editFicha" data-id="${f.id}">Editar</button></div></div>`).join("")||`<p class="note">Todavía no hay fichas.</p>`}</div></section></div>`;return}
 if(rv.mode==="done"){
  main.innerHTML=`<div class="view fade-in"><section class="sec"><div class="big-stat"><span class="n">${rv.ok}</span><span class="t">aciertos de primera · +${rv.ok} puntos</span></div>
  <p class="note">${rv.miss.length?`${rv.miss.length} para seguir repasando. Quedaron guardadas en Difíciles.`:"Ninguna para repasar."}</p>
  ${rv.miss.length?`<div>${rv.miss.map(it=>`<div class="miss"><span class="ru"><b>${esc(qOf(it))}</b>${it.type==="pair"?" → ":it.type==="case"?" · "+CASE_ES[it.c]+(it.nm==="p"?" pl.":" sing."):it.type==="verb"?" · "+PRON[it.p]:""}</span><span class="${isRu(answerOf(it))?"ru":""}">${esc(answerOf(it))}</span></div>`).join("")}</div>`:""}
  <div class="row">${rv.miss.length?`<button class="btn red" style="flex:1 1 150px" data-act="rvMiss">Repasar solo estas</button>`:""}<button class="btn" style="flex:1 1 150px" data-act="rvAgain">Otra ronda</button><button class="btn" style="flex:1 1 150px" data-act="rvSetup">Cambiar selección</button></div></section></div>`;return}
 const it=rv.queue[rv.i];if(it.opts===undefined)it.opts=makeOpts(it);
 const ans=answerOf(it),q=qOf(it);const flipMode=!it.opts;
 const src=it.type==="ficha"?"Ficha":it.type==="case"?"Casos":it.type==="pair"?"Pares · "+lbl(it.book,it.lesson)+" · "+esc(it.mean):(it.book?esc(bookName(it.book).split(" · ")[0])+" · "+lbl(it.book,it.lesson):"");
 const sub=it.type==="pair"?`<span class="hint">${it.toPf?"Imperfectivo → ¿cuál es el <b>perfectivo</b>?":"Perfectivo → ¿cuál es el <b>imperfectivo</b>?"}</span>`:it.type==="verb"?`<span class="hint">${it.pf?"Futuro":"Presente"} · <b class="ru">${PRON[it.p]}</b></span>`:it.type==="case"?`<span class="hint">${CASE_ES[it.c]} · ${it.nm==="p"?"plural":"singular"}</span>`:it.type==="ficha"?"":`<span class="hint">${rv.dir==="ru"?"¿Qué significa?":"¿Cómo se dice en ruso?"}</span>`;
 let html=`<div class="view fade-in"><section class="sec"><div class="row" style="justify-content:space-between;align-items:center"><span class="counter">${rv.i+1} de ${rv.queue.length}</span><button class="linkbtn" data-act="rvSetup">Terminar</button></div><div class="pbar"><i style="width:${rv.i/rv.queue.length*100}%"></i></div>
 <div class="qcard"><span class="src">${src}</span><span class="q ${isRu(q)?"ru":""} ${q.length>28?"small":""}">${esc(q)}</span>${sub}</div>`;
 if(!flipMode){html+=`<div class="opts">${it.opts.map((o,k)=>{let c="";if(rv.ans!=null){if(norm(o)===norm(ans))c="right";else if(rv.ans===k)c="wrong"}return `<button class="opt ${c} ${isRu(o)?"ru":""}" data-act="rvPick" data-k="${k}" ${rv.ans!=null?"disabled":""}>${esc(o)}${c==="right"?"<span>✓</span>":c==="wrong"?"<span>✗</span>":""}</button>`}).join("")}</div>`;
  html+=rv.ans==null?`<button class="btn block" data-act="rvDunno">No me acuerdo</button>`:`${rv.ans==="nr"?`<p class="note">Respuesta: <b class="${isRu(ans)?"ru":""}">${esc(ans)}</b>. Vuelve más adelante.</p>`:norm(it.opts[rv.ans])!==norm(ans)?`<p class="note">Vuelve más adelante.</p>`:""}<button class="btn red block" data-act="rvNext">Siguiente</button>`}
 else html+=rv.flip?`<div class="qcard" style="border-color:var(--red)"><span class="q small pre ${isRu(ans)?"ru":""}">${esc(ans)}</span></div><div class="row"><button class="btn" style="flex:1" data-act="rvSelf" data-ok="0">No me acordé</button><button class="btn red" style="flex:1" data-act="rvSelf" data-ok="1">Me acordé</button></div>`:`<button class="btn red block" data-act="rvFlip">Ver la respuesta</button>`;
 main.innerHTML=html+`</section></div>`}
function rvResult(ok){const it=rv.queue[rv.i];
 if(ok){if(it.tries===0){rv.ok++;addXP(1);if(rv.fromWeak&&S.weak[it.id])delete S.weak[it.id];save()}}
 else{if(it.type!=="ficha"){const c=Object.assign({},it);delete c.opts;delete c.tries;S.weak[it.id]=c;save()}
  if(!rv.miss.some(m=>m.id===it.id))rv.miss.push(it);
  if(it.tries<2){const copy=Object.assign({},it,{tries:it.tries+1});delete copy.opts;rv.queue.splice(Math.min(rv.queue.length,rv.i+4),0,copy)}}}
function rvNext(){rv.i++;rv.ans=null;rv.flip=false;if(rv.i>=rv.queue.length)rv.mode="done";rReview();window.scrollTo(0,0)}
