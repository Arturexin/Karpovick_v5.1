function formInsert(titulo){
    return  `
            <form id="formulario-compras-uno" class="into_form baja_opacidad_interior">
            
                    <h2>${titulo}
                        <div class="tooltip_ayuda">
                            <span class="material-symbols-outlined">help</span>
                            <span class="tooltiptext_ayuda">Crea nuevos productos en la base de datos.</span>
                        </div>
                    </h2>
                    <div class="contenedor-label-input-compras">
                        <input class="input-compras fondo" type="hidden" id="id-form"/>
                        <label class="label-general">
                            <div style="display: flex; width: 140px; justify-content: space-between;">Categoría
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">Cada categoría presenta diferentes medidas.</span>
                                </div>
                            </div>
                            <select id="categoria-form" class="input-general fondo" style="cursor: pointer;">
                            </select>
                        </label>
                        <label class="label-general">
                            <div style="display: flex; width: 140px; justify-content: space-between;">Código
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">El código solo puede contener como caracteres letras y números. (Ejemplo: Ab001).</span>
                                </div>
                            </div>
                            <input class="input-general fondo" type="text" id="codigo-form"/>
                        </label>
                        <label class="label-general">
                            <div style="display: flex; width: 140px; justify-content: space-between;">Descripción
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">La descripción del producto solo puede contener como caracteres letras y números.</span>
                                </div>
                            </div>
                            <input class="input-general fondo" type="text" id="descripcion-form"/>
                        </label>
                        <label class="label-general">
                            <div style="display: flex; width: 140px; justify-content: space-between;">Costo de compra
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">EL costo unitario del producto solo puede contener números.</span>
                                </div>
                            </div>
                            <input class="input-general fondo" type="text" id="costo-form"/>
                        </label>
                        <label class="label-general">
                            <div style="display: flex; width: 140px; justify-content: space-between;">Precio de venta
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">EL precio de venta unitario del producto solo puede contener números.</span>
                                </div>
                            </div>
                            <input class="input-general fondo" type="text" id="precio-form"/>
                        </label>
                        <label class="label-general">
                            <div style="display: flex; width: 140px; justify-content: space-between;">Lote
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">El lote de producto solo puede contener números.</span>
                                </div>
                            </div>
                            <input class="input-general fondo" type="text" id="lote-form"/>
                        </label>
                        <label class="label-general">
                            <div style="display: flex; width: 140px; justify-content: space-between;">Proveedor
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">Si no encuentra el proveedor correspondiente, asegurese de haberlo ingresado previamente en el apartado de "Clientes".</span>
                                </div>
                            </div>
                            <select class="input-general fondo" id="proveedor-form" style="cursor: pointer;">
                            </select>
                        </label>
                    </div>
            </form>
            `;
}
function formButton(titulo_go, funcion_go, funcion_back){
    return  `
            <button class="myButtonAgregar" onClick=${funcion_go}>${titulo_go}</button>
            <button class="myButtonEliminar" onClick=${funcion_back}>Restablecer</button>
            `;
}
function formUpdate(titulo){
    return  `
            <form id="formulario-compras-uno" class="into_form baja_opacidad_interior">
                <h2 class="">${titulo}
                    <div class="tooltip_ayuda">
                        <span class="material-symbols-outlined">help</span>
                        <span class="tooltiptext_ayuda">Recompra productos ya existentes en la base de datos.</span>
                    </div>
                </h2>

                <div style="display: flex;">
                    <input id="buscador-productos-form" type="text" class="input-general-importante fondo-importante" placeholder="Buscar código">
                    <div class="tooltip_ayuda">
                        <span class="material-symbols-outlined">find_in_page</span>
                        <span class="tooltiptext_ayuda">Digite caracteres clave del código a buscar.</span>
                    </div>
                </div>

                <div class="contenedor-label-input-compras">
                    <div class="label">
                        <input class="input-compras fondo" type="hidden" id="id-form"/>
                        <label class="label-general">Categoría
                            <select id="categoria-form" class="input-general fondo" disabled>
                            </select>
                        </label>
                        <label class="label-general">Código<input class="input-general fondo" type="text" id="codigo-form" disabled/></label>
                        <label class="label-general">Descripción<input class="input-general fondo" type="text" id="descripcion-form" disabled/></label>
                    </div>
                </div>
            </form>
            `;
};