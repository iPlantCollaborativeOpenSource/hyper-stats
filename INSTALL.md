Install
=======

Throughout this document "compute node" will refer to the physical machine running a hypervisor. The other system mentioned is the "central server", a single machine which collects all the stats from the compute nodes.

Libvirt
-------

Nagios will use the `check_nrpe` command to execute the nagios plugin
`libvirt/virt-stats.py` on the compute nodes in your cloud. Below details
testing the plugin on a compute node. Requirements include libvirt
and the python bindings for its C api.

###Check version of libvirt:
The plugin has been tested on libvirt-0.9.8+
```
root> /usr/sbin/libvirtd --version
```

###Install python libvirt bindings:
```
> apt-get python-libvirt
```
###Test output of plugin:
```
root> /path/to/hyper-stats/libvirt/virt-stats.py
```

If issues persist with libvirt, see these ubuntu packages:
```
libvirt-bin:    programs for the libvirt library
libvirt-dev:    development files for the libvirt library
libvirt0:       library for interfacing with different virtualization systems
```
For issues with the plugin, see the 
[python libvirt bindings](http://libvirt.org/python.html) and the [nagios plugin spec](http://nagios.sourceforge.net/docs/3_0/pluginapi.html).

patches/PR's welcome :)

Nagios
------

![nrpe diagram](https://exchange.nagios.org/components/com_mtree/img/listings/m/93.png)

The nagios install consists of installing `nagios3` and the `check_nrpe` plugin on the central server. `check_nrpe` is responsible for running programs on external servers and returning the output. The external servers must also run an nrpe daemon to handle connections to the nrpe plugin.


### NRPE (central server)

``` 
apt-get install nagios3 apache2 php5 nagios-nrpe-plugin
```

### NRPE (computer node)

```
apt-get install nagios-nrpe-server nagios-plugins libnagios-plugin-perl
```
**note:** There is a nasty bug with `check_nrpe` which limits the size of the output that can
be returned from a plugin to 1kb. As a countermeasure the plugin has a flag in the source to compress its
output.

Graphios
--------
Graphite
--------
d3
--
 - Libvirt generates metrics on each hyperv

 - Nagios aggregates all hyperv metrics
 - Graphios forwards metrics to Graphite 
 - Graphite provides graphing/storage/query of timeseries data 
 - (optional) cubism renders graphite data with d3
