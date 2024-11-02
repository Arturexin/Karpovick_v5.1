document.addEventListener("DOMContentLoaded", inicioVentas)
function inicioVentas(){
    array_btn_pages[1] = 1;
    cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))
    document.getElementById("buscador-productos-ventas").focus()
    cambioSucursal();

    modosVenta();
    agregarMoneda(document.querySelectorAll(".moneda_ventas"));
    document.getElementById("categoria-ventas").innerHTML = llenarCategoriaProductosEjecucion();
    document.getElementById("categoria_buscador_detalle").innerHTML = llenarCategoriaProductosEjecucion();
};
//BOTONES SUPERIORES 
let array_saldos = [];// Aquí se guardan saldos de productos consultados
const btnCaja = document.getElementById("apertura-caja");// Te direcciona al apartado de caja chica

const cantidAdAVender = document.getElementById("cantidad-vendida-ventas");
const precioAdAVender = document.getElementById("precio-ventas");
const buscador_codigo = document.getElementById("buscador-productos-ventas");
const ventaDetalladaBtn = document.getElementById("venta_detallada");
const input_tipo_comprobante = document.getElementById("input-tipo-comprobante");
const select_sucursal = document.getElementById("fffff-sucursal");
const input_sucursal = document.getElementById("sucursal-ventas");
const id_ventas = document.getElementById("id-ventas")
const categoria_ventas = document.getElementById("categoria-ventas")
const codigo_ventas = document.getElementById("codigo-ventas")
const descripcion_ventas = document.getElementById("descripcion-ventas")
const costo_unitario_ventas = document.getElementById("costo-unitario-ventas")
const precio_venta_formulario = document.getElementById("precio-ventas-formulario")
const talla_ventas = document.getElementById("talla-ventas")
const existencias_almacen_ventas = document.getElementById("existencias-almacen-ventas")
const saldo_existencias_almacen_ventas = document.getElementById("saldo-existencias-almacen-ventas")
const total_ventas = document.getElementById("total-ventas")
const formularioMetodoDePago = document.getElementById("contenedor-metodo-pago");
btnCaja.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/apertura_caja";
});
const btnEntradas = document.getElementById("entradas-caja");// Te direcciona al apartado de entradas de efectivo (ventas)
btnEntradas.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/ventas";
    document.getElementById("entradas-caja").classList.add("marcaBotonDos")
});
const btnSalidas = document.getElementById("salidas-caja");// Te direcciona al apartado de salidas de efectivo (gastos)
btnSalidas.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/salidas_caja";
    document.querySelector(".contenedor-entradas-caja").classList.add("invisible")
    
});
//////  CLIENTES//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function consumoCliente(){// Busca datos de consumos acumulados de clientes registrados.
    let cli_consumo = await cargarDatos(`ventas_cliente_conteo/${Number(document.getElementById("txtIdv").value)}`);
    if(cli_consumo.length > 0){
        if(cli_consumo[0].conteo_cliente > 0){
            document.getElementById("concurrencia_cliente").textContent = `Cliente recurrente con ${cli_consumo[0].conteo_cliente} `+
                                                                            `operaciones de ${moneda()} ${cli_consumo[0].suma_total.toFixed(2)}, `+
                                                                            `consumo promedio ${moneda()} ${(cli_consumo[0].suma_total/cli_consumo[0].conteo_cliente).toFixed(2)}`
        };
    };
};
function buscarClienteVentas(cliente){// Función que busca clientes registrados
    document.getElementById('txtIdv').value = cliente.id_cli
    document.getElementById('clientesv').value = cliente.nombre_cli
    document.getElementById('dniv').value = cliente.dni_cli
    document.getElementById('emailv').value = cliente.email_cli
    document.getElementById('telefonov').value = cliente.telefono_cli
    document.getElementById('direccionv').value = cliente.direccion_cli
    consumoCliente()
    modal_proceso_abrir("Cliente encontrado.", "")
    modal_proceso_salir_botones_focus("buscar-cliente-ventas")
};
function funcionBusquedaCliente(opcion){
    let array_dato_cliente = ["nombre_cli", "dni_cli", "email_cli", "telefono_cli"];
    let dato_cliente = cli_db.find(y => y[array_dato_cliente[opcion - 1]].toLowerCase().includes(document.getElementById('buscar-cliente-ventas').value.toLowerCase()))
    if(dato_cliente !== undefined){
        document.getElementById("concurrencia_cliente").textContent = "";
        buscarClienteVentas(dato_cliente)
    }else{
        modal_proceso_abrir("Cliente no encontrado", "")
        modal_proceso_salir_botones_focus("buscar-cliente-ventas")
        document.getElementById("concurrencia_cliente").textContent = "";
        document.getElementById("formularioClientesVentas").reset();
    };
};
document.getElementById("boton-buscar-ventas-clientes").addEventListener("click", (e)=>{// Evento del botón "Buscar cliente"
    e.preventDefault()
    funcionBusquedaCliente(document.getElementById("opcion-buscar-cliente").value);
});
//////////REGISTRO DE CLIENTES//////////////////////////////////////////////////////////////////
function descolorearFormulario(formularioInput){
    document.querySelectorAll(formularioInput).forEach((e) => {e.style.background = ""})
};

