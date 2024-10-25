from flask import Flask,render_template, request, redirect, url_for, flash, session, jsonify
# from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin
from flask_login import LoginManager, login_user, logout_user, login_required
# from werkzeug.security import generate_password_hash
from db_connection import init_app, mysql
#from flask_wtf.csrf import CSRFProtect

# from routes.clientes_routes import clientes_conteo, clientes_tabla, clientes_LS, clientes_proveedores, clientes_graficos_clientes, clientes_individual_id, clientes_crud, clientes_control, clientes_remove
import routes.clientes_routes as clientes_
import routes.productos_routes as productos_
import routes.entradas_routes as entradas_
import routes.salidas_routes as salidas_
import routes.transferencias_routes as transferencias_
import routes.perdidas_routes as perdidas_
import routes.creditos_routes as credito_
import routes.categorias_route as categorias_
import routes.numeracion_routes as numeracion_
import routes.ventas_routes as ventas_
import routes.usuarios_routes as usuarios_
import routes.gastos_route as gastos_
import routes.caja_routes as caja_
import routes.sucursales_routes as sucursales_
#Models
from models.ModelUser import ModelUser

#Entities
from models.entities.User import User


app = Flask(__name__)

# Configuraciones de seguridad y CORS
app.secret_key = 'hola_calichinski'
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Inicialización de la base de datos MySQL
init_app(app)

# Configuración del Login Manager
login_manager_app = LoginManager(app)

