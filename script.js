// ==========================================
// 智慧課表與天氣提醒系統 - JavaScript
// ==========================================

// ========== 天氣相關函數 ==========
async function fetchWeather(location) {
    const weatherText = document.getElementById('weather-text');
    const remindBox = document.getElementById('remind-box');
    
    try {
        weatherText.textContent = '載入天氣中...';
        
        // 模擬天氣API - 實際應用中應連接真實API
        const weatherData = {
            '臺北市': { temp: 28, condition: '晴朗', rain: 10, reminder: '☀️ 天氣晴朗，記得帶太陽眼鏡和防曬霜' },
            '新北市': { temp: 26, condition: '多雲', rain: 20, reminder: '⛅ 多雲天氣，建議帶傘以防突然下雨' },
            '桃園市': { temp: 27, condition: '晴朗', rain: 5, reminder: '☀️ 天氣很好，適合戶外活動' },
            '臺中市': { temp: 29, condition: '晴朗', rain: 8, reminder: '☀️ 高溫天氣，多喝水避免中暑' },
            '高雄市': { temp: 30, condition: '晴朗', rain: 15, reminder: '☀️ 非常炎熱，建議穿著輕薄衣物' },
            '嘉義市': { temp: 28, condition: '多雲', rain: 25, reminder: '⛅ 可能有陣雨，建議帶傘' },
            '臺南市': { temp: 29, condition: '晴朗', rain: 12, reminder: '☀️ 晴天適合戶外課程' }
        };
        
        const data = weatherData[location] || weatherData['臺北市'];
        
        // 顯示天氣資訊
        weatherText.innerHTML = `
            <strong>${location}</strong><br>
            🌡️ 溫度: ${data.temp}°C<br>
            🌥️ 天氣: ${data.condition}<br>
            🌧️ 降雨機率: ${data.rain}%
        `;
        
        // 顯示提醒
        remindBox.textContent = data.reminder;
        
        // 保存最後選擇的地區
        localStorage.setItem('lastLocation', location);
        
    } catch (error) {
        weatherText.textContent = '❌ 無法載入天氣資訊，請稍後重試';
        console.error('天氣載入錯誤:', error);
    }
}

// ========== 課表相關函數 ==========
function saveSchedule() {
    const cells = document.querySelectorAll('.schedule-cell');
    const schedule = [];
    
    cells.forEach(cell => {
        schedule.push(cell.textContent);
    });
    
    localStorage.setItem('schedule', JSON.stringify(schedule));
    console.log('課表已保存');
}

function loadSchedule() {
    const savedSchedule = localStorage.getItem('schedule');
    
    if (savedSchedule) {
        const schedule = JSON.parse(savedSchedule);
        const cells = document.querySelectorAll('.schedule-cell');
        
        cells.forEach((cell, index) => {
            if (schedule[index]) {
                cell.textContent = schedule[index];
            }
        });
    }
}

// ========== 待辦事項相關函數 ==========
function addTodo() {
    const input = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const todoText = input.value.trim();
    
    if (todoText === '') {
        alert('請輸入待辦事項');
        return;
    }
    
    // 建立新的待辦項目
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
        <input type="checkbox">
        <span>${todoText}</span>
        <button class="delete-btn">🗑️</button>
    `;
    
    // 添加刪除功能
    li.querySelector('.delete-btn').addEventListener('click', function() {
        li.remove();
        saveTodos();
    });
    
    // 添加勾選功能
    li.querySelector('input[type="checkbox"]').addEventListener('change', function() {
        saveTodos();
    });
    
    todoList.appendChild(li);
    input.value = '';
    
    saveTodos();
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
    
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    
    if (savedTodos) {
        const todos = JSON.parse(savedTodos);
        const todoList = document.getElementById('todo-list');
        
        // 清空預設的待辦項目
        todoList.innerHTML = '';
        
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span>${todo.text}</span>
                <button class="delete-btn">🗑️</button>
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
    }
}

// ========== 事件監聽器 ==========
document.addEventListener('DOMContentLoaded', function() {
    // 初始化頁面
    const savedLocation = localStorage.getItem('lastLocation') || '臺北市';
    document.getElementById('location').value = savedLocation;
    fetchWeather(savedLocation);
    loadSchedule();
    loadTodos();
    
    // 天氣相關事件
    document.getElementById('location').addEventListener('change', function() {
        fetchWeather(this.value);
    });
    
    document.getElementById('refresh-btn').addEventListener('click', function() {
        const location = document.getElementById('location').value;
        fetchWeather(location);
    });
    
    // 課表編輯事件
    document.querySelectorAll('.schedule-cell').forEach(cell => {
        cell.addEventListener('blur', saveSchedule);
    });
    
    // 待辦事項事件
    document.getElementById('add-todo-btn').addEventListener('click', addTodo);
    document.getElementById('todo-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
});
