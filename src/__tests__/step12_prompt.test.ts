import fs from 'fs/promises';
import path from 'path';

describe('step12_git_commit_prompt grounding rules', () => {
  it('requires cautious commit bodies and breaking-change claims when evidence is partial', async () => {
    const workflowStepsPath = path.join(process.cwd(), 'config', 'ai_helpers', 'workflow_steps.yaml');
    const workflowSteps = await fs.readFile(workflowStepsPath, 'utf8');

    expect(workflowSteps).toContain(
      'Treat "Changed Files" as the authoritative list of project files in scope'
    );
    expect(workflowSteps).toContain(
      'Do not treat filenames, file categories, commit heuristics, or'
    );
    expect(workflowSteps).toContain('Do not add "No');
    expect(workflowSteps).toContain(
      'It is acceptable to return only the subject line when a fuller body would'
    );
  });
});
