document.addEventListener("DOMContentLoaded", inicioUsuarios)
async function inicioUsuarios(){
    searchUsuarios(true) 

    array_btn_pages[14] = 1;
    await cargarDatosAnio()
    await inicioTablasAsistencias()
    await graficoClientes()
};

function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        anio_principal = anio_referencia.value;

        graficoClientes()
        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};
let usuarios = []
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
let filas_total_bd = {value: 0};
let indice_tabla = {value : 1};
let num_filas_tabla = {value: 0};

let base_datos = {array: []}
let reporte_ = [];

let horas_laborales = 8;
async function inicioTablasAsistencias(){
    
    await conteoFilas(  subRutaA(0), filas_total_bd, indice_tabla, 
                        document.getElementById("numeracionTablaAsistencia"), 20)
    await searchDatos(  subRutaB(document.getElementById("numeracionTablaAsistencia").value - 1, 0), 
                        base_datos, "#tabla-asistencias")
    avanzarTabla(   document.getElementById("avanzarAsistencia"), 
                    document.getElementById("retrocederAsistencia"), 
                    document.getElementById("numeracionTablaAsistencia"), 
                    num_filas_tabla, indice_tabla, 
                    filas_total_bd, 20, 
                    base_datos, "#tabla-asistencias")
    atajoTabla( document.getElementById("numeracionTablaAsistencia"), 20, base_datos, 
                 "#tabla-asistencias", indice_tabla, num_filas_tabla)
    filtro( document.getElementById("buscarFiltrosAsistencias"), 
            indice_tabla, num_filas_tabla, filas_total_bd, 
            document.getElementById("numeracionTablaAsistencia"), 20, 
            base_datos, "#tabla-asistencias")
    restablecerTabla(   document.getElementById("restablecerAsistencias"), 
                        indice_tabla, num_filas_tabla, filas_total_bd, 
                        document.getElementById("numeracionTablaAsistencia"), 20, base_datos,  "#tabla-asistencias")
};
function subRutaA(index){
    let fecha_inicio = ['2000-01-01', inicio]
    let fecha_fin = [new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(), fin]  
    return  `asistencias_conteo?`+
            `nombres_usuarios=${document.getElementById("filtro-tabla-asistencias-nombre").value}&`+
            `apellidos_usuarios=${document.getElementById("filtro-tabla-asistencias-apellidos").value}&`+
            `sucursal_usuarios=${document.getElementById("filtro-tabla-asistencias-sucursal").value}&`+
            `fecha_inicio_usuarios=${fecha_inicio[index]}&`+
            `fecha_fin_usuarios=${fecha_fin[index]}`
};
function subRutaB(num, index){
    let fecha_inicio = ['2000-01-01', inicio]
    let fecha_fin = [new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(), fin]  
    return  `asistencias_tabla/${num}?`+
            `nombres_usuarios=${document.getElementById("filtro-tabla-asistencias-nombre").value}&`+
            `apellidos_usuarios=${document.getElementById("filtro-tabla-asistencias-apellidos").value}&`+
            `sucursal_usuarios=${document.getElementById("filtro-tabla-asistencias-sucursal").value}&`+
            `fecha_inicio_usuarios=${fecha_inicio[index]}&`+
            `fecha_fin_usuarios=${fecha_fin[index]}`
};
function cuerpoFilaTabla(e){
    let horas_laboradas = ((new Date(e.formato_salida) - new Date(e.formato_entrada))/(1000*60*60)).toFixed(2)
    return  `<tr class="busqueda-nombre">
                <td style="text-align: left;">${e.sucursal_nombre}</td>
                <td style="text-align: left;">${e.nombres} ${e.apellidos}</td>
                <td style="text-align: center;">${e.hora_entrada}</td>
                <td style="text-align: center;">${e.hora_salida}</td>
                <td style="text-align: right;">${(e.salario/30/horas_laborales).toFixed(2)}</td>
                <td style="text-align: right;">${horas_laboradas > 0 ? horas_laboradas: '0.00'}</td>
                <td style="text-align: center;width: 100px">
                    <div class="tooltip">
                        <span onclick="edit(${e.id_asistencia})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">edit</span>
                        <span class="tooltiptext">Editar asistencia</span>
                    </div>
                    <div class="tooltip">
                        <span onclick="accionRemove(${e.id_asistencia}, '${e.colaborador}')" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila">delete</span>
                        <span class="tooltiptext">Eliminar asistencia</span>
                    </div>
                </td>
            </tr>`
};
function vaciadoInputBusqueda(){
    document.getElementById("filtro-tabla-asistencias-nombre").value = ""
    document.getElementById("filtro-tabla-asistencias-apellidos").value = ""
    document.getElementById("filtro-tabla-asistencias-sucursal").value = ""
    document.getElementById("_fecha_inicio_").value = ""
    document.getElementById("_fecha_fin_").value = ""
};

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

