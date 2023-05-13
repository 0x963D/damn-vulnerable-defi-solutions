const { ethers } = require("hardhat");
const { expect } = require("chai");
const { setBalance } = require("@nomicfoundation/hardhat-network-helpers");

describe("[Challenge] Side entrance", function () {
  let deployer, hacker;
  let pool;

  const ETHER_IN_POOL = 1000n * 10n ** 18n;
  const hacker_INITIAL_ETH_BALANCE = 1n * 10n ** 18n;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, hacker] = await ethers.getSigners();

    // Deploy pool and fund it
    pool = await (
      await ethers.getContractFactory("SideEntranceLenderPool", deployer)
    ).deploy();
    await pool.deposit({ value: ETHER_IN_POOL });
    expect(await ethers.provider.getBalance(pool.address)).to.equal(
      ETHER_IN_POOL
    );

    // hacker starts with limited ETH in balance
    await setBalance(hacker.address, hacker_INITIAL_ETH_BALANCE);
    expect(await ethers.provider.getBalance(hacker.address)).to.eq(
      hacker_INITIAL_ETH_BALANCE
    );
  });

  it("Exploit", async function () {
    /** CODE YOUR SOLUTION HERE */
  });

  after(async function () {
    /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

    // hacker took all ETH from the pool
    expect(await ethers.provider.getBalance(pool.address)).to.be.equal(0);
    expect(await ethers.provider.getBalance(hacker.address)).to.be.gt(
      ETHER_IN_POOL
    );
  });
});
