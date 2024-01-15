import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    try {
        // Delete all records from the appointment table
        await prisma.doctorSchedule.deleteMany();

        console.log('All data from the appointment table has been deleted.');
    } catch (error) {
        console.error('Error deleting data:', error);
    } finally {
        // Close the Prisma client connection
        await prisma.$disconnect();
    }
}

// Run the seed function
seed();
