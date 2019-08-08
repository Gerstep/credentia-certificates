import local from './environment.local';

// const env = global.process.env;

export default Object.assign({}, local, {
  env: 'development',
  isDev: false
});
