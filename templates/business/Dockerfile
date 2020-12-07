FROM php:7.2-fpm-alpine


#RUN docker-php-ext-install pdo pdo_mysql mbstring bcmath xml ctype fileinfo json tokenizer curl


# install git
#RUN apt-get update
#RUN apt-get install -y git libxml2-dev

RUN apk add --update \
        git \
        libxml2-dev \
        curl \
    && docker-php-ext-install pdo pdo_mysql

#docker-php-ext-install pdo pdo_mysql mbstring bcmath xml ctype fileinfo json tokenizer curl

#https://github.com/emcniece/docker-wordpress/blob/master/Dockerfile

RUN mkdir bolaji && cd bolaji && git clone https://hostville:sD1AGa-gCdJxPXPb8uVB@gitlab.com/dorcasng/dorcas-base.git


