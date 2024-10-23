document.addEventListener("DOMContentLoaded", inicioPerdidas)
let anio_principal = ""
function inicioPerdidas(){
    anio_principal = new Date().getFullYear()
    document.getElementById("form_contenedor").innerHTML = formUpdate('Despacho')
    document.querySelector(".baja_opacidad_interior").classList.add("alta_opacidad_interior")
    document.getElementById("button_contenedor").innerHTML = formButton("Agregar a pre lista", "agregarAtablaModal()", "reseteoFormulario()")
    document.getElementById("categoria-form").innerHTML = llenarCategoriaProductosEjecucion();
    buscarProducto(document.getElementById('buscador-productos-form'))
    cargarDatosAnio()
    btnPerdidas = 1;

    document.getElementById("categoria_buscador_detalle").innerHTML = llenarCategoriaProductosEjecucion();
};
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
let array_saldos = [];
const in_existencias = ["in_ac", "in_su", "in_sd", "in_st", "in_sc"];
const barras_perdidas = [".cg_1_c", ".cg_2_c", ".cg_3_c", ".cg_4_c", ".cg_5_c"]
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        reinicioBarraGrafico(barras_perdidas);
        anio_principal = anio_referencia.value;

        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////Pérdidas/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function reseteoFormulario(){
    document.getElementById("id-form").value = "";
    document.getElementById('categoria-form').value = "0";
    document.getElementById('codigo-form').value = "";
    document.getElementById('descripcion-form').value = "";
};

