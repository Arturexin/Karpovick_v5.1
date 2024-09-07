from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required
from db_connection import mysql
# Definimos el blueprint para las rutas de clientes
clientes_conteo = Blueprint('clientes_conteo', __name__)

clientes_tabla = Blueprint('clientes_tabla', __name__)
clientes_LS = Blueprint('clientes_LS', __name__)
clientes_proveedores = Blueprint('clientes_proveedores', __name__)
clientes_graficos_clientes = Blueprint('clientes_graficos_clientes', __name__)
clientes_individual_id = Blueprint('clientes_individual_id', __name__)
clientes_crud = Blueprint('clientes_crud', __name__)
clientes_control = Blueprint('clientes_control', __name__)
clientes_remove = Blueprint('clientes_remove', __name__)

# Ruta para obtener el conteo de clientes
@clientes_conteo.route('/api/clientes_conteo')
@cross_origin()
@login_required
def getAllClientesConteo():
    try:
        usuarioLlave = session.get('usernameDos')

        nombre_persona = request.args.get('nombre_persona')
        clase_persona = request.args.get('clase_persona')
        dni_persona = request.args.get('dni_persona')
        email_persona = request.args.get('email_persona')
        telefono_persona = request.args.get('telefono_persona')
        usuario_persona = request.args.get('usuario_persona')
        fecha_inicio_persona_str = request.args.get('fecha_inicio_persona')
        fecha_fin_persona_str = request.args.get('fecha_fin_persona')
        
        fecha_inicio_persona = datetime.strptime(fecha_inicio_persona_str, '%Y-%m-%d')
        fecha_fin_persona = datetime.strptime(fecha_fin_persona_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) "
                     "FROM clientes "
                     "JOIN usuarios ON clientes.usuario_cli = usuarios.id "
                     "WHERE identificador_cli = %s "
                     "AND nombre_cli LIKE %s "
                     "AND dni_cli LIKE %s "
                     "AND email_cli LIKE %s "
                     "AND telefono_cli LIKE %s "
                     "AND nombres LIKE %s "
                     "AND clase_cli = %s "
                     "AND fecha_cli >= %s AND fecha_cli < %s")
            
            data_params = (usuarioLlave, f"%{nombre_persona}%", f"%{dni_persona}%", f"%{email_persona}%", f"%{telefono_persona}%", 
                           f"%{usuario_persona}%", clase_persona, fecha_inicio_persona, fecha_fin_persona + timedelta(days=1))
            
            cur.execute(query, data_params)
            data = cur.fetchone()[0]
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@clientes_tabla.route('/api/clientes_tabla/<int:numero>')
@cross_origin()
@login_required
def getAllClientes(numero):
    try:
        usuarioLlave = session.get('usernameDos')

        nombre_persona = request.args.get('nombre_persona')
        clase_persona = request.args.get('clase_persona')
        dni_persona = request.args.get('dni_persona')
        email_persona = request.args.get('email_persona')
        telefono_persona = request.args.get('telefono_persona')
        usuario_persona = request.args.get('usuario_persona')
        fecha_inicio_persona_str = request.args.get('fecha_inicio_persona')
        fecha_fin_persona_str = request.args.get('fecha_fin_persona')
        
        fecha_inicio_persona = datetime.strptime(fecha_inicio_persona_str, '%Y-%m-%d')
        fecha_fin_persona = datetime.strptime(fecha_fin_persona_str, '%Y-%m-%d')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id_cli, nombre_cli, dni_cli, email_cli, telefono_cli, direccion_cli, nombres, clase_cli, fecha_cli "
                     "FROM clientes "
                     "JOIN usuarios ON clientes.usuario_cli = usuarios.id "
                     "WHERE identificador_cli = %s "
                     "AND nombre_cli LIKE %s "
                     "AND dni_cli LIKE %s "
                     "AND email_cli LIKE %s "
                     "AND telefono_cli LIKE %s "
                     "AND nombres LIKE %s "
                     "AND clase_cli = %s "
                     "AND fecha_cli >= %s AND fecha_cli < %s "
                     "ORDER BY id_cli ASC "
                     "LIMIT 20 OFFSET %s")
            
            data_params = (usuarioLlave, f"%{nombre_persona}%", f"%{dni_persona}%", f"%{email_persona}%", f"%{telefono_persona}%", 
                           f"%{usuario_persona}%", clase_persona, fecha_inicio_persona, fecha_fin_persona + timedelta(days=1), numero)
            
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            content = {
                'id_cli': fila[0],
                'nombre_cli': fila[1],
                'dni_cli': fila[2],
                'email_cli': fila[3],
                'telefono_cli': fila[4],
                'direccion_cli': fila[5],
                'nombres': fila[6],
                'clase_cli': fila[7],
                'fecha_cli': fila[8].strftime('%d-%m-%Y')
            }
            resultado.append(content)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@clientes_LS.route('/api/clientes_ventas')#CLIENTES, INDEX, VENTAS
