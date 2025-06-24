import Taxjar from 'taxjar';

export default async ({ req, res }) => {
  try {
    // Parse the body of the request
    const { to_zip, to_state, amount, shipping = 0 } = JSON.parse(req.body);

    // Initialize Taxjar client
    const client = new Taxjar({ apiKey: process.env.TAXJAR_API_KEY });

    // Calculate tax using Taxjar API
    const response = await client.taxForOrder({
      from_country: 'US',
      from_state: 'CA',   // Use your nexus state
      from_zip: '94111',   // Use your nexus zip
      to_country: 'US',
      to_zip,
      to_state,
      amount,
      shipping,
    });

    // Check if response contains the expected 'tax' object
    if (response && response.tax) {
      const { tax } = response;

      // Send response as JSON
      res.send({
        salesTax: tax.amount_to_collect,
        rate: tax.rate,
      });
    } else {
      // Handle the case where the response does not contain the expected data
      res.send({
        error: 'Invalid response from Taxjar API. No tax information found.',
      });
    }

    // Ensure you explicitly return the response to satisfy Appwrite's function handler
    return res;
  } catch (error) {
    // Catch any errors and return them as a JSON response
    res.send({
      error: error.message,
      client: client
    });

    // Ensure you explicitly return the response to satisfy Appwrite's function handler
    return res;
  }
};
