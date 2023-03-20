import pool from "../configs/connectDB";
import jwt from "jsonwebtoken";
require("dotenv").config();

let getLoginPage = (req, res) => {
  return res.render("login.ejs", {
    message: req.flash("status"),
    status: "success",
  });
};
let postLoginPage = async (req, res) => {
  if (req.body.completeAccount != undefined) {
    req.flash("warning", "Incomplete Account");
    res.render("login.ejs", {
      message: req.flash("warning"),
      status: "warning",
    });
  } else {
    let { uPhone, uPassword } = req.body;
    let [objUser] = await pool.execute(
      "select id,phoneNumber,password from user_account where phoneNumber = ? and status = 1",
      [uPhone]
    );
    try {
      if (objUser.length == 1) {
        //decode password
        let objPassword = Buffer.from(objUser[0].password, "base64").toString(
          "ascii"
        );
        if (objPassword == uPassword) {
          const objUserToken = {
            id: objUser[0].id,
            phone: objUser[0].phoneNumber,
          };
          let statusCookie = setCookies(req, res, objUserToken);
          if (statusCookie == "Success") {
            return res.redirect("/");
          } else {
            req.flash("warning", "Cookie Expires");
            return res.render("login.ejs", {
              message: req.flash("warning"),
              status: "warning",
            });
          }
        } else {
          req.flash("error", "Password Incorrect ");
          return res.render("login.ejs", {
            message: req.flash("error"),
            status: "danger",
          });
        }
      } else {
        req.flash("error", "User Not Exist ");
        return res.render("login.ejs", {
          message: req.flash("error"),
          status: "danger",
        });
      }
    } catch (error) {
      req.flash("error", error);
      return res.render("login.ejs", {
        message: req.flash("error"),
        status: "danger",
      });
    }
  }
};

let setCookies = (req, res, objUser) => {
  try {
    const accessToken = jwt.sign(objUser, process.env.TOKEN_SECRECT);
    // res.setHeader("set-cookie", `tokenSVB=${accessToken}`);
    res.cookie("tokenSVB", accessToken, {
      // Time max loign
      maxAge: 15 * 60 * 1000, // 15m
      //expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
      secure: true,
    });
    // .cookie("blog", "https://www.youtube.com/", {
    //   httpOnly: true,
    //   secure: true,
    // });
    return "Success";
  } catch (error) {
    console.log(error);
    return "Fail";
  }
};

let clearCookies = (req, res) => {
  try {
    //clear cookie
    res.clearCookie("tokenSVB");
    return "Success";
  } catch (error) {
    console.log(error);
    return "Fail";
  }
};
let getLogoutPage = (req, res) => {
  let status = clearCookies(req, res);
  if (status == "Success") {
    return res.redirect("/login");
  } else {
    return "Log out Fail";
  }
};
module.exports = {
  getLoginPage,
  postLoginPage,
  getLogoutPage,
};
