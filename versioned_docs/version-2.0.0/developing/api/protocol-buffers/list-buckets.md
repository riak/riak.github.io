---
title: "List Buckets"
id: pbc_list_buckets
slug: list-buckets
sidebar_position: 0
---

List all of the bucket names available.

:::note Caution
This call can be expensive for the server. Do not use in performance-sensitive
code.
:::

## Request

Only the message code is required.

## Response

```protobuf
message RpbListBucketsResp {
    repeated bytes buckets = 1;
}
```

Values

* `buckets` --- Buckets on the server

## Example

#### Request

```bash
Hex      00 00 00 01 0F
Erlang <<0,0,0,1,15>>

RpbListBucketsReq - only message code defined
```

#### Response

```bash
Hex      00 00 00 2A 10 0A 02 62 31 0A 02 62 35 0A 02 62
         34 0A 02 62 38 0A 02 62 33 0A 03 62 31 30 0A 02
         62 39 0A 02 62 32 0A 02 62 36 0A 02 62 37
Erlang <<0,0,0,42,16,10,2,98,49,10,2,98,53,10,2,98,52,10,2,98,56,10,2,98,51,10,
         3,98,49,48,10,2,98,57,10,2,98,50,10,2,98,54,10,2,98,55>>

RpbListBucketsResp protoc decode:
buckets: "b1"
buckets: "b5"
buckets: "b4"
buckets: "b8"
buckets: "b3"
buckets: "b10"
buckets: "b9"
buckets: "b2"
buckets: "b6"
buckets: "b7"
```
