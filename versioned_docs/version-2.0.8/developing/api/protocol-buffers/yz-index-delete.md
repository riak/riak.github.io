---
title: "Yokozuna Index Delete"
id: pbc_yz_index_delete
slug: yz-index-delete
sidebar_position: 23
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

Returns a [RpbDelResp](./index.md#message-codes) code with no data on success.