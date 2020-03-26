const imports = require('esm')(module);
const arc = require('@architect/functions');

const fetchSources = imports('./get-sources/index.js').default;
const scrapeData = imports('./scrape-data/index.js').default;

/**
 * AWS entry - WIP!
 */
async function crawler(event) {
  let { options } = event;
  const { date } = event;

  options = { findFeatures: true, findPopulations: true, writeData: true, ...options };

  if (date) {
    process.env.SCRAPE_DATE = date;
  } else {
    delete process.env.SCRAPE_DATE;
  }

  // JSON used for reporting
  const report = {
    date
  };

  const output = await fetchSources({ date, report, options }).then(scrapeData);
  return output;
}

exports.handler = arc.events.subscribe(crawler);
