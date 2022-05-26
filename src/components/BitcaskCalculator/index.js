import React, { useState, useReducer } from 'react';

function formatNumber(str) {
  str += "";

  const x = str.split(".");
  const x2 = x.length > 1 ? "." + x[1] : "";
  const rgx = /(\d+)(\d{3})/;

  let x1 = x[0];

  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1,$2");
  }

  return `${x1}${x2}`;
}

function formatBytes(bytes) {
  const sizes = [
    "bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB"
  ];

  if (bytes === 0) return "";

  if (bytes === 1) return "1 byte";

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  // .round
  return ((i === 0 ? bytes / Math.pow(1024, i) : (bytes / Math.pow(1024, i)).toFixed(1)) + " " + sizes[i]);
}

function abbreviateNumber(num) {
  const sizes = [
    "",
    "thousand",
    "million",
    "billion",
    "trillion",
    "quadrillion",
    "quintillion",
    "sextillion",
    "septillion"
  ];

  if (num < 1000) return num;

  const i = parseInt(Math.floor(Math.log(num) / Math.log(1000)), 10);

  // use .round() if you don't want the decimal
  return (
    (i === 0 ? num / Math.pow(1000, i) : (num / Math.pow(1000, i)).toFixed(1)) +
    " " +
    sizes[i]
  );
}

function sizeOfNullBKP(bytesInAPtr) {
  return 44.5 + 13 + 8;
}

function estimateNodes({bytesInAPtr, nTotalKeys, nBucketSize, nNVal, nRam, nKeySize}) {
  const m = (nKeySize + nBucketSize + sizeOfNullBKP(bytesInAPtr)) * nTotalKeys * nNVal;
  const ram = calculateRam(nRam);

  return ((m / ram) < nNVal + 1) ? nNVal + 2 : Math.ceil(m / ram);
}

function estimateKeyDir({bytesInAPtr, nKeySize, nBucketSize, nTotalKeys, nNVal}) {
  return (nKeySize + nBucketSize + sizeOfNullBKP(bytesInAPtr)) * nTotalKeys  * nNVal;
}

function estimateStorage({nTotalKeys, nBucketSize, nNVal, nRecordSize, nKeySize}) {
  // using REST/HTTP API (which creates HTTP headers in kb/p's creating unexpected overhead)
  // still doesn't account for link headers, tombstones, etc.
  return (14 + (13 + nBucketSize + nKeySize) + (91 + nBucketSize + nKeySize + nRecordSize) + (18 + (13 + nBucketSize + nKeySize))) * nTotalKeys * nNVal;
}

function calculateRam(nRam) {
  return nRam * 1073741824;
}

function reducer(state, action) {
  const value = parseInt(action.payload, 10);

  switch (action.type) {
    case "nBucketSize":
      return { ...state, nBucketSize: value };
      
    case "nTotalKeys":
      return { ...state, nTotalKeys: value };

    case "nKeySize":
      return { ...state, nKeySize: value };

    case "nRecordSize":
      return { ...state, nRecordSize: value };

    case "nRam":
      return { ...state, nRam: value };

    case "nNVal":
      return { ...state, nNVal: value };

    default:
      return state;
  }
}

function Input({ info, label, action, value, handleChange, setInfo }) {
  return (
    <div onClick={_ => setInfo(info)} >
      <label>{label}: </label>
      <input type="number" value={value} onChange={e => handleChange(action, e.target.value)}></input>
    </div>
  );
}

function Recommendations({ state }) {
  const { nTotalKeys, nBucketSize,  nKeySize, nRam, nNVal, nRecordSize, bytesInAPtr } = state;
  const n = estimateNodes(state); 
  const d = estimateStorage(state); 
  const r = estimateKeyDir(state);

  return (
    <>
      <br />
      <h2 className="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-next-theme-Heading-styles-module" id="recommendations">
        Recommendations
        <a class="hash-link" href="#recommendations" title="Direct link to heading">​</a>
      </h2>
      <p>
        To manage your estimated {abbreviateNumber(nTotalKeys)} key/bucket pairs
        where bucket names are ~{formatBytes(nBucketSize)},
        keys are ~{formatBytes(nKeySize)}, values are ~{formatBytes(nRecordSize)} and you are setting aside {formatBytes(calculateRam(nRam))} of RAM per-node for in-memory data management
        within a cluster that is configured to maintain {nNVal} replicas per key (N = {nNVal}) then Riak, using the Bitcask storage engine, will require at least:
      </p>
      <ul>
        <li>{n} nodes</li>
        <li>{formatBytes(r / n)} of RAM per node ({formatBytes(r)} total across all nodes)</li>
        <li>{formatBytes(d / n)} of storage space per node ({formatBytes(d)} total storage space used across all nodes)</li>
      </ul> 
    </>
  );
}

function Inputs({ state, handleChange, setInfo }) {
  const inputs = [
    {
      info: "How many keys will be stored in your cluster?",
      label: "Total Number of Keys",
      action: "nTotalKeys",
    },
    {
      info: "How long will your average bucket name be? Keep in mind that if you are using multi-byte characters or URL encoding your length should reflect that.",
      label: "Average Bucket Size (Bytes)",
      action: "nBucketSize",
    },
    {
      info: "How long will your average key be?  Here again, keep in mind that if you are using multi-byte characters or URL encoding your length should reflect that.",
      label: "Average Key Size (Bytes)",
      action: "nKeySize",
    },
    {
      info: "How much data will you store on average per bucket/key pair?",
      label: "Average Value Size (Bytes)",
      action: "nRecordSize",
    },
    {
      info: "How much physical RAM on each server will be dedicated to the storage engine?  This should not be the total amount of RAM available, at most it should be 80% of the total RAM.",
      label: "RAM Per Node (in GB)",
      action: "nRam",
    },
    {
      info: "What will the cluster's 'N' value be?  How many copies of each item will you store?",
      label: "N (Number of Write Copies)",
      action: "nNVal",
    },
  ];

  return inputs.map(({ info, label, action }) =>
      <Input key={action} info={info} label={label} action={action} value={state[action]} handleChange={handleChange} setInfo={setInfo} />); 
}

export default function BitcaskCalculator() {
  const initialState = {
    bytesInAPtr: 8, // 64  bit system
    nTotalKeys: 183915891,
    nBucketSize: 10, // 10  avg byte length bucket names
    nKeySize: 36, // 36  avg byte length keys
    nRecordSize: 36, // 36  values
    nRam: 16, // 16  GB RAM
    nNVal: 3 // "N" value of 3
  };
  const [info, setInfo] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
  const handleChange = (action, payload) => dispatch({ type: action, payload });

  return (
    <>
      {info}
      <Inputs state={state} handleChange={handleChange} setInfo={setInfo} />
      <Recommendations state={state} />
    </>
  );
}
