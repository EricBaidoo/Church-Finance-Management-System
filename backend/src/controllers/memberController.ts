import { Request, Response } from 'express';
import Member from '../models/Member.js';
import Donation from '../models/Donation.js';
import { Op } from 'sequelize';

export const getMembers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, search = '', isActive } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    
    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { memberNumber: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    if (isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }

    const { count, rows: members } = await Member.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['fullName', 'ASC']]
    });

    res.json({
      success: true,
      data: members,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch members',
      error: error.message
    });
  }
};

export const getMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const member = await Member.findByPk(id, {
      include: [
        {
          model: Donation,
          as: 'offerings',
          limit: 10,
          order: [['donationDate', 'DESC']]
        }
      ]
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error: any) {
    console.error('Get member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch member',
      error: error.message
    });
  }
};

export const createMember = async (req: Request, res: Response) => {
  try {
    const {
      memberNumber,
      fullName,
      phone,
      email,
      address,
      dateOfBirth,
      gender,
      maritalStatus,
      occupation,
      joinDate,
      notes
    } = req.body;

    // Check if member number already exists
    const existing = await Member.findOne({ where: { memberNumber } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Member number already exists'
      });
    }

    const member = await Member.create({
      memberNumber,
      fullName,
      phone,
      email,
      address,
      dateOfBirth,
      gender,
      maritalStatus,
      occupation,
      joinDate: joinDate || new Date(),
      isActive: true,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: member
    });
  } catch (error: any) {
    console.error('Create member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create member',
      error: error.message
    });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      memberNumber,
      fullName,
      phone,
      email,
      address,
      dateOfBirth,
      gender,
      maritalStatus,
      occupation,
      joinDate,
      isActive,
      notes
    } = req.body;

    const member = await Member.findByPk(id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Check if new member number conflicts
    if (memberNumber && memberNumber !== member.memberNumber) {
      const existing = await Member.findOne({ where: { memberNumber } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Member number already exists'
        });
      }
    }

    await member.update({
      memberNumber,
      fullName,
      phone,
      email,
      address,
      dateOfBirth,
      gender,
      maritalStatus,
      occupation,
      joinDate,
      isActive,
      notes
    });

    res.json({
      success: true,
      message: 'Member updated successfully',
      data: member
    });
  } catch (error: any) {
    console.error('Update member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update member',
      error: error.message
    });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const member = await Member.findByPk(id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Soft delete
    await member.destroy();

    res.json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete member',
      error: error.message
    });
  }
};

// Get member's tithe history
export const getMemberTitheHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { year, month } = req.query;

    const member = await Member.findByPk(id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    const whereClause: any = {
      memberId: id,
      offeringTypeId: 1 // Assuming ID 1 is Tithes from our offering types
    };

    if (year) {
      whereClause.donationDate = {
        [Op.gte]: new Date(`${year}-01-01`),
        [Op.lt]: new Date(`${Number(year) + 1}-01-01`)
      };
    }

    if (month && year) {
      const startDate = new Date(`${year}-${String(month).padStart(2, '0')}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      
      whereClause.donationDate = {
        [Op.gte]: startDate,
        [Op.lt]: endDate
      };
    }

    const tithes = await Donation.findAll({
      where: whereClause,
      order: [['donationDate', 'DESC']]
    });

    const totalTithes = tithes.reduce((sum, tithe) => sum + parseFloat(tithe.amount.toString()), 0);

    res.json({
      success: true,
      data: {
        member,
        tithes,
        summary: {
          totalAmount: totalTithes,
          count: tithes.length
        }
      }
    });
  } catch (error: any) {
    console.error('Get member tithe history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tithe history',
      error: error.message
    });
  }
};
