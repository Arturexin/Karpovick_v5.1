document.addEventListener("DOMContentLoaded", inicioCompras)
let anio_principal = ""
async function inicioCompras(){
    anio_principal = new Date().getFullYear()
    cargarDatosAnio()
    indice_base = JSON.parse(localStorage.getItem("base_datos_consulta"))
    btnCompras = 1;

    mostrarFormNuevoProducto()
    agregarMoneda(document.querySelectorAll(".moneda_compras"));
    busquedaStock()
    llenarCategoriaProductosEjecucion("#categoria_buscador_detalle")
};
const formularioComprasUno = document.getElementById("formulario-compras-uno");
const tablaProformaCompras = document.getElementById("tabla_principal");
let comprasNumerador = 0;
let indice_sucursal_recompras = 0;
let proveedores_llave;
const barras_compras = [".cg_1_c", ".cg_2_c", ".cg_3_c", ".cg_4_c", ".cg_5_c"]
let datos_usuario = JSON.parse(localStorage.getItem("datos_usuario"))
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        removerMarcaBotonDos()
        anio_principal = anio_referencia.value;
        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};
/////////////////////////////////////////////////////////////////////
///////////////////////////sucursal/////////////////////////////////
function formulario_compras(){
    let formCompras = `
    <div class="into_form baja_opacidad_interior">
                        
                    <h2 class="">Comprar
                        <div class="tooltip_ayuda">
                            <span class="material-symbols-outlined">help</span>
                            <span class="tooltiptext_ayuda">Crea nuevos productos en la base de datos.</span>
                        </div>
                    </h2>
                    <label>Sucursal 
                        <select name="fffff-sucursal" id="fffff-sucursal" class="input-select-ventas">
                        </select>
                        <div class="tooltip_ayuda">
                            <span class="material-symbols-outlined">help</span>
                            <span class="tooltiptext_ayuda">Seleccione una sucursal de compra.</span>
                        </div>
                    </label>
                    <div class="contenedor-label-input-compras">
                        <div>
                            <input class="input-compras fondo" type="hidden" id="id-compras" name="id-compras" />
                            <label class="label-general">
                                <div style="display: flex">Categoría
                                    <div class="tooltip_ayuda">
                                        <span class="material-symbols-outlined">help</span>
                                        <span class="tooltiptext_ayuda">Cada categoría presenta diferentes medidas.</span>
                                    </div>
                                </div>
                                <select name="categoria-compras" id="categoria-compras" class="input-general fondo" style="cursor: pointer;">
                                </select>
                            </label>
                            <label class="label-general">
                                <div style="display: flex">Código
                                    <div class="tooltip_ayuda">
                                        <span class="material-symbols-outlined">help</span>
                                        <span class="tooltiptext_ayuda">El código solo puede contener como caracteres letras y números. (Ejemplo: Ab001).</span>
                                    </div>
                                </div>
                                <input class="input-general fondo" type="text" id="codigo-compras" name="codigo-compras" />
                            </label>
                            <label class="label-general">
                                <div style="display: flex">Descripción
                                    <div class="tooltip_ayuda">
                                        <span class="material-symbols-outlined">help</span>
                                        <span class="tooltiptext_ayuda">La descripción del producto solo puede contener como caracteres letras y números.</span>
                                    </div>
                                </div>
                                <input class="input-general fondo" type="text" id="descripcion-compras" name="descripcion-compras" />
                            </label>
                            <label class="label-general">
                                <div style="display: flex">Costo de compra
                                    <div class="tooltip_ayuda">
                                        <span class="material-symbols-outlined">help</span>
                                        <span class="tooltiptext_ayuda">EL costo unitario del producto solo puede contener números.</span>
                                    </div>
                                </div>
                                <input class="input-general fondo" type="text" id="costo-compras" name="costo-compras"/>
                            </label>
                            <label class="label-general">
                                <div style="display: flex">Precio de venta
                                    <div class="tooltip_ayuda">
                                        <span class="material-symbols-outlined">help</span>
                                        <span class="tooltiptext_ayuda">EL precio de venta unitario del producto solo puede contener números.</span>
                                    </div>
                                </div>
                                <input class="input-general fondo" type="text" id="precio-compras" name="precio-compras"/>
                            </label>
                            <label class="label-general">
                                <div style="display: flex">Lote
                                    <div class="tooltip_ayuda">
                                        <span class="material-symbols-outlined">help</span>
                                        <span class="tooltiptext_ayuda">El lote de producto solo puede contener números.</span>
                                    </div>
                                </div>
                                <input class="input-general fondo" type="text" id="lote-compras" name="lote-compras" />
                            </label>
                            <label class="label-general">
                                <div style="display: flex">Proveedor
                                    <div class="tooltip_ayuda">
                                        <span class="material-symbols-outlined">help</span>
                                        <span class="tooltiptext_ayuda">Si no encuentra el proveedor correspondiente, asegurese de haberlo ingresado previamente en el apartado de "Clientes".</span>
                                    </div>
                                </div>
                                <select class="input-general fondo" id="proveedor-compras" style="cursor: pointer;">
                                </select>
                            </label>
                        </div>
                    </div>
                    <div class="boton-cli">
                        <button id="agregarATablaCompras" class="myButtonAgregar">Agregar a Proforma</button>
                        <input type="reset" class="myButtonEliminar">
                    </div>
    </div>
                    `;
    document.getElementById("formulario-compras-uno").innerHTML = formCompras;
};
let base_datos_busqueda = JSON.parse(localStorage.getItem("base_datos_consulta"))
const nuevoProducto = document.getElementById("nuevo-producto");
nuevoProducto.addEventListener("click", (e)=>{
    e.preventDefault();
    mostrarFormNuevoProducto()
});
function mostrarFormNuevoProducto(){
    formulario_compras()
    cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))
    llenarCategoriaProductosEjecucion("#categoria-compras")
    baseProv("#proveedor-compras")

    document.getElementById("nuevo-producto").classList.add("marcaBoton")
    document.getElementById("recompra-producto-plus").classList.remove("marcaBoton")
    document.getElementById("codigo-compras").focus();
    document.querySelector(".baja_opacidad_interior").classList.add("alta_opacidad_interior")
    document.getElementById("procesar-pre-recompra").classList.add("invisible")
    document.getElementById("procesar-pre-compra").classList.remove("invisible")
    document.getElementById("procesar-compras-plus").classList.add("invisible")
    document.getElementById("procesar-compras").classList.remove("invisible")
    document.getElementById("id-compras").value = ""
    document.querySelector("#tabla_modal > tbody").remove()
    document.querySelector("#tabla_modal").createTBody()
    document.querySelector("#tabla_principal > tbody").remove()
    document.querySelector("#tabla_principal").createTBody()

    /* document.getElementById("grafico_circular_compras_recompras").classList.add("invisible") */

    comprasNumerador = 0;
    const mandarATablaCompras = document.querySelector("#agregarATablaCompras");
    mandarATablaCompras.addEventListener("click", agregarAtablaModal)
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////COMPRA NUEVO PRODUCTO///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let codigoComprobacionCompra = ""
function crearHeadCompra(){
    let tablaCompras= document.querySelector("#tabla_modal > thead");
    let nuevaFilaTablaCompras = tablaCompras.insertRow(-1);
    let fila = `
                <tr class="tbody_preproforma">
                    <th style="width: 120px;">Sucursal</th>
                    <th style="width: 120px;">Categoría</th>
                    <th style="width: 120px;">Código</th>
                    <th style="width: 200px;">Descripción</th>
                    <th style="width: 70px;">Medidas</th>
                    <th style="width: 70px;">Cantidad a Comprar</th>
                    <th style="width: 70px;">Costo Unitario</th>
                    <th style="width: 70px;">Costo Total</th>
                    <th style="width: 70px;">Precio de Venta</th>
                    <th style="width: 70px;">Proveedor</th>
                    <th style="width: 40px;"><span style="font-size:18px;" class="material-symbols-outlined">delete</span></th>
                </tr>
                `
    nuevaFilaTablaCompras.innerHTML = fila;
};


