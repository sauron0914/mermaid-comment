import typescript from 'rollup-plugin-typescript2'
import common from '@rollup/plugin-commonjs'

export default {
  input: './src/main.ts',
  output: [
    {
      file: './dist/bundle.js',
      format: 'esm',
    },
  ],
  treeshake: true,
  plugins: [common(), typescript()],
}
