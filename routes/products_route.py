from flask import Blueprint,jsonify,request
from Producto import Producto
import os
from datetime import datetime
from clasesPersonales.Controles import controlar_nombre
bp_producto=Blueprint('producto',__name__,url_prefix='/api/productos')
#http://localhost:5000/api/productos

#http://localhost:5000/api/productos/get
"""Método de la API que permite recuperar todos los datos de los productos

Keyword arguments:
Sin argumentos
Return: 
Retorna un  json donde se tiene almacenado la lista de productos en la base de datos.
La forma jsons será {msg, data}
Donde msg es el mensaje de éxito. Y data es la lista de los productos
Exception:
Retorna un json con el formato {msg,error}
Donde msg es el mensaje para indicar el error y error es el mensaje de error en sí
"""

@bp_producto.route('/get',methods=['GET'])
def get_produtos():
    try:
        #creo una instancia para acceder a la base de datos
         catalogo=Producto()
         return jsonify({'msg':'Datos recuperados','data':catalogo.get_products()})
    except Exception as e:
        return jsonify({'msg':'Error al obtener los productos','error':e}),404
    finally:
        catalogo.cerrar_conexion()
   
#http://localhost:5000/api/productos/add
@bp_producto.route('/add',methods=['POST'])
def insertar_producto():
    try:
        catalogo=Producto()
        #Todos los datos del formulario, excluyendo a los archivos
        data=request.form
        #recupero los datos del archivo
        img=request.files['img']
        nombre_archivo=""
        controlar_nombre(data['name'])
        #reviso si la imagen existe
        if img:
            nombre_imagen=img.filename
            #obtiene la extensión (si es png, jpg, etc.)
            extension = os.path.splitext(nombre_imagen)[1]
            #la hora actual
            ahora=datetime.now()
            nombre_archivo=str(ahora.day)+str(ahora.month)+str(ahora.year)+str(ahora.hour)+str(ahora.minute)+str(ahora.second)+str(ahora.microsecond)+extension
        else:
            nombre_archivo=""
        
        if catalogo.insertar_producto(data['category'],data['name'],data['price'],data['stock'],data['description'],nombre_archivo):
            img.save(os.path.join('static/img/products/', nombre_archivo))
            return jsonify({'msg':'Producto insertado correctamente'})
        else:
            raise Exception("El producto no fue agregado satisfactoriamente")
    except Exception as e:
        return jsonify({'msg':'Error agregar el producto','error':str(e)}),404
    finally:
        catalogo.cerrar_conexion()

@bp_producto.route('/get_one/<int:id>',methods=['GET'])
def get_one(id=-1):
    try:
         catalogo=Producto()
         producto=catalogo.get_uno(id)
         return jsonify({'msg':'Producto recuperado','data':producto})
    except Exception as e:
        return jsonify({'msg':'Error al obtener el producto','error':str(e)}),404
    finally:
        catalogo.cerrar_conexion()
     
@bp_producto.route('/update',methods=['PUT'])
def actualizar():
    try:
        catalogo=Producto()
        data=request.form
        img=request.files['img']
        producto=catalogo.get_uno(int(data['id']))
        #controla que el producto exista
        if producto==None:
            raise Exception("El producto buscado no existe")
        #controla que se haya seleccionado una nueva imagen
        if img.filename!="":
         
            
            #obtengo el nombre de la imagen que reemplazará a la actual
            img_name=img.filename
            #obtengo la extensión de la imagen de reemplazo
            file_extension = os.path.splitext(img_name)[1]
            ahora=datetime.now()
            #le doy un nuevo nombre basado en dia,mes,año,hora,minuto,segundo y milisegundo actual
            file_name=str(ahora.day)+str(ahora.month)+str(ahora.year)+str(ahora.hour)+str(ahora.minute)+str(ahora.second)+str(ahora.microsecond)+file_extension
            resultado=catalogo.actualizar_producto(int(data['id']),data['category'],data['name'],data['price'],data['stock'],data['description'],file_name)
           
            #guardo la nueva imagen
            img.save(os.path.join('static/img/products/', file_name))
            
            #elimina la imagen anterior
            file_path = os.path.join('static/img/products/',producto['img'])
            if os.path.exists(file_path):
                os.remove(file_path)
            
            
        if img.filename=="":
             resultado=catalogo.actualizar_producto(int(data['id']),data['category'],data['name'],data['price'],data['stock'],data['description'])
            
        return jsonify({'msg':'Data actualizado','data':resultado})
    
    except Exception as e:
        return jsonify({'msg':'Error al actualizar el producto','error':str(e)}),404
    
    finally:
        catalogo.cerrar_conexion()
    
@bp_producto.route('/get_categorias',methods=['GET'])
def get_categorias():
    try:
         catalogo=Producto()
         return jsonify({'msg':'Datos recuperados','data':catalogo.get_categorias()})
    except Exception as e:
        return jsonify({'msg':'Error al obtener las categorias','error':e})
    finally:
        catalogo.cerrar_conexion()
        
@bp_producto.route('/delete/<int:id>',methods=['DELETE'])
def delete(id):
    try:
        catalogo=Producto()
        catalogo.eliminar(id)
        return jsonify({'msg':'Producto eliminado'})
    except Exception as e:
        raise e
    finally:
        catalogo.cerrar_conexion()
