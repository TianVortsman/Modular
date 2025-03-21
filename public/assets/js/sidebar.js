document.addEventListener('DOMContentLoaded', function () {
    const bodyId = document.body.id;

    // Get current page path
    const currentPath = window.location.pathname;

    // Sidebar configurations
    const sidebarConfig = {
        "dashboard": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "/modular1/main/settings.php", icon: "settings", text: "Settings" },
            { href: "/modular1/main/exporting.php", icon: "upload", text: "Exporting" },
            { href: "/modular1/main/importing.php", icon: "download", text: "Importing" },
            { href: "../php/logout.php", icon: "exit_to_app", text: "LogOut" },
            { href: "/modular1/main/devices.php", icon: "devices", text: "Devices" },
        ],
        "invoice-dashboard": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "/modular1/modules/invoice/pages/invoices.php", icon: "description", text: "Invoices" },
            { href: "/modular1/modules/invoice/pages/invoice-products.php", icon: "inventory_2", text: "Products" },
            { href: "/modular1/modules/invoice/pages/invoice-clients.php", icon: "people", text: "Clients" },
            { href: "/modular1/modules/invoice/pages/invoice-payments.php", icon: "payment", text: "Payments" },
            { href: "/modular1/modules/invoice/pages/invoice-reports.php", icon: "bar_chart", text: "Reports" },
            { href: "/modular1/modules/invoice/pages/invoice-setup.php", icon: "build", text: "Setup" },
            { href: "/modular1/modules/invoice/pages/sales-reps.php", icon: "group", text: "Sales Reps" }
        ],
        "settings": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "#preferences-settings", icon: "settings", text: "Preferences", onclick: "activateSection('preferences-settings')" },
            { href: "#time-attendance-settings", icon: "schedule", text: "Time & Attendance", onclick: "activateSection('time-attendance-settings')" },
            { href: "#invoicing-settings", icon: "receipt", text: "Invoicing & Billing", onclick: "activateSection('invoicing-settings')" },
            { href: "#payroll-settings", icon: "payment", text: "Payroll", onclick: "activateSection('payroll-settings')" },
            { href: "#inventory-settings", icon: "inventory_2", text: "Inventory Management", onclick: "activateSection('inventory-settings')" },
            { href: "#crm-settings", icon: "people", text: "CRM", onclick: "activateSection('crm-settings')" },
            { href: "#project-management-settings", icon: "assignment", text: "Project Management", onclick: "activateSection('project-management-settings')" },
            { href: "#accounting-settings", icon: "account_balance", text: "Accounting", onclick: "activateSection('accounting-settings')" },
            { href: "#hr-settings", icon: "group", text: "HR Management", onclick: "activateSection('hr-settings')" },
            { href: "#support-settings", icon: "support_agent", text: "Support Module", onclick: "activateSection('support-settings')" },
            { href: "#fleet-settings", icon: "directions_car", text: "Fleet Management", onclick: "activateSection('fleet-settings')" },
            { href: "#asset-settings", icon: "business_center", text: "Asset Management", onclick: "activateSection('asset-settings')" },
            { href: "#access-control-settings", icon: "lock", text: "Access Control", onclick: "activateSection('access-control-settings')" }
        ],
        "invoice-clients": [
            { href: "/modular1/modules/invoice/invoice-dashboard.php", icon: "dashboard", text: "Dashboard" },
            { href: "#", icon: "person_add", text: "Add Client", onclick: "openAddClientModal()" },
            { href: "/modular1/modules/invoice/pages/invoice-payments.php", icon: "payment", text: "Payment Reminder" }
        ],
        "invoice-products": [
            { href: "/modular1/modules/invoice/invoice-dashboard.php", icon: "dashboard", text: "Dashboard"},
            { href: "#", icon: "category", text: "Products", tab: "products", class: "sidebar-button", onclick: "fetchProducts('products')" },
            { href: "#", icon: "build", text: "Parts", tab: "parts", class: "sidebar-button", onclick: "fetchProducts('parts')" },
            { href: "#", icon: "directions_car", text: "Vehicles", tab: "vehicles", class: "sidebar-button", onclick: "fetchProducts('vehicles')" },
            { href: "#", icon: "add_circle_outline", text: "Extras", tab: "extras", class: "sidebar-button", onclick: "fetchProducts('extras')" },
            { href: "#", icon: "remove_circle_outline", text: "Services", tab: "services", class: "sidebar-button", onclick: "fetchProducts('services')" }
        ],
        "payments":[
            { href: "/modular1/modules/invoice/invoice-dashboard.php", icon: "dashboard", text: "Dashboard" },
        ],
        "sales-reps":[
            { href: "/modular1/modules/invoice/invoice-dashboard.php", icon: "dashboard", text: "Dashboard" },
            { href: "#", icon: "person_add", text: "Add Sales Rep", onclick: "openAddSalesRepModal()" }
        ],
        "invoice-reports":[
            { href: "/modular1/modules/invoice/invoice-dashboard.php", icon: "dashboard", text: "Dashboard" },
            { href: "#sales-reports", icon: "bar_chart", text: "Sales Reports", onclick: "activateSection('sales-reports')" },
            { href: "#tax-reports", icon: "receipt", text: "Tax Reports", onclick: "activateSection('tax-reports')" },
            { href: "#income-reports", icon: "attach_money", text: "Income Reports", onclick: "activateSection('income-reports')" },
            { href: "#expenses-reports", icon: "money_off", text: "Expenses Reports", onclick: "activateSection('expenses-reports')" },
            { href: "#general-reports", icon: "assessment", text: "General Reports", onclick: "activateSection('general-reports')" }
        ],
        "accounting-dashboard": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "/modular1/modules/accounting/pages/general-ledger.php", icon: "book", text: "General Ledger" },
            { href: "/modular1/modules/accounting/pages/chart-of-accounts.php", icon: "account_tree", text: "Chart of Accounts" },
            { href: "/modular1/modules/accounting/pages/trial-balance.php", icon: "balance", text: "Trial Balance" },
            { href: "/modular1/modules/accounting/pages/profit-loss-report.php", icon: "bar_chart", text: "Profit & Loss Report" },
            { href: "/modular1/modules/accounting/pages/balance-sheet.php", icon: "assessment", text: "Balance Sheet" },
            { href: "/modular1/modules/accounting/pages/cash-flow-statement.php", icon: "show_chart", text: "Cash Flow" },
            { href: "/modular1/modules/accounting/pages/reconciliation.php", icon: "sync", text: "Reconciliation" },
            { href: "/modular1/modules/accounting/pages/journal-entries.php", icon: "edit", text: "Journal Entries" }
        ],
        "invoices": [
            { href: "/modular1/modules/invoice/invoice-dashboard.php", icon: "dashboard", text: "Dashboard", },
        ],
        "invoice-setup": [
            { href: "/modular1/modules/invoice/invoice-dashboard.php", icon: "dashboard", text: "Dashboard", },
        ],
        "TandA": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "/modular1/modules/timeandatt/pages/employees.php", icon: "people", text: "Employees" },
            { href: "/modular1/modules/timeandatt/pages/timecards.php", icon: "access_time", text: "Timecards" },
            { href: "/modular1/modules/timeandatt/pages/mobile-clocking.php", icon: "phone_android", text: "Mobile Clocking" },
            { href: "/modular1/modules/timeandatt/pages/reports.php", icon: "bar_chart", text: "Reports" },
            { href: "/modular1/modules/timeandatt/pages/devices.php", icon: "devices", text: "Devices" },
            { href: "/modular1/modules/timeandatt/pages/schedules.php", icon: "calendar_today", text: "Schedules" }
        ],
        "timecards": [
            { href: "/modular1/modules/timeandatt/dashboard-TA.php", icon: "dashboard", text: "Dashboard" },
            { href: "/modular1/modules/timeandatt/pages/employees.php", icon: "people", text: "Employees" },
            { href: "/modular1/modules/timeandatt/pages/timecards.php", icon: "access_time", text: "Timecards", active: true },
            { href: "/modular1/modules/timeandatt/pages/mobile-clocking.php", icon: "phone_android", text: "Mobile Clocking" },
            { href: "/modular1/modules/timeandatt/pages/reports.php", icon: "bar_chart", text: "Reports" },
            { href: "/modular1/modules/timeandatt/pages/devices.php", icon: "devices", text: "Devices" },
            { href: "/modular1/modules/timeandatt/pages/schedules.php", icon: "calendar_today", text: "Schedules" }
        ],
        "schedules": [
            { href: "/modular1/modules/timeandatt/dashboard-TA.php", icon: "dashboard", text: "Dashboard" },
            { href: "/modular1/modules/timeandatt/pages/employees.php", icon: "people", text: "Employees" },
            { href: "/modular1/modules/timeandatt/pages/timecards.php", icon: "access_time", text: "Timecards" },
            { href: "/modular1/modules/timeandatt/pages/mobile-clocking.php", icon: "phone_android", text: "Mobile Clocking" },
            { href: "/modular1/modules/timeandatt/pages/reports.php", icon: "bar_chart", text: "Reports" },
            { href: "/modular1/modules/timeandatt/pages/devices.php", icon: "devices", text: "Devices" },
            { href: "/modular1/modules/timeandatt/pages/schedules.php", icon: "calendar_today", text: "Schedules", active: true }
        ],
        "TA-employees": [
            { href: "/modular1/modules/timeandatt/dashboard-TA.php", icon: "dashboard", text: "Dashboard", },
            { href: "#", icon: "person_add", text: "Add Employee", onclick: "openAddEmployeeModal()" },
            { href: "/modular1/modules/timeandatt/pages/import-employees.php", icon: "upload_file", text: "Import Employees" }
        ],
        "hr-dashboard": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "/modular1/modules/hr/pages/employees.php", icon: "people", text: "Employees" },
            { href: "/modular1/modules/hr/pages/recruitment.php", icon: "person_add", text: "Recruitment" },
            { href: "/modular1/modules/hr/pages/performance.php", icon: "assessment", text: "Performance" },
            { href: "/modular1/modules/hr/pages/training.php", icon: "school", text: "Training" },
            { href: "/modular1/modules/hr/pages/documents.php", icon: "description", text: "Documents" },
            { href: "/modular1/modules/hr/pages/benefits.php", icon: "health_and_safety", text: "Benefits" },
            { href: "/modular1/modules/hr/pages/reports.php", icon: "bar_chart", text: "Reports" }
        ],
        "project-dashboard": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "/modular1/modules/project/pages/projects.php", icon: "assignment", text: "Projects" },
            { href: "/modular1/modules/project/pages/tasks.php", icon: "task", text: "Tasks" },
            { href: "/modular1/modules/project/pages/teams.php", icon: "groups", text: "Teams" },
            { href: "/modular1/modules/project/pages/timeline.php", icon: "timeline", text: "Timeline" },
            { href: "/modular1/modules/project/pages/resources.php", icon: "build", text: "Resources" },
            { href: "/modular1/modules/project/pages/reports.php", icon: "bar_chart", text: "Reports" }
        ],
        "inventory-dashboard": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "/modular1/modules/inventory/pages/items.php", icon: "inventory_2", text: "Items" },
            { href: "/modular1/modules/inventory/pages/stock.php", icon: "store", text: "Stock" },
            { href: "/modular1/modules/inventory/pages/suppliers.php", icon: "local_shipping", text: "Suppliers" },
            { href: "/modular1/modules/inventory/pages/orders.php", icon: "shopping_cart", text: "Orders" },
            { href: "/modular1/modules/inventory/pages/reports.php", icon: "bar_chart", text: "Reports" }
        ],
        "crm-dashboard": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "/modular1/modules/crm/pages/contacts.php", icon: "contacts", text: "Contacts" },
            { href: "/modular1/modules/crm/pages/leads.php", icon: "trending_up", text: "Leads" },
            { href: "/modular1/modules/crm/pages/opportunities.php", icon: "lightbulb", text: "Opportunities" },
            { href: "/modular1/modules/crm/pages/campaigns.php", icon: "campaign", text: "Campaigns" },
            { href: "/modular1/modules/crm/pages/reports.php", icon: "bar_chart", text: "Reports" }
        ],
        "support-dashboard": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "/modular1/modules/support/pages/tickets.php", icon: "confirmation_number", text: "Tickets" },
            { href: "/modular1/modules/support/pages/knowledge.php", icon: "menu_book", text: "Knowledge Base" },
            { href: "/modular1/modules/support/pages/faq.php", icon: "help", text: "FAQ" },
            { href: "/modular1/modules/support/pages/reports.php", icon: "bar_chart", text: "Reports" }
        ],
        "fleet-dashboard": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "/modular1/modules/fleet/pages/vehicles.php", icon: "directions_car", text: "Vehicles" },
            { href: "/modular1/modules/fleet/pages/maintenance.php", icon: "build", text: "Maintenance" },
            { href: "/modular1/modules/fleet/pages/drivers.php", icon: "person", text: "Drivers" },
            { href: "/modular1/modules/fleet/pages/trips.php", icon: "map", text: "Trips" },
            { href: "/modular1/modules/fleet/pages/fuel.php", icon: "local_gas_station", text: "Fuel Log" },
            { href: "/modular1/modules/fleet/pages/reports.php", icon: "bar_chart", text: "Reports" }
        ],
        "asset-dashboard": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "/modular1/modules/asset/pages/assets.php", icon: "business_center", text: "Assets" },
            { href: "/modular1/modules/asset/pages/maintenance.php", icon: "build", text: "Maintenance" },
            { href: "/modular1/modules/asset/pages/depreciation.php", icon: "trending_down", text: "Depreciation" },
            { href: "/modular1/modules/asset/pages/licenses.php", icon: "vpn_key", text: "Licenses" },
            { href: "/modular1/modules/asset/pages/reports.php", icon: "bar_chart", text: "Reports" }
        ],
        "access-dashboard": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "/modular1/modules/access/pages/users.php", icon: "people", text: "Users" },
            { href: "/modular1/modules/access/pages/roles.php", icon: "admin_panel_settings", text: "Roles" },
            { href: "/modular1/modules/access/pages/permissions.php", icon: "security", text: "Permissions" },
            { href: "/modular1/modules/access/pages/logs.php", icon: "history", text: "Access Logs" },
            { href: "/modular1/modules/access/pages/reports.php", icon: "bar_chart", text: "Reports" }
        ],
        "payroll-dashboard": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "/modular1/modules/payroll/pages/salaries.php", icon: "payments", text: "Salaries" },
            { href: "/modular1/modules/payroll/pages/deductions.php", icon: "remove_circle", text: "Deductions" },
            { href: "/modular1/modules/payroll/pages/benefits.php", icon: "add_circle", text: "Benefits" },
            { href: "/modular1/modules/payroll/pages/taxes.php", icon: "receipt", text: "Taxes" },
            { href: "/modular1/modules/payroll/pages/reports.php", icon: "bar_chart", text: "Reports" }
        ],
        "mobile-dashboard": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "/modular1/modules/mobile/pages/settings.php", icon: "settings", text: "Settings" },
            { href: "/modular1/modules/mobile/pages/users.php", icon: "people", text: "Users" },
            { href: "/modular1/modules/mobile/pages/notifications.php", icon: "notifications", text: "Notifications" },
            { href: "/modular1/modules/mobile/pages/sync.php", icon: "sync", text: "Sync" },
            { href: "/modular1/modules/mobile/pages/reports.php", icon: "bar_chart", text: "Reports" }
        ],
        "importing": [
            { href: "/modular1/main/dashboard.php", icon: "home", text: "Home" },
            { href: "#timeandatt", icon: "schedule", text: "Time & Attendance", onclick: "activateSection('timeandatt')" },
            { href: "#accounting", icon: "account_balance", text: "Accounting", onclick: "activateSection('accounting')" },
            { href: "#payroll", icon: "payments", text: "Payroll Management", onclick: "activateSection('payroll')" },
            { href: "#access", icon: "security", text: "Access Control", onclick: "activateSection('access')" },
            { href: "#asset", icon: "inventory", text: "Asset Management", onclick: "activateSection('asset')" },
            { href: "#fleet", icon: "directions_car", text: "Fleet Management", onclick: "activateSection('fleet')" },
            { href: "#support", icon: "support_agent", text: "Support/Help Desk", onclick: "activateSection('support')" },
            { href: "#crm", icon: "people", text: "Customer Relationship", onclick: "activateSection('crm')" },
            { href: "#inventory", icon: "inventory_2", text: "Inventory Management", onclick: "activateSection('inventory')" },
            { href: "#project", icon: "assignment", text: "Project Management", onclick: "activateSection('project')" },
            { href: "#hr", icon: "person", text: "Human Resources", onclick: "activateSection('hr')" },
            { href: "#invoice", icon: "receipt", text: "Invoice Management", onclick: "activateSection('invoice')" }
        ]
    };
    

    /**
     * Initialize sidebar based on the current body ID
     */
    function initializeSidebar() {
        const sidebarItems = sidebarConfig[bodyId] || [];
        const sidebar = document.querySelector('.modular-nav-items');

        if (!sidebar) return;

        // Clear existing items
        sidebar.innerHTML = '';

        // Add items from configuration
        sidebarItems.forEach(item => {
            const li = document.createElement('li');
            const onclick = item.onclick ? `onclick="${item.onclick}"` : '';

            li.innerHTML = `
                <a href="${item.href}" ${onclick} class="${item.tab ? 'tab' : ''}" ${item.tab ? `data-tab="${item.tab}"` : ''}>
                    <i class="material-icons">${item.icon}</i>
                    <span class="nav-text">${item.text}</span>
                </a>
            `;
            sidebar.appendChild(li);
        });
    }

    /**
     * Setup tab switching for pages with tabs (like invoice-products)
     */
    function setupTabs() {
        if (!sidebarConfig[bodyId]?.some(item => item.tab)) return;

        document.querySelectorAll('.tab').forEach(tabButton => {
            tabButton.addEventListener('click', function (event) {
                event.preventDefault();
                const tab = this.getAttribute('data-tab');

                // Remove active class from all tabs and tab contents
                document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

                // Add active class to the clicked tab and corresponding tab content
                this.classList.add('active');
                const tabContent = document.getElementById(tab);
                if (tabContent) tabContent.classList.add('active');
            });
        });
    }
    /**
     * Sidebar toggle functionality
     */
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    // Configuration object for toggling classes
    const toggleConfig = {
        dashboard: {
            targetId: 'mainContent',
            toggleClasses: ['collapsed']
        },
        'invoice-dashboard': {
            targetId: 'main-content',
            toggleClasses: ['collapsed']
        },
        settings: {
            targetId: 'settings-container',
            toggleClasses: ['collapsed']
        },
        'invoice-clients': {
            targetId: 'clients-screen',
            toggleClasses: ['collapsed']
        },
        'invoice-products': {
            targetId: 'products-container',
            toggleClasses: ['collapsed']
        },
        'payments':{
            targetId: 'payments-container',
            toggleClasses: ['collapsed']
        },
        'sales-reps':{
            targetId: 'sales-reps-container',
            toggleClasses: ['collapsed']
        },
        'invoices':{
            targetId: 'screen-container',
            toggleClasses: ['collapsed']
        },
        'TandA':{
            targetId: '.dashboard-container',
            toggleClasses: ['collapsed']
        },
        'invoice-setup':{
            targetId: '.container',
            toggleClasses: ['collapsed']
        },
        'schedules': {
            targetId: 'schedule-container',
            toggleClasses: ['collapsed']
        },
        'importing': {
            targetId: 'import-container',
            toggleClasses: ['collapsed']
        }
    };

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            // Toggle the sidebar class
            sidebar?.classList.toggle('collapsed');

            // Check if a configuration exists for the current body ID
            if (toggleConfig[bodyId]) {
                const { targetId, toggleClasses } = toggleConfig[bodyId];
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Toggle all classes defined in the configuration
                    toggleClasses.forEach(className => {
                        targetElement.classList.toggle(className);
                    });
                }
            }
        });
    }

    /**
     * Session exit button logic
     */
    const exitButton = document.getElementById('exit-button');
    if (exitButton) {
        exitButton.addEventListener('click', function (event) {
            event.preventDefault();
            fetch('/path/to/session/status/endpoint')
                .then(response => response.json())
                .then(data => {
                    if (data.tech_logged_in) {
                        window.location.href = 'techlogin.php';
                    } else if (data.user_logged_in) {
                        window.location.href = '../index.php';
                    }
                })
                .catch(error => console.error('Error fetching session status:', error));
        });
    }

    // Initialize sidebar and page-specific logic
    initializeSidebar();
    setupTabs();

    // Initialize notification system
    initializeNotifications();

});

