import Taxjar from 'taxjar';

export default async (context) => {
  try {
    // Log the request body to see what it contains
    console.log("Request body:", context.request.body);

    // Ensure the request body is not empty
    if (!context.request.body || context.request.body.trim() === "") {
      throw new Error("Request body is empty.");
    }

    // Try parsing the request body safely
    const { to_zip, to_state, amount, shipping = 0 } = JSON.parse(context.request.body);

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

    console.log("Taxjar response:", response); // Debugging the response

    // Check if response contains the expected 'tax' object
    if (response && response.tax) {
      const { tax } = response;

      // Send response as JSON using Appwrite's context.response.send
      return context.response.send({
        salesTax: tax.amount_to_collect,
        rate: tax.rate,
      });
    } else {
      // Handle the case where the response does not contain the expected data
      console.log("Tax information not found in Taxjar response."); // Debugging missing tax info
      return context.response.send({
        error: 'Invalid response from Taxjar API. No tax information found.',
      });
    }
  } catch (error) {
    // Catch any errors and return them as a JSON response
    console.error("Error occurred:", error); // Debugging the error
    return context.response.send({
      error: error.message,
    });
  }
};
