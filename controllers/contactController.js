const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// ✅ Get all contacts
const getAllContact = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({});
    res.status(200).json(contacts);
});

// ✅ Get single contact
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});

// ✅ Create a contact
const getCreateContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const contact = await Contact.create({ name, email, phone });
    res.status(201).json(contact);
});

// ✅ Update a contact
const getUpdateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedContact);
});

// ✅ Delete a contact
const getDeleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    await contact.deleteOne();
    res.status(200).json({ message: "Contact deleted" });
});

// ✅ Export functions correctly
module.exports = {
    getAllContact,
    getContact,
    getCreateContact,
    getUpdateContact,
    getDeleteContact
};
