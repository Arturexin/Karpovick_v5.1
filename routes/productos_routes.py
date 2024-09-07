from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required
# from datetime import datetime, timedelta
from db_connection import mysql

# Definimos el blueprint para las rutas de productos
productos_conteo = Blueprint('productos_conteo', __name__)
productos_tabla = Blueprint('productos_tabla', __name__)
productos_LS = Blueprint('productos_LS', __name__)
productos_stock_sucursal = Blueprint('productos_stock_sucursal', __name__)
productos_individual_id = Blueprint('productos_individual_id', __name__)
productos_individual_stock_suc_id = Blueprint('productos_individual_stock_suc_id', __name__)
productos_extraccion_csv = Blueprint('productos_extraccion_csv', __name__)
productos_actualizar_saldos = Blueprint('productos_actualizar_saldos', __name__)
productos_individual_stock_id = Blueprint('productos_individual_stock_id', __name__)
productos_individual_datos_id = Blueprint('productos_individual_datos_id', __name__)
productos_individual_stock_suc_cod = Blueprint('productos_individual_stock_suc_cod', __name__)
productos_crud = Blueprint('productos_crud', __name__)
productos_modificacion = Blueprint('productos_modificacion', __name__)
productos_remove = Blueprint('productos_remove', __name__)
productos_transferencias = Blueprint('productos_transferencias', __name__)



@productos_conteo.route('/api/almacen_central_conteo')
@cross_origin()
@login_required
def getAllProductosConteo():
    try:
        usuarioLlave = session.get('usernameDos')
        
        categoria_producto = request.args.get('categoria_producto')
        codigo_producto = request.args.get('codigo_producto')
        descripcion_producto = request.args.get('descripcion_producto')
        proveedor_producto = request.args.get('proveedor_producto')

        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) "
                        "FROM almacen_central "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN clientes ON almacen_central.proveedor = clientes.id_cli "
                        "WHERE `identificadorProd` = %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND descripcion LIKE %s "
                        "AND nombre_cli LIKE %s ")
            data_params = (usuarioLlave, f"{categoria_producto}%", f"{codigo_producto}%", f"%{descripcion_producto}%", f"%{proveedor_producto}%")
            cur.execute(query, data_params)
            data = cur.fetchone()[0]
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@productos_tabla.route('/api/almacen_central_tabla/<int:numero>')
@cross_origin()
@login_required
def getAllProductos(numero):
    try:
        usuarioLlave = session.get('usernameDos')
        
        categoria_producto = request.args.get('categoria_producto')
        codigo_producto = request.args.get('codigo_producto')
        descripcion_producto = request.args.get('descripcion_producto')
        proveedor_producto = request.args.get('proveedor_producto')

        with mysql.connection.cursor() as cur:
            query = ("SELECT idProd, categoria_nombre, codigo, descripcion, talla, costo_unitario, precio_venta, lote, nombre_cli, existencias_ac, existencias_su, existencias_sd, existencias_st "
                        "FROM almacen_central "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN clientes ON almacen_central.proveedor = clientes.id_cli "
                        "WHERE identificadorProd = %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND descripcion LIKE %s "
                        "AND nombre_cli LIKE %s "
                        "ORDER BY idProd ASC "
                        "LIMIT 20 OFFSET %s")
            data_params = (usuarioLlave, f"{categoria_producto}%", f"{codigo_producto}%", f"%{descripcion_producto}%", f"%{proveedor_producto}%", numero)
            cur.execute(query, data_params)
            data = cur.fetchall()
        
        resultado = []
        for fila in data:
            contenido = { 
                'idProd': fila[0],
                'categoria_nombre': fila[1],
                'codigo': fila[2], 
                'descripcion': fila[3], 
                'talla': fila[4],
                'costo_unitario': fila[5],
                'precio_venta': fila[6], 
                'lote':fila[7], 
                'nombre_cli': fila[8],
                'existencias_ac':fila[9],
                'existencias_su':fila[10],
                'existencias_sd':fila[11],
                'existencias_st':fila[12]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###--------------------------------------------------------------------------------------------------------------------------------------------------------
@productos_LS.route('/api/almacen_central_ccd')#categoría, código, descripción
@cross_origin()
@login_required
def getAllCCD():
    try:
        usuarioLlave = session.get('usernameDos')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT idProd, categoria, codigo, descripcion "
                     "FROM almacen_central "
                     "WHERE `identificadorProd` = %s")
            cur.execute(query, (usuarioLlave,))
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = {
                'idProd': fila[0],
                'categoria': fila[1],
                'codigo': fila[2], 
                'descripcion': fila[3]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

@productos_stock_sucursal.route('/api/almacen_central_stock_sucursal')#Productos
@cross_origin()
@login_required
def getSumaStockSucursal():
    try:
        usuarioLlave = session.get('usernameDos')

        with mysql.connection.cursor() as cur:
            query = ("SELECT SUM(existencias_ac * costo_unitario) AS almacen_central, "
                     "SUM(existencias_su * costo_unitario ) AS sucursal_uno, "
                     "SUM(existencias_sd * costo_unitario) AS sucursal_dos, "
                     "SUM(existencias_st * costo_unitario) AS sucursal_tres "
                     "FROM `almacen_central` "
                     "WHERE `identificadorProd` = %s")
            cur.execute(query, (usuarioLlave,))
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'almacen_central': fila[0],
                'sucursal_uno': fila[1],
                'sucursal_dos': fila[2],
                'sucursal_tres': fila[3]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@productos_individual_id.route('/api/almacen_central/<int:idProd>')#Entradas, Productos, Salidas
@cross_origin()
@login_required
def getProductos(idProd):
    try:
        with mysql.connection.cursor() as cur:
            query = ("SELECT idProd, existencias_ac, existencias_su, existencias_sd, existencias_st "
                     "FROM almacen_central "
                     "WHERE idProd = %s")
            cur.execute(query, (idProd,))
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                'idProd': fila[0],
                'existencias_ac':fila[1],
                'existencias_su':fila[2],
                'existencias_sd':fila[3],
                'existencias_st':fila[4]
                }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@productos_individual_stock_suc_id.route('/api/almacen_central_id_sucursal_datos/<int:idProd>')#VENTAS, Perdidas
