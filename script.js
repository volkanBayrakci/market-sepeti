const productForm = document.getElementById('productForm');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const productQtyInput = document.getElementById('productQty');
const productTableBody = document.getElementById('productTableBody');
const grandTotalEl = document.getElementById('grandTotal');
const itemCountTextEl = document.getElementById('itemCountText');
const clearAllBtn = document.getElementById('clearAllBtn');
const emptyStateEl = document.getElementById('emptyState');

let cart = JSON.parse(localStorage.getItem('marketSepeti')) || [];


const formatCurrency = (amount) => {
    return amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
};


const saveAndRender = () => {
    localStorage.setItem('marketSepeti', JSON.stringify(cart));
    renderTable();
};

const renderTable = () => {
    productTableBody.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        emptyStateEl.style.display = 'block';
        clearAllBtn.style.display = 'none';
    } else {
        emptyStateEl.style.display = 'none';
        clearAllBtn.style.display = 'inline-block';

        cart.forEach((item) => {
            const subTotal = item.price * item.qty;
            total += subTotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="fw-medium">${item.name}</td>
                <td class="text-end text-muted">${formatCurrency(item.price)}</td>
                <td class="text-center"><span class="badge bg-secondary rounded-pill">${item.qty}</span></td>
                <td class="text-end fw-bold">${formatCurrency(subTotal)}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-light text-danger border" onclick="deleteProduct(${item.id})" title="Ürünü Sil">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </td>
            `;
            productTableBody.appendChild(tr);
        });
    }

    grandTotalEl.textContent = formatCurrency(total);
    itemCountTextEl.textContent = `Sepetinizde ${cart.length} Adet Ürün var`;
};

productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = productNameInput.value.trim();
    const price = parseFloat(productPriceInput.value);
    const qty = productQtyInput.value ? parseInt(productQtyInput.value) : 1;

    if (!name || isNaN(price) || price < 0 || qty < 1) return;

    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        qty: qty
    };

    cart.push(newProduct);
    saveAndRender();

    productForm.reset();
    productNameInput.focus();
});

window.deleteProduct = (id) => {
    cart = cart.filter(item => item.id !== id);
    saveAndRender();
};

clearAllBtn.addEventListener('click', () => {
    if (confirm('Tüm alışveriş listesini silmek istediğinize emin misiniz?')) {
        cart = [];
        saveAndRender();
    }
});

renderTable();