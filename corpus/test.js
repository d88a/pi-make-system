/**
 * analyze-corpus.js — Wave D: Pattern Analysis
 * Reads all raw/extractions/*/extraction.json, aggregates patterns,
 * outputs analysis-summary.json + analysis-report.md + 4 patterns/*.md
 *
 * Node.js, no external dependencies.
 * Usage: node D:/pi/corpus/sources/analyze-corpus.js
 */

const fs = require('fs');