const partyModel = require('../models/party.model');

async function createParty(req, res) {

    const { name, address } = req.body;

    const existingParty = await partyModel.findOne({
        name: {
            $regex: `^${name.trim()}$`,
            $options: "i"
        },
        address: {
            $regex: `^${address.trim()}$`,
            $options: "i"
        }
    });

    if(existingParty) {
        return res.status(409).json({
            message: "Party already exists"
        });
    }

    const party = await partyModel.create({ name, address });

    res.status(201).json({ message: 'Party created successfully', party });
}

async function getParties(req, res) { 
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || '';

    const skip = (page - 1) * limit;

    const filter = {};

    if (search) {
        filter.$or = [
            {
                name: {
                    $regex: search,
                    $options: 'i'
                }
            },
            {
                address: {
                    $regex: search,
                    $options: 'i'
                }
            }
        ];
    }

    const parties = await partyModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalParties = await partyModel.countDocuments(filter);
    const totalPages = Math.ceil(totalParties / limit);

    res.status(200).json({
        data: parties,
        currentPage: page,
        totalPages,
        totalParties,
    }); 
}

async function updateParty(req, res) {
    const { id } = req.params;

    const { name, address } = req.body;

    const existingParty = await partyModel.findOne({
        _id: { $ne: id },
        name: {
            $regex: `^${name.trim()}$`,
            $options: "i"
        },
        address: {
            $regex: `^${address.trim()}$`,
            $options: "i"
        }
    });

    if(existingParty) {
        res.status(409).json({
            message: "Party already exists"
        });
    }
    
    const party = await partyModel.findByIdAndUpdate(
        id,
        req.body,
        {
            returnDocument: 'after',
            runValidators: true,
        }
    );

    if(!party) {
        return res.status(404).json({
            message: "Party not found"
        });
    }

    res.status(200).json({ message: 'Party updated successfully', party });
}

    

module.exports = {
    createParty,
    getParties,
    updateParty,
}