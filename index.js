const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());
console.log();
const uri = `mongodb+srv://${process.env.DB_SCCTAST}:${process.env.DB_PASS}@cluster0.wjgws1x.mongodb.net/?retryWrites=true&w=majority`;
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("SccTastMenagement").collection("users");
    const userAllTast = client.db("SccTastMenagement").collection("allTask");

    //   -------------------------------ALL TASK API-----------------------------------
    app.get("/alltask", async (req, res) => {
      const email = req.query?.email;
      const query = { user_email: email };
      const result = await userAllTast.find(query).toArray();
      res.send(result);
    });
    app.get("/alltask/single/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await userAllTast.findOne(filter);
      res.send(result);
    });
    app.put("/alltask/updated", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: new ObjectId(id) };
      const data = req.body;
      const updatedDoc = {
        $set: {
          current_date: data.current_date ,
          deadline: data.deadline ,
          discription: data.discription,
          priority: data.priority ,
          title: data.title ,
        },
      };
      const result = await userAllTast.updateOne(filter, updatedDoc);
      res.send(result)
    });
    app.delete("/alltask/delete", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: new ObjectId(id) };
      const result = await userAllTast.deleteOne(filter);
      res.send(result);
    });
    app.post("/alltask", async (req, res) => {
      const result = await userAllTast.insertOne(req.body);
      res.send(result);
    });
    //   -------------------------------USER API-----------------------------------
    app.get("/user", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    app.post("/user", async (req, res) => {
      const query = { email: req.body.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user alredy exists", insertedId: null });
      }
      const result = await userCollection.insertOne(req.body);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}

run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("start the scc task menagement");
});
app.listen(port, () => {
  console.log(`start the server port : ${port}`);
});