function checkMultipleAccounts() {
    if (multipleAccounts) {
        window.location.href = "/modular1/main/choose-account.php"; // Redirect if session variable is set
    }
}

/**
 * Notification System
 */
function initializeNotifications() {
    const notificationBell = document.getElementById('notification-bell');
    const notificationsModal = document.getElementById('notifications-modal');
    const closeNotificationsBtn = document.querySelector('.close-notifications');
    const markAllReadBtn = document.getElementById('mark-all-read');
    const loadMoreBtn = document.getElementById('load-more-notifications');
    const tabButtons = document.querySelectorAll('.tab-button');
    
    // Current state variables
    let currentTab = 'all';
    let currentPage = 1;
    const notificationsPerPage = 10;
    
    // Toggle notifications modal when bell is clicked
    if (notificationBell) {
        notificationBell.addEventListener('click', () => {
            notificationsModal.classList.remove('hidden');
            notificationsModal.classList.add('visible');
            
            // Load notifications if this is the first open
            if (document.querySelector('.no-notifications')) {
                loadNotifications(currentTab, currentPage, true);
            }
        });
    }
    
    // Close notifications modal when close button is clicked
    if (closeNotificationsBtn) {
        closeNotificationsBtn.addEventListener('click', () => {
            notificationsModal.classList.remove('visible');
            notificationsModal.classList.add('hidden');
        });
    }
    
    // Handle tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            
            // Update current tab and reload notifications
            currentTab = button.getAttribute('data-tab');
            currentPage = 1;
            loadNotifications(currentTab, currentPage, true);
        });
    });
    
    // Handle mark all as read
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            markAllNotificationsAsRead();
        });
    }
    
    // Handle load more
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            loadNotifications(currentTab, currentPage, false);
        });
    }
    
    // Fetch notifications count on load and periodically
    updateNotificationCount();
    
    // Poll for new notifications every minute
    setInterval(updateNotificationCount, 60000);
}

