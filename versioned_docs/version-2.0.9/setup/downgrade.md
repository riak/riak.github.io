---
title: "Downgrading"
id: downgrading
slug: downgrading
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[rolling upgrade]: ./upgrading/cluster.md

[config ref]: ../configuring/reference.md

[concept aae]: ../learn/concepts/active-anti-entropy.md

[aae status]: ../using/admin/riak-admin.md

Downgrades of Riak KV are tested and generally supported for two feature release versions (see warning below), with the general procedure being similar to that of a [rolling upgrade][rolling upgrade].

Depending on the versions involved in the downgrade, there are additional steps to be performed before, during, and after the upgrade on on each node. These steps are related to changes or new features that are not present in the downgraded version.

:::note End Of Life Warning
We test downgrading for two feature release versions. However, all versions below KV 2.0 are End Of Life (EOL) and unsupported. Please be aware of that if you choose to downgrade.
:::

## Overview

For every node in the cluster:

1. Stop Riak KV.
2. Back up Riak's `etc` and `data` directories.
3. Downgrade the Riak KV.
4. Start Riak KV.
5. Finalize process.

### Guidelines

* Riak control should be disabled throughout the rolling downgrade process.
* [Configuration Files][config ref] must be replaced with those of the version being downgraded to.

### Components That Complicate Downgrades

| Feature                                 | automatic | required | Notes                                                       |
|:----------------------------------------|:---------:|:--------:|:------------------------------------------------------------|
| Active Anti-Entropy file format changes |     ✔     |          | Can be opted out using a [capability](#aae_tree_capability) |

If you enabled LZ4 compression in LevelDB and/or enabled global expiration in LevelDB when you installed KV 2.0.9, you cannot downgrade

## General Process

:::note
While the cluster contains mixed version members, if you have not set the cluster to use the legacy AAE tree format, you will see the `bad_version` error emitted to the log any time nodes with differing versions attempt to exchange AAE data (including AAE fullsync).

This is benign and similar to the `not_built` and `already_locked` errors which can be seen during normal AAE operation. These events will stop once the downgrade is complete.
:::

### Stop Riak KV, back up, & downgrade

1. Stop Riak KV:

```bash
riak stop
```

2. Back up your Riak KV /etc and /data directories:

```bash
sudo tar -czf riak_backup.tar.gz /var/lib/riak /etc/riak
```

3. Downgrade Riak KV:

<Tabs>

<TabItem label="RHEL/CentOS" value="rhel/centos" default>

```RHEL/CentOS
sudo rpm -Uvh »riak_package_name«.rpm
```

</TabItem>

<TabItem label="Ubuntu" value="ubuntu">

```Ubuntu
sudo dpkg -i »riak_package_name«.deb
```

</TabItem>

</Tabs>

### Start the node & finalize process.

4. Start Riak KV:

```bash
riak start
```

5. Verify that transfers have completed:

```bash
riak-admin transfers
```

## Monitor the reindex of the data

After your downgrade, you may want to monitor the build and exchange progress of the AAE trees using the `riak-admin aae-status` and `riak-admin search aae-status` commands.

The **All** column shows how long it has been since a partition exchanged with all of its sibling replicas.  Consult the [`riak-admin aae-status` documentation][aae status] for more information about the AAE status output.

Once both riak-admin aae-status and riak-admin search aae-status show values in the **All** column, the node will have successfully rebuilt all of the indexed data.
