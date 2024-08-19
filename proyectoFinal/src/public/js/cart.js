document.addEventListener('DOMContentLoaded', () => {
    const removeFromCartButtons = document.querySelectorAll('button[data-action="remove-from-cart"]');
    removeFromCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();

            const productId = event.target.getAttribute('data-product-id');
            const cartResponse = await fetch(`/api/cart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const cartId = await cartResponse.json();

            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    alert('Producto eliminado del carrito');
                    // Aquí puedes actualizar la vista del carrito o eliminar el producto del DOM
                    event.target.closest('li').remove();
                } else {
                    alert('Error al eliminar el producto del carrito');
                }
            } catch (error) {
                console.error('Error al eliminar del carrito:', error);
            }
        });
    })

    const clearCartButton = document.getElementById('clear-cart');
    clearCartButton.addEventListener('click', async () => {
        const cartResponse = await fetch(`/api/cart`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const cartId = await cartResponse.json();

        try {
            const response = await fetch(`/api/carts/${cartId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert('Carrito vaciado');
                // Aquí puedes actualizar la vista del carrito o eliminar todos los productos del DOM
                document.querySelector('ul').innerHTML = '';
            } else {
                alert('Error al vaciar el carrito');
            }
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
        }
    });
})
