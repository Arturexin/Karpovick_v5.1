from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required

from db_connection import mysql

# Definimos el blueprint para las rutas de caja
caja_conteo = Blueprint('caja_conteo', __name__)
caja_tabla = Blueprint('caja_tabla', __name__)
caja_tabla_diario = Blueprint('caja_tabla_diario', __name__)
caja_individual_id = Blueprint('caja_individual_id', __name__)
caja_post = Blueprint('caja_post', __name__)
caja_delete = Blueprint('caja_delete', __name__)


@caja_conteo.route('/api/caja_conteo')
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
                        "AND caja.estado > 0 "
                        "AND fecha_caja >= %s AND fecha_caja < %s ")
            data_params = (usuarioLlave, f"{sucursal_aper_caja}%", fecha_inicio_aper_caja, fecha_fin_aper_caja + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@caja_tabla.route('/api/caja_tabla/<int:numero>')
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
                        "AND caja.estado > 0 "
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
    
@caja_tabla_diario.route('/api/caja_tabla_diario')
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
                        "AND caja.estado > 0 "
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

@caja_individual_id.route('/api/caja/<int:id_caja>')
@cross_origin()
@login_required
def getCaja(id_caja):
    try:
        with mysql.connection.cursor() as cur:
            query = ("SELECT id_caja, sucursal_caja, saldo_apertura, ingresos, egresos, saldo_cierre, fecha_caja, llave_caja "
                     "FROM caja "
                     "WHERE id_caja = %s "
                     "AND caja.estado > 0 ")
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

@caja_post.route('/api/caja', methods=['POST'])
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
        dato_uno = 1
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `caja` "
                     "(`id_caja`, `sucursal_caja`, `saldo_apertura`, `ingresos`, `egresos`, `saldo_cierre`, `fecha_caja`, `llave_caja`, `identificador_caja`, `estado`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['sucursal_caja'], request.json['saldo_apertura'], request.json['ingresos'], request.json['egresos'], 
                    request.json['saldo_cierre'], request.json['fecha_caja'], request.json['llave_caja'], usuarioLlave, dato_uno)
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

@caja_delete.route('/api/caja/<int:id_caja>', methods=['DELETE'])
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
