"use client";
// HeronBirdRig, from herondlabs/herondlabs-website src/components/ui/HeronBirdRig.tsx, ported. A 36×60 mesh over the
// heron sprite is warped on the CPU each frame by seven puppet pins (radius, falloff power, type); the head pins
// chase the cursor through a soft asymptotic reach, the neck bows on a sine, the torso counter-balances and the
// tail follows through. The rig's tuning, which the site keeps in code, is exposed here as the panel.
import { useEffect, useRef, useState } from "react";
import "./herondlabs.css";

interface Pin { id: string; name: string; x: number; y: number; type: "head" | "neck_mid" | "collar" | "fixed"; radius: number; power: number }
const PINS: Pin[] = [
  { id: "beak", name: "Beak", x: 427, y: 388, type: "head", radius: 270, power: 3.6 },
  { id: "eye", name: "Head", x: 363, y: 383, type: "head", radius: 180, power: 2.0 },
  { id: "neck_upper", name: "Upper neck", x: 332, y: 446, type: "neck_mid", radius: 160, power: 2.0 },
  { id: "neck_lower", name: "Lower neck", x: 345, y: 500, type: "neck_mid", radius: 150, power: 2.2 },
  { id: "collar", name: "Collar", x: 350, y: 560, type: "collar", radius: 150, power: 2.5 },
  { id: "torso_fix", name: "Torso lock", x: 260, y: 640, type: "fixed", radius: 220, power: 2.5 },
  { id: "feet_fix", name: "Feet lock", x: 380, y: 840, type: "fixed", radius: 250, power: 3.0 },
];
const DEFAULTS = { reach: 0.55, aim: 0.9, curve: 0.35, smoothing: 0.08, bodyBalance: 0.45, tailFollowThrough: 0.65 };
type Config = typeof DEFAULTS;
const KNOBS: { key: keyof Config; label: string; max: number }[] = [
  { key: "reach", label: "Reach", max: 1.2 },
  { key: "aim", label: "Aim", max: 1.5 },
  { key: "curve", label: "Neck curve", max: 1 },
  { key: "smoothing", label: "Smoothing", max: 0.3 },
  { key: "bodyBalance", label: "Body balance", max: 1.2 },
  { key: "tailFollowThrough", label: "Tail follow-through", max: 1.5 },
];
const SPRITE_W = 682, SPRITE_H = 1024, PAD = 80, CW = SPRITE_W + PAD * 2, CH = SPRITE_H + PAD * 2;
const DEADZONE = 45;

