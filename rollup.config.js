import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'Tinban',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
  external: [
    'react',
    'react-dom',
  ],
  plugins: [
    resolve(),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    uglify({
      mangle: false,
      output: {
        comments: true,
        beautify: true,
      },
    }),
  ],
};
