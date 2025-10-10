import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginQuery from '@tanstack/eslint-plugin-query';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname
});

const eslintConfig = [
	...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
	...pluginQuery.configs['flat/recommended'],
	{
		ignores: ['**/.next', '**/next.config.js', 'next.config.js', '**/node_modules']
	},
	{
		rules: {
			'react-hooks/exhaustive-deps': 'off',
			'@tanstack/query/exhaustive-deps': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			]
		}
	}
];

export default eslintConfig;
