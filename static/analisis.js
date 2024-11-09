document.addEventListener("DOMContentLoaded", inicioDevolucionSalidas)
let anio_principal = ""
function inicioDevolucionSalidas(){
    anio_principal = new Date().getFullYear()
    
    cargarDatosAnio()
    array_btn_pages[9] = 1;
};
let devolucionesComprobante = [];
let detVentasComprobante = [];
const barras_dev_salidas = [".cg_1_c", ".cg_2_c", ".cg_3_c", ".cg_4_c", ".cg_5_c"]
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        anio_principal = anio_referencia.value;
        document.getElementById("opciones_categorias").value = 0
        document.getElementById("opciones_codigos").value = 0
        document.getElementById("tit_monto").textContent = ""

        document.querySelector("#tabla_codigos_venta > tbody").remove()
        document.querySelector("#tabla_codigos_venta").createTBody()
        document.querySelector("#tabla_categorias_venta > tbody").remove()
        document.querySelector("#tabla_categorias_venta").createTBody()
        document.querySelectorAll(".total_mes_sucursal").forEach((event)=>{
            event.textContent = ""
        })
        document.querySelectorAll(".total_mes_categoria").forEach((event)=>{
            event.textContent = ""
        })
        
        quitarMarcaBoton()
        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};



let array_categorias = [];
let array_codigos = [];
let array_totales = [];
let array_unidades = [];
let array_ganancias = [];

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
class Objeto_analisis {
    constructor(categoria, categoria_nombre, sucursal, codigo) {
        this.categoria = categoria;
        this.categoria_nombre = categoria_nombre;
        this.sucursal = sucursal;
        this.codigo = codigo;
        this.suma_costos = Array(12).fill(0);
        this.suma_unidades = Array(12).fill(0);
        this.suma_veces = Array(12).fill(0);
        this.suma_ventas = Array(12).fill(0);
        this.suma_ganancias = Array(12).fill(0);
        this.suma_unidades_dev = Array(12).fill(0);
    }

    agregarDatos(mes, costos, unidades, veces, ventas, unidades_dev) {
        this.suma_costos[mes - 1] += costos;
        this.suma_unidades[mes - 1] += unidades;
        this.suma_veces[mes - 1] += veces;
        this.suma_ventas[mes - 1] += ventas;
        this.suma_ganancias[mes - 1] += (ventas - costos);
        this.suma_unidades_dev[mes - 1] += unidades_dev;
    }
}
let array_categorias_ = []
let array_productos_ = []
function crearArrayDatos(array_general, parametro){
    let categorias = {};
    array_general.forEach(item => {
        if (!categorias[item[parametro]]) {
            categorias[item[parametro]] = new Objeto_analisis(item.categoria, item.categoria_nombre, item.sucursal, item.codigo);
        }
        categorias[item[parametro]].agregarDatos(item.mes, item.suma_costos, item.suma_unidades, item.suma_veces, item.suma_ventas, item.suma_unidades_dev);
    });
    
    return Object.values(categorias);
}
function sumartoriaAbsoluta(dato, array_){
    let arr_tot = [];
    let mayor_absoluto = 0;
    let mayor_relativo = 0;
    for(let i = 0; i < 12; i++){
        let suma_ventas = 0;
        array_.forEach(cat => {
            suma_ventas += cat[dato][i];
            if(mayor_absoluto < cat[dato][i]){
                mayor_absoluto = cat[dato][i];
            }
        });
        arr_tot.push(suma_ventas);
    }
    for(let i = 0; i < 12; i++){
        array_.forEach(cat => {
            if(mayor_relativo < cat[dato][i]/arr_tot[i]){
                mayor_relativo = cat[dato][i]/arr_tot[i];
            }
        });
    }
    return [arr_tot, mayor_absoluto, mayor_relativo];
}

function colorFondo(mayor_absoluto, num) {
    if(num > 0){
        if (num <= mayor_absoluto * 0.20) {  // Determinamos el color de las celdas según su valor numérico
            return mapa_calor[4];
        } else if (num <= mayor_absoluto * 0.40) {
            return mapa_calor[3];
        } else if (num <= mayor_absoluto * 0.60) {
            return mapa_calor[2];
        } else if (num <= mayor_absoluto * 0.80) {
            return mapa_calor[1];
        } else if (num <= mayor_absoluto) {  // No es necesario multiplicar por 1
            return mapa_calor[0];
        }
    }
    return '';  // Por si acaso ninguno de los casos se cumple
}

