function tablaRep(array_suc, titulo){
    let suma_unidades = 0;
    let suma_devoluciones = 0;
    let suma_monto = 0;
    let tabla_ = `<table id="tabla_salidas">
                    <thead>
                        <tr>
                            <th scope="row" colspan="16"><h2>Detalle de operaciones ${titulo}</h2></th>
                        </tr>
                        <tr>
                            <th>Fecha</th>
                            <th>Usuario</th>
                            <th>Sucursal</th>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Comprobantes</th>
                            <th>Unidades</th>
                            <th>Devolución</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>`
        for(fila of array_suc){
            let row_ =  `<tr>
                            <td>${fila.fecha}</td>
                            <td>${fila.nombres}</td>
                            <td>${fila.sucursal_nombre}</td>
                            <td>${fila.codigo}</td>
                            <td>${fila.descripcion}</td>
                            <td>${fila.comprobante}</td>
                            <td style="text-align: end;">${fila.existencias_salidas}</td>
                            <td style="text-align: end;">${fila.existencias_devueltas}</td>
                            <td style="text-align: end;">${((fila.existencias_salidas - fila.existencias_devueltas) * fila.precio_venta_salidas).toFixed(2)}</td>
                        </tr>`
            tabla_ = tabla_ + row_; 
            suma_unidades += fila.existencias_salidas;
            suma_devoluciones += fila.existencias_devueltas;
            suma_monto += (fila.existencias_salidas - fila.existencias_devueltas) * fila.precio_venta_salidas;
        }                        
                                
        tabla_ += `
                    </tbody>
                    <tfoot>
                        <tr>
                            <th scope="row" colspan="6">Total</th>
                            <th>${suma_unidades}</th>
                            <th>${suma_devoluciones}</th>
                            <th>${suma_monto.toFixed(2)}</th>
                        </tr>
                    </tfoot>
                </table>`
    return tabla_;
}
function estilosRep(){
    return `<style>
                body{
                    display: grid;
                    align-items: center;
                    align-content: space-between;
                    justify-content: center;
                    gap: 20px;
                    background: rgba(173, 216, 230, 0.8);
                    color: #161616;
                }
                td, th{
                    border: 1px solid #161616;
                }
                th{
                    background: rgba(100, 149, 237, 0.8);
                }
                .titulo_reporte{
                    display: grid;
                    justify-items: center;
                }
            </style>`
}
function imprimirRep(){
    return `<h4 style="text-align: center;">${new Date()}</h4>
            <div>
                <button class="imprimir_reporte_usuarios">Imprimir</button>
            </div>
            <script>
                document.querySelector(".imprimir_reporte_usuarios").addEventListener("click", (event) => {
                    event.preventDefault()
                    window.print()
                });
            </script>`
}