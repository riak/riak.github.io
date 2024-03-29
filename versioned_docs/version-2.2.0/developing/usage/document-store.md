---
title: "Implementing a Document Store"
id: usage_document_store
slug: document-store
sidebar_position: 12
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Although Riak wasn't explicitly created as a document store, two
features recently added to Riak---[Riak Search](../../developing/usage/search.md) and [Riak Data Types](../../developing/data-types/index.md)---make it possible to use Riak as a
highly scalable document store with rich querying capabilities. In this
tutorial, we'll build a basic implementation of a document store using
[Riak maps](../../developing/data-types/maps.md).

## Basic Approach

Riak Search enables you to implement a document store in Riak in a
variety of ways. You could, for example, store and query JSON objects or
XML and then retrieve them later via Solr queries. In this tutorial,
however, we will store data in [Riak maps](../../developing/data-types/maps.md),
index that data using Riak Search, and then run Solr queries against
those stored objects.

You can think of these Search indexes as **collections**. Each indexed
document will have an ID generated automatically by Search, and because
we're not interested in running normal [key/value queries](../../developing/key-value-modeling.md) on these objects, we'll allow Riak to assign [keys](../../learn/concepts/keys-and-objects.md) automatically. This means that all we have to do is worry about the bucket type and/or bucket when storing objects.

## Use Case

Let's say that we're building a WordPress-style CMS and storing blog
posts in Riak. We will be storing the following information about each
post:

* Title
* Author
* Content (the body of the post)
* Keywords associated with the post
* Date posted
* Whether the post has been published on the site

For each of those pieces of information, we'll need to decide on (a)
which Riak Data Type most directly corresponds and (b) which Solr type
we want to associate with the info. It's important to bear in mind that
Riak Data Types can be indexed as a wide variety of things, e.g.
registers as Solr text fields, sets as multi-valued datetimes, etc. The
table below shows which Riak Data Type and Solr type we'll be using for
each field in our Riak maps.

| Info                                        | Riak Data Type | Solr type           |
|:--------------------------------------------|:---------------|:--------------------|
| Post title                                  | Register       | String              |
| Post author                                 | Register       | String              |
| Post content                                | Register       | Text                |
| Keywords                                    | Set            | Multi-valued string |
| Date posted                                 | Register       | Datetime            |
| Whether the post is currently in draft form | Flag           | Boolean             |

Before we start actually creating and storing blog posts, let's set up
Riak Search with an appropriate index and schema.

## Creating a Schema and Index

In the documentation on [search schemas](../../developing/usage/search-schemas.md), you'll find a
baseline schema to be used for creating custom schemas. We'll use that
baseline schema here and add the following fields to the `<fields>`
list:

```xml
<field name="title_register"   type="string"   indexed="true" stored="true" />
<field name="author_register"  type="string"   indexed="true" stored="true" />
<field name="content_register" type="text"     indexed="true" stored="true" />
<field name="keywords_set"     type="string"   indexed="true" stored="true" multiValued="true" />
<field name="date_register"    type="datetime" indexed="true" stored="true" />
<field name="published_flag"   type="boolean"  indexed="true" stored="true" />
```

