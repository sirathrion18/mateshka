/* Матешка · juegos diarios: Casos (2 casos por día, rotan según tus errores) y Verbos (aspecto: elegir, conjugar, mini historia).
   Método de la profe: primero pensás; la pista ayuda sin dar la respuesta; la explicación llega después. */
"use strict";
const VMODES=["elegir","conjugar","historia"];
const VMODE_NAME={elegir:"Elegir el aspecto",conjugar:"Conjugar",historia:"Mini historia"};
const dayNum=d=>Math.floor(pd(d||today()).getTime()/864e5);
function rng(seed){let s=seed>>>0||1;return ()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
const ACH=deep(ASPECT_CHOOSE),ACJ=deep(ASPECT_CONJ),STO=deep(STORIES);
const daysSince=d=>d?Math.max(0,dayNum()-dayNum(d)):99;

/* --- qué casos tocan hoy: más peso a los que más te cuestan y a los que hace más que no salen --- */
function casesPick(){const d=day();if(Array.isArray(d.cp)&&d.cp.length)return d.cp;
 const r=rng(hash("c"+today()));const pool=[1,2,3,4,5].map(c=>({c,w:1+2*(S.g.cerr[c]||0)+Math.min(6,daysSince(S.g.clast[c]))}));const out=[];
 for(let k=0;k<2;k++){const tot=pool.reduce((a,x)=>a+x.w,0);let t=r()*tot;let i=0;for(;i<pool.length-1;i++){t-=pool[i].w;if(t<=0)break}out.push(pool[i].c);pool.splice(i,1)}
 d.cp=out.sort((a,b)=>a-b);saveLocal();return d.cp}
function verbMode(){const d=day();if(d.vm)return d.vm;return VMODES[dayNum()%3]}

/* --- armar preguntas de casos --- */
const VOW=/^[аеёиоуыэюя]/i;
function fitPrep(tpl,ans){let s=tpl;const b=bare(ans).toLowerCase();
 if(/(^| )о ___/.test(s)&&VOW.test(b))s=s.replace(/(^| )о ___/,"$1об ___");
 if(/(^| )с ___/.test(s)&&/^(с|з|ш|ж|щ)[^аеёиоуыэюя]/.test(b))s=s.replace(/(^| )с ___/,"$1со ___");
 if(/(^| )в ___/.test(s)&&/^(в|ф)[^аеёиоуыэюя]/.test(b))s=s.replace(/(^| )в ___/,"$1во ___");
 if(/(^| )к ___/.test(s)&&/^(к|г)[^аеёиоуыэюя]/.test(b))s=s.replace(/(^| )к ___/,"$1ко ___");
 return s}
function ruleKey(c,n,num){const d=n.d||n.g;if(num==="p"){if(c===3)return d==="n"?"pn":"p"+d+(n.an?"a":"i");return "p"+d}if(c===3&&d==="m")return n.an?"ma":"mi";return d}
function caseItem(c,type,used,r){const tpls=shuffle(CASE_TPL[c]);
 for(const t of tpls){if(used.t.has(c+t[0]))continue;const tags=t[1].split(" ");
  const ns=NOUNS.filter(n=>!used.n.has(n.w)&&n.t.split(" ").some(x=>tags.includes(x))&&(t[2]!=="p"||n.p));if(!ns.length)continue;
  const n=ns[Math.floor(r()*ns.length)];const num=t[2]==="sp"?(n.p&&r()<.4?"p":"s"):t[2];const F=n[num].split(",");const ans=F[c];
  used.t.add(c+t[0]);used.n.add(n.w);
  const it={kind:"case",type,c,w:n.w,g:n.g,an:n.an,num,es:n.es,nota:(num==="p"?n.np:n.nota)||"",ans,tpl:fitPrep(t[0],ans),hint:t[3],rule:CASE_RULE[c][ruleKey(c,n,num)]};
  if(type==="elegir"){const o=[ans];shuffle(F.concat(num==="s"&&n.p?n.p.split(","):[])).forEach(f=>{if(o.length<4&&!o.some(x=>norm(x)===norm(f)))o.push(f)});it.opts=shuffle(o)}
  return it}
 return null}
function buildCases(){const cp=casesPick();const r=rng(hash("cg"+today()+(jgRound||0)));const used={t:new Set(),n:new Set()};
 const plan=[["elegir",0],["completar",1],["elegir",1],["completar",0],["elegir",0]];
 const items=plan.map(([t,k])=>caseItem(cp[k%cp.length],t,used,r)||caseItem(cp[(k+1)%cp.length],t,used,r)).filter(Boolean);
 const fc=cp.slice().sort((a,b)=>(S.g.cerr[b]||0)-(S.g.cerr[a]||0))[0];const fr=CASE_FREE[fc];
 items.push({kind:"case",type:"propia",c:fc,ask:fr[Math.floor(r()*fr.length)]});return items}

/* --- armar preguntas de verbos --- */
function freshFirst(list,key,salt){const r=rng(hash(salt+today()+(jgRound||0)));return list.map(x=>({x,k:(S.g.vseen[key(x)]||"")+String(r()).slice(2,8)})).sort((a,b)=>a.k<b.k?-1:a.k>b.k?1:0).map(o=>o.x)}
function buildVerbs(mode){const L=a2Reach();
 const ch=ACH.filter(q=>q.l<=L),cj=ACJ.filter(q=>q.l<=L),st=STO.filter(q=>q.l<=L);
 const choose=n=>freshFirst(ch,q=>"c:"+q.ru,"vc").slice(0,n).map(q=>({kind:"aspect",type:"elegir",q,key:"c:"+q.ru}));
 if(mode==="conjugar"&&cj.length>=3){const it=freshFirst(cj,q=>"j:"+q.ru,"vj").slice(0,5).map(q=>({kind:"aspect",type:"conjugar",q,key:"j:"+q.ru}));return it.length<5?it.concat(choose(5-it.length)):it}
 if(mode==="historia"&&st.length){const s=freshFirst(st,q=>"s:"+q.t,"vs")[0];return [{kind:"aspect",type:"historia",q:s,key:"s:"+s.t,slot:0,picks:[]}].concat(choose(1))}
 return choose(5)}
const PF_SET=new Set(PAIRS_RAW.map(p=>bare(p[1])));const IPF_SET=new Set(PAIRS_RAW.map(p=>bare(p[0])));
const partnerOf=v=>{const b=bare(v);const p=PAIRS_RAW.find(x=>bare(x[0])===b||bare(x[1])===b);return p?(bare(p[0])===b?A(p[1]):A(p[0])):null};

/* --- estado del juego en curso --- */
let jg=null,jgRound=0;
function startGame(kind,practice){jg={kind,practice:!!practice,i:0,res:[],tries:0,hint:false,ans:null,txt:"",items:kind==="cases"?buildCases():buildVerbs(verbMode()),date:today(),mode:kind==="verbs"?verbMode():null};
 jg.res=jg.items.map(()=>null);renderGame()}
function openCases(){const d=day();if(jg&&jg.kind==="cases"&&jg.date===today()&&jg.i<jg.items.length){renderGame();return}if(d.c){gameDone("cases");return}startGame("cases")}
function openVerbs(){const d=day();if(jg&&jg.kind==="verbs"&&jg.date===today()&&jg.i<jg.items.length){renderGame();return}if(d.v){gameDone("verbs");return}startGame("verbs")}
function gTitle(){return jg.kind==="cases"?"Casos":"Verbos"}
function gSub(){return jg.kind==="cases"?caseLabel(casesPick()):VMODE_NAME[jg.mode]}
function stepsHTML(){return `<div class="jsteps" aria-hidden="true">${jg.items.map((_,k)=>`<i class="${jg.res[k]==="ok"?"ok":jg.res[k]==="bad"?"bad":k===jg.i?"cur":""}"></i>`).join("")}</div>`}
const KIND_LABEL={elegir:["Elegí","var(--lilac)"],completar:["Completá","var(--butter)"],propia:["Tu oración","var(--pink)"],conjugar:["Conjugá","var(--butter)"],historia:["Mini historia","var(--mint)"]};

function renderGame(){if(!jg)return;if(jg.i>=jg.items.length){finishGame();return}
 const it=jg.items[jg.i];const kl=KIND_LABEL[it.type];let body="";
 const head=`<div class="jhead"><div class="jtop"><span class="counter">${jg.i+1} de ${jg.items.length} · ${esc(gSub())}${jg.practice?" · práctica":""}</span><span class="jkind"><span class="k" style="--c:${kl[1]}">${kl[0]}</span></span></div>${stepsHTML()}</div>`;
 if(it.kind==="case")body=caseHTML(it);else body=aspectHTML(it);
 overlay(gTitle(),head+body);
 const inp=document.getElementById("jIn");if(inp&&jg.ans==null){setTimeout(()=>{try{inp.focus({preventScroll:true})}catch(e){}},60);inp.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();checkTyped()}})}
 const ta=document.getElementById("jTxt");if(ta)ta.addEventListener("input",()=>{jg.txt=ta.value})}
