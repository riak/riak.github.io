# YOU PROBABLY DON'T WANT TO RUN THIS!

# Why?

This is used to transform markdown documents from [basho/basho_docs](https://github.com/basho/basho_docs). This script is specifically designed for the KV doc. As such, they have only been tested with the KV markdown files. Other markdown files may incidentally work. 

The transformed markdown documents are then used in the overhauled Riak KV documentation that uses [Docusaurus](https://docusaurus.io/).

# How to use

You need some markdown files in a directory (the kv directory works fine). The output directory is then used in the Docusaurus website.

```input_docs_dir``` and ```output_docs_dir``` must be an absolute paths

```
node index.js \--input_docs_dir=/home/USERNAME/Documents/kv \--output_docs_dir=/tmp/kv
```

# Transformation

From the front matter, the title and identifier are stripped. If an identifier cannot be found, the title is lowercased and all spaces replaced with underscores.

# Ignored files

Drafts, 'redirect' files and files without a frontmatter are not included in the resulting ```output_docs_dir```. If the ```name_ignored_files``` flag is passed in, the filepath of ignored files are printed and the reason why they are ignored.

```
node index.js \--input_docs_dir=/home/USERNAME/Documents/kv \--output_docs_dir=/tmp/kv \--name_ignored_files
```

# Keeping Drafts

If the ```keep_drafts``` is passed with a value of ```true``` any drafts will not be deleted. But they will **not** be transformed. By default, drafts are deleted. Drafts may or may not work with Docusaurus.

```
node index.js \--input_docs_dir=/home/USERNAME/Documents/kv \--output_docs_dir=/tmp/kv \--name_ignored_files \--keep_drafts=true
```

# get_files_metadata.js

Reads the current docs and writes JSON to files_metadata.json containing the title, id, slug and sidebar_position for each page. 
This exists because the current version (Riak KV 2.2.3) version of the docs were manually created. 
We want to re-use this data when automatically transforming.
