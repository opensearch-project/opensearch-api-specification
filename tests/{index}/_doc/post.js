const hooks = require('hooks')
const fetch = require('node-fetch')

hooks.after('/{index}/_doc > POST > 201 > application/json', function (transaction, done) {
  // cleanup, delete newly created document
  fetch(
    `https://${transaction.host}:${transaction.port}${transaction.real.headers.location}`, {
      method: 'DELETE',
      headers: transaction.request.headers
    })
    .then((_) => done())
    .catch((error) => {
      transaction.fail = error
      done()
    })
})
