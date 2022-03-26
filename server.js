// create a new express server
const express = require('express');
const colors = require("colors");
const connectDb = require("./db/connect");
const dotenv = require("dotenv");
const routes = require("./routes/routes");
const expressListRoutes = require('express-list-routes');

dotenv.config({ path: ".env" });

// connect to the database first
connectDb();

const app = express();
const bodyParser = require('body-parser');

app.get("/", (req, res) => {
    res.send("API is running....");
});

const PORT = process.env.PORT || 3000;
const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    )
);
// parse application/json since it's the body format of the API
app.use(bodyParser.json())

app.use("/api/v1/", routes);
// * Display all routes 
expressListRoutes(app);
