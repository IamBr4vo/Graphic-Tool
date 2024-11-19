let chart; // Variable global para el gráfico

function addRowBelow(button) {
    // Obtener la fila actual donde se hizo clic en "Añadir Fila"
    const currentRow = button.closest('tr');
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const newRow = document.createElement('tr');
    const columnCount = document.querySelector('#dataTable thead tr').cells.length - 1;

    // Crear las celdas de la nueva fila
    const labelCell = newRow.insertCell(0);
    labelCell.innerHTML = `<input type="text" class="form-control" placeholder="Etiqueta">`;

    for (let i = 1; i < columnCount; i++) {
        const cell = newRow.insertCell(i);
        cell.innerHTML = `<input type="number" class="form-control" placeholder="0">`;
    }

    const actionCell = newRow.insertCell(columnCount);
    actionCell.innerHTML = `
            <button class="btn btn-primary btn-lg btn-sm mx-1 btnBR" onclick="addRowBelow(this)">Añadir Fila</button>
            <button class="btn btn-danger btn-lg btn-sm mx-1 btnBR" onclick="deleteRow(this)">Eliminar Fila</button>
    `;

    // Insertar la nueva fila justo después de la fila actual
    currentRow.insertAdjacentElement('afterend', newRow);
}

function deleteRow(button) {
    const table = button.parentNode.parentNode.parentNode; // Obtén la tabla contenedora
    const rows = table.getElementsByTagName("tr"); // Obtén todas las filas de la tabla

    if (rows.length > 1) { // Verifica si hay más de una fila
        const row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);
    } else {
        alert("No se puede eliminar la última fila.");
    }
}

