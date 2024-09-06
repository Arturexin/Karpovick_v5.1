from flask import Flask,render_template, jsonify, request, redirect, url_for, flash, session
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin
#from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager, login_user, logout_user, login_required
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

#Models
from models.ModelUser import ModelUser

#Entities
from models.entities.User import User


    
app= Flask(__name__)


app.secret_key ='hola_calichinski'
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'karpovick_uno'
mysql = MySQL(app)

login_manager_app = LoginManager(app)
##########################################################################################################################################################################
# Datos de la tabla clientes y base de datos almacen_central
##########################################################################################################################################################################
@app.route('/api/clientes_conteo')
@cross_origin()
@login_required
def getAllClientesConteo():
    try:
        usuarioLlave = session.get('usernameDos')

        nombre_persona = request.args.get('nombre_persona')
        clase_persona = request.args.get('clase_persona')
        dni_persona = request.args.get('dni_persona')
        email_persona = request.args.get('email_persona')
        telefono_persona = request.args.get('telefono_persona')
        usuario_persona = request.args.get('usuario_persona')
        fecha_inicio_persona_str = request.args.get('fecha_inicio_persona')
        fecha_fin_persona_str = request.args.get('fecha_fin_persona')
        
        fecha_inicio_persona = datetime.strptime(fecha_inicio_persona_str, '%Y-%m-%d')
        fecha_fin_persona = datetime.strptime(fecha_fin_persona_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) "
                     "FROM clientes "
                     "JOIN usuarios ON clientes.usuario_cli = usuarios.id "
                     "WHERE identificador_cli = %s "
                     "AND nombre_cli LIKE %s "
                     "AND dni_cli LIKE %s "
                     "AND email_cli LIKE %s "
                     "AND telefono_cli LIKE %s "
                     "AND nombres LIKE %s "
                     "AND clase_cli = %s "
                     "AND fecha_cli >= %s AND fecha_cli < %s")
            
            data_params = (usuarioLlave, f"%{nombre_persona}%", f"%{dni_persona}%", f"%{email_persona}%", f"%{telefono_persona}%", 
                           f"%{usuario_persona}%", clase_persona, fecha_inicio_persona, fecha_fin_persona + timedelta(days=1))
            
            cur.execute(query, data_params)
            data = cur.fetchone()[0]
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clientes_tabla/<int:numero>')
@cross_origin()
@login_required
def getAllClientes(numero):
    try:
        usuarioLlave = session.get('usernameDos')

        nombre_persona = request.args.get('nombre_persona')
        clase_persona = request.args.get('clase_persona')
        dni_persona = request.args.get('dni_persona')
        email_persona = request.args.get('email_persona')
        telefono_persona = request.args.get('telefono_persona')
        usuario_persona = request.args.get('usuario_persona')
        fecha_inicio_persona_str = request.args.get('fecha_inicio_persona')
        fecha_fin_persona_str = request.args.get('fecha_fin_persona')
        
        fecha_inicio_persona = datetime.strptime(fecha_inicio_persona_str, '%Y-%m-%d')
        fecha_fin_persona = datetime.strptime(fecha_fin_persona_str, '%Y-%m-%d')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id_cli, nombre_cli, dni_cli, email_cli, telefono_cli, direccion_cli, nombres, clase_cli, fecha_cli "
                     "FROM clientes "
                     "JOIN usuarios ON clientes.usuario_cli = usuarios.id "
                     "WHERE identificador_cli = %s "
                     "AND nombre_cli LIKE %s "
                     "AND dni_cli LIKE %s "
                     "AND email_cli LIKE %s "
                     "AND telefono_cli LIKE %s "
                     "AND nombres LIKE %s "
                     "AND clase_cli = %s "
                     "AND fecha_cli >= %s AND fecha_cli < %s "
                     "ORDER BY id_cli ASC "
                     "LIMIT 20 OFFSET %s")
            
            data_params = (usuarioLlave, f"%{nombre_persona}%", f"%{dni_persona}%", f"%{email_persona}%", f"%{telefono_persona}%", 
                           f"%{usuario_persona}%", clase_persona, fecha_inicio_persona, fecha_fin_persona + timedelta(days=1), numero)
            
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            content = {
                'id_cli': fila[0],
                'nombre_cli': fila[1],
                'dni_cli': fila[2],
                'email_cli': fila[3],
                'telefono_cli': fila[4],
                'direccion_cli': fila[5],
                'nombres': fila[6],
                'clase_cli': fila[7],
                'fecha_cli': fila[8].strftime('%d-%m-%Y')
            }
            resultado.append(content)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/clientes_ventas')#CLIENTES, INDEX
@cross_origin()
@login_required
def getAllClientesVentas():
    try:
        usuarioLlave = session.get('usernameDos')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id_cli, nombre_cli, dni_cli, email_cli, telefono_cli, direccion_cli "
                     "FROM clientes "
                     "WHERE `identificador_cli` = %s AND clase_cli LIKE %s")
            cur.execute(query, (usuarioLlave, '0'))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            content = {
                'id_cli': fila[0],
                'nombre_cli': fila[1],
                'dni_cli': fila[2],
                'email_cli': fila[3],
                'telefono_cli': fila[4],
                'direccion_cli': fila[5]
            }
            resultado.append(content)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/proveedores')
@cross_origin()
@login_required
def getAllProveedores():
    try:
        usuarioLlave = session.get('usernameDos')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id_cli, nombre_cli "
                     "FROM clientes "
                     "WHERE `identificador_cli` = %s AND clase_cli LIKE %s")
            cur.execute(query, (usuarioLlave, '1'))
            data = cur.fetchall()
            
        resultado = []
        for fila in data:
            content = {
                'id_cli': fila[0],
                'nombre_cli': fila[1]
            }
            resultado.append(content)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/clientes_mes')
@cross_origin()
@login_required
def getAllClientesMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha_cli) AS mes, SUM(CASE WHEN clase_cli = 0 THEN 1 ELSE 0 END) AS suma_clientes, "
                     "SUM(CASE WHEN clase_cli = 1 THEN 1 ELSE 0 END) AS suma_proveedores "
                     "FROM clientes "
                     "WHERE `identificador_cli` = %s "
                     " AND YEAR(fecha_cli) = %s "
                     " GROUP BY mes")
            cur.execute(query,(usuarioLlave, year_actual))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            content = {
                'mes': fila[0],
                'suma_clientes': fila[1],
                'suma_proveedores': fila[2]
            }
            resultado.append(content)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/clientes/<int:id_cli>')
@cross_origin()
def getClientes(id_cli):
    try:
        with mysql.connection.cursor() as cur:
            query = ("SELECT id_cli, nombre_cli, dni_cli, email_cli, telefono_cli, direccion_cli, usuario_cli, clase_cli, fecha_cli "
                     "FROM clientes "
                     "WHERE id_cli = %s ")
            cur.execute(query, (id_cli,))
            data = cur.fetchall()

        content = {}
        for fila in data:
            content = {
                'id_cli': fila[0],
                'nombre_cli': fila[1],
                'dni_cli': fila[2],
                'email_cli': fila[3],
                'telefono_cli': fila[4],
                'direccion_cli': fila[5],
                'usuario_cli': fila[6],
                'clase_cli': fila[7],
                'fecha_cli': fila[8]
            }
        return jsonify(content)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/clientes', methods=['POST'])
@cross_origin()
def createClientes():
    if 'id_cli' in request.json:
        updateCliente()
    else:
        createCliente()
    return 'ok'

def createCliente():
    usuarioLlave = session.get('usernameDos')
    usuarioId = session.get('identificacion_usuario')
    try:
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `clientes` (`id_cli`, `nombre_cli`, `dni_cli`, `email_cli`, `telefono_cli`, `direccion_cli`, `usuario_cli`, `clase_cli`, `fecha_cli`, `identificador_cli`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['nombre_cli'], request.json['dni_cli'], request.json['email_cli'], request.json['telefono_cli'], 
                    request.json['direccion_cli'], usuarioId, request.json['clase_cli'], request.json['fecha_cli'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Persona creada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def updateCliente():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `clientes` SET `nombre_cli` = %s, `dni_cli` = %s, `email_cli` = %s, `telefono_cli` = %s, `direccion_cli` = %s, `clase_cli` = %s "
                     "WHERE `clientes`.`id_cli` = %s "
                     "AND identificador_cli = %s")
            data =(request.json['nombre_cli'], request.json['dni_cli'], request.json['email_cli'], request.json['telefono_cli'], request.json['direccion_cli'], 
                   request.json['clase_cli'], request.json['id_cli'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Persona actualizada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@app.route('/api/clientes_control', methods=['POST'])##Control
@cross_origin()
def crearClienteControl():
    current_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    try:
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `clientes` (`id_cli`, `nombre_cli`, `dni_cli`, `email_cli`, `telefono_cli`, `direccion_cli`, `usuario_cli`, `clase_cli`, `fecha_cli`, `identificador_cli`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['nombre_cli'], request.json['dni_cli'], request.json['email_cli'], request.json['telefono_cli'], 
                    request.json['direccion_cli'], request.json['usuario_cli'], request.json['clase_cli'], current_date, request.json['usuario_cli'])
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Persona creada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@app.route('/api/clientes/<int:id_cli>', methods=['DELETE'])
@cross_origin()
def removeClientes(id_cli):
    try:
        with mysql.connection.cursor() as cur:
            query = "DELETE FROM `clientes` WHERE `clientes`.`id_cli` = %s"
            cur.execute(query, (id_cli,))
            mysql.connection.commit()
        
        return "Cliente Eliminado"
    except Exception as e:
        return jsonify({'error': str(e)}), 500
##########################################################################################################################################################################
# Datos de la tabla PRODUCTOS y base de datos almacen_central
##########################################################################################################################################################################
@app.route('/api/almacen_central_conteo')
@cross_origin()
@login_required
def getAllProductosConteo():
    try:
        usuarioLlave = session.get('usernameDos')
        
        categoria_producto = request.args.get('categoria_producto')
        codigo_producto = request.args.get('codigo_producto')
        descripcion_producto = request.args.get('descripcion_producto')
        proveedor_producto = request.args.get('proveedor_producto')

        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) "
                        "FROM almacen_central "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN clientes ON almacen_central.proveedor = clientes.id_cli "
                        "WHERE `identificadorProd` = %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND descripcion LIKE %s "
                        "AND nombre_cli LIKE %s ")
            data_params = (usuarioLlave, f"{categoria_producto}%", f"{codigo_producto}%", f"%{descripcion_producto}%", f"%{proveedor_producto}%")
            cur.execute(query, data_params)
            data = cur.fetchone()[0]
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/almacen_central_tabla/<int:numero>')
@cross_origin()
@login_required
def getAllProductos(numero):
    try:
        usuarioLlave = session.get('usernameDos')
        
        categoria_producto = request.args.get('categoria_producto')
        codigo_producto = request.args.get('codigo_producto')
        descripcion_producto = request.args.get('descripcion_producto')
        proveedor_producto = request.args.get('proveedor_producto')

        with mysql.connection.cursor() as cur:
            query = ("SELECT idProd, categoria_nombre, codigo, descripcion, talla, costo_unitario, precio_venta, lote, nombre_cli, existencias_ac, existencias_su, existencias_sd, existencias_st "
                        "FROM almacen_central "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN clientes ON almacen_central.proveedor = clientes.id_cli "
                        "WHERE identificadorProd = %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND descripcion LIKE %s "
                        "AND nombre_cli LIKE %s "
                        "ORDER BY idProd ASC "
                        "LIMIT 20 OFFSET %s")
            data_params = (usuarioLlave, f"{categoria_producto}%", f"{codigo_producto}%", f"%{descripcion_producto}%", f"%{proveedor_producto}%", numero)
            cur.execute(query, data_params)
            data = cur.fetchall()
        
        resultado = []
        for fila in data:
            contenido = { 
                'idProd': fila[0],
                'categoria_nombre': fila[1],
                'codigo': fila[2], 
                'descripcion': fila[3], 
                'talla': fila[4],
                'costo_unitario': fila[5],
                'precio_venta': fila[6], 
                'lote':fila[7], 
                'nombre_cli': fila[8],
                'existencias_ac':fila[9],
                'existencias_su':fila[10],
                'existencias_sd':fila[11],
                'existencias_st':fila[12]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###--------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/almacen_central_ccd')#categoría, código, descripción
@cross_origin()
@login_required
def getAllCCD():
    try:
        usuarioLlave = session.get('usernameDos')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT idProd, categoria, codigo, descripcion "
                     "FROM almacen_central "
                     "WHERE `identificadorProd` = %s")
            cur.execute(query, (usuarioLlave,))
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = {
                'idProd': fila[0],
                'categoria': fila[1],
                'codigo': fila[2], 
                'descripcion': fila[3]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

@app.route('/api/almacen_central_stock_sucursal')#Productos
@cross_origin()
@login_required
def getSumaStockSucursal():
    try:
        usuarioLlave = session.get('usernameDos')

        with mysql.connection.cursor() as cur:
            query = ("SELECT SUM(existencias_ac * costo_unitario) AS almacen_central, "
                     "SUM(existencias_su * costo_unitario ) AS sucursal_uno, "
                     "SUM(existencias_sd * costo_unitario) AS sucursal_dos, "
                     "SUM(existencias_st * costo_unitario) AS sucursal_tres "
                     "FROM `almacen_central` "
                     "WHERE `identificadorProd` = %s")
            cur.execute(query, (usuarioLlave,))
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'almacen_central': fila[0],
                'sucursal_uno': fila[1],
                'sucursal_dos': fila[2],
                'sucursal_tres': fila[3]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/almacen_central/<int:idProd>')#Entradas, Productos, Salidas
@cross_origin()
@login_required
def getProductos(idProd):
    try:
        with mysql.connection.cursor() as cur:
            query = ("SELECT idProd, existencias_ac, existencias_su, existencias_sd, existencias_st "
                     "FROM almacen_central "
                     "WHERE idProd = %s")
            cur.execute(query, (idProd,))
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                'idProd': fila[0],
                'existencias_ac':fila[1],
                'existencias_su':fila[2],
                'existencias_sd':fila[3],
                'existencias_st':fila[4]
                }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/almacen_central_id_sucursal_datos/<int:idProd>')#VENTAS, Perdidas
@cross_origin()
@login_required
def getProductosSucursal(idProd):
    try:
        sucursal_get = request.args.get('sucursal_get')
        if sucursal_get not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        with mysql.connection.cursor() as cur:
            query = (f"SELECT idProd, talla, costo_unitario, precio_venta, {sucursal_get} "
                     "FROM almacen_central "
                     "WHERE idProd = %s")
            cur.execute(query, (idProd,))
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                'idProd': fila[0],
                'talla':fila[1],
                'costo_unitario':fila[2],
                'precio_venta':fila[3],
                'sucursal_get':fila[4]
                }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/productos_extraccion')#Productos para formato CSV
@cross_origin()
@login_required
def getProductosExtraccion():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = (   "SELECT categoria_nombre, codigo, descripcion, talla, costo_unitario, precio_venta, lote, nombre_cli, existencias_ac, existencias_su, existencias_sd, existencias_st "
                        "FROM almacen_central "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN clientes ON almacen_central.proveedor = clientes.id_cli "
                        "WHERE identificadorProd = %s "
                        "ORDER BY idProd ASC ")
            data_params = (usuarioLlave, )
            cur.execute(query, data_params)
            data = cur.fetchall()
        
        resultado = []
        for fila in data:
            contenido = {
                'categoria_nombre': fila[0],
                'codigo': fila[1], 
                'descripcion': fila[2], 
                'talla': fila[3],
                'costo_unitario': fila[4],
                'precio_venta': fila[5], 
                'lote':fila[6], 
                'nombre_cli': fila[7],
                'existencias_ac':fila[8],
                'existencias_su':fila[9],
                'existencias_sd':fila[10],
                'existencias_st':fila[11]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
@app.route('/api/almacen_central_datos')
@cross_origin()
@login_required
def getProductosSucursalDos():
    try:
        # Obtener el parámetro de la sucursal
        sucursal_get = request.args.get('sucursal_get')
        if sucursal_get not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400

        # Obtener el parámetro de los IDs
        ids_param = request.args.get('ids')
        if not ids_param:
            return jsonify({"status": "error", "message": "No se proporcionaron IDs"}), 400

        # Convertir los IDs en una lista
        ids = ids_param.split(',')
        
        # Construir la consulta SQL
        query = (f"SELECT idProd, talla, costo_unitario, precio_venta, {sucursal_get} "
                 "FROM almacen_central "
                 "WHERE idProd IN (%s)" % ','.join(['%s'] * len(ids)))
        
        with mysql.connection.cursor() as cur:
            cur.execute(query, ids)
            data = cur.fetchall()

        # Crear una lista para almacenar los resultados
        resultados = []
        for fila in data:
            contenido = {
                'idProd': fila[0],
                'talla': fila[1],
                'costo_unitario': fila[2],
                'precio_venta': fila[3],
                'sucursal_get': fila[4]
            }
            resultados.append(contenido)

        return jsonify(resultados)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/almacen_central_codigo_doble_sucursal/<int:id_busqueda>')#Transferencias
@cross_origin()
@login_required
def getProductosDos(id_busqueda):
    try:
        usuarioLlave = session.get('usernameDos')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT idProd, categoria, descripcion, existencias_ac, existencias_su, existencias_sd, existencias_st "
                     "FROM almacen_central "
                     "WHERE `identificadorProd` = %s "
                     "AND idProd = %s")
            data_params = (usuarioLlave, f"{id_busqueda}%")
            cur.execute(query, data_params)
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                        'idProd': fila[0],
                        'categoria': fila[1],
                        'descripcion': fila[2],
                        'existencias_ac':fila[3],
                        'existencias_su':fila[4],
                        'existencias_sd':fila[5],
                        'existencias_st':fila[6]
                        }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/almacen_central_id_sucursal/<int:id_busqueda>')#COMPRAS, MODIFICACIÓN
@cross_origin()
@login_required
def getProductosDosSucursal(id_busqueda):
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_get = request.args.get('sucursal_get')
        if sucursal_get not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        
        with mysql.connection.cursor() as cur:
            query = (f"SELECT idProd, categoria, codigo, descripcion, talla, costo_unitario, precio_venta, lote, proveedor, {sucursal_get} "
                    "FROM almacen_central "
                    "WHERE `identificadorProd` = %s "
                    "AND idProd = %s")
            data_params = (usuarioLlave, f"{id_busqueda}")
            cur.execute(query, data_params)
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                        'idProd': fila[0],
                        'categoria': fila[1],
                        'codigo': fila[2], 
                        'descripcion': fila[3], 
                        'talla': fila[4],
                        'costo_unitario': fila[5],
                        'precio_venta': fila[6], 
                        'lote':fila[7], 
                        'proveedor': fila[8],
                        'sucursal_get': fila[9],
                        }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/almacen_central_codigo_sucursal/<string:codigo>')#DEVOLUCIONES
@cross_origin()
@login_required
def getProductosTresSucursal(codigo):
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_get = request.args.get('sucursal_get')
        if sucursal_get not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        
        with mysql.connection.cursor() as cur:
            query = (f"SELECT idProd, {sucursal_get} "
                    "FROM almacen_central "
                    "WHERE `identificadorProd` = %s "
                    "AND codigo LIKE %s")
            data_params = (usuarioLlave, f"{codigo}%")
            cur.execute(query, data_params)
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                        'idProd': fila[0],
                        'sucursal_get': fila[1]
                        }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/almacen_central', methods=['POST'])##Compras-Registro
@cross_origin()
@login_required
def saveProductos():
    if 'idProd' in request.json:
        upDateProductos()
    else:
        createProductos()
    return "ok"

