---
title: "Bucket Types"
id: usage_bucket_types
slug: bucket-types 
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

If you ever need to turn off indexing for a bucket, set the
`search_index` property to the `_dont_index_` sentinel value.

## Bucket Properties

Although we recommend that you use all new buckets under a bucket type,
if you have existing data with a type-free bucket (i.e. under the
`default` bucket type) you can set the `search_index` property for a
specific bucket.

<Tabs>
<TabItem label="Java" value="java" default>

```java
Namespace catsBucket = new Namespace("cats");
StoreBucketPropsOperation storePropsOp = new StoreBucketPropsOperation.Builder(catsBucket)
        .withSearchIndex("famous")
        .build();
client.execute(storePropsOp);
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
bucket = client.bucket('cats')
bucket.properties = {'search_index' => 'famous'}
```

</TabItem>
<TabItem label="PHP" value="php">

```php
(new \Basho\Riak\Command\Builder\Search\AssociateIndex($riak))
    ->withName('famous')
    ->buildBucket('cats')
    ->build()
    ->execute();
```

</TabItem>
<TabItem label="Python" value="python">

```python
bucket = client.bucket('cats')
bucket.set_properties({'search_index': 'famous'})
```

</TabItem>
<TabItem label="C#" value="c#">

```c#
var properties = new RiakBucketProperties();
properties.SetSearchIndex("famous");
var rslt = client.SetBucketProperties("cats", properties);
```

</TabItem>
<TabItem label="JavaScript" value="javascript">

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

</TabItem>
<TabItem label="Erlang" value="erlang">

```erlang
riakc_pb_socket:set_search_index(Pid, <<"cats">>, <<"famous">>).
```

</TabItem>
<TabItem label="Go" value="go">

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

</TabItem>
<TabItem label="Curl" value="curl">

```bash
curl -XPUT $RIAK_HOST/buckets/cats/props \
     -H'content-type:application/json' \
     -d'{"props":{"search_index":"famous"}}'
```

</TabItem>
</Tabs>