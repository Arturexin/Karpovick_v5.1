const URL_API_usuario = 'http://127.0.0.1:3000/api/'
const fechaLogin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
const expresiones = {
    cliente: /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$/,
    precios: /^\d*\.?\d+/,
    dni: /^\d{8,8}$/,
    email: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
    telefono: /^[ 0-9]+$/,
    direccion: /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'°,.:/\d\- ]+$/,
    cantidad: /^[0-9]+$/,
    codigo: /^[A-ZÑa-zñ'°\d ]+$/,
    descripcion: /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'°\-_/:()\d ]+$/,
    password: /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/
};
formLogin()
function checkCapsLock(event) { 
    let capsWarning = document.getElementById("capsWarning"); 
    if (event.getModifierState("CapsLock")) { 
        capsWarning.style.display = "block"; 
    } else { 
        capsWarning.style.display = "none"; 
    } 
}
function formLogin(){
    let form = `<form id="formulario-loggin" action="/login" method="POST">
                    <div class="contenedor-formulario-uno">
                        <h2 style="text-align: center;">Iniciar Sesión</h2>
                        <label >Usuario
                            <input id="username" type="text" name="username">
                        </label>
                        <label>Constraseña
                            <input id="password" type="password" name="password" onkeyup="checkCapsLock(event)">
                        </label>
                        <p id="capsWarning" style="display:none;color:#cd4b4bc4;font-size: 14px; text-align:center">¡La tecla de mayúsculas está activada!</p>
                        </div>
                    </form>
                    <dir class="centrado_form">
                        <button class="boton-iniciar-sesion" onClick="initSession()">Iniciar Sesión</button>
                        <button class="boton-iniciar-sesion-tres" onCLick="formCreate()">Crear cuenta</button>
                    </dir>`;
    document.querySelector(".contenedor_form").innerHTML = form
}
function formCreate(){
    let form = `<form id="formulario-create">
                    <div class="contenedor-formulario-uno">
                        <h2 style="text-align: center;">Crear Cuenta</h2>
                        <label>Nombres<input id="nombres-create" name="nombres-create" type="text"></label>
                        <label>Apellidos<input id="apellidos-create" name="apellidos-create" type="text"></label>
                        <label>DNI<input id="dni-create" name="dni-create" type="text"></label>
                        <label>Email<input id="email-create" name="email-create" type="text"></label>
                        <label>Teléfono<input id="telefono-create" name="telefono-create" type="text"></label>
                        <label>Password<input id="password-create" name="password-create" type="password"></label>
                        <label>Confirmar Password<input id="password-confirmar-create" name="password-confirmar-create" type="password"></label>
                        
                    </div>
                </form>
                <div class="centrado_form">
                    <button class="boton-iniciar-sesion" onClick="initRegister()">Registrar Cuenta</button>
                    <button class="boton-iniciar-sesion-tres" onCLick="formLogin()">Iniciar Sesión</button>
                </div>`;
    document.querySelector(".contenedor_form").innerHTML = form
};
async function initSession(){
    if(expresiones.email.test(document.getElementById("username").value) &&
        expresiones.password.test(document.getElementById("password").value)){
        const response = await fetch('/login',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                username: document.getElementById("username").value,
                password: document.getElementById("password").value
            })
        });    
        if(response.redirected){
            modal_proceso_abrir("Iniciando sesión.")
            await delay(1000)
            location.href = response.url
        }else{
            modal_proceso_abrir("Usuario o contraseña no encontrados.")
            await delay(1000)
            location.href = response.url
        }
        document.querySelector("#formulario-loggin").reset();
        document.getElementById("username").style.background =""
        document.getElementById("password").style.background ="" 
    }else if(expresiones.email.test(document.getElementById("username").value) == false){
        document.getElementById("username").style.background ="#b36659"
    }else if(expresiones.email.test(document.getElementById("password").value) == false){
        document.getElementById("password").style.background ="#b36659"
    };
};
async function initRegister(){
    if(document.getElementById("password-create").value === document.getElementById("password-confirmar-create").value &&
        expresiones.cliente.test(document.getElementById("nombres-create").value) &&
        expresiones.cliente.test(document.getElementById("apellidos-create").value) &&
        expresiones.dni.test(document.getElementById("dni-create").value) &&
        expresiones.email.test(document.getElementById("email-create").value) &&
        expresiones.telefono.test(document.getElementById("telefono-create").value) &&
        expresiones.password.test(document.getElementById("password-create").value)){
            data = {
                'nombres': document.getElementById("nombres-create").value,
                'apellidos': document.getElementById("apellidos-create").value,
                'dni': document.getElementById("dni-create").value,
                'e_mail': document.getElementById("email-create").value,
                'telefono': document.getElementById("telefono-create").value,
                'passw': document.getElementById("password-create").value,
                'fecha': fechaLogin
            };
        const response = await fetch('/registro',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
                },
            body:JSON.stringify(data)
        });

        if(response.ok){
            alert("Usuario creado correctamente, se le enviará un mensaje de confirmación a su correo electrónico.")
            document.getElementById("formulario-create").reset()
        };
    }else if(document.getElementById("password-create").value != document.getElementById("password-confirmar-create").value){
        alert("Password y password de confirmación no son iguales.")
    }else if(expresiones.email.test(document.getElementById("nombres-create").value) == false){
        document.getElementById("nombres-create").style.background ="#b36659"
    }else if(expresiones.email.test(document.getElementById("apellidos-create").value) == false){
        document.getElementById("apellidos-create").style.background ="#b36659"
    }else if(expresiones.email.test(document.getElementById("dni-create").value) == false){
        document.getElementById("dni-create").style.background ="#b36659"
    }else if(expresiones.email.test(document.getElementById("email-create").value) == false){
        document.getElementById("email-create").style.background ="#b36659"
    }else if(expresiones.email.test(document.getElementById("telefono-create").value) == false){
        document.getElementById("telefono-create").style.background ="#b36659"
    }else if(expresiones.email.test(document.getElementById("password-create").value) == false){
        document.getElementById("password-create").style.background ="#b36659"
    };
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function aperturarMensajesModal(){
    let modal_mensaje = `<div class="modal-content">
                            <p id="mensaje_proceso"></p>
                        </div>`;
    document.getElementById("myModal").innerHTML = modal_mensaje;
}
function modal_proceso_abrir(mensaje){
    aperturarMensajesModal()
    document.getElementById('myModal').style.display = 'block';
    document.getElementById('mensaje_proceso').textContent = mensaje
}