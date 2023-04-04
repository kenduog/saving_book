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
let detail = (data) => {
  document.getElementById("NEC").value = currencyFormattingVND(data.NEC);
  document.getElementById("LTS").value = currencyFormattingVND(data.LTS);
  document.getElementById("EDU").value = currencyFormattingVND(data.EDU);
  document.getElementById("PLAY").value = currencyFormattingVND(data.PLAY);
  document.getElementById("FFA").value = currencyFormattingVND(data.FFA);
  document.getElementById("GIVE").value = currencyFormattingVND(data.GIVE);
  window.location.href = "#popup1";
};
