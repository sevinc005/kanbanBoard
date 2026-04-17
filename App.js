import React, { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [board, setBoard] = useState(() => {

  const savedData = localStorage.getItem("kanbanData");
  
  
  return savedData ? JSON.parse(savedData) : {
    GorulesiIşlər: [],
    DavamEden: [],
    bitmiş: []
  };
});
useEffect(() => {

  localStorage.setItem("kanbanData", JSON.stringify(board));
}, [board]);

  
    const [taskInput, setTaskInput] = useState("");

    const onDragStart = (e, task, fromCol) => {
    const data = JSON.stringify({ task, fromCol });
    e.dataTransfer.setData("taskData", data);
  };
    const onDragOver = (e) => {
      e.preventDefault();
  };
    const onDrop = (e, toCol) => {
    const data = e.dataTransfer.getData("taskData");
    if (!data) return;

    const { task, fromCol } = JSON.parse(data);
    if (fromCol === toCol) return;
    const updatedFromCol = board[fromCol].filter(t => t.id !== task.id);
    const updatedToCol = [...board[toCol], task];
    setBoard({
      ...board,
      [fromCol]: updatedFromCol,
      [toCol]: updatedToCol
    });
  };
    



    const addTask = () => {
    if (taskInput.trim() === "") return; 
    const newTask = {
      id: Date.now(), // Unikal ID üçün vaxtdan istifadə edirik
      text: taskInput
    };


    setBoard({
      ...board,
      GorulesiIşlər: [...board.GorulesiIşlər, newTask]
    });

    setTaskInput(""); //  inputu təmizləmk
  };
  const deleteTask = (col, id) => {
    setBoard({ ...board, [col]: board[col].filter(t => t.id !== id) });
  };

  const editTask = (col, task) => {
    const newText = prompt("Dəyişdir:", task.text);
    if (newText) {
      const updated = board[col].map(t => t.id === task.id ? { ...t, text: newText } : t);
      setBoard({ ...board, [col]: updated });
    }
  };
  

    return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#1c1e21' }}>React Kanban Board</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '10px' }}>
        <input 
          value={taskInput} 
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Yeni tapşırıq..."
          style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        <button onClick={addTask} style={{ padding: '12px 25px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Əlavə et</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '25px' }}>
        {Object.keys(board).map((columnId) => (
          <div 
            key={columnId}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, columnId)}
            style={{ 
              background: '#7DAACB', padding: '15px', width: '320px', 
              minHeight: '500px', borderRadius: '12px', border: '2px solid #ccc' 
            }}
          >
            <h3 style={{ textTransform: 'uppercase', color: '#021A54', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
              {columnId === 'GorulesiIşlər' ? 'GorulesiIşlər' : columnId === 'DavamEden' ? 'DavamEden' : 'bitmiş'}
            </h3>

            {board[columnId].map((task) => (
              <div 
                key={task.id}
                draggable // BU ÇOX VACİBDİR: Elementin sürüklənə bilməsini təmin edir
                onDragStart={(e) => onDragStart(e, task, columnId)}
                style={{ 
                  background: 'white', padding: '15px', margin: '12px 0', 
                  borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  cursor: 'grab', position: 'relative'
                }}
              >
                <div style={{ fontSize: '16px', marginBottom: '10px' }}>{task.text}</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span onClick={() => editTask(columnId, task)} style={{ cursor: 'pointer', color: '#007bff', fontSize: '12px' }}>Düzəlt</span>
                  <span onClick={() => deleteTask(columnId, task.id)} style={{ cursor: 'pointer', color: '#dc3545', fontSize: '12px' }}>Sil</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default App;