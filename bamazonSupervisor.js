var mysql = require("mysql");
var inquirer = require("inquirer");
// var chalk = require("chalk");

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
    let query = "SELECT departments.department_id, departments.department_name, SUM(products.product_sales) AS product_sales,                           departments.over_head_costs, (departments.over_head_costs - SUM(products.product_sales)) AS total_profit ";
        query += "FROM departments INNER JOIN products ON departments.department_name = products.department_name "; 
        query += "GROUP BY departments.department_name;";

    connection.query(query, function(error, data) {
        console.log(data);
        connection.end();
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
        connection.query("INSERT INTO departmets SET ?", 
        {
            department_name: answer.name, 
            over_head_costs: answer.cost
        },
        function(error) {
            if(!error) {
                console.log("New Department Has Been Added!")
                connection.query("SELECT * FROM departments", function(){
                    connection.end();
                })
            }
        })  
    })
}