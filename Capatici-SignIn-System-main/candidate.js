const currentTimeEl = document.getElementById('current-time');
const signInReminderEl = document.getElementById('sign-in-reminder');
const statusIconEl = document.getElementById('status-icon');
const statusTitleEl = document.getElementById('status-title');
const statusDescriptionEl = document.getElementById('status-description');
const statusTimeContainerEl = document.getElementById('status-time-container');
const lateReasonFormEl = document.getElementById('late-reason-form');
const lateReasonInputEl = document.getElementById('late-reason');
const submitReasonBtnEl = document.getElementById('submit-reason-btn');
const signInBtnEl = document.getElementById('sign-in-btn');
const viewHistoryBtnEl = document.getElementById('view-history-btn');
const attendanceHistoryEl = document.getElementById('attendance-history');
const historyTableBodyEl = document.getElementById('history-table-body');
const downloadBtnEl = document.getElementById('download-btn');

// State variables
let hasSignedIn = false;
let isLate = false;
let showHistory = false;
let lateReason = "";
let showReasonForm = false;
let showSignInReminder = false;

// Initial attendance history
let attendanceHistory = [
  { date: "2025-05-13", time: "-", status: "Absent", reason: "-" },
  { date: "2025-05-12", time: "09:20 AM", status: "Late", reason: "Taxi Strike" },
  { date: "2025-05-09", time: "08:20 AM", status: "Present", reason: "-" }
];

// Update current time
function updateCurrentTime() {
  const now = new Date();
  currentTimeEl.textContent = now.toLocaleString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });
  
  // Check if sign-in reminder should be shown
  if (!hasSignedIn && (now.getHours() < 9 || (now.getHours() === 9 && now.getMinutes() < 15))) {
    signInReminderEl.classList.remove('hidden');
    showSignInReminder = true;
  } else {
    signInReminderEl.classList.add('hidden');
    showSignInReminder = false;
  }
}

// Sign in function
function handleSignIn() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = now.toISOString().split('T')[0];
  
  let status = "Present";
  if (hour > 9 || (hour === 9 && minute >= 15)) {
    status = "Late";
    isLate = true;
    showReasonForm = true;
    lateReasonFormEl.classList.remove('hidden');
  }
  
  const newAttendance = {
    date: formattedDate,
    time: formattedTime,
    status: status,
    reason: status === "Late" ? "No reason submitted" : "-"
  };
  
  attendanceHistory.unshift(newAttendance);
  hasSignedIn = true;
  
  // Update UI
  updateAttendanceStatus();
  updateHistoryTable();
  
  // Show toast notification
  showToast(
    `Signed in as ${status}`, 
    status === "Present" 
      ? "You have successfully signed in for today" 
      : "Please provide a reason for being late",
    status === "Present" ? "success" : "warning"
  );
  
  // Hide sign in button
  signInBtnEl.classList.add('hidden');
}

// Submit late reason
function submitReason() {
  if (!lateReasonInputEl.value.trim()) {
    showToast("Error", "Please enter a reason before submitting.", "error");
    return;
  }
  
  lateReason = lateReasonInputEl.value.trim();
  attendanceHistory[0].reason = lateReason;
  
  // Update UI
  updateHistoryTable();
  lateReasonFormEl.classList.add('hidden');
  showReasonForm = false;
  
  showToast("Success", "Reason submitted successfully", "success");
}

// Toggle attendance history
function toggleHistory() {
  showHistory = !showHistory;
  
  if (showHistory) {
    attendanceHistoryEl.classList.remove('hidden');
    viewHistoryBtnEl.textContent = "Hide History";
    viewHistoryBtnEl.classList.remove('secondary-button');
    viewHistoryBtnEl.classList.add('primary-button');
    updateHistoryTable();
  } else {
    attendanceHistoryEl.classList.add('hidden');
    viewHistoryBtnEl.textContent = "View History";
    viewHistoryBtnEl.classList.add('secondary-button');
    viewHistoryBtnEl.classList.remove('primary-button');
  }
}

