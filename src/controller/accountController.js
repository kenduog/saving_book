import pool from "../configs/connectDB";

let getRegisterPage = (req, res) => {
  return res.render("register.ejs", {
    message: req.flash("status"),
    status: "success",
  });
};
let postRegisterPage = async (req, res) => {
  // create account
  let { uPhone, uPassword, uConfirmPassword } = req.body;
  let [objUser] = await pool.execute(
    "select phoneNumber,password from user_account where phoneNumber = ? and status = 1",
    [uPhone]
  );
  if (objUser.length == 1) {
    req.flash("error", "User Already Exists");
    res.render("register.ejs", {
      message: req.flash("error"),
      status: "danger",
    });
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
      req.flash("success", "Sign Up Success");
      res.render("complete-account.ejs", {
        userID: userID[0].id,
        message: req.flash("success"),
        status: "success",
      });
    } else {
      req.flash("error", "Wrong Confirmation Password");
      res.render("register.ejs", {
        message: req.flash("error"),
        status: "warning",
      });
    }
  }
  return res;
};
let getCompleteAccountPage = (req, res) => {
  res.render("complete-account.ejs", {
    message: req.flash("status"),
    status: "success",
  });
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
    req.flash("error", error);
    res.render("login.ejs", {
      message: req.flash("error"),
      status: "danger",
    });
  }
  return res;
};

module.exports = {
  getRegisterPage,
  postRegisterPage,
  getCompleteAccountPage,
  postCompleteAccountPage,
};