@cross_origin()
@login_required
def getProductosSucursal(idProd):
    try:
        sucursal_get = request.args.get('sucursal_get')
        if sucursal_get not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        with mysql.connection.cursor() as cur:
            query = (f"SELECT idProd, talla, costo_unitario, precio_venta, {sucursal_get} "
                     "FROM almacen_central "
                     "WHERE idProd = %s")
            cur.execute(query, (idProd,))
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                'idProd': fila[0],
                'talla':fila[1],
                'costo_unitario':fila[2],
                'precio_venta':fila[3],
                'sucursal_get':fila[4]
                }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@productos_extraccion_csv.route('/api/productos_extraccion')#Productos para formato CSV
@cross_origin()
@login_required
def getProductosExtraccion():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = (   "SELECT categoria_nombre, codigo, descripcion, talla, costo_unitario, precio_venta, lote, nombre_cli, existencias_ac, existencias_su, existencias_sd, existencias_st "
                        "FROM almacen_central "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN clientes ON almacen_central.proveedor = clientes.id_cli "
                        "WHERE identificadorProd = %s "
                        "ORDER BY idProd ASC ")
            data_params = (usuarioLlave, )
            cur.execute(query, data_params)
            data = cur.fetchall()
        
        resultado = []
        for fila in data:
            contenido = {
                'categoria_nombre': fila[0],
                'codigo': fila[1], 
                'descripcion': fila[2], 
                'talla': fila[3],
                'costo_unitario': fila[4],
                'precio_venta': fila[5], 
                'lote':fila[6], 
                'nombre_cli': fila[7],
                'existencias_ac':fila[8],
                'existencias_su':fila[9],
                'existencias_sd':fila[10],
                'existencias_st':fila[11]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
@productos_actualizar_saldos.route('/api/almacen_central_datos')#VENTAS
@cross_origin()
@login_required
def getProductosSucursalDos():
    try:
        # Obtener el parámetro de la sucursal
        sucursal_get = request.args.get('sucursal_get')
        if sucursal_get not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400

        # Obtener el parámetro de los IDs
        ids_param = request.args.get('ids')
        if not ids_param:
            return jsonify({"status": "error", "message": "No se proporcionaron IDs"}), 400

        # Convertir los IDs en una lista
        ids = ids_param.split(',')
        
        # Construir la consulta SQL
        query = (f"SELECT idProd, talla, costo_unitario, precio_venta, {sucursal_get} "
                 "FROM almacen_central "
                 "WHERE idProd IN (%s)" % ','.join(['%s'] * len(ids)))
        
        with mysql.connection.cursor() as cur:
            cur.execute(query, ids)
            data = cur.fetchall()

        # Crear una lista para almacenar los resultados
        resultados = []
        for fila in data:
            contenido = {
                'idProd': fila[0],
                'talla': fila[1],
                'costo_unitario': fila[2],
                'precio_venta': fila[3],
                'sucursal_get': fila[4]
            }
            resultados.append(contenido)

        return jsonify(resultados)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@productos_individual_stock_id.route('/api/almacen_central_codigo_doble_sucursal/<int:id_busqueda>')#Transferencias
@cross_origin()
@login_required
def getProductosDos(id_busqueda):
    try:
        usuarioLlave = session.get('usernameDos')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT idProd, categoria, descripcion, existencias_ac, existencias_su, existencias_sd, existencias_st "
                     "FROM almacen_central "
                     "WHERE `identificadorProd` = %s "
                     "AND idProd = %s")
            data_params = (usuarioLlave, f"{id_busqueda}%")
            cur.execute(query, data_params)
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                        'idProd': fila[0],
                        'categoria': fila[1],
                        'descripcion': fila[2],
                        'existencias_ac':fila[3],
                        'existencias_su':fila[4],
                        'existencias_sd':fila[5],
                        'existencias_st':fila[6]
                        }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@productos_individual_datos_id.route('/api/almacen_central_id_sucursal/<int:id_busqueda>')#COMPRAS, MODIFICACIÓN
