counter=1
while [ $counter -le 10 ]
do
    if [ $(curl -s -o /dev/null --head -w "%{http_code}" 'https://admin:admin@localhost:9200' -H 'Content-Type:application/json' --insecure -v) -ne 200 ]; then
        sleep 30s
    else
        # Waiting for security plugin to be initialised and become operational.
        echo  "Waiting for addtional 30 seconds.. for Opensearch domain to be up."
        sleep 30s
        break 
    fi 
    counter=$(( $counter + 1 )) 
done
if [ $counter -eq 11 ]; then
    echo "Unable to connect with OpenSearch URL https://localhost:9200/"
    exit 1
fi

