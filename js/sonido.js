/* Efectos de sonido sintetizados con Web Audio API.
   No se usan archivos de audio: todos los sonidos se generan en el navegador. */
const Sonido = (() => {
  let ctx = null;
  let activo = true;

  function iniciar() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tono({ frec = 440, fin = null, dur = 0.12, tipo = 'square', vol = 0.08, retraso = 0 }) {
    if (!activo || !iniciar()) return;
    const t = ctx.currentTime + retraso;
    const osc = ctx.createOscillator();
    const gan = ctx.createGain();
    osc.type = tipo;
    osc.frequency.setValueAtTime(frec, t);
    if (fin) osc.frequency.exponentialRampToValueAtTime(fin, t + dur);
    gan.gain.setValueAtTime(vol, t);
    gan.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gan).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  function ruido({ dur = 0.3, vol = 0.12, filtro = 1200, retraso = 0 }) {
    if (!activo || !iniciar()) return;
    const t = ctx.currentTime + retraso;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const datos = buf.getChannelData(0);
    for (let i = 0; i < datos.length; i++) datos[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = filtro;
    const gan = ctx.createGain();
    gan.gain.setValueAtTime(vol, t);
    gan.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(gan).connect(ctx.destination);
    src.start(t);
  }

  return {
    iniciar,
    get activo() { return activo; },
    alternar() { activo = !activo; return activo; },
    clic() { tono({ frec: 1200, dur: 0.04, vol: 0.05 }); },
    tic() { tono({ frec: 2000, dur: 0.02, tipo: 'sine', vol: 0.03 }); },
    // La cinta entrando en el vídeo: golpe grave + mecanismo
    meterCinta() {
      ruido({ dur: 0.18, vol: 0.25, filtro: 400 });
      tono({ frec: 90, fin: 50, dur: 0.25, tipo: 'sine', vol: 0.25 });
      ruido({ dur: 0.5, vol: 0.06, filtro: 2500, retraso: 0.25 });
    },
    // Rebobinado / avance rápido: zumbido que sube
    rebobinar(dur = 1.2) {
      tono({ frec: 180, fin: 900, dur, tipo: 'sawtooth', vol: 0.04 });
      ruido({ dur, vol: 0.05, filtro: 3000 });
    },
    moneda() {
      tono({ frec: 1318, dur: 0.08, tipo: 'square', vol: 0.05 });
      tono({ frec: 1760, dur: 0.25, tipo: 'square', vol: 0.05, retraso: 0.08 });
    },
    error() { tono({ frec: 160, dur: 0.35, tipo: 'sawtooth', vol: 0.07 }); },
    exito() {
      [523, 659, 784, 1046].forEach((f, i) => tono({ frec: f, dur: 0.14, tipo: 'triangle', vol: 0.07, retraso: i * 0.09 }));
    },
    // Notificación suave de la interfaz de 2026
    notificacion() {
      tono({ frec: 880, dur: 0.12, tipo: 'sine', vol: 0.06 });
      tono({ frec: 1320, dur: 0.2, tipo: 'sine', vol: 0.05, retraso: 0.1 });
    },
    telefono() {
      for (let i = 0; i < 2; i++) {
        tono({ frec: 440, dur: 0.35, tipo: 'sine', vol: 0.05, retraso: i * 0.6 });
        tono({ frec: 480, dur: 0.35, tipo: 'sine', vol: 0.05, retraso: i * 0.6 });
      }
    }
  };
})();
