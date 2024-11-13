document.addEventListener("DOMContentLoaded", inicioConfiguracion)
function inicioConfiguracion(){
    searchNumeracion();
    searchDatosUsuario();
    searchSucursales();
    searchUsuarios()
    array_btn_pages[14] = 1;
    inicioTablaCategorias()
};
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
let filas_total_bd = {value: 0};
let indice_tabla = {value : 1};
let num_filas_tabla = {value: 0};
let base_datos = {array: []}
async function inicioTablaCategorias(){
    await conteoFilas(subRutaA(), filas_total_bd, indice_tabla, 
                    document.getElementById("numeracionTablaCategorias"), 10)
    await searchDatos(subRutaB(document.getElementById("numeracionTablaCategorias").value - 1), 
                    base_datos,"#tabla-categorias")
    avanzarTabla(document.getElementById("avanzarCategorias"), 
                document.getElementById("retrocederCategorias"), 
                document.getElementById("numeracionTablaCategorias"), 
                num_filas_tabla, indice_tabla, 
                filas_total_bd, 10, 
                base_datos,"#tabla-categorias")
    atajoTabla(document.getElementById("numeracionTablaCategorias"), 10, base_datos, 
                "#tabla-categorias", indice_tabla, num_filas_tabla)
    filtro(document.getElementById("buscarFiltrosCategorias"), 
            indice_tabla, num_filas_tabla, filas_total_bd, 
            document.getElementById("numeracionTablaCategorias"), 10, 
            base_datos, "#tabla-categorias")
    restablecerTabla(document.getElementById("restablecerCategorias"), 
                    indice_tabla, num_filas_tabla, filas_total_bd, 
                    document.getElementById("numeracionTablaCategorias"), 10, base_datos, "#tabla-categorias")
};
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
function subRutaA(){
    return  `categorias_conteo?`+
            `categoria_categorias=${document.getElementById("filtro_tabla_categoria").value}&`+
            `unidad_categorias=${document.getElementById("filtro_tabla_actividad").value}&`+
            `cantidad_categorias=${document.getElementById("filtro_tabla_unidad").value}`
};
function subRutaB(num){ 
    return  `categorias_tabla/${num}?`+
            `categoria_categorias=${document.getElementById("filtro_tabla_categoria").value}&`+
            `unidad_categorias=${document.getElementById("filtro_tabla_actividad").value}&`+
            `cantidad_categorias=${document.getElementById("filtro_tabla_unidad").value}`
};
function cuerpoFilaTabla(e){
    return  `<tr>
                <td class="invisible">${e.id}</td>
                <td class="categoria-configuracion">${e.categoria_nombre}</td>
                <td>${e.unidad_medida}</td>
                <td style="text-align: end;">${e.cantidad_item}</td>
                <td>${e.uno}</td>
                <td>${e.dos}</td>
                <td>${e.tres}</td>
                <td>${e.cuatro}</td>
                <td>${e.cinco}</td>
                <td>${e.seis}</td>
                <td>${e.siete}</td>
                <td>${e.ocho}</td>
                <td>${e.nueve}</td>
                <td>${e.diez}</td>
                <td>${e.once}</td>
                <td>${e.doce}</td>
                <td style="text-align: center;">
                    <div class="tooltip">
                        <span onclick="editCategorias(${e.id})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">edit</span>
                        <span class="tooltiptext">Editar categoría</span>
                    </div>
                    <div class="tooltip">
                        <span onclick="removeCategorias(${e.id}, '${e.categoria_nombre}')" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila">delete</span>
                        <span class="tooltiptext">Eliminar categoría</span>
                    </div>
                </td>
            </tr>`
};
function vaciadoInputBusqueda(){
    document.getElementById("filtro_tabla_categoria").value = ""
    document.getElementById("filtro_tabla_actividad").value = ""
    document.getElementById("filtro_tabla_unidad").value = ""
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let categoria_tabla = [];
async function editCategorias(id) {
    modal_proceso_abrir("Buscando resultados...", "", "")
    categoria_tabla = base_datos.array.find(x => x.id == id)
    await delay(500)
    
    document.getElementById('id-configuracion').value = categoria_tabla.id
    document.getElementById('categoria-configuracion').value = categoria_tabla.categoria_nombre
    document.getElementById('unidad-configuracion').value = categoria_tabla.unidad_medida
    document.getElementById('cantidad_categoria').value = categoria_tabla.cantidad_item
    document.getElementById('uno-configuracion').value = categoria_tabla.uno
    document.getElementById('dos-configuracion').value = categoria_tabla.dos
    document.getElementById('tres-configuracion').value = categoria_tabla.tres
    document.getElementById('cuatro-configuracion').value = categoria_tabla.cuatro
    document.getElementById('cinco-configuracion').value = categoria_tabla.cinco
    document.getElementById('seis-configuracion').value = categoria_tabla.seis
    document.getElementById('siete-configuracion').value = categoria_tabla.siete
    document.getElementById('ocho-configuracion').value = categoria_tabla.ocho
    document.getElementById('nueve-configuracion').value = categoria_tabla.nueve
    document.getElementById('diez-configuracion').value = categoria_tabla.diez
    document.getElementById('once-configuracion').value = categoria_tabla.once
    document.getElementById('doce-configuracion').value = categoria_tabla.doce
    agregarItem();
    modal_proceso_cerrar()
}
let reiniciarConfig = document.getElementById("reiniciar_config");
reiniciarConfig.addEventListener("click", (e)=>{
    e.preventDefault()
    formularioConfiguracionCategorias.reset()
    agregarItem()
})
async function removeCategorias(id, nombre) {
    modal_proceso_abrir(`Eliminar una categoría podría generar problemas en la base de datos, antes de continuar
                        edite la categoría de los productos que se verán afectados. ¿Desea eliminar la categoría "${nombre}"?.`, ``)
    modal_proceso_abrir_botones()
    document.getElementById("si_comprobante").addEventListener("click", async ()=>{
        manejoDeFechas();
        let url = URL_API_almacen_central + 'categorias_remove'
        let data = {
            'id': id,
        };
        let response = await funcionFetchDos(url, data);
        if(response.status === "success"){
            await conteoFilas(subRutaA(), filas_total_bd, indice_tabla, 
                            document.getElementById("numeracionTablaCategorias"), 10)
            await searchDatos(subRutaB(num_filas_tabla.value), base_datos,"#tabla-categorias")
            localStorage.setItem("categoria_consulta", JSON.stringify(await cargarDatos('categorias')))
            modal_proceso_abrir(`${response.message}`)
            modal_proceso_salir_botones()
        };
    });
    document.getElementById("no_salir").addEventListener("click", ()=>{
        modal_proceso_cerrar()
    });
    
};
const registrarCategoria = document.getElementById("registrar-categoria");
registrarCategoria.addEventListener("click", saveCategoria);
async function saveCategoria(e) {
    e.preventDefault();
    if(document.getElementById("categoria-configuracion").value !== "" &&
    Number(document.getElementById("cantidad_categoria").value) !== 0 &&
    Number(document.getElementById("cantidad_categoria").value) > 0){
        modal_proceso_abrir("Procesando el registro!!!.", "")
        let data = {
            "categoria_nombre": document.getElementById('categoria-configuracion').value,
            "unidad_medida": document.getElementById('unidad-configuracion').value,
            "cantidad_item": Number(document.getElementById('cantidad_categoria').value),
            "uno": document.getElementById('uno-configuracion').value,
            "dos": document.getElementById('dos-configuracion').value,
            "tres": document.getElementById('tres-configuracion').value,
            "cuatro": document.getElementById('cuatro-configuracion').value,
            "cinco": document.getElementById('cinco-configuracion').value,
            "seis": document.getElementById('seis-configuracion').value,
            "siete": document.getElementById('siete-configuracion').value,
            "ocho": document.getElementById('ocho-configuracion').value,
            "nueve": document.getElementById('nueve-configuracion').value,
            "diez": document.getElementById('diez-configuracion').value,
            "once": document.getElementById('once-configuracion').value,
            "doce": document.getElementById('doce-configuracion').value,
        };
        
        let id = Number(document.getElementById('id-configuracion').value)
        if (id != '') {
            data.id = id
        };

        let url = URL_API_almacen_central + 'categorias'
        let response = await funcionFetchDos(url, data);
        console.log("Respuesta Categorías "+response.status)
        if(response.status === 'success'){
            await buscarCategoria(data, Number(data.id))
            localStorage.setItem("categoria_consulta", JSON.stringify(await cargarDatos('categorias')))
            cat_db = JSON.parse(localStorage.getItem("categoria_consulta"));
            modal_proceso_abrir(`${response.message}`, "")
            modal_proceso_salir_botones()
            formularioConfiguracionCategorias.reset();
            document.getElementById('id-configuracion').value = "";
            agregarItem()
            await conteoFilas(subRutaA(), filas_total_bd, indice_tabla, 
                            document.getElementById("numeracionTablaCategorias"), 10)
            await searchDatos(subRutaB((document.getElementById("numeracionTablaCategorias").value - 1) * 10), 
                            base_datos,"#tabla-categorias")
        }; 
    }else if(document.getElementById("categoria-configuracion").value === ""){
        modal_proceso_abrir("Digite un nombre para la categoría.", "")
        modal_proceso_salir_botones()
    }else if(Number(document.getElementById("cantidad_categoria").value) === 0 ||
    Number(document.getElementById("cantidad_categoria").value) <= 0){
        modal_proceso_abrir("El número de unidades de medidas debe ser mayor a cero.", "")
        modal_proceso_salir_botones()
    };
};
async function buscarCategoria(objeto, categoria_id){
    if(!isNaN(categoria_id)){// verifica si existe id
        let _medidas = [objeto.uno, objeto.dos, objeto.tres, objeto.cuatro, objeto.cinco, objeto.seis, objeto.siete, objeto.ocho, objeto.nueve, objeto.diez, objeto.once, objeto.doce] 
        let filtro_medidas = _medidas.filter(elemento => elemento.trim() !== "")

        let _medidas_tabla = [categoria_tabla.uno, categoria_tabla.dos, categoria_tabla.tres, categoria_tabla.cuatro, categoria_tabla.cinco, categoria_tabla.seis, 
                            categoria_tabla.siete, categoria_tabla.ocho, categoria_tabla.nueve, categoria_tabla.diez, categoria_tabla.once, categoria_tabla.doce] 
        let filtro_medidas_tabla = _medidas_tabla.filter(elemento => elemento.trim() !== "")

        let base_filtro = inv_db.filter(id => id.categoria === categoria_id)

        let iteracion = 0;
        for(const event of base_filtro){
            for (let j = 0; j < filtro_medidas_tabla.length; j++) {

                if (event.codigo.includes(`-${filtro_medidas_tabla[j]}-`) && filtro_medidas_tabla[j] !== filtro_medidas[j]) {
                    event.codigo = event.codigo.replace(/-.*?-/g, `-${filtro_medidas[j]}-`);
                    event.talla = filtro_medidas[j];
                    let url = URL_API_almacen_central + 'almacen_central_categorias';
                    let response = await funcionFetch(url, event);
                    if (response.ok) {
                        iteracion+=1;
                        modal_proceso_abrir(`Código ${event.codigo} modificado exitosamente.`, "");
                    };
                    break;
                };
            };
        };
        if(iteracion > 0){
            localStorage.setItem("inventarios_consulta", JSON.stringify(base_datos_busqueda));
            inv_db = JSON.parse(localStorage.getItem("inventarios_consulta"));
            modal_proceso_abrir(`Datos actualizados exitosamente.`, "");
            modal_proceso_salir_botones();
        };
    };
};
function agregarItem(){
    let numEspacios = document.querySelectorAll(".num_config");
    for(let i = 0; i < numEspacios.length; i++){
        if(document.getElementById("cantidad_categoria").value > i){
            numEspacios[i].classList.remove("invisible")
        }else{
            numEspacios[i].classList.add("invisible")
            numEspacios[i].value = "";
        };
    };
};
function decrementarCantidad(p){
    let fila = p.closest("div");
    if (Number(fila.children[1].value) > 0) {
        fila.children[1].value = Number(fila.children[1].value) - 1;
        agregarItem()
    };
};
function incrementarCantidad(p){
    let fila = p.closest("div");
    if (Number(fila.children[1].value) < 12) {
        fila.children[1].value = Number(fila.children[1].value) + 1;
        agregarItem()
    }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////NUMERACION//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
async function searchNumeracion(){
    numeracion = await cargarDatos('numeracion_comprobante')
    await delay(500)
    let html = ''
    for(numero of numeracion) {
        let fila = `<tr>
                        <td class="invisible">${numero.id}</td>
                        <td>${numero.compras}</td>
                        <td>${numero.recompras}</td>
                        <td>${numero.transferencias}</td>
                        <td>${numero.ventas}</td>
                        <td>${numero.nota_venta}</td>
                        <td>${numero.boleta_venta}</td>
                        <td>${numero.factura}</td>
                        <td style="text-align: center;">
                            <div class="tooltip">
                                <span onclick="editNumeracion(${numero.id})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">edit</span>
                                <span class="tooltiptext">Editar numeración</span>
                            </div>
                        </td>
                    </tr>`
            html = html + fila;
            document.getElementById("id-datos").value = numero.id
    };
    document.querySelector('#tabla-numeracion > tbody').outerHTML = html
};
async function editNumeracion(id) {
    modal_proceso_abrir("Buscando resultados...", "", "")
    let numero = numeracion.find(x => x.id == id)
    await delay(500)
    document.getElementById('id-numeracion').value = numero.id
    document.getElementById('compras-numeracion').value = numero.compras
    document.getElementById('recompras-numeracion').value = numero.recompras
    document.getElementById('transferencias-numeracion').value = numero.transferencias
    document.getElementById('ventas-numeracion').value = numero.ventas
    document.getElementById('nota-venta-numeracion').value = numero.nota_venta
    document.getElementById('boleta-venta-numeracion').value = numero.boleta_venta
    document.getElementById('factura-numeracion').value = numero.factura
    modal_proceso_cerrar()
}
const registrarNumeracion = document.getElementById("registrar-numeracion");
registrarNumeracion.addEventListener("click", saveNumeracion);
async function saveNumeracion(e) {
    e.preventDefault();
    let data = {
        "id": document.getElementById('id-numeracion').value,
        "compras": document.getElementById('compras-numeracion').value,
        "recompras": document.getElementById('recompras-numeracion').value,
        "transferencias": document.getElementById('transferencias-numeracion').value,
        "ventas": document.getElementById('ventas-numeracion').value,      
        "nota_venta": document.getElementById('nota-venta-numeracion').value,      
        "boleta_venta": document.getElementById('boleta-venta-numeracion').value,      
        "factura": document.getElementById('factura-numeracion').value      
    }
    let url = URL_API_almacen_central + 'numeracion_comprobante'
    let response = await funcionFetchDos(url, data)
    if(response.status === 'success'){
        await searchNumeracion();
        formularioConfiguracionNumeracion.reset();
        modal_proceso_abrir(`${response.message}`, "");
        modal_proceso_salir_botones();

    }
}
async function searchDatosUsuario(){
    datos = await cargarDatos('numeracion_comprobante_datos')
    await delay(500)
    let html = ''
    for(dato of datos) {
        let fila = `<tr>
                        <td class="invisible">${dato.id}</td>
                        <td>${dato.nombre_empresa}</td>
                        <td>${dato.ruc}</td>
                        <td>${dato.direccion}</td>
                        <td>${dato.moneda}</td>
                        <td>${dato.web}</td>
                        <td style="text-align: center;">
                            <div class="tooltip">
                                <span onclick="editNumeracionDatos(${dato.id})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">edit</span>
                                <span class="tooltiptext">Editar datos</span>
                            </div>
                        </td>
                    </tr>`
            html = html + fila;
    };
    document.querySelector('#tabla-numeracion-datos > tbody').outerHTML = html
};
async function editNumeracionDatos(id) {
    modal_proceso_abrir("Buscando resultados...", "", "")
    let dato = datos.find(x => x.id == id)
    await delay(500)
    document.getElementById('id-datos').value = dato.id
    document.getElementById('razon-datos').value = dato.nombre_empresa
    document.getElementById('ruc-datos').value = dato.ruc
    document.getElementById('direccion-datos').value = dato.direccion
    document.getElementById('moneda-datos').value = dato.moneda
    document.getElementById('web-datos').value = dato.web
    modal_proceso_cerrar()
};
const registrarDatos = document.getElementById("registrar-datos");
registrarDatos.addEventListener("click", saveNumeracionDatos);
async function saveNumeracionDatos(e) {
    e.preventDefault();
    let data = {
        "id": document.getElementById('id-datos').value,
        "nombre_empresa": document.getElementById('razon-datos').value,
        "ruc": document.getElementById('ruc-datos').value,
        "direccion": document.getElementById('direccion-datos').value,
        "moneda": document.getElementById('moneda-datos').value,      
        "web": document.getElementById('web-datos').value    
    }
    let url = URL_API_almacen_central + 'numeracion_comprobante_datos'
    let response = await funcionFetch(url, data)
    if(response.status === 'success'){
        searchDatosUsuario();
        localStorage.setItem("datos_negocio", JSON.stringify(await cargarDatos('numeracion_comprobante_datos')))
        neg_db = JSON.parse(localStorage.getItem("datos_negocio"));
        agregarMoneda(document.querySelectorAll(".moneda_cabecera"))
        formularioConfiguracionNumeracionDatos.reset();
        modal_proceso_abrir(`${response.message}`, "");
        modal_proceso_salir_botones();
    }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////USUARIOS//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
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
                        "cargo": document.getElementById("cargo-create-usuario").value,
                        "passw": document.getElementById("password-create-usuario").value,
                        "fecha": generarFecha()
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
            await searchUsuarios()
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
async function searchUsuarios(){
    usuarios = await cargarDatos('usuarios_tabla_local')
    await delay(500)
    let html = ''
    for(usuario of usuarios) {
        let fila = `<tr>
                        <td class="invisible">${usuario.id}</td>
                        <td>${usuario.nombres}</td>
                        <td>${usuario.apellidos}</td>
                        <td>${usuario.dni}</td>
                        <td>${usuario.e_mail}</td>
                        <td>${usuario.telefono}</td>
                        <td class="invisible" style="text-align: end;">${usuario.cargo}</td>
                        <td class="cargo_usuario"></td>
                        <td class="invisible">${usuario.clave}</td>
                        <td>${usuario.fecha}</td>
                        <td style="text-align: center; display: flex; gap: 3px">
                            <div class="tooltip">
                                <span onclick="reproducirUsuario(${usuario.id})" style="font-size: 20px" class="reproducir_usuario myButtonEditar material-symbols-outlined">play_arrow</span>
                                <span class="tooltiptext">Habilitar usuario</span>
                            </div>
                            <div class="tooltip">
                                <span onclick="pausarUsuario(${usuario.id})" style="font-size: 20px" class="pausar_usuario myButtonEditar material-symbols-outlined">pause</span>
                                <span class="tooltiptext">Deshabilitar usuario</span>
                            </div>
                            
                            
                            <div class="tooltip">
                                <span onclick="editUsuarios(${usuario.id})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">edit</span>
                                <span class="tooltiptext">Editar usuario</span>
                            </div>
                            <div class="tooltip">
                                <span onclick="desactivarUsuario(${usuario.id}, '${usuario.nombres} ${usuario.apellidos}')" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila desactivar_usuario">delete</span>
                                <span class="tooltiptext">Eliminar usuario</span>
                            </div>
                            
                            
                        </td>
                    </tr>`
            html = html + fila;
    };
    document.querySelector('#tabla-usuarios-local > tbody').outerHTML = html
    botonesUsuarios()
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
    modal_proceso_cerrar()
}
async function reproducirUsuario(id){
    let usuario = usuarios.find(x => x.id == id)
    if(usuario.cargo !== 201){
        modal_proceso_abrir(`Reanudando usuario`, "")
        data = {
            'id': usuario.id,
            'vinculacion': usu_db.id_usuario,
            'clave': 1,
            'num_sucursales': 0,
            'num_usuarios': 0
        };
        let url = URL_API_almacen_central + 'usuarios_acciones'
        let response = await funcionFetch(url, data)
        if(response.ok){
            await searchUsuarios()
            modal_proceso_abrir(`Usuario reanudado.`, "")
            modal_proceso_salir_botones()
        };
    }else{
        modal_proceso_abrir(`No se puede reanudar al administrador.`, "")
        modal_proceso_salir_botones()
    };
};
async function pausarUsuario(id){
    let usuario = usuarios.find(x => x.id == id)
    if(usuario.cargo !== 201){
        modal_proceso_abrir(`Pausando usuario`, "")
        data = {
            'id': usuario.id,
            'vinculacion': usu_db.id_usuario,
            'clave': 4,
            'num_sucursales': 0,
            'num_usuarios': 0
        };
        let url = URL_API_almacen_central + 'usuarios_acciones'
        let response = await funcionFetch(url, data)
        if(response.ok){
            await searchUsuarios()
            modal_proceso_abrir(`Usuario pausado.`, "")
            modal_proceso_salir_botones()
        };
    }else{
        modal_proceso_abrir(`No se puede pausar al administrador.`, "")
        modal_proceso_salir_botones()
    };
};
async function desactivarUsuario(id, nombre){
    modal_proceso_abrir(`¿Desea eliminar el usuario "${nombre}"?.`, ``)
    modal_proceso_abrir_botones()
    document.getElementById("si_comprobante").addEventListener("click", async ()=>{
        let usuario = usuarios.find(x => x.id == id)
        if(usuario.cargo !== 201){
            modal_proceso_abrir(`Desactivando usuario`, "")
            data = {
                'id': usuario.id,
                'vinculacion': usu_db.id_usuario,
                'clave': 2,
                'num_sucursales': 0,
                'num_usuarios': 0
            };
            let url = URL_API_almacen_central + 'usuarios_acciones'
            let response = await funcionFetch(url, data)
            if(response.ok){
                await searchUsuarios()
                modal_proceso_abrir(`La desactivación de este usuario se aprobará en las siguientes horas.`, "")
                modal_proceso_salir_botones()
            };
        }else{
            modal_proceso_abrir(`No se puede desactivar al administrador.`, "")
            modal_proceso_salir_botones()
        };
    });
    document.getElementById("no_salir").addEventListener("click", ()=>{
        modal_proceso_cerrar()
    });
    
};
function botonesUsuarios(){
    let boton_reproducir = document.querySelectorAll(".reproducir_usuario")
    boton_reproducir.forEach((event)=>{
        if(event.parentNode.parentNode.parentNode.children[8].textContent == 1){
            event.style.background = "var(--boton-dos)"
        }
    });
    let boton_pausar = document.querySelectorAll(".pausar_usuario")
    boton_pausar.forEach((event)=>{
        if(event.parentNode.parentNode.parentNode.children[8].textContent == 4){
            event.style.background = "var(--boton-dos)"
        }
    });
    let mostrarCargo = document.querySelectorAll(".cargo_usuario")
    mostrarCargo.forEach((event)=>{
        let cargos = document.getElementById("cargo-create-usuario").children
        for(let i = 0; i < cargos.length; i++){
            if(event.parentNode.children[6].textContent == cargos[i].value){
                event.textContent = cargos[i].textContent
            }
        };
    });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("agregar_sucursal").addEventListener("click", async (e)=>{
    e.preventDefault();
    let respuesta = confirm(`La tarifa por una sucursal nueva es de USD$8.00 al mes. ¿Desea Continuar?`)
    if(respuesta){
        modal_proceso_abrir(`Creando sucursal.`, "")
        let num_filas = document.querySelector('#tabla_sucursales > tbody').children
        if(num_filas.length < 5){
            
            let sucursal_opcion = "";
            for(let i = 0; i <= num_filas.length; i++){
                if(num_filas.length == i){
                    sucursal_opcion = suc_add[i]
                }
            }
            let data = {
                'sucursal_nombre': sucursal_opcion,
                'fecha_suc': generarFecha()
            };
            let url = URL_API_almacen_central + 'sucursales'
            let response = await funcionFetch(url, data)
            console.log(response.status)
            if(response.ok){
                localStorage.setItem("sucursal_consulta", JSON.stringify(await cargarDatos('sucursales_index')))
                suc_db = JSON.parse(localStorage.getItem("sucursal_consulta"));
                modal_proceso_abrir(`${data.sucursal_nombre} ha sido creado.`, "")
                modal_proceso_salir_botones()
            }
        }else{
            modal_proceso_abrir("Ya se alcanzó el máximo de sucursales.", "")
            modal_proceso_salir_botones()
        };
    };
});
async function searchSucursales(){
    sucursales = await cargarDatos('sucursales')
    await delay(500)
    let html = ''
    for(sucursal of sucursales) {
        let fila = `<tr>
                        <td class="invisible">${sucursal.id_sucursales}</td>
                        <td style="border-left: 7px solid ${CS(sucursal.sucursal_nombre)};">${sucursal.sucursal_nombre}</td>
                        <td class="invisible estado_sucursal">${sucursal.estado}</td>
                        <td></td>
                        <td>${sucursal.fecha_suc}</td>
                        <td style="text-align: center;">
                            <a onclick="activarSucursales(${sucursal.id_sucursales})" class="myButtonEditar">Activar</a>
                            <a onclick="desactivarSucursales(${sucursal.id_sucursales})" class="eliminarTablaFila">Desactivar</a>
                        </td>
                    </tr>`
            html = html + fila;
    };
    document.querySelector('#tabla_sucursales > tbody').outerHTML = html
    estadoDeSucursalesTabla();
};
async function activarSucursales(id){
    let sucursal = sucursales.find(x => x.id_sucursales == id)
    if(sucursal.estado === 3){
        modal_proceso_abrir(`Activando ${sucursal.sucursal_nombre}.`, "")
        data = {
            'id_sucursales': sucursal.id_sucursales,
            'estado': 0,
        };
        let url = URL_API_almacen_central + 'sucursales'
        let response = await funcionFetch(url, data);
        if(response.ok){
            searchSucursales()
            modal_proceso_abrir(`${sucursal.sucursal_nombre} activado.`, "")
            modal_proceso_salir_botones()
        };
    }else if(sucursal.estado === 0 || sucursal.estado === 2){
        modal_proceso_abrir("Hay una solicitud pendiente.", "")
        modal_proceso_salir_botones()
    }else{
        modal_proceso_abrir("Hay una solicitud pendiente.", "")
        modal_proceso_salir_botones()
    };
};
async function desactivarSucursales(id){
    let sucursal = sucursales.find(x => x.id_sucursales == id)
    if(sucursal.estado === 1){
        modal_proceso_abrir(`Desactivando ${sucursal.sucursal_nombre}.`, "")
        data = {
            'id_sucursales': sucursal.id_sucursales,
            'estado': 2,
        };
        let url = URL_API_almacen_central + 'sucursales'
        let response = await funcionFetch(url, data);
        if(response.ok){
            searchSucursales()
            modal_proceso_abrir(`${sucursal.sucursal_nombre} desactivado.`, "")
            modal_proceso_salir_botones()
        };
    }else if(sucursal.estado === 0 || sucursal.estado === 2){
        modal_proceso_abrir("Hay una solicitud pendiente.", "")
        modal_proceso_salir_botones()
    }else{
        modal_proceso_abrir("Esta sucursal ya esta desactivada.", "")
        modal_proceso_salir_botones()
    };
}
function estadoDeSucursalesTabla(){
    let opciones_estado = ["Esperando activación", "Activado", "Esperando desactivación", "Desactivado"]
    document.querySelectorAll(".estado_sucursal").forEach((event)=>{
        for(let i = 0; i < opciones_estado.length; i++){
            if(event.textContent == i){
                event.parentNode.children[3].textContent = opciones_estado[i]
            }
        };
    });
};
/////////////////////////////////////////////////////////
document.getElementById("reiniciar_config").addEventListener("click", ()=>{
    document.getElementById("id-configuracion").value = ""
})
document.getElementById("reset_usuarios").addEventListener("click", ()=>{
    document.getElementById("id_usuarios").value = ""
})
////////////////////////////////////////////////////////////////
//Volcado de datos//////////////////////////////////////////////
let jsonArray = [];
let datos_incorrectos = 0;
function leerArchivo(e){
    jsonArray = [];
    const archivo = e.target.files[0];
    if(!archivo){
        return
    };
    const lector = new FileReader();
    lector.onload = function(e){
        const contenidoCSV = e.target.result;
        convertirCSVaJSON(contenidoCSV);
    };
    lector.readAsText(archivo);
};
function convertirCSVaJSON(contenidoCSV) {
    const lineas = contenidoCSV.split('\n');
    //const cabeceras = lineas[0].split(';').map(campo => campo.replace(/[\r;'",\/\\<>=]|(--)|\/\*/g, ''));
    const cabeceras = ["categoria_nombre",
                       "unidad_medida",
                       "cantidad_item",
                       "uno",
                       "dos",
                       "tres",
                       "cuatro",
                       "cinco",
                       "seis",
                       "siete",
                       "ocho",
                       "nueve",
                       "diez",
                       "once",
                       "doce"];
    
    for (let i = 1; i < lineas.length; i++) {
        const datos = lineas[i].split(';').map(campo => campo.replace(/[\r;'",\/\\<>=]|(--)|\/\*/g, ''));
        if(datos.length === 15){
            const objetoJSON = {};
            for (let j = 0; j < cabeceras.length; j++) {
                if(cabeceras[j] === "cantidad_item" && datos[j] !== ""){
                    objetoJSON[cabeceras[j]] = Number(datos[j]);
                }else if(datos[j] !== ""){
                    objetoJSON[cabeceras[j]] = datos[j];
                }else{
                    objetoJSON[cabeceras[j]] = datos[j];;
                };
            };
            if(objetoJSON.categoria_nombre !== "" && objetoJSON.unidad_medida !== "" &&
            (objetoJSON.unidad_medida == "Comercio" || objetoJSON.unidad_medida == "Servicio") &&
            typeof objetoJSON.cantidad_item === "number" && !isNaN(objetoJSON.cantidad_item)){
                jsonArray.push(objetoJSON);
            }else{
                modal_proceso_abrir(`Existen datos de formato incorrectos. `, "")
                modal_proceso_salir_botones();
                jsonArray = [];
                document.getElementById("carga_archivo").value = "";
                return
            };
        };
    };
};

document.getElementById("carga_archivo").addEventListener("change", leerArchivo);

document.getElementById("volcar_datos").addEventListener("click", (e)=>{
    if(document.querySelector("#carga_archivo").value !== "" && jsonArray.length > 0){
        e.preventDefault();
        comprobarDatosRepetidos()
    }else{
        e.preventDefault()
        modal_proceso_abrir("No existe ningún archivo o los datos de formato son incorrectos.", "")
        modal_proceso_salir_botones()
    };
});

let array_categoria_repetida = [];
function comprobarDatosRepetidos(){
    let _categorias_ = JSON.parse(localStorage.getItem("categoria_consulta"));

    jsonArray.forEach((event)=>{
        let categor = _categorias_.find(y => y.categoria_nombre === event.categoria_nombre);
        if(categor !== undefined){
            array_categoria_repetida.push(categor)
        }
    });
    if(array_categoria_repetida.length === 0){
        volcadoDeDatos();
    }else{
        let categoria = ""
        array_categoria_repetida.forEach((event)=>{
            categoria += `${event.categoria_nombre}, `
            modal_proceso_abrir(`Algunas de las categorías que intenta ingresar ya existen en la "Tabla Categorías": ${categoria}. `+
                                `Asegurese de eliminar las coincidencias antes de volver a hacer el volcado de datos.`, "")
        });
        modal_proceso_salir_botones()
        jsonArray = [];
        document.getElementById("carga_archivo").value = "";
    };
};
async function volcadoDeDatos() {
    function FilaDatos(array){
        this.categoria_nombre = array.categoria_nombre;
        this.unidad_medida = array.unidad_medida;
        this.cantidad_item = array.cantidad_item;
        this.uno = array.uno;
        this.dos = array.dos;
        this.tres = array.tres;
        this.cuatro = array.cuatro;
        this.cinco = array.cinco;
        this.seis = array.seis;
        this.siete = array.siete;
        this.ocho = array.ocho;
        this.nueve = array.nueve;
        this.diez = array.diez;
        this.once = array.once;
        this.doce = array.doce;
    }
    let url = URL_API_almacen_central + 'categorias'
    for(let i = 0; i < jsonArray.length; i++){
        let fila_categoria = new FilaDatos(jsonArray[i])
        let response = await funcionFetch(url, fila_categoria);
        console.log("Respuesta Categorías "+response.status);
        if(response.ok){
            modal_proceso_abrir("Operación completada exitosamente.", "")
            modal_proceso_salir_botones()
        }; 
    };
    inicioTablaCategorias();
    formularioConfiguracionCategorias.reset();
    localStorage.setItem("categoria_consulta", JSON.stringify(await cargarDatos('categorias')))
    jsonArray = [];
    document.getElementById("carga_archivo").value = "";
};
//////////////////////////////////////////////////////////////////////////////////////
//Exportar formato csv
const array_cabecera = {    
                            "NOMBRE DE CATEGORIA": "", 
                            "RUBRO": "", 
                            "NUMERO DE MEDIDAS": "", 
                            "MEDIDA UNO": "", 
                            "MEDIDA DOS": "", 
                            "MEDIDA TRES": "", 
                            "MEDIDA CUATRO": "", 
                            "MEDIDA CINCO": "", 
                            "MEDIDA SEIS": "", 
                            "MEDIDA SIETE": "", 
                            "MEDIDA OCHO": "", 
                            "MEDIDA NUEVE": "", 
                            "MEDIDA DIEZ": "", 
                            "MEDIDA ONCE": "", 
                            "MEDIDA DOCE": ""
                        };

function convertirACSV(datos) {
    const separador = ';';
    const filas = [];

    const encabezados = Object.keys(datos);
    filas.push(encabezados.join(separador));
    const valores = encabezados.map((campo) => datos[campo]);
    filas.push(valores.join(separador));
    return filas.join('\n');
}

function descargarCSV(datos, nombreArchivo) {
    const contenidoCSV = '\uFEFF' + convertirACSV(datos);
    const blob = new Blob([contenidoCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo + '.csv';

    document.body.appendChild(enlace);
    enlace.click();

    document.body.removeChild(enlace);
}
document.getElementById("exportar_formato").addEventListener("click", (e)=>{
    e.preventDefault();
    descargarCSV(array_cabecera, "misCategorias")
});

