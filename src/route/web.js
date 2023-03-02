import express from "express";
import homeController from "../controller/homeController";
import loginController from "../controller/loginController";
import accountController from "../controller/accountController";

let router = express.Router();
const initWebRoute = (app) => {
  router.get("/", homeController.getHomePage);

  // Login
  router.get("/login", loginController.getLoginPage);
  router.post("/login", loginController.postLoginPage);

  // Register
  router.get("/register", accountController.getRegisterPage);
  router.post("/register", accountController.postRegisterPage);

  // Complete account
  router.get("/complete-account", accountController.getCompleteAccountPage);
  router.post(
    "/complete-account/:userID",
    accountController.postCompleteAccountPage
  );

  return app.use("/", router);
};
export default initWebRoute;
