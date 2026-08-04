#!/bin/bash

set -e



MAIL_DOMAIN=${MAIL_DOMAIN:-transfersinbarcelona.com}

MAIL_HOSTNAME=${MAIL_HOSTNAME:-mail.transfersinbarcelona.com}

DKIM_SELECTOR=${DKIM_SELECTOR:-s1}



echo "Configuring Postfix for $MAIL_HOSTNAME..."



# Basic Postfix configuration

postconf -e "myhostname = $MAIL_HOSTNAME"

postconf -e "mydomain = $MAIL_DOMAIN"

postconf -e "myorigin = \$mydomain"

postconf -e "inet_interfaces = all"

postconf -e "inet_protocols = ipv4"

postconf -e "mydestination = localhost"

postconf -e "relayhost ="



# Security and limits

postconf -e "smtpd_banner = \$myhostname ESMTP"

postconf -e "disable_vrfy_command = yes"

postconf -e "smtpd_helo_required = yes"



# Let internal docker networks relay emails without auth

# 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16

postconf -e "mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128 10.0.0.0/8 172.16.0.0/12 192.168.0.0/16"

postconf -e "smtpd_relay_restrictions = permit_mynetworks, reject_unauth_destination"



# Configure OpenDKIM connection

postconf -e "smtpd_milters = inet:127.0.0.1:8891"

postconf -e "non_smtpd_milters = inet:127.0.0.1:8891"

postconf -e "milter_default_action = accept"



# OpenDKIM Key Generation if not exists

KEY_DIR="/etc/opendkim/keys/$MAIL_DOMAIN"

if [ ! -f "$KEY_DIR/$DKIM_SELECTOR.private" ]; then

    echo "Generating DKIM keys for $MAIL_DOMAIN with selector $DKIM_SELECTOR..."

    mkdir -p "$KEY_DIR"

    opendkim-genkey -b 2048 -d "$MAIL_DOMAIN" -s "$DKIM_SELECTOR" -D "$KEY_DIR"

    chown -R opendkim:opendkim "$KEY_DIR"

    

    echo "=========================================================="

    echo "DKIM PUBLIC KEY (Add this to your DNS as a TXT record):"

    cat "$KEY_DIR/$DKIM_SELECTOR.txt"

    echo "=========================================================="

fi



# Configure OpenDKIM tables

echo "127.0.0.1" > /etc/opendkim/TrustedHosts

echo "localhost" >> /etc/opendkim/TrustedHosts

echo "$MAIL_DOMAIN" >> /etc/opendkim/TrustedHosts

echo "$MAIL_HOSTNAME" >> /etc/opendkim/TrustedHosts

echo "*.${MAIL_DOMAIN}" >> /etc/opendkim/TrustedHosts



echo "$DKIM_SELECTOR._domainkey.$MAIL_DOMAIN $MAIL_DOMAIN:$DKIM_SELECTOR:$KEY_DIR/$DKIM_SELECTOR.private" > /etc/opendkim/KeyTable

echo "*@$MAIL_DOMAIN $DKIM_SELECTOR._domainkey.$MAIL_DOMAIN" > /etc/opendkim/SigningTable



chown -R opendkim:opendkim /etc/opendkim



# Start OpenDKIM

echo "Starting OpenDKIM..."

opendkim -x /etc/opendkim/opendkim.conf



# Start Postfix in foreground

echo "Starting Postfix..."

postfix start-fg