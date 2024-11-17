import basicSsl from "@vitejs/plugin-basic-ssl"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { comlink } from "vite-plugin-comlink"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
    }),
    basicSsl(),
    react(),
    comlink(),
  ],
  worker: {
    plugins: () => [comlink()],
  },
  build: {
    outDir: "./build",
  },
})
