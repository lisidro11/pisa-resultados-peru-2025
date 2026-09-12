
const D=window.PISA_DATA;
const E=window.PISA_EXT;
const I=window.PISA_INTL;
const R=window.PISA_REG;
const W=window.PISA_WORLD;
const A=["Matemática","Lectura","Ciencia"];
const C={Matemática:"#20306f",Lectura:"#f6a31b",Ciencia:"#3c98a8"};

const FLAGS={
  "Perú":"pe","Chile":"cl","Uruguay":"uy","Costa Rica":"cr","México":"mx",
  "Colombia":"co","Brasil":"br","Ecuador":"ec","Argentina":"ar","El Salvador":"sv",
  "República Dominicana":"do","Paraguay":"py","Guatemala":"gt","OCDE":"oecd"
};
const GAP_PLUS={
  "Ciencia":[],
  "Lectura":["Hombre","Mujer","Privada","Pública","Urbano"],
  "Matemática":["Hombre","Privada","Pública","Urbano"]
};
const GAP_READING={
  "Ciencia":"Respecto de 2022, Perú mantiene sus resultados. En 2025 persisten brechas por sexo, gestión y área.",
  "Lectura":"En 2025 se evidencia una disminución del puntaje promedio. Las mujeres obtienen mejores resultados que los hombres; los estudiantes de escuelas privadas y urbanas superan a sus pares de escuelas públicas y rurales.",
  "Matemática":"Perú disminuyó su puntaje promedio respecto de 2022. Se mantienen brechas que afectan principalmente a estudiantes de escuelas públicas y rurales."
};

const tabs=[["resumen","Resumen"],["tendencia","Tendencia"],["niveles","Niveles"],["brechas","Brechas"],["equidad","Equidad y contexto"],["regional","Comparación internacional"],["ficha","Ficha PISA 2025"],["datos","Datos agregados"]];
const nav=document.getElementById("nav");
tabs.forEach((t,i)=>{const b=document.createElement("button");b.textContent=t[1];if(i===0)b.className="active";b.onclick=()=>{document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));document.getElementById(t[0]).classList.add("active");document.querySelectorAll(".navlinks button").forEach(x=>x.classList.remove("active"));b.classList.add("active");requestAnimationFrame(renderVisible)};nav.appendChild(b)});

const get=(a,y)=>D.avg[a].find(r=>+r.year===+y);
const ocde=a=>D.regional[a].find(x=>x[0]==="OCDE")[1];
const fmt=(x,d=0)=>Number(x).toLocaleString("es-PE",{minimumFractionDigits:d,maximumFractionDigits:d});
function fill(id,vals){document.getElementById(id).innerHTML=vals.map(v=>`<option value="${v}">${v}</option>`).join("")}

function svgEl(tag,attrs={}){const n=document.createElementNS("http://www.w3.org/2000/svg",tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);return n}
function clear(el){el.innerHTML=""}
function fit(el){return {w:Math.max(600,el.clientWidth||900),h:Math.max(340,el.clientHeight||440)}}

function barChart(el,{labels,datasets,min,max,yStep=50,horizontal=false,showLegend=false}){
 clear(el);
 const {w,h}=fit(el);

 const svg=svgEl("svg",{
   viewBox:`0 0 ${w} ${h}`,
   preserveAspectRatio:"none",
   role:"img",
   "aria-label":"Puntaje promedio de Perú por edición PISA"
 });
 svg.style.overflow="visible";
 el.appendChild(svg);

 /* Se reserva una franja inferior FIJA para:
    - años de edición
    - título 'Edición PISA'
    Esto evita que desaparezcan al cambiar Normal / Ampliada / Pantalla completa. */
 const m={l:55,r:22,t:18,b:68};
 const pw=w-m.l-m.r;
 const ph=h-m.t-m.b;
 const plotBottom=m.t+ph;
 const scaleY=v=>m.t+ph-(v-min)/(max-min)*ph;

 // Rejilla y eje Y
 for(let v=min;v<=max+0.001;v+=yStep){
   const y=scaleY(v);
   svg.appendChild(svgEl("line",{x1:m.l,y1:y,x2:w-m.r,y2:y,stroke:"#e8edf3","stroke-width":"1"}));
   const t=svgEl("text",{x:m.l-10,y:y+4,"text-anchor":"end","font-size":"10",fill:"#596170"});
   t.textContent=v;
   svg.appendChild(t);
 }

 // Referencias OCDE
 datasets.filter(d=>d.kind==="line").forEach((ds,li)=>{
   const y=scaleY(ds.value);
   svg.appendChild(svgEl("line",{
     x1:m.l,y1:y,x2:w-m.r,y2:y,
     stroke:ds.color,"stroke-width":"2","stroke-dasharray":"8 6"
   }));
   const offsets=[-7,13,-7];
   const tx=svgEl("text",{
     x:w-m.r-2,
     y:y+(offsets[li]||-7),
     "text-anchor":"end",
     "font-size":"10",
     "font-weight":"800",
     fill:ds.color
   });
   tx.textContent=ds.label;
   svg.appendChild(tx);
 });

 // Barras + años
 const bars=datasets.filter(d=>d.kind!=="line");
 const n=labels.length;
 const g=pw/n;
 const gap=4;
 const bw=Math.min(42,(g-18)/Math.max(1,bars.length));

 labels.forEach((lab,i)=>{
   const cx=m.l+g*i+g/2;

   bars.forEach((ds,j)=>{
     const v=ds.values[i];
     if(v==null)return;
     const x=cx-(bars.length*bw+(bars.length-1)*gap)/2+j*(bw+gap);
     const y=scaleY(v);

     svg.appendChild(svgEl("rect",{
       x,y,width:bw,height:plotBottom-y,fill:ds.color
     }));

     const tt=svgEl("text",{
       x:x+bw/2,y:y-5,
       "text-anchor":"middle",
       "font-size":"10",
       "font-weight":"700",
       fill:ds.labelColor||ds.color
     });
     tt.textContent=Math.round(v);
     svg.appendChild(tt);
   });

   // Año: siempre dentro de la franja reservada
   const yearText=svgEl("text",{
     x:cx,
     y:plotBottom+24,
     "text-anchor":"middle",
     "font-size":"10.5",
     "font-weight":"650",
     fill:"#4f5663"
   });
   yearText.textContent=String(lab);
   svg.appendChild(yearText);
 });

 // Título eje Y
 const yl=svgEl("text",{
   x:12,
   y:m.t+ph/2,
   transform:`rotate(-90 12 ${m.t+ph/2})`,
   "text-anchor":"middle",
   "font-size":"10",
   fill:"#4f5663"
 });
 yl.textContent="Puntaje";
 svg.appendChild(yl);

 // Título eje X: separado de los años
 const xl=svgEl("text",{
   x:m.l+pw/2,
   y:plotBottom+48,
   "text-anchor":"middle",
   "font-size":"10",
   "font-weight":"600",
   fill:"#667085"
 });
 xl.textContent="Edición PISA";
 svg.appendChild(xl);
}
function lineChart(el,{labels,datasets,min,max,step=10}){
 clear(el);
 const {w,h}=fit(el);
 const svg=svgEl("svg",{viewBox:`0 0 ${w} ${h}`,preserveAspectRatio:"xMidYMid meet"});
 svg.style.overflow="visible";
 el.appendChild(svg);
 const m={l:58,r:30,t:34,b:58},pw=w-m.l-m.r,ph=h-m.t-m.b;
 const sx=i=>m.l+(labels.length===1?pw/2:i*pw/(labels.length-1));
 const sy=v=>m.t+ph-(v-min)/(max-min)*ph;

 for(let v=min;v<=max;v+=step){
   const y=sy(v);
   svg.appendChild(svgEl("line",{x1:m.l,y1:y,x2:w-m.r,y2:y,stroke:"#e8edf3"}));
   let t=svgEl("text",{x:m.l-10,y:y+4,"text-anchor":"end","font-size":"10",fill:"#596170"});
   t.textContent=v; svg.appendChild(t);
 }
 datasets.forEach((ds,di)=>{
   let seg=[];
   const flush=()=>{if(seg.length>1)svg.appendChild(svgEl("polyline",{points:seg.join(" "),fill:"none",stroke:ds.color,"stroke-width":"3"}));seg=[]};
   ds.values.forEach((v,i)=>{ if(v==null){flush();} else seg.push(`${sx(i)},${sy(v)}`); }); flush();
   ds.values.forEach((v,i)=>{
     if(v==null)return;
     svg.appendChild(svgEl("circle",{cx:sx(i),cy:sy(v),r:4.3,fill:ds.color}));
     const offsets=[
       {dx:0,dy:17},
       {dx:-7,dy:-10},
       {dx:7,dy:-24}
     ][di] || {dx:0,dy:-10};
     let t=svgEl("text",{x:sx(i)+offsets.dx,y:sy(v)+offsets.dy,"text-anchor":"middle","font-size":"10","font-weight":"800",fill:ds.color});
     t.textContent=Math.round(v); svg.appendChild(t);
   });
 });
 labels.forEach((l,i)=>{
   let t=svgEl("text",{x:sx(i),y:h-18,"text-anchor":"middle","font-size":"10.5","font-weight":"650",fill:"#4f5663"});
   t.textContent=l; svg.appendChild(t);
 });
 const xl=svgEl("text",{x:m.l+pw/2,y:h-3,"text-anchor":"middle","font-size":"9.5",fill:"#667085"});
 xl.textContent="Edición PISA"; svg.appendChild(xl);
}

