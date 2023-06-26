import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const OrderView = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest(
    {
      url: '/api/payments',
      method: 'post',
      body: {
        orderId: order.id,
      },
    },
    () => Router.push('/orders'),
  );

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return timeLeft > 0 ? (
    <div>
      <p>Time left to pay: {timeLeft} seconds</p>
      {errors}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51NJZBNCcPKPAocU8eFf0SszcggHvJTpzDj2vOHTGf5c7rYnUMQgHGKfKsSP0ztnK9KKCXeAYjC01mTDQfMC2AkNP003VboV17w'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  ) : (
    <div>Order Expired</div>
  );
};

OrderView.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderView;
