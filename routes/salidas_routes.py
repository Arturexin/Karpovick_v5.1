from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from flask_login import login_required
from db_connection import mysql

# Definimos el blueprint para las rutas de salidas
salidas_conteo = Blueprint('salidas_conteo', __name__)
salidas_tabla = Blueprint('salidas_tabla', __name__)
salidas_tabla_reporte = Blueprint('salidas_tabla_reporte', __name__)
salidas_suma_ventas_mes = Blueprint('salidas_suma_ventas_mes', __name__)
salidas_suma_total_mes = Blueprint('salidas_suma_total_mes', __name__)
salidas_suma_total_pasado = Blueprint('salidas_suma_total_pasado', __name__)
salidas_suma_total_sucursal_mes = Blueprint('salidas_suma_total_sucursal_mes', __name__)
salidas_suma_devoluciones_mes_suc = Blueprint('salidas_suma_devoluciones_mes_suc', __name__)
salidas_suma_ventas_dia_sucursal = Blueprint('salidas_suma_ventas_dia_sucursal', __name__)
salidas_suma_transferencias_mes = Blueprint('salidas_suma_transferencias_mes', __name__)
salidas_suma_devoluciones_mes = Blueprint('salidas_suma_devoluciones_mes', __name__)
salidas_top_cinco_categorias_suc = Blueprint('salidas_top_cinco_categorias_suc', __name__)
salidas_top_cinco_cod_suc = Blueprint('salidas_top_cinco_cod_suc', __name__)
salidas_top_ventas = Blueprint('salidas_top_ventas', __name__)
salidas_categorias_suc = Blueprint('salidas_categorias_suc', __name__)
salidas_productos_suc = Blueprint('salidas_productos_suc', __name__)
salidas_individual_id = Blueprint('salidas_individual_id', __name__)
salidas_categoria_kardex = Blueprint('salidas_categoria_kardex', __name__)
salidas_suc_kardex = Blueprint('salidas_suc_kardex', __name__)
salidas_cod_kardex_id = Blueprint('salidas_cod_kardex_id', __name__)
entradas_suma_mes_kardex = Blueprint('entradas_suma_mes_kardex', __name__)
salidas_extraccion_csv = Blueprint('salidas_extraccion_csv', __name__)
salidas_comprobante = Blueprint('salidas_comprobante', __name__)
salidas_post = Blueprint('salidas_post', __name__)
salidas_delete = Blueprint('salidas_delete', __name__)
procesar_devolucion_salidas_post = Blueprint('procesar_devolucion_salidas_post', __name__)
procesar_venta_post = Blueprint('procesar_venta_post', __name__)
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
            query = ("SELECT idSal, sucursal_nombre, categoria_nombre, codigo, existencias_salidas, precio_venta_salidas, comprobante, fecha, existencias_devueltas, costo_unitario "
                        "FROM salidas "
                        "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                        "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                        "JOIN sucursales ON `salidas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "WHERE identificadorSal = %s "
                        "AND sucursal_nombre LIKE %s "
                        "AND categoria_nombre LIKE %s "
                        "AND codigo LIKE %s "
                        "AND comprobante LIKE %s "
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
                'costo_unitario': fila[9]
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
            query = ("SELECT sucursal_nombre, codigo, existencias_salidas, precio_venta_salidas, comprobante, fecha, existencias_devueltas, descripcion "
                        "FROM salidas "
                        "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                        "JOIN sucursales ON `salidas`.`sucursal` = `sucursales`.`id_sucursales` "
                        "WHERE identificadorSal = %s "
                        "AND comprobante LIKE %s "
                        "AND fecha >= %s AND fecha < %s "
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
                'descripcion': fila[7]
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

@salidas_suma_total_mes.route('/api/salidas_suma_total_por_mes')#HOME
@cross_origin()
@login_required
def getSumaTotalSalidasMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_total_salidas "
                     "FROM salidas "
                     "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal")
            cur.execute(query, (usuarioLlave, year_actual))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'suma_total_salidas': fila[2]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salidas_suma_total_pasado.route('/api/salidas_suma_total_pasado')#HOME
@cross_origin()
@login_required
def getSumaTotalSalidasPasado():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT sucursal, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_total_salidas_pasado "
                     "FROM salidas "
                     "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND YEAR(fecha) < %s "
                     "GROUP BY sucursal")
            cur.execute(query, (usuarioLlave, year_actual))
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'sucursal': fila[0],
                'suma_total_salidas_pasado': fila[1]
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

