import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    id:Number,
    products:{
        type:[
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products' 
                },
                quantity: {
                    type: Number,
                }
            }
        ]
    }
});

cartSchema.pre("findOne", function() {
    this.populate("products.product");
});

export const cartModel = mongoose.model("carts", cartSchema);