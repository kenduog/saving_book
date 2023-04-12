import pool from "../configs/connectDB";
import jwt from "jsonwebtoken";
import fs from "fs";
require("dotenv").config();
var generalInfo = [];
generalInfo.instagramName = process.env.YOUR_INSTAGRAM_NAME;
generalInfo.facebookID = process.env.YOUR_FACEBOOK_ID;
generalInfo.projectGithub = process.env.YOUR_PROJECT_GITHUB;
generalInfo.youtubeChannel = process.env.YOUR_YOUTUBE_CHANNEL;
generalInfo.glbUser = [];
generalInfo.glbListSavingBook = [];

let getHomePage = async (req, res) => {
  try {
    const tokenCookie = req.cookies.tokenSVB;
    const globalUser = jwt.verify(tokenCookie, process.env.TOKEN_SECRECT);
    let [checkSV] = await pool.execute(
      "select * from saving_money where userID = ? LIMIT 1",
      [globalUser.id]
    );
    generalInfo.glbUser = await getUserGbl(globalUser.id);
    if (checkSV.length == 1) {
      try {
        // add global List Saving Book
        generalInfo.glbListSavingBook = await getListSavingBook(globalUser.id);
        return res.render("index.ejs", {
          generalInfo: generalInfo,
          active: "/",
        });
      } catch (error) {
        req.flash("danger", error);
        return res.render("login.ejs", {
          message: req.flash("danger"),
          status: "danger",
        });
      }
    } else {
      return res.render("welcome.ejs", {
        getUser: generalInfo.glbUser,
        message: req.flash("status"),
        status: "success",
      });
    }
  } catch (error) {
    req.flash("danger", error);
    return res.render("login.ejs", {
      message: req.flash("danger"),
      status: "danger",
    });
  }
};
let postCreateNewSavingBook = async (req, res) => {
  try {
    let { userID, svMoney } = req.body;
    svMoney = parseInt(svMoney.split("VND")[0].replaceAll(",", ""));
    let nec = 0; //LỌ SỐ 1: CHI TIÊU CẦN THIẾT - NEC (55% THU NHẬP)
    let lts = 0; //LỌ SỐ 2: TIẾT KIỆM DÀI HẠN - LTS (10% THU NHẬP)
    let edu = 0; //LỌ SỐ 3: QUỸ GIÁO DỤC - EDU (10% THU NHẬP)
    let play = 0; //LỌ SỐ 4: HƯỞNG THỤ - PLAY (10% THU NHẬP)
    let ffa = 0; //LỌ SỐ 5: QUỸ TỰ DO TÀI CHÍNH - FFA (10% THU NHẬP)
    let give = 0; //LỌ SỐ 6: QUỸ TỪ THIỆN - GIVE (5% THU NHẬP)
    let createDate = new Date(Date.now());

    nec = (svMoney * 55) / 100;
    lts = (svMoney * 10) / 100;
    edu = (svMoney * 10) / 100;
    play = (svMoney * 10) / 100;
    ffa = (svMoney * 10) / 100;
    give = svMoney - (nec + lts + edu + play + ffa);
    //create in saving_money
    await pool.execute(
      "insert into saving_money(totalMoney,decNEC,decLTS,decEDU,decPLAY,decFFA,decGIVE,userID,createDate) values(?,?,?,?,?,?,?,?,?)",
      [svMoney, nec, lts, edu, play, ffa, give, userID, createDate]
    );
    if (svMoney > 0) {
      //create in income
      await pool.execute(
        "insert into income(totalMoney,decNEC,decLTS,decEDU,decPLAY,decFFA,decGIVE,type,userID,createDate) values(?,?,?,?,?,?,?,?,?,?)",
        [svMoney, nec, lts, edu, play, ffa, give, "income", userID, createDate]
      );
    }
    return res.redirect("/");
  } catch (error) {
    req.flash("danger", error);
    return res.render("login.ejs", {
      message: req.flash("danger"),
      status: "danger",
    });
  }
};
let currencyFormattingVND = (money) => {
  try {
    money = parseInt(money);
    money = money.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
    return money.replaceAll(",", ".");
  } catch (error) {
    console.log(error);
    return "0 VND";
  }
};
let FormatterCurrency = (num) => {
  let money;
  if (Math.abs(num) > 999999999) {
    money = Math.sign(num) * (Math.abs(num) / 1000000000).toFixed(2) + "B";
  } else {
    if (Math.abs(num) > 999999) {
      money = Math.sign(num) * (Math.abs(num) / 1000000).toFixed(2) + "M";
    } else {
      if (Math.abs(num) > 999) {
        money = Math.sign(num) * (Math.abs(num) / 1000).toFixed(2) + "K";
      } else {
        money = Math.sign(num) * Math.abs(num);
      }
    }
  }
  return money;
};

