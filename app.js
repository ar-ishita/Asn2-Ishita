/*********************************************************************************	
*	ITE5315 – Assignment 2
*	I declare that this assignment is my own work in accordance with Humber Academic Policy.
*	No part of this assignment has been copied manually or electronically from any other source
*	(including web sites) or distributed to other students.
*
*	Name: ISHITA ARORA Student ID: N01543414 Date: 2023-11-03
*	
*	
******************************************************************************

**/

//importing modules
var express = require("express");
var path = require("path");
const exphbs = require("express-handlebars");

//assignment-01 code
const fs = require("fs");

//creating an express application
var app = express();

//defining the port
const port = process.env.port || 3000;

//using this custom handlers
const handlebars = require("handlebars");

// Register a custom Handlebars helper
handlebars.registerHelper("replaceBlank", function (value) {
  return value === " " ? "unknown" : value;
});

//this middleware serve static files located in "public" directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Variable to store the JSON data
let jsonData = [];

let jsonDataSales = [];

// Load the CarSales JSON data
const jsonPath = path.join(__dirname, "public", "CarSales.json");

// Load the Sales JSON data
const jsonPathSales = path.join(
  __dirname,
  "public",
  "ite5315-A1-supermarket_sales.json"
);

//checking if json file is available on the given path
fs.readFile(jsonPath, "utf8", (err, data) => {
  if (err) {
    console.error(err);
  } else {
    jsonData = JSON.parse(data);
  }
});

fs.readFile(jsonPathSales, "utf8", (err, data) => {
  if (err) {
    console.error(err);
  } else {
    jsonDataSales = JSON.parse(data);
  }
});

//configuring the view engine and handlebars
//this will render templates with the .hbs file extension

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

//getting all the content (header, content, footer)
app.get("/", function (req, res) {
  res.render("index", {
    title: "Express",
    jsonData: jsonData,
    //data: jsonData[2].InvoiceNo,
  });
});

// Define routes for Assignment 1
app.get("/data", (req, res) => {
  // Load the 'data' Handlebars view
  res.render("partials/data", { jsonData });
});

//fetching the car details on the basis on index
app.get("/data/invoiceNo/:index", (req, res) => {
  const index = parseInt(req.params.index); // Get the index from the URL parameter
  if (!isNaN(index) && index >= 0 && index < jsonData.length) {
    const selectedData = jsonData[index];
    res.render("partials/indexData", {
      title: "Invoice Number",
      indexDataInfo: selectedData,
    });
  } else {
    res.status(404).send("Invalid index");
  }
});

// Loading carsales data
app.get("/data", (req, res) => {
  // Load the 'data' Handlebars view
  res.render("partials/data", { jsonData });
});

// Define routes for Assignment 1
app.get("/alldata", (req, res) => {
  // Load the 'data' Handlebars view
  res.render("partials/alldata", { jsonDataSales });
});

// invoiceNo search form
app.get("/search/invoiceNo", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "searchInvoiceNo.html"));
});

//fetching car details on the basis of invoiceNo
app.post("/search/invoiceNo", (req, res) => {
  if (req.body.invoiceNo) {
    const searchedInvoiceNo = req.body.invoiceNo; //input from user
    //const finalInvoiceNo = addHypensInvoiceNo(searchedInvoiceNo); //adding hypens

    // Check if the searchedInvoiceNo contains hyphens
    const hasHyphens = searchedInvoiceNo.includes("-");

    // If it doesn't have hyphens, add hyphens
    const finalInvoiceNo = hasHyphens
      ? searchedInvoiceNo
      : addHypensInvoiceNo(searchedInvoiceNo);

    //finding if that invoiceNo is present in the jsondata
    const result = jsonData.find((item) => item.InvoiceNo === finalInvoiceNo);

    //if true it will render searchResult.hbs
    if (result) {
      // displaying all data
      res.render("partials/indexData", {
        title: "Search InvoiceNo",
        searchedInvoiceNo: req.body.invoiceNo,
        indexDataInfo: result,
      });
    } else {
      // error displayed
      res.send("<p>InvoiceNo not found.</p>");
    }
  } else {
    // Handle the case where invoiceID is missing in the request
    res.status(400).send("Missing invoiceNo in the request body");
  }
});

