const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 3000;

// middleware
app.use(cors());

// re.body undifined solve

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hlhjk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db('CURD-system');
    const userCollection = database.collection('Users');

    // user get/read by api hit
    app.get('/users', async (req, res) => {
      const query = {};
      const coursor = userCollection.find(query);
      const users = await coursor.toArray();
      res.send(users);
    });

    // get single user
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    // post oparation
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // user delete
    app.delete('/users/:userId', async (req, res) => {
      const id = req.params.userId;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);

      res.send(result);
    });

    // update user
    app.put('/users/:uiID', async (req, res) => {
      const id = req.params.uiID;
      const filter = { _id: new ObjectId(id) };
      const user = req.body;
      const option = { upsert: true };
      const updateUser = {
        $set: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
      };

      const result = await userCollection.updateOne(filter, updateUser, option);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hellow worlds');
});

app.listen(port, () => {
  console.log('My server runnig on:', port);
});
