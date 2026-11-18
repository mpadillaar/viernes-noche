/* Motor del relato: orden de pasos, navegación, fichas Manovich, transiciones,
   botón ◀◀ (comparar con 1992), pantalla de equivalencias y pantalla final. */
(() => {
  const $ = id => document.getElementById(id);
  const ui = {
    pantalla: $('pantalla'), siguiente: $('btn-siguiente'), rebobinar: $('btn-rebobinar'),
    epoca: $('epoca'), contador: $('contador'), progreso: $('progreso'), sonido: $('btn-sonido'),
    modal: $('modal'), modalTitulo: $('modal-titulo'), modalCuerpo: $('modal-cuerpo'), modalCerrar: $('modal-cerrar'),
    ruido: $('ruido'), ruidoTexto: $('ruido-texto')
  };

  const pasos = [
    { tipo: 'intro' },
    ...ESCENAS.map((escena, n) => ({ tipo: 'escena', epoca: '1992', escena, n })),
    { tipo: 'salto' },
    ...ESCENAS.map((escena, n) => ({ tipo: 'escena', epoca: '2026', escena, n })),
    { tipo: 'equivalencias' },
    { tipo: 'final' }
  ];

  let estado, temporizadores = [], completado = false;
  function reiniciarEstado() { estado = { paso: 0, fichas: [], elecciones: {} }; }
  reiniciarEstado();

  /* ---------- Contexto que reciben las escenas ---------- */
  const ctx = {
    get estado() { return estado.elecciones; },
    intervalo(fn, ms) { const t = setInterval(fn, ms); temporizadores.push(t); return t; },
    retraso(fn, ms) { const t = setTimeout(fn, ms); temporizadores.push(t); return t; },
    listo() {
      if (completado) return;
      completado = true;
      const paso = pasos[estado.paso];
      if (paso.tipo === 'escena' && paso.epoca === '2026') {
        const id = paso.escena.id;
        if (!estado.fichas.includes(id)) estado.fichas.push(id);
        const contenedor = ui.pantalla.querySelector('.escena');
        contenedor.insertAdjacentHTML('beforeend', fichaHTML(FICHAS[id], paso.n + 1));
        setTimeout(() => contenedor.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 250);
      }
      ui.siguiente.disabled = false;
    }
  };

  function fichaHTML(f, n) {
    return `<article class="ficha" aria-label="Ficha Manovich: ${f.titulo}">
      <div class="ficha__cabecera"><h3>${f.titulo}</h3><small>Ficha Manovich ${n} de 8</small></div>
      <div class="ficha__ejes">
        <div class="eje eje--apropia"><h4>🔁 Se apropia</h4><p>${f.apropia}</p></div>
        <div class="eje eje--extiende"><h4>➕ Extiende</h4><p>${f.extiende}</p></div>
        <div class="eje eje--habito"><h4>👥 Cambia el hábito</h4><p>${f.habito}</p></div>
      </div>
      <div class="ficha__concepto"><b>Concepto: ${f.concepto}.</b> ${f.explicacion}</div>
    </article>`;
  }

  function limpiar() {
    temporizadores.forEach(t => { clearInterval(t); clearTimeout(t); });
    temporizadores = [];
  }

  /* ---------- Transición con ruido de vídeo ---------- */
  function transicion(texto, luego, duracion = 1400) {
    ui.ruidoTexto.textContent = texto;
    ui.ruido.classList.add('activo');
    Sonido.rebobinar(duracion / 1000);
    setTimeout(() => { luego(); setTimeout(() => ui.ruido.classList.remove('activo'), 250); }, duracion);
  }

  /* ---------- Mostrar un paso ---------- */
  function mostrar(i) {
    limpiar();
    completado = false;
    estado.paso = i;
    const paso = pasos[i];
    ui.pantalla.innerHTML = '';
    ui.siguiente.hidden = false;
    ui.siguiente.disabled = true;
    ui.rebobinar.hidden = true;
    // Contador de cinta H:MM:SS: recorre los 2 h 18 min de «Cazadores del Tiempo» a lo largo del relato
    const s = Math.round(i / (pasos.length - 1) * (2 * 3600 + 18 * 60));
    ui.contador.textContent = `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    ui.progreso.style.width = (i / (pasos.length - 1) * 100) + '%';

    const seccion = document.createElement('section');
    seccion.className = 'escena';
    ui.pantalla.append(seccion);

    switch (paso.tipo) {
      case 'intro':
        document.body.dataset.epoca = 'intro';
        ui.epoca.textContent = '';
        ui.siguiente.hidden = true;
        pintarIntro(seccion);
        break;
      case 'escena':
        document.body.dataset.epoca = paso.epoca;
        ui.epoca.textContent = paso.epoca === '1992'
          ? `${paso.escena.hora1992} · VIDEOCLUB`
          : `${paso.escena.hora2026} · Plataforma de streaming`;
        if (paso.epoca === '2026') ui.rebobinar.hidden = false;
        paso.escena['e' + paso.epoca](seccion, ctx);
        break;
      case 'salto':
        pintarSalto(seccion);
        break;
      case 'equivalencias':
        document.body.dataset.epoca = 'final';
        ui.epoca.textContent = '1992 ▶▶ 2026';
        pintarEquivalencias(seccion);
        break;
      case 'final':
        document.body.dataset.epoca = 'final';
        ui.epoca.textContent = 'Fin de la cinta';
        ui.siguiente.hidden = true;
        pintarFinal(seccion);
        break;
    }
    window.scrollTo(0, 0);
    ui.pantalla.focus({ preventScroll: true });
  }

  function avanzar() {
    const sig = estado.paso + 1;
    if (sig >= pasos.length) return;
    Sonido.clic();
    mostrar(sig);
  }

  /* ---------- Intro ---------- */
  function pintarIntro(el) {
    el.innerHTML = `
      <div class="tele">
        <div class="tele__pantalla">
          <div>
            <div class="intro__play parpadeo">PLAY ▶</div>
            <h1 class="intro__titulo">VIERNES NOCHE<br>1992 ▶▶ 2026</h1>
            <div class="intro__sub">Un relato interactivo sobre el videoclub y el streaming</div>
            <button class="boton boton--grande" id="empezar" type="button" style="background:#fff;color:#0022cc;font-family:var(--fuente-retro);border-radius:4px">📼 Meter la cinta</button>
          </div>
        </div>
        <div class="tele__marca">TELEVISIÓN</div>
        <div class="tele__botones" aria-hidden="true"><i></i><i></i></div>
      </div>
      <p class="intro__texto">Vive el mismo viernes por la noche dos veces: en 1992, en el videoclub del barrio, y en 2026, en una plataforma de streaming.
      Al final de cada escena de 2026 descubrirás qué toma el nuevo medio del anterior, qué le añade y qué cambia en nuestras costumbres.
      <br><small>Tiene sonido (puedes silenciarlo arriba a la derecha). Duración: unos 10 minutos.</small></p>`;
    el.querySelector('#empezar').addEventListener('click', () => {
      Sonido.iniciar();
      Sonido.meterCinta();
      transicion('▶ PLAY', () => mostrar(1), 1200);
    });
  }

  /* ---------- Salto 1992 → 2026 ---------- */
  function pintarSalto(el) {
    document.body.dataset.epoca = 'intro';
    ui.epoca.textContent = '';
    ui.siguiente.hidden = true;
    el.innerHTML = `<div class="tele"><div class="tele__pantalla"><div>
      <div class="intro__play">▶▶</div>
      <h1 class="intro__titulo">FIN DE LA CARA A</h1>
      <div class="intro__sub">Ahora, el mismo viernes… 34 años después.</div>
      <button class="boton boton--grande" id="avanzar" type="button" style="background:#fff;color:#0022cc;font-family:var(--fuente-retro);border-radius:4px">▶▶ Avanzar hasta 2026</button>
    </div></div><div class="tele__marca">TELEVISIÓN</div></div>`;
    el.querySelector('#avanzar').addEventListener('click', () => {
      let anio = 1992;
      ui.ruidoTexto.textContent = '▶▶ 1992';
      ui.ruido.classList.add('activo');
      Sonido.rebobinar(2.2);
      const t = setInterval(() => {
        anio++;
        ui.ruidoTexto.textContent = '▶▶ ' + anio;
        if (anio >= 2026) {
          clearInterval(t);
          setTimeout(() => { mostrar(estado.paso + 1); setTimeout(() => ui.ruido.classList.remove('activo'), 250); }, 350);
        }
      }, 60);
    });
  }

  /* ---------- Pantalla de equivalencias 1992 → 2026 ---------- */
  function pintarEquivalencias(el) {
    el.innerHTML = `<div class="escena__cabecera">
        <div class="escena__numero">Rebobinamos todo el viaje</div>
        <h1 class="escena__titulo">¿A qué equivale cada cosa?</h1>
        <p class="escena__texto">Cada elemento del videoclub de 1992 tiene su versión en la plataforma de 2026. Algunos se conservan casi igual, otros se transforman y otros cambian por completo nuestras costumbres.</p>
      </div>
      <ol class="equivalencias">${EQUIVALENCIAS.map((e, i) => `
        <li class="equivalencia" style="animation-delay:${i * 90}ms">
          <div class="equivalencia__par">
            <div class="equivalencia__lado equivalencia__lado--1992"><small>1992</small><span aria-hidden="true">${e.a[0]}</span>${e.a[1]}</div>
            <div class="equivalencia__flecha" aria-hidden="true">▶▶</div>
            <div class="equivalencia__lado equivalencia__lado--2026"><small>2026</small><span aria-hidden="true">${e.b[0]}</span>${e.b[1]}</div>
          </div>
          <p class="equivalencia__texto"><span class="equivalencia__concepto">${e.concepto}</span> ${e.texto}</p>
        </li>`).join('')}
      </ol>`;
    ctx.listo();
  }

  /* ---------- Pantalla final ---------- */
  function pintarFinal(el) {
    const fichas = estado.fichas.map(id => FICHAS[id]);
    const lista = clave => fichas.map(f => `<li><b>${f.titulo}:</b> ${f[clave]}</li>`).join('');
    el.innerHTML = `<div class="escena__cabecera">
        <div class="escena__numero">Fin de la cinta</div>
        <h1 class="escena__titulo">¿Qué ha cambiado?</h1>
      </div>
      <p class="tesis">Prime Video elimina la espera del videoclub… pero el software vuelve a simular su escasez: la película ya nunca está alquilada, pero caduca a las 48 horas.</p>
      <p class="escena__texto">Es la <strong>remediación</strong>: el medio nuevo no borra al anterior, lo absorbe y lo transforma (Bolter y Grusin, 2011). Y es la <strong>transcodificación</strong>: las costumbres culturales del videoclub se reescriben como reglas del software (Manovich, 2005).</p>
      <div class="resumen">
        <div class="resumen__col"><h3>🔁 Se apropia</h3><ul>${lista('apropia')}</ul></div>
        <div class="resumen__col"><h3>➕ Extiende</h3><ul>${lista('extiende')}</ul></div>
        <div class="resumen__col"><h3>👥 Cambia el hábito</h3><ul>${lista('habito')}</ul></div>
      </div>
      <div class="acciones"><button class="boton" id="otra-vez" type="button">◀◀ Rebobinar y volver a empezar</button></div>
      <details class="panel creditos">
        <summary><strong>Créditos y referencias</strong></summary>
        <ul>
          <li>Idea, guion y diseño: Marcos Padilla Arroyo. PEC2 de Cultura Digital (20.644), Universitat Oberta de Catalunya, 2026.</li>          
          <li>Las películas, actores y comercios del relato son ficticios. La interfaz de 2026 es genérica y no reproduce la de ninguna plataforma.</li>
          <li>Efectos de sonido generados en el navegador con la Web Audio API. Tipografías VT323 e Inter (Google Fonts, licencia SIL Open Font).</li>
          <li>Plazos de alquiler, precios y anuncios basados en Albertini (2020a) y Solo (2024).</li>
        </ul>
        <h3 style="font-size:16px;margin-top:12px">Referencias</h3>
        <ul>${REFERENCIAS.map(r => `<li>${r}</li>`).join('')}</ul>
      </details>`;
    el.querySelector('#otra-vez').addEventListener('click', () => {
      reiniciarEstado();
      transicion('◀◀', () => mostrar(0), 1200);
    });
  }

  /* ---------- Modal ◀◀ "Así era en 1992" ---------- */
  let focoPrevio = null;
  function abrirModal() {
    const paso = pasos[estado.paso];
    if (paso.tipo !== 'escena') return;
    focoPrevio = document.activeElement;
    Sonido.rebobinar(0.6);
    ui.modalTitulo.textContent = `◀◀ 1992 · ${paso.escena.titulo}`;
    ui.modalCuerpo.innerHTML = `<p>${RESUMEN_1992[paso.escena.id]}</p>`;
    ui.modal.hidden = false;
    ui.modalCerrar.focus();
  }
  function cerrarModal() {
    ui.modal.hidden = true;
    Sonido.clic();
    if (focoPrevio) focoPrevio.focus();
  }

  /* ---------- Eventos globales ---------- */
  ui.siguiente.addEventListener('click', avanzar);
  ui.rebobinar.addEventListener('click', abrirModal);
  ui.modalCerrar.addEventListener('click', cerrarModal);
  ui.modal.addEventListener('click', e => { if (e.target === ui.modal) cerrarModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !ui.modal.hidden) cerrarModal(); });
  ui.sonido.addEventListener('click', () => {
    const on = Sonido.alternar();
    ui.sonido.setAttribute('aria-pressed', on);
    ui.sonido.querySelector('span').textContent = on ? '🔊' : '🔇';
  });

  // Para revisar una escena concreta: index.html#paso=12
  const salto = /#paso=(\d+)/.exec(location.hash);
  mostrar(salto ? Math.min(+salto[1], pasos.length - 1) : 0);
})();
