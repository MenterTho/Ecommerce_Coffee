const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/CaPheNgon_dev");
    console.log("Conncet successfully!!!");
  } catch (err) {
    console.log("Connect Fail!!", { err });
  }
}
module.exports = { connect };
