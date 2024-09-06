document.addEventListener("DOMContentLoaded", inicioPerdidas)
let anio_principal = ""
function inicioPerdidas(){
    anio_principal = new Date().getFullYear()
    cargarSucursalesEjecucion(document.getElementById("fffff-sucursal"))
    cargarDatosAnio()
    graficoPerdidas()
    btnPerdidas = 1;
    cambioSucursalModificacion("fffff-sucursal")
    llenarCategoriaProductosEjecucion("#categoria-perdidas")
};
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
const barras_perdidas = [".cg_1_c", ".cg_2_c", ".cg_3_c", ".cg_4_c", ".cg_5_c"]
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        reinicioBarraGrafico(barras_perdidas);
        anio_principal = anio_referencia.value;

        graficoPerdidas()

        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////Pérdidas/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function cambioSucursalModificacion(id){
    document.getElementById(id).addEventListener("change", ()=>{
        document.getElementById("buscador-perdidas").value = ""
        document.getElementById("id-perdidas").value = ""
        document.getElementById("categoria-perdidas").value = ""
        document.getElementById("codigo-perdidas").value = ""
        document.getElementById("descripcion-perdidas").value = ""
        document.getElementById("buscador-perdidas").focus();
    });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let sucursal_id_perdidas = 0;
let sucursal_indice_perdidas = 0;
let formularioPerdidas = document.getElementById("formulario-perdidas");
function reseteoFormulario(){
    document.getElementById("id-perdidas").value = "";
    document.getElementById('categoria-perdidas').value = "0";
    document.getElementById('codigo-perdidas').value = "";
    document.getElementById('descripcion-perdidas').value = "";
};
document.addEventListener("keyup", (e) =>{
    indice_base = JSON.parse(localStorage.getItem("base_datos_consulta"))
    let almacenCentral = indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-perdidas').value.toLocaleLowerCase()))
    if(almacenCentral){
        document.getElementById('id-perdidas').value = almacenCentral.idProd

        sucursal_id_perdidas = document.getElementById("fffff-sucursal").value
        sucursal_indice_perdidas = document.getElementById("fffff-sucursal").selectedIndex
        document.getElementById('categoria-perdidas').value = almacenCentral.categoria
        document.getElementById('codigo-perdidas').value = almacenCentral.codigo
        document.getElementById('descripcion-perdidas').value = almacenCentral.descripcion
        if(document.getElementById('buscador-perdidas').value == ""){
            reseteoFormulario()
        }
    }else{
        reseteoFormulario()
    };
});
const procesarPerdidas = document.getElementById("agregarATablaPrePerdidas");
procesarPerdidas.addEventListener("click",async (e) =>{
    e.preventDefault();
    if(document.getElementById("codigo-perdidas").value !== ""){
        modal_proceso_abrir(`Procesando la ${document.querySelector("#motivo_salida").value}!!!.`, "")
        let datoCodigoUnitario;
        datoCodigoUnitario = await cargarDatos(`almacen_central_id_sucursal_datos/${document.getElementById('id-perdidas').value}?`+
                                                `sucursal_get=${sucursales_activas[sucursal_indice_perdidas]}`)
        let saldoPerdidas = 0;
        function DatosPerdidas(){
            this.idProd = document.getElementById('id-perdidas').value;
            this.sucursal_post = sucursales_activas[sucursal_indice_perdidas];
            this.existencias_post = datoCodigoUnitario.sucursal_get - document.getElementById('cantidad-perdida').value;
            saldoPerdidas = this.existencias_post;
            this.causa = document.getElementById('motivo_salida').value;
            this.cantidad = document.getElementById('cantidad-perdida').value;
            this.suc_perdidas = sucursal_id_perdidas;
            this.fecha_perdidas = generarFecha();
        }
        let perdProd = new DatosPerdidas()
        if(document.getElementById('cantidad-perdida').value > 0 && saldoPerdidas >= 0){
            let urlProductos = URL_API_almacen_central + 'procesar_perdida'
            let respuesta_productos = await funcionFetch(urlProductos, perdProd);
            console.log(respuesta_productos.status)
            if(respuesta_productos.status === 200){
                modal_proceso_abrir("Producto procesado", "")
                modal_proceso_salir_botones()
                formularioPerdidas.reset();
                document.getElementById("buscador-perdidas").focus();
            }
        }else if(document.getElementById('cantidad-perdida').value <= 0){
            modal_proceso_abrir("Coloque una cantidad mayor a cero.", "")
            modal_proceso_salir_botones()
            document.getElementById("cantidad-perdida").focus();
        }else if(saldoPerdidas < 0){
            modal_proceso_abrir("No cuenta con stock suficiente.", "")
            modal_proceso_salir_botones()
        };
    };
});

async function graficoPerdidas(){
    PerDonEntradas = await cargarDatos('suma_perdidas_donaciones_mes?'+
                                        `year_actual=${anio_principal}`)
                                        console.log(PerDonEntradas)
    let array_donaciones = [];
    let array_perdidas = [];
    let masAlto = 0;
    document.querySelectorAll(".f_l_g").forEach((event, i)=>{
        event.textContent = `${meses_letras[i]}${anio_principal % 100}`;
    })
    for(let i = 0; i < 12; i++){
        array_donaciones.push(0);
        array_perdidas.push(0);
        PerDonEntradas.forEach((event)=>{
            if(event.mes == i + 1){
                array_donaciones[i] = event.suma_donacion;
                array_perdidas[i] = event.suma_perdida;
            }
            if(masAlto < event.suma_donacion){masAlto = event.suma_donacion}
            if(masAlto < event.suma_perdida){masAlto = event.suma_perdida}
        });
    };
    let masAltoDos = (226 * masAlto)/214;
    document.querySelectorAll(".eje_y_numeracion").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos += 0.20 * ((226 * masAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_1_c"), array_donaciones, masAlto, colorFondoBarra[0], document.querySelectorAll(".sg_1_c"), 8, "")
    pintarGraficoPositivo(document.querySelectorAll(".cg_2_c"), array_perdidas, masAlto, colorFondoBarra[2], document.querySelectorAll(".sg_2_c"), 8, "")
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////