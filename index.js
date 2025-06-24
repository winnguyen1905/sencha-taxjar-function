import Taxjar from 'taxjar';

export default async ({ req, res }) => {
    try {
        const { to_zip, to_state, amount, shipping = 0 } = JSON.parse(req.body);

        const client = new Taxjar({ apiKey: process.env.TAXJAR_API_KEY });

        const { tax } = await client.taxForOrder({
            from_country: 'US',
            from_state: 'CA',   // <- your nexus
            from_zip: '94111',
            to_country: 'US',
            to_zip,
            to_state,
            amount,
            shipping,
        });

        return res.json({
            salesTax: tax.amount_to_collect,
            rate: tax.rate,
        });
    } catch (error) {
        return res.status(200).json({ error: error.message });
    }
};