function crearBodyCompras (tallaAComprar, loteAComprar){
    let tablaCompras= document.querySelector("#tabla_modal > tbody");
    let nuevaFilaTablaCompras = tablaCompras.insertRow(-1);
    let fila = `<tr>`+
                    `<td>${suc_add[obtenerIndiceSucursal()]}</td>`+// Columna 0 > sucursal
                    `<td>${document.getElementById("categoria-compras").children[document.getElementById("categoria-compras").selectedIndex].textContent}</td>`+// Columna 1 > categoría
                    `<td class="codigo_compras_modal input-tablas fondo" style="background: rgb(105, 211, 35)">${document.getElementById("codigo-compras").value}-${tallaAComprar}-${loteAComprar}</td>`+// Columna 2 > codigo
                    `<td><input class="input-tablas-texto-largo" value="${document.getElementById("descripcion-compras").value}" placeholder="Rellene esta casilla"></td>`+// Columna 3 > descripción
                    `<td>${tallaAComprar}</td>`+// Columna 4 > talla
                    `<td><input class="input-tablas-dos-largo insertarNumero" placeholder="Valor > 0"></td>`+// Columna 5 > cantidad a comprar
                    `<td><input class="input-tablas-dos-largo insertarCosto" value="${(Number(document.getElementById("costo-compras").value)).toFixed(2)}" placeholder="Valor >= 0"></td>`+// Columna 6 > costo de compra
                    `<td style="text-align: right"></td>`+// Columna 7 > Costo Total 
                    `<td><input class="input-tablas-dos-largo" value="${(Number(document.getElementById("precio-compras").value)).toFixed(2)}" placeholder="Valor >= C"></td>`+// Columna 8 > precio de venta
                    `<td class="invisible">${loteAComprar}</td>`+// Columna 9 > lote
                    `<td>${document.getElementById("proveedor-compras").children[document.getElementById("proveedor-compras").selectedIndex].textContent}</td>`+// Columna 10 > proveedor
                    `<td class="invisible">${document.getElementById("proveedor-compras").value}</td>`+// Columna 11 > id proveedor***
                    `<td class="invisible">${document.getElementById("fffff-sucursal").value}</td>`+// Columna 12 > id sucursal***
                    `<td class="invisible">${document.getElementById("categoria-compras").value}</td>`+// Columna 13 > id categoria***
                    `<td class="invisible">${obtenerIndiceSucursal()}</td>`+// Columna 14 > índice sucursal***
                    `<td style="text-align: center">
                        <div class="tooltip">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFila(this)">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </div>
                    </td>`+// Columna 15 > botón eliminar fila
                `</tr>`
    nuevaFilaTablaCompras.innerHTML = fila;
    codigoComprobacionCompra = `${document.getElementById("codigo-compras").value}-${tallaAComprar}-${loteAComprar}`;
};

