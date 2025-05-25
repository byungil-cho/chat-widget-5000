const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);

module.exports = {
  connect: async () => {
    if (!client.isConnected) await client.connect();
    return client.db();
  }
};
