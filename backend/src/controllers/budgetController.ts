import { Request, Response } from 'express';
import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

export const getBudgets = async (req: Request, res: Response) => {
  try {
    const { category, page = 1, limit = 15 } = req.query;
    const offset = ((Number(page) - 1) * Number(limit)) || 0;

    let where: any = {};
    if (category) where.category = category;

    const { count, rows } = await Budget.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name'] }
      ],
      offset,
      limit: Number(limit),
      order: [['startDate', 'DESC']]
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

export const createBudget = async (req: Request, res: Response) => {
  try {
    const { category, allocatedAmount, startDate, endDate, description } = req.body;

    if (!category || !allocatedAmount || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const budget = await Budget.create({
      category,
      allocatedAmount,
      startDate,
      endDate,
      description,
      createdBy: req.userId!,
    });

    const result = await Budget.findByPk(budget.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'Budget created successfully'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBudget = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name'] }
      ]
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json({
      success: true,
      data: budget
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  try {
    const { category, allocatedAmount, startDate, endDate, description } = req.body;
    const budget = await Budget.findByPk(req.params.id);

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await budget.update({
      category: category || budget.category,
      allocatedAmount: allocatedAmount || budget.allocatedAmount,
      startDate: startDate || budget.startDate,
      endDate: endDate || budget.endDate,
      description: description || budget.description
    });

    const result = await Budget.findByPk(budget.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name'] }
      ]
    });

    res.json({
      success: true,
      data: result,
      message: 'Budget updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findByPk(req.params.id);

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await budget.destroy();

    res.json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
