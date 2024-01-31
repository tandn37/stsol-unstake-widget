type DeepLinkParams = {
  pageUrl: string;
  refUrl: string;
};
type DeepLinkKeys = keyof DeepLinkParams;

export function deepLink(strings: TemplateStringsArray, ...keys: DeepLinkKeys[]) {
  return (values: DeepLinkParams) => {
    const result = [strings[0]];
    keys.forEach((key, i) => {
      const value = values[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
}

export function getDeepLink(fn: ReturnType<typeof deepLink>) {
  const pageUrl = encodeURIComponent(window.location.href);
  const refUrl = encodeURIComponent(window.location.origin);
  return fn({ pageUrl, refUrl });
}
