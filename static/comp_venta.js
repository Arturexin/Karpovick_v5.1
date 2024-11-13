function tablaComp(array){
    let importe_venta = 0;
    let tabla_ =    `<table>
                        <thead class="tabla_head">
                            <tr>
                                <th>PRODUCTO</th>
                                <th>CANTIDAD</th>
                                <th>PRECIO</th>
                                <th>IMPORTE</th>
                            </tr>
                        </thead>
                        <tbody>`;
    array.forEach((event)=>{
        let suma_ = 0;
        let producto = event.descripcion;
        if(event.existencias){
            suma_ = event.existencias;
        }else{
            suma_ = event.existencias_ac +
                    event.existencias_su +
                    event.existencias_sd +
                    event.existencias_st +
                    event.existencias_sc;
        }
        let catidad = suma_;
        let precio = event.precio;
        let importe = suma_* event.precio;
        let row_ =          `<tr>
                                <td>${producto}</td>
                                <td>${catidad}</td>
                                <td>${precio.toFixed(2)}</td>
                                <td>${importe.toFixed(2)}</td>
                            </tr>`;
        tabla_ = tabla_ + row_; 
        importe_venta += Number(importe);
    });
        tabla_ +=       `</tbody>
                        <tfoot>
                            <tr class="clave">
                                <th>OP. GRAVADAS</th>
                                <th></th>
                                <th></th>
                                <th> ${moneda()} ${((1/1.18)*(importe_venta)).toFixed(2)}</th>
                            </tr>
                            <tr class="clave">
                                <th>I.G.V.</th>
                                <th>18%</th>
                                <th></th>
                                <th> ${moneda()} ${((importe_venta)-((1/1.18)*(importe_venta))).toFixed(2)}</th>
                            </tr>
                            <tr>
                                <th>IMPORTE TOTAL</th>
                                <th></th>
                                <th></th>
                                <th> ${moneda()} ${importe_venta.toFixed(2)}</th>
                            </tr>
                        </tfoot>   
                    </table>`;
    return tabla_;
}
function estilosComp(){
    return `<style>
                *{
                    margin: 0;
                    padding: 0;
                }
                .contenedor_ticket {
                    display: flex;
                    justify-content: center;
                }
                .ticket{
                    width: 240px;
                    margin: 20px;
                    font-size: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                table{
                    font-size: 10px;
                }
                .tabla_head th{
                    color: black;
                    border-top: 1px solid black;
                    border-bottom: 1px solid black;
                    margin: auto;
                }
                .codBarTicket {
                    width: 150px;
                }
                .invisible {
                    display: none;
                }
            </style>`
}
function accionesComp(nro_venta, ticket_venta){
    return `<button id="imprimir_ticket">Imprimir</button>
            <button id="guardar_pdf_dos">PDF</button>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
            <script>
                if(document.querySelector(".tipo_comprobante").textContent === "Nota de venta"){
                    document.querySelectorAll(".clave").forEach((event)=>{
                        event.classList.add("invisible")
                    });   
                }
                JsBarcode(".codBarTicket", "${nro_venta}", {
                    format: "CODE128",
                    displayValue: false
                });
                var options = {
                    filename: '${ticket_venta}.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                document.getElementById("guardar_pdf_dos").addEventListener("click",(e)=>{
                    e.preventDefault()
                    html2pdf().set(options).from(document.querySelector(".ticket")).save();
                })
                document.getElementById("imprimir_ticket").addEventListener("click",(e)=>{
                    e.preventDefault()
                    window.print();
                })
            </script>`;
}