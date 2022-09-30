---
title: "Source"
id: installing_source
sidebar_position: 9
---

[install source erlang]: ./erlang.md

[install debian & ubuntu#source]: ../debian-ubuntu.md#installing-from-source

[install freebsd#source]: ../freebsd.md#installing-from-source

[install mac osx#source]: ../mac-osx.md#installing-from-source

[install rhel & centos#source]: ../rhel-centos.md#installing-from-source

[install verify]: ../verify.md

Riak should be installed from source if you are building on a platform
for which a package does not exist or if you are interested in
contributing to Riak.

## Dependencies

### Erlang

To install Riak, you will need to have [Erlang](http://www.erlang.org/) installed. We strongly recommend using Basho's patched version of Erlang to install Riak 2.0. All of the patches in this version have been incorporated into later versions of the official Erlang/OTP release.

See [Installing Erlang][install source erlang] for instructions.

### Git

Riak depends on source code located in multiple Git repositories. Install [Git](http://git-scm.com) on the target system before attempting the build.

### GCC

Riak will not compile with Clang. Please make sure your default C/C++
compiler is [GCC](https://gcc.gnu.org/).

## Installation

The following instructions generate a complete, self-contained build of
Riak in `$RIAK/rel/riak` where `$RIAK` is the location of the unpacked
or cloned source.

### Installing from GitHub

The [Riak Github respository](http://github.com/basho/riak) has much
more information on building and installing Riak from source. To clone
and build Riak from source, follow the steps below.

Clone the repository using [Git](http://git-scm.com) and build:

```bash
git clone git://github.com/basho/riak.git
cd riak
make locked-deps
make rel
```

## Platform-Specific Instructions

For instructions about specific platforms, see:

* [Debian & Ubuntu][install debian & ubuntu#source]
* [FreeBSD][install freebsd#source]
* [Mac OS X][install mac osx#source]
* [RHEL & CentOS][install rhel & centos#source]

If you are running Riak on a platform not in the list above and need
some help getting it up and running, join The Riak Mailing List and
inquire about it there. We are happy to help you get up and running with
Riak.

### Windows

Riak is not currently supported on Microsoft Windows.

## Next Steps

Now that Riak is installed, check out [Verifying a Riak Installation][install verify].
