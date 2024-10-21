from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required
from db_connection import mysql

# Definimos el blueprint para las rutas de categorias
categorias_conteo = Blueprint('categorias_conteo', __name__)
categorias_tabla = Blueprint('categorias_tabla', __name__)
categorias_get = Blueprint('categorias_get', __name__)
categorias_post = Blueprint('categorias_post', __name__)
categorias_delete = Blueprint('categorias_delete', __name__)


@categorias_conteo.route('/api/categorias_conteo')
@cross_origin()
@login_required
def getAllCategoriasConteo():
    try:
        usuarioLlave = session.get('usernameDos')

        categoria_categorias = request.args.get('categoria_categorias')
        unidad_categorias = request.args.get('unidad_categorias')
        cantidad_categorias = request.args.get('cantidad_categorias')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) "
                        "FROM categorias "
                        "WHERE `identificador` = %s "
                        "AND categoria_nombre LIKE %s "
                        "AND unidad_medida LIKE %s "
                        "AND categorias.estado > 0 "
                        "AND cantidad_item LIKE %s")
            data_params = (usuarioLlave, f"{categoria_categorias}%", f"{unidad_categorias}%", f"{cantidad_categorias}%")
            cur.execute(query, data_params)
            data = cur.fetchone()[0]
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categorias_tabla.route('/api/categorias_tabla/<int:numero>')
@cross_origin()
@login_required
def getAllCategorias(numero):
    try:
        usuarioLlave = session.get('usernameDos')

        categoria_categorias = request.args.get('categoria_categorias')
        unidad_categorias = request.args.get('unidad_categorias')
        cantidad_categorias = request.args.get('cantidad_categorias')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT id, categoria_nombre, unidad_medida, cantidad_item, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez, once, doce "
                        "FROM categorias "
                        "WHERE identificador = %s "
                        "AND categoria_nombre LIKE %s "
                        "AND unidad_medida LIKE %s "
                        "AND categorias.estado > 0 "
                        "AND cantidad_item LIKE %s "
                        "ORDER BY id ASC "
                        "LIMIT 10 OFFSET %s")
            data_params = (usuarioLlave, f"{categoria_categorias}%", f"{unidad_categorias}%", f"{cantidad_categorias}%", numero)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id': fila[0],
                'categoria_nombre': fila[1],
                'unidad_medida': fila[2],
                'cantidad_item': fila[3], 
                'uno': fila[4], 
                'dos':fila[5], 
                'tres': fila[6], 
                'cuatro': fila[7], 
                'cinco':fila[8], 
                'seis': fila[9],
                'siete': fila[10],
                'ocho': fila[11],
                'nueve': fila[12],
                'diez': fila[13],
                'once': fila[14],
                'doce': fila[15]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categorias_get.route('/api/categorias')
@cross_origin()
@login_required
def getAllCategoriasLlenar():
    try:
        usuarioLlave = session.get('usernameDos')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT id, categoria_nombre, unidad_medida, cantidad_item, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez, once, doce "
                     "FROM categorias "
                     "WHERE `identificador` = %s "
                     "AND categorias.estado > 0 ")
            cur.execute(query, (usuarioLlave,))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'id': fila[0],
                'categoria_nombre': fila[1],
                'unidad_medida': fila[2],
                'cantidad_item': fila[3], 
                'uno': fila[4], 
                'dos':fila[5], 
                'tres': fila[6], 
                'cuatro': fila[7], 
                'cinco':fila[8], 
                'seis': fila[9],
                'siete': fila[10],
                'ocho': fila[11],
                'nueve': fila[12],
                'diez': fila[13],
                'once': fila[14],
                'doce': fila[15]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categorias_post.route('/api/categorias', methods=['POST'])
@cross_origin()
@login_required
def saveCategorias():
    if 'id' in request.json:
        editCategorias()
    else:
        createCategorias()
    return "ok"

def createCategorias():
    try:
        dato_uno = 1
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `categorias` "
                     "(`id`, `categoria_nombre`, `unidad_medida`, `cantidad_item`, `uno`, `dos`, `tres`, `cuatro`, `cinco`, `seis`, `siete`, `ocho`, "
                     "`nueve`, `diez`, `once`, `doce`, `identificador`, `estado`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['categoria_nombre'], request.json['unidad_medida'], request.json['cantidad_item'], request.json['uno'], request.json['dos'], 
                    request.json['tres'], request.json['cuatro'], request.json['cinco'], request.json['seis'], request.json['siete'], request.json['ocho'], 
                    request.json['nueve'], request.json['diez'], request.json['once'], request.json['doce'], usuarioLlave, dato_uno)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Categoría creada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def editCategorias():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `categorias` SET `categoria_nombre` = %s, `unidad_medida` = %s, `cantidad_item` = %s, `uno` = %s, `dos` = %s, `tres` = %s, "
                     "`cuatro` = %s, `cinco` = %s, `seis` = %s, `siete` = %s, `ocho` = %s, `nueve` = %s, `diez` = %s, `once` = %s, `doce` = %s "
                     "WHERE `categorias`.`id` = %s "
                     "AND `identificador` = %s")
            data = (request.json['categoria_nombre'], request.json['unidad_medida'], request.json['cantidad_item'], request.json['uno'], request.json['dos'], 
                    request.json['tres'], request.json['cuatro'], request.json['cinco'], request.json['seis'], request.json['siete'], request.json['ocho'], 
                    request.json['nueve'], request.json['diez'], request.json['once'], request.json['doce'], request.json['id'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Categoría actualizada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@categorias_delete.route('/api/categorias_remove', methods=['POST'])
@cross_origin()
@login_required
def removeCategorias():
    try:
        dato_cero = 0
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `categorias` SET `estado` = %s "
                     "WHERE `categorias`.`id` = %s "
                     "AND identificador = %s")
            data = (dato_cero, request.json['id'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Categoría eliminada correctamente."})
    except Exception as e:
        return jsonify({'error': str(e)}), 500