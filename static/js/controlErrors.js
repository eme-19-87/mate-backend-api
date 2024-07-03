function control_nombre(nombre){
    let msgError=""
    if (nombre==="") msgError="El nombre no debe quedar vacío"
}

function control_stock(stock){
    let msgError=""
    if (stock==="") msgError="Coloque un stock igual o mayor a cero"
    if(msgError==="" && parseInt(stock)<0) msgError="El stock no pude ser cero"
}

function control_precio(precio){
    let msgError=""
    if (precio==="") msgError="Coloque un precio mayor a cero"
    if(msgError==="" && parseInt(precio)<=0) msgError="El precio debe ser mayor a cero"
}

function control_imagen(imagen){
    
}