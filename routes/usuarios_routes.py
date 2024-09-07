from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, session, render_template
from flask_cors import cross_origin
from flask_login import login_required
from werkzeug.security import generate_password_hash
from db_connection import mysql

# Definimos el blueprint para las rutas de usuarios
usuarios_conteo = Blueprint('usuarios_conteo', __name__)
usuarios_tabla = Blueprint('usuarios_tabla', __name__)
usuarios_tabla_local = Blueprint('usuarios_tabla_local', __name__)
usuarios_busqueda = Blueprint('usuarios_busqueda', __name__)
usuarios_post = Blueprint('usuarios_post', __name__)
usuarios_passw_post = Blueprint('usuarios_passw_post', __name__)
usuarios_acciones_post = Blueprint('usuarios_acciones_post', __name__)
usuarios_registro_post = Blueprint('usuarios_registro_post', __name__)
usuarios_registro_interno_post = Blueprint('usuarios_registro_interno_post', __name__)
usuarios_delete = Blueprint('usuarios_delete', __name__)


@usuarios_conteo.route('/api/usuarios_conteo')#Control
@cross_origin()
@login_required
def getAllUsuariosConteo():
    try:
        id_usuarios = request.args.get('id_usuarios')
        nombres_usuarios = request.args.get('nombres_usuarios')
        apellidos_usuarios = request.args.get('apellidos_usuarios')
        dni_usuarios = request.args.get('dni_usuarios')
        e_mail_usuarios = request.args.get('e_mail_usuarios')
        telefono_usuarios = request.args.get('telefono_usuarios')
        cargo_usuarios = request.args.get('cargo_usuarios')
        vinculacion_usuarios = request.args.get('vinculacion_usuarios')
        clave_usuarios = request.args.get('clave_usuarios')

        fecha_inicio_usuarios_str = request.args.get('fecha_inicio_usuarios')
        fecha_fin_usuarios_str = request.args.get('fecha_fin_usuarios')
        
        fecha_inicio_usuarios = datetime.strptime(fecha_inicio_usuarios_str, '%Y-%m-%d')
        fecha_fin_usuarios = datetime.strptime(fecha_fin_usuarios_str, '%Y-%m-%d')

        sucursales_usuarios = request.args.get('sucursales_usuarios')
        usuarios_usuarios = request.args.get('usuarios_usuarios')

        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) "
                    "FROM usuarios "
                    "WHERE id LIKE %s "
                    "AND nombres LIKE %s "
                    "AND apellidos LIKE %s "
                    "AND dni LIKE %s "
                    "AND e_mail LIKE %s "
                    "AND telefono LIKE %s "
                    "AND cargo LIKE %s "
                    "AND vinculacion LIKE %s "
                    "AND clave LIKE %s "
                    "AND fecha >= %s AND fecha < %s"
                    "AND num_sucursales LIKE %s "
                    "AND num_usuarios LIKE %s")
            data_params = (f"{id_usuarios}%", f"{nombres_usuarios}%", f"{apellidos_usuarios}%", f"{dni_usuarios}%", 
                            f"{e_mail_usuarios}%", f"{telefono_usuarios}%", f"{cargo_usuarios}%", f"{vinculacion_usuarios}%",
                            f"{clave_usuarios}%", fecha_inicio_usuarios, fecha_fin_usuarios + timedelta(days=1), f"{sucursales_usuarios}%", f"{usuarios_usuarios}%")
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@usuarios_tabla.route('/api/usuarios_tabla/<int:numero>')#Control
@cross_origin()
@login_required
def getAllUsuarios(numero):
    try:
        id_usuarios = request.args.get('id_usuarios')
        nombres_usuarios = request.args.get('nombres_usuarios')
        apellidos_usuarios = request.args.get('apellidos_usuarios')
        dni_usuarios = request.args.get('dni_usuarios')
        e_mail_usuarios = request.args.get('e_mail_usuarios')
        telefono_usuarios = request.args.get('telefono_usuarios')
        cargo_usuarios = request.args.get('cargo_usuarios')
        vinculacion_usuarios = request.args.get('vinculacion_usuarios')
        clave_usuarios = request.args.get('clave_usuarios')

        fecha_inicio_usuarios_str = request.args.get('fecha_inicio_usuarios')
        fecha_fin_usuarios_str = request.args.get('fecha_fin_usuarios')
        
        fecha_inicio_usuarios = datetime.strptime(fecha_inicio_usuarios_str, '%Y-%m-%d')
        fecha_fin_usuarios = datetime.strptime(fecha_fin_usuarios_str, '%Y-%m-%d')

        sucursales_usuarios = request.args.get('sucursales_usuarios')
        usuarios_usuarios = request.args.get('usuarios_usuarios')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id, nombres, apellidos, dni, e_mail, telefono, cargo, vinculacion, clave, fecha, num_sucursales, num_usuarios, ultimo_pago "
                    "FROM usuarios "
                    "WHERE id LIKE %s "
                    "AND nombres LIKE %s "
                    "AND apellidos LIKE %s "
                    "AND dni LIKE %s "
                    "AND e_mail LIKE %s "
                    "AND telefono LIKE %s "
                    "AND cargo LIKE %s "
                    "AND vinculacion LIKE %s "
                    "AND clave LIKE %s "
                    "AND fecha >= %s AND fecha < %s "
                    "AND num_sucursales LIKE %s "
                    "AND num_usuarios LIKE %s "
                    "ORDER BY id ASC "
                    "LIMIT 20 OFFSET %s")
            data_params = (f"{id_usuarios}%", f"{nombres_usuarios}%", f"{apellidos_usuarios}%", f"{dni_usuarios}%", 
                            f"{e_mail_usuarios}%", f"{telefono_usuarios}%", f"{cargo_usuarios}%", f"{vinculacion_usuarios}%",
                            f"{clave_usuarios}%", fecha_inicio_usuarios, fecha_fin_usuarios + timedelta(days=1), f"{sucursales_usuarios}%", f"{usuarios_usuarios}%", numero)
            cur.execute(query, data_params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'id': fila[0],
                'nombres': fila[1],
                'apellidos': fila[2],
                'dni': fila[3],
                'e_mail': fila[4],
                'telefono': fila[5],
                'cargo': fila[6],
                'vinculacion': fila[7],
                'clave': fila[8],
                'fecha': fila[9].strftime('%d-%m-%Y'),
                'num_sucursales': fila[10],
                'num_usuarios': fila[11],
                'ultimo_pago': fila[12].strftime('%d-%m-%Y')
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@usuarios_tabla_local.route('/api/usuarios_tabla_local')#Configuración
@cross_origin()
@login_required
def getAllUsuariosLocal():
    try:
        usuarioLlave = session.get('usernameDos')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id, nombres, apellidos, dni, e_mail, telefono, cargo, clave, fecha "
                    "FROM usuarios "
                    "WHERE vinculacion = %s "
                    "AND clave != 0 "
                    "AND clave != 3 "
                    "AND clave != 7 "
                    "ORDER BY id ASC ")
            cur.execute(query, (usuarioLlave,))
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'id': fila[0],
                'nombres': fila[1],
                'apellidos': fila[2],
                'dni': fila[3],
                'e_mail': fila[4],
                'telefono': fila[5],
                'cargo': fila[6],
                'clave': fila[7],
                'fecha': fila[8].strftime('%d-%m-%Y')
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@usuarios_busqueda.route('/api/usuarios_busqueda/<int:id>')#Control
@cross_origin()
@login_required
def getUsuario(id):
    try:
        with mysql.connection.cursor() as cur:
            query = ("SELECT id, num_sucursales, num_usuarios FROM usuarios "
                     "WHERE id = %s ")
            cur.execute(query, (id,))
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = {
                'id': fila[0],
                'num_sucursales': fila[1],
                'num_usuarios': fila[2]
                }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@usuarios_post.route('/api/usuarios', methods=['POST'])#Control
