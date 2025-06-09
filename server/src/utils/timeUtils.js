export const isWorkingHours = () => {
  const now = new Date();
  const hours = now.getHours();
  const day = now.getDay();

  // Check if it's Monday-Saturday (0 = Sunday, 1-6 = Monday-Saturday)
  const isWorkingDay = day >= 0 && day <= 6;
  // Check if it's between 8 AM and 6 PM
  const isWorkingTime = hours >= 8 && hours < 24;

  return isWorkingDay && isWorkingTime;
};
