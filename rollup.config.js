import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/container.js',
  format: 'cjs',
  plugins: [
    babel({
      babelrc: false,
      presets: ['es2015-rollup', 'react'],
      exclude: 'node_modules/**'
    }),
  ],
  dest: 'lib/container.js'
};