function horizontalBarChart(el,{labels,values,colors,min,max,format=x=>x}){
 clear(el);
 const{w,h}=fit(el);
 const svg=svgEl("svg",{viewBox:`0 0 ${w} ${h}`,"preserveAspectRatio":"xMidYMid meet"});
 svg.style.overflow="visible";
 el.appendChild(svg);

 // Margen izquierdo amplio para que SIEMPRE se vean los nombres.
 const longest=Math.max(...labels.map(x=>String(x).length));
 const left=Math.min(235,Math.max(175,110+longest*5.2));
 const m={l:left,r:65,t:14,b:32},pw=w-m.l-m.r,ph=h-m.t-m.b;
 const row=ph/labels.length;
 const sx=v=>m.l+(v-min)/(max-min)*pw;

 labels.forEach((lab,i)=>{
   const y=m.t+i*row+row*.2;
   let tx=svgEl("text",{
     x:m.l-14,y:y+row*.36,
     "text-anchor":"end",
     "font-size":"13",
     "font-weight":lab==="Perú"||lab==="OCDE"?"800":"650",
     fill:lab==="Perú"?"#20306f":lab==="OCDE"?"#20306f":"#4f5663"
   });
   tx.textContent=lab;
   svg.appendChild(tx);

   const x0=min>=0?sx(min):sx(0),x1=sx(values[i]);
   svg.appendChild(svgEl("rect",{
     x:Math.min(x0,x1),y,
     width:Math.abs(x1-x0),
     height:row*.52,
     fill:colors[i],
     rx:"1.5"
   }));

   let val=svgEl("text",{
     x:x1+(values[i]>=0?7:-7),y:y+row*.37,
     "text-anchor":values[i]>=0?"start":"end",
     "font-size":"11",
     "font-weight":"800",
     fill:colors[i]
   });
   val.textContent=format(values[i]);
   svg.appendChild(val);
 });
 if(min<0&&max>0)svg.appendChild(svgEl("line",{x1:sx(0),x2:sx(0),y1:m.t,y2:h-m.b,stroke:"#87909f","stroke-width":"1"}));
}


function renderExecutiveGaps(stratum="Gestión"){
  const cfg={
    "Gestión":["Privada","Pública"],
    "Sexo":["Hombre","Mujer"],
    "Área":["Urbano","Rural"]
  };
  const [g1,g2]=cfg[stratum];
  const grid=document.getElementById("execGapGrid");
  const context=document.getElementById("execGapContext");
  const note=document.getElementById("execGapNote");
  if(!grid)return;
  context.textContent=`${g1} vs. ${g2} · Año 2025`;
  const ttl=document.getElementById("execGapTitle");
  if(ttl) ttl.textContent=`Comparación 2025 por ${stratum}`;
  const scaleMin=330, scaleMax=460;
  grid.innerHTML=A.map(a=>{
    const v1=D.strata[a][g1][1],v2=D.strata[a][g2][1];
    const p1=(v1-scaleMin)/(scaleMax-scaleMin)*100;
    const p2=(v2-scaleMin)/(scaleMax-scaleMin)*100;
    const left=Math.min(p1,p2),width=Math.abs(p1-p2);
    const diff=Math.abs(v1-v2);
    const higher=v1>=v2?g1:g2, lower=v1>=v2?g2:g1;
    return `<article class="exec-gap-card">
      <div class="exec-gap-title"><span class="dot" style="background:${C[a]}"></span><b>${a}</b><strong>${diff} pts</strong></div>
      <div class="dumbbell-labels"><span>${g1} <b>${v1}</b></span><span>${g2} <b>${v2}</b></span></div>
      <div class="dumbbell">
        <div class="dumbbell-line" style="left:${left}%;width:${width}%;background:${C[a]}"></div>
        <span class="dumbbell-dot" style="left:${p1}%;background:${C[a]}"></span>
        <span class="dumbbell-dot secondary" style="left:${p2}%;border-color:${C[a]}"></span>
      </div>
      <div class="exec-gap-caption">${higher} supera a ${lower} por <b>${diff} puntos</b>.</div>
    </article>`;
  }).join("");
  if(stratum==="Gestión") note.innerHTML="<b>Hallazgo ejecutivo:</b> en 2025, la brecha Privada–Pública es de 59 puntos en Matemática, 62 en Lectura y 57 en Ciencia.";
  else if(stratum==="Sexo") note.innerHTML="<b>Lectura:</b> la dirección de la brecha por sexo varía según la competencia; por ello se muestran los puntajes de ambos grupos y no una conclusión única.";
  else note.innerHTML="<b>Hallazgo ejecutivo:</b> en las tres competencias, el puntaje urbano supera al rural en 2025.";
}

function initExecutiveGapSelector(){
  const box=document.getElementById("execGapSelector");
  if(!box || box.dataset.ready)return;
  box.dataset.ready="1";
  box.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
    box.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderExecutiveGaps(btn.dataset.stratum);
  }));
}

function renderSummary(){
 const years=[2009,2012,2015,2018,2022,2025];
 barChart(document.getElementById("summaryChart"),{labels:years,datasets:[
   {label:"Matemática",values:years.map(y=>get("Matemática",y).national),color:C.Matemática},
   {label:"Lectura",values:years.map(y=>get("Lectura",y).national),color:C.Lectura,labelColor:"#bf6500"},
   {label:"Ciencia",values:years.map(y=>get("Ciencia",y).national),color:C.Ciencia,labelColor:"#116b79"},
   {kind:"line",value:463,color:C.Matemática,label:"OCDE Matemática: 463"},
   {kind:"line",value:461,color:C.Lectura,label:"OCDE Lectura: 461"},
   {kind:"line",value:482,color:C.Ciencia,label:"OCDE Ciencia: 482"}
 ],min:300,max:500,yStep:50});
 const rows=[["Matemática",382,463,C.Matemática],["Lectura",390,461,C.Lectura],["Ciencia",406,482,C.Ciencia]];
 gapRows.innerHTML=rows.map(([a,p,o,c])=>`<div class="gap-row"><span class="gap-area"><span class="dot" style="background:${c}"></span>${a}</span><span>${p} / ${o}</span><strong>${p-o}</strong></div>`).join("");
 initExecutiveGapSelector();
 const active=document.querySelector("#execGapSelector button.active");
 renderExecutiveGaps(active?active.dataset.stratum:"Gestión");
}

