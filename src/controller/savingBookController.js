import pool from "../configs/connectDB";
let postCreateNewSavingBook = async (req, res) => {
  try {
    let { userID, svMoney } = req.body;
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
    console.log(error);
    return res.redirect("login.ejs");
  }
};

module.exports = {
  postCreateNewSavingBook,
};