const registrarClienteVentas = document.getElementById("save-ventas-clientes");// Evento de registro de clientes
registrarClienteVentas.addEventListener("click", saveClientesVentas)
async function saveClientesVentas(e) {
    e.preventDefault();
    let clientes_consultaentes = JSON.parse(localStorage.getItem("clientes_consulta"))// Se carga la base de datos de clientes
    let encontrado = clientes_consultaentes.find(y => y.nombre_cli.toLowerCase().startsWith(document.getElementById("clientesv").value.toLowerCase()) && // Se busca alguna coincidencia de los datos ingresados con la base de datos de clientes
                                            y.telefono_cli.toLowerCase().startsWith(document.getElementById("telefonov").value.toLowerCase()))
    if(encontrado === undefined){// Si no existen coincidencias de nombres y teléfono se procede al registro del nuevo cliente
        if(expregul.cliente.test(document.getElementById("clientesv").value) &&
            expregul.telefono.test(document.getElementById("telefonov").value) &&
            expregul.direccion.test(document.getElementById("direccionv").value)){
            modal_proceso_abrir("Procesando el registro!!!.", "")    
            let data = {
                "clase_cli": 0,
                "direccion_cli": document.getElementById('direccionv').value,
                "dni_cli": document.getElementById('dniv').value,
                "email_cli": document.getElementById('emailv').value,
                "nombre_cli": document.getElementById('clientesv').value,
                "telefono_cli": document.getElementById('telefonov').value,
                "fecha_cli": generarFecha()
            };
            let url = URL_API_almacen_central + 'clientes'
            let response = await funcionFetch(url, data);
            if(response.ok){
                descolorearFormulario("#formularioClientesVentas input");
                localStorage.setItem("clientes_consulta", JSON.stringify(await cargarDatos('clientes_ventas')))
                cli_db = JSON.parse(localStorage.getItem("clientes_consulta"))
                buscarIdNuevo()
                modal_proceso_abrir("Cliente registrado!!!.", "")
                modal_proceso_salir_botones_focus("buscar-cliente-ventas")
            };
        }else if(expregul.cliente.test(document.getElementById("clientesv").value) == false){
            document.getElementById("clientesv").style.background = "#b36659"
            modal_proceso_abrir("Ingrese un nombre de cliente correcto.", "")
            modal_proceso_salir_botones_focus("clientesv")
        }else if(expregul.telefono.test(document.getElementById("telefonov").value) == false){
            document.getElementById("telefonov").style.background = "#b36659"
            modal_proceso_abrir("Ingrese un número de teléfono o celular.", "")
            modal_proceso_salir_botones_focus("telefonov")
        }else if(expregul.direccion.test(document.getElementById("direccionv").value) == false){
            document.getElementById("direccionv").style.background = "#b36659"
            modal_proceso_abrir("Ingrese una dirección.", "")
            modal_proceso_salir_botones_focus("direccionv")
        };
    }else{
        modal_proceso_abrir(`El cliente ${document.getElementById("clientesv").value} con numero de teléfono `+
        `${document.getElementById("telefonov").value} ya se encunetra registrado.`, "")
        modal_proceso_salir_botones_focus("buscar-cliente-ventas")
    };
};
function buscarIdNuevo(){// Busca datos de un cliente recien registrado 
    let nuevo_id = cli_db.find(x => x.nombre_cli === document.getElementById('clientesv').value &&
                                        x.dni_cli === document.getElementById('dniv').value &&
                                        x.email_cli === document.getElementById('emailv').value &&
                                        x.telefono_cli === document.getElementById('telefonov').value)
    document.getElementById('txtIdv').value = nuevo_id.id_cli
};

document.getElementById("boton_restablecer_form_clientes_ventas").addEventListener("click", ()=>{
    resetClientes();
    document.getElementById("concurrencia_cliente").textContent = "";
});
//////////////////////////////////////////////////////////////////////////////////////
///////////////////BUSCADOR DE PRODUCTOS EN FORMULARIO VENTAS/////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
let sucursal_ventas = 0;
let idx_suc = 0;
buscador_codigo.addEventListener("keyup", async () =>{
    let almacenCentral = buscarProductosDinamicamente(buscador_codigo.value.toLowerCase());
    if(almacenCentral){
        
        id_ventas.value = almacenCentral.idProd;

        sucursal_ventas = select_sucursal.value;
        if(usu_db.puesto_usuario == obtenerIndiceSucursal("#fffff-sucursal")){
            idx_suc = obtenerIndiceSucursal("#fffff-sucursal");
        }else{
            idx_suc = obtenerIndiceSucursal("#fffff-sucursal");
        };
        input_sucursal.value = select_sucursal.children[idx_suc].textContent

        categoria_ventas.value = almacenCentral.categoria 
        codigo_ventas.value = almacenCentral.codigo
        descripcion_ventas.value = almacenCentral.descripcion
        if(buscador_codigo.value == ""){
            resetFormularioVentas();
            resetDetalleVentas();
        };
        resetDetalleVentas();
    }else{
        resetFormularioVentas();
        resetDetalleVentas();
    };
});
const in_existencias = ["in_ac", "in_su", "in_sd", "in_st", "in_sc"];
async function busquedaProductoPorId(){//Busca productos por id condicionado por su stock
    const id_ven = document.getElementById("id-ventas").value
    let ids = [id_ven];
    let response = await cargarDatos(   `almacen_central_codigo_transferencias?`+
                                        `ids=${ids.join(",")}`);
    let fila_res = array_saldos.find(x => response[0].idProd === x.idProd)
    if(fila_res === undefined){
        if(response[0][sucursales_activas[idx_suc]] > 0){
            array_saldos.push(new ObjGeneral(response[0].categoria,
                                            response[0].codigo,
                                            response[0].descripcion,
                                            response[0].talla,
                                            0, 0, 0, 0, 0,
                                            response[0].costo_unitario,
                                            response[0].precio_venta,
                                            response[0].lote,
                                            response[0].proveedor,
                                            response[0].idProd,
                                            response[0].existencias_ac,
                                            response[0].existencias_su,
                                            response[0].existencias_sd,
                                            response[0].existencias_st,
                                            response[0].existencias_sc,
            ));
        }else{
            modal_proceso_abrir("Existencias insuficientes. Este producto no se podrá agregar a la lista.", "")
            modal_proceso_salir_botones_focus("buscador-productos-ventas")
        }
    }else{
        if(response[0][sucursales_activas[idx_suc]] - 
        fila_res[sucursales_activas[idx_suc]] > 0){
            sucursales_activas.forEach((e)=>{
                fila_res[sucursales_activas[e]] = response[0][e];
                fila_res.costo = response[0].costo_unitario;
                fila_res.precio = response[0].precio_venta;
            });
        }else{
            modal_proceso_abrir("Existencias insuficientes.", "")
            modal_proceso_salir_botones_focus("buscador-productos-ventas")
        }
    };
};
function agregarAListaProductos(cantidAdAVender, precioAdAVender){// Busca coincidencias el tabla lista de productos y agrega nuevas filas
    let array_ = array_saldos.find(x=> x.idProd === Number(id_ventas.value))//buscamos una coincidencia en array_saldos
    if((array_[sucursales_activas[idx_suc]] + Number(cantidAdAVender)) <= array_[in_existencias[idx_suc]]){
        const id_lista = document.querySelectorAll(".id_proforma")
        const idArray = Array.from(id_lista);// id_lista se convierte en un array
        let fila_ = idArray.find(x => Number(x.textContent) === Number(id_ventas.value))// buscamos una coincidencia en la lista de ventas
        let p_v = precioAdAVender === undefined ? array_.precio : array_.in_p_v(precioAdAVender);
        let t_q_v = array_.in_q_q(cantidAdAVender, idx_suc)
        if(fila_ !== undefined){
            fila_.parentNode.children[5].textContent = array_[in_existencias[idx_suc]];
            fila_.parentNode.children[6].children[1].value = t_q_v;
            fila_.parentNode.children[8].textContent = (t_q_v * p_v).toFixed(2);
            fila_.parentNode.children[9].textContent = array_[in_existencias[idx_suc]] - t_q_v;// saldo de stock
            modal_proceso_abrir(`Se incrementó las unidades a vender del producto ${array_.descripcion}, `+
                                `con código ${array_.codigo}, a ${t_q_v} unidades.`, "")
            modal_proceso_salir_botones_focus("buscador-productos-ventas")

        }else if(fila_ === undefined){
            crearBodyVentas (array_[in_existencias[idx_suc]], array_[sucursales_activas[idx_suc]], p_v, array_.talla)
        };
    }else{
        modal_proceso_abrir("Cantidad a vender mayor a existencias.", "")
        modal_proceso_salir_botones_focus("cantidad-vendida-ventas");
    }
};
async function ventaRapida(){
    if(buscador_codigo.value !== "" && 
        id_ventas.value !== ""){
        await busquedaProductoPorId()
        agregarAListaProductos(1)//agrega nueva fila

        resetFormularioVentas()
        resetMetodoPago()
        totalesTabla();
    };
};

