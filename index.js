import Taxjar from 'taxjar';

export default async ({ req, res, log, error }) => {
    try {
        // Parse the body of the request
        log("0: ", req);
        const { to_zip, to_state, amount, shipping = 0 } = JSON.parse(req.body);

        if (!to_zip || !to_state || !amount) {
            log("1: ", "Missing required parameters.");
            return res.send({
                error: 'Missing required parameters.',
            });
        }

        // Initialize Taxjar client
        const client = new Taxjar({ apiKey: process.env.TAXJAR_API_KEY });

        if (!client) {
            log("2: ", "Taxjar client not initialized.");
            return res.send({
                error: 'Taxjar client not initialized.',
            });
        }

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
            log("3: ", "Taxjar response: ", response);
            const { tax } = response;

            // Send response as JSON
            return res.send({
                salesTax: tax.amount_to_collect,
                rate: tax.rate,
            });

        } else {
            log("4: ", "Invalid response from Taxjar API. No tax information found.");
            return res.send({
                error: 'Invalid response from Taxjar API. No tax information found.',
            });
        }

    } catch (err) {
        log("5: ", err);
        // Catch any errors and return them as a JSON response
        return res.send({
            error: err.message,  // Just send the error message, no need for the client object
        });
    }
};
