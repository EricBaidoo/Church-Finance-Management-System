import { Request, Response } from 'express';
import Expense from '../models/Expense.js';
import User from '../models/User.js';

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const { category, status, page = 1, limit = 15 } = req.query;
    const offset = ((Number(page) - 1) * Number(limit)) || 0;

    let where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;

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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createExpense = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getExpense = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { category, description, amount, expenseDate, vendor, status } = req.body;
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const updates: any = {};
    if (category) updates.category = category;
    if (description) updates.description = description;
    if (amount) updates.amount = amount;
    if (expenseDate) updates.expenseDate = expenseDate;
    if (vendor) updates.vendor = vendor;
    if (status) {
      updates.status = status;
      if (status === 'approved') updates.approvedBy = req.userId;
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approveExpense = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const rejectExpense = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
