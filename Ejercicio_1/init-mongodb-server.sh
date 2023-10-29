docker rm -f mongoserver
docker run -d --name mongoserver -p 27017:27017 mongo
docker ps -a
