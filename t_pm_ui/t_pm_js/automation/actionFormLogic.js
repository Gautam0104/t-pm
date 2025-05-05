import { API_ROUTES } from "../../apiRoutesHeader.js";
import { ELEMENT_IDS } from "../element_id.js";
const API_BASE_URL = ENV.API_BASE_URL;

// Global error handler
function handleError(error, actionType) {
    console.error(`Error in ${actionType}:`, error);
    const messageBox = document.getElementById(ELEMENT_IDS.MESSAGE);
    if (messageBox) {
        messageBox.textContent = `Error executing ${actionType}: ${error.message}`;
        messageBox.style.color = "red";
    }
    throw error;
}

// Move Action Logic
export async function handleMoveAction(values, ticketId) {
    try {
        const [action, listName] = values;
        if (!action || !listName) {
            throw new Error('Invalid move action parameters');
        }

        const response = await fetch(`${API_BASE_URL}${API_ROUTES.AUTOMATION_DATA}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ticketId,
                action: 'move',
                listName,
                moveType: action
            })
        });

        if (!response.ok) {
            throw new Error('Failed to execute move action');
        }

        return response.json();
    } catch (error) {
        console.error('Error in move action:', error);
        throw error;
    }
}

// Add/Remove Action Logic
export async function handleAddRemoveAction(values, ticketId) {
    try {
        const [action, itemType, itemValue] = values;
        if (!action || !itemType) {
            throw new Error('Invalid add/remove action parameters');
        }

        const response = await fetch(`${API_BASE_URL}${API_ROUTES.AUTOMATION_DATA}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ticketId,
                action: 'add_remove',
                itemType,
                itemValue,
                operation: action
            })
        });

        if (!response.ok) {
            throw new Error('Failed to execute add/remove action');
        }

        return response.json();
    } catch (error) {
        console.error('Error in add/remove action:', error);
        throw error;
    }
}

