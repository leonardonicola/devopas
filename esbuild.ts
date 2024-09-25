import { build } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import glob from "tiny-glob";

(async function () {
  // Get all ts files
  const entryPoints = await glob("src/**/*.ts");

  build({
    entryPoints,
    logLevel: "info",
    outdir: "dist",
    bundle: true,
    minify: true,
    platform: "node",
    format: "cjs",
    plugins: [esbuildPluginPino({ transports: [] })],
    external: ["elastic-apm-node"],
  }).catch(() => process.exit(1));
})();
