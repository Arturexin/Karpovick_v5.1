document.addEventListener("DOMContentLoaded", inicioTransferencias)
let anio_principal = ""
function inicioTransferencias(){
    anio_principal = new Date().getFullYear()
    llenarCategoriaProductosEjecucion("#categoria-transferencias")
 
    cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))
    cargarSucursalesEjecucion(document.getElementById("sucursal-destino-transferencias"))
    cargarDatosAnio()
    btnTransferencias = 1;
    cambioSucursalTransferencias()
    llenarCategoriaProductosEjecucion("#categoria-transferencias")

    busquedaStock()
    llenarCategoriaProductosEjecucion("#categoria_buscador_detalle")
    indice_base = JSON.parse(localStorage.getItem("base_datos_consulta"))
};
let seguro_saldo = 0;
let array_saldos = [];
let suc_tra = [];
const barras_transferencias = [".cg_1_t", ".cg_2_t", ".cg_3_t", ".cg_4_t", ".cg_5_t"]
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        reinicioBarraGrafico(barras_transferencias);
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

const formularioTransferencias = document.getElementById("formulario-transferencias");
///////////////////BUSCADOR DE PRODUCTOS EN FORMULARIO TRANSFERENCIAS/////////////////////////
let sucursal_transferencias = 0;
let indice_sucursal_transferencias = 0;
let sucursal_transferencias_dos = 0;
let indice_sucursal_transferencias_dos = 0;
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
        indice_sucursal_transferencias = document.getElementById("fffff-sucursal").selectedIndex
        sucursal_transferencias_dos = document.getElementById("sucursal-destino-transferencias").value
        indice_sucursal_transferencias_dos = document.getElementById("sucursal-destino-transferencias").selectedIndex
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
    const codigoComprasComparacionProductos = document.querySelectorAll(".id_proforma");
    codigoComprasComparacionProductos.forEach((event, i) => {
        document.querySelectorAll(".id_modal").forEach((elemento) => {
            if(elemento.textContent === event.textContent &&
            event.parentNode.children[1].textContent == elemento.parentNode.children[1].textContent &&
            event.parentNode.children[8].textContent == elemento.parentNode.children[8].textContent){
                let respuesta = confirm("El código " + event.parentNode.children[3].textContent + " ya está en proceso de transferencia a " + event.parentNode.children[8].textContent + ", si continua se reemplazará por este nuevo.")
                if(respuesta){
                    calcularSaldos(event.parentNode.children[0].textContent, // Devolvemos las cantidades a sucursal de origen 
                                    event.parentNode.children[14].textContent, 
                                    event.parentNode.children[12].textContent, 
                                    event.parentNode.children[7].textContent)

                    let array_existencias_suc = [];
                    array_saldos.forEach((e)=>{
                        if(e.idProd == event.parentNode.children[0].textContent){
                            elemento.parentNode.children[1].textContent = document.querySelector("#fffff-sucursal").children[indice_sucursal_transferencias].textContent
                            elemento.parentNode.children[2].textContent = e.categoria
                            elemento.parentNode.children[4].textContent = e.descripcion
                            array_existencias_suc = [e.existencias_ac, 
                                                    e.existencias_su, 
                                                    e.existencias_sd, 
                                                    e.existencias_st]
                        }
                        for(let j = 0; j < array_existencias_suc.length; j++){
                            if(e.idProd == event.parentNode.children[0].textContent && event.parentNode.children[12].textContent == j){
                                elemento.parentNode.children[5].textContent = array_existencias_suc[j]
                                elemento.parentNode.children[6].textContent = array_existencias_suc[j]
                            }
                            if(e.idProd == event.parentNode.children[0].textContent && event.parentNode.children[14].textContent == j){
                                elemento.parentNode.children[9].textContent = array_existencias_suc[j]
                            }
                        }
                    })
                    elemento.parentNode.style.background = "var(--boton-dos)";
                    event.parentNode.remove();
                }else{
                    elemento.parentNode.remove();
                }
            };
        });
    });
};

