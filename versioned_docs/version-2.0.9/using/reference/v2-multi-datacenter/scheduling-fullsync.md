---
title: "Scheduling Fullsync"
id: managing_ref_v2_fullsync
slug: scheduling-fullsync 
sidebar_position: 1
---

:::note Deprecation Warning
v2 Multi-Datacenter Replication is deprecated and will be removed in a future version. Please use [v3](../../../using/reference/v3-multi-datacenter/architecture.md) instead.
:::

## Scheduling Fullsync Operation

With the `pause` and `resume` commands it is possible to limit the
fullsync operation to off-peak times. First, disable `fullsync_interval`
and set `fullsync_on_connect` to `false`. Then, using cron or something
similar, execute the commands below at the start of the sync window.
In these examples, the commands are combined in a `.sh` or analogous
file:

```bash
#!/bin/sh

## Resume from where we left off
riak-repl resume-fullsync

## Start fullsync if nothing is running
riak-repl start-fullsync
```

At the end of the sync window:

```bash
#!/bin/sh

## Stop fullsync until start of next sync window
riak-repl pause-fullsync
```
