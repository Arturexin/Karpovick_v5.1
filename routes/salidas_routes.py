from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required
from routes.numeracion_routes import incrementar_obtener_numeracion_v
from routes.productos_routes import actualizar_almacen_central
from routes.productos_routes import actualizar_almacen_central_suma
from db_connection import mysql

# Definimos el blueprint para las rutas de salidas
salidas_conteo = Blueprint('salidas_conteo', __name__)
salidas_tabla = Blueprint('salidas_tabla', __name__)
salidas_tabla_reporte = Blueprint('salidas_tabla_reporte', __name__)
salidas_reporte_cliente = Blueprint('salidas_reporte_cliente', __name__)
salidas_suma_ventas_mes = Blueprint('salidas_suma_ventas_mes', __name__)
salidas_suma_total_sucursal_mes = Blueprint('salidas_suma_total_sucursal_mes', __name__)
salidas_suma_ventas_dia_sucursal = Blueprint('salidas_suma_ventas_dia_sucursal', __name__)
salidas_suma_devoluciones_mes = Blueprint('salidas_suma_devoluciones_mes', __name__)
salidas_top_ventas = Blueprint('salidas_top_ventas', __name__)
salidas_categorias_suc = Blueprint('salidas_categorias_suc', __name__)
salidas_productos_suc = Blueprint('salidas_productos_suc', __name__)
salidas_cod_kardex_id = Blueprint('salidas_cod_kardex_id', __name__)
salidas_extraccion_csv = Blueprint('salidas_extraccion_csv', __name__)
salidas_comprobante = Blueprint('salidas_comprobante', __name__)
salidas_delete = Blueprint('salidas_delete', __name__)
procesar_devolucion_salidas_post = Blueprint('procesar_devolucion_salidas_post', __name__)
salidas_gestion_ventas_post = Blueprint('salidas_gestion_ventas_post', __name__)

