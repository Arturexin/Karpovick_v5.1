////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////PRODUCTOS///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", inicioProductos)
let sucursales_comparacion = ""

function inicioProductos(){
    inicioTablasProductos()
    array_btn_pages[10] = 1;
    sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_consulta"))

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
    await graficoStock()
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
                <td style="text-align: end;">${e.existencias_sc}</td>
                <td style="text-align: end;">${e.costo_unitario.toFixed(2)}</td>
                <td style="text-align: end;">${((e.existencias_ac + 
                                                e.existencias_su + e.existencias_sd + 
                                                e.existencias_st + e.existencias_sc)*e.costo_unitario).toFixed(2)}</td>
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
                        <span onclick="accionRemove(${e.idProd})" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila">delete</span>
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////BOTON ACCIONES/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ELIMINAR PRODUCTO

async function accionRemove(id) {
    modal_proceso_abrir("Buscando resultados...", "", "")

    let prod_ = base_datos.array.find(y => y.idProd == id)// obtenemos los datos de la fila
    
    await delay(500)
    modal_proceso_cerrar()

    tabla_proforma_productos(prod_, "Eliminar producto");

    let contenedor_tab = document.querySelector("#contenedor_tabla_producto");
    contenedor_tab.children[0].remove();
    
    contenedorBotonesProducto(`procesarRemove(${prod_.idProd})`, "Eliminar producto")
    document.getElementById("acciones_rapidas").classList.add("modal-show")
};

async function procesarRemove(idProd){
    let url = URL_API_almacen_central + 'almacen_central_remove'
    let data = {
        'idProd': idProd
    };
    let response = await funcionFetchDos(url, data);
    if(response.status === "success"){
        await conteoFilas(subRutaA(), filas_total_bd, indice_tabla, 
                        document.getElementById("numeracionTabla"), 20)
        await searchDatos(subRutaB(num_filas_tabla.value), base_datos,"#tabla-productos")
        localStorage.setItem("inventarios_consulta", JSON.stringify(await cargarDatos('almacen_central_ccd')))
        modal_proceso_abrir(`${response.message}.`)
        modal_proceso_salir_botones()
        removerContenido()
    };
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function tabla_head_productos(suc, q, op, saldo, origen){
    let tabla_= document.querySelector("#tabla_proforma_producto > thead");
    let nuevaFilaTabla_ = tabla_.insertRow(-1);
    let fila =  `
                <th>${suc}</th>
                <th>${q}</th>
                <th>${op}</th>
                <th>${saldo}</th>
                <th>${origen}</th>
                `;
    nuevaFilaTabla_.innerHTML = fila;
}
function contenedorBotonesProducto(funcion, titulo){
    let contenedor_bot = document.querySelector("#contenedor_botones_producto");
    let html =  `
                <button class="myButtonAgregar" onCLick="${funcion}">${titulo}</button>
                <button class="myButtonEliminar" onClick="removerContenido()">Cancelar</button>
                `;
    contenedor_bot.innerHTML = html;
}
//RECOMPRAS
function tabla_proforma_productos(prod_, titulo){
    let html = `<div id="form_accion_rapida" class="nuevo-contenedor-box">
                    <h2 style="text-align: center;">${titulo}</h2>
                    <table class="tabla_modal contenido-tabla">
                        <thead>
                            <tr>
                                <th style="width: 120px;">Categoría</th>
                                <th style="width: 120px;">Código</th>
                                <th style="width: 200px;">Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td id="id_prod" class="invisible">${prod_.idProd}</td>
                                <td style="width: 120px; text-align: center;">${prod_.categoria_nombre}</td>
                                <td style="width: 120px; text-align: center;">${prod_.codigo}</td>
                                <td style="width: 200px; text-align: center;">${prod_.descripcion}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br>
                    <div id="contenedor_tabla_producto">`;
                html += `<table class="tabla-proforma" id="tabla_proforma_producto">
                            <thead></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <br>
                    <div id="contenedor_botones_producto" style="display: flex;justify-content: center;">
                    </div>
                </div>`;
    document.getElementById("acciones_rapidas").innerHTML = html;
}
function tabla_body_productos(e, i, id_suc){
    let tabla_= document.querySelector("#tabla_proforma_producto > tbody");
    let nuevaFilaTabla_ = tabla_.insertRow(-1);
    let fila =  `<tr>` +
                    `<td class="nom_suc" style="text-align: center; width: 180px; border-left: 7px solid ${CS(suc_add[i])};">${suc_add[i]}</td>` + //nombre de sucursal
                    `<td style="text-align: center; width: 90px">${e[sucursales_activas[i]]}</td>` + // existencias del producto
                    `<td>
                        <input class="input-tablas-dos-largo q_recompra" onKeyup = "op_recompras(this)">
                    </td>` +
                    `<td style="text-align: center; width: 90px" class="s_recompra">${e[sucursales_activas[i]]}</td>` +
                    `<td class="invisible">${id_suc}</td>` + // id de la cucursal
                    `<td class="invisible">${i}</td>` + // indice de la sucursal
                `</tr>`;
    nuevaFilaTabla_.innerHTML = fila;
    document.querySelector("#tabla_proforma_producto > tbody > tr:nth-child(1) > td:nth-child(3) > input").focus();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function accion_recompras(id){
    modal_proceso_abrir("Buscando resultados...", "", "")
    
    let prod_ = base_datos.array.find(y => y.idProd == id)// obtenemos los datos de la fila
    
    await delay(500)
    modal_proceso_cerrar()

    tabla_proforma_productos(prod_, "Recompra");
    tabla_head_productos("Sucursal", "Existencias", "Recompra", "Saldo", "");
    suc_add.forEach((e, i)=>{
        let coincidencia = suc_db.find(x=> x.sucursal_nombre === e)
        coincidencia ? tabla_body_productos(prod_, i, coincidencia.id_sucursales) : ";"
    });
    contenedorBotonesProducto(`procesarRecompra()`, "Procesar recompra")
    document.getElementById("acciones_rapidas").classList.add("modal-show")
};
function op_recompras(e){
    let row_ = e.closest("tr");
    row_.children[3].textContent = Number(row_.children[1].textContent) + Number(row_.children[2].children[0].value )
    Number(row_.children[3].textContent) < 0 || 
    isNaN(Number(row_.children[3].textContent)) ?   row_.children[3].style.background = "var(--boton-dos)": 
                                                    row_.children[3].style.background = "";
};
function removerContenido(){
    let contenido = document.getElementById("form_accion_rapida")
    contenido.remove();
    document.getElementById("acciones_rapidas").classList.remove("modal-show")
};


async function procesarRecompra(){
    modal_proceso_abrir("Procesando la recompra!!!.", "")
    let inputs = document.querySelectorAll(".q_recompra");
    let valores = Array.from(inputs).map(input => Number(input.value));

    if (valores.every(valor => valor >= 0 && Number.isFinite(valor)) && valores.some(valor => valor > 0)){
        try{
            await realizarRecompra()
            await conteoFilas(subRutaA(), filas_total_bd, indice_tabla, 
                            document.getElementById("numeracionTabla"), 20)
            await searchDatos(subRutaB((document.getElementById("numeracionTabla").value - 1) * 20), 
                            base_datos,"#tabla-productos")
        }catch (error){
            modal_proceso_abrir("Ocurrió un error. " + error, "")
            console.error("Ocurrió un error. ", error)
            modal_proceso_salir_botones()
        };
    }else{
        modal_proceso_abrir(`Uno o varios de los valores son incorrectos.`, ``)
        modal_proceso_salir_botones()
    };
};
async function realizarRecompra(){
    let nom_suc = Array.from(document.querySelectorAll(".nom_suc"));
    let array_productos_dos = [];
    let array_entradas_dos = [];
    function DataProductos(){
        this.idProd = Number(document.getElementById("id_prod").textContent);
        suc_add.forEach((e, i)=>{
            let coincidencia = nom_suc.find(x => x.textContent === e);
            coincidencia ?  this[sucursales_activas[i]] = Number(coincidencia.parentNode.children[2].children[0].value): 
                            this[sucursales_activas[i]] = 0;
        });
    };
    array_productos_dos.push(new DataProductos())
    function DatosEntradas(existencias, sucursal){
        this.idProd = Number(document.getElementById("id_prod").textContent);
        this.existencias_entradas = existencias;
        this.sucursal = sucursal;
    }
    document.querySelectorAll(".q_recompra").forEach((event, i)=>{
        let row_ = event.closest("tr");
        if(event.value > 0){
            array_entradas_dos.push(new DatosEntradas(Number(event.value), Number(row_.children[4].textContent)))
        }
    })

    function DataRecompras(){
        this.id_num = neg_db[0].id;
        this.fecha = generarFecha();
        this.array_productos_dos = array_productos_dos;
        this.array_entradas_dos = array_entradas_dos;
    };
    let fila_recompra = new DataRecompras();
    let url = URL_API_almacen_central + 'gestion_de_recompras';
    let response = await funcionFetchDos(url, fila_recompra)
    if(response.status === "success"){
        modal_proceso_abrir(`La ${response.message} se ejecutó satisfactoriamente.`)
        modal_proceso_salir_botones()
        removerContenido()
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////TRANSFERENCIAS////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function tabla_transferencias_body(e, i, id_suc){
    let tabla_= document.querySelector("#tabla_proforma_producto > tbody");
    let nuevaFilaTabla_ = tabla_.insertRow(-1);
    let fila = `<tr>` +
                    `<td class="nom_suc" style="text-align: center; width: 180px; border-left: 7px solid ${CS(suc_add[i])};">${suc_add[i]}</td>` + //nombre de sucursal
                    `<td style="text-align: center; width: 90px">${e[sucursales_activas[i]]}</td>` + // existencias del producto
                    `<td>
                        <input class="input-tablas-dos-largo q_tran" onKeyup = "op_transferencias(this)">
                    </td>` +
                    `<td style="text-align: center; width: 90px" class="s_tran">${e[sucursales_activas[i]]}</td>` +
                    `<td class="invisible">${id_suc}</td>` + // id de la cucursal
                    `<td><input class="suc_tran" type="radio" name="radioMetodoDePago" onClick="sucursalOrigen()"></td>` + // 
                    `<td class="invisible">${i}</td>` + // indice de la sucursal
                `</tr>`;
    nuevaFilaTabla_.innerHTML = fila;
    document.querySelector("#tabla_proforma_producto > tbody > tr:nth-child(1) > td:nth-child(3) > input").focus();
};

async function accion_transferencias(id){
    modal_proceso_abrir("Buscando resultados...", "", "")

    let prod_ = base_datos.array.find(y => y.idProd == id)// obtenemos los datos de la fila

    await delay(500)
    modal_proceso_cerrar()

    tabla_proforma_productos(prod_, "Transferencia");
    tabla_head_productos("Sucursal", "Existencias", "Transferencia", "Saldo", "Orígen");
    suc_add.forEach((e, i)=>{
        let coincidencia = suc_db.find(x=> x.sucursal_nombre === e)
        coincidencia ? tabla_transferencias_body(prod_, i, coincidencia.id_sucursales) : "";
    });
    contenedorBotonesProducto("procesarTransferencia()", "Procesar transferencia")
    document.querySelector(".suc_tran").checked = true;
    sucursalOrigen();
    document.getElementById("acciones_rapidas").classList.add("modal-show");
};

function op_transferencias(e){// Opera las cantidades a transferir con respecto a las existencias
    let row_ = e.closest("tr");
    row_.children[3].textContent = Number(row_.children[1].textContent) + Number(row_.children[2].children[0].value )
    Number(row_.children[3].textContent) < 0 || 
    isNaN(Number(row_.children[3].textContent)) ?   row_.children[3].style.background = "var(--boton-dos)": 
                                                    row_.children[3].style.background = "";
    sumaTranSucursales();                                         
};
function sumaTranSucursales(){//Suma las cantidades de los inputs a transferir
    let elementos = document.querySelectorAll(".q_tran");
    let valores = Array.from(elementos).map(elemento => Number(elemento.value));
    let suma = valores.reduce((acumulador, valor) => acumulador + valor, 0);

    elementos.forEach((e)=>{
        let row_ = e.closest("tr")
        if(row_.children[5].children[0].checked){
            row_.children[3].textContent = Number(row_.children[1].textContent) - suma
            row_.children[3].textContent < 0 ?  row_.children[3].style.background = "var(--boton-dos)": 
                                                row_.children[3].style.background = "var(--boton-tres)";
        }
    })
    return Number(suma);
}
function sucursalOrigen(){// Inhabilita el input de la sucursal de orígen de la transferencia
    let radios = document.querySelectorAll(".suc_tran")
    radios.forEach((e)=>{
        let row_ = e.closest("tr")
        row_.children[3].style.background = "";
        row_.children[2].children[0].value = "";
        row_.children[3].textContent = row_.children[1].textContent;
        row_.children[5].children[0].checked ?  row_.children[2].children[0].setAttribute("disabled", "true") :
                                                row_.children[2].children[0].removeAttribute("disabled");
    })
};


async function procesarTransferencia(){
    modal_proceso_abrir("Procesando la transferencia!!!.", "")
    let inputs = document.querySelectorAll(".q_tran");
    let texts_saldos = document.querySelectorAll(".s_tran");
    let valores = Array.from(inputs).map(input => Number(input.value));
    let valores_saldos = Array.from(texts_saldos).map(texts_saldos => Number(texts_saldos.textContent));
    if (valores.every(valor => valor >= 0 && Number.isFinite(valor)) && valores.some(valor => valor > 0) &&
    valores_saldos.every(valor => valor >= 0 && Number.isFinite(valor))){
        try{
            await realizarTransferencia()
            await conteoFilas(subRutaA(), filas_total_bd, indice_tabla, 
                            document.getElementById("numeracionTabla"), 20)
            await searchDatos(subRutaB((document.getElementById("numeracionTabla").value - 1) * 20), 
                            base_datos,"#tabla-productos")
        }catch (error){
            modal_proceso_abrir("Ocurrió un error. " + error, "")
            console.error("Ocurrió un error. ", error)
            modal_proceso_salir_botones()
        };
    }else{
        modal_proceso_abrir(`Uno o varios de los valores son incorrectos.`, ``)
        modal_proceso_salir_botones()
    };
};
async function realizarTransferencia(){
    let nom_suc = Array.from(document.querySelectorAll(".nom_suc"));
    /* const numFilas = document.querySelector("#tabla-proforma-transferencias > tbody").children */
    let array_data_prod = [];
    let array_data_tran = [];
    function DataProductos(){
        this.idProd = Number(document.getElementById("id_prod").textContent);
        suc_add.forEach((e, i)=>{
            let coincidencia = nom_suc.find(x => x.textContent === e)
            coincidencia ?  coincidencia.parentNode.children[5].children[0].checked ?   this[sucursales_activas[i]] = -sumaTranSucursales(): 
                                                                                        this[sucursales_activas[i]] = Number(coincidencia.parentNode.children[2].children[0].value):
                            this[sucursales_activas[i]] = 0;
        });
    };
    array_data_prod.push(new DataProductos())
    function DataTransferencia(existencias, sucursal_origen, sucursal_destino){
        this.idProd = Number(document.getElementById("id_prod").textContent);
        this.cantidad = existencias;
        this.id_suc_origen = sucursal_origen;
        this.id_suc_destino = sucursal_destino;
    };
    let suc_o = 0;
    document.querySelectorAll(".suc_tran").forEach((event)=>{//Buscamos la sucursal de origen
        let row_ = event.closest("tr");
        if(row_.children[5].children[0].checked){
            suc_o = Number(row_.children[4].textContent)
        }
    })
    document.querySelectorAll(".q_tran").forEach((event, i)=>{
        let row_ = event.closest("tr");
        if(event.value > 0){
            array_data_tran.push(new DataTransferencia(Number(event.value), Number(suc_o), Number(row_.children[4].textContent)))
        }
    })
    function DatosTransferencia(){
        this.array_data_prod = array_data_prod;
        this.array_data_tran = array_data_tran;
        this.id_num = neg_db[0].id;
        this.fecha = generarFecha();
    }

    let fila = new DatosTransferencia();
    let url = URL_API_almacen_central + 'procesar_transferencia'
    let response = await funcionFetchDos(url, fila)
    if(response.status === "success"){
        modal_proceso_abrir(`La transferencia "${response.message}" fue procesada satisfactoriamente!!!.`, ``)
        modal_proceso_salir_botones()
        removerContenido()
    };
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
async function editAlmacenCentral(id) {
    modal_proceso_abrir("Generando etiqueta.", "", "")
    let almacenCentral = base_datos.array.find(y => y.idProd == id);
    let codigo_Array = Array.from(document.querySelectorAll(".codigo-codigo-barras"));
    let busqueda_repetido = codigo_Array.find(x => x.textContent === almacenCentral.codigo)
    await delay(500)
    if(busqueda_repetido === undefined){
        let tablaCodigoBarras = document.querySelector("#tabla-codigo-barras > tbody");
        let nueva_fila =    `<tr>
                                <td class="codigo-codigo-barras">${almacenCentral.codigo}</td>
                                <td>${almacenCentral.descripcion}</td>
                                <td>${almacenCentral.precio_venta}</td>
                                <td><input class="input-cantidad-codigo-barras" value="${
                                                                                        almacenCentral.existencias_ac + 
                                                                                        almacenCentral.existencias_su + 
                                                                                        almacenCentral.existencias_sd + 
                                                                                        almacenCentral.existencias_st +
                                                                                        almacenCentral.existencias_sc
                                                                                        }">
                                </td>
                                <td style="width: 200px;"><img class="inputCodigoBarras"></td>
                                <td style="display: flex;justify-content: center;" class="inputCodigoQr"></td>
                                <td>
                                    <span onclick="eliminarFila(this)" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila">delete</span>
                                </td>
                            </tr>`
                            
        tablaCodigoBarras.innerHTML += nueva_fila;
        modal_proceso_cerrar()
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

////////////////////////////////////////////////////////////////////////////////////
async function graficoStock(){
    stockSucursales = await cargarDatos(`almacen_central_stock_sucursal`);
    await delay(500)
    let sucursales_monto = [ stockSucursales[0].almacen_central, 
                        stockSucursales[0].sucursal_uno, 
                        stockSucursales[0].sucursal_dos, 
                        stockSucursales[0].sucursal_tres, 
                        stockSucursales[0].sucursal_cuatro]
    let sumaTotal = sucursales_monto.reduce((acc, curr) => acc + curr, 0);
    graficoBarrasHorizontalTres(document.getElementById("grafico_stock"), 
                                ['Stock'], 
                                suc_add, 
                                [sucursales_monto[0]], 
                                [sucursales_monto[1]], 
                                [sucursales_monto[2]], 
                                [sucursales_monto[3]], 
                                [sucursales_monto[4]], 
                                [sumaTotal])
}