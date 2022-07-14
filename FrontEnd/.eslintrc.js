module.exports = {
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es6: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
  },
  plugins: ["react", "prettier"],
  rules: {
    "global-require": 0,
    "max-len": [
      "warn",
      {
        code: 100,
      },
    ],
    "no-console": "off",
    "react/prop-types": "off",
    "prettier/prettier": "warn",
    "no-unused-vars": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
