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

const botonFomulario = document.getElementById("boton-iniciar-sesion-formulario");
botonFomulario.addEventListener("click", () => {
    document.querySelector(".contenedor-formulario-uno").classList.toggle("contenedor-formulario-uno-show")
    document.querySelector(".contenedor-formulario-dos").classList.remove("contenedor-formulario-dos-show")
});
const botonFomularioDos = document.querySelector(".boton-iniciar-sesion-dos");
botonFomularioDos.addEventListener("click", (event) => {
    event.preventDefault()
    document.querySelector(".contenedor-formulario-uno").classList.toggle("contenedor-formulario-uno-show")
    document.querySelector(".contenedor-formulario-dos").classList.remove("contenedor-formulario-dos-show")
});

const crearCuenta = document.querySelector(".crear-cuenta");
crearCuenta.addEventListener("click", (event) => {
    event.preventDefault()
    document.querySelector(".contenedor-formulario-uno").classList.remove("contenedor-formulario-uno-show")
    document.querySelector(".contenedor-formulario-dos").classList.add("contenedor-formulario-dos-show")
});

const botonPrueba = document.getElementById("boton_prueba");
botonPrueba.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".contenedor-formulario-uno").classList.remove("contenedor-formulario-uno-show")
    document.querySelector(".contenedor-formulario-dos").classList.toggle("contenedor-formulario-dos-show")
});
const formularioLogin = document.getElementById("formulario-loggin");
document.querySelector(".boton-iniciar-sesion").addEventListener("click", async (event) => {
    event.preventDefault()
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
        if(response.ok){
            location.href = "/index"
        }else{
            alert("Usuario o conatraseña no correcta.")
        }

        localStorage.setItem("usuario", document.getElementById("username").value)
        document.querySelector("#formulario-loggin").reset();
        document.getElementById("username").style.background =""
        document.getElementById("password").style.background ="" 
    }else if(expresiones.email.test(document.getElementById("username").value) == false){
        document.getElementById("username").style.background ="#b36659"
    }else if(expresiones.email.test(document.getElementById("password").value) == false){
        document.getElementById("password").style.background ="#b36659"
    };
});
const btn = document.getElementById('button');
const registro = document.getElementById('formulario-create');
registro.addEventListener('submit',async (event)=>{
    event.preventDefault();
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
        console.log(response.status)
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
});