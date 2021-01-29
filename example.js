const { AES, enc } = require("crypto-js");
const { getPepper, createPepper, deletePepper } = require("./src/pepper");

const SERVICE = "MyApp";
const ACCOUNT = "someone@example.com";
const PASSPHRASE = "password123!";
const SECRET_MESSAGE = "Launch Codes!!";

const main = async () => {
  // Create a New Pepper
  const savedPepper = await createPepper({
    service: SERVICE,
    account: ACCOUNT,
    passphrase: PASSPHRASE,
  });

  const pepperyPassphrase = `${PASSPHRASE}:${savedPepper}`;

  // Apply AES-256 using PBKDF2 to derive Key from Known Passphrase and Pepper from KeyChain
  const encryptedContent = AES.encrypt(SECRET_MESSAGE, pepperyPassphrase);

  console.log(encryptedContent.toString()); // U2FsdGVkX1+G4C2ZTt6CkyTB36xyKEK+z9f084pIJy0=

  // --------- Do Something With Encrypted Content

  // Fetch Existing Pepper
  const queriedPepper = await getPepper({
    service: SERVICE,
    account: ACCOUNT,
    passphrase: PASSPHRASE,
  });

  const queriedPepperyPassphrase = `${PASSPHRASE}:${queriedPepper}`;

  const content = AES.decrypt(encryptedContent, queriedPepperyPassphrase);

  console.log(enc.Utf8.stringify(content)); //Launch Codes!!

  const result = await deletePepper({
    service: SERVICE,
    account: ACCOUNT,
    passphrase: PASSPHRASE,
  });
  console.log(result); // true
};

main();
