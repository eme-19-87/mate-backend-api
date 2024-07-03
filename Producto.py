from db import get_connector
import os

class Producto:
    def __init__(self):
        self.connector=get_connector()
        self.cursor=self.connector.cursor(dictionary=True)
        try:
            self.cursor.execute(f"Use mate")
        except Exception as e:
            raise e
    

    """Permite insertar un nuevo producto
    
    Keyword arguments:
    
    Return: Retorna una lista de diccionarios con los datos de los productos
    """
    
    def get_products(self):
        try:
            query="select products.name, products.price, products.stock, products.description,products.img,products.id,products.category_id,categories.name as category from products inner join categories on products.category_id=categories.id"
            self.cursor.execute(query)
            return self.cursor.fetchall()
        except Exception as e:
            raise e
      
    """Permite insertar un nuevo registro al producto
    
    Keyword arguments:
    categoria: integer -- El id de la categoría del producto
    nombre: string -- El nombre del producto
    precio: integer--El precio del producto
    stock: integer-- El stock del producto
    description: string--La descripción del producto
    image: string--El nombre de la imagen
    Return: retorna un entero que indica el número de filas afectadas. Si se insertó
    correctamente, devolverá un número.
    
    """
    
    def insertar_producto(self,categoria,nombre,precio,stock,descripcion,imagen):
        try:
            
            query="insert into products (category_id,name,price,stock,description,img) values (%s,%s,%s,%s,%s,%s)"
            valores=(int(categoria),nombre,float(precio),int(stock),descripcion,imagen)
            self.cursor.execute(query,valores)
            self.connector.commit()
            return self.cursor.lastrowid
        except Exception as e:
            self.connector.rollback()
            raise e
    
    
    """Permite obtener un producto
    
    Keyword arguments:
    categoria: integer -- El id de la categoría del producto
    nombre: string -- El nombre del producto
    precio: integer--El precio del producto
    stock: integer-- El stock del producto
    description: string--La descripción del producto
    image: string--El nombre de la imagen
    Return: retorna un entero que indica el número de filas afectadas. Si se insertó
    correctamente, devolverá un número.
    
    """   
    
    def get_uno(self,id):
        try:
            query="select products.name, products.price, products.stock, products.description,products.img,products.id,products.category_id,categories.name as category from products inner join categories on products.category_id=categories.id where products.id=%s"
            valor=list()
            valor.append(id)
            self.cursor.execute(query,valor)
            producto=self.cursor.fetchone()
            return producto
        except Exception as e:
            raise e
    
    """Permite insertar un nuevo registro al producto
    
    Keyword arguments:
    id: integer--El id del producto que se desea actualizar
    categoria: integer -- El id de la categoría del producto
    nombre: string -- El nombre del producto
    precio: integer--El precio del producto
    stock: integer-- El stock del producto
    description: string--La descripción del producto
    image: string--El nombre de la imagen
    Return: retorna un entero que indica el número de filas afectadas. Si se actualizó
    correctamente, devolverá un número."""
    
    
    def actualizar_producto(self,id,categoria,nombre,precio,stock,descripcion,imagen=None):
        try:
            #creo la query básica para modificar los datos
            query="update products set category_id=%s,name=%s,price=%s,stock=%s,description=%s"
            #creo la lista de valores para la query básica
            valores=list()
            valores.append(int(categoria))
            valores.append(nombre)
            valores.append(float(precio))
            valores.append(int(stock))
            valores.append(descripcion)
            #si existe una imagen nueva, la agrego a la query y a los valores para actualizarla
            if imagen!=None:
                query+=",img=%s"
                valores.append(imagen)
            
            #agrego la línea del where y el id del producto que actualizaré
            query+=" where id=%s"
            valores.append(int(id))
            self.cursor.execute(query,valores)
            self.connector.commit()
            return self.cursor.lastrowid
        except Exception as e:
            self.connector.rollback()
            raise e
    
    """Permite recuperar todas las categorias
    

    Return: retorna una lista de diccionarios con los datos de los productos
    """
    
    def get_categorias(self):
        try:
            self.cursor.execute("Select * from categories")
            return self.cursor.fetchall()
        except Exception as e:
            raise e
        
    """Permite filtrar todos los productos de una categoría determinada
    
    Keyword arguments:
    id: integer -- El id de la categoría que se va a filtrar
    Return: Retorna una lista con diccionarios que tienen la información de los productos
    que pertenecen a la categoría según el id
    """
    

    def get_filtrar_categoria(self,id):
        try:
            query="select products.name, products.price, products.stock, products.description,products.img,products.id,products.category_id,categories.name as category from products inner join categories on products.category_id=categories.id where categories.id=%s"
            value=list()
            value.append(id)
            self.cursor.execute(query,value)
            return self.cursor.fetchall()
        except Exception as e:
            raise e
    
    """Permite eliminar un producto de manera física según su id
    
    Keyword arguments:
    id:integer -- El id del producto a eliminar
    Return: retorna un entero para indicar las filas afectadas
    """
    
    def eliminar(self,id):
        try:
             query="delete from products where id=%s"
             value=list()
             value.append(id)
             self.cursor.execute(query,value)  
             self.connector.commit() 
             return self.cursor.lastrowid
        except Exception as e:
            raise e 
    
    """Permite controlar si ya existe un registro con un determinado nombre y sin tener 
    en cuenta el nombre del producto con el id pasado.
    Útil para controlar que, en la actualización, no se esté colocando un producto con 
    un nombre que ya existe en la base de datos.
    
    Keyword arguments:
    id: integer -- El id del producto
    nombre: string--El nombre del producto
    Return: retorna un diccionario si ya existe un producto con ese nombre y
    None en caso contrario. Ese None indica que el nombre nuevo o actualizado 
    puede usarse
    """
    
    def get_no_repetido_nombre_id(self,id,nombre):
        try:
             query="select products.id from products where id!=%s and name=%s"
             value=list()
             value.append(id)
             value.append(nombre)
             self.cursor.execute(query,value)
             producto=self.cursor.fetchone()
             return producto 
        except Exception as e:
            raise 
    
    """Permite controlar si ya existe un registro con un determinado nombre
    Útil para controlar que, en el alta de productos, no se esté colocando un 
    producto con un nombre que ya existe en la base de datos.
    
    Keyword arguments:
    id: integer -- El id del producto
    
    Return: retorna un diccionario si ya existe un producto con ese nombre y
    None en caso contrario. Ese None indica que el nombre nuevo o actualizado 
    puede usarse
    """
    def get_no_repetido_nombre(self,nombre):
        try:
             query="select products.id from products where name=%s"
             value=list()
             value.append(nombre)
             self.cursor.execute(query,value)
             producto=self.cursor.fetchone()
             return producto 
        except Exception as e:
            raise   
      
    """Cierra la conexión a la base de datos"""
      
    def cerrar_conexion(self):
        self.cursor.close()
        self.connector.close()