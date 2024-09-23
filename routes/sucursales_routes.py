from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required
from db_connection import mysql

# Definimos el blueprint para las rutas de sucursales
sucursales_conteo = Blueprint('sucursales_conteo', __name__)
sucursales_tabla = Blueprint('sucursales_tabla', __name__)
sucursales_consolidacion_efectivo = Blueprint('sucursales_consolidacion_efectivo', __name__)
sucursales_get = Blueprint('sucursales_get', __name__)
sucursales_index = Blueprint('sucursales_index', __name__)
sucursales_post = Blueprint('sucursales_post', __name__)
sucursales_create_control_post = Blueprint('sucursales_create_control_post', __name__)
sucursales_edit_control = Blueprint('sucursales_edit_control', __name__)


@sucursales_conteo.route('/api/sucursales_conteo')#Control
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
                     "AND sucursales.estado > 0 "
                     "AND fecha_suc >= %s AND fecha_suc < %s ")
            data_params = (f"{nombre_sucursal}%", f"{estado_sucursal}%", f"{ident_sucursal}%", fecha_inicio_sucursal, fecha_fin_sucursal + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@sucursales_tabla.route('/api/sucursales_tabla/<int:numero>')#Control
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
                    "AND sucursales.estado > 0 "
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

@sucursales_consolidacion_efectivo.route('/api/sucursales_consolidacion_efectivo')#CAJA
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
                            "AND ventas.estado > 0 "
                            "AND fecha_det_ventas >= %s AND fecha_det_ventas < %s "
                            "GROUP BY sucursal "
                            "ORDER BY sucursal ASC")
            cur.execute(query_ventas, data_params)
            data_ventas = cur.fetchall()

            query_caja = (  "SELECT sucursal_caja, saldo_apertura, id_caja, saldo_cierre, llave_caja "
                            "FROM caja "
                            "WHERE identificador_caja = %s "
                            "AND fecha_caja >= %s AND fecha_caja < %s "
                            "AND caja.estado > 0 "
                            "GROUP BY sucursal_caja "
                            "ORDER BY sucursal_caja ASC")
            cur.execute(query_caja, data_params)
            data_caja = cur.fetchall()

            query_creditos = (  "SELECT sucursal_cre, "
                                "SUM(efectivo) AS suma_creditos "
                                "FROM creditos "
                                "WHERE identificador_cre = %s "
                                "AND creditos.estado > 0 "
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
                            "AND gastos_varios.estado > 0 "
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

@sucursales_get.route('/api/sucursales')#Configuración
@cross_origin()
@login_required
def getAllSucursales():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("SELECT id_sucursales, sucursal_nombre, fecha_suc, estado FROM sucursales "
                     "WHERE `identificador` = %s "
                     "AND sucursales.estado > 0 "
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

@sucursales_index.route('/api/sucursales_index')#Index
@cross_origin()
@login_required
def getAllSucursalesIndex():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("SELECT id_sucursales, sucursal_nombre, fecha_suc, estado "
                     "FROM sucursales "
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

@sucursales_post.route('/api/sucursales', methods=['POST'])#Configuración
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
    
@sucursales_create_control_post.route('/api/sucursales_create_control', methods=['POST'])#Control
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
    
@sucursales_edit_control.route('/api/sucursales_edit_control', methods=['POST'])#Control
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