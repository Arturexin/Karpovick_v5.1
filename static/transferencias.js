document.addEventListener("DOMContentLoaded", inicioTransferencias)
let anio_principal = ""
function inicioTransferencias(){
    anio_principal = new Date().getFullYear()
    llenarCategoriaProductosEjecucion("#categoria-transferencias")
 
    cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))
    cargarDatosAnio()
    btnTransferencias = 1;
    cambioSucursalTransferencias()
    llenarCategoriaProductosEjecucion("#categoria-transferencias")

    busquedaStock()
    llenarCategoriaProductosEjecucion("#categoria_buscador_detalle")
    indice_base = JSON.parse(localStorage.getItem("base_datos_consulta"))
};
let array_saldos = [];
let suc_tra = [];

let datos_usuario = JSON.parse(localStorage.getItem("datos_usuario"))
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        removerMarcaBotonDos()
        anio_principal = anio_referencia.value;

        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
    
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////TRANSFERENCIAS//////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const in_suc = ["in_trans_AC", "in_trans_SU", "in_trans_SD", "in_trans_ST", "in_trans_SC"]// input cantidad entrada
const sal_suc = ["sal_trans_AC", "sal_trans_SU", "sal_trans_SD", "sal_trans_ST", "sal_trans_SC"]// cantidad de salida
const r_suc = ["r_trans_AC", "r_trans_SU", "r_trans_SD", "r_trans_ST", "r_trans_SC"]// saldos en array

const formularioTransferencias = document.getElementById("formulario-transferencias");
///////////////////BUSCADOR DE PRODUCTOS EN FORMULARIO TRANSFERENCIAS/////////////////////////
let sucursal_transferencias = 0;
let indice_sucursal_transferencias = 0;

function reseteoFormulario(){
    document.getElementById("id-transferencias").value = "";
    document.getElementById('categoria-transferencias').value = "0";
    document.getElementById('codigo-transferencias').value = "";
    document.getElementById('descripcion-transferencias').value = "";
};

