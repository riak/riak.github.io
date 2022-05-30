---
title: "Creating Objects"
id: usage_creating_objects
slug: creating-objects
sidebar_position: 0
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[usage content types]: ../../developing/usage/content-types.md

Writes in Riak KV (storing or modifying objects) are like HTTP `PUT`
requests. Here is the basic form of writes:

```
PUT /types/<type>/buckets/<bucket>/keys/<key>

# If you're using HTTP to interact with Riak, you can also use POST
```

As an example, let's store an object containing information about a dog named Rufus. We'll store that object in the key `rufus` in the bucket `dogs`, which bears the `animals` [bucket type](../../using/cluster-operations/bucket-types.md).

The object we're storing will be very simple, just a basic text snippet
of something that Rufus might say. Let's build the object and then store
it.

<Tabs>

<TabItem label="Java" value="java" default>

```java
String quote = "WOOF!";
Namespace bucket = new Namespace("animals", "dogs");
Location rufusLocation = new Location(bucket, "rufus");
RiakObject rufusObject = new RiakObject()
        .setContentType("text/plain")
        .setValue(BinaryValue.create(quote));
StoreValue storeOp = new StoreValue.Builder(rufusObject)
        .withLocation(rufusLocation)
        .build();
client.execute(storeOp);
```

</TabItem>

<TabItem label="Ruby" value="ruby">

```ruby
bucket = client.bucket_type('animals').bucket('dogs')
obj = Riak::RObject.new(bucket, 'rufus')
obj.content_type = 'text/plain'
obj.data = 'WOOF!'
obj.store
```

</TabItem>
<TabItem label="PHP" value="php">

```php
$response = (new \Basho\Riak\Command\Builder\StoreObject($riak))
  ->buildLocation('rufus', 'users', 'animals')
  ->buildObject('WOOF!', 'text/plain')
  ->build()
  ->execute();
```

</TabItem>
<TabItem label="Python" value="python">

```python
bucket = client.bucket_type('animals').bucket('dogs')
obj = RiakObject(client, bucket, 'rufus')
obj.content_type = 'text/plain'
obj.data = 'WOOF!'
obj.store()
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var id = new RiakObjectId("animals", "dogs", "rufus")
var obj = new RiakObject(id, "WOOF!", "text/plain");
var result = client.Put(obj);
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
var riakObj = new Riak.Commands.KV.RiakObject();
riakObj.setContentType('text/plain');
riakObj.setValue('WOOF!');
client.storeValue({
    bucketType: 'animals', bucket: 'dogs', key: 'rufus',
    value: riakObj
}, function (err, rslt) {
    if (err) {
        throw new Error(err);
    }
});
```

</TabItem>
<TabItem label="Go" value="go">

```go
obj := &riak.Object{
    ContentType:     "text/plain",
    Charset:         "utf-8",
    ContentEncoding: "utf-8",
    Value:           []byte("WOOF!"),
}

cmd, err := riak.NewStoreValueCommandBuilder().
    WithBucketType("animals").
    WithBucket("dogs").
    WithKey("rufus").
    WithContent(obj).
    Build()

if err != nil {
    fmt.Println(err.Error())
    return
}

if err := cluster.Execute(cmd); err != nil {
    fmt.Println(err.Error())
    return
}

svc := cmd.(*riak.StoreValueCommand)
rsp := svc.Response
```

</TabItem>
</Tabs>

Notice that we specified both a value for the object, i.e. `WOOF!`, and
a content type, `text/plain`. See [content types][usage content types] for more information.

Now, you run the same read operation as in [Reading Objects](../../developing/usage/reading-objects.md). If the write operation was successful, you should be able to successfully read the object. Please note that the operation will fail if you don't first create the bucket-type `animals` as per the page on [bucket types](../../using/cluster-operations/bucket-types.md).

### Store an Object

Your application will often have its own method of generating the keys
for its data, e.g. on the basis of timestamps. If so, storing that data
is easy. The basic request looks like this.

```
PUT /types/TYPE/buckets/BUCKET/keys/KEY

# If you're using HTTP, POST can be used instead of PUT. The only
# difference between POST and PUT is that you should POST in cases where
# you want Riak to auto-generate a key. More on this can be found in the
# examples below.
```

