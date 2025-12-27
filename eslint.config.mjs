import { defineConfig } from "eslint/config";
import tsEslint from "typescript-eslint";
import collationPlugin from "eslint-plugin-collation";
import stylisticPlugin from "@stylistic/eslint-plugin";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import importPlugin from "eslint-plugin-import";

const config = defineConfig([
  { files: ["**/*.{ts,tsx}"] },
  {
    rules: {
      curly: "error",
      eqeqeq: [
        "error",
        "always",
        {
          null: "ignore",
        },
      ],
    },
  },
  {
    plugins: {
      "@typescript-eslint": tsEslint.plugin,
    },
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "tsconfig.json",
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
    },
  },
  {
    plugins: {
      collation: collationPlugin,
    },
    rules: {
      "collation/group-exports": "error",
      "collation/no-default-export": "error",
      "collation/no-inline-export": "error",
      "collation/sort-exports": "error",
    },
  },
  {
    plugins: {
      "@stylistic": stylisticPlugin,
    },
    rules: {
      "@stylistic/padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          next: "export",
          prev: "*",
        },
        {
          blankLine: "never",
          next: "export",
          prev: "export",
        },
        {
          blankLine: "always",
          next: "*",
          prev: "import",
        },
        {
          blankLine: "never",
          next: "import",
          prev: "import",
        },
      ],
    },
  },
  {
    plugins: {
      perfectionist: perfectionistPlugin,
    },
    rules: {
      "perfectionist/sort-intersection-types": "error",
      "perfectionist/sort-union-types": "error",
    },
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/no-duplicates": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    },
  },
  { ignores: [".wxt", "dist", "eslint.config.mjs"] },
]);

export default config;
