
document.addEventListener("DOMContentLoaded", inicioUsuarios)
function inicioUsuarios(){
    cargarNumeracion()

    inicioTablaUsuarios()
    inicioSelectCargo()
};
const URL_API_usuarios = 'http://127.0.0.1:3000/api/'
const fechaControl = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
async function funcionFetch(url, fila){
    try {
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(fila),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error("Error en la respuesta de la API: " + response.statusText);
        };
        return response;
    } catch (error) {
        console.error("Error durante la solicitud:", error);
        throw error;
    };
};
let numeracion = [];
let usuarios_control = [];
let usuario_admin
async function cargarNumeracion(){
    let url = URL_API_usuarios + 'numeracion_comprobante_control'
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    numeracion = await response.json()
};
async function inicioTablaUsuarios(){
    await conteoUsuarios(document.getElementById("filtro-tabla-usuarios-id").value,
                        document.getElementById("filtro-tabla-usuarios-nombres").value,
                        document.getElementById("filtro-tabla-usuarios-apellidos").value,
                        document.getElementById("filtro-tabla-usuarios-dni").value,
                        document.getElementById("filtro-tabla-usuarios-email").value,
                        document.getElementById("filtro-tabla-usuarios-telefono").value,
                        document.getElementById("filtro-tabla-usuarios-cargo").value,
                        document.getElementById("filtro-tabla-usuarios-vinculacion").value,
                        document.getElementById("filtro-tabla-usuarios-clave").value,
                        '2000-01-01',
                        new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(),
                        document.getElementById("filtro-tabla-usuarios-sucursales").value, 
                        document.getElementById("filtro-tabla-usuarios-usuarios").value)

    await searchUsuarios(document.getElementById("numeracionTablaUsuarios").value - 1, "", "", "", "", "", "", "", "", "", 
                        '2000-01-01', new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(),"", "")
    avanzarTablaUsuarios()
    atajoTablaUsuarios()
    filtroUsuarios()

    await conteoSucursales(document.getElementById("filtro-tabla-sucursal-sucursal").value,
                            document.getElementById("filtro-tabla-sucursal-estado").value,
                            document.getElementById("filtro-tabla-sucursal-usuario").value,
                            '2000-01-01',
                            new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    await searchSucursales(document.getElementById("numeracionTablaSucursal").value - 1,"","","",
                            '2000-01-01', new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    avanzarTablaSucursal()
    atajoTablaSucursales()
    filtroSucursales()
};

let numeronIncremento = 1;
let suma = 0;
let inicio = 0;
let fin = 0;
async function conteoUsuarios(id,nombres,apellidos,dni,email,telefono,cargo,vinculacion,clave,inicio,fin,sucursales,usuarios){
    let url = URL_API_usuarios + `usuarios_conteo?`+
                                `id_usuarios=${id}&`+
                                `nombres_usuarios=${nombres}&`+
                                `apellidos_usuarios=${apellidos}&`+
                                `dni_usuarios=${dni}&`+
                                `e_mail_usuarios=${email}&`+
                                `telefono_usuarios=${telefono}&`+
                                `cargo_usuarios=${cargo}&`+
                                `vinculacion_usuarios=${vinculacion}&`+
                                `clave_usuarios=${clave}&`+
                                `fecha_inicio_usuarios=${inicio}&`+
                                `fecha_fin_usuarios=${fin}&`+
                                `sucursales_usuarios=${sucursales}&`+
                                `usuarios_usuarios=${usuarios}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    cantidadFilas = await respuesta.json();
    console.log(cantidadFilas)
    let html = "";
    for(let i = 1; i <= Math.ceil(cantidadFilas/20); i++) {
        let fila = `<option value="${i}">${i}</option>`
        html = html + fila;
    };
    document.querySelector("#numeracionTablaUsuarios").innerHTML = html
};
async function searchUsuarios(num,id,nombres,apellidos,dni,email,telefono,cargo,vinculacion,clave,inicio,fin,sucursales,usuarios){
    let url = URL_API_usuarios + `usuarios_tabla/${num}?`+
                                `id_usuarios=${id}&`+
                                `nombres_usuarios=${nombres}&`+
                                `apellidos_usuarios=${apellidos}&`+
                                `dni_usuarios=${dni}&`+
                                `e_mail_usuarios=${email}&`+
                                `telefono_usuarios=${telefono}&`+
                                `cargo_usuarios=${cargo}&`+
                                `vinculacion_usuarios=${vinculacion}&`+
                                `clave_usuarios=${clave}&`+
                                `fecha_inicio_usuarios=${inicio}&`+
                                `fecha_fin_usuarios=${fin}&`+
                                `sucursales_usuarios=${sucursales}&`+
                                `usuarios_usuarios=${usuarios}`
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    usuarios_control = await response.json()
    let html = ''
    if(usuarios_control.length > 0){
        for( usuario of usuarios_control){
            let filaUsuarios = `
                    <tr>
                        <td style="text-align: end;">${usuario.id}</td>
                        <td>${usuario.nombres}</td>
                        <td>${usuario.apellidos}</td>
                        <td>${usuario.dni}</td>
                        <td>${usuario.e_mail}</td>
                        <td>${usuario.telefono}</td>
                        <td style="text-align: end;">${usuario.cargo}</td>
                        <td style="text-align: end;">${usuario.vinculacion}</td>
                        <td style="text-align: end;">${usuario.clave}</td>
                        <td>${usuario.fecha}</td>
                        <td style="text-align: end;">${usuario.num_sucursales}</td>
                        <td style="text-align: end;">${usuario.num_usuarios}</td>
                        <td>${usuario.ultimo_pago}</td>
                        <td>
                            <a onclick="edit(${usuario.id})" class="boton_editar">E</a>
                            <a onclick="activacion(${usuario.id})" class="boton_editar">Activar</a>
                            <a onclick="desactivacion(${usuario.id})" class="boton_eliminar">Desactivar</a>
                            <a onclick="remove(${usuario.id})" class="boton_eliminar">X</a>
                        </td>
                    </tr>`
            html = html + filaUsuarios;
        };
        document.querySelector('#tabla-usuarios > tbody').outerHTML = html;
    }else{
        alert("No se encontraron resultados.")
        document.querySelector("#tabla-usuarios > tbody").outerHTML = html;
        document.querySelector("#tabla-usuarios").createTBody()
    };
};
function avanzarTablaUsuarios(){
    document.getElementById("avanzarUsuarios").addEventListener("click", () =>{
        if(suma + 20 < cantidadFilas){
            numeronIncremento += 1
            suma += 20
            document.getElementById("numeracionTablaUsuarios").value = numeronIncremento
            manejoDeFechasUsuarios()
            searchUsuarios(suma,
                            document.getElementById("filtro-tabla-usuarios-id").value,
                            document.getElementById("filtro-tabla-usuarios-nombres").value,
                            document.getElementById("filtro-tabla-usuarios-apellidos").value,
                            document.getElementById("filtro-tabla-usuarios-dni").value,
                            document.getElementById("filtro-tabla-usuarios-email").value,
                            document.getElementById("filtro-tabla-usuarios-telefono").value,
                            document.getElementById("filtro-tabla-usuarios-cargo").value,
                            document.getElementById("filtro-tabla-usuarios-vinculacion").value,
                            document.getElementById("filtro-tabla-usuarios-clave").value,
                            inicio,
                            fin,
                            document.getElementById("filtro-tabla-usuarios-sucursales").value, 
                            document.getElementById("filtro-tabla-usuarios-usuarios").value)
        };
    });
    document.getElementById("retrocederUsuarios").addEventListener("click", () =>{
        if(numeronIncremento > 1){
            numeronIncremento -= 1
            suma -= 20
            document.getElementById("numeracionTablaUsuarios").value = numeronIncremento
            manejoDeFechasUsuarios()
            searchUsuarios(suma,
                            document.getElementById("filtro-tabla-usuarios-id").value,
                            document.getElementById("filtro-tabla-usuarios-nombres").value,
                            document.getElementById("filtro-tabla-usuarios-apellidos").value,
                            document.getElementById("filtro-tabla-usuarios-dni").value,
                            document.getElementById("filtro-tabla-usuarios-email").value,
                            document.getElementById("filtro-tabla-usuarios-telefono").value,
                            document.getElementById("filtro-tabla-usuarios-cargo").value,
                            document.getElementById("filtro-tabla-usuarios-vinculacion").value,
                            document.getElementById("filtro-tabla-usuarios-clave").value,
                            inicio,
                            fin,
                            document.getElementById("filtro-tabla-usuarios-sucursales").value, 
                            document.getElementById("filtro-tabla-usuarios-usuarios").value)
        };
    });
};
async function actualizarTablaUsuarios(){
    manejoDeFechasUsuarios()
    await searchUsuarios((document.getElementById("numeracionTablaUsuarios").value - 1) * 20,
                    document.getElementById("filtro-tabla-usuarios-id").value,
                    document.getElementById("filtro-tabla-usuarios-nombres").value,
                    document.getElementById("filtro-tabla-usuarios-apellidos").value,
                    document.getElementById("filtro-tabla-usuarios-dni").value,
                    document.getElementById("filtro-tabla-usuarios-email").value,
                    document.getElementById("filtro-tabla-usuarios-telefono").value,
                    document.getElementById("filtro-tabla-usuarios-cargo").value,
                    document.getElementById("filtro-tabla-usuarios-vinculacion").value,
                    document.getElementById("filtro-tabla-usuarios-clave").value,
                    inicio,
                    fin,
                    document.getElementById("filtro-tabla-usuarios-sucursales").value, 
                    document.getElementById("filtro-tabla-usuarios-usuarios").value)
}
function atajoTablaUsuarios(){
    document.getElementById("numeracionTablaUsuarios").addEventListener("change", async ()=>{
        await actualizarTablaUsuarios();
        numeronIncremento = Number(document.getElementById("numeracionTablaUsuarios").value);
        suma = (document.getElementById("numeracionTablaUsuarios").value - 1) * 20;
    });
};
document.getElementById("restablecerUsuarios").addEventListener("click", async () =>{
    document.getElementById('filtro-tabla-usuarios-id').value = "" 
    document.getElementById('filtro-tabla-usuarios-nombres').value = "" 
    document.getElementById('filtro-tabla-usuarios-apellidos').value = "" 
    document.getElementById('filtro-tabla-usuarios-dni').value = "" 
    document.getElementById('filtro-tabla-usuarios-email').value = "" 
    document.getElementById('filtro-tabla-usuarios-telefono').value = "" 
    document.getElementById('filtro-tabla-usuarios-cargo').value = "" 
    document.getElementById('filtro-tabla-usuarios-vinculacion').value = "" 
    document.getElementById('filtro-tabla-usuarios-clave').value = ""

    await conteoUsuarios(document.getElementById("filtro-tabla-usuarios-id").value,
                        document.getElementById("filtro-tabla-usuarios-nombres").value,
                        document.getElementById("filtro-tabla-usuarios-apellidos").value,
                        document.getElementById("filtro-tabla-usuarios-dni").value,
                        document.getElementById("filtro-tabla-usuarios-email").value,
                        document.getElementById("filtro-tabla-usuarios-telefono").value,
                        document.getElementById("filtro-tabla-usuarios-cargo").value,
                        document.getElementById("filtro-tabla-usuarios-vinculacion").value,
                        document.getElementById("filtro-tabla-usuarios-clave").value,
                        '2000-01-01',
                        new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(),
                        document.getElementById("filtro-tabla-usuarios-sucursales").value, 
                        document.getElementById("filtro-tabla-usuarios-usuarios").value)
    await searchUsuarios(0, 
                        document.getElementById("filtro-tabla-usuarios-id").value,
                        document.getElementById("filtro-tabla-usuarios-nombres").value,
                        document.getElementById("filtro-tabla-usuarios-apellidos").value,
                        document.getElementById("filtro-tabla-usuarios-dni").value,
                        document.getElementById("filtro-tabla-usuarios-email").value,
                        document.getElementById("filtro-tabla-usuarios-telefono").value,
                        document.getElementById("filtro-tabla-usuarios-cargo").value,
                        document.getElementById("filtro-tabla-usuarios-vinculacion").value,
                        document.getElementById("filtro-tabla-usuarios-clave").value,
                        '2000-01-01',
                        new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(),
                        document.getElementById("filtro-tabla-usuarios-sucursales").value, 
                        document.getElementById("filtro-tabla-usuarios-usuarios").value)
});
function manejoDeFechasUsuarios(){
    inicio = document.getElementById("filtro-tabla-usuarios-fecha-inicio").value;
    fin = document.getElementById("filtro-tabla-usuarios-fecha-fin").value;
    if(inicio == "" && fin == ""){
        inicio = '2000-01-01';
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
    }else if(inicio == "" && fin != ""){
        inicio = '2000-01-01';
    }else if(inicio != "" && fin == ""){
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
    };
};
function filtroUsuarios(){
    document.getElementById("buscarFiltrosUsuarios").addEventListener("click", async (e)=>{
        e.preventDefault();
        manejoDeFechasUsuarios()
        await conteoUsuarios(document.getElementById("filtro-tabla-usuarios-id").value,
                            document.getElementById("filtro-tabla-usuarios-nombres").value,
                            document.getElementById("filtro-tabla-usuarios-apellidos").value,
                            document.getElementById("filtro-tabla-usuarios-dni").value,
                            document.getElementById("filtro-tabla-usuarios-email").value,
                            document.getElementById("filtro-tabla-usuarios-telefono").value,
                            document.getElementById("filtro-tabla-usuarios-cargo").value,
                            document.getElementById("filtro-tabla-usuarios-vinculacion").value,
                            document.getElementById("filtro-tabla-usuarios-clave").value,
                            inicio,
                            fin,
                            document.getElementById("filtro-tabla-usuarios-sucursales").value, 
                            document.getElementById("filtro-tabla-usuarios-usuarios").value)
        await searchUsuarios(0, 
                            document.getElementById("filtro-tabla-usuarios-id").value,
                            document.getElementById("filtro-tabla-usuarios-nombres").value,
                            document.getElementById("filtro-tabla-usuarios-apellidos").value,
                            document.getElementById("filtro-tabla-usuarios-dni").value,
                            document.getElementById("filtro-tabla-usuarios-email").value,
                            document.getElementById("filtro-tabla-usuarios-telefono").value,
                            document.getElementById("filtro-tabla-usuarios-cargo").value,
                            document.getElementById("filtro-tabla-usuarios-vinculacion").value,
                            document.getElementById("filtro-tabla-usuarios-clave").value,
                            inicio,
                            fin,
                            document.getElementById("filtro-tabla-usuarios-sucursales").value, 
                            document.getElementById("filtro-tabla-usuarios-usuarios").value)
        numeronIncremento = 1;
        suma = 0;
        alert(`Se obtuvieron ${cantidadFilas} registros.`)
    });
};
function edit(id) {
    let usuario = usuarios_control.find(x => x.id == id)
    document.getElementById('usuarios-id').value = usuario.id
    document.getElementById('usuarios-nombres').value = usuario.nombres
    document.getElementById('usuarios-apellidos').value = usuario.apellidos
    document.getElementById('usuarios-dni').value = usuario.dni
    document.getElementById('usuarios-email').value = usuario.e_mail
    document.getElementById('usuarios-telefono').value = usuario.telefono
    document.getElementById('usuarios-cargo').value = usuario.cargo
    if(document.getElementById('usuarios-cargo').value === "201" ||
    document.getElementById('usuarios-cargo').value === "200"){
        document.getElementById('usuarios-vinculacion').value = usuario.id
    }else{
        document.getElementById('usuarios-vinculacion').value = usuario.vinculacion
    };
    document.getElementById('usuarios-clave').value = usuario.clave
    document.getElementById('usuarios-fecha').value = usuario.fecha
};
async function remove(id) {
    respuesta = confirm('¿Estas seguro de eliminarlo?')
    if (respuesta) {
        let url = URL_API_usuarios + 'usuarios/' + id
        await fetch(url,{
            "method": "DELETE",
            "headers": {
                "Content-Type": 'application/json'
            }
        });
        searchUsuarios();
    };
};
async function activarNumeracion(num){
    let data_num = {
        "compras": 0,
        "recompras": 0,
        "transferencias": 0,
        "ventas": 0,      
        "nota_venta": 0,      
        "boleta_venta": 0,      
        "factura": 0,
        "identificador": num,
        "nombre_empresa": "",
        "ruc": "",
        "direccion": "",
        "moneda": "",
        "web": "",
    };
    let urlNum = URL_API_usuarios + 'numeracion_comprobante'
    let response = await funcionFetch(urlNum, data_num);
    if(response.ok){
        alert("Numeración creada.")
    };  
};
async function activarClienteProveedor(num){
    for(let i = 0; i < 2; i++){
        let data = {
            "clase_cli": i,
            "direccion_cli": "",
            "dni_cli": "",
            "email_cli": "",
            "nombre_cli": "Sin datos",
            "telefono_cli": "",
            "usuario_cli": num,
            "fecha_cli": fechaControl
        };
        let urlCli = URL_API_usuarios + 'clientes_control'
        let response = await funcionFetch(urlCli, data);
        if(response.ok){
            alert(`Cliente o proveedor ${i} creado.`)
        };  
    };
};
const crearUsuarios = document.getElementById("crear_usuario");
crearUsuarios.addEventListener("click", crearUsuariosF)
async function crearUsuariosF(e) {
    e.preventDefault();
    if(document.getElementById('usuarios-id').value == "" && document.getElementById('usuarios-password').value != ""){
        let data = {
            'nombres': document.getElementById("usuarios-nombres").value,
            'apellidos': document.getElementById("usuarios-apellidos").value,
            'dni': document.getElementById("usuarios-dni").value,
            'e_mail': document.getElementById("usuarios-email").value,
            'telefono': document.getElementById("usuarios-telefono").value,
            'passw': document.getElementById("usuarios-password").value,
            'fecha': fechaControl,
            'cargo': document.getElementById('usuarios-cargo').value,
            'vinculacion': 0,
            'num_sucursales': 1,
            'num_usuarios': 1,
        };
        if(data.cargo != 201){
            data.vinculacion = document.getElementById('usuarios-vinculacion').value
            data.num_sucursales = 0
            data.num_usuarios = 0
        }
        let url = URL_API_usuarios + 'usuarios'
        let response = await funcionFetch(url, data);
        console.log(response.status)
        if(response.ok){
            await actualizarTablaUsuarios();
            alert("Usuario creado.");
            document.querySelector(".formulario-general").reset()
        };
    }else{
        alert(`El usuario ${document.getElementById("usuarios-nombres").value} `+
        `${document.getElementById("usuarios-apellidos").value} con id: `+
        `${document.getElementById('usuarios-id').value}, ya existe.`)
    };
};
const editarUsuarios = document.getElementById("editar_usuario");
editarUsuarios.addEventListener("click", editarUsuariosF)
async function editarUsuariosF(e) {
    e.preventDefault();
    let usuario = usuarios_control.find(x => x.id == document.getElementById('usuarios-id').value)
    if((usuario.clave === 0 || usuario.clave === 3) && usuario.cargo !== 201 && usuario.cargo !== 200){
        let data = {
            'id': document.getElementById('usuarios-id').value,
            'nombres': document.getElementById('usuarios-nombres').value,
            'apellidos': document.getElementById('usuarios-apellidos').value,
            'dni': document.getElementById('usuarios-dni').value,
            'e_mail': document.getElementById('usuarios-email').value,
            'telefono': document.getElementById('usuarios-telefono').value,
            'cargo': document.getElementById('usuarios-cargo').value,
            'vinculacion': document.getElementById('usuarios-vinculacion').value
        };
        if(data.cargo !== 201 || data.cargo !== 200){
            let url = URL_API_usuarios + 'usuarios'
            let response = await funcionFetch(url, data);
            if(response.ok){
                await actualizarTablaUsuarios();
                alert("Usuario actualizado.");
                document.querySelector(".formulario-general").reset()
            };
        }else{
            alert(`El usuario ${data.nombres} ${data.apellidos} no puede cambiarse a Administrador o Super Administrador`)
        };
    }else if(usuario.cargo === 201 || usuario.cargo === 200){
        let data_dos = {
            'id': document.getElementById('usuarios-id').value,
            'nombres': document.getElementById('usuarios-nombres').value,
            'apellidos': document.getElementById('usuarios-apellidos').value,
            'dni': document.getElementById('usuarios-dni').value,
            'e_mail': document.getElementById('usuarios-email').value,
            'telefono': document.getElementById('usuarios-telefono').value,
            'cargo': usuario.cargo,
            'vinculacion': usuario.vinculacion
        };
        let url = URL_API_usuarios + 'usuarios'
        let response = await funcionFetch(url, data_dos);
        if(response.ok){
            await actualizarTablaUsuarios();
            alert("Usuario actualizado.");
            document.querySelector(".formulario-general").reset()
        };
    }else if(usuario.clave !== 0 && usuario.clave !== 3){
        alert("Si no es Administrador o Super Administrador primero tiene que desactivar al usuario que quiere editar.")
    };
};

///////////////////////////////////////////////////////////////////////////////////////////
//////////Password/////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
const actualizarPassword = document.getElementById("contrasena_usuario");
actualizarPassword.addEventListener("click", nuevoPassword)
async function nuevoPassword(e) {
    e.preventDefault();
    let data = {
        'id': document.getElementById('usuarios-id').value,
        'passw': document.getElementById('usuarios-password').value
    };
    let url = URL_API_usuarios + 'usuarios_passw'
    let response = await funcionFetch(url, data);
    console.log(response.status)
    if(response.ok){
        await actualizarTablaUsuarios();
        alert(`Contraseña del usuario ${data.id} actualizada.`);  
        document.querySelector(".formulario-general").reset()                  
    };
};
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////ACTIVAR TABLA////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
async function activacion(id_usuario){
    let usuario = usuarios_control.find(x => x.id == id_usuario)
    if(usuario.clave === 0 || usuario.clave === 3){
        let respuesta = confirm(`¿Deseas activar al usuario ${usuario.nombres} ${usuario.apellidos} con id: ${usuario.id} y cargo: ${usuario.cargo}?.`)
        if(respuesta){
            function DatosUsuarios(){
                this.id = usuario.id;
                if(usuario.cargo === 201 || usuario.cargo === 200){
                    this.vinculacion = usuario.id;
                }else{
                    this.vinculacion = usuario.vinculacion;
                }
                this.clave = 1;
                this.num_sucursales = usuario.num_sucursales;
                this.num_usuarios = usuario.num_usuarios;
            };
            let filaUsuarios = new DatosUsuarios();
            let url = URL_API_usuarios + 'usuarios_acciones'
            let response = await funcionFetch(url, filaUsuarios);
            console.log(response.status)
            if(response.ok){
                if(usuario.cargo !== 201 && usuario.cargo !== 200){
                    await buscarUsuarioId(usuario.vinculacion)
                    let data_admin ={
                        'id': usuario_admin.id,
                        'vinculacion': usuario_admin.id,
                        'clave': 1,
                        'num_sucursales': usuario_admin.num_sucursales,
                        'num_usuarios': usuario_admin.num_usuarios + 1
                    }
                    let respuesta_admin = await funcionFetch(url, data_admin);
                    console.log(respuesta_admin.status)
                    if(respuesta_admin.ok){
                        alert(`Se aumentó un usuario para el usuario ${usuario_admin.id}`);
                    };
                };
                if(usuario.cargo === 201 && usuario.vinculacion === 0){
                    await activarNumeracion(usuario.id)
                    await activarClienteProveedor(usuario.id)
                    await creacion_suc(usuario)
                };
                await actualizarTablaUsuarios();
                alert("Usuario activado.");
            };
        };
    }else{
        alert(`El usuario ${usuario.nombres} ${usuario.apellidos} con id: ${usuario.id} y cargo: ${usuario.cargo} ya está activado.`);
    };
};
async function desactivacion(id){
    let usuario = usuarios_control.find(x => x.id == id)
    if(usuario.clave === 1){
        let respuesta = confirm(`¿Deseas desactivar al usuario ${usuario.nombres} ${usuario.apellidos} con id: ${usuario.id} y cargo: ${usuario.cargo}?.`)
        if(respuesta){
            function DatosUsuarios(){
                this.id = usuario.id;
                if(usuario.cargo === 201 || usuario.cargo === 200){
                    this.vinculacion = usuario.id;
                }else{
                    this.vinculacion = usuario.vinculacion;
                }
                this.clave = 3;
                this.num_sucursales = usuario.num_sucursales;
                this.num_usuarios = usuario.num_usuarios;
            };
            let filaUsuarios = new DatosUsuarios();
            let url = URL_API_usuarios + 'usuarios_acciones'
            let response = await funcionFetch(url, filaUsuarios);
            console.log(response.status)
            if(response.ok){
                if(usuario.cargo !== 201 && usuario.cargo !== 200){
                    await buscarUsuarioId(usuario.vinculacion)
                    let data_admin = {
                        'id': usuario_admin.id,
                        'vinculacion': usuario_admin.id,
                        'clave': 1,
                        'num_sucursales': usuario_admin.num_sucursales,
                        'num_usuarios': usuario_admin.num_usuarios - 1
                    }
                    let respuesta_admin = await funcionFetch(url, data_admin);
                    console.log(respuesta_admin.status)
                    if(respuesta_admin.ok){
                        alert(`Se disminuyó un usuario para el usuario ${usuario_admin.id}`);
                    };
                };
                await actualizarTablaUsuarios();
                alert("Usuario desactivado.");
            };
        };
    }else{
        alert(`El usuario ${usuario.nombres} ${usuario.apellidos} con id: ${usuario.id} y cargo: ${usuario.cargo} ya está desactivado.`);
    };
};
async function buscarUsuarioId(id_control_admin){
    let url = URL_API_usuarios + `usuarios_busqueda/${id_control_admin}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    usuario_admin = await respuesta.json();
};
//////////////////////////////////////////
function inicioSelectCargo(){
    let cargo_select = document.getElementById("usuarios-cargo")
    document.getElementById("usuarios-vinculacion").value = "No necesita vinculación."
    cargo_select.addEventListener("change", ()=>{
        if(cargo_select.value == 201 || cargo_select.value == 200){
            document.getElementById("usuarios-vinculacion").value = "No necesita vinculación."
        }else{
            document.getElementById("usuarios-vinculacion").value = ""
        }
    });
}
document.getElementById("restablecerForm").addEventListener("click", (e)=>{
    e.preventDefault()
    document.querySelector(".formulario-general").reset()
    document.getElementById("usuarios-vinculacion").value = "No necesita vinculación."
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let sucursales_control = [];
async function conteoSucursales(nombre,estado,ident,inicio,fin){
    let url = URL_API_usuarios + `sucursales_conteo?`+
                                `nombre_sucursal=${nombre}&`+
                                `estado_sucursal=${estado}&`+
                                `ident_sucursal=${ident}&`+
                                `fecha_inicio_sucursal=${inicio}&`+
                                `fecha_fin_sucursal=${fin}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    cantidadFilas_suc = await respuesta.json();
    console.log(cantidadFilas_suc)
    let html = "";
    for(let i = 1; i <= Math.ceil(cantidadFilas_suc/20); i++) {
        let fila = `<option value="${i}">${i}</option>`
        html = html + fila;
    };
    document.querySelector("#numeracionTablaSucursal").innerHTML = html
};
async function searchSucursales(num,nombre,estado,ident,inicio,fin){
    let url = URL_API_usuarios + `sucursales_tabla/${num}?`+
                                `nombre_sucursal=${nombre}&`+
                                `estado_sucursal=${estado}&`+
                                `ident_sucursal=${ident}&`+
                                `fecha_inicio_sucursal=${inicio}&`+
                                `fecha_fin_sucursal=${fin}`
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    sucursales_control = await response.json()
    let html = ''
    if(sucursales_control.length > 0){
        for( sucursal of sucursales_control){
            let fila = `
                    <tr>
                        <td style="text-align: end;">${sucursal.id_sucursales}</td>
                        <td>${sucursal.sucursal_nombre}</td>
                        <td style="text-align: end;">${sucursal.estado}</td>
                        <td style="text-align: end;">${sucursal.identificador}</td>
                        <td>${sucursal.fecha_suc}</td>
                        <td>
                            <a onclick="edit_suc(${sucursal.id_sucursales })" class="boton_editar">E</a>
                            <a onclick="activacion_suc(${sucursal.id_sucursales })" class="boton_editar">Activar</a>
                            <a onclick="desactivacion_suc(${sucursal.id_sucursales })" class="boton_eliminar">Desactivar</a>
                            <a onclick="remove_suc(${sucursal.id_sucursales })" class="boton_eliminar">X</a>
                        </td>
                    </tr>`
            html = html + fila;
        };
        document.querySelector('#tabla-sucursales > tbody').outerHTML = html;
    }else{
        alert("No se encontraron resultados.")
        document.querySelector("#tabla-sucursales > tbody").outerHTML = html;
        document.querySelector("#tabla-sucursales").createTBody()
    };
};
let numeronIncremento_sucursal = 1;
let suma_sucursal = 0;
let inicio_sucursal = 0;
let fin_sucursal = 0;
function avanzarTablaSucursal(){
    document.getElementById("avanzarSucursal").addEventListener("click", () =>{
        if(suma + 20 < cantidadFilas_suc){
            numeronIncremento_sucursal += 1
            suma_sucursal += 20
            document.getElementById("numeracionTablaSucursal").value = numeronIncremento_sucursal
            manejoDeFechasSucursales()
            searchSucursales(suma_sucursal,
                            document.getElementById("filtro-tabla-sucursal-sucursal").value,
                            document.getElementById("filtro-tabla-sucursal-estado").value,
                            document.getElementById("filtro-tabla-sucursal-usuario").value,
                            inicio_sucursal,
                            fin_sucursal)
        };
    });
    document.getElementById("retrocederSucursal").addEventListener("click", () =>{
        if(numeronIncremento_sucursal > 1){
            numeronIncremento_sucursal -= 1
            suma_sucursal -= 20
            document.getElementById("numeracionTablaSucursal").value = numeronIncremento_sucursal
            manejoDeFechasSucursales()
            searchSucursales(suma_sucursal,
                            document.getElementById("filtro-tabla-sucursal-sucursal").value,
                            document.getElementById("filtro-tabla-sucursal-estado").value,
                            document.getElementById("filtro-tabla-sucursal-usuario").value,
                            inicio_sucursal,
                            fin_sucursal)
        };
    });
};
async function actualizarTablaSucursales(){
    manejoDeFechasSucursales()
    await searchSucursales((document.getElementById("numeracionTablaSucursal").value - 1) * 20,
                    document.getElementById("filtro-tabla-sucursal-sucursal").value,
                    document.getElementById("filtro-tabla-sucursal-estado").value,
                    document.getElementById("filtro-tabla-sucursal-usuario").value,
                    inicio_sucursal,
                    fin_sucursal)
}
function atajoTablaSucursales(){
    document.getElementById("numeracionTablaSucursal").addEventListener("change", async ()=>{
        await actualizarTablaSucursales();
        numeronIncremento_sucursal = Number(document.getElementById("numeracionTablaSucursal").value);
        suma_sucursal = (document.getElementById("numeracionTablaSucursal").value - 1) * 20;
    });
};
document.getElementById("restablecerSucursal").addEventListener("click", async () =>{
    document.getElementById("filtro-tabla-sucursal-sucursal").value = ""
    document.getElementById("filtro-tabla-sucursal-estado").value = ""
    document.getElementById("filtro-tabla-sucursal-usuario").value = ""

    await conteoSucursales(document.getElementById("filtro-tabla-sucursal-sucursal").value,
                            document.getElementById("filtro-tabla-sucursal-estado").value,
                            document.getElementById("filtro-tabla-sucursal-usuario").value,
                            '2000-01-01',
                            new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    await searchSucursales(document.getElementById("numeracionTablaSucursal").value - 1,
                            document.getElementById("filtro-tabla-sucursal-sucursal").value,
                            document.getElementById("filtro-tabla-sucursal-estado").value,
                            document.getElementById("filtro-tabla-sucursal-usuario").value,
                            '2000-01-01', new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
});
function manejoDeFechasSucursales(){
    inicio_sucursal = document.getElementById("filtro-tabla-sucursal-fecha-inicio").value;
    fin_sucursal = document.getElementById("filtro-tabla-sucursal-fecha-fin").value;
    if(inicio_sucursal == "" && fin_sucursal == ""){
        inicio_sucursal = '2000-01-01';
        fin_sucursal = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
    }else if(inicio_sucursal == "" && fin_sucursal != ""){
        inicio_sucursal = '2000-01-01';
    }else if(inicio_sucursal != "" && fin_sucursal == ""){
        fin_sucursal = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
    };
};
function filtroSucursales(){
    document.getElementById("buscarFiltrosSucursal").addEventListener("click", async (e)=>{
        e.preventDefault();
        manejoDeFechasSucursales()
        await conteoSucursales(document.getElementById("filtro-tabla-sucursal-sucursal").value,
                            document.getElementById("filtro-tabla-sucursal-estado").value,
                            document.getElementById("filtro-tabla-sucursal-usuario").value,
                            inicio_sucursal,
                            fin_sucursal)
        await searchSucursales(0,
                            document.getElementById("filtro-tabla-sucursal-sucursal").value,
                            document.getElementById("filtro-tabla-sucursal-estado").value,
                            document.getElementById("filtro-tabla-sucursal-usuario").value,
                            inicio_sucursal,
                            fin_sucursal)
        numeronIncremento_sucursal = 1;
        suma_sucursal = 0;
        alert(`Se obtuvieron ${cantidadFilas_suc} registros.`)
    });
};
//////////////////////
async function activacion_suc(id){
    let sucursal_act = sucursales_control.find(x => x.id_sucursales  == id)
    if(sucursal_act.estado === 0 || sucursal_act.estado === 3){
        await buscarUsuarioId(sucursal_act.identificador)
        if(usuario_admin.num_sucursales < 4){
            let data_suc = {
                "id_sucursales": sucursal_act.id_sucursales,
                "estado": 1
            }
            let url = URL_API_usuarios + 'sucursales_edit_control'
            let response = await funcionFetch(url, data_suc);
            console.log("Respuesta sucursales "+response.status)
            if(response.ok){
                let data_admin = {
                    'id': usuario_admin.id,
                    'vinculacion': usuario_admin.id,
                    'clave': 1,
                    'num_sucursales': usuario_admin.num_sucursales + 1,
                    'num_usuarios': usuario_admin.num_usuarios
                }
                let url_admin = URL_API_usuarios + 'usuarios_acciones'
                let respuesta_admin = await funcionFetch(url_admin, data_admin);
                console.log("Respuesta usuarios "+respuesta_admin.status)
                if(respuesta_admin.ok){
                    await actualizarTablaUsuarios();
                    alert(`Se aumentó una sucursal para el usuario ${usuario_admin.id}`);
                };
                await actualizarTablaSucursales();
                alert(`${sucursal_act.sucursal_nombre} activado.`)
            };
        }else{
            alert(`El ususario ${usuario_admin.id} ya presenta el límite máximo de sucursales`)
        };
    };
};
async function desactivacion_suc(id){
    let sucursal_act = sucursales_control.find(x => x.id_sucursales  == id)
    if(sucursal_act.estado === 1 || sucursal_act.estado === 2){
        await buscarUsuarioId(sucursal_act.identificador)
        if(usuario_admin.num_sucursales > 0){
            let data_suc = {
                "id_sucursales": sucursal_act.id_sucursales,
                "estado": 3
            }
            let url = URL_API_usuarios + 'sucursales_edit_control'
            let response = await funcionFetch(url, data_suc);
            console.log("Respuesta sucursales "+response.status)
            if(response.ok){
                let data_admin = {
                    'id': usuario_admin.id,
                    'vinculacion': usuario_admin.id,
                    'clave': 1,
                    'num_sucursales': usuario_admin.num_sucursales - 1,
                    'num_usuarios': usuario_admin.num_usuarios
                }
                let url_admin = URL_API_usuarios + 'usuarios_acciones'
                let respuesta_admin = await funcionFetch(url_admin, data_admin);
                console.log("Respuesta usuarios "+respuesta_admin.status)
                if(respuesta_admin.ok){
                    await actualizarTablaUsuarios();
                    alert(`Se disminuyó una sucursal para el usuario ${usuario_admin.id}`);
                };
                await actualizarTablaSucursales();
                alert(`${sucursal_act.sucursal_nombre} desactivado.`)
            };
        }else{
            alert(`El ususario ${usuario_admin.id} ya presenta el límite mínimo de sucursales`)
        };
    };
};
async function creacion_suc(usuario){
    data = {
        'sucursal_nombre': "Almacén Central",
        'fecha_suc': fechaControl,
        'identificador': usuario.id
    };
    console.log(data)
    let url = URL_API_usuarios + 'sucursales_create_control'
    let response = await funcionFetch(url, data)
    console.log("Respuesta sucursal "+response.status)
    if(response.ok){
        await actualizarTablaSucursales();
        alert(`${data.sucursal_nombre} ha sido creado.`)
    };
};



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////Extraccion de datos en formato csv///////////////////////////////////////
/* let datos_extraccion = [];

let extraccion_ = document.getElementById("extraccion_")
extraccion_.addEventListener("click", async ()=>{
    modal_proceso_abrir("Buscando resultados...", "", "")
    datos_extraccion = await cargarDatos(   `productos_extraccion?`);
    await delay(500)
    modal_proceso_cerrar()
    const csvContent = arrayToCSV(datos_extraccion);
    console.log(csvContent)
    downloadCSV(csvContent, 'dataProductos.csv');
}); */
///////Extraccion de datos en formato csv///////////////////////////////////////
/* let datos_extraccion = [];
let extraccion_ = document.getElementById("extraccion_")
extraccion_.addEventListener("click", async ()=>{
    modal_proceso_abrir("Buscando resultados...", "", "")
    let f_inicio = document.getElementById("_fecha_inicio_").value;
    let f_fin = document.getElementById("_fecha_fin_").value;
    f_inicio === "" ? f_inicio = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate() : "";
    f_fin === "" ? f_fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate() : "";

    datos_extraccion = await cargarDatos(   `entradas_extraccion?`+
                                            `fecha_inicio_entradas=${f_inicio}&`+
                                            `fecha_fin_entradas=${f_fin}`
                                        );
                                        console.log(datos_extraccion)
    await delay(500)
    modal_proceso_cerrar()
    const csvContent = arrayToCSV(datos_extraccion);
    console.log(csvContent)
    downloadCSV(csvContent, 'dataEntradas.csv');
})
//////////CSV////////////////////////////////////////////////////////////////////////////////////////////
///////Extraccion de datos en formato csv///////////////////////////////////////
let datos_extraccion = [];

let extraccion_ = document.getElementById("extraccion_")
extraccion_.addEventListener("click", async ()=>{
    modal_proceso_abrir("Buscando resultados...", "", "")
    let f_inicio = document.getElementById("_fecha_inicio_").value;
    let f_fin = document.getElementById("_fecha_fin_").value;
    f_inicio === "" ? f_inicio = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate() : "";
    f_fin === "" ? f_fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate() : "";

    datos_extraccion = await cargarDatos(   `salidas_extraccion?`+
                                            `fecha_inicio_salidas=${f_inicio}&`+
                                            `fecha_fin_salidas=${f_fin}`
                                        );
    await delay(500)
    modal_proceso_cerrar()
    const csvContent = arrayToCSV(datos_extraccion);
    console.log(csvContent)
    downloadCSV(csvContent, 'dataSalidas.csv');
}); */