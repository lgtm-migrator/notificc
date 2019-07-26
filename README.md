# Notify-Change
#### Send an email from yourself to yourself when a website changes.

## to-do:
* Improve design
* Ensure integers were put on inputs
* Handle high ping
* Handle no internet connection
* Make checker an Object Oriented Thread with Threading Module
* Handle errors on the checker thread
* Documentation
* Change to Pillow instead of OpenCV
* Lower the Docker image size

## Usage (Docker)
1. Pull the docker image (todo)
2. Run with `docker run -d -p 8000:80 -p 8080:8080 joseivanchechen/notify-change`

Access the page at [http://localhost:8000](http://localhost:8000). Port 8080 is where the API will provide/get information.

## Resource usage
Nginx and API uses about 50MB RAM. CPU only grows a little when the checker compares two images.

## Warning
### It's intended to be self-hosted.
Meaning that the API may not work if you run it on a VPS. That's because there's a high probability that the email server will block the logins attempts, returning a 403 response to the login request.