def createProductos():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `almacen_central` "
                     "(`idProd`, `categoria`, `codigo`, `descripcion`, `talla`, `costo_unitario`, `precio_venta`, `lote`, `proveedor`, `existencias_ac`, `existencias_su`, `existencias_sd`, `existencias_st`, `identificadorProd`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['categoria'], request.json['codigo'], request.json['descripcion'], request.json['talla'],
                    request.json['costo_unitario'], request.json['precio_venta'], request.json['lote'], request.json['proveedor'],
                    request.json['existencias_ac'], request.json['existencias_su'], request.json['existencias_sd'],
                    request.json['existencias_st'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Producto creado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
def upDateProductos():
    try:
        sucursal_post = request.json['sucursal_post']
        usuarioLlave = session.get('usernameDos')
        
        if sucursal_post not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        
        with mysql.connection.cursor() as cur:
            query = (f"UPDATE `almacen_central` SET `categoria` = %s, `codigo` = %s, `descripcion` = %s, `talla` = %s, `costo_unitario` = %s, `precio_venta` = %s, `lote` = %s, `proveedor` = %s, {sucursal_post} = %s "
                     "WHERE `almacen_central`.`idProd` = %s "
                     "AND identificadorProd = %s")
            data = (request.json['categoria'], request.json['codigo'], request.json['descripcion'], request.json['talla'], 
                    request.json['costo_unitario'], request.json['precio_venta'], request.json['lote'], request.json['proveedor'], 
                    request.json['existencias_post'], request.json['idProd'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Producto actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@app.route('/api/almacen_central_categorias', methods=['POST'])##Configuración
@cross_origin()
@login_required
def upDateProductosCategorias():
    try:
        usuarioLlave = session.get('usernameDos')

        with mysql.connection.cursor() as cur:
            query = ("UPDATE `almacen_central` SET `categoria` = %s, `codigo` = %s, `talla` = %s "
                     "WHERE `almacen_central`.`idProd` = %s "
                     "AND identificadorProd = %s")
            data = (request.json['categoria'], request.json['codigo'], request.json['talla'], request.json['idProd'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Producto actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@app.route('/api/almacen_central/<int:idProd>', methods=['DELETE'])
@cross_origin()
@login_required
def removeProductos(idProd):
    try:
        with mysql.connection.cursor() as cur:
            query = "DELETE FROM `almacen_central` WHERE `almacen_central`.`idProd` = %s"
            cur.execute(query, (idProd,))
            mysql.connection.commit()
        return "Producto eliminado"
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/procesar_transferencia', methods=['POST'])##Transferencias, Productos
@cross_origin()
@login_required
def operarTransferencia():
    try:
        sucursal_post = request.json['sucursal_post']
        sucursal_post_dos = request.json['sucursal_post_dos']
        
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')

        if sucursal_post and sucursal_post_dos not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        
        with mysql.connection.cursor() as cur:
            query_productos = (f"UPDATE `almacen_central` SET {sucursal_post} = %s,  {sucursal_post_dos} = %s"
                     "WHERE `almacen_central`.`idProd` = %s "
                     "AND identificadorProd = %s")
            data_productos = (request.json['existencias_post'], request.json['existencias_post_dos'], request.json['idProd'], usuarioLlave)
            cur.execute(query_productos, data_productos)
            mysql.connection.commit()

            query_transferencias = ("INSERT INTO `transfrencias` "
                                    "(`id_tran`, `id_suc_origen`, `id_suc_destino`, `id_prod`, `cantidad`, `comprobante`, `id_usuario`, `fecha_tran`, `identificador_tran`) "
                                    "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s)");
            data_transferencias = (request.json['id_suc_origen'], request.json['id_suc_destino'], request.json['idProd'], request.json['cantidad'], request.json['comprobante'], 
                                usuarioId, request.json['fecha_tran'], usuarioLlave)
            cur.execute(query_transferencias, data_transferencias)
            mysql.connection.commit()

        return jsonify({"status": "success", "message": "Catidades actualizadas correctamente."}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
##########################################################################################################################################################################
# Datos de la tabla ENTRADAS y base de datos entradas
##########################################################################################################################################################################
@app.route('/api/entradas_conteo')
@cross_origin()
@login_required
def getAllEntradasConteo():
    try:
        usuarioLlave = session.get('usernameDos')

        sucursal_entradas = request.args.get('sucursal_entradas')
        categoria_entradas = request.args.get('categoria_entradas')
        codigo_entradas = request.args.get('codigo_entradas')
        comprobante_entradas = request.args.get('comprobante_entradas')
        fecha_inicio_entradas_str = request.args.get('fecha_inicio_entradas')
        fecha_fin_entradas_str = request.args.get('fecha_fin_entradas')
        
        fecha_inicio_entradas = datetime.strptime(fecha_inicio_entradas_str, '%Y-%m-%d')
        fecha_fin_entradas = datetime.strptime(fecha_fin_entradas_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) "
                        "FROM entradas "
                        "JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `entradas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "WHERE `identificadorEntr` = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND fecha >= %s AND fecha < %s ")
            data_params = (usuarioLlave, f"{sucursal_entradas}%", f"{categoria_entradas}%", f"{codigo_entradas}%", f"{comprobante_entradas}%", 
                            fecha_inicio_entradas, fecha_fin_entradas + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/entradas_tabla/<int:numero>')
@cross_origin()
@login_required
def getAllEntradas(numero):
    try:
        usuarioLlave = session.get('usernameDos')
        
        sucursal_entradas = request.args.get('sucursal_entradas')
        categoria_entradas = request.args.get('categoria_entradas')
        codigo_entradas = request.args.get('codigo_entradas')
        comprobante_entradas = request.args.get('comprobante_entradas')
        fecha_inicio_entradas_str = request.args.get('fecha_inicio_entradas')
        fecha_fin_entradas_str = request.args.get('fecha_fin_entradas')
        
        fecha_inicio_entradas = datetime.strptime(fecha_inicio_entradas_str, '%Y-%m-%d')
        fecha_fin_entradas = datetime.strptime(fecha_fin_entradas_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT idEntr, sucursal_nombre, categoria_nombre, codigo, costo_unitario, existencias_entradas, comprobante, fecha, existencias_devueltas "
                        "FROM entradas "
                        "JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `entradas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "WHERE identificadorEntr = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND fecha >= %s AND fecha < %s "
                        "ORDER BY idEntr ASC "
                        "LIMIT 20 OFFSET %s")
            data_params = (usuarioLlave, f"{sucursal_entradas}%", f"{categoria_entradas}%", f"{codigo_entradas}%", f"{comprobante_entradas}%", 
                            fecha_inicio_entradas, fecha_fin_entradas + timedelta(days=1), numero)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'idEntr': fila[0],
                'sucursal_nombre': fila[1],
                'categoria_nombre': fila[2],
                'codigo': fila[3],
                'costo_unitario': fila[4],
                'existencias_entradas':fila[5],
                'comprobante': fila[6],
                'fecha': fila[7].strftime('%d-%m-%Y'),
                'existencias_devueltas': fila[8]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/entradas_suma_compras_recompras_mes')#COMPRAS
@cross_origin()
@login_required
def getSumaComprasRecomprasMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, "
                     "SUM(CASE WHEN comprobante LIKE %s THEN(existencias_entradas - existencias_devueltas) * costo_unitario ELSE 0 END) AS suma_compra, "
                     "SUM(CASE WHEN comprobante LIKE %s THEN(existencias_entradas - existencias_devueltas) * costo_unitario ELSE 0 END) AS suma_recompra "
                     "FROM entradas "
                     "JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorEntr` = %s AND YEAR(fecha) = %s GROUP BY mes")
            data_params = ('Compra%', 'Recompra%', usuarioLlave, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'suma_compra': fila[1],
                'suma_recompra': fila[2]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/entradas_suma_total_mes')#HOME
@cross_origin()
@login_required
def getSumaTotalEntradasMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, "
                     "SUM((existencias_entradas - existencias_devueltas) * costo_unitario) AS suma_total_entradas "
                     "FROM entradas JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorEntr` = %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal")
            data_params = (usuarioLlave, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'suma_total_entradas': fila[2]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/entradas_suma_total_pasado')#HOME
@cross_origin()
@login_required
def getSumaTotalEntradasPasado():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT sucursal, "
                     "SUM((existencias_entradas - existencias_devueltas) * costo_unitario) AS suma_total_entradas_pasado "
                     "FROM entradas "
                     "JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorEntr` = %s "
                     "AND YEAR(fecha) < %s "
                     "GROUP BY sucursal")
            data_params = (usuarioLlave, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'sucursal': fila[0],
                'suma_total_entradas_pasado': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/entradas_suma_transferencias_mes')#TRANSFERENCIAS
@cross_origin()
@login_required
def getSumaTransferenciasEntradasMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, "
                     "SUM((existencias_entradas - existencias_devueltas) * costo_unitario) AS suma_transferencias_entradas "
                     "FROM entradas "
                     "JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorEntr` = %s "
                     "AND comprobante LIKE %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal")
            data_params = (usuarioLlave, 'Transferencia%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'suma_transferencias_entradas': fila[2],
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/entradas_suma_traspaso_mes')#MODIFICACION
@cross_origin()
@login_required
def getSumaTraspasosEntradasMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query=("SELECT MONTH(fecha) AS mes, "
                   "SUM((existencias_entradas - existencias_devueltas) * costo_unitario) AS suma_traspasos_entradas "
                   "FROM entradas "
                   "JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                   "WHERE `identificadorEntr` = %s "
                   "AND comprobante LIKE %s "
                   "AND YEAR(fecha) = %s "
                   "GROUP BY mes")
            data_params = (usuarioLlave, 'Traspaso%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'suma_traspasos_entradas': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/entradas_suma_devoluciones_mes')#DEVOLUCIONES POR COMPRAS
@cross_origin()
@login_required
def getSumaDevolucionesEntradasMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, "
                     "SUM((existencias_entradas - existencias_devueltas) * costo_unitario) AS suma_devoluciones_entradas "
                     "FROM entradas "
                     "JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorEntr` = %s "
                     "AND comprobante LIKE %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes")
            data_params = (usuarioLlave, 'Dev%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'suma_devoluciones_entradas': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/suma_perdidas_donaciones_mes')#PÉRDIDAS
@cross_origin()
@login_required
def getSumaPerdidasDonacionesMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha_perdidas) AS mes, "
                     "SUM(CASE WHEN causa LIKE %s THEN cantidad ELSE 0 END) AS suma_perdida, "
                     "SUM(CASE WHEN causa LIKE %s THEN cantidad ELSE 0 END) AS suma_donacion  "
                     "FROM perdidas "
                     "WHERE `identificador_per` = %s "
                     "AND YEAR(fecha_perdidas) = %s "
                     "GROUP BY mes")
            data_params = ('Pérdida', 'Donación', usuarioLlave, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'suma_perdida': int(fila[1]),
                'suma_donacion': int(fila[2])
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/entradas/<int:idEntr>')#ENTRADAS
@cross_origin()
@login_required
def getEntradas(idEntr):
    try:
        with mysql.connection.cursor() as cur:
            query = ("SELECT idEntr, idProd, sucursal, existencias_entradas, comprobante, causa_devolucion, usuario, fecha, existencias_devueltas "
                     "FROM entradas "
                     "WHERE idEntr = %s")
            cur.execute(query, (idEntr,))
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                'idEntr': fila[0],
                'idProd': fila[1],
                'sucursal': fila[2],
                'existencias_entradas':fila[3],
                'comprobante': fila[4],
                'causa_devolucion': fila[5],
                'usuario': fila[6],
                'fecha': fila[7],
                'existencias_devueltas': fila[8]
                }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/entradas_extraccion')#ENTRADAS para formato CSV
@cross_origin()
@login_required
def getEntradasExtraccion():
    try:
        usuarioLlave = session.get('usernameDos')
        fecha_inicio_entradas_str = request.args.get('fecha_inicio_entradas')
        fecha_fin_entradas_str = request.args.get('fecha_fin_entradas')
        
        fecha_inicio_entradas = datetime.strptime(fecha_inicio_entradas_str, '%Y-%m-%d')
        fecha_fin_entradas = datetime.strptime(fecha_fin_entradas_str, '%Y-%m-%d')
        with mysql.connection.cursor() as cur:
            query = (   "SELECT sucursal_nombre, categoria_nombre, codigo, descripcion, talla, costo_unitario, existencias_entradas, comprobante, causa_devolucion, usuario, fecha, existencias_devueltas "
                        "FROM entradas "
                        "JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `entradas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "WHERE identificadorEntr = %s "
                        "AND fecha >= %s AND fecha < %s "
                        "ORDER BY idEntr ASC ")
            params = (usuarioLlave, fecha_inicio_entradas, fecha_fin_entradas)
            cur.execute(query, params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'sucursal_nombre': fila[0],
                'categoria_nombre': fila[1],
                'codigo':fila[2],
                'descripcion': fila[3],
                'talla': fila[4],
                'costo_unitario': fila[5],
                'existencias_entradas': fila[6],
                'comprobante': fila[7],
                'causa_devolucion': fila[8],
                'usuario': fila[9],
                'fecha': fila[10],
                'existencias_devueltas': fila[11]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/entradas_codigo_kardex/<int:id_producto>')###Kardex############################################################
@cross_origin()
@login_required
def getEntradasCodigoKardex(id_producto):
    try:
        usuarioLlave = session.get('usernameDos')
        entradas_sucursal = request.args.get('entradas_sucursal')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT costo_unitario, existencias_entradas AS existencias, comprobante, fecha, existencias_devueltas "
                     "FROM entradas "
                     "JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorEntr` = %s "
                     "AND sucursal = %s "
                     "AND `entradas`.`idProd` = %s "
                     "AND YEAR(fecha) = %s")
            data_params = (usuarioLlave, entradas_sucursal, id_producto, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = {
                'costo_unitario': fila[0],
                'existencias':fila[1],
                'comprobante': fila[2],
                'fecha': fila[3].strftime('%d-%m-%Y'),
                'existencias_devueltas': fila[4]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/entradas_comprobante/<string:comprobante>')#Devolución Compras
@cross_origin()
@login_required
def getEntradasComprobante(comprobante):
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("SELECT idEntr, sucursal_nombre, codigo, existencias_entradas, comprobante, existencias_devueltas, id_sucursales "
                     "FROM entradas "
                     "JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                     "JOIN sucursales ON `entradas`.`sucursal` = `sucursales`.`id_sucursales` "
                     "WHERE `identificadorEntr` = %s "
                     "AND comprobante LIKE %s")
            data_params = (usuarioLlave, f"{comprobante}%")
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = {
                'idEntr': fila[0],
                'sucursal_nombre': fila[1],
                'codigo': fila[2],
                'existencias_entradas':fila[3],
                'comprobante': fila[4],
                'existencias_devueltas': fila[5],
                'id_sucursales': fila[6]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/entradas', methods=['POST'])
@cross_origin()
@login_required
def saveEntradas():
    if 'idEntr' in request.json:
        editEntradas()
    else:
        createEntradas()
    return "ok"

def createEntradas(): #Entradas
    try:
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `entradas` "
                     "(`idEntr`, `idProd`, `sucursal`, `existencias_entradas`, `comprobante`, `causa_devolucion`, `usuario`, `fecha`, `existencias_devueltas`, `identificadorEntr`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['idProd'], request.json['sucursal'], request.json['existencias_entradas'], request.json['comprobante'], dato_cero, 
                    usuarioId, request.json['fecha'], dato_cero, usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Entrada creada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def editEntradas():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `entradas` SET `existencias_entradas` = %s, `existencias_devueltas` = %s "
                     "WHERE `entradas`.`idEntr` = %s "
                     "AND identificadorEntr = %s")
            data = (request.json['existencias_entradas'], request.json['existencias_devueltas'], request.json['idEntr'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Entrada actualizada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@app.route('/api/entradas/<int:idEntr>', methods=['DELETE'])#Elimina fila
@cross_origin()
@login_required
def removeEntradas(idEntr):
    try:
        with mysql.connection.cursor() as cur:
            query = ("DELETE FROM entradas WHERE `entradas`.`idEntr` = %s")
            cur.execute(query, (idEntr,))
            mysql.connection.commit()
        return "Entrada eliminada."
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/procesar_devolucion_compras', methods=['POST'])##Devolución por compras
@cross_origin()
@login_required
def operarDevolucionCompra():
    try:
        sucursal_post = request.json['sucursal_post']
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0

        if sucursal_post not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        
        with mysql.connection.cursor() as cur:
            query_productos = (f"UPDATE `almacen_central` SET {sucursal_post} = %s "
                                "WHERE `almacen_central`.`idProd` = %s "
                                "AND identificadorProd = %s")
            data_productos = (request.json['existencias_post'], request.json['idProd'], usuarioLlave)
            cur.execute(query_productos, data_productos)
            mysql.connection.commit()

            query_entradas_update = ("UPDATE `entradas` SET `existencias_entradas` = %s, `existencias_devueltas` = %s "
                                    "WHERE `entradas`.`idEntr` = %s "
                                    "AND identificadorEntr = %s")
            data_entradas_update = (request.json['existencias_entradas_update'], request.json['existencias_devueltas_update'], request.json['idEntr'], usuarioLlave)
            cur.execute(query_entradas_update, data_entradas_update)
            mysql.connection.commit()

            query_entradas_insert = ("INSERT INTO `entradas` "
                                    "(`idEntr`, `idProd`, `sucursal`, `existencias_entradas`, `comprobante`, `causa_devolucion`, `usuario`, `fecha`, `existencias_devueltas`, `identificadorEntr`) "
                                    "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data_entradas_insert = (request.json['idProd'], request.json['sucursal'], f"{dato_cero}", request.json['comprobante'], request.json['causa_devolucion'], 
                                    usuarioId, request.json['fecha'], request.json['existencias_devueltas_insert'], usuarioLlave)
            cur.execute(query_entradas_insert, data_entradas_insert)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Catidades actualizadas correctamente."}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/procesar_recompra', methods=['POST'])##Recompras
@cross_origin()
@login_required
def operarRecompra():
    try:
        sucursal_post = request.json['sucursal_post']
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0

        if sucursal_post not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        
        with mysql.connection.cursor() as cur:
            query_productos = (f"UPDATE `almacen_central` SET {sucursal_post} = %s "
                            "WHERE `almacen_central`.`idProd` = %s "
                            "AND identificadorProd = %s")
            data_productos = (request.json['existencias_post'], request.json['idProd'], usuarioLlave)
            cur.execute(query_productos, data_productos)
            mysql.connection.commit()

            query_entradas = ("INSERT INTO `entradas` "
                            "(`idEntr`, `idProd`, `sucursal`, `existencias_entradas`, `comprobante`, `causa_devolucion`, `usuario`, `fecha`, `existencias_devueltas`, `identificadorEntr`) "
                            "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data_entradas = (request.json['idProd'], request.json['sucursal'], request.json['existencias_entradas'], request.json['comprobante'], f"{dato_cero}", 
                            usuarioId, request.json['fecha'], f"{dato_cero}", usuarioLlave)
            cur.execute(query_entradas, data_entradas)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Catidades actualizadas correctamente."}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
########################################################################################################
@app.route('/api/gestion_de_recompras', methods=['POST'])
@cross_origin()
@login_required
def gestionDeRecompras():
    try:
        # Obtener los datos del cuerpo de la solicitud
        recompra_data = request.json
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0

        # Diccionario para almacenar los datos de actualización agrupados por sucursal_post
        data_productos_por_sucursal = {'existencias_ac': [], 'existencias_su': [], 'existencias_sd': [], 'existencias_st': []}

        # Lista para almacenar los datos de inserción
        data_entradas = []

        with mysql.connection.cursor() as cur:
            query_numeracion = ("UPDATE `numeracion_comprobante` SET `recompras` = %s "
                                "WHERE `numeracion_comprobante`.`id` = %s "
                                "AND identificador = %s")
            data_numeracion = (request.json['recompras'], request.json['id'], usuarioLlave)
            cur.execute(query_numeracion, data_numeracion)

            # Procesar los productos
            for producto in recompra_data['array_productos_dos']:
                idProd = producto['idProd']
                sucursal_post = producto['sucursal_post']
                existencias_post = producto['existencias_post']

                if sucursal_post not in data_productos_por_sucursal:
                    return jsonify({"status": "error", "message": f"Sucursal no válida: {sucursal_post}"}), 400

                # Agregar los datos al grupo correspondiente
                data_productos_por_sucursal[sucursal_post].append((
                    existencias_post, idProd, usuarioLlave
                ))

            # Ejecutar las actualizaciones agrupadas por sucursal_post
            for sucursal_post, data_productos in data_productos_por_sucursal.items():
                if data_productos:  # Verificar si hay datos para esta sucursal_post
                    query_productos = (f"UPDATE `almacen_central` SET {sucursal_post} = %s "
                                       "WHERE `almacen_central`.`idProd` = %s "
                                       "AND identificadorProd = %s")
                    cur.executemany(query_productos, data_productos)

            # Procesar las entradas
            for entrada in recompra_data['array_entradas_dos']:
                data_entradas.append((
                    entrada['idProd'], entrada['sucursal'], entrada['existencias_entradas'],
                    entrada['comprobante'], dato_cero, usuarioId, entrada['fecha'], dato_cero, usuarioLlave
                ))

            # Usar 'executemany' para insertar en entradas
            query_entradas = ("INSERT INTO `entradas` "
                              "(`idEntr`, `idProd`, `sucursal`, `existencias_entradas`, `comprobante`, `causa_devolucion`, `usuario`, `fecha`, `existencias_devueltas`, `identificadorEntr`) "
                              "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            cur.executemany(query_entradas, data_entradas)

            query_gastos_varios = ("INSERT INTO `gastos_varios` (`id_gastos`, `sucursal_gastos`, `concepto`, `comprobante`, `monto`, `usuario_gastos`, `fecha_gastos`, `identificador_gastos`, "
                     "`caja_bancos`, `credito_gastos`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data_gastos_varios = (request.json['sucursal_gastos'], request.json['concepto'], request.json['comprobante'], request.json['monto'], 
                    usuarioId, request.json['fecha_gastos'], usuarioLlave, request.json['caja_bancos'], request.json['credito_gastos'])
            cur.execute(query_gastos_varios, data_gastos_varios)
            
            # Confirmar la transacción una vez que todas las operaciones se hayan ejecutado
            mysql.connection.commit()

        return jsonify({"status": "success", "message": "Cantidades actualizadas correctamente."}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
#######################################################################################################
@app.route('/api/procesar_perdida', methods=['POST'])##Perdidas
@cross_origin()
@login_required
def operarPerdida():
    try:
        sucursal_post = request.json['sucursal_post']
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')

        if sucursal_post not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        
        with mysql.connection.cursor() as cur:
            query_productos = (f"UPDATE `almacen_central` SET {sucursal_post} = %s "
                                "WHERE `almacen_central`.`idProd` = %s "
                                "AND identificadorProd = %s")
            data_productos = (request.json['existencias_post'], request.json['idProd'], usuarioLlave)
            cur.execute(query_productos, data_productos)
            mysql.connection.commit()

            query_entradas = ("INSERT INTO `perdidas` "
                              "(`id_perdidas`, `suc_perdidas`, `id_productos`, `cantidad`, `causa`, `id_usuario`, `fecha_perdidas`, `identificador_per`) "
                              "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s)")
            data_entradas = (request.json['suc_perdidas'], request.json['idProd'], request.json['cantidad'], request.json['causa'],  
                            usuarioId, request.json['fecha_perdidas'], usuarioLlave)
            cur.execute(query_entradas, data_entradas)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Catidades actualizadas correctamente."}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/api/gestion_de_traspasos', methods=['GET', 'POST'])##Compras-Registro#ya no se usa
@cross_origin()
@login_required
def gestionDeTraspasos():
    try:
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0

        productos_compra = request.json.get('array_productos', [])
        entradas_compra = request.json.get('array_entradas', [])

        with mysql.connection.cursor() as cur:
            # Inserciones en lote para productos
            query_productos = ( "INSERT INTO `almacen_central` "
                                "(`categoria`, `codigo`, `descripcion`, `talla`, `costo_unitario`, `precio_venta`, `lote`, `proveedor`, "
                                "`existencias_ac`, `existencias_su`, `existencias_sd`, `existencias_st`, `identificadorProd`) "
                                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            
            data_productos = [( p['categoria'], p['codigo'], p['descripcion'], p['talla'],
                                p['costo_unitario'], p['precio_venta'], p['lote'], p['proveedor'],
                                p['existencias_ac'], p['existencias_su'], p['existencias_sd'],
                                p['existencias_st'], usuarioLlave) for p in productos_compra]
            cur.executemany(query_productos, data_productos)

            # Recuperar IDs de productos insertados
            codigos = [p['codigo'] for p in productos_compra]
            query_productos_busqueda = ("SELECT idProd, codigo "
                                        "FROM almacen_central "
                                        "WHERE `identificadorProd` = %s AND codigo IN (%s) "
                                        "ORDER BY idProd DESC")
            
            in_placeholder = ', '.join(['%s'] * len(codigos))
            cur.execute(query_productos_busqueda % (usuarioLlave, in_placeholder), codigos)
            id_map = {codigo: idProd for idProd, codigo in cur.fetchall()} 

            # Inserciones en lote para entradas
            query_entradas = (  "INSERT INTO `entradas` "
                                "(`idProd`, `sucursal`, `existencias_entradas`, `comprobante`, `causa_devolucion`, `usuario`, `fecha`, "
                                "`existencias_devueltas`, `identificadorEntr`) "
                                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)")
            
            data_entradas = [(  id_map[e['codigo']], e['sucursal'], e['existencias_entradas'], e['comprobante'], dato_cero,
                                usuarioId, e['fecha'], dato_cero, usuarioLlave) for e in entradas_compra if e['codigo'] in id_map]
            #if e['codigo'] in id_map: Filtra los elementos en entradas para incluir solo 
            # aquellos cuyo codigo existe como clave en el diccionario id_map.  
            # Esto asegura que solo los registros que tienen un código que corresponde a un idProd en id_map se procesen.
            cur.executemany(query_entradas, data_entradas)

            mysql.connection.commit() 

        return jsonify({"status": "success", "message": "Productos creados correctamente."})

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@app.route('/api/gestion_de_compras', methods=['GET', 'POST'])##Compras-Registro
@cross_origin()
@login_required
def gestionDeCompras():
    try:
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0

        productos_compra = request.json.get('array_productos', [])
        entradas_compra = request.json.get('array_entradas', [])

        with mysql.connection.cursor() as cur:
            #Numeración #Un solo objeto
            query_numeracion = ("UPDATE `numeracion_comprobante` SET `compras` = %s "
                                "WHERE `numeracion_comprobante`.`id` = %s "
                                "AND identificador = %s")
            data_numeracion = (request.json['compras'], request.json['id'], usuarioLlave)
            cur.execute(query_numeracion, data_numeracion)

            # Inserciones en lote para productos
            query_productos = ( "INSERT INTO `almacen_central` "
                                "(`categoria`, `codigo`, `descripcion`, `talla`, `costo_unitario`, `precio_venta`, `lote`, `proveedor`, "
                                "`existencias_ac`, `existencias_su`, `existencias_sd`, `existencias_st`, `identificadorProd`) "
                                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            
            data_productos = [( p['categoria'], p['codigo'], p['descripcion'], p['talla'],
                                p['costo_unitario'], p['precio_venta'], p['lote'], p['proveedor'],
                                p['existencias_ac'], p['existencias_su'], p['existencias_sd'],
                                p['existencias_st'], usuarioLlave) for p in productos_compra]
            cur.executemany(query_productos, data_productos)

            # Recuperar IDs de productos insertados
            codigos = [p['codigo'] for p in productos_compra]
            query_productos_busqueda = ("SELECT idProd, codigo "
                                        "FROM almacen_central "
                                        "WHERE `identificadorProd` = %s AND codigo IN (%s) "
                                        "ORDER BY idProd DESC")
            
            in_placeholder = ', '.join(['%s'] * len(codigos))
            cur.execute(query_productos_busqueda % (usuarioLlave, in_placeholder), codigos)
            id_map = {codigo: idProd for idProd, codigo in cur.fetchall()} 

            # Inserciones en lote para entradas
            query_entradas = (  "INSERT INTO `entradas` "
                                "(`idProd`, `sucursal`, `existencias_entradas`, `comprobante`, `causa_devolucion`, `usuario`, `fecha`, "
                                "`existencias_devueltas`, `identificadorEntr`) "
                                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)")
            
            data_entradas = [(  id_map[e['codigo']], e['sucursal'], e['existencias_entradas'], e['comprobante'], dato_cero,
                                usuarioId, e['fecha'], dato_cero, usuarioLlave) for e in entradas_compra if e['codigo'] in id_map]
            #if e['codigo'] in id_map: Filtra los elementos en entradas para incluir solo 
            # aquellos cuyo codigo existe como clave en el diccionario id_map.  
            # Esto asegura que solo los registros que tienen un código que corresponde a un idProd en id_map se procesen.
            cur.executemany(query_entradas, data_entradas)

            query_gastos_varios = ("INSERT INTO `gastos_varios` (`id_gastos`, `sucursal_gastos`, `concepto`, `comprobante`, `monto`, `usuario_gastos`, `fecha_gastos`, `identificador_gastos`, "
                     "`caja_bancos`, `credito_gastos`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data_gastos_varios = (request.json['sucursal_gastos'], request.json['concepto'], request.json['comprobante'], request.json['monto'], 
                    usuarioId, request.json['fecha_gastos'], usuarioLlave, request.json['caja_bancos'], request.json['credito_gastos'])
            cur.execute(query_gastos_varios, data_gastos_varios)

            mysql.connection.commit() 

        return jsonify({"status": "success", "message": "Productos creados correctamente."})

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
##########################################################################################################################################################################
# Datos de la tabla SALIDAS y base de datos salidas
##########################################################################################################################################################################
@app.route('/api/salidas_conteo')
@cross_origin()
@login_required
def getAllSalidasConteo():
    try:
        usuarioLlave = session.get('usernameDos')

        sucursal_salidas = request.args.get('sucursal_salidas')
        categoria_salidas = request.args.get('categoria_salidas')
        codigo_salidas = request.args.get('codigo_salidas')
        comprobante_salidas = request.args.get('comprobante_salidas')
        fecha_inicio_salidas_str = request.args.get('fecha_inicio_salidas')
        fecha_fin_salidas_str = request.args.get('fecha_fin_salidas')
        
        fecha_inicio_salidas = datetime.strptime(fecha_inicio_salidas_str, '%Y-%m-%d')
        fecha_fin_salidas = datetime.strptime(fecha_fin_salidas_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) "
                        "FROM salidas "
                        "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `salidas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "WHERE `identificadorSal` = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND fecha >= %s AND fecha < %s ")
            data_params = (usuarioLlave, f"{sucursal_salidas}%", f"{categoria_salidas}%", f"{codigo_salidas}%", f"{comprobante_salidas}%", 
                        fecha_inicio_salidas, fecha_fin_salidas + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/salidas_tabla/<int:numero>')
@cross_origin()
@login_required
def getAllSalidas(numero):
    try:
        usuarioLlave = session.get('usernameDos')

        sucursal_salidas = request.args.get('sucursal_salidas')
        categoria_salidas = request.args.get('categoria_salidas')
        codigo_salidas = request.args.get('codigo_salidas')
        comprobante_salidas = request.args.get('comprobante_salidas')
        fecha_inicio_salidas_str = request.args.get('fecha_inicio_salidas')
        fecha_fin_salidas_str = request.args.get('fecha_fin_salidas')
        
        fecha_inicio_salidas = datetime.strptime(fecha_inicio_salidas_str, '%Y-%m-%d')
        fecha_fin_salidas = datetime.strptime(fecha_fin_salidas_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT idSal, sucursal_nombre, categoria_nombre, codigo, existencias_salidas, precio_venta_salidas, comprobante, fecha, existencias_devueltas, costo_unitario "
                        "FROM salidas "
                        "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `salidas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "WHERE identificadorSal = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND fecha >= %s AND fecha < %s "
                        "ORDER BY idSal ASC "
                        "LIMIT 20 OFFSET %s")
            data_params = (usuarioLlave, f"{sucursal_salidas}%", f"{categoria_salidas}%", f"{codigo_salidas}%", f"{comprobante_salidas}%", 
                            fecha_inicio_salidas, fecha_fin_salidas + timedelta(days=1), numero)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'idSal': fila[0],
                'sucursal_nombre': fila[1],
                'categoria_nombre': fila[2],
                'codigo': fila[3],
                'existencias_salidas':fila[4],
                'precio_venta_salidas':fila[5],
                'comprobante': fila[6],
                'fecha': fila[7].strftime('%d-%m-%Y'),
                'existencias_devueltas': fila[8],
                'costo_unitario': fila[9]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/salidas_tabla_reporte')#Salidas, Ventas
@cross_origin()
@login_required
def getAllSalidasReporte():
    try:
        usuarioLlave = session.get('usernameDos')

        comprobante_salidas = request.args.get('comprobante_salidas')
        fecha_inicio_salidas_str = request.args.get('fecha_inicio_salidas')
        fecha_fin_salidas_str = request.args.get('fecha_fin_salidas')
        
        fecha_inicio_salidas = datetime.strptime(fecha_inicio_salidas_str, '%Y-%m-%d')
        fecha_fin_salidas = datetime.strptime(fecha_fin_salidas_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT sucursal_nombre, codigo, existencias_salidas, precio_venta_salidas, comprobante, fecha, existencias_devueltas, descripcion "
                        "FROM salidas "
                        "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                        "JOIN sucursales ON `salidas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "WHERE identificadorSal = %s "
                        "AND comprobante LIKE %s "
                        "AND fecha >= %s AND fecha < %s "
                        "ORDER BY sucursal ASC ")
            data_params = (usuarioLlave, f"{comprobante_salidas}%", fecha_inicio_salidas, fecha_fin_salidas + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'sucursal_nombre': fila[0],
                'codigo': fila[1],
                'existencias_salidas':fila[2],
                'precio_venta_salidas':fila[3],
                'comprobante': fila[4],
                'fecha': fila[5].strftime('%d-%m-%Y'),
                'existencias_devueltas': fila[6],
                'descripcion': fila[7]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
####----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/salidas_suma_ventas_por_mes')#HOME
@cross_origin()
@login_required
def getSumaVentasPorMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')
        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(t1.fecha) AS mes, "
                     "SUM((t1.existencias_salidas - t1.existencias_devueltas) * t1.precio_venta_salidas) AS suma_ventas, "
                     "SUM((t1.existencias_salidas - t1.existencias_devueltas) * t2.costo_unitario) AS suma_costos, "
                     "SUM(t1.existencias_devueltas) AS unidades_devueltas, "
                     "SUM((t1.existencias_salidas - t1.existencias_devueltas) * t2.precio_venta) AS suma_ventas_esperado "
                     "FROM `salidas` AS t1 "
                     "JOIN `almacen_central` AS t2 ON t1.idProd = t2.idProd "
                     "WHERE `identificadorSal` = %s "
                     "AND t1.comprobante LIKE %s "
                     "AND YEAR(t1.fecha) = %s "
                     "GROUP BY mes")
            data_params = (usuarioLlave, 'Venta%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'suma_ventas': fila[1],
                'suma_costos': fila[2],
                'unidades_devueltas': fila[3],
                'suma_ventas_esperado': fila[4],
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/salidas_suma_total_por_mes')#HOME
@cross_origin()
@login_required
def getSumaTotalSalidasMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_total_salidas "
                     "FROM salidas "
                     "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal")
            cur.execute(query, (usuarioLlave, year_actual))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'suma_total_salidas': fila[2]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/salidas_suma_total_pasado')#HOME
@cross_origin()
@login_required
def getSumaTotalSalidasPasado():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT sucursal, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_total_salidas_pasado "
                     "FROM salidas "
                     "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND YEAR(fecha) < %s "
                     "GROUP BY sucursal")
            cur.execute(query, (usuarioLlave, year_actual))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'sucursal': fila[0],
                'suma_total_salidas_pasado': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/salidas_suma_ventas_por_mes_por_sucursal')#HOME
@cross_origin()
@login_required
def getSumaVentasPorMesSucursal():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_costos, "
                     "SUM(existencias_devueltas) AS unidades_devueltas, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta) AS suma_ventas_esperado "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal")
            data_params = (usuarioLlave, 'Venta%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'suma_ventas': fila[2],
                'suma_costos': fila[3],
                'unidades_devueltas': fila[4],
                'suma_ventas_esperado': fila[5]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/salidas_suma_ventas_devoluciones_mes_actual_sucursal')#HOME
@cross_origin()
@login_required
def getSumaVentasDevolucionesSucursal():
    try:
        usuarioLlave = session.get('usernameDos')
        mes_actual = datetime.now().month
        anio_actual = datetime.now().year

        with mysql.connection.cursor() as cur:
            query = ("SELECT sucursal, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas, "
                     "SUM(existencias_devueltas) AS unidades_devueltas "
                     "FROM `salidas` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND YEAR(fecha) = %s "
                     "AND MONTH(fecha) = %s "
                     "GROUP BY sucursal")
            data_params = (usuarioLlave, 'Venta%', anio_actual, mes_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'sucursal': fila[0],
                'suma_ventas': fila[1],
                'unidades_devueltas': fila[2]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/salidas_suma_ventas_por_dia_por_sucursal')#HOME
@cross_origin()
@login_required
def getSumaVentasPorDiaSucursal():
    try:
        usuarioLlave = session.get('usernameDos')
        dia_actual = datetime.now().day
        mes_actual = datetime.now().month
        anio_actual = datetime.now().year

        with mysql.connection.cursor() as cur:
            query = ("SELECT sucursal, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas_dia "
                     "FROM `salidas` "
                     "WHERE `identificadorSal` = %s "
                     "AND `comprobante` LIKE %s "
                     "AND DAY(`fecha`) = %s "
                     "AND MONTH(`fecha`) = %s "
                     "AND YEAR(`fecha`) = %s "
                     "GROUP BY sucursal")
            data_params = (usuarioLlave, 'Venta%', dia_actual, mes_actual, anio_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = {
                'sucursal': fila[0],
                'suma_ventas_dia': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/salidas_suma_transferencias_mes')#TRANSFERENCIAS
@cross_origin()
@login_required
def getSumaTransferenciasSalidasMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_transferemcias_salidas "
                     "FROM salidas "
                     "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal")
            data_params = (usuarioLlave, 'Transferencia%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'suma_transferemcias_salidas': fila[2]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/salidas_suma_devoluciones_mes')#DEVOLUCIONES SALIDAS
@cross_origin()
@login_required
def getSumaDevolucionesSalidasMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, "
                     "SUM((existencias_Salidas - existencias_devueltas) * precio_venta_salidas) AS suma_devoluciones_salidas "
                     "FROM salidas "
                     "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes")
            data_params = (usuarioLlave, 'Dev%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'suma_devoluciones_salidas': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/salidas_top_cinco_categorias_sucursal')#SALIDAS
@cross_origin()
@login_required
def getTopCincoCategoriasSucursal():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, categoria_nombre, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_costos "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal, categoria_nombre "
                     "ORDER BY suma_ventas DESC")
            data_params = (usuarioLlave, 'Venta%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'categoria_nombre': fila[2],
                'suma_ventas': fila[3],
                'suma_costos': fila[4]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/salidas_top_cinco_codigos_sucursal')#SALIDAS
@cross_origin()
@login_required
def getTopCincoCodigosSucursal():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, codigo, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_costos "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal, "
                     "codigo ORDER BY suma_ventas DESC")
            data_params = (usuarioLlave, 'Venta%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'codigo': fila[2],
                'suma_ventas': fila[3],
                'suma_costos': fila[4]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/salidas_top_ventas')#Compras Buscador
@cross_origin()
@login_required
def getTopVentas():
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_venta = request.args.get('sucursal_venta')
        categoria_venta = request.args.get('categoria_venta')
        year_actual = request.args.get('year_actual')
        trimestre = request.args.get('trimestre')

        sucursal_get = request.args.get('sucursal_get')
        if sucursal_get not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400

        with mysql.connection.cursor() as cur:
            query = (f"SELECT `salidas`.`idProd` AS id, sucursal, categoria, codigo, descripcion, {sucursal_get}, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_costos, "
                     "SUM(existencias_salidas - existencias_devueltas) AS cantidad_venta "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND sucursal = %s ")
            
            data_params = (usuarioLlave, 'Venta%', sucursal_venta)

            if categoria_venta and categoria_venta != '0':# Si `categoria_venta` no es 0 o None, filtramos por categoría
                query += "AND categoria = %s "
                data_params += (categoria_venta,)

            if trimestre and trimestre.isdigit() and 1 <= int(trimestre) <= 4:# Aplicar trimestre si es válido (entre 1 y 4)
                query += "AND QUARTER(fecha) = %s "
                data_params += (trimestre,)

            query += "AND YEAR(fecha) = %s " \
                     "GROUP BY `salidas`.`idProd` " \
                     "ORDER BY cantidad_venta DESC"

            data_params += (year_actual,)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = {
                'id': fila[0],
                'sucursal': fila[1],
                'categoria': fila[2],
                'codigo': fila[3],
                'descripcion': fila[4],
                'sucursal_get': fila[5],
                'suma_ventas': fila[6],
                'suma_costos': fila[7],
                'cantidad_venta': int(fila[8])
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/salidas_categorias_sucursal')#SALIDAS_estadisticas
@cross_origin()
@login_required
def getCategoriasSucursalSalidas():
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_salidas = request.args.get('sucursal_salidas')
        #year_actual = datetime.now().year
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, categoria_nombre, categoria, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_costos, "
                     "SUM(existencias_salidas - existencias_devueltas) AS suma_unidades, "
                     "COUNT(DISTINCT comprobante) AS suma_veces "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                     "WHERE `identificadorSal` = %s "
                     "AND sucursal = %s "
                     "AND comprobante LIKE %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal, categoria "
                     "ORDER BY mes ASC")
            data_params = (usuarioLlave, f"{sucursal_salidas}", "Venta%", year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'categoria_nombre': fila[2],
                'categoria': fila[3],
                'suma_ventas': fila[4],
                'suma_costos': fila[5],
                'suma_unidades': int(fila[6]),
                'suma_veces': int(fila[7])
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/salidas_productos_sucursal')#SALIDAS_estadisticas
@cross_origin()
@login_required
def getCodigoSucursalSalidas():
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_salidas = request.args.get('sucursal_salidas')
        categoria_salidas = request.args.get('categoria_salidas')
        #year_actual = datetime.now().year
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, categoria_nombre, codigo, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_costos, "
                     "SUM(existencias_salidas - existencias_devueltas) AS suma_unidades, "
                     "SUM(existencias_devueltas) AS suma_unidades_dev, "
                     "COUNT(DISTINCT comprobante) AS suma_veces "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                     "WHERE `identificadorSal` = %s "
                     "AND sucursal = %s "
                     "AND comprobante LIKE %s "
                     "AND categoria LIKE %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal, categoria, codigo "
                     "ORDER BY mes ASC")
            data_params = (usuarioLlave, f"{sucursal_salidas}", "Venta%", f"{categoria_salidas}", year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'categoria_nombre': fila[2],
                'codigo': fila[3],
                'suma_ventas': fila[4],
                'suma_costos': fila[5],
                'suma_unidades': int(fila[6]),
                'suma_unidades_dev': int(fila[7]),
                'suma_veces': int(fila[8])
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
####----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/salidas/<int:idSal>')#Salidas
@cross_origin()
@login_required
def getSalidas(idSal):
    try:
        with mysql.connection.cursor() as cur:
            query = ("SELECT idSal, idProd, sucursal, existencias_salidas, precio_venta_salidas, comprobante, causa_devolucion, cliente, usuario, fecha, existencias_devueltas "
                     "FROM salidas "
                     "WHERE idSal = %s")
            cur.execute(query, (idSal,))
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                'idSal': fila[0],
                'idProd': fila[1], 
                'sucursal': fila[2], 
                'existencias_salidas':fila[3],
                'precio_venta_salidas': fila[4],
                'comprobante': fila[5],
                'causa_devolucion': fila[6],
                'cliente': fila[7],
                'usuario': fila[8],
                'fecha': fila[9],
                'existencias_devueltas': fila[10]
                }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/salidas_categoria_kardex/<string:categoria>')#KARDEX
@cross_origin()
@login_required
def getSumaVentasPorCategoria(categoria):
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_salidas = request.args.get('sucursal_salidas')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) AS conteo, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND sucursal = %s "
                     "AND categoria LIKE %s "
                     "AND YEAR(fecha) = %s")
            data_params = (usuarioLlave, 'Venta%', f"{sucursal_salidas}", f"{categoria}", year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'conteo': fila[0],
                'suma_ventas': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/salidas_sucursal_kardex/<int:sucursal>')#KARDEX
@cross_origin()
@login_required
def getSumaVentasPorSucursal(sucursal):
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) AS conteo, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND sucursal = %s "
                     "AND YEAR(fecha) = %s")
            data_params = (usuarioLlave, 'Venta%', f"{sucursal}", year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'conteo': fila[0],
                'suma_ventas': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/salidas_codigo_kardex/<int:id_producto>')###Kardex############################################################
@cross_origin()
@login_required
def getSalidasCodigoKardex(id_producto):
    try:
        usuarioLlave = session.get('usernameDos')
        salidas_sucursal = request.args.get('salidas_sucursal')
        year_actual = request.args.get('year_actual')
        with mysql.connection.cursor() as cur:
            query = ("SELECT costo_unitario, existencias_salidas AS existencias, comprobante, fecha, existencias_devueltas, precio_venta_salidas, precio_venta "
                     "FROM salidas "
                     "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND sucursal LIKE %s "
                     "AND `salidas`.`idProd` = %s "
                     "AND YEAR(fecha) = %s")
            data_params = (usuarioLlave, salidas_sucursal, id_producto, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = {
                'costo_unitario': fila[0],
                'existencias':fila[1],
                'comprobante': fila[2],
                'fecha': fila[3].strftime('%d-%m-%Y'),
                'existencias_devueltas': fila[4],
                'precio_venta_salidas': fila[5],
                'precio_venta': fila[6]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/suma_ventas_por_mes_kardex/<int:id_codigo>')###Kardex############################################################
@cross_origin()
@login_required
def getSumaVentasPorMesKardex(id_codigo):
    try:
        usuarioLlave = session.get('usernameDos')
        salidas_sucursal = request.args.get('salidas_sucursal')
        year_actual = request.args.get('year_actual')
        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(t1.fecha) AS mes, "
                     "SUM((t1.existencias_salidas - t1.existencias_devueltas) * t1.precio_venta_salidas) AS suma_ventas, "
                     "SUM((t1.existencias_salidas - t1.existencias_devueltas) * t2.costo_unitario) AS suma_costos, "
                     "SUM(t1.existencias_devueltas) AS unidades_devueltas, "
                     "SUM((t1.existencias_salidas - t1.existencias_devueltas) * t2.precio_venta) AS suma_ventas_esperado "
                     "FROM `salidas` AS t1 "
                     "JOIN `almacen_central` AS t2 ON t1.idProd = t2.idProd "
                     "WHERE `identificadorSal` = %s "
                     "AND t1.comprobante LIKE %s "
                     "AND sucursal LIKE %s "
                     "AND t1.idProd = %s "
                     "AND YEAR(t1.fecha) = %s "
                     "GROUP BY mes")
            data_params = (usuarioLlave, 'Venta%', f"{salidas_sucursal}%", id_codigo, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'suma_ventas': fila[1],
                'suma_costos': fila[2],
                'unidades_devueltas': int(fila[3]),
                'suma_ventas_esperado': fila[4],
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/salidas_extraccion')#Salidas para formato CSV
@cross_origin()
@login_required
def getSalidasExtraccion():
    try:
        usuarioLlave = session.get('usernameDos')
        fecha_inicio_salidas_str = request.args.get('fecha_inicio_salidas')
        fecha_fin_salidas_str = request.args.get('fecha_fin_salidas')
        
        fecha_inicio_salidas = datetime.strptime(fecha_inicio_salidas_str, '%Y-%m-%d')
        fecha_fin_salidas = datetime.strptime(fecha_fin_salidas_str, '%Y-%m-%d')
        with mysql.connection.cursor() as cur:
            query = (   "SELECT sucursal_nombre, categoria_nombre, codigo, descripcion, talla, precio_venta_salidas, existencias_salidas, comprobante, causa_devolucion, cliente, usuario, fecha, existencias_devueltas "
                        "FROM salidas "
                        "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `salidas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "WHERE identificadorSal = %s "
                        "AND fecha >= %s AND fecha < %s "
                        "ORDER BY idSal ASC ")
            params = (usuarioLlave, fecha_inicio_salidas, fecha_fin_salidas)
            cur.execute(query, params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'sucursal_nombre': fila[0],
                'categoria_nombre': fila[1],
                'codigo':fila[2],
                'descripcion': fila[3],
                'talla': fila[4],
                'precio_venta_salidas': fila[5],
                'existencias_salidas': fila[6],
                'comprobante': fila[7],
                'causa_devolucion': fila[8],
                'cliente': fila[9],
                'usuario': fila[10],
                'fecha': fila[11],
                'existencias_devueltas': fila[12]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/salidas_comprobante/<string:comprobante>')#DEVOLUCION, Detalle ventas
@cross_origin()
@login_required
def getSalidasComprobante(comprobante):
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("SELECT idSal, sucursal_nombre, codigo, descripcion, existencias_salidas, precio_venta_salidas, comprobante, cliente, existencias_devueltas, id_sucursales "
                     "FROM salidas "
                     "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "JOIN sucursales ON `salidas`.`sucursal` = `sucursales`.`id_sucursales` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s")
            cur.execute(query, (usuarioLlave, f"{comprobante}%"))
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = {
                'idSal': fila[0],
                'sucursal_nombre': fila[1],
                'codigo': fila[2],
                'descripcion': fila[3],
                'existencias_salidas':fila[4],
                'precio_venta_salidas':fila[5],
                'comprobante': fila[6],
                'cliente': fila[7],
                'existencias_devueltas': fila[8],
                'id_sucursales': fila[9]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/salidas', methods=['POST'])
@cross_origin()
@login_required
def saveSalidas():
    if 'idSal' in request.json:
        editSalidas()
    else:
        createSalidas()
    return "ok"

def createSalidas():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `salidas` "
                     "(`idSal`, `idProd`, `sucursal`, `existencias_salidas`, `precio_venta_salidas`,`comprobante`, `causa_devolucion`, `cliente`, `usuario`, `fecha`, `existencias_devueltas`, `identificadorSal`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['idProd'], request.json['sucursal'], request.json['existencias_salidas'], request.json['precio_venta_salidas'], request.json['comprobante'], 
                    request.json['causa_devolucion'], request.json['cliente'], request.json['usuario'], request.json['fecha'], request.json['existencias_devueltas'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Salida creada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def editSalidas():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `salidas` SET `existencias_salidas` = %s, `precio_venta_salidas` = %s, `existencias_devueltas` = %s "
                     "WHERE `salidas`.`idSal` = %s "
                     "AND identificadorSal = %s")
            data = (request.json['existencias_salidas'], request.json['precio_venta_salidas'], request.json['existencias_devueltas'], request.json['idSal'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Salida actualizada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@app.route('/api/salidas/<int:idSal>', methods=['DELETE'])
@cross_origin()
@login_required
def removeSalidas(idSal):
    try:
        with mysql.connection.cursor() as cur:
            query = "DELETE FROM salidas WHERE `salidas`.`idSal` = %s"
            cur.execute(query, (idSal,))
            mysql.connection.commit()
        return "Salida eliminada." 
    except Exception as e:
        return jsonify({'error': str(e)}), 500  

@app.route('/api/procesar_devolucion_salidas', methods=['POST'])##Devolución salidas
@cross_origin()
@login_required
def operarDevolucionSalidas():
    try:
        sucursal_post = request.json['sucursal_post']
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0
        dato_uno = 1

        if sucursal_post not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        
        with mysql.connection.cursor() as cur:
            query_productos = (f"UPDATE `almacen_central` SET {sucursal_post} = %s "
                                "WHERE `almacen_central`.`idProd` = %s "
                                "AND identificadorProd = %s")
            data_productos = (request.json['existencias_post'], request.json['idProd'], usuarioLlave)
            cur.execute(query_productos, data_productos)
            mysql.connection.commit()

            query_salidas_update = ("UPDATE `salidas` SET `existencias_salidas` = %s, `precio_venta_salidas` = %s, `existencias_devueltas` = %s "
                                    "WHERE `salidas`.`idSal` = %s "
                                    "AND identificadorSal = %s")
            data_salidas_update = (request.json['existencias_salidas_update'], request.json['precio_venta_salidas'], request.json['existencias_devueltas_update'], request.json['idSal'], usuarioLlave)
            cur.execute(query_salidas_update, data_salidas_update)
            mysql.connection.commit()

            query_salidas_insert = ("INSERT INTO `salidas` "
                                    "(`idSal`, `idProd`, `sucursal`, `existencias_salidas`, `precio_venta_salidas`,`comprobante`, `causa_devolucion`, `cliente`, `usuario`, `fecha`, `existencias_devueltas`, `identificadorSal`) "
                                    "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data_salidas_insert = (request.json['idProd'], request.json['sucursal'], f"{dato_cero}", request.json['precio_venta_salidas'], request.json['comprobante'], 
                    request.json['causa_devolucion'], f"{dato_uno}", usuarioId, request.json['fecha'], request.json['existencias_devueltas_insert'], usuarioLlave)
            cur.execute(query_salidas_insert, data_salidas_insert)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Cantidades actualizadas correctamente."}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/procesar_venta', methods=['POST'])#Ya no se usa
@cross_origin()
@login_required
def operarVenta():
    try:
        sucursal_post = request.json['sucursal_post']
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0

        if sucursal_post not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        
        with mysql.connection.cursor() as cur:
            query_productos = (f"UPDATE `almacen_central` SET {sucursal_post} = %s "
                     "WHERE `almacen_central`.`idProd` = %s "
                     "AND identificadorProd = %s")
            data_productos = (request.json['existencias_post'], request.json['idProd'], usuarioLlave)
            cur.execute(query_productos, data_productos)

            query_salidas = ("INSERT INTO `salidas` "
                     "(`idSal`, `idProd`, `sucursal`, `existencias_salidas`, `precio_venta_salidas`,`comprobante`, `causa_devolucion`, `cliente`, `usuario`, `fecha`, `existencias_devueltas`, `identificadorSal`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data_salidas = (request.json['idProd'], request.json['sucursal'], request.json['existencias_salidas'], request.json['precio_venta_salidas'], request.json['comprobante'], 
                            f"{dato_cero}", request.json['cliente'], usuarioId, request.json['fecha'], f"{dato_cero}", usuarioLlave)
            cur.execute(query_salidas, data_salidas)

            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Cantidades actualizadas correctamente."}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/gestion_de_venta', methods=['POST'])
@cross_origin()
@login_required
def gestionDeVenta():
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_post = request.json['sucursal_post']
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0
        numero_venta = request.json['ventas']
        comp = 'Venta-' + str(numero_venta)

        item_ticket = request.json['item_ticket']
        productos_venta = request.json.get('array_productos', [])
        salidas_venta = request.json.get('array_salidas', [])

        if sucursal_post not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400# Almacén central
        
        if item_ticket not in ['nota_venta', 'boleta_venta', 'factura']:
            return jsonify({"status": "error", "message": "Item no válido"}), 400# Numeración
        
        with mysql.connection.cursor() as cur:

            #Numeración #Un solo objeto
            query_numeracion = (f"UPDATE `numeracion_comprobante` SET `ventas` = %s, {item_ticket} = %s "
                                "WHERE `numeracion_comprobante`.`id` = %s "
                                "AND identificador = %s")
            data_numeracion = (request.json['ventas'], request.json['numeracion_ticket'], request.json['id'], usuarioLlave)
            cur.execute(query_numeracion, data_numeracion)

            #Almacén central #array de objetos
            query_productos = (f"UPDATE `almacen_central` SET {sucursal_post} = %s "
                                "WHERE `almacen_central`.`idProd` = %s "
                                "AND identificadorProd = %s")
            data_productos = [(p['existencias_post'], p['idProd'], usuarioLlave) for p in productos_venta]
            cur.executemany(query_productos, data_productos)

            #Salidas #array de objetos
            query_salidas = ("INSERT INTO `salidas` "
                     "(`idSal`, `idProd`, `sucursal`, `existencias_salidas`, `precio_venta_salidas`,`comprobante`, `causa_devolucion`, `cliente`, `usuario`, `fecha`, `existencias_devueltas`, `identificadorSal`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data_salidas = [(s['idProd'], s['sucursal'], s['existencias_salidas'], s['precio_venta_salidas'],
                             comp, dato_cero, s['cliente'], usuarioId, s['fecha'], dato_cero, usuarioLlave) for s in salidas_venta]
            cur.executemany(query_salidas, data_salidas)

            #Detalle de venta #Un solo objeto
            query_detalle = ("INSERT INTO `ventas` (`id_det_ventas`, `sucursal`, `comprobante`, `tipo_comprobante`, `dni_cliente`, `modo_efectivo`, `modo_credito`, "
                     "`modo_tarjeta`, `modo_perdida`, `total_venta`, `fecha_det_ventas`, `identificador_ventas`, `canal_venta`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data_detalle = (request.json['sucursal'],f"{comp}", request.json['tipo_comprobante'], request.json['dni_cliente'], request.json['modo_efectivo'], 
                    request.json['modo_credito'], request.json['modo_tarjeta'], request.json['modo_perdida'], request.json['total_venta'], request.json['fecha'], 
                    usuarioLlave, request.json['canal_venta'])
            cur.execute(query_detalle, data_detalle)

            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Numeración actualizada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

##########################################################################################################################################################################
# Datos de la tabla TRANSFERENCIAS
##########################################################################################################################################################################
@app.route('/api/transferencias_conteo')
@cross_origin()
@login_required
def getAllTrasnferenciasConteo():
    try:
        usuarioLlave = session.get('usernameDos')

        sucursal_entradas = request.args.get('sucursal_entradas')
        categoria_entradas = request.args.get('categoria_entradas')
        codigo_entradas = request.args.get('codigo_entradas')
        comprobante_entradas = request.args.get('comprobante_entradas')
        fecha_inicio_entradas_str = request.args.get('fecha_inicio_entradas')
        fecha_fin_entradas_str = request.args.get('fecha_fin_entradas')
        
        fecha_inicio_entradas = datetime.strptime(fecha_inicio_entradas_str, '%Y-%m-%d')
        fecha_fin_entradas = datetime.strptime(fecha_fin_entradas_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = (   "SELECT COUNT(*) "
                        "FROM transfrencias "
                        "JOIN almacen_central ON `transfrencias`.`id_prod` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `transfrencias`.`id_suc_destino` = `sucursales`.`id_sucursales` "
                        "WHERE `identificador_tran` = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND fecha_tran >= %s AND fecha_tran < %s ")
            data_params = (usuarioLlave, f"{sucursal_entradas}%", f"{categoria_entradas}%", f"{codigo_entradas}%", f"{comprobante_entradas}%", 
                        fecha_inicio_entradas, fecha_fin_entradas + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/transferencias_tabla/<int:numero>')
@cross_origin()
@login_required
def getAllTransferencias(numero):
    try:
        usuarioLlave = session.get('usernameDos')

        sucursal_entradas = request.args.get('sucursal_entradas')
        categoria_entradas = request.args.get('categoria_entradas')
        codigo_entradas = request.args.get('codigo_entradas')
        comprobante_entradas = request.args.get('comprobante_entradas')
        fecha_inicio_entradas_str = request.args.get('fecha_inicio_entradas')
        fecha_fin_entradas_str = request.args.get('fecha_fin_entradas')
       
        fecha_inicio_entradas = datetime.strptime(fecha_inicio_entradas_str, '%Y-%m-%d')
        fecha_fin_entradas = datetime.strptime(fecha_fin_entradas_str, '%Y-%m-%d')
       
        with mysql.connection.cursor() as cur:
            query = (   "SELECT id_tran AS idEntr, sucursal_nombre, categoria_nombre, codigo, cantidad AS existencias_entradas, comprobante, fecha_tran AS fecha, costo_unitario "
                        "FROM transfrencias "
                        "JOIN almacen_central ON `transfrencias`.`id_prod` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `transfrencias`.`id_suc_destino` = `sucursales`.`id_sucursales` "
                        "WHERE `identificador_tran` = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND fecha_tran >= %s AND fecha_tran < %s "
                        "ORDER BY id_tran ASC "
                        "LIMIT 20 OFFSET %s")
            data_params = (usuarioLlave, f"{sucursal_entradas}%", f"{categoria_entradas}%", f"{codigo_entradas}%", f"{comprobante_entradas}%", 
                           fecha_inicio_entradas, fecha_fin_entradas + timedelta(days=1), numero)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
               'idEntr': fila[0],
               'sucursal_nombre': fila[1],
               'categoria_nombre': fila[2],
               'codigo': fila[3],
               'existencias_entradas':fila[4],
               'comprobante': fila[5],
               'fecha': fila[6].strftime('%d-%m-%Y'),
               'existencias_devueltas': 0,
               'costo_unitario': fila[7]
               }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/transferencias_conteo_s')
@cross_origin()
@login_required
def getAllTrasnferenciasConteoS():
    try:
        usuarioLlave = session.get('usernameDos')

        sucursal_salidas = request.args.get('sucursal_salidas')
        categoria_salidas = request.args.get('categoria_salidas')
        codigo_salidas = request.args.get('codigo_salidas')
        comprobante_salidas = request.args.get('comprobante_salidas')
        fecha_inicio_salidas_str = request.args.get('fecha_inicio_salidas')
        fecha_fin_salidas_str = request.args.get('fecha_fin_salidas')
        
        fecha_inicio_salidas = datetime.strptime(fecha_inicio_salidas_str, '%Y-%m-%d')
        fecha_fin_salidas = datetime.strptime(fecha_fin_salidas_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = (   "SELECT COUNT(*) "
                        "FROM transfrencias "
                        "JOIN almacen_central ON `transfrencias`.`id_prod` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `transfrencias`.`id_suc_destino` = `sucursales`.`id_sucursales` "
                        "WHERE `identificador_tran` = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND fecha_tran >= %s AND fecha_tran < %s ")
            data_params = (usuarioLlave, f"{sucursal_salidas}%", f"{categoria_salidas}%", f"{codigo_salidas}%", f"{comprobante_salidas}%", 
                        fecha_inicio_salidas, fecha_fin_salidas + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/transferencias_tabla_s/<int:numero>')
@cross_origin()
@login_required
def getAllTransferenciasS(numero):
    try:
        usuarioLlave = session.get('usernameDos')

        sucursal_salidas = request.args.get('sucursal_salidas')
        categoria_salidas = request.args.get('categoria_salidas')
        codigo_salidas = request.args.get('codigo_salidas')
        comprobante_salidas = request.args.get('comprobante_salidas')
        fecha_inicio_salidas_str = request.args.get('fecha_inicio_salidas')
        fecha_fin_salidas_str = request.args.get('fecha_fin_salidas')
       
        fecha_inicio_salidas = datetime.strptime(fecha_inicio_salidas_str, '%Y-%m-%d')
        fecha_fin_salidas = datetime.strptime(fecha_fin_salidas_str, '%Y-%m-%d')
       
        with mysql.connection.cursor() as cur:
            query = (   "SELECT id_tran AS idSal, sucursal_nombre, categoria_nombre, codigo, cantidad AS existencias_salidas, comprobante, fecha_tran AS fecha, costo_unitario AS precio_venta_salidas "
                        "FROM transfrencias "
                        "JOIN almacen_central ON `transfrencias`.`id_prod` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `transfrencias`.`id_suc_origen` = `sucursales`.`id_sucursales` "
                        "WHERE `identificador_tran` = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND fecha_tran >= %s AND fecha_tran < %s "
                        "ORDER BY id_tran ASC "
                        "LIMIT 20 OFFSET %s")
            data_params = (usuarioLlave, f"{sucursal_salidas}%", f"{categoria_salidas}%", f"{codigo_salidas}%", f"{comprobante_salidas}%", 
                           fecha_inicio_salidas, fecha_fin_salidas + timedelta(days=1), numero)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
               'idSal': fila[0],
               'sucursal_nombre': fila[1],
               'categoria_nombre': fila[2],
               'codigo': fila[3],
               'existencias_salidas':fila[4],
               'comprobante': fila[5],
               'fecha': fila[6].strftime('%d-%m-%Y'),
               'existencias_devueltas': 0,
               'precio_venta_salidas': fila[7]
               }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/transfrencias_codigo_kardex/<int:id_producto>')###Kardex############################################################
@cross_origin()
@login_required
def getTransferenciasCodigoKardex(id_producto):
    try:
        usuarioLlave = session.get('usernameDos')
        transferencias_sucursal = request.args.get('transferencias_sucursal')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id_suc_origen, id_suc_destino, cantidad AS existencias, comprobante, costo_unitario, fecha_tran AS fecha, id_prod "
                     "FROM transfrencias "
                     "JOIN almacen_central ON `transfrencias`.`id_prod` = `almacen_central`.`idProd` "
                     "WHERE `identificador_tran` = %s "
                     "AND (id_suc_origen = %s OR id_suc_destino = %s) "
                     "AND id_prod = %s "
                     "AND YEAR(fecha_tran) = %s")
            data_params = (usuarioLlave, transferencias_sucursal, transferencias_sucursal, id_producto, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = {
                'id_suc_origen': fila[0],
                'id_suc_destino':fila[1],
                'existencias': fila[2],
                'comprobante': fila[3],
                'costo_unitario': fila[4],
                'fecha': fila[5].strftime('%d-%m-%Y')
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/transferencias_suma_total')#HOME
@cross_origin()
@login_required
def getSumaTotalTransferencias():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')
        id_sucursal = request.args.get('id_sucursal')

        with mysql.connection.cursor() as cur:
            query = ("SELECT %s AS sucursal,"
                    "SUM(CASE WHEN id_suc_destino = %s THEN cantidad * costo_unitario ELSE 0 END) AS sumar_monto, "
                    "SUM(CASE WHEN id_suc_origen = %s THEN cantidad * costo_unitario ELSE 0 END) AS restar_monto "
                    "FROM transfrencias "
                    "JOIN almacen_central ON `transfrencias`.`id_prod` = `almacen_central`.`idProd` "
                    "WHERE `identificador_tran` = %s "
                    "AND YEAR(fecha_tran) = %s ")
            data_params = (id_sucursal, id_sucursal, id_sucursal, usuarioLlave, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        for fila in data:
            contenido = { 
                'sucursal': int(fila[0]),
                'sumar_monto': fila[1],
                'restar_monto': fila[2]
                }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/transferencias_suma_total_anio_pasado')#HOME
@cross_origin()
@login_required
def getSumaTotalTransferenciasAnioPasado():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')
        id_sucursal = request.args.get('id_sucursal')

        with mysql.connection.cursor() as cur:
            query = ("SELECT %s AS sucursal,"
                    "SUM(CASE WHEN id_suc_destino = %s THEN cantidad * costo_unitario ELSE 0 END) AS sumar_monto, "
                    "SUM(CASE WHEN id_suc_origen = %s THEN cantidad * costo_unitario ELSE 0 END) AS restar_monto "
                    "FROM transfrencias "
                    "JOIN almacen_central ON `transfrencias`.`id_prod` = `almacen_central`.`idProd` "
                    "WHERE `identificador_tran` = %s "
                    "AND YEAR(fecha_tran) < %s ")
            data_params = (id_sucursal, id_sucursal, id_sucursal, usuarioLlave, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        for fila in data:
            contenido = { 
                'sucursal': int(fila[0]),
                'sumar_monto': fila[1],
                'restar_monto': fila[2]
                }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

##########################################################################################################################################################################
# Datos de la tabla PERDIDAS
##########################################################################################################################################################################
@app.route('/api/perdidas_conteo')
@cross_origin()
@login_required
def getAllTrasnPerdidasConteo():
    try:
        usuarioLlave = session.get('usernameDos')

        sucursal_entradas = request.args.get('sucursal_entradas')
        categoria_entradas = request.args.get('categoria_entradas')
        codigo_entradas = request.args.get('codigo_entradas')
        comprobante_entradas = request.args.get('comprobante_entradas')
        fecha_inicio_entradas_str = request.args.get('fecha_inicio_entradas')
        fecha_fin_entradas_str = request.args.get('fecha_fin_entradas')
        
        fecha_inicio_entradas = datetime.strptime(fecha_inicio_entradas_str, '%Y-%m-%d')
        fecha_fin_entradas = datetime.strptime(fecha_fin_entradas_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = (   "SELECT COUNT(*) "
                        "FROM perdidas "
                        "JOIN almacen_central ON `perdidas`.`id_productos` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `perdidas`.`suc_perdidas` = `sucursales`.`id_sucursales` "
                        "WHERE `identificador_per` = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND causa LIKE %s "
                        "AND fecha_perdidas >= %s AND fecha_perdidas < %s ")
            data_params = (usuarioLlave, f"{sucursal_entradas}%", f"{categoria_entradas}%", f"{codigo_entradas}%", f"{comprobante_entradas}%", 
                        fecha_inicio_entradas, fecha_fin_entradas + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/perdidas_tabla/<int:numero>')
@cross_origin()
@login_required
def getAllPerdidas(numero):
    try:
        usuarioLlave = session.get('usernameDos')

        sucursal_entradas = request.args.get('sucursal_entradas')
        categoria_entradas = request.args.get('categoria_entradas')
        codigo_entradas = request.args.get('codigo_entradas')
        comprobante_entradas = request.args.get('comprobante_entradas')
        fecha_inicio_entradas_str = request.args.get('fecha_inicio_entradas')
        fecha_fin_entradas_str = request.args.get('fecha_fin_entradas')
       
        fecha_inicio_entradas = datetime.strptime(fecha_inicio_entradas_str, '%Y-%m-%d')
        fecha_fin_entradas = datetime.strptime(fecha_fin_entradas_str, '%Y-%m-%d')
       
        with mysql.connection.cursor() as cur:
            query = (   "SELECT id_perdidas AS idEntr, sucursal_nombre, categoria_nombre, codigo, cantidad AS existencias_entradas, causa AS comprobante, fecha_perdidas AS fecha, costo_unitario "
                        "FROM perdidas "
                        "JOIN almacen_central ON `perdidas`.`id_productos` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `perdidas`.`suc_perdidas` = `sucursales`.`id_sucursales` "
                        "WHERE `identificador_per` = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND causa LIKE %s "
                        "AND fecha_perdidas >= %s AND fecha_perdidas < %s "
                        "ORDER BY id_perdidas ASC "
                        "LIMIT 20 OFFSET %s")
            data_params = (usuarioLlave, f"{sucursal_entradas}%", f"{categoria_entradas}%", f"{codigo_entradas}%", f"{comprobante_entradas}%", 
                           fecha_inicio_entradas, fecha_fin_entradas + timedelta(days=1), numero)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
               'idEntr': fila[0],
               'sucursal_nombre': fila[1],
               'categoria_nombre': fila[2],
               'codigo': fila[3],
               'existencias_entradas':fila[4],
               'comprobante': fila[5],
               'fecha': fila[6].strftime('%d-%m-%Y'),
               'existencias_devueltas': 0,
               'costo_unitario': fila[7]
               }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/perdidas_codigo_kardex/<int:id_producto>')###Kardex############################################################
@cross_origin()
@login_required
def getPerdidasCodigoKardex(id_producto):
    try:
        usuarioLlave = session.get('usernameDos')
        perdidas_sucursal = request.args.get('perdidas_sucursal')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT cantidad AS existencias, causa AS comprobante, costo_unitario, fecha_perdidas AS fecha "
                    "FROM perdidas "
                    "JOIN almacen_central ON `perdidas`.`id_productos` = `almacen_central`.`idProd` "
                    "WHERE `identificador_per` = %s "
                    "AND suc_perdidas = %s "
                    "AND id_productos = %s "
                    "AND YEAR(fecha_perdidas) = %s")
            data_params = (usuarioLlave, perdidas_sucursal, id_producto, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = {
                'existencias': fila[0],
                'comprobante':fila[1],
                'costo_unitario': fila[2],
                'fecha': fila[3].strftime('%d-%m-%Y')
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
       
@app.route('/api/perdidas_suma_total')#HOME
@cross_origin()
@login_required
def getSumaTotalPerdidas():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT suc_perdidas AS sucursal, "
                    "SUM(cantidad * costo_unitario) AS sumar_perdidas "
                    "FROM perdidas "
                    "JOIN almacen_central ON `perdidas`.`id_productos` = `almacen_central`.`idProd` "
                    "WHERE `identificador_per` = %s "
                    "AND YEAR(fecha_perdidas) = %s "
                    "GROUP BY suc_perdidas")
            data_params = (usuarioLlave, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'sucursal': fila[0],
                'sumar_perdidas': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
       
@app.route('/api/perdidas_suma_total_anio_pasado')#HOME
@cross_origin()
@login_required
def getSumaTotalPerdidasAnioPasado():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT suc_perdidas AS sucursal, "
                    "SUM(cantidad * costo_unitario) AS sumar_perdidas "
                    "FROM perdidas "
                    "JOIN almacen_central ON `perdidas`.`id_productos` = `almacen_central`.`idProd` "
                    "WHERE `identificador_per` = %s "
                    "AND YEAR(fecha_perdidas) < %s "
                    "GROUP BY suc_perdidas")
            data_params = (usuarioLlave, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'sucursal': fila[0],
                'sumar_perdidas': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
##########################################################################################################################################################################
# Datos de la tabla CREDITOS
##########################################################################################################################################################################
@app.route('/api/credito_comprobante/<int:id_detalle>')
@cross_origin()
@login_required
def getCreditoComprobante(id_detalle):
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = (   "SELECT id_creditos, sucursal_nombre, tipo_comprobante, efectivo, tarjeta, tasa, a_monto, a_interes, saldo_monto, saldo_interes, saldo_total, saldo_perdida, fecha_cre "
                        "FROM creditos "
                        "JOIN ventas ON creditos.id_detalle = ventas.id_det_ventas "
                        "JOIN sucursales ON creditos.sucursal_cre = sucursales.id_sucursales "
                        "WHERE `identificador_cre` = %s "
                        "AND id_detalle LIKE %s "
                        "ORDER BY id_creditos ASC")
            data_params = (usuarioLlave, id_detalle)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
               'id_creditos': fila[0],
               'sucursal_nombre': fila[1],
               'tipo_comprobante': fila[2],
               'efectivo': fila[3],
               'tarjeta': fila[4],
               'tasa': fila[5],
               'a_monto':fila[6],
               'a_interes': fila[7],
               'saldo_monto': fila[8],
               'saldo_interes': fila[9],
               'saldo_total': fila[10],
               'saldo_perdida': fila[11],
               'fecha_cre': fila[12].strftime('%d-%m-%Y'),
               }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/credito_reporte_dos')
@cross_origin()
@login_required
def getCreditoReporteDos():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = (   "SELECT MIN(sucursal_nombre) AS _sucursal, tipo_comprobante, nombre_cli, MAX(saldo_total) AS monto_credito, MIN(saldo_total) AS saldo_credito, telefono_cli, MIN(fecha_cre) AS fecha_inicio "
                        "FROM creditos "
                        "JOIN ventas ON creditos.id_detalle = ventas.id_det_ventas "
                        "JOIN clientes ON ventas.dni_cliente = clientes.id_cli "
                        "JOIN sucursales ON creditos.sucursal_cre = sucursales.id_sucursales "
                        "WHERE identificador_cre = %s "
                        "AND saldo_total > 0 "
                        "GROUP BY tipo_comprobante")
            data_params = (usuarioLlave,)
            cur.execute(query, data_params)
            data = cur.fetchall()

            resultado = []
            for fila in data:
                contenido = { 
                    '_sucursal': fila[0],
                    'tipo_comprobante': fila[1],
                    'nombre_cli': fila[2],
                    'monto_credito': fila[3],
                    'saldo_credito': fila[4],
                    'telefono_cli': fila[5],
                    'fecha_inicio': fila[6].strftime('%d-%m-%Y %H:%M:%S'),
                    'fecha_': fila[6],
                }
                resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/aperturar_creditos', methods=['POST'])
@cross_origin()
@login_required
def saveCreditos():
    if 'id_creditos' in request.json:
        editCreditos()
    else:
        createCreditos()
    return "ok"

def createCreditos():
    try:
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0
        with mysql.connection.cursor() as cur:
            query_venta = ( "SELECT id_det_ventas, tipo_comprobante "
                            "FROM ventas "
                            "WHERE identificador_ventas = %s "
                            "AND tipo_comprobante LIKE %s "
                            "ORDER BY id_det_ventas DESC")
            data_params_venta = (usuarioLlave, request.json['tipo_comprobante'])
            cur.execute(query_venta, data_params_venta)
            id_detalle_ventas = cur.fetchall()[0][0]

            query = ("INSERT INTO `creditos` (`id_creditos`, `sucursal_cre`, `id_detalle`, `efectivo`, `tarjeta`, `tasa`, `a_monto`, `a_interes`, "
                     "`saldo_monto`, `saldo_interes`, `saldo_total`, `saldo_perdida`, `fecha_cre`, `id_usuario`, `identificador_cre`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['sucursal_cre'], id_detalle_ventas, dato_cero, dato_cero, request.json['tasa'], dato_cero, dato_cero, request.json['saldo_monto'], 
                    request.json['saldo_interes'], request.json['saldo_total'], dato_cero, request.json['fecha_cre'], usuarioId, usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()

        return jsonify({"status": "success", "message": "Crédito aperturado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def editCreditos():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `ventas` SET `efectivo` = %s, `tarjeta` = %s, `tasa` = %s, `a_monto` = %s, `a_interes` = %s, `saldo_monto` = %s, `saldo_interes` = %s, `saldo_total` = %s, `saldo_perdida` = %s "
                     "WHERE `ventas`.`id_creditos` = %s "
                     "AND identificador_ventas = %s ")
            data = (request.json['modo_efectivo'], request.json['modo_credito'], request.json['modo_tarjeta'], request.json['modo_perdida'], 
                    request.json['total_venta'], request.json['saldo_perdida'], request.json['id_det_ventas'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Crédito editado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@app.route('/api/operar_creditos', methods=['POST'])
@cross_origin()
@login_required
def operarCreditos():
    try:
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')

        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `creditos` (`id_creditos`, `sucursal_cre`, `id_detalle`, `efectivo`, `tarjeta`, `tasa`, `a_monto`, `a_interes`, "
                     "`saldo_monto`, `saldo_interes`, `saldo_total`, `saldo_perdida`, `fecha_cre`, `id_usuario`, `identificador_cre`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['sucursal_cre'], request.json['id_detalle'], request.json['efectivo'], request.json['tarjeta'], request.json['tasa'], 
                    request.json['a_monto'], request.json['a_interes'], request.json['saldo_monto'], request.json['saldo_interes'], 
                    request.json['saldo_total'], request.json['saldo_perdida'], request.json['fecha_cre'], usuarioId, usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Crédito operado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@app.route('/api/creditos/<int:id_cre>', methods=['DELETE'])
@cross_origin()
@login_required
def removeCreditos(id_cre):
    try:
        with mysql.connection.cursor() as cur:
            query = "DELETE FROM creditos WHERE `creditos`.`id_creditos` = %s"
            cur.execute(query, (id_cre,))
            mysql.connection.commit()
        return "Fila eliminada."
    except Exception as e:
        return jsonify({'error': str(e)}), 500  
##########################################################################################################################################################################
# Datos de la tabla CATEGORÍAS
##########################################################################################################################################################################
@app.route('/api/categorias_conteo')
@cross_origin()
@login_required
def getAllCategoriasConteo():
    try:
        usuarioLlave = session.get('usernameDos')

        categoria_categorias = request.args.get('categoria_categorias')
        unidad_categorias = request.args.get('unidad_categorias')
        cantidad_categorias = request.args.get('cantidad_categorias')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) "
                        "FROM categorias "
                        "WHERE `identificador` = %s "
                        "AND categoria_nombre LIKE %s "
                        "AND unidad_medida LIKE %s "
                        "AND cantidad_item LIKE %s")
            data_params = (usuarioLlave, f"{categoria_categorias}%", f"{unidad_categorias}%", f"{cantidad_categorias}%")
            cur.execute(query, data_params)
            data = cur.fetchone()[0]
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categorias_tabla/<int:numero>')
@cross_origin()
@login_required
def getAllCategorias(numero):
    try:
        usuarioLlave = session.get('usernameDos')

        categoria_categorias = request.args.get('categoria_categorias')
        unidad_categorias = request.args.get('unidad_categorias')
        cantidad_categorias = request.args.get('cantidad_categorias')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT id, categoria_nombre, unidad_medida, cantidad_item, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez, once, doce "
                        "FROM categorias "
                        "WHERE identificador = %s "
                        "AND categoria_nombre LIKE %s "
                        "AND unidad_medida LIKE %s "
                        "AND cantidad_item LIKE %s "
                        "ORDER BY id ASC "
                        "LIMIT 10 OFFSET %s")
            data_params = (usuarioLlave, f"{categoria_categorias}%", f"{unidad_categorias}%", f"{cantidad_categorias}%", numero)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id': fila[0],
                'categoria_nombre': fila[1],
                'unidad_medida': fila[2],
                'cantidad_item': fila[3], 
                'uno': fila[4], 
                'dos':fila[5], 
                'tres': fila[6], 
                'cuatro': fila[7], 
                'cinco':fila[8], 
                'seis': fila[9],
                'siete': fila[10],
                'ocho': fila[11],
                'nueve': fila[12],
                'diez': fila[13],
                'once': fila[14],
                'doce': fila[15]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categorias')
@cross_origin()
@login_required
def getAllCategoriasLlenar():
    try:
        usuarioLlave = session.get('usernameDos')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT id, categoria_nombre, unidad_medida, cantidad_item, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez, once, doce "
                     "FROM categorias "
                     "WHERE `identificador` = %s")
            cur.execute(query, (usuarioLlave,))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id': fila[0],
                'categoria_nombre': fila[1],
                'unidad_medida': fila[2],
                'cantidad_item': fila[3], 
                'uno': fila[4], 
                'dos':fila[5], 
                'tres': fila[6], 
                'cuatro': fila[7], 
                'cinco':fila[8], 
                'seis': fila[9],
                'siete': fila[10],
                'ocho': fila[11],
                'nueve': fila[12],
                'diez': fila[13],
                'once': fila[14],
                'doce': fila[15]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categorias', methods=['POST'])
@cross_origin()
@login_required
def saveCategorias():
    if 'id' in request.json:
        editCategorias()
    else:
        createCategorias()
    return "ok"

def createCategorias():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `categorias` "
                     "(`id`, `categoria_nombre`, `unidad_medida`, `cantidad_item`, `uno`, `dos`, `tres`, `cuatro`, `cinco`, `seis`, `siete`, `ocho`, "
                     "`nueve`, `diez`, `once`, `doce`, `identificador`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['categoria_nombre'], request.json['unidad_medida'], request.json['cantidad_item'], request.json['uno'], request.json['dos'], 
                    request.json['tres'], request.json['cuatro'], request.json['cinco'], request.json['seis'], request.json['siete'], request.json['ocho'], 
                    request.json['nueve'], request.json['diez'], request.json['once'], request.json['doce'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Categoría creada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def editCategorias():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `categorias` SET `categoria_nombre` = %s, `unidad_medida` = %s, `cantidad_item` = %s, `uno` = %s, `dos` = %s, `tres` = %s, "
                     "`cuatro` = %s, `cinco` = %s, `seis` = %s, `siete` = %s, `ocho` = %s, `nueve` = %s, `diez` = %s, `once` = %s, `doce` = %s "
                     "WHERE `categorias`.`id` = %s "
                     "AND `identificador` = %s")
            data = (request.json['categoria_nombre'], request.json['unidad_medida'], request.json['cantidad_item'], request.json['uno'], request.json['dos'], 
                    request.json['tres'], request.json['cuatro'], request.json['cinco'], request.json['seis'], request.json['siete'], request.json['ocho'], 
                    request.json['nueve'], request.json['diez'], request.json['once'], request.json['doce'], request.json['id'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Categoría actualizada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@app.route('/api/categorias/<int:id>', methods=['DELETE'])
@cross_origin()
@login_required
def removeCategorias(id):
    try:
        with mysql.connection.cursor() as cur:
            query = "DELETE FROM categorias WHERE `categorias`.`id` = %s"
            cur.execute(query, (id,))
            mysql.connection.commit()
        return "Categoria eliminada."
    except Exception as e:
        return jsonify({'error': str(e)}), 500    
##########################################################################################################################################################################
# Datos de la tabla NUMERACIÓN_COMPROBANTE
##########################################################################################################################################################################
@app.route('/api/numeracion_comprobante_control')#CONTROL
@cross_origin()
@login_required
def getAllNumeracionComprobanteControl():
    try:
        with mysql.connection.cursor() as cur:
            query = ("SELECT id, compras, recompras, transferencias, ventas, nota_venta, boleta_venta, factura "
                     "FROM numeracion_comprobante")
            cur.execute(query)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id': fila[0],
                'compras': fila[1],
                'recompras': fila[2],
                'transferencias': fila[3],
                'ventas': fila[4],
                'nota_venta': fila[5],
                'boleta_venta': fila[6],
                'factura': fila[7]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
#####################################################################################################
@app.route('/api/numeracion_comprobante')
@cross_origin()
@login_required
def getAllNumeracionComprobante():
    try:
        usuarioLlave = session.get('usernameDos')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id, compras, recompras, transferencias, ventas, nota_venta, boleta_venta, factura "
                     "FROM numeracion_comprobante "
                     "WHERE `identificador` = %s")
            cur.execute(query, (usuarioLlave,))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id': fila[0],
                'compras': fila[1],
                'recompras': fila[2],
                'transferencias': fila[3],
                'ventas': fila[4],
                'nota_venta': fila[5],
                'boleta_venta': fila[6],
                'factura': fila[7]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/numeracion_comprobante', methods=['POST'])
@cross_origin()
@login_required
def saveNumeracionComprobante():
    if 'id' in request.json:
        editNumeracionComprobante()
    else:
        createNumeracionComprobante()
    return "ok"

def createNumeracionComprobante():
    try:
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `numeracion_comprobante` (`id`, `compras`, `recompras`, `transferencias`, `ventas`, `nota_venta`, `boleta_venta`, `factura`, `identificador`, "
                     "`nombre_empresa`, `ruc`, `direccion`, `moneda`, `web`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            dato = (request.json['compras'], request.json['recompras'], request.json['transferencias'], request.json['ventas'], request.json['nota_venta'], 
                    request.json['boleta_venta'], request.json['factura'], request.json['identificador'], request.json['nombre_empresa'], request.json['ruc'], 
                    request.json['direccion'], request.json['moneda'], request.json['web'])
            cur.execute(query, dato)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Numeración creada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def editNumeracionComprobante():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `numeracion_comprobante` SET `compras` = %s, `recompras` = %s, `transferencias` = %s, `ventas` = %s, `nota_venta` = %s, `boleta_venta` = %s, `factura` = %s "
                     "WHERE `numeracion_comprobante`.`id` = %s "
                     "AND identificador = %s")
            data = (request.json['compras'], request.json['recompras'], request.json['transferencias'], request.json['ventas'], request.json['nota_venta'], 
                    request.json['boleta_venta'], request.json['factura'], request.json['id'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Numeración actualizada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@app.route('/api/numeracion_comprobante/<int:id>', methods=['DELETE'])
@cross_origin()
@login_required
def removeNumeracionComprobante(id):
    try:
        with mysql.connection.cursor() as cur:
            query = "DELETE FROM numeracion_comprobante WHERE `numeracion_comprobante`.`id` = %s"
            cur.execute(query, (id,))
            mysql.connection.commit()
        return "numeración eliminada"  
    except Exception as e:
        return jsonify({'error': str(e)}), 500  
#########################################
@app.route('/api/numeracion_comprobante_datos')
@cross_origin()
@login_required
def getNumeracionDatos():
    try:
        usuarioLlave = session.get('usernameDos')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id, nombre_empresa, ruc, direccion, moneda, web FROM numeracion_comprobante WHERE `identificador` = %s")
            cur.execute(query, (usuarioLlave,))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id': fila[0],
                'nombre_empresa': fila[1],
                'ruc': fila[2],
                'direccion': fila[3],
                'moneda': fila[4],
                'web': fila[5]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/numeracion_comprobante_datos', methods=['POST'])
@cross_origin()
@login_required
def editNumeracionDatos():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `numeracion_comprobante` SET `nombre_empresa` = %s, `ruc` = %s, `direccion` = %s, `moneda` = %s, `web` = %s "
                     "WHERE `numeracion_comprobante`.`id` = %s "
                     "AND identificador = %s")
            data = (request.json['nombre_empresa'], request.json['ruc'], request.json['direccion'], request.json['moneda'], 
                    request.json['web'], request.json['id'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Numeración actualizada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
##########################################################################################################################################################################
# Datos de la tabla DETALLE VENTAS
##########################################################################################################################################################################
@app.route('/api/ventas_conteo')
@cross_origin()
@login_required
def getAllVentasConteo():
    try:
        usuarioLlave = session.get('usernameDos')

        sucursal_det_venta = request.args.get('sucursal_det_venta')
        comprobante_det_venta = request.args.get('comprobante_det_venta')
        tipComp_det_venta = request.args.get('tipComp_det_venta')
        cliente_det_venta = request.args.get('cliente_det_venta')
        fecha_inicio_det_venta_str = request.args.get('fecha_inicio_det_venta')
        fecha_fin_det_venta_str = request.args.get('fecha_fin_det_venta')
        
        fecha_inicio_det_venta = datetime.strptime(fecha_inicio_det_venta_str, '%Y-%m-%d')
        fecha_fin_det_venta = datetime.strptime(fecha_fin_det_venta_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) "
                        "FROM ventas "
                        "JOIN sucursales ON `ventas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "JOIN clientes ON `ventas`.`dni_cliente` = `clientes`.`id_cli` "
                        "WHERE `identificador_ventas` = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND tipo_comprobante LIKE %s "
                        "AND nombre_cli LIKE %s "
                        "AND fecha_det_ventas >= %s AND fecha_det_ventas < %s ")
            data_params = (usuarioLlave, f"{sucursal_det_venta}%", f"{comprobante_det_venta}%", f"{tipComp_det_venta}%", f"{cliente_det_venta}%", 
                        fecha_inicio_det_venta, fecha_fin_det_venta + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ventas_tabla/<int:numero>')
@cross_origin()
@login_required
def getAllVentas(numero):
    try:
        usuarioLlave = session.get('usernameDos')

        sucursal_det_venta = request.args.get('sucursal_det_venta')
        comprobante_det_venta = request.args.get('comprobante_det_venta')
        tipComp_det_venta = request.args.get('tipComp_det_venta')
        cliente_det_venta = request.args.get('cliente_det_venta')
        fecha_inicio_det_venta_str = request.args.get('fecha_inicio_det_venta')
        fecha_fin_det_venta_str = request.args.get('fecha_fin_det_venta')
        
        fecha_inicio_det_venta = datetime.strptime(fecha_inicio_det_venta_str, '%Y-%m-%d')
        fecha_fin_det_venta = datetime.strptime(fecha_fin_det_venta_str, '%Y-%m-%d')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id_det_ventas, sucursal_nombre, comprobante, tipo_comprobante, nombre_cli, modo_efectivo, modo_credito, modo_tarjeta, modo_perdida, total_venta, fecha_det_ventas, canal_venta "
                        "FROM ventas "
                        "JOIN sucursales ON `ventas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "JOIN clientes ON `ventas`.`dni_cliente` = `clientes`.`id_cli` "
                        "WHERE identificador_ventas = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND tipo_comprobante LIKE %s "
                        "AND nombre_cli LIKE %s "
                        "AND fecha_det_ventas >= %s AND fecha_det_ventas < %s "
                        "ORDER BY id_det_ventas ASC "
                        "LIMIT 20 OFFSET %s")
            data_params = (usuarioLlave, f"{sucursal_det_venta}%", f"{comprobante_det_venta}%", f"{tipComp_det_venta}%", f"{cliente_det_venta}%", 
                        fecha_inicio_det_venta, fecha_fin_det_venta + timedelta(days=1), numero)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id_det_ventas': fila[0],
                'sucursal_nombre': fila[1],
                'comprobante': fila[2],
                'tipo_comprobante': fila[3],
                'nombre_cli': fila[4],
                'modo_efectivo': fila[5],
                'modo_credito': fila[6],
                'modo_tarjeta': fila[7],
                'modo_perdida': fila[8],
                'total_venta': fila[9],
                'fecha_det_ventas': fila[10].strftime('%d-%m-%Y'),
                'canal_venta': fila[11],
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/clientes_reporte')
@cross_origin()
@login_required
def getClientesReporte():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = (   "SELECT nombre_cli, "
                        "SUM(modo_efectivo) AS pago_efectivo, "
                        "SUM(modo_tarjeta) AS pago_tarjeta, "
                        "SUM(modo_credito) AS pago_credito, "
                        "SUM(modo_perdida) AS pago_devoluciones, "
                        "SUM(CASE WHEN canal_venta = 1 THEN (+1) ELSE 0 END) AS delivery, "
                        "SUM(CASE WHEN canal_venta = 0 THEN (+1) ELSE 0 END) AS local, "
                        "MAX(fecha_det_ventas) AS ultima_venta, "
                        "MIN(fecha_det_ventas) AS primera_venta, "
                        "telefono_cli "
                        "FROM ventas "
                        "JOIN clientes ON `ventas`.`dni_cliente` = `clientes`.`id_cli` "
                        "WHERE `identificador_ventas` = %s "
                        "GROUP BY nombre_cli ASC")
            data_params = (usuarioLlave,)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                        'nombre_cli': fila[0],
                        'pago_efectivo': fila[1],
                        'pago_tarjeta': fila[2],
                        'pago_credito':fila[3],
                        'pago_devoluciones': fila[4],
                        'delivery': fila[5],
                        'local': fila[6],
                        'ultima_venta': fila[7].strftime('%d-%m-%Y'),
                        'primera_venta': fila[8].strftime('%d-%m-%Y'),
                        'telefono_cli': fila[9]
                        }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
   

@app.route('/api/ventas_tabla_reporte')#SALIDAS
@cross_origin()
@login_required
def getAllVentasReporte():
    try:
        usuarioLlave = session.get('usernameDos')

        fecha_inicio_det_venta_str = request.args.get('fecha_inicio_det_venta')
        fecha_fin_det_venta_str = request.args.get('fecha_fin_det_venta')
        
        fecha_inicio_det_venta = datetime.strptime(fecha_inicio_det_venta_str, '%Y-%m-%d')
        fecha_fin_det_venta = datetime.strptime(fecha_fin_det_venta_str, '%Y-%m-%d')

        with mysql.connection.cursor() as cur:
            query = ("SELECT sucursal_nombre, SUM(modo_efectivo) AS suma_efectivo, SUM(modo_credito) AS suma_credito, SUM(modo_tarjeta) AS suma_tarjeta, SUM(modo_perdida) AS suma_perdida "
                        "FROM ventas "
                        "JOIN sucursales ON `ventas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "WHERE identificador_ventas = %s "
                        "AND fecha_det_ventas >= %s AND fecha_det_ventas < %s "
                        "GROUP BY sucursal_nombre")
            data_params = (usuarioLlave, fecha_inicio_det_venta, fecha_fin_det_venta + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = {
                'sucursal_nombre': fila[0],
                'suma_efectivo': fila[1],
                'suma_credito': fila[2],
                'suma_tarjeta': fila[3],
                'suma_perdida': fila[4]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ventas_grafico')#DETALLE DE VENTAS
@cross_origin()
@login_required
def getAllVentasGrafico():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha_det_ventas) AS mes, sucursal, "
                     "SUM(modo_efectivo) AS suma_efectivo, SUM(modo_tarjeta) AS suma_tarjeta, "
                     "SUM(modo_credito) AS suma_credito, SUM(modo_perdida) AS suma_perdida, "
                     "COUNT(*) AS conteo, "
                     "SUM(CASE WHEN canal_venta = 1 THEN canal_venta ELSE 0 END) AS suma_delivery, "
                     "SUM(CASE WHEN modo_efectivo > 0 THEN (+1) ELSE 0 END) AS suma_conteo_efectivo, "
                     "SUM(CASE WHEN modo_tarjeta > 0 THEN (+1) ELSE 0 END) AS suma_conteo_tarjeta, "
                     "SUM(CASE WHEN modo_credito > 0 THEN (+1) ELSE 0 END) AS suma_conteo_credito, "
                     "SUM(CASE WHEN modo_perdida > 0 THEN (+1) ELSE 0 END) AS suma_conteo_perdida "
                     "FROM ventas "
                     "WHERE `identificador_ventas` = %s "
                     "AND YEAR(fecha_det_ventas) = %s "
                     "GROUP BY mes, sucursal")
            cur.execute(query, (usuarioLlave, year_actual))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'suma_efectivo': fila[2],
                'suma_tarjeta': fila[3],
                'suma_credito': fila[4],
                'suma_perdida': fila[5],
                'conteo': fila[6],
                'suma_delivery': int(fila[7]),
                'suma_conteo_efectivo': int(fila[8]),
                'suma_conteo_tarjeta': int(fila[9]),
                'suma_conteo_credito': int(fila[10]),
                'suma_conteo_perdida': int(fila[11]),
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###----------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/ventas_conteo_frecuencia')#Estadisticas
@cross_origin()
@login_required
def getAllVentasFrecuencia():
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_det_venta = request.args.get('sucursal_det_venta')
        year_actual = datetime.now().year
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) AS conteo_total, MONTH(fecha_det_ventas) AS mes, sucursal, MAX(total_venta) AS monto_maximo, MIN(total_venta) AS monto_minimo "
                        "FROM ventas "
                        "WHERE `identificador_ventas` = %s "
                        "AND sucursal LIKE %s "
                        "AND YEAR(fecha_det_ventas) = %s "
                        "GROUP BY mes, sucursal "
                        "ORDER BY mes ASC")
            data_params = (usuarioLlave, f"{sucursal_det_venta}", year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = {
                'conteo_total': fila[0],
                'mes': fila[1],
                'sucursal': fila[2],
                'monto_maximo': fila[3],
                'monto_minimo': fila[4]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/ventas_conteo_montos')#Estadisticas
@cross_origin()
@login_required
def getAllVentasConteoMontos():
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_det_venta = request.args.get('sucursal_det_venta')
        year_actual = request.args.get('year_actual')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha_det_ventas) AS mes, total_venta  "
                        "FROM ventas "
                        "WHERE `identificador_ventas` = %s "
                        "AND sucursal = %s "
                        "AND YEAR(fecha_det_ventas) = %s "
                        "ORDER BY mes ASC")
            data_params = (usuarioLlave, f"{sucursal_det_venta}", year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = {
                'mes': fila[0],
                'total_venta': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

###----------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/ventas_comprobante/<string:comprobante>')#SALIDAS, DEVOLUCION
@cross_origin()
@login_required
def getVentasComprobante(comprobante):
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("SELECT id_det_ventas, modo_efectivo, modo_credito, modo_tarjeta, modo_perdida, total_venta "
                     "FROM ventas "
                     "WHERE `identificador_ventas` = %s "
                     "AND comprobante LIKE %s")
            cur.execute(query, (usuarioLlave, comprobante))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = {
                'id_det_ventas': fila[0],
                'modo_efectivo': fila[1],
                'modo_credito': fila[2],
                'modo_tarjeta':fila[3],
                'modo_perdida': fila[4],
                'total_venta': fila[5]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###----------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/ventas_cliente_conteo/<int:dni_cliente>')#VENTAS
@cross_origin()
@login_required
def getVentasCliente(dni_cliente):
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(dni_cliente) AS conteo_cliente, "
                     "SUM(total_venta) AS suma_total "
                     "FROM ventas "
                     "WHERE `identificador_ventas` = %s "
                     "AND dni_cliente LIKE %s")
            cur.execute(query, (usuarioLlave, dni_cliente))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = {
                'conteo_cliente': fila[0],
                'suma_total': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###----------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/ventas', methods=['POST'])
@cross_origin()
@login_required
def saveVentas():
    if 'id_det_ventas' in request.json:
        editVentas()
    else:
        createVentas()
    return "ok"

def createVentas():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `ventas` (`id_det_ventas`, `sucursal`, `comprobante`, `tipo_comprobante`, `dni_cliente`, `modo_efectivo`, `modo_credito`, "
                     "`modo_tarjeta`, `modo_perdida`, `total_venta`, `fecha_det_ventas`, `identificador_ventas`, `canal_venta`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['sucursal'],request.json['comprobante'], request.json['tipo_comprobante'], request.json['dni_cliente'], request.json['modo_efectivo'], 
                    request.json['modo_credito'], request.json['modo_tarjeta'], request.json['modo_perdida'], request.json['total_venta'], request.json['fecha_det_ventas'], 
                    usuarioLlave, request.json['canal_venta'])
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Detalle de venta creado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def editVentas():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `ventas` SET `modo_efectivo` = %s, `modo_credito` = %s, `modo_tarjeta` = %s, `modo_perdida` = %s, `total_venta` = %s "
                     "WHERE `ventas`.`id_det_ventas` = %s "
                     "AND identificador_ventas = %s ")
            data = (request.json['modo_efectivo'], request.json['modo_credito'], request.json['modo_tarjeta'], request.json['modo_perdida'], 
                    request.json['total_venta'], request.json['id_det_ventas'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Detalle de venta actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@app.route('/api/ventas/<int:id_det_ventas>', methods=['DELETE'])
@cross_origin()
@login_required
def removeVentas(id_det_ventas):
    try:
        with mysql.connection.cursor() as cur:
            query = "DELETE FROM ventas WHERE `ventas`.`id_det_ventas` = %s"
            cur.execute(query, (id_det_ventas,))
            mysql.connection.commit()
        return "Venta eliminada"
    except Exception as e:
        return jsonify({'error': str(e)}), 500   
##########################################################################################################################################################################
# Datos de la tabla USUARIOS
##########################################################################################################################################################################

@app.route('/api/usuarios_conteo')#Control
@cross_origin()
@login_required
def getAllUsuariosConteo():
    try:
        id_usuarios = request.args.get('id_usuarios')
        nombres_usuarios = request.args.get('nombres_usuarios')
        apellidos_usuarios = request.args.get('apellidos_usuarios')
        dni_usuarios = request.args.get('dni_usuarios')
        e_mail_usuarios = request.args.get('e_mail_usuarios')
        telefono_usuarios = request.args.get('telefono_usuarios')
        cargo_usuarios = request.args.get('cargo_usuarios')
        vinculacion_usuarios = request.args.get('vinculacion_usuarios')
        clave_usuarios = request.args.get('clave_usuarios')

        fecha_inicio_usuarios_str = request.args.get('fecha_inicio_usuarios')
        fecha_fin_usuarios_str = request.args.get('fecha_fin_usuarios')
        
        fecha_inicio_usuarios = datetime.strptime(fecha_inicio_usuarios_str, '%Y-%m-%d')
        fecha_fin_usuarios = datetime.strptime(fecha_fin_usuarios_str, '%Y-%m-%d')

        sucursales_usuarios = request.args.get('sucursales_usuarios')
        usuarios_usuarios = request.args.get('usuarios_usuarios')

        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) "
                    "FROM usuarios "
                    "WHERE id LIKE %s "
                    "AND nombres LIKE %s "
                    "AND apellidos LIKE %s "
                    "AND dni LIKE %s "
                    "AND e_mail LIKE %s "
                    "AND telefono LIKE %s "
                    "AND cargo LIKE %s "
                    "AND vinculacion LIKE %s "
                    "AND clave LIKE %s "
                    "AND fecha >= %s AND fecha < %s"
                    "AND num_sucursales LIKE %s "
                    "AND num_usuarios LIKE %s")
            data_params = (f"{id_usuarios}%", f"{nombres_usuarios}%", f"{apellidos_usuarios}%", f"{dni_usuarios}%", 
                            f"{e_mail_usuarios}%", f"{telefono_usuarios}%", f"{cargo_usuarios}%", f"{vinculacion_usuarios}%",
                            f"{clave_usuarios}%", fecha_inicio_usuarios, fecha_fin_usuarios + timedelta(days=1), f"{sucursales_usuarios}%", f"{usuarios_usuarios}%")
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/usuarios_tabla/<int:numero>')#Control
@cross_origin()
@login_required
def getAllUsuarios(numero):
    try:
        id_usuarios = request.args.get('id_usuarios')
        nombres_usuarios = request.args.get('nombres_usuarios')
        apellidos_usuarios = request.args.get('apellidos_usuarios')
        dni_usuarios = request.args.get('dni_usuarios')
        e_mail_usuarios = request.args.get('e_mail_usuarios')
        telefono_usuarios = request.args.get('telefono_usuarios')
        cargo_usuarios = request.args.get('cargo_usuarios')
        vinculacion_usuarios = request.args.get('vinculacion_usuarios')
        clave_usuarios = request.args.get('clave_usuarios')

        fecha_inicio_usuarios_str = request.args.get('fecha_inicio_usuarios')
        fecha_fin_usuarios_str = request.args.get('fecha_fin_usuarios')
        
        fecha_inicio_usuarios = datetime.strptime(fecha_inicio_usuarios_str, '%Y-%m-%d')
        fecha_fin_usuarios = datetime.strptime(fecha_fin_usuarios_str, '%Y-%m-%d')

        sucursales_usuarios = request.args.get('sucursales_usuarios')
        usuarios_usuarios = request.args.get('usuarios_usuarios')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id, nombres, apellidos, dni, e_mail, telefono, cargo, vinculacion, clave, fecha, num_sucursales, num_usuarios, ultimo_pago "
                    "FROM usuarios "
                    "WHERE id LIKE %s "
                    "AND nombres LIKE %s "
                    "AND apellidos LIKE %s "
                    "AND dni LIKE %s "
                    "AND e_mail LIKE %s "
                    "AND telefono LIKE %s "
                    "AND cargo LIKE %s "
                    "AND vinculacion LIKE %s "
                    "AND clave LIKE %s "
                    "AND fecha >= %s AND fecha < %s "
                    "AND num_sucursales LIKE %s "
                    "AND num_usuarios LIKE %s "
                    "ORDER BY id ASC "
                    "LIMIT 20 OFFSET %s")
            data_params = (f"{id_usuarios}%", f"{nombres_usuarios}%", f"{apellidos_usuarios}%", f"{dni_usuarios}%", 
                            f"{e_mail_usuarios}%", f"{telefono_usuarios}%", f"{cargo_usuarios}%", f"{vinculacion_usuarios}%",
                            f"{clave_usuarios}%", fecha_inicio_usuarios, fecha_fin_usuarios + timedelta(days=1), f"{sucursales_usuarios}%", f"{usuarios_usuarios}%", numero)
            cur.execute(query, data_params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'id': fila[0],
                'nombres': fila[1],
                'apellidos': fila[2],
                'dni': fila[3],
                'e_mail': fila[4],
                'telefono': fila[5],
                'cargo': fila[6],
                'vinculacion': fila[7],
                'clave': fila[8],
                'fecha': fila[9].strftime('%d-%m-%Y'),
                'num_sucursales': fila[10],
                'num_usuarios': fila[11],
                'ultimo_pago': fila[12].strftime('%d-%m-%Y')
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/usuarios_tabla_local')#Configuración
@cross_origin()
@login_required
def getAllUsuariosLocal():
    try:
        usuarioLlave = session.get('usernameDos')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id, nombres, apellidos, dni, e_mail, telefono, cargo, clave, fecha "
                    "FROM usuarios "
                    "WHERE vinculacion = %s "
                    "AND clave != 0 "
                    "AND clave != 3 "
                    "AND clave != 7 "
                    "ORDER BY id ASC ")
            cur.execute(query, (usuarioLlave,))
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'id': fila[0],
                'nombres': fila[1],
                'apellidos': fila[2],
                'dni': fila[3],
                'e_mail': fila[4],
                'telefono': fila[5],
                'cargo': fila[6],
                'clave': fila[7],
                'fecha': fila[8].strftime('%d-%m-%Y')
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/usuarios_busqueda/<int:id>')#Control
@cross_origin()
@login_required
def getUsuario(id):
    try:
        with mysql.connection.cursor() as cur:
            query = ("SELECT id, num_sucursales, num_usuarios FROM usuarios "
                     "WHERE id = %s ")
            cur.execute(query, (id,))
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                'id': fila[0],
                'num_sucursales': fila[1],
                'num_usuarios': fila[2]
                }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/usuarios', methods=['POST'])#Control
@cross_origin()
@login_required
def saveUsuarios():
    if 'id' in request.json:
        editUsuarios()
    else:
        createUsuarios()
    return "ok"

def createUsuarios():
    try:
        with mysql.connection.cursor() as cur:
            consulta = ("INSERT INTO `usuarios` (`id`, `nombres`, `apellidos`, `dni`, `e_mail`, `telefono`, `cargo`, `vinculacion`, `passw`, `clave`, `fecha`, `num_sucursales`, `num_usuarios`, `ultimo_pago`) "
                        "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, 0, %s, %s, %s, %s)")
            valores = (request.json['nombres'], request.json['apellidos'], request.json['dni'], request.json['e_mail'], request.json['telefono'], 
                       request.json['cargo'], request.json['vinculacion'], generate_password_hash(request.json['passw']), request.json['fecha'], 
                       request.json['num_sucursales'], request.json['num_usuarios'], request.json['fecha'])
            cur.execute(consulta,valores)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Usuario creado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def editUsuarios():
    try:
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `usuarios` SET `nombres` = %s, `apellidos` = %s, `dni` = %s, `e_mail` = %s, `telefono` = %s, `cargo` = %s, `vinculacion` = %s "
                     "WHERE `usuarios`.`id` = %s;")
            data = (request.json['nombres'], request.json['apellidos'], request.json['dni'], request.json['e_mail'], request.json['telefono'], request.json['cargo'], 
                    request.json['vinculacion'], request.json['id'])
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Usuario actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@app.route('/api/usuarios_passw', methods=['POST'])#Control
@cross_origin()
@login_required
def editPassw():
    try:
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `usuarios` SET `passw` = %s "
                     "WHERE `usuarios`.`id` = %s;")
            data = (generate_password_hash(request.json['passw']), request.json['id'])
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Password actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@app.route('/api/usuarios_acciones', methods=['POST'])#Control
@cross_origin()
@login_required
def editAcciones():
    try:
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `usuarios` SET `vinculacion` = %s, `clave` = %s, `num_sucursales` = %s, `num_usuarios` = %s "
                     "WHERE `usuarios`.`id` = %s;")
            data = (request.json['vinculacion'], request.json['clave'], request.json['num_sucursales'], request.json['num_usuarios'], request.json['id'])
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Password actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@app.route('/registro',methods=['POST'])#login
def registro():
    try:
        with mysql.connection.cursor() as cur:
            consulta = ("INSERT INTO `usuarios` (`id`, `nombres`, `apellidos`, `dni`, `e_mail`, `telefono`, `cargo`, `vinculacion`, `passw`, `clave`, `fecha`, `num_sucursales`, `num_usuarios`, `ultimo_pago`) "
                        "VALUES (NULL, %s, %s, %s, %s, %s, 201, 0, %s, 0, %s, 1, 1, %s)")
            valores = (request.json['nombres'], request.json['apellidos'], request.json['dni'], request.json['e_mail'], request.json['telefono'], 
                        generate_password_hash(request.json['passw']), request.json['fecha'], request.json['fecha'])
            cur.execute(consulta,valores)
            mysql.connection.commit()
        return render_template('login.html')
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@app.route('/registroInterno',methods=['POST'])#configuración
@cross_origin()
@login_required
def saveUsuariosInterno():
    if 'id' in request.json:
        registroInternoEdit()
    else:
        registroInternoCreate()
    return "ok"
def registroInternoCreate():
    try:
        with mysql.connection.cursor() as cur:
            usuarioLlave = session.get('usernameDos')
            consulta = ("INSERT INTO `usuarios` (`id`, `nombres`, `apellidos`, `dni`, `e_mail`, `telefono`, `cargo`, `vinculacion`, `passw`, `clave`, `fecha`, `num_sucursales`, `num_usuarios`, `ultimo_pago`) "
                        "VALUES (NULL, %s, %s, %s, %s, %s, %s, "+ str(usuarioLlave) +', %s, 0, %s, 0, 0, %s)')
            valores = (request.json['nombres'], request.json['apellidos'], request.json['dni'], request.json['e_mail'], request.json['telefono'], request.json['cargo'], 
                    generate_password_hash(request.json['passw']), request.json['fecha'], request.json['fecha'])
            cur.execute(consulta,valores)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Usuario creado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    

def registroInternoEdit():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `usuarios` SET `nombres` = %s, `apellidos` = %s, `dni` = %s, `e_mail` = %s, `telefono` = %s, `passw` = %s "
                        "WHERE `usuarios`.`id` = %s "
                        "AND `vinculacion` = %s ")
            data = (request.json['nombres'], request.json['apellidos'], request.json['dni'], request.json['e_mail'], request.json['telefono'], 
                    generate_password_hash(request.json['passw']), request.json['id'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Usuario actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@app.route('/api/usuarios/<int:id>', methods=['DELETE'])
@cross_origin()
@login_required
def removeUsuarios(id):
    try:
        with mysql.connection.cursor() as cur:
            query = "DELETE FROM usuarios WHERE `usuarios`.`id` = %s"
            cur.execute(query, (id,))
            mysql.connection.commit()
        return "Usuario eliminado."
    except Exception as e:
        return jsonify({'error': str(e)}), 500   
##########################################################################################################################################################################
# Datos de la tabla gastos_varios
##########################################################################################################################################################################
@app.route('/api/gastos_varios_conteo')
@cross_origin()
@login_required
def getAllGastosVariosConteo():
    try:
        usuarioLlave = session.get('usernameDos')

        sucursal_gastos_varios = request.args.get('sucursal_gastos_varios')
        concepto_gastos_varios = request.args.get('concepto_gastos_varios')
        comprobante_gastos_varios = request.args.get('comprobante_gastos_varios')
        usuario_gastos_varios = request.args.get('usuario_gastos_varios')
        fecha_inicio_gastos_varios_str = request.args.get('fecha_inicio_gastos_varios')
        fecha_fin_gastos_varios_str = request.args.get('fecha_fin_gastos_varios')
        
        fecha_inicio_gastos_varios = datetime.strptime(fecha_inicio_gastos_varios_str, '%Y-%m-%d')
        fecha_fin_gastos_varios = datetime.strptime(fecha_fin_gastos_varios_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) "
                        "FROM gastos_varios "
                        "JOIN sucursales ON `gastos_varios`.`sucursal_gastos` = `sucursales`.`id_sucursales` "
                        "JOIN usuarios ON `gastos_varios`.`usuario_gastos` = `usuarios`.`id` "
                        "WHERE `identificador_gastos` = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND concepto LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND nombres LIKE %s "
                        "AND fecha_gastos >= %s AND fecha_gastos < %s ")
            data_params = (usuarioLlave, f"{sucursal_gastos_varios}%", f"{concepto_gastos_varios}%", f"{comprobante_gastos_varios}%", f"{usuario_gastos_varios}%", 
                        fecha_inicio_gastos_varios, fecha_fin_gastos_varios + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/gastos_varios_tabla/<int:numero>')
@cross_origin()
@login_required
def getAllGastosVarios(numero):
    try:
        usuarioLlave = session.get('usernameDos')

        sucursal_gastos_varios = request.args.get('sucursal_gastos_varios')
        concepto_gastos_varios = request.args.get('concepto_gastos_varios')
        comprobante_gastos_varios = request.args.get('comprobante_gastos_varios')
        usuario_gastos_varios = request.args.get('usuario_gastos_varios')
        fecha_inicio_gastos_varios_str = request.args.get('fecha_inicio_gastos_varios')
        fecha_fin_gastos_varios_str = request.args.get('fecha_fin_gastos_varios')
        
        fecha_inicio_gastos_varios = datetime.strptime(fecha_inicio_gastos_varios_str, '%Y-%m-%d')
        fecha_fin_gastos_varios = datetime.strptime(fecha_fin_gastos_varios_str, '%Y-%m-%d')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id_gastos, sucursal_nombre, concepto, comprobante, monto, nombres, fecha_gastos, caja_bancos, credito_gastos "
                        "FROM gastos_varios "
                        "JOIN sucursales ON `gastos_varios`.`sucursal_gastos` = `sucursales`.`id_sucursales` "
                        "JOIN usuarios ON `gastos_varios`.`usuario_gastos` = `usuarios`.`id` "
                        "WHERE identificador_gastos = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND concepto LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND nombres LIKE %s "
                        "AND fecha_gastos >= %s AND fecha_gastos < %s "
                        "ORDER BY id_gastos ASC "
                        "LIMIT 20 OFFSET %s")
            data_params = (usuarioLlave, f"{sucursal_gastos_varios}%", f"{concepto_gastos_varios}%", f"{comprobante_gastos_varios}%", f"{usuario_gastos_varios}%", 
                        fecha_inicio_gastos_varios, fecha_fin_gastos_varios + timedelta(days=1), numero)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id_gastos': fila[0],
                'sucursal_nombre': fila[1],
                'concepto': fila[2],
                'comprobante': fila[3],
                'monto': fila[4],
                'nombres': fila[5],
                'fecha_gastos': fila[6].strftime('%d-%m-%Y'), 
                'caja_bancos': fila[7], 
                'credito_gastos': fila[8], 
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/gastos_pago_mercancias/<string:comprobante>')
@cross_origin()
@login_required
def getPagoMercancias(comprobante):
    try:
        usuarioLlave = session.get('usernameDos')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id_gastos, sucursal_nombre, concepto, comprobante, monto, nombres, fecha_gastos, caja_bancos, credito_gastos "
                        "FROM gastos_varios "
                        "JOIN sucursales ON `gastos_varios`.`sucursal_gastos` = `sucursales`.`id_sucursales` "
                        "JOIN usuarios ON `gastos_varios`.`usuario_gastos` = `usuarios`.`id` "
                        "WHERE identificador_gastos = %s "
                        "AND comprobante LIKE %s "
                        "ORDER BY id_gastos ASC ")
            data_params = (usuarioLlave, comprobante)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id_gastos': fila[0],
                'sucursal_nombre': fila[1],
                'concepto': fila[2],
                'comprobante': fila[3],
                'monto': fila[4],
                'nombres': fila[5],
                'fecha_gastos': fila[6].strftime('%d-%m-%Y'), 
                'caja_bancos': fila[7], 
                'credito_gastos': fila[8], 
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/gastos_suma_mes')#Salidas de caja, HOME
@cross_origin()
@login_required
def getSumaGastosPorMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual =  request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT sucursal_gastos, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _mercancía, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _nomina, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _seguridad_social, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _proveedores, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _impuestos, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _servicios, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _alquiler, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _mantenimientos, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _publicidad, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _pago_prestamos, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _depositos, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _otros, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS devoluciones "
                     "FROM gastos_varios "
                     "WHERE `identificador_gastos` = %s "
                     "AND YEAR(fecha_gastos) = %s "
                     "GROUP BY sucursal_gastos")
            data_params = ('1_%', '2_%', '3_%', '4_%', '5_%', '6_%', '7_%', '8_%', '9_%', '12_%', '13_%', '14_%', 'Dev%', usuarioLlave, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                        'sucursal_gastos': fila[0],
                        '_mercancía': fila[1],
                        '_nomina': fila[2],
                        '_seguridad_social': fila[3],
                        '_proveedores': fila[4],
                        '_impuestos': fila[5],
                        '_servicios': fila[6],
                        '_alquiler': fila[7],
                        '_mantenimientos': fila[8],
                        '_publicidad': fila[9],
                        '_pago_prestamos': fila[10],
                        '_depositos': fila[11],
                        '_otros': fila[12],
                        'devoluciones': fila[13]
                        }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/gastos_suma_mes_sucursal')#Salidas de caja
@cross_origin()
@login_required
def getSumaGastosPorMesSucursal():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual =  request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha_gastos) AS mes, "
                     "SUM(CASE WHEN sucursal_nombre = 'Almacén Central' THEN (monto + caja_bancos) ELSE 0 END) AS ac, "
                     "SUM(CASE WHEN sucursal_nombre = 'Sucursal Uno' THEN (monto + caja_bancos) ELSE 0 END) AS su, "
                     "SUM(CASE WHEN sucursal_nombre = 'Sucursal Dos' THEN (monto + caja_bancos) ELSE 0 END) AS sd, "
                     "SUM(CASE WHEN sucursal_nombre = 'Sucursal Tres' THEN (monto + caja_bancos) ELSE 0 END) AS st "
                     "FROM gastos_varios "
                     "JOIN sucursales ON `gastos_varios`.`sucursal_gastos` = `sucursales`.`id_sucursales` "
                     "WHERE `identificador_gastos` = %s "
                     "AND YEAR(fecha_gastos) = %s "
                     "GROUP BY mes")
            data_params = (usuarioLlave, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'ac': fila[1],
                'su': fila[2],
                'sd': fila[3],
                'st': fila[4]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/gastos_varios', methods=['POST'])
@cross_origin()
@login_required
def saveGastosVarios():
    if 'id_gastos' in request.json:
        editGastosVarios()
    else:
        createGastosVarios()
    return "ok"

def createGastosVarios():
    try:
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `gastos_varios` (`id_gastos`, `sucursal_gastos`, `concepto`, `comprobante`, `monto`, `usuario_gastos`, `fecha_gastos`, `identificador_gastos`, "
                     "`caja_bancos`, `credito_gastos`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['sucursal_gastos'], request.json['concepto'], request.json['comprobante'], request.json['monto'], 
                    usuarioId, request.json['fecha_gastos'], usuarioLlave, request.json['caja_bancos'], request.json['credito_gastos'])
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Gasto creado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def editGastosVarios():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `gastos_varios` SET `sucursal_gastos` = %s, `concepto` = %s, `comprobante` = %s, `monto` = %s, `usuario_gastos` = %s "
                     "`caja_bancos` = %s, `credito_gastos` = %s "
                     "WHERE `gastos_varios`.`id_gastos` = %s "
                     "AND identificador_gastos = %s")
            data = (request.json['sucursal_gastos'], request.json['concepto'], request.json['comprobante'], request.json['monto'], 
                    request.json['usuario_gastos'], request.json['caja_bancos'], request.json['credito_gastos'] , request.json['id_gastos'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Gasto actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)}) 
    
@app.route('/api/gastos_varios/<int:id_gastos>', methods=['DELETE'])
@cross_origin()
@login_required
def removeGastosVarios(id_gastos):
    try:
        with mysql.connection.cursor() as cur:
            query = "DELETE FROM gastos_varios WHERE `gastos_varios`.`id_gastos` = %s"
            cur.execute(query, (id_gastos,))
            mysql.connection.commit()
        return "Gasto eliminado."  
    except Exception as e:
        return jsonify({'error': str(e)}), 500 

##########################################################################################################################################################################
# Datos de la tabla caja
##########################################################################################################################################################################
@app.route('/api/caja_conteo')
@cross_origin()
@login_required
def getAllCajaConteo():
    try:
        usuarioLlave = session.get('usernameDos')

        sucursal_aper_caja = request.args.get('sucursal_aper_caja')
        fecha_inicio_aper_caja_str = request.args.get('fecha_inicio_aper_caja')
        fecha_fin_aper_caja_str = request.args.get('fecha_fin_aper_caja')
        
        fecha_inicio_aper_caja = datetime.strptime(fecha_inicio_aper_caja_str, '%Y-%m-%d')
        fecha_fin_aper_caja = datetime.strptime(fecha_fin_aper_caja_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) "
                        "FROM caja "
                        "JOIN sucursales ON `caja`.`sucursal_caja` = `sucursales`.`id_sucursales` "
                        "WHERE `identificador_caja` = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND fecha_caja >= %s AND fecha_caja < %s ")
            data_params = (usuarioLlave, f"{sucursal_aper_caja}%", fecha_inicio_aper_caja, fecha_fin_aper_caja + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/caja_tabla/<int:numero>')
@cross_origin()
@login_required
def getAllCaja(numero):
    try:
        usuarioLlave = session.get('usernameDos')

        sucursal_aper_caja = request.args.get('sucursal_aper_caja')
        fecha_inicio_aper_caja_str = request.args.get('fecha_inicio_aper_caja')
        fecha_fin_aper_caja_str = request.args.get('fecha_fin_aper_caja')
        
        fecha_inicio_aper_caja = datetime.strptime(fecha_inicio_aper_caja_str, '%Y-%m-%d')
        fecha_fin_aper_caja = datetime.strptime(fecha_fin_aper_caja_str, '%Y-%m-%d')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id_caja, sucursal_caja, sucursal_nombre, saldo_apertura, ingresos, egresos, saldo_cierre, fecha_caja, llave_caja "
                        "FROM caja "
                        "JOIN sucursales ON `caja`.`sucursal_caja` = `sucursales`.`id_sucursales` "
                        "WHERE identificador_caja = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND fecha_caja >= %s AND fecha_caja < %s "
                        "ORDER BY id_caja ASC "
                        "LIMIT 20 OFFSET %s")
            data_params = (usuarioLlave, f"{sucursal_aper_caja}%", fecha_inicio_aper_caja, fecha_fin_aper_caja + timedelta(days=1), numero)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id_caja': fila[0],
                'sucursal_caja': fila[1],
                'sucursal_nombre': fila[2],
                'saldo_apertura': fila[3],
                'ingresos': fila[4],
                'egresos': fila[5],
                'saldo_cierre': fila[6],
                'fecha_caja': fila[7].strftime('%d-%m-%Y'),
                'llave_caja': fila[8]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/caja_tabla_diario')
@cross_origin()
@login_required
def getCajaDiario():
    try:
        usuarioLlave = session.get('usernameDos')
        dia_actual = datetime.now().date()

        with mysql.connection.cursor() as cur:
            query = ("SELECT id_caja, sucursal_caja, saldo_apertura, llave_caja, saldo_cierre "
                        "FROM caja "
                        "WHERE identificador_caja = %s "
                        "AND DATE(fecha_caja) = %s "
                        "GROUP BY id_caja, sucursal_caja, saldo_apertura, llave_caja, saldo_cierre")
            data_params = (usuarioLlave, dia_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id_caja': fila[0],
                'sucursal_caja': fila[1],
                'saldo_apertura': fila[2],
                'llave_caja': fila[3],
                'saldo_cierre': fila[4]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/caja/<int:id_caja>')
@cross_origin()
@login_required
def getCaja(id_caja):
    try:
        with mysql.connection.cursor() as cur:
            query = ("SELECT id_caja, sucursal_caja, saldo_apertura, ingresos, egresos, saldo_cierre, fecha_caja, llave_caja FROM caja WHERE id_caja = %s")
            cur.execute(query, (id_caja,))
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                'id_caja': fila[0],
                'sucursal_caja': fila[1],
                'saldo_apertura': fila[2],
                'ingresos': fila[3],
                'egresos': fila[4],
                'saldo_cierre': fila[5],
                'fecha_caja': fila[6],
                'llave_caja': fila[7]
                }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/caja', methods=['POST'])
@cross_origin()
@login_required
def saveCaja():
    if 'id_caja' in request.json:
        editCaja()
    else:
        createCaja()
    return "ok"

def createCaja():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `caja` "
                     "(`id_caja`, `sucursal_caja`, `saldo_apertura`, `ingresos`, `egresos`, `saldo_cierre`, `fecha_caja`, `llave_caja`, `identificador_caja`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['sucursal_caja'], request.json['saldo_apertura'], request.json['ingresos'], request.json['egresos'], 
                    request.json['saldo_cierre'], request.json['fecha_caja'], request.json['llave_caja'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Apertura creada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def editCaja():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `caja` SET `sucursal_caja` = %s, `saldo_apertura` = %s, `ingresos` = %s, `egresos` = %s, `saldo_cierre` = %s, `llave_caja` = %s "
                    "WHERE `caja`.`id_caja` = %s "
                    "AND identificador_caja = %s")
            data = (request.json['sucursal_caja'], request.json['saldo_apertura'], request.json['ingresos'], request.json['egresos'],
                    request.json['saldo_cierre'], request.json['llave_caja'], request.json['id_caja'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Apertura actualizada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)}) 

@app.route('/api/caja/<int:id_caja>', methods=['DELETE'])
@cross_origin()
@login_required
def removeCaja(id_caja):
    try:
        with mysql.connection.cursor() as cur:
            query = "DELETE FROM caja WHERE `caja`.`id_caja` = %s"
            cur.execute(query, (id_caja,))
            mysql.connection.commit()
        return "Saldo eliminado." 
    except Exception as e:
        return jsonify({'error': str(e)}), 500  

##########################################################################################################################################################################
# Datos de la tabla sucursales
##########################################################################################################################################################################
@app.route('/api/sucursales_conteo')#Control
@cross_origin()
@login_required
def getAllSucursalesConteo():
    try:
        nombre_sucursal = request.args.get('nombre_sucursal')
        estado_sucursal = request.args.get('estado_sucursal')
        ident_sucursal = request.args.get('ident_sucursal')
        fecha_inicio_sucursal_str = request.args.get('fecha_inicio_sucursal')
        fecha_fin_sucursal_str = request.args.get('fecha_fin_sucursal')
        
        fecha_inicio_sucursal = datetime.strptime(fecha_inicio_sucursal_str, '%Y-%m-%d')
        fecha_fin_sucursal = datetime.strptime(fecha_fin_sucursal_str, '%Y-%m-%d')

        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) "
                     "FROM sucursales "
                     "WHERE `sucursal_nombre` LIKE %s "
                     "AND estado LIKE %s "
                     "AND identificador LIKE %s "
                     "AND fecha_suc >= %s AND fecha_suc < %s ")
            data_params = (f"{nombre_sucursal}%", f"{estado_sucursal}%", f"{ident_sucursal}%", fecha_inicio_sucursal, fecha_fin_sucursal + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/sucursales_tabla/<int:numero>')#Control
@cross_origin()
@login_required
def getAllSucursalesTabla(numero):
    try:

        nombre_sucursal = request.args.get('nombre_sucursal')
        estado_sucursal = request.args.get('estado_sucursal')
        ident_sucursal = request.args.get('ident_sucursal')
        fecha_inicio_sucursal_str = request.args.get('fecha_inicio_sucursal')
        fecha_fin_sucursal_str = request.args.get('fecha_fin_sucursal')
        
        fecha_inicio_sucursal = datetime.strptime(fecha_inicio_sucursal_str, '%Y-%m-%d')
        fecha_fin_sucursal = datetime.strptime(fecha_fin_sucursal_str, '%Y-%m-%d')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id_sucursales, sucursal_nombre, fecha_suc, identificador, estado "
                    "FROM sucursales "
                    "WHERE `sucursal_nombre` LIKE %s "
                    "AND estado LIKE %s "
                    "AND identificador LIKE %s "
                    "AND fecha_suc >= %s AND fecha_suc < %s "
                    "ORDER BY id_sucursales ASC "
                    "LIMIT 20 OFFSET %s")
            data_params = (f"{nombre_sucursal}%", f"{estado_sucursal}%", f"{ident_sucursal}%", fecha_inicio_sucursal, fecha_fin_sucursal + timedelta(days=1), numero)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id_sucursales': fila[0],
                'sucursal_nombre': fila[1],
                'fecha_suc': fila[2].strftime('%d-%m-%Y'),
                'identificador': fila[3],
                'estado': fila[4],
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/sucursales_consolidacion_efectivo')#CAJA
@cross_origin()
@login_required
def getConsolidadoEfectivo():
    try:
        usuarioLlave = session.get('usernameDos')
        fecha_inicio_sucursal_str = request.args.get('fecha_inicio_sucursal')
        fecha_fin_sucursal_str = request.args.get('fecha_fin_sucursal')
        
        fecha_inicio_sucursal = datetime.strptime(fecha_inicio_sucursal_str, '%Y-%m-%d')
        fecha_fin_sucursal = datetime.strptime(fecha_fin_sucursal_str, '%Y-%m-%d')

        with mysql.connection.cursor() as cur:
            data_params = (usuarioLlave, fecha_inicio_sucursal, fecha_fin_sucursal + timedelta(days=1))
            query_ventas = ("SELECT sucursal, "
                            "SUM(modo_efectivo) AS suma_ventas "
                            "FROM ventas "
                            "WHERE identificador_ventas = %s "
                            "AND fecha_det_ventas >= %s AND fecha_det_ventas < %s "
                            "GROUP BY sucursal "
                            "ORDER BY sucursal ASC")
            cur.execute(query_ventas, data_params)
            data_ventas = cur.fetchall()

            query_caja = (  "SELECT sucursal_caja, saldo_apertura, id_caja, saldo_cierre, llave_caja "
                            "FROM caja "
                            "WHERE identificador_caja = %s "
                            "AND fecha_caja >= %s AND fecha_caja < %s "
                            "GROUP BY sucursal_caja "
                            "ORDER BY sucursal_caja ASC")
            cur.execute(query_caja, data_params)
            data_caja = cur.fetchall()

            query_creditos = (  "SELECT sucursal_cre, "
                                "SUM(efectivo) AS suma_creditos "
                                "FROM creditos "
                                "WHERE identificador_cre = %s "
                                "AND fecha_cre >= %s AND fecha_cre < %s "
                                "GROUP BY sucursal_cre "
                                "ORDER BY sucursal_cre ASC")
            cur.execute(query_creditos, data_params)
            data_creditos = cur.fetchall()
            resultado = {}

            query_gastos = ("SELECT sucursal_gastos, "
                            "SUM(monto) AS suma_gastos "
                            "FROM gastos_varios "
                            "WHERE identificador_gastos = %s "
                            "AND fecha_gastos >= %s AND fecha_gastos < %s "
                            "GROUP BY sucursal_gastos "
                            "ORDER BY sucursal_gastos ASC")
            cur.execute(query_gastos, data_params)
            data_gastos = cur.fetchall()
            resultado = {}
            
            for fila in data_ventas:
                sucursal = fila[0]
                resultado.setdefault(sucursal, {}).update({'id_sucursales': sucursal, 'suma_ventas': fila[1]})

            for fila in data_caja:
                sucursal = fila[0]
                resultado.setdefault(sucursal, {}).update({'id_sucursales': sucursal, 'saldo_apertura': fila[1], 'id_caja': fila[2], 'saldo_cierre': fila[3], 'llave_caja': fila[4]})

            for fila in data_creditos:
                sucursal = fila[0]
                resultado.setdefault(sucursal, {}).update({'id_sucursales': sucursal, 'suma_creditos': fila[1]})

            for fila in data_gastos:
                sucursal = fila[0]
                resultado.setdefault(sucursal, {}).update({'id_sucursales': sucursal, 'suma_gastos': fila[1]})

        return jsonify(list(resultado.values()))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/sucursales')#Configuración
@cross_origin()
@login_required
def getAllSucursales():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("SELECT id_sucursales, sucursal_nombre, fecha_suc, estado FROM sucursales "
                     "WHERE `identificador` = %s "
                     "ORDER BY id_sucursales ASC")
            cur.execute(query, (usuarioLlave,))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id_sucursales': fila[0],
                'sucursal_nombre': fila[1],
                'fecha_suc': fila[2].strftime('%d-%m-%Y'),
                'estado': fila[3]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/sucursales_index')#Index
@cross_origin()
@login_required
def getAllSucursalesIndex():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("SELECT id_sucursales, sucursal_nombre, fecha_suc, estado FROM sucursales "
                     "WHERE `identificador` = %s "
                     "AND `estado` != 0 "
                     "AND `estado` != 3 "
                     "ORDER BY id_sucursales ASC")
            cur.execute(query, (usuarioLlave,))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id_sucursales': fila[0],
                'sucursal_nombre': fila[1],
                'fecha_suc': fila[2].strftime('%d-%m-%Y'),
                'estado': fila[3]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/sucursales', methods=['POST'])#Configuración
@cross_origin()
@login_required
def saveSucursales():
    if 'id_sucursales' in request.json:
        editSucursales()
    else:
        createSucursales()
    return "ok"

def createSucursales():#Configuración
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `sucursales` (`id_sucursales`, `sucursal_nombre`, `fecha_suc`, `identificador`, `estado`) "
                     "VALUES (NULL, %s, %s, %s, 0)")
            data = (request.json['sucursal_nombre'], request.json['fecha_suc'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Sucursal creada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def editSucursales():#Configuración
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `sucursales` SET `estado`= %s "
                    "WHERE `id_sucursales` = %s "
                    "AND `identificador` = %s;")
            data = (request.json['estado'], request.json['id_sucursales'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Usuario actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@app.route('/api/sucursales_create_control', methods=['POST'])#Control
@cross_origin()
@login_required
def createSucursalesControl():
    try:
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `sucursales` (`id_sucursales`, `sucursal_nombre`, `fecha_suc`, `identificador`, `estado`) "
                     "VALUES (NULL, %s, %s, %s, 1)")
            data = (request.json['sucursal_nombre'], request.json['fecha_suc'], request.json['identificador'])
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Sucursal creada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@app.route('/api/sucursales_edit_control', methods=['POST'])#Control
@cross_origin()
@login_required
def editSucursalesControl():
    try:
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `sucursales` SET `estado`= %s "
                    "WHERE `id_sucursales` = %s")
            data = (request.json['estado'], request.json['id_sucursales'])
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Usuario actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

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
        if logged_user != None:
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

@app.route('/index')
@cross_origin()
@login_required
def index():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    if puesto == 200:
        return redirect(url_for('control'))
    else:
        return render_template('index.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@app.route('/control')
@cross_origin()
@login_required
def control():
    puesto = session.get('puesto')
    if puesto == 200:
        return render_template('control.html')
    else:
        return render_template('index.html')
###########################################
@app.route('/ventas')
@cross_origin()
@login_required
def ventas():
    puesto = session.get('puesto')
    identificacion_usuario = session.get('identificacion_usuario')
    usuario_nombre = session.get('usuario_nombre')
    return render_template('ventas.html', puesto=puesto, identificacion_usuario=identificacion_usuario, usuario_nombre=usuario_nombre)
@app.route('/compras')
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
@app.route('/transferencias')
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
@app.route('/kardex')
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
@app.route('/detalle_ventas')
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
@app.route('/modificacion')
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
@app.route('/devolucion_compras')
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
@app.route('/devolucion_salidas')
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
@app.route('/perdidas')
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
@app.route('/productos')
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
@app.route('/entradas')
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
@app.route('/salidas')
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
@app.route('/clientes')
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
@app.route('/configuracion')
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
@app.route('/home')
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
@app.route('/apertura_caja')
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
@app.route('/salidas_caja')
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