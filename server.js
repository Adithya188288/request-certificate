var express = require('express');
var app = express();

var allDomains = {
        'testcdn.ml':['testcdn.ml','www.testcdn.ml','app.testcdn.ml']
}


var Greenlock = require('greenlock');

var greenlock = Greenlock.create({
    packageRoot: __dirname,
    maintainerEmail:'adithyawordpress05@gmail.com',
    configDir: "../certs",
    staging: true,
    notify: function(event, details) {
        if ('error' === event) {
            // `details` is an error object in this case
            console.error(details);
        }
    }
});


greenlock.manager
    .defaults({
        agreeToTerms: true,
        subscriberEmail: 'adithyawordpress05gmail.com'
    })
    .then(function(fullConfig) {
        console.log('gg', fullConfig)
    });


app.get('/', (req, res) => {
    let domain = req.query.domain;
    let subdomain = req.query.subdomain;
    let currentDomains = allDomains[domain];
    
    if(!currentDomains){
        allDomains[domain] = [domain, subdomain];
    }else if(currentDomains.indexOf(subdomain) === -1) {
        currentDomains.push(subdomain);
        allDomains[domain] = currentDomains
    }
    greenlock
        .add({
            subject: currentDomains[0],
            altnames: currentDomains,
            subscriberEmail:'adithyawordpress05@gmail.com'
        })
        .then(function() {
            res.send('saved')
            // saved config to db (or file system)
        });
})    

app.listen(5000, () => console.log('started...'))