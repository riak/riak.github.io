import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Flexible',
    description: (
      <>
        Riak KV: flexible data model for many unstructured use cases including user,
        session and profile data
      </>
    ),
  },
  {
    title: 'Scalable',
    description: (
      <>
        Riak KV is a distributed NoSQL database designed to deliver maximum data
        availability by distributing data across multiple servers.
      </>
    ),
  },
  {
    title: 'Replication',
    description: (
      <>
        Riak KV includes multi-cluster replication ensuring low-latency and robust business continuity
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
