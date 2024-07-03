// capturamos los formularios
const formulariosAjax = document.querySelectorAll('.formularioAjax');

function functionSendForm(e){

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
            console.log(respuesta)
        })

    }

}

formulariosAjax.forEach(formulario => {
    formulario.addEventListener('submit',functionSendForm);
})