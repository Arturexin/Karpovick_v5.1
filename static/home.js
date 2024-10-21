document.addEventListener("DOMContentLoaded", inicioHome)
let anio_principal = ""
function inicioHome(){
    anio_principal = new Date().getFullYear()
    cargarFuncionesGraficos()
    cargarDatosAnio()
    btnHome = 1;
};
let ventasMensuales = [];
let ventasMensualesSucursales = [];
let ventasDiaSucursales = [];
let gastos_grafico_detallado = [];


async function cargarFuncionesGraficos(){
    crearElementoCanvas()
    ventasMensualesSucursales = await cargarDatos(  `salidas_suma_ventas_por_mes_por_sucursal?`+// rotacion de inventarios
                                                    `year_actual=${anio_principal}`)

    ventasDiaSucursales = await cargarDatos(`salidas_suma_ventas_por_dia_por_sucursal`)
    gastos_grafico_detallado = await cargarDatos(   `gastos_suma_mes?`+
                                                    `year_actual=${anio_principal}`)
    totalVentasPorMes()
    graficoDonaEfectivo()
    totalVentasPorMesSucursal()

    avanceMensualPorSucursal()
    avanceDiarioPorSucursal()
    devolucionMensualPorSucursal()

    leyendaSucursal();
}
///////////////////////////////////////////////////////////////////////////////////
async function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        anio_principal = anio_referencia.value;
    
        cargarFuncionesGraficos()
    
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
        event.textContent = suc_add[i];
    })
    let etiquetas_dos = document.querySelectorAll(".color_total_sucursal");
    etiquetas_dos.forEach((event, i)=>{
        event.textContent = suc_add[i];
    })
};
function crearElementoCanvas(){
    document.getElementById("contenedor_avance_mes_sucursal").innerHTML = `<canvas id="avance-mes-sucursal" class="gradico_resumen"></canvas>`
    document.getElementById("contenedor_numero_mes_sucursal").innerHTML = `<canvas id="numero-ventas-sucursal" class="gradico_resumen"></canvas>`
    document.getElementById("contenedor_devolucion_mes_sucursal").innerHTML = `<canvas id="devolucion-ventas-sucursal" class="gradico_resumen"></canvas>`

    document.getElementById("contenedor_ventas_mensuales").innerHTML = `<canvas id="ventas_mensuales" class="gradico_anual"></canvas>`

    document.getElementById("contenedor_circulo_ventas").innerHTML = `<canvas id="grafico_circulo_ventas"></canvas>`
    document.getElementById("contenedor_circulo_margen").innerHTML = `<canvas id="grafico_circulo_margen"></canvas>`
    document.getElementById("contenedor_circulo_gastos").innerHTML = `<canvas id="grafico_circulo_gastos"></canvas>`

    document.querySelectorAll(".contenedor_margen_sucursal_dos").forEach((event)=>{
        event.innerHTML = `<canvas class="margen_sucursal_dos"></canvas>`
    })
    document.getElementById("contenedor_ventas_mensuales_sucursal").innerHTML = `<canvas id="ventas_mensuales_sucursal" class="gradico_anual"></canvas>`
    document.getElementById("contenedor_acumulado_ventas_costos").innerHTML = `<canvas id="acumulado_ventas_costos" class="gradico_circular"></canvas>`
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Gráficos horizontales => desempeño mensual
function avanceMensualPorSucursal(){
    let array_ = [];
    suc_add.forEach((event, i)=>{
        array_.push(0);
        let suc_ = suc_db.find(x=> x.sucursal_nombre === event)
        if(suc_){
            ventasMensualesSucursales.forEach((e)=>{
                if(e.mes === new Date().getMonth() + 1 && suc_.id_sucursales === e.sucursal){
                    array_[i] = formatoMoneda(e.suma_ventas);
                }
            })
        }
    })
    graficoBarrasHorizontal(document.getElementById('avance-mes-sucursal'), array_, 'S/ ');
};
function avanceDiarioPorSucursal(){
    let array_ = [];
    suc_add.forEach((event, i)=>{
        array_.push(0);
        let suc_ = suc_db.find(x=> x.sucursal_nombre === event)
        if(suc_){
            ventasDiaSucursales.forEach((e)=>{
                e.sucursal === suc_.id_sucursales ? array_[i] = formatoMoneda(e.suma_ventas_dia) : "";
            });
        }
    });
    graficoBarrasHorizontal(document.getElementById('numero-ventas-sucursal'), array_, 'S/ ');
};
function devolucionMensualPorSucursal(){
    let array_ = [];
    suc_add.forEach((event, i)=>{
        array_.push(0);
        let suc_ = suc_db.find(x=> x.sucursal_nombre === event)
        if(suc_){
            ventasMensualesSucursales.forEach((e)=>{
                if(e.mes === new Date().getMonth() + 1 && suc_.id_sucursales === e.sucursal){
                    array_[i] = e.unidades_devueltas;
                }
            })
        }
    })
    graficoBarrasHorizontal(document.getElementById('devolucion-ventas-sucursal'), array_, 'Unidades ');
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
        let suma_t_v = 0;
        let suma_t_c = 0;
        let suma_t_m = 0;
        ventasMensualesSucursales.forEach((event)=>{
            if(event.mes == i + 1){
                suma_mensual_ventas += event.suma_ventas
                suma_t_v +=event.suma_ventas;
                suma_t_c +=event.suma_costos;
                suma_t_m +=event.mes;
            };
        });
        array_ventas_total.push(suma_t_v);
        array_costos_total.push(suma_t_c);
        array_meses.push(suma_t_m);

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

    graficoBarrasVertical(document.getElementById('ventas_mensuales'), array_ventas_total, array_costos_total, ['Ventas Mensuales', 'Costos Mensuales'])
};

async function graficoDonaEfectivo(){
    let array_nom_dos = [
                            "Costos laborales",
                            "Gastos operativos",
                            "Costos financieros",
                            "Otros",
                        ]
    
    let array_gastos = [0,0,0,0]
    const sumaTotal = ventasMensualesSucursales.reduce((total, elemento) => {
        total.suma_costos += elemento.suma_costos;
        total.suma_ventas += elemento.suma_ventas;
        total.suma_ventas_esperado += elemento.suma_ventas_esperado;
        return total;
    }, { suma_costos: 0, suma_ventas: 0, suma_ventas_esperado: 0 });

    graficoDonaDos(document.getElementById("grafico_circulo_ventas"), ['Ventas esperadas', 'Ventas reales'], [sumaTotal.suma_ventas_esperado, sumaTotal.suma_ventas], 
    cls, 
    cls_dos, true
    )
    graficoDona(document.getElementById("grafico_circulo_margen"), ['Margen esperado', 'Margen real'], [(sumaTotal.suma_costos/sumaTotal.suma_ventas_esperado)*100, (sumaTotal.suma_costos/sumaTotal.suma_ventas)*100], 
    cls[0], 
    cls_dos[1], true, '%'
    )

    gastos_grafico_detallado.forEach((event)=>{
        array_gastos[0] += (event._nomina + event._seguridad_social);
        array_gastos[1] += (event._alquiler + event._mantenimientos + event._servicios + event._publicidad + event._impuestos);
        array_gastos[2] += (event._pago_prestamos + event._depositos);
        array_gastos[3] += event._otros;
    });
    
    graficoDonaDos(document.getElementById("grafico_circulo_gastos"), array_nom_dos, array_gastos, cls, cls_dos)


};
function totalVentasPorMesSucursal(){
    
    let array_suma_ventas = [];
    let array_suma_costos = [];
    let arrays = [];
    let arrays_costo = [];
    let sumaMasAlto = 0;

    suc_add.forEach((event, i) => {
        let c_s = suc_db.find(x => x.sucursal_nombre === event);
        arrays[i] = Array(12).fill(0);
        arrays_costo[i] = Array(12).fill(0);

        ventasMensualesSucursales.forEach((venta) => {
            if (c_s && venta.sucursal === c_s.id_sucursales) {
                let mesIndex = venta.mes - 1;
                arrays[i][mesIndex] = venta.suma_ventas;
                arrays_costo[i][mesIndex] = venta.suma_costos;
                if (sumaMasAlto < venta.suma_ventas) {
                    sumaMasAlto = venta.suma_ventas;
                }
            }
        });
    });

    for(let i = 0; i < arrays.length; i++){
        array_suma_ventas[i] = arrays[i].reduce((a, b) => a + b, 0);
        array_suma_costos[i] = arrays_costo[i].reduce((a, b) => a + b, 0);
    }
    //Gráficos dona de margen de gananacia
    graficoPolarDoble(document.getElementById('acumulado_ventas_costos'), array_suma_ventas, array_suma_costos, suc_add)
    
    document.querySelectorAll(".margen_sucursal_dos").forEach((event, i)=>{
        graficoDona(    
                        event, ['% Ganancia', '% Costo'],
                        [(1 - (array_suma_costos[i]/array_suma_ventas[i]))*100, 
                        (array_suma_costos[i]/array_suma_ventas[i])*100], cls[i], cls_dos[i], false, '%'
                    )
    });
    graficoLineasVertical(document.getElementById('ventas_mensuales_sucursal'),arrays[0], arrays[1], arrays[2], arrays[3], arrays[5], mes_anio, suc_add)
};

