from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required
from db_connection import mysql

# Definimos el blueprint para las rutas de gastos
gastos_conteo = Blueprint('gastos_conteo', __name__)
gastos_tabla = Blueprint('gastos_tabla', __name__)
gastos_pago_mercancias = Blueprint('gastos_pago_mercancias', __name__)
gastos_suma_mes = Blueprint('gastos_suma_mes', __name__)
gastos_suma_mes_suc = Blueprint('gastos_suma_mes_suc', __name__)
gastos_post = Blueprint('gastos_post', __name__)
gastos_delete = Blueprint('gastos_delete', __name__)

@gastos_conteo.route('/api/gastos_varios_conteo')
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
                        "AND gastos_varios.estado > 0 "
                        "AND fecha_gastos >= %s AND fecha_gastos < %s ")
            data_params = (usuarioLlave, f"{sucursal_gastos_varios}%", f"{concepto_gastos_varios}%", f"{comprobante_gastos_varios}%", f"{usuario_gastos_varios}%", 
                        fecha_inicio_gastos_varios, fecha_fin_gastos_varios + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@gastos_tabla.route('/api/gastos_varios_tabla/<int:numero>')
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
                        "AND gastos_varios.estado > 0 "
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
    
@gastos_pago_mercancias.route('/api/gastos_pago_mercancias/<string:comprobante>')
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
                        "AND gastos_varios.estado > 0 "
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

@gastos_suma_mes.route('/api/gastos_suma_mes')#Salidas de caja, HOME
@cross_origin()
@login_required
def getSumaGastosPorMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual =  request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT sucursal_gastos, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _nomina, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _seguridad_social, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _proveedores, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _impuestos, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _servicios, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _alquiler, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _mantenimientos, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _publicidad, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _activo, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _depositos, "
                     "SUM(CASE WHEN concepto LIKE %s THEN (monto + caja_bancos) ELSE 0 END) AS _otros "
                     "FROM gastos_varios "
                     "WHERE `identificador_gastos` = %s "
                     "AND gastos_varios.estado > 0 "
                     "AND YEAR(fecha_gastos) = %s "
                     "GROUP BY sucursal_gastos")
            data_params = ('2_%', '3_%', '4_%', '5_%', '6_%', '7_%', '8_%', '9_%', '10_%', '13_%', '14_%', usuarioLlave, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                        'sucursal_gastos': fila[0],
                        '_nomina': fila[1],
                        '_seguridad_social': fila[2],
                        '_proveedores': fila[3],
                        '_impuestos': fila[4],
                        '_servicios': fila[5],
                        '_alquiler': fila[6],
                        '_mantenimientos': fila[7],
                        '_publicidad': fila[8],
                        '_activo': fila[9],
                        '_depositos': fila[10],
                        '_otros': fila[11]
                        }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@gastos_suma_mes_suc.route('/api/gastos_suma_mes_sucursal')#Salidas de caja
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
                     "AND gastos_varios.estado > 0 "
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

@gastos_post.route('/api/gastos_varios', methods=['POST'])
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
        dato_uno = 1
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `gastos_varios` (`id_gastos`, `sucursal_gastos`, `concepto`, `comprobante`, `monto`, `usuario_gastos`, `fecha_gastos`, `identificador_gastos`, "
                     "`caja_bancos`, `credito_gastos`, `estado`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['sucursal_gastos'], request.json['concepto'], request.json['comprobante'], request.json['monto'], 
                    usuarioId, request.json['fecha_gastos'], usuarioLlave, request.json['caja_bancos'], request.json['credito_gastos'], dato_uno)
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
    
@gastos_delete.route('/api/gastos_varios/<int:id_gastos>', methods=['DELETE'])
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
