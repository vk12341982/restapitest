Router.configureBodyParsers = function () {
    Router.onBeforeAction(Iron.Router.bodyParser.json(), { except: ['creditReferral'], where: 'server' });
    Router.onBeforeAction(Iron.Router.bodyParser.raw({ type: '*/*', only: ['creditReferral'], verify: function (req, res, body) { req.rawBody = body.toString(); }, where: 'server' }));
    Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({ extended: false }), { where: 'server' });
};



if(Meteor.isServer) {
   //on meteorstart create the nosql collection if it doesnt exist
    Meteor.startup(function () {
        PhoneNums = new Meteor.Collection('phonenums');
    });

    // GET /sms promotion - return all from mongodb

    Router.route('/api/sms-promotion', { where: 'server' })
    .get(function () {
        var response = PhoneNums.find().fetch();
        this.response.setHeader('Content-Type', 'application/json');
        this.response.end(JSON.stringify(response));
    })

    // POST
    // Add new phonenum in MongoDB.

    .post(function () {
        var response;
        console.log(this.request.rawBody);
        var requestResult = this.request.rawBody;
        var proceed = true;
        try {
            requestResult = JSON.parse(this.request.rawBody)
        }
        catch (e) {
            console.log(e);
            response = {
                "error": true,
                "message": "Error message(ErrorCode0)"
            };
            proceed = false;
        }
        if (proceed) {
            if (requestResult.phone === undefined) {
                response = {
                    "error": true,
                    "message": "Error message (ErrorCode1)"
                };
            } else {
                PhoneNums.insert({
                    phonenum: requestResult.phone
                });

                var smsmessage = GetSmsMessage();
                SendSms(requestResult.phone,smsmessage);
                response = {
                    "error": false,
                    "message": "Success message (SuccessCode1)"
                }
            }
        }

        this.response.setHeader('Content-Type', 'application/json');
        this.response.end(JSON.stringify(response));
    });


    function GetSmsMessage() {
        var currentHours = (new Date()).getHours();
        if (currentHours < 12) {
            return 'Good morning! Your promocode is AM123';
        } else {
        return 'Hello! Your promocode is PM456';
        }
}

function SendSms(phone, text) {
console.log("twilio");
console.log(phone);
console.log(text);
    // Twilio Credentials
const accountSid = 'ACf1fe39138458ad09fb7318d390684e1b';
const authToken = 'e031376304647a47aadcd60231660a36';
// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);
client.messages
  .create({
    to: phone,
    from: '+35722051984',
    body: text,
    mediaUrl: 'https://climacons.herokuapp.com/clear.png',
  })
  .then((message) => console.log(message.sid));


}
  }
