from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required
from db_connection import mysql

# Definimos el blueprint para las rutas de perdidas
perdidas_conteo = Blueprint('perdidas_conteo', __name__)
perdidas_tabla = Blueprint('perdidas_tabla', __name__)
perdidas_kardex_id = Blueprint('perdidas_kardex_id', __name__)
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
                'fecha': fila[3]
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
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        array_productos = request.json.get('array_productos', [])
        array_despacho = request.json.get('array_despacho', [])
        fecha = request.json['fecha']
        dato_uno = 1
        
        # Validar que los datos necesarios están presentes
        if not array_productos or not array_despacho or not fecha or not usuarioLlave:
            return jsonify({"status": "error", "message": "Faltan datos requeridos para procesar el despacho"}), 400

        with mysql.connection.cursor() as cur:
            try:
                actualizar_almacen_central(cur, array_productos, usuarioLlave)
            except Exception as e:
                mysql.connection.rollback()  # Hacer rollback si hay un error en actualizar_almacen_central
                return jsonify({"status": "error", "message": f"Error al actualizar existencias: {str(e)}"}), 400

            try:
                insertar_despacho(cur, array_despacho, usuarioId, usuarioLlave, dato_uno, fecha)
            except Exception as e:
                mysql.connection.rollback()
                return jsonify({"status": "error", "message": f"Error al insertar despacho: {str(e)}"}), 400

        mysql.connection.commit()
        return jsonify({"status": "success", "message": "Despacho procesado correctamente."}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})


def actualizar_almacen_central(cur, array_productos, usuarioLlave):
    query = (   "UPDATE `almacen_central` SET "
                "existencias_ac = existencias_ac + %s, "
                "existencias_su = existencias_su + %s, "
                "existencias_sd = existencias_sd + %s, "
                "existencias_st = existencias_st + %s, "
                "existencias_sc = existencias_sc + %s "
                "WHERE `almacen_central`.`idProd` = %s "
                "AND `almacen_central`.`estado` > 0 "
                "AND identificadorProd = %s "
                # Validación: asegurarse de que las existencias no queden negativas
                "AND (existencias_ac + %s) >= 0 "
                "AND (existencias_su + %s) >= 0 "
                "AND (existencias_sd + %s) >= 0 "
                "AND (existencias_st + %s) >= 0 "
                "AND (existencias_sc + %s) >= 0")
    data_productos =    [
                            (p['existencias_ac'], p['existencias_su'], p['existencias_sd'],
                            p['existencias_st'], p['existencias_sc'], p['idProd'], usuarioLlave,
                            p['existencias_ac'], p['existencias_su'], p['existencias_sd'],
                            p['existencias_st'], p['existencias_sc']) 
                            for p in array_productos
                        ]
    cur.executemany(query, data_productos)

    # Verificar si la cantidad de filas actualizadas es igual a la cantidad de productos
    if cur.rowcount != len(array_productos):
        raise Exception("Uno de los productos no cuenta con unidades suficientes, actualice los saldos.")
    
def insertar_despacho(cur, array_despacho, usuarioId, usuarioLlave, dato_uno, fecha):
    query_despacho_insert = (   "INSERT INTO `perdidas` "
                                "(`id_perdidas`, `suc_perdidas`, `id_productos`, `cantidad`, `causa`, "
                                "`id_usuario`, `fecha_perdidas`, `identificador_per`, `estado`) "
                                "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s)")
    data_despacho_insert = [
                            (s['suc_perdidas'], s['idProd'], s['existencias_post'], s['causa'], 
                            usuarioId, fecha, usuarioLlave, dato_uno) 
                            for s in array_despacho
                            ]
    cur.executemany(query_despacho_insert, data_despacho_insert)

    # Comprobar si la inserción se realizó correctamente
    if cur.rowcount != len(array_despacho):
        raise Exception("No se pudieron insertar todos los despachos correctamente.")