/**
 * Load notifications based on tab and page
 * @param {string} tab - The notification tab to load
 * @param {number} page - The page number to load
 * @param {boolean} reset - Whether to reset the list or append
 */
function loadNotifications(tab, page, reset) {
    const notificationsList = document.getElementById('notifications-list');
    
    // Show loading state
    if (reset) {
        notificationsList.innerHTML = '<div class="notification-loading">Loading...</div>';
    } else {
        // Add loading indicator at the end
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'notification-loading';
        loadingDiv.textContent = 'Loading...';
        notificationsList.appendChild(loadingDiv);
    }
    
    // Fetch notifications from the server
    fetch(`/modular1/api/notifications.php?tab=${tab}&page=${page}`)
        .then(response => response.json())
        .then(data => {
            // Remove loading indicators
            const loadingElements = notificationsList.querySelectorAll('.notification-loading');
            loadingElements.forEach(el => el.remove());
            
            if (reset) {
                notificationsList.innerHTML = '';
            }
            
            if (data.notifications && data.notifications.length > 0) {
                // Create and append notification items
                data.notifications.forEach(notification => {
                    const notificationElement = createNotificationItem(notification);
                    notificationsList.appendChild(notificationElement);
                });
                
                // Hide load more button if no more notifications
                const loadMoreBtn = document.getElementById('load-more-notifications');
                if (data.has_more) {
                    loadMoreBtn.style.display = 'block';
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            } else if (reset) {
                // Show no notifications message
                notificationsList.innerHTML = '<div class="no-notifications">No notifications to display</div>';
            }
        })
        .catch(error => {
            console.error('Error fetching notifications:', error);
            const loadingElements = notificationsList.querySelectorAll('.notification-loading');
            loadingElements.forEach(el => el.remove());
            
            if (reset) {
                notificationsList.innerHTML = '<div class="no-notifications">Error loading notifications</div>';
            }
        });
}

/**
 * Create a notification item element
 * @param {Object} notification - The notification data
 * @returns {HTMLElement} - The notification item element
 */
function createNotificationItem(notification) {
    const item = document.createElement('div');
    item.className = `notification-item ${notification.is_read ? '' : 'unread'}`;
    item.setAttribute('data-id', notification.id);
    
    const header = document.createElement('div');
    header.className = 'notification-header';
    
    const title = document.createElement('div');
    title.className = 'notification-title';
    title.textContent = notification.title;
    
    const time = document.createElement('div');
    time.className = 'notification-time';
    time.textContent = formatNotificationTime(notification.created_at);
    
    header.appendChild(title);
    header.appendChild(time);
    
    const message = document.createElement('div');
    message.className = 'notification-message';
    message.textContent = notification.message;
    
    const footer = document.createElement('div');
    footer.className = 'notification-footer';
    
    const source = document.createElement('div');
    source.className = 'notification-source';
    source.textContent = notification.source;
    
    const actions = document.createElement('div');
    actions.className = 'notification-actions';
    
    if (!notification.is_read) {
        const markReadAction = document.createElement('span');
        markReadAction.className = 'notification-action';
        markReadAction.textContent = 'Mark as read';
        markReadAction.addEventListener('click', (e) => {
            e.stopPropagation();
            markNotificationAsRead(notification.id);
        });
        actions.appendChild(markReadAction);
    }
    
    footer.appendChild(source);
    footer.appendChild(actions);
    
    item.appendChild(header);
    item.appendChild(message);
    item.appendChild(footer);
    
    // Mark notification as read when clicked
    item.addEventListener('click', () => {
        if (!notification.is_read) {
            markNotificationAsRead(notification.id);
        }
        
        // Handle notification action if specified
        if (notification.action_url) {
            window.location.href = notification.action_url;
        }
    });
    
    return item;
}

/**
 * Format notification timestamp
 * @param {string} timestamp - The notification timestamp
 * @returns {string} - Formatted time string
 */
function formatNotificationTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);
    
    if (diffSec < 60) {
        return 'Just now';
    } else if (diffMin < 60) {
        return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHr < 24) {
        return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
        // Format as MM/DD/YYYY
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }
}