@salidas_conteo.route('/api/salidas_conteo')
@cross_origin()
@login_required
def getAllSalidasConteo():
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
            query = ("SELECT COUNT(*) "
                        "FROM salidas "
                        "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `salidas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "WHERE `identificadorSal` = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND salidas.estado > 0 "
                        "AND fecha >= %s AND fecha < %s ")
            data_params = (usuarioLlave, f"{sucursal_salidas}%", f"{categoria_salidas}%", f"{codigo_salidas}%", f"{comprobante_salidas}%", 
                        fecha_inicio_salidas, fecha_fin_salidas + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchone()[0]

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salidas_tabla.route('/api/salidas_tabla/<int:numero>')
@cross_origin()
@login_required
def getAllSalidas(numero):
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
            query = ("SELECT idSal, sucursal_nombre, categoria_nombre, codigo, existencias_salidas, precio_venta_salidas, comprobante, fecha, existencias_devueltas, cliente  "
                        "FROM salidas "
                        "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `salidas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "WHERE identificadorSal = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND comprobante LIKE %s "
                        "AND salidas.estado > 0 "
                        "AND fecha >= %s AND fecha < %s "
                        "ORDER BY idSal ASC "
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
                'precio_venta_salidas':fila[5],
                'comprobante': fila[6],
                'fecha': fila[7].strftime('%d-%m-%Y'),
                'existencias_devueltas': fila[8],
                'cliente': fila[9]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@salidas_tabla_reporte.route('/api/salidas_tabla_reporte')#Salidas, Ventas
@cross_origin()
@login_required
def getAllSalidasReporte():
    try:
        usuarioLlave = session.get('usernameDos')

        comprobante_salidas = request.args.get('comprobante_salidas')
        fecha_inicio_salidas_str = request.args.get('fecha_inicio_salidas')
        fecha_fin_salidas_str = request.args.get('fecha_fin_salidas')
        
        fecha_inicio_salidas = datetime.strptime(fecha_inicio_salidas_str, '%Y-%m-%d')
        fecha_fin_salidas = datetime.strptime(fecha_fin_salidas_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT sucursal_nombre, codigo, existencias_salidas, precio_venta_salidas, comprobante, salidas.fecha AS fecha, existencias_devueltas, descripcion, nombres "
                        "FROM salidas "
                        "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                        "JOIN sucursales ON `salidas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "JOIN usuarios ON `salidas`.`usuario` = `usuarios`.`id` "
                        "WHERE identificadorSal = %s "
                        "AND comprobante LIKE %s "
                        "AND salidas.estado > 0 "
                        "AND salidas.fecha >= %s AND salidas.fecha < %s "
                        "ORDER BY sucursal ASC ")
            data_params = (usuarioLlave, f"{comprobante_salidas}%", fecha_inicio_salidas, fecha_fin_salidas + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'sucursal_nombre': fila[0],
                'codigo': fila[1],
                'existencias_salidas':fila[2],
                'precio_venta_salidas':fila[3],
                'comprobante': fila[4],
                'fecha': fila[5].strftime('%d-%m-%Y'),
                'existencias_devueltas': fila[6],
                'descripcion': fila[7],
                'nombres': fila[8]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@salidas_reporte_cliente.route('/api/salidas_reporte_cliente')#Clientes, Ventas
@cross_origin()
@login_required
def getAllReporteUsuarios():
    try:
        usuarioLlave = session.get('usernameDos')

        comprobante_salidas = request.args.get('comprobante_salidas')
        cliente_salidas = request.args.get('cliente_salidas')
        fecha_inicio_salidas_str = request.args.get('fecha_inicio_salidas')
        fecha_fin_salidas_str = request.args.get('fecha_fin_salidas')
        
        fecha_inicio_salidas = datetime.strptime(fecha_inicio_salidas_str, '%Y-%m-%d')
        fecha_fin_salidas = datetime.strptime(fecha_fin_salidas_str, '%Y-%m-%d')
        
        with mysql.connection.cursor() as cur:
            query = ("SELECT nombres, codigo, existencias_salidas, precio_venta_salidas, comprobante, salidas.fecha AS fecha, existencias_devueltas, descripcion, cliente, sucursal_nombre "
                        "FROM salidas "
                        "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                        "JOIN sucursales ON `salidas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "JOIN usuarios ON `salidas`.`usuario` = `usuarios`.`id` "
                        "WHERE identificadorSal = %s "
                        "AND comprobante LIKE %s "
                        "AND cliente = %s "
                        "AND salidas.estado > 0 "
                        "AND salidas.fecha >= %s AND salidas.fecha < %s "
                        "ORDER BY usuario, salidas.fecha ASC ")
            data_params = (usuarioLlave, f"{comprobante_salidas}%", f"{cliente_salidas}%", fecha_inicio_salidas, fecha_fin_salidas + timedelta(days=1))
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'nombres': fila[0],
                'codigo': fila[1],
                'existencias_salidas':fila[2],
                'precio_venta_salidas':fila[3],
                'comprobante': fila[4],
                'fecha': fila[5].strftime('%d-%m-%Y'),
                'existencias_devueltas': fila[6],
                'descripcion': fila[7],
                'cliente': fila[8],
                'sucursal_nombre': fila[9],
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
####----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@salidas_suma_ventas_mes.route('/api/salidas_suma_ventas_por_mes')#HOME
@cross_origin()
@login_required
def getSumaVentasPorMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')
        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(t1.fecha) AS mes, "
                     "SUM((t1.existencias_salidas - t1.existencias_devueltas) * t1.precio_venta_salidas) AS suma_ventas, "
                     "SUM((t1.existencias_salidas - t1.existencias_devueltas) * t2.costo_unitario) AS suma_costos, "
                     "SUM(t1.existencias_devueltas) AS unidades_devueltas, "
                     "SUM((t1.existencias_salidas - t1.existencias_devueltas) * t2.precio_venta) AS suma_ventas_esperado "
                     "FROM `salidas` AS t1 "
                     "JOIN `almacen_central` AS t2 ON t1.idProd = t2.idProd "
                     "WHERE `identificadorSal` = %s "
                     "AND t1.comprobante LIKE %s "
                     "AND YEAR(t1.fecha) = %s "
                     "AND salidas.estado > 0 "
                     "GROUP BY mes")
            data_params = (usuarioLlave, 'Venta%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'suma_ventas': fila[1],
                'suma_costos': fila[2],
                'unidades_devueltas': fila[3],
                'suma_ventas_esperado': fila[4],
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salidas_suma_total_sucursal_mes.route('/api/salidas_suma_ventas_por_mes_por_sucursal')#HOME
@cross_origin()
@login_required
def getSumaVentasPorMesSucursal():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_costos, "
                     "SUM(existencias_devueltas) AS unidades_devueltas, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta) AS suma_ventas_esperado "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND salidas.estado > 0 "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal")
            data_params = (usuarioLlave, 'Venta%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'suma_ventas': fila[2],
                'suma_costos': fila[3],
                'unidades_devueltas': fila[4],
                'suma_ventas_esperado': fila[5]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salidas_suma_ventas_dia_sucursal.route('/api/salidas_suma_ventas_por_dia_por_sucursal')#HOME
@cross_origin()
@login_required
def getSumaVentasPorDiaSucursal():
    try:
        usuarioLlave = session.get('usernameDos')
        dia_actual = datetime.now().day
        mes_actual = datetime.now().month
        anio_actual = datetime.now().year

        with mysql.connection.cursor() as cur:
            query = ("SELECT sucursal, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas_dia "
                     "FROM `salidas` "
                     "WHERE `identificadorSal` = %s "
                     "AND `comprobante` LIKE %s "
                     "AND salidas.estado > 0 "
                     "AND DAY(`fecha`) = %s "
                     "AND MONTH(`fecha`) = %s "
                     "AND YEAR(`fecha`) = %s "
                     "GROUP BY sucursal")
            data_params = (usuarioLlave, 'Venta%', dia_actual, mes_actual, anio_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = {
                'sucursal': fila[0],
                'suma_ventas_dia': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salidas_suma_devoluciones_mes.route('/api/salidas_suma_devoluciones_mes')#DEVOLUCIONES SALIDAS
@cross_origin()
@login_required
def getSumaDevolucionesSalidasMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, "
                     "SUM(existencias_devueltas) AS suma_devoluciones_salidas "
                     "FROM salidas "
                     "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND salidas.estado > 0 "
                     "AND comprobante LIKE %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes")
            data_params = (usuarioLlave, 'Dev%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'suma_devoluciones_salidas': int(fila[1])
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salidas_top_ventas.route('/api/salidas_top_ventas')#Compras Buscador
@cross_origin()
@login_required
def getTopVentas():
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_venta = request.args.get('sucursal_venta')
        categoria_venta = request.args.get('categoria_venta')
        year_actual = request.args.get('year_actual')
        trimestre = request.args.get('trimestre')

        sucursal_get = request.args.get('sucursal_get')
        if sucursal_get not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st', 'existencias_sc']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400

        with mysql.connection.cursor() as cur:
            query = (f"SELECT `salidas`.`idProd` AS id, sucursal, categoria, codigo, descripcion, {sucursal_get}, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_costos, "
                     "SUM(existencias_salidas - existencias_devueltas) AS cantidad_venta "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND salidas.estado > 0 "
                     "AND sucursal = %s ")
            
            data_params = (usuarioLlave, 'Venta%', sucursal_venta)

            if categoria_venta and categoria_venta != '0':# Si `categoria_venta` no es 0 o None, filtramos por categoría
                query += "AND categoria = %s "
                data_params += (categoria_venta,)

            if trimestre and trimestre.isdigit() and 1 <= int(trimestre) <= 4:# Aplicar trimestre si es válido (entre 1 y 4)
                query += "AND QUARTER(fecha) = %s "
                data_params += (trimestre,)

            query += "AND YEAR(fecha) = %s " \
                     "GROUP BY `salidas`.`idProd` " \
                     "ORDER BY cantidad_venta DESC"

            data_params += (year_actual,)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = {
                'id': fila[0],
                'sucursal': fila[1],
                'categoria': fila[2],
                'codigo': fila[3],
                'descripcion': fila[4],
                'sucursal_get': fila[5],
                'suma_ventas': fila[6],
                'suma_costos': fila[7],
                'cantidad_venta': int(fila[8])
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@salidas_categorias_suc.route('/api/salidas_categorias_sucursal')#SALIDAS_estadisticas
@cross_origin()
@login_required
def getCategoriasSucursalSalidas():
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_salidas = request.args.get('sucursal_salidas')
        #year_actual = datetime.now().year
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, categoria_nombre, categoria, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_costos, "
                     "SUM(existencias_salidas - existencias_devueltas) AS suma_unidades, "
                     "COUNT(DISTINCT comprobante) AS suma_veces "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                     "WHERE `identificadorSal` = %s "
                     "AND sucursal = %s "
                     "AND comprobante LIKE %s "
                     "AND salidas.estado > 0 "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal, categoria "
                     "ORDER BY mes ASC")
            data_params = (usuarioLlave, f"{sucursal_salidas}", "Venta%", year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'categoria_nombre': fila[2],
                'categoria': fila[3],
                'suma_ventas': fila[4],
                'suma_costos': fila[5],
                'suma_unidades': int(fila[6]),
                'suma_veces': int(fila[7])
                }
            resultado.append(contenido)
        return jsonify({"status": "success", "datos": resultado})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salidas_productos_suc.route('/api/salidas_productos_sucursal')#SALIDAS_estadisticas
@cross_origin()
@login_required
def getCodigoSucursalSalidas():
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_salidas = request.args.get('sucursal_salidas')
        categoria_salidas = request.args.get('categoria_salidas')
        #year_actual = datetime.now().year
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, categoria_nombre, codigo, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_costos, "
                     "SUM(existencias_salidas - existencias_devueltas) AS suma_unidades, "
                     "SUM(existencias_devueltas) AS suma_unidades_dev, "
                     "COUNT(DISTINCT comprobante) AS suma_veces "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                     "WHERE `identificadorSal` = %s "
                     "AND sucursal = %s "
                     "AND comprobante LIKE %s "
                     "AND categoria LIKE %s "
                     "AND salidas.estado > 0 "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal, categoria, codigo "
                     "ORDER BY mes ASC")
            data_params = (usuarioLlave, f"{sucursal_salidas}", "Venta%", f"{categoria_salidas}", year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'categoria_nombre': fila[2],
                'codigo': fila[3],
                'suma_ventas': fila[4],
                'suma_costos': fila[5],
                'suma_unidades': int(fila[6]),
                'suma_unidades_dev': int(fila[7]),
                'suma_veces': int(fila[8])
                }
            resultado.append(contenido)
        return jsonify({"status": "success", "datos": resultado})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salidas_cod_kardex_id.route('/api/salidas_codigo_kardex/<int:id_producto>')###Kardex############################################################
@cross_origin()
@login_required
def getSalidasCodigoKardex(id_producto):
    try:
        usuarioLlave = session.get('usernameDos')
        salidas_sucursal = request.args.get('salidas_sucursal')
        year_actual = request.args.get('year_actual')
        with mysql.connection.cursor() as cur:
            query = ("SELECT costo_unitario, existencias_salidas AS existencias, comprobante, fecha, existencias_devueltas, precio_venta_salidas, precio_venta "
                     "FROM salidas "
                     "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND sucursal LIKE %s "
                     "AND `salidas`.`idProd` = %s "
                     "AND salidas.estado > 0 "
                     "AND YEAR(fecha) = %s")
            data_params = (usuarioLlave, salidas_sucursal, id_producto, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = {
                'costo_unitario': fila[0],
                'existencias':fila[1],
                'comprobante': fila[2],
                'fecha': fila[3],
                'existencias_devueltas': fila[4],
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@salidas_extraccion_csv.route('/api/salidas_extraccion')#Salidas para formato CSV
@cross_origin()
@login_required
def getSalidasExtraccion():
    try:
        usuarioLlave = session.get('usernameDos')
        fecha_inicio_salidas_str = request.args.get('fecha_inicio_salidas')
        fecha_fin_salidas_str = request.args.get('fecha_fin_salidas')
        
        fecha_inicio_salidas = datetime.strptime(fecha_inicio_salidas_str, '%Y-%m-%d')
        fecha_fin_salidas = datetime.strptime(fecha_fin_salidas_str, '%Y-%m-%d')
        with mysql.connection.cursor() as cur:
            query = (   "SELECT sucursal_nombre, categoria_nombre, codigo, descripcion, talla, precio_venta_salidas, existencias_salidas, comprobante, causa_devolucion, cliente, usuario, fecha, existencias_devueltas "
                        "FROM salidas "
                        "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `salidas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "WHERE identificadorSal = %s "
                        "AND salidas.estado > 0 "
                        "AND fecha >= %s AND fecha < %s "
                        "ORDER BY idSal ASC ")
            params = (usuarioLlave, fecha_inicio_salidas, fecha_fin_salidas)
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
                'precio_venta_salidas': fila[5],
                'existencias_salidas': fila[6],
                'comprobante': fila[7],
                'causa_devolucion': fila[8],
                'cliente': fila[9],
                'usuario': fila[10],
                'fecha': fila[11],
                'existencias_devueltas': fila[12]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@salidas_comprobante.route('/api/salidas_comprobante/<string:comprobante>')#DEVOLUCION, Detalle ventas
@cross_origin()
@login_required
def getSalidasComprobante(comprobante):
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("SELECT idSal AS id, sucursal_nombre, codigo, descripcion, existencias_salidas AS existencias, comprobante, existencias_devueltas, id_sucursales, `salidas`.`idProd` AS id_prod, precio_venta_salidas, cliente "
                     "FROM salidas "
                     "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "JOIN sucursales ON `salidas`.`sucursal` = `sucursales`.`id_sucursales` "
                     "WHERE `identificadorSal` = %s "
                     "AND salidas.estado > 0 "
                     "AND comprobante LIKE %s")
            cur.execute(query, (usuarioLlave, comprobante))
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
                'id_prod': fila[8],
                'precio_venta_salidas':fila[9],
                'cliente':fila[10],
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

@salidas_delete.route('/api/salidas_remove', methods=['POST'])
@cross_origin()
@login_required
def removeSalidas():
    try:
        dato_cero = 0
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `salidas` SET `estado` = %s "
                     "WHERE `salidas`.`idSal` = %s "
                     "AND identificadorSal = %s")
            data = (dato_cero, request.json['idSal'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Salida eliminada correctamente."})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@procesar_devolucion_salidas_post.route('/api/procesar_devolucion_salidas', methods=['POST'])##Devolución salidas
@cross_origin()
@login_required
def operarDevolucionSalidas():
    try:
        devolucion_data = request.json
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0
        dato_uno = 1
        data_dev = request.json.get('array_devolucion', [])

        with mysql.connection.cursor() as cur:

            actualizar_almacen_central_suma(cur, devolucion_data, usuarioLlave, 'array_devolucion')

            query_salidas_update = ("UPDATE `salidas` SET existencias_devueltas = existencias_devueltas + %s "
                                    "WHERE `salidas`.`idSal` = %s "
                                    "AND identificadorSal = %s "
                                    "AND `salidas`.`estado` > 0 "
                                    "AND existencias_devueltas >= 0")
            data_salidas_update =   [
                                    (s['existencias_post'], s['id_op'], usuarioLlave) 
                                    for s in data_dev
                                    ]
            cur.executemany(query_salidas_update, data_salidas_update)

            query_salidas_insert = ("INSERT INTO `salidas` "
                                    "(`idSal`, `idProd`, `sucursal`, `existencias_salidas`, `precio_venta_salidas`, `comprobante`, `causa_devolucion`, "
                                    "`cliente`, `usuario`, `fecha`, `existencias_devueltas`, `identificadorSal`, `estado`) "
                                    "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data_salidas_insert =   [
                                    (s['idProd'], s['sucursal'], dato_cero, s['precio_venta_salidas'], s['comprobante'], s['causa_devolucion'], 
                                    s['cliente'], usuarioId, request.json['fecha'], s['existencias_post'], usuarioLlave, dato_uno) 
                                    for s in data_dev
                                    ]
            cur.executemany(query_salidas_insert, data_salidas_insert)

            query_detalle = (   "UPDATE `ventas` SET `modo_perdida` =  `modo_perdida` + %s "
                        "WHERE `ventas`.`id_det_ventas` = %s "
                        "AND ventas.estado > 0 "
                        "AND identificador_ventas = %s ")
            data_detalle = (request.json['modo_perdida'], request.json['id_det_ventas'], usuarioLlave)
            cur.execute(query_detalle, data_detalle)

            mysql.connection.commit()
        return jsonify({"status": "success", "message": 'Devolución procesada correctamente' })
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@salidas_gestion_ventas_post.route('/api/gestion_de_venta', methods=['POST'])
@cross_origin()
@login_required
def gestionDeVenta():
    try:
        dato_cero = 0
        dato_uno = 1
        numeracion = []
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        item_ticket = request.json['item_ticket']
        fecha = request.json['fecha']
        cliente = request.json['dni_cliente']
        array_productos = request.json.get('array_productos', [])
        array_salidas = request.json.get('array_salidas', [])

        if not array_productos or not array_salidas or not usuarioLlave or not fecha or not usuarioLlave:
            return jsonify({"status": "error", "message": "Faltan datos requeridos para procesar la venta"}), 400
        
        # Validación del item_ticket
        ticket_prefixes = {
            'nota_venta': 'N001-',
            'boleta_venta': 'B001-',
            'factura': 'F001-'
        }
        if item_ticket not in ticket_prefixes:
            return jsonify({"status": "error", "message": "Item no válido"}), 400

        ticket = ticket_prefixes[item_ticket]

        # Iniciar la transacción manualmente
        with mysql.connection.cursor() as cur:

            # Numeración
            numeracion = incrementar_obtener_numeracion_v(cur, item_ticket, dato_uno, usuarioLlave, ticket)

            try:
                actualizar_almacen_central(cur, array_productos, usuarioLlave)
            except Exception as e:
                mysql.connection.rollback()  # Hacer rollback si hay un error en actualizar_almacen_central
                return jsonify({"status": "error", "message": f"Error al actualizar existencias: {str(e)}"}), 400
            
            try:
                insertar_salidas(cur, array_salidas, numeracion, usuarioId, usuarioLlave, dato_cero, dato_uno, fecha, cliente)
            except Exception as e:
                mysql.connection.rollback()  # Hacer rollback si hay un error en actualizar_almacen_central
                return jsonify({"status": "error", "message": f"Error al insertar salidas: {str(e)}"}), 400

            # Detalle de la venta
            query_detalle = ("INSERT INTO `ventas` (`id_det_ventas`, `sucursal`, `comprobante`, `tipo_comprobante`, `dni_cliente`, "
                            "`modo_efectivo`, `modo_credito`, `modo_tarjeta`, `modo_perdida`, `fecha_det_ventas`, "
                            "`identificador_ventas`, `canal_venta`, `estado`, `situacion`) "
                            "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data_detalle = (request.json['sucursal_v'], f"{numeracion[0]}", f"{numeracion[1]}", cliente, 
                            request.json['modo_efectivo'], request.json['modo_credito'], request.json['modo_tarjeta'], request.json['modo_perdida'], fecha, 
                            usuarioLlave, request.json['canal_venta'], dato_uno, request.json['situacion'])
            cur.execute(query_detalle, data_detalle)

            mysql.connection.commit()# Si todo sale bien, confirmar la transacción

        return jsonify({"status": "success", "message": [f"{numeracion[0]}", f"{numeracion[1]}"]})
    
    except Exception as e:
        mysql.connection.rollback()# Hacer rollback en caso de cualquier error
        return jsonify({"status": "error", "message": str(e)})

####################################################################################################
####################################################################################################
####################################################################################################

def insertar_salidas(cur, array_salidas, numeracion, usuarioId, usuarioLlave, dato_cero, dato_uno, fecha, cliente):
    query_salidas = ("INSERT INTO `salidas` "
                    "(`idSal`, `idProd`, `sucursal`, `existencias_salidas`, `precio_venta_salidas`,`comprobante`, "
                    "`causa_devolucion`, `cliente`, `usuario`, `fecha`, `existencias_devueltas`, `identificadorSal`, `estado`) "
                    "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
    data_salidas =  [
                        (s['idProd'], s['sucursal'], s['existencias_salidas'], s['precio_venta_salidas'],
                        numeracion[0], dato_cero, cliente, usuarioId, fecha, dato_cero, usuarioLlave, dato_uno) 
                        for s in array_salidas
                    ]

    cur.executemany(query_salidas, data_salidas)

    # Comprobar si la inserción se realizó correctamente
    if cur.rowcount != len(array_salidas):
        raise Exception("No se pudieron insertar todas las salidas correctamente.")
