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
