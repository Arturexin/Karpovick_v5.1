from werkzeug.security import check_password_hash,generate_password_hash
from flask_login import UserMixin

class User(UserMixin):

    def __init__(self, id, nombres, apellidos, dni, e_mail, telefono, cargo, vinculacion, passw, clave, fecha) -> None:
        self.id = id
        self.nombres = nombres
        self.apellidos = apellidos
        self.dni = dni
        self.e_mail = e_mail
        self.telefono = telefono
        self.cargo = cargo
        self.vinculacion = vinculacion
        self.passw = passw
        self.clave = clave
        self.fecha = fecha

    @classmethod
    def check_password(self, hashed_password, password):
        return check_password_hash(hashed_password, password)
    
#holitash = generate_password_hash("Luter123.")
#print( 'codigo',holitash)