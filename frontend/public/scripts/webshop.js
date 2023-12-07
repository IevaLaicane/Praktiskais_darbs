const api = 'http://localhost:3000/api/v1/products';
let productsFetched = false; // Flag to track whether products have been fetched

function showProductList() {
    const productList = document.getElementById('productList');
    productList.style.display = 'block';
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

function displayProductsInWebshop(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; 

    products.forEach(product => {

        const productContainer = document.createElement('div');
        productContainer.classList.add('product-container');

        productContainer.setAttribute('data-product-id', product._id);

        const productName = document.createElement('div');
        productName.classList.add('productName'); // Add a class for styling
        productName.textContent = `Name: ${product.name}`;
        productContainer.appendChild(productName);

        const productDescription = document.createElement('div');
        productDescription.classList.add('productDescription'); // Add a class for styling
        productDescription.textContent = `Description: ${product.description}`;
        productContainer.appendChild(productDescription);

        const productPrice = document.createElement('div');
        productPrice.classList.add('productPrice'); // Add a class for styling
        productPrice.textContent = `Price: $${product.price}`;
        productContainer.appendChild(productPrice);

        const stockCount = document.createElement('div');
        stockCount.classList.add('countInStock'); // Add a class for styling
        stockCount.textContent = `Stock Count: ${product.countInStock}`;
        productContainer.appendChild(stockCount);

        const updateStockButton = document.createElement('button');
        updateStockButton.textContent = 'Update Stock Count';
        updateStockButton.onclick = () => updateStockCount(product); // Pass the entire product object
        productContainer.appendChild(updateStockButton);

        productList.appendChild(productContainer);
    });
}

async function deleteAllProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; 
}

async function refreshProducts() {

    await getAllProductsInWebshop();
    console.log('Products refreshed successfully!');
}

async function updateStockCount(product) {
    try {
        console.log(`Updating stock count for product ${product._id}`);
        
        const response = await fetch(`${api}/${product._id}/update-stock-count`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const { countInStock } = await response.json();
        console.log(`Received updated stock count for product ${product._id}: ${countInStock}`);

        const productContainer = document.querySelector(`.product-container[data-product-id="${product._id}"]`);
        
        if (productContainer) {
            const countElement = productContainer.querySelector('.countInStock');
            
            if (countElement) {
                countElement.textContent = `Stock Count: ${countInStock}`;
                console.log(`Updated UI for product ${product._id} with new stock count: ${countInStock}`);
            } else {
                console.log(`Count element not found for product ${product._id}`);
            }
        } else {
            console.log(`Product container not found for product ${product._id}`);
        }
    } catch (error) {
        console.error('Error fetching or updating stock count:', error);
    }
}
