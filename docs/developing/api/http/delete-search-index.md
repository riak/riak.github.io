---
title: "HTTP Delete Search Index"
id: http_delete_search_index
---

Deletes a Riak Search index.

## Request

```
DELETE /search/index/<index_name>
```

## Normal Response Codes

* `204 No Content` --- The index was successfully deleted (also returned
    if the index did not exist to begin with)

## Typical Error Codes

* `503 Service Unavailable` --- The request timed out internally
