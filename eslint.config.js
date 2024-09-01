import globals from "globals";
import { fixupPluginRules } from "@eslint/compat";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
// TODO: add jsx-ally when it supports ESLint 9: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/pull/1009

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"]
  },
  {
    languageOptions: { globals: globals.browser },
    settings: {
      react: { version: "detect" }
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      "react-hooks": fixupPluginRules(pluginReactHooks),
      "react-refresh": pluginReactRefresh,
      "simple-import-sort": pluginSimpleImportSort,
    },
    rules: {
      ...pluginReact.configs["jsx-runtime"].rules,
      ...pluginReactHooks.configs.recommended.rules,
      "react/prop-types": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    }
  },
];
