import { productModel } from "./product.model.js";
import mongoose from "mongoose";

class ProductManager {
  async addProduct(product) {
    try {
        if (await this.validateCode(product.code)) {
            console.log("Error! Code exists!");

            return false;
        } else {
            await productModel.create(product)
            console.log("Product added!");

            return true;
        }
    } catch (error) {
        return false;
    }
}

async updateProduct(id, product) {
  try {
      if (this.validateId(id)) {   
          if (await this.getProductById(id)) {
              await productModel.updateOne({_id:id}, product);
              console.log("Product updated!");
  
              return true;
          }
      }
      
      return false;
  } catch (error) {
      console.log("Not found!");

      return false;
  }
}

async deleteProduct(id) {
  try {
      if (this.validateId(id)) {    
          if (await this.getProductById(id)) {
              await productModel.deleteOne({_id:id});
              console.log("Product deleted!");

              return true;
          }
      }

      return false;
  } catch (error) {
      console.log("Not found!");

      return false;
  }
}

async getProducts(params = {}) {
    let { limit = 10, page = 1, query = {}, sort = {} } = params;
    console.log("Query object:", query, "Type:", typeof query);

    sort = sort ? (sort === "asc" ? { price: 1 } : { price: -1 }) : {};

    try {
      let products = await productModel.paginate(query, {
        limit: limit,
        page: page,
        sort: sort,
        lean: true,
      });
      let status = products ? "success" : "error";
      let prevLink = products.hasPrevPage
        ? "http://localhost:8002/products?limit=" +
          limit +
          "&page=" +
          products.prevPage
        : null;
      let nextLink = products.hasNextPage
        ? "http://localhost:8002/products?limit=" +
          limit +
          "&page=" +
          products.nextPage
        : null;

      products = {
        status: status,
        payload: products.docs,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink,
      };

      console.log(products);
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        status: "error",
        payload: [],
      };
    }
  }
async getProductById(id) {
  if (this.validateId(id)) {
      return await productModel.findOne({_id:id}).lean() || null;
  } else {
      console.log("Not found!");
      
      return null;
  }
}

validateId(id) {
  return id.length === 24 ? true : false;
}

async validateCode(code) {
  return await productModel.findOne({code:code}) || false;
}
}



export default ProductManager;