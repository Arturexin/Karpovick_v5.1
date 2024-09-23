document.addEventListener("DOMContentLoaded", inicioModificacion)
let anio_principal = ""
function inicioModificacion(){
    anio_principal = new Date().getFullYear()
    cargarDatosAnio()
    btnModificacion = 1;
    mostrarFormRegistro()
    indice_base = JSON.parse(localStorage.getItem("base_datos_consulta"))

    llenarCategoriaProductosEjecucion("#categoria_buscador_detalle")
};
const barras_modificacion = [".cg_1_t", ".cg_2_t", ".cg_3_t", ".cg_4_t", ".cg_5_t"]
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{

        anio_principal = anio_referencia.value;
        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
let indice_sucursal_modificacion = 0;

function formulario_registro(){
    let formRegistro = `
    <div class="into_form baja_opacidad_interior">
                    <h2>Registro
                        <div class="tooltip_ayuda">
                            <span class="material-symbols-outlined">help</span>
                            <span class="tooltiptext_ayuda">Ingresa productos en forma de traspaso en la base de datos.</span>
                        </div>
                    </h2>
                    <label>Sucursal 
                        <select name="fffff-sucursal" id="fffff-sucursal" class="input-select-ventas">
                        </select>
                        <div class="tooltip_ayuda">
                            <span class="material-symbols-outlined">help</span>
                            <span class="tooltiptext_ayuda">Seleccione una sucursal de traspaso.</span>
                        </div>
                    </label>
                    <div class="contenedor-label-input-compras">
                        <div>
                            <input class="input-compras fondo" class="caja-texto" type="hidden" id="id-modificacion" name="id-modificacion" />
                            <label class="label-general">
                                <div style="display: flex">Categoría
                                    <div class="tooltip_ayuda">
                                        <span class="material-symbols-outlined">help</span>
                                        <span class="tooltiptext_ayuda">Cada categoría presenta diferentes medidas.</span>
                                    </div>
                                </div>   
                                <select name="categoria-modificacion" id="categoria-modificacion" class="input-general fondo" style="cursor: pointer;">
                                </select>
                            </label>
                            <label class="label-general">
                                <div style="display: flex">Código
                                    <div class="tooltip_ayuda">
                                        <span class="material-symbols-outlined">help</span>
                                        <span class="tooltiptext_ayuda">El código solo puede contener como caracteres letras y números. (Ejemplo: Ab001).</span>
                                    </div>
                                </div>
                                <input class="input-general fondo" type="text" id="codigo-modificacion" name="codigo-modificacion"/>
                            </label>
                            <label class="label-general">
                                <div style="display: flex">Descripción
                                    <div class="tooltip_ayuda">
                                        <span class="material-symbols-outlined">help</span>
                                        <span class="tooltiptext_ayuda">La descripción del producto solo puede contener como caracteres letras y números.</span>
                                    </div>
                                </div>
                                <input class="input-general fondo" type="text" id="descripcion-modificacion" name="descripcion-modificacion"/>
                            </label>
                            <label class="label-general">
                                <div style="display: flex">Costo de compra
                                    <div class="tooltip_ayuda">
                                        <span class="material-symbols-outlined">help</span>
                                        <span class="tooltiptext_ayuda">EL costo unitario del producto solo puede contener números.</span>
                                    </div>
                                </div>
                                <input class="input-general fondo" type="text" id="pcompra-modificacion" name="pcompra-modificacion"/>
                            </label>
                            <label class="label-general">
                                <div style="display: flex">Precio de venta
                                    <div class="tooltip_ayuda">
                                        <span class="material-symbols-outlined">help</span>
                                        <span class="tooltiptext_ayuda">EL precio de venta unitario del producto solo puede contener números.</span>
                                    </div>
                                </div>
                                <input class="input-general fondo" type="text" id="pventa-modificacion" name="pventa-modificacion"/>
                            </label>
                            <label class="label-general">
                                <div style="display: flex">Lote
                                    <div class="tooltip_ayuda">
                                        <span class="material-symbols-outlined">help</span>
                                        <span class="tooltiptext_ayuda">El lote de producto solo puede contener números.</span>
                                    </div>
                                </div>
                                <input class="input-general fondo" type="text" id="lote-modificacion" name="lote-modificacion"/>
                            </label>
                            <label class="label-general">
                                <div style="display: flex">Proveedor
                                    <div class="tooltip_ayuda">
                                        <span class="material-symbols-outlined">help</span>
                                        <span class="tooltiptext_ayuda">Si no encuentra el proveedor correspondiente, asegurese de haberlo ingresado previamente en el apartado de "Clientes".</span>
                                    </div>
                                </div>
                                <select class="input-general fondo" id="proveedor-modificacion" style="cursor: pointer;">
                                </select>
                            </label>
                        </div>
                    </div>
                    <div class="boton-cli">
                        <button id="mandar-tabla-modificacion" class="myButtonAgregar">Agregar a Proforma</button>
                        <input type="reset" class="myButtonEliminar">
                    </div> 
    </div>   
                        `;
    document.getElementById("formulario-modificacion").innerHTML = formRegistro;
};

let modificacionNumerador = 0;
const botonRegistrarRegistro = document.getElementById("registra-modificacion");
botonRegistrarRegistro.addEventListener("click", (e)=>{
    e.preventDefault();
    mostrarFormRegistro()
});

function mostrarFormRegistro(){
    formulario_registro()
    cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))
    llenarCategoriaProductosEjecucion("#categoria-modificacion")
    baseProv("#proveedor-modificacion")

    document.getElementById("registra-modificacion").classList.add("marcaBoton")
    document.getElementById("editar-modificacion").classList.remove("marcaBoton")
    document.getElementById("codigo-modificacion").focus();
    document.querySelector(".baja_opacidad_interior").classList.add("alta_opacidad_interior")
    document.getElementById("procesar-modificacion-uno").classList.remove("invisible")
    document.getElementById("procesar-modificacion-dos").classList.add("invisible")
    document.getElementById("procesar-registro").classList.remove("invisible")
    document.getElementById("procesar-modificacion-principal").classList.add("invisible")
    document.getElementById("id-modificacion").value = ""
    document.querySelector("#tabla-pre-modificacion > tbody").remove()
    document.querySelector("#tabla-pre-modificacion").createTBody()
    document.querySelector("#tabla-proforma-modificacion > tbody").remove()
    document.querySelector("#tabla-proforma-modificacion").createTBody()

    modificacionNumerador = 0;
    const mandarNuevoProductoATabla = document.getElementById("mandar-tabla-modificacion");
    mandarNuevoProductoATabla.addEventListener("click", agregarNuevoProductoATablaModificacion)
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////REGISTRAR PRODUCTOS//////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let codigoComprobacionRegistro = ""


