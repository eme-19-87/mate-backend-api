import os
from Producto import Producto

"""Controla si el string pasado puede ser tratado como un número real

Keyword arguments:
s:String -- el string que queremos comprobar si puede ser tratado como número real
Return: Un booleano. Será True si puede convertirse el string a real y False en caso
contrario.
"""

def flotante_valido(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

"""Controla si el string pasado puede ser tratado como un número entero

Keyword arguments:
s:String -- el string que queremos comprobar si puede ser tratado como número entero
Return: Un booleano. Será True si puede convertirse el string a entero y False en caso
contrario.
"""
def entero_valido(s):
    try:
        int(s)
        return True
    except ValueError:
        return False

"""Controla si el nombre del producto cumple el formato requerido

Keyword arguments:
nombre:String -- el nombre del producto recuperado del formulario
Return: Un string. Estará vacío si no hay errores. En caso contrario, tendrá el mensaje
de error
"""   
def controlar_nombre(nombre,id):
    error=""
    catalogo=Producto()
    producto=None
    if id!=0:
        producto=catalogo.get_no_repetido_nombre_id(id,nombre)
    else:
        producto=catalogo.get_no_repetido_nombre(nombre)
    
    if producto!=None:
        error="El nombre que se quiere ingresar ya existe"
    if error=="" and nombre=="":
        error="El nombre no debe ser vacío"
    return error

"""Controla si el precio del producto cumple el formato requerido

Keyword arguments:
precio:String -- el precio del producto recuperado del formulario
Return: Un string. Estará vacío si no hay errores. En caso contrario, tendrá el mensaje
de error
"""   
def controlar_precio(precio):
    error=""
    if precio=="":
        error="El precio no debe quedar vacío"
    if error=="" and not flotante_valido(precio):
        error="El valor ingresado debe ser un número real"
    if error=="" and float(precio)<=0:
        error="El precio debe ser mayor a cero"
    
    return error

"""Controla si el stock del producto cumple el formato requerido

Keyword arguments:
stock:String -- el stock del producto recuperado del formulario
Return: Un string. Estará vacío si no hay errores. En caso contrario, tendrá el mensaje
de error
"""      
def controlar_stock(stock):
    error=""
    if stock=="":
        error="El stock no debe quedar vacío"
    if error=="" and not entero_valido(stock):
        error="El stock debe ser un número entero mayor o igual a cero"
    if error=="" and int(stock)<0:
        error="El stock debe ser mayor a cero"
    
    return error

"""Controla si la imagen del producto cumple el formato requerido

Keyword arguments:
nombre_imagen:String -- el nombre de la imagen del producto recuperado del formulario
Return: Un string. Estará vacío si no hay errores. En caso contrario, tendrá el mensaje
de error
"""   
def controlar_imagen(nombre_imagen,actualizar=False):
    error=""
    #controla que el nombre de la imagen está vacía y que no sea una actualización
    #con esto evitamos que se deje un producto sin imágenes
    if nombre_imagen=="" and not actualizar:
        error="Debe colocar una imagen al producto"
    
    #si no hay errores para el caso anterior, obtengo la extensión de la imagen
    if error=="":
        extension = os.path.splitext(nombre_imagen)[1]
    
    #si no hubo errores y la extensión no cumple los requisitos, informo que debe ser
    #del tipo de extensión señalado  
    if error=="" and extension!="" and extension!=".jpg" and extension!='.jpeg' and extension!='.png':
        error="La imagen debe ser jpg, jpeg o png"
  
    
    return error
"""Controla que todos los campos del formulario cumplan sus respectivos formatos

Keyword arguments:
nombre:String -- el nombre del producto recuperado del formulario
precio:String -- el precio del producto recuperado del formulario
stock:String -- el stock del producto recuperado del formulario
nombre_imagen:String -- el nombre de la imagen del producto recuperado del formulario
actualizar:Boolean--define si se controla para una actualización del producto o no. 
Tendrá un valor falso por defecto, indicando que no se trata de una actualización.

Return: Un diccionario. Estará vacío si no hay errores. En caso contrario, tendrá un par
clave-valor donde la clave será el nombre del campo (nombre, stock, precio, etc) y el
valor será el mensaje de error para ese campo.
"""   
def control_campos(nombre,precio,stock,nombre_imagen,producto_id=0,actualizar=False):
    dict_errors={}
    error_nombre=controlar_nombre(nombre,producto_id)
    error_precio=controlar_precio(precio)
    error_stock=controlar_stock(stock)
    error_imagen=controlar_imagen(nombre_imagen,actualizar)
    if error_nombre!="":
        dict_errors["nombre"]=error_nombre
    
    if error_precio!="":
        dict_errors["precio"]=error_precio
    
    if error_stock!="":
        dict_errors["stock"]=error_stock
    
    if error_imagen!="":
        dict_errors["imagen"]=error_imagen
    
    if dict_errors:
        print(dict_errors)
        return dict_errors
    else:
        return False