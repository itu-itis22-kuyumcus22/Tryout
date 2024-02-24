import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function MyForm({formStyle = {backgroundColor: "lightblue", padding: "20px", height: "70px", borderRadius:"30px", border: "3px solid black"}, labelStyle = {margin: "10px"}, inputStyle = {borderRadius: "5px"}}) {
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');
  const [department, setDepartment] = useState('');
  const [objarr, setObjarr] = useState([]);
  const [counter, setCounter] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [buttonAction, setButtonAction] = useState('Sort by name');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchLastId();
  }, []);

  async function handleReset() {
    if(objarr.length > 0) {
      window.alert("Please delete all employees before resetting the id!");
      return;
    }
    updateLastId({id: 1, lastId: 0});
    setCounter(1);
  }

  async function fetchLastId() {
    try {
      const response = await fetch('http://localhost:5107/api/lastId', { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Response data: ", data);
      console.log("lastId value: ", data[0].lastId);
      setCounter(data[0].lastId + 1);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function updateLastId(data) {
    try {
      const response = await fetch('http://localhost:5107/api/lastId/' + 1, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const text = await response.text();
        if (text.length > 0) {
          const resData = JSON.parse(text);
          console.log(resData);
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function fetchData() {
    try {
      const response = await fetch('http://localhost:5107/api/Employee', { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setObjarr(data);
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function postData(data) {
    try {
      const response = await fetch('http://localhost:5107/api/Employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const resData = await response.json();
      console.log(resData);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function putData(data) {
    try {
      const response = await fetch('http://localhost:5107/api/Employee/' + data.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const text = await response.text();
        if (text.length > 0) {
          const resData = JSON.parse(text);
          console.log(resData);
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function deleteData(data) {
    try {
      const response = await fetch('http://localhost:5107/api/Employee/' + data.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        if (response.headers.get('content-length') > 0) {
          const resData = await response.json();
          console.log(resData);
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    catch (error) {
      console.error('Error:', error);
    }
  }

  const sortByNum = (a, b, prop) => {
    return a[prop] - b[prop];
  };

  function sortByAlph(a, b, prop) {
    const propA = String(a[prop]).toLowerCase();
    const propB = String(b[prop]).toLowerCase();
  
    return propA.localeCompare(propB);
  }
  const handleSort = () => {
    switch (buttonAction) {
      case 'Sort by name':
        setObjarr([...objarr].sort((a, b) => sortByAlph(a, b, 'name')));
        setButtonAction('Sort by salary(ascending)');
        break;
      case 'Sort by salary(ascending)':
        setObjarr([...objarr].sort((a, b) => sortByNum(a, b, 'salary')));
        setButtonAction('Sort by salary(descending)');
        break;
      case "Sort by salary(descending)":
        setObjarr([...objarr].sort((a, b) => sortByNum(a, b, 'salary')).reverse());
        setButtonAction('Sort by department');
        break;
      case 'Sort by department':
        setObjarr([...objarr].sort((a, b) => sortByAlph(a, b, 'department')));
        setButtonAction('Sort by id');
        break;
      case 'Sort by id':
        setObjarr([...objarr].sort((a, b) => sortByNum(a, b, 'id')));
        setButtonAction('Sort by name');
        break;
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleDelete = (index) => {
    deleteData({id: objarr[index].id, name: objarr[index].name, salary: objarr[index].salary, department: objarr[index].department});
    setObjarr(objarr.filter((_, i) => i !== index));
  }

  const handleSave = () => {
    setObjarr(objarr.map((obj, index) => {
      if (index === editingIndex) {
        const updatedObj = {...obj, name: name, salary: salary, department: department};
        putData(updatedObj);
        return updatedObj;
      }
      return obj;
    }));
    setEditingIndex(null);
    closeModal();
  };

  const handleSubmit = event => {
    event.preventDefault();
    setObjarr([...objarr, {id: counter, name: name, salary: salary, department: department}]);
    setCounter(counter + 1);
    postData({id: counter, name: name, salary: salary, department: department});
    updateLastId({id: 1, lastId: counter});
  };

  return (
    <>
    <form style={formStyle} onSubmit={handleSubmit}>
      <label style={labelStyle}>
        Name:
        <input maxLength={20} style={inputStyle} type="text" value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label style={labelStyle}>
        Salary:
        <input maxLength={10} style={inputStyle} type="number" value={salary} onChange={e => {
          if (e.target.value.length <= 10) {
            setSalary(e.target.value);
          }
        }}/>
      </label>
      <label style={labelStyle}>
        Department:
        <input maxLength={20} style={inputStyle}type="text" value={department} onChange={e => setDepartment(e.target.value)} />
      </label>
      <input style={{borderRadius: "5px", height: "40px", width: "200px", marginTop: "15px", marginLeft: "50px"}} type="submit" value="Add Employee!" />
      <button type="button" style={{backgroundColor: "lightgreen", color:"black", borderRadius: "5px", height: "40px", width: "160px", marginTop: "15px", marginLeft: "60px"}} onClick={handleSort}>{buttonAction}</button>
      <button type="button" style={{backgroundColor: "lightgreen", color:"black", borderRadius: "5px", height: "40px", width: "160px", marginTop: "15px", marginLeft: "60px"}} onClick={handleReset}>Reset id</button>
    </form>
    <div>
      <ul>
        {objarr.map((obj, index) => (
          <div style={{display: "flex", backgroundColor: "lightgreen", margin: "10px", width: "600px", borderRadius: "5px", border:"2px solid darkblue"}}>
            <li style={{padding: "20px", margin: "3px",backgroundColor: "lightgreen"}}key={obj.id}>id:{obj.id}, Name: {obj.name}, Salary: {obj.salary}, Department: {obj.department}</li>
            <button style={{backgroundColor: "gray", color:"black", borderRadius: "5px", height: "40px", width: "80px", marginTop: "15px", marginRight: "20px"}} onClick={() => {
              openModal(); 
              setEditingIndex(index);
              }}>Edit</button>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={{overlay: {backgroundColor: 'rgba(0, 0, 0, 0.25)'},content: {position: 'absolute',top: '50%',left: '50%',right: 'auto',bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '700px', height: '250px', backgroundColor: "lightcyan"}}}>
              <h2>Edit Employee!</h2>
              <form onSubmit={handleSubmit}>
                <label style={{margin: "8px"}}>
                  Name:
                  <input style={{borderRadius: "5px"}} maxLength={20} type="text" value={name} onChange={e => setName(e.target.value)} />
                </label>
                <label style={{margin: "8px"}}>
                  Salary:
                  <input style={{borderRadius: "5px"}} maxLength={10} type="number" value={salary} onChange={e => {
                    if (e.target.value.length <= 10) {
                      setSalary(e.target.value);
                    }
                  }} />
                </label>
                <label style={{margin: "8px"}}>
                  Department:
                  <input style={{borderRadius: "5px"}} maxLength={20} type="text" value={department} onChange={e => setDepartment(e.target.value)} />
                </label>
              </form>
              <button style={{ borderRadius: "5px", height: "30px", width: "130px", marginTop: "15px", marginLeft: "170px" }} onClick={() => {
                handleSave();
                closeModal();
              }}>Save</button>
              <button style={{ borderRadius: "5px", height: "30px", width: "130px", marginTop: "15px", marginLeft: "20px" }} onClick={closeModal}>Close</button>
            </Modal>
            <button style={{backgroundColor: "red", color:"black", borderRadius: "5px", height: "40px", width: "80px", marginTop: "15px", marginRight: "20px"}} onClick={() => handleDelete(index)}>Delete</button>
          </div>
        ))}
      </ul>
    </div>
    </>
  );
}

export default MyForm;