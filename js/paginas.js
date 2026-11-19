/* Матешка · Repasar por páginas (idea de Agus, 19/11).
   Elegís libro y páginas (desde / hasta) y ves resumen, palabras, verbos y pares solo de esas páginas, con un juego mezclado.
   «Pendiente» deja el tramo anotado en Inicio hasta que tocás «Ya lo sé». El índice por página está en formas.json (P). */
"use strict";
let pg={b:"a2",from:null,to:null,f:"all"};
const PG_BOOKS=[["a2","A2"],["a1","A1"],["pp","Primeros pasos"]];
function pgIdx(b){return FORMAS&&FORMAS.P&&FORMAS.P[b]||null}
function pgBounds(b){const I=pgIdx(b);if(!I)return null;const ks=Object.keys(I).map(Number).sort((x,y)=>x-y);return {min:ks[0],max:ks[ks.length-1]}}
function lessonsOf(b,from,to){return LES[b].filter(l=>{const m=/(\d+)\D+(\d+)/.exec(String(l.p||""))||/(\d+)/.exec(String(l.p||""));if(!m)return false;const a=+m[1],z=+(m[2]||m[1]);return a<=to&&z>=from}).map(l=>l.n)}
const rangoTxt=(f,t)=>f===t?"p. "+f:"pp. "+f+"–"+t;
function pgLabel(b,f,t){return (b==="a2"?"A2":b==="a1"?"A1":"Primeros pasos")+" · "+rangoTxt(f,t)}

/* lo que hay en esas páginas */
function rangeData(b,from,to){const I=pgIdx(b)||{};const W=[],V=[],R=[],seenL=new Set(),seenR=new Set(),pairIds=new Set();
 for(let p=from;p<=to;p++){const P=I[p];if(!P)continue;
  (P.w||[]).forEach(li=>{if(seenL.has(li))return;seenL.add(li);const L=FORMAS.L[li];if(!L)return;const e={li,ru:L[0],es:L[1]||"",kind:L[2]||"",src:L[3]||"",page:p};(/^verbo/.test(e.kind)?V:W).push(e)});
  (P.p||[]).forEach(id=>pairIds.add(id));
  (P.r||[]).forEach(k=>{if(seenR.has(k))return;seenR.add(k);const [key,i]=k.split(":");const g=(RESUMEN[key]||[])[+i];if(g)R.push({g,page:p,key})})}
 /* solo pares hasta la lección que está viendo: nada de adelantarse */
 const pairs=PAIRS.filter(x=>pairIds.has(x.id)&&reach(x.book,x.lesson));
 /* con traducción primero; las de tu vocabulario (con lección) antes que el resto */
 const ord=(a,b2)=>(!!b2.es-!!a.es)||(!!b2.src-!!a.src)||a.page-b2.page;W.sort(ord);V.sort(ord);
 return {W,V,R,pairs}}

/* --- elegir páginas --- */
function openPagesPick(){curOv=()=>openPagesPick();if(!FORMAS){cargarFormas().then(openPagesPick);return}
 {const B=pgBounds(pg.b);const nw=nowL("a2");const l=nw!=null?getL("a2",nw):null;const m=l&&/(\d+)/.exec(String(l.p||""));
  if(pg.from==null){pg.from=m?+m[1]:(B?B.min:1);pg.to=pg.from}
  overlay("Repasar páginas",`<p class="note">Elegí el libro y las páginas. Vas a ver solo lo que está en esas páginas.</p>
  <div class="seg" role="group" aria-label="Libro">${PG_BOOKS.map(([id,n])=>`<button data-act="pgBook" data-b="${id}" aria-pressed="${pg.b===id}" ${pgIdx(id)?"":"disabled"}>${n}${pgIdx(id)?"":" · pronto"}</button>`).join("")}</div>
  ${B?`<div class="pgsel"><label class="pgn" for="pgFrom">Desde<input id="pgFrom" type="number" inputmode="numeric" min="${B.min}" max="${B.max}" value="${pg.from}"></label><label class="pgn" for="pgTo">Hasta<input id="pgTo" type="number" inputmode="numeric" min="${B.min}" max="${B.max}" value="${pg.to}"></label></div>
  <p class="note" id="pgInfo"></p><button class="btn red block" data-act="pgGo">Ver estas páginas</button>`:`<p class="note">Este libro todavía no tiene el índice por página.</p>`}
  ${S.pend&&S.pend.length?`<section class="sec"><h2 class="sec-t">Tus pendientes</h2>${pendList()}</section>`:""}`);
  const f=document.getElementById("pgFrom"),t=document.getElementById("pgTo");if(!f)return;
  const upd=()=>{let a=+f.value||B.min,z=+t.value||a;pg.from=Math.max(B.min,Math.min(B.max,a));pg.to=Math.max(pg.from,Math.min(B.max,z));const ls=lessonsOf(pg.b,pg.from,pg.to);
   document.getElementById("pgInfo").textContent=(ls.length?ls.map(n=>lbl(pg.b,n)).join(", ")+" · ":"")+(pg.to-pg.from+1)+(pg.to===pg.from?" página":" páginas")+(pg.to-pg.from>40?" · es mucho: probá con menos":"")};
  f.addEventListener("input",()=>{if(+t.value<+f.value)t.value=f.value;upd()});t.addEventListener("input",upd);upd()}}

