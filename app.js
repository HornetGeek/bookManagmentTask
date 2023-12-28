import express from "express";
import helemt from "helmet";
import swagger from "swagger-ui-express";

import booksRoute from "./routes/Book.js";
import borrowerRoute from "./routes/Borrower.js";
import { logging } from "./middelware/logging.js";
import swaggerDodument from "./swagger.json" assert { type: "json" };

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // '*' allows access from all origins
  next(); // Move to the next middleware/route handler
});

app.use("/api-docs", swagger.serve, swagger.setup(swaggerDodument));
//built in middelware
app.use(express.json()); //Parse Json sent by client througt requests body
app.use(express.urlencoded({ extended: true }));

//3rd part midelware
app.use(helemt());

//custom middelware (Application-level moddelware)
app.use(logging);

const Port = process.env.Port || 3000;

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});

app.use("/api/books", booksRoute);
app.use("/api/borrower", borrowerRoute);
