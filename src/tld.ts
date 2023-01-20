import cookie from "js-cookie";

/**
 * Levels returns all levels of the given url.
 */
function levels(url: URL): Array<string> {
  const host = url.hostname;
  const parts = host.split(".");
  const last = parts[parts.length - 1];
  const levels: Array<string> = [];

  // Ip address.
  if (parts.length === 4 && parseInt(last, 10) > 0) {
    return levels;
  }

  // Localhost.
  if (parts.length <= 1) {
    return levels;
  }

  // Create levels.
  for (let i = parts.length - 2; i >= 0; --i) {
    levels.push(parts.slice(i).join("."));
  }

  return levels;
}

function parseUrl(url: string) {
  try {
    return new URL(url);
  } catch {
    return;
  }
}

export function tld(url: string) {
  const parsedUrl = parseUrl(url);
  if (!parsedUrl) return;

  const lvls = levels(parsedUrl);

  // Lookup the real top level one.
  for (const domain of lvls) {
    const cname = "__tld__";
    const opts = { domain: "." + domain };

    try {
      // cookie access throw an error if the library is ran inside a sandboxed environment (e.g. sandboxed iframe)
      cookie.set(cname, "1", opts);
      if (cookie.get(cname)) {
        cookie.remove(cname, opts);
        return domain;
      }
    } catch (_) {
      return;
    }
  }
}