/* --- lo principal (marcado a mano en principal.js) y las estrellas de Agus --- */
let LKEYS=null;
function lByKey(k){if(!LKEYS){LKEYS=new Map();(FORMAS&&FORMAS.L||[]).forEach((L,i)=>{const kk=trKey(L[0]);if(!LKEYS.has(kk))LKEYS.set(kk,i)})}const i=LKEYS.get(k);return i==null?null:FORMAS.L[i]}
function lookupWord(s){const [ru0,es0]=String(s).split("|");const ru=A(ru0.trim());const k=trKey(ru);const app=appIdx().get(k)||[];const base=app.find(e=>!e.what)||null;const L=lByKey(k);
 return {ru:base?base.ru:ru,es:(es0||"").trim()||(base&&base.es)||(L&&L[1])||"",kind:(base&&base.kind)||(L&&L[2])||"",key:k}}
function conjOf(w){const v=allVerbs().find(x=>trKey(x.inf)===w.key);if(v&&v.forms)return `${bare(PRON[0])} ${v.forms[0]}, ты ${v.forms[1]}, они ${v.forms[5]}`;
 const p=PAIRS.find(x=>trKey(x.ip)===w.key||trKey(x.pf)===w.key);if(p){const f=trKey(p.ip)===w.key?p.pres:p.fut;if(f&&f[0])return `я ${f[0]}, ты ${f[1]}, они ${f[2]}`}return ""}
const starKey=(b,p)=>b+":"+p;
function starsOf(b,p){return ((S.star||{})[starKey(b,p)]||[])}
function isStar(b,p,ru){return starsOf(b,p).some(x=>trKey(x)===trKey(ru))}
function toggleStar(b,p,ru){if(!S.star)S.star={};const k=starKey(b,p);const a=S.star[k]||[];const i=a.findIndex(x=>trKey(x)===trKey(ru));if(i>=0)a.splice(i,1);else a.push(ru);if(a.length)S.star[k]=a;else delete S.star[k];save();tick()}
function principalData(b,from,to){const out=[],keys=new Set();const P=(PRINCIPAL[b]||{});
 for(let p=from;p<=to;p++){const e=P[p];if(e){const words=(e[1]||[]).map(lookupWord);words.forEach(w=>keys.add(w.key));out.push({page:p,t:A(e[0]),n:A(e[2]||""),words})}}
 const stars=[];for(let p=from;p<=to;p++)starsOf(b,p).forEach(ru=>{const w=lookupWord(ru);if(!keys.has(w.key)){keys.add(w.key);stars.push(Object.assign(w,{page:p}))}});
 let missing=0;for(let p=from;p<=to;p++)if(!P[p])missing++;
 return {pages:out,stars,keys,missing}}
function chip(b,page,w){const on=isStar(b,page,w.ru);const cj=/^verbo/.test(w.kind)?conjOf(w):"";
 return `<div class="pw"><span class="r ru">${esc(w.ru)}</span><span class="e">${w.es?esc(w.es):'<span class="trm">tocá para traducir</span>'}</span>${cj?`<span class="cj ru">${cj.split(", ").map(esc).join("<br>")}</span>`:""}<button class="star" data-act="pgStar" data-p="${page}" data-w="${esc(w.ru)}" aria-pressed="${on}" aria-label="${on?"Sacar la estrella":"Marcar con estrella"}">${on?"★":"☆"}</button></div>`}

