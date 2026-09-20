# La compra

Lista de la compra compartida para dos personas, pensada para el móvil (iPhone y Android). Se instala como app desde el navegador, sincroniza en tiempo real y funciona sin cobertura dentro del supermercado.

## Funciones

- **Lista** agrupada por categorías, con cantidad, nota y quién añadió cada producto. El círculo marca el producto como comprado, con opción de deshacer durante 5 segundos.
- **Habituales**: catálogo de productos recurrentes que se añaden a la lista con un toque. No vuelven solos a la lista.
- **Sugerencias («Quizá os falte…»)**: habituales que, por su ritmo de compra, probablemente toca reponer.
- **Ritmo aprendido**: a partir de la tercera compra de un habitual, la app calcula cada cuánto se compra de verdad y usa ese dato en lugar de la frecuencia indicada a mano.
- **Histórico** de compras agrupado por semanas. Cada registro se puede borrar, y al hacerlo también se descuenta del ritmo aprendido.
- **Funcionamiento sin conexión**: los cambios se guardan en el móvil y se sincronizan al recuperar la cobertura.

## Arquitectura

| Pieza | Servicio | Coste |
|---|---|---|
| Alojamiento de la app | GitHub Pages | Gratis |
| Base de datos | Firebase Firestore | Gratis (plan Spark) |
| Inicio de sesión | Firebase Authentication (Google o correo y contraseña) | Gratis |

Es una sola página HTML sin compilación ni dependencias locales. El SDK de Firebase se carga desde `gstatic.com`.

> **Nota**: se descartó Neocities porque su plan gratuito bloquea las conexiones a servicios externos como Firebase.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa: interfaz, estilos y lógica. |
| `config.js` | Configuración de Firebase y lista de usuarios con acceso. Se sube una vez y las actualizaciones de `index.html` no lo tocan. |
| `sw.js` | *Service worker*: guarda la app en el móvil para que abra sin conexión. |
| `manifest.webmanifest` e iconos | Permiten instalarla como app en la pantalla de inicio. |
| `firestore.rules` | Copia de referencia de las reglas de seguridad (las activas están en la consola de Firebase). |

## Modelo de datos (Firestore)

**Colección `items`**: un documento por producto, tanto en la lista como en habituales.

| Campo | Descripción |
|---|---|
| `name`, `category`, `qty`, `note` | Datos del producto. `category` es un identificador (`carniceria`, `lacteos`…). |
| `onList` | `true` si está pendiente de comprar. |
| `recurring` | `true` si es habitual. Los puntuales se borran al comprarlos. |
| `freq` | Frecuencia indicada a mano: `semanal`, `quincenal`, `mensual` o `null`. |
| `lastBought` | Fecha de la última compra. |
| `buys` | Últimas 8 fechas de compra en milisegundos. Es la base del ritmo aprendido. |
| `addedBy`, `addedByName`, `addedAt` | Quién lo añadió a la lista y cuándo. |

**Colección `compras`**: un documento por cada producto marcado como comprado.

| Campo | Descripción |
|---|---|
| `itemId`, `name`, `category`, `qty`, `recurring` | Copia de los datos del producto en el momento de la compra. |
| `boughtAt`, `boughtBy`, `boughtByName` | Cuándo y quién. |

## Cómo se calculan las sugerencias

1. Se toman las fechas de `buys` y se calculan los intervalos entre compras consecutivas, descartando los de menos de un día (compras duplicadas).
2. Con al menos 2 intervalos (3 compras), el ritmo es la **mediana** de esos intervalos. Se usa la mediana y no la media para que una semana atípica no descuadre el cálculo.
3. Si aún no hay datos suficientes, se usa la frecuencia indicada a mano (7, 14 o 30 días).
4. Un habitual aparece en «Quizá os falte…» cuando han pasado **ritmo − 1 días** o más desde la última compra.

Qué acciones cuentan como compra:

- **El círculo** registra una compra en el histórico y en el ritmo.
- **«Quitar de la lista»** y **«Borrar producto»** no dejan rastro en el histórico. Son las opciones adecuadas para corregir un producto añadido por error.

## Instalación desde cero

1. **Firebase** (console.firebase.google.com). Crea un proyecto, activa Firestore en modo producción (ubicación `europe-southwest1`) y activa Authentication con Google y con correo y contraseña. Después, en la configuración del proyecto, registra una app web.
2. **Reglas**. Pega `firestore.rules` en Firestore, pestaña Reglas, con los correos reales en minúsculas.
3. **`config.js`**. Rellena `firebaseConfig` y `USUARIOS` con los mismos correos que en las reglas.
4. **GitHub Pages**. Sube los archivos y activa Pages en Settings, Pages, rama `main`, carpeta raíz.
5. **Dominios autorizados**. En Firebase, Authentication, Configuración, añade `usuario.github.io`.
6. **Instalación en el móvil**. En iPhone: Safari, Compartir, «Añadir a pantalla de inicio». En Android: Chrome, menú ⋮, «Instalar aplicación».

## Cómo actualizar la app

- Normalmente basta con sustituir `index.html` y cerrar y abrir la app en los móviles. El *service worker* busca primero en la red, así que la versión nueva llega sola.
- Si se añade un archivo nuevo a la app, hay que añadirlo a la lista `SHELL` de `sw.js` y subir la versión de `CACHE` (`compra-v2`, `compra-v3`…).
- Si se crea una colección nueva en Firestore, hay que añadirla también a las reglas, o la app dará error de permisos.

## Seguridad

- **La `apiKey` de `config.js` no es un secreto.** Identifica el proyecto de Firebase y es público por diseño en toda app web. GitHub la marca como «secreto expuesto», pero el aviso se descartó a conciencia.
- Lo que protege los datos son las **reglas de Firestore** (solo dos correos pueden leer y escribir) y los **dominios autorizados** de Authentication.
- Mejora opcional pendiente: restringir la clave en Google Cloud, en Credenciales, a los dominios `usuario.github.io` y `proyecto.firebaseapp.com`.
- El repositorio es público: no escribas correos, contraseñas ni datos personales en este README ni en los mensajes de *commit*.

## Límites conocidos

- **Inicio de sesión con Google en iPhone**: dentro de la app instalada, Apple puede bloquear la ventana emergente de Google. La alternativa es entrar con correo y contraseña, y la sesión queda guardada.
- **Histórico**: empezó a registrarse con la versión 1.1. Las compras anteriores no constan.
- **Plan gratuito de Firebase**: 50.000 lecturas diarias por proyecto. El histórico solo se lee al abrir su pestaña y en tramos de 60 registros, así que el uso normal está muy por debajo del límite.

## Ideas para el futuro

- **Abrirla a otras personas mediante «hogares»**: cada grupo tendría su propia lista y se uniría con un enlace de invitación, y las reglas limitarían el acceso a los miembros de cada hogar. Implicaría migrar los datos actuales, activar App Check y redactar un aviso de privacidad (RGPD), porque se tratarían datos de terceros.
