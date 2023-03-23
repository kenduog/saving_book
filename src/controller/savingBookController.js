import pool from "../configs/connectDB";
import jwt from "jsonwebtoken";
require("dotenv").config();
const instagramName = process.env.YOUR_INSTAGRAM_NAME;
const facebookID = process.env.YOUR_FACEBOOK_ID;
const projectGithub = process.env.YOUR_PROJECT_GITHUB;
const youtubeChannel = process.env.YOUR_YOUTUBE_CHANNEL;
var glbUser = [];
var glbListSavingBook = [];

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
    glbUser = getUser[0];
    if (checkSV.length == 1) {
      try {
        let [listSavingBook] = await pool.execute(
          "select totalMoney,decNEC,decLTS,decEDU,decPLAY,decFFA,decGIVE from saving_money where userID = ? LIMIT 1",
          [globalUser.id]
        );
        listSavingBook[0].totalMoneyStr = FormatterCurrency(
          listSavingBook[0].totalMoney
        );
        listSavingBook[0].decNECStr = FormatterCurrency(
          listSavingBook[0].decNEC
        );
        listSavingBook[0].decPLAYStr = FormatterCurrency(
          listSavingBook[0].decPLAY
        );
        listSavingBook[0].totalMoney = currencyFormattingVND(
          listSavingBook[0].totalMoney
        );
        listSavingBook[0].decNEC = currencyFormattingVND(
          listSavingBook[0].decNEC
        );
        listSavingBook[0].decLTS = currencyFormattingVND(
          listSavingBook[0].decLTS
        );
        listSavingBook[0].decEDU = currencyFormattingVND(
          listSavingBook[0].decEDU
        );
        listSavingBook[0].decPLAY = currencyFormattingVND(
          listSavingBook[0].decPLAY
        );
        listSavingBook[0].decFFA = currencyFormattingVND(
          listSavingBook[0].decFFA
        );
        listSavingBook[0].decGIVE = currencyFormattingVND(
          listSavingBook[0].decGIVE
        );
        // add global List Saving Book
        glbListSavingBook = listSavingBook[0];
        return res.render("index.ejs", {
          listSavingBook: listSavingBook[0],
          getUser: getUser[0],
          instagramName: instagramName,
          facebookID: facebookID,
          projectGithub: projectGithub,
          youtubeChannel: youtubeChannel,
          active: "/",
        });
      } catch (error) {
        req.flash("danger", error);
        return res.render("login.ejs", {
          message: req.flash("status"),
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
      message: req.flash("status"),
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

    await pool.execute(
      "insert into saving_money(totalMoney,decNEC,decLTS,decEDU,decPLAY,decFFA,decGIVE,userID,createDate) values(?,?,?,?,?,?,?,?,?)",
      [svMoney, nec, lts, edu, play, ffa, give, userID, createDate]
    );
    return res.redirect("/");
  } catch (error) {
    req.flash("danger", error);
    return res.render("login.ejs", {
      message: req.flash("status"),
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
    listSavingBook: glbListSavingBook,
    getUser: glbUser,
    instagramName: instagramName,
    facebookID: facebookID,
    projectGithub: projectGithub,
    youtubeChannel: youtubeChannel,
    active: "rule",
  });
};
//6 Jar
let getAddAny1In6Jar = (req, res) => {
  return res.render("Add-Any-1-In-6-Jar.ejs", {
    listSavingBook: glbListSavingBook,
    getUser: glbUser,
    instagramName: instagramName,
    facebookID: facebookID,
    projectGithub: projectGithub,
    youtubeChannel: youtubeChannel,
    active: "add-money",
  });
};
module.exports = {
  getHomePage,
  postCreateNewSavingBook,
  getRulePage,
  getAddAny1In6Jar,
};
