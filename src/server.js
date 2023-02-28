import express from "express";
import configViewEngine from "./configs/viewEngine";
import initWebRoute from "./route/web";

require("dotenv").config();
const app = express();
const port = process.env.PORT;

// setup view engine
configViewEngine(app);

// init web route
initWebRoute(app);

//handle 404 not found
// app.use((req, res) => {
//   return res.render("404.ejs");
// });

app.listen(port, () => {
  console.log(`Saving Book site: http://localhost:${port}`);
});
