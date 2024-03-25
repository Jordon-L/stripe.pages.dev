import Stripe from 'stripe';


function createStripeClient(apiKey) {
	new Stripe(apiKey, {
    apiVersion: '2023-10-16',
  });
}

export async function onRequestPost(context) {
  console.log('test');
  const stripe = createStripeClient(context.env.STRIPE_API_KEY);
  const { origin } = new URL(request.url);
	/*
	 * Sample checkout integration which redirects a customer to a checkout page
	 * for the specified line items.
	 *
	 * See https://stripe.com/docs/payments/accept-a-payment?integration=checkout.
	 */
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: {
						name: "T-shirt",
					},
					unit_amount: 2000,
				},
				quantity: 1,
			},
		],
		mode: "payment",
		success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${origin}/canceled`,
	});
	return Response.redirect(session.url, 303);
}

// app.post("/api/webhook", async (context) => {
// 	const stripe = createStripeClient(context.env.STRIPE_API_KEY);
// 	const signature = context.req.raw.headers.get("stripe-signature");
// 	try {
// 		if (!signature) {
// 			return context.text("", 400);
// 		}
// 		const body = await context.req.text();
// 		const event = await stripe.webhooks.constructEventAsync(
// 			body,
// 			signature,
// 			context.env.STRIPE_WEBHOOK_SECRET,
// 			undefined,
// 			Stripe.createSubtleCryptoProvider()
// 		);
// 		switch (event.type) {
// 			case "payment_intent.created": {
// 				console.log(event.data.object);
// 				break;
// 			}
// 			default:
// 				break;
// 		}
// 		return context.text("", 200);
// 	} catch (err) {
// 		const errorMessage = `⚠️  Webhook signature verification failed. ${
// 			err instanceof Error ? err.message : "Internal server error"
// 		}`;
// 		console.log(errorMessage);
// 		return context.text(errorMessage, 400);
// 	}
// });

// export default app;