function renderTrend(){
 const mode=document.querySelector("#trendDimension button.active")?.dataset.dim||"Nacional";
 const comp=trendArea.value||"Ciencia";
 const title=document.getElementById("trendTitle"), sub=document.getElementById("trendSubtitle");
 const note=document.getElementById("trendMethodNote"), legend=document.getElementById("trendLegend"), cards=document.getElementById("trendCards");
 const compWrap=document.getElementById("trendCompWrap");
 if(mode==="Nacional"){
   compWrap.style.visibility="hidden";
   title.textContent="Tendencia nacional de resultados PISA del Perú";
   sub.textContent="Matemática, Lectura y Ciencia · 2009–2025.";
   note.style.display="none";
   legend.innerHTML=A.map(a=>`<span><i style="background:${C[a]}"></i>${a}</span>`).join("");
   const yrs=E.years;
   lineChart(document.getElementById("trendChart"),{labels:yrs,datasets:A.map(a=>({color:C[a],values:E.strataTrend[a].Nacional.Perú})),min:350,max:420,step:10});
   cards.innerHTML=`
     <div class="trend-card" style="background:#f7f9fe"><b>Matemática</b><strong>391 → 382</strong><span class="trend-delta down">−8,8 puntos*</span><small>Disminución significativa respecto de 2022.</small></div>
     <div class="trend-card" style="background:#fffaf1"><b>Lectura</b><strong>408 → 390</strong><span class="trend-delta down">−18,1 puntos*</span><small>Disminución significativa respecto de 2022.</small></div>
     <div class="trend-card" style="background:#f3fbfc"><b>Ciencia</b><strong>408 → 406</strong><span class="trend-delta neutral">−2,2 puntos</span><small>El brochure señala que Perú mantiene sus resultados.</small></div>
     <div class="trend-reading"><b>Lectura ejecutiva</b><p>Matemática y Lectura retroceden en 2025; Ciencia se mantiene. La lectura de largo plazo debe complementarse con las brechas por estrato.</p></div>`;
   return;
 }
 compWrap.style.visibility="visible";
 title.textContent=`Tendencia por ${mode} – ${comp}`;
 sub.textContent="Medida promedio publicada por UMC/Minedu; 2025 se completa con el brochure PISA 2025.";
 const groups=E.strataTrend[comp][mode];
 let labels=E.years, datasets=[], palette=["#20306f","#3c98a8"];
 if(mode==="Área"){
   labels=[2009,2012,2015,2018,"↯",2022,2025];
   const vals=Object.values(groups);
   Object.entries(groups).forEach(([g,v],i)=>datasets.push({color:palette[i],values:[v[0],v[1],v[2],v[3],null,v[4],v[5]]}));
   note.style.display="block";
   note.innerHTML="<b>Ruptura metodológica:</b> UMC advierte que la definición de ruralidad cambió en 2020. Por ello no debe interpretarse 2018→2022 como una variación estrictamente comparable.";
 } else {
   Object.entries(groups).forEach(([g,v],i)=>datasets.push({color:palette[i],values:v}));
   note.style.display="none";
 }
 legend.innerHTML=Object.keys(groups).map((g,i)=>`<span><i style="background:${palette[i]}"></i>${g}</span>`).join("");
 const all=Object.values(groups).flat();
 const ymin=Math.floor((Math.min(...all)-15)/10)*10, ymax=Math.ceil((Math.max(...all)+15)/10)*10;
 lineChart(document.getElementById("trendChart"),{labels,datasets,min:ymin,max:ymax,step:20});
 const [g1,g2]=Object.keys(groups), v1=groups[g1],v2=groups[g2];
 const gap09=Math.abs(v1[0]-v2[0]), gap25=Math.abs(v1[5]-v2[5]);
 const high25=v1[5]>=v2[5]?g1:g2, low25=v1[5]>=v2[5]?g2:g1;
 let trendText=gap25<gap09?`La brecha descriptiva se reduce de ${gap09} a ${gap25} puntos.`:gap25>gap09?`La brecha descriptiva pasa de ${gap09} a ${gap25} puntos.`:`La brecha descriptiva se mantiene en ${gap25} puntos.`;
 if(mode==="Área") trendText+=" La comparación de 2018 con 2022 no es homogénea por el cambio de definición de ruralidad.";
 cards.innerHTML=`
   <div class="trend-card"><b>${g1}</b><strong>${v1[0]} → ${v1[5]}</strong><span>${v1[5]-v1[0]>=0?"+":""}${v1[5]-v1[0]} pts</span><small>2009→2025</small></div>
   <div class="trend-card"><b>${g2}</b><strong>${v2[0]} → ${v2[5]}</strong><span>${v2[5]-v2[0]>=0?"+":""}${v2[5]-v2[0]} pts</span><small>2009→2025</small></div>
   <div class="trend-card gap-card"><b>Brecha 2025</b><strong>${gap25} pts</strong><span>${high25} &gt; ${low25}</span><small>${comp}</small></div>
   <div class="trend-reading"><b>Lectura descriptiva</b><p>${trendText} La significancia estadística solo se afirma cuando la fuente la reporta explícitamente.</p></div>`;
}


const LEVEL_DESC={
"Ciencia":{
"Nivel 6":"Integra teorías, modelos, datos complejos y múltiples fuentes para explicar fenómenos, evaluar investigaciones y justificar decisiones en contextos nuevos o inciertos.",
"Nivel 5":"Aplica ideas científicas abstractas a fenómenos complejos o poco familiares y evalúa críticamente evidencia, métodos y explicaciones.",
"Nivel 4":"Usa conocimientos científicos más complejos para interpretar información, evaluar procedimientos y construir explicaciones con varias relaciones.",
"Nivel 3":"Aplica conocimientos de complejidad moderada, identifica evidencia pertinente y distingue cuestiones científicas de no científicas.",
"Nivel 2":"Usa conocimientos científicos básicos para reconocer explicaciones correctas, interpretar datos sencillos y determinar si una conclusión es válida. Es la línea base PISA.",
"Nivel 1a":"Reconoce explicaciones sencillas y usa conocimientos científicos cotidianos en contextos familiares y explícitos.",
"Nivel 1b":"Identifica patrones o relaciones científicas muy simples cuando la información y las instrucciones son directas.",
"Debajo del Nivel 1b":"Presenta dificultades para resolver incluso tareas científicas básicas con información explícita."
},
"Lectura":{
"Nivel 6":"Comprende textos extensos y abstractos, integra información distante y evalúa críticamente fuentes, ambigüedades e inconsistencias.",
"Nivel 5":"Localiza información profundamente integrada, comprende conceptos complejos y distingue hechos de opiniones usando claves implícitas.",
"Nivel 4":"Comprende pasajes extensos, compara perspectivas y evalúa la relación entre contenido y fuente con criterios explícitos o implícitos.",
"Nivel 3":"Identifica ideas principales, integra varias partes de un texto y realiza inferencias de complejidad moderada.",
"Nivel 2":"Identifica la idea principal de un texto de extensión moderada, localiza información con criterios explícitos y reflexiona sobre propósito y forma. Es la línea base PISA.",
"Nivel 1a":"Comprende el significado literal de oraciones o pasajes breves y localiza información explícita.",
"Nivel 1b":"Reconoce información sencilla en textos cortos y de estructura familiar cuando la tarea es muy explícita.",
"Nivel 1c":"Comprende el significado de frases muy breves y reconoce palabras o relaciones simples.",
"Debajo del Nivel 1c":"Presenta dificultades para demostrar las habilidades lectoras básicas medidas por PISA."
},
"Matemática":{
"Nivel 6":"Conceptualiza, generaliza y usa información de problemas complejos; modela situaciones y justifica estrategias matemáticas avanzadas.",
"Nivel 5":"Desarrolla y trabaja con modelos de situaciones complejas, compara estrategias y comunica razonamientos matemáticos elaborados.",
"Nivel 4":"Trabaja eficazmente con modelos explícitos de situaciones complejas y selecciona representaciones apropiadas para resolverlas.",
"Nivel 3":"Ejecuta procedimientos claramente descritos, selecciona estrategias sencillas e interpreta representaciones de fuentes distintas.",
"Nivel 2":"Reconoce sin instrucciones directas cómo representar matemáticamente una situación sencilla y aplica procedimientos básicos. Es la línea base PISA.",
"Nivel 1a":"Responde preguntas en contextos familiares cuando toda la información relevante está presente y las instrucciones son directas.",
"Nivel 1b":"Realiza cálculos elementales con información muy simple y claramente estructurada.",
"Nivel 1c":"Responde a tareas extremadamente simples donde la operación requerida es evidente.",
"Debajo del Nivel 1c":"Presenta dificultades para resolver las tareas matemáticas elementales medidas por PISA."
}};

