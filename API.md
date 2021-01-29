## Functions

<dl>
<dt><a href="#createPepper">createPepper(service, account, passphrase, id)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Generates a Random Pepper (Like Salt but not stored with Encrypted Data) and stores it in the
OS Keychain, referenced by the Service, Account, Id and Passphrase Hash.</p>
<ul>
<li>On <strong>MacOS</strong> the passwords are managed by the <strong>Keychain</strong>,</li>
<li>On <strong>Linux</strong> they are managed by the <strong>Secret Service API/libsecret</strong>,</li>
<li>On <strong>Windows</strong> they are managed by <strong>Credential Vault</strong>.</li>
</ul>
<p>Returns the Pepper as stored in the OS KeyChain Provider to be combined with the passphrase
to harden a Passphrase combining it with something not known by the user (and potential
attacker)</p>
<p>Optionally an ID can be provided which allows for different peppers to be used for the same
account and passphrase, useful for securing individual items within the account but where not
wanting to require a separate passphrase (or guaranteeing a user does not accidentally
overwrite their existing pepper preventing them from accessing data.)</p>
</dd>
<dt><a href="#getPepper">getPepper(service, account, passphrase, id)</a> ⇒ <code>Promise.&lt;(string|undefined)&gt;</code></dt>
<dd><p>Retrieves the Pepper that has previously been created and stored.</p>
</dd>
<dt><a href="#deletePepper">deletePepper(service, account, passphrase, id)</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Deletes the Pepper from the KeyChain</p>
</dd>
</dl>

<a name="createPepper"></a>

## createPepper(service, account, passphrase, id) ⇒ <code>Promise.&lt;string&gt;</code>
Generates a Random Pepper (Like Salt but not stored with Encrypted Data) and stores it in the
OS Keychain, referenced by the Service, Account, Id and Passphrase Hash.

- On **MacOS** the passwords are managed by the **Keychain**,
- On **Linux** they are managed by the **Secret Service API/libsecret**,
- On **Windows** they are managed by **Credential Vault**.

Returns the Pepper as stored in the OS KeyChain Provider to be combined with the passphrase
to harden a Passphrase combining it with something not known by the user (and potential
attacker)

Optionally an ID can be provided which allows for different peppers to be used for the same
account and passphrase, useful for securing individual items within the account but where not
wanting to require a separate passphrase (or guaranteeing a user does not accidentally
overwrite their existing pepper preventing them from accessing data.)

**Kind**: global function  
**See**: [https://www.npmjs.com/package/keytar](https://www.npmjs.com/package/keytar)  

| Param | Type | Description |
| --- | --- | --- |
| service | <code>string</code> | Application Service Name |
| account | <code>string</code> | Account Name |
| passphrase | <code>string</code> | Passphrase to be Peppered |
| id | <code>number</code> \| <code>string</code> | Optional Unique Identifier for THIS Pepper |

**Example**  
```js
const pepper = createPepper({
       service: "MyApp",
       account: "someone@example.com",
       passphrase: "Password123!"
   });
 console.log(pepper.toString()); // 13b22be32f3c3b426e3cf556d9f77187
```
<a name="getPepper"></a>

## getPepper(service, account, passphrase, id) ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>
Retrieves the Pepper that has previously been created and stored.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| service | <code>string</code> | Application Service Name |
| account | <code>string</code> | Account Name |
| passphrase | <code>string</code> | Passphrase to be Peppered |
| id | <code>number</code> \| <code>string</code> | Optional Unique Identifier for THIS Pepper |

**Example**  
```js
const pepper = getPepper({
     service: "MyApp",
     account: "someone@example.com",
     passphrase: "Password123!"
 });
 console.log(pepper.toString()); // 13b22be32f3c3b426e3cf556d9f77187
```
<a name="deletePepper"></a>

## deletePepper(service, account, passphrase, id) ⇒ <code>Promise.&lt;boolean&gt;</code>
Deletes the Pepper from the KeyChain

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| service | <code>string</code> | Application Service Name |
| account | <code>string</code> | Account Name |
| passphrase | <code>string</code> | Passphrase to be Peppered |
| id | <code>number</code> \| <code>string</code> | Optional Unique Identifier for THIS Pepper |

**Example**  
```js
const success = deletePepper({
     service: "MyApp",
     account: "someone@example.com",
     passphrase: "Password123!"
 });
```
