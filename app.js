let chart; // Variable global para el gráfico

function addRow() {
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    const columnCount = document.querySelector('#dataTable thead tr').cells.length - 1;

    const labelCell = newRow.insertCell(0);
    labelCell.innerHTML = `<input type="text" placeholder="Etiqueta">`;

    for (let i = 1; i < columnCount; i++) {
        const cell = newRow.insertCell(i);
        cell.innerHTML = `<input type="number" placeholder="0">`;
    }

    const deleteCell = newRow.insertCell(columnCount);
    deleteCell.innerHTML = `<button onclick="deleteRow(this)">Eliminar Fila</button>`;
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function deleteColumn() {
    const table = document.getElementById('dataTable');
    const headerRow = table.getElementsByTagName('thead')[0].rows[0];
    const bodyRows = table.getElementsByTagName('tbody')[0].rows;

    // Verifica si hay más de una columna para evitar eliminar todas
    if (headerRow.cells.length > 2) {
        // Elimina el penúltimo encabezado (antes del botón "Añadir Columna")
        headerRow.deleteCell(headerRow.cells.length - 2);

        // Elimina la penúltima celda de cada fila de datos (antes del botón "Eliminar Fila")
        for (let i = 0; i < bodyRows.length; i++) {
            bodyRows[i].deleteCell(bodyRows[i].cells.length - 2);
        }
    } else {
        alert("No puedes eliminar todas las columnas.");
    }
}

function addColumn() {
    const table = document.getElementById('dataTable');
    const headerRow = table.getElementsByTagName('thead')[0].rows[0];
    const bodyRows = table.getElementsByTagName('tbody')[0].rows;

    // Crear un nuevo encabezado y añadirlo antes del último th (donde está el botón)
    const newHeader = document.createElement('th');
    newHeader.innerHTML = `<input type="text" placeholder="Atributo">`;
    headerRow.insertBefore(newHeader, headerRow.lastElementChild);

    // Añadir una nueva celda en cada fila de datos
    for (let i = 0; i < bodyRows.length; i++) {
        const newCell = bodyRows[i].insertCell(bodyRows[i].cells.length - 1);
        newCell.innerHTML = `<input type="number" placeholder="0">`;
    }
}

function getDataFromTable() {
    const labels = [];
    const datasets = [];
    const table = document.getElementById('dataTable');
    const headerInputs = Array.from(table.getElementsByTagName('thead')[0].rows[0].cells)
        .slice(1, -1) // Ignorar el primer y último th
        .map(th => th.querySelector('input').value || `Atributo ${th.cellIndex}`);

    // Usar los valores de la primera columna como los nombres de los datasets
    const rows = table.getElementsByTagName('tbody')[0].rows;
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        const datasetLabel = cells[0].querySelector('input').value;
        const datasetData = [];

        if (datasetLabel) {
            for (let j = 1; j < cells.length - 1; j++) {
                const value = cells[j].querySelector('input').value;
                if (value !== '' && !isNaN(value)) { // Ignorar valores vacíos y asegurarse de que sean números
                    datasetData.push(parseFloat(value));
                }
            }

            datasets.push({
                label: datasetLabel,
                data: datasetData,
                backgroundColor: getRandomBrightColor(0.5), // Más vivos y con algo de transparencia
                borderColor: getRandomBrightColor(1), // Colores sólidos para el borde
                borderWidth: 1
            });
        }
    }

    return { labels: headerInputs, datasets };
}

function getRandomBrightColor(alpha = 1) {
    const r = Math.floor(Math.random() * 156 + 100); // Evitar tonos muy oscuros (rango de 100-255)
    const g = Math.floor(Math.random() * 156 + 100);
    const b = Math.floor(Math.random() * 156 + 100);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function generateBrightColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(getRandomBrightColor(0.7)); // Colores más vivos y variados
    }
    return colors;
}

function showModal() {
    const { labels, datasets } = getDataFromTable();
    generateChart(labels, datasets);

    // Actualizar el título y descripción en el modal
    const title = document.getElementById('graphTitle').value;
    const subtitle = document.getElementById('graphSubtitle').value;
    document.getElementById('chartTitleText').innerText = title;
    document.getElementById('chartSubtitleText').innerText = subtitle;

    // Mostrar el modal del gráfico
    document.getElementById('modal').style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
}

