document.addEventListener("DOMContentLoaded", inicioDevolucionCompras)
let anio_principal = ""
function inicioDevolucionCompras(){
    anio_principal = new Date().getFullYear()

    cargarDatosAnio()
    graficoDevolucionesCompras();
    btnDevolucionCompras = 1;
};
let array_comprobante= [];
let operacion_n = '';
let indice_causa = 0;
const barras_dev_compras = [".cg_1_c", ".cg_2_c", ".cg_3_c", ".cg_4_c", ".cg_5_c"]
const op_ = ["", "Venta", "Compra", "Recompra"]
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
class obj_dev{
    constructor(codigo, comprobante, descripcion, existencias, existencias_devueltas, id, id_prod, id_sucursales, sucursal_nombre, precio_venta_salidas, cliente, causa, c_d ){
            this.codigo = codigo;
            this.comprobante = comprobante;
            this.descripcion = descripcion;
            this.existencias = existencias;
            this.existencias_devueltas = existencias_devueltas;
            this.id = id;
            this.id_prod = id_prod;
            this.id_sucursales = id_sucursales;
            this.sucursal_nombre = sucursal_nombre;
            this.precio_venta_salidas = precio_venta_salidas;
            this.cliente = cliente;
            this.causa = causa;
            this.c_d = c_d;
    }
    in_q(input){
        if(Number(input.value) < 0 || isNaN(Number(input.value))){
            input.style.background = "var(--fondo-marca-uno)";
        }else{
            this.c_d = Number(input.value);
            input.style.background = "";
        };
    };
}
function ingresar(e){
    let coin_ = array_comprobante.find(x=> x.id === e.id)
    if(coin_ === undefined){
        array_comprobante.push(new obj_dev( e.codigo, 
                                            e.comprobante, 
                                            e.descripcion, 
                                            e.existencias, 
                                            e.existencias_devueltas, 
                                            e.id, 
                                            e.id_prod, 
                                            e.id_sucursales, 
                                            e.sucursal_nombre, 
                                            e.precio_venta_salidas,
                                            e.cliente
        ));
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function crearBodyDevoluciones(){

}
async function crearBodyDevoluciones(){
    let response = [];
    let operacion = `${document.getElementById("t_op").textContent}-${document.getElementById("buscador_operacion").value}`
    if(Number(document.getElementById("tipo_devolucion").value) > 1 && (operacion_n === "" || operacion_n === operacion)){
        response = await cargarDatos(`entradas_comprobante/${operacion}`)
        if(response.length > 0){
            response.forEach((e)=>{
                ingresar(e)
            })
            operacion_n = operacion;
        };
    }else if(Number(document.getElementById("tipo_devolucion").value) > 0 && (operacion_n === "" || operacion_n === operacion)){
        response = await cargarDatos(`salidas_comprobante/${operacion}`)
        if(response.length > 0){
            response.forEach((e)=>{
                ingresar(e)
            })
            operacion_n = operacion;
        };
    }else if(Number(document.getElementById("tipo_devolucion").value) === 0){
        modal_proceso_abrir("Seleciones un tipo de operación", "")
        modal_proceso_salir_botones()
    }else if(operacion_n !== operacion){
        modal_proceso_abrir("Solo puede procesar una operación por vez", "")
        modal_proceso_salir_botones()
    };
    let array_id_a_s = [];
    let tabla= document.querySelector("#tabla_modal > tbody");
    let ids = Array.from(document.querySelectorAll(".id_proforma")).map(element => element.textContent);

    response.forEach((event) => {
        let base = ids.find(x=> Number(x) === event.id)
        if(base !== undefined){
            array_id_a_s.push(`${event.comprobante}, ${event.codigo} en ${event.sucursal_nombre}`);
        }else{
            let nueva_fila = tabla.insertRow(-1);
            let fila = `<tr>`+
                `<td class="id_modal invisible">${event.id}</td>`+//Columna 0 > id entradas
                `<td>${event.sucursal_nombre}</td>`+//Columna 1 > sucursal
                `<td class="codigoDevoluciones" style="background: rgb(105, 211, 35); border-radius: 5px">${event.codigo}</td>`+//Columna 2 >código
                `<td style="text-align: right">${event.existencias}</td>`+//Columna 3 > existencias compradas
                `<td><input class="cantidadADevolver input-tablas-dos-largo" onkeyup = "operarQDevolucion(this)"></td>`+//Columna 4 > cantidad a devolver
                `<td>${event.comprobante}</td>`+//Columna 5 > comprobante de compra
                `<td class="invisible">${event.id_prod}</td>`+//Columna 6 > id producto
                `<td style="text-align: right">${event.existencias_devueltas}</td>`+//Columna 7 > cantidad devuelta
                `<td style="text-align: right"></td>`+//Columna 8 > existencias compradas - (cantidad a devolver + cantidad devuelta)
                `<td style="text-align: center">
                                <div class="tooltip">
                                <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras" onClick="clicKEliminarFila(this)">delete</span></a>
                                <span class="tooltiptext">Eliminar producto</span>
                                </div>
                                </td>`+//Columna 11 >
                        `</tr>`
            nueva_fila.innerHTML = fila;
        }
    });
    if(array_id_a_s.length > 0){
        let cabecera =  `<ul>Las operaciones: `
        for(let event of array_id_a_s){
            cabecera += `<li class="diseno_li">${event},</li>`;
        }
        cabecera +=`</ul> Ya se encuentran en la lista de devoluciones.`;
        modal_proceso_abrir("", "", cabecera)
        modal_proceso_salir_botones()
    };
};
function clicKEliminarFila(e) {
    const fila = e.closest("tr");
    array_comprobante.forEach((e, i)=>{//Buscamos una coincidencia de código
        e.id === Number(fila.children[0].textContent) ? array_comprobante.splice(i, 1): "";//elimina el objeto con el índice i
    });
    fila.remove();
};
const mandarATablaDevoluciones = document.getElementById("mandar-tabla-devoluciones");
mandarATablaDevoluciones.addEventListener("click",manadarDevoluciones)
async function manadarDevoluciones(e){
    e.preventDefault();
    if(Number(document.getElementById("buscador_operacion").value) > 0){
        document.querySelector(".contenedor-devolucion-compras").classList.add("modal-show-devolucion-compras");

        await crearBodyDevoluciones();

        document.querySelector("#tabla_modal > tbody > tr:nth-child(1) > td:nth-child(5) > input").focus()
    }else{
        modal_proceso_abrir(`Digite un número de operación`, "")
        modal_proceso_salir_botones()
    };
};
function operarQDevolucion(e){
    let row_ = e.closest("tr");
    let fila = array_comprobante.find(x=> x.id === Number(row_.children[0].textContent));
    fila.in_q(e)
    row_.children[8].textContent = Number(row_.children[3].textContent) - 
                                    (Number(row_.children[4].children[0].value) + Number(row_.children[7].textContent));
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function crearBodyDevolucionesFinal(){
    const fila_principal = document.querySelector("#tabla_principal > tbody");
    let idd = document.querySelectorAll(".id_proforma");
    let id_prof = Array.from(idd).map(x => Number(x.textContent));
    const id_remove = document.querySelectorAll(".id_modal");
    array_comprobante.forEach((obj_dev)=>{
        let coincidencia_id = id_prof.find(x=> x === obj_dev.id)
        if(coincidencia_id === undefined){
            
            if(obj_dev.c_d > 0){
                let nueva_fila = fila_principal.insertRow(-1);
                let fila = `<tr>`+
                                `<td class="id_proforma invisible">${obj_dev.id}</td>`+// Columna 0 > id entradas
                                `<td>${obj_dev.sucursal_nombre}</td>`+// Columna 1 > sucursal
                                `<td>${obj_dev.codigo}</td>`+// Columna 2 > código
                                `<td>${obj_dev.descripcion}</td>`+// Columna 2 > código
                                `<td>${obj_dev.existencias}</td>`+// Columna 3 > existencias compradas
                                `<td>${obj_dev.c_d}</td>`+// Columna 4 > cantidad a devolver
                                `<td class="comp_p">${obj_dev.comprobante}</td>`+// Columna 5 > comprobante de compra
                                `<td>${document.getElementById("causa_devolucion")[indice_causa].textContent}</td>`+// Columna 6 > causa
                                `<td style="text-align: center">
                                    <div class="tooltip">
                                        <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras" onClick="clicKEliminarFila(this)">delete</span></a>
                                        <span class="tooltiptext">Eliminar producto</span>
                                    </div>
                                </td>`+// Columna 14 > 
                            `</tr>`
                nueva_fila.innerHTML = fila;
                id_remove.forEach((e)=>{//Eliminamos la fila en tabla modal

                    Number(e.textContent) === obj_dev.id ? e.parentNode.remove(): "";
                })
            }
        }
    });
};

const mandarATablaDevolucion = document.getElementById("procesar-devolucion-compras");
mandarATablaDevolucion.addEventListener("click", (e)=>{
    e.preventDefault();

    crearBodyDevolucionesFinal();

    if(document.querySelector("#tabla_modal > tbody").children.length == 0){
        document.querySelector(".contenedor-devolucion-compras").classList.remove("modal-show-devolucion-compras");
    };
    indice_causa = 0;
    document.getElementById("causa_devolucion").value = 0
    document.getElementById("buscador_operacion").value = ""
    document.getElementById("buscador_operacion").focus();
});
const procesarDevolucionCompras = document.getElementById("procesar-devolucion-compras-final");
procesarDevolucionCompras.addEventListener("click", procesamientoDevolucionCompras)
async function procesamientoDevolucionCompras(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla_principal > tbody").children.length > 0){
            modal_proceso_abrir("Procesando la devolución de la compra!!!.", "")

            await realizarDevolucionCompras()

            document.querySelector("#tabla_principal > tbody").remove();
            document.querySelector("#tabla_principal").createTBody();
            array_comprobante = [];
            operacion_n = "";
        }
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. " + error, "")
        console.error("Ocurrió un error. ", error)
        modal_proceso_salir_botones()
    };
};
async function realizarDevolucionCompras(){
    let array_devolucion = [];

    function DatosDeDevolucion(a, idx){
        this.idProd = a.id_prod;
        this.sucursal_post = sucursales_activas[idx];
        this.existencias_post = a.c_d;

        this.id_op = a.id;

        this.comprobante = "Dev-" + a.comprobante;
        this.causa_devolucion = a.causa;
        this.sucursal = a.id_sucursales;

        this.precio_venta_salidas = a.precio_venta_salidas;
        this.cliente = a.cliente;
    };
    let suma_monto_dev = 0;
    array_comprobante.forEach((event)=>{
        let idx = 0;
        suc_add.forEach((e, i)=>{
            if(e === event.sucursal_nombre){
                idx = i;
            };
        });
        array_devolucion.push(new DatosDeDevolucion(event, idx))
        if(event.comprobante.startsWith('Venta')){
            suma_monto_dev += event.precio_venta_salidas * event.c_d
        }
    });
    let url = "";
    let det_venta = ""
    if(Number(document.getElementById("tipo_devolucion").value) > 1){
        url = URL_API_almacen_central + 'procesar_devolucion_compras'
    }else if(Number(document.getElementById("tipo_devolucion").value) > 0){
        url = URL_API_almacen_central + 'procesar_devolucion_salidas'
        det_venta = await cargarDatos(`ventas_comprobante/${operacion_n}`)
    }

    function DataDevoluciones(){
        this.array_devolucion = array_devolucion;
        this.id_det_ventas = det_venta[0].id_det_ventas;
        this.modo_perdida = Number(suma_monto_dev);
        this.fecha = generarFecha();
    }
    let fila = new DataDevoluciones()

    let response = await funcionFetchDos(url, fila)
    if(response.status === "success"){
        modal_proceso_abrir(`${response.message}`)
        modal_proceso_salir_botones()
    };
};

const removerTablaDevolucionesUno = document.getElementById("remover-tabla-devoluciones-compras-uno");
removerTablaDevolucionesUno.addEventListener("click", () =>{
    removerListaModal()
    document.querySelector(".contenedor-devolucion-compras").classList.remove("modal-show-devolucion-compras");
    document.querySelector("#tabla_modal > tbody").remove();
    document.querySelector("#tabla_modal").createTBody();
    document.getElementById("buscador_operacion").focus();
});
function removerListaModal(){// Elimina los elementos del array_saldos que coincidan con los elementos de la tabla modal
    let filas = document.querySelectorAll(".id_modal")
    filas.forEach((e) =>{
        array_comprobante.forEach((event, i)=>{
            event.id === Number(e.textContent) ? array_comprobante.splice(i, 1): "";
        })
    })
}
const removerTablaDevolucionesDos = document.getElementById("remover-tabla-devoluciones-compras-dos");
removerTablaDevolucionesDos.addEventListener("click", () =>{
    document.querySelector("#tabla_principal > tbody").remove();
    document.querySelector("#tabla_principal").createTBody();
    array_comprobante = [];
    operacion_n = "";
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

document.getElementById("tipo_devolucion").addEventListener("change",()=>{
    document.getElementById("t_op").textContent = op_[document.getElementById("tipo_devolucion").value]
    document.getElementById("buscador_operacion").focus();
    if(document.querySelector("#tabla_principal > tbody").children.length > 0){
        document.querySelector("#tabla_principal > tbody").remove();
        document.querySelector("#tabla_principal").createTBody();
        array_comprobante = [];
        operacion_n = "";
    };
});
document.getElementById("causa_devolucion").addEventListener("change",()=>{
    indice_causa = document.getElementById("causa_devolucion").selectedIndex
    document.querySelectorAll(".id_modal").forEach((e)=>{
        let fila = array_comprobante.find(x => x.id === Number(e.textContent));
        fila ? fila.causa = document.getElementById("causa_devolucion").value : "";
    });
});