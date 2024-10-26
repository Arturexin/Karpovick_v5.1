document.addEventListener("DOMContentLoaded", inicioTransferencias)
let anio_principal = ""
function inicioTransferencias(){
    anio_principal = new Date().getFullYear()
    document.getElementById("form_contenedor").innerHTML = formUpdate('Transferencias')
    document.querySelector(".baja_opacidad_interior").classList.add("alta_opacidad_interior")
    document.getElementById("button_contenedor").innerHTML = formButton("Agregar a pre lista", "agregarAtablaModal()", "reseteoFormulario()")
    document.getElementById("categoria-form").innerHTML = llenarCategoriaProductosEjecucion();
    buscarProducto(document.getElementById('buscador-productos-form'))
    cargarDatosAnio()
    btnTransferencias = 1;

    busquedaStock()
    document.getElementById("categoria_buscador_detalle").innerHTML = llenarCategoriaProductosEjecucion();
};
let array_saldos = [];
const in_existencias = ["in_ac", "in_su", "in_sd", "in_st", "in_sc"];
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function cargarDatosAnio(){
    document.getElementById("cargar_datos_anio").addEventListener("click", async ()=>{
        removerMarcaBotonDos()
        anio_principal = anio_referencia.value;

        modal_proceso_abrir(`Datos del año ${anio_principal} cargados.`, "")
        modal_proceso_salir_botones()
    })
    
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////TRANSFERENCIAS//////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const in_suc = ["in_trans_AC", "in_trans_SU", "in_trans_SD", "in_trans_ST", "in_trans_SC"]// input cantidad entrada
const sal_suc = ["sal_trans_AC", "sal_trans_SU", "sal_trans_SD", "sal_trans_ST", "sal_trans_SC"]// cantidad de salida
const r_suc = ["r_trans_AC", "r_trans_SU", "r_trans_SD", "r_trans_ST", "r_trans_SC"]// saldos en array

const formularioTransferencias = document.getElementById("formulario-transferencias");
///////////////////BUSCADOR DE PRODUCTOS EN FORMULARIO TRANSFERENCIAS/////////////////////////
function reseteoFormulario(){
    document.getElementById("id-form").value = "";
    document.getElementById('categoria-form').value = "0";
    document.getElementById('codigo-form').value = "";
    document.getElementById('descripcion-form').value = "";
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////TRANSFERENCIAS PLUS////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MODAL
function crearHeadTransferencias(){
    let tablaCompras= document.querySelector("#tabla_modal > thead");
    let nuevaFilaTablaCompras = tablaCompras.insertRow(-1);
    let fila = `
                <tr class="tbody_preproforma">
                    <th style="width: 120px;">Sucursal de origen
                        <select id="sun_opc" onChange="accionSelectUno()"></select>
                    </th>
                    <th style="width: 120px;">Categoría</th>
                    <th style="width: 120px;">Código</th>
                    <th style="width: 120px;">Descripción</th>
                    <th style="width: 70px;">Existencias de origen</th>
                    <th style="width: 70px;">Saldo en origen</th>
                    <th style="width: 70px;">Unidades a transferir</th>
                    <th style="width: 70px;">Sucursal de destino
                        <select id="sun_opc_dos" onChange="accionSelectDos()"></select>
                    </th>
                    <th style="width: 70px;">Existencias en destino</th>
                    <th style="width: 70px;">Saldo en destino</th>
                    <th style="width: 40px;"><span style="font-size:18px;" class="material-symbols-outlined">delete</span></th>
                </tr>
                `
    nuevaFilaTablaCompras.innerHTML = fila;
};
function crearBodyTransferencias(codigoTransferencia, id_prod){
    let tablaTransferencias= document.querySelector("#tabla_modal > tbody");
    let nuevaFilaTablaTransferencias = tablaTransferencias.insertRow(-1);
    let fila = `<tr>`+
                    `<td class="id_modal invisible">${id_prod}</td>`+// Columna 0 > id producto
                    `<td style="border-left: 7px solid ${CS(suc_add[obtenerIndiceSucursal("#sun_opc")])};" class="suc_modal">${suc_add[obtenerIndiceSucursal("#sun_opc")]}</td>`+// Columna 1 > sucursal origen
                    `<td>${document.getElementById("categoria-form").children[document.getElementById("categoria-form").selectedIndex].textContent}</td>`+// Columna 2 > categoría
                    `<td class="insertar input-tablas">${codigoTransferencia}</td>`+// Columna 3 > código
                    `<td></td>`+// Columna 4 > descripción
                    `<td style="text-align: right"></td>`+// Columna 5 > existencias sucursal origen
                    `<td style="text-align: right"></td>`+// Columna 6 > saldo en origen***
                    `<td><input onkeyup="op_cantidad(this)" class="input-tablas-dos-largo in_trans_" placeholder="Valor > 0"></td>`+//#### Columna 7 > cantidad a transferir###########
                    `<td></td>`+// Columna 8 > sucursal de destino***
                    `<td style="text-align: right"></td>`+// Columna 9 > existencias en destino***
                    `<td style="text-align: right"></td>`+// Columna 10 > saldo en destino***
                    `<td class="invisible"></td>`+// Columna 11 > Total unidades transferidas
                    `<td class="invisible">${obtenerIndiceSucursal("#sun_opc")}</td>`+// Columna 12 > índice sucursal origen
                    `<td class="invisible"></td>`+// Columna 13 > índice sucursal destino
                    `<td style="text-align: center">
                        <div class="tooltip">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onClick="clicKEliminarFila(this)">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </div>
                    </td>`+// Columna 14 > 
                `</tr>`
    nuevaFilaTablaTransferencias.innerHTML = fila;
};
function contenedorBotonesModal(funcion, titulo){
    let contenedor_bot = document.querySelector("#contenedor_botones_modal");
    let html =  `
                <button class="myButtonAgregar" onCLick="${funcion}">${titulo}</button>
                <button onCLick="removerModal()" class="myButtonEliminar">Cancelar</button>
                `;
    contenedor_bot.innerHTML = html;
}
function accionSelectUno(){// cambios al efectuar un cambio en select de sucursales en tabla modal
    let _suc_ = document.querySelectorAll(".suc_modal")
    _suc_.forEach((e)=>{
        let row_ = e.closest("tr")
        let obj_ = array_saldos.find(x=> x.idProd === Number(row_.children[0].textContent));// buscamos una coincidencia por id
        
        if(obj_){
            row_.children[12].textContent = obtenerIndiceSucursal("#sun_opc")

            row_.children[1].textContent = document.getElementById("sun_opc")[obtenerIndiceSucursal("#sun_opc")].textContent;
            row_.children[1].style.borderLeft = `7px solid ${CS(row_.children[1].textContent)}`;// color de la sucursal
            row_.children[5].textContent = obj_[in_existencias[row_.children[12].textContent]]// existencias sucursal origen
            row_.children[6].textContent = obj_[in_existencias[row_.children[12].textContent]]// saldo sucursal origen
            row_.children[11].textContent = 0// total unidades transferidas
            obj_.in_r()// eliminamos todas las unidades transferidas
            for(let i = 0; i < suc_db.length; i++){
                document.getElementById("sun_opc_dos").options[i].disabled = false;
            }
            
            document.getElementById("sun_opc_dos").options[obtenerIndiceSucursal("#sun_opc")].disabled = true;
            if(row_.children[12].textContent === row_.children[13].textContent){
                row_.children[8].textContent = ""
                row_.children[8].style.borderLeft = ``;// color de la sucursal
                row_.children[9].textContent = ""
                row_.children[10].textContent = ""
                row_.children[7].children[0].value = 0
                row_.children[13].textContent = ""
                inhabilitarInput()
            }else{
                accionSelectDos()
            }
        };
    });
};
function inhabilitarInput(){
    document.querySelectorAll(".in_trans_").forEach((e)=>{
        e.disabled = true
    })
}
function habilitarInput(){
    document.querySelectorAll(".in_trans_").forEach((e)=>{
        e.disabled = false
    })
}
function accionSelectDos(){// cambios al efectuar un cambio en select de sucursales en tabla modal
    habilitarInput()
    let _suc_ = document.querySelectorAll(".suc_modal")
    _suc_.forEach((e)=>{
        let row_ = e.closest("tr")
        let obj_ = array_saldos.find(x=> x.idProd === Number(row_.children[0].textContent));// buscamos una coincidencia por id
        
        if(obj_){
            row_.children[13].textContent = obtenerIndiceSucursal("#sun_opc_dos")

            row_.children[8].textContent = document.getElementById("sun_opc_dos")[obtenerIndiceSucursal("#sun_opc_dos")].textContent;
            row_.children[8].style.borderLeft = `7px solid ${CS(row_.children[8].textContent)}`;// color de la sucursal
            row_.children[9].textContent = obj_[in_existencias[row_.children[13].textContent]]// existencias sucursal origen
            row_.children[10].textContent = Number(obj_[in_existencias[row_.children[13].textContent]]) +
                                            obj_[sucursales_activas[row_.children[13].textContent]]// saldo sucursal origen
            row_.children[7].children[0].value = obj_[sucursales_activas[row_.children[13].textContent]]// cantidad ingresada segun la sucursal
        };
    });
};
function clicKEliminarFila(e){
    const fila = e.closest("tr");
    array_saldos.forEach((e, i)=>{//Buscamos una coincidencia de código
        e.idProd === Number(fila.children[0].textContent) ? array_saldos.splice(i, 1): "";//elimina el objeto con el índice i
    });
    fila.remove();
};

async function agregarAtablaModal(){
    if(document.getElementById("id-form").value > 0){
        let array_id_a_s = [];
        crearHeadTransferencias()
        cargarSucursalesEjecucion(document.getElementById("sun_opc"))
        cargarSucursalesEjecucion(document.getElementById("sun_opc_dos"))
        document.getElementById("sun_opc_dos").options[obtenerIndiceSucursal("#sun_opc")].disabled = true;
        let arrayCreacionCategoriaTallas = categoriaProductosCreacion(document.getElementById("categoria-form"));

        for(let i = 0; i < arrayCreacionCategoriaTallas.length; i++){// Se crean códigos según categorías
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
                    crearBodyTransferencias(codigo_form, base.idProd)
                };
            };
        };
        contenedorBotonesModal("agregarAtablaTransferenciasPrincipal()", "Enviar a la lista")
        if(array_id_a_s.length > 0){
            let cabecera =  `<ul>Los códigos: `
            for(let event of array_id_a_s){
                cabecera += `<li class="diseno_li">${event},</li>`;
            }
            cabecera +=`</ul> Ya se encuentran en la lista de transferencias.`;
            modal_proceso_abrir("", "", cabecera)
            modal_proceso_salir_botones()
        };
        document.querySelectorAll(".insertar").forEach((event)=>{// marcamos el código de busqueda en la tabla proforma
            if(event.textContent === document.getElementById("codigo-form").value){
                event.style.background = "var(--boton-tres)"
            }
        });
        document.querySelector(".contenedor-pre-transferencia").classList.add("modal-show-transferencia")
        await buscarCodigo();

        arrayCreacionCategoriaTallas = [];
        document.querySelector("#tabla_modal > tbody > tr:nth-child(1) > td:nth-child(8) > input").focus()
    }else if(document.getElementById("id-form").value < 1){
        modal_proceso_abrir("Seleccione un código a transferir.", "")
        modal_proceso_salir_botones()
    };
};
function op_cantidad(e){
    let row_ = e.closest("tr");
    let indice_origen = row_.children[12].textContent;
    let indice_destino = row_.children[13].textContent;
    let obj_ = array_saldos.find(x => x.idProd === Number(row_.children[0].textContent));//Busca coincidencias de código en array_saldos

    obj_.in_q(e, indice_destino)
    row_.children[6].textContent = Number(row_.children[5].textContent) - obj_.in_t(indice_origen);
    row_.children[10].textContent = obj_[in_existencias[indice_destino]] + Number(e.value);
    row_.children[11].textContent = obj_.in_t(indice_origen);
    Number(row_.children[6].textContent) < 0 ?  row_.children[6].style.background = "var(--fondo-marca-uno)":
                                                row_.children[6].style.background = "var(--boton-tres)";
};

