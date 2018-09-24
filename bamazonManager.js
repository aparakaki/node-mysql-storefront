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
    mainMenu();
});

function mainMenu() {
    inquirer.prompt([
        {
            type: "list",
            name: "userChoice",
            message: "Main Menu: ",
            choices: ["View Products on Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function(answer) {
        switch(answer.userChoice) {
            case "View Products on Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                addProduct();
                break;
        }
    })
}

function viewProducts() {
    connection.query("SELECT * FROM products", function(error, data) {
        let itemArray = [];
        for (let i = 0; i < data.length; i++) {
            // console.log(data[i].item_id + " " + data[i].product_name + " $" + data[i].price + " " + data[i].stock_quantity);
            let obj = {
                id: data[i].item_id,
                name: data[i].product_name,
                price: data[i].price,
                qty: data[i].stock_quantity
            }
            itemArray.push(obj);
        }
        var t = new table;
    
        itemArray.forEach(function(product) {
            t.cell('Item Id', product.id)
            t.cell('Product Name', product.name)
            t.cell('Product QTY', product.qty)
            t.newRow()
        });
        console.log(t.toString());

        returnPrompt();
    })
    
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(error, data) {
        for (let i = 0; i < data.length; i++) {
            console.log(data[i].item_id + " " + data[i].product_name + " " + data[i].stock_quantity);
        }
        returnPrompt();
    })
    
}

function addInventory() {
   connection.query("SELECT * FROM products", function(error, data) {     
        let itemArray = []; 
        for (let i = 0; i < data.length; i++) {
            itemArray.push (data[i].item_id + " " + data[i].product_name);
        }

        inquirer.prompt([
            {
                type: "list",
                name: "itemChoice",
                message: "Choose item to add inventory to",
                choices: itemArray
            },
            {
                type: "input",
                name: "quantity",
                message: "How many would you like to add?"
            }
        ]).then(function(answer) {
            let itemID = answer.itemChoice.split(" ")[0];
            connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [answer.quantity, itemID], function() {
                connection.query("SELECT * FROM products WHERE item_id = ?", itemID, function(error, data) {
                    console.log(data[0].item_id + " " + data[0].product_name + " UPDATED STOCK QTY: " + data[0].stock_quantity);
                    returnPrompt();
                }) 
            })
        })
    })
}

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "item",
            message: "Enter name of the product you would like to add"
        },
        {
            type: "input",
            name: "dept",
            message: "Enter product's departement"
        },
        {
            type: "input",
            name: "price",
            message: "Enter product's price"
        },
        {
            type: "input",
            name: "qty",
            message: "Enter product's quantity"
        }
    ]).then(function(answer) {
        connection.query("INSERT INTO products SET ?", 
        {
            product_name: answer.item, 
            department_name: answer.dept, 
            price: answer.price,
            stock_quantity: answer.qty
        }, function(error) {
            if(!error) {
                console.log("\r\nProduct entered: " + answer.item +
                            "\r\nProduct dept: " + answer.dept +
                            "\r\nProduct price: " + answer.price +
                            "\r\nProduct qty: " + answer.qty + "\r\n")
            }
            returnPrompt();
        })
    })
}

function returnPrompt() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "choice",
            message: "Return to Main Menu? "
        }
    ]).then(function(answer) {
        if(answer.choice) {
            mainMenu();
        }
        else{
            connection.end();
        }
    })
}