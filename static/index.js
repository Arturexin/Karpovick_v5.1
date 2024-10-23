document.addEventListener("DOMContentLoaded", init)
function init(){
    inicioColoresFondo();
    cambioColorFondo();
    sidebarMarcadito();

    cargarIndices();
    cambiarAnio();
    agregarMoneda(document.querySelectorAll(".moneda_cabecera"))
};
const URL_API_almacen_central = 'http://127.0.0.1:3000/api/'
let fechaPrincipal = "";
function generarFecha(){
    fechaPrincipal = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
    return fechaPrincipal;
};
let clave_form = 0;
let colorFondoBarra = ["#E6CA7B","#91E69C","#6380E6","#E66E8D","#4D4D4D"];
let sucursales_activas = ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st', 'existencias_sc'];
let suc_add = ["Almacén Central", "Sucursal Uno", "Sucursal Dos", "Sucursal Tres", "Sucursal Cuatro"];
let mapa_calor = ["#91ff85","#C6F556","#F5CF6F","#DE8B59","#FF666D"];
let obtenerAnio = new Date().getFullYear() % 100
const arregloMeses = [`01-${obtenerAnio}`, `02-${obtenerAnio}` ,`03-${obtenerAnio}` ,`04-${obtenerAnio}` ,`05-${obtenerAnio}` ,`06-${obtenerAnio}`, 
                    `07-${obtenerAnio}`, `08-${obtenerAnio}`, `09-${obtenerAnio}`, `10-${obtenerAnio}`, `11-${obtenerAnio}` ,`12-${obtenerAnio}`];
