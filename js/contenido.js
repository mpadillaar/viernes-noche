/* Contenido del relato: películas (ficticias), fichas Manovich, equivalencias y créditos.
   Separado de la lógica para poder revisar los textos con facilidad. */

const PELICULAS = [
  { id: 'cazadores', titulo: 'Cazadores del Tiempo', genero: 'Aventura', icono: '⏳', color: 'linear-gradient(160deg,#ff8a00,#a3195b)',
    sinopsis: 'Dos hermanos encuentran un reloj que los lleva a cualquier época. Sólo tienen hasta el lunes para volver.' },
  { id: 'espantapajaros', titulo: 'La Noche del Espantapájaros', genero: 'Terror', icono: '🎃', color: 'linear-gradient(160deg,#2b2b2b,#6b0f1a)',
    sinopsis: 'En un pueblo sin cobertura... perdón, sin teléfono, algo se mueve en los maizales cada viernes.' },
  { id: 'patrulla', titulo: 'Patrulla Galáctica', genero: 'Ciencia ficción', icono: '🚀', color: 'linear-gradient(160deg,#1d2b64,#0b8793)',
    sinopsis: 'Una nave de reparto intergaláctico debe entregar un paquete antes de que estalle una guerra estelar.' },
  { id: 'robot', titulo: 'Mi Vecino el Robot', genero: 'Comedia', icono: '🤖', color: 'linear-gradient(160deg,#56ab2f,#1f6f3a)',
    sinopsis: 'Un robot doméstico se muda al tercero B y se empeña en ayudar a toda la comunidad de vecinos.' },
  { id: 'venecia', titulo: 'Corazones en Venecia', genero: 'Romance', icono: '💌', color: 'linear-gradient(160deg,#ee9ca7,#8e2e5d)',
    sinopsis: 'Dos turistas se intercambian las cámaras de fotos por error y se pasan el verano buscándose.' },
  { id: 'asfalto', titulo: 'Furia en el Asfalto', genero: 'Acción', icono: '🏎️', color: 'linear-gradient(160deg,#f12711,#3a1c71)',
    sinopsis: 'Un taxista retirado vuelve a conducir para una última carrera a través de la ciudad.' }
];

/* Fichas Manovich: una por escena de 2026, con los tres ejes del profesor */
const FICHAS = {
  abierto: {
    titulo: 'Abierto las 24 horas',
    apropia: 'El ritual del «viernes de peli» sigue vivo: elegir una película para verla en casa.',
    extiende: 'El catálogo está disponible a cualquier hora y en cualquier pantalla: televisión, móvil, tableta u ordenador.',
    habito: 'Ya no hay que planificar la salida ni depender del horario de una tienda. La película se decide en el último minuto, desde el sofá.',
    concepto: 'Virtualización',
    explicacion: 'El videoclub deja de ser un lugar con horario y se convierte en un servicio sin ubicación, disponible en cualquier momento (Lévy, 2007).'
  },
  socio: {
    titulo: 'Socio de todo',
    apropia: 'La idea de ser socio de un club que te da acceso a las películas.',
    extiende: 'La suscripción incluye vídeo, envíos, música y más; y desde los Canales se contratan otros servicios (Albertini, 2020b): un videoclub de videoclubes.',
    habito: 'Pasamos de pagar por cada película a pagar una cuota fija cada mes, veamos algo o no.',
    concepto: 'Metamedio',
    explicacion: 'El ordenador simula todos los medios anteriores y les añade propiedades nuevas (Kay y Goldberg, 1977, como se citó en Manovich, 2013).'
  },
  catalogo: {
    titulo: 'Una estantería para cada perfil',
    apropia: 'La carátula se convierte en miniatura y la estantería, en filas por géneros y novedades.',
    extiende: 'El catálogo se reordena para cada perfil, y la misma película se muestra con portadas distintas según a quién se enseñe (Amazon, 2026).',
    habito: 'Ya no se elige en familia en el pasillo: cada perfil recibe su propia selección.',
    concepto: 'Base de datos y variabilidad',
    explicacion: 'La interfaz decide cómo recorremos la base de datos, y un mismo objeto puede tener muchas versiones (Manovich, 2005). Carrillo Bernal (2018), a propósito de Netflix, lo llama entretenimiento de algoritmo.'
  },
  consejo: {
    titulo: 'El dependiente invisible',
    apropia: 'La figura de quien te recomienda qué ver.',
    extiende: 'El algoritmo recomienda a partir de todo lo que has visto, y X-Ray superpone a la imagen datos de IMDb, la base de datos de cine de Amazon.',
    habito: 'Desaparece la conversación en el mostrador con alguien que te conoce.',
    concepto: 'Automatización e hipermediación',
    explicacion: 'El software automatiza tareas que antes hacían personas (Manovich, 2005) y llena la pantalla de capas de información (Bolter y Grusin, 2011).'
  },
  novedad: {
    titulo: 'Nunca agotada, siempre de pago',
    apropia: 'El alquiler de novedades, separado del catálogo de siempre.',
    extiende: 'Una sola copia digital sirve a millones de personas: la novedad nunca está «alquilada».',
    habito: 'Desaparecen la espera y la suerte de encontrar copia, pero lo nuevo se paga aparte de la cuota.',
    concepto: 'De la escasez material a la escasez programada',
    explicacion: 'La escasez ya no la imponen las cintas que hay en la tienda, sino las reglas que decide el servicio.'
  },
  plazo: {
    titulo: 'La devolución programada',
    apropia: 'El plazo de devolución del videoclub.',
    extiende: 'El software retira el acceso automáticamente: sin mostrador, sin multas y sin rebobinar.',
    habito: 'Ya no hay que volver a la tienda, pero sigue habiendo prisa: 48 horas para terminar la película.',
    concepto: 'Transcodificación',
    explicacion: 'Una costumbre de la capa cultural («hay que devolverla el lunes») se reprograma como regla de la capa informática, que acaba moldeando la cultural (Manovich, 2005).'
  },
  ver: {
    titulo: 'Los botones del vídeo',
    apropia: 'Los iconos ▶ ❚❚ ◀◀ ▶▶ del vídeo VHS, ahora botones de software; y los tráileres de la cinta, convertidos en anuncios.',
    extiende: 'Seguir viendo en otro dispositivo justo donde lo dejaste, saltar a cualquier punto y quitar los anuncios… pagando más.',
    habito: 'De ver juntos en el salón a ver en cualquier lugar, a menudo cada uno en su pantalla.',
    concepto: 'Remediación',
    explicacion: 'La interfaz desaparece al reproducir (inmediatez) y se llena de capas al elegir (hipermediación) (Bolter y Grusin, 2011).'
  },
  licencia: {
    titulo: 'Del objeto a la licencia',
    apropia: 'La compra de películas para tenerlas en casa.',
    extiende: 'Tu biblioteca está en la nube y la puedes ver en cualquier dispositivo.',
    habito: 'Pasamos de poseer objetos que se prestan y se regalan a tener accesos que dependen del servicio.',
    concepto: 'Virtualización',
    explicacion: 'La película deja de ser un objeto situado en un lugar y se convierte en un acceso que se activa desde cualquier pantalla (Lévy, 2007): al «comprar» se adquiere una licencia de uso (<em>Caudel v. Amazon.com, Inc.</em>, 2021).'
  }
};