function agregarAtablaModal(e){
    e.preventDefault();
    ///////////////////////////Para nuevos productos/////////////////////////////////////////////////////////////////
    if(expregul.codigo.test(document.getElementById("codigo-compras").value) &&
    expregul.descripcion.test(document.getElementById("descripcion-compras").value) &&
    expregul.cantidad.test(document.getElementById("lote-compras").value) &&
    expregul.precios.test(document.getElementById("costo-compras").value) &&
    expregul.precios.test(document.getElementById("precio-compras").value)){
        document.querySelector(".contenedor-pre-recompra").classList.add("modal-show")
        let arrayCreacionCategoriaTallas =categoriaProductosCreacion(document.getElementById("categoria-compras"));
        compararCodigosNuevos(".codigo_compras_proforma", codigoComprobacionCompra);
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        crearHeadCompra()
        arrayCreacionCategoriaTallas.forEach((event) =>{
            crearBodyCompras(event, document.getElementById("lote-compras").value)
        });
        document.getElementById("categoria-compras").style.background = ""
        document.getElementById("codigo-compras").style.background = ""
        document.getElementById("descripcion-compras").style.background = ""
        document.getElementById("lote-compras").style.background = ""
        document.getElementById("costo-compras").style.background = ""
        document.getElementById("precio-compras").style.background = ""
        document.getElementById("proveedor-compras").style.background = ""

        comprobarCodigoProductos(".codigo_compras_modal");//Comprueba códigos repetidos
        operarCantidadAComprar();
        marcarCodigoRepetido(".codigo_compras_modal", ".codigo_compras_proforma", 
                            document.querySelector("#tabla_principal > thead > tr:nth-child(1) > th > h2").textContent)
        arrayCreacionCategoriaTallas = [];
        document.querySelector("#tabla_modal > tbody > tr:nth-child(1) > td:nth-child(6) > input").focus()

    }else if(expregul.codigo.test(document.getElementById("codigo-compras").value) == false){
        document.getElementById("codigo-compras").style.background ="#b36659"
    }else if(expregul.descripcion.test(document.getElementById("descripcion-compras").value) == false){
        document.getElementById("descripcion-compras").style.background ="#b36659"
    }else if(expregul.precios.test(document.getElementById("costo-compras").value) == false){
        document.getElementById("costo-compras").style.background ="#b36659"
    }else if(expregul.precios.test(document.getElementById("precio-compras").value) == false){
        document.getElementById("precio-compras").style.background ="#b36659"
    }else if(expregul.cantidad.test(document.getElementById("lote-compras").value) == false){
        document.getElementById("lote-compras").style.background ="#b36659"
    };
};
function operarCantidadAComprar(){
    const cantidadAComprar = document.querySelectorAll(".insertarNumero");//cambio si modifica la cantidad
    cantidadAComprar.forEach((e)=>{
        e.addEventListener("keyup",(i)=>{
            i.target.parentNode.parentNode.children[7].textContent = 
                (Number(i.target.value) * Number(i.target.parentNode.parentNode.children[6].children[0].value)).toFixed(2)
        });
    });
    const costoAComprar = document.querySelectorAll(".insertarCosto");//cambio si modifica el costo de compra
    costoAComprar.forEach((e)=>{
        e.addEventListener("keyup",(i)=>{
            i.target.parentNode.parentNode.children[7].textContent = 
                (Number(i.target.value) * Number(i.target.parentNode.parentNode.children[5].children[0].value)).toFixed(2)
        });
    });
};
function filaBodyProformaPincipalCompras(){
    const fila_modal = document.querySelectorAll(".codigo_compras_modal");
    fila_modal.forEach((event)=>{
        let row_ = event.closest("tr");
        row_.children[3].children[0].style.background = ""
        row_.children[5].children[0].style.background = ""
        row_.children[6].children[0].style.background = ""
        row_.children[8].children[0].style.background = ""

        if(row_.children[3].children[0].value !== "" &&
        Number(row_.children[5].children[0].value) > 0 &&
        row_.children[5].children[0].value !== "" &&
        Number(row_.children[6].children[0].value) >= 0 &&
        row_.children[6].children[0].value !== "" &&
        Number(row_.children[8].children[0].value) >= Number(row_.children[6].children[0].value) &&
        row_.children[8].children[0].value !== ""){
            let fila_principal = document.querySelector("#tabla_principal > tbody");
            let nueva_fila_principal = fila_principal.insertRow(-1);
            let fila = `<tr>`+
                            `<td>${row_.children[0].textContent}</td>`+// Columna 0 > sucursal
                            `<td>${row_.children[1].textContent}</td>`+// Columna 1 > categoría
                            `<td class="codigo_compras_proforma">${event.textContent}</td>`+// Columna 2 > código
                            `<td>${row_.children[3].children[0].value}</td>`+// Columna 3 > descripción
                            `<td>${row_.children[4].textContent}</td>`+// Columna 4 > talla
                            `<td style="text-align: right">${row_.children[5].children[0].value}</td>`+// Columna 5 > cantidad
                            `<td style="text-align: right">${row_.children[6].children[0].value}</td>`+// Columna 6 > costo de compra
                            `<td style="text-align: right">${row_.children[7].textContent}</td>`+// Columna 7 > Costo Total
                            `<td style="text-align: right">${row_.children[8].children[0].value}</td>`+// Columna 8 > precio de venta
                            `<td style="text-align: right">${row_.children[9].textContent}</td>`+// Columna 9 > lote
                            `<td style="text-align: right">${row_.children[10].textContent}</td>`+// Columna 10 > proveedor
                            `<td class="invisible">${row_.children[11].textContent}</td>`+// Columna 11 > id proveedor
                            `<td class="invisible">${row_.children[12].textContent}</td>`+// Columna 12 > id sucursal
                            `<td class="invisible">${row_.children[13].textContent}</td>`+// Columna 13 > id categoría
                            `<td class="invisible">${row_.children[14].textContent}</td>`+// Columna 14 > índice sucursal***
                            `<td style="text-align: center">
                                <div class="tooltip">
                                    <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFila(this)">delete</span>
                                    <span class="tooltiptext">Eliminar producto</span>
                                </div>
                            </td>`+// Columna 15 > botón eliminar fila
                        `</tr>`
            nueva_fila_principal.innerHTML = fila;
        }else if(row_.children[3].children[0].value === ""){
            row_.children[3].children[0].style.background = "#b36659"
        }else if(Number(row_.children[5].children[0].value) <= 0 ||
        row_.children[5].children[0].value === ""){
            row_.children[5].children[0].style.background = "#b36659"
        }else if(Number(row_.children[6].children[0].value) < 0 ||
        row_.children[6].children[0].value === ""){
            row_.children[6].children[0].style.background = "#b36659"
        }else if(Number(row_.children[8].children[0].value) < Number(row_.children[6].children[0].value) ||
        row_.children[8].children[0].value === ""){
            row_.children[8].children[0].style.background = "#b36659"
        };
    });
};
const mandarATablaComprasPrincipal = document.getElementById("procesar-pre-compra");
mandarATablaComprasPrincipal.addEventListener("click", mandarATablaPrincipalCompras)
function mandarATablaPrincipalCompras(e){
    e.preventDefault();
    let id_sucursal = document.getElementById("fffff-sucursal").value;//guardamos la sucursal 
    removerCodigoRepetido(".codigo_compras_modal", ".codigo_compras_proforma", 6)
    filaBodyProformaPincipalCompras()
    const borrarNumero = document.querySelectorAll(".codigo_compras_modal");//eliminamos las filas que si pasaron a la tabla principal
    borrarNumero.forEach((event)=>{
        if(event.parentNode.children[3].children[0].value !== "" &&
        Number(event.parentNode.children[5].children[0].value) > 0 &&
        event.parentNode.children[5].children[0].value !== "" &&
        Number(event.parentNode.children[6].children[0].value) >= 0 &&
        event.parentNode.children[6].children[0].value !== "" &&
        Number(event.parentNode.children[8].children[0].value) >= Number(event.parentNode.children[6].children[0].value) &&
        event.parentNode.children[8].children[0].value !== ""){
            event.parentNode.remove()
        }
    });
    if(document.querySelector("#tabla_modal > tbody").children.length == 0){//eliminamos el contenedor del modal si la tabla modal no tiene filas, osea si pasaron todas las filas
        document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show")
        document.querySelector("#tabla_modal > thead > tr:nth-child(2)").remove()
    }
    let sumaTotalCantidadComprada= 0;
        let sumaTotalCompra = 0;
        let numeroFilasTablaCompras = document.querySelector("#tabla_principal > tbody").rows.length;
        for(let i = 0; i < numeroFilasTablaCompras; i++){
            sumaTotalCompra += Number(document.querySelector("#tabla_principal > tbody").children[i].children[7].innerHTML) 
            sumaTotalCantidadComprada += Number(document.querySelector("#tabla_principal > tbody").children[i].children[5].innerHTML) 
    }
    document.getElementById("total-importe-tabla-compras").textContent = sumaTotalCompra.toFixed(2);
    document.getElementById("total-cantidad-tabla-compras").textContent = sumaTotalCantidadComprada;

    document.getElementById("formulario-compras-uno").reset()
    document.getElementById("id-compras").value = ""
    document.getElementById("fffff-sucursal").value = id_sucursal;// Con id_sucursal mantenemos la sucursal
    document.getElementById("codigo-compras").focus();
};

