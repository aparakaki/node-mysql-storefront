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
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function(answer) {
        switch(answer.userChoice) {
            case "View Product Sales by Department":
                salesByDepartment();
                break;
            
            case "Create New Department":
                newDepartment();
                break;
        }
    })
}

function salesByDepartment() {
    let query = "SELECT departments.department_id, departments.department_name, SUM(products.product_sales) AS product_sales,";
        query += "departments.over_head_costs, (SUM(products.product_sales) - departments.over_head_costs) AS total_profit ";
        query += "FROM departments INNER JOIN products ON departments.department_name = products.department_name "; 
        query += "GROUP BY departments.department_name;";

    connection.query(query, function(error, data) {
       displayTable(data);
        returnPrompt();
    })
};

function newDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter new department name:"
        },
        {
            type:"input",
            name: "cost",
            message: "Enter over head costs:"
        }
    ]).then(function(answer) {
        // console.log(answer);
        connection.query("INSERT INTO departments SET ?", 
        {
            department_name: answer.name, 
            over_head_costs: answer.cost
        },
        function(error) {
            if(!error) {
                console.log("\r\nNew Department Has Been Added!\r\n")
                connection.query("SELECT * FROM departments", function(error, data){
                    let deptArray = [];
                    for(let i = 0; i < data.length; i++) {
                        let obj= {
                            id: data[i].department_id,
                            name: data[i].department_name,
                            cost: data[i].over_head_costs
                        };
                        deptArray.push(obj);
                    }
                    
                    var t = new table
 
                    deptArray.forEach(function(product) {
                    t.cell('department_id', product.id)
                    t.cell('department_name', product.name)
                    t.cell('over_head_costs', product.cost)
                    t.newRow()
                    })
                    
                    console.log(t.toString())
                    returnPrompt();
                })
            }
        })  
    })
};

function displayTable(dataInfo) {
    var t = new table
 
    dataInfo.forEach(function(product) {
    t.cell('department_id', product.department_id)
    t.cell('department_name', product.department_name)
    t.cell('over_head_costs', product.over_head_costs)
    t.cell('products_sales', product.product_sales)
    t.cell('total_profit', product.total_profit)
    t.newRow()
    })
    
    console.log(t.toString())
};

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