function crearBodyRegistro(tallaRegistro, loteRegistro){
    let tablaRegistro = document.querySelector("#tabla-pre-modificacion > tbody");
    let nuevaFilaTablaRegistro = tablaRegistro.insertRow(-1);
    let fila = `<tr>`+
                    `<td>${suc_add[obtenerIndiceSucursal()]}</td>`+// Columna 0 > sucursal
                    `<td>${document.getElementById("categoria-modificacion").children[document.getElementById("categoria-modificacion").selectedIndex].textContent}</td>`+// Columna 1 > categoría
                    `<td class="codigo_modal" style="background: rgb(105, 211, 35)">${document.getElementById("codigo-modificacion").value}-${tallaRegistro}-${loteRegistro}</td>`+// Columna 2 > código
                    `<td><input class="input-tablas-texto-largo" value="${document.getElementById("descripcion-modificacion").value}" placeholder="Rellene esta celda"></td>`+// Columna 3 > descripción
                    `<td>${tallaRegistro}</td>`+// Columna 4 > talla
                    `<td><input class="input-tablas-dos-largo existencias-modificacion" placeholder="valor >= 0"></td>`+// Columna 5 > cantidad
                    `<td><input class="input-tablas-dos-largo costo-unitario-modificacion" value="${(Number(document.getElementById("pcompra-modificacion").value)).toFixed(2)}" placeholder="valor >= 0"></td>`+// Columna 6 > costo unitario
                    `<td style="text-align: right"></td>`+// Columna 7 > Costo Total
                    `<td><input class="input-tablas-dos-largo" value="${(Number(document.getElementById("pventa-modificacion").value)).toFixed(2)}" placeholder="valor >= C"></td>`+// Columna 8 > precio de venta
                    `<td>${loteRegistro}</td>`+// Columna 9 > lote
                    `<td>${document.getElementById("proveedor-modificacion").children[document.getElementById("proveedor-modificacion").selectedIndex].textContent}</td>`+// Columna 10 > proveedor
                    `<td class="invisible">${document.getElementById("proveedor-modificacion").value}</td>`+// Columna 11 > id proveedor
                    `<td class="invisible">${document.getElementById("fffff-sucursal").value}</td>`+// Columna 12 > id sucursal
                    `<td class="invisible">${document.getElementById("categoria-modificacion").value}</td>`+// Columna 13 > id categoría
                    `<td class="invisible">${obtenerIndiceSucursal()}</td>`+// Columna 14 > índice sucursal
                    `<td style="text-align: center">
                        <div class="tooltip">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFila(this)">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </div>
                    </td>`+// Columna 15 > botón eliminar fila
                `</tr>`
    nuevaFilaTablaRegistro.innerHTML = fila;
    codigoComprobacionRegistro = document.getElementById("codigo-modificacion").value + "-" + tallaRegistro + "-" + loteRegistro;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////PASAR DATOS DE FORMULARIO A TABLA DE MODIFICACIÓN///////////////////////////////////////////////

function agregarNuevoProductoATablaModificacion(e){
    e.preventDefault();
    if(expregul.codigo.test(document.getElementById("codigo-modificacion").value) &&
    expregul.descripcion.test(document.getElementById("descripcion-modificacion").value) &&
    expregul.cantidad.test(document.getElementById("lote-modificacion").value) &&
    expregul.precios.test(document.getElementById("pcompra-modificacion").value) &&
    expregul.precios.test(document.getElementById("pventa-modificacion").value)){
        ///////////////////////////////////////////////////////////////////////////////
        document.querySelector(".contenedor-pre-modificacion").classList.add("modal-show-modificacion");//Mostrmos el modal
        let arrayCreacionCategoriaTallas = categoriaProductosCreacion(document.getElementById("categoria-modificacion"));//Evaluamos la categoría
        compararCodigosNuevos(".codigo_modal", codigoComprobacionRegistro, ".label-modificacion");
        ///////////////////////////////////////////////////////////////////////////////
        arrayCreacionCategoriaTallas.forEach((event) =>{
            crearBodyRegistro(event, document.getElementById("lote-modificacion").value)
        });
        document.getElementById("categoria-modificacion").style.background = ""
        document.getElementById("codigo-modificacion").style.background = ""
        document.getElementById("descripcion-modificacion").style.background = ""
        document.getElementById("lote-modificacion").style.background = ""
        document.getElementById("pcompra-modificacion").style.background = ""
        document.getElementById("pventa-modificacion").style.background = ""
        document.getElementById("proveedor-modificacion").style.background = ""

        operacionCostoTotalCreacion();
        comprobarCodigoProductos(".codigo_modal");
        marcarCodigoRepetido(".codigo_modal", ".codigo_proforma", 
                            document.querySelector("#tabla-proforma-modificacion > thead > tr:nth-child(1) > th > h2").textContent)
        arrayCreacionCategoriaTallas = [];
        document.querySelector("#tabla-pre-modificacion > tbody > tr:nth-child(1) > td:nth-child(6) > input").focus()

    }else if(expregul.codigo.test(document.getElementById("codigo-modificacion").value) == false){
        document.getElementById("codigo-modificacion").style.background ="#b36659"
    }else if(expregul.descripcion.test(document.getElementById("descripcion-modificacion").value) == false){
        document.getElementById("descripcion-modificacion").style.background ="#b36659"
    }else if(expregul.precios.test(document.getElementById("pcompra-modificacion").value) == false){
        document.getElementById("pcompra-modificacion").style.background ="#b36659"
    }else if(expregul.precios.test(document.getElementById("pventa-modificacion").value) == false){
        document.getElementById("pventa-modificacion").style.background ="#b36659"
    }else if(expregul.cantidad.test(document.getElementById("lote-modificacion").value) == false){
        document.getElementById("lote-modificacion").style.background ="#b36659"
    };
};
function operacionCostoTotalCreacion(){
    const existenciasModificacion = document.querySelectorAll(".existencias-modificacion");
    existenciasModificacion.forEach((event)=>{
        event.addEventListener("keyup", (e) => {
            e.target.parentNode.parentNode.children[7].textContent = (Number(e.target.parentNode.parentNode.children[6].children[0].value *
                e.target.value)).toFixed(2)
        });
    });
    const costoUnitarioModificacion = document.querySelectorAll(".costo-unitario-modificacion");
    costoUnitarioModificacion.forEach((event)=>{
        event.addEventListener("keyup", (e) => {
            e.target.parentNode.parentNode.children[7].textContent = (Number(e.target.parentNode.parentNode.children[5].children[0].value *
                e.target.value)).toFixed(2)
        });
    });
};
function filaBodyProformaPincipal(){
    const fila_modal = document.querySelectorAll(".codigo_modal");
    fila_modal.forEach((event)=>{

        event.parentNode.children[3].children[0].style.background = ""
        event.parentNode.children[5].children[0].style.background = ""
        event.parentNode.children[6].children[0].style.background = ""
        event.parentNode.children[8].children[0].style.background = ""
        
        if(event.parentNode.children[3].children[0].value !== "" &&
        Number(event.parentNode.children[5].children[0].value) >= 0 &&
        event.parentNode.children[5].children[0].value !== "" &&
        Number(event.parentNode.children[6].children[0].value) >= 0 &&
        event.parentNode.children[6].children[0].value !== "" &&
        Number(event.parentNode.children[8].children[0].value) >= Number(event.parentNode.children[6].children[0].value) &&
        event.parentNode.children[8].children[0].value !== ""){
            let fila_principal = document.querySelector("#tabla-proforma-modificacion > tbody");
            let nueva_fila_principal = fila_principal.insertRow(-1);
            let fila = `<tr>`+
                            `<td>${event.parentNode.children[0].textContent}</td>`+// Columna 0 > sucursal
                            `<td>${event.parentNode.children[1].textContent}</td>`+// Columna 1 > categoría
                            `<td class="codigo_proforma">${event.textContent}</td>`+// Columna 2 > código 
                            `<td>${event.parentNode.children[3].children[0].value}</td>`+// Columna 3 > descripción
                            `<td>${event.parentNode.children[4].textContent}</td>`+// Columna 4 > talla
                            `<td style="text-align: right">${event.parentNode.children[5].children[0].value}</td>`+// Columna 5 > cantidad
                            `<td style="text-align: right">${event.parentNode.children[6].children[0].value}</td>`+// Columna 6 > costo unitario
                            `<td style="text-align: right">${event.parentNode.children[7].textContent}</td>`+// Columna 7 > Costo Total
                            `<td style="text-align: right">${event.parentNode.children[8].children[0].value}</td>`+// Columna 8 > precio de venta
                            `<td style="text-align: right">${event.parentNode.children[9].textContent}</td>`+// Columna 9 > lote
                            `<td style="text-align: right">${event.parentNode.children[10].textContent}</td>`+// Columna 10 > proveedor
                            `<td class="invisible">${event.parentNode.children[11].textContent}</td>`+// Columna 11 > id proveedor
                            `<td class="invisible">${event.parentNode.children[12].textContent}</td>`+// Columna 12 > id sucursal
                            `<td class="invisible">${event.parentNode.children[13].textContent}</td>`+// Columna 13 > id categoría
                            `<td class="invisible">${event.parentNode.children[14].textContent}</td>`+// Columna 14 > índice sucursal
                            `<td style="text-align: center">
                                <div class="tooltip">
                                    <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFila(this)">delete</span>
                                    <span class="tooltiptext">Eliminar producto</span>
                                </div>
                            </td>`+// Columna 15 > botón eliminar fila
                        `</tr>`
            nueva_fila_principal.innerHTML = fila;
        }else if(event.parentNode.children[3].children[0].value === ""){
            event.parentNode.children[3].children[0].style.background = "#b36659"
        }else if(Number(event.parentNode.children[5].children[0].value) < 0 ||
        event.parentNode.children[5].children[0].value === ""){
            event.parentNode.children[5].children[0].style.background = "#b36659"
        }else if(Number(event.parentNode.children[6].children[0].value) < 0 ||
        event.parentNode.children[6].children[0].value === ""){
            event.parentNode.children[6].children[0].style.background = "#b36659"
        }else if(Number(event.parentNode.children[8].children[0].value) < Number(event.parentNode.children[6].children[0].value) ||
        event.parentNode.children[8].children[0].value === ""){
            event.parentNode.children[8].children[0].style.background = "#b36659"
        };
    });
};
const procesarIngresarNuevo = document.getElementById("procesar-modificacion-uno");
procesarIngresarNuevo.addEventListener("click", (e) => {
    e.preventDefault();
    let id_sucursal = document.getElementById("fffff-sucursal").value;//guardamos la sucursal
    removerCodigoRepetido(".codigo_modal", ".codigo_proforma", 6)
    filaBodyProformaPincipal()
    const borrar = document.querySelectorAll(".existencias-modificacion");//eliminamos las filas de la tabla modal que si pasaron a la tabla principal
    borrar.forEach((e)=>{
        if(Number(e.value) >= 0 && e.value !== "" && 
        Number(e.parentNode.parentNode.children[6].children[0].value) >= 0 && 
        e.parentNode.parentNode.children[6].children[0].value !== "" &&
        Number(e.parentNode.parentNode.children[8].children[0].value) >= Number(e.parentNode.parentNode.children[6].children[0].value) && 
        e.parentNode.parentNode.children[8].children[0].value !== "" &&
        e.parentNode.parentNode.children[3].children[0].value !== ""){
            e.parentNode.parentNode.remove();
        }
    });
    if(document.querySelector("#tabla-pre-modificacion > tbody").children.length == 0){
        document.querySelector(".contenedor-pre-modificacion").classList.remove("modal-show-modificacion")
    }
    document.getElementById("formulario-modificacion").reset()
    document.getElementById("id-modificacion").value = ""
    document.getElementById("fffff-sucursal").value = id_sucursal;// Con id_sucursal mantenemos la sucursal
    document.getElementById("codigo-modificacion").focus();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const procesarRegistro = document.getElementById("procesar-registro");
procesarRegistro.addEventListener("click", procesamientoRegistros)
async function procesamientoRegistros(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla-proforma-modificacion > tbody").children.length > 0){
            modal_proceso_abrir("Procesando el traspaso!!!.", "")
            await funcionGeneralTraspaso();
        };
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. " + error, "")
        console.error("Ocurrió un error. ", error)
        modal_proceso_salir_botones()
    };
};
async function funcionGeneralTraspaso(){
    let array_productos = [];
    let array_entradas = [];
    function DatosProductos(a){
        this.categoria= a.children[13].textContent;
        this.codigo= a.children[2].textContent;
        this.costo_unitario= a.children[6].textContent;
        this.descripcion= a.children[3].textContent;
        this.lote= a.children[9].textContent;
        this.precio_venta= a.children[8].textContent;
        this.proveedor= a.children[11].textContent;
        this.talla= a.children[4].textContent;

        for(let i = 0; i < sucursales_activas.length; i++){//agregamos la cantidad a comprar de acuerdo al índice de la sucursal
            this[sucursales_activas[i]] = Number(a.children[14].textContent) === i ? Number(a.children[5].textContent) : 0;
        };
    }
    function DatosEntradas(a){
        this.sucursal = a.children[12].textContent;
        this.comprobante = "Traspaso";
        this.existencias_entradas = a.children[5].textContent;
        this.fecha = generarFecha();
        this.codigo = a.children[2].textContent;
    }
    let numFilas = document.querySelector("#tabla-proforma-modificacion > tbody").children;
    for(let i = 0 ; i < numFilas.length; i++ ){
        if(numFilas[i]){
            array_productos.push(new DatosProductos(numFilas[i]))
            array_entradas.push(new DatosEntradas(numFilas[i]))
        };
    };

    function DatosTraspaso(){
        this.array_productos = array_productos;
        this.array_entradas = array_entradas;
    };

    let url_Traspaso = URL_API_almacen_central + 'gestion_de_traspasos'
    let objeto_Traspaso = new DatosTraspaso();
    let response = await funcionFetch(url_Traspaso, objeto_Traspaso);
    if(response.status === 200){
        localStorage.setItem("base_datos_consulta", JSON.stringify(await cargarDatos('almacen_central_ccd')))
        modal_proceso_abrir('Operación completada exitosamente.', "")
        modal_proceso_salir_botones()
    };
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////MODIFICACION DE PRODUCTOS/////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////BUSCAR EN PRODUCTOS /////////////////////////////////////////////////////
function cambioSucursalModificacion(id){
    document.getElementById(id).addEventListener("change", ()=>{
        indice_sucursal_modificacion = document.getElementById("fffff-sucursal").selectedIndex;
        document.getElementById("buscador-productos-modificacion").focus();
    });
};
function formulario_edit(){
    let formEdit = `
    <div class="into_form baja_opacidad_interior">
                    <h2>Edición
                        <div class="tooltip_ayuda">
                            <span class="material-symbols-outlined">help</span>
                            <span class="tooltiptext_ayuda">Modifica datos de productos existentes en la base de datos.</span>
                        </div>
                    </h2>
                    <div>Sucursal
                        <select name="fffff-sucursal" id="fffff-sucursal" class="input-select-ventas">
                        </select>
                        <div class="tooltip_ayuda">
                            <span class="material-symbols-outlined">help</span>
                            <span class="tooltiptext_ayuda">Seleccione la sucursal del producto a modificar.</span>
                        </div>
                    </div>
                    <div style="display: flex">
                        <input id="buscador-productos-modificacion" type="text" class="input-general-importante fondo-importante" placeholder="Buscar Código"> 
                        <div class="tooltip_ayuda">
                            <span class="material-symbols-outlined">find_in_page</span>
                            <span class="tooltiptext_ayuda">Digite caracteres clave del código a buscar.</span>
                        </div>
                    </div>
                    <div class="contenedor-label-input-compras">
                        <div>
                            <input class="input-compras fondo" class="caja-texto" type="hidden" id="id-modificacion" name="id-modificacion" />
                            <label class="label-general">Categoría    
                                <select name="categoria-modificacion" id="categoria-modificacion" class="input-general fondo">
                                </select>
                            </label>
                            <label class="label-general">Código<input class="input-general fondo" type="text" id="codigo-modificacion" name="codigo-modificacion"/></label>
                            <label class="label-general">Descripción<input class="input-general fondo" type="text" id="descripcion-modificacion" name="descripcion-modificacion"/></label>
                        </div>
                    </div>
                    <div class="boton-cli">
                        <button id="mandar-editar-modificacion" class="myButtonAgregar">Agregar a Proforma</button>
                        <input onClick="reseteoFormulario()" type="reset" class="myButtonEliminar">
                    </div> 
    </div>    
                        `;
    document.getElementById("formulario-modificacion").innerHTML = formEdit;
};
const botonEditarProducto = document.getElementById("editar-modificacion");
botonEditarProducto.addEventListener("click", (e) =>{
    e.preventDefault();
    formulario_edit()
    cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))
    llenarCategoriaProductosEjecucion("#categoria-modificacion");
    cambioSucursalModificacion("fffff-sucursal")

    document.getElementById("registra-modificacion").classList.remove("marcaBoton")
    document.getElementById("editar-modificacion").classList.add("marcaBoton")
    document.getElementById("buscador-productos-modificacion").focus();
    document.querySelector(".baja_opacidad_interior").classList.add("alta_opacidad_interior") 
    document.getElementById("categoria-modificacion").setAttribute("disabled", "true")
    document.getElementById("codigo-modificacion").setAttribute("disabled", "true")
    document.getElementById("descripcion-modificacion").setAttribute("disabled", "true")  
    document.getElementById("procesar-modificacion-uno").classList.add("invisible")
    document.getElementById("procesar-modificacion-dos").classList.remove("invisible")
    document.getElementById("procesar-registro").classList.add("invisible")
    document.getElementById("procesar-modificacion-principal").classList.remove("invisible")                
    document.getElementById("id-modificacion").value = ""
    document.querySelector("#tabla-pre-modificacion > tbody").remove()
    document.querySelector("#tabla-pre-modificacion").createTBody()
    document.querySelector("#tabla-proforma-modificacion > tbody").remove()
    document.querySelector("#tabla-proforma-modificacion").createTBody()

    modificacionNumerador = 1;
    const mandarATablaModificacion = document.getElementById("mandar-editar-modificacion");
    mandarATablaModificacion.addEventListener("click", agregarATablaPreModificacion)
});
function reseteoFormulario(){
    document.getElementById("id-modificacion").value = "";
    document.getElementById('categoria-modificacion').value = "0";
    document.getElementById('codigo-modificacion').value = "";
    document.getElementById('descripcion-modificacion').value = "";
};
document.addEventListener("keyup", () =>{
    if(modificacionNumerador == 0){
        return;
    }else{
        
        let almacenCentral = indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-productos-modificacion').value.toLocaleLowerCase()))
        if(almacenCentral){
            indice_sucursal_modificacion = obtenerIndiceSucursal();
            document.getElementById('id-modificacion').value = almacenCentral.idProd
            document.getElementById('categoria-modificacion').value = almacenCentral.categoria
            document.getElementById('codigo-modificacion').value = almacenCentral.codigo
            document.getElementById('descripcion-modificacion').value = almacenCentral.descripcion
            if(document.getElementById('buscador-productos-modificacion').value == ""){
                reseteoFormulario();
            }
        }else{
            reseteoFormulario();
        };
    };
    
});
function pintarCodigo(){
    
}
function removerModificacionRepetido(){//verificamos que el nuevo producto no tenga el mismo id en la tabla productos
    const idModal = document.querySelectorAll(".id_modificacion_modal");
    idModal.forEach((event) => {
        document.querySelectorAll(".id_modificacion_proforma").forEach((elemento) => {
            if(elemento.textContent === event.textContent && 
                elemento.parentNode.children[1].textContent === event.parentNode.children[1].textContent){
                elemento.parentNode.remove()
            }
        });
    });
};
function crearBodyModificacion(codigoModificacion, id_prod){
    let tablaMofidicacion = document.querySelector("#tabla-pre-modificacion > tbody");
    let nuevaFilaTablaModificacion = tablaMofidicacion.insertRow(-1);
    let fila = `<tr>`+
                    `<td class="id_modificacion_modal invisible">${id_prod}</td>`+// Columna 0 > id
                    `<td>${document.getElementById("fffff-sucursal").children[document.getElementById("fffff-sucursal").selectedIndex].textContent}</td>`+// Columna 1 > sucursal
                    `<td>
                        <select class="categoria_cambio">
                        </select>
                    </td>`+// Columna 2 > Categoría
                    `<td><input class="codigo_modal input-tablas" value="${codigoModificacion}" placeholder="Rellene esta celda"></td>`+// Columna 3 > Código
                    `<td><input class="input-tablas-texto-largo" placeholder="Rellene esta celda"></td>`+// Columna 4 > descripción
                    `<td>
                        <select class="medida_cambio">
                        </select>
                    </td>`+// Columna 5 > Talla
                    `<td><input class="existencias-modificacion input-tablas-dos-largo" placeholder="Valor >= 0"></td>`+// Columna 6 > existencias
                    `<td><input class="costo-unitario-modificacion input-tablas-dos-largo" placeholder="Valor >= 0"></td>`+// Columna 7 > costo unitario
                    `<td style="text-align: right"></td>`+// Columna 8 > Costo Total
                    `<td><input class="input-tablas-dos-largo" placeholder="Valor >= C"></td>`+// Columna 9 > precio de venta
                    `<td><input class="input-tablas-dos" placeholder="Valor > 0"></td>`+// Columna 10 > lote
                    `<td>
                        <select class="proveedor_cambio">
                        </select>
                    </td>`+// Columna 11 > proveedor
                    `<td class="invisible">${indice_sucursal_modificacion}</td>`+// Columna 12 > índice sucursal
                    `<td style="text-align: center">
                        <div class="tooltip">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFila(this)">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </div>
                    </td>`+// Columna 13 > botón eliminar fila
                `</tr>`
    nuevaFilaTablaModificacion.innerHTML = fila;
    rellenarCategoria()
    rellenarProveedor()
};

