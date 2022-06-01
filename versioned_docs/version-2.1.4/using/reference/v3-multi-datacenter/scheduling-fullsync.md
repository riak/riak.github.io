---
title: "Scheduling Fullsync"
id: managing_ref_v3_fullsync
slug: scheduling-fullsync
sidebar_position: 3
---

[config reference#advanced]: ../../../configuring/reference.md#advanced-configuration

The `fullsync_interval` parameter can be configured in the `riak-repl`
section of [`advanced.config`][config reference#advanced] with either:

* a single integer value representing the duration to wait, in minutes,
  between fullsyncs, *or*
* a list of pairs of the form `[{"clustername", time_in_minutes},
  {"clustername", time_in_minutes}, ...]` pairs for each sink
  participating in fullsync replication. Note the commas separating each
  pair, and `[ ]` surrounding the entire list.

## Examples

Sharing a fullsync time (in minutes) for all sinks:

```erlang
{riak_repl, [
    % ...
    {data_root, "/configured/repl/data/root"},
    {fullsync_interval, 90} %% fullsync runs every 90 minutes
    % ...
    ]}
```

List of multiple sinks with separate times in minutes:

```erlang
{riak_repl, [
    % ...
    {data_root, "/configured/repl/data/root"},
    % clusters sink_boston + sink_newyork have difference intervals (in minutes)
    {fullsync_interval, [
        {"sink_boston", 120},  %% fullsync to sink_boston with run every 120 minutes
        {"sink_newyork", 90}]} %% fullsync to sink_newyork with run every 90 minutes
  
    ]}
```

## Additional Fullsync Stats

Additional fullsync stats per sink have been added in Riak Enterprise.

* `fullsyncs_completed` — The number of fullsyncs that have been
  completed to the specified sink cluster.
* `fullsync_start_time` — The time the current fullsink to the
  specified cluster began.
* `last_fullsync_duration` — The duration (in seconds) of the last
  completed fullsync.
