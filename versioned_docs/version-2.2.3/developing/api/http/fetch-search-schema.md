---
title: "Fetch Search Schema"
id: http_fetch_search_schema
slug: fetch-search-schema
sidebar_position: 18
---

Retrieves a Riak KV [search schema](../../../developing/usage/search-schemas.md).

## Request

`GET /search/schema/<schema_name>`

## Normal Response Codes

* `200 OK`

## Typical Error Codes

* `404 Object Not Found`
* `503 Service Unavailable` --- The request timed out internally

## Response

If the schema is found, Riak will return the contents of the schema as
XML (all Riak Search schemas are XML).
