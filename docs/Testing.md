# Testing Guide

## 1. Running Tests

### Unit Tests
Run all unit tests:
```bash
npm run test:unit
```

### Integration Tests
Run all integration tests:
```bash
npm run test:integration
```

### All Tests
Run all tests:
```bash
npm test
```

---

## 2. Adding New Tests

### Unit Tests
- **Location**: Place unit tests in `src/**/*.unit.test.js`.
- **Purpose**: Test individual functions or methods.

### Integration Tests
- **Location**: Place integration tests in `src/**/*.integration.test.js`.
- **Purpose**: Test interactions between components.

---

## 3. Test Framework
The project uses Node.js's built-in `node:test` module for testing. Refer to the [Node.js documentation](https://nodejs.org/api/test.html) for more details.
