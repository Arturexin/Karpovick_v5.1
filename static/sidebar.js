///////////////////////////////////////////////////////////
//Menu vertical//
const colores_sidebar = [
    "rgb(144, 238, 144)",
    "rgb(222, 184, 135)",
    "rgb(135, 206, 250)",
    "rgb(186, 85, 211)",
    "rgb(211, 211, 211)",
]

let array_btn_pages = Array(16).fill(0);

function sidebarMarcadito(){
    array_btn_pages.forEach((event, i)=>{
        if(event == 1){
            let color_fondo = ""
            if(i === 0 || i === 1){
                color_fondo = `var(--side_cero)`
            }else if(i === 2 || i === 3 || i === 4 || i === 5){
                color_fondo = `var(--side_uno)`
            }else if(i === 6 || i === 7 || i === 8 || i === 9){
                color_fondo = `var(--side_dos)`
            }else if(i === 10 || i === 11 || i === 12 || i === 13){
                color_fondo = `var(--side_tres)`
            }else if(i === 14 || i === 15){
                color_fondo = `var(--side_cuatro)`
            }
            document.querySelectorAll(".sub-lista")[i].style.background = `linear-gradient(135deg, var(--fondo-primero) 20%, ${color_fondo} 80%)`
            document.getElementById("sidebar").style.boxShadow = `0px 0px 5px 0px ${color_fondo}`
            document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
            if(document.getElementById("buscador-productos-form")){
                document.getElementById("buscador-productos-form").focus();
            }else if(document.getElementById("buscador_operacion")){
                document.getElementById("buscador_operacion").focus();
            }else if(document.getElementById("nombre")){
                document.getElementById("nombre").focus();
            };
        };
    });
};

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
    fondo_primero : ["#121212", "#0d0730", "#001e2a", "#061840"],
    fondo_segundo : ["#2F2F2F", "#2f2a54", "#2a4854", "#48538e"],
    fondo_tercero : ["#31383f", "#54489e", "#2f4a52", "#395694"],
    fondo_cuarto : ["#5b6774", "#736dd5", "#4d7076", "#5771b8"],
    fondo_quinto : ["#383838", "#0f2964", "#0f4d64", "#27569c"],

    fuente_principal : ["#eee", "#1c101a", "#232323", "#000"],
    fuente_secundario : ["#eee", "#1c101a", "#eee", "#eee"],
    marca_uno : ["#B3675A", "#A7EBCC", "#232323", "#44b6db"],
    border_principal : ["#B3675A", "#EBD5A7", "#232323", "#50C3CC"],
    fondo_input : ["#31383f", "#444a72", "#446e72", "#3d58a6"],

    boton_uno : ["#5ca1cc", "#A7E3EB", "#3e3e97", "#50C3CC"],
    boton_dos : ["#B3675A", "#EBC4A7", "#5d5c5c", "#dd836e"],

    boton_tres : ["#6abb6b", "#D7EBA7", "#232323", "#44db95"]
};

function cambioColorFondo() {
    document.querySelectorAll(".color_fondo").forEach((event, i) => {
        event.style.background = colores_fondo_web.fondo_primero[i];
        event.addEventListener("click", () => {
            document.documentElement.style.setProperty('--fondo-primero', colores_fondo_web.fondo_primero[i]);
            document.documentElement.style.setProperty('--fondo-segundo', colores_fondo_web.fondo_segundo[i]);
            document.documentElement.style.setProperty('--fondo-tercero', colores_fondo_web.fondo_tercero[i]);
            document.documentElement.style.setProperty('--fondo-cuarto', colores_fondo_web.fondo_cuarto[i]);
            document.documentElement.style.setProperty('--fondo-quinto', colores_fondo_web.fondo_quinto[i]);
            /* document.documentElement.style.setProperty('--color-principal', colores_fondo_web.fuente_principal[i]);
            document.documentElement.style.setProperty('--color-secundario', colores_fondo_web.fuente_secundario[i]); */
            /* document.documentElement.style.setProperty('--fondo-marca-uno', colores_fondo_web.marca_uno[i]);
            document.documentElement.style.setProperty('--border-principal', colores_fondo_web.border_principal[i]); */
            document.documentElement.style.setProperty('--fondo-input', colores_fondo_web.fondo_input[i]);
            /* document.documentElement.style.setProperty('--boton-uno', colores_fondo_web.boton_uno[i]);
            document.documentElement.style.setProperty('--boton-dos', colores_fondo_web.boton_dos[i]);
            document.documentElement.style.setProperty('--boton-tres', colores_fondo_web.boton_tres[i]); */
            localStorage.setItem("clave_control_color", i)
        });
    });
};
function inicioColoresFondo(){
    for(let i = 0; i < 4; i++){
        if(localStorage.getItem("clave_control_color") === `${i}`){
            document.documentElement.style.setProperty('--fondo-primero', colores_fondo_web.fondo_primero[i]);
            document.documentElement.style.setProperty('--fondo-segundo', colores_fondo_web.fondo_segundo[i]);
            document.documentElement.style.setProperty('--fondo-tercero', colores_fondo_web.fondo_tercero[i]);
            document.documentElement.style.setProperty('--fondo-cuarto', colores_fondo_web.fondo_cuarto[i]);
            document.documentElement.style.setProperty('--fondo-quinto', colores_fondo_web.fondo_quinto[i]);
            /* document.documentElement.style.setProperty('--color-principal', colores_fondo_web.fuente_principal[i]);
            document.documentElement.style.setProperty('--color-secundario', colores_fondo_web.fuente_secundario[i]); */
            /* document.documentElement.style.setProperty('--fondo-marca-uno', colores_fondo_web.marca_uno[i]);
            document.documentElement.style.setProperty('--border-principal', colores_fondo_web.border_principal[i]); */
            document.documentElement.style.setProperty('--fondo-input', colores_fondo_web.fondo_input[i]);
            /* document.documentElement.style.setProperty('--boton-uno', colores_fondo_web.boton_uno[i]);
            document.documentElement.style.setProperty('--boton-dos', colores_fondo_web.boton_dos[i]);
            document.documentElement.style.setProperty('--boton-tres', colores_fondo_web.boton_tres[i]); */
        }
    }
};