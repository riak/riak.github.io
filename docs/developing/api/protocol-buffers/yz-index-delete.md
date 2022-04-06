---
title: "PBC Yokozuna Index Delete"
id: pbc_yz_index_delete
---

Delete a search index.

## Request

The `name` parameter is the name of the index to delete, as a binary.

```protobuf
message RpbYokozunaIndexDeleteReq {
    required bytes name  =  1;
}
```

## Response

Returns a [RpbDelResp](/riak/kv/2.2.3/developing/api/protocol-buffers/#message-codes) code with no data on success.

