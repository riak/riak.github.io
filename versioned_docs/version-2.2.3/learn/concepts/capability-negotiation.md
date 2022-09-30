---
title: "Capability Negotiation"
id: learn_concepts_cap_negotiation
slug: capability-negotiation
sidebar_position: 2
---

[glossary vnode]: ../../learn/glossary.md#vnode

[usage mapreduce]: ../../developing/usage/mapreduce.md

In early versions of Riak KV, rolling upgrades from an older version to a newer involved (a) disabling all new features associated with the newer version, and then (b) re-enabling those features once all nodes in the cluster were upgraded.

Rolling upgrades no longer require you to disable and then re-enable features due to the *capability negotiation* subsystem that automatically manages the addition of new features. Using this subsystem, nodes negotiate with each other to automatically determine which versions are supported on which nodes, which allows clusters to maintain normal operations even when divergent versions of Riak KV are present in the cluster.

:::note On Mixed Versions
The capability negotiation subsystem is used to manage mixed versions of Riak KV within a cluster ONLY during rolling upgrades. We strongly recommend not running mixed versions during normal operations.
:::
