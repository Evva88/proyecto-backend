import { Router } from "express";
import ProductManager from "../ProductManager.js"

const produtsRouter = Router();
const PM = new ProductManager();


produtsRouter.get("/", (req, res) => {
    const products = PM.getProducts();
    let {limit} = req.query;
    res.send({products:limit ? products.slice(0, limit) : products});
});

produtsRouter.get("/:pid", (req, res) => {
    const products = PM.getProducts();
    let pid = Number(req.params.pid);

    res.send({product:products.find(item => item.id === pid) || "Error! el Productos no existe"});
})

produtsRouter.post("/", (req, res) =>{
    let {nombre,detalle,precio,thumbnail,codigo,stock,status} = req.body;

    if(!nombre) {res.status(400).send({status:"error", message:"Error! No se cargó el campo Nombre!"});
    return false;};

    if(!detalle) {res.status(400).send({status:"error", message:"Error! No se cargó el campo detalle!"});
    return false;};

    if(!precio) {res.status(400).send({status:"error", message:"Error! No se cargó el campo precio!"});
    return precio;};

    if(!codigo) {res.status(400).send({status:"error", message:"Error! No se cargó el campo codigo!"});
    return false;};

    if(!stock) {res.status(400).send({status:"error", message:"Error! No se cargó el campo stock!"});
    return false;};

    status = !status && true;

    if (!thumbnail) {
        res.status(400).send({status:"error", message:"Error! No se cargó el campo Thumbnail!"});
        return false;
    } else if ((!Array.isArray(thumbnail)) || (thumbnail.length == 0)) {
        res.status(400).send({status:"error", message:"Error! Debe ingresar al menos una imagen en el Array Thumbnail!"});
        return false;
    }

    if (PM.addProduct({nombre, detalle, precio, codigo, stock, status, thumbnail})){
        res.send({status:"ok", message:"El Producto se agregó correctamente!"});
    } else{
        res.status(500).send({status:"error", message:"Error! No se pudo agregar el Producto!"});
    }
});

produtsRouter.put("/:pid", (req, res) => {
    let pid = Number(req.params.pid);
    let { nombre, detalle, precio, thumbnail, codigo, stock, status } = req.body;

    
    if (!nombre) {
    res.status(400).send({status:"error", message:"Error! No se cargó el campo nombre!"});
    return false;
    }
    
    if (!detalle) {
    res.status(400).send({status:"error", message:"Error! No se cargó el campo detalle!"});
    return false;
    }
    
    if (!precio) {
    res.status(400).send({status:"error", message:"Error! No se cargó el campo precio!"});
    return false;
    }
    
    if (!codigo) {
    res.status(400).send({status:"error", message:"Error! No se cargó el campo codigo!"});
    return false;
    }
    
    status = !status && true;
    
    if (!stock) {
    res.status(400).send({status:"error", message:"Error! No se cargó el campo Stock!"});
    return false;
    }
    
    if (!thumbnail) {
    res.status(400).send({status:"error", message:"Error! No se cargó el campo Thumbnails!"});
    return false;
        } else if ((!Array.isArray(thumbnail)) || (thumbnail.length == 0)) {
            res.status(400).send({status:"error", message:"Error! Debe ingresar al menos una imagen en el Array Thumbnails!"});
            return false;
        }
    
    if (PM.updateProduct(pid, {nombre, detalle, precio, codigo, status, stock, thumbnail})) {
    res.send({status:"ok", message:"El Producto se actualizó correctamente!"});
        } else {
            res.status(500).send({status:"error", message:"Error! No se pudo actualizar el Producto!"});
        }
    });

produtsRouter.delete("/:pid", (req, res) => {
    let pid = Number(req.params.pid);
    
    if (PM.deleteProduct(pid)) {
            res.send({status:"ok", message:"El Producto se eliminó correctamente!"});
        } else {
            res.status(500).send({status:"error", message:"Error! No se pudo eliminar el Producto!"});
        }
    });


export default produtsRouter;
