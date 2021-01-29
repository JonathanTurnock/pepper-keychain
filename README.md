# 🌶 pepper-keychain

> In cryptography, a pepper is a secret added to an input such as a passphrase during hashing with
> a cryptographic hash function. This value differs from a salt in that it is not stored
> alongside  a passphrase hash, but rather the pepper is kept separate in some other medium, such
> as  a Hardware Security Module
>
> https://en.wikipedia.org/wiki/Pepper_(cryptography)

In Essence a passphrase plus random data is stronger than a passphrase alone. Most Apps and
Databases can be dumped in one form or another, and if a KeyLogger is able to track the users input,
your susceptible to getting your data stolen.

## Enter Pepper-Keychain

Pepper-Keychain leverages the power of modern operating system keychains to supplement traditional
master passphrase approach of "What you know" with a followup "What you have"

In an ideal world we could have a physical device separate to the machine generating peppers and
maintaining a database for them, serving them up as required. We can get close to this with an OS
Keychain API.

We use the Operating System Keychain to act a vault, your app calls `createPepper` with the users'
passphrase, we create and store a random pepper in the keychain, map it to the passphrase hash
(SHA3) and return it, where it can then be used to compliment the passphrase for encrypting.

Using this approach even if the encrypted data is lifted, and the passphrase is known the attacker
then needs to penetrate the OS Keychain to access the accompanying peppers.

### Word of Caution

This approach does not come without cost, only the device with those Peppers can be used to decrypt
the content, this is somewhat inconvenient, depending on the use case. There will be additional
overhead to create a migration package secure backup, or re-encrypt without the peppers on demand,
but for some applications this additional layer is useful, hence this library 🙂

## Usage

The Library exports simple functions `createPepper` and `getPepper` and `deletePepper` allowing crud
operations on the peppers.

See [API.md](https://github.com/JonathanTurnock/pepper-keychain/blob/main/API.md) for additional information on usage.

## Example

In this Example we take a Secret Message and wrap it in AES-256 Encryption, but rather than simply
using the passphrase which is pretty useless against a lookup attack, we combine it with the
randomly generated pepper which only the OS Keychain knows about.

```javascript
const {AES, enc} = require("crypto-js");
const {getPepper, createPepper, deletePepper} = require("./src/pepper");

const SERVICE = "MyApp";
const ACCOUNT = "someone@example.com";
const PASSPHRASE = "passphrase123!";
const SECRET_MESSAGE = "Launch Codes!!";

const main = async () => {
    // Create a New Pepper
    const savedPepper = await createPepper({
        service: SERVICE,
        account: ACCOUNT,
        passphrase: PASSPHRASE,
    }); // 4a4e16fcdefa26e3db2c4116f13659d6

    const pepperyPassphrase = PASSPHRASE + ":" + savedPepper; // passphrase123!:4a4e16fcdefa26e3db2c4116f13659d6

    // Apply AES-256 using PBKDF2 to derive Key from Known Passphrase and Pepper from KeyChain
    const encryptedContent = AES.encrypt(SECRET_MESSAGE, pepperyPassphrase);

    console.log(encryptedContent.toString()); // U2FsdGVkX1+G4C2ZTt6CkyTB36xyKEK+z9f084pIJy0=

    // --------- Do Something With Encrypted Content

    // Fetch Existing Pepper
    const queriedPepper = await getPepper({
        service: SERVICE,
        account: ACCOUNT,
        passphrase: PASSPHRASE,
    }); // 4a4e16fcdefa26e3db2c4116f13659d6

    const queriedPepperyPassphrase = PASSPHRASE + ":" + savedPepper; // passphrase123!:4a4e16fcdefa26e3db2c4116f13659d6

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
```

### Inside the Keychain

Peering Inside the Keychain the above example would produce the following KeyChain Entry

![keychain.png](https://raw.githubusercontent.com/JonathanTurnock/pepper-keychain/main/keychain.png)
![pepper.png](https://raw.githubusercontent.com/JonathanTurnock/pepper-keychain/main/pepper.png)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would
like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
