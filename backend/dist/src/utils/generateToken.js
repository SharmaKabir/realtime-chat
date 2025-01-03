import jwt from 'jsonwebtoken';
const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    //maxage in ms
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //ms
        httpOnly: true, //prevent xss cross site scripting, not accesable by javascript!
        sameSite: "strict", // CSRF attack cross-site request forgery it means that the cookie will only be sent in requests originating from the same site that set the cookie. This helps prevent CSRF attacks by ensuring that cookies are not sent along with cross-site requests.
        /*CSRF attacks occur when a malicious website tricks a user's browser into making an unwanted request to another site where the user is authenticated. For example, if a user is logged into their bank account and visits a malicious site, the malicious site could attempt to perform actions on the bank's site usi*/
        secure: process.env.NODE_ENV !== "development", // HTTPS wehn in dev, http in localhost
    });
    return token;
};
export default generateToken;