function deleteColumn() {
    const table = document.getElementById('dataTable');
    const headerRow = table.getElementsByTagName('thead')[0].rows[0];
    const bodyRows = table.getElementsByTagName('tbody')[0].rows;

    // Verifica si hay más de una columna para evitar eliminar todas
    if (headerRow.cells.length > 3) {
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
    newHeader.innerHTML = `<input type="text" class="form-control" placeholder="Atributo">`;
    headerRow.insertBefore(newHeader, headerRow.lastElementChild);

    // Añadir una nueva celda en cada fila de datos
    for (let i = 0; i < bodyRows.length; i++) {
        const newCell = bodyRows[i].insertCell(bodyRows[i].cells.length - 1);
        newCell.innerHTML = `<input type="number" class="form-control" placeholder="0">`;
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
                datasetData.push(parseFloat(value));
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
    const r = Math.floor(Math.random() * 100); // Evitar tonos muy oscuros (rango de 100-255)
    const g = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Paleta de colores en tonos fuertes
const customColors = [
    '#4CAF50', // Verde
    '#2196F3', // Azul
    '#F44336', // Rojo
    '#FFEB3B', // Amarillo
    '#FF9800', // Anaranjado
    '#9C27B0', // Morado
    '#8BC34A', // Verde claro
    '#3F51B5', // Azul oscuro
    '#FF5722', // Naranja oscuro
    '#00BCD4', // Cian
    '#CDDC39', // Verde lima
    '#673AB7', // Púrpura oscuro
    '#FFC107', // Ámbar
    '#E91E63', // Rosa
    '#795548', // Marrón
    '#009688', // Verde azulado
    '#607D8B', // Azul grisáceo
    '#FFCDD2', // Rosa claro
    '#D32F2F', // Rojo oscuro
    '#388E3C'  // Verde oscuro


];

// Función para generar colores brillantes y variados al azar
function generateBrightColors(count) {
    const colors = [];
    const usedColors = new Set(); // Usar un conjunto para evitar duplicados inmediatos

    for (let i = 0; i < count; i++) {
        let color;
        do {
            color = customColors[Math.floor(Math.random() * customColors.length)];
        } while (usedColors.has(color) && usedColors.size < customColors.length);

        colors.push(color);
        usedColors.add(color);

        // Reiniciar el conjunto si se usaron todos los colores disponibles
        if (usedColors.size === customColors.length) {
            usedColors.clear();
        }
    }
    return colors;
}

// Mostrar el campo de número de clases solo cuando se selecciona "Generar Distribución de Frecuencias"
function showClassCountInput() {
    const selectedAction = document.getElementById('actionSelect').value;
    const classCountInput = document.getElementById('classCount');

    if (selectedAction === "generateFrequencyDistribution") {
        classCountInput.style.display = 'inline-block';
    } else {
        classCountInput.style.display = 'none';
    }
}

function executeSelectedAction() {
    const selectedAction = document.getElementById('actionSelect').value;
    const classCountInput = document.getElementById('classCount');

    switch (selectedAction) {
        case "generateChart":
            showModal();
            break;
        case "generateStatistics":
            showStatisticsModal();
            break;
        case "exportTable":
            exportTableAsPNG();
            break;
        case "generateFrequencyDistribution":
            // Validar si el número de clases está ingresado
            const classCount = parseInt(classCountInput.value);
            if (isNaN(classCount) || classCount < 1) {
                alert("Por favor, ingresa un número válido de clases.");
                return;
            }

            // Actualizar el texto del encabezado con el número de clases ingresado
            document.getElementById('classCountDisplay').innerText = classCount;

            // Mostrar el modal combinado
            showCombinedModal();
            break;
        default:
            alert("Por favor, selecciona una acción válida.");
    }
}

function showModal() {
    // Verificar que al menos haya un atributo, una etiqueta y un valor
    const table = document.getElementById('dataTable');
    const headerInputs = Array.from(table.getElementsByTagName('thead')[0].rows[0].cells)
        .slice(1, -1) // Ignorar el primer y último th
        .map(th => th.querySelector('input').value.trim());

    const rows = table.getElementsByTagName('tbody')[0].rows;
    let hasLabel = false;
    let hasValue = false;

    // Verificar que haya al menos una etiqueta y un valor
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        const label = cells[0].querySelector('input').value.trim();
        if (label) {
            hasLabel = true;
        }
        for (let j = 1; j < cells.length - 1; j++) {
            const value = cells[j].querySelector('input').value.trim();
            if (value && !isNaN(value)) {
                hasValue = true;
                break;
            }
        }
        if (hasLabel && hasValue) {
            break;
        }
    }

    // Validación general
    if (headerInputs.every(attr => !attr) || !hasLabel || !hasValue) {
        alert("Necesitas ingresar mínimo un atributo, una etiqueta y un valor para poder graficar.");
        return;
    }

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

// Función principal para generar el gráfico
function generateChart(labels, datasets) {
    const chartType = getSelectedChartType();
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    const chartDescription = document.getElementById('chartDescription');
    const chartDescriptionOtherGraphics = document.getElementById('chartDescriptionOtherGraphics');

    if (!chartType) {
        alert("Por favor, selecciona un tipo de gráfico.");
        return;
    }

    // Ocultar ambos mensajes al comenzar
    chartDescription.style.display = 'none';
    chartDescriptionOtherGraphics.style.display = 'none';

    // Configura las descripciones según el tipo de gráfico
    if (chartType === 'pie') {
        chartDescription.style.display = 'block';
        chartDescription.innerText = 'Este gráfico muestra el promedio de los datos por atributo.';
    } else {
        chartDescriptionOtherGraphics.style.display = 'block';
        chartDescriptionOtherGraphics.innerText = 'Por favor, pon el cursor sobre el gráfico para ver los valores de manera detallada.';
    }

    if (chart) {
        chart.destroy();
    }

    // Obtener colores para cada conjunto de datos
    const colors = generateBrightColors(datasets.length);

    if (chartType === 'horizontalBarStacked') {
        // Gráfico de barras compuestas horizontales
        datasets = datasets.map((dataset, index) => ({
            ...dataset,
            backgroundColor: colors[index],
            borderColor: colors[index],
            borderWidth: 1
        }));

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                indexAxis: 'y', // Configura el gráfico en horizontal
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true,
                        stacked: true // Habilita las barras apiladas
                    },
                    y: {
                        stacked: true // Habilita las barras apiladas
                    }
                }
            }
        });
        chartDescription.style.display = 'none';
    } else if (chartType === 'pie') {
        // Gráfico circular
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
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
                        formatter: (value) => value.toFixed(2)
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
        chartDescription.style.display = 'block';
    } else if (chartType === 'boxplot') {
        // Gráfico de cajas (boxplot)
        const columnData = [];
        const bodyRows = document.getElementById('dataTable').getElementsByTagName('tbody')[0].rows;
        const columnCount = bodyRows[0].cells.length - 2;

        for (let j = 0; j < columnCount; j++) columnData[j] = [];
        for (let i = 0; i < bodyRows.length; i++) {
            const cells = bodyRows[i].cells;
            for (let j = 1; j <= columnCount; j++) {
                const value = cells[j].querySelector('input').value;
                if (value !== '' && !isNaN(value)) {
                    columnData[j - 1].push(parseFloat(value));
                }
            }
        }

        const boxPlotData = columnData.map((data, index) => {
            if (data.length === 0) return null;
            return {
                label: labels[index],
                min: Math.min(...data),
                q1: quantile(data, 0.25),
                median: quantile(data, 0.5),
                q3: quantile(data, 0.75),
                max: Math.max(...data)
            };
        }).filter(item => item !== null);

        chart = new Chart(ctx, {
            type: 'boxplot',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Diagrama de Cajas',
                    data: boxPlotData,
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1
                }]
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
    } else {
        // Otros tipos de gráficos (barras, líneas, etc.)
        chart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: datasets.map((dataset, index) => ({
                    ...dataset,
                    backgroundColor: colors[index],
                    borderColor: colors[index],
                    borderWidth: 1
                }))
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

    const textPadding = 20;
    const lineHeight = 25;
    const canvasWidth = canvas.width + 2 * textPadding;

    // Calcular líneas de texto para el título y la descripción
    ctx.font = "20px Arial";
    const titleLines = wrapText(ctx, title, canvasWidth - 2 * textPadding, lineHeight);
    ctx.font = "14px Arial";
    const subtitleLines = wrapText(ctx, subtitle, canvasWidth - 2 * textPadding, lineHeight);
    ctx.font = "12px Arial";
    const descriptionLines = wrapText(ctx, description, canvasWidth - 2 * textPadding, lineHeight);

    // Ajustar la altura del canvas basada en el número de líneas de texto y el gráfico
    const canvasHeight = lineHeight * (titleLines.length + subtitleLines.length + descriptionLines.length) + canvas.height + 4 * textPadding;

    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;

    // Añadir fondo blanco al canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);


    // Dibujar el título y el subtítulo en el canvas temporal
    ctx.fillStyle = "#000";
    let currentY = textPadding;
    ctx.font = "20px Arial";
    titleLines.forEach(line => {
        ctx.fillText(line, textPadding, currentY);
        currentY += lineHeight;
    });

    ctx.font = "14px Arial";
    subtitleLines.forEach(line => {
        ctx.fillText(line, textPadding, currentY);
        currentY += lineHeight;
    });

    // Dibujar la descripción
    ctx.font = "12px Arial";
    descriptionLines.forEach(line => {
        ctx.fillText(line, textPadding, currentY);
        currentY += lineHeight;
    });

    // Dibujar el gráfico debajo del texto
    ctx.drawImage(canvas, textPadding, currentY + textPadding);

    // Descargar la imagen como PNG
    const link = document.createElement('a');
    link.href = tempCanvas.toDataURL('image/png');
    link.download = 'grafico.png';
    link.click();
}

