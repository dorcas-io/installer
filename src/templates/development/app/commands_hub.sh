#!/bin/bash

# Install dependencies
composer install --prefer-dist --no-scripts --no-dev --no-autoloader && rm -rf /root/.composer

# Copy codebase - already done in volume mount

# Finish composer
composer dump-autoload --no-scripts --no-dev --optimize

# File & Folder permissions
chown -R www-data:www-data /var/www/dorcas-business-hub/storage
chmod -R u=rwx,g=rwx,o=rwx /var/www/dorcas-business-hub/storage
chmod -R u=rwx,g=rwx,o=rwx /var/www/dorcas-business-hub/bootstrap/cache
chmod -R u=rwx,g=rwx,o=rw /var/www/dorcas-business-hub/storage/logs
touch /var/www/dorcas-business-hub/storage/logs/laravel.log
chmod u=rwx,g=rw,o=rw /var/www/dorcas-business-hub/storage/logs/laravel.log
chmod u=rwx,g=rx,o=x /var/www/dorcas-business-hub/artisan