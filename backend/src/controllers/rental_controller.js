const prisma = require('../prisma');

const getAllRentals = async (req,res) =>{
    try{
        const query = req.query;
        if(query && query.limit){
            const limit = parseInt(query.limit);
            if(isNaN(limit) || limit <= 0){
                return res.status(400).json({error: "Invalid limit parameter"});
            }
            const rentals = await prisma.rental.findMany({
                take: limit
            });
            return res.status(200).json(rentals);
        }
        if(query && query.offset){
            const offset = parseInt(query.offset);
            if(isNaN(offset) || offset < 0){
                return res.status(400).json({error: "Invalid offset parameter"});
            }
            const rentals = await prisma.rental.findMany({
                skip: offset
            });
            return res.status(200).json(rentals);
        }
        if(query && query.limit && query.offset){
            const limit = parseInt(query.limit);
            const offset = parseInt(query.offset);
            if(isNaN(limit) || limit <= 0 || isNaN(offset) || offset < 0){
                return res.status(400).json({error: "Invalid limit or offset parameter"});
            }
            const rentals = await prisma.rental.findMany({
                take: limit,
                skip: offset
            });
            return res.status(200).json(rentals);
        }
        if(query && query.search){
            
        }
        const rentals = await prisma.rental.findMany();
        res.status(200).json(rentals);
    }catch(err){
        res.status(500).json({error: "Failed to fetch rentals"});
    }
}