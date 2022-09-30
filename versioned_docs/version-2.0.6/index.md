---
title: "Riak KV"
id: index
slug: /
sidebar_position: 0
---

[riak_repl]: https://github.com/basho/riak_repl

[config index]: configuring/index.md

[downloads]: setup/installing/index.md

[install index]: setup/installing/index.md

[plan index]: setup/planning/index.md

[perf open files]: using/performance/open-files-limit

[install debian & ubuntu]: setup/installing/debian-ubuntu

[usage search]: developing/usage/search.md

[getting started]: developing/getting-started/index.md

[dev client libraries]: developing/client-libraries.md

Riak KV is a distributed NoSQL database designed to deliver maximum data availability by distributing data across multiple servers. As long as your Riak KV client can reach one Riak server, it should be able to write data.

[Riak Replication][riak_repl] includes multi-datacenter cluster replication, which ensures low-latency and robust business continuity.

## Supported Operating Systems

* Amazon Linux 2016.09 (AWS)
* CentOS 6
* CentOS 7
* Debian 7.0 ("Wheezy")
* Debian 8.0 ("Jessie")
* Red Hat Enterprise Linux 6
* Red Hat Enterprise Linux 7
* Solaris 10
* SUSE Linux Enterprise Server 11
* Ubuntu 12.04 ("Precise Pangolin")
* Ubuntu 14.04 ("Trusty Tahr")
* Ubuntu 16.04 ("Xenial Xerus")
* Mac OSX 10.8+ (development only)

## Getting Started

Are you brand new to Riak KV? Start by [downloading][downloads] Riak KV, and then follow the below pages to get started:

1. [Install Riak KV][install index]
2. [Plan your Riak KV setup][plan index]
3. [Configure Riak KV for your needs][config index]

:::note Developing with Riak KV
If you are looking to integrate Riak KV with your existing tools, check out the [Developing with Riak KV](developing/index.md) docs. They provide instructions and examples for languages such as: Java, Ruby, Python, Go, Haskell, NodeJS, Erlang, and more.
:::

## Popular Docs

1. [Open Files Limit][perf open files]
2. [Installing on Debian-Ubuntu][install debian & ubuntu]
3. [Developing with Riak KV: Searching][usage search]
4. [Developing with Riak KV: Getting Started][getting started]
5. [Developing with Riak KV: Client Libraries][dev client libraries]
