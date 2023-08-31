const crearCarrito = async () => {
    try {
        if (localStorage.getItem("carrito")) {
            const cartData = JSON.parse(localStorage.getItem("carrito"));
            console.log("Carrito existente:", cartData);
            return cartData;
        } else {
            const response = await fetch("/carts/", {
                method: "POST",
                headers: {"Content-type": "application/json; charset=UTF-8",  "Accept": "application/json" }
            });
            const data = await response.json();
            localStorage.setItem("carrito", JSON.stringify(data));
            console.log("Carrito creado:", data);

            return data;
        }
    } catch(error) {
        console.log("Error en Crear el Carrito! " + error);
    }
}


const obtenerIdCarrito = async () => {
    try {
        let cart = await crearCarrito();
    
        return cart.id;
    } catch(error) {
        console.log("Error en obtener el Id del Carrito! " + error);
    }
}

const agregarProductoAlCarrito = async (pid) => {
    try {
        let cid = await obtenerIdCarrito();
        console.log("ID del carrito:", cid);

        await fetch("/carts/" + cid + "/products/" + pid, {
            method: "POST",
            headers: {"Content-type": "application/json; charset=UTF-8","Accept": "application/json"}
        })
        .then(response => {
            console.log("Respuesta de la solicitud:", response); 
            return response.json();
        })
        .then(data => {
            console.log("Se agregó al Carrito!");
        });
    } catch(error) {
        console.log("Error en agregar el Producto al Carrito! " + error);
    }
}