function generateChart(labels, datasets) {
    const chartType = document.getElementById('chartType').value;
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    const chartDescription = document.getElementById('chartDescription');

    if (chart) {
        chart.destroy();
    }

    if (chartType === 'boxplot') {
        // Crear un array de datos por columna en lugar de filas
        const table = document.getElementById('dataTable');
        const bodyRows = table.getElementsByTagName('tbody')[0].rows;
        const columnData = [];

        // Inicializar arrays para cada columna
        const columnCount = bodyRows[0].cells.length - 2;
        for (let j = 0; j < columnCount; j++) {
            columnData[j] = [];
        }

        // Rellenar los arrays de cada columna con los datos
        for (let i = 0; i < bodyRows.length; i++) {
            const cells = bodyRows[i].cells;
            for (let j = 1; j <= columnCount; j++) {
                const value = cells[j].querySelector('input').value;
                if (value !== '' && !isNaN(value)) { // Solo incluir valores numéricos válidos
                    columnData[j - 1].push(parseFloat(value));
                }
            }
        }

        // Crear datasets específicos para el gráfico de cajas
        const boxPlotData = columnData.map((data, index) => {
            if (data.length === 0) return null; // Ignorar columnas sin datos válidos
            return {
                label: labels[index],
                min: Math.min(...data),
                q1: quantile(data, 0.25),
                median: quantile(data, 0.5),
                q3: quantile(data, 0.75),
                max: Math.max(...data)
            };
        }).filter(item => item !== null); // Filtrar elementos nulos

        chart = new Chart(ctx, {
            type: 'boxplot',
            data: {
                labels: labels, // Etiquetas para las columnas
                datasets: [{
                    label: 'Diagrama de Cajas',
                    data: boxPlotData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else if (chartType === 'pie') {
        // Calcular promedios para el gráfico de pastel
        const averages = labels.map((_, colIndex) => {
            let sum = 0;
            let count = 0;
            datasets.forEach(ds => {
                const value = parseFloat(ds.data[colIndex]);
                if (!isNaN(value)) {
                    sum += value;
                    count++;
                }
            });
            return count > 0 ? sum / count : 0;
        });

        chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: averages, // Usar promedios calculados
                    backgroundColor: generateBrightColors(averages.length),
                    borderColor: generateBrightColors(averages.length),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: 20
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    },
                    datalabels: {
                        color: 'white',
                        font: {
                            weight: 'bold',
                            size: 14
                        },
                        formatter: (value) => value.toFixed(2) // Muestra el valor en las etiquetas
                    }
                }
            },
            plugins: [ChartDataLabels] // Activar el plugin
        });

        // Mostrar descripción para el gráfico de pastel
        chartDescription.style.display = 'block';
        chartDescription.innerText = 'Este gráfico muestra el promedio de los datos por atributo.';
    } else {
        // Otros gráficos
        chart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Ocultar descripción si no es gráfico de pastel
        chartDescription.style.display = 'none';
    }
}

function downloadChart() {
    const canvas = document.getElementById('chartCanvas');
    const title = document.getElementById('chartTitleText').innerText;
    const subtitle = document.getElementById('chartSubtitleText').innerText;
    const description = document.getElementById('chartDescription').style.display === 'block' ? document.getElementById('chartDescription').innerText : '';

    // Crear un canvas temporal para incluir texto y gráfico
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height + 80; // Espacio adicional para el texto

    // Dibujar el título y el subtítulo en el canvas temporal
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText(title, 10, 25);
    ctx.font = "14px Arial";
    ctx.fillText(subtitle, 10, 45);

    // Dibujar el gráfico existente en el canvas temporal
    ctx.drawImage(canvas, 0, 60);

    // Agregar descripción para gráficos de pastel
    if (description) {
        ctx.font = "12px Arial";
        ctx.fillText(description, 10, tempCanvas.height - 20);
    }

    // Descargar la imagen como PNG
    const link = document.createElement('a');
    link.href = tempCanvas.toDataURL('image/png');
    link.download = 'grafico.png';
    link.click();
}

function downloadStatistics() {
    const title = "Medidas Estadísticas";
    const description = "Tabla con los datos ordenados de menor a mayor a continuación:";
    const table = document.getElementById('sortedDataTable');
    const meanText = document.getElementById('mean').innerText;
    const medianText = document.getElementById('median').innerText;
    const modeText = document.getElementById('mode').innerText;

    // Crear un canvas temporal para incluir texto y tabla
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');

    // Configurar dimensiones del canvas
    tempCanvas.width = 800;
    tempCanvas.height = 400; // Ajustar para el tamaño necesario

    // Estilo de texto y encabezados
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText(title, 10, 30);
    
    ctx.font = "14px Arial";
    ctx.fillText(description, 10, 60);

    // Dibujar la tabla en el canvas
    let startY = 80; // Punto de inicio para la tabla
    const rowHeight = 25; // Altura de cada fila
    const columnWidth = tempCanvas.width / table.rows[0].cells.length;

    // Recorrer filas y columnas de la tabla para dibujarlas en el canvas
    for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
        const row = table.rows[rowIndex];
        for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
            const cell = row.cells[cellIndex];
            ctx.strokeStyle = '#ddd';
            ctx.strokeRect(cellIndex * columnWidth, startY, columnWidth, rowHeight);
            ctx.fillText(cell.innerText, cellIndex * columnWidth + 10, startY + 18);
        }
        startY += rowHeight; // Moverse a la siguiente fila
    }

    // Dibujar las estadísticas debajo de la tabla
    ctx.font = "16px Arial";
    ctx.fillText(meanText, 10, startY + 30);
    ctx.fillText(medianText, 10, startY + 60);
    ctx.fillText(modeText, 10, startY + 90);

    // Descargar la imagen como PNG
    const link = document.createElement('a');
    link.href = tempCanvas.toDataURL('image/png');
    link.download = 'medidas_estadisticas.png';
    link.click();
}


