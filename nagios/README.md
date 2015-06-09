Nagios
------

![nrpe diagram](https://exchange.nagios.org/components/com_mtree/img/listings/m/93.png)

The nagios install consists of installing `nagios3` and the `check_nrpe`
plugin on the monitoring server. `check_nrpe` is responsible for running
programs on external servers and returning the output. The external servers
must also run an nrpe daemon to handle those incoming connections.

### On the monitoring server

``` 
apt-get install nagios3 apache2 php5 nagios-nrpe-plugin
```



### On the computer node

```
apt-get install nagios-nrpe-server nagios-plugins libnagios-plugin-perl
```
**note:** There is a nasty bug with `check_nrpe` which limits the size of the
output that can
be returned from a plugin to 1kb. As a countermeasure the plugin has a flag in
the source to compress its
output.


