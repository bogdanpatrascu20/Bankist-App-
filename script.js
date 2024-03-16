'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Kamla Francesca',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 8888,
};

const account4 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account5 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4, account5];
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€          </div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}EUR`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};

//event handlers
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear input fields

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    // recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    //Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// inputClosePin, inputCloseUsername
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    //Delete account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
////////////////////

// const JuliaDogs = [3, 5, 2, 12, 7];
// const KateDogs = [4, 1, 15, 8, 3];

// const checkDogs = function (age1, age2) {
//   console.log((age1, age2) >= 3 ? 'Este adult' : 'E puppy');
// };
// checkDogs(...JuliaDogs, ...KateDogs);
/*
const JuliaDogs = [3, 5, 2, 12, 7];
const KateDogs = [4, 1, 15, 8, 3];

const checkDogs = function (...ages) {
  ages.forEach((age, index) => {
    const message = `Câinele ${index + 1} are ${age} ani și este ${
      age >= 3 ? 'adult' : 'puppy'
    }`;
    console.log(message);
  });
};

JuliaDogs.splice(0, 1);
JuliaDogs.splice(-2);
console.log(JuliaDogs);

const ambeleArray = JuliaDogs.concat(KateDogs);
console.log(ambeleArray);
checkDogs(...JuliaDogs, ...KateDogs);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// slice method
let arr = ['a', 'b', 'c', 'd', 'e'];

arr.slice(2, 4);
arr.slice(-2);
arr.slice(-1);
arr.slice(1, -2);
arr.slice();

//splice method
console.log(arr.splice(2));
console.log(arr);

//reverse
let arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'j'];

// Concat
const letters = arr.concat(arr2);
console.log(letters);


const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.flat(0));

// getting the last array element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(` Movement ${i + 1}:you deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: you withdew ${Math.abs(movement)}`);
//   }
// }

movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: you deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: you withdew ${Math.abs(mov)}`);
  }
});

//forEach pe un Map

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//forEach pe un Set

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, key, map) {
  console.log(`${key}: ${map}`);
});


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
//   // return 23;
// });
const movementsUSD = movements.map(mov => mov * eurToUsd);
console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) movementsUSD.push(mov * eurToUsd);
console.log(movementsUSDfor);

const movementsDescriptions = movements.map((mov, i) => {
  return `Movement ${i + 1}: you ${
    mov > 0 ? 'deposited' : 'withdrew'
  }  ${Math.abs(mov)}`;
});
console.log(movementsDescriptions);

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

// const withdrawals = movements.filter(function (miscari) {
//   return miscari < 0;
// });
// console.log(withdrawals);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

console.log(movements);

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);

const balance = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

//Maximum value

const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);

const dogsAges1 = [5, 2, 4, 1, 15, 8, 3];

const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(dogAge =>
    dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
  );
  console.log(humanAges);
  const adultAges = humanAges.filter(age => age >= 18);
  const sumAges = adultAges.reduce((acc, curr) => acc + curr, 0);
  console.log(adultAges);
  console.log(sumAges);
  return sumAges / adultAges.length;
};

console.log(calcAverageHumanAge(dogsAges1));


// const eurToUsd = 1.1;
// //Pipeline (analogie)
// const totalDepositUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositUSD);

const dogsAges1 = [5, 2, 4, 1, 15, 8, 3];

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(dogAge =>
//     dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
//   );
//   console.log(humanAges);
//   const adultAges = humanAges.filter(age => age >= 18);
//   const sumAges = adultAges.reduce((acc, curr) => acc + curr, 0);
//   console.log(adultAges);
//   console.log(sumAges);
//   return sumAges / adultAges.length;
// };
// console.log(calcAverageHumanAge(dogsAges1));

const calcAverageHumanAge = ages =>
  ages
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(age => age >= 18)
    .reduce((acc, curr) => acc + curr, 0);
console.log(calcAverageHumanAge(dogsAges1));


const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

// let foundAccount;

// for (const account of accounts) {
//   if (account.owner === 'Jessica Davis') {
//     foundAccount = account;
//     break; // Exit the loop once the account is found
//   }
// }

// console.log(foundAccount);

//Equality
console.log(movements);
console.log(movements.includes(-130));

//Condition (some method)
console.log(movements.some(mov => mov === -130));
const anyDeposits = movements.some(mov => mov > 500);
console.log(anyDeposits);

// every method
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Separate callback

const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));


const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));
//flat
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

//flatMap

const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);


//Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);
// de default sort method merge pe strings-uri

//Numbers

console.log(movements);

// return < 0, atuci A va fi inainte de B, de altfel daca return > 0, atunci B va fi inainte de A
//Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });

movements.sort((a, b) => a - b;)
console.log(movements);

// return < 0, A, B (keep order)
// return > 0, B, A (switch order)

//Descending
movements.sort((a, b) => b - a)
console.log(movements);


const arr = [1, 2, 3, 4, 5, 6, 7];

//EMpty Arrays, fill method
const x = new Array(7);
console.log(x);

// x.fill(1);

x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

// Array.from

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const aruncaZarul = () => Math.floor(Math.random() * 6) + 1; // Generează un număr întreg între 1 și 6

// const dice = Array.from(
//   { length: 100 },
//   (_, i) => Math.floor(Math.random() * 6) + 1
// );
// console.log(dice);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});

//1.
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositSum);

// 2.
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;
// console.log(numDeposits1000);

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
// console.log(numDeposits1000);

// Prefixed ++ operator, se pune inainte ca sa fie calculat direct sau ++ dupa ca sa fie calculat in urmatoarea operatie
let a = 10;
// console.log(++a);
// console.log(a);

// 3.

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

// 4.
// this is a nice title -> This Is a Nice Title

const convertTitleCase = function (title) {
  const capitalization = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'and', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalization(word)))
    .join(' ');
  return capitalization(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

const includeSarah = dogs.some(dog => dog.owners.includes('Sarah'));
console.log(includeSarah);

// cur food < rec food
const caineleSarei = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(caineleSarei);
const manancaDestul =
  caineleSarei.curFood > caineleSarei.recFood
    ? 'Cainele Sarei mananca destul de mult'
    : 'Cainele Sarei Nu mananca destul';
console.log(manancaDestul);

// Fa un array cu toti stapanii de caine care mananca prea mult.
// const ownersEatTooMuch = dogs.filter(dog => (dog.curFood > dog.recFood ? console.log(dogs.owners, 'Mananca mult') : console.log(dogs.owners, 'Mananca putin'));

const ownersEatTooMuch = dogs.filter(dog => {
  if (dog.curFood > dog.recFood) {
    console.log(dog.owners, 'Cainele celor din Array Mănâncă mult');
    return true; // păstrează câinele în array
  } else {
    console.log(dog.owners, 'Cainele celor din Array Mănâncă puțin');
    return false; // nu păstrează câinele în array
  }
});

//Ca sa sortezi dupa portia de mancare, genial sincer:
const dogsSortedsiCopiatArrayDogs = dogs
  .slice()
  .sort((a, b) => a.recFood - b.recFood);
console.log(dogsSortedsiCopiatArrayDogs);
