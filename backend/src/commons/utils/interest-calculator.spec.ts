import { calculateInterest } from './interest-calculator';
import { Decimal } from '@prisma/client/runtime/library';

describe('calculateInterest', () => {
  it('should return zero interest for charges not overdue', () => {
    const amount = 100;
    const dueDate = new Date('2026-02-20'); // Future date
    const currentDate = new Date('2026-02-12');

    const result = calculateInterest(amount, dueDate, currentDate);

    expect(result.originalAmount).toBe(100);
    expect(result.interest).toBe(0);
    expect(result.totalAmount).toBe(100);
    expect(result.isOverdue).toBe(false);
    expect(result.monthsOverdue).toBe(0);
  });

  it('should calculate interest for charges 30 days overdue (1 month)', () => {
    const amount = 100;
    const dueDate = new Date('2026-01-12');
    const currentDate = new Date('2026-02-11'); // 30 days later

    const result = calculateInterest(amount, dueDate, currentDate);

    expect(result.originalAmount).toBe(100);
    expect(result.interest).toBe(10); // 10% of 100 for 1 month
    expect(result.totalAmount).toBe(110);
    expect(result.isOverdue).toBe(true);
    expect(result.monthsOverdue).toBe(1);
  });

  it('should calculate proportional interest for charges 15 days overdue (0.5 months)', () => {
    const amount = 100;
    const dueDate = new Date('2026-01-28');
    const currentDate = new Date('2026-02-12'); // 15 days later

    const result = calculateInterest(amount, dueDate, currentDate);

    expect(result.originalAmount).toBe(100);
    expect(result.interest).toBe(5); // 10% of 100 for 0.5 months
    expect(result.totalAmount).toBe(105);
    expect(result.isOverdue).toBe(true);
    expect(result.monthsOverdue).toBe(0.5);
  });

  it('should calculate interest for charges 60 days overdue (2 months)', () => {
    const amount = 100;
    const dueDate = new Date('2025-12-13');
    const currentDate = new Date('2026-02-11'); // 60 days later

    const result = calculateInterest(amount, dueDate, currentDate);

    expect(result.originalAmount).toBe(100);
    expect(result.interest).toBe(20); // 10% of 100 for 2 months
    expect(result.totalAmount).toBe(120);
    expect(result.isOverdue).toBe(true);
    expect(result.monthsOverdue).toBe(2);
  });

  it('should work with Decimal amounts', () => {
    const amount = new Decimal(250.50);
    const dueDate = new Date('2026-01-12');
    const currentDate = new Date('2026-02-11'); // 30 days later

    const result = calculateInterest(amount, dueDate, currentDate);

    expect(result.originalAmount).toBe(250.50);
    expect(result.interest).toBe(25.05); // 10% of 250.50 for 1 month
    expect(result.totalAmount).toBe(275.55);
    expect(result.isOverdue).toBe(true);
    expect(result.monthsOverdue).toBe(1);
  });

  it('should round to 2 decimal places', () => {
    const amount = 33.33;
    const dueDate = new Date('2026-01-12');
    const currentDate = new Date('2026-02-11'); // 30 days later

    const result = calculateInterest(amount, dueDate, currentDate);

    expect(result.originalAmount).toBe(33.33);
    expect(result.interest).toBe(3.33); // 10% of 33.33 rounded
    expect(result.totalAmount).toBe(36.66);
    expect(result.isOverdue).toBe(true);
  });

  it('should handle charges due today as not overdue', () => {
    const amount = 100;
    const dueDate = new Date('2026-02-12');
    const currentDate = new Date('2026-02-12');

    const result = calculateInterest(amount, dueDate, currentDate);

    expect(result.isOverdue).toBe(false);
    expect(result.interest).toBe(0);
    expect(result.totalAmount).toBe(100);
  });
});
