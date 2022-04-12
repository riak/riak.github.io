# Website

This is a migrated version of the Riak KV 2.2.3+ docs from [basho/basho_docs](https://www.github.com/basho/basho_docs).
Much of the documentation was manually transformed with the basho_docs_transform tool and plenty of manual adjustment. 
In the future previous versions of Riak KV and other Riak software (e.g, Riak TS) could also be placed here.

## Editing

If you only wish to make change the contents of the markdown files, you (should) be able to edit the files on GitHub 
with GitHub Actions automating the building and deployment of the website.

## Installation

```
$ npm install 
```

### Local Development

```
$ npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Mermaid

To aid in the creation of diagrams [mdx-mermaid](https://github.com/sjwall/mdx-mermaid) is accessible both in documentation *and* blog posts.
This uses [mermaid](https://mermaid-js.github.io/mermaid/#/) to easily create diagrams. 

### Deployment

GitHub Actions should automatically deploy the site to [riak.github.io](https://www.riak.github.io)