////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////SALIDAS////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", inicioSalidas)
let anio_principal = ""
function inicioSalidas(){
    anio_principal = new Date().getFullYear()
    cargarDatosAnio()
    datosInicio()
    inicioTablasSalidas()
    btnSalidasP = 1;
};
const barras_compras = [".cg_1_c", ".cg_2_c", ".cg_3_c", ".cg_4_c", ".cg_5_c"]
const url_array_conteo = ["salidas_conteo", "transferencias_conteo_s"]
const url_array_tabla = ["salidas_tabla", "transferencias_tabla_s"]
let url_conteo = url_array_conteo[Number(document.getElementById("filtro_tabla").value)]
let url_tabla = url_array_tabla[Number(document.getElementById("filtro_tabla").value)]
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
async function datosInicio(){
    cincoCategorias = await cargarDatos('salidas_top_cinco_categorias_sucursal?'+
                                    `year_actual=${anio_principal}`)
    cincoCodigos = await cargarDatos('salidas_top_cinco_codigos_sucursal?'+
                                    `year_actual=${anio_principal}`)
}
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        reinicioBarraGrafico(barras_compras);
        removerMarcaBoton()
        anio_principal = anio_referencia.value;

        if(document.querySelector(".contenedor_ranking")){
            document.querySelector(".contenedor_ranking").classList.remove("alta_opacidad")
        }

        cincoCategorias = await cargarDatos('salidas_top_cinco_categorias_sucursal?'+
                                        `year_actual=${anio_principal}`)
        cincoCodigos = await cargarDatos('salidas_top_cinco_codigos_sucursal?'+
                                        `year_actual=${anio_principal}`)

        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
