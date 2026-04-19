import fs from 'fs/promises';
import path from 'path';

describe('CHANGELOG structure', () => {
  it('keeps release history free of embedded documentation sections', async () => {
    const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
    const changelog = await fs.readFile(changelogPath, 'utf8');

    expect(changelog).toContain('## [1.6.0] — 2026-04-10');
    expect(changelog).toContain('## [1.5.0] — 2026-04-10');
    expect(changelog).toContain('## [1.4.0] — 2026-04-09');
    expect(changelog).toContain('## [1.3.0] — 2026-04-09');
    expect(changelog).toContain('## [1.2.7] — 2026-04-01');

    expect(changelog).not.toContain('\n## README\n');
    expect(changelog).not.toContain('\n## Gitignore Patterns\n');
    expect(changelog).not.toContain('\n## PROMPT_ROLES_REFERENCE\n');
    expect(changelog).not.toContain('### `.workflow-config.yaml.template`');
  });
});
