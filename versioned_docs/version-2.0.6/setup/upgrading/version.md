---
title: "Upgrading to Riak KV 2.0.6"
id: upgrading_version
slug: version
sidebar_position: 1
---

When upgrading to Riak 2.0 from an earlier version, we strongly
recommend reading each section of the following guide. This guide
explains which default Riak behaviors have changed and specific steps
to take for a successful upgrade.

For an overview of the new features and functionality
included in version 2.0, check out our guide to Riak 2.0.

## New Clients

To take advantage of the new features available in Riak 2.0, we
recommend upgrading your application to an official Basho client that
was built with those features in mind. There are official
2.0-compatible clients in the following languages:

* [Java](https://github.com/basho/riak-java-client)
* [Ruby](https://github.com/basho/riak-ruby-client)
* [Python](https://github.com/basho/riak-python-client)
* [Erlang](https://github.com/basho/riak-erlang-client)

While we strongly recommend using the newest versions of these clients,
older versions will still work with Riak 2.0, with the drawback that
those older clients will not able to take advantage of new features like [data types](../../developing/data-types/index.md) or the new [Riak Search](../../using/reference/search.md).

## Bucket Types

In versions of Riak prior to 2.0, the location of objects was
determined by objects' [bucket](../../learn/concepts/buckets.md) and [key](../../learn/concepts/keys-and-objects.md), while all bucket-level configurations were managed by setting [bucket properties](../../developing/usage/bucket-types.md).

In Riak 2.0, [bucket types](../../using/reference/bucket-types.md) are both an additional namespace for locating objects *and* a new way of configuring bucket properties in a systematic fashion. More comprehensive details on usage can be found in the documentation on [using bucket types](../../using/reference/bucket-types.md).
Here, we'll list some of the things to be aware of when upgrading.

#### Bucket types and object location

With the introduction of bucket types, the location of all Riak objects
is determined by:

* bucket type
* bucket
* key

This means there are 3 namespaces involved in object location instead of 2.
A full tutorial can be found in [Using Bucket Types](../../using/reference/bucket-types.md).

If your application was written using a version of Riak
prior to 2.0, you should make sure that any endpoint in Riak targeting
a bucket/key pairing is changed to accommodate a bucket
type/bucket/key location.

If you're using a pre-2.0-specific client and targeting a location
specified only by bucket and key, Riak will use the default bucket
configurations. The following URLs are equivalent in Riak 2.0:

```
/buckets/<bucket>/keys/<key>
/types/default/buckets/<bucket>/keys/<key>
```

If you use object locations that don't specify a bucket type, you have
three options:

* Accept Riak's [default bucket configurations](../../using/reference/bucket-types.md#buckets-as-namespaces)
* Change Riak's defaults using your [configuration files](../../configuring/reference.md)
* Manage multiple sets of bucket properties by specifying those
  properties for all operations (not recommended)

#### Features that rely on bucket types

One reason we recommend using bucket types for Riak 2.0
and later is because many newer Riak features were built with
bucket types as a precondition:

* [Strong consistency](../../using/reference/strong-consistency.md) --- Using Riak's strong consistency subsystem
  requires you to set the `consistent` parameter on a bucket type to
  `true`
* [Riak Data Types](../../developing/data-types/index.md) --- In order to use Riak Data
  Types, you must [create bucket types](../../developing/data-types/index.md#getting-started-with-riak-data-types) specific to the
  Data Type you are using

#### Bucket types and downgrades

If you decide to use bucket types, please remember that you
cannot [downgrade](../../setup/downgrade.md) your cluster to a version of
Riak prior to 2.0 if you have both created and activated a
bucket type.

## New allow_mult Behavior

One of the biggest changes in version 2.0 regarding
application development involves Riak's default
[siblings](../../learn/concepts/causal-context.md#siblings) behavior.

In versions prior to 2.0, the
`allow_mult` setting was set to `false` by default for all buckets.
So Riak's default behavior was to resolve
object replica [conflicts](../../developing/usage/conflict-resolution/index.md) between nodes on its
own; relieving connecting clients of the need to resolve those
conflicts.

**In 2.0, `allow_mult` is set to `true` for any bucket type that you
create and activate.**

This means that the default when [using bucket types](../../using/reference/bucket-types.md) is to handle [conflict resolution](../../developing/usage/conflict-resolution/index.md) on the client side using
either traditional [vector clocks](../../learn/concepts/causal-context.md#vector-clocks) or the newer [dotted version vectors](../../learn/concepts/causal-context.md#dotted-version-vectors).

If you wish to set `allow_mult` to `false` in version 2.0, you have two
options:

* Set your bucket type's `allow_mult` property to `false`.
* Don't use bucket types.

More information on handling siblings can be found in our documentation
on [conflict resolution](../../developing/usage/conflict-resolution/index.md).

## Enabling Security

The [authentication and authorization](../../using/security/basics.md) mechanisms included with Riak 2.0 should only be turned
on after careful testing in a non-production environment. Security
changes the way all applications interact with Riak.

## When Downgrading is No Longer an Option

If you decide to upgrade to version 2.0, you can still downgrade your
cluster to an earlier version of Riak if you wish, *unless* you perform
one of the following actions in your cluster:

* Index data to be used in conjunction with the new [Riak Search](../../using/reference/search.md).
* Create *and* activate one or more [bucket types](../../using/reference/bucket-types.md). By extension, you will not be able to downgrade your cluster if you have used the following features, both of which rely on bucket types:
  * [Strong consistency](../../using/reference/strong-consistency.md)
  * [Riak Data Types](../../developing/data-types/index.md)

If you use other new features, such as [Riak Security](../../using/security/basics.md) or the new [configuration files](../../configuring/reference.md), you can still
downgrade your cluster, but you will no longer be able to use those
features after the downgrade.

## Upgrading Your Configuration System

Riak 2.0 offers a new configuration system that both simplifies
configuration syntax and uses one configuration file, `riak.conf`,
instead of the two files, `app.config` and `vm.args`, required by the
older system. Full documentation of the new system can be found in
[Configuration Files](../../configuring/reference.md).

If you're upgrading to Riak 2.0 from an earlier version, you have two
configuration options:

1. Manually port your configuration from the older system into the new
   system.
2. Keep your configuration files from the older system, which are still
   recognized in Riak 2.0.

If you choose the first option, make sure to consult the
[configuration files](../../configuring/reference.md) documentation, as many configuration parameters have changed names, some no longer exist, and others have been added that were not previously available.

If you choose the second option, Riak will automatically determine that
the older configuration system is being used. You should be aware,
however, that some settings must be set in an `advanced.config` file.
For a listing of those parameters, see our documentation on [advanced configuration](../../configuring/reference.md#advanced-configuration).

If you choose to keep the existing `app.config` files, you *must* add the
following additional settings in the `riak_core` section:

```erlang
{riak_core,
     [{default_bucket_props,
          [{allow_mult,false}, %% or the same as an existing setting
           {dvv_enabled,false}]},
          %% other settings
     ]
},
```

This is to ensure backwards compatibility with 1.4 for these bucket properties.

## Upgrading LevelDB

If you are using LevelDB and upgrading to 2.0, no special steps need to
be taken, *unless* you wish to use your old `app.config` file for
configuration. If so, make sure that you set the
`total_leveldb_mem_percent` parameter in the `eleveldb` section of the
file to 70.

```erlang
{eleveldb, [
    %% ...
    {total_leveldb_mem_percent, 70},
    %% ...
]}
```

If you do not assign a value to `total_leveldb_mem_percent`, Riak will
default to a value of `15`, which can cause problems in some clusters.

## Upgrading Search

Information on upgrading Riak Search to 2.0 can be found in our
[Search upgrade guide](../../setup/upgrading/search.md).

## Migrating from Short Names

Although undocumented, versions of Riak prior to 2.0 did not prevent the
use of the Erlang VM's `-sname` configuration parameter. As of 2.0 this
is no longer permitted. Permitted in 2.0 are `nodename` in `riak.conf`
and `-name` in `vm.args`. If you are upgrading from a previous version
of Riak to 2.0 and are using `-sname` in your `vm.args`, the below steps
are required to migrate away from `-sname`.

1. Upgrade to Riak
   [1.4.12](http://docs.basho.com/riak/1.4.12/downloads/).
2. Back up the ring directory on each node, typically located in
   `/var/lib/riak/ring`.
3. Stop all nodes in your cluster.
4. Run [`riak-admin reip <old_nodename> <new_nodename>`](../../using/admin/riak-admin.md#reip) on each node in your cluster, for each node in your
   cluster. For example, in a 5 node cluster this will be run 25 total
   times, 5 times on each node. The `<old_nodename>` is the current
   shortname, and the `<new_nodename>` is the new fully qualified hostname.
5. Change `riak.conf` or `vm.args`, depending on which configuration
   system you're using, to use the new fully qualified hostname on each
   node.
6. Start each node in your cluster.