export default function Heron() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cfg, setCfg] = useState(DEFAULTS);
  const cfgRef = useRef(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const [pins, setPins] = useState(true);
  const pinsRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;
    canvas.width = CW; canvas.height = CH;
    const vs = `attribute vec2 a_position;attribute vec2 a_texcoord;uniform vec2 u_resolution;uniform float u_flip;varying vec2 v_texcoord;
void main(){vec2 z=a_position/u_resolution;z.x=0.5+(z.x-0.5)*u_flip;gl_Position=vec4((z*2.0-1.0)*vec2(1,-1),0,1);v_texcoord=a_texcoord;}`;
    const fs = `precision mediump float;uniform sampler2D u_texture;varying vec2 v_texcoord;void main(){gl_FragColor=texture2D(u_texture,v_texcoord);}`;
    const sh = (t: number, s: string) => { const x = gl.createShader(t)!; gl.shaderSource(x, s); gl.compileShader(x); return x; };
    const program = gl.createProgram()!;
    gl.attachShader(program, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(program, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(program);
    const aPos = gl.getAttribLocation(program, "a_position"), aUv = gl.getAttribLocation(program, "a_texcoord");
    const uRes = gl.getUniformLocation(program, "u_resolution"), uFlip = gl.getUniformLocation(program, "u_flip"), uTex = gl.getUniformLocation(program, "u_texture");

    const COLS = 36, ROWS = 60, N = (COLS + 1) * (ROWS + 1);
    const rest = new Float32Array(N * 2), warped = new Float32Array(N * 2), uvs = new Float32Array(N * 2);
    for (let r = 0; r <= ROWS; r++) for (let c = 0; c <= COLS; c++) {
      const i = (r * (COLS + 1) + c) * 2;
      rest[i] = PAD + (c / COLS) * SPRITE_W; rest[i + 1] = PAD + (r / ROWS) * SPRITE_H; uvs[i] = c / COLS; uvs[i + 1] = r / ROWS;
    }
    const idx: number[] = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const i0 = r * (COLS + 1) + c, i2 = (r + 1) * (COLS + 1) + c;
      idx.push(i0, i0 + 1, i2, i2, i0 + 1, i2 + 1);
    }
    const posBuf = gl.createBuffer(), uvBuf = gl.createBuffer(), idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf); gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);

    const tex = gl.createTexture();
    const img = new Image();
    img.src = "/showcase/herondlabs/bird_full.png";
    let loaded = false;
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      loaded = true;
    };

    const P = PINS.map((p) => ({ ...p, x: p.x + PAD, y: p.y + PAD }));
    const collar = P.find((p) => p.id === "collar")!, eye = P.find((p) => p.id === "eye")!;
    const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    let flip = 1, targetFlip = 1, raf = 0, on = false;
    const head = { x: 0, y: 0 }, torso = { x: 0, y: 0 }, tail = { x: 0, y: 0 };
    let angle = 0;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    if (!still) addEventListener("pointermove", onMove, { passive: true });

    const render = () => {
      if (loaded) {
        const k = cfgRef.current;
        const rect = canvas.getBoundingClientRect();
        const toCanvas = CW / rect.width;
        const dxS = mouse.x - (rect.left + (collar.x / CW) * rect.width), dyS = mouse.y - (rect.top + (collar.y / CH) * rect.height);
        if (dxS > DEADZONE) targetFlip = 1; else if (dxS < -DEADZONE) targetFlip = -1;
        flip += (targetFlip - flip) * (k.smoothing * 1.5);
        const lx = (targetFlip === 1 ? dxS : -dxS) * toCanvas, ly = dyS * toCanvas;
        const dist = Math.hypot(lx, ly);
        const damp = dist > 0 ? (280 * (1 - Math.exp(-dist / 450))) / dist : 1;
        const tx = (lx / 420) * 95 * k.reach * damp, ty = (ly / 420) * 85 * k.reach * damp;
        const rot = Math.max(-0.65, Math.min(0.65, Math.atan2(ly, Math.max(90, lx)) * k.aim));
        head.x += (tx - head.x) * k.smoothing; head.y += (ty - head.y) * k.smoothing; angle += (rot - angle) * k.smoothing;
        const ttx = -head.x * 0.12 * k.bodyBalance, tty = -head.y * 0.08 * k.bodyBalance;
        torso.x += (ttx - torso.x) * k.smoothing * 0.65; torso.y += (tty - torso.y) * k.smoothing * 0.65;
        const tlx = (ttx * 1.6 - head.x * 0.08) * k.tailFollowThrough, tly = -head.y * 0.15 * k.tailFollowThrough;
        tail.x += (tlx - tail.x) * k.smoothing * 0.5; tail.y += (tly - tail.y) * k.smoothing * 0.5;
        const disp = P.map((p) => {
          if (p.id === "feet_fix") return { dx: 0, dy: 0, rot: 0 };
          if (p.id === "torso_fix") return { dx: torso.x + tail.x * 0.5, dy: torso.y + tail.y * 0.5, rot: -angle * 0.08 * k.bodyBalance };
          if (p.id === "collar") return { dx: head.x * 0.08 + torso.x * 0.4, dy: head.y * 0.08 + torso.y * 0.4, rot: angle * 0.06 };
          if (p.type === "neck_mid") {
            const f = (p.y - collar.y) / (eye.y - collar.y);
            return { dx: head.x * f + Math.sin(f * Math.PI) * head.x * 0.4 * k.curve + torso.x * (1 - f) * 0.3, dy: head.y * f + torso.y * (1 - f) * 0.3, rot: angle * f * 0.5 };
          }
          return { dx: head.x, dy: head.y, rot: angle };
        });
        for (let i = 0; i < N; i++) {
          const rx = rest[i * 2], ry = rest[i * 2 + 1];
          let tw = 0, wx = 0, wy = 0;
          for (let j = 0; j < P.length; j++) {
            const p = P[j], d = disp[j], dd = Math.hypot(rx - p.x, ry - p.y);
            if (dd >= p.radius) continue;
            const n = dd / p.radius, w = Math.pow(1 - n * n, p.power);
            if (d.rot !== 0) {
              const ox = rx - p.x, oy = ry - p.y, c = Math.cos(d.rot), s = Math.sin(d.rot);
              wx += (d.dx + ox * c - oy * s - ox) * w; wy += (d.dy + ox * s + oy * c - oy) * w;
            } else { wx += d.dx * w; wy += d.dy * w; }
            tw += w;
          }
          const m = Math.max(1, tw);
          warped[i * 2] = tw > 0.0001 ? rx + wx / m : rx; warped[i * 2 + 1] = tw > 0.0001 ? ry + wy / m : ry;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf); gl.bufferData(gl.ARRAY_BUFFER, warped, gl.DYNAMIC_DRAW);
        gl.viewport(0, 0, CW, CH); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(program);
        gl.enableVertexAttribArray(aPos); gl.bindBuffer(gl.ARRAY_BUFFER, posBuf); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aUv); gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf); gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);
        // the pin overlay turns with the bird (the shader mirrors about the canvas centre, as scaleX does)
        if (pinsRef.current) pinsRef.current.style.transform = `scaleX(${flip.toFixed(3)})`;
        gl.uniform2f(uRes, CW, CH); gl.uniform1f(uFlip, flip); gl.uniform1i(uTex, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf); gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
        // reduced motion: the rest pose, drawn once
        if (still) return;
      }
      raf = requestAnimationFrame(render);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) { on = true; raf = requestAnimationFrame(render); }
      else if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf); }
    });
    io.observe(canvas);
    // the context is not lost on cleanup: the same <canvas> is handed back on a remount and would stay dead
    return () => {
      io.disconnect(); cancelAnimationFrame(raf); removeEventListener("pointermove", onMove);
      gl.deleteBuffer(posBuf); gl.deleteBuffer(uvBuf); gl.deleteBuffer(idxBuf); gl.deleteTexture(tex); gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className="hl-rig">
      <figure className="hl-rig-figure m-0">
        <div className="hl-rig-bird">
          <canvas ref={canvasRef} aria-label="Herond Labs heron" role="img" className="absolute inset-0 size-full" />
          {pins && (
            <svg ref={pinsRef} aria-hidden viewBox={`0 0 ${CW} ${CH}`} className="hl-pins absolute inset-0 size-full">
              {PINS.map((p) => (
                <g key={p.id} className={p.type === "fixed" ? "is-fixed" : ""}>
                  <circle cx={p.x + PAD} cy={p.y + PAD} r={p.radius} className="hl-pin-reach" />
                  <circle cx={p.x + PAD} cy={p.y + PAD} r={7} className="hl-pin" />
                </g>
              ))}
            </svg>
          )}
        </div>
        <figcaption className="hl-annot">FIG. 01 · 7 pins · 36 × 60 mesh</figcaption>
      </figure>
      <div className="hl-rig-panel">
        {KNOBS.map((k) => (
          <label key={k.key} className="hl-knob">
            <span className="flex justify-between gap-3"><span>{k.label}</span><span className="hl-annot">{cfg[k.key].toFixed(2)}</span></span>
            <input type="range" min={0} max={k.max} step={0.01} value={cfg[k.key]} onChange={(e) => setCfg((c) => ({ ...c, [k.key]: +e.target.value }))} />
          </label>
        ))}
        <div className="flex gap-2 pt-1">
          <button type="button" className="hl-btn" aria-pressed={pins} onClick={() => setPins((v) => !v)}>Pins</button>
          <button type="button" className="hl-btn" onClick={() => setCfg(DEFAULTS)}>Reset</button>
        </div>
      </div>
    </div>
  );
}
