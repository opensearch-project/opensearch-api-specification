const hooks = require('hooks')
const fetch = require('node-fetch')

hooks.before('/{index}/_doc/{id} > DELETE > 200 > application/json', function (transaction, done) {
  // create a document and update transaction URL for the document to be deleted
  fetch(
      `https://${transaction.host}:${transaction.port}/my-index/_doc`, {
        method: 'POST',
        headers: {
          Authorization: transaction.request.headers.Authorization,
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          _x: '1'
        })
      })
    .then((response) => {
      response.json().then((body) => {
        transaction.fullPath = `/my-index/_doc/${body._id}`
        done()
      })
    })
    .catch((error) => {
      transaction.fail = error
      done()
    })
})
