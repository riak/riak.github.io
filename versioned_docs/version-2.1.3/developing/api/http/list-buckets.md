---
title: "List Buckets"
id: http_list_buckets
slug: list-bucket
sidebar_position: 3
---

Lists all known buckets (ones that have keys stored in them).

:::note Not for production use
Similar to the list keys operation, this requires traversing all keys stored
in the cluster and should not be used in production.
:::

## Request

```bash
GET /buckets?buckets=true
```

Required query parameter:

* **buckets=true** - required to invoke the list-buckets functionality

## Response

Normal status codes:

* `200 OK`

Important headers:

* `Content-Type - application/json`

The JSON object in the response will contain a single entry, "buckets", which
will be an array of bucket names.

## Example

```bash
$ curl -i http://localhost:8098/buckets?buckets=true
HTTP/1.1 200 OK
Vary: Accept-Encoding
Server: MochiWeb/1.1 WebMachine/1.9.0 (participate in the frantic)
Date: Fri, 30 Sep 2011 15:24:35 GMT
Content-Type: application/json
Content-Length: 21

{"buckets":["files"]}
```
