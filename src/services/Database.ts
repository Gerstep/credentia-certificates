import { injectable } from 'inversify';
import mongoose from 'mongoose';

/*
 TODO inject configs via inversify
 https://github.com/cvrabie/inversify-config-injection
* */
import env from '../environments/environment';
import { Logger }     from './Logger';

@injectable()
export class Database {
  client!: mongoose.Mongoose;

  constructor(private logger: Logger) {}

  listen = async () => {
    const {url, ...config} = env.db;

    this.logger.info('Connecting to ' + url);

    try {
      const client = await mongoose.connect(url, config);
      this.logger.info('Connected to MongoDB');
      this.client = client;
      return client;
    } catch (e) {
      this.logger.error(e, 'Failed to connect to MongoDB');
      throw e;
    }
  };

  close = async () => {
    return this.client.disconnect();
  };

  getConnection() {
    return this.client.connection;
  }
}
