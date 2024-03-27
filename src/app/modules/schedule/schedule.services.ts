import { Prisma, Schedule } from '@prisma/client';
import { addHours, addMinutes, format } from 'date-fns';
import prisma from '../../../shared/prisma';
import { ISchedule, IScheduleFilterRequest } from './schedule.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const insertIntoDB = async (payload: ISchedule): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const intervalTime = 30; // Interval time in minutes

  const schedules: Schedule[] = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = addHours(new Date(currentDate), new Date(startTime).getHours());
    startDateTime.setMinutes(new Date(startTime).getMinutes());

    const endDateTime = addHours(new Date(currentDate), new Date(endTime).getHours());
    endDateTime.setMinutes(new Date(endTime).getMinutes());

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDate: startDateTime,
        endDate: addMinutes(startDateTime, intervalTime)
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDate: scheduleData.startDate,
          endDate: scheduleData.endDate
        }
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData
        });
        schedules.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

// const getAllFromDB = async (
//   filters: IScheduleFilterRequest,
//   options: IPaginationOptions,
// ): Promise<IGenericResponse<Schedule[]>> => {
//   const { limit, page, skip } = paginationHelpers.calculatePagination(options);
//   const { ...filterData } = filters;

//   const andConditions = [];

//   // if (searchTerm) {
//   //   andConditions.push({
//   //     OR: patientSearchableFields.map(field => ({
//   //       [field]: {
//   //         contains: searchTerm,
//   //         mode: 'insensitive',
//   //       },
//   //     })),
//   //   });
//   // }

//   if (Object.keys(filterData).length > 0) {
//     andConditions.push({
//       AND: Object.keys(filterData).map(key => {
//         return {
//           [key]: {
//             equals: (filterData as any)[key],
//           },
//         };
//       }),
//     });
//   }

//   const whereConditions: Prisma.ScheduleWhereInput =
//     andConditions.length > 0 ? { AND: andConditions } : {};

//   const result = await prisma.schedule.findMany({
//     where: whereConditions,
//     skip,
//     take: limit,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? { [options.sortBy]: options.sortOrder }
//         : {
//           createdAt: 'desc',
//         },
//   });
//   const total = await prisma.schedule.count({
//     where: whereConditions,
//   });

//   return {
//     meta: {
//       total,
//       page,
//       limit,
//     },
//     data: result,
//   };
// };

const getAllFromDB = async (
  filters: IScheduleFilterRequest,
  options: IPaginationOptions,
  user: any
): Promise<IGenericResponse<Schedule[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters; // Extracting startDate and endDate from filters

  const andConditions = [];

  // Adding date filtering conditions if startDate and endDate are provided
  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          startDate: {
            gte: startDate, // Greater than or equal to startDate
          },
        },
        {
          endDate: {
            lte: endDate, // Less than or equal to endDate
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};


  const doctorsSchedules = await prisma.doctorSchedule.findMany({
    where: {
      doctor: {
        email: user.email
      }
    }
  });

  const doctorScheduleIds = new Set(doctorsSchedules.map(schedule => schedule.scheduleId));

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: [...doctorScheduleIds]
      }
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
          createdAt: 'desc',
        },
  });
  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: [...doctorScheduleIds]
      }
    }
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Schedule | null> => {
  const result = await prisma.schedule.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Schedule> => {
  const result = await prisma.schedule.delete({
    where: {
      id,
    },
  });
  return result;
};

export const ScheduleService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
};
