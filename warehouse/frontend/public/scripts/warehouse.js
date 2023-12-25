const api = 'http://localhost:3000/api/v1/products';

async function getAllProductsInWarehouse() {
    try {
        const response = await fetch(api);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const products = await response.json();
        console.log('All products in the warehouse:', products);

        displayProductsInWarehouse(products);
    } catch (error) {
        console.error('Error fetching all products:', error);
    }
}

function displayProductsInWarehouse(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; 

    products.forEach(product => {
        const listItem = document.createElement('li');
        listItem.classList.add('product-container');

        const productInfo = document.createElement('div');
        productInfo.classList.add('product-info');

        const productCode = document.createElement('span');
        productCode.textContent = `Code: ${product.code}`;

        const productName = document.createElement('span');
        productName.textContent = `Name: ${product.name}`;
        const productDescription = document.createElement('span');
        productDescription.textContent = `Description: ${product.description}`;
        const productPrice = document.createElement('span');
        productPrice.textContent = `Price: $${product.price}`;
        const stockCount = document.createElement('span');
        stockCount.textContent = `Stock Count: ${product.countInStock}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteProduct(product._id);

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.onclick = () => updateProduct(product._id);

        productInfo.appendChild(productCode);
        productInfo.appendChild(productName);
        productInfo.appendChild(productDescription);
        productInfo.appendChild(productPrice);
        productInfo.appendChild(stockCount);
        productInfo.appendChild(deleteButton);
        productInfo.appendChild(updateButton);

        listItem.appendChild(productInfo);
        productList.appendChild(listItem);
    });
}

async function addProductToWarehouse() {
    let response; 
    try {
        const code = document.getElementById('code').value;
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = parseFloat(document.getElementById('price').value);
        const countInStock = parseInt(document.getElementById('countInStock').value);

        response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
                name,
                description,
                price,
                countInStock,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const newProduct = await response.json();
        console.log('Product added:', newProduct);
        resetForm(); 


    getAllProductsInWarehouse();
    } catch (error) {
        console.error('Error adding product:', error);

        if (response) {
            console.log('Server response:', await response.text());
        }
    }
}

async function deleteProduct(productId) {
    try {
        console.log('Deleting product with ID:', productId); // Log productId for debugging

        const response = await fetch(`${api}/${productId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        console.log(`Product with ID ${productId} deleted successfully.`);

        getAllProductsInWarehouse();
        resetForm(); 
    } catch (error) {
        console.error(`Error deleting product with ID ${productId}:`, error);
    }
}

async function updateProduct(productId) {
    try {

        const existingProductResponse = await fetch(`${api}/${productId}`);
        const existingProduct = await existingProductResponse.json();
        
        document.getElementById('code').value = existingProduct.code;
        document.getElementById('name').value = existingProduct.name;
        document.getElementById('description').value = existingProduct.description;
        document.getElementById('price').value = existingProduct.price;
        document.getElementById('countInStock').value = existingProduct.countInStock;

        const productIdInput = document.createElement('input');
        productIdInput.type = 'hidden';
        productIdInput.id = 'productId';
        productIdInput.value = productId;
        document.getElementById('productForm').appendChild(productIdInput);

        const addButton = document.querySelector('button');
        addButton.textContent = 'Update Product';
        addButton.onclick = () => submitUpdatedProduct();

    } catch (error) {
        console.error(`Error fetching product with ID ${productId} for update:`, error);
    }
}

async function submitUpdatedProduct() {
    try {
        const productId = document.getElementById('productId').value;
        const code = document.getElementById('code').value;
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = parseFloat(document.getElementById('price').value);
        const countInStock = parseInt(document.getElementById('countInStock').value);

        const response = await fetch(`${api}/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
                name,
                description,
                price,
                countInStock,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const updatedProduct = await response.json();
        console.log('Product updated:', updatedProduct);

        resetForm();
        getAllProductsInWarehouse();
    } catch (error) {
        console.error('Error updating product:', error);
    }
}

function resetForm() {
    document.getElementById('code').value = '';
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
    document.getElementById('countInStock').value = '';

    const productIdInput = document.getElementById('productId');
    if (productIdInput) {
        productIdInput.remove();
    }

    const addButton = document.querySelector('button');
    addButton.textContent = 'Add Product';
    addButton.onclick = () => addProductToWarehouse();
}


async function refreshData() {
    try {
        await getAllProductsInWarehouse();
        console.log('Data refreshed successfully!');
        resetForm();
    } catch (error) {
        console.error('Error refreshing data:', error);
    }
}

//getAllProductsInWarehouse();