const procesarCompras = document.querySelector("#procesar-compras");
procesarCompras.addEventListener("click", procesamientoCompras)
async function procesamientoCompras(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla_principal > tbody").children.length > 0){
            modal_proceso_abrir("Procesando la compra!!!.", "")
            await funcionGeneralCompras();
            if(document.querySelector("#check_comprobante").checked){
                imprimirListaTabla()//Lista de compras
            };
            document.querySelector("#tabla_principal > tbody").remove();
            document.querySelector("#tabla_principal").createTBody();
        };
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. " + error, "")
        console.error("Ocurrió un error. ", error)
        modal_proceso_salir_botones()
    };
};
async function funcionGeneralCompras(){
    let array_productos = [];
    let array_entradas = [];
    function DatosProductos(a){
        this.categoria = a.children[13].textContent;
        this.codigo = a.children[2].textContent;
        this.costo_unitario = a.children[6].textContent;
        this.descripcion = a.children[3].textContent;
        this.lote = a.children[9].textContent;
        this.precio_venta = a.children[8].textContent;
        this.proveedor = a.children[11].textContent;
        this.talla = a.children[4].textContent;

        for(let i = 0; i < sucursales_activas.length; i++){//agregamos la cantidad a comprar de acuerdo al índice de la sucursal
            this[sucursales_activas[i]] = Number(a.children[14].textContent) === i ? Number(a.children[5].textContent) : 0;
        };
    };
    function DatosEntradas(a){
        this.codigo = a.children[2].textContent;
        this.sucursal = a.children[12].textContent;
        this.existencias_entradas = a.children[5].textContent;
    };
    let numFilas = document.querySelector("#tabla_principal > tbody").children;
    for(let i = 0 ; i < numFilas.length; i++ ){
        if(numFilas[i]){
            array_productos.push(new DatosProductos(numFilas[i]))
            array_entradas.push(new DatosEntradas(numFilas[i]))
        };
    };
    function DatosCompras(){
        this.id_num = datos_usuario[0].id;//Para la numeración
        this.fecha = generarFecha();
        this.array_productos = array_productos;
        this.array_entradas = array_entradas;
    };

    let url_compra = URL_API_almacen_central + 'gestion_de_compras'
    let objeto_compra = new DatosCompras();
    let response = await funcionFetchDos(url_compra, objeto_compra);

    if(response.status === "success"){
        localStorage.setItem("base_datos_consulta", JSON.stringify(await cargarDatos('almacen_central_ccd')))
        modal_proceso_abrir(`Operación "${response.message}" completada exitosamente.`)
        modal_proceso_salir_botones()
    };
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////RECOMPRA PLUS/////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function cambioSucursalCompras(id){
    document.getElementById(id).addEventListener("change", ()=>{
        indice_sucursal_recompras = obtenerIndiceSucursal();
        document.getElementById("buscador-productos-compras").focus();
    });
};
function formulario_recompras(){
    let formRecompras = `
    
    <div class="into_form baja_opacidad_interior">
                    
                    <h2 class="">Recompra
                        <div class="tooltip_ayuda">
                            <span class="material-symbols-outlined">help</span>
                            <span class="tooltiptext_ayuda">Recompra productos ya existentes en la base de datos.</span>
                        </div>
                    </h2>

                    <div>Sucursal
                        <select name="fffff-sucursal" id="fffff-sucursal" class="input-select-ventas">
                        </select>
                        <div class="tooltip_ayuda">
                            <span class="material-symbols-outlined">help</span>
                            <span class="tooltiptext_ayuda">Seleccione la sucursal de recompra.</span>
                        </div>
                    </div>
                    <div style="display: flex;">
                        <input id="buscador-productos-compras" type="text" class="input-general-importante fondo-importante" placeholder="Buscar Código">
                        <div class="tooltip_ayuda">
                            <span class="material-symbols-outlined">find_in_page</span>
                            <span class="tooltiptext_ayuda">Digite caracteres clave del código a buscar.</span>
                        </div>
                    </div>

                    <div class="contenedor-label-input-compras">
                        <div class="label">
                            <input class="input-compras fondo" type="hidden" id="id-compras" name="id-compras" />
                            <label class="label-general">Categoría
                                <select name="categoria-compras" id="categoria-compras" class="input-general fondo">
                                </select>
                            </label>
                            <label class="label-general">Código<input class="input-general fondo" type="text" id="codigo-compras" name="codigo-compras" /></label>
                            <label class="label-general">Descripción<input class="input-general fondo" type="text" id="descripcion-compras" name="descripcion-compras" /></label>
                        </div>
                    </div>
                    <div class="boton-cli">
                        <button id="agregarATablaComprasPlus" class="myButtonAgregar">Agregar a Proforma</button>
                        <input onClick="reseteoFormulario()" type="reset" class="myButtonEliminar">
                    </div>
    </div>
                    `;
    document.getElementById("formulario-compras-uno").innerHTML = formRecompras;
};
const recompraProductoPlus = document.getElementById("recompra-producto-plus");
recompraProductoPlus.addEventListener("click", (e)=>{
    e.preventDefault();
    mostrarFormrecompraProductoPlus()
});
function mostrarFormrecompraProductoPlus(){
    formulario_recompras()
    cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))
    llenarCategoriaProductosEjecucion("#categoria-compras")
    cambioSucursalCompras("fffff-sucursal")

    document.getElementById("nuevo-producto").classList.remove("marcaBoton")
    document.getElementById("recompra-producto-plus").classList.add("marcaBoton")
    document.getElementById("buscador-productos-compras").focus();
    document.querySelector(".baja_opacidad_interior").classList.add("alta_opacidad_interior")
    document.getElementById('categoria-compras').setAttribute("disabled", "true")
    document.getElementById('codigo-compras').setAttribute("disabled", "true")
    document.getElementById('descripcion-compras').setAttribute("disabled", "true")
    document.getElementById("procesar-pre-recompra").classList.remove("invisible")
    document.getElementById("procesar-pre-compra").classList.add("invisible")
    document.getElementById("procesar-compras-plus").classList.remove("invisible")
    document.getElementById("procesar-compras").classList.add("invisible")
    document.getElementById("id-compras").value = ""
    document.querySelector("#tabla_modal > tbody").remove()
    document.querySelector("#tabla_modal").createTBody()
    document.querySelector("#tabla_principal > tbody").remove()
    document.querySelector("#tabla_principal").createTBody()

    comprasNumerador = 1;
    const mandarATablaRecomprasPlus = document.getElementById("agregarATablaComprasPlus");
    mandarATablaRecomprasPlus.addEventListener("click", agregarATablaPreRecompras)
}
///////////////////BUSCADOR DE PRODUCTOS EN FORMULARIO COMPRAS/////////////////////////
function reseteoFormulario(){
    document.getElementById("id-compras").value = "";
    document.getElementById('categoria-compras').value = "0";
    document.getElementById('codigo-compras').value = "";
    document.getElementById('descripcion-compras').value = "";
};
document.addEventListener("keyup", () =>{
    if(comprasNumerador == 0){
        return;
    }else{
        let almacenCentral = indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-productos-compras').value.toLowerCase()))
        if(almacenCentral){
            indice_sucursal_recompras = obtenerIndiceSucursal();
            document.getElementById('id-compras').value = almacenCentral.idProd
            document.getElementById('categoria-compras').value = almacenCentral.categoria
            document.getElementById('codigo-compras').value = almacenCentral.codigo
            document.getElementById('descripcion-compras').value = almacenCentral.descripcion
            if(document.getElementById('buscador-productos-compras').value == ""){
                reseteoFormulario()
            }
        }else{
            reseteoFormulario()
        };
    };
});