# Registrar el blueprint de clientes
# app.register_blueprint(clientes_bp)
##########################################################################################################################################################################
# Datos de la tabla clientes y base de datos almacen_central
##########################################################################################################################################################################
app.register_blueprint(clientes_.clientes_conteo)
app.register_blueprint(clientes_.clientes_tabla)
app.register_blueprint(clientes_.clientes_LS)
app.register_blueprint(clientes_.clientes_proveedores)
app.register_blueprint(clientes_.clientes_graficos_clientes)
app.register_blueprint(clientes_.clientes_individual_id)
app.register_blueprint(clientes_.clientes_crud)
app.register_blueprint(clientes_.clientes_control)
app.register_blueprint(clientes_.clientes_remove)
##########################################################################################################################################################################
# Datos de la tabla PRODUCTOS y base de datos almacen_central
##########################################################################################################################################################################
app.register_blueprint(productos_.productos_conteo)
app.register_blueprint(productos_.productos_tabla)
app.register_blueprint(productos_.productos_LS)
app.register_blueprint(productos_.productos_stock_sucursal)
app.register_blueprint(productos_.productos_individual_id)
app.register_blueprint(productos_.productos_individual_stock_suc_id)
app.register_blueprint(productos_.productos_extraccion_csv)
app.register_blueprint(productos_.productos_actualizar_saldos)
app.register_blueprint(productos_.productos_individual_stock_id)
app.register_blueprint(productos_.productos_individual_datos_id)
app.register_blueprint(productos_.productos_individual_stock_suc_cod)
app.register_blueprint(productos_.productos_modificacion)
app.register_blueprint(productos_.productos_registros_post)
app.register_blueprint(productos_.productos_modificacion_post)
app.register_blueprint(productos_.productos_remove)
##########################################################################################################################################################################
# Datos de la tabla ENTRADAS y base de datos entradas
##########################################################################################################################################################################
app.register_blueprint(entradas_.entradas_conteo)
app.register_blueprint(entradas_.entradas_tabla)
app.register_blueprint(entradas_.entradas_suma_devoluciones_mes)
app.register_blueprint(entradas_.entradas_extraccion_csv)
app.register_blueprint(entradas_.entradas_id_kardex)
app.register_blueprint(entradas_.entradas_comprobante)
app.register_blueprint(entradas_.entradas_delete)
app.register_blueprint(entradas_.entradas_devolucion_post)
app.register_blueprint(entradas_.entradas_recompra_grupal_post)
app.register_blueprint(entradas_.entradas_compras_grupal_get_post)
##########################################################################################################################################################################
# Datos de la tabla SALIDAS y base de datos salidas
##########################################################################################################################################################################
app.register_blueprint(salidas_.salidas_conteo)
app.register_blueprint(salidas_.salidas_tabla)
app.register_blueprint(salidas_.salidas_tabla_reporte)
app.register_blueprint(salidas_.salidas_reporte_usuarios)
app.register_blueprint(salidas_.salidas_suma_ventas_mes)
app.register_blueprint(salidas_.salidas_suma_total_sucursal_mes)
app.register_blueprint(salidas_.salidas_suma_ventas_dia_sucursal)
app.register_blueprint(salidas_.salidas_suma_devoluciones_mes)
app.register_blueprint(salidas_.salidas_top_ventas)
app.register_blueprint(salidas_.salidas_categorias_suc)
app.register_blueprint(salidas_.salidas_productos_suc)
app.register_blueprint(salidas_.salidas_cod_kardex_id)
app.register_blueprint(salidas_.salidas_extraccion_csv)
app.register_blueprint(salidas_.salidas_comprobante)
app.register_blueprint(salidas_.salidas_delete)
app.register_blueprint(salidas_.procesar_devolucion_salidas_post)
app.register_blueprint(salidas_.salidas_gestion_ventas_post)
##########################################################################################################################################################################
# Datos de la tabla TRANSFERENCIAS
##########################################################################################################################################################################
app.register_blueprint(transferencias_.transferencias_conteo)
app.register_blueprint(transferencias_.transferencias_tabla)
app.register_blueprint(transferencias_.transferencias_conteo_s)
app.register_blueprint(transferencias_.transferencias_tabla_s)
app.register_blueprint(transferencias_.transfrencias_kardex_id)
app.register_blueprint(transferencias_.productos_transferencias)
app.register_blueprint(transferencias_.productos_transferencias_p)
##########################################################################################################################################################################
# Datos de la tabla PERDIDAS
##########################################################################################################################################################################
app.register_blueprint(perdidas_.perdidas_conteo)
app.register_blueprint(perdidas_.perdidas_tabla)
app.register_blueprint(perdidas_.perdidas_kardex_id)
app.register_blueprint(perdidas_.perdidas_perdida_post)
##########################################################################################################################################################################
# Datos de la tabla CREDITOS
##########################################################################################################################################################################
app.register_blueprint(credito_.credito_comprobante)
app.register_blueprint(credito_.credito_reporte_dos)
app.register_blueprint(credito_.aperturar_creditos_post)
app.register_blueprint(credito_.credito_operar_creditos)
app.register_blueprint(credito_.creditos_delete)
##########################################################################################################################################################################
# Datos de la tabla CATEGORÍAS
##########################################################################################################################################################################
app.register_blueprint(categorias_.categorias_conteo)
app.register_blueprint(categorias_.categorias_tabla)
app.register_blueprint(categorias_.categorias_get)
app.register_blueprint(categorias_.categorias_post)
app.register_blueprint(categorias_.categorias_delete)
##########################################################################################################################################################################
# Datos de la tabla NUMERACIÓN_COMPROBANTE
##########################################################################################################################################################################
app.register_blueprint(numeracion_.numeracion_comprobante_control)
app.register_blueprint(numeracion_.numeracion_comprobante)
app.register_blueprint(numeracion_.numeracion_comprobante_post)
app.register_blueprint(numeracion_.numeracion_comprobante_delete)
app.register_blueprint(numeracion_.numeracion_comprobante_datos)
app.register_blueprint(numeracion_.numeracion_comprobante_datos_post)    
##########################################################################################################################################################################
# Datos de la tabla DETALLE VENTAS
##########################################################################################################################################################################
app.register_blueprint(ventas_.ventas_conteo)
app.register_blueprint(ventas_.ventas_tabla)
app.register_blueprint(ventas_.ventas_clientes_reporte)
app.register_blueprint(ventas_.ventas_tabla_reporte)
app.register_blueprint(ventas_.ventas_grafico)
app.register_blueprint(ventas_.ventas_comprobante)
app.register_blueprint(ventas_.ventas_cliente_conteo)
app.register_blueprint(ventas_.ventas_delete)
##########################################################################################################################################################################
# Datos de la tabla USUARIOS
##########################################################################################################################################################################
app.register_blueprint(usuarios_.usuarios_conteo)
app.register_blueprint(usuarios_.usuarios_tabla)
app.register_blueprint(usuarios_.usuarios_tabla_local)
app.register_blueprint(usuarios_.usuarios_busqueda)
app.register_blueprint(usuarios_.usuarios_post)
app.register_blueprint(usuarios_.usuarios_passw_post)
app.register_blueprint(usuarios_.usuarios_acciones_post)
app.register_blueprint(usuarios_.usuarios_registro_post)
app.register_blueprint(usuarios_.usuarios_registro_interno_post)
app.register_blueprint(usuarios_.usuarios_delete)
##########################################################################################################################################################################
# Datos de la tabla gastos_varios
##########################################################################################################################################################################
app.register_blueprint(gastos_.gastos_conteo)
app.register_blueprint(gastos_.gastos_tabla)
app.register_blueprint(gastos_.gastos_pago_mercancias)
app.register_blueprint(gastos_.gastos_suma_mes)
app.register_blueprint(gastos_.gastos_suma_mes_suc)
app.register_blueprint(gastos_.gastos_post)
app.register_blueprint(gastos_.gastos_delete)
##########################################################################################################################################################################
# Datos de la tabla caja
##########################################################################################################################################################################
app.register_blueprint(caja_.caja_conteo)
app.register_blueprint(caja_.caja_tabla)
app.register_blueprint(caja_.caja_tabla_diario)
app.register_blueprint(caja_.caja_individual_id)
app.register_blueprint(caja_.caja_post)
app.register_blueprint(caja_.caja_delete)
##########################################################################################################################################################################
# Datos de la tabla sucursales
##########################################################################################################################################################################
app.register_blueprint(sucursales_.sucursales_conteo)
app.register_blueprint(sucursales_.sucursales_tabla)
app.register_blueprint(sucursales_.sucursales_consolidacion_efectivo)
app.register_blueprint(sucursales_.sucursales_get)
app.register_blueprint(sucursales_.sucursales_index)
app.register_blueprint(sucursales_.sucursales_post)
app.register_blueprint(sucursales_.sucursales_create_control_post)
app.register_blueprint(sucursales_.sucursales_edit_control)

