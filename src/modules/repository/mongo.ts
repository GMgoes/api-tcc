import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import {
  Collection,
  MongoClient,
  MongoClientOptions,
  ServerApiVersion,
} from 'mongodb';
import { IConnection, ISensorInformation } from 'src/interfaces/interface';

@Injectable()
export class RepositoryService {
  private readonly collectionName = 'sensor';
  private readonly databaseName = 'path-of-exile';
  private readonly username = process.env.USERNAME_DATABASE;
  private readonly password = process.env.PASSWORD_DATABASE;
  private readonly databaseURL = `mongodb+srv://${this.username}:${this.password}@path-of-exile.ohc4co3.mongodb.net/?retryWrites=true&w=majority&appName=path-of-exile`;

  private async createConnection(): Promise<IConnection> {
    const databaseConfig: MongoClientOptions = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    };

    try {
      const client = new MongoClient(this.databaseURL, databaseConfig);

      const instance = (await client.connect()).db(this.databaseName);

      return { client, instance };
    } catch (error) {
      console.error(error);
    }
  }

  private async closeConnection(client: MongoClient): Promise<void> {
    try {
      return await client.close();
    } catch (error) {
      console.error(error);
    }
  }

  async write(data: ISensorInformation): Promise<void> {
    try {
      const { client, instance } = await this.createConnection();

      const collection: Collection<ISensorInformation> = instance.collection(
        this.collectionName,
      );

      await collection.insertOne(data);

      await this.closeConnection(client);
    } catch (error) {
      console.error(error);
    }
  }
}
