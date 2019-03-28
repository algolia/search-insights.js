# this scripts runs after npm version is ran
VERSION_FILE="./lib/version.ts";
DIST_FILE="./dist/search-insights.min.js";

PACKAGE_VERSION=$(cat ./package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

echo "export default \"$PACKAGE_VERSION\";" > "$VERSION_FILE"
yarn build

git add "$DIST_FILE"
git add "$VERSION_FILE"
