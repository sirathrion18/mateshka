/* Матешка · Consulta: casos (animado e inanimado), pares de aspecto, verbos y adjetivos; sumar desde el material. */
"use strict";
let refTab="c",refQ="",openVerb=null,caseSel="gen",caseNum="s",pFil="all",openPair=null;
function verbRow(v){const open=openVerb===v.id;const maya=v.src!=="libro";const pf=v.group==="PF";
 return `<button class="vrow" data-act="verb" data-id="${v.id}" aria-expanded="${open}"><span><b class="ru">${esc(v.inf)}</b><br><span class="e">${esc(v.es)}</span></span><span class="meta ${maya?"maya":""}">${esc(bookName(v.book).split(" · ")[0])}<br>${lbl(v.book,v.lesson)}${maya?"<br>"+esc(v.src):""}</span></button>
 ${open?`<div class="conj"><span class="lab">${pf?"Futuro":"Presente"}</span><table>${v.forms.map((f,i)=>`<tr><td class="ru">${PRON[i]}</td><td class="ru"><b>${esc(f)}</b></td></tr>`).join("")}</table>
 ${v.past[0]?`<span class="lab">Pasado</span><table>${["он","она'","они'"].map(A).map((p,i)=>`<tr><td class="ru">${p}</td><td class="ru">${esc(v.past[i])}</td></tr>`).join("")}</table>`:""}</div>`:""}`}
function matchQ(...xs){if(!refQ)return true;const q=norm(refQ);return xs.some(x=>norm(x).includes(q))}
function endHL(base,form){const b=bare(base),f=bare(form).replace(/^(о|об|обо) /,"");let i=0;while(i<b.length&&i<f.length&&b[i]===f[i])i++;
 let k=0,cut=-1;const pre=/^(о|об|обо) /.exec(bare(form));const offset=pre?pre[0].length:0;
 for(let j=0;j<form.length;j++){if(form[j]===ST){continue}if(k===offset+i){cut=j;break}k++}
 if(cut<0)return esc(form);return esc(form.slice(0,cut))+`<b class="end">${esc(form.slice(cut))}</b>`}
/* Marca un tramo [s, e) contado sobre la palabra sin acentos. */
function markRange(form,s,e){if(s>=e)return esc(form);let out="",k=0,open=false;
 for(const ch of form){if(ch===ST){out+=ch;continue}if(k===s&&!open){out+='<b class="end">';open=true}if(k===e&&open){out+="</b>";open=false}out+=esc(ch);k++}
 return out+(open?"</b>":"")}
function diffPair(a,b){const x=bare(a),y=bare(b);if(y.length>x.length&&y.endsWith(x))return [esc(a),markRange(b,0,y.length-x.length)];let p=0;while(p<x.length&&p<y.length&&x[p]===y[p])p++;let s=0;while(s<x.length-p&&s<y.length-p&&x[x.length-1-s]===y[y.length-1-s])s++;
 return [markRange(a,p,x.length-s),markRange(b,p,y.length-s)]}
const CI={nom:0,gen:1,dat:2,acc:3,ins:4,pre:5};

/* --- tablas de casos: animado (personas, animales) e inanimado (cosas), por género y por terminación,
   en singular y en plural (el plural también separado por género). --- */
