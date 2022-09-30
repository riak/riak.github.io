---
title: "Yokozuna Schema Put"
id: pbc_yz_schema_put
slug: yz-schema-put
sidebar_position: 25
---

Create a new Solr [search schema](../../../developing/usage/search-schemas.md).

## Request

```protobuf
message RpbYokozunaSchemaPutReq {
    required RpbYokozunaSchema schema =  1;
}
```

Each message must contain a `RpbYokozunaSchema` object structure.

```protobuf
message RpbYokozunaSchema {
    required bytes name    =  1;
    optional bytes content =  2;
}
```

This message *must* include both the schema `name` and its Solr [search schema](../../../developing/usage/search-schemas.md) `content` as XML.

## Response

Returns a [RpbPutResp](../../../developing/api/protocol-buffers/index.md#message-codes) code with no data on success.
