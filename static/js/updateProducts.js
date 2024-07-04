import { establecer_errores,ventana_mensajes} from "./controlErrors.js";

window.addEventListener('load',(e)=>{
    //recupero la ruta completa de la url
    const parameters = new URL(location.href);
    //creo un arreglo con las partes separadas por las / y el id estará en el último lugar
    const ruta=parameters.pathname.split('/');
    //recupero el id y lo intento convertir a entero
    const id=parseInt(ruta[ruta.length-1]);
    
   
    if (id===undefined){
          return window.location.href='http://localhost:5000/admin/products'
    }
     //controla un hidden input con el id del producto a actualizar
    //Si no está presente, no es un entero o no es menor o igual a cero
    //se muestra un mensaje de error y se redirecciona a la lista de productos
    const idTag=document.createElement('input');
    idTag.setAttribute('type','hidden');
    idTag.setAttribute('id','id');
    idTag.setAttribute('name','id');
    idTag.setAttribute('value',id);
    const formulariosAjax = document.querySelectorAll('.formularioAjax');
    
    formulariosAjax.forEach(formulario => {
        formulario.appendChild(idTag)
        formulario.addEventListener('submit',actualizar_producto);
    });
    cargar_datos_producto()
})

/**
 * Permite cargar las categorias al  desplegable. El parámetro pasado permite
 * establecer cuál categoría será seleccionada en el desplegable
 * @param {Integer} categoria_id El id de la categoria del producto cargado
 */
function cargar_categorias(categoria_id){
    let categorias=document.querySelector('#category')
    const action='http://localhost:5000/api/productos/get_categorias'
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

/**
 * Carga los datos del producto en el formulario
 */
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
            //cargo los datos al formulario y, si hay errores, redirijo a la lista
            //de productos.
            try {
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
            } catch (error) {
               return window.location.href='http://localhost:5000/admin/products'
            }
          
        })
}

/**
 * Permite enviar los datos del formulario a la API. Si hay errores, se mostrarán
 * en etiquetas dentro del formulario.
 * @param {Event} e Es el objeto de evento. En este caso, tendrá los datos del evento y 
 * del formulario
 */
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
            //controlo si respuesta tiene o no errores
            //si no los tiene, muestra los mensajes pertinentes para la actualización
            //de los productos
            if(!respuesta.error){
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
            }else{
                //si hay errores, los muestra y recarga los valores originales del
                //producto para no perderlos
                try {
                    let errores=JSON.parse(respuesta.error.replace(/'/g,'"'))
                    establecer_errores(errores)
                    cargar_datos_producto()
                } catch (error) {
                    ventana_mensajes('Error al actualizar el producto',respuesta.error)
                    cargar_datos_producto()
                }
              
            }
            
            
        })

    }

}

