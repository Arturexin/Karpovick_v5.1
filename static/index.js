document.addEventListener("DOMContentLoaded", init)
function init(){
    inicioColoresFondo();
    cambioColorFondo();
    sidebarMarcadito();

    cargarIndices();
    cambiarAnio();
    agregarMoneda(document.querySelectorAll(".moneda_cabecera"))

    menuVertical()
};
const URL_API_almacen_central = 'http://127.0.0.1:3000/api/'

function generarFecha(){
    const fecha = new Date(); 
    const dia = String(fecha.getDate()).padStart(2, '0'); // Asegura que el día tenga dos dígitos 
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Asegura que el mes tenga dos dígitos 
    const anio = fecha.getFullYear();
    const hora = String(fecha.getHours()).padStart(2, '0')
    const minuto = String(fecha.getMinutes()).padStart(2, '0')
    const segundo = String(fecha.getSeconds()).padStart(2, '0')
    return `${anio}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
};
let clave_form = 0;
let sucursales_activas = ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st', 'existencias_sc'];
let suc_add = ["Almacén Central", "Sucursal Uno", "Sucursal Dos", "Sucursal Tres", "Sucursal Cuatro"];
let mapa_calor = [
    'rgba(145, 255, 133, 0.6)', // #91ff85
    'rgba(198, 245, 86, 0.6)',  // #C6F556
    'rgba(245, 207, 111, 0.6)', // #F5CF6F
    'rgba(222, 139, 89, 0.6)',  // #DE8B59
    'rgba(255, 102, 109, 0.6)'  // #FF666D
];

const meses_letras = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Set","Oct","Nov","Dic",]
const monedas = { 
                    "Balboa": "B/.",
                    "Bolívar_venezolano": "Bs.",
                    "Boliviano": "Bs.",
                    "Colón_costarricense": "₡",
                    "Córdoba": "C$",
                    "Dólar_beliceño": "BZ$",
                    "Dólar_estadounidense": "$",
                    "Guaraní": "₲",
                    "Lempira_hondureño": "L",
                    "Peso_chileno": "CLP$",
                    "Peso_colombiano": "COL$",
                    "Peso_mexicano": "MXN$",
                    "Peso_uruguayo": "UYU$",
                    "Quetzal": "Q",
                    "Real_brasileño": "R$",
                    "Sol_peruano": "S/",
                    "Nada": "",
                }; 

function moneda(){
    return monedas[JSON.parse(localStorage.getItem("datos_negocio"))[0].moneda]
};
function agregarMoneda(elemento){
    elemento.forEach((event)=>{
        event.textContent = `${moneda()}`;
    });
};

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
let mes_anio = arrayFechaMes(new Date().getFullYear() % 100)
function arrayFechaMes(obtenerAnio){
    return [`Ene-${obtenerAnio}`, `Feb-${obtenerAnio}` ,`Mar-${obtenerAnio}` ,`Abr-${obtenerAnio}` ,`May-${obtenerAnio}` ,`Jun-${obtenerAnio}`, 
            `Jul-${obtenerAnio}`, `Ago-${obtenerAnio}`, `Set-${obtenerAnio}`, `Oct-${obtenerAnio}`, `Nov-${obtenerAnio}` ,`Dic-${obtenerAnio}`];
}
function cambiarAnio(){
    let anio_referencia = document.getElementById("anio_referencia")
    anio_referencia.value = new Date().getFullYear()
    anio_referencia.setAttribute("max", new Date().getFullYear())
    let suma = 0;
    document.getElementById("suma_anio").addEventListener("click", ()=>{
        if(anio_referencia.value < new Date().getFullYear()){
            suma += 1;
            anio_referencia.value = new Date().getFullYear() + suma
            mes_anio = arrayFechaMes((anio_referencia.value).slice(-2))
        }
    })
    document.getElementById("resta_anio").addEventListener("click", ()=>{
        if(anio_referencia.value > 0){
            suma -= 1;
            anio_referencia.value = new Date().getFullYear() + suma
            mes_anio = arrayFechaMes((anio_referencia.value).slice(-2))
        }
    })
}
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
document.getElementById("actualizar_bases").addEventListener("click", async (event)=>{
    modal_proceso_abrir("Actualizando base de datos.", "")
    localStorage.clear()
    await cargarIndices()
    agregarMoneda(document.querySelectorAll(".moneda_cabecera"))
    modal_proceso_abrir("Base de datos actualizada con éxito.", "")
    modal_proceso_salir_botones()
});
async function cargarIndices(){
    try{
        modal_proceso_abrir("Cargando datos...", "", "")
        if(!localStorage.getItem("inventarios_consulta") || JSON.parse(localStorage.getItem("inventarios_consulta")).length === 0){
            localStorage.setItem("inventarios_consulta", JSON.stringify(await cargarDatos('almacen_central_ccd')))
            await delay(100)
        };
        if(!localStorage.getItem("sucursal_consulta") || JSON.parse(localStorage.getItem("sucursal_consulta")).length === 0){
            localStorage.setItem("sucursal_consulta", JSON.stringify(await cargarDatos('sucursales_index')))
            await delay(100)
        };
        if(!localStorage.getItem("categoria_consulta") || JSON.parse(localStorage.getItem("categoria_consulta")).length === 0){
            localStorage.setItem("categoria_consulta", JSON.stringify(await cargarDatos('categorias')))
            await delay(100)
        };
        if(!localStorage.getItem("proveedores_consulta") || JSON.parse(localStorage.getItem("proveedores_consulta")).length === 0){
            localStorage.setItem("proveedores_consulta", JSON.stringify(await cargarDatos('proveedores')))
            await delay(100)
        };
        if(!localStorage.getItem("clientes_consulta") || JSON.parse(localStorage.getItem("clientes_consulta")).length === 0){
            localStorage.setItem("clientes_consulta", JSON.stringify(await cargarDatos('clientes_ventas')))
            await delay(100)
        };
        if(!localStorage.getItem("datos_negocio") || JSON.parse(localStorage.getItem("datos_negocio")).length === 0){
            localStorage.setItem("datos_negocio", JSON.stringify(await cargarDatos('numeracion_comprobante_datos')))
            await delay(100)
        };
        if(!localStorage.getItem("datos_usuario") || JSON.parse(localStorage.getItem("datos_usuario")).length === 0){
            localStorage.setItem("datos_usuario", JSON.stringify(await cargarDatos('datos_usuario')))
            await delay(100)
        };
        
        modal_proceso_cerrar();
    }catch (error){
        alert('Error al cargar índices:', error.message);
        console.error('Error al cargar índices:', error.message);
    };
};

let inv_db = JSON.parse(localStorage.getItem("inventarios_consulta"));
let inv_db_grupo = dividirProductosDinamicamente(inv_db);
let suc_db = JSON.parse(localStorage.getItem("sucursal_consulta"));
let cat_db = JSON.parse(localStorage.getItem("categoria_consulta"));
let prv_db = JSON.parse(localStorage.getItem("proveedores_consulta"));
let cli_db = JSON.parse(localStorage.getItem("clientes_consulta"));
let usu_db = JSON.parse(localStorage.getItem("datos_usuario"));
let neg_db = JSON.parse(localStorage.getItem("datos_negocio"));

usu_db !== null ? document.getElementById("usuario-cliente").textContent = usu_db.nombre_usuario: "";

async function cargarDatos(ruta){
    let url = URL_API_almacen_central + ruta
    try{
        let respuesta  = await fetch(url, {
            "method": 'GET',
            "headers": {
                "Content-Type": 'application/json'  
            }
        });
        if (!respuesta.ok) {
            throw new Error("Error en la respuesta de la API: " + respuesta.statusText);
        };
        
        return await respuesta.json();
    } catch (error) {
        console.error("Error durante la solicitud:", error);
        throw error;
    };
};
async function funcionFetch(url, fila){
    try {
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(fila),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error("Error en la respuesta de la API: " + response.statusText);
        };
        await delay(500);
        return response;
    } catch (error) {
        console.error("Error durante la solicitud:", error);
        throw error;
    };
};
async function funcionFetchDos(url, fila){
    try {
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(fila),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error("Error en la respuesta de la API: " + response.statusText);
        }
        await delay(500);
        // Convertir la respuesta a JSON
        let data = await response.json();
        return data;  // Retorna el JSON con la respuesta de la API

    } catch (error) {
        console.error("Error durante la solicitud:", error);
        throw error;  // Propaga el error si lo hay
    }
};
function obtenerIndiceSucursal(select){
    let indice = ""
    let nom_ = suc_db.find(x => x.id_sucursales === Number(document.querySelector(select).value))
    suc_add.forEach((e, i)=>{
        if(e === nom_.sucursal_nombre){
            indice = i
        }
    })
    return indice
}
function cargarSucursalesEjecucion(elemento_id){// SE LLAMA AL CARGAR LA PAGINA INDEX
    
    let html_sucursal = ''
    for(let i = 0; i < suc_db.length; i++){
        let fila = ""
        if(usu_db.puesto_usuario == 1){
            fila = `<option value="${suc_db[1].id_sucursales }">${suc_db[1].sucursal_nombre}</option>`
            html_sucursal = html_sucursal + fila;
            break
        }else if(usu_db.puesto_usuario == 2){
            fila = `<option value="${suc_db[2].id_sucursales }">${suc_db[2].sucursal_nombre}</option>`
            html_sucursal = html_sucursal + fila;
            break
        }else if(usu_db.puesto_usuario == 3){
            fila = `<option value="${suc_db[3].id_sucursales }">${suc_db[3].sucursal_nombre}</option>`
            html_sucursal = html_sucursal + fila;
            break
        }else if(usu_db.puesto_usuario == 4){
            fila = `<option value="${suc_db[4].id_sucursales }">${suc_db[4].sucursal_nombre}</option>`
            html_sucursal = html_sucursal + fila;
            break
        }else{
            fila = `<option value="${suc_db[i].id_sucursales }">${suc_db[i].sucursal_nombre}</option>`
            html_sucursal = html_sucursal + fila;
        }
    }
    elemento_id.innerHTML = html_sucursal
};
function llenarCategoriaProductosEjecucion(){
    let html_cat = `<option value="0" selected>-- Seleccione una categoría --</option>`;
    for(categoria of cat_db) {
        let fila = `<option value="${categoria.id}">${categoria.categoria_nombre}</option>`
        html_cat = html_cat + fila;
    };
    return html_cat;
};
function baseProv(){
    prov_con = JSON.parse(localStorage.getItem("proveedores_consulta"))
   let html = `<option value="0" selected>-- Seleccione un proveedor --</option>`;
    for(prov of prov_con) {
        let fila;
            fila = `<option value="${prov.id_cli}">${prov.nombre_cli}</option>`
        html = html + fila;
    };
    return html;
}
function categoriaProductosCreacion(categoria){
    let array = [];
    const event = categoria;
    let cat = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce']
    let cat_id = cat_db.find(x=> x.id === Number(event.value))
    if(cat_id){
        cat.forEach((e)=>{
            cat_id[e] !== "" ? array.push(cat_id[e]): "";
        })
    };
    return array;
};
////////////////////////////////////////////////////////////////
const cerrarSesion = document.getElementById("cerrar-sesion");
cerrarSesion.addEventListener("click", async () => {
    localStorage.clear();
    modal_proceso_abrir("Cerrando sesión...", "", "")
    
    let response  = await fetch('/logout', {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'  
        }
    });
    await delay(1000)
    if(response.ok){
        location.href = response.url
    };
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

function imprimirListaTabla() {
    let contenido = document.getElementById('tabla_principal').innerHTML;
    let ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write('<html><head><title>Contenido para imprimir con estilos</title>');
    ventanaImpresion.document.write('<style>');
    ventanaImpresion.document.write('.invisible, .tooltip, .label-checkbox, .myButtonProcesar { display: none;}');
    ventanaImpresion.document.write('.contenido th { padding: 0 10px; background: #755555}');
    ventanaImpresion.document.write('</style>');
    ventanaImpresion.document.write('</head><body style="width: 700px; background: rgba(5, 5, 5, 1); color: #eee;margin-left: auto; margin-right: auto;">');
    ventanaImpresion.document.write('<table class="contenido">');
    ventanaImpresion.document.write(contenido);
    ventanaImpresion.document.write('</table>');
    ventanaImpresion.document.write(`<p>${new Date()}</p>`);
    ventanaImpresion.document.write('</body></html>');
    ventanaImpresion.document.write('<button onclick="window.print()">Imprimir</button>');
    ventanaImpresion.document.close();
    document.querySelector("#check_comprobante").checked = false
};

////////////////////// Función para dividir productos en grupos según el primer carácter del código
function dividirProductosDinamicamente(productos) {
    let grupos = {};
    
    productos.forEach(producto => {
        // Obtener el primer carácter del código en mayúscula
        let primerCaracter = producto.codigo[0].toUpperCase();
        
        // Si el grupo no existe, se crea un nuevo array para ese carácter
        if (!grupos[primerCaracter]) {
            grupos[primerCaracter] = [];
        }
        
        // Agregar el producto al grupo correspondiente
        grupos[primerCaracter].push(producto);
    });
    return grupos;
}

// Función para buscar productos en los grupos generados
function buscarProductosDinamicamente(texto) {
    if(texto !== ""){

        let textoBuscado = texto.toLowerCase();
        let primerCaracter = textoBuscado[0].toUpperCase();
        
        // Buscar en el grupo correspondiente si existe
        if (!inv_db_grupo[primerCaracter]) {
            return undefined; // Si no existe el grupo, no hay resultados
        }
        
        // Filtrar los productos en el grupo seleccionado
        return inv_db_grupo[primerCaracter].find(y => y.codigo.toLowerCase().startsWith(texto.toLowerCase()))
        return productosPorGrupo[primerCaracter].filter(producto => producto.codigo.toLowerCase().startsWith(textoBuscado));
    }
};
/* function dividirProductosDinamicamente(productos) {
    let grupos = {};

    if (!Array.isArray(productos)) {
        console.error("El argumento debe ser un array");
        return grupos;
    }

    productos.forEach(producto => {
        if (producto.codigo && typeof producto.codigo === 'string') {
            let nivel = grupos;
            for (let i = 0; i < 3; i++) {// la agrupación se hará hasta un tercer nivel
                let caracter = producto.codigo[i].toUpperCase();
                
                if (caracter === '-') {
                    // Detener agrupamiento si encuentra un guion
                    break;
                }

                if (!nivel[caracter]) {
                    nivel[caracter] = {};
                }
                // Si es el último carácter o el siguiente es un guion, guarda el producto
                if (i === 2 || producto.codigo[i + 1] === '-') {
                    if (!Array.isArray(nivel[caracter])) {
                        nivel[caracter] = [];
                    }
                    nivel[caracter].push(producto);
                } else {
                    nivel = nivel[caracter];
                }
            }
        } else {
            console.warn("Producto sin código o con código no válido:", producto);
        }
    });

    return grupos;
}


// Función para buscar productos en los grupos generados
function buscarProductosDinamicamente(texto) {
    if (texto !== "") {
        let textoBuscado = texto.toUpperCase();
        let nivel = inv_db_grupo;

        for (let i = 0; i < 3; i++) {
            let caracter = textoBuscado[i];
            
            if (caracter === '-') {
                break;
            }

            if (!nivel[caracter]) {
                return []; // Si no existe el grupo, no hay resultados
            }
            nivel = nivel[caracter];
        }

        // Filtrar los productos en el grupo seleccionado
        if (Array.isArray(nivel)) {
            return nivel.find(producto => producto.codigo.toLowerCase().startsWith(texto.toLowerCase()));
        } else {
            return [];
        }
    }
    return [];
} */
function buscarProducto(textoBusqueda){
    textoBusqueda.addEventListener("keyup", () =>{

        let prod_ = buscarProductosDinamicamente(textoBusqueda.value);

        if(prod_){
            document.getElementById('id-form').value = prod_.idProd
            document.getElementById('categoria-form').value = prod_.categoria
            document.getElementById('codigo-form').value = prod_.codigo
            document.getElementById('descripcion-form').value = prod_.descripcion
            if(document.getElementById('buscador-productos-form').value == ""){
                reseteoFormulario()
            }
        }else if(prod_ === undefined){
            reseteoFormulario();
            document.getElementById("buscador-productos-form").value = "";
        };
    });
};
////////////////////////////////////////////////////////////////////////////////////////
let cls = [ "rgb(230, 202, 123)",
    "rgb(145, 230, 156)",
    "rgb(99, 128, 230)",
    "rgb(230, 110, 141)",
    "rgb(77, 77, 77)"]
let cls_dos = [ "rgb(230, 202, 123, 0.1)",
        "rgb(145, 230, 156, 0.1)",
        "rgb(99, 128, 230, 0.1)",
        "rgb(230, 110, 141, 0.1)",
        "rgb(77, 77, 77, 0.1)"]
function CS(nombre_sucursal){
    let index = suc_add.findIndex(el => el === nombre_sucursal)
    return cls[index]
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}