// Cobble Hills Golf Booking App - Frontend JavaScript

// DOM Elements
const app = document.getElementById('app');
const navLinks = document.querySelectorAll('nav a');
const pages = document.querySelectorAll('.page');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const modalOverlay = document.getElementById('modal-overlay');
const modals = document.querySelectorAll('.modal');
const modalCloseButtons = document.querySelectorAll('.modal-close, .modal-cancel');
const toastContainer = document.getElementById('toast-container');

// Forms
const quickSearchForm = document.getElementById('quick-search-form');
const searchForm = document.getElementById('search-form');
const playerForm = document.getElementById('player-form');
const bookingForm = document.getElementById('booking-form');
const generalSettingsForm = document.getElementById('general-settings-form');
const schedulerSettingsForm = document.getElementById('scheduler-settings-form');
const notificationsSettingsForm = document.getElementById('notifications-settings-form');

// Buttons
const addPlayerBtn = document.getElementById('add-player-btn');
const refreshDashboardBtn = document.getElementById('refresh-dashboard');
const runSchedulerBtn = document.getElementById('run-scheduler');
const toggleSchedulerBtn = document.getElementById('toggle-scheduler');
const confirmActionBtn = document.getElementById('confirm-action');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Application Initialization
function initApp() {
  // Set current date as default for date inputs
  setDefaultDates();
  
  // Load initial data
  loadDashboardData();
  
  // Add event listeners
  setupEventListeners();
}

// Set default dates for date inputs
function setDefaultDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (input.id === 'quick-search-date' || input.id === 'search-date') {
      input.valueAsDate = tomorrow;
    }
  });
}

// Setup Event Listeners
function setupEventListeners() {
  // Navigation
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetPage = link.getAttribute('data-page');
      navigateToPage(targetPage);
    });
  });
  
  // Tab navigation
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabContainer = button.closest('.tabs').parentElement;
      const tabName = button.getAttribute('data-tab');
      
      // Update active tab button
      tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      // Show active tab content
      tabContainer.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      tabContainer.querySelector(`#${tabName}-tab`).classList.add('active');
    });
  });
  
  // Modal close buttons
  modalCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
      closeAllModals();
    });
  });
  
  // Close modals when clicking overlay
  modalOverlay.addEventListener('click', () => {
    closeAllModals();
  });
  
  // Add player button
  if (addPlayerBtn) {
    addPlayerBtn.addEventListener('click', () => {
      openModal('player-modal');
      document.getElementById('player-modal-title').textContent = 'Add Player';
      document.getElementById('player-id').value = '';
      playerForm.reset();
    });
  }
  
  // Refresh dashboard button
  if (refreshDashboardBtn) {
    refreshDashboardBtn.addEventListener('click', () => {
      loadDashboardData();
      showToast('Dashboard Refreshed', 'Dashboard data has been updated.', 'info');
    });
  }
  
  // Run scheduler button
  if (runSchedulerBtn) {
    runSchedulerBtn.addEventListener('click', () => {
      runScheduler();
    });
  }
  
  // Toggle scheduler button
  if (toggleSchedulerBtn) {
    toggleSchedulerBtn.addEventListener('click', () => {
      toggleScheduler();
    });
  }
  
  // Form submissions
  if (quickSearchForm) {
    quickSearchForm.addEventListener('submit', e => {
      e.preventDefault();
      const date = document.getElementById('quick-search-date').value;
      const players = document.getElementById('quick-search-players').value;
      
      // Navigate to search page and fill in the form
      navigateToPage('search');
      document.getElementById('search-date').value = date;
      document.getElementById('search-players').value = players;
      
      // Submit the search form
      searchForm.dispatchEvent(new Event('submit'));
    });
  }
  
  if (searchForm) {
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      searchTeeTimes();
    });
  }
  
  if (playerForm) {
    playerForm.addEventListener('submit', e => {
      e.preventDefault();
      savePlayer();
    });
  }
  
  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      bookTeeTime();
    });
  }
  
  if (generalSettingsForm) {
    generalSettingsForm.addEventListener('submit', e => {
      e.preventDefault();
      saveGeneralSettings();
    });
  }
  
  if (schedulerSettingsForm) {
    schedulerSettingsForm.addEventListener('submit', e => {
      e.preventDefault();
      saveSchedulerSettings();
    });
  }
  
  if (notificationsSettingsForm) {
    notificationsSettingsForm.addEventListener('submit', e => {
      e.preventDefault();
      saveNotificationSettings();
    });
  }
  
  // Confirm action button
  if (confirmActionBtn) {
    confirmActionBtn.addEventListener('click', () => {
      const action = confirmActionBtn.getAttribute('data-action');
      const id = confirmActionBtn.getAttribute('data-id');
      
      if (action === 'delete-player') {
        deletePlayer(id);
      } else if (action === 'cancel-booking') {
        cancelBooking(id);
      }
      
      closeAllModals();
    });
  }
  
  // Add click handlers for view-all links
  document.querySelectorAll('.view-all').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetPage = link.getAttribute('data-page');
      navigateToPage(targetPage);
    });
  });
}

