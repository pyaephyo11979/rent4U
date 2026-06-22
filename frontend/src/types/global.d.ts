export {}
declare global {
    type User = {
        id:number,
        name:string,
        username:string,
        roleId:number,
        email:string,
        profilePicture:string,
        password:string,
        createdAt:Date,
        updatedAt:Date,
        houses:House[],
        role:Role
    }
    type Role = {
        id:number,
        name:string,
        createdAt:Date,
        updatedAt:Date,
        users:User[]
    }
    type House = {
        id:number,
        name:string,
        city:string,
        address:string,
        price:number,
        description:string,
        rooms:number,
        images:Image[],
        bathrooms:number,
        dateAvailable:Date,
        rented:boolean,
        rentedById:number,
        rentedBy:User,
        ownerId:number,
        owner:User,
        isAvailable:boolean,
        createdAt:Date,
        updatedAt:Date
    }
    type Image = {
        id:number,
        url:string,
        houseId:number,
        house:House
    }
}