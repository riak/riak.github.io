---
title: "Bucket Types"
id: cluster_operations_bucket_types
slug: bucket-types
sidebar_position: 4
---

Buckets are essentially a flat namespace in Riak. They allow the same
key name to exist in multiple buckets and enable you to apply
configurations across keys.

:::note How Many Buckets Can I Have?
Buckets come with virtually no cost *except for when you modify the default
bucket properties*. Modified bucket properties are gossiped around the cluster
and therefore add to the amount of data sent around the network. In other
words, buckets using the `default` bucket type are free. More on that in the
next section.
:::

In Riak versions 2.0 and later, Basho suggests that you [use bucket types](../../developing/usage/bucket-types.md) to namespace and configure all buckets you use. Bucket types have a lower overhead within the cluster than the
default bucket namespace but require an additional setup step on the
command line.

## Creating a Bucket Type

When creating a new bucket type, you can create a bucket type without
any properties and set individual buckets to be indexed. The step below
creates and activates the bucket type:

```bash
riak-admin bucket-type create animals '{"props":{}}'
riak-admin bucket-type activate animals
```

And this step applies the index to the `cats` bucket, which bears the
`animals` bucket type we just created and activated:

```bash
curl -XPUT $RIAK_HOST/types/animals/buckets/cats/props \
     -H 'Content-Type: application/json' \
     -d '{"props":{"search_index":"famous"}}'
```

Another possibility is to set the `search_index` as a default property
of the bucket type. This means *any* bucket under that type will
inherit that setting and have its values indexed.

```bash
riak-admin bucket-type create animals '{"props":{"search_index":"famous"}}'
riak-admin bucket-type activate animals
```
