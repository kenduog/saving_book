import express from "express";
import cookieParser from "cookie-parser";
import configViewEngine from "./configs/viewEngine";
import initWebRoute from "./route/web";
import session from "express-session";
import flash from "connect-flash";

require("dotenv").config();
const app = express();
app.locals.moment = require("moment");
//use cookie
app.use(cookieParser());
const port = process.env.PORT;

// Use call value ejs throung controller
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup session
app.use(
  session({
    secret: "webslesson",
    cookie: { maxAge: 15 * 60 * 1000 },
    saveUninitialized: false,
    resave: false,
  })
);
//use flash
app.use(flash());

// setup view engine
configViewEngine(app);

// init web route
initWebRoute(app);

//handle 404 not found
app.use((req, res) => {
  return res.render("404.ejs");
});

app.listen(port, () => {
  console.log(`Saving Book site: http://localhost:${port}`);
});