function renderLevels(){
 const levelAreaEl=document.getElementById("levelArea");
 const levelGridEl=document.getElementById("levelGrid");
 const currentEl=document.getElementById("levelsCurrent");
 const historyEl=document.getElementById("levelsHistory");
 const chartEl=document.getElementById("levelsChart");
 const historyChartEl=document.getElementById("levelsHistoryChart");
 const historyKpisEl=document.getElementById("levelsHistoryKpis");
 const titleEl=document.getElementById("levelsTitle");

 const a=levelAreaEl?.value||"Ciencia";
 const mode=document.querySelector("#levelsMode button.active")?.dataset.mode||"current";
 if(titleEl) titleEl.textContent=`Niveles de desempeño – ${a}`;
 if(currentEl) currentEl.style.display=mode==="current"?"block":"none";
 if(historyEl) historyEl.style.display=mode==="history"?"block":"none";

 if(mode==="history"){
   const yrs=E.years;
   const vals=yrs.map(y=>E.level2plusTrend[a][String(y)]);
   lineChart(historyChartEl,{
     labels:yrs,
     datasets:[{color:C[a],values:vals}],
     min:Math.max(0,Math.floor((Math.min(...vals)-8)/10)*10),
     max:Math.ceil((Math.max(...vals)+8)/10)*10,
     step:10
   });
   const exact=D.levels[a].find(r=>r.year===2025&&r.level==="Nivel 2")?.national??0;
   const plus=E.level2plusTrend[a]["2025"];
   const oecd={Ciencia:74,Lectura:69,Matemática:65}[a];
   if(historyKpisEl) historyKpisEl.innerHTML=`
     <div class="level-kpi"><span>Exactamente en Nivel 2</span><strong style="color:${C[a]}">${fmt(exact,1)} %</strong></div>
     <div class="level-kpi primary"><span>Alcanza o supera Nivel 2</span><strong style="color:${C[a]}">${fmt(plus,1)} %</strong></div>
     <div class="level-kpi"><span>Promedio OCDE · Nivel 2+</span><strong>${oecd} %</strong></div>
     <div class="level-kpi"><span>Variación 2022→2025</span><strong>${fmt(plus-E.level2plusTrend[a]["2022"],1)} pp</strong></div>`;
   return;
 }

 /* D.levels es un objeto por competencia: D.levels["Ciencia"], etc. */
 const rows=(D.levels[a]||[]).filter(r=>r.year===2025);
 const plus=E.level2plusTrend[a]["2025"];
 const selected=(window.__selectedPisaLevel?.area===a)
   ? window.__selectedPisaLevel.level
   : "Nivel 2";
 const ranges=D.ranges[a]||[];

 if(levelGridEl){
   levelGridEl.innerHTML=`
     <div class="levelbox ranges-card">
       <div class="levels-box-head">
         <h3>${a}: rangos</h3>
         <span>Selecciona un nivel</span>
       </div>
       <div class="ranges-list">
         ${ranges.map(([level,range])=>`
           <button type="button"
             class="range level-select ${level===selected?"active":""}"
             data-level="${level}">
             <b>${level}</b><span>${range}</span>
           </button>`).join("")}
       </div>
     </div>

     <div class="levels-side-stack">
       <div class="levelbox meaning-card">
         <div class="levels-box-head">
           <h3>¿Qué significa?</h3><span>${a}</span>
         </div>
         <div class="meaning-level-badge" id="meaningLevelBadge">${selected}</div>
         <p id="meaningLevelText">${LEVEL_DESC[a]?.[selected]||D.level2desc[a]||""}</p>
         <div class="baseline-inline ${selected==="Nivel 2"?"show":""}" id="baselineInline">
           <b>Nivel 2</b> es la línea base de PISA.
         </div>
       </div>

       <div class="levelbox baseline-card">
         <div class="levels-box-head">
           <h3>Línea base 2025</h3><span>Nivel 2+</span>
         </div>
         <div class="baseline-value">${fmt(plus,1)}<small>%</small></div>
         <p>Alcanza o supera Nivel 2.</p>
         <div class="baseline-sub">
           Exactamente en Nivel 2:
           <b>${fmt(rows.find(r=>r.level==="Nivel 2")?.national??0,1)} %</b>
         </div>
       </div>
     </div>`;

   levelGridEl.querySelectorAll(".level-select").forEach(btn=>{
     btn.addEventListener("click",()=>{
       const level=btn.dataset.level;
       window.__selectedPisaLevel={area:a,level};
       levelGridEl.querySelectorAll(".level-select").forEach(x=>{
         x.classList.toggle("active",x===btn);
       });
       const badge=document.getElementById("meaningLevelBadge");
       const txt=document.getElementById("meaningLevelText");
       const base=document.getElementById("baselineInline");
       if(badge) badge.textContent=level;
       if(txt) txt.textContent=LEVEL_DESC[a]?.[level]||"";
       if(base) base.classList.toggle("show",level==="Nivel 2");
     });
   });
 }

 if(chartEl && rows.length){
   const vals=rows.map(r=>r.national);
   const labels=rows.map(r=>r.level);
   horizontalBarChart(chartEl,{
     labels,
     values:vals,
     colors:labels.map(()=>C[a]),
     min:0,
     max:Math.max(40,Math.ceil(Math.max(...vals)/10)*10),
     format:v=>fmt(v,1)+" %"
   });
 }
}
function renderGaps(){
 const a=gapArea.value,obj=D.strata[a],labels=Object.keys(obj);
 const ttl=document.getElementById("gapsTitle"); if(ttl) ttl.textContent=`Brechas por estratos – ${a}`;
 const imp=document.getElementById("gapImpact");
 if(imp){
   const sexo=Math.abs(obj["Hombre"][1]-obj["Mujer"][1]);
   const gestion=Math.abs(obj["Privada"][1]-obj["Pública"][1]);
   const area=Math.abs(obj["Urbano"][1]-obj["Rural"][1]);
   const items=[
     {key:"Sexo",value:sexo,icon:"sexo.svg",a:"Hombre",b:"Mujer"},
     {key:"Gestión",value:gestion,icon:"gestion.svg",a:"Privada",b:"Pública"},
     {key:"Área",value:area,icon:"area.svg",a:"Urbano",b:"Rural"}
   ];
   const maxGap=Math.max(...items.map(x=>x.value));
   imp.innerHTML=items.map(x=>{
     const va=obj[x.a][1], vb=obj[x.b][1];
     const high=va>=vb?x.a:x.b, low=va>=vb?x.b:x.a;
     return `<div class="gap-impact-card ${x.value===maxGap?"largest":""}">
       <img src="assets/icons/${x.icon}" alt="">
       <div class="gap-impact-copy"><span>Brecha 2025 · ${x.key}</span><small>${high} &gt; ${low}</small></div>
       <strong>${x.value} pts</strong>
     </div>`;
   }).join("");
 }
 const el=document.getElementById("gapChart");clear(el);
 const min=330,max=460,span=max-min;
 el.innerHTML=labels.map((lab,idx)=>{
   const v22=obj[lab][0],v25=obj[lab][1],p22=(v22-min)/span*100,p25=(v25-min)/span*100;
   const left=Math.min(p22,p25),width=Math.abs(p25-p22),chg=v25-v22;
   const plus=GAP_PLUS[a].includes(lab)?"+":"";
   const group=idx===0?"Sexo":idx===2?"Gestión":idx===4?"Área":"";
   return `${group?`<div class="gap-group-label">${group}</div>`:""}<div class="gap-d-row">
     <div class="gap-d-label">${lab}</div>
     <div class="gap-d-track">
       <div class="gap-d-connector" style="left:${left}%;width:${width}%"></div>
       <span class="gap-d-point p22" style="left:${p22}%"><i></i><b>${v22}</b></span>
       <span class="gap-d-point p25" style="left:${p25}%;--area:${C[a]}"><i></i><b>${v25}${plus}</b></span>
     </div>
     <div class="gap-d-change ${chg<0?"down":chg>0?"up":"flat"}">${chg>0?"+":""}${chg} pts</div>
   </div>`;
 }).join("");
 const reading=document.getElementById("gapReading");
 if(reading)reading.innerHTML=`<div><b>Lectura del resultado – ${a}</b><p>${GAP_READING[a]}</p></div>`;
 const sw=document.querySelector(".legend-swatch.y2025"); if(sw)sw.style.background=C[a];
}


