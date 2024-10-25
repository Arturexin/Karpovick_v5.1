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
                <td style="border-left: 7px solid ${CS(e.sucursal_nombre)};">${e.sucursal_nombre}</td>
                <td>${e.categoria_nombre}</td>
                <td>${e.codigo}</td>
                <td style="text-align: end;">${e.existencias_entradas}</td>
                <td style="text-align: end;">${e.existencias_devueltas}</td>
                <td style="text-align: end;">${formatoMoneda(e.costo_unitario)}</td>
                <td style="text-align: end;">${e.existencias_entradas === 0 
                    ? formatoMoneda(0.00) 
                    : formatoMoneda((e.existencias_entradas - e.existencias_devueltas) * e.costo_unitario)}</td>
                <td>${e.comprobante}</td>
                <td>${e.fecha}</td>
                <td style="text-align: center;width: 80px">
                    <div class="tooltip">
                        <span onclick="accionDevoluciones(${e.idEntr})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">assignment_return</span>
                        <span class="tooltiptext">Devolver</span>
                    </div>
                    <div class="tooltip">
                        <span onclick="accionRemove(${e.idEntr})" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila">delete</span>
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
async function accionRemove(id) {
    let entradas = base_datos.array.find(y => y.idEntr == id)// obtenemos los datos de la fila
    let db = JSON.parse(localStorage.getItem("inventarios_consulta"))
    let producto = db.find(x=> x.codigo === entradas.codigo)

    tabla_proforma_productos(producto, "Eliminar entrada", entradas.categoria_nombre, entradas.comprobante);

    let contenedor_tab = document.querySelector("#contenedor_tabla_producto");
    contenedor_tab.children[0].remove();
    
    contenedorBotonesProducto(`procesarRemove(${entradas.idEntr})`, "Eliminar entrada")
    document.getElementById("acciones_rapidas_entradas").classList.add("modal_show")
};

