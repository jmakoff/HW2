var socket = io('http://localhost:3000');


socket.on("productAddedToBasket", function (data) {
    var $productLineItems = $('.product-line-items');
    $productLineItems.empty();

    $(".js_place-order").show();

    // Визуально добавить продукт в Basket
    var products = "";

    $.each(data.basket.productLineItems, function (i, item) {

        products += /*"<p>" + item.product.name + "</p>";*/`<p> ${item.product.name}</p>`

    });
    $productLineItems.prepend(products);

    console.log(data);
});

socket.on("orderPlaced", function (order) {
    $('.product-line-items').empty();
    $('.js_place-order').hide();

    alert('Order placed!\n\n Total price: ' + order);
})

socket.on("hi", function () {
    console.log("Customer is online");
})

socket.on("addedNewProduct", function (data) {
    // Добавить контейнер с новым доступным продуктом
    var newItem = `<div class="product-container border">
				<h2>${data.name}</h2>
				<div>
					<span>Price:</span>
					<span>${data.price}</span>
				</div>
				<button class="js_add-to-cart">Add to Cart</button>
			</div>`
    document.getElementsByClassName('left')[0].innerHTML+= newItem;

    console.log(data)
    console.log("New product is available");
})

socket.on("productRemoved", function (productName) {
    // Убрать неактуальный контейнер (продукта нету на складе)


    $.each($('.left').children('.product-container'), function (index) {
        /*console.log($(this).find('h2').text().length)*/
        if ($(this).find('h2').text() === productName) {
            $(this).remove();

        }
    })
    console.log('removed');
    console.log(productName);


})

$(function () {
    $(".js_add-to-cart").on("click", function () {
        socket.emit("addProduct", {
            productName: $(this).parent().find('h2').text()
        });
        console.log($(this).parent().find('h2').text())
    });
})

$(function () {
    $(".js_place-order").on("click", function () {
        var products = "";
        var counter = 1;
        $('div[class^="product-line-items"] p').each(function () {
            products += counter + ". " + $(this).text() + "\n";
            ++counter;
        });

        var confirmed = confirm('Place this order?\n\n' + products);

        if (confirmed)
            socket.emit("placeOrder");
    });
})
