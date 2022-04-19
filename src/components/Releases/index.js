import React, { useState, useEffect } from 'react';
import Release from './Release';

export default function Releases() {
  const [releases, setReleases] = useState();
  const fetchReleases = async () => {
    const response = await fetch("https://api.github.com/repos/basho/riak/releases");
    const data = response.status !== 200 ? null : await response.json();

    setReleases(data);
  };

  useEffect(() => fetchReleases(), []);

  if (releases === undefined) {
    return <h2>Loading...</h2>;
  }

  if (releases === null) {
    return <h2>Failed to load from GitHub API</h2>;
  }

  const releases_list = releases
    .filter(({draft, prerelease}) => !draft && !prerelease)
    .map(({id, name, tarball_url, zipball_url, html_url, tag_name}, i) => {
      const latest = i === 0;

      return <Release key={id} latest={latest} name={name} tarball_url={tarball_url} zipball_url={zipball_url} html_url={html_url} tag_name={tag_name} />;
    });

  return <div>{releases_list}</div>;
}
