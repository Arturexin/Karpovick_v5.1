document.addEventListener("DOMContentLoaded", inicioCompras)
let anio_principal = ""
async function inicioCompras(){
    anio_principal = new Date().getFullYear()
    cargarDatosAnio()
    indice_base = JSON.parse(localStorage.getItem("base_datos_consulta"))
    btnCompras = 1;

    /* mostrarFormNuevoProducto() */
    agregarMoneda(document.querySelectorAll(".moneda_compras"));
    busquedaStock()
    document.getElementById("categoria_buscador_detalle").innerHTML = llenarCategoriaProductosEjecucion();
};
let comprasNumerador = 0;
let datos_usuario = JSON.parse(localStorage.getItem("datos_usuario"))
let array_saldos = [];
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        removerMarcaBotonDos()
        anio_principal = anio_referencia.value;
        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};
/////////////////////////////////////////////////////////////////////
///////////////////////////sucursal/////////////////////////////////
const nuevoProducto = document.getElementById("nuevo-producto");
nuevoProducto.addEventListener("click", (e)=>{
    e.preventDefault();
    mostrarFormNuevoProducto();
});
function mostrarFormNuevoProducto(){
    document.getElementById("form_contenedor").innerHTML = formInsert('Compras')
    document.getElementById("button_contenedor").innerHTML = formButton("Agregar a pre lista", "agregarAtablaModal()", "reseteoFormulario()");
    document.getElementById("categoria-form").innerHTML = llenarCategoriaProductosEjecucion();
    document.getElementById("proveedor-form").innerHTML = baseProv();

    document.getElementById("nuevo-producto").classList.add("marcaBoton")
    document.getElementById("recompra-producto-plus").classList.remove("marcaBoton")
    document.getElementById("codigo-form").focus();
    document.querySelector(".baja_opacidad_interior").classList.add("alta_opacidad_interior")
    document.getElementById("procesar-compras-plus").classList.add("invisible")
    document.getElementById("procesar-compras").classList.remove("invisible")
    document.getElementById("id-form").value = ""
    document.querySelector("#tabla_modal > tbody").remove()
    document.querySelector("#tabla_modal").createTBody()
    document.querySelector("#tabla_principal > tbody").remove()
    document.querySelector("#tabla_principal").createTBody()
    comprasNumerador = 0;
    array_saldos = [];
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////COMPRA NUEVO PRODUCTO///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let codigoComprobacionCompra = ""
function crearHeadCompra(){
    let tablaCompras= document.querySelector("#tabla_modal > thead");
    let nuevaFilaTablaCompras = tablaCompras.insertRow(-1);
    let fila = `
                <tr class="tbody_preproforma">
                    <th style="width: 120px;">Sucursal
                        <select id="sun_opc" onChange="accionSelect()"></select>
                    </th>
                    <th style="width: 120px;">Categoría</th>
                    <th style="width: 120px;">Código</th>
                    <th style="width: 200px;">Descripción</th>
                    <th style="width: 70px;">Medidas</th>
                    <th style="width: 70px;">Cantidad a Comprar</th>
                    <th style="width: 70px;">Costo Unitario</th>
                    <th style="width: 70px;">Costo Total</th>
                    <th style="width: 70px;">Precio de Venta</th>
                    <th style="width: 70px;">Proveedor</th>
                    <th style="width: 40px;"><span style="font-size:18px;" class="material-symbols-outlined">delete</span></th>
                </tr>
                `
    nuevaFilaTablaCompras.innerHTML = fila;
};


function crearBodyCompras (tallaAComprar, loteAComprar){
    
    let tablaCompras= document.querySelector("#tabla_modal > tbody");
    let nuevaFilaTablaCompras = tablaCompras.insertRow(-1);
    let fila = `<tr>`+
                    `<td class="suc_modal">${suc_add[obtenerIndiceSucursal("#sun_opc")]}</td>`+// Columna 0 > sucursal
                    `<td>${document.getElementById("categoria-form").children[document.getElementById("categoria-form").selectedIndex].textContent}</td>`+// Columna 1 > categoría
                    `<td class="codigo_modal input-tablas fondo" style="background: rgb(105, 211, 35)">${document.getElementById("codigo-form").value}-${tallaAComprar}-${loteAComprar}</td>`+// Columna 2 > codigo
                    `<td><input class="input-tablas-texto-largo" value="${document.getElementById("descripcion-form").value}" placeholder="Rellene esta casilla" onKeyup="op_descri(this)"></td>`+// Columna 3 > descripción
                    `<td>${tallaAComprar}</td>`+// Columna 4 > talla
                    `<td><input class="input-tablas-dos-largo insertarNumero" placeholder="Valor > 0" onKeyup="op_cantidad(this)" value = "0"></td>`+// Columna 5 > cantidad a comprar
                    `<td><input class="input-tablas-dos-largo insertarCosto" value="${(Number(document.getElementById("costo-form").value)).toFixed(2)}" placeholder="Valor >= 0" onKeyup="op_costo(this)"></td>`+// Columna 6 > costo de compra
                    `<td style="text-align: right">0.00</td>`+// Columna 7 > Costo Total 
                    `<td><input class="input-tablas-dos-largo" value="${(Number(document.getElementById("precio-form").value)).toFixed(2)}" placeholder="Valor >= C" onKeyup="op_precio(this)"></td>`+// Columna 8 > precio de venta
                    `<td class="invisible">${loteAComprar}</td>`+// Columna 9 > lote
                    `<td>${document.getElementById("proveedor-form").children[document.getElementById("proveedor-form").selectedIndex].textContent}</td>`+// Columna 10 > proveedor
                    `<td class="invisible">${document.getElementById("proveedor-form").value}</td>`+// Columna 11 > id proveedor***
                    `<td class="invisible">${document.getElementById("sun_opc").value}</td>`+// Columna 12 > id sucursal***
                    `<td class="invisible">${document.getElementById("categoria-form").value}</td>`+// Columna 13 > id categoria***
                    `<td class="invisible">${obtenerIndiceSucursal("#sun_opc")}</td>`+// Columna 14 > índice sucursal***
                    `<td style="text-align: center">
                        <div class="tooltip">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFila(this, 2)">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </div>
                    </td>`+// Columna 15 > botón eliminar fila
                `</tr>`
    nuevaFilaTablaCompras.innerHTML = fila;
    codigoComprobacionCompra = `${document.getElementById("codigo-form").value}-${tallaAComprar}-${loteAComprar}`;
};
function contenedorBotonesModal(funcion, titulo){
    let contenedor_bot = document.querySelector("#contenedor_botones_modal");
    let html =  `
                <button class="myButtonAgregar" onCLick="${funcion}">${titulo}</button>
                <button onCLick="removerModal()" class="myButtonEliminar">Cancelar</button>
                `;
    contenedor_bot.innerHTML = html;
}
function accionSelect(){// cambios al efectuar un cambio en select de sucursales en tabla modal
    let _suc_ = document.querySelectorAll(".suc_modal")
    _suc_.forEach((e)=>{
        let row_ = e.closest("tr")
        let obj_ = array_saldos.find(x=> x.codigo === row_.children[2].textContent);// buscamos una coincidencia por código
        if(obj_){
            row_.children[0].textContent = document.getElementById("sun_opc")[obtenerIndiceSucursal("#sun_opc")].textContent
            row_.children[12].textContent = document.getElementById("sun_opc").value
            row_.children[14].textContent = obtenerIndiceSucursal("#sun_opc")
            row_.children[5].children[0].value = obj_[sucursales_activas[row_.children[14].textContent]]// cantidad segun la sucursal
            row_.children[6].children[0].value = formatoMoneda(obj_.costo)
            row_.children[3].children[0].value = obj_.descripcion
            row_.children[8].children[0].value = formatoMoneda(obj_.precio)
            row_.children[7].textContent = formatoMoneda(obj_[sucursales_activas[row_.children[14].textContent]] * obj_.costo)
        };
    });
};

function agregarAtablaModal(){
    ///////////////////////////Para nuevos productos/////////////////////////////////////////////////////////////////
    if(expregul.codigo.test(document.getElementById("codigo-form").value) &&
    expregul.descripcion.test(document.getElementById("descripcion-form").value) &&
    expregul.cantidad.test(document.getElementById("lote-form").value) &&
    expregul.precios.test(document.getElementById("costo-form").value) &&
    expregul.precios.test(document.getElementById("precio-form").value)){
        let array_cod_db = [];
        let array_cod_a_s = [];
        let db_ = JSON.parse(localStorage.getItem("base_datos_consulta"))
        document.querySelector(".contenedor-pre-recompra").classList.add("modal-show")
        let arrayCreacionCategoriaTallas = categoriaProductosCreacion(document.getElementById("categoria-form"));
        compararCodigosNuevos(".codigo_compras_proforma", codigoComprobacionCompra);
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        crearHeadCompra();
        contenedorBotonesModal(`mandarATablaPrincipalCompras()`, "Enviar a la lista")
        cargarSucursalesEjecucion(document.getElementById("sun_opc"))
        arrayCreacionCategoriaTallas.forEach((event) =>{
            //Buscamos coincidencias en la base de datos y en array_saldos
            let cod_db = db_.find(x=> x.codigo === `${document.getElementById("codigo-form").value}-${event}-${document.getElementById("lote-form").value}`)
            let cod_a_s = array_saldos.find(x=> x.codigo === `${document.getElementById("codigo-form").value}-${event}-${document.getElementById("lote-form").value}`)

            //Si no hay coincidencias se prosigue con el proceso
            if(cod_db !== undefined){
                array_cod_db.push(cod_db.codigo)// recolectamos los codigos que se repiten en la base de datos
            }else if(cod_a_s !== undefined){
                array_cod_a_s.push(cod_a_s.codigo)// recolectamos los codigos que se repiten en la Lista de Compras
            }else{
                crearBodyCompras(event, document.getElementById("lote-form").value)
                array_saldos.push(new ObjGeneral(
                                                document.getElementById("categoria-form").value,
                                                `${document.getElementById("codigo-form").value}-${event}-${document.getElementById("lote-form").value}`,
                                                document.getElementById("descripcion-form").value,
                                                event,
                                                0,0,0,0,0,// existencias de las sucursales
                                                Number(document.getElementById("costo-form").value),
                                                Number(document.getElementById("precio-form").value),
                                                document.getElementById("lote-form").value,
                                                document.getElementById("proveedor-form").value
                                                ));
            };
        });
        if(array_cod_db.length > 0){
            modal_proceso_abrir(`Él o los códigos: [${array_cod_db}] ya `+
                                `existen en la base de datos, no podrá continuar con la compra de estos.`, "")
            modal_proceso_salir_botones()
        };
        if(array_cod_a_s.length > 0){
            modal_proceso_abrir(`Él o los códigos: [${array_cod_a_s}] ya `+
                                `existen en la Lista de Compras, no podrá continuar con la compra de estos.`, "")
            modal_proceso_salir_botones()
        };
        document.querySelectorAll('.contenedor-label-input-compras input').forEach(input => {
            input.style.background = ""
        });
        arrayCreacionCategoriaTallas = [];
        document.querySelector("#tabla_modal > tbody > tr:nth-child(1) > td:nth-child(6) > input").focus()

    }else if(expregul.codigo.test(document.getElementById("codigo-form").value) == false){
        document.getElementById("codigo-form").style.background ="#b36659"
    }else if(expregul.descripcion.test(document.getElementById("descripcion-form").value) == false){
        document.getElementById("descripcion-form").style.background ="#b36659"
    }else if(expregul.precios.test(document.getElementById("costo-form").value) == false){
        document.getElementById("costo-form").style.background ="#b36659"
    }else if(expregul.precios.test(document.getElementById("precio-form").value) == false){
        document.getElementById("precio-form").style.background ="#b36659"
    }else if(expregul.cantidad.test(document.getElementById("lote-form").value) == false){
        document.getElementById("lote-form").style.background ="#b36659"
    };
};
function op_cantidad(e){
    let row_ = e.closest("tr");
    let indice_suc = row_.children[14].textContent;
    let obj_ = array_saldos.find(x => x.codigo === row_.children[2].textContent);//Busca coincidencias de código en array_saldos
    obj_.in_q(e, indice_suc)
    row_.children[7].textContent = formatoMoneda(obj_.total_costo(indice_suc))
};
function op_costo(e){
    let row_ = e.closest("tr");
    let indice_suc = row_.children[14].textContent;
    let obj_ = array_saldos.find(x => x.codigo === row_.children[2].textContent);
    obj_.in_c(e)
    row_.children[7].textContent = formatoMoneda(obj_.total_costo(indice_suc))
};
function op_precio(e){
    let row_ = e.closest("tr");
    let obj_ = array_saldos.find(x => x.codigo === row_.children[2].textContent);
    obj_.in_p(e)
};
function op_descri(e){
    let row_ = e.closest("tr");
    let obj_ = array_saldos.find(x => x.codigo === row_.children[2].textContent);
    obj_.in_d(e);
};

function filaBodyProformaPincipalCompras(){
    const fila_principal = document.querySelector("#tabla_principal > tbody");
    let ccp = document.querySelectorAll(".codigo_compras_proforma");
    let codigo_prof = Array.from(ccp).map(x => x.textContent);
    const cod_remove = document.querySelectorAll(".codigo_modal");
    array_saldos.forEach((obj_compra)=>{
        let coincidencia_codigo = codigo_prof.find(x=> x === obj_compra.codigo)
        if(coincidencia_codigo === undefined){
            const existencias = [   
                                    obj_compra.existencias_ac,
                                    obj_compra.existencias_su,
                                    obj_compra.existencias_sd,
                                    obj_compra.existencias_st,
                                    obj_compra.existencias_sc
                                ]
            const suma = existencias.reduce((acumulador, valorActual) => acumulador + valorActual, 0);

            if(existencias.every(valor => valor >= 0 && Number.isFinite(valor)) && 
            existencias.some(valor => valor > 0) && 
            obj_compra.costo > 0 && obj_compra.precio > 0){
                let d_proveedor = prv_db.find(x => x.id_cli === Number(obj_compra.proveedor))
                let d_categoria = cat_db.find(x => x.id === Number(obj_compra.categoria))
                let nueva_fila = fila_principal.insertRow(-1);
                let fila = `<tr>`+
                                `<td>${d_categoria.categoria_nombre}</td>`+// Columna 0 > categoría
                                `<td class="codigo_compras_proforma">${obj_compra.codigo}</td>`+// Columna 1 > código
                                `<td>${obj_compra.descripcion}</td>`+// Columna 2 > descripción
                                `<td>${obj_compra.talla}</td>`+// Columna 3 > talla
                                `<td class="s_1" style="text-align: right">${obj_compra.existencias_ac}</td>`+// Columna 4 > cantidad
                                `<td class="s_2" style="text-align: right">${obj_compra.existencias_su}</td>`+// Columna 5 > cantidad
                                `<td class="s_3" style="text-align: right">${obj_compra.existencias_sd}</td>`+// Columna 6 > cantidad
                                `<td class="s_4" style="text-align: right">${obj_compra.existencias_st}</td>`+// Columna 7 > cantidad
                                `<td class="s_5" style="text-align: right">${obj_compra.existencias_sc}</td>`+// Columna 8 > cantidad
                                `<td style="text-align: right">${formatoMoneda(obj_compra.costo)}</td>`+// Columna 9 > costo de compra
                                `<td class="t_0" style="text-align: right">${formatoMoneda(suma * obj_compra.costo)}</td>`+// Columna 10 > Costo Total
                                `<td style="text-align: right">${formatoMoneda(obj_compra.precio)}</td>`+// Columna 11 > precio de venta
                                `<td style="text-align: right">${obj_compra.lote}</td>`+// Columna 12 > lote
                                `<td style="text-align: right">${d_proveedor.nombre_cli}</td>`+// Columna 13 > proveedor
                                `<td style="text-align: center">
                                    <div class="tooltip">
                                        <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFilaDos(this)">delete</span>
                                        <span class="tooltiptext">Eliminar producto</span>
                                    </div>
                                </td>`+// Columna 14 > botón eliminar fila
                            `</tr>`
                nueva_fila.innerHTML = fila;

                cod_remove.forEach((e)=>{//Eliminamos la fila en tabla modal
                    e.textContent === obj_compra.codigo ? e.parentNode.remove(): ""
                })
            };
        };
    });
};

function mandarATablaPrincipalCompras(){
 
    filaBodyProformaPincipalCompras()

    if(document.querySelector("#tabla_modal > tbody").children.length == 0){//eliminamos el contenedor del modal si la tabla modal no tiene filas, osea si pasaron todas las filas
        document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show")
        document.querySelector("#tabla_modal > thead > tr:nth-child(2)").remove()
    }
    sumaSaldosProforma();
    document.getElementById("formulario-compras-uno").reset();
    document.getElementById("id-form").value = "";
    document.getElementById("codigo-form").focus();
};
function sumaSaldosProforma(){
    const exs = [".s_1", ".s_2", ".s_3", ".s_4", ".s_5"]
    const t_exs = [".t_e_1", ".t_e_2", ".t_e_3", ".t_e_4", ".t_e_5"]
    exs.forEach((e, i)=>{
        let col = Array.from(document.querySelectorAll(e)).map(x => Number(x.textContent));
        let suma = col.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
        document.querySelector(t_exs[i]).textContent = suma;
    })
    let col_t = Array.from(document.querySelectorAll(".t_0")).map(x => Number(x.textContent));
    let suma_t = col_t.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
    document.querySelector(".t_i_0").textContent = formatoMoneda(suma_t);
};
const procesarCompras = document.querySelector("#procesar-compras");
procesarCompras.addEventListener("click", procesamientoCompras)
async function procesamientoCompras(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla_principal > tbody").children.length > 0){
            modal_proceso_abrir("Procesando la compra!!!.", "")
            await funcionGeneralCompras();
            if(document.querySelector("#check_comprobante").checked){
                imprimirListaTabla()//Lista de compras
            };
            document.querySelector("#tabla_principal > tbody").remove();
            document.querySelector("#tabla_principal").createTBody();
            array_saldos = [];
            sumaSaldosProforma();
        };
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. " + error, "")
        console.error("Ocurrió un error. ", error)
        modal_proceso_salir_botones()
    };
};
async function funcionGeneralCompras(){
    let array_productos = [];
    let array_entradas = [];
    function DatosProductos(a){
        this.categoria = a.categoria;
        this.codigo = a.codigo;
        this.descripcion = a.descripcion;
        this.talla = a.talla;
        this.existencias_ac = a.existencias_ac;
        this.existencias_su = a.existencias_su;
        this.existencias_sd = a.existencias_sd;
        this.existencias_st = a.existencias_st;
        this.existencias_sc = a.existencias_sc;
        this.costo_unitario = a.costo;
        this.precio_venta = a.precio;
        this.lote = a.lote;
        this.proveedor = a.proveedor;
    };
    function DatosEntradas(a, sucursal, i){
        this.codigo = a.codigo;
        this.sucursal = sucursal;
        this.existencias_entradas = a[sucursales_activas[i]];
    };
    array_saldos.forEach((event)=>{
        array_productos.push(new DatosProductos(event))
        suc_add.forEach((e, i)=>{
            let sucursal_ = suc_db.find(x=> x.sucursal_nombre === e);
            if(sucursal_){
                event[sucursales_activas[i]] > 0 ? array_entradas.push(new DatosEntradas(event, sucursal_.id_sucursales, i)): "";
            };
        });
    });

    function DatosCompras(){
        this.id_num = datos_usuario[0].id;//Para la numeración
        this.fecha = generarFecha();
        this.array_productos = array_productos;
        this.array_entradas = array_entradas;
    };
    let url_compra = URL_API_almacen_central + 'gestion_de_compras'
    let objeto_compra = new DatosCompras();
    let response = await funcionFetchDos(url_compra, objeto_compra);

    if(response.status === "success"){
        localStorage.setItem("base_datos_consulta", JSON.stringify(await cargarDatos('almacen_central_ccd')))
        modal_proceso_abrir(`Operación "${response.message}" completada exitosamente.`)
        modal_proceso_salir_botones()
    };
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////RECOMPRA PLUS/////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const in_existencias = ["in_ac", "in_su", "in_sd", "in_st", "in_sc"];
const recompraProductoPlus = document.getElementById("recompra-producto-plus");
recompraProductoPlus.addEventListener("click", (e)=>{
    e.preventDefault();
    mostrarFormrecompraProductoPlus()
});
function mostrarFormrecompraProductoPlus(){
    document.getElementById("form_contenedor").innerHTML = formUpdate('Recompras')
    document.getElementById("button_contenedor").innerHTML = formButton("Agregar a pre lista", "agregarATablaPreRecompras()", "reseteoFormulario()")
    document.getElementById("categoria-form").innerHTML = llenarCategoriaProductosEjecucion();

    document.getElementById("nuevo-producto").classList.remove("marcaBoton")
    document.getElementById("recompra-producto-plus").classList.add("marcaBoton")
    document.getElementById("buscador-productos-form").focus();
    document.querySelector(".baja_opacidad_interior").classList.add("alta_opacidad_interior")
    document.getElementById("procesar-compras-plus").classList.remove("invisible")
    document.getElementById("procesar-compras").classList.add("invisible")
    document.getElementById("id-form").value = ""
    document.querySelector("#tabla_modal > tbody").remove()
    document.querySelector("#tabla_modal").createTBody()
    document.querySelector("#tabla_principal > tbody").remove()
    document.querySelector("#tabla_principal").createTBody()
    comprasNumerador = 1;
    array_saldos = [];
}
///////////////////BUSCADOR DE PRODUCTOS EN FORMULARIO COMPRAS/////////////////////////
function reseteoFormulario(){
    document.getElementById("id-form").value = "";
    document.getElementById('categoria-form').value = "0";
    document.getElementById('codigo-form').value = "";
    document.getElementById('descripcion-form').value = "";
    if(comprasNumerador == 0){
        document.getElementById('costo-form').value = "";
        document.getElementById('precio-form').value = "";
        document.getElementById('lote-form').value = "";
        document.getElementById('proveedor-form').value = document.getElementById('proveedor-form')[0].value;
        document.getElementById("codigo-form").focus();
    }else if(comprasNumerador == 1){
        document.getElementById("buscador-productos-form").focus();
    };
};
document.addEventListener("keyup", () =>{
    if(comprasNumerador == 0){
        return;
    }else{
        let almacenCentral = indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-productos-form').value.toLowerCase()))
        if(almacenCentral){
            document.getElementById('id-form').value = almacenCentral.idProd
            document.getElementById('categoria-form').value = almacenCentral.categoria
            document.getElementById('codigo-form').value = almacenCentral.codigo
            document.getElementById('descripcion-form').value = almacenCentral.descripcion
            if(document.getElementById('buscador-productos-form').value == ""){
                reseteoFormulario()
            }
        }else{
            reseteoFormulario()
        };
    };
});

function crearHeadRecompra(){
    let tablaCompras= document.querySelector("#tabla_modal > thead");
    let nuevaFilaTablaCompras = tablaCompras.insertRow(-1);
    let fila = `
                <tr class="tbody_preproforma">
                    <th style="width: 120px;">Sucursal
                        <select id="sun_opc" onChange="accionSelectDos()"></select>
                    </th>
                    <th style="width: 120px;">Categoría</th>
                    <th style="width: 120px;">Código</th>
                    <th style="width: 120px;">Descripción</th>
                    <th style="width: 70px;">Existencias</th>
                    <th style="width: 70px;">Cantidad a comprar</th>
                    <th style="width: 70px;">Saldo existencias</th>
                    <th style="width: 70px;">CU</th>
                    <th style="width: 70px;">CT de la compra</th>
                    <th style="width: 40px;"><span style="font-size:18px;" class="material-symbols-outlined">delete</span></th>
                </tr>
                `
    nuevaFilaTablaCompras.innerHTML = fila;
};
function crearBodyRecompras (codigoMovimientos, id_prod){
    let tablaRecompras= document.querySelector("#tabla_modal > tbody");
    let nuevaFilaTablaRecompras = tablaRecompras.insertRow(-1);
    let fila = `<tr>`+
                    `<td class="id_modal invisible">${id_prod}</td>`+// Columna 0 > id
                    `<td class="suc_modal">${suc_add[obtenerIndiceSucursal("#sun_opc")]}</td>`+// Columna 1 > sucursal
                    `<td>${document.getElementById("categoria-form").children[document.getElementById("categoria-form").selectedIndex].textContent}</td>`+// Columna 2 > categoría
                    `<td class="codigo_modal" style="border-radius: 5px">${codigoMovimientos}</td>`+// Columna 3 > código
                    `<td></td>`+// Columna 4 > descripción
                    `<td class="invisible"></td>`+// Columna 5 > talla
                    `<td style="text-align: right"></td>`+// Columna 6 > existencias
                    `<td><input class="input-tablas-dos-largo insertarNumero" placeholder="Valor > 0" onKeyup="op_cantidad_dos(this)"></td>`+// Columna 7 > cantidad a comprar
                    `<td style="text-align: right"></td>`+// Columna 8 > existencias + cantidad a comprar
                    `<td style="text-align: right"></td>`+// Columna 9 > costo
                    `<td style="text-align: right"></td>`+// Columna 10 > total costo
                    `<td class="invisible">${obtenerIndiceSucursal("#sun_opc")}</td>`+// Columna 11 > índice sucursal sucursal
                    `<td style="text-align: center">
                        <div class="tooltip">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila"  onCLick = "clicKEliminarFila(this, 3)">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </div>
                    </td>`+// Columna 12 > botón eliminar fila
                `</tr>`
    nuevaFilaTablaRecompras.innerHTML = fila;
};
function accionSelectDos(){// cambios al efectuar un cambio en select de sucursales en tabla modal
    let _suc_ = document.querySelectorAll(".suc_modal")
    _suc_.forEach((e)=>{
        let row_ = e.closest("tr")
        let obj_ = array_saldos.find(x=> x.idProd === Number(row_.children[0].textContent));// buscamos una coincidencia por id
        
        if(obj_){
            row_.children[11].textContent = obtenerIndiceSucursal("#sun_opc")

            row_.children[1].textContent = document.getElementById("sun_opc")[obtenerIndiceSucursal("#sun_opc")].textContent;
            row_.children[6].textContent = obj_[in_existencias[row_.children[11].textContent]]// existencias según sucursal
            row_.children[7].children[0].value = obj_[sucursales_activas[row_.children[11].textContent]]// cantidad ingresada segun la sucursal
            row_.children[8].textContent = obj_[in_existencias[row_.children[11].textContent]]
            row_.children[10].textContent = formatoMoneda(obj_[sucursales_activas[row_.children[11].textContent]] * obj_.costo)
        };
    });
};
async function agregarATablaPreRecompras(){
    if(document.getElementById("id-form").value > 0){
        let db_ = JSON.parse(localStorage.getItem("base_datos_consulta"))
        let array_id_a_s = [];
        crearHeadRecompra()
        cargarSucursalesEjecucion(document.getElementById("sun_opc"))
        let arrayCreacionCategoriaTallas = categoriaProductosCreacion(document.getElementById("categoria-form"));

        for(let i = 0; i < arrayCreacionCategoriaTallas.length; i++){
            let codigo_form = document.getElementById("codigo-form").value
            
            for(let j = 0; j < arrayCreacionCategoriaTallas.length; j++){
                if(codigo_form.includes("-" + arrayCreacionCategoriaTallas[j])){
                    codigo_form = codigo_form.replace("-" + arrayCreacionCategoriaTallas[j], "-" + arrayCreacionCategoriaTallas[i])
                }
            };
            let base = db_.find(y => y.codigo === codigo_form)// Buscamos en la base de datos la existencia del código
            if(base){
                let id_a_s = array_saldos.find(x=> x.idProd === Number(base.idProd))
                if(id_a_s !== undefined){// Si el nuevo id ya se encuentra en el array_saldos no pasará a la pre lista
                    array_id_a_s.push(id_a_s.codigo)
                }else{
                    crearBodyRecompras(codigo_form, base.idProd)
                };
            };
        };
        contenedorBotonesModal("mandarATablaPrincipalRecompras()", "Enviar a la lista")
        if(array_id_a_s.length > 0){
            modal_proceso_abrir(`Él o los códigos: [${array_id_a_s}] ya `+
                                `existen en la Lista de Compras, no podrá continuar con la compra de estos.`, "")
            modal_proceso_salir_botones()
        };
        document.querySelectorAll(".codigo_modal").forEach((event)=>{//Pinta el código form que coincide en la tabla pre lista
            if(event.textContent === document.getElementById("codigo-form").value){
                event.style.background = "var(--boton-tres)"
            }
        });
        document.querySelector(".contenedor-pre-recompra").classList.add("modal-show")
        await buscarCodigo();

        arrayCreacionCategoriaTallas = [];
        document.querySelector("#tabla_modal > tbody > tr > td:nth-child(8) > input").focus();
    };
};
function op_cantidad_dos(e){
    let row_ = e.closest("tr");
    let indice_suc = row_.children[11].textContent;
    let obj_ = array_saldos.find(x => x.idProd === Number(row_.children[0].textContent));//Busca coincidencias de código en array_saldos
    obj_.in_q(e, indice_suc)
    row_.children[8].textContent = Number(row_.children[6].textContent) + Number(e.value)
    row_.children[10].textContent = formatoMoneda(obj_.total_costo(indice_suc))
};
////////////////CON ESTO SE LLENA LA TABLA PREMODIFICACION Y SE FILTRA LAS FILAS CON ID///////////////////////////////////
async function buscarCodigo(){
    const id_rec = document.querySelectorAll(".id_modal");
    let ids = Array.from(id_rec).map(element => element.textContent);
    let response = await cargarDatos(   `almacen_central_codigo_transferencias?`+
                                        `ids=${ids.join(",")}`);

    for(id_c of id_rec){
        let row_ = id_c.closest("tr");
        let fila_res = response.find(x=> x.idProd === Number(row_.children[0].textContent))
        if(fila_res){
            row_.children[4].textContent = fila_res.descripcion;
            row_.children[5].textContent = fila_res.talla;
            row_.children[6].textContent = fila_res[sucursales_activas[row_.children[11].textContent]];
            row_.children[7].children[0].value = 0;
            row_.children[8].textContent = fila_res[sucursales_activas[row_.children[11].textContent]];
            row_.children[9].textContent = formatoMoneda(fila_res.costo_unitario);
            row_.children[10].textContent = "0.00";
            if(row_.children[0].textContent == document.getElementById("id-form").value){//marcamos el código de búsqueda
                id_c.style.background = "var(--boton-tres)"
                id_c.style.color = "var(--color-secundario)"
            };
            array_saldos.push(new ObjGeneral(fila_res.categoria,
                                            fila_res.codigo,
                                            fila_res.descripcion,
                                            fila_res.talla,
                                            0, 0, 0, 0, 0,
                                            fila_res.costo_unitario,
                                            fila_res.precio_venta,
                                            fila_res.lote,
                                            fila_res.proveedor,
                                            fila_res.idProd,
                                            fila_res.existencias_ac,
                                            fila_res.existencias_su,
                                            fila_res.existencias_sd,
                                            fila_res.existencias_st,
                                            fila_res.existencias_sc,
                                            ));
        };
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function filaBodyProformaPincipalRecompras(){
    const fila_principal = document.querySelector("#tabla_principal > tbody");
    let idd = document.querySelectorAll(".id_proforma");
    let id_prof = Array.from(idd).map(x => Number(x.textContent));
    const id_remove = document.querySelectorAll(".id_modal");
    array_saldos.forEach((obj_recompra)=>{
        let coincidencia_id = id_prof.find(x=> x === obj_recompra.idProd)
        if(coincidencia_id === undefined){
            const existencias = [   
                                    obj_recompra.existencias_ac,
                                    obj_recompra.existencias_su,
                                    obj_recompra.existencias_sd,
                                    obj_recompra.existencias_st,
                                    obj_recompra.existencias_sc
                                ]
            const suma = existencias.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
            if(existencias.every(valor => valor >= 0 && Number.isFinite(valor)) && 
            existencias.some(valor => valor > 0)){
                let d_proveedor = prv_db.find(x => x.id_cli === Number(obj_recompra.proveedor))
                let d_categoria = cat_db.find(x => x.id === Number(obj_recompra.categoria))
                let nueva_fila = fila_principal.insertRow(-1);
                let fila =  `<tr>`+
                                `<td>${d_categoria.categoria_nombre}</td>`+// Columna 0 > categoría
                                `<td class="codigo_compras_proforma">${obj_recompra.codigo}</td>`+// Columna 1 > código
                                `<td>${obj_recompra.descripcion}</td>`+// Columna 2 > descripción
                                `<td>${obj_recompra.talla}</td>`+// Columna 3 > talla
                                `<td class="s_1" style="text-align: right">${obj_recompra.existencias_ac}</td>`+// Columna 4 > cantidad
                                `<td class="s_2" style="text-align: right">${obj_recompra.existencias_su}</td>`+// Columna 5 > cantidad
                                `<td class="s_3" style="text-align: right">${obj_recompra.existencias_sd}</td>`+// Columna 6 > cantidad
                                `<td class="s_4" style="text-align: right">${obj_recompra.existencias_st}</td>`+// Columna 7 > cantidad
                                `<td class="s_5" style="text-align: right">${obj_recompra.existencias_sc}</td>`+// Columna 8 > cantidad
                                `<td style="text-align: right">${formatoMoneda(obj_recompra.costo)}</td>`+// Columna 9 > costo de compra
                                `<td class="t_0" style="text-align: right">${formatoMoneda(suma * obj_recompra.costo)}</td>`+// Columna 10 > Costo Total
                                `<td style="text-align: right">${formatoMoneda(obj_recompra.precio)}</td>`+// Columna 11 > precio de venta
                                `<td style="text-align: right">${obj_recompra.lote}</td>`+// Columna 12 > lote
                                `<td style="text-align: right">${d_proveedor.nombre_cli}</td>`+// Columna 13 > proveedor
                                `<td class="id_proforma invisible">${obj_recompra.idProd}</td>`+// Columna 14 > id
                                `<td style="text-align: center">
                                    <div class="tooltip">
                                        <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFilaDos(this)">delete</span>
                                        <span class="tooltiptext">Eliminar producto</span>
                                    </div>
                                </td>`+// Columna 15 > botón eliminar fila
                            `</tr>`
                nueva_fila.innerHTML = fila;

                id_remove.forEach((e)=>{//Eliminamos la fila en tabla modal
                    Number(e.textContent) === obj_recompra.idProd ? e.parentNode.remove(): "";
                })
            };
        };
    });
};

function mandarATablaPrincipalRecompras(){
    filaBodyProformaPincipalRecompras();

    if(document.querySelector("#tabla_modal > tbody").children.length == 0){
        document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show")
        document.querySelector("#tabla_modal > thead > tr:nth-child(2)").remove()
    }
    sumaSaldosProforma();
    document.getElementById("formulario-compras-uno").reset();
    document.getElementById("id-form").value = "";
    document.getElementById("buscador-productos-form").focus();
};

const procesarComprasPlus = document.querySelector("#procesar-compras-plus");
procesarComprasPlus.addEventListener("click", procesamientoRecompras)
async function procesamientoRecompras(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla_principal > tbody").children.length > 0){
            modal_proceso_abrir("Procesando la recompra!!!.", "")
            
            await funcionGeneralRecompras();
            if(document.querySelector("#check_comprobante").checked){
                imprimirListaTabla()//Lista de compras
            };
            document.querySelector("#tabla_principal > tbody").remove();
            document.querySelector("#tabla_principal").createTBody();
            array_saldos = [];
            sumaSaldosProforma();
        };
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. " + error, "")
        console.error("Ocurrió un error. ", error)
        modal_proceso_salir_botones()
    };
};
async function funcionGeneralRecompras(){
    let array_productos_dos = [];
    let array_entradas_dos = [];
    function DatosProductosDos(a){
        this.idProd = a.idProd;
        this.existencias_ac = a.existencias_ac;
        this.existencias_su = a.existencias_su;
        this.existencias_sd = a.existencias_sd;
        this.existencias_st = a.existencias_st;
        this.existencias_sc = a.existencias_sc;
    };
    function DatosEntradasDos(a, sucursal, i){
        this.idProd = a.idProd;
        this.sucursal = sucursal;
        this.existencias_entradas = a[sucursales_activas[i]];
    };
    array_saldos.forEach((event)=>{
        array_productos_dos.push(new DatosProductosDos(event))
        suc_add.forEach((e, i)=>{
            let sucursal_ = suc_db.find(x=> x.sucursal_nombre === e);
            if(sucursal_){
                event[sucursales_activas[i]] > 0 ? array_entradas_dos.push(new DatosEntradasDos(event, sucursal_.id_sucursales, i)): "";
            };
        });
    });
    function DatosRecompra(){
        this.id_num = datos_usuario[0].id;
        this.fecha = generarFecha();
        this.array_productos_dos = array_productos_dos;
        this.array_entradas_dos = array_entradas_dos;
    };
    console.log(new DatosRecompra())
    let url_recompra = URL_API_almacen_central + 'gestion_de_recompras'
    let objeto_recompra = new DatosRecompra();

    let response = await funcionFetchDos(url_recompra, objeto_recompra);
    if(response.status === "success"){
        modal_proceso_abrir(`Operación "${response.message}" completada exitosamente.`)
        modal_proceso_salir_botones()
    };
};
function removerModal(){
    removerListaModal()
    document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show")
    document.querySelector("#tabla_modal > thead > tr:nth-child(2)").remove()
    document.querySelector("#tabla_modal > tbody").remove();
    document.querySelector("#tabla_modal").createTBody();
    if(comprasNumerador == 0){
        document.getElementById("codigo-form").focus();
    }else if(comprasNumerador == 1){
        document.getElementById("buscador-productos-form").focus();
    };
}
function removerListaModal(){// Elimina los elementos del array_saldos que coincidan con los elementos de la tabla modal
    let filas = document.querySelectorAll(".codigo_modal")
    filas.forEach((e) =>{
        array_saldos.forEach((event, i)=>{
            event.codigo === e.textContent ? array_saldos.splice(i, 1): "";
        })
    })
}
const removerTablaComprasDos = document.getElementById("remover-tabla-compras-dos");
removerTablaComprasDos.addEventListener("click", () =>{
    document.querySelector("#tabla_principal > tbody").remove();
    document.querySelector("#tabla_principal").createTBody();
    if(comprasNumerador == 0){
        document.getElementById("codigo-form").focus();
    }else if(comprasNumerador == 1){
        document.getElementById("buscador-productos-form").focus();
    };
    array_saldos = [];
    sumaSaldosProforma();
});
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("boton_buscar_codigo").addEventListener("click", ()=>{
    busquedaDetalle(0, document.getElementById("buscador_descripcion").value)
    document.getElementById("buscador_descripcion").focus()
});
document.getElementById("boton_buscar_descripcion").addEventListener("click", ()=>{
    busquedaDetalle(1, document.getElementById("buscador_descripcion").value)
    document.getElementById("buscador_descripcion").focus()
});
document.getElementById("boton_borrar_").addEventListener("click", ()=>{

    document.getElementById("categoria_buscador_detalle").value = "0";
    document.getElementById("periodo_tiempo").value = "0";
    document.getElementById("buscador_descripcion").value = ""
    document.getElementById("buscador_descripcion").focus()
    removerMarcaBotonDos()
});
function agregarBusquedaDetalleUno(button){
    if(document.getElementById("recompra-producto-plus").classList.contains('marcaBoton')){
        let linea = button.closest("li");
        document.getElementById('id-form').value = linea.children[0].textContent;
        document.getElementById('categoria-form').value = linea.children[1].textContent;
        document.getElementById('codigo-form').value = linea.children[2].textContent;
        document.getElementById('descripcion-form').value = linea.children[3].textContent;
    }else{
        modal_proceso_abrir(`Esta acción solo procederá en "Recomprar Producto".`, ``)
        modal_proceso_salir_botones()
    };
};
function agregarBusquedaDetalleDos(button){
    if(document.getElementById("recompra-producto-plus").classList.contains('marcaBoton')){
        let linea = button.closest("li");
        document.getElementById('id-form').value = linea.children[0].textContent;
        document.getElementById('categoria-form').value = linea.children[2].textContent;
        document.getElementById('codigo-form').value = linea.children[3].textContent;
        document.getElementById('descripcion-form').value = linea.children[4].textContent;
    }else{
        modal_proceso_abrir(`Esta acción solo procederá en "Recomprar Producto".`, ``)
        modal_proceso_salir_botones()
    };
};
function clicKEliminarFila(e, indice_codigo) {
    const fila = e.closest("tr");
    array_saldos.forEach((e, i)=>{//Buscamos una coincidencia de código
        e.codigo === fila.children[indice_codigo].textContent ? array_saldos.splice(i, 1): "";//elimina el objeto con el índice i
    });
    fila.remove();
};
function clicKEliminarFilaDos(e) {
    const fila = e.closest("tr");
    array_saldos.forEach((e, i)=>{//Buscamos una coincidencia de código
        e.codigo === fila.children[1].textContent ? array_saldos.splice(i, 1): "";//elimina el objeto con el índice i
    });
    fila.remove();
    sumaSaldosProforma();
};
