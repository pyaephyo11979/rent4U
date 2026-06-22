const checkRole = (requiredRole) =>{
    return (req,res,next) =>{
        const userRole = req.user.role;
        if(userRole !== requiredRole){
            return res.status(403).json({message: "Forbidden: You are not authorized to access this resource"});
        }
    }
}