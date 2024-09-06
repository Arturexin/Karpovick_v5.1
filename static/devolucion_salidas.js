document.addEventListener("DOMContentLoaded", inicioDevolucionSalidas)
let anio_principal = ""
function inicioDevolucionSalidas(){
    anio_principal = new Date().getFullYear()
    
    cargarDatosAnio()
    graficoDevolucionesVentas();
    btnDevolucionSalidas = 1;
};
let devolucionesComprobante = [];
let detVentasComprobante = [];
const barras_dev_salidas = [".cg_1_c", ".cg_2_c", ".cg_3_c", ".cg_4_c", ".cg_5_c"]
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        reinicioBarraGrafico(barras_dev_salidas);
        anio_principal = anio_referencia.value;

        graficoDevolucionesVentas();

        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////DEVOLUCION POR SALIDAS////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let sucursal_id_dev_salidas = 0;
let sucursal_indice_dev_salidas = 0;
function eliminarFilaCompras(){
    document.querySelectorAll(".eliminar_fila_compras").forEach((event)=>{
        event.addEventListener("click", ()=>{
            event.parentNode.parentNode.parentNode.remove()
        })
    });
};
async function crearBodyDevoluciones(){
    devolucionesComprobante = await cargarDatos(`salidas_comprobante/${document.getElementById("buscador-comporbante-salidas").value}`)
    let sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_encabezado"))
    devolucionesComprobante.forEach((event) => {
        if(event.comprobante.toLowerCase() === document.getElementById('buscador-comporbante-salidas').value.toLowerCase()){
            sucursales_comparacion.forEach((e, i) =>{
                if(event.sucursal_nombre == e.sucursal_nombre){
                    sucursal_indice_dev_salidas = i
                }
            });
            let tablaDevolucionesSalidas= document.querySelector("#tabla-devolucion-salidas > tbody");
            let nuevaFilaTablaDevolucionesSalidas = tablaDevolucionesSalidas.insertRow(-1);
            let fila = `<tr>`+
                            `<td class="invisible">${event.idSal}</td>`+//Columna 0 > id salidas
                            `<td>${event.sucursal_nombre}</td>`+//Columna 1 > sucursal
                            `<td class="codigoDevolucionesSalidas" style="background: rgb(105, 211, 35); border-radius: 5px">${event.codigo}</td>`+//Columna 2 > código
                            `<td style="text-align: right">${event.existencias_salidas}</td>`+//Columna 3 > existencias salidas
                            `<td><input class="cantidadADevolverSalidas input-tablas-dos-largo"></td>`+//Columna 4 > cantidad a devolver
                            `<td class="invisible">${event.precio_venta_salidas}</td>`+//Columna 5 > precio de venta salidas
                            `<td>${event.comprobante}</td>`+//Columna 6 > comprobante
                            `<td class="invisible">${event.cliente}</td>`+//Columna 7 > id cliente
                            `<td class="invisible"></td>`+//Columna 8 > id producto
                            `<td class="invisible"></td>`+//Columna 9 > stock producto
                            `<td class="invisible"></td>`+//Columna 10 > stock producto + cantidad a devolver
                            `<td style="text-align: right">${event.existencias_devueltas}</td>`+//Columna 11 > existencias devueltas
                            `<td class="invisible"></td>`+//Columna 12 > cantidad a devolver + existencias devueltas
                            `<td style="text-align: right"></td>`+//Columna 13 > existencias salidas - (cantidad a devolver + existencias devueltas)
                            `<td class="invisible">${event.id_sucursales}</td>`+//Columna 14 > id sucursal
                            `<td class="invisible">${sucursal_indice_dev_salidas}</td>`+//Columna 15 > índice sucursal
                            `<td style="text-align: center">
                                <div class="tooltip">
                                    <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras">delete</span></a>
                                    <span class="tooltiptext">Eliminar producto</span>
                                </div>
                            </a></td>`+
                        `</tr>`
            nuevaFilaTablaDevolucionesSalidas.innerHTML = fila;
            eliminarFilaCompras()
        };
    });
};
const mandarATablaDevolucionesSalidas = document.getElementById("mandar-tabla-devoluciones-salidas");
mandarATablaDevolucionesSalidas.addEventListener("click",manadarDevolucionesSalidas)
async function manadarDevolucionesSalidas(e){
    e.preventDefault();
    if(document.getElementById("buscador-comporbante-salidas").value.startsWith("Venta")){
        document.querySelector(".contenedor-devolucion-salidas").classList.add("modal-show-devolucion-salidas");
        await crearBodyDevoluciones();
        operarCantidaDevolucionSalidas();
        await buscarPorCodidoDevolucionesEnProductosSalidas();
        document.querySelectorAll(".id-comprobacion-devoluciones-salidas").forEach((e) => {
            if(e.parentNode.children[6].textContent == document.getElementById("buscador-comporbante-salidas").value){
                modal_proceso_abrir("Esta venta ya existe en tabla devoluciones, si continua se sobreescribirá por esta nueva.", "")
                modal_proceso_salir_botones()
                e.parentNode.style.background = "#b36659"
            }
        });
        document.querySelector("#tabla-devolucion-salidas > tbody > tr > td:nth-child(5) > input").focus()
    }else{
        modal_proceso_abrir(`Ingrese un formato válido, ejemplo: Venta-10`, "")
        modal_proceso_salir_botones()
    };
};
async function buscarPorCodidoDevolucionesEnProductosSalidas(){
    const insertarBuscarMovimientosSalidas = document.querySelectorAll(".codigoDevolucionesSalidas");
    let datoCodigoUnitario;
    for(let i = 0; i < insertarBuscarMovimientosSalidas.length; i++){
        datoCodigoUnitario = await cargarDatos(`almacen_central_codigo_sucursal/${insertarBuscarMovimientosSalidas[i].textContent}?`+
                                            `sucursal_get=${sucursales_activas[insertarBuscarMovimientosSalidas[i].parentNode.children[15].textContent]}`)
        if(datoCodigoUnitario.idProd){
            insertarBuscarMovimientosSalidas[i].parentNode.children[8].textContent = datoCodigoUnitario.idProd
            insertarBuscarMovimientosSalidas[i].parentNode.children[9].textContent = datoCodigoUnitario.sucursal_get
        }
    };
};
function operarCantidaDevolucionSalidas(){
    const insertarDevolucionSalidas = document.querySelectorAll(".cantidadADevolverSalidas")
    insertarDevolucionSalidas.forEach((event) => {
        event.addEventListener("keyup", (e) => {
            ////saldo existencias tabla productos///////                                                            
            e.target.parentNode.parentNode.children[10].textContent = Number(e.target.parentNode.parentNode.children[9].textContent) + 
                                                                    Number(e.target.value)
            ////cantidad a devolver mas cantidad devuelta///////                                                         
            e.target.parentNode.parentNode.children[12].textContent = Number(e.target.value) + Number(e.target.parentNode.parentNode.children[11].textContent);
            ////saldo de la venta///////  
            e.target.parentNode.parentNode.children[13].textContent = Number(e.target.parentNode.parentNode.children[3].textContent) - 
                                                                    (Number(e.target.value) + Number(e.target.parentNode.parentNode.children[11].textContent));

            if(Number(e.target.parentNode.parentNode.children[12].textContent) > Number(e.target.parentNode.parentNode.children[3].textContent)){
                e.target.parentNode.parentNode.children[13].style.background = "#b36659"
                e.target.style.background = "#b36659"
            }else{
                e.target.parentNode.parentNode.children[13].style.background = ""
                e.target.style.background = ""
            };
        });
    });
};
async function crearBodyDevolucionesFinal(){
    let fila_modal = document.querySelectorAll(".codigoDevolucionesSalidas")
    fila_modal.forEach((event)=>{
        document.querySelectorAll(".id-comprobacion-devoluciones-salidas").forEach((e) => {
            if(event.parentNode.children[0].textContent == e.textContent && 
            event.parentNode.children[4].children[0].value > 0){
                e.parentElement.remove()
                modal_proceso_abrir("Este producto ya se encuentra en la tabla devoluciones, se reempazará con estos datos recientes.", "")
                modal_proceso_salir_botones()
            }
        });
        if(event.parentNode.children[4].children[0].value > 0 &&
        event.parentNode.children[13].textContent >= 0){
            let tablaDevolucionesSalidas= document.querySelector("#tabla-devolucion-salidas-final > tbody");
            let nuevaFilaTablaDevolucionesSalidas = tablaDevolucionesSalidas.insertRow(-1);
            let fila = `<tr>`+
                            `<td class="id-comprobacion-devoluciones-salidas invisible">${event.parentNode.children[0].textContent}</td>`+// Columna 0 > 
                            `<td>${event.parentNode.children[1].textContent}</td>`+// Columna 0 > 
                            `<td>${event.textContent}</td>`+// Columna 0 > 
                            `<td>${event.parentNode.children[3].textContent}</td>`+// Columna 0 > 
                            `<td>${event.parentNode.children[4].children[0].value}</td>`+// Columna 0 > 
                            `<td class="invisible">${event.parentNode.children[5].textContent}</td>`+// Columna 0 > 
                            `<td>${event.parentNode.children[6].textContent}</td>`+// Columna 0 > 
                            `<td>${document.getElementById("causaDevolucionSalidas").value}</td>`+// Columna 0 > 
                            `<td class="invisible">${event.parentNode.children[7].textContent}</td>`+// Columna 0 > 
                            `<td class="invisible">${event.parentNode.children[8].textContent}</td>`+// Columna 0 > 
                            `<td class="invisible">${event.parentNode.children[9].textContent}</td>`+// Columna 0 > 
                            `<td class="invisible">${event.parentNode.children[10].textContent}</td>`+// Columna 0 > 
                            `<td class="invisible">${event.parentNode.children[11].textContent}</td>`+// Columna 0 > 
                            `<td>${event.parentNode.children[12].textContent}</td>`+// Columna 0 > 
                            `<td class="invisible">${event.parentNode.children[13].textContent}</td>`+// Columna 0 > 
                            `<td class="invisible">${event.parentNode.children[14].textContent}</td>`+// Columna 0 > 
                            `<td class="invisible">${event.parentNode.children[15].textContent}</td>`+// Columna 0 > 
                            `<td style="text-align: center">
                                <div class="tooltip">
                                    <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras">delete</span></a>
                                    <span class="tooltiptext">Eliminar producto</span>
                                </div>
                            </a></td>`+
                        `</tr>`
            nuevaFilaTablaDevolucionesSalidas.innerHTML = fila;
            eliminarFilaCompras()
        };
    });
};
const mandarATablaDevolucionSalidas = document.getElementById("procesar-devolucion-salidas");
mandarATablaDevolucionSalidas.addEventListener("click", (e)=>{
    e.preventDefault();
    crearBodyDevolucionesFinal();
    const borrar = document.querySelectorAll(".cantidadADevolverSalidas");//eliminamos las filas que si pasaron a la tabla principal
    borrar.forEach((e)=>{
        if(e.value > 0 && e.parentNode.parentNode.children[13].textContent >= 0){
            e.parentNode.parentNode.remove()
        }else if(e.parentNode.parentNode.children[13].textContent < 0){
            modal_proceso_abrir("Ya no cuenta con unidades para devolver", "")
            modal_proceso_salir_botones()
        };
    })
    if(document.querySelector("#tabla-devolucion-salidas > tbody").children.length == 0){
        document.querySelector(".contenedor-devolucion-salidas").classList.remove("modal-show-devolucion-salidas");
    };
    document.getElementById("causaDevolucionSalidas").value = ""
    document.getElementById("buscador-comporbante-salidas").value = ""
    document.getElementById("buscador-comporbante-salidas").focus();
});

