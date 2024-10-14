import './Calendar.scss';
import { useState } from 'react';
import Calendar from 'react-calendar';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarComponentProps {
  darkMode: boolean; // Propiedad para el modo oscuro
}

function CalendarComponent({ darkMode }: CalendarComponentProps) {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className={`calendar ${darkMode ? 'dark-mode' : ''}`}>
      <h3>Calendar</h3>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
}

export default CalendarComponent;