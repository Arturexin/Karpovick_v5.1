//////////////////////////////////////////////////////////////////////////////////////////////
//////MODALES ////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
function modal_proceso_abrir(mensaje, estado, mensaje_dos){
    aperturarMensajesModal()
    document.getElementById('myModal').style.display = 'block';
    document.getElementById('mensaje_proceso').textContent = mensaje
    document.getElementById('estado_proceso').textContent = estado
    document.getElementById('mensaje_dos').innerHTML = mensaje_dos
}
function modal_proceso_abrir_botones(){
    document.querySelector('.botones_respuesta').style.display = 'block';
    document.getElementById("no_salir").focus()
}
function modal_proceso_abrir_botones_salir(){
    document.querySelector('.botones_respuesta_dos').style.display = 'block';
    document.getElementById("si_salir").focus()
}
function modal_proceso_cerrar(){
    document.getElementById('myModal').style.display = 'none';
    cerrarMensajesModal()
}
function modal_proceso_cerrar_botones(){
    document.querySelector('.botones_respuesta').style.display = 'none';
    cerrarMensajesModal()
}
function modal_proceso_salir_botones(){
    modal_proceso_abrir_botones_salir()
    document.getElementById("si_salir").addEventListener("click", () =>{
        document.querySelector('.botones_respuesta_dos').style.display = 'none';
        modal_proceso_cerrar()
    })
}
function modal_proceso_salir_botones_focus(id){
    modal_proceso_abrir_botones_salir()
    document.getElementById("si_salir").addEventListener("click", () =>{
        document.querySelector('.botones_respuesta_dos').style.display = 'none';
        modal_proceso_cerrar()
        document.getElementById(id).select()
    })
}
//Modales
function aperturarMensajesModal(){
    let modal_mensaje = `<div class="modal-content">
                            <p id="mensaje_proceso"></p>
                            <p id="estado_proceso"></p>
                            <p id="mensaje_dos"></p>
                            <div class="botones_respuesta">
                                <button id="si_comprobante" class="myButtonAgregar">Sí</button>
                                <button id="no_salir" class="myButtonEliminar">No</button>
                            </div>
                            <div class="botones_respuesta_dos">
                                <button id="si_salir" class="myButtonAgregar">Aceptar</button>
                            </div>
                        </div>`;
    document.getElementById("myModal").innerHTML = modal_mensaje;
}
function cerrarMensajesModal(){
    let modal_mensaje = ``;
    document.getElementById("myModal").innerHTML = modal_mensaje;
}