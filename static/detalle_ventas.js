document.addEventListener("DOMContentLoaded", inicioDetalleVentas)
let anio_principal = ""

function inicioDetalleVentas(){
    anio_principal = new Date().getFullYear()
    cargarDatosAnio()
    inicioTablasDetalleVentas()
    cargarDatosEmpresa()
    btnDetalleVentas = 1;
};
let metodo_pago_detalle = ["Efectivo", "Tarjeta", "Crédito", "Devoluciones"];
const barras_detalle = [".cg_1_c", ".cg_2_c", ".cg_3_c", ".cg_4_c", ".cg_5_c"]
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
let credito_ = []
let reporte_ = []
let reporte_dos_ = []
async function cargarDatosEmpresa(){
    det_ve_gr = await cargarDatos(  `ventas_grafico?`+
                                    `year_actual=${anio_principal}`)

    graficoModoVenta()
    graficoVentas()

    promCanalVenta()
}
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        reinicioBarraGrafico(barras_detalle);
        anio_principal = anio_referencia.value;

        det_ve_gr = await cargarDatos(`ventas_grafico?`+
                                    `year_actual=${anio_principal}`)

        graficoModoVenta()
        graficoVentas()

        promCanalVenta()

        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
let filas_total_bd = {value: 0};
let indice_tabla = {value : 1};
let num_filas_tabla = {value: 0};
let inicio = 0;
let fin = 0;
let base_datos = {array: []}
let detVentasComprobante = [];
let det_ve_gr = [];
async function inicioTablasDetalleVentas(){
    await conteoFilas(subRutaA(0), filas_total_bd, indice_tabla, 
                    document.getElementById("numeracionTablaVentas"), 20)
    await searchDatos(subRutaB(document.getElementById("numeracionTablaVentas").value - 1, 0), 
                    base_datos, "#tabla-detalle-ventas")
    avanzarTabla(document.getElementById("avanzarVentas"), 
                document.getElementById("retrocederVentas"), 
                document.getElementById("numeracionTablaVentas"), 
                num_filas_tabla, indice_tabla, 
                filas_total_bd, 20, 
                base_datos, "#tabla-detalle-ventas")
    atajoTabla(document.getElementById("numeracionTablaVentas"), 20, base_datos, 
                 "#tabla-detalle-ventas", indice_tabla, num_filas_tabla)
    filtro(document.getElementById("buscarFiltrosVentas"), 
            indice_tabla, num_filas_tabla, filas_total_bd, 
            document.getElementById("numeracionTablaVentas"), 20, 
            base_datos, "#tabla-detalle-ventas")
    restablecerTabla(document.getElementById("restablecerVentas"), 
                    indice_tabla, num_filas_tabla, filas_total_bd, 
                    document.getElementById("numeracionTablaVentas"), 20, base_datos, "#tabla-detalle-ventas")
};
function subRutaA(index){
    let fecha_inicio = ['2000-01-01', inicio]
    let fecha_fin = [new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(), fin]  
    return  `ventas_conteo?`+
            `sucursal_det_venta=${document.getElementById("filtro-tabla-detalleVentas-sucursal").value}&`+
            `comprobante_det_venta=${document.getElementById("filtro-tabla-detalleVentas-comprobante").value}&`+
            `tipComp_det_venta=${document.getElementById("filtro-tabla-detalleVentas-tipoComprobante").value}&`+
            `cliente_det_venta=${document.getElementById("filtro-tabla-detalleVentas-dni").value}&`+
            `fecha_inicio_det_venta=${fecha_inicio[index]}&`+
            `fecha_fin_det_venta=${fecha_fin[index]}`
};
function subRutaB(num, index){
    let fecha_inicio = ['2000-01-01', inicio]
    let fecha_fin = [new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(), fin]  
    return  `ventas_tabla/${num}?`+
            `sucursal_det_venta=${document.getElementById("filtro-tabla-detalleVentas-sucursal").value}&`+
            `comprobante_det_venta=${document.getElementById("filtro-tabla-detalleVentas-comprobante").value}&`+
            `tipComp_det_venta=${document.getElementById("filtro-tabla-detalleVentas-tipoComprobante").value}&`+
            `cliente_det_venta=${document.getElementById("filtro-tabla-detalleVentas-dni").value}&`+
            `fecha_inicio_det_venta=${fecha_inicio[index]}&`+
            `fecha_fin_det_venta=${fecha_fin[index]}`
};
function cuerpoFilaTabla(e){
    let color_fondo = e.situacion === "pendiente" ? "rgb(153, 77, 64, 0.4)": e.situacion === "pérdida" ? "rgb(113, 89, 142, 0.4)": "";
    let dev_ = e.modo_perdida - e.modo_efectivo - e.modo_tarjeta

    return  `<tr class="ventas-fila" style="background: ${color_fondo}">
                <td class="invisible">${e.id_det_ventas}</td>
                <td style="border-left: 7px solid ${CS(e.sucursal_nombre)};">${e.sucursal_nombre}</td>
                <td>${e.comprobante}</td>
                <td>${e.tipo_comprobante}</td>
                <td>${e.nombre_cli}</td>
                <td style="text-align: end;">${e.modo_efectivo.toFixed(2)}</td>
                <td style="text-align: end;">${e.modo_tarjeta.toFixed(2)}</td>
                <td style="text-align: end;">${e.modo_credito.toFixed(2)}</td>
                <td style="text-align: end;">${e.modo_perdida.toFixed(2)}</td>
                <td style="text-align: end;" class="invisible">${e.canal_venta}</td>
                <td>${e.canal_venta === 0 ? modelo = "Local" : modelo = "Delivery"}</td>
                <td>${e.situacion}</td>
                <td style="width: 95px">${e.fecha_det_ventas}</td>
                <td style="text-align: center; width: 90px">
                    <div class="tooltip">
                        <span onclick="buscarTicketVenta(${e.id_det_ventas})" style="font-size:18px;" class="myButtonEditar material-symbols-outlined">print</span>
                        <span class="tooltiptext">Imprimir comprobante</span>
                    </div>
                    <div class="tooltip">
                        <span onclick="buscarCredito('${e.tipo_comprobante}', 
                                                    '${e.nombre_cli}', 
                                                    ${e.id_det_ventas},
                                                    ${dev_ > 0 ? dev_ : 0})" style="font-size:18px;" class="myButtonEditar material-symbols-outlined">credit_card</span>
                        <span class="tooltiptext">Saldo de crédito</span>
                    </div>
                    
                    
                    
                </td>
            </tr>`
};
function vaciadoInputBusqueda(){
    document.getElementById("filtro-tabla-detalleVentas-sucursal").value = ""
    document.getElementById("filtro-tabla-detalleVentas-comprobante").value = ""
    document.getElementById("filtro-tabla-detalleVentas-tipoComprobante").value = ""
    document.getElementById("filtro-tabla-detalleVentas-dni").value = ""
    document.getElementById("filtro-tabla-detalleVentas-fecha-inicio").value = ""
    document.getElementById("filtro-tabla-detalleVentas-fecha-fin").value = ""
};
function manejoDeFechas(){
    inicio = document.getElementById("filtro-tabla-detalleVentas-fecha-inicio").value;
    fin = document.getElementById("filtro-tabla-detalleVentas-fecha-fin").value;
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
async function buscarTicketVenta(id_ventas) {
    let datos_cliente = JSON.parse(localStorage.getItem("clientes_consulta"))
    let numeracion_comprobante_venta = "";
    let importe_venta = 0;
    let nombre_cliente = "";
    let filaDetalleVenta = base_datos.array.find(y => y.id_det_ventas == id_ventas)
    if(filaDetalleVenta.tipo_comprobante[0] === "N"){
        numeracion_comprobante_venta = "Nota de Venta"
    }else if(filaDetalleVenta.tipo_comprobante[0] === "B"){
        numeracion_comprobante_venta = "Boleta de Venta"
    }else if(filaDetalleVenta.tipo_comprobante[0] === "F"){
        numeracion_comprobante_venta = "Factura"
    };
    detVentasComprobante = await cargarDatos(`salidas_comprobante/${filaDetalleVenta.comprobante}`)
    let _cliente = datos_cliente.find(x => x.id_cli === detVentasComprobante[0].cliente);
    if(_cliente.nombre_cli === "Sin datos"){
        nombre_cliente = "";
    }else{
        nombre_cliente = _cliente.nombre_cli;
    };

    // Generar el contenido HTML con los datos de la tabla
    let contenidoHTML = `<style>
                            *{
                                margin: 0;
                                padding: 0;
                            }
                            .contenedor_ticket {
                                display: flex;
                                justify-content: center;
                            }
                            .ticket{
                                width: 260px;
                                margin: 20px;
                                font-size: 10px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                            }
                            table{
                                font-size: 10px;
                            }
                            .tabla_head th{
                                color: black;
                                border-top: 1px solid black;
                                border-bottom: 1px solid black;
                                margin: auto;
                            }
                            .codBarTicket {
                                width: 150px;
                            }
                            .invisible {
                                display: none;
                            }
                        </style>
                        <div class="contenedor_ticket">
                        <div class="ticket">
                            <p>${neg_db[0].nombre_empresa}</p>
                            <p>${neg_db[0].direccion}</p>
                            <p>RUC: ${neg_db[0].ruc}</p>
                            <p>Sede: ${filaDetalleVenta.sucursal_nombre}</p>
                            <h2 class="tipo_comprobante">${numeracion_comprobante_venta}</h2>
                            <br>
                            <h2>${filaDetalleVenta.tipo_comprobante}</h2>
                            <br>
                            <p>FECHA   : ${filaDetalleVenta.fecha_det_ventas}</p>
                            <p>CLIENTE : ${nombre_cliente}</p>
                            <table>
                                <thead class="tabla_head">
                                    <tr>
                                        <th>PRODUCTO</th>
                                        <th>CANTIDAD</th>
                                        <th>PRECIO</th>
                                        <th>IMPORTE</th>
                                    </tr>
                                </thead>
                                <tbody>`;
        detVentasComprobante.forEach((event) =>{
        if(event.comprobante === filaDetalleVenta.comprobante){
            let producto = event.descripcion;
            let catidad = event.existencias;
            let precio = Number(event.precio_venta_salidas).toFixed(2);
            let importe = (event.precio_venta_salidas * event.existencias).toFixed(2);
            contenidoHTML += `<tr>
                        <td>${producto}</td>
                        <td>${catidad}</td>
                        <td>${precio}</td>
                        <td>${importe}</td>
                    </tr>`;
            importe_venta += Number(event.precio_venta_salidas * event.existencias);

        }
    });
            contenidoHTML +=    `</tbody>
                                <tfoot>
                                    <tr class="clave">
                                        <th>oper. GRAVADAS</th>
                                        <th></th>
                                        <th></th>
                                        <th> ${moneda()} ${((1/1.18)*(importe_venta)).toFixed(2)}</th>
                                    </tr>
                                    <tr class="clave">
                                        <th>I.G.V.</th>
                                        <th>18%</th>
                                        <th></th>
                                        <th> ${moneda()} ${((importe_venta)-((1/1.18)*(importe_venta))).toFixed(2)}</th>
                                    </tr>
                                    <tr>
                                        <th>IMPORTE TOTAL</th>
                                        <th></th>
                                        <th></th>
                                        <th> ${moneda()} ${importe_venta.toFixed(2)}</th>
                                    </tr>
                                </tfoot>   
                            </table>
                            <p>USUARIO: ${usu_db.puesto_usuario}</p>
                            <p>LADO: COPIA</p>
                                        <img class="codBarTicket" src="">
                            <p>PRESENTACIÓN IMPRESA DE LA<p>
                            <p>${numeracion_comprobante_venta}<p>
                            <br>
                            <p>ACUMULA Y CANJEA PUNTOS EN NUESTROS<p>
                            <p>DESCUENTOS Y PROMOCIONES!!!<p>
                            <p>GRACIAS POR SU PREFERENCIA<p>
                            <p>Sistema ventas: http://karpovick.com<p>
                            
                        </div>
                        </div>
                        <br>
                        <br>
                        <br>
                        <br>
                        <button id="imprimir_ticket">Imprimir</button>
                        <button id="guardar_pdf_dos">PDF</button>
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
                        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
                        <script>
                        if(document.querySelector(".tipo_comprobante").textContent === "Nota de Venta"){
                            document.querySelectorAll(".clave").forEach((event)=>{
                                event.classList.add("invisible")
                            });   
                        }
                        JsBarcode(".codBarTicket", "${filaDetalleVenta.comprobante}", {
                            format: "CODE128",
                            displayValue: true
                        });
                        var options = {
                            filename: '${filaDetalleVenta.tipo_comprobante}.pdf',
                            image: { type: 'jpeg', quality: 0.98 },
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                            };
                            document.getElementById("guardar_pdf_dos").addEventListener("click",(e)=>{
                                e.preventDefault()
                                html2pdf().set(options).from(document.querySelector(".ticket")).save();
                            })
                            document.getElementById("imprimir_ticket").addEventListener("click",(e)=>{
                                e.preventDefault()
                                window.print();
                            })
                        </script>`;

    // Abrir una nueva ventana o pestaña con el contenido HTML generado
    let nuevaVentana = window.open('');
    nuevaVentana.document.write(contenidoHTML);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function graficoVentas(){
    document.getElementById("contenedor_detalle_ventas").innerHTML = `<canvas id="gradico_detalle_ventas" class="gradico_anual"></canvas>`
    let array_efectivo = [];
    let array_tarjeta = [];
    let array_credito = [];
    let array_perdida = [];
    for(let i = 0; i < 12; i++){
        array_efectivo.push(0);
        array_tarjeta.push(0);
        array_credito.push(0);
        array_perdida.push(0);
        det_ve_gr.forEach((event)=>{
            if(event.mes == i + 1){
                array_efectivo[i] += event.suma_efectivo;
                array_tarjeta[i] += event.suma_tarjeta;
                array_credito[i] += event.suma_credito;
                array_perdida[i] += event.suma_perdida;
            }
        });
    };
    graficoLineasVertical(  document.getElementById("gradico_detalle_ventas"), 
                            array_efectivo, 
                            array_tarjeta, 
                            array_credito, 
                            array_perdida, 
                            [], 
                            mes_anio, 
                            ['Efectivo', 'Tarjetea','Crédito','Devoluciones']);
};

function graficoModoVenta(){
    document.getElementById("contenedor_detalle_sucursales").innerHTML = `<canvas id="detalle_sucursales" class="gradico_anual"></canvas>`
    document.querySelectorAll(".contenedor_dona").forEach((event, i)=>{
        event.innerHTML = `<span>${suc_add[i]}</span><canvas class="absoluto_local"></canvas>`
    })
    let modo_cobro = [];
    let num_oper = [];
    let total_oper = Array(5).fill(0);//5 sucursales
    let modo_delivery = Array(5).fill(0);//5 sucursales
    suc_add.forEach((event, i)=>{
        let c_s = suc_db.find(x => x.sucursal_nombre === event);
        modo_cobro[i] = Array(4).fill(0);// 4 modos de pago
        num_oper[i] = Array(4).fill(0);// 4 modos de pago
        det_ve_gr.forEach((e, j)=>{
            if (c_s && e.sucursal === c_s.id_sucursales){
                modo_cobro[i][0] += e.suma_efectivo
                modo_cobro[i][1] += e.suma_tarjeta
                modo_cobro[i][2] += e.suma_credito
                modo_cobro[i][3] += e.suma_perdida
    
                num_oper[i][0] += e.conteo_efectivo
                num_oper[i][1] += e.conteo_tarjeta
                num_oper[i][2] += e.conteo_credito
                num_oper[i][3] += e.conteo_perdida

                total_oper[i] += (  e.conteo_efectivo +
                                    e.conteo_tarjeta +
                                    e.conteo_credito +
                                    e.conteo_perdida)
                modo_delivery[i] += e.suma_delivery
            }
        });
    })

    graficoBarrasHorizontalDos( document.getElementById("detalle_sucursales"),
                                suc_add, 
                                ['Efectivo','Tarjeta','Crédito','Devoluciones'],
                                [num_oper[0][0],num_oper[1][0],num_oper[2][0],num_oper[3][0],num_oper[4][0]],
                                [num_oper[0][1],num_oper[1][1],num_oper[2][1],num_oper[3][1],num_oper[4][1]],
                                [num_oper[0][2],num_oper[1][2],num_oper[2][2],num_oper[3][2],num_oper[4][2]],
                                [num_oper[0][3],num_oper[1][3],num_oper[2][3],num_oper[3][3],num_oper[4][3]],
                                total_oper);
    document.querySelectorAll(".absoluto_local").forEach((event, i)=>{
        graficoDona(event, ['Local', 'Delivery'], [(total_oper[i] - modo_delivery[i]), modo_delivery[i]], cls[0], cls_dos[3], false, ' op.')
    })
};
function promCanalVenta(){
    let meses = 0;
    let suma_conteo = 0;
    let suma_delivery = 0;

    document.getElementById("promedio_venta_local").textContent = "";//Reinicio de span
    document.getElementById("promedio_venta_delivery").textContent = "";//Reinicio de span

    if(det_ve_gr.length > 0){
        det_ve_gr.forEach((event)=>{
            suma_conteo += event.conteo
            suma_delivery += event.suma_delivery
        });
        for(let i = 0; i < suc_db.length; i++){
            let suma_delivery = 0;
            det_ve_gr.forEach((event)=>{
                if(event.sucursal === Number(suc_db[i].id_sucursales)){
                    suma_delivery += event.suma_delivery
                }
            });
        };

        if((det_ve_gr[det_ve_gr.length-1].mes - det_ve_gr[0].mes) === 0){
            meses = 1
        }else{
            meses = (det_ve_gr[det_ve_gr.length-1].mes - det_ve_gr[0].mes)+1
        };
        document.getElementById("promedio_venta_local").textContent = `${(Math.round((suma_conteo - suma_delivery) / meses))} por mes`
        document.getElementById("promedio_venta_delivery").textContent = `${(suma_delivery / meses).toFixed(2)} por mes`
    }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function buscarCredito(tipo_comprobante, nombre, id_det_ventas, devolucion_){
    credito_ = await cargarDatos(`credito_comprobante/${id_det_ventas}`)
    console.log(credito_)
    if(credito_.length > 0){
        tabla_creditos(nombre, devolucion_)
        document.getElementById("acciones_creditos").classList.add("modal-show-credito")
        removerAccionRapida()
        let _input_efectivo = document.querySelector("#accion_efectivo")
        let _input_tarjeta = document.querySelector("#accion_tarjeta")
        let _input_perdida = document.querySelector("#accion_perdida")
        let _input_pendiente = document.getElementById("accion_pendiente")
        saldoPendiente(credito_, _input_efectivo, _input_tarjeta, _input_pendiente, devolucion_)
        declararPerdida(credito_, _input_efectivo, _input_tarjeta, _input_pendiente, _input_perdida, devolucion_)
        document.getElementById("accion_procesar_pago").addEventListener("click", async (e)=>{
            e.preventDefault()
    
            _input_efectivo.style.background = "";
            _input_tarjeta.style.background = "";
    
            if(!isNaN(_input_efectivo.value) && Number(_input_efectivo.value) >= 0 &&
            !isNaN(_input_tarjeta.value) && Number(_input_tarjeta.value) >= 0 &&
            Number(_input_pendiente.textContent) >= 0){
                try{
                    modal_proceso_abrir(`Procesando el pago de ${tipo_comprobante}!!!.`, "")
                    await procesarPagoCredito(credito_, tipo_comprobante, id_det_ventas)
                }catch (error){
                    modal_proceso_abrir("Ocurrió un error. " + error, "")
                    console.error("Ocurrió un error. ", error)
                    modal_proceso_salir_botones()
                };
            }else if(isNaN(_input_efectivo.value) || Number(_input_efectivo.value) < 0){
                _input_efectivo.style.background = "var(--fondo-marca-uno)"
                modal_proceso_abrir("El monto en efectivo no es válido.", "")
                modal_proceso_salir_botones()
            }else if(isNaN(_input_tarjeta.value) || Number(_input_tarjeta.value) < 0){
                _input_tarjeta.style.background = "var(--fondo-marca-uno)"
                modal_proceso_abrir("El monto con tarjeta no es válido.", "")
                modal_proceso_salir_botones()
            }else if(Number(_input_pendiente.textContent) < 0){
                modal_proceso_abrir("El monto a pagar es mayor al saldo adeudado.", "")
                modal_proceso_salir_botones()
            }
        })
        document.getElementById("revertir_credito").addEventListener("click", ()=>{
            revertirUltimoPago(credito_)
        })
    }else{
        modal_proceso_abrir("No presenta crédito.", "")
        modal_proceso_salir_botones()
    }
}
function saldoPendiente(credito_, _input_efectivo, _input_tarjeta, _input_pendiente, devolucion_){
    _input_pendiente.textContent = (credito_[credito_.length - 1].saldo_total - devolucion_).toFixed(2)
    _input_efectivo.addEventListener("keyup", ()=>{
        _input_pendiente.textContent = (credito_[credito_.length - 1].saldo_total - 
                                ((Number(_input_efectivo.value) + Number(_input_tarjeta.value ))+
                                devolucion_)).toFixed(2)
        _input_pendiente.style.background = _input_pendiente.textContent >= 0 ? "" : "var(--fondo-marca-uno)";
    })
    _input_tarjeta.addEventListener("keyup", ()=>{
        _input_pendiente.textContent = (credito_[credito_.length - 1].saldo_total - 
                                ((Number(_input_tarjeta.value) + Number(_input_efectivo.value ))+
                                devolucion_)).toFixed(2)
        _input_pendiente.style.background = _input_pendiente.textContent >= 0 ? "" : "var(--fondo-marca-uno)";
    })
}
function declararPerdida(credito_, _input_efectivo, _input_tarjeta, _input_pendiente, _input_perdida, devolucion_){
    document.querySelector("#check_perdida").addEventListener("click", ()=>{
        _input_efectivo.value = ""
        _input_tarjeta.value = ""
        _input_pendiente.style.background = "";
        _input_pendiente.textContent = (credito_[credito_.length - 1].saldo_total - devolucion_).toFixed(2)
        if(document.querySelector("#check_perdida").checked){
            _input_efectivo.setAttribute("disabled", "true")
            _input_tarjeta.setAttribute("disabled", "true")
            _input_perdida.value = _input_pendiente.textContent
        }else{
            _input_efectivo.removeAttribute("disabled")
            _input_tarjeta.removeAttribute("disabled")
            _input_perdida.value = ""
        }
    })
}
function tabla_creditos(nombre, devolucion_){
    let html = `<div id="form_accion_rapida" class="nuevo-contenedor-box">
                    <h2 style="text-align: center;">Cliente: ${nombre}</h2>
                    
                    <div class="contenedor_tabla_salidas">
                    `;
                html += `<table class="tabla-proforma" id="tabla_credito">
                            <thead>
                                <tr>
                                    <th>Sucursal</th>
                                    <th>Tipo de comprobante</th>
                                    <th>Pago efectivo</th>
                                    <th>Pago tarjeta</th>
                                    <th>Tasa de interés</th>
                                    <th>Amorti-zación monto</th>
                                    <th>Amorti-zación interés</th>
                                    <th>Saldo monto</th>
                                    <th>Saldo interés</th>
                                    <th>Saldo total</th>
                                    <th>Saldo pérdida</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>`;
                for(let e of credito_){
                    let fila = `<tr>
                                    <td>${e.sucursal_nombre}</td>
                                    <td>${e.tipo_comprobante}</td>
                                    <td style="text-align: center; width: 90px">${(e.efectivo).toFixed(2)}</td>
                                    <td style="text-align: center; width: 90px">${(e.tarjeta).toFixed(2)}</td>
                                    <td style="text-align: center; width: 90px">${e.tasa}%</td>
                                    <td style="text-align: center; width: 90px">${(e.a_monto).toFixed(2)}</td>
                                    <td style="text-align: center; width: 90px">${(e.a_interes).toFixed(2)}</td>
                                    <td style="text-align: center; width: 90px">${(e.saldo_monto).toFixed(2)}</td>
                                    <td style="text-align: center; width: 90px">${(e.saldo_interes).toFixed(2)}</td>
                                    <td style="text-align: center; width: 90px">${(e.saldo_total).toFixed(2)}</td>
                                    <td style="text-align: center; width: 90px">${(e.saldo_perdida).toFixed(2)}</td>
                                    <td style="text-align: center; width: 90px">${e.fecha_cre}</td>
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
                                <span style="width: 100px; text-align: center; background: var(--fondo-marca-dos);" >${moneda()} ${credito_.length>0 ?(credito_[0].saldo_total).toFixed(2): ""}</span>
                            </label>
                            <label class="label-general" style="border: 1px solid var(--fondo-marca-uno); padding-left: 3px">Saldo adeudado
                                <span style="width: 100px; text-align: center; background: var(--fondo-marca-uno);" >${moneda()} ${credito_.length>0 ?(credito_[credito_.length - 1].saldo_total).toFixed(2): ""}</span>
                            </label>
                            <label class="label-general" style="border: 1px solid rgb(113, 89, 142); padding-left: 3px">Devolución
                                <span style="width: 100px; text-align: center; background: rgb(113, 89, 142);" >${moneda()} ${devolucion_}</span>
                            </label>
                        </div>
                        <div style="display: grid; justify-items: center;">
                            <label class="label-general">Pago en efectivo</label>
                            <input  id="accion_efectivo" class="input-tablas-dos-largo" type="text" placeholder="00.00">
                        </div>
                        <div style="display: grid; justify-items: center;">
                            <label class="label-general">Pago con tarjeta</label>
                            <input  id="accion_tarjeta" class="input-tablas-dos-largo" type="text" placeholder="00.00">
                        </div>
                        <div style="display: grid; justify-items: center;">
                            <label class="label-general">Saldo pendiente</label>
                            <span id="accion_pendiente" class="input-tablas-dos-largo" style="font-size= 20px;"></span>
                        </div>
                        <div style="display: grid; justify-items: center;">
                            <label class="label-general">Pérdida <input id="check_perdida" type="checkbox"></label>
                            <input style="color: red" id="accion_perdida" class="input-tablas-dos-largo" type="text" placeholder="00.00" disabled>
                        </div>
                    </div>
                    <div style="display: flex;justify-content: center;">
                        <button id="accion_procesar_pago" class="myButtonAgregar">Procesar Pago</button>
                        <button id="revertir_credito" class="myButtonEliminar">Revertir último pago</button>
                        <button id="remover_accion_rapida" class="myButtonEliminar">Cancelar</button>
                    </div>
                </div>`;
    document.getElementById("acciones_creditos").innerHTML = html;
}
function removerAccionRapida(){
    let remover = document.getElementById("remover_accion_rapida");
    remover.addEventListener("click", (e)=>{
        e.preventDefault();
        document.getElementById("form_accion_rapida").remove()
        document.getElementById("acciones_creditos").classList.remove("modal-show-credito")
    });
};
async function procesarPagoCredito(array_cre, tipo_comprobante, id_det_ventas){
    if(array_cre.length > 0 && array_cre[array_cre.length - 1].saldo_total > 0){
        let efectivo = Number(document.getElementById("accion_efectivo").value)
        let tarjeta = Number(document.getElementById("accion_tarjeta").value)
        let perdida = Number(document.getElementById("accion_perdida").value)
        let tasa = 1 + array_cre[array_cre.length - 1].tasa / 100
        let suc__ = suc_db.find(x=> x.sucursal_nombre === array_cre[0].sucursal_nombre)
        function Credito(){
            this.sucursal_cre = suc__.id_sucursales;
            this.id_detalle = id_det_ventas;
            this.efectivo = parseFloat((efectivo).toFixed(2));
            this.tarjeta = parseFloat((tarjeta).toFixed(2));
            this.tasa = array_cre[array_cre.length - 1].tasa;
            this.a_monto = parseFloat(((efectivo + tarjeta)/tasa).toFixed(2));
            this.a_interes = parseFloat(((efectivo + tarjeta) - (efectivo + tarjeta)/tasa).toFixed(2));
            this.saldo_monto = parseFloat((array_cre[array_cre.length - 1].saldo_monto - (efectivo + tarjeta)/tasa).toFixed(2));
            this.saldo_interes = parseFloat((array_cre[array_cre.length - 1].saldo_interes - ((efectivo + tarjeta) - (efectivo + tarjeta)/tasa)).toFixed(2));
            this.saldo_total = parseFloat(((array_cre[array_cre.length - 1].saldo_monto - (efectivo + tarjeta)/tasa) + 
                                (array_cre[array_cre.length - 1].saldo_interes - ((efectivo + tarjeta) - (efectivo + tarjeta)/tasa))-
                                perdida).toFixed(2));
            this.saldo_perdida = parseFloat((perdida).toFixed(2));
            this.fecha_cre = generarFecha();
            this.situacion = this.saldo_perdida > 0 ? "pérdida" : this.saldo_total > 0 ? "pendiente" : "liquidado";
        }
        let credito = new Credito()
        
        let urlCredito = URL_API_almacen_central + 'operar_creditos'
        let responde_credito = await funcionFetchDos(urlCredito, credito)
        if(responde_credito.status === "success"){
            console.log("Respuesta creditos "+responde_credito.message)
            manejoDeFechas()
            await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                            document.getElementById("numeracionTablaVentas"), 20)
            await searchDatos(subRutaB((document.getElementById("numeracionTablaVentas").value - 1) * 20, 1), 
                            base_datos, "#tabla-detalle-ventas")
            modal_proceso_abrir(`${responde_credito.message}`, "")
            modal_proceso_salir_botones()
            document.getElementById("form_accion_rapida").remove()
            document.getElementById("acciones_creditos").classList.remove("modal-show-credito")
        }
    }else if(array_cre.length <= 0){
        modal_proceso_abrir(`El comprobante ${tipo_comprobante} no presenta crédito alguno para cancelar.`, "")
        modal_proceso_salir_botones()
    }else if(array_cre[array_cre.length - 1].saldo_total <= 0){
        modal_proceso_abrir(`El crédito del comprobante ${tipo_comprobante} ya se encuentra cancelado.`, "")
        modal_proceso_salir_botones()
    }
}
async function revertirUltimoPago(array_cre){
    if (array_cre.length > 1) {
        let url = URL_API_almacen_central + 'creditos_remove'
        let data = {
            'id_creditos': array_cre[array_cre.length - 1].id_creditos
        };
        let response = await funcionFetchDos(url, data);
        if(response.status === "success"){
            manejoDeFechas()
            await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                                document.getElementById("numeracionTablaVentas"), 20)
            await searchDatos(subRutaB((document.getElementById("numeracionTablaVentas").value - 1) * 20, 1), 
                                base_datos, "#tabla-detalle-ventas")
            modal_proceso_abrir(`${response.message}.`)
            modal_proceso_salir_botones()
            document.getElementById("form_accion_rapida").remove()
            document.getElementById("acciones_creditos").classList.remove("modal-show-credito")
        };
    };
}
////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("reportesCreditos").addEventListener("click", async (e)=>{
    e.preventDefault()
    reporte_dos_ = await cargarDatos(`credito_reporte_dos`)

    reporte_creditos()
})
function reporte_creditos(){
    let suma_monto = 0;
    let suma_saldo = 0;
    let html = `<div style="display: grid; justify-items: center;">
                    <h2 style="text-align: center;">Reporte de cuentas por cobrar</h2>
                    <br>
                    <h3 style="text-align: center;">${new Date()}</h3>
                    <br>
                    <table>
                        <thead>
                            <th style="width: 120px; text-align: center;">Sucursal</th>
                            <th style="width: 120px; text-align: center;">Comprobante</th>
                            <th style="width: 150px; text-align: center;">Cliente</th>
                            <th style="width: 90px; text-align: center;">Monto</th>
                            <th style="width: 90px; text-align: center;">Saldo</th>
                            <th style="width: 90px; text-align: center;">Avance</th>
                            <th style="width: 90px; text-align: center;">Días activo</th>
                            <th style="width: 200px; text-align: center;">Fecha de inicio</th>
                            <th style="width: 90px; text-align: center;">Teléfono</th>
                        </thead>
                        <tbody>`
    for(let e of reporte_dos_){
        suma_monto += e.monto_credito
        suma_saldo += e.saldo_credito
                let fila = `<tr>
                                <td>${e._sucursal}</td>
                                <td>${e.tipo_comprobante}</td>
                                <td>${e.nombre_cli}</td>
                                <td style="text-align: end;">${(e.monto_credito).toFixed(2)}</td>
                                <td style="text-align: end;">${(e.saldo_credito).toFixed(2)}</td>
                                <td style="text-align: end;">${Math.round((1 - (e.saldo_credito / e.monto_credito)) * 100)}%</td>
                                <td style="text-align: center;">${Math.floor((new Date() - new Date(e.fecha_)) / (1000 * 60 * 60 * 24))} días</td>
                                <td style="text-align: center;">${e.fecha_inicio}</td>
                                <td>${e.telefono_cli}</td>
                            </tr>`
                html = html + fila;
    }
                        
                html += `</tbody>
                        <tfooter>
                            <tr></tr>
                            <tr>
                                <th scope="row" colspan="3">Total monto cuentas activas: ${moneda()} ${(suma_monto).toFixed(2)}</th>
                                <th scope="row" colspan="3">Total saldo adeudado: ${moneda()} ${(suma_saldo).toFixed(2)}</th>
                                <th scope="row" colspan="3">Total porcentaje pagado: ${Math.round((1 - (suma_saldo/suma_monto)) * 100)}%</th>
                            </tr>
                        </tfooter>
                    </table>
                    <button onclick="window.print()">Imprimir</button>
                </div>`
    let nuevaVentana = window.open('');
    nuevaVentana.document.write(html);
}