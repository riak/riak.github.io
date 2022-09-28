import React from 'react';
import styles from './styles.module.css';

function ReleaseNotes({ version_match }) {
  if (version_match === null) {
    return <>No release notes found</>;
  }

  const [, major, minor, , patch, patch_version] = version_match;
  const patch_fmt = patch_version === undefined ? "" : `---patch-${patch_version}`;
  const full_version = `${major}${minor}${patch}`
  const url = `https://github.com/basho/riak/blob/develop-3.0/RELEASE-NOTES.md#riak-kv-${full_version}-release-notes${patch_fmt}`

  return <Link name="Release Notes" url={url} />;
}

function Latest() {
  return (
    <div>
      <Hug />
      <p className={styles.latest}>Latest</p>
      <Hug />
    </div>
  );
}

function Hug() {
  const alt = "A new version of Riak has been released! Yay!"

  return <img src={require('@site/static/images/hugs.png').default} alt={alt} title={alt} />;
}

function Link({ name, url }) {
  return <a href={url}>{name}</a>;
}

export default function Release({ latest, first, name, html_url, tag_name }) {
  const version_match = tag_name.match(/riak-([0-9]+).([0-9]+)(.)?([0-9]+)?p?([0-9]+)?/);
  const latest_label = latest ? <Latest /> : <></>;
  const github = <Link name="GitHub" url={html_url} />;
  const release_notes = <ReleaseNotes version_match={version_match} />;

  return (
    <>
      <h1 className="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-next-theme-Heading-styles-module" id={tag_name}>
        {name}
        <a className="hash-link" href={`#${tag_name}`} title="Direct link to heading"></a>
      </h1>
      {latest_label}
      <p>{github} &#124; {release_notes}</p>
    </>
  );
}
