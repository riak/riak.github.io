---
title: "Search Index Info"
id: http_search_index_info
slug: search-index-info 
sidebar_position: 14
---

Retrieves information about all currently available [Search indexes](../../../developing/usage/search.md) in JSON format.

## Request

```
GET /search/index
```

## Response

If there are no currently available Search indexes, a `200 OK` will be
returned but with an empty list as the response value.

Below is the example output if there is one Search index, called
`test_index`, currently available:

```json
[
  {
    "n_val": 3,
    "name": "test_index",
    "schema": "_yz_default"
  }
]
```

#### Normal Response Codes

* `200 OK`

#### Typical Error Codes

* `404 Object Not Found` --- Typically returned if Riak Search is not
    currently enabled on the node
* `503 Service Unavailable` --- The request timed out internally
