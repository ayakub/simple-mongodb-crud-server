const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

//user: dbUser2
// pass:p05RiQaK0GaHWsE8



const uri = "mongodb+srv://dbUser2:p05RiQaK0GaHWsE8@sickcluster.nqy80.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db("nodeMongoCrud").collection('users');

        app.get('/users', async (req, res) => {
            const quary = {};
            const cursor = userCollection.find(quary);
            const users = await cursor.toArray()
            res.send(users)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) }
            const user = await userCollection.findOne(quary);
            res.send(user)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true }
            const updateUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
                }
            }
            const result = await userCollection.updateOne(filter, updateUser, option)
            res.send(result)
            // console.log(updateUser);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) }
            console.log('tryin delete ', id)
            const result = await userCollection.deleteOne(quary);
            console.log(result);
            res.send(result)
        })
    }
    finally {

    }

}

run().catch(error => console.log(error));



app.get('/', (req, res) => {
    res.send('hello i am coming node crud')
})

app.listen(port, () => {
    console.log(`server is running on ${port}`);
})