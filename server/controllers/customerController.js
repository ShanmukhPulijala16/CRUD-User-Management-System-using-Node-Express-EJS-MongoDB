const Customer = require('../models/Customer');
const flash = require('connect-flash');

const customerController = {
    //Customer HomePage
    getHomePage: async (req, res) => {
        const locals = {
            title: "NodeJS",
            description: "NodeJs User Management System",
        };
        const messages = req.flash('info');

        let perPage = 6;
        let page = req.query.page || 1;
        try {
            const customers = await Customer.aggregate([{ $sort: { createdAt: -1 } }])
                .skip(perPage * page - perPage)
                .limit(perPage)
                .exec();
            const count = await Customer.countDocuments({});
            res.render('index', {
                locals,
                customers,
                current: page,
                pages: Math.ceil(count / perPage),
                messages
            });
        } catch (error) {
            console.log(error);
        }
    },
    //About Page
    about: async (req, res) => {
        const locals = {
            title: "About",
            description: "NodeJs User Management System",
        };
        try {
            res.render("about", locals);
        } catch (error) {
            console.log(error);
        }
    },
    //Add Customer
    addCustomer: async (req, res) => {

        const locals = {
            title: "Add New Customer NodeJS",
            description: "NodeJs User Management System",
        };

        res.render('customer/add.ejs', locals);
    },

    // Create new customer
    postCustomer: async (req, res) => {
        // console.log(req.body);
        // const newCustomer = new Customer({
        //     firstName: req.body.firstName,
        //     lastName: req.body.lastName,
        //     details: req.body.details,
        //     tel: req.body.tel,
        //     email: req.body.email,
        // });
        // try {
        //     await Customer.create(newCustomer);
        //     await req.flash("info", "New customer has been added.");
        //     res.redirect("/");
        // } catch (error) {
        //     console.log(error);
        // }

        const newContact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            tel: req.body.tel,
            email: req.body.email,
            details: req.body.details
        }
        try {
            await Customer.create(newContact);
            req.flash('info', 'New customer has been added.');
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
    },

    // View Customer Data
    view: async (req, res) => {
        try {
            const customer = await Customer.findOne({ _id: req.params.id });
            const locals = {
                title: "View Customer Data",
                description: "NodeJs User Management System",
            };
            res.render('customer/view', {
                locals,
                customer
            });
        } catch (error) {
            console.log(error);
        }
    },

    // Edit Customer Data
    edit: async (req, res) => {
        try {
            const customer = await Customer.findOne({ _id: req.params.id });
            const locals = {
                title: "Edit Customer Data",
                description: "NodeJs User Management System",
            };
            res.render('customer/edit', { locals, customer });
        } catch (error) {
            console.log(error);
        }
    },

    editPost: async (req, res) => {
        try {
            await Customer.findByIdAndUpdate(req.params.id, {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                tel: req.body.tel,
                email: req.body.email,
                details: req.body.details,
                updatedAt: Date.now().toLocaleString(undefined, { timeZone: 'Asia/Kolkata' })
            });
            res.redirect(`/edit/${req.params.id}`);
        } catch (error) {
            console.log(error);
        }
    },

    deleteCustomer: async (req, res) => {
        try {
            await Customer.findByIdAndDelete(req.params.id);
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
    },

    searchCustomers: async (req, res) => {
        const locals = {
            title: "Search Customer Data",
            description: "NodeJs User Management System",
        };
        try {
            let searchTerm = req.body.searchTerm;
            const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
            const customers = await Customer.find({
                $or: [
                    { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
                    { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } }
                ],
            });
            res.render('search.ejs', {
                customers,
                locals,
            })
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = customerController;