FROM ubuntu
WORKDIR /usr/src
RUN rm -rf /var/lib/apt/list/*
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install libgl1-mesa-glx python3-pip -y
RUN apt-get install software-properties-common -y && apt-get update

RUN apt-get install locales language-pack-ko -y
RUN locale-gen ko_KR.UTF-8
ENV LANG ko_KR.UTF-8
ENV LANGUAGE ko_KR.UTF-8
RUN update-locale LANG=ko_KR.UTF-8

RUN apt-get update && apt-get install python-dev libmysqlclient-dev -y

RUN pip3 install --upgrade pip
ADD . .
RUN pip3 install -r requirements.txt