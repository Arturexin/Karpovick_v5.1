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
transferencias_suma_total = Blueprint('transferencias_suma_total', __name__)
transferencias_suma_total_pasado = Blueprint('transferencias_suma_total_pasado', __name__)
productos_transferencias = Blueprint('productos_transferencias', __name__)
productos_transferencias_p = Blueprint('productos_transferencias_p', __name__)


@transferencias_conteo.route('/api/transferencias_conteo_s')##SALIDAS
@cross_origin()
@login_required
def getAllTrasnferenciasConteo():
    try:
        usuarioLlave = session.get('usernameDos')

        categoria_tran = request.args.get('categoria_salidas')
        codigo_tran = request.args.get('codigo_salidas')
        comprobante_tran = request.args.get('comprobante_salidas')
        fecha_inicio_tran_str = request.args.get('fecha_inicio_salidas')
        fecha_fin_tran_str = request.args.get('fecha_fin_salidas')
        
        fecha_inicio_tran = datetime.strptime(fecha_inicio_tran_str, '%Y-%m-%d')
        fecha_fin_tran = datetime.strptime(fecha_fin_tran_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = (   "SELECT COUNT(*) "
                        "FROM transfrencias "
                        "JOIN almacen_central ON `transfrencias`.`id_prod` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "WHERE `identificador_tran` = %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND transfrencias.estado > 0 "
                        "AND fecha_tran >= %s AND fecha_tran < %s ")
            data_params = (usuarioLlave, f"{categoria_tran}%", f"{codigo_tran}%", f"{comprobante_tran}%", 
                        fecha_inicio_tran, fecha_fin_tran + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@transferencias_tabla.route('/api/transferencias_tabla_s/<int:numero>')
@cross_origin()
@login_required
def getAllTransferencias(numero):
    try:
        usuarioLlave = session.get('usernameDos')

        categoria_tran = request.args.get('categoria_salidas')
        codigo_tran = request.args.get('codigo_salidas')
        comprobante_tran = request.args.get('comprobante_salidas')
        fecha_inicio_tran_str = request.args.get('fecha_inicio_salidas')
        fecha_fin_tran_str = request.args.get('fecha_fin_salidas')
       
        fecha_inicio_tran = datetime.strptime(fecha_inicio_tran_str, '%Y-%m-%d')
        fecha_fin_tran = datetime.strptime(fecha_fin_tran_str, '%Y-%m-%d')
       
        with mysql.connection.cursor() as cur:
            query = (   "SELECT id_tran, categoria_nombre, codigo, q_ac, q_su, q_sd, q_st, comprobante, fecha_tran "
                        "FROM transfrencias "
                        "JOIN almacen_central ON `transfrencias`.`id_prod` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "WHERE `identificador_tran` = %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND transfrencias.estado > 0 "
                        "AND fecha_tran >= %s AND fecha_tran < %s "
                        "ORDER BY id_tran ASC "
                        "LIMIT 20 OFFSET %s")
            data_params = (usuarioLlave, f"{categoria_tran}%", f"{codigo_tran}%", f"{comprobante_tran}%", 
                           fecha_inicio_tran, fecha_fin_tran + timedelta(days=1), numero)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
               'id_tran': fila[0],
               'categoria_nombre': fila[1],
               'codigo': fila[2],
               'q_ac': fila[3],
               'q_su': fila[4],
               'q_sd':fila[5],
               'q_st':fila[6],
               'comprobante': fila[7],
               'fecha_tran': fila[8].strftime('%d-%m-%Y'),
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
        q_suc = ['q_ac', 'q_su', 'q_sd', 'q_st', 'q_sc']
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')
        indice_suc = request.args.get('transferencias_sucursal')

        with mysql.connection.cursor() as cur:
            query = (f"SELECT {q_suc[int(indice_suc)]} AS existencias, comprobante, costo_unitario, fecha_tran AS fecha "
                     "FROM transfrencias "
                     "JOIN almacen_central ON `transfrencias`.`id_prod` = `almacen_central`.`idProd` "
                     "WHERE `identificador_tran` = %s "
                     "AND id_prod = %s "
                     "AND transfrencias.estado > 0 "
                     "AND YEAR(fecha_tran) = %s")
            data_params = (usuarioLlave, id_producto, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = {
                'existencias': fila[0],
                'comprobante': fila[1],
                'costo_unitario': fila[2],
                'fecha': fila[3].strftime('%d-%m-%Y')
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@transferencias_suma_total.route('/api/transferencias_suma_total')  # HOME
@cross_origin()
@login_required
def getSumaTotalTransferencias():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT "
                     "SUM(q_ac * costo_unitario) AS suma_total_ac, "
                     "SUM(q_su * costo_unitario) AS suma_total_su, "
                     "SUM(q_sd * costo_unitario) AS suma_total_sd, "
                     "SUM(q_st * costo_unitario) AS suma_total_st "
                     "FROM transfrencias "
                     "JOIN almacen_central ON transfrencias.id_prod = almacen_central.idProd "
                     "WHERE identificador_tran = %s "
                     "AND transfrencias.estado > 0 "
                     "AND YEAR(fecha_tran) = %s")
            data_params = (usuarioLlave, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchone()  # Usamos fetchone ya que esperamos un solo resultado

        if data:
            contenido = { 
                'suma_total_ac': data[0],
                'suma_total_su': data[1],
                'suma_total_sd': data[2],  
                'suma_total_st': data[3]   
            }
            return jsonify(contenido), 200
        else:
            return jsonify({'message': 'No se encontraron transferencias para el año actual.'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@transferencias_suma_total_pasado.route('/api/transferencias_suma_total_anio_pasado')#HOME
@cross_origin()
@login_required
def getSumaTotalTransferenciasAnioPasado():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT "
                    "SUM(q_ac * costo_unitario) AS suma_total_ac, "
                    "SUM(q_su * costo_unitario) AS suma_total_su, "
                    "SUM(q_sd * costo_unitario) AS suma_total_sd, "
                    "SUM(q_st * costo_unitario) AS suma_total_st "
                    "FROM transfrencias "
                    "JOIN almacen_central ON `transfrencias`.`id_prod` = `almacen_central`.`idProd` "
                    "WHERE `identificador_tran` = %s "
                    "AND transfrencias.estado > 0 "
                    "AND YEAR(fecha_tran) < %s ")
            data_params = (usuarioLlave, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchone()

        if data:
            contenido = { 
                'suma_total_ac': data[0],
                'suma_total_su': data[1],
                'suma_total_sd': data[2],  
                'suma_total_st': data[3]   
            }
            return jsonify(contenido), 200
        else:
            return jsonify({'message': 'No se encontraron transferencias para el año actual.'}), 404

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

        data_productos = request.json['array_data_prod']
        data_transferencias = request.json['array_data_tran']

        # Iniciar la transacción manualmente
        cur = mysql.connection.cursor()
        cur.execute("BEGIN")

        # Numeración
        numeracion = incrementar_obtener_numeracion(cur, dato_uno, usuarioLlave, 'Transferencia', 'transferencias')

        # Almacén central - array Actualización del stock
        actualizar_inventario(cur, data_productos, usuarioLlave)

        # Transferencias - arrar
        procesar_transferencias(cur, data_transferencias, usuarioId, usuarioLlave, numeracion, dato_uno)

        mysql.connection.commit()

        return jsonify({"status": "success", "message": f"{numeracion}"}), 200
    
    except Exception as e:
        mysql.connection.rollback()# Hacer rollback en caso de cualquier error
        return jsonify({"status": "error", "message": str(e)})
    
    finally:
        cur.close()  # Asegurarse de cerrar el cursor
    
@productos_transferencias_p.route('/api/procesar_transferencia_p', methods=['POST'])##Transferencias, Productos
@cross_origin()
@login_required
def operarTransferenciaP():
    try:
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_uno = 1
        cur = mysql.connection.cursor()
        cur.execute("BEGIN")

        # Numeración
        numeracion = incrementar_obtener_numeracion(cur, dato_uno, usuarioLlave, 'Transferencia', 'transferencias')

        query_productos = ( "UPDATE `almacen_central` SET "
                            "existencias_ac = existencias_ac + %s, "
                            "existencias_su = existencias_su + %s, "
                            "existencias_sd = existencias_sd + %s, "
                            "existencias_st = existencias_st + %s, "
                            "existencias_sc = existencias_sc + %s "
                            "WHERE `almacen_central`.`idProd` = %s "
                            "AND identificadorProd = %s")
        data_productos = (  request.json['existencias_ac'],request.json['existencias_su'], request.json['existencias_sd'], 
                            request.json['existencias_st'], request.json['existencias_sc'],  request.json['idProd'], usuarioLlave)
        cur.execute(query_productos, data_productos)

        query_transferencias = ("INSERT INTO `transfrencias` "
                                "(`id_tran`, `id_prod`, `q_ac`, `q_su`, `q_sd`, `q_st`, `q_sc`, `comprobante`, `id_usuario`, `fecha_tran`, `identificador_tran`, `estado`) "
                                "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")

        data_transferencias = (request.json['idProd'], request.json['existencias_ac'], request.json['existencias_su'], 
                               request.json['existencias_sd'], request.json['existencias_st'], request.json['existencias_sc'], 
                               numeracion, usuarioId, request.json['fecha'], usuarioLlave, dato_uno)

        cur.execute(query_transferencias, data_transferencias)

        mysql.connection.commit()

        return jsonify({"status": "success", "message": f"{numeracion}"}), 200
    
    except Exception as e:
        mysql.connection.rollback()# Hacer rollback en caso de cualquier error
        return jsonify({"status": "error", "message": str(e)})
    
    finally:
        cur.close()  # Asegurarse de cerrar el cursor
    

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

def actualizar_inventario(cur, data, usuarioLlave):
    # Definir la consulta para actualizar el stock en `almacen_central`
    query_productos = ("UPDATE `almacen_central` SET existencias_ac = existencias_ac + %s, existencias_su = existencias_su + %s, "
                       "existencias_sd = existencias_sd + %s, existencias_st = existencias_st + %s "
                       "WHERE `almacen_central`.`idProd` = %s "
                       "AND identificadorProd = %s "
                       "AND existencias_ac >= 0 "
                       "AND existencias_su >= 0 "
                       "AND existencias_sd >= 0 "
                       "AND existencias_st >= 0")

    # Preparar los datos para la actualización
    data_productos = [(p['saldo_ac'], p['saldo_su'], p['saldo_sd'], p['saldo_st'], 
                       (p['idProd']), usuarioLlave) for p in data]

    # Ejecutar la actualización
    cur.executemany(query_productos, data_productos)

    # Verificar si todas las filas fueron afectadas
    if cur.rowcount != len(data_productos):
        raise Exception("Uno de los productos no cuenta con unidades suficientes, actualice los saldos.")

def procesar_transferencias(cur, data_transferencias, usuarioId, usuarioLlave, numeracion, dato_uno):
    query_transferencias = ("INSERT INTO `transfrencias` "
                            "(`id_tran`, `id_prod`, `q_ac`, `q_su`, `q_sd`, `q_st`, `q_sc`, `comprobante`, `id_usuario`, `fecha_tran`, `identificador_tran`, `estado`) "
                            "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")

    data_transferencias = [(p['idProd'], p['q_ac'], p['q_su'], p['q_sd'], p['q_st'], p['q_sc'], numeracion, 
                            usuarioId, request.json['fecha'], usuarioLlave, dato_uno) for p in data_transferencias]

    cur.executemany(query_transferencias, data_transferencias)
