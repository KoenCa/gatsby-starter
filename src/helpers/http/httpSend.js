export const httpSend = (
  url,
  data,
  {
    contentType = "application/json",
    method = "POST",
    withCredentials = true,
    withCsrf = true,
  }
) =>
  new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const csrfToken = document
      ?.querySelector("meta[name=csrf-token]")
      ?.getAttribute("content");

    request.open(method, url, true);
    request.withCredentials = withCredentials;
    request.setRequestHeader("Content-Type", contentType);

    if (withCsrf && csrfToken) {
      request.setRequestHeader("X-CSRF-Token", csrfToken);
    }

    request.onload = function() {
      if (request.status >= 200 && request.status < 300) {
        try {
          const data = JSON.parse(request.responseText);
          resolve(data);
        } catch (error) {
          resolve(request.responseText);
        }
      } else {
        reject({
          status: request.status,
          statusText: request.statusText,
          response: request.response,
        });
      }
    };

    request.onerror = function() {
      reject({
        status: request.status,
        statusText: request.statusText,
        response: request.response,
      });
    };

    request.send(data ? JSON.stringify(data) : undefined);
  });