# fin distribución de funciones <---------|

#----------------------------------------------------------------------

# distribución de páginas web |--------->

@login_manager_app.user_loader
def load_user(id):
    session['username'] = id
    return ModelUser.get_by_id(mysql, str(id))

@app.route('/')
@cross_origin()
def main():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
@cross_origin()
def login():

    if request.method=='POST':
        user = User(0,0,0,0,request.json['username'],0,0,0,request.json['password'],0,0)
        #username y password son datos del formulario del html
        logged_user=ModelUser.login(mysql,user)
        if logged_user is not None:
            if logged_user.passw:
                login_user(logged_user)
                return redirect(url_for('index'))
            else:
                flash("Usuario o contraseña no econtrado")    
                return render_template('login.html')
        else:
            flash("Usuario o contraseña no econtrado")    
            return render_template('login.html')
    else:
        return render_template('login.html')


@app.route('/logout')
@cross_origin()
def logout():
    session.clear()
    logout_user()
    return redirect(url_for('login'))

@app.route('/api/datos_usuario')
@cross_origin()
@login_required
def datos_usuario():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    return jsonify({
                        "id_usuario": identificacion_usuario,
                        "nombre_usuario": usuario_nombre,
                        "puesto_usuario": puesto,
                    })

@app.route('/index')
@cross_origin()
@login_required
def index():
    puesto = session.get('puesto')
    if puesto == 200:
        return redirect(url_for('control'))
    return render_template('index.html')

