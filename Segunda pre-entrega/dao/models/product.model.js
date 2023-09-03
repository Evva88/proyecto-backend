import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
  nombre: String,
  categoria: String,
  detalle: String,
  precio: Number,
  status: Boolean,
  stock: Number,
  categoria: String,
  code: String,
  img: Array
});

productsSchema.plugin(mongoosePaginate);


export const productModel = mongoose.model("products", productsSchema);