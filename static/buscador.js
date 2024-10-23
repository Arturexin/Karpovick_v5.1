function busquedaDetalle(indice, termino){
    // Obtén la referencia al elemento <ul>
    let miUl_cabecera = document.getElementById("lista_cabecera");
    let miUl_detalle = document.getElementById("lista_detalle");
    let terminoBusqueda = termino;
    let nuevoLi = "";
    let cabecera =  `<li class="diseno_li">`+
                        `<span style="width: 80px;"><h3>Código</h3></span> `+
                        `<span style="width: 80px;"><h3>Descripción</h3></span> `+
                        `<span style="width: 80px;"><h3>Mandar a formulario</h3></span>`+
                    `</li>`;
    
    for (let event of inv_db){
        let parametro = [event.codigo, event.descripcion, ""]
        if (parametro[indice].toLowerCase().includes(terminoBusqueda.toLowerCase()) && terminoBusqueda !== "" &&
        (Number(document.getElementById("categoria_buscador_detalle").value) === event.categoria ||
        document.getElementById("categoria_buscador_detalle").value === "0")){
            // Crea un nuevo elemento <li> con contenido
            nuevoLi += `<li class="diseno_li">`+
                                `<span class="invisible id_detalle">${event.idProd}</span> `+
                                `<span class="invisible categoria_detalle">${event.categoria}</span> `+
                                `<span class="codigo_detalle">${event.codigo}</span> `+
                                `<span class="descripcion_detalle">${event.descripcion}</span> `+
                                `<button style="cursor:pointer;" onclick="agregarBusquedaDetalleUno(this)">Usar</button>`+
                            `</li>`;
        };
    };
    
    if(nuevoLi !== ""){
        miUl_cabecera.innerHTML = cabecera;
        miUl_detalle.innerHTML = nuevoLi;
    }else{
        miUl_cabecera.innerHTML = `<span>No se encontraron coincidencias.</span>`;
        miUl_detalle.innerHTML = "";
    }
};

