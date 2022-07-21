# Notification-service-playground

For running client 1: Go to client1 folder and run docker run -p 8081:80 -v $(pwd):/usr/share/nginx/html nginx and then hit localhost:8081/clien1.html

For running client 2: Go to client2 folder and run docker run -p 8082:80 -v $(pwd):/usr/share/nginx/html nginx and then hit localhost:8081/clien2.html

For running server : Go to ws-server folder and run node server.js