function gapSent(tpl,fill,cls){const parts=esc(tpl).split("___");return parts[0]+`<span class="gap ${cls||""}">${fill?esc(fill):"&nbsp;?&nbsp;"}</span>`+(parts[1]||"")}
function nextBtn(){return `<button class="btn red block" data-act="jNext">${jg.i+1<jg.items.length?"Siguiente":"Ver cómo me fue"}</button>`}
function caseHTML(it){const num=it.num==="p"?"plural":"singular";
 if(it.type==="propia"){const done=jg.res[jg.i]==="ok";
  return `<div class="jcard"><p class="note" style="color:var(--ink);font-weight:600">${esc(it.ask)}</p><p class="note">Caso: <b>${CASE_NAME[it.c]}</b> (<span class="ru">${esc(A(CASE_RU[it.c]))}</span>). Una o dos oraciones con palabras que conozcas.</p>
   <textarea id="jTxt" class="wtext ru" rows="3" placeholder="Escribí en ruso" spellcheck="false" ${done?"readonly":""}>${esc(jg.txt)}</textarea>
   ${done?`<div class="fb ok"><b class="t">Guardada en tus redacciones</b><p>Si querés que te la corrijan, copiá el pedido y pegalo en tu IA.</p></div><div class="steps3"><button class="btn" data-act="jCopy">Copiar el pedido</button><a class="btn" href="https://gemini.google.com/app" target="_blank" rel="noopener">Abrir Gemini</a></div>${nextBtn()}`
   :`<button class="btn red block" data-act="jSave">Guardar mi oración</button><button class="linkbtn" data-act="jSkip" style="align-self:center">Saltear esta</button>`}</div>`}
 const answered=jg.ans!=null;const ok=answered&&jg.res[jg.i]==="ok";
 let h=`<div class="jcard"><p class="jq ru">${gapSent(it.tpl,answered?it.ans:"",answered?(ok?"ok":""):"")}</p>
  <div class="jw"><span class="wbase">${esc(it.w)}</span><span class="note">${esc(it.es)} · ${num}${it.nota?" · "+esc(it.nota):""}</span></div>
  <p class="note">Ponela en <b>${CASE_NAME[it.c]}</b> (<span class="ru">${esc(A(CASE_RU[it.c]))}</span>).</p>`;
 if(jg.hint&&!answered)h+=`<div class="fb hint"><b class="t">Pista</b><p>${esc(it.hint)}</p>${jg.tries>0?`<p>${esc(it.rule)}</p>`:""}</div>`;
 if(it.type==="elegir"){h+=`<div class="opts">${it.opts.map((o,k)=>{let c="";if(answered){if(norm(o)===norm(it.ans))c="right";else if(jg.ans===k)c="wrong"}return `<button class="opt ru ${c}" data-act="jPick" data-k="${k}" ${answered?"disabled":""}>${esc(o)}${c==="right"?"<span>✓</span>":c==="wrong"?"<span>✗</span>":""}</button>`}).join("")}</div>`}
 else if(!answered){h+=`<div class="jin"><input id="jIn" class="ru" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Escribí la forma" value="${esc(jg.txt)}" aria-label="Tu respuesta"><button class="btn red" data-act="jCheck">Listo</button></div>
  ${jg.tries>0?`<div class="fb hint"><b class="t">Casi</b><p>${esc(it.rule)}</p><p>Probá otra vez.</p></div>`:""}`}
 if(answered)h+=`<div class="fb ${ok?"ok":"bad"}"><b class="t">${ok?(jg.tries>0?"¡Bien, a la segunda!":pick(["¡Bien!","¡Eso!","Отлично!","¡Perfecto!"])):"Era «"+esc(it.ans)+"»"}</b><p>${esc(it.rule)}</p>${it.nota?`<p>Ojo con esta palabra: ${esc(it.nota)}.</p>`:""}${it.type==="completar"&&!ok&&jg.txt?`<p>Escribiste «${esc(jg.txt)}».</p>`:""}</div>${nextBtn()}`;
 else if(!jg.hint)h+=`<button class="linkbtn" data-act="jHint" style="align-self:center">Necesito una pista</button>`;
 return h+`</div>`}
