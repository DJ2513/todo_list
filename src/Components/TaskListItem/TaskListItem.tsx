import { useState } from "react";
import './TaskListItem.css'

export type TaskLisItemType = {
  title: string,
  description?: string
}

function TaskListItem({ title, description }: TaskLisItemType) {

  const [checked, setChecked] = useState<boolean>(false);


  const handleChecked = () => {
    setChecked(!checked);
  }

  return (
    <div className="tasklist_item">
      <div className="tasklist_item_info">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <input className="tasklist_item_checkbox" type="checkbox" checked={checked} onChange={handleChecked} />
    </div >
  )
}

export default TaskListItem