function llenarBodyAbsoluto(nombre, array_, dato, moneda, mayor_absoluto) {
    let html = '';
    for (let categoria of array_) {
        let sum_cat = 0;
        let fila = `
                    <tr>
                        <td class="categoria_anual">${categoria[nombre]}</td>`;
        for (let i = 0; i < 12; i++) {
            sum_cat += categoria[dato][i];
            fila += `<td style="text-align: center; color: #eee;width: 80px;font-size: 13px; background: ${colorFondo(mayor_absoluto, categoria[dato][i])}">
                        ${moneda ? categoria[dato][i].toFixed(2) : categoria[dato][i]}
                    </td>`;
        }
        fila += `<td class="total_categoria" style="text-align: center; width: 80px;font-size: 13px;"><h4>${moneda ? sum_cat.toFixed(2): sum_cat}</h4></td>
                 <td style="text-align: center;width: 40px;">
                    <div class="tooltip">
                        <span onclick="busquedaCategoria(${categoria.sucursal}, ${categoria.categoria}, ${document.getElementById('anio_referencia').value})" 
                            style="font-size:18px;" class="material-symbols-outlined myButtonEditar">play_arrow
                        </span>
                        <span class="tooltiptext">Detalle por producto</span>
                    </div>
                 </td>
            </tr>`;
        html += fila;
    }
    return html
}
function llenarBodyRelativo(nombre, array_, dato, array_total, mayor_relativo){
    let html = ''
    for(categoria of array_){
        let sum_cat = 0;
        let sum_tot = 0;
        let fila = `
                <tr>
                    <td class="categoria_anual">${categoria[nombre]}</td>`
        for(let i = 0; i < 12; i++){
            sum_cat += categoria[dato][i]
            sum_tot += array_total[i]
            fila += `<td style="text-align: center;color: #eee;width: 80px;font-size: 13px; background: ${colorFondo(mayor_relativo, categoria[dato][i]/array_total[i])}">
                        ${array_total[i] !== 0 ? Math.round(categoria[dato][i]/array_total[i] * 100): 0}%
                    </td>`
        }
        fila +=     `<td class="total_categoria" style="text-align: center;width: 80px;font-size: 13px;"><h4>${Math.round(sum_cat/sum_tot * 100)}%</h4></td>
                    <td style="text-align: center;width: 40px;">
                        <div class="tooltip">
                            <span onclick="busquedaCategoria(${categoria.sucursal}, ${categoria.categoria}, ${document.getElementById("anio_referencia").value})" 
                                style="font-size:18px;" class="material-symbols-outlined myButtonEditar">play_arrow
                            </span>
                            <span class="tooltiptext">Detalle por producto</span>
                        </div>
                    </td>
                </tr>`
        html = html + fila;
    }; 
    return html
}
function llenarFooter(elemento, array, tipo){
    let suma = 0;
    elemento.forEach((event, i)=>{
        if(i < 12){
            suma += array[i];
            event.textContent = tipo ? `${array[i].toFixed(2)}` : array[i];
        }
    })
    elemento[12].textContent = tipo ? `${suma.toFixed(2)}` : suma;
}
function llenarFooterRelativo(elemento, array){
    elemento.forEach((event, i)=>{
        if(i < 12){
            event.textContent = array[i] !== 0 ? `100%` : `0%`;
        }
    })
    elemento[12].textContent = `100%`;
}
function evetoSelect(elemento, tabla_body, array_, nombre, nodeList){
    let options =   [ 
                        "", 
                        "suma_ventas", "suma_ventas", 
                        "suma_ganancias", "suma_ganancias", 
                        "suma_unidades", "suma_unidades", 
                        "suma_veces", "suma_veces", 
                        "suma_unidades_dev", "suma_unidades_dev"
                    ]
    elemento.addEventListener("change", (event)=>{
        for(let i = 0;i < 11; i++){
            if(Number(event.target.value) === i){
                if(i === 0){
                    tabla_body.children[2].remove()
                    tabla_body.createTBody()
                    let tot = Array(12).fill("");
                    llenarFooter(nodeList, tot, false)
                }else if(i % 2 !== 0){
                    let tipo = i > 4 ? false: true;
                    let tot = sumartoriaAbsoluta(options[i], array_)
                    tabla_body.children[2].innerHTML = llenarBodyAbsoluto(nombre, array_, options[i], tipo, tot[1])
                    llenarFooter(nodeList, tot[0], tipo)
                }else if(i % 2 === 0){
                    let tot = sumartoriaAbsoluta(options[i], array_)
                    tabla_body.children[2].innerHTML = llenarBodyRelativo(nombre, array_, options[i], tot[0], tot[2])
                    llenarFooterRelativo(nodeList, tot)
                }
            }
        }
    })
}
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
let conteo_ventas = []

