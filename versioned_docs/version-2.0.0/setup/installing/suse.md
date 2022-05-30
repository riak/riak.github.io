---
title: "SUSE"
id: installing_suse
slug: suse 
sidebar_position: 7
---

[install verify]: ../../setup/installing/verify.md

Riak KV can be installed on OpenSuse and SLES systems using a binary package. The following steps have been tested to work with Riak on
the following x86/x86_64 flavors of SuSE:

* SLES11-SP1
* SLES11-SP2
* SLES11-SP3
* SLES11-SP4
* OpenSUSE 11.2
* OpenSUSE 11.3
* OpenSUSE 11.4

## Installing with rpm

```bash
wget http://s3.amazonaws.com/downloads.basho.com/riak/2.2/2.0.0/sles/11/riak-2.0.0-1.SLES11.x86_64.rpm
sudo rpm -Uvh riak-2.0.0-1.SLES11.x86_64.rpm
```

## Next Steps

Now that Riak is installed, check out [Verifying a Riak Installation][install verify].
