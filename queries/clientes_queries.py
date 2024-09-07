def get_clientes_count_query():
    return ("SELECT COUNT(*) "
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