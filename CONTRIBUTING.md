# Contributing to next-intl-ziad

Thank you for your interest in contributing to next-intl-ziad! We welcome all contributions from bug fixes to new features.

## Development Setup

### Prerequisites

- Node.js 16+
- npm, yarn, or pnpm

### Getting Started

1. **Fork and clone the repository**

```bash
git clone https://github.com/your-username/next-intl-ziad.git
cd next-intl-ziad
```

2. **Install dependencies**

```bash
npm install
```

3. **Run tests to make sure everything is working**

```bash
npm test
```

4. **Build the package**

```bash
npm run build
```

5. **Run the example app to test your changes**

```bash
cd example-app
npm install
npm run dev
```

## Project Structure

```
next-intl-ziad/
├── src/                    # Source code
│   ├── types.ts           # TypeScript interfaces
│   ├── context.tsx        # React context
│   ├── provider.tsx       # I18nProvider component
│   ├── hooks.ts           # React hooks
│   ├── middleware.ts      # Next.js middleware
│   ├── utils/             # Utility functions
│   │   ├── cookie.ts      # Cookie management
│   │   └── translation.ts # Translation logic
│   └── __tests__/         # Unit tests
├── example-app/           # Example Next.js application
├── dist/                  # Built package (generated)
└── README.md             # Documentation
```

## Development Workflow

### Making Changes

1. **Create a new branch**

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

2. **Make your changes**

- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation if needed

3. **Test your changes**

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Test the example app
cd example-app && npm run dev
```

4. **Build and verify**

```bash
npm run build
npm run lint
npm run type-check
```

### Commit Guidelines

We use conventional commits. Format your commit messages as:

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

Examples:

```
feat(hooks): add useT hook for direct translation access
fix(middleware): resolve locale detection for nested paths
docs(readme): update installation instructions
test(utils): add tests for cookie locale detection
```

### Pull Request Process

1. **Ensure your branch is up to date**

```bash
git checkout main
git pull origin main
git checkout your-branch
git rebase main
```

2. **Create a pull request**

- Use a clear, descriptive title
- Provide a detailed description of changes
- Reference any related issues
- Include screenshots for UI changes
- List any breaking changes

3. **PR template**

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Example app works correctly
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added for new functionality
- [ ] Documentation updated
- [ ] No breaking changes (or marked as such)
```

## Code Guidelines

### TypeScript

- Use strict TypeScript settings
- Provide proper type annotations
- Export types that consumers might need
- Use interfaces for object shapes
- Use type unions for constrained values

### React

- Use functional components with hooks
- Follow React best practices
- Avoid prop drilling (use context)
- Use proper dependency arrays in hooks
- Handle loading and error states

### Testing

- Write tests for all new functionality
- Use descriptive test names
- Test edge cases and error conditions
- Mock external dependencies
- Aim for high test coverage

### Documentation

- Update README.md for new features
- Add JSDoc comments for public APIs
- Include usage examples
- Update TypeScript interfaces
- Keep examples current and working

## Bug Reports

When reporting bugs, please include:

1. **Environment details**

   - Node.js version
   - Next.js version (if applicable)
   - Browser (if applicable)
   - Operating system

2. **Reproduction steps**

   - Clear steps to reproduce
   - Expected behavior
   - Actual behavior
   - Code examples

3. **Additional context**
   - Error messages
   - Screenshots
   - Related issues

## Feature Requests

For new features:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** you're trying to solve
3. **Propose a solution** with examples
4. **Consider alternatives** and trade-offs
5. **Provide use cases** and benefits

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Assume good intentions
- Follow the golden rule

## Questions?

- Open an issue for bugs or feature requests
- Check existing issues for similar questions
- Read the documentation thoroughly
- Try the example app to understand usage

## Release Process

### For Maintainers

1. **Version bump**

```bash
npm version patch|minor|major
```

2. **Update changelog**

3. **Create release PR**

4. **Publish after merge**

```bash
npm run build
npm publish
```

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes for significant contributions
- README acknowledgments

Thank you for contributing to next-intl-ziad! 🎉
