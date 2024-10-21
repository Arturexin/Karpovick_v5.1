from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required
from db_connection import mysql

# Definimos el blueprint para las rutas de entradas
entradas_conteo = Blueprint('entradas_conteo', __name__)
entradas_tabla = Blueprint('entradas_tabla', __name__)
entradas_suma_devoluciones_mes = Blueprint('entradas_suma_devoluciones_mes', __name__)
entradas_extraccion_csv = Blueprint('entradas_extraccion_csv', __name__)
entradas_id_kardex = Blueprint('entradas_id_kardex', __name__)
entradas_comprobante = Blueprint('entradas_comprobante', __name__)
entradas_delete = Blueprint('entradas_delete', __name__)
entradas_devolucion_post = Blueprint('entradas_devolucion_post', __name__)
entradas_recompra_grupal_post = Blueprint('entradas_recompra_grupal_post', __name__)
entradas_compras_grupal_get_post = Blueprint('entradas_compras_grupal_get_post', __name__)



@entradas_conteo.route('/api/entradas_conteo')
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
                        "AND entradas.estado > 0 "
                        "AND fecha >= %s AND fecha < %s ")
            data_params = (usuarioLlave, f"{sucursal_entradas}%", f"{categoria_entradas}%", f"{codigo_entradas}%", f"{comprobante_entradas}%", 
                            fecha_inicio_entradas, fecha_fin_entradas + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@entradas_tabla.route('/api/entradas_tabla/<int:numero>')
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
                        "AND entradas.estado > 0 "
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

@entradas_suma_devoluciones_mes.route('/api/entradas_suma_devoluciones_mes')#DEVOLUCIONES POR COMPRAS
@cross_origin()
@login_required
def getSumaDevolucionesEntradasMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, "
                     "SUM(existencias_devueltas) AS suma_devoluciones_entradas "
                     "FROM entradas "
                     "JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorEntr` = %s "
                     "AND comprobante LIKE %s "
                     "AND entradas.estado > 0 "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes")
            data_params = (usuarioLlave, 'Dev%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'suma_devoluciones_entradas': int(fila[1])
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@entradas_extraccion_csv.route('/api/entradas_extraccion')#ENTRADAS para formato CSV
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
                        "AND entradas.estado > 0 "
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
@entradas_id_kardex.route('/api/entradas_codigo_kardex/<int:id_producto>')###Kardex############################################################
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
                     "AND entradas.estado > 0 "
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
                'fecha': fila[3],
                'existencias_devueltas': fila[4]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entradas_comprobante.route('/api/entradas_comprobante/<string:comprobante>')#Devolución Compras
@cross_origin()
@login_required
def getEntradasComprobante(comprobante):
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("SELECT idEntr AS id, sucursal_nombre, codigo, descripcion, existencias_entradas AS existencias, comprobante, existencias_devueltas, id_sucursales, `entradas`.`idProd` AS id_prod "
                     "FROM entradas "
                     "JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                     "JOIN sucursales ON `entradas`.`sucursal` = `sucursales`.`id_sucursales` "
                     "WHERE `identificadorEntr` = %s "
                     "AND entradas.estado > 0 "
                     "AND comprobante LIKE %s")
            data_params = (usuarioLlave, comprobante)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = {
                'id': fila[0],
                'sucursal_nombre': fila[1],
                'codigo': fila[2],
                'descripcion': fila[3],
                'existencias':fila[4],
                'comprobante': fila[5],
                'existencias_devueltas': fila[6],
                'id_sucursales': fila[7],
                'id_prod': fila[8]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

@entradas_delete.route('/api/entradas_remove', methods=['POST'])#Elimina fila
@cross_origin()
@login_required
def removeEntradas():
    try:
        dato_cero = 0
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `entradas` SET `estado` = %s "
                     "WHERE `entradas`.`idEntr` = %s "
                     "AND identificadorEntr = %s")
            data = (dato_cero, request.json['idEntr'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        
        return jsonify({"status": "success", "message": "Entrada eliminada correctamente."})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entradas_devolucion_post.route('/api/procesar_devolucion_compras', methods=['POST'])##Devolución por compras y Productos
@cross_origin()
@login_required
def operarDevolucionCompra():
    
    try:
        devolucion_data = request.json
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0
        dato_uno = 1
        data_dev = request.json.get('array_devolucion', [])
        
        # Iniciar la transacción manualmente
        cur = mysql.connection.cursor()
        cur.execute("BEGIN")


        actualizar_almacen_central_resta(cur, devolucion_data, usuarioLlave, 'array_devolucion')

        # Insertar en sentradas
        query_entradas_insert = ("INSERT INTO `entradas` "
                                "(`idEntr`, `idProd`, `sucursal`, `existencias_entradas`, `comprobante`, `causa_devolucion`, "
                                "`usuario`, `fecha`, `existencias_devueltas`, `identificadorEntr`, `estado`) "
                                "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
        data_entradas_insert = [
                                (s['idProd'], s['sucursal'], dato_cero, s['comprobante'], s['causa_devolucion'], 
                                 usuarioId, request.json['fecha'], s['existencias_post'], usuarioLlave, dato_uno) 
                                for s in data_dev
                                ]
        cur.executemany(query_entradas_insert, data_entradas_insert)
        # Actualizar en entradas
        query_entradas_update = ("UPDATE `entradas` SET existencias_devueltas = existencias_devueltas + %s "
                                "WHERE `entradas`.`idEntr` = %s "
                                "AND identificadorEntr = %s "
                                "AND `entradas`.`estado` = 1 "
                                "AND existencias_devueltas >= 0")
        data_entradas_update = [
                                (s['existencias_post'], s['id_op'], usuarioLlave) 
                                for s in data_dev
                                ]
        cur.executemany(query_entradas_update, data_entradas_update)

        # Confirmar la transacción
        mysql.connection.commit()

        return jsonify({"status": "success", "message": 'Devolución procesada correctamente' })
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
    finally:
        cur.close()

########################################################################################################
@entradas_recompra_grupal_post.route('/api/gestion_de_recompras', methods=['POST'])##Recompras, Productos
@cross_origin()
@login_required
def gestionDeRecompras():
    try:
        # Obtener los datos del cuerpo de la solicitud
        array_productos = request.json.get('array_productos_dos', [])
        array_entradas = request.json.get('array_entradas_dos', [])
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        fecha = request.json.get('fecha')
        dato_cero = 0
        dato_uno = 1

        # Validar que los datos necesarios están presentes
        if not array_productos or not array_entradas or not fecha or not usuarioLlave:
            return jsonify({"status": "error", "message": "Faltan datos requeridos para procesar la recompra"}), 400

        # Iniciar la transacción con el uso de context manager
        with mysql.connection.cursor() as cur:
            # Numeración
            numeracion = incrementar_obtener_numeracion(cur, dato_uno, usuarioLlave, 'Recompra', 'recompras')

            # Actualizar el inventario en 'almacen_central'
            try:
                actualizar_almacen_central(cur, array_productos, usuarioLlave)
            except Exception as e:
                mysql.connection.rollback()  # Hacer rollback si hay un error en actualizar_almacen_central
                return jsonify({"status": "error", "message": f"Error al actualizar el inventario: {str(e)}"}), 400

            # Insertar las entradas en la tabla 'entradas'
            try:
                insertar_entradas(cur, array_entradas, numeracion, usuarioId, usuarioLlave, dato_cero, dato_uno, fecha)
            except Exception as e:
                mysql.connection.rollback()  # Hacer rollback si hay un error en insertar_entradas
                return jsonify({"status": "error", "message": f"Error al insertar las entradas: {str(e)}"}), 400

            # Confirmar la transacción
            mysql.connection.commit()

        return jsonify({"status": "success", "message": f"Recompra realizada con numeración {numeracion}"}), 200

    except Exception as e:
        mysql.connection.rollback()  # Hacer rollback en caso de cualquier otro error
        return jsonify({"status": "error", "message": f"Error general: {str(e)}"}), 500
#######################################################################################################

@entradas_compras_grupal_get_post.route('/api/gestion_de_compras', methods=['GET', 'POST'])##Compras
@cross_origin()
@login_required
def gestionDeCompras():
    try:
        array_productos = request.json.get('array_productos', [])
        array_entradas = request.json.get('array_entradas', [])
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        fecha = request.json.get('fecha')
        dato_cero = 0
        dato_uno = 1

        # Validar que los datos necesarios están presentes
        if not array_productos or not array_entradas or not fecha or not usuarioLlave:
            return jsonify({"status": "error", "message": "Faltan datos requeridos para procesar la recompra"}), 400
        
        # Iniciar la transacción con el uso de context manager
        with mysql.connection.cursor() as cur:

            # Numeración
            numeracion = incrementar_obtener_numeracion(cur, dato_uno, usuarioLlave, 'Compra', 'compras')
            # Actualizar el inventario en 'almacen_central'
            try:
                insertar_almacen_central(cur, array_productos, usuarioLlave, dato_uno)
            except Exception as e:
                mysql.connection.rollback()  # Hacer rollback si hay un error en actualizar_almacen_central
                return jsonify({"status": "error", "message": f"Error al insertar en el inventario: {str(e)}"}), 400

            # Insertar las entradas en la tabla 'entradas'
            try:
                insertar_entradas_new(cur, array_entradas, array_productos, numeracion, usuarioId, usuarioLlave, dato_cero, dato_uno, fecha)
            except Exception as e:
                mysql.connection.rollback()  # Hacer rollback si hay un error en insertar_entradas
                return jsonify({"status": "error", "message": f"Error al insertar las entradas: {str(e)}"}), 400
            
            mysql.connection.commit()

        return jsonify({"status": "success", "message": f"{numeracion}"}), 200
    
    except Exception as e:
        mysql.connection.rollback()# Hacer rollback en caso de cualquier error
        return jsonify({"status": "error", "message": str(e)})
    
    finally:
        cur.close()  # Asegurarse de cerrar el cursor
    

#####################################################################################################################    
#####################################################################################################################    
#####################################################################################################################    
def incrementar_obtener_numeracion(cur, dato_uno, usuarioLlave, nombre, concepto):
    # Actualizar la numeración
    query_numeracion = (f"UPDATE `numeracion_comprobante` SET {concepto} = {concepto} + %s "
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

def insertar_almacen_central(cur, array_productos, usuarioLlave, dato_uno):
    query_productos = ( "INSERT INTO `almacen_central` "
                        "(`categoria`, `codigo`, `descripcion`, `talla`, "
                        "`costo_unitario`, `precio_venta`, `lote`, `proveedor`, "
                        "`existencias_ac`, `existencias_su`, `existencias_sd`, "
                        "`existencias_st`, `existencias_sc`, `identificadorProd`, `estado`) "
                        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
        
    data_productos =    [
                            (p['categoria'], p['codigo'], p['descripcion'], p['talla'],
                            p['costo_unitario'], p['precio_venta'], p['lote'], p['proveedor'],
                            p['existencias_ac'], p['existencias_su'], p['existencias_sd'],
                            p['existencias_st'], p['existencias_sc'], usuarioLlave, dato_uno) 
                            for p in array_productos
                        ]
    cur.executemany(query_productos, data_productos)

    # Verificar si la cantidad de filas actualizadas es igual a la cantidad de productos
    if cur.rowcount != len(array_productos):
        raise Exception("Uno de los productos no cuenta con unidades suficientes, actualice los saldos.")
    
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
    
def actualizar_almacen_central_suma(cur, recompra_data, usuarioLlave, nombre_array):
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
            query = (f"UPDATE `almacen_central` SET {sucursal_post} = {sucursal_post} + %s "
                     "WHERE `almacen_central`.`idProd` = %s "
                     "AND identificadorProd = %s "
                     "AND almacen_central.estado > 0 "
                     f"AND {sucursal_post} >= %s")
            cur.executemany(query, data_productos)

    if cur.rowcount != data_len:
        raise Exception("Uno de los productos no cuenta con unidades suficientes, actualice los saldos.")

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


def insertar_entradas(cur, array_entradas, numeracion, usuarioId, usuarioLlave, dato_cero, dato_uno, fecha):
    query_entradas = ("INSERT INTO `entradas` "
                      "(`idEntr`, `idProd`, `sucursal`, `existencias_entradas`, "
                      "`comprobante`, `causa_devolucion`, `usuario`, `fecha`, "
                      "`existencias_devueltas`, `identificadorEntr`, `estado`) "
                      "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")

    data_entradas = [(entrada['idProd'], entrada['sucursal'], entrada['existencias_entradas'],
                    numeracion, dato_cero, usuarioId, fecha, 
                    dato_cero, usuarioLlave, dato_uno)
                    for entrada in array_entradas]

    cur.executemany(query_entradas, data_entradas)

    # Comprobar si la inserción se realizó correctamente
    if cur.rowcount != len(array_entradas):
        raise Exception("No se pudieron insertar todas las entradas correctamente.")
    
def insertar_entradas_new(cur, array_entradas, array_productos, numeracion, usuarioId, usuarioLlave, dato_cero, dato_uno, fecha):
    # Recuperar IDs de productos insertados
    codigos = [p['codigo'] for p in array_productos]
    query_productos_busqueda = ("SELECT idProd, codigo "
                                "FROM almacen_central "
                                "WHERE `identificadorProd` = %s AND codigo IN (%s) "
                                "ORDER BY idProd DESC")
    
    in_placeholder = ', '.join(['%s'] * len(codigos))
    cur.execute(query_productos_busqueda % (usuarioLlave, in_placeholder), codigos)
    id_map = {codigo: idProd for idProd, codigo in cur.fetchall()} 

    query_entradas = ("INSERT INTO `entradas` "
                      "(`idEntr`, `idProd`, `sucursal`, `existencias_entradas`, "
                      "`comprobante`, `causa_devolucion`, `usuario`, `fecha`, "
                      "`existencias_devueltas`, `identificadorEntr`, `estado`) "
                      "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")

    data_entradas = [
                        (id_map[e['codigo']], e['sucursal'], e['existencias_entradas'], 
                        numeracion, dato_cero, usuarioId, fecha, 
                        dato_cero, usuarioLlave, dato_uno) 
                        for e in array_entradas if e['codigo'] in id_map
                    ]
    #if e['codigo'] in id_map: Filtra los elementos en entradas para incluir solo 
    # aquellos cuyo codigo existe como clave en el diccionario id_map.  
    # Esto asegura que solo los registros que tienen un código que corresponde a un idProd en id_map se procesen.
    cur.executemany(query_entradas, data_entradas)

    # Comprobar si la inserción se realizó correctamente
    if cur.rowcount != len(array_entradas):
        raise Exception("No se pudieron insertar todas las entradas correctamente.")
    



# @estadisticas_producto.route('/estadisticas_producto', methods=['POST'])
# def ingresar_datos():
#     data = request.get_json()
#     cursor = mysql.cursor()
    
#     for year, records in data.items():
#         for id_prod, values in records.items():
#             # Aquí se asume que el formato de los valores es [ene, feb, mar, may, ...]
#             ene, feb, mar, may, jun, jul, ago, set, oct, nov, dic = values
#             sql = """
#             INSERT INTO tu_tabla (
#                 id_prod, ene_, feb_, mar_, may_, jun_, jul_, ago_, set_, oct_, nov_, dic_, identificador_estd, estado
#             ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#             """
#             cursor.execute(sql, (id_prod, ene, feb, mar, may, jun, jul, ago, set, oct, nov, dic, year, 'activo'))
    
#     mysql.commit()
#     return jsonify({"status": "success"})