/////AQUI MANDAMOS A TABLA PREMODIFICACION PARA EDITAR VALORES/////////////////////////////////////////////////////////////

async function agregarATablaPreModificacion(e){
    e.preventDefault();
    let base_datos_busqueda = JSON.parse(localStorage.getItem("base_datos_consulta"))
    let base = 0;
    if(document.getElementById("id-modificacion").value > 0){
        let arrayCreacionCategoriaTallas = categoriaProductosCreacion(document.getElementById("categoria-modificacion"));

        for(let i = 0; i < arrayCreacionCategoriaTallas.length; i++){
            if(document.getElementById("id-modificacion").value > 0){
                let codigoModificacion = document.getElementById("codigo-modificacion").value
                for(let j = 0; j < arrayCreacionCategoriaTallas.length; j++){
                    if(codigoModificacion.includes("-" + arrayCreacionCategoriaTallas[j])){
                        codigoModificacion = codigoModificacion.replace("-" + arrayCreacionCategoriaTallas[j], "-" + arrayCreacionCategoriaTallas[i])
                    }
                };
                if(base_datos_busqueda.find(y => y.codigo == codigoModificacion)){
                    base = base_datos_busqueda.find(y => y.codigo == codigoModificacion)
                    crearBodyModificacion(codigoModificacion, base.idProd)
                };
            };
        };
        document.querySelectorAll(".codigo_modal").forEach((event)=>{
            if(event.value === document.getElementById("codigo-modificacion").value){
                event.style.background = "var(--boton-tres)"
            }
        });
        document.querySelector(".contenedor-pre-modificacion").classList.add("modal-show-modificacion");
        await buscarPorCodidoModificacionOrigen();
        operacionCostoTotalModificacion()
        marcarIdRepetido(".id_modificacion_modal", ".id_modificacion_proforma", document.querySelector("#tabla-proforma-modificacion > thead > tr:nth-child(1) > th > h2").textContent)
        arrayCreacionCategoriaTallas = [];
    };
};
function rellenarCategoria(){
    cat_con = JSON.parse(localStorage.getItem("categoria_consulta"));
    let html_cat = "";
    document.querySelectorAll(".categoria_cambio").forEach((event, i)=>{
        html_cat = "";
        for(categoria of cat_con) {
            let fila = `<option value="${categoria.id}">${categoria.categoria_nombre}</option>`
            html_cat = html_cat + fila;
        };
        event.innerHTML = html_cat;
        event.addEventListener("change", ()=>{
            rellenarMedidasCategoria(Number(event.value), i)
            let fila_ = event.parentNode.parentNode;
            fila_.children[3].children[0].value = fila_.children[3].children[0].value.replace(/-.*?-/g, `-${fila_.children[5].children[0].value}-`);
        });
    });
};
function rellenarMedidasCategoria(id_categoria, i){

    let fila_ = document.querySelectorAll(".medida_cambio");
    let fila_codigo = document.querySelectorAll(".codigo_modal");

    let cat = cat_con.find(x => x.id === id_categoria)
    let _medidas = [cat.uno, cat.dos, cat.tres, cat.cuatro, cat.cinco, cat.seis, cat.siete, cat.ocho, cat.nueve, cat.diez, cat.once, cat.doce] 

    html_cat = "";
    for(medida of _medidas) {
        if(medida !== ""){
            let fila = `<option value="${medida}">${medida}</option>`
            html_cat = html_cat + fila;
        };
    };
    fila_[i].innerHTML = html_cat;
    fila_[i].addEventListener("change",()=>{
        fila_codigo[i].value = fila_codigo[i].value.replace(/-.*?-/g, `-${fila_[i].value}-`);
    });
};

