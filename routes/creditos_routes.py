from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required
from db_connection import mysql

# Definimos el blueprint para las rutas de creditos
credito_comprobante = Blueprint('credito_comprobante', __name__)
credito_reporte_dos = Blueprint('credito_reporte_dos', __name__)
aperturar_creditos_post = Blueprint('aperturar_creditos_post', __name__)
credito_operar_creditos = Blueprint('credito_operar_creditos', __name__)
creditos_delete = Blueprint('creditos_delete', __name__)


@credito_comprobante.route('/api/credito_comprobante/<int:id_detalle>')
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

@credito_reporte_dos.route('/api/credito_reporte_dos')
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
    
@aperturar_creditos_post.route('/api/aperturar_creditos', methods=['POST'])
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
    
@credito_operar_creditos.route('/api/operar_creditos', methods=['POST'])
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
    
@creditos_delete.route('/api/creditos/<int:id_cre>', methods=['DELETE'])
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