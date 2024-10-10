import { Button, Input, Modal } from 'antd'
import React, { useReducer, useState } from 'react'

const TYPES = {
  create: "CREATE",
  liked: "LIKED",
  delete: "DELETE",
  edit: "EDIT",
  save: "SAVE"
}

function reducer(state, action) {
  switch (action.type) {
    case TYPES.create:
      return {
        ...state,
        todos: [...state.todos, action.payload]
      }
    case TYPES.liked:
      if (state.likedList.includes(action.payload)) {
        return {
          ...state,
          likedList: state.likedList.filter(item => item.id !== action.payload.id)
        }
      }
      return {
        ...state,
        likedList: [...state.likedList, action.payload]
      }
    case TYPES.delete:
      return {
        ...state,
        todos: state.todos.filter(item => item.id !== action.payload),
        likedList: state.likedList.filter(item => item.id !== action.payload),
        savedList: state.savedList.filter(item => item.id !== action.payload)
      }
    case TYPES.edit:
      return {
        ...state,
        todos: state.todos.map(item => item.id === action.payload.id ? { ...item, value: action.payload.value } : item)
      }
    case TYPES.save:
      if (state.savedList.includes(action.payload)) {
        return {
          ...state,
          savedList: state.savedList.filter(item => item.id !== action.payload.id)
        }
      }
      return {
        ...state,
        savedList: [...state.savedList, action.payload]
      }
    default:
      return state
  }
}

const initialState = {
  todos: [],
  likedList: [],
  savedList: []
}

function Todos() {
  const [data, dispatch] = useReducer(reducer, initialState)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [currentEditTodo, setCurrentEditTodo] = useState(null)
  const [view, setView] = useState('all') 

  const handleSubmit = (e) => {
    e.preventDefault()
    const newValue = {
      id: Date.now(),
      value: e.target.todo.value
    }
    dispatch({ type: TYPES.create, payload: newValue })
    e.target.reset()
  }

  const handleDelete = (id) => {
    setDeleteModalVisible(true)
    setCurrentEditTodo(id)
  }

  const confirmDelete = () => {
    dispatch({ type: TYPES.delete, payload: currentEditTodo })
    setDeleteModalVisible(false)
  }

  const handleEdit = (todo) => {
    setEditModalVisible(true)
    setCurrentEditTodo(todo)
  }

  const confirmEdit = (newValue) => {
    dispatch({ type: TYPES.edit, payload: { id: currentEditTodo.id, value: newValue } })
    setEditModalVisible(false)
  }

  const filteredTodos = data.todos.filter(item => {
    if (view === 'liked') return data.likedList.includes(item)
    if (view === 'saved') return data.savedList.includes(item)
    return true
  })

  return (
    <div className='bg-[#333333] mx-auto w-[580px] mt-[70px] rounded-md pb-10'>
      <h2 className='text-white font-bold text-[22px] text-center pb-[12px] pt-[12px]'>My Todos</h2>
      <form onSubmit={handleSubmit} className=' w-[500px] flex items-center justify-between mx-auto bg-[#444444] p-5 rounded' autoComplete='off'>
        <Input name='todo' className='w-[74%]' placeholder='Add Todo' size='large' allowClear required/>
        <Button htmlType='submit' type='primary' size='large'>Add Todos</Button>
      </form>

      <div className="flex justify-center gap-7 p-5">
        <Button className='w-[75px]' onClick={() => setView('all')}>All</Button>
        <Button className='w-[75px]' onClick={() => setView('liked')}>Liked</Button>
        <Button className='w-[75px]' onClick={() => setView('saved')}>Saved</Button>
      </div>

      <ul className='w-[500px] mx-auto bg-red p-5 rounded mt-5 bg-[#444444]'>
        {filteredTodos.map((item, index) => (
          <li className='p-3 rounded-md flex items-center justify-between bg-slate-400 mt-3' key={item.id}>
            <div>{index + 1}.{item.value}</div>
            <div className='flex items-center gap-5'>
              <i
                onClick={() => dispatch({ type: TYPES.liked, payload: item })}
                className={`text-[18px] fa-regular fa-heart cursor-pointer ${data.likedList.includes(item) ? 'text-red-700' : ''}`}
              ></i>
              <i
                onClick={() => handleDelete(item.id)}
                className="text-[18px] fa-solid fa-trash cursor-pointer text-red-900"
              ></i>
              <i
                onClick={() => handleEdit(item)}
                className="text-[18px] fa-solid fa-pen cursor-pointer text-green-900"
              ></i>
              <i
                onClick={() => dispatch({ type: TYPES.save, payload: item })}
                className={`text-[18px] fa-regular fa-bookmark cursor-pointer ${data.savedList.includes(item) ? 'text-blue-700' : ''}`}
              ></i>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        centered
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <p>Are you sure you want to delete this Todo?</p>
      </Modal>
      <Modal
        centered
        title="Edit Todo List"
        visible={isEditModalVisible}
        onOk={() => confirmEdit(document.getElementById('editInput').value)}
        onCancel={() => setEditModalVisible(false)}
      >
        <Input id='editInput' defaultValue={currentEditTodo?.value} />
      </Modal>
    </div>
  )
}

export default Todos
