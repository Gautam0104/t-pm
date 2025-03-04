export const API_ROUTES = {
    // Authentication
    AUTH_REGISTER: "/register",
    AUTH_LOGIN: "/login",
    AUTH_LOGOUT: "/logout",

    // Automation
    AUTOMATION_DATA: "/automation-data",
    AUTOMATION_TICKET_STATUS: "/update-ticket-status-automation",
    COPY_ROW_AUTOMATION: "/copy-row-automation", 
    AUTOMATION_REMOVE_CHECKLIST: "/remove-checklist",

    // Join Cards
    GET_JOIN_CARDS: "/get-join-cards",
    ADD_JOIN_CARD: "/add-join-card",
    DELETE_JOIN_CARD: "/delete-join-card",

    // Boards
    ADD_NEW_BOARD: "/add-new-board",
    GET_BOARDS: "/getboards",
    DELETE_BOARD: "/deleteboard",
    UPDATE_BOARD: "/updateboard",
    COPY_BOARD: "/copy-board",

    // Rows and Checklists
    COPY_ROW: "/copy-row",
    GET_CHECKLIST: "/get-checklist",
    CREATE_CHECKLIST: "/create-checklist",

    // Kanban
    GET_KANBAN_ORDER: "/get-kanban-order",
    SAVE_KANBAN_ORDER: "/save-kanban-order",
    UPDATE_CURRENT_STATUS: "/updateticketstatus/:currentStatus/",

    // Projects
    CREATE_PROJECT: "/project",
    UPDATE_PROJECTS: "/updateproject",
    DELETE_PROJECT: "/deleteProject",
    PROJECT_DATA: "/projects",
    GET_SINGLE_PROJECT: "/project",

    // User Management
    GET_USERNAME: "/username/:username",
    CREATE_TICKET_FROM_CALENDAR: "/calendar-ticket",
    CALENDAR_UPDATE: "/calendarUpdate",
    GET_USER_HISTORY: "/user-history",
    GET_USER: "/user",
    UPDATE_USER: "/updateUser",
    CLEAR_ROLE_HISTORY: "/clearroleHistory",
    DELETE_ROLE: "/delete-role",
    GET_ROLE_HISTORY: "/role-history",
    TICKET_HISTORY: "/ticket-history",
    UPDATE_ROLES: "/updaterole",
    DELETE_USER: "/deleteUser",

    // Roles and History
    CREATE_ROLES: "/createRoles",
    GET_ROLES: "/GetRoles",
    CLEAR_TICKET_HISTORY: "/clearHistory",

    // Tickets
    CREATE_TICKET_CALENDAR: "/CalendarCreateTicket",
    CREATE_TICKET: "/ticket",
    UPDATE_TICKET_STATUS: "/updateTicketStatus",
    GET_TICKET_BY_ID: "/ticketbyid",
    DELETE_TICKETS: "/deletetickets",
    GET_TICKETS: "/tickets",
};
