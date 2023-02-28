import express from "express";
import homeController from "../controller/homeController";
import loginController from "../controller/loginController";

let router = express.Router();
const initWebRoute = (app) => {
  router.get("/", homeController.getHomePage);

  router.get("/login", loginController.postLoginPage);
  return app.use("/", router);
};
export default initWebRoute;
