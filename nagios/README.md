Nagios
------

![nrpe diagram](https://exchange.nagios.org/components/com_mtree/img/listings/m/93.png)

The nagios install consists of installing `nagios3` and the `check_nrpe`
plugin on the monitoring server. `check_nrpe` is responsible for running
programs on external servers and returning the output. The external servers
must also run an nrpe daemon to handle those incoming connections. This guide
is about incorporating nagios with hyper-stats, in general it is not as
complete as documentation solely focused on setting up nagios.

Here are the goals:

- Install/configure nagios
- Install/configure nrpe
- Test the setup


# Install nagios

On the monitoring server install the base packages:
``` 
apt-get install nagios3 apache2 php5 nagios-nrpe-plugin
```

The main config can be found in `/etc/nagios3/nagios.cfg` which is responsible
for defining what services/hosts nagios monitors. In nagios.cfg you should
find a line sourcing all config in `/etc/nagios3/conf.d/`, we will place our
host definitions there. For example, here is the way to create a host and
service. Taken from this repo under `nagios/sample-host.cfg`.
```
define host {
    use generic-host
    host_name <HOSTNAME> 
    address <IP or DOMAIN>
}

define service {
    use virt-generic-service
    host_name <HOSTNAME>
}
```
This defines a single compute node with name `<HOSTNAME>` relying on prior
definitions for generic-host, and virt-generic-service to handle 
boilerplate. Inside `virt-generic-service.cfg`, the `check_command` field defines the
nagios command `virt-stats` to be run. Below is the definition for the command:

```
# 'virt-stats' command definition
define command {
    command_name    virt-stats
    command_line    /usr/lib/nagios/plugins/check_nrpe -H $HOSTADDRESS$ -c "virt-stats" 
}
```

This config is in the repo under `nagios/virt-stats.cfg`. It is common to
place individual command configs under `/etc/nagios-plugins/config/`. Of
course check that this directory is sourced in `nagios.cfg`. The definition can also be
appended to `/etc/nagios3/commands.cfg`. Place it where you like.

`check_nrpe` on the monitoring server will connect to `$HOSTADDRESS$` which is
a nagios variable replaced with the address field of our host definition. In
order for this connection to work, the host must be running an nrpe daemon and
be configured to run the libvirt plugin. If you haven't already, see `README.md`
in the root of the project for installing libvirt and adding the plugin. 

Start nagios:
```
service nagios3 start # restart must be run every time, a nagios .cfg is changed
```

See below to install the necessary daemon and configure it.

# Install nrpe

On the compute node install these base packages:

```
apt-get install nagios-nrpe-server nagios-plugins libnagios-plugin-perl
```
The main config file for `nrpe` is `/etc/nagios/nrpe.cfg`. In order for nrpe
to speak with nagios, the monitoring server must be added as an allowed host. 
Update the defininition for `allowed_hosts` to include the IP of the monitoring server.
```
allowed_hosts=<MONITORING SERVER IP>, ... , ... ,
```
Similar to `nagios.cfg`, `nrpe.cfg` can include other configs. By default it
should include an `nrpe.d` directory. Check for the following include:
```
include_dir=/etc/nagios/nrpe.d/
```

Add the file `nagios/virt-nrpe-cmd.cfg` from the repo into
`/etc/nagios/nrpe.d/`.
```
#virt-nrpe-cmd.cfg
command[virt-stats]=/usr/bin/sudo /usr/lib/nagios/plugins/virt-stats.py
```
From earlier, `virt-stats.py` had to be run with sudo in order to access the
hypervisor. This adds a complication because `check_nrpe` on the monitoring
server must remotely execute a command on the compute node with sudo
priveleges.

We need add an entry into `/etc/sudoers` to allow the nagios user the ability
to execute our plugin as sudo. **NOTE:** do not directly edit `/etc/sudoers`
instead first check:
```
echo $EDITOR # equals an editor you can use
```
then run:
```
sudo visudo # will wrap $EDITOR 
```
This will check your edits before changes are committed. The reason for
visudo, is that incorrect changes to `/etc/sudoers` can disable the ability
to sudo into the machine! `visudo` prevents incorrect changes from being
committed. In `visudo` add the line:
```
nagios ALL=(ALL) NOPASSWD: /usr/lib/nagios/plugins/virt-stats.py
```
Start nrpe.
```
/usr/sbin/nrpe -c /etc/nagios/nrpe.cfg -d 
```
# Test the setup

Before switching back to the monitoring server, verify that the plugin is
installed and returns output. (It can be found in the repo under
`libvirt/virt-stats.py`)
```
/usr/lib/nagios/plugins/virt-stats.py
```

On the **monitoring server**, let's check the host you added. Replace <HOSTNAME> with
the hostname specified in your nagios host definition.
```
/usr/lib/nagios/plugins/check_nrpe -H <HOSTNAME> -c "check_users"
```
This should run the `check_users` default plugin, on the remote host and
return its output, which is equivalent to running
`/usr/lib/nagios/plugins/check_users` on the remote.

Finally check the virt-stats plugin.
```
/usr/lib/nagios/plugins/check_nrpe -H <HOSTNAME> -c "virt-stats"
```
If all goes well, you should expect output in the following format:
```
virt-stats OK - <NUMBER> running of <NUMBER> on <HOSTNAME>.<PROVIDER> | ...
```

**note:** There is a bug with `check_nrpe` which limits the size of the
output that can
be returned from a plugin to 1kb. As a countermeasure the plugin has a flag in
the source to compress its
output.
