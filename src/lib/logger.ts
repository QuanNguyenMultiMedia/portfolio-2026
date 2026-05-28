type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

let currentLevel: LogLevel = "info";
let isProduction = false;

export function setLogLevel(level: LogLevel) {
  currentLevel = level;
}

export function resetLogLevel() {
  currentLevel = "info";
  isProduction = false;
}

export function setProductionMode(prod: boolean) {
  isProduction = prod;
}

export class Logger {
  private namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  private shouldLog(level: LogLevel): boolean {
    if (level === "debug" && isProduction) return false;
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[currentLevel];
  }

  private prefix(): string {
    return `[${this.namespace}]`;
  }

  debug(...args: unknown[]) {
    if (!this.shouldLog("debug")) return;
    console.debug(this.prefix(), ...args);
  }

  info(...args: unknown[]) {
    if (!this.shouldLog("info")) return;
    console.info(this.prefix(), ...args);
  }

  warn(...args: unknown[]) {
    if (!this.shouldLog("warn")) return;
    console.warn(this.prefix(), ...args);
  }

  error(...args: unknown[]) {
    if (!this.shouldLog("error")) return;
    console.error(this.prefix(), ...args);
  }

  fatal(...args: unknown[]) {
    if (!this.shouldLog("fatal")) return;
    console.error(this.prefix(), "[FATAL]", ...args);
  }

  time(label: string): () => void {
    const start = performance.now();
    return () => {
      const elapsed = performance.now() - start;
      const formatted = `${label}: ${elapsed.toFixed(2)}ms`;
      this.info(formatted);
    };
  }

  child(subNamespace: string): Logger {
    return new Logger(`${this.namespace}:${subNamespace}`);
  }
}

export default Logger;
