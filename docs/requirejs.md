# Note for Require.js users

When using [Require.js](https://requirejs.org/), the default UMD build might conflict and throw with a
"Mismatched anonymous define() modules" message.
This is a [known Require.js issue](https://requirejs.org/docs/errors.html#mismatch).

To work around this problem and ensure you capture all interactions occurring before the library is done loading,
change `ALGOLIA_INSIGHTS_SRC` to point to the IIFE build, and load it via a `<script>` tag.

<!-- prettier-ignore-start -->
```html
<script>
var ALGOLIA_INSIGHTS_SRC = "https://cdn.jsdelivr.net/npm/search-insights@2.17.0/dist/search-insights.iife.min.js";

!function(e,a,t,n,s,i,c){e.AlgoliaAnalyticsObject=s,e[s]=e[s]||function(){
(e[s].queue=e[s].queue||[]).push(arguments)},e[s].version=(n.match(/@([^\/]+)\/?/) || [])[1],i=a.createElement(t),c=a.getElementsByTagName(t)[0],
i.async=1,i.src=n,c.parentNode.insertBefore(i,c)
}(window,document,"script",ALGOLIA_INSIGHTS_SRC,"aa");
</script>
```
<!-- prettier-ignore-end -->
