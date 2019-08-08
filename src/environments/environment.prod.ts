import dev from './environment.dev';

export default Object.assign({}, dev, {
  env: 'production',
});