// Función para dividir texto largo en líneas
function wrapText(ctx, text, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    return lines;
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

    // Añadir fondo blanco al canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

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

function downloadStatisticsCombined() {
    const captureElement = document.getElementById('captureArea');

    html2canvas(captureElement, { scale: 2 }).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'estadisticas_completas.png';
        link.click();
    });
}

function exportTableAsPNG() {
    const title = document.getElementById('graphTitle').value;
    const subtitle = document.getElementById('graphSubtitle').value;
    const table = document.getElementById('dataTable');

    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    const canvasWidth = 800;
    const maxWidth = canvasWidth - 40;
    let canvasHeight = 200;
    const lines = wrapText(ctx, subtitle, maxWidth, 14);
    const extraHeight = lines.length * 30;
    const rows = table.getElementsByTagName('tr');
    canvasHeight += rows.length * 30;
    canvasHeight += extraHeight;

    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;

    // Establecer fondo blanco y el color deseado para las líneas de la tabla en el canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.strokeStyle = '#d1cfcf'; // Color de borde de las líneas de la tabla en la imagen

    // Configurar fuente y color del título
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(title, canvasWidth / 2, 30);

    // Dibujar la descripción centrada si está modificada
    ctx.font = "14px Arial";
    ctx.textAlign = "left"; // Volver al alineamiento izquierdo para la descripción
    let currentHeight = 60; // Altura inicial después del título
    for (const line of lines) {
        ctx.fillText(line, 10, currentHeight);
        currentHeight += 30;
    }

    // Dibujar la tabla en el canvas
    const startY = currentHeight + 20; // Punto de inicio para la tabla
    const rowHeight = 30; // Altura de cada fila
    const columnWidth = canvasWidth / (rows[0].cells.length - 1); // Ajustar a la cantidad de columnas

    let yPosition = startY;
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        for (let cellIndex = 0; cellIndex < row.cells.length - 1; cellIndex++) {
            const cell = row.cells[cellIndex];

            // Dibujar el fondo de color si es necesario para atributos y etiquetas
            if (rowIndex === 0 || cellIndex === 0) {
                ctx.fillStyle = "#d4edda";
                ctx.fillRect(cellIndex * columnWidth, yPosition, columnWidth, rowHeight);
                ctx.fillStyle = "#000"; // Cambiar a negro para el texto
                ctx.font = "bold 14px Arial"; // Negrita para los encabezados
            } else {
                ctx.fillStyle = "#000"; // Color estándar para el texto
                ctx.font = "14px Arial"; // Fuente estándar para el resto
            }

            // Dibujar el texto dentro de la celda
            const inputElement = cell.querySelector('input');
            const cellValue = inputElement ? inputElement.value : '';
            ctx.fillText(cellValue, cellIndex * columnWidth + 10, yPosition + 20);

            // Dibujar las líneas de las celdas con el color especificado
            ctx.strokeRect(cellIndex * columnWidth, yPosition, columnWidth, rowHeight);
        }
        yPosition += rowHeight;
    }

    // Descargar la imagen como PNG
    const link = document.createElement('a');
    link.href = tempCanvas.toDataURL('image/png');
    link.download = 'tabla_grafico.png';
    link.click();
}

