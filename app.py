from flask import Flask
from flask_cors import CORS
from routes.products_route import bp_producto
from routes.admin_routes import bp_admin
app=Flask(__name__)
CORS(app)
app.register_blueprint(bp_producto)
app.register_blueprint(bp_admin)

if __name__=='__main__':
    app.run(debug=True)