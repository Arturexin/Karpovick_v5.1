from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required
from db_connection import mysql

# Definimos el blueprint para las rutas de numeracion
numeracion_comprobante_control = Blueprint('numeracion_comprobante_control', __name__)
numeracion_comprobante = Blueprint('numeracion_comprobante', __name__)
numeracion_comprobante_post = Blueprint('numeracion_comprobante_post', __name__)
numeracion_comprobante_delete = Blueprint('numeracion_comprobante_delete', __name__)
numeracion_comprobante_datos = Blueprint('numeracion_comprobante_datos', __name__)
numeracion_comprobante_datos_post = Blueprint('numeracion_comprobante_datos_post', __name__)

@numeracion_comprobante_control.route('/api/numeracion_comprobante_control')#CONTROL
@cross_origin()
@login_required
def getAllNumeracionComprobanteControl():
    try:
        with mysql.connection.cursor() as cur:
            query = ("SELECT id, compras, recompras, transferencias, ventas, nota_venta, boleta_venta, factura "
                     "FROM numeracion_comprobante")
            cur.execute(query)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id': fila[0],
                'compras': fila[1],
                'recompras': fila[2],
                'transferencias': fila[3],
                'ventas': fila[4],
                'nota_venta': fila[5],
                'boleta_venta': fila[6],
                'factura': fila[7]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
#####################################################################################################
@numeracion_comprobante.route('/api/numeracion_comprobante')
@cross_origin()
@login_required
def getAllNumeracionComprobante():
    try:
        usuarioLlave = session.get('usernameDos')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id, compras, recompras, transferencias, ventas, nota_venta, boleta_venta, factura "
                     "FROM numeracion_comprobante "
                     "WHERE `identificador` = %s "
                     "AND numeracion_comprobante.estado > 0 ")
            cur.execute(query, (usuarioLlave,))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id': fila[0],
                'compras': fila[1],
                'recompras': fila[2],
                'transferencias': fila[3],
                'ventas': fila[4],
                'nota_venta': fila[5],
                'boleta_venta': fila[6],
                'factura': fila[7]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@numeracion_comprobante_post.route('/api/numeracion_comprobante', methods=['POST'])
@cross_origin()
@login_required
def saveNumeracionComprobante():
    if 'id' in request.json:
        editNumeracionComprobante()
    else:
        createNumeracionComprobante()
    return "ok"

def createNumeracionComprobante():
    try:
        dato_uno = 1
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `numeracion_comprobante` (`id`, `compras`, `recompras`, `transferencias`, `ventas`, `nota_venta`, `boleta_venta`, `factura`, `identificador`, "
                     "`nombre_empresa`, `ruc`, `direccion`, `moneda`, `web`, `estado`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            dato = (request.json['compras'], request.json['recompras'], request.json['transferencias'], request.json['ventas'], request.json['nota_venta'], 
                    request.json['boleta_venta'], request.json['factura'], request.json['identificador'], request.json['nombre_empresa'], request.json['ruc'], 
                    request.json['direccion'], request.json['moneda'], request.json['web'], dato_uno)
            cur.execute(query, dato)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Numeración creada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def editNumeracionComprobante():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `numeracion_comprobante` SET `compras` = %s, `recompras` = %s, `transferencias` = %s, `ventas` = %s, `nota_venta` = %s, `boleta_venta` = %s, `factura` = %s "
                     "WHERE `numeracion_comprobante`.`id` = %s "
                     "AND identificador = %s")
            data = (request.json['compras'], request.json['recompras'], request.json['transferencias'], request.json['ventas'], request.json['nota_venta'], 
                    request.json['boleta_venta'], request.json['factura'], request.json['id'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Numeración actualizada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@numeracion_comprobante_delete.route('/api/numeracion_comprobante/<int:id>', methods=['DELETE'])
@cross_origin()
@login_required
def removeNumeracionComprobante(id):
    try:
        with mysql.connection.cursor() as cur:
            query = "DELETE FROM numeracion_comprobante WHERE `numeracion_comprobante`.`id` = %s"
            cur.execute(query, (id,))
            mysql.connection.commit()
        return "numeración eliminada"  
    except Exception as e:
        return jsonify({'error': str(e)}), 500  
#########################################
@numeracion_comprobante_datos.route('/api/numeracion_comprobante_datos')
@cross_origin()
@login_required
def getNumeracionDatos():
    try:
        usuarioLlave = session.get('usernameDos')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id, nombre_empresa, ruc, direccion, moneda, web "
                     "FROM numeracion_comprobante "
                     "WHERE `identificador` = %s "
                     "AND numeracion_comprobante.estado > 0 ")
            cur.execute(query, (usuarioLlave,))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id': fila[0],
                'nombre_empresa': fila[1],
                'ruc': fila[2],
                'direccion': fila[3],
                'moneda': fila[4],
                'web': fila[5]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@numeracion_comprobante_datos_post.route('/api/numeracion_comprobante_datos', methods=['POST'])
@cross_origin()
@login_required
def editNumeracionDatos():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `numeracion_comprobante` SET `nombre_empresa` = %s, `ruc` = %s, `direccion` = %s, `moneda` = %s, `web` = %s "
                     "WHERE `numeracion_comprobante`.`id` = %s "
                     "AND identificador = %s")
            data = (request.json['nombre_empresa'], request.json['ruc'], request.json['direccion'], request.json['moneda'], 
                    request.json['web'], request.json['id'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Datos de negocio actualizados correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

##############################################################################
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

def incrementar_obtener_numeracion_v(cur, item_ticket, dato_uno, usuarioLlave, ticket):
    # Actualizar la numeración
    query_numeracion = (f"UPDATE `numeracion_comprobante` SET ventas = ventas + %s, {item_ticket} = {item_ticket} + %s "
                        "WHERE `numeracion_comprobante`.`id` = %s AND identificador = %s")
    data_numeracion = (dato_uno, dato_uno, request.json['id_num'], usuarioLlave)
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
    
    return [f"Venta-{contenido['ventas']}", f"{ticket}{contenido[item_ticket]}"]