// Función para dividir el texto en líneas ajustadas al ancho máximo
function wrapText(ctx, text, maxWidth, fontSize) {
    ctx.font = `${fontSize}px Arial`;
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    return lines;
}


function clearTableData() {
    // Confirmación antes de limpiar los datos
    const confirmClear = confirm("¿Estás seguro que quieres limpiar los datos de la tabla?");
    if (!confirmClear) {
        return; // Salir si el usuario cancela 
    }

    const table = document.getElementById('dataTable');

    // Limpiar entradas en el cuerpo de la tabla (etiquetas y valores)
    const bodyInputs = table.querySelectorAll('tbody input');
    bodyInputs.forEach(input => {
        input.value = '';
    });

    // Limpiar entradas en los encabezados de la tabla (atributos)                             
    const headerInputs = table.querySelectorAll('thead input');
    headerInputs.forEach(input => {
        input.value = '';
    });
}


// Función para verificar si la tabla ha sido modificada
function checkIfTableIsModified() {
    const table = document.getElementById('dataTable');
    const rows = table.getElementsByTagName('tbody')[0].rows;

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        for (let j = 0; j < cells.length - 1; j++) {
            const inputValue = cells[j].querySelector('input').value.trim();
            if (inputValue !== "" && inputValue !== "0") {
                return true;
            }
        }
    }
    return false;
}




