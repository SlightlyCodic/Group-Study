import { createTRPCRouter } from "./create-context.js";
import hiRoute from "./example/hi/route.js";
import createUserRoute from "./users/create/route.js";
import updateStatusRoute from "./users/update-status/route.js";
import createGroupRoute from "./groups/create/route.js";
import joinGroupRoute from "./groups/join/route.js";
import leaveGroupRoute from "./groups/leave/route.js";
import getUserGroupsRoute from "./groups/get-user-groups/route.js";
import createNotificationsRoute from "./notifications/create/route.js";
import getUserNotificationsRoute from "./notifications/get-user-notifications/route.js";
import markNotificationReadRoute from "./notifications/mark-read/route.js";

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