import { Db } from "mongodb";
import getDatabase from "./mongo";

class queries {
  collection: string;
  constructor(collection: string) {
    this.collection = collection;
  }
  private database: Db | null;

  private get db(): Db {
    return this.database === null ? this.getDb() : this.database;
  }

  getDb(): Promise<Db> {
    return (async () => {
      const db = await getDatabase();
      this.database = db;
      return db;
    })();
  }

  findOne(query: any) {
    return await this.db.collection(this.collection).findOne(query);
  }
}
