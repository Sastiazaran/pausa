# Pausa

Libreta de gastos para el teléfono. Al abrirla recuerda lo que todavía hay que pagar, anota entradas y salidas, y pregunta cómo se sintió la compra. Lo que sobra del mes se reparte entre lo que falta comprar.

No es una app de desarrollo personal. No hay rachas, metas de hábito ni personaje.

## Correrla

Requiere Node y la app Expo Go (SDK 54) en el teléfono, o el navegador para una vista previa.

```bash
npm install
npm start
```

En el teléfono, escanea el código con Expo Go. En la computadora, `npm run web`.

```bash
npm test
npm run typecheck
```

Los datos de gastos se quedan en el teléfono (SQLite). No hay cuenta ni banco.

## Precios de súper

La comparación sale de [Quién es Quién en los Precios](https://qqp.profeco.gob.mx/) de PROFECO, datos abiertos con licencia CC-BY-4.0. El recorte que viaja con la app es de julio 2026 (Ciudad de México, Jalisco, Nuevo León, Puebla y Aguascalientes) para leche, huevo, tortilla, arroz, frijol y aceite en supermercados.

“Consultar PROFECO” pide el archivo más reciente en datos.gob.mx. Si no responde, la app lo dice y no inventa precios. Cada cifra muestra la fecha en que PROFECO la levantó: es una referencia, no el anaquel de hoy.

Un precio que ella vio en tienda se guarda aparte, con la etiqueta “Lo anoté yo”.

## Primera apertura

La app deja sugeridas la señora del servicio, la luz, el agua y el súper de la semana, más maquillaje, ropa, gustitos y opciones de súper. Los montos se pueden cambiar o borrar.