/**
 * Mark a notification as read
 * @param {number} id - The notification ID
 */
function markNotificationAsRead(id) {
    fetch(`/modular1/api/notifications.php?action=mark_read&id=${id}`, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update UI
                const notificationItem = document.querySelector(`.notification-item[data-id="${id}"]`);
                if (notificationItem) {
                    notificationItem.classList.remove('unread');
                    
                    // Remove 'Mark as read' action
                    const markReadAction = notificationItem.querySelector('.notification-action');
                    if (markReadAction) {
                        markReadAction.remove();
                    }
                }
                
                // Update notification count
                updateNotificationCount();
            }
        })
        .catch(error => {
            console.error('Error marking notification as read:', error);
        });
}

/**
 * Mark all notifications as read
 */
function markAllNotificationsAsRead() {
    fetch('/modular1/api/notifications.php?action=mark_all_read', {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update UI
                const unreadItems = document.querySelectorAll('.notification-item.unread');
                unreadItems.forEach(item => {
                    item.classList.remove('unread');
                    
                    // Remove 'Mark as read' action
                    const markReadAction = item.querySelector('.notification-action');
                    if (markReadAction) {
                        markReadAction.remove();
                    }
                });
                
                // Update notification count
                updateNotificationCount(0);
            }
        })
        .catch(error => {
            console.error('Error marking all notifications as read:', error);
        });
}

/**
 * Update the notification count badge
 */
function updateNotificationCount() {
    fetch('/modular1/api/notifications.php?action=count')
        .then(response => response.json())
        .then(data => {
            const countElement = document.getElementById('notification-count');
            if (countElement) {
                countElement.textContent = data.count;
                
                // Show/hide the badge based on count
                if (data.count > 0) {
                    countElement.style.display = 'flex';
                } else {
                    countElement.style.display = 'none';
                }
            }
        })
        .catch(error => {
            console.error('Error fetching notification count:', error);
        });
}



