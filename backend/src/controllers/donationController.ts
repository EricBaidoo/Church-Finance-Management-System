import { Request, Response } from 'express';
import Donation from '../models/Donation.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

export const getDonations = async (req: Request, res: Response) => {
  try {
    const { type, memberId, page = 1, limit = 15 } = req.query;
    const offset = ((Number(page) - 1) * Number(limit)) || 0;

    let where: any = {};
    if (type) where.donationType = type;
    if (memberId) where.memberId = memberId;

    const { count, rows } = await Donation.findAndCountAll({
      where,
      include: [
        { model: User, as: 'member', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'recordedByUser', attributes: ['id', 'name'] }
      ],
      offset,
      limit: Number(limit),
      order: [['donationDate', 'DESC']]
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

export const createDonation = async (req: Request, res: Response) => {
  try {
    const { memberId, amount, donationType, description, donationDate, paymentMethod } = req.body;

    if (!memberId || !amount || !donationType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const donation = await Donation.create({
      memberId,
      amount,
      donationType,
      description,
      donationDate: donationDate || new Date(),
      paymentMethod: paymentMethod || 'cash',
      recordedBy: req.userId,
      referenceNumber: `DON-${Date.now()}`
    });

    const result = await Donation.findByPk(donation.id, {
      include: [
        { model: User, as: 'member', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'recordedByUser', attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'Donation recorded successfully'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDonation = async (req: Request, res: Response) => {
  try {
    const donation = await Donation.findByPk(req.params.id, {
      include: [
        { model: User, as: 'member', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'recordedByUser', attributes: ['id', 'name'] }
      ]
    });

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    res.json({
      success: true,
      data: donation
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDonation = async (req: Request, res: Response) => {
  try {
    const { amount, donationType, description, donationDate, paymentMethod } = req.body;
    const donation = await Donation.findByPk(req.params.id);

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    await donation.update({
      amount: amount || donation.amount,
      donationType: donationType || donation.donationType,
      description: description || donation.description,
      donationDate: donationDate || donation.donationDate,
      paymentMethod: paymentMethod || donation.paymentMethod
    });

    const result = await Donation.findByPk(donation.id, {
      include: [
        { model: User, as: 'member', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'recordedByUser', attributes: ['id', 'name'] }
      ]
    });

    res.json({
      success: true,
      data: result,
      message: 'Donation updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDonation = async (req: Request, res: Response) => {
  try {
    const donation = await Donation.findByPk(req.params.id);

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    await donation.destroy();

    res.json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
