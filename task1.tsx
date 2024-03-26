interface UserData {
    user_id: string;
    logged_in: Date;
    logged_out: Date;
    devices: { device_id: string; lastSeenAt: Date }[];
}

function generateStats(usersData: UserData[]): [Record<number, number>, Record<number, number>] {
    const monthlyActiveUsers: Record<number, number> = {};
    const monthlyLoggedInUsers: Record<number, number> = {};

    usersData.forEach(user => {
        const loginMonth = user.logged_in.getMonth() + 1;
        const logoutMonth = new Date(Math.min(user.logged_out.getTime(), user.logged_in.getTime() + (6 * 30 * 24 * 60 * 60 * 1000))).getMonth() + 1;

        for (let month = loginMonth; month <= logoutMonth; month++) {
            if (!monthlyActiveUsers[month]) {
                monthlyActiveUsers[month] = 0;
                monthlyLoggedInUsers[month] = 0;
            }

            monthlyLoggedInUsers[month]++;

            if (month === loginMonth) {
                monthlyActiveUsers[month]++;
            }
        }
    });

    return [monthlyLoggedInUsers, monthlyActiveUsers];
}

const usersData: UserData[] = [
    {
        user_id: "1",
        logged_in: new Date("2024-01-05"),
        logged_out: new Date("2024-07-05"),
        devices: [
            { device_id: "device1", lastSeenAt: new Date("2024-01-05") },
            { device_id: "device2", lastSeenAt: new Date("2024-01-07") }
        ]
    },
];

const [monthlyLoggedInUsers, monthlyActiveUsers] = generateStats(usersData);

Object.entries(monthlyLoggedInUsers).forEach(([month, loggedInUsers]) => {
    const activeUsers = monthlyActiveUsers[parseInt(month)] || 0;
    console.log(`In month ${month}:`);
    console.log(`Logged in users: ${loggedInUsers}`);
    console.log(`Active users: ${activeUsers}`);
});
