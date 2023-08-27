import express from "express";
import handlebars from "express-handlebars";
import { fileURLToPath } from "url";
import path from "path";
import viewsRouter from "./routers/views.router.js";
import { Server } from "socket.io";
import ProductManager from './dao/models/ProductManager.js';
import mongoose from "mongoose";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import chatManager from "./dao/models/chatMessager.js";
import { productModel } from "./dao/models/product.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const puerto = 8080;

(async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://evavelli:eaL2rjVl7cD3cYwA@eva.l7bdppr.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    console.log("Conexión exitosa a MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error.message);
  }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use("/", viewsRouter);
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);

const httpServer = app.listen(puerto, () => {
  console.log(`Servidor escuchando en puerto ${puerto}`);
});

const socketServer = new Server(httpServer);
const PM = new ProductManager();
const CM = new chatManager();

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado con ID:", socket.id);

  const updatedProducts = await productModel.find({}).lean();
  socketServer.emit("vistaProductos", updatedProducts);

  socket.on("addProduct", async (productos) => {
    await productModel.create(productos);
    const updatedProducts = await productModel.find({}).lean();
    socketServer.emit("vistaProductos", updatedProducts);
  });

  socket.on("deleteProduct", async (id) => {
    await productModel.findByIdAndDelete(id);
    const updatedProducts = await productModel.find({}).lean();
    socketServer.emit("vistaProductos", updatedProducts);
  });

  socket.on("newMessage", async (data) => {
    CM.createMessage(data);
    const messages = await CM.getMessages();
    console.log("Mensajes actualizados:", messages);
    io.emit("messages", messages);
});
});