let getAboutPage = (req, res) => {
  return res.render("about.ejs", {
    generalInfo: generalInfo,
    active: "rule",
  });
};
//6 Jar
// Dấu phải = Comma
let convertInt32Comma = (money) => {
  return money.length > 0
    ? parseInt(money.split("VND")[0].replaceAll(",", ""))
    : 0;
};
let convertInt32Dot = (money) => {
  return money.length > 0
    ? parseInt(money.split("VND")[0].replaceAll(".", ""))
    : 0;
};
let getAddAny1In6Jar = (req, res) => {
  return res.render("income", {
    message: req.flash("status"),
    status: "success",
    generalInfo: generalInfo,
    IsShowAddMoney: false,
    ShowAddMoney: "",
    active: "add-money",
  });
};

let postAddAny1In6Jar = async (req, res) => {
  try {
    let { add_NEC, add_LTS, add_EDU, add_PLAY, add_FFA, add_GIVE, userID } =
      req.body;

    let showAdd = [];
    showAdd.NEC = add_NEC.length > 0 ? "+ " + add_NEC : "+ 0";
    showAdd.LTS = add_LTS.length > 0 ? "+ " + add_LTS : "+ 0";
    showAdd.EDU = add_EDU.length > 0 ? "+ " + add_EDU : "+ 0";
    showAdd.PLAY = add_PLAY.length > 0 ? "+ " + add_PLAY : "+ 0";
    showAdd.FFA = add_FFA.length > 0 ? "+ " + add_FFA : "+ 0";
    showAdd.GIVE = add_GIVE.length > 0 ? "+ " + add_GIVE : "+ 0";

    let intAdd = [];
    intAdd.NEC = convertInt32Comma(add_NEC);
    intAdd.LTS = convertInt32Comma(add_LTS);
    intAdd.EDU = convertInt32Comma(add_EDU);
    intAdd.PLAY = convertInt32Comma(add_PLAY);
    intAdd.FFA = convertInt32Comma(add_FFA);
    intAdd.GIVE = convertInt32Comma(add_GIVE);
    //sum Total
    let sumTotal =
      intAdd.NEC +
      intAdd.LTS +
      intAdd.EDU +
      intAdd.PLAY +
      intAdd.FFA +
      intAdd.GIVE;

    if (sumTotal > 0) {
      //Create income
      let createDate = new Date(Date.now());
      await pool.execute(
        "insert into income(totalMoney,decNEC,decLTS,decEDU,decPLAY,decFFA,decGIVE,type,userID,createDate) values(?,?,?,?,?,?,?,?,?,?)",
        [
          sumTotal,
          intAdd.NEC,
          intAdd.LTS,
          intAdd.EDU,
          intAdd.PLAY,
          intAdd.FFA,
          intAdd.GIVE,
          "income",
          userID,
          createDate,
        ]
      );

      // GET DB SAVING BOOK
      let listSavingBook = await getListSavingBook(userID);

      // Add money
      let sum = [];
      sum.NEC = intAdd.NEC + listSavingBook.intNEC;
      sum.LTS = intAdd.LTS + listSavingBook.intLTS;
      sum.EDU = intAdd.EDU + listSavingBook.intEDU;
      sum.PLAY = intAdd.PLAY + listSavingBook.intPLAY;
      sum.FFA = intAdd.FFA + listSavingBook.intFFA;
      sum.GIVE = intAdd.GIVE + listSavingBook.intGIVE;
      sum.totalMoney = sumTotal + listSavingBook.intTotal;
      await pool.execute(
        "UPDATE saving_money SET totalMoney = ?,decNEC = ?,decLTS = ?,decEDU = ?,decPLAY = ?,decFFA = ?,decGIVE = ? WHERE userID = ?",
        [
          sum.totalMoney,
          sum.NEC,
          sum.LTS,
          sum.EDU,
          sum.PLAY,
          sum.FFA,
          sum.GIVE,
          userID,
        ]
      );
      generalInfo.glbListSavingBook = await getListSavingBook(userID);
      req.flash("success", "Update Success");
      return res.render("income", {
        message: req.flash("success"),
        status: "success",
        generalInfo: generalInfo,
        IsShowAddMoney: true,
        ShowAddMoney: showAdd,
        active: "add-money",
      });
    } else {
      generalInfo.glbListSavingBook = await getListSavingBook(userID);
      req.flash("warning", "Please input value");
      return res.render("income", {
        message: req.flash("warning"),
        status: "warning",
        generalInfo: generalInfo,
        IsShowAddMoney: false,
        ShowAddMoney: "",
        active: "add-money",
      });
    }
  } catch (error) {
    req.flash("danger", error);
    return res.render("login.ejs", {
      message: req.flash("danger"),
      status: "danger",
    });
  }
};
let getListSavingBook = async (userID) => {
  await pool.execute(
    "update saving_money set totalMoney = (decNEC + decLTS + decEDU + decPLAY + decFFA + decGIVE)  where userID = ?",
    [userID]
  );
  let [listSavingBook] = await pool.execute(
    "select totalMoney ,decNEC, decLTS,decEDU, decPLAY, decFFA, decGIVE from saving_money where userID = ? LIMIT 1",
    [userID]
  );

  // string glb listSavingBook
  listSavingBook[0].totalMoneyStr = FormatterCurrency(
    listSavingBook[0].totalMoney
  );
  listSavingBook[0].decNECStr = FormatterCurrency(listSavingBook[0].decNEC);
  listSavingBook[0].decPLAYStr = FormatterCurrency(listSavingBook[0].decPLAY);

  // int glb listSavingBook
  listSavingBook[0].intTotal = parseInt(listSavingBook[0].totalMoney);

  listSavingBook[0].intNEC = parseInt(listSavingBook[0].decNEC);

  listSavingBook[0].intLTS = parseInt(listSavingBook[0].decLTS);

  listSavingBook[0].intEDU = parseInt(listSavingBook[0].decEDU);

  listSavingBook[0].intPLAY = parseInt(listSavingBook[0].decPLAY);

  listSavingBook[0].intFFA = parseInt(listSavingBook[0].decFFA);

  listSavingBook[0].intGIVE = parseInt(listSavingBook[0].decGIVE);

  // FormatterCurrency glb listSavingBook
  listSavingBook[0].totalMoneyStr = FormatterCurrency(
    listSavingBook[0].totalMoney
  );
  listSavingBook[0].decNECStr = FormatterCurrency(listSavingBook[0].decNEC);
  listSavingBook[0].decPLAYStr = FormatterCurrency(listSavingBook[0].decPLAY);
  listSavingBook[0].totalMoney = currencyFormattingVND(
    listSavingBook[0].totalMoney
  );
  listSavingBook[0].decNEC = currencyFormattingVND(listSavingBook[0].decNEC);
  listSavingBook[0].decLTS = currencyFormattingVND(listSavingBook[0].decLTS);
  listSavingBook[0].decEDU = currencyFormattingVND(listSavingBook[0].decEDU);
  listSavingBook[0].decPLAY = currencyFormattingVND(listSavingBook[0].decPLAY);
  listSavingBook[0].decFFA = currencyFormattingVND(listSavingBook[0].decFFA);
  listSavingBook[0].decGIVE = currencyFormattingVND(listSavingBook[0].decGIVE);
  // add global List Saving Book
  return listSavingBook[0];
};

