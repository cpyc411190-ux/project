// ==========================================
// 智慧課表與天氣提醒系統 - JavaScript
// ==========================================

// ========== 全局配置 ==========
const CONFIG = {
    STORAGE_KEYS: {
        LOCATION: 'lastLocation',
        SCHEDULE: 'schedule',
        TODOS: 'todos',
        WEATHER_UPDATE: 'lastWeatherUpdate'
    },
    DEFAULT_LOCATION: '臺北市'
};

// ========== 天氣相關函數 ==========
async function fetchWeather(location) {
    const weatherText = document.getElementById('weather-text');
    const remindBox = document.getElementById('remind-box');
    
    try {
        weatherText.textContent = '載入天氣中...';
        
        // 模擬天氣API - 實際應用中應連接真實API (如: 中央氣象署開放資料)
        const weatherData = {
            '臺北市': { 
                temp: 28, 
                condition: '晴朗', 
                humidity: 65,
                windSpeed: 10,
                rain: 10, 
                reminder: '☀️ 天氣晴朗，記得帶太陽眼鏡和防曬霜' 
            },
            '新北市': { 
                temp: 26, 
                condition: '多雲', 
                humidity: 70,
                windSpeed: 12,
                rain: 20, 
                reminder: '⛅ 多雲天氣，建議帶傘以防突然下雨' 
            },
            '桃園市': { 
                temp: 27, 
                condition: '晴朗', 
                humidity: 68,
                windSpeed: 11,
                rain: 5, 
                reminder: '☀️ 天氣很好，適合戶外活動' 
            },
            '臺中市': { 
                temp: 29, 
                condition: '晴朗', 
                humidity: 60,
                windSpeed: 8,
                rain: 8, 
                reminder: '☀️ 高溫天氣，多喝水避免中暑' 
            },
            '高雄市': { 
                temp: 30, 
                condition: '晴朗', 
                humidity: 55,
                windSpeed: 9,
                rain: 15, 
                reminder: '☀️ 非常炎熱，建議穿著輕薄衣物' 
            },
            '嘉義市': { 
                temp: 28, 
                condition: '多雲', 
                humidity: 62,
                windSpeed: 10,
                rain: 25, 
                reminder: '⛅ 可能有陣雨，建議帶傘' 
            },
            '臺南市': { 
                temp: 29, 
                condition: '晴朗', 
                humidity: 58,
                windSpeed: 9,
                rain: 12, 
                reminder: '☀️ 晴天適合戶外課程' 
            }
        };
        
        const data = weatherData[location] || weatherData[CONFIG.DEFAULT_LOCATION];
        
        // 顯示天氣資訊 - 更詳細的信息
        weatherText.innerHTML = `
            <strong>📍 ${location}</strong><br>
            🌡️ 溫度: ${data.temp}°C<br>
            🌥️ 天氣: ${data.condition}<br>
            💧 濕度: ${data.humidity}%<br>
            💨 風速: ${data.windSpeed} km/h<br>
            🌧️ 降雨機率: ${data.rain}%
        `;
        
        // 智能提醒邏輯 - 根據天氣狀況提醒
        let smartReminder = data.reminder;
        
        // 溫度警告
        if (data.temp > 32) {
            smartReminder = '🔴 <strong>高溫警告</strong>: 溫度過高(' + data.temp + '°C)，避免劇烈運動，多喝水！';
        } else if (data.temp < 10) {
            smartReminder = '❄️ <strong>低溫警告</strong>: 溫度很低(' + data.temp + '°C)，記得穿暖和！';
        }
        
        // 降雨警告
        if (data.rain > 70) {
            smartReminder = '⚠️ <strong>高降雨機率</strong>: ' + data.rain + '% 降雨率，帶上雨具！課外活動要謹慎。';
        } else if (data.rain > 40) {
            smartReminder = '🌦️ <strong>中降雨機率</strong>: 可能下雨，建議攜帶雨傘。';
        }
        
        remindBox.innerHTML = smartReminder;
        
        // 保存最後選擇的地區和更新時間
        localStorage.setItem(CONFIG.STORAGE_KEYS.LOCATION, location);
        localStorage.setItem(CONFIG.STORAGE_KEYS.WEATHER_UPDATE, new Date().toLocaleString('zh-TW'));
        
        console.log('✅ 天氣已更新:', location, new Date().toLocaleTimeString('zh-TW'));
        
    } catch (error) {
        weatherText.textContent = '❌ 無法載入天氣資訊，請稍後重試';
        remindBox.textContent = '發生錯誤，請檢查網路連接';
        console.error('天氣載入錯誤:', error);
    }
}

