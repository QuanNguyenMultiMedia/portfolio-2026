"use client";
// The living ground under Build, Benefits and Reviews (herondlabs/dename-landing-page src/waterGround.ts), ported
// to a pond of its own. A 96-cell velocity field advects itself and decays, encoded as rg in RGBA8 so it runs
// without float targets; the cursor stirs it and the painting is sampled through it. On the site scroll speed
// drives the swell and a heading lands as the drop; here a press drops it, and the ring refracts as it widens.
import { useEffect, useRef } from "react";
import "./dename.css";

const VERT = `attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
const STEP = `precision highp float;varying vec2 uv;uniform sampler2D v;uniform vec2 m,md;uniform float sv,t,asp;
vec2 dec(vec4 c){return c.xy*2.-1.;}
void main(){vec2 a=dec(texture2D(v,uv));vec2 w=dec(texture2D(v,uv-a*.012))*.965;
vec2 d=(uv-m)*vec2(asp,1.);w+=md*exp(-dot(d,d)*60.);
w+=sv*vec2(sin(uv.y*7.+t*.9)*.6+sin(uv.y*17.-t*1.3)*.25,cos(uv.x*5.-t*.7)*.5+.6)*.05;
gl_FragColor=vec4(clamp(w,-1.,1.)*.5+.5,0.,1.);}`;
const SHOW = `precision highp float;varying vec2 uv;uniform sampler2D v,img;uniform float t,uR,ia;uniform vec2 uC,uS;
void main(){vec2 w=texture2D(v,uv).xy*2.-1.;vec2 o=w*vec2(.035,-.035);
vec2 P=(uv-uC)*uS;float dd=length(P),x=dd-uR,sg=x<0.?520.:110.,env=exp(-x*x/(2.*sg*sg)),A=1.6/(1.+max(uR,0.)/1400.);
float dh=A*cos(x*.034)*env*step(0.,uR);vec2 dir=P/max(dd,1.);o+=dir*vec2(1.,-1.)*dh*34./uS;float crest=exp(-x*x/(2.*22.*22.))*A*step(0.,uR);
float sa=uS.x/uS.y;vec2 q=vec2(uv.x,1.-uv.y);q=sa>ia?vec2(q.x,.5+(q.y-.5)*ia/sa):vec2(.5+(q.x-.5)*sa/ia,q.y);
float r=texture2D(img,q+o*1.15).r;vec2 gb=texture2D(img,q+o).gb;vec3 col=vec3(r,gb);
float cs=pow(abs(sin(uv.x*31.+w.x*9.+t*.35)*sin(uv.y*23.+w.y*9.-t*.27)),7.);
col+=cs*.08*vec3(.85,1.,.8);col*=1.+dh*.16;col+=crest*.16*vec3(.86,1.,.74);
gl_FragColor=vec4(col,1.);}`;

export default function Water() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current!;
    const cv = document.createElement("canvas");
    cv.setAttribute("aria-hidden", "true");
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) return;
    el.prepend(cv);
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = (fs: string) => {
      const p = gl.createProgram()!; gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
      gl.bindAttribLocation(p, 0, "p"); gl.linkProgram(p);
      const u: Record<string, WebGLUniformLocation | null> = {};
      return { p, u: (n: string) => (u[n] ??= gl.getUniformLocation(p, n)) };
    };
    const step = prog(STEP), show = prog(SHOW);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const tex = (w: number, h: number, data: Uint8Array | null) => {
      const t = gl.createTexture()!; gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data); return t;
    };
    const FW = 96;
    let FH = 64, fields: { t: WebGLTexture; f: WebGLFramebuffer }[] = [];
    const makeFields = (asp: number) => {
      fields.forEach((x) => { gl.deleteTexture(x.t); gl.deleteFramebuffer(x.f); });
      FH = Math.max(32, Math.round(FW / asp));
      const mid = new Uint8Array(FW * FH * 4).fill(128);
      fields = [0, 1].map(() => { const t = tex(FW, FH, mid), f = gl.createFramebuffer()!; gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0); return { t, f }; });
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    const img = tex(1, 1, new Uint8Array([38, 46, 28, 255]));
    let ia = 1.5;
    const pic = new Image();
    pic.src = "/showcase/dename/lily.webp";
    pic.onload = () => { ia = pic.naturalWidth / pic.naturalHeight; gl.bindTexture(gl.TEXTURE_2D, img); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pic); };
    let W = 1, H = 1;
    const size = () => {
      const r = el.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      const d = Math.min(devicePixelRatio, 1.5) * 0.75;
      cv.width = Math.round(W * d); cv.height = Math.round(H * d);
      makeFields(W / H);
    };
    const ro = new ResizeObserver(size); ro.observe(el); size();

    const mouse = { x: 0.5, y: 0.5, dx: 0, dy: 0 };
    let drop = { x: 0.5, y: 0.5, t: -1 };
    const local = (e: PointerEvent) => { const r = el.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height]; };
    const move = (e: PointerEvent) => { const [x, y] = local(e); mouse.dx += (x - mouse.x) * 6; mouse.dy += (y - mouse.y) * 6; mouse.x = x; mouse.y = y; };
    const press = (e: PointerEvent) => { const [x, y] = local(e); drop = { x, y, t: performance.now() }; };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerdown", press);

    let raf = 0, on = false, sv = 0;
    const tick = (ms: number) => {
      const time = ms / 1000;
      sv += ((still ? 0 : 0.18) - sv) * 0.05;
      gl.viewport(0, 0, FW, FH);
      const [a, b] = fields;
      gl.useProgram(step.p); gl.bindFramebuffer(gl.FRAMEBUFFER, b.f);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, a.t); gl.uniform1i(step.u("v"), 0);
      gl.uniform2f(step.u("m"), mouse.x, mouse.y); gl.uniform2f(step.u("md"), mouse.dx, mouse.dy);
      gl.uniform1f(step.u("sv"), sv); gl.uniform1f(step.u("t"), time); gl.uniform1f(step.u("asp"), W / H);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      fields = [b, a]; mouse.dx *= 0.5; mouse.dy *= 0.5;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, cv.width, cv.height);
      gl.useProgram(show.p);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, b.t); gl.uniform1i(show.u("v"), 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, img); gl.uniform1i(show.u("img"), 1);
      // the ring travels at ~900px/s from the press; under reduced motion it never starts
      const R = drop.t < 0 || still ? -1e4 : (ms - drop.t) * 0.9;
      gl.uniform2f(show.u("uC"), drop.x, drop.y); gl.uniform2f(show.u("uS"), W, H); gl.uniform1f(show.u("uR"), R);
      gl.uniform1f(show.u("t"), time); gl.uniform1f(show.u("ia"), ia);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) { on = true; raf = requestAnimationFrame(tick); }
      else if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf); }
    });
    io.observe(el);
    return () => {
      io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move); el.removeEventListener("pointerdown", press);
      cv.remove(); gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);
  return <div ref={host} className="dn-water" />;
}
