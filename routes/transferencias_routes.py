from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required
from db_connection import mysql

# Definimos el blueprint para las rutas de transferencias
transferencias_conteo = Blueprint('transferencias_conteo', __name__)
transferencias_tabla = Blueprint('transferencias_tabla', __name__)
transferencias_conteo_s = Blueprint('transferencias_conteo_s', __name__)
transferencias_tabla_s = Blueprint('transferencias_tabla_s', __name__)
transfrencias_kardex_id = Blueprint('transfrencias_kardex_id', __name__)
productos_transferencias = Blueprint('productos_transferencias', __name__)
productos_transferencias_p = Blueprint('productos_transferencias_p', __name__)


@transferencias_conteo.route('/api/transferencias_conteo')
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
                        "AND transfrencias.estado > 0 "
                        "AND fecha_tran >= %s AND fecha_tran < %s ")
            data_params = (usuarioLlave, f"{sucursal_entradas}%", f"{categoria_entradas}%", f"{codigo_entradas}%", f"{comprobante_entradas}%", 
                        fecha_inicio_entradas, fecha_fin_entradas + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@transferencias_tabla.route('/api/transferencias_tabla/<int:numero>')
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
                        "AND transfrencias.estado > 0 "
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
    
@transferencias_conteo_s.route('/api/transferencias_conteo_s')
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
                        "AND transfrencias.estado > 0 "
                        "AND fecha_tran >= %s AND fecha_tran < %s ")
            data_params = (usuarioLlave, f"{sucursal_salidas}%", f"{categoria_salidas}%", f"{codigo_salidas}%", f"{comprobante_salidas}%", 
                        fecha_inicio_salidas, fecha_fin_salidas + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@transferencias_tabla_s.route('/api/transferencias_tabla_s/<int:numero>')
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
                        "AND transfrencias.estado > 0 "
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
    
@transfrencias_kardex_id.route('/api/transfrencias_codigo_kardex/<int:id_producto>')###Kardex############################################################
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
                'fecha': fila[5]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@productos_transferencias.route('/api/procesar_transferencia', methods=['POST'])##Transferencias, Productos
@cross_origin()
@login_required
def operarTransferencia():
    try:
        dato_uno = 1
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')

        array_productos = request.json['array_data_prod']
        array_transferencias = request.json['array_data_tran']

        if not array_productos or not array_transferencias or not usuarioLlave or not usuarioId:
            return jsonify({"status": "error", "message": "Faltan datos requeridos para procesar la modificación"}), 400

        with mysql.connection.cursor() as cur:

            # Numeración
            numeracion = incrementar_obtener_numeracion(cur, dato_uno, usuarioLlave, 'Transferencia', 'transferencias')

            try:
                # Almacén central - array Actualización del stock
                actualizar_almacen_central(cur, array_productos, usuarioLlave)
            except Exception as e:
                mysql.connection.rollback()  # Hacer rollback si hay un error en actualizar_almacen_central
                return jsonify({"status": "error", "message": f"Error al actualizar el inventario: {str(e)}"}), 400
            
            try:
                # Transferencias - array
                procesar_transferencias(cur, array_transferencias, usuarioId, usuarioLlave, numeracion, dato_uno)
            except Exception as e:
                mysql.connection.rollback()  # Hacer rollback si hay un error en actualizar_almacen_central
                return jsonify({"status": "error", "message": f"Error al insertar transferencia: {str(e)}"}), 400

            mysql.connection.commit()

        return jsonify({"status": "success", "message": f"{numeracion}"}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

def incrementar_obtener_numeracion(cur, dato_uno, usuarioLlave, nombre, concepto):
    # Actualizar la numeración
    query_numeracion = ("UPDATE `numeracion_comprobante` SET transferencias = transferencias + %s "
                        "WHERE `numeracion_comprobante`.`id` = %s AND identificador = %s")
    data_numeracion = (dato_uno, request.json['id_num'], usuarioLlave)
    cur.execute(query_numeracion, data_numeracion)
    
    # Obtener la numeración actualizada
    query = ("SELECT id, compras, recompras, transferencias, ventas, nota_venta, boleta_venta, factura "
             "FROM numeracion_comprobante WHERE `identificador` = %s")
    cur.execute(query, (usuarioLlave,))
    data = cur.fetchall()
    
    contenido = { 
        'id': data[0][0],
        'compras': data[0][1],
        'recompras': data[0][2],
        'transferencias': data[0][3],
        'ventas': data[0][4],
        'nota_venta': data[0][5],
        'boleta_venta': data[0][6],
        'factura': data[0][7]
    }

    return f"{nombre}-{contenido[concepto]}"

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

def procesar_transferencias(cur, array_transferecnias, usuarioId, usuarioLlave, numeracion, dato_uno):
    query_transferencias =  ("INSERT INTO `transfrencias` "
                            "(`id_tran`, `id_suc_origen`, `id_suc_destino`, `id_prod`, `cantidad`, "
                            "`comprobante`, `id_usuario`, `fecha_tran`, `identificador_tran`, `estado`) "
                            "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s)");
    data_transferencias =   [
                                (p['id_suc_origen'], p['id_suc_destino'], p['idProd'], p['cantidad'], numeracion, 
                                usuarioId, request.json['fecha'], usuarioLlave, dato_uno) for p in array_transferecnias
                            ]

    cur.executemany(query_transferencias, data_transferencias)

    if cur.rowcount != len(array_transferecnias):
        raise Exception("Una de las transferencias no se procesó.")
