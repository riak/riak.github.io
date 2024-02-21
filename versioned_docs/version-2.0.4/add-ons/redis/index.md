---
title: "Riak Redis Add-on"
id: add-ons_redis
sidebar_position: 0
---

[addon redis develop]: ./developing-rra.md

[addon redis features]: ./redis-add-on-features.md

[addon redis setup]: set-up-rra.md

Riak Redis Add-on (RRA) is a distributed cache service that joins the power of Redis caching with the eventual consistency guarantees of Riak KV. 

RRA enables you to reduce latency for Riak KV reads through the use of a distributed cache layer. This type of caching is most effective for keys that are immutable or have an infrequent change rate.

Whether you are looking to build out a session, shopping cart, advertisement or other dynamically-rendered copy, RRA helps reduce read pressure on your persistent store (Riak KV).

## Compatibility

RRA is supported on the following platforms:

* RHEL/CentOS 6
* RHEL/CentOS 7
* Ubuntu 12.04 LTS "Precise Pangolin"
* Ubuntu 14.04 LTS "Trusty Tahr"
* Debian 7 "Wheezy"
* Debian 8 "Jessie"

## Get Started

* [Set up RRA.][addon redis setup]
* [Develop with RRA.][addon redis develop]
* [Learn about RRA's features.][addon redis features]
