import pool from "../configs/connectDB";

let getRegisterPage = (req, res) => {
  return res.render("register.ejs");
};
let postRegisterPage = async (req, res) => {
  // create account
  let { uPhone, uPassword, uConfirmPassword } = req.body;
  let [objUser] = await pool.execute(
    "select phoneNumber,password from user_account where phoneNumber = ? and status = 1",
    [uPhone]
  );
  if (objUser.length == 1) {
    res.send("User already exists");
  } else {
    if (uPassword == uConfirmPassword) {
      //encode password
      let ePassword = Buffer.from(uPassword).toString("base64");
      await pool.execute(
        "insert into user_account(phoneNumber, password, status) values(?, ?, ?)",
        [uPhone, ePassword, 1]
      );
      let [userID] = await pool.execute(
        "select id from user_account where phoneNumber = ? and password = ? and status = 1",
        [uPhone, ePassword]
      );
      res.render("complete-account.ejs", { userID: userID[0].id });
    } else {
      res.send("Password is dont correct");
    }
  }
  return res;
};
let getCompleteAccountPage = (req, res) => {
  res.render("complete-account.ejs");
};
let postCompleteAccountPage = async (req, res) => {
  let userID = req.params.userID;
  let { uFirstName, uLastName, uBOD, uEmail } = req.body;
  try {
    await pool.execute(
      "UPDATE user_account set firstName = ?, lastName =?, BOD =?, email = ? where id = ?",
      [uFirstName, uLastName, uBOD, uEmail, userID]
    );
    res.redirect("/login");
  } catch (error) {
    res.redirect("/login");
  }
  return res;
};

module.exports = {
  getRegisterPage,
  postRegisterPage,
  getCompleteAccountPage,
  postCompleteAccountPage,
};