async function cargarTop(sucursal_id, sucursal_columna){
    let maximo = 0;
    let top_ventas = await cargarDatos(`salidas_top_ventas?`+
                                    `year_actual=${anio_principal}&`+
                                    `sucursal_venta=${sucursal_id}&`+
                                    `categoria_venta=${document.getElementById("categoria_buscador_detalle").value}&`+
                                    `trimestre=${document.getElementById("periodo_tiempo").value}&`+
                                    `sucursal_get=${sucursal_columna}`)
    let miUl_cabecera = document.getElementById("lista_cabecera");
    let miUl_detalle = document.getElementById("lista_detalle");
    if(top_ventas.length > 0){
        let cabecera =  `<li class="diseno_li">`+
                            `<span style="width: 100px; text-align: center;"><h3>Código</h3></span> `+
                            `<span style="width: 100px; text-align: center;"><h3>Descripción</h3></span> `+
                            `<span style="width: 80px; text-align: center;"><h3>Unidades vendidas</h3></span> `+
                            `<span style="width: 80px; text-align: center;"><h3>Monto de venta</h3></span> `+
                            `<span style="width: 80px; text-align: center;"><h3>Margen (%)</h3></span> `+
                            `<span style="width: 80px; text-align: center;"><h3>Stock inventario</h3></span> `+
                            `<span style="width: 60px; text-align: center;"><h3>Usar</h3></span>`+
                        `</li>`;
        miUl_cabecera.innerHTML = cabecera;
        maximo = top_ventas[0].cantidad_venta
        top_ventas.forEach((event, i)=>{
            let nuevoLi =   `<li class="diseno_li">`+
                                `<span class="id_detalle invisible" style="width: 100px;">${event.id}</span> `+
                                `<span class="sucursal_detalle invisible" style="width: 100px;">${event.sucursal}</span> `+
                                `<span class="categoria_detalle invisible" style="width: 100px;">${event.categoria}</span> `+
                                `<span class="codigo_detalle" style="width: 100px;">${event.codigo}</span> `+
                                `<span class="descripcion_detalle" style="width: 100px;">${event.descripcion}</span> `+
                                `<span class="cantidad_venta_detalle" style="width: 80px; text-align: center;">${event.cantidad_venta} uds.</span> `+
                                `<span class="venta_detalle" style="width: 80px; text-align: center;">${moneda()} ${(event.suma_ventas).toFixed(2)}</span> `+
                                `<span class="rentabilidad_detalle" style="width: 80px; text-align: center;">${((1 - (event.suma_costos/event.suma_ventas))*100).toFixed(2)}%</span> `+
                                `<span class="stock_detalle" style="width: 80px; text-align: center;">${event.sucursal_get} uds.</span> `+
                                `<button style="cursor:pointer;" onclick="agregarBusquedaDetalleDos(this)">Usar</button>`+
                            `</li>`;
            miUl_detalle.innerHTML += nuevoLi;
            marcarDatosPuesto(".cantidad_venta_detalle", event.cantidad_venta, i, maximo);
            marcarDatosCantidad(".stock_detalle", event.sucursal_get, i);
        });                                
    }else{
        miUl_cabecera.innerHTML = `<span>No existen registros.</span>`
    };
};
function marcarDatosCantidad(clase, dato, index){
    if (Number(dato) <= 0) {
        document.querySelectorAll(clase)[index].style.background = mapa_calor[4];
        document.querySelectorAll(clase)[index].style.color = "black";
    }else if(Number(dato) <= 5){
        document.querySelectorAll(clase)[index].style.background = mapa_calor[3];
        document.querySelectorAll(clase)[index].style.color = "black";
    }else if(Number(dato) <= 10){
        document.querySelectorAll(clase)[index].style.background = mapa_calor[2];
        document.querySelectorAll(clase)[index].style.color = "black";
    }else if(Number(dato) <= 20){
        document.querySelectorAll(clase)[index].style.background = mapa_calor[1];
        document.querySelectorAll(clase)[index].style.color = "black";
    }else{
        document.querySelectorAll(clase)[index].style.background = mapa_calor[0];
        document.querySelectorAll(clase)[index].style.color = "black";
    };
};
function marcarDatosPuesto(clase, dato, index, maximo){
    if (Number(dato) <= maximo * 0.20) {
        document.querySelectorAll(clase)[index].style.color = mapa_calor[4];
    }else if(Number(dato) <= maximo * 0.40){
        document.querySelectorAll(clase)[index].style.color = mapa_calor[3];
    }else if(Number(dato) <= maximo * 0.60){
        document.querySelectorAll(clase)[index].style.color = mapa_calor[2];
    }else if(Number(dato) <= maximo * 0.80){
        document.querySelectorAll(clase)[index].style.color = mapa_calor[1];
    }else if(Number(dato) <= maximo * 1){
        document.querySelectorAll(clase)[index].style.color = mapa_calor[0];
    };
};
function busquedaStock(){
    document.querySelectorAll(".stock_sucursal").forEach((event, i)=>{
        event.addEventListener("click", ()=>{
            removerMarcaBotonDos()
            let sucursal_ = suc_db.find(x=> x.sucursal_nombre === suc_add[i])
            if(sucursal_){
                cargarTop(sucursal_.id_sucursales, sucursales_activas[i])
                event.classList.add("marcaBotonDos")
            }
        });
    });
};
function removerMarcaBotonDos(){
    let miUl_cabecera = document.getElementById("lista_cabecera");
    let miUl_detalle = document.getElementById("lista_detalle");
    miUl_cabecera.innerHTML = "";
    miUl_detalle.innerHTML = "";

    if(document.querySelectorAll(".stock_sucursal").children !== undefined){
        document.querySelectorAll(".stock_sucursal")[0].classList.remove("marcaBotonDos")
        document.querySelectorAll(".stock_sucursal")[1].classList.remove("marcaBotonDos")
        document.querySelectorAll(".stock_sucursal")[2].classList.remove("marcaBotonDos")
        document.querySelectorAll(".stock_sucursal")[3].classList.remove("marcaBotonDos")
        document.querySelectorAll(".stock_sucursal")[4].classList.remove("marcaBotonDos")

    }
}

