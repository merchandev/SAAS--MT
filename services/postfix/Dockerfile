FROM alpine:3.19

# Install Postfix, OpenDKIM, bash and other utilities
RUN apk add --no-cache postfix postfix-pcre opendkim opendkim-utils bash curl ca-certificates tzdata

# Create necessary directories
RUN mkdir -p /etc/opendkim/keys /var/spool/mail-events /var/run/opendkim
RUN chown -R opendkim:opendkim /etc/opendkim /var/run/opendkim
RUN chown -R postfix:postfix /var/spool/mail-events

# Copy scripts
COPY entrypoint.sh /entrypoint.sh
COPY save-mail-event.sh /usr/local/bin/save-mail-event.sh
RUN chmod +x /entrypoint.sh /usr/local/bin/save-mail-event.sh

# Copy default configs (will be overridden/templated in entrypoint)
COPY master.cf /etc/postfix/master.cf
COPY opendkim.conf /etc/opendkim/opendkim.conf

# Postfix ports (25 for direct, 587 for Submission)
EXPOSE 25 587

CMD ["/entrypoint.sh"]