// ========== 課表相關函數 ==========
function saveSchedule() {
    const cells = document.querySelectorAll('.schedule-cell');
    const schedule = [];
    
    cells.forEach(cell => {
        schedule.push(cell.textContent.trim());
    });
    
    localStorage.setItem(CONFIG.STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
    console.log('💾 課表已自動保存:', new Date().toLocaleTimeString('zh-TW'));
}

function loadSchedule() {
    const savedSchedule = localStorage.getItem(CONFIG.STORAGE_KEYS.SCHEDULE);
    
    if (savedSchedule) {
        try {
            const schedule = JSON.parse(savedSchedule);
            const cells = document.querySelectorAll('.schedule-cell');
            
            cells.forEach((cell, index) => {
                if (schedule[index]) {
                    cell.textContent = schedule[index];
                }
            });
            
            console.log('📚 課表已從本地載入:', schedule.length, '個課程');
        } catch (error) {
            console.error('課表載入錯誤:', error);
        }
    }
}

// ========== 待辦事項相關函數 ==========
function addTodo() {
    const input = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const todoText = input.value.trim();
    
    if (todoText === '') {
        showNotification('請輸入待辦事項');
        return;
    }
    
    // 驗證文字長度
    if (todoText.length > 100) {
        showNotification('待辦事項不能超過100個字');
        return;
    }
    
    // 建立新的待辦項目
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
        <input type="checkbox">
        <span>${escapeHtml(todoText)}</span>
        <button class="delete-btn" aria-label="刪除">🗑️</button>
    `;
    
    // 添加刪除功能
    li.querySelector('.delete-btn').addEventListener('click', function() {
        li.remove();
        saveTodos();
        console.log('🗑️ 待辦事項已刪除');
    });
    
    // 添加勾選功能
    li.querySelector('input[type="checkbox"]').addEventListener('change', function() {
        saveTodos();
        console.log('✓ 待辦事項狀態已更新');
    });
    
    todoList.appendChild(li);
    input.value = '';
    input.focus();
    
    saveTodos();
    console.log('✅ 新增待辦事項:', todoText);
}

function saveTodos() {
    const items = document.querySelectorAll('.todo-item');
    const todos = [];
    
    items.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const text = item.querySelector('span').textContent;
        todos.push({
            text: text,
            completed: checkbox.checked
        });
    });
    
    localStorage.setItem(CONFIG.STORAGE_KEYS.TODOS, JSON.stringify(todos));
    console.log('💾 待辦清單已保存:', todos.length, '項');
}

function loadTodos() {
    const savedTodos = localStorage.getItem(CONFIG.STORAGE_KEYS.TODOS);
    
    if (savedTodos) {
        try {
            const todos = JSON.parse(savedTodos);
            const todoList = document.getElementById('todo-list');
            
            // 清空預設的待辦項目
            todoList.innerHTML = '';
            
            todos.forEach(todo => {
                const li = document.createElement('li');
                li.className = 'todo-item';
                li.innerHTML = `
                    <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <span>${escapeHtml(todo.text)}</span>
                    <button class="delete-btn" aria-label="刪除">🗑️</button>
                `;
                
                li.querySelector('.delete-btn').addEventListener('click', function() {
                    li.remove();
                    saveTodos();
                });
                
                li.querySelector('input[type="checkbox"]').addEventListener('change', function() {
                    saveTodos();
                });
                
                todoList.appendChild(li);
            });
            
            console.log('📋 待辦清單已載入:', todos.length, '項');
        } catch (error) {
            console.error('待辦清單載入錯誤:', error);
        }
    }
}

// ========== 輔助函數 ==========
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showNotification(message) {
    // 簡單的通知提示 (可以替換為更美觀的通知)
    alert(message);
}

// ========== 事件監聽器初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🎓 智慧課表與天氣提醒系統', 'color: #4a90e2; font-size: 16px; font-weight: bold;');
    console.log('%c系統已就緒，所有功能可用', 'color: #50c878; font-size: 12px;');
    
    // 初始化頁面
    const savedLocation = localStorage.getItem(CONFIG.STORAGE_KEYS.LOCATION) || CONFIG.DEFAULT_LOCATION;
    const locationSelect = document.getElementById('location');
    
    if (locationSelect) {
        locationSelect.value = savedLocation;
    }
    
    // 初始化各模組
    fetchWeather(savedLocation);
    loadSchedule();
    loadTodos();
    
    // 檢查上次更新時間
    const lastUpdate = localStorage.getItem(CONFIG.STORAGE_KEYS.WEATHER_UPDATE);
    if (lastUpdate) {
        console.log('📊 上次天氣更新:', lastUpdate);
    }
    
    // ===== 天氣功能事件綁定 =====
    const locationSelector = document.getElementById('location');
    if (locationSelector) {
        locationSelector.addEventListener('change', function() {
            console.log('🔄 切換地區:', this.value);
            fetchWeather(this.value);
        });
    }
    
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const location = document.getElementById('location').value;
            console.log('🔄 手動刷新天氣...');
            fetchWeather(location);
            
            // 添加視覺反饋 - 旋轉動畫
            this.style.transform = 'rotate(360deg)';
            this.disabled = true;
            
            setTimeout(() => {
                this.style.transform = 'rotate(0deg)';
                this.disabled = false;
            }, 600);
        });
    }
    
    // ===== 課表編輯事件綁定 =====
    const scheduleCells = document.querySelectorAll('.schedule-cell');
    scheduleCells.forEach(cell => {
        // 在編輯時禁用保存，直到編輯完成
        cell.addEventListener('blur', function() {
            saveSchedule();
        });
        
        // 按 ESC 鍵取消編輯
        cell.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                cell.blur();
            }
        });
    });
    
    // ===== 待辦事項功能事件綁定 =====
    const addTodoBtn = document.getElementById('add-todo-btn');
    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', addTodo);
    }
    
    const todoInput = document.getElementById('todo-input');
    if (todoInput) {
        // Enter 鍵新增待辦
        todoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });
        
        // Ctrl+Enter 也可以新增
        todoInput.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                addTodo();
            }
        });
    }
    
    // ===== 頁面離開時警告 =====
    window.addEventListener('beforeunload', function(e) {
        // 可選：提醒用戶未保存的更改
        // 只有在編輯課表時才顯示
        const hasUnsavedChanges = false; // 可根據需要設定
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '您有未保存的更改，確定要離開嗎？';
        }
    });
    
    // ===== 快捷鍵 =====
    document.addEventListener('keydown', function(e) {
        // Ctrl+S 手動保存
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveSchedule();
            saveTodos();
            console.log('💾 手動保存所有數據');
        }
    });
});

// ========== 控制台歡迎訊息 ==========
console.log('%c✨ 功能清單', 'color: #4a90e2; font-size: 14px; font-weight: bold;');
console.log('✓ 天氣預報 - 7個城市，智能提醒');
console.log('✓ 課表管理 - 可編輯的每週課程表');
console.log('✓ 待辦清單 - 任務管理和追蹤');
console.log('✓ 本地儲存 - 所有數據自動保存到瀏覽器');
console.log('✓ 快捷鍵 - Ctrl+S 手動保存所有數據');
console.log('%c開發者友善的控制台輸出已啟用', 'color: #50c878; font-size: 11px; font-style: italic;');
