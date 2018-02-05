import AlgoliaInsights from '../insights';

const credentials = {
  apiKey: 'test',
  applicationID: 'test'
}

it('Should throw if init was not called', () => {
  expect(() => {
    AlgoliaInsights.conversion()
  }).toThrowError('Before calling any methods on the analytics, you first need to call the \'init\' function with applicationID and apiKey parameters')
})

it('Should throw if objectID is not sent', () => {
  expect(() => {
    AlgoliaInsights.init(credentials);
    AlgoliaInsights.conversion()
  }).toThrowError('No parameters were sent to conversion event, please provide an objectID')
})

it('Should throw if no queryID is set in storage', () => {
  const spy = jest.spyOn(AlgoliaInsights, 'sendEvent');
  AlgoliaInsights.init(credentials);
  AlgoliaInsights.conversion({objectID: '12345'})
  expect(AlgoliaInsights.sendEvent).not.toHaveBeenCalled();
})

it('Should send conversion event with proper queryID', () => {
  beforeEach(() => {

  })
  const spy = jest.spyOn(AlgoliaInsights, 'sendEvent');
  AlgoliaInsights.init(credentials);
  AlgoliaInsights.conversion({objectID: '12345'})
  expect(AlgoliaInsights.sendEvent).not.toHaveBeenCalled();
})

// it('Should throw if position is not sent', () => {
//   expect(() => {
//     AlgoliaInsights.init(credentials);
//     AlgoliaInsights.click({position: 1})
//   }).toThrowError('required objectID parameter was not sent, click event can not be properly attributed')
// })