function ticketPromedio(array_categorias_){
    let Array_anual = [];
    let mayor = 0;
    for(let i = 0; i < 12; i++){
        let suma = 0;
        let suma_venta = 0;
        array_categorias_.forEach((event)=>{
            suma_venta += event.suma_ventas[i];
            suma += event.suma_veces[i];
        });
        let media = suma_venta/suma > 0 > 0 ? suma_venta/suma : 0;
        Array_anual.push(media)
        if(mayor < media){
            mayor = media;
        }
    };
    let fila =  `<tr>`
    for(let i = 0; i < 12; i ++){
        fila +=     `<td style="text-align: center;width: 80px;font-size: 14px; background: ${colorFondo(mayor, Array_anual[i])}">${moneda()} ${Array_anual[i].toFixed(2)}</td>`
    }
    fila +=     `</tr>`
    document.querySelector("#tabla_ticket_promedio > tbody").outerHTML = fila;
};
////////////////////////////////////////////////////////////
async function busquedaSucursal(id_suc, anio){
    let response = await cargarDatos(   `salidas_categorias_sucursal?`+
                                        `sucursal_salidas=${id_suc}&`+
                                        `year_actual=${anio}`)
    await delay(500)
    if(response.status === "success"){
        return crearArrayDatos(response.datos, "categoria")
    }else{
        return []
    }
}
async function busquedaCategoria(id_suc, id_cat, anio){
    modal_proceso_abrir("Buscando resultados...", "", "")

    document.getElementById("tit_monto").textContent = "";

    document.querySelector("#tabla_codigos_venta > tbody").remove()
    document.querySelector("#tabla_codigos_venta").createTBody()

    let tot = Array(12).fill("");
    llenarFooter(document.querySelectorAll(".total_mes_categoria"), tot, false)

    let response = await cargarDatos(   `salidas_productos_sucursal?`+
                                        `sucursal_salidas=${id_suc}&`+
                                        `categoria_salidas=${id_cat}&`+
                                        `year_actual=${anio}`)
    await delay(500)
    if(response.status === "success"){
        array_productos_ = crearArrayDatos(response.datos, "codigo");
        document.getElementById("tit_monto").textContent = array_productos_[0].categoria_nombre;
        document.getElementById("opciones_codigos").value = "1"
        
        evetoSelect(document.getElementById("opciones_codigos"),
                    document.getElementById("tabla_codigos_venta"),
                    array_productos_, 
                    "codigo",
                    document.querySelectorAll(".total_mes_categoria"))
        modal_proceso_abrir("Resultados encontrados", "", "")
        modal_proceso_salir_botones()
        
        let tot = sumartoriaAbsoluta("suma_ventas", array_productos_)
        document.getElementById("tabla_codigos_venta").children[2].innerHTML = llenarBodyAbsoluto("codigo", array_productos_, "suma_ventas", true, tot[1])
        llenarFooter(document.querySelectorAll(".total_mes_categoria"), tot[0], true)
                    
    }else{
        array_productos_ = [];
        modal_proceso_abrir("No se encontraron resultados", "", "")
        modal_proceso_salir_botones()
    }
}

