import { SearchClient } from "algoliasearch";

// https://stackoverflow.com/questions/48011353/how-to-unwrap-the-type-of-a-promise
type Awaited<T> = T extends PromiseLike<infer U>
  ? { 0: Awaited<U>; 1: U }[U extends PromiseLike<any> ? 0 : 1]
  : T;

export function bindSearchClient(searchClient: SearchClient) {
  const requester = searchClient.transporter.requester;
  type Request = Parameters<typeof requester.send>[0];
  type Response = Awaited<ReturnType<typeof requester.send>>;
  const getUserToken = () => this._userToken;

  // @ts-expect-error patching the client intentionally
  searchClient.transporter.requester = {
    send(request: Request): Promise<Response> {
      let newRequest: Request;
      try {
        const data = JSON.parse(request.data);

        if (Array.isArray(data.requests)) {
          // multi index
          newRequest = {
            ...request,
            data: JSON.stringify({
              ...data,
              requests: data.requests.map(request => ({
                ...request,
                clickAnalytics: true,
                userToken: getUserToken()
              }))
            })
          };
        } else {
          newRequest = {
            ...request,
            data: JSON.stringify({
              ...data,
              clickAnalytics: true,
              userToken: getUserToken()
            })
          };
        }
      } catch (e) {
        newRequest = request;
      }

      return requester.send(newRequest);
    }
  };
}
