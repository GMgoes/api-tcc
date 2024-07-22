import { MongoClient, Db } from 'mongodb';

export interface IConnection {
  instance: Db;
  client: MongoClient;
}

export interface ISensorInformation {
  quantity: number;
  sensorIndentification: string;
}

export interface IDataToSpreadSheets {
  date: string;
  quantity: string;
  sensorIndentification: string;
}

export interface IMessageToSend {
  sensorIndentification?: string;
  critical?: boolean;
  inScheduled?: boolean;
}
