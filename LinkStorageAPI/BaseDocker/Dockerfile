FROM ubuntu
WORKDIR /usr/src
RUN rm -rf /var/lib/apt/list/*
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install libgl1-mesa-glx python3-pip -y
RUN apt-get install software-properties-common -y && apt-get update

RUN apt-get install xvfb wget xfonts-75dpi libxrender1 fontconfig dcmtk -y
RUN wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.5/wkhtmltox_0.12.5-1.bionic_amd64.deb
RUN dpkg -i wkhtmltox_0.12.5-1.bionic_amd64.deb

RUN apt-get install locales language-pack-ko -y
RUN locale-gen ko_KR.UTF-8
ENV LANG ko_KR.UTF-8
ENV LANGUAGE ko_KR.UTF-8
RUN update-locale LANG=ko_KR.UTF-8

RUN apt-get update && apt-get install python-dev libmysqlclient-dev -y

RUN mkdir /usr/src/images
RUN mkdir /usr/cert

RUN pip3 install --upgrade pip
ADD . .
RUN pip3 install -r requirements.txt