@cross_origin()
@login_required
def saveUsuarios():
    if 'id' in request.json:
        editUsuarios()
    else:
        createUsuarios()
    return "ok"

def createUsuarios():
    try:
        with mysql.connection.cursor() as cur:
            consulta = ("INSERT INTO `usuarios` (`id`, `nombres`, `apellidos`, `dni`, `e_mail`, `telefono`, `cargo`, `vinculacion`, `passw`, `clave`, `fecha`, `num_sucursales`, `num_usuarios`, `ultimo_pago`) "
                        "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, 0, %s, %s, %s, %s)")
            valores = (request.json['nombres'], request.json['apellidos'], request.json['dni'], request.json['e_mail'], request.json['telefono'], 
                       request.json['cargo'], request.json['vinculacion'], generate_password_hash(request.json['passw']), request.json['fecha'], 
                       request.json['num_sucursales'], request.json['num_usuarios'], request.json['fecha'])
            cur.execute(consulta,valores)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Usuario creado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def editUsuarios():
    try:
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `usuarios` SET `nombres` = %s, `apellidos` = %s, `dni` = %s, `e_mail` = %s, `telefono` = %s, `cargo` = %s, `vinculacion` = %s "
                     "WHERE `usuarios`.`id` = %s;")
            data = (request.json['nombres'], request.json['apellidos'], request.json['dni'], request.json['e_mail'], request.json['telefono'], request.json['cargo'], 
                    request.json['vinculacion'], request.json['id'])
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Usuario actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@usuarios_passw_post.route('/api/usuarios_passw', methods=['POST'])#Control
@cross_origin()
@login_required
def editPassw():
    try:
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `usuarios` SET `passw` = %s "
                     "WHERE `usuarios`.`id` = %s;")
            data = (generate_password_hash(request.json['passw']), request.json['id'])
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Password actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@usuarios_acciones_post.route('/api/usuarios_acciones', methods=['POST'])#Control
@cross_origin()
@login_required
def editAcciones():
    try:
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `usuarios` SET `vinculacion` = %s, `clave` = %s, `num_sucursales` = %s, `num_usuarios` = %s "
                     "WHERE `usuarios`.`id` = %s;")
            data = (request.json['vinculacion'], request.json['clave'], request.json['num_sucursales'], request.json['num_usuarios'], request.json['id'])
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Password actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@usuarios_registro_post.route('/registro',methods=['POST'])#login
def registro():
    try:
        with mysql.connection.cursor() as cur:
            consulta = ("INSERT INTO `usuarios` (`id`, `nombres`, `apellidos`, `dni`, `e_mail`, `telefono`, `cargo`, `vinculacion`, `passw`, `clave`, `fecha`, `num_sucursales`, `num_usuarios`, `ultimo_pago`) "
                        "VALUES (NULL, %s, %s, %s, %s, %s, 201, 0, %s, 0, %s, 1, 1, %s)")
            valores = (request.json['nombres'], request.json['apellidos'], request.json['dni'], request.json['e_mail'], request.json['telefono'], 
                        generate_password_hash(request.json['passw']), request.json['fecha'], request.json['fecha'])
            cur.execute(consulta,valores)
            mysql.connection.commit()
        return render_template('login.html')
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@usuarios_registro_interno_post.route('/registroInterno',methods=['POST'])#configuración
@cross_origin()
@login_required
def saveUsuariosInterno():
    if 'id' in request.json:
        registroInternoEdit()
    else:
        registroInternoCreate()
    return "ok"