// Navigation Functions
function navigateToPage(pageName) {
  // Update navigation links
  navLinks.forEach(link => {
    if (link.getAttribute('data-page') === pageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Show the selected page
  pages.forEach(page => {
    if (page.id === pageName) {
      page.classList.add('active');
      
      // Load page-specific data
      if (pageName === 'search') {
        // Nothing to load initially
      } else if (pageName === 'bookings') {
        loadBookings();
      } else if (pageName === 'players') {
        loadPlayers();
      } else if (pageName === 'settings') {
        loadSettings();
      }
    } else {
      page.classList.remove('active');
    }
  });
}

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modalOverlay.classList.remove('hidden');
    modal.classList.remove('hidden');
  }
}

function closeAllModals() {
  modalOverlay.classList.add('hidden');
  modals.forEach(modal => {
    modal.classList.add('hidden');
  });
}

// Toast Notification Function
function showToast(title, message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = '';
  switch (type) {
    case 'success':
      icon = '<i class="fas fa-check-circle toast-icon"></i>';
      break;
    case 'error':
      icon = '<i class="fas fa-exclamation-circle toast-icon"></i>';
      break;
    case 'warning':
      icon = '<i class="fas fa-exclamation-triangle toast-icon"></i>';
      break;
    default:
      icon = '<i class="fas fa-info-circle toast-icon"></i>';
  }
  
  toast.innerHTML = `
    ${icon}
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  // Remove toast after animation completes
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// API Functions
async function fetchAPI(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`/api/${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    showToast('Error', error.message, 'error');
    throw error;
  }
}

// Data Loading Functions
function loadDashboardData() {
  loadUpcomingBookingsForDashboard();
  loadSchedulerStatus();
  loadPlayersForDashboard();
}

// Mock data functions
function getMockPlayers() {
  return [
    { id: 'p1', name: 'John Smith', email: 'john@example.com', phone: '555-123-4567' },
    { id: 'p2', name: 'Jane Doe', email: 'jane@example.com', phone: '555-987-6543' },
    { id: 'p3', name: 'Bob Johnson', email: 'bob@example.com', phone: '555-456-7890' },
    { id: 'p4', name: 'Alice Williams', email: 'alice@example.com', phone: '555-789-0123' }
  ];
}

function getMockUpcomingBookings(limit) {
  const bookings = [
    {
      id: 'b1',
      date: '2025-06-05',
      time: '08:30',
      players: 4,
      playerNames: ['John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Williams'],
      useCart: true,
      status: 'Confirmed'
    },
    {
      id: 'b2',
      date: '2025-06-12',
      time: '09:00',
      players: 3,
      playerNames: ['John Smith', 'Jane Doe', 'Bob Johnson'],
      useCart: false,
      status: 'Confirmed'
    },
    {
      id: 'b3',
      date: '2025-06-19',
      time: '10:30',
      players: 4,
      playerNames: ['John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Williams'],
      useCart: true,
      status: 'Confirmed'
    },
    {
      id: 'b4',
      date: '2025-06-26',
      time: '07:30',
      players: 2,
      playerNames: ['John Smith', 'Jane Doe'],
      useCart: false,
      status: 'Confirmed'
    }
  ];
  
  return limit ? bookings.slice(0, limit) : bookings;
}

function getMockPastBookings() {
  return [
    {
      id: 'b5',
      date: '2025-05-29',
      time: '08:00',
      players: 4,
      playerNames: ['John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Williams'],
      useCart: true,
      status: 'Completed'
    },
    {
      id: 'b6',
      date: '2025-05-22',
      time: '09:30',
      players: 3,
      playerNames: ['John Smith', 'Jane Doe', 'Bob Johnson'],
      useCart: false,
      status: 'Completed'
    },
    {
      id: 'b7',
      date: '2025-05-15',
      time: '10:00',
      players: 4,
      playerNames: ['John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Williams'],
      useCart: true,
      status: 'Cancelled'
    }
  ];
}

function getMockTeeTimeResults(date, startTime, endTime, players) {
  // Generate random tee times for the given date
  const results = [];
  const teeTimeDate = new Date(date);
  
  // Convert start and end times to hours
  const startHour = startTime ? parseInt(startTime.split(':')[0]) : 7;
  const endHour = endTime ? parseInt(endTime.split(':')[0]) : 17;
  
  // Generate tee times at 10-minute intervals
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      // Skip some times randomly to simulate unavailability
      if (Math.random() < 0.7) continue;
      
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      results.push({
        id: `tt-${date}-${time}`,
        date: teeTimeDate.toISOString().split('T')[0],
        time: time,
        availableSpots: 4,
        price: 45 + (hour >= 10 && hour <= 14 ? 10 : 0) // Peak hours cost more
      });
    }
  }
  
  return results;
}

