---
title: "Set Bucket Type"
id: pbc_set_bucket_type
slug: set-bucket-type
sidebar_position: 14
---

Assigns a set of [bucket properties](/docs/developing/api/protocol-buffers/set-bucket-props) to a
[bucket type](/docs/developing/usage/bucket-types).

## Request

```protobuf
message RpbSetBucketTypeReq {
    required bytes type = 1;
    required RpbBucketProps props = 2;
}
```

The `type` field specifies the name of the bucket type as a binary. The
`props` field contains an [`RpbBucketProps`](/docs/developing/api/protocol-buffers/get-bucket-props).
