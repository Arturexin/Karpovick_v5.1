from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required
from db_connection import mysql

# Definimos el blueprint para las rutas de entradas
entradas_conteo = Blueprint('entradas_conteo', __name__)
entradas_tabla = Blueprint('entradas_tabla', __name__)
entradas_suma_total_mes = Blueprint('entradas_suma_total_mes', __name__)
entradas_suma_total_pasado = Blueprint('entradas_suma_total_pasado', __name__)
entradas_suma_devoluciones_mes = Blueprint('entradas_suma_devoluciones_mes', __name__)
entradas_individual_id = Blueprint('entradas_individual_id', __name__)
entradas_extraccion_csv = Blueprint('entradas_extraccion_csv', __name__)
entradas_id_kardex = Blueprint('entradas_id_kardex', __name__)
entradas_comprobante = Blueprint('entradas_comprobante', __name__)
entradas_post = Blueprint('entradas_post', __name__)
entradas_delete = Blueprint('entradas_delete', __name__)
entradas_devolucion_post = Blueprint('entradas_devolucion_post', __name__)
entradas_recompra_individual_post = Blueprint('entradas_recompra_individual_post', __name__)
entradas_recompra_grupal_post = Blueprint('entradas_recompra_grupal_post', __name__)
entradas_traspasos_get_post = Blueprint('entradas_traspasos_get_post', __name__)
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

#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

