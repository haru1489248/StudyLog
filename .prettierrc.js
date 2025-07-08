/** @type {import('prettier').Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  printWidth: 90,
  tabWidth: 2,
  trailingComma: 'all',
  jsxSingleQuote: true,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrder: ['<THIRD_PARTY_MODULES>', '^@(.*)$', '^[./]'],
  plugins: ['@trivago/prettier-plugin-sort-imports'],
}
