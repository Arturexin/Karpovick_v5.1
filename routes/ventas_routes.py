from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required
from db_connection import mysql

# Definimos el blueprint para las rutas de ventas
ventas_conteo = Blueprint('ventas_conteo', __name__)
ventas_tabla = Blueprint('ventas_tabla', __name__)
ventas_clientes_reporte = Blueprint('ventas_clientes_reporte', __name__)
ventas_tabla_reporte = Blueprint('ventas_tabla_reporte', __name__)
ventas_grafico = Blueprint('ventas_grafico', __name__)
ventas_comprobante = Blueprint('ventas_comprobante', __name__)
ventas_delete = Blueprint('ventas_delete', __name__)


@ventas_conteo.route('/api/ventas_conteo')
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
                        "AND ventas.estado > 0 "
                        "AND fecha_det_ventas >= %s AND fecha_det_ventas < %s ")
            data_params = (usuarioLlave, f"{sucursal_det_venta}%", f"{comprobante_det_venta}%", f"{tipComp_det_venta}%", f"{cliente_det_venta}%", 
                        fecha_inicio_det_venta, fecha_fin_det_venta + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ventas_tabla.route('/api/ventas_tabla/<int:numero>')
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
            query = ("SELECT id_det_ventas, sucursal_nombre, comprobante, tipo_comprobante, nombre_cli, modo_efectivo, modo_credito, modo_tarjeta, modo_perdida, fecha_det_ventas, canal_venta, situacion "
                        "FROM ventas "
                        "JOIN sucursales ON `ventas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "JOIN clientes ON `ventas`.`dni_cliente` = `clientes`.`id_cli` "
                        "WHERE identificador_ventas = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND tipo_comprobante LIKE %s "
                        "AND nombre_cli LIKE %s "
                        "AND ventas.estado > 0 "
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
                'fecha_det_ventas': fila[9].strftime('%d-%m-%Y'),
                'canal_venta': fila[10],
                'situacion': fila[11],
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@ventas_clientes_reporte.route('/api/clientes_reporte')
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
                        "AND ventas.estado > 0 "
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
   

@ventas_tabla_reporte.route('/api/ventas_tabla_reporte')#SALIDAS
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
                        "AND ventas.estado > 0 "
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

@ventas_grafico.route('/api/ventas_grafico')#DETALLE DE VENTAS
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
                     "SUM(CASE WHEN modo_efectivo > 0 THEN (+1) ELSE 0 END) AS conteo_efectivo, "
                     "SUM(CASE WHEN modo_tarjeta > 0 THEN (+1) ELSE 0 END) AS conteo_tarjeta, "
                     "SUM(CASE WHEN modo_credito > 0 THEN (+1) ELSE 0 END) AS conteo_credito, "
                     "SUM(CASE WHEN modo_perdida > 0 THEN (+1) ELSE 0 END) AS conteo_perdida "
                     "FROM ventas "
                     "WHERE `identificador_ventas` = %s "
                     "AND ventas.estado > 0 "
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
                'conteo_efectivo': int(fila[8]),
                'conteo_tarjeta': int(fila[9]),
                'conteo_credito': int(fila[10]),
                'conteo_perdida': int(fila[11]),
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

###----------------------------------------------------------------------------------------------------------------------------------------------------------------------
@ventas_comprobante.route('/api/ventas_comprobante/<string:comprobante>')#SALIDAS, DEVOLUCION
@cross_origin()
@login_required
def getVentasComprobante(comprobante):
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("SELECT id_det_ventas, modo_efectivo, modo_credito, modo_tarjeta, modo_perdida "
                     "FROM ventas "
                     "WHERE `identificador_ventas` = %s "
                     "AND ventas.estado > 0 "
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
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

###----------------------------------------------------------------------------------------------------------------------------------------------------------------------
@ventas_delete.route('/api/ventas', methods=['POST'])
@cross_origin()
@login_required
def removeVentas():
    try:
        dato_cero = 0
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `ventas` SET `estado` = %s "
                     "WHERE `ventas`.`id_det_ventas` = %s "
                     "AND identificador_ventas = %s")
            data = (dato_cero, request.json['id_det_ventas'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        
        return jsonify({"status": "success", "message": "Venta eliminada."})
    except Exception as e:
        return jsonify({'error': str(e)}), 500