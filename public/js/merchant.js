
var socket = io('http://localhost:3000/merchant');


$(function(){
    $(".js_add-product").on("click", function(){
        //$(".product-container border").append( $())
        socket.emit("addNewProduct", {
            name : document.getElementById('name').value,
            price: document.getElementById('price').value,
            inv: document.getElementById('inv').value
        });


        document.getElementById('name').value='';// clean fields after sending
        document.getElementById('price').value='';
        document.getElementById('inv').value='';

    });
});

$(function(){
    $(".js_remove-product").on("click", function(){
        var productName = $(this).closest('.product-container').find('input')[0].value; //костыль, если у товаров одинаковое имя то они все будут удалены(думаю надо какие-то id установить)
        console.log(productName);

        socket.emit("removeProduct", productName);

        // удалить контейнер с продуктом
        $(this).parent().parent().remove();
    });
});



socket.on("addedNewProduct", function(data){
    // Добавить контейнер с новым продуктом
var display = `<div class="product-container border"> 
					<div>
						<input value="${data.name}"  type="text"/>
					</div>
					<div>
						<span>Price:</span>
						<input value="${data.price}"  type="number"/>
					</div>
					<div>
						<span>inventory:</span>
						<input value="${data.inv}"  type="number"/>
					</div>
					<div class="product-buttons">
						<button class="js_update-product">Update</button>
						<button class="js_remove-product" <!--onclick='alert("Your item was removed!!!")-->'>Remove</button>
					</div>
				</div>` //передаем часть разметки которая будет добавляться,
   document.getElementsByClassName('adding')[0].innerHTML += display;
    $(function(){ //необходимо задать функцию для блока который будет добавлен
        $(".js_remove-product").on("click", function(){
            var productName = $(this).closest('.product-container').find('input')[0].value; //костыль, если у товаров одинаковое имя то они все будут удалены
            console.log(productName);


            socket.emit("removeProduct", productName);

            // удалить контейнер с продуктом
            $(this).parent().parent().remove();
            // необходимо найти ел-т в массиве и удалить его

            })

        });
    });



socket.on("orderPlaced", function(order){
    //console.log(order);

    $(".orders-container").append("<p> Total price "+order+"</p>");
});
