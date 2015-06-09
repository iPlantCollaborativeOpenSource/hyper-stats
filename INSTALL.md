Install
=======

Throughout this document "compute node" will refer to the physical machine
running a hypervisor. The other system mentioned is the "monitoring server", a
single machine which collects all the stats from the compute nodes.

Libvirt
-------
Nagios uses the `check_nrpe` command to execute the nagios plugin
`libvirt/virt-stats.py` on the compute nodes in your cloud. In turn
the plugin depends on the version of libvirt and its python bindings.

Here is a commmand to check which version of libvirt is installed. The current
plugin supports python bindings from version 0.9.8 and up.
```
root> /usr/sbin/libvirtd --version
```

Fetch the libvirt python bindings.
```
> apt-get python-libvirt
```

Test the plugin. 
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
[python libvirt bindings](http://libvirt.org/python.html) and the [nagios
plugin spec](http://nagios.sourceforge.net/docs/3_0/pluginapi.html).

patches/PR's welcome :)

Nagios
-------

![nrpe diagram](https://exchange.nagios.org/components/com_mtree/img/listings/m/93.png)

The nagios install consists of installing `nagios3` and the `check_nrpe`
plugin on the monitoring server. `check_nrpe` is responsible for running
programs on external servers and returning the output. The external servers
must also run an nrpe daemon to handle those incoming connections.

The nagios install is *involved* see `nagios/README.md`

Graphios
--------
Graphite
--------
d3
--
