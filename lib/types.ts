import { init } from "./init";
import { addAlgoliaAgent } from "./_algoliaAgent";
import { getUserToken, setUserToken, onUserTokenChange } from "./_tokenUtils";
import {
  clickedObjectIDsAfterSearch,
  clickedObjectIDs,
  clickedFilters
} from "./click";
import {
  convertedObjectIDsAfterSearch,
  convertedObjectIDs,
  convertedFilters
} from "./conversion";
import { viewedObjectIDs, viewedFilters } from "./view";
import { getVersion } from "./_getVersion";

export type Init = (method: "init", ...args: Parameters<typeof init>) => void;

export type GetVersion = (
  method: "getVersion",
  ...args: Parameters<typeof getVersion>
) => void;

export type AddAlgoliaAgent = (
  method: "addAlgoliaAgent",
  ...args: Parameters<typeof addAlgoliaAgent>
) => void;

export type SetUserToken = (
  method: "setUserToken",
  ...args: Parameters<typeof setUserToken>
) => void;

export type GetUserToken = (
  method: "getUserToken",
  ...args: Parameters<typeof getUserToken>
) => void;

export type OnUserTokenChange = (
  method: "onUserTokenChange",
  ...args: Parameters<typeof onUserTokenChange>
) => void;

export type ClickedObjectIDsAfterSearch = (
  method: "clickedObjectIDsAfterSearch",
  ...args: Parameters<typeof clickedObjectIDsAfterSearch>
) => void;

export type ClickedObjectIDs = (
  method: "clickedObjectIDs",
  ...args: Parameters<typeof clickedObjectIDs>
) => void;

export type ClickedFilters = (
  method: "clickedFilters",
  ...args: Parameters<typeof clickedFilters>
) => void;

export type ConvertedObjectIDsAfterSearch = (
  method: "convertedObjectIDsAfterSearch",
  ...args: Parameters<typeof convertedObjectIDsAfterSearch>
) => void;

export type ConvertedObjectIDs = (
  method: "convertedObjectIDs",
  ...args: Parameters<typeof convertedObjectIDs>
) => void;

export type ConvertedFilters = (
  method: "convertedFilters",
  ...args: Parameters<typeof convertedFilters>
) => void;

export type ViewedObjectIDs = (
  method: "viewedObjectIDs",
  ...args: Parameters<typeof viewedObjectIDs>
) => void;

export type ViewedFilters = (
  method: "viewedFilters",
  ...args: Parameters<typeof viewedFilters>
) => void;

export type InsightsClient = Init &
  GetVersion &
  AddAlgoliaAgent &
  SetUserToken &
  GetUserToken &
  OnUserTokenChange &
  ClickedObjectIDsAfterSearch &
  ClickedObjectIDs &
  ClickedFilters &
  ConvertedObjectIDsAfterSearch &
  ConvertedObjectIDs &
  ConvertedFilters &
  ViewedObjectIDs &
  ViewedFilters & {
    version?: string;
  };

export type InsightsAdditionalEventParams = {
  headers?: Record<string, string>;
};
