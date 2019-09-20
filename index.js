const querystring = require('querystring');
const axios = require('axios');

function getAllPriceData() {
    return axios.get('https://blockchain.info/ticker')
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.log(error);
   });
}

async function formattedPrice(ticker){
    try {
        var allprices = await getAllPriceData();
		var result = "not found";
		if (allprices[ticker]){
			result = allprices[ticker].symbol + allprices[ticker].last
		}
        return result;
    }
    catch(error){
        return error
    }
}

exports.handler = async(event) => {
    const res = {
        statusCode: 200,
        body: ""
    };
    const params = querystring.parse(event.body);
    if (process.env.VERIFICATION_TOKEN !== params.token){
        res.statusCode = 401;
        res.body = "Unauthorized";
        return res
    }
    res.statusCode = 200;	
    res.body = await formattedPrice(params.text);
    return res;
};