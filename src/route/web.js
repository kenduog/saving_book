import express from "express";
import homeController from "../controller/homeController";
import loginController from "../controller/loginController";
import accountController from "../controller/accountController";

let router = express.Router();
const initWebRoute = (app) => {
  router.get(
    "/",
    (req, res, next) => {
      //Cookies that have not been signed
      if (req.cookies.tokenSVB != null) {
        next();
      } else {
        res.redirect("/login");
      }
    },
    homeController.getHomePage
  );

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
    (req, res, next) => {
      //Cookies that have not been signed
      if (req.cookies.tokenSVB != null) {
        next();
      } else {
        res.redirect("/login");
      }
    },
    accountController.postCompleteAccountPage
  );

  return app.use("/", router);
};
export default initWebRoute;
