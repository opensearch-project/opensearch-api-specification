const hooks = require('hooks')

hooks.beforeAll(function (transactions) {
  // disable TLS verification, https://github.com/apiaryio/dredd/issues/913#issuecomment-381419699
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
})

hooks.beforeEach(function (transactions) {
  // the spec is application/json without a charset, see https://github.com/opensearch-project/opensearch-api-specification/pull/287
  transactions.expected.headers['Content-Type'] += '; charset=UTF-8'
})
