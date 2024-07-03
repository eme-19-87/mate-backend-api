from flask import Blueprint,render_template,redirect,url_for

bp_admin=Blueprint('admin',__name__,url_prefix='/admin/products')
#http://localhost:5000/admin/products
@bp_admin.route('/',methods=['GET'])
def index():
    return render_template('index.html')

#http://localhost:5000/admin/products/edit/13
@bp_admin.route('/edit/<int:id>',methods=['GET'])
def edit(id):
    if id<1:
        return redirect(url_for('index'))
    return render_template('update.html',id=id)

#http://localhost:5000/admin/products/create
@bp_admin.route('/create',methods=['GET'])
def create():
    return render_template('create.html')