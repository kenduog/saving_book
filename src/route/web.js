import express from "express";
import loginController from "../controller/loginController";
import accountController from "../controller/accountController";
import savingbookController from "../controller/savingBookController";
import multer from "multer";
import path from "path";
var appRoot = require("app-root-path");
let router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appRoot + "/src/public/img/save-avatar/");
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({ storage: storage });

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
  router.post(
    "/welcome",
    (req, res, next) => {
      //Cookies that have not been signed
      if (req.cookies.tokenSVB != null) {
        next();
      } else {
        res.redirect("/login");
      }
    },
    savingbookController.postCreateNewSavingBook
  );

  //Rule
  router.get(
    "/about",
    (req, res, next) => {
      //Cookies that have not been signed
      if (req.cookies.tokenSVB != null) {
        next();
      } else {
        res.redirect("/login");
      }
    },
    savingbookController.getAboutPage
  );

  //Edit 6 Jar
  router.get(
    "/add-money",
    (req, res, next) => {
      //Cookies that have not been signed
      if (req.cookies.tokenSVB != null) {
        next();
      } else {
        res.redirect("/login");
      }
    },
    savingbookController.getAddAny1In6Jar
  );
  router.post(
    "/add-money",
    (req, res, next) => {
      //Cookies that have not been signed
      if (req.cookies.tokenSVB != null) {
        next();
      } else {
        res.redirect("/login");
      }
    },
    savingbookController.postAddAny1In6Jar
  );
  // history
  router.get(
    "/history",
    (req, res, next) => {
      //Cookies that have not been signed
      if (req.cookies.tokenSVB != null) {
        next();
      } else {
        res.redirect("/login");
      }
    },
    savingbookController.getHistoryPage
  );

  // pay
  router.get(
    "/pay",
    (req, res, next) => {
      //Cookies that have not been signed
      if (req.cookies.tokenSVB != null) {
        next();
      } else {
        res.redirect("/login");
      }
    },
    savingbookController.getPayPage
  );
  router.post(
    "/pay",
    (req, res, next) => {
      //Cookies that have not been signed
      if (req.cookies.tokenSVB != null) {
        next();
      } else {
        res.redirect("/login");
      }
    },
    savingbookController.postPayPage
  );

  //profile
  router.get(
    "/profile",
    (req, res, next) => {
      //Cookies that have not been signed
      if (req.cookies.tokenSVB != null) {
        next();
      } else {
        res.redirect("/login");
      }
    },
    savingbookController.getProfile
  );
  router.post(
    "/profile",
    (req, res, next) => {
      //Cookies that have not been signed
      if (req.cookies.tokenSVB != null) {
        next();
      } else {
        res.redirect("/login");
      }
    },
    savingbookController.postProfile
  );
  //change password
  router.get(
    "/change-password",
    (req, res, next) => {
      //Cookies that have not been signed
      if (req.cookies.tokenSVB != null) {
        next();
      } else {
        res.redirect("/login");
      }
    },
    savingbookController.getChangePasswordPage
  );
  router.post(
    "/change-password",
    (req, res, next) => {
      //Cookies that have not been signed
      if (req.cookies.tokenSVB != null) {
        next();
      } else {
        res.redirect("/login");
      }
    },
    savingbookController.postChangePasswordPage
  );
  // Change avatar
  router.post(
    "/change-avatar",
    upload.single("profile_pic"),
    savingbookController.handleUploadAvatar
  );

  return app.use("/", router);
};
export default initWebRoute;
