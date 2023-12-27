const express = require('express');
const helemt = require('helmet');
const ajv = require('ajv');
const booksRoute = require('./routes/Book')
const borrowerRoute = require('./routes/Borrower')
const logging = require('./middelware/logging')
const sequelize = require('./db');
const rateLimitMiddleware = require('./middelware/ratelimit');
const Book = require('./models/bookModel')
const swagger = require('swagger-ui-express')
const swaggerDodument = require('./swagger.json');

const app = express()

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*'); // '*' allows access from all origins
    next(); // Move to the next middleware/route handler
})

app.use("/api-docs",swagger.serve, swagger.setup(swaggerDodument))
//built in middelware
app.use(express.json()) //Parse Json sent by client througt requests body 
app.use(express.urlencoded({ extended: true }))

//3rd part midelware
app.use(helemt());

//custom middelware (Application-level moddelware)
app.use(logging);

const Port = process.env.Port || 3000;

app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`)
})

app.use("/api/borrower/exportOverdueBorrowsLastMonth",rateLimitMiddleware);
app.use("/api/borrower/generateBorrowingReport",rateLimitMiddleware )

app.use("/api/books",booksRoute);
app.use("/api/borrower",borrowerRoute);

