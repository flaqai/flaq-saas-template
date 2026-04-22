import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "**/dist",
    "**/node_modules",
    "**/.next",
    "**/.vscode",
    "**/build",
    "**/messages",
    "**/components.json",
    "components/ui/",
    "components/magicui/",
]), {
    extends: [
        ...nextCoreWebVitals,
        ...compat.extends("prettier"),
        ...compat.extends("airbnb"),
        ...compat.extends("airbnb-typescript")
    ],

    plugins: {
        prettier,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
            React: "readonly",
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "commonjs",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    rules: {
        "react/react-in-jsx-scope": "off",
        "jsx-quotes": [2, "prefer-single"],
        "react/jsx-one-expression-per-line": "off",
        "function-paren-newline": "off",
        "max-len": "off",
        "implicit-arrow-linebreak": "off",
        "operator-linebreak": "off",
        "@next/next/no-img-element": "off",
        "react/require-default-props": "off",
        "object-curly-newline": "off",
        "react/jsx-props-no-spreading": "off",
        "jsx-a11y/control-has-associated-label": "off",
        "react/no-array-index-key": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "react/destructuring-assignment": "off",
    },
}]);