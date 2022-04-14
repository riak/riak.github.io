---
title: "Deleting Objects"
id: usage_deleting_objects
slug: deleting-objects
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The delete command follows a predictable pattern and looks like this:

```
DELETE /types/TYPE/buckets/BUCKET/keys/KEY
```

The normal HTTP response codes for `DELETE` operations are `204 No
Content` and `404 Not Found`. 404 responses are *normal*, in the sense
that `DELETE` operations are idempotent and not finding the resource has
the same effect as deleting it.

Let's try to delete the `genius` key from the `oscar_wilde` bucket
(which bears the type `quotes`):

<Tabs>
<TabItem label="Java" value="java" default>

```java
Location geniusQuote = new Location(new Namespace("quotes", "oscar_wilde"), "genius");
DeleteValue delete = new DeleteValue.Builder(geniusQuote).build();
client.execute(delete);
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
bucket = client.bucket_type('quotes').bucket('oscar_wilde')
bucket.delete('genius')
```

</TabItem>
<TabItem label="PHP" value="php">

```php
(new \Basho\Riak\Command\Builder\DeleteObject($riak))
  ->buildBucket('oscar_wilde', 'quotes')
  ->build()
  ->execute();
```

</TabItem>
<TabItem label="Python" value="python">

```python
bucket = client.bucket_type('quotes').bucket('oscar_wilde')
bucket.delete('genius')
```

</TabItem>
<TabItem label="C#" value="c#">

```c#
var id = new RiakObjectId("users", "random_user_keys", null);
var obj = new RiakObject(id, @"{'user':'data'}",
    RiakConstants.ContentTypes.ApplicationJson);
var rslt = client.Put(obj);
string key = rslt.Value.Key;
id = new RiakObjectId("users", "random_user_keys", key);
var del_rslt = client.Delete(id);
```

</TabItem>
<TabItem label="JavaScript" value="javascript">

```javascript
// continuing from above example
options = {
    bucketType: 'users', bucket: 'random_user_keys',
    key: generatedKey
};
client.deleteValue(options, function (err, rslt) {
    if (err) {
        throw new Error(err);
    }
});
```

</TabItem>
<TabItem label="Erlang" value="erlang">

```erlang
riakc_pb_socket:delete(Pid, {<<"quotes">>, <<"oscar_wilde">>}, <<"genius">>)
```

</TabItem>
<TabItem label="Go" value="go">

```go
// Continuing from above example
cmd, err = riak.NewDeleteValueCommandBuilder().
    WithBucketType("users").
    WithBucket("random_user_keys").
    WithKey(rsp.GeneratedKey).
    Build()

if err != nil {
    fmt.Println(err.Error())
    return
}

if err := cluster.Execute(cmd); err != nil {
    fmt.Println(err.Error())
    return
}
```

</TabItem>
<TabItem label="Curl" value="curl">

```bash
curl -XDELETE http://localhost:8098/types/quotes/buckets/oscar_wilde/keys/genius
```

</TabItem>
</Tabs>

## Client Library Examples

If you are updating an object that has been deleted---or if an update 
might target a deleted object---we recommend that
you first fetch the [causal context](../../learn/concepts/causal-context.md) of the object prior to updating.
This can be done by setting the `deletedvclock` parameter to `true` as
part of the [fetch operation](../../developing/api/protocol-buffers/fetch-object.md). This can also be done
with the official Riak clients for Ruby, Java, and Erlang, as in the
example below:

<Tabs>
<TabItem label="Ruby" value="ruby" default>

```ruby
object.delete
deleted_object = bucket.get('bucket', 'key', deletedvclock: true)
deleted_object.vclock
```

</TabItem>
<TabItem label="Python" value="python">

```python
# It is not currently possible to fetch the causal context for a deleted
# key in the Python client.
```

</TabItem>
<TabItem label="Java" value="java">

```java
Location loc = new Location("<bucket>")
    .setBucketType("<bucket_type>")
    .setKey("<key>");
FetchValue fetch = new FetchValue.Builder(loc)
    .withOption(Option.DELETED_VCLOCK, true)
    .build();
FetchValue.Response response = client.execute(fetch);
System.out.println(response.getVclock().asString());
```

</TabItem>
<TabItem label="Erlang" value="erlang">

```erlang
{ok, Obj} = riakc_pb_socket:get(Pid,
                              {<<"bucket_type">>, <<"bucket">>},
                              <<"key">>,
                              [{deleted_vclock}]).

%% In the Erlang client, the vector clock is accessible using the Obj
%% object obtained above.
```

</TabItem>
<TabItem label="PHP" value="php">

```php
$response = (new \Basho\Riak\Command\Builder\FetchObject($riak))
  ->buildLocation('deleted_key', 'in_some_bucket', 'of_a_certain_type')
  ->build()
  ->execute();

echo $response->getVclock(); // a85hYGBgzGDKBVI8m9WOeb835ZRhYCg1zGBKZM5jZdhnceAcXxYA
```

</TabItem>
</Tabs>
