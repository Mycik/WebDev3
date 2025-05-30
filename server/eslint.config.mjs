import eslint from "@eslint/js";
import eslintImport from "eslint-plugin-import";
import globals from "globals";
import eslintTs from "typescript-eslint";

export default eslintTs.config(
  {
    ignores: ["**/dist/*", "**/public/unity/*"],
  },
  eslint.configs.recommended,
  ...eslintTs.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parser: eslintTs.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      ["@typescript-eslint"]: eslintTs.plugin,
      import: eslintImport,
    },
    rules: {
      "no-shadow": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-shadow": ["error"],
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          caughtErrors: "none",
        },
      ],
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  }
);
