import { memo } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import SolanaProvider from '@/contexts/SolanaProvider';
import { ErrorProvider } from '@/contexts/ErrorProvider';
import ModalProvider, { Modals } from '@/contexts/modals';
import AppTheme from '@/theme';
import { ToastContainer } from '@lidofinance/lido-ui';
import Page from './Page';

const MemoPage = memo(Page);

const AppWrapper = () => (
  <AppTheme>
    <ModalProvider>
      <ErrorProvider>
        <SolanaProvider>
          <ToastContainer />
          <MemoPage />
          <Modals />
        </SolanaProvider>
      </ErrorProvider>
    </ModalProvider>
  </AppTheme>
);

export default AppWrapper;
