# GitHub Actions Workflows

This repository uses GitHub Actions for continuous integration and automated testing. The following workflows are configured:

## Workflows Overview

### 1. `required-checks.yml` - Required Checks ⚡
**Trigger:** Pull Requests to `main`
**Purpose:** Essential checks that must pass before PR approval
- ✅ ESLint code linting
- ✅ TypeScript type checking
- ✅ Unit test execution
- ✅ Build verification
- ✅ Security audit
- ✅ Dependency checks

### 2. `pr-validation.yml` - PR Validation 🔍
**Trigger:** Pull Requests to `main`
**Purpose:** Comprehensive validation with PR comments
- ✅ All required checks
- ✅ Test coverage generation
- ✅ Code quality analysis
- ✅ Build output verification
- ✅ Automated PR comments with results

### 3. `ci.yml` - CI Test Suite 🧪
**Trigger:** Pull Requests and pushes to `main`/`develop`
**Purpose:** Multi-node testing with coverage reports
- ✅ Tests on Node.js 18.x and 20.x
- ✅ Coverage reporting to Codecov
- ✅ Build verification
- ✅ Status reporting

### 4. `test-matrix.yml` - Test Matrix 🌐
**Trigger:** Pull Requests and pushes to `main`
**Purpose:** Cross-platform testing
- ✅ Tests on Ubuntu, Windows, and macOS
- ✅ Multiple Node.js versions (18.x, 20.x, 21.x)
- ✅ Matrix strategy for comprehensive coverage

## Branch Protection

To enable these workflows as required checks:

1. Go to **Settings** → **Branches**
2. Add a branch protection rule for `main`
3. Enable "Require status checks to pass before merging"
4. Select the following required checks:
   - `Required Checks`
   - `Validate Pull Request`
   - `Run Tests`

## Workflow Features

### 🚀 Performance Optimizations
- **Concurrency control**: Cancels previous runs when new commits are pushed
- **Caching**: NPM dependencies are cached for faster builds
- **Fail-fast**: Matrix builds stop early if critical failures occur

### 🔒 Security Features
- **Security audits**: Automatic dependency vulnerability scanning
- **Permission control**: Minimal required permissions
- **Secrets handling**: Secure environment variable management

### 📊 Reporting Features
- **Test coverage**: Automated coverage reporting
- **PR comments**: Real-time status updates on pull requests
- **Build artifacts**: Verification of build outputs

### 🛠️ Quality Checks
- **Linting**: ESLint for code quality
- **Type safety**: TypeScript compilation checks
- **Test verification**: Ensures test files exist and pass
- **Build validation**: Confirms successful application builds

## Local Development

To run the same checks locally:

```bash
# Install dependencies
npm ci

# Run linting
npm run lint

# Run type checking
npx tsc --noEmit

# Run tests
npm run test:run

# Run tests with coverage
npm run test:coverage

# Build application
npm run build
```

## Troubleshooting

### Common Issues

1. **Test failures**: Check test output in the Actions tab
2. **Build failures**: Verify all dependencies are installed
3. **Lint errors**: Run `npm run lint` locally to fix issues
4. **Type errors**: Run `npx tsc --noEmit` to check TypeScript

### Debugging Workflows

- Check the **Actions** tab for detailed logs
- Review the **Checks** tab on pull requests
- Look for annotations on changed files
- Check workflow run summaries for quick overview

## Configuration

### Adding New Tests
When adding new components or features:
1. Create corresponding `.test.tsx` files
2. Ensure tests follow existing patterns
3. Update test coverage if needed

### Modifying Workflows
- Test changes in a feature branch first
- Use `act` for local workflow testing
- Keep workflows focused and efficient
- Update this documentation when making changes
