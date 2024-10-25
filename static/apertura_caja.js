document.addEventListener("DOMContentLoaded", inicioAperturaCaja)
function inicioAperturaCaja(){
    inicioTablasCaja()
    btnVentas = 1;
    
};
let fecha_hoy = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
let filas_total_bd = {value: 0};
let indice_tabla = {value : 1};
let num_filas_tabla = {value: 0};
let inicio = 0;
let fin = 0;
let base_datos = {array: []}
let consolidado_efectivo = [];
async function inicioTablasCaja(){
    
    inicioTablasAperturra()
    sucursalesCajaApertura()
 
    await cargarAperturaHoy()
    saldoCierre()
};
async function inicioTablasAperturra(){
    await conteoFilas(subRutaA(0), filas_total_bd, indice_tabla, 
                    document.getElementById("numeracionTablaCaja"), 20)
    await searchDatos(subRutaB(document.getElementById("numeracionTablaCaja").value - 1, 0), 
                    base_datos,"#tabla-caja")
    avanzarTabla(document.getElementById("avanzarCaja"), 
                document.getElementById("retrocederCaja"), 
                document.getElementById("numeracionTablaCaja"), 
                num_filas_tabla, indice_tabla, 
                filas_total_bd, 20, 
                base_datos,"#tabla-caja")
    atajoTabla(document.getElementById("numeracionTablaCaja"), 20, base_datos, 
                "#tabla-caja", indice_tabla, num_filas_tabla)
    filtro(document.getElementById("buscarFiltrosCaja"), 
            indice_tabla, num_filas_tabla, filas_total_bd, 
            document.getElementById("numeracionTablaCaja"), 20, 
            base_datos, "#tabla-caja")
    restablecerTabla(document.getElementById("restablecerCaja"), 
                    indice_tabla, num_filas_tabla, filas_total_bd, 
                    document.getElementById("numeracionTablaCaja"), 20, base_datos, "#tabla-caja")
};
////////////////////////////////////////////////////////////////////////////////////////////////////
const btnCaja = document.getElementById("apertura-caja");
btnCaja.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/apertura_caja";
    document.getElementById("apertura-caja").classList.add("marcaBoton")
});
const btnEntradas = document.getElementById("entradas-caja");
btnEntradas.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/ventas";
    document.getElementById("buscador-productos-ventas").focus()
});
const btnSalidas = document.getElementById("salidas-caja");
btnSalidas.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/salidas_caja";
});
function subRutaA(index){
    let fecha_inicio = ['2000-01-01', inicio]
    let fecha_fin = [new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(), fin]
    return  `caja_conteo?`+
            `sucursal_aper_caja=${document.getElementById("filtro-tabla-caja-sucursal").value}&`+
            `fecha_inicio_aper_caja=${fecha_inicio[index]}&`+
            `fecha_fin_aper_caja=${fecha_fin[index]}`
};
function subRutaB(num, index){
    let fecha_inicio = ['2000-01-01', inicio]
    let fecha_fin = [new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(), fin]  
    return  `caja_tabla/${num}?`+
            `sucursal_aper_caja=${document.getElementById("filtro-tabla-caja-sucursal").value}&`+
            `fecha_inicio_aper_caja=${fecha_inicio[index]}&`+
            `fecha_fin_aper_caja=${fecha_fin[index]}`
};
function cuerpoFilaTabla(e){
    return  `<tr class="fila-caja">
                <td class="invisible">${e.id_caja}</td>
                <td style="border-left: 7px solid ${CS(e.sucursal_nombre)};">${e.sucursal_nombre}</td>
                <td style="text-align: right;">${e.saldo_apertura.toFixed(2)}</td>
                <td style="text-align: right;">${e.ingresos.toFixed(2)}</td>
                <td style="text-align: right;">${e.egresos.toFixed(2)}</td>
                <td style="text-align: right;">${e.saldo_cierre.toFixed(2)}</td>
                <td style="text-align: center;">${e.fecha_caja}</td>
                <td class="invisible">${e.llave_caja}</td>
                <td style="background: ${e.llave_caja === 0 ? 'var(--boton-uno)' : 'var(--boton-dos)'}">${e.llave_caja === 0 ? "Aperturado" : "Cerrado"}</td>
                <td style="display: flex; justify-content: center;">
                    <button onClick="buttonCerrarCaja(${e.id_caja}, ${e.llave_caja})" class="acciones_caja">Cerrar</button>
                </td>
                <td class="invisible">${e.sucursal_caja}</td>
            </tr>`
};
function vaciadoInputBusqueda(){
    document.getElementById("filtro-tabla-caja-fecha-inicio").value = ""
    document.getElementById("filtro-tabla-caja-fecha-fin").value = ""
    document.getElementById("filtro-tabla-caja-sucursal").value = ""
};
function manejoDeFechas(){
    inicio = document.getElementById("filtro-tabla-caja-fecha-inicio").value;
    fin = document.getElementById("filtro-tabla-caja-fecha-fin").value;
    if(inicio == "" && fin == ""){
        inicio = '2000-01-01';
        fin = fecha_hoy
    }else if(inicio == "" && fin != ""){
        inicio = '2000-01-01';
    }else if(inicio != "" && fin == ""){
        fin = fecha_hoy;
    };
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let gasto_hoy = []
let apertura_hoy = []
let sucursal_caja_apertura = []
function sucursalesCajaApertura(){
    document.querySelectorAll(".titulo_apertura_caja").forEach((event, i)=>{
            event.textContent = suc_add[i]
    });
};

async function cargarAperturaHoy(){
    consolidado_efectivo = await cargarDatos(   `sucursales_consolidacion_efectivo?`+
                                                `fecha_inicio_sucursal=${fecha_hoy}&`+
                                                `fecha_fin_sucursal=${fecha_hoy}`)
    let saldo_apertura_ = document.querySelectorAll(".saldo_apertura_caja");
    let ingresos_ventas_ = document.querySelectorAll(".ingresos_caja_ventas");
    let egresos_efectivo_ = document.querySelectorAll(".egresos_caja_gastos");
    let saldo_cierre_ = document.querySelectorAll(".saldo_cierre_caja");

    suc_add.forEach((event, i)=>{
        let suc_ = suc_db.find(x=> x.sucursal_nombre === event)
        consolidado_efectivo.forEach((e)=>{
            if(suc_ && e.id_sucursales === suc_.id_sucursales){
                saldo_apertura_[i].value = (e.saldo_apertura ? e.saldo_apertura : 0).toFixed(2)
                ingresos_ventas_[i].value = (   (e.suma_ventas ? e.suma_ventas: 0) + 
                                                (e.suma_creditos ? e.suma_creditos: 0)).toFixed(2)
                egresos_efectivo_[i].value = (e.suma_gastos ? e.suma_gastos : 0).toFixed(2)
                saldo_cierre_[i].value = (  Number(saldo_apertura_[i].value) +
                                            Number(ingresos_ventas_[i].value) -
                                            Number(egresos_efectivo_[i].value)).toFixed(2)
                e.llave_caja === 0 ? (  document.querySelectorAll(".flecha_apertura_caja")[i].style.transform = "rotate(270deg)",
                                        document.querySelectorAll(".flecha_apertura_caja")[i].style.color = "#77E578") : 
                                     (  document.querySelectorAll(".flecha_apertura_caja")[i].style.transform = "rotate(90deg)",
                                        document.querySelectorAll(".flecha_apertura_caja")[i].style.color = "#994d40");
            };
        });
    });
};
function saldoCierre(){
    document.querySelectorAll(".saldo_apertura_caja").forEach((event, i)=>{
        event.addEventListener("keyup", ()=>{
            document.querySelectorAll(".saldo_cierre_caja")[i].value = (Number(event.value) + 
                                                                        Number(document.querySelectorAll(".ingresos_caja_ventas")[i].value) - 
                                                                        Number(document.querySelectorAll(".egresos_caja_gastos")[i].value)).toFixed(2)
        });
    });
};

let btn_aperturar = document.querySelectorAll(".btn_apertura_caja")
btn_aperturar.forEach((event, i)=>{
    event.addEventListener("click", async (e)=>{
        e.preventDefault();
        let suc_ = suc_db.find(x=> x.sucursal_nombre === suc_add[i])
        if(suc_){
            let fila = consolidado_efectivo.find(x => x.id_sucursales === suc_.id_sucursales);
            if(fila === undefined || fila.llave_caja === undefined || fila.llave_caja === 1){
                modal_proceso_abrir(`Aperturando caja en ${event.parentNode.children[0].children[0].textContent}.`, "")
                let data = {
                    "sucursal_caja": suc_.id_sucursales,
                    "saldo_apertura": document.querySelectorAll(".saldo_apertura_caja")[i].value,
                    "ingresos": document.querySelectorAll(".ingresos_caja_ventas")[i].value,
                    "egresos": document.querySelectorAll(".egresos_caja_gastos")[i].value,
                    "saldo_cierre": document.querySelectorAll(".saldo_cierre_caja")[i].value,
                    "fecha_caja": generarFecha(),
                    "llave_caja": 0
                };
                
                 (fila && fila.id_caja) ? data.id_caja = fila.id_caja : "";

                let url = URL_API_almacen_central + 'caja'
                let response = await funcionFetch(url, data)
                if(response.status === 200){
                    modal_proceso_abrir(`Caja en ${event.parentNode.children[0].children[0].textContent} aperturada.`, "")
                    modal_proceso_salir_botones()
                    manejoDeFechas()
                    await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, document.getElementById("numeracionTablaCaja"), 20)
                    await searchDatos(subRutaB((document.getElementById("numeracionTablaCaja").value - 1) * 20, 1), base_datos,"#tabla-caja")
                    await cargarAperturaHoy()
                };
                if(document.querySelector("#tabla-caja > tbody").children.length === 0){
                    location.reload();
                };
            }else{
                modal_proceso_abrir(`Esta caja ya fue aperturada.`, "")
                modal_proceso_salir_botones()
            };
        };
    });
});
let btn_cerrar = document.querySelectorAll(".btn_cerrar_caja")
btn_cerrar.forEach((event, i)=>{
    event.addEventListener("click", async (e)=>{
        e.preventDefault();
        let suc_ = suc_db.find(x=> x.sucursal_nombre === suc_add[i])
        if(suc_){
            let fila = consolidado_efectivo.find(x => x.id_sucursales === suc_.id_sucursales);
            if(fila && fila.llave_caja === 0){
                modal_proceso_abrir(`Cerrando caja en ${event.parentNode.children[0].children[0].textContent}.`, "")
                let data = {
                    "id_caja": fila.id_caja,
                    "sucursal_caja": fila.id_sucursales,
                    "saldo_apertura": document.querySelectorAll(".saldo_apertura_caja")[i].value,
                    "ingresos": document.querySelectorAll(".ingresos_caja_ventas")[i].value,
                    "egresos": document.querySelectorAll(".egresos_caja_gastos")[i].value,
                    "saldo_cierre": document.querySelectorAll(".saldo_cierre_caja")[i].value,
                    "llave_caja": 1
                };
    
                let url = URL_API_almacen_central + 'caja'
                let response = await funcionFetch(url,data)
                if(response.status === 200){
                    modal_proceso_abrir(`Caja en ${event.parentNode.children[0].children[0].textContent} cerrada.`, "")
                    modal_proceso_salir_botones()
                    manejoDeFechas()
                    await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, document.getElementById("numeracionTablaCaja"), 20)
                    await searchDatos(subRutaB((document.getElementById("numeracionTablaCaja").value - 1) * 20, 1), base_datos,"#tabla-caja")
                    await cargarAperturaHoy()
                };
            }else{
                modal_proceso_abrir(`Esta acción no se puede realizar debido a que esta caja no está aperturada.`, "")
                modal_proceso_salir_botones()
            };
        }
    });
});
/////////////////////////////////////////////////////////////////////////////
async function buttonCerrarCaja(id, estado){
    if(Number(estado) === 0){
        modal_proceso_abrir("Cerrando caja.", "");
        let fila_caja = base_datos.array.find(x => x.id_caja === Number(id));
        let partesFecha = fila_caja.fecha_caja.split("-")
        let dia = partesFecha[0];
        let mes = partesFecha[1];
        let año = partesFecha[2];

        let consolidado_cerrar = await cargarDatos( `sucursales_consolidacion_efectivo?`+
                                                    `fecha_inicio_sucursal=${año}-${mes}-${dia}&`+
                                                    `fecha_fin_sucursal=${año}-${mes}-${dia}`)
        let consolidado_no_cerrado = consolidado_cerrar.find(y => y.id_sucursales === Number(fila_caja.sucursal_caja))

        function DataCaja(){
            this.id_caja = fila_caja.id_caja;
            this.sucursal_caja = fila_caja.sucursal_caja;
            this.saldo_apertura = fila_caja.saldo_apertura;
            this.ingresos = (consolidado_no_cerrado.suma_ventas ? consolidado_no_cerrado.suma_ventas : 0) +
                            (consolidado_no_cerrado.suma_creditos ? consolidado_no_cerrado.suma_creditos : 0)
            this.egresos = consolidado_no_cerrado.suma_gastos ? consolidado_no_cerrado.suma_gastos : 0;
            this.saldo_cierre = this.saldo_apertura + this.ingresos - this.egresos;
            this.llave_caja = 1
        };
        let data_caja = new DataCaja()
        let url = URL_API_almacen_central + 'caja'
        let response = await funcionFetch(url, data_caja)
        if(response.status === 200){
            manejoDeFechas()
            await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, document.getElementById("numeracionTablaCaja"), 20)
            await searchDatos(subRutaB((document.getElementById("numeracionTablaCaja").value - 1) * 20, 1), base_datos,"#tabla-caja")
            await cargarAperturaHoy()
            modal_proceso_abrir("Caja cerrada.", "")
            modal_proceso_salir_botones()
        }else{
            modal_proceso_abrir("Operacion no realizada.", "")
            modal_proceso_salir_botones()
        };
    }else{
        modal_proceso_abrir("Esta acción no se puede efectuar sobre una caja cerrada.", "")
        modal_proceso_salir_botones()
    }
}