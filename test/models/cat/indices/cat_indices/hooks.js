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

// Cat Indices API

hooks.before("/_cat/indices > GET > 200 > application/json",function(transactions,done){
    transactions.expected.headers['Content-Type'] = "application/json; charset=UTF-8";
    done();
});
  
// Cat Indices with Index
  
hooks.before("/_cat/indices/{index} > GET > 200 > application/json",function(transactions,done) {
    transactions.expected.headers['Content-Type'] =  "application/json; charset=UTF-8";
  
    const request = async () => {

        var url = address();

        // Create an index with non-default settings.
        const cluster = await fetch(url+'/books',{
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
      
        // Adding Document in cluster  
        const document = await fetch(url+'/books/_doc/1',{
            method: 'PUT',
            body:JSON.stringify({
                title: "The Outsider",
                author: "Stephen King",
                year: "2018",
                genre: "Crime fiction"   
            }),
            headers:{
                "content-type": "application/json; charset=UTF-8"
            } 
        });
 
        done();
    }
    request();
});
  
hooks.after("/_cat/indices/{index} > GET > 200 > application/json",function(transactions, done){
  
    const request = async () => {
      
        var url = address();
        // Deleting cluster
        const del = await fetch(url+'/books',{
            method: 'DELETE'
        });

        done();
    }   
    request();
});