function displayStatistics(data) {
    const validData = data.filter(value => !isNaN(value));

    if (validData.length === 0) {
        document.getElementById('mean').innerText = `Media: N/A`;
        document.getElementById('median').innerText = `Mediana: N/A`;
        document.getElementById('mode').innerText = `Moda: N/A`;
        document.getElementById('quartiles').innerText = `Cuartiles: N/A`;
        document.getElementById('meanDeviation').innerText = `Desviación Media: N/A`;
        document.getElementById('variance').innerText = `Varianza: N/A`;
        document.getElementById('stdDeviation').innerText = `Desviación Estándar: N/A`;
        document.getElementById('coefficientOfVariation').innerText = `Coeficiente de Variación: N/A`;
        return;
    }

    // Paso 1: Calcular la media, mediana y moda
    const meanValue = validData.reduce((acc, val) => acc + val, 0) / validData.length;
    const medianValue = quantile(validData, 0.5).toFixed(2);
    const modeValue = getMode(validData).toString();

    // Cuartiles
    const Q1 = quantile(validData, 0.25);
    const Q2 = quantile(validData, 0.5); // Mediana
    const Q3 = quantile(validData, 0.75);

    // Paso 2: Calcular desviaciones absolutas para la desviación media
    const absoluteDeviations = validData.map(val => Math.abs(val - meanValue));
    const sumOfAbsoluteDeviations = absoluteDeviations.reduce((acc, absDev) => acc + absDev, 0);
    const meanDeviation = (sumOfAbsoluteDeviations - meanValue) / validData.length;

    // Paso 3: Calcular las desviaciones al cuadrado para la varianza y desviación estándar
    const squaredDeviations = validData.map(val => Math.pow(val - meanValue, 2));
    const sumOfSquaredDeviations = truncateToTwoDecimals(squaredDeviations.reduce((acc, squaredDev) => acc + squaredDev, 0));

    // Paso 4: Calcular la varianza
    const variance = sumOfSquaredDeviations / (validData.length - 1);

    // Paso 5: Calcular la desviación estándar
    const stdDeviation = truncateToTwoDecimals(Math.sqrt(variance));

    // Paso 6: Calcular el coeficiente de variación
    const coefficientOfVariation =  truncateToTwoDecimals((stdDeviation / meanValue) * 100);

    // Mostrar los resultados en el HTML
    document.getElementById('mean').innerText = `Media: ${meanValue.toFixed(2)}`;
    document.getElementById('median').innerText = `Mediana: ${medianValue}`;
    document.getElementById('mode').innerText = `Moda: ${modeValue}`;
    document.getElementById('quartiles').innerText = `Cuartiles: Q1=${Q1.toFixed(2)}, Q2=${Q2.toFixed(2)}, Q3=${Q3.toFixed(2)}`;
    document.getElementById('meanDeviation').innerText = `Desviación Media: ${meanDeviation.toFixed(2)}`;
    document.getElementById('variance').innerText = `Varianza: ${variance}`;
    document.getElementById('stdDeviation').innerText = `Desviación Estándar: ${stdDeviation.toFixed(2)}`;
    document.getElementById('coefficientOfVariation').innerText = `Coeficiente de Variación: ${coefficientOfVariation.toFixed(2)}%`;
}

function generatePercentileFast() {
    const percentileInput = document.getElementById('percentileInputFast').value;
    const percentileResult = document.getElementById('percentileResultFast');

    if (!percentileInput || percentileInput < 0 || percentileInput > 100) {
        percentileResult.innerText = "Por favor, ingresa un percentil entre 0 y 100.";
        return;
    }

    const data = getDataFromTableFrecuency().sort((a, b) => a - b);
    const pos = (percentileInput / 100) * (data.length - 1);
    const base = Math.floor(pos);
    const rest = pos - base;

    let percentileValue;
    if (data[base + 1] !== undefined) {
        percentileValue = data[base] + rest * (data[base + 1] - data[base]);
    } else {
        percentileValue = data[base];
    }

    percentileResult.innerText = `= ${percentileValue.toFixed(2)}`;
}

