'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import useUserInfoStore from '@/store/useUserInfoStore';

import { PAYMENT_INFO_KEY, PAYMENT_INFO_TYPE } from '@/lib/constants';

import useUpdateUserInfo from './useUpdateUserInfo';

export default function useCheckPaymentAndUpdateUserinfo() {
  const onceRef = useRef(true);
  const searchParams = useSearchParams();
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const { updateUserInfo } = useUpdateUserInfo();

  const checkPayment = async () => {
    if (userInfo && searchParams?.get(PAYMENT_INFO_KEY) === PAYMENT_INFO_TYPE && onceRef.current) {
      onceRef.current = false;
      await updateUserInfo();
    }
  };

  useEffect(() => {
    checkPayment();
  }, [userInfo]);
}
