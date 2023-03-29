document.getElementById('product-form').addEventListener('submit', addProductHandler);

function addProductHandler(event) {
  event.preventDefault();

  const product = {
    number: document.getElementById('product-number').value,
    links: document.getElementById('marketplace-links').value,
    purchasePrice: parseFloat(document.getElementById('purchase-price').value) || 0,
    expectedValue: parseFloat(document.getElementById('expected-value').value) || 0,
    listings: document.getElementById('relevant-listings').value,
    salePrice: parseFloat(document.getElementById('sale-price').value) || 0,
    costs: parseFloat(document.getElementById('costs').value) || 0,
    dateAcquired: document.getElementById('date-acquired').value,
    dateSold: document.getElementById('date-sold').value
  };

  addProductToTable(product);

  // Clear the form input fields
  event.target.reset();
}

function updateTotalsRow() {
  const table = document.getElementById('product-table');
  let totalPurchasePrice = 0;
  let totalExpectedValue = 0;
  let totalSalePrice = 0;
  let totalCosts = 0;
  let totalProfits = 0;

  for (let i = 1; i < table.rows.length - 1; i++) {
    totalPurchasePrice += parseFloat(table.rows[i].cells[2].innerText) || 0;
    totalExpectedValue += parseFloat(table.rows[i].cells[3].innerText) || 0;
    totalSalePrice += parseFloat(table.rows[i].cells[5].innerText) || 0;
    totalCosts += parseFloat(table.rows[i].cells[6].innerText) || 0;
    totalProfits += parseFloat(table.rows[i].cells[7].innerText) || 0;
  }

  const totalsRow = document.getElementById('totals-row');
  totalsRow.cells[2].innerText = totalPurchasePrice.toFixed(2);
  totalsRow.cells[3].innerText = totalExpectedValue.toFixed(2);
  totalsRow.cells[5].innerText = totalSalePrice.toFixed(2);
  totalsRow.cells[6].innerText = totalCosts.toFixed(2);
  totalsRow.cells[7].innerText = totalProfits.toFixed(2);
}

function addProductToTable(product, shouldSave = true) {
  const table = document.getElementById('product-table');
  const row = table.insertRow(table.rows.length - 1);

  row.insertCell(0).innerText = product.number;
  row.insertCell(1).innerHTML = `<a href="${product.links}" target="_blank">Link</a>`;
  row.insertCell(2).innerText = product.purchasePrice.toFixed(2);
  row.insertCell(3).innerText = product.expectedValue.toFixed(2);
  row.insertCell(4).innerHTML = `<a href="${product.listings}" target="_blank">Link</a>`;
  row.insertCell(5).innerText = product.salePrice.toFixed(2);
  row.insertCell(6).innerText = product.costs.toFixed(2);

  const profit = product.salePrice - product.purchasePrice - product.costs;
  row.insertCell(7).innerText = profit.toFixed(2);
  row.insertCell(8).innerText = product.dateAcquired;
  row.insertCell(9).innerText = product.dateSold;

  const actionsCell = row.insertCell(10);
  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.className = 'delete-button';
  deleteButton.onclick = function() {
    table.deleteRow(row.rowIndex);
    if (shouldSave) {
      deleteProductFromLocal(product);
    }
    updateTotalsRow();
  }
  actionsCell.appendChild(deleteButton);

  const editButton = document.createElement('button');
  editButton.innerText = 'Edit';
  editButton.className = 'edit-button';
  editButton.onclick = function() {
    editProduct(row, product);
  };
  actionsCell.appendChild(editButton);

  // Move the newly added row before the totals row
  table.tBodies[0].insertBefore(row, table.tBodies[0].lastElementChild);
  if (shouldSave) {
    saveProductToLocal(product);
  }
  updateTotalsRow();
}

function deleteProductFromLocal(product) {
  const products = getProductsFromLocal();
  const index = products.findIndex(p => JSON.stringify(p) === JSON.stringify(product));
  if (index >= 0) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
  }
}

function saveProductToLocal(product) {
  const products = getProductsFromLocal();
  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));
}

function getProductsFromLocal() {
  const products = JSON.parse(localStorage.getItem('products'));
  return products ? products : [];
}

document.addEventListener('DOMContentLoaded', function() {
  const savedProducts = getProductsFromLocal();
  savedProducts.forEach(product => {
    // Pass false as the second argument to prevent re-saving the products to local storage
    addProductToTable(product, false);
  });
  updateTotalsRow();
});

function editProduct(row, product) {
  // Fill the form with the product data to edit
  document.getElementById('product-number').value = product.number;
  document.getElementById('marketplace-links').value = product.links;
  document.getElementById('purchase-price').value = product.purchasePrice;
  document.getElementById('expected-value').value = product.expectedValue;
  document.getElementById('relevant-listings').value = product.listings;
  document.getElementById('sale-price').value = product.salePrice;
  document.getElementById('costs').value = product.costs;
  document.getElementById('date-acquired').value = product.dateAcquired;
  document.getElementById('date-sold').value = product.dateSold;

  // Remove the product from the table and localStorage
  const table = document.getElementById('product-table');
  table.deleteRow(row.rowIndex);
  deleteProductFromLocal(product);

  // Change the "Add Product" button to "Update Product"
  const addProductButton = document.getElementById('add-product');
  addProductButton.innerText = 'Update Product';

  // Update the event listener for the form submission
  const form = document.getElementById('product-form');
  form.removeEventListener('submit', addProductHandler);
  form.addEventListener('submit', function updateProductHandler(event) {
    event.preventDefault();

    const updatedProduct = {
      number: document.getElementById('product-number').value,
      links: document.getElementById('marketplace-links').value,
      purchasePrice: parseFloat(document.getElementById('purchase-price').value) || 0,
      expectedValue: parseFloat(document.getElementById('expected-value').value) || 0,
      listings: document.getElementById('relevant-listings').value,
      salePrice: parseFloat(document.getElementById('sale-price').value) || 0,
      costs: parseFloat(document.getElementById('costs').value) || 0,
      dateAcquired: document.getElementById('date-acquired').value,
      dateSold: document.getElementById('date-sold').value
    };

    addProductToTable(updatedProduct);

    // Clear the form input fields
    event.target.reset();

    // Change the "Update Product" button back to "Add Product"
    addProductButton.innerText = 'Add Product';

    // Restore the original event listener for the form submission
    form.removeEventListener('submit', updateProductHandler);
    form.addEventListener('submit', addProductHandler);
  });
}
function clearLocalStorage() {
  localStorage.removeItem('products');
}

// You can call this function when you want to clear local storage, e.g. by clicking a button
document.getElementById('clear-local-storage').addEventListener('click', function() {
  // Clear local storage
  clearLocalStorage();

  // Remove all products from the table
  const table = document.getElementById('product-table');
  const rowCount = table.rows.length;
  for (let i = rowCount - 1; i > 0; i--) {
    table.deleteRow(i);
  }
});