function generatePercentile() {
    const percentileInput = document.getElementById('percentileInput').value;
    const percentileResult = document.getElementById('percentileResult');

    if (!percentileInput || percentileInput < 0 || percentileInput > 100) {
        percentileResult.innerText = "Por favor, ingresa un percentil entre 0 y 100.";
        return;
    }

    const data = getDataFromTableFrecuency().sort((a, b) => a - b);
    const pos = (percentileInput / 100) * (data.length - 1);
    const base = Math.floor(pos);
    const rest = pos - base;

    let percentileValue;
    if (data[base + 1] !== undefined) {
        percentileValue = data[base] + rest * (data[base + 1] - data[base]);
    } else {
        percentileValue = data[base];
    }

    percentileResult.innerText = `= ${percentileValue.toFixed(2)}`;
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

function calculateMeanDeviation(data, mean) {
    const absoluteDifferences = data.map(value => Math.abs(value - mean));
    const sumOfAbsoluteDifferences = absoluteDifferences.reduce((acc, val) => acc + val, 0);
    const meanDeviation = (sumOfAbsoluteDifferences - mean) / data.length;
    return truncateToTwoDecimals(meanDeviation);
}

function showStatisticsModal() {
    // Verificar que haya al menos dos valores numéricos válidos en la tabla
    const table = document.getElementById('dataTable');
    const rows = table.getElementsByTagName('tbody')[0].rows;
    let validDataCount = 0;

    // Contar los valores numéricos válidos
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        for (let j = 1; j < cells.length - 1; j++) { // Ignorar el primer y último columna si es necesario
            const value = cells[j].querySelector('input').value.trim();
            if (value && !isNaN(value)) {
                validDataCount++;
            }
            if (validDataCount >= 2) {
                break;
            }
        }
        if (validDataCount >= 2) {
            break;
        }
    }

    // Validación: requiere al menos dos datos válidos
    if (validDataCount < 2) {
        alert("Necesitas ingresar al menos dos datos numéricos para mostrar las estadísticas.");
        return; // Asegura que la ejecución se detenga aquí
    }

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

    // Definir cuántas columnas por fila se mostrarán
    const columnsPerRow = 10;
    let row = null;

    sortedData.forEach((value, index) => {
        // Crear una nueva fila si el índice es múltiplo de 'columnsPerRow'
        if (index % columnsPerRow === 0) {
            row = document.createElement('tr');
            sortedDataBody.appendChild(row);
        }

        // Crear y añadir celdas a la fila actual
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
    });
}

function displaySortedData(sortedData) {
    const sortedDataBody = document.getElementById('sortedDataBody');
    sortedDataBody.innerHTML = '';

    // Definir cuántas columnas por fila se mostrarán
    const columnsPerRow = 10;
    let row = null;

    sortedData.forEach((value, index) => {
        // Crear una nueva fila si el índice es múltiplo de 'columnsPerRow'
        if (index % columnsPerRow === 0) {
            row = document.createElement('tr');
            sortedDataBody.appendChild(row);
        }

        // Crear y añadir celdas a la fila actual
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
    });
}




function selectSingleChart(selectedCheckbox) {
    const checkboxes = document.querySelectorAll('.chart-option');
    checkboxes.forEach(checkbox => {
        if (checkbox !== selectedCheckbox) {
            checkbox.checked = false;
        }
    });
}

function getSelectedChartType() {
    const checkboxes = document.querySelectorAll('.chart-option');
    for (const checkbox of checkboxes) {
        if (checkbox.checked) {
            return checkbox.value;
        }
    }
    return null; // Si no hay ninguno seleccionado
}




function closeCombinedModal() {
    document.getElementById('combinedModal').style.display = 'none';
    document.getElementById('combinedModalOverlay').style.display = 'none';
}

function showCombinedModal() {
    // Verificar que haya al menos dos valores numéricos válidos en la tabla
    const table = document.getElementById('dataTable');
    const rows = table.getElementsByTagName('tbody')[0].rows;
    let validDataCount = 0;

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        for (let j = 1; j < cells.length - 1; j++) {
            const value = cells[j].querySelector('input').value.trim();
            if (value && !isNaN(value)) {
                validDataCount++;
            }
            if (validDataCount >= 2) {
                break;
            }
        }
        if (validDataCount >= 2) {
            break;
        }
    }

    if (validDataCount < 2) {
        alert("Necesitas ingresar al menos dos datos numéricos para mostrar las estadísticas.");
        return;
    }

    const { sortedData } = getSortedData();
    displaySortedDataCombined(sortedData);
    displayStatisticsCombined(sortedData.flat());

    const classCount = parseInt(document.getElementById('classCount').value);
    if (isNaN(classCount) || classCount < 1) {
        alert("Por favor, ingresa un número válido de clases.");
        return;
    }

    generateFrequencyTable(classCount);

    document.getElementById('combinedModal').style.display = 'block';
    document.getElementById('combinedModalOverlay').style.display = 'block';
}

