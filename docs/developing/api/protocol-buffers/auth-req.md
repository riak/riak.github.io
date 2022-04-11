---
title: "Auth Request"
id: pbc_auth_request
slug: auth-req 
sidebar_position: 26
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

For more on authentication, see our documentation on [Authentication and Authorization](../../../using/security/basics.md).