const procesarDevolucionSalidas = document.getElementById("procesar-devolucion-salidas-final");
procesarDevolucionSalidas.addEventListener("click", procesamientoDevolucionSalidas)
async function procesamientoDevolucionSalidas(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla-devolucion-salidas-final > tbody").children.length > 0){
            modal_proceso_abrir("Procesando la devolución de la venta!!!.", "")
            await realizarDevolucionSalidas()
        };
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. " + error, "")
        console.error("Ocurrió un error. ", error)
        modal_proceso_salir_botones()
    };
};
async function realizarDevolucionSalidas(){
    let suma_productos = 0;
    function DatosDeDevolucionSalidas(a){
        this.idProd = a.children[9].textContent;
        this.sucursal_post = sucursales_activas[a.children[16].textContent];
        this.existencias_post = a.children[11].textContent;

        this.idSal = a.children[0].textContent;
        this.existencias_salidas_update = a.children[3].textContent;
        this.existencias_devueltas_update = a.children[13].textContent;

        this.comprobante = "Dev-" + a.children[6].textContent;
        this.causa_devolucion = a.children[7].textContent;
        this.precio_venta_salidas = a.children[5].textContent;
        this.sucursal = a.children[15].textContent;
        this.existencias_devueltas_insert = a.children[4].textContent;
        this.fecha = generarFecha();
    }
    const numFilas = document.querySelector("#tabla-devolucion-salidas-final > tbody").children
    for(let i = 0 ; i < numFilas.length; i++){
        if(numFilas[i]){
            let filaPlus = new DatosDeDevolucionSalidas(numFilas[i]);
            let urlDevolucionProductos = URL_API_almacen_central + 'procesar_devolucion_salidas'
            let response = await funcionFetch(urlDevolucionProductos, filaPlus)
            console.log("Respuesta Productos "+response.status)
            if(response.status === 200){
                suma_productos +=1;
                modal_proceso_abrir("Procesando la devolución de la venta!!!.", `Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
                console.log(`Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
            }
        };
    };
    if(suma_productos === numFilas.length){
        await obteniendoDatosDeVenta();
    }else{
        modal_proceso_abrir(`Ocurrió un problema en la fila ${suma_productos + 1}`, "")
        modal_proceso_salir_botones()
    };
};
async function obteniendoDatosDeVenta(){
    let suma_DV = 0;
    let totalSumaVenta = 0;
    let arrayIdVentas = [];
    let arrayComprobanteVenta = [];
    let arraySumaVentas = [];
    document.querySelectorAll(".id-comprobacion-devoluciones-salidas").forEach((event) => {
        arrayComprobanteVenta.push(event.parentNode.children[6].textContent)
    });
    let nuevoArrayComprobanteVenta = arrayComprobanteVenta.reduce((a, e) => {
        if(!a.find(d => d == e)){
            a.push(e)
        }
        return a;
    }, []);
    for(let i = 0; i < nuevoArrayComprobanteVenta.length; ++i){
        detVentasComprobante = await cargarDatos(`ventas_comprobante/${nuevoArrayComprobanteVenta[i]}`)
        arraySumaVentas.push(0)
        arrayIdVentas.push(0)
        document.querySelectorAll(".id-comprobacion-devoluciones-salidas").forEach((event) => {
            if(event.parentNode.children[6].textContent === nuevoArrayComprobanteVenta[i]){
                totalSumaVenta += Number(event.parentNode.children[5].textContent) * 
                                (Number(event.parentNode.children[4].textContent))
            };
            arraySumaVentas[i] = totalSumaVenta
        });
        totalSumaVenta = 0;
        let metodoPago = {
            "id_det_ventas": detVentasComprobante[0].id_det_ventas,
            "modo_efectivo": detVentasComprobante[0].modo_efectivo,
            "modo_credito": detVentasComprobante[0].modo_credito,
            "modo_tarjeta": detVentasComprobante[0].modo_tarjeta,
            "modo_perdida": Number(arraySumaVentas[i]) + Number(detVentasComprobante[0].modo_perdida),
            "total_venta": (Number(detVentasComprobante[0].modo_efectivo) + Number(detVentasComprobante[0].modo_credito) + Number(detVentasComprobante[0].modo_tarjeta)) - 
                            (Number(arraySumaVentas[i]) + Number(detVentasComprobante[0].modo_perdida))
        };
        let urlMetodoDePago = URL_API_almacen_central + 'ventas'
        let response = await funcionFetch(urlMetodoDePago, metodoPago);
        console.log("Respuesta detalle de venta "+response.status)
        if(response.status === 200){
            suma_DV +=1;
            modal_proceso_abrir("Procesando la devolución de la venta!!!.", `Detalle de venta: ${suma_DV} de ${nuevoArrayComprobanteVenta.length}`)
            console.log(`Detalle de venta: ${suma_DV} de ${nuevoArrayComprobanteVenta.length}`)
        }
    };
    if(suma_DV === nuevoArrayComprobanteVenta.length){
        await funcionGastosVarios();
    }else{
        modal_proceso_abrir(`Ocurrió un problema en la fila ${suma_DV + 1}`, "")
        modal_proceso_salir_botones()
    };
};
async function funcionGastosVarios(){
    let suma_gastos = 0;
    function DataGastosVarios(a){
        this.sucursal_gastos = a.children[15].textContent;
        this.concepto = "Devolución";
        this.comprobante = a.children[6].textContent;
        this.monto = Number(a.children[5].textContent) * Number(a.children[4].textContent); 
        this.caja_bancos = 0;
        this.credito_gastos = 0;
        this.fecha_gastos = generarFecha();
    };
    let numFilas = document.querySelector("#tabla-devolucion-salidas-final > tbody").children;
    for(let i = 0 ; i < numFilas.length; i++){
        if(numFilas[i]){
            let dataGastos = new DataGastosVarios(numFilas[i]);
            let urlGastosVarios = URL_API_almacen_central + 'gastos_varios'
            let response = await funcionFetch(urlGastosVarios, dataGastos)
            console.log("Respuesta gastos "+response.status)
            if(response.status === 200){
                suma_gastos +=1;
                modal_proceso_abrir("Procesando la devolución de la venta!!!.", `Gastos varios: ${suma_gastos} de ${numFilas.length}`)
                console.log(`Gastos varios: ${suma_gastos} de ${numFilas.length}`)
            }
        };
    };
    if(suma_gastos === numFilas.length){
        modal_proceso_abrir("Operación completada exitosamente.", "")
        modal_proceso_salir_botones()
        document.querySelector("#tabla-devolucion-salidas-final > tbody").remove();
        document.querySelector("#tabla-devolucion-salidas-final").createTBody();
    }else{
        modal_proceso_abrir(`Ocurrió un problema en la fila ${suma_gastos + 1}`, "")
        modal_proceso_salir_botones()
    };
};

const removerTablaTransferenciasDevolucionesUno = document.getElementById("remover-tabla-transferencias-devoluciones-uno");
removerTablaTransferenciasDevolucionesUno.addEventListener("click", () =>{
    document.querySelector(".contenedor-devolucion-salidas").classList.remove("modal-show-devolucion-salidas");
    document.querySelector("#tabla-devolucion-salidas > tbody").remove();
    document.querySelector("#tabla-devolucion-salidas").createTBody();
    document.getElementById("buscador-comporbante-salidas").focus();
});
const removerTablaTransferenciasDevolucionesDos = document.getElementById("remover-tabla-transferencias-devoluciones-dos");
removerTablaTransferenciasDevolucionesDos.addEventListener("click", () =>{
    document.querySelector("#tabla-devolucion-salidas-final > tbody").remove();
    document.querySelector("#tabla-devolucion-salidas-final").createTBody();
});

async function graficoDevolucionesVentas(){
    devolucionesSalidas = await cargarDatos('salidas_suma_devoluciones_mes?'+
                                            `year_actual=${anio_principal}`)
    let arrayDevolucionSalidas = [];
    let masAlto = 0;
    document.querySelectorAll(".f_l_g").forEach((event, i)=>{
        event.textContent = `${meses_letras[i]}${anio_principal % 100}`;
    });
    for(let i = 0; i < 12; i++){
        arrayDevolucionSalidas.push(0);
        devolucionesSalidas.forEach((event)=>{
            if(event.mes == i + 1){
                arrayDevolucionSalidas[i] = -event.suma_devoluciones_salidas;
            }
            if(masAlto < -event.suma_devoluciones_salidas){masAlto = -event.suma_devoluciones_salidas}
        });
    };
    let masAltoDos = (226 * masAlto)/214;
    document.querySelectorAll(".eje_y_numeracion").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos -= 0.20 * ((226 * masAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_1_c"), arrayDevolucionSalidas, masAlto, colorFondoBarra[0], document.querySelectorAll(".sg_1_c"), 8, moneda())
};