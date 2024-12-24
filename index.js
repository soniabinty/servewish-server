
const express = require("express")
const cors = require("cors")
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.du8ko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
 await client.connect();

 const serviceCollection = client.db("serviceDB").collection('service')
 const reviewCollection = client.db("serviceDB").collection('review')


// service post
 app.post('/service', async(req, res) =>{
  const newService = req.body
  console.log(newService)
  const result = await serviceCollection.insertOne(newService)
  res.send(result)
 })
   
// service get
 app.get('/service', async(req, res) =>{
  const cursor=serviceCollection.find()
  const result = await cursor.toArray()
  res.send(result)
 })


//  detail by id


app.get("/service/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await serviceCollection.findOne(query);
  res.send(result);
  
    });

// service by email

app.get("/services", async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  const result = await serviceCollection.find(query).toArray();
  res.send(result);
  
    });



// REVIEW POST
app.post('/review', async(req, res) =>{
  const newReview = req.body
  console.log(newReview)
  const result = await reviewCollection.insertOne(newReview)
  res.send(result)
 })


//  REVIEW GET

app.get('/review', async(req, res) =>{
  const cursor=reviewCollection.find()
  const result = await cursor.toArray()
  res.send(result)
 })

// service id
 app.get('/review/:serviceId', async (req, res) => {
 
  const serviceId = req.params.serviceId;
  const query = { serviceId: serviceId }
  const cursor = reviewCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) =>{
  res.send('service is running from server ')
})

app.listen(port ,() =>{
  console.log(`service is running from ${port}`)
})