const registro = document.getElementById('formulario-create-usuarios');
registro.addEventListener('submit',async (event)=>{
    event.preventDefault();
    if(document.getElementById("password-create-usuario").value === document.getElementById("password-confirmar-create-usuario").value &&
    expregul.cliente.test(document.getElementById("nombres-create-usuario").value) &&
    expregul.cliente.test(document.getElementById("apellidos-create-usuario").value) &&
    expregul.dni.test(document.getElementById("dni-create-usuario").value) &&
    expregul.email.test(document.getElementById("email-create-usuario").value) &&
    expregul.telefono.test(document.getElementById("telefono-create-usuario").value) &&
    expregul.password.test(document.getElementById("password-create-usuario").value)){
        
        let data = {
                        "nombres": document.getElementById("nombres-create-usuario").value,
                        "apellidos": document.getElementById("apellidos-create-usuario").value,
                        "dni": document.getElementById("dni-create-usuario").value,
                        "e_mail": document.getElementById("email-create-usuario").value,
                        "telefono": document.getElementById("telefono-create-usuario").value,
                        "cargo": Number(document.getElementById("cargo-create-usuario").value),
                        "passw": document.getElementById("password-create-usuario").value,
                        "fecha": generarFecha(),
                        "salario_usu": document.getElementById("salario-create-usuario").value,
                        "afp_onp": document.getElementById("pension-create-usuario").checked,
                        "asig_fam": document.getElementById("asigFam-create-usuario").checked,
                        "salud": document.getElementById("salud-create-usuario").checked,
                    }
        let id = document.getElementById('id_usuarios').value
        let response = ""
        let url = URL_API_almacen_central + 'registroInterno'
        if(id != ''){
            modal_proceso_abrir("Editando usuario!!!.", "")
            data.id = id
            response = await funcionFetchDos(url, data);
        }else{
            let respuesta = confirm(`La tarifa de un nuevo usuario es de USD$ 2.00 por mes. ¿Desea continuar?.`)
            if(respuesta){
                modal_proceso_abrir("Registrando usuario.", "")
                if(data.cargo != 201){
                    response = await funcionFetchDos(url, data);
                }else{
                    modal_proceso_abrir("No se puede crear un usuario con cargo de administrador.", "")
                    modal_proceso_salir_botones()
                }
            };
        };
        if(response.status === 'success'){
            await searchUsuarios(true)
            modal_proceso_abrir(`${response.message}`, "")
            modal_proceso_salir_botones()
            document.getElementById("formulario-create-usuarios").reset()
            document.getElementById("id_usuarios").value = ""
            document.getElementById("nombres-create-usuario").style.background =""
            document.getElementById("apellidos-create-usuario").style.background =""
            document.getElementById("dni-create-usuario").style.background =""
            document.getElementById("email-create-usuario").style.background =""
            document.getElementById("telefono-create-usuario").style.background =""
            document.getElementById("password-create-usuario").style.background =""
        }else{
            console.log(response.message)
        };
    }else if(document.getElementById("password-create-usuario").value != document.getElementById("password-confirmar-create-usuario").value){
        modal_proceso_abrir("Password y password de confirmación no son iguales.", "")
        modal_proceso_salir_botones()
    }else if(expregul.cliente.test(document.getElementById("nombres-create-usuario").value) == false){
        document.getElementById("nombres-create-usuario").style.background ="#b36659"
    }else if(expregul.cliente.test(document.getElementById("apellidos-create-usuario").value) == false){
        document.getElementById("apellidos-create-usuario").style.background ="#b36659"
    }else if(expregul.dni.test(document.getElementById("dni-create-usuario").value) == false){
        document.getElementById("dni-create-usuario").style.background ="#b36659"
    }else if(expregul.email.test(document.getElementById("email-create-usuario").value) == false){
        document.getElementById("email-create-usuario").style.background ="#b36659"
    }else if(expregul.telefono.test(document.getElementById("telefono-create-usuario").value) == false){
        document.getElementById("telefono-create-usuario").style.background ="#b36659"
    }else if(expregul.password.test(document.getElementById("password-create-usuario").value) == false){
        document.getElementById("password-create-usuario").style.background ="#b36659"
    };
});
async function searchUsuarios(num){
    if(num === true){
        usuarios = await cargarDatos('usuarios_tabla_local')
    }
    let cargos = document.getElementById("cargo-create-usuario").children
    await delay(500)
    let html = ''
    for(usuario of usuarios) {
        let cargo = ''
        for(let i = 0; i < cargos.length; i++){
            if(usuario.cargo === Number(cargos[i].value)){
                cargo = cargos[i].textContent
            }
        };
        let fila = `<tr>
            <td>${usuario.nombres} ${usuario.apellidos}</td>
            <td>${usuario.dni}</td>
            <td>${usuario.e_mail}</td>
            <td>${usuario.telefono}</td>
            <td class="cargo_usuario">${cargo}</td>
            <td>${usuario.fecha}</td>
            <td style="display: flex; gap: 3px; justify-content: center; align-items:center;">
                <div class="tooltip">
                    <span 
                        onclick="reproducirUsuario(${usuario.id})" 
                        style="font-size: 20px; background: ${usuario.clave === 1? 'var(--boton-cuatro)': ''}" 
                        class="reproducir_usuario myButtonEditar material-symbols-outlined"
                    >
                        play_arrow
                    </span>
                    <span class="tooltiptext">Habilitar usuario</span>
                </div>
                <div class="tooltip">
                    <span 
                        onclick="pausarUsuario(${usuario.id})" 
                        style="font-size: 20px; background: ${usuario.clave === 4? 'var(--boton-cuatro)': ''}" 
                        class="pausar_usuario myButtonEditar material-symbols-outlined"
                    >
                        pause
                    </span>
                    <span class="tooltiptext">Deshabilitar usuario
                    </span>
                </div>
                <div class="tooltip">
                    <span onclick="editUsuarios(${usuario.id})" style="font-size:20px;" class="material-symbols-outlined myButtonEditar">edit</span>
                    <span class="tooltiptext">Editar usuario</span>
                </div>
                <div class="tooltip">
                    <span onClick="reporteRemuneracion(${usuario.id})" style="font-size:20px;" class="material-symbols-outlined myButtonEditar">description</span>
                    <span class="tooltiptext">Reporte de remuneración</span>
                </div>
                <div class="tooltip">
                    <span onclick="desactivarUsuario(${usuario.id}, '${usuario.nombres} ${usuario.apellidos}')" style="font-size:20px;" class="material-symbols-outlined eliminarTablaFila desactivar_usuario">delete</span>
                    <span class="tooltiptext">Eliminar usuario</span>
                </div>
            </td>
        </tr>`
            html = html + fila;
    };
    document.querySelector('#tabla-usuarios-local > tbody').outerHTML = html;
};
async function editUsuarios(id) {
    modal_proceso_abrir("Buscando resultados...", "", "")
    let usuario = usuarios.find(x => x.id == id)
    await delay(500)
    document.getElementById('id_usuarios').value = usuario.id
    document.getElementById('nombres-create-usuario').value = usuario.nombres
    document.getElementById('apellidos-create-usuario').value = usuario.apellidos
    document.getElementById('dni-create-usuario').value = usuario.dni
    document.getElementById('email-create-usuario').value = usuario.e_mail
    document.getElementById('telefono-create-usuario').value = usuario.telefono
    document.getElementById('cargo-create-usuario').value = usuario.cargo
    document.getElementById('salario-create-usuario').value = usuario.salario_usu
    document.getElementById('asigFam-create-usuario').checked = usuario.asig_fam
    document.getElementById('pension-create-usuario').checked = usuario.afp_onp
    document.getElementById('salud-create-usuario').checked = usuario.salud
    modal_proceso_cerrar()
}
async function reproducirUsuario(id){

    let usuario = usuarios.find(x => x.id == id)
    if(usuario.cargo === 201){
        console.log(usuario.cargo)
        modal_proceso_abrir(`No se puede reanudar al administrador.`, "");
        modal_proceso_salir_botones();
        return
    }
    if(usuario.clave === 4){// se ejecuta solo si el usuario esta pausado
        let sucursal_asistencia = ""
        if(usuario.cargo > 4){// tener cuidado con el numero de sucursales
            sucursal_asistencia = suc_db.find(x => x.sucursal_nombre === suc_add[usuario.cargo - 5])
        }else{
            sucursal_asistencia = suc_db.find(x => x.sucursal_nombre === suc_add[usuario.cargo])
        }

        modal_proceso_abrir(`Reanudando usuario`, "")
        let data = {
            'clave': 1,
            'colaborador': usuario.id,
            'hora_entrada': generarFecha(),
            'sucursal': sucursal_asistencia.id_sucursales,
            'salario': 0,
        }
        let url = URL_API_almacen_central + 'usuarios_estado'
        let response = await funcionFetchDos(url, data)
        if(response.status == 'success'){
            usuario.clave = 1;
            await searchUsuarios(false)

            manejoDeFechas();
            await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                            document.getElementById("numeracionTablaAsistencia"), 20)
            await searchDatos(subRutaB(num_filas_tabla.value, 1), base_datos, "#tabla-asistencias")

            modal_proceso_abrir(`Hora de entrada de ${usuario.nombres} ${usuario.apellidos} se registró a: ${generarFecha()}`, "")
            modal_proceso_salir_botones()
        };
    }else{
        
        modal_proceso_abrir(`El usuario ${usuario.nombres} ${usuario.apellidos} ya se encuentra reanudado`, "")
        modal_proceso_salir_botones()
    }
};
function tratamientoSalario(id){
    let colaborador_data = usuarios.find(x=> x.id === id)
    let remun_asig_fam = colaborador_data.asig_fam ? colaborador_data.salario_usu * 1.1: colaborador_data.salario_usu;
    let remun_afp_onp = colaborador_data.afp_onp ? remun_asig_fam * 0.13: 0;
    let remun_essalud = colaborador_data.salud ? remun_asig_fam * 0.09: 0;

    return remun_asig_fam - (remun_afp_onp + remun_essalud);
};
async function pausarUsuario(id){
    let usuario = usuarios.find(x => x.id == id)
    if(usuario.cargo === 201){
        console.log(usuario.cargo)
        modal_proceso_abrir(`No se puede pausar al administrador.`, "");
        modal_proceso_salir_botones();
        return
    }
    if(usuario.clave === 1){// se ejecuta solo si el usuario esta activado
        let colaborador = await cargarDatos(`asistencia_busqueda/${usuario.id}`)//buscamos en la db la asistencia
        modal_proceso_abrir(`Pausando usuario`, "")
        data = {
            'clave': 4,
            'colaborador': usuario.id,
            'id_asistencia': colaborador.id_asistencia,
            'hora_salida': generarFecha(),
            'salario': tratamientoSalario(usuario.id),
        }
        let url = URL_API_almacen_central + 'usuarios_estado'
        let response = await funcionFetchDos(url, data)
        if(response.status == 'success'){
            usuario.clave = 4;
            await searchUsuarios(false)

            manejoDeFechas();
            await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                            document.getElementById("numeracionTablaAsistencia"), 20)
            await searchDatos(subRutaB(num_filas_tabla.value, 1), base_datos, "#tabla-asistencias")
            modal_proceso_abrir(`Hora de salida de ${usuario.nombres} ${usuario.apellidos} se registró a: ${generarFecha()}`, "")
            modal_proceso_salir_botones()
        };
    }else{
        modal_proceso_abrir(`El usuario ${usuario.nombres} ${usuario.apellidos} ya se encuentra pausado`, "")
        modal_proceso_salir_botones()
    }
};
async function desactivarUsuario(id, nombre){
    modal_proceso_abrir(`¿Desea eliminar el usuario "${nombre}"?.`, ``)
    modal_proceso_abrir_botones()
    document.getElementById("si_comprobante").addEventListener("click", async ()=>{
        let usuario = usuarios.find(x => x.id == id)
        if(usuario.cargo === 201){
            console.log(usuario.cargo)
            modal_proceso_abrir(`No se puede eliminar al administrador.`, "");
            modal_proceso_salir_botones();
            return
        }
        modal_proceso_abrir(`Desactivando usuario`, "")
        data = {
            'id': usuario.id,
        };
        let url = URL_API_almacen_central + 'usuarios_remove'
        let response = await funcionFetchDos(url, data)
        if(response.status = 'success'){
            await searchUsuarios(true)
            modal_proceso_abrir(`${response.message}`, "")
            modal_proceso_salir_botones()
        };
    });
    document.getElementById("no_salir").addEventListener("click", ()=>{
        modal_proceso_cerrar()
    });
    
};

