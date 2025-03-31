import { API_ROUTES } from "../../apiRoutesHeader.js";
import { 
    handleMoveAction,
    handleAddRemoveAction,
    handleChecklistAction,
    handleMembersAction,
    handleContentAction,
    handleDatesAction,
    handleFieldsAction,
    handleSortAction,
    handleIntegrationAction
} from './actionFormLogic.js';

const API_BASE_URL = ENV.API_BASE_URL;

// Action Form Handler
export function initializeActionForm() {
    const actionTabs = document.querySelectorAll('.action-tab');
    const actionForms = document.querySelectorAll('.action-form');
    const actionButtons = document.querySelectorAll('.action-form .btn-primary');

    // Initialize with empty message
    document.addEventListener('DOMContentLoaded', () => {
        showEmptyMessage();
    });

    // Add click event listeners to tabs
    actionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const actionType = tab.getAttribute('data-action');
            handleTabClick(actionType, actionForms, actionTabs);
        });
    });

    // Add click event listeners to action buttons
    actionButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            handleActionButtonClick(button);
        });
    });
}

// Tab handling
function handleTabClick(actionType, actionForms, actionTabs) {
            // Remove active class from all forms and tabs
            actionForms.forEach(form => form.classList.remove('active'));
            actionTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to selected form and tab
            const targetForm = document.querySelector(`.action-form[data-action="${actionType}"]`);
            if (targetForm) {
                targetForm.classList.add('active');
        const tab = document.querySelector(`.action-tab[data-action="${actionType}"]`);
                tab.classList.add('active');
        updateActionsMessage(targetForm);
    }
}

// Action button click handling
async function handleActionButtonClick(button) {
    const formGroup = button.closest('.input-group');
    const form = formGroup.closest('.action-form');
    const actionType = form.getAttribute('data-action');
    
    const values = getFormValues(formGroup);
    const action = formatAction(actionType, values);
    
    if (action.handler) {
        try {
            // For testing, use default ticket ID 504
            const ticketId = 504;
            
            await action.handler(values, ticketId);
            showFeedback(formGroup, 'success', 'Action executed successfully!');
        } catch (error) {
            console.error('Error executing action:', error);
            showFeedback(formGroup, 'danger', error.message || 'Error executing action. Please try again.');
        }
    }
    
    updateActionsDisplay(action);
}

// Helper Functions
function getFormValues(formGroup) {
    const inputs = formGroup.querySelectorAll('input, select');
    return Array.from(inputs)
        .map(input => input.readOnly ? input.value : input.value)
        .filter(value => value && value !== 'Select a list');
}

function showFeedback(container, type, message) {
    const feedback = document.createElement('div');
    feedback.className = `alert alert-${type} mt-2`;
    feedback.textContent = message;
    container.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2000);
}

function showEmptyMessage() {
    const actionsList = document.querySelector('.actions-list');
    actionsList.innerHTML = `
        <p class="text-muted mb-0">Your automation doesn't perform any actions yet. Add some actions from below.</p>
    `;
}

    function updateActionsMessage(form) {
        const actionsContainer = form.querySelector('.actions-container');
        const messageElement = form.querySelector('.actions-message');
        const actions = getFormActions();

    if (actions.length === 0 && !messageElement) {
                const message = document.createElement('div');
                message.className = 'bg-light p-3 rounded mb-3 actions-message';
                message.innerHTML = '<p class="text-muted mb-0">Your automation doesn\'t perform any actions yet. Add some actions from below.</p>';
                actionsContainer.appendChild(message);
    } else if (actions.length > 0 && messageElement) {
            messageElement.remove();
        }
    }

    function updateActionsDisplay(action) {
    if (!action?.type || !action?.action) return;

        const actionsList = document.querySelector('.actions-list');
    const actionItem = createActionItem(action);
    actionsList.appendChild(actionItem);
}
        
