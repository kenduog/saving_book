import pool from "../configs/connectDB";
import jwt from "jsonwebtoken";
require("dotenv").config();

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
        return res.render("index.ejs", {
          listSavingBook: listSavingBook[0],
          getUser: getUser[0],
        });
      } catch (error) {
        console.log(error);
        return res.render("login.ejs");
      }
    } else {
      return res.render("welcome.ejs", { getUser: getUser[0] });
    }
  } catch (error) {
    console.log(error);
    return res.render("login.ejs");
  }
};
let postCreateNewSavingBook = async (req, res) => {
  try {
    let { userID, svMoney } = req.body;
    let nec = 0; //L??? S??? 1: CHI TI??U C???N THI???T - NEC (55% THU NH???P)
    let lts = 0; //L??? S??? 2: TI???T KI???M D??I H???N - LTS (10% THU NH???P)
    let edu = 0; //L??? S??? 3: QU??? GI??O D???C - EDU (10% THU NH???P)
    let play = 0; //L??? S??? 4: H?????NG TH??? - PLAY (10% THU NH???P)
    let ffa = 0; //L??? S??? 5: QU??? T??? DO T??I CH??NH - FFA (10% THU NH???P)
    let give = 0; //L??? S??? 6: QU??? T??? THI???N - GIVE (5% THU NH???P)
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
    console.log(error);
    return res.redirect("login.ejs");
  }
};
let currencyFormattingVND = (money) => {
  money = money.toLocaleString("it-IT", { style: "currency", currency: "VND" });
  return money;
};
let FormatterCurrency = (num) => {
  let money;
  if (Math.abs(num) > 999999999) {
    money = Math.sign(num) * (Math.abs(num) / 1000000000).toFixed(1) + "B";
  } else {
    if (Math.abs(num) > 999999) {
      money = Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + "M";
    } else {
      if (Math.abs(num) > 999) {
        money = Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k";
      } else {
        money = Math.sign(num) * Math.abs(num);
      }
    }
  }
  return money;
};

module.exports = {
  getHomePage,
  postCreateNewSavingBook,
};
