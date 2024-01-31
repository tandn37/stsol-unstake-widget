import { CookieThemeProvider, LightThemeProvider, ThemeName } from '@lidofinance/lido-ui';
import GlobalStyle from './global';

export const AppTheme = ({ children }) => (
  <CookieThemeProvider initialThemeName={ThemeName.light} overrideThemeName={ThemeName.light}>
    <GlobalStyle />
    <LightThemeProvider>{children}</LightThemeProvider>
  </CookieThemeProvider>
);
