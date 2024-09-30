document.addEventListener("DOMContentLoaded", inicioPerdidas)
let anio_principal = ""
function inicioPerdidas(){
    anio_principal = new Date().getFullYear()
    cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))
    cargarDatosAnio()
    btnPerdidas = 1;
    cambioSucursalModificacion("fffff-sucursal")
    llenarCategoriaProductosEjecucion("#categoria-perdidas")
    llenarCategoriaProductosEjecucion("#categoria_buscador_detalle")
};
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
const barras_perdidas = [".cg_1_c", ".cg_2_c", ".cg_3_c", ".cg_4_c", ".cg_5_c"]
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        reinicioBarraGrafico(barras_perdidas);
        anio_principal = anio_referencia.value;

        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////Pérdidas/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function cambioSucursalModificacion(id){
    document.getElementById(id).addEventListener("change", ()=>{
        document.getElementById("buscador-perdidas").value = ""
        document.getElementById("id-perdidas").value = ""
        document.getElementById("categoria-perdidas").value = ""
        document.getElementById("codigo-perdidas").value = ""
        document.getElementById("descripcion-perdidas").value = ""
        document.getElementById("buscador-perdidas").focus();
    });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let sucursal_id_perdidas = 0;
let indice_sucursal_despacho = 0;
let formularioPerdidas = document.getElementById("formulario-perdidas");
const base_datos_busqueda = JSON.parse(localStorage.getItem("base_datos_consulta"))
function reseteoFormulario(){
    document.getElementById("id-perdidas").value = "";
    document.getElementById('categoria-perdidas').value = "0";
    document.getElementById('codigo-perdidas').value = "";
    document.getElementById('descripcion-perdidas').value = "";
};
document.addEventListener("keyup", (e) =>{
    indice_base = JSON.parse(localStorage.getItem("base_datos_consulta"))
    let almacenCentral = indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-perdidas').value.toLocaleLowerCase()))
    if(almacenCentral){
        document.getElementById('id-perdidas').value = almacenCentral.idProd

        sucursal_id_perdidas = document.getElementById("fffff-sucursal").value
        indice_sucursal_despacho = obtenerIndiceSucursal("#fffff-sucursal")
        document.getElementById('categoria-perdidas').value = almacenCentral.categoria
        document.getElementById('codigo-perdidas').value = almacenCentral.codigo
        document.getElementById('descripcion-perdidas').value = almacenCentral.descripcion
        if(document.getElementById('buscador-perdidas').value == ""){
            reseteoFormulario()
        }
    }else{
        reseteoFormulario();
    };
});

