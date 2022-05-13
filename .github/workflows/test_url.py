import os

for i in range(0,6):
    command = "curl 'https://admin:admin@localhost:9200' -H 'Content-Type:application/json' --insecure -v"
    result = os.system(command)
    if result !=0:
        os.system("sleep 30s")
    else:
        os.system("sleep 30s")
        break  
     