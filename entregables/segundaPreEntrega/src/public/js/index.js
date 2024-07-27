const socket = io()

socket.on('products', data => {

    let list = document.getElementById('listId')
    list.innerHTML = '';

    data.forEach(product => {
        const listItem = document.createElement('li');
        const button = document.createElement('button')
        listItem.textContent = `
        Producto: ${product.title} -
         Descripción: ${product.description} -
         Code: ${product.code.toUpperCase()} -
          Precio: ${product.price} -
          Status: ${product.status} -
          Stock: ${product.stock} -
          Category: ${product.category}`,

            button.textContent = 'Eliminar';
            button.classList.add('delete-button');
            button.setAttribute('data-id', product.id);

            listItem.appendChild(button);
            list.appendChild(listItem);
    });
})

const creatForm = document.getElementById('createForm')
const inputProduct = document.getElementById('productId');
const inputDescription = document.getElementById('descriptionId');
const inputCode = document.getElementById('codeId');
const inputPrice = document.getElementById('priceId')
const inputStock = document.getElementById('stockId');
const inputCategory = document.getElementById('categoryId');
const button = document.getElementById('sendButton')

creatForm.addEventListener('submit', (event) => {
    event.preventDefault()
    addProduct()
})

const addProduct = async () => {
    const product = inputProduct.value;
    const description = inputDescription.value;
    const code = inputCode.value;
    const price = inputPrice.value;
    const stock = inputStock.value;
    const category = inputCategory.value;

    if (product && description && code && price && stock && category) {
        let newProduct = {

            title: product,
            description: description,
            code: code,
            price: price,
            stock: stock,
            category: category
        }

        await fetch("http://localhost:8080/realtimeproducts", {
            method: "post",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                newProduct
            ),
        });

        creatForm.reset();

    } else {
        Swal.fire({
            title: "Bienvenido!",
            text: "Todos los campos son requeridos...",
            icon: "error",
            allowOutsideClick: false
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('listId');

    list.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-button')) {
            const productId = event.target.getAttribute('data-id');
            await deleteProduct(productId);
        }
    });
});

const deleteProduct = async (productId) => {
    await fetch(`http://localhost:8080/realtimeproducts/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

