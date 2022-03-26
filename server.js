// create a new express server
import express from 'express';
import connectDb from './db/connect.js';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import expressListRoutes from 'express-list-routes';
import bodyParser from 'body-parser';

dotenv.config({ path: ".env" });

// connect to the database first
connectDb();

const app = express();
app.get("/", (req, res) => {
    res.send("API is running....");
});

const PORT = process.env.PORT || 3000;
app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);
// parse application/json since it's the body format of the API
app.use(bodyParser.json())

app.use("/api/v1/", routes);
// * Display all routes 
expressListRoutes(app);
