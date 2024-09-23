document.addEventListener("DOMContentLoaded", inicioDevolucionCompras)
let anio_principal = ""
function inicioDevolucionCompras(){
    anio_principal = new Date().getFullYear()

    cargarDatosAnio()
    graficoDevolucionesCompras();
    btnDevolucionCompras = 1;
};
let array_comprobante= []
const barras_dev_compras = [".cg_1_c", ".cg_2_c", ".cg_3_c", ".cg_4_c", ".cg_5_c"]
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        reinicioBarraGrafico(barras_dev_compras);
        anio_principal = anio_referencia.value;

        graficoDevolucionesCompras();

        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////DEVOLUCION POR COMPRAS////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let sucursal_indice_dev_compras = 0;
function eliminarFilaCompras(){
    document.querySelectorAll(".eliminar_fila_compras").forEach((event)=>{
        event.addEventListener("click", ()=>{
            event.parentNode.parentNode.parentNode.remove()
        })
    });
};
async function crearBodyDevoluciones(){
    array_comprobante = await cargarDatos(`entradas_comprobante/${document.getElementById("buscador_operacion").value}`)

    array_comprobante.forEach((event) => {
        if(event.comprobante.toLowerCase() === document.getElementById('buscador_operacion').value.toLowerCase()){
            console.log(event.id_prod)
            suc_add.forEach((e, i)=>{
                if(e === event.sucursal_nombre){
                    sucursal_indice_dev_compras = i;
                };
            });
            let tablaDevolucionesCompras= document.querySelector("#tabla-devolucion-compras > tbody");
            let nuevaFilaTablaDevolucionesCompras = tablaDevolucionesCompras.insertRow(-1);
            let fila = `<tr>`+
                            `<td class="invisible">${event.idEntr}</td>`+//Columna 0 > id entradas
                            `<td>${event.sucursal_nombre}</td>`+//Columna 1 > sucursal
                            `<td class="codigoDevoluciones" style="background: rgb(105, 211, 35); border-radius: 5px">${event.codigo}</td>`+//Columna 2 >código
                            `<td style="text-align: right">${event.existencias_entradas}</td>`+//Columna 3 > existencias compradas
                            `<td><input class="cantidadADevolver input-tablas-dos-largo" onkeyup = "operarQDevolucion(this)"></td>`+//Columna 4 > cantidad a devolver
                            `<td>${event.comprobante}</td>`+//Columna 5 > comprobante de compra
                            `<td class="invisible">${event.id_prod}</td>`+//Columna 6 > id producto
                            `<td style="text-align: right">${event.existencias_devueltas}</td>`+//Columna 7 > cantidad devuelta
                            `<td style="text-align: right"></td>`+//Columna 8 > existencias compradas - (cantidad a devolver + cantidad devuelta)
                            `<td class="invisible">${event.id_sucursales}</td>`+//Columna 9 > id sucursal
                            `<td class="invisible">${sucursal_indice_dev_compras}</td>`+//Columna 10 > índice sucursal
                            `<td style="text-align: center">
                                <div class="tooltip">
                                    <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras">delete</span></a>
                                    <span class="tooltiptext">Eliminar producto</span>
                                </div>
                            </td>`+//Columna 11 >
                        `</tr>`
            nuevaFilaTablaDevolucionesCompras.innerHTML = fila;
            eliminarFilaCompras()
        };
    });
};

const mandarATablaDevoluciones = document.getElementById("mandar-tabla-devoluciones");
mandarATablaDevoluciones.addEventListener("click",manadarDevoluciones)
async function manadarDevoluciones(e){
    e.preventDefault();
    if(document.getElementById("buscador_operacion").value.startsWith("Compra") ||
    document.getElementById("buscador_operacion").value.startsWith("Recompra")){
        document.querySelector(".contenedor-devolucion-compras").classList.add("modal-show-devolucion-compras");
        await crearBodyDevoluciones();
        /* operarQDevolucion(); */
        /* await buscarPorCodidoDevolucionesEnProductos(); */
        document.querySelectorAll(".id_proforma").forEach((e) => {
            if(e.parentNode.children[5].textContent == document.getElementById("buscador_operacion").value){
                modal_proceso_abrir("Esta compra ya existe en tabla devoluciones, si continua se sobreescribirá por esta nueva.", "")
                modal_proceso_salir_botones()
                e.parentNode.style.background = "#b36659"
            }
        });
        document.querySelector("#tabla-devolucion-compras > tbody > tr:nth-child(1) > td:nth-child(5) > input").focus()
    }else{
        modal_proceso_abrir(`Ingrese un formato válido, ejemplo: Compra-10 o Recompra-20`, "")
        modal_proceso_salir_botones()
    };
};
function operarQDevolucion(e){
    let row_ = e.closest("tr");
    ////saldo de la compra///////  
    row_.children[8].textContent = Number(row_.children[3].textContent) - 
                                    (Number(row_.children[4].children[0].value) + Number(row_.children[7].textContent));

    if(Number(row_.children[8].textContent) < 0){
        row_.children[8].style.background = "#b36659"
        row_.children[4].children[0].style.background = "#b36659"
    }else{
        row_.children[8].style.background = ""
        row_.children[4].children[0].style.background = ""
    };
};

