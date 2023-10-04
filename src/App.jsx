import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


const todoItems = [
  {
    id: '1',
    name: 'Beli token listrik',
    checked: true,
  },
  {
    id: '2',
    name: 'Minta ttd pak RT',
    checked: false,
  },
  {
    id: '3',
    name: 'Ambil print an',
    checked: false,
  },

  {
    id: '4',
    name: 'Nyetrika',
    checked: false,
  },
];


export default function All() {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? '' : 'light'
  
  function handleTheme() {
    setIsDark(isDark ? false : true)
    
  }

  

  return (
    <div className='entire' data-theme={theme}>
    <Background />
    <App theme={isDark} onPlay={handleTheme}/>
    </div>
  )
}

function Background() {
  return (
  <div className="background">
  <img className="bgimage"/>
  </div>
  )
}

function App({theme, onPlay}) {
  const [items, setItems] = useState(todoItems)
  const [history, setHistory] = useState(items)
  function handleAddItem(item) {
    setItems([...items, item])
    setHistory([...history, item])
  }

  // Function to update list on drop
  const handleDrop = (droppedItem) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...items];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setItems(updatedList);
    setHistory(updatedList);
  };

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id))
    setHistory((items) => items.filter((item) => item.id !== id))
  }

  function handleClearItems() {
    setItems([])
    setHistory([])
  }

  function handleToggleItem(id) {
    setItems((items) => items.map((item) => item.id === id ? {...item, checked: !item.checked} : item))
    setHistory((history) => history.map((item) => item.id === id ? {...item, checked: !item.checked} : item))
  }

  function allButton() {
    setItems(history)
  }

  function activeButton() {
    const active = history.filter((item) => !item.checked)
    setItems(active)
  }

  function completedButton() {
    const completed = history.filter((item) => item.checked)
    setItems(completed)
  }

  return (
    <div className='app'>
    <Header theme={theme} onPlay={onPlay}/>
    <Form onAddItem={handleAddItem}/>
    <List items={items} handleDrop={handleDrop} onDeleteItem={handleDeleteItem} onClearItems={handleClearItems} onCheckItem={handleToggleItem}/>
    <Actions allButton={allButton} activeButton={activeButton} completedButton={completedButton}/>
    <Footer />
    </div>
  )
}

function Header({theme, onPlay}) {
  return (
    <header>
    <h1>TODO</h1>
    <img alt="logo" className="toggle-logo" value={theme} onClick={onPlay}/>
  </header>
  ) 
}

function Form({onAddItem}) {
  const [name, setName] = useState('')
  function handleSubmit(e) {
    e.preventDefault()
    if (!name) return
    const newItem = {name, checked:false, id:String(Date.now())}
    onAddItem(newItem)
    console.log(newItem)
  

    setName('')
  }

  return (
  <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Create a new todo..." value={name} onChange={(e) => setName(e.target.value)}/>
    </form>
  )
}

function List({items, handleDrop, onDeleteItem, onClearItems, onCheckItem}) {
  const checkedItems = items.filter((item) => !item.checked).length

  return (
    <> 
      <div className="list">
      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="list-container">
          {(provided) => (
            <div
              className="list-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      className="item-container"
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      <Item item={item} key={item.id} onDeleteItem={onDeleteItem} onCheckItem={onCheckItem}/>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      
        <div className="list-actions">
          <h2>{checkedItems} items left</h2>
          <button onClick={onClearItems}>Clear Completed</button>
        </div>
      </div>
    </>
  )
}

function Item({item, onDeleteItem, onCheckItem}){
  return (
  <li key={item.id}>
            <input type="checkbox" checked={item.checked} onChange={() =>onCheckItem(item.id)}/>
            <span style={item.checked ? {textDecoration:"line-through"} : {}}>{item.name}</span>
            <button onClick={()=>onDeleteItem(item.id)}>&times;</button>
            <hr></hr>
      </li>
  )
}

function Actions({allButton, activeButton, completedButton}) {
  return (
    <div className="actions">
      <button onClick={allButton}>All</button>
      <button onClick={activeButton}>Active</button>
      <button onClick={completedButton}>Completed</button>
    </div>

  )
}

function Footer() {
  return(
    <footer className='attribution'>
      Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank" rel="noopener noreferrer">Frontend Mentor</a>. 
        Coded by <a href="https://www.facebook.com/ANT1D0t35" target="_blank" rel="noopener noreferrer">Ignatius Visnu</a>.
    </footer>
  )
}