@entradas_suma_total_mes.route('/api/entradas_suma_total_mes')#HOME
@cross_origin()
@login_required
def getSumaTotalEntradasMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, "
                     "SUM((existencias_entradas - existencias_devueltas) * costo_unitario) AS suma_total_entradas "
                     "FROM entradas JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorEntr` = %s "
                     "AND entradas.estado > 0 "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal")
            data_params = (usuarioLlave, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'suma_total_entradas': fila[2]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entradas_suma_total_pasado.route('/api/entradas_suma_total_pasado')#HOME
@cross_origin()
@login_required
def getSumaTotalEntradasPasado():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT sucursal, "
                     "SUM((existencias_entradas - existencias_devueltas) * costo_unitario) AS suma_total_entradas_pasado "
                     "FROM entradas "
                     "JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorEntr` = %s "
                     "AND entradas.estado > 0 "
                     "AND YEAR(fecha) < %s "
                     "GROUP BY sucursal")
            data_params = (usuarioLlave, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'sucursal': fila[0],
                'suma_total_entradas_pasado': fila[1]
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
                     "SUM((existencias_entradas - existencias_devueltas) * costo_unitario) AS suma_devoluciones_entradas "
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
                'suma_devoluciones_entradas': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@entradas_individual_id.route('/api/entradas/<int:idEntr>')#ENTRADAS
@cross_origin()
@login_required
def getEntradas(idEntr):
    try:
        with mysql.connection.cursor() as cur:
            query = ("SELECT idEntr, idProd, sucursal, existencias_entradas, comprobante, causa_devolucion, usuario, fecha, existencias_devueltas "
                     "FROM entradas "
                     "WHERE idEntr = %s "
                     "AND entradas.estado > 0 ")
            cur.execute(query, (idEntr,))
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                'idEntr': fila[0],
                'idProd': fila[1],
                'sucursal': fila[2],
                'existencias_entradas':fila[3],
                'comprobante': fila[4],
                'causa_devolucion': fila[5],
                'usuario': fila[6],
                'fecha': fila[7],
                'existencias_devueltas': fila[8]
                }
        return jsonify(contenido)
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
                'fecha': fila[3].strftime('%d-%m-%Y'),
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
            query = ("SELECT idEntr, sucursal_nombre, codigo, existencias_entradas, comprobante, existencias_devueltas, id_sucursales, `entradas`.`idProd` AS id_prod "
                     "FROM entradas "
                     "JOIN almacen_central ON `entradas`.`idProd` = `almacen_central`.`idProd` "
                     "JOIN sucursales ON `entradas`.`sucursal` = `sucursales`.`id_sucursales` "
                     "WHERE `identificadorEntr` = %s "
                     "AND entradas.estado > 0 "
                     "AND comprobante LIKE %s")
            data_params = (usuarioLlave, f"{comprobante}%")
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = {
                'idEntr': fila[0],
                'sucursal_nombre': fila[1],
                'codigo': fila[2],
                'existencias_entradas':fila[3],
                'comprobante': fila[4],
                'existencias_devueltas': fila[5],
                'id_sucursales': fila[6],
                'id_prod': fila[7]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@entradas_post.route('/api/entradas', methods=['POST'])
@cross_origin()
@login_required
def saveEntradas():
    if 'idEntr' in request.json:
        editEntradas()
    else:
        createEntradas()
    return "ok"

def createEntradas(): #Entradas
    try:
        dato_uno = 0
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `entradas` "
                     "(`idEntr`, `idProd`, `sucursal`, `existencias_entradas`, `comprobante`, `causa_devolucion`, "
                     "`usuario`, `fecha`, `existencias_devueltas`, `identificadorEntr`, `estado`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['idProd'], request.json['sucursal'], request.json['existencias_entradas'], request.json['comprobante'], dato_cero, 
                    usuarioId, request.json['fecha'], dato_cero, usuarioLlave, dato_uno)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Entrada creada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def editEntradas():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `entradas` SET `existencias_entradas` = %s, `existencias_devueltas` = %s "
                     "WHERE `entradas`.`idEntr` = %s "
                     "AND identificadorEntr = %s")
            data = (request.json['existencias_entradas'], request.json['existencias_devueltas'], request.json['idEntr'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Entrada actualizada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

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
                                (s['existencias_post'], s['idEntr'], usuarioLlave) 
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

@entradas_recompra_individual_post.route('/api/procesar_recompra', methods=['POST'])##Productos
@cross_origin()
@login_required
def operarRecompra():
    try:
        recompra_data = request.json
        dato_uno = 1
        usuarioLlave = session.get('usernameDos')

        cur = mysql.connection.cursor()
        cur.execute("BEGIN")

        # Numeración
        numeracion = incrementar_obtener_numeracion(cur, dato_uno, usuarioLlave, 'Recompra', 'recompras')

        query_productos = ( "UPDATE `almacen_central` SET "
                            "existencias_ac = existencias_ac + %s, "
                            "existencias_su = existencias_su + %s, "
                            "existencias_sd = existencias_sd + %s, "
                            "existencias_st = existencias_st + %s, "
                            "existencias_sc = existencias_sc + %s "
                            "WHERE `almacen_central`.`idProd` = %s "
                            "AND `almacen_central`.`estado` = 1 "
                            "AND identificadorProd = %s")
        
        data_productos = (  request.json['existencias_ac'],request.json['existencias_su'], request.json['existencias_sd'], 
                            request.json['existencias_st'], request.json['existencias_sc'],  request.json['idProd'], usuarioLlave)
        cur.execute(query_productos, data_productos)

        procesar_e_insertar_entradas(cur, recompra_data, numeracion, session.get('identificacion_usuario'), usuarioLlave, 'array_entradas')
        
        mysql.connection.commit()

        return jsonify({"status": "success", "message": f"{numeracion}"}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
########################################################################################################
@entradas_recompra_grupal_post.route('/api/gestion_de_recompras', methods=['POST'])##Recompras
@cross_origin()
@login_required
def gestionDeRecompras():
    try:
        # Obtener los datos del cuerpo de la solicitud
        recompra_data = request.json
        usuarioLlave = session.get('usernameDos')
        dato_uno = 1

        # Iniciar la transacción manualmente
        cur = mysql.connection.cursor()
        cur.execute("BEGIN")

        # Numeración
        numeracion = incrementar_obtener_numeracion(cur, dato_uno, usuarioLlave, 'Recompra', 'recompras')
        # Actualizar el inventario en 'almacen_central'
        error_message = actualizar_almacen_central_suma(cur, recompra_data, usuarioLlave, 'array_productos_dos')
        if error_message:
            return error_message

        # Procesar e insertar las entradas en la tabla 'entradas'
        procesar_e_insertar_entradas(cur, recompra_data, numeracion, session.get('identificacion_usuario'), usuarioLlave, 'array_entradas_dos')

        # Confirmar la transacción
        mysql.connection.commit()

        return jsonify({"status": "success", "message": f"{numeracion}"}), 200
    
    except Exception as e:
        mysql.connection.rollback()# Hacer rollback en caso de cualquier error
        return jsonify({"status": "error", "message": str(e)})
    
    finally:
        cur.close()  # Asegurarse de cerrar el cursor
#######################################################################################################

@entradas_traspasos_get_post.route('/api/gestion_de_traspasos', methods=['GET', 'POST'])##Compras-Registro#ya no se usa
@cross_origin()
@login_required
def gestionDeTraspasos():
    try:
        dato_uno = 1
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0

        productos_compra = request.json.get('array_productos', [])
        entradas_compra = request.json.get('array_entradas', [])

        with mysql.connection.cursor() as cur:
            # Inserciones en lote para productos
            query_productos = ( "INSERT INTO `almacen_central` "
                                "(`categoria`, `codigo`, `descripcion`, `talla`, `costo_unitario`, `precio_venta`, `lote`, `proveedor`, "
                                "`existencias_ac`, `existencias_su`, `existencias_sd`, `existencias_st`, `identificadorProd`, `estado`) "
                                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            
            data_productos =    [
                                ( p['categoria'], p['codigo'], p['descripcion'], p['talla'],
                                p['costo_unitario'], p['precio_venta'], p['lote'], p['proveedor'],
                                p['existencias_ac'], p['existencias_su'], p['existencias_sd'],
                                p['existencias_st'], usuarioLlave, dato_uno) 
                                for p in productos_compra
                                ]
            cur.executemany(query_productos, data_productos)

            # Recuperar IDs de productos insertados
            codigos = [p['codigo'] for p in productos_compra]
            query_productos_busqueda = ("SELECT idProd, codigo "
                                        "FROM almacen_central "
                                        "WHERE `identificadorProd` = %s AND codigo IN (%s) "
                                        "ORDER BY idProd DESC")
            
            in_placeholder = ', '.join(['%s'] * len(codigos))
            cur.execute(query_productos_busqueda % (usuarioLlave, in_placeholder), codigos)
            id_map = {codigo: idProd for idProd, codigo in cur.fetchall()} 

            # Inserciones en lote para entradas
            query_entradas = (  "INSERT INTO `entradas` "
                                "(`idProd`, `sucursal`, `existencias_entradas`, `comprobante`, `causa_devolucion`, `usuario`, `fecha`, "
                                "`existencias_devueltas`, `identificadorEntr`, `estado`) "
                                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            
            data_entradas =     [
                                (id_map[e['codigo']], e['sucursal'], e['existencias_entradas'], e['comprobante'], dato_cero,
                                usuarioId, e['fecha'], dato_cero, usuarioLlave, dato_uno) 
                                for e in entradas_compra if e['codigo'] in id_map
                                ]
            #if e['codigo'] in id_map: Filtra los elementos en entradas para incluir solo 
            # aquellos cuyo codigo existe como clave en el diccionario id_map.  
            # Esto asegura que solo los registros que tienen un código que corresponde a un idProd en id_map se procesen.
            cur.executemany(query_entradas, data_entradas)

            mysql.connection.commit() 

        return jsonify({"status": "success", "message": "Productos creados correctamente."})

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@entradas_compras_grupal_get_post.route('/api/gestion_de_compras', methods=['GET', 'POST'])##Compras-Registro
@cross_origin()
@login_required
def gestionDeCompras():
    try:
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0
        dato_uno = 1

        productos_compra = request.json.get('array_productos', [])
        entradas_compra = request.json.get('array_entradas', [])

        # Iniciar la transacción manualmente
        cur = mysql.connection.cursor()
        cur.execute("BEGIN")

        # Numeración
        numeracion = incrementar_obtener_numeracion(cur, dato_uno, usuarioLlave, 'Compra', 'compras')
        # Inserciones en lote para productos
        query_productos = ( "INSERT INTO `almacen_central` "
                            "(`categoria`, `codigo`, `descripcion`, `talla`, `costo_unitario`, `precio_venta`, `lote`, `proveedor`, "
                            "`existencias_ac`, `existencias_su`, `existencias_sd`, `existencias_st`, `identificadorProd`, `estado`) "
                            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
        
        data_productos =    [
                            (p['categoria'], p['codigo'], p['descripcion'], p['talla'],
                            p['costo_unitario'], p['precio_venta'], p['lote'], p['proveedor'],
                            p['existencias_ac'], p['existencias_su'], p['existencias_sd'],
                            p['existencias_st'], usuarioLlave, dato_uno) 
                            for p in productos_compra
                            ]
        cur.executemany(query_productos, data_productos)

        # Recuperar IDs de productos insertados
        codigos = [p['codigo'] for p in productos_compra]
        query_productos_busqueda = ("SELECT idProd, codigo "
                                    "FROM almacen_central "
                                    "WHERE `identificadorProd` = %s AND codigo IN (%s) "
                                    "ORDER BY idProd DESC")
        
        in_placeholder = ', '.join(['%s'] * len(codigos))
        cur.execute(query_productos_busqueda % (usuarioLlave, in_placeholder), codigos)
        id_map = {codigo: idProd for idProd, codigo in cur.fetchall()} 

        # Inserciones en lote para entradas
        query_entradas = (  "INSERT INTO `entradas` "
                            "(`idEntr`, `idProd`, `sucursal`, `existencias_entradas`, `comprobante`, `causa_devolucion`, `usuario`, `fecha`, "
                            "`existencias_devueltas`, `identificadorEntr`, `estado`) "
                            "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
        
        data_entradas =     [
                            (id_map[e['codigo']], e['sucursal'], e['existencias_entradas'], numeracion, dato_cero,
                            usuarioId, request.json['fecha'], dato_cero, usuarioLlave, dato_uno) 
                            for e in entradas_compra if e['codigo'] in id_map
                            ]
        #if e['codigo'] in id_map: Filtra los elementos en entradas para incluir solo 
        # aquellos cuyo codigo existe como clave en el diccionario id_map.  
        # Esto asegura que solo los registros que tienen un código que corresponde a un idProd en id_map se procesen.
        cur.executemany(query_entradas, data_entradas)
        
        mysql.connection.commit()

        return jsonify({"status": "success", "message": f"{numeracion}"}), 200
    
    except Exception as e:
        mysql.connection.rollback()# Hacer rollback en caso de cualquier error
        return jsonify({"status": "error", "message": str(e)})
    
    finally:
        cur.close()  # Asegurarse de cerrar el cursor
    
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

def procesar_e_insertar_entradas(cur, recompra_data, numeracion, usuarioId, usuarioLlave, nombre_array):
    """
    Inserta los datos de las entradas en la tabla 'entradas' de una sola vez.
    """
    dato_cero = 0
    dato_uno = 1
    # Preparar los datos para la inserción en 'entradas'
    data_entradas = [(entrada['idProd'], entrada['sucursal'], entrada['existencias_entradas'],
                    numeracion, dato_cero, usuarioId, recompra_data['fecha'], dato_cero, usuarioLlave, dato_uno)
                    for entrada in recompra_data[nombre_array]]

    # Insertar los datos procesados en la tabla 'entradas'
    query_entradas = ("INSERT INTO `entradas` "
                      "(`idEntr`, `idProd`, `sucursal`, `existencias_entradas`, "
                      "`comprobante`, `causa_devolucion`, `usuario`, `fecha`, "
                      "`existencias_devueltas`, `identificadorEntr`, `estado`) "
                      "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
    
    # Ejecutar la inserción con `executemany`
    cur.executemany(query_entradas, data_entradas)

