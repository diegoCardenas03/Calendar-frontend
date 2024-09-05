export const events = [
    {
        id: '1',
        start: new Date('2022-10-21 13:00:00'),
        end: new Date('2022-10-21 15:00:00'),
        title: 'Cumpleaños de Dieguito',
        notes: 'Alguna nota'
    }
    ,
    {
        id: '2',
        start: new Date('2022-11-09 13:00:00'),
        end: new Date('2022-11-09 15:00:00'),
        title: 'Cumpleaños de Pedrito',
        notes: 'Alguna nota de Pedrito'
    }
];

export const initialState = {
    isLoadingEvents: true,
    events : [],
    activeEvent: null
}

export const calendarWithEventsState = {
    isLoadingEvents: true,
    events : [ ...events ],
    activeEvent: null
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events : [ ...events ],
    activeEvent: {...events[0]}
}