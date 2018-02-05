
import { sendEvent, AnalyticsEvent } from './_sendEvent';

export interface ConversionReport extends AnalyticsEvent {
  objectID: string | number;
}

/**
 * Checks params for conversion report and sends query
 * @param params ConversionReport
 */
export function conversion(params: ConversionReport){
  if(!this._hasCredentials) {
    throw new Error('Before calling any methods on the analytics, you first need to call the \'init\' function with applicationID and apiKey parameters');

  } else if(!params) {
    throw new Error('No parameters were sent to conversion event, please provide an objectID')

  } else if(!params.objectID) {
    throw new Error('No objectID was sent to conversion event, please provide an objectID')
  }

  // Get associated queryID
  const queryID = this.storageManager.getConversionObjectID(params.objectID);

  // Reassign params
  const conversionParams = Object.assign(params, {queryID: queryID.queryID})

  // Could not retrieve queryID from localStorage -> CTR through
  // search event likely did not happen,
  // -> consider that conversion did not come from search and exit.
  if(!queryID){
    return false;
  }

  // Send event
  this.sendEvent('conversion', conversionParams);
}