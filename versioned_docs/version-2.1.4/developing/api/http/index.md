---
title: "HTTP API"
id: apis_http
sidebar_position: 2
---

Riak has a rich, full-featured HTTP 1.1 API. This is an overview of the
operations you can perform via HTTP and can be used as a guide for
developing a compliant client. All URLs assume the default configuration
values where applicable. All examples use `curl` to interact with Riak.

> **URL Escaping**
>
> Buckets, keys, and link specifications may not contain unescaped
> slashes. Use a URL-escaping library or replace slashes with `%2F`.

## Bucket-related Operations

| Method   | URL                                             | Doc                                                                                |
| :------- | :---------------------------------------------- | :--------------------------------------------------------------------------------- |
| `GET`    | `/types/<type>/buckets/<bucket>/props`          | [HTTP Get Bucket Properties](../../../developing/api/http/get-bucket-props.md)     |
| `PUT`    | `/types/<type>/buckets/<bucket>/props`          | [HTTP Set Bucket Properties](../../../developing/api/http/set-bucket-props.md)     |
| `DELETE` | `/types/<type>/buckets/<bucket>/props`          | [HTTP Reset Bucket Properties](../../../developing/api/http/reset-bucket-props.md) |
| `GET`    | `/types/<type>/buckets?buckets=true`            | [HTTP List Buckets](../../../developing/api/http/list-buckets.md)                  |
| `GET`    | `/types/<type>/buckets/<bucket>/keys?keys=true` | [HTTP List Keys](../../../developing/api/http/list-keys.md)                        |

## Object-related Operations

| Method   | URL                                         | Doc                                                                 |
| :------- | :------------------------------------------ | :------------------------------------------------------------------ |
| `GET`    | `/types/<type>/buckets/<bucket>/keys/<key>` | [HTTP Fetch Object](../../../developing/api/http/fetch-object.md)   |
| `POST`   | `/types/<type>/buckets/<bucket>/<key>`      | [HTTP Store Object](../../../developing/api/http/store-object.md)   |
| `PUT`    | `/types/<type>/buckets/<bucket>/keys/<key>` | [HTTP Store Object](../../../developing/api/http/store-object.md)   |
| `DELETE` | `/types/<type>/buckets/<bucket>/keys/<key>` | [HTTP Delete Object](../../../developing/api/http/delete-object.md) |

## Riak-Data-Type-related Operations

For documentation on the HTTP API for [Riak Data Types](../../../learn/concepts/crdts.md),
see the `curl` examples in [Using Data Types](../../../developing/data-types/index.md#usage-examples)
and subpages e.g. [sets](../../../developing/data-types/sets.md).

Advanced users may consult the technical documentation inside the Riak
KV internal module `riak_kv_wm_crdt`.

## Query-related Operations

| Method | URL                                                          | Doc                                                                         |
| :----- | :----------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `POST` | `/mapred`                                                    | [HTTP MapReduce](../../../developing/api/http/mapreduce.md)                 |
| `GET`  | `/types/<type>/buckets/<bucket>/index/<index>/<value>`       | [HTTP Secondary Indexes](../../../developing/api/http/secondary-indexes.md) |
| `GET`  | `/types/<type>/buckets/<bucket>/index/<index>/<start>/<end>` | [HTTP Secondary Indexes](../../../developing/api/http/secondary-indexes.md) |

## Server-related Operations

| Method | URL      | Doc                                                                   |
| :----- | :------- | :-------------------------------------------------------------------- |
| `GET`  | `/ping`  | [HTTP Ping](../../../developing/api/http/ping.md)                     |
| `GET`  | `/stats` | [HTTP Status](../../../developing/api/http/status.md)                 |
| `GET`  | `/`      | [HTTP List Resources](../../../developing/api/http/list-resources.md) |

## Search-related Operations

| Method   | URL                            | Doc                                                                             |
| :------- | :----------------------------- | :------------------------------------------------------------------------------ |
| `GET`    | `/search/query/<index_name>`   | [HTTP Search Query](../../../developing/api/http/search-query.md)               |
| `GET`    | `/search/index`                | [HTTP Search Index Info](../../../developing/api/http/search-index-info.md)     |
| `GET`    | `/search/index/<index_name>`   | [HTTP Fetch Search Index](../../../developing/api/http/fetch-search-index.md)   |
| `PUT`    | `/search/index/<index_name>`   | [HTTP Store Search Index](../../../developing/api/http/store-search-index.md)   |
| `DELETE` | `/search/index/<index_name>`   | [HTTP Delete Search Index](../../../developing/api/http/delete-search-index.md) |
| `GET`    | `/search/schema/<schema_name>` | [HTTP Fetch Search Schema](../../../developing/api/http/fetch-search-schema.md) |
| `PUT`    | `/search/schema/<schema_name>` | [HTTP Store Search Schema](../../../developing/api/http/store-search-schema.md) |
