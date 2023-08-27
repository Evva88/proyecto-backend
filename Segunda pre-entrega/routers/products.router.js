import { Router } from "express";
import ProductManager from "../dao/models/ProductManager.js";

const productsRouter = Router();
const productManager = new ProductManager();

productsRouter.get("/", async (req, res) => {
  const products = await productManager.getProducts(req.query);

  res.send({products});
});

productsRouter.get("/:pid", async (req, res) => {
  let pid = req.params.pid;
  const products = await productManager.getProductById(pid);
  
  res.send({products});
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updatedProduct = req.body;
    
    await productManager.updateProduct(pid, updatedProduct);
    
    res.send("Producto actualizado");
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).send(`Error al actualizar el producto: ${error.message}`);
  }
});


productsRouter.post("/", async (req, res) => {
  let newProduct = req.body;
  try {
    await productManager.addProduct(newProduct);
    res.send("Producto agregado");
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(400).send(`Error al agregar el producto: ${error.message}`);
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  let pid = req.params.pid;
  try {
    await productManager.deleteProduct(pid);
    res.send({
      status: "ok",
      message: "El Producto se eliminó correctamente!",
    });
  } catch (error) {
    if (error.message === "Producto no encontrado") {
      res.status(404).send({
        status: "error",
        message:
          "Error! No se pudo eliminar el Producto. Producto no encontrado!",
      });
    } else {
      res.status(500).send({
        status: "error",
        message: "Error! No se pudo eliminar el Producto!",
      });
    }
  }
});

export default productsRouter;