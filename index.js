const express = require('express')
const app = express()
const {MongoClient} = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

// Port
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(express.json())

// MONGODB Integration
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_USERPASSWORD}@mern-practice.upqpe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

async function run() {
    try {
        await client.connect();
        const database = client.db("travelBD");
        const travelLocations = database.collection("locations");
        const newOrders = database.collection("orders");

        // API OPERATIONS
        app.get("/", async (req, res) => {
            res.send("Tour Packages")
        })

        app.get('/locations', async (req, res) => {
            const cursor = travelLocations.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        // Add Packages
        app.post('/locations', async (req, res) => {
            const newTourPackage = req.body
            const result = await travelLocations.insertOne(newTourPackage);
            res.json(result)
        })

        app.get('/locations/:tourPackage', async (req, res) => {
            const id = req.params.tourPackage
            const query = {_id: ObjectId(id)};
            const result = await travelLocations.findOne(query)
            res.json(result)
        })

        // Post Order Details
        app.post('/orders', async (req, res) => {
            const newOrder = req.body
            const result = await newOrders.insertOne(newOrder);
            res.json(result)
        })

        app.get('/orders', async (req, res) => {
            const cursor = newOrders.find({});
            const result = await cursor.toArray()
            res.send(result)
        })

        app.put('/orders/:updateOrder', async (req, res) => {
            const updateOrder = req.params.updateOrder
            const {orderStatus} = req.body
            const filter = {_id: ObjectId(updateOrder)}
            const options = {upsert: true};
            const updateDoc = {
                $set: {
                    orderStatus: orderStatus
                },
            }
            const result = await newOrders.updateOne(filter, updateDoc, options);
            res.json(result)
        })

        app.delete('/orders/:deleteOrder', async (req, res) => {
            const deleteOrder = req.params.deleteOrder
            const query = {_id: ObjectId(deleteOrder)}
            const result = await newOrders.deleteOne(query);
            res.json(result)
        })

    } finally {
        // await client.close();
    }
}

run().catch(console.dir);


// Server Listen
app.listen(PORT, () => {
    console.log("Server listening on port", PORT)
})