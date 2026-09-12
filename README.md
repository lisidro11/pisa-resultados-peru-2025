# PISA Perú 2025 — V11 Auto Responsive

Esta versión no depende de Chart.js, Plotly ni de ninguna CDN externa.
Los gráficos se dibujan con SVG y JavaScript nativo, por lo que funciona al abrir `index.html` directamente.

Incluye:
- Resumen ejecutivo en una sola pantalla.
- Gráfico principal con valores y líneas OCDE punteadas.
- Tendencia de las tres áreas simultáneamente.
- Niveles de desempeño.
- Brechas 2022–2025.
- Comparación regional.
- Promedio de mejora.
- Ficha PISA 2025.
- Datos agregados y CSV.
- Logo institucional e iconos corregidos.

Años conjuntos del gráfico principal: 2009, 2012, 2015, 2018, 2022 y 2025.


## Ajuste V2
- Panel derecho más ancho, como en el diseño aprobado.
- Textos laterales más grandes y legibles.
- Gráfico principal ligeramente más reducido para equilibrar la composición.
- Cabecera y navegación ajustadas.
- Tarjetas inferiores con mayor legibilidad.


## Ajuste visual V3
- Panel lateral con texto más grande.
- Panel lateral más ancho.
- Gráfico principal un poco más reducido.
- Tarjetas inferiores más altas y legibles.
- Pie separado de las tarjetas para evitar superposición.
- Proporciones afinadas para acercarse al diseño de referencia.


## V6
- Comparación regional cambiada a filas HTML para garantizar que el nombre de cada país siempre aparezca al costado.
- Perú y OCDE resaltados.
- Puntaje visible al extremo derecho.
- Promedio de mejora también muestra nombre, barra y valor.
- En Niveles, rangos, explicación y Nivel 2 quedan claramente alineados en tres columnas.


## V7 ejecutiva
- Resumen: nuevo bloque Brechas 2025 por estrato con selector Gestión / Sexo / Área.
- Comparación ejecutiva mediante dumbbell charts y brecha en puntos.
- Brechas: leyenda 2022 / 2025*, variación en puntos y símbolos + según brochure.
- Brechas: lectura dinámica por competencia y nota oficial de significancia.
- Comparación regional: banderas junto al nombre de cada país; OCDE con símbolo global.
- Cache busting ?v=7 para CSS/JS al publicar en GitHub Pages.


## V8 Dashboard Senior
- Cabecera y navegación sticky.
- Control de vista: Compacta / Normal / Ampliada + pantalla completa.
- El control modifica densidad y alturas, no reduce la tipografía.
- Resumen: menos duplicación, leyenda visible y etiquetas OCDE separadas.
- Tendencia: lectura 2022–2025 compacta bajo el gráfico.
- Niveles: información y distribución visibles simultáneamente en dos columnas.
- Brechas: gráfico dumbbell 2022–2025, con cambio en puntos y significancia (+).
- Comparación regional: banderas SVG locales para funcionamiento offline/GitHub Pages.


## V9 Diseño final basado en brochure
- Cabecera compacta para maximizar el área analítica en laptop.
- Vista Compacta / Normal / Ampliada corregida e inicializada.
- Resumen: título dinámico según Gestión / Sexo / Área.
- Tendencia: variación 2022–2025 y lectura interpretativa visible en la misma pantalla.
- Brechas: todos los estratos (Sexo, Gestión y Área) se muestran simultáneamente; solo se filtra competencia.
- Comparación regional: resultados 2025 y Promedio de mejora 2009–2025 aparecen lado a lado.
- Banderas SVG locales.
- Datos y notas conservan los valores del brochure PISA 2025.


## V10 Laptop final
- Corrige definitivamente Vista Compacta / Normal / Ampliada (inicialización única).
- Tendencia: leyenda movida encima del gráfico; ya no se superpone al eje de años.
- Niveles, Brechas y Comparación regional: título dinámico según competencia.
- Encabezados internos compactos con filtro en la misma línea.
- Brechas: KPIs de brecha 2025 por Sexo, Gestión y Área + todos los estratos visibles.
- Comparación regional: resultados 2025 y promedio de mejora lado a lado, con lectura regional dinámica.
- Mantiene datos y símbolos de significancia del brochure PISA 2025.


## V12 Laptop Auto mejorado
- Auto en laptop 1366/1440 prioriza modo Normal para conservar años, leyenda y textos.
- Tendencia: más margen inferior y eje de años siempre visible; leyenda fijada sobre el gráfico.
- Resumen: Nivel de desempeño sube a la columna derecha y elimina espacio vacío.
- Resumen: las tres tarjetas de Matemática, Lectura y Ciencia ocupan toda la fila.
- Brechas: KPIs con iconos de Sexo, Gestión y Área, dirección de la brecha y resaltado de la mayor.
- Responsive móvil conservado.


## V13 - Análisis profundo
- Tendencia por estratos 2009-2025: Sexo, Gestión y Área.
- Área incluye ruptura metodológica 2018-2022 por cambio de definición de ruralidad.
- Niveles distingue "en Nivel 2" de "alcanza o supera Nivel 2".
- Evolución nacional de Nivel 2+ 2009-2025.
- Nuevo módulo Equidad y contexto PISA 2025.
- Ficha aclara diferencia entre 8 809 (brochure Minedu) y 6 991 (evaluación principal OECD).
- Incorpora resolución computacional de problemas: Perú 436 / OCDE 500.
- Descargas CSV auditables y archivo de fuentes.


