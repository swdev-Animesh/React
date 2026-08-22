
import { useState, useEffect, useRef } from 'react';

export default function Dashboard() {
  // --- Timer State ---
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  // --- Todos State ---
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState('');

  // --- History State (Grouped by Date string, e.g., "2026-06-13") ---
  // Structure: { [dateStr]: { todos: [...], timers: [[...laps]] } }
  const [history, setHistory] = useState({});

  // --- Initialization & LocalStorage Sync ---
  useEffect(() => {
    const savedTimer = localStorage.getItem('dash_timer');
    const savedLaps = localStorage.getItem('dash_laps');
    const savedTodos = localStorage.getItem('dash_todos');
    const savedHistory = localStorage.getItem('dash_history');

    if (savedTimer) setTime(JSON.parse(savedTimer));
    if (savedLaps) setLaps(JSON.parse(savedLaps));
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('dash_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('dash_history', JSON.stringify(history));
  }, [history]);

  // --- Timer Logic ---
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time;
      const updateTimer = () => {
        setTime(Date.now() - startTimeRef.current);
        timerRef.current = requestAnimationFrame(updateTimer);
      };
      timerRef.current = requestAnimationFrame(updateTimer);
    } else {
      cancelAnimationFrame(timerRef.current);
    }
    return () => cancelAnimationFrame(timerRef.current);
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    // Before clearing, if there's significant time, log it to today's history
    if (time > 0) {
      logTimerToHistory();
    }
    setTime(0);
    setLaps([]);
    localStorage.removeItem('dash_timer');
    localStorage.removeItem('dash_laps');
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps([...laps, time]);
    }
  };

  const logTimerToHistory = () => {
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    setHistory((prev) => {
      const dayData = prev[today] || { todos: [], timers: [] };
      return {
        ...prev,
        [today]: {
          ...dayData,
          timers: [...dayData.timers, { duration: time, laps: [...laps] }],
        },
      };
    });
  };

  // --- Todo Logic ---
  const addTodo = (e) => {
    e.preventDefault();
    if (!todoInput.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: todoInput.trim(),
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTodoInput('');
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Archive today's current state into the history log manually
  const archiveToday = () => {
    if (todos.length === 0 && time === 0) return;

    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    setHistory((prev) => {
      const dayData = prev[today] || { todos: [], timers: [] };
      // Avoid duplicating todos already archived
      const uniqueTodos = [
        ...dayData.todos,
        ...todos.filter((t) => !dayData.todos.some((dt) => dt.id === t.id)),
      ];
      
      const updatedTimers = time > 0 
        ? [...dayData.timers, { duration: time, laps: [...laps] }]
        : dayData.timers;

      return {
        ...prev,
        [today]: {
          todos: uniqueTodos,
          timers: updatedTimers,
        },
      };
    });

    // Clear current dashboard view
    setTodos([]);
    setTime(0);
    setLaps([]);
    setIsRunning(false);
  };

  // --- Helper Formatting ---
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* ================= TIMER SECTION ================= */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 text-center">
          <h2 className="text-sm font-semibold text-emerald-400 tracking-wider uppercase mb-2">Focus Timer</h2>
          <div className="text-6xl font-mono font-bold tracking-tight text-white mb-6 select-none">
            {formatTime(time)}
          </div>
          
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={handleStartPause}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                isRunning 
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-900'
              }`}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={handleLap}
              disabled={!isRunning}
              className="px-6 py-2.5 rounded-xl font-medium bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Lap
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl font-medium bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-all"
            >
              Reset / Log
            </button>
          </div>

          {/* Laps Display */}
          {laps.length > 0 && (
            <div className="mt-4 max-h-32 overflow-y-auto border-t border-slate-700 pt-3 text-left font-mono text-sm text-slate-400 division-y division-slate-700">
              {laps.map((lapTime, index) => (
                <div key={index} className="flex justify-between py-1 px-2 hover:bg-slate-700/50 rounded">
                  <span>Lap {index + 1}</span>
                  <span>{formatTime(lapTime)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= TODAY'S TODO SECTION ================= */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold tracking-tight text-white">Today's Focus</h2>
            { (todos.length > 0 || time > 0) && (
              <button 
                onClick={archiveToday}
                className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                Archive Day to History
              </button>
            )}
          </div>

          {/* Add Todo Form */}
          <form onSubmit={addTodo} className="flex gap-2 mb-6">
            <input
              type="text"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              placeholder="What needs handling today?"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
            >
              Add Task
            </button>
          </form>

          {/* Todo List */}
          {todos.length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-4">No tasks added for today yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between bg-slate-900/60 border border-slate-700/50 rounded-xl p-3.5 group transition-all"
                >
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleTodo(todo.id)}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      readOnly
                      className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500 focus:ring-offset-slate-900"
                    />
                    <span className={`text-sm ${todo.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ================= HISTORY LOG SECTION ================= */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
          <h2 className="text-xl font-bold tracking-tight text-white mb-4">Historical Archive</h2>
          
          {Object.keys(history).length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-4">No logged history found.</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(history).reverse().map(([dateStr, dayData]) => (
                <div key={dateStr} className="border-l-2 border-slate-700 pl-4 space-y-3">
                  <h3 className="text-sm font-semibold text-slate-400">{dateStr}</h3>
                  
                  {/* Archived Todos */}
                  {dayData.todos && dayData.todos.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-xs uppercase tracking-wider text-slate-500 font-medium">Tasks</h4>
                      <ul className="text-sm space-y-1">
                        {dayData.todos.map((todo) => (
                          <li key={todo.id} className="flex items-center gap-2 text-slate-300">
                            <span className={todo.completed ? "text-emerald-500" : "text-amber-500"}>
                              {todo.completed ? '✓' : '⚬'}
                            </span>
                            <span className={todo.completed ? "line-through text-slate-500" : ""}>
                              {todo.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Archived Timers */}
                  {dayData.timers && dayData.timers.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-xs uppercase tracking-wider text-slate-500 font-medium">Timer Sessions</h4>
                      <div className="flex flex-wrap gap-2">
                        {dayData.timers.map((timer, tIdx) => (
                          <div key={tIdx} className="bg-slate-900 border border-slate-700/60 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300">
                            <span>Session: {formatTime(timer.duration)}</span>
                            {timer.laps && timer.laps.length > 0 && (
                              <span className="text-slate-500 block text-[10px]">({timer.laps.length} laps logged)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

