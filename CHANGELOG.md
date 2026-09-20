# Registro de cambios

Formato: cada versión indica qué archivos hay que subir y si hay que tocar algo en Firebase.

## 1.2 — Septiembre de 2026

**Archivos**: `index.html`. **Firebase**: sin cambios.

### Añadido
- Botón ✕ en cada registro del Histórico para borrarlo, con opción de deshacer durante 5 segundos.
- Al borrar un registro de un producto habitual, se descuenta de su ritmo aprendido y se recalcula la fecha de última compra.

### Motivo
- Una compra marcada por error quedaba para siempre en el histórico y falseaba las sugerencias.

## 1.1 — Septiembre de 2026

**Archivos**: `index.html`, `config.js` (nuevo) y `sw.js`. **Firebase**: añadir la colección `compras` a las reglas.

### Añadido
- Pestaña **Histórico**: compras agrupadas por semanas, con día y persona. Se carga solo al abrirla, en tramos de 60 registros.
- **Ritmo aprendido**: a partir de la tercera compra, las sugerencias usan la mediana de los intervalos reales entre compras en lugar de la frecuencia indicada a mano.
- En la ficha de un habitual se muestran sus últimas compras y el ritmo calculado.
- Colección `compras` en Firestore y campo `buys` en los productos.

### Cambiado
- La configuración de Firebase y la lista de usuarios pasan de `index.html` a `config.js`, para que las actualizaciones no la sobrescriban.
- Las escrituras ya no esperan confirmación del servidor, de modo que sin cobertura la app responde al instante y sincroniza después.
- `sw.js`: la caché pasa a `compra-v2` e incluye `config.js`.

### Nota
- Las compras anteriores a esta versión no constan en el histórico. Solo se aprovecha la última fecha de compra de cada habitual.

## 1.0 — Septiembre de 2026

**Archivos**: todos. **Firebase**: creación del proyecto, Firestore, Authentication y reglas.

### Añadido
- Lista de la compra compartida en tiempo real entre dos cuentas.
- 11 categorías: carnicería; pescadería; frutas y verduras; panadería, repostería y cereales; pasta, arroz y legumbres; aceites, salsas y condimentos; conservas y latas; lácteos y huevos; cuidado personal y salud; artículos para el hogar; vino, cerveza y licores.
- Productos habituales con frecuencia orientativa y sugerencias «Quizá os falte…».
- Cantidad, nota y autor de cada producto.
- Inicio de sesión con Google o con correo y contraseña, con acceso restringido a dos correos mediante reglas de Firestore.
- App instalable (PWA) con funcionamiento sin conexión y modo oscuro.

### Decisiones
- Se descartó Neocities porque su plan gratuito bloquea las conexiones a Firebase. Se usa GitHub Pages.
- Se descartó Supabase porque su plan gratuito pausa los proyectos inactivos.