## V15 - Comparación regional histórica
- Se conserva la vista clásica con banderas y ranking regional.
- Se mantiene el panel “Promedio de mejora PISA 2009–2025” del brochure.
- Nuevo filtro por edición: 2009, 2012, 2015, 2018, 2022 y 2025.
- El ranking anual muestra solo países con dato disponible.
- Nueva vista “Evolución de países” con selección de hasta 5 países.
- Se mantienen Nivel 2+, Alto desempeño, Equidad y Competencia digital.
- Nuevos CSV: `serie_regional_2009_2025.csv` y `promedio_mejora_regional_2009_2025.csv`.
- Nota metodológica: no comparar puestos entre ciclos; cambia la participación de países.


## V16 - Benchmark internacional
- Conserva Panorama regional y Tendencia de largo plazo 2009–2025.
- Aclara que la tendencia 2009–2025 es fija y no depende de la edición elegida.
- Nuevo Panorama mundial 2025 con ranking vertical, scroll, buscador y filtros de ámbito.
- Nueva Comparación personalizada con hasta 6 países/economías.
- Leyenda visible en comparaciones y evolución regional.
- Banderas consistentes en selectores y comparaciones.
- Benchmark mundial basado en valores oficiales OECD PISA 2025 y brochure Minedu/UMC.
- CSV `benchmark_internacional_2025.csv`.


## V17 – Comparación internacional
- Menú principal renombrado a Comparación internacional.
- Ciencia 2025: 91 países/economías participantes + promedio OCDE como referencia.
- Orden descriptivo por puntaje medio; no se presenta como ranking estadístico.
- Advertencia `*` para sistemas señalados por OECD por estándares de muestreo.
- Banderas/identificadores visibles en Nivel 2+, Alto desempeño, Equidad y Competencia digital.
- Explicación ampliada de Equidad y Resolución computacional de problemas.
- Niveles de desempeño: descriptores interpretativos por nivel para Ciencia, Lectura y Matemática.
- Lectura/Matemática: se mantiene únicamente la cobertura de sistemas cuyos puntajes están verificados e incorporados; no se imputan datos.


## V18 – 91 participantes en las tres áreas
Fuente: OECD PISA 2025 Results (Volume I), Executive Summary, Table I.1.
- Ciencia: 91 de 91 participantes con puntaje publicado.
- Lectura: 90 de 91 con puntaje publicado; Uzbekistán figura como `m`.
- Matemática: 90 de 91 con puntaje publicado; Uzbekistán figura como `m`.
- El promedio OCDE se muestra como referencia y no se cuenta como participante.
- El dashboard ya no limita Lectura y Matemática a la selección de la V16/V17.
- Se mantiene la advertencia de cautela para Albania, Canadá, Países Bajos, Nueva Zelanda, Noruega y Estados Unidos.


## V19 — Ajuste visual de Niveles
- Se redujeron espacios internos y márgenes de las tarjetas laterales.
- Los descriptores por nivel permanecen completos, pero en laptop usan filas más compactas.
- El gráfico de distribución conserva prioridad visual y no se reduce para ganar espacio.
- En pantallas de poca altura, el bloque de descriptores usa scroll interno en lugar de empujar toda la página hacia abajo.
- Fuentes históricas internacionales verificadas para la siguiente integración: OECD PISA 2022 Results Volume I, tablas I.B1.5.4, I.B1.5.5 e I.B1.5.6; participación por ciclo: OECD PISA Participants.


## V20 — CSV maestro de datos
Se añadió `data/PISA_2025_TODA_LA_INFORMACION_ENCONTRADA.csv` con 1,820 registros consolidados de los datos actualmente verificados e incorporados al proyecto: resultados internacionales 2025, series regionales, tendencia por estratos, brechas, niveles de desempeño, equidad/contexto, benchmark y fuentes.
También se añadió `data/catalogo_datos_csv.csv` como inventario del contenido.
Las tablas históricas internacionales completas de OECD identificadas para integración son I.B1.2a.36 (Ciencia), I.B1.2a.37 (Lectura) e I.B1.2a.38 (Matemática); se registran como fuentes, pero no se inventan valores aún no extraídos.


## V21 — Niveles y panorama mundial histórico
### Niveles
La corrección ahora usa los selectores reales del aplicativo (`#niveles`, `.levels-layout`, `.levels-info`).
En laptop, el bloque izquierdo usa altura disponible de la pantalla y los descriptores tienen desplazamiento interno. El gráfico principal conserva una altura mínima de 410 px y no se sacrifica para ganar espacio.

### Panorama mundial histórico
Se añadió un selector de edición 2009, 2012, 2015, 2018, 2022 y 2025.
Para 2009–2022 se integraron puntajes medios oficiales de OECD PISA 2022, Tables I.B1.5.4, I.B1.5.5 e I.B1.5.6.
Para 2025 se conserva la base oficial OECD PISA 2025 ya incorporada.
La cantidad de sistemas se calcula por competencia y edición según puntaje publicado. Los datos `m` se omiten y nunca se convierten en cero.
Archivo local: `data/pisa_internacional_historico_2009_2025.csv`.


## V22 — Rediseño definitivo del módulo Niveles
- Se eliminó la tabla extensa de descriptores debajo de las tarjetas.
- La pantalla queda organizada en tres áreas: rangos, interpretación del nivel seleccionado y gráfico.
- Al hacer clic en Nivel 6, 5, 4, 3, 2, 1a, 1b, etc., la tarjeta `¿Qué significa?` cambia sin mover la página.
- Nivel 2 aparece seleccionado al abrir el módulo.
- Se mantiene la tarjeta de línea base 2025 (Nivel 2+).
- El gráfico principal conserva una altura amplia y ya no se reduce para acomodar texto secundario.
