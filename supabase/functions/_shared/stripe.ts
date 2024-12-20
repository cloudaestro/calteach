import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

export const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2022-11-15',
})