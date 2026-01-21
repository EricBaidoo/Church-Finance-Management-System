import { Request, Response } from 'express';
import OfferingType from '../models/OfferingType.js';
import { Op } from 'sequelize';

export const getOfferingTypes = async (req: Request, res: Response) => {
  try {
    const { active, page = 1, limit = 50, search } = req.query;

    let where: any = {};
    if (active !== undefined) where.isActive = active === 'true';
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = ((Number(page) - 1) * Number(limit)) || 0;
    const { count, rows } = await OfferingType.findAndCountAll({
      where,
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
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createOfferingType = async (req: Request, res: Response) => {
  try {
    const { name, code, description, isActive } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        error: 'Name and code are required'
      });
    }

    // Check if code already exists
    const existing = await OfferingType.findOne({ where: { code } });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Offering type code already exists'
      });
    }

    const offeringType = await OfferingType.create({
      name,
      code: code.toUpperCase(),
      description,
      isActive: isActive !== false
    });

    res.status(201).json({
      success: true,
      message: 'Offering type created successfully',
      data: offeringType
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOfferingType = async (req: Request, res: Response) => {
  try {
    const offeringType = await OfferingType.findByPk(req.params.id);

    if (!offeringType) {
      return res.status(404).json({
        success: false,
        error: 'Offering type not found'
      });
    }

    res.json({
      success: true,
      data: offeringType
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateOfferingType = async (req: Request, res: Response) => {
  try {
    const { name, code, description, isActive } = req.body;
    const offeringType = await OfferingType.findByPk(req.params.id);

    if (!offeringType) {
      return res.status(404).json({
        success: false,
        error: 'Offering type not found'
      });
    }

    // Check if new code conflicts
    if (code && code !== offeringType.code) {
      const existing = await OfferingType.findOne({ where: { code } });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'Offering type code already exists'
        });
      }
    }

    await offeringType.update({
      name: name || offeringType.name,
      code: code ? code.toUpperCase() : offeringType.code,
      description: description !== undefined ? description : offeringType.description,
      isActive: isActive !== undefined ? isActive : offeringType.isActive
    });

    res.json({
      success: true,
      message: 'Offering type updated successfully',
      data: offeringType
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteOfferingType = async (req: Request, res: Response) => {
  try {
    const offeringType = await OfferingType.findByPk(req.params.id);

    if (!offeringType) {
      return res.status(404).json({
        success: false,
        error: 'Offering type not found'
      });
    }

      // Check if it has donations - just allow deletion for now
      // In production, you might want to prevent deletion if donations exist

    await offeringType.destroy();

    res.json({
      success: true,
      message: 'Offering type deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getActiveOfferingTypes = async (req: Request, res: Response) => {
  try {
    const types = await OfferingType.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: types
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
