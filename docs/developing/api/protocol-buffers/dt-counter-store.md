---
title: "Data Type Counter Store"
id: pbc_dt_counter_store
slug: dt-counter-store
sidebar_position: 18
---

An operation to update a [counter](../../../developing/data-types/counters.md).

## Request

```protobuf
message CounterOp {
    optional sint64 increment = 1;
}
```

The `increment` value specifies how much the counter will be incremented
or decremented, depending on whether the `increment` value is positive
or negative. This operation can be used to update counters that are
stored on their own in a key or [within a map](../../../developing/api/protocol-buffers/dt-map-store.md).
