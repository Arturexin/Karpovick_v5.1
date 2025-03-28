let inicio = 0;
let fin = 0;
async function conteoFilas(sub_ruta, filas_total_bd, indice_tabla, input, num){
    filas_total_bd.value = await cargarDatos(sub_ruta)
    let html = "";
    for(let i = 1; i <= Math.ceil(filas_total_bd.value/num); i++) {
        let fila = `<option value="${i}">${i}</option>`
        html = html + fila;
    };
    input.innerHTML = html;
    input.value = indice_tabla.value;
};
async function searchDatos(sub_ruta, bd, id_tabla) {
    bd.array = await cargarDatos(sub_ruta)
    await delay(500)
    let html = ''
    if(bd.array.length > 0){
        for(e of bd.array){
            let fila =  cuerpoFilaTabla(e)
            html = html + fila;
        };
        document.querySelector(`${id_tabla} > tbody`).outerHTML = html;
    }else{
        modal_proceso_abrir("No se encontraron resultados.", "")
        modal_proceso_salir_botones()
        document.querySelector(`${id_tabla} > tbody`).outerHTML = html;
        document.querySelector(id_tabla).createTBody()
    };
};

function avanzarTabla(input_avanzar, input_retroceder, input_numeracion, num_filas_tabla, indice_tabla, filas_total_bd, num, bd, id_tabla) {
    input_avanzar.addEventListener("click", async () =>{
        if(num_filas_tabla.value + num < filas_total_bd.value){
            indice_tabla.value += 1
            num_filas_tabla.value += num
            input_numeracion.value = indice_tabla.value
            manejoDeFechas()
            modal_proceso_abrir("Buscando resultados...", "", "")
            await searchDatos(subRutaB(num_filas_tabla.value, 1), bd, id_tabla)
            modal_proceso_cerrar()
        };
    });
    input_retroceder.addEventListener("click", async () =>{
        if(indice_tabla.value > 1){
            indice_tabla.value -= 1
            num_filas_tabla.value -= num
            input_numeracion.value = indice_tabla.value
            manejoDeFechas()
            modal_proceso_abrir("Buscando resultados...", "", "")
            await searchDatos(subRutaB(num_filas_tabla.value, 1), bd, id_tabla)
            modal_proceso_cerrar()
        };
    });
    document.getElementById("_final_").addEventListener("click", async ()=>{
        if(input_numeracion.value < Math.ceil(filas_total_bd.value/num)){
            indice_tabla.value = Math.ceil(filas_total_bd.value/num)
            num_filas_tabla.value = Math.floor(filas_total_bd.value/num) * num === filas_total_bd.value ? filas_total_bd.value - num : Math.floor(filas_total_bd.value/num) * num
            input_numeracion.value = indice_tabla.value
            manejoDeFechas()
            modal_proceso_abrir("Buscando resultados...", "", "")
            await searchDatos(subRutaB(num_filas_tabla.value, 1), bd, id_tabla)
            modal_proceso_cerrar()
        }
    })
    document.getElementById("_inicio_").addEventListener("click", async () =>{
        if(indice_tabla.value > 1){
            indice_tabla.value = 1
            num_filas_tabla.value = 0
            input_numeracion.value = indice_tabla.value
            manejoDeFechas()
            modal_proceso_abrir("Buscando resultados...", "", "")
            await searchDatos(subRutaB(num_filas_tabla.value, 1), bd, id_tabla)
            modal_proceso_cerrar()
        };
    });
};
function atajoTabla(input_numeracion, num, bd, id_tabla, indice_tabla, num_filas_tabla){
    input_numeracion.addEventListener("change", async ()=>{
        modal_proceso_abrir("Buscando resultados...", "", "")
        manejoDeFechas()
        await searchDatos(subRutaB((input_numeracion.value - 1) * num, 1), bd, id_tabla)
        indice_tabla.value = Number(input_numeracion.value);
        num_filas_tabla.value = (input_numeracion.value - 1) * num;
        modal_proceso_cerrar()
    });
};
function filtro(button_filtro, indice_tabla, num_filas_tabla, filas_total_bd, input_numeracion, num, bd, id_tabla){
    button_filtro.addEventListener("click", async (e)=>{
        e.preventDefault();
        modal_proceso_abrir("Buscando resultados...", "", "")
        manejoDeFechas();
        indice_tabla.value = 1;
        num_filas_tabla.value = 0;
        await conteoFilas(subRutaA(1), filas_total_bd, indice_tabla, input_numeracion, num);
        await searchDatos(subRutaB(0, 1), bd, id_tabla);
        
        modal_proceso_abrir(`Se obtuvieron ${filas_total_bd.value} registros.`, "");
        modal_proceso_salir_botones();
    });
};
function restablecerTabla(button_restablecer, indice_tabla, num_filas_tabla, filas_total_bd, input_numeracion, num, bd, id_tabla){
    button_restablecer.addEventListener("click", async () =>{
        modal_proceso_abrir("Restableciendo tabla...", "", "")
        vaciadoInputBusqueda()
        indice_tabla.value = 1;
        num_filas_tabla.value = 0;
        await conteoFilas(subRutaA(0), filas_total_bd, indice_tabla, input_numeracion, num);
        await searchDatos(subRutaB(0, 0), bd, id_tabla);
        modal_proceso_abrir(`Tabla restablecida.`, "");
        modal_proceso_salir_botones();
    });
};
/////Formato CSV descarga
function arrayToCSV(array) {
    const headers = Object.keys(array[0]);
    const rows = array.map(obj =>
        headers.map(header => {
            // Comprueba si el valor es exactamente null o undefined; de lo contrario, usa el valor tal cual
            const value = obj[header] !== null && obj[header] !== undefined ? obj[header] : "";
            return JSON.stringify(value);
        }).join(';')
    );
    return [headers.join(';'), ...rows].join('\n');
}
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
    
function manejoDeFechas(){
    if(document.getElementById("_fecha_inicio_") && document.getElementById("_fecha_fin_")){
        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, '0'); // Asegura que el día tenga dos dígitos 
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Asegura que el mes tenga dos dígitos 
        const anio = fecha.getFullYear();
        inicio = document.getElementById("_fecha_inicio_").value;
        fin = document.getElementById("_fecha_fin_").value;
        if(inicio == "" && fin == ""){
            inicio = '2000-01-01';
            fin = `${anio}-${mes}-${dia}`
        }else if(inicio == "" && fin != ""){
            inicio = '2000-01-01';
        }else if(inicio != "" && fin == ""){
            fin = `${anio}-${mes}-${dia}`
        };
    }else{
        return "";
    }
};