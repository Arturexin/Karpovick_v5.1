
document.addEventListener("DOMContentLoaded", inicioHome)
let anio_principal = ""
let sucursales_comparacion = ""
function inicioHome(){
    anio_principal = new Date().getFullYear()
    cargarFuncionesGraficos()
    cargarDatosAnio()
    btnHome = 1;
    sucursales_comparacion = JSON.parse(localStorage.getItem("sucursal_encabezado"))
};
let ventasMensuales = [];
let ventasMensualesSucursales = [];
let ventasMensualesDevolucionesSucursales = [];
let stockSucursales = [];
let ventasDiaSucursales = [];
let sumaTotalEntradas = [];
let sumaTotalSalidas = [];
let sumaTotalPerdidas = [];
let gastos_grafico_detallado = [];
let sumaTotalEntradasAnioPasado = [];
let sumaTotalSalidasAnioPasado = [];
let sumaTotalPerdidasAnioPasado = [];
let transferencias_monto = [];
let transferencias_monto_anio_pasado = [];
async function cargarSaldosTransferencias(url, anio){// rotacion de inventarios
    let variable= [];
    for(let i = 0; i < sucursales_comparacion.length; i++){
        let respuesta = await cargarDatos(`${url}?`+
                                            `id_sucursal=${sucursales_comparacion[i].id_sucursales}&`+                                              
                                            `year_actual=${anio}`)  
    variable.push(respuesta)
    }
    return variable;
};
async function cargarFuncionesGraficos(){
    ventasMensualesSucursales = await cargarDatos(  `salidas_suma_ventas_por_mes_por_sucursal?`+// rotacion de inventarios
                                                    `year_actual=${anio_principal}`)
    ventasMensualesDevolucionesSucursales = await cargarDatos(`salidas_suma_ventas_devoluciones_mes_actual_sucursal`)
    ventasDiaSucursales = await cargarDatos(`salidas_suma_ventas_por_dia_por_sucursal`)
    sumaTotalEntradas = await cargarDatos(  `entradas_suma_total_mes?`+// rotacion de inventarios
                                            `year_actual=${anio_principal}`)
    sumaTotalSalidas = await cargarDatos(   `salidas_suma_total_por_mes?`+// rotacion de inventarios
                                            `year_actual=${anio_principal}`)
    gastos_grafico_detallado = await cargarDatos(   `gastos_suma_mes?`+
                                                    `year_actual=${anio_principal}`)
    sumaTotalEntradasAnioPasado = await cargarDatos(`entradas_suma_total_pasado?`+// rotacion de inventarios
                                                    `year_actual=${anio_principal}`)
    sumaTotalSalidasAnioPasado = await cargarDatos( `salidas_suma_total_pasado?`+// rotacion de inventarios
                                                    `year_actual=${anio_principal}`)
    sumaTotalPerdidas = await cargarDatos(  `perdidas_suma_total?`+// rotacion de inventarios
                                            `year_actual=${anio_principal}`);
    sumaTotalPerdidasAnioPasado = await cargarDatos(`perdidas_suma_total_anio_pasado?`+// rotacion de inventarios
                                                    `year_actual=${anio_principal}`);
    transferencias_monto = await cargarSaldosTransferencias(`transferencias_suma_total`, anio_principal)
    transferencias_monto_anio_pasado = await cargarSaldosTransferencias(`transferencias_suma_total_anio_pasado`, anio_principal)

    graficoDonaEfectivo()
    totalVentasPorMes()
    totalVentasPorMesSucursal()

    avanceMensualPorSucursal()
    avanceDiarioPorSucursal()
    devolucionMensualPorSucursal()
    rotacionSucursal()
    
    leyendaSucursal();
}
///////////////////////////////////////////////////////////////////////////////////
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        reinicioBarraGrafico(barras_venta);//Reinicia gráfico Ventas Mensuales
        reinicioBarraGrafico(barras_venta_sucursales);//Reinicia gráfico Ventas Mensuales sucursales
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

        ventasMensualesSucursales = await cargarDatos(  `salidas_suma_ventas_por_mes_por_sucursal?`+// rotacion de inventarios
                                                        `year_actual=${anio_principal}`)
        sumaTotalEntradas = await cargarDatos(  `entradas_suma_total_mes?`+// rotacion de inventarios
                                                `year_actual=${anio_principal}`)
        sumaTotalSalidas = await cargarDatos(   `salidas_suma_total_por_mes?`+// rotacion de inventarios
                                                `year_actual=${anio_principal}`)
        gastos_grafico_detallado = await cargarDatos(   `gastos_suma_mes?`+
                                                        `year_actual=${anio_principal}`)
        sumaTotalEntradasAnioPasado = await cargarDatos(`entradas_suma_total_pasado?`+// rotacion de inventarios
                                                        `year_actual=${anio_principal}`)
        sumaTotalSalidasAnioPasado = await cargarDatos(`salidas_suma_total_pasado?`+// rotacion de inventarios
                                                        `year_actual=${anio_principal}`)
        sumaTotalPerdidas = await cargarDatos(  `perdidas_suma_total?`+// rotacion de inventarios
                                                `year_actual=${anio_principal}`);
        sumaTotalPerdidasAnioPasado = await cargarDatos(`perdidas_suma_total_anio_pasado?`+// rotacion de inventarios
                                                        `year_actual=${anio_principal}`);
        transferencias_monto = await cargarSaldosTransferencias(`transferencias_suma_total`, anio_principal)
        transferencias_monto_anio_pasado = await cargarSaldosTransferencias(`transferencias_suma_total_anio_pasado`, anio_principal)
        
        graficoDonaEfectivo()
        totalVentasPorMes()
        totalVentasPorMesSucursal()
        rotacionSucursal()

        quitarMarcaBoton()
        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};
