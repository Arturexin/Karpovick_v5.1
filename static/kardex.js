document.addEventListener("DOMContentLoaded", inicioKardex)
let anio_principal = ""
function inicioKardex(){
    anio_principal = new Date().getFullYear()
    btnKardex = 1;
    cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))
    cambioSucursalKardex("fffff-sucursal")
    llenarCategoriaProductosEjecucion("#categoria-detalle-movimientos")
    cargarDatosAnio()
};
let ventasMensuales = [];

let kardex_salidas = [];
let kardex_entradas = [];
let kardex_transferencias = [];
let kardex_perdidas = [];
let kardex_salidas_categoria = [];
let kardex_salidas_sucursal= [];
let costoKardex = 0;
///////////////////////////////////////////////////////////////////////////////////
const barras_venta = [".cg_1_c", ".cg_2_c", ".cg_3_c", ".cg_4_c", ".cg_5_c"]
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", ()=>{
        anio_principal = anio_referencia.value;
        procesarKardex();
    })
};
async function cargarGraficos(){
    reinicioBarraGrafico(barras_venta);//Reinicia gráfico Ventas Mensuales
    anio_principal = anio_referencia.value;
    ventasMensuales = await cargarDatos(`suma_ventas_por_mes_kardex/${document.getElementById("id_producto").value}?`+
                                        `salidas_sucursal=${document.getElementById("fffff-sucursal").value}&`+     
                                        `year_actual=${anio_principal}`)
                                        
    kardex_salidas_categoria = await cargarDatos(`salidas_categoria_kardex/${document.getElementById("categoria-detalle-movimientos").value}?`+
                                                `sucursal_salidas=${document.getElementById("fffff-sucursal").value}&`+     
                                                `year_actual=${anio_principal}`)
    kardex_salidas_sucursal = await cargarDatos(`salidas_sucursal_kardex/${document.getElementById("fffff-sucursal").value}?`+    
                                                `year_actual=${anio_principal}`)
    
    analisisProducto()
    modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
    modal_proceso_salir_botones()
}
///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////DETALLE DE MOVIMIENTOS////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let sucursal_kardex = 0;
let indice_sucursal_kardex = 0;
function reseteoFormulario(){
    document.getElementById("id_producto").value = "";
    document.getElementById('categoria-detalle-movimientos').value = "0";
    document.getElementById('codigo-detalle-movimientos').value = "";
    document.getElementById('descripcion-detalle-movimientos').value = "";
    document.getElementById("costo-unitario-detalle-movimientos").value = "";
};
document.addEventListener("keyup", () => {
    indice_base = JSON.parse(localStorage.getItem("base_datos_consulta"))
    let almacenCentral = indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-productos-detalle-movimientos').value.toLocaleLowerCase()))
    if(almacenCentral){
        document.getElementById("id_producto").value = almacenCentral.idProd
        sucursal_kardex = document.getElementById("fffff-sucursal").value
        indice_sucursal_kardex = document.getElementById("fffff-sucursal").selectedIndex

        document.getElementById("categoria-detalle-movimientos").value = almacenCentral.categoria
        document.getElementById("codigo-detalle-movimientos").value = almacenCentral.codigo
        document.getElementById("descripcion-detalle-movimientos").value = almacenCentral.descripcion
        document.getElementById("costo-unitario-detalle-movimientos").value = almacenCentral.costo_unitario
        if(document.getElementById('buscador-productos-detalle-movimientos').value == ""){
            reseteoFormulario()
        };
    }else{
        reseteoFormulario()
    };
});
function llenadoTablaDetalle(array, id_tabla, nombre_propiedad_objeto_valor){
    let suma_existencias = 0;
    let suma_monto = 0;
    let html = '';
    function comprobante(event, dato){
        return  `<tr>`+
                    `<td>${event.comprobante}</td>`+
                    `<td style="text-align:center;">${dato}</td>`+
                    `<td style="text-align:center;">${(Number(dato * event[nombre_propiedad_objeto_valor])).toFixed(2)}</td>`+
                    `<td>${event.fecha}</td>`+
                `</tr>`;
    }
    array.forEach((event) => {
        let dato = 0;
        if(document.querySelector(`#${id_tabla} > caption`).textContent === "Lista de Transferencias"){
            /* if(event.id_suc_origen === Number(document.getElementById("fffff-sucursal").value)){
                dato = -event.existencias;
                comprobante(event, dato);
            }else{
                dato = event.existencias;
                comprobante(event, dato);
            } */
            dato = event.existencias;
                comprobante(event, dato);
        }else if(event.comprobante.startsWith("Dev")){
            dato = -event.existencias_devueltas;
            comprobante(event, dato);
        }else{
            dato = event.existencias;
            comprobante(event, dato);
        };
        html = html + comprobante(event, dato);
        suma_existencias += dato;
        suma_monto += (dato * event[nombre_propiedad_objeto_valor]);
    });
    if(array.length > 0){
        document.querySelector("#costo-unitario-detalle-movimientos").value = array[0].costo_unitario
    }
    document.querySelector(`#${id_tabla} > tbody`).innerHTML = html;
    document.getElementById(`${id_tabla}`).children[2].children[0].children[1].textContent = suma_existencias;
    document.getElementById(`${id_tabla}`).children[2].children[0].children[2].textContent = `${suma_monto.toFixed(2)}`;
};
function llenarKardex(){
    let costo = Number(document.querySelector("#costo-unitario-detalle-movimientos").value)
    let html = `<tr>`+
                    `<td>${document.getElementById("codigo-detalle-movimientos").value}</td>`+
                    `<td>${document.getElementById("descripcion-detalle-movimientos").value}</td>`+
                    `<td style="text-align:center;">${costo.toFixed(2)}</td>`+
                    `<td style="text-align:center;">${document.getElementById("total-existencias-detalle-entradas").textContent}</td>`+
                    `<td style="text-align:center;">${(document.getElementById("total-existencias-detalle-entradas").textContent * costo).toFixed(2)}</td>`+
                    `<td style="text-align:center;">-${document.getElementById("total-existencias-detalle-salidas").textContent}</td>`+
                    `<td style="text-align:center;">-${(document.getElementById("total-existencias-detalle-salidas").textContent * costo).toFixed(2)}</td>`+
                    `<td style="text-align:center;">${document.getElementById("total-existencias-detalle-transferencias").textContent}</td>`+
                    `<td style="text-align:center;">${(document.getElementById("total-existencias-detalle-transferencias").textContent * costo).toFixed(2)}</td>`+
                    `<td style="text-align:center;">-${document.getElementById("total-existencias-detalle-perdidas").textContent}</td>`+
                    `<td style="text-align:center;">-${(document.getElementById("total-existencias-detalle-perdidas").textContent * costo).toFixed(2)}</td>`+
                    `<td style="text-align:center; background: var(--boton-dos)">${Number(document.getElementById("total-existencias-detalle-entradas").textContent) - 
                                                    Number(document.getElementById("total-existencias-detalle-salidas").textContent) + 
                                                    Number(document.getElementById("total-existencias-detalle-transferencias").textContent) - 
                                                    Number(document.getElementById("total-existencias-detalle-perdidas").textContent)}
                    </td>`+
                    `<td style="text-align:center; background: var(--boton-dos)">${((Number(document.getElementById("total-existencias-detalle-entradas").textContent) - 
                                                    Number(document.getElementById("total-existencias-detalle-salidas").textContent) + 
                                                    Number(document.getElementById("total-existencias-detalle-transferencias").textContent) - 
                                                    Number(document.getElementById("total-existencias-detalle-perdidas").textContent)) *
                                                    costo).toFixed(2)}
                    </td>`+
                `</tr>`;
    document.querySelector(`#tabla-consolidado-kardex > tbody`).innerHTML = html;
};