function createActionItem(action) {
            const actionItem = document.createElement('div');
            actionItem.className = 'action-item d-flex align-items-center gap-2 mb-2';
            actionItem.innerHTML = `
                <div class="form-check mb-0">
                    <input class="form-check-input" type="checkbox" checked>
                </div>
                <p class="text-muted mb-0">
                    <strong>${action.type}:</strong> ${action.action}
                </p>
                <button class="btn btn-link text-danger p-0 ms-auto remove-action">
                    <i class="ti ti-x"></i>
                </button>
            `;
        
            actionItem.querySelector('.remove-action').addEventListener('click', () => {
                actionItem.remove();
        if (!actionsList.children.length) {
                    showEmptyMessage();
                }
            });
        
    return actionItem;
}

// Action Formatting Functions
function formatAction(actionType, values) {
    const formatters = {
        move: formatMoveAction,
        'add-remove': formatAddRemoveAction,
        checklist: formatChecklistAction,
        members: formatMembersAction,
        content: formatContentAction,
        dates: formatDatesAction,
        fields: formatFieldsAction,
        sort: formatSortAction,
        archive: formatArchiveAction,
        jira: formatJiraAction,
        bitbucket: formatBitbucketAction,
        slack: formatSlackAction
    };

    return formatters[actionType]?.(values) || { type: actionType, values };
}

function formatMoveAction(values) {
    return {
        type: 'move',
        action: values.join(' '),
        handler: handleMoveAction
    };
}

function formatAddRemoveAction(values) {
    return {
        type: 'add-remove',
        action: values.join(' '),
        handler: handleAddRemoveAction
    };
}

function formatChecklistAction(values) {
    return {
        type: 'checklist',
        action: values.join(' '),
        handler: handleChecklistAction
    };
}

function formatMembersAction(values) {
    return {
        type: 'members',
        action: values.join(' '),
        handler: handleMembersAction
    };
}

function formatContentAction(values) {
            return {
                type: 'content',
        action: values.join(' '),
        handler: handleContentAction
    };
}

function formatDatesAction(values) {
    return {
        type: 'dates',
        action: values.join(' '),
        handler: handleDatesAction
    };
}

function formatFieldsAction(values) {
    return {
        type: 'fields',
        action: values.join(' '),
        handler: handleFieldsAction
    };
}

function formatSortAction(values) {
    return {
        type: 'sort',
        action: values.join(' '),
        handler: handleSortAction
    };
}

function formatArchiveAction(values) {
    return {
        type: 'archive',
        action: values.join(' '),
        handler: handleArchiveAction
    };
}

function formatJiraAction(values) {
    return {
        type: 'jira',
        action: values.join(' '),
        handler: handleIntegrationAction
    };
}

function formatBitbucketAction(values) {
    return {
        type: 'bitbucket',
        action: values.join(' '),
        handler: handleIntegrationAction
    };
}

function formatSlackAction(values) {
    return {
        type: 'slack',
        action: values.join(' '),
        handler: handleIntegrationAction
    };
}

// Form Actions
export function getFormActions() {
    const actions = [];
    const activeForm = document.querySelector('.action-form.active');
    
    if (activeForm) {
        const actionType = activeForm.getAttribute('data-action');
        const formGroups = activeForm.querySelectorAll('.input-group');
        
        formGroups.forEach(group => {
            const values = getFormValues(group);
            if (values.length > 0) {
                actions.push({
                    type: actionType,
                    action: values.join(' ')
                });
            }
        });
    }
    
    return actions;
}

// Save Button Handler
document.getElementById('saveCustomButton')?.addEventListener('click', handleSaveButton);

