import basicSsl from "@vitejs/plugin-basic-ssl"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { comlink } from "vite-plugin-comlink"

export default defineConfig({
  plugins: [basicSsl(), react(), comlink()],
  worker: {
    plugins: () => [comlink()],
  },
  build: {
    outDir: "./build",
  },
})
