'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2021-11-15T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

let accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////Add username to each Data

const userNameCalculator = function (acc) {
  const userName = acc.owner
    .split(' ')
    .map(elem => elem[0])
    .join('')
    .toLowerCase();
  acc['userName'] = userName;
};
accounts.forEach(account => userNameCalculator(account));

//////////////// Login section

let loginFlag = false;
let loginUser = undefined;
let timer = undefined;

const userLogin = (user, pin) => {
  loginFlag = false;
  for (const acnt of accounts) {
    if (acnt.userName === user && acnt.pin === pin) {
      loginFlag = true;
      loginUser = acnt;
      clearInterval(timer);
      //reload components
      containerApp.style.opacity = 100;
      updateUI();
      break;
    }
  }
  if (!loginFlag) {
    alert(
      'Invalid Username/Password\n For Testing use:\n\n user : js \n pin : 1111  \n\n user:jd \n pin:2222'
    );
  }
};

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  const user = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);
  userLogin(user, pin);
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
});

/////////////////////////////---------UI Components--------

//Container Section

const containerAdd = function (acc) {
  containerMovements.innerHTML = '';
  acc.movements.forEach((movement, indx) => {
    const transactonType = `${movement >= 0 ? 'DEPOSIT' : 'WITHDRAWAL'}`;
    const container = `<div class="movements__row">
    <div class="movements__type movements__type--${transactonType.toLowerCase()}"> ${indx} ${transactonType}</div>
    <div class="movements__date">${dateCalculator(
      acc.movementsDates[indx]
    )}</div>
    <div class="movements__value">${movement}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', container);
  });
};
/////////////total amount
const CurrentTotal = function (acc) {
  const total = acc.movements.reduce((acc, elem) => acc + elem, 0);
  labelBalance.textContent = `${total} €`;
  return total;
};

//////Logout Function

const logOut = function () {
  containerApp.style.opacity = 0;
  loginFlag = false;
  loginUser = undefined;
  labelWelcome.textContent = `Log in back to get started`;
  clearInterval(timer);
};

///////////Login timer

const loginTimer = function (timer = 300000) {
  let timeLimit = timer;
  return setInterval(() => {
    if (timeLimit <= 0) logOut();
    else {
      var minutes = Math.floor(timeLimit / 60000);
      var seconds = ((timeLimit % 60000) / 1000).toFixed(0);
      labelTimer.textContent = `${minutes}:${seconds}`;
      timeLimit -= 1000;
    }
  }, 1000);
};

/////////total IN and out and interest

const totalInOutInrst = function (acnt) {
  const totalIn = acnt.movements
    .filter(elem => elem > 0)
    .reduce((acc, elem) => acc + elem, 0);
  const totalOut = acnt.movements
    .filter(elem => elem < 0)
    .reduce((acc, elem) => acc + elem, 0);
  const interest = Math.round(CurrentTotal(acnt) * 0.12);
  labelSumIn.textContent = totalIn;
  labelSumOut.textContent = Math.round(totalOut);
  labelSumInterest.textContent = interest;
};

const updateUI = function () {
  containerAdd(loginUser);
  CurrentTotal(loginUser);
  totalInOutInrst(loginUser);
  if (timer) clearInterval(timer);
  timer = loginTimer();
  labelWelcome.textContent = `Welcome back ${
    loginUser.owner.split(' ')[0]
  } !!!`;
};

///////////Date Caluclator

const dateCalculator = function (date) {
  const data = new Date(date);
  const retdate = Intl.DateTimeFormat('en-US').format(data);
  const now = new Date();
  if (Math.abs(data.getTime() - now.getTime()) <= 1 * 24 * 60 * 60 * 1000)
    return 'Today';
  else if (Math.abs(data.getTime() - now.getTime()) <= 2 * 24 * 60 * 60 * 1000)
    return 'Yesterday';
  return retdate;
};

////////Transfer money
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const TransferTo = inputTransferTo.value;
  const TransferAmount = Number(inputTransferAmount.value);
  const transferAcntFlag = accounts.find(acnt => acnt.userName === TransferTo);
  if (transferAcntFlag) {
    if (CurrentTotal(loginUser) < TransferAmount) alert('insufficient Balance');
    else {
      transferAcntFlag.movements.push(+TransferAmount);
      loginUser.movements.push(-TransferAmount);
      loginUser.movementsDates.push(new Date().toISOString());
      transferAcntFlag.movementsDates.push(new Date().toISOString());
      updateUI();
      inputTransferAmount.value = inputTransferTo.value = '';
    }
  } else {
    alert(
      'no such account exist \n\n For Testing use:\n\n user : js \n pin : 1111  \n\n user:jd \n pin:2222'
    );
  }
});

///Request Loan

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (loanAmount <= CurrentTotal(loginUser) * 0.1) {
    alert('You payment is on processing!!!\n Please wait 5 Seconds.');
    setTimeout(() => {
      loginUser.movements.push(loanAmount);
      loginUser.movementsDates.push(new Date().toISOString());
      updateUI();
      inputLoanAmount.value = '';
    }, 5000);
  } else
    alert(
      'SORRY!!! \n you cannot take more than 10% of your bank balance as Loan'
    );
});

//Close Account
btnClose.addEventListener('click', e => {
  e.preventDefault();
  const userName = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  if (loginUser.userName === userName && loginUser.pin === pin) {
    accounts = accounts.filter(elem => !loginUser);
    logOut();
  } else alert('Invalid User Detais');
});

//Sort Button

btnSort.addEventListener('click', e => {
  e.preventDefault();
  loginUser.movements.sort((a, b) => a - b);
  updateUI();
});

/////////challanges

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
