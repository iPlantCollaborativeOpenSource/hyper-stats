```
 __  __    __  __    ______   ______    ______        
/\ \_\ \  /\ \_\ \  /\  __ \ /\  ___\  /\  __ \   ____
\ \  __ \ \ \____ \ \ \  __/ \ \  __\  \ \  __<  /  __\
 \ \_\ \_\ \/\_____\ \ \_\    \ \_____\ \ \_\ \_\ /__ /
  \/_/\/_/  \/_____/  \/_/     \/_____/  \/_/ /_/       
     ______    ______   ______    ______   ______      
    /\  ___\  /\__  _\ /\  __ \  /\__  _\ /\  ___\     
    \ \___  \ \/_/\ \/ \ \  __ \ \/_/\ \/ \ \___  \      
     \/\_____\   \ \_\  \ \_\ \_\   \ \_\  \/\_____\   
      \/_____/    \/_/   \/_/\/_/    \/_/   \/_____/
      
A service to collect VM stats from libvirt.
```

Overview
--------
hyper-stats is built on several services. 

 - Libvirt generates metrics on each hyperv
 - Nagios aggregates all hyperv metrics
 - Graphios forwards metrics to Graphite 
 - Graphite provides graphing/storage/query of timeseries data 
 - d3.js front-end (optional)

```
  User:               Central server:      Compute node:
    _____________       ______________       _________________ 
   |  _________  |     |  __________  |     |  _____________  |
   | | browser | |     | | Graphite | |     | | nrpe_server | |
   |  ---------  | <=> |  ----------  | <=> |  -------------  |
   |  ____^____  |     |  _____^____  |     |  ______^______  |
   | | d3.js   | |     | | Graphios | |     | | nrpe plugin | |
   |  ---------  |     |  ----------  |     |  -------------  |
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
See INSTALL.md.

License
-------

See LICENSE.txt.
