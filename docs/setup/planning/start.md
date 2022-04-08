---
title: "Start Planning"
id: planning_start
slug: start
sidebar_position: 0
---

[plan backend]: /docs/setup/planning/backend
[plan cluster capacity]: /docs/setup/planning/cluster-capacity
[plan backend bitcask]: /docs/setup/planning/backend/bitcask
[plan bitcask capacity]: /docs/setup/planning/bitcask-capacity-calc

Here are some steps and recommendations designing and configuring your
Riak cluster.

## Backend

Backends are what Riak KV uses to persist data. Different backends have
strengths and weaknesses, so if you are unsure of which backend you
need, read through the [Choosing a Backend][plan backend] tutorial.

## Capacity

[Cluster Capacity Planning][plan cluster capacity] outlines the various elements and variables that should be considered when planning your Riak cluster.

If you have chosen [Bitcask][plan backend bitcask] as your backend, you will also want to run through [Bitcask Capacity Planning][plan bitcask capacity] to help you calculate a reasonable capacity.

## Network Configuration / Load Balancing

There are at least two acceptable strategies for load-balancing requests
across your Riak cluster: **virtual IPs** and **reverse-proxy**.

For **virtual IPs**, we recommend using any of the various VIP
implementations. We don't recommend VRRP behavior for the VIP because
you'll lose the benefit of spreading client query load to all nodes in a
ring.

For **reverse-proxy** configurations (HTTP interface), any one of the
following should work adequately:

* haproxy
* squid
* varnish
* nginx
* lighttpd
* Apache