def registroInternoCreate():
    try:
        with mysql.connection.cursor() as cur:
            usuarioLlave = session.get('usernameDos')
            consulta = ("INSERT INTO `usuarios` (`id`, `nombres`, `apellidos`, `dni`, `e_mail`, `telefono`, `cargo`, `vinculacion`, `passw`, `clave`, `fecha`, `num_sucursales`, `num_usuarios`, `ultimo_pago`) "
                        "VALUES (NULL, %s, %s, %s, %s, %s, %s, "+ str(usuarioLlave) +', %s, 0, %s, 0, 0, %s)')
            valores = (request.json['nombres'], request.json['apellidos'], request.json['dni'], request.json['e_mail'], request.json['telefono'], request.json['cargo'], 
                    generate_password_hash(request.json['passw']), request.json['fecha'], request.json['fecha'])
            cur.execute(consulta,valores)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Usuario creado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    

def registroInternoEdit():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `usuarios` SET `nombres` = %s, `apellidos` = %s, `dni` = %s, `e_mail` = %s, `telefono` = %s, `passw` = %s "
                        "WHERE `usuarios`.`id` = %s "
                        "AND `vinculacion` = %s ")
            data = (request.json['nombres'], request.json['apellidos'], request.json['dni'], request.json['e_mail'], request.json['telefono'], 
                    generate_password_hash(request.json['passw']), request.json['id'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Usuario actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@usuarios_delete.route('/api/usuarios/<int:id>', methods=['DELETE'])
@cross_origin()
@login_required
def removeUsuarios(id):
    try:
        with mysql.connection.cursor() as cur:
            query = "DELETE FROM usuarios WHERE `usuarios`.`id` = %s"
            cur.execute(query, (id,))
            mysql.connection.commit()
        return "Usuario eliminado."
    except Exception as e:
        return jsonify({'error': str(e)}), 500