@cross_origin()
@login_required
def getProductosDosSucursal(id_busqueda):
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_get = request.args.get('sucursal_get')
        if sucursal_get not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        
        with mysql.connection.cursor() as cur:
            query = (f"SELECT idProd, categoria, codigo, descripcion, talla, costo_unitario, precio_venta, lote, proveedor, {sucursal_get} "
                    "FROM almacen_central "
                    "WHERE `identificadorProd` = %s "
                    "AND idProd = %s")
            data_params = (usuarioLlave, f"{id_busqueda}")
            cur.execute(query, data_params)
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                        'idProd': fila[0],
                        'categoria': fila[1],
                        'codigo': fila[2], 
                        'descripcion': fila[3], 
                        'talla': fila[4],
                        'costo_unitario': fila[5],
                        'precio_venta': fila[6], 
                        'lote':fila[7], 
                        'proveedor': fila[8],
                        'sucursal_get': fila[9],
                        }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@productos_individual_stock_suc_cod.route('/api/almacen_central_codigo_sucursal/<string:codigo>')#DEVOLUCIONES
@cross_origin()
@login_required
def getProductosTresSucursal(codigo):
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_get = request.args.get('sucursal_get')
        if sucursal_get not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        
        with mysql.connection.cursor() as cur:
            query = (f"SELECT idProd, {sucursal_get} "
                    "FROM almacen_central "
                    "WHERE `identificadorProd` = %s "
                    "AND codigo LIKE %s")
            data_params = (usuarioLlave, f"{codigo}%")
            cur.execute(query, data_params)
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                        'idProd': fila[0],
                        'sucursal_get': fila[1]
                        }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@productos_crud.route('/api/almacen_central', methods=['POST'])##Compras-Registro
@cross_origin()
@login_required
def saveProductos():
    if 'idProd' in request.json:
        upDateProductos()
    else:
        createProductos()
    return "ok"

