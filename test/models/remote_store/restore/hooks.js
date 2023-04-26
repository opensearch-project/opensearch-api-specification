const https = require('https');
const fetch = require('node-fetch')
const hooks = require('hooks');
const fs = require('fs');

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

// Remote Storage Restore

hooks.before("/_remotestore/_restore > POST > 200 > application/json", function(transactions, done) {
    transactions.expected.headers['Content-Type'] =  "application/json; charset=UTF-8";

    const request = async () => {

        var url = address();

        // Register repository for remote store
        await fetch(url + '/_snapshot/books-repo', {
            method: 'PUT',
            body: JSON.stringify({
                type: 'fs',
                settings: {
                    location: '/mnt/snapshots'
                }
            }),
            headers: {
                "content-type": "application/json; charset=UTF-8"
            }
        });

        // Create an index configured for remote store
        await fetch(url + '/books', {
            method: 'PUT',
            body: JSON.stringify({
                settings : {
                    index: {
                        number_of_shards: 1,
                        number_of_replicas: 0,
                        replication: {
                            type: 'SEGMENT'
                        },
                        remote_store: {
                            enabled: true,
                            repository: 'books-repo'
                        }
                    }
                }    
            }),
            headers: {
                "content-type": "application/json; charset=UTF-8"
            }
        });

        // Close the index
        await fetch(url + '/books/_close', {
            method: 'POST'
        });
      
        done();
    }

    request();
});
  
hooks.after("/_remotestore/_restore > POST > 200 > application/json", function(transactions, done) {
  
    const request = async () => {
      
        var url = address();
        
        // Delete index
        await fetch(url + '/books', {
            method: 'DELETE'
        });

        // Delete repository
        await fetch(url + '/_snapshot/books-repo', {
            method: 'DELETE'
        });

        done();
    }  
    request();
});