@app.route('/control')
@cross_origin()
@login_required
def control():
    puesto = session.get('puesto')
    if puesto == 200:
        return render_template('control.html')
    return render_template('index.html')
###########################################
@app.route('/ventas')
@cross_origin()
@login_required
def ventas():
    return render_template('ventas.html')
@app.route('/compras')
@cross_origin()
@login_required
def compras():
    puesto = session.get('puesto')
    if puesto not in (201, 202):
        return render_template('index.html')
    return render_template('compras.html')
@app.route('/transferencias')
@cross_origin()
@login_required
def transferencias():
    puesto = session.get('puesto')
    if puesto not in (201, 202):
        return render_template('index.html')
    return render_template('transferencias.html')
@app.route('/kardex')
@cross_origin()
@login_required
def kardex():
    puesto = session.get('puesto')
    if puesto not in (201, 202):
        return render_template('index.html')
    return render_template('kardex.html')
@app.route('/detalle_ventas')
@cross_origin()
@login_required
def detalle_ventas():
    puesto = session.get('puesto')
    if puesto != 201:
        return render_template('index.html')
    return render_template('detalle_ventas.html')
@app.route('/modificacion')
@cross_origin()
@login_required
def modificacion():
    puesto = session.get('puesto')
    if puesto != 201:
        return render_template('index.html')
    return render_template('modificacion.html')
@app.route('/devolucion_compras')
@cross_origin()
@login_required
def devolucion_compras():
    puesto = session.get('puesto')
    if puesto not in (201, 202):
        return render_template('index.html')
    return render_template('devolucion_compras.html')
@app.route('/analisis')
@cross_origin()
@login_required
def analisis():
    puesto = session.get('puesto')
    if puesto not in (201, 202):
        return render_template('index.html')
    return render_template('analisis.html')
@app.route('/perdidas')
@cross_origin()
@login_required
def perdidas():
    puesto = session.get('puesto')
    if puesto not in (201, 202):
        return render_template('index.html')
    return render_template('perdidas.html')
@app.route('/productos')
@cross_origin()
@login_required
def productos():
    puesto = session.get('puesto')
    if puesto not in (201, 202):
        return render_template('index.html')
    return render_template('productos.html')
@app.route('/entradas')
@cross_origin()
@login_required
def entradas():
    puesto = session.get('puesto')
    if puesto != 201:
        return render_template('index.html')
    return render_template('entradas.html')
@app.route('/salidas')
@cross_origin()
@login_required
def salidas():
    puesto = session.get('puesto')
    if puesto != 201:
        return render_template('index.html')
    return render_template('salidas.html')
@app.route('/clientes')
@cross_origin()
@login_required
def clientes():
    puesto = session.get('puesto')
    if puesto not in (201, 202):
        return render_template('index.html')
    return render_template('clientes.html')
@app.route('/configuracion')
@cross_origin()
@login_required
def configuracion():
    puesto = session.get('puesto')
    if puesto not in (201, 202):
        return render_template('index.html')
    return render_template('configuracion.html')
@app.route('/home')
@cross_origin()
@login_required
def home():
    puesto = session.get('puesto')
    if puesto != 201:
        return render_template('index.html')
    return render_template('home.html')
@app.route('/apertura_caja')
@cross_origin()
@login_required
def apertura_caja():
    puesto = session.get('puesto')
    if puesto not in (201, 202):
        return render_template('index.html')
    return render_template('apertura_caja.html')
@app.route('/salidas_caja')
@cross_origin()
@login_required
def salidas_caja():
    puesto = session.get('puesto')
    if puesto not in (201, 202):
        return render_template('index.html')
    return render_template('salidas_caja.html')
###########################################
def status_401(error):
    if error:
        return redirect(url_for('login'))

def status_404(error):
    if error:
        return f"<h1>Página no encontrada</h1>{error}", 404

if __name__ == '__main__':
    #csrf.init_app(app)
    app.register_error_handler(401, status_401)
    app.register_error_handler(404, status_404)
    app.run(None, 3000, True)