document.addEventListener("DOMContentLoaded", inicioDevolucionSalidas)
let anio_principal = ""
let sucursales_comparacion = ""
function inicioDevolucionSalidas(){
    anio_principal = new Date().getFullYear()
    
    /* cargarDatosAnio() */
    /* graficoDevolucionesVentas(); */
    sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_encabezado"))
    btnAnalisis = 1;
};
let devolucionesComprobante = [];
let detVentasComprobante = [];
const barras_dev_salidas = [".cg_1_c", ".cg_2_c", ".cg_3_c", ".cg_4_c", ".cg_5_c"]
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        reinicioBarraGrafico(barras_dev_salidas);
        anio_principal = anio_referencia.value;

        /* graficoDevolucionesVentas(); */

        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};



let array_categorias = [];
let array_codigos = [];
let array_totales = [];
let array_unidades = [];
let array_ganancias = [];

///////
let conteo_ventas = []

async function ticketPromedio(sucursal_id, anio){
    let Array_anual = []
    conteo_ventas = await cargarDatos(`ventas_conteo_montos?`+
                                        `sucursal_det_venta=${sucursal_id}&`+
                                        `year_actual=${anio}`)
    for(let i = 0; i < 12; i++){
        let array_mensual = [];
        let suma = 0;
        let suma_venta = 0;
        let media = 0;
        conteo_ventas.forEach((event)=>{
            if(event.mes == i + 1){
                array_mensual.push(event)
                suma_venta += event.total_venta;
                suma +=1;
            }
        });

        array_mensual.length > 0 ? media = suma_venta/suma : media = 0;

        Array_anual.push(media.toFixed(2))
        let fila = `
            <tr>
                <td style="text-align: end;width: 80px;font-size: 14px;">${moneda()} ${Array_anual[0]}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${moneda()} ${Array_anual[1]}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${moneda()} ${Array_anual[2]}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${moneda()} ${Array_anual[3]}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${moneda()} ${Array_anual[4]}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${moneda()} ${Array_anual[5]}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${moneda()} ${Array_anual[6]}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${moneda()} ${Array_anual[7]}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${moneda()} ${Array_anual[8]}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${moneda()} ${Array_anual[9]}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${moneda()} ${Array_anual[10]}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${moneda()} ${Array_anual[11]}</td>
            </tr>`
        document.querySelector("#tabla_ticket_promedio > tbody").outerHTML = fila;
    };
};
async function estadisticasSucursal(sucursa_id, anio){
    array_categorias = [];
    let mayor_venta_monto = 0;
    let mayor_venta_monto_relativo = 0;
    let mayor_venta_unidad = 0;
    let mayor_venta_unidad_relativo = 0;
    let mayor_ganancia = 0;
    let mayor_ganancia_relativo = 0;
    let mayor_recurrencia = 0;
    let mayor_recurrencia_relativo = 0;
    array_totales = [];
    array_unidades = [];
    array_ganancias = [];
    let nuevo_array_categorias = [];
    let tabla = ""

    let cuadro_frecuencias = [];

    let venta_total_anual = 0;
    let ganancia_total_anual = 0;
    let unidades_total_anual = 0;
    let recurrencia_total_anual = 0;


    document.getElementById("opciones_categorias").value = 0
    document.getElementById("opciones_codigos").value = 0
    document.getElementById("tit_monto").textContent = ""

    document.querySelector("#tabla_codigos_venta > tbody").remove()
    document.querySelector("#tabla_codigos_venta").createTBody()
    document.querySelectorAll(".total_mes_sucursal").forEach((event)=>{
        event.textContent = ""
    })
    document.querySelectorAll(".total_mes_categoria").forEach((event)=>{
        event.textContent = ""
    })

    array_categorias = await cargarDatos(`salidas_categorias_sucursal?`+
                                        `sucursal_salidas=${sucursa_id}&`+
                                        `year_actual=${anio}`)

    for(let i = 0;i < 12; i++){//FOOTER
        let suma_montos_mes = 0;
        let suma_unidades_mes = 0;
        let suma_ganacias_mes = 0;
        array_categorias.forEach((event)=>{
            if(event.mes == i + 1){
                suma_montos_mes += event.suma_ventas
                suma_ganacias_mes += event.suma_ventas - event.suma_costos
                suma_unidades_mes += event.suma_unidades
            }
        })
        array_totales.push(suma_montos_mes)
        array_unidades.push(suma_unidades_mes)
        array_ganancias.push(suma_ganacias_mes)
    };
    for(let i = 0; i < 12; i++){
        let num = 0;
        conteo_ventas.forEach((event)=>{
            event.mes == i + 1 ? num += 1 : "";
        })
        cuadro_frecuencias.push(num)
    }

    array_categorias.forEach((event)=>{
        event.suma_ventas > mayor_venta_monto ? mayor_venta_monto = event.suma_ventas : "";

        event.suma_ventas/array_totales[event.mes - 1] > mayor_venta_monto_relativo ? mayor_venta_monto_relativo = event.suma_ventas/array_totales[event.mes - 1] : "";

        event.suma_ventas - event.suma_costos > mayor_ganancia ? mayor_ganancia = event.suma_ventas - event.suma_costos : "";

        (event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1] > mayor_ganancia_relativo ? mayor_ganancia_relativo = (event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1] : "";
        
        event.suma_unidades > mayor_venta_unidad ? mayor_venta_unidad = event.suma_unidades : "";

        event.suma_unidades/array_unidades[event.mes - 1] > mayor_venta_unidad_relativo ? mayor_venta_unidad_relativo = event.suma_unidades/array_unidades[event.mes - 1] : "";

        event.suma_veces > mayor_recurrencia ? mayor_recurrencia = event.suma_veces : "";

        event.suma_veces/cuadro_frecuencias[event.mes - 1] > mayor_recurrencia_relativo ? mayor_recurrencia_relativo = event.suma_veces/cuadro_frecuencias[event.mes - 1] : "";
        
        venta_total_anual+=event.suma_ventas;
        ganancia_total_anual+=(event.suma_ventas - event.suma_costos);
        unidades_total_anual+=event.suma_unidades;
        recurrencia_total_anual+=event.suma_veces;
    });

    let nuevo_objeto = {};
    nuevo_array_categorias = array_categorias.filter(obj => {//eliminamos categorías repetidas
        if (!nuevo_objeto[obj.categoria_nombre]) {
            nuevo_objeto[obj.categoria_nombre] = true;
            return true;
        }
        return false;
    });

    
    if(nuevo_array_categorias.length > 0){
        let html = ''
        for(categoria of nuevo_array_categorias){
            let fila = `
                    <tr>
                        <td class="categoria_anual">${categoria.categoria_nombre}</td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td class="total_categoria" style="text-align: end;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: center;width: 40px;">
                            <div class="tooltip">
                                <span onclick="llamarDetalleVentaProductos(${categoria.categoria}, ${categoria.sucursal}, ${document.getElementById("anio_referencia").value})" 
                                    style="font-size:18px;" class="material-symbols-outlined myButtonEditar">play_arrow
                                </span>
                                <span class="tooltiptext">Detalle por producto</span>
                            </div>
                        </td>
                    </tr>`
            html = html + fila;
        }; 
        document.querySelector("#tabla_categorias_venta > tbody").outerHTML = html;

        document.getElementById("opciones_categorias").addEventListener("change", ()=>{//Rellenamos las 12 primeras columnas de la tabla "Desempeño por categoría"
            let num = 0;
            let param = 0;
            tabla = document.querySelector("#tabla_categorias_venta > tbody").children
            
            for(let i = 0; i < tabla.length; i++){
                let suma_parcial_venta = 0;
                let suma_parcial_ganancia = 0;
                let suma_parcial_unidades = 0;
                let suma_parcial_recurrencia = 0;
                array_categorias.forEach((event) =>{
                    if(tabla[i].children[0].textContent == event.categoria_nombre && array_totales[event.mes - 1] > 0){
                        if(document.getElementById("opciones_categorias").value == 1){//Ventas absolutas
                            num = mayor_venta_monto
                            tabla[i].children[event.mes].textContent = event.suma_ventas.toFixed(2)
                            param = event.suma_ventas
                        }else if(document.getElementById("opciones_categorias").value == 2){//Ventas relativas
                            num = mayor_venta_monto_relativo
                            tabla[i].children[event.mes].textContent = `${((event.suma_ventas/array_totales[event.mes - 1])*100).toFixed(2)}%`
                            param = event.suma_ventas/array_totales[event.mes - 1]
                        }else if(document.getElementById("opciones_categorias").value == 3){//Ganancias absolutas
                            num = mayor_ganancia
                            tabla[i].children[event.mes].textContent = (event.suma_ventas - event.suma_costos).toFixed(2)
                            param = event.suma_ventas - event.suma_costos
                        }else if(document.getElementById("opciones_categorias").value == 4){//Ganancias relativas
                            num = mayor_ganancia_relativo
                            tabla[i].children[event.mes].textContent = `${(((event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1])*100).toFixed(2)}%`
                            param = (event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1]
                        }else if(document.getElementById("opciones_categorias").value == 5){//Unidades absolutas 
                            num = mayor_venta_unidad
                            tabla[i].children[event.mes].textContent = event.suma_unidades
                            param = event.suma_unidades
                        }else if(document.getElementById("opciones_categorias").value == 6){//Unidades relativas
                            num = mayor_venta_unidad_relativo
                            tabla[i].children[event.mes].textContent = `${((event.suma_unidades/array_unidades[event.mes - 1])*100).toFixed(2)}%`
                            param = event.suma_unidades/array_unidades[event.mes - 1]
                        }else if(document.getElementById("opciones_categorias").value == 7){//Recurrencias absolutas 
                            num = mayor_recurrencia
                            tabla[i].children[event.mes].textContent = event.suma_veces
                            param = event.suma_veces
                        }else if(document.getElementById("opciones_categorias").value == 8){//Recurrencias relativas
                            num = mayor_recurrencia_relativo
                            tabla[i].children[event.mes].textContent = `${((event.suma_veces/cuadro_frecuencias[event.mes - 1])*100).toFixed(2)}%`
                            param = event.suma_veces/cuadro_frecuencias[event.mes - 1]
                        }else{
                            num = 0
                            tabla[i].children[event.mes].textContent = ``
                            param = 0
                        }
                        
                        if(param <= num * 0.20){// Determinamos el color de las celdas según su valor numérico
                            tabla[i].children[event.mes].style.background = mapa_calor[4]
                        }else if(param <= num * 0.40){
                            tabla[i].children[event.mes].style.background = mapa_calor[3]
                        }else if(param <= num * 0.60){
                            tabla[i].children[event.mes].style.background = mapa_calor[2]
                        }else if(param <= num * 0.80){
                            tabla[i].children[event.mes].style.background = mapa_calor[1]
                        }else if(param <= num * 1){
                            tabla[i].children[event.mes].style.background = mapa_calor[0]
                        };
                        suma_parcial_venta+=event.suma_ventas
                        suma_parcial_ganancia+=(event.suma_ventas - event.suma_costos)
                        suma_parcial_unidades+=event.suma_unidades
                        suma_parcial_recurrencia+=event.suma_veces
                    }
                });
                let suma_mes_cat = 0;
                let suma_mes_cero = 0;
                for(let j = 1; j <= 12; j++){
                    let num = tabla[i].children[j].textContent.replace("%", "")
                    if(num !== ""){
                        suma_mes_cat += Number(num)
                        suma_mes_cero +=1
                    }
                };
                //Aqui rellenamos la columna de los totales y promedios
                if(document.getElementById("opciones_categorias").value == 2){
                    tabla[i].children[13].textContent  = `${((suma_parcial_venta/venta_total_anual)*100).toFixed(2)}%`
                }else if(document.getElementById("opciones_categorias").value == 4){
                    tabla[i].children[13].textContent  = `${((suma_parcial_ganancia/ganancia_total_anual)*100).toFixed(2)}%`
                }else if(document.getElementById("opciones_categorias").value == 6){
                    tabla[i].children[13].textContent  = `${((suma_parcial_unidades/unidades_total_anual)*100).toFixed(2)}%`
                }else if(document.getElementById("opciones_categorias").value == 8){
                    tabla[i].children[13].textContent  = `${((suma_parcial_recurrencia/recurrencia_total_anual)*100).toFixed(2)}%`
                }else if(document.getElementById("opciones_categorias").value == 7 ||
                document.getElementById("opciones_categorias").value == 5){
                    tabla[i].children[13].textContent  = suma_mes_cat
                }else{
                    tabla[i].children[13].textContent  = suma_mes_cat.toFixed(2)
                }
                document.querySelector("#tabla_categorias_venta > thead > tr:nth-child(3) > th:nth-child(14)").textContent = "Total"//Celda 13 Head

            };
            document.querySelectorAll(".total_mes_sucursal").forEach((event, x)=>{//Rellenamos Footer
                let sum = 0;
                let suma_mayor_cero = 0;
                for(let i = 0; i < tabla.length; i++){
                    let num = tabla[i].children[x + 1].textContent.replace("%", "")
                    if(num !== ""){
                        sum += Number(num)
                        suma_mayor_cero +=1
                    }
                }
                
                if(document.getElementById("opciones_categorias").value == 2 ||
                document.getElementById("opciones_categorias").value == 4 ||
                document.getElementById("opciones_categorias").value == 6){
                    event.textContent = `${sum.toFixed(2)}%`
                    document.querySelector("#tabla_categorias_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }else if(document.getElementById("opciones_categorias").value == 8){
                    event.textContent = ``
                    if(x == 12){
                        event.textContent = ``
                    }
                    document.querySelector("#tabla_categorias_venta > tfoot > tr > th:nth-child(1)").textContent = ""
                }else if(document.getElementById("opciones_categorias").value == 7){
                    event.textContent = cuadro_frecuencias[x]
                    document.querySelector("#tabla_categorias_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }else if(document.getElementById("opciones_categorias").value == 5){
                    event.textContent = sum
                    document.querySelector("#tabla_categorias_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }else{
                    event.textContent = sum.toFixed(2)
                    document.querySelector("#tabla_categorias_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }
                
            })
        });
    };
};

async function llamarDetalleVentaProductos(categoria_id, sucursal_id, anio){

    array_codigos = [];
    let mayor_venta_monto = 0;
    let mayor_venta_monto_relativo = 0;
    let mayor_venta_unidad = 0;
    let mayor_venta_unidad_relativo = 0;
    let mayor_venta_ganancia = 0;
    let mayor_venta_ganancia_relativo = 0;
    let mayor_venta_recurrencia = 0;
    let mayor_venta_recurrencia_relativo = 0;
    let mayor_venta_devolucion = 0;
    let mayor_venta_devolucion_relativo = 0;
    let array_totales_unidad = [];
    let tabla = ""

    let cuadro_frecuencias = [];

    let venta_total_anual = 0;
    let ganancia_total_anual = 0;
    let unidades_total_anual = 0;
    let recurrencia_total_anual = 0;
    let devolucion_total_anual = 0;

    document.getElementById("opciones_codigos").value = 0

    array_codigos = await cargarDatos(`salidas_productos_sucursal?`+
                                        `sucursal_salidas=${sucursal_id}&`+
                                        `categoria_salidas=${categoria_id}&`+
                                        `year_actual=${anio}`)

    for(let i = 0;i < 12; i++){//FOOTER
        let suma_unidades_mes = 0;
        array_codigos.forEach((event)=>{
            event.mes == i + 1 ? suma_unidades_mes += event.suma_unidades : "";
        })
        array_totales_unidad.push(suma_unidades_mes)
    };
    for(let i = 0; i < 12; i++){
        let num = 0;
        conteo_ventas.forEach((event)=>{
            event.mes == i + 1 ? num += 1 : "";
        })
        cuadro_frecuencias.push(num)
    };
    array_codigos.forEach((event)=>{
        event.suma_ventas > mayor_venta_monto ? mayor_venta_monto = event.suma_ventas : "";
        
        event.suma_ventas/array_totales[event.mes - 1] > mayor_venta_monto_relativo ? mayor_venta_monto_relativo = event.suma_ventas/array_totales[event.mes - 1] : "";
        
        event.suma_ventas - event.suma_costos > mayor_venta_ganancia ? mayor_venta_ganancia = event.suma_ventas - event.suma_costos : "";
        
        (event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1] > mayor_venta_ganancia_relativo ? mayor_venta_ganancia_relativo = (event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1] : "";
        
        event.suma_unidades > mayor_venta_unidad ? mayor_venta_unidad = event.suma_unidades : "";
        
        event.suma_unidades/array_unidades[event.mes - 1] > mayor_venta_unidad_relativo ? mayor_venta_unidad_relativo = event.suma_unidades/array_unidades[event.mes - 1] : "";
        
        event.suma_veces > mayor_venta_recurrencia ? mayor_venta_recurrencia = event.suma_veces : "";
        
        event.suma_veces/cuadro_frecuencias[event.mes - 1] > mayor_venta_recurrencia_relativo ? mayor_venta_recurrencia_relativo = event.suma_veces/cuadro_frecuencias[event.mes - 1] : "";
        
        event.suma_unidades_dev > mayor_venta_devolucion ? mayor_venta_devolucion = event.suma_unidades_dev : "";
        
        event.suma_unidades_dev/(event.suma_unidades + event.suma_unidades_dev) > mayor_venta_devolucion_relativo ? mayor_venta_devolucion_relativo = event.suma_unidades_dev/(event.suma_unidades + event.suma_unidades_dev) : "";
        
        venta_total_anual+=event.suma_ventas;
        ganancia_total_anual+=(event.suma_ventas - event.suma_costos);
        unidades_total_anual+=event.suma_unidades;
        recurrencia_total_anual+=event.suma_veces;
        devolucion_total_anual+=event.suma_unidades_dev;
    });

    let nuevo_objeto = {};
    let nuevo_array_codigos = array_codigos.filter(obj => {//eliminamos códigos repetidos
        if (!nuevo_objeto[obj.codigo]) {
            nuevo_objeto[obj.codigo] = true;
            return true;
        }
        return false;
    });

    document.getElementById("tit_monto").textContent = array_codigos[0].categoria_nombre
    let html_monto = ''

    if(nuevo_array_codigos.length > 0){
        for(cod of nuevo_array_codigos){
            let fila = `
                    <tr>
                        <td class="codigo_anual" style="width: 120px;">${cod.codigo}</td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: center;width: 40px;">
                            <span style="font-size:18px;" class="material-symbols-outlined myButtonEditar">play_arrow</span>
                        </td>
                    </tr>`
            html_monto = html_monto + fila;
        }; 
        document.querySelector("#tabla_codigos_venta > tbody").outerHTML = html_monto;

        tabla = document.querySelector("#tabla_codigos_venta > tbody").children
        document.getElementById("opciones_codigos").addEventListener("change", ()=>{
            let num = 0;
            let param = 0;
            for(let i = 0; i < tabla.length; i++){
                let suma_parcial_venta = 0;
                let suma_parcial_ganancia = 0;
                let suma_parcial_unidades = 0;
                let suma_parcial_recurrencia = 0;
                let suma_parcial_devolucion = 0;
                array_codigos.forEach((event) =>{
                    if(tabla[i].children[0].textContent == event.codigo && array_totales[event.mes - 1] > 0){
                        if(document.getElementById("opciones_codigos").value == 1){
                            num = mayor_venta_monto
                            tabla[i].children[event.mes].textContent = event.suma_ventas.toFixed(2)
                            param = event.suma_ventas
                        }else if(document.getElementById("opciones_codigos").value == 2){
                            num = mayor_venta_monto_relativo
                            tabla[i].children[event.mes].textContent = `${((event.suma_ventas/array_totales[event.mes - 1])*100).toFixed(2)}%`
                            param = event.suma_ventas/array_totales[event.mes - 1]
                        }else if(document.getElementById("opciones_codigos").value == 3){
                            num = mayor_venta_ganancia
                            tabla[i].children[event.mes].textContent = (event.suma_ventas - event.suma_costos).toFixed(2)
                            param = event.suma_ventas - event.suma_costos
                        }else if(document.getElementById("opciones_codigos").value == 4){
                            num = mayor_venta_ganancia_relativo
                            tabla[i].children[event.mes].textContent = `${(((event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1])*100).toFixed(2)}%`
                            param = (event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1]
                        }else if(document.getElementById("opciones_codigos").value == 5){
                            num = mayor_venta_unidad
                            tabla[i].children[event.mes].textContent = event.suma_unidades
                            param = event.suma_unidades
                        }else if(document.getElementById("opciones_codigos").value == 6){
                            num = mayor_venta_unidad_relativo
                            tabla[i].children[event.mes].textContent = `${((event.suma_unidades/array_unidades[event.mes - 1])*100).toFixed(2)}%`
                            param = event.suma_unidades/array_unidades[event.mes - 1]
                        }else if(document.getElementById("opciones_codigos").value == 7){
                            num = mayor_venta_recurrencia
                            tabla[i].children[event.mes].textContent = event.suma_veces
                            param = event.suma_veces
                        }else if(document.getElementById("opciones_codigos").value == 8){
                            num = mayor_venta_recurrencia_relativo
                            tabla[i].children[event.mes].textContent = `${((event.suma_veces/cuadro_frecuencias[event.mes - 1])*100).toFixed(2)}%`
                            param = event.suma_veces/cuadro_frecuencias[event.mes - 1]
                        }else if(document.getElementById("opciones_codigos").value == 9){
                            num = mayor_venta_devolucion
                            tabla[i].children[event.mes].textContent = event.suma_unidades_dev
                            param = event.suma_unidades_dev
                        }else if(document.getElementById("opciones_codigos").value == 10){
                            num = mayor_venta_devolucion_relativo
                            tabla[i].children[event.mes].textContent = `${((event.suma_unidades_dev/(event.suma_unidades + event.suma_unidades_dev))*100).toFixed(2)}%`
                            param = event.suma_unidades_dev/(event.suma_unidades + event.suma_unidades_dev)
                        }else{
                            num = 0
                            tabla[i].children[event.mes].textContent = ``
                            param = 0
                        }
                        
                        if(param <= num * 0.20){
                            tabla[i].children[event.mes].style.background = mapa_calor[4]
                        }else if(param <= num * 0.40){
                            tabla[i].children[event.mes].style.background = mapa_calor[3]
                        }else if(param <= num * 0.60){
                            tabla[i].children[event.mes].style.background = mapa_calor[2]
                        }else if(param <= num * 0.80){
                            tabla[i].children[event.mes].style.background = mapa_calor[1]
                        }else if(param <= num * 1){
                            tabla[i].children[event.mes].style.background = mapa_calor[0]
                        }
                        suma_parcial_venta+=event.suma_ventas;
                        suma_parcial_ganancia+=(event.suma_ventas - event.suma_costos);
                        suma_parcial_unidades+=event.suma_unidades;
                        suma_parcial_recurrencia+=event.suma_veces;
                        suma_parcial_devolucion+=event.suma_unidades_dev;
                    }
                })

                let suma_mes_cat = 0;
                let suma_mes_cero = 0;
                for(let j = 1; j <= 12; j++){
                    let num = tabla[i].children[j].textContent.replace("%", "")
                    if(num !== ""){
                        suma_mes_cat += Number(num)
                        suma_mes_cero +=1
                    }
                };
                //Aqui rellenamos la columna de los totales y promedios
                if(document.getElementById("opciones_codigos").value == 2){
                    tabla[i].children[13].textContent  = `${((suma_parcial_venta/venta_total_anual)*100).toFixed(2)}%`
                }else if(document.getElementById("opciones_codigos").value == 4){
                    tabla[i].children[13].textContent  = `${((suma_parcial_ganancia/ganancia_total_anual)*100).toFixed(2)}%`
                }else if(document.getElementById("opciones_codigos").value == 6){
                    tabla[i].children[13].textContent  = `${((suma_parcial_unidades/unidades_total_anual)*100).toFixed(2)}%`
                }else if(document.getElementById("opciones_codigos").value == 8){
                    tabla[i].children[13].textContent  = `${((suma_parcial_recurrencia/recurrencia_total_anual)*100).toFixed(2)}%`
                }else if(document.getElementById("opciones_codigos").value == 10){
                    tabla[i].children[13].textContent  = `${((suma_parcial_devolucion/devolucion_total_anual)*100).toFixed(2)}%`
                }else if(document.getElementById("opciones_codigos").value == 5 ||
                document.getElementById("opciones_codigos").value == 7 ||
                document.getElementById("opciones_codigos").value == 9){
                    tabla[i].children[13].textContent  = suma_mes_cat
                }else{
                    tabla[i].children[13].textContent  = suma_mes_cat.toFixed(2)
                }
                document.querySelector("#tabla_codigos_venta > thead > tr:nth-child(3) > th:nth-child(14)").textContent = "Total"//Celda 13 Head
            }

            document.querySelectorAll(".total_mes_categoria").forEach((event, x)=>{
                let sum = 0;
                let suma_mayor_cero = 0;
                for(let i = 0; i < tabla.length; i++){
                    let num = tabla[i].children[x + 1].textContent.replace("%", "")
                    if(num !== ""){
                        sum += Number(num)
                        suma_mayor_cero +=1
                    }
                }
                if(document.getElementById("opciones_codigos").value == 10 ||
                document.getElementById("opciones_codigos").value == 8){
                    event.textContent = ``
                    document.querySelector("#tabla_codigos_venta > tfoot > tr > th:nth-child(1)").textContent = ""
                }else if(document.getElementById("opciones_codigos").value == 2 ||
                document.getElementById("opciones_codigos").value == 4 ||
                document.getElementById("opciones_codigos").value == 6){
                    event.textContent = `${sum.toFixed(2)}%`
                    document.querySelector("#tabla_codigos_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }else if(document.getElementById("opciones_codigos").value == 5 ||
                document.getElementById("opciones_codigos").value == 9){
                    event.textContent = sum
                    document.querySelector("#tabla_codigos_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }else if(document.getElementById("opciones_codigos").value == 7){
                    event.textContent = cuadro_frecuencias[x]
                    document.querySelector("#tabla_codigos_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }else{
                    event.textContent = sum.toFixed(2)
                    document.querySelector("#tabla_codigos_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }
            })
        });
    };
};
////////////////////////////////////////////////////////////
document.querySelectorAll(".suc_estad").forEach((event, i)=>{
    event.addEventListener("click", (e)=>{
        quitarMarcaBoton()

        if(i === 0 && sucursales_comparacion[i]){
            ticketPromedio(sucursales_comparacion[i].id_sucursales, anio_principal)
            estadisticasSucursal(sucursales_comparacion[i].id_sucursales, anio_principal)
            event.classList.add("marcaBoton")
        }else if(i === 1 && sucursales_comparacion[i]){
            ticketPromedio(sucursales_comparacion[i].id_sucursales, anio_principal)
            estadisticasSucursal(sucursales_comparacion[i].id_sucursales, anio_principal)
            event.classList.add("marcaBoton")
        }else if(i === 2 && sucursales_comparacion[i]){
            ticketPromedio(sucursales_comparacion[i].id_sucursales, anio_principal)
            estadisticasSucursal(sucursales_comparacion[i].id_sucursales, anio_principal)
            event.classList.add("marcaBoton")
        }else if(i === 3 && sucursales_comparacion[i]){
            ticketPromedio(sucursales_comparacion[i].id_sucursales, anio_principal)
            estadisticasSucursal(sucursales_comparacion[i].id_sucursales, anio_principal)
            event.classList.add("marcaBoton")
        };
    })
});
function quitarMarcaBoton(){
    document.querySelectorAll(".suc_estad")[0].classList.remove("marcaBoton")
    document.querySelectorAll(".suc_estad")[1].classList.remove("marcaBoton")
    document.querySelectorAll(".suc_estad")[2].classList.remove("marcaBoton")
    document.querySelectorAll(".suc_estad")[3].classList.remove("marcaBoton")
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
    let clase = [".categoria_anual", ".codigo_anual"]
    document.querySelectorAll(clase[i]).forEach((elemento)=>{
        if(elemento.textContent.toLowerCase().includes(event.value.toLowerCase())){
            elemento.parentNode.classList.remove("invisible")
        }else{
            elemento.parentNode.classList.add("invisible")
        }
    });
};
input_busqueda.forEach((event, i)=>{
    event.addEventListener("keyup", ()=>{
        buscadorDesempeno(i, event)
    });
});