#! /usr/bin/python

# Query libvirt stats on this compute node's vms
# Output is in the form:
# 
#     virt-stats OK - <active> running of <total> on <host> | <instance>=<cpu time>s;<mem>;<rx>B;<tx>B;<state> ...
#
# With the following definitions:
# 
#     active - the number of active instances
#     total - the number of instances
#     host - the hostname of this compute node (contains the hostname)
#     instance - an atmosphere recognized uuid for a guest vm
#     cpu time - seconds an instance has been active
#     mem - a percentage of memory (volatile) used
#     rx - number of bytes read over the network
#     tx - number of bytes written over the network
#     state - a numeral representing various instance states (enumerated below in get_stats)

import libvirt
import sys
import time
import untangle
import zlib

compress = False
#compress = True

def get_stats(domain):
    result = ""
 
    info = domain.info()
    num_vcpus = info[3]
    state        = info[0]
    used_mem     = 0
    max_mem      = 0
    mem_ratio    = 0.0
    rx = 0
    tx = 0
    vcpu_time = 0
    
    if (domain.isActive()):
        mem =  domain.memoryStats()
        used_mem = mem['rss']
        max_mem = mem['actual']
        mem_ratio = used_mem / float(max_mem)
        xml = untangle.parse(domain.XMLDesc())
        try:
            iface = xml.domain.devices.interface 
            ifname = xml.domain.devices.interface.target.get_attribute('dev')
            ifinfo = domain.interfaceStats(ifname)
            rx = ifinfo[0]
            tx = ifinfo[4]
        except:
            pass
        for vcpu in domain.vcpus()[0]:
            vcpu_time += vcpu[2]
    
        vcpu_time /= float(num_vcpus * 1e9)
        
    
    # state | defn
    # =============
    #   0   | no state
    #   1   | the domain is running
    #   2   | the domain is blocked on resource
    #   3   | the domain is paused by user
    #   4   | the domain is being shut down
    #   5   | the domain is shut off
    #   6   | the domain is crashed
    #   7   | the domain is suspended by guest power management
    
    result += "%s=%s;%s;%s;%s;%s; " % (domain.UUIDString(),"%.1fs" % vcpu_time,"%.1f" % mem_ratio,"%dB" % rx,"%dB" % tx, "%d" % state)

    if compress:
	    return zlib.compress(result[:-1], 9)
    else:
	    return result[:-1]

def vcpu_usage(dom): 

    if (not dom.isActive()):
        return 0.0

    delay = 0.1
    then = time.time()
    cpuThen = dom.vcpus()[0][0][2]
    time.sleep(delay)
    now = time.time()
    cpuNow = dom.vcpus()[0][0][2]

    float_cpu = (cpuNow - cpuThen) / ( (now - then) * 1000.0 * 1000.0 * 1000.0 * dom.info()[3])

    return min(1.0, max(0.0, float_cpu))


conn = libvirt.openReadOnly(None)
if conn == None:
    print "virt-stats ERROR - Cannot connect to libvirt"
    sys.exit(2)
else:
    try:
	domains = conn.listAllDomains()
    except:
	domains = map(lambda _id: conn.lookupByID(_id), conn.listDomainsID())

    numActive = len(filter(lambda d: d.isActive(), domains))
    stats = " ".join([ get_stats(d) for d in  domains ])
    print "virt-stats OK - %d running of %d on %s | %s" % (numActive, len(domains), conn.getHostname(), stats)