function aspectHTML(it){const q=it.q;const answered=jg.ans!=null;const ok=answered&&jg.res[jg.i]==="ok";
 const aspHint="¿Habla de un proceso, una duración o una costumbre (imperfectivo), o de un resultado, algo que se termina una vez (perfectivo)?";
 if(it.type==="historia"){const s=q.s;const k=it.slot;let n=0;
  const text=esc(q.text).replace(/\[\[(\d)\]\]/g,(m,d)=>{const j=+d;const p=it.picks[j];const cls=p==null?(j===k?"cur":""):(p===s[j][2]?"ok":"bad");return `<span class="slot ${cls}">${p==null?(j===k?"?":"…"):esc(s[j][s[j][2]])}</span>`});
  const fin=k>=s.length;const last=it.picks.length?it.picks.length-1:-1;
  let h=`<div class="jcard"><p class="jkind">${esc(q.t)} · ${esc(q.src)}</p><p class="story ru">${text}</p>`;
  if(last>=0&&(jg.showWhy)){const j=last,good=it.picks[j]===s[j][2];h+=`<div class="fb ${good?"ok":"bad"}"><b class="t">${good?"¡Bien!":"Era «"+esc(s[j][s[j][2]])+"»"}</b><p>${esc(s[j][3])}</p></div>`}
  if(!fin){if(jg.hint)h+=`<div class="fb hint"><b class="t">Pista</b><p>${aspHint}</p></div>`;
   h+=`<p class="note">Hueco ${k+1} de ${s.length}: ¿cuál va?</p><div class="opts">${[0,1].map(o=>`<button class="opt ru" data-act="jSlot" data-k="${o}">${esc(s[k][o])}</button>`).join("")}</div>${jg.hint?"":`<button class="linkbtn" data-act="jHint" style="align-self:center">Necesito una pista</button>`}`}
  else{const good=it.picks.filter((p,j)=>p===s[j][2]).length;h+=`<div class="fb ${good===s.length?"ok":"hint"}"><b class="t">${good} de ${s.length} huecos bien</b><p>Leela de nuevo entera, en voz alta si podés.</p></div>${nextBtn()}`}
  return h+`</div>`}
 let h=`<div class="jcard"><p class="jq ru">${gapSent(q.ru,answered?(it.type==="elegir"?q.o[q.a]:q.a):"",answered&&ok?"ok":"")}</p>`;
 if(it.type==="conjugar"){const pf=PF_SET.has(bare(q.v)),pr=partnerOf(q.v);h+=`<div class="jw"><span class="wbase">${esc(A(q.v))}</span>${pr?`<span class="note">${pf?"perfectivo":"imperfectivo"} · su pareja: <span class="ru">${esc(pr)}</span></span>`:""}</div>`;
  if(jg.hint&&!answered)h+=`<div class="fb hint"><b class="t">Pista</b><p>${pf?"Es perfectivo: su forma conjugada ya es futuro (no tiene presente).":IPF_SET.has(bare(q.v))?"Es imperfectivo: conjugado, es presente.":"Fijate la persona y el tiempo que pide la frase."}</p></div>`;
  if(!answered)h+=`<div class="jin"><input id="jIn" class="ru" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Escribí la forma" value="${esc(jg.txt)}" aria-label="Tu respuesta"><button class="btn red" data-act="jCheck">Listo</button></div>${jg.tries>0?`<div class="fb hint"><b class="t">Casi</b><p>Revisá la persona (я, ты, он…) y si el verbo es perfectivo. Probá otra vez.</p></div>`:""}`}
 else{if(jg.hint&&!answered)h+=`<div class="fb hint"><b class="t">Pista</b><p>${aspHint}</p></div>`;
  h+=`<div class="opts">${q.o.map((o,k)=>{let c="";if(answered){if(k===q.a)c="right";else if(jg.ans===k)c="wrong"}return `<button class="opt ru ${c}" data-act="jPick" data-k="${k}" ${answered?"disabled":""}>${esc(A(o))}${c==="right"?"<span>✓</span>":c==="wrong"?"<span>✗</span>":""}</button>`}).join("")}</div>`}
 if(answered)h+=`<div class="fb ${ok?"ok":"bad"}"><b class="t">${ok?(jg.tries>0?"¡Bien, a la segunda!":pick(["¡Bien!","¡Eso!","Отлично!","¡Perfecto!"])):"Era «"+esc(A(it.type==="elegir"?q.o[q.a]:q.a))+"»"}</b><p>${esc(A(q.why))}</p>${q.src?`<p class="note">${esc(q.src)}</p>`:""}</div>${nextBtn()}`;
 else if(!jg.hint)h+=`<button class="linkbtn" data-act="jHint" style="align-self:center">Necesito una pista</button>`;
 return h+`</div>`}

