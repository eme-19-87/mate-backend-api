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
    

        
    def get_products(self):
        try:
            query="select products.name, products.price, products.stock, products.description,products.img,products.id,products.category_id,categories.name as category from products inner join categories on products.category_id=categories.id"
            self.cursor.execute(query)
            return self.cursor.fetchall()
        except Exception as e:
            raise e
      
        
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
            print(f"LLega hasta el return")
            return self.cursor.lastrowid
        except Exception as e:
            self.connector.rollback()
            print(f"Error en el modelo: {e}")
            raise e
    
    def get_categorias(self):
        try:
            self.cursor.execute("Select * from categories")
            return self.cursor.fetchall()
        except Exception as e:
            raise e
        
    def eliminar(self,id):
        try:
             query="delete from products where id=%s"
             value=list()
             value.append(id)
             self.cursor.execute(query,value)  
             self.connector.commit() 
        except Exception as e:
            raise e  
        
    def cerrar_conexion(self):
        self.cursor.close()
        self.connector.close()