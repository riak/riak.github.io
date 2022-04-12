---
title: "Bucket Types"
id: usage_bucket_types
slug: bucket-types 
sidebar_position: 8
---

If you ever need to turn off indexing for a bucket, set the
`search_index` property to the `_dont_index_` sentinel value.

## Bucket Properties

Although we recommend that you use all new buckets under a bucket type,
if you have existing data with a type-free bucket (i.e. under the
`default` bucket type) you can set the `search_index` property for a
specific bucket.

### Java

```java
Namespace catsBucket = new Namespace("cats");
StoreBucketPropsOperation storePropsOp = new StoreBucketPropsOperation.Builder(catsBucket)
        .withSearchIndex("famous")
        .build();
client.execute(storePropsOp);
```

### Ruby 

```ruby
bucket = client.bucket('cats')
bucket.properties = {'search_index' => 'famous'}
```

### PHP 

```php
(new \Basho\Riak\Command\Builder\Search\AssociateIndex($riak))
    ->withName('famous')
    ->buildBucket('cats')
    ->build()
    ->execute();
```

### Python

```python
bucket = client.bucket('cats')
bucket.set_properties({'search_index': 'famous'})
```

### C# 

```c#
var properties = new RiakBucketProperties();
properties.SetSearchIndex("famous");
var rslt = client.SetBucketProperties("cats", properties);
```

### JavaScript 

```javascript
var bucketProps_cb = function (err, rslt) {
    if (err) {
        throw new Error(err);
    }
    // success
};

var store = new Riak.Commands.KV.StoreBucketProps.Builder()
    .withBucket("cats")
    .withSearchIndex("famous")
    .withCallback(bucketProps_cb)
    .build();

client.execute(store);
```

### Erlang 

```erlang
riakc_pb_socket:set_search_index(Pid, <<"cats">>, <<"famous">>).
```

### Go 

```go
cmd, err := riak.NewStoreBucketPropsCommandBuilder().
    WithBucketType("animals").
    WithBucket("cats").
    WithSearchIndex("famous").
    Build()
if err != nil {
    return err
}

err = cluster.Execute(cmd)
```

### Curl 

```curl
curl -XPUT $RIAK_HOST/buckets/cats/props \
     -H'content-type:application/json' \
     -d'{"props":{"search_index":"famous"}}'
```
