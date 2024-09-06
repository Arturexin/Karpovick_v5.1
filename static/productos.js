////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////PRODUCTOS///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", inicioProductos)
let sucursales_comparacion = ""

function inicioProductos(){
    inicioTablasProductos()
    btnProductos = 1;
    sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_encabezado"))

    sucursales_comparacion.forEach((event, i)=>{
        sucu_[i] = event.sucursal_nombre
    })
};
let filas_total_bd = {value: 0};
let indice_tabla = {value : 1};
let num_filas_tabla = {value: 0};
let base_datos = {array: []}
let sucu_ = ["", "", "", ""];
async function inicioTablasProductos(){
    await conteoFilas(subRutaA(), filas_total_bd, indice_tabla, 
                        document.getElementById("numeracionTabla"), 20)
    await searchDatos(subRutaB(document.getElementById("numeracionTabla").value - 1), 
                        base_datos,"#tabla-productos")
    avanzarTabla(document.getElementById("avanzar"), 
                document.getElementById("retroceder"), 
                document.getElementById("numeracionTabla"), 
                num_filas_tabla, indice_tabla, 
                filas_total_bd, 20, 
                base_datos,"#tabla-productos")
    atajoTabla(document.getElementById("numeracionTabla"), 20, base_datos, 
                "#tabla-productos", indice_tabla, num_filas_tabla)
    filtro(document.getElementById("buscarFiltrosProductos"), 
            indice_tabla, num_filas_tabla, filas_total_bd, 
            document.getElementById("numeracionTabla"), 20, 
                base_datos, "#tabla-productos")
    restablecerTabla(document.getElementById("restablecerProductos"), 
                    indice_tabla, num_filas_tabla, filas_total_bd, 
                    document.getElementById("numeracionTabla"), 20, base_datos, "#tabla-productos")
    stockSucursales = await cargarDatos(`almacen_central_stock_sucursal`)
    let sucursales_monto = [ stockSucursales[0].almacen_central, 
                        stockSucursales[0].sucursal_uno, 
                        stockSucursales[0].sucursal_dos, 
                        stockSucursales[0].sucursal_tres]
    sucursales_comparacion.forEach((event, i)=>{
        sucu_[i] = event.sucursal_nombre
    })
    graficoDonaColores("circulo_stock_sucursal", "Total Stock", sucursales_monto, ".nombre_circulo_sucursal", ".valor_circulo_sucursal", ".porcentaje_circulo_sucursal",
                    sucu_, colorFondoBarra, "", "")
};
/////////////////////////////////////////////////////////
function subRutaA(){
    return  `almacen_central_conteo?`+
            `categoria_producto=${document.getElementById("filtro-tabla-productos-categoria").value}&`+
            `codigo_producto=${document.getElementById("filtro-tabla-productos-codigo").value}&`+
            `descripcion_producto=${document.getElementById("filtro-tabla-productos-descripcion").value}&`+
            `proveedor_producto=${document.getElementById("filtro-tabla-productos-proveedor").value}`
};
function subRutaB(num){
    return  `almacen_central_tabla/${num}?`+
            `categoria_producto=${document.getElementById("filtro-tabla-productos-categoria").value}&`+
            `codigo_producto=${document.getElementById("filtro-tabla-productos-codigo").value}&`+
            `descripcion_producto=${document.getElementById("filtro-tabla-productos-descripcion").value}&`+
            `proveedor_producto=${document.getElementById("filtro-tabla-productos-proveedor").value}`
};
function cuerpoFilaTabla(e){
    return  `<tr class="busqueda-producto">
                <td class="invisible">${e.idProd}</td>
                <td>${e.categoria_nombre}</td>
                <td>${e.codigo}</td>
                <td>${e.descripcion}</td>
                <td>${e.talla}</td>
                <td style="text-align: end;">${e.existencias_ac}</td>
                <td style="text-align: end;">${e.existencias_su}</td>
                <td style="text-align: end;">${e.existencias_sd}</td>
                <td style="text-align: end;">${e.existencias_st}</td>
                <td style="text-align: end;">${e.costo_unitario.toFixed(2)}</td>
                <td style="text-align: end;">${((e.existencias_ac + 
                                                e.existencias_su + e.existencias_sd + 
                                                e.existencias_st)*e.costo_unitario).toFixed(2)}</td>
                <td style="text-align: end;">${e.precio_venta.toFixed(2)}</td>
                <td style="text-align: end;">${e.lote}</td>
                <td style="width: 100px;">${e.nombre_cli}</td>
                <td style="width: 160px;">
                    <div class="tooltip">
                        <span onclick="editAlmacenCentral(${e.idProd})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">print</span>
                        <span class="tooltiptext">Imprimir código</span>
                    </div>
                    <div class="tooltip">
                        <span onclick="accion_recompras(${e.idProd})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">shopping_cart</span>
                        <span class="tooltiptext">Recompra</span>
                    </div>                    
                    <div class="tooltip">
                        <span onclick="accion_transferencias(${e.idProd})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">move_up</span>
                        <span class="tooltiptext">Transferencia</span>
                    </div>
                    <div class="tooltip">
                        <span onclick="removeAlmacenCentral(${e.idProd})" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila">delete</span>
                        <span class="tooltiptext">Eliminar producto</span>
                    </div>
                </td>
            </tr>`
};

