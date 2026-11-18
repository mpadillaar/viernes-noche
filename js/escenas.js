/* Las 8 escenas del relato. Cada escena tiene una versión de 1992 y otra de 2026.
   Cada versión recibe el contenedor (el) y el contexto (ctx) del motor:
     ctx.listo()            -> la escena está completada (en 2026 muestra la ficha Manovich)
     ctx.intervalo(fn, ms)  -> setInterval que se limpia al cambiar de escena
     ctx.retraso(fn, ms)    -> setTimeout que se limpia al cambiar de escena
     ctx.estado             -> elecciones del usuario a lo largo del relato */

const q = (root, sel) => root.querySelector(sel);
const qa = (root, sel) => [...root.querySelectorAll(sel)];
const peli = id => PELICULAS.find(p => p.id === id);
const hhmm = min => `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

function cabecera(epoca, n, titulo, texto) {
  const etiqueta = epoca === '1992' ? `Cara A · 1992 · Escena ${n} de 8` : `2026 · Escena ${n} de 8`;
  return `<div class="escena__cabecera">
    <div class="escena__numero">${etiqueta}</div>
    <h1 class="escena__titulo">${titulo}</h1>
    ${texto ? `<p class="escena__texto">${texto}</p>` : ''}
  </div>`;
}

function caratulaHTML(p, { alquilada = false } = {}) {
  const etiqueta = alquilada ? `${p.titulo}: alquilada` : `Girar la carátula de ${p.titulo}`;
  return `<button type="button" class="caratula${alquilada ? ' caratula--alquilada' : ''}" data-id="${p.id}" aria-label="${etiqueta}">
    <span class="caratula__interior">
      <span class="caratula__cara caratula__frente" style="background:${p.color}">
        <span class="caratula__genero">${p.genero}</span>
        <span class="caratula__icono" aria-hidden="true">${p.icono}</span>
        <span class="caratula__titulo">${p.titulo}</span>
      </span>
      <span class="caratula__cara caratula__dorso"><b>${p.titulo}</b>${p.sinopsis}</span>
    </span>
    ${alquilada ? '<span class="sello" aria-hidden="true">ALQUILADA</span>' : ''}
  </button>`;
}

/* Botón que hay que mantener pulsado (ratón, táctil o teclado) */
function botonMantener(boton, { alPulsar, alSoltar }) {
  let pulsado = false;
  const on = e => { if (e) e.preventDefault(); if (!pulsado) { pulsado = true; boton.classList.add('pulsado'); alPulsar && alPulsar(); } };
  const off = () => { if (pulsado) { pulsado = false; boton.classList.remove('pulsado'); alSoltar && alSoltar(); } };
  boton.addEventListener('pointerdown', on);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => boton.addEventListener(t, off));
  boton.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') on(e); });
  boton.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') off(); });
  boton.addEventListener('contextmenu', e => e.preventDefault());
  return () => pulsado;
}

const ESCENAS = [

  /* ---------------------------------------------------------------- 1 */
  {
    id: 'abierto', titulo: '¿Vemos una peli?', hora1992: 'VIE 21:15', hora2026: 'Viernes 23:50',
    e1992(el, ctx) {
      el.innerHTML = cabecera('1992', 1, '¿Vemos una peli?',
        'Viernes por la noche. En casa queréis ver una película, pero el videoclub del barrio <strong>cierra a las 22:00</strong>. Cada segundo que pasa aquí es un minuto allí.') + `
        <div class="panel">
          <div class="reloj" id="reloj" aria-live="off">21:15</div>
          <div class="cartel-horario">VIDEOCLUB &#128142 ZAFIRO<br>LUN-SÁB 10:00-22:00<br>DOMINGOS CERRADO</div>
          <div class="acciones">
            <button class="boton" id="salir" type="button">🧥 Coger la chaqueta e ir</button>
            <button class="boton boton--secundario" id="llamar" type="button">📞 Llamar a Javi, mi amigo del videoclub</button>
          </div>
          <div class="resultado" id="res" aria-live="polite"></div>
        </div>`;
      const reloj = q(el, '#reloj'), res = q(el, '#res'), salir = q(el, '#salir'), llamar = q(el, '#llamar');
      let minuto = 21 * 60 + 15, terminado = false;
      const cierre = 22 * 60;

      ctx.intervalo(() => {
        if (terminado) return;
        minuto++;
        reloj.textContent = hhmm(minuto);
        Sonido.tic();
        if (minuto >= cierre) cerrado('Son las 22:00. El cierre metálico ya está bajado: sin película hasta mañana.');
      }, 1000);

      function cerrado(texto) {
        terminado = true;
        Sonido.error();
        res.innerHTML = `${texto} <button class="boton boton--aviso" id="otra" type="button">Volver a intentarlo</button>`;
        salir.disabled = llamar.disabled = true;
        q(el, '#otra').addEventListener('click', () => {
          minuto = 21 * 60 + 15; reloj.textContent = hhmm(minuto); terminado = false;
          res.textContent = ''; salir.disabled = false; llamar.disabled = !!ctx.estado.llamo;
        });
      }

      llamar.addEventListener('click', () => {
        Sonido.telefono();
        ctx.estado.llamo = true;
        llamar.disabled = true;
        minuto += 3;
        reloj.textContent = hhmm(minuto);
        res.innerHTML = '<b>Javi:</b> «¡Corre, que cerramos a las diez! Si llegas justo, te espero en el mostrador.» <em>(La llamada te ha costado 3 minutos).</em>';
      });

      salir.addEventListener('click', () => {
        const llegada = minuto + 12;
        terminado = true;
        salir.disabled = llamar.disabled = true;
        if (llegada >= cierre && !ctx.estado.llamo) {
          reloj.textContent = hhmm(llegada);
          cerrado(`Tardas 12 minutos andando y llegas a las ${hhmm(llegada)}. Está cerrado.`);
          return;
        }
        reloj.textContent = hhmm(Math.min(llegada, cierre));
        Sonido.exito();
        res.innerHTML = llegada >= cierre
          ? `Llegas a las 22:00 en punto. Javi está bajando la persiana… pero te deja pasar. ¡Tener un amigo en el videoclub era un tesoro!`
          : `Tardas 12 minutos andando y llegas a las ${hhmm(llegada)}. ¡Está abierto! El viernes de peli dependía del horario de una tienda.`;
        ctx.listo();
      });
    },
    e2026(el, ctx) {
      el.innerHTML = cabecera('2026', 1, '¿Vemos una peli?',
        'El mismo viernes, 34 años después. Son las 23:50 y estás en el sofá con el móvil en la mano. ¿Dónde la ves?') + `
        <div class="panel">
          <div class="reloj">23:50</div>
          <p class="escena__texto" style="margin-top:8px">La plataforma no tiene horario de cierre.</p>
          <div class="acciones">
            <button class="boton" type="button" data-d="la tele">📺 En la tele</button>
            <button class="boton boton--secundario" type="button" data-d="el móvil">📱 En el móvil</button>
            <button class="boton boton--secundario" type="button" data-d="el portátil">💻 En el portátil</button>
          </div>
          <div class="resultado" id="res" aria-live="polite"></div>
        </div>`;
      qa(el, '[data-d]').forEach(b => b.addEventListener('click', () => {
        Sonido.notificacion();
        q(el, '#res').innerHTML = `Abierta en ${b.dataset.d} al instante. Son las 23:50 de un viernes… y también estaría abierta a las 4:00 de un martes.`;
        ctx.listo();
      }));
    }
  },

  /* ---------------------------------------------------------------- 2 */
  {
    id: 'socio', titulo: 'Hacerse socio', hora1992: 'VIE 21:30', hora2026: 'Viernes 23:51',
    e1992(el, ctx) {
      el.innerHTML = cabecera('1992', 2, 'Hacerse socio',
        'Para alquilar en el Videoclub Zafiro hay que hacerse socio. Rellena la ficha (tu nombre no se guarda en ningún sitio).') + `
        <div class="panel">
          <form class="formulario" id="form">
            <label for="nombre">Nombre del socio</label>
            <input id="nombre" maxlength="20" autocomplete="off" placeholder="Escribe tu nombre">
            <button class="boton" type="submit">✍️ Firmar la ficha</button>
          </form>
          <div id="carne"></div>
          <div class="resultado" id="res" aria-live="polite"></div>
        </div>`;
      q(el, '#form').addEventListener('submit', e => {
        e.preventDefault();
        const nombre = q(el, '#nombre').value.trim().slice(0, 20) || 'Socio';
        ctx.estado.nombre = nombre;
        Sonido.moneda();
        q(el, '#form').hidden = true;
        const carne = document.createElement('div');
        carne.className = 'carne';
        carne.innerHTML = '<div class="carne__club">VIDEOCLUB &#128142 ZAFIRO</div><div>SOCIO Nº 0347</div><div class="carne__nombre"></div><div>VÁLIDO 1992</div>';
        q(carne, '.carne__nombre').textContent = nombre.toUpperCase();
        q(el, '#carne').append(carne);
        q(el, '#res').textContent = 'Con este carné ya puedes alquilar. Cada película se paga aparte, en el mostrador.';
        ctx.listo();
      });
    },
    e2026(el, ctx) {
      el.innerHTML = cabecera('2026', 2, 'Hacerse socio',
        'No hay ficha que rellenar: eres miembro desde hace años. Tu cuota incluye mucho más que películas.') + `
        <div class="panel">
          <div class="planes">
            <div class="plan"><strong>🎬 Vídeo</strong><small>Catálogo incluido</small></div>
            <div class="plan"><strong>📦 Envíos</strong><small>Rápidos y sin coste</small></div>
            <div class="plan"><strong>🎵 Música</strong><small>Millones de canciones</small></div>
            <div class="plan"><strong>➕ Canales</strong><small>Otros servicios por una cuota extra</small></div>
          </div>
          <div class="acciones"><button class="boton" id="ver" type="button">Ver mi suscripción</button></div>
          <div class="resultado" id="res" aria-live="polite"></div>
        </div>`;
      q(el, '#ver').addEventListener('click', e => {
        e.target.disabled = true;
        Sonido.notificacion();
        q(el, '#res').innerHTML = 'Cuota mensual: <strong>se cobra la uses o no</strong>. Y desde aquí puedes contratar otras plataformas: un videoclub de videoclubes.';
        ctx.listo();
      });
    }
  },

  /* ---------------------------------------------------------------- 3 */
  {
    id: 'catalogo', titulo: 'Elegir la película', hora1992: 'VIE 21:34', hora2026: 'Viernes 23:52',
    e1992(el, ctx) {
      const pelis = PELICULAS.filter(p => p.id !== 'cazadores');
      el.innerHTML = cabecera('1992', 3, 'Elegir la película',
        'Recorre la estantería. <strong>Gira al menos tres carátulas</strong> para leer la sinopsis. Tu familia opina.') + `
        <div class="estanteria__rotulo">★ PASILLO 2 · TODOS LOS GÉNEROS ★</div>
        <div class="estanteria">${pelis.map(p => caratulaHTML(p)).join('')}</div>
        <div class="familia" id="familia" aria-live="polite"></div>
        <div class="resultado" id="res" aria-live="polite"></div>`;
      const opiniones = [
        '<b>Mamá:</b> ¿Otra de miedo? Ni hablar.',
        '<b>Tu hermana:</b> ¡Esa ya la vimos el mes pasado!',
        '<b>Papá:</b> Con esa carátula, seguro que es buenísima.',
        '<b>Tú:</b> Yo quiero la novedad que anuncian en la tele…',
        '<b>Abuela:</b> Una que sea de risa, por favor.'
      ];
      const giradas = new Set();
      qa(el, '.caratula').forEach((c, i) => c.addEventListener('click', () => {
        c.classList.toggle('girada');
        Sonido.clic();
        if (giradas.has(c.dataset.id)) return;
        giradas.add(c.dataset.id);
        const b = document.createElement('div');
        b.className = 'bocadillo';
        b.innerHTML = opiniones[(giradas.size - 1) % opiniones.length];
        q(el, '#familia').append(b);
        if (giradas.size === 3) {
          q(el, '#res').textContent = 'Después de veinte minutos de debate en el pasillo, decidís preguntar al dependiente.';
          ctx.listo();
        }
      }));
    },
    e2026(el, ctx) {
      const variantes = {
        tu: { nombre: 'Tú', icono: '🧑', color: '#1aa3ff', fondo: 'linear-gradient(120deg,#f12711,#3a1c71)', grande: '💥',
          lema: 'Explosiones a través de los siglos. Del director de «Furia en el Asfalto».', fila: 'Porque has visto Furia en el Asfalto',
          orden: ['asfalto', 'patrulla', 'espantapajaros', 'robot', 'venecia'] },
        hija: { nombre: 'Tu hija', icono: '👧', color: '#ee5fa7', fondo: 'linear-gradient(120deg,#ee9ca7,#8e2e5d)', grande: '💞',
          lema: 'Un amor que viaja en el tiempo.', fila: 'Porque has visto Corazones en Venecia',
          orden: ['venecia', 'robot', 'patrulla', 'asfalto', 'espantapajaros'] },
        padre: { nombre: 'Tu padre', icono: '👴', color: '#c79a3a', fondo: 'linear-gradient(120deg,#c79a3a,#4a3410)', grande: '📼',
          lema: 'El clásico que alquilabas en el videoclub, ahora restaurado en 4K.', fila: 'Porque has visto Patrulla Galáctica',
          orden: ['patrulla', 'espantapajaros', 'asfalto', 'venecia', 'robot'] }
      };
      el.innerHTML = cabecera('2026', 3, 'Elegir la película',
        'Ahora la estantería se ordena sola. <strong>Cambia de perfil</strong> y fíjate en cómo te presentan <em>Cazadores del Tiempo</em>.') + `
        <div class="perfiles" role="group" aria-label="Perfiles">
          ${Object.entries(variantes).map(([k, v]) => `<button class="perfil" type="button" data-p="${k}" aria-pressed="${k === 'tu'}"><span style="background:${v.color}">${v.icono}</span>${v.nombre}</button>`).join('')}
        </div>
        <div class="destacado" id="destacado"></div>
        <div class="fila__titulo" id="fila-titulo"></div>
        <div class="fila" id="fila"></div>
        <div class="resultado" id="res" aria-live="polite"></div>`;
      const vistos = new Set(['tu']);
      function pintar(k) {
        const v = variantes[k];
        const d = q(el, '#destacado');
        d.style.background = v.fondo;
        d.innerHTML = `<div class="destacado__icono" aria-hidden="true">${v.grande}</div>
          <div class="destacado__etiqueta">RECOMENDADO PARA ${v.nombre.toUpperCase()}</div>
          <div class="destacado__titulo">Cazadores del Tiempo</div>
          <div class="destacado__lema">${v.lema}</div>`;
        q(el, '#fila-titulo').textContent = v.fila;
        q(el, '#fila').innerHTML = v.orden.map(id => {
          const p = peli(id);
          return `<div class="miniatura" style="background:${p.color}"><i aria-hidden="true">${p.icono}</i><span class="insignia">Incluido</span>${p.titulo}</div>`;
        }).join('') + `<div class="miniatura" style="background:${peli('cazadores').color}"><i aria-hidden="true">⏳</i><span class="insignia insignia--pago">Alquilar</span>Cazadores del Tiempo (2026)</div>`;
      }
      pintar('tu');
      qa(el, '.perfil').forEach(b => b.addEventListener('click', () => {
        qa(el, '.perfil').forEach(x => x.setAttribute('aria-pressed', x === b));
        Sonido.clic();
        pintar(b.dataset.p);
        vistos.add(b.dataset.p);
        if (vistos.size === 2) {
          q(el, '#res').textContent = 'La misma película, con portada, frase y compañía distintas según quién mire. El software decide cómo te la enseña.';
          ctx.listo();
        }
      }));
    }
  },

  /* ---------------------------------------------------------------- 4 */
  {
    id: 'consejo', titulo: 'Pedir consejo', hora1992: 'VIE 21:41', hora2026: 'Viernes 23:54',
    e1992(el, ctx) {
      const quien = ctx.estado.llamo ? 'Javi' : 'El dependiente';
      el.innerHTML = cabecera('1992', 4, 'Pedir consejo', `${quien} conoce tus gustos mejor que nadie.`) + `
        <div class="panel">
          <div class="dialogo" id="dialogo" aria-live="polite"></div>
          <div class="acciones" id="opciones">
            <button class="boton" type="button">¿Qué me recomiendas?</button>
            <button class="boton boton--secundario" type="button">¿Ha llegado algo nuevo?</button>
          </div>
        </div>`;
      const dialogo = q(el, '#dialogo');
      const linea = (yo, texto) => {
        const d = document.createElement('div');
        d.className = 'linea' + (yo ? ' linea--yo' : '');
        d.innerHTML = `<span class="linea__avatar" aria-hidden="true">${yo ? '🙂' : '🧔'}</span><span class="linea__texto">${texto}</span>`;
        dialogo.append(d);
      };
      linea(false, ctx.estado.llamo ? '<b>Javi:</b> ¡Por los pelos! ¿Qué te llevas hoy?' : '<b>Dependiente:</b> ¡Buenas! ¿Buscas algo en concreto?');
      qa(el, '#opciones button').forEach(b => b.addEventListener('click', () => {
        q(el, '#opciones').hidden = true;
        Sonido.clic();
        linea(true, b.textContent);
        ctx.retraso(() => {
          linea(false, `<b>${quien}:</b> Tú que eres de aventuras… Esta semana ha llegado <em>Cazadores del Tiempo</em>. Se la lleva todo el mundo.`);
          ctx.retraso(() => {
            linea(false, `<b>${quien}:</b> Mira en la estantería de novedades, a ver si queda alguna.`);
            ctx.listo();
          }, 900);
        }, 700);
      }));
    },
    e2026(el, ctx) {
      el.innerHTML = cabecera('2026', 4, 'Pedir consejo',
        'Nadie te pregunta nada: la plataforma ya sabe qué te gusta. El tráiler empieza solo. <strong>Pausa</strong> para ver qué pasa.') + `
        <div class="xray reproductor" id="xray">
          <div style="position:relative">
            <div class="reproductor__imagen" style="background:${peli('cazadores').color}">
              <div><div style="font-size:64px" aria-hidden="true">⏳</div>
                <div style="font-weight:800;font-size:26px">Cazadores del Tiempo</div>
                <div style="color:#d6f0ff">Coincidencia con tus gustos: 97 %</div></div>
            </div>
            <div class="reproductor__osd" id="osd" style="font-family:var(--fuente);font-size:16px">▶ Tráiler</div>
          </div>
          <aside class="xray__panel" aria-label="X-Ray">
            <h4>X-Ray · En esta escena</h4>
            <ul>
              <li>Lucía Ferrer <span>Ada · también en «Corazones en Venecia»</span></li>
              <li>Tomás Rey <span>Leo · 14 películas</span></li>
              <li>«Tic-Tac» <span>Canción · banda sonora original</span></li>
              <li>¿Sabías que…? <span>El reloj del rodaje era de 1891.</span></li>
            </ul>
          </aside>
        </div>
        <div class="acciones"><button class="boton" id="pausa" type="button">❚❚ Pausa</button></div>
        <div class="resultado" id="res" aria-live="polite"></div>`;
      q(el, '#pausa').addEventListener('click', e => {
        e.target.disabled = true;
        Sonido.clic();
        q(el, '#xray').classList.add('abierto');
        q(el, '#osd').textContent = '❚❚ Pausa';
        q(el, '#res').innerHTML = 'Al pausar, la imagen se llena de datos sobre el reparto y la música (función X-Ray, con datos de IMDb). La recomendación ya no viene de una persona, sino de tu historial.';
        ctx.listo();
      });
    }
  },

  /* ---------------------------------------------------------------- 5 */
  {
    id: 'novedad', titulo: 'La novedad', hora1992: 'VIE 21:44', hora2026: 'Viernes 23:55',
    e1992(el, ctx) {
      const caz = peli('cazadores');
      el.innerHTML = cabecera('1992', 5, 'La novedad',
        'La estantería de novedades. Hay tres copias de <em>Cazadores del Tiempo</em>…') + `
        <div class="estanteria__rotulo">★ NOVEDADES ★</div>
        <div class="estanteria">${[1, 2, 3].map(() => caratulaHTML(caz, { alquilada: true })).join('')}</div>
        <div class="acciones" id="opciones">
          <button class="boton" type="button" data-o="esperar">⏳ Esperar a la semana que viene</button>
          <button class="boton boton--secundario" type="button" data-o="otra">🎞️ Llevarme otra</button>
          <button class="boton boton--secundario" type="button" data-o="guardar">🤝 Pedir que me guarden una</button>
        </div>
        <div class="resultado" id="res" aria-live="polite"></div>`;
      qa(el, '.caratula').forEach(c => c.addEventListener('click', () => {
        Sonido.error();
        q(el, '#res').textContent = 'Esta también está alquilada. Las tres copias están en casa de otros socios.';
      }));
      const textos = {
        esperar: ['cazadores', 'Vuelves el viernes siguiente y por fin queda una copia. En el videoclub, lo nuevo se medía en semanas de espera.'],
        otra: ['patrulla', 'Te llevas <em>Patrulla Galáctica</em>. No era la que querías, pero es viernes.'],
        guardar: ['cazadores', '«Te guardo la primera que devuelvan.» Al día siguiente la tienes. Tener un amigo en el videoclub era un tesoro.']
      };
      qa(el, '#opciones button').forEach(b => b.addEventListener('click', () => {
        const [id, texto] = textos[b.dataset.o];
        ctx.estado.pelicula1992 = id;
        q(el, '#opciones').hidden = true;
        Sonido.clic();
        q(el, '#res').innerHTML = texto;
        ctx.listo();
      }));
    },
    e2026(el, ctx) {
      const caz = peli('cazadores');
      el.innerHTML = cabecera('2026', 5, 'La novedad',
        'La nueva <em>Cazadores del Tiempo</em> se estrenó en cines hace pocas semanas y ya está aquí.') + `
        <div class="panel producto">
          <div class="producto__portada" style="background:${caz.color}" aria-hidden="true">⏳</div>
          <div>
            <h2 style="font-size:28px;font-weight:800">Cazadores del Tiempo (2026)</h2>
            <div class="producto__meta">2026 · Aventura · 2 h 18 min · 4K · Copias disponibles: ∞</div>
            <div class="aviso-pago">No incluido en tu suscripción</div>
            <p>Dos hermanos, un reloj y un plazo que se acaba.</p>
            <div class="acciones">
              <button class="boton" type="button" data-o="alquilar">Alquilar 4,99 €</button>
              <button class="boton boton--secundario" type="button" data-o="comprar">Comprar 13,99 €</button>
            </div>
          </div>
        </div>
        <div class="resultado" id="res" aria-live="polite"></div>`;
      qa(el, '[data-o]').forEach(b => b.addEventListener('click', () => {
        Sonido.notificacion();
        if (b.dataset.o === 'alquilar') {
          ctx.estado.alquilada = true;
          q(el, '#res').innerHTML = 'Alquilada en un segundo. No ha hecho falta salir de casa, ni esperar, ni tener suerte. Eso sí: lo nuevo <strong>se paga aparte</strong> de la cuota.';
        } else {
          ctx.estado.comprada = true;
          q(el, '#res').innerHTML = 'La has «comprado»… o eso dice el botón. El lunes verás qué significa. (Para seguir el relato, también puedes alquilarla).';
        }
        b.disabled = true;
        ctx.listo();
      }));
    }
  },

  /* ---------------------------------------------------------------- 6 */
  {
    id: 'plazo', titulo: 'Pagar y llevártela', hora1992: 'VIE 21:50', hora2026: 'Viernes 23:56',
    e1992(el, ctx) {
      const p = peli(ctx.estado.pelicula1992 || 'cazadores');
      el.innerHTML = cabecera('1992', 6, 'Pagar y llevártela',
        `En el mostrador, con <em>${p.titulo}</em> en la mano.`) + `
        <div class="panel">
          <div class="acciones"><button class="boton" id="pagar" type="button">💰 Pagar 350 pesetas</button></div>
          <div id="ticket"></div>
          <div class="resultado" id="res" aria-live="polite"></div>
        </div>`;
      q(el, '#pagar').addEventListener('click', e => {
        e.target.hidden = true;
        Sonido.moneda();
        const t = document.createElement('div');
        t.className = 'ticket';
        t.innerHTML = `VIDEOCLUB &#128142 ZAFIRO<br>SOCIO Nº 0347 · <span class="n"></span><br>----------------------<br>
          PELÍCULA: ${p.titulo.toUpperCase()}<br>ALQUILER 1 NOCHE ... 350 PTS<br>----------------------<br>
          <b>DEVOLVER: LUNES ANTES DE LAS 20:00</b><br>RECARGO POR RETRASO: 200 PTS/DÍA`;
        q(t, '.n').textContent = (ctx.estado.nombre || 'SOCIO').toUpperCase();
        q(el, '#ticket').append(t);
        const peg = document.createElement('div');
        peg.className = 'pegatina';
        peg.textContent = '¡POR FAVOR, REBOBINE!';
        q(el, '#ticket').append(peg);
        q(el, '#res').textContent = 'El plazo de devolución lo vigila una persona, un ticket y una multa.';
        ctx.listo();
      });
    },
    e2026(el, ctx) {
      el.innerHTML = cabecera('2026', 6, 'Pagar y llevártela',
        'No hay mostrador ni ticket. La plataforma te informa: <strong>tienes 30 días para empezar a verla y 48 horas para terminarla</strong> desde que le das al Play.') + `
        <div class="panel" style="text-align:center">
          <div class="producto__meta">Tiempo restante de alquiler (1 segundo = 5 horas)</div>
          <div class="cuenta-atras" id="cuenta">48:00:00</div>
          <div class="acciones" style="justify-content:center">
            <button class="boton" id="play" type="button">▶ Reproducir</button>
            <button class="boton boton--secundario" id="pausa" type="button" disabled>❚❚ Pausar la película</button>
          </div>
          <div class="resultado" id="res" aria-live="polite" style="text-align:left"></div>
        </div>`;
      const cuenta = q(el, '#cuenta'), res = q(el, '#res'), play = q(el, '#play'), pausa = q(el, '#pausa');
      let segundos = 48 * 3600;
      const fmt = s => [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(n => String(n).padStart(2, '0')).join(':');
      play.addEventListener('click', () => {
        play.disabled = true; pausa.disabled = false;
        Sonido.notificacion();
        res.textContent = 'La película ha empezado y el plazo de 48 horas también.';
        const t = ctx.intervalo(() => {
          segundos = Math.max(0, segundos - 3600 + Math.floor(Math.random() * 120));
          if (segundos < 3600) segundos = 0;
          cuenta.textContent = fmt(segundos);
          Sonido.tic();
          if (segundos === 0) {
            clearInterval(t);
            cuenta.classList.add('caducado');
            cuenta.textContent = '00:00:00';
            pausa.disabled = true;
            Sonido.error();
            res.innerHTML = '<strong>Alquiler caducado.</strong> Nadie ha venido a buscar la cinta: el software ha cerrado el acceso solo, sin multas y sin mostrador.';
            ctx.listo();
          }
        }, 200);
      });
      pausa.addEventListener('click', () => {
        pausa.disabled = true;
        Sonido.clic();
        res.textContent = 'Película en pausa… pero el plazo sigue corriendo. La regla del videoclub ahora la ejecuta el código.';
      });
    }
  },

  /* ---------------------------------------------------------------- 7 */
  {
    id: 'ver', titulo: 'Ver la película', hora1992: 'VIE 22:20', hora2026: 'Sábado 00:05',
    e1992(el, ctx) {
      const p = peli(ctx.estado.pelicula1992 || 'cazadores');
      el.innerHTML = cabecera('1992', 7, 'Ver la película',
        'Metes la cinta en el vídeo… y empiezan los tráileres. <strong>Mantén pulsado ▶▶</strong> para adelantarlos.') + `
        <div class="reproductor crt" id="tv">
          <div class="reproductor__imagen"><div class="trailer" id="imagen">PRÓXIMAMENTE<small>en su videoclub</small></div></div>
          <div class="reproductor__osd" id="osd">▶ PLAY</div>
          <div class="reproductor__barra"><div id="barra"></div></div>
        </div>
        <div class="acciones">
          <button class="boton mantener" id="ff" type="button">▶▶ Avance rápido</button>
          <button class="boton boton--aviso" id="cambio" type="button" hidden>📼 Cambiar a la cinta 2</button>
        </div>
        <div class="resultado" id="res" aria-live="polite"></div>`;
      const imagen = q(el, '#imagen'), osd = q(el, '#osd'), barra = q(el, '#barra'), tv = q(el, '#tv');
      const ff = q(el, '#ff'), cambio = q(el, '#cambio'), res = q(el, '#res');
      const trailers = [
        'PRÓXIMAMENTE<small>en su videoclub</small>',
        'FURIA EN EL ASFALTO<small>¡Este verano, a todo gas!</small>',
        'CORAZONES EN VENECIA<small>Una historia de amor… y de cámaras</small>',
        'AVISO<small>La copia ilegal de esta cinta está penada por la ley</small>'
      ];
      let progreso = 0, fase = 'trailers', ultimoSonido = 0;
      const pulsado = botonMantener(ff, {
        alPulsar: () => { osd.textContent = '▶▶'; tv.classList.add('temblor'); },
        alSoltar: () => { osd.textContent = '▶ PLAY'; tv.classList.remove('temblor'); }
      });
      const t = ctx.intervalo(() => {
        if (fase !== 'trailers') return;
        const rapido = pulsado();
        progreso = Math.min(100, progreso + (rapido ? 1.6 : 0.12));
        barra.style.width = progreso + '%';
        imagen.innerHTML = trailers[Math.min(trailers.length - 1, Math.floor(progreso / 25))];
        if (rapido && Date.now() - ultimoSonido > 450) { Sonido.rebobinar(0.45); ultimoSonido = Date.now(); }
        if (progreso >= 100) {
          fase = 'peli';
          clearInterval(t);
          ff.hidden = true;
          tv.classList.remove('temblor');
          osd.textContent = '▶ PLAY';
          imagen.innerHTML = `${p.titulo.toUpperCase()}<small>Cinta 1 de 2</small>`;
          res.textContent = '¡Por fin empieza la película! Es larga, así que viene en dos cintas, como Braveheart.';
          ctx.retraso(() => {
            imagen.innerHTML = 'FIN DE LA CINTA 1<small>Inserte la cinta 2</small>';
            osd.textContent = '■ STOP';
            cambio.hidden = false;
            cambio.focus();
          }, 2600);
        }
      }, 50);
      cambio.addEventListener('click', () => {
        cambio.hidden = true;
        Sonido.meterCinta();
        osd.textContent = '▶ PLAY';
        imagen.innerHTML = `${p.titulo.toUpperCase()}<small>Cinta 2 de 2</small>`;
        res.textContent = 'Pausa obligatoria para cambiar de cinta, rebobinar la primera… y seguir todos juntos en el sofá del salón.';
        ctx.listo();
      });
    },
    e2026(el, ctx) {
      el.innerHTML = cabecera('2026', 7, 'Ver la película',
        'Le das al Play. Antes de la película… anuncios.') + `
        <div class="reproductor" id="tv" style="background:${peli('cazadores').color}">
          <div class="reproductor__imagen"><div id="imagen" style="font-weight:800;font-size:24px">Anuncio</div></div>
          <span class="anuncio" id="anuncio">Anuncio 1 de 2 · 0:15</span>
          <div class="reproductor__barra"><div id="barra"></div></div>
        </div>
        <div class="acciones" id="acc1">
          <button class="boton boton--aviso" id="quitar" type="button">Quitar anuncios por 1,99 €/mes</button>
        </div>
        <div class="acciones" id="acc2" hidden>
          <span style="align-self:center;color:var(--texto-suave)">Ves la película en la tele. Te vas a la cama y…</span>
          <div class="dispositivos">
            <button class="boton boton--secundario" type="button" data-d="el móvil">📱 Seguir en el móvil</button>
            <button class="boton boton--secundario" type="button" data-d="el portátil">💻 Seguir en el portátil</button>
          </div>
        </div>
        <div class="resultado" id="res" aria-live="polite"></div>`;
      const imagen = q(el, '#imagen'), anuncio = q(el, '#anuncio'), barra = q(el, '#barra'), res = q(el, '#res');
      let s = 30;
      const anuncios = ['Anuncio: Refrescos Burbuja', 'Anuncio: Seguros Tranquilos'];
      const empezar = () => {
        clearInterval(t);
        anuncio.hidden = true;
        q(el, '#acc1').hidden = true;
        q(el, '#acc2').hidden = false;
        imagen.textContent = 'Cazadores del Tiempo · 0:47:12';
        barra.style.width = '34%';
      };
      const t = ctx.intervalo(() => {
        s--;
        const n = s > 15 ? 1 : 2;
        imagen.textContent = anuncios[n - 1];
        anuncio.textContent = `Anuncio ${n} de 2 · 0:${String(s > 15 ? s - 15 : s).padStart(2, '0')}`;
        barra.style.width = ((30 - s) / 30 * 100) + '%';
        if (s <= 0) { empezar(); res.textContent = 'Treinta segundos de anuncios: los tráileres de la cinta han vuelto, pero ahora no se pueden adelantar.'; }
      }, 250);
      q(el, '#quitar').addEventListener('click', () => {
        Sonido.notificacion();
        empezar();
        res.textContent = 'Anuncios eliminados… pagando. Lo que antes hacías con el pulgar en el mando ahora es una suscripción extra.';
      });
      qa(el, '[data-d]').forEach(b => b.addEventListener('click', () => {
        Sonido.notificacion();
        qa(el, '[data-d]').forEach(x => x.disabled = true);
        res.innerHTML = `Sigues viéndola en ${b.dataset.d} justo donde la dejaste, en el minuto 47:12. Sin cambiar de cinta… y sin nadie más en el sofá.`;
        ctx.listo();
      }));
    }
  },

  /* ---------------------------------------------------------------- 8 */
  {
    id: 'licencia', titulo: 'El lunes', hora1992: 'LUN 19:40', hora2026: 'Lunes 19:40',
    e1992(el, ctx) {
      const p = peli(ctx.estado.pelicula1992 || 'cazadores');
      el.innerHTML = cabecera('1992', 8, 'El lunes',
        'Lunes, 19:40. Hay que devolver la cinta antes de las 20:00. ¿La rebobinaste? <strong>Mantén pulsado ◀◀</strong> para rebobinarla.') + `
        <div class="panel" style="text-align:center">
          <div class="cinta" id="cinta"><div class="cinta__etiqueta">${p.titulo}</div></div>
          <div class="controles__progreso" style="max-width:260px;margin:14px auto"><div id="barra" style="height:100%;width:100%;background:var(--acento)"></div></div>
          <div class="acciones" style="justify-content:center">
            <button class="boton mantener" id="rew" type="button">◀◀ Rebobinar</button>
            <button class="boton boton--aviso" id="devolver" type="button">📥 Devolver la cinta</button>
          </div>
          <div class="resultado" id="res" aria-live="polite" style="text-align:left"></div>
        </div>`;
      const cinta = q(el, '#cinta'), barra = q(el, '#barra'), rew = q(el, '#rew'), dev = q(el, '#devolver'), res = q(el, '#res');
      let porRebobinar = 100, ultimo = 0;
      const pulsado = botonMantener(rew, {
        alPulsar: () => cinta.classList.add('girando'),
        alSoltar: () => cinta.classList.remove('girando')
      });
      ctx.intervalo(() => {
        if (!pulsado() || porRebobinar <= 0) return;
        porRebobinar = Math.max(0, porRebobinar - 2.5);
        barra.style.width = porRebobinar + '%';
        if (Date.now() - ultimo > 450) { Sonido.rebobinar(0.45); ultimo = Date.now(); }
        if (porRebobinar === 0) { cinta.classList.remove('girando'); rew.disabled = true; rew.textContent = '✔ Rebobinada'; }
      }, 50);
      dev.addEventListener('click', () => {
        rew.disabled = dev.disabled = true;
        cinta.classList.remove('girando');
        const extra = ' Y si la hubieras comprado, la cinta seguiría en tu estantería para siempre: podrías prestarla, regalarla o volver a verla dentro de diez años.';
        if (porRebobinar > 0) {
          Sonido.error();
          res.innerHTML = '«¡Está sin rebobinar!» <strong>Recargo: 100 pesetas.</strong> El plazo y las normas los hacían cumplir personas.' + extra;
        } else {
          Sonido.exito();
          res.innerHTML = 'Cinta devuelta, rebobinada y a tiempo. ¡Hasta el viernes!' + extra;
        }
        ctx.listo();
      });
    },
    e2026(el, ctx) {
      const caz = peli('cazadores'), ven = peli('venecia');
      const items = [
        { p: caz, titulo: 'Cazadores del Tiempo (2026)', estado: '<span class="estado estado--caducado">Alquiler caducado</span>', nota: 'Desapareció sola el sábado por la noche.' }
      ];
      if (ctx.estado.comprada) items.push({ p: caz, titulo: 'Cazadores del Tiempo (2026)', estado: '<span class="estado estado--licencia">Comprada · licencia de acceso</span>', nota: 'Comprada el viernes.' });
      items.push({ p: ven, titulo: 'Corazones en Venecia', estado: '<span class="estado estado--licencia">Comprada · licencia de acceso</span>', nota: 'Comprada en 2019.' });
      el.innerHTML = cabecera('2026', 8, 'El lunes',
        'Lunes, 19:40. ¿Hay que devolver algo? Mira tu biblioteca.') + `
        <div class="panel biblioteca">
          ${items.map(i => `<div class="biblioteca__item"><div style="background:${i.p.color}" aria-hidden="true">${i.p.icono}</div>
            <div><strong>${i.titulo}</strong><br>${i.estado}<br><small style="color:var(--texto-suave)">${i.nota}</small></div></div>`).join('')}
        </div>
        <div class="acciones">
          <button class="boton boton--secundario" type="button" disabled>📥 Devolver (no hay nada que devolver)</button>
          <button class="boton" id="prestar" type="button">🎁 Prestarle «Corazones en Venecia» a un amigo</button>
        </div>
        <div class="resultado" id="res" aria-live="polite"></div>`;
      q(el, '#prestar').addEventListener('click', e => {
        e.target.disabled = true;
        Sonido.error();
        q(el, '#res').innerHTML = 'No se puede. Lo que «compraste» no es un objeto, sino una <strong>licencia de acceso</strong> ligada a tu cuenta, y según las condiciones del servicio un título puede dejar de estar disponible por restricciones de licencia.';
        ctx.listo();
      });
    }
  }
];
