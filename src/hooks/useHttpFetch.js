import { useEffect, useReducer, useCallback } from "react";
import { httpFetch } from "lib/http/httpFetch";

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true, isSuccess: false, isError: false };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return { ...state, isLoading: false, isSuccess: false, isError: true };
    default:
      throw new Error("Incorrect action dispatched to dataFetchReducer");
  }
};

/*
  Custom hook that handles data fetching
  - Specifying an initial URL will cause this hook to fetch on initial render.
    When the URL is omitted then it won't fetch on initial render.
    Pro tip: specifying an URL that is not static will cause this hook to fetch
    every time the URL changes.
  - initial data is if you always need some kind of data for the component logic
  - The returned fetchData function can be used to force a fetch with the initial URL
    or the URL can also be specified when the hook has no initial URL.
*/
export const useHttpFetch = ({ initialUrl = "", initialData }) => {
  const initialUrlDefined = initialUrl != "";

  const [state, dispatch] = useReducer(dataFetchReducer, {
    // with an initial url we fetch on initial render so initial loading state should also be true
    isLoading: initialUrlDefined,
    isError: false,
    data: initialData,
  });

  const fetchData = useCallback(
    async (url = initialUrl) => {
      dispatch({ type: "FETCH_INIT" });

      try {
        const result = await httpFetch(url);

        dispatch({ type: "FETCH_SUCCESS", payload: result });
      } catch (error) {
        dispatch({ type: "FETCH_FAILURE" });
      }
    },
    [initialUrl]
  );

  useEffect(() => {
    if (initialUrlDefined) fetchData();
  }, [initialUrlDefined, fetchData]);

  return [state, fetchData];
};
