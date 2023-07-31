import fs from "fs";

class ProductManager {
    constructor() {
        this.products = [];
        this.path = "Products.json";
        this.createFile();
    }

    createFile() {
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify(this.products));
        }
    }

    addProduct(product) {
        if (this.validateCode(product.code)) {
            console.log("Error! Code exists!");

            return false;
        } else {
            const producto = {id: this.generateId(), nombre: product.nombre, detalle: product.detalle, precio: product.precio, thumbnail: product.thumbnail, codigo: product.codigo, stock: product.stock, status: product.status};
            this.products = this.getProducts(); 
            this.products.push(producto); 
            this.saveProducts(); 
            console.log("Product added!");

            return true;
        }
    }
    

    updateProduct(id, product) {
        this.products = this.getProducts();
        let pos = this.products.findIndex(item => item.id === id);

        if (pos > -1) {
            this.products[pos].nombre = product.nombre;
            this.products[pos].detalle = product.detalle;
            this.products[pos].precio = product.precio;
            this.products[pos].thumbnail = product.thumbnail;
            this.products[pos].codigo = product.codigo;
            this.products[pos].stock = product.stock;
            this.products[pos].status = product.status;
            this.saveProducts();
            console.log("Producto Actualizado!");

            return true;
        } else {
            console.log("Not found!");

            return false;
        } 
    }

    deleteProduct(id) {
        this.products = this.getProducts();
        let pos = this.products.findIndex(item => item.id === id);

        if (pos > -1) {
            this.products.splice(pos, 1); (0,1)
            this.saveProducts();
            console.log("Product #" + id + " deleted!");

            return true;
        } else {
            console.log("Not found!");

            return false;
        }
    }

    getProducts() {
        let products = JSON.parse(fs.readFileSync(this.path, "utf-8"));

        return products;
    }

    getProductById(id) {
        this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));

        return this.products.find(item => item.id === id) || "Not found";
    }

    validateCode(code) {
        return this.products.some(item => item.code === code);
    }

    generateId() {
        let max = 0;
        let products = this.getProducts();
    
        products.forEach(item => {
            if (item.id > max) {
                max = item.id;
            }
        });
    
        return max + 1;
    }    

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products));
    }
}


export default ProductManager;