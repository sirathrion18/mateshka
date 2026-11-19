/* Матешка · Traductor: botón arriba en todas las pantallas y tocar cualquier palabra rusa.
   1) Busca en tus libros y en el diccionario de formas (formas.json: cada forma del libro y de tu vocabulario → su palabra base y qué forma es).
   2) Si la IA está conectada (IA_URL en js/ia.js), traduce adentro con acentos y explica.
   3) Si no, botones a Yandex, DeepL y Google con el texto ya cargado. */
"use strict";
let FORMAS=null,formasP=null;
function cargarFormas(){if(FORMAS)return Promise.resolve(FORMAS);if(formasP)return formasP;
 formasP=fetch("js/formas.json?v=7").then(r=>r.ok?r.json():null).then(d=>{FORMAS=d||{L:[],T:[],F:{}};return FORMAS}).catch(()=>{FORMAS={L:[],T:[],F:{}};return FORMAS});return formasP}
const RUX=/[а-яё]/i;
const trKey=s=>String(s).toLowerCase().replace(/[́']/g,"").replace(/ё/g,"е").trim();
/* índice de lo que está en la app (con acentos y lección) */
let APPIDX=null;
function appIdx(){if(APPIDX)return APPIDX;const M=new Map();const add=(form,e)=>{const k=trKey(form);if(!k)return;if(!M.has(k))M.set(k,[]);const a=M.get(k);if(!a.some(x=>x.ru===e.ru&&x.what===e.what))a.push(e)};
 const where=(b,n)=>bookName(b).split(" · ")[0]+" · "+lbl(b,n);
 allWords().forEach(w=>add(w.ru,{ru:w.ru,es:w.es,kind:"palabra",src:where(w.book,w.lesson)}));
 allVerbs().forEach(v=>{const e={ru:v.inf,es:v.es,kind:"verbo",src:where(v.book,v.lesson)};add(v.inf,Object.assign({what:""},e));
  v.forms.forEach((f,i)=>add(f.split(" ")[0],Object.assign({what:(v.group==="PF"?"futuro":"presente")+", "+bare(PRON[i])},e)));v.past.forEach((f,i)=>f&&add(f,Object.assign({what:"pasado "+["masculino","femenino","plural"][i]},e)))});
 allAdjs().forEach(a=>a.forms.forEach((f,i)=>add(f,{ru:a.m,es:a.es,kind:"adjetivo",src:where(a.book,a.lesson),what:i?["","femenino","neutro","plural"][i]:""})));
 PAIRS.forEach(p=>{const e=(ru,asp)=>({ru,es:p.es,kind:"verbo "+asp,src:where(p.book,p.lesson),pair:p});add(p.ip,Object.assign({what:""},e(p.ip,"imperfectivo")));add(p.pf,Object.assign({what:""},e(p.pf,"perfectivo")));
  p.pres.forEach((f,i)=>f&&add(f,Object.assign({what:"presente, "+["я","ты","они"][i]},e(p.ip,"imperfectivo"))));p.fut.forEach((f,i)=>f&&add(f,Object.assign({what:"futuro, "+["я","ты","они"][i]},e(p.pf,"perfectivo"))))});
 const CN=["nominativo","genitivo","dativo","acusativo","instrumental","preposicional"];
 /* pronombres (con sus casos, de la tabla de Consulta) y palabritas de todos los días */
 const PES={"я":"yo","ты":"vos","он":"él","она":"ella","мы":"nosotros","вы":"ustedes; usted","они":"ellos"};
 PR.h.forEach((h,j)=>{const e={ru:h,es:PES[bare(h)]||"",kind:"pronombre",src:""};add(h,Object.assign({what:"nominativo"},e));
  PR.rows.forEach((r,ci)=>String(r[j]||"").split(/[\s(),/]+/).filter(x=>/[а-яё]/i.test(x)&&x.length>1).forEach(f=>add(f,Object.assign({what:CN[ci+1]},e))))});
 [["и","y"],["а","y, pero (contraste)"],["но","pero"],["или","o"],["не","no (delante del verbo)"],["нет","no; no hay"],["да","sí"],["в","en; a (a un lugar)"],["во","en; a"],["на","sobre, en; a"],["с","con; desde"],["со","con"],["к","hacia, a (una persona)"],["у","junto a; у меня = tengo"],["о","sobre, acerca de"],["об","sobre, acerca de"],["по","por; según"],["из","de, desde (adentro)"],["от","de, desde (una persona)"],["до","hasta"],["за","detrás de; por"],["для","para"],["без","sin"],["после","después de"],["что","qué; que"],["кто","quién"],["как","cómo"],["где","dónde"],["куда","adónde"],["когда","cuándo"],["почему","por qué"],["это","esto, es"],["этот","este"],["эта","esta"],["тот","ese, aquel"],["мой","mi, mío"],["моя","mi, mía"],["моё","mi, mío"],["мои","mis, míos"],["твой","tu, tuyo"],["наш","nuestro"],["ваш","su, de ustedes"],["его","su (de él); lo"],["её","su (de ella); la"],["их","su (de ellos); los"],["свой","su propio"],["тоже","también"],["уже","ya"],["ещё","todavía; más"],["очень","muy"],["тут","acá"],["там","allá"],["здесь","acá"],["всё","todo"],["все","todos"],["сам","mismo"],["себя","sí mismo"],["ли","partícula de pregunta"],["бы","partícula del condicional"],["же","partícula de énfasis"],["вот","acá está, mirá"],["ну","bueno"]].forEach(([w,es])=>add(w,{ru:w,es,kind:"palabra corta",src:"",what:""}));
 NOUNS.forEach(n=>{["s","p"].forEach(num=>{if(!n[num])return;n[num].split(",").forEach((f,i)=>add(f,{ru:n.w,es:n.es,kind:"sustantivo",src:"",what:CN[i]+" "+(num==="s"?"singular":"plural")}))})});
 APPIDX=M;return M}
/* busca una palabra: primero en la app, después en el diccionario de formas */
function buscarPalabra(w){const k=trKey(w);const out=[];const seenK=new Set();
 (appIdx().get(k)||[]).forEach(e=>{const kk=trKey(e.ru)+"|"+(e.what||"");if(!seenK.has(kk)){seenK.add(kk);out.push(e)}});
 if(FORMAS&&FORMAS.F[k])FORMAS.F[k].forEach(([li,ti])=>{const L=FORMAS.L[li];if(!L)return;const ru=L[0],es=L[1];const what=FORMAS.T[ti]||"";
  /* si la app ya la tiene, completa con lo que falta */
  const ya=out.find(e=>trKey(e.ru)===trKey(ru));if(ya){if(!ya.what&&what)ya.what=what;if(!ya.es&&es)ya.es=es;return}
  const kk=trKey(ru)+"|"+what;if(!seenK.has(kk)){seenK.add(kk);out.push({ru,es:es||"",kind:L[2]||"",src:L[3]||"",what})}});
 return out}
function buscarEs(q){const t=norm(q);if(t.length<2)return [];const re=new RegExp("(^|[^a-záéíóúñü])"+t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"([^a-záéíóúñü]|$)","i");
 const out=[];const seen=new Set();const push=e=>{const k=trKey(e.ru);if(seen.has(k))return;seen.add(k);out.push(e)};
 appIdx().forEach(list=>list.forEach(e=>{if(e.es&&re.test(norm(e.es))&&!e.what)push(e)}));
 if(FORMAS)FORMAS.L.forEach(L=>{if(L[1]&&re.test(norm(L[1])))push({ru:L[0],es:L[1],kind:L[2]||"",src:L[3]||""})});
 return out.slice(0,12)}

/* --- la hoja --- */
let trState={q:"",ia:null,iaBusy:false,iaErr:""};
const EXT=(t,ru)=>{const e=encodeURIComponent(t);const s=ru?"ru":"es",d=ru?"es":"ru";
 return [["Yandex",`https://translate.yandex.com/?source_lang=${s}&target_lang=${d}&text=${e}`],["DeepL",`https://www.deepl.com/translator#${s}/${d}/${encodeURIComponent(t.replace(/\//g,"\\/"))}`],["Google",`https://translate.google.com/?sl=${s}&tl=${d}&text=${e}&op=translate`]]};
function trCard(e){return `<div class="trc"><div class="trc-h"><b class="ru">${esc(e.ru)}</b>${e.kind?`<span class="trk">${esc(e.kind)}</span>`:""}</div>
 ${e.es?`<p class="tre">${esc(e.es)}</p>`:`<p class="tre trm">Sin traducción en tus libros.</p>`}
 ${e.what?`<p class="trw">Esta forma: <b>${esc(e.what)}</b></p>`:""}${e.src?`<p class="trs-src">${esc(e.src)}</p>`:""}</div>`}
function trBody(){const q=trState.q.trim();const ru=RUX.test(q);const words=ru?(q.match(/[а-яёА-ЯЁ́-]+/g)||[]):[];
 let h="";
 if(!q)h=`<p class="note">Escribí o pegá en ruso o en castellano. También podés tocar cualquier palabra rusa de la app.</p>`;
 else if(ru&&words.length===1){const r=buscarPalabra(words[0]);h=r.length?r.slice(0,4).map(trCard).join(""):`<p class="note">«${esc(words[0])}» no está en tus libros todavía.</p>`}
 else if(ru){const rows=words.slice(0,24).map(w=>{const r=buscarPalabra(w)[0];return `<div class="trrow"><span class="ru">${esc(w)}</span><span>${r?`<b class="ru">${esc(r.ru)}</b> ${esc(r.es||"")}${r.what?` <span class="trm">· ${esc(r.what)}</span>`:""}`:`<span class="trm">—</span>`}</span></div>`}).join("");
  h=`<p class="flabel">Palabra por palabra</p><div class="trrows">${rows}</div>`}
 else{const r=buscarEs(q);h=r.length?`<p class="flabel">En tus libros</p>`+r.slice(0,6).map(trCard).join(""):`<p class="note">No encontré «${esc(q)}» en tus libros.</p>`}
 /* IA */
 let ia="";if(q){if(IA_URL){
  if(trState.iaBusy)ia=`<div class="tria"><p class="note">Traduciendo…</p></div>`;
  else if(trState.ia&&trState.ia.q===q){const a=trState.ia;ia=`<div class="tria"><p class="flabel">Con IA</p><p class="tria-t ${a.ru?"ru":""}">${esc(a.t||"")}</p>${a.acc?`<p class="ru tria-acc">${esc(a.acc)}</p>`:""}${a.notas&&a.notas.length?`<ul class="plain small">${a.notas.map(n=>`<li>${esc(n)}</li>`).join("")}</ul>`:""}</div>`}
  else ia=`<button class="btn red block" data-act="trIA">Traducir con IA</button>${trState.iaErr?`<p class="note">${esc(trState.iaErr)}</p>`:""}`}
 }
 const ext=q?`<div class="trext"><span class="note">Abrir en</span>${EXT(q,ru).map(([n,u])=>`<a class="chip" href="${u}" target="_blank" rel="noopener">${n}</a>`).join("")}</div>`:"";
 return h+ia+ext}
function openTr(q){trState={q:q||"",ia:null,iaBusy:false,iaErr:""};let el=document.getElementById("trSheet");
 if(!el){el=document.createElement("div");el.id="trSheet";el.className="trsheet";document.body.appendChild(el)}
 el.innerHTML=`<div class="tr-back" data-act="trClose"></div><div class="tr-pan" role="dialog" aria-modal="true" aria-label="Traducir">
 <div class="tr-top"><span class="tr-grip" aria-hidden="true"></span><b>Traducir</b><button class="back" data-act="trClose" aria-label="Cerrar">${ICON.x}</button></div>
 <div class="tr-in"><textarea id="trIn" rows="2" placeholder="Ruso o castellano" autocapitalize="off" spellcheck="false">${esc(trState.q)}</textarea></div>
 <div class="tr-out" id="trOut"></div></div>`;
 document.body.classList.add("lock");
 const ta=el.querySelector("#trIn");let t=null;ta.addEventListener("input",()=>{clearTimeout(t);t=setTimeout(()=>{trState.q=ta.value;trState.iaErr="";paintTr()},160)});
 paintTr();cargarFormas().then(paintTr);
 if(!q)setTimeout(()=>{try{ta.focus()}catch(e){}},80);
 if(q&&IA_URL&&/\s/.test(q.trim()))trIA()}
function paintTr(){const o=document.getElementById("trOut");if(o){o.innerHTML=trBody();noBreak(o)}}
function closeTr(){const el=document.getElementById("trSheet");if(el)el.remove();document.body.classList.toggle("lock",!!ov.firstChild);clearMark()}
async function trIA(){const q=trState.q.trim();if(!q||!IA_URL)return;trState.iaBusy=true;paintTr();
 try{const r=await iaPedir({tarea:"traducir",texto:q,visto:seenSummary()});trState.ia=Object.assign({q},r)}catch(e){trState.iaErr="No pude conectar con la IA. Probá con los botones de abajo."}
 trState.iaBusy=false;paintTr()}

/* --- tocar una palabra rusa en cualquier pantalla --- */
let markEl=null;
function clearMark(){if(markEl){markEl.remove();markEl=null}}
function wordAt(x,y){let node,off;
 if(document.caretRangeFromPoint){const r=document.caretRangeFromPoint(x,y);if(!r)return null;node=r.startContainer;off=r.startOffset}
 else if(document.caretPositionFromPoint){const p=document.caretPositionFromPoint(x,y);if(!p)return null;node=p.offsetNode;off=p.offset}
 if(!node||node.nodeType!==3)return null;const t=node.textContent;const isW=c=>/[а-яёА-ЯЁ́]/.test(c);
 let a=off,b=off;if(!isW(t[a]||"")&&isW(t[a-1]||""))a--,b--;if(!isW(t[a]||""))return null;
 while(a>0&&isW(t[a-1]))a--;while(b<t.length&&isW(t[b]))b++;
 const rg=document.createRange();rg.setStart(node,a);rg.setEnd(node,b);const rc=rg.getBoundingClientRect();
 if(x<rc.left-4||x>rc.right+4||y<rc.top-4||y>rc.bottom+4)return null;return {w:t.slice(a,b),rc}}
document.addEventListener("click",e=>{if(e.defaultPrevented)return;
 const t=e.target;if(!(t instanceof Element))return;
 if(t.closest("button,a,input,textarea,select,label,[data-act],[data-tab],.jcard,.qcard,.focus,.trsheet,.dock,.hdr,.cpm"))return;
 if(!t.closest("#main,#ov"))return;const sel=window.getSelection&&String(window.getSelection());if(sel&&sel.trim())return;
 const hit=wordAt(e.clientX,e.clientY);if(!hit)return;
 clearMark();markEl=document.createElement("span");markEl.className="trmark";Object.assign(markEl.style,{left:hit.rc.left-3+"px",top:hit.rc.top-2+"px",width:hit.rc.width+6+"px",height:hit.rc.height+4+"px"});document.body.appendChild(markEl);
 tick();openTr(hit.w)});