const mes_anio = [`Ene-${obtenerAnio}`, `Feb-${obtenerAnio}` ,`Mar-${obtenerAnio}` ,`Abr-${obtenerAnio}` ,`May-${obtenerAnio}` ,`Jun-${obtenerAnio}`, 
                    `Jul-${obtenerAnio}`, `Ago-${obtenerAnio}`, `Set-${obtenerAnio}`, `Oct-${obtenerAnio}`, `Nov-${obtenerAnio}` ,`Dic-${obtenerAnio}`];
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
function cambiarAnio(){
    let anio_referencia = document.getElementById("anio_referencia")
    anio_referencia.value = new Date().getFullYear()
    anio_referencia.setAttribute("max", new Date().getFullYear())
    let suma = 0;
    document.getElementById("suma_anio").addEventListener("click", ()=>{
        if(anio_referencia.value < new Date().getFullYear()){
            suma += 1;
            anio_referencia.value = new Date().getFullYear() + suma
        }
    })
    document.getElementById("resta_anio").addEventListener("click", ()=>{
        if(anio_referencia.value > 0){
            suma -= 1;
            anio_referencia.value = new Date().getFullYear() + suma
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
        if(!localStorage.getItem("inventarios_consulta") || JSON.parse(localStorage.getItem("inventarios_consulta")).length === 0){
            localStorage.setItem("inventarios_consulta", JSON.stringify(await cargarDatos('almacen_central_ccd')))
        };
        if(!localStorage.getItem("sucursal_consulta") || JSON.parse(localStorage.getItem("sucursal_consulta")).length === 0){
            localStorage.setItem("sucursal_consulta", JSON.stringify(await cargarDatos('sucursales_index')))
        };
        if(!localStorage.getItem("categoria_consulta") || JSON.parse(localStorage.getItem("categoria_consulta")).length === 0){
            localStorage.setItem("categoria_consulta", JSON.stringify(await cargarDatos('categorias')))
        };
        if(!localStorage.getItem("proveedores_consulta") || JSON.parse(localStorage.getItem("proveedores_consulta")).length === 0){
            localStorage.setItem("proveedores_consulta", JSON.stringify(await cargarDatos('proveedores')))
        };
        if(!localStorage.getItem("clientes_consulta") || JSON.parse(localStorage.getItem("clientes_consulta")).length === 0){
            localStorage.setItem("clientes_consulta", JSON.stringify(await cargarDatos('clientes_ventas')))
        };
        if(!localStorage.getItem("datos_negocio") || JSON.parse(localStorage.getItem("datos_negocio")).length === 0){
            localStorage.setItem("datos_negocio", JSON.stringify(await cargarDatos('numeracion_comprobante_datos')))
        };
        if(!localStorage.getItem("datos_usuario") || JSON.parse(localStorage.getItem("datos_usuario")).length === 0){
            localStorage.setItem("datos_usuario", JSON.stringify(await cargarDatos('datos_usuario')))
        };
    }catch (error){
        alert('Error al cargar índices:', error.message);
        console.error('Error al cargar índices:', error.message);
    };
};

let inv_db = JSON.parse(localStorage.getItem("inventarios_consulta"));
let suc_db = JSON.parse(localStorage.getItem("sucursal_consulta"));
let cat_db = JSON.parse(localStorage.getItem("categoria_consulta"));
let prv_db = JSON.parse(localStorage.getItem("proveedores_consulta"));
let cli_db = JSON.parse(localStorage.getItem("clientes_consulta"));
let usu_db = JSON.parse(localStorage.getItem("datos_usuario"));
let neg_db = JSON.parse(localStorage.getItem("datos_negocio"));



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
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
let btnHome, btnVentas, btnCompras, btnTransferencias, btnKardex, btnDetalleVentas, 
    btnModificacion, btnDevolucionCompras, btnAnalisis, btnPerdidas, btnProductos,
    btnEntradasP, btnSalidasP, btnClientes, btnConfiguracion;

function sidebarMarcadito(){
    if(btnHome == 1){
        document.getElementById("button-home").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
    }else if(btnVentas == 1){
        document.getElementById("button-ventas").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
    }else if(btnCompras == 1){
        document.getElementById("button-compras").classList.add("marcadito");
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
    }else if(btnTransferencias == 1){
        document.getElementById("button-transferencias").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
        document.getElementById("buscador-productos-form").focus();
    }else if(btnKardex == 1){
        document.getElementById("button-kardex").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
        document.getElementById("buscador-productos-form").focus();
    }else if(btnDetalleVentas == 1){
        document.getElementById("button-detalle-ventas").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
    }else if(btnModificacion == 1){
        document.getElementById("button-modificacion").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad");
    }else if(btnDevolucionCompras == 1){
        document.getElementById("button-devolucion-compras").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
        document.getElementById("buscador_operacion").focus();
    }else if(btnAnalisis == 1){
        document.getElementById("button-devolucion-salidas").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
    }else if(btnPerdidas == 1){
        document.getElementById("button-perdidas").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
        document.getElementById("buscador-productos-form").focus();
    }else if(btnProductos == 1){
        document.getElementById("button-productos").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
    }else if(btnEntradasP == 1){
        document.getElementById("button-entradas").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
    }else if(btnSalidasP == 1){
        document.getElementById("button-salidas").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
    }else if(btnClientes == 1){
        document.getElementById("button-clientes").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
        document.getElementById("nombre").focus();
    }else if(btnConfiguracion == 1){
        document.getElementById("button-configuracion").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
    };
};

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
const cerrarSesion = document.getElementById("cerrar-sesion");
cerrarSesion.addEventListener("click", async () => {
    localStorage.clear();
    
    let response  = await fetch('/logout', {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'  
        }
    });
    if(response.ok){
        location.href = response.url
        location.reload();
    };
});
/////////////////////////////////////////////////////////////////////////////////////////////
function menuVertical(){
    document.getElementById("boton_despliegue").addEventListener("click", ()=>{
        document.querySelector(".menu-vertical").classList.toggle("menu_vertical_dos")
        document.querySelector(".body_web").classList.toggle("body_web_dos")
        document.getElementById("boton_despliegue").classList.toggle("cambioColor")
        if(document.querySelector("#sidebar").clientWidth === 220){
            reduccionTexto()
        }else if(window.innerWidth > 1280){
            expancionTexto()
        }
    });
};
menuVertical()
window.addEventListener('resize', function() {
    if (window.innerWidth > 1280 && document.querySelector("#sidebar").clientWidth > 50) {
        expancionTexto()
    }else{
        reduccionTexto()
    }
});

function inicioMenu(){
    if(document.querySelector("#sidebar").clientWidth == 50){
        reduccionTexto()
    }else{
        expancionTexto()
    }
}
inicioMenu()

function reduccionTexto(){
    document.querySelectorAll(".sub-lista").forEach((event)=>{
        event.children[1].classList.add("invisible")
    })
}    
function expancionTexto(){
    document.querySelectorAll(".sub-lista").forEach((event)=>{
        event.children[1].classList.remove("invisible")
    })
}    

//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
const colores_fondo_web = {
    fondo_principal : ["#121212", "#d8a7eb", "#FFD700", "#FBF5EE"],
    fondo_secundario : ["#050505", "#B2A7EB", "#232323", "#44b6db"],
    fondo_terciario : ["#31383f", "#efe7ee", "#F4EAF6", "#FFFFFF"],
    fondo_cuaternario : ["#5b6774", "#B78DC7", "#B39800", "#FFFFFF"],

    fondo_quinto : ["#383838", "#b388eb", "#FF8C00", "#D3C4B5"],

    fuente_principal : ["#eee", "#1c101a", "#232323", "#000"],
    fuente_secundario : ["#eee", "#1c101a", "#eee", "#eee"],
    marca_uno : ["#994d40", "#A7EBCC", "#232323", "#44b6db"],
    border_principal : ["#994d40", "#EBD5A7", "#232323", "#50C3CC"],
    fondo_input : ["#31383f", "#efe7ee", "#FFE44D", "#FFFFFF"],

    boton_uno : ["#5ca1cc", "#A7E3EB", "#3e3e97", "#50C3CC"],
    boton_dos : ["#994d40", "#EBC4A7", "#5d5c5c", "#dd836e"],

    boton_tres : ["#6edc8e", "#D7EBA7", "#232323", "#44db95"],
    /* boton_uno : ["#4b9ec3", "#A7E3EB", "#3e3e97", "#50C3CC"],
    boton_dos : ["#994d40", "#EBC4A7", "#5d5c5c", "#dd836e"],

    boton_tres : ["#77E578", "#D7EBA7", "#232323", "#44db95"], */
};

function cambioColorFondo() {
    document.querySelectorAll(".color_fondo").forEach((event, i) => {
        event.style.background = colores_fondo_web.fondo_principal[i];
        event.addEventListener("click", () => {
            document.documentElement.style.setProperty('--fondo-principal', colores_fondo_web.fondo_principal[i]);
            document.documentElement.style.setProperty('--fondo-secundario', colores_fondo_web.fondo_secundario[i]);
            document.documentElement.style.setProperty('--fondo-terciario', colores_fondo_web.fondo_terciario[i]);
            document.documentElement.style.setProperty('--fondo-cuaternario', colores_fondo_web.fondo_cuaternario[i]);
            document.documentElement.style.setProperty('--fondo-quinto', colores_fondo_web.fondo_quinto[i]);
            document.documentElement.style.setProperty('--color-principal', colores_fondo_web.fuente_principal[i]);
            document.documentElement.style.setProperty('--color-secundario', colores_fondo_web.fuente_secundario[i]);
            document.documentElement.style.setProperty('--fondo-marca-uno', colores_fondo_web.marca_uno[i]);
            document.documentElement.style.setProperty('--border-principal', colores_fondo_web.border_principal[i]);
            document.documentElement.style.setProperty('--fondo-input', colores_fondo_web.fondo_input[i]);
            document.documentElement.style.setProperty('--boton-uno', colores_fondo_web.boton_uno[i]);
            document.documentElement.style.setProperty('--boton-dos', colores_fondo_web.boton_dos[i]);
            document.documentElement.style.setProperty('--boton-tres', colores_fondo_web.boton_tres[i]);
            localStorage.setItem("clave_control_color", i)
        });
    });
};
function inicioColoresFondo(){
    for(let i = 0; i < 4; i++){
        if(localStorage.getItem("clave_control_color") === `${i}`){
            document.documentElement.style.setProperty('--fondo-principal', colores_fondo_web.fondo_principal[i]);
            document.documentElement.style.setProperty('--fondo-secundario', colores_fondo_web.fondo_secundario[i]);
            document.documentElement.style.setProperty('--fondo-terciario', colores_fondo_web.fondo_terciario[i]);
            document.documentElement.style.setProperty('--fondo-cuaternario', colores_fondo_web.fondo_cuaternario[i]);
            document.documentElement.style.setProperty('--fondo-quinto', colores_fondo_web.fondo_quinto[i]);
            document.documentElement.style.setProperty('--color-principal', colores_fondo_web.fuente_principal[i]);
            document.documentElement.style.setProperty('--color-secundario', colores_fondo_web.fuente_secundario[i]);
            document.documentElement.style.setProperty('--fondo-marca-uno', colores_fondo_web.marca_uno[i]);
            document.documentElement.style.setProperty('--border-principal', colores_fondo_web.border_principal[i]);
            document.documentElement.style.setProperty('--fondo-input', colores_fondo_web.fondo_input[i]);
            document.documentElement.style.setProperty('--boton-uno', colores_fondo_web.boton_uno[i]);
            document.documentElement.style.setProperty('--boton-dos', colores_fondo_web.boton_dos[i]);
            document.documentElement.style.setProperty('--boton-tres', colores_fondo_web.boton_tres[i]);
        }
    }
};
//////////////////////////////////////////////////////////////////////////////////////////////
//////MODALES ////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
function modal_proceso_abrir(mensaje, estado, mensaje_dos){
    aperturarMensajesModal()
    document.getElementById('myModal').style.display = 'block';
    document.getElementById('mensaje_proceso').textContent = mensaje
    document.getElementById('estado_proceso').textContent = estado
    document.getElementById('mensaje_dos').innerHTML = mensaje_dos
}
function modal_proceso_abrir_botones(){
    document.querySelector('.botones_respuesta').style.display = 'block';
    document.getElementById("no_salir").focus()
}
function modal_proceso_abrir_botones_salir(){
    document.querySelector('.botones_respuesta_dos').style.display = 'block';
    document.getElementById("si_salir").focus()
}
function modal_proceso_cerrar(){
    document.getElementById('myModal').style.display = 'none';
    cerrarMensajesModal()
}
function modal_proceso_cerrar_botones(){
    document.querySelector('.botones_respuesta').style.display = 'none';
    cerrarMensajesModal()
}
function modal_proceso_salir_botones(){
    modal_proceso_abrir_botones_salir()
    document.getElementById("si_salir").addEventListener("click", () =>{
        document.querySelector('.botones_respuesta_dos').style.display = 'none';
        modal_proceso_cerrar()
    })
}
function modal_proceso_salir_botones_focus(id){
    modal_proceso_abrir_botones_salir()
    document.getElementById("si_salir").addEventListener("click", () =>{
        document.querySelector('.botones_respuesta_dos').style.display = 'none';
        modal_proceso_cerrar()
        document.getElementById(id).select()
    })
}
//Modales
function aperturarMensajesModal(){
    let modal_mensaje = `<div class="modal-content">
                            <p id="mensaje_proceso"></p>
                            <p id="estado_proceso"></p>
                            <p id="mensaje_dos"></p>
                            <div class="botones_respuesta">
                                <button id="si_comprobante" class="myButtonAgregar">Sí</button>
                                <button id="no_salir" class="myButtonEliminar">No</button>
                            </div>
                            <div class="botones_respuesta_dos">
                                <button id="si_salir" class="myButtonAgregar">Aceptar</button>
                            </div>
                        </div>`;
    document.getElementById("myModal").innerHTML = modal_mensaje;
}
function cerrarMensajesModal(){
    let modal_mensaje = ``;
    document.getElementById("myModal").innerHTML = modal_mensaje;
}

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
}
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

let inv_db_grupo = dividirProductosDinamicamente(inv_db);

// Función para buscar productos en los grupos generados
function buscarProductosDinamicamente(texto) {
    /* let productosPorGrupo = JSON.parse(localStorage.getItem('productosPorGrupo')); */
    if(texto !== ""){

        let textoBuscado = texto.toLowerCase();
        let primerCaracter = textoBuscado[0].toUpperCase();
        
        // Buscar en el grupo correspondiente si existe
        if (!inv_db_grupo[primerCaracter]) {
            return []; // Si no existe el grupo, no hay resultados
        }
        
        // Filtrar los productos en el grupo seleccionado
        return inv_db_grupo[primerCaracter].find(y => y.codigo.toLowerCase().startsWith(texto.toLowerCase()))
        /* return productosPorGrupo[primerCaracter].filter(producto => producto.codigo.toLowerCase().startsWith(textoBuscado)); */
    }
};
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
        }else{
            reseteoFormulario()
        };
    });
}
////////////////////////////////////////////////////////////////////////////////////////