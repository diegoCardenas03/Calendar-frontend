import { configureStore } from "@reduxjs/toolkit";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { authSlice } from "../../src/store";
import { Provider } from "react-redux";
import { act, renderHook, waitFor } from "@testing-library/react";
import { initialState, notAuthenticatedState } from "../fixtures/authStates";
import { testUserCredentials } from "../fixtures/testUser";
import { calendarApi } from "../../src/api";

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
}


describe('pruebas en useAuthStore', () => {

    beforeEach(() => localStorage.clear())

    test('debe de regresar los valores por defecto', () => {

        const mockStore = getMockStore({
            ...initialState
        });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
        });

    });

    test('startLogin debe de realizar el login correctamente', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startLogin(testUserCredentials)
        })


        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {
                name: 'Test-User', uid: '66d454ff800d1448f1d45df8'
            }
        });

        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String))

    });

    test('startLogin debe de fallar la autenticacion', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startLogin({ email: 'algo@gmail.com', password: '45645618' })
        });

        const { errorMessage, status, user } = result.current;
        expect(localStorage.getItem('token')).toBeNull();
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Credenciales Incorrectas',
            status: 'not-authenticated',
            user: {}
        });

        await waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
        );

    });

    test('startRegister debe de crear un usuario', async () => {

        const newUser = { email: 'algo@gmail.com', password: '123456', name: 'Test User2' };

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: "123456789",
                name: "Test-User",
                token: "ALGUNTOKEN"
            }
        })

        await act(async () => {
            await result.current.startRegister(newUser)
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: "authenticated",
            user: { name: "Test-User", uid: "123456789" }
        });

        spy.mockRestore();

    });

    test('startRegister debe de fallar la creacion', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startRegister(testUserCredentials)
        });

        const { errorMessage, status, user } = result.current;

        console.log({ errorMessage, status, user })

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Un usuario existe con ese correo',
            status: 'not-authenticated',
            user: {}
        });



    });


    test('checkAuthToken debe de fallar si no hay token', async () => {

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.checkAuthToken()
        })

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        });

    });

    test('checkAuthToken debe de autenticar el usuario si hay un token', async () => {

        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.checkAuthToken()
        });

        const { errorMessage, status, user } = result.current;

        console.log({ errorMessage, status, user })
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test-User', uid: '66d454ff800d1448f1d45df8' }
        });

    });

})
