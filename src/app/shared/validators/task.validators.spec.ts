import { FormControl } from '@angular/forms';
import { minLengthTrimmed, futureDateValidator } from './task.validators';

describe('Task Validators', () => {
  describe('minLengthTrimmed', () => {
    const validator = minLengthTrimmed(3);

    it('should return null for valid length', () => {
      const control = new FormControl('abc');
      expect(validator(control)).toBeNull();
    });

    it('should return null for empty value (required should handle that)', () => {
      const control = new FormControl('');
      expect(validator(control)).toBeNull();
    });

    it('should return error for short value', () => {
      const control = new FormControl('ab');
      const result = validator(control);
      expect(result).toEqual({ minLengthTrimmed: { requiredLength: 3, actualLength: 2 } });
    });

    it('should trim whitespace before checking length', () => {
      const control = new FormControl('  a  ');
      const result = validator(control);
      expect(result).toEqual({ minLengthTrimmed: { requiredLength: 3, actualLength: 1 } });
    });

    it('should treat only-whitespace as short', () => {
      const control = new FormControl('   ');
      const result = validator(control);
      expect(result).toEqual({ minLengthTrimmed: { requiredLength: 3, actualLength: 0 } });
    });
  });

  describe('futureDateValidator', () => {
    it('should return null for empty value', () => {
      const control = new FormControl('');
      expect(futureDateValidator(control)).toBeNull();
    });

    it('should return null for future date', () => {
      const control = new FormControl('2099-12-31');
      expect(futureDateValidator(control)).toBeNull();
    });

    it('should return error for past date', () => {
      const control = new FormControl('2020-01-01');
      const result = futureDateValidator(control);
      expect(result).toEqual({ futureDate: { actualDate: '2020-01-01' } });
    });
  });
});