function crearBodyTransferencias(codigoTransferencia, id_prod){
    let tablaTransferencias= document.querySelector("#tabla-pre-transferencias > tbody");
    let nuevaFilaTablaTransferencias = tablaTransferencias.insertRow(-1);
    let fila = `<tr>`+
                    `<td class="id_modal invisible">${id_prod}</td>`+// Columna 0 > id producto
                    `<td>${document.getElementById("fffff-sucursal").value}</td>`+// Columna 1 > sucursal origen
                    `<td class="invisible"></td>`+// Columna 2 > categoría
                    `<td class="insertar input-tablas" style="border-radius: 5px">${codigoTransferencia}</td>`+// Columna 3 > código
                    `<td></td>`+// Columna 4 > descripción
                    `<td class="invisible"></td>`+// Columna 5 > existencias sucursal origen
                    `<td style="text-align: right"></td>`+// Columna 6 > existencias sucursal origen - cantidad a transferir***
                    `<td><input class="input-tablas-dos-largo insertarNumeroTransferencias" placeholder="Valor > 0"></td>`+// Columna 7 > cantidad a transferir
                    `<td>${document.getElementById("sucursal-destino-transferencias")[indice_sucursal_transferencias_dos].textContent}</td>`+// Columna 8 > sucursal destino
                    `<td style="text-align: right"></td>`+// Columna 9 > existencias sucursal destino
                    `<td style="text-align: right"></td>`+// Columna 10 > cantidad a transferir + existencias sucursal destino***
                    `<td class="invisible">${sucursal_transferencias}</td>`+// Columna 11 > id sucursal origen
                    `<td class="invisible">${indice_sucursal_transferencias}</td>`+// Columna 12 > índice sucursal origen
                    `<td class="invisible">${sucursal_transferencias_dos}</td>`+// Columna 13 > id sucursal destino
                    `<td class="invisible">${indice_sucursal_transferencias_dos}</td>`+// Columna 14 > índice sucursal destino
                    `<td style="text-align: center">
                        <div class="tooltip">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_transferencias">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </div>
                    </td>`+// Columna 15 > 
                `</tr>`
    nuevaFilaTablaTransferencias.innerHTML = fila;
    eliminarFilaTransferencias()
};
function eliminarFilaTransferencias(){
    document.querySelectorAll(".eliminar_fila_transferencias").forEach((event)=>{
        event.addEventListener("click", ()=>{
            event.parentNode.parentNode.parentNode.remove()
        })
    });
};

let arrayCreacionCategoriaTallasTransferencias = [];
const mandarATablaPreTransferencias = document.getElementById("agregarATablaPreTransferencias");
mandarATablaPreTransferencias.addEventListener("click", agregarAtablaPreTransferencias)
async function agregarAtablaPreTransferencias(e){
    e.preventDefault();
    let base_datos_busqueda = JSON.parse(localStorage.getItem("base_datos_consulta"))
    let base = 0;
    if(document.getElementById("fffff-sucursal").value !=
        document.getElementById("sucursal-destino-transferencias").value &&
        document.getElementById("sucursal-destino-transferencias").value != "" &&
        document.getElementById("id-transferencias").value > 0){
        categoriaProductosCreacion(document.getElementById("categoria-transferencias").value, arrayCreacionCategoriaTallasTransferencias);

        for(let i = 0; i < arrayCreacionCategoriaTallasTransferencias.length; i++){// Se crean códigos según categorías
            if(document.getElementById("id-transferencias").value > 0){
                let codigoTransferencia = document.getElementById("codigo-transferencias").value
                for(let j = 0; j < arrayCreacionCategoriaTallasTransferencias.length; j++){
                    if(codigoTransferencia.includes("-" + arrayCreacionCategoriaTallasTransferencias[j])){
                        codigoTransferencia = codigoTransferencia.replace("-" + arrayCreacionCategoriaTallasTransferencias[j], "-" + arrayCreacionCategoriaTallasTransferencias[i])
                    }
                };
                if(base_datos_busqueda.find(y => y.codigo == codigoTransferencia)){// Se busca la existencia de los códigos creados según categorías
                    base = base_datos_busqueda.find(y => y.codigo == codigoTransferencia)
                    crearBodyTransferencias(codigoTransferencia, base.idProd)
                };
            };
        };
        document.querySelectorAll(".insertar").forEach((event)=>{
            if(event.textContent === document.getElementById("codigo-transferencias").value){
                event.style.background = "var(--boton-tres)"
            }
        });
        document.querySelector(".contenedor-pre-transferencia").classList.add("modal-show-transferencia")
        await buscarPorCodidoTransferenciasOrigen();
        
        marcarProductoRepetidoTransferencias();
        operarCantidadTransferencias();

        arrayCreacionCategoriaTallasTransferencias = [];
        document.querySelector("#tabla-pre-transferencias > tbody > tr > td:nth-child(8) > input").focus()
    }else if(document.getElementById("fffff-sucursal").value ===
    document.getElementById("sucursal-destino-transferencias").value){
        modal_proceso_abrir("Elija una sucursal de destino diferente a la de origen.", "")
        modal_proceso_salir_botones()
    }else if(document.getElementById("id-transferencias").value < 1){
        modal_proceso_abrir("Seleccione un código a transferir.", "")
        modal_proceso_salir_botones()
    };
};

