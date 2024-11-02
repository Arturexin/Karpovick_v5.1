
document.addEventListener("DOMContentLoaded", inicioClientes)
let anio_principal = ""
function inicioClientes(){
    anio_principal = new Date().getFullYear()
    inicioTablasClientes()
    cargarDatosAnio()
    graficoClientes();
    array_btn_pages[13] = 1;
};
const barras_compras = [".cg_1_c", ".cg_2_c", ".cg_3_c", ".cg_4_c", ".cg_5_c"]
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        anio_principal = anio_referencia.value;

        graficoClientes();

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
let reporte_ = [];
async function inicioTablasClientes(){
    
    await conteoFilas(subRutaA(0), filas_total_bd, indice_tabla, 
                    document.getElementById("numeracionTablaClientes"), 20)
    await searchDatos(subRutaB(document.getElementById("numeracionTablaClientes").value - 1, 0), 
                    base_datos, "#tabla-clientes")
    avanzarTabla(document.getElementById("avanzarClientes"), 
                document.getElementById("retrocederClientes"), 
                document.getElementById("numeracionTablaClientes"), 
                num_filas_tabla, indice_tabla, 
                filas_total_bd, 20, 
                base_datos, "#tabla-clientes")
    atajoTabla(document.getElementById("numeracionTablaClientes"), 20, base_datos, 
                 "#tabla-clientes", indice_tabla, num_filas_tabla)
    filtro(document.getElementById("buscarFiltrosClientes"), 
            indice_tabla, num_filas_tabla, filas_total_bd, 
            document.getElementById("numeracionTablaClientes"), 20, 
            base_datos,  "#tabla-clientes")
    restablecerTabla(document.getElementById("restablecerClientes"), 
                    indice_tabla, num_filas_tabla, filas_total_bd, 
                    document.getElementById("numeracionTablaClientes"), 20, base_datos,  "#tabla-clientes")
};
function subRutaA(index){
    let fecha_inicio = ['2000-01-01', inicio]
    let fecha_fin = [new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(), fin]  
    return  `clientes_conteo?`+
            `nombre_persona=${document.getElementById("filtro-tabla-clientes-nombre").value}&`+
            `dni_persona=${document.getElementById("filtro-tabla-clientes-dni").value}&`+
            `email_persona=${document.getElementById("filtro-tabla-clientes-email").value}&`+
            `telefono_persona=${document.getElementById("filtro-tabla-clientes-telefono").value}&`+
            `usuario_persona=${document.getElementById("filtro-tabla-clientes-usuario").value}&`+
            `clase_persona=${document.getElementById("filtro-tabla-clientes-clase").value}&`+
            `fecha_inicio_persona=${fecha_inicio[index]}&`+
            `fecha_fin_persona=${fecha_fin[index]}`
};
function subRutaB(num, index){
    let fecha_inicio = ['2000-01-01', inicio]
    let fecha_fin = [new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(), fin]  
    return  `clientes_tabla/${num}?`+
            `nombre_persona=${document.getElementById("filtro-tabla-clientes-nombre").value}&`+
            `dni_persona=${document.getElementById("filtro-tabla-clientes-dni").value}&`+
            `email_persona=${document.getElementById("filtro-tabla-clientes-email").value}&`+
            `telefono_persona=${document.getElementById("filtro-tabla-clientes-telefono").value}&`+
            `usuario_persona=${document.getElementById("filtro-tabla-clientes-usuario").value}&`+
            `clase_persona=${document.getElementById("filtro-tabla-clientes-clase").value}&`+
            `fecha_inicio_persona=${fecha_inicio[index]}&`+
            `fecha_fin_persona=${fecha_fin[index]}`
};
function cuerpoFilaTabla(e){
    return  `<tr class="busqueda-nombre">
                <td class="invisible">${e.id_cli}</td>
                <td>${e.nombre_cli}</td>
                <td style="text-align: center;">${e.dni_cli}</td>
                <td>${e.email_cli}</td>
                <td style="text-align: center;">${e.telefono_cli}</td>
                <td>${e.direccion_cli}</td>
                <td style="text-align: center;">${e.nombres}</td>
                <td style="text-align: center;width: 120px">${e.fecha_cli}</td>
                <td style="text-align: center;">
                    <div class="tooltip">
                        <span onclick="edit(${e.id_cli})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">edit</span>
                        <span class="tooltiptext">Editar cliente</span>
                    </div>
                    <div class="tooltip">
                        <span onclick="remove(${e.id_cli})" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila">delete</span>
                        <span class="tooltiptext">Eliminar cliente</span>
                    </div>
                    
                    
                </td>
            </tr>`
};
function vaciadoInputBusqueda(){
    document.getElementById("filtro-tabla-clientes-nombre").value = ""
    document.getElementById("filtro-tabla-clientes-dni").value = ""
    document.getElementById("filtro-tabla-clientes-email").value = ""
    document.getElementById("filtro-tabla-clientes-telefono").value = ""
    document.getElementById("filtro-tabla-clientes-usuario").value = ""
    document.getElementById("filtro-tabla-clientes-fecha-inicio").value = ""
    document.getElementById("filtro-tabla-clientes-fecha-fin").value = ""
};
function manejoDeFechas(){
    inicio = document.getElementById("filtro-tabla-clientes-fecha-inicio").value;
    fin = document.getElementById("filtro-tabla-clientes-fecha-fin").value;
    if(inicio == "" && fin == ""){
        inicio = '2000-01-01';
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
    }else if(inicio == "" && fin != ""){
        inicio = '2000-01-01';
    }else if(inicio != "" && fin == ""){
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
    };
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function edit(id) {
    let cliente = base_datos.array.find(x => x.id_cli == id)
    document.getElementById('txtId').value = cliente.id_cli
    document.getElementById('nombre').value = cliente.nombre_cli
    document.getElementById('dni').value = cliente.dni_cli
    document.getElementById('email').value = cliente.email_cli
    document.getElementById('telefono').value = cliente.telefono_cli
    document.getElementById('direccion').value = cliente.direccion_cli
    document.getElementById('clase_cli').value = cliente.clase_cli
};
async function remove(id) {
    manejoDeFechas();
    let url = URL_API_almacen_central + 'clientes_remove'
    let data = {
        'id_cli': id,
    };
    let response = await funcionFetchDos(url, data);
    if(response.status === "success"){
        await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                            document.getElementById("numeracionTablaClientes"), 20)
        await searchDatos(subRutaB(num_filas_tabla.value, 1), base_datos, "#tabla-clientes")
        if(document.querySelector("#filtro-tabla-clientes-clase").value == 0){
            localStorage.setItem("clientes_consulta", JSON.stringify(await cargarDatos('clientes_ventas')))                       
        }else if(document.querySelector("#filtro-tabla-clientes-clase") == 1){
            localStorage.setItem("proveedores_consulta", JSON.stringify(await cargarDatos('proveedores')))
        };
        modal_proceso_abrir(`${response.message}`)
        modal_proceso_salir_botones()
    };
};


