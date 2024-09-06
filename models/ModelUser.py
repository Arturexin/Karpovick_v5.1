from flask import session
from .entities.User import User

class ModelUser():
    @classmethod
    def login(self, mysql, user):
        try:
            cursor= mysql.connection.cursor()
            sql="SELECT id, nombres, apellidos, dni, e_mail, telefono, cargo, vinculacion, passw, clave, fecha FROM usuarios WHERE vinculacion != 0 AND clave LIKE 1 AND e_mail = '{}'".format(user.e_mail)
            cursor.execute(sql)
            row=cursor.fetchone()
            if row != None:
                user = User(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], User.check_password(row[8], user.passw), row[9], row[10])
                return user
            else:
                return None
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def get_by_id(self, mysql, id):
        try:
            cursor= mysql.connection.cursor()
            sql="SELECT id, nombres, apellidos, dni, e_mail, telefono, cargo, vinculacion, clave, fecha FROM usuarios WHERE vinculacion != 0 AND clave LIKE 1 AND id = {}".format(id)
            cursor.execute(sql)
            row=cursor.fetchone()
            if row != None:
                session['usernameDos'] = row[7]
                session['puesto'] = row[6]
                session['identificacion_usuario'] = row[0]
                session['usuario_nombre'] = row[1]
                return User(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], None, row[8], row[9])
            else:
                return None
        except Exception as ex:
            raise Exception(ex)