/**
 * Wrapper for the web API {@link https://developer.mozilla.org/en/docs/Web/API/Fetch_API|fetch} method.
 * @class HTTPRequest
 * @alias HTTPRequest
 */
class HTTPRequestHandler {
  /**
   * Performs a GET request.
   *
   * @static
   * @param {string} url - URL to perform request on.
   * @param {any} [parameters={}] - Query parameters.
   * @returns {Object} JSON object of the response.
   */
  static async get(url, parameters = {}) {
    const queryString = this._queryString(parameters);
    const urlQuery = `${url}?${queryString}`;
    const headers = { 'Accept': 'application/json' };
    const options = {
      method: 'GET',
      mode: 'cors',
      headers: new Headers(headers),
      cache: 'default'
    };
    const request = new Request(urlQuery, options);

    try {
      const response = await fetch(request, options);
      return response.json();
    } catch (error) {
      return error;
    }
  }

  /**
   * Performs a POST request.
   *
   * @static
   * @param {string} url - URL to perform request on.
   * @param {any} [data={}] - Request body data.
   * @returns {Object} JSON object of the response.
   */
  static async post(url, data = {}) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const options = {
      method: 'POST',
      mode: 'cors',
      headers: new Headers(headers),
      cache: 'default',
      body: this._queryString(data)
    };
    const request = new Request(url, options);

    try {
      const response = await fetch(request, options);
      return response.json();
    } catch (error) {
      return error;
    }
  }

  /**
   * Coverts an array of parameters to a query string.
   *
   * @static
   * @param {Object} parameters - Parameters to convert.
   * @returns {string} Converted parameters as a query string.
   * @example
   * { tournamentId: 1, teamIds: [1, 2], matchScore: 69 }
   *  => 'tournamentId=1&teamIds=1&teamIds=1&matchScore=69'
   */
  static _queryString(parameters) {
    return Object
      .keys(parameters)
      .map((key) => {
        // Check if we have an array
        if (parameters[key] instanceof Array) {
          const arrayParams = [];
          // Encode each parameter of the array
          for (const value of parameters[key]) {
            arrayParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          }
          // Join together
          return arrayParams.join('&');
        } else {
          // Just a regular object (note: won't work for nested objects)
          return `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`
        }
      })
      .join('&'); // Final join
  }
}
