const api = 'http://localhost:4000/api/v1/products';
let productsFetched = false;

function showProductList() {
    const productList = document.getElementById('productList');
    productList.style.display = 'block';
}

async function refreshProducts() {
    await getAllProductsInWebshop();
    console.log('Products refreshed successfully!');
}

async function getAllProductsInWebshop() {
    try {
        const response = await fetch(api);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const products = await response.json();
        console.log('All products in the web shop:', products);

        productsFetched = true;

        displayProductsInWebshop(products);
        showProductList(); 
    } catch (error) {
        console.error('Error fetching all products:', error);
    }
}

async function updateStockCount(productCode) {
    try {
        const response = await fetch(`${api}/${productCode}/update-stock-count-warehouse`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Stock count updated successfully:', result);
    } catch (error) {
        console.error('Error fetching or updating stock count:', error);
    }
}

function displayProductsInWebshop(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; 

    products.forEach(product => {

        const productContainer = document.createElement('div');
        productContainer.classList.add('product-container');

        productContainer.setAttribute('data-product-id', product._id);

        const productCode = document.createElement('div');
        productCode.classList.add('productCode'); 
        productCode.textContent = `Code: ${product.code}`;
        productContainer.appendChild(productCode);

        const productName = document.createElement('div');
        productName.classList.add('productName'); 
        productName.textContent = `Name: ${product.name}`;
        productContainer.appendChild(productName);

        const productDescription = document.createElement('div');
        productDescription.classList.add('productDescription'); 
        productDescription.textContent = `Description: ${product.description}`;
        productContainer.appendChild(productDescription);

        const productPrice = document.createElement('div');
        productPrice.classList.add('productPrice'); 
        productPrice.textContent = `Price: $${product.price}`;
        productContainer.appendChild(productPrice);

        const stockCount = document.createElement('div');
        stockCount.classList.add('countInStock'); 
        stockCount.textContent = `Stock Count: ${product.countInStock}`;
        productContainer.appendChild(stockCount);

        const updateStockButton = document.createElement('button');
        updateStockButton.textContent = 'Update Stock Count';
        updateStockButton.onclick = () => updateStockCount(product.code.toString());
        productContainer.appendChild(updateStockButton);

        productList.appendChild(productContainer);
    });
}

async function refreshProducts() {
    await getAllProductsInWebshop();
    console.log('Products refreshed successfully!');
}



async function deleteAllProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; 
}


async function triggerDataUpdate() {
    console.log('Before fetch request');

    try {
        const response = await fetch(`${api}/trigger-data-update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('After fetch request');

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const { success, message } = await response.json();

        if (success) {
            console.log(message);
        } else {
            console.error('Error triggering data update:', message);
        }
    } catch (error) {
        console.error('Error triggering data update:', error);
    }
}