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

    // Pyramid for Promise chaining. Not a big one though :)
    generateToken.then(function (clientToken) {
        getPaymentMethods.then(function (paymentMethods) {
            calculateSubscriptionPrice.then(function (price) {
                res.render('subscribe', {
                    braintreetoken: clientToken, paymentMethods: paymentMethods,
                    price: price
                });
            }).catch(function (reason) {
                log.error(new Error(reason));
                res.render('subscribe', { errors: [{ msg: reason }], braintreetoken: clientToken });
            });
        });
    }).catch(function (reason) {
        log.error(new Error(reason));
        res.render('subscribe', { errors: [{ msg: reason }] });
    });
});