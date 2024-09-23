from flask import Blueprint,render_template, redirect, url_for, session
from flask_cors import cross_origin
from flask_login import login_required
# from datetime import datetime, timedelta
# from db_connection import mysql

# from models.ModelUser import ModelUser

#Entities
# from models.entities.User import User


# login_manager_app = Blueprint('login_manager_app', __name__)
# ruta_raiz = Blueprint('ruta_raiz', __name__)
# login_route = Blueprint('login_route', __name__)
# logout_route = Blueprint('logout_route', __name__)
# index_route = Blueprint('index_route', __name__)
control_route = Blueprint('control_route', __name__)
ventas_route = Blueprint('ventas_route', __name__)
compras_route = Blueprint('compras_route', __name__)
transferencias_route = Blueprint('transferencias_route', __name__)
kardex_route = Blueprint('kardex_route', __name__)
detalle_ventas_route = Blueprint('detalle_ventas_route', __name__)
modificacion_route = Blueprint('modificacion_route', __name__)
devolucion_compras_route = Blueprint('devolucion_compras_route', __name__)
devolucion_salidas_route = Blueprint('devolucion_salidas_route', __name__)
perdidas_route = Blueprint('perdidas_route', __name__) 
productos_route = Blueprint('productos_route', __name__) 
entradas_route = Blueprint('entradas_route', __name__) 
salidas_route = Blueprint('salidas_route', __name__) 
clientes_route = Blueprint('clientes_route', __name__) 
configuracion_route = Blueprint('configuracion_route', __name__) 
home_route = Blueprint('home_route', __name__) 
apertura_caja_route = Blueprint('apertura_caja_route', __name__) 
salidas_caja_route = Blueprint('salidas_caja_route', __name__) 


# @index_route.route('/index')
# @cross_origin()
# @login_required
# def index():
#     puesto = session.get('puesto')
#     identificacion_usuario = session.get('identificacion_usuario')
#     usuario_nombre = session.get('usuario_nombre')
#     if puesto == 200:
#         return redirect(url_for('control'))
#     else:
#         return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@control_route.route('/control')
@cross_origin()
@login_required
def control():
    puesto = session.get('puesto')
    if puesto == 200:
        return render_template('control.html')
    else:
        return render_template('index.html')
###########################################
@ventas_route.route('/ventas')
@cross_origin()
@login_required
def ventas():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    return render_template('ventas.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@compras_route.route('/compras')
@cross_origin()
@login_required
def compras():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201 and puesto != 202:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('compras.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@transferencias_route.route('/transferencias')
@cross_origin()
@login_required
def transferencias():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201 and puesto != 202:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('transferencias.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@kardex_route.route('/kardex')
@cross_origin()
@login_required
def kardex():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201 and puesto != 202:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('kardex.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@detalle_ventas_route.route('/detalle_ventas')
@cross_origin()
@login_required
def detalle_ventas():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('detalle_ventas.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@modificacion_route.route('/modificacion')
@cross_origin()
@login_required
def modificacion():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('modificacion.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@devolucion_compras_route.route('/devolucion_compras')
@cross_origin()
@login_required
def devolucion_compras():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201 and puesto != 202:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('devolucion_compras.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@devolucion_salidas_route.route('/devolucion_salidas')
@cross_origin()
@login_required
def devolucion_salidas():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201 and puesto != 202:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('devolucion_salidas.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@perdidas_route.route('/perdidas')
@cross_origin()
@login_required
def perdidas():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201 and puesto != 202:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('perdidas.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@productos_route.route('/productos')
@cross_origin()
@login_required
def productos():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201 and puesto != 202:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('productos.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@entradas_route.route('/entradas')
@cross_origin()
@login_required
def entradas():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('entradas.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@salidas_route.route('/salidas')
@cross_origin()
@login_required
def salidas():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('salidas.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@clientes_route.route('/clientes')
@cross_origin()
@login_required
def clientes():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201 and puesto != 202:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('clientes.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@configuracion_route.route('/configuracion')
@cross_origin()
@login_required
def configuracion():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201 and puesto != 202:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('configuracion.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@home_route.route('/home')
@cross_origin()
@login_required
def home():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('home.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@apertura_caja_route.route('/apertura_caja')
@cross_origin()
@login_required
def apertura_caja():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201 and puesto != 202:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('apertura_caja.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@salidas_caja_route.route('/salidas_caja')
@cross_origin()
@login_required
def salidas_caja():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto != 201 and puesto != 202:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
    else:
        return render_template('salidas_caja.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)