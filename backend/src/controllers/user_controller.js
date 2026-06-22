const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const getUsers = async (req,res)=>{
   const users = await prisma.user.findMany({
        include:{
            role: true,
            houses: true,
             rentedHouses: true
        }
   })
   res.status(200).json({"data": users});
}
const getUser = async(req,res)=>{
    const id = req.params.id;
    const user = await prisma.user.findFirst({
        where:{
            id:id
        }
    })
    res.status(200).json({"data":user})
}

const createUser = async (req,res)=>{
    const user = await prisma.user.create({
        data:{
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            roleId: req.body.roleId,
        }
    })
    res.status(201).json({"data": user});
}
const loginUser = async (req,res)=>{
    const user = await prisma.user.findUnique({
        where:{
            email: req.body.email
        }
    })
    if(!user){
        return res.status(404).json({message: "User not found"});
    }
    const isPasswordValid = await bcrypt.compare(req.body.password,user.password);
    if(!isPasswordValid){
        return res.status(401).json({message: "Invalid password"});
    }
    const token = jwt.sign({userId: user.id}, process.env.SECRET, {expiresIn: '1h'});
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({message: "Login successful", token, user});
}
const logoutUser = async (req,res)=>{
    res.setHeader('Authorization', '');
    res.status(200).json({message: "Logout successful"});
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    loginUser,
    logoutUser
};