async function handleSaveButton() {
    const buttonTitle = document.getElementById('buttonTitle').value;
    
    if (!buttonTitle || buttonTitle.trim() === '') {
        showFeedback(document.querySelector('.create-button-section'), 'danger', 'Please enter a button title');
        return;
    }
    
    const actions = collectActions();
    
    if (!actions || actions.length === 0) {
        showFeedback(document.querySelector('.create-button-section'), 'danger', 'Please add at least one action');
        return;
    }
    
    try {
        // Don't make API call on initial save
        updateButtonDisplay(buttonTitle, actions);
        showFeedback(document.querySelector('.create-button-section'), 'success', 'Button created successfully!');
        resetForm();
    } catch (error) {
        showFeedback(document.querySelector('.create-button-section'), 'danger', 'Error creating button. Please try again.');
    }
}

function collectActions() {
    const actions = [];
    const actionsList = document.querySelector('.actions-list');

    actionsList.querySelectorAll('.action-item').forEach(item => {
        const actionText = item.querySelector('p').textContent;
        const isEnabled = item.querySelector('.form-check-input').checked;
        const [actionType, actionValue] = actionText.split(':').map(str => str.trim());
        
        actions.push({
            text: actionText,
            enabled: isEnabled,
            type: actionType,
            action: actionValue,
            handler: getHandlerForType(actionType)
        });
    });

    return actions;
}

function getHandlerForType(actionType) {
    const handlers = {
        move: 'handleMoveAction',
        dates: 'handleDatesAction',
        checklist: 'handleChecklistAction',
        fields: 'handleFieldsAction',
        archive: 'handleArchiveAction',
        'add-remove': 'handleAddRemoveAction',
        members: 'handleMembersAction',
        content: 'handleContentAction',
        sort: 'handleSortAction',
        jira: 'handleIntegrationAction',
        bitbucket: 'handleIntegrationAction',
        slack: 'handleIntegrationAction'
    };

    return handlers[actionType.toLowerCase()];
}