async function ventaDetallada_uno() {
    if(buscador_codigo.value !== ""){
        await busquedaProductoPorId()
        if(array_saldos.length > 0){
            array_saldos.forEach((event)=>{
                if(event.idProd === Number(id_ventas.value)){
                    costo_unitario_ventas.value = event.costo;
                    precio_venta_formulario.value = event.precio;
                    existencias_almacen_ventas.value = event[in_existencias[idx_suc]] - event[sucursales_activas[idx_suc]];
                    saldo_existencias_almacen_ventas.value = event[in_existencias[idx_suc]] - event[sucursales_activas[idx_suc]];
                    talla_ventas.value = event.talla;
                    precioAdAVender.value = event.precio.toFixed(2);
                };
            });
        };
        cantidAdAVender.value = "0";//reinicia la cantidad a comprar
        total_ventas.value = "00.00";//reinicia el monto a comprar
        saldo_existencias_almacen_ventas.style.background = ""
        total_ventas.style.background = ""
        saldo_existencias_almacen_ventas.value > 0 ? cantidAdAVender.select() : "";
    };
};


//////PASAR DATOS DE FORMULARIO A LISTA DE PRODUCTOS///////////////////////////

document.getElementById("restablecerFormVentas").addEventListener("click", () => {
    resetFormularioVentas();
    resetDetalleVentas();
    buscador_codigo.focus();
});
function crearBodyVentas (existencias, cantidad, precio_venta, talla){
    let sucursal_col = suc_db.find(x=> x.id_sucursales === Number(sucursal_ventas));// buscamos el nombre de la sucursal "sucursal_col.sucursal_nombre"

    let tablaVentas= document.querySelector("#tabla-ventas > tbody");
    let nuevaFilaTablaVentas = tablaVentas.insertRow(-1);
    let fila = `<tr>`+
                    `<td class="id_proforma invisible">${id_ventas.value}</td>`+// Columna 0 > id
                    `<td class="invisible">${sucursal_ventas}</td>`+// Columna 1 > sucursal
                    `<td style="border-left: 7px solid ${CS(sucursal_col.sucursal_nombre)};">${codigo_ventas.value}</td>`+// Columna 2 > código
                    `<td>${descripcion_ventas.value}</td>`+// Columna 3 > descripción
                    `<td>${talla}</td>`+// Columna 4 > talla
                    `<td class="invisible">${existencias}</td>`+// Columna 5 > existencias
                    `<td class="contenedor_mas_menos">
                        
                        <p class="resta_cantidad button_mas_menos" onclick="decrementarCantidad(this)">-</p>
                        <input class="cantidad_venta input_mas_menos" type="text" disabled value=${cantidad}>
                        <p class="suma_cantidad button_mas_menos" onclick="incrementarCantidad(this)">+</p>
                        
                    </td>`+// Columna 6 > cantidad a vender
                    `<td style="text-align: right">${precio_venta.toFixed(2)}</td>`+// Columna 7 > Precio de venta
                    `<td style="text-align: right">${(cantidad * precio_venta).toFixed(2)}</td>`+// Columna 8 > Total venta
                    `<td class="invisible">${Number(existencias) - Number(cantidad)}</td>`+// Columna 9 > saldo de existencias en sucursal origen
                    `<td class="invisible">${document.getElementById('txtIdv').value}</td>`+// Columna 10 > cliente

                    `<td style="text-align: center">
                        <div class="tooltip">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila" onClick="clicEnEliminarFila(this)">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </div>
                        </td>`+// Columna 11 > botón eliminar fila
                `</tr>`
    nuevaFilaTablaVentas.innerHTML = fila;
};

function clicEnEliminarFila(e) {
    const fila = e.closest("tr");
    array_saldos.forEach((event, i)=>{//Buscamos una coincidencia de id
        if(event.idProd === Number(fila.children[0].textContent)){
            array_saldos.splice(i, 1);
        }
    });
    fila.remove();
    formularioMetodoDePago.reset();
    buscador_codigo.focus();
    totalesTabla();
};