document.getElementById("reset_usuarios").addEventListener("click", ()=>{
    document.getElementById("id_usuarios").value = ""
})

async function edit(id){
    modal_proceso_abrir("Buscando resultados...", "", "")
    
    let asistencia_ = base_datos.array.find(y => y.id_asistencia == id)// obtenemos los datos de la fila
    await delay(500)
    modal_proceso_cerrar()
    modalAcciones(asistencia_, "Modificar asistencia");
    document.getElementById("acciones_rapidas").classList.add("modal-show")
}

function modalAcciones(objeto, titulo){
    let html = `<div id="form_accion_rapida" class="nuevo-contenedor-box">
                    <h2 style="text-align: center;">${titulo}</h2>
                    <table class="tabla_modal contenido-tabla">
                        <thead>
                            <tr>
                                <th style="width: 120px;">Colaborador</th>
                                <th style="width: 120px;">Sucursal</th>
                                <th style="width: 200px;">Hora de entrada</th>
                                <th style="width: 200px;">Hora de salida</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="width: 120px; text-align: center;">${objeto.nombres} ${objeto.apellidos}</td>
                                <td style="width: 120px; text-align: center;">${objeto.sucursal_nombre}</td>
                                <td style="width: 200px; text-align: center;">
                                    ${objeto.hora_entrada}
                                    <input id="edit_hora_entrada" type="datetime-local" value='${generarFechaDos(objeto.formato_entrada, 5)}'>
                                </td>
                                <td style="width: 200px; text-align: center;">
                                    ${objeto.hora_salida}
                                    <input id="edit_hora_salida" type="datetime-local" value='${generarFechaDos(objeto.formato_salida, 5)}'>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br>
                    <div id="contenedor_botones_asistencias" style="display: flex;justify-content: center;">
                        <button class="myButtonAgregar" onCLick="procesarEdicion(${objeto.id_asistencia})">Procesar</button>
                        <button class="myButtonEliminar" onClick="removerContenido()">Cancelar</button>
                    </div>
                </div>`;
    document.getElementById("acciones_rapidas").innerHTML = html;
}
function removerContenido(){
    let contenido = document.getElementById("form_accion_rapida")
    contenido.remove();
    document.getElementById("acciones_rapidas").classList.remove("modal-show")
};
async function procesarEdicion(id){
    let data = {
        'id_asistencia': id,
        'hora_entrada': document.getElementById('edit_hora_entrada').value,
        'hora_salida': document.getElementById('edit_hora_salida').value,
    }
    let url = URL_API_almacen_central + 'edit_asistencias'
    let response_edit = await funcionFetchDos(url, data)
    if(response_edit.status = 'success'){
        manejoDeFechas();
        await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                        document.getElementById("numeracionTablaAsistencia"), 20)
        await searchDatos(subRutaB(num_filas_tabla.value, 1), base_datos, "#tabla-asistencias")
    
        modal_proceso_abrir(`${response_edit.message}.`, "")
        modal_proceso_salir_botones()
        removerContenido();
    };
};
function generarFechaDos(dato, correccion_zona){
    const fecha = new Date(dato); 
    const dia = String(fecha.getDate()).padStart(2, '0'); // Asegura que el día tenga dos dígitos 
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Asegura que el mes tenga dos dígitos 
    const anio = fecha.getFullYear();
    const hora = String(fecha.getHours() + correccion_zona).padStart(2, '0')
    const minuto = String(fecha.getMinutes()).padStart(2, '0')
    const segundo = String(fecha.getSeconds()).padStart(2, '0')
    return `${anio}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
};
//ELIMINAR Asistencia

async function accionRemove(id) {
    modal_proceso_abrir("Buscando resultados...", "", "")
    let asistencia_ = base_datos.array.find(y => y.id_asistencia == id)// obtenemos los datos de la fila
    await delay(500)
    modal_proceso_cerrar()
    modalRemove(asistencia_, "Eliminar asistencia");
    document.getElementById("acciones_rapidas").classList.add("modal-show")
};

async function procesarRemove(id){
    modal_proceso_abrir("Eliminando asistencia...", "", "")
    await delay(500)
    let url = URL_API_almacen_central + 'asistencias_remove'
    let data = {
        'id_asistencia': id
    };
    let response = await funcionFetchDos(url, data);
    if(response.status === "success"){
        manejoDeFechas();
        await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                        document.getElementById("numeracionTablaAsistencia"), 20)
        await searchDatos(subRutaB(num_filas_tabla.value, 1), base_datos, "#tabla-asistencias")
    
        modal_proceso_abrir(`${response.message}.`, "")
        modal_proceso_salir_botones()
        removerContenido();
    };
};
function modalRemove(objeto, titulo){
    let html = `<div id="form_accion_rapida" class="nuevo-contenedor-box">
                    <h2 style="text-align: center;">${titulo}</h2>
                    <table class="tabla_modal contenido-tabla">
                        <thead>
                            <tr>
                                <th style="width: 120px;">Colaborador</th>
                                <th style="width: 120px;">Sucursal</th>
                                <th style="width: 200px;">Hora de entrada</th>
                                <th style="width: 200px;">Hora de salida</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td id="id_edit_asistencias" class="invisible">${objeto.id_asistencia}</td>
                                <td style="width: 120px; text-align: center;">${objeto.nombres} ${objeto.apellidos}</td>
                                <td style="width: 120px; text-align: center;">${objeto.sucursal_nombre}</td>
                                <td style="width: 200px; text-align: center;">${objeto.hora_entrada}</td>
                                <td style="width: 200px; text-align: center;">${objeto.hora_salida}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br>
                    <div id="contenedor_botones_asistencias" style="display: flex;justify-content: center;">
                        <button class="myButtonAgregar" onCLick="procesarRemove(${objeto.id_asistencia})">Procesar</button>
                        <button class="myButtonEliminar" onClick="removerContenido()">Cancelar</button>
                    </div>
                </div>`;
    document.getElementById("acciones_rapidas").innerHTML = html;
}
async function reporteRemuneracion(id){
    modal_proceso_abrir("Buscando resultados...", "", "")
    let remuneracion = await cargarDatos(`asistencia_remuneracion/${id}?year_actual=${anio_referencia.value}`)
    await delay(500)
    modal_proceso_cerrar()
    modalRemuneracion(remuneracion, id, anio_referencia.value)
    document.getElementById("acciones_rapidas").classList.add("modal-show")
}
async function modalRemuneracion(remuneracion, id, anio){
    
    let usuario = usuarios.find(x => x.id == id)

    let html = `<div id="form_accion_rapida" class="nuevo-contenedor-box">
                    <h2 style="text-align: center;">Reporte de remuneración de ${usuario.nombres} ${usuario.apellidos}</h2>
                    <table class="tabla_modal contenido-tabla">
                        <thead>
                            <tr>
                                <th style="width: 80px;">Fecha</th>
                                <th style="width: 80px;">Remuneración base</th>
                                <th style="width: 80px;">Asignación familiar (+10%)</th>
                                <th style="width: 80px;">AFP / ONP (-13%)</th>
                                <th style="width: 80px;">EsSalud (-9%)</th>
                                <th style="width: 80px;">Remuneración Neta</th>
                                <th style="width: 80px;">Horas laboradas</th>
                                <th style="width: 80px;">Horas extras</th>
                                <th style="width: 80px;">Remuneracion sobretiempo</th>
                                <th style="width: 80px;">Total remuneracion</th>
                            </tr>
                        </thead>`
    remuneracion.forEach(element => {
        let asignacion_familiar = usuario.asig_fam === 1 ? usuario.salario_usu * 0.1 : 0;
        let afp_onp = usuario.afp_onp === 1 ? (usuario.salario_usu + asignacion_familiar) * 0.13 : 0;
        let essalud = usuario.salud === 1 ? (usuario.salario_usu + asignacion_familiar) * 0.09 : 0;

        let remuneracion_neto = usuario.salario_usu + asignacion_familiar - afp_onp - essalud;
        let valor_hora_ordinario = Number(remuneracion_neto)/192;
        let remuneracion_ordinaria = Number(element.horas_laboradas) <= 192 ? Number(element.horas_laboradas) * valor_hora_ordinario : remuneracion_neto;

        let valor_hora_sobretiempo = remuneracion_neto/30/8;
        let numero_horas_sobretiempo = Number(element.horas_laboradas) > 192 ? Number(element.horas_laboradas) - 192 : 0;
        let h_dos = 0;
        let sobretiempo_dos_horas = 0
        let h_tres = 0;
        let sobretiempo_mas_tres_horas = 0
        if(numero_horas_sobretiempo > 0 && numero_horas_sobretiempo < 3){
            h_dos = numero_horas_sobretiempo;
            sobretiempo_dos_horas = h_dos * valor_hora_sobretiempo * 1.25
        }
        if(numero_horas_sobretiempo >= 3){
            h_dos = 2;
            h_tres = numero_horas_sobretiempo - 2;
            sobretiempo_dos_horas = h_dos * valor_hora_sobretiempo * 1.25
            sobretiempo_mas_tres_horas = h_tres * valor_hora_sobretiempo * 1.35
        }
        
            html +=     `<tbody>
                            <tr>
                                <td style="width: 80px; text-align: center;">${meses_letras[element.mes-1]}-${anio}</td>
                                <td style="width: 80px; text-align: center;">${usuario.salario_usu}</td>
                                <td style="width: 80px; text-align: center;">${asignacion_familiar}</td>
                                <td style="width: 80px; text-align: center;">${afp_onp}</td>
                                <td style="width: 80px; text-align: center;">${essalud}</td>
                                <td style="width: 80px; text-align: center;">${remuneracion_neto}</td>
                                <td style="width: 80px; text-align: center;">${Number(element.horas_laboradas).toFixed(2)}</td>
                                <td style="width: 80px; text-align: center;">${numero_horas_sobretiempo}</td>
                                <td style="width: 80px; text-align: center;">${sobretiempo_dos_horas + sobretiempo_mas_tres_horas}</td>
                                <td style="width: 80px; text-align: center;">${(remuneracion_ordinaria + sobretiempo_dos_horas + sobretiempo_mas_tres_horas).toFixed(2)}</td>
                            </tr>
                        </tbody>`
    }); 
    html +=         `</table>
                    <br>
                    <div id="contenedor_botones_asistencias" style="display: flex;justify-content: center;">
                        <button class="myButtonAgregar"  onclick="window.print()">Imprimir</button>
                        <button class="myButtonEliminar" onClick="removerContenido()">Cancelar</button>
                    </div>
                </div>`;
    document.getElementById("acciones_rapidas").innerHTML = html;
}
async function graficoClientes(){
    let response = await cargarDatos(   `asistencia_remuneracion_multiple?`+
                                        `year_actual=${anio_referencia.value}&`+
                                        `month_actual=${new Date().getMonth() + 1}`)

    document.getElementById("contenedor_grafico_usuarios").innerHTML = `<canvas id="grafico_usuarios" class="gradico_anual"></canvas>`

    const labels = response.map(item => `${item.nombres} ${item.apellidos}`);
    const horasLaboradas = response.map(item => Number(item.horas_laboradas));

    const ctx = document.getElementById('grafico_usuarios').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Horas Laboradas`,
                data: horasLaboradas,
                backgroundColor: "rgb(230, 110, 141)",
                borderColor: "rgb(230, 110, 141, 0.2)",
                borderWidth: 1,
                barThickness: 10
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },ticks: {
                        color: '#eee'
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#eee', // Cambiar el color de las etiquetas
                        font: {
                            size: 12, // Cambiar el tamaño de la fuente
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#eee', // Establece el color de los labels en la leyenda
                        font: {
                            size: 18, // Cambiar el tamaño de la fuente
                        }
                    }
                },
            }
        }
    });
};