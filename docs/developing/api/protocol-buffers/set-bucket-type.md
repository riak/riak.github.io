---
title: "PBC Set Bucket Type"
id: pbc_set_bucket_type
---

Assigns a set of [bucket properties](/riak/kv/2.2.3/developing/api/protocol-buffers/set-bucket-props) to a
[bucket type](/riak/kv/2.2.3/developing/usage/bucket-types).

## Request

```protobuf
message RpbSetBucketTypeReq {
    required bytes type = 1;
    required RpbBucketProps props = 2;
}
```

The `type` field specifies the name of the bucket type as a binary. The
`props` field contains an [`RpbBucketProps`](/riak/kv/2.2.3/developing/api/protocol-buffers/get-bucket-props).
