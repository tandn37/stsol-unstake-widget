import { UAParser } from 'ua-parser-js';

const parser = new UAParser();

const os = parser.getOS();

const browser = parser.getBrowser();

const device = parser.getDevice();

export const isIOS = os.name === 'iOS';

export const isAndroid = os.name === 'Android';

export const isWebView = browser.name === 'Chrome WebView';

export const isMobile = device.type === 'mobile';

export const isTablet = device.type === 'tablet';

export const isMobileOrTablet = isMobile || isTablet;
