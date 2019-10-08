const fs = require('fs-extra');
const path = require('path');
const { main: mainPath } = require('../package.json');

const ROOT_DIR = path.resolve('src');
const DIST_PATH = path.resolve(mainPath);
const DIST_DIR = path.dirname(DIST_PATH);

async function build() {
  const infoContent = await fs.readFile(path.join(ROOT_DIR, 'info.json'));
  const templateParametersContent = await fs.readFile(
    path.join(ROOT_DIR, 'template-parameters.json')
  );
  const webPermissionsContent = await fs.readFile(
    path.join(ROOT_DIR, 'web-permissions.json')
  );
  const sandboxedJsContent = await fs.readFile(
    path.join(ROOT_DIR, 'template.js')
  );

  const templateContent = [
    '___INFO___',
    infoContent,
    '___TEMPLATE_PARAMETERS___',
    templateParametersContent,
    '___WEB_PERMISSIONS___',
    webPermissionsContent,
    '___SANDBOXED_JS_FOR_WEB_TEMPLATE___',
    sandboxedJsContent,
  ].join('\n\n');

  await fs.writeFile(DIST_PATH, templateContent);
}

build();
