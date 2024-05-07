const hooks = require('hooks')

hooks.beforeAll(function (transactions) {
  // disable TLS verification, https://github.com/apiaryio/dredd/issues/913#issuecomment-381419699
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
})
