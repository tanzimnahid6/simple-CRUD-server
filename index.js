const express = require("express")
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
const app = express()
const port = process.env.PORT || 5000

app.unsubscribe(cors())
app.use(cors())
app.use(express.json())
//tanzimnahid6
//UD3onoEsOIvZ2m4l
app.get("/", (req, res) => {
  res.send("simple crud is running")
})

//connect to database ============================
const uri =
  "mongodb+srv://tanzimnahid6:UD3onoEsOIvZ2m4l@cluster0.artmjhw.mongodb.net/?retryWrites=true&w=majority"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()

    const database = client.db("usersDB") //name of data base
    const userCollection = database.collection("users")

    //Read Data==============
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    //Create Data =====================
    app.post("/users", async (req, res) => {
      const user = req.body
      console.log("New user", user)
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    //Delete single Data ===================
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

    
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const user = await userCollection.findOne(query)
      res.send(user)
    })
//Update single user=========================
    app.put('/users/:id',async(req,res)=>{
      const id = req.params.id 
      const user = req.body 
      console.log(user);
      const filter = {_id:new ObjectId(id)}
      const option = {upsert:true}

      const updatedUser = {
        $set:{
          name:user.name ,
          email:user.email

        }
      }


  const result = await  userCollection.updateOne(filter,updatedUser,option)
  res.send(result)

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 })
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    )
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir)

app.listen(port, () => {
  console.log("simple crud is running on port 5000")
})
