import { cartModel } from "./cart.model.js";
import mongoose from "mongoose";
import { productModel } from "./product.model.js";

class CartManager {
  async newCart() {
    let cart = await cartModel.create({ products: [] });
    console.log("Carrito creado!");

    return {
      status: "ok",
      message: "El Carrito se creó correctamente!",
      id: cart._id,
    };
  }

  async getCart(id) {
    if (this.validateId(id)) {
      return await cartModel.findOne({ _id: id }).lean() || null;
    } else {
      console.log("Not found!");

      return null;
    }
  }

  async getCarts() {
    return await cartModel.find().lean();
  }

  async addProductToCart(cid, pid) {
    try {
      console.log(`Adding product ${pid} to cart ${cid}`);
  
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  
      if (objectIdRegex.test(cid) && objectIdRegex.test(pid)) {
        const cartExists = await cartModel.exists({ _id: cid });
        const productExists = await productModel.exists({ _id: pid });
  
        console.log("Cart exists:", cartExists);
        console.log("Product exists:", productExists);
  
        if (cartExists && productExists) {
          const updateResult = await cartModel.updateOne(
            { _id: cid, "products.product": pid },
            { $inc: { "products.$.quantity": 1 } }
          );
  
          console.log("Update result:", updateResult);
  
          if (updateResult.matchedCount === 0) {
            const pushResult = await cartModel.updateOne(
              { _id: cid },
              { $push: { products: { product: pid, quantity: 1 } } }
            );
  
            console.log("Push result:", pushResult);
          }
  
          return {
            status: "ok",
            message: "El producto se agregó correctamente!",
          };
        } else {
          console.log("ID inválido!1");
          return {
            status: "error",
            message: "ID inválido!",
          };
        }
      } else {
        console.log("ID inválido!2");
        return {
          status: "error",
          message: "ID inválido!",
        };
      }
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      return {
        status: "error",
        message: "Ocurrió un error al agregar el producto al carrito!",
      };
    }
  }
  


  async updateQuantityProductFromCart(cid, pid, quantity) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);
        const product = cart.products.find((item) => item.product === pid);
        product.quantity = quantity;

        await cartModel.updateOne({ _id: cid }, { products: cart.products });
        console.log("Producto modificado!");

        return true;
      } else {
        console.log("Not found!");
        return false;
      }
    } catch (error) {
      console.error("Error al modificar el producto del carrito:", error);
      return false;
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);
        const products = cart.products.filter((item) => item.product !== pid);

        await cartModel.updateOne({ _id: cid }, { products: products });
        console.log("Producto eliminado!");

        return true;
      } else {
        console.log("Not found!");
        return false;
      }
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      return false;
    }
  }

  async deleteProductsFromCart(cid) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);

        await cartModel.updateOne({ _id: cid }, { products: [] });
        console.log("Carrito vaciado!");

        return true;
      } else {
        console.log("Not found!");
        return false;
      }
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      return false;
    }
  }

  validateId(id) {
    return id.length === 24 ? true : false;
  }
}

export default CartManager;
