import { Router } from "express";
import ProductManager from "../dao/models/ProductManager.js";


const productRouter = Router();
const productManager = new ProductManager();

productRouter.get("/products", async (req, res) => {
  try {
    const limit = Number(req.query.limit);
    const products = await productManager.getProducts();

    if (limit) {
      const productLimit = products.slice(0, limit);
      res.send(productLimit);
    } else {
      res.render("layouts/main", { products });
    }
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error al obtener los productos");
  }
});

productRouter.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid; 
    const product = await productManager.getProductsById(pid);
    if (!product) {
      res.status(404).send("Producto no encontrado");
    } else {
      res.send(product);
    }
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).send("Error al obtener el producto");
  }
});

productRouter.put("/:pid", async (req, res) => {
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


productRouter.post("/", async (req, res) => {
  let newProduct = req.body;
  try {
    await productManager.addProduct(newProduct);
    res.send("Producto agregado");
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(400).send(`Error al agregar el producto: ${error.message}`);
  }
});

productRouter.delete("/:pid", async (req, res) => {
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

export default productRouter;