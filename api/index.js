import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from "cors"
import Transaction from './models/Transaction.js'
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

/**To config .env variables */
dotenv.config()

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

/**Listening to port */
app.listen(4000,()=>console.log('listening to port'));