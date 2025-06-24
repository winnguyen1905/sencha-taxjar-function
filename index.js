import Taxjar from 'taxjar';

export default async ({ req, res, log, error }) => {
  try {
    // Log the request body to see what it contains
    log("1 Request body:", req.body);

    // Ensure the request body is not empty
    if (!req.body || req.body.trim() === "") {
      throw new Error("2 Request body is empty.");
    }

    // Try parsing the request body safely
    const { to_zip, to_state, amount, shipping = 0 } = JSON.parse(req.body);

    log("3: ", to_zip, to_state, amount, shipping);

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

    log("4: ", response); // Debugging the response

    // Check if response contains the expected 'tax' object
    if (response && response.tax) {
      const { tax } = response;

      // Send response as JSON using Appwrite's context.response.send
      return res.json({
        salesTax: tax.amount_to_collect,
        rate: tax.rate,
      });
    } else {
      // Handle the case where the response does not contain the expected data
      log("5: Tax information not found in Taxjar response."); // Debugging missing tax info
      return res.json({
        error: 'Invalid response from Taxjar API. No tax information found.',
      });
    }
  } catch (error) {
    // Catch any errors and return them as a JSON response
    log("6: Error occurred:", error); // Debugging the error
    return res.json({
      error: error.message,
    });
  }
};