/* --- respuestas --- */
function markRes(ok){const it=jg.items[jg.i];jg.res[jg.i]=ok?"ok":"bad";tick(!ok);
 if(it.kind==="case"&&it.c){S.g.cerr[it.c]=Math.max(0,(S.g.cerr[it.c]||0)+(ok&&jg.tries===0?-.5:1))}
 if(it.kind==="aspect")S.g.vseen[it.key]=today();saveLocal()}
function jPick(k){if(jg.ans!=null)return;const it=jg.items[jg.i];jg.ans=k;
 const ok=it.kind==="case"?norm(it.opts[k])===norm(it.ans):k===it.q.a;markRes(ok);renderGame()}
function checkTyped(){const inp=document.getElementById("jIn");if(!inp)return;const v=inp.value.trim();if(!v){toast("Escribí la forma primero");return}jg.txt=v;const it=jg.items[jg.i];
 const ans=it.kind==="case"?it.ans:it.q.a;const ok=norm(v)===norm(ans);
 if(ok||jg.tries>=1){jg.ans=v;markRes(ok);renderGame();return}
 jg.tries=1;jg.txt=v;tick(true);renderGame();const n=document.getElementById("jIn");if(n){n.select()}}
function jSlot(k){const it=jg.items[jg.i];const s=it.q.s;const j=it.slot;it.picks[j]=+k;it.slot++;jg.showWhy=true;jg.hint=false;tick(+k!==s[j][2]);
 if(it.slot>=s.length){const good=it.picks.filter((p,x)=>p===s[x][2]).length;jg.res[jg.i]=good>=s.length-1?"ok":"bad";S.g.vseen[it.key]=today();saveLocal()}
 renderGame()}
