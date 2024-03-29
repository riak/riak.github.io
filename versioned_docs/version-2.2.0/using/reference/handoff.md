---
title: "Handoff Reference"
id: managing_ref_handoff
slug: handoff
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[cluster ops handoff]: ../../using/cluster-operations/handoff.md

Riak is a distributed system built with two essential goals in mind:

* **fault tolerance**, whereby a Riak cluster can withstand node
    failure, network partitions, and other events in a way that does not
    disrupt normal functioning, and
* **scalability**, whereby operators can gracefully add and remove nodes
    to/from a Riak cluster

Both of these goals demand that Riak is able to either temporarily or
permanently re-assign responsibility for portions of the keyspace. That
re-assigning is referred to as **intra-cluster handoff** (or simply
**handoff** in our documentation).

## Types of Handoff

Intra-cluster handoff typically takes one of two forms: **hinted
handoff** and **ownership transfer**.

Hinted handoff occurs when a [vnode](../../learn/glossary.md#vnode) temporarily takes over responsibility for some data and then returns that data to its original "owner." Imagine a 3-node cluster with nodes A, B, and C. If node C goes offline, e.g. during a network partition, nodes A and B will pick
up the slack, so to speak, assuming responsibility for node C's
operations. When node C comes back online, responsibility will be handed
back to the original vnodes.

Ownership transfer is different because it is meant to be permanent.
It occurs when a [vnode](../../learn/glossary.md#vnode) no longer belongs to the node on which it's running. This typically happens when the very
makeup of a cluster changes, e.g. when nodes are added or removed from
the cluster. In this case, responsibility for portions of the keyspace
needs to be fundamentally re-assigned.

Both types of handoff are handled automatically by Riak. Operators do
have the option, however, of enabling and disabling handoff on
particular nodes or all nodes and of configuring key aspects of Riak's
handoff behavior. More information can be found below.

## Configuring Handoff

A full listing of configurable parameters can be found in our
[configuration files](../../configuring/reference.md#intra-cluster-handoff)
document. The sections below provide a more narrative description of
handoff configuration.

### SSL

If you want to encrypt handoff behavior within a Riak cluster, you need
to provide each node with appropriate paths for an SSL certfile (and
potentially a keyfile). The configuration below would designate a
certfile at `/ssl_dir/cert.pem` and a keyfile at `/ssl_dir/key.pem`:

<Tabs>

<TabItem label="riak.conf" value="riak.conf" default>

```riakconf
handoff.ssl.certfile = /ssl_dir/cert.pem
handoff.ssl.keyfile = /ssl_dir/key.pem
```

</TabItem>

<TabItem label="app.config" value="app.config">

```erlang
{riak_core, [
    %% Other configs
    {handoff_ssl_options, [
        {certfile, "/ssl_dir/cert.pem"},
        {keyfile, "/ssl_dir/key.pem"}
    ]},
    %% Other configs
]}
```

</TabItem>

</Tabs>

### Port

You can set the port used by Riak for handoff-related interactions using
the `handoff.port` parameter. The default is 8099. This would change the
port to 9000:

<Tabs>

<TabItem label="riak.conf" value="riak.conf" default>

```riakconf
handoff.port = 9000
```

</TabItem>

<TabItem label="app.config" value="app.config">

```erlang
{riak_core, [
    %% Other configs
    {handoff_port, 9000},
    %% Other configs
]}
```

</TabItem>

</Tabs>

### Background Manager

Riak has an optional background manager that limits handoff activity in
the name of saving resources. The manager can help prevent system
response degradation during times of heavy load, when multiple
background tasks may contend for the same system resources. The
background manager is disabled by default. The following will enable it:

<Tabs>

<TabItem label="riak.conf" value="riak.conf" default>

```riakconf
handoff.use_background_manager = on
```

</TabItem>

<TabItem label="app.config" value="app.config">

```erlang
{riak_kv, [
    %% Other configs
    {handoff_use_background_manager, on},
    %% Other configs
]}
```

</TabItem>

</Tabs>

### Maximum Rejects

If you're using Riak features such as [Riak Search](../../developing/usage/search.md),
those subsystems can block handoff of primary key/value data, i.e. data
that you interact with via normal reads and writes.

The `handoff.max_rejects` setting enables you to set the maximum
duration that a [vnode](../../learn/glossary.md#vnode) can be blocked by multiplying the
`handoff.max_rejects` setting by the value of
[`vnode_management_timer`](../../configuring/reference.md#miscellaneous).
Thus, if you set `handoff.max_rejects` to 10 and
`vnode_management_timer` to 5 seconds (i.e. `5s`), non-K/V subsystems
can block K/V handoff for a maximum of 50 seconds. The default for
`handoff.max_rejects` is 6, while the default for
`vnode_management_timer` is `10s`. This would set `max_rejects` to 10:

<Tabs>

<TabItem label="riak.conf" value="riak.conf" default>

```riakconf
handoff.max_rejects = 10
```

</TabItem>

<TabItem label="app.config" value="app.config">

```erlang
{riak_kv, [
    %% Other configs
    {handoff_rejected_max, 10},
    %% Other configs
]}
```

</TabItem>

</Tabs>

### Transfer Limit

You can adjust the number of node-to-node transfers (which includes
handoff) using the `transfer_limit` parameter. The default is 2. Setting
this higher will increase node-to-node communication but at the expense
of higher resource intensity. This would set `transfer_limit` to 5:

<Tabs>

<TabItem label="riak.conf" value="riak.conf" default>

```riakconf
transfer_limit = 5
```

</TabItem>

<TabItem label="app.config" value="app.config">

```erlang
{riak_core, [
    %% Other configs
    {handoff_concurrency, 5},
    %% Other configs
]}
```

</TabItem>

</Tabs>

## Enabling and Disabling Handoff

Handoff can be enabled and disabled in two ways: via configuration or
on the command line.

### Enabling and Disabling via Configuration

You can enable and disable both outbound and inbound handoff on a node
using the `handoff.outbound` and `handoff.inbound` settings,
respectively. Both are enabled by default. The following would disable
both:

<Tabs>

<TabItem label="riak.conf" value="riak.conf" default>

```riakconf
handoff.outbound = off
handoff.inbound = off
```

</TabItem>

<TabItem label="app.config" value="app.config">

```erlang
{riak_core, [
    %% Other configs
    {disable_outbound_handoff, true},
    {disable_inbound_handoff, true},
    %% Other configs
]}
```

</TabItem>

</Tabs>

### Enabling and Disabling Through the Command Line

Check out the [Cluster Operations: Handoff][cluster ops handoff] for steps on enabling and disabling handoff via the command line.
