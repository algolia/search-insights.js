# Search Insights for Google Tag Manager (GTM)

Google Tag Manager connector for Algolia Search Insights.

## Documentation

Head over our [Getting Insights and Analytics / Google Tag Manager](https://www.algolia.com/doc/guides/getting-insights-and-analytics/connectors/google-tag-manager/) documentation.

## Contributing

Before working on the project, make sure to **disable any ad blockers**.

### Folder structure

The source for the GTM template is in the [`src/`](src) folder and gets generated in the [`generated/`](generated) folder.

### Commands

#### `build`

> Builds the GTM template into the [`generated/`](generated) folder.

Each section of the custom template is in the [`src/`](src) folder. This command compiles the files into a GTM template in [`generated/`](generated).

#### `dev`

> Runs the [`build`](#build) command in watch mode.

### Releasing

The `TEMPLATE_VERSION` variable in the [sandboxed JavaScript](src/template.js) should be incremented for each change. This variable is used to send usage metrics to Algolia.

To release a new version:

- Run the `build` command to update the [generated template](generated/search-insights.tpl)
- Update the [changelog](CHANGELOG.md) manually
- Commit it to GitHub

For users to update the template, they need to download it again and to reimport it in the GTM interface (they won't lose their configuration).

## Credits

Thanks to [David Vallejo](https://www.thyngster.com/) for his initial work on the custom template.

## License

MIT