/* --- ver un tramo --- */
function pendOf(b,f,t){return (S.pend||[]).find(x=>x.b===b&&x.from===f&&x.to===t)}
function openRange(b,from,to,flt){if(flt)pg.f=flt;pg.b=b;pg.from=from;pg.to=to;curOv=()=>openRange(b,from,to);
 if(!FORMAS){cargarFormas().then(()=>openRange(b,from,to));return}
 {const D=rangeData(b,from,to);const PD=principalData(b,from,to);const pe=pendOf(b,from,to);
  const tabs=[["all","Todo"],["res","Resumen"],["w","Palabras"],["v","Verbos"],["p","Pares"]];const f=pg.f;
  const sec=(k,t,n,body)=>(f==="all"||f===k)?`<section class="sec"><h2 class="sec-t">${t} <span class="counter">${n}</span></h2>${body}</section>`:"";
  const wHTML=list=>`<div class="pwgrid">${list.map(e=>chip(b,e.page,e)).join("")}</div>`;
  const vHTML=list=>`<div class="vgroup">${list.map(e=>{const v=allVerbs().find(x=>trKey(x.inf)===trKey(e.ru));return v?verbRow(v):`<div class="vrow" style="cursor:default"><span><b class="ru">${esc(e.ru)}</b><br><span class="e">${esc(e.es||"")}</span></span><span class="meta">${esc(e.kind.replace("verbo ",""))}</span></div>`}).join("")}</div>`;
  const tr=D.W.filter(e=>e.es),sin=D.W.filter(e=>!e.es);const total=D.W.length+D.V.length;
  const principal=PD.pages.map(x=>`<div class="gpoint pcard"><span class="trs-src">p. ${x.page}</span><h3 class="ru">${esc(x.t)}</h3>${x.n?`<p>${esc(x.n)}</p>`:""}${x.words.length?`<div class="pwgrid">${x.words.map(w=>chip(b,x.page,w)).join("")}</div>`:""}</div>`).join("");
  const body=`<div class="les-hero" style="background:var(--mint)"><span class="n" style="font-size:15px">${from===to?from:from+"–"+to}</span><div><div class="w">${esc(bookName(b))}</div><div style="font-weight:700">${esc(lessonsOf(b,from,to).map(n=>lbl(b,n)).join(", ")||"")}</div></div></div>
  <div class="steps3"><button class="btn red" data-act="pgPlay">Jugar con lo principal</button>${pe?`<button class="btn" data-act="pgKnow">Ya lo sé ✓</button>`:`<button class="btn" data-act="pgPend">Dejar pendiente</button>`}</div>
  ${pe?`<p class="banner"><b>Pendiente</b>Está en tu Inicio desde el ${fmtDate(pe.at).d} ${fmtDate(pe.at).m}. Cuando ya lo sepas, tocá «Ya lo sé».</p>`:""}
  <section class="sec"><h2 class="sec-t">Lo principal</h2>
   ${principal||`<p class="note">Estas páginas todavía no tienen «lo principal» marcado. Abrí «Todo lo que aparece» y marcá con ☆ lo que quieras repasar.</p>`}
   ${PD.pages.length&&PD.missing?`<p class="note">${PD.missing===1?"Una página":PD.missing+" páginas"} de este tramo todavía no ${PD.missing===1?"está marcada":"están marcadas"}.</p>`:""}
   ${PD.stars.length?`<h3 class="sub">Marcadas por vos ★</h3><div class="pwgrid">${PD.stars.map(w=>chip(b,w.page,w)).join("")}</div>`:""}
   <p class="note">Con ☆ marcás lo que querés repasar además de esto; tocá de nuevo para sacarlo. El juego usa lo principal y lo que marcaste.</p>
   <button class="btn block" data-act="pgExplain">Explicámelo de otra forma</button></section>
  <details class="hist pall" ${pg.open?"open":""}><summary><b>Todo lo que aparece en estas páginas</b> · ${total} palabras, también las de los ejercicios</summary>
  <div class="sec" style="margin-top:12px">
  <div class="pfil" role="group" aria-label="Mostrar">${tabs.map(t=>`<button data-act="pgF" data-f="${t[0]}" aria-pressed="${f===t[0]}">${t[1]}</button>`).join("")}</div>
  ${sec("res","Resumen de la lección",D.R.length,D.R.length?D.R.map(x=>`<div class="gpoint"><h3 class="ru">${esc(x.g[0])}</h3><p>${esc(x.g[1])}</p>${x.g[2].map(e=>`<p class="exm ru">${esc(e)}</p>`).join("")}<span class="trs-src">p. ${x.page}</span></div>`).join(""):`<p class="note">Sin temas del resumen en estas páginas.</p>`)}
  ${sec("w","Palabras",D.W.length,(tr.length?wHTML(tr):"")+(sin.length?wHTML(sin):"")+(!D.W.length?`<p class="note">No encontré palabras en estas páginas.</p>`:""))}
  ${sec("v","Verbos",D.V.length,D.V.length?wHTML(D.V):`<p class="note">No hay verbos en estas páginas.</p>`)}
  ${sec("p","Pares",D.pairs.length,D.pairs.length?pairsTable(D.pairs):`<p class="note">No hay pares de aspecto en estas páginas.</p>`)}</div></details>`;
  overlay(pgLabel(b,from,to),body);const det=ov.querySelector("details.pall");if(det)det.addEventListener("toggle",()=>{pg.open=det.open})}}