function initEquity(){
 const box=document.getElementById("equityTabs"); if(!box||box.dataset.ready)return;
 box.dataset.ready="1";
 Object.keys(E.equityContext).forEach((topic,i)=>{
   const b=document.createElement("button"); b.textContent=topic; b.dataset.topic=topic; if(i===0)b.className="active";
   b.addEventListener("click",()=>{box.querySelectorAll("button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderEquity();});
   box.appendChild(b);
 });
}
function renderEquity(){
 initEquity();
 const topic=document.querySelector("#equityTabs button.active")?.dataset.topic||Object.keys(E.equityContext)[0];
 const items=E.equityContext[topic]||[];
 equityGrid.innerHTML=items.map(x=>{
   const compare=x.ocde!==null&&x.ocde!==undefined&&x.ocde!=="";
   const diff=compare?Number(x.peru)-Number(x.ocde):null;
   const past=x.peru_2022!==undefined?`<small>Perú 2022: <b>${x.peru_2022}${x.unidad==="%"?" %":""}</b></small>`:"";
   return `<article class="equity-card">
    <div class="equity-label">${x.indicador}</div>
    <div class="equity-values"><div><span>Perú</span><strong>${x.peru}${x.unidad==="%"?" %":x.unidad==="puntos"?" pts":x.unidad==="horas/día"?" h/día":""}</strong></div>${compare?`<div><span>OCDE</span><strong>${x.ocde}${x.unidad==="%"?" %":x.unidad==="puntos"?" pts":x.unidad==="horas/día"?" h/día":""}</strong></div>`:""}</div>
    ${past}
   </article>`;
 }).join("");
 const readings={
  "Equidad socioeconómica":"La brecha socioeconómica en Ciencia es de 78 puntos. El estatus socioeconómico explica 14% de la variación del rendimiento y 10% de estudiantes desfavorecidos son académicamente resilientes.",
  "Actitudes y aprendizaje":"Perú reporta altos niveles de curiosidad y esfuerzo, pero una menor proporción de mentalidad de crecimiento que el promedio OCDE.",
  "Escuela y recursos":"Los reportes muestran desafíos en materiales e infraestructura, junto con una expansión marcada de las prohibiciones de celulares y un uso extendido de IA para aprender.",
  "Bienestar y asistencia":"Persisten señales de alerta en bullying, ausentismo y tardanza; el apoyo familiar reportado disminuyó entre 2022 y 2025.",
  "Nuevas competencias 2025":"En resolución computacional de problemas Perú obtuvo 436 puntos frente a 500 OCDE. Es una escala nueva: no debe forzarse una tendencia histórica."
 };
 equityReading.innerHTML=`<b>Lectura del módulo:</b> ${readings[topic]||""}`;
}
function flagImg(country){
 const code=(W?.flags?.[country]||R.flags[country]); return code?`<img class="mini-flag" src="assets/flags/${code}.svg" alt="">`:"";
}
function renderRegional(){
 const view=document.querySelector("#regionalView button.active")?.dataset.view||"panorama";
 const comp=regionalArea.value||"Ciencia";
 const year=Number(regionalYear.value||2025);
 const pan=document.getElementById("regionalPanorama"), world=document.getElementById("regionalWorld"), cmp=document.getElementById("regionalCompare"), evo=document.getElementById("regionalEvolution"), adv=document.getElementById("regionalAdvanced");
 pan.style.display=view==="panorama"?"block":"none"; world.style.display=view==="world"?"block":"none"; cmp.style.display=view==="compare"?"block":"none"; evo.style.display=view==="evolution"?"block":"none"; adv.style.display=["baseline","top","equity","digital"].includes(view)?"block":"none";
 document.getElementById("regionalYearWrap").style.display=view==="panorama"?"flex":"none";
 document.getElementById("regionalMainTitle").textContent=view==="panorama"?`Comparación regional ${year} – ${comp}`:view==="world"?`Panorama internacional ${Number(document.getElementById("worldYear")?.value||2025)} – ${comp}`:view==="compare"?`Comparación personalizada ${Number(document.getElementById("worldYear")?.value||2025)} – ${comp}`:view==="evolution"?`Evolución regional 2009–2025 – ${comp}`:"Comparación internacional";
 if(view==="panorama"){renderRegionalPanorama(comp,year);return;}
 if(view==="world"){renderWorldPanorama(comp);return;}
 if(view==="compare"){renderWorldCompare(comp);return;}
 if(view==="evolution"){renderRegionalEvolution(comp);return;}
 renderRegionalAdvanced(view,comp);
}
function renderRegionalPanorama(comp,year){
 const rows=Object.entries(R.scores[comp]).map(([p,vals])=>[p,vals[String(year)]??vals[year]]).filter(x=>x[1]!=null).sort((a,b)=>b[1]-a[1]);
 const countries=rows.filter(x=>x[0]!=="OCDE"), peru=countries.find(x=>x[0]==="Perú"), oecd=rows.find(x=>x[0]==="OCDE");
 const max=Math.max(...rows.map(x=>x[1])), min=Math.min(...rows.map(x=>x[1])), span=Math.max(1,max-min);
 rankTitle.textContent=`Resultados PISA ${year}`;
 regionalRanking.innerHTML=`<div class="rr-head"><span>País / referencia</span><span>Puntaje promedio PISA ${year}</span><span>Puntaje</span></div>`+
 rows.map(([p,v])=>{
   const w=14+78*(v-min)/span, cls=p==="Perú"?"peru":p==="OCDE"?"oecd":"";
   return `<div class="rr-row ${cls}"><div class="rr-country">${flagImg(p)}<b>${p}</b></div><div class="rr-bar-track"><div class="rr-bar" style="width:${w}%"></div></div><strong>${v}</strong></div>`;
 }).join("");
 const imp=R.improvement[comp], vals=Object.values(imp), abs=Math.max(...vals.map(Math.abs),1);
 improvementChart.innerHTML=Object.entries(imp).sort((a,b)=>b[1]-a[1]).map(([p,v])=>{
   const left=v>=0?50:50-(Math.abs(v)/abs)*42, width=(Math.abs(v)/abs)*42;
   return `<div class="imp-row ${p==="Perú"?"peru":""}"><div>${flagImg(p)}<b>${p}</b></div><div class="imp-axis"><i></i><span class="${v>=0?"pos":"neg"}" style="left:${left}%;width:${width}%"></span></div><strong>${v>0?"+":""}${v.toFixed(1)}</strong></div>`;
 }).join("");
 const best=Object.entries(imp).sort((a,b)=>b[1]-a[1])[0];
 improvementReading.innerHTML=`<b>Lectura regional:</b> ${best[0]} registra <strong>${best[1]>0?"+":""}${best[1].toFixed(1)}</strong> en el indicador de promedio de mejora 2009–2025, el mayor valor del grupo mostrado para ${comp}.`;
 if(peru && oecd){
   const rank=countries.findIndex(x=>x[0]==="Perú")+1, leader=countries[0], nearest=countries.filter(x=>x[0]!=="Perú").sort((a,b)=>Math.abs(a[1]-peru[1])-Math.abs(b[1]-peru[1]))[0];
   regionalKpis.innerHTML=`<div class="regional-kpi"><span>Perú</span><strong>${peru[1]}</strong><small>puntaje ${year}</small></div><div class="regional-kpi"><span>Orden regional mostrado</span><strong>${rank} de ${countries.length}</strong><small>según puntaje estimado</small></div><div class="regional-kpi"><span>Mayor puntaje regional</span><strong>${leader[0]}</strong><small>${leader[1]} puntos</small></div><div class="regional-kpi"><span>Brecha Perú–OCDE</span><strong>${peru[1]-oecd[1]} pts</strong><small>OCDE: ${oecd[1]}</small></div>`;
   regionalReading.innerHTML=`<b>Hallazgos de ${year}:</b> Perú registra <strong>${peru[1]} puntos</strong> en ${comp}. Dentro de los países con dato disponible que se muestran, ocupa el orden ${rank} de ${countries.length}. El mayor puntaje regional corresponde a <strong>${leader[0]} (${leader[1]})</strong>. ${nearest?`El país con puntaje más cercano a Perú es <strong>${nearest[0]} (${nearest[1]})</strong>. `:""}La distancia con el promedio OCDE es de <strong>${Math.abs(peru[1]-oecd[1])} puntos</strong>.`;
 } else {
   regionalKpis.innerHTML=""; regionalReading.innerHTML=`<b>Edición ${year}:</b> el ranking muestra únicamente países con datos disponibles en la matriz oficial consolidada.`;
 }
}
const worldColors=["#d9485f","#20306f","#3c98a8","#f6a31b","#7c6ccf","#54a16a"];

function worldDataset(comp,year){
 const H=window.PISA_WORLD_HISTORY;
 return H?.world?.[comp]?.[String(year)] || (year===2025 ? (W.world[comp]||{}) : {});
}
function worldRows(comp,scope="all",search="",year=2025){
 let rows=Object.entries(worldDataset(comp,year));
 const cleanName=p=>p.replace("*","");
 if(scope==="latam") rows=rows.filter(([p])=>W.latam.includes(cleanName(p))||cleanName(p)==="República Dominicana"||cleanName(p)==="Panamá"||p==="OCDE");
 if(scope==="leaders"){
   rows=rows.sort((a,b)=>b[1]-a[1]);
   const leaders=new Set(rows.filter(([p])=>p!=="OCDE").slice(0,12).map(x=>x[0]));
   rows=rows.filter(([p])=>leaders.has(p)||cleanName(p)==="Perú"||p==="OCDE");
 }
 if(scope==="oecd") rows=rows.filter(([p])=>W.oecd.includes(cleanName(p))||cleanName(p)==="Perú"||p==="OCDE");
 const q=(search||"").trim().toLowerCase(); if(q) rows=rows.filter(([p])=>cleanName(p).toLowerCase().includes(q));
 return rows.sort((a,b)=>b[1]-a[1]);
}
function renderWorldPanorama(comp){
 const year=Number(document.getElementById("worldYear")?.value||2025);
 const scope=document.getElementById("worldScope")?.value||"all", search=document.getElementById("worldSearch")?.value||"";
 const rows=worldRows(comp,scope,search,year), all=worldRows(comp,"all","",year);
 const data=worldDataset(comp,year), peru=data["Perú"], oe=data["OCDE"];
 const systems=all.filter(x=>x[0]!=="OCDE"), leader=systems[0], order=systems.findIndex(x=>x[0].replace("*","")==="Perú")+1;
 const available=systems.length, total2025=91;
 document.getElementById("worldTitle").textContent=`Panorama internacional ${year} – ${comp}`;
 const peruCard=peru!=null?`<div class="regional-kpi"><span>Perú</span><strong>${peru}</strong><small>puntos</small></div>`:`<div class="regional-kpi"><span>Perú</span><strong>—</strong><small>sin dato publicado</small></div>`;
 const oecdCard=oe!=null?`<div class="regional-kpi"><span>Promedio OCDE</span><strong>${oe}</strong><small>${peru!=null?`brecha: ${peru-oe} pts`:"referencia"}</small></div>`:`<div class="regional-kpi"><span>Promedio OCDE</span><strong>—</strong><small>sin referencia en matriz</small></div>`;
 document.getElementById("worldKpis").innerHTML=peruCard+oecdCard+
   `<div class="regional-kpi"><span>Mayor puntaje disponible</span><strong>${leader?leader[0].replace("*",""):"—"}</strong><small>${leader?leader[1]+" puntos":"sin datos"}</small></div>`+
   `<div class="regional-kpi"><span>Resultados publicados</span><strong>${available}</strong><small>${year===2025?`de 91 participantes en PISA 2025`:`sistemas con puntaje en ${year}`}</small></div>`;
 const min=rows.length?Math.min(...rows.map(x=>x[1])):0,max=rows.length?Math.max(...rows.map(x=>x[1])):1,span=Math.max(1,max-min);
 document.getElementById("worldRanking").innerHTML=rows.length?rows.map(([p,v],i)=>{
   const clean=p.replace("*",""), cls=clean==="Perú"?"peru":p==="OCDE"?"oecd":"", w=12+84*(v-min)/span;
   const warn=p.includes("*")?`<span class="sample-warn" title="OECD indica cautela al interpretar este resultado por estándares de muestreo">*</span>`:"";
   return `<div class="world-row ${cls}"><span class="world-pos">${i+1}</span><div class="world-country">${flagImg(p)}<b>${clean}</b>${warn}</div><div class="world-track"><span style="width:${w}%"></span></div><strong>${v}</strong><small>${clean==="Perú"?"Perú":p==="OCDE"?"Referencia OCDE":""}</small></div>`;
 }).join(""):`<div class="empty-world">No se encontraron resultados para la selección actual.</div>`;
 if(peru!=null && leader){
   document.getElementById("worldReading").innerHTML=`<b>Lectura internacional ${year}:</b> Perú registra <strong>${peru} puntos</strong> en ${comp}. El mayor puntaje disponible corresponde a <strong>${leader[0].replace("*","")} (${leader[1]})</strong>${oe!=null?`. La distancia Perú–OCDE es de <strong>${Math.abs(peru-oe)} puntos</strong>`:""}. Perú ocupa el orden descriptivo <strong>${order} de ${available}</strong> entre los sistemas con puntaje publicado en esta matriz.`;
 }else{
   document.getElementById("worldReading").innerHTML=`<b>Edición ${year}:</b> se muestran únicamente países/economías con puntaje medio publicado para ${comp}. Las celdas sin dato no se convierten en cero ni se estiman.`;
 }
 const n=document.getElementById("worldCoverageNote");
 if(n) n.innerHTML=year===2025
   ? `<b>Fuente 2025:</b> OECD PISA 2025 Results (Volume I). Se muestran <strong>${available}</strong> sistemas con puntaje publicado para ${comp}; el promedio OCDE es una referencia y no se cuenta como participante.`
   : `<b>Fuente histórica:</b> OECD PISA 2022 Results (Volume I), Tables I.B1.5.4–I.B1.5.6. Para ${year} se muestran <strong>${available} países/economías con puntaje publicado</strong> en ${comp}. “m”/sin dato se omite; no hay imputación.`;
}
function initWorldCompare(){
 const box=document.getElementById("worldCountrySelector"); if(!box||box.dataset.ready)return; box.dataset.ready="1";
 const allSets=window.PISA_WORLD_HISTORY?.world?.Ciencia||{};
 const names=[...new Set(Object.values(allSets).flatMap(o=>Object.keys(o)))].filter(p=>p!=="OCDE").sort((a,b)=>a.localeCompare(b,"es"));
 ["Perú","Singapur","Japón","Chile","Uruguay"].forEach(p=>{
   const idx=names.indexOf(p); if(idx>0){names.splice(idx,1);names.unshift(p)}
 });
 names.forEach(p=>{
   const b=document.createElement("button"); b.type="button"; b.className="country-chip"; b.dataset.country=p;b.innerHTML=`${flagImg(p)}${p}`;
   if(["Perú","Chile","Singapur"].includes(p))b.classList.add("active");
   b.onclick=()=>{if(b.classList.contains("active"))b.classList.remove("active");else{if(box.querySelectorAll(".active").length>=6)return;b.classList.add("active")}renderWorldCompare(regionalArea.value||"Ciencia");}; box.appendChild(b);
 });
 document.getElementById("clearCompare").onclick=()=>{box.querySelectorAll(".active").forEach(x=>x.classList.remove("active")); const p=box.querySelector('[data-country="Perú"]');if(p)p.classList.add("active");renderWorldCompare(regionalArea.value||"Ciencia");};
}
function renderWorldCompare(comp){
 initWorldCompare(); const year=Number(document.getElementById("worldYear")?.value||2025);
 const selected=[...document.querySelectorAll("#worldCountrySelector .active")].map(b=>b.dataset.country);
 const wd=worldDataset(comp,year);
 const vals=selected.map(p=>[p,wd?.[p]]).filter(x=>x[1]!=null);
 const ctt=document.getElementById("compareToolbarTitle"); if(ctt) ctt.textContent=`Comparación personalizada ${year}`;
 const chart=document.getElementById("compareChart"), legend=document.getElementById("compareLegend");
 legend.innerHTML=vals.map(([p],i)=>`<span><i style="background:${worldColors[i%worldColors.length]}"></i>${flagImg(p)}${p}</span>`).join("");
 horizontalBarChart(chart,{labels:vals.map(x=>x[0]),values:vals.map(x=>x[1]),colors:vals.map((x,i)=>worldColors[i%worldColors.length]),min:300,max:630,format:v=>Math.round(v)});
 const peru=vals.find(x=>x[0]==="Perú"), top=[...vals].sort((a,b)=>b[1]-a[1])[0], oe=W.world[comp].OCDE;
 document.getElementById("compareTitle").textContent=`Comparación seleccionada – ${comp}`;
 if(!vals.length){document.getElementById("compareReading").innerHTML="Selecciona al menos un país.";return}
 document.getElementById("compareReading").innerHTML=`<b>Lectura comparativa:</b> entre los sistemas seleccionados, <strong>${top[0]}</strong> presenta el mayor puntaje (${top[1]}). ${peru?`Perú registra <strong>${peru[1]}</strong> puntos; su distancia con ${top[0]} es de <strong>${top[1]-peru[1]}</strong> puntos y con el promedio OCDE (${oe}) es de <strong>${oe-peru[1]}</strong> puntos.`:""} Estas diferencias son descriptivas; para afirmar superioridad estadística deben revisarse los intervalos de confianza de OECD.`;
}
function initCountrySelector(){
 const box=document.getElementById("countrySelector"); if(!box||box.dataset.ready)return;
 box.dataset.ready="1";
 const defaults=["Perú","Chile","Uruguay","Colombia","Brasil"];
 defaults.forEach(p=>{
   const b=document.createElement("button");b.type="button";b.className="country-chip active";b.dataset.country=p;b.innerHTML=`${flagImg(p)}${p}`;
   b.addEventListener("click",()=>{
     if(b.classList.contains("active")) b.classList.remove("active");
     else {if(box.querySelectorAll(".active").length>=5)return;b.classList.add("active");}
     renderRegionalEvolution(regionalArea.value||"Ciencia");
   });box.appendChild(b);
 });
 ["México","Costa Rica","Argentina"].forEach(p=>{
   const b=document.createElement("button");b.type="button";b.className="country-chip";b.dataset.country=p;b.innerHTML=`${flagImg(p)}${p}`;
   b.addEventListener("click",()=>{
     if(b.classList.contains("active")) b.classList.remove("active");
     else {if(box.querySelectorAll(".active").length>=5)return;b.classList.add("active");}
     renderRegionalEvolution(regionalArea.value||"Ciencia");
   });box.appendChild(b);
 });
}
function renderRegionalEvolution(comp){
 initCountrySelector();
 const sel=[...document.querySelectorAll("#countrySelector .active")].map(b=>b.dataset.country);
 const colors=["#d9485f","#20306f","#3c98a8","#f6a31b","#7c6ccf"];
 const datasets=sel.map((p,i)=>({color:colors[i],values:R.years.map(y=>R.scores[comp][p]?.[String(y)]??R.scores[comp][p]?.[y]??null)}));
 const legend=document.getElementById("regionalEvolutionLegend"); if(legend) legend.innerHTML=sel.map((p,i)=>`<span><i style="background:${colors[i]}"></i>${flagImg(p)}${p}</span>`).join("");
 const all=datasets.flatMap(d=>d.values.filter(v=>v!=null));
 lineChart(document.getElementById("regionalEvolutionChart"),{labels:R.years,datasets,min:Math.floor((Math.min(...all)-15)/20)*20,max:Math.ceil((Math.max(...all)+15)/20)*20,step:20});
 evolutionTitle.textContent=`Evolución regional – ${comp}`;
 const peru=R.scores[comp]["Perú"], p09=peru[2009],p25=peru[2025], peak=Math.max(...R.years.map(y=>peru[y]).filter(v=>v!=null)), peakYear=R.years.find(y=>peru[y]===peak);
 evolutionReading.innerHTML=`<b>Lectura de tendencia:</b> Perú pasa de ${p09} puntos en 2009 a ${p25} en 2025 (${p25-p09>=0?"+":""}${p25-p09} puntos en diferencia simple), con su mayor puntaje de la serie en ${peakYear} (${peak}). El gráfico permite contrastar trayectorias; para inferencias estadísticas deben utilizarse los errores estándar y pruebas reportadas por PISA.`;
}
function renderRegionalAdvanced(mode,comp){
 const k=document.getElementById("intlKpis"),read=document.getElementById("intlReading"),chart=document.getElementById("regionalChart"),title=document.getElementById("intlChartTitle"),sub=document.getElementById("intlChartSub");
 const flagStrip=document.getElementById("intlFlagStrip");
 if(mode==="baseline"){
   const d=I.baseline[comp],entries=Object.entries(d).sort((a,b)=>b[1]-a[1]);title.textContent=`Alcanza o supera Nivel 2 – ${comp}`;sub.textContent="% de estudiantes · PISA 2025";
   if(flagStrip) flagStrip.innerHTML=entries.map(([p,v])=>`<span>${flagImg(p)}<b>${p}</b><small>${v}%</small></span>`).join("");
   horizontalBarChart(chart,{labels:entries.map(x=>x[0]),values:entries.map(x=>x[1]),colors:entries.map(x=>x[0]==="Perú"?"#d9485f":x[0]==="OCDE"?"#102b68":"#3c98a8"),min:0,max:100,format:v=>v+" %"});
   const pe=d.Perú,oe=d.OCDE;k.innerHTML=`<div class="intl-kpi"><span>Perú · Nivel 2+</span><strong>${pe} %</strong></div><div class="intl-kpi"><span>OCDE</span><strong>${oe} %</strong></div><div class="intl-kpi"><span>Brecha</span><strong>−${oe-pe} pp</strong></div>`;
   read.innerHTML=`<b>Lectura ejecutiva</b><p>En ${comp}, ${pe}% de estudiantes peruanos alcanza la línea base, frente a ${oe}% en la OCDE. La distancia es de <strong>${oe-pe} puntos porcentuales</strong>.</p>`;
 }else if(mode==="top"){
   const d=I.top[comp],entries=Object.entries(d).sort((a,b)=>b[1]-a[1]);title.textContent=`Alto desempeño – ${comp}`;sub.textContent="Nivel 5 o 6 · PISA 2025";
   if(flagStrip) flagStrip.innerHTML=entries.map(([p,v])=>`<span>${flagImg(p)}<b>${p}</b><small>${v===0?"<1":v}%</small></span>`).join("");
   horizontalBarChart(chart,{labels:entries.map(x=>x[0]),values:entries.map(x=>x[1]),colors:entries.map(x=>x[0]==="Perú"?"#d9485f":x[0]==="OCDE"?"#102b68":"#f6a31b"),min:0,max:10,format:v=>v===0?"<1 %":v+" %"});
   k.innerHTML=`<div class="intl-kpi"><span>Perú</span><strong>&lt;1 %</strong></div><div class="intl-kpi"><span>OCDE</span><strong>${d.OCDE} %</strong></div><div class="intl-kpi"><span>Indicador</span><strong>Nivel 5–6</strong></div>`;
   read.innerHTML=`<b>Lectura ejecutiva</b><p>OECD reporta prácticamente ningún estudiante peruano en los niveles 5–6 de ${comp}, frente a ${d.OCDE}% en la OCDE.</p>`;
 }else if(mode==="equity"){
   if(flagStrip) flagStrip.innerHTML=`<span>${flagImg("Perú")}<b>Perú</b></span><span>${flagImg("OCDE")}<b>OCDE</b></span>`;
   title.textContent="Equidad socioeconómica – Ciencia";sub.textContent="Perú frente a OCDE · PISA 2025";
   horizontalBarChart(chart,{labels:["Brecha socioeconómica (pts)","Variación explicada (%)","Resiliencia (%)"],values:[78,14,10],colors:["#d9485f","#3c98a8","#f6a31b"],min:0,max:100,format:v=>v});
   k.innerHTML=`<div class="intl-kpi"><span>Brecha socioeconómica</span><strong>78 pts</strong><small>OCDE: 85</small></div><div class="intl-kpi"><span>Variación explicada por ESCS</span><strong>14 %</strong><small>OCDE: 12%</small></div><div class="intl-kpi"><span>Resiliencia académica</span><strong>10 %</strong><small>OCDE: 12%</small></div>`;
   read.innerHTML=`<b>¿Cómo interpretar la equidad?</b><p><strong>Brecha socioeconómica (78 pts):</strong> diferencia de rendimiento entre estudiantes favorecidos y desfavorecidos; menor brecha implica mayor igualdad de resultados, aunque debe leerse junto con el nivel general de desempeño.</p><p><strong>Variación explicada por ESCS (14%):</strong> proporción de las diferencias de rendimiento asociada estadísticamente al contexto socioeconómico. No implica causalidad.</p><p><strong>Resiliencia académica (10%):</strong> estudiantes desfavorecidos que logran ubicarse entre los de mejor desempeño de su propio país. Una mayor proporción sugiere más capacidad del sistema para compensar desventajas de origen.</p>`;
 }else{
   if(flagStrip) flagStrip.innerHTML=`<span>${flagImg("Perú")}<b>Perú</b></span><span>${flagImg("OCDE")}<b>OCDE</b></span><span>${flagImg("Brasil")}<b>Brasil</b></span>`;
   title.textContent="Resolución computacional de problemas";sub.textContent="Nueva escala PISA 2025";
   horizontalBarChart(chart,{labels:["OCDE","Perú","Brasil"],values:[500,436,406],colors:["#102b68","#d9485f","#3c98a8"],min:350,max:520,format:v=>v});
   k.innerHTML=`<div class="intl-kpi"><span>Perú</span><strong>436</strong><small>puntos</small></div><div class="intl-kpi"><span>OCDE</span><strong>500</strong><small>brecha: −64 pts</small></div><div class="intl-kpi"><span>Mejor de lo esperado según Ciencia</span><strong>56,0 %</strong><small>OCDE: 56,3%</small></div>`;
   read.innerHTML=`<b>¿Qué mide esta competencia?</b><p>Evalúa la capacidad de construir conocimiento y resolver problemas utilizando herramientas computacionales, incluyendo modelización y programación. Es una <strong>escala nueva de PISA 2025</strong>, por lo que no corresponde construir una tendencia histórica comparable.</p><p>Perú obtiene <strong>436 puntos</strong> frente a <strong>500 en la OCDE</strong>. El indicador “mejor de lo esperado según Ciencia” compara el desempeño digital con el que cabría esperar a partir del rendimiento científico: Perú registra 56,0%, muy próximo al 56,3% de la OCDE.</p>`;
 }
}

function renderTable(){
 const a=dataArea.value,type=dataType.value;
 if(type==="avg"){const rows=D.avg[a];dataTable.innerHTML=`<thead><tr><th>Año</th><th>Nacional</th><th>Hombre</th><th>Mujer</th><th>Estatal</th><th>No estatal</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.year}</td><td>${fmt(r.national,1)}</td><td>${r.male==null?"":fmt(r.male,1)}</td><td>${r.female==null?"":fmt(r.female,1)}</td><td>${r.public==null?"":fmt(r.public,1)}</td><td>${r.private==null?"":fmt(r.private,1)}</td></tr>`).join("")}</tbody>`}
 else{const rows=D.levels[a];dataTable.innerHTML=`<thead><tr><th>Año</th><th>Nivel</th><th>Nacional %</th><th>Hombre %</th><th>Mujer %</th><th>Estatal %</th><th>No estatal %</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.year}</td><td>${r.level}</td><td>${fmt(r.national,1)}</td><td>${r.male==null?"":fmt(r.male,1)}</td><td>${r.female==null?"":fmt(r.female,1)}</td><td>${r.public==null?"":fmt(r.public,1)}</td><td>${r.private==null?"":fmt(r.private,1)}</td></tr>`).join("")}</tbody>`}
}

