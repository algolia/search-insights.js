import { SearchClient } from "algoliasearch";
import {
  SearchResponse,
  MultipleQueriesResponse
} from "@algolia/client-search";

type Read = SearchClient["transporter"]["read"];
type Request = Parameters<Read>[0];
type RequestOptions = Parameters<Read>[1];

export type SearchClientBinding = {
  instance: SearchClient;
  read: Read;
  requests: Array<{
    request: Request;
    requestOptions: RequestOptions;
  }>;
  responses: Array<SearchResponse | MultipleQueriesResponse<{}>>;
};

const LIMIT_HISTORY = 10;

export function setSearchClient(searchClient: SearchClient) {
  if (!this._searchClientBinding) {
    revertSearchClientBinding.call(this);
  }

  if (!searchClient) {
    return;
  }

  const read = searchClient.transporter.read;

  this._searchClientBinding = {
    instance: searchClient,
    read,
    requests: [],
    responses: []
  };

  const getUserToken = () => this._userToken;

  const addRequest = (request: Request, requestOptions: RequestOptions) => {
    this._searchClientBinding.requests.push({ request, requestOptions });
    this._searchClientBinding.requests = capMaximumItems(
      this._searchClientBinding.requests
    );
  };
  const addResponse = (response) => {
    this._searchClientBinding.responses.push(response);
    this._searchClientBinding.responses = capMaximumItems(
      this._searchClientBinding.responses
    );
  };

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
            requests: data.requests.map((request) => ({
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

    addRequest(request, requestOptions);
    return read
      .call(searchClient.transporter, newRequest, requestOptions)
      .then((response) => {
        addResponse(response);
        return response;
      });
  };
}

function capMaximumItems<T = any>(array: T[], limit = LIMIT_HISTORY) {
  // keep the latest N items
  if (array.length <= limit) {
    return array;
  }
  return array.slice(array.length - limit);
}

function revertSearchClientBinding() {
  if (this._searchClientBinding) {
    this._searchClientBinding.instance.transporter.read = this._searchClientBinding.read;
    this._searchClientBinding = undefined;
  }
}
