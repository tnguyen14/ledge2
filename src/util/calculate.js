export const sum = function (nums) {
  if (!Array.isArray(nums)) {
    console.log(`${nums} is not array`);
    return 0;
  }
  return nums.reduce(function (subtotal, num) {
    return subtotal + num;
  }, 0);
};

export const average = function (nums) {
  if (!Array.isArray(nums)) {
    console.log(`${nums} is not array`);
    return 0;
  }
  return sum(nums) / nums.length;
};

export const weeklyTotal = function (week) {
  if (!week || !week.transactions) {
    return 0;
  }
  return sum(
    week.transactions
      .filter((txn) => {
        if (txn.carriedOver) {
          return false;
        }
        if (txn.type != 'regular-expense') {
          return false;
        }
        return true;
      })
      .map((t) => t.amount)
  );
};
