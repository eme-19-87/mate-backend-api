export function establecer_errores(errores){
    console.log(errores)
    const nombreError=document.querySelector('#error-nombre')
    const precioError=document.querySelector('#error-precio')
    const stockError=document.querySelector('#error-stock')
    const imagenError=document.querySelector('#error-imagen')
    nombreError.innerHTML=""
    precioError.innerHTML=""
    stockError.innerHTML=""
    imagenError.innerHTML=""
    if(errores.nombre) nombreError.innerHTML=errores.nombre
    if(errores.precio) precioError.innerHTML=errores.precio
    if(errores.stock) stockError.innerHTML=errores.stock
    if(errores.imagen) imagenError.innerHTML=errores.imagen
}

export function ventana_mensajes(titulo,mensaje){
    Swal.fire({
        title: titulo,
        text:mensaje,

        
      })
}