@salidas_suma_devoluciones_mes_suc.route('/api/salidas_suma_ventas_devoluciones_mes_actual_sucursal')#HOME
@cross_origin()
@login_required
def getSumaVentasDevolucionesSucursal():
    try:
        usuarioLlave = session.get('usernameDos')
        mes_actual = datetime.now().month
        anio_actual = datetime.now().year

        with mysql.connection.cursor() as cur:
            query = ("SELECT sucursal, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas, "
                     "SUM(existencias_devueltas) AS unidades_devueltas "
                     "FROM `salidas` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND YEAR(fecha) = %s "
                     "AND MONTH(fecha) = %s "
                     "GROUP BY sucursal")
            data_params = (usuarioLlave, 'Venta%', anio_actual, mes_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'sucursal': fila[0],
                'suma_ventas': fila[1],
                'unidades_devueltas': fila[2]
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

@salidas_suma_transferencias_mes.route('/api/salidas_suma_transferencias_mes')#TRANSFERENCIAS
@cross_origin()
@login_required
def getSumaTransferenciasSalidasMes():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_transferemcias_salidas "
                     "FROM salidas "
                     "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal")
            data_params = (usuarioLlave, 'Transferencia%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'suma_transferemcias_salidas': fila[2]
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
                     "SUM((existencias_Salidas - existencias_devueltas) * precio_venta_salidas) AS suma_devoluciones_salidas "
                     "FROM salidas "
                     "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
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
                'suma_devoluciones_salidas': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salidas_top_cinco_categorias_suc.route('/api/salidas_top_cinco_categorias_sucursal')#SALIDAS
@cross_origin()
@login_required
def getTopCincoCategoriasSucursal():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, categoria_nombre, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_costos "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "JOIN categorias ON `almacen_central`.`categoria` = `categorias`.`id` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal, categoria_nombre "
                     "ORDER BY suma_ventas DESC")
            data_params = (usuarioLlave, 'Venta%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'categoria_nombre': fila[2],
                'suma_ventas': fila[3],
                'suma_costos': fila[4]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salidas_top_cinco_cod_suc.route('/api/salidas_top_cinco_codigos_sucursal')#SALIDAS
@cross_origin()
@login_required
def getTopCincoCodigosSucursal():
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT MONTH(fecha) AS mes, sucursal, codigo, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas, "
                     "SUM((existencias_salidas - existencias_devueltas) * costo_unitario) AS suma_costos "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND YEAR(fecha) = %s "
                     "GROUP BY mes, sucursal, "
                     "codigo ORDER BY suma_ventas DESC")
            data_params = (usuarioLlave, 'Venta%', year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'sucursal': fila[1],
                'codigo': fila[2],
                'suma_ventas': fila[3],
                'suma_costos': fila[4]
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
        if sucursal_get not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
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
        return jsonify(resultado)
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
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
####----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@salidas_individual_id.route('/api/salidas/<int:idSal>')#Salidas
@cross_origin()
@login_required
def getSalidas(idSal):
    try:
        with mysql.connection.cursor() as cur:
            query = ("SELECT idSal, idProd, sucursal, existencias_salidas, precio_venta_salidas, comprobante, causa_devolucion, cliente, usuario, fecha, existencias_devueltas "
                     "FROM salidas "
                     "WHERE idSal = %s")
            cur.execute(query, (idSal,))
            data = cur.fetchall()
        contenido = {}
        for fila in data:
            contenido = { 
                'idSal': fila[0],
                'idProd': fila[1], 
                'sucursal': fila[2], 
                'existencias_salidas':fila[3],
                'precio_venta_salidas': fila[4],
                'comprobante': fila[5],
                'causa_devolucion': fila[6],
                'cliente': fila[7],
                'usuario': fila[8],
                'fecha': fila[9],
                'existencias_devueltas': fila[10]
                }
        return jsonify(contenido)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@salidas_categoria_kardex.route('/api/salidas_categoria_kardex/<string:categoria>')#KARDEX
@cross_origin()
@login_required
def getSumaVentasPorCategoria(categoria):
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_salidas = request.args.get('sucursal_salidas')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) AS conteo, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND sucursal = %s "
                     "AND categoria LIKE %s "
                     "AND YEAR(fecha) = %s")
            data_params = (usuarioLlave, 'Venta%', f"{sucursal_salidas}", f"{categoria}", year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'conteo': fila[0],
                'suma_ventas': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salidas_suc_kardex.route('/api/salidas_sucursal_kardex/<int:sucursal>')#KARDEX
@cross_origin()
@login_required
def getSumaVentasPorSucursal(sucursal):
    try:
        usuarioLlave = session.get('usernameDos')
        year_actual = request.args.get('year_actual')

        with mysql.connection.cursor() as cur:
            query = ("SELECT COUNT(*) AS conteo, "
                     "SUM((existencias_salidas - existencias_devueltas) * precio_venta_salidas) AS suma_ventas "
                     "FROM `salidas` "
                     "JOIN `almacen_central` ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s "
                     "AND sucursal = %s "
                     "AND YEAR(fecha) = %s")
            data_params = (usuarioLlave, 'Venta%', f"{sucursal}", year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'conteo': fila[0],
                'suma_ventas': fila[1]
                }
            resultado.append(contenido)
        return jsonify(resultado)
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
                'fecha': fila[3].strftime('%d-%m-%Y'),
                'existencias_devueltas': fila[4],
                'precio_venta_salidas': fila[5],
                'precio_venta': fila[6]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@entradas_suma_mes_kardex.route('/api/suma_ventas_por_mes_kardex/<int:id_codigo>')###Kardex############################################################
@cross_origin()
@login_required
def getSumaVentasPorMesKardex(id_codigo):
    try:
        usuarioLlave = session.get('usernameDos')
        salidas_sucursal = request.args.get('salidas_sucursal')
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
                     "AND sucursal LIKE %s "
                     "AND t1.idProd = %s "
                     "AND YEAR(t1.fecha) = %s "
                     "GROUP BY mes")
            data_params = (usuarioLlave, 'Venta%', f"{salidas_sucursal}%", id_codigo, year_actual)
            cur.execute(query, data_params)
            data = cur.fetchall()

        resultado = []
        for fila in data:
            contenido = { 
                'mes': fila[0],
                'suma_ventas': fila[1],
                'suma_costos': fila[2],
                'unidades_devueltas': int(fila[3]),
                'suma_ventas_esperado': fila[4],
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
            query = ("SELECT idSal, sucursal_nombre, codigo, descripcion, existencias_salidas, precio_venta_salidas, comprobante, cliente, existencias_devueltas, id_sucursales "
                     "FROM salidas "
                     "JOIN almacen_central ON `salidas`.`idProd` = `almacen_central`.`idProd` "
                     "JOIN sucursales ON `salidas`.`sucursal` = `sucursales`.`id_sucursales` "
                     "WHERE `identificadorSal` = %s "
                     "AND comprobante LIKE %s")
            cur.execute(query, (usuarioLlave, f"{comprobante}%"))
            data = cur.fetchall()
        resultado = []
        for fila in data:
            contenido = {
                'idSal': fila[0],
                'sucursal_nombre': fila[1],
                'codigo': fila[2],
                'descripcion': fila[3],
                'existencias_salidas':fila[4],
                'precio_venta_salidas':fila[5],
                'comprobante': fila[6],
                'cliente': fila[7],
                'existencias_devueltas': fila[8],
                'id_sucursales': fila[9]
                }
            resultado.append(contenido)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
###------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@salidas_post.route('/api/salidas', methods=['POST'])
@cross_origin()
@login_required
def saveSalidas():
    if 'idSal' in request.json:
        editSalidas()
    else:
        createSalidas()
    return "ok"

def createSalidas():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("INSERT INTO `salidas` "
                     "(`idSal`, `idProd`, `sucursal`, `existencias_salidas`, `precio_venta_salidas`,`comprobante`, `causa_devolucion`, `cliente`, `usuario`, `fecha`, `existencias_devueltas`, `identificadorSal`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data = (request.json['idProd'], request.json['sucursal'], request.json['existencias_salidas'], request.json['precio_venta_salidas'], request.json['comprobante'], 
                    request.json['causa_devolucion'], request.json['cliente'], request.json['usuario'], request.json['fecha'], request.json['existencias_devueltas'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Salida creada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

def editSalidas():
    try:
        usuarioLlave = session.get('usernameDos')
        with mysql.connection.cursor() as cur:
            query = ("UPDATE `salidas` SET `existencias_salidas` = %s, `precio_venta_salidas` = %s, `existencias_devueltas` = %s "
                     "WHERE `salidas`.`idSal` = %s "
                     "AND identificadorSal = %s")
            data = (request.json['existencias_salidas'], request.json['precio_venta_salidas'], request.json['existencias_devueltas'], request.json['idSal'], usuarioLlave)
            cur.execute(query, data)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Salida actualizada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})

@salidas_delete.route('/api/salidas/<int:idSal>', methods=['DELETE'])
@cross_origin()
@login_required
def removeSalidas(idSal):
    try:
        with mysql.connection.cursor() as cur:
            query = "DELETE FROM salidas WHERE `salidas`.`idSal` = %s"
            cur.execute(query, (idSal,))
            mysql.connection.commit()
        return "Salida eliminada." 
    except Exception as e:
        return jsonify({'error': str(e)}), 500  

@procesar_devolucion_salidas_post.route('/api/procesar_devolucion_salidas', methods=['POST'])##Devolución salidas
@cross_origin()
@login_required
def operarDevolucionSalidas():
    try:
        sucursal_post = request.json['sucursal_post']
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0
        dato_uno = 1

        if sucursal_post not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        
        with mysql.connection.cursor() as cur:
            query_productos = (f"UPDATE `almacen_central` SET {sucursal_post} = %s "
                                "WHERE `almacen_central`.`idProd` = %s "
                                "AND identificadorProd = %s")
            data_productos = (request.json['existencias_post'], request.json['idProd'], usuarioLlave)
            cur.execute(query_productos, data_productos)
            mysql.connection.commit()

            query_salidas_update = ("UPDATE `salidas` SET `existencias_salidas` = %s, `precio_venta_salidas` = %s, `existencias_devueltas` = %s "
                                    "WHERE `salidas`.`idSal` = %s "
                                    "AND identificadorSal = %s")
            data_salidas_update = (request.json['existencias_salidas_update'], request.json['precio_venta_salidas'], request.json['existencias_devueltas_update'], request.json['idSal'], usuarioLlave)
            cur.execute(query_salidas_update, data_salidas_update)
            mysql.connection.commit()

            query_salidas_insert = ("INSERT INTO `salidas` "
                                    "(`idSal`, `idProd`, `sucursal`, `existencias_salidas`, `precio_venta_salidas`,`comprobante`, `causa_devolucion`, `cliente`, `usuario`, `fecha`, `existencias_devueltas`, `identificadorSal`) "
                                    "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data_salidas_insert = (request.json['idProd'], request.json['sucursal'], f"{dato_cero}", request.json['precio_venta_salidas'], request.json['comprobante'], 
                    request.json['causa_devolucion'], f"{dato_uno}", usuarioId, request.json['fecha'], request.json['existencias_devueltas_insert'], usuarioLlave)
            cur.execute(query_salidas_insert, data_salidas_insert)
            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Cantidades actualizadas correctamente."}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

@procesar_venta_post.route('/api/procesar_venta', methods=['POST'])#Ya no se usa
@cross_origin()
@login_required
def operarVenta():
    try:
        sucursal_post = request.json['sucursal_post']
        usuarioLlave = session.get('usernameDos')
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0

        if sucursal_post not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400
        
        with mysql.connection.cursor() as cur:
            query_productos = (f"UPDATE `almacen_central` SET {sucursal_post} = %s "
                     "WHERE `almacen_central`.`idProd` = %s "
                     "AND identificadorProd = %s")
            data_productos = (request.json['existencias_post'], request.json['idProd'], usuarioLlave)
            cur.execute(query_productos, data_productos)

            query_salidas = ("INSERT INTO `salidas` "
                     "(`idSal`, `idProd`, `sucursal`, `existencias_salidas`, `precio_venta_salidas`,`comprobante`, `causa_devolucion`, `cliente`, `usuario`, `fecha`, `existencias_devueltas`, `identificadorSal`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data_salidas = (request.json['idProd'], request.json['sucursal'], request.json['existencias_salidas'], request.json['precio_venta_salidas'], request.json['comprobante'], 
                            f"{dato_cero}", request.json['cliente'], usuarioId, request.json['fecha'], f"{dato_cero}", usuarioLlave)
            cur.execute(query_salidas, data_salidas)

            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Cantidades actualizadas correctamente."}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

@salidas_gestion_ventas_post.route('/api/gestion_de_venta', methods=['POST'])
@cross_origin()
@login_required
def gestionDeVenta():
    try:
        usuarioLlave = session.get('usernameDos')
        sucursal_post = request.json['sucursal_post']
        usuarioId = session.get('identificacion_usuario')
        dato_cero = 0
        numero_venta = request.json['ventas']
        comp = 'Venta-' + str(numero_venta)

        item_ticket = request.json['item_ticket']
        productos_venta = request.json.get('array_productos', [])
        salidas_venta = request.json.get('array_salidas', [])

        if sucursal_post not in ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st']:
            return jsonify({"status": "error", "message": "Sucursal no válida"}), 400# Almacén central
        
        if item_ticket not in ['nota_venta', 'boleta_venta', 'factura']:
            return jsonify({"status": "error", "message": "Item no válido"}), 400# Numeración
        
        with mysql.connection.cursor() as cur:

            #Numeración #Un solo objeto
            query_numeracion = (f"UPDATE `numeracion_comprobante` SET `ventas` = %s, {item_ticket} = %s "
                                "WHERE `numeracion_comprobante`.`id` = %s "
                                "AND identificador = %s")
            data_numeracion = (request.json['ventas'], request.json['numeracion_ticket'], request.json['id'], usuarioLlave)
            cur.execute(query_numeracion, data_numeracion)

            #Almacén central #array de objetos
            query_productos = (f"UPDATE `almacen_central` SET {sucursal_post} = %s "
                                "WHERE `almacen_central`.`idProd` = %s "
                                "AND identificadorProd = %s")
            data_productos = [(p['existencias_post'], p['idProd'], usuarioLlave) for p in productos_venta]
            cur.executemany(query_productos, data_productos)

            #Salidas #array de objetos
            query_salidas = ("INSERT INTO `salidas` "
                     "(`idSal`, `idProd`, `sucursal`, `existencias_salidas`, `precio_venta_salidas`,`comprobante`, `causa_devolucion`, `cliente`, `usuario`, `fecha`, `existencias_devueltas`, `identificadorSal`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data_salidas = [(s['idProd'], s['sucursal'], s['existencias_salidas'], s['precio_venta_salidas'],
                             comp, dato_cero, s['cliente'], usuarioId, s['fecha'], dato_cero, usuarioLlave) for s in salidas_venta]
            cur.executemany(query_salidas, data_salidas)

            #Detalle de venta #Un solo objeto
            query_detalle = ("INSERT INTO `ventas` (`id_det_ventas`, `sucursal`, `comprobante`, `tipo_comprobante`, `dni_cliente`, `modo_efectivo`, `modo_credito`, "
                     "`modo_tarjeta`, `modo_perdida`, `total_venta`, `fecha_det_ventas`, `identificador_ventas`, `canal_venta`) "
                     "VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            data_detalle = (request.json['sucursal'],f"{comp}", request.json['tipo_comprobante'], request.json['dni_cliente'], request.json['modo_efectivo'], 
                    request.json['modo_credito'], request.json['modo_tarjeta'], request.json['modo_perdida'], request.json['total_venta'], request.json['fecha'], 
                    usuarioLlave, request.json['canal_venta'])
            cur.execute(query_detalle, data_detalle)

            mysql.connection.commit()
        return jsonify({"status": "success", "message": "Numeración actualizada correctamente."})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"status": "error", "message": str(e)})
