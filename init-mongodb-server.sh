docker rm -f mongoserver
docker run -d --name mongoserver -v ./mi-mongo-vol:/data/db -p 27017:27017 mongo
docker ps -a
