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
class ObjGeneral {
    constructor(categoria, codigo, descripcion, talla, existencias_ac, existencias_su, 
                existencias_sd, existencias_st, existencias_sc, costo, precio, lote, 
                proveedor, idProd, in_ac, in_su, in_sd, in_st, in_sc) {
        this.categoria = categoria;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.talla = talla;
        this.existencias_ac = existencias_ac;
        this.existencias_su = existencias_su;
        this.existencias_sd = existencias_sd;
        this.existencias_st = existencias_st;
        this.existencias_sc = existencias_sc;
        this.costo = costo;
        this.precio = precio;
        this.lote = lote;
        this.proveedor = proveedor;
        this.idProd = idProd;
        this.in_ac = in_ac;
        this.in_su = in_su;
        this.in_sd = in_sd;
        this.in_st = in_st;
        this.in_sc = in_sc;
    };

    total_costo(indice) {
        if (indice >= 0 && indice < sucursales_activas.length) {
            return this[sucursales_activas[indice]] * this.costo;
        } else {
            throw new Error('Índice fuera de rango');
        };
    };
    in_q(input, indice){
        if(Number(input.value) < 0 || isNaN(Number(input.value))){
            input.style.background = "var(--fondo-marca-uno)";
        }else{
            this[sucursales_activas[indice]] = Number(input.value);
            input.style.background = "";
        };
    };
    in_c(input){
        if(Number(input.value) < 0 || isNaN(Number(input.value))){
            input.style.background = "var(--fondo-marca-uno)";
        }else{
            this.costo = Number(input.value);
            blurInputMoneda(input);
            input.style.background = "";
        };
    };
    in_p(input){
        if(Number(input.value) < 0 || isNaN(Number(input.value))){
            input.style.background = "var(--fondo-marca-uno)";
        }else{
            this.precio = Number(input.value);
            blurInputMoneda(input);
            input.style.background = "";
        };
    };
    in_l(input){
        if(Number(input.value) < 0 || isNaN(Number(input.value))){
            input.style.background = "var(--fondo-marca-uno)";
        }else{
            this.lote = Number(input.value);
            input.style.background = "";
        };
    };
    in_d(input){
        if(expregul.descripcion.test(input.value) || input.value !== ""){
            this.descripcion = input.value;
            input.style.background = "";
        } else {
            input.style.background = "var(--fondo-marca-uno)";
        };
    };
    in_cod(input){
        if(expregul.codigo.test(input.value) || input.value !== ""){
            this.codigo = input.value;
            input.style.background = "";
        } else {
            input.style.background = "var(--fondo-marca-uno)";
        };
    };
    in_t(indice_origen){
        let suma = 0;
        sucursales_activas.forEach((e)=>{
            if(e !== sucursales_activas[indice_origen]){
                suma+=this[e]
            }
        })
        this[sucursales_activas[indice_origen]] = -suma
        return suma;
    };
    in_r(){//reset
        this.existencias_ac = 0; 
        this.existencias_su = 0; 
        this.existencias_sd = 0; 
        this.existencias_st = 0; 
        this.existencias_sc = 0;
    };
    condicion(){//verifica si algun saldo de existencias en la sucursal de origen es negativo
        let resultado = true
        sucursales_activas.forEach((e, i)=>{
            if(this[in_existencias[i]] + this[e] < 0){
                resultado = false
            }
        })
        return resultado
    }
};
function formatoMoneda(valor_numerico){
    let value = valor_numerico.toString();
    value = value.replace(/[^0-9.]/g, '');// Eliminar todo lo que no sea un número o un punto decimal
    if (value.includes('.')) {// Verificar si el valor contiene un punto decimal
        let parts = value.split('.');
        let integerPart = parts[0].padStart(1, '0');// Asegurar que la parte entera tenga al menos un caracter (añadir 0 si es necesario)
        let decimalPart = parts[1] ? parts[1].substring(0, 2) : '';// Limitar la parte decimal a dos dígitos
        decimalPart = decimalPart.padEnd(2, '0');// Si la parte decimal tiene menos de dos dígitos, añadir ceros
        value = `${integerPart}.${decimalPart}`;// Formatear el valor final
    } else {
        value = value.padStart(1, '0') + '.00';// Si no hay punto decimal, añadir ".00" al final y asegurar que la parte entera tiene un dígitos
    }
    return value;// Ajustar el valor del input al valor formateado
};
function blurInputMoneda(elemento){
    elemento.addEventListener('blur', () => {
        elemento.value = formatoMoneda(elemento.value)
    });
};