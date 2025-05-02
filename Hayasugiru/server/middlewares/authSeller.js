import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
    const { sellerToken } = req.cookies;

    if (!sellerToken) {
        return res.json({ success: false, message: 'Not Authorized' });
    }

    try {
        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

        if (decoded.email === process.env.SELLER_EMAIL) {
            req.user = decoded; // optional, useful if you want to access seller info later
            return next();
        } else {
            return res.json({ success: false, message: 'Invalid Seller Credentials' });
        }
    } catch (error) {
        return res.json({ success: false, message: 'Invalid or Expired Token' });
    }
};

export default authSeller;
