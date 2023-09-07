import express from "express";
import ProductManager from "../dao/models/ProductManager.js";
import CartManager from "../dao/models/CartsManager.js";

const router = express.Router();
const PM = new ProductManager();
const CM = new CartManager();

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

router.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;
  const cart = await CM.getCart(cid);

  if (cart) {
      res.render("layouts/carts", {products:cart.products});
  } else {
      res.status(400).send({status:"error", message:"Error! No se encuentra el ID de Carrito!"});
  }
});

router.get("/chat", (req, res) => {
  res.render("layouts/chat");
});

const checkSession = (req, res, next) => {
  console.log(
    "Verificando req.session.user en checkSession:",
    req.session.user
  );
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("layouts//login",  {user:userData})
  }
};

const checkAlreadyLoggedIn = (req, res, next) => {
  console.log("Verificando req.session en checkAlreadyLoggedIn:", req.session);
  console.log(
    "Verificando req.session.user en checkAlreadyLoggedIn:",
    req.session.user
  );
  if (req.session && req.session.user) {
    console.log("Usuario ya autenticado, redirigiendo a /profile");
    res.redirect("layouts/perfil");
  } else {
    console.log("Usuario no autenticado, procediendo...");
    next();
  }
};

router.get("/login",checkAlreadyLoggedIn, (req, res) => {
  res.render("layouts/login");
});

router.get("/registro",checkAlreadyLoggedIn,  (req, res) => {
  res.render("layouts/registro");
});

router.get("/perfil", checkSession, (req, res) => {
  const userData = req.session.user;
  res.render("layouts/perfil",{user:userData});
});



export default router;