const mandarATablaDetalle = document.getElementById("agregar-detalle-movimientos");
mandarATablaDetalle.addEventListener("click", (e) =>{
    e.preventDefault();
    procesarKardex();
});
async function procesarKardex(){
    if(document.querySelector("#codigo-detalle-movimientos").value !== ""){
        anio_principal = anio_referencia.value;
        removerTablas()
        kardex_entradas = await cargarDatos(`entradas_codigo_kardex/${document.getElementById("id_producto").value}?`+
                                            `entradas_sucursal=${document.getElementById("fffff-sucursal").value}&`+
                                            `year_actual=${anio_principal}`)
        kardex_salidas = await cargarDatos(`salidas_codigo_kardex/${document.getElementById("id_producto").value}?`+
                                            `salidas_sucursal=${document.getElementById("fffff-sucursal").value}&`+
                                            `year_actual=${anio_principal}`)
        kardex_perdidas = await cargarDatos(`perdidas_codigo_kardex/${document.getElementById("id_producto").value}?`+
                                            `perdidas_sucursal=${document.getElementById("fffff-sucursal").value}&`+
                                            `year_actual=${anio_principal}`)
        kardex_transferencias = await cargarDatos(`transfrencias_codigo_kardex/${document.getElementById("id_producto").value}?`+
                                            `transferencias_sucursal=${indice_sucursal_kardex}&`+
                                            `year_actual=${anio_principal}`)
        cargarGraficos()
        
        llenadoTablaDetalle(kardex_entradas, "tabla-detalle-movimientos-entradas", "costo_unitario");
        llenadoTablaDetalle(kardex_salidas, "tabla-detalle-movimientos-salidas", "costo_unitario");
        llenadoTablaDetalle(kardex_perdidas, "tabla-detalle-movimientos-perdidas", "costo_unitario");
        llenadoTablaDetalle(kardex_transferencias, "tabla-detalle-movimientos-transferencias", "costo_unitario");
        llenarKardex();
    };
}
const reiniciarTablas = document.getElementById("reiniciar-tablas");
reiniciarTablas.addEventListener("click", () =>{
    formularioDetalleMovimientos.reset();
    reinicarKardex()
    borrarAnalisis()
});
const reiniciarForm = document.getElementById("reset_form");
reiniciarForm.addEventListener("click", () =>{
    formularioDetalleMovimientos.reset();
    reinicarKardex()
    borrarAnalisis()
});
function reinicarKardex(){
    removerTablas()
    document.getElementById("total-existencias-detalle-entradas").textContent = "";
    document.getElementById("total-importe-detalle-entradas").textContent = "";
    document.getElementById("total-existencias-detalle-salidas").textContent = "";
    document.getElementById("total-importe-detalle-salidas").textContent = "";
    document.getElementById("total-existencias-detalle-perdidas").textContent = "";
    document.getElementById("total-importe-detalle-perdidas").textContent = "";
    document.getElementById("total-existencias-detalle-transferencias").textContent = "";
    document.getElementById("total-importe-detalle-transferencias").textContent = "";
    document.getElementById("id_producto").value = "";
};
function cambioSucursalKardex(id){
    document.getElementById(id).addEventListener("change", ()=>{
        document.getElementById("buscador-productos-detalle-movimientos").value = ""
        document.getElementById("categoria-detalle-movimientos").value = ""
        document.getElementById("codigo-detalle-movimientos").value = ""
        document.getElementById("descripcion-detalle-movimientos").value = ""
        document.getElementById("costo-unitario-detalle-movimientos").value = ""
        document.getElementById("id_producto").value = "";
        document.getElementById("buscador-productos-detalle-movimientos").focus();
        reinicarKardex();
        borrarAnalisis()
    });
};
function removerTablas(){
    document.querySelector("#tabla-detalle-movimientos-entradas > tbody").remove();
    document.querySelector("#tabla-detalle-movimientos-entradas").createTBody();
    document.querySelector("#tabla-detalle-movimientos-salidas > tbody").remove();
    document.querySelector("#tabla-detalle-movimientos-salidas").createTBody();
    document.querySelector("#tabla-detalle-movimientos-perdidas > tbody").remove();
    document.querySelector("#tabla-detalle-movimientos-perdidas").createTBody();
    document.querySelector("#tabla-detalle-movimientos-transferencias > tbody").remove();
    document.querySelector("#tabla-detalle-movimientos-transferencias").createTBody();
    document.querySelector("#tabla-consolidado-kardex > tbody").remove();
    document.querySelector("#tabla-consolidado-kardex").createTBody();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////ANÁLISIS DE PRODUCTO//////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function analisisProducto(){
    let suma_costos_salidas = 0;
    let suma_ventas = 0;
    let suma_ventas_esperado = 0;
    let num_ventas = 0;
    let array_ventas_total = [];
    let array_costos_total = [];
    let masAlto = 0;
    let mes_alto = 0;
    let masBajo = Infinity;
    let mes_bajo = 0;
    let suma_mensual_ventas = 0
    let venta_salidas_categoria = 0;
    let conteo_ventas_categoria = 0;
    let venta_salidas_sucursal = 0;
    let conteo_ventas_sucursal = 0;


    document.querySelectorAll(".f_l_g").forEach((event, i)=>{
        event.textContent = `${meses_letras[i]}${anio_principal % 100}`;
    });

    for(let i = 0; i < 12; i++){
        array_ventas_total.push(0);
        array_costos_total.push(0);
        ventasMensuales.forEach((event)=>{
            
            if(event.mes == i + 1){
                suma_mensual_ventas += event.suma_ventas
                array_ventas_total[i] = event.suma_ventas;
                array_costos_total[i] = event.suma_costos;
            };
        });
    };
    for(let i = 0; i < array_ventas_total.length; i++){
        if(masAlto < array_ventas_total[i]){// Encontramos el valor mas alto de array_ventas_total[i]
            masAlto = array_ventas_total[i]
            mes_alto = i + 1;
        };
        if(array_ventas_total[i] > 0 && masBajo >= array_ventas_total[i]){// Encontramos el valor mas bajo de array_ventas_total[i]
            masBajo = array_ventas_total[i]
            mes_bajo = i + 1;
        };
    };

    document.getElementById("menor_venta").textContent = `${moneda()} ${(masBajo).toFixed(2)}`
    document.getElementById("mayor_venta").textContent = `${moneda()} ${(masAlto).toFixed(2)}`
    document.getElementById("promedio_venta").textContent = `${moneda()} ${(suma_mensual_ventas/ventasMensuales.length).toFixed(2)}`
    document.querySelector(".mes_max").textContent = `${meses_letras[mes_alto - 1]}-${anio_referencia.value}`
    document.querySelector(".mes_min").textContent = `${meses_letras[mes_bajo - 1]}-${anio_referencia.value}`
    let masAltoDos = (226 * masAlto)/214;
    document.querySelectorAll(".eje_y_numeracion").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos -= 0.20 * ((226 * masAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_1_c"), array_ventas_total, masAlto, colorFondoBarra[0], document.querySelectorAll(".sg_1_c"), 8, moneda())
    pintarGraficoPositivo(document.querySelectorAll(".cg_2_c"), array_costos_total, masAlto, colorFondoBarra[3], document.querySelectorAll(".sg_2_c"), 8, moneda())

    kardex_salidas.forEach((event)=>{
        if(event.comprobante.startsWith("Venta") && new Date(event.fecha).getFullYear() == anio_referencia.value){
            suma_costos_salidas += event.costo_unitario * (event.existencias - event.existencias_devueltas);
            suma_ventas += event.precio_venta_salidas * (event.existencias - event.existencias_devueltas);
            suma_ventas_esperado += event.precio_venta * (event.existencias - event.existencias_devueltas);
            num_ventas +=1;
        }
    });
    //////////////////////////////////////////////////////////////////////////////////
    if(kardex_salidas_categoria.length > 0){
        kardex_salidas_categoria.forEach((event)=>{
            venta_salidas_categoria += event.suma_ventas;
            conteo_ventas_categoria += event.conteo;
        });
    }
//////////////////////////////////////////////////////////////////////////////////
    if(kardex_salidas_sucursal.length > 0){
        kardex_salidas_sucursal.forEach((event)=>{
            venta_salidas_sucursal += event.suma_ventas;
            conteo_ventas_sucursal += event.conteo;
        });
    }
    document.getElementById("kardex_margen").textContent = `${((1 - (suma_costos_salidas/suma_ventas)) * 100).toFixed(2)}%`
    document.getElementById("kardex_margen_esperado").textContent = `${((1 - (suma_costos_salidas/suma_ventas_esperado)) * 100).toFixed(2)}%`
    document.getElementById("kardex_num").textContent = `${num_ventas}  =>`
    document.getElementById("kardex_venta").textContent = `${moneda()} ${suma_ventas.toFixed(2)}  =>`
    document.getElementById("kardex_num_categoria").textContent = `${((num_ventas/conteo_ventas_categoria)*100).toFixed(2)}%`
    document.getElementById("kardex_venta_categoria").textContent = `${((suma_ventas/venta_salidas_categoria)*100).toFixed(2)}%`
    document.getElementById("kardex_num_sucursal").textContent = `${((num_ventas/conteo_ventas_sucursal)*100).toFixed(2)}%`
    document.getElementById("kardex_venta_sucursal").textContent = `${((suma_ventas/venta_salidas_sucursal)*100).toFixed(2)}%`
}
function borrarAnalisis(){
    document.getElementById("kardex_margen").textContent = ""
    document.getElementById("kardex_margen_esperado").textContent = ""
    document.getElementById("kardex_num").textContent = ""
    document.getElementById("kardex_venta").textContent = ""

    document.getElementById("kardex_num_categoria").textContent = ""
    document.getElementById("kardex_venta_categoria").textContent = ""
};