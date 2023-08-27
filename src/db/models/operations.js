const mongoose = require("mongoose");

const operationSchema = mongoose.Schema({
  question: {
    type: String,
    require: true,
  },
  result: {
    type: String,
    require: true,
    },
  
});

const Operations = mongoose.model("donation", operationSchema);
module.exports = Operations;