There is no need to intentionally create buckets in Riak. They pop into
existence when keys are added to them, and disappear when all keys have
been removed from them. If you don't specify a bucket's type, the type
[`default`](../../developing/usage/bucket-types.md) will be applied.

#### Write Parameters

Write requests support the following parameters:

| Parameter    | Default  | Description                                                                           |
|:-------------|:---------|:--------------------------------------------------------------------------------------|
| `w`          | `quorum` | How many replicas to write to before returning a successful response                  |
| `pw`         | `0`      | How many primary vnodes must respond for a write to be deemed successful              |
| `dw`         | `quorum` | How many replicas to commit to durable storage before returning a successful response |
| `returnbody` | `false`  | Whether to return the contents of the stored object                                   |

Here is an example of storing an object (another brief text snippet)
under the key `viper` in the bucket `dodge`, which bears the type
`cars`, with `w` set to `3`:

<Tabs>
<TabItem label="Java" value="java" default>

```java
Location viperKey = new Location(new Namespace("cars", "dodge"), "viper");
BinaryValue text = BinaryValue.create("vroom");
RiakObject obj = new RiakObject()
        .setContentType("text/plain")
        .setValue(text);
StoreValue store = new StoreValue.Builder(myKey, obj)
        .withOption(StoreOption.W, new Quorum(3))
        .build();
client.execute(store);
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
bucket = client.bucket_type('cars').bucket('dodge')
obj = Riak::RObject.new(bucket, 'viper')
obj.content_type = 'text/plain'
obj.raw_data = 'vroom'
obj.store(w: 3)
```

</TabItem>
<TabItem label="PHP" value="php">

```php
(new \Basho\Riak\Command\Builder\StoreObject($riak))
  ->buildLocation('viper', 'dodge', 'cars')
  ->buildObject('vroom', 'text/plain')
  ->withParameter('w', 3)
  ->build()
  ->execute();
```

</TabItem>
<TabItem label="Python" value="python">

```python
bucket = client.bucket_type('cars').bucket('dodge')
obj = RiakObject(client, bucket, 'viper')
obj.content_type = 'text/plain'
obj.data = 'vroom'
obj.store(w=3)
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var id = new RiakObjectId("cars", "dodge", "viper");
var obj = new RiakObject(id, "vroom", "text/plain");
var options = new RiakPutOptions();
options.SetW(new Quorum(3));
var result = client.Put(obj, options);
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
var riakObj = new Riak.Commands.KV.RiakObject();
riakObj.setContentType('text/plain');
riakObj.setValue('vroom');

var options = {
    bucketType: 'cars', bucket: 'dodge', key: 'viper',
    w: 3, value: riakObj
};
client.storeValue(options, function (err, rslt) {
    if (err) {
        throw new Error(err);
    }
});
```

</TabItem>
<TabItem label="Erlang" value="erlang">

```erlang
Object = riakc_obj:new({<<"cars">>, <<"dodge">>},
                       <<"viper">>,
                       <<"vroom">>,
                       <<"text/plain">>,
                       [{w, 3}]).
riakc_pb_socket:put(Pid, Object).
```

</TabItem>
<TabItem label="Go" value="go">

```go
obj := &riak.Object{
    ContentType:     "text/plain",
    Charset:         "utf-8",
    ContentEncoding: "utf-8",
    Value:           []byte("vroom"),
}

cmd, err := riak.NewStoreValueCommandBuilder().
    WithBucketType("cars").
    WithBucket("dodge").
    WithKey("viper").
    WithW(3).
    WithContent(obj).
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
<TabItem label="CURL" value="curl">

```bash
curl -XPUT \
  -H "Content-Type: text/plain" \
  -d "vroom" \
  http://localhost:8098/types/cars/buckets/dodge/keys/viper?w=3
```

</TabItem>
</Tabs>

Again, the above will only work if the `cars` bucket type has been created and activated.

#### Return Body

If `returnbody` is set to `true`, any of the response headers expected
from a read request may be present. Like a `GET` request, `300 Multiple
Choices` may be returned if siblings existed or were created as part of
the operation, and the response can be dealt with similarly.

Normal HTTP status codes (responses will vary for client libraries):

* `200 OK`
* `204 No Content`
* `300 Multiple Choices`

For example, using the same object from above:

<Tabs>
<TabItem label="Java" value="java" default>

```java
Location viperKey = new Location(new Namespace("cars", "dodge"), "viper");
BinaryValue text = BinaryValue.create("vroom");
RiakObject obj = new RiakObject()
        .setContentType("text/plain")
        .setValue(text);