/* --- pendientes --- */
function pendList(){const ps=(S.pend||[]).slice().sort((a,b)=>(a.last||a.at).localeCompare(b.last||b.at));
 return `<div class="pends">${ps.map(p=>`<div class="pdrow"><button class="pdrow-o" data-act="pgOpen" data-b="${p.b}" data-f="${p.from}" data-t="${p.to}"><b>${esc(pgLabel(p.b,p.from,p.to))}</b><span>${p.last?"repasado "+haceTxt(p.last):"anotado "+haceTxt(p.at)}</span></button><button class="btn sm" data-act="pgKnowId" data-id="${p.id}">Ya lo sé</button></div>`).join("")}</div>`}
function haceTxt(d){const n=Math.round((pd(today())-pd(d))/864e5);return n<=0?"hoy":n===1?"ayer":"hace "+n+" días"}
function pendAdd(){if(!S.pend)S.pend=[];if(pendOf(pg.b,pg.from,pg.to))return;S.pend.push({id:uid(),b:pg.b,from:pg.from,to:pg.to,at:today(),last:null});save();toast("Anotado en Pendientes, en Inicio");tick()}
function pendDone(id){const p=(S.pend||[]).find(x=>x.id===id);if(!p)return;S.pend=S.pend.filter(x=>x.id!==id);addXP(10);save();tick(true);toast("¡Bien! "+pgLabel(p.b,p.from,p.to)+" pasa al repaso de siempre · +10")}
function oldestPend(){const ps=(S.pend||[]).slice().sort((a,b)=>(a.last||a.at).localeCompare(b.last||b.at));return ps[0]||null}

