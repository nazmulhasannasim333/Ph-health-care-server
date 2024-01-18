export const reviewFilterableFields: string[] = ['patientEmail', 'doctorEmail'];

export const reviewRelationalFields: string[] = ['patientEmail', 'doctorEmail'];

export const reviewRelationalFieldsMapper: { [key: string]: string } = {
  patientEmail: 'patient',
  doctorEmail: 'doctor',
};
