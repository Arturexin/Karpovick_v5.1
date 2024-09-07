from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required
from db_connection import mysql

# Definimos el blueprint para las rutas de perdidas
perdidas_conteo = Blueprint('perdidas_conteo', __name__)
perdidas_tabla = Blueprint('perdidas_tabla', __name__)
perdidas_kardex_id = Blueprint('perdidas_kardex_id', __name__)
perdidas_suma_total = Blueprint('perdidas_suma_total', __name__)
perdidas_suma_total_pasado = Blueprint('perdidas_suma_total_pasado', __name__)



@perdidas_conteo.route('/api/perdidas_conteo')
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
    
@perdidas_tabla.route('/api/perdidas_tabla/<int:numero>')
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
    
@perdidas_kardex_id.route('/api/perdidas_codigo_kardex/<int:id_producto>')###Kardex############################################################
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
       
@perdidas_suma_total.route('/api/perdidas_suma_total')#HOME
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
       
@perdidas_suma_total_pasado.route('/api/perdidas_suma_total_anio_pasado')#HOME
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