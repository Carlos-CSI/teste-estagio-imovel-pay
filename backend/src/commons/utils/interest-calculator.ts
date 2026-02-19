import { Decimal } from '@prisma/client/runtime/library';

export interface InterestCalculation {
  originalAmount: number;
  interest: number;
  totalAmount: number;
  isOverdue: boolean;
  monthsOverdue: number;
}

/**
 * Calculates interest for overdue charges
 * Interest rate: 10% per month, proportional by days (30 days = 1 month)
 */
export function calculateInterest(
  amount: Decimal | number,
  dueDate: Date,
  currentDate: Date = new Date(),
): InterestCalculation {
  const originalAmount = typeof amount === 'number' ? amount : Number(amount);
  const dueDateObj = new Date(dueDate);

  // Check if overdue
  const isOverdue = currentDate > dueDateObj;

  if (!isOverdue) {
    return {
      originalAmount,
      interest: 0,
      totalAmount: originalAmount,
      isOverdue: false,
      monthsOverdue: 0,
    };
  }

  // Calculate days overdue
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysOverdue = Math.floor((currentDate.getTime() - dueDateObj.getTime()) / msPerDay);

  // Calculate interest: 10% per month, proportional by days (30 days = 1 month)
  const monthsOverdue = daysOverdue / 30;
  const interestRate = 0.1; // 10% per month
  const interest = originalAmount * interestRate * monthsOverdue;
  const totalAmount = Number((originalAmount + interest).toFixed(2));

  return {
    originalAmount,
    interest: Number(interest.toFixed(2)),
    totalAmount,
    isOverdue: true,
    monthsOverdue: Number(monthsOverdue.toFixed(2)),
  };
}
