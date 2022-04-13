---
title: "Reading Objects"
id: usage_reading_objects
slug: reading-objects
sidebar_position: 1
---

[glossary vnode]: ../../learn/glossary.md#vnode

You can think of reads in Riak as analogous to HTTP `GET` requests. You
specify a bucket type, bucket, and key, and Riak either returns the
object that's stored there---including its [siblings](../../developing/usage/conflict-resolution/index.md#siblings) \(more on that later)---or it returns `not found` (the
equivalent of an HTTP `404 Object Not Found`).

Here is the basic command form for retrieving a specific key from a
bucket:

```
GET /types/<type>/buckets/<bucket>/keys/<key>
```

Here is an example of a read performed on the key `rufus` in the bucket
`dogs`, which bears the bucket type `animals`. Please note that for this example to work, you must have first created the bucket-type `animals` as per the instructions on the [bucket type](../../using/cluster-operations/bucket-types.md) page.

## Java

```java
// In the Java client, it is best to specify a bucket type/bucket/key
// Location object that can be used as a reference for further
// operations, as in the example below:
Location myKey = new Location(new Namespace("animals", "dogs"), "rufus");
```

## Ruby 

```ruby
bucket = client.bucket_type('animals').bucket('dogs')
obj = bucket.get('rufus')
```

## PHP 

```php
$response = (new \Basho\Riak\Command\Builder\FetchObject($riak))
  ->buildLocation('rufus', 'users', 'animals')
  ->build()
  ->execute();
```

## Python 

```python
bucket = client.bucket_type('animals').bucket('dogs')
obj = bucket.get('rufus')
```

## C# 

```c#
// Using the Riak .NET Client it is best to specify a bucket type/bucket/key
// RiakObjectId object that can be used as a reference for further
// operations
var id = new RiakObjectId("animals", "dogs", "rufus");
```

## JavaScript 

```javascript
client.fetchValue({ bucketType: 'animals', bucket: 'dogs', key: 'rufus' }, function (err, rslt) {
    assert(rslt.isNotFound);
});
```

## Erlang 

```erlang
{ok, Obj} = riakc_pb_socket:get(Pid,
                            {<<"animals">>, <<"dogs">>},
                            <<"rufus">>).
```

## Go 

```go
cmd, err = riak.NewFetchValueCommandBuilder().
  WithBucketType("animals").
  WithBucket("dogs").
  WithKey("rufus").
  Build()
if err != nil {
    // error occurred
}
```

## Curl

```curl
curl http://localhost:8098/types/animals/buckets/dogs/keys/rufus
```

## Read Parameters

| Parameter     | Default  | Description                                                                                                                                                                         |
|:--------------|:---------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `r`           | `quorum` | How many replicas need to agree when retrieving an existing object before the write                                                                                                 |
| `pr`          | `0`      | How many [vnodes][glossary vnode] must respond for a read to be deemed successful                                                                                                   |
| `notfound_ok` | `true`   | If set to `true`, if the first vnode to respond doesn't have a copy of the object, Riak will deem the failure authoritative and immediately return a `notfound` error to the client |

Riak also accepts many query parameters, including `r` for setting the
R-value for GET requests (R values describe how many replicas need to
agree when retrieving an existing object in order to return a successful
response).

Here is an example of attempting a read with `r` set to `3`:

### Java

```java
// Using the "myKey" location specified above:
FetchValue fetch = new FetchValue.Builder(myKey)
        .withOption(FetchOption.R, new Quorum(3))
        .build();
FetchValue.Response response = client.execute(fetch);
RiakObject obj = response.getValue(RiakObject.class);
System.out.println(obj.getValue());
```

### Ruby 

```ruby
bucket = client.bucket_type('animals').bucket('dogs')
obj = bucket.get('rufus', r: 3)
p obj.data
```

### PHP 

```php
$response = (new \Basho\Riak\Command\Builder\FetchObject($riak))
  ->buildLocation('rufus', 'dogs', 'animals')
  ->build()
  ->execute();

var_dump($response->getObject()->getData());
```

### Python 

```python
bucket = client.bucket_type('animals').bucket('dogs')
obj = bucket.get('rufus', r=3)
print obj.data
```

### C# 

```c#
var id = new RiakObjectId("animals", "dogs", "rufus");
var opts = new RiakGetOptions();
opts.SetR(3);
var rslt = client.Get(id, opts);
Debug.WriteLine(Encoding.UTF8.GetString(rslt.Value.Value));
```

### JavaScript 

```javascript
var fetchOptions = {
    bucketType: 'animals', bucket: 'dogs', key: 'rufus',
    r: 3
};
client.fetchValue(fetchOptions, function (err, rslt) {
    var riakObj = rslt.values.shift();
    var rufusValue = riakObj.value.toString("utf8");
    logger.info("rufus: %s", rufusValue);
});
```

### Erlang 

```erlang
{ok, Obj} = riakc_pb_socket:get(Pid,
                                {<<"animals">>, <<"dogs">>},
                                <<"rufus">>,
                                [{r, 3}]).
```

### Go 

```go
cmd, err := riak.NewFetchValueCommandBuilder().
    WithBucketType("animals").
    WithBucket("dogs").
    WithKey("rufus").
    WithR(3).
    Build()

if err != nil {
    fmt.Println(err.Error())
    return
}

if err := cluster.Execute(cmd); err != nil {
    fmt.Println(err.Error())
    return
}

fvc := cmd.(*riak.FetchValueCommand)
rsp := svc.Response
```

### Curl 

```curl
curl http://localhost:8098/types/animals/buckets/dogs/keys/rufus?r=3
```

If you're using HTTP, you will most often see the following response
codes:

* `200 OK`
* `300 Multiple Choices`
* `304 Not Modified`

The most common error code:

* `404 Not Found`

:::note Note
If you're using a Riak client instead of HTTP, these responses will vary a
great deal, so make sure to check the documentation for your specific client.
:::note

## Not Found

If there's no object stored in the location where you attempt a read, you'll get the following response:

### Java 

```java
java.lang.NullPointerException
```

### Ruby 

```ruby
Riak::ProtobuffsFailedRequest: Expected success from Riak but received not_found. The requested object was not found.
```

### PHP 

```php
$response->getStatusCode(); // 404
$response->isSuccess(); // false
```

### Python 

```python
riak.RiakError: 'no_type'
```

### C# 

```c#
result.IsSuccess == false
result.ResultCode == ResultCode.NotFound
```

### JavaScript 

```javascript
rslt.isNotFound === true;
```

### Erlang 

```erlang
{error,notfound}
```

### Go 

```go
fvc := cmd.(*riak.FetchValueCommand)
rsp := fvc.Response
rsp.IsNotFound // Will be true
```

### Curl 

```curl
not found
```
