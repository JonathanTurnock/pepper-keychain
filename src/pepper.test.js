if (process.env.CI) {
  console.log("Using Keytar Mock");
  jest.mock("keytar", () => {
    const passwords = new Map();

    const getPassword = async (service, account) => {
      return passwords.get(`${service}/${account}`);
    };

    const deletePassword = async (service, account) => {
      return passwords.delete(`${service}/${account}`);
    };

    const setPassword = async (service, account, password) => {
      return passwords.set(`${service}/${account}`, password);
    };

    return { getPassword, deletePassword, setPassword };
  });
} else {
  console.log("Using OS Keychain");
}
const { createPepper, getPepper, deletePepper } = require("./pepper");

describe("createPepper", () => {
  let pepper1;

  beforeAll(async () => {
    pepper1 = await createPepper({
      service: "pepper-keychain-tests",
      account: "someone@example.com",
      passphrase: "Password123!",
    });
  });

  it("should create a pepper and return it", () => {
    expect(pepper1.toString()).toMatch(/[a-z0-9A-Z]{32}/);
  });

  it("should be retrievable and be the same value", async () => {
    const fetchedPepper = await getPepper({
      service: "pepper-keychain-tests",
      account: "someone@example.com",
      passphrase: "Password123!",
    });
    expect(fetchedPepper.toString()).toEqual(pepper1.toString());
  });

  it("should be different from a pepper with a different Id", async () => {
    const pepper2 = await createPepper({
      service: "pepper-keychain-tests",
      account: "someone@example.com",
      passphrase: "Password123!",
      id: 1,
    });
    const fetchedPepper = await getPepper({
      service: "pepper-keychain-tests",
      account: "someone@example.com",
      passphrase: "Password123!",
      id: 1,
    });
    expect(fetchedPepper.toString()).not.toEqual(pepper1.toString());
    expect(fetchedPepper.toString()).toEqual(pepper2.toString());
  });

  it("should be deletable", async () => {
    const result = await deletePepper({
      service: "pepper-keychain-tests",
      account: "someone@example.com",
      passphrase: "Password123!",
    });

    expect(result).toBeTruthy();
  });

  it("should return undefined if not present", async () => {
    const result = await getPepper({
      service: "pepper-keychain-tests",
      account: "someone@example.com",
      passphrase: "Password123!",
      id: 2,
    });
    expect(result).toBeUndefined();
  });

  afterAll(async () => {
    await deletePepper({
      service: "pepper-keychain-tests",
      account: "someone@example.com",
      passphrase: "Password123!",
    });
    await deletePepper({
      service: "pepper-keychain-tests",
      account: "someone@example.com",
      passphrase: "Password123!",
      id: 1,
    });
  });
});