function rellenarProveedor(){
    prov_con = JSON.parse(localStorage.getItem("base_datos_prov"))
    let html_prov = "";
    document.querySelectorAll(".proveedor_cambio").forEach((event)=>{
        html_prov = "";
        for(proveedor of prov_con) {
            let fila = `<option value="${proveedor.id_cli}">${proveedor.nombre_cli}</option>`
            html_prov = html_prov + fila;
        };
        event.innerHTML = html_prov
    });
};
async function buscarPorCodidoModificacionOrigen(){
    let suma = 0;
    const id_rem = document.querySelectorAll(".id_modificacion_modal");
    let ids = Array.from(id_rem).map(element => element.textContent);
    let response = await cargarDatos(   `almacen_central_id_sucursal?`+
                                        `ids=${ids.join(",")}&`+
                                        `sucursal_get=${sucursales_activas[indice_sucursal_modificacion]}`);
 
    for(id_m of id_rem){
        let row_ = id_m.closest("tr");
        let fila_res = response.find(x=> x.idProd === Number(row_.children[0].textContent))
        if(fila_res){
            row_.children[2].children[0].value = fila_res.categoria
            row_.children[4].children[0].value = fila_res.descripcion
            row_.children[6].children[0].value = fila_res.sucursal_get
            row_.children[7].children[0].value = fila_res.costo_unitario.toFixed(2)
            row_.children[8].textContent = fila_res.costo_unitario.toFixed(2) * fila_res.sucursal_get
            row_.children[9].children[0].value = fila_res.precio_venta.toFixed(2)
            row_.children[10].children[0].value = fila_res.lote
            row_.children[11].children[0].value = fila_res.proveedor
            if(row_.children[0].textContent == document.getElementById("id-modificacion").value){
                id_m.style.background = "rgb(105, 211, 35)"
            };
            rellenarMedidasCategoria(fila_res.categoria, suma)
            row_.children[5].children[0].value = fila_res.talla
            suma+=1;
        };
        if(row_.children[0].textContent  < 1){//OCULTAMOS LAS FILAS QUE NO MUESTRAN ID O NO EXISTEN EL LA TABLA PRODUCTOS
            row_.remove()
        };
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function operacionCostoTotalModificacion(){
    const existenciasModificacion = document.querySelectorAll(".existencias-modificacion");
    existenciasModificacion.forEach((event)=>{
        event.addEventListener("keyup", (e) => {
            e.target.parentNode.parentNode.children[8].textContent = (Number(e.target.parentNode.parentNode.children[7].children[0].value *
                e.target.value)).toFixed(2)
        });
    });
    const costoUnitarioModificacion = document.querySelectorAll(".costo-unitario-modificacion");
    costoUnitarioModificacion.forEach((event)=>{
        event.addEventListener("keyup", (e) => {
            e.target.parentNode.parentNode.children[8].textContent = (Number(e.target.parentNode.parentNode.children[6].children[0].value *
                e.target.value)).toFixed(2)
        });
    });
};
/////////AQUI SE MANDA A TABLA MODIFICACION PRINCIPAL CON VALORES YA EDITADOS////////////////////////////////////////////////////////////////
const procesarModificar = document.getElementById("procesar-modificacion-dos");
procesarModificar.addEventListener("click", (e) => {
    e.preventDefault();
    let id_sucursal = document.getElementById("fffff-sucursal").value;//guardamos la sucursal 
    removerModificacionRepetido();
    filaBodyProformaPincipalDos();
    const borrar = document.querySelectorAll(".codigo_modal");//eliminamos las filas de la tabla modal que si pasaron a la tabla principal
    borrar.forEach((event)=>{
        if(event.value !== "" &&
        event.parentNode.parentNode.children[4].children[0].value !== "" &&
        Number(event.parentNode.parentNode.children[6].children[0].value) >= 0 &&
        event.parentNode.parentNode.children[6].children[0].value !== "" &&
        Number(event.parentNode.parentNode.children[7].children[0].value) >= 0 &&
        event.parentNode.parentNode.children[7].children[0].value !== "" &&
        Number(event.parentNode.parentNode.children[9].children[0].value) >= Number(event.parentNode.parentNode.children[7].children[0].value) &&
        event.parentNode.parentNode.children[9].children[0].value !== "" &&
        Number(event.parentNode.parentNode.children[10].children[0].value) > 0 &&
        event.parentNode.parentNode.children[10].children[0].value !== ""){
            event.parentNode.parentNode.remove();
        }
    });
    if(document.querySelector("#tabla-pre-modificacion > tbody").children.length == 0){
        document.querySelector(".contenedor-pre-modificacion").classList.remove("modal-show-modificacion")
    };
    document.getElementById("formulario-modificacion").reset()
    document.getElementById("fffff-sucursal").value = id_sucursal
    document.getElementById("id-modificacion").value = ""
    document.getElementById("buscador-productos-modificacion").focus();
});
function filaBodyProformaPincipalDos(){
    const fila_modal = document.querySelectorAll(".codigo_modal");
    fila_modal.forEach((event)=>{

        event.style.background = ""
        event.parentNode.parentNode.children[4].children[0].style.background = ""
        event.parentNode.parentNode.children[6].children[0].style.background = ""
        event.parentNode.parentNode.children[7].children[0].style.background = ""
        event.parentNode.parentNode.children[9].children[0].style.background = ""
        event.parentNode.parentNode.children[10].children[0].style.background = ""

        if(event.value !== "" &&
        event.parentNode.parentNode.children[4].children[0].value !== "" &&
        Number(event.parentNode.parentNode.children[6].children[0].value) >= 0 &&
        event.parentNode.parentNode.children[6].children[0].value !== "" &&
        Number(event.parentNode.parentNode.children[7].children[0].value) >= 0 &&
        event.parentNode.parentNode.children[7].children[0].value !== "" &&
        Number(event.parentNode.parentNode.children[9].children[0].value) >= Number(event.parentNode.parentNode.children[7].children[0].value) &&
        event.parentNode.parentNode.children[9].children[0].value !== "" &&
        Number(event.parentNode.parentNode.children[10].children[0].value) > 0 &&
        event.parentNode.parentNode.children[10].children[0].value !== ""){
            let fila_principal = document.querySelector("#tabla-proforma-modificacion > tbody");
            let nueva_fila_principal = fila_principal.insertRow(-1);
            let fila = `<tr>`+
                            `<td class="id_modificacion_proforma invisible">${event.parentNode.parentNode.children[0].textContent}</td>`+// Columna 0 > id
                            `<td>${event.parentNode.parentNode.children[1].textContent}</td>`+// Columna 1 > sucursal
                            `<td>${event.parentNode.parentNode.children[2].children[0].children[event.parentNode.parentNode.children[2].children[0].selectedIndex].textContent}</td>`+// Columna 2 > categoría
                            `<td class="codigo_proforma">${event.value}</td>`+// Columna 3 > código
                            `<td>${event.parentNode.parentNode.children[4].children[0].value}</td>`+// Columna 4 > descripción
                            `<td>${event.parentNode.parentNode.children[5].children[0].value}</td>`+// Columna 5 > talla
                            `<td style="text-align: right">${event.parentNode.parentNode.children[6].children[0].value}</td>`+// Columna 6 > existencias
                            `<td style="text-align: right">${event.parentNode.parentNode.children[7].children[0].value}</td>`+// Columna 7 > costo unitario
                            `<td style="text-align: right">${event.parentNode.parentNode.children[8].textContent}</td>`+// Columna 8 > Costo Total
                            `<td style="text-align: right">${event.parentNode.parentNode.children[9].children[0].value}</td>`+// Columna 9 > precio de venta
                            `<td style="text-align: right">${event.parentNode.parentNode.children[10].children[0].value}</td>`+// Columna 10 > lote
                            `<td style="text-align: right">${event.parentNode.parentNode.children[11].children[0].children[event.parentNode.parentNode.children[11].children[0].selectedIndex].textContent}</td>`+// Columna 11 > proveedor
                            `<td class="invisible">${event.parentNode.parentNode.children[12].textContent}</td>`+// Columna 12 > índice sucursal
                            `<td class="invisible">${event.parentNode.parentNode.children[11].children[0].value}</td>`+// Columna 13 > id proveedor
                            `<td class="invisible">${event.parentNode.parentNode.children[2].children[0].value}</td>`+// Columna 14 > id categoria
                            `<td style="text-align: center">
                                <div class="tooltip">
                                    <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFila(this)">delete</span>
                                    <span class="tooltiptext">Eliminar producto</span>
                                </div>
                            </td>`+// Columna 15 > 
                        `</tr>`
            nueva_fila_principal.innerHTML = fila;
        }else if(event.value === ""){
            event.style.background = "#b36659"
        }else if(event.parentNode.parentNode.children[4].children[0].value === ""){
            event.parentNode.parentNode.children[4].children[0].style.background = "#b36659"
        }else if(Number(event.parentNode.parentNode.children[6].children[0].value) < 0 ||
        event.parentNode.parentNode.children[6].children[0].value === ""){
            event.parentNode.parentNode.children[6].children[0].style.background = "#b36659"
        }else if(Number(event.parentNode.parentNode.children[7].children[0].value) < 0 ||
        event.parentNode.parentNode.children[7].children[0].value === ""){
            event.parentNode.parentNode.children[7].children[0].style.background = "#b36659"
        }else if(Number(event.parentNode.parentNode.children[9].children[0].value) < 0 ||
        event.parentNode.parentNode.children[9].children[0].value === ""){
            event.parentNode.parentNode.children[9].children[0].style.background = "#b36659"
        }else if(Number(event.parentNode.parentNode.children[10].children[0].value) <= 0 ||
        event.parentNode.parentNode.children[10].children[0].value === ""){
            event.parentNode.parentNode.children[10].children[0].style.background = "#b36659"
        };
    });
};
const procesarModificacionAProductos = document.getElementById("procesar-modificacion-principal");
procesarModificacionAProductos.addEventListener("click", mandarModificacionAProductos)
async function mandarModificacionAProductos(e){
    e.preventDefault();
    let suma_productos = 0;
    if(document.querySelector("#tabla-proforma-modificacion > tbody").children.length > 0){
        modal_proceso_abrir("Procesando la modificación!!!.", "")
        function EnviarAProducto(a){
            this.idProd = a.children[0].textContent;
            this.categoria = a.children[14].textContent;
            this.codigo = a.children[3].textContent;
            this.costo_unitario = a.children[7].textContent;
            this.descripcion = a.children[4].textContent;
            this.lote = a.children[10].textContent;
            this.precio_venta = a.children[9].textContent;
            this.proveedor = a.children[13].textContent;
            this.talla = a.children[5].textContent;
            this.sucursal_post = sucursales_activas[a.children[12].textContent];
            this.existencias_post = a.children[6].textContent;
        };
        let numFilas = document.querySelector("#tabla-proforma-modificacion > tbody").children;
        for(let i = 0 ; i < numFilas.length; i++ ){
            let editProducto = new EnviarAProducto(numFilas[i]);
            let url = URL_API_almacen_central + 'almacen_central';
            let response = await funcionFetch(url, editProducto);
            console.log("Respuesta Productos "+response.status)
            if(response.status === 200){
                suma_productos +=1;
                modal_proceso_abrir("Procesando la modificación!!!.", `Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
                console.log(`Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
            }
        };
        if(suma_productos === numFilas.length){
            modal_proceso_abrir('Operación completada exitosamente.', "")
            modal_proceso_salir_botones()
            document.querySelector("#tabla-proforma-modificacion > tbody").remove();
            document.querySelector("#tabla-proforma-modificacion").createTBody();
            localStorage.setItem("base_datos_consulta", JSON.stringify(await cargarDatos('almacen_central_ccd')))
        }else{
            modal_proceso_abrir(`Ocurrió un problema en la fila ${suma_productos + 1}`, `Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
            console.log(`Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
            modal_proceso_salir_botones()
        };
    };
};

const removerTablaModificacionUno = document.getElementById("remover-tabla-modificacion-uno");
removerTablaModificacionUno.addEventListener("click", () =>{
    document.querySelector(".contenedor-pre-modificacion").classList.remove("modal-show-modificacion");
    document.querySelector("#tabla-pre-modificacion > tbody").remove();
    document.querySelector("#tabla-pre-modificacion").createTBody();
    document.getElementById("codigo-modificacion").focus();
    if(modificacionNumerador == 0){
        document.getElementById("codigo-modificacion").focus();
    }else if(modificacionNumerador == 1){
        document.getElementById("buscador-productos-modificacion").focus();
    };
});
const removerTablaModificacionDos = document.getElementById("remover-tabla-modificacion-dos");
removerTablaModificacionDos.addEventListener("click", () =>{
    document.querySelector(".contenedor-pre-modificacion").classList.remove("modal-show-modificacion");
    document.querySelector("#tabla-proforma-modificacion > tbody").remove();
    document.querySelector("#tabla-proforma-modificacion").createTBody();
    if(modificacionNumerador == 0){
        document.getElementById("codigo-modificacion").focus();
    }else if(modificacionNumerador == 1){
        document.getElementById("buscador-productos-modificacion").focus();
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
    let miUl_cabecera = document.getElementById("lista_cabecera");
    let miUl_detalle = document.getElementById("lista_detalle");
    miUl_cabecera.innerHTML = "";
    miUl_detalle.innerHTML = "";
    document.getElementById("categoria_buscador_detalle").value = "0";
    document.getElementById("buscador_descripcion").value = ""
    document.getElementById("buscador_descripcion").focus();
});
function agregarBusquedaDetalleUno(button){
    if(document.getElementById("editar-modificacion").classList.contains('marcaBoton')){
        let linea = button.closest("li");
        indice_sucursal_modificacion = obtenerIndiceSucursal();
        document.getElementById('id-modificacion').value = linea.children[0].textContent;
        document.getElementById('categoria-modificacion').value = linea.children[1].textContent;
        document.getElementById('codigo-modificacion').value = linea.children[2].textContent;
        document.getElementById('descripcion-modificacion').value = linea.children[3].textContent;
    }else{
        modal_proceso_abrir(`Esta acción solo procederá en "Modificar Producto".`, ``)
        modal_proceso_salir_botones()
    };
};
function clicKEliminarFila(e) {
    const fila = e.closest("tr");
    fila.remove();
};