const DF=deep({
 "студе'нт":{s:["студе'нт","студе'нта","студе'нту","студе'нта","студе'нтом","о студе'нте"],p:["студе'нты","студе'нтов","студе'нтам","студе'нтов","студе'нтами","о студе'нтах"]},
 "стол":{s:["стол","стола'","столу'","стол","столо'м","о столе'"],p:["столы'","столо'в","стола'м","столы'","стола'ми","о стола'х"]},
 "геро'й":{s:["геро'й","геро'я","геро'ю","геро'я","геро'ем","о геро'е"],p:["геро'и","геро'ев","геро'ям","геро'ев","геро'ями","о геро'ях"]},
 "слова'рь":{s:["слова'рь","словаря'","словарю'","слова'рь","словарём","о словаре'"],p:["словари'","словаре'й","словаря'м","словари'","словаря'ми","о словаря'х"]},
 "подру'га":{s:["подру'га","подру'ги","подру'ге","подру'гу","подру'гой","о подру'ге"],p:["подру'ги","подру'г","подру'гам","подру'г","подру'гами","о подру'гах"]},
 "ня'ня":{s:["ня'ня","ня'ни","ня'не","ня'ню","ня'ней","о ня'не"],p:["ня'ни","нянь","ня'ням","нянь","ня'нями","о ня'нях"]},
 "писа'тель":{s:["писа'тель","писа'теля","писа'телю","писа'теля","писа'телем","о писа'теле"],p:["писа'тели","писа'телей","писа'телям","писа'телей","писа'телями","о писа'телях"]},
 "мышь":{s:["мышь","мы'ши","мы'ши","мышь","мы'шью","о мы'ши"],p:["мы'ши","мыше'й","мыша'м","мыше'й","мыша'ми","о мыша'х"]}});
for(const k of Object.keys(DF)){const v=DF[k];delete DF[k];DF[A(k)]=v}
DECL.forEach(d=>{DF[A(d.w)]={s:d.s.map(A),p:d.p.map(A)}});
/* e: terminaciones [nom, gen, dat, acc, ins, prep]; en acusativo, [animado, inanimado] cuando cambian. */
const DT=[
 {g:"m",lab:"consonante",an:"студе'нт",in:"стол",e:{s:["—","-а","-у",["-а","no cambia"],"-ом","-е"],p:["-ы / -и","-ов (-ей tras ж, ш, ч, щ)","-ам",["-ов (= gen.)","-ы / -и (= nom.)"],"-ами","-ах"]}},
 {g:"m",lab:"-й",an:"геро'й",in:"музе'й",e:{s:["-й","-я","-ю",["-я","no cambia"],"-ем","-е"],p:["-и","-ев","-ям",["-ев (= gen.)","-и (= nom.)"],"-ями","-ях"]}},
 {g:"m",lab:"-ь",an:"писа'тель",in:"слова'рь",e:{s:["-ь","-я","-ю",["-я","no cambia"],"-ем / -ём","-е"],p:["-и","-ей","-ям",["-ей (= gen.)","-и (= nom.)"],"-ями","-ях"]}},
 {g:"n",lab:"-о",an:null,in:"сло'во",e:{s:["-о","-а","-у","no cambia","-ом","-е"],p:["-а","— (sin terminación)","-ам","-а (= nom.)","-ами","-ах"]}},
 {g:"n",lab:"-е",an:null,in:"мо'ре",e:{s:["-е","-я","-ю","no cambia","-ем","-е"],p:["-я","-ей","-ям","-я (= nom.)","-ями","-ях"]}},
 {g:"n",lab:"-ие",an:null,in:"зда'ние",e:{s:["-ие","-ия","-ию","no cambia","-ием","-ии"],p:["-ия","-ий","-иям","-ия (= nom.)","-иями","-иях"]}},
 {g:"f",lab:"-а",an:"подру'га",in:"кни'га",e:{s:["-а","-ы / -и","-е","-у","-ой","-е"],p:["-ы / -и","— (sin terminación)","-ам",["— (= gen.)","-ы / -и (= nom.)"],"-ами","-ах"]}},
 {g:"f",lab:"-я",an:"ня'ня",in:"неде'ля",e:{s:["-я","-и","-е","-ю","-ей","-е"],p:["-и","-ь","-ям",["-ь (= gen.)","-и (= nom.)"],"-ями","-ях"]}},
 {g:"f",lab:"-ия",an:null,in:"аудито'рия",e:{s:["-ия","-ии","-ии","-ию","-ией","-ии"],p:["-ии","-ий","-иям","-ии (= nom.)","-иями","-иях"]}},
 {g:"f",lab:"-ь",an:"мышь",in:"тетра'дь",e:{s:["-ь","-и","-и","no cambia","-ью","-и"],p:["-и","-ей","-ям / -ам",["-ей (= gen.)","-и (= nom.)"],"-ями / -ами","-ях / -ах"]}}
].map(t=>Object.assign(t,{an:t.an&&A(t.an),in:A(t.in)}));
const GN={m:"Masculino · м.",n:"Neutro · ср.",f:"Femenino · ж."};
const endOf=(t,nm,i,kind)=>{const x=t.e[nm][i];return Array.isArray(x)?x[kind==="an"?0:1]:x};
/* «-ов (-ей tras ж, ш, ч, щ)» → la terminación en grande y la aclaración chiquita abajo, sin partir palabras. */
function endHTML(t,nm,i,kind){const x=endOf(t,nm,i,kind);const m=/^(.*?)\s*\((.+)\)$/.exec(x);return m?esc(m[1])+`<small class="en">${esc(m[2])}</small>`:esc(x)}
function exCell(w,nm,i){const f=DF[w];if(!f)return "";const base=f.s[0],form=f[nm][i];return i===0&&nm==="s"?esc(form):endHL(base,form)}
/* Un caso: tabla por terminación, singular y plural lado a lado. */
function declTable(kind,i){const rows=DT.filter(t=>t[kind]);let g0="";
 return `<div class="atab ${kind}"><div class="ah">${kind==="an"?"Animado":"Inanimado"} <small>${kind==="an"?"personas y animales":"cosas, lugares, ideas"}</small></div>
 <div class="dtab"><div class="dh"><span>Termina en</span><span>Singular</span><span>Plural</span></div>
 ${rows.map(t=>{const w=t[kind];const band=t.g!==g0?`<div class="dg">${GN[t.g]}</div>`:"";g0=t.g;
  return band+`<div class="dr"><span class="dl"><b>${esc(t.lab)}</b><span class="ru">${esc(w)}</span></span>
  <span class="dc"><span class="e ru">${endHTML(t,"s",i,kind)}</span><span class="x ru">${exCell(w,"s",i)}</span></span>
  <span class="dc"><span class="e ru">${endHTML(t,"p",i,kind)}</span><span class="x ru">${exCell(w,"p",i)}</span></span></div>`}).join("")}</div>
 ${kind==="an"?`<p class="dn">Casi no hay neutros que sean personas o animales, por eso esta tabla no tiene neutro.</p>`:""}</div>`}