StoreValue store = new StoreValue.Builder(myKey, obj)
        .withOption(StoreOption.W, new Quorum(3))
        .withOption(StoreOption.RETURN_BODY, true)
        .build();
client.execute(store);
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
bucket = client.bucket_type('cars').bucket('dodge')
obj = Riak::RObject.new(bucket, 'viper')
obj.content_type = 'text/plain'
obj.raw_data = 'vroom'
obj.store(w: 3, returnbody: true)
```

</TabItem>
<TabItem label="PHP" value="php">

```php
(new \Basho\Riak\Command\Builder\StoreObject($riak))
  ->buildLocation('viper', 'dodge', 'cars')
  ->buildObject('vroom', 'text/plain')
  ->withParameter('w', 3)
  ->withParameter('returnbody', 'true')
  ->build()
  ->execute();
```

</TabItem>
<TabItem label="Python" value="python">

```python
bucket = client.bucket_type('cars').bucket('dodge')
obj = RiakObject(client, bucket, 'viper')
obj.content_type = 'text/plain'
obj.data = 'vroom'
obj.store(w=3, return_body=True)
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var id = new RiakObjectId("cars", "dodge", "viper");
var obj = new RiakObject(id, "vroom", "text/plain");
var options = new RiakPutOptions();
options.SetW(new Quorum(3));
options.SetReturnBody(true);
var result = client.Put(obj, options);
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
var riakObj = new Riak.Commands.KV.RiakObject();
riakObj.setContentType('text/plain');
riakObj.setValue('vroom');

var options = {
    bucketType: 'cars', bucket: 'dodge', key: 'viper',
    w: 3, returnBody: true, value: riakObj
};
client.storeValue(options, function (err, rslt) {
    if (err) {
        throw new Error(err);
    }
    var riakObj = rslt.values.shift();
    var viper = riakObj.value;
    logger.info("dodge viper: %s", viper.toString('utf8'));
});
```

</TabItem>
<TabItem label="Erlang" value="erlang">

```erlang
Object = riakc_obj:new({<<"cars">>, <<"dodge">>},
                       <<"viper">>,
                       <<"vroom">>,
                       <<"text/plain">>).
riakc_pb_socket:put(Pid, Object, [return_body]).
```

</TabItem>
<TabItem label="Go" value="go">

```go
obj := &riak.Object{
    ContentType:     "text/plain",
    Charset:         "utf-8",
    ContentEncoding: "utf-8",
    Value:           []byte("vroom"),
}

cmd, err := riak.NewStoreValueCommandBuilder().
    WithBucketType("cars").
    WithBucket("dodge").
    WithKey("viper").
    WithW(3).
    WithContent(obj).
    WithReturnBody(true).
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
<TabItem label="CURL" value="curl">

```bash
curl -XPUT \
  -H "Content-Type: text/plain" \
  -d "vroom" \
  http://localhost:8098/types/cars/buckets/dodge/keys/viper?w=3&returnbody=true
```

</TabItem>
</Tabs>

### Store a New Object and Assign a Random Key

If your application would rather leave key-generation up to Riak, issue
a `POST` request to the bucket URL instead of a PUT to a bucket/key
pair:

```
POST /types/TYPE/buckets/BUCKET/keys
```

If you don't pass Riak a `key` name after the bucket, it will know to
create one for you.

Supported headers are the same as for bucket/key write requests, though
`X-Riak-Vclock` will never be relevant for these POST requests.
Supported query parameters are also the same as for bucket/key PUT
requests.

Normal status codes:

* `201 Created`

This command will store an object in the bucket `random_user_keys`,
which bears the bucket type `users`.

<Tabs>
<TabItem label="Java" value="java" default>