def createProductos():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `almacen_central` "
                     "(`idProd`, `categoria`, `codigo`, `descripcion`, `talla`, `costo_unitario`, `precio_venta`, `lote`, `proveedor`, `existencias_ac`, `existencias_su`, `existencias_sd`, `existencias_st`, `identificadorProd`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['categoria'], request.json['codigo'], request.json['descripcion'], request.json['talla'],
                    request.json['costo_unitario'], request.json['precio_venta'], request.json['lote'], request.json['proveedor'],
                    request.json['existencias_ac'], request.json['existencias_su'], request.json['existencias_sd'],
                    request.json['existencias_st'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Producto creado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
def upDateProductos():
    try:
        sucursal_post = request.json['sucursal_post']
        usuarioLlave = session.get('usernameDos')
        
        if sucursal_post not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        
        with mysql.connection.cursor() as cur:
            query = (f"UPDATE `almacen_central` SET `categoria` = %s, `codigo` = %s, `descripcion` = %s, `talla` = %s, `costo_unitario` = %s, `precio_venta` = %s, `lote` = %s, `proveedor` = %s, {sucursal_post} = %s "
                     "WHERE `almacen_central`.`idProd` = %s "
                     "AND identificadorProd = %s")
            data = (request.json['categoria'], request.json['codigo'], request.json['descripcion'], request.json['talla'], 
                    request.json['costo_unitario'], request.json['precio_venta'], request.json['lote'], request.json['proveedor'], 
                    request.json['existencias_post'], request.json['idProd'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Producto actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@productos_modificacion.route('/api/almacen_central_categorias', methods=['POST'])##Configuración
@cross_origin()
@login_required
def upDateProductosCategorias():
    try:
        usuarioLlave = session.get('usernameDos')

        with mysql.connection.cursor() as cur:
            query = ("UPDATE `almacen_central` SET `categoria` = %s, `codigo` = %s, `talla` = %s "
                     "WHERE `almacen_central`.`idProd` = %s "
                     "AND identificadorProd = %s")
            data = (request.json['categoria'], request.json['codigo'], request.json['talla'], request.json['idProd'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Producto actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@productos_remove.route('/api/almacen_central/<int:idProd>', methods=['DELETE'])
@cross_origin()
@login_required
def removeProductos(idProd):
    try:
        with mysql.connection.cursor() as cur:
            query = "DELETE FROM `almacen_central` WHERE `almacen_central`.`idProd` = %s"
            cur.execute(query, (idProd,))
            mysql.connection.commit()
        return "Producto eliminado"
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@productos_transferencias.route('/api/procesar_transferencia', methods=['POST'])##Transferencias, Productos
@cross_origin()
@login_required
def operarTransferencia():
    try:
        sucursal_post = request.json['sucursal_post']
        sucursal_post_dos = request.json['sucursal_post_dos']
        
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')

        if sucursal_post and sucursal_post_dos not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        
        with mysql.connection.cursor() as cur:
            query_productos = (f"UPDATE `almacen_central` SET {sucursal_post} = %s,  {sucursal_post_dos} = %s"
                     "WHERE `almacen_central`.`idProd` = %s "
                     "AND identificadorProd = %s")
            data_productos = (request.json['existencias_post'], request.json['existencias_post_dos'], request.json['idProd'], usuarioLlave)
            cur.execute(query_productos, data_productos)
            mysql.connection.commit()

            query_transferencias = ("INSERT INTO `transfrencias` "
                                    "(`id_tran`, `id_suc_origen`, `id_suc_destino`, `id_prod`, `cantidad`, `comprobante`, `id_usuario`, `fecha_tran`, `identificador_tran`) "
                                    "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s)");
            data_transferencias = (request.json['id_suc_origen'], request.json['id_suc_destino'], request.json['idProd'], request.json['cantidad'], request.json['comprobante'], 
                                usuarioId, request.json['fecha_tran'], usuarioLlave)
            cur.execute(query_transferencias, data_transferencias)
            mysql.connection.commit()

        return jsonify({"status": "success", "message": "Catidades actualizadas correctamente."}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500