function vaciadoInputBusqueda(){
    document.getElementById("filtro-tabla-productos-categoria").value = ""
    document.getElementById("filtro-tabla-productos-codigo").value = ""
    document.getElementById("filtro-tabla-productos-descripcion").value = ""
    document.getElementById("filtro-tabla-productos-proveedor").value = ""
};
function manejoDeFechas(){
    return ""
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////BOTON ACCIONES/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ELIMINAR PRODUCTO
async function removeAlmacenCentral(idProd) {
    respuestaAlmacen = confirm('¿Estás seguro de eliminarlo?')
    if (respuestaAlmacen) {
        let url = URL_API_almacen_central + 'almacen_central/' + idProd
            await fetch(url, {
            "method": 'DELETE',
            "headers": {
                "Content-Type": 'application/json'
                }
            })
        await conteoFilas(subRutaA(), filas_total_bd, indice_tabla, 
                        document.getElementById("numeracionTabla"), 20)
        await searchDatos(subRutaB(num_filas_tabla.value), base_datos,"#tabla-productos")
        localStorage.setItem("base_datos_consulta", JSON.stringify(await cargarDatos('almacen_central_ccd')))
    };
};
//RECOMPRAS


function formulario_recompras_productos(){
    let formularioRecomprasInventario = `
                                        <div id="form_accion_rapida" class="nuevo-contenedor-box">
                                            <form action="" class="formulario-general fondo">
                                                <h2 id="accion_codigo"></h2>
                                                <input id="accion_id" class="input-general fondo invisible" type="text" disabled>
                                                <label class="label-general">Sucursal origen
                                                    <select name="fffff-sucursal" id="fffff-sucursal" class="input-select-ventas">
                                                    </select>
                                                </label>
                                                <label class="label-general">Existencias<input id="accion_existencias" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades a Recomprar<input id="accion_editar" class="input-general-importante fondo-importante" type="text"></label>
                                                <label class="label-general">Saldo en Origen<input id="accion_saldo" class="input-general fondo" type="text" disabled></label>
                                                <input id="accion_existencias_ac" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_su" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_sd" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_st" class="input-general fondo invisible" type="text" disabled>
                                                <button id="accion_procesar_recompra" class="myButtonAgregar">Procesar Recompra</button>
                                                <button id="remover_accion_rapida" class="myButtonEliminar">Cancelar</button>
                                                <span class="invisible">Holas</span>
                                            </form>
                                        </div>
                                        `;
    document.getElementById("acciones_rapidas").innerHTML = formularioRecomprasInventario;
}
function accion_recompras(id){
    accionCantidadARecomprar()
    let sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_encabezado"))// Obtenemos el id, índice y nombre de las sucursales
    let almacenCentral = base_datos.array.find(y => y.idProd == id)// obtenemos los datos de la fila
    let array_sucursales_existencias = [almacenCentral.existencias_ac, almacenCentral.existencias_su, almacenCentral.existencias_sd, almacenCentral.existencias_st]
    document.getElementById('accion_id').value = almacenCentral.idProd;
    document.getElementById('accion_codigo').textContent = "Recompra: " + almacenCentral.codigo;

    document.getElementById('accion_existencias').value = almacenCentral.existencias_ac;//inicia con datos de la primera sucursal
    sucursal_indice_productos = document.getElementById("fffff-sucursal").selectedIndex;//inicia con datos de la primera sucursal

    document.getElementById("fffff-sucursal").addEventListener("change", ()=>{
        sucursal_indice_productos = document.getElementById("fffff-sucursal").selectedIndex
        array_sucursales_existencias.forEach((event, i)=>{
            if(sucursales_comparacion[i] && 
            document.getElementById("fffff-sucursal")[sucursal_indice_productos].textContent === sucursales_comparacion[i].sucursal_nombre){
                document.getElementById('accion_existencias').value = event;
            }
        })
        document.getElementById('accion_editar').focus();
    })
    document.getElementById('accion_existencias_ac').value = almacenCentral.existencias_ac;
    document.getElementById('accion_existencias_su').value = almacenCentral.existencias_su;
    document.getElementById('accion_existencias_sd').value = almacenCentral.existencias_sd;
    document.getElementById('accion_existencias_st').value = almacenCentral.existencias_st;

    document.getElementById("accion_editar").focus()
    document.getElementById("acciones_rapidas").classList.add("modal-show-producto")
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function accionCantidadARecomprar(){
    formulario_recompras_productos()
    cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))
    removerAccionRapida();
    let editar = document.getElementById("accion_editar");
    editar.addEventListener("keyup", (event)=>{
        document.getElementById("accion_saldo").value = Number(event.target.value) +
                                                        Number(document.getElementById("accion_existencias").value)
    });
    const accionProcesarRecompra = document.getElementById("accion_procesar_recompra");
    accionProcesarRecompra.addEventListener("click", procesamientoInventarioRecompras)
};
async function procesamientoInventarioRecompras(e){
    e.preventDefault();
    if(Number(document.getElementById("accion_editar").value) > 0){
        modal_proceso_abrir("Procesando la recompra!!!.", "")
        try{
            let respuesta_numeracion = await cargarNumeracionComprobante();
            if(respuesta_numeracion.ok){
                await realizarRecompraProductos()
                await conteoFilas(subRutaA(), filas_total_bd, indice_tabla, 
                                document.getElementById("numeracionTabla"), 20)
                await searchDatos(subRutaB((document.getElementById("numeracionTabla").value - 1) * 20), 
                                base_datos,"#tabla-productos")
            }else{
                modal_proceso_abrir("La conexión con el servidor no es buena.", "")
                modal_proceso_salir_botones()
            };
        }catch(error){
            modal_proceso_abrir("Ocurrió un error. " + error, "")
            console.error("Ocurrió un error. ", error)
            modal_proceso_salir_botones()
        };
    }else{
        modal_proceso_abrir("Unidades a recomprar insuficientes.", "")
        modal_proceso_salir_botones()
    }
};
async function realizarRecompraProductos(){
    function DatosDeRecompraProductos(){
        this.idProd = document.getElementById("accion_id").value;
        this.sucursal_post = sucursales_activas[sucursal_indice_productos];
        this.existencias_post = document.getElementById("accion_saldo").value;

        this.comprobante = "Recompra-" + (Number(numeracion[0].recompras) + 1);
        this.existencias_entradas = document.getElementById("accion_editar").value;
        this.sucursal = document.getElementById("fffff-sucursal").value;
        this.fecha = generarFecha();
    };
    let filaProductos = new DatosDeRecompraProductos();
    let url = URL_API_almacen_central + 'procesar_recompra';
    let response = await funcionFetch(url, filaProductos)
    console.log("Respuesta Productos "+response.status)
    if(response.status === 200){
        modal_proceso_abrir("Procesando la recompra!!!.", `Recompra ejecutada.`)
        console.log(`Recompra ejecutada.`)
        await funcionAccionRecompraNumeracion()
    }else{
        modal_proceso_abrir(`Ocurrió un problema`, "")
        modal_proceso_salir_botones()
    };
};
async function funcionAccionRecompraNumeracion(){
    let dataComprobante = {
        "id": numeracion[0].id,
        "compras": numeracion[0].compras,
        "recompras": Number(numeracion[0].recompras) + 1,
        "transferencias": numeracion[0].transferencias,
        "ventas": numeracion[0].ventas,
        "nota_venta": numeracion[0].nota_venta,   
        "boleta_venta": numeracion[0].boleta_venta,   
        "factura": numeracion[0].factura
    };  
    let urlNumeracion = URL_API_almacen_central + 'numeracion_comprobante'
    let response = await funcionFetch(urlNumeracion, dataComprobante)
    console.log("Respuesta Entradas "+response.status)
    if(response.status === 200){
        document.getElementById("form_accion_rapida").remove()
        modal_proceso_abrir("Operación completada exitosamente.", "")
        modal_proceso_salir_botones()
        document.getElementById("acciones_rapidas").classList.remove("modal-show-producto")
    }else{
        modal_proceso_abrir(`Ocurrió un problema Numeración`, "")
        modal_proceso_salir_botones()
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////TRANSFERENCIAS////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let sucursal_indice_productos_origen = 0;
let sucursal_indice_productos_destino = 0;
function accion_transferencias(id) {
    accionCantidadATransferir()
    let sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_encabezado"))// Obtenemos el id, índice y nombre de las sucursales
    let almacenCentral = base_datos.array.find(y => y.idProd == id)
    let array_sucursales_existencias = [almacenCentral.existencias_ac, almacenCentral.existencias_su, almacenCentral.existencias_sd, almacenCentral.existencias_st]
    document.getElementById('accion_id').value = almacenCentral.idProd;
    document.getElementById('accion_codigo').textContent = "Transferencia: " + almacenCentral.codigo;
    document.getElementById('accion_existencias').value = almacenCentral.existencias_ac;//inicia con datos de la primera sucursal
    sucursal_indice_productos_origen = document.getElementById("fffff-sucursal").selectedIndex;//inicia con datos de la primera sucursal

    document.getElementById("fffff-sucursal").addEventListener("change", ()=>{
        sucursal_indice_productos_origen = document.getElementById("fffff-sucursal").selectedIndex
        array_sucursales_existencias.forEach((event, i)=>{
            if(sucursales_comparacion[i] && 
            document.getElementById("fffff-sucursal")[sucursal_indice_productos_origen].textContent === sucursales_comparacion[i].sucursal_nombre){
                document.getElementById('accion_existencias').value = event;
            }
        })
        document.getElementById('accion_editar').focus();
    })
    document.getElementById("accion_existencias_destino").value = almacenCentral.existencias_ac;
    document.getElementById('accion_existencias_ac').value = almacenCentral.existencias_ac;
    document.getElementById('accion_existencias_su').value = almacenCentral.existencias_su;
    document.getElementById('accion_existencias_sd').value = almacenCentral.existencias_sd;
    document.getElementById('accion_existencias_st').value = almacenCentral.existencias_st;

    document.getElementById("accion_editar").focus()
    document.getElementById("acciones_rapidas").classList.add("modal-show-producto")
    accionCambioSucursal(id)
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function formulario_transferencias_productos(){
    let formularioRecomprasInventario = `
                                        <div id="form_accion_rapida" class="nuevo-contenedor-box">
                                            <form action="" class="formulario-general fondo">
                                                <h2 id="accion_codigo"></h2>
                                                <input id="accion_id" class="input-general fondo invisible" type="text" disabled>
                                                <label class="label-general">Sucursal origen
                                                    <select name="fffff-sucursal" id="fffff-sucursal" class="input-select-ventas">
                                                    </select>
                                                </label>
                                                <label class="label-general">Sucursal Destino
                                                    <select id="accion_sucursal_destino" class="input-select-ventas">
                                                    </select>
                                                </label>
                                                <label class="label-general">Existencias<input id="accion_existencias" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades a Transferir<input id="accion_editar" class="input-general-importante fondo-importante" type="text"></label>
                                                <label class="label-general">Saldo en Origen<input id="accion_saldo" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Existencias Destino<input id="accion_existencias_destino" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Saldo en Destino<input id="accion_saldo_dos" class="input-general fondo" type="text" disabled></label>
                                                <input id="accion_existencias_ac" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_su" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_sd" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_st" class="input-general fondo invisible" type="text" disabled>
                                                <button id="accion_procesar_transferencia" class="myButtonAgregar">Procesar Transferencia</button>
                                                <button id="remover_accion_rapida" class="myButtonEliminar">Cancelar</button>
                                            </form>
                                        </div>
                                        `;
    document.getElementById("acciones_rapidas").innerHTML = formularioRecomprasInventario;
};
function accionCantidadATransferir(){
    formulario_transferencias_productos()
    cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))//Sucursal origen
    cargarSucursalesEjecucion(document.getElementById("accion_sucursal_destino"))//Sucursal destino
    removerAccionRapida();
    let editar = document.getElementById("accion_editar");
    editar.addEventListener("keyup", (event)=>{
        document.getElementById("accion_saldo").value = Number(document.getElementById("accion_existencias").value) - 
                                                        Number(event.target.value)
        document.getElementById("accion_saldo_dos").value = Number(event.target.value) +
                                                            Number(document.getElementById("accion_existencias_destino").value)                                                
    });
    const agregarAtablaProductoTres = document.getElementById("accion_procesar_transferencia");
    agregarAtablaProductoTres.addEventListener("click", procesamientoInventarioTransferencias)
};

function accionCambioSucursal(id){
    let sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_encabezado"))// Obtenemos el id, índice y nombre de las sucursales
    let almacenCentral = base_datos.array.find(y => y.idProd == id)
    let array_sucursales_existencias_destino = [almacenCentral.existencias_ac, almacenCentral.existencias_su, almacenCentral.existencias_sd, almacenCentral.existencias_st]

    document.getElementById("accion_existencias_destino").value = almacenCentral.existencias_ac;
    sucursal_indice_productos_destino = document.getElementById("accion_sucursal_destino").selectedIndex;

    document.getElementById("accion_sucursal_destino").addEventListener("change", (event)=>{
        sucursal_indice_productos_destino = event.target.selectedIndex;
        array_sucursales_existencias_destino.forEach((event, i)=>{
            if(sucursales_comparacion[i] && 
            document.getElementById("accion_sucursal_destino")[sucursal_indice_productos_destino].textContent === sucursales_comparacion[i].sucursal_nombre){
                document.getElementById('accion_existencias_destino').value = event;
            }
        })
        document.getElementById("accion_saldo").value = Number(document.getElementById("accion_existencias").value) - 
                                                        Number(document.getElementById("accion_editar").value)
        document.getElementById("accion_saldo_dos").value = Number(document.getElementById("accion_editar").value) +
                                                            Number(document.getElementById("accion_existencias_destino").value)
        document.getElementById("accion_editar").focus()
    });
};

async function procesamientoInventarioTransferencias(e){
    e.preventDefault();
    if(Number(document.getElementById("accion_editar").value) > 0 && 
    document.getElementById("fffff-sucursal").value !== document.getElementById("accion_sucursal_destino").value &&
    document.getElementById("accion_existencias").value >= 0){
        modal_proceso_abrir("Procesando la transferencia!!!.", "")
        try{
            let respuesta_numeracion = await cargarNumeracionComprobante();
            if(respuesta_numeracion.ok){
                await realizarTransferenciaProductos()
                await conteoFilas(subRutaA(), filas_total_bd, indice_tabla, 
                                document.getElementById("numeracionTabla"), 20)
                await searchDatos(subRutaB((document.getElementById("numeracionTabla").value - 1) * 20), 
                                base_datos,"#tabla-productos")
            };
        }catch(error){
            modal_proceso_abrir("Ocurrió un error. ", error, "")
            console.error("Ocurrió un error. ", error)
            modal_proceso_salir_botones()
        };
    }else if(document.getElementById("fffff-sucursal").value === document.getElementById("accion_sucursal_destino").value){
        modal_proceso_abrir("Seleccione una sucursal de destino diferente a la de origen.", "")
        modal_proceso_salir_botones()
    }else if(Number(document.getElementById("accion_editar").value) <= 0){
        modal_proceso_abrir("Unidades a transferir insuficientes.", "")
        modal_proceso_salir_botones()
    }else if(Number(document.getElementById("accion_existencias").value) < 0){
        modal_proceso_abrir("No hay suficientes existencias en sucursal de origen.", "")
        modal_proceso_salir_botones()
    };
};
async function realizarTransferenciaProductos(){
    function DatosDeTransferenciaProductos(){
        this.idProd = document.getElementById("accion_id").value;
        this.sucursal_post = sucursales_activas[sucursal_indice_productos_origen]
        this.existencias_post = document.getElementById("accion_saldo").value;
        this.sucursal_post_dos = sucursales_activas[sucursal_indice_productos_destino]
        this.existencias_post_dos = document.getElementById("accion_saldo_dos").value;

        this.comprobante = "Transferencia-" + (Number(numeracion[0].transferencias) + 1);
        this.cantidad = document.getElementById("accion_editar").value;
        this.id_suc_destino = document.getElementById("accion_sucursal_destino").value;
        this.id_suc_origen = document.getElementById("fffff-sucursal").value;
        this.fecha_tran = generarFecha();
    };
    let filaProductos = new DatosDeTransferenciaProductos();
    let url = URL_API_almacen_central + 'procesar_transferencia'
    let response = await funcionFetch(url, filaProductos)
    console.log("Respuesta Productos "+response.status)
    if(response.status === 200){
        modal_proceso_abrir("Procesando la transferencia!!!.", `Transferencia ejecutada`)
        console.log(`Transferencia ejecutada`)
        await funcionAccionTransferenciaNumeracion()
    }else{
        modal_proceso_abrir(`Ocurrió un problema.`, "")
        modal_proceso_salir_botones()
    };
};
async function funcionAccionTransferenciaNumeracion(){
    let dataComprobante = {
        "id": numeracion[0].id,
        "compras": numeracion[0].compras,
        "recompras": numeracion[0].recompras,
        "transferencias": Number(numeracion[0].transferencias) + 1,
        "ventas": numeracion[0].ventas,
        "nota_venta": numeracion[0].nota_venta,   
        "boleta_venta": numeracion[0].boleta_venta,   
        "factura": numeracion[0].factura
    };    
    let urlNumeracion = URL_API_almacen_central + 'numeracion_comprobante'
    let response = await funcionFetch(urlNumeracion, dataComprobante)
    console.log("Respuesta Numeración "+response.status)
    if(response.status === 200){
        modal_proceso_abrir("Operación completada exitosamente.", "")
        modal_proceso_salir_botones()
        document.getElementById("acciones_rapidas").classList.remove("modal-show-producto")
        document.getElementById("form_accion_rapida").remove()
    }else{
        modal_proceso_abrir(`Ocurrió un problema  Numeración.`, "")
        modal_proceso_salir_botones()
    };
};
/////////////////////////////////////////////////////////////////////////////////////////////

function removerAccionRapida(){
    let remover = document.getElementById("remover_accion_rapida");
    remover.addEventListener("click", (e)=>{
        e.preventDefault();
        document.getElementById("form_accion_rapida").remove()
        document.getElementById("acciones_rapidas").classList.remove("modal-show-producto")
    });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function editAlmacenCentral(id) {
    let almacenCentral = base_datos.array.find(y => y.idProd == id);
    let codigo_Array = Array.from(document.querySelectorAll(".codigo-codigo-barras"));
    let busqueda_repetido = codigo_Array.find(x => x.textContent === almacenCentral.codigo)
    if(busqueda_repetido === undefined){
        let tablaCodigoBarras = document.querySelector("#tabla-codigo-barras > tbody");
        let nueva_fila =    `<tr>
                                <td class="codigo-codigo-barras">${almacenCentral.codigo}</td>
                                <td>${almacenCentral.descripcion}</td>
                                <td>${almacenCentral.precio_venta}</td>
                                <td><input class="input-cantidad-codigo-barras" value="${almacenCentral.existencias_ac + 
                                                                                        almacenCentral.existencias_su + 
                                                                                        almacenCentral.existencias_sd + 
                                                                                        almacenCentral.existencias_st}">
                                </td>
                                <td style="width: 200px;"><img class="inputCodigoBarras"></td>
                                <td style="display: flex;justify-content: center;" class="inputCodigoQr"></td>
                                <td>
                                    <span onclick="eliminarFila(this)" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila">delete</span>
                                </td>
                            </tr>`
                            
        tablaCodigoBarras.innerHTML += nueva_fila;
        generarCodigoBarras()
        generarCodigoQr()
    }else{
        modal_proceso_abrir("El código ya fue ingresado a cola de impresión.", "")
            modal_proceso_salir_botones()
    };
};

function eliminarFila(span){
    let linea = span.closest("tr");
    linea.remove();
}
function generarCodigoBarras(){
   document.querySelectorAll(".codigo-codigo-barras").forEach((event) => {
        JsBarcode(event.parentNode.children[4].children[0], event.textContent, {
            format: "CODE128",
            displayValue: false
        });
    }); 
};
function generarCodigoQr(){
    const contenedorQR = document.querySelectorAll(".inputCodigoQr");
        new QRCode(contenedorQR[contenedorQR.length - 1], {
            text :  `${contenedorQR[contenedorQR.length - 1].parentNode.children[0].textContent}
                    `,
            width: 80,
            height: 80,
            colorDark : "rgba(1, 17, 17, 0.7)",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
};
const mandarATaBlaCodigoDeBarras = document.getElementById("crear-codigo-barras");
mandarATaBlaCodigoDeBarras.addEventListener("click", (e) =>{
    e.preventDefault();
    imprimirTicket(4, 0, "40px", "100%")
});
const mandarATaBlaCodigoQr = document.getElementById("crear-codigo-qr");
mandarATaBlaCodigoQr.addEventListener("click", (e) =>{
    e.preventDefault();
    imprimirTicket(5, 1, "80px", "80px")
});
function imprimirTicket(num, posicion, height, width){
    let html = `
        <style>
            body{
                display: grid;
                align-items: center;
                align-content: space-between;
                justify-content: center;
            }
            .codBarras{
                width: 180px;
                display: grid;
                margin: 1px;
                justify-items: center;
            }
            .contenedor-nuevo-codigo-barras{
                display: flex;
                flex-wrap: wrap;
                margin: auto;
                width: 100%;
            }
            .inputCodigoBarras{
                height: ${height};
                width: ${width};
                margin: 0px 2px;
            }
            .contenedor_etiquetas{
                display: flex;
                flex-wrap: wrap;
            }
            .labelCodigoBarras{
                padding: 0;
                margin: 0;
                width: 100%;
                border: 1px solid #bbbbbb
            }
            .labelDescripcion{
                padding: 0;
                margin: 0;
                width: 100%;
                border: 1px solid #bbbbbb
            }
        </style>
        <div class="contenedor_etiquetas">`;
    let sumaEtiquetas = 0;
    let cuenta = 0
    document.querySelectorAll(".input-cantidad-codigo-barras").forEach((element) => {
        sumaEtiquetas += Number(element.value);
        for (let i = cuenta; i < sumaEtiquetas; i++) {
            let contenidoHTML = `<div class="codBarras">
                                        <p class="labelDescripcion">${element.parentNode.parentNode.children[1].textContent} ${moneda()} ${Number(element.parentNode.parentNode.children[2].textContent).toFixed(2)}</p>
                                        <img class="imagenCodigoBarras inputCodigoBarras" src=${element.parentNode.parentNode.children[num].children[posicion].src}>
                                        <p class="labelCodigoBarras">${element.parentNode.parentNode.children[0].textContent}</p>
                                    </div>
                                `;
            html = html + contenidoHTML;
        }
        cuenta = element.value;
    })

    html += `</div>
            <div>
                <button class="imprimir-modal-codigo-barras">Imprimir</button>
                <button class="cerrar-modal-codigo-barras">Cerrar</button>
            </div>
            <script>
                document.querySelector(".imprimir-modal-codigo-barras").addEventListener("click", (event) => {
                    event.preventDefault()
                    window.print()
                });
            </script>
            `
    let nuevaVentana = window.open('');
    nuevaVentana.document.write(html);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////Extraccion de datos en formato csv///////////////////////////////////////
let datos_extraccion = [];

let extraccion_ = document.getElementById("extraccion_")
extraccion_.addEventListener("click", async ()=>{
    datos_extraccion = await cargarDatos(   `productos_extraccion?`);
    
    const csvContent = arrayToCSV(datos_extraccion);
    console.log(csvContent)
    downloadCSV(csvContent, 'dataProductos.csv');
});