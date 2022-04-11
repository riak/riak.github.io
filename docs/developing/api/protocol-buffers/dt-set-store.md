---
title: "Data Type Set Store"
id: pbc_dt_set_store
slug: dt-set-store
sidebar_position: 19
---

An operation to update a set, either on its own (at the bucket/key
level) or [inside of a map](../../../developing/api/protocol-buffers/dt-map-store.md).

## Request

```protobuf
message SetOp {
    repeated bytes adds    = 1;
    repeated bytes removes = 2;
}
```

Set members are binary values that can only be added (`adds`) or removed
(`removes`) from a set. You can add and/or remove as many members of a
set in a single message as you would like.
