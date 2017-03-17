//Pyramid of Doom or Callback Hell
wakeup(function(alarm, callback) {
    haveBreakfast(function(eggs) {
        gotoOffice(function(car) {
            writeCode(function(scrum, meeting, task) {
                haveLunch(function(whereToEat) {
                    writeMoreCode(function(moretasks) {
                        gobackHome(function(car) {
                            haveDinner(function(isItReady) {
                                watchTV(function(phew) {
                                    return calback('done with the day'));
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})