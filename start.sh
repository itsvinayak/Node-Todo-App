sudo docker build -t nodejs_app . &&
sudo docker run -p 3000:3000 -d -v /home/vinayak/Documents/node_docker/todo:/app/todo --rm --name node_todo_app nodejs_app:latest