function removerProductoRepetido(){//verificamos que el nuevo producto no tenga el mismo código en la tabla compras
    const codigoComprasComparacionProductos = document.querySelectorAll(".id_compras_modal");
    codigoComprasComparacionProductos.forEach((event) => {
        document.querySelectorAll(".id_compras_proforma").forEach((elemento) => {
            if(elemento.textContent === event.textContent &&
                event.parentNode.children[7].children[0].value > 0 && 
                elemento.parentNode.children[1].textContent === event.parentNode.children[1].textContent){
                elemento.parentNode.remove()
            }
        });
    });
};

function crearHeadRecompra(){
    let tablaCompras= document.querySelector("#tabla_modal > thead");
    let nuevaFilaTablaCompras = tablaCompras.insertRow(-1);
    let fila = `
                <tr class="tbody_preproforma">
                    <th style="width: 120px;">Sucursal</th>
                    <th style="width: 120px;">Categoría</th>
                    <th style="width: 120px;">Código</th>
                    <th style="width: 70px;">Existencias</th>
                    <th style="width: 70px;">Cantidad a Comprar</th>
                    <th style="width: 70px;">Total Compra</th>
                    <th style="width: 40px;"><span style="font-size:18px;" class="material-symbols-outlined">delete</span></th>
                </tr>
                `
    nuevaFilaTablaCompras.innerHTML = fila;
};
function crearBodyRecompras (codigoMovimientos, id_prod){
    let tablaRecompras= document.querySelector("#tabla_modal > tbody");
    let nuevaFilaTablaRecompras = tablaRecompras.insertRow(-1);
    let fila = `<tr>`+
                    `<td class="id_compras_modal invisible">${id_prod}</td>`+// Columna 0 > id
                    `<td>${suc_add[indice_sucursal_recompras]}</td>`+// Columna 1 > sucursal
                    `<td>${document.getElementById("categoria-compras").children[document.getElementById("categoria-compras").selectedIndex].textContent}</td>`+// Columna 2 > categoría
                    `<td class="codigo_compras_modal insertarMovimientos" style="border-radius: 5px">${codigoMovimientos}</td>`+// Columna 3 > código
                    `<td class="invisible"></td>`+// Columna 4 > descripción
                    `<td class="invisible"></td>`+// Columna 5 > talla
                    `<td style="text-align: right"></td>`+// Columna 6 > existencias
                    `<td><input class="input-tablas-dos-largo insertarNumero" placeholder="Valor > 0"></td>`+// Columna 7 > cantidad a comprar
                    `<td class="invisible"></td>`+// Columna 8 > costo unitario
                    `<td class="invisible"></td>`+// Columna 9 > Costo Total
                    `<td class="invisible"></td>`+// Columna 10 > precio de venta
                    `<td class="invisible"></td>`+// Columna 11 > lote
                    `<td class="invisible"></td>`+// Columna 12 > proveedor
                    `<td style="text-align: right"></td>`+// Columna 13 > existencias + cantidad a comprar
                    `<td class="invisible">${document.getElementById("fffff-sucursal").value}</td>`+// Columna 14 > id sucursal
                    `<td class="invisible">${indice_sucursal_recompras}</td>`+// Columna 15 > índice sucursal sucursal
                    `<td style="text-align: center">
                        <div class="tooltip">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila"  onCLick = "clicKEliminarFila(this)">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </div>
                    </td>`+// Columna 15 > botón eliminar fila
                `</tr>`
    nuevaFilaTablaRecompras.innerHTML = fila;
};
async function agregarATablaPreRecompras(e){
    e.preventDefault();
    let base_datos_busqueda = JSON.parse(localStorage.getItem("base_datos_consulta"))
    let base = 0;
    if(document.getElementById("id-compras").value > 0){
        crearHeadRecompra()
        let arrayCreacionCategoriaTallas =categoriaProductosCreacion(document.getElementById("categoria-compras"));

        for(let i = 0; i < arrayCreacionCategoriaTallas.length; i++){
            if(document.getElementById("id-compras").value > 0){
                let codigoMovimientos = document.getElementById("codigo-compras").value
                for(let j = 0; j < arrayCreacionCategoriaTallas.length; j++){
                    if(codigoMovimientos.includes("-" + arrayCreacionCategoriaTallas[j])){
                        codigoMovimientos = codigoMovimientos.replace("-" + arrayCreacionCategoriaTallas[j], "-" + arrayCreacionCategoriaTallas[i])
                    }
                };
                if(base_datos_busqueda.find(y => y.codigo == codigoMovimientos)){
                    base = base_datos_busqueda.find(y => y.codigo == codigoMovimientos)
                    crearBodyRecompras(codigoMovimientos, base.idProd)
                };
            };
        };
        document.querySelectorAll(".codigo_compras_modal").forEach((event)=>{
            if(event.textContent === document.getElementById("codigo-compras").value){
                event.style.background = "var(--boton-tres)"
            }
        });
        document.querySelector(".contenedor-pre-recompra").classList.add("modal-show")
        await buscarPorCodido();
        operarCantidadARecomprar();
        marcarIdRepetido(".id_compras_modal", ".id_compras_proforma", document.querySelector("#tabla_principal > thead > tr:nth-child(1) > th > h2").textContent)
        arrayCreacionCategoriaTallas = [];
        document.querySelector("#tabla_modal > tbody > tr > td:nth-child(8) > input").focus();
    };
};
////////////////CON ESTO SE LLENA LA TABLA PREMODIFICACION Y SE FILTRA LAS FILAS CON ID///////////////////////////////////
async function buscarPorCodido(){
    const id_rec = document.querySelectorAll(".id_compras_modal");
    let ids = Array.from(id_rec).map(element => element.textContent);
    let response = await cargarDatos(   `almacen_central_id_sucursal?`+
                                        `ids=${ids.join(",")}&`+
                                        `sucursal_get=${sucursales_activas[indice_sucursal_recompras]}`);

    for(id_c of id_rec){
        let row_ = id_c.closest("tr");
        let proveedor_busqueda = JSON.parse(localStorage.getItem("base_datos_prov"))
        let fila_res = response.find(x=> x.idProd === Number(row_.children[0].textContent))
        if(fila_res){
            row_.children[4].textContent = fila_res.descripcion
            row_.children[5].textContent = fila_res.talla
            row_.children[6].textContent = fila_res.sucursal_get
            row_.children[8].textContent = fila_res.costo_unitario.toFixed(2)
            row_.children[10].textContent = fila_res.precio_venta.toFixed(2)
            row_.children[11].textContent = fila_res.lote
            row_.children[12].textContent = proveedor_busqueda.find(y => y.id_cli == fila_res.proveedor).nombre_cli//buscamos nombre de proveedor
            if(row_.children[0].textContent == document.getElementById("id-compras").value){
                id_c.style.background = "var(--boton-tres)"
                id_c.style.color = "var(--color-secundario)"
            };
        };
        if(row_.children[0].textContent  < 1){//OCULTAMOS LAS FILAS QUE NO MUESTRAN ID O NO EXISTEN EL LA TABLA PRODUCTOS
            row_.remove()
        };
    };
};
///////////////////////////////////ARITMETICA///////////////////////////////////////////////////////////
function operarCantidadARecomprar(){
    const cantidadARecomprar = document.querySelectorAll(".insertarNumero");
    cantidadARecomprar.forEach((e)=>{
        e.addEventListener("keyup",(i)=>{
            i.target.parentNode.parentNode.children[9].textContent = //Costo Total
                (Number(i.target.value) * Number(i.target.parentNode.parentNode.children[8].textContent)).toFixed(2)

            i.target.parentNode.parentNode.children[13].textContent = // Total stock
                Number(i.target.value) + Number(i.target.parentNode.parentNode.children[6].textContent)
        });
    });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function filaBodyProformaPincipal(){
    const fila_modal = document.querySelectorAll(".codigo_compras_modal");
    fila_modal.forEach((event)=>{
        let row_ = event.closest("tr");
        row_.children[7].children[0].style.background = ""

        if(Number(row_.children[7].children[0].value) > 0 &&
        row_.children[7].children[0].value !== "" ){
            let fila_principal = document.querySelector("#tabla_principal > tbody");
            let nueva_fila_principal = fila_principal.insertRow(-1);
            let fila = `<tr>`+
                            `<td class="id_compras_proforma invisible">${row_.children[0].textContent}</td>`+// Columna 0 > id
                            `<td>${row_.children[1].textContent}</td>`+// Columna 1 > sucursal
                            `<td>${row_.children[2].textContent}</td>`+// Columna 2 > categoría
                            `<td class="codigo_compras_proforma">${event.textContent}</td>`+// Columna 3 > código
                            `<td>${row_.children[4].textContent}</td>`+// Columna 4 > descripción
                            `<td>${row_.children[5].textContent}</td>`+// Columna 5 > talla
                            `<td style="text-align: right">${row_.children[7].children[0].value}</td>`+// Columna 6 > cantidad a comprar
                            `<td style="text-align: right">${row_.children[8].textContent}</td>`+// Columna 7 > Costo unitario
                            `<td style="text-align: right">${row_.children[9].textContent}</td>`+// Columna 8 > Costo Total
                            `<td style="text-align: right">${row_.children[10].textContent}</td>`+// Columna 9 > precio de venta
                            `<td style="text-align: right">${row_.children[11].textContent}</td>`+// Columna 10 > lote
                            `<td style="text-align: right">${row_.children[12].textContent}</td>`+// Columna 11 > proveedor
                            `<td class="invisible">${row_.children[13].textContent}</td>`+// Columna 12 > esistencias + cantidad a comprar
                            `<td class="invisible">${row_.children[14].textContent}</td>`+// Columna 13 > id sucursal
                            `<td class="invisible">${row_.children[15].textContent}</td>`+// Columna 14 > índice sucursal sucursal
                            `<td style="text-align: center">
                                <div class="tooltip">
                                    <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFila(this)">delete</span>
                                    <span class="tooltiptext">Eliminar producto</span>
                                </div>
                            </td>`+// Columna 15 >
                        `</tr>`
            nueva_fila_principal.innerHTML = fila;
        }else if(Number(row_.children[7].children[0].value) <= 0 ||
        row_.children[7].children[0].value === ""){
            row_.children[7].children[0].style.background = "#b36659"
        };
    });
};
const mandarATablaRecomprasPrincipal = document.getElementById("procesar-pre-recompra");
mandarATablaRecomprasPrincipal.addEventListener("click", mandarATablaPrincipal)
function mandarATablaPrincipal(e){
    e.preventDefault();
    let id_sucursal = document.getElementById("fffff-sucursal").value;//guardamos la sucursal 
    removerProductoRepetido();
    filaBodyProformaPincipal();
    const borrar = document.querySelectorAll(".insertarNumero");//eliminamos las filas de la tabla modal que si pasaron a la tabla principal
    borrar.forEach((e)=>{
        if(e.value > 0){
            e.parentNode.parentNode.remove()
        }
    })
    let sumaTotalCantidadComprada= 0;
        let sumaTotalCompra = 0;
        let numeroFilasTablaCompras = document.querySelector("#tabla_principal > tbody").rows.length;
        for(let i = 0; i < numeroFilasTablaCompras; i++){
            sumaTotalCompra += Number(document.querySelector("#tabla_principal > tbody").children[i].children[8].innerHTML) 
            sumaTotalCantidadComprada += Number(document.querySelector("#tabla_principal > tbody").children[i].children[6].innerHTML) 
    }
    if(document.querySelector("#tabla_modal > tbody").children.length == 0){
        document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show")
        document.querySelector("#tabla_modal > thead > tr:nth-child(2)").remove()
    }
    document.getElementById("total-importe-tabla-compras").textContent = sumaTotalCompra.toFixed(2);
    document.getElementById("total-cantidad-tabla-compras").textContent = sumaTotalCantidadComprada;
    document.getElementById("formulario-compras-uno").reset()
    document.getElementById("fffff-sucursal").value = id_sucursal
    document.getElementById("id-compras").value = ""
    document.getElementById("buscador-productos-compras").focus();
};

const procesarComprasPlus = document.querySelector("#procesar-compras-plus");
procesarComprasPlus.addEventListener("click", procesamientoRecompras)
async function procesamientoRecompras(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla_principal > tbody").children.length > 0){
            modal_proceso_abrir("Procesando la recompra!!!.", "")
            
            await funcionGeneralRecompras();
            if(document.querySelector("#check_comprobante").checked){
                imprimirListaTabla()//Lista de compras
            };
            document.querySelector("#tabla_principal > tbody").remove();
            document.querySelector("#tabla_principal").createTBody();
            
        };
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. " + error, "")
        console.error("Ocurrió un error. ", error)
        modal_proceso_salir_botones()
    };
};
async function funcionGeneralRecompras(){
    let array_productos_dos = [];
    let array_entradas_dos = [];
    function DatosProductosDos(a){
        this.idProd = a.children[0].textContent;
        this.sucursal_post = sucursales_activas[Number(a.children[14].textContent)];//Elegimos la columna de la sucursal a agregar
        this.existencias_post = a.children[6].textContent;
    };
    function DatosEntradasDos(a){
        this.idProd = a.children[0].textContent;
        this.existencias_entradas = a.children[6].textContent;
        this.sucursal = a.children[13].textContent;
    };
    const numFilas = document.querySelector("#tabla_principal > tbody").children
    for(let i = 0 ; i < numFilas.length; i++ ){
        if(numFilas[i]){
            array_productos_dos.push(new DatosProductosDos(numFilas[i]))
            array_entradas_dos.push(new DatosEntradasDos(numFilas[i]))
        };
    };
    function DatosRecompra(){
        this.id_num = datos_usuario[0].id;
        this.fecha = generarFecha();
        this.array_productos_dos = array_productos_dos;
        this.array_entradas_dos = array_entradas_dos;
    };
    let url_recompra = URL_API_almacen_central + 'gestion_de_recompras'
    let objeto_recompra = new DatosRecompra();

    let response = await funcionFetchDos(url_recompra, objeto_recompra);
    if(response.status === "success"){
        modal_proceso_abrir(`Operación "${response.message}" completada exitosamente.`)
        modal_proceso_salir_botones()
    };
};

