---
title: "Riak KV 2.2.3 Release Notes"
id: index_release_notes
---

Released April 3, 2017.

In fixing a `riak` and `riak-admin` [issue](https://github.com/basho/node_package/pull/210), we inadvertently used a Bash-specific script variable (`$RANDOM`), causing the riak attach and riak top commands to fail on Ubuntu when /bin/sh is aliased to Dash.

## Bugs Fixed

* [[riak PR 909](https://github.com/basho/riak/pull/909) & [node_package PR 217](https://github.com/basho/node_package/pull/217)] Replace `$RANDOM` with PID to support non-Bash.

## Previous Release Notes

Please see the KV 2.2.2 release notes [here](/riak/kv/2.2.2/release-notes/), and the KV 2.2.1 release notes [here](/riak/kv/2.2.1/release-notes/).
