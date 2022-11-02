const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const iv = crypto.randomBytes(16);
const key = crypto.randomBytes(32);

const encryptedKey = key.toString("hex");
const encryptedIv = iv.toString("hex");

module.exports.encryptKey = async (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedData = cipher.update(text, "utf8", "hex");
  encryptedData += cipher.final("hex");
  let data = {
    encryptedData: encryptedData,
    saltKey: encryptedKey,
    saltKeyIv: encryptedIv,
  };
  return data;
};

module.exports.decryptKey = async (saltKey, saltKeyIv, passKey) => {
  try {
    const decryptedKey = Buffer.from(saltKey, "hex");
    const decryptedIv = Buffer.from(saltKeyIv, "hex");
    const decipher = crypto.createDecipheriv(
      algorithm,
      decryptedKey,
      decryptedIv
    );
    let decryptedData = decipher.update(passKey, "hex", "utf8");
    decryptedData += decipher.final("utf8");
    return decryptedData;
  } catch (e) {
    throw e;
  }
};
