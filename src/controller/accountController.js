import pool from "../configs/connectDB";

let getRegisterPage = (req, res) => {
  return res.render("register.ejs");
};
let postRegisterPage = async (req, res) => {
  let { uPhone, uPassword, uConfirmPassword } = req.body;
  let [objUser] = await pool.execute(
    "select phoneNumber,password from user_account where phoneNumber = ? and status = 1",
    [uPhone]
  );
  if (objUser.length == 1) {
    res.send("User already exists");
  } else {
    if (uPassword == uConfirmPassword) {
      res.send("Register success HERE");
    } else {
      res.send("Password is dont correct");
    }
  }
  return res;
};

module.exports = {
  getRegisterPage,
  postRegisterPage,
};
