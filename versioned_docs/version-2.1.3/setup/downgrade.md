---
title: "Downgrading"
id: downgrading
slug: downgrading
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[config ref]: ../configuring/reference.md

[concept aae]: ../learn/concepts/active-anti-entropy.md

[aae status]: ../using/admin/riak-admin.md

Downgrades of Riak KV are tested and supported for two feature release versions, with the general procedure being similar to that of a rolling upgrade.

Depending on the versions involved in the downgrade, there are additional steps to be performed before, during, and after the upgrade on on each node. These steps are related to changes or new features that are not present in the downgraded version.

:::note End Of Life Warning
We test and support downgrading for two feature release versions. However, two feature release versions below KV 2.1.4 is 1.4.12. KV 1.4.12 was declared End Of Life (EOL) and no longer supported in November 2015. Please be aware of that if you choose to downgrade.
:::

## Overview

For every node in the cluster:

1. Stop Riak KV.
2. Back up Riak's `etc` and `data` directories.
3. Downgrade the Riak KV.
4. Start Riak KV.
5. Finalize the process.

:::note A Note About the Following Instructions
The below instructions describe the procedures required for a single feature release version downgrade (for instance from 2.1.4 to 2.0.7). In a downgrade between two feature release versions (say 2.1.4 to 1.4.12), the steps for the in-between version must also be performed. For example, a downgrade from 2.1.4 to 1.4.12 requires that the downgrade steps for both 2.1.4 and 2.0.7 are performed.
:::

### General Guidelines

* Riak control should be disabled throughout the rolling downgrade process.
* [Configuration Files][config ref] must be replaced with those of the version being downgraded to.

## General Process

:::note
While the cluster contains mixed version members, if you have not set the cluster to use the legacy AAE tree format, you will see the `bad_version` error emitted to the log any time nodes with differing versions attempt to exchange AAE data (including AAE fullsync).

This is benign and similar to the `not_built` and `already_locked` errors which can be seen during normal AAE operation. These events will stop once the downgrade is complete.
:::note

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

### Start the node & finialize process

4. Start Riak KV:

```bash
riak start
```

5. Verify that transfers have completed 

```bash
riak-admin transfers
```

### Monitor the reindex of the data

After your downgrade, you may want to monitor the build and exchange progress of the AAE trees using the `riak-admin aae-status` and `riak-admin search aae-status` commands.

The **All** column shows how long it has been since a partition exchanged with all of its sibling replicas.  Consult the [`riak-admin aae-status` documentation][aae status] for more information about the AAE status output. 

Once both riak-admin aae-status and riak-admin search aae-status show values in the **All** column, the node will have successfully rebuilt all of the indexed data.
