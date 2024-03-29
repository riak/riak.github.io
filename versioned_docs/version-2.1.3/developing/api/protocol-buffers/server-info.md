---
title: "Server Info"
id: pbc_server_info
slug: server-info
sidebar_position: 12
---

A message from Riak that contains two pieces of information about the
server: the name of the node and the version of Riak in use on that
node.

## Request

A request consists only of the `RpbGetServerInfoReq` message code. No
request message is defined.

## Response

```protobuf
message RpbGetServerInfoResp {
    optional bytes node = 1;
    optional bytes server_version = 2;
}
```

## Example

#### Request

```bash
Hex      00 00 00 01 07
Erlang <<0,0,0,1,7>>

RpbGetServerInfoReq - only message code defined
```

#### Response

```bash
Hex      00 00 00 17 08 0A 0E 72 69 61 6B 40 31 32 37 2E
         30 2E 30 2E 31 12 04 30 2E 31 30
Erlang <<0,0,0,23,8,10,14,114,105,97,107,64,49,50,55,46,48,46,48,46,49,18,4,48,
         46,49,48>>

RpbGetServerInfoResp protoc decode:
node: "riak@127.0.0.1"
server_version: "0.10"
```
