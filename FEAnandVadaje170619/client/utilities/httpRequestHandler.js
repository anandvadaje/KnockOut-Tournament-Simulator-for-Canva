/*
  ClassName:  HTTPRequestHandler
  Purpose:    Handles all the GET and POST requests made from tournamentAPI class
*/

class HTTPRequestHandler {
  
  //Performs a GET request
  static async get(url, parameters = {}) {
    const queryString = this.CreateQueryString(parameters);
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

  //Performs a POST request 
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
      body: this.CreateQueryString(data)
    };
    const request = new Request(url, options);

    try {
      const response = await fetch(request, options);
      return response.json();
    } catch (error) {
      return error;
    }
  }

  //Converts and array of parameter to queryString
  static CreateQueryString(parameters) {
    return Object
      .keys(parameters)
      .map((key) => {
        if (parameters[key] instanceof Array) {
          const arrayParams = [];
          
          for (const value of parameters[key]) {
            arrayParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          }
          
          return arrayParams.join('&');
        } else {
          return `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`
        }
      })
      .join('&');
  }
}
