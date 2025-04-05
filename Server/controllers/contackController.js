import User from "../models/userModel.js";

export const searchContact = async (req, res) => {
    try {
        const { search } = req.body;
        if (!search) {
            return res.status(400).json("Search field is required");
        };
        const sanitizedSearchTerm = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(sanitizedSearchTerm, 'i');
        const contacts = await User.find({
            $and: [
                { _id: { $ne: req.userId } },
                { $or: [{ firstName: searchRegex }, { lastName: searchRegex }, { email: searchRegex }] }
            ]
        })
        // console.log("Contacts : " , contacts);
        return res.status(200).json(contacts);
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error");
    }
};

export const getAllContact = async (req, res) => {
    try {
        const contacts = await User.find({ _id: { $ne: req.userId } });
        if (!contacts) {
            return res.status(400).json("No contacts found");
        }
        // console.log("All Contacts : " , contacts);
        return res.status(200).json(contacts);
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error");
    }
};