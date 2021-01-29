const keytar = require("keytar");
const { lib, enc, SHA3 } = require("crypto-js");

/**
 * Generates a Random Pepper (Like Salt but not stored with Encrypted Data) and stores it in the
 * OS Keychain, referenced by the Service, Account, Id and Passphrase Hash.
 *
 * - On **MacOS** the passwords are managed by the **Keychain**,
 * - On **Linux** they are managed by the **Secret Service API/libsecret**,
 * - On **Windows** they are managed by **Credential Vault**.
 *
 * Returns the Pepper as stored in the OS KeyChain Provider to be combined with the passphrase
 * to harden a Passphrase combining it with something not known by the user (and potential
 * attacker)
 *
 * Optionally an ID can be provided which allows for different peppers to be used for the same
 * account and passphrase, useful for securing individual items within the account but where not
 * wanting to require a separate passphrase (or guaranteeing a user does not accidentally
 * overwrite their existing pepper preventing them from accessing data.)
 *
 *  @example
 *    const pepper = createPepper({
 *        service: "MyApp",
 *        account: "someone@example.com",
 *        passphrase: "Password123!"
 *    });
 *  console.log(pepper.toString()); // 13b22be32f3c3b426e3cf556d9f77187
 *
 * @see {@link https://www.npmjs.com/package/keytar}
 *
 * @param service {string} - Application Service Name
 * @param account {string} - Account Name
 * @param passphrase {string} - Passphrase to be Peppered
 * @param id {number | string} - Optional Unique Identifier for THIS Pepper
 *
 * @returns {Promise<string>}
 */
const createPepper = async ({ service, account, passphrase, id = 0 }) => {
  const pepper = lib.WordArray.random(128 / 8);
  await keytar.setPassword(
    service,
    `${account}:${id}:${SHA3(passphrase)}`,
    enc.Hex.stringify(pepper)
  );
  return enc.Hex.parse(
    await keytar.getPassword(service, `${account}:${id}:${SHA3(passphrase)}`)
  );
};

/**
 * Retrieves the Pepper that has previously been created and stored.
 *
 * @example
 *  const pepper = getPepper({
 *      service: "MyApp",
 *      account: "someone@example.com",
 *      passphrase: "Password123!"
 *  });
 *  console.log(pepper.toString()); // 13b22be32f3c3b426e3cf556d9f77187
 *
 * @param service {string} - Application Service Name
 * @param account {string} - Account Name
 * @param passphrase {string} - Passphrase to be Peppered
 * @param id {number | string} - Optional Unique Identifier for THIS Pepper
 *
 * @returns {Promise<string | undefined>}
 */
const getPepper = async ({ service, account, passphrase, id = 0 }) => {
  const pw = await keytar.getPassword(
    service,
    `${account}:${id}:${SHA3(passphrase)}`
  );
  return (pw && enc.Hex.parse(pw)) || undefined;
};

/**
 * Deletes the Pepper from the KeyChain
 *
 * @example
 *  const success = deletePepper({
 *      service: "MyApp",
 *      account: "someone@example.com",
 *      passphrase: "Password123!"
 *  });
 *
 * @param service {string} - Application Service Name
 * @param account {string} - Account Name
 * @param passphrase {string} - Passphrase to be Peppered
 * @param id {number | string} - Optional Unique Identifier for THIS Pepper
 *
 * @returns {Promise<boolean>}
 */
const deletePepper = async ({ service, account, passphrase, id = 0 }) => {
  return keytar.deletePassword(service, `${account}:${id}:${SHA3(passphrase)}`);
};

module.exports = { createPepper, getPepper, deletePepper };