async function buscarCodigo(){//Busca el producto por ID
    const id_trans = document.querySelectorAll(".id_modal");
    let ids = Array.from(id_trans).map(element => element.textContent);

    let response = await cargarDatos(   `almacen_central_codigo_transferencias?`+
                                        `ids=${ids.join(",")}`);

    for(id_t of id_trans){
        let row_ = id_t.closest("tr");
        let fila_res = response.find(x=> x.idProd === Number(row_.children[0].textContent))
        if(fila_res){
            row_.children[4].textContent = fila_res.descripcion;
            row_.children[5].textContent = fila_res[sucursales_activas[row_.children[12].textContent]];
            row_.children[6].textContent = fila_res[sucursales_activas[row_.children[12].textContent]];
            row_.children[7].children[0].value = 0;
            row_.children[11].textContent = 0;
            if(row_.children[0].textContent == document.getElementById("id-form").value){//marcamos el código de búsqueda
                id_t.style.background = "var(--boton-tres)"
                id_t.style.color = "var(--color-secundario)"
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
            inhabilitarInput()
        };
    };
};

//PROFORMA
function filaBodyTransferenciasProformaPincipal(){
    const fila_principal = document.querySelector("#tabla_principal > tbody");
    let idd = document.querySelectorAll(".id_proforma");
    let id_prof = Array.from(idd).map(x => Number(x.textContent));
    const id_remove = document.querySelectorAll(".id_modal");
    array_saldos.forEach((obj_tran)=>{
        let coincidencia_id = id_prof.find(x=> x === obj_tran.idProd)
        if(coincidencia_id === undefined){

            if(obj_tran.val_exs().every(valor => Number.isFinite(valor)) && 
            obj_tran.val_exs().some(valor => valor !== 0) && obj_tran.condicion() === true){
                let d_categoria = cat_db.find(x => x.id === Number(obj_tran.categoria))
                let nueva_fila = fila_principal.insertRow(-1);
                let fila = `<tr>`+
                                `<td class="id_proforma invisible">${obj_tran.idProd}</td>`+ // Columna 0 > id producto
                                `<td class="invisible">${d_categoria.categoria_nombre}</td>`+ // Columna 1 > categoría
                                `<td>${obj_tran.codigo}</td>`+ // Columna 2 > código
                                `<td>${obj_tran.descripcion}</td>`+ // Columna 3 > descripción
                                `<td style="text-align: right">${obj_tran.existencias_ac}</td>`+ // Columna 4 > cantidad AC
                                `<td style="text-align: right">${obj_tran.existencias_su}</td>`+ // Columna 5 > cantidad SU 
                                `<td style="text-align: right">${obj_tran.existencias_sd}</td>`+ // Columna 6 > cantidad SD
                                `<td style="text-align: right">${obj_tran.existencias_st}</td>`+ // Columna 7 > cantidad ST
                                `<td style="text-align: right">${obj_tran.existencias_sc}</td>`+ // Columna 8 > cantidad SC
                                `<td style="text-align: center">
                                    <div class="tooltip">
                                        <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila" onCLick = "clicKEliminarFila(this)">delete</span>
                                        <span class="tooltiptext">Eliminar producto</span>
                                    </div>
                                </td>`+
                            `</tr>`
                nueva_fila.innerHTML = fila;
                id_remove.forEach((e)=>{//Eliminamos la fila en tabla modal
                    Number(e.textContent) === obj_tran.idProd ? e.parentNode.remove(): "";
                });
            };
        };
    });
};

function agregarAtablaTransferenciasPrincipal(){
    filaBodyTransferenciasProformaPincipal()

    if(document.querySelector("#tabla_modal > tbody").children.length == 0){
        document.querySelector(".contenedor-pre-transferencia").classList.remove("modal-show-transferencia")
        document.querySelector("#tabla_modal > thead > tr:nth-child(2)").remove()
    }

    document.getElementById("formulario-compras-uno").reset();
    document.getElementById("id-form").value = ""
    document.getElementById("buscador-productos-form").focus();
};

const procesarTransferenciaPlus = document.getElementById("procesar-transferencias-plus");
procesarTransferenciaPlus.addEventListener("click", procesamientoTransferencias)
async function procesamientoTransferencias(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla_principal > tbody").children.length > 0){
        modal_proceso_abrir("Procesando la transferencia!!!.", "")
            
            await realizarTransferencia()
            if(document.querySelector("#check_comprobante").checked){
                imprimirListaTabla()//Lista de transferencias
            };
            document.querySelector("#tabla_principal > tbody").remove();
            document.querySelector("#tabla_principal").createTBody();
            array_saldos = [];// Eliminamos el contenido del array_saldos
            
        }
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. ", error, "")
        console.error("Ocurrió un error. ", error)
        modal_proceso_salir_botones()
    };
};
async function realizarTransferencia(){
    let array_data_prod = [];
    let array_data_tran = [];
    function DataProductos(a){
        this.idProd = a.idProd;
        this.existencias_ac = a.existencias_ac;
        this.existencias_su = a.existencias_su;
        this.existencias_sd = a.existencias_sd;
        this.existencias_st = a.existencias_st;
        this.existencias_sc = a.existencias_sc;
    };

    function DataTransferencia(a, sucursal_origen, sucursal_destino, i){
        this.idProd = a.idProd;
        this.cantidad = a[sucursales_activas[i]];
        this.id_suc_origen = sucursal_origen;
        this.id_suc_destino = sucursal_destino;
    };

    array_saldos.forEach((event)=>{
        let suc_o = 0;
        array_data_prod.push(new DataProductos(event))
        suc_add.forEach((nom_suc, i)=>{//encuentra la sucursal de origen
            let sucursal_ = suc_db.find(x=> x.sucursal_nombre === nom_suc);
            if(sucursal_){
                event[sucursales_activas[i]] < 0 ? suc_o = sucursal_.id_sucursales: "";
            };
        });
        suc_add.forEach((nom_suc, i)=>{//inserta las transferencias al array
            let sucursal_ = suc_db.find(x=> x.sucursal_nombre === nom_suc);
            if(sucursal_){
                event[sucursales_activas[i]] > 0 ? array_data_tran.push(new DataTransferencia(event, suc_o, sucursal_.id_sucursales, i)): "";
            };
        });
    });

    function DataTransferencias(){
        this.array_data_prod = array_data_prod;
        this.array_data_tran = array_data_tran;
        this.id_num = neg_db[0].id;
        this.fecha = generarFecha();
    }
    let fila = new DataTransferencias();

    let filaTransferencia = URL_API_almacen_central + 'procesar_transferencia'
    let response = await funcionFetchDos(filaTransferencia, fila)

    if(response.status === "success"){
        modal_proceso_abrir(`Operación "${response.message}" completada exitosamente.`)
        modal_proceso_salir_botones()
    }
};
////BOTONES PARA ELIMINAR CONTENIDO DE TABLAS////////////////////////////////////////////////////////////////////////
function removerModal(){
    removerListaModal()
    document.querySelector(".contenedor-pre-transferencia").classList.remove("modal-show-transferencia")
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
}

const removerTablaTransferenciasDos = document.getElementById("remover-tabla-transferencias-dos");
removerTablaTransferenciasDos.addEventListener("click", () =>{
    document.querySelector("#tabla_principal > tbody").remove();
    document.querySelector("#tabla_principal").createTBody();
    document.getElementById("buscador-productos-form").focus();
    array_saldos = [];//limpiamos el array
});
