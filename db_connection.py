from flask_mysqldb import MySQL

mysql = MySQL()

def init_app(app):
    # Configuración de la base de datos MySQL
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'
    app.config['MYSQL_PASSWORD'] = ''
    app.config['MYSQL_DB'] = 'data_base_general'
    # app.config['MYSQL_CURSORCLASS'] = 'DictCursor'  # Para obtener los resultados como diccionarios
    
    # Inicializar la extensión MySQL con la app Flask
    mysql.init_app(app)