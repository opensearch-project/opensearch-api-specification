const https = require('https');
const fetch = require('node-fetch')
const hooks = require('hooks');
const fs = require('fs')

var host = "";
var protocol = "https";
var auth = "";

// Reading .txt file to set URL  
const data = fs.readFileSync('url.txt', {encoding:'utf8', flag:'r'});
function address()
{
    text = data.toString();
    text = text.split(" ");
    host = text[0].substring(8,text[0].length);
    auth = text[1];
    return (protocol + "://" + auth + "@" + host); 
}
// POST SEARCH

hooks.before("/_search > POST > 200 > application/json",function(transactions,done) {
    transactions.expected.headers['Content-Type'] =  "application/json; charset=UTF-8";
  
    const request = async () => {
  
      hooks.log("CREATE CLUSTER BEFORE POST SEARCH API.");
      var url = address();
      const response = await fetch(url+'/books',{
      method: 'PUT',
      body:JSON.stringify({
          settings : {
           index: {
              number_of_shards:1,
              number_of_replicas:0
              }
          }    
      }),
      headers:{
          "content-type": "application/json; charset=UTF-8"
         }
      });
      
      const json = await response.json();
      hooks.log(json);
  
      var query = {
        query: {
          match_all: {}
        },
        fields: ["*"]
      }
  
      transactions.request.body = JSON.stringify(query);
      hooks.log(JSON.stringify(query));
      done();
    }
  
    request();
  
  
  });
  
  hooks.after("/_search > POST > 200 > application/json",function(transactions,done){
  
    const request = async () => {
      
      hooks.log("DELETE CLUSTER AFTER COMPLETE VALIDATION POST SEARCH API.");
      
      var url = address();
      const response = await fetch(url+'/books',{
        method: 'DELETE'
      });
  
      const json = await response.json();
      hooks.log(json);
      done();
    } 
    
    request();
  
  });