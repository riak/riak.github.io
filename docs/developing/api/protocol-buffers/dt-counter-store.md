---
title: "PBC Data Type Counter Store"
id: pbc_dt_counter_store
---

An operation to update a [counter](/riak/kv/2.2.3/developing/data-types).

## Request

```protobuf
message CounterOp {
    optional sint64 increment = 1;
}
```

The `increment` value specifies how much the counter will be incremented
or decremented, depending on whether the `increment` value is positive
or negative. This operation can be used to update counters that are
stored on their own in a key or [within a map](/riak/kv/2.2.3/developing/api/protocol-buffers/dt-map-store).
