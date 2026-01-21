import { Op, Sequelize } from 'sequelize';
import Expense from '../models/Expense.js';
import User from '../models/User.js';
export const getExpenses = async (req, res) => {
    try {
        const { category, status, page = 1, limit = 15, search, startDate, endDate } = req.query;
        const offset = ((Number(page) - 1) * Number(limit)) || 0;
        let where = {};
        if (category)
            where.category = category;
        if (status)
            where.status = status;
        // Search in vendor or description
        if (search) {
            where[Op.or] = [
                { vendor: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { referenceNumber: { [Op.like]: `%${search}%` } }
            ];
        }
        // Date range filtering
        if (startDate && endDate) {
            where.expenseDate = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }
        const { count, rows } = await Expense.findAndCountAll({
            where,
            include: [
                { model: User, as: 'approver', attributes: ['id', 'name'] }
            ],
            offset,
            limit: Number(limit),
            order: [['expenseDate', 'DESC']]
        });
        res.json({
            success: true,
            data: rows,
            meta: {
                total: count,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(count / Number(limit))
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createExpense = async (req, res) => {
    try {
        const { category, description, amount, expenseDate, vendor } = req.body;
        if (!category || !description || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const expense = await Expense.create({
            category,
            description,
            amount,
            expenseDate: expenseDate || new Date(),
            vendor,
            status: 'pending',
            referenceNumber: `EXP-${Date.now()}`
        });
        const result = await Expense.findByPk(expense.id, {
            include: [
                { model: User, as: 'approver', attributes: ['id', 'name'] }
            ]
        });
        res.status(201).json({
            success: true,
            data: result,
            message: 'Expense recorded successfully'
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getExpense = async (req, res) => {
    try {
        const expense = await Expense.findByPk(req.params.id, {
            include: [
                { model: User, as: 'approver', attributes: ['id', 'name'] }
            ]
        });
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json({
            success: true,
            data: expense
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateExpense = async (req, res) => {
    try {
        const { category, description, amount, expenseDate, vendor, status } = req.body;
        const expense = await Expense.findByPk(req.params.id);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        const updates = {};
        if (category)
            updates.category = category;
        if (description)
            updates.description = description;
        if (amount)
            updates.amount = amount;
        if (expenseDate)
            updates.expenseDate = expenseDate;
        if (vendor)
            updates.vendor = vendor;
        if (status) {
            updates.status = status;
            if (status === 'approved')
                updates.approvedBy = req.userId;
        }
        await expense.update(updates);
        const result = await Expense.findByPk(expense.id, {
            include: [
                { model: User, as: 'approver', attributes: ['id', 'name'] }
            ]
        });
        res.json({
            success: true,
            data: result,
            message: 'Expense updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const approveExpense = async (req, res) => {
    try {
        const expense = await Expense.findByPk(req.params.id);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        await expense.update({
            status: 'approved',
            approvedBy: req.userId
        });
        const result = await Expense.findByPk(expense.id, {
            include: [
                { model: User, as: 'approver', attributes: ['id', 'name'] }
            ]
        });
        res.json({
            success: true,
            data: result,
            message: 'Expense approved'
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const rejectExpense = async (req, res) => {
    try {
        const expense = await Expense.findByPk(req.params.id);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        await expense.update({
            status: 'rejected',
            approvedBy: req.userId
        });
        const result = await Expense.findByPk(expense.id, {
            include: [
                { model: User, as: 'approver', attributes: ['id', 'name'] }
            ]
        });
        res.json({
            success: true,
            data: result,
            message: 'Expense rejected'
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByPk(req.params.id);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        await expense.destroy();
        res.json({
            success: true,
            message: 'Expense deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Analytics endpoints
export const getExpenseStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let where = {};
        if (startDate && endDate) {
            where.expenseDate = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }
        // By category
        const byCategory = await Expense.findAll({
            attributes: [
                'category',
                [Sequelize.fn('SUM', Sequelize.col('amount')), 'total'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            where,
            group: ['category'],
            raw: true
        });
        // By status
        const byStatus = await Expense.findAll({
            attributes: [
                'status',
                [Sequelize.fn('SUM', Sequelize.col('amount')), 'total'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            where,
            group: ['status'],
            raw: true
        });
        // Total
        const totalStats = await Expense.findOne({
            attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'total']],
            where,
            raw: true
        });
        res.json({
            success: true,
            data: {
                byCategory,
                byStatus,
                total: totalStats?.total || 0,
                totalCount: byCategory.reduce((sum, s) => sum + parseInt(s.count), 0)
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const getExpenseTrends = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let where = {};
        if (startDate && endDate) {
            where.expenseDate = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }
        const trends = await Expense.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('expenseDate')), 'date'],
                [Sequelize.fn('SUM', Sequelize.col('amount')), 'amount'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            where,
            group: [Sequelize.fn('DATE', Sequelize.col('expenseDate'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('expenseDate')), 'ASC']],
            raw: true
        });
        res.json({
            success: true,
            data: trends
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const getPendingExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            where: { status: 'pending' },
            include: [
                { model: User, as: 'approver', attributes: ['id', 'name'] }
            ],
            order: [['expenseDate', 'ASC']]
        });
        res.json({
            success: true,
            data: expenses
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
//# sourceMappingURL=expenseController.js.map