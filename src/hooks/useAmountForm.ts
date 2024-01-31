import { lamportsToSol, lamportsToSolUp, solToLamports } from '@lidofinance/solido-sdk';
import { useFormik } from 'formik';
import { FormikConfig, FormikValues } from 'formik/dist/types';
import * as yup from 'yup';

interface AmountFormValues {
  maxAmount: number;
  minAmount: number;
  walletConnected: boolean;
  requiredBalance?: number;
}

export default function useAmountForm<Values extends FormikValues = FormikValues>({
  maxAmount,
  minAmount = null,
  requiredBalance = 0,
  walletConnected,
  ...formikProps
}: AmountFormValues & FormikConfig<Values>) {
  const validationSchema = yup.object().shape({
    amount: yup
      .string()
      .test('walletConnected', 'Please connect your wallet', () => walletConnected)
      .required('Amount is required')
      .test(
        'isNumber',
        'Amount must be a number',
        (amount) => !Number.isNaN(+amount) && Number.isFinite(+amount) && !amount.includes('e'),
      )
      .test('notNegative', 'Amount must not be negative', (amount) => +amount >= 0)
      .test(
        'notGreaterThanMax',
        `Amount must not exceed MAX(${lamportsToSol(maxAmount)})`,
        (amount) => solToLamports(+amount) <= maxAmount,
      )
      .test(
        'notLessThanMin',
        `Amount must be greater than rent-exempt fee(${lamportsToSolUp(minAmount)})`,
        (amount) => (minAmount !== null && +amount > 0 ? solToLamports(+amount) > minAmount : true),
      )
      .test(
        'haveSufficientSolBalance',
        `Insufficient SOL balance. To make a transaction it is required to have ${lamportsToSol(
          requiredBalance,
        )} SOL in your account.`,
        () => !requiredBalance,
      ),
  });

  return useFormik({
    validationSchema,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: true,
    enableReinitialize: true,
    initialValues: {},
    onSubmit: () => null,
    ...formikProps,
  });
}
