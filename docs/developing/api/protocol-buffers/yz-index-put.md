---
title: "PBC Yokozuna Index Put"
id: pbc_yz_index_put
---

Create a new index or modify an existing index.

## Request

```protobuf
message RpbYokozunaIndexPutReq {
    required RpbYokozunaIndex index  =  1;
}
```

Each message must contain a `RpbYokozunaIndex` message providing
information about the index being stored.

```protobuf
message RpbYokozunaIndex {
    required bytes name   =  1;
    optional bytes schema =  2;
    optional uint32 n_val =  3;
}
```

Each message specifying an index must include the index's name as a
binary (as `name`). Optionally, you can specify a [`schema`](/riak/kv/2.2.3/developing/usage/search-schemas) name and/or an `n_val`, i.e. the number of nodes on which the index is stored (for GET requests) or on which you wish the index to be stored (for PUT requests). An index's `n_val` must match the associated bucket's `n_val`.

## Response

Returns a [RpbPutResp](/riak/kv/2.2.3/developing/api/protocol-buffers/#message-codes) code with no data on success.

