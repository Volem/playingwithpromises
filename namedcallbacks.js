router.get('/subscribe', checkAuthentication, function (req, res) {
	req.app.locals.title = 'Subscribtion';
	req.app.locals.activePage = 'subscribe';
	btManager.generateClientToken(generateTokenCallback.bind({
		req: req,
		res: res
	}));
});

function generateTokenCallback(err, clientToken) {
	if (err) {
		log.error(new Error(err));
		this.res.render('subscribe', { errors: [{ msg: err }] });
		return;
	}
	if (this.req.app.locals.user.subscribed) {
		btManager.getPaymentMethods(this.req.app.locals.user.email,
			getPaymentsCallback.bind({
				req: this.req,
				res: this.res,
				clientToken: clientToken
			}));
	} else {
		this.res.render('subscribe', { braintreetoken: clientToken });
	}
}

function getPaymentsCallback(err, paymentMethods) {
	if (err) {
		log.error(new Error(err));
		this.res.render('subscribe', { errors: [{ msg: err }], braintreetoken: this.clientToken });
		return;
	}
	btManager.calculateSubscriptionPrice(this.req.app.locals.user.email,
		calculateSubscriptionCallback.bind(
			{
				req: this.req,
				res: this.res,
				clientToken: this.clientToken,
				paymentMethods: paymentMethods
			}));
}

function calculateSubscriptionCallback(err, price) {
	this.res.render('subscribe', {
		braintreetoken: this.clientToken, paymentMethods: this.paymentMethods,
		price: price
	});
}