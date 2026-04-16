import { load } from 'js-yaml';

describe('js-yaml load', () => {
  it('parses a valid YAML string to an object', () => {
    const yaml = `
      name: Copilot
      version: 1.0
      features:
        - AI
        - Automation
    `;
    const result = load(yaml) as any;
    expect(result).toEqual({
      name: 'Copilot',
      version: 1.0,
      features: ['AI', 'Automation'],
    });
  });

  it('parses a YAML array', () => {
    const yaml = `
      - one
      - two
      - three
    `;
    const result = load(yaml);
    expect(result).toEqual(['one', 'two', 'three']);
  });

  it('returns null for empty string', () => {
    const result = load('');
    expect(result).toBeNull();
  });

  it('throws an error for invalid YAML', () => {
    const invalidYaml = `
      name: Copilot
      version 1.0
    `;
    expect(() => load(invalidYaml)).toThrow();
  });

  it('parses YAML with nested objects', () => {
    const yaml = `
      user:
        name: Alice
        details:
          age: 30
          active: true
    `;
    const result = load(yaml) as any;
    expect(result).toEqual({
      user: {
        name: 'Alice',
        details: {
          age: 30,
          active: true,
        },
      },
    });
  });

  it('parses YAML with special types (null, bool, int, float)', () => {
    const yaml = `
      isActive: true
      count: 42
      price: 19.99
      nothing: null
    `;
    const result = load(yaml) as any;
    expect(result).toEqual({
      isActive: true,
      count: 42,
      price: 19.99,
      nothing: null,
    });
  });

  it('parses YAML with comments and ignores them', () => {
    const yaml = `
      # This is a comment
      foo: bar # Inline comment
      # Another comment
      baz: 123
    `;
    const result = load(yaml) as any;
    expect(result).toEqual({
      foo: 'bar',
      baz: 123,
    });
  });

  it('parses YAML with special characters', () => {
    const yaml = `
      greeting: "Hello, world!"
      path: "/usr/local/bin"
      quote: "'single' and \"double\" quotes"
    `;
    const result = load(yaml) as any;
    expect(result).toEqual({
      greeting: 'Hello, world!',
      path: '/usr/local/bin',
      quote: "'single' and \"double\" quotes",
    });
  });
});
