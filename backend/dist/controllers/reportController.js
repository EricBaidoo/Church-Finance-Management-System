import FinancialReport from '../models/FinancialReport.js';
import Donation from '../models/Donation.js';
import Expense from '../models/Expense.js';
import User from '../models/User.js';
import { Op } from 'sequelize';
export const getReports = async (req, res) => {
    try {
        const { page = 1, limit = 15 } = req.query;
        const offset = ((Number(page) - 1) * Number(limit)) || 0;
        const { count, rows } = await FinancialReport.findAndCountAll({
            include: [
                { model: User, as: 'generator', attributes: ['id', 'name'] }
            ],
            offset,
            limit: Number(limit),
            order: [['createdAt', 'DESC']]
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
export const generateReport = async (req, res) => {
    try {
        const { reportType, startDate, endDate } = req.body;
        if (!reportType || !startDate || !endDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        const totalDonations = await Donation.sum('amount', {
            where: {
                donationDate: {
                    [Op.between]: [start, end]
                }
            }
        }) || 0;
        const totalExpenses = await Expense.sum('amount', {
            where: {
                expenseDate: {
                    [Op.between]: [start, end]
                },
                status: 'approved'
            }
        }) || 0;
        const report = await FinancialReport.create({
            reportName: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${start.toLocaleDateString()}`,
            reportType,
            startDate: start,
            endDate: end,
            totalDonations: parseFloat(totalDonations.toString()),
            totalExpenses: parseFloat(totalExpenses.toString()),
            netBalance: parseFloat((totalDonations - totalExpenses).toString()),
            generatedBy: req.userId,
            data: {
                donationsByType: await Donation.findAll({
                    attributes: [
                        'donationType',
                        ['COUNT(*)', 'count'],
                        ['SUM(amount)', 'total']
                    ],
                    where: {
                        donationDate: {
                            [Op.between]: [start, end]
                        }
                    },
                    group: ['donationType'],
                    raw: true
                }),
                expensesByCategory: await Expense.findAll({
                    attributes: [
                        'category',
                        ['COUNT(*)', 'count'],
                        ['SUM(amount)', 'total']
                    ],
                    where: {
                        expenseDate: {
                            [Op.between]: [start, end]
                        },
                        status: 'approved'
                    },
                    group: ['category'],
                    raw: true
                })
            }
        });
        const result = await FinancialReport.findByPk(report.id, {
            include: [
                { model: User, as: 'generator', attributes: ['id', 'name'] }
            ]
        });
        res.status(201).json({
            success: true,
            data: result,
            message: 'Report generated successfully'
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getReport = async (req, res) => {
    try {
        const report = await FinancialReport.findByPk(req.params.id, {
            include: [
                { model: User, as: 'generator', attributes: ['id', 'name'] }
            ]
        });
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json({
            success: true,
            data: report
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getDashboard = async (req, res) => {
    try {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const thisMonthDonations = await Donation.sum('amount', {
            where: {
                donationDate: {
                    [Op.between]: [monthStart, monthEnd]
                }
            }
        }) || 0;
        const thisMonthExpenses = await Expense.sum('amount', {
            where: {
                expenseDate: {
                    [Op.between]: [monthStart, monthEnd]
                },
                status: 'approved'
            }
        }) || 0;
        const totalDonations = await Donation.sum('amount') || 0;
        const totalExpenses = await Expense.sum('amount', {
            where: { status: 'approved' }
        }) || 0;
        const pendingExpenses = await Expense.sum('amount', {
            where: { status: 'pending' }
        }) || 0;
        const donationsByType = await Donation.findAll({
            attributes: [
                'donationType',
                ['COUNT(*)', 'count'],
                ['SUM(amount)', 'total']
            ],
            group: ['donationType'],
            raw: true
        });
        const expensesByCategory = await Expense.findAll({
            attributes: [
                'category',
                ['COUNT(*)', 'count'],
                ['SUM(amount)', 'total']
            ],
            where: { status: 'approved' },
            group: ['category'],
            raw: true
        });
        res.json({
            success: true,
            data: {
                thisMonth: {
                    donations: parseFloat(thisMonthDonations.toString()),
                    expenses: parseFloat(thisMonthExpenses.toString()),
                    net: parseFloat((thisMonthDonations - thisMonthExpenses).toString())
                },
                allTime: {
                    donations: parseFloat(totalDonations.toString()),
                    expenses: parseFloat(totalExpenses.toString()),
                    net: parseFloat((totalDonations - totalExpenses).toString())
                },
                pending: {
                    expenses: parseFloat(pendingExpenses.toString())
                },
                donationsByType,
                expensesByCategory
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//# sourceMappingURL=reportController.js.map