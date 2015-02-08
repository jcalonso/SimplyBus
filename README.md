# SimplyBus Top up script

This script automates the process of topping up your (Reading bus smart card 
[simplyBus](http://www.reading-buses.co.uk/smartcard/).
It uses [CasperJs](https://casperjs.org) to interact with the front end.

## Requirements

* PhantomJs
* CasperJs
* SlimerJs and Firefox (optional if you want to have a browser view)

## Installation

1. Create a copy of the cardData.json.dist `cp cardData.json.dist cardData.json`
2. Edit the `cardData.json` and fill in with your details. card.month should be in mm format and card.year in yyyy
3. Run the script: `casperjs topUpSmartCard.js`

After running the script it will output some screen shots of the process and some console information.

You should receive a confirmation email after the process has been completed.

## Development

If you want to debug the script and see what is it doing in the background use SlimerJs as engine, like this:

`casperjs topUpSmartCard.js --engine=slimerjs --ssl-protocol-any`