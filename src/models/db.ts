import { Sequelize } from 'sequelize';
import { inject, singleton } from 'tsyringe';

@singleton()
export class Database {
  private connectionURI: string = '';
  public sequelize: Sequelize;

  constructor(
    @inject('DB_NAME') private dbName: string,
    @inject('DB_FULL_HOST') private dbFullHost: string,
    @inject('DB_USER') private dbUser: string,
    @inject('DB_PASSWORD') private dbPassword: string,
  ) {
    this.connectionURI = `postgres://${this.dbUser}:${this.dbPassword}@${this.dbFullHost}/${this.dbName}`;

    Sequelize.addHook('afterDisconnect', () => {
      console.log('Reconnection is starting in 1 sec.');
      setTimeout(() => {
        this.connectDB();
      }, 1000);
    });

    this.sequelize = new Sequelize(this.connectionURI, { logging: false });
  }

  async connectDB() {
    try {
      await this.sequelize.authenticate();
      console.log('DB Connected!');
    } catch (err) {
      console.error(`DB Connection Error: ${err}`);
      setTimeout(() => {
        this.connectDB();
      }, 1000);
    }
  }
}
