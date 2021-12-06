import { SearchClient } from "algoliasearch";

function revertSearchClientBinding() {}

export function setSearchClient(searchClient: SearchClient) {
  if (!this._searchClientBinding) {
    revertSearchClientBinding.call(this);
  }

  if (!searchClient) {
    return;
  }

  this._searchClientBinding = {
    instance: searchClient,
    read: searchClient.transporter.read
  };

  const read = searchClient.transporter.read;
  type Request = Parameters<typeof read>[0];
  type RequestOptions = Parameters<typeof read>[1];
  const getUserToken = () => this._userToken;
  const setResponse = response => (this._lastResponse = response);

  // @ts-expect-error we are patching a read-only function
  searchClient.transporter.read = (
    request: Request,
    requestOptions?: RequestOptions
  ) => {
    if (
      !(
        request.path === "1/indexes/*/queries" ||
        /^1\/indexes\/.*?\/query$/.test(request.path)
      )
    ) {
      // not a search call
      return read.call(searchClient.transporter, request, requestOptions);
    }

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
              clickAnalytics: true,
              userToken: getUserToken(),
              ...request
            }))
          }
        };
      } else {
        newRequest = {
          ...request,
          data: {
            clickAnalytics: true,
            userToken: getUserToken(),
            ...data
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
  };
}