/* --- juego mezclado: 2 tarjetas, 3 opciones, 3 para escribir --- */
let pj=null;
function pgPlay(){const D=rangeData(pg.b,pg.from,pg.to);
 const PD=principalData(pg.b,pg.from,pg.to);let pool=PD.pages.flatMap(x=>x.words).concat(PD.stars).filter(e=>e.es).map(e=>({ru:e.ru,es:e.es,key:e.key}));
 {const seenK=new Set();pool=shuffle(pool.filter(e=>!seenK.has(e.key)&&seenK.add(e.key)))}
 let mainPairs=D.pairs.filter(p=>PD.keys.has(trKey(p.ip))||PD.keys.has(trKey(p.pf)));
 if(pool.length<3){toast("Acá hay poco marcado como principal: juego con todo lo de estas páginas");pool=shuffle(D.W.concat(D.V).filter(e=>e.es)).map(e=>({ru:e.ru,es:e.es}));mainPairs=D.pairs}
 const pairQ=shuffle(mainPairs).map(p=>Math.random()<.5?{ru:p.pf,es:p.es,ask:"El perfectivo de «"+bare(p.ip)+"»",ans:p.pf}:{ru:p.ip,es:p.es,ask:"El imperfectivo de «"+bare(p.pf)+"»",ans:p.ip});
 if(pool.length+pairQ.length<3){toast("En estas páginas hay muy poco para jugar: probá con más páginas");return}
 const items=[];let k=0;const take=()=>pool[k++%pool.length];
 for(let i=0;i<2&&pool.length;i++)items.push(Object.assign({t:"flip"},take()));
 for(let i=0;i<3&&pool.length;i++){const it=take();let others=shuffle(pool.filter(x=>x.ru!==it.ru)).slice(0,3).map(x=>x.ru);
  if(others.length<3)others=others.concat(shuffle(FORMAS.L.filter(L=>L[1]&&L[0]!==it.ru)).slice(0,3-others.length).map(L=>L[0]));
  items.push({t:"opt",ru:it.ru,es:it.es,opts:shuffle([it.ru].concat(others))})}
 const wr=pairQ.slice(0,2).map(q=>Object.assign({t:"write"},q));
 while(wr.length<3&&pool.length){const it=take();wr.push({t:"write",ru:it.ru,es:it.es,ask:"¿Cómo se dice «"+it.es+"»?",ans:it.ru})}
 items.push(...wr);
 pj={items,i:0,res:items.map(()=>null),ans:null,tries:0,txt:"",flip:false};renderPj()}
function renderPj(){const it=pj.items[pj.i];if(!it){finishPj();return}
 const head=`<div class="jhead"><div class="jtop"><span class="counter">${pj.i+1} de ${pj.items.length} · ${esc(rangoTxt(pg.from,pg.to))}</span><span class="jkind"><span class="k" style="--c:${it.t==="flip"?"var(--lilac)":it.t==="opt"?"var(--butter)":"var(--pink)"}">${it.t==="flip"?"Tarjeta":it.t==="opt"?"Elegí":"Escribí"}</span></span></div>
 <div class="jsteps" aria-hidden="true">${pj.items.map((_,k)=>`<i class="${pj.res[k]==="ok"?"ok":pj.res[k]==="bad"?"bad":k===pj.i?"cur":""}"></i>`).join("")}</div></div>`;
 let b="";const answered=pj.ans!=null;const ok=pj.res[pj.i]==="ok";
 if(it.t==="flip"){b=`<div class="qcard"><span class="src">¿Qué significa?</span><span class="q ru">${esc(it.ru)}</span>${pj.flip?`<span class="hint" style="font-size:18px;color:var(--ink)">${esc(it.es)}</span>`:""}</div>
  ${pj.flip?`<div class="steps3"><button class="btn" data-act="pjSelf" data-ok="0">No la sabía</button><button class="btn red" data-act="pjSelf" data-ok="1">La sabía</button></div>`:`<button class="btn red block" data-act="pjFlip">Dar vuelta</button>`}`}
 else if(it.t==="opt"){b=`<div class="qcard"><span class="src">Elegí en ruso</span><span class="q small">${esc(it.es)}</span></div><div class="opts">${it.opts.map((o,k)=>{let c="";if(answered){if(o===it.ru)c="right";else if(pj.ans===k)c="wrong"}return `<button class="opt ru ${c}" data-act="pjPick" data-k="${k}" ${answered?"disabled":""}>${esc(o)}${c==="right"?"<span>✓</span>":c==="wrong"?"<span>✗</span>":""}</button>`}).join("")}</div>
  ${answered?`<button class="btn red block" data-act="pjNext">Siguiente</button>`:""}`}
 else{b=`<div class="jcard"><p class="jq" style="font-size:19px">${esc(it.ask)}</p>
  ${answered?`<div class="fb ${ok?"ok":"bad"}"><b class="t">${ok?(pj.tries?"¡Bien, a la segunda!":"¡Bien!"):"Era «"+esc(it.ans)+"»"}</b>${it.es&&it.ask.indexOf(it.es)<0?`<p>${esc(it.es)}</p>`:""}</div><button class="btn red block" data-act="pjNext">${pj.i+1<pj.items.length?"Siguiente":"Ver cómo me fue"}</button>`
  :`<div class="jin"><input id="pjIn" class="ru" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Escribí en ruso" value="${esc(pj.txt)}" aria-label="Tu respuesta"><button class="btn red" data-act="pjCheck">Listo</button></div>
   ${pj.tries?`<div class="fb hint"><b class="t">Casi</b><p>Empieza con «${esc(bare(it.ans).slice(0,2))}…». Probá otra vez.</p></div>`:`<button class="linkbtn" data-act="pjHint" style="align-self:center">Necesito una pista</button>`}${pj.hint&&!pj.tries?`<div class="fb hint"><b class="t">Pista</b><p>Tiene ${bare(it.ans).replace(/\s/g,"").length} letras y empieza con «${esc(bare(it.ans)[0])}».</p></div>`:""}`}</div>`}
 overlay(pgLabel(pg.b,pg.from,pg.to),head+b,{backAct:"pjQuit"});const inp=document.getElementById("pjIn");if(inp){setTimeout(()=>{try{inp.focus({preventScroll:true})}catch(e){}},60);inp.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();pjCheck()}})}}
