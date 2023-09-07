import express from "express";
import __dirname from "./utils.js";
import expressHandlebars  from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import viewsRouter from "./routers/views.router.js";
import { Server } from "socket.io";
import ProductManager from './dao/models/ProductManager.js';
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import chatManager from "./dao/models/chatMessager.js";
import { productModel } from "./dao/models/product.model.js";
import sessionRouters from "./routers/sessions.routers.js"
import session from "express-session";
//import FileStore  from "session-file-store";
import cookieParser from "cookie-parser";

//const fileStore = FileStore(session);
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

app.set("views", __dirname + "/views");
app.engine('handlebars', expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
app.use(session({
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://evavelli:eaL2rjVl7cD3cYwA@eva.l7bdppr.mongodb.net/ecommerce?retryWrites=true&w=majority",
    ttl: 3000
  }),
  secret: 'L1m0n',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions/", sessionRouters);
app.get("/session", async(req, res) => {

  if (req.session.contador) {
      req.session.contador++;
      res.send("Visitaste el Sitio Web: " + req.session.contador + " veces!");
  } else {
      req.session.contador = 1;
      res.send("Hola!!");
  }
})

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
    socketServer.emit("messages", messages);
  });
});