document.addEventListener("keyup", () =>{
    let almacenCentral = indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-productos-transferencias').value.toLocaleLowerCase()))
    if(almacenCentral){
        document.getElementById('id-transferencias').value = almacenCentral.idProd

        sucursal_transferencias = document.getElementById("fffff-sucursal").value
        indice_sucursal_transferencias = obtenerIndiceSucursal()
        document.getElementById('categoria-transferencias').value = almacenCentral.categoria
        document.getElementById('codigo-transferencias').value = almacenCentral.codigo
        document.getElementById('descripcion-transferencias').value = almacenCentral.descripcion
        if(document.getElementById('buscador-productos-transferencias').value == ""){
            reseteoFormulario();
        };
    }else{
        reseteoFormulario();
    };
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////TRANSFERENCIAS PLUS////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MODAL
function marcarProductoRepetidoTransferencias(){//verificamos que el nuevo producto no tenga el mismo código en la tabla transferencias comparando id
    const rows_proforma = document.querySelectorAll(".id_proforma");
    const rows_modal = document.querySelectorAll(".id_modal");
    let mensaje = ""
    let pro_repetido = [];
    let suc_repetido = "";
    rows_proforma.forEach((e_p) => {
        let row_p = e_p.closest("tr");
        rows_modal.forEach((e_m) => {
            let row_m = e_m.closest("tr");
            if(row_p.children[0].textContent === row_m.children[0].textContent &&
            row_p.children[9].textContent === row_m.children[15].textContent){
                pro_repetido.push(row_p.children[3].textContent);
                suc_repetido = row_p.children[1].textContent;

                row_m.remove();
            };
        });
    });
    if(pro_repetido.length > 0){
        mensaje += `El producto con código`;
        pro_repetido.forEach((event)=>{
            mensaje += ` "${event}",`
        })
        mensaje += ` de la sucursal de origen "${suc_repetido}" ya está en proceso, no se agregarán a la lista.`;
        confirm(mensaje)
    };
};

function crearBodyTransferencias(codigoTransferencia, id_prod){
    let tablaTransferencias= document.querySelector("#tabla_principal > tbody");
    let nuevaFilaTablaTransferencias = tablaTransferencias.insertRow(-1);
    let fila = `<tr>`+
                    `<td class="id_modal invisible">${id_prod}</td>`+// Columna 0 > id producto
                    `<td>${document.getElementById("fffff-sucursal").value}</td>`+// Columna 1 > sucursal origen
                    `<td class="invisible"></td>`+// Columna 2 > categoría
                    `<td class="insertar input-tablas" style="border-radius: 5px">${codigoTransferencia}</td>`+// Columna 3 > código
                    `<td></td>`+// Columna 4 > descripción
                    `<td style="text-align: right"></td>`+// Columna 5 > existencias sucursal origen
                    `<td><input onkeyup="opCant(this, 0)" class="input-tablas-dos-largo in_trans_AC" placeholder="Valor > 0"></td>`+//#### Columna 6 > cantidad a transferir AC###########
                    `<td><input onkeyup="opCant(this, 1)" class="input-tablas-dos-largo in_trans_SU" placeholder="Valor > 0"></td>`+//#### Columna 7 > cantidad a transferir SU###########
                    `<td><input onkeyup="opCant(this, 2)" class="input-tablas-dos-largo in_trans_SD" placeholder="Valor > 0"></td>`+//#### Columna 8 > cantidad a transferir SD###########
                    `<td><input onkeyup="opCant(this, 3)" class="input-tablas-dos-largo in_trans_ST" placeholder="Valor > 0"></td>`+//#### Columna 9 > cantidad a transferir ST###########
                    `<td><input onkeyup="opCant(this, 4)" class="input-tablas-dos-largo in_trans_SC" placeholder="Valor > 0"></td>`+//#### Columna 10 > cantidad a transferir SC###########
                    `<td style="text-align: right" class="sal_trans_AC"></td>`+// Columna 11 > cantidad a transferir + existencias sucursal destino***
                    `<td style="text-align: right" class="sal_trans_SU"></td>`+// Columna 12 > cantidad a transferir + existencias sucursal destino***
                    `<td style="text-align: right" class="sal_trans_SD"></td>`+// Columna 13 > cantidad a transferir + existencias sucursal destino***
                    `<td style="text-align: right" class="sal_trans_ST"></td>`+// Columna 14 > cantidad a transferir + existencias sucursal destino***
                    `<td style="text-align: right" class="sal_trans_SC"></td>`+// Columna 15 > cantidad a transferir + existencias sucursal destino***
                    `<td class="invisible"></td>`+// Columna 16 > Total unidades transferidas
                    `<td class="invisible">${indice_sucursal_transferencias}</td>`+// Columna 17 > índice sucursal origen
                    `<td style="text-align: center">
                        <div class="tooltip">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onClick="clicKEliminarFila(this)">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </div>
                    </td>`+// Columna 15 > 
                `</tr>`
    nuevaFilaTablaTransferencias.innerHTML = fila;
};

function clicKEliminarFila(e){
    const fila = e.closest("tr");
    fila.remove();
};

const mandarATablaPreTransferencias = document.getElementById("agregarATablaPreTransferencias");
mandarATablaPreTransferencias.addEventListener("click", agregarAtablaPreTransferencias)
async function agregarAtablaPreTransferencias(e){
    e.preventDefault();
    let base_datos_busqueda = JSON.parse(localStorage.getItem("base_datos_consulta"))
    let base = 0;
    if(document.getElementById("id-transferencias").value > 0){
        let arrayCreacionCategoriaTallas = categoriaProductosCreacion(document.getElementById("categoria-transferencias"));

        for(let i = 0; i < arrayCreacionCategoriaTallas.length; i++){// Se crean códigos según categorías
            if(document.getElementById("id-transferencias").value > 0){
                let codigoTransferencia = document.getElementById("codigo-transferencias").value
                for(let j = 0; j < arrayCreacionCategoriaTallas.length; j++){
                    if(codigoTransferencia.includes("-" + arrayCreacionCategoriaTallas[j])){
                        codigoTransferencia = codigoTransferencia.replace("-" + arrayCreacionCategoriaTallas[j], "-" + arrayCreacionCategoriaTallas[i])
                    }
                };
                if(base_datos_busqueda.find(y => y.codigo == codigoTransferencia)){// Se busca la existencia de los códigos creados según categorías
                    base = base_datos_busqueda.find(y => y.codigo == codigoTransferencia)
                    crearBodyTransferencias(codigoTransferencia, base.idProd)
                };
            };
        };
        document.querySelectorAll(".insertar").forEach((event)=>{// marcamos el código de busqueda en la tabla proforma
            if(event.textContent === document.getElementById("codigo-transferencias").value){
                event.style.background = "var(--boton-tres)"
            }
        });
        document.querySelector(".contenedor-pre-transferencia").classList.add("modal-show-transferencia")
        await buscarCodigo();
        
        marcarProductoRepetidoTransferencias();
        arrayCreacionCategoriaTallas = [];
        document.querySelector("#tabla_principal > tbody > tr > td:nth-child(8) > input").focus()
    }else if(document.getElementById("id-transferencias").value < 1){
        modal_proceso_abrir("Seleccione un código a transferir.", "")
        modal_proceso_salir_botones()
    };
};
function mostrarSucursalesEnTabla(){ // inhabilita las sucursales que no existen
    for(let i = 0; i < suc_add.length; i++){
        let exis = suc_enc.find(x => x.sucursal_nombre === suc_add[i])
        if(exis === undefined) {
            let elementos = document.querySelectorAll(`.${in_suc[i]}`)
            elementos.forEach(elemento => {
                elemento.setAttribute('disabled', '');
            });
        };
    };
};
async function buscarCodigo(){//Busca el producto por ID
    const id_trans = document.querySelectorAll(".id_modal");
    let ids = Array.from(id_trans).map(element => element.textContent);

    let response = await cargarDatos(   `almacen_central_codigo_transferencias?`+
                                        `ids=${ids.join(",")}`);

    for( res of response){
        if(array_saldos.length !== 0){ // verificamos si el array_saldos contiene datos
            let buscar = array_saldos.find(x => x.idProd === res.idProd) // si econtramos coincidencias actualizamos el stock por sucursal
            if(buscar){
                sucursales_activas.forEach((e)=>{
                    buscar[e] = res[e]; 
                })
            }else{ //si no hay coincidencias solo se inserta cada producto nuevo
                r_suc.forEach((e)=>{
                    res[e] = 0;
                });
                array_saldos.push(res);// se inserta el objeto response en el array
            };
        }else{
            r_suc.forEach((e)=>{
                res[e] = 0;
            });
            array_saldos.push(res);// se inserta el objeto response en el array
        };
    };
    let elementos = document.querySelectorAll(`.${in_suc[indice_sucursal_transferencias]}`);//inhabilitamos el input de la sucursal donante
    elementos.forEach(elemento => {
        elemento.setAttribute('disabled', '');
        
    });
    mostrarSucursalesEnTabla()
    for(let i = 0; i < id_trans.length; i++){
        
        let row_ = id_trans[i].closest("tr");

        let array_existencias_suc = [];
        let e = array_saldos.find(x => x.idProd === Number(id_trans[i].textContent))

        if(e){
            row_.children[1].textContent = document.querySelector("#fffff-sucursal").children[indice_sucursal_transferencias].textContent
            row_.children[2].textContent = e.categoria
            row_.children[4].textContent = e.descripcion
            array_existencias_suc = [
                                        e.existencias_ac, 
                                        e.existencias_su, 
                                        e.existencias_sd, 
                                        e.existencias_st,
                                        e.existencias_sc//no se considera una quinta sucursal
                                    ]
            row_.children[5].textContent = array_existencias_suc[indice_sucursal_transferencias]//existencias sucursal origen
            //Filas de saldo de existencias por sucursal, descuenta las unidades por transferir para futuros usos
            row_.children[11].textContent = e.existencias_ac ? e.existencias_ac + e.r_trans_AC : 0;//existencias sucursal AC
            row_.children[12].textContent = e.existencias_su ? e.existencias_su + e.r_trans_SU : 0;//existencias sucursal SU
            row_.children[13].textContent = e.existencias_sd ? e.existencias_sd + e.r_trans_SD : 0;//existencias sucursal SD
            row_.children[14].textContent = e.existencias_st ? e.existencias_st + e.r_trans_ST : 0;//existencias sucursal ST
            row_.children[15].textContent = e.existencias_sc ? e.existencias_sc + e.r_trans_SC : 0;//existencias sucursal SC//no se considera una quinta sucursal
        }else{
            row_.remove()
        };
        if(row_.children[0].textContent  < 1){//Eliminamos LAS FILAS QUE NO MUESTRAN ID O NO EXISTEN EL LA TABLA PRODUCTOS
            row_.remove()
        };
    };
};
function opCant(p, indice){
    let fila = p.closest("tr");

    const q_in = fila.querySelector(`.${in_suc[indice]}`);
    const q_sal = fila.querySelector(`.${sal_suc[indice]}`);
    const q_out = fila.querySelector(`.${sal_suc[indice_sucursal_transferencias]}`);
    const stock_ = array_saldos.find(x => x.idProd === Number(fila.children[0].textContent))

    q_sal.textContent = stock_[sucursales_activas[indice]] + 
                        Number(q_in.value)

    q_out.textContent = stock_[sucursales_activas[indice_sucursal_transferencias]] - 
                        (Number(fila.children[6].children[0].value) +
                        Number(fila.children[7].children[0].value) +
                        Number(fila.children[8].children[0].value) +
                        Number(fila.children[9].children[0].value) +
                        Number(fila.children[10].children[0].value))
    fila.children[16].textContent = -(Number(fila.children[6].children[0].value) +
                                    Number(fila.children[7].children[0].value) +
                                    Number(fila.children[8].children[0].value) +
                                    Number(fila.children[9].children[0].value) +
                                    Number(fila.children[10].children[0].value))

    Number(q_out.textContent) < 0 ? q_out.style.background = "var(--boton-dos)" : q_out.style.background = "var(--boton-tres)";
};
function insertarTransfAlArray(){ // Agregamos y operamos las cantidades tranferidas al array_saldos
    const id_mod = document.querySelectorAll(`.id_modal`);
    id_mod.forEach((id_)=>{
        let llave_uno = false;
        let row_ = id_.closest("tr");
        let prod_ = array_saldos.find(x => x.idProd === Number(id_.textContent))

        if(prod_ && row_.children[11].textContent >= 0 && row_.children[12].textContent >= 0 && 
        row_.children[13].textContent >= 0 && row_.children[14].textContent >= 0 && row_.children[15].textContent >= 0){
            r_suc.forEach((elem, i)=>{//recorre las claves r_trans_ y asinga los correspondientes valores
                indice_sucursal_transferencias === i ?  prod_[elem] = prod_[elem] + Number(row_.children[16].textContent) :
                                                        prod_[elem] = prod_[elem] + Number(row_.children[6 + i].children[0].value)
            })
            llave_uno = true;// si por lo menos se tranfiere a una sucursal
        }
        if((row_.children[6].children[0].value > 0 || row_.children[7].children[0].value > 0 ||
        row_.children[8].children[0].value > 0 || row_.children[9].children[0].value > 0 || 
        row_.children[10].children[0].value > 0) &&
        llave_uno){
            filaBodyTransferenciasProformaPincipal(row_, indice_sucursal_transferencias)
            row_.remove();
        }
    });
};
//PROFORMA
function filaBodyTransferenciasProformaPincipal(row_, indice){
    let tablaTransferencias = document.querySelector("#tabla-proforma-transferencias > tbody");
    let nuevaFilaTablaTransferencias = tablaTransferencias.insertRow(-1);
    let array_salidas =  [  
                            row_.children[6].children[0].value,
                            row_.children[7].children[0].value,
                            row_.children[8].children[0].value,
                            row_.children[9].children[0].value,
                            row_.children[10].children[0].value
                        ] 
    let total_suma = array_salidas.reduce((acc, curr) => Number(acc) + Number(curr), 0);
    let fila = `<tr>`+
                    `<td class="id_proforma invisible">${row_.children[0].textContent}</td>`+ // Columna 0 > id producto
                    `<td>${row_.children[1].textContent}</td>`+ // Columna 1 > sucursal
                    `<td class="invisible">${row_.children[2].textContent}</td>`+ // Columna 2 > categoría
                    `<td>${row_.children[3].textContent}</td>`+ // Columna 3 > código
                    `<td>${row_.children[4].textContent}</td>`+ // Columna 4 > descripción
                    `<td style="text-align: right">${indice == 0 ? -total_suma : +array_salidas[0]}</td>`+ // Columna 5 > cantidad AC
                    `<td style="text-align: right">${indice == 1 ? -total_suma : +array_salidas[1]}</td>`+ // Columna 6 > cantidad SU 
                    `<td style="text-align: right">${indice == 2 ? -total_suma : +array_salidas[2]}</td>`+ // Columna 7 > cantidad SD
                    `<td style="text-align: right">${indice == 3 ? -total_suma : +array_salidas[3]}</td>`+ // Columna 8 > cantidad ST
                    `<td style="text-align: right">${indice == 4 ? -total_suma : +array_salidas[4]}</td>`+ // Columna 9 > cantidad SC
                    `<td class="invisible">${row_.children[17].textContent}</td>`+ // Columna 10 >Indice de sucursal de salida
                    `<td style="text-align: center">
                        <div class="tooltip">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFilaP(this)">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </div>
                    </td>`+
                `</tr>`
    nuevaFilaTablaTransferencias.innerHTML = fila;
};

function clicKEliminarFilaP(e) {
    const fila = e.closest("tr");
    array_saldos.forEach((event)=>{
        if(event.idProd === Number(fila.children[0].textContent)){
            event.r_trans_AC = event.r_trans_AC - Number(fila.children[5].textContent)
            event.r_trans_SU = event.r_trans_SU - Number(fila.children[6].textContent)
            event.r_trans_SD = event.r_trans_SD - Number(fila.children[7].textContent)
            event.r_trans_ST = event.r_trans_ST - Number(fila.children[8].textContent)
            event.r_trans_SC = event.r_trans_SC - Number(fila.children[9].textContent)
        }
    });
    fila.remove();
};
const procesarPreTransferencias = document.querySelector("#procesar-pre-transferencias");
procesarPreTransferencias.addEventListener("click", agregarAtablaTransferenciasPrincipal)
function agregarAtablaTransferenciasPrincipal(e){
    e.preventDefault();
    insertarTransfAlArray()
    if(document.querySelector("#tabla_principal > tbody").children.length == 0){
        document.querySelector(".contenedor-pre-transferencia").classList.remove("modal-show-transferencia")
    }

    formularioTransferencias.reset()
    document.getElementById("id-transferencias").value = ""
    document.getElementById("buscador-productos-transferencias").value = ""
    document.getElementById("buscador-productos-transferencias").focus();
};

const procesarTransferenciaPlus = document.getElementById("procesar-transferencias-plus");
procesarTransferenciaPlus.addEventListener("click", procesamientoTransferencias)
async function procesamientoTransferencias(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla-proforma-transferencias > tbody").children.length > 0){
        modal_proceso_abrir("Procesando la transferencia!!!.", "")
            
            await realizarTransferencia()
            if(document.querySelector("#check_comprobante").checked){
                imprimirListaTabla()//Lista de transferencias
            };
            document.querySelector("#tabla-proforma-transferencias > tbody").remove();
            document.querySelector("#tabla-proforma-transferencias").createTBody();
            array_saldos = [];// Eliminamos el contenido del array_saldos
            
        }
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. ", error, "")
        console.error("Ocurrió un error. ", error)
        modal_proceso_salir_botones()
    };
};
async function realizarTransferencia(){
    let array_data_prod = [];
    let array_data_tran = [];
    const numFilas = document.querySelector("#tabla-proforma-transferencias > tbody").children
    function DataProductos(i){
        this.idProd = array_saldos[i].idProd;
        this.saldo_ac = array_saldos[i].r_trans_AC;
        this.saldo_su = array_saldos[i].r_trans_SU;
        this.saldo_sd = array_saldos[i].r_trans_SD;
        this.saldo_st = array_saldos[i].r_trans_ST;
        this.saldo_sc = array_saldos[i].r_trans_SC;
    };
    for(let i = 0 ; i < array_saldos.length; i++ ){
        if(array_saldos[i].r_trans_AC !== 0 || array_saldos[i].r_trans_SU !== 0 ||
        array_saldos[i].r_trans_SD !== 0 || array_saldos[i].r_trans_ST !== 0 ||
        array_saldos[i].r_trans_SC !== 0){
            array_data_prod.push(new DataProductos(i));
        };
    };
    function DataTransferencia(a){
        this.idProd = a.children[0].textContent;
        this.q_ac = a.children[5].textContent;
        this.q_su = a.children[6].textContent;
        this.q_sd = a.children[7].textContent;
        this.q_st = a.children[8].textContent;
        this.q_sc = a.children[9].textContent;
    }
    for(let i = 0 ; i < numFilas.length; i++ ){
        array_data_tran.push(new DataTransferencia(numFilas[i]));
    };


    function DataTransferencias(){
        this.array_data_prod = array_data_prod;
        this.array_data_tran = array_data_tran;
        this.id_num = datos_usuario[0].id;
        this.fecha = generarFecha();
    }
    let fila = new DataTransferencias();
    console.log(fila)
    let filaTransferencia = URL_API_almacen_central + 'procesar_transferencia'
    let response = await funcionFetchDos(filaTransferencia, fila)

    if(response.status === "success"){
        modal_proceso_abrir(`Operación "${response.message}" completada exitosamente.`)
        modal_proceso_salir_botones()
    }
};
////BOTONES PARA ELIMINAR CONTENIDO DE TABLAS////////////////////////////////////////////////////////////////////////
const removerTablaTransferenciasUno = document.getElementById("remover-tabla-transferencias-uno");
removerTablaTransferenciasUno.addEventListener("click", () =>{
    document.querySelector(".contenedor-pre-transferencia").classList.remove("modal-show-transferencia")
    document.querySelector("#tabla_principal > tbody").remove();
    document.querySelector("#tabla_principal").createTBody();
    document.getElementById("buscador-productos-transferencias").focus();
});
const removerTablaTransferenciasDos = document.getElementById("remover-tabla-transferencias-dos");
removerTablaTransferenciasDos.addEventListener("click", () =>{
    document.querySelector("#tabla-proforma-transferencias > tbody").remove();
    document.querySelector("#tabla-proforma-transferencias").createTBody();
    document.getElementById("buscador-productos-transferencias").focus();
    array_saldos = [];//limpiamos el array
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function cambioSucursalTransferencias(){
    document.getElementById("fffff-sucursal").addEventListener("change", ()=>{
        sucursal_transferencias = document.getElementById("fffff-sucursal").value
        indice_sucursal_transferencias = obtenerIndiceSucursal()
        document.getElementById("buscador-productos-transferencias").focus();
    });
};
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
    let linea = button.closest("li");
    sucursal_transferencias = document.getElementById("fffff-sucursal").value
    indice_sucursal_transferencias = obtenerIndiceSucursal()
    document.getElementById('id-transferencias').value = linea.children[0].textContent;
    document.getElementById('categoria-transferencias').value = linea.children[1].textContent;
    document.getElementById('codigo-transferencias').value = linea.children[2].textContent;
    document.getElementById('descripcion-transferencias').value = linea.children[3].textContent;
};
function agregarBusquedaDetalleDos(button){
    let linea = button.closest("li");
    document.getElementById('id-transferencias').value = linea.children[0].textContent;
    sucursal_transferencias = document.getElementById("fffff-sucursal").value
    indice_sucursal_transferencias = obtenerIndiceSucursal()
    document.getElementById('categoria-transferencias').value = linea.children[2].textContent;
    document.getElementById('codigo-transferencias').value = linea.children[3].textContent;
    document.getElementById('descripcion-transferencias').value = linea.children[4].textContent;
};

