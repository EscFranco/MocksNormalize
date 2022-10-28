import mongoose from "mongoose";

const productosSchema = new mongoose.Schema({
    gusto: {
        type: String,
        required: true
    },
    
    img: {
        type: String,
        required: true,
    }
    ,
    precio: {
        type: Number,
        required: true
    },

    id: {
        type: Number,
        required: true
    }

})

export const Productos = mongoose.model("productos", productosSchema)