// Checklist Action Logic
export async function handleChecklistAction(values, ticketId) {
    try {
        const [action, checklistName] = values;
        if (!action || !checklistName) {
            throw new Error('Invalid checklist action parameters');
        }

        const response = await fetch(`${API_BASE_URL}/${API_ROUTES.AUTOMATION_DATA}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ticketId,
                action: 'checklist',
                checklistName,
                operation: action
            })
        });

        if (!response.ok) {
            throw new Error('Failed to execute checklist action');
        }

        return response.json();
    } catch (error) {
        console.error('Error in checklist action:', error);
        throw error;
    }
}

// Members Action Logic
export async function handleMembersAction(values, ticketId) {
    try {
        const [action, username] = values;
        console.log('Members action values:', values);
        
        if (!action) {
            throw new Error('Missing required parameters for members action');
        }
        
        switch(action) {
            case 'join':
                return await joinCard(ticketId);
            case 'leave':
                return await leaveCard(ticketId);
            case 'subscribe':
                return await subscribeToCard(ticketId);
            case 'unsubscribe':
                return await unsubscribeFromCard(ticketId);
            case 'add':
                if (!username) throw new Error('Username is required for add member action');
                return await addMember(ticketId, username);
            case 'remove':
                if (!username) throw new Error('Username is required for remove member action');
                return await removeMember(ticketId, username);
            case 'random':
                return await addRandomMember(ticketId);
            case 'turn':
                return await addMemberInTurn(ticketId);
            case 'remove-all':
                return await removeAllMembers(ticketId);
            default:
                throw new Error(`Invalid members action: ${action}`);
        }
    } catch (error) {
        handleError(error, 'members action');
    }
}

// Content Action Logic
export async function handleContentAction(values, ticketId) {
    try {
        const [actionType, ...params] = values;
        console.log('Content action values:', values);
        
        if (!actionType) {
            throw new Error('Missing required parameters for content action');
        }
        
        switch(actionType) {
            case 'rename':
                if (!params[0]) throw new Error('New title is required for rename action');
                return await renameCard(ticketId, params[0]);
            case 'description':
                if (!params[0]) throw new Error('Description is required for description action');
                return await setCardDescription(ticketId, params[0]);
            case 'comment':
                if (!params[0]) throw new Error('Comment text is required for comment action');
                return await postComment(ticketId, params[0]);
            case 'email':
                if (params.length < 4) throw new Error('Missing required parameters for email action');
                return await sendEmailNotification(ticketId, params);
            case 'http':
                if (params.length < 2) throw new Error('Missing required parameters for HTTP action');
                return await handleHttpRequest(ticketId, params);
            default:
                throw new Error(`Invalid content action type: ${actionType}`);
        }
    } catch (error) {
        handleError(error, 'content action');
    }
}

// Dates Action Logic
export async function handleDatesAction(values, ticketId) {
    try {
        const [action, dateType, date] = values;
        console.log('Dates action values:', values);
        
        if (!action || !dateType) {
            throw new Error('Missing required parameters for dates action');
        }
        
        switch(action) {
            case 'mark':
                return await markCardStatus(ticketId, dateType);
            case 'set':
                if (!date) throw new Error('Date is required for set date action');
                return await setDate(ticketId, dateType, date);
            case 'move':
                if (!date) throw new Error('Date is required for move date action');
                return await moveDate(ticketId, dateType, date);
            case 'adjust':
                return await adjustDate(ticketId, dateType);
            default:
                throw new Error(`Invalid dates action: ${action}`);
        }
    } catch (error) {
        handleError(error, 'dates action');
    }
}

// Fields Action Logic
export async function handleFieldsAction(values, ticketId) {
    try {
        const [action, value] = values;
        console.log('Fields action values:', values);
        
        if (!action || !value) {
            throw new Error('Missing required parameters for fields action');
        }
        
        switch(action) {
            case 'priority':
                return await setPriority(ticketId, value);
            case 'status':
                return await setStatus(ticketId, value);
            case 'category':
                return await setCategory(ticketId, value);
            default:
                throw new Error(`Invalid fields action: ${action}`);
        }
    } catch (error) {
        handleError(error, 'fields action');
    }
}

// Sort Action Logic
export async function handleSortAction(values, ticketId) {
    try {
        const [action, ...params] = values;
        console.log('Sort action values:', values);
        
        if (!action) {
            throw new Error('Missing required parameters for sort action');
        }
        
        switch(action) {
            case 'due-date':
                return await sortByDueDate(ticketId, params[0]);
            case 'start-date':
                return await sortByStartDate(ticketId, params[0]);
            case 'title':
                return await sortByTitle(ticketId, params[0]);
            case 'votes':
                return await sortByVotes(ticketId, params[0]);
            case 'age':
                return await sortByAge(ticketId, params[0]);
            case 'time-in-list':
                return await sortByTimeInList(ticketId, params[0]);
            case 'label':
                return await sortByLabel(ticketId, params);
            default:
                throw new Error(`Invalid sort action: ${action}`);
        }
    } catch (error) {
        handleError(error, 'sort action');
    }
}

// Integration Action Logic
export async function handleIntegrationAction(values, ticketId) {
    try {
        const [action, ...params] = values;
        console.log('Integration action values:', values);
        
        if (!action) {
            throw new Error('Missing required parameters for integration action');
        }
        
        switch(action) {
            case 'jira':
                if (!params[0]) throw new Error('Issue ID is required for Jira action');
                return await linkJiraIssue(ticketId, params[0]);
            case 'bitbucket':
                if (!params[0]) throw new Error('PR URL is required for Bitbucket action');
                return await linkBitbucketPR(ticketId, params[0]);
            case 'slack':
                if (!params[0]) throw new Error('Channel is required for Slack action');
                return await sendToSlack(ticketId, params[0]);
            default:
                throw new Error(`Invalid integration action: ${action}`);
        }
    } catch (error) {
        handleError(error, 'integration action');
    }
}

// Helper Functions
async function createNewCard(values) {
    const [action, type, title, list] = values;
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.CREATE_CARD}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, list })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error creating card:", error);
        throw error;
    }
}

async function handleIconAction(values) {
    const [action, icon, position] = values;
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.ADD_ICON}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ icon, position })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error adding icon:", error);
        throw error;
    }
}

async function handleLinkAction(values) {
    const [action, url] = values;
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.ADD_LINK}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error adding link:", error);
        throw error;
    }
}

async function handleRemoveAction(values) {
    const [action, type] = values;
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.REMOVE_ITEM}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ type })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error removing item:", error);
        throw error;
    }
}

async function handleListAction(values) {
    const [action, listName, color] = values;
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.UPDATE_LIST}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ listName, color })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error updating list:", error);
        throw error;
    }
}

async function addChecklist(name, icon1, icon2) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.ADD_CHECKLIST}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, icon1, icon2 })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error adding checklist:", error);
        throw error;
    }
}

async function handleChecklistItem(values) {
    const [action, itemName, checklistName] = values;
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.ADD_CHECKLIST_ITEM}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ itemName, checklistName })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error adding checklist item:", error);
        throw error;
    }
}

async function handleChecklistCheck(values) {
    const [action, itemName, checklistName] = values;
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.CHECK_CHECKLIST_ITEM}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ itemName, checklistName })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error checking checklist item:", error);
        throw error;
    }
}

async function resetAllChecklists() {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.RESET_CHECKLISTS}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error resetting checklists:", error);
        throw error;
    }
}

async function removeChecklistItems(values) {
    const [action, type, checklistName] = values;
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.REMOVE_CHECKLIST_ITEMS}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ type, checklistName })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error removing checklist items:", error);
        throw error;
    }
}

async function joinCard(ticketId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.JOIN_CARD}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error joining card:", error);
        throw error;
    }
}

async function leaveCard(ticketId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.LEAVE_CARD}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error leaving card:", error);
        throw error;
    }
}

async function subscribeToCard(ticketId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.SUBSCRIBE_CARD}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error subscribing to card:", error);
        throw error;
    }
}

async function unsubscribeFromCard(ticketId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.UNSUBSCRIBE_CARD}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error unsubscribing from card:", error);
        throw error;
    }
}

async function addMember(ticketId, username) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.ADD_MEMBER}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, username })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error adding member:", error);
        throw error;
    }
}

async function removeMember(ticketId, username) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.REMOVE_MEMBER}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, username })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error removing member:", error);
        throw error;
    }
}

async function addRandomMember(ticketId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.ADD_RANDOM_MEMBER}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error adding random member:", error);
        throw error;
    }
}

async function addMemberInTurn(ticketId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.ADD_MEMBER_TURN}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error adding member in turn:", error);
        throw error;
    }
}

async function removeAllMembers(ticketId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.REMOVE_ALL_MEMBERS}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error removing all members:", error);
        throw error;
    }
}

async function renameCard(ticketId, newTitle) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.RENAME_CARD}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, newTitle })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error renaming card:", error);
        throw error;
    }
}

async function setCardDescription(ticketId, description) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.SET_DESCRIPTION}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, description })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error setting description:", error);
        throw error;
    }
}

async function postComment(ticketId, comment) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.POST_COMMENT}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, comment })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error posting comment:", error);
        throw error;
    }
}

async function sendEmailNotification(ticketId, params) {
    const [recipient, email, subject, message] = params;
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.SEND_EMAIL}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, recipient, email, subject, message })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

async function handleHttpRequest(ticketId, params) {
    const [method, url] = params;
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.HTTP_REQUEST}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, method, url })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error making HTTP request:", error);
        throw error;
    }
}

async function markCardStatus(ticketId, status) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.MARK_STATUS}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, status })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error marking status:", error);
        throw error;
    }
}

async function setDate(ticketId, dateType, date) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.SET_DATE}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, dateType, date })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error setting date:", error);
        throw error;
    }
}

async function moveDate(ticketId, dateType, date) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.MOVE_DATE}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, dateType, date })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error moving date:", error);
        throw error;
    }
}

async function adjustDate(ticketId, dateType) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.ADJUST_DATE}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, dateType })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error adjusting date:", error);
        throw error;
    }
}

async function setPriority(ticketId, value) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.SET_PRIORITY}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, value })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error setting priority:", error);
        throw error;
    }
}

async function setStatus(ticketId, value) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.SET_STATUS}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, value })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error setting status:", error);
        throw error;
    }
}

async function setCategory(ticketId, value) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.SET_CATEGORY}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, value })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error setting category:", error);
        throw error;
    }
}

async function sortByDueDate(ticketId, order) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.SORT_DUE_DATE}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, order })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error sorting by due date:", error);
        throw error;
    }
}

async function sortByStartDate(ticketId, order) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.SORT_START_DATE}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, order })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error sorting by start date:", error);
        throw error;
    }
}

async function sortByTitle(ticketId, order) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.SORT_TITLE}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, order })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error sorting by title:", error);
        throw error;
    }
}

async function sortByVotes(ticketId, order) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.SORT_VOTES}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, order })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error sorting by votes:", error);
        throw error;
    }
}

async function sortByAge(ticketId, order) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.SORT_AGE}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, order })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error sorting by age:", error);
        throw error;
    }
}

async function sortByTimeInList(ticketId, order) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.SORT_TIME_IN_LIST}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, order })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error sorting by time in list:", error);
        throw error;
    }
}

async function sortByLabel(ticketId, values) {
    const [color, order] = values;
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.SORT_LABEL}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, color, order })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error sorting by label:", error);
        throw error;
    }
}

async function linkJiraIssue(ticketId, issueId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.LINK_JIRA}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, issueId })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error linking Jira issue:", error);
        throw error;
    }
}

async function linkBitbucketPR(ticketId, prUrl) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.LINK_BITBUCKET}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, prUrl })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error linking Bitbucket PR:", error);
        throw error;
    }
}

async function sendToSlack(ticketId, channel) {
    try {
        const response = await fetch(
            `${API_BASE_URL}${API_ROUTES.SEND_SLACK}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ticketId, channel })
            }
        );
        return response.ok;
    } catch (error) {
        console.error("Error sending to Slack:", error);
        throw error;
    }
} 