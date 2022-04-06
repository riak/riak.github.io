---
title: "PBC Get Bucket Type"
id: pbc_get_bucket_type
---

Gets the bucket properties associated with a [bucket type](/riak/kv/2.2.3/using/cluster-operations/bucket-types).

## Request

```protobuf
message RpbGetBucketTypeReq {
    required bytes type = 1;
}
```

Only the name of the bucket type needs to be specified (under `name`).

## Response

A bucket type's properties will be sent to the client as part of an
[`RpbBucketProps`](/riak/kv/2.2.3/developing/api/protocol-buffers/get-bucket-props) message.
