---
title: "Security"
id: usage_security
sidebar_position: 14
---

Versions of Riak 2.0 and later come equipped with a [security subsystem](../../../using/security/basics.md) that enables you to choose

* which Riak users/clients are authorized to perform a wide variety of
  Riak operations, and
* how those users/clients are required to authenticate themselves.

The following four authentication mechanisms, aka [security sources](../../../using/security/managing-sources.md) are available:

* [Trust](../../../using/security/managing-sources.md#trust-based-authentication)-based
  authentication enables you to specify trusted
  [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing)s
  from which all clients will be authenticated by default
* [Password](../../../using/security/managing-sources.md#password-based-authentication)-based authentication requires
  that clients provide a username and password
* [Certificate](../../../using/security/managing-sources.md#certificate-based-authentication)-based authentication
  requires that clients
* [Pluggable authentication module (PAM)](../../../using/security/managing-sources.md#pam-based-authentication)-based authentication requires
  clients to authenticate using the PAM service specified using the
  [`riak-admin security`](../../../using/security/managing-sources.md#managing-sources)
  command line interface

Riak's approach to security is highly flexible. If you choose to use
Riak's security feature, you do not need to require that all clients
authenticate via the same means. Instead, you can specify authentication
sources on a client-by-client, i.e. user-by-user, basis. This means that
you can require clients performing, say, [MapReduce](../../../developing/usage/mapreduce.md)
operations to use certificate auth, while clients performing [K/V Operations](../../../developing/usage/index.md) have to use username and password. The approach
that you adopt will depend on your security needs.

This document provides a general overview of how that works. For
managing security in Riak itself, see the following documents:

* [Authentication and Authorization](../../../using/security/basics.md)
* [Managing Security Sources](../../../using/security/managing-sources.md)

We also provide client-library-specific guides for the following
officially supported clients:

* [Java](../../../developing/usage/security/java.md)
* [Ruby](../../../developing/usage/security/ruby.md)
* [PHP](../../../developing/usage/security/php.md)
* [Python](../../../developing/usage/security/python.md)
* [Erlang](../../../developing/usage/security/erlang.md)

## Certificates, Keys, and Authorities

If Riak security is enabled, all client operations, regardless of the
security source you choose for those clients, must be over a secure SSL
connection. If you are using a self-generated Certificate Authority
(CA), Riak and connecting clients will need to share that CA.

To use certificate-based auth, you will need to create a Public Key
Infrastructure (PKI) based on
[x.509](http://en.wikipedia.org/wiki/X.509) certificates. The central
foundation of your PKI should be a Certificate Authority (CA), created
inside of a secure environment, that can be used to sign certificates.
In addition to a CA, your client will need to have access to a private
key shared only by the client and Riak as well as a CA-generated
certificate.

To prevent so-called [Man-in-the-Middle
attacks](http://en.wikipedia.org/wiki/Man-in-the-middle_attack), private
keys should never be shared beyond Riak and connecting clients.

> **HTTP not supported**
>
> Certificate-based authentication is available only through Riak's
[Protocol Buffers](../../../developing/api/protocol-buffers/index.md) interface. It is not available through the
[HTTP API](../../../developing/api/http/index.md).

### Default Names

In Riak's [configuration files](../../../configuring/reference.md#security), the
default certificate file names are as follows:

| Cert                       | Filename         |
|:---------------------------|:-----------------|
| Certificate authority (CA) | `cacertfile.pem` |
| Private key                | `key.pem`        |
| CA-generated cert          | `cert.pem`       |

These filenames will be used in the client-library-specific tutorials.
