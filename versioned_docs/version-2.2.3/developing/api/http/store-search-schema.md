---
title: "Store Search Schema"
id: http_store_search_schema
slug: store-search-schema
sidebar_position: 19
---

Creates a new Riak [Search schema](../../../developing/usage/search-schemas.md).

## Request

``PUT /search/schema/<schema_name>``

## Required Form Data

In order to create a new Search schema, you must pass Riak a properly
formed XML schema. More information can be found in the [Search Schema](../../../developing/usage/search-schemas.md) document. If you've created a schema and stored it in the filed
`my_schema.xml` and would like to create a new schema called
`my_custom_schema`, you would use the following HTTP request:

```bash
curl -XPUT http://localhost:8098/search/schema/my_custom_schema \
  -H "Content-Type: application/xml" \
  --data-binary @my_schema.xml
```

## Normal Response

* `204 No Content` --- The schema has been successfully created

## Typical Error Codes

* `400 Bad Request` --- The schema cannot be created because there is
    something wrong with the schema itself, e.g. an XML formatting error
    that makes Riak Search unable to parse the schema
* `409 Conflict` --- The schema cannot be created because there is
    already a schema with that name
* `503 Service Unavailable` --- The request timed out internally
