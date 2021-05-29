## To Run BackEnd 
 - Go to Backend directory and run `nodemon start`
 - Open another instance of backend directory in Terminal and run `ngrok http 3001`
 - Now go to https://dashboard.razorpay.com/app/webhooks
 - Now paste the ngrok tunnel url address in Webhook URL as `ngrok_url/verification`

## To Run FrontEnd 
 - Go to front end directory and run `npm start`
 - Now click on Donate button add dummy card detail number `4111111111111111` and expiry date any future date and any number as cvv.