async function buscarPorCodidoDevolucionesEnProductos(){
    const insertarBuscarMovimientos = document.querySelectorAll(".codigoDevoluciones");
    let datoCodigoUnitario = [];
    for(let i = 0; i < insertarBuscarMovimientos.length; i++){
        datoCodigoUnitario = await cargarDatos(`almacen_central_codigo_sucursal/${insertarBuscarMovimientos[i].textContent}?`+
                                            `sucursal_get=${sucursales_activas[insertarBuscarMovimientos[i].parentNode.children[14].textContent]}`)
        if(datoCodigoUnitario.idProd){
            insertarBuscarMovimientos[i].parentNode.children[7].textContent = datoCodigoUnitario.idProd
            insertarBuscarMovimientos[i].parentNode.children[8].textContent = datoCodigoUnitario.sucursal_get
        };
    };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function crearBodyDevolucionesFinal(){

    let fila_modal = document.querySelectorAll(".codigoDevoluciones")
    fila_modal.forEach((event)=>{
        let row_ = event.closest("tr");
        document.querySelectorAll(".id_proforma").forEach((e) => {
            if(row_.children[0].textContent == e.textContent && 
            row_.children[4].children[0].value > 0){
                e.parentElement.remove()
                modal_proceso_abrir("Este producto ya se encuentra en la tabla devoluciones, se reempazará con estos datos recientes.", "")
                modal_proceso_salir_botones()
            }
        });
        if(row_.children[4].children[0].value > 0 &&
        row_.children[8].textContent >= 0 ){
            let tablaDevolucionesComprasFinal= document.querySelector("#tabla-devolucion-compras-final > tbody");
            let nuevaFilaTablaDevolucionesComprasFinal = tablaDevolucionesComprasFinal.insertRow(-1);
            let fila = `<tr>`+
                            `<td class="id_proforma invisible">${row_.children[0].textContent}</td>`+// Columna 0 > id entradas
                            `<td>${row_.children[1].textContent}</td>`+// Columna 1 > sucursal
                            `<td>${event.textContent}</td>`+// Columna 2 > código
                            `<td>${row_.children[3].textContent}</td>`+// Columna 3 > existencias compradas
                            `<td>${row_.children[4].children[0].value}</td>`+// Columna 4 > cantidad a devolver
                            `<td>${row_.children[5].textContent}</td>`+// Columna 5 > comprobante de compra
                            `<td class="invisible">${row_.children[6].textContent}</td>`+// Columna 6 > id producto
                            `<td class="invisible">${row_.children[7].textContent}</td>`+// Columna 7 > cantidad devuelta
                            `<td class="invisible">${row_.children[9].textContent}</td>`+// Columna 8 > id sucursal
                            `<td class="invisible">${row_.children[10].textContent}</td>`+// Columna 9 > índice sucursal
                            `<td>${document.getElementById("causaDevolucionCompras").value}</td>`+// Columna 10 > causa de devolución
                            `<td style="text-align: center">
                                <div class="tooltip">
                                    <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras">delete</span></a>
                                    <span class="tooltiptext">Eliminar producto</span>
                                </div>
                            </td>`+// Columna 14 > 
                        `</tr>`
            nuevaFilaTablaDevolucionesComprasFinal.innerHTML = fila;
            eliminarFilaCompras()
        };
    });
};

const mandarATablaDevolucion = document.getElementById("procesar-devolucion-compras");
mandarATablaDevolucion.addEventListener("click", (e)=>{
    e.preventDefault();

    crearBodyDevolucionesFinal();
    const borrar = document.querySelectorAll(".cantidadADevolver");//eliminamos las filas que si pasaron a la tabla principal
    borrar.forEach((e)=>{
        if(e.value > 0 && e.parentNode.parentNode.children[8].textContent >= 0){
            e.parentNode.parentNode.remove()
        }else if(e.parentNode.parentNode.children[8].textContent < 0){
            modal_proceso_abrir("Ya no cuenta con unidades para devolver.", "")
            modal_proceso_salir_botones()
        };
    });
    if(document.querySelector("#tabla-devolucion-compras > tbody").children.length == 0){
        document.querySelector(".contenedor-devolucion-compras").classList.remove("modal-show-devolucion-compras");
    };
    document.getElementById("causaDevolucionCompras").value = 0
    document.getElementById("buscador_operacion").value = ""
    document.getElementById("buscador_operacion").focus();
});
const procesarDevolucionCompras = document.getElementById("procesar-devolucion-compras-final");
procesarDevolucionCompras.addEventListener("click", procesamientoDevolucionCompras)
async function procesamientoDevolucionCompras(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla-devolucion-compras-final > tbody").children.length > 0){
            modal_proceso_abrir("Procesando la devolución de la compra!!!.", "")
            await realizarDevolucionCompras()
        }
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. " + error, "")
        console.error("Ocurrió un error. ", error)
        modal_proceso_salir_botones()
    };
};
async function realizarDevolucionCompras(){
    let array_devolucion = [];
    function DatosDeDevolucionCompras(a){
        this.idProd = a.children[6].textContent;
        this.sucursal_post = sucursales_activas[a.children[9].textContent];
        this.existencias_post = Number(a.children[4].textContent);

        this.idEntr = a.children[0].textContent;
        /* this.existencias_entradas_update = a.children[3].textContent; */
        /* this.existencias_devueltas_update = a.children[11].textContent; */

        this.comprobante = "Dev-" + a.children[5].textContent;
        this.causa_devolucion = a.children[10].textContent;
        this.sucursal = a.children[8].textContent;
        /* this.existencias_devueltas_insert = a.children[4].textContent; */
        
    };
    const numFilas = document.querySelector("#tabla-devolucion-compras-final > tbody").children
    for(let i = 0 ; i < numFilas.length; i++){
        if(numFilas[i]){
            array_devolucion.push(new DatosDeDevolucionCompras(numFilas[i]));
            /* let filaPlus = new DatosDeDevolucionCompras(numFilas[i]);
            let urlDevolucionProductosUnoC = URL_API_almacen_central + 'procesar_devolucion_compras'
            let response = await funcionFetch(urlDevolucionProductosUnoC, filaPlus)
            console.log("Respuesta Productos "+response.status)
            if(response.status === 200){
                suma_productos +=1;
                modal_proceso_abrir("Procesando la devolución de la compra!!!.", `Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
                console.log(`Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
            } */
        };
    };
    function DataDevoluciones(){
        this.array_devolucion = array_devolucion;
        this.fecha = generarFecha();
    }
    let url = URL_API_almacen_central + 'procesar_devolucion_compras'
    let fila = new DataDevoluciones()
    console.log(fila)
    let response = await funcionFetch(url, fila)
    console.log(response)
    /* if(suma_productos === numFilas.length){
        modal_proceso_abrir("Operación completada exitosamente.", "")
        modal_proceso_salir_botones()
        document.getElementById("buscador_operacion").value="";
        document.querySelector("#tabla-devolucion-compras-final > tbody").remove();
        document.querySelector("#tabla-devolucion-compras-final").createTBody();
    }else{
        modal_proceso_abrir(`Ocurrió un problema en la fila ${suma_productos + 1}`, "")
        modal_proceso_salir_botones()
    }; */
};

