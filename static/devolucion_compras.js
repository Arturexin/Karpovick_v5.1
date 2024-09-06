document.addEventListener("DOMContentLoaded", inicioDevolucionCompras)
let anio_principal = ""
function inicioDevolucionCompras(){
    anio_principal = new Date().getFullYear()

    cargarDatosAnio()
    graficoDevolucionesCompras();
    btnDevolucionCompras = 1;
};
let devolucionesComprobante= []
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
    devolucionesComprobante = await cargarDatos(`entradas_comprobante/${document.getElementById("buscador-comporbante-compras").value}`)
    let sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_encabezado"))
    devolucionesComprobante.forEach((event) => {
        if(event.comprobante.toLowerCase() === document.getElementById('buscador-comporbante-compras').value.toLowerCase()){
            sucursales_comparacion.forEach((e, i) =>{
                if(event.sucursal_nombre == e.sucursal_nombre){
                    sucursal_indice_dev_compras = i
                }
            });
            let tablaDevolucionesCompras= document.querySelector("#tabla-devolucion-compras > tbody");
            let nuevaFilaTablaDevolucionesCompras = tablaDevolucionesCompras.insertRow(-1);
            let fila = `<tr>`+
                            `<td class="invisible">${event.idEntr}</td>`+//Columna 0 > id entradas
                            `<td>${event.sucursal_nombre}</td>`+//Columna 1 > sucursal
                            `<td class="codigoDevoluciones" style="background: rgb(105, 211, 35); border-radius: 5px">${event.codigo}</td>`+//Columna 2 >código
                            `<td style="text-align: right">${event.existencias_entradas}</td>`+//Columna 3 > existencias compradas
                            `<td><input class="cantidadADevolver input-tablas-dos-largo"></td>`+//Columna 4 > cantidad a devolver
                            `<td>${event.comprobante}</td>`+//Columna 5 > comprobante de compra
                            `<td class="invisible"></td>`+//Columna 6 > causa de devolución
                            `<td class="invisible"></td>`+//Columna 7 > id producto
                            `<td class="invisible"></td>`+//Columna 8 > stock producto
                            `<td class="invisible"></td>`+//Columna 9 > stock producto - cantidad a devolver
                            `<td style="text-align: right">${event.existencias_devueltas}</td>`+//Columna 10 > cantidad devuelta
                            `<td class="invisible"></td>`+//Columna 11 > cantidad a devolver + cantidad devuelta
                            `<td style="text-align: right"></td>`+//Columna 12 > existencias compradas - (cantidad a devolver + cantidad devuelta)
                            `<td class="invisible">${event.id_sucursales}</td>`+//Columna 13 > id sucursal
                            `<td class="invisible">${sucursal_indice_dev_compras}</td>`+//Columna 14 > índice sucursal
                            `<td style="text-align: center">
                                <div class="tooltip">
                                    <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras">delete</span></a>
                                    <span class="tooltiptext">Eliminar producto</span>
                                </div>
                            </td>`+//Columna 15 >
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
    if(document.getElementById("buscador-comporbante-compras").value.startsWith("Compra") ||
    document.getElementById("buscador-comporbante-compras").value.startsWith("Recompra")){
        document.querySelector(".contenedor-devolucion-compras").classList.add("modal-show-devolucion-compras");
        await crearBodyDevoluciones();
        operarCantidaDevolucion();
        await buscarPorCodidoDevolucionesEnProductos();
        document.querySelectorAll(".id-comprobacion-devoluciones-compras").forEach((e) => {
            if(e.parentNode.children[13].textContent == document.getElementById("buscador-comporbante-compras").value){
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
function operarCantidaDevolucion(){
    const insertarDevolucion = document.querySelectorAll(".cantidadADevolver")
    insertarDevolucion.forEach((event) => {
        event.addEventListener("keyup", (e) => {
            ////saldo existencias tabla productos///////                                                            
            e.target.parentNode.parentNode.children[9].textContent = Number(e.target.parentNode.parentNode.children[8].textContent) - 
                                                                    Number(e.target.value)
            ////cantidad a devolver mas cantidad devuelta///////                                                         
            e.target.parentNode.parentNode.children[11].textContent = Number(e.target.value) + Number(e.target.parentNode.parentNode.children[10].textContent);
            ////saldo de la compra///////  
            e.target.parentNode.parentNode.children[12].textContent = Number(e.target.parentNode.parentNode.children[3].textContent) - 
                                                                    (Number(e.target.value) + Number(e.target.parentNode.parentNode.children[10].textContent));

            if(Number(e.target.parentNode.parentNode.children[11].textContent) > Number(e.target.parentNode.parentNode.children[3].textContent)){
                e.target.parentNode.parentNode.children[12].style.background = "#b36659"
                e.target.style.background = "#b36659"
            }else{
                e.target.parentNode.parentNode.children[12].style.background = ""
                e.target.style.background = ""
            };                 
        });
    });
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
        document.querySelectorAll(".id-comprobacion-devoluciones-compras").forEach((e) => {
            if(event.parentNode.children[0].textContent == e.textContent && 
            event.parentNode.children[4].children[0].value > 0){
                e.parentElement.remove()
                modal_proceso_abrir("Este producto ya se encuentra en la tabla devoluciones, se reempazará con estos datos recientes.", "")
                modal_proceso_salir_botones()
            }
        });
        if(event.parentNode.children[4].children[0].value > 0 &&
        event.parentNode.children[8].textContent > 0 &&
        event.parentNode.children[12].textContent >= 0){
            let tablaDevolucionesComprasFinal= document.querySelector("#tabla-devolucion-compras-final > tbody");
            let nuevaFilaTablaDevolucionesComprasFinal = tablaDevolucionesComprasFinal.insertRow(-1);
            let fila = `<tr>`+
                            `<td class="id-comprobacion-devoluciones-compras invisible">${event.parentNode.children[0].textContent}</td>`+// Columna 0 > id entradas
                            `<td>${event.parentNode.children[1].textContent}</td>`+// Columna 1 > sucursal
                            `<td>${event.textContent}</td>`+// Columna 2 > código
                            `<td>${event.parentNode.children[3].textContent}</td>`+// Columna 3 > existencias compradas
                            `<td>${event.parentNode.children[4].children[0].value}</td>`+// Columna 4 > cantidad a devolver
                            `<td>${event.parentNode.children[5].textContent}</td>`+// Columna 5 > comprobante de compra
                            `<td>${document.getElementById("causaDevolucionCompras").value}</td>`+// Columna 6 > causa de devolución
                            `<td class="invisible">${event.parentNode.children[7].textContent}</td>`+// Columna 7 > id producto
                            `<td class="invisible">${event.parentNode.children[8].textContent}</td>`+// Columna 8 > stock producto
                            `<td class="invisible">${event.parentNode.children[9].textContent}</td>`+// Columna 9 > stock producto - cantidad a devolver
                            `<td class="invisible">${event.parentNode.children[10].textContent}</td>`+// Columna 10 > cantidad devuelta
                            `<td>${event.parentNode.children[11].textContent}</td>`+// Columna 11 > cantidad a devolver + cantidad devuelta
                            `<td class="invisible">${event.parentNode.children[13].textContent}</td>`+// Columna 12 > id sucursal
                            `<td class="invisible">${event.parentNode.children[14].textContent}</td>`+// Columna 13 > índice sucursal
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
        if(e.value > 0 && e.parentNode.parentNode.children[12].textContent >= 0){
            e.parentNode.parentNode.remove()
        }else if(e.parentNode.parentNode.children[12].textContent < 0){
            modal_proceso_abrir("Ya no cuenta con unidades para devolver.", "")
            modal_proceso_salir_botones()
        };
    });
    if(document.querySelector("#tabla-devolucion-compras > tbody").children.length == 0){
        document.querySelector(".contenedor-devolucion-compras").classList.remove("modal-show-devolucion-compras");
    };
    document.getElementById("causaDevolucionCompras").value = ""
    document.getElementById("buscador-comporbante-compras").value = ""
    document.getElementById("buscador-comporbante-compras").focus();
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
    let suma_productos = 0;
    function DatosDeDevolucionCompras(a){
        this.idProd = a.children[7].textContent;
        this.sucursal_post = sucursales_activas[a.children[13].textContent];
        this.existencias_post = a.children[9].textContent;

        this.idEntr = a.children[0].textContent;
        this.existencias_entradas_update = a.children[3].textContent;
        this.existencias_devueltas_update = a.children[11].textContent;

        this.comprobante = "Dev-" + a.children[5].textContent;
        this.causa_devolucion = a.children[6].textContent;
        this.sucursal = a.children[12].textContent;
        this.existencias_devueltas_insert = a.children[4].textContent;
        this.fecha = generarFecha();
    };
    const numFilas = document.querySelector("#tabla-devolucion-compras-final > tbody").children
    for(let i = 0 ; i < numFilas.length; i++){
        if(numFilas[i]){
            let filaPlus = new DatosDeDevolucionCompras(numFilas[i]);
            let urlDevolucionProductosUnoC = URL_API_almacen_central + 'procesar_devolucion_compras'
            let response = await funcionFetch(urlDevolucionProductosUnoC, filaPlus)
            console.log("Respuesta Productos "+response.status)
            if(response.status === 200){
                suma_productos +=1;
                modal_proceso_abrir("Procesando la devolución de la compra!!!.", `Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
                console.log(`Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
            }
        };
    };
    if(suma_productos === numFilas.length){
        modal_proceso_abrir("Operación completada exitosamente.", "")
        modal_proceso_salir_botones()
        document.getElementById("buscador-comporbante-compras").value="";
        document.querySelector("#tabla-devolucion-compras-final > tbody").remove();
        document.querySelector("#tabla-devolucion-compras-final").createTBody();
    }else{
        modal_proceso_abrir(`Ocurrió un problema en la fila ${suma_productos + 1}`, "")
        modal_proceso_salir_botones()
    };
};

const removerTablaDevolucionesUno = document.getElementById("remover-tabla-devoluciones-compras-uno");
removerTablaDevolucionesUno.addEventListener("click", () =>{
    document.querySelector(".contenedor-devolucion-compras").classList.remove("modal-show-devolucion-compras");
    document.querySelector("#tabla-devolucion-compras > tbody").remove();
    document.querySelector("#tabla-devolucion-compras").createTBody();
    document.getElementById("buscador-comporbante-compras").focus();
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