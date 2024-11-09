document.addEventListener("DOMContentLoaded", inicioGastosVarios)
let anio_principal = ""
function inicioGastosVarios(){
    anio_principal = new Date().getFullYear()
    inicioTablasGastos()
    array_btn_pages[1] = 1;
    cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))
    cargarDatosAnio()
    graficoBarras([])
    
};
const barras_sucursales = [".cg_1_c_s", ".cg_2_c_s", ".cg_3_c_s", ".cg_4_c_s", ".cg_5_c_s"]
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        anio_principal = anio_referencia.value;

        graficoBarras([])
        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};
///////////////////////////////////////////////
let sucursal_id_dastos = 0;
const btnCaja = document.getElementById("apertura-caja");
btnCaja.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/apertura_caja";
});
const btnEntradas = document.getElementById("entradas-caja");
btnEntradas.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/ventas";
});
const btnSalidas = document.getElementById("salidas-caja");
btnSalidas.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/salidas_caja";
    document.getElementById("salidas-caja").classList.add("marcaBoton")
});

let filas_total_bd = {value: 0};
let indice_tabla = {value : 1};
let num_filas_tabla = {value: 0};

let base_datos = {array: []}
async function inicioTablasGastos(){
    await conteoFilas(subRutaA(0), filas_total_bd, indice_tabla, 
                    document.getElementById("numeracionTablaGastosVarios"), 20)
    await searchDatos(subRutaB(document.getElementById("numeracionTablaGastosVarios").value - 1, 0), 
                    base_datos,"#tabla-gastos-varios")
    avanzarTabla(document.getElementById("avanzarGastosVarios"), 
                document.getElementById("retrocederGastosVarios"), 
                document.getElementById("numeracionTablaGastosVarios"), 
                num_filas_tabla, indice_tabla, 
                filas_total_bd, 20, 
                base_datos,"#tabla-gastos-varios")
    atajoTabla(document.getElementById("numeracionTablaGastosVarios"), 20, base_datos, 
                "#tabla-gastos-varios", indice_tabla, num_filas_tabla)
    filtro(document.getElementById("buscarFiltrosGastosVarios"), 
            indice_tabla, num_filas_tabla, filas_total_bd, 
            document.getElementById("numeracionTablaGastosVarios"), 20, 
            base_datos, "#tabla-gastos-varios")
    restablecerTabla(document.getElementById("restablecerGastosVarios"), 
                    indice_tabla, num_filas_tabla, filas_total_bd, 
                    document.getElementById("numeracionTablaGastosVarios"), 20, base_datos, "#tabla-gastos-varios")
};
function subRutaA(index){
    let fecha_inicio = ['2000-01-01', inicio]
    let fecha_fin = [new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(), fin]  
    return  `gastos_varios_conteo?`+
            `sucursal_gastos_varios=${document.getElementById("filtro-tabla-gastosVarios-sucursal").value}&`+
            `concepto_gastos_varios=${document.getElementById("filtro-tabla-gastosVarios-concepto").value}&`+
            `comprobante_gastos_varios=${document.getElementById("filtro-tabla-gastosVarios-comprobante").value}&`+
            `usuario_gastos_varios=${document.getElementById("filtro-tabla-gastosVarios-usuario").value}&`+
            `fecha_inicio_gastos_varios=${fecha_inicio[index]}&`+
            `fecha_fin_gastos_varios=${fecha_fin[index]}`
};
function subRutaB(num, index){
    let fecha_inicio = ['2000-01-01', inicio]
    let fecha_fin = [new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(), fin]  
    return  `gastos_varios_tabla/${num}?`+
            `sucursal_gastos_varios=${document.getElementById("filtro-tabla-gastosVarios-sucursal").value}&`+
            `concepto_gastos_varios=${document.getElementById("filtro-tabla-gastosVarios-concepto").value}&`+
            `comprobante_gastos_varios=${document.getElementById("filtro-tabla-gastosVarios-comprobante").value}&`+
            `usuario_gastos_varios=${document.getElementById("filtro-tabla-gastosVarios-usuario").value}&`+
            `fecha_inicio_gastos_varios=${fecha_inicio[index]}&`+
            `fecha_fin_gastos_varios=${fecha_fin[index]}`
};
function cuerpoFilaTabla(e){
    return  `<tr class="fila-gastos-varios">
                <td class="invisible">${e.id_gastos}</td>
                <td style="border-left: 7px solid ${CS(e.sucursal_nombre)};">${e.sucursal_nombre}</td>
                <td>${e.concepto}</td>
                <td>${e.comprobante}</td>
                <td style="text-align: right">${e.monto.toFixed(2)}</td>
                <td style="text-align: right">${e.caja_bancos.toFixed(2)}</td>
                <td style="text-align: right">${e.credito_gastos.toFixed(2)}</td>
                <td style="text-align: right">${(e.monto + e.caja_bancos).toFixed(2)}</td>
                <td>${e.nombres}</td>
                <td style="text-align: center">${e.fecha_gastos}</td>
            </tr>`
};
function vaciadoInputBusqueda(){
    document.getElementById("filtro-tabla-gastosVarios-concepto").value = ""
    document.getElementById("filtro-tabla-gastosVarios-comprobante").value = ""
    document.getElementById("filtro-tabla-gastosVarios-usuario").value = ""
    document.getElementById("_fecha_inicio_").value = ""
    document.getElementById("_fecha_fin_").value = ""
    document.getElementById("filtro-tabla-gastosVarios-sucursal").value = ""
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const procesarGastos = document.getElementById("procesar-gastos");
procesarGastos.addEventListener("click", async (e) => {
    e.preventDefault();
    let id_sucursal = document.getElementById("fffff-sucursal").value;//guardamos la sucursal 
    manejoDeFechas()
    function Data() {
        this.sucursal_gastos = document.getElementById("fffff-sucursal").value;
        this.concepto = document.getElementById("concepto-gastos").value;
        this.comprobante = document.getElementById("comprobante-gastos").value;
        this.fecha_gastos = generarFecha();
        let modos_ = ["monto", "caja_bancos", "credito_gastos"]
        for(let i = 0; i < modos_.length; i++){
            this[modos_[i]] =   document.getElementById("metodo_pago").value == i + 1 ? 
                                document.getElementById("monto-gastos").value : 0;
        }
    };
    if(Number(document.getElementById("concepto-gastos").value) > 0 &&
    Number(document.getElementById("metodo_pago").value) > 0 &&
    Number(document.getElementById("monto-gastos").value) > 0 || !isNaN(Number(document.getElementById("monto-gastos").value)) &&
    document.getElementById("comprobante-gastos").value !== ""){
        modal_proceso_abrir("Procesando.", "")
        let _data = new Data()

        let urlComprobante = URL_API_almacen_central + 'gastos_varios'
        let response = await funcionFetch(urlComprobante, _data)
        if(response.ok){
            document.getElementById("formulario-gastos-varios").reset()
            document.getElementById("fffff-sucursal").value = id_sucursal
            document.getElementById("concepto-gastos").style.background = ""
            document.getElementById("comprobante-gastos").style.background = ""
            document.getElementById("monto-gastos").style.background = ""
            await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                                document.getElementById("numeracionTablaGastosVarios"), 20)
            await searchDatos(subRutaB((document.getElementById("numeracionTablaGastosVarios").value - 1) * 20, 1), 
                                base_datos,"#tabla-gastos-varios")
            modal_proceso_abrir("Transacción procesada.", "")
            modal_proceso_salir_botones()
        }
        if(document.querySelector("#tabla-gastos-varios > tbody").children.length === 0){
            location.reload();
        };
    }else if(document.getElementById("concepto-gastos").value == ""){
        modal_proceso_abrir("Ingrese algun concepto de gasto.", "")
        modal_proceso_salir_botones()
        document.getElementById("concepto-gastos").style.background = "#b36659"
    }else if(document.getElementById("monto-gastos").value <= 0){
        modal_proceso_abrir("Ingrese un monto mayor a cero.", "")
        modal_proceso_salir_botones()
        document.getElementById("monto-gastos").style.background = "#b36659"
    }else if(expregul.descripcion.test(document.getElementById("concepto-gastos").value) == false){
        document.getElementById("concepto-gastos").style.background = "#b36659"
    }else if(expregul.descripcion.test(document.getElementById("comprobante-gastos").value) == false){
        document.getElementById("comprobante-gastos").style.background = "#b36659"
    }else if(expregul.direccion.test(document.getElementById("monto-gastos").value) == false){
        modal_proceso_abrir("Ingrese datos numéricos.", "")
        modal_proceso_salir_botones()
        document.getElementById("monto-gastos").style.background = "#b36659"
    };
});

///////////////////////////////////////////////////////////////////////////////////////////
async function graficoBarras(gastos_grafico_sucursales){
    document.getElementById("contenedor_gastos_mensuales_sucursal").innerHTML = `<canvas id="gastos_mensuales_sucursal" class="gradico_anual"></canvas>`

    let arrayAC = [];
    let arraySU = [];
    let arraySD = [];
    let arrayST = [];
    let arraySC = [];
    for(let j = 0; j < 12; j++){
        arrayAC.push(0)
        arraySU.push(0)
        arraySD.push(0)
        arrayST.push(0)
        gastos_grafico_sucursales.forEach((event)=>{
            if(event.mes == j + 1){
                arrayAC[j] = event.ac;
                arraySU[j] = event.su;
                arraySD[j] = event.sd;
                arrayST[j] = event.st;
            };
        });
    };
    graficoLineasVertical(document.getElementById("gastos_mensuales_sucursal"), arrayAC, arraySU, arraySD, arrayST, arraySC, mes_anio, suc_add);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////
document.querySelectorAll(".concep_").forEach((event)=>{
    event.addEventListener("click", async ()=>{
        modal_proceso_abrir("Buscando resultados...", "", "")
        if(event.value !== "total_pagos"){
            gastos_grafico_sucursales = await cargarDatos(`gastos_suma_mes_concepto?`+
                                                            `concepto=${event.value}&`+
                                                            `year_actual=${anio_principal}`)
                                                            await delay(500)
            graficoBarras(gastos_grafico_sucursales)
            modal_proceso_cerrar()
        }else{
            gastos_grafico_sucursales = await cargarDatos(`gastos_suma_mes_sucursal?`+
                                                            `year_actual=${anio_principal}`)
                                                            await delay(500)
            graficoBarras(gastos_grafico_sucursales)
            modal_proceso_cerrar()
        }
    
    })

})