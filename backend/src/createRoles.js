const prisma = require('./utils/prisma');
const createRoles = async ()=>{
    const roles = [
        {name: "Admin"},
        {name: "Host"},
        {name: "User"},
    ]
    for(const role of roles){
        await prisma.role.create({
            data: role
        })
    }
    console.log("Roles created successfully");
}

createRoles();