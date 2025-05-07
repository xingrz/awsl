import typescript from '@rollup/plugin-typescript';
import banner2 from 'rollup-plugin-banner2';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

const { version } = JSON.parse(readFileSync('package.json', 'utf-8'));

const META = readFileSync(join('assets', 'meta.in.js'), 'utf-8')
  .replace('{{version}}', version);

const MANIFEST = readFileSync(join('assets', 'manifest.in.json'), 'utf-8')
  .replace('{{version}}', version);

function createFile(files) {
  return {
    name: 'create-file',
    writeBundle() {
      for (const { path, content } of files) {
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, content);
      }
    },
  };
}

/** @type {Record<string, import('rollup').RollupOptions>} */
export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/awsl.user.js',
    format: 'es',
  },
  plugins: [
    typescript(),
    banner2(() => META),
    createFile([
      { path: join('dist', 'awsl.meta.js'), content: META },
      { path: join('dist', 'manifest.json'), content: MANIFEST },
    ]),
  ],
};
