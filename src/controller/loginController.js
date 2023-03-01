import pool from "../configs/connectDB";

let getLoginPage = (req, res) => {
  return res.render("login.ejs");
};
let postLoginPage = async (req, res) => {
  let { uPhone, uPassword } = req.body;
  let [objUser] = await pool.execute(
    "select phoneNumber,password,customerID from user_account where phoneNumber = ? and status = 1",
    [uPhone]
  );
  try {
    if (objUser[0].phoneNumber == uPhone) {
      if (objUser[0].password == uPassword) {
        res.redirect("/");
      } else {
        return res.send("Password is not correct");
      }
    } else {
      return res.send("User not exist");
    }
  } catch (error) {
    return res.redirect("/login");
  }
};

module.exports = {
  getLoginPage,
  postLoginPage,
};
