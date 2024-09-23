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
const tabla = document.getElementById("filtro_tabla")
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
    
    let fila_t =[e.q_ac,e.q_su,e.q_sd,e.q_st]
    let fila_s=[e.existencias_salidas, e.existencias_devueltas, e.precio_venta_salidas, e.existencias_salidas + e.existencias_devueltas + e.precio_venta_salidas]
    let tit_t = ["Uni. AC", "Unid. SU", "Unid. SD", "Unid. ST"]
    let tit_s = ["Salidas de existencias","Devolución de salidas","Precio de venta","Total venta"]
    document.querySelectorAll(".tit_").forEach((event, i)=>{
        if(tabla.value > 0){
            event.textContent = tit_t[i]
        }else{
            event.textContent = tit_s[i]
        }
    });
    return  `<tr class="busqueda-salidas">
                <td class="invisible">${tabla.value > 0 ? e.id_tran : e.idSal}</td>
                <td>${tabla.value > 0 ? "" :e.sucursal_nombre}</td>
                <td>${e.categoria_nombre}</td>
                <td>${e.codigo}</td>
                <td style="text-align: end;">${tabla.value > 0 ? fila_t[0] : fila_s[0]}</td>
                <td style="text-align: end;">${tabla.value > 0 ? fila_t[1] : fila_s[1]}</td>
                <td style="text-align: end;">${tabla.value > 0 ? fila_t[2] : fila_s[2]}</td>
                <td style="text-align: end;">${tabla.value > 0 ? fila_t[3] : fila_s[3]}</td>
                <td>${e.comprobante}</td>
                <td>${tabla.value > 0 ? e.fecha_tran : e.fecha}</td>
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
async function accionRemove(id) {
    let salidas = base_datos.array.find(y => y.idSal == id)// obtenemos los datos de la fila
    let db = JSON.parse(localStorage.getItem("base_datos_consulta"))
    let producto = db.find(x=> x.codigo === salidas.codigo)

    tabla_proforma_productos(producto, "Eliminar salida", salidas.categoria_nombre, salidas.comprobante);

    let contenedor_tab = document.querySelector("#contenedor_tabla_producto");
    contenedor_tab.children[0].remove();
    
    contenedorBotonesProducto(`procesarRemove(${salidas.idSal})`, "Eliminar salida")
    document.getElementById("acciones_rapidas_salidas").classList.add("modal-show-salida")
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

function accionDevoluciones(id) {
    let salidas = base_datos.array.find(x => x.idSal == id)
    console.log(salidas)
    let db = JSON.parse(localStorage.getItem("base_datos_consulta"))
    let sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_encabezado"))
    if(salidas.comprobante.startsWith("Venta")){
        let producto = db.find(x=> x.codigo === salidas.codigo)
        tabla_proforma_productos(producto, "Devoluciones", salidas.categoria_nombre, salidas.comprobante)
        sucursales_comparacion.forEach((e, i) =>{
            if(salidas.sucursal_nombre == e.sucursal_nombre){
                sucursal_id_salidas = e.id_sucursales
                tabla_body_productos(salidas, i, sucursal_id_salidas)
            }
        });
        contenedorBotonesProducto(`procesarDevolucion()`, "Procesar Devolución")
        document.getElementById("acciones_rapidas_salidas").classList.add("modal-show-salida")
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
                    `<td style="text-align: center; width: 90px" class="s_dev">${prod_.existencias_salidas}</td>` + // Saldo
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
    document.getElementById("acciones_rapidas_salidas").classList.remove("modal-show-salida")
};
function op_dev(e){
    let row_ = e.closest("tr");
    row_.children[6].textContent = Number(row_.children[3].textContent) - Number(row_.children[5].children[0].value )
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
    let valores = Array.from(inputs).map(input => Number(input.value));
    if (valores.every(valor => valor >= 0 && Number.isFinite(valor)) && valores.some(valor => valor > 0)){
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
    };
};
async function realizarDevolucion(){
    let det_venta = await cargarDatos(`ventas_comprobante/${document.querySelector(".dev_oper").textContent}`)
    let array_devolucion = [];
    function DatosDevolucionSalidas(a){
        this.idProd = document.getElementById("id_prod").textContent;
        this.sucursal_post = sucursales_activas[a.children[9].textContent];
        this.existencias_post = Number(a.children[5].children[0].value);

        this.idSal = a.children[0].textContent;

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
    document.getElementById("acciones_rapidas_salidas").classList.remove("modal-show-salida")
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