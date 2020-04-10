const firestore = require('@tridnguyen/firestore');

function check(params, callback) {
  const resp = {};
  firestore
    .collection('accounts')
    .where('user', '==', process.env.AUTH0_USER)
    .get()
    .then((acctSnapshot) => {
      const accounts = acctSnapshot.docs.map((doc) => doc.data());
      if (!accounts.length) {
        const err = new Error('Missing accounts');
        err.status = 404;
        callback(err);
        return;
      }
      resp.num_accounts = accounts.length;
      callback(null, resp);
    }, callback);
}

module.exports.check = check;
