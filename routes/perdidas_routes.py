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
perdidas_perdida_post = Blueprint('perdidas_perdida_post', __name__)



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
                        "AND perdidas.estado > 0 "
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
                        "AND perdidas.estado > 0 "
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
                    "AND perdidas.estado > 0 "
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
                    "AND perdidas.estado > 0 "
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
                    "AND perdidas.estado > 0 "
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
    
@perdidas_perdida_post.route('/api/procesar_perdida', methods=['POST'])##Perdidas
@cross_origin()
@login_required
def operarPerdida():
    try:
        dato_uno = 1
        despacho_data = request.json
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        data_des = request.json.get('array_despacho', [])
        
        # Iniciar la transacción manualmente
        cur = mysql.connection.cursor()
        cur.execute("BEGIN")

        error_message = actualizar_almacen_central_resta(cur, despacho_data, usuarioLlave, 'array_despacho')
        if error_message:
            return error_message
        
        # Insertar en pérdidas
        query_despacho_insert = (   "INSERT INTO `perdidas` "
                                    "(`id_perdidas`, `suc_perdidas`, `id_productos`, `cantidad`, `causa`, `id_usuario`, "
                                    "`fecha_perdidas`, `identificador_per`, `estado`) "
                                    "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s)")
        data_despacho_insert = [
                                (s['suc_perdidas'], s['idProd'], s['existencias_post'], s['causa'], 
                                 usuarioId, request.json['fecha'], usuarioLlave, dato_uno) 
                                for s in data_des
                                ]
        cur.executemany(query_despacho_insert, data_despacho_insert)

        mysql.connection.commit()
        return jsonify({"status": "success", "message": "Despacho procesado correctamente."}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
    finally:
        cur.close()


def actualizar_almacen_central_resta(cur, recompra_data, usuarioLlave, nombre_array):
    """
    Procesa los productos, agrupa los datos por sucursal y actualiza el inventario en la tabla 'almacen_central'.
    """
    # Diccionario para almacenar los datos de actualización agrupados por sucursal_post
    data_productos_por_sucursal = {'existencias_ac': [], 'existencias_su': [], 'existencias_sd': [], 'existencias_st': [],
                                   'existencias_sc':[]}
    data_len = 0
    # Procesar los productos
    for producto in recompra_data[nombre_array]:
        idProd = producto['idProd']
        sucursal_post = producto['sucursal_post']
        existencias_post = producto['existencias_post']

        # Validar la sucursal
        if sucursal_post not in data_productos_por_sucursal:
            return jsonify({"status": "error", "message": f"Sucursal no válida: {sucursal_post}"}), 400

        # Agregar los datos al grupo correspondiente
        data_productos_por_sucursal[sucursal_post].append((existencias_post, idProd, usuarioLlave, existencias_post))

    # Ejecutar las actualizaciones agrupadas por sucursal_post
    for sucursal_post, data_productos in data_productos_por_sucursal.items():
        if data_productos:  # Verificar si hay datos para esta sucursal_post
            data_len = len(data_productos)
            query = (f"UPDATE `almacen_central` SET {sucursal_post} = {sucursal_post} - %s "
                     "WHERE `almacen_central`.`idProd` = %s "
                     "AND identificadorProd = %s "
                     "AND almacen_central.estado > 0 "
                     f"AND {sucursal_post} >= %s")
            cur.executemany(query, data_productos)
 
    if cur.rowcount != data_len:
        raise Exception("Uno de los productos no cuenta con unidades suficientes, actualice los saldos.")
