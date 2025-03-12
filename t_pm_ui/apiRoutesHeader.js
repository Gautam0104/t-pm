export const API_ROUTES = {
  // Authentication
  AUTH_REGISTER: "auth/register",
  AUTH_LOGIN: "auth/login",
  AUTH_LOGOUT: "auth/logout",

  // Automation
  AUTOMATION_DATA: "/automation-data",
  AUTOMATION_TICKET_STATUS: "/update-ticket-status-automation",
  COPY_ROW_AUTOMATION: "/copy-row-automation",
  AUTOMATION_REMOVE_CHECKLIST: "/remove-checklist",
  AUTOMATION_TICKET_ETA: "/automation-ticket-eta",

    // Join Cards
    GET_JOIN_CARDS: "/get-join-cards",
    ADD_JOIN_CARD: "/add-join-card",
    DELETE_JOIN_CARD: "/delete-join-card",

    // Boards
    ADD_NEW_BOARD: "/add-new-board",
    GET_BOARDS: "/get-boards",
    DELETE_BOARD: "/delete-board",
    UPDATE_BOARD: "/update-board",
    COPY_BOARD: "/copy-board",
  


  // Rows and Checklists
  COPY_ROW: "/copy-row",
  GET_CHECKLIST: "/get-checklist",
  CREATE_CHECKLIST: "/create-checklist",

    // Kanban
    GET_KANBAN_ORDER: "/get-kanban-order",
    SAVE_KANBAN_ORDER: "/save-kanban-order",
    UPDATE_CURRENT_STATUS: "/update-ticket-current-status",

  // Projects
  CREATE_PROJECT: "/project",
  UPDATE_PROJECTS: "/update-project",
  DELETE_PROJECT: "/delete-project",
  PROJECT_DATA: "/projects",
  GET_SINGLE_PROJECT: "/project",

    // User Management
    GET_USERNAME: "/username",
    CREATE_TICKET_FROM_CALENDAR: "/calendar-ticket",
    CALENDAR_UPDATE: "/calendar-update",
    GET_USER_HISTORY: "/user-history",
    GET_USER: "/user",
    GET_USERS: "/users",
    UPDATE_USER: "/update-user",
    CLEAR_ROLE_HISTORY: "/clear-role-history",
    DELETE_ROLE: "/delete-role",
    GET_ROLE_HISTORY: "/role-history",
    TICKET_HISTORY: "/ticket-history",
    UPDATE_ROLES: "/update-role",
    DELETE_USER: "/delete-user",

    // Roles and History
    CREATE_ROLES: "/create-roles",
    GET_ROLES: "/get-roles",
    CLEAR_TICKET_HISTORY: "/clear-history",


    // Tickets
    CREATE_TICKET_CALENDAR: "/calendar-create-ticket",
    TICKET: "/ticket",
    UPDATE_TICKET_STATUS: "/update-ticket-status",
    GET_TICKET_BY_ID: "/ticket-by-id",
    DELETE_TICKET: "/delete-ticket",
    GET_TICKETS: "/tickets",
    UPDATE_TICKET: "/update-ticket",
};
