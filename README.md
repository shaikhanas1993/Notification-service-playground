# Notification-service-playground

For running client 1: Go to whiteLable1 folder and run docker run -p 8081:80 -v $(pwd):/usr/share/nginx/html nginx and then hit localhost:8081/client1.html and localhost:8081/client2.html

For running client 2: Go to whiteLable2 folder and run docker run -p 8082:80 -v $(pwd):/usr/share/nginx/html nginx and then hit localhost:8082/client1.html & localhost:8082/client2.html

For running server : Go to ws-server folder and run node server.js
