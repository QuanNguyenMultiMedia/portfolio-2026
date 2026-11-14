// Shared WebGL gate for the decorative shaders (Fountain plates, the sidebar wave). A machine without a GPU
// rasterises WebGL on the CPU (SwiftShader, llvmpipe): a full-rate shader there stalls the whole page, so those
// effects hold a static state instead. Read once per page load from the caller's own context: creating a context
// blocks the main thread for 100-300 ms (driver handshake), so a separate probe context would cost that twice.
let verdict: boolean | undefined;

/** A phone (narrow, touch-first): the decorative shaders hold still frames there and canvases render at 1x. A
 * mid-tier phone spent 300-500 ms of main thread per route on the live plates and context setup alone. */
export const isPhone = () => typeof window !== "undefined" && window.matchMedia("(max-width: 640px), (pointer: coarse) and (max-width: 1024px)").matches;

export function fastGpu(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  if (verdict !== undefined) return verdict;
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
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

// A new context's setup calls are synchronous round trips to the GPU process; right after load that process is
// still rasterising the first frames (the ink filters), and the main thread waits behind it (measured 200-300 ms).
// Past this settle time the same calls return in a few ms.
const GPU_SETTLE = 900;

/** Runs `fn` once the document is parsed and the GPU has settled, in an idle slot: context setup and shader
 * compiles never queue ahead of first paint, the first raster, or input. */
export function afterLoadIdle(fn: () => void): () => void {
  let cancelled = false, idle = 0, timer = 0;
  const run = () => { if (!cancelled) fn(); };
  const go = () => {
    timer = setTimeout(() => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(run, { timeout: 1500 });
      else run();
    }, GPU_SETTLE) as unknown as number;
  };
  // the document, not every image: on a slow network `load` waits on the in-view images and held the first ink
  // (the type's only paint, so the page's LCP) for seconds; the settle and the idle slot keep first paint clear
  if (document.readyState !== "loading") go();
  else document.addEventListener("DOMContentLoaded", go, { once: true });
  return () => {
    cancelled = true;
    document.removeEventListener("DOMContentLoaded", go);
    if (idle) window.cancelIdleCallback(idle);
    if (timer) clearTimeout(timer);
  };
}
