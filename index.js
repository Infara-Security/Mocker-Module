addModule("mocker",
    () => { //activate

        // Initialize the mocker module within the launcher's namespace
        window[launcher.config.name].mocker = {
            mocks: [] // Array to store mock objects
        };

        // Store references to the original fetch and XMLHttpRequest objects
        window.originalFetch = window.fetch;
        window.originalXMLHttpRequest = window.XMLHttpRequest;

        /**
         * Mocks an XMLHttpRequest.
         * @param {string} method - The HTTP method to mock.
         * @param {string} url - The URL to mock.
         * @param {*} response - The mock response.
         * @param {function} filter - An optional filter function.
         */
        window[launcher.config.name].mocker.mockHttpRequest = (method, url, response, filter) => {
            // Add the mock to the array of mocks
            window[launcher.config.name].mocker.mocks.push({
                method,
                url,
                response,
                filter
            });

            // Override the XMLHttpRequest object
            window.XMLHttpRequest = function() {
                // Override the open method
                this.open = function(m, u) {
                    // Find a mock that matches the method and URL of the request
                    var mock = window[launcher.config.name].mocker.mocks.find(function(mock) {
                        return mock.method === m && mock.url === u;
                    });

                    // If a matching mock is found
                    if (mock) {
                        // Override the send method
                        this.send = function(data) {
                            // If no filter is provided or if the filter returns true
                            if (!mock.filter || mock.filter(data)) {
                                // Call the onload callback with the mocked response
                                this.onload({
                                    target: {
                                        response: JSON.stringify(mock.response)
                                    }
                                });
                            } else {
                                // Otherwise, create a new XMLHttpRequest object and make the actual network request
                                var xhr = new originalXMLHttpRequest();
                                xhr.open.apply(xhr, arguments);
                                xhr.send.apply(xhr, arguments);
                            }
                        };
                    } else {
                        // If no matching mock is found, create a new XMLHttpRequest object and make the actual network request
                        var xhr = new originalXMLHttpRequest();
                        xhr.open.apply(xhr, arguments);
                        this.send = xhr.send.bind(xhr);
                    }
                };
            };
        };

        /**
         * Mocks a fetch request.
         * @param {string} url - The URL to mock.
         * @param {*} response - The mock response.
         */
        window[launcher.config.name].mocker.mockFetchRequest = (url, response) => {
            window.fetch = () => Promise.resolve({ json: () => Promise.resolve(response) });
            window[launcher.config.name].mocker.mocks.push({
                url,
                response
            });
        };

        /**
         * Removes a mock from the array of mocks.
         * @param {string} method - The HTTP method of the mock.
         * @param {string} url - The URL of the mock.
         */
        window[launcher.config.name].mocker.removeMock = (method, url) => {
            // Find the index of the mock in the array of mocks
            var index = window[launcher.config.name].mocker.mocks.findIndex(function(mock) {
                return mock.method === method && mock.url === url;
            });

            // If a matching mock is found, remove it from the array of mocks
            if (index !== -1) {
                window[launcher.config.name].mocker.mocks.splice(index, 1);
            }
        };

        /**
         * Clears all registered mocks and restores original fetch and XMLHttpRequest objects.
         */
        window[launcher.config.name].mocker.clearAllMocks = () => {
            window[launcher.config.name].mocker.mocks = [];
            window.XMLHttpRequest = originalXMLHttpRequest;
            window.fetch = window.originalFetch;
        };

        /**
         * Help function
         */
        window[launcher.config.name].mocker.help = () => {
            window[launcher.config.name].logger.log("Use 'addMock(url, options, response)' to add mocks.");
            window[launcher.config.name].logger.log("Example: mockHttpRequest('/api/data', { method: 'GET' }, { status: 200, body: 'Mocked response' })");
            window[launcher.config.name].logger.log("Use 'removeMock(url, options)' to remove an individual mock.");
            window[launcher.config.name].logger.log("Use 'removeAllMocks()' to remove all mocks.");
            window[launcher.config.name].logger.log("Use 'mocks' to view the current mocks array.");
        }

    },
    () => { //deactivate
        // When the module is deactivated, clear all mocks
        window[launcher.config.name].mocker.clearAllMocks();
        // Clean up the mocker module from the launcher's namespace
        delete window[launcher.config.name].mocker;
    }
);
