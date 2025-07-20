import { createTRPCRouter } from "./create-context.js";
import hiRoute from "./routes/example/hi/route.js";
import createUserRoute from "./routes/users/create/route.js";
import updateStatusRoute from "./routes/users/update-status/route.js";
import createGroupRoute from "./routes/groups/create/route.js";
import joinGroupRoute from "./routes/groups/join/route.js";
import leaveGroupRoute from "./routes/groups/leave/route.js";
import getUserGroupsRoute from "./routes/groups/get-user-groups/route.js";
import createNotificationsRoute from "./routes/notifications/create/route.js";
import getUserNotificationsRoute from "./routes/notifications/get-user-notifications/route.js";
import markNotificationReadRoute from "./routes/notifications/mark-read/route.js";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  users: createTRPCRouter({
    create: createUserRoute,
    updateStatus: updateStatusRoute,
  }),
  groups: createTRPCRouter({
    create: createGroupRoute,
    join: joinGroupRoute,
    leave: leaveGroupRoute,
    getUserGroups: getUserGroupsRoute,
  }),
  notifications: createTRPCRouter({
    create: createNotificationsRoute,
    getUserNotifications: getUserNotificationsRoute,
    markRead: markNotificationReadRoute,
  }),
});