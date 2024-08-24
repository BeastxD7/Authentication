import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

		req.userId = decoded.userId;
		next();
	} catch (error) {
		console.log("Error in verifyToken ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};



// import jwt from 'jsonwebtoken';

// export const verifyToken = async (req, res, next) => {

//     const token = req.cookies.token;
    
//     if(!token) {
//         res.status(401).json({success:false, message:'Unauthorized - no token'});
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if(!decoded) {
//             res.status(401).json({success:false, message:'Unauthorized - invalid token'});
//         }
//         req.userId = decoded.userId; 
//         next();

//     } catch (error) {
//         console.error('Error in verifyToken: ', error.message);
//         res.status(401).json({success:false, message:error.message});
//     }
// };

