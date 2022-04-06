---
title: "PBC Yokozuna Schema Put"
id: pbc_yz_schema_put
---

Create a new Solr [search schema](/riak/kv/2.2.3/developing/usage/search-schemas).

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

This message *must* include both the schema `name` and its Solr [search schema](/riak/kv/2.2.3/developing/usage/search-schemas) `content` as XML.

## Response

Returns a [RpbPutResp](/riak/kv/2.2.3/developing/api/protocol-buffers/#message-codes) code with no data on success.
