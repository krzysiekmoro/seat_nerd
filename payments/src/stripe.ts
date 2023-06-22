import Stripe from 'stripe';
import 'dotenv/config';

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2022-11-15',
});
