import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import {dts} from 'rollup-plugin-dts';
import pkg from './package.json';

const pkgNameAndVersion = pkg.name + ' v' + pkg.version;
const license = `${pkg.license} License`;
const author = `© ${pkg.author.name}`;
const year = new Date().getFullYear();
const repoUrl = pkg.repository.url.substring(0, pkg.repository.url.length - 4); // removes tail ".git"
const banner = `/*! ${pkgNameAndVersion} | ${license} | ${author} ${year} | ${repoUrl} */`;

const withTypeDeclarations = {
	compilerOptions: {
		declaration: true,
		declarationMap: true,
		declarationDir: './dist/esm/temp-dts',
	},
};

const esm = {
	input: pkg.main,
	plugins: [typescript(withTypeDeclarations)],
	output: {
		banner,
		dir: './dist/esm',
		format: 'es',
		entryFileNames:'hotkeys.esm.js',
	},
};

const declarationFile = {
	input: './dist/esm/temp-dts/src/index.d.ts',
	plugins: [dts()],
	output: [{
		file: pkg.types,
		format: 'es',
	}],
};

const browserMini = {
	input: pkg.main,
	plugins: [typescript(), terser()],
	output: {
		banner,
		esModule: false,
		file: pkg.browser,
		format: 'iife',
		name: 'hotkeys',
	},
};

export default [
	esm,
	declarationFile,
	browserMini,
];
