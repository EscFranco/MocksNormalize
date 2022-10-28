import mongoose from "mongoose";

const finalOrderSchema = new mongoose.Schema({
    carrito: {
        type: Array,
        required: true
    },
    
    usuario: {
        type: Object,
        required: true,
    }
    ,
    precioTotal: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        require: true
    }
})

export const finalOrder = mongoose.model("finalOrder", finalOrderSchema)