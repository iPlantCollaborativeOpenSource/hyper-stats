Install
=======

Libvirt
-------

Nagios will use the check_nrpe command to execute our nagios plugin
`libvirt/virt-stats.py`.

Nagios plugins are just an executable that writes to stdout accoring to the
[nagios plugin spec](http://nagios.sourceforge.net/docs/3_0/pluginapi.html).

The script must be executed as root in order for libvirt to access the
hypervisor. 

The plugin has been tested on libvirt versions 0.9.8 and up. 

Check version of libvirt:
```
root# /usr/sbin/libvirtd --version
/usr/sbin/libvirtd (libvirt) 1.1.1
```
Install python libvirt bindings:
```
> apt-get python-libvirt
```
Test output of plugin:
```
root# /path/to/hyper-stats/libvirt/virt-stats.py
```

If issues persist with libvirt, see these ubuntu packages:
libvirt-bin:    programs for the libvirt library
libvirt-dev:    development files for the libvirt library
libvirt0:       library for interfacing with different virtualization systems

For issues with the plugin, see the 
[python libvirt bindings](http://libvirt.org/python.html).

patches/PR's welcome :)

Nagios
------
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