function displayStatistics(data) {
    // Filtrar valores no válidos (NaN)
    const validData = data.filter(value => !isNaN(value));

    if (validData.length === 0) {
        document.getElementById('mean').innerText = `Media: N/A`;
        document.getElementById('median').innerText = `Mediana: N/A`;
        document.getElementById('mode').innerText = `Moda: N/A`;
        return;
    }

    const meanValue = (validData.reduce((acc, val) => acc + val, 0) / validData.length).toFixed(2);
    const medianValue = quantile(validData, 0.5).toFixed(2);
    const modeValue = getMode(validData).toString();

    document.getElementById('mean').innerText = `Media: ${meanValue}`;
    document.getElementById('median').innerText = `Mediana: ${medianValue}`;
    document.getElementById('mode').innerText = `Moda: ${modeValue}`;
}

function quantile(arr, q) {
    const sorted = arr.filter(value => !isNaN(value)).sort((a, b) => a - b); // Ignorar valores NaN
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    return sorted[base + 1] !== undefined ? sorted[base] + rest * (sorted[base + 1] - sorted[base]) : sorted[base];
}

function getMode(arr) {
    const freq = {};
    arr.forEach(val => {
        freq[val] = (freq[val] || 0) + 1;
    });

    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.keys(freq).filter(key => freq[key] === maxFreq);

    // Si hay más de un valor con la frecuencia máxima o si todos tienen la misma frecuencia, no hay moda
    if (modes.length > 2 || modes.length === arr.length) {
        return 'No hay moda';
    }

    return modes;
}

function showStatisticsModal() {
    const { sortedData } = getSortedData();
    displaySortedData(sortedData);
    displayStatistics(sortedData.flat());

    // Mostrar el modal de estadísticas
    document.getElementById('statsModal').style.display = 'block';
    document.getElementById('statsModalOverlay').style.display = 'block';
}

function closeStatisticsModal() {
    document.getElementById('statsModal').style.display = 'none';
    document.getElementById('statsModalOverlay').style.display = 'none';
}

function getSortedData() {
    const table = document.getElementById('dataTable');
    const rows = table.getElementsByTagName('tbody')[0].rows;

    let allData = [];

    // Recolectar todos los datos numéricos en una sola lista, ignorando celdas vacías
    for (let colIndex = 1; colIndex < rows[0].cells.length - 1; colIndex++) {
        const columnData = Array.from(rows).map(row => {
            const cellValue = row.cells[colIndex].querySelector('input').value;
            return cellValue !== '' ? parseFloat(cellValue) : null; // Solo incluir valores numéricos válidos
        }).filter(value => value !== null); // Ignorar valores nulos
        allData = allData.concat(columnData);
    }

    // Ordenar todos los datos en una sola lista de menor a mayor
    allData.sort((a, b) => a - b);

    return { sortedData: allData };
}

function displaySortedData(sortedData) {
    const sortedDataBody = document.getElementById('sortedDataBody');
    sortedDataBody.innerHTML = '';
    // Mostrar los datos ordenados en filas similares a la imagen proporcionada
    const columnsPerRow = 4; // Define cuántas columnas por fila se mostrarán
    let row;
    sortedData.forEach((value, index) => {
        if (index % columnsPerRow === 0) {
            row = document.createElement('tr');
            sortedDataBody.appendChild(row);
        }
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Asegurar que el botón de estadísticas esté correctamente vinculado
    const statsButton = document.querySelector('button[onclick="showStatisticsModal()"]');
    if (statsButton) {
        statsButton.addEventListener('click', showStatisticsModal);
    }
});
