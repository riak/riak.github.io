---
title: "PBC Data Type Union"
id: pbc_dt_union
---

A "union" type for update operations.

## Request

```protobuf
message DtOp {
    optional CounterOp counter_op = 1;
    optional SetOp     set_op     = 2;
    optional MapOp     map_op     = 3;
}
```

The included operation depends on the Data Type that is being updated.
`DtOp` messages are sent only as part of a [`DtUpdateReq`](/riak/kv/2.2.3/developing/api/protocol-buffers/dt-store) message.
