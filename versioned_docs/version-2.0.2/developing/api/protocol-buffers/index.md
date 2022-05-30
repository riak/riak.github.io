---
title: "Protocol Buffers API"
id: apis_pbc
sidebar_position: 3
---

This is an overview of the operations you can perform using the
[Protocol Buffers](https://code.google.com/p/protobuf/) Client (PBC)
interface to Riak, and can be used as a guide for developing a
PBC-compliant Riak client.

## Protocol

Riak listens on a TCP port (8087 by default) for incoming connections.
Once connected, the client can send a stream of requests on the same
connection.

Each operation consists of a [request message](https://developers.google.com/protocol-buffers/docs/encoding) and one or more response messages. Messages are all encoded the same way, consisting of:

* 32-bit length of message code + Protocol Buffers message in network
  order
* 8-bit message code to identify the Protocol Buffers message
* N bytes of Protocol Buffers-encoded message

### Example

```
00 00 00 07 09 0A 01 62 12 01 6B
|----Len---|MC|----Message-----|

Len = 0x07
Message Code (MC) = 0x09 = RpbGetReq
RpbGetReq Message = 0x0A 0x01 0x62 0x12 0x01 0x6B

Decoded Message:
bucket: "b"
key: "k"
```

## Message Codes

| Code | Message                    |
|:-----|:---------------------------|
| 0    | `RpbErrorResp`             |
| 1    | `RpbPingReq`               |
| 2    | `RpbPingResp`              |
| 3    | `RpbGetClientIdReq`        |
| 4    | `RpbGetClientIdResp`       |
| 5    | `RpbSetClientIdReq`        |
| 6    | `RpbSetClientIdResp`       |
| 7    | `RpbGetServerInfoReq`      |
| 8    | `RpbGetServerInfoResp`     |
| 9    | `RpbGetReq`                |
| 10   | `RpbGetResp`               |
| 11   | `RpbPutReq`                |
| 12   | `RpbPutResp`               |
| 13   | `RpbDelReq`                |
| 14   | `RpbDelResp`               |
| 15   | `RpbListBucketsReq`        |
| 16   | `RpbListBucketsResp`       |
| 17   | `RpbListKeysReq`           |
| 18   | `RpbListKeysResp`          |
| 19   | `RpbGetBucketReq`          |
| 20   | `RpbGetBucketResp`         |
| 21   | `RpbSetBucketReq`          |
| 22   | `RpbSetBucketResp`         |
| 23   | `RpbMapRedReq`             |
| 24   | `RpbMapRedResp`            |
| 25   | `RpbIndexReq`              |
| 26   | `RpbIndexResp`             |
| 27   | `RpbSearchQueryReq`        |
| 28   | `RbpSearchQueryResp`       |
| 29   | `RpbResetBucketReq`        |
| 30   | `RpbResetBucketResp`       |
| 31   | `RpbGetBucketTypeReq`      |
| 32   | `RpbSetBucketTypeResp`     |
| 40   | `RpbCSBucketReq`           |
| 41   | `RpbCSUpdateReq`           |
| 50   | `RpbCounterUpdateReq`      |
| 51   | `RpbCounterUpdateResp`     |
| 52   | `RpbCounterGetReq`         |
| 53   | `RpbCounterGetResp`        |
| 54   | `RpbYokozunaIndexGetReq`   |
| 55   | `RpbYokozunaIndexGetResp`  |
| 56   | `RpbYokozunaIndexPutReq`   |
| 57   | `RpbYokozunaIndexPutResp`  |
| 58   | `RpbYokozunaSchemaGetReq`  |
| 59   | `RpbYokozunaSchemaGetResp` |
| 60   | `RpbYokozunaSchemaPutReq`  |
| 80   | `DtFetchReq`               |
| 81   | `DtFetchResp`              |
| 82   | `DtUpdateReq`              |
| 83   | `DtUpdateResp`             |
| 253  | `RpbAuthReq`               |
| 254  | `RpbAuthResp`              |
| 255  | `RpbStartTls`              |

:::note Message Definitions
All Protocol Buffers messages are defined in the `riak.proto` and other
`.proto` files in the `/src` directory of the [RiakPB](http://www.github.com/basho/riak_pb) project.
:::

### Error Response

If the request does not result in an error, Riak will return one of a
variety of response messages, e.g. `RpbGetResp` or `RpbPutResp`,
depending on which request message is sent.

If the server experiences an error processing a request, however, it
will return an `RpbErrorResp` message instead of the response expected
for the given request (e.g. `RbpGetResp` is the expected response to
`RbpGetReq`). Error messages contain an error string and an error code,
like this:

```protobuf
message RpbErrorResp {
    required bytes errmsg = 1;
    required uint32 errcode = 2;
}
```

### Values

* `errmsg` --- A string representation of what went wrong
* `errcode` --- A numeric code. Currently, only `RIAKC_ERR_GENERAL=1`
  is defined.

## Bucket Operations

* [PBC List Buckets](../../../developing/api/protocol-buffers/list-buckets.md)
* [PBC List Keys](../../../developing/api/protocol-buffers/list-keys.md)
* [PBC Get Bucket Properties](../../../developing/api/protocol-buffers/get-bucket-props.md)
* [PBC Set Bucket Properties](../../../developing/api/protocol-buffers/set-bucket-props.md)
* [PBC Reset Bucket Properties](../../../developing/api/protocol-buffers/reset-bucket-props.md)

## Object/Key Operations

* [PBC Fetch Object](../../../developing/api/protocol-buffers/fetch-object.md)
* [PBC Store Object](../../../developing/api/protocol-buffers/store-object.md)
* [PBC Delete Object](../../../developing/api/protocol-buffers/delete-object.md)

## Query Operations

* [PBC MapReduce](../../../developing/api/protocol-buffers/mapreduce.md)
* [PBC Secondary Indexes](../../../developing/api/protocol-buffers/secondary-indexes.md)
* [PBC Search](../../../developing/api/protocol-buffers/search.md)

## Server Operations

* [PBC Ping](../../../developing/api/protocol-buffers/ping.md)
* [PBC Server Info](../../../developing/api/protocol-buffers/server-info.md)

## Bucket Type Operations

* [PBC Get Bucket Type](../../../developing/api/protocol-buffers/get-bucket-type.md)
* [PBC Set Bucket Type](../../../developing/api/protocol-buffers/set-bucket-type.md)

## Data Type Operations

* [PBC Data Type Fetch](../../../developing/api/protocol-buffers/dt-fetch.md)
* [PBC Data Type Union](../../../developing/api/protocol-buffers/dt-union.md)
* [PBC Data Type Store](../../../developing/api/protocol-buffers/dt-store.md)
* [PBC Data Type Counter Store](../../../developing/api/protocol-buffers/dt-counter-store.md)
* [PBC Data Type Set Store](../../../developing/api/protocol-buffers/dt-set-store.md)
* [PBC Data Type Map Store](../../../developing/api/protocol-buffers/dt-map-store.md)

## Yokozuna Operations

* [PBC Yokozuna Index Get](../../../developing/api/protocol-buffers/yz-index-get.md)
* [PBC Yokozuna Index Put](../../../developing/api/protocol-buffers/yz-index-put.md)
* [PBC Yokozuna Index Delete](../../../developing/api/protocol-buffers/yz-index-delete.md)
* [PBC Yokozuna Schema Get](../../../developing/api/protocol-buffers/yz-schema-get.md)
* [PBC Yokozuna Schema Put](../../../developing/api/protocol-buffers/yz-schema-put.md)
