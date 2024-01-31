const DEFAULT_CONNECTION_ERROR_TEXT = 'Could not connect to wallet, please try again.';

const unreadableError = [`Cannot read properties of undefined (reading '_bn')`];

export const getErrorConnectionText = (message) => {
  if (unreadableError.includes(message)) {
    return DEFAULT_CONNECTION_ERROR_TEXT;
  }

  return message || DEFAULT_CONNECTION_ERROR_TEXT;
};
