// Shared WebGL gate for the decorative shaders (Fountain plates, the sidebar wave). A machine without a GPU
// rasterises WebGL on the CPU (SwiftShader, llvmpipe): a full-rate shader there stalls the whole page, so those
// effects hold a static state instead. Probed once per page load; the probe context is released at once.
let verdict: boolean | undefined;

export function fastGpu(): boolean {
  if (verdict !== undefined) return verdict;
  if (typeof document === "undefined") return false;
  const gl = document.createElement("canvas").getContext("webgl", { failIfMajorPerformanceCaveat: true });
  if (!gl) return (verdict = false);
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return (verdict = !/swiftshader|llvmpipe|software|basic render/i.test(name));
}

/**
 * Compiles and links a throwaway copy of a program with KHR_parallel_shader_compile, polling once per frame, so the
 * GPU process compiles while the main thread stays free. The real program built right after (OGL compiles
 * synchronously) then hits the browser's program cache instead of blocking. Without the extension it resolves at
 * once and the real compile simply blocks as before.
 */
export function warmProgram(gl: WebGLRenderingContext | WebGL2RenderingContext, vert: string, frag: string): Promise<void> {
  const ext = gl.getExtension("KHR_parallel_shader_compile");
  if (!ext) return Promise.resolve();
  const vs = gl.createShader(gl.VERTEX_SHADER), fs = gl.createShader(gl.FRAGMENT_SHADER), prog = gl.createProgram();
  if (!vs || !fs || !prog) return Promise.resolve();
  gl.shaderSource(vs, vert); gl.compileShader(vs);
  gl.shaderSource(fs, frag); gl.compileShader(fs);
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  return new Promise((resolve) => {
    const poll = () => {
      if (!gl.getProgramParameter(prog, ext.COMPLETION_STATUS_KHR)) { requestAnimationFrame(poll); return; }
      gl.deleteProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs);
      resolve();
    };
    requestAnimationFrame(poll);
  });
}

/** Runs `fn` after the page has loaded, in an idle slot: shader compiles never queue ahead of first paint or input. */
export function afterLoadIdle(fn: () => void): () => void {
  let cancelled = false, idle = 0, timer = 0;
  const run = () => { if (!cancelled) fn(); };
  const go = () => {
    if ("requestIdleCallback" in window) idle = window.requestIdleCallback(run, { timeout: 1500 });
    else timer = setTimeout(run, 200) as unknown as number;
  };
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", go);
    if (idle) window.cancelIdleCallback(idle);
    if (timer) clearTimeout(timer);
  };
}
