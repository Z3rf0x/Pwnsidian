import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "src/main.ts", // Point d'entrée de votre code source TypeScript
  output: {
    file: "main.js", // Fichier final de sortie
    format: "cjs", // Format CommonJS pour les plugins Obsidian
    exports: "default", // Permet l'exportation par défaut
    sourcemap: true, // Inclure une carte des sources pour faciliter le débogage
  },
  plugins: [
    resolve(),
    commonjs(),
    json(),
    typescript({ tsconfig: "./tsconfig.json" }), // Utilisation du tsconfig pour configurer TypeScript
  ],
  external: ["obsidian"], // Ne pas inclure Obsidian dans le bundle
};
