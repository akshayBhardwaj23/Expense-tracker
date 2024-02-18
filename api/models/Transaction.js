import mongoose from "mongoose";

const TransactionSchema  = new mongoose.Schema({
    name: {type: String, required: true},
    price:{type: Number, required: true},
    description: {type: String, required: true},
    datetime: {type: Date, required: true}
})

const Transaction  = mongoose.model('Transaction',TransactionSchema)

export default Transaction