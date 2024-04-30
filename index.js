const express = require('express');
const cors = require('cors');
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(express.json())
const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
    app.use(cors(corsConfig))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cd6vky8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const productCollection = client.db('productDB').collection('product')
        const categoryCollection = client.db('productDB').collection('subcategory')

        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/subCategories', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            console.log(result);
            res.send(result)
        })

        app.get('/myProduct/:email', async (req, res) => {
            console.log(req.params.email);
            const result = await productCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateProducts = req.body;
            const products = {
                $set: {
                    customization : updateProducts.customization,
                    description : updateProducts.description,
                    image : updateProducts.image,
                    item_name : updateProducts.item_name,
                    price : updateProducts.price,
                    rating : updateProducts.rating,
                    stock_status : updateProducts.stock_status,
                    subcategory_name : updateProducts.subcategory_name,
                    processing_time : updateProducts.processing_time
                }
            }
            const result = await productCollection.updateOne(filter,products,options)
            console.log(result);
            res.send(result)
        })

       


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Clay Fusion Server is Running')
})

app.listen(port, () => {
    console.log(`Clay fusion server is running at port ${port}`);
})