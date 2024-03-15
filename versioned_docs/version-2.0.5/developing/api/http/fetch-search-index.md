---
title: "Fetch Search Index"
id: http_fetch_search_index
slug: fetch-search-index
sidebar_position: 15
---

Retrieves information about a Riak Search [index](../../../developing/usage/search.md#setup).

## Request

`GET /search/index/<index_name>`

## Normal Response Codes

* `200 OK`

## Typical Error Codes

* `404 Object Not Found` --- No Search index with that name is currently
    available
* `503 Service Unavailable` --- The request timed out internally

## Response

If the index is found, Riak will output a JSON object describing the
index, including its name, the [`n_val`](../../../developing/app-guide/replication-properties.md#a-primer-on-n-r-and-w) associated with it, and the [search schema](../../../developing/usage/search-schemas.md) used by the index. Here is an example:

```json
{
  "name": "my_index",
  "n_val": 3,
  "schema": "_yz_default"
}
```