//if we want same header and footer
// invoiceNo search form
app.get("/search/invoiceNo/fullData", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "searchInvoiceNoFullData.html"));
});

//fetching car details on the basis of invoiceNo
app.post("/search/invoiceNo/fullData", (req, res) => {
  if (req.body.invoiceNo) {
    const searchedInvoiceNo = req.body.invoiceNo; //input from user
    //const finalInvoiceNo = addHypensInvoiceNo(searchedInvoiceNo); //adding hypens

    // Check if the searchedInvoiceNo contains hyphens
    const hasHyphens = searchedInvoiceNo.includes("-");

    // If it doesn't have hyphens, add hyphens
    const finalInvoiceNo = hasHyphens
      ? searchedInvoiceNo
      : addHypensInvoiceNo(searchedInvoiceNo);

    //finding if that invoiceNo is present in the jsondata
    const result = jsonData.find((item) => item.InvoiceNo === finalInvoiceNo);

    //if true it will render searchResult.hbs
    if (result) {
      // displaying all data
      res.render("dataFull", {
        title: "Search InvoiceNo",
        searchedInvoiceNo: req.body.invoiceNo,
        indexDataInfo: result,
      });
    } else {
      // error displayed
      res.send("<p>InvoiceNo not found.</p>");
    }
  } else {
    // Handle the case where invoiceID is missing in the request
    res.status(400).send("Missing invoiceNo in the request body");
  }
});

// Function to add hypens
function addHypensInvoiceNo(invoiceNo) {
  return `${invoiceNo.slice(0, 3)}-${invoiceNo.slice(3, 5)}-${invoiceNo.slice(
    5
  )}`;
}

// manufacturer search form
app.get("/search/Manufacturer", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "searchManufacturer.html"));
});

//fetching car details on the basis of Manufacturer
app.post("/search/Manufacturer", (req, res) => {
  if (req.body.Manufacturer) {
    //converting the input into lowercase
    const searchedManufacturer = req.body.Manufacturer.toLowerCase();

    // finding the record
    const result = jsonData.find(
      (item) => item.Manufacturer.toLowerCase() === searchedManufacturer
    );

    if (result) {
      // displaying the data
      res.render("partials/indexData", {
        title: "Search Manufacturer",
        searchedManufacturer: searchedManufacturer,
        indexDataInfo: result,
      });
    } else {
      // displaying an error
      res.send("<p>InvoiceNo not found.</p>");
    }
  } else {
    // Handle the case where invoiceID is missing in the request
    res.status(400).send("Missing invoiceNo in the request body");
  }
});

//this will give the records in which class is not blank
//using filter method
app.get("/dataFilter", (req, res) => {
  // Filter records where "class" is not blank
  const filteredData = jsonData.filter((item) => item.class.trim() !== "");

  res.render("partials/data", {
    title: "Car Sales Data",
    jsonData: filteredData,
  });
});

//this will give the records in which class is not blank by using #if
app.get("/dataClassFilter", (req, res) => {
  res.render("partials/dataClassFilter", { jsonData });
});

//in this the class is blank it will replace it with unknown
app.get("/dataClassBlank", (req, res) => {
  res.render("partials/dataClassBlank", {
    jsonData,
    helpers: {
      // Include the custom helper
      replaceBlank: function (value) {
        return value === "" ? "unknown" : value;
      },
    },
  });
});

//define a route for the root("/users")
//this will responds with the message
app.get("/users", function (req, res) {
  res.send("respond with a resource");
});

//define a catch-all route for other routes
//it renders the "error" view with an error message
app.get("*", function (req, res) {
  res.render("error", { title: "Error", message: "Wrong Route" });
});

//this will starts the express app
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