function displaySortedDataCombined(sortedData) {
    const sortedDataBody = document.getElementById('sortedDataBodyCombined');
    sortedDataBody.innerHTML = '';

    // Definir cuántas columnas por fila se mostrarán
    const columnsPerRow = 10;
    let row = null;

    sortedData.forEach((value, index) => {
        // Crear una nueva fila si el índice es múltiplo de 'columnsPerRow'
        if (index % columnsPerRow === 0) {
            row = document.createElement('tr');
            sortedDataBody.appendChild(row);
        }

        // Crear y añadir celdas a la fila actual
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
    });
}

function displayStatisticsCombined(data) {
    const validData = data.filter(value => !isNaN(value));
    if (validData.length === 0) {
        document.getElementById('mean').innerText = `Media: N/A`;
        document.getElementById('median').innerText = `Mediana: N/A`;
        document.getElementById('mode').innerText = `Moda: N/A`;
        document.getElementById('quartiles').innerText = `Cuartiles: N/A`;
        return;
    }

    //const meanValue = (validData.reduce((acc, val) => acc + val, 0) / validData.length).toFixed(2);
    const medianValue = quantile(validData, 0.5).toFixed(2);
    const modeValue = getMode(validData).toString();

    const Q1 = quantile(validData, 0.25).toFixed(2);
    const Q2 = quantile(validData, 0.5).toFixed(2);
    const Q3 = quantile(validData, 0.75).toFixed(2);

    document.getElementById('medianFrec').innerText = `Mediana: ${medianValue}`;
    document.getElementById('modeFrec').innerText = `Moda: ${modeValue}`;
    document.getElementById('quartilesFrec').innerText = `Cuartiles: Q1=${Q1}, Q2=${Q2}, Q3=${Q3}`;

}


// Método simplificado para obtener todos los datos en una lista plana desde la tabla
function getDataFromTableFrecuency() {
    const data = [];
    const table = document.getElementById('dataTable');
    const rows = table.getElementsByTagName('tbody')[0].rows;

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        for (let j = 1; j < cells.length - 1; j++) { // Ignorar primera y última columna
            const value = cells[j].querySelector('input').value.trim();
            if (value && !isNaN(value)) {
                data.push(parseFloat(value));
            }
        }
    }
    return data;
}

function generateFrequencyTable(classCount) {
    const data = getDataFromTableFrecuency();
    const frequencyTableBody = document.getElementById('frequencyTableBody');
    frequencyTableBody.innerHTML = ''; // Limpiar la tabla anterior

    const min = Math.min(...data);
    const max = Math.max(...data);
    const amplitude = max - min;
    const intervalo = parseFloat((amplitude / classCount).toFixed(2));
    document.getElementById('amplitude').innerText = `Amplitud: ${amplitude.toFixed(2)}`;
    document.getElementById('intervalo').innerText = `Intervalo de Clase: ${intervalo.toFixed(2)}`;

    let cumulativeFrequencyLess = 0;
    let cumulativeRelativeLess = 0;
    let totalAbsoluteFrequency = 0;
    let totalRelativeFrequency = 0;

    // Variables para las sumatorias necesarias para calcular varianza y desviación estándar
    let sumXiFi = 0;
    let sumXiSquareFi = 0;

    const totalFrequency = data.length;
    let cumulativeFrequencyMore = totalFrequency;
    let cumulativeRelativeMore = 100;

    for (let i = 0; i < classCount; i++) {
        const lowerLimitIndicated = min + i * intervalo;
        const upperLimitIndicated = i === classCount - 1 ? max : lowerLimitIndicated + intervalo - 1;
        const lowerLimitReal = lowerLimitIndicated - 0.5;
        const upperLimitReal = upperLimitIndicated + 0.5;

        // Punto Medio (Xi)
        const midpoint = truncateToTwoDecimals((lowerLimitIndicated + upperLimitIndicated) / 2);

        // Frecuencia Absoluta (Fi)
        const absoluteFrequency = data.filter(value =>
            Math.floor(value) >= Math.floor(lowerLimitIndicated) && Math.floor(value) <= Math.floor(upperLimitIndicated)
        ).length;
        totalAbsoluteFrequency += absoluteFrequency;

        // Frecuencia Relativa (%)
        const relativeFrequency = (absoluteFrequency / totalFrequency) * 100;
        totalRelativeFrequency += relativeFrequency;

        // Acumulativos "menos de" y "más de" para Absoluta y Relativa
        cumulativeFrequencyLess += absoluteFrequency;
        cumulativeRelativeLess += relativeFrequency;
        const cumulativeFrequencyMoreRow = cumulativeFrequencyMore;
        const cumulativeRelativeMoreRow = cumulativeRelativeMore;
        cumulativeFrequencyMore -= absoluteFrequency;
        cumulativeRelativeMore -= relativeFrequency;

        // Sumatorias para varianza y desviación estándar
        sumXiFi += midpoint * absoluteFrequency;
        sumXiSquareFi += truncateToTwoDecimals(Math.pow(midpoint, 2)) * absoluteFrequency;

        // Agregar fila a la tabla
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${lowerLimitIndicated.toFixed(2)} - ${upperLimitIndicated.toFixed(2)}</td>
            <td>${lowerLimitReal.toFixed(2)} - ${upperLimitReal.toFixed(2)}</td>
            <td>${midpoint.toFixed(2)}</td>
            <td>${absoluteFrequency}</td>
            <td>${relativeFrequency.toFixed(2)}%</td>
            <td>${cumulativeFrequencyLess}</td>
            <td>${cumulativeRelativeLess.toFixed(2)}%</td>
            <td>${cumulativeFrequencyMoreRow}</td>
            <td>${cumulativeRelativeMoreRow.toFixed(2)}%</td>
        `;
        frequencyTableBody.appendChild(row);
    }

    // Cálculo de la media aritmética
    const validData = data.filter(value => !isNaN(value));
    const meanValue = (validData.reduce((acc, val) => acc + val, 0) / validData.length).toFixed(2);

    // Cálculo de la varianza
    const variance = (sumXiSquareFi - (Math.pow(sumXiFi, 2) / totalAbsoluteFrequency)) / (totalAbsoluteFrequency - 1);

    // Cálculo de la desviación estándar
    const stdDeviation = truncateToTwoDecimals(Math.sqrt(variance));

    // Cálculo del coeficiente de variación
    const coefficientOfVariation = (stdDeviation / meanValue) * 100;

    // Mostrar resultados de las estadísticas en el modal de distribución de frecuencias
    document.getElementById('meanFrec').innerText = `Media Aritmética: ${meanValue}`;
    document.getElementById('sumXiFi').innerText = `Sumatoria XiFi: ${sumXiFi.toFixed(2)}`;
    document.getElementById('sumXiSquareFi').innerText = `Sumatoria Xi^2Fi: ${sumXiSquareFi.toFixed(2)}`;
    document.getElementById('varianceFrec').innerText = `Varianza: ${variance}`;
    document.getElementById('stdDeviationFrec').innerText = `Desviación Estándar: ${stdDeviation.toFixed(2)}`;
    document.getElementById('coefficientOfVariationFrec').innerText = `Coeficiente de Variación: ${coefficientOfVariation.toFixed(2)}%`;

    // Agregar fila de totales a la tabla
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td colspan="1"><strong></strong></td>
        <td colspan="1"><strong></strong></td>
        <td colspan="1"><strong>Total</strong></td>
        <td><strong>${totalAbsoluteFrequency}</strong></td>
        <td><strong>${totalRelativeFrequency.toFixed(2)}%</strong></td>
        <td colspan="1"><strong></strong></td>
        <td colspan="1"><strong></strong></td>
        <td colspan="1"><strong></strong></td>
        <td colspan="1"><strong></strong></td>
    `;
    frequencyTableBody.appendChild(totalRow);
}


// Función para truncar a dos decimales sin redondear
function truncateToTwoDecimals(num) {
    return Math.floor(num * 100) / 100;
}