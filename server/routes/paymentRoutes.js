// routes/paymentRoutes.js
const stripe = require('stripe')(process.env.STRIPE_SECRET);

router.post('/create-payment-intent', auth, async (req, res) => {
  const { amount } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // cents
    currency: 'usd',
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});