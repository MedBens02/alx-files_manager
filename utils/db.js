import mongodb from 'mongodb';
import envLoader from './env_loader';

/**
 * Represents a MongoDB client.
 */
class DBClient {
  /**
   * Creates a new DBClient instance.
   */
  constructor() {
    envLoader();
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}/${database}`;

    this.client = new mongodb.MongoClient(dbURL, { useUnifiedTopology: true });
    this.connected = false;

    this.connect();  // Connect on initialization
  }

  /**
   * Asynchronously connects to the MongoDB server.
   */
  async connect() {
    try {
      await this.client.connect();
      this.connected = true;
      console.log('MongoDB connected successfully');
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err.message);
      this.connected = false;
    }
  }

  /**
   * Checks if this client's connection to the MongoDB server is active.
   * @returns {boolean}
   */
  isAlive() {
    return this.connected;
  }

  /**
   * Retrieves the number of users in the database.
   * @returns {Promise<Number>}
   */
  async nbUsers() {
    if (!this.connected) throw new Error('Not connected to MongoDB');
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * Retrieves the number of files in the database.
   * @returns {Promise<Number>}
   */
  async nbFiles() {
    if (!this.connected) throw new Error('Not connected to MongoDB');
    return this.client.db().collection('files').countDocuments();
  }
}

export const dbClient = new DBClient();
export default dbClient;

