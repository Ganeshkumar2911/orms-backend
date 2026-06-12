const transportModel = require("../models/transport.model");

async function createTransport(req, res) {
    const { name } = req.body;

    const existingTransport = await transportModel.findOne({
        name: {
            $regex: `^${name.trim()}$`,
            $options: "i",
        },
    });

    if (existingTransport) {
        return res.status(409).json({
            message: "Transport already exists",
        });
    }

    const transport = await transportModel.create({
        name: name.trim(),
    });

    res.status(201).json({
        message: "Transport created successfully",
        transport,
    });
}

async function getTransports(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const filter = {};

    if (search) {
        filter.name = {
            $regex: search,
            $options: "i",
        };
    }

    const transports = await transportModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalTransports = await transportModel.countDocuments(filter);

    const totalPages = Math.ceil(totalTransports / limit);

    res.status(200).json({
        data: transports,
        currentPage: page,
        totalPages,
        totalTransports,
    });
}

async function updateTransport(req, res) {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const updateData = {};

    if (name !== undefined) {
        updateData.name = name.trim();

        const existingTransport = await transportModel.findOne({
            _id: { $ne: id },
            name: {
                $regex: `^${name.trim()}$`,
                $options: "i",
            },
        });

        if (existingTransport) {
            return res.status(409).json({
                message: "Transport already exists",
            });
        }
    }

    if (isActive !== undefined) {
        updateData.isActive = isActive;
    }

    const transport = await transportModel.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!transport) {
        return res.status(404).json({
            message: "Transport not found",
        });
    }

    res.status(200).json({
        message: "Transport updated successfully",
        transport,
    });
}

module.exports = {
    createTransport,
    getTransports,
    updateTransport,
};