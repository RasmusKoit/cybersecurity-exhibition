# cybersecurity-exhibition

## Public-Wifi

  Run all these commands in ```public-wifi``` folder

  1. Build attack container ```docker build -t public-attacker -f ./Dockerfile.attacker .```

  2. Run attacker container ```docker run -d --net=host public-attacker```

  3. Build victim container ```docker build -t public-victim -f ./Dockerfile.victim .```

  4. Run victim container ```docker run -d -p 84:3000 public-victim```

  Now the attacker screen is available at ```http://localhost:3001``` and victim can be accessed under ```http://localhost:84```

  It would be great if there is a way to run second command as ```docker run -d -p 84:3000 public-attacker```, for some reason, this has not worked yet.

  There is also a possiblity to fake the url to something like ```http://forknite```, but this requires changes in the host machine network config.

## How to run

  1. ```pipenv install```
  
  2. ```pipenv run python ./main.py```

  3. open *localhost:8080* on latest Google Chrome

  4. Profit?