/* Resumen de cada escena de 1992, para el botón ◀◀ de 2026 */
const RESUMEN_1992 = {
  abierto: 'Viernes, 21:15. El videoclub cierra a las 22:00: o sales ya, o te quedas sin película hasta mañana.',
  socio: 'Rellenabas una ficha con tus datos y te daban un carné de cartón con tu número de socio.',
  catalogo: 'Recorrías los pasillos por géneros, girabas las carátulas para leer la sinopsis y discutías en familia.',
  consejo: 'Le preguntabas al dependiente, que conocía tus gustos: «Esta te va a encantar, ha llegado esta semana».',
  novedad: 'La novedad tenía tres copias… y las tres estaban alquiladas. Tocaba esperar o conformarse con otra.',
  plazo: 'Pagabas en el mostrador y te daban un ticket: «Devolver el lunes». Con la pegatina «Por favor, rebobine».',
  ver: 'La cinta empezaba con tráileres que adelantabas con ▶▶. Y si la película era larga, había que cambiar a la segunda cinta.',
  licencia: 'El lunes devolvías la cinta (rebobinada, o pagabas recargo). Si la comprabas, era tuya para siempre.'
};

/* Pantalla de equivalencias: cada elemento de 1992 y su versión de 2026 */
const EQUIVALENCIAS = [
  { a: ['🕙', 'Abierto de 10:00 a 22:00'], b: ['🌙', 'Disponible 24/7'], concepto: 'Virtualización',
    texto: 'El videoclub era un lugar con horario; la plataforma es un servicio sin lugar ni hora. Ya no hay que planificar la salida.' },
  { a: ['🪪', 'Carné de socio'], b: ['💳', 'Suscripción mensual'], concepto: 'Metamedio',
    texto: 'Ser socio de un club se convierte en un pago recurrente que incluye mucho más que películas, incluso otras plataformas.' },
  { a: ['🗄️', 'La estantería por géneros'], b: ['➡️', 'La fila «Porque has visto…»'], concepto: 'Base de datos',
    texto: 'El pasillo que recorrías a tu manera pasa a ser una base de datos que el algoritmo ordena para cada perfil.' },
  { a: ['📼', 'La carátula'], b: ['🖼️', 'La miniatura'], concepto: 'Variabilidad',
    texto: 'La carátula era igual para todos; la miniatura cambia según quién la mire.' },
  { a: ['🧑‍💼', 'El dependiente'], b: ['🧮', 'El algoritmo y X-Ray'], concepto: 'Automatización',
    texto: 'La recomendación ya no viene de alguien que te conoce, sino de tu historial y de la base de datos de IMDb.' },
  { a: ['⛔', '«Alquilada»'], b: ['🏷️', '«Alquilar 4,99 €»'], concepto: 'Escasez programada',
    texto: 'La copia nunca se agota, pero lo nuevo se paga aparte: la escasez ya no es material, es una regla del servicio.' },
  { a: ['💸', '«Devolver el lunes» y la multa'], b: ['⏱️', 'Caduca a las 48 horas'], concepto: 'Transcodificación',
    texto: 'El plazo de devolución sobrevive, pero ahora lo hace cumplir el código, sin mostrador ni recargos.' },
  { a: ['⏩', 'Tráileres al principio de la cinta'], b: ['📺', 'Anuncios (o pagar más)'], concepto: 'Remediación',
    texto: 'Antes se adelantaban con el mando; ahora se quitan pagando 1,99 € más al mes.' },
  { a: ['📼', 'Cambiar a la cinta 2 en el salón'], b: ['📱', 'Seguir viendo en otro dispositivo'], concepto: 'Inmediatez',
    texto: 'Desaparecen las interrupciones del soporte físico… y también el sofá compartido: cada uno ve en su pantalla.' },
  { a: ['🏠', 'Comprar la cinta'], b: ['🔑', 'Licencia de acceso'], concepto: 'Virtualización',
    texto: 'La cinta comprada se prestaba y se regalaba; lo que se «compra» en la plataforma es un acceso ligado a tu cuenta.' }
];