function renderVisible(){
 const id=document.querySelector(".page.active")?.id;
 if(id==="resumen")renderSummary();
 if(id==="tendencia")renderTrend();
 if(id==="niveles")renderLevels();
 if(id==="brechas")renderGaps();
 if(id==="equidad")renderEquity();
 if(id==="regional")renderRegional();
 if(id==="datos")renderTable();
}

function resolveAutoView(){
  const w=window.innerWidth, h=window.innerHeight;
  if(w<=700) return "mobile";
  if(w<=1049) return "tablet";
  // En laptops habituales (1366/1440 px) priorizamos legibilidad del eje,
  // leyendas y textos. Compacta queda para ventanas realmente pequeñas.
  if(w<1180 || h<610) return "compact";
  return "normal";
}
function applyViewMode(mode, persist=true){
  document.body.classList.remove("view-auto","view-mobile","view-tablet","view-compact","view-normal","view-expanded");
  const resolved=mode==="auto"?resolveAutoView():mode;
  document.body.classList.add("view-"+mode);
  if(mode==="auto") document.body.classList.add("view-"+resolved);
  document.body.dataset.viewMode=mode;
  document.querySelectorAll(".view-menu-panel button[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===mode));
  const autoState=document.getElementById("autoViewState");
  if(autoState){
    const names={mobile:"Móvil",tablet:"Tablet",compact:"Compacta",normal:"Normal",expanded:"Ampliada"};
    autoState.textContent=mode==="auto" ? `· ${names[resolved]||resolved}` : "";
  }
  if(persist){try{localStorage.setItem("pisaViewMode",mode)}catch(e){}}
  requestAnimationFrame(renderVisible);
}
function initViewControls(){
  const box=document.querySelector(".view-menu");
  if(!box || box.dataset.ready==="1") return;
  box.dataset.ready="1";
  const menuBtn=document.getElementById("viewMenuBtn");
  const menuPanel=document.getElementById("viewMenuPanel");
  const closeViewMenu=()=>{if(menuPanel)menuPanel.classList.remove("open");if(menuBtn)menuBtn.setAttribute("aria-expanded","false")};
  if(menuBtn&&menuPanel){
    menuBtn.addEventListener("click",(e)=>{
      e.stopPropagation();
      const isOpen=menuPanel.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded",isOpen?"true":"false");
    });
    menuPanel.addEventListener("click",(e)=>e.stopPropagation());
    document.addEventListener("click",closeViewMenu);
    document.addEventListener("keydown",(e)=>{if(e.key==="Escape")closeViewMenu()});
  }
  let saved="auto"; try{saved=localStorage.getItem("pisaViewMode")||"auto"}catch(e){}
  if(!["auto","compact","normal","expanded"].includes(saved)) saved="auto";
  document.querySelectorAll(".view-menu-panel button[data-view]").forEach(b=>b.addEventListener("click",()=>{applyViewMode(b.dataset.view);closeViewMenu()}));
  const fs=document.getElementById("fullScreenBtn");
  if(fs)fs.addEventListener("click",async()=>{closeViewMenu();try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch(e){}});
  document.addEventListener("fullscreenchange",()=>{
    setTimeout(()=>{
      try{
        renderSummary();
        const active=document.querySelector(".page.active")?.id;
        if(active==="tendencia") renderTrend();
        if(active==="niveles") renderLevels();
        if(active==="regional") renderRegional();
      }catch(e){}
    },120);
  });
  applyViewMode(saved,false);
  let viewResizeTimer;
  window.addEventListener("resize",()=>{
    clearTimeout(viewResizeTimer);
    viewResizeTimer=setTimeout(()=>{
      if(document.body.dataset.viewMode==="auto") applyViewMode("auto",false);
    },120);
  });
}

fill("trendArea",A);fill("levelArea",A);fill("gapArea",A);fill("regionalArea",A);fill("dataArea",A);
const ry=document.getElementById("regionalYear"); if(ry){R.years.forEach(y=>{const o=document.createElement("option");o.value=y;o.textContent=y;ry.appendChild(o)});ry.value="2025";}
const wy=document.getElementById("worldYear"); if(wy){(window.PISA_WORLD_HISTORY?.years||R.years).forEach(y=>{const o=document.createElement("option");o.value=y;o.textContent=y;wy.appendChild(o)});wy.value="2025";}
levelArea.value="Ciencia";gapArea.value="Ciencia";regionalArea.value="Ciencia";dataArea.value="Ciencia";

document.querySelectorAll("#trendDimension button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#trendDimension button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderTrend();}));
trendArea.onchange=renderTrend;
document.querySelectorAll("#levelsMode button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#levelsMode button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderLevels();}));

levelArea.onchange=renderLevels;gapArea.onchange=renderGaps;document.querySelectorAll("#regionalView button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#regionalView button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderRegional();}));
if(document.getElementById("regionalYear")) document.getElementById("regionalYear").onchange=renderRegional;
if(document.getElementById("worldScope")) document.getElementById("worldScope").onchange=()=>renderWorldPanorama(regionalArea.value||"Ciencia");
if(document.getElementById("worldYear")) document.getElementById("worldYear").onchange=()=>{const view=document.querySelector("#regionalView button.active")?.dataset.view;if(view==="world")renderWorldPanorama(regionalArea.value||"Ciencia");if(view==="compare")renderWorldCompare(regionalArea.value||"Ciencia");renderRegional();};
if(document.getElementById("worldSearch")) document.getElementById("worldSearch").oninput=()=>renderWorldPanorama(regionalArea.value||"Ciencia");
regionalArea.onchange=renderRegional;dataArea.onchange=renderTable;dataType.onchange=renderTable;
window.addEventListener("resize",()=>{clearTimeout(window.__r);window.__r=setTimeout(()=>{if(document.body.dataset.viewMode==="auto")applyViewMode("auto",false);else renderVisible()},120)});
initViewControls();
renderSummary();
