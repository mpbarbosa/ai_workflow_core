import fs from 'fs/promises';
import path from 'path';

describe('doc_analysis_prompt scope rules', () => {
  it('treats listed docs as the minimum review set and keeps authoritative docs in scope', async () => {
    const promptPath = path.join(process.cwd(), 'config', 'ai_helpers', 'documentation_prompts.yaml');
    const prompts = await fs.readFile(promptPath, 'utf8');

    expect(prompts).toContain('**Documentation to review**: {doc_files}');
    expect(prompts).toContain('listed documentation files are the minimum required review set');
    expect(prompts).toContain('Existing authoritative docs directly affected by the changed files are also in scope');
    expect(prompts).toContain('`README.md` for overview, usage, and public entry points');
    expect(prompts).toContain('`docs/ARCHITECTURE.md` for architecture or layout changes');
    expect(prompts).toContain('`docs/guides/MIGRATION_GUIDE.md` for breaking changes or migration steps');
    expect(prompts).toContain('Treat the listed documentation files as minimum required targets, not the exhaustive limit');
  });
});
