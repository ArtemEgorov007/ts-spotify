module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
  ignoreFiles: ['dist/**', 'build/**', 'node_modules/**'],
  rules: {
    'no-descending-specificity': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'property-no-vendor-prefix': null,
    'media-feature-range-notation': null,
    'import-notation': null,
    'value-keyword-case': null,
    'color-hex-length': null,
    'color-function-notation': null,
    'alpha-value-notation': null,
  },
};