function imprimirContenido() {
    let anio = document.getElementById("anio_referencia").value
    let periodo = document.getElementById("periodo_tiempo")[document.getElementById("periodo_tiempo").selectedIndex].textContent
    let contenido = document.getElementById('lista_detalle').innerHTML;
    let ventanaImpresion = window.open('', '_blank');
    let sucursal_ = ""
    document.querySelectorAll(".stock_sucursal").forEach((event, i)=>{
        event.classList.contains('marcaBotonDos') ? sucursal_ = suc_add[i] : ""
    })

    ventanaImpresion.document.write('<html><head><title>Contenido para imprimir con estilos</title>');
    ventanaImpresion.document.write('<style>');
    ventanaImpresion.document.write('li { display: flex; justify-content: space-between; align-items: center; margin: 3px 0; padding: 0 0 0 5px;}');
    ventanaImpresion.document.write('.id_detalle, .sucursal_detalle, .categoria_detalle { display: none;}');
    ventanaImpresion.document.write('</style>');
    ventanaImpresion.document.write('</head><body style="width: 700px; background: rgba(5, 5, 5, 1); color: #eee;margin-left: auto; margin-right: auto;">');
    ventanaImpresion.document.write(`<h1 style="text-align: center">Control de stock ${periodo} ${sucursal_}(${anio})</h1>`);
    ventanaImpresion.document.write(contenido);
    ventanaImpresion.document.write(`<p>${new Date()}</p>`);
    ventanaImpresion.document.write('</body></html>');
    ventanaImpresion.document.write('<button onclick="window.print()">Imprimir</button>');
    ventanaImpresion.document.close();
}


document.getElementById("boton_buscar_codigo").addEventListener("click", ()=>{
    removerMarcaBotonDos()
    busquedaDetalle(0, document.getElementById("buscador_descripcion").value)
    document.getElementById("buscador_descripcion").focus()
});
document.getElementById("boton_buscar_descripcion").addEventListener("click", ()=>{
    removerMarcaBotonDos()
    busquedaDetalle(1, document.getElementById("buscador_descripcion").value)
    document.getElementById("buscador_descripcion").focus()
});


document.getElementById("boton_borrar_").addEventListener("click", ()=>{
    document.getElementById("categoria_buscador_detalle").value = "0";
    clave_form > 0 ? document.getElementById("periodo_tiempo").value = "0":"";
    document.getElementById("buscador_descripcion").value = ""
    document.getElementById("buscador_descripcion").focus()
    removerMarcaBotonDos()
});
function agregarBusquedaDetalleUno(button){
    if(clave_form){
        if(clave_form > 0){
            llenadoDatosForm(button)
        }else{
            modal_proceso_abrir(`Esta acción solo procederá en "Recomprar y modificar".`, ``)
            modal_proceso_salir_botones()
        };
    }else{
        llenadoDatosForm(button)
    };
};
function agregarBusquedaDetalleDos(button){
    if(clave_form){
        if(clave_form > 0){
            llenadoDatosFormDos(button)
        }else{
            modal_proceso_abrir(`Esta acción solo procederá en "Recomprar y modificar".`, ``)
            modal_proceso_salir_botones()
        };
    }else{
        llenadoDatosFormDos(button)
    };
};
function llenadoDatosForm(button){
    let linea = button.closest("li");
    document.getElementById('id-form').value = linea.children[0].textContent;
    document.getElementById('categoria-form').value = linea.children[1].textContent;
    document.getElementById('codigo-form').value = linea.children[2].textContent;
    document.getElementById('descripcion-form').value = linea.children[3].textContent;
}
function llenadoDatosFormDos(button){
    let linea = button.closest("li");
    document.getElementById('id-form').value = linea.children[0].textContent;
    document.getElementById('categoria-form').value = linea.children[2].textContent;
    document.getElementById('codigo-form').value = linea.children[3].textContent;
    document.getElementById('descripcion-form').value = linea.children[4].textContent;
}




