# Registro de cambios

Formato: cada versión indica qué archivos hay que subir y si hay que tocar algo en Firebase.

## 1.3 — Octubre de 2026

**Archivos**: `index.html`. **Firebase**: sin cambios.

### Añadido
- **Nuevo orden de las categorías**, según el recorrido habitual del supermercado: cuidado personal; lácteos y huevos; frutas y verduras; panadería, repostería y cereales; pescadería; carnicería; pasta, arroz y legumbres; conservas y latas; aceites, salsas y condimentos; artículos para el hogar; vino, cerveza y licores. Se aplica a la lista, a los habituales, al histórico y a los menús desplegables. Para cambiarlo en el futuro basta con reordenar la lista `CATS` de `index.html`.
- **Buscador global y filtro por categoría** fijos en la parte superior; actúan sobre la pestaña que esté abierta.
- En Habituales, las categorías se pliegan y despliegan, y la app recuerda cómo las dejaste.
- En el Histórico, las semanas anteriores a las dos últimas aparecen plegadas, con el número de productos a la vista.
- Etiqueta «Toca reponer» en los habituales sugeridos, para no depender solo del color.
- La categoría se muestra como texto en cada línea del histórico.

### Cambiado (accesibilidad y rendimiento)
- Todas las medidas pasan de píxeles fijos a unidades relativas: la app aguanta el texto ampliado o un zoom del 200 % sin romperse.
- Áreas pulsables de 44x44 px como mínimo y filas de 56 px de alto.
- Espaciado en múltiplos de 8 px e interlineado de 1,6 en el texto descriptivo.
- Menos líneas divisorias y bordes: las filas se separan por espacio, no por rayas.
- Animaciones solo con `transform` y `opacity`, de 140 a 180 ms, y desactivadas si el sistema pide menos movimiento.
- Solo se repinta la pestaña visible; las categorías usan `content-visibility` y la búsqueda va con un pequeño retardo.
- Navegación completa con teclado: pestañas con flechas, foco visible, la hoja se cierra con Escape y devuelve el foco al punto de partida.
- Marcado accesible: pestañas con `role="tab"`, hoja como diálogo y el resto de la pantalla inerte mientras está abierta.

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