async function buscarPorCodidoTransferenciasOrigen(){
    const id_comparacion = document.querySelectorAll(".id_modal");
    for(let i = 0; i < id_comparacion.length; i++){
        try{
            let url = URL_API_almacen_central + `almacen_central_codigo_doble_sucursal/${id_comparacion[i].textContent}`
            let response = await fetch(url,{
                "method": "GET",
                "headers": {
                    "Content-Type": 'application/json'
                }
            });
            if(response.ok){
                if(seguro_saldo == 0){// Comprobamos que el array seguro_saldo esté vacío
                    array_saldos.push(await response.json());// se inserta el objeto response en el array
                }else{// Si no está vacío se compara los id del array con los id del modal
                    let coincidencia = array_saldos.find(x => x.idProd == id_comparacion[i].textContent)
                    if(coincidencia === undefined){// Si no encuentra conincidencias se inserta el objeto response en el array
                        array_saldos.push(await response.json());
                    }
                }

                if(array_saldos.length > 0){
                    
                    let array_existencias_suc = [];
                    array_saldos.forEach((e)=>{
                        if(e.idProd == id_comparacion[i].textContent){
                            id_comparacion[i].parentNode.children[1].textContent = document.querySelector("#fffff-sucursal").children[indice_sucursal_transferencias].textContent
                            id_comparacion[i].parentNode.children[2].textContent = e.categoria
                            id_comparacion[i].parentNode.children[4].textContent = e.descripcion
                            array_existencias_suc = [e.existencias_ac, 
                                                        e.existencias_su, 
                                                        e.existencias_sd, 
                                                        e.existencias_st]
                        }
                        for(let j = 0; j < array_existencias_suc.length; j++){
                            if(e.idProd == id_comparacion[i].textContent && indice_sucursal_transferencias == j){
                                id_comparacion[i].parentNode.children[5].textContent = array_existencias_suc[j]//existencias sucursal origen
                                id_comparacion[i].parentNode.children[6].textContent = array_existencias_suc[j]//existencias sucursal origen
                            }
                            if(e.idProd == id_comparacion[i].textContent && indice_sucursal_transferencias_dos == j){
                                id_comparacion[i].parentNode.children[9].textContent = array_existencias_suc[j]//existencias sucursal destino
                            }
                        };
                    })

                    if(id_comparacion[i].parentNode.children[0].textContent == document.getElementById("id-transferencias").value){
                        id_comparacion[i].style.background = "rgb(105, 211, 35)"
                    };
                };
                if(id_comparacion[i].parentNode.children[0].textContent  < 1){//OCULTAMOS LAS FILAS QUE NO MUESTRAN ID O NO EXISTEN EL LA TABLA PRODUCTOS
                    id_comparacion[i].parentNode.remove()
                };
            }else {
                console.error("Error en la solicitud a la API");
            };
        }catch (error) {
            console.error("Error en la solicitud a la API:", error);
        };
    };
    if(array_saldos.length > 0){
        seguro_saldo = 1;// con 1 indica que el array no está vacío
    };
};
function operarCantidadTransferencias(){
    const cant_trans = document.querySelectorAll(".insertarNumeroTransferencias");
    cant_trans.forEach((e)=>{
        let saldo_inicio_origen = e.parentNode.parentNode.children[5].textContent
        let saldo_inicio_destino = e.parentNode.parentNode.children[9].textContent
        e.addEventListener("keyup",(i)=>{
            i.target.parentNode.parentNode.children[6].textContent = 
                Number(saldo_inicio_origen) - Number(i.target.value);

            i.target.parentNode.parentNode.children[10].textContent = 
                Number(saldo_inicio_destino) + Number(i.target.value);
        });
    });
};
function calcularSaldos(id, indice_origen, indice_destino, tabla_cantidad){// Se suma y resta en array_saldos según la cantidad a transferir
    array_saldos.forEach((d)=>{
        if(d.idProd == id && indice_origen == 0){
            d.existencias_ac = Number(d.existencias_ac) - Number(tabla_cantidad);
        }else if(d.idProd == id && indice_origen == 1){
            d.existencias_su = Number(d.existencias_su) - Number(tabla_cantidad);
        }else if(d.idProd == id && indice_origen == 2){
            d.existencias_sd = Number(d.existencias_sd) - Number(tabla_cantidad);
        }else if(d.idProd == id && indice_origen == 3){
            d.existencias_st = Number(d.existencias_st) - Number(tabla_cantidad);
        }
    });
    array_saldos.forEach((d)=>{
        if(d.idProd == id && indice_destino == 0){
            d.existencias_ac = Number(d.existencias_ac) + Number(tabla_cantidad);
        }else if(d.idProd == id && indice_destino == 1){
            d.existencias_su = Number(d.existencias_su) + Number(tabla_cantidad);
        }else if(d.idProd == id && indice_destino == 2){
            d.existencias_sd = Number(d.existencias_sd) + Number(tabla_cantidad);
        }else if(d.idProd == id && indice_destino == 3){
            d.existencias_st = Number(d.existencias_st) + Number(tabla_cantidad);
        }
    });
};
//PROFORMA
function filaBodyTransferenciasProformaPincipal(){
    let fila_modal = document.querySelectorAll(".insertar");
    fila_modal.forEach((event)=>{

        event.parentNode.children[7].children[0].style.background = ""

        if(Number(event.parentNode.children[7].children[0].value) > 0 &&
        event.parentNode.children[7].children[0].value !== 0 &&
        Number(event.parentNode.children[6].textContent) >= 0){
            let tablaTransferencias = document.querySelector("#tabla-proforma-transferencias > tbody");
            let nuevaFilaTablaTransferencias = tablaTransferencias.insertRow(-1);
            let fila = `<tr>`+
                            `<td class="id_proforma invisible">${event.parentNode.children[0].textContent}</td>`+ // Columna 0 > id producto
                            `<td>${event.parentNode.children[1].textContent}</td>`+ // Columna 1 > sucursal
                            `<td class="invisible">${event.parentNode.children[2].textContent}</td>`+ // Columna 2 > categoría
                            `<td>${event.parentNode.children[3].textContent}</td>`+ // Columna 3 > código
                            `<td>${event.parentNode.children[4].textContent}</td>`+ // Columna 4 > descripción
                            `<td class="invisible">${event.parentNode.children[5].textContent}</td>`+ // Columna 5 > 
                            `<td class="invisible">${event.parentNode.children[6].textContent}</td>`+ // Columna 6 > 
                            `<td style="text-align: right">${event.parentNode.children[7].children[0].value}</td>`+ // Columna 7 > 
                            `<td>${event.parentNode.children[8].textContent}</td>`+ // Columna 8 > 

                            `<td class="invisible">${event.parentNode.children[9].textContent}</td>`+ // Columna 9 > 
                            `<td class="invisible">${event.parentNode.children[10].textContent}</td>`+ // Columna 10 > 

                            `<td class="invisible">${event.parentNode.children[11].textContent}</td>`+ // Columna 11 > 
                            `<td class="invisible">${event.parentNode.children[12].textContent}</td>`+ // Columna 12 > 
                            `<td class="invisible">${event.parentNode.children[13].textContent}</td>`+ // Columna 13 > 
                            `<td class="invisible">${event.parentNode.children[14].textContent}</td>`+ // Columna 14 > 
                            `<td style="text-align: center">
                                <div class="tooltip">
                                    <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_transferencias_dos">delete</span>
                                    <span class="tooltiptext">Eliminar producto</span>
                                </div>
                            </td>`+
                        `</tr>`
            nuevaFilaTablaTransferencias.innerHTML = fila;
            event.parentNode.children[7].children[0].style.background = ""
        }else if(Number(event.parentNode.children[7].children[0].value) <= 0 &&
        event.parentNode.children[7].children[0].value === 0){
            event.parentNode.children[7].children[0].style.background = "#b36659"
        }else if(Number(event.parentNode.children[6].textContent) < 0){
            modal_proceso_abrir("La cantidad a transferir supera las existencias en la sucursal de origen.", "")
            modal_proceso_salir_botones()
            event.parentNode.children[7].children[0].style.background = "#b36659"
        };
    });
    eliminarFilaTransferenciasSaldo()
};

