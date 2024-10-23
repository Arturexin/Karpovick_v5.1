document.addEventListener("DOMContentLoaded", inicioKardex)
let anio_principal = ""
function inicioKardex(){
    anio_principal = new Date().getFullYear()
    btnKardex = 1;
    document.getElementById("form_contenedor").innerHTML = formUpdate('Kardex')
    document.querySelector(".baja_opacidad_interior").classList.add("alta_opacidad_interior")
    document.getElementById("button_contenedor").innerHTML = formButton("Consultar", "procesarKardex()", "reseteoFormulario()")
    document.getElementById("categoria-form").innerHTML = llenarCategoriaProductosEjecucion();
    cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))
    cambioSucursalKardex("fffff-sucursal")
    buscarProducto(document.getElementById('buscador-productos-form'))
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
///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////DETALLE DE MOVIMIENTOS////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let sucursal_kardex = 0;
let indice_sucursal_kardex = 0;
function reseteoFormulario(){
    document.getElementById("id-form").value = "";
    document.getElementById('categoria-form').value = "0";
    document.getElementById('codigo-form').value = "";
    document.getElementById('descripcion-form').value = "";
};

async function procesarKardex(){
    if(document.querySelector("#codigo-form").value !== ""){
        anio_principal = anio_referencia.value;
        removerTablas()
        kardex_entradas = await cargarDatos(`entradas_codigo_kardex/${document.getElementById("id-form").value}?`+
                                            `entradas_sucursal=${document.getElementById("fffff-sucursal").value}&`+
                                            `year_actual=${anio_principal}`)
        kardex_salidas = await cargarDatos(`salidas_codigo_kardex/${document.getElementById("id-form").value}?`+
                                            `salidas_sucursal=${document.getElementById("fffff-sucursal").value}&`+
                                            `year_actual=${anio_principal}`)
        kardex_perdidas = await cargarDatos(`perdidas_codigo_kardex/${document.getElementById("id-form").value}?`+
                                            `perdidas_sucursal=${document.getElementById("fffff-sucursal").value}&`+
                                            `year_actual=${anio_principal}`)
        kardex_transferencias = await cargarDatos(`transfrencias_codigo_kardex/${document.getElementById("id-form").value}?`+
                                            `transferencias_sucursal=${document.getElementById("fffff-sucursal").value}&`+
                                            `year_actual=${anio_principal}`)
        graficoKardex()
        
        llenadoTablaDetalle(kardex_entradas, "tabla-detalle-movimientos-entradas", "costo_unitario");
        llenadoTablaDetalle(kardex_salidas, "tabla-detalle-movimientos-salidas", "costo_unitario");
        llenadoTablaDetalle(kardex_perdidas, "tabla-detalle-movimientos-perdidas", "costo_unitario");
        llenadoTablaDetalle(kardex_transferencias, "tabla-detalle-movimientos-transferencias", "costo_unitario");
        
        llenarKardex(kardex_entradas[0].costo_unitario);
    };
}
function llenadoTablaDetalle(array, id_tabla, nombre_propiedad_objeto_valor){
    let suma_existencias = 0;
    let suma_monto = 0;
    let html = '';
    function comprobante(event, dato){
        return  `<tr>`+
                    `<td>${event.comprobante}</td>`+
                    `<td style="text-align:center;">${dato}</td>`+
                    `<td style="text-align:center;">${(Number(dato * event[nombre_propiedad_objeto_valor])).toFixed(2)}</td>`+
                    `<td>${new Date(event.fecha).getDay()}-${new Date(event.fecha).getMonth()+1}-${new Date(event.fecha).getFullYear()}</td>`+
                `</tr>`;
    }
    array.forEach((event) => {
        let dato = 0;
        if(document.querySelector(`#${id_tabla} > caption`).textContent === "Lista de Transferencias"){
            if(event.id_suc_origen === Number(document.getElementById("fffff-sucursal").value)){
                dato = -event.existencias;
                comprobante(event, dato);
            }else{
                dato = event.existencias;
                comprobante(event, dato);
            };
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
    document.querySelector(`#${id_tabla} > tbody`).innerHTML = html;
    document.getElementById(`${id_tabla}`).children[2].children[0].children[1].textContent = suma_existencias;
    document.getElementById(`${id_tabla}`).children[2].children[0].children[2].textContent = `${suma_monto.toFixed(2)}`;
};
function llenarKardex(costo){
    let html = `<tr>`+
                    `<td>${document.getElementById("codigo-form").value}</td>`+
                    `<td>${document.getElementById("descripcion-form").value}</td>`+
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


const reiniciarTablas = document.getElementById("reiniciar-tablas");
reiniciarTablas.addEventListener("click", () =>{
    document.getElementById("formulario-compras-uno").reset();
    reinicarKardex()
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
    document.getElementById("id-form").value = "";
};
function cambioSucursalKardex(id){
    document.getElementById(id).addEventListener("change", ()=>{
        document.getElementById("buscador-productos-detalle-movimientos").value = ""
        document.getElementById("categoria-detalle-movimientos").value = ""
        document.getElementById("codigo-detalle-movimientos").value = ""
        document.getElementById("descripcion-detalle-movimientos").value = ""
        document.getElementById("costo-unitario-detalle-movimientos").value = ""
        document.getElementById("id-form").value = "";
        document.getElementById("buscador-productos-detalle-movimientos").focus();
        reinicarKardex();
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
function graficoKardex(){
    document.getElementById("contenedor_grafico_kardex").innerHTML = `<canvas id="grafico_kardex"></canvas>`
    let array_entradas = [];
    let array_salidas = [];
    let array_transferencias = [];
    let array_despacho = [];
    for(let i = 0; i < 12; i++){
        let suma_entradas = 0;
        let suma_salidas = 0;
        let suma_transferencias = 0;
        let suma_despacho = 0;
        kardex_entradas.forEach((event)=>{
            if(new Date(event.fecha).getMonth() === i && !event.comprobante.startsWith("D")){
                suma_entradas+=(event.existencias - event.existencias_devueltas);
            }
        });
        kardex_salidas.forEach((event)=>{
            if(new Date(event.fecha).getMonth() === i && !event.comprobante.startsWith("D")){
                suma_salidas-=(event.existencias - event.existencias_devueltas);
            }
        });
        kardex_perdidas.forEach((event)=>{
            if(new Date(event.fecha).getMonth() === i){
                suma_despacho-=event.existencias;
            }
        });
        kardex_transferencias.forEach((event)=>{
            if(new Date(event.fecha).getMonth() === i && event.id_suc_origen === Number(document.getElementById("fffff-sucursal").value)){
                suma_transferencias-=event.existencias;
            }else if(new Date(event.fecha).getMonth() === i && event.id_suc_origen !== Number(document.getElementById("fffff-sucursal").value)){
                suma_transferencias+=event.existencias;
            }
            console.log(suma_transferencias)
        });
        array_entradas.push(suma_entradas)
        array_salidas.push(suma_salidas)
        array_transferencias.push(suma_transferencias)
        array_despacho.push(suma_despacho)
    };
    graficoLineasVerticalUnid(  document.getElementById("grafico_kardex"), 
                                array_entradas, 
                                array_salidas, 
                                array_transferencias, 
                                array_despacho,
                                [],
                                mes_anio,
                                ['Entradas', 'Salidas', 'Transferencias', 'Despacho'])
};