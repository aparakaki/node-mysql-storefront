# node-mysql-storefront

### Customer Page
* Run the bamazonCustomer.js file to access the customer page.
* To start the page will display all the items available with their corresponding ID, name, and price for each of them.
* The user will be prompted to input the ID # of the item they would like to purchase. 
* Then the user will be asked for the quantity of the item they would like to purchase.
* If the quantity requested is greater than the amount currently available, the program will show a message letting the user know of insufficient quantity. And asked the user again to enter the item id and quantity.
* If the quantity requested is within the current amount, the purchase will be completed, by notifying the user of the item bought as well as the total price of the item.

* video demo link: https://drive.google.com/file/d/1MV_NMSYVbnJ0xZBmQ5P_sL98JKmJS6Yz/view

### Manager Page
* Run the bamazonManager.js file to access the manager page.
* At the start of the program the "Main Menu" will be displayed witht the following options:
    - View Products on Sale - displays all the products current available along with their ID, name and qty.
    - View Low Inventory - displays all the items with stock quantity less than 5.
    - Add to Inventory - will ask user to select an item, the amount they would like to add, and will update the         inventory on the database.
    - Add New Product - will ask user for the name, dept, price and qty of the item they would like to add, and add      it to the database.
* After one of the above has been executed, the program will ask the user if they would like to go back to the main menu or quit the program by choosing yes (y) or no (n).

* video demo link: https://drive.google.com/file/d/1Tpu0GBWf5mAXf8ohh2NfO-CtiLkoS8fx/view

### Supervisor Page
* Run the bamazonSupervisor.js file to access the supervisor page.
* At the start of the program the "Main Menu" will be displayed witht the following options:
    - View Product Sales by Department - it will display the ID, name, over head cost, total sales and total profit     for each department.
    - Create New Department - it will prompt the user to enter the name, and over head cost of the new department       and add it to the database.

* video demo link: https://drive.google.com/file/d/1lXTHsUDcDRgGiYL4B4CeXuC7nIsotliV/view
