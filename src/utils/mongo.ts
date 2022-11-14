import { MongoClient } from "mongodb";

const { MONGO, MONGO_DB } = process.env;
const url = MONGO as string;
const client = new MongoClient(url);
let database: MongoClient | null = null;

const getDatabase = async () => {
  if (database === null) {
    database = await client.connect();
  }
  return database.db(MONGO_DB);
};

export default getDatabase;
