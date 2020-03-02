export const httpFetch = function(url, options = {}) {
  const requestTimeout = options.timeout || 20 * 1000;
  const expectJson = options.json || true;
  let timer;

  return new Promise(function(resolve, reject) {
    const request = new XMLHttpRequest();
    if (expectJson) request.responseType = "json";

    request.onload = function() {
      clearTimeout(timer);

      if (request.status >= 200 && request.status < 300) {
        resolve(request.response);
      } else {
        reject({
          status: request.status,
          statusText: request.statusText,
          response: request.response,
        });
      }
    };

    request.onerror = function() {
      clearTimeout(timer);
      reject({
        status: request.status,
        statusText: "There was an error making the request.",
      });
    };

    request.onreadystatechange = function() {
      if (request.readyState == XMLHttpRequest.LOADING) {
        // Downloading, stop timeout
        clearTimeout(timer);
      }
    };

    request.open("GET", url, true);
    request.send();

    timer = setTimeout(() => {
      request.abort();
      reject({
        status: 408,
        statusText: "Request timed out.",
      });
    }, requestTimeout);
  });
};
