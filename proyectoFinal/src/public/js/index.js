
document.addEventListener('DOMContentLoaded', () => {
    const createForm = document.getElementById('createForm');
    const validCategories = ['bolleria', 'galletas', 'panes', 'pasteles'];
    const cartButton = document.getElementById('cartButton');
    cartButton.addEventListener('click', async () => {
        try {
            console.log("HOLA")
            // Primero, obtén el cartId actual
            const cartResponse = await fetch(`/api/cart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const cartId = await cartResponse.json();
            // Redirige a la vista renderizada del carrito
            if (typeof cartId === 'string') {
                window.location.href = `/api/cart/${cartId}`;
            } else {
                console.error('No se pudo obtener el ID del carrito');
            }
        } catch (error) {
            console.error('Error al hacer clic en el carrito:', error);
        }
    });
    createForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const productId = document.getElementById('productId').value.trim();
        const description = document.getElementById('descriptionId').value.trim();
        const price = parseFloat(document.getElementById('priceId').value);
        const stock = parseInt(document.getElementById('stockId').value);
        const category = document.getElementById('categoryId').value.trim().toLowerCase();

        if (!validCategories.includes(category)) {
            alert('La categoría no es válida. Por favor, elija entre bolleria, galletas, panes o pasteles.');
            return;
        }

        const newProduct = {
            name: productId,
            description: description,
            price: price,
            quantity: stock,
            category: category
        };
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct)
            });

            if (response.ok) {
                alert('Producto creado exitosamente');
                createForm.reset();
            } else {
                alert('Error al crear el producto');
            }
        } catch (error) {
            console.error('Error al crear el producto:', error);
        }
    });

    const categoryButtons = document.querySelectorAll('button[data-category]');
    const sortButtons = document.querySelectorAll('button[data-sort]');
    const addToCartButtons = document.querySelectorAll('button[data-action="add-to-cart"]');

    categoryButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedCategory = event.target.innerText.toLowerCase();
            const urlParams = new URLSearchParams(window.location.search);

            if (selectedCategory === 'todos') {
                urlParams.delete('category');
            } else {
                urlParams.set('category', selectedCategory);
            }

            // Actualizar la URL con la categoría seleccionada
            window.location.search = urlParams.toString();
        });
    });

    sortButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedSort = event.target.getAttribute('data-sort');
            const urlParams = new URLSearchParams(window.location.search);

            if (selectedSort === 'default') {
                urlParams.delete('sort');
            } else {
                urlParams.set('sort', selectedSort);
            }
            window.location.search = urlParams.toString();
        });
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault(); // Prevenir la redirección

            const productId = event.target.getAttribute('data-product-id');
            const cartResponse = await fetch(`/api/cart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }); 
            const cartId = await cartResponse.json();
            console.log("CartIdFE", cartId);
            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: 1 }) // Asegúrate de enviar la cantidad
                });

                if (response.ok) {
                    alert('Producto agregado al carrito');

                    // Actualizar el contador de productos en el carrito
                    const cartCountElement = document.getElementById('cartCount');
                    const currentCount = parseInt(cartCountElement.innerText);
                    cartCountElement.innerText = currentCount + 1;
                } else {
                    alert('Error al agregar el producto al carrito');
                }
            } catch (error) {
                console.error('Error al agregar al carrito:', error);
            }
        });
    });

    // const removeFromCartButtons = document.querySelectorAll('button[data-action="remove-from-cart"]');
    //     const clearCartButton = document.getElementById('clear-cart');

    // // Eliminar un producto del carrito
    // removeFromCartButtons.forEach(button => {
    //     button.addEventListener('click', async (event) => {
    //         const productId = event.target.getAttribute('data-product-id');
    //         const userId = '{{userId}}'; // Cambia esto según la forma en que obtienes el userId

    //         try {
    //             const response = await fetch(`/api/carts/${userId}/products/${productId}`, {
    //                 method: 'DELETE'
    //             });

    //             if (response.ok) {
    //                 location.reload(); // Recargar la página para reflejar los cambios
    //             } else {
    //                 alert('Error al eliminar el producto del carrito');
    //             }
    //         } catch (error) {
    //             console.error('Error al eliminar del carrito:', error);
    //         }
    //     });
    // });

    // // Vaciar el carrito
    // clearCartButton.addEventListener('click', async () => {
    //     const userId = '{{userId}}'; // Cambia esto según la forma en que obtienes el userId

    //     try {
    //         const response = await fetch(`/api/carts/${userId}`, {
    //             method: 'DELETE'
    //         });

    //         if (response.ok) {
    //             location.reload(); // Recargar la página para reflejar los cambios
    //         } else {
    //             alert('Error al vaciar el carrito');
    //         }
    //     } catch (error) {
    //         console.error('Error al vaciar el carrito:', error);
    //     }
    // });

});
