var mysql = require("mysql");
var inquirer = require("inquirer");
// var chalk = require("chalk");
var table = require("easy-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    displayItems();
});

function displayItems() {
    connection.query("SELECT * FROM products", function(error, data) {
        let itemInfo = [];
        for (let i = 0; i < data.length; i++) {
            // console.log(data[i].item_id + " " + data[i].product_name + " $" + data[i].price);
            let itemObj = {
                id: data[i].item_id,
                product: data[i].product_name,
                quantity: data[i].stock_quantity,
                price: data[i].price
            };
            itemInfo.push (itemObj);
        }
        var t = new table;
    
        itemInfo.forEach(function(product) {
            t.cell('item_id', product.id)
            t.cell('product_name', product.product)
            t.cell('price', product.price, table.number(2))
            t.newRow()
        });
        console.log(t.toString());

        customerChoice(itemInfo);
    })
    // connection.end();
}

function customerChoice(items) {
    // console.log(items);
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Enter number ID of item you would like to purchase? ",
        },
        {
            type: "input",
            name: "quantity",
            message: "How many would you like? "
        }
    ]). then(function(answer) {
        // console.log(answer.quantity);

        if(answer.quantity > items[answer.id-1].quantity) {
            console.log("\r\nInsufficient quantity in stock!\r\n");
            customerChoice(items);
        }
        else {
            buyItem(items, answer.quantity, answer.id)
        }
    })
    // connection.end();
}

function buyItem(items, quantity, id) {
    connection.query("UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = ? WHERE item_id = ?", [quantity, (quantity * items[id-1].price), id], function() {
        console.log("\r\nYou purchased " + quantity + " " + items[id-1].product +
                    "\r\nYour total is $" + quantity * items[id-1].price +
                    "\r\nThank you for your purchase.");
    })
    connection.end();
}


