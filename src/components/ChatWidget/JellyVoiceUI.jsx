import { useEffect, useRef, useState, useCallback } from 'react';
import './JellyVoiceUI.css';

// ─── Perlin noise helpers (outside component — pure math, no side-effects) ───

const PERM = (() => {
  const p = Array.from({ length: 256 }, (_, i) => i);
  let s = 42;
  const lcg = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(lcg() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  return [...p, ...p];
})();

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function gradP(hash, x, y) {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}

function perlin2(x, y) {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const aa = PERM[PERM[xi] + yi];
  const ab = PERM[PERM[xi] + yi + 1];
  const ba = PERM[PERM[xi + 1] + yi];
  const bb = PERM[PERM[xi + 1] + yi + 1];
  const lerpFn = (a, b, t) => a + t * (b - a);
  return lerpFn(
    lerpFn(gradP(aa, xf, yf),     gradP(ba, xf - 1, yf),     u),
    lerpFn(gradP(ab, xf, yf - 1), gradP(bb, xf - 1, yf - 1), u),
    v
  );
}

function fbm(x, y, octaves = 4, lacunarity = 2.1, gain = 0.48) {
  let val = 0, amp = 0.5, freq = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    val += amp * perlin2(x * freq, y * freq);
    max += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return val / max;
}

function lerpVal(a, b, t) {
  return a + (b - a) * t;
}

// ─── Frequency bar data ───────────────────────────────────────────────────────
const FREQ_BARS = [
  { h: '8px',  d: '0.55s', delay: '0s'     },
  { h: '18px', d: '0.45s', delay: '0.07s'  },
  { h: '24px', d: '0.38s', delay: '0.14s'  },
  { h: '20px', d: '0.50s', delay: '0.05s'  },
  { h: '14px', d: '0.42s', delay: '0.11s'  },
  { h: '22px', d: '0.36s', delay: '0.03s'  },
  { h: '10px', d: '0.48s', delay: '0.09s'  },
];

// ─── Canvas constants ─────────────────────────────────────────────────────────
const W = 280, H = 280, CX = W / 2, CY = H / 2;
const N = 10;

// ─── Component ───────────────────────────────────────────────────────────────
export default function JellyVoiceUI() {
  const canvasRef  = useRef(null);
  const glowRef    = useRef(null);
  const rafRef     = useRef(null);

  // Mutable animation state stored in a ref — avoids stale closure issues
  const stateRef = useRef({
    t: 0,
    energy: 0,
    targetEnergy: 0,
    hue1: 265,
    hue2: 210,
    tH1: 265,
    tH2: 210,
    isActive: false,
    points: Array.from({ length: N }, (_, i) => ({
      angle: (i / N) * Math.PI * 2,
      r: 88,
      velR: 0,
      phase: (i / N) * Math.PI * 2,
    })),
  });

  // React state — only for UI re-renders
  const [uiState, setUiState] = useState({
    label: 'Voice assistant ready',
    labelActive: false,
    freqVisible: false,
    dots: 0,           // 0, 1, 2, or 3 dots lit
  });

  // ── Toggle voice ───────────────────────────────────────────────────────────
  const toggleVoice = useCallback(() => {
    const s = stateRef.current;
    s.isActive = !s.isActive;

    if (s.isActive) {
      s.targetEnergy = 0.55;
      s.tH1 = 275; s.tH2 = 195;
      glowRef.current?.classList.add('active');
      setUiState({ label: 'Listening', labelActive: true, freqVisible: false, dots: 1 });

      setTimeout(() => {
        if (!s.isActive) return;
        s.targetEnergy = 1.0;
        s.tH1 = 195; s.tH2 = 310;
        setUiState({ label: 'Speaking', labelActive: true, freqVisible: true, dots: 3 });
      }, 2000);

      setTimeout(() => {
        if (!s.isActive) return;
        s.targetEnergy = 0.45;
        s.tH1 = 275; s.tH2 = 195;
        setUiState({ label: 'Listening', labelActive: true, freqVisible: false, dots: 2 });
      }, 5000);

    } else {
      s.targetEnergy = 0;
      s.tH1 = 265; s.tH2 = 210;
      glowRef.current?.classList.remove('active');
      setUiState({ label: 'Voice assistant ready', labelActive: false, freqVisible: false, dots: 0 });
    }
  }, []);

  // ── Update blob physics ────────────────────────────────────────────────────
  const updateBlob = useCallback(() => {
    const s = stateRef.current;
    s.t += 0.010;
    s.energy = lerpVal(s.energy, s.targetEnergy, 0.035);
    s.hue1   = lerpVal(s.hue1, s.tH1, 0.025);
    s.hue2   = lerpVal(s.hue2, s.tH2, 0.025);

    const baseR    = 84 + s.energy * 12;
    const idleAmp  = 4;
    const speakAmp = 10 + s.energy * 14;
    const amp      = lerpVal(idleAmp, speakAmp, s.energy);
    const k        = 0.13;
    const damp     = 0.70;

    s.points.forEach((p) => {
      const nx = Math.cos(p.angle) * 1.0 + s.t * 0.50;
      const ny = Math.sin(p.angle) * 1.0 + s.t * 0.35;
      const noiseVal = fbm(nx, ny, 4);

      const fourier =
        Math.cos(p.angle + s.t * 0.5) * 0.5 +
        Math.cos(2 * p.angle + s.t * 0.7 + 0.8) * 0.18;

      const noiseContrib   = noiseVal * amp * 0.85;
      const fourierContrib = fourier  * amp * 0.15 * s.energy;
      const target = baseR + noiseContrib + fourierContrib;

      const displacement = p.r - target;
      p.velR = p.velR * damp + (-k * displacement);
      p.r   += p.velR;
      p.r    = Math.max(baseR - amp, Math.min(baseR + amp, p.r));
    });
  }, []);

  // ── Draw blob on canvas ────────────────────────────────────────────────────
  const drawBlob = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const s = stateRef.current;

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(CX, CY);

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, CX);
    gradient.addColorStop(0, `hsl(${s.hue1}, 100%, 60%)`);
    gradient.addColorStop(1, `hsl(${s.hue2}, 100%, 20%)`);
    ctx.fillStyle = gradient;

    ctx.beginPath();
    s.points.forEach((p, i) => {
      const x = Math.cos(p.angle) * p.r;
      const y = Math.sin(p.angle) * p.r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }, []);

  // ── Animation loop ────────────────────────────────────────────────────────
  useEffect(() => {
    const animate = () => {
      updateBlob();
      drawBlob();
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(rafRef.current);
  }, [updateBlob, drawBlob]);

  return (
    <div className="jelly-page">
      <div className="scene">
        <div className="glow-bg" ref={glowRef} />

        <div className="blob-wrapper" onClick={toggleVoice}>
          <canvas ref={canvasRef} width={280} height={280} />

          {/* Frequency bars */}
          <div className={`freq-bars${uiState.freqVisible ? ' visible' : ''}`}>
            {FREQ_BARS.map((bar, i) => (
              <div
                key={i}
                className="freq-bar"
                style={{
                  '--h': bar.h,
                  '--d': bar.d,
                  animationDelay: bar.delay,
                }}
              />
            ))}
          </div>
        </div>

        {/* State label */}
        <div className={`state-label${uiState.labelActive ? ' active' : ''}`}>
          {uiState.label}
        </div>

        {/* Dot indicator */}
        <div className="dot-row">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`dot${uiState.dots > i ? ' lit' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}