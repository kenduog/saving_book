import pool from "../configs/connectDB";
import jwt from "jsonwebtoken";
require("dotenv").config();

let getHomePage = async (req, res) => {
  try {
    const tokenCookie = req.cookies.tokenSVB;
    const globalUser = jwt.verify(tokenCookie, process.env.TOKEN_SECRECT);
    let [checkSV] = await pool.execute(
      "select * from saving_money where userID = ?",
      [globalUser.id]
    );
    let [getUser] = await pool.execute(
      "select id,firstName,lastName,BOD,email,image from user_account where id = ?",
      [globalUser.id]
    );
    if (checkSV.length == 1) {
      return res.render("index.ejs");
    } else {
      return res.render("welcome.ejs", { getUser: getUser[0] });
    }
  } catch (error) {
    console.log(error);
    return res.render("login.ejs");
  }
};
module.exports = {
  getHomePage,
};