// Load data for dashboard sections
async function loadUpcomingBookingsForDashboard() {
  const upcomingBookingsList = document.getElementById('upcoming-bookings-list');
  if (!upcomingBookingsList) return;
  
  upcomingBookingsList.innerHTML = '<p class="loading">Loading upcoming bookings...</p>';
  
  try {
    // For demo purposes, we'll use mock data
    const bookings = getMockUpcomingBookings(3);
    
    if (bookings.length === 0) {
      upcomingBookingsList.innerHTML = '<p>No upcoming bookings.</p>';
      return;
    }
    
    let html = '';
    bookings.forEach(booking => {
      const date = new Date(booking.date);
      const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      
      html += `
        <div class="list-item">
          <div class="list-item-content">
            <div class="list-item-title">${booking.time} - ${formattedDate}</div>
            <div class="list-item-subtitle">${booking.players} players${booking.useCart ? ' with cart' : ''}</div>
          </div>
          <div class="list-item-actions">
            <button class="btn btn-secondary btn-sm" onclick="viewBookingDetails('${booking.id}')">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
      `;
    });
    
    upcomingBookingsList.innerHTML = html;
  } catch (error) {
    upcomingBookingsList.innerHTML = '<p>Failed to load bookings.</p>';
  }
}

async function loadSchedulerStatus() {
  const schedulerStatus = document.getElementById('scheduler-status');
  if (!schedulerStatus) return;
  
  schedulerStatus.innerHTML = '<p class="loading">Loading scheduler status...</p>';
  
  try {
    // For demo purposes, we'll use mock data
    const status = {
      enabled: false,
      nextRun: '2025-06-03T07:00:00',
      lastRun: '2025-06-02T07:00:00',
      lastRunStatus: 'success',
      targetDate: '2025-06-09',
      preferredTime: '09:00'
    };
    
    const nextRunDate = new Date(status.nextRun);
    const formattedNextRun = nextRunDate.toLocaleString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
    
    const targetDate = new Date(status.targetDate);
    const formattedTargetDate = targetDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
    
    let statusHtml = `
      <div class="status-item">
        <div class="status-label">Status:</div>
        <div class="status-value ${status.enabled ? 'status-enabled' : 'status-disabled'}">
          ${status.enabled ? 'Enabled' : 'Disabled'}
        </div>
      </div>
      <div class="status-item">
        <div class="status-label">Next Run:</div>
        <div class="status-value">${formattedNextRun}</div>
      </div>
      <div class="status-item">
        <div class="status-label">Target Date:</div>
        <div class="status-value">${formattedTargetDate} at ${status.preferredTime}</div>
      </div>
    `;
    
    schedulerStatus.innerHTML = statusHtml;
    
    // Update toggle button text
    const toggleText = document.getElementById('toggle-scheduler-text');
    if (toggleText) {
      toggleText.textContent = status.enabled ? 'Disable' : 'Enable';
    }
    
  } catch (error) {
    schedulerStatus.innerHTML = '<p>Failed to load scheduler status.</p>';
  }
}