function ventaDetallada_dos(e){
    e.preventDefault();
    if (id_ventas.value != "" && cantidAdAVender.value > 0 &&
    (Number(existencias_almacen_ventas.value) -
    Number(cantidAdAVender.value)) >= 0){
        if(Number(precioAdAVender.value) < Number(costo_unitario_ventas.value)){
            modal_proceso_abrir(`El precio de venta de ${codigo_ventas.value}, es menor a su costo de compra. 
                                Si desea corregir el precio de venta elimine el producto de la 
                                lista de productos y vuelva a ingresar.`, "")
                                modal_proceso_salir_botones_focus("cantidad-vendida-ventas");
        }
        agregarAListaProductos(cantidAdAVender.value, precioAdAVender.value);//agrega nueva fila

        resetFormularioVentas();
        resetDetalleVentas();
        resetMetodoPago();
        totalesTabla();
        precioAdAVender.style.background = ""
        buscador_codigo.focus();
    }else if((Number(existencias_almacen_ventas.value) -
    Number(cantidAdAVender.value)) < 0){//// BLOQUEA EL ENVIO A LA TABLA SI LA CANTIDAD COMPRADA ES MAYOR A LA CANTIDAD EN STOCK//////////
 
        modal_proceso_abrir("Cantidad a vender mayor a existencias.", "")
        modal_proceso_salir_botones_focus("cantidad-vendida-ventas")
        cantidAdAVender.value = "0"
        saldo_existencias_almacen_ventas.value = existencias_almacen_ventas.value
        saldo_existencias_almacen_ventas.style.background = ""
        total_ventas.value = "00.00"
    }else if(cantidAdAVender.value == 0 || cantidAdAVender.value == ""){
        modal_proceso_abrir("Digite una cantidad a vender válida.", "")
        modal_proceso_salir_botones_focus("cantidad-vendida-ventas")
    };
}; 
function totalesTabla(){
    let sumaTotalCantidadVendida = 0;
    let sumaTotalVenta = 0;
    let numeroFilasTablaVentas = document.querySelector("#tabla-ventas > tbody").rows.length;
    for(let i = 0; i < numeroFilasTablaVentas; i++){
        sumaTotalVenta += Number(document.querySelector("#tabla-ventas > tbody").children[i].children[8].innerHTML)
        sumaTotalCantidadVendida += Number(document.querySelector("#tabla-ventas > tbody").children[i].children[6].children[1].value) 
    }
    document.getElementById("total-importe-tabla-ventas").textContent = sumaTotalVenta.toFixed(2);
    document.getElementById("total-cantidad-tabla-ventas").textContent = sumaTotalCantidadVendida;
    document.querySelector("#radio-efectivo").checked = true;
    document.getElementById("efectivo-ventas").value = Number(document.getElementById("total-importe-tabla-ventas").textContent).toFixed(2);
};

//////////////////////////////////////////////////////////////////////////////////////////////
function modosVenta(){
    // Escuchar la tecla Enter en toda la página
    document.getElementById("formulario-ventas").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();  // Evitar cualquier comportamiento predeterminado de Enter
            if (document.activeElement === buscador_codigo) {// Verificar si el buscador_codigo está enfocado
                ventaRapida();
            }else if (document.activeElement === ventaDetalladaBtn) {// Verificar si el botón ventaDetalladaBtn está enfocado
                ventaDetallada_uno();
            };
        };
    });
    ventaDetalladaBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        ventaDetallada_uno();
    } );
    document.getElementById("agregarATablaVentas").addEventListener("click", ventaDetallada_dos);
}