document.querySelectorAll(".suc_estad").forEach((event, i)=>{
    event.addEventListener("click", async (e)=>{
        modal_proceso_abrir("Buscando resultados...", "", "")
        
        document.getElementById("sucu_categoria").textContent = "";
        document.getElementById("tit_monto").textContent = "";

        document.querySelector("#tabla_ticket_promedio > tbody").remove()
        document.querySelector("#tabla_ticket_promedio").createTBody()

        document.getElementById("opciones_categorias").value = "0"
        document.querySelector("#tabla_categorias_venta > tbody").remove()
        document.querySelector("#tabla_categorias_venta").createTBody()

        document.getElementById("opciones_codigos").value = "0"
        document.querySelector("#tabla_codigos_venta > tbody").remove()
        document.querySelector("#tabla_codigos_venta").createTBody()

        let tot = Array(12).fill("");
        llenarFooter(document.querySelectorAll(".total_mes_sucursal"), tot, false)
        llenarFooter(document.querySelectorAll(".total_mes_categoria"), tot, false)
        quitarMarcaBoton()

        let sucursal_ = suc_db.find(x=> x.sucursal_nombre === event.textContent)
        if(sucursal_){
            array_categorias_ = await busquedaSucursal(sucursal_.id_sucursales, anio_principal)
            document.getElementById("sucu_categoria").textContent = ` ${sucursal_.sucursal_nombre}` 
            modal_proceso_abrir("Resultados encontrados", "", "")
            modal_proceso_salir_botones()
            ticketPromedio(array_categorias_)
            event.classList.add("marcaBotonDos")
        }else{
            array_categorias_ = [];
            modal_proceso_abrir("No se encontraron resultados", "", "")
            modal_proceso_salir_botones()
        }

        evetoSelect(document.getElementById("opciones_categorias"), 
                    document.getElementById("tabla_categorias_venta"),
                    array_categorias_,
                    "categoria_nombre",
                    document.querySelectorAll(".total_mes_sucursal"))
    })
});
function quitarMarcaBoton(){
    document.querySelectorAll(".suc_estad")[0].classList.remove("marcaBotonDos")
    document.querySelectorAll(".suc_estad")[1].classList.remove("marcaBotonDos")
    document.querySelectorAll(".suc_estad")[2].classList.remove("marcaBotonDos")
    document.querySelectorAll(".suc_estad")[3].classList.remove("marcaBotonDos")
    document.querySelectorAll(".suc_estad")[4].classList.remove("marcaBotonDos")
}
////////////////////////////////////////////////////////////
document.getElementById("imprimir_cat").addEventListener("click", ()=>{
    imprimirContenido_home(document.querySelector("#tabla_categorias_venta"), document.getElementById("opciones_categorias"), "categoría")
})
document.getElementById("imprimir_prod").addEventListener("click", ()=>{
    imprimirContenido_home(document.querySelector("#tabla_codigos_venta"), document.getElementById("opciones_codigos"), "producto")
})
function imprimirContenido_home(elemento, elemento_titulo, texto) {
    let anio = document.getElementById("anio_referencia").value
    let contenido = elemento.outerHTML;
    let titulo = elemento_titulo[elemento_titulo.selectedIndex].textContent
    let ventanaImpresion = window.open('', '_blank');
    let sucursal_ = ""
    document.querySelectorAll(".suc_estad").forEach((event)=>{
        event.classList.contains('marcaBoton') ? sucursal_ = event.textContent : ""
    })
    ventanaImpresion.document.write('<html><head><title>Contenido para imprimir</title>');
    ventanaImpresion.document.write('<style>');
    ventanaImpresion.document.write('#imprimir_cat, #imprimir_prod, select, span, h2{ display: none;}');
    ventanaImpresion.document.write('</style>');
    ventanaImpresion.document.write('</head><body style="width: 1100px; background: rgba(5, 5, 5, 1); color: #eee;margin-left: auto; margin-right: auto;">');
    ventanaImpresion.document.write(`<h1 style="text-align: center">${titulo} por ${texto} en ${sucursal_} (${anio})</h1>`);
    ventanaImpresion.document.write(contenido);
    ventanaImpresion.document.write(`<p>${new Date()}</p>`);
    ventanaImpresion.document.write('</body></html>');
    ventanaImpresion.document.write('<button onclick="window.print()">Imprimir</button>');
    ventanaImpresion.document.close();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Buscador de desempeño
let input_busqueda = document.querySelectorAll(".input-filtro")
function buscadorDesempeno(i, event){
    let id = ["#tabla_categorias_venta", "#tabla_codigos_venta"]
    document.querySelectorAll(`${id[i]} > tbody > tr`).forEach((elemento)=>{
        if(elemento.children[0].textContent.toLowerCase().includes(event.value.toLowerCase())){
            elemento.children[0].parentNode.classList.remove("invisible")
        }else{
            elemento.children[0].parentNode.classList.add("invisible")
        }
    });
};
input_busqueda.forEach((event, i)=>{
    event.addEventListener("keyup", ()=>{
        buscadorDesempeno(i, event)
    });
});

