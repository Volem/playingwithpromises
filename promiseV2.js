router.get('/subscribe', checkAuthentication, function (req, res) {
req.app.locals.title = 'Subscribtion';
req.app.locals.activePage = 'subscribe';
var generateToken = new Promise(function (resolve, reject) {
	btManager.generateClientToken(function (err, clientToken) {
		if (err) {
			reject(err);
		} else {
			resolve(clientToken);
		}
	});
});

var getPaymentMethods = new Promise(function (resolve, reject) {
	btManager.getPaymentMethods(req.app.locals.user.email, function (err, paymentMethods) {
		if (err) {
			reject(err);
		} else {
			resolve(paymentMethods);
		}
	});
});

var calculateSubscriptionPrice = new Promise(function (resolve, reject) {
	btManager.calculateSubscriptionPrice(req.app.locals.user.email, function (err, price) {
		if (err) {
			reject(err);
		} else {
			resolve(price);
		}
	});
});

var scope = {};
Promise.resolve(generateToken)
	// No more pyramids :)
    .then(function (token) {
        scope.clientToken = token;
        return getPaymentMethods;
    })
    .then(function (paymentMethods) {
        scope.paymentMethods = paymentMethods;
        return calculateSubscriptionPrice;
    })
    .then(function (price, dfd, dfd, d) {
        res.render('subscribe', {
            braintreetoken: scope.clientToken,
            paymentMethods: scope.paymentMethods,
            price: price
        });
    }).catch(function (reason) {
        log.error(new Error(reason));
        res.render('subscribe', { errors: [{ msg: reason }] });
    });
});