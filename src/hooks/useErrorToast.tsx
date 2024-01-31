import { toast, ToastOptions } from 'react-toastify';
import styled from 'styled-components';

const ErrorComponent = styled.div`
  display: flex;
  align-items: flex-end;
`;

const Text = styled.div`
  margin-left: 16px;
  font-size: 12px;
  color: #f4f6f8;
`;

export default function useErrorToast() {
  const options: ToastOptions = {
    position: 'bottom-left',
    autoClose: 6000,
    closeButton: false,
    hideProgressBar: true,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    closeOnClick: true,
    delay: 250,
  };

  return {
    toast: (text: string) =>
      toast.error(
        <ErrorComponent>
          <Text>{text}</Text>
        </ErrorComponent>,
        options,
      ),
    dismiss: toast.dismiss.bind(toast),
  };
}
