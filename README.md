![](cover.png)

**A set of challenges to learn offensive security of smart contracts in Ethereum.**

Featuring flash loans, price oracles, governance, NFTs, lending pools, smart contract wallets, timelocks, and more!

## Play

Visit [damnvulnerabledefi.xyz](https://damnvulnerabledefi.xyz)

## Disclaimer

All Solidity code, practices and patterns in this repository are DAMN VULNERABLE and for educational purposes only.

DO NOT USE IN PRODUCTION.

# Damn Vulnerable DeFi Solutions

Solutions to [Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/) challenges ⛳️

## Contents

1.  [Unstoppable](#1---unstoppable)
2.  [Naive receiver](#2---naive-receiver)
3.  [Truster](#3---truster)
4.  [Side entrance](#4---side-entrance)
5.  [The rewarder](#5---the-rewarder)
6.  [Selfie](#6---selfie)
7.  [Compromised](#7---compromised)
8.  [Puppet](#8---puppet)
9.  [Puppet v2](#9---puppet-v2)
10. [Free rider](#10---free-rider)
11. [Backdoor](#11---backdoor)
12. [Climber](#12---climber)

## 1 - Unstoppable

The goal of the first challenge is to perform a DOS (Denial of Service) Exploit to the contract.

There is a suspicious line in the `flashLoan` function:

```solidity
uint256 balanceBefore = totalAssets();

// totalAssets() returns the balance of the pool
asset.balanceOf(address(this));
```

If we can manage to alter the `totalAssets()` return, we will achieve the goal.

We can easily modify the `asset.balanceOf(address(this))` by sending some token to the pool.

[Test](./test/unstoppable/unstoppable.challenge.js)

## 2 - Naive receiver

In this challenge we have to drain all the funds from a contract made to call flash loans.

The contract expects to be called from the pool, which is fine, but the vulnerability lies on the fact that anyone can call the flash loan function of the pool.

In order to empty the contract in one transaction, we can create an Exploiter contract that calls the flash loan multiple times in its constructor, the repetitive 1 ETH fees draining the receiver in the process.

[Test](./test/naive-receiver/naive-receiver.challenge.js)
[Exploit contract](./contracts/exploit-contracts/naive-receiver/NaiveReceiverExploit.sol)

## 3 - Truster

Here we have to get all the tokens from the pool, and our starter balance is 0.

The `flashLoan` from the pool lets us call any function in any contract. So, what we can do is:

- Call the `flashLoan` with a function to `approve` the pool's tokens to be used by the Exploiter
- Call the `transferFrom` function of the token, to transfer them to the Exploiter address

If we want to make it in one transaction, we can create a contract that calls the `flashLoan` with the `approve`, but instead of the Exploiter address, we set the created contract address. Then we transfer the tokens to the Exploiter in the same tx.

[Test](./test/truster/truster.challenge.js)
[Exploit contract](./contracts/exploit-contracts/truster/TrusterExploit.sol)

## 4 - Side entrance

For this challenge we have to take all the ETH from the pool contract.

It has no function to receive ETH, other than the `deposit`, which is also the Exploit vector.

We can create an Exploiter contract that asks for a flash loan, and then deposit the borrowed ETH. The pool will believe that our balance is 1000 ETH, and that the flash loan was properly paid. Then we can withdraw it.

[Test](./test/side-entrance/side-entrance.challenge.js)
[Exploit contract](./contracts/exploit-contracts/side-entrance/SideEntranceExploit.sol)

## 5 - The rewarder

Here we have to claim rewards from a pool we shouldn't be able to.

Rewards are distributed when someone calls `distributeRewards()`, and depending on the amount of tokens deposited.

So, we can do all of this in one transaction:

0. Wait five days (minimum period between rewards)
1. Get a flash loan with a huge amount of tokens
2. Deposit the tokens in the pool
3. Distribute the rewards
4. Withdraw the tokens from the pool
5. Pay back the flash loan

[Test](./test/the-rewarder/the-rewarder.challenge.js)
[Exploit contract](./contracts/exploit-contracts/the-rewarder/TheRewarderExploit.sol)