const registrarCliente = document.getElementById("registrar-cliente");
registrarCliente.addEventListener("click", saveClientes)
async function saveClientes(e) {
    e.preventDefault();
    modal_proceso_abrir("Procesando el registro!!!.", "")
    let clientes_consultaentes = JSON.parse(localStorage.getItem("clientes_consulta"))
    let encontrado = clientes_consultaentes.find(y => y.nombre_cli.toLowerCase().startsWith(document.getElementById("nombre").value.toLowerCase()) && 
                                            y.telefono_cli.toLowerCase().startsWith(document.getElementById("telefono").value.toLowerCase()))
    if(encontrado === undefined){
        if(expregul.cliente.test(document.getElementById("nombre").value) &&
        expregul.telefono.test(document.getElementById("telefono").value) &&
        expregul.direccion.test(document.getElementById("direccion").value)){
            manejoDeFechas()
            let dataS = {
                "clase_cli": document.getElementById('clase_cli').value,
                "direccion_cli": document.getElementById('direccion').value,
                "dni_cli": document.getElementById('dni').value,
                "email_cli": document.getElementById('email').value,
                "nombre_cli": document.getElementById('nombre').value,
                "telefono_cli": document.getElementById('telefono').value,
                "fecha_cli": generarFecha()
            };
                
            let id = document.getElementById('txtId').value
            if (id != '') {
                dataS.id_cli = id
            };
            let url = URL_API_almacen_central + 'clientes'
            let response = await funcionFetchDos(url, dataS)
            if(response.status === "success"){
                await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                                document.getElementById("numeracionTablaClientes"), 20)
                await searchDatos(subRutaB((document.getElementById("numeracionTablaClientes").value - 1) * 20, 1), 
                                base_datos, "#tabla-clientes")
                if(document.getElementById('clase_cli').value == 0){
                    localStorage.setItem("clientes_consulta", JSON.stringify(await cargarDatos('clientes_ventas')))
                    cli_db = JSON.parse(localStorage.getItem("clientes_consulta"));
                    modal_proceso_abrir(`${response.message}`, "")
                    modal_proceso_salir_botones()
                }else if(document.getElementById('clase_cli').value == 1){
                    localStorage.setItem("proveedores_consulta", JSON.stringify(await cargarDatos('proveedores')))
                    prv_db = JSON.parse(localStorage.getItem("proveedores_consulta"));
                    modal_proceso_abrir(`${response.message}`, "")
                    modal_proceso_salir_botones() 
                }
                formClientes.reset();
                document.getElementById('txtId').value = ""
                document.getElementById("nombre").focus();
            };
        }else if(expregul.cliente.test(document.getElementById("nombre").value) == false){
            document.getElementById("nombre").style.background = "#b36659"
            modal_proceso_abrir("Ingrese un nombre de cliente correcto", "")
            modal_proceso_salir_botones()
        }else if(expregul.telefono.test(document.getElementById("telefono").value) == false){
            document.getElementById("telefono").style.background = "#b36659"
            modal_proceso_abrir("Ingrese un número de teléfono o celular", "")
            modal_proceso_salir_botones()
        }else if(expregul.direccion.test(document.getElementById("direccion").value) == false){
            document.getElementById("direccion").style.background = "#b36659"
            modal_proceso_abrir("Ingrese una dirección", "")
            modal_proceso_salir_botones()
        };
    }else{
        modal_proceso_abrir(`El cliente/proveedor ${document.getElementById("nombre").value} con numero de teléfono `+
        `${document.getElementById("telefono").value} ya se encunetra registrado.`, "")
        modal_proceso_salir_botones()
    };
};
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function graficoClientes(){
    await cargarClientesMes(anio_principal)
    document.getElementById("contenedor_clientes_proveedores").innerHTML = `<canvas id="clientes_preveedores" class="gradico_anual"></canvas>`
    let array_clientes = [];
    let array_proveedores = [];

    for(let i = 0; i < 12; i++){
        array_clientes.push(0);
        array_proveedores.push(0);
        clientesMensuales.forEach((event)=>{
            if(event.mes == i + 1){
                array_clientes[i] = Number(event.suma_clientes);
                array_proveedores[i] = Number(event.suma_proveedores);
            };
        });
    };

    graficoBarrasVerticalUnid(document.getElementById("clientes_preveedores"), array_clientes, array_proveedores, ['Clientes', 'Proveedores'])
};
async function cargarClientesMes(anio){
    let url = URL_API_almacen_central + 'clientes_mes?'+
                                        `year_actual=${anio}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    clientesMensuales = await respuesta.json();
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Volcado de datos/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let array_proveedores = [];
let array_no_enviado_proveedores = [];
let array_no_enviado_salidas = [];

function leerArchivo(e){
    array_proveedores = [];
    const archivo = e.target.files[0];
    if(!archivo){
        return
    }
    const lector = new FileReader();
    lector.onload = function(e){
        const contenidoCSV = e.target.result;
        convertirCSVaJSON(contenidoCSV);
    }
    lector.readAsText(archivo);
};
function convertirCSVaJSON(contenidoCSV) {
    const lineas = contenidoCSV.split('\n');
    //const cabeceras = lineas[0].split(';').map(campo => campo.replace(/[\r;'",\/\\<>=]|(--)|\/\*/g, ''));
    const cabeceras = ["nombre_cli",
                       "dni_cli",
                       "email_cli",
                       "telefono_cli",
                       "direccion_cli",
                       "clase_cli"]

    for (let i = 1; i < lineas.length; i++) {
        const datos = lineas[i].split(';').map(campo => campo.replace(/[\r;'",\/\\<>=]|(--)|\/\*/g, ''));
        if(datos.length === 5){
            const objetoJSON = {};
            for (let j = 0; j < cabeceras.length; j++) {
                if(cabeceras[j] === "clase_cli" && document.getElementById("_radio_clientes").checked){
                    objetoJSON[cabeceras[j]] = 0;
                }else if(cabeceras[j] === "clase_cli" && document.getElementById("_radio_proveedores").checked){
                    objetoJSON[cabeceras[j]] = 1;
                }else{
                    objetoJSON[cabeceras[j]] = datos[j];
                }
            };
            if(objetoJSON.nombre_cli !== ""){
                array_proveedores.push(objetoJSON);
            };
        };
    };
};

document.getElementById("carga_archivo").addEventListener("change", leerArchivo);

document.getElementById("volcar_datos").addEventListener("click", (e)=>{
    if(document.querySelector("#carga_archivo").value !== "" && array_proveedores.length > 0){
        e.preventDefault();
        comprobarDatosRepetidos();
    }else{
        e.preventDefault();
        modal_proceso_abrir("No existe ningún archivo o los datos de formato son incorrectos.", "");
        modal_proceso_salir_botones();
    }
});

let array_producto_repetido = [];
function comprobarDatosRepetidos(){
    let _proveedor_ = JSON.parse(localStorage.getItem("proveedores_consulta"));

    array_proveedores.forEach((event)=>{
        let prov = _proveedor_.find(y => y.nombre_cli === event.nombre_cli);
        if(prov !== undefined){
            array_producto_repetido.push(prov)
        }
    });
    if(array_producto_repetido.length === 0){
        procesarVolcadoProveedores();
        document.getElementById("carga_archivo").value = "";
    }else{
        let categoria = ""
        array_producto_repetido.forEach((event)=>{
            categoria += `${event.nombre_cli}, `;
            modal_proceso_abrir(`Algunos de los nombres que intenta ingresar ya existen en la base de proveedores: ${categoria}. `+
                                `Asegurese de eliminar las coincidencias antes de volver a hacer el volcado de datos.`, "");
        });
        modal_proceso_salir_botones();
        array_proveedores = [];
        document.getElementById("carga_archivo").value = "";
    };
};

async function procesarVolcadoProveedores(){
    let sum_volcado = 0;
    function EnviarATabla(array){
        this.clase_cli= array.clase_cli;
        this.direccion_cli= array.direccion_cli;
        this.dni_cli= array.dni_cli;
        this.email_cli= array.email_cli;
        this.nombre_cli= array.nombre_cli;
        this.telefono_cli= array.telefono_cli;
        this.fecha_cli= generarFecha();
    };
    let url = URL_API_almacen_central + 'clientes';
    for(let i = 0; i < array_proveedores.length; i++){
        let fila_ = new EnviarATabla(array_proveedores[i])
        let response = await funcionFetch(url, fila_);
        if(response.ok){
            sum_volcado+=1;
            modal_proceso_abrir(`Se grabó en proveedores: ${array_proveedores[i].nombre_cli}.`, "");
        }else{
            array_no_enviado_proveedores.push(array_proveedores[i]);
        };
    };
    if(sum_volcado === array_proveedores.length){
        await inicioTablasClientes();
        localStorage.setItem("proveedores_consulta", JSON.stringify(await cargarDatos('proveedores')))
        prv_db = JSON.parse(localStorage.getItem("proveedores_consulta"));
        cargarDatosAnio();
        modal_proceso_abrir(`Operación completada exitosamente en proveedores.`, "");
        modal_proceso_salir_botones();
    }else{
        let prod = ""
        array_no_enviado_proveedores.forEach((event)=>{
            prod += `${event.nombre_cli}, `;
            modal_proceso_abrir(`Algunos de los códigos que intenta ingresar no pasaron a proveedores: ${prod}.`, "");
        });
        modal_proceso_salir_botones();
    };
};
//////////////////////////////////////////////////////////////////////////////////////
//Exportar formato csv
const array_cabecera = {    "NOMBRES": "", 
                            "DNI / RUC": "", 
                            "EMAIL": "", 
                            "TELEFONO": "", 
                            "DIRECCION": "",
                        };

function convertirACSV(datos) {
    const separador = ';';
    const filas = [];

    const encabezados = Object.keys(datos);
    filas.push(encabezados.join(separador));
    const valores = encabezados.map((campo) => datos[campo]);
    filas.push(valores.join(separador));
    return filas.join('\n');
}

function descargarCSV(datos, nombreArchivo) {
    const contenidoCSV = '\uFEFF' + convertirACSV(datos);
    const blob = new Blob([contenidoCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo + '.csv';

    document.body.appendChild(enlace);
    enlace.click();

    document.body.removeChild(enlace);
}
document.getElementById("exportar_formato").addEventListener("click", (e)=>{
    e.preventDefault();
    descargarCSV(array_cabecera, "misProveedores")
});

document.querySelectorAll("._radio_cp").forEach((event)=>{
    event.addEventListener("change", ()=>{
        document.getElementById("carga_archivo").value = "";
    })
})
////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("reporteClientes").addEventListener("click", async (e)=>{
    e.preventDefault()
    reporte_ = await cargarDatos(`clientes_reporte`)
    console.log(reporte_)
    reporte_clientes()
})
function reporte_clientes(){
    let suma_efectivo = 0;
    let suma_tarjeta = 0;
    let suma_credito = 0;
    let suma_devoluciones = 0;
    let suma_delivery = 0;
    let suma_local = 0;
    let suma_total = 0;
    let total = 0;
    let html = `<div style="display: grid; justify-items: center;">
                    <h2 style="text-align: center;">Reporte de ventas por cliente</h2>
                    <br>
                    <h3 style="text-align: center;">${new Date()}</h3>
                    <br>
                    <table>
                        <thead>
                            <th style="width: 120px; text-align: center;">Cliente</th>
                            <th style="width: 90px; text-align: center;">Efectivo</th>
                            <th style="width: 40px; text-align: center;">% Efectivo</th>
                            <th style="width: 90px; text-align: center;">Tarjeta</th>
                            <th style="width: 40px; text-align: center;">% Tarjeta</th>
                            <th style="width: 90px; text-align: center;">Crédito</th>
                            <th style="width: 40px; text-align: center;">% Crédito</th>
                            <th style="width: 90px; text-align: center;">Devolución</th>
                            <th style="width: 40px; text-align: center;">% Devolución</th>
                            <th style="width: 90px; text-align: center;">Total</th>
                            <th style="width: 40px; text-align: center;">% Total</th>
                            <th style="width: 90px; text-align: center;">Delivery</th>
                            <th style="width: 90px; text-align: center;">Local</th>
                            <th style="width: 90px; text-align: center;">Primera compra</th>
                            <th style="width: 90px; text-align: center;">Ultima compra</th>
                            <th style="width: 90px; text-align: center;">Teléfono</th>
                        </thead>
                        <tbody>`
    for(let e of reporte_){
        suma_efectivo += e.pago_efectivo;
        suma_tarjeta += e.pago_tarjeta;
        suma_credito += e.pago_credito;
        suma_devoluciones += e.pago_devoluciones;
        suma_delivery += Number(e.delivery);
        suma_local += Number(e.local);
        suma_total += (e.pago_efectivo + e.pago_tarjeta + e.pago_credito - e.pago_devoluciones);
        total = e.pago_efectivo + e.pago_tarjeta + e.pago_credito - e.pago_devoluciones;
                let fila = `<tr>
                                <td>${e.nombre_cli}</td>
                                <td style="text-align: end;">${(e.pago_efectivo).toFixed(2)}</td>
                                <td style="text-align: end;">${Math.round((e.pago_efectivo/total) * 100)}%</td>
                                <td style="text-align: end;">${(e.pago_tarjeta).toFixed(2)}</td>
                                <td style="text-align: end;">${Math.round((e.pago_tarjeta/total) * 100)}%</td>
                                <td style="text-align: end;">${(e.pago_credito).toFixed(2)}</td>
                                <td style="text-align: end;">${Math.round((e.pago_credito/total) * 100)}%</td>
                                <td style="text-align: end;">${(e.pago_devoluciones).toFixed(2)}</td>
                                <td style="text-align: end;">${Math.round((e.pago_devoluciones/total) * 100)}%</td>
                                <td style="text-align: end;">${(total).toFixed(2)}</td>
                                <td style="text-align: end;">100%</td>
                                <td style="text-align: center;">${e.delivery}</td>
                                <td style="text-align: center;">${e.local}</td>
                                <td style="text-align: center;">${e.primera_venta}</td>
                                <td style="text-align: center;">${e.ultima_venta}</td>
                                <td style="text-align: center;">${e.telefono_cli}</td>
                            </tr>`
                html = html + fila;
    }
                        
                html += `</tbody>
                        <tfooter>
                            <tr></tr>
                            <tr>
                                <th>Total</th>
                                <th style="text-align: end;">${(suma_efectivo).toFixed(2)}</th>
                                <th style="text-align: end;">${Math.round((suma_efectivo/suma_total) * 100)}%</th>
                                <th style="text-align: end;">${(suma_tarjeta).toFixed(2)}</th>
                                <th style="text-align: end;">${Math.round((suma_tarjeta/suma_total) * 100)}%</th>
                                <th style="text-align: end;">${(suma_credito).toFixed(2)}</th>
                                <th style="text-align: end;">${Math.round((suma_credito/suma_total) * 100)}%</th>
                                <th style="text-align: end;">${(suma_devoluciones).toFixed(2)}</th>
                                <th style="text-align: end;">${Math.round((suma_devoluciones/suma_total) * 100)}%</th>
                                <th style="text-align: end;">${(suma_total).toFixed(2)}</th>
                                <th style="text-align: end;">100%</th>
                                <th style="text-align: center;">${suma_delivery}</th>
                                <th style="text-align: center;">${suma_local}</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </tfooter>
                    </table>
                    <button onclick="window.print()">Imprimir</button>
                </div>`
    let nuevaVentana = window.open('');
    nuevaVentana.document.write(html);
}