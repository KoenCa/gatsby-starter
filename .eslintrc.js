module.exports = {
  env: {
    browser: true,
    es6: true,
    commonjs: true,
  },
  plugins: ["compat", "prettier", "react", "react-hooks"],
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true,
    },
  },
  rules: {
    "prettier/prettier": "error",
    "compat/compat": "off",
    "react/no-unknown-property": ["error", { ignore: ["class"] }],
    "react/prop-types": "off",
    "react/display-name": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};
