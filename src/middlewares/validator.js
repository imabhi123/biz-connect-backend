import { check, validationResult } from 'express-validator';
import { body } from 'express-validator';
// Validation rules for creating/updating a Club Chapter
export const validateClubChapter = [
    check('chapterName').notEmpty().withMessage('Chapter Name is required'),
    check('clubName').notEmpty().withMessage('Club Name is required'),
    check('location').notEmpty().withMessage('Location is required'),
    check('incharge').notEmpty().withMessage('Incharge is required'),
    check('contact').notEmpty().withMessage('Contact is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

export const communityValidationRules = [
    body('communityName').notEmpty().withMessage('Community name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('contact').isLength({ min: 10, max: 15 }).withMessage('Contact must be between 10 and 15 characters'),
    body('designation').notEmpty().withMessage('Designation is required'),
    body('AssignId').notEmpty().withMessage('AssignId is required'),
    body('description').notEmpty().withMessage('Description is required'),
];