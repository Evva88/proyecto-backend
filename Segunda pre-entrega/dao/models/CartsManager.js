import { cartModel } from "./cart.model.js";

class CartManager {
    async newCart() {
        console.log("Carrito creado!");
        return await cartModel.create({products:[]});
    }

  async getCart(id) {
    try {
        return await cartModel.findOne({_id:id}) || null;
    } catch(error) {
        console.log("Not found1!");

        return null;
    }
  }

  async getCarts() {
    return await cartModel.find().lean();
  }

  async addProduct(cid, pid) {
    try {
        console.log(`producto ${pid} carrito ${cid}`);
    
        if (mongoose.Types.ObjectId.isValid(cid) && mongoose.Types.ObjectId.isValid(pid)) {
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
          return {
            status: "error",
            message: "ID inválido!",
          };
        }
      } catch (error) {
        console.error(error);
        return {
          status: "error",
          message: "Ocurrió un error al agregar el producto al carrito!",
        };
      }
    }
    

  async updateProducts(cid, products) {
    try {
        await cartModel.updateOne({_id:cid}, {products:products}, {new:true, upsert:true});
        console.log("Product updated!");

        return true;
    } catch (error) {
        console.log("Not found3!");
        
        return false;
    }
}

async updateQuantity(cid, pid, quantity) {
    try {
        await cartModel.updateOne( { _id: cid },
          { $set: { products: { product: pid, quantity: quantity } } });
        console.log("Product updated!");

        return true;
    } catch (error) {
        console.log("Not found!");
        
        return false;
    }
}

async deleteProduct(cid, pid) {
    try {
        await cartModel.updateOne({_id:cid}, {$pull:{products:{product:pid}}});
        console.log("Product deleted!");

        return true;
    } catch (error) {
        console.log("Not found5!");
        
        return false;
    }
}

async deleteProducts(cid) {
    try {
        await cartModel.updateOne({_id:cid}, {products:[]});
        console.log("Products deleted!");

        return true;
    } catch (error) {
        console.log("Not 6!");
        
        return false;
    }
}
}
export default CartManager;