/* Créditos y referencias mostradas en la pantalla final */
const REFERENCIAS = [
  'Albertini. (2020a, 28 de abril). <em>Amazon Prime Video lanza su servicio de alquiler y venta de películas y documentales en España</em>. Espinof. https://www.espinof.com/en-digital/amazon-prime-video-lanza-su-servicio-alquiler-venta-peliculas-documentales-espana',
  'Albertini. (2020b, 4 de noviembre). <em>Amazon Channels llega a España con MGM, Starzplay y Mubi entre los canales del nuevo servicio de la plataforma</em>. Espinof. https://www.espinof.com/online/amazon-channels-llega-a-espana-mgm-starzplay-mubi-canales-nuevo-servicio-plataforma',
  'Amazon. (2026, 28 de octubre). <em>Personalized artwork and variants</em>. Video Central. https://videocentral.amazon.com/support/delivery-experience/artwork/personalized-artwork-delivery-variants',
  'Bolter, J. D. y Grusin, R. (2011). Inmediatez, hipermediación, remediación (E. Aladro, Trad.). <em>CIC. Cuadernos de Información y Comunicación, 16</em>, 29-57. https://doi.org/10.5209/rev_CIYC.2011.v16.2 (Trabajo original publicado en 1999)',
  'Carrillo Bernal, J. (2018). <em>Paradigma Netflix: El entretenimiento de algoritmo</em>. Editorial UOC.',
  '<em>Caudel v. Amazon.com, Inc.</em>, No. 2:20-cv-00848-KJM-KJN (E.D. Cal. 2021).',
  'Kay, A. y Goldberg, A. (1977). Personal dynamic media. <em>Computer, 10</em>(3), 31-41. https://doi.org/10.1109/C-M.1977.217672',
  'Lévy, P. (2007). <em>Cibercultura: La cultura de la sociedad digital</em> (B. Campillo, I. Chacón y F. Martorana, Trads.). Anthropos. (Trabajo original publicado en 1997)',
  'Manovich, L. (2005). <em>El lenguaje de los nuevos medios de comunicación: La imagen en la era digital</em> (Ó. Fontrodona, Trad.). Paidós. (Trabajo original publicado en 2001)',
  'Manovich, L. (2013). <em>El software toma el mando</em> (Y. Garcia Porres, Trad.). Editorial UOC.',
  'Resnick, M. (2007). All I really need to know (about creative thinking) I learned (by studying how children learn) in kindergarten. En <em>Proceedings of the 6th ACM SIGCHI Conference on Creativity &amp; Cognition</em> (pp. 1-6). ACM. https://doi.org/10.1145/1254960.1254961',
  'Solo, M. (2024, 9 de abril). <em>Prime Video meterá dos minutos de anuncios por hora de contenido a partir de hoy en España. Está por ver si será un éxito para la compañía</em>. Espinof. https://www.espinof.com/modelos-de-negocio/prime-video-metera-dos-minutos-anuncios-hora-contenido-a-partir-hoy-espana-esta-ver-sera-exito-para-compania'
];
