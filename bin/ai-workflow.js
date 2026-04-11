#!/usr/bin/env node

const { access } = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const parentCliPath = path.resolve(__dirname, '../../bin/ai-workflow.js');

(async () => {
  try {
    await access(parentCliPath);
    await import(pathToFileURL(parentCliPath).href);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    console.error(
      [
        'Cannot launch ai-workflow from .workflow_core by itself.',
        `Expected parent CLI at: ${parentCliPath}`,
        'Run this command from the parent ai_workflow.js repository root instead.',
        `Original error: ${message}`,
      ].join('\n'),
    );
    process.exit(1);
  }
})();
