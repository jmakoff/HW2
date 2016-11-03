"use strict"
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    shop = require("./shop"),

    io = require("socket.io")(http);
var port = 3000;


app.use(express.static('public'));
app.set('view engine', 'ejs');


//Customer
app.get('/', function (req, res) {
    res.render("index", {
        products : shop.products
    });
});
io.on('connection', function (socket) {
    var basket = new shop.Basket();
    socket.join("customers");

    socket.on("addProduct", function(data) {
        var productName = data.productName,
            id=-1;

        for(var i=0;i<shop.products.length;i++)
            if(productName==shop.products[i].name)
                id=i;

        if(id==-1) return;

        basket.addProduct(id);

        socket.emit("productAddedToBasket", {
            success : true,
            basket : basket
        });
    });

    // "Слушаем" подтверждение заказа
    socket.on("placeOrder",function(){
        //var order=basket.placeOrder();
        //console.log(order);

        basket.placeOrder();
        var totalPrice=basket.getTotalPrice();

        socket.emit("orderPlaced",totalPrice);
        merchantIO.to("merchants").emit("orderPlaced",totalPrice); // отправляем заказ продавцу

        basket=new shop.Basket(); // создаем новую корзину для новых заказов
    })
});



//Merchant
var merchantIO = io.of('/merchant');
app.get('/merchant', function (req, res) {
    res.render("merchant", {
        products : shop.products,
        orders : shop.orders
    });
});

merchantIO.on("connection", function(socket) {

    io.to("customers").emit("hi");
    socket.join("merchants");

    socket.on("addNewProduct", function(data) {
            shop.products.push(data)


        socket.emit("addedNewProduct", data);
        io.to("customers").emit("addedNewProduct", data) // Уведомляем пользователей о новом продукте
    });

    socket.on("removeProduct", function(productName) {
        socket.emit('productRemoved');
        for (var i = 0; i < shop.products.length; i++) {
            if (shop.products[i].name === productName) {
                shop.products.splice(i, 1);
                console.log(productName);

            }
            io.to("customers").emit("productRemoved", productName)
        }


        /*var id=-1;

         for(var i=0;i<shop.products.length;i++)
         if(productName==shop.products[i].name)
         id=i;

         if(id==-1) return;

         shop.products.splice(id,1);

         io.to("customers").emit("productRemoved",productName)*/
    })
});

var server = http.listen(port, function(){
    console.log('server listening on '+ port+ ' port')
});