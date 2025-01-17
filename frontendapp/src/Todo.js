import React, { useEffect, useState } from 'react';

function Todo() {
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [data, setData] = useState([]);
  const apiUrl = 'http://localhost:5002';
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [updatedId, setUpdatedId] = useState(null);

  const handleSubmit = () => {
    if (title.trim() !== '' && description.trim() !== '') {
      if (updatedId) {
        fetch(apiUrl + '/todo/' + updatedId, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description }),
        }).then(() => {
          const updatedData = data.map((item) =>
            item._id === updatedId ? { ...item, title, description } : item
          );
          setData(updatedData);
          setMessage('Item updated successfully');
          setTitle('');
          setDescription('');
          setUpdatedId(null);
        });
      } else {
        fetch(apiUrl + '/todo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description }),
        }).then((res) => {
          if (res.ok) {
            setData([...data, { title, description }]);
            setMessage('Item added successfully');
            setTitle('');
            setDescription('');
            setUpdatedId(null);
          } else {
            setError('Error');
          }
        });
      }
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + '/todo')
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      });
  };

  const handleDelete = (id) => {
    fetch(apiUrl + '/todo/' + id, {
      method: 'DELETE',
    }).then(() => {
      setData(data.filter((item) => item._id !== id));
      setMessage('Item deleted successfully');
      setError('');
    });
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setUpdatedId(item._id);
  };

  return (
<div className="min-h-screen bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 flex flex-col items-center">
  <div className="w-full bg-white shadow-lg p-6 text-center rounded-b-3xl">
    <h1 className="text-4xl font-extrabold text-blue-600">Todo Application</h1>
  </div>

  <div className="w-full max-w-4xl mt-10">
    {/* Add Task Section */}
    <div className="bg-white shadow-xl rounded-2xl p-8">
      <h3 className="text-2xl font-bold mb-4 text-gray-700">Add a New Task</h3>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700"
        >
          {updatedId ? "Update Task" : "Add Task"}
        </button>
      </div>
    </div>

    {/* Task List Section */}
    <div className="bg-white shadow-xl rounded-2xl mt-10 p-8">
      <h3 className="text-2xl font-bold mb-4 text-gray-700">Task List</h3>
      <ul className="space-y-4">
        {data.map((item) => (
          <li
            key={item._id}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100"
          >
            <div>
              <span className="font-semibold text-gray-800">
                {item.title}
              </span>
              <p className="text-gray-600">{item.description}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleEdit(item)}
                className="px-4 py-2 bg-yellow-400 text-white font-semibold rounded-lg hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

  );
}

export default Todo;