function jNext(){jg.i++;jg.ans=null;jg.tries=0;jg.hint=false;jg.txt="";jg.showWhy=false;renderGame();const b=document.getElementById("ovBody");if(b)b.scrollTop=0}
function jSave(){const t=(document.getElementById("jTxt")||{}).value||"";if(!t.trim()){toast("Escribí tu oración primero");return}const it=jg.items[jg.i];jg.txt=t.trim();
 S.writings.push({id:uid(),date:today(),pid:null,text:jg.txt,corr:"",tags:[],kind:"caso",title:it.ask});jg.res[jg.i]="ok";save();tick();renderGame()}
function jCopy(){const it=jg.items[jg.i];copyText(fixPrompt(it.ask+" (practico el caso "+CASE_NAME[it.c].toLowerCase()+")","juego de casos",jg.txt))}

/* --- final --- */
function finishGame(){let ok=0,n=0;jg.items.forEach((it,k)=>{if(it.type==="historia"){n+=it.q.s.length;ok+=it.picks.filter((p,j)=>p===it.q.s[j][2]).length}else{n++;if(jg.res[k]==="ok")ok++}});const d=day();const first=!jg.practice&&!(jg.kind==="cases"?d.c:d.v);
 if(first){const rec={ok,n,at:Date.now()};if(jg.kind==="cases"){d.c=Object.assign(rec,{cases:casesPick()});casesPick().forEach(c=>S.g.clast[c]=today())}else{d.v=Object.assign(rec,{mode:jg.mode});d.vm=jg.mode}addXP(5+ok*2);save()}
 else{addXP(ok);save()}
 const gained=first?5+ok*2:ok;jg.done=true;
 const miss=jg.items.map((it,k)=>({it,r:jg.res[k]})).filter(x=>x.r==="bad");
 overlay(gTitle(),`<div class="jend fade-in"><div class="score"><span class="n">${ok}/${n}</span><span class="t">${ok===n?"¡Perfecto!":ok>=n-1?"¡Muy bien!":ok>=n/2?"Bien, vamos sumando.":"Hoy costó: mañana vuelven estos casos."}<br><span class="note" style="color:var(--ink)">+${gained} puntos${jg.practice?" · práctica":""}</span></span></div>
 ${miss.length?`<section class="sec"><h2 class="sec-t">Para mirar otra vez</h2><div class="rlist2">${miss.map(({it})=>it.kind==="case"?(it.type==="propia"?`<div class="rli"><b>Tu oración</b><span class="x">La salteaste: queda para otra ronda.</span></div>`:`<div class="rli"><span class="ru">${gapSent(it.tpl,it.ans,"ok")}</span><span class="x">${esc(it.w)} → ${CASE_NAME[it.c]}: ${esc(it.rule)}</span></div>`)
  :it.type==="historia"?`<div class="rli"><b>${esc(it.q.t)}</b><span class="x">${it.q.s.map((s,j)=>it.picks[j]!==s[2]?esc(s[s[2]])+": "+esc(s[3]):"").filter(Boolean).join(" · ")}</span></div>`
  :`<div class="rli"><span class="ru">${gapSent(it.q.ru,A(it.type==="elegir"?it.q.o[it.q.a]:it.q.a),"ok")}</span><span class="x">${esc(A(it.q.why))}</span></div>`).join("")}</div></section>`:""}
 <button class="btn red block" data-act="jHome">Listo</button><button class="btn block" data-act="jAgain" data-k="${jg.kind}">Otra ronda (práctica)</button>
 ${jg.kind==="cases"?`<button class="linkbtn" data-act="jRef" style="align-self:center">Ver las tablas de ${esc(caseLabel(casesPick()))}</button>`:`<button class="linkbtn" data-act="jPairs" style="align-self:center">Ver la tabla de pares</button>`}</div>`);
 if(first){tick();afterGame()}}
function gameDone(kind){const d=day();const r=kind==="cases"?d.c:d.v;
 overlay(kind==="cases"?"Casos":"Verbos",`<div class="jend"><div class="score"><span class="n">${r.ok}/${r.n}</span><span class="t">Ya jugaste hoy.<br><span class="note" style="color:var(--ink)">Mañana ${kind==="cases"?"tocan otros casos":"cambia el juego: "+VMODE_NAME[VMODES[(dayNum()+1)%3]]}.</span></span></div>
 <button class="btn red block" data-act="jAgain" data-k="${kind}">Otra ronda (práctica)</button><button class="btn block" data-act="close">Volver</button></div>`)}
