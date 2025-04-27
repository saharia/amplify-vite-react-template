import { useSnackbar } from 'notistack';

const useNotificationAlert = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSuccessNotification = (message: string) => {
    enqueueSnackbar(message, { variant: 'success' });
  };

  const showErrorNotification = (message: string) => {
    enqueueSnackbar(message, { variant: 'error' });
  };

  return {
    showSuccessNotification,
    showErrorNotification,
  };
};

export default useNotificationAlert;