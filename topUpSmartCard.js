var casper = require('casper').create();

var fs = require('fs');
var personalData = JSON.parse(fs.read('cardData.json'));

casper.options.viewportSize = {width: 1024, height: 768};
var viewPort = {top: 0, left: 0, width: 1024, height: 768};

var SIMPLYBUS_URL = 'https://www.reading-busesshop.co.uk/ssp/readingbus/account.jsp?productId=3#login';
var USERNAME = personalData['credentials']['username'];
var PASSWORD = personalData['credentials']['password'];
var CARD_NUMBER = personalData['card']['number'];
var CARD_NAME = personalData['card']['name'];
var CARD_PIN = personalData['card']['pin'];
var CARD_MONTH = personalData['card']['month'];
var CARD_YEAR = personalData['card']['year'];

var months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12'
];

var years = [
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025'
];

casper.start(SIMPLYBUS_URL, function () {
    this.sendKeys('#loginISRN', USERNAME);
    this.sendKeys('#loginPassword', PASSWORD);
    this.click('#loginButton');
});

casper.then(function () {
    casper.waitForSelector('#chNames b', function () {
        this.wait(2000, function () {
            this.capture('step1.png', viewPort);
            this.echo(this.fetchText('#chNames b'));
            this.clickLabel('Top Up', 'a');
        });
    });
});

casper.then(function () {
    casper.waitUntilVisible('.optionClass', function () {
        this.wait(5000, function () {
            this.echo(this.fetchText('#ipeSelection td[colspan="3"]'));
            this.capture('step2.png', viewPort);
            this.echo(this.evaluate(function () {
                $('.optionClass')[0].selectedIndex = 1;
                return $('.optionClass').text();
            }));
            this.click('#checkOutButton');
        });
    });
});

casper.then(function () {
    casper.waitForSelector('#totalPaymentRyw', function () {
        this.echo('Total to be charged: ' + this.fetchText('#totalPaymentRyw'));
        this.click('#rywNext');
        this.capture('step3.png', viewPort);
    });
});

casper.then(function () {
    casper.waitForSelector('#paymentBox', function () {
        this.wait(1000, function () {
            this.sendKeys('#ccnumber', CARD_NUMBER);
            this.sendKeys('#ccname', CARD_NAME);
            this.sendKeys('#cccsc', CARD_PIN);
            this.echo(months.indexOf(CARD_MONTH));
            this.evaluate(function (monthIndex, yearIndex) {
                $('#ccmonth')[0].selectedIndex = monthIndex;
                $('#ccyear')[0].selectedIndex = yearIndex;
                $('#confirmBtn').click();
            }, {
                cardMonth: months.indexOf(CARD_MONTH),
                cardYear: years.indexOf(CARD_YEAR)
            });
            this.click('#confirmBtn');
            this.capture('step4.png', viewPort);
        });
    });
});

casper.then(function () {
    this.evaluate(function () {
        var iFrame = document.getElementById('3DSecureFrame').contentDocument;
        $(iFrame).find('form input[type="submit"]').click();
        this.capture('step5.png', viewPort);
    });
});

casper.then(function () {
    this.wait(30000, function () {
        this.echo('Waited for 10 secs');
        this.capture('step6.png', viewPort);
    });
});

casper.setFilter('page.confirm', function (msg) {
    this.echo(msg);
    return true;
});

casper.setFilter('remote.alert', function (msg) {
    this.echo(msg);
    return true;
});

casper.run();
