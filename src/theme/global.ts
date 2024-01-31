import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
    font-family: 'Manrope', 'Times New Roman', Times, serif;
    margin: 0px;
  }
  html {
    font-size: 16px;
    line-height: 20px;
    overflow-x: hidden;
  }
  body {
    background-color: #F4F6F8;
    margin: 0;
    color: #0C141D;
    position: relative;
    overflow: hidden;
  }
  ul, ol {
    margin: 16px 0;
    padding-left: 16px;
  }
  li p {
    margin-top: 16px;
  }
  li:not(:last-of-type) p {
    margin-bottom: 16px;
  }
  strong {
    font-weight: 500
  }
`;

export default GlobalStyle;
