// Initial Setup
const gradeValues = {
    'A': 4.0, 'A-': 3.75, 'B+': 3.5, 'B': 3.0, 'B-': 2.75,
    'C+': 2.5, 'C': 2.0, 'C-': 1.75, 'D': 1.0, 'F': 0.0
};

function addCourseRow(data = {}) {
    const tbody = document.getElementById('course-list');
    const rowCount = tbody.rows.length + 1;
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${rowCount}</td>
        <td><input type="text" value="${data.code || ''}" placeholder="Code"></td>
        <td><input type="text" value="${data.title || ''}" placeholder="Title"></td>
        <td><input type="number" class="ects-input" value="${data.ects || 0}" min="0" oninput="calculateReport()"></td>
        <td>
            <select class="grade-select" onchange="calculateReport()">
                <option value="">-</option>
                ${Object.keys(gradeValues).map(g => `<option value="${g}" ${data.grade === g ? 'selected' : ''}>${g}</option>`).join('')}
            </select>
        </td>
        <td class="gp-cell">0</td>
        <td><button class="delete-btn" onclick="deleteRow(this)">X</button></td>
    `;
    tbody.appendChild(tr);
    calculateReport();
}

function deleteRow(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    renumberRows();
    calculateReport();
}

function renumberRows() {
    const tbody = document.getElementById('course-list');
    Array.from(tbody.rows).forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

function calculateReport() {
    const tbody = document.getElementById('course-list');
    let totalECTS = 0;
    let totalGP = 0;

    // Iterate Rows
    Array.from(tbody.rows).forEach(row => {
        const ects = parseFloat(row.querySelector('.ects-input').value) || 0;
        const grade = row.querySelector('.grade-select').value;
        const pointer = gradeValues[grade] !== undefined ? gradeValues[grade] : 0;

        const rowGP = ects * pointer;

        row.querySelector('.gp-cell').textContent = rowGP % 1 === 0 ? rowGP : rowGP.toFixed(2);

        totalECTS += ects;
        totalGP += rowGP;
    });

    // Get Previous Data
    const prevECTS = parseFloat(document.getElementById('prev-ects').value) || 0;
    const prevGP = parseFloat(document.getElementById('prev-gp').value) || 0;

    // Calculate Stats
    // Previous (Just derived from inputs to display stats)
    const prevSGPA = prevECTS > 0 ? prevGP / prevECTS : 0;
    document.getElementById('prev-sgpa').textContent = prevSGPA.toFixed(2);
    // CGPA/Status for previous only matters if we treat it as a past state, let's just calc CGPA
    document.getElementById('prev-cgpa').textContent = prevSGPA.toFixed(2);

    // Current Semester
    const currSGPA = totalECTS > 0 ? totalGP / totalECTS : 0;

    // Cumulative
    const cumECTS = prevECTS + totalECTS;
    const cumGP = prevGP + totalGP;
    const cumCGPA = cumECTS > 0 ? cumGP / cumECTS : 0;

    // Status Logic
    let status = 'Pass';
    if (currSGPA < 1.75) status = 'Warned';
    if (currSGPA < 1.5) status = 'Dismissed'; // Example logic

    // Update DOM
    document.getElementById('total-ects').textContent = totalECTS;
    document.getElementById('total-gp').textContent = totalGP % 1 === 0 ? totalGP : totalGP.toFixed(2);

    document.getElementById('curr-ects').textContent = totalECTS;
    document.getElementById('curr-gp').textContent = totalGP % 1 === 0 ? totalGP : totalGP.toFixed(2);
    document.getElementById('curr-sgpa').textContent = currSGPA.toFixed(2);
    document.getElementById('curr-calculate-cgpa').textContent = cumCGPA.toFixed(2);
    document.getElementById('curr-status').textContent = status;

    document.getElementById('cum-ects').textContent = cumECTS;
    document.getElementById('cum-gp').textContent = cumGP % 1 === 0 ? cumGP : cumGP.toFixed(2);
}

// Add listeners to Previous inputs
document.getElementById('prev-ects').addEventListener('input', calculateReport);
document.getElementById('prev-gp').addEventListener('input', calculateReport);

// Init with some default dummy rows to match image initially, or just empty
// Let's add the image data as initial state so it's not empty
const initialData = [
    { code: 'ITec-2051', title: 'Data structure and Algorithms', ects: 7, grade: 'C' },
    { code: 'ITec-2052', title: 'Object Oriented Programming', ects: 5, grade: 'F' },
    { code: 'ITec-2022', title: 'Operating Systems', ects: 7, grade: 'C-' },
    { code: 'ITec-2072', title: 'Advanced Database Systems', ects: 7, grade: 'D' },
    { code: 'ITec-2091', title: 'Fundamentals of Internet Programming', ects: 5, grade: 'C-' }
];

// Set initial Previous values from image
document.getElementById('prev-ects').value = 92;
document.getElementById('prev-gp').value = 182.5;

initialData.forEach(d => addCourseRow(d));
