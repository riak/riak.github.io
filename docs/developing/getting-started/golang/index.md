---
title: "Go"
id: getting_started_go
sidebar_position: 6
---

If you haven't set up a Riak Node and started it, please visit [Running A Cluster](../../../using/running-a-cluster.md) first and ensure you have
[a working installation of Go](http://golang.org/doc/install).

## Client Setup

First install the [Riak Go client](https://github.com/basho/riak-go-client):

```bash
go get github.com/basho/riak-go-client
```

Next download the [Taste of Riak - Go](https://github.com/basho/taste-of-riak/tree/master/go) utilities:

```bash
go get github.com/basho/taste-of-riak/go/util
```

If you are using a single local Riak node, use the following to create a
new client instance:

```golang
package main

import (
  "encoding/binary"
  "encoding/json"
  "sync"

  riak "github.com/basho/riak-go-client"
  util "github.com/basho/taste-of-riak/go/util"
)

func main() {
  var err error

  // un-comment-out to enable debug logging
  // riak.EnableDebugLogging = true

  o := &riak.NewClientOptions{
    RemoteAddresses: []string{util.GetRiakAddress()},
  }

  var c *riak.Client
  c, err = riak.NewClient(o)
  if err != nil {
    util.ErrExit(err)
  }

  defer func() {
    if err := c.Stop(); err != nil {
      util.ErrExit(err)
    }
  }()
}
```

We are now ready to start interacting with Riak.

## Next Steps

[CRUD Operations](../../../developing/getting-started/golang/crud-operations.md)