// Update attendance status UI
function updateAttendanceStatus() {
  if (hasSignedIn) {
    if (isLate) {
      statusIconEl.textContent = "⚠️";
      statusIconEl.className = "status-icon late";
      statusTitleEl.textContent = "Late";
      statusDescriptionEl.textContent = "You have successfully signed in for today";
    } else {
      statusIconEl.textContent = "✓";
      statusIconEl.className = "status-icon present";
      statusTitleEl.textContent = "Present";
      statusDescriptionEl.textContent = "You have successfully signed in for today";
    }
    
    // Hide sign in reminder if signed in
    signInReminderEl.classList.add('hidden');
  } else {
    statusIconEl.textContent = "✕";
    statusIconEl.className = "status-icon not-signed-in";
    statusTitleEl.textContent = "Not Signed In";
    statusDescriptionEl.textContent = "You have not signed in for today yet";
  }
  
  // Update time badge
  if (showSignInReminder) {
    statusTimeContainerEl.innerHTML = `
      <span class="time-badge">Sign-in closes at 9:15 AM</span>
    `;
  } else {
    statusTimeContainerEl.innerHTML = '';
  }
}

// Update history table
function updateHistoryTable() {
  historyTableBodyEl.innerHTML = '';
  
  attendanceHistory.forEach(entry => {
    const row = document.createElement('tr');
    
    const dateCell = document.createElement('td');
    dateCell.textContent = entry.date;
    row.appendChild(dateCell);
    
    const timeCell = document.createElement('td');
    timeCell.textContent = entry.time;
    row.appendChild(timeCell);
    
    const statusCell = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.textContent = entry.status;
    statusBadge.className = `status-badge status-${entry.status.toLowerCase()}`;
    statusCell.appendChild(statusBadge);
    row.appendChild(statusCell);
    
    const reasonCell = document.createElement('td');
    reasonCell.textContent = entry.reason;
    row.appendChild(reasonCell);
    
    historyTableBodyEl.appendChild(row);
  });
}

// Download history as CSV
function downloadHistory() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Date,Time,Status,Reason\n";
  
  attendanceHistory.forEach(item => {
    let row = `${item.date},${item.time},${item.status},"${item.reason}"`;
    csvContent += row + "\n";
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "attendance_history.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Simple toast notification
function showToast(title, message, type = "info") {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.backgroundColor = 'white';
  toast.style.padding = '1rem';
  toast.style.borderRadius = '0.375rem';
  toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
  toast.style.maxWidth = '320px';
  toast.style.zIndex = '50';
  
  // Border colors based on type
  if (type === 'success') {
    toast.style.borderLeft = '4px solid #10b981';
  } else if (type === 'error') {
    toast.style.borderLeft = '4px solid #ef4444';
  } else if (type === 'warning') {
    toast.style.borderLeft = '4px solid #f59e0b';
  } else {
    toast.style.borderLeft = '4px solid #3b82f6';
  }
  
  toast.innerHTML = `
    <h4 style="font-weight: 600; margin-bottom: 0.25rem;">${title}</h4>
    <p style="font-size: 0.875rem; color: #64748b;">${message}</p>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
}

// Initialize app
function init() {
  // Set up event listeners
  signInBtnEl.addEventListener('click', handleSignIn);
  viewHistoryBtnEl.addEventListener('click', toggleHistory);
  submitReasonBtnEl.addEventListener('click', submitReason);
  downloadBtnEl.addEventListener('click', downloadHistory);
  
  // Initial UI updates
  updateCurrentTime();
  updateAttendanceStatus();
  
  // Update time every second
  setInterval(updateCurrentTime, 1000);
}

// Start the app
document.addEventListener('DOMContentLoaded', init);

// Setup attendance reminder notification
setTimeout(() => {
  const now = new Date();
  if (!hasSignedIn && (now.getHours() >= 9 && now.getMinutes() >= 10)) {
    showToast("Attendance Reminder", "⏰ You haven't signed in yet. Please sign in.", "warning");
  }
}, 10000);