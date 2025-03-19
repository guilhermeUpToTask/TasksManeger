#!/bin/sh
# Substitute environment variables in the template to generate the final config file
envsubst '$SSL_CERTIFICATE $SSL_CERTIFICATE_KEY' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start Nginx
exec nginx -g 'daemon off;'
