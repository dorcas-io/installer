#!/bin/bash

# Install dependencies
composer install --prefer-dist --no-scripts --no-dev --no-autoloader && rm -rf /root/.composer

# Copy codebase - already done in volume mount

# Finish composer
composer dump-autoload --no-scripts --no-dev --optimize

# File & Folder permissions
chown -R www-data:www-data /var/www/dorcas-business-core/storage
chmod -R u=rwx,g=rwx,o=rwx /var/www/dorcas-business-core/storage
chmod -R u=rwx,g=rwx,o=rw /var/www/dorcas-business-core/storage/logs
touch /var/www/dorcas-business-core/storage/logs/lumen.log && > /var/www/dorcas-business-core/storage/logs/lumen.log
chown www-data:www-data /var/www/dorcas-business-core/storage/logs/lumen.log
chmod u=rwx,g=rw,o=rw /var/www/dorcas-business-core/storage/logs/lumen.log
chmod u=rwx,g=rx,o=x /var/www/dorcas-business-core/artisan
chmod 660 /var/www/dorcas-business-core/storage/oauth-public.key

# RUN php artisan passport:install

mkdir -p /var/log/php/ && touch /var/log/php/dorcas.log