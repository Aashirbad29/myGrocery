import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            req.userId = tokenDecode.id;  // Ensure that the decoded user ID is assigned to req.userId
            console.log('Decoded Token:', tokenDecode); // Log tokenDecode for debugging
            next();
        } else {
            return res.json({ success: false, message: 'Invalid Token' });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export default authUser;
