const socket = io()

socket.on('products', data => {

    let list = document.getElementById('listId')

    data.forEach(product => {
        const listItem = document.createElement('li');
        listItem.textContent = `Producto: ${product.title} -
         Descripción: ${product.description} -
         Code: ${product.code} -
          Precio: ${product.price} -
          Status: ${product.status} -
          Stock: ${product.stock} -
          Category: ${product.category}`

        list.appendChild(listItem);
    });
})

const inputProduct = document.getElementById('productId');
const inputDescription = document.getElementById('descriptionId');
const inputPrice = document.getElementById('priceId')
const button = document.getElementById('sendButton')

const addProduct = () => {
    button.addEventListener('click', () => {
        const product = inputProduct.value;
        const description = inputDescription.value;
        const price = inputPrice.value;
        console.log(product);
        console.log(description);
        console.log(price);

        if (product && description && price) {
            let newProduct = {
                title: product,
                description: description,
                price: price
            }
            socket.emit('product', newProduct)

            inputProduct.value = '';
            inputDescription.value = '';
            inputPrice.value = '';
        } else {
            console.log("Todos los campos son necesarios");
        }

    })
}

addProduct()
