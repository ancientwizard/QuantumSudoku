// JEST

// eslint-disable-next-line no-undef
module.exports = {
//injectGlobals: true,
  transform: {'^.+\\.ts?$': 'ts-jest'},
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};

// vim: expandtab tabstop=2 number
// END
