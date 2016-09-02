import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/container.js',
  format: 'cjs',
  plugins: [
    babel(),
  ],
  dest: 'lib/container.js'
};
