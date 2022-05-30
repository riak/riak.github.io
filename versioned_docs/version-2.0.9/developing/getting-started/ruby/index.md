---
title: "Ruby"
id: getting_started_ruby
sidebar_position: 1
---

If you haven't set up a Riak Node and started it, please visit [Running A Cluster](../../../using/running-a-cluster.md) first. To try this flavor
of Riak, a working installation of Ruby is required.

## Client Setup

First, install the Riak Ruby client via RubyGems.

```bash
gem install riak-client
```

Start IRB, the Ruby REPL, and let’s get set up. Enter the following into
IRB:

```ruby
require 'riak'
```

If you are using a single local Riak node, use the following to create a
new client instance, assuming that the node is running on `localhost`
port 8087:

```ruby
client = Riak::Client.new(:protocol => "pbc", :pb_port => 8087)

# Since the Ruby Riak client uses the Protocol Buffers API by default,
# you can also just enter this:
client = Riak::Client.new(:pb_port => 8087)
```

If you set up a local Riak cluster using the [[five-minute install]]
method, use this code snippet instead:

```ruby
client = Riak::Client.new(:protocol => "pbc", :pb_port => 10017)

# For the reasons explain in the snippet above, this will also work:
client = Riak::Client.new(:pb_port => 10017)
```

We are now ready to start interacting with Riak.

## Next Steps

[CRUD Operations](./crud-operations.md)
