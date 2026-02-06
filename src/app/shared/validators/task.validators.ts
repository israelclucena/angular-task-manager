import { AbstractControl, ValidationErrors } from '@angular/forms';

export function minLengthTrimmed(minLength: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value as string;
    if (!raw) {
      return null;
    }
    const trimmed = raw.trim();
    if (trimmed.length < minLength) {
      return { minLengthTrimmed: { requiredLength: minLength, actualLength: trimmed.length } };
    }
    return null;
  };
}

export function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const inputDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (inputDate < today) {
    return { futureDate: { actualDate: control.value } };
  }
  return null;
}
