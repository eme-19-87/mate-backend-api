from flask import Blueprint,render_template,redirect,url_for

bp_admin=Blueprint('admin',__name__,url_prefix='/admin/products')

@bp_admin.route('/',methods=['GET'])
def index():
    return render_template('index.html')

@bp_admin.route('/edit/<int:id>',methods=['GET'])
def edit(id):
    if id<1:
        return redirect(url_for('index'))
    return render_template('update.html',id=id)

@bp_admin.route('/create',methods=['GET'])
def create():
    return render_template('create.html')