function crearBodyDespacho (codigo, id_prod){
    let tabladespacho= document.querySelector("#tabla-pre-despacho > tbody");
    let nuevaFilaTabladespacho = tabladespacho.insertRow(-1);
    let fila = `<tr>`+
                    `<td class="id_despacho_modal invisible">${id_prod}</td>`+// Columna 0 > id
                    `<td>${suc_add[indice_sucursal_despacho]}</td>`+// Columna 1 > sucursal
                    `<td>${document.getElementById("categoria-perdidas").children[document.getElementById("categoria-perdidas").selectedIndex].textContent}</td>`+// Columna 2 > categoría
                    `<td class="codigo_despacho_modal" style="border-radius: 5px">${codigo}</td>`+// Columna 3 > código
                    `<td></td>`+// Columna 4 > descripción
                    `<td style="text-align: right"></td>`+// Columna 5 > existencias
                    `<td><input class="input-tablas-dos-largo insertarNumero" placeholder="Valor > 0" onkeyup="operarCantidad(this)"></td>`+// Columna 6 > cantidad a despachar
                    `<td class="saldos_despacho"></td>`+// Columna 7 > saldo de existencias
                    `<td class="invisible">${document.getElementById("fffff-sucursal").value}</td>`+// Columna 8 > id sucursal
                    `<td class="invisible">${indice_sucursal_despacho}</td>`+// Columna 9 > índice sucursal sucursal
                    `<td>${document.getElementById("motivo_salida").value}</td>`+// Columna 10 > motivo
                    `<td style="text-align: center">
                        <div class="tooltip">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila"  onCLick = "clicKEliminarFila(this)">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </div>
                    </td>`+// Columna 11 > botón eliminar fila
                `</tr>`
    nuevaFilaTabladespacho.innerHTML = fila;
};
agregarATablaPrePerdidas.addEventListener("click", agregarAModal)
async function agregarAModal(e){
    e.preventDefault();
    
    let base = 0;
    let codigo = document.getElementById("codigo-perdidas").value
    let arrayCreacionCategoriaTallas = categoriaProductosCreacion(document.getElementById("categoria-perdidas"));
    if(document.getElementById("id-perdidas").value > 0){
        for(let i = 0; i < arrayCreacionCategoriaTallas.length; i++){
            for(let j = 0; j < arrayCreacionCategoriaTallas.length; j++){
                if(codigo.includes("-" + arrayCreacionCategoriaTallas[j])){
                    codigo = codigo.replace("-" + arrayCreacionCategoriaTallas[j], "-" + arrayCreacionCategoriaTallas[i])
                }
            };
            if(base_datos_busqueda.find(y => y.codigo == codigo)){
                base = base_datos_busqueda.find(y => y.codigo == codigo)
                crearBodyDespacho(codigo, base.idProd)
            };
        };
        document.querySelectorAll(".codigo_despacho_modal").forEach((event)=>{
            if(event.textContent === document.getElementById("codigo-perdidas").value){
                event.style.background = "var(--boton-tres)"
            }
        });
        document.querySelector(".contenedor-pre-recompra").classList.add("modal-show")
        await buscarPorCodido();
        marcarIdRepetido(".id_despacho_modal", ".id_despacho_proforma", document.querySelector("#tabla_principal > thead > tr:nth-child(1) > th > h2").textContent)
        arrayCreacionCategoriaTallas = [];
        document.querySelector("#tabla-pre-despacho > tbody > tr:nth-child(1) > td:nth-child(7) > input").focus();
    };
};
async function buscarPorCodido(){
    const id_rec = document.querySelectorAll(".id_despacho_modal");
    let ids = Array.from(id_rec).map(element => element.textContent);
    let response = await cargarDatos(   `almacen_central_id_sucursal?`+
                                        `ids=${ids.join(",")}&`+
                                        `sucursal_get=${sucursales_activas[indice_sucursal_despacho]}`);

    for(id_c of id_rec){
        let row_ = id_c.closest("tr");
        let fila_res = response.find(x=> x.idProd === Number(row_.children[0].textContent))
        if(fila_res){
            row_.children[4].textContent = fila_res.descripcion
            row_.children[5].textContent = fila_res.sucursal_get
            if(row_.children[0].textContent == document.getElementById("id-perdidas").value){
                id_c.style.background = "var(--boton-tres)"
                id_c.style.color = "var(--color-secundario)"
            };
        };
        if(row_.children[0].textContent  < 1){//OCULTAMOS LAS FILAS QUE NO MUESTRAN ID O NO EXISTEN EL LA TABLA PRODUCTOS
            row_.remove()
        };
    };
};
function operarCantidad(e){
    let row_ = e.closest("tr")
    row_.children[7].textContent = Number(row_.children[5].textContent) - Number(row_.children[6].children[0].value)
    Number(row_.children[7].textContent) < 0 ?  row_.children[7].style.background = "var(--boton-dos)" : 
                                                row_.children[7].style.background = "";
};
function filaBodyProformaPincipal(){
    const fila_modal = document.querySelectorAll(".codigo_despacho_modal");
    fila_modal.forEach((event)=>{
        let row_ = event.closest("tr");
        row_.children[7].style.background = ""

        if(Number(row_.children[6].children[0].value) > 0 && 
        Number(row_.children[7].textContent) >= 0){
            let fila_principal = document.querySelector("#tabla_principal > tbody");
            let nueva_fila_principal = fila_principal.insertRow(-1);
            let fila = `<tr>`+
                            `<td class="id_despacho_proforma invisible">${row_.children[0].textContent}</td>`+// Columna 0 > id
                            `<td>${row_.children[1].textContent}</td>`+// Columna 1 > sucursal
                            `<td>${row_.children[2].textContent}</td>`+// Columna 2 > categoría
                            `<td class="codigo_compras_proforma">${event.textContent}</td>`+// Columna 3 > código
                            `<td>${row_.children[4].textContent}</td>`+// Columna 4 > descripción
                            `<td>${row_.children[5].textContent}</td>`+// Columna 5 > existencias
                            `<td style="text-align: right">${row_.children[6].children[0].value}</td>`+// Columna 6 > cantidad a despachar
                            `<td style="text-align: right">${row_.children[7].textContent}</td>`+// Columna 7 > Saldo
                            `<td class="invisible" style="text-align: right">${row_.children[8].textContent}</td>`+// Columna 8 > id sucursal
                            `<td class="invisible" style="text-align: right">${row_.children[9].textContent}</td>`+// Columna 9 > indice
                            `<td style="text-align: right">${row_.children[10].textContent}</td>`+// Columna 10 > motivo
                            `<td style="text-align: center">
                                <div class="tooltip">
                                    <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFila(this)">delete</span>
                                    <span class="tooltiptext">Eliminar producto</span>
                                </div>
                            </td>`+// Columna 11 >
                        `</tr>`
            nueva_fila_principal.innerHTML = fila;
            row_.remove();
        }else if(Number(row_.children[6].children[0].value) <= 0){
            row_.children[6].children[0].style.background = "#b36659"
        }else if(Number(row_.children[7].textContent) < 0){
            row_.children[7].style.background = "#b36659"
        };
    });
};
const procesarPerdidas = document.getElementById("procesar-pre-despacho");
procesarPerdidas.addEventListener("click",async (e) =>{
    removerProductoRepetido();
    filaBodyProformaPincipal();
});
const procesarDes= document.getElementById("procesar-despacho-plus")
procesarDes.addEventListener("click", procesamientoDespacho)
async function procesamientoDespacho(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla_principal > tbody").children.length > 0){
            modal_proceso_abrir("Procesando el despacho!!!.", "")
            
            await funcionGeneralDespacho();
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
async function funcionGeneralDespacho(){
    let array_despacho = [];
    function DatosPerdidas(a){
        this.idProd = a.children[0].textContent;
        this.sucursal_post = sucursales_activas[a.children[9].textContent];
        this.existencias_post = a.children[6].textContent;
        
        this.causa = a.children[10].textContent;
        this.suc_perdidas = a.children[8].textContent;
    }
    const numFilas = document.querySelector("#tabla_principal > tbody").children
    for(let i = 0; i < numFilas.length; i++){
        array_despacho.push(new DatosPerdidas(numFilas[i]))
    }
    function DataDespacho(){
        this.array_despacho = array_despacho;
        this.fecha = generarFecha();
    }
    let despacho = new DataDespacho();
    let urlProductos = URL_API_almacen_central + 'procesar_perdida'
    let response = await funcionFetchDos(urlProductos, despacho);
    if(response.status === "success"){
        modal_proceso_abrir(`${response.message}`)
        modal_proceso_salir_botones()
    };
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    let linea = button.closest("li");
    indice_sucursal_despacho = obtenerIndiceSucursal("#fffff-sucursal");
    document.getElementById('id-perdidas').value = linea.children[0].textContent;
    document.getElementById('categoria-perdidas').value = linea.children[1].textContent;
    document.getElementById('codigo-perdidas').value = linea.children[2].textContent;
    document.getElementById('descripcion-perdidas').value = linea.children[3].textContent;
};
function clicKEliminarFila(e) {
    const fila = e.closest("tr");
    fila.remove();
};
const removerTablaModal = document.getElementById("remover-tabla-despacho-uno");
removerTablaModal.addEventListener("click", () =>{
    document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show")
    document.querySelector("#tabla-pre-despacho > tbody").remove();
    document.querySelector("#tabla-pre-despacho").createTBody();
    document.getElementById("buscador-perdidas").focus();
});
function clicKEliminarFila(e) {
    const fila = e.closest("tr");
    fila.remove();
};
function removerProductoRepetido(){//verificamos que el nuevo producto no tenga el mismo código en la tabla compras
    const codigoComprasComparacionProductos = document.querySelectorAll(".id_despacho_modal");
    codigoComprasComparacionProductos.forEach((event) => {
        document.querySelectorAll(".id_despacho_proforma").forEach((elemento) => {
            if(elemento.textContent === event.textContent &&
                event.parentNode.children[6].children[0].value > 0 && 
                elemento.parentNode.children[1].textContent === event.parentNode.children[1].textContent){
                elemento.parentNode.remove()
            }
        });
    });
};