import path from 'path';

const env = global.process.env;
const frontend = env.FRONTEND_URL || 'http://credentia.localhost';

export default {
  env: env.APP_ENV || 'local',
  isDev: env.NODE_ENV === 'development',
  frontend,
  cors: {
    origin: frontend,
    credentials: true
  },
  email: {
    domain: 'credentia.digital',
    confirmUrl: '/api/auth/confirm?code=',
    tokenStoragePath: '/tmp/',
    name: 'Credentia',
    email: 'noreply@credentia.digital',
    apiUserId: '10c5f32148d362ba23eaccf912a71a16',
    apiSecret: 'ead052fc591cfab04cacd8d9c3bd3946'
  },
  confLinkMaxAge: 86400000,
  tokenMaxAge: 315360000000,
  port: 3000,
  logger: {
    level: env.LOG_LEVEL || 'info',
    useLevelLabels: true,
    name: 'app',
    base: null,
    prettyPrint: {
      levelFirst: true
    }
  },
  bluebird: {
    // Enable warnings
    warnings: true,
    // Enable long stack traces
    longStackTraces: true,
    // Enable cancellation
    cancellation: false,
    // Enable monitoring
    monitoring: false
  },
  helmet: {},
  db: {
    // url: process.env.MONGODB_URI || 'mongodb+srv://user:1@cluster0-8noqs.mongodb.net/credentia?retryWrites=true&w=majority&authSource=test',
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/credentia-certs',
    autoIndex: false,
    poolSize: 20,
    reconnectTries: 60,
    reconnectInterval: 5000,
    useNewUrlParser: true,
    useFindAndModify: false,
    //replicaSet: 'rs0',
  },
  session: {
    name: 'session',
    secret: env.SESSION_SECRET || 'allyourbasearebelongtous',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: false,
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000, // expires in 14 days
      domain: env.APP_DOMAIN || 'credentia.localhost',
    }
  },
  i18next: {
    debug: false,
    fallbackLng: 'en',
    whitelist: ['en', 'ru'],
    nonExplicitWhitelist: true,
    preload: ['en', 'ru'],
    load: 'languageOnly',
    lowerCaseLng: true,
    backend: {
      // path where resources get loaded from
      loadPath: path.resolve(__dirname, '../files/locales/{{lng}}/{{ns}}.json'),
      addPath: path.resolve(__dirname, '../files/locales/{{lng}}/{{ns}}.missing.json')
    }
  },
  blockchain: {
    httpProvider: 'https://ropsten.infura.io/v3/89410cd04064459e8d809a02e4621c2b',
    certPath: 'files/blockchain/cert.sol',
    address: '0x650d8F89115aef96fB85811C4EF0f655c9ca3117',
    privateKey: 'AC4E385E9A88D934DCEFB8EB7E80680152B4F60BC229B9C08868263F7514AA9B'
  }
};
