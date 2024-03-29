---
title: "Bucket Types"
id: managing_ref_bucket_types
slug: bucket-types
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Bucket types allow groups of buckets to share configuration details and
for Riak users to manage bucket properties more efficiently than in the
older configuration system based on [bucket properties](../../developing/usage/bucket-types.md#bucket-properties).

:::note Important note on cluster downgrades
If you upgrade a Riak to version 2.0 or later, you can still downgrade the
cluster to a pre-2.0 version *as long as you have not created and activated a
bucket type in the cluster*. Once any bucket type has been created and
activated, you can no longer downgrade the cluster to a pre-2.0 version.
:::

## How Bucket Types Work

The older configuration system, based on bucket properties, involves
setting bucket properties for specific buckets either through
[HTTP](../../developing/api/http/set-bucket-props.md) or [Protocol Buffers](../../developing/api/protocol-buffers/set-bucket-props.md). With this approach, you can take any given bucket and
modify a wide range of properties, from `n_val` to `allow_mult` and far
beyond.

Using bucket *types* also involves dealing with bucket properties, but
with a few crucial differences:

* Bucket types enable you to create bucket configurations and assign
  those configurations to as many buckets as you wish, whereas the
  previous system required configuration to be set on a per-bucket basis
* Nearly all bucket properties can be updated using bucket types, except the
  `datatype` and `consistent` properties, related to
  [Riak data types](../../developing/data-types/index.md), and [strong consistency](../../developing/app-guide/strong-consistency.md) respectively
* Bucket types are more performant than bucket properties because
  divergence from Riak's defaults doesn't have to be gossiped around the
  cluster for every bucket, which means less computational overhead

It is important to note that buckets are not assigned types in the same
way that they are configured when using [bucket properties](../../developing/usage/bucket-types.md#bucket-properties). You cannot simply take a
bucket `my_bucket` and assign it a type the way that you would, say,
set `allow_mult` to `false` or `n_val` to `5`, because there is no
`type` parameter contained within the bucket's properties (i.e.
`props`).

Instead, bucket types are applied to buckets *on the basis of how those
buckets are queried*. Queries involving bucket types take the following
form:

`GET/PUT/DELETE /types/<type>/buckets/<bucket>/keys/<key>`

In the older system, only bucket and key are specified in queries:

`GET/PUT/DELETE /buckets/<bucket>/keys/<key>`

## When to Use Bucket Types

In many respects, bucket types are a major improvement over the older
system of bucket configuration, including the following:

* Bucket types are more flexible because they enable you to define a
  bucket configuration and then change it if you need to.
* Bucket types are more reliable because the buckets that bear a given
  type only have their properties changed when the type is changed.
  Previously, it was possible to change the properties of a bucket only
  through client requests.
* Whereas bucket properties can only be altered by clients interacting
  with Riak, bucket types are more of an operational concept. The
  `riak-admin bucket-type` interface (discussed in depth below) enables
  you to manage bucket configurations on the operations side, without
  recourse to Riak clients.

For these reasons, we recommend *always* using bucket types in versions
of Riak 2.0 and later.

## Managing Bucket Types Through the Command Line

Bucket types are created, updated, activated, and more through the
`riak-admin bucket-type` interface.

Below is a full list of available sub-commands:

| Command    | Action                                                                | Form                   |
|:-----------|:----------------------------------------------------------------------|:-----------------------|
| `create`   | Create or modify a bucket type before activation                      | `create <type> <json>` |
| `activate` | Activate a bucket type                                                | `activate <type>`      |
| `list`     | List all currently available bucket types and their activation status | `list`                 |
| `status`   | Display the status and properties of a specific bucket type           | `status <type>`        |
| `update`   | Update a bucket type after activation                                 | `update <type> <json>` |

### Creating a Bucket Type

Creating new bucket types involves using the `create <type> <json>`
command, where `<type>` is the name of the type and `<json>` is a JSON
object of the following form:

```json
{
  "props": {
    "prop1": "val1",
    "prop2": "val2",
    ...
  }
}
```

> **Getting started with Riak clients**
>
> If you are connecting to Riak using one of Basho's official [client libraries](../../developing/client-libraries.md), you can find more information about getting started with your client in our [Developing with Riak KV: Getting Started](../../developing/getting-started/index.md) section.

If creation is successful, you should see the following output:

    type_using_defaults created

:::note
The `create` command can be run multiple times prior to a bucket type being
activated. Riak will persist only those properties contained in the final call
of the command.
:::

Creating bucket types that assign properties *always* involves passing
stringified JSON to the `create` command. One way to do that is to pass
a JSON string directly. The following creates a bucket type
`n_equals_1`, which sets `n_val` to 1:

```bash
riak-admin bucket-type create n_equals_1 '{"props":{"n_val":1}}'
```

If you wish, you can also pass in a JSON string through a file, such as
a `.json` file:

```bash
riak-admin bucket-type create from_json_file '`cat props.json`'
```

Like all bucket types, this type needs to be activated to be usable
within the cluster.

### Activating a Bucket Type

Activating a bucket type involves the `activate` command from the same
`bucket-type` interface used before:

```bash
riak-admin bucket-type activate my_bucket_type
```

When activation has succeeded, you should see the following output:

    my_bucket_type has been activated

A bucket type can be activated only when the type has been propagated to
all running nodes. You can check on the type's readiness by running
`riak-admin bucket-type status <type_name>`. The first line of output
will indicate whether or not the type is ready.

In a stable cluster, bucket types should propagate very quickly. If,
however, a cluster is experiencing network partitions or other issues,
you will need to resolve those issues before bucket types can be
activated.

### Listing Bucket Types

You can list currently available bucket types using the `list` command:

```bash
riak-admin bucket-type list
```

This will return a simple list of types along with their current status
(either `active` or `not active`). Here is an example console output:

```bash
riak-admin bucket-type list
```

An example response:

    type1 (active)
    type2 (not active)
    type3 (active)

### Checking a Type's Status

You can check on the status---i.e. the configuration details---of a
bucket type using the `status <type>` command:

```bash
riak-admin bucket-type status my_bucket_type
```

The console will output two things if the type exists:

1. Whether or not the type is active
2. The bucket properties associated with the type

If you check the status of a currently active type called
`my_bucket_type` that simply bears a default bucket configuration, the
output will be as follows:

```bash
my_bucket_type is active

active: true
allow_mult: true

... other properties ...

w: quorum
young_vclock:20
```

### Updating a Bucket Type

The `bucket-type update` command functions much like the `bucket-type
create` command. It simply involves specifying the name of the bucket
type that you wish to modify and a JSON object containing the properties
of the type:

```bash
riak-admin bucket-type update type_to_update '{"props":{ ... }}'
```

:::note Immutable Configurations
Any bucket properties associated with a type can be modified after a bucket is
created, with three important exceptions:

* `consistent`
* `datatype`
* `write_once`

If a bucket type entails strong consistency (requiring that `consistent` be
set to `true`), is set up as a `map`, `set`, or `counter`, or is defined as a
write-once  bucket (requiring `write_once` be set to `true`), then this will
be true of the bucket types.

If you need to change one of these properties, we recommend that you simply
create and activate a new bucket type.
:::

## Buckets as Namespaces

In versions of Riak prior to 2.0, all queries are made to a bucket/key
pair, as in the following example read request:

<Tabs>
<TabItem label="Java" value="java" default>

```java
Location myKey = new Location(new Namespace("my_bucket"), "my_key");
FetchValue fetch = new FetchValue.Builder(myKey).build();
client.execute(fetch);
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
bucket = client.bucket('my_bucket')
bucket.get('my_key')
```

</TabItem>
<TabItem label="PHP" value="php">

```php
$location = new Location('my_key', new Bucket('my_bucket'));
(new \Basho\Riak\Command\Builder\FetchObject($riak))
  ->atLocation($location)
  ->build()
  ->execute();
```

</TabItem>
<TabItem label="Python" value="python">

```python
bucket = client.bucket('my_bucket')
bucket.get('my_key')
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var id = new RiakObjectId("my_bucket", "my_key");
client.Get(id);
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
client.fetchValue({ bucket: 'my_bucket', key: 'my_key' }, function (err, rslt) {
});
```

</TabItem>
<TabItem label="Erlang" value="erlang">

```erlang
{ok, Object} = riakc_pb_socket:get(Pid,
                                   <<"my_bucket">>,
                                   <<"my_key">>).
```

</TabItem>
<TabItem label="CURL" value="curl">

```bash
curl http://localhost:8098/buckets/my_bucket/keys/my_key
```

</TabItem>
</Tabs>

With the addition of bucket types in Riak 2.0, bucket types can be used
as *an additional namespace* on top of buckets and keys. The same bucket
name can be associated with completely different data if it used in
accordance with a different type. Thus, the following two requests will
be made to *completely different objects*, even though the bucket and key
names are the same:

<Tabs>
<TabItem label="Java" value="java" default>

```java
Location key1 =
  new Location(new Namespace("type1", "my_bucket"), "my_key");
Location key2 =
  new Location(new Namespace("type2", "my_bucket"), "my_key");
FetchValue fetch1 = new FetchValue.Builder(key1).build();
FetchValue fetch2 = new FetchValue.Builder(key2).build();
client.execute(fetch1);
client.execute(fetch2);
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
bucket1 = client.bucket_type('type1').bucket('my_bucket')
bucket2 = client.bucket_type('type2').bucket('my_bucket')
bucket1.get('my_key')
bucket2.get('my_key')
```

</TabItem>
<TabItem label="PHP" value="php">

```php
$location1 = new \Basho\Riak\Location('my_key', new Bucket('my_bucket', 'type1'));
$location2 = new Location('my_key', new Bucket('my_bucket', 'type2'));
$builder = new \Basho\Riak\Command\Builder\FetchObject($riak);
$builder->atLocation($location1)
  ->build()
  ->execute();
$builder->atLocation($location2)
  ->build()
  ->execute();
```

</TabItem>
<TabItem label="Python" value="python">

```python
bucket1 = client.bucket_type('type1').bucket('my_bucket')
bucket2 = client.bucket_type('type2').bucket('my_bucket')
bucket1.get('my_key')
bucket2.get('my_key')
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var id1 = new RiakObjectId("type1", "my_bucket", "my_key");
var id2 = new RiakObjectId("type2", "my_bucket", "my_key");
var rslt1 = client.Get(id1);
var rslt2 = client.Get(id2);
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
client.fetchValue({
    bucketType: 'type1', bucket: 'my_bucket', key: 'my_key'
}, function (err, rslt) {
});

client.fetchValue({
    bucketType: 'type2', bucket: 'my_bucket', key: 'my_key'
}, function (err, rslt) {
});
```

</TabItem>
<TabItem label="Erlang" value="erlang">

```erlang
{ok, Obj1} = riakc_pb_socket:get(Pid,
                                 {<<"type1">>, <<"my_bucket">>},
                                 <<"my_key">>),
{ok, Obj2} = riakc_pb_socket:get(Pid,
                                 {<<"type2">>, <<"my_bucket">>},
                                 <<"my_key">>).
```

</TabItem>
<TabItem label="CURL" value="curl">

```bash
curl http://localhost:8098/types/type1/buckets/my_bucket/keys/my_key
curl http://localhost:8098/types/type2/buckets/my_bucket/keys/my_key
```

</TabItem>
</Tabs>

:::note Note on object location
In Riak 2.x, *all requests* must be made to a location specified by a bucket
type, bucket, and key rather than to a bucket/key pair, as in previous
versions.
:::

If requests are made to a bucket/key pair without a specified bucket
type, `default` will be used in place of a bucket type. The following
queries are thus identical:

<Tabs>
<TabItem label="Java" value="java" default>

```java
Location withDefaultBucketType =
  new Location(new Namespace("default", "my_bucket"), "my_key");
Location noBucketType =
  new Location(new Namespace("my_bucket"), "my_key");
FetchValue fetch1 = new FetchValue.Builder(withDefaultBucketType).build();
FetchValue fetch2 = new FetchValue.Builder(noBucketType).build();
client.execute(fetch1);
client.execute(fetch2);
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
bucket1 = client.bucket_type('default').bucket('my_bucket')
bucket2 = client.bucket('my_bucket')
bucket1.get('my_key')
bucket2.get('my_key')
```

</TabItem>
<TabItem label="PHP" value="php">

```php
$location1 = new \Basho\Riak\Location('my_key', new Bucket('my_bucket', 'default'));
$location2 = new \Basho\Riak\Location('my_key', new Bucket('my_bucket'));
$builder = new \Basho\Riak\Command\Builder\FetchObject($riak);
$builder->atLocation($location1)
  ->build()
  ->execute();
$builder->atLocation($location2)
  ->build()
  ->execute();
```

</TabItem>
<TabItem label="Python" value="python">

```python
bucket1 = client.bucket_type('default').bucket('my_bucket')
bucket2 = client.bucket('my_bucket')
bucket1.get('my_key')
bucket2.get('my_key')
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var id1 = new RiakObjectId("default", "my_bucket", "my_key");
var obj1 = new RiakObject(id1, "value", RiakConstants.ContentTypes.TextPlain);
client.Put(obj1);

var id2 = new RiakObjectId("my_bucket", "my_key");
var getRslt = client.Get(id2);

RiakObject obj2 = getRslt.Value;
// Note: obj1.Value and obj2.Value are equal
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
var obj1 = new Riak.Commands.KV.RiakObject();
obj1.setContentType('text/plain');
obj1.setBucketType('default');
obj1.setBucket('my_bucket');
obj1.setKey('my_key');
obj1.setValue('value');
client.storeValue({ value: obj1 }, function (err, rslt) {
    if (err) {
        throw new Error(err);
    }

    client.fetchValue({
        bucketType: 'default', bucket: 'my_bucket', key: 'my_key'
    }, function (err, rslt) {
        if (err) {
            throw new Error(err);
        }
        var obj2 = rslt.values.shift();
        assert(obj1.value == obj2.value);
    });
});
```

</TabItem>
<TabItem label="Erlang" value="erlang">

```erlang
{ok, Obj1} = riakc_pb_socket:get(Pid,
                                 {<<"default">>, <<"my_bucket">>},
                                 <<"my_key">>),
{ok, Obj2} = riakc_pb_socket:get(Pid,
                                 <<"my_bucket">>,
                                 <<"my_key">>).
```

</TabItem>
<TabItem label="CURL" value="curl">

```bash
curl http://localhost:8098/buckets/my_bucket/keys/my_key
curl http://localhost:8098/types/default/my_bucket/keys/my_key
```

</TabItem>
</Tabs>

## Default Bucket Properties

Below is a listing of the default bucket properties (i.e. `props`)
associated with the `default` bucket type:

```json
{
  "props": {
    "allow_mult": false,
    "basic_quorum": false,
    "big_vclock": 50,
    "chash_keyfun": {
      "fun": "chash_std_keyfun",
      "mod": "riak_core_util"
    },
    "dvv_enabled": false,
    "dw": "quorum",
    "last_write_wins": false,
    "linkfun": {
      "fun": "mapreduce_linkfun",
      "mod": "riak_kv_wm_link_walker"
    },
    "n_val": 3,
    "notfound_ok": true,
    "old_vclock": 86400,
    "postcommit": [],
    "pr": 0,
    "precommit": [],
    "pw": 0,
    "r": "quorum",
    "rw": "quorum",
    "small_vclock": 50,
    "w": "quorum",
    "young_vclock": 20
  }
}
```

## Bucket Types and the `allow_mult` Setting

Prior to Riak 2.0, Riak created [siblings](../../learn/concepts/causal-context.md#siblings) in the case of conflicting updates only when explicitly instructed to do so, i.e. when `allow_mult` is to `true`. The default `allow_mult` setting was `false`.

In version 2.0, this is changing in a subtle way. Now, there are two
different default settings for `allow_mult` in play:

* For the `default` bucket type, `allow_mult` is set to `false` by
  default, as in previous versions of Riak
* For all newly-created bucket types, the default is now `true`. It is
  possible to set `allow_mult` to `false` if you wish to avoid resolving
  sibling conflicts, but this needs to be done explicitly.

The consequence is that applications that have previously ignored
conflict resolutions in certain buckets (or all buckets) can continue to
do so. New applications, however, are encouraged to retain and [resolve siblings](../../developing/usage/conflict-resolution/index.md) with the appropriate application-side business logic.

To give an example, let's have a look at the properties associated with
the `default` bucket type:

```bash
riak-admin bucket-type status default | grep allow_mult
```

The output:

    allow_mult: false

Now, let's create a new bucket type called `n_val_of_2`, which sets the
`n_val` to 2 but doesn't explicitly set `allow_mult`:

```bash
riak-admin bucket-type create n_val_of_2 '{"props":{"n_val":2}}'
```

When specifying this bucket type's properties as above, the `allow_mult`
parameter was not changed. However, if we view the bucket type's
properties, we can see in the console output that `allow_mult` is set to
`true`:

```bash
riak-admin bucket-type status n_val_of_2 | grep allow_mult
```

The output:

    allow_mult: true

This is important to bear in mind when using versions of Riak 2.0 and
later any time that you create, activate, and use your own bucket types.
It is still possible to set `allow_mult` to `false` in any given bucket
type, but it must be done explicitly. If we wanted to set
`allow_mult` to `false` in our `n_val_of_2` bucket type from above, we
would need to create or modify the already existing type as follows:

```bash
riak-admin bucket-type update n_val_of_2 '{"props":{"allow_mult":false}}'
```

## Bucket Type Example

Let's say that you'd like to create a bucket type called
`user_account_bucket` with a [pre-commit hook](../../developing/usage/commit-hooks.md) called `syntax_check` and two [post-commit hooks](../../developing/usage/commit-hooks.md) called `welcome_email` and `update_registry`. This would involve four steps:

1. Creating a JavaScript object containing the appropriate `props`
   settings:

   ```json
   {
     "props": {
       "precommit": ["syntax_check"],
       "postcommit": ["welcome_email", "update_registry"]
     }
   }
   ```

2. Passing that JSON to the `bucket-type create` command:

   ```bash
   riak-admin bucket-type create user_account_bucket '{"props":{"precommit": ["syntax_check"], ... }}'
   ```

   If creation is successful, the console will return
   `user_account_bucket created`.

3. Verifying that the type is ready to be activated:

   Once the type is created, you can check whether your new type is
   ready to be activated by running:

   ```bash
   riak-admin bucket-type status user_account_bucket
   ```

   If the first line reads `user_account_bucket has been created and
   may be activated`, then you can proceed to the next step. If it
   reads `user_account_bucket has been created and is not ready to
   activate`, then wait a moment and try again. If it still does not
   work, then there may be network partition or other issues that need
   to be addressed in your cluster.

4. Activating the new bucket type:

   ```bash
   riak-admin bucket-type activate user_account_bucket
   ```

   If activation is successful, the console will return
   `user_account_bucket has been activated`. The bucket type is now
   ready to be used.

## Client Usage Example

If you have created the bucket type `no_siblings` (with the property
`allow_mult` set to `false`) and would like that type to be applied to
the bucket `sensitive_user_data`, you would need to run operations on
that bucket in accordance with the format above. Here is an example
write:

<Tabs>
<TabItem label="Java" value="java" default>

```java
Location key = new Location("sensitive_user_data")
        .setBucketType("no_siblings")
        .setKey("user19735");
RiakObject obj = new RiakObject()
        .setContentType("application/json")
        .setValue(BinaryValue.create("{ ... user data ... }"));
StoreValue store = new StoreValue.Builder(obj).build();
client.execute(store);
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
bucket = client.bucket_type('no_siblings').bucket('sensitive_user_data')
obj = Riak::RObject.new(bucket, 'user19735')
obj.content_type = 'application/json'
obj.raw_data = '{ ... user data ... }'
obj.store
```

</TabItem>
<TabItem label="PHP" value="php">

```php
(new \Basho\Riak\Command\Builder\StoreObject($riak))
  ->buildJsonObject("{ ... user data ... }")
  ->buildLocation('user19735', 'sensitive_user_data', 'no_siblings')
  ->build()
  ->execute();
```

</TabItem>
<TabItem label="Python" value="python">

```python
bucket = client.bucket_type('no_siblings').bucket('sensitive_user_data')
obj = RiakObject(client, bucket, 'user19735')
obj.content_type = 'application/json'
obj.data = '{ ... user data ... }'
obj.store()
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var id = new RiakObjectId("no_siblings", "sensitive_user_data", "user19735");
var obj = new RiakObject(id, "{\"name\":\"Bob\"}");
var rslt = client.Put(obj);
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
var obj = { name: 'Bob' };
client.storeValue({
    bucketType: 'no_siblings', bucket: 'sensitive_user_data',
    key: 'user19735', value: obj
}, function (err, rslt) {
    if (err) {
        throw new Error(err);
    }
});
```

</TabItem>
<TabItem label="Erlang" value="erlang">

```erlang
Object = riakc_obj:new({<<"no_siblings">>, <<"sensitive_user_data">>},
                       <<"user19735">>,
                       <<"{ ... user data ... }">>,
                       <<"application/json">>),
riakc_pb_socket:put(Pid, Object).
```

</TabItem>
<TabItem label="CURL" value="curl">

```bash
curl -XPUT \
  -H "Content-Type: application/json" \
  -d "{ ... user data ... }" \
  http://localhost:8098/types/no_siblings/buckets/sensitive_user_data/keys/user19735
```

</TabItem>
</Tabs>

In this example, the bucket `sensitive_user_data` bears the
configuration established by the `no_siblings` bucket type, and it bears
that configuration *on the basis of the query's structure*. This is
because buckets act as a [separate namespace](#buckets-as-namespaces) in Riak, in addition to [buckets](../../learn/concepts/buckets.md) and [keys](../../learn/concepts/keys-and-objects.md).

Let's say that we're using Riak to store internet memes. We've been
using a bucket called `current_memes` using the bucket type
`no_siblings` (from above). At a certain point, we decide that our
application needs to use a new bucket called `old_memes` to store memes
that have gone woefully out of fashion, but that bucket also needs to
bear the type `no_siblings`.

The following request seeks to add the meme "all your base are belong to
us" to the `old_memes` bucket. If the bucket type `no_siblings` has been
created and activated, the request will ensure that the `old_memes`
bucket inherits all of the properties from the type `no_siblings`:

<Tabs>
<TabItem label="Java" value="java" default>

```java
Location allYourBaseKey =
  new Location(new Namespace("no_siblings", "old_memes"), "all_your_base");
RiakObject obj = new RiakObject()
        .setContentType("text/plain")
        .setValue(BinaryValue.create("all your base are belong to us"));
StoreValue store = new StoreValue.Builder(obj).build();
client.execute(store);
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
bucket = client.bucket_type('no_siblings').bucket('old_memes')
obj = Riak::RObject.new(bucket, 'all_your_base')
obj.content_type = 'text/plain'
obj.raw_data = 'all your base are belong to us'
obj.store
```

</TabItem>
<TabItem label="PHP" value="php">

```php
(new \Basho\Riak\Command\Builder\StoreObject($riak))
  ->buildObject("all your base are belong to us", ['Content-Type' => 'text/plain'])
  ->buildLocation('user19735', 'sensitive_user_data', 'no_siblings')
  ->build()
  ->execute();
```

</TabItem>
<TabItem label="Python" value="python">

```python
bucket = client.bucket_type('no_siblings').bucket('old_memes')
obj = RiakObject(client, bucket, 'all_your_base')
obj.content_type = 'text/plain'
obj.data = 'all your base are belong to us'
obj.store()
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var id = new RiakObjectId("no_siblings", "old_memes", "all_your_base");
var obj = new RiakObject(id, "all your base are belong to us",
    RiakConstants.ContentTypes.TextPlain);
var rslt = client.Put(obj);
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
var obj = new Riak.Commands.KV.RiakObject();
obj.setContentType('text/plain');
obj.setBucketType('no_siblings');
obj.setBucket('old_memes');
obj.setKey('all_your_base');
obj.setValue('all your base are belong to us');
client.storeValue({ value: obj }, function (err, rslt) {
    if (err) {
        throw new Error(err);
    }
});
```

</TabItem>
<TabItem label="Erlang" value="erlang">

```erlang
Object = riakc_obj:new({<<"no_siblings">>, <<"old_memes">>},
                       <<"all_your_base">>,
                       <<"all your base are belong to us">>,
                       <<"text/plain">>),
riakc_pb_socket:put(Pid, Object).
```

</TabItem>
<TabItem label="CURL" value="curl">

```bash
curl -XPUT \
  -H "Content-Type: text/plain" \
  -d "all your base are belong to us" \
  http://localhost:8098/types/no_siblings/buckets/old_memes/keys/all_your_base
```

</TabItem>
</Tabs>

This query would both create the bucket `old_memes` and ensure that the
configuration contained in the `no_siblings` bucket type is applied to
the bucket all at once.

If we wished, we could also store both old and new memes in
buckets with different types. We could use the `no_siblings` bucket from
above if we didn't want to deal with siblings, vclocks, and the like,
and we could use a `siblings_allowed` bucket type (with all of the
default properties except `allow_mult` set to `true`). This would give
use four bucket type/bucket pairs:

* `no_siblings` / `old_memes`
* `no_siblings` / `new_memes`
* `siblings_allowed` / `old_memes`
* `siblings_allowed` / `new_memes`

All four of these pairs are isolated keyspaces. The key `favorite_meme`
could hold different values in all four bucket type/bucket spaces.
