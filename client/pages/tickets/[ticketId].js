import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const TicketView = ({ ticket }) => {
  const { doRequest, errors } = useRequest(
    {
      url: '/api/orders',
      method: 'post',
      body: {
        ticketId: ticket.id,
      },
    },
    (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`),
  );
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>{ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className='btn btn-primary'>
        Purchase
      </button>
    </div>
  );
};

TicketView.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketView;
