import * as testServer from '../../server/server.js';
import AlgoliaInsights from './../insights'
const puppeteer = require('puppeteer');

// Path helper
const examplePath = type => `http://localhost:8080/${type}.html`

// vars
let page, browser, windowWidth = 1920, windowHeight = 1080;

describe('Library initialisation', () => {
  it('Should throw if there is no apiKey and applicationID', () => {
    expect(() => {
      AlgoliaInsights.init()
    }).toThrowError('Init function should be called with an object argument containing your apiKey and applicationID')
  })

  it('Should throw if there is only apiKey param', () => {
    expect(() => {
      AlgoliaInsights.init({apiKey: '1234'})
    }).toThrow('applicationID is missing, please provide it, so we can properly attribute data to your application')
  })

  it('Should throw if there is only applicatioID param', () => {
    expect(() => {
      AlgoliaInsights.init({applicationID: '1234'})
    }).toThrow('apiKey is missing, please provide it so we can authenticate the application')
  })

  it('Should not throw if all params are set', () => {
    expect(() => {
      AlgoliaInsights.init({
        apiKey: '1234',
        applicationID: 'ABCD'
      })
    }).not.toThrow()

    expect(AlgoliaInsights._hasCredentials).toBe(true);
  })

  it('Should create UUID', () => {
    expect(AlgoliaInsights._userID).not.toBeUndefined();
  })
})

describe('Integration tests', () => {
  let handle = null;
  beforeAll(async () => {
    handle = testServer.listen(8080);
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    await page.setViewport({
      width: windowWidth,
      height: windowHeight
    });
  });

  afterAll(() => {
    handle.close();
    browser.close();
  });

  it('Should retrieve queryID from search API', async() => {
    await page.goto(examplePath('instantsearch'));
    await page.waitFor(1000);

    function pageResponse() {
      return new Promise( async(resolve, reject) => {
        page.on('response', async(interceptedRequest) => {
          const request = interceptedRequest.request();

          if(request.url().includes('.algolia.net')){
            const postData = JSON.parse(request.postData());

            if(postData.requests && postData.requests[0].params.includes('query=K')){
              const data = await interceptedRequest.json();
              resolve(data.results[0])
            }
          }
        });

        await page.type('#q', 'K')
      })
    };

    function pageClickSend() {
      return new Promise( async(resolve, reject) => {
        page.on('request', interceptedRequest => {
          if(interceptedRequest.url().includes('localhost:8080')) {
            resolve(JSON.parse(interceptedRequest.postData()))
          }
        });

        await page.click('.ais-hits--item:nth-child(2) .button-click');
      });
    }

    const data = await pageResponse()
    await page.waitFor(1000)
    const requestClick = await pageClickSend()

    expect(data).toHaveProperty('queryID')
    expect(requestClick.queryID).toBe(data.queryID)

    expect(requestClick).toHaveProperty('objectID')
    expect(requestClick).toHaveProperty('queryID')
    expect(requestClick).toHaveProperty('timestamp')
    expect(requestClick.position).toBe(2)
  })
})
