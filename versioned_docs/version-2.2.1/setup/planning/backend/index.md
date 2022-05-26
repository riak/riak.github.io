---
title: "Choosing a Backend"
id: planning_choose_backend
sidebar_position: 2
---

[plan backend bitcask]: ../../../setup/planning/backend/bitcask.md
[plan backend leveldb]: ../../../setup/planning/backend/leveldb.md
[plan backend memory]: ../../../setup/planning/backend/memory.md
[plan backend multi]: ../../../setup/planning/backend/multi.md
[dev api backend]: ../../../developing/api/backend.md

Pluggable storage backends are a key feature of Riak KV. They enable you to
choose a low-level storage engine that suits specific operational needs.
For example, if your use case requires maximum throughput, data
persistence, and a bounded keyspace, then Bitcask is a good choice. On
the other hand, if you need to store a large number of keys or to use
secondary indexes, LevelDB is likely a better choice.

The following backends are supported:

* [Bitcask][plan backend bitcask]
* [LevelDB][plan backend leveldb]
* [Memory][plan backend memory]
* [Multi][plan backend multi]

Riak KV supports the use of custom storage backends as well. See the
storage [Backend API][dev api backend] for more details.

| Feature or Characteristic                       | Bitcask | LevelDB | Memory |
|:------------------------------------------------|:-------:|:-------:|:------:|
| Default Riak KV backend                         |    ✓    |         |        |
| Persistent                                      |    ✓    |    ✓    |        |
| Keyspace in RAM                                 |    ✓    |         |   ✓    |
| Keyspace can be greater than available RAM      |         |    ✓    |        |
| Keyspace loaded into RAM on startup<sup>1</sup> |    ✓    |         |        |
| Objects in RAM                                  |         |         |   ✓    |
| Object expiration                               |    ✓    |         |   ✓    |
| Secondary indexes                               |         |    ✓    |   ✓    |
Tiered storage

<sup>1</sup> Noted here since this can affect Riak start times for large
keyspaces.