```java
Namespace locationWithoutKey = new Namespace("users", "random_user_keys");
BinaryValue text = BinaryValue.create("{'user':'data'}");
RiakObject obj = new RiakObject()
        .setContentType("application/json")
        .setValue(text);
StoreValue store = new StoreValue.Builder(locationWithoutKey, obj)
        .build();
String key = client.execute(store).getLocation().getKeyAsString();

// The Java client will assign a random key along the following lines:
"ZPFF18PUqGW9efVou7EHhfE6h8a"
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
bucket = client.bucket_type('users').bucket('random_user_keys')
obj = Riak::RObject.new(bucket)
obj.content_type = 'application/json'
obj.raw_data = '{"user":"data"}'

obj.store

# The client will assign a key like the following:
obj.key
"GB8fW6DDZtXogK19OLmaJf247DN"
```

</TabItem>
<TabItem label="PHP" value="php">

```php
$response = (new \Basho\Riak\Command\Builder\StoreObject($riak))
  ->buildBucket('random_user_keys', 'users')
  ->buildJsonObject(['user'=>'data'])
  ->build()
  ->execute();

echo $response->getLocation()->getKey(); // GB8fW6DDZtXogK19OLmaJf247DN
```

</TabItem>
<TabItem label="Python" value="python">

```python
bucket = client.bucket_type('users').bucket('random_user_keys')
obj = RiakObject(client, bucket)
obj.content_type = 'application/json'
obj.data = '{"user":"data"}'
obj.store()

obj.key

# The Python client will assign a random key along the following lines:
'ZPFF18PUqGW9efVou7EHhfE6h8a'
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var id = new RiakObjectId("users", "random_user_keys", null);
var obj = new RiakObject(id, @"{'user':'data'}",
    RiakConstants.ContentTypes.ApplicationJson);
var rslt = client.Put(obj);
Debug.WriteLine(format: "Generated key: {0}", args: rslt.Value.Key);

// The .NET client will output a random key similar to this:
// Generated key: DWDsnpYSqOU363c0Bqe8hCwAM7Q
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
var user = {
    user: 'data'
};
var options = {
    bucketType: 'users', bucket: 'random_user_keys',
    returnBody: true, value: user
};
client.storeValue(options, function (err, rslt) {
    if (err) {
        throw new Error(err);
    }
    var riakObj = rslt.values.shift();
    var generatedKey = riakObj.getKey();
    logger.info("Generated key: %s", generatedKey);
});

// The Node.js client will output a random key similar to this:
// info: Generated key: VBAMoX0OOucymVCxeQEYzLzzAh2
```

</TabItem>
<TabItem label="Erlang" value="erlang">

```erlang
Object = riakc_obj:new({<<"users">>, <<"random_user_keys">>}, undefined, <<"{'user':'data'}">>, <<"application/json">>).
riakc_pb_socket:put(Pid, Object).

%% The key can be retrieved from the output of the above call.
%% It will look something like this:

{ok,{riakc_obj,{<<"users">>,<<"random_user_keys">>},
               <<"EZ7pp4bpdfpZw0fPUdTUafveQjO">>,undefined,[],undefined,
               undefined}}
```

</TabItem>
<TabItem label="Go" value="go">

```go
obj := &riak.Object{
    ContentType:     "application/json",
    Charset:         "utf-8",
    ContentEncoding: "utf-8",
    Value:           []byte("{'user':'data'}"),
}

cmd, err := riak.NewStoreValueCommandBuilder().
    WithBucketType("users").
    WithBucket("random_user_keys").
    WithContent(obj).
    Build()

if err != nil {
    fmt.Println(err.Error())
    return
}

if err := cluster.Execute(cmd); err != nil {
    fmt.Println(err.Error())
    return
}

svc := cmd.(*riak.StoreValueCommand)
rsp := svc.Response
fmt.Printf("Generated key: %v\n", rsp.GeneratedKey)

// Output:
// Generated key: QSHkZjFdWwfrxtKl3wtUhL2gz7N
```

</TabItem>
<TabItem label="CURL" value="curl">

```bash
curl -i -XPOST \
  -H "Content-Type: text/plain" \
  -d "this is a test" \
  http://localhost:8098/types/users/buckets/random_user_keys/keys

# In the output, you should see a Location header that will give you the
# location of the object in Riak, with the key at the end:

Location: /buckets/test/keys/G7FYUXtTsEdru4NP32eijMIRK3o
```

</TabItem>
</Tabs>