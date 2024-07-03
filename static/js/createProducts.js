window.addEventListener('load',(e)=>{
    //con el 0 indico que no seleccione ninguna categoría en particular
    const formulariosAjax = document.querySelectorAll('.formularioAjax');
    formulariosAjax.forEach(formulario => {
        formulario.addEventListener('submit',crear_producto);
    });
    cargar_categorias(0)
})


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



function crear_producto(e){

    //evitamos que el formulario se envíe
    e.preventDefault();
	
    //ventana emergente para realizar la confirmación
    let send = confirm('Enviar Formulario'); 
    
    //si la confirmación es aceptada
    if(send==true){
        //creamos los datos tomando los datos del formulario.
        //Ese this hace referencia al formulario donde se produjo el evento submit
       
        let datos = new FormData(this);
            
        
        //recupero el método del formulario. Eso está en el atributo method del formulario
        let method = this.getAttribute('method');
        
        //recupero la url en donde enviaré los datos del formulario. Esa url es la que está en el atributo
        //action del formulario
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
            if (!respuesta.error){
                Swal.fire({
                    title: `${respuesta.msg}`,
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
                Swal.fire({
                    title: "Error al crear el producto",
                    text:`${respuesta.error.nombre}`,
                    allowOutsideClick:false,
                    confirmButtonText: "Continuar",
                    
                  })
            }
           
            
        })

    }

}
