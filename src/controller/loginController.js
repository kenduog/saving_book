import pool from "../configs/connectDB";

let postLoginPage = async (req, res) => {
  //   const [rows, fields] = await pool.execute("SELECT * FROM users");
  return res.render("login.ejs");
};

module.exports = {
  postLoginPage,
};
