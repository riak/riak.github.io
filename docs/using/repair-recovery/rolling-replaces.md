---
title: "Rolling Replaces"
id: repair_recover_replace
---

[rolling restarts]: ../../using/repair-recovery/rolling-restart.md/
[add node]: ../../using/cluster-operations/adding-removing-nodes.md

Riak KV functions as a multi-node system, so cluster-level [version upgrades] and [restarts][rolling restarts] can be performed on a node-by-node or *rolling* basis.

The following steps should be undertaken on each Riak KV node that you wish to replace:

1\. Create a free node:

  a\. [Create an additional node][add node] with similar specifications to the other nodes in the cluster.

  b\. Or leave a node that is currently in the cluster:

  ```bash
  riak-admin cluster leave »nodename«
  ```

  After creating a node or leaving a node, wait for all transfers to complete:

  ```bash
  riak-admin transfers
  ```

2\. Join the free node to your cluster:

```bash
riak-admin cluster join »free_node«
```

3\. Next, replace the free node with an existing node:

```bash
riak-admin cluster replace »free_node« »nodename«
```

4\. Then review the cluster transition plan:

```bash
riak-admin cluster plan
```

5\. And commit the changes:

```bash
riak-admin cluster commit
```

6\. Wait for all transfers to complete:

```bash
riak-admin transfers
```

7\. Repeat steps 2-6 above until each node has been replaced.

8\. Join the replaced node back into the cluster or decommission the additional node that was created.
