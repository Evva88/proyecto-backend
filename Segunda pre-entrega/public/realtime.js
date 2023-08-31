const socket = io(); 
socket.on("vistaProductos", (productos) => {
  updateProductList(productos);
  });
  
  function updateProductList(products){
    let div = document.getElementById("product-list");
    let productos = " ";

    products.forEach((product) => {
      productos+= `<article class="container">
                   <div class="card">
                   <div class="imgBx">
                   <img src="${product.img}" width="150"/>
                   </div>
                   <div class="contentBx">
                   <h2>${product.nombre}</h2>
                   <div class="size">
                   <h3>${product.detalle}</h3>
                   </div>
                   <div class="color">
                   <h3>$${product.precio}</h3>
                   </div>
                   <a href="#">Comprar ahora</a>
                   </div>
                   </div>
                   </article>`;
      
  });
  div.innerHTML= productos;
  }

let form = document.getElementById("formProduct");
form.addEventListener("submit", (data) =>{
  data.preventDefault();

      let nombre = form.elements.nombre.value;
      let detalle = form.elements.detalle.value;
      let stock = form.elements.stock.value;
      let precio = form.elements.precio.value;
      let img = form.elements.img.value;
      let codigo = form.elements.codigo.value;

    socket.emit("addProduct",{
      nombre,
      detalle,
      stock,
      precio,
      img,
      codigo,
    });
      
 form.reset();

});

document.getElementById("delete-btn").addEventListener("click", function () {
  const deleteidinput = document.getElementById("id-prod");
  const deleteid = parseInt(deleteidinput.value);
  socket.emit("deleteProduct", deleteid);
  deleteidinput.value = "";
});
  