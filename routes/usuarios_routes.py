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
usuarios_estado_post = Blueprint('usuarios_estado_post', __name__)


asistencias_conteo = Blueprint('asistencias_conteo', __name__)
asistencias_tabla = Blueprint('asistencias_tabla', __name__)
usuarios_registro_asistencias = Blueprint('usuarios_registro_asistencias', __name__)
usuarios_asistencia_busqueda = Blueprint('usuarios_asistencia_busqueda', __name__)
edit_asistencias = Blueprint('edit_asistencias', __name__)
asistencias_remove = Blueprint('asistencias_remove', __name__)
usuarios_asistencia_remuneracion = Blueprint('usuarios_asistencia_remuneracion', __name__)
usuarios_asistencia_remuneracion_multiple = Blueprint('usuarios_asistencia_remuneracion_multiple', __name__)


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
            query = ("SELECT id, nombres, apellidos, dni, e_mail, telefono, cargo, vinculacion, clave, fecha, num_sucursales, num_usuarios, salario_usu, afp_onp, asig_fam, salud "
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
                'salario_usu': fila[12],
                'afp_onp': fila[13],
                'asig_fam': fila[14],
                'salud': fila[15],
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
            query = ("SELECT id, nombres, apellidos, dni, e_mail, telefono, cargo, clave, fecha, salario_usu, afp_onp, asig_fam, salud "
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
                'fecha': fila[8].strftime('%d-%m-%Y'),
                'salario_usu': fila[9],
                'afp_onp': fila[10],
                'asig_fam': fila[11],
                'salud': fila[12],
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
        return editUsuarios()
    else:
        return createUsuarios()

def createUsuarios():
    try:
        dato_cero = 0
        dato_uno = 1
        dato_cargo = 0
        with mysql.connection.cursor() as cur:
            consulta = ("INSERT INTO `usuarios` (`id`, `nombres`, `apellidos`, `dni`, `e_mail`, `telefono`, "
                        "`cargo`, `vinculacion`, `passw`, `clave`, `fecha`, `num_sucursales`, `num_usuarios`, "
                        "`salario_usu`, `afp_onp`, `asig_fam`, `salud`) "
                        "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            valores = (request.json['nombres'], request.json['apellidos'], request.json['dni'], request.json['e_mail'], request.json['telefono'], 
                        dato_cargo, dato_cero, generate_password_hash(request.json['passw']), dato_cero, request.json['fecha'], dato_uno, dato_uno, 
                        dato_cero, dato_cero, dato_cero, dato_cero)
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
        return jsonify({"status": "success", "message": "Usuario activado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@usuarios_registro_post.route('/registro',methods=['POST'])#login
def registro():
    try:
        dato_cero = 0
        dato_uno = 1
        dato_cargo = 201
        with mysql.connection.cursor() as cur:
            consulta = ("INSERT INTO `usuarios` (`id`, `nombres`, `apellidos`, `dni`, `e_mail`, `telefono`, "
                        "`cargo`, `vinculacion`, `passw`, `clave`, `fecha`, `num_sucursales`, `num_usuarios`, "
                        "`salario_usu`, `afp_onp`, `asig_fam`, `salud`) "
                        "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            valores = ( request.json['nombres'], request.json['apellidos'], request.json['dni'], request.json['e_mail'], request.json['telefono'], 
                        dato_cargo, dato_cero, generate_password_hash(request.json['passw']), dato_cero, request.json['fecha'], dato_uno, dato_uno, 
                        dato_cero, dato_cero, dato_cero, dato_cero)
            cur.execute(consulta,valores)
            mysql.connection.commit()
        return render_template('login.html')
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})


@usuarios_registro_interno_post.route('/api/registroInterno',methods=['POST'])#Usuarios
@cross_origin()
@login_required
def saveUsuariosInterno():
    if 'id' in request.json:
        return registroInternoEdit()
    else:
        return registroInternoCreate()

def registroInternoCreate():
    try:
        with mysql.connection.cursor() as cur:
            dato_cero = 0
            usuarioLlave = session.get('usernameDos')
            consulta = ("INSERT INTO `usuarios` (`id`, `nombres`, `apellidos`, `dni`, `e_mail`, `telefono`, "
                        "`cargo`, `vinculacion`, `passw`, `clave`, `fecha`, `num_sucursales`, `num_usuarios`, "
                        "`salario_usu`, `afp_onp`, `asig_fam`, `salud`) "
                        "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            valores = ( request.json['nombres'], request.json['apellidos'], request.json['dni'], request.json['e_mail'], request.json['telefono'], 
                        request.json['cargo'], usuarioLlave, generate_password_hash(request.json['passw']), dato_cero, request.json['fecha'], dato_cero, dato_cero, 
                        request.json['salario_usu'], request.json['afp_onp'], request.json['asig_fam'], request.json['salud'])
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
            query = ("UPDATE `usuarios` SET `nombres` = %s, `apellidos` = %s, `dni` = %s, `e_mail` = %s, `telefono` = %s, `cargo` = %s, "
                        "`salario_usu` = %s, `afp_onp` = %s, `asig_fam` = %s, `salud` = %s, `passw` = %s "
                        "WHERE `usuarios`.`id` = %s "
                        "AND `vinculacion` = %s ")
            data = (request.json['nombres'], request.json['apellidos'], request.json['dni'], request.json['e_mail'], request.json['telefono'], request.json['cargo'], 
                    request.json['salario_usu'], request.json['afp_onp'], request.json['asig_fam'], request.json['salud'], 
                    generate_password_hash(request.json['passw']), request.json['id'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Usuario actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@usuarios_estado_post.route('/api/usuarios_estado', methods=['POST'])#Usuarios
@cross_origin()
@login_required
def editAccionesAsistencia():
    #"""Edita la información de un usuario y registra la asistencia."""
    try:
        usuarioLlave = session.get('usernameDos')
        
        dato_uno = 1
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `usuarios` SET `clave` = %s "
                     "WHERE `usuarios`.`id` = %s "
                     "AND  `vinculacion` = %s ")
            data = (request.json['clave'], request.json['colaborador'], usuarioLlave)
            cur.execute(query, data)
            if 'id_asistencia' in request.json:
                response = horaSalida(cur, dato_uno, usuarioLlave)
            else:
                response = horaEntrada(cur, dato_uno, usuarioLlave)

            mysql.connection.commit()
        return response
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

    
@usuarios_delete.route('/api/usuarios_remove', methods=['POST'])#Elimina fila
@cross_origin()
@login_required
def removeUsuarios():
    try:
        dato_cero = 0
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `usuarios` SET `clave` = %s "
                     "WHERE `usuarios`.`id` = %s "
                     "AND vinculacion = %s")
            data = (dato_cero, request.json['id'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        
        return jsonify({"status": "success", "message": "Usuario eliminado correctamente."})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
##########################################################################################################
##########################################################################################################
##########################################################################################################
@asistencias_conteo.route('/api/asistencias_conteo')#Control
@cross_origin()
@login_required
def getAllAsistenciasConteo():
    try:
        usuarioLlave = session.get('usernameDos')

        nombres_usuarios = request.args.get('nombres_usuarios')
        apellidos_usuarios = request.args.get('apellidos_usuarios')
        sucursal_usuarios = request.args.get('sucursal_usuarios')
        fecha_inicio_usuarios_str = request.args.get('fecha_inicio_usuarios')
        fecha_fin_usuarios_str = request.args.get('fecha_fin_usuarios')
        
        fecha_inicio_usuarios = datetime.strptime(fecha_inicio_usuarios_str, '%Y-%m-%d')
        fecha_fin_usuarios = datetime.strptime(fecha_fin_usuarios_str, '%Y-%m-%d')

        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) "
                    "FROM control_asistencia "
                    "JOIN usuarios ON `control_asistencia`.`colaborador` = `usuarios`.`id` "
                    "JOIN sucursales ON `control_asistencia`.`sucursal` = `sucursales`.`id_sucursales` "
                    "WHERE control_asistencia.identificador_asistencia = %s "
                    "AND nombres LIKE %s "
                    "AND apellidos LIKE %s "
                    "AND sucursal_nombre LIKE %s "
                    "AND control_asistencia.estado = 1 "
                    "AND hora_entrada >= %s AND hora_entrada < %s")
            data_params = (usuarioLlave, f"{nombres_usuarios}%", f"{apellidos_usuarios}%", f"{sucursal_usuarios}%", fecha_inicio_usuarios, fecha_fin_usuarios + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@asistencias_tabla.route('/api/asistencias_tabla/<int:numero>')#Control
@cross_origin()
@login_required
def getAllUsuarios(numero):
    try:
        usuarioLlave = session.get('usernameDos')

        nombres_usuarios = request.args.get('nombres_usuarios')
        apellidos_usuarios = request.args.get('apellidos_usuarios')
        sucursal_usuarios = request.args.get('sucursal_usuarios')
        fecha_inicio_usuarios_str = request.args.get('fecha_inicio_usuarios')
        fecha_fin_usuarios_str = request.args.get('fecha_fin_usuarios')
        
        fecha_inicio_usuarios = datetime.strptime(fecha_inicio_usuarios_str, '%Y-%m-%d')
        fecha_fin_usuarios = datetime.strptime(fecha_fin_usuarios_str, '%Y-%m-%d')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id_asistencia, nombres, hora_entrada, hora_salida, sucursal_nombre, salario, apellidos "
                    "FROM control_asistencia "
                    "JOIN usuarios ON `control_asistencia`.`colaborador` = `usuarios`.`id` "
                    "JOIN sucursales ON `control_asistencia`.`sucursal` = `sucursales`.`id_sucursales` "
                    "WHERE control_asistencia.identificador_asistencia = %s "
                    "AND nombres LIKE %s "
                    "AND apellidos LIKE %s "
                    "AND sucursal_nombre LIKE %s "
                    "AND control_asistencia.estado = 1 "
                    "AND hora_entrada >= %s AND hora_entrada < %s "
                    "ORDER BY id_asistencia ASC "
                    "LIMIT 20 OFFSET %s")
            data_params = (usuarioLlave, f"{nombres_usuarios}%", f"{apellidos_usuarios}%", f"{sucursal_usuarios}%", fecha_inicio_usuarios, fecha_fin_usuarios + timedelta(days=1), numero)
            cur.execute(query, data_params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'id_asistencia': fila[0],
                'nombres': fila[1],
                'hora_entrada': fila[2].strftime('%d-%m-%Y %H:%M:%S') if fila[2] is not None else '00-00-00 00:00:00',
                'hora_salida': fila[3].strftime('%d-%m-%Y %H:%M:%S') if fila[3] is not None else '00-00-00 00:00:00',
                'sucursal_nombre': fila[4],
                'salario': fila[5],
                'formato_entrada': fila[2],
                'formato_salida': fila[3],
                'apellidos': fila[6],
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@usuarios_asistencia_busqueda.route('/api/asistencia_busqueda/<int:colaborador>')#Usuarios
@cross_origin()
@login_required
def getAsistencia(colaborador):
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("SELECT id_asistencia, colaborador, hora_entrada, hora_salida, sucursal, salario FROM control_asistencia "
                     "WHERE identificador_asistencia = %s "
                     "AND control_asistencia.estado = 1 "
                     "AND control_asistencia.salario = 0 "
                     "AND colaborador = %s")
            data_params = (usuarioLlave, colaborador)
            cur.execute(query, data_params)
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = {
                'id_asistencia': fila[0],
                'colaborador': fila[1],
                'hora_entrada': fila[2],
                'hora_salida': fila[3],
                'sucursal': fila[4],
                'salario': fila[5],
                }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@usuarios_asistencia_remuneracion.route('/api/asistencia_remuneracion/<int:colaborador>')#Usuarios
@cross_origin()
@login_required
def getRemuneracion(colaborador):
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')
        with mysql.connection.cursor() as cur:
            query = ("""
                        SELECT 
                            MONTH(hora_entrada) AS mes,
                            SUM(TIME_TO_SEC(TIMEDIFF(COALESCE(hora_salida, '00:00:00'), COALESCE(hora_entrada, '00:00:00')))) / 3600 AS horas_laboradas
                        FROM control_asistencia
                        WHERE identificador_asistencia = %s 
                        AND estado > 0 
                        AND colaborador = %s 
                        AND YEAR(hora_entrada) = %s 
                        GROUP BY mes
                    """)
            data_params = (usuarioLlave, colaborador, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'horas_laboradas': fila[1],
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@usuarios_asistencia_remuneracion_multiple.route('/api/asistencia_remuneracion_multiple')#Usuarios
@cross_origin()
@login_required
def getRemuneracionMultiple():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')
        month_actual = request.args.get('month_actual')
        with mysql.connection.cursor() as cur:
            query = ("""
                        SELECT 
                            MONTH(hora_entrada) AS mes, 
                            colaborador,
                            nombres,
                            apellidos,
                            SUM(TIME_TO_SEC(TIMEDIFF(COALESCE(hora_salida, '00:00:00'), COALESCE(hora_entrada, '00:00:00')))) / 3600 AS horas_laboradas
                        FROM control_asistencia  
                        JOIN usuarios ON `control_asistencia`.`colaborador` = `usuarios`.`id` 
                        WHERE identificador_asistencia = %s 
                        AND estado > 0 
                        AND MONTH(hora_entrada) = %s 
                        AND YEAR(hora_entrada) = %s 
                        GROUP BY colaborador, mes
                    """)
            data_params = (usuarioLlave, month_actual, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'colaborador': fila[1],
                'nombres': fila[2],
                'apellidos': fila[3],
                'horas_laboradas': fila[4],
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

def horaEntrada(cur, dato_uno, usuarioLlave):
    consulta = ("INSERT INTO `control_asistencia` (`id_asistencia`, `colaborador`, `hora_entrada`, `hora_salida`, "
                "`sucursal`, `identificador_asistencia`, `estado`, `salario`) "
                "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s)")
    valores = ( request.json['colaborador'], request.json['hora_entrada'], request.json['hora_entrada'], 
                request.json['sucursal'], usuarioLlave, dato_uno, request.json['salario'])
    cur.execute(consulta,valores)
    return jsonify({"status": "success", "message": "Hora de entrada registrada correctamente."})
    
def horaSalida(cur, dato_uno, usuarioLlave):
    query = ("UPDATE `control_asistencia` SET `hora_salida` = %s, `salario` = %s "
                "WHERE `control_asistencia`.`id_asistencia` = %s "
                "AND `control_asistencia`.`identificador_asistencia` = %s "
                "AND `control_asistencia`.`estado` = %s ")
    data = (request.json['hora_salida'], request.json['salario'], 
            request.json['id_asistencia'], usuarioLlave, dato_uno)
    cur.execute(query, data)
    return jsonify({"status": "success", "message": "Hora de salida registrada correctamente."})

@usuarios_registro_asistencias.route('/api/registro_asistencias',methods=['POST'])#configuración
@cross_origin()
@login_required
def saveRegistroAsistencias():
    if 'id_asistencia' in request.json:
        return registroHoraSalida()
    else:
        return registroHoraEntrada()

def registroHoraEntrada():
    try:
        with mysql.connection.cursor() as cur:
            dato_cero = 0
            dato_uno = 1
            usuarioLlave = session.get('usernameDos')
            consulta = ("INSERT INTO `control_asistencia` (`id_asistencia`, `colaborador`, `hora_entrada`, `hora_salida`, "
                        "`sucursal`, `identificador_asistencia`, `estado`, `salario`) "
                        "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s)")
            valores = ( request.json['colaborador'], request.json['hora_entrada'], dato_cero, 
                        request.json['sucursal'], usuarioLlave, dato_uno, request.json['salario'])
            cur.execute(consulta,valores)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Hora de entrada registrada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def registroHoraSalida():
    try:
        dato_uno = 1
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `control_asistencia` SET `hora_salida` = %s, `salario` = %s "
                        "WHERE `control_asistencia`.`id_asistencia` = %s "
                        "AND `control_asistencia`.`identificador_asistencia` = %s "
                        "AND `control_asistencia`.`estado` = %s ")
            data = (request.json['hora_salida'], request.json['salario'], 
                    request.json['id_asistencia'], usuarioLlave, dato_uno)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Hora de salida registrada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
    
@edit_asistencias.route('/api/edit_asistencias',methods=['POST'])#Usuarios
@cross_origin()
@login_required
def editHoraAsistencia():
    try:
        dato_uno = 1
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = (   "UPDATE `control_asistencia` SET `hora_entrada` = %s, `hora_salida` = %s "
                        "WHERE `control_asistencia`.`id_asistencia` = %s "
                        "AND `control_asistencia`.`identificador_asistencia` = %s "
                        "AND `control_asistencia`.`estado` = %s ")
            data = (request.json['hora_entrada'], request.json['hora_salida'], 
                    request.json['id_asistencia'], usuarioLlave, dato_uno)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Registro de asistencia actualizado correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

    
@asistencias_remove.route('/api/asistencias_remove', methods=['POST'])
@cross_origin()
@login_required
def removeAsistencias():
    try:
        dato_cero = 0
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `control_asistencia` SET `estado` = %s "
                     "WHERE `control_asistencia`.`id_asistencia` = %s "
                     "AND identificador_asistencia = %s")
            data = (dato_cero, request.json['id_asistencia'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Asistencia eliminada correctamente."})
    except Exception as e:
        return jsonify({'error': str(e)}), 500