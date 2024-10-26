let colores_uno =   [
    "rgb(135, 206, 235)",
    "rgb(255, 228, 181)",
    "rgb(255, 182, 193)",
    "rgb(152, 251, 152)",
    "rgb(238, 232, 170)",
    "rgb(216, 191, 216)",
    "rgb(175, 238, 238)",
    "rgb(255, 192, 203)"
]
let colores_dos =   [
    "rgb(135, 206, 235, 0.2)",
    "rgb(255, 228, 181, 0.2)",
    "rgb(255, 182, 193, 0.2)",
    "rgb(152, 251, 152, 0.2)",
    "rgb(238, 232, 170, 0.2)",
    "rgb(216, 191, 216, 0.2)",
    "rgb(175, 238, 238, 0.2)",
    "rgb(255, 192, 203, 0.2)"
];


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
        
function graficoBarrasHorizontal(elemento, array, simbolo){
    const ctx = elemento.getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['AC','SU','SD','ST','SC'],
            datasets: [{
                /* label: tooltip, */
                data: array,
                backgroundColor:    [
                                        "rgb(230, 202, 123)",
                                        "rgb(145, 230, 156)",
                                        "rgb(99, 128, 230)",
                                        "rgb(230, 110, 141)",
                                        "rgb(77, 77, 77)"
                                    ],
                borderColor:    [
                                    "rgb(230, 202, 123, 0.2)",
                                    "rgb(145, 230, 156, 0.2)",
                                    "rgb(99, 128, 230, 0.2)",
                                    "rgb(230, 110, 141, 0.2)",
                                    "rgb(77, 77, 77, 0.2)"
                                ],
                borderWidth: 1,
                barThickness: 8  // Ajusta este valor para cambiar el grosor de las barras
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: false  // Esta línea elimina las etiquetas del eje x
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false // Esta línea oculta las líneas cartesianas
                    },
                    ticks: {
                        color: '#eee' // Color de los labels del eje y
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Esta línea deshabilita la leyenda
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let value = context.raw;
                            return simbolo + value;
                        }
                    }
                }
            }
        }
    });
}
function graficoBarrasHorizontalDos(elemento, labels, label, array_uno, array_dos, array_tres, array_cuatro, arr_conteo){
    let ctx = elemento.getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: label[0],
                    data: array_uno,
                    backgroundColor: cls[0],
                    borderColor: cls_dos[0],
                    borderWidth: 1
                },
                {
                    label: label[1],
                    data: array_dos,
                    backgroundColor: cls[1],
                    borderColor: cls_dos[1],
                    borderWidth: 1
                },
                {
                    label: label[2],
                    data: array_tres,
                    backgroundColor: cls[2],
                    borderColor: cls_dos[2],
                    borderWidth: 1
                },
                {
                    label: label[3],
                    data: array_cuatro,
                    backgroundColor: cls[3],
                    borderColor: cls_dos[3],
                    borderWidth: 1
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#eee'
                    }
                },
                y: {
                    stacked: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#eee'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#eee'
                    }
                },
                /* tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw;
                        }
                    }
                }, */
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            let value = context.raw;
                            let index = context.dataIndex;
                            let conteo = arr_conteo[index];
                            return `${label}: ${value}, ${Math.round((value/conteo)*100)}% de ${conteo} operaciones.`;
                        }
                    }
                }
            }
        }
    });
}
function graficoBarrasHorizontalTres(elemento, labels, label, array_uno, array_dos, array_tres, array_cuatro, array_cinco, arr_conteo){
    let ctx = elemento.getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: label[0],
                    data: array_uno,
                    backgroundColor: cls[0],
                    borderColor: cls_dos[0],
                    borderWidth: 1,
                    barThickness: 30
                },
                {
                    label: label[1],
                    data: array_dos,
                    backgroundColor: cls[1],
                    borderColor: cls_dos[1],
                    borderWidth: 1,
                    barThickness: 30
                },
                {
                    label: label[2],
                    data: array_tres,
                    backgroundColor: cls[2],
                    borderColor: cls_dos[2],
                    borderWidth: 1,
                    barThickness: 30
                },
                {
                    label: label[3],
                    data: array_cuatro,
                    backgroundColor: cls[3],
                    borderColor: cls_dos[3],
                    borderWidth: 1,
                    barThickness: 30
                },
                {
                    label: label[4],
                    data: array_cinco,
                    backgroundColor: cls[4],
                    borderColor: cls_dos[4],
                    borderWidth: 1,
                    barThickness: 30
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            
            scales: {
                x: {
                    display: true,  // Esta línea elimina las etiquetas del eje x
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#eee'
                    }
                },
                y: {
                    display: true,  // Esta línea elimina las etiquetas del eje x
                    stacked: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#eee'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#eee'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            let value = context.raw;
                            let index = context.dataIndex;
                            let conteo = arr_conteo[index];
                            return `${label}: S/ ${value.toFixed(2)}, ${Math.round((value/conteo)*100)}% de S/ ${conteo.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}
function graficoBarrasVertical(elemento, array_uno, array_dos, array_nombres){
    const ctx = elemento.getContext('2d');
    return new Chart(ctx, {
        
        data: {
            labels: mes_anio,
            datasets: [{
                type: 'bar',
                label: array_nombres[0],
                data: array_uno, 
                backgroundColor: "rgb(230, 202, 123)",
                borderColor: "rgb(230, 202, 123, 0.2)",
                borderWidth: 1,
                barThickness: 10  // Ajusta este valor para cambiar el grosor de las barras
            }, {
                type: 'bar',
                label: array_nombres[1],
                data: array_dos, 
                backgroundColor: "rgb(230, 110, 141)",
                borderColor: "rgb(230, 110, 141, 0.2)",
                borderWidth: 1,
                barThickness: 10  // Ajusta este valor para cambiar el grosor de las barras
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },ticks: {
                        color: '#eee'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#eee'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#eee' // Establece el color de los labels en la leyenda
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let value = context.raw;
                            return 'S/ ' + formatoMoneda(value);
                        }
                    }
                }
            }
        }
    });
}
function graficoBarrasVerticalUnid(elemento, array_uno, array_dos, array_nombres){
    const ctx = elemento.getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: mes_anio,
            datasets: [{
                label: array_nombres[0],
                data: array_uno, 
                backgroundColor: "rgb(99, 128, 230)",
                borderColor: "rgb(99, 128, 230, 0.2)",
                borderWidth: 1,
                barThickness: 10  // Ajusta este valor para cambiar el grosor de las barras
            }, {
                label: array_nombres[1],
                data: array_dos, 
                backgroundColor: "rgb(145, 230, 156)",
                borderColor: "rgb(145, 230, 156, 0.2)",
                borderWidth: 1,
                barThickness: 10  // Ajusta este valor para cambiar el grosor de las barras
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },ticks: {
                        color: '#eee'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#eee'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#eee' // Establece el color de los labels en la leyenda
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let value = context.raw;
                            return `Unidades: ${value}`;
                        }
                    }
                }
            }
        }
    });
}

function graficoLineasVertical(elemento, array_uno, array_dos, array_tres, array_cuatro, array_cinco, labels, suc_add){
    let ctxSucursales = elemento.getContext('2d');
    return new Chart(ctxSucursales, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: suc_add[0],
                    data: array_uno,
                    borderColor: "rgb(230, 202, 123)",
                    backgroundColor: "rgb(230, 202, 123, 0.2)",
                    fill: false
                },
                {
                    label: suc_add[1],
                    data: array_dos,
                    borderColor: "rgb(145, 230, 156)",
                    backgroundColor: "rgb(145, 230, 156, 0.2)",
                    fill: false
                },
                {
                    label: suc_add[2],
                    data: array_tres,
                    borderColor: "rgb(99, 128, 230)",
                    backgroundColor: "rgb(99, 128, 230, 0.2)",
                    fill: false
                },
                {
                    label: suc_add[3],
                    data: array_cuatro,
                    borderColor: "rgb(230, 110, 141)",
                    backgroundColor: "rgb(230, 110, 141, 0.2)",
                    fill: false
                },
                {
                    label: suc_add[4],
                    data: array_cinco,
                    borderColor: "rgb(77, 77, 77)",
                    backgroundColor: "rgb(77, 77, 77, 0.2)",
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#eee'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#eee'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true, // Coloca la leyenda en la parte superior
                    labels: {
                        boxWidth: 20, // Ajusta el ancho de las cajas de color
                        padding: 10, // Añade padding para dar más espacio alrededor de las leyendas
                        color: '#eee'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            let value = context.raw;
                            return `${label}: S/ ${formatoMoneda(value)}`;
                        }
                    }
                }
            }
        }
    });
}

function graficoLineasVerticalUnid(elemento, array_uno, array_dos, array_tres, array_cuatro, array_cinco, labels, suc_add){
    let ctxSucursales = elemento.getContext('2d');
    return new Chart(ctxSucursales, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: suc_add[0],
                    data: array_uno,
                    borderColor: "rgb(230, 202, 123)",
                    backgroundColor: "rgb(230, 202, 123, 0.2)",
                    fill: false
                },
                {
                    label: suc_add[1],
                    data: array_dos,
                    borderColor: "rgb(145, 230, 156)",
                    backgroundColor: "rgb(145, 230, 156, 0.2)",
                    fill: false
                },
                {
                    label: suc_add[2],
                    data: array_tres,
                    borderColor: "rgb(99, 128, 230)",
                    backgroundColor: "rgb(99, 128, 230, 0.2)",
                    fill: false
                },
                {
                    label: suc_add[3],
                    data: array_cuatro,
                    borderColor: "rgb(230, 110, 141)",
                    backgroundColor: "rgb(230, 110, 141, 0.2)",
                    fill: false
                },
                {
                    label: suc_add[4],
                    data: array_cinco,
                    borderColor: "rgb(77, 77, 77)",
                    backgroundColor: "rgb(77, 77, 77, 0.2)",
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#eee'
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        display: true,
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#eee'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        boxWidth: 20,
                        padding: 10,
                        color: '#eee'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}    
function graficoPolarDoble(elemento, array_uno, array_dos, label){
    let ctxRadar = elemento.getContext('2d');
    return new Chart(ctxRadar, {
        type: 'polarArea',
        data: {
            labels: label,
            datasets: [
                {
                    label: 'Ventas',
                    data: array_uno, // Datos de ventas para cada sucursal
                    backgroundColor:    [
                                            "rgb(230, 202, 123, 0.2)",
                                            "rgb(145, 230, 156, 0.2)",
                                            "rgb(99, 128, 230, 0.2)",
                                            "rgb(230, 110, 141, 0.2)",
                                            "rgb(77, 77, 77, 0.2)"
                                            
                                        ],
                    borderColor:    [
                                        "rgb(230, 202, 123)",
                                        "rgb(145, 230, 156)",
                                        "rgb(99, 128, 230)",
                                        "rgb(230, 110, 141)",
                                        "rgb(77, 77, 77)"
                                    ],
                    borderWidth: 1
                },
                {
                    label: 'Costos',
                    data: array_dos, // Datos de costos para cada sucursal
                    backgroundColor:    [
                                            "rgb(230, 202, 123, 0.2)",
                                            "rgb(145, 230, 156, 0.2)",
                                            "rgb(99, 128, 230, 0.2)",
                                            "rgb(230, 110, 141, 0.2)",
                                            "rgb(77, 77, 77, 0.2)"
                                            
                                        ],
                    borderColor:    [
                                        "rgb(230, 202, 123)",
                                        "rgb(145, 230, 156)",
                                        "rgb(99, 128, 230)",
                                        "rgb(230, 110, 141)",
                                        "rgb(77, 77, 77)"
                                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 200,
                    ticks: {
                        color: '#eee',
                        backdropColor: 'rgba(0, 0, 0, 0)' // Esto elimina el fondo de los ticks
                    },
                    pointLabels: {
                        display: true,
                        centerPointLabels: true,
                        color: '#eee',
                        font: {
                            size: 12 // Ajusta el tamaño de la fuente de los labels para que ocupen menos espacio
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                    position: 'left', // Coloca la leyenda en la parte superior
                    labels: {
                        boxWidth: 20, // Ajusta el ancho de las cajas de color
                        padding: 40, // Añade padding para dar más espacio alrededor de las leyendas
                        color: '#eee'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let value = context.raw;
                            let datasetLabel = context.dataset.label; // Obtiene "Ventas" o "Costos"
                            return datasetLabel + ': S/ ' + formatoMoneda(value);
                        }
                    }
                }
            }
        }
    });
}

function graficoDona(elemento, labels, array, colores_uno, colores_dos, bool_, expresion){
    let ctxDona = elemento.getContext('2d');
    return new Chart(ctxDona, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: array, // Datos ficticios: reemplázalos con tus datos reales
                backgroundColor: [
                    colores_uno,
                    colores_dos
                ],
                borderColor: [
                    colores_dos,
                    colores_dos
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%', // Ajusta este valor para hacer la dona más delgada
            plugins: {
                legend: {
                    display: bool_,
                    position: 'top',
                    labels: {
                        boxWidth: 20,
                        padding: 15,
                        color: '#eee'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let value = context.raw;
                            let label = context.label;
                            return `${Math.round(value)}${expresion}` ;
                        }
                    }
                }
            }
        }
    });
}
function graficoDonaDos(elemento, labels, array, colores_uno, colores_dos, lab){
    let ctxDona = elemento.getContext('2d');
    return new Chart(ctxDona, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: array, // Datos ficticios: reemplázalos con tus datos reales
                backgroundColor: colores_uno,
                borderColor: colores_dos,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%', // Ajusta este valor para hacer la dona más delgada
            plugins: {
                legend: {
                    display: lab,
                    position: 'top',
                    labels: {
                        boxWidth: 20,
                        padding: 15,
                        color: '#eee'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let value = context.raw;
                            let label = context.label;
                            return label + ': S/ ' + formatoMoneda(value)
                        }
                    }
                }
            }
        }
    });
}