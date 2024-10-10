function formInsert(titulo){
    return  `
            <form id="formulario-compras-uno" class="into_form baja_opacidad_interior">
            
                    <h2>${titulo}</h2>
                    <div class="contenedor-label-input-compras">
                        <input class="input-compras fondo" type="hidden" id="id-form"/>
                        <label class="label-general">
                            <div style="display: flex; width: 140px; justify-content: space-between;">Categoría
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">Cada categoría presenta diferentes medidas.</span>
                                </div>
                            </div>
                            <select id="categoria-form" class="input-general fondo" style="cursor: pointer;" onChange="selectForm(this)">
                            </select>
                        </label>
                        <label class="label-general">
                            <div style="display: flex; width: 140px; justify-content: space-between;">Código
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">El código solo puede contener como caracteres letras y números. (Ejemplo: Ab001).</span>
                                </div>
                            </div>
                            <input class="input-general fondo" type="text" id="codigo-form" onKeyup="expCodigo(this)"/>
                        </label>
                        <label class="label-general">
                            <div style="display: flex; width: 140px; justify-content: space-between;">Descripción
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">La descripción del producto solo puede contener como caracteres letras y números.</span>
                                </div>
                            </div>
                            <input class="input-general fondo" type="text" id="descripcion-form" onKeyup="expDescripcion(this)"/>
                        </label>
                        <label class="label-general">
                            <div style="display: flex; width: 140px; justify-content: space-between;">Costo de compra
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">EL costo unitario del producto solo puede contener números.</span>
                                </div>
                            </div>
                            <input class="input-general fondo" type="text" id="costo-form" onKeyup="expCosto(this)"/>
                        </label>
                        <label class="label-general">
                            <div style="display: flex; width: 140px; justify-content: space-between;">Precio de venta
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">EL precio de venta unitario del producto solo puede contener números.</span>
                                </div>
                            </div>
                            <input class="input-general fondo" type="text" id="precio-form" onKeyup="expPrecio(this)"/>
                        </label>
                        <label class="label-general">
                            <div style="display: flex; width: 140px; justify-content: space-between;">Lote
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">El lote de producto solo puede contener números.</span>
                                </div>
                            </div>
                            <input class="input-general fondo" type="text" id="lote-form" onKeyup="expLote(this)"/>
                        </label>
                        <label class="label-general">
                            <div style="display: flex; width: 140px; justify-content: space-between;">Proveedor
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">Si no encuentra el proveedor correspondiente, asegurese de haberlo ingresado previamente en el apartado de "Clientes".</span>
                                </div>
                            </div>
                            <select class="input-general fondo" id="proveedor-form" style="cursor: pointer;" onChange="selectForm(this)">
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
                <h2 class="">${titulo}</h2>

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
                proveedor, idProd, in_ac, in_su, in_sd, in_st, in_sc, motivo) {
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
        this.motivo = motivo;
    };

    total_costo(indice) {
        if (indice >= 0 && indice < sucursales_activas.length) {
            return this[sucursales_activas[indice]] * this.costo;
        } else {
            throw new Error('Índice fuera de rango');
        };
    };
    in_q_q(input_value, indice_sucursal){//ventas
        if(Number(input_value) > 0 || !isNaN(Number(input_value))){
            this[sucursales_activas[indice_sucursal]] = this[sucursales_activas[indice_sucursal]] + Number(input_value);
        };
        return this[sucursales_activas[indice_sucursal]];
    };
    in_q(input, indice_sucursal){
        if(Number(input.value) < 0 || isNaN(Number(input.value))){
            input.style.background = "var(--fondo-marca-uno)";
        }else{
            this[sucursales_activas[indice_sucursal]] = Number(input.value);
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
            console.log(input)
            input.style.background = "";
        };
    };
    in_p_v(input_value){
        if(Number(input_value) > 0 || !isNaN(Number(input_value))){
            this.precio = Number(input_value);
        };
        return this.precio
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
const expregul = {
    cliente: /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$/,
    precios: /^(?!0(\.00?)?$)\d+(\.\d{1,2})?$/,  // Modificada para no aceptar ceros
    dni: /^\d{8,8}$/,
    email: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
    telefono: /^[ 0-9]+$/,
    direccion: /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'°,.:/\d\- ]+$/,
    cantidad: /^[1-9]\d*$/,  // Modificada para no aceptar ceros
    codigo: /^[A-ZÑa-zñ'°\d ]+$/,
    descripcion: /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'°\-_/:()\d ]+$/,
    password: /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/
};
function expCodigo(e){
    expregul.codigo.test(e.value) ? e.style.background = "":
                                    e.style.background = "var(--boton-dos)"
}
function expDescripcion(e){
    expregul.descripcion.test(e.value) ?    e.style.background = "":
                                            e.style.background = "var(--boton-dos)"
}
function expCosto(e){
    expregul.precios.test(e.value) ?    e.style.background = "":
                                        e.style.background = "var(--boton-dos)"
}
function expPrecio(e){
    expregul.precios.test(e.value) ?    e.style.background = "":
                                        e.style.background = "var(--boton-dos)"
}
function expLote(e){
    expregul.cantidad.test(e.value) ?   e.style.background = "":
                                        e.style.background = "var(--boton-dos)"
}

function selectForm(e){
    e.value !== "0" ? e.style.background = "":
                    e.style.background = "var(--boton-dos)"
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////Validaciones///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const campos = [
    { id: "codigo-form", regex: expregul.codigo, mensaje: "El código no es válido." },
    { id: "descripcion-form", regex: expregul.descripcion, mensaje: "La descripción no es válida." },
    { id: "costo-form", regex: expregul.precios, mensaje: "El costo no es válido." },
    { id: "precio-form", regex: expregul.precios, mensaje: "El precio no es válido." },
    { id: "lote-form", regex: expregul.cantidad, mensaje: "El lote no es válido." },
];

function validarFormulario() {
    let errores = [];
    // Validar categoría
    if (document.getElementById("categoria-form").value === "0") {
        document.getElementById("categoria-form").style.background = "var(--boton-dos)"
        errores.push("Debe seleccionar una categoría.");
    }
    // Validar campos con expresiones regulares
    campos.forEach(campo => {
        const valor = document.getElementById(campo.id).value;
        if (!campo.regex.test(valor)) {
            errores.push(campo.mensaje);
        }
    });
    // Validar proveedor
    if (document.getElementById("proveedor-form").value === "0") {
        document.getElementById("proveedor-form").style.background = "var(--boton-dos)"
        errores.push("Debe seleccionar un proveedor.");
    }
    // Mostrar errores si existen
    if (errores.length > 0) {
        let cabecera =  `<ul>Errores encontrados: `
        for(let event of errores){
            cabecera += `<li class="diseno_li">${event}</li>`;
        }
        cabecera +=`</ul>`;
        modal_proceso_abrir("", "", cabecera)
        modal_proceso_salir_botones()
        return false; // Detener el proceso
    };
    return true; // Continuar con el proceso
};