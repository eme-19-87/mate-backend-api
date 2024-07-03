import mysql.connector

def get_connector():
    my_host='localhost'
    my_user='root'
    my_password=''
    return mysql.connector.connect(host=my_host,user=my_user,password=my_password)