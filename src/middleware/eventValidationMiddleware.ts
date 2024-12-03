import { Request, Response, NextFunction } from 'express';

export const eventValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { title, description, date_time, location, type } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({ message: 'Title must be a string and at least 3 characters long' });
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    return res.status(400).json({ message: 'Description must be a string and at least 10 characters long' });
  }

  if (!date_time || isNaN(Date.parse(date_time))) {
    return res.status(400).json({ message: 'date_time must be a valid date and time in ISO format' });
  }
  const eventDate = new Date(date_time);
  if (eventDate < new Date()) {
    return res.status(400).json({ message: 'date_time must be in the future' });
  }

  if (!location || typeof location !== 'string' || location.trim().length < 3) {
    return res.status(400).json({ message: 'Location must be a string and at least 3 characters long' });
  }

  const validEventTypes = ['Meeting', 'Workshop', 'Conference', 'Webinar', 'Social Event'];
  if (!type || !validEventTypes.includes(type)) {
    return res.status(400).json({
      message: `Type must be one of the following: ${validEventTypes.join(', ')}`,
    });
  }

  next();
};
