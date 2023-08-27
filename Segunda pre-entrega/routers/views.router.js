import express from "express";
import ProductManager from "../dao/models/ProductManager.js";

const router = express.Router();
const PM = new ProductManager();

router.get("/", async (req, res) => {
  const products = await PM.getProducts(req.query);
  console.log(products);
  res.render("layouts/main", {products});
});

router.get("/products", async (req, res) => {
  const products = await PM.getProducts(req.query);
  res.render("layouts/products", products);
});

router.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  const products = await PM.getProductById(pid);

  res.render("products");
});

router.get("/realtimeproducts", (req, res) => {
  res.render("layouts/realtimeproducts");
});

router.get("/chat", (req, res) => {
  res.render("layouts/chat");
});
export default router;