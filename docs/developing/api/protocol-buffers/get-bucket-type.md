---
title: "Get Bucket Type"
id: pbc_get_bucket_type
slug: get-bucket-type 
sidebar_position: 13
---

Gets the bucket properties associated with a [bucket type](../../../using/cluster-operations/bucket-types.md).

## Request

```protobuf
message RpbGetBucketTypeReq {
    required bytes type = 1;
}
```

Only the name of the bucket type needs to be specified (under `name`).

## Response

A bucket type's properties will be sent to the client as part of an
[`RpbBucketProps`](../../../developing/api/protocol-buffers/get-bucket-props.md) message.
