---
title: "Riak Search Settings"
id: configuring_search
slug: search
sidebar_position: 5
---

[usage search]: ../developing/usage/search.md

[usage search schema]: ../developing/usage/search-schemas.md

[usage search data types]: ../developing/usage/searching-data-types.md

[usage custom extractors]: ../developing/usage/custom-extractors.md

[config reference]: ../configuring/reference.md

[config reference#search]: ../configuring/reference.md#search

[glossary aae]: ../learn/glossary.md#active-anti-entropy-aae

[security index]: ../using/security/index.md

:::note Note on Search 2.0 vs. Legacy Search

This document refers to the new Riak Search 2.0 with
[Solr](http://lucene.apache.org/solr/) integration (codenamed
Yokozuna). For information about the deprecated Riak Search, visit [the old Riak Search Settings](http://docs.basho.com/riak/1.4.8/ops/advanced/configs/search/).

:::

This document covers Riak's Search subsystem from an
operational perspective. If you are looking for more developer-focused
docs, we recommend the following:

* [Using Search][usage search]
* [Search Schema][usage search schema]
* [Custom Search Extractors][usage custom extractors]
* [Riak KV Data Types and Search][usage search data types]

## Enabling Riak Search

Although Riak Search is integrated into Riak and requires no special
installation, it is not enabled by default.  You must enable it in every
node's [configuration files][config reference] as follows:

```riakconf
search = on
```

## JVM Installation

Because Solr is a Java application, you will need to install **Java 1.6
or later** on every node. We recommend installing Oracle's [JDK
7u25](http://www.oracle.com/technetwork/java/javase/7u25-relnotes-1955741.html).
Installation packages can be found on the [Java SE 7 Downloads
page](http://www.oracle.com/technetwork/java/javase/downloads/java-archive-downloads-javase7-521261.html#jre-7u25-oth-JPR)
and instructions on the [documentation
page](http://www.oracle.com/technetwork/java/javase/documentation/index.html).

### Riak Config Settings

Setting `search` to `on` is required, but other search settings are
optional. A list of these parameters can also be found in our
[configuration files][config reference#search] documentation.

| Field                          | Default                                                         | Valid values                     | Description                                                                                                                |
|:-------------------------------|:----------------------------------------------------------------|:---------------------------------|:---------------------------------------------------------------------------------------------------------------------------|
| `search`                       | `off`                                                           | `on` or `off`                    | Enable or disable Search                                                                                                   |
| `search.anti_entropy.data_dir` | `./data/yz_anti_entropy`                                        | Directory                        | The directory in which Riak Search stores files related to [active anti-entropy][glossary aae]                             |
| `search.root_dir`              | `./data/yz`                                                     | Directory                        | The root directory in which index data and configuration is stored                                                         |
| `search.solr.start_timeout`    | `30s`                                                           | Integer with time units (eg. 2m) | How long Riak will wait for Solr to start (attempts twice before shutdown). Values lower than 1s will be rounded up to 1s. |
| `search.solr.port`             | `8093`                                                          | Integer                          | The port number to which Solr binds (note: binds on every interface)                                                       |
| `search.solr.jmx_port`         | `8985`                                                          | Integer                          | The port number to which Solr JMX (note: binds on every interface)                                                         |
| `search.solr.jvm_options`      | `-d64 -Xms1g -Xmx1g -XX:+UseStringCache -XX:+UseCompressedOops` | Java command-line arguments      | The options to pass to the Solr JVM. Non-standard options, e.g. `-XX`, may not be portable across JVM implementations.     |

While most of the default values are sufficient, you may have to
increase `search.solr.start_timeout` as more data is indexed, which may
cause Solr to require more time to start.

## Solr JVM and Ports

Riak Search runs one Solr process per node to manage its indexing and
search functionality. While the underlying project, Yokozuna, manages
index distribution, node coverage for queries, active anti-entropy
(AAE), and JVM process management, you should provide plenty of RAM and diskspace for running both Riak and the JVM running Solr. We recommend a minimum of 6GB of RAM per node.

Concerning ports, be sure to take the necessary [security][security index] precautions to prevent exposing the extra Solr and JMX ports
to the outside world.

## Solr for Operators

For further information on Solr monitoring, tuning, and performance, we
recommend the following documents for getting started:

* [Solr Monitoring](https://wiki.apache.org/solr/SolrMonitoring)
* [Solr Performance
  Factors](https://wiki.apache.org/solr/SolrPerformanceFactors)
* [Solr Performance
  Problems](https://wiki.apache.org/solr/SolrPerformanceProblems)
* [JConsole](http://docs.oracle.com/javase/7/docs/technotes/guides/management/jconsole.html)

A wide variety of other documentation is available from the Solr OSS
community.