async function procesarRemove(idEntr){
    manejoDeFechas();
    let url = URL_API_almacen_central + 'entradas_remove'
    let data = {
        'idEntr': idEntr
    };
    let response = await funcionFetchDos(url, data);
    if(response.status === "success"){
        await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                        document.getElementById("numeracionTablaEntradas"), 20)
        await searchDatos(subRutaB(num_filas_tabla.value, 1), base_datos,"#tabla-entradas")
        modal_proceso_abrir(`${response.message}.`)
        modal_proceso_salir_botones()
        removerContenido()
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function accionDevoluciones(id) {
    let entradas = base_datos.array.find(x => x.idEntr == id)
    let db = JSON.parse(localStorage.getItem("inventarios_consulta"))
    let sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_consulta"))
    if(entradas.comprobante.startsWith("Compra") || entradas.comprobante.startsWith("Recompra")){
        let producto = db.find(x=> x.codigo === entradas.codigo)
        tabla_proforma_productos(producto, "Devoluciones", entradas.categoria_nombre, entradas.comprobante)
        sucursales_comparacion.forEach((e, i) =>{
            if(entradas.sucursal_nombre == e.sucursal_nombre){
                sucursal_id_entradas = e.id_sucursales
                tabla_body_productos(entradas, i, sucursal_id_entradas)
            }
        });
        contenedorBotonesProducto(`procesarDevolucion()`, "Procesar Devolución")
        document.getElementById("acciones_rapidas_entradas").classList.add("modal_show")
    }else{
        modal_proceso_abrir("No es una Compra o Recompra.", "")
        modal_proceso_salir_botones()
    };
};
function tabla_proforma_productos(producto, titulo, categoria, operacion){
    let html = `<div id="form_accion_rapida" class="nuevo-contenedor-box">
                    <h2 style="text-align: center;">${titulo}</h2>
                    <table class="tabla_modal contenido-tabla">
                        <thead>
                            <tr>
                                <th style="width: 120px;">Categoría</th>
                                <th style="width: 120px;">Código</th>
                                <th style="width: 200px;">Descripción</th>
                                <th style="width: 200px;">Operación</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td id="id_prod" class="invisible">${producto.idProd}</td>
                                <td style="width: 120px; text-align: center;">${categoria}</td>
                                <td style="width: 120px; text-align: center;">${producto.codigo}</td>
                                <td style="width: 200px; text-align: center;">${producto.descripcion}</td>
                                <td style="width: 200px; text-align: center;">${operacion}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br>
                    <div id="contenedor_tabla_producto">`;
                html += `<table class="tabla-proforma" id="tabla_proforma_producto">
                            <thead>
                                <th>Operación</th>
                                <th>Sucursal</th>
                                <th>Unidades adquiridas</th>
                                <th>Unidades devueltas</th>
                                <th>Devolver</th>
                                <th>Saldo</th>
                                <th>Causa</th>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <br>
                    <div id="contenedor_botones_producto" style="display: flex;justify-content: center;">
                    </div>
                </div>`;
    document.getElementById("acciones_rapidas_entradas").innerHTML = html;
};
function tabla_body_productos(prod_, i, id_suc){
    let tabla_= document.querySelector("#tabla_proforma_producto > tbody");
    let nuevaFilaTabla_ = tabla_.insertRow(-1);
    let fila =  `<tr>` +
                    `<td class="invisible" id="id_prod">${prod_.idEntr}</td>` + //Operación
                    `<td style="text-align: center; width: 120px">${prod_.comprobante}</td>` + //Operación
                    `<td style="text-align: center; width: 120px">${prod_.sucursal_nombre}</td>` + // Sucursal
                    `<td style="text-align: center; width: 120px">${prod_.existencias_entradas}</td>` + // existencias adquiridas
                    `<td style="text-align: center; width: 120px">${prod_.existencias_devueltas}</td>` + // existencias devueltas
                    `<td>
                        <input class="input-tablas-dos-largo q_dev" onKeyup = "op_dev(this)">
                    </td>` + //Devolución
                    `<td style="text-align: center; width: 90px" class="s_dev">${prod_.existencias_entradas - prod_.existencias_devueltas}</td>` + // Saldo
                    `<td>   
                        <select id="accion_causa_devolucion_entradas" class="input-general-importante fondo-importante">
                            <option value="0" selected="">-- Causa de devolución --</option>                                    
                            <option value= "1">Producto defectuoso</option>
                            <option value= "2">Producto dañado durante el envío</option>
                            <option value= "3">Producto incorrecto o equivocado</option>
                            <option value= "4">Talla o ajuste incorrecto</option>
                            <option value= "5">Insatisfacción con el producto</option>
                            <option value= "6">Cambio por otro producto</option>
                            <option value= "7">Cancelación del pedido</option>
                            <option value= "8">Entrega retrasada</option>
                        </select>
                    </td>` + // id de la cucursal
                    `<td class="invisible">${id_suc}</td>` + // id de la cucursal
                    `<td class="invisible">${i}</td>` + // indice de la sucursal
                `</tr>`;
    nuevaFilaTabla_.innerHTML = fila;
    document.querySelector(".q_dev").focus();
};
function op_dev(e){
    let row_ = e.closest("tr");
    row_.children[6].textContent = Number(row_.children[3].textContent) - (Number(row_.children[5].children[0].value) + Number(row_.children[4].textContent))
    Number(row_.children[6].textContent) < 0 || 
    isNaN(Number(row_.children[6].textContent)) ?   row_.children[6].style.background = "var(--boton-dos)": 
                                                    row_.children[6].style.background = "";
};

function contenedorBotonesProducto(funcion, titulo){
    let contenedor_bot = document.querySelector("#contenedor_botones_producto");
    let html =  `
                <button class="myButtonAgregar" onCLick="${funcion}">${titulo}</button>
                <button class="myButtonEliminar" onClick="removerContenido()">Cancelar</button>
                `;
    contenedor_bot.innerHTML = html;
}
function removerContenido(){
    let contenido = document.getElementById("form_accion_rapida")
    contenido.remove();
    document.getElementById("acciones_rapidas_entradas").classList.remove("modal_show")
};
//////////////////BUSCA PRODUCTOS EN TABLA ALMACÉN CENTRAL////////////////////////////////////////////

async function procesarDevolucion(){
    manejoDeFechas();
    modal_proceso_abrir("Procesando la devolución!!!.", "")
    let inputs = document.querySelectorAll(".q_dev");
    let texts_saldos = document.querySelectorAll(".s_dev");
    let valores = Array.from(inputs).map(input => Number(input.value));
    let valores_saldos = Array.from(texts_saldos).map(texts_saldos => Number(texts_saldos.textContent));
    if (valores.every(valor => valor >= 0 && Number.isFinite(valor)) && valores.some(valor => valor > 0) &&
    valores_saldos.every(valor => valor >= 0 && Number.isFinite(valor))){
        try{
            modal_proceso_abrir("Procesando la devolución de la compra!!!.", "")
            await realizarDevolucion()
            await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                            document.getElementById("numeracionTablaEntradas"), 20)
            await searchDatos(subRutaB((document.getElementById("numeracionTablaEntradas").value - 1) * 20, 1), 
                                base_datos,"#tabla-entradas")
        }catch(error){
            modal_proceso_abrir("Ocurrió un error. " + error, "")
            console.error("Ocurrió un error. ", error)
            modal_proceso_salir_botones()
        };
    }else{
        modal_proceso_abrir(`Uno o varios de los valores son incorrectos.`, ``)
        modal_proceso_salir_botones()
    };
};
async function realizarDevolucion(){
    let array_devolucion = [];
    function DatosDeDevolucionCompras(a){
        this.idProd = document.getElementById("id_prod").textContent;
        this.sucursal_post = sucursales_activas[a.children[9].textContent];
        this.existencias_post = Number(a.children[5].children[0].value);

        this.id_op = a.children[0].textContent;

        this.comprobante = "Dev-" + a.children[1].textContent;
        this.causa_devolucion = a.children[7].children[0].value;
        this.sucursal = a.children[8].textContent;
    };
    const numFilas = document.querySelector("#tabla_proforma_producto > tbody").children
    for(let i = 0 ; i < numFilas.length; i++){
        if(numFilas[i]){
            array_devolucion.push(new DatosDeDevolucionCompras(numFilas[i]));
        };
    };
    function DataDevoluciones(){
        this.array_devolucion = array_devolucion;
        this.fecha = generarFecha();
    }
    let url = URL_API_almacen_central + 'procesar_devolucion_compras'
    let fila = new DataDevoluciones()

    let response = await funcionFetchDos(url, fila)

    if(response.status === "success"){
        modal_proceso_abrir(`${response.message}`)
        modal_proceso_salir_botones()
        removerContenido()
    };
    document.getElementById("acciones_rapidas_entradas").classList.remove("modal_show")
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
    let _proveedor_ = JSON.parse(localStorage.getItem("proveedores_consulta"));
    let _sucursal_ = JSON.parse(localStorage.getItem("sucursal_consulta"));
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
    let _productos_ = JSON.parse(localStorage.getItem("inventarios_consulta"));
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
    let _productos_ = JSON.parse(localStorage.getItem("inventarios_consulta"));

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
        localStorage.setItem("inventarios_consulta", JSON.stringify(await cargarDatos('almacen_central_ccd')))
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
    let _sucursal_ = JSON.parse(localStorage.getItem("sucursal_consulta"));
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
function formatoMoneda(valor_numerico){
    let value = valor_numerico.toString();
    value = value.replace(/[^0-9.]/g, '');// Eliminar todo lo que no sea un número o un punto decimal
    if (value.includes('.')) {// Verificar si el valor contiene un punto decimal
        let parts = value.split('.');
        let integerPart = parts[0].padStart(1, '0');// Asegurar que la parte entera tenga al menos un caracter (añadir 0 si es necesario)
        let decimalPart = parts[1] ? parts[1].substring(0, 2) : '';// Limitar la parte decimal a dos dígitos
        decimalPart = decimalPart.padEnd(2, '0');// Si la parte decimal tiene menos de dos dígitos, añadir ceros
        value = `${integerPart}.${decimalPart}`;// Formatear el valor final
    } else {
        value = value.padStart(1, '0') + '.00';// Si no hay punto decimal, añadir ".00" al final y asegurar que la parte entera tiene un dígitos
    }
    return value;// Ajustar el valor del input al valor formateado
};