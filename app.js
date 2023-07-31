import express from "express";
import produtsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app =  express();
const puerto = 8080;

app.use(express.json());
app.use("/api/products/", produtsRouter);
app.use("/api/carts/", cartsRouter);


app.listen(puerto, () => {
    console.log("Servidor activo en el puerto:" + puerto);
});
