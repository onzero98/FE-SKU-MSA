import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (type, message, options = {}) => {
  const defaultOptions = {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const finalOptions = { ...defaultOptions, ...options };

  if (type === 'error') {
    toast.error(message, finalOptions);
  } else if (type === 'success') {
    toast.success(message, finalOptions);
  } else if (type === 'info') {
    toast.info(message, finalOptions);
  } else {
    toast(message, finalOptions);
  }
};