async function loadPlayersForDashboard() {
  const playersList = document.getElementById('players-list');
  if (!playersList) return;
  
  playersList.innerHTML = '<p class="loading">Loading players...</p>';
  
  try {
    // For demo purposes, we'll use mock data
    const players = getMockPlayers().slice(0, 3);
    
    if (players.length === 0) {
      playersList.innerHTML = '<p>No players added yet.</p>';
      return;
    }
    
    let html = '';
    players.forEach(player => {
      html += `
        <div class="list-item">
          <div class="list-item-content">
            <div class="list-item-title">${player.name}</div>
            <div class="list-item-subtitle">${player.email || 'No email'}</div>
          </div>
        </div>
      `;
    });
    
    playersList.innerHTML = html;
  } catch (error) {
    playersList.innerHTML = '<p>Failed to load players.</p>';
  }
}

async function loadPlayers() {
  const playersContainer = document.getElementById('players-container');
  if (!playersContainer) return;
  
  playersContainer.innerHTML = '<p class="loading">Loading players...</p>';
  
  try {
    const players = getMockPlayers();
    
    if (players.length === 0) {
      playersContainer.innerHTML = '<p>No players added yet.</p>';
      return;
    }
    
    let html = '';
    players.forEach(player => {
      html += `
        <div class="player-card">
          <div class="player-name">${player.name}</div>
          <div class="player-info">
            ${player.email ? `
              <div class="player-info-item">
                <i class="fas fa-envelope"></i>
                <span>${player.email}</span>
              </div>
            ` : ''}
            ${player.phone ? `
              <div class="player-info-item">
                <i class="fas fa-phone"></i>
                <span>${player.phone}</span>
              </div>
            ` : ''}
          </div>
          <div class="player-actions">
            <button class="btn btn-secondary" onclick="editPlayer('${player.id}')">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger" onclick="confirmDeletePlayer('${player.id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      `;
    });
    
    playersContainer.innerHTML = html;
  } catch (error) {
    playersContainer.innerHTML = '<p>Failed to load players.</p>';
  }
}

async function loadSettings() {
  try {
    const settings = {
      general: {
        defaultPlayers: 4,
        defaultUseCart: true
      },
      scheduler: {
        enabled: false,
        cronExpression: '0 7 * * *',
        bookingDaysAhead: 7,
        preferredTeeTime: '09:00',
        teeTimeFlexibilityMinutes: 60
      },
      notifications: {
        emailNotifications: true,
        notificationEmail: 'user@example.com'
      }
    };
    
    // General settings
    if (document.getElementById('default-players')) {
      document.getElementById('default-players').value = settings.general.defaultPlayers;
    }
    if (document.getElementById('default-use-cart')) {
      document.getElementById('default-use-cart').checked = settings.general.defaultUseCart;
    }
    
    // Scheduler settings
    if (document.getElementById('scheduler-enabled')) {
      document.getElementById('scheduler-enabled').checked = settings.scheduler.enabled;
    }
    if (document.getElementById('scheduler-cron')) {
      document.getElementById('scheduler-cron').value = settings.scheduler.cronExpression;
    }
    if (document.getElementById('booking-days-ahead')) {
      document.getElementById('booking-days-ahead').value = settings.scheduler.bookingDaysAhead;
    }
    if (document.getElementById('preferred-tee-time')) {
      document.getElementById('preferred-tee-time').value = settings.scheduler.preferredTeeTime;
    }
    if (document.getElementById('tee-time-flexibility')) {
      document.getElementById('tee-time-flexibility').value = settings.scheduler.teeTimeFlexibilityMinutes;
    }
    
    // Notification settings
    if (document.getElementById('email-notifications')) {
      document.getElementById('email-notifications').checked = settings.notifications.emailNotifications;
    }
    if (document.getElementById('notification-email')) {
      document.getElementById('notification-email').value = settings.notifications.notificationEmail;
    }
  } catch (error) {
    showToast('Error', 'Failed to load settings', 'error');
  }
}

