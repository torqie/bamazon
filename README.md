
# bamazon Node Store

This project contains 3 seperate javascript files that we can run. We have a file to be a customer, manager, and supervisor. Each file has differnt features.

## Customer
As the customer you will be able to look and buy items. As you buy items the stock goes down, and it shows you what you have purchased.


#### Demo
![enter image description here](screenshots/bamazonCustomer.gif)

Command To run: ` node bamazonCustomer.js `


## Manager
As a manager you can view the current stock, check for items that are low on stock, add stock to existing items, and add a new item.

#### Demo
![enter image description here](screenshots/bamazonManager.gif)

Command To run: ` node bamazonManager.js `

## Supervisor
As a supervisor you can view departments sales, overhead, and profit. The supervisor is also the only one allowed to create a new deptartment.

#### Demo
![enter image description here](screenshots/bamazonSupervisor.gif)

Command To run: ` node bamazonSupervisor.js `

## Installation
* Navigate to the folder where you want to clone the app then run the following command.

 git clone git@github.com:torqie/bamazon.git`

* This command will create a folder called bamazon and the project files will be within that folder. Lets go ahead and change into that directory now

` cd bamazon `

* Next we need to install the npm dependencies. Run the following command in the terminal.

` npm install `

* Now open up [mysql workbench](https://www.mysql.com/products/workbench/) or [sequelpro](https://www.sequelpro.com/) 
login to your mysql server and run the following query to create the database, tables, and add some data to the tables.

```
DROP DATABASE IF EXISTS bamazon;  
CREATE DATABASE bamazon;  
USE bamazon;  
  
CREATE TABLE products(  
  item_id INT AUTO_INCREMENT NOT NULL,  
  product_name VARCHAR(100) NOT NULL,  
  department_name VARCHAR(100) NOT NULL,  
  price DECIMAL(10,2) NOT NULL,  
  stock_quantity INT(10) NOT NULL,  
  product_sales DECIMAL(10,2) DEFAULT 0,  
 PRIMARY KEY (item_id)  
);  
  
INSERT INTO products (product_name, department_name, price, stock_quantity)  
VALUES  
  ("SanDisk 64GB Exteme SDXC", "Electronics", 16.41, 100),  
  ("NVIDIA Shield Android TV | 4K HDR", "Electronics", 149.99, 45),  
  ("Callaway Golf 2020 Hyperlite Zero Golf Bag", "Sporting Goods", 249.99, 2),  
  ("Affresh Dishwasher Cleaner", "Cleaning", 5.99, 200),  
  ("Optimum No Rinse Wash & Shine", "Automotive", 20.96, 200),  
  ("Meguiars All Purpose Cleaner 1 Gallon", "Automotive", 24.99, 10),  
  ("Adams Tire Armor", "Automotive", 21.24, 4),  
  ("Nintendo Switch", "Electronics", 299.00, 3),  
  ("2020 - American Silver Eagle Coin", "Collectibles", 29.95, 100),  
  ("Instant Pot Deo 7-in-1 Pressure Cooker", "Kitchen", 179.95, 4);  
  
  
CREATE TABLE departments(  
  department_id INT AUTO_INCREMENT NOT NULL,  
  department_name VARCHAR(100) NOT NULL,  
  over_head_costs DECIMAL(10,2) NOT NULL,  
 primary key(department_id)  
);  
  
  
INSERT INTO departments (department_name, over_head_costs)  
VALUES  
  ("Electronics", 200),  
  ("Sporting Goods", 100),  
  ("Cleaning", 10),  
  ("Automotive", 160),  
  ("Collectibles", 30),  
  ("Kitchen", 25);
```
* Great! That is all that is require for installation  for this node app.

## Technologies Used
* Javascript
* Mysql
* Node