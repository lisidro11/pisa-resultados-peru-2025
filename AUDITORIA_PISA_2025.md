# Auditoría integral - App Resultados de Perú en PISA 2025

## 1. Fuentes revisadas
Se revisaron los 5 PDF incluidos en `PDF_pisa(1).zip` y se contrastaron con publicaciones oficiales UMC-Minedu y OECD. El paquete incluye el brochure PISA 2025, el Volumen I internacional OECD, la nota país OECD de Perú, una infografía de datos importantes y la ficha de interpretación de resultados.

## 2. Hallazgos que cambian o amplían el aplicativo
### 2.1 Tendencias por estratos
Es posible construir una serie 2009-2025 por **Sexo** y **Gestión** para Matemática, Lectura y Ciencia. Para **Área** también existen valores, pero hay una ruptura metodológica: UMC señala que la definición de ruralidad cambió en 2020, por lo que 2018 y 2022 no deben compararse como si fueran una serie homogénea. La V13 muestra esa ruptura explícitamente.

### 2.2 Nivel 2: dos indicadores distintos
El brochure presenta el porcentaje de estudiantes **ubicados exactamente en Nivel 2** (por ejemplo, Ciencia ~30,6%). La nota OECD reporta el porcentaje que **alcanza o supera Nivel 2** (Ciencia ~47%, Lectura ~42%, Matemática ~30%). No son el mismo indicador. La V13 los separa.

### 2.3 Tamaño de muestra
El brochure Minedu reporta **8 809 estudiantes**. La nota país OECD reporta **6 991 estudiantes que completaron la evaluación principal** y señala que una muestra adicional de las mismas escuelas completó la evaluación de Inglés como lengua extranjera. La ficha del aplicativo debe aclarar esta diferencia y evitar tratarlos como si fueran la misma base.

### 2.4 Primer ciclo de participación
UMC presenta la serie con el ciclo **2000**; la nota país OECD indica que Perú participó por primera vez en **2001**. Esto corresponde al esquema PISA Plus/ciclo 2000. Se mantiene 2000 como etiqueta de serie histórica, con nota metodológica.

### 2.5 Equidad y contexto 2025
La nota país OECD permite incorporar un módulo nuevo con indicadores de:
- brecha socioeconómica en Ciencia;
- resiliencia académica;
- curiosidad, perseverancia y mentalidad de crecimiento;
- escasez de docentes, recursos e infraestructura;
- uso de dispositivos e IA;
- bullying y cyberbullying;
- apoyo familiar;
- ausentismo y tardanza;
- ciencia ambiental.

### 2.6 Nueva competencia: resolución computacional de problemas
Perú obtuvo **436 puntos** frente a **500 OCDE**. Este resultado debe presentarse como una escala nueva de PISA 2025, separada de Matemática/Lectura/Ciencia y sin forzar una tendencia histórica inexistente.

## 3. Tendencias descriptivas 2009-2025
### Matemática
- Sexo: brecha Hombre-Mujer: 18 -> 13 puntos.
- Gestión: brecha Privada-Pública: 83 -> 59 puntos.
- Área: 86 -> 49 puntos, con ruptura metodológica entre 2018 y 2022.
### Lectura
- La ventaja de mujeres sobre hombres pasó de 22 puntos en 2009 a 8 en 2022, pero volvió a 17 en 2025.
- Gestión: brecha Privada-Pública: 87 -> 62 puntos.
- Área: 91 -> 64 puntos, con ruptura metodológica.
### Ciencia
- Sexo: ventaja de hombres creció de 5 puntos en 2009 a 14 en 2022 y bajó a 11 en 2025.
- Gestión: brecha Privada-Pública: 79 -> 57 puntos.
- Área: 80 -> 55 puntos, con ruptura metodológica.

Estas variaciones son **descriptivas**. La significancia estadística se mantiene únicamente donde la fuente la reporta explícitamente; para 2022-2025 se conservan los símbolos oficiales del brochure.

## 4. Cambios implementados en V13
1. **Tendencia**: selector Nacional / Sexo / Gestión / Área y competencia.
2. **Área**: advertencia y ruptura visual 2018-2022 por cambio de definición de ruralidad.
3. **Niveles**: nueva vista `Distribución 2025` / `Evolución Nivel 2+`.
4. **Equidad y contexto**: módulo nuevo con tarjetas y comparación Perú-OCDE.
5. **Resumen**: distingue `En Nivel 2` de `Alcanza o supera Nivel 2`.
6. **Ficha PISA 2025**: aclara 8 809 (brochure Minedu) vs. 6 991 evaluación principal (OECD).
7. **Datos agregados**: se incorporan CSV auditables.
8. **Fuentes**: se documenta procedencia y notas metodológicas.

## 5. Archivos de datos generados
- `tendencia_estratos_2009_2025.csv`
- `evolucion_brechas_2009_2025.csv`
- `nivel2_y_linea_base_2025.csv`
- `equidad_contexto_2025.csv`
- `inventario_fuentes_auditoria.csv`
- `pisa_extended.json`

## 6. Fuentes oficiales externas
- UMC PISA 2022: https://umc.minedu.gob.pe/resultadospisa2022/
- UMC Tendencias 2000-2022: https://umc.minedu.gob.pe/peru-tendencias-en-los-resultados-en-pisa-2000-2022/
- UMC Bases PISA: https://umc.minedu.gob.pe/bases-de-datos/
- OECD Country Note Peru 2025: https://www.oecd.org/en/publications/pisa-2025-results-volume-i-country-notes_2d4ff9ea-en/peru_0c319189-en.html
- OECD PISA 2025 Volume I: https://www.oecd.org/en/publications/pisa-2025-results-volume-i_73451bc5-en.html

## 7. Recomendación metodológica
No presentar posiciones/rankings históricos como una tendencia de puestos, porque cambia el conjunto de países participantes. Priorizar puntajes, brechas, niveles y comparación con referencias.
