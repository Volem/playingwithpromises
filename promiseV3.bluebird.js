var Promise = require("bluebird");

router.get('/subscribe', checkAuthentication, function (req, res) {
req.app.locals.title = 'Subscribtion';
req.app.locals.activePage = 'subscribe';
// Create promise version of all our methods to a promise. We don't need to define our promises. 
btManager = Promise.promisifyAll(btManager);

// Join all our callbacks. No need to use scope variable to access our results.
Promise.join(
	// Our methods are still there but by default bluebird created the <methodname>Async versions of them
	btManager.generateClientTokenAsync(),	// Step 1
	btManager.getPaymentMethodsAsync(req.app.locals.user.email),	// Step 2
																		
	btManager.calculateSubscriptionPriceAsync(req.app.locals.user.email),  // And Step 3
	// this our last then :) All values returned by our callbacks are in order here. Wooww :)
	function (clientToken, paymentMethods, price) {
		res.render('subscribe', {
			braintreetoken: clientToken,
			paymentMethods: paymentMethods,
			price: price
		});
	}).catch(function (reason) {
		log.error(new Error(reason));
		res.render('subscribe', { errors: [{ msg: reason }] });
	});
});