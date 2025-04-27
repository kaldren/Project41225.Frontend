import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "security/detect-eval-with-expression": "error", // Detects eval() with user inputs, which can lead to code injection attacks
      "security/detect-non-literal-fs-filename": "error", // prevent file injection vulnerabilities
      "security/detect-unsafe-regex": "error", // reducing the risk of unintended behaviors
      "security/detect-object-injection": "error", // user-controlled data is used to create or modify an object’s properties
      "security/detect-non-literal-require": "error", // unintended modules to be loaded
    },
  },
);