function crearHeadDespacho(){
    let tablaDespacho= document.querySelector("#tabla_modal > thead");
    let nuevaFilaTablaDespacho = tablaDespacho.insertRow(-1);
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
                    <th style="width: 70px;">Motivo</th>
                    <th style="width: 40px;"><span style="font-size:18px;" class="material-symbols-outlined">delete</span></th>
                </tr>
                `
    nuevaFilaTablaDespacho.innerHTML = fila;
};
function crearBodyDespacho (codigo, id_prod){
    let tabladespacho= document.querySelector("#tabla_modal > tbody");
    let nuevaFilaTabladespacho = tabladespacho.insertRow(-1);
    let fila = `<tr>`+
                    `<td class="id_modal invisible">${id_prod}</td>`+// Columna 0 > id
                    `<td class="suc_modal">${suc_add[obtenerIndiceSucursal("#sun_opc")]}</td>`+// Columna 1 > sucursal
                    `<td>${document.getElementById("categoria-form").children[document.getElementById("categoria-form").selectedIndex].textContent}</td>`+// Columna 2 > categoría
                    `<td class="codigo_despacho_modal" style="border-radius: 5px">${codigo}</td>`+// Columna 3 > código
                    `<td></td>`+// Columna 4 > descripción
                    `<td style="text-align: right"></td>`+// Columna 5 > existencias
                    `<td><input class="input-tablas-dos-largo insertarNumero" placeholder="Valor > 0" onkeyup="op_cantidad(this)"></td>`+// Columna 6 > cantidad a despachar
                    `<td class="saldos_despacho"></td>`+// Columna 7 > saldo de existencias
                    `<td style="text-align: right"></td>`+// Columna 8 > costo
                    `<td style="text-align: right"></td>`+// Columna 9 > total costo
                    `<td class="invisible">${obtenerIndiceSucursal("#sun_opc")}</td>`+// Columna 10 > índice sucursal sucursal
                    `<td>${document.getElementById("motivo_salida").value}</td>`+// Columna 11 > motivo
                    `<td style="text-align: center">
                        <div class="tooltip">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila"  onCLick = "clicKEliminarFila(this)">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </div>
                    </td>`+// Columna 12 > botón eliminar fila
                `</tr>`
    nuevaFilaTabladespacho.innerHTML = fila;
};
function contenedorBotonesModal(funcion, titulo){
    let contenedor_bot = document.querySelector("#contenedor_botones_modal");
    let html =  `
                <button class="myButtonAgregar" onCLick="${funcion}">${titulo}</button>
                <button onCLick="removerModal()" class="myButtonEliminar">Cancelar</button>
                `;
    contenedor_bot.innerHTML = html;
};
function accionSelectDos(){// cambios al efectuar un cambio en select de sucursales en tabla modal
    let _suc_ = document.querySelectorAll(".suc_modal")
    _suc_.forEach((e)=>{
        let row_ = e.closest("tr")
        let obj_ = array_saldos.find(x=> x.idProd === Number(row_.children[0].textContent));// buscamos una coincidencia por id
        
        if(obj_){
            row_.children[10].textContent = obtenerIndiceSucursal("#sun_opc")

            row_.children[1].textContent = document.getElementById("sun_opc")[obtenerIndiceSucursal("#sun_opc")].textContent;
            row_.children[5].textContent = obj_[in_existencias[row_.children[10].textContent]]// existencias según sucursal
            row_.children[6].children[0].value = obj_[sucursales_activas[row_.children[10].textContent]]// cantidad ingresada segun la sucursal
            row_.children[7].textContent = obj_[in_existencias[row_.children[10].textContent]] - Number(row_.children[6].children[0].value)
            row_.children[9].textContent = formatoMoneda(obj_[sucursales_activas[row_.children[10].textContent]] * obj_.costo)
        };
    });
};
async function agregarAtablaModal(){
    if(document.getElementById("id-form").value > 0 && document.getElementById("motivo_salida").value !== "0"){
        let array_id_a_s = [];
        crearHeadDespacho()
        cargarSucursalesEjecucion(document.getElementById("sun_opc"))
        let arrayCreacionCategoriaTallas = categoriaProductosCreacion(document.getElementById("categoria-form"));
        
        for(let i = 0; i < arrayCreacionCategoriaTallas.length; i++){
            let codigo_form = document.getElementById("codigo-form").value

            for(let j = 0; j < arrayCreacionCategoriaTallas.length; j++){
                if(codigo_form.includes("-" + arrayCreacionCategoriaTallas[j])){
                    codigo_form = codigo_form.replace("-" + arrayCreacionCategoriaTallas[j], "-" + arrayCreacionCategoriaTallas[i])
                }
            };
            let base = buscarProductosDinamicamente(`${codigo_form}`)// Buscamos en la base de datos la existencia del código
            if(base){
                let id_a_s = array_saldos.find(x=> x.idProd === Number(base.idProd))
                if(id_a_s !== undefined){// Si el nuevo id ya se encuentra en el array_saldos no pasará a la pre lista
                    array_id_a_s.push(id_a_s.codigo)
                }else{
                    crearBodyDespacho(codigo_form, base.idProd)
                };
            };
        };
        contenedorBotonesModal("mandarAtablaAPrincipal()", "Enviar a la lista")
        if(array_id_a_s.length > 0){
            let cabecera =  `<ul>Los códigos: `
            for(let event of array_id_a_s){
                cabecera += `<li class="diseno_li">${event},</li>`;
            }
            cabecera +=`</ul> Ya se encuentran en la lista de despacho.`;
            modal_proceso_abrir("", "", cabecera)
            modal_proceso_salir_botones()
        };
        document.querySelectorAll(".codigo_despacho_modal").forEach((event)=>{
            if(event.textContent === document.getElementById("codigo-form").value){
                event.style.background = "var(--boton-tres)"
            }
        });
        document.querySelector(".contenedor-pre-recompra").classList.add("modal-show")
        await buscarPorCodido();

        arrayCreacionCategoriaTallas = [];
        document.querySelector("#tabla_modal > tbody > tr:nth-child(1) > td:nth-child(7) > input").focus();
    }else if(document.getElementById("motivo_salida").value === "0"){
        document.getElementById("motivo_salida").style.background = "var(--boton-dos)"
    };
};
function op_cantidad(e){
    let row_ = e.closest("tr");
    let indice_suc = row_.children[10].textContent;
    let obj_ = array_saldos.find(x => x.idProd === Number(row_.children[0].textContent));//Busca coincidencias de código en array_saldos
    obj_.in_q(e, indice_suc)
    row_.children[7].textContent = Number(row_.children[5].textContent) - Number(e.value)
    row_.children[9].textContent = formatoMoneda(obj_.total_costo(indice_suc))
    row_.children[7].style.background = row_.children[7].textContent < 0 ? "var(--boton-dos)" : "";//pintamos si es negativo
};
async function buscarPorCodido(){
    const id_rec = document.querySelectorAll(".id_modal");
    let ids = Array.from(id_rec).map(element => element.textContent);
    let response = await cargarDatos(   `almacen_central_codigo_transferencias?`+
                                        `ids=${ids.join(",")}`);

    for(id_c of id_rec){
        let row_ = id_c.closest("tr");
        let fila_res = response.find(x=> x.idProd === Number(row_.children[0].textContent))
        if(fila_res){
            row_.children[4].textContent = fila_res.descripcion
            row_.children[5].textContent = fila_res[sucursales_activas[row_.children[10].textContent]];
            row_.children[7].textContent = fila_res[sucursales_activas[row_.children[10].textContent]];
            row_.children[8].textContent = formatoMoneda(fila_res.costo_unitario);
            row_.children[9].textContent = "0.00";
            if(row_.children[0].textContent == document.getElementById("id-form").value){
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
                                            document.getElementById("motivo_salida").value 
                                            ));
        };
    };
};
function filaBodyProformaPincipal(){
    const fila_principal = document.querySelector("#tabla_principal > tbody");
    let idd = document.querySelectorAll(".id_proforma");
    let id_prof = Array.from(idd).map(x => Number(x.textContent));
    const id_remove = document.querySelectorAll(".id_modal");

    array_saldos.forEach((obj_des)=>{
        let coincidencia_id = id_prof.find(x=> x === obj_des.idProd)
        if(coincidencia_id === undefined){

            if(obj_des.val_sal().every(valor => valor >= 0 && Number.isFinite(valor)) && 
            obj_des.val_exs().some(valor => valor > 0)){
                let d_categoria = cat_db.find(x => x.id === Number(obj_des.categoria))
                let nueva_fila = fila_principal.insertRow(-1);
                let fila = `<tr>`+
                            `<td class="id_proforma invisible">${obj_des.idProd}</td>`+// Columna 0 > id
                            `<td>${d_categoria.categoria_nombre}</td>`+// Columna 1 > categoría
                            `<td class="codigo_compras_proforma">${obj_des.codigo}</td>`+// Columna 2 > código
                            `<td style="text-align: right">${obj_des.descripcion}</td>`+// Columna 3 > descripción
                            `<td class="s_1" style="text-align: right">${obj_des.existencias_ac}</td>`+// Columna 4 > existencias
                            `<td class="s_2" style="text-align: right">${obj_des.existencias_su}</td>`+// Columna 5 > existencias
                            `<td class="s_3" style="text-align: right">${obj_des.existencias_sd}</td>`+// Columna 6 > existencias
                            `<td class="s_4" style="text-align: right">${obj_des.existencias_st}</td>`+// Columna 7 > existencias
                            `<td class="s_5" style="text-align: right">${obj_des.existencias_sc}</td>`+// Columna 8 > existencias
                            `<td style="text-align: right">${formatoMoneda(obj_des.costo)}</td>`+// Columna 9 > costo
                            `<td style="text-align: right">${formatoMoneda(obj_des.suma_val_exs() * obj_des.costo)}</td>`+// Columna 10 > costo total
                            `<td style="text-align: right">${obj_des.motivo}</td>`+// Columna 11 > motivo
                            `<td style="text-align: center">
                                <div class="tooltip">
                                    <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFilaDos(this)">delete</span>
                                    <span class="tooltiptext">Eliminar producto</span>
                                </div>
                            </td>`+// Columna 11 >
                        `</tr>`
                nueva_fila.innerHTML = fila;

                id_remove.forEach((e)=>{//Eliminamos la fila en tabla modal
                    Number(e.textContent) === obj_des.idProd ? e.parentNode.remove(): "";
                });
            };
        };
    });
};
function mandarAtablaAPrincipal(){
    filaBodyProformaPincipal()

    if(document.querySelector("#tabla_modal > tbody").children.length == 0){
        document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show")
        document.querySelector("#tabla_modal > thead > tr:nth-child(2)").remove()
    }
    sumaSaldosProforma();
    document.getElementById("formulario-compras-uno").reset();
    document.getElementById("id-form").value = ""
    document.getElementById("buscador-productos-form").focus();
    document.getElementById("motivo_salida").value = 0;
};
const procesarDespachoPlus = document.querySelector("#procesar-despacho-plus");
procesarDespachoPlus.addEventListener("click", procesamientoDespacho)
async function procesamientoDespacho(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla_principal > tbody").children.length > 0){
            modal_proceso_abrir("Procesando el despacho!!!.", "")
            
            await funcionGeneralDespacho();
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
async function funcionGeneralDespacho(){
    let array_productos = [];
    let array_despacho = [];
    function DatosProductos(a){
        this.idProd = a.idProd;
        this.existencias_ac = -a.existencias_ac;
        this.existencias_su = -a.existencias_su;
        this.existencias_sd = -a.existencias_sd;
        this.existencias_st = -a.existencias_st;
        this.existencias_sc = -a.existencias_sc;
    };
    function DatosDespacho(a, sucursal, i){
        this.idProd = a.idProd;
        this.existencias_post = a[sucursales_activas[i]];
        this.suc_perdidas = sucursal;
        this.causa = a.motivo;
    }
    array_saldos.forEach((event)=>{
        array_productos.push(new DatosProductos(event))
        suc_add.forEach((e, i)=>{
            let sucursal_ = suc_db.find(x=> x.sucursal_nombre === e);
            if(sucursal_){
                event[sucursales_activas[i]] > 0 
                    ? array_despacho.push(new DatosDespacho(event, sucursal_.id_sucursales, i))
                    : "";
            };
        });
    });
    function DataDespacho(){
        this.array_productos = array_productos;
        this.array_despacho = array_despacho;
        this.fecha = generarFecha();
    }
    let despacho = new DataDespacho();
    let urlProductos = URL_API_almacen_central + 'procesar_perdida'
    let response = await funcionFetchDos(urlProductos, despacho);
    if(response.status === "success"){
        modal_proceso_abrir(`${response.message}`)
        modal_proceso_salir_botones()
    };
};


////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
function clicKEliminarFila(e){
    const fila = e.closest("tr");
    array_saldos.forEach((e, i)=>{//Buscamos una coincidencia de código
        e.idProd === Number(fila.children[0].textContent) ? array_saldos.splice(i, 1): "";//elimina el objeto con el índice i
    });
    fila.remove();
};
function clicKEliminarFilaDos(e){
    const fila = e.closest("tr");
    array_saldos.forEach((e, i)=>{//Buscamos una coincidencia de código
        e.idProd === Number(fila.children[0].textContent) ? array_saldos.splice(i, 1): "";//elimina el objeto con el índice i
    });
    fila.remove();
    sumaSaldosProforma();
};
function removerModal(){
    removerListaModal()
    document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show")
    document.querySelector("#tabla_modal > thead > tr:nth-child(2)").remove()
    document.querySelector("#tabla_modal > tbody").remove();
    document.querySelector("#tabla_modal").createTBody();
    document.getElementById("buscador-productos-form").focus();
}
function removerListaModal(){// Elimina los elementos del array_saldos que coincidan con los elementos de la tabla modal
    let filas = document.querySelectorAll(".id_modal")
    filas.forEach((e) =>{
        array_saldos.forEach((event, i)=>{
            event.idProd === Number(e.textContent) ? array_saldos.splice(i, 1): "";
        })
    })
};
const removerTablaModal = document.getElementById("remover-tabla-despacho-dos");
removerTablaModal.addEventListener("click", () =>{
    document.querySelector("#tabla_principal > tbody").remove();
    document.querySelector("#tabla_principal").createTBody();
     document.getElementById("buscador-productos-form").focus();
    array_saldos = [];
    sumaSaldosProforma();
});

function sumaSaldosProforma(){
    const exs = [".s_1", ".s_2", ".s_3", ".s_4", ".s_5"]
    const t_exs = [".t_e_1", ".t_e_2", ".t_e_3", ".t_e_4", ".t_e_5"]
    exs.forEach((e, i)=>{
        let col = Array.from(document.querySelectorAll(e)).map(x => Number(x.textContent));
        let suma = col.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
        document.querySelector(t_exs[i]).textContent = suma;
    });
};