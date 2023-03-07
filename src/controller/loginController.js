import pool from "../configs/connectDB";
import jwt from "jsonwebtoken";
require("dotenv").config();

let getLoginPage = (req, res) => {
  return res.render("login.ejs");
};
let postLoginPage = async (req, res) => {
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
          return res.redirect("/login");
        }
      } else {
        return res.send("Password is not correct");
      }
    } else {
      return res.send("User not exist");
    }
  } catch (error) {
    return res.render("login.ejs");
  }
};

let setCookies = (req, res, objUser) => {
  try {
    const accessToken = jwt.sign(objUser, process.env.TOKEN_SECRECT);
    // res.setHeader("set-cookie", `tokenSVB=${accessToken}`);
    res.cookie("tokenSVB", accessToken, {
      // Time max loign
      maxAge: 10 * 1000, // 30s
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

let clearCookies = () => {
  try {
    //clear cookie
    res.clearCookie("tokenSVB");
    return "Success";
  } catch (error) {
    console.log(error);
    return "Fail";
  }
};

module.exports = {
  getLoginPage,
  postLoginPage,
};