let procesarVenta = document.getElementById("procesar-venta");
procesarVenta.addEventListener("click", procesamientoVentas);
async function procesamientoVentas(e){
    e.preventDefault();
    try{
        if(document.getElementById("total-metodo-pago-ventas").value == 0 && 
        document.querySelector("#tabla-ventas > tbody").rows.length > 0 &&
        input_tipo_comprobante.value !== "Proforma"){
            modal_proceso_abrir("Procesando la venta!!!.", "")

            await funcionGeneralVentas();
            
            array_saldos = [];
            resetClientes();
            resetTablaVentas();
            resetMetodoPago();

        }else if(document.querySelector("#tabla-ventas > tbody").rows.length === 0){
            modal_proceso_abrir("Imposible procesar, la lista está vacía.", "")
            modal_proceso_salir_botones_focus("buscador-productos-ventas")
        }else if(input_tipo_comprobante.value === "Proforma"){
            NuevaVentanaComprobanteDePago("")
        };
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. " + error, "");
        console.error("Ocurrió un error. ", error)
    };
};
async function realizarCredito(sucursal_ventas, numeracion_comprobante_venta){
    let credito = {
        "sucursal_cre": sucursal_ventas,
        "tipo_comprobante": numeracion_comprobante_venta,
        "tasa": Number(document.getElementById("credito-tasa").value),
        "saldo_monto": Number(document.getElementById("credito-ventas").value),
        "saldo_interes": Number(document.getElementById("credito-interes").textContent),
        "saldo_total": Number(document.getElementById("credito-ventas").value) + Number(document.getElementById("credito-interes").textContent),
        "fecha_cre": generarFecha()
    };

    let urlCredito = URL_API_almacen_central + 'aperturar_creditos'
    let response_credito = Number(credito.saldo_monto) > 0 ? await funcionFetch(urlCredito, credito) : "";
    if(response_credito.status === 200){
        modal_proceso_abrir("Venta procesada!!!.", `Crédito aperturado`)
    };
};
async function funcionGeneralVentas(){
    let array_productos = [];
    let array_salidas = [];
    let suc__ = document.getElementById("fffff-sucursal").value;
    function DatosProductos(a){
        this.idProd = a.idProd;
        this.existencias_ac = -a.existencias_ac;
        this.existencias_su = -a.existencias_su;
        this.existencias_sd = -a.existencias_sd;
        this.existencias_st = -a.existencias_st;
        this.existencias_sc = -a.existencias_sc;
    };
    function DatosSalidas(a, sucursal, i){
        this.idProd = a.idProd;
        this.sucursal = sucursal;
        this.existencias_salidas = a[sucursales_activas[i]];
        this.precio_venta_salidas = a.precio;
    };
    array_saldos.forEach((event)=>{
        array_productos.push(new DatosProductos(event))
        suc_add.forEach((e, i)=>{
            let sucursal_ = suc_db.find(x=> x.sucursal_nombre === e);
            if(sucursal_){
                event[sucursales_activas[i]] > 0 ? array_salidas.push(new DatosSalidas(event, sucursal_.id_sucursales, i)): "";
            };
        });
    });
    function DatosDeVenta(){
        this.id_num = neg_db[0].id;
        
        this.sucursal_v = suc__;
        this.item_ticket = input_tipo_comprobante.value;
        this.modo_efectivo = Number(document.getElementById("efectivo-ventas").value);
        this.modo_credito = Number(document.getElementById("credito-ventas").value);
        this.modo_tarjeta = Number(document.getElementById("tarjeta-ventas").value);
        this.modo_perdida = 0;
        this.canal_venta = document.getElementById("modo_pago_ventas").checked;
        this.dni_cliente = document.getElementById('txtIdv').value != "" ? 
                            document.getElementById('txtIdv').value : 
                            cli_db[0].id_cli;
        this.fecha = generarFecha();
        this.situacion = this.modo_credito > 0 ? "pendiente" : "liquidado";

        this.array_productos = array_productos;
        this.array_salidas = array_salidas;
    };

    let url_venta = URL_API_almacen_central + 'gestion_de_venta'
    let objeto_venta = new DatosDeVenta();

    let response = await funcionFetchDos(url_venta, objeto_venta);
    if(response.status === "success"){
        await realizarCredito(suc__, response.message[1]);

        if(document.querySelector("#check_comprobante").checked){
            NuevaVentanaComprobanteDePago(response.message[0], response.message[1])//comprobante
        };
        
        modal_proceso_abrir(`La venta ${response.message[1]} fue procesada satisfactoriamente!!!.`, ``)
        modal_proceso_salir_botones_focus("buscador-productos-ventas")
    }else{
        modal_proceso_abrir(`${response.message}`, ``)
        modal_proceso_salir_botones_focus("buscador-productos-ventas")
    };
};
//////////////////////método de pago///////////////////////////////////////////////////////////////////////////////////////////
function removeAtributoMetodoDePago(){
    document.getElementById("efectivo-ventas").removeAttribute("disabled")
    document.getElementById("tarjeta-ventas").removeAttribute("disabled")
    document.getElementById("credito-ventas").removeAttribute("disabled")
}
function setAtributoMetodoDePago(){
    document.getElementById("efectivo-ventas").setAttribute("disabled", "true")
    document.getElementById("tarjeta-ventas").setAttribute("disabled", "true")
    document.getElementById("credito-ventas").setAttribute("disabled", "true")
}
function inputVacioMetodoPago(){
    document.getElementById("efectivo-ventas").value = ""
    document.getElementById("tarjeta-ventas").value = ""
    document.getElementById("credito-ventas").value = ""
    document.getElementById("total-metodo-pago-ventas").value = ""
    document.getElementById("total-metodo-pago-ventas").style.background = ""
}
function calculoModoCredito(monto_credito){
    document.getElementById("credito-interes").textContent =    Number(monto_credito) > 0 ? 
                                                                Number(document.getElementById("credito-tasa").value / 100 * monto_credito).toFixed(2) :
                                                                "";
    document.getElementById("credito-total").textContent =  Number(monto_credito) > 0 ? 
                                                            (Number(monto_credito) + Number(document.getElementById("credito-interes").textContent)).toFixed(2) :
                                                            "";
    document.getElementById("credito-tasa").value = Number(monto_credito) > 0 ? 
                                                    document.getElementById("credito-tasa").value :
                                                    "";
                                                        
}
function modoCredito(elemento){
    document.getElementById("credito-tasa").value = ""
    document.getElementById("credito-interes").textContent = ""
    document.getElementById("credito-total").textContent = ""
    Number(document.getElementById("credito-ventas").value) > 0 ?   document.querySelector(".cuadro_credito ").classList.remove("invisible"):
                                                                    document.querySelector(".cuadro_credito ").classList.add("invisible");
    if(elemento.value == "credito" || elemento.value == "combinado"){
        document.getElementById("credito-total").textContent = Number(document.getElementById("credito-ventas").value).toFixed(2)
        document.getElementById("credito-tasa").addEventListener("keyup", ()=>{
            let monto_credito = document.getElementById("credito-ventas").value
            calculoModoCredito(monto_credito)
        })
    }
}
function modoCombinado(elemento){
    if(elemento.value == "combinado"){
        removeAtributoMetodoDePago()
        let input_total = document.getElementById("total-metodo-pago-ventas")
        const operacionEfectivo = document.getElementById("efectivo-ventas");
        operacionEfectivo.addEventListener("keyup", (event) =>{
            event.target.parentNode.parentNode.children[3].children[1].value =  (Number(document.getElementById("total-importe-tabla-ventas").textContent) - 
                                                                                (Number(event.target.value) + Number(event.target.parentNode.parentNode.children[1].children[1].value) +
                                                                                Number(event.target.parentNode.parentNode.children[2].children[1].value ))).toFixed(2)
            input_total.value === "0.00" ? input_total.style.background = "var(--boton-tres)" : input_total.style.background = "var(--fondo-marca-uno)";
        });
        const operacionTarjeta = document.getElementById("tarjeta-ventas");
        operacionTarjeta.addEventListener("keyup", (event) =>{
            event.target.parentNode.parentNode.children[3].children[1].value =  (Number(document.getElementById("total-importe-tabla-ventas").textContent) - 
                                                                                (Number(event.target.value) + Number(event.target.parentNode.parentNode.children[0].children[1].value) +
                                                                                Number(event.target.parentNode.parentNode.children[2].children[1].value))).toFixed(2)
            input_total.value === "0.00" ? input_total.style.background = "var(--boton-tres)" : input_total.style.background = "var(--fondo-marca-uno)";    
        });
        const operacionCred = document.getElementById("credito-ventas");
        operacionCred.addEventListener("keyup", (event) =>{
            Number(document.getElementById("credito-ventas").value) > 0 ?   document.querySelector(".cuadro_credito ").classList.remove("invisible"):
                                                                            document.querySelector(".cuadro_credito ").classList.add("invisible");
            event.target.parentNode.parentNode.children[3].children[1].value =  (Number(document.getElementById("total-importe-tabla-ventas").textContent) - 
                                                                                (Number(event.target.value) + Number(event.target.parentNode.parentNode.children[0].children[1].value) +
                                                                                Number(event.target.parentNode.parentNode.children[1].children[1].value ))).toFixed(2)
            calculoModoCredito(event.target.value)
            input_total.value === "0.00" ? input_total.style.background = "var(--boton-tres)" : input_total.style.background = "var(--fondo-marca-uno)";
        });
    }
}
const inputRadioMetodoPago = document.querySelectorAll(".inputRadioVentas");
let metodos_ = ["efectivo", "tarjeta", "credito", "combinado"]
inputRadioMetodoPago.forEach((radioVentas, i) =>{
    radioVentas.addEventListener("click", (event) =>{
        if(event.target.value == metodos_[i]){
            setAtributoMetodoDePago()
            inputVacioMetodoPago()
            event.target.parentNode.parentNode.children[1].value = Number(document.getElementById("total-importe-tabla-ventas").textContent).toFixed(2)
            modoCredito(event.target)
            modoCombinado(event.target)
        };
    });
});

