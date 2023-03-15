import { isUndefined } from "./utils";

export interface InitSearchParams {
  getQueryID: () => string | number;
  hitsContainer: string | string[];
}

/**
 * Initialises automatic tracking of click and conversion events
 * @param initParams: InitSearchParams
 */
export function initSearch(initParams: InitSearchParams) {
  if ((isUndefined(this._apiKey) || isUndefined(this._appId))) {
    throw new Error(
      "Before calling any methods on the analytics, you first need to call the 'init' function with appId and apiKey parameters"
    );
  } else if (!initParams) {
    throw new Error(
      "initSearch function requires an argument with getQueryID and hitsContainer arguments"
    );
  } else if (
    !initParams.getQueryID ||
    typeof initParams.getQueryID !== "function"
  ) {
    throw new Error(
      "getQueryID must be a function that returns the queryID of the last search operation"
    );
  }
  // } else if(!initParams.hitsContainer || (typeof initParams.hitsContainer !== "string" && !Array.isArray(initParams.hitsContainer))){
  //   throw new Error('hitsContainer parameter must either be a CSS selector or an array od CSS selectors')
  // }

  this.getQueryID = initParams.getQueryID;
  // this.hitsContainer = initParams.hitsContainer;
}