const removerTablaComprasUno = document.getElementById("remover-tabla-compras-uno");
removerTablaComprasUno.addEventListener("click", () =>{
    document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show")
    document.querySelector("#tabla_modal > thead > tr:nth-child(2)").remove()
    document.querySelector("#tabla_modal > tbody").remove();
    document.querySelector("#tabla_modal").createTBody();
    if(comprasNumerador == 0){
        document.getElementById("codigo-compras").focus();
    }else if(comprasNumerador == 1){
        document.getElementById("buscador-productos-compras").focus();
    };
});

const removerTablaComprasDos = document.getElementById("remover-tabla-compras-dos");
removerTablaComprasDos.addEventListener("click", () =>{
    document.querySelector("#tabla_principal > tbody").remove();
    document.querySelector("#tabla_principal").createTBody();
    if(comprasNumerador == 0){
        document.getElementById("codigo-compras").focus();
    }else if(comprasNumerador == 1){
        document.getElementById("buscador-productos-compras").focus();
    };
    
});
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("boton_buscar_codigo").addEventListener("click", ()=>{
    busquedaDetalle(0, document.getElementById("buscador_descripcion").value)
    document.getElementById("buscador_descripcion").focus()
});
document.getElementById("boton_buscar_descripcion").addEventListener("click", ()=>{
    busquedaDetalle(1, document.getElementById("buscador_descripcion").value)
    document.getElementById("buscador_descripcion").focus()
});
document.getElementById("boton_borrar_").addEventListener("click", ()=>{

    document.getElementById("categoria_buscador_detalle").value = "0";
    document.getElementById("periodo_tiempo").value = "0";
    document.getElementById("buscador_descripcion").value = ""
    document.getElementById("buscador_descripcion").focus()
    removerMarcaBotonDos()
});
function agregarBusquedaDetalleUno(button){
    if(document.getElementById("recompra-producto-plus").classList.contains('marcaBoton')){
        let linea = button.closest("li");
        indice_sucursal_recompras = obtenerIndiceSucursal();
        document.getElementById('id-compras').value = linea.children[0].textContent;
        document.getElementById('categoria-compras').value = linea.children[1].textContent;
        document.getElementById('codigo-compras').value = linea.children[2].textContent;
        document.getElementById('descripcion-compras').value = linea.children[3].textContent;
    }else{
        modal_proceso_abrir(`Esta acción solo procederá en "Recomprar Producto".`, ``)
        modal_proceso_salir_botones()
    };
};
function agregarBusquedaDetalleDos(button){
    if(document.getElementById("recompra-producto-plus").classList.contains('marcaBoton')){
        let linea = button.closest("li");
        document.getElementById('id-compras').value = linea.children[0].textContent;
        document.getElementById("fffff-sucursal").value = linea.children[1].textContent;
        indice_sucursal_recompras = obtenerIndiceSucursal();
        document.getElementById('categoria-compras').value = linea.children[2].textContent;
        document.getElementById('codigo-compras').value = linea.children[3].textContent;
        document.getElementById('descripcion-compras').value = linea.children[4].textContent;
    }else{
        modal_proceso_abrir(`Esta acción solo procederá en "Recomprar Producto".`, ``)
        modal_proceso_salir_botones()
    };
};
function clicKEliminarFila(e) {
    const fila = e.closest("tr");
    fila.remove();
};