let getHistoryPage = async (req, res) => {
  try {
    //How many posts we want to show on each page
    const resultsPerPage = process.env.NUMBER_PAGE_HISTORY;
    let [result] = await pool.execute("CALL getHistory(?,1,?)", [
      generalInfo.glbUser.id,
      resultsPerPage,
    ]);
    let numOfResults;
    try {
      numOfResults = result[0][0].totalPage;
    } catch (error) {
      numOfResults = 0;
    }
    let numberOfPages =
      Math.ceil(numOfResults / resultsPerPage) == 0
        ? 1
        : Math.ceil(numOfResults / resultsPerPage);
    let page = req.query.page ? Number(req.query.page) : 1;
    if (page > numberOfPages) {
      res.redirect("history?page=" + encodeURIComponent(numberOfPagess));
    } else if (page < 1) {
      res.redirect("history?page=" + encodeURIComponent("1"));
    }
    //Determine the SQL LIMIT starting number
    const startingLimit = (page - 1) * resultsPerPage;
    //Get the relevant number of POSTS for this starting page
    [result] = await pool.execute("CALL getHistory(?,?,?)", [
      generalInfo.glbUser.id,
      startingLimit,
      resultsPerPage,
    ]);
    let iterator = page - 5 < 1 ? 1 : page - 5;
    let endingLink =
      iterator + 9 <= numberOfPages
        ? iterator + 9
        : page + (numberOfPages - page);
    if (endingLink < page + 4) {
      iterator -= page + 4 - numberOfPages;
    }
    return res.render("history.ejs", {
      message: req.flash("status"),
      status: "success",
      generalInfo: generalInfo,
      listSavingBookHistory: result[0],
      active: "history",
      page,
      iterator,
      endingLink,
      numberOfPages,
    });
  } catch (error) {
    req.flash("danger", error);
    return res.render("login.ejs", {
      message: req.flash("danger"),
      status: "danger",
    });
  }
};

