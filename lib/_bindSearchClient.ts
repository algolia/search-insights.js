import { SearchClient } from "algoliasearch";

export function bindSearchClient(searchClient: SearchClient) {
  const read = searchClient.transporter.read;
  type Request = Parameters<typeof read>[0];
  type RequestOptions = Parameters<typeof read>[1];
  const getUserToken = () => this._userToken;
  const setResponse = response => (this._lastResponse = response);

  // @ts-expect-error we are patching a read-only function
  searchClient.transporter.read = async (
    request: Request,
    requestOptions?: RequestOptions
  ) => {
    if (
      request.path === "1/indexes/*/queries" ||
      /^1\/indexes\/.*?\/query$/.test(request.path)
    ) {
      let newRequest: Request;
      try {
        // request.data is always Record<string, string> when it's a search call
        const data = request.data as Record<string, string>;

        if (Array.isArray(data.requests)) {
          // multi index
          newRequest = {
            ...request,
            data: {
              ...data,
              requests: data.requests.map(request => ({
                ...request,
                clickAnalytics: true,
                userToken: getUserToken()
              }))
            }
          };
        } else {
          newRequest = {
            ...request,
            data: {
              ...data,
              clickAnalytics: true,
              userToken: getUserToken()
            }
          };
        }
      } catch (e) {
        newRequest = request;
      }

      return read
        .call(searchClient.transporter, newRequest, requestOptions)
        .then(result => {
          setResponse(result);
          return result;
        });
    } else {
      return read.call(searchClient.transporter, request, requestOptions);
    }
  };
}