async function loadBookings() {
  const upcomingBookings = document.getElementById('upcoming-bookings');
  const pastBookings = document.getElementById('past-bookings');
  
  if (upcomingBookings) {
    upcomingBookings.innerHTML = '<p class="loading">Loading upcoming bookings...</p>';
    
    try {
      const bookings = getMockUpcomingBookings();
      
      if (bookings.length === 0) {
        upcomingBookings.innerHTML = '<p>No upcoming bookings.</p>';
      } else {
        upcomingBookings.innerHTML = renderBookingsList(bookings);
      }
    } catch (error) {
      upcomingBookings.innerHTML = '<p>Failed to load bookings.</p>';
    }
  }
  
  if (pastBookings) {
    pastBookings.innerHTML = '<p class="loading">Loading past bookings...</p>';
    
    try {
      const bookings = getMockPastBookings();
      
      if (bookings.length === 0) {
        pastBookings.innerHTML = '<p>No past bookings.</p>';
      } else {
        pastBookings.innerHTML = renderBookingsList(bookings, false);
      }
    } catch (error) {
      pastBookings.innerHTML = '<p>Failed to load bookings.</p>';
    }
  }
}

function renderBookingsList(bookings, showActions = true) {
  let html = '';
  
  bookings.forEach(booking => {
    const date = new Date(booking.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    const playersList = booking.playerNames.map(name => 
      `<span class="player-tag">${name}</span>`
    ).join('');
    
    html += `
      <div class="booking-card" data-id="${booking.id}">
        <div class="booking-header">
          <div class="booking-date-time">
            <div class="booking-time">${booking.time}</div>
            <div class="booking-date">${formattedDate}</div>
          </div>
          <div class="booking-status ${booking.status.toLowerCase()}">${booking.status}</div>
        </div>
        <div class="booking-details">
          <div class="booking-detail">
            <div class="booking-detail-label">Players:</div>
            <div>${booking.players}</div>
          </div>
          <div class="booking-detail">
            <div class="booking-detail-label">Cart:</div>
            <div>${booking.useCart ? 'Yes' : 'No'}</div>
          </div>
          <div class="booking-detail">
            <div class="booking-detail-label">Booking ID:</div>
            <div>${booking.id}</div>
          </div>
        </div>
        <div class="booking-players">
          <div class="booking-players-title">Players:</div>
          <div class="player-list">
            ${playersList}
          </div>
        </div>
        ${showActions ? `
          <div class="booking-actions">
            <button class="btn btn-danger" onclick="confirmCancelBooking('${booking.id}')">
              <i class="fas fa-times"></i> Cancel
            </button>
          </div>
        ` : ''}
      </div>
    `;
  });
  
  return html;
}

// Action Functions
async function searchTeeTimes() {
  const date = document.getElementById('search-date').value;
  const startTime = document.getElementById('search-start-time').value;
  const endTime = document.getElementById('search-end-time').value;
  const players = document.getElementById('search-players').value;
  
  const searchResults = document.getElementById('search-results');
  const placeholder = document.getElementById('search-results-placeholder');
  const loading = document.getElementById('search-results-loading');
  const empty = document.getElementById('search-results-empty');
  const error = document.getElementById('search-results-error');
  const resultsList = document.getElementById('search-results-list');
  
  // Show loading state
  placeholder.classList.add('hidden');
  loading.classList.remove('hidden');
  empty.classList.add('hidden');
  error.classList.add('hidden');
  resultsList.classList.add('hidden');
  
  try {
    // For demo purposes, we'll use mock data and add a delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const results = getMockTeeTimeResults(date, startTime, endTime, players);
    
    // Hide loading state
    loading.classList.add('hidden');
    
    if (results.length === 0) {
      // Show empty state
      empty.classList.remove('hidden');
    } else {
      // Show results
      resultsList.classList.remove('hidden');
      
      const teeTimesList = resultsList.querySelector('.tee-times-list');
      teeTimesList.innerHTML = '';
      
      results.forEach(teeTime => {
        const teeTimeCard = document.createElement('div');
        teeTimeCard.className = 'tee-time-card';
        
        const date = new Date(teeTime.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
        
        teeTimeCard.innerHTML = `
          <div class="tee-time-header">
            <div class="tee-time-time">${teeTime.time}</div>
            <div class="tee-time-spots">${teeTime.availableSpots} spots</div>
          </div>
          <div class="tee-time-date">${formattedDate}</div>
          <div class="tee-time-details">
            <div class="tee-time-detail">
              <span class="tee-time-label">Course:</span>
              <span class="tee-time-value">Cobble Hills</span>
            </div>
            <div class="tee-time-detail">
              <span class="tee-time-label">Price:</span>
              <span class="tee-time-value">$${teeTime.price.toFixed(2)}</span>
            </div>
          </div>
          <button class="btn btn-primary btn-block" onclick="openBookingModal('${teeTime.id}', '${teeTime.date}', '${teeTime.time}', ${players})">
            <i class="fas fa-golf-ball"></i> Book Now
          </button>
        `;
        
        teeTimesList.appendChild(teeTimeCard);
      });
    }
  } catch (err) {
    // Show error state
    loading.classList.add('hidden');
    error.classList.remove('hidden');
    document.getElementById('search-results-error-message').textContent = err.message || 'An error occurred while searching for tee times.';
  }
}

// Function to open the booking modal
window.openBookingModal = function(teeTimeId, date, time, players) {
  // Set booking details
  document.getElementById('booking-date').textContent = new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });
  document.getElementById('booking-time').textContent = time;
  document.getElementById('booking-players-count').textContent = players;
  document.getElementById('booking-tee-time-id').value = teeTimeId;
  
  // Reset player selection
  const playerSelects = document.querySelectorAll('.player-select');
  playerSelects.forEach((select, index) => {
    // Show/hide player selects based on number of players
    if (index < players) {
      select.parentElement.classList.remove('hidden');
      
      // Reset selection
      select.value = '';
    } else {
      select.parentElement.classList.add('hidden');
    }
  });
  
  // Reset cart option
  document.getElementById('booking-use-cart').checked = true;
  
  // Open the modal
  openModal('booking-modal');
}

