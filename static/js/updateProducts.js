window.addEventListener('load',(e)=>{
    let idTag=document.querySelector('#id')
    if (idTag===null){
        Swal.fire({
            title: "El producto no se encontró",
            icon: "error"
          });
          return window.location.href='http://localhost:5000/admin/products'
    }
    const formulariosAjax = document.querySelectorAll('.formularioAjax');
    formulariosAjax.forEach(formulario => {
        formulario.addEventListener('submit',actualizar_producto);
    });
    cargar_datos_producto()
})


function cargar_categorias(categoria_id){
    let categorias=document.querySelector('#category')
    action='http://localhost:5000/api/productos/get_categorias'
	//creo la cabecera para enviar mis datos
        let encabezado = new Headers();
	//establezco las configuraciones para el envío
        let config = {
            method: 'GET',
            headers: encabezado,
            mode:'cors',
            cache:'no-cache',
           
        }
        fetch(action,config)
        .then(respuesta => respuesta.json()) 
        .then(respuesta =>{
            respuesta.data.forEach(categoria => {
                const opcion=document.createElement('option')
                opcion.value=categoria['id']
                opcion.text=categoria['name']
                if(categoria['id']===categoria_id) opcion.selected=true
                categorias.appendChild(opcion)
            });
        })

    
}

function cargar_datos_producto(){
    let idTag=document.querySelector('#id')

	
	//recupero el método del formulario
    let method = "GET";
	
	//recupero la url en donde enviaré los datos del formulario
    let action = `http://localhost:5000/api/productos/get_one/${idTag.value}`
	//creo la cabecera para enviar mis datos
    let encabezado = new Headers();
	//establezco las configuraciones para el envío
        let config = {
            method: method,
            headers: encabezado,
            mode:'cors',
            cache:'no-cache',
           
        }
        fetch(action,config)
        .then(respuesta => respuesta.json()) 
        .then(respuesta =>{
            const nombre=document.querySelector("[name='name']")
            const precio=document.querySelector("[name='price']")
            const stock=document.querySelector("[name='stock']")
            const descripcion=document.querySelector("[name='description']")
            const imgActual=document.querySelector("#imagenProductoActual")
            imgActual.setAttribute('src',`/static/img/products/${respuesta.data['img']}`)
            nombre.value=respuesta.data['name']
            precio.value=respuesta.data['price']
            stock.value=respuesta.data['stock']
            descripcion.value=respuesta.data['description']
            cargar_categorias(parseInt(respuesta.data['category']))
        })
}


function actualizar_producto(e){

    //evitamos que el formulario se envíe
    e.preventDefault();
	
    //ventana emergente para realizar la confirmación
    let send = confirm('Enviar Formulario'); 
    
    //si la confirmación es aceptada
    if(send==true){
	//creamos los datos tomando los datos del formulario.
	//Ese this hace referencia al formulario donde se produjo el evento submit
        let datos = new FormData(this);
	
	//recupero el método del formulario
        let method = this.getAttribute('method');
	
	//recupero la url en donde enviaré los datos del formulario
        let action = this.getAttribute('action')

	//creo la cabecera para enviar mis datos
        let encabezado = new Headers();
	//establezco las configuraciones para el envío
        let config = {
            method: method,
            headers: encabezado,
            mode:'cors',
            cache:'no-cache',
            body:datos,
           
        }
        fetch(action,config)
        .then(respuesta => respuesta.json()) 
        .then(respuesta =>{
            Swal.fire({
                title: "Producto Actualizado",
                text:"Por favor, haga click en el botón para continuar",
                allowOutsideClick:false,
                confirmButtonText: "Continuar",
                
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  return window.location.href='http://localhost:5000/admin/products'
                } 
              });
            
        })

    }

}

