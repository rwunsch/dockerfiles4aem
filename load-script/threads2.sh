#!/bin/bash

export JAVA_HOME=/opt/jdk
export PATH=$PATH:/opt/jdk/bin

open_sem(){
    mkfifo pipe-$$
    exec 3<>pipe-$$
    rm pipe-$$
    local i=$1
    for((;i>0;i--)); do
        printf %s 000 >&3
    done
}
run_with_lock(){
    local x
    read -u 3 -n 3 x && ((0==x))
    (
     ( "$@"; )
    printf '%.3d' $? >&3
    )&
}

N=3
open_sem $N

LAST_RUN=0
while true; do
  if [ $(date --date="-30 minutes" +"%s") -gt ${LAST_RUN} ]; then
    LAST_RUN=$(date +"%s")
    echo "Start replaying request.log"
    for site in $(java -jar /opt/aem/crx-quickstart/opt/helpers/rlog.jar /opt/aem/crx-quickstart/logs/request.log.$(date --date="yesterday" +"%Y-%m-%d") | grep " 200 GET " | grep -o -P "/content/.*\.html" | sort | uniq) ; do
      run_with_lock curl -s http://127.0.0.1${site} -o /dev/null $thing
    done
    echo "Finished replaying request.log"
  fi
  sleep 300
done
