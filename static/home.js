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
