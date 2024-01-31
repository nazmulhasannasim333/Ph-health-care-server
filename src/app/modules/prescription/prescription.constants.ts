export const prescriptionFilterableFields: string[] = [
  'patientEmail',
  'doctorEmail',
];

export const prescriptionRelationalFields: string[] = [
  'patientEmail',
  'doctorEmail',
];

export const prescriptionRelationalFieldsMapper: { [key: string]: string } = {
  patientEmail: 'patient',
  doctorEmail: 'doctor',
};
