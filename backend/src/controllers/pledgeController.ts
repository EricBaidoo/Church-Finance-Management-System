import { Request, Response } from 'express';
import Pledge from '../models/Pledge.js';
import Member from '../models/Member.js';
import Donation from '../models/Donation.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

export const getPledges = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, status, memberId } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }

    if (memberId) {
      whereClause.memberId = memberId;
    }

    const { count, rows: pledges } = await Pledge.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['id', 'memberNumber', 'fullName', 'phone']
        }
      ],
      limit: Number(limit),
      offset,
      order: [['pledgeDate', 'DESC']]
    });

    res.json({
      success: true,
      data: pledges,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get pledges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pledges',
      error: error.message
    });
  }
};

export const getPledge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const pledge = await Pledge.findByPk(id, {
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['id', 'memberNumber', 'fullName', 'phone', 'email']
        }
      ]
    });

    if (!pledge) {
      return res.status(404).json({
        success: false,
        message: 'Pledge not found'
      });
    }

    res.json({
      success: true,
      data: pledge
    });
  } catch (error: any) {
    console.error('Get pledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pledge',
      error: error.message
    });
  }
};

export const createPledge = async (req: Request, res: Response) => {
  try {
    const {
      memberId,
      pledgeType,
      amountPledged,
      pledgeDate,
      dueDate,
      description
    } = req.body;

    const pledge = await Pledge.create({
      memberId,
      pledgeType,
      amountPledged,
      amountPaid: 0,
      pledgeDate: pledgeDate || new Date(),
      dueDate,
      status: 'active',
      description,
      recordedBy: req.userId!
    });

    const pledgeWithMember = await Pledge.findByPk(pledge.id, {
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['id', 'memberNumber', 'fullName', 'phone']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Pledge created successfully',
      data: pledgeWithMember
    });
  } catch (error: any) {
    console.error('Create pledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create pledge',
      error: error.message
    });
  }
};

export const updatePledge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      memberId,
      pledgeType,
      amountPledged,
      pledgeDate,
      dueDate,
      status,
      description
    } = req.body;

    const pledge = await Pledge.findByPk(id);
    if (!pledge) {
      return res.status(404).json({
        success: false,
        message: 'Pledge not found'
      });
    }

    await pledge.update({
      memberId,
      pledgeType,
      amountPledged,
      pledgeDate,
      dueDate,
      status,
      description
    });

    const updatedPledge = await Pledge.findByPk(id, {
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['id', 'memberNumber', 'fullName', 'phone']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Pledge updated successfully',
      data: updatedPledge
    });
  } catch (error: any) {
    console.error('Update pledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pledge',
      error: error.message
    });
  }
};

export const deletePledge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const pledge = await Pledge.findByPk(id);
    if (!pledge) {
      return res.status(404).json({
        success: false,
        message: 'Pledge not found'
      });
    }

    await pledge.destroy();

    res.json({
      success: true,
      message: 'Pledge deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete pledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pledge',
      error: error.message
    });
  }
};

// Record a payment towards a pledge
export const recordPledgePayment = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { amount, paymentDate, donationId } = req.body;

    const pledge = await Pledge.findByPk(id, { transaction });
    if (!pledge) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Pledge not found'
      });
    }

    const newAmountPaid = parseFloat(pledge.amountPaid.toString()) + parseFloat(amount);
    const amountPledged = parseFloat(pledge.amountPledged.toString());

    // Update pledge
    await pledge.update({
      amountPaid: newAmountPaid,
      status: newAmountPaid >= amountPledged ? 'completed' : 'active'
    }, { transaction });

    await transaction.commit();

    const updatedPledge = await Pledge.findByPk(id, {
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['id', 'memberNumber', 'fullName', 'phone']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      data: updatedPledge
    });
  } catch (error: any) {
    await transaction.rollback();
    console.error('Record pledge payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment',
      error: error.message
    });
  }
};

// Get pledge summary
export const getPledgeSummary = async (req: Request, res: Response) => {
  try {
    const activePledges = await Pledge.findAll({
      where: { status: 'active' },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount_pledged')), 'totalPledged'],
        [sequelize.fn('SUM', sequelize.col('amount_paid')), 'totalPaid']
      ],
      raw: true
    });

    const completedPledges = await Pledge.count({
      where: { status: 'completed' }
    });

    res.json({
      success: true,
      data: {
        active: {
          count: activePledges[0]?.count || 0,
          totalPledged: parseFloat(activePledges[0]?.totalPledged || '0'),
          totalPaid: parseFloat(activePledges[0]?.totalPaid || '0'),
          outstanding: parseFloat(activePledges[0]?.totalPledged || '0') - parseFloat(activePledges[0]?.totalPaid || '0')
        },
        completed: completedPledges
      }
    });
  } catch (error: any) {
    console.error('Get pledge summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pledge summary',
      error: error.message
    });
  }
};