///////////////////////////////////////////////
function leyendaSucursal(){
    let leyenda = document.querySelectorAll(".color_leyenda_sucursales");
    leyenda.forEach((event, i)=>{
        event.style.background = `${colorFondoBarra[i]}`
    })
    let etiquetas_uno = document.querySelectorAll(".etiqueta_sucursal");
    etiquetas_uno.forEach((event, i)=>{
        sucursales_comparacion[i] ? event.textContent = sucursales_comparacion[i].sucursal_nombre : "";
    })
    let etiquetas_dos = document.querySelectorAll(".color_total_sucursal");
    etiquetas_dos.forEach((event, i)=>{
        sucursales_comparacion[i] ? event.textContent = sucursales_comparacion[i].sucursal_nombre : "";
    })
};
//////////////////////////////////////////////////////////////////////////////
function graficarDona(id,clase_valor_margen, clase_porcentaje_margen, numerador, denominador, valor_margen, porcentaje_margen, color_uno, color_dos) {
    
    let circulo = document.getElementById(id);
    circulo.style.background = `conic-gradient(#fff0 0deg, #fff0 0deg)`;//reiniciamos colores de la dona
    circulo.style.background = `conic-gradient(${color_uno} ${(1 - (numerador/denominador)) * 360}deg, ${color_dos} ${(1 - (numerador/denominador)) * 360}deg)`;//asiganamos valores a la dona
    document.querySelector(clase_valor_margen).textContent = `${moneda()} ${(valor_margen).toFixed(2)}`
    document.querySelector(clase_porcentaje_margen).textContent = porcentaje_margen + "%"
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Gráficos horizontales => desempeño mensual
function avanceMensualPorSucursal(){
    let arrayImporteStock = [];
    let sumaBarra = 0;
    for(let i = 0; i < sucursales_comparacion.length; i++){
        arrayImporteStock.push(0)
        ventasMensualesDevolucionesSucursales.forEach((event)=>{
            event.sucursal == sucursales_comparacion[i].id_sucursales ? arrayImporteStock[i] = event.suma_ventas : "";
        });
    };
    
    let masAlto = arrayImporteStock[0];
    arrayImporteStock.forEach((e)=>{
        masAlto < e ? masAlto = e : "";
    });
    graficoHorizontal(document.querySelectorAll(".pestana_uno"), arrayImporteStock, masAlto, sumaBarra, "", 2)
};
function avanceDiarioPorSucursal(){
    let arrayImporteStock = [];
    let sumaBarra = 0;
    for(let i = 0; i < sucursales_comparacion.length; i++){
        arrayImporteStock.push(0)
        ventasDiaSucursales.forEach((event)=>{
            event.sucursal === sucursales_comparacion[i].id_sucursales ? arrayImporteStock[i] = event.suma_ventas_dia : "";
        });
    };
    let masAlto = arrayImporteStock[0];
    arrayImporteStock.forEach((e)=>{
        masAlto < e ? masAlto = e : "";
    });
    graficoHorizontal(document.querySelectorAll(".pestana_dos"), arrayImporteStock, masAlto, sumaBarra, "", 2)
};
function devolucionMensualPorSucursal(){
    let arrayImporteStock = [];
    let sumaBarra = 0;
    for(let i = 0; i < sucursales_comparacion.length; i++){
        arrayImporteStock.push(0)
        ventasMensualesDevolucionesSucursales.forEach((event)=>{
            event.sucursal == sucursales_comparacion[i].id_sucursales ? arrayImporteStock[i] = event.unidades_devueltas : "";
        });
    };
    let masAlto = arrayImporteStock[0];
    arrayImporteStock.forEach((e)=>{
        masAlto < e ? masAlto = e : "";
    });
    graficoHorizontal(document.querySelectorAll(".pestana_tres"), arrayImporteStock, masAlto, sumaBarra, "", 0)
};
function discriminarNullArray(array, num, suma){
    let array_ = [];
    for(let i = 0; i < num; i++){
        (array[i] && array[i][suma]) ? array_.push(array[i][suma]) : array_.push(0)
    }
    return array_
};
async function rotacionSucursal(){
    let inventarios = [[], [], [], []];
    let inventario_final = [0, 0, 0, 0];
    let costos_venta = [0, 0, 0, 0];

    let stock_anio_pasado =[];
    let sumaBarra = 0;
    let rotacionMes = [];
    sucursales_comparacion.forEach((elemento, i)=>{
        stock_anio_pasado.push(0)
        let array_entradas = []
        let array_salidas = []
        stock_anio_pasado[i] =  discriminarNullArray(sumaTotalEntradasAnioPasado, sucursales_comparacion.length, "suma_total_entradas_pasado")[i] - 
                                discriminarNullArray(sumaTotalSalidasAnioPasado, sucursales_comparacion.length, "suma_total_salidas_pasado")[i] +
                                (discriminarNullArray(transferencias_monto_anio_pasado, sucursales_comparacion.length, "sumar_monto")[i] - 
                                discriminarNullArray(transferencias_monto_anio_pasado, sucursales_comparacion.length, "restar_monto")[i]) - 
                                discriminarNullArray(sumaTotalPerdidasAnioPasado, sucursales_comparacion.length, "sumar_perdidas")[i];

        for(let j = 0; j < 12; j++){ // se considera los 12 meses
            array_entradas.push(0)
            array_salidas.push(0)
            sumaTotalEntradas.forEach((event)=>{
                (event.mes === j + 1 && event.sucursal === elemento.id_sucursales) ? array_entradas[j] = event.suma_total_entradas : "";
            });
            sumaTotalSalidas.forEach((event)=>{
                (event.mes === j + 1 && event.sucursal === elemento.id_sucursales) ? array_salidas[j] = event.suma_total_salidas : "";
            });
            if(j <= new Date().getMonth() && Number(anio_principal) === new Date().getFullYear()){
                inventarios[i].push(array_entradas[j] - array_salidas[j])
                inventario_final[i]+=inventarios[i][j];
            }else if(Number(anio_principal) < new Date().getFullYear()){
                inventarios[i].push(array_entradas[j] - array_salidas[j])
                inventario_final[i]+=inventarios[i][j];
            }
        };
    });
    ventasMensualesSucursales.forEach((event)=>{
        sucursales_comparacion.forEach((e, i)=>{
            (event.sucursal == e.id_sucursales) ? costos_venta[i] += event.suma_costos : "";
        });
    });

    rotacionMes.push(inventarios[0].length / (costos_venta[0] / (((stock_anio_pasado[0] * 2) + inventarios[0][0] + inventario_final[0] + 
                    (transferencias_monto[0].sumar_monto - transferencias_monto[0].restar_monto)) / 2)) -
                    discriminarNullArray(sumaTotalPerdidas, sucursales_comparacion.length, "sumar_perdidas")[0])
    rotacionMes.push(inventarios[1].length / (costos_venta[1] / (((stock_anio_pasado[1] * 2) + inventarios[1][0] + inventario_final[1] + 
                    (transferencias_monto[1].sumar_monto - transferencias_monto[1].restar_monto)) / 2)) -
                    discriminarNullArray(sumaTotalPerdidas, sucursales_comparacion.length, "sumar_perdidas")[1])
    rotacionMes.push(inventarios[2].length / (costos_venta[2] / (((stock_anio_pasado[2] * 2) + inventarios[2][0] + inventario_final[2] + 
                    (transferencias_monto[2].sumar_monto - transferencias_monto[2].restar_monto)) / 2)) -
                    discriminarNullArray(sumaTotalPerdidas, sucursales_comparacion.length, "sumar_perdidas")[2])
    rotacionMes.push(inventarios[3].length / (costos_venta[3] / (((stock_anio_pasado[3] * 2) + inventarios[3][0] + inventario_final[3] + 
                    (transferencias_monto[3].sumar_monto - transferencias_monto[3].restar_monto)) / 2)) -
                    discriminarNullArray(sumaTotalPerdidas, sucursales_comparacion.length, "sumar_perdidas")[3])

    for(let i = 0; i < rotacionMes.length; i++){
        (!isFinite(rotacionMes[i])) ? rotacionMes[i] = 0 : "";
    };
    let masAlto = 0;
    for(let i = 0; i < rotacionMes.length; i++){
        (masAlto < rotacionMes[i]) ? masAlto = rotacionMes[i] : "";
    };
    graficoHorizontal(document.querySelectorAll(".pestana_cuatro"), rotacionMes, masAlto, sumaBarra, "m", 0)
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const barras_venta = [".cg_1_c", ".cg_2_c", ".cg_3_c", ".cg_4_c", ".cg_5_c"]
const barras_venta_sucursales = [".cg_1_c_s", ".cg_2_c_s", ".cg_3_c_s", ".cg_4_c_s", ".cg_5_c_s"]
function totalVentasPorMes(){
    let array_ventas_total = [];
    let array_costos_total = [];
    let array_meses= [];
    let masAlto = 0;
    let mes_alto = 0;
    let masBajo = Infinity;
    let mes_bajo = 0;
    let suma_mensual_ventas = 0;
    let suma_meses = 0;
    document.querySelectorAll(".f_l_g").forEach((event, i)=>{
        event.textContent = `${meses_letras[i]}${anio_principal % 100}`;
    });
    for(let i = 0; i < 12; i++){
        array_ventas_total.push(0);
        array_costos_total.push(0);
        array_meses.push(0);
        ventasMensualesSucursales.forEach((event)=>{
            if(event.mes == i + 1){
                suma_mensual_ventas += event.suma_ventas
                array_ventas_total[i] += event.suma_ventas;
                array_costos_total[i] += event.suma_costos;
                array_meses[i] = event.mes;
            };
        });
        array_ventas_total[i] > 0 ? suma_meses+=1 : "";
    };
    for(let i = 0; i < array_ventas_total.length; i++){
        if(masAlto < array_ventas_total[i]){// Encontramos el valor mas alto de array_ventas_total[i]
            masAlto = array_ventas_total[i]
            mes_alto = array_meses[i]
        };
        if(array_ventas_total[i] > 0 && masBajo >= array_ventas_total[i]){// Encontramos el valor mas bajo de array_ventas_total[i]
            masBajo = array_ventas_total[i]
            mes_bajo = array_meses[i]
        };
    };

    document.getElementById("menor_venta").textContent = `${moneda()} ${(masBajo).toFixed(2)}`
    document.getElementById("mayor_venta").textContent = `${moneda()} ${(masAlto).toFixed(2)}`
    document.getElementById("promedio_venta").textContent = `${moneda()} ${(suma_mensual_ventas/suma_meses).toFixed(2)}`
    document.querySelector(".mes_max").textContent = `${meses_letras[mes_alto - 1]}-${anio_referencia.value}`
    document.querySelector(".mes_min").textContent = `${meses_letras[mes_bajo - 1]}-${anio_referencia.value}`
    let masAltoDos = (226 * masAlto)/214;
    document.querySelectorAll(".eje_y_numeracion").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos -= 0.20 * ((226 * masAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_1_c"), array_ventas_total, masAlto, colorFondoBarra[0], document.querySelectorAll(".sg_1_c"), 8, moneda())
    pintarGraficoPositivo(document.querySelectorAll(".cg_2_c"), array_costos_total, masAlto, colorFondoBarra[3], document.querySelectorAll(".sg_2_c"), 8, moneda())
};
async function graficoDonaEfectivo(){
    let colores_dos =   [
                            "#FFB2A8",
                            "#7FBCEB",
                            "#6DDF99",
                            "#F7DE98",
                            "#C79EC7",
                            "#E7D8FF",
                            "#FFD28F",
                            "#B1DEA6",
                        ]
    let array_nom_dos = [
                            "Costos laborales",
                            "Gastos operativos",
                            "Costo de adquisición y logística",
                            "Costos financieros",
                            "Otros",
                            "Devoluciones",
                            "Utilidad"
                        ]
    let provee = 0;
    let array_gastos = [0,0,0,0,0,0,0]
    const sumaTotal = ventasMensualesSucursales.reduce((total, elemento) => {
        total.suma_costos += elemento.suma_costos;
        total.suma_ventas += elemento.suma_ventas;
        total.suma_ventas_esperado += elemento.suma_ventas_esperado;
        return total;
    }, { suma_costos: 0, suma_ventas: 0, suma_ventas_esperado: 0 });
    
    graficarDona("circulo_stock_margen_esperado",".valor_circulo_margen_esperado", ".porcentaje_circulo_margen_esperado", sumaTotal.suma_costos, 
                sumaTotal.suma_ventas_esperado, sumaTotal.suma_ventas_esperado - sumaTotal.suma_costos, ((1 - (sumaTotal.suma_costos/sumaTotal.suma_ventas_esperado)) * 100).toFixed(2), '#E6CA7B', '#E66E8D')
    graficarDona("circulo_stock_facturado",".valor_circulo_margen_facturado", ".porcentaje_circulo_margen_facturado", sumaTotal.suma_ventas, 
                sumaTotal.suma_ventas_esperado, sumaTotal.suma_ventas, ((sumaTotal.suma_ventas/sumaTotal.suma_ventas_esperado)*100).toFixed(2), '#6380E6', '#E6CA7B')
    gastos_grafico_detallado.forEach((event)=>{
        provee += event._proveedores
        array_gastos[0] += (event._nomina + event._seguridad_social);
        array_gastos[1] += (event._alquiler + event._mantenimientos + event._servicios + event._publicidad + event._impuestos);
        array_gastos[2] = (sumaTotal.suma_costos + provee);
        array_gastos[3] += (event._pago_prestamos + event._depositos);
        array_gastos[4] += event._otros;
        array_gastos[5] += event.devoluciones;
        array_gastos[6] = sumaTotal.suma_ventas -  
                        (   array_gastos[0]+
                            array_gastos[1]+
                            array_gastos[2]+
                            array_gastos[3]+
                            array_gastos[4]+
                            array_gastos[5]);
    });
    graficoDonaColores( "circulo_stock_margen", 
                        `Margen neto (${((1 - (sumaTotal.suma_costos/sumaTotal.suma_ventas)) * 100).toFixed(2)}%)`, 
                        array_gastos, 
                        ".nombre_circulo_margen", 
                        ".valor_circulo_margen", 
                        ".porcentaje_circulo_margen",
                        array_nom_dos,
                        colores_dos, "", "")
};
function totalVentasPorMesSucursal(){
    let arrays = [];
    let arrays_costo = [];
    let sumaMasAlto = 0;
    let array_suma_ventas = [];
    let array_suma_costos = [];
    let sucu_ = [];

    sucursales_comparacion.forEach((event, i)=>{
        sucu_[i] = event.sucursal_nombre
    })
    document.querySelectorAll(".f_l_g_s").forEach((event, i)=>{
        event.textContent = `${meses_letras[i]}${anio_principal % 100}`;
    });
    document.querySelectorAll(".color_item_grafico_sucursal").forEach((event, i)=>{
        event.style.background = `${colorFondoBarra[i]}`
        event.style.width = `20px`
        event.style.height = `10px`
        document.querySelectorAll(".descripcion_item_grafico_s")[i].textContent = sucu_[i]
    });
    sucursales_comparacion.forEach((sucursal, i)=>{
        arrays.push([])
        arrays_costo.push([])
        for(let j = 0; j < 12; j++){
            ventasMensualesSucursales.forEach((event)=>{
                if(event.sucursal == sucursal.id_sucursales && event.mes == j + 1){
                    arrays[i][j] = event.suma_ventas;
                    arrays_costo[i][j] = event.suma_costos;
                };
                sumaMasAlto < event.suma_ventas ? sumaMasAlto = event.suma_ventas : "";
            })
        }
    })
    for(let i = 0; i < arrays.length; i++){
        array_suma_ventas[i] = arrays[i].reduce((a, b) => a + b, 0);
        array_suma_costos[i] = arrays_costo[i].reduce((a, b) => a + b, 0);
    }
    //Gráficos dona de margen de gananacia
    graficarDona("circulo_total_cero", ".valor_circulo_cero", ".porcentaje_circulo_cero", array_suma_costos[0], array_suma_ventas[0], 
                array_suma_ventas[0] - array_suma_costos[0], ((1 - (array_suma_costos[0]/array_suma_ventas[0])) * 100).toFixed(2), colorFondoBarra[0], '#fff0')
    graficarDona("circulo_total_uno", ".valor_circulo_uno", ".porcentaje_circulo_uno", array_suma_costos[1], array_suma_ventas[1], 
                array_suma_ventas[1] - array_suma_costos[1], ((1 - (array_suma_costos[1]/array_suma_ventas[1])) * 100).toFixed(2), colorFondoBarra[1], '#fff0')
    graficarDona("circulo_total_dos", ".valor_circulo_dos", ".porcentaje_circulo_dos", array_suma_costos[2], array_suma_ventas[2], 
                array_suma_ventas[2] - array_suma_costos[2], ((1 - (array_suma_costos[2]/array_suma_ventas[2])) * 100).toFixed(2), colorFondoBarra[2], '#fff0')
    graficarDona("circulo_total_tres", ".valor_circulo_tres", ".porcentaje_circulo_tres", array_suma_costos[3], array_suma_ventas[3], 
                array_suma_ventas[3] - array_suma_costos[3], ((1 - (array_suma_costos[3]/array_suma_ventas[3])) * 100).toFixed(2), colorFondoBarra[3], '#fff0')
    //Gráfico dona de ventas acumuladas por sucursal
    graficoDonaColores("circulo_stock_sucursal", 
                        "Total Ventas", 
                        array_suma_ventas, 
                        ".nombre_circulo_sucursal", 
                        ".valor_circulo_sucursal", 
                        ".porcentaje_circulo_sucursal",
                        sucu_,
                        colorFondoBarra, "", "")


    let masAltoDos = (226 * sumaMasAlto)/214;
    document.querySelectorAll(".eje_y_numeracion_s").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos -= 0.20 * ((226 * sumaMasAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_1_c_s"), arrays[0], sumaMasAlto, colorFondoBarra[0], document.querySelectorAll(".sg_1_c_s"), 4, moneda())
    pintarGraficoPositivo(document.querySelectorAll(".cg_2_c_s"), arrays[1], sumaMasAlto, colorFondoBarra[1], document.querySelectorAll(".sg_2_c_s"), 4, moneda())
    pintarGraficoPositivo(document.querySelectorAll(".cg_3_c_s"), arrays[2], sumaMasAlto, colorFondoBarra[2], document.querySelectorAll(".sg_3_c_s"), 4, moneda())
    pintarGraficoPositivo(document.querySelectorAll(".cg_4_c_s"), arrays[3], sumaMasAlto, colorFondoBarra[3], document.querySelectorAll(".sg_4_c_s"), 4, moneda())
};


/////////////////////////////////////////////////////////

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