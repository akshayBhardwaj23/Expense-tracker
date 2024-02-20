import express from 'express';
import dotenv from 'dotenv';
import cors from "cors"
import Transaction from './models/Transaction.js'
import mongoose from 'mongoose';
import serverless from 'serverless-http';

const app = express();
app.use(express.json());

/**To config .env variables */
dotenv.config({path:'./.env.local'})

/**Cross-Origin Resource Sharing in Node.js is a 
 * mechanism by which a front-end client can make
 *  requests for resources to an external back-end server */
app.use(cors())

app.get('/api/test',(req,res)=>{
    res.send('test ok')
})
/**Api endpoint for submitting transactions */
app.post('/api/transaction', async (req,res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
        
        /**Grab data from the request body */
        const {name, price, description, datetime} = req.body;
        /**Add new document to the collection */
        const transaction = await Transaction.create({name, price, description,datetime})

        res.send(transaction)    
    } catch (error) {
        console.error('Not able to connect to mongoDB',error);    
    }
})

/**API endpoint to fetch transations */
app.get('/api/transactions',async (req,res)=>{
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    /**Fetch all the documents */
    const transactions = await Transaction.find()
    res.send(transactions);

    
})

app.delete('/api/transaction/:id', async (req,res)=>{
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    /**Delete and get the deleted transaction */
    const transaction = await Transaction.findByIdAndDelete({_id: req.params.id})
    
    /**Chekc if there was any transaction deleted */
    if (!transaction) return res.status(404).send('The transaction with the given id was not found.');

    res.send(transaction);

})

/**Listening to port */
const port = process.env.PORT || 4000
app.listen(port,()=>console.log('listening to port'));

