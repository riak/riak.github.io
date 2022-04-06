---
title: "PBC Yokozuna Schema Get"
id: pbc_yz_schema_get
---

Fetch a [search schema](/riak/kv/2.2.3/developing/usage/search-schemas) from Riak Search.

## Request

In a request message, you only need to specify the name of the schema as
a binary (under `name`);

```protobuf
message RpbYokozunaSchemaGetReq {
    required bytes name  =  1;  // Schema name
}
```

## Response

```protobuf
message RpbYokozunaSchemaGetResp {
  required RpbYokozunaSchema schema =  1;
}
```

The response message will include a `RpbYokozunaSchema` structure.

```protobuf
message RpbYokozunaSchema {
    required bytes name    =  1;
    optional bytes content =  2;
}
```

This message includes the schema `name` and its xml `content`.
