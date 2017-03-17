router.get('/subscribe', checkAuthentication, function (req, res) {
	req.app.locals.title = 'Subscribtion';
	req.app.locals.activePage = 'subscribe';
	btManager.generateClientToken(function (err, clientToken) {
		if (err) {
			log.error(new Error(err));
			res.render('subscribe', { errors: [{ msg: err }] });
			return;
		}
		if (req.app.locals.user.subscribed) {
			btManager.getPaymentMethods(req.app.locals.user.email, function (err, paymentMethods) {
				if (err) {
					log.error(new Error(err));
					res.render('subscribe', { errors: [{ msg: err }], braintreetoken: clientToken });
					return;
				}
				btManager.calculateSubscriptionPrice(req.app.locals.user.email, function (err, price) {
					res.render('subscribe', {
						braintreetoken: clientToken, paymentMethods: paymentMethods,
						price: price
					});
				});
			});
		} else {
			res.render('subscribe', { braintreetoken: clientToken });
		}
	});
});