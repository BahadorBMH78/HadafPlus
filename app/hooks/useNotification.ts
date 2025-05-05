"use client"

import { App } from 'antd';

export const useNotification = () => {
  const { notification } = App.useApp();

  return {
    success: (message: string, description: string) => {
      notification.success({
        message,
        description,
        placement: 'topRight',
        duration: 3,
      });
    },
    error: (message: string, description: string) => {
      notification.error({
        message,
        description,
        placement: 'topRight',
        duration: 3,
      });
    },
  };
}; 