let getPayPage = async (req, res) => {
  return res.render("pay.ejs", {
    message: req.flash("status"),
    status: "success",
    generalInfo: generalInfo,
    IsShowAddMoney: false,
    ShowAddMoney: "",
    active: "pay",
  });
};
let getUserGbl = async (userID) => {
  let [getUser] = await pool.execute(
    "select id,firstName,lastName,BOD,email,phoneNumber,image from user_account where id = ?",
    [userID]
  );
  // add global user
  return getUser[0];
};

let postPayPage = async (req, res) => {
  try {
    let {
      minus_NEC,
      minus_LTS,
      minus_EDU,
      minus_PLAY,
      minus_FFA,
      minus_GIVE,
      userID,
    } = req.body;

    let showAdd = [];
    showAdd.NEC = minus_NEC.length > 0 ? "- " + minus_NEC : "- 0";
    showAdd.LTS = minus_LTS.length > 0 ? "- " + minus_LTS : "- 0";
    showAdd.EDU = minus_EDU.length > 0 ? "- " + minus_EDU : "- 0";
    showAdd.PLAY = minus_PLAY.length > 0 ? "- " + minus_PLAY : "- 0";
    showAdd.FFA = minus_FFA.length > 0 ? "- " + minus_FFA : "- 0";
    showAdd.GIVE = minus_GIVE.length > 0 ? "- " + minus_GIVE : "- 0";

    let intAdd = [];
    intAdd.NEC = -convertInt32Comma(minus_NEC);
    intAdd.LTS = -convertInt32Comma(minus_LTS);
    intAdd.EDU = -convertInt32Comma(minus_EDU);
    intAdd.PLAY = -convertInt32Comma(minus_PLAY);
    intAdd.FFA = -convertInt32Comma(minus_FFA);
    intAdd.GIVE = -convertInt32Comma(minus_GIVE);
    //sum Total
    let sumTotal =
      intAdd.NEC +
      intAdd.LTS +
      intAdd.EDU +
      intAdd.PLAY +
      intAdd.FFA +
      intAdd.GIVE;

    if (sumTotal != 0) {
      //Create income
      let createDate = new Date();
      await pool.execute(
        "insert into pay(totalMoney,decNEC,decLTS,decEDU,decPLAY,decFFA,decGIVE,type,userID,createDate) values(?,?,?,?,?,?,?,?,?,?)",
        [
          sumTotal,
          intAdd.NEC,
          intAdd.LTS,
          intAdd.EDU,
          intAdd.PLAY,
          intAdd.FFA,
          intAdd.GIVE,
          "pay",
          userID,
          createDate,
        ]
      );
      // GET DB SAVING BOOK
      let listSavingBook = await getListSavingBook(userID);
      // Add money
      let sum = [];
      sum.NEC = intAdd.NEC + listSavingBook.intNEC;
      sum.LTS = intAdd.LTS + listSavingBook.intLTS;
      sum.EDU = intAdd.EDU + listSavingBook.intEDU;
      sum.PLAY = intAdd.PLAY + listSavingBook.intPLAY;
      sum.FFA = intAdd.FFA + listSavingBook.intFFA;
      sum.GIVE = intAdd.GIVE + listSavingBook.intGIVE;
      sum.totalMoney = sumTotal + listSavingBook.intTotal;
      if (
        sum.NEC < 0 ||
        sum.LTS < 0 ||
        sum.EDU < 0 ||
        sum.PLAY < 0 ||
        sum.FFA < 0 ||
        sum.GIVE < 0
      ) {
        generalInfo.glbListSavingBook = await getListSavingBook(userID);
        req.flash("warning", "Money don't enough");
        return res.render("pay", {
          message: req.flash("warning"),
          status: "warning",
          generalInfo: generalInfo,
          IsShowAddMoney: false,
          ShowAddMoney: "",
          active: "pay",
        });
      } else {
        await pool.execute(
          "UPDATE saving_money SET totalMoney = ?,decNEC = ?,decLTS = ?,decEDU = ?,decPLAY = ?,decFFA = ?,decGIVE = ? WHERE userID = ?",
          [
            sum.totalMoney,
            sum.NEC,
            sum.LTS,
            sum.EDU,
            sum.PLAY,
            sum.FFA,
            sum.GIVE,
            userID,
          ]
        );
        generalInfo.glbListSavingBook = await getListSavingBook(userID);
        req.flash("success", "Update Success");
        return res.render("pay", {
          message: req.flash("success"),
          status: "success",
          generalInfo: generalInfo,
          IsShowAddMoney: true,
          ShowAddMoney: showAdd,
          active: "pay",
        });
      }
    } else {
      generalInfo.glbListSavingBook = await getListSavingBook(userID);
      req.flash("warning", "Please input value");
      return res.render("pay", {
        message: req.flash("warning"),
        status: "warning",
        generalInfo: generalInfo,
        IsShowAddMoney: false,
        ShowAddMoney: "",
        active: "pay",
      });
    }
  } catch (error) {
    req.flash("danger", error);
    return res.render("login.ejs", {
      message: req.flash("danger"),
      status: "danger",
    });
  }
};
let getProfile = (req, res) => {
  return res.render("profile.ejs", {
    message: req.flash("status"),
    status: "success",
    generalInfo: generalInfo,
    active: "profile",
  });
};
let postProfile = async (req, res) => {
  let { uPhone, uFirstName, uLastName, uBOD, uEmail } = req.body;
  if (uFirstName.length > 0) {
    if (uLastName.length > 0) {
      if (uEmail.length > 0) {
        try {
          await pool.execute(
            "UPDATE user_account SET firstName = ?, lastName = ?, BOD = ?, email = ? WHERE id = ?",
            [uFirstName, uLastName, uBOD, uEmail, generalInfo.glbUser.id]
          );
          generalInfo.glbUser = await getUserGbl(generalInfo.glbUser.id);
          req.flash("success", "Update success");
          return res.render("profile.ejs", {
            message: req.flash("success"),
            status: "success",
            generalInfo: generalInfo,
            active: "profile",
          });
        } catch (error) {
          req.flash("error", error);
          return res.render("profile.ejs", {
            message: req.flash("error"),
            status: "error",
            generalInfo: generalInfo,
            active: "profile",
          });
        }
      } else {
        req.flash("warning", "Email is not empty");
        return res.render("profile.ejs", {
          message: req.flash("warning"),
          status: "warning",
          generalInfo: generalInfo,
          active: "profile",
        });
      }
    } else {
      req.flash("warning", "Last name is not empty");
      return res.render("profile.ejs", {
        message: req.flash("warning"),
        status: "warning",
        generalInfo: generalInfo,
        active: "profile",
      });
    }
  } else {
    req.flash("warning", "First name is not empty");
    return res.render("profile.ejs", {
      message: req.flash("warning"),
      status: "warning",
      generalInfo: generalInfo,
      active: "profile",
    });
  }
};
let getChangePasswordPage = (req, res) => {
  return res.render("change-password.ejs", {
    message: req.flash("status"),
    generalInfo: generalInfo,
    active: "profile",
  });
};
let postChangePasswordPage = async (req, res) => {
  try {
    let { uPassword, uNewPassword, uConfirmPassword } = req.body;
    if (uPassword.length > 0) {
      let ePassword = Buffer.from(uPassword).toString("base64");
      let [getPassword] = await pool.execute(
        "select password from user_account where id = ?",
        [generalInfo.glbUser.id]
      );
      if (ePassword == getPassword[0].password) {
        if (uNewPassword == uConfirmPassword) {
          let eNewPassword = Buffer.from(uNewPassword).toString("base64");
          await pool.execute(
            "UPDATE user_account SET password = ? WHERE id = ?",
            [eNewPassword, generalInfo.glbUser.id]
          );
          req.flash("success", "Change password success");
          return res.render("profile.ejs", {
            message: req.flash("success"),
            status: "success",
            generalInfo: generalInfo,
            active: "profile",
          });
        } else {
          req.flash("warning", "Confirm password not correct");
          return res.render("change-password.ejs", {
            message: req.flash("warning"),
            status: "warning",
            generalInfo: generalInfo,
            active: "profile",
          });
        }
      } else {
        req.flash("warning", "Password not correct");
        return res.render("change-password.ejs", {
          message: req.flash("warning"),
          status: "warning",
          generalInfo: generalInfo,
          active: "profile",
        });
      }
    } else {
      req.flash("warning", "Please input password");
      return res.render("change-password.ejs", {
        message: req.flash("warning"),
        status: "warning",
        generalInfo: generalInfo,
        active: "profile",
      });
    }
  } catch (error) {
    req.flash("danger", error);
    return res.render("login.ejs", {
      message: req.flash("danger"),
      status: "danger",
    });
  }
};
let handleUploadAvatar = async (req, res) => {
  try {
    // Accept images only
    if (!req.file) {
      req.flash("warning", "File not image. Please choose again!");
      return res.render("profile.ejs", {
        message: req.flash("warning"),
        status: "warning",
        generalInfo: generalInfo,
        active: "profile",
      });
    }
    if (generalInfo.glbUser.image != null) {
      let linkDelete = req.file.destination + generalInfo.glbUser.image;
      fs.unlinkSync(linkDelete);
    }
    await pool.execute("UPDATE user_account SET image = ? WHERE id = ?", [
      req.file.filename,
      generalInfo.glbUser.id,
    ]);
    generalInfo.glbUser = await getUserGbl(generalInfo.glbUser.id);
    // Display uploaded image for user validation
    req.flash("success", "Change avatar success");
    return res.render("profile.ejs", {
      message: req.flash("success"),
      status: "success",
      generalInfo: generalInfo,
      active: "profile",
    });
  } catch (error) {
    req.flash("danger", error);
    return res.render("login.ejs", {
      message: req.flash("danger"),
      status: "danger",
    });
  }
};

module.exports = {
  getHomePage,
  postCreateNewSavingBook,
  getAboutPage,
  getAddAny1In6Jar,
  postAddAny1In6Jar,
  getHistoryPage,
  getPayPage,
  postPayPage,
  getProfile,
  postProfile,
  getChangePasswordPage,
  postChangePasswordPage,
  handleUploadAvatar,
};
