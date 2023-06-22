import { useEffect } from 'react';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const SignOut = () => {
  const { doRequest } = useRequest(
    {
      url: '/api/users/signout',
      method: 'post',
    },
    () => Router.push('/'),
  );

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing out...</div>;
};

export default SignOut;
