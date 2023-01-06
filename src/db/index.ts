import { MongoClient } from 'mongodb';

const uri = 'mongodb://root:example@mongo:27017';
export const client = new MongoClient(uri);

const db = client.db('app');
export default db;
