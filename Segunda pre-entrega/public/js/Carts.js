const createCart = async () => {
  try {
    if (!localStorage.getItem("carts")) {
      const response = await fetch("/api/carts/", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });

      const data = await response.json();
      localStorage.setItem("cart", JSON.stringify(data));
    }
  } catch (error) {
    console.log("Error en Crear el Carrito! " + error);
  }
};

const obtenerIdCarrito = async () => {
  try {
    await createCart();
    let cart = JSON.parse(localStorage.getItem("cart"));
    console.log("Carrito obtenido:", cart);

    if (cart && cart.id) {
      return cart.id;
    } else {
      console.log("El carrito no tiene un ID válido.");
    }
  } catch (error) {
    console.log("Error en obtener el Id del Carrito! " + error);
  }
};

const addProduct = async (pid) => {
  try {
    let cid = await obtenerIdCarrito();
    console.log("Verificando IDs:", cid, pid);
    const response = await fetch("/api/carts/" + cid + "/products/" + pid, {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });

    const data = await response.json(); 

    if (response.ok) {
      console.log("Se agregó al Carrito!", data);
    } else {
      console.log(
        "Error en agregar el Producto al Carrito! Status:",
        response.status,
        data
      ); 
    }
  } catch (error) {
    console.log("Error en agregar el Producto al Carrito! " + error);
  }
};
