FROM ubuntu:16.04

# https://ashout.com/enable-coredump-apache2-ubuntu/
# https://httpd.apache.org/docs/current/mod/mpm_common.html#coredumpdirectory

RUN	apt-get update && \
	apt-get install -y \
		wget \
		apache2 \
		apache2-doc \
		apache2-dbg libapr1-dbg libaprutil1-dbg gdb \
		cron \
		rsync \
		lsof && \
	a2enmod \
		headers \
		alias \
		ssl \
		rewrite \
		proxy \
		proxy_html \
		proxy_http \
		xml2enc &&\
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

ENV DISPATCHER_FILENAME_TAR_GZ=$DISPATCHER_FILENAME_TAR_GZ
ENV DISPATCHER_FILENAME_SO=$DISPATCHER_FILENAME_SO

#COPY	${DISPATCHER_FILENAME_SO} /usr/lib/apache2/modules/${DISPATCHER_FILENAME_SO}

ADD http://download.macromedia.com/dispatcher/download/${DISPATCHER_FILENAME_TAR_GZ} /tmp/dispatcher/
RUN cd /tmp/dispatcher && \
    tar -xzvf ${DISPATCHER_FILENAME_TAR_GZ} && \
	mv /tmp/dispatcher/${DISPATCHER_FILENAME_SO} /usr/lib/apache2/modules/ && \
	rm -rf /tmp/dispatcher && \
	chown root:root /usr/lib/apache2/modules/${DISPATCHER_FILENAME_SO} && \
	chmod 644 /usr/lib/apache2/modules/${DISPATCHER_FILENAME_SO} 


ENV APACHE_DOCUMENTROOT /var/www
ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2
ENV APACHE_PID_FILE /var/run/apache2.pid
ENV APACHE_RUN_DIR /var/run/apache2
ENV APACHE_LOCK_DIR /var/lock/apache2

ENV DISPATCHER_PUBLISH_PORT 80


## Custom changes - create folder
RUN mkdir -p /var/www/cache && \
    mkdir -p /var/log/apache2 && \
	mkdir -p /var/coredumpsync && \
	mkdir -p /var/coredumps && \
	chown -R www-data:www-data /var/coredumps && \
	chmod a+w /var/coredumps
 
## Create CRON-Job to Sync Coredumps
RUN mkdir /etc/cronsync && \
	echo "rsync -rtvu --delete /var/coredumps/ /var/coredumpsync/" > /etc/cronsync/sync_coredumps && \
	chmod +x /etc/cronsync/sync_coredumps && \
	(crontab -l 2>/dev/null; echo "* * * * * /etc/cronsync/sync_coredumps") | crontab -
	


 
## Custom changes - set ULIMIT
ENV APACHE_ULIMIT_MAX_FILES='ulimit -n 131072'

## Enable Coredumps
#RUN echo '/var/coredumps/core-%e-%s-%u-%g-%p-%t' | tee /proc/sys/kernel/core_pattern 
#RUN sysctl -w kernel.core_pattern=/var/coredumps/core-%e-%s-%u-%g-%p-%t
RUN touch /etc/sysctl.d/60-core-pattern.conf && \
	echo "kernel.core_pattern=/var/coredumps/core.%e.%p.%h.%t" > /etc/sysctl.d/60-core-pattern.conf && \
	sysctl --system

## Linking the standard-out and error-out to the AEM logs.
## Doing so enables the "docker log" command to read the logs.
RUN ln -sf /dev/stdout /var/log/apache2/access.log
RUN ln -sf /dev/stderr /var/log/apache2/error.log
   

CMD ["sh","-c","cron && /usr/sbin/apache2ctl -D FOREGROUND"]