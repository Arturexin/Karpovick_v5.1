class BarraGraficoVertical extends HTMLElement{
    l_0 = "";
    c_1 = "";
    c_2 = "";
    c_3 = "";
    c_4 = "";
    c_5 = "";
    s_1 = "";
    s_2 = "";
    s_3 = "";
    s_4 = "";
    s_5 = "";
    constructor(){
        super();
    };
    connectedCallback(){
        this.getAttributes()
        this.style();
        this.render();
    };
    getAttributes(){
        this.l_0 = this.attributes.l_0.value 
        this.c_1 = this.attributes.c_1.value 
        this.c_2 = this.attributes.c_2.value 
        this.c_3 = this.attributes.c_3.value 
        this.c_4 = this.attributes.c_4.value 
        this.c_5 = this.attributes.c_5.value 
        this.s_1 = this.attributes.s_1.value 
        this.s_2 = this.attributes.s_2.value 
        this.s_3 = this.attributes.s_3.value 
        this.s_4 = this.attributes.s_4.value 
        this.s_5 = this.attributes.s_5.value 
    }
    style(){
        this.innerHTML = `
                        <style>
                            barra-grafico_vertical{
                                display: grid;
                                align-items: end;
                            }
                            .grafico_compras{
                                height: 240px;
                                display: grid;
                                grid-template-columns: repeat(13, 1fr);
                                justify-content: center;
                                gap: 3px;
                                padding: 0px 20px;
                            }
                            .columna_grafico{
                                width: auto;
                                min-width: 40px;
                                display: grid;
                                grid-template-columns: repeat(5, 1fr);
                                grid-template-areas: "a b c d e"
                                                "f f f f f";
                                align-items: end;
                                justify-items: center;
                            }
                            .${this.c_1}{
                                grid-area: a;
                            }
                            .${this.c_2}{
                                grid-area: b;
                            }
                            .${this.c_3}{
                                grid-area: c;
                            }
                            .${this.c_4}{
                                grid-area: d;
                            }
                            .${this.c_5}{
                                grid-area: e;
                            }
                            .${this.l_0}{
                                grid-area: f;
                            }
                            .${this.l_0}{
                                display: inline-block;
                                transform: rotate(-40deg);
                                font-size: 14px;
                                margin-top: 20px;
                            }
                            .formato_columna{
                                position: relative;
                                display: inline-block;
                            }
                            .formato_espan{
                                visibility: hidden;
                                width: max-content;
                                background-color: #000;
                                color: #fff;
                                text-align: center;
                                border-radius: 6px;
                                padding: 5px;
                                position: absolute;
                                z-index: 1;
                                bottom: 100%;
                                left: 50%;
                                transform: translateX(-50%);
                                opacity: 0;
                                transition: opacity 0.3s;
                            }
                            .formato_columna:hover .formato_espan{
                                visibility: visible;
                                opacity: 1;
                            }
                        </style>`
    };
    render(){
        this.innerHTML += `<div class="columna_grafico">
                                <div class="${this.l_0}"></div>
                                <div class="formato_columna ${this.c_1}"><span class="formato_espan ${this.s_1}"></span></div>
                                <div class="formato_columna ${this.c_2}"><span class="formato_espan ${this.s_2}"></span></div>
                                <div class="formato_columna ${this.c_3}"><span class="formato_espan ${this.s_3}"></span></div>
                                <div class="formato_columna ${this.c_4}"><span class="formato_espan ${this.s_4}"></span></div>
                                <div class="formato_columna ${this.c_5}"><span class="formato_espan ${this.s_5}"></span></div>
                            </div>`
    };
};
customElements.define('barra-grafico_vertical', BarraGraficoVertical);

function pintarGraficoPositivo(totalSucursal, array, suma, color, valorDelGrafico, ancho, moneda){
    totalSucursal.forEach((event, i)=>{
        if(array[i] > 0){
            event.style.height = `${(array[i]/suma) * 180}px`;
            valorDelGrafico[i].textContent = `Total: ${moneda} ${array[i].toFixed(2)}`
        }
        event.style.margin = "1px"
        event.style.width = `${ancho}px`;
        event.style.background = color
        event.style.transition = `height .6s`
        
        event.style.boxShadow = `0px 0px 5px 0px #6f6e6ee0`
        event.style.borderRadius = `5px`
    });
};
class ejeYNumeracion extends HTMLElement{
    e_0 = "";
    constructor(){
        super();
    };
    connectedCallback(){
        this.getAttributes()
        this.style();
        this.render();
    };
    getAttributes(){
        this.e_0 = this.attributes.e_0.value
    }
    style(){
        this.innerHTML = `
                        <style>
                            grafico-eje_y{
                                display: grid;
                                font-size: 14px;
                            }
                            .eje_y{
                                display: grid;
                                justify-items: end;
                                align-content: stretch;
                                padding-bottom: 10px;
                            }
                            .cero_y{
                                height: 14px;
                            }
                        </style>`
    }
    render(){
        this.innerHTML += `<div class="eje_y">
                                <div class="${this.e_0}"></div>
                                <div class="${this.e_0}"></div>
                                <div class="${this.e_0}"></div>
                                <div class="${this.e_0}"></div>
                                <div class="${this.e_0}"></div>
                                <div class="cero_y">
                                    <span>0</span>
                                </div>
                            </div>`
    };
};
customElements.define('grafico-eje_y', ejeYNumeracion);

