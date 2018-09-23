CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    item_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER NOT NULL
)

