const express = require('express');
const {MongoClient} = require('mongodb');


const MONGO_URL='mongodb://localhost:27017';
const PORT_NUMBER=3000;


async function init(){
    const app = express();
    const client = new MongoClient(MONGO_URL,{
        useUnifiedTopology:true,
    });
    await client.connect();
    const db = client.db('adoption');
    const collection = db.collection('pets');

    app.get('/get',async (req,res)=>{
        const pets=await collection.find({
            $text:{$search: req.query.search},
        },
        {
            _id:0,
        }).sort(
            {score:{$meta:"textScore"}}
        ).limit(10).toArray();
        res.json({status:"ok",pets}).end();
    });

    app.use(express.static("./static"));
    app.listen(PORT_NUMBER,()=>{
        console.log(`SERVER STARTED AT PORT${PORT_NUMBER}`);
    });
}

init();