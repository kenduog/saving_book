import express from "express";
import loginController from "../controller/loginController";
import accountController from "../controller/accountController";
import savingbookController from "../controller/savingBookController";

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
    savingbookController.getHomePage
  );

  // Login
  router.get("/login", loginController.getLoginPage);
  router.post("/login", loginController.postLoginPage);

  //Log out
  router.get(
    "/logout",
    (req, res, next) => {
      //Cookies that have not been signed
      if (req.cookies.tokenSVB != null) {
        next();
      } else {
        res.redirect("/login");
      }
    },
    loginController.getLogoutPage
  );

  // Register
  router.get("/register", accountController.getRegisterPage);
  router.post("/register", accountController.postRegisterPage);

  // Complete account
  router.get(
    "/complete-account",
    (req, res, next) => {
      //Cookies that have not been signed
      if (req.cookies.tokenSVB != null) {
        next();
      } else {
        res.redirect("/login");
      }
    },
    accountController.getCompleteAccountPage
  );
  router.post(
    "/complete-account/:userID",
    accountController.postCompleteAccountPage
  );

  //Welcome -- first input saving book
  router.post("/welcome", savingbookController.postCreateNewSavingBook);

  return app.use("/", router);
};
export default initWebRoute;
