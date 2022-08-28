sudo docker network create todo_network &&
sudo docker run -d --rm --name mongo --network todo_network  mongo