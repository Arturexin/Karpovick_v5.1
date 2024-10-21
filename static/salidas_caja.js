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
                <td>${e.sucursal_nombre}</td>
                <td>${e.concepto}</td>
                <td>${e.comprobante}</td>
                <td style="text-align: right">${e.monto.toFixed(2)}</td>
                <td style="text-align: right">${e.caja_bancos.toFixed(2)}</td>
                <td style="text-align: right">${e.credito_gastos.toFixed(2)}</td>
                <td style="text-align: right">${(e.monto + e.caja_bancos).toFixed(2)}</td>
                <td>${e.nombres}</td>
                <td style="text-align: center">${e.fecha_gastos}</td>
                <td style="display: flex; justify-content: center;">
                    <div class="tooltip">
                        <span onclick="pagoMercancias('${e.comprobante}', ${e.credito_gastos}, '${e.comprobante}')" class="material-symbols-outlined myButtonEditar" 
                        style="font-size:18px;">credit_card</span>
                        <span class="tooltiptext">Realizar pago</span>
                    </div>
                    
                </td>
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

    if(document.getElementById("concepto-gastos").value != "" &&
        document.getElementById("monto-gastos").value > 0 &&
        expregul.descripcion.test(document.getElementById("concepto-gastos").value) &&
        expregul.descripcion.test(document.getElementById("comprobante-gastos").value) &&
        expregul.precios.test(document.getElementById("monto-gastos").value)){
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

    /* graficarDona("circulo_total_deposito", ".valor_circulo_deposito", ".porcentaje_circulo_deposito", _depositos, total, 
                _depositos, (((_depositos/total)) * 100).toFixed(2), colorFondoBarra[0], '#fff0')
    graficarDona("circulo_total_personal", ".valor_circulo_personal", ".porcentaje_circulo_personal", _nomina, total, 
                _nomina, (((_nomina/total)) * 100).toFixed(2), colorFondoBarra[0], '#fff0')
    graficarDona("circulo_total_alquiler", ".valor_circulo_alquiler", ".porcentaje_circulo_alquiler", _alquiler, total, 
                _alquiler, (((_alquiler/total)) * 100).toFixed(2), colorFondoBarra[0], '#fff0')
    graficarDona("circulo_total_servicios", ".valor_circulo_servicios", ".porcentaje_circulo_servicios", _servicios, total, 
                _servicios, (((_servicios/total)) * 100).toFixed(2), colorFondoBarra[0], '#fff0')
    graficarDona("circulo_total_insumos", ".valor_circulo_insumos", ".porcentaje_circulo_insumos", _proveedores, total, 
                _proveedores, (((_proveedores/total)) * 100).toFixed(2), colorFondoBarra[0], '#fff0')
    graficarDona("circulo_total_otros", ".valor_circulo_otros", ".porcentaje_circulo_otros", _otros, total, 
                _otros, (((_otros/total)) * 100).toFixed(2), colorFondoBarra[0], '#fff0')
    graficarDona("circulo_total_seguridad_social", ".valor_circulo_seguridad_social", ".porcentaje_circulo_seguridad_social", _seguridad_social, total, 
                _seguridad_social, (((_seguridad_social/total)) * 100).toFixed(2), colorFondoBarra[0], '#fff0')
    graficarDona("circulo_total_impuestos", ".valor_circulo_impuestos", ".porcentaje_circulo_impuestos", _impuestos, total, 
                _impuestos, (((_impuestos/total)) * 100).toFixed(2), colorFondoBarra[0], '#fff0')
    graficarDona("circulo_total_mantenimiento", ".valor_circulo_mantenimiento", ".porcentaje_circulo_mantenimiento", _mantenimientos, total, 
                _mantenimientos, (((_mantenimientos/total)) * 100).toFixed(2), colorFondoBarra[0], '#fff0')
    graficarDona("circulo_total_publicidad", ".valor_circulo_publicidad", ".porcentaje_circulo_publicidad", _publicidad, total, 
                _publicidad, (((_publicidad/total)) * 100).toFixed(2), colorFondoBarra[0], '#fff0')
    graficarDona("circulo_total_prestamos", ".valor_circulo_prestamos", ".porcentaje_circulo_prestamos", _pago_prestamos, total, 
                _pago_prestamos, (((_pago_prestamos/total)) * 100).toFixed(2), colorFondoBarra[0], '#fff0') */
};
////////////////////////////////////////////////////////////////////////////////////////////////////////
async function pagoMercancias(comprobante, creditos, tipo_comprobante){
    if(creditos > 0){

        compra_ = await cargarDatos(`gastos_pago_mercancias/${comprobante}`)
        tabla_mercancias(tipo_comprobante)
        cargarSucursalesEjecucion(document.getElementById("_sucursal_mercancias"))
        document.getElementById("acciones_gastos").classList.add("modal-show-credito")
        removerAccionRapida(document.getElementById("remover_accion_rapida"), 
                            document.getElementById("form_accion_rapida"),
                            document.getElementById("acciones_gastos"))
        let _input_caja_chica = document.querySelector("#accion_uno")
        let _input_caja_bancos = document.querySelector("#accion_dos")
        let _input_pendiente = document.getElementById("accion_pendiente")
        saldoPendiente(compra_, _input_caja_chica, _input_caja_bancos, _input_pendiente)
        document.getElementById("accion_procesar_pago").addEventListener("click", async (e)=>{
            e.preventDefault()
    
            _input_caja_chica.style.background = "";
            _input_caja_bancos.style.background = "";
    
            if(!isNaN(_input_caja_chica.value) && Number(_input_caja_chica.value) >= 0 &&
            !isNaN(_input_caja_bancos.value) && Number(_input_caja_bancos.value) >= 0 &&
            Number(_input_pendiente.textContent) >= 0){
                try{
                    modal_proceso_abrir(`Procesando el pago de ${tipo_comprobante}!!!.`, "")
                    await procesarPagoMercancia(compra_, tipo_comprobante)
                }catch (error){
                    modal_proceso_abrir("Ocurrió un error. " + error, "")
                    console.error("Ocurrió un error. ", error)
                    modal_proceso_salir_botones()
                };
            }else if(isNaN(_input_caja_chica.value) || Number(_input_caja_chica.value) < 0){
                _input_caja_chica.style.background = "var(--fondo-marca-uno)"
                modal_proceso_abrir("El monto no es válido.", "")
                modal_proceso_salir_botones()
            }else if(isNaN(_input_caja_bancos.value) || Number(_input_caja_bancos.value) < 0){
                _input_caja_bancos.style.background = "var(--fondo-marca-uno)"
                modal_proceso_abrir("El monto no es válido.", "")
                modal_proceso_salir_botones()
            }else if(Number(_input_pendiente.textContent) < 0){
                modal_proceso_abrir("El monto a pagar es mayor al saldo adeudado.", "")
                modal_proceso_salir_botones()
            }
        })
    }else{
        modal_proceso_abrir("Esta operación no presenta saldo adeudado.", "")
        modal_proceso_salir_botones()
    }

}
function removerAccionRapida(elemento_button, elemento_contenendor, elemento_class){
    let remover = elemento_button;
    remover.addEventListener("click", (e)=>{
        e.preventDefault();
        elemento_contenendor.remove()
        elemento_class.classList.remove("modal-show-credito")
    });
};
function tabla_mercancias(nombre){
    let html = `<div id="form_accion_rapida" class="nuevo-contenedor-box">
                    <h2 style="text-align: center;">Pago: ${nombre}</h2>
                    <div style="display: flex; justify-content: center;">
                        <select name="_sucursal_mercancias" id="_sucursal_mercancias" class="input-select-ventas">
                        </select>
                    </div>
                    <div class="contenedor_tabla_salidas">
                    `;
                html += `<table class="tabla-proforma" id="tabla_mercancia">
                            <thead>
                                <tr>
                                    <th>Sucursal</th>
                                    <th>Concepto</th>
                                    <th>Comprobante</th>
                                    <th>Amorti-zación caja Chica</th>
                                    <th>Amorti-zación Caja Bancos</th>
                                    <th>Total amorti-zación</th>
                                    <th>Saldo monto</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>`;
                for(let e of compra_){
                    let fila = `<tr>
                                    <td class="invisible">${e.id_gastos}</td>
                                    <td>${e.sucursal_nombre}</td>
                                    <td>${e.concepto}</td>
                                    <td style="text-align: center; width: 150px">${(e.comprobante)}</td>
                                    <td style="text-align: center; width: 90px">${(e.monto).toFixed(2)}</td>
                                    <td style="text-align: center; width: 90px">${(e.caja_bancos).toFixed(2)}</td>
                                    <td style="text-align: center; width: 90px">${(e.monto + e.caja_bancos).toFixed(2)}</td>
                                    <td style="text-align: center; width: 90px">${(e.credito_gastos).toFixed(2)}</td>
                                    <td style="text-align: center; width: 90px">${(e.fecha_gastos)}</td>
                                </tr>`;
                    html = html + fila
                }
                    html += `</tbody>
                        </table>
                    </div>
                    <br>
                    <div style="display: flex;justify-content: space-evenly;">
                        <div>
                            <label class="label-general" style="border: 1px solid var(--fondo-marca-dos); padding-left: 3px">Deuda inicial
                                <span style="width: 100px; text-align: center; background: var(--fondo-marca-dos);" >${moneda()} ${compra_.length>0 ?(compra_[0].credito_gastos).toFixed(2): ""}</span>
                            </label>
                            <label class="label-general" style="border: 1px solid var(--fondo-marca-uno); padding-left: 3px">Saldo adeudado
                                <span style="width: 100px; text-align: center; background: var(--fondo-marca-uno);" >${moneda()} ${compra_.length>0 ?(compra_[compra_.length - 1].credito_gastos).toFixed(2): ""}</span>
                            </label>
                        </div>
                        <div style="display: grid; justify-items: center;">
                            <label class="label-general">Pago caja chica</label>
                            <input  id="accion_uno" class="input-tablas-dos-largo" type="text" placeholder="00.00">
                        </div>
                        <div style="display: grid; justify-items: center;">
                            <label class="label-general">Pago caja bancos</label>
                            <input  id="accion_dos" class="input-tablas-dos-largo" type="text" placeholder="00.00">
                        </div>
                        <div style="display: grid; justify-items: center;">
                            <label class="label-general">Saldo pendiente</label>
                            <span id="accion_pendiente" class="input-tablas-dos-largo" style="font-size= 20px;"></span>
                        </div>
                    </div>
                    <div style="display: flex;justify-content: center;">
                        <button id="accion_procesar_pago" class="myButtonAgregar">Procesar Pago</button>
                        <button id="revertir_pago" class="myButtonEliminar">Revertir último pago</button>
                        <button id="remover_accion_rapida" class="myButtonEliminar">Cancelar</button>
                    </div>
                </div>`
    document.getElementById("acciones_gastos").innerHTML = html;
};
function saldoPendiente(compra_, _input_caja_chica, _input_caja_bancos, _input_pendiente){
    _input_pendiente.textContent = compra_[compra_.length - 1].credito_gastos
    _input_caja_chica.addEventListener("keyup", ()=>{
        _input_pendiente.textContent = compra_[compra_.length - 1].credito_gastos - 
                                (Number(_input_caja_chica.value) + Number(_input_caja_bancos.value ))
        _input_pendiente.style.background = _input_pendiente.textContent >= 0 ? "" : "var(--fondo-marca-uno)";
    })
    _input_caja_bancos.addEventListener("keyup", ()=>{
        _input_pendiente.textContent = compra_[compra_.length - 1].credito_gastos - 
                                (Number(_input_caja_bancos.value) + Number(_input_caja_chica.value ))
        _input_pendiente.style.background = _input_pendiente.textContent >= 0 ? "" : "var(--fondo-marca-uno)";
    })
};
async function procesarPagoMercancia(array_cre, tipo_comprobante){
    if(array_cre.length > 0 && array_cre[array_cre.length - 1].credito_gastos > 0){
        let caja_chica = Number(document.getElementById("accion_uno").value)
        let caja_bancos = Number(document.getElementById("accion_dos").value)
        let mercancia = {
            "sucursal_gastos": document.getElementById("_sucursal_mercancias").value,
            "concepto": array_cre[0].concepto === "11_prestamo" ? "12_pago_prestamos" : "1_mercancía",
            "comprobante": array_cre[0].comprobante,
            "monto": caja_chica,
            "caja_bancos": caja_bancos,
            "credito_gastos":   (array_cre[array_cre.length - 1].credito_gastos) - 
                                (Number(caja_chica) + Number(caja_bancos)),
            "fecha_gastos": generarFecha()
        }

        let urlMercancia = URL_API_almacen_central + 'gastos_varios'
        let responde_mercancia = await funcionFetch(urlMercancia, mercancia)
        if(responde_mercancia.ok){
            console.log("Respuesta creditos "+responde_mercancia.status)
            manejoDeFechas()
            await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                                document.getElementById("numeracionTablaGastosVarios"), 20)
            await searchDatos(subRutaB((document.getElementById("numeracionTablaGastosVarios").value - 1) * 20, 1), 
                                base_datos,"#tabla-gastos-varios")
            modal_proceso_abrir(`Operación completada exitosamente (${tipo_comprobante}).`, "")
            modal_proceso_salir_botones()
            document.getElementById("form_accion_rapida").remove()
            document.getElementById("acciones_gastos").classList.remove("modal-show-credito")
        }
    }else if(array_cre.length <= 0){
        modal_proceso_abrir(`El comprobante ${tipo_comprobante} no presenta saldo alguno para cancelar.`, "")
        modal_proceso_salir_botones()
    }else if(array_cre[array_cre.length - 1].saldo_total <= 0){
        modal_proceso_abrir(`El saldo del comprobante ${tipo_comprobante} ya se encuentra cancelado.`, "")
        modal_proceso_salir_botones()
    }
};
//////////////////////////////////////////////////////////////////////////////////////////
// Préstamos
document.getElementById("resgistrarPrestamo").addEventListener("click", (e)=>{
    e.preventDefault();
    formPrestamoRecibido()
    cargarSucursalesEjecucion(document.getElementById("_sucursal_prestamo"))
    document.getElementById("acciones_prestamo").classList.add("modal-show-credito")
    sumarMontosPrestamo()
    removerAccionRapida(document.getElementById("cancelar_prestamo"),
                        document.getElementById("contenedor_prestamo"),
                        document.getElementById("acciones_prestamo"))
    procesarPrestamo();
});
function formPrestamoRecibido(){
    let html =  `<div id="contenedor_prestamo">
                    <h2 style="text-align: center;"> Registro de préstamo recibido </h2>
                    <div style="display: flex; justify-content: center;">
                        <select name="_sucursal_prestamo" id="_sucursal_prestamo" class="input-select-ventas">
                        </select>
                    </div>
                    <form class="formulario-general">
                        <label class="label-general">Detalle:
                            <input class="input-general fondo" id="comprobante_prestamo" placeholder="Digite la institución prestamista">
                        </label>
                        <label class="label-general">Monto del principal:
                            <input class="input-general fondo" id="monto_prestamo" placeholder="00.00">
                        </label>
                        <label class="label-general">Monto del interés:
                            <input class="input-general fondo" id="interes_prestamo" placeholder="00.00">
                        </label>
                        <label class="label-general">Total adeudado:
                            <input class="input-general fondo" id="total_prestamo" disabled placeholder="00.00">
                        </label>
                    </form>
                    <div style="display: flex;justify-content: center;">
                        <button class="myButtonAgregar" id="procesar_prestamo">Procesar préstamo</button>
                        <button class="myButtonEliminar" id="cancelar_prestamo">Cancelar</button>
                    </div>
                </div>`
    document.getElementById("acciones_prestamo").innerHTML = html;
};
function sumarMontosPrestamo(){
    document.getElementById("monto_prestamo").addEventListener("keyup", ()=>{
        document.getElementById("total_prestamo").value =   (Number(document.getElementById("monto_prestamo").value) +
                                                            Number(document.getElementById("interes_prestamo").value)).toFixed(2)  
    })
    document.getElementById("interes_prestamo").addEventListener("keyup", ()=>{
        document.getElementById("total_prestamo").value =   (Number(document.getElementById("monto_prestamo").value) +
                                                            Number(document.getElementById("interes_prestamo").value)).toFixed(2) 
    })
}
function procesarPrestamo(){
    document.getElementById("procesar_prestamo").addEventListener("click", async ()=>{
        if(Number(document.getElementById("total_prestamo").value) > 0){
            function Data() {
                this.sucursal_gastos = document.getElementById("_sucursal_prestamo").value;
                this.concepto = "11_prestamo";
                this.comprobante = `${document.getElementById("comprobante_prestamo").value}: ${document.getElementById("total_prestamo").value}: ${generarFecha()}`;
                this.fecha_gastos = generarFecha();
                this.monto = 0;
                this.caja_bancos = 0;
                this.credito_gastos = document.getElementById("total_prestamo").value;
            };
            let _prestamo = new Data()
            let url_prestamo = URL_API_almacen_central + 'gastos_varios'
            let response = await funcionFetch(url_prestamo, _prestamo)
            if(response.ok){
                document.getElementById("total_prestamo").style.background = ""
                manejoDeFechas();
                await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                                    document.getElementById("numeracionTablaGastosVarios"), 20)
                await searchDatos(subRutaB((document.getElementById("numeracionTablaGastosVarios").value - 1) * 20, 1), 
                                    base_datos,"#tabla-gastos-varios")
                document.getElementById("acciones_prestamo").classList.remove("modal-show-credito")
                modal_proceso_abrir("Préstamo registrado.", "")
                modal_proceso_salir_botones()
            }
        }else{
            document.getElementById("total_prestamo").style.background = "#b36659"
            modal_proceso_abrir("Monto total del préstamo inválido.", "")
            modal_proceso_salir_botones()
        }
    });
};