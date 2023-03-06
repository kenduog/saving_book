import pool from "../configs/connectDB";

let getLoginPage = (req, res) => {
  return res.render("login.ejs");
};
let postLoginPage = async (req, res) => {
  let { uPhone, uPassword } = req.body;
  let [objUser] = await pool.execute(
    "select phoneNumber,password from user_account where phoneNumber = ? and status = 1",
    [uPhone]
  );
  try {
    if (objUser.length == 1) {
      //decode password
      let objPassword = Buffer.from(objUser[0].password, "base64").toString(
        "ascii"
      );
      if (objPassword == uPassword) {
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
