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
        const accessToken = jwt.sign(objUserToken, process.env.TOKEN_SECRECT);
        console.log(accessToken);
        res.redirect("/");
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

module.exports = {
  getLoginPage,
  postLoginPage,
};
