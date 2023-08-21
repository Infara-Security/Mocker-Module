# Mocker Module
## Requires [Module-Launcher](https://github.com/Infara-Security/Module-Launcher) <br>
The Mocker module provides a way to mock XMLHttpRequest and fetch requests for testing and development purposes. It allows you to simulate responses for specific HTTP requests, enabling you to test different scenarios without making actual network requests. This readme provides an overview of the functionality and usage of the Mocker module.

## Introduction
The Mocker module allows you to intercept and mock HTTP requests made using the `XMLHttpRequest` and `fetch` APIs. This can be particularly useful for isolating parts of your application during testing or replicating specific server responses for different scenarios.

## Usage

### Mocking `XMLHttpRequest`
To mock an `XMLHttpRequest`:
```javascript
// Example mock for a GET request to '/api/data'
window[launcher.config.name].mocker.mockHttpRequest('GET', '/api/data', { status: 200, body: 'Mocked response' });
```

### Removing Mocks
To remove a specific mock:
```javascript
// Remove a mock for a GET request to '/api/data'
window[launcher.config.name].mocker.removeMock('GET', '/api/data');
```

### Clearing All Mocks
To remove all mocks and restore original request functionality:
```javascript
// Clear all mocks and restore original request functionality
window[launcher.config.name].mocker.clearAllMocks();
```

### Help Function
To view usage help and available commands:
```javascript
// Display usage information
window[launcher.config.name].mocker.help();
```

## Module Lifecycle
- When the module is activated, it initializes the mocker module within the launcher's namespace, providing functions to mock requests and manage mocks.
- When the module is deactivated, all registered mocks are cleared, and the mocker module is removed from the launcher's namespace.

## Contributing
Feel free to contribute to this module by submitting pull requests or suggesting improvements. Please ensure that your contributions align with the project's goals and maintain code quality.

## License
This Mocker module is provided under the [MIT License](LICENSE). You are free to use, modify, and distribute it in your projects. Refer to the license file for more information.