function eliminarFilaTransferenciasSaldo() {// Se usa para eliminar filas de tabla proforma
    const contenedor = document.querySelector("#tabla-proforma-transferencias > tbody");
    contenedor.removeEventListener("click", clicEnEliminarFila);// Remover eventos anteriores para evitar duplicación
    contenedor.addEventListener("click", clicEnEliminarFila);// Asignar nuevo evento de clic
};

function clicEnEliminarFila(e) {
    if (e.target.classList.contains("eliminar_fila_transferencias_dos")) {
        const fila = e.target.closest("tr");
        calcularSaldos(fila.children[0].textContent,
                        fila.children[14].textContent,
                        fila.children[12].textContent,
                        fila.children[7].textContent);
        fila.remove();
    }
};
const procesarPreTransferencias = document.querySelector("#procesar-pre-transferencias");
procesarPreTransferencias.addEventListener("click", agregarAtablaTransferenciasPrincipal)
function agregarAtablaTransferenciasPrincipal(e){
    e.preventDefault();
    filaBodyTransferenciasProformaPincipal();
    const borrar = document.querySelectorAll(".insertarNumeroTransferencias");//eliminamos las filas que si pasaron a la tabla principal
    borrar.forEach((e)=>{
        if(e.parentNode.parentNode.children[6].textContent >= 0 && e.value > 0 && e.value !== ""){
            calcularSaldos(e.parentNode.parentNode.children[0].textContent, 
                            e.parentNode.parentNode.children[12].textContent, 
                            e.parentNode.parentNode.children[14].textContent, 
                            e.value)
            e.parentNode.parentNode.remove()
        }
    })
    if(document.querySelector("#tabla-pre-transferencias > tbody").children.length == 0){
        document.querySelector(".contenedor-pre-transferencia").classList.remove("modal-show-transferencia")
    }
    let sumaTotalCantidadtransferida= 0;
    let numeroFilasTablaTransferencias = document.querySelector("#tabla-proforma-transferencias > tbody").rows.length;
    for(let i = 0; i < numeroFilasTablaTransferencias; i++){
        sumaTotalCantidadtransferida += Number(document.querySelector("#tabla-proforma-transferencias > tbody").children[i].children[7].innerHTML) 
    }
    document.getElementById("total-cantidad-tabla-transferencias").textContent = sumaTotalCantidadtransferida;

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
            let obteniendo_numeracion = await cargarNumeracionComprobante();
            if(obteniendo_numeracion.status === 200){
                await realizarTransferencia()
                if(document.querySelector("#check_comprobante").checked){
                    imprimirListaTabla()//Lista de transferencias
                };
                document.querySelector("#tabla-proforma-transferencias > tbody").remove();
                document.querySelector("#tabla-proforma-transferencias").createTBody();
                array_saldos = [];// Eliminamos el contenido del array_saldos
            }else{
                modal_proceso_abrir("La conexión con el servidor no es buena.", "")
                modal_proceso_salir_botones()
            };
        }
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. ", error, "")
        console.error("Ocurrió un error. ", error)
        modal_proceso_salir_botones()
    };
};
async function realizarTransferencia(){
    let suma_productos = 0;
    function DatosDeTransferencia(a){
        this.idProd = a.children[0].textContent;
        this.sucursal_post = sucursales_activas[a.children[12].textContent];
        this.existencias_post = a.children[6].textContent;
        this.sucursal_post_dos = sucursales_activas[a.children[14].textContent];
        this.existencias_post_dos = a.children[10].textContent;
        
        this.comprobante = "Transferencia-" + (Number(numeracion[0].transferencias) + 1);
        this.cantidad = a.children[7].textContent;
        this.id_suc_origen = a.children[11].textContent;
        this.id_suc_destino = a.children[13].textContent;
        this.fecha_tran = generarFecha();
    };
    const numFilas = document.querySelector("#tabla-proforma-transferencias > tbody").children
    for(let i = 0 ; i < numFilas.length; i++ ){
        if(numFilas[i]){
            let filaUno = new DatosDeTransferencia(numFilas[i]);
            let filaTransferencia = URL_API_almacen_central + 'procesar_transferencia'
            let response = await funcionFetch(filaTransferencia, filaUno)
            console.log("Respuesta Productos "+response.status)
            if(response.status === 200){
                suma_productos +=1;
                modal_proceso_abrir("Procesando la transferencia!!!.", `Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
                console.log(`Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
            }
        };
    };
    if(suma_productos === numFilas.length){
        await funcionTransferenciasNumeracion();
    }else{
        modal_proceso_abrir(`Ocurrió un problema en la fila ${suma_productos + 1}`, `Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
        console.log(`Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
        modal_proceso_salir_botones()
    };
};
async function funcionTransferenciasNumeracion(){
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
    let urlTranferenciasComprobante = URL_API_almacen_central + 'numeracion_comprobante'
    let response = await funcionFetch(urlTranferenciasComprobante, dataComprobante)
    console.log("Respuesta Numeración "+response.status)
    if(response.status === 200){
        modal_proceso_abrir('Operación completada exitosamente.')
        modal_proceso_salir_botones()
    };
};
////BOTONES PARA ELIMINAR CONTENIDO DE TABLAS////////////////////////////////////////////////////////////////////////
const removerTablaTransferenciasUno = document.getElementById("remover-tabla-transferencias-uno");
removerTablaTransferenciasUno.addEventListener("click", () =>{
    document.querySelector(".contenedor-pre-transferencia").classList.remove("modal-show-transferencia")
    document.querySelector("#tabla-pre-transferencias > tbody").remove();
    document.querySelector("#tabla-pre-transferencias").createTBody();
    document.getElementById("buscador-productos-transferencias").focus();
});
const removerTablaTransferenciasDos = document.getElementById("remover-tabla-transferencias-dos");
removerTablaTransferenciasDos.addEventListener("click", () =>{
    document.querySelector("#tabla-proforma-transferencias > tbody").remove();
    document.querySelector("#tabla-proforma-transferencias").createTBody();
    document.getElementById("buscador-productos-transferencias").focus();
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function cambioSucursalTransferencias(){
    document.getElementById("fffff-sucursal").addEventListener("change", ()=>{
        /* document.getElementById("formulario-transferencias").reset();
        document.getElementById("id-transferencias").value = ""; */
        /* document.getElementById("buscador-productos-transferencias").value = ""; */
        sucursal_transferencias = document.getElementById("fffff-sucursal").value
        indice_sucursal_transferencias = document.getElementById("fffff-sucursal").selectedIndex
        document.getElementById("buscador-productos-transferencias").focus();
    });
    document.getElementById("sucursal-destino-transferencias").addEventListener("change", ()=>{
        sucursal_transferencias_dos = document.getElementById("sucursal-destino-transferencias").value;
        indice_sucursal_transferencias_dos = document.getElementById("sucursal-destino-transferencias").selectedIndex;
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
    indice_sucursal_transferencias = document.getElementById("fffff-sucursal").selectedIndex
    sucursal_transferencias_dos = document.getElementById("sucursal-destino-transferencias").value;
    indice_sucursal_transferencias_dos = document.getElementById("sucursal-destino-transferencias").selectedIndex;
    document.getElementById('id-transferencias').value = linea.children[0].textContent;
    document.getElementById('categoria-transferencias').value = linea.children[1].textContent;
    document.getElementById('codigo-transferencias').value = linea.children[2].textContent;
    document.getElementById('descripcion-transferencias').value = linea.children[3].textContent;
};
function agregarBusquedaDetalleDos(button){
    let linea = button.closest("li");
    document.getElementById('id-transferencias').value = linea.children[0].textContent;
    document.getElementById("sucursal-destino-transferencias").value = linea.children[1].textContent;
    sucursal_transferencias = document.getElementById("fffff-sucursal").value
    indice_sucursal_transferencias = document.getElementById("fffff-sucursal").selectedIndex
    sucursal_transferencias_dos = document.getElementById("sucursal-destino-transferencias").value;
    indice_sucursal_transferencias_dos = document.getElementById("sucursal-destino-transferencias").selectedIndex;
    document.getElementById('categoria-transferencias').value = linea.children[2].textContent;
    document.getElementById('codigo-transferencias').value = linea.children[3].textContent;
    document.getElementById('descripcion-transferencias').value = linea.children[4].textContent;
};