hyper-stats
===========

A service to collect VM stats from libvirt.

Overview
--------
hyper-stats is built on several services. 

 - Libvirt generates metrics on each hyperv
 - Nagios aggregates all hyperv metrics
 - Graphios forwards metrics to Graphite 
 - Graphite provides graphing/storage/query of timeseries data 
 - (optional) cubism renders graphite data with d3

```
  User:               Central server:      Compute node:
    _____________       ______________       _________________ 
   |  _________  |     |  __________  |     |  _____________  |
   | | browser | |     | | Graphite | |     | | nrpe_server | |
   |  ---------  | <=> |  ----------  |     |  -------------  |
   |  ____^____  |     |  _____^____  |     |  ______^______  |
   | | cubism  | |     | | Graphios | |     | | nrpe plugin | |
   |  ---------  |     |  ----------  | <=> |  -------------  |
    -------------      |  _____^____  |     |  ______^______  |
                       | | Nagios   | |     | | libvirt     | |
                       |  ----------  |     |  -------------  |
                       |  _____^____  |     |  __^__   __^__  |
                       | | nrpe     | |     | | vm1 | | ... | |
                       |  ----------  |     |  -----   -----  |
                        --------------       -----------------
```
Install
-------
See INSTALL.txt.

LICENSE
-------

See LICENSE.txt.