/* Todos los casos: una tabla por número (singular o plural), filas por terminación y columnas por caso. */
function declAll(kind,nm){const H=["Nom.","Gen.","Dat.","Acus.","Instr.","Prep."];const rows=DT.filter(t=>t[kind]);let g0="";
 return `<div class="atab ${kind}"><div class="ah">${kind==="an"?"Animado":"Inanimado"} · ${nm==="s"?"singular":"plural"} <small>${kind==="an"?"personas y animales":"cosas"}</small></div>
 <div class="tscroll" style="border:0;border-radius:0;box-shadow:none"><table class="ctab mtab" style="min-width:640px"><thead><tr><th>Termina en</th>${H.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>
 ${rows.map(t=>{const w=t[kind];const band=t.g!==g0?`<tr class="gband"><th colspan="7">${GN[t.g]}</th></tr>`:"";g0=t.g;
  return band+`<tr><th>${esc(t.lab)}<br><span class="alt ru">${esc(DF[w].s[0])}</span></th>${H.map((_,i)=>`<td><span class="ru" style="font-weight:700">${endHTML(t,nm,i,kind)}</span><span class="x ru">${exCell(w,nm,i)}</span></td>`).join("")}</tr>`}).join("")}
 </tbody></table></div></div>`}
function allCasesHTML(){const H=["Nom.","Gen.","Dat.","Acus.","Instr.","Prep."];
 return `<div class="seg mini" role="group" aria-label="Número" style="align-self:flex-start"><button data-act="cnum" data-v="s" aria-pressed="${caseNum==="s"}">Singular</button><button data-act="cnum" data-v="p" aria-pressed="${caseNum==="p"}">Plural</button></div>
 <p class="note">Todos los casos juntos, en el mismo formato: arriba la terminación, abajo el ejemplo con el cambio en color. Deslizá la tabla para ver todas las columnas.${caseNum==="p"?" En plural, dativo, instrumental y preposicional son iguales en los tres géneros; cambian el nominativo, el genitivo y el acusativo.":""}</p>
 ${declAll("an",caseNum)}${declAll("in",caseNum)}
 <h3 class="sub">Adjetivos</h3><div class="tscroll"><table class="ctab wide"><thead><tr><th>Caso</th><th>м.</th><th>ср.</th><th>ж.</th><th>мн. (los tres)</th></tr></thead><tbody>
 ${CS.map((c,i)=>`<tr><th>${c.n}. ${H[i]}</th>${["m","n","f","pl"].map(g=>`<td class="ru">${esc(ENDS.adj[g][i])}<span style="display:block;color:var(--mute);font-size:12.5px">${esc(ADC[g][i])}</span></td>`).join("")}</tr>`).join("")}</tbody></table></div>
 <h3 class="sub">Pronombres</h3><div class="tscroll"><table class="ctab wide"><thead><tr><th>Caso</th>${PR.h.map(h=>`<th class="ru">${esc(h)}</th>`).join("")}</tr></thead><tbody>
 ${PR.rows.map((r,k)=>`<tr><th>${CS[k+1].n}. ${H[k+1]}</th>${r.map(x=>`<td class="ru">${esc(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
 <p class="note">Tablas de Primeros pasos, pp. 227–233, y del A2, pp. 304–305.</p>`}

/* --- pares de aspecto --- */
const PTYPE={p:"Con prefijo",s:"Cambia el sufijo",r:"Otra raíz"},PSHORT={p:"Prefijo",s:"Sufijo",r:"Otra raíz"};
function pairsTable(list){if(!list.length)return `<p class="note">No hay pares con ese filtro.</p>`;
 return `<div class="ptab"><div class="ph"><span>Imperfectivo</span><span>Perfectivo</span><span>Significado</span></div>
 ${list.map(p=>{const [a,b]=diffPair(p.ip,p.pf);const open=openPair===p.id;
  return `<button class="prow" data-act="pair" data-id="${p.id}" aria-expanded="${open}"><span class="ru">${a}</span><span class="ru">${b}</span><span class="es">${esc(p.es)}<span class="ptype">${PSHORT[p.type]||""} · ур. ${p.lesson}</span></span></button>
  ${open?`<div class="pform"><div><p class="lab">Presente · ${esc(bare(p.ip))}</p><span class="ru">${p.pres.filter(Boolean).map((f,i)=>`<b>${["я","ты","они'"].map(A)[i]}</b> ${esc(f)}`).join("<br>")}</span></div>
  <div><p class="lab">Futuro · ${esc(bare(p.pf))}</p><span class="ru">${p.fut.filter(Boolean).map((f,i)=>`<b>${["я","ты","они'"].map(A)[i]}</b> ${esc(f)}`).join("<br>")}</span></div>
  <p class="u">El perfectivo no tiene presente: su forma conjugada ya es futuro. El futuro del imperfectivo se arma con <span class="ru">бу'ду + infinitivo</span>.`.replace(/'/g,ST)+`</p></div>`:""}`}).join("")}</div>`}

function rRef(){
 let body="";
 if(refTab==="c"){
  const c=CS.find(x=>x.id===caseSel)||CS[1];const i=CI[c.id];
  body=`<div class="cchips" role="group" aria-label="Casos">${CS.map(x=>`<button data-act="case" data-c="${x.id}" aria-pressed="${caseSel===x.id}" aria-label="${esc(x.es)}"><b>${x.n}</b>${["Nom.","Gen.","Dat.","Acus.","Instr.","Prep."][x.n-1]}</button>`).join("")}</div>
  <button class="btn block ${caseSel==="all"?"ink":""}" data-act="case" data-c="all" aria-pressed="${caseSel==="all"}">Ver todos los casos juntos</button>`;
  if(caseSel==="all")body+=allCasesHTML();
  else body+=`<section class="case-h"><span class="case-n">${c.n}</span><div><h2 class="ru">${esc(c.ru)} паде'ж`.replace(/'/g,ST)+`</h2><p class="case-es">${esc(c.es)} · <span class="ru">${esc(c.q)}</span></p></div></section>
  <p class="lead">${esc(c.use)}</p>
  <section class="sec"><h2 class="sec-t">Terminaciones</h2>
  ${declTable("an",i)}${declTable("in",i)}
  ${i===3?`<p class="note">En acusativo, lo que vive (personas, animales) toma la forma del genitivo en el masculino singular y en todo el plural: <span class="ru">ви'жу студе'нта, студе'нтов, подру'г</span>. Lo que no vive queda igual al nominativo: <span class="ru">ви'жу стол, кни'ги</span>. El femenino en -а / -я cambia siempre en singular: <span class="ru">-у / -ю</span>; el neutro y el femenino en -ь no cambian.</p>`.replace(/'/g,ST):`<p class="note">En este caso animado e inanimado llevan la misma terminación (cambian solo en el acusativo).${i>=2?" En plural, la terminación es la misma para los tres géneros.":i===1?" En plural, el genitivo es el que más cambia según el género y la terminación: miralo fila por fila.":""}</p>`}
  <div class="tscroll"><table class="ctab"><thead><tr><th>Adjetivo</th><th>м.</th><th>ср.</th><th>ж.</th><th>мн. (los tres)</th></tr></thead><tbody><tr><th>${["Nom.","Gen.","Dat.","Acus.","Instr.","Prep."][i]}</th><td class="ru">${esc(ENDS.adj.m[i])}</td><td class="ru">${esc(ENDS.adj.n[i])}</td><td class="ru">${esc(ENDS.adj.f[i])}</td><td class="ru">${esc(ENDS.adj.pl[i])}</td></tr>
  <tr><th>Ejemplo</th><td class="ru">${esc(ADC.m[i])}</td><td class="ru">${esc(ADC.n[i])}</td><td class="ru">${esc(ADC.f[i])}</td><td class="ru">${esc(ADC.pl[i])}</td></tr></tbody></table></div></section>
  <section class="sec"><h2 class="sec-t">Cuándo se usa</h2>${c.uses.map(u=>`<div class="gpoint"><h3>${esc(u[0])}</h3><p class="exm ru">${esc(u[1])}</p></div>`).join("")}
  ${c.preps!=="—"?`<p><b>Preposiciones:</b> <span class="ru">${esc(c.preps)}</span></p>`:""}${c.verbs!=="—"?`<p><b>Verbos:</b> <span class="ru">${esc(c.verbs)}</span></p>`:""}</section>
  ${i>0?`<section class="sec"><h2 class="sec-t">Pronombres</h2><div class="word"><span class="ru">я, ты, он, она', мы, вы, они'`.replace(/'/g,ST)+`</span><span class="ru r">→ ${esc(PR.rows[i-1].join(", "))}</span></div>`:`<section class="sec">`}
  <p class="note">Tablas de Primeros pasos, pp. 227–233, y del A2, pp. 304–305.</p></section>`;
 }else if(refTab==="p"){const all=reachPairs();const list=all.filter(p=>(pFil==="all"||p.type===pFil)&&matchQ(p.ip,p.pf,p.es));
  body=`<input class="search ru" id="refSearch" type="search" placeholder="Buscar en ruso o castellano" value="${esc(refQ)}" autocomplete="off" aria-label="Buscar pares">
  <p class="note">${all.length} pares del A2 hasta la lección que estás viendo. <b>Imperfectivo</b>: proceso, costumbre, duración. <b>Perfectivo</b>: resultado, una sola vez. Tocá un par para ver cómo se conjuga.</p>
  <div class="pfil" role="group" aria-label="Filtrar">${[["all","Todos"],["p","Con prefijo"],["s","Cambia el sufijo"],["r","Otra raíz"]].map(f=>`<button data-act="pfil" data-f="${f[0]}" aria-pressed="${pFil===f[0]}">${f[1]} · ${f[0]==="all"?all.length:all.filter(p=>p.type===f[0]).length}</button>`).join("")}</div>
  ${pairsTable(list)}`;
 }else if(refTab==="v"){const vs=seenVerbs().filter(v=>matchQ(v.inf,v.es,...v.forms));
  body=`<input class="search ru" id="refSearch" type="search" placeholder="Buscar en ruso o castellano" value="${esc(refQ)}" autocomplete="off" aria-label="Buscar verbos">
  <p class="note">${seenVerbs().length} verbos de lo que viste, agrupados por cómo se conjugan. Tocá uno para ver todas sus formas. Los pares de aspecto están en «Pares».</p>`+
  VGR.map(g=>{const list=vs.filter(v=>v.group===g.id);if(!list.length)return "";
   return `<div class="vgroup"><div class="vg-head"><h3 class="ru">${esc(g.t)}</h3><p class="note">${esc(g.es)}</p>${g.e?`<div class="endings">${g.e.map((e,k)=>`<span class="ru"><b>${PRON[k].split(" ")[0]}</b>${esc(e)}</span>`).join("")}</div>`:""}</div>${list.map(verbRow).join("")}</div>`}).join("")+`<button class="btn block" data-act="import" data-k="v">+ Sumar verbos de tu material (con tu IA)</button>`;
 }else{const as=seenAdjs().filter(a=>matchQ(a.m,a.es,...a.forms));
  body=`<input class="search ru" id="refSearch" type="search" placeholder="Buscar en ruso o castellano" value="${esc(refQ)}" autocomplete="off" aria-label="Buscar adjetivos">
  <p class="note">${seenAdjs().length} adjetivos de lo que viste, en masculino, femenino, neutro y plural, separados por terminación (tipos 1 a 4 de Primeros pasos, p. 210).</p>`+
  AGR.map(g=>{const list=as.filter(a=>a.group===g.id);if(!list.length)return "";
   return `<div class="vgroup"><div class="vg-head"><h3 class="ru">${esc(g.t)} <span class="note">· ${list.length}</span></h3><div class="endings">${["м.","ж.","ср.","мн."].map((h,k)=>`<span class="ru"><b>${h}</b>${esc(g.e[k])}</span>`).join("")}</div></div>
   ${list.map(a=>`<div class="arow"><div class="top"><span><b class="ru">${esc(a.m)}</b> <span class="note">${esc(a.es)}</span></span><span class="ameta ${a.src!=="libro"?"maya":""}">${esc(bookName(a.book).split(" · ")[0])} · ${lbl(a.book,a.lesson)}${a.src!=="libro"?"<br>"+esc(a.src):""}</span></div><div class="aforms">${a.forms.map((f,k)=>`<span class="ru"><b>${["м.","ж.","ср.","мн."][k]}</b>${esc(f)}</span>`).join("")}</div></div>`).join("")}</div>`}).join("")+`<button class="btn block" data-act="import" data-k="a">+ Sumar adjetivos de tu material (con tu IA)</button>`;
 }
 main.innerHTML=`<div class="view fade-in"><section class="sec"><div class="seg" role="group" aria-label="Qué consultar">${[["c","Casos"],["p","Pares"],["v","Verbos"],["a","Adjetivos"]].map(t=>`<button data-act="refTab" data-t="${t[0]}" aria-pressed="${refTab===t[0]}">${t[1]}</button>`).join("")}</div>${body}</section></div>`;
 const si=document.getElementById("refSearch");if(si)si.addEventListener("input",()=>{refQ=si.value;const pos=si.selectionStart;rRef();const n2=document.getElementById("refSearch");n2.focus();try{n2.setSelectionRange(pos,pos)}catch(e){}})}

/* importar desde el material con la IA */
let impK="v";
function importPrompt(k){const what=k==="v"?"todos los VERBOS":k==="a"?"todos los ADJETIVOS":"todas las PALABRAS NUEVAS";
 const fmt=k==="v"?"infinitivo con acento | traducción al castellano | я, ты, он, мы, вы, они (presente; si es perfectivo, futuro)":k==="a"?"masculino singular con acento | traducción al castellano":"palabra con acento | traducción al castellano";
 const ex=k==="v"?"ви́деть | ver | ви́жу, ви́дишь, ви́дит, ви́дим, ви́дите, ви́дят":k==="a"?"но́вый | nuevo":"кни́га | libro";
 return `Te paso material de mi clase de ruso (lo adjunto como foto o PDF). Extraé ${what} que aparecen.
Respondé SOLO con la lista, una línea por elemento, en este formato exacto:
${fmt}
Ejemplo:
${ex}
No agregues títulos, números ni explicaciones.`}
function openImport(k){impK=k||"v";const opts=BK.map(b=>b.lessons.map(n=>`<option value="${b.id}:${n}">${esc(bare(b.name))} · ${lbl(b.id,n)}</option>`).join("")).join("");
 overlay("Sumar desde tu material",`<div class="seg" role="group"><button data-act="impK" data-k="v" aria-pressed="${impK==="v"}">Verbos</button><button data-act="impK" data-k="a" aria-pressed="${impK==="a"}">Adjetivos</button><button data-act="impK" data-k="w" aria-pressed="${impK==="w"}">Palabras</button></div>
 <ol class="howto"><li>Copiá el pedido y pegalo en tu IA junto con la foto o el PDF del material.</li><li>Pegá acá la lista que te devuelva.</li><li>Revisá la vista previa y guardá.</li></ol>
 <div class="steps3"><button class="btn red" data-act="impCopy">Copiar el pedido</button><a class="btn" href="https://gemini.google.com/app" target="_blank" rel="noopener">Abrir Gemini</a></div>
 <div class="field"><label for="impL">¿De qué lección es?</label><select id="impL">${opts}</select></div>
 <div class="field"><label for="impSrc">Nombre del material</label><input id="impSrc" placeholder="Ej.: Fotocopia de la profe, 14/10" value="Material de la profe"></div>
 <div class="field"><label for="impT">Pegá la lista</label><textarea id="impT" class="wtext ru" rows="8" placeholder="${impK==="v"?"ви́деть | ver | ви́жу, ви́дишь, …":"но́вый | nuevo"}"></textarea></div>
 <div id="impPrev"></div><button class="btn block" data-act="impSave">Guardar</button>`);
 const sel=document.getElementById("impL");const nw=nowL("a2");sel.value=nw!=null?"a2:"+nw:"pp:11";const t=document.getElementById("impT");t.addEventListener("input",()=>{const r=parseImport();document.getElementById("impPrev").innerHTML=r.length?`<p class="note">${r.length} para sumar: <span class="ru">${esc(r.slice(0,8).map(x=>x[0]).join(", "))}${r.length>8?"…":""}</span></p>`:""})}
function fixAcc(s){return s.normalize("NFC").replace(/[´`ʹ'’]/g,ST)}
function parseImport(){return (val("impT")||"").split(/\n/).map(l=>l.replace(/^[\s\-*•\d.)]+/,"").split("|").map(x=>x.trim())).filter(p=>p.length>=2&&p[0]&&isRu(p[0])).map(p=>[fixAcc(p[0]),p[1],p[2]?fixAcc(p[2]):""])}