const removerTablaVentas = document.getElementById("remover-tabla-ventas");
removerTablaVentas.addEventListener("click", () =>{
    const filas = document.querySelectorAll(".eliminar_fila");
    array_saldos = [];//Eliminamos todos los datos
    filas.forEach((event)=>{
        event.parentNode.parentNode.parentNode.remove()
        totalesTabla()
    })
    buscador_codigo.focus()
});
///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////GENERAR TICKET/////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
function NuevaVentanaComprobanteDePago(nro_venta, ticket_venta) {
    let nombre_cliente = document.getElementById("clientesv").value;
    let bodyTicket = document.querySelector("#tabla-ventas > tbody");
    let importe_venta = 0;
    let nuevaVentana;
    let comprobantes = ["Nota de venta", "Boleta de venta", "Factura"]
    let tipo_comprobante = ""
    comprobantes.forEach((event)=>{
        if(event.startsWith(ticket_venta.charAt(0))){
            tipo_comprobante = event;
        }
    });
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
                            <p>Sede: ${select_sucursal.children[select_sucursal.selectedIndex].textContent}</p>
                            <h2 class="tipo_comprobante">${tipo_comprobante}</h2>
                            <br>
                            <h2>${ticket_venta}</h2>
                            <br>
                            <p>FECHA   : ${generarFecha()}</p>
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
    for (let i = 0; i < bodyTicket.rows.length; i++) {
        let producto = bodyTicket.children[i].children[3].textContent;
        let catidad = bodyTicket.children[i].children[6].children[1].value;
        let precio = Number(bodyTicket.children[i].children[7].textContent).toFixed(2);
        let importe = bodyTicket.children[i].children[8].textContent;
        contenidoHTML += `<tr>
                                <td>${producto}</td>
                                <td>${catidad}</td>
                                <td>${precio}</td>
                                <td>${importe}</td>
                            </tr>`;
        importe_venta += Number(bodyTicket.children[i].children[8].textContent);
    };
            contenidoHTML +=    `</tbody>
                                <tfoot>
                                    <tr class="clave">
                                        <th>OP. GRAVADAS</th>
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
                            <p>LADO: ORIGINAL   </p>
                                        <img class="codBarTicket" src="">
                            <br>
                            <p>ACUMULA Y CANJEA PUNTOS EN NUESTROS<p>
                            <p>CENTROS DE VENTA!!!<p>
                            <p>GRACIAS POR SU PREFERENCIA<p>
                            
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
                            if(document.querySelector(".tipo_comprobante").textContent === "Nota de venta"){
                                document.querySelectorAll(".clave").forEach((event)=>{
                                    event.classList.add("invisible")
                                });   
                            }
                            JsBarcode(".codBarTicket", "${nro_venta}", {
                                format: "CODE128",
                                displayValue: true
                            });
                            var options = {
                                filename: '${ticket_venta}.pdf',
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
    nuevaVentana = window.open('');
    nuevaVentana.document.write(contenidoHTML);
    document.querySelector("#check_comprobante").checked = false
};

//////////////////////////////////////////////////////////////////////
function cambioSucursal(){
    select_sucursal.addEventListener("click",()=>{
        if(document.querySelector("#tabla-ventas > tbody").children.length > 0){
            respuestaVenta = confirm('Hay datos en cola en la lista de productos, si cambia de sucursal se borrarán los datos, ¿Desea continuar?')
            if(respuestaVenta){
                document.getElementById("formulario-ventas").reset();
                resetTablaVentas()
                resetDetalleVentas()
                resetMetodoPago()
                array_saldos = [];
            };

        }else{
            select_sucursal.addEventListener("change", ()=>{
                document.getElementById("formulario-ventas").reset();
                id_ventas.value = "";
                resetDetalleVentas()
                buscador_codigo.focus()
                array_saldos = [];
            })
        };
        
    });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////Reporte de Ventas///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("reporte_ventas_hoy").addEventListener("click", async ()=>{
    let reporte_ventas = await cargarDatos(`salidas_tabla_reporte?`+
                                        `comprobante_salidas=Venta&`+
                                        `fecha_inicio_salidas=${new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()}&`+
                                        `fecha_fin_salidas=${new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()}`)

    let reporteHTML = `
                    <style>
                        body{
                            display: grid;
                            align-items: center;
                            align-content: space-between;
                            justify-content: center;
                            gap: 20px;
                        }
                        td, th{
                            border: 1px solid black;
                        }
                        .titulo_resporte{
                            display: grid;
                            justify-items: center;
                        }
                    </style>
                    <div class="titulo_resporte">
                        <h2>Reporte de Ventas</h2>
                        <h2>${select_sucursal.children[select_sucursal.selectedIndex].textContent}</h2>
                        <h3>Fecha de reporte: ${new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()}</h3>
                    </div>
                    <table>
                            <thead>
                                <tr>
                                    <th scope="row" colspan="16"><h2>Detalle de operaciones</h2></th>
                                </tr>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Sucursal</th>
                                    <th>Código</th>
                                    <th>Descripción</th>
                                    <th>Comprobantes</th>
                                    <th>Unidades</th>
                                    <th>Monto</th>
                                </tr>
                            </thead>
                            <tbody>`
    for(sal of reporte_ventas){
        if(sal.sucursal_nombre == 
            select_sucursal.children[select_sucursal.selectedIndex].textContent){
            let fila = `
                        <tr>
                            <td>${sal.fecha}</td>
                            <td>${sal.sucursal_nombre}</td>
                            <td>${sal.codigo}</td>
                            <td>${sal.descripcion}</td>
                            <td>${sal.comprobante}</td>
                            <td style="text-align: end;">${sal.existencias_salidas}</td>
                            <td style="text-align: end;">${(sal.existencias_salidas * sal.precio_venta_salidas).toFixed(2)}</td>
                        </tr>`
            reporteHTML = reporteHTML + fila;
        };
    };                  
    reporteHTML += `
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th></th>
                                </tr>
                            </tfoot>
                        </table>
                        <div>
                            <button class="imprimir_reporte_ventas">Imprimir</button>
                        </div>
                        <script>
                                document.querySelector(".imprimir_reporte_ventas").addEventListener("click", (event) => {
                                event.preventDefault()
                                window.print()
                            });
                        </script>
                    `
    let nuevaVentana = window.open('');
    nuevaVentana.document.write(reporteHTML);
});

//////////////////////////////////////////////////////////////
function resetTablaVentas(){
    document.querySelector("#tabla-ventas > tbody").remove();
    document.querySelector("#tabla-ventas").createTBody();
    document.getElementById("total-importe-tabla-ventas").textContent = "";
    document.getElementById("total-cantidad-tabla-ventas").textContent = "";
}
function resetDetalleVentas(){
    cantidAdAVender.value = "0"
    saldo_existencias_almacen_ventas.value = ""
    precioAdAVender.value = "00.00"
    total_ventas.value = ""
}
function resetMetodoPago(){
    formularioMetodoDePago.reset();
    document.getElementById("total-metodo-pago-ventas").style.background = ""
    document.getElementById("credito-tasa").value = ""
    document.getElementById("credito-interes").textContent = ""
    document.getElementById("credito-total").textContent = ""
    document.querySelector(".cuadro_credito").classList.add("invisible")
}
function resetClientes(){
    document.getElementById("formularioClientesVentas").reset();
    document.getElementById('txtIdv').value = ""
}
function resetFormularioVentas(){
    id_ventas.value = "";
    existencias_almacen_ventas.value = "";
    talla_ventas.value = "";
    costo_unitario_ventas.value = "";
    precio_venta_formulario.value = "";
    input_sucursal.value = ""
    categoria_ventas.value = "0"
    codigo_ventas.value = ""
    descripcion_ventas.value = ""
    buscador_codigo.value = ""
}
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
function incrementarCantidad(p){
    let fila = p.closest("tr");
    if (Number(p.parentNode.children[1].value) < Number(fila.children[5].textContent)) {
        p.parentNode.children[1].value = Number(p.parentNode.children[1].value) + 1;
        fila.children[8].textContent = (Number(fila.children[7].textContent) * Number(p.parentNode.children[1].value)).toFixed(2);
        fila.children[9].textContent = Number(fila.children[9].textContent) - 1;
        calcularSaldos(fila.children[0].textContent, true, 1)
        resetMetodoPago()
        totalesTabla()
    }
};
function decrementarCantidad(p){
    let fila = p.closest("tr");
    if (Number(p.parentNode.children[1].value) > 0) {
        p.parentNode.children[1].value = Number(p.parentNode.children[1].value) - 1;
        fila.children[8].textContent = (Number(fila.children[7].textContent) * Number(p.parentNode.children[1].value)).toFixed(2);
        fila.children[9].textContent = Number(fila.children[9].textContent) + 1;
        calcularSaldos(fila.children[0].textContent, false, 1)
        resetMetodoPago()
        totalesTabla()
    };
};
function calcularSaldos(id, operacion, tabla_cantidad){
    let array_ = array_saldos.find(x=> x.idProd === Number(id))
    operacion === true ? array_.in_q_q(tabla_cantidad, idx_suc) : array_.in_q_q(-tabla_cantidad, idx_suc);
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function incrementarNumero(input, num){// si num > 0 el formato de la celda será en monedas "00.00"
    let celda = Number(input.closest("div").children[1].value) + 1;
    input.closest("div").children[1].value = celda;
    num > 0 ? variacionMonto(input.closest("div").children[1]): variacionCantidad(input.closest("div").children[1]);
};
function decrementarNumero(input, num){// si num > 0 el formato de la celda será en monedas "00.00"
    let celda = Number(input.closest("div").children[1].value) - 1;
    celda > 0 ? input.closest("div").children[1].value = celda: 
                input.closest("div").children[1].value = 0;
    num > 0 ? variacionMonto(input.closest("div").children[1]): variacionCantidad(input.closest("div").children[1]);
};
function variacionCantidad(input){
    if(Number(input.value) < 0 || isNaN(Number(input.value))){
        input.style.background = "var(--fondo-marca-uno)";
    }else{
        let _existencias = existencias_almacen_ventas.value;
        let suma = _existencias - input.value;
        saldo_existencias_almacen_ventas.value = suma;
        total_ventas.value = formatoMoneda(input.value * Number(precioAdAVender.value));
    
        saldo_existencias_almacen_ventas.style.background = ""                                            
        if(saldo_existencias_almacen_ventas.value < 0){
            saldo_existencias_almacen_ventas.style.background = "var(--fondo-marca-uno)"
        }
        input.style.background = "";
    };
};
function variacionMonto(input){
    if(Number(input.value) < 0 || isNaN(Number(input.value))){
        input.style.background = "var(--fondo-marca-uno)";
    }else{
        total_ventas.value = formatoMoneda(input.closest("div").children[1].value * Number(cantidAdAVender.value));
        precioAdAVender.style.background = "" 
    
        if(Number(input.closest("div").children[1].value) < Number(costo_unitario_ventas.value)){
            precioAdAVender.style.background = "var(--fondo-marca-uno)"
        }
        precioAdAVender.addEventListener("blur", () =>{
            precioAdAVender.value = formatoMoneda(precioAdAVender.value);
        });
        input.style.background = "";
    };
};
///////////////////OPERACION DE RESTA EN FORMULARIO VENTAS ///////////////////////////////////
cantidAdAVender.addEventListener("keyup", () =>{
    variacionCantidad(cantidAdAVender)
});
precioAdAVender.addEventListener("keyup", () =>{
    variacionMonto(precioAdAVender);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////


async function actualizarSaldos(){//Esto se usa cuando el producto ya está en la lista de productos y no cuenta con stock suficiente
    modal_proceso_abrir("Inspeccionando stock.", "")
    const id_rev = document.querySelectorAll(".id_proforma");
    let ids = Array.from(id_rev).map(element => element.textContent);// buscamos todos los códigos (id) de la tabla

    let response = await cargarDatos(   `almacen_central_datos?`+
                                        `sucursal_get=${sucursales_activas[idx_suc]}&`+
                                        `ids=${ids.join(",")}`);

    for(id_v of id_rev){
        let row_ = id_v.closest("tr");

        let fila_array = response.find(x=> x.idProd === Number(row_.children[0].textContent))// Hacemos coincidir los id para actualizar las existencias coherentemente
        if(fila_array){
            row_.children[5].textContent = fila_array.sucursal_get;
            fila_array.sucursal_get < Number(row_.children[6].children[1].value) ? row_.children[6].children[1].value = 0: "";
        };
        row_.children[8].textContent = Number(row_.children[6].children[1].value * row_.children[7].textContent).toFixed(2);
        row_.children[9].textContent = Number(row_.children[5].textContent) - Number(row_.children[6].children[1].value);
        if(row_.children[9].textContent < 0){// Se comprueba que el saldo de existencias no sea menor a cero

            row_.style.background = "var(--boton-dos)"
            row_.children[6].children[1].value = 0;
            row_.children[8].textContent = Number(row_.children[6].children[1].value * row_.children[7].textContent).toFixed(2);
            row_.children[9].textContent = Number(row_.children[5].textContent) - Number(row_.children[6].children[1].value);

            modal_proceso_abrir(`El producto "${row_.children[3].textContent}" con código ${row_.children[2].textContent} `+
            `no cuenta con suficiente stock para realizar la venta. Se rectificó la cantidad a vender a cero. Cuando haya regularizado los saldos `+`
            vuelva a presionar el boton "Actualizar saldos".`, "");
            modal_proceso_salir_botones_focus("buscador-productos-ventas");
        };
        array_saldos.forEach((e)=>{// Se agrega al array_saldos
            if(id_v.textContent == e.idProd){
                e.sucursal_get = Number(fila_array.sucursal_get);
                e.cantidad_venta = Number(row_.children[6].children[1].value);
            }
        });
    }; 
    resetMetodoPago();
    totalesTabla();
};
document.getElementById("actualizar_saldos").addEventListener("click", recalcularSaldos)
async function recalcularSaldos(e){
    e.preventDefault();
    if(document.getElementById("tabla-ventas").children[1].children.length > 0){
        await actualizarSaldos();
        modal_proceso_salir_botones_focus("buscador-productos-ventas");
    }
};
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("boton_buscar_codigo").addEventListener("click", ()=>{
    busquedaDetalle(0, document.getElementById("buscador_descripcion").value)
    document.getElementById("buscador_descripcion").select()
});
document.getElementById("boton_buscar_descripcion").addEventListener("click", ()=>{
    busquedaDetalle(1, document.getElementById("buscador_descripcion").value)
    document.getElementById("buscador_descripcion").select()
});
document.getElementById("boton_borrar_").addEventListener("click", ()=>{
    let miUl_cabecera = document.getElementById("lista_cabecera");
    let miUl_detalle = document.getElementById("lista_detalle");
    miUl_cabecera.innerHTML = "";
    miUl_detalle.innerHTML = "";
    document.getElementById("categoria_buscador_detalle").value = "0";
    document.getElementById("buscador_descripcion").value = ""
    document.getElementById("buscador_descripcion").select()
});
function agregarBusquedaDetalleUno(button){
    resetFormularioVentas();
    resetDetalleVentas();
    let linea = button.closest("li");

    id_ventas.value = linea.children[0].textContent;
    sucursal_ventas = select_sucursal.value;
    if(usu_db.puesto_usuario == obtenerIndiceSucursal("#fffff-sucursal")){
        idx_suc = obtenerIndiceSucursal("#fffff-sucursal");
    }else{
        idx_suc = obtenerIndiceSucursal("#fffff-sucursal");
    };
    input_sucursal.value = document.querySelector("#fffff-sucursal").children[idx_suc].textContent
    categoria_ventas.value = Number(linea.children[1].textContent); 
    buscador_codigo.value = linea.children[2].textContent;
    codigo_ventas.value = linea.children[2].textContent;
    descripcion_ventas.value = linea.children[3].textContent;
    buscador_codigo.focus()
};
////////////////////////////////////////////////////////////////////////////////////////
function busquedaDetalle(indice, termino){
    // Obtén la referencia al elemento <ul>
    let miUl_cabecera = document.getElementById("lista_cabecera");
    let miUl_detalle = document.getElementById("lista_detalle");
    let terminoBusqueda = termino;
    let nuevoLi = "";
    let cabecera =  `<li class="diseno_li">`+
                        `<span style="width: 80px;"><h3>Código</h3></span> `+
                        `<span style="width: 80px;"><h3>Descripción</h3></span> `+
                        `<span style="width: 80px;"><h3>Mandar a formulario</h3></span>`+
                    `</li>`;
    
    for (let event of inv_db){
        let parametro = [event.codigo, event.descripcion, ""]
        if (parametro[indice].toLowerCase().includes(terminoBusqueda.toLowerCase()) && terminoBusqueda !== "" &&
        (Number(document.getElementById("categoria_buscador_detalle").value) === event.categoria ||
        document.getElementById("categoria_buscador_detalle").value === "0")){
            // Crea un nuevo elemento <li> con contenido
            nuevoLi += `<li class="diseno_li">`+
                                `<span class="invisible id_detalle">${event.idProd}</span> `+
                                `<span class="invisible categoria_detalle">${event.categoria}</span> `+
                                `<span class="codigo_detalle">${event.codigo}</span> `+
                                `<span class="descripcion_detalle">${event.descripcion}</span> `+
                                `<button style="cursor:pointer;" onclick="agregarBusquedaDetalleUno(this)">Usar</button>`+
                            `</li>`;
        };
    };
    
    if(nuevoLi !== ""){
        miUl_cabecera.innerHTML = cabecera;
        miUl_detalle.innerHTML = nuevoLi;
    }else{
        miUl_cabecera.innerHTML = `<span>No se encontraron coincidencias.</span>`;
        miUl_detalle.innerHTML = "";
    }
};