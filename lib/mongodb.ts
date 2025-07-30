import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
let client: MongoClient;

export async function getMongoClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;   // return the client itself
}

// optional: keep the old helper for other code
export const connectToDatabase = async () => {
  const mongo = await getMongoClient();
  return mongo.db('resume-tailor');
};