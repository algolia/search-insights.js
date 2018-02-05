#!/bin/bash

file_output=$(grep -oh "localhost:8080" dist/search-insights.min.js)
file_output_insights=$(grep -oh "https://insights.algolia.io" dist/search-insights.min.js)

# echo "$file_output", "$file_output_insights"

if [[ "$file_output" == "localhost:8080" ]]; then
  echo "search-insights.js localhost address, meaning you tried to publish a dev version of the script"
  exit 1
elif [[ "$file_output_insights" == "https://insights.algolia.io" ]]; then
  echo "search-insights.js has proper reporting address"
  exit 0
else
  printf "nothing found"
  exit 1
fi