async function saveButtonData(buttonTitle, actions) {
    const response = await fetch(`${API_BASE_URL}/automation-data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ticketId: 530,
            buttonTitle,
            buttonAction: actions
        })
    });

    if (!response.ok) throw new Error('Failed to save button');
    return response.json();
}

function updateButtonDisplay(buttonTitle, actions) {
    const buttonListSection = document.querySelector('.button-list-section .card-body');
    const existingButton = buttonListSection.querySelector(`[data-button-title="${buttonTitle}"]`);
    
    if (existingButton) {
        updateButtonListItem(existingButton, buttonTitle, actions);
    } else {
        const buttonListItem = createButtonListItem(buttonTitle, actions);
        buttonListSection.appendChild(buttonListItem);
    }
}

function resetForm() {
    document.getElementById('buttonTitle').value = '';
    document.querySelector('.actions-list').innerHTML = '';
    showEmptyMessage();
}

// Button List Item Functions
function createButtonListItem(buttonTitle, actions) {
    const buttonListItem = document.createElement('div');
    buttonListItem.className = 'mb-4';
    buttonListItem.setAttribute('data-button-title', buttonTitle);
    buttonListItem.setAttribute('data-actions', JSON.stringify(actions));

    buttonListItem.innerHTML = `
        <div class="d-flex align-items-center mb-2">
            <i class="ti ti-wand me-2"></i>
            <span class="fw-medium">${buttonTitle}</span>
            <div class="ms-2">
                <i class="ti ti-pencil me-2 edit-button"></i>
                <i class="ti ti-copy me-2 copy-button"></i>
                <i class="ti ti-trash delete-button"></i>
            </div>
        </div>
        <div class="bg-light p-2 rounded mb-2">${actions[0]?.text || ''}</div>
        <div class="d-flex align-items-center gap-3">
            <div class="form-check">
                <input class="form-check-input" type="radio" name="visibility-${buttonTitle}" value="show">
                <label class="form-check-label">Show on this board</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="visibility-${buttonTitle}" value="hide" checked>
                <label class="form-check-label">Hide on this board for you only</label>
                <i class="ti ti-info-circle ms-1" style="font-size: 14px;"></i>
            </div>
        </div>
        <div class="mt-2">
            <div class="text-muted mb-2">More options:</div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="showAllBoards-${buttonTitle}">
                <label class="form-check-label" for="showAllBoards-${buttonTitle}">Show on all Workspace visible boards</label>
            </div>
            <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" id="enableAnyone-${buttonTitle}">
                <label class="form-check-label" for="enableAnyone-${buttonTitle}">Anyone in Workspace can enable this button</label>
            </div>
        </div>
    `;

    // Add event listeners
    addButtonEventListeners(buttonListItem, buttonTitle, actions);

    return buttonListItem;
}

function addButtonEventListeners(buttonListItem, buttonTitle, actions) {
    // Button action listeners
    buttonListItem.querySelector('.edit-button').addEventListener('click', () => editButton(buttonTitle, actions));
    buttonListItem.querySelector('.copy-button').addEventListener('click', () => copyButton(buttonTitle, actions));
    buttonListItem.querySelector('.delete-button').addEventListener('click', () => deleteButton(buttonTitle));

    // Visibility radio listeners
    const radioButtons = buttonListItem.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', async (e) => {
            const visibility = e.target.value;
            // Only make API call when showing the button
            if (visibility === 'show') {
                const originalActions = JSON.parse(buttonListItem.getAttribute('data-actions'));
                try {
                    await updateButtonVisibility(buttonTitle, visibility, originalActions);
                    showFeedback(radio.closest('.d-flex'), 'success', 'Button is now visible on this board');
                } catch (error) {
                    showFeedback(radio.closest('.d-flex'), 'danger', 'Error updating button visibility. Please try again.');
                    // Revert radio selection on error
                    const hideRadio = buttonListItem.querySelector('input[value="hide"]');
                    if (hideRadio) hideRadio.checked = true;
                }
            }
        });
    });
}

async function updateButtonVisibility(buttonTitle, visibility, originalActions) {
    const updatedActions = originalActions.map(action => ({
        ...action,
        visibility: visibility,
        handler: action.handler
    }));

    const response = await fetch(`${API_BASE_URL}/automation-data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ticketId: 530,
            buttonTitle: buttonTitle,
            buttonAction: updatedActions
        })
    });

    if (!response.ok) throw new Error('Failed to update button visibility');
    return response.json();
}

function updateButtonListItem(existingButton, buttonTitle, actions) {
    existingButton.querySelector('.fw-medium').textContent = buttonTitle;
    existingButton.querySelector('.bg-light').textContent = actions[0]?.text || '';
    existingButton.setAttribute('data-actions', JSON.stringify(actions));
}

function editButton(buttonTitle, actions) {
    document.getElementById('buttonTitle').value = buttonTitle;
    const actionsList = document.querySelector('.actions-list');
    actionsList.innerHTML = '';
    
    actions.forEach(action => {
        const actionItem = document.createElement('div');
        actionItem.className = 'action-item d-flex align-items-center gap-2 mb-2';
        actionItem.innerHTML = `
            <div class="form-check mb-0">
                <input class="form-check-input" type="checkbox" ${action.enabled ? 'checked' : ''}>
            </div>
            <p class="text-muted mb-0" data-handler="${action.handler}">${action.text}</p>
            <button class="btn btn-link text-danger p-0 ms-auto remove-action">
                <i class="ti ti-x"></i>
            </button>
        `;
        actionsList.appendChild(actionItem);
    });
}

function copyButton(buttonTitle, actions) {
    const newTitle = `${buttonTitle} (Copy)`;
    const buttonListItem = createButtonListItem(newTitle, actions);
    document.querySelector('.button-list-section .card-body').appendChild(buttonListItem);
}

function deleteButton(buttonTitle) {
    const buttonListItem = document.querySelector(`[data-button-title="${buttonTitle}"]`);
    if (buttonListItem) buttonListItem.remove();
}