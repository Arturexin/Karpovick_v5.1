document.addEventListener("DOMContentLoaded", inicioGastosVarios)
let anio_principal = ""
function inicioGastosVarios(){
    anio_principal = new Date().getFullYear()
    inicioTablasGastos()
    btnVentas = 1;
    cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))
    cargarDatosAnio()
    graficoBarras(anio_principal)
    /* graficoDonas(anio_principal) */
};
const barras_sucursales = [".cg_1_c_s", ".cg_2_c_s", ".cg_3_c_s", ".cg_4_c_s", ".cg_5_c_s"]
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        reinicioBarraGrafico(barras_sucursales);//Reinicia gráfico Ventas Mensuales sucursales
        anio_principal = anio_referencia.value;

        graficoBarras(anio_principal)
        /* graficoDonas(anio_principal) */
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
let inicio = 0;
let fin = 0;
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
    document.getElementById("filtro-tabla-gastosVarios-fecha-inicio").value = ""
    document.getElementById("filtro-tabla-gastosVarios-fecha-fin").value = ""
    document.getElementById("filtro-tabla-gastosVarios-sucursal").value = ""
};
function manejoDeFechas(){
    inicio = document.getElementById("filtro-tabla-gastosVarios-fecha-inicio").value;
    fin = document.getElementById("filtro-tabla-gastosVarios-fecha-fin").value;
    if(inicio == "" && fin == ""){
        inicio = '2000-01-01';
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
    }else if(inicio == "" && fin != ""){
        inicio = '2000-01-01';
    }else if(inicio != "" && fin == ""){
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
    };
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
async function graficoBarras(anio){
    document.getElementById("contenedor_gastos_mensuales_sucursal").innerHTML = `<canvas id="gastos_mensuales_sucursal" class="gradico_anual"></canvas>`
    gastos_grafico_sucursales = await cargarDatos(`gastos_suma_mes_sucursal?`+
                                                `year_actual=${anio}`)
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
function graficarDona(id,clase_valor_margen, clase_porcentaje_margen, numerador, denominador, valor_margen, porcentaje_margen, color_uno, color_dos) {
    
    let circulo = document.getElementById(id);
    circulo.style.background = `conic-gradient(#fff0 0deg, #fff0 0deg)`;//reiniciamos colores de la dona
    circulo.style.background = `conic-gradient(${color_uno} ${((numerador/denominador)) * 360}deg, ${color_dos} ${((numerador/denominador)) * 360}deg)`;//asiganamos valores a la dona
    document.querySelector(clase_valor_margen).textContent = `${moneda()} ${(valor_margen).toFixed(2)}`
    document.querySelector(clase_porcentaje_margen).textContent = porcentaje_margen + "%"
}
async function graficoDonas(anio){
    gastos_grafico_detallado = await cargarDatos(`gastos_suma_mes?`+
                                                `year_actual=${anio}`)
    let _nomina = 0;
    let _seguridad_social = 0;
    let _proveedores = 0;
    let _impuestos = 0;
    let _servicios = 0;
    let _alquiler = 0;
    let _mantenimientos = 0;
    let _publicidad = 0;
    let _pago_prestamos = 0;
    let _depositos = 0;
    let _otros = 0;

    gastos_grafico_detallado.forEach((event)=>{
        _nomina += event._nomina;
        _seguridad_social += event._seguridad_social;
        _proveedores += event._proveedores;
        _impuestos += event._impuestos;
        _servicios += event._servicios;
        _alquiler += event._alquiler;
        _mantenimientos += event._mantenimientos;
        _publicidad += event._publicidad;
        _pago_prestamos += event._pago_prestamos;
        _depositos += event._depositos;
        _otros += event._otros;
    })
    total = _nomina + 
            _seguridad_social + 
            _proveedores + 
            _impuestos + 
            _servicios + 
            _alquiler + 
            _mantenimientos + 
            _publicidad + 
            _pago_prestamos + 
            _depositos + 
            _otros 
    console.log(_depositos)
    graficoDonaDos(document.getElementById("circulo_total_deposito"), ['Depósito', 'Total'], [_depositos, total], colores_uno, colores_dos, true)
    graficoDonaDos(document.getElementById("circulo_total_personal"), ['Personal', 'Total'], [_nomina, total], colores_uno, colores_dos, true)
    graficoDonaDos(document.getElementById("circulo_total_alquiler"), ['Alquiler', 'Total'], [_alquiler, total], colores_uno, colores_dos, true)
    graficoDonaDos(document.getElementById("circulo_total_servicios"), ['Servicios', 'Total'], [_servicios, total], colores_uno, colores_dos, true)
    graficoDonaDos(document.getElementById("circulo_total_insumos"), ['Insumos', 'Total'], [_proveedores, total], colores_uno, colores_dos, true)

    graficoDonaDos(document.getElementById("circulo_total_seguridad_social"), ['Seg. Social', 'Total'], [_seguridad_social, total], colores_uno, colores_dos, true)
    graficoDonaDos(document.getElementById("circulo_total_impuestos"), ['Impuestos', 'Total'], [_impuestos, total], colores_uno, colores_dos, true)
    graficoDonaDos(document.getElementById("circulo_total_mantenimiento"), ['Mantenimiento', 'Total'], [_mantenimientos, total], colores_uno, colores_dos, true)
    graficoDonaDos(document.getElementById("circulo_total_publicidad"), ['Publicidad', 'Total'], [_publicidad, total], colores_uno, colores_dos, true)
    graficoDonaDos(document.getElementById("circulo_total_prestamos"), ['Préstamos', 'Total'], [_pago_prestamos, total], colores_uno, colores_dos, true)
    graficoDonaDos(document.getElementById("circulo_total_otros"), ['Otros', 'Total'], [_otros, total], colores_uno, colores_dos, true)
};
////////////////////////////////////////////////////////////////////////////////////////////////////////

