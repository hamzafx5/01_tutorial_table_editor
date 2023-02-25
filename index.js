window.$ = function (selector, selectAll = false) {
    if (selectAll) {
        return document.querySelectorAll(selector);
    }
    return document.querySelector(selector);
};

HTMLElement.prototype.on = function (event, callback) {
    this.addEventListener(event, callback);
};

window.selectedRow = null;
window.selectedColumn = null;
// make the table cell editable with the user double click on it
const cells = $(".table th, .table td", true);
const addColumnBtn = $(".add-column");
const addRowBtn = $(".add-row");
const deleteRowBtn = $("#delete-row");
const deleteColumnBtn = $("#delete-column");

cells.forEach((cell) => {
    // make the cells editable
    cell.contentEditable = "true";
    registerCellEvents(cell, cell.tagName.toLowerCase());
});

addColumnBtn.on("click", addColumn);
addRowBtn.on("click", addRow);
deleteRowBtn.on("click", deleteRow);
deleteColumnBtn.on("click", deleteColumn);

function addColumn() {
    // Add a cell on the table head
    $(".table thead tr").appendChild(createCell("th"));
    // And add a cell on each row
    $(".table tbody tr", true).forEach((row) => {
        row.appendChild(createCell("td"));
    });
}

function addRow() {
    const row = document.createElement("tr");
    $(".table thead tr th", true).forEach((_) => {
        row.append(createCell("td"));
    });
    $(".table tbody").appendChild(row);
}

function deleteRow(e) {
    if (window.selectedRow) {
        window.selectedRow.remove();
        deleteRowBtn.classList.remove("active");
    }
}

function deleteColumn(e) {
    if (!window.selectedColumn) return;
    deleteColumnBtn.classList.remove("active");
    let cellIndex = window.selectedColumn.cellIndex;
    window.selectedColumn.remove();
    $(".table tbody tr", true).forEach((row) => {
        row.children[cellIndex].remove();
    });
}

function createCell(type) {
    let cell_el = document.createElement(type);
    cell_el.contentEditable = "true";
    registerCellEvents(cell_el, type);
    return cell_el;
}

function registerCellEvents(cell, cellType) {
    if (cellType === "td") {
        cell.on("focus", handleCellFocus);
    }
    if (cellType === "th") {
        cell.on("focus", handleCellHeadFocus);
    }
}

function handleCellFocus(e) {
    let row = e.target.parentElement;
    window.selectedRow = row;
    deleteRowBtn.classList.add("active");
    deleteRowBtn.style.top = row.offsetTop + 6 + "px";
}

function handleCellHeadFocus(e) {
    let column = e.currentTarget;
    window.selectedColumn = column;
    deleteColumnBtn.classList.add("active");
    let y = column.offsetTop - deleteColumnBtn.clientHeight - 6 + "px";
    let x =
        column.offsetLeft +
        column.clientWidth / 2 -
        deleteColumnBtn.clientWidth / 2 +
        "px";
    deleteColumnBtn.style.top = y;
    deleteColumnBtn.style.left = x;
}
