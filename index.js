const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())

// -------------------
// MONGODB DATABASE

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.baw8kky.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();
        const toyCollection = client.db("toysDB").collection("toys");
        // Sub-Category
        app.get('/toys', async (req, res) => {
            let query = {}
            if (req.query.subCategory) {
                query = { subCategory: req.query.subCategory }
            }
            const result = await toyCollection.find(query).toArray();
            res.send(result)
        })
        //Seller Email
        app.get('/mytoys', async (req, res) => {
            let query = {}
            if (req.query.sellerEmail) {
                query = { sellerEmail: req.query.sellerEmail }
            }
            const result = await toyCollection.find(query).toArray();
            res.send(result)
        })
        // search toy name
        app.get('/toyname', async(req, res) =>{
            let query = {}
            if (req.query.name) {
                query = { name: req.query.name }
            }
            const result = await toyCollection.find(query).toArray();
            res.send(result)
        })
        // All Toys
        app.get('/toys', async (req, res) => {
            const result = toyCollection.find().toArray();
            res.send(result)
        })
        // Add a toy
        app.post('/toys', async (req, res) => {
            const toy = req.body;
            const result = await toyCollection.insertOne(toy);
            res.send(result)
        })
        // Delete My Toys
        app.delete('/toys/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await toyCollection.deleteOne(query)
            res.send(result)
        })
        // Update Toy
        app.get('/toys/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await toyCollection.findOne(query)
            res.send(result)
        })
        app.get('/singletoy/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await toyCollection.findOne(query)
            res.send(result)
        })
        app.put('/toys/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = {_id : new ObjectId(id)}
            const options = { upsert: true };
            const updateToy = req.body;
            console.log(id, updateToy)
            const toy = {
                $set : {
                    price : updateToy.price,
                    quantity : updateToy.quantity,
                    description : updateToy.description
                }
            }
            const result = await toyCollection.updateOne(filter, toy, options); 
            res.send(result)
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

//--------------------



//---------------------
app.get('/', (req, res) => {
    res.send('AngelToys Market is Running')
})
app.listen(port, () => {
    console.log(`AngelToys Market is Running on Port: ${port}`)
})


