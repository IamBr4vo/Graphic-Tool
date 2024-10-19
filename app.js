let chart; // Variable global para el gráfico

function addRow() {
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    const columnCount = tableBody.rows[0].cells.length - 1;

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
                const value = parseFloat(cells[j].querySelector('input').value);
                datasetData.push(isNaN(value) ? 0 : value);
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

    // Usar los valores de los atributos (primera fila de inputs) como etiquetas para el eje x
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

    if (chart) {
        chart.destroy();
    }

    if (chartType === 'boxplot') {
        const allValues = datasets.flatMap(ds => ds.data);
        const boxPlotData = [{
            min: Math.min(...allValues),
            q1: quantile(allValues, 0.25),
            median: quantile(allValues, 0.5),
            q3: quantile(allValues, 0.75),
            max: Math.max(...allValues)
        }];

        chart = new Chart(ctx, {
            type: 'boxplot',
            data: {
                labels: ['Datos'],
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
        // Usar solo el primer dataset para gráfico circular y diferentes colores para cada segmento
        chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: datasets[0].data,
                    backgroundColor: generateBrightColors(datasets[0].data.length), // Colores variados
                    borderColor: generateBrightColors(datasets[0].data.length), // Colores para borde
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
                    }
                }
            }
        });
    } else {
        chart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Mostrar estadísticas en el modal
    displayStatistics(datasets.flatMap(ds => ds.data));
}

function displayStatistics(data) {
    if (data.length === 0) {
        document.getElementById('mean').innerText = `Media: N/A`;
        document.getElementById('median').innerText = `Mediana: N/A`;
        document.getElementById('mode').innerText = `Moda: N/A`;
        return;
    }

    const meanValue = (data.reduce((acc, val) => acc + val, 0) / data.length).toFixed(2);
    const medianValue = quantile(data, 0.5).toFixed(2);
    const modeValue = getMode(data).toString();

    document.getElementById('mean').innerText = `Media: ${meanValue}`;
    document.getElementById('median').innerText = `Mediana: ${medianValue}`;
    document.getElementById('mode').innerText = `Moda: ${modeValue}`;
}

function quantile(arr, q) {
    const sorted = arr.slice().sort((a, b) => a - b);
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
    return modes.length === arr.length ? 'No hay moda' : modes;
}
