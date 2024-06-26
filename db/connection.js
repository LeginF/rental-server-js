import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

console.log(`Connection to ${uri}`);

try {
  await client.connect();
  await client.db("admin").command({ping:1});
  console.log("Pinged your database. Successfully connected to MongoDB.");
} catch (err) {
  console.error(err);
}

let db = client.db("rental");

export default db;
