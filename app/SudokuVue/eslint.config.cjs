require('@rushstack/eslint-patch/modern-module-resolution')

const js = require('@eslint/js')
const pluginVue = require('eslint-plugin-vue')
const { defineConfigWithVueTs, vueTsConfigs } = require('@vue/eslint-config-typescript')

module.exports = defineConfigWithVueTs(
  {
    ignores: [
      '.eslintrc.cjs',
      'coverage/**',
      'node_modules/**',
      'package-lock.json',
      'dist/**',
      'dist-ssr/**',
      'logs/**',
      '*.log',
      '*.local',
      'cypress/videos/**',
      'cypress/screenshots/**',
      '.vscode/**',
      '.idea/**'
    ]
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      'no-unused-expressions': ['error', {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }]
    }
  },
  {
    files: ['**/*.{ts,tsx,vue}'],
    rules: {
      '@typescript-eslint/no-unused-expressions': ['error', {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }]
    }
  },
  {
    files: ['eslint.config.cjs', '**/*.cjs'],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly'
      }
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
)