class columnaRanking extends HTMLElement{
    f_r = "";
    r_c = "";
    constructor(){
        super();
    };
    connectedCallback(){
        this.getAttributes()
        this.style();
        this.render();
    };
    getAttributes(){
        this.f_r = this.attributes.f_r.value
        this.r_c = this.attributes.r_c.value
    };
    style(){
        this.innerHTML = `
                        <style>
                            
                            .grafico_ranking{
                                height: 240px;
                                display: grid;
                                grid-template-columns: repeat(12, 1fr);
                                justify-content: center;
                                gap: 3px;
                                padding: 0px 20px;
                            }
                            .columna_ranking_total{
                                width: auto;
                                min-width: 40px;
                                display: grid;
                                grid-template-columns: 1fr;
                                align-items: stretch;
                                justify-items: stretch;
                                height: 240px;
                            }
                            .ranking_columna{
                                position: relative;
                                display: inline-block;
                                margin: 1px 0;
                                box-shadow: rgba(111, 110, 110, 0.88) 0px 0px 5px 0px;
                                border-radius: 2px;
                            }
                            .ranking_span{
                                visibility: hidden;
                                width: max-content;
                                background-color: #000;
                                color: #fff;
                                text-align: center;
                                border-radius: 6px;
                                padding: 5px;
                                position: absolute;
                                z-index: 1;
                                bottom: 100%;
                                left: 50%;
                                transform: translateX(-50%);
                                opacity: 0;
                                transition: opacity 0.3s;
                            }
                            .ranking_columna:hover .ranking_span{
                                visibility: visible;
                                opacity: 1;
                            }
                            .ranking_fecha{
                                transform: rotate(-40deg);
                                font-size: 14px;
                                margin-top: 20px;
                            }
                        </style>`
    };
    render(){
        this.innerHTML += `<div class="columna_ranking_total ${this.r_c}">
                                <div class="ranking_columna"><span class="ranking_span"></span></div>
                                <div class="ranking_columna"><span class="ranking_span"></span></div>
                                <div class="ranking_columna"><span class="ranking_span"></span></div>
                                <div class="ranking_columna"><span class="ranking_span"></span></div>
                                <div class="ranking_columna"><span class="ranking_span"></span></div>
                            </div>
                            <div class="ranking_fecha ${this.f_r}">fecha</div>`
                            
    };

};
customElements.define('columna-ranking', columnaRanking);
function rankingColumna(arrayDatos, arrayNombres, alto, claseColumna, claseFecha, arregloMeses, arrayColores){
    
    document.querySelectorAll(claseColumna).forEach((event, j)=>{
        event.style.gridTemplateRows = `${(arrayDatos[j][0]/alto)*100}% ${(arrayDatos[j][1]/alto)*100}% ${(arrayDatos[j][2]/alto)*100}% ${(arrayDatos[j][3]/alto)*100}% ${(arrayDatos[j][4]/alto)*100}%`
        for(let i = 0; i < arrayColores.length; i++){
            event.children[i].style.background = `${arrayColores[i]}`
            if(arrayDatos[j][i] > 0){
                event.children[i].children[0].textContent = `${arrayNombres[j][i]}: ${moneda()} ${arrayDatos[j][i].toFixed(2)}`
            }else{
                event.children[i].children[0].textContent = ""
            };
        };
    });
    document.querySelectorAll(claseFecha).forEach((event, i)=>{
        event.textContent = `${meses_letras[i]}${anio_principal % 100}`;
    })
};
function reinicioBarraGrafico(barras_grafico){//Esta función reinicia las barras de los gráficos a altura cero, recibe como parámetro un array
    for(let i = 0; i < barras_grafico.length; i++){
        document.querySelectorAll(barras_grafico[i]).forEach((event)=>{
            event.style.height = `0px`;
        });
    };
};
//Gráfico horizontal
function graficoHorizontal(barra, array, mas_alto, suma_barra, dato_final, decimal){
    let barras = barra
    barras.forEach((event)=>{
        event.style.width = `${(array[suma_barra]/mas_alto) * 120}px`
        event.style.background = `${colorFondoBarra[suma_barra]}`
        event.style.transition = `width .6s`
        event.parentNode.children[1].textContent = `${Math.round(array[suma_barra]).toFixed(decimal)}${dato_final}`
        event.style.boxShadow = `0px 0px 5px 0px #6f6e6ee0`
        suma_barra +=1
    });
}
//////////////////////////////////////////////////////Dona multicolor
function graficoDonaColores(elemento_id, titulo, array_datos, class_nombre, class_valor, class_porcentaje,
                            array_nombres, array_colores, extra, extra_total){
    let inventario_prom_suc = array_datos;
    let arrayDatos = [];
    let total = inventario_prom_suc.reduce((a, b) => a + b, 0);
    document.querySelector(class_nombre).textContent = titulo
    document.querySelector(class_valor).textContent = `${moneda()} ${total.toFixed(2)}`
    document.querySelector(class_porcentaje).textContent = `100% ${extra_total}`

    let circulo = document.getElementById(elemento_id)
    circulo.style.background = `conic-gradient(#fff0 0deg, 
                                #fff0 0deg 0deg, 
                                #fff0 0deg 0deg, 
                                #fff0 0deg)`;//Reinicia colores de dona
    function setConicGradientWithAnimation(array_colores, array_datos) {
        let suma_deg = 0;
        let gradient = `conic-gradient(`;
        for (let i = 0; i < inventario_prom_suc.length; i++) {
            gradient += `${array_colores[i]} ${(suma_deg/total)*360}deg ${((suma_deg + array_datos[i])/total)*360}deg, `;
            suma_deg = suma_deg + array_datos[i];
        }
        gradient += `${array_colores[0]} ${array_datos[0]}deg)`;
        circulo.style.background = gradient;
    }
    setConicGradientWithAnimation(array_colores, inventario_prom_suc);                                            
    circulo.addEventListener("mouseleave", ()=>{
        document.querySelector(class_nombre).textContent = titulo
        document.querySelector(class_valor).textContent = `${moneda()} ${total.toFixed(2)}`
        document.querySelector(class_porcentaje).textContent = `100% ${extra_total}`
    });
    let inicio = 271;
    let fin = 0;
    let suma = 0;
    for(let i = 0; i < inventario_prom_suc.length; i++){
        
        suma += inventario_prom_suc[i]
        fin = ((suma/total)*360)
        if(inicio > 270 && inicio <= 360 && fin > 0 && fin <= 90){
            arrayDatos.push(new objetoColoresinventario_prom_suc(array_colores[i], Math.ceil(inicio), Math.floor(fin + 270)))
            inicio = (fin <= 0) ? 271 : fin + 270
        }else if(inicio > 270 && inicio <= 360 && fin >= 90 && fin <= 360){
            arrayDatos.push(new objetoColoresinventario_prom_suc(array_colores[i], Math.ceil(inicio), Math.floor(360)))
            arrayDatos.push(new objetoColoresinventario_prom_suc(array_colores[i], Math.ceil(0), Math.floor(fin - 90)))
            inicio = (fin <= 0) ? 271 : fin - 90
        }else{
            arrayDatos.push(new objetoColoresinventario_prom_suc(array_colores[i], Math.ceil(inicio), Math.floor(fin - 90)))
            inicio = (fin <= 0) ? 271 : fin - 90
        };
    };
    function objetoColoresinventario_prom_suc(color, inicio, fin){
        this.color = color;
        this.inicio = inicio;
        this.fin = fin;
    };
    circulo.addEventListener('mousemove', (event) => {
        const { offsetX, offsetY } = event;
        const rect = circulo.getBoundingClientRect();
        const x = offsetX - rect.width / 2;
        const y = offsetY - rect.height / 2;
      
        const angle = (Math.atan2(y, x) * 180) / Math.PI;
        const degrees = (angle < 0 ? angle + 360 : angle);
      
        const color = obtenerColorSeccion(degrees);
        if (total <= 0) {// Eliminar el manejador del evento mousemove si total ventas es igual a cero
            circulo.removeEventListener('mousemove', ejecutarAccion(color));
            return;
        }
        color ? ejecutarAccion(color) : "";
    });

    function obtenerColorSeccion(grados) {
        for (const array of arrayDatos) {
            if (grados >= array.inicio && grados < array.fin) {
                return array.color;
            }
        };
        return null;
    };
    function ejecutarAccion(color) {
        // Realiza la acción deseada según el color de la sección capturada
        let operaciones = ""
        for(let i = 0; i < inventario_prom_suc.length; i++){
            extra ? operaciones = `/ ${extra[i]} oper.` : "";
            if(color == array_colores[i]){
                document.querySelector(class_nombre).textContent = array_nombres[i]
                document.querySelector(class_valor).textContent = `${moneda()} ${inventario_prom_suc[i].toFixed(2)}`
                document.querySelector(class_porcentaje).textContent = `${Math.round((inventario_prom_suc[i]/total)*100)}% ${operaciones}`
            }
        };
        
    };
};