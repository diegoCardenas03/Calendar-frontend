import { createSlice } from '@reduxjs/toolkit';
import { addHours } from 'date-fns';

// const tempEvent = {
//     _id: new Date().getTime(),
//     title: 'Cumpleaños del Jefe',
//     notes: 'Hay que comprar el pastel',
//     start: new Date(), // Convertir a cadena ISO
//     end: addHours(new Date(), 2), // Convertir a cadena ISO
//     bgColor: '#fafafa',
//     user: {
//         _id: '123',
//         name: 'Fernando'
//     }
// };

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        isLoadingEvents: true,
        events: [],
        activeEvent: null
    },
    reducers: {
        onSetActiveEvent: (state, { payload }) => {
            state.activeEvent = payload;
        },
        onAddNewEvent: (state, { payload }) => {
            state.events.push(payload);
            state.activeEvent = null;
        },
        onUpdateEvent: (state, { payload }) => {
            state.events = state.events.map(event => {

                if (event.id === payload.id) {
                    return payload;
                }

                return event;
            });
        },
        onDeleteEvent: (state) => {
            if (state.activeEvent) {
                state.events = state.events.filter(event => event.id !== state.activeEvent.id);
                state.activeEvent = null;
            }
        },
        onLoadEvents: (state, { payload = [] }) => {
            state.isLoadingEvents = false,
                payload.forEach(event => {
                    const exists = state.events.some(dbEvent => dbEvent.id === event.id);
                    if (!exists) {
                        state.events.push(event);
                    }
                })
        },
        onLogoutCalendar: (state) => {
            state.isLoadingEvents = true,
            state.events = [],
            state.activeEvent = null
        }

    }
});


export const {
    onAddNewEvent,
    onDeleteEvent,
    onLoadEvents,
    onLogoutCalendar,
    onSetActiveEvent,
    onUpdateEvent,
} = calendarSlice.actions;