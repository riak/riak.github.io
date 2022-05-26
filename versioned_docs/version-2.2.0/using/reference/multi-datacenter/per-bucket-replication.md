---
title: "Per Bucket"
id: managing_ref_mdc_per_bucket
slug: per-bucket-replication
sidebar_position: 1
---

To enable or disable replication per bucket, you can use the `repl`
bucket property.

Some changes have occurred between 1.1 and 1.2.

These `repl` values are available in Riak Enterprise version 1.1 and
above:

  * `true` --- Enable replication (realtime + fullsync)
  * `false` --- Disable replication (realtime + fullsync)

These option values are only available in Riak Enterprise version 1.2
and above:

  * `realtime` --- Replication only occurs in realtime for this bucket
  * `fullsync` --- Replication only occurs during a fullsync operation
  * `both` --- Replication occurs in realtime and during fullsync

### Example of Disabling

```bash
curl -v -XPUT http://127.0.0.1:8098/buckets/my_bucket \
  -H "Content-Type: application/json" \
  -d '{"props":{"repl":false}}'
```

### Example of Enabling

```bash
curl -v -XPUT http://127.0.0.1:8098/buckets/my_bucket \
  -H "Content-Type: application/json" \
  -d '{"props":{"repl":true}}'
```

## How Bucket Properties Work in Riak Enterprise

When using Multi-Datacenter Replication, each bucket's write properties
are derived from the bucket's properties in the destination cluster. If
the bucket doesn't exist, the default properties of the destination
cluster are used.

It's important to note that this goes for properties such as `backend`.
If the bucket doesn't exist in the destination cluster, Riak will create
it with the default backend and _not_ with the backend used in the
source cluster.
