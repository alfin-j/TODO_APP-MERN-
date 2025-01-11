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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full bg-blue-600 p-6 text-white text-center">
        <h1 className="text-3xl font-bold">Todo Application</h1>
      </div>
      <div className="w-full max-w-3xl mt-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Add Task</h3>
          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {updatedId ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg mt-6 p-6">
          <h3 className="text-xl font-semibold mb-4">Tasks</h3>
          <ul>
            {data.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center p-2 border-b"
              >
                <div>
                  <span className="font-bold">{item.title}</span>: {item.description}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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
