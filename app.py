from flask import Flask,redirect,url_for
from flask_cors import CORS
from routes.products_route import bp_producto
from routes.admin_routes import bp_admin
app=Flask(__name__)
CORS(app)
app.register_blueprint(bp_producto)
app.register_blueprint(bp_admin)

#permite que vaya directamente a la ventana del administador
@app.route('/',methods=['GET'])
def index():
    return redirect(url_for('admin.index'))
if __name__=='__main__':
    app.run(debug=True)