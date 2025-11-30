const BankAccount = require('../models/bankAccount');


exports.create = (req, res) => {
    const { accountNumber } = req.body
    const newAccount = new BankAccount({ accountNumber });
    newAccount.save()
        .then(account => res.status(201).json(account))
        .catch(err => res.status(400).json({ error: err.message }));
}

exports.getAll = (req, res) => {
    BankAccount.find()
        .then(accounts => res.status(200).json(accounts))
        .catch(err => res.status(500).json({ error: err.message }));
}