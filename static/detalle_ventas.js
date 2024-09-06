document.addEventListener("DOMContentLoaded", inicioDetalleVentas)
let anio_principal = ""
let sucursales_comparacion = ""
function inicioDetalleVentas(){
    anio_principal = new Date().getFullYear()
    cargarDatosAnio()
    inicioTablasDetalleVentas()
    cargarDatosEmpresa()
    btnDetalleVentas = 1;
    sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_encabezado"))
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
    graficoModoVenta(0, "circulo_stock_uno", "Total Venta", ".nombre_circulo_sucursal_uno", ".valor_circulo_sucursal_uno", ".porcentaje_circulo_sucursal_uno",
                    metodo_pago_detalle, colorFondoBarra)
    graficoModoVenta(1, "circulo_stock_dos", "Total Venta", ".nombre_circulo_sucursal_dos", ".valor_circulo_sucursal_dos", ".porcentaje_circulo_sucursal_dos",
                    metodo_pago_detalle, colorFondoBarra)
    graficoModoVenta(2, "circulo_stock_tres", "Total Venta", ".nombre_circulo_sucursal_tres", ".valor_circulo_sucursal_tres", ".porcentaje_circulo_sucursal_tres",
                    metodo_pago_detalle, colorFondoBarra)
    graficoModoVenta(3, "circulo_stock_cuatro", "Total Venta", ".nombre_circulo_sucursal_cuatro", ".valor_circulo_sucursal_cuatro", ".porcentaje_circulo_sucursal_cuatro",
                    metodo_pago_detalle, colorFondoBarra)
    llenarTituloCirculos()
    graficoVentas()

    promCanalVenta()
}
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        reinicioBarraGrafico(barras_detalle);
        anio_principal = anio_referencia.value;

        det_ve_gr = await cargarDatos(`ventas_grafico?`+
                                    `year_actual=${anio_principal}`)

        graficoModoVenta(0, "circulo_stock_uno", "Total Venta", ".nombre_circulo_sucursal_uno", ".valor_circulo_sucursal_uno", ".porcentaje_circulo_sucursal_uno",
                        metodo_pago_detalle, colorFondoBarra)
        graficoModoVenta(1, "circulo_stock_dos", "Total Venta", ".nombre_circulo_sucursal_dos", ".valor_circulo_sucursal_dos", ".porcentaje_circulo_sucursal_dos",
                        metodo_pago_detalle, colorFondoBarra)
        graficoModoVenta(2, "circulo_stock_tres", "Total Venta", ".nombre_circulo_sucursal_tres", ".valor_circulo_sucursal_tres", ".porcentaje_circulo_sucursal_tres",
                        metodo_pago_detalle, colorFondoBarra)
        graficoModoVenta(3, "circulo_stock_cuatro", "Total Venta", ".nombre_circulo_sucursal_cuatro", ".valor_circulo_sucursal_cuatro", ".porcentaje_circulo_sucursal_cuatro",
                        metodo_pago_detalle, colorFondoBarra)
        llenarTituloCirculos()
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
    return  `<tr class="ventas-fila">
                <td class="invisible">${e.id_det_ventas}</td>
                <td>${e.sucursal_nombre}</td>
                <td>${e.comprobante}</td>
                <td>${e.tipo_comprobante}</td>
                <td>${e.nombre_cli}</td>
                <td style="text-align: end;">${e.modo_efectivo.toFixed(2)}</td>
                <td style="text-align: end;">${e.modo_tarjeta.toFixed(2)}</td>
                <td style="text-align: end;">${e.modo_credito.toFixed(2)}</td>
                <td style="text-align: end;">${e.modo_perdida.toFixed(2)}</td>
                <td style="text-align: end;">${e.total_venta.toFixed(2)}</td>
                <td style="text-align: end;" class="invisible">${e.canal_venta}</td>
                <td>${e.canal_venta === 0 ? modelo = "Local" : modelo = "Delivery"}</td>
                <td style="width: 95px">${e.fecha_det_ventas}</td>
                <td style="text-align: center; width: 90px">
                    <div class="tooltip">
                        <span onclick="buscarTicketVenta(${e.id_det_ventas})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">print</span>
                        <span class="tooltiptext">Imprimir comprobante</span>
                    </div>
                    <div class="tooltip">
                        <span onclick="buscarCredito(   '${e.tipo_comprobante}', 
                                                    '${e.nombre_cli}', 
                                                    ${e.id_det_ventas})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">credit_card</span>
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
    let datos_usuario = JSON.parse(localStorage.getItem("datos_usuario"))
    let datos_cliente = JSON.parse(localStorage.getItem("base_datos_cli"))
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
                            <p>${datos_usuario[0].nombre_empresa}</p>
                            <p>${datos_usuario[0].direccion}</p>
                            <p>RUC: ${datos_usuario[0].ruc}</p>
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
            let catidad = event.existencias_salidas;
            let precio = Number(event.precio_venta_salidas).toFixed(2);
            let importe = (event.precio_venta_salidas * event.existencias_salidas).toFixed(2);
            contenidoHTML += `<tr>
                        <td>${producto}</td>
                        <td>${catidad}</td>
                        <td>${precio}</td>
                        <td>${importe}</td>
                    </tr>`;
            importe_venta += Number(event.precio_venta_salidas * event.existencias_salidas);

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
                            <p>USUARIO: ${document.getElementById("puesto_usuario").textContent}</p>
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
    
    let array_efectivo = [];
    let array_tarjeta = [];
    let array_credito = [];
    let array_perdida = [];
    let masAlto = 0;
    document.querySelectorAll(".color_item_grafico_detVenta").forEach((event, i)=>{
        event.style.background = `${colorFondoBarra[i]}`
        event.style.width = `20px`
        event.style.height = `10px`
    });
    document.querySelectorAll(".f_l_g").forEach((event, i)=>{
        event.textContent = `${meses_letras[i]}${anio_principal % 100}`;
    })
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
            
            if(masAlto < array_efectivo[i]){masAlto = array_efectivo[i]}
            if(masAlto < array_tarjeta[i]){masAlto = array_tarjeta[i]}
            if(masAlto < array_credito[i]){masAlto = array_credito[i]}
            if(masAlto < array_perdida[i]){masAlto = array_perdida[i]}
        });
    };
    let masAltoDos = (226 * masAlto)/214;
    document.querySelectorAll(".eje_y_numeracion").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos -= 0.20 * ((226 * masAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_1_c"), array_efectivo, masAlto, colorFondoBarra[0], document.querySelectorAll(".sg_1_c"), 4, moneda())
    pintarGraficoPositivo(document.querySelectorAll(".cg_2_c"), array_tarjeta, masAlto, colorFondoBarra[1], document.querySelectorAll(".sg_2_c"), 4, moneda())
    pintarGraficoPositivo(document.querySelectorAll(".cg_3_c"), array_credito, masAlto, colorFondoBarra[2], document.querySelectorAll(".sg_3_c"), 4, moneda())
    pintarGraficoPositivo(document.querySelectorAll(".cg_4_c"), array_perdida, masAlto, colorFondoBarra[3], document.querySelectorAll(".sg_4_c"), 4, moneda())
};
function llenarTituloCirculos(){
    /* let sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_encabezado")) */
    document.querySelectorAll(".titulo_circulo_detalle_venta").forEach((event, i)=>{
        if(sucursales_comparacion[i]){
            event.textContent = sucursales_comparacion[i].sucursal_nombre;
        };
    });
};

function graficoModoVenta(sucursal, elemento_id, titulo, class_nombre, class_valor, class_porcentaje,
                        array_nombres, array_colores){
    let modo_cobro = [0,0,0,0];
    let num_oper = [0,0,0,0];
    let total_oper = 0;
    let total_oper_neto = 0;
    det_ve_gr.forEach((event)=>{
        if(sucursales_comparacion[sucursal] && event.sucursal === sucursales_comparacion[sucursal].id_sucursales){
            modo_cobro[0] += event.suma_efectivo
            modo_cobro[1] += event.suma_tarjeta
            modo_cobro[2] += event.suma_credito
            modo_cobro[3] += event.suma_perdida

            num_oper[0] += event.suma_conteo_efectivo
            num_oper[1] += event.suma_conteo_tarjeta
            num_oper[2] += event.suma_conteo_credito
            num_oper[3] += event.suma_conteo_perdida
        }
    });
    num_oper.forEach((event, i)=>{
        total_oper +=event
        if(i < 3){//evitamos sumar pérdidas
            total_oper_neto +=event
        }
    });
    graficoDonaColores(elemento_id, titulo, modo_cobro, class_nombre, class_valor, class_porcentaje,
                        array_nombres, array_colores, num_oper, `/ ${total_oper_neto} oper.`)
};
function promCanalVenta(){
    let meses = 0;
    let suma_conteo = 0;
    let suma_delivery = 0;
    let abs_local = [];
    let abs_delivery = [];
    let total_local = 0;
    let total_delivery = 0;
    document.getElementById("promedio_venta_local").textContent = "";//Reinicio de span
    document.getElementById("promedio_venta_delivery").textContent = "";//Reinicio de span
    document.querySelectorAll(".absoluto_local").forEach((event)=>{//reinicio
        event.textContent = `0 oper.`
        event.parentNode.children[2].textContent = `0 oper.`
    })
    document.querySelectorAll(".porcentaje_local").forEach((event)=>{//reinicio
        event.textContent = `0%`
        event.parentNode.children[2].textContent = `0%`
    })

    if(det_ve_gr.length > 0){
        det_ve_gr.forEach((event)=>{
            suma_conteo += event.conteo
            suma_delivery += event.suma_delivery
        });
        for(let i = 0; i < sucursales_comparacion.length; i++){
            let suma_local = 0;
            let suma_delivery = 0;
            det_ve_gr.forEach((event)=>{
                if(event.sucursal === Number(sucursales_comparacion[i].id_sucursales)){
                    suma_local += (event.conteo - event.suma_delivery)
                    suma_delivery += event.suma_delivery
                }
            });
            abs_local.push(suma_local)
            abs_delivery.push(suma_delivery)
        };
        abs_local.forEach((event)=>{
            total_local += event
        })
        abs_delivery.forEach((event)=>{
            total_delivery += event
        })
        document.querySelectorAll(".absoluto_local").forEach((event, i)=>{
            event.textContent = `${abs_local[i]} oper.`
            event.parentNode.children[2].textContent = `${abs_delivery[i]} oper.`
        })
        document.querySelectorAll(".porcentaje_local").forEach((event, i)=>{
            event.textContent = `${Math.round((abs_local[i]/(abs_local[i] + abs_delivery[i]))*100)}%`
            event.parentNode.children[2].textContent = `${Math.round((abs_delivery[i]/(abs_local[i] + abs_delivery[i]))*100)}%`
        })
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
async function buscarCredito(tipo_comprobante, nombre, id_det_ventas){
    credito_ = await cargarDatos(`credito_comprobante/${id_det_ventas}`)
    if(credito_.length > 0){
        tabla_creditos(nombre)
        cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))
        document.getElementById("acciones_creditos").classList.add("modal-show-credito")
        removerAccionRapida()
        let _input_efectivo = document.querySelector("#accion_efectivo")
        let _input_tarjeta = document.querySelector("#accion_tarjeta")
        let _input_perdida = document.querySelector("#accion_perdida")
        let _input_pendiente = document.getElementById("accion_pendiente")
        saldoPendiente(credito_, _input_efectivo, _input_tarjeta, _input_pendiente)
        declararPerdida(credito_, _input_efectivo, _input_tarjeta, _input_pendiente, _input_perdida)
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
function saldoPendiente(credito_, _input_efectivo, _input_tarjeta, _input_pendiente){
    _input_pendiente.textContent = credito_[credito_.length - 1].saldo_total
    _input_efectivo.addEventListener("keyup", ()=>{
        _input_pendiente.textContent = credito_[credito_.length - 1].saldo_total - 
                                (Number(_input_efectivo.value) + Number(_input_tarjeta.value ))
        _input_pendiente.style.background = _input_pendiente.textContent >= 0 ? "" : "var(--fondo-marca-uno)";
    })
    _input_tarjeta.addEventListener("keyup", ()=>{
        _input_pendiente.textContent = credito_[credito_.length - 1].saldo_total - 
                                (Number(_input_tarjeta.value) + Number(_input_efectivo.value ))
        _input_pendiente.style.background = _input_pendiente.textContent >= 0 ? "" : "var(--fondo-marca-uno)";
    })
}
function declararPerdida(credito_, _input_efectivo, _input_tarjeta, _input_pendiente, _input_perdida){
    document.querySelector("#check_perdida").addEventListener("click", ()=>{
        _input_efectivo.value = ""
        _input_tarjeta.value = ""
        _input_pendiente.textContent = credito_[credito_.length - 1].saldo_total
        if(document.querySelector("#check_perdida").checked){
            _input_efectivo.setAttribute("disabled", "true")
            _input_tarjeta.setAttribute("disabled", "true")
            _input_pendiente.setAttribute("disabled", "true")
            _input_perdida.value = _input_pendiente.textContent
        }else{
            _input_efectivo.removeAttribute("disabled")
            _input_tarjeta.removeAttribute("disabled")
            _input_pendiente.removeAttribute("disabled")
            _input_perdida.value = ""
        }
    })
}
function tabla_creditos(nombre){
    let html = `<div id="form_accion_rapida" class="nuevo-contenedor-box">
                    <h2 style="text-align: center;">Cliente: ${nombre}</h2>
                    <div style="display: flex; justify-content: center;">
                        <select name="fffff-sucursal" id="fffff-sucursal" class="input-select-ventas">
                        </select>
                    </div>
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
        let credito = {
            "sucursal_cre": document.getElementById("fffff-sucursal").value,
            "id_detalle": id_det_ventas,
            "efectivo": (efectivo).toFixed(2),
            "tarjeta": (tarjeta).toFixed(2),
            "tasa": array_cre[array_cre.length - 1].tasa,
            "a_monto": ((efectivo + tarjeta)/tasa).toFixed(2),
            "a_interes": ((efectivo + tarjeta) - (efectivo + tarjeta)/tasa).toFixed(2),
            "saldo_monto": (array_cre[array_cre.length - 1].saldo_monto - (efectivo + tarjeta)/tasa).toFixed(2),
            "saldo_interes": (array_cre[array_cre.length - 1].saldo_interes - ((efectivo + tarjeta) - (efectivo + tarjeta)/tasa)).toFixed(2),
            "saldo_total": ((array_cre[array_cre.length - 1].saldo_monto - (efectivo + tarjeta)/tasa) + 
                            (array_cre[array_cre.length - 1].saldo_interes - ((efectivo + tarjeta) - (efectivo + tarjeta)/tasa))-
                            perdida).toFixed(2),
            "saldo_perdida":(perdida).toFixed(2),
            "fecha_cre": generarFecha()
        }

        let urlCredito = URL_API_almacen_central + 'operar_creditos'
        let responde_credito = await funcionFetch(urlCredito, credito)
        if(responde_credito.ok){
            console.log("Respuesta creditos "+responde_credito.status)
            manejoDeFechas()
            await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                            document.getElementById("numeracionTablaVentas"), 20)
            await searchDatos(subRutaB((document.getElementById("numeracionTablaVentas").value - 1) * 20, 1), 
                            base_datos, "#tabla-detalle-ventas")
            modal_proceso_abrir(`Operación completada exitosamente (${tipo_comprobante}).`, "")
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
    let respuesta = confirm(`Eliminar esta fila podría generar conflictos en el stock de este producto, `+
                            `¿Desea continuar?.`)
    if (respuesta && array_cre.length > 1) {
        let url = URL_API_almacen_central + `creditos/${array_cre[array_cre.length - 1].id_creditos}`
        let response = await fetch(url, {
                                            "method": 'DELETE',
                                            "headers": {
                                                "Content-Type": 'application/json'
                                                }
                                        })
        if(response.ok){
            manejoDeFechas()
            await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                            document.getElementById("numeracionTablaVentas"), 20)
            await searchDatos(subRutaB((document.getElementById("numeracionTablaVentas").value - 1) * 20, 1), 
                            base_datos, "#tabla-detalle-ventas")

            modal_proceso_abrir("Operación completada exitosamente.", "")
            modal_proceso_salir_botones()
            document.getElementById("form_accion_rapida").remove()
            document.getElementById("acciones_creditos").classList.remove("modal-show-credito")
        }
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