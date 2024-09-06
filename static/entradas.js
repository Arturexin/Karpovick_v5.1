////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////ENTRADAS///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", inicioEntradas)
function inicioEntradas(){
    inicioTablasEntradas()
    btnEntradasP = 1;
};
const url_array_conteo = ["entradas_conteo", "transferencias_conteo", "perdidas_conteo"]
const url_array_tabla = ["entradas_tabla", "transferencias_tabla", "perdidas_tabla"]
let url_conteo = url_array_conteo[Number(document.getElementById("filtro_tabla").value)]
let url_tabla = url_array_tabla[Number(document.getElementById("filtro_tabla").value)]
let sucursal_id_entradas = 0;
let filas_total_bd = {value: 0};
let indice_tabla = {value : 1};
let num_filas_tabla = {value: 0};
let inicio = 0;
let fin = 0;
let base_datos = {array: []}
async function inicioTablasEntradas(){
    await conteoFilas(subRutaA(0), filas_total_bd, indice_tabla, 
                        document.getElementById("numeracionTablaEntradas"), 20)
    await searchDatos(subRutaB(document.getElementById("numeracionTablaEntradas").value - 1, 0), 
                        base_datos,"#tabla-entradas")
    avanzarTabla(document.getElementById("avanzarEntradas"), 
                document.getElementById("retrocederEntradas"), 
                document.getElementById("numeracionTablaEntradas"), 
                num_filas_tabla, indice_tabla, 
                filas_total_bd, 20, 
                base_datos,"#tabla-entradas")
    atajoTabla(document.getElementById("numeracionTablaEntradas"), 20, base_datos, 
                "#tabla-entradas", indice_tabla, num_filas_tabla)
    filtro(document.getElementById("buscarFiltrosEntradas"), 
            indice_tabla, num_filas_tabla, filas_total_bd, 
            document.getElementById("numeracionTablaEntradas"), 20, 
            base_datos, "#tabla-entradas")
    restablecerTabla(document.getElementById("restablecerEntradas"), 
                    indice_tabla, num_filas_tabla, filas_total_bd, 
                    document.getElementById("numeracionTablaEntradas"), 20, base_datos, "#tabla-entradas")
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("filtro_tabla").addEventListener("change", ()=>{
    url_conteo = url_array_conteo[Number(document.getElementById("filtro_tabla").value)]
    url_tabla = url_array_tabla[Number(document.getElementById("filtro_tabla").value)]
});
function subRutaA(index){
    let fecha_inicio = ['2000-01-01', inicio]
    let fecha_fin = [new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(), fin]
    return  `${url_conteo}?`+
            `sucursal_entradas=${document.getElementById("filtro-tabla-entradas-sucursal").value}&`+
            `categoria_entradas=${document.getElementById("filtro-tabla-entradas-categoria").value}&`+
            `codigo_entradas=${document.getElementById("filtro-tabla-entradas-codigo").value}&`+
            `comprobante_entradas=${document.getElementById("filtro-tabla-entradas-operacion").value}&`+
            `fecha_inicio_entradas=${fecha_inicio[index]}&`+
            `fecha_fin_entradas=${fecha_fin[index]}`
};
function subRutaB(num, index){
    let fecha_inicio = ['2000-01-01', inicio]
    let fecha_fin = [new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(), fin]
    return  `${url_tabla}/${num}?`+
            `sucursal_entradas=${document.getElementById("filtro-tabla-entradas-sucursal").value}&`+
            `categoria_entradas=${document.getElementById("filtro-tabla-entradas-categoria").value}&`+
            `codigo_entradas=${document.getElementById("filtro-tabla-entradas-codigo").value}&`+
            `comprobante_entradas=${document.getElementById("filtro-tabla-entradas-operacion").value}&`+
            `fecha_inicio_entradas=${fecha_inicio[index]}&`+
            `fecha_fin_entradas=${fecha_fin[index]}`
};

function cuerpoFilaTabla(e){
    return `<tr class="busqueda-entradas">
                <td class="invisible">${e.idEntr}</td>
                <td>${e.sucursal_nombre}</td>
                <td>${e.categoria_nombre}</td>
                <td>${e.codigo}</td>
                <td style="text-align: end;">${e.existencias_entradas}</td>
                <td style="text-align: end;">${e.existencias_devueltas}</td>
                <td style="text-align: end;">${e.costo_unitario.toFixed(2)}</td>
                <td style="text-align: end;">${((e.existencias_entradas - e.existencias_devueltas) * e.costo_unitario).toFixed(2)}</td>
                <td>${e.comprobante}</td>
                <td>${e.fecha}</td>
                <td style="text-align: center;width: 80px">
                    <div class="tooltip">
                        <span onclick="editEntradas(${e.idEntr})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">assignment_return</span>
                        <span class="tooltiptext">Devolver</span>
                    </div>
                    <div class="tooltip">
                        <span onclick="removeEntradas(${e.idEntr})" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila">delete</span>
                        <span class="tooltiptext">Eliminar operación</span>
                    </div>
                </td>
            </tr>`
};
function vaciadoInputBusqueda(){
    document.getElementById("filtro-tabla-entradas-sucursal").value = ""
    document.getElementById("filtro-tabla-entradas-categoria").value = ""
    document.getElementById("filtro-tabla-entradas-codigo").value = ""
    document.getElementById("filtro-tabla-entradas-operacion").value = ""
    document.getElementById("filtro-tabla-entradas-fecha-inicio").value = ""
    document.getElementById("filtro-tabla-entradas-fecha-fin").value = ""
};
function manejoDeFechas(){
    inicio = document.getElementById("filtro-tabla-entradas-fecha-inicio").value;
    fin = document.getElementById("filtro-tabla-entradas-fecha-fin").value;
    if(inicio == "" && fin == ""){
        inicio = '2000-01-01';
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
    }else if(inicio == "" && fin != ""){
        inicio = '2000-01-01';
    }else if(inicio != "" && fin == ""){
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
    };
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function removeEntradas(id) {
    respuestaAlmacen = confirm(`Eliminar esta fila podría generar conflictos en el stock de este producto, `+
                                `¿Desea continuar?.`)
    if (respuestaAlmacen) {
        let url = URL_API_almacen_central + `entradas/${id}`
            await fetch(url, {
            "method": 'DELETE',
            "headers": {
                "Content-Type": 'application/json'
                }
            })
        await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                        document.getElementById("numeracionTablaEntradas"), 20)
        await searchDatos(subRutaB(num_filas_tabla.value, 1), base_datos,"#tabla-entradas")
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let entradas_Id = "";
let producto_Id_entradas = "";
let indice_sucursal_entradas = 0;
function editEntradas(id) {
    let entradas = base_datos.array.find(x => x.idEntr == id)
    let sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_encabezado"))
    if(entradas.comprobante.startsWith("Compra") || entradas.comprobante.startsWith("Recompra")){
        accionDevolucionEntradas();
        sucursales_comparacion.forEach((e) =>{
            if(entradas.sucursal_nombre == e.sucursal_nombre){
                sucursal_id_entradas = e.id_sucursales
            }
        });
        document.getElementById('accion_id_entradas').value = entradas.idEntr
        document.getElementById('accion_codigo').textContent = "Devolución: " + entradas.codigo;
        document.getElementById('accion_comprobante_entradas').value = entradas.comprobante
        document.getElementById('accion_sucursal_entradas').value = entradas.sucursal_nombre
        document.getElementById('accion_existencias_entradas').value = entradas.existencias_entradas
        document.getElementById('accion_existencias_devueltas_entradas').value = entradas.existencias_devueltas
        cargarDatosEntradasId(entradas.idEntr)
        document.getElementById("accion_editar_entradas").focus()
        document.getElementById("acciones_rapidas_entradas").classList.add("modal-show-entrada")
    }else{
        modal_proceso_abrir("No es una Compra o Recompra.", "")
        modal_proceso_salir_botones()
    };
};
function accionDevolucionEntradas(){
    let formularioDevolucionesEntradas = `
                                        <div id="form_accion_rapida_entradas" class="nuevo-contenedor-box">
                                            <form action="" class="formulario-general fondo">
                                                <h2 id="accion_codigo"></h2>
                                                <input id="accion_id_entradas" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_id_productos" class="input-general fondo invisible" type="text" disabled>
                                                <label class="label-general">Comprobante<input id="accion_comprobante_entradas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Sucursal de Origen<input id="accion_sucursal_entradas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades Adquiridas<input id="accion_existencias_entradas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades Devueltas<input id="accion_existencias_devueltas_entradas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Existencias en Stock<input id="accion_existencias_productos_entradas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades a Devolver<input id="accion_editar_entradas" class="input-general-importante fondo-importante" type="text"></label>
                                                <label class="label-general">Saldo en Devoluciones<input id="accion_saldo_devolucion_entradas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Saldo en Productos<input id="accion_saldo_productos_entradas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Causa de Devolución
                                                    <select id="accion_causa_devolucion_entradas" class="input-general-importante fondo-importante">
                                                        <option value= "1">Producto defectuoso</option>
                                                        <option value= "2">Producto dañado durante el envío</option>
                                                        <option value= "3">Producto incorrecto o equivocado</option>
                                                        <option value= "4">Talla o ajuste incorrecto</option>
                                                        <option value= "5">Insatisfacción con el producto</option>
                                                        <option value= "6">Cambio por otro producto</option>
                                                        <option value= "7">Cancelación del pedido</option>
                                                        <option value= "8">Entrega retrasada</option>
                                                    </select>
                                                </label>
                                                <input id="accion_existencias_ac_productos" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_su_productos" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_sd_productos" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_st_productos" class="input-general fondo invisible" type="text" disabled>
                                                <button id="accion_procesar_devolucion_entradas" class="myButtonAgregar">Procesar Devolución</button>
                                                <button id="remover_accion_rapida_entradas" class="myButtonEliminar">Cancelar</button>
                                            </form>
                                        </div>
                                        `;
    document.getElementById("acciones_rapidas_entradas").innerHTML = formularioDevolucionesEntradas;
    removerAccionRapidaEntradas();
    let editar = document.getElementById("accion_editar_entradas");
    editar.addEventListener("keyup", (event)=>{
        document.getElementById("accion_saldo_devolucion_entradas").value = Number(event.target.value) + Number(document.getElementById("accion_existencias_devueltas_entradas").value)
        document.getElementById("accion_saldo_productos_entradas").value = Number(document.getElementById("accion_existencias_productos_entradas").value) - Number(event.target.value)
    });
    const procesarDevolucionesEntradas = document.getElementById("accion_procesar_devolucion_entradas");
    procesarDevolucionesEntradas.addEventListener("click", procesamientoEntradasDevoluciones)
};

async function cargarDatosEntradasId(id){
    entradas_Id = await cargarDatos(`entradas/${id}`)
    cargarDatosProductosIdEntradas(entradas_Id.idProd)
}
async function cargarDatosProductosIdEntradas(id){
    let sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_encabezado"))
    producto_Id_entradas = await cargarDatos(`almacen_central/${id}`)
    let array_uso = [producto_Id_entradas.existencias_ac, producto_Id_entradas.existencias_su, producto_Id_entradas.existencias_sd, producto_Id_entradas.existencias_st]
    array_uso.forEach((event, i)=>{
        if(sucursales_comparacion[i] &&
        document.getElementById('accion_sucursal_entradas').value === sucursales_comparacion[i].sucursal_nombre){
            indice_sucursal_entradas = i
            document.getElementById('accion_existencias_productos_entradas').value = event
        }
    })
    document.getElementById('accion_id_productos').value = producto_Id_entradas.idProd
    document.getElementById('accion_existencias_ac_productos').value = producto_Id_entradas.existencias_ac
    document.getElementById('accion_existencias_su_productos').value = producto_Id_entradas.existencias_su
    document.getElementById('accion_existencias_sd_productos').value = producto_Id_entradas.existencias_sd
    document.getElementById('accion_existencias_st_productos').value = producto_Id_entradas.existencias_st
}
function removerAccionRapidaEntradas(){
    let remover = document.getElementById("remover_accion_rapida_entradas");
    remover.addEventListener("click", (e)=>{
        e.preventDefault();
        document.getElementById("form_accion_rapida_entradas").remove()
        document.getElementById("acciones_rapidas_entradas").classList.remove("modal-show-entrada")
    });
};
//////////////////BUSCA PRODUCTOS EN TABLA ALMACÉN CENTRAL////////////////////////////////////////////

async function procesamientoEntradasDevoluciones(e){
    e.preventDefault();
    manejoDeFechas()
    if(Number(document.getElementById("accion_editar_entradas").value) > 0 && 
    (Number(document.getElementById("accion_existencias_entradas").value) >= Number(document.getElementById("accion_saldo_devolucion_entradas").value)) &&
    Number(document.getElementById("accion_existencias_productos_entradas").value) > 0){
        try{
            modal_proceso_abrir("Procesando la devolución de la compra!!!.", "")
            await realizarDevolucionComprasEntradas()
            await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                            document.getElementById("numeracionTablaEntradas"), 20)
            await searchDatos(subRutaB((document.getElementById("numeracionTablaEntradas").value - 1) * 20, 1), 
                                base_datos,"#tabla-entradas")
        }catch(error){
            modal_proceso_abrir("Ocurrió un error. " + error, "")
            console.error("Ocurrió un error. ", error)
            modal_proceso_salir_botones()
        };
    }else if(Number(document.getElementById("accion_editar_entradas").value) <= 0){
        modal_proceso_abrir("Las unidades a devolver deben ser mayores a cero.", "")
        modal_proceso_salir_botones()
    }else if(Number(document.getElementById("accion_existencias_entradas").value) < Number(document.getElementById("accion_saldo_devolucion_entradas").value)){
        modal_proceso_abrir("Las unidades a devolver no deben ser mayores a las unidades en existencia.", "")
        modal_proceso_salir_botones()
    }else if(Number(document.getElementById("accion_existencias_productos_entradas").value) <= 0){
        modal_proceso_abrir("El stock en inventario es cero.", "")
        modal_proceso_salir_botones()
    };
};
async function realizarDevolucionComprasEntradas(){
    function DatosDevolucionComprasEntradas(){
        this.idProd = document.getElementById("accion_id_productos").value;
        this.sucursal_post = sucursales_activas[indice_sucursal_entradas];
        this.existencias_post = document.getElementById("accion_saldo_productos_entradas").value;
        this.idEntr = document.getElementById('accion_id_entradas').value;
        this.existencias_entradas_update = document.getElementById('accion_existencias_entradas').value;
        this.existencias_devueltas_update = document.getElementById("accion_saldo_devolucion_entradas").value;
        this.comprobante = "Dev-" + document.getElementById('accion_comprobante_entradas').value;
        this.causa_devolucion = document.getElementById("accion_causa_devolucion_entradas").value;
        this.sucursal = sucursal_id_entradas;
        this.existencias_devueltas_insert = document.getElementById("accion_editar_entradas").value;
        this.fecha = generarFecha();
    };
    let filaProducto = new DatosDevolucionComprasEntradas();
    let url = URL_API_almacen_central + 'procesar_devolucion_compras'
    let response = await funcionFetch(url, filaProducto)
    console.log("Respuesta Productos "+response.status)
    if(response.status === 200){
        modal_proceso_abrir("Operación completada exitosamente.", "")
        modal_proceso_salir_botones()
        document.getElementById("acciones_rapidas_entradas").classList.remove("modal-show-entrada")
    }else{
        modal_proceso_abrir(`Ocurrió un problema en la devolución`, "")
        modal_proceso_salir_botones()
    };
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Volcado de datos/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let array_productos = [];
let array_no_enviado_productos = [];
let array_no_enviado_salidas = [];

function leerArchivo(e){
    array_productos = [];
    const archivo = e.target.files[0];
    if(!archivo){
        return
    }
    const lector = new FileReader();
    lector.onload = function(e){
        const contenidoCSV = e.target.result;
        const array_productos = convertirCSVaJSON(contenidoCSV);
        modificarArrayVolcado(array_productos);
    }
    lector.readAsText(archivo)
};
function convertirCSVaJSON(contenidoCSV) {
    const lineas = contenidoCSV.split('\n');
    
    //const cabeceras = lineas[0].split(';').map(campo => campo.replace(/[\r;'",\/\\<>=]|(--)|\/\*/g, ''));
    const cabeceras = ["categoria",
                       "codigo",
                       "descripcion",
                       "talla",
                       "costo_unitario",
                       "precio_venta",
                       "lote",
                       "proveedor",
                       "existencias_ac",
                       "existencias_su",
                       "existencias_sd",
                       "existencias_st"]

    for (let i = 1; i < lineas.length; i++) {
        const datos = lineas[i].split(';').map(campo => campo.replace(/[\r;'",\/\\<>=]|(--)|\/\*/g, ''));
        if(datos.length === 12){
            const objetoJSON = {};
    
            for (let j = 0; j < cabeceras.length; j++) {
                if(cabeceras[j] === "costo_unitario" || cabeceras[j] === "precio_venta" ||
                cabeceras[j] === "lote" || cabeceras[j] === "existencias_ac" ||
                cabeceras[j] === "existencias_su" || cabeceras[j] === "existencias_sd" ||
                cabeceras[j] === "existencias_st"){
                    objetoJSON[cabeceras[j]] = Number(datos[j]);
                }else{
                    objetoJSON[cabeceras[j]] = datos[j];
                }
            };
            if(objetoJSON.categoria !== "" && objetoJSON.codigo !== "" && objetoJSON.proveedor !== "" && 
            objetoJSON.talla !== ""){
                array_productos.push(objetoJSON);
            };
        };
    };
    return array_productos;
};
function modificarArrayVolcado(array){
    let _categorias_ = JSON.parse(localStorage.getItem("categoria_consulta"));
    let _proveedor_ = JSON.parse(localStorage.getItem("base_datos_prov"));
    let _sucursal_ = JSON.parse(localStorage.getItem("sucursal_encabezado"));
    function preparandoArray(e){
        let categor = _categorias_.find(y => y.categoria_nombre === e.categoria);
        let prov = _proveedor_.find(y => y.nombre_cli === e.proveedor);
        if(categor === undefined || prov === undefined){
            array_productos = [];
            modal_proceso_abrir(`Existen datos de formato incorrectos. `, "");
            modal_proceso_salir_botones();
            document.getElementById("carga_archivo").value = "";
            return
        }
        e.categoria = categor.id;
        e.codigo = `${e.codigo}-${e.talla}-${e.lote}`;
        e.proveedor = prov.id_cli;
    }
    if(_sucursal_.length < 2){
        array.forEach((e)=>{
            preparandoArray(e)
            e.existencias_su = 0;
            e.existencias_sd = 0;
            e.existencias_st = 0;
        });
    }else if(_sucursal_.length < 3){
        array.forEach((e)=>{
            preparandoArray(e)
            e.existencias_sd = 0;
            e.existencias_st = 0;
        });
    }else if(_sucursal_.length < 4){
        array.forEach((e)=>{
            preparandoArray(e)
            e.existencias_st = 0;
        });
    }else if(_sucursal_.length === 4){
        array.forEach((e)=>{
            preparandoArray(e)
        });
    };
};
document.getElementById("carga_archivo").addEventListener("change", leerArchivo);

function agregarId(array){
    let _productos_ = JSON.parse(localStorage.getItem("base_datos_consulta"));
    array.forEach((event)=>{
        let prod = _productos_.find(y => y.codigo === event.codigo)
        event.idProd = prod.idProd;
    });
};

document.getElementById("volcar_datos").addEventListener("click", (e)=>{
    if(document.querySelector("#carga_archivo").value !== "" && array_productos.length > 0){
        e.preventDefault();
        comprobarDatosRepetidos()
    }else{
        e.preventDefault()
        modal_proceso_abrir("No existe ningún archivo o los datos de formato son incorrectos.", "")
        modal_proceso_salir_botones()
    }
});

let array_producto_repetido = [];
function comprobarDatosRepetidos(){
    let _productos_ = JSON.parse(localStorage.getItem("base_datos_consulta"));

    array_productos.forEach((event)=>{
        let codig = _productos_.find(y => y.codigo === event.codigo);
        if(codig !== undefined){
            array_producto_repetido.push(codig)
        }
    });
    if(array_producto_repetido.length === 0){
        procesarVolcadoProductos();
    }else{
        let categoria = ""
        array_producto_repetido.forEach((event)=>{
            categoria += `${event.codigo}, `;
            modal_proceso_abrir(`Algunos de los códigos que intenta ingresar ya existen en la base de datos: ${categoria}. `+
                                `Asegurese de eliminar las coincidencias antes de volver a hacer el volcado de datos.`, "");
        });
        modal_proceso_salir_botones();
        array_productos = [];
        document.getElementById("carga_archivo").value = "";
    };
};

async function procesarVolcadoProductos(){
    let sum_volcado = 0;
    function EnviarAProducto(array){
        this.categoria = array.categoria;
        this.codigo = array.codigo;
        this.costo_unitario = array.costo_unitario;
        this.descripcion = array.descripcion;
        this.lote = array.lote;
        this.precio_venta = array.precio_venta;
        this.proveedor = array.proveedor;
        this.talla = array.talla;
        this.existencias_ac = array.existencias_ac;
        this.existencias_su = array.existencias_su;
        this.existencias_sd = array.existencias_sd;
        this.existencias_st = array.existencias_st;
    };
    let url = URL_API_almacen_central + 'almacen_central';
    for(let i = 0; i < array_productos.length; i++){
        let fila_producto = new EnviarAProducto(array_productos[i])
        let response = await funcionFetch(url, fila_producto);
        if(response.ok){
            sum_volcado+=1;
            modal_proceso_abrir(`Se grabó en productos: ${array_productos[i].codigo}.`, "");
        }else{
            array_no_enviado_productos.push(array_productos[i]);
        };
    };
    if(sum_volcado === array_productos.length){
        localStorage.setItem("base_datos_consulta", JSON.stringify(await cargarDatos('almacen_central_ccd')))
        agregarId(array_productos)
        procesarVolcadoEntradas()
        modal_proceso_abrir(`Operación completada exitosamente.`, "");
        modal_proceso_salir_botones();
    }else{
        let prod = ""
        array_no_enviado_productos.forEach((event)=>{
            prod += `${event.codigo}, `;
            modal_proceso_abrir(`Algunos de los códigos que intenta ingresar no pasaron a productos: ${prod}.`, "");
        });
        modal_proceso_salir_botones();
    };
};

async function procesarVolcadoEntradas(){
    let _sucursal_ = JSON.parse(localStorage.getItem("sucursal_encabezado"));
    let suma_volcado_entradas = 0;
    function EnviarAEntradas(id_prod, id_suc, existencias){
        this.idProd = id_prod;//Hay que buscar hacer una consilta para este dato
        this.sucursal = id_suc;
        this.existencias_entradas = existencias;
        this.comprobante = "Traspaso";
        this.fecha = generarFecha();
    };
    let url = URL_API_almacen_central + 'entradas';
    for(let j = 0; j < array_productos.length; j++){
        for(let i = 0; i < _sucursal_.length; i++){
            if(array_productos[j].existencias_ac > 0 && _sucursal_[i]){
                let fila_entrada = new EnviarAEntradas(array_productos[j].idProd, _sucursal_[i].id_sucursales, array_productos[j].existencias_ac);
                let response = await funcionFetch(url, fila_entrada);
                if(response.ok){
                    suma_volcado_entradas+=1;
                    modal_proceso_abrir(`Se grabó en entradas: ${array_productos[i].codigo}.`, "");
                }else{
                    array_no_enviado_salidas.push(array_productos[j]);
                }
            };
        };
    };
    if(suma_volcado_entradas === (_sucursal_.length * array_productos.length)){
        inicioTablasEntradas();
        modal_proceso_abrir(`Operación completada exitosamente en entradas.`, "");
        modal_proceso_salir_botones();
        array_productos = [];
        document.getElementById("carga_archivo").value = "";
    }else{
        let prod = ""
        array_no_enviado_salidas.forEach((event)=>{
            prod += `${event.codigo}, `;
            modal_proceso_abrir(`Algunos de los códigos que intenta ingresar no pasaron a entradas: ${prod}.`, "");
        });
        modal_proceso_salir_botones();
        array_productos = [];
        document.getElementById("carga_archivo").value = "";
    };
};
//////////////////////////////////////////////////////////////////////////////////////
//Exportar formato csv
const array_cabecera = {    "NOMBRE DE CATEGORIA": "", 
                            "CODIGO": "", 
                            "DESCRIPCION": "", 
                            "MEDIDA": "", 
                            "COSTO DE COMPRA": "", 
                            "PRECIO DE VENTA": "", 
                            "LOTE": "", 
                            "NOMBRE DE PROVEEDOR": "", 
                            "STOCK EN LOCAL PRINCIPAL": "", 
                            "STOCK EN SUCURSAL UNO": "", 
                            "STOCK EN SUCURSAL DOS": "", 
                            "STOCK EN SUCURSAL TRES": "", 
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
    descargarCSV(array_cabecera, "misProductos")
});
///////Extraccion de datos en formato csv///////////////////////////////////////
let datos_extraccion = [];
let extraccion_ = document.getElementById("extraccion_")
extraccion_.addEventListener("click", async ()=>{
    let f_inicio = document.getElementById("filtro-tabla-entradas-fecha-inicio").value;
    let f_fin = document.getElementById("filtro-tabla-entradas-fecha-fin").value;
    f_inicio === "" ? f_inicio = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate() : "";
    f_fin === "" ? f_fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate() : "";

    datos_extraccion = await cargarDatos(   `entradas_extraccion?`+
                                            `fecha_inicio_entradas=${f_inicio}&`+
                                            `fecha_fin_entradas=${f_fin}`
                                        );
    const csvContent = arrayToCSV(datos_extraccion);
    console.log(csvContent)
    downloadCSV(csvContent, 'dataEntradas.csv');
})