You can see the full schema [on
GitHub](https://github.com/basho/basho_docs/raw/master/extras/data/blog_post_schema.xml).
Let's store that schema in a file called `blog_post_schema.xml` and
upload that schema to Riak:

<Tabs>
<TabItem label="Java" value="java" default>

```java
import org.apache.commons.io.FileUtils;

File xml = new File("blog_post_schema.xml");
String xmlString = FileUtils.readFileToString(xml);
YokozunaSchema schema = new YokozunaSchema("blog_post_schema", xmlString);
StoreSchema storeSchemaOp = new StoreSchema.Builder(schema).build();
client.execute(storeSchemaOp);
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
schema_data = File.read('blog_post_schema.xml')
client.create_search_schema('blog_post_schema', schema_data)
```

</TabItem>
<TabItem label="PHP" value="php">

```php
$schema_string = file_get_contents('blog_post_schema.xml');
(new \Basho\Riak\Command\Builder\StoreSchema($riak))
  ->withName('blog_post_schema')
  ->withSchemaString($schema_string)
  ->build()
  ->execute();
```

</TabItem>
<TabItem label="Python" value="python">

```python
xml_file = open('blog_post_schema.xml', 'r')
schema_data = xml_file.read()
client.create_search_schema('blog_post_schema', schema_data)
xml_file.close()
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var schemaXml = File.ReadAllText("blog_post_schema.xml");
var schema = new SearchSchema("blog_post_schema", schemaXml);
var rslt = client.PutSearchSchema(schema);
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
/*
 * Full example here:
 *  https://github.com/basho/riak-nodejs-client-examples/blob/master/dev/search/document-store.js
 *
 */
var options = {
    schemaName: 'blog_post_schema',
    schema: schemaXml
};
client.storeSchema(options, function (err, rslt) {
    if (err) {
        throw new Error(err);
    }
});
```

</TabItem>
<TabItem label="Erlang" value="erlang">

```erlang
{ok, SchemaData} = file:read_file("blog_post_schema.xml"),
riakc_pb_socket:create_search_schema(Pid, <<"blog_post_schema">>, SchemaData).
```

</TabItem>
<TabItem label="CURL" value="curl">

```bash
curl -XPUT $RIAK_HOST/search/schema/blog_post_schema \
     -H 'Content-Type: application/xml' \
     --data-binary @blog_post_schema.xml
```

</TabItem>
</Tabs>

With our schema uploaded, we can create an index called `blog_posts` and associate that index with our schema:

<Tabs>
<TabItem label="Java" value="java" default>

```java
YokozunaIndex blogPostIndex = new YokozunaIndex("blog_posts", "blog_post_schema");
StoreIndex storeIndex = new StoreIndex.Builder(blogPostIndex).build();
client.execute(storeIndex);
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
client.create_search_index('blog_posts', 'blog_post_schema')
```

</TabItem>
<TabItem label="PHP" value="php">

```php
(new Command\Builder\Search\StoreIndex($riak))
  ->withName('blog_posts')
  ->usingSchema('blog_post_schema')
  ->build()
  ->execute();
```

</TabItem>
<TabItem label="Python" value="python">

```python
client.create_search_index('blog_posts', 'blog_post_schema')
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var idx = new SearchIndex("blog_posts", "blog_post_schema");
var rslt = client.PutSearchIndex(idx);
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
var options = {
    schemaName: 'blog_post_schema',
    indexName: 'blog_posts'
};
client.storeIndex(options, function (err, rslt) {
    if (err) {
        throw new Error(err);
    }
});
```

</TabItem>
<TabItem label="Erlang" value="erlang">

```erlang
riakc_pb_socket:create_search_index(Pid, <<"blog_posts">>, <<"blog_post_schema">>, []).
```

</TabItem>
<TabItem label="CURL" value="curl">

```bash
curl -XPUT $RIAK_HOST/search/index/blog_posts \
     -H 'Content-Type: application/json' \
     -d '{"schema": "blog_post_schema"}'
```

</TabItem>
</Tabs>

## How Collections will Work

Collections are not a concept that is native to Riak but we can easily
mimic collections by thinking of a bucket type as a collection. When we
associate a bucket type with a Riak Search index, all of the objects
stored in any bucket of that bucket type will be queryable on the basis
of that one index. For this tutorial, we'll create a bucket type called
`cms` and think of that as a collection. We could also restrict our
`blog_posts` index to a single bucket just as easily and think of that
as a queryable collection, but we will not do that in this tutorial.

The advantage of the bucket-type-based approach is that we could store
blog posts from different blogs in different blog posts and query them
all at once as part of the same index. It depends on the use case at
hand. In this tutorial, we'll only be storing posts from one blog, which
is called "Cat Pics Quarterly" and provides in-depth theoretical
discussions of cat pics with a certain number of Reddit upvotes. All of
the posts in this blog will be stored in the bucket
`cat_pics_quarterly`.

First, let's create our `cms` bucket type and associate it with the
`blog_posts` index:

```bash
riak-admin bucket-type create cms \
  '{"props":{"datatype":"map","search_index":"blog_posts"}}'
riak-admin bucket-type activate cms
```

Now, any object stored in any bucket of the type `cms` will be indexed
as part of our "collection."

## Storing Blog Posts as Maps

Now that we know how each element of a blog post can be translated into
one of the Riak Data Types, we can create an interface in our
application to serve as that translation layer. Using the method
described in [Data Modeling with Riak Data Types](../../learn/use-cases.md), we can construct a
class that looks like this:

<Tabs>
<TabItem label="Java" value="java" default>

```java
import java.util.Set;

public class BlogPost {
    private String title;
    private String author;
    private String content;
    private Set<String> keywords;
    private DateTime datePosted;
    private Boolean published;
    private static final String bucketType = "cms";

    private Location location;

    private RiakClient client;

    public BlogPost(RiakClient client
                    String bucketName,
                    String title,
                    String author,
                    String content,
                    Set<String> keywords,
                    DateTime datePosted,
                    Boolean published) {
      this.client = client;
      this.location = new Location(new Namespace(bucketType, bucketName), null);
      this.title = title;
      this.author = author;
      this.content = content;
      this.keywords = keywords;
      this.datePosted = datePosted;
      this.published = published;
    }

    public void store() throws Exception {
        RegisterUpdate titleUpdate = new RegisterUpdate(title);
        RegisterUpdate authorUpdate = new RegisterUpdate(author);
        RegisterUpdate contentUpdate = new RegisterUpdate(content);
        SetUpdate keywordsUpdate = new SetUpdate();
        for (String keyword : keywords) {
            keywordsUpdate.add(keyword);
        }
        RegisterUpdate dateUpdate =
            new RegisterUpdate(datePosted.toString("YYYY-MM-DD HH:MM"));
        if (published) {
            FlagUpdate published = new FlagUpdate(published);
        }
        FlagUpdate publishedUpdate = new FlagUpdate(published);
        MapUpdate mapUpdate = new MapUpdate()
            .update("title", titleUpdate)
            .update("author", authorUpdate)
            .update("content", contentUpdate)
            .update("keywords", keywordsUpdate)
            .update("date", dateUpdate)
            .update("published", publishedUpdate);
        UpdateMap storeBlogPost = new UpdateMap.Builder(location, mapUpdate)
            .build();
        client.execute(storeBlogPost);
    }
}
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
class BlogPost
  def initialize(bucket_name, title, author, content, keywords, date_posted, published)
    bucket = client.bucket_type('cms').bucket(bucket_name)
    map = Riak::Crdt::Map.new(bucket, nil)
    map.batch do |m|
      m.registers['title'] = title
      m.registers['author'] = author
      m.registers['content'] = content
      keywords.each do |k|
        m.sets['keywords'].add(k)
      end
      m.registers['date'] = date_posted
      if published
        m.flags['published'] = true
      end
  end
end
```

</TabItem>
<TabItem label="PHP" value="php">

```php
class BlogPost {
  private $title = '';
  private $author = '';
  private $content = '';
  private $keywords = [];
  private $datePosted = '';
  private $published = false;
  private $bucketType = "cms";

  private $bucket = null;

  private $riak = null;

  public function __construct(\Basho\Riak $riak, $bucket, $title, $author, $content, array $keywords, $date, $published)
  {
    this->riak = $riak;
    this->bucket = new Bucket($bucket, $this->bucketType);
    this->title = $title;
    this->author = $author;
    this->content = $content;
    this->keywords = $keywords;
    this->datePosted = $date;
    this->published = $published;
  }

  public function store()
  {
    $setBuilder = (new \Basho\Riak\Command\Builder\UpdateSet($this->riak));
      
    foreach($this->keywords as $keyword) {
      $setBuilder->add($keyword);
    }

    (new \Basho\Riak\Command\Builder\UpdateMap($this->riak))
      ->updateRegister('title', $this->title)
      ->updateRegister('author', $this->author)
      ->updateRegister('content', $this->content)
      ->updateRegister('date', $this->date)
      ->updateFlag('published', $this->published)
      ->updateSet('keywords', $setBuilder)
      ->withBucket($this->bucket)
      ->build()
      ->execute();
  }
}
```

</TabItem>
<TabItem label="Python" value="python">

```python
from riak.datatypes import Map

class BlogPost:
    def __init__(bucket_name, title, author, content, keywords, date_posted, published):
        bucket = client.bucket_type('cms').bucket(bucket_name)
        map = Map(bucket, None)
        self.map.registers['title'].assign(title)
        self.map.registers['author'].assign(author)
        self.map.registers['content'].assign(content)
        for k in keywords:
            self.map.sets['keywords'].add(k)
        self.map.registers['date'] = date_posted
        if published:
            self.map.flags['published'].enable()
        self.map.store()
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
/*
 * Please see the code in the RiakClientExamples project:
 * https://github.com/basho/riak-dotnet-client/tree/develop/src/RiakClientExamples/Dev/Search
 */
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
/*
 * Please see the code in the examples repository:
 * https://github.com/basho/riak-nodejs-client-examples/blob/master/dev/search/
 */
```

</TabItem>
</Tabs>

Now, we can store some blog posts. We'll start with just one:

<Tabs>
<TabItem label="Java" value="java" default>

```java
Set<String> keywords = new HashSet<String>();
keywords.add("adorbs");
keywords.add("cheshire");

BlogPost post1 = new BlogPost(client, // client object
                              "cat_pics_quarterly", // bucket
                              "This one is so lulz!", // title
                              "Cat Stevens", // author
                              "Please check out these cat pics!", // content
                              keywords, // keywords
                              new DateTime(), // date posted
                              true); // published
try {
    post1.store();
} catch (Exception e) {
    System.out.println(e);
}
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
keywords = ['adorbs', 'cheshire']
date = Time.now.strftime('%Y-%m-%d %H:%M')
blog_post1 = BlogPost.new('cat_pics_quarterly',
                          'This one is so lulz!',
                          'Cat Stevens',
                          'Please check out these cat pics!',
                          keywords,
                          date,
                          true)
```

</TabItem>
<TabItem label="PHP" value="php">

```php
$keywords = ['adorbs', 'cheshire'];
$date = new \DateTime('now');

$post1 = new BlogPost(
  $riak, // client object
  'cat_pics_quarterly', // bucket
  'This one is so lulz!', // title
  'Cat Stevens', // author
  'Please check out these cat pics!', // content
  $keywords, // keywords
  $date, // date posted
  true // published
);
```

</TabItem>
<TabItem label="Python" value="python">

```python
import datetime

keywords = ['adorbs', 'cheshire']
date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
blog_post1 = BlogPost('cat_pics_quarterly',
                      'This one is so lulz!',
                      'Cat Stevens',
                      'Please check out these cat pics!',
                      keywords,
                      date,
                      true)
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var keywords = new HashSet<string> { "adorbs", "cheshire" };

var post = new BlogPost(
    "This one is so lulz!",
    "Cat Stevens",
    "Please check out these cat pics!",
    keywords,
    DateTime.Now,
    true);

var repo = new BlogPostRepository(client, "cat_pics_quarterly");
string id = repo.Save(post);
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
var post = new BlogPost(
    'This one is so lulz!',
    'Cat Stevens',
    'Please check out these cat pics!',
    [ 'adorbs', 'cheshire' ],
    new Date(),
    true
);

var repo = new BlogPostRepository(client, 'cat_pics_quarterly');

repo.save(post, function (err, rslt) {
    logger.info("key: '%s', model: '%s'", rslt.key, JSON.stringify(rslt.model));
});
```

</TabItem>
</Tabs>

## Querying

Now that we have some blog posts stored in our "collection," we can
start querying for whatever we'd like. Let's say that we want to find
all blog posts with the keyword `funny` (after all, some cat pics are
quite serious, and we may not want those).

<Tabs>
<TabItem label="Java" value="java" default>

```java
String index = "blog_posts";
String query = "keywords_set:funny";

SearchOperation searchOp = new SearchOperation
    .Builder(BinaryValue.create(index), query)
    .build();
cluster.execute(searchOp);
List<Map<String, List<String>>> results = searchOp.get().getAllResults();
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
results = client.search('blog_posts', 'keywords_set:funny')
```

</TabItem>
<TabItem label="PHP" value="php">

```php
$response = (new \Basho\Riak\Command\Builder\Search\FetchObjects($riak))
  ->withIndexName('blog_posts')
  ->withQuery('keywords_set:funny')
  ->build()
  ->execute();
```

</TabItem>
<TabItem label="Python" value="python">

```python
results = client.fulltext_search('blog_posts', 'keywords_set:funny')
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var searchRequest = new RiakSearchRequest("blog_posts", "keywords_set:funny");
var rslt = client.Search(searchRequest);
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
var searchCmd = new Riak.Commands.YZ.Search.Builder()
    .withIndexName('blog_posts')
    .withQuery('keywords_set:funny')
    .withCallback(search_cb)
    .build();

client.execute(searchCmd);
```

</TabItem>
<TabItem label="CURL" value="curl">

```bash
curl "$RIAK_HOST/search/query/blog_posts?wt=json&q=keywords_set:funny"
```

</TabItem>
</Tabs>

Or we can find posts that contain the word `furry`:

<Tabs>
<TabItem label="Java" value="java" default>

```java
String index = "blog_posts";
String query = "content_register:furry";

SearchOperation searchOp = new SearchOperation
    .Builder(BinaryValue.create(index), query)
    .build();
cluster.execute(searchOp);
List<Map<String, List<String>>> results = searchOp.get().getAllResults();
```

</TabItem>
<TabItem label="Ruby" value="ruby">

```ruby
results = client.search('blog_posts', 'content_register:furry')
```

</TabItem>
<TabItem label="PHP" value="php">

```php
$response = (new \Basho\Riak\Command\Builder\Search\FetchObjects($riak))
  ->withIndexName('blog_posts')
  ->withQuery('content_register:furry')
  ->build()
  ->execute();
```

</TabItem>
<TabItem label="Python" value="python">

```python
results = client.fulltext_search('blog_posts', 'content_register:furry')
```

</TabItem>
<TabItem label="C#" value="c#">

```csharp
var searchRequest = new RiakSearchRequest("blog_posts", "content_register:furry");
var rslt = client.Search(searchRequest);
```

</TabItem>
<TabItem label="JS" value="js">

```javascript
var searchCmd = new Riak.Commands.YZ.Search.Builder()
    .withIndexName('blog_posts')
    .withQuery('content_register:furry')
    .withCallback(search_cb)
    .build();

client.execute(searchCmd);
```

</TabItem>
<TabItem label="CURL" value="curl">

```bash
curl "$RIAK_HOST/search/query/blog_posts?wt=json&q=content_register:furry"
```

</TabItem>
</Tabs>

Here are some more possible queries:

| Info                                                   | Query                                  |
|:-------------------------------------------------------|:---------------------------------------|
| Unpublished posts                                      | `published_flag:false`                 |
| Titles that begin with `Loving*`                       | `title_register:Loving*`               |
| Post bodies containing the words `furry` and `jumping` | `content_register:[furry AND jumping]` |
