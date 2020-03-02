import { useEffect, useReducer, useCallback } from "react";
import { httpSend } from "lib/http/httpSend";

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "SEND_INIT":
      return { ...state, isLoading: true, isSuccess: false, isError: false };
    case "SEND_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        data: action.payload,
      };
    case "SEND_FAILURE":
      return { ...state, isLoading: false, isSuccess: false, isError: true };
    default:
      throw new Error("Incorrect action dispatched to dataFetchReducer");
  }
};

/*
  Custom hook that handles data sending via HTTP
  - Specifying an initial URL will cause this hook to fetch on initial render.
    When the URL is omitted then it won't fetch on initial render.
    Pro tip: specifying an URL that is not static will cause this hook to fetch
    every time the URL changes.
  - initial send data is when you also have an initial URL and you need to send some
    data along with the request
  - initial send options is when you also have an initial URL and you need to change some
    options for the XMLHttpRequest
  - initial received data is an initialization for the data that you normally receive.
    this is for when you need some beginning state like `useState` of React.
  - The returned snedData function can be used to force a fetch with the initial URL
    or the URL can also be specified when the hook has no initial URL. The second
    parameter of this function is for the request data and the third parameter is
    for the request options for the XMLHttpRequest.
*/
export const useHttpSend = ({
  initialUrl = "",
  initialSendData = {},
  initialSendOptions = {},
  initialReceivedData,
}) => {
  const initialUrlDefined = initialUrl != "";

  const [state, dispatch] = useReducer(dataFetchReducer, {
    // with an initial url we send on initial render so initial loading state should also be true
    isLoading: initialUrlDefined,
    isError: false,
    data: initialReceivedData,
  });

  const sendData = useCallback(
    async (
      url = initialUrl,
      data = initialSendData,
      sendOptions = initialSendOptions
    ) => {
      dispatch({ type: "SEND_INIT" });

      try {
        const result = await httpSend(url, data, sendOptions);

        dispatch({ type: "SEND_SUCCESS", payload: result });
      } catch (error) {
        dispatch({ type: "SEND_FAILURE" });
      }
    },
    [initialUrl, initialSendData, initialSendOptions]
  );

  useEffect(() => {
    if (initialUrlDefined) sendData();
  }, [initialUrlDefined, sendData]);

  // Returned state is { data, isLoading, isError }
  return [state, sendData];
};
