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

## Monitoring server

The most important file is `/etc/nagios3/nagios.cfg`. It is responsible for sourcing other config files which contain plugins and descriptions of the hosts and services nagios will monitor.

The general nagios structure is to define some hosts/services, nagios doesn't make a huge distinction between the two. In their definition we list what/how to monitor.

Add the following to `/etc/nagios3/conf.d/hyper-hosts.cfg`. Check that nagios.cfg sources your conf.d/. The fields <HOST NAME> and <IP ADDRESS> must be supplied per compute node you wish to monitor. Notice the service and definition are sourcing other definitions (generic-host and hyper-stats-generic-service). 

    # A single compute node definition
    define host {
        use generic-host
        host_name <HOST NAME>
        address <IP ADDRESS>
    }

    define service {
        use hyper-stats-generic-service
        host_name <HOST NAME>
    }

- add nrpe plugin
- test by calling check_nrpe

## Compute node

- add_nrpe_plugin 
- Check for nrpe config" check_nrpe_cfg 
- Backing up nrpe config" backup_config 
- Extend allowed hosts in config" extend_nag_allowed_hosts 
- Add nrpe virt-stat command" add_nrpe_command 
- Add sudo users entry for virt-stat plugin" update_visudo_allow_nrpe_plugin 
- Commiting changes" postpone 
- Restart nrpe" restart_nrpe

``` 
apt-get install nagios3 apache2 php5 nagios-nrpe-plugin
```


On the compute node:
```
apt-get install nagios-nrpe-server nagios-plugins libnagios-plugin-perl
```
**note:** There is a nasty bug with `check_nrpe` which limits the size of the
output that can
be returned from a plugin to 1kb. As a countermeasure the plugin has a flag in
the source to compress its
output.

Graphios
--------
Graphite
--------
d3
--
