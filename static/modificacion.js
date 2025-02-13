document.addEventListener("DOMContentLoaded", inicioModificacion)
let anio_principal = ""
function inicioModificacion(){
    anio_principal = new Date().getFullYear()
    cargarDatosAnio()
    array_btn_pages[5] = 1;
    /* mostrarFormRegistro() */

    document.getElementById("categoria_buscador_detalle").innerHTML = llenarCategoriaProductosEjecucion();
};
const barras_modificacion = [".cg_1_t", ".cg_2_t", ".cg_3_t", ".cg_4_t", ".cg_5_t"]
let array_saldos = [];
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{

        anio_principal = anio_referencia.value;
        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};
/////////////////////////////////////////////////////////////////////
///////////////////////////sucursal/////////////////////////////////
const botonRegistrarRegistro = document.getElementById("registra-modificacion");
botonRegistrarRegistro.addEventListener("click", (e)=>{
    e.preventDefault();
    mostrarFormRegistro()
});

function mostrarFormRegistro(){
    document.getElementById("form_contenedor").innerHTML = formInsert('Registro')
    document.getElementById("button_contenedor").innerHTML = formButton("Agregar a pre lista", "agregarAtablaModal()", "reseteoFormulario()")
    document.getElementById("categoria-form").innerHTML = llenarCategoriaProductosEjecucion();
    document.getElementById("proveedor-form").innerHTML = baseProv();

    document.getElementById("registra-modificacion").classList.add("marcaBotonDos")
    document.getElementById("editar-modificacion").classList.remove("marcaBotonDos")
    document.getElementById("codigo-form").focus();
    document.querySelector(".baja_opacidad_interior").classList.add("alta_opacidad_interior")

    document.getElementById("procesar-registro").classList.remove("invisible")
    document.getElementById("procesar-modificacion-principal").classList.add("invisible")
    document.getElementById("id-form").value = ""
    document.querySelector("#tabla_modal > tbody").remove()
    document.querySelector("#tabla_modal").createTBody()
    document.querySelector("#tabla_principal > tbody").remove()
    document.querySelector("#tabla_principal").createTBody()

    clave_form = 0;
    array_saldos = [];
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////REGISTRAR PRODUCTOS//////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let codigoComprobacionRegistro = "";
function crearHeadRegistro(){
    let tablaCompras= document.querySelector("#tabla_modal > thead");
    let nuevaFilaTablaCompras = tablaCompras.insertRow(-1);
    let fila =  `<tr class="tbody_preproforma">
                    <th style="width: 120px;">Categoría</th>
                    <th style="width: 120px;">Código</th>
                    <th style="width: 200px;">Descripción</th>
                    <th style="width: 70px;">Medidas</th>
                    <th style="width: 70px;">Costo Unitario</th>
                    <th style="width: 70px;">Precio de Venta</th>
                    <th style="width: 70px;">Lote</th>
                    <th style="width: 70px;">Proveedor</th>
                    <th style="width: 40px;"><span style="font-size:18px;" class="material-symbols-outlined">delete</span></th>
                </tr>`
    nuevaFilaTablaCompras.innerHTML = fila;
};
function crearBodyRegistro(tallaRegistro, loteRegistro){
    let tablaRegistro = document.querySelector("#tabla_modal > tbody");
    let nuevaFilaTablaRegistro = tablaRegistro.insertRow(-1);
    let fila =  `<tr>`+
                    `<td>${document.getElementById("categoria-form").children[document.getElementById("categoria-form").selectedIndex].textContent}</td>`+// Columna 1 > categoría
                    `<td class="codigo_modal" style="background: rgb(105, 211, 35)">${document.getElementById("codigo-form").value}-${tallaRegistro}-${loteRegistro}</td>`+// Columna 2 > código
                    `<td><input onKeyup="op_descri(this)" class="input-tablas-texto-largo" value="${document.getElementById("descripcion-form").value}" placeholder="Rellene esta celda"></td>`+// Columna 3 > descripción
                    `<td>${tallaRegistro}</td>`+// Columna 4 > talla

                    `<td><input onKeyup="op_costo(this)" class="input-tablas-dos-largo costo-unitario-form" value="${(Number(document.getElementById("costo-form").value)).toFixed(2)}" placeholder="valor >= 0"></td>`+// Columna 6 > costo unitario

                    `<td><input onKeyup="op_precio(this)" class="input-tablas-dos-largo" value="${(Number(document.getElementById("precio-form").value)).toFixed(2)}" placeholder="valor >= C"></td>`+// Columna 8 > precio de venta
                    `<td>${loteRegistro}</td>`+// Columna 9 > lote
                    `<td>${document.getElementById("proveedor-form").children[document.getElementById("proveedor-form").selectedIndex].textContent}</td>`+// Columna 10 > proveedor
                    `<td class="invisible">${document.getElementById("proveedor-form").value}</td>`+// Columna 11 > id proveedor
                    `<td class="invisible">${document.getElementById("categoria-form").value}</td>`+// Columna 13 > id categoría
                    `<td style="text-align: center">
                        <div class="tooltip">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFila(this, 1)">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </div>
                    </td>`+// Columna 15 > botón eliminar fila
                `</tr>`
    nuevaFilaTablaRegistro.innerHTML = fila;
    codigoComprobacionRegistro = document.getElementById("codigo-form").value + "-" + tallaRegistro + "-" + loteRegistro;
};
function contenedorBotonesModal(funcion, titulo){
    let contenedor_bot = document.querySelector("#contenedor_botones_modal");
    let html =  `
                <button class="myButtonAgregar" onCLick="${funcion}">${titulo}</button>
                <button onCLick="removerModal()" class="myButtonEliminar">Cancelar</button>
                `;
    contenedor_bot.innerHTML = html;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////PASAR DATOS DE FORMULARIO A TABLA DE MODIFICACIÓN///////////////////////////////////////////////

function agregarAtablaModal(){
    if(validarFormulario()){
        let array_cod_db = [];
        let array_cod_a_s = [];
        ///////////////////////////////////////////////////////////////////////////////
        document.querySelector(".contenedor-pre-recompra").classList.add("modal-show");//Mostrmos el modal
        let arrayCreacionCategoriaTallas = categoriaProductosCreacion(document.getElementById("categoria-form"));//Evaluamos la categoría
        ///////////////////////////////////////////////////////////////////////////////
        crearHeadRegistro();
        contenedorBotonesModal(`mandarATablaPrincipalRegistro()`, "Enviar a la lista");
        arrayCreacionCategoriaTallas.forEach((event) =>{
            //Buscamos coincidencias en la base de datos y en array_saldos
            let cod_db = buscarProductosDinamicamente(`${document.getElementById("codigo-form").value}-${event}-${document.getElementById("lote-form").value}`);
            let cod_a_s = array_saldos.find(x=> x.codigo === `${document.getElementById("codigo-form").value}-${event}-${document.getElementById("lote-form").value}`)

            //Si no hay coincidencias se prosigue con el proceso
            if(cod_db !== undefined){
                array_cod_db.push(cod_db.codigo)// recolectamos los codigos que se repiten en la base de datos
            }else if(cod_a_s !== undefined){
                array_cod_a_s.push(cod_a_s.codigo)// recolectamos los codigos que se repiten en la Lista de registro
            }else{
                crearBodyRegistro(event, document.getElementById("lote-form").value)
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
        document.querySelector("#tabla_modal > tbody > tr:nth-child(1) > td:nth-child(3) > input").focus()

    };
};

function op_costo(e){
    let row_ = e.closest("tr");
    let obj_ = array_saldos.find(x => x.codigo === row_.children[1].textContent);
    obj_.in_c(e);
};
function op_precio(e){
    let row_ = e.closest("tr");
    let obj_ = array_saldos.find(x => x.codigo === row_.children[1].textContent);
    obj_.in_p(e);
};
function op_descri(e){
    let row_ = e.closest("tr");
    let obj_ = array_saldos.find(x => x.codigo === row_.children[1].textContent);
    obj_.in_d(e);
};

function filaBodyProformaPincipal(){
    const fila_principal = document.querySelector("#tabla_principal > tbody");
    let ccp = document.querySelectorAll(".codigo_proforma");
    let codigo_prof = Array.from(ccp).map(x => x.textContent);
    const cod_remove = document.querySelectorAll(".codigo_modal");
    array_saldos.forEach((obj_registro)=>{
        let coincidencia_codigo = codigo_prof.find(x=> x === obj_registro.codigo)
        if(coincidencia_codigo === undefined){
            if(obj_registro.costo > 0 && obj_registro.precio > 0){
                let d_proveedor = prv_db.find(x => x.id_cli === Number(obj_registro.proveedor))
                let d_categoria = cat_db.find(x => x.id === Number(obj_registro.categoria))
                let nueva_fila_principal = fila_principal.insertRow(-1);
                let fila = `<tr>`+
                                `<td>${d_categoria.categoria_nombre}</td>`+// Columna 1 > categoría
                                `<td class="codigo_proforma">${obj_registro.codigo}</td>`+// Columna 2 > código 
                                `<td>${obj_registro.descripcion}</td>`+// Columna 3 > descripción
                                `<td>${obj_registro.talla}</td>`+// Columna 4 > talla
                                `<td style="text-align: right">${formatoMoneda(obj_registro.costo)}</td>`+// Columna 6 > costo unitario
                                `<td style="text-align: right">${formatoMoneda(obj_registro.precio)}</td>`+// Columna 8 > precio de venta
                                `<td style="text-align: right">${obj_registro.lote}</td>`+// Columna 9 > lote
                                `<td style="text-align: right">${d_proveedor.nombre_cli}</td>`+// Columna 10 > proveedor
                                `<td style="text-align: center">
                                    <div class="tooltip">
                                        <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFilaDos(this)">delete</span>
                                        <span class="tooltiptext">Eliminar producto</span>
                                    </div>
                                </td>`+// Columna 15 > botón eliminar fila
                            `</tr>`
                nueva_fila_principal.innerHTML = fila;

                cod_remove.forEach((e)=>{//Eliminamos la fila en tabla modal
                    e.textContent === obj_registro.codigo ? e.parentNode.remove(): ""
                })
            };
        };
    });
};
function mandarATablaPrincipalRegistro(){
    filaBodyProformaPincipal();
    
    document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show")
    document.querySelector("#tabla_modal > thead > tr:nth-child(2)").remove()
    
    document.getElementById("formulario-compras-uno").reset();
    document.getElementById("id-form").value = "";
    document.getElementById("codigo-form").focus();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const procesarRegistro = document.getElementById("procesar-registro");
procesarRegistro.addEventListener("click", procesamientoRegistros)
async function procesamientoRegistros(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla_principal > tbody").children.length > 0){
            modal_proceso_abrir("Procesando el registro!!!.", "")
            await funcionGeneralRegistro();
            document.querySelector("#tabla_principal > tbody").remove();
            document.querySelector("#tabla_principal").createTBody();
            array_saldos = [];
        }else if(document.querySelector("#tabla_principal > tbody").rows.length === 0){
            modal_proceso_abrir("Imposible procesar, la lista está vacía.", "")
            modal_proceso_salir_botones();
        };
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. " + error, "")
        modal_proceso_salir_botones()
    };
};
async function funcionGeneralRegistro(){
    let array_productos = [];
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
    array_saldos.forEach((event)=>{
        array_productos.push(new DatosProductos(event))
    });
    function DatosRegistro(){
        this.array_productos = array_productos;
    };

    let url_registro = URL_API_almacen_central + 'gestion_de_registro'
    let objeto_registro = new DatosRegistro();
    let response = await funcionFetchDos(url_registro, objeto_registro);
    if(response.status === "success"){
        localStorage.setItem("inventarios_consulta", JSON.stringify(await cargarDatos('almacen_central_ccd')))
        inv_db = JSON.parse(localStorage.getItem("inventarios_consulta"))
        inv_db_grupo = dividirProductosDinamicamente(inv_db);
        modal_proceso_abrir(`${response.message}`, "")
        modal_proceso_salir_botones()
    };
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////MODIFICACION DE PRODUCTOS/////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////BUSCAR EN PRODUCTOS /////////////////////////////////////////////////////
const botonEditarProducto = document.getElementById("editar-modificacion");
botonEditarProducto.addEventListener("click", () =>{
    document.getElementById("form_contenedor").innerHTML = formUpdate('Modificación')
    document.getElementById("button_contenedor").innerHTML = formButton("Agregar a pre lista", "agregarATablaPreModificacion()", "reseteoFormulario()")
    document.getElementById("categoria-form").innerHTML = llenarCategoriaProductosEjecucion();

    document.getElementById("registra-modificacion").classList.remove("marcaBotonDos")
    document.getElementById("editar-modificacion").classList.add("marcaBotonDos")
    document.getElementById("buscador-productos-form").focus();
    document.querySelector(".baja_opacidad_interior").classList.add("alta_opacidad_interior") 
 
    document.getElementById("procesar-registro").classList.add("invisible")
    document.getElementById("procesar-modificacion-principal").classList.remove("invisible")                
    document.getElementById("id-form").value = ""
    document.querySelector("#tabla_modal > tbody").remove()
    document.querySelector("#tabla_modal").createTBody()
    document.querySelector("#tabla_principal > tbody").remove()
    document.querySelector("#tabla_principal").createTBody()
    buscarProducto(document.getElementById('buscador-productos-form'))
    clave_form = 1;
    array_saldos = [];
});

function reseteoFormulario(){
    document.getElementById("id-form").value = "";
    document.getElementById('categoria-form').value = "0";
    document.getElementById('codigo-form').value = "";
    document.getElementById('descripcion-form').value = "";
    if(clave_form == 0){
        document.getElementById('costo-form').value = "";
        document.getElementById('precio-form').value = "";
        document.getElementById('lote-form').value = "";
        document.getElementById('proveedor-form').value = document.getElementById('proveedor-form')[0].value;
        document.getElementById("codigo-form").focus();
    }else if(clave_form == 1){
        document.getElementById("buscador-productos-form").focus();
    };
};

function crearHeadModificacion(){
    let tablaCompras= document.querySelector("#tabla_modal > thead");
    let nuevaFilaTablaCompras = tablaCompras.insertRow(-1);
    let fila =  `
                <tr class="tbody_preproforma">
                    <th style="width: 120px;">Categoría</th>
                    <th style="width: 120px;">Código</th>
                    <th style="width: 200px;">Descripción</th>
                    <th style="width: 70px;">Medidas</th>
                    <th style="width: 70px;">Costo Unitario</th>
                    <th style="width: 70px;">Precio de Venta</th>
                    <th style="width: 70px;">Lote</th>
                    <th style="width: 70px;">Proveedor</th>
                    <th style="width: 40px;"><span style="font-size:18px;" class="material-symbols-outlined">delete</span></th>
                </tr>
                `
    nuevaFilaTablaCompras.innerHTML = fila;
};
function crearBodyModificacion(codigoModificacion, id_prod){
    let tablaMofidicacion = document.querySelector("#tabla_modal > tbody");
    let nuevaFilaTablaModificacion = tablaMofidicacion.insertRow(-1);
    let fila = `<tr>`+
                    `<td class="id_modal invisible">${id_prod}</td>`+// Columna 0 > id
                    `<td>
                        <select class="categoria_cambio">
                        </select>
                    </td>`+// Columna 1 > Categoría
                    `<td><input class="codigo_modal input-tablas" value="${codigoModificacion}" placeholder="Rellene esta celda" onKeyup="op_codigo(this)"></td>`+// Columna 2 > Código
                    `<td><input class="input-tablas-texto-largo" placeholder="Rellene esta celda" onKeyup="op_descri_dos(this)"></td>`+// Columna 3 > descripción
                    `<td>
                        <select class="medida_cambio">
                        </select>
                    </td>`+// Columna 4 > Talla
                    `<td><input class="costo-unitario-modificacion input-tablas-dos-largo" placeholder="Valor >= 0" onKeyup="op_costo_dos(this)"></td>`+// Columna 5 > costo unitario
                    `<td><input class="input-tablas-dos-largo" placeholder="Valor >= C" onKeyup="op_precio_dos(this)"></td>`+// Columna 6 > precio de venta
                    `<td><input class="input-tablas-dos" placeholder="Valor > 0" onKeyup="op_lote(this)"></td>`+// Columna 7 > lote
                    `<td>
                        <select class="proveedor_cambio">
                        </select>
                    </td>`+// Columna 8 > proveedor
                    `<td style="text-align: center">
                        <div class="tooltip">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFilaId(this, 0)">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </div>
                    </td>`+// Columna 9 > botón eliminar fila
                `</tr>`
    nuevaFilaTablaModificacion.innerHTML = fila;
};

/////AQUI MANDAMOS A TABLA PREMODIFICACION PARA EDITAR VALORES/////////////////////////////////////////////////////////////

async function agregarATablaPreModificacion(){
    modal_proceso_abrir("Buscando resultados...", "", "")
    let array_id_a_s = 0;
    crearHeadModificacion()
    let arrayCreacionCategoriaTallas = categoriaProductosCreacion(document.getElementById("categoria-form"));

    for(let i = 0; i < arrayCreacionCategoriaTallas.length; i++){
        let codigo_form = document.getElementById("codigo-form").value

        for(let j = 0; j < arrayCreacionCategoriaTallas.length; j++){
            if(codigo_form.includes("-" + arrayCreacionCategoriaTallas[j])){
                codigo_form = codigo_form.replace("-" + arrayCreacionCategoriaTallas[j], "-" + arrayCreacionCategoriaTallas[i])
            }
        };
        let base = buscarProductosDinamicamente(`${codigo_form}`);// Buscamos en la base de datos la existencia del código
        if(base){
            let id_a_s = array_saldos.find(x=> x.idProd === Number(base.idProd))
            if(id_a_s !== undefined){// Si el nuevo id ya se encuentra en el array_saldos no pasará a la pre lista
                array_id_a_s.push(id_a_s.codigo)
            }else{
                crearBodyModificacion(codigo_form, base.idProd)
            };
        };
    };
    rellenarCategoria();
    rellenarProveedor();
    contenedorBotonesModal("mandarATablaPrincipalModificacion()", "Enviar a la lista");
    if(array_id_a_s.length > 0){
        let cabecera =  `<ul>Los códigos: `
            for(let event of array_id_a_s){
                cabecera += `<li class="diseno_li">${event},</li>`;
            }
            cabecera +=`</ul> Ya se encuentran en la lista de modificación.`;
            modal_proceso_abrir("", "", cabecera)
        modal_proceso_salir_botones()
    };
    document.querySelectorAll(".codigo_modal").forEach((event)=>{
        if(event.value === document.getElementById("codigo-form").value){
            event.style.background = "var(--boton-tres)"
        }
    });
    document.querySelector(".contenedor-pre-recompra").classList.add("modal-show");
    await buscarPorCodidoModificacionOrigen();
    arrayCreacionCategoriaTallas = [];
    modal_proceso_abrir("Resultados encontrados", "", "")
    modal_proceso_cerrar()
};
function op_costo_dos(e){
    let row_ = e.closest("tr");
    let obj_ = array_saldos.find(x => x.idProd === Number(row_.children[0].textContent));
    obj_.in_c(e)
};
function op_precio_dos(e){
    let row_ = e.closest("tr");
    let obj_ = array_saldos.find(x => x.idProd === Number(row_.children[0].textContent));
    obj_.in_p(e)
};
function op_descri_dos(e){
    let row_ = e.closest("tr");
    let obj_ = array_saldos.find(x => x.idProd === Number(row_.children[0].textContent));
    obj_.in_d(e);
};
function op_codigo(e){
    let row_ = e.closest("tr");
    let obj_ = array_saldos.find(x => x.idProd === Number(row_.children[0].textContent));
    obj_.in_cod(e);
};
function op_lote(e){
    let row_ = e.closest("tr");
    let obj_ = array_saldos.find(x => x.idProd === Number(row_.children[0].textContent));
    obj_.in_l(e);
};
function rellenarCategoria(){
    document.querySelectorAll(".categoria_cambio").forEach((event, i)=>{
        event.innerHTML = llenarCategoriaProductosEjecucion();
        event.addEventListener("change", ()=>{
            rellenarMedidasCategoria(Number(event.value), i)
            let fila_ = event.parentNode.parentNode;
            fila_.children[2].children[0].value = fila_.children[2].children[0].value.replace(/-.*?-/g, `-${fila_.children[4].children[0].value}-`);
        });
    });
};
function rellenarMedidasCategoria(id_categoria, i){

    let fila_ = document.querySelectorAll(".medida_cambio");
    let fila_codigo = document.querySelectorAll(".codigo_modal");

    let cat = cat_db.find(x => x.id === id_categoria)
    let _medidas = [cat.uno, cat.dos, cat.tres, cat.cuatro, cat.cinco, cat.seis, cat.siete, cat.ocho, cat.nueve, cat.diez, cat.once, cat.doce] 

    html_cat = "";
    for(medida of _medidas) {
        if(medida !== ""){
            let fila = `<option value="${medida}">${medida}</option>`
            html_cat = html_cat + fila;
        };
    };
    fila_[i].innerHTML = html_cat;
    fila_[i].addEventListener("change",()=>{
        fila_codigo[i].value = fila_codigo[i].value.replace(/-.*?-/g, `-${fila_[i].value}-`);
    });
};

function rellenarProveedor(){
    document.querySelectorAll(".proveedor_cambio").forEach((event)=>{
        event.innerHTML = baseProv();
    });
};
async function buscarPorCodidoModificacionOrigen(){
    let suma = 0;
    const id_rem = document.querySelectorAll(".id_modal");
    let ids = Array.from(id_rem).map(element => element.textContent);
    let response = await cargarDatos(   `almacen_central_codigo_transferencias?`+
                                        `ids=${ids.join(",")}`);
    await delay(500)
    for(id_m of id_rem){
        let row_ = id_m.closest("tr");
        let fila_res = response.find(x=> x.idProd === Number(row_.children[0].textContent))
        if(fila_res){
            row_.children[1].children[0].value = fila_res.categoria
            row_.children[3].children[0].value = fila_res.descripcion
            row_.children[5].children[0].value = fila_res.costo_unitario.toFixed(2)
            row_.children[6].children[0].value = fila_res.precio_venta.toFixed(2)
            row_.children[7].children[0].value = fila_res.lote
            row_.children[8].children[0].value = fila_res.proveedor
            if(row_.children[0].textContent == document.getElementById("id-form").value){
                id_m.style.background = "rgb(105, 211, 35)"
                id_m.style.color = "var(--color-secundario)"
            };
            rellenarMedidasCategoria(fila_res.categoria, suma)
            row_.children[4].children[0].value = fila_res.talla
            suma+=1;
            array_saldos.push(new ObjGeneral(   fila_res.categoria,
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////AQUI SE MANDA A TABLA MODIFICACION PRINCIPAL CON VALORES YA EDITADOS////////////////////////////////////////////////////////////////
function filaBodyProformaPincipalDos(){
    const fila_principal = document.querySelector("#tabla_principal > tbody");
    let idd = document.querySelectorAll(".id_proforma");
    let id_prof = Array.from(idd).map(x => Number(x.textContent));
    const id_remove = document.querySelectorAll(".id_modal");

    array_saldos.forEach((obj_mod)=>{
        let coincidencia_id = id_prof.find(x=> x === obj_mod.idProd)
        if(coincidencia_id === undefined){

            if(obj_mod.codigo !== "" && obj_mod.descripcion !== "" &&
            obj_mod.costo > 0 && obj_mod.precio > 0 && obj_mod.lote > 0){
                let d_proveedor = prv_db.find(x => x.id_cli === Number(obj_mod.proveedor))
                let d_categoria = cat_db.find(x => x.id === Number(obj_mod.categoria))
                let nueva_fila = fila_principal.insertRow(-1);
                let fila = `<tr>`+
                            `<td class="id_proforma invisible">${obj_mod.idProd}</td>`+// Columna 0 > id
                            `<td>${d_categoria.categoria_nombre}</td>`+// Columna 1 > categoría
                            `<td class="codigo_proforma">${obj_mod.codigo}</td>`+// Columna 2 > código
                            `<td>${obj_mod.descripcion}</td>`+// Columna 3 > descripción
                            `<td>${obj_mod.talla}</td>`+// Columna 4 > talla
                            `<td style="text-align: right">${obj_mod.costo}</td>`+// Columna 5 > costo unitario
                            `<td style="text-align: right">${obj_mod.precio}</td>`+// Columna 6 > precio de venta
                            `<td style="text-align: right">${obj_mod.lote}</td>`+// Columna 7 > lote
                            `<td style="text-align: right">${d_proveedor.nombre_cli}</td>`+// Columna 8 > proveedor
                            `<td style="text-align: center">
                                <div class="tooltip">
                                    <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFilaDosId(this)">delete</span>
                                    <span class="tooltiptext">Eliminar producto</span>
                                </div>
                            </td>`+// Columna 9 > 
                        `</tr>`
                nueva_fila.innerHTML = fila;
                
                id_remove.forEach((e)=>{//Eliminamos la fila en tabla modal
                    Number(e.textContent) === obj_mod.idProd ? e.parentNode.remove(): ""
                });
            };
        };
    });
};

function mandarATablaPrincipalModificacion(){
    filaBodyProformaPincipalDos();

    document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show")
    document.querySelector("#tabla_modal > thead > tr:nth-child(2)").remove()

    document.getElementById("formulario-compras-uno").reset();
    document.getElementById("id-form").value = "";
    document.getElementById("buscador-productos-form").focus();
};

const procesarModificacionAProductos = document.getElementById("procesar-modificacion-principal");
procesarModificacionAProductos.addEventListener("click", procesamientoModificacion)
async function procesamientoModificacion(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla_principal > tbody").children.length > 0){
            modal_proceso_abrir("Procesando la modificación!!!.", "")
            await funcionGeneralModificacion();
            document.querySelector("#tabla_principal > tbody").remove();
            document.querySelector("#tabla_principal").createTBody();
            array_saldos = [];
        };
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. " + error, "")
        console.error("Ocurrió un error. ", error)
        modal_proceso_salir_botones()
    };
}
async function funcionGeneralModificacion(){
    let array_productos = [];
    modal_proceso_abrir("Procesando la modificación!!!.", "")
    function DatosProductos(a){
        this.idProd = a.idProd;
        this.categoria = a.categoria;
        this.codigo = a.codigo;
        this.descripcion = a.descripcion;
        this.talla = a.talla;
        this.costo_unitario = a.costo;
        this.precio_venta = a.precio;
        this.lote = a.lote;
        this.proveedor = a.proveedor;
    };
    array_saldos.forEach((event)=>{
        array_productos.push(new DatosProductos(event))
    });
    function DatosModificacion(){
        this.array_productos = array_productos;
    };
    let url_mod = URL_API_almacen_central + 'gestion_de_modificacion'
    let objeto_mod = new DatosModificacion();
    let response = await funcionFetchDos(url_mod, objeto_mod);
    if(response.status === "success"){
        localStorage.setItem("inventarios_consulta", JSON.stringify(await cargarDatos('almacen_central_ccd')))
        modal_proceso_abrir(`${response.message}`, "")
        modal_proceso_salir_botones()
    };
};

const removerTablaModificacionDos = document.getElementById("remover-tabla-modificacion-dos");
removerTablaModificacionDos.addEventListener("click", () =>{
    document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show");
    document.querySelector("#tabla_principal > tbody").remove();
    document.querySelector("#tabla_principal").createTBody();
    if(clave_form == 0){
        document.getElementById("codigo-form").focus();
    }else if(clave_form == 1){
        document.getElementById("buscador-productos-form").focus();
    };
    array_saldos = [];
});
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
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
};
function clicKEliminarFilaId(e, indice_codigo) {
    const fila = e.closest("tr");
    array_saldos.forEach((e, i)=>{//Buscamos una coincidencia de código
        e.idProd === Number(fila.children[indice_codigo].textContent) ? array_saldos.splice(i, 1): "";//elimina el objeto con el índice i
    });
    fila.remove();
};
function clicKEliminarFilaDosId(e) {
    const fila = e.closest("tr");
    array_saldos.forEach((e, i)=>{//Buscamos una coincidencia de código
        e.idProd === Number(fila.children[0].textContent) ? array_saldos.splice(i, 1): "";//elimina el objeto con el índice i
    });
    fila.remove();
};

function removerModal(){
    if(clave_form == 0){
        removerListaModal()
        document.getElementById("codigo-form").focus();
    }else if(clave_form == 1){
        removerListaModalId()
        document.getElementById("buscador-productos-form").focus();
    };
    document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show")
    document.querySelector("#tabla_modal > thead > tr:nth-child(2)").remove()
    document.querySelector("#tabla_modal > tbody").remove();
    document.querySelector("#tabla_modal").createTBody();
};
function removerListaModal(){// Elimina los elementos del array_saldos que coincidan con los elementos de la tabla modal
    let filas = document.querySelectorAll(".codigo_modal")
    filas.forEach((e) =>{
        array_saldos.forEach((event, i)=>{
            event.codigo === e.textContent ? array_saldos.splice(i, 1): "";
        })
    })
};
function removerListaModalId(){// Elimina los elementos del array_saldos que coincidan con los elementos de la tabla modal
    let filas = document.querySelectorAll(".codigo_modal")
    filas.forEach((e) =>{
        let row_ = e.closest("tr")
        array_saldos.forEach((event, i)=>{
            event.idProd === Number(row_.children[0].textContent) ? array_saldos.splice(i, 1): "";
        })
    })
};