// Function to view booking details
window.viewBookingDetails = function(bookingId) {
  // Find the booking
  const booking = [...getMockUpcomingBookings(), ...getMockPastBookings()]
    .find(b => b.id === bookingId);
  
  if (!booking) {
    showToast('Error', 'Booking not found', 'error');
    return;
  }
  
  // Set booking details in the modal
  document.getElementById('booking-details-date').textContent = new Date(booking.date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
  document.getElementById('booking-details-time').textContent = booking.time;
  document.getElementById('booking-details-players').textContent = booking.players;
  document.getElementById('booking-details-cart').textContent = booking.useCart ? 'Yes' : 'No';
  document.getElementById('booking-details-status').textContent = booking.status;
  document.getElementById('booking-details-id').textContent = booking.id;
  
  // Set player names
  const playersList = document.getElementById('booking-details-players-list');
  playersList.innerHTML = '';
  
  booking.playerNames.forEach(name => {
    const playerItem = document.createElement('div');
    playerItem.className = 'player-item';
    playerItem.textContent = name;
    playersList.appendChild(playerItem);
  });
  
  // Show/hide cancel button based on status
  const cancelButton = document.getElementById('booking-details-cancel');
  if (booking.status === 'Confirmed') {
    cancelButton.classList.remove('hidden');
    cancelButton.onclick = () => confirmCancelBooking(booking.id);
  } else {
    cancelButton.classList.add('hidden');
  }
  
  // Open the modal
  openModal('booking-details-modal');
}

// Function to edit player
window.editPlayer = function(playerId) {
  // Find the player
  const player = getMockPlayers().find(p => p.id === playerId);
  
  if (!player) {
    showToast('Error', 'Player not found', 'error');
    return;
  }
  
  // Set player details in the form
  document.getElementById('player-modal-title').textContent = 'Edit Player';
  document.getElementById('player-id').value = player.id;
  document.getElementById('player-name').value = player.name;
  document.getElementById('player-email').value = player.email || '';
  document.getElementById('player-phone').value = player.phone || '';
  
  // Open the modal
  openModal('player-modal');
}

// Function to confirm delete player
window.confirmDeletePlayer = function(playerId) {
  // Find the player
  const player = getMockPlayers().find(p => p.id === playerId);
  
  if (!player) {
    showToast('Error', 'Player not found', 'error');
    return;
  }
  
  // Set confirmation message
  document.getElementById('confirm-message').textContent = `Are you sure you want to delete ${player.name}?`;
  
  // Set action and ID for the confirm button
  const confirmButton = document.getElementById('confirm-action');
  confirmButton.setAttribute('data-action', 'delete-player');
  confirmButton.setAttribute('data-id', playerId);
  
  // Open the modal
  openModal('confirm-modal');
}

// Function to confirm cancel booking
window.confirmCancelBooking = function(bookingId) {
  // Find the booking
  const booking = getMockUpcomingBookings().find(b => b.id === bookingId);
  
  if (!booking) {
    showToast('Error', 'Booking not found', 'error');
    return;
  }
  
  // Set confirmation message
  document.getElementById('confirm-message').textContent = `Are you sure you want to cancel your booking for ${booking.time} on ${new Date(booking.date).toLocaleDateString()}?`;
  
  // Set action and ID for the confirm button
  const confirmButton = document.getElementById('confirm-action');
  confirmButton.setAttribute('data-action', 'cancel-booking');
  confirmButton.setAttribute('data-id', bookingId);
  
  // Open the modal
  openModal('confirm-modal');
}

// Function to save player
async function savePlayer() {
  const playerId = document.getElementById('player-id').value;
  const playerName = document.getElementById('player-name').value;
  const playerEmail = document.getElementById('player-email').value;
  const playerPhone = document.getElementById('player-phone').value;
  
  if (!playerName) {
    showToast('Error', 'Player name is required', 'error');
    return;
  }
  
  try {
    // For demo purposes, we'll just show a success message
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const isNewPlayer = !playerId;
    const actionText = isNewPlayer ? 'added' : 'updated';
    
    showToast('Success', `Player ${actionText} successfully`, 'success');
    closeAllModals();
    
    // Reload players
    loadPlayers();
    loadPlayersForDashboard();
  } catch (error) {
    showToast('Error', error.message || 'Failed to save player', 'error');
  }
}

// Function to delete player
async function deletePlayer(playerId) {
  try {
    // For demo purposes, we'll just show a success message
    await new Promise(resolve => setTimeout(resolve, 500));
    
    showToast('Success', 'Player deleted successfully', 'success');
    
    // Reload players
    loadPlayers();
    loadPlayersForDashboard();
  } catch (error) {
    showToast('Error', error.message || 'Failed to delete player', 'error');
  }
}

// Function to book tee time
async function bookTeeTime() {
  const teeTimeId = document.getElementById('booking-tee-time-id').value;
  const useCart = document.getElementById('booking-use-cart').checked;
  
  // Get selected players
  const playerSelects = document.querySelectorAll('.player-select:not(.hidden)');
  const selectedPlayers = [];
  
  playerSelects.forEach(select => {
    const value = select.value;
    if (value) {
      selectedPlayers.push(value);
    }
  });
  
  if (selectedPlayers.length === 0) {
    showToast('Error', 'Please select at least one player', 'error');
    return;
  }
  
  try {
    // For demo purposes, we'll just show a success message
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showToast('Success', 'Tee time booked successfully', 'success');
    closeAllModals();
    
    // Navigate to bookings page
    navigateToPage('bookings');
  } catch (error) {
    showToast('Error', error.message || 'Failed to book tee time', 'error');
  }
}

// Function to cancel booking
async function cancelBooking(bookingId) {
  try {
    // For demo purposes, we'll just show a success message
    await new Promise(resolve => setTimeout(resolve, 500));
    
    showToast('Success', 'Booking cancelled successfully', 'success');
    
    // Reload bookings
    loadBookings();
    loadUpcomingBookingsForDashboard();
  } catch (error) {
    showToast('Error', error.message || 'Failed to cancel booking', 'error');
  }
}

// Function to save general settings
async function saveGeneralSettings() {
  const defaultPlayers = document.getElementById('default-players').value;
  const defaultUseCart = document.getElementById('default-use-cart').checked;
  
  try {
    // For demo purposes, we'll just show a success message
    await new Promise(resolve => setTimeout(resolve, 500));
    
    showToast('Success', 'General settings saved successfully', 'success');
  } catch (error) {
    showToast('Error', error.message || 'Failed to save settings', 'error');
  }
}

// Function to save scheduler settings
async function saveSchedulerSettings() {
  const schedulerEnabled = document.getElementById('scheduler-enabled').checked;
  const schedulerCron = document.getElementById('scheduler-cron').value;
  const bookingDaysAhead = document.getElementById('booking-days-ahead').value;
  const preferredTeeTime = document.getElementById('preferred-tee-time').value;
  const teeTimeFlexibility = document.getElementById('tee-time-flexibility').value;
  
  try {
    // For demo purposes, we'll just show a success message
    await new Promise(resolve => setTimeout(resolve, 500));
    
    showToast('Success', 'Scheduler settings saved successfully', 'success');
    
    // Reload scheduler status
    loadSchedulerStatus();
  } catch (error) {
    showToast('Error', error.message || 'Failed to save settings', 'error');
  }
}

// Function to save notification settings
async function saveNotificationSettings() {
  const emailNotifications = document.getElementById('email-notifications').checked;
  const notificationEmail = document.getElementById('notification-email').value;
  
  if (emailNotifications && !notificationEmail) {
    showToast('Error', 'Email address is required for notifications', 'error');
    return;
  }
  
  try {
    // For demo purposes, we'll just show a success message
    await new Promise(resolve => setTimeout(resolve, 500));
    
    showToast('Success', 'Notification settings saved successfully', 'success');
  } catch (error) {
    showToast('Error', error.message || 'Failed to save settings', 'error');
  }
}

// Function to run scheduler
async function runScheduler() {
  try {
    // For demo purposes, we'll just show a success message
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showToast('Success', 'Scheduler run successfully', 'success');
    
    // Reload scheduler status
    loadSchedulerStatus();
  } catch (error) {
    showToast('Error', error.message || 'Failed to run scheduler', 'error');
  }
}

// Function to toggle scheduler
async function toggleScheduler() {
  try {
    // For demo purposes, we'll just show a success message
    await new Promise(resolve => setTimeout(resolve, 500));
    
    showToast('Success', 'Scheduler status updated', 'success');
    
    // Reload scheduler status
    loadSchedulerStatus();
  } catch (error) {
    showToast('Error', error.message || 'Failed to update scheduler status', 'error');
  }
}
