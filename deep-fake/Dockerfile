FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=en_US.UTF-8
#ENV LEVEL=1

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN export DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt install python-pip python build-essential cmake libgtk-3-dev libboost-all-dev nodejs -y
RUN apt-get install libopencv-dev python-opencv -y

# Build fakebook frontend
#RUN nodejs -V
#RUN cd fakebook
#RUN npm i
#RUN npm run build

RUN python -v
RUN pip install pipenv
RUN pipenv install

# Make port 8080 available to the world outside this container
EXPOSE 8080


# Run app.py when the container launches
CMD pipenv run python ./main.py