const removerTablaDevolucionesUno = document.getElementById("remover-tabla-devoluciones-compras-uno");
removerTablaDevolucionesUno.addEventListener("click", () =>{
    document.querySelector(".contenedor-devolucion-compras").classList.remove("modal-show-devolucion-compras");
    document.querySelector("#tabla-devolucion-compras > tbody").remove();
    document.querySelector("#tabla-devolucion-compras").createTBody();
    document.getElementById("buscador_operacion").focus();
});
const removerTablaDevolucionesDos = document.getElementById("remover-tabla-devoluciones-compras-dos");
removerTablaDevolucionesDos.addEventListener("click", () =>{
    document.querySelector("#tabla-devolucion-compras-final > tbody").remove();
    document.querySelector("#tabla-devolucion-compras-final").createTBody();
});

async function graficoDevolucionesCompras(){
    devolucionesEntradas = await cargarDatos('entradas_suma_devoluciones_mes?'+
                                            `year_actual=${anio_principal}`)
    let arrayDevolucionCompras = [];
    let masAlto = 0;
    document.querySelectorAll(".f_l_g").forEach((event, i)=>{
        event.textContent = `${meses_letras[i]}${anio_principal % 100}`;
    });
    for(let i = 0; i < 12; i++){
        arrayDevolucionCompras.push(0);
        devolucionesEntradas.forEach((event)=>{
            if(event.mes == i + 1){
                arrayDevolucionCompras[i] = -event.suma_devoluciones_entradas;
            }
            if(masAlto < -event.suma_devoluciones_entradas){masAlto = -event.suma_devoluciones_entradas}
        });
    };
    let masAltoDos = (226 * masAlto)/214;
    document.querySelectorAll(".eje_y_numeracion").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos -= 0.20 * ((226 * masAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_1_c"), arrayDevolucionCompras, masAlto, colorFondoBarra[0], document.querySelectorAll(".sg_1_c"), 8, moneda())
};