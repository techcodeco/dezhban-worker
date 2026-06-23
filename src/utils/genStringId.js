const crypto = require("crypto");

const genStringId = (length = 7) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const randomBytes = crypto.randomBytes(length);
  let id = "";
  for (let i = 0; i < length; i++) {
    id += characters.charAt(randomBytes[i] % characters.length);
  }
  return id;
};

module.exports = genStringId;
