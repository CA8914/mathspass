/* Site MathsPass : outils partagés + moteur des applications */
(function(){
const FORM_URL='https://docs.google.com/forms/d/e/1FAIpQLSfvhhmtO56FCApM3j4a2yCrwa5OcJmLTIIv9VjZib-mBOALmg/viewform?usp=pp_url&entry.667286545=APPLI&entry.1323283813=PRENOM&entry.2118595536=RESULTATS';
const SITE='MathsPass';

/* ---------- Outils ---------- */
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SP=' ';
const G=n=>{const neg=n<0;const s=String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g,SP);return(neg?'−':'')+s};
/* nombre décimal : virgule, espaces ; fixed = nombre de décimales imposé */
const D=(x,fixed)=>{const r=Math.round(x*100)/100;if(fixed==null&&Number.isInteger(r))return G(r);
 let s=r.toFixed(fixed==null?2:fixed);if(fixed==null)s=s.replace(/0$/,'');const[i,d]=s.split('.');return G(+i)+(d?','+d:'')};
const E=c=>D(c/100,2)+SP+'€'; /* centimes → prix */
const numK=(k,z=.25)=>{let s=''+R(1,9);for(let i=1;i<k;i++)s+=Math.random()<z?'0':R(0,9);return+s};

/* Nombres en lettres (orthographe traditionnelle, belge : septante, nonante) */
const U=['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize'];
const T=['','dix','vingt','trente','quarante','cinquante','soixante','septante','quatre-vingt','nonante'];
function w100(n,fin){if(n<17)return U[n];if(n<20)return'dix-'+U[n-10];const t=Math.floor(n/10),u=n%10;
 if(u===0)return t===8?(fin?'quatre-vingts':'quatre-vingt'):T[t];if(u===1&&t!==8)return T[t]+' et un';return T[t]+'-'+U[u]}
function w1000(n,fin){const c=Math.floor(n/100),r=n%100;let s='';
 if(c===1)s='cent';else if(c>1)s=U[c]+' cent'+(r===0&&fin?'s':'');
 if(r)s+=(s?' ':'')+w100(r,fin);return s}
function W(n){if(n===0)return'zéro';const parts=[];const md=Math.floor(n/1e9),mi=Math.floor(n/1e6)%1000,k=Math.floor(n/1000)%1000,u=n%1000;
 if(md)parts.push(md===1?'un milliard':w1000(md,true)+' milliards');
 if(mi)parts.push(mi===1?'un million':w1000(mi,true)+' millions');
 if(k)parts.push(k===1?'mille':w1000(k,false)+' mille');
 if(u)parts.push(w1000(u,true));
 return parts.join(' ')}
const RANG=['unités','dizaines','centaines','unités de mille','dizaines de mille','centaines de mille','unités de millions','dizaines de millions','centaines de millions','unités de milliards','dizaines de milliards','centaines de milliards'];
const CLASSES=['unités','mille','millions','milliards'];
/* tableau des classes : milliards | millions | mille | unités */
function clsTable(n,hl){const s=String(n),k=Math.ceil(s.length/3),p=s.padStart(k*3,'0');const cols=[];
 for(let i=0;i<k;i++)cols.push({name:CLASSES[k-1-i],d:p.slice(i*3,i*3+3)});
 const head=cols.map(c=>`<th colspan="3">${c.name}</th>`).join('');
 const sub=cols.map(()=>'<th>C</th><th>D</th><th>U</th>').join('');
 const L=p.length-s.length;
 const digits=[...p].map((d,i)=>`<td class="${hl!=null&&p.length-1-i===hl?'hl':''}">${i<L?'':d}</td>`).join('');
 return`<div class="scroll"><table class="cls"><thead><tr>${head}</tr><tr>${sub}</tr></thead><tbody><tr>${digits}</tr></tbody></table></div>`}
/* calcul en colonnes */
function col(rows,res,dec){const f=x=>dec?D(x,dec):G(x);
 return`<div class="scroll"><table class="colc">${rows.map(([op,v])=>`<tr><td class="op">${op}</td><td>${f(v)}</td></tr>`).join('')}<tr class="res"><td class="op"></td><td>${f(res)}</td></tr></table></div>`}
/* droite graduée pour 2 nombres entiers */
function numLine(a,b){const lo=Math.floor(Math.min(a,b,0)/10)*10-10,hi=Math.ceil(Math.max(a,b,0)/10)*10+10,Wd=560,x=v=>20+(v-lo)/(hi-lo)*(Wd-40);
 let t='';for(let v=lo;v<=hi;v+=10)t+=`<line x1="${x(v)}" y1="44" x2="${x(v)}" y2="56" stroke="currentColor" stroke-width="2"/><text x="${x(v)}" y="78" text-anchor="middle" font-size="15" fill="currentColor">${v<0?'−'+(-v):v}</text>`;
 const pt=(v,c,y)=>`<circle cx="${x(v)}" cy="50" r="9" fill="${c}"/><text x="${x(v)}" y="${y}" text-anchor="middle" font-size="19" font-weight="700" fill="${c}">${v<0?'−'+(-v):v}</text>`;
 return`<svg class="nl" viewBox="0 0 ${Wd} 90" role="img" aria-label="Droite graduée"><line x1="10" y1="50" x2="${Wd-10}" y2="50" stroke="currentColor" stroke-width="3"/><path d="M${Wd-10} 50l-10-6v12z" fill="currentColor"/>${t}${pt(a,'#d9604c',26)}${a===b?'':pt(b,'#1d6a49',26)}</svg>`}
/* nombres proches (pièges) pour les QCM */
function near(n,k=2){const s=String(n),out=new Set();let g=0;
 while(out.size<k&&g++<300){let d=[...s];const r=Math.random();
  if(r<.3&&d.includes('0')&&d.length>2){const z=d.map((c,i)=>c==='0'&&i>0?i:-1).filter(i=>i>=0);d.splice(pick(z),1)}
  else if(r<.5&&d.length<12){d.splice(R(1,d.length-1),0,'0')}
  else if(r<.8){const i=R(0,d.length-1);let c;do{c=String(R(i?0:1,9))}while(c===d[i]);d[i]=c}
  else{const i=R(0,d.length-2);if(d[i]===d[i+1]||(i===0&&d[1]==='0'))continue;[d[i],d[i+1]]=[d[i+1],d[i]]}
  const v=+d.join('');if(v!==n&&v>0)out.add(v)}
 return[...out]}
/* options de QCM : la bonne réponse + des pièges, sans doublon */
function opts(ans,cands,k=3,fill){const o=[ans];for(const c of cands){if(o.length>=k)break;if(c!=null&&!o.some(x=>String(x)===String(c))&&!(typeof c==='number'&&(c<0||!isFinite(c))))o.push(c)}
 let g=0;while(o.length<k&&g++<50){const c=fill?fill():ans+R(1,9)*(Math.random()<.5?-1:1);if(!o.some(x=>String(x)===String(c))&&!(typeof c==='number'&&c<0))o.push(c)}return shuf(o)}
const ICON={
 speak:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 star:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z"/></svg>'};
const stars=n=>{const s=n>=8?3:n>=6?2:n>=4?1:0;return`<span class="stars" aria-label="${s} étoile${s>1?'s':''} sur 3">${[0,1,2].map(i=>ICON.star.replace('<path',`<path class="${i<s?'st-on':'st-off'}"`)).join('')}</span>`};

/* ---------- Stockage partagé par tout le site ---------- */
const store={
 name(){try{return localStorage.getItem('mm-name')||''}catch(e){return''}},
 setName(v){try{localStorage.setItem('mm-name',v)}catch(e){}},
 log(){try{return JSON.parse(localStorage.getItem('mm-log')||'[]')}catch(e){return[]}},
 add(c,a,l,s,m,p){const L=store.log(),d=new Date();L.push({c,a,l,s,m,p:p||'',d:d.toLocaleDateString('fr-BE')+' '+d.toLocaleTimeString('fr-BE',{hour:'2-digit',minute:'2-digit'})});try{localStorage.setItem('mm-log',JSON.stringify(L))}catch(e){}},
 prog(c){try{return JSON.parse(localStorage.getItem('mm-prog')||'{}')[c]||{u:1,b:{}}}catch(e){return{u:1,b:{}}}},
 setProg(c,p){try{const all=JSON.parse(localStorage.getItem('mm-prog')||'{}');all[c]=p;localStorage.setItem('mm-prog',JSON.stringify(all))}catch(e){}},
 wipe(){try{for(const k of Object.keys(localStorage))if(/^(mm|bf|lg|cl)-/.test(k))localStorage.removeItem(k)}catch(e){}}};
const prof=()=>location.hash==='#prof';
const H=()=>prof()?'#prof':'';

/* ---------- iPad / Safari ---------- */
(function(){const st=document.createElement('style');let css='button,a,input{touch-action:manipulation;-webkit-tap-highlight-color:transparent}';
 /* iPadOS plus ancien que 17.5 : light-dark() n'existe pas → couleurs claires de secours */
 let ok=false;try{ok=CSS.supports('color','light-dark(#000,#fff)')}catch(e){}
 if(!ok)css+=':root{--bg:#f4f0fb;--card:#fff;--ink:#2e2541;--soft:#655a7a;--lav:#e4dbf8;--peach:#ffe6dc;--coral:#d9604c;--mint:#d8f3e5;--mintInk:#1d6a49;--yel:#fff1c9;--line:#ddd3ee;--btn:#5a4a8c;--btnInk:#fff;--bag:#8a79bd;--tint:#f8f5fe;color-scheme:light}';
 st.textContent=css;(document.head||document.documentElement).appendChild(st)})();
window.MM={opts,R,pick,shuf,esc,G,D,E,W,numK,near,RANG,clsTable,col,numLine,stars,store,prof,H,FORM_URL,SITE,ICON};

/* ---------- Le moteur d'une application ---------- */
const PRAISE=['Bravo !','Super !','Excellent !','Génial !','Tu as trouvé !','Parfait !','Très bien !','Bien joué !','Continue comme ça !','Magnifique !'];
const N=8;
MM.run=function(APP){
 const $=s=>document.querySelector(s),root=$('#app');
 let lv=0,deck=[],qi=0,score=0,res=[],done=false,showWords=false;
 const canSpeak=(()=>{try{return'speechSynthesis'in window&&typeof SpeechSynthesisUtterance!=='undefined'}catch(e){return false}})();
 const P3=APP.levels.map(l=>l.p3).filter(Boolean).join(' · ');
 const memo=i=>{const one=l=>l.memo||APP.memo||'';
  if(i!=null)return`<details><summary>Mon aide-mémoire · ${APP.levels[i].t}</summary><div style="margin-top:8px">${one(APP.levels[i])}</div></details>`;
  if(!APP.levels.some(l=>l.memo))return`<details><summary>Mon aide-mémoire</summary><div style="margin-top:8px">${APP.memo}</div></details>`;
  return`<details><summary>Mon aide-mémoire</summary>${APP.levels.map(l=>`<h3 style="margin:14px 0 6px;font-size:20px">${l.t} : ${l.s}</h3>${one(l)}`).join('<hr style="border:0;border-top:2px solid var(--line);margin:14px 0">')}</details>`};
 const topbar=()=>`<div class="bar"><a class="ghost" href="../index.html${H()}">← Toutes les applications</a><div class="row"><b>${esc(store.name())}</b><a class="ghost" href="../resultats.html${H()}">Mes résultats</a></div></div>`;
 const head=()=>`<div class="hero"><div class="intro"><span class="pill">${APP.code}${P3?' · '+P3:''}</span><h1>${APP.title}</h1>${APP.desc.map(p=>`<p>${p}</p>`).join('')}</div>${APP.icon.replace('<svg','<svg class="ic"')}</div>`;
 function show(html){root.innerHTML=html;window.scrollTo(0,0)}
 function nameScreen(){show(`${head()}<form id="nf" style="margin:10px 0 24px"><p>Bonjour ! Écris ton prénom.</p><p>Comme ça, ton professeur voit tes résultats.</p><label class="lbl" for="pn">Ton prénom :</label><input class="name-in" id="pn" maxlength="30" autocomplete="off"><div class="err" id="pe" hidden>Écris ton prénom pour commencer.</div><div class="row" style="margin-top:12px"><button class="btn">C'est parti !</button></div></form>`);
  $('#nf').addEventListener('submit',e=>{e.preventDefault();const v=$('#pn').value.trim();if(!v){$('#pe').hidden=false;return}store.setName(v);levels()})}
 function levels(){if(!store.name())return nameScreen();const P=store.prog(APP.code),open=prof()?3:P.u;
  show(`${topbar()}${head()}<p><b>Choisis un niveau.</b></p><div class="levels">${APP.levels.map((l,i)=>`<button class="lv" data-l="${i}" ${i>=open?'disabled':''}><span class="num">${i+1}</span><span><b>${l.t}</b><small>${l.s}${l.p3?' · '+l.p3:''}${i>=open?' · Fermé : réussis le niveau '+i+' pour l\'ouvrir':''}</small></span>${P.b[i]!==undefined?stars(P.b[i]):''}</button>`).join('')}</div>
  ${memo()}<details><summary>Pour l'enseignant·e</summary><p class="note">3 niveaux de 8 questions. 1 point par bonne réponse. Le niveau suivant s'ouvre avec 5 points sur 8. Les questions changent à chaque partie.</p>${APP.levels.map((l,i)=>`<p class="note"><b>Niveau ${i+1}</b> (${l.comp}${l.p3&&!l.comp.includes(l.p3)?', '+l.p3:''}) : ${l.teach}</p>`).join('')}${APP.teach?`<p class="note">${APP.teach}</p>`:''}<p class="note">Pour ouvrir tous les niveaux, ajoute #prof à la fin de l'adresse.</p></details>`)}
 function start(l){lv=l;const g=APP.levels[l].g;let pool=[];while(pool.length<N)pool=pool.concat(shuf(g));
  deck=pool.slice(0,N).map(fn=>fn());qi=0;score=0;res=[];ask()}
 function ask(){done=false;showWords=false;const q=deck[qi];
  show(`<div class="top"><a class="ghost" href="#" data-act="levels">← Niveaux</a><b>${APP.code}${APP.levels[lv].p3?' · '+APP.levels[lv].p3:''} · ${APP.levels[lv].t}</b><span class="score">Score : ${score}</span><div class="dots">${Array.from({length:N},(_,k)=>`<i class="${k<res.length?(res[k]?'g':'b'):k===qi?'c':''}"></i>`).join('')}</div></div>
  <div class="qn">Question ${qi+1} sur ${N}</div>
  ${q.say?`<div class="disp"><div class="listen">${canSpeak?`<button class="btn" data-act="speak">${ICON.speak}Écouter</button>`:''}<button class="btn alt" data-act="words">${canSpeak?'Voir en lettres':'Lire le nombre'}</button></div><div class="words" id="words" ${canSpeak?'hidden':''} style="margin-top:12px">${q.say}</div></div>`:''}
  ${q.big?`<div class="disp">${q.big}</div>`:''}
  <div class="qtext">${q.text.map(t=>`<p>${t}</p>`).join('')}</div>
  <div id="zone">${q.kind==='num'?`<label for="ans" class="lbl">Écris ta réponse :</label><div class="inrow"><input id="ans" inputmode="decimal" autocomplete="off">${q.unit?`<span>${q.unit}</span>`:''}</div><div class="err" id="err" hidden></div><button class="btn" data-act="ok">Je vérifie</button>`
   :`<p class="lbl">Choisis ta réponse :</p><div class="opts ${q.long?'long':''}">${q.opts.map(o=>`<button class="opt" data-v="${esc(o.v)}">${o.l}</button>`).join('')}</div>`}</div>
  <div class="row" style="margin:12px 0 16px"><button class="btn alt" data-act="hint" id="hb">Un indice</button></div><div class="hint" id="hint" hidden></div>
  <div id="fb" role="status" aria-live="polite"></div>${memo(lv)}`);
  const a=$('#ans');if(a)a.focus({preventScroll:true});
  if(q.say&&canSpeak)speak(q)}
 function speak(q){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(q.sayText||q.say.replace(/<[^>]+>/g,''));u.lang='fr-BE';u.rate=.8;
  const v=speechSynthesis.getVoices().find(v=>/^fr/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}}
 function parse(s){s=String(s).replace(/[\s  €]/g,'').replace(/−/g,'-');if(/^-?\d{1,3}(\.\d{3})+$/.test(s))s=s.replace(/\./g,'');s=s.replace(',','.');return s===''||isNaN(+s)?null:+s}
 function check(v){if(done)return;const q=deck[qi];let good,given,right;
  if(q.kind==='num'){const x=parse(v);if(x===null){const e=$('#err');e.textContent='Écris un nombre. Par exemple : 1 250';e.hidden=false;return}
   good=Math.abs(x-q.ans)<0.005;given=q.fmt?q.fmt(x):D(x);right=q.fmt?q.fmt(q.ans):D(q.ans);$('#ans').disabled=true;$('[data-act=ok]').hidden=true}
  else{good=String(v)===String(q.ans);const lab=o=>o.l.replace(/<small>[\s\S]*?<\/small>/g,'').replace(/<\/?big>/g,'');given=lab(q.opts.find(o=>String(o.v)===String(v)));right=lab(q.opts.find(o=>String(o.v)===String(q.ans)));
   document.querySelectorAll('.opt').forEach(b=>{b.disabled=true;if(b.dataset.v===String(q.ans))b.classList.add('good');else if(b.dataset.v===String(v))b.classList.add('bad')})}
  done=true;res.push(good);if(good)score++;$('#hb').hidden=true;
  $('.score').textContent=`Score : ${score}`;$('.dots').innerHTML=Array.from({length:N},(_,k)=>`<i class="${k<res.length?(res[k]?'g':'b'):''}"></i>`).join('');
  const last=qi===N-1;
  $('#fb').innerHTML=(good?`<div class="fb ok"><p class="big">${pick(PRAISE)}</p><p>${q.ok}</p>`
   :`<div class="fb no"><p class="big">Ce n'est pas la bonne réponse.</p><p>Ce n'est pas grave. Tu apprends !</p><p>Ta réponse : <b>${given}</b><br>La bonne réponse : <b>${right}</b></p><p><b>Explication :</b></p><ol>${q.ex.map(x=>`<li>${String(x).replace(/^(\d)\. /,'Étape $1 : ')}</li>`).join('')}</ol>${q.exHtml||''}`)
   +`<div class="row" style="margin-top:12px"><button class="btn" data-act="next">${last?'Voir mon score':'Question suivante →'}</button></div></div>`;
  $('[data-act=next]').focus({preventScroll:true});$('#fb').scrollIntoView({behavior:'smooth',block:'nearest'})}
 function end(){const P=store.prog(APP.code);let unl='';
  if(P.b[lv]===undefined||score>P.b[lv])P.b[lv]=score;if(score>=5&&lv<2&&P.u<lv+2){P.u=lv+2;unl=`<p><b>Le niveau ${lv+2} est ouvert !</b></p>`}
  store.setProg(APP.code,P);store.add(APP.code,APP.title,lv,score,N,APP.levels[lv].p3);
  const msg=score===N?'Parfait ! Tu as tout juste !':score>=6?'Très bien ! Tu as bien travaillé.':score>=4?"C'est bien ! Tu peux encore t'entraîner.":'Continue ! Recommence ce niveau. Lis bien les explications.';
  const canNext=lv<2&&(prof()||P.u>lv+1);
  show(`<section class="end"><h2>${APP.title} · ${APP.levels[lv].t} terminé</h2><p>Bravo ${esc(store.name())}, voici ton score :</p><p class="res">${score} / ${N}</p>${stars(score)}<p>${msg}</p>${unl}${score<5&&lv<2?'<p>Pour ouvrir le niveau suivant, il faut 5 points sur 8.</p>':''}
  <div class="row"><button class="btn alt" data-act="again">Recommencer</button>${canNext?'<button class="btn" data-act="nextlv">Niveau suivant →</button>':''}<a class="ghost" href="../index.html${H()}">Toutes les applications</a><a class="ghost" href="../resultats.html${H()}">Mes résultats</a></div>
  <p style="margin-top:14px">Pour envoyer tes résultats à ton professeur, clique sur « Mes résultats ».</p></section>`)}
 root.addEventListener('click',e=>{const t=e.target.closest('button,a[data-act]');if(!t||t.disabled)return;const a=t.dataset.act;
  if(t.classList.contains('lv')){start(+t.dataset.l);return}
  if(a==='levels'){e.preventDefault();levels();return}
  if(t.classList.contains('opt')){check(t.dataset.v);return}
  if(a==='ok'){check($('#ans').value);return}
  if(a==='hint'){const h=$('#hint');h.textContent='Indice : '+deck[qi].hint;h.hidden=false;return}
  if(a==='speak'){speak(deck[qi]);return}
  if(a==='words'){$('#words').hidden=false;t.hidden=true;return}
  if(a==='next'){if(qi<N-1){qi++;ask()}else end();return}
  if(a==='again'){start(lv);return}
  if(a==='nextlv'){start(lv+1);return}});
 root.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='ans'){e.preventDefault();check(e.target.value)}});
 window.addEventListener('hashchange',()=>{if(root.querySelector('.levels'))levels()});
 levels()};
})();
