////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////SALIDAS////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", inicioSalidas)
function inicioSalidas(){
    inicioTablasSalidas()
    array_btn_pages[12] = 1;
};

const url_array_conteo = ["salidas_conteo", "transferencias_conteo_s"]
const url_array_tabla = ["salidas_tabla", "transferencias_tabla_s"]
let url_conteo = url_array_conteo[Number(document.getElementById("filtro_tabla").value)]
let url_tabla = url_array_tabla[Number(document.getElementById("filtro_tabla").value)]
const tabla = document.getElementById("filtro_tabla")

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
let filas_total_bd = {value: 0};
let indice_tabla = {value : 1};
let num_filas_tabla = {value: 0};

let base_datos = {array: []}
async function inicioTablasSalidas(){
    await conteoFilas(subRutaA(0), filas_total_bd, indice_tabla, 
                    document.getElementById("numeracionTablaSalidas"), 20)
    await searchDatos(subRutaB(document.getElementById("numeracionTablaSalidas").value - 1, 0), 
                    base_datos,"#tabla-salidas")
    avanzarTabla(document.getElementById("avanzarSalidas"), 
                document.getElementById("retrocederSalidas"), 
                document.getElementById("numeracionTablaSalidas"), 
                num_filas_tabla, indice_tabla, 
                filas_total_bd, 20, 
                base_datos,"#tabla-salidas")
    atajoTabla(document.getElementById("numeracionTablaSalidas"), 20, base_datos, 
                "#tabla-salidas", indice_tabla, num_filas_tabla)
    filtro(document.getElementById("buscarFiltrosSalidas"), 
            indice_tabla, num_filas_tabla, filas_total_bd, 
            document.getElementById("numeracionTablaSalidas"), 20, 
            base_datos, "#tabla-salidas")
    restablecerTabla(document.getElementById("restablecerSalidas"), 
                    indice_tabla, num_filas_tabla, filas_total_bd, 
                    document.getElementById("numeracionTablaSalidas"), 20, base_datos, "#tabla-salidas")
};
tabla.addEventListener("change", ()=>{
    url_conteo = url_array_conteo[Number(tabla.value)]
    url_tabla = url_array_tabla[Number(tabla.value)]
});
function subRutaA(index){
    let fecha_inicio = ['2000-01-01', inicio]
    let fecha_fin = [new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(), fin]  
    return  `${url_conteo}?`+
            `sucursal_salidas=${document.getElementById("filtro-tabla-salidas-sucursal").value}&`+
            `categoria_salidas=${document.getElementById("filtro-tabla-salidas-categoria").value}&`+
            `codigo_salidas=${document.getElementById("filtro-tabla-salidas-codigo").value}&`+
            `comprobante_salidas=${document.getElementById("filtro-tabla-salidas-operacion").value}&`+
            `fecha_inicio_salidas=${fecha_inicio[index]}&`+
            `fecha_fin_salidas=${fecha_fin[index]}`
};
function subRutaB(num, index){
    let fecha_inicio = ['2000-01-01', inicio]
    let fecha_fin = [new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(), fin]  
    return  `${url_tabla}/${num}?`+
            `sucursal_salidas=${document.getElementById("filtro-tabla-salidas-sucursal").value}&`+
            `categoria_salidas=${document.getElementById("filtro-tabla-salidas-categoria").value}&`+
            `codigo_salidas=${document.getElementById("filtro-tabla-salidas-codigo").value}&`+
            `comprobante_salidas=${document.getElementById("filtro-tabla-salidas-operacion").value}&`+
            `fecha_inicio_salidas=${fecha_inicio[index]}&`+
            `fecha_fin_salidas=${fecha_fin[index]}`
};
function cuerpoFilaTabla(e){
    return  `<tr class="busqueda-salidas">
                <td class="invisible">${e.idSal}</td>
                <td style="border-left: 7px solid ${CS(e.sucursal_nombre)};">${e.sucursal_nombre}</td>
                <td>${e.categoria_nombre}</td>
                <td>${e.codigo}</td>
                <td style="text-align: end;">${e.existencias_salidas}</td>
                <td style="text-align: end;">${e.existencias_devueltas}</td>
                <td style="text-align: end;">${formatoMoneda(e.precio_venta_salidas)}</td>
                <td style="text-align: end;">${e.existencias_salidas === 0 
                    ? formatoMoneda(0.00) 
                    : formatoMoneda((e.existencias_salidas - e.existencias_devueltas) * e.precio_venta_salidas)}</td>
                <td>${e.comprobante}</td>
                <td>${e.fecha}</td>
                <td style="text-align: center;width: 80px">
                    <div class="tooltip">
                        <span onclick="accionDevoluciones(${e.idSal})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">assignment_return</span>
                        <span class="tooltiptext">Devolver</span>
                    </div>
                    <div class="tooltip">
                        <span onclick="accionRemove(${e.idSal})" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila">delete</span>
                        <span class="tooltiptext">Eliminar operación</span>
                    </div>
                </td>
            </tr>`
};
function vaciadoInputBusqueda(){
    document.getElementById("filtro-tabla-salidas-sucursal").value = ""
    document.getElementById("filtro-tabla-salidas-categoria").value = ""
    document.getElementById("filtro-tabla-salidas-codigo").value = ""
    document.getElementById("filtro-tabla-salidas-operacion").value = ""
    document.getElementById("_fecha_inicio_").value = ""
    document.getElementById("_fecha_fin_").value = ""
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function accionRemove(id) {
    modal_proceso_abrir("Buscando resultados...", "", "")

    let salidas = base_datos.array.find(y => y.idSal == id)// obtenemos los datos de la fila
    let db = JSON.parse(localStorage.getItem("inventarios_consulta"))
    let producto = db.find(x=> x.codigo === salidas.codigo)

    await delay(500)
    modal_proceso_cerrar()

    tabla_proforma_productos(producto, "Eliminar salida", salidas.categoria_nombre, salidas.comprobante);

    let contenedor_tab = document.querySelector("#contenedor_tabla_producto");
    contenedor_tab.children[0].remove();
    
    contenedorBotonesProducto(`procesarRemove(${salidas.idSal})`, "Eliminar salida")
    document.getElementById("acciones_rapidas_salidas").classList.add("modal-show")
};

async function procesarRemove(idSal){
    manejoDeFechas();
    let url = URL_API_almacen_central + 'salidas_remove'
    let data = {
        'idSal': idSal
    };
    let response = await funcionFetchDos(url, data);
    if(response.status === "success"){
        await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                        document.getElementById("numeracionTablaSalidas"), 20)
        await searchDatos(subRutaB(num_filas_tabla.value, 1), base_datos,"#tabla-salidas")
        modal_proceso_abrir(`${response.message}.`)
        modal_proceso_salir_botones()
        removerContenido()
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let sucursal_id_salidas = 0;

let producto_Id_salidas = "";
let indice_sucursal_salidas = 0;

async function accionDevoluciones(id) {
    modal_proceso_abrir("Buscando resultados...", "", "")

    let salidas = base_datos.array.find(x => x.idSal == id)
    let db = JSON.parse(localStorage.getItem("inventarios_consulta"))
    let sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_consulta"))
    if(salidas.comprobante.startsWith("Venta")){
        await delay(500)
        modal_proceso_cerrar()
        let producto = db.find(x=> x.codigo === salidas.codigo)
        tabla_proforma_productos(producto, "Devoluciones", salidas.categoria_nombre, salidas.comprobante)
        sucursales_comparacion.forEach((e, i) =>{
            if(salidas.sucursal_nombre == e.sucursal_nombre){
                sucursal_id_salidas = e.id_sucursales
                tabla_body_productos(salidas, i, sucursal_id_salidas)
            }
        });
        contenedorBotonesProducto(`procesarDevolucion()`, "Procesar Devolución")
        document.getElementById("acciones_rapidas_salidas").classList.add("modal-show")
    }else{
        modal_proceso_abrir("No es una venta.", "")
        modal_proceso_salir_botones()
    };
};
function tabla_proforma_productos(producto, titulo, categoria, operacion){
    let html = `<div id="form_accion_rapida" class="nuevo-contenedor-box">
                    <h2 style="text-align: center;">${titulo}</h2>
                    <table class="tabla_modal contenido-tabla">
                        <thead>
                            <tr>
                                <th style="width: 120px;">Categoría</th>
                                <th style="width: 120px;">Código</th>
                                <th style="width: 200px;">Descripción</th>
                                <th style="width: 200px;">Operación</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td id="id_prod" class="invisible">${producto.idProd}</td>
                                <td style="width: 120px; text-align: center;">${categoria}</td>
                                <td style="width: 120px; text-align: center;">${producto.codigo}</td>
                                <td style="width: 200px; text-align: center;">${producto.descripcion}</td>
                                <td style="width: 200px; text-align: center;">${operacion}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br>
                    <div id="contenedor_tabla_producto">`;
                html += `<table class="tabla-proforma" id="tabla_proforma_producto">
                            <thead>
                                <th>Operación</th>
                                <th>Sucursal</th>
                                <th>Unidades adquiridas</th>
                                <th>Unidades devueltas</th>
                                <th>Devolver</th>
                                <th>Saldo</th>
                                <th>Causa</th>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <br>
                    <div id="contenedor_botones_producto" style="display: flex;justify-content: center;">
                    </div>
                </div>`;
    document.getElementById("acciones_rapidas_salidas").innerHTML = html;
};
function tabla_body_productos(prod_, i, id_suc){
    let tabla_= document.querySelector("#tabla_proforma_producto > tbody");
    let nuevaFilaTabla_ = tabla_.insertRow(-1);
    let fila =  `<tr>` +
                    `<td class="invisible" id="id_prod">${prod_.idSal}</td>` + //Operación
                    `<td style="text-align: center; width: 120px" class="dev_oper">${prod_.comprobante}</td>` + //Operación
                    `<td style="text-align: center; width: 120px">${prod_.sucursal_nombre}</td>` + // Sucursal
                    `<td style="text-align: center; width: 120px">${prod_.existencias_salidas}</td>` + // existencias adquiridas
                    `<td style="text-align: center; width: 120px">${prod_.existencias_devueltas}</td>` + // existencias devueltas
                    `<td>
                        <input class="input-tablas-dos-largo q_dev" onKeyup = "op_dev(this)">
                    </td>` + //Devolución
                    `<td style="text-align: center; width: 90px" class="s_dev">${prod_.existencias_salidas - prod_.existencias_devueltas}</td>` + // Saldo
                    `<td>   
                        <select id="accion_causa_devolucion_entradas" class="input-general-importante fondo-importante">
                            <option value="0" selected="">-- Causa de devolución --</option>                                    
                            <option value= "1">Producto defectuoso</option>
                            <option value= "2">Producto dañado durante el envío</option>
                            <option value= "3">Producto incorrecto o equivocado</option>
                            <option value= "4">Talla o ajuste incorrecto</option>
                            <option value= "5">Insatisfacción con el producto</option>
                            <option value= "6">Cambio por otro producto</option>
                            <option value= "7">Cancelación del pedido</option>
                            <option value= "8">Entrega retrasada</option>
                        </select>
                    </td>` + // id de la cucursal
                    `<td class="invisible">${id_suc}</td>` + // id de la cucursal
                    `<td class="invisible">${i}</td>` + // indice de la sucursal
                    `<td class="invisible dev_pre">${prod_.precio_venta_salidas}</td>` + // precio de venta
                    `<td class="invisible">${prod_.cliente}</td>` + // cliente
                `</tr>`;
    nuevaFilaTabla_.innerHTML = fila;
    document.querySelector(".q_dev").focus();
};
function contenedorBotonesProducto(funcion, titulo){
    let contenedor_bot = document.querySelector("#contenedor_botones_producto");
    let html =  `
                <button class="myButtonAgregar" onCLick="${funcion}">${titulo}</button>
                <button class="myButtonEliminar" onClick="removerContenido()">Cancelar</button>
                `;
    contenedor_bot.innerHTML = html;
}
function removerContenido(){
    let contenido = document.getElementById("form_accion_rapida")
    contenido.remove();
    document.getElementById("acciones_rapidas_salidas").classList.remove("modal-show")
};
function op_dev(e){
    let row_ = e.closest("tr");
    row_.children[6].textContent = Number(row_.children[3].textContent) - (Number(row_.children[5].children[0].value) + Number(row_.children[4].textContent))
    Number(row_.children[6].textContent) < 0 || 
    isNaN(Number(row_.children[6].textContent)) ?   row_.children[6].style.background = "var(--boton-dos)": 
                                                    row_.children[6].style.background = "";
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function procesarDevolucion(){
    modal_proceso_abrir("Procesando la devolución de la venta!!!.", "")
    manejoDeFechas()
    let inputs = document.querySelectorAll(".q_dev");
    let texts_saldos = document.querySelectorAll(".s_dev");
    let valores = Array.from(inputs).map(input => Number(input.value));
    let valores_saldos = Array.from(texts_saldos).map(texts_saldos => Number(texts_saldos.textContent));
    if (valores.every(valor => valor >= 0 && Number.isFinite(valor)) && valores.some(valor => valor > 0) &&
    valores_saldos.every(valor => valor >= 0 && Number.isFinite(valor))){
        try{
            await realizarDevolucion()
            await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                    document.getElementById("numeracionTablaSalidas"), 20)
            await searchDatos(subRutaB((document.getElementById("numeracionTablaSalidas").value - 1) * 20, 1), 
                            base_datos,"#tabla-salidas")
        }catch(error){
            modal_proceso_abrir("Ocurrió un error. " + error, "")
            console.error("Ocurrió un error. ", error)
            modal_proceso_salir_botones()
        };
    }else{
        modal_proceso_abrir(`Uno o varios de los valores son incorrectos.`, ``)
        modal_proceso_salir_botones()
    };
};
async function realizarDevolucion(){
    let det_venta = await cargarDatos(`ventas_comprobante/${document.querySelector(".dev_oper").textContent}`)
    await delay(500)
    let array_devolucion = [];
    function DatosDevolucionSalidas(a){
        this.idProd = document.getElementById("id_prod").textContent;
        this.sucursal_post = sucursales_activas[a.children[9].textContent];
        this.existencias_post = Number(a.children[5].children[0].value);

        this.id_op = a.children[0].textContent;

        this.comprobante = "Dev-" + a.children[1].textContent;
        this.causa_devolucion = a.children[7].children[0].value;
        this.precio_venta_salidas = Number(a.children[10].textContent);
        this.sucursal = a.children[8].textContent;
        this.cliente = a.children[11].textContent;
    };
    const numFilas = document.querySelector("#tabla_proforma_producto > tbody").children
    for(let i = 0 ; i < numFilas.length; i++){
        if(numFilas[i]){
            array_devolucion.push(new DatosDevolucionSalidas(numFilas[i]));
        };
    };
    function DataDevoluciones(){
        this.array_devolucion = array_devolucion;
        this.id_det_ventas = det_venta[0].id_det_ventas
        this.modo_perdida = Number(document.querySelector(".q_dev").value) * 
                            Number(document.querySelector(".dev_pre").textContent);
        this.fecha = generarFecha();
    }
    let url = URL_API_almacen_central + 'procesar_devolucion_salidas'
    let fila = new DataDevoluciones()

    let response = await funcionFetchDos(url, fila)

    if(response.status === "success"){
        modal_proceso_abrir(`${response.message}`)
        modal_proceso_salir_botones()
        removerContenido()
    };
    document.getElementById("acciones_rapidas_salidas").classList.remove("modal-show")
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////REPORTES////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function tablaRep(array_suc, sucursal, item, concepto){
    let suma_unidades = 0;
    let suma_monto = 0;
    let tabla_ = `<table id="tabla_salidas">
                    <thead>
                        <tr>
                            <th scope="row" colspan="16"><h2>Detalle de operaciones ${sucursal}</h2></th>
                        </tr>
                        <tr>
                            <th>Fecha</th>
                            <th>${item}</th>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Comprobantes</th>
                            <th>Unidades</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>`
        for(a_s of array_suc){
            let fila =  `<tr>
                            <td>${a_s.fecha}</td>
                            <td>${a_s[concepto]}</td>
                            <td>${a_s.codigo}</td>
                            <td>${a_s.descripcion}</td>
                            <td>${a_s.comprobante}</td>
                            <td style="text-align: end;">${a_s.existencias_salidas}</td>
                            <td style="text-align: end;">${(a_s.existencias_salidas * a_s.precio_venta_salidas).toFixed(2)}</td>
                        </tr>`
            tabla_ = tabla_ + fila; 
            suma_unidades += a_s.existencias_salidas;
            suma_monto += (a_s.existencias_salidas * a_s.precio_venta_salidas);
        }                        
                                
        tabla_ += `
                    </tbody>
                    <tfoot>
                        <tr>
                            <th scope="row" colspan="5">Total</th>
                            <th>${suma_unidades}</th>
                            <th>${suma_monto.toFixed(2)}</th>
                        </tr>
                    </tfoot>
                </table>`
    return tabla_;
}
document.getElementById("reporte_ventas").addEventListener("click", async ()=>{
    modal_proceso_abrir("Buscando resultados...", "", "")
    manejoDeFechas()
    let sum_ef = 0;
    let sum_ta = 0;
    let sum_cr = 0;
    let sum_de = 0;
    let sum_to = 0;

    let reporte_detalle_ventas = await cargarDatos(`ventas_tabla_reporte?`+
                                                `fecha_inicio_det_venta=${inicio}&`+
                                                `fecha_fin_det_venta=${fin}`)

    let reporte_salidas = await cargarDatos(`salidas_tabla_reporte?`+
                                            `comprobante_salidas=Venta&`+
                                            `fecha_inicio_salidas=${inicio}&`+
                                            `fecha_fin_salidas=${fin}`)

    await delay(500)
    
    let reporteHTML = `<style>
                            body{
                                display: grid;
                                align-items: center;
                                align-content: space-between;
                                justify-content: center;
                                gap: 20px;
                                background: rgba(173, 216, 230, 0.8);
                                color: #161616;
                            }
                            td, th{
                                border: 1px solid #161616;
                            }
                            th{
                                background: rgba(100, 149, 237, 0.8);
                            }
                            .titulo_reporte{
                                display: grid;
                                justify-items: center;
                            }
                        </style>
                        <div class="titulo_reporte">
                            <h2>Reporte de Ventas</h2>
                            <h3>Fecha de reporte: ${inicio} a ${fin}</h3>
                        </div>
                        <table id="tabla_reportes">
                            <thead>
                                <tr>
                                    <th scope="row" colspan="16"><h2>Consolidado modo de pago</h2></th>
                                </tr>
                                <tr>
                                    <th>Sucursal</th>
                                    <th>Efectivo</th>
                                    <th>Tárjeta</th>
                                    <th>Crédito</th>
                                    <th>Devoluciones</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>`

    for(repor of reporte_detalle_ventas){
        let row = `
                <tr>
                    <td>${repor.sucursal_nombre}</td>
                    <td style="text-align: end;">${repor.suma_efectivo.toFixed(2)}</td>
                    <td style="text-align: end;">${repor.suma_tarjeta.toFixed(2)}</td>
                    <td style="text-align: end;">${repor.suma_credito.toFixed(2)}</td>
                    <td style="text-align: end;">${repor.suma_perdida.toFixed(2)}</td>
                    <td style="text-align: end;">${(repor.suma_credito+
                                                    repor.suma_efectivo-
                                                    repor.suma_perdida+
                                                    repor.suma_tarjeta).toFixed(2)}</td>
                </tr>`
        reporteHTML = reporteHTML + row;
        sum_ef += repor.suma_efectivo
        sum_ta += repor.suma_credito
        sum_cr += repor.suma_tarjeta
        sum_de += repor.suma_perdida
    };                    
    sum_to = sum_ef + sum_ta + sum_cr - sum_de         
    reporteHTML += `
                            
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th style="text-align: end;"></th>
                                    <th style="text-align: end;"></th>
                                    <th style="text-align: end;"></th>
                                    <th style="text-align: end;"></th>
                                    <th style="text-align: end;"></th>
                                    <th style="text-align: end;"></th>
                                </tr>
                            </tfoot>
                        </table>`
    suc_add.forEach((sucursal)=>{
        let filtro_sucursal = reporte_salidas.filter(elemento => elemento.sucursal_nombre === sucursal)
        reporteHTML += tablaRep(filtro_sucursal, sucursal, "Sucursal", "sucursal_nombre")
    })
    reporteHTML +=      `<h4 style="text-align: center;">${new Date()}</h4>
                        <div>
                            <button class="imprimir_reporte_salidas">Imprimir</button>
                        </div>
                        <script>
                            document.querySelector("#tabla_reportes > tfoot").children[0].children[0].textContent = "Total";
                            document.querySelector("#tabla_reportes > tfoot").children[0].children[1].textContent = ${sum_ef.toFixed(2)};
                            document.querySelector("#tabla_reportes > tfoot").children[0].children[2].textContent = ${sum_ta.toFixed(2)};
                            document.querySelector("#tabla_reportes > tfoot").children[0].children[3].textContent = ${sum_cr.toFixed(2)};
                            document.querySelector("#tabla_reportes > tfoot").children[0].children[4].textContent = ${sum_de.toFixed(2)};
                            document.querySelector("#tabla_reportes > tfoot").children[0].children[5].textContent = ${sum_to.toFixed(2)};

                            document.querySelector(".imprimir_reporte_salidas").addEventListener("click", (event) => {
                                event.preventDefault()
                                window.print()
                            });
                        </script>`
    modal_proceso_abrir("Resultados encontrados.", "", "")
    modal_proceso_salir_botones()
    let nuevaVentana = window.open('');
    nuevaVentana.document.write(reporteHTML);
});
document.getElementById("reporte_usuarios").addEventListener("click", async ()=>{
    modal_proceso_abrir("Buscando resultados...", "", "")
    manejoDeFechas()
    let usuarios = await cargarDatos('usuarios_tabla_local')
    let resporte_usuarios = await cargarDatos(`salidas_tabla_reporte?`+
                                            `comprobante_salidas=Venta&`+
                                            `fecha_inicio_salidas=${inicio}&`+
                                            `fecha_fin_salidas=${fin}`)
    await delay(500)
    let reporteHTML = `<style>
                            body{
                                display: grid;
                                align-items: center;
                                align-content: space-between;
                                justify-content: center;
                                gap: 20px;
                                background: rgba(173, 216, 230, 0.8);
                                color: #161616;
                            }
                            td, th{
                                border: 1px solid #161616;
                            }
                            th{
                                background: rgba(100, 149, 237, 0.8);
                            }
                            .titulo_reporte{
                                display: grid;
                                justify-items: center;
                            }
                        </style>
                        <div class="titulo_reporte">
                            <h2>Reporte de ventas por usuario</h2>
                            <h3>Fecha de reporte: ${inicio} a ${fin}</h3>
                        </div>`
    usuarios.forEach((usuario)=>{
        let filtro_usuario = resporte_usuarios.filter(elemento => elemento.nombres === usuario.nombres)
        reporteHTML += tablaRep(filtro_usuario, usuario.nombres, "Usuario", "nombres")
    })        
                            
    reporteHTML += `    <h4 style="text-align: center;">${new Date()}</h4>
                        <div>
                            <button class="imprimir_reporte_usuarios">Imprimir</button>
                        </div>
                        <script>
                            document.querySelector(".imprimir_reporte_usuarios").addEventListener("click", (event) => {
                                event.preventDefault()
                                window.print()
                            });
                        </script>`
    
    modal_proceso_abrir("Resultados encontrados.", "", "")
    modal_proceso_salir_botones()
    let nuevaVentana = window.open('');
    nuevaVentana.document.write(reporteHTML);
});
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////


function formatoMoneda(valor_numerico){
    let value = valor_numerico.toString();
    value = value.replace(/[^0-9.]/g, '');// Eliminar todo lo que no sea un número o un punto decimal
    if (value.includes('.')) {// Verificar si el valor contiene un punto decimal
        let parts = value.split('.');
        let integerPart = parts[0].padStart(1, '0');// Asegurar que la parte entera tenga al menos un caracter (añadir 0 si es necesario)
        let decimalPart = parts[1] ? parts[1].substring(0, 2) : '';// Limitar la parte decimal a dos dígitos
        decimalPart = decimalPart.padEnd(2, '0');// Si la parte decimal tiene menos de dos dígitos, añadir ceros
        value = `${integerPart}.${decimalPart}`;// Formatear el valor final
    } else {
        value = value.padStart(1, '0') + '.00';// Si no hay punto decimal, añadir ".00" al final y asegurar que la parte entera tiene un dígitos
    }
    return value;// Ajustar el valor del input al valor formateado
};