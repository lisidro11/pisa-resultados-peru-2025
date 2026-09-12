
const D=window.PISA_DATA;
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

const tabs=[["resumen","Resumen"],["tendencia","Tendencia"],["niveles","Niveles"],["brechas","Brechas"],["regional","Comparación regional"],["ficha","Ficha PISA 2025"],["datos","Datos agregados"]];
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
 clear(el); const {w,h}=fit(el); const svg=svgEl("svg",{viewBox:`0 0 ${w} ${h}`,preserveAspectRatio:"none"}); el.appendChild(svg);
 const m={l:55,r:22,t:18,b:45}; const pw=w-m.l-m.r, ph=h-m.t-m.b;
 const scaleY=v=>m.t+ph-(v-min)/(max-min)*ph;
 for(let v=min;v<=max+0.001;v+=yStep){const y=scaleY(v);svg.appendChild(svgEl("line",{x1:m.l,y1:y,x2:w-m.r,y2:y,stroke:"#e8edf3","stroke-width":"1"}));let t=svgEl("text",{x:m.l-10,y:y+4,"text-anchor":"end","font-size":"10",fill:"#596170"});t.textContent=v;svg.appendChild(t)}
 const n=labels.length, g=pw/n, gap=4, bw=Math.min(42,(g-18)/datasets.filter(d=>d.kind!=="line").length);
 datasets.filter(d=>d.kind==="line").forEach((ds,li)=>{const y=scaleY(ds.value);svg.appendChild(svgEl("line",{x1:m.l,y1:y,x2:w-m.r,y2:y,stroke:ds.color,"stroke-width":"2","stroke-dasharray":"8 6"}));const offsets=[-7,13,-7];let tx=svgEl("text",{x:w-m.r-2,y:y+(offsets[li]||-7),"text-anchor":"end","font-size":"10","font-weight":"800",fill:ds.color});tx.textContent=ds.label;svg.appendChild(tx)});
 const bars=datasets.filter(d=>d.kind!=="line");
 labels.forEach((lab,i)=>{const cx=m.l+g*i+g/2;let tx=svgEl("text",{x:cx,y:h-15,"text-anchor":"middle","font-size":"10",fill:"#4f5663"});tx.textContent=lab;svg.appendChild(tx);bars.forEach((ds,j)=>{const v=ds.values[i];if(v==null)return;const x=cx-(bars.length*bw+(bars.length-1)*gap)/2+j*(bw+gap);const y=scaleY(v);const rect=svgEl("rect",{x,y,width:bw,height:scaleY(min)-y,fill:ds.color});svg.appendChild(rect);let tt=svgEl("text",{x:x+bw/2,y:y-5,"text-anchor":"middle","font-size":"10","font-weight":"700",fill:ds.labelColor||ds.color});tt.textContent=Math.round(v);svg.appendChild(tt)})});
 const yl=svgEl("text",{x:12,y:m.t+ph/2,transform:`rotate(-90 12 ${m.t+ph/2})`,"text-anchor":"middle","font-size":"10",fill:"#4f5663"});yl.textContent="Puntaje";svg.appendChild(yl);
 const xl=svgEl("text",{x:m.l+pw/2,y:h-2,"text-anchor":"middle","font-size":"10",fill:"#4f5663"});xl.textContent="Edición PISA";svg.appendChild(xl);
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
   const pts=ds.values.map((v,i)=>`${sx(i)},${sy(v)}`).join(" ");
   svg.appendChild(svgEl("polyline",{points:pts,fill:"none",stroke:ds.color,"stroke-width":"3"}));
   ds.values.forEach((v,i)=>{
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
 const years=[2009,2012,2015,2018,2022,2025];
 lineChart(document.getElementById("trendChart"),{labels:years,datasets:A.map(a=>({color:C[a],values:years.map(y=>get(a,y).national)})),min:350,max:420,step:10});
}

function renderLevels(){
 const a=levelArea.value;
 const ttl=document.getElementById("levelsTitle"); if(ttl) ttl.textContent=`Niveles de desempeño – ${a}`;const rows=D.levels[a].filter(r=>r.year===2025);
 levelGrid.innerHTML=`<div class="levelbox"><h3>${a}: rangos</h3>${D.ranges[a].map(([n,r])=>`<div class="range ${n==="Nivel 2"?"base":""}"><span>${n}</span><span>${r}</span></div>`).join("")}</div><div class="levelbox"><h3>¿Qué significa?</h3><p style="font-size:11px;line-height:1.5">Los niveles describen los conocimientos y habilidades alcanzados y tienen dificultad creciente.</p><p style="font-size:11px;line-height:1.5"><b>Nivel 2</b> es la línea base de PISA.</p></div><div class="levelbox"><h3>Nivel 2 en 2025</h3><div style="font-size:32px;font-weight:900;color:${C[a]}">${a==="Ciencia"?"30,6 %":a==="Lectura"?"26,0 %":"19,7 %"}</div><p style="font-size:10px;line-height:1.45">${D.level2desc[a]}</p></div>`;
 const vals=rows.map(r=>r.national);
 const labels=rows.map(r=>r.level);
 horizontalBarChart(document.getElementById("levelsChart"),{labels,values:vals,colors:labels.map(()=>C[a]),min:0,max:Math.max(40,Math.ceil(Math.max(...vals)/10)*10),format:v=>fmt(v,1)+" %"});
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

function renderRegional(){
  const a=regionalArea.value;

  // Comparación regional 2025: nombre | barra | puntaje.
  const rows=[...D.regional[a]].sort((x,y)=>y[1]-x[1]);
  const minScore=Math.min(...rows.map(x=>x[1]));
  const maxScore=Math.max(...rows.map(x=>x[1]));
  const base=Math.floor(minScore/10)*10-10;
  const span=maxScore-base;

  regionalChart.innerHTML=`
    <div class="regional-head">
      <span>País / referencia</span>
      <span>Puntaje promedio PISA 2025</span>
      <span>Puntaje</span>
    </div>
    ${rows.map(([pais,puntaje])=>{
      const pct=Math.max(2,((puntaje-base)/span)*100);
      const cls=pais==="Perú"?" peru":pais==="OCDE"?" ocde":"";
      const color=pais==="Perú"?C[a]:pais==="OCDE"?"#20306f":"#cbd2df";
      return `<div class="regional-row${cls}">
        <div class="regional-country"><img class="country-flag" src="assets/flags/${FLAGS[pais]||"oecd"}.svg" alt=""><span>${pais}</span></div>
        <div class="regional-track">
          <div class="regional-bar" style="width:${pct}%;background:${color}"></div>
        </div>
        <div class="regional-score">${Math.round(puntaje)}</div>
      </div>`;
    }).join("")}
  `;

  // Promedio de mejora: también con nombres visibles a la izquierda.
  const imp=Object.entries(D.improve[a]).sort((x,y)=>y[1]-x[1]);
  const vals=imp.map(x=>x[1]);
  const imin=Math.min(-7,Math.floor(Math.min(...vals)));
  const imax=Math.max(8,Math.ceil(Math.max(...vals)));
  const izero=(-imin)/(imax-imin)*100;

  improveChart.innerHTML=`
    <div class="regional-head improvement-head">
      <span>País</span>
      <span>Promedio de mejora</span>
      <span>Valor</span>
    </div>
    ${imp.map(([pais,v])=>{
      const cls=pais==="Perú"?" peru":"";
      const color=pais==="Perú"?C[a]:"#cbd2df";
      const valuePct=Math.abs(v)/(imax-imin)*100;
      const left=v>=0?izero:izero-valuePct;
      return `<div class="regional-row${cls}">
        <div class="regional-country"><img class="country-flag" src="assets/flags/${FLAGS[pais]||"oecd"}.svg" alt=""><span>${pais}</span></div>
        <div class="regional-track improvement-track">
          <div class="zero-line" style="left:${izero}%"></div>
          <div class="regional-bar improvement-bar" style="left:${left}%;width:${valuePct}%;background:${color}"></div>
        </div>
        <div class="regional-score">${v>0?"+":""}${fmt(v,1)}</div>
      </div>`;
    }).join("")}
  `;
  const insight=document.getElementById("regionalInsight");
  if(insight){
    const peru=D.improve[a]["Perú"];
    const best=Object.entries(D.improve[a]).sort((x,y)=>y[1]-x[1])[0];
    insight.innerHTML=`<b>Lectura regional:</b> Perú registra <strong>${peru>0?"+":""}${fmt(peru,1)}</strong> en el indicador de promedio de mejora 2009–2025. ${best[0]==="Perú"?"Es el mayor valor entre los países mostrados en el brochure para esta competencia.":""}`;
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
  document.querySelectorAll(".view-control button[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===mode));
  if(persist){try{localStorage.setItem("pisaViewMode",mode)}catch(e){}}
  requestAnimationFrame(renderVisible);
}
function initViewControls(){
  const box=document.querySelector(".view-control");
  if(!box || box.dataset.ready==="1") return;
  box.dataset.ready="1";
  let saved="auto"; try{saved=localStorage.getItem("pisaViewMode")||"auto"}catch(e){}
  if(!["auto","compact","normal","expanded"].includes(saved)) saved="auto";
  document.querySelectorAll(".view-control button[data-view]").forEach(b=>b.addEventListener("click",()=>applyViewMode(b.dataset.view)));
  const fs=document.getElementById("fullScreenBtn");
  if(fs)fs.addEventListener("click",async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch(e){}});
  applyViewMode(saved,false);
}

fill("levelArea",A);fill("gapArea",A);fill("regionalArea",A);fill("dataArea",A);
levelArea.value="Ciencia";gapArea.value="Ciencia";regionalArea.value="Ciencia";dataArea.value="Ciencia";
levelArea.onchange=renderLevels;gapArea.onchange=renderGaps;regionalArea.onchange=renderRegional;dataArea.onchange=renderTable;dataType.onchange=renderTable;
window.addEventListener("resize",()=>{clearTimeout(window.__r);window.__r=setTimeout(()=>{if(document.body.dataset.viewMode==="auto")applyViewMode("auto",false);else renderVisible()},120)});
initViewControls();
renderSummary();
