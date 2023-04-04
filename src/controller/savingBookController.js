import pool from "../configs/connectDB";
import jwt from "jsonwebtoken";
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
    let [getUser] = await pool.execute(
      "select id,firstName,lastName,BOD,email,phoneNumber,image from user_account where id = ?",
      [globalUser.id]
    );
    // add global user
    generalInfo.glbUser = getUser[0];
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
        getUser: getUser[0],
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
    //create in saving_money_history
    await pool.execute(
      "insert into saving_money_history(totalMoney,decNEC,decLTS,decEDU,decPLAY,decFFA,decGIVE,type,userID,createDate) values(?,?,?,?,?,?,?,?,?,?)",
      [svMoney, nec, lts, edu, play, ffa, give, "income", userID, createDate]
    );
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
        money = Math.sign(num) * (Math.abs(num) / 1000).toFixed(2) + "k";
      } else {
        money = Math.sign(num) * Math.abs(num);
      }
    }
  }
  return money;
};

let getRulePage = (req, res) => {
  return res.render("rule.ejs", {
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
  return res.render("add-any-1-in-6-jar", {
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

    //Create saving_money_history
    let createDate = new Date(Date.now());
    await pool.execute(
      "insert into saving_money_history(totalMoney,decNEC,decLTS,decEDU,decPLAY,decFFA,decGIVE,type,userID,createDate) values(?,?,?,?,?,?,?,?,?,?)",
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
    return res.render("add-any-1-in-6-jar", {
      message: req.flash("success"),
      status: "success",
      generalInfo: generalInfo,
      IsShowAddMoney: true,
      ShowAddMoney: showAdd,
      active: "add-money",
    });
  } catch (error) {
    req.flash("danger", error);
    return res.render("login.ejs", {
      message: req.flash("danger"),
      status: "danger",
    });
  }
};
let getListSavingBook = async (userID) => {
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
let getHistory = async (req, res) => {
  let [listSavingBookHistory] = await pool.execute(
    "SELECT createDate,CAST(totalMoney AS int) as TOTAL, CAST(decNEC AS int) as NEC, CAST(decLTS AS int) as LTS, CAST(decEDU AS int) as EDU, CAST(decPLAY AS int) as PLAY, CAST(decFFA AS int) as FFA, CAST(decGIVE AS int) as GIVE,type as TYPE FROM `saving_money_history` WHERE userID = 1 ORDER BY createDate DESC;",
    [generalInfo.glbUser.id]
  );
  return res.render("history.ejs", {
    message: req.flash("status"),
    status: "success",
    generalInfo: generalInfo,
    listSavingBookHistory: listSavingBookHistory,
    active: "history",
  });
};

module.exports = {
  getHomePage,
  postCreateNewSavingBook,
  getRulePage,
  getAddAny1In6Jar,
  postAddAny1In6Jar,
  getHistory,
};
