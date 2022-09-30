# Riak Docs

This is a migrated version of the Riak KV 2.2.3+ docs from [basho/basho_docs](https://www.github.com/basho/basho_docs).
Much of the documentation was manually transformed with the [basho_docs_transform tool](./tools/basho_docs_transform/README.md) and plenty of manual adjustment. 
In the future previous versions of Riak KV and other Riak software (e.g, Riak TS) could also be placed here.

## Editing

If you only wish to make change the contents of the markdown files, you (should) be able to edit the files on GitHub 
with GitHub Actions automating the building and deployment of the website.

## Installation

```
$ npm install 
```

### Local Development

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

#### Current version

```
$ npm run start:fast
```

This builds the current docs only. This command results in a much quicker uptime.

#### All Versions

```
$ npm run start
```

Due to the many versions of the docs this command is slow to execute. Only use it if you want to see changes made to versioned docs.

### Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

GitHub Actions should automatically deploy the site to [riak.github.io](https://www.riak.github.io)

## Mermaid

To aid in the creation of diagrams [mdx-mermaid](https://github.com/sjwall/mdx-mermaid) is accessible both in documentation *and* blog posts.
This uses [mermaid](https://mermaid-js.github.io/mermaid/#/) to easily create diagrams. 
