---
title: "PBC Auth Request"
id: pbc_auth_request
---

Sends a username (`user`) and password (`password`) to Riak as part of
an authentication request. Both values are sent as binaries.

## Request

```protobuf
message RpbAuthReq {
    required bytes user = 1;
    required bytes password = 2;
}
```

For more on authentication, see our documentation on [Authentication and Authorization](/riak/kv/2.2.3/using/security/basics).
