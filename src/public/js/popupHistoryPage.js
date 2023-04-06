let currencyFormattingVND = (money) => {
  try {
    money = parseInt(money);
    money = money.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
    return money.replaceAll(".", ",");
  } catch (error) {
    console.log(error);
    return "0 VND";
  }
};
let changeColor = (money, id) => {
  if (money < 0) {
    document.getElementById(id).style.color = "#b50e0e";
  } else {
    document.getElementById(id).style.color = "#0d9b73";
  }
};
let detail = (data) => {
  changeColor(data.NEC, "NEC");
  changeColor(data.LTS, "LTS");
  changeColor(data.EDU, "EDU");
  changeColor(data.PLAY, "PLAY");
  changeColor(data.FFA, "FFA");
  changeColor(data.GIVE, "GIVE");
  document.getElementById("NEC").value = currencyFormattingVND(data.NEC);
  document.getElementById("LTS").value = currencyFormattingVND(data.LTS);
  document.getElementById("EDU").value = currencyFormattingVND(data.EDU);
  document.getElementById("PLAY").value = currencyFormattingVND(data.PLAY);
  document.getElementById("FFA").value = currencyFormattingVND(data.FFA);
  document.getElementById("GIVE").value = currencyFormattingVND(data.GIVE);
  window.location.href = "#popup1";
};