let filas_total_bd = {value: 0};
let indice_tabla = {value : 1};
let num_filas_tabla = {value: 0};
let inicio = 0;
let fin = 0;
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
document.getElementById("filtro_tabla").addEventListener("change", ()=>{
    url_conteo = url_array_conteo[Number(document.getElementById("filtro_tabla").value)]
    url_tabla = url_array_tabla[Number(document.getElementById("filtro_tabla").value)]
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
                <td>${e.sucursal_nombre}</td>
                <td>${e.categoria_nombre}</td>
                <td>${e.codigo}</td>
                <td style="text-align: end;">${e.existencias_salidas}</td>
                <td style="text-align: end;">${e.existencias_devueltas}</td>
                <td style="text-align: end;">${e.precio_venta_salidas.toFixed(2)}</td>
                <td style="text-align: end;">${((e.existencias_salidas - e.existencias_devueltas) * e.precio_venta_salidas).toFixed(2)}</td>
                <td>${e.comprobante}</td>
                <td>${e.fecha}</td>
                <td style="text-align: center;width: 80px">
                    <div class="tooltip">
                        <span onclick="editSalidas(${e.idSal})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">assignment_return</span>
                        <span class="tooltiptext">Devolver</span>
                    </div>
                    <div class="tooltip">
                        <span onclick="removeSalidas(${e.idSal})" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila">delete</span>
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
    document.getElementById("filtro-tabla-salidas-fecha-inicio").value = ""
    document.getElementById("filtro-tabla-salidas-fecha-fin").value = ""
};
function manejoDeFechas(){
    inicio = document.getElementById("filtro-tabla-salidas-fecha-inicio").value;
    fin = document.getElementById("filtro-tabla-salidas-fecha-fin").value;
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
async function removeSalidas(id) {
    respuestaAlmacen = confirm(`Eliminar esta fila podría generar conflictos en el stock de este producto, `+
                                `¿Desea continuar?.`)
    if (respuestaAlmacen) {
        let url = URL_API_almacen_central + `salidas/${id}`
            await fetch(url, {
            "method": 'DELETE',
            "headers": {
                "Content-Type": 'application/json'
                }
            })
        await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                            document.getElementById("numeracionTablaSalidas"), 20)
        await searchDatos(subRutaB(num_filas_tabla.value, 1), base_datos,"#tabla-salidas")
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let sucursal_id_salidas = 0;
let salidas_Id = "";
let producto_Id_salidas = "";
let indice_sucursal_salidas = 0;
function editSalidas(id) {
    let salidas = base_datos.array.find(x => x.idSal == id)
    let sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_encabezado"))
    if(salidas.comprobante.startsWith("Venta")){
        accionDevolucionSalidas();
        sucursales_comparacion.forEach((e) =>{
            if(salidas.sucursal_nombre == e.sucursal_nombre){
                sucursal_id_salidas = e.id_sucursales
            }
        });
        document.getElementById('accion_id_salidas').value = salidas.idSal
        document.getElementById('accion_comprobante_salidas').value = salidas.comprobante
        document.getElementById('accion_sucursal_salidas').value = salidas.sucursal_nombre
        document.getElementById('accion_codigo').textContent = "Devolución: " + salidas.codigo;
        document.getElementById('accion_existencias_salidas').value = salidas.existencias_salidas
        document.getElementById('accion_existencias_devueltas_salidas').value = salidas.existencias_devueltas
        document.getElementById('accion_precio_venta_salidas').value = salidas.precio_venta_salidas
        cargarDatosSalidasId(salidas.idSal)
        document.getElementById("accion_editar_salidas").focus()
        document.getElementById("acciones_rapidas_salidas").classList.add("modal-show-salida")
    }else{
        modal_proceso_abrir("No es una venta.", "")
        modal_proceso_salir_botones()
    };
    
};
function accionDevolucionSalidas(){
    let formularioDevolucionesSalidas = `
                                        <div id="form_accion_rapida_salidas" class="nuevo-contenedor-box">
                                            <form action="" class="formulario-general fondo">
                                                <h2 id="accion_codigo"></h2>
                                                <input id="accion_id_salidas" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_id_productos" class="input-general fondo invisible" type="text" disabled>
                                                <label class="label-general">Comprobante<input id="accion_comprobante_salidas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Sucursal de Origen<input id="accion_sucursal_salidas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades Adquiridas<input id="accion_existencias_salidas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades Devueltas<input id="accion_existencias_devueltas_salidas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Existencias en Stock<input id="accion_existencias_productos_salidas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades a Devolver<input id="accion_editar_salidas" class="input-general-importante fondo-importante" type="text"></label>
                                                <label class="label-general">Saldo en Devoluciones<input id="accion_saldo_devolucion_salidas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Saldo en Productos<input id="accion_saldo_productos_salidas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Causa de Devolución
                                                    <select id="accion_causa_devolucion_salidas" class="input-general-importante fondo-importante">
                                                        <option value = "1">Producto defectuoso</option>
                                                        <option value = "2">Producto dañado durante el envío</option>
                                                        <option value = "3">Producto incorrecto o equivocado</option>
                                                        <option value = "4">Talla o ajuste incorrecto</option>
                                                        <option value = "5">Insatisfacción con el producto</option>
                                                        <option value = "6">Cambio por otro producto</option>
                                                        <option value = "7">Cancelación del pedido</option>
                                                        <option value = "8">Entrega retrasada</option>
                                                    </select>
                                                </label>
                                                <input id="accion_existencias_ac_productos" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_su_productos" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_sd_productos" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_st_productos" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_precio_venta_salidas" class="input-general fondo invisible" type="text" disabled>
                                                <button id="accion_procesar_devolucion_salidas" class="myButtonAgregar">Procesar Devolución</button>
                                                <button id="remover_accion_rapida_salidas" class="myButtonEliminar">Cancelar</button>
                                            </form>
                                        </div>
                                        `;
    document.getElementById("acciones_rapidas_salidas").innerHTML = formularioDevolucionesSalidas;
    removerAccionRapidaSalidas()
    let editar = document.getElementById("accion_editar_salidas");
    editar.addEventListener("keyup", (event)=>{
        document.getElementById("accion_saldo_devolucion_salidas").value = Number(event.target.value) + Number(document.getElementById("accion_existencias_devueltas_salidas").value)
        document.getElementById("accion_saldo_productos_salidas").value = Number(document.getElementById("accion_existencias_productos_salidas").value) + Number(event.target.value)
    });
    const procesarDevolucionesSalidasUno = document.getElementById("accion_procesar_devolucion_salidas");
    procesarDevolucionesSalidasUno.addEventListener("click", procesamientoSalidasDevoluciones)
};
async function cargarDatosSalidasId(id){
    salidas_Id = await cargarDatos(`salidas/${id}`)
    cargarDatosProductosIdSalidas(salidas_Id.idProd)
};
async function cargarDatosProductosIdSalidas(id){
    let sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_encabezado"))
    producto_Id_salidas = await cargarDatos(`almacen_central/${id}`)
    let array_uso = [producto_Id_salidas.existencias_ac, producto_Id_salidas.existencias_su, producto_Id_salidas.existencias_sd, producto_Id_salidas.existencias_st]
    array_uso.forEach((event, i)=>{
        if(sucursales_comparacion[i] &&
        document.getElementById('accion_sucursal_salidas').value === sucursales_comparacion[i].sucursal_nombre){
            indice_sucursal_salidas = i
            document.getElementById('accion_existencias_productos_salidas').value = event
        }
    })
    document.getElementById('accion_id_productos').value = producto_Id_salidas.idProd
    document.getElementById('accion_existencias_ac_productos').value = producto_Id_salidas.existencias_ac
    document.getElementById('accion_existencias_su_productos').value = producto_Id_salidas.existencias_su
    document.getElementById('accion_existencias_sd_productos').value = producto_Id_salidas.existencias_sd
    document.getElementById('accion_existencias_st_productos').value = producto_Id_salidas.existencias_st
    
}
function removerAccionRapidaSalidas(){
    let remover = document.getElementById("remover_accion_rapida_salidas");
    remover.addEventListener("click", (e)=>{
        e.preventDefault();
        document.getElementById("form_accion_rapida_salidas").remove()
        document.getElementById("acciones_rapidas_salidas").classList.remove("modal-show-salida")
    });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function procesamientoSalidasDevoluciones(e){
    e.preventDefault();
    manejoDeFechas()
    if(Number(document.getElementById("accion_editar_salidas").value) > 0 && 
    (Number(document.getElementById("accion_existencias_salidas").value) >= Number(document.getElementById("accion_saldo_devolucion_salidas").value))){
        try{
            modal_proceso_abrir("Procesando la devolución de la venta!!!.", "")
            await realizarDevolucionSalidasSalidas()
            await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, 
                    document.getElementById("numeracionTablaSalidas"), 20)
            await searchDatos(subRutaB((document.getElementById("numeracionTablaSalidas").value - 1) * 20, 1), 
                            base_datos,"#tabla-salidas")
        }catch(error){
            modal_proceso_abrir("Ocurrió un error. " + error, "")
            console.error("Ocurrió un error. ", error)
            modal_proceso_salir_botones()
        };
    }else if(Number(document.getElementById("accion_editar_salidas").value) <= 0){
        modal_proceso_abrir("Las unidades a devolver deben ser mayores a cero.", "")
        modal_proceso_salir_botones()
    }else if(Number(document.getElementById("accion_existencias_salidas").value) < Number(document.getElementById("accion_saldo_devolucion_salidas").value)){
        modal_proceso_abrir("Las unidades a devolver no deben ser mayores a las unidades en existencia.", "")
        modal_proceso_salir_botones()
    };
    
};
async function realizarDevolucionSalidasSalidas(){
    function DatosDeDevolucionSalidasSalidas(){
        this.idProd = document.getElementById("accion_id_productos").value;
        this.sucursal_post = sucursales_activas[indice_sucursal_salidas];
        this.existencias_post = document.getElementById("accion_saldo_productos_salidas").value;

        this.idSal = document.getElementById('accion_id_salidas').value;
        this.existencias_salidas_update = document.getElementById('accion_existencias_salidas').value;
        this.existencias_devueltas_update = document.getElementById("accion_saldo_devolucion_salidas").value;

        this.comprobante = "Dev-" + document.getElementById("accion_comprobante_salidas").value;
        this.causa_devolucion = document.getElementById("accion_causa_devolucion_salidas").value;
        this.precio_venta_salidas = document.getElementById("accion_precio_venta_salidas").value;
        this.sucursal = sucursal_id_salidas;
        this.existencias_devueltas_insert = document.getElementById("accion_editar_salidas").value;
        this.fecha = generarFecha();
    };
    let filaProducto = new DatosDeDevolucionSalidasSalidas();
    let url = URL_API_almacen_central + 'procesar_devolucion_salidas'
    let response = await funcionFetch(url, filaProducto)
    console.log("Respuesta Productos "+response.status)
    if(response.status === 200){
        modal_proceso_abrir("Procesando la devolución de la venta!!!.", "Devolución ejecutada.")
        console.log(`Devolución ejecutada.`)
        await obteniendoDatosDeVentaUno()
    }else{
        modal_proceso_abrir(`Ocurrió un problema en la devolución`, "")
        modal_proceso_salir_botones()
    };

};
async function obteniendoDatosDeVentaUno(){
    let comprobacionIdDetalleVentas = 0;
    let modoEfectivo = 0;
    let modoTarjeta = 0;
    let modoECredito = 0;
    let modoPerdidaS = 0;
    detVentasComprobante = await cargarDatos(`ventas_comprobante/${document.getElementById("accion_comprobante_salidas").value}`)
    detVentasComprobante.forEach((event) =>{
            comprobacionIdDetalleVentas = event.id_det_ventas;
            modoEfectivo = event.modo_efectivo
            modoTarjeta = event.modo_tarjeta
            modoECredito = event.modo_credito
            modoPerdidaS = event.modo_perdida
    });
    
    modoPerdidaS = modoPerdidaS + (Number(document.getElementById("accion_editar_salidas").value) * 
                    Number(document.getElementById("accion_precio_venta_salidas").value))
    let metodoPago = {
        "id_det_ventas": comprobacionIdDetalleVentas,
        "modo_efectivo": Number(modoEfectivo),
        "modo_credito": Number(modoECredito),
        "modo_tarjeta": Number(modoTarjeta),
        "modo_perdida": Number(modoPerdidaS),
        "total_venta": (Number(modoEfectivo) + Number(modoTarjeta) + Number(modoECredito)) - Number(modoPerdidaS)
    };
    let urlMetodoDePago = URL_API_almacen_central + 'ventas'
    let response = await funcionFetch(urlMetodoDePago, metodoPago);
    console.log("Respuesta Obtención datos "+response.status)
    if(response.status === 200){
        modal_proceso_abrir("Procesando la devolución de la venta!!!.", `Detalle de venta ejecutado.`)
        console.log(`Detalle de venta ejecutado.`)
        await funcionAccionGastosVariosS()
    }else{
        modal_proceso_abrir(`Ocurrió un problema en detalle de venta.`, "")
        modal_proceso_salir_botones()
    };
};
async function funcionAccionGastosVariosS(){
    let dataGastosVarios = {
        "sucursal_gastos": sucursal_id_salidas,
        "concepto": "Devolución",
        "comprobante": document.getElementById("accion_comprobante_salidas").value,
        "monto": Number(document.getElementById("accion_editar_salidas").value) * 
                Number(document.getElementById("accion_precio_venta_salidas").value),  
        "caja_bancos": 0,
        "credito_gastos": 0,
        "fecha_gastos": generarFecha()
    };
    let urlGastosVarios = URL_API_almacen_central + 'gastos_varios'
    let response = await funcionFetch(urlGastosVarios, dataGastosVarios)
    console.log("Respuesta Gastos "+response.status)
    if(response.status === 200){
        modal_proceso_abrir("Operación completada exitosamente.", "")
        console.log(`Gastos varios ejecutado.`)
        modal_proceso_salir_botones()
        document.getElementById("acciones_rapidas_salidas").classList.remove("modal-show-salida")
    }else{
        modal_proceso_abrir(`Ocurrió un problema en gastos varios.`, "")
        modal_proceso_salir_botones()
    };
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////GRÁFICOS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function GraficoRankingCategoria(numSucural, colorRanking, columnaRanking, fechaRanking){
    
    let categoria_datos = [];
    let categoria_nombres = [];
    let array_datos = [];
    let array_nombres = [];
    let alto = 0;
    let coloresRanking = ["#E6CA7B","#91E69C","#428499","#6380E6","#E66E8D"]
    
    document.querySelectorAll(colorRanking).forEach((event, i)=>{
        event.style.width = "20px"
        event.style.height = "10px"
        event.style.background = coloresRanking[i]
    });
    for(let i = 0; i < 12; i++){
        let conteo = 0;
        array_datos = [0,0,0,0,0]
        array_nombres = ["","","","",""]
        categoria_datos.push(0)
        categoria_nombres.push(0)
        cincoCategorias.forEach((event, j)=>{
            if(event.mes == i + 1 && event.sucursal == numSucural && conteo < 5){
                array_datos[conteo] = event.suma_ventas;
                array_nombres[conteo] = event.categoria_nombre;
                conteo +=1;
            };
        });
        categoria_datos[i]=array_datos
        categoria_nombres[i]=array_nombres
        categoria_datos.forEach((event)=>{
            let suma = 0;
            event.forEach((e)=>{
                suma +=e
            });
            if(alto < suma){
                alto = suma
            };
            
        });
        array_datos = []
        array_nombres = []
    };
    rankingColumna(categoria_datos, categoria_nombres, alto, columnaRanking, fechaRanking, arregloMeses, coloresRanking)
};
function GraficoRankingCodigo(numSucural, colorRanking, columnaRanking, fechaRanking){
    
    let codigo_datos = [];
    let codigo_nombres = [];
    let array_datos = [];
    let array_nombres = [];
    let alto = 0;
    let coloresRanking = ["#E6CA7B","#91E69C","#428499","#6380E6","#E66E8D"]
    
    document.querySelectorAll(colorRanking).forEach((event, i)=>{
        event.style.width = "20px"
        event.style.height = "10px"
        event.style.background = coloresRanking[i]
    });
    for(let i = 0; i < 12; i++){
        let conteo = 0;
        array_datos = [0,0,0,0,0]
        array_nombres = ["","","","",""]
        codigo_datos.push(0)
        codigo_nombres.push(0)
        cincoCodigos.forEach((event, j)=>{
            if(event.mes == i + 1 && event.sucursal == numSucural && conteo < 5){
                array_datos[conteo] = event.suma_ventas;
                array_nombres[conteo] = event.codigo;
                conteo +=1;
            };
        });
        codigo_datos[i]=array_datos
        codigo_nombres[i]=array_nombres
        codigo_datos.forEach((event)=>{
            let suma = 0;
            event.forEach((e)=>{
                suma +=e
            });
            if(alto < suma){
                alto = suma
            };
            
        });
        array_datos = []
        array_nombres = []
    };
    rankingColumna(codigo_datos, codigo_nombres, alto,columnaRanking, fechaRanking, arregloMeses, coloresRanking)
};

//////////////BOTONES//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.querySelectorAll(".b_g_s_r").forEach((event, i)=>{
    event.addEventListener("click", (e)=>{
        removerMarcaBoton()
        let valor_sucursal_principal = JSON.parse(localStorage.getItem("sucursal_encabezado"))
        if(i === 0 && valor_sucursal_principal[i]){
            componenteGraficoRankingSalidas("color_ranking_categoria_uno", "columna_ranking_categoria_uno", "ranking_fecha_categoria_uno", "color_ranking_codigo_uno", "columna_ranking_codigo_uno", "ranking_fecha_codigo_uno")
            document.querySelector(".contenedor_ranking").classList.add("alta_opacidad")
            event.classList.add("marcaBoton")
            GraficoRankingCategoria(valor_sucursal_principal[0].id_sucursales, ".color_ranking_categoria_uno", ".columna_ranking_categoria_uno", ".ranking_fecha_categoria_uno")
            GraficoRankingCodigo(valor_sucursal_principal[0].id_sucursales, ".color_ranking_codigo_uno", ".columna_ranking_codigo_uno", ".ranking_fecha_codigo_uno")
        }else if(i === 1 && valor_sucursal_principal[i]){
            componenteGraficoRankingSalidas("color_ranking_categoria_dos", "columna_ranking_categoria_dos", "ranking_fecha_categoria_dos", "color_ranking_codigo_dos", "columna_ranking_codigo_dos", "ranking_fecha_codigo_dos")
            document.querySelector(".contenedor_ranking").classList.add("alta_opacidad")
            event.classList.add("marcaBoton")
            GraficoRankingCategoria(valor_sucursal_principal[1].id_sucursales, ".color_ranking_categoria_dos", ".columna_ranking_categoria_dos", ".ranking_fecha_categoria_dos")
            GraficoRankingCodigo(valor_sucursal_principal[1].id_sucursales, ".color_ranking_codigo_dos", ".columna_ranking_codigo_dos", ".ranking_fecha_codigo_dos")
        }else if(i === 2 && valor_sucursal_principal[i]){
            componenteGraficoRankingSalidas("color_ranking_categoria_tres", "columna_ranking_categoria_tres", "ranking_fecha_categoria_tres", "color_ranking_codigo_tres", "columna_ranking_codigo_tres", "ranking_fecha_codigo_tres")
            document.querySelector(".contenedor_ranking").classList.add("alta_opacidad")
            event.classList.add("marcaBoton")
            GraficoRankingCategoria(valor_sucursal_principal[2].id_sucursales, ".color_ranking_categoria_tres", ".columna_ranking_categoria_tres", ".ranking_fecha_categoria_tres")
            GraficoRankingCodigo(valor_sucursal_principal[2].id_sucursales, ".color_ranking_codigo_tres", ".columna_ranking_codigo_tres", ".ranking_fecha_codigo_tres")
        }else if(i === 3 && valor_sucursal_principal[i]){
            componenteGraficoRankingSalidas("color_ranking_categoria_cuatro", "columna_ranking_categoria_cuatro", "ranking_fecha_categoria_cuatro", "color_ranking_codigo_cuatro", "columna_ranking_codigo_cuatro", "ranking_fecha_codigo_cuatro")
            document.querySelector(".contenedor_ranking").classList.add("alta_opacidad")
            event.classList.add("marcaBoton")
            GraficoRankingCategoria(valor_sucursal_principal[3].id_sucursales, ".color_ranking_categoria_cuatro", ".columna_ranking_categoria_cuatro", ".ranking_fecha_categoria_cuatro")
            GraficoRankingCodigo(valor_sucursal_principal[3].id_sucursales, ".color_ranking_codigo_cuatro", ".columna_ranking_codigo_cuatro", ".ranking_fecha_codigo_cuatro")
        };
    })
});
function removerMarcaBoton(){
    document.querySelectorAll(".b_g_s_r")[0].classList.remove("marcaBoton")
    document.querySelectorAll(".b_g_s_r")[1].classList.remove("marcaBoton")
    document.querySelectorAll(".b_g_s_r")[2].classList.remove("marcaBoton")
    document.querySelectorAll(".b_g_s_r")[3].classList.remove("marcaBoton")
}
function componenteGraficoRankingSalidas(leyenda_cat, columna_cat, fecha_cat, leyenda_cod, columna_cod, fecha_cod){
    let comp_graf_ran_sal = `<div class="contenedor_ranking baja_opacidad">
                                <div>
                                    <h4>Ranking cinco categorías con mayores ventas</h4>
                                    <div class="leyenda_ranking">
                                        <div><div class=${leyenda_cat}></div><span>1° Puesto</span></div>
                                        <div><div class=${leyenda_cat}></div><span>2° Puesto</span></div>
                                        <div><div class=${leyenda_cat}></div><span>3° Puesto</span></div>
                                        <div><div class=${leyenda_cat}></div><span>4° Puesto</span></div>
                                        <div><div class=${leyenda_cat}></div><span>5° Puesto</span></div>
                                    </div>
                                    <div class="grafico_ranking">
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                    </div>
                                </div>
                                <div>
                                    <h4>Ranking cinco productos con mayores ventas</h4>
                                    <div class="leyenda_ranking">
                                        <div><div class=${leyenda_cod}></div><span>1° Puesto</span></div>
                                        <div><div class=${leyenda_cod}></div><span>2° Puesto</span></div>
                                        <div><div class=${leyenda_cod}></div><span>3° Puesto</span></div>
                                        <div><div class=${leyenda_cod}></div><span>4° Puesto</span></div>
                                        <div><div class=${leyenda_cod}></div><span>5° Puesto</span></div>
                                    </div>
                                    <div class="grafico_ranking">
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                    </div>
                                </div>
                            </div>`;
    document.querySelector(".contenedor_graficos_sucursales").innerHTML = comp_graf_ran_sal;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////REPORTES////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("reporte_ventas").addEventListener("click", async ()=>{
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

    let reporteHTML = `<style>
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
                        </table>

                        <table id="tabla_salidas">
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
    for(sal of reporte_salidas){
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
    }                        
                            
    reporteHTML += `
                            </tbody>
                        </table>
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
    

    let nuevaVentana = window.open('');
    nuevaVentana.document.write(reporteHTML);
});
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////CSV////////////////////////////////////////////////////////////////////////////////////////////
///////Extraccion de datos en formato csv///////////////////////////////////////
let datos_extraccion = [];

let extraccion_ = document.getElementById("extraccion_")
extraccion_.addEventListener("click", async ()=>{
    let f_inicio = document.getElementById("filtro-tabla-salidas-fecha-inicio").value;
    let f_fin = document.getElementById("filtro-tabla-salidas-fecha-fin").value;
    f_inicio === "" ? f_inicio = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate() : "";
    f_fin === "" ? f_fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate() : "";

    datos_extraccion = await cargarDatos(   `salidas_extraccion?`+
                                            `fecha_inicio_salidas=${f_inicio}&`+
                                            `fecha_fin_salidas=${f_fin}`
                                        );
    
    const csvContent = arrayToCSV(datos_extraccion);
    console.log(csvContent)
    downloadCSV(csvContent, 'dataSalidas.csv');
});