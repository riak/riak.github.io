---
title: "Conflict Resolution"
id: usage_conflict_resolution
sidebar_position: 16
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[usage bucket types]: ../../../developing/usage/bucket-types.md

[use ref strong consistency]: ../../../using/reference/strong-consistency.md

One of Riak's [central goals](../../../learn/why-riak-kv) is high availability. It was built as a [clustered](../../../learn/concepts/clusters.md) system in which any [node](../../../learn/glossary.md#node) is capable of receiving requests without requiring that
every node participate in each request.

If you are using Riak in an [eventually consistent](../../../learn/concepts/eventual-consistency.md) way, conflicts between object values on different nodes is
unavoidable. Often, Riak can resolve these conflicts on its own
internally if you use causal context, i.e. [vector clocks](../../../learn/concepts/causal-context.md#vector-clocks) or [dotted version vectors](../../../learn/concepts/causal-context.md#dotted-version-vectors), when updating objects. Instructions on this can be found in the section [below](#siblings).

:::note Important note on terminology
In versions of Riak prior to 2.0, vector clocks were the only causal context
mechanism available in Riak, which changed with the introduction of dotted
version vectors in 2.0. Please note that you may frequent find terminology in
client library APIs, internal Basho documentation, and more that uses the term
"vector clock" interchangeably with causal context in general. Riak's HTTP API
still uses a `X-Riak-Vclock` header, for example, even if you are using dotted
version vectors.
:::note

But even when you use causal context, Riak cannot always decide which
value is most causally recent, especially in cases involving concurrent
updates to an object. So how does Riak behave when it can't decide on a
single most-up-to-date value? **That is your choice**. A full listing of
available options can be found in the [section below](#vector-clock-pruning). For now,
though, please bear in mind that we strongly recommend one of the
following two options:

1. If your data can be modeled as one of the currently available [Riak Data Types](../../data-types/index.md), we recommend using one of these types,
   because all of them have conflict resolution *built in*, completely
   relieving applications of the need to engage in conflict resolution.
2. If your data cannot be modeled as one of the available Data Types,
   we recommend allowing Riak to generate [siblings](#siblings) and to design your application to resolve
   conflicts in a way that fits your use case. Developing your own
   **conflict resolution strategy** can be tricky, but it has clear
   advantages over other approaches.

Because Riak allows for a mixed approach when storing and managing data,
you can apply multiple conflict resolution strategies within a cluster.

:::note Note on strong consistency

In versions of Riak 2.0 and later, you have the option of using Riak in
a strongly consistent fashion. This document pertains to usage of Riak
as an *eventually* consistent system. If you'd like to use Riak's
strong consistency feature, please refer to the following documents:

* [Using Strong Consistency](../../../developing/app-guide/strong-consistency.md) --- A guide for developers
* [Managing Strong Consistency](../../../configuring/strong-consistency.md) --- A guide for operators
* [strong consistency][use ref strong consistency] --- A more theoretical explication of strong
  consistency

:::

## Client- and Server-side Conflict Resolution

Riak's eventual consistency model is powerful because Riak is
fundamentally non-opinionated about how data resolution takes place.
While Riak *does* have a set of [defaults](../../../developing/app-guide/replication-properties.md#available-parameters), there are a variety of general
approaches to conflict resolution that are available. In Riak, you can
mix and match conflict resolution strategies at the bucket level,
[using bucket types][usage bucket types]. The most important [bucket properties](../../../learn/concepts/buckets.md)
to consider when reasoning about conflict resolution are the
`allow_mult` and `last_write_wins` properties.

These properties provide you with the following basic options:

### Timestamp-based Resolution

If the [`allow_mult`](#siblings) parameter is set to
`false`, Riak resolves all object replica conflicts internally and does
not return siblings to the client. How Riak resolves those conflicts
depends on the value that you set for a different bucket property,
[`last_write_wins`](../../../learn/concepts/buckets.md). If `last_write_wins` is set to `false`,
Riak will resolve all conflicts on the basis of
[timestamps](http://en.wikipedia.org/wiki/Timestamp), which are
attached to all Riak objects as metadata.

The problem with timestamps is that they are not a reliable resolution
mechanism in distributed systems, and they always bear the risk of data
loss. A better yet still-problematic option is to adopt a
last-write-wins strategy, described directly below.

### Last-write-wins

Another way to manage conflicts is to set `allow_mult` to `false`, as
with timestamp-based resolution, while also setting the
`last_write_wins` parameter to
`true`. This produces a so-called last-write-wins (LWW) strategy whereby
Riak foregoes the use of all internal conflict resolution strategies
when making writes, effectively disregarding all previous writes.

The problem with LWW is that it will necessarily drop some writes in the
case of concurrent updates in the name of preventing sibling creation.
If your use case requires that your application be able to reason about
differing values produced in the case of concurrent updates, then we
advise against LWW as a general conflict resolution strategy.

However, LWW can be useful---and safe---if you are certain that there
will be no concurrent updates. If you are storing immutable data in
which each object is guaranteed to have its own key or engaging in
operations related to bulk loading, you should consider LWW.

:::note Undefined behavior warning
Setting both `allow_mult` and `last_write_wins` to `true` necessarily leads to
unpredictable behavior and should always be avoided.
:::

### Resolve Conflicts on the Application Side

While setting `allow_mult` to `false` unburdens applications from having
to reason about siblings, delegating that responsibility to Riak itself,
it bears all of the drawbacks explained above. On the other hand,
setting `allow_mult` to `true` has the following benefits:

* Riak will retain writes even in the case of concurrent updates to a
  key, which enables you to capture the benefits of high availability
  with a far lower risk of data loss
* If your application encounters siblings, it can apply its own
  use-case-specific conflict resolution logic

Conflict resolution in Riak can be a complex business, but the presence
of this variety of options means that requests to Riak can always be
made in accordance with your data model(s), business needs, and use
cases. For examples of client-side sibling resolution, see the following
client-library-specific docs:

* [Java](../../../developing/usage/conflict-resolution/java.md)
* [Ruby](../../../developing/usage/conflict-resolution/ruby.md)
* [Python](../../../developing/usage/conflict-resolution/python.md)
* [C#](../../../developing/usage/conflict-resolution/csharp.md)
* [Node.js](../../../developing/usage/conflict-resolution/nodejs.md)

In Riak versions 2.0 and later, `allow_mult` is set to `true` by default
for any [bucket types](../../../developing/usage/bucket-types.md) that you create. This means
that if you wish to avoid client-side sibling resolution, you have a few
options:

* Explicitly create and activate [bucket types](../../../developing/usage/bucket-types.md)
  that set `allow_mult` to `false`
* Use Riak's [Configuration Files](../../../configuring/reference.md) to change the [default bucket properties](../../../configuring/reference#default-bucket-properties) for your
  cluster. If you set the `buckets.default.allow_mult` parameter to
  `false`, all bucket types that you create will have `allow_mult` set
  to `false` by default.

## Causal Context

When a value is stored in Riak, it is tagged with a piece of metadata
called a **causal context** which establishes the object's initial
version. Causal context comes in one of two possible forms, depending
on what value you set for `dvv_enabled`. If set to `true`, [dotted version vectors](../../../learn/concepts/causal-context.md#dotted-version-vectors) will be used; if set to `false` (the default), [vector clocks](../../../learn/concepts/causal-context.md#vector-clocks) will be used.

Causal context essentially enables Riak to compare the different values
of objects stored in Riak and to determine a number of important things
about those values:

* Whether one value is a direct descendant of the other
* Whether the values are direct descendants of a common parent
* Whether the values are unrelated in recent heritage

Using the information provided by causal context, Riak is frequently,
though not always, able to resolve conflicts between values without
producing siblings.

Both vector clocks and dotted version vectors are non human readable and
look something like this:

    a85hYGBgzGDKBVIcR4M2cgczH7HPYEpkzGNlsP/VfYYvCwA=

If `allow_mult` is set to `true`, you should *always* use causal context
when updating objects, *unless you are certain that no object exists
under that key*. Failing to use causal context with mutable data,
especially for objects that are frequently updated, can lead to
[sibling explosion](../../../using/performance/latency-reduction.md#siblings), which can
produce a variety of problems in your cluster. Fortunately, much of the
work involved with using causal context is handled automatically by
Basho's official [client libraries](../../../developing/client-libraries.md). Examples can be found for each
client library in the [Object Updates](../../../developing/usage/updating-objects.md) document.

## Siblings

A **sibling** is created when Riak is unable to resolve the canonical
version of an object being stored, i.e. when Riak is presented with
multiple possible values for an object and can't figure out which one is
most causally recent. The following scenarios can create sibling values
inside of a single object:

1. **Concurrent writes** --- If two writes occur simultaneously from
   clients, Riak may not be able to choose a single value to store, in
   which case the object will be given a sibling. These writes could happen
   on the same node or on different nodes.
2. **Stale causal context** --- Writes from any client using a stale
   [causal context](../../../learn/concepts/causal-context.md). This is a less likely scenario if a client updates
   the object by reading the object first, fetching the causal context
   currently attached to the object, and then returning that causal context
   to Riak when performing the update (fortunately, our client libraries
   handle much of this automatically). However, even if a client follows
   this protocol when performing updates, a situation may occur in which an
   update happens from a different client while the read/write cycle is
   taking place. This may cause the first client to issue the write with an
   old causal context value and for a sibling to be created. A client is
   "misbehaved" if it habitually updates objects with a stale or no context
   object.
3. **Missing causal context** --- If an object is updated with no causal
   context attached, siblings are very likely to be created. This is an
   unlikely scenario if you're using a Basho client library, but it *can*
   happen if you are manipulating objects using a client like `curl` and
   forgetting to set the `X-Riak-Vclock` header.

## Siblings in Action

Let's have a more concrete look at how siblings work in Riak. First,
we'll create a bucket type called `siblings_allowed` with `allow_mult`
set to `true`:

```bash
riak-admin bucket-type create siblings_allowed '{"props":{"allow_mult":true}}'
riak-admin bucket-type activate siblings_allowed
riak-admin bucket-type status siblings_allowed
```

If the type has been activated, running the `status` command should
return `siblings_allowed is active`. Now, we'll create two objects and
write both of them to the same key without first fetching the object
(which obtains the causal context):

<Tabs>
<TabItem label="Java" value="java" default>

```java
Location bestCharacterKey =
  new Location(new Namespace("siblings_allowed", "nickolodeon"), "best_character");

RiakObject obj1 = new RiakObject()
        .withContentType("text/plain")
        .withValue(BinaryValue.create("Ren"));
RiakObject obj2 = new RiakObject()
        .withContentType("text/plain")
        .withValue(BinaryValue.create("Stimpy"));
StoreValue store1 = new StoreValue.Builder(obj1)
        .withLocation(bestCharacterKey)
        .build();
StoreValue store2 = new StoreValue.Builder(obj2)
        .withLocation(bestCharacterKey)
        .build();
client.execute(store1);
client.execute(store2);
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
bucket = client.bucket_type('siblings_allowed').bucket('nickolodeon')
obj1 = Riak::RObject.new(bucket, 'best_character')
obj1.content_type = 'text/plain'
obj1.raw_data = 'Ren'
obj1.store

obj2 = Riak::RObject.new(bucket, 'best_character')
obj2.content_type = 'text/plain'
obj2.raw_data = 'Stimpy'
obj2.store
```

</TabItem>
<TabItem label="Python" value="python">

```python
bucket = client.bucket_type('siblings_allowed').bucket('nickolodeon')
obj1 = RiakObject(client, bucket, 'best_character')
obj1.content_type = 'text/plain'
obj1.data = 'Ren'
obj1.store()

obj2 = RiakObject(client, bucket, 'best_character')
obj2.content_type = 'text/plain'
obj2.data = 'Stimpy'
obj2.store()
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var id = new RiakObjectId("siblings_allowed", "nickolodeon", "best_character");

var renObj = new RiakObject(id, "Ren", RiakConstants.ContentTypes.TextPlain);
var stimpyObj = new RiakObject(id, "Stimpy", RiakConstants.ContentTypes.TextPlain);

var renResult = client.Put(renObj);
var stimpyResult = client.Put(stimpyObj);
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
var obj1 = new Riak.Commands.KV.RiakObject();
obj1.setContentType('text/plain');
obj1.setBucketType('siblings_allowed');
obj1.setBucket('nickolodeon');
obj1.setKey('best_character');
obj1.setValue('Ren');

var obj2 = new Riak.Commands.KV.RiakObject();
obj2.setContentType('text/plain');
obj2.setBucketType('siblings_allowed');
obj2.setBucket('nickolodeon');
obj2.setKey('best_character');
obj2.setValue('Ren');

var storeFuncs = [];
[obj1, obj2].forEach(function (obj) {
    storeFuncs.push(
        function (async_cb) {
            client.storeValue({ value: obj }, function (err, rslt) {
                async_cb(err, rslt);
            });
        }
    );
});

async.parallel(storeFuncs, function (err, rslts) {
    if (err) {
        throw new Error(err);
    }
});
```

</TabItem>
<TabItem label="Erlang" value="erlang">

```erlang
Obj1 = riakc_obj:new({<<"siblings_allowed">>, <<"nickolodeon">>},
                     <<"best_character">>,
                     <<"Ren">>,
                     <<"text/plain">>),
Obj2 = riakc_obj:new({<<"siblings_allowed">>, <<"nickolodeon">>},
                     <<"best_character">>,
                     <<"Stimpy">>,
                     <<"text/plain">>),
riakc_pb_socket:put(Pid, Obj1),
riakc_pb_socket:put(Pid, Obj2).
```

</TabItem>
<TabItem label="CURL" value="curl">

```bash
curl -XPUT http://localhost:8098/types/siblings_allowed/nickolodeon/whatever/keys/best_character \
  -H "Content-Type: text/plain" \
  -d "Ren"

curl -XPUT http://localhost:8098/types/siblings_allowed/nickolodeon/whatever/keys/best_character \
  -H "Content-Type: text/plain" \
  -d "Stimpy"
```

</TabItem>
</Tabs>

> **Getting started with Riak KV clients**
>
> If you are connecting to Riak using one of Basho's official
> [client libraries](../../../developing/client-libraries.md), you can find more information about getting started with your client in [Developing with Riak KV: Getting Started](../../../developing/getting-started/index.md) section.

At this point, multiple objects have been stored in the same key without
passing any causal context to Riak. Let's see what happens if we try to
read contents of the object:

<Tabs>
<TabItem label="Java" value="java" default>

```java
Location bestCharacterKey =
  new Location(new Namespace("siblings_allowed", "nickolodeon"), "best_character");

FetchValue fetch = new FetchValue.Builder(bestCharacterKey).build();
FetchValue.Response response = client.execute(fetch);
RiakObject obj = response.getValue(RiakObject.class);
System.out.println(obj.getValue().toString());
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
bucket = client.bucket_type('siblings_allowed').bucket('nickolodeon')
obj = bucket.get('best_character')
obj
```

</TabItem>
<TabItem label="Python" value="python">

```python
bucket = client.bucket_type('siblings_allowed').bucket('nickolodeon')
obj = bucket.get('best_character')
obj.siblings
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var id = new RiakObjectId("siblings_allowed", "nickolodeon", "best_character");
var getResult = client.Get(id);
RiakObject obj = getResult.Value;
Debug.WriteLine(format: "Sibling count: {0}", args: obj.Siblings.Count);
foreach (var sibling in obj.Siblings)
{
    Debug.WriteLine(
        format: "    VTag: {0}",
        args: sibling.VTag);
}
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
client.fetchValue({
    bucketType: 'siblings_allowed', bucket:
        'nickolodeon', key: 'best_character'
}, function (err, rslt) {
    if (err) {
        throw new Error(err);
    }
    logger.info("nickolodeon/best_character has '%d' siblings",
        rslt.values.length);
});
```

</TabItem>
<TabItem label="CURL" value="curl">

```bash
curl http://localhost:8098/types/siblings_allowed/buckets/nickolodeon/keys/best_character
```

</TabItem>
</Tabs>

Uh-oh! Siblings have been found. We should get this response:

<Tabs>
<TabItem label="Java" value="java" default>

```java
com.basho.riak.client.cap.UnresolvedConflictException: Siblings found
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
<Riak::RObject {nickolodeon,best_character} [#<Riak::RContent [text/plain]:"Ren">, #<Riak::RContent [text/plain]:"Stimpy">]>
```

</TabItem>
<TabItem label="Python" value="python">

```python
[<riak.content.RiakContent object at 0x10a00eb90>, <riak.content.RiakContent object at 0x10a00ebd0>]
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
Sibling count: 2
    VTag: 1DSVo7VED8AC6llS8IcDE6
    VTag: 7EiwrlFAJI5VMLK87vU4tE
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
info: nickolodeon/best_character has '2' siblings
```

</TabItem>
<TabItem label="CURL" value="curl">

```bash
Siblings:
175xDv0I3UFCfGRC7K7U9z
6zY2mUCFPEoL834vYCDmPe
```

</TabItem>
</Tabs>

As you can see, reading an object with sibling values will result in
some form of "multiple choices" response (e.g. `300 Multiple Choices` in
HTTP). If you're using the HTTP interface and want to view all sibling
values, you can attach an `Accept: multipart/mixed` header to your
request:

```bash
curl -H "Accept: multipart/mixed" \
  http://localhost:8098/types/siblings_allowed/buckets/nickolodeon/keys/best_character
```

Response (without headers):

    ren
    --WUnzXITIPJFwucNwfdaofMkEG7H

    stimpy
    --WUnzXITIPJFwucNwfdaofMkEG7H--

If you select the first of the two siblings and retrieve its value, you
should see `Ren` and not `Stimpy`.

### Using Causal Context

Once you are presented with multiple options for a single value, you
must determine the correct value. In an application, this can be done
either in an automatic fashion, using a use case-specific resolver, or
by presenting the conflicting objects to the end user. For more
information on application-side conflict resolution, see our
client-library-specific documentation for the following languages:

* [Java](../../../developing/usage/conflict-resolution/java.md)
* [Ruby](../../../developing/usage/conflict-resolution/ruby.md)
* [Python](../../../developing/usage/conflict-resolution/python.md)
* [C#](../../../developing/usage/conflict-resolution/csharp.md)
* [Node.js](../../../developing/usage/conflict-resolution/nodejs.md)

We won't deal with conflict resolution in this section. Instead, we'll
focus on how to use causal context.

After having written several objects to Riak in the section above, we
have values in our object: `Ren` and `Stimpy`. But let's say that we
decide that `Stimpy` is the correct value based on our application's use
case. In order to resolve the conflict, we need to do three things:

1. Fetch the current object (which will return both siblings)
2. Modify the value of the object, i.e. make the value `Stimpy`
3. Write the object back to the `best_character` key

What happens when we fetch the object first, prior to the update, is
that the object handled by the client has a causal context attached. At
that point, we can modify the object's value, and when we write the
object back to Riak, *the causal context will automatically be attached
to it*. Let's see what that looks like in practice:

<Tabs>
<TabItem label="Java" value="java" default>

```java
// First, we fetch the object
Location bestCharacterKey =
  new Location(new Namespace("siblings_allowed", "nickolodeon"), "best_character");
FetchValue fetch = new FetchValue.Builder(bestCharacterKey).build();
FetchValue.Response res = client.execute(fetch);
RiakObject obj = res.getValue(RiakObject.class);


// Then we modify the object's value
obj.setValue(BinaryValue.create("Stimpy"));

// Then we store the object, which has the vector clock already attached
StoreValue store = new StoreValue.Builder(obj)
        .withLocation(bestCharacterKey);
client.execute(store);
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
# First, we fetch the object
bucket = client.bucket('nickolodeon')
obj = bucket.get('best_character', type: 'siblings_allowed')

# Then we modify the object's value
obj.raw_data = 'Stimpy'

# Then we store the object, which has the vector clock already attached
obj.store
```

</TabItem>
<TabItem label="Python" value="python">

```python
# First, we fetch the object
bucket = client.bucket_type('siblings_allowed').bucket('nickolodeon')
obj = bucket.get('best_character')

# Then pick one of the siblings
resolved_sibling = obj.siblings[3]

# Then replace the siblings data structure with the single sibling we want to keep
obj.siblings = [resolved_sibling]
obj.store()
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
// First, fetch the object
var getResult = client.Get(id);

// Then, modify the object's value
RiakObject obj = getResult.Value;
obj.SetObject<string>("Stimpy", RiakConstants.ContentTypes.TextPlain);

// Then, store the object which has vector clock attached
var putRslt = client.Put(obj);
CheckResult(putRslt);

obj = putRslt.Value;
// Voila, no more siblings!
Debug.Assert(obj.Siblings.Count == 0);
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
client.fetchValue({
        bucketType: 'siblings_allowed',
        bucket: 'nickolodeon',
        key: 'best_character'
    }, function (err, rslt) {
        if (err) {
            throw new Error(err);
        }

        var riakObj = rslt.values.shift();
        riakObj.setValue('Stimpy');
        client.storeValue({ value: riakObj, returnBody: true },
            function (err, rslt) {
                if (err) {
                    throw new Error(err);
                }

                assert(rslt.values.length === 1);
            }
        );
    }
);
```

</TabItem>
<TabItem label="CURL" value="curl">

```bash
curl -i http://localhost:8098/types/siblings_allowed/buckets/nickolodeon/keys/best_character

# In the HTTP interface, the causal context can be found in the
# "X-Riak-Vclock" header. That will look something like this:

X-Riak-Vclock: a85hYGBgzGDKBVIcR4M2cgczH7HPYEpkzGNlsP/VfYYvCwA=

# When performing a write to the same key, that same header needs to
# accompany the write for Riak to be able to use the vector clock
```

</TabItem>
</Tabs>

:::note Concurrent conflict resolution
It should be noted that it is possible to have two clients that are
simultaneously engaging in conflict resolution. To avoid a pathological
divergence, you should be sure to limit the number of reconciliations and fail
once that limit has been exceeded.
:::

### Sibling Explosion

Sibling explosion occurs when an object rapidly collects siblings
without being reconciled. This can lead to myriad issues. Having an
enormous object in your node can cause reads of that object to crash
the entire node. Other issues include [increased cluster latency](../../../using/performance/latency-reduction.md) as the object is replicated and out-of-memory errors.

### Vector Clock Explosion

Besides sibling explosion, the vector clock itself can grow extremely
large when a significant volume of updates are performed on a single
object in a small period of time. While updating a single object
*extremely* frequently is not recommended, you can tune Riak's vector
clock pruning to prevent vector clocks from growing too large too
quickly. More on pruning in the [section below](#vector-clock-pruning).

### How does `last_write_wins` affect resolution?

On the surface, it seems like setting `allow_mult` to `false`
(the default) and `last_write_wins` to `true` would result in the same
behavior, but there is a subtle distinction.

Even though both settings return only one value to the client, setting
`allow_mult` to `false` still uses vector clocks for resolution, whereas
if `last_write_wins` is `true`, Riak reads the timestamp to determine
the latest version. Deeper in the system, if `allow_mult` is `false`,
Riak will still allow siblings to exist when they are created (via
concurrent writes or network partitions), whereas setting
`last_write_wins` to `true` means that Riak will overwrite the value
with the one that has the later timestamp.

When you don't care about sibling creation, setting `allow_mult` to
`false` has the least surprising behavior: you get the latest value,
but network partitions are handled gracefully. However, for cases in
which keys are rewritten often (and quickly) and the new value isn't
necessarily dependent on the old value, `last_write_wins` will provide
better performance. Some use cases where you might want to use
`last_write_wins` include caching, session storage, and insert-only
(no updates).

:::note Note on combining `allow_mult` and `last_write_wins`
The combination of setting both the `allow_mult` and `last_write_wins`
properties to `true` leads to undefined behavior and should not be used.
:::

## Vector Clock Pruning

Riak regularly prunes vector clocks to prevent overgrowth based on four
parameters which can be set for any bucket type that you create:

| Parameter      | Default value     | Description                                                                                              |
|:---------------|:------------------|:---------------------------------------------------------------------------------------------------------|
| `small_vclock` | `50`              | If the length of the vector clock list is smaller than this value, the list's entries will not be pruned |
| `big_vclock`   | `50`              | If the length of the vector clock list is larger than this value, the list will be pruned                |
| `young_vclock` | `20`              | If a vector clock entry is younger than this value (in milliseconds), it will not be pruned              |
| `old_vclock`   | `86400` (one day) | If a vector clock entry is older than this value (in milliseconds), it will be pruned                    |

This diagram shows how the values of these parameters dictate the vector
clock pruning process:

![Vclock Pruning](/images/vclock-pruning.png)

## More Information

Additional background information on vector clocks:

* [Vector Clocks on Wikipedia](http://en.wikipedia.org/wiki/Vector_clock)
* [Why Vector Clocks are Easy](http://basho.com/why-vector-clocks-are-easy/)
* [Why Vector Clocks are Hard](http://basho.com/why-vector-clocks-are-hard/)
* The vector clocks used in Riak are based on the [work of Leslie Lamport](http://portal.acm.org/citation.cfm?id=359563)
