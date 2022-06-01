---
title: "Enabling and Disabling Debug Logging"
id: cluster_operations_logging
slug: logging
sidebar_position: 5
---

If you'd like to enable debug logging on the current node, i.e. set the
console log level to `debug`, you can do so without restarting the node
by accessing the Erlang console directly using the [`riak attach`](../../using/admin/riak-cli.md#attach) command. Once you run this command and drop into the console, enter the following:

```erlang
lager:set_loglevel(lager_file_backend, "/var/log/riak/console.log", debug).
```

You should replace the file location above (`/var/log/riak/console.log`)
with your platform-specific location, e.g. `./log/console.log` for a
source installation. This location is specified by the
`log.console.file` parameter explained above.

If you'd like to enable debug logging on *all* nodes instead of just one
node, you can enter the Erlang console of any running by running `riak
attach` and enter the following:

```erlang
rp(rpc:multicall(lager, set_loglevel, [lager_file_backend, "/var/log/riak/console.log", debug])).
```

As before, use the appropriate log file location for your cluster.

At any time, you can set the log level back to `info`:

```erlang
rp(rpc:multicall(lager, set_loglevel, [lager_file_backend, "/var/log/riak/console.log", info])).
```
