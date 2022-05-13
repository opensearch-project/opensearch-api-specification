const hooks = require('hooks');

hooks.before("/_cat/nodes > GET > 200 > application/json",function(transactions,done){
    transactions.expected.headers['Content-Type'] =  "application/json; charset=UTF-8";
    done();
});
