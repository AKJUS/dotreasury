import react from "@vitejs/plugin-react";
import path from "node:path";
import url from "url";
import svgr from "vite-plugin-svgr";
import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import siteConfig from "../site/vite.config";
import sitePkgJson from "../site/package.json";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: siteConfig.optimizeDeps,
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      "@site": path.resolve(__dirname, "../site"),
    },
    dedupe: [
      // dedupe all dependencies from `site`
      "@polkadot/keyring",
      "@polkadot/util",
      "@polkadot/util-crypto",
      "@osn/polkadot-react-identicon",
      ...Object.keys(sitePkgJson.dependencies),
    ],
  },
  plugins: [
    react(),
    svgr(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve(__dirname, "../site/public/imgs")),
          dest: ".",
        },
      ],
    }),
  ],
});
