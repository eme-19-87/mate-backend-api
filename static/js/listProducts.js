window.addEventListener('load',()=>{
   
    lista_productos()
    llenar_filtro_categoria()
})



/**
 * Permite crear la tabla con los datos de los productos
 * @param {Array} productos La lista de objetos que representan los productos
 */
function crear_tabla(productos){
    const $cuerpoTabla = document.querySelector("#tabla-productos");
    $cuerpoTabla.innerHTML=''
// Recorrer todos los productos
productos.forEach(producto => {
    // Crear un <tr>
    const $tr = document.createElement("tr");
    // Creamos el <td> de nombre y lo adjuntamos a tr
    let $tdNombre = document.createElement("td");
    $tdNombre.textContent = producto.name; // el textContent del td es el nombre
    $tr.appendChild($tdNombre);

    // El td de precio
    let $tdPrecio = document.createElement("td");
    $tdPrecio.textContent = producto.price;
    $tr.appendChild($tdPrecio);

    // El td del stock
    let $tdStock = document.createElement("td");
    $tdStock.textContent = producto.stock;
    $tr.appendChild($tdStock);

    //El td de la categoría
    let $tdCategoria= document.createElement("td");
    $tdCategoria.textContent = producto.category;
    $tr.appendChild($tdCategoria);

    //coloco el código que me permitirá ver los detalles del producto

    let detalles=document.createElement("td")
    let linkDetalle=document.createElement("a")
    let iconoOjo=document.createElement('i')
    iconoOjo.classList.add('fa-regular')
    iconoOjo.classList.add('fa-eye')
    linkDetalle.addEventListener('click',()=>{ver_detalles(producto.id)})
    linkDetalle.appendChild(iconoOjo)
    detalles.appendChild(linkDetalle)
    $tr.appendChild(detalles)

    //coloco el ícono que me permitirá ir a la ventana de actualización de los datos del producto
    let opcionActualizar=document.createElement("td")
    let linkActualizar=document.createElement("a")
    let iconoLibreta=document.createElement('i')
    iconoLibreta.classList.add('fa-regular')
    iconoLibreta.classList.add('fa-pen-to-square')
    linkActualizar.classList.add('color-edit')
    linkActualizar.appendChild(iconoLibreta)
    opcionActualizar.appendChild(linkActualizar)
    linkActualizar.href=`http://localhost:5000/admin/products/edit/${producto.id}`
    $tr.appendChild(opcionActualizar)

    //coloco el ícono que me permitirá eliminar el producto
    let opcionEliminar=document.createElement("td")
    let linkEliminar=document.createElement("a")
    let iconoTacho=document.createElement('i')
    iconoTacho.classList.add('fa-solid')
    iconoTacho.classList.add('fa-trash-can')
    iconoTacho.classList.add('color-delete')
    linkEliminar.appendChild(iconoTacho)
    opcionEliminar.appendChild(linkEliminar)
    linkEliminar.addEventListener('click',()=>{eliminar_producto(producto.id)})
    $tr.appendChild(opcionEliminar)
    // Finalmente agregamos el <tr> al cuerpo de la tabla
    $cuerpoTabla.appendChild($tr);
    // Y el ciclo se repite hasta que se termina de recorrer todo el arreglo
});
}

/**
 * 
 * @param {Integer} id El id de la categoria que se listará. 
 * Si no se pasan valores, se listarán todos los productos
 */
function lista_productos(id=-1){
    //la dirección de la API
    if(id<1){
         action='http://localhost:5000/api/productos/get'
    }else{
         action=`http://localhost:5000/api/productos/get_filtrar_categoria/${id}`
    }
   
    //Un objeto cabecera
    let encabezado = new Headers();

	//establezco las configuraciones para el envío
    let config = {
        method: "GET",
        headers: encabezado,
        mode:'cors',
        cache:'no-cache',
           
    }
    fetch(action,config)
    .then(respuesta => respuesta.json()) 
    .then(respuesta =>{
        //{msg:'algo',data:[lista]}
        crear_tabla(respuesta.data)
    })
}

/**
 * Permite ver los detalles de los productos
 * @param {Integer} producto_id El id del producto cuyos detalles se quieren mostrar
 */
function ver_detalles(producto_id){
    action=`http://localhost:5000/api/productos/get_one/${producto_id}`
    let encabezado = new Headers();

	//establezco las configuraciones para el envío
        let config = {
            method: "GET",
            headers: encabezado,
            mode:'cors',
            cache:'no-cache',
           
        }
        fetch(action,config)
        .then(respuesta => respuesta.json()) 
        .then(respuesta =>{
            
            
            Swal.fire({
                title: `${respuesta.data.name}`,
                icon: "info",
                html: `
                  <div class="container">
                        <div class="row">
                            <div class="col-6">
                                <p class="alert alert-success">
                                    Precio: ${respuesta.data.price}
                                </p>
                            </div>
                             <div class="col-6">
                                <p class="alert alert-success">
                                    Stock: ${respuesta.data.stock}
                                </p>
                            </div>

                            <div class="col-6">
                                <p class="alert alert-success">
                                    Categoria: ${respuesta.data.category}
                                </p>
                            </div>
                            <div class="col-12">
                                <p class="alert alert-success">
                                    Descripcion: ${respuesta.data.description}
                                </p>
                            </div>

                            <div class="col-12">
                              <img src="/static/img/products/${respuesta.data.img}">
                            </div>
                        </div>
                  </div>
                `,
                showCloseButton: true,
                showCancelButton: true,
                
              });
        })
}


function eliminar_producto(producto_id){
    action=`http://localhost:5000/api/productos/delete/${producto_id}`
    let encabezado = new Headers();

	//establezco las configuraciones para el envío
        let config = {
            method: "DELETE",
            headers: encabezado,
            mode:'cors',
            cache:'no-cache',
           
        }
        Swal.fire({
            title: "¿Quiere eliminar el producto?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Si",
            denyButtonText: `No`
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                fetch(action,config)
                .then(respuesta => respuesta.json()) 
                .then(respuesta =>{
                        if (!respuesta.error){
                            Swal.fire("Producto eliminado");
                            lista_productos()
                        }else{
                            Swal.fire(`Error ${e}`);
                            
                        }
                })
            }
          });
      
}

function llenar_filtro_categoria(){
    action='http://localhost:5000/api/productos/get_categorias'
    let encabezado=new Headers()
    let config = {
        method: "GET",
        headers: encabezado,
        mode:'cors',
        cache:'no-cache',
           
    }

    fetch(action,config)
    .then(respuesta=>respuesta.json())
    .then(respuesta=>{
        //respuesta es una lista de objeto javascript

        const selectCategorias=document.querySelector("#filtroCategoria")
        respuesta.data.forEach(categoria=>{
            let opcion=document.createElement('option')
            opcion.setAttribute('value',categoria.id)
            opcion.innerHTML=categoria.name
            selectCategorias.appendChild(opcion)
        })
        selectCategorias.addEventListener('change',(e)=>{
            lista_productos(e.target.value)
        })
    })
}