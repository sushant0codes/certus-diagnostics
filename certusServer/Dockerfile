FROM php:8.2-apache

RUN docker-php-ext-install pdo_mysql \
    && a2enmod rewrite

COPY api/ /var/www/html/api/
COPY api/index.php /var/www/html/index.php
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf

# The PHP upload endpoints use /public/uploads relative to the API's parent.
RUN ln -s /var/www/html/api/public /var/www/html/public \
    && mkdir -p /var/www/html/api/public/uploads/reports \
    && chown -R www-data:www-data /var/www/html/api/public/uploads
