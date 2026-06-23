const crypto = require("crypto");

const genUniqueId = () => {
  let min = 100_000_000_000;
  let max = 999_999_999_999;
  return crypto.randomInt(min, max + 1).toString();
};

module.exports = genUniqueId;
