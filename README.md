<p align="center"> <img src="/static/pub_images/sim_logo.png" width="700"/>

<!-- ![Profile](../static/pub_images/sim_logo.png) -->

# SIM-TAC

This project was built in order to create a platform to streamline learning for users who want to be in the world of Traiding.

This is why SIM-TAC is a tradig simulator with a clean and simple interface in order to learn the operability of the markets without losing real money in the process.

You can see the final product in this link: [SIM-TAC](https://www.sim-tac.tech/)
## Installation:
This project was developed with different technologies, if you want you can download the Docker image that was used as a development environment.
if you dont have docker in your system can you download on this [link](https://www.docker.com/get-started), and then run this command:
```
$ docker pull xtian17/django_image:v.0 #This image includes Nginx, GIT, Python3.7.5, mysql, Django 2.2.13. 
```

After that, you need to run the following commands to run our aplication with MYSQL databases:

```
$ sudo apt-get install python3.7-dev libmysqlclient-dev
$ sudo apt install libpython3.7-dev
$ pip3 install mysqlclient==1.4.6
```

Or if you want, you can install the following tools:
 - Django = 2.2.13
 - python = 3.7
 - python3.7-dev libmysqlclient-dev
 - mysqlclient = 1.4.6

### Usage:
For everything to work properly, you must do the migration to the database, with the following commands:
```
$ python3 manage.py makemigrations
$ python3 manage.py migrate
```
You can run this project with this command:
```
$ python3 manage.py runserver 0:8000
```

<p align="center"> <img src="/Design/portrait.png" width="700"/>
<!-- ![Profile](../Design/portrait.png) -->
<p align="center"> <img src="/Design/app.png" width="700"/>
<!-- ![app](../Design/app.png) -->

## Contributing:

1. Clone repo and create a new branch:
    ```
    git checkout https://github.com/MAZTRO/SIM-TAC.git -b name_of_your_branch
    ```
2. Make change and test
3. Submit Pull Request with comprehensive description og changes.

## Team:

<p align="center"> <img src="/Design/team.png" width="700"/>
<!-- ![Team](../Design/team.png) -->

## Authors:
[Cristian Gomez](https://www.linkedin.com/in/cristian-gomez-566113182/) - 
[Evert Escalante](https://www.linkedin.com/in/evert-escalante-85169a174/) - 
[Jonatan Mazo](https://www.linkedin.com/in/jonatan-ricardo-mazo-castro-75633390/)
