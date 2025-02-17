import { addHours } from "date-fns";
import { useCalendarStore, useUiStore } from "../../hooks"

export const FabAddNew = () => {

    const { openDateModal } = useUiStore();
    const { setActiveEvent } = useCalendarStore();

    const handleClickNew = () => {
        setActiveEvent({
            title: '',
            notes: '',
            start: new Date(), // Convertir a cadena ISO
            end: addHours(new Date(), 2), // Convertir a cadena ISO
            bgColor: '#fafafa',
            user: {
                _id: '123',
                name: 'Fernando'
            }
        });
        openDateModal();
    }

    return (
        <button
            className="btn btn-primary fab"
            onClick={handleClickNew}
        >
            <i className="fas fa-plus" > </i>
        </button>
    )
}