function pjCheck(){const inp=document.getElementById("pjIn");if(!inp)return;const v=inp.value.trim();if(!v){toast("Escribí la respuesta primero");return}pj.txt=v;const it=pj.items[pj.i];const ok=norm(v)===norm(it.ans);
 if(ok||pj.tries>=1){pj.ans=v;pj.res[pj.i]=ok?"ok":"bad";tick(!ok);renderPj();return}pj.tries=1;tick(true);renderPj()}
function pjNext(){pj.i++;pj.ans=null;pj.tries=0;pj.txt="";pj.flip=false;pj.hint=false;renderPj()}
function finishPj(){const ok=pj.res.filter(x=>x==="ok").length,n=pj.items.length;addXP(ok);const pe=pendOf(pg.b,pg.from,pg.to);if(pe){pe.last=today()}save();
 const miss=pj.items.filter((_,k)=>pj.res[k]==="bad");
 overlay(pgLabel(pg.b,pg.from,pg.to),`<div class="jend fade-in"><div class="score"><span class="n">${ok}/${n}</span><span class="t">${ok===n?"¡Perfecto!":ok>=n-2?"¡Muy bien!":"Vamos sumando."}<br><span class="note" style="color:var(--ink)">+${ok} puntos</span></span></div>
 ${miss.length?`<section class="sec"><h2 class="sec-t">Para mirar otra vez</h2><div class="rlist2">${miss.map(it=>`<div class="rli"><b class="ru">${esc(it.ans||it.ru)}</b><span class="x">${esc(it.es)}</span></div>`).join("")}</div></section>`:""}
 ${pe?`<button class="btn red block" data-act="pgKnow">Ya lo sé: sacar de pendientes</button>`:miss.length?`<button class="btn red block" data-act="pgPend">Dejar pendiente</button>`:""}
 <button class="btn block" data-act="pgPlay">Otra ronda</button><button class="btn block" data-act="pjBack">Volver a las páginas</button></div>`,{backAct:"pjBack"});if(ok>=n-1)tick()}
function pgExplain(){const PD=principalData(pg.b,pg.from,pg.to);const D=rangeData(pg.b,pg.from,pg.to);const temas=(PD.pages.length?PD.pages.map(x=>bare(x.t)+(x.words.length?" ("+x.words.map(w=>bare(w.ru)).join(", ")+")":"")):D.R.map(x=>bare(x.g[0]))).join("; ");
 const q=`Estoy repasando ${bare(bookName(pg.b))}, ${rangoTxt(pg.from,pg.to)}${temas?" (temas: "+temas+")":""}. Explicámelo de otra forma, más simple y con otros ejemplos, como si fuera la primera vez que lo veo.`;
 if(IA_URL){overlay("Explicación",`<div class="tria"><p class="note">Pensando…</p></div>`,{backAct:"pjBack"});
  iaPedir({tarea:"explicar",texto:q,visto:seenSummary()}).then(r=>{overlay("Explicación",`<div class="tria"><p class="pre">${esc(r.t||"")}</p>${r.notas&&r.notas.length?`<ul class="plain small">${r.notas.map(n=>`<li>${esc(n)}</li>`).join("")}</ul>`:""}</div>`,{backAct:"pjBack"})}).catch(()=>{toast("No pude conectar con la IA: te copio el pedido");copyText(askPrompt(q))})}
 else copyText(askPrompt(q),"Pedido copiado: pegalo en tu IA")}
