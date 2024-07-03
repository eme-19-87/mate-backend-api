import {establecer_errores} from "/static/js/controlErrors.js";

window.addEventListener('load',(e)=>{
    //Recupera el formulario para el agregado de producto y le establece 
    //el escuchador para el evento submit
    //Este ejemplo es para recorrer varios formularios con la misma clase
    const formulariosAjax = document.querySelectorAll('.formularioAjax');
    formulariosAjax.forEach(formulario => {
        formulario.addEventListener('submit',confirmar_envio);
    });
    cargar_categorias(0)
})

/**
 * 
 * @param {Integer} categoria_id El id de la categoria que sirve para seleccionar una
 * categoría en cuestión.
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
 * Permite mostrar una ventana de confirmación previo al envío del formulario
 * @param {Event} e El objeto Event que se creo al momento de hacer submit en el formulario
 */
function confirmar_envio(e){
    e.preventDefault()
    Swal.fire({
        title: "¿Desea dar de alta el producto?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Sí",
        denyButtonText: `No`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          crear_producto(e)
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
}

/**
 * Permite crear un nuevo producto con los datos enviados del formulario
 * @param {Event} e El objeto evento que se creo cuando se realizó el submit del formulario
 */
function crear_producto(e){	
    
        //creamos los datos tomando los datos del formulario.
        //Ese this hace referencia al formulario donde se produjo el evento submit
       
        let datos = new FormData(e.target);
            
        
        //recupero el método del formulario. Eso está en el atributo method del formulario
        let method = e.target.getAttribute('method');
        
        //recupero la url en donde enviaré los datos del formulario. Esa url es la que está en el atributo
        //action del formulario
        let action = e.target.getAttribute('action')

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
            //controla si la respuesta devuelta tiene o no errores
            //si no los tiene, mostrará los mensajes de la creación de productos
            if(!respuesta.error){
                Swal.fire({
                    title: `${respuesta.msg}`,
                    text:"Por favor, haga click en el botón para continuar",
                    allowOutsideClick:false,
                    confirmButtonText: "Continuar",
                    
                  }).then((result) => {
                    /*Cuando el usuario confirme, se redirige a la lista de productos */
                    if (result.isConfirmed) {
                      return window.location.href='http://localhost:5000/admin/products'
                    } 
                  });
            }else{
                //Aquí se viene si hubo errores al dar de alta el formulario
                //si el error puede ser convertido en json, es posible que sean
                //los errores de los campos del formulario. Los convierto a json
                //y paso a mostrarlos en el formulario
                try {
                    let errores=JSON.parse(respuesta.error.replace(/'/g,'"'))
                    establecer_errores(errores)
                } catch (error) {
                    //si no pueden ser convertidos a json, muestro esos errores 
                    //en una ventana emergente

                    Swal.fire({
                        title:"Error al crear el producto",
                        text: `${respuesta.error}`,
                        
                      })
                }
                
               
            }
           
            
        })

    }



