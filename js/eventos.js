/* Матешка · nueva clase, copia de seguridad, archivos y todos los toques. Arranca la app. */
"use strict";
function openNewEntry(){const opts=BK.map(b=>b.lessons.map(n=>`<option value="${b.id}:${n}">${esc(bare(b.name))} · ${lbl(b.id,n)}</option>`).join("")).join("");
 overlay("Nueva clase",`<form id="eForm" class="sec" style="gap:16px">
 <div class="field"><label for="eDate">Fecha</label><input type="date" id="eDate" value="${today()}" required></div>
 <div class="field"><label for="eLes">¿Qué vieron?</label><select id="eLes">${opts}</select></div>
 <div class="field"><label for="eTitle">Tema</label><input id="eTitle" placeholder="Ej.: Покупа'ть и'ли купи'ть?">`.replace(/'/g,ST)+`</div>
 <div class="field"><label for="eNotes">Notas</label><textarea id="eNotes" rows="4" placeholder="Qué dijo la profe, tarea, dudas para la próxima."></textarea></div>
 <div class="field"><label for="eMat">Material de la profe (nombre)</label><input id="eMat" placeholder="Ej.: Fotocopia de verbos"></div>
 <div id="eTopics"></div>
 <p class="note">Para sumar los verbos, adjetivos o palabras de ese material, usá «Sumar desde tu material» en Consulta.</p>
 <button class="btn red block" type="submit">Guardar clase</button></form>`);
 const sel=document.getElementById("eLes");const nw=nowL("a2");sel.value=nw!=null?"a2:"+nw:"a2:"+prog("a2");
 const drawT=()=>{const [b,n]=sel.value.split(":");const l=getL(b,+n);document.getElementById("eTopics").innerHTML=l&&l.g.length?`<p class="flabel">Marcá los temas que vieron</p><div class="checks">${l.g.map((g,i)=>`<label><input type="checkbox" value="${esc(g)}" id="et${i}"><span class="ru">${esc(g)}</span></label>`).join("")}</div>`:""};sel.addEventListener("change",drawT);drawT();
 document.getElementById("eForm").addEventListener("submit",ev=>{ev.preventDefault();const [b,n]=sel.value.split(":");
  S.entries.push({id:uid(),date:val("eDate")||today(),book:b,lesson:+n,title:val("eTitle")||bare(getL(b,+n).text||lbl(b,+n)),notes:val("eNotes"),material:val("eMat")?[val("eMat")]:[],topics:[...ov.querySelectorAll("#eTopics input:checked")].map(x=>x.value)});
  save();closeOv();toast("Clase guardada")})}

/* ---------- copia de seguridad ---------- */
function openRestore(){overlay("Restaurar copia",`<p class="note">Pegá la copia que guardaste. Reemplaza todo lo que hay ahora en esta app.</p><textarea id="bkT" class="wtext" rows="10" placeholder="Pegá acá la copia"></textarea><button class="btn red block" data-act="bkDo">Restaurar</button>`)}
function doRestore(){let o;try{o=JSON.parse(document.getElementById("bkT").value.trim())}catch(e){toast("No es una copia válida");return}
 if(!o||o.app!=="mateshka"||!o.S||!o.S.prog){toast("No es una copia de Mateshka");return}
 S=o.S;normalize();
 for(const id in (o.PH||{})){PH[id]=o.PH[id];try{localStorage.setItem(KEY+"-ph-"+id,o.PH[id])}catch(e){}}
 save();backStack=[];ov.innerHTML="";jg=null;go("home");toast("Copia restaurada")}
/* ---------- archivos ---------- */
function readImg(file,max,cb){const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const s=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement("canvas");c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext("2d").drawImage(img,0,0,c.width,c.height);cb(c.toDataURL("image/jpeg",.7))};img.onerror=()=>cb(null);img.src=r.result};r.readAsDataURL(file)}
document.getElementById("fileFicha").addEventListener("change",e=>{const f=e.target.files[0];e.target.value="";if(!f)return;readImg(f,900,d=>{ficDraft.photo=d;const p=document.getElementById("fPrev");if(p)p.innerHTML=d?`<img src="${d}" alt="" style="max-height:160px;border:2px solid var(--bc);border-radius:12px">`:""})});

/* ---------- eventos ---------- */
function keepScroll(fn){const b=document.getElementById("ovBody");const k=b?b.scrollTop:0;fn();const n=document.getElementById("ovBody");if(n)n.scrollTop=k}
function keepMain(fn){const y=window.scrollY;fn();window.scrollTo(0,y)}
function saveWriting(pid){const t=document.getElementById("wText").value.trim();if(!t){toast("Escribí algo primero");return}
 let w=writingFor(pid);if(!w){const d=day();const firstToday=wroteOn(d)<1;w={id:uid(),date:today(),pid,text:t,corr:"",tags:[],kind:"reto"};S.writings.push(w);addXP(15);d.done[pid]=true;
  toast(firstToday?"Guardada: +15 · juego de escribir hecho":"Guardada: +15");save();afterGame()}else{w.text=t;toast("Cambios guardados")}
 if(S.writings.length>400)S.writings=S.writings.slice(-400);save();keepScroll(()=>openWrite(pid))}
function saveCorr(pid){const w=writingFor(pid);const c=document.getElementById("wCorr").value.trim();if(!w)return;if(!c){toast("Pegá la corrección primero");return}
 const first=!w.corr;const old=new Set(w.tags||[]);w.corr=c;w.tags=[...wtags];wtags.forEach(t=>{if(!old.has(t))S.errors[t]=(S.errors[t]||0)+1});if(first)addXP(10);save();toast(first?"Corrección guardada: +10":"Corrección actualizada");closeOv()}
document.addEventListener("click",e=>{const b=e.target.closest("[data-act],[data-tab]");if(!b||b.disabled)return;
 if(b.dataset.tab){backStack=[];if(ov.firstChild)ov.innerHTML="";if(b.dataset.tab!==tab){tick();go(b.dataset.tab)}else window.scrollTo({top:0,behavior:"smooth"});return}
 const a=b.dataset.act,d=b.dataset;
 switch(a){
  case "close":closeOv();break;
  case "theme":toggleTheme();break;
  case "davai":davai();break;
  case "game":tick();if(d.k==="write")openWriteMenu();else if(d.k==="cases")openCases();else openVerbs();break;
  /* juegos */
  case "jPick":jPick(+d.k);break;
  case "jCheck":checkTyped();break;
  case "jHint":jg.hint=true;tick();keepScroll(renderGame);break;
  case "jNext":jNext();break;
  case "jSlot":keepScroll(()=>jSlot(+d.k));break;
  case "jSave":jSave();break;
  case "jSkip":jg.res[jg.i]="bad";jNext();break;
  case "jCopy":jCopy();break;
  case "jHome":backStack=[];ov.innerHTML="";if(tab!=="home")go("home");else render();break;
  case "jAgain":jgRound++;startGame(d.k,true);break;
  case "jRef":{const c=casesPick()[0];backStack=[];ov.innerHTML="";refTab="c";caseSel=CS[c].id;go("ref");break}
  case "jPairs":backStack=[];ov.innerHTML="";refTab="p";go("ref");break;
  /* copia */
  case "bkCopy":{const ph={};S.fichas.forEach(f=>{if(PH[f.id])ph[f.id]=PH[f.id]});copyText(JSON.stringify({app:"mateshka",v:3,date:today(),S,PH:ph}),"Copia copiada: pegala en Notas o WhatsApp");break}
  case "bkOpen":openRestore();break;
  case "bkDo":doRestore();break;
  /* escribir */
  case "moreWrite":if(ov.firstChild&&curOv)push(curOv);openMore();break;
  case "write":if(ov.firstChild&&curOv){push(curOv)}openWrite(d.id);break;
  case "wSave":saveWriting(d.id);break;
  case "copyFix":{const p=PROMPTS_.find(x=>x.id===d.id);const w=writingFor(d.id);const t=document.getElementById("wText").value.trim()||(w&&w.text)||"";copyText(fixPrompt(p.ru,bare(bookName(p.b))+", "+lbl(p.b,p.l)+", p. "+p.p,t));break}
  case "wtag":{const t=d.t;if(wtags.has(t))wtags.delete(t);else wtags.add(t);b.setAttribute("aria-pressed",wtags.has(t));tick();break}
  case "wCorrSave":saveCorr(d.id);break;
  case "tool":openTool(d.k);break;
  case "tCopy":{const t=val("tText");if(!t){toast("Escribí algo primero");break}copyText(d.k==="q"?askPrompt(t):fixPrompt(val("tCons"),"",t));break}
  case "tSave":{const t=val("tText");if(!t){toast("Escribí algo primero");break}const c=val("tAns");S.writings.push({id:uid(),date:today(),pid:null,text:t,corr:c,tags:[...wtags],kind:d.k,title:val("tCons")});wtags.forEach(x=>{S.errors[x]=(S.errors[x]||0)+1});if(d.k==="ex"&&c)addXP(10);save();toast("Guardado");closeOv();break}
  case "tFicha":{const t=val("tText"),c=val("tAns");if(!c){toast("Pegá la respuesta primero");break}const id=uid();S.fichas.unshift({id,title:t.slice(0,60),front:t,back:c,pinned:true,photo:false,book:null,lesson:0});S.writings.push({id:uid(),date:today(),pid:null,text:t,corr:c,tags:[],kind:"q"});save();toast("Guardada como ficha");closeOv();break}
  case "history":openHistory();break;
  /* fichas */
  case "focus":fz.hide=false;openFocus(d.id);break;
  case "fzClose":fz.id=null;ov.innerHTML="";render();break;
  case "fzHide":fz.hide=!fz.hide;openFocus(fz.id);break;
  case "fzGo":{const list=S.fichas.slice().sort((x,y)=>(y.pinned?1:0)-(x.pinned?1:0));const i=list.findIndex(f=>f.id===fz.id)+(+d.d);if(list[i]){tick();openFocus(list[i].id)}break}
  case "fzEdit":push(()=>openFocus(fz.id));openFicha(fz.id);break;
  case "newFicha":fz.id=null;openFicha(null);break;
  case "editFicha":fz.id=null;openFicha(d.id);break;
  case "pickFicha":document.getElementById("fileFicha").click();break;
  case "delFicha":{if(b.dataset.sure){S.fichas=S.fichas.filter(x=>x.id!==d.id);try{localStorage.removeItem(KEY+"-ph-"+d.id)}catch(er){}save();backStack=[];fz.id=null;ov.innerHTML="";render();toast("Ficha borrada")}else{b.dataset.sure="1";b.textContent="Tocá de nuevo para borrar";b.classList.add("red");tick(true)}break}
  case "pin":{const f=S.fichas.find(x=>x.id===d.id);f.pinned=!f.pinned;save();keepMain(rReview);break}
  /* biblioteca */
  case "book":openBook(d.b);break;
  case "lesson":if(ov.firstChild&&curOv){push(curOv)}openLesson(d.b||"a1",+d.n,"res");break;
  case "ltab":keepScroll(()=>openLesson(d.b,+d.n,d.t));break;
  case "prog":{const B=BK.find(x=>x.id===d.b);const ls=B.lessons;let i=ls.indexOf(prog(d.b))+(+d.d);i=Math.max(0,Math.min(ls.length-1,i));if(S.prog[d.b]!==ls[i])tick();S.prog[d.b]=ls[i];rv.sel=null;save();keepMain(render);document.getElementById("hSub").textContent=HEAD[tab][1]();break}
  case "setProg":S.prog[d.b]=+d.n;rv.sel=null;save();backStack=[];ov.innerHTML="";render();tick();toast("Marcado como visto hasta "+lbl(d.b,+d.n));break;
  case "reviewLesson":rv=Object.assign(rv,{mode:"setup",kind:"vocab",sel:new Set([lkey(d.b,+d.n)])});backStack=[];ov.innerHTML="";go("review");startReview();break;
  case "askAbout":{const l=getL(d.b,+d.n);openTool("q","Explicame con más detalle el tema «"+bare(l.text||lbl(d.b,+d.n))+"» ("+bare(bookName(d.b))+", "+lbl(d.b,+d.n)+").");break}
  case "newEntry":openNewEntry();break;
  /* consulta */
  case "refTab":refTab=d.t;openVerb=null;openPair=null;tick();rRef();break;
  case "case":caseSel=d.c;tick();keepMain(rRef);break;
  case "cnum":caseNum=d.v;keepMain(rRef);break;
  case "pfil":pFil=d.f;openPair=null;keepMain(rRef);break;
  case "pair":{openPair=openPair===d.id?null:d.id;const btn=ov.querySelector('[data-act="ltab"][aria-pressed="true"]');if(ov.firstChild&&btn)keepScroll(()=>openLesson(btn.dataset.b,+btn.dataset.n,"par"));else keepMain(rRef);break}
  case "verb":{openVerb=openVerb===d.id?null:d.id;const btn=ov.querySelector('[data-act="ltab"][aria-pressed="true"]');if(ov.firstChild&&btn)keepScroll(()=>openLesson(btn.dataset.b,+btn.dataset.n,"ver"));else keepMain(rRef);break}
  case "import":openImport(d.k);break;
  case "impK":{const t=val("impT");openImport(d.k);document.getElementById("impT").value=t;break}
  case "impCopy":copyText(importPrompt(impK));break;
  case "impSave":{const rows=parseImport();if(!rows.length){toast("No encontré líneas con el formato «ruso | castellano»");break}const [bk,ln]=val("impL").split(":");const src=val("impSrc")||"Material de la profe";let n=0;
   rows.forEach(r=>{if(impK==="v"){const forms=r[2]?r[2].split(/\s*,\s*/):null;const id="v:"+bare(r[0]);if(!S.extra.v.some(x=>x.id===id&&x.src===src)){S.extra.v.push({id,inf:r[0],es:r[1],book:bk,lesson:+ln,group:forms&&forms.length===6?(VERBS.find(v=>v.id===id)||{group:"I"}).group:"I",forms:forms&&forms.length===6?forms:null,src});n++}}
    else if(impK==="a"){const id="a:"+bare(r[0]);if(!S.extra.a.some(x=>x.id===id&&x.src===src)){S.extra.a.push({id,m:r[0],es:r[1],book:bk,lesson:+ln,src});n++}}
    else{if(!S.extra.w)S.extra.w=[];const id="w:"+bare(r[0]);if(!S.extra.w.some(x=>x.id===id)){S.extra.w.push({id,ru:r[0],es:r[1],book:bk,lesson:+ln,src});n++}}});
   save();toast(n+" sumados");closeOv();break}
  /* repaso */
  case "rvKind":rv.kind=d.k;tick();keepMain(rReview);break;
  case "rvL":{const s=selL();if(s.has(d.k))s.delete(d.k);else s.add(d.k);keepMain(rReview);break}
  case "rvAll":rv.sel=null;selL();keepMain(rReview);break;
  case "rvNone":rv.sel=new Set();keepMain(rReview);break;
  case "rvBook":rv.sel=new Set([...allSeenKeys()].filter(k=>k.startsWith(d.b+":")));keepMain(rReview);break;
  case "rvDir":rv.dir=d.d;keepMain(rReview);break;
  case "rvOpt":rv.nOpt=+d.o;keepMain(rReview);break;
  case "rvCount":rv.count=+d.c;keepMain(rReview);break;
  case "rvStart":startReview();window.scrollTo(0,0);break;
  case "rvPick":{const it=rv.queue[rv.i];const k=+d.k;rv.ans=k;const ok=norm(it.opts[k])===norm(answerOf(it));rvResult(ok);tick(!ok);keepMain(rReview);break}
  case "rvDunno":rv.ans="nr";rvResult(false);keepMain(rReview);break;
  case "rvNext":rvNext();break;
  case "rvFlip":rv.flip=true;keepMain(rReview);break;
  case "rvSelf":rvResult(d.ok==="1");rvNext();break;
  case "rvMiss":{const ms=rv.miss.map(m=>{const c=Object.assign({},m,{tries:0});delete c.opts;return c});rv.queue=shuffle(ms);rv.i=0;rv.ans=null;rv.ok=0;rv.miss=[];rv.mode="run";rReview();window.scrollTo(0,0);break}
  case "rvAgain":startReview();window.scrollTo(0,0);break;
  case "rvSetup":rv.mode="setup";rReview();window.scrollTo(0,0);break;
  case "quickWeak":rv.kind="weak";go("review");startReview();break;
 }});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&ov.firstChild){if(fz.id){fz.id=null;ov.innerHTML="";render()}else closeOv()}});
/* Si la app queda abierta de un día para otro, al volver se rehace Inicio con los juegos nuevos. */
let lastDay=today();document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&today()!==lastDay){lastDay=today();jg=null;if(!ov.firstChild)render()}});
go("home");