@cross_origin()
@login_required
def getAllClientesVentas():
    try:
        usuarioLlave = session.get('usernameDos')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id_cli, nombre_cli, dni_cli, email_cli, telefono_cli, direccion_cli "
                     "FROM clientes "
                     "WHERE `identificador_cli` = %s AND clase_cli LIKE %s")
            cur.execute(query, (usuarioLlave, '0'))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            content = {
                'id_cli': fila[0],
                'nombre_cli': fila[1],
                'dni_cli': fila[2],
                'email_cli': fila[3],
                'telefono_cli': fila[4],
                'direccion_cli': fila[5]
            }
            resultado.append(content)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@clientes_proveedores.route('/api/proveedores')# CLIENTES, INDEX
@cross_origin()
@login_required
def getAllProveedores():
    try:
        usuarioLlave = session.get('usernameDos')

        with mysql.connection.cursor() as cur:
            query = ("SELECT id_cli, nombre_cli "
                     "FROM clientes "
                     "WHERE `identificador_cli` = %s AND clase_cli LIKE %s")
            cur.execute(query, (usuarioLlave, '1'))
            data = cur.fetchall()
            
        resultado = []
        for fila in data:
            content = {
                'id_cli': fila[0],
                'nombre_cli': fila[1]
            }
            resultado.append(content)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

###------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@clientes_graficos_clientes.route('/api/clientes_mes')#CLientes gráficos
@cross_origin()
@login_required
def getAllClientesMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha_cli) AS mes, SUM(CASE WHEN clase_cli = 0 THEN 1 ELSE 0 END) AS suma_clientes, "
                     "SUM(CASE WHEN clase_cli = 1 THEN 1 ELSE 0 END) AS suma_proveedores "
                     "FROM clientes "
                     "WHERE `identificador_cli` = %s "
                     " AND YEAR(fecha_cli) = %s "
                     " GROUP BY mes")
            cur.execute(query,(usuarioLlave, year_actual))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            content = {
                'mes': fila[0],
                'suma_clientes': fila[1],
                'suma_proveedores': fila[2]
            }
            resultado.append(content)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
###-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
@clientes_individual_id.route('/api/clientes/<int:id_cli>')
@cross_origin()
def getClientes(id_cli):
    try:
        with mysql.connection.cursor() as cur:
            query = ("SELECT id_cli, nombre_cli, dni_cli, email_cli, telefono_cli, direccion_cli, usuario_cli, clase_cli, fecha_cli "
                     "FROM clientes "
                     "WHERE id_cli = %s ")
            cur.execute(query, (id_cli,))
            data = cur.fetchall()

        content = {}
        for fila in data:
            content = {
                'id_cli': fila[0],
                'nombre_cli': fila[1],
                'dni_cli': fila[2],
                'email_cli': fila[3],
                'telefono_cli': fila[4],
                'direccion_cli': fila[5],
                'usuario_cli': fila[6],
                'clase_cli': fila[7],
                'fecha_cli': fila[8]
            }
        return jsonify(content)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@clientes_crud.route('/api/clientes', methods=['POST'])
@cross_origin()
def createClientes():
    if 'id_cli' in request.json:
        updateCliente()
    else:
        createCliente()
    return 'ok'

def createCliente():
    usuarioLlave = session.get('usernameDos')
    usuarioId = session.get('identificacion_usuario')
    try:
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `clientes` (`id_cli`, `nombre_cli`, `dni_cli`, `email_cli`, `telefono_cli`, `direccion_cli`, `usuario_cli`, `clase_cli`, `fecha_cli`, `identificador_cli`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['nombre_cli'], request.json['dni_cli'], request.json['email_cli'], request.json['telefono_cli'], 
                    request.json['direccion_cli'], usuarioId, request.json['clase_cli'], request.json['fecha_cli'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Persona creada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def updateCliente():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `clientes` SET `nombre_cli` = %s, `dni_cli` = %s, `email_cli` = %s, `telefono_cli` = %s, `direccion_cli` = %s, `clase_cli` = %s "
                     "WHERE `clientes`.`id_cli` = %s "
                     "AND identificador_cli = %s")
            data =(request.json['nombre_cli'], request.json['dni_cli'], request.json['email_cli'], request.json['telefono_cli'], request.json['direccion_cli'], 
                   request.json['clase_cli'], request.json['id_cli'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Persona actualizada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@clientes_control.route('/api/clientes_control', methods=['POST'])##Control
@cross_origin()
def crearClienteControl():
    current_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    try:
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `clientes` (`id_cli`, `nombre_cli`, `dni_cli`, `email_cli`, `telefono_cli`, `direccion_cli`, `usuario_cli`, `clase_cli`, `fecha_cli`, `identificador_cli`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['nombre_cli'], request.json['dni_cli'], request.json['email_cli'], request.json['telefono_cli'], 
                    request.json['direccion_cli'], request.json['usuario_cli'], request.json['clase_cli'], current_date, request.json['usuario_cli'])
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Persona creada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@clientes_remove.route('/api/clientes/<int:id_cli>', methods=['DELETE'])
@cross_origin()
def removeClientes(id_cli):
    try:
        with mysql.connection.cursor() as cur:
            query = "DELETE FROM `clientes` WHERE `clientes`.`id_cli` = %s"
            cur.execute(query, (id_cli,))
            mysql.connection.commit()
        
        return "Cliente Eliminado"
    except Exception as e:
        return jsonify({'error': str(e)}), 500