FROM ubuntu:16.04

# https://ashout.com/enable-coredump-apache2-ubuntu/
# https://httpd.apache.org/docs/current/mod/mpm_common.html#coredumpdirectory

RUN	apt-get update && \
	apt-get install -y \
		wget \
		apache2 \
		apache2-doc \
		apache2-dbg libapr1-dbg libaprutil1-dbg gdb && \
	a2enmod \
		headers \
		alias \
		ssl \
		rewrite \
		proxy \
		proxy_html \
		proxy_http \
		xml2enc && \
	mkdir -p /etc/apache2/ssl && \
	rm /var/www/html/* && \
	rm /etc/apache2/sites-enabled/000-default.conf

#RUN cd /tmp && \
#	wget https://dl-ssl.google.com/dl/linux/direct/mod-pagespeed-stable_current_amd64.deb && \
#	dpkg -i mod-pagespeed-stable_current_amd64.deb 
#	
#COPY	pagespeed.conf /etc/apache2/mods-available/pagespeed.conf
	
COPY	ports.conf /etc/apache2/ports.conf
COPY	80-dispatcher.conf /etc/apache2/sites-enabled/80-dispatcher.conf
COPY	dispatcher.conf /etc/apache2/conf-enabled/dispatcher.conf
COPY	dispatcher.any /etc/apache2/conf.d/dispatcher.any

## ADDING Dispatcher file to image

ARG DISPATCHER_FILENAME_TAR_GZ
ARG DISPATCHER_FILENAME_SO

#COPY	${DISPATCHER_FILENAME_SO} /usr/lib/apache2/modules/${DISPATCHER_FILENAME_SO}

ADD http://download.macromedia.com/dispatcher/download/${DISPATCHER_FILENAME_TAR_GZ} /tmp/dispatcher/
RUN tar -xzvf /tmp/dispatcher/${DISPATCHER_FILENAME_TAR_GZ} && \
	mv /tmp/dispatcher/${DISPATCHER_FILENAME_SO} /usr/lib/apache2/modules/

ENV APACHE_DOCUMENTROOT /var/www
ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/web/log/apache2
ENV APACHE_PID_FILE /var/run/apache2.pid
ENV APACHE_RUN_DIR /var/run/apache2
ENV APACHE_LOCK_DIR /var/lock/apache2

ENV DISPATCHER_PUBLISH_PORT 80

## Linking the standard-out and error-out to the AEM logs.
## Doing so enables the "docker log" command to read the logs.
RUN ln -sf /dev/stdout /var/log/apache2/access.log
RUN ln -sf /dev/stderr /var/log/apache2/error.log

CMD /usr/sbin/apache2ctl -D FOREGROUND
