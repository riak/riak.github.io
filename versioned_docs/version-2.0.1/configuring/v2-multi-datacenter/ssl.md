---
title: "SSL"
id: configuring_v2_replication_ssl
slug: ssl
sidebar_position: 2
---

## Features

Riak REPL SSL support consists of the following items:

* Encryption of replication data
* SSL certificate chain validation
* SSL common name whitelisting support

## SSL Configuration

To configure SSL, you will need to include the following four settings
in the `riak-repl` section of your `advanced.config`:

```erlang
{riak-repl, [
             % ...
             {ssl_enabled, true},
             {certfile, "/full/path/to/site1-cert.pem"},
             {keyfile, "/full/path/to/site1-key.pem"},
             {cacertdir, "/full/path/to/cacertsdir"}
             % ...
            ]}
```

The `cacertdir` is a directory containing all of the CA certificates
needed to verify the CA chain back to the root.

## Verifying Peer Certificates

Verification of a peer's certificate common name *(CN)* is enabled by using
the `peer_common_name_acl` property in the `riak_repl` section of your
`advanced.config` to specify an Access Control List *(ACL)*.

The ACL is a list of one or more *patterns*, separated by commas. Each
pattern may be either the exact CN of a certificate to allow, or a
wildcard in the form `*.some.domain.name`. Pattern comparison is
case-insensitive, and a CN matching any of the patterns is allowed to connect.

For example, `["*.corp.com"]` would match `site3.corp.com` but not
`foo.bar.corp.com` or `corp.com`. If the ACL were
`["*.corp.com", "foo.bar.corp.com"]`, `site3.corp.com` and `foo.bar.corp.com`
would be allowed to connect, but `corp.com` still would not.

If no ACL (or only the special value `"*"`) is specified, no CN filtering
is performed, except as described below.

:::note Identical Local and Peer Common Names
As a special case supporting the view that a host's CN is a fully-qualified
domain name that uniquely identifies a single network device, if the CNs of
the local and peer certificates are the same, the nodes will *NOT* be allowed
to connect.

This evaluation supercedes ACL checks, so it cannot be overridden with any
setting of the `peer_common_name_acl` property.
:::

### Examples

The following example will only allow connections from peer certificate
names like `db.bashosamplecorp.com` and `security.bashosamplecorp.com`:

```erlang
{riak_repl, [
             % ...
             {peer_common_name_acl, ["db.bashosamplecorp.com", "security.bashosamplecorp.com"]}
             % ...
            ]}
```

The following example will allow connections from peer certificate names
like `foo.bashosamplecorp.com` or `db.bashosamplecorp.com`, but not a
peer certificate name like `db.backup.bashosamplecorp.com`:

```erlang
{riak_repl, [
             % ...
             {peer_common_name_acl, ["*.bashosamplecorp.com"]}
             % ...
            ]}
```

This example will match any peer certificate name (and is the default):

```erlang
{riak_repl, [
             % ...
             {peer_common_name_acl, "*"}
             % ...
            ]}
```

## SSL CA Validation

You can adjust the way CA certificates are validated by adding the
following to the `riak_repl` section of your `advanced.config`:

```erlang
{riak_repl, [
             % ...
             {ssl_depth, ...}
             % ...
            ]}
```

:::note `ssl_depth` takes an integer parameter.

The depth specifies the maximum number of intermediate certificates that
may follow the peer certificate in a valid certification path. By default,
no more than one (1) intermediate certificate is allowed between the peer
certificate and root CA. By definition, intermediate certificates cannot
be self signed.

For example:

* A depth of 0 indicates that the certificate must be signed directly
  by a root certificate authority (CA)
* A depth of 1 indicates that the certificate may be signed by at most
  1 intermediate CA's, followed by a root CA
* A depth of 2 indicates that the certificate may be signed by at most
  2 intermediate CA's, followed by a root CA

## Compatibility

Replication SSL is ONLY available in Riak 1.2+.

If SSL is enabled and a connection is made to a Riak Enterprise 1.0 or
1.1 node, the connection will be denied and an error will be logged.

### Self-Signed Certificates

You can generate your own CA and keys by using [this
guide](http://www.debian-administration.org/articles/618).

Make sure that you remove the password protection from the keys you
generate.
