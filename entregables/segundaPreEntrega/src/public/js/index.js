const socket = io()

socket.on('products', data => {

    let list = document.getElementById('listId')
    list.innerHTML = '';
    
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